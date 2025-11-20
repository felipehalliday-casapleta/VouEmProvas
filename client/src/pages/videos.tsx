import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { SearchBar } from "@/components/search-bar"
import { EmptyState } from "@/components/empty-state"
import { Video } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Arquivo, Evento } from "@shared/schema"

// Função para extrair ID do YouTube
function extractYoutubeId(url: string) {
  try {
    const parsed = new URL(url)

    // Links tipo ?v=ID
    const v = parsed.searchParams.get("v")
    if (v) return v

    // Links tipo youtu.be/ID
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1)
    }

    return null
  } catch {
    return null
  }
}

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const {
    data: allArquivos = [],
    isLoading: isLoadingArquivos,
  } = useQuery<Arquivo[]>({
    queryKey: ["/api", "arquivos"],
  })

  const {
    data: eventos = [],
    isLoading: isLoadingEventos,
  } = useQuery<Evento[]>({
    queryKey: ["/api", "eventos"],
  })

  const isLoading = isLoadingArquivos || isLoadingEventos

  // Filtrar vídeos (ajuste aqui conforme seu schema real)
  const videos = allArquivos.filter(arquivo => {
    // Se o schema já normaliza tipo como "Video"
    if (arquivo.tipo === "Video") return true

    const tipoDoc = (arquivo as any).tipoDocumento?.toLowerCase?.() || ""
    return tipoDoc.includes("vídeo") || tipoDoc.includes("video")
  })

    // Filtro de busca pelo nome da prova OU nome do arquivo
  const filteredVideos = videos.filter(video => {
    const evento = eventos.find(e => e.id === (video as any).eventoId)
    const titulo =
      evento?.nome ||
      video.nome ||
      ""
    return titulo.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // Ordenar do mais recente para o mais antigo, baseado na data do evento
  const orderedVideos = filteredVideos.sort((a, b) => {
    const eventoA = eventos.find(e => e.id === (a as any).eventoId)
    const eventoB = eventos.find(e => e.id === (b as any).eventoId)

    return (eventoB?.dataISO ?? "").localeCompare(eventoA?.dataISO ?? "")
  })


  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Vídeos</h1>
          <p className="text-muted-foreground">Resumos em vídeo disponíveis</p>
        </div>

        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar vídeos..."
            data-testid="input-search"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Skeleton
                key={i}
                className="h-40"
                data-testid={`skeleton-video-${i}`}
              />
            ))}
          </div>
        ) : filteredVideos.length === 0 ? (
          <EmptyState
            icon={Video}
            title="Nenhum vídeo encontrado"
            description={
              searchQuery
                ? "Não há vídeos correspondentes à sua busca."
                : "Não há vídeos disponíveis no momento."
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {orderedVideos.map(video => {
              const evento = eventos.find(e => e.id === (video as any).eventoId)
              const titulo =
                evento?.nome ||
                video.nome ||
                "Vídeo sem nome"

              const tipoDoc =
                (video as any).tipoDocumento || video.tipo || "Vídeo"

              const id = extractYoutubeId(video.viewUrl)
              const thumbnail = id
                ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
                : null

              return (
                <div
                  key={video.id}
                  className="border rounded-lg overflow-hidden bg-card cursor-pointer hover:shadow-lg transition"
                  onClick={() => window.open(video.viewUrl, "_blank")}
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={titulo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground p-4 text-center text-sm">
                        Sem thumbnail
                      </div>
                    )}
                  </div>

                  {/* Nome da prova + info */}
                  <div className="p-4">
                    <h3 className="font-medium text-base truncate">
                      {titulo}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {tipoDoc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
