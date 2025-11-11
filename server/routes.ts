import type { Express } from "express";
import { createServer, type Server } from "http";
import { verifyGoogleToken, getUserRole, createJWT, requireAuth, requireRole } from "./auth";
import * as sheetsService from "./sheets";

const ENABLE_AUTOMATION = process.env.ENABLE_AUTOMATION === 'true';

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.post("/api/auth/google", async (req, res) => {
    try {
      const { idToken } = req.body;
      
      if (!idToken) {
        return res.status(400).json({ error: 'ID token is required' });
      }
      
      const { email, name } = await verifyGoogleToken(idToken);
      const role = getUserRole(email);
      
      const token = createJWT({ email, name, role });
      
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      
      res.json({
        email,
        name,
        role,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message || 'Authentication failed' });
    }
  });
  
  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie('auth_token');
    res.json({ success: true });
  });
  
  app.get("/api/auth/me", requireAuth, (req, res) => {
    res.json(req.user);
  });
  
  app.get("/api/eventos", requireAuth, async (req, res) => {
    try {
      const { when, query } = req.query;
      const whenFilter = when as 'hoje' | 'antes' | 'depois' | undefined;
      const queryStr = query as string | undefined;
      
      const eventos = await sheetsService.getEventos(whenFilter, queryStr);
      res.json(eventos);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch eventos' });
    }
  });
  
  app.get("/api/eventos/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const result = await sheetsService.getEventoById(id);
      
      if (!result) {
        return res.status(404).json({ error: 'Evento not found' });
      }
      
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch evento' });
    }
  });
  
  app.get("/api/arquivos", requireAuth, async (req, res) => {
    try {
      const arquivos = await sheetsService.getArquivos();
      res.json(arquivos);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch arquivos' });
    }
  });
  
  app.post("/api/arquivos/:id/view", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const userEmail = req.user!.email;
      
      await sheetsService.incrementViewCount(id, userEmail);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to record view' });
    }
  });
  
  app.get("/api/health", async (req, res) => {
    try {
      const testData = await sheetsService.getEventos();
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        sheetsConnection: 'ok',
        eventosCount: testData.length,
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        sheetsConnection: 'failed',
        error: error.message,
      });
    }
  });

  app.get("/api/status", requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const statusData = await sheetsService.getStatusData();
      res.json(statusData);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch status data' });
    }
  });
  
  if (ENABLE_AUTOMATION) {
  }

  const httpServer = createServer(app);

  return httpServer;
}
