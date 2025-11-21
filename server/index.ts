import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

process.env.TZ = "America/Sao_Paulo";

const app = express();

/* ------------------------------------------------------
   CONTENT SECURITY POLICY (CSP) — versão 100% funcional
   Compatível com:
   - Google Identity Services (FedCM)
   - Cloudflare proxy + insights
   - React/Vite bundle
------------------------------------------------------ */
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    [
      // Domínios base permitidos
      "default-src 'self' https://vep.casapletafilmes.com.br",

      // APIs permitidas: backend + Google
      "connect-src 'self' https://vep.casapletafilmes.com.br https://accounts.google.com https://www.google.com https://www.gstatic.com https://apis.google.com",

      // Scripts necessários
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' " +
        "https://accounts.google.com " +
        "https://www.gstatic.com " +
        "https://apis.google.com " +
        "https://www.google.com " +
        "https://static.cloudflareinsights.com",

      // Estilos e fontes
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",

      // Imagens
      "img-src 'self' data: https:",

      // Iframes autorizados (Google login)
      "frame-src https://accounts.google.com https://www.google.com",

      // Ações de formulário
      "form-action 'self' https://accounts.google.com",

      "base-uri 'self'",
      "object-src 'none'"
    ].join("; ")
  );
  next();
});

/* ------------------------------------------------------
   RAW BODY SUPPORT (Google signature verification)
------------------------------------------------------ */
declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(cookieParser());
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  })
);
app.use(express.urlencoded({ extended: false }));

/* ------------------------------------------------------
   API LOGGING
------------------------------------------------------ */
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

/* ------------------------------------------------------
   SERVER INIT
------------------------------------------------------ */
(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Vite (dev) / Static (prod)
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Cloud Run exige PORT
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
