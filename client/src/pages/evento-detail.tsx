import { useRoute } from "wouter"
import { useQuery } from "@tanstack/react-query"
import { ArquivoCard } from "@/components/arquivo-card"
import { PhotoGrid, type Photo } from "@/components/photo-grid"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, Calendar, MapPin, FileText } from "lucide-react"
import type { Evento, Arquivo, Foto } from "@shared/schema"

export default function EventoDetailPage() {
  const [, params] = useRoute("/evento/:id")
  
  const { data, isLoading } = useQuery<{ evento: Evento; arquivos: Arquivo[]; fotos: Foto[] }>({
    queryKey: params?.id ? ['/api', 'eventos', params.id] : [],
    enabled: !!params?.id,
  })

  const photos: Photo[] = data?.fotos.map(foto => ({
    fotoId: foto.id,
    imagem: foto.url,
    descricao: foto.caption,
    ordem: 1,
  })) || []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-32 mb-6" />
          <Skeleton className="h-64 mb-12" />
          <Skeleton className="h-48" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => window.history.back()}
            data-testid="button-back"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Evento não encontrado</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const { evento, arquivos } = data

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => window.history.back()}
          data-testid="button-back"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card className="mb-12">
          <CardHeader>
            <div className="flex items-start justify-between gap-4 mb-4">
              <CardTitle className="text-2xl">{evento.nome}</CardTitle>
              {evento.status && (
                <Badge variant="secondary" data-testid="badge-status">{evento.status}</Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {evento.tipo && (
                <Badge variant="default" data-testid="badge-tipo">{evento.tipo}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Data:</span>
                <span data-testid="text-data">{evento.data}</span>
              </div>
              {evento.local && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Local:</span>
                  <span data-testid="text-local">{evento.local}</span>
                </div>
              )}
            </div>
            {evento.descricao && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="text-sm font-medium mb-1">Descrição:</p>
                <p className="text-sm text-muted-foreground" data-testid="text-descricao">{evento.descricao}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Arquivos</h2>
          {arquivos.length === 0 ? (
            <p className="text-muted-foreground text-sm" data-testid="text-no-arquivos">
              Nenhum arquivo disponível.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {arquivos.map((arquivo) => (
                <ArquivoCard
                  key={arquivo.id}
                  id={arquivo.id}
                  nome={arquivo.nome}
                  tipo={arquivo.tipo}
                  viewUrl={arquivo.viewUrl}
                  viewCount={arquivo.viewCount}
                />
              ))}
            </div>
          )}
        </div>

        {photos.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6">Fotos</h2>
            <PhotoGrid photos={photos} />
          </div>
        )}
      </div>
    </div>
  )
}
