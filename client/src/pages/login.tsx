/* global google */
import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const btnRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const g = (window as any).google?.accounts?.id;
    if (!g) return;
    g.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (res: any) => login(res.credential),
    });
    if (btnRef.current) {
      g.renderButton(btnRef.current, { theme: "outline", size: "large" });
    }
  }, [login]);

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div>
        <h1 style={{ marginBottom: 16, textAlign: "center" }}>Entrar</h1>
        <div ref={btnRef} />
      </div>
    </div>
  );
}
