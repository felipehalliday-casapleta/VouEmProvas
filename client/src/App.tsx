import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import { NavHeader } from "@/components/nav-header";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import HojePage from "@/pages/hoje";
import AntesPage from "@/pages/antes";
import DepoisPage from "@/pages/depois";
import VideosPage from "@/pages/videos";
import MiniGamesPage from "@/pages/minigames";
import EventoDetailPage from "@/pages/evento-detail";
import StatusPage from "@/pages/status";
import BuscaPage from "@/pages/busca";

function Router() {
  return (
    <Switch>
      {/* login público */}
      <Route path="/login" component={LoginPage} />

      {/* redireciona somente a raiz "/" para /hoje */}
      <Route path="/">
        <Redirect to="/hoje" />
      </Route>

      {/* envolve todo o app autenticado para qualquer caminho (exceto /login) */}
      <Route path="/:rest*">
        <ProtectedRoute>
          <NavHeader />
          <Switch>
            <Route path="/hoje" component={HojePage} />
            <Route path="/antes" component={AntesPage} />
            <Route path="/depois" component={DepoisPage} />
            <Route path="/videos" component={VideosPage} />
            <Route path="/minigames" component={MiniGamesPage} />
            <Route path="/evento/:id" component={EventoDetailPage} />
            <Route path="/status" component={StatusPage} />
            <Route path="/busca" component={BuscaPage} />
            <Route component={NotFound} />
          </Switch>
        </ProtectedRoute>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;