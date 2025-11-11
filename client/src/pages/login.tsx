import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    google: any;
  }
}

export default function Login() {
  const [, setLocation] = useLocation();
  const { user, login } = useAuth();
  const { toast } = useToast();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (user) {
      setLocation('/hoje');
    }
  }, [user, setLocation]);

  useEffect(() => {
    if (isInitialized.current) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (!window.google || !googleButtonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        {
          theme: 'filled_black',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: 300,
        }
      );

      isInitialized.current = true;
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      await login(response.credential);
      setLocation('/hoje');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao fazer login',
        description: error.message || 'Não foi possível autenticar. Verifique se seu email tem permissão.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto h-16 w-16 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-2xl">VP</span>
          </div>
          <CardTitle className="text-2xl">VOU EM PROVAS</CardTitle>
          <CardDescription>
            Faça login com sua conta Google para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div ref={googleButtonRef} data-testid="google-signin-button" />
          <p className="text-xs text-muted-foreground text-center">
            Apenas emails autorizados podem acessar o sistema
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
