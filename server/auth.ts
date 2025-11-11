import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import type { AuthUser, UserRole } from '@shared/schema';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const ROLE_MAP_STR = process.env.ROLE_MAP || '{}';

if (!GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID environment variable is required');
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

let ROLE_MAP: Record<string, UserRole>;
try {
  ROLE_MAP = JSON.parse(ROLE_MAP_STR);
} catch (error) {
  console.error('Failed to parse ROLE_MAP:', error);
  ROLE_MAP = {};
}

export interface JWTPayload {
  email: string;
  name?: string;
  role: UserRole;
}

export async function verifyGoogleToken(idToken: string): Promise<{ email: string; name?: string }> {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error('Invalid token payload');
    }
    
    return {
      email: payload.email,
      name: payload.name,
    };
  } catch (error) {
    throw new Error('Invalid Google ID token');
  }
}

export function getUserRole(email: string): UserRole {
  return ROLE_MAP[email] || 'viewer';
}

export function createJWT(user: JWTPayload): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJWT(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.auth_token;
    
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
  } catch (error) {
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
