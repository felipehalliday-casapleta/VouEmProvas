import type { Express } from "express";
import { createServer, type Server } from "http";
import {
  verifyGoogleToken,
  getUserRole,
  buildAuthCookie,
  requireAuth,
  requireRole,
} from "./auth";
import * as sheetsService from "./sheets";

const ENABLE_AUTOMATION = process.env.ENABLE_AUTOMATION === "true";

export async function registerRoutes(app: Express): Promise<Server> {
  // --- Auth: Google Sign-In -> JWT cookie ---
  app.post("/api/auth/google", async (req, res) => {
    try {
      const { idToken } = req.body || {};
      if (!idToken) return res.status(400).json({ error: "Missing idToken" });

      const { email, name } = await verifyGoogleToken(idToken);
      const role = getUserRole(email);

      const { token, cookieOptions } = buildAuthCookie({ email, name, role });
      res.cookie("auth_token", token, cookieOptions);

      return res.json({ email, name, role });
    } catch (e: any) {
      return res
        .status(401)
        .json({ error: e?.message || "Authentication failed" });
    }
  });

  app.post("/api/auth/logout", (_req, res) => {
    // limpa o cookie no path raiz
    res.clearCookie("auth_token", { path: "/" });
    return res.json({ ok: true });
  });

  app.get("/api/auth/me", requireAuth, (req, res) => {
    return res.json(req.user);
  });

  // --- Eventos ---
  app.get("/api/eventos", requireAuth, async (req, res) => {
    try {
      const { when, query } = req.query;
      const whenFilter = when as "hoje" | "antes" | "depois" | undefined;
      const queryStr = (query as string) || undefined;

      const eventos = await sheetsService.getEventos(whenFilter, queryStr);
      return res.json(eventos);
    } catch (e: any) {
      return res
        .status(500)
        .json({ error: e?.message || "Failed to fetch eventos" });
    }
  });

  app.get("/api/eventos/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const result = await sheetsService.getEventoById(id);
      if (!result) return res.status(404).json({ error: "Evento not found" });
      return res.json(result);
    } catch (e: any) {
      return res
        .status(500)
        .json({ error: e?.message || "Failed to fetch evento" });
    }
  });

  app.patch("/api/eventos/:id/status", requireAuth, requireRole("admin", "editor"), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) return res.status(400).json({ error: "Missing status" });
    
    const validStatuses = [
      "Em Andamento",
      "Elaborando Proposta",
      "Em Análise (Diretoria de Provas)",
      "Aceito (Diretoria de Provas)",
      "De Acordo (Diretor Geral)",
      "Aguardando Feedback (Cliente)",
      "Aprovado",
      "Recusado",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    
    await sheetsService.updateEventoStatus(id, status);
    return res.json({ success: true });
  } catch (e: any) {
    return res
      .status(500)
      .json({ error: e?.message || "Failed to update status" });
  }
});

  // --- Arquivos ---
  app.get("/api/arquivos", requireAuth, async (_req, res) => {
    try {
      const arquivos = await sheetsService.getArquivos();
      return res.json(arquivos);
    } catch (e: any) {
      return res
        .status(500)
        .json({ error: e?.message || "Failed to fetch arquivos" });
    }
  });

  app.post("/api/arquivos/:id/view", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const userEmail = req.user!.email;
      await sheetsService.incrementViewCount(id, userEmail);
      return res.json({ success: true });
    } catch (e: any) {
      return res
        .status(500)
        .json({ error: e?.message || "Failed to record view" });
    }
  });

  // --- Health (sem auth) ---
  app.get("/api/health", async (_req, res) => {
    try {
      const testData = await sheetsService.getEventos();
      return res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        sheetsConnection: "ok",
        eventosCount: testData.length,
      });
    } catch (e: any) {
      return res.status(500).json({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        sheetsConnection: "failed",
        error: e?.message || "unknown",
      });
    }
  });

  // --- Status admin ---
  app.get("/api/status", requireAuth, requireRole("admin"), async (_req, res) => {
    try {
      const statusData = await sheetsService.getStatusData();
      return res.json(statusData);
    } catch (e: any) {
      return res
        .status(500)
        .json({ error: e?.message || "Failed to fetch status data" });
    }
  });

  if (ENABLE_AUTOMATION) {
    // futuras rotas/cron/queues aqui
  }

  const httpServer = createServer(app);
  return httpServer;
}
