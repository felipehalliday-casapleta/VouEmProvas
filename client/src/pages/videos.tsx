import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ArquivoCard } from "@/components/arquivo-card"
import { SearchBar } from "@/components/search-bar"
import { EmptyState } from "@/components/empty-state"
import { Video } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Arquivo } from "@shared/schema"

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  
  const { data: allArquivos = [], isLoading } = useQuery<Arquivo[]>({
    queryKey: ['/api', 'arquivos'],
  })

  const videos = allArquivos.filter(arquivo => arquivo.tipo === 'Video')

  const filteredVideos = videos.filter(video =>
    video.nome.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
              <Skeleton key={i} className="h-40" data-testid={`skeleton-video-${i}`} />
            ))}
          </div>
        ) : filteredVideos.length === 0 ? (
          <EmptyState
            icon={Video}
            title="Nenhum vídeo encontrado"
            description={searchQuery 
              ? "Não há vídeos correspondentes à sua busca."
              : "Não há vídeos disponíveis no momento."}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((video) => (
              <ArquivoCard
                key={video.id}
                id={video.id}
                nome={video.nome}
                tipo={video.tipo}
                viewUrl={video.viewUrl}
                viewCount={video.viewCount}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
