import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Calendar, MapPin, FileText, Image as ImageIcon, Tag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArquivoCard } from "@/components/arquivo-card";
import { PhotoGrid, type Photo } from "@/components/photo-grid";
import { EmptyState } from "@/components/empty-state";
import type { Evento, Arquivo, Foto } from "@shared/schema";

type EventoDetail = {
  evento: Evento;
  arquivos: Arquivo[];
  fotos: Foto[];
};

export default function EventoDetailPage() {
  const [, navigate] = useLocation();

  function handleBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/hoje");
    }
  }

  const [, params] = useRoute("/evento/:id");
  const id = params?.id || "";
  const { user } = useAuth();
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery<EventoDetail>({
    queryKey: ["/api/eventos", id],
    enabled: !!id,
  });

  const statusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      await apiRequest("PATCH", `/api/eventos/${id}/status`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/eventos", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/eventos"] });
      toast({
        title: "Status atualizado",
        description: "O status do evento foi atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30";
      case "Pendente":
        return "bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30";
      case "Recusado":
        return "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30";
      case "Em Andamento":
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30";
    }
  };

  const canEditStatus = user?.role === "admin" || user?.role === "editor";
  const canViewStats = user?.role === "admin";


  if (isLoading) {
    return (
      <main className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <Skeleton className="h-10 w-24 mb-4" />
          <Skeleton className="h-8 w-96 mb-2" />
          <Skeleton className="h-6 w-64" />
        </div>
        <Skeleton className="h-64 w-full" />
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="p-6 max-w-5xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6"
          data-testid="button-back"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <EmptyState
          icon={FileText}
          title="Evento não encontrado"
          description="O evento que você procura não existe ou foi removido."
        />
      </main>
    );
  }

  const { evento, arquivos, fotos } = data;
  const nomeCompleto = evento.versaoDescritivo
    ? `${evento.nome} v${evento.versaoDescritivo}`
    : evento.nome;

  const photos: Photo[] = fotos.map((foto) => ({
    fotoId: foto.id,
    imagem: foto.url,
    descricao: foto.caption,
    credito: foto.credito,
    ordem: parseInt(foto.ordem || "0", 10),
  }));

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        data-testid="button-back"
        onClick={handleBack}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-evento-nome">
            {nomeCompleto}
          </h1>
          <div className="flex flex-wrap gap-2 items-center">
            {evento.tipo && (
              <Badge variant="secondary" data-testid={`badge-tipo-${evento.tipo}`}>
                {evento.tipo}
              </Badge>
            )}
            {evento.genero && (
              <Badge variant="outline" data-testid={`badge-genero-${evento.genero}`}>
                {evento.genero}
              </Badge>
            )}
          </div>
        </div>

        <Card>
            <CardContent className="space-y-4 pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {evento.data && (
                <div className="flex items-start gap-3" data-testid="info-data">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Grava</p>
                    <p className="text-sm text-muted-foreground">{evento.data}</p>
                  </div>
                </div>
              )}

              {evento.dataExibicao && (
                <div className="flex items-start gap-3" data-testid="info-data-exibicao">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Exibe</p>
                    <p className="text-sm text-muted-foreground">{evento.dataExibicao}</p>
                  </div>
                </div>
              )}

              {evento.local && (
                <div className="flex items-start gap-3" data-testid="info-local">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Local</p>
                    <p className="text-sm text-muted-foreground">{evento.local}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3" data-testid="info-status">
                <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">Status</p>
                  {canEditStatus ? (
                    <Select
                      value={evento.status || "Em Andamento"}
                      onValueChange={(value) => statusMutation.mutate(value)}
                      disabled={statusMutation.isPending}
                    >
                      <SelectTrigger
                        className={`w-full ${getStatusColor(evento.status)}`}
                        data-testid="select-status"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                        <SelectItem value="Aprovado">Aprovado</SelectItem>
                        <SelectItem value="Recusado">Recusado</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getStatusColor(evento.status)} data-testid="badge-status">
                      {evento.status || "Em Andamento"}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {evento.anotacoesDaCriacao && (
              <>
                <Separator />
                <div data-testid="info-anotacoes">
                  <p className="text-sm font-medium mb-2">Anotações da Criação</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {evento.anotacoesDaCriacao}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {arquivos.length > 0 && (
          <Card>
            <CardContent className="pt-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {arquivos.map((arquivo) => (
                  <ArquivoCard
                    key={arquivo.id}
                    id={arquivo.id}
                    nome={arquivo.nome || arquivo.tipo || "Arquivo"}
                    tipo={arquivo.tipo}
                    viewUrl={arquivo.viewUrl}
                    viewCount={arquivo.viewCount}
                    canViewStats={canViewStats}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {fotos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Fotos
              </CardTitle>
              <CardDescription>
                {fotos.length} {fotos.length === 1 ? "foto" : "fotos"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PhotoGrid photos={photos} />
            </CardContent>
          </Card>
        )}

        {arquivos.length === 0 && fotos.length === 0 && (
          <EmptyState
            icon={FileText}
            title="Nenhum arquivo ou foto"
            description="Este evento ainda não possui arquivos ou fotos anexados."
          />
        )}
      </div>
    </main>
  );
}