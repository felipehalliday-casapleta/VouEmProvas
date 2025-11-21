/* global google */
import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";

export default function LoginPage() {
  const { login } = useAuth();
  const btnRef = useRef<HTMLDivElement | null>(null);
  const initialized = useRef(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    /// 1) Carrega o script do Google manualmente
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // 2) Inicializa GSI apenas quando o script estiver pronto
      const g = (window as any).google?.accounts?.id;
      if (!g) return;

      g.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (res: any) => {
          await login(res.credential);
          window.location.href = "/hoje";
        },
      });

      // 3) Renderiza o botão somente depois do script carregar
      if (btnRef.current) {
        g.renderButton(btnRef.current, {
          theme: "outline",
          size: "large",
          width: 300,
        });
      }
    };

    document.head.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black px-4">
      <div className="w-full max-w-md bg-zinc-950/80 border border-zinc-800 rounded-2xl p-8 shadow-xl backdrop-blur">

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          VOU EM PROVAS
        </h1>

        <p className="text-zinc-400 text-center text-sm mb-8">
          Faça login com sua conta Google para continuar.
        </p>

        <div ref={btnRef} className="flex justify-center" />

        <footer className="mt-6 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} Casapleta Filmes
        </footer>
      </div>
    </div>
  );
}
