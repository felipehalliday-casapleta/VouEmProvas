import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import type { AuthUser, UserRole } from '@shared/schema';

const RAW_CLIENT_IDS =
  (process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '').trim();

// Permite múltiplos Client IDs separados por vírgula (opcional)
const CLIENT_IDS: string[] = RAW_CLIENT_IDS
  ? RAW_CLIENT_IDS.split(',').map(s => s.trim()).filter(Boolean)
  : [];

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production';
const ROLE_MAP_STR = process.env.ROLE_MAP || '{}';

let client: OAuth2Client | null = null;

function ensureClientIds() {
  if (!CLIENT_IDS.length) {
    throw new Error(
      'Missing Google Client ID. Set GOOGLE_CLIENT_ID (or VITE_GOOGLE_CLIENT_ID) env.'
    );
  }
}

function getGoogleClient(): OAuth2Client {
  ensureClientIds();
  if (!client) client = new OAuth2Client(CLIENT_IDS[0]); // qualquer um serve para construir
  return client;
}

// ------- ROLE MAP (case-insensitive + wildcard '*') -------
let ROLE_MAP_RAW: Record<string, string>;
try {
  ROLE_MAP_RAW = JSON.parse(ROLE_MAP_STR);
} catch (error) {
  console.error('Failed to parse ROLE_MAP:', error);
  ROLE_MAP_RAW = {};
}

// normaliza para lowercase
const ROLE_MAP: Record<string, UserRole> = Object.fromEntries(
  Object.entries(ROLE_MAP_RAW).map(([k, v]) => [k.toLowerCase(), v as UserRole])
);

function resolveRole(email: string): UserRole {
  const e = (email || '').toLowerCase();
  return (ROLE_MAP[e] as UserRole) ?? (ROLE_MAP['*'] as UserRole) ?? 'viewer';
}

// ------- JWT payload -------
export interface JWTPayload {
  email: string;
  name?: string;
  role: UserRole;
}

// ------- Google Token verify -------
export async function verifyGoogleToken(
  idToken: string
): Promise<{ email: string; name?: string }> {
  try {
    const googleClient = getGoogleClient();
    // valida contra 1..N client IDs
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: CLIENT_IDS, // aceita array
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error('Invalid token payload');
    }

    return { email: payload.email, name: payload.name };
  } catch (error) {
    throw new Error('Invalid Google ID token');
  }
}

// ------- Role getter (mantém compat) -------
export function getUserRole(email: string): UserRole {
  return resolveRole(email);
}

// ------- JWT helpers -------
export function createJWT(user: JWTPayload): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJWT(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    throw new Error('Invalid or expired token');
  }
}

// ------- Express typings -------
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// ------- Middlewares -------
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.auth_token;
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const payload = verifyJWT(token);
    req.user = {
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid authentication token' });
  }
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// ------- Utilitário opcional para emitir cookie JWT (use na rota /api/auth/google) -------
export function buildAuthCookie(user: JWTPayload) {
  const token = createJWT(user);
  // Em dev, Secure pode falhar em http; em replit.dev é https, então mantenha Secure.
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    path: '/',
  };
  return { token, cookieOptions };
}
