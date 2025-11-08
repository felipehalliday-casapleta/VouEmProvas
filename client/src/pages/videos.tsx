import { useState } from "react"
import { ArquivoCard } from "@/components/arquivo-card"
import { SearchBar } from "@/components/search-bar"
import { EmptyState } from "@/components/empty-state"
import { Video } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  
  // TODO: Remove mock data - replace with actual API call
  const mockVideos = [
    {
      fileId: "vid-001",
      tipoDocumento: "Resumo Em Video",
      versao: "1.0",
      viewCount: 156,
      eventName: "ENEM 2024 - Matemática"
    },
    {
      fileId: "vid-002",
      tipoDocumento: "Resumo Em Video",
      versao: "2.1",
      viewCount: 89,
      eventName: "Vestibular FUVEST - Física"
    },
    {
      fileId: "vid-003",
      tipoDocumento: "Resumo Em Video",
      versao: "1.5",
      viewCount: 234,
      eventName: "OAB - Direito Civil"
    }
  ]

  const filteredVideos = mockVideos.filter(video =>
    video.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleVisualize = (fileId: string) => {
    // TODO: Remove mock functionality - implement actual API call
    console.log('Visualizar video:', fileId)
    toast({
      title: "Abrindo vídeo",
      description: "O vídeo será aberto em uma nova aba.",
    })
  }

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
          />
        </div>

        {filteredVideos.length === 0 ? (
          <EmptyState
            icon={Video}
            title="Nenhum vídeo encontrado"
            description="Não há vídeos correspondentes à sua busca."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((video) => (
              <ArquivoCard
                key={video.fileId}
                {...video}
                onVisualize={() => handleVisualize(video.fileId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
