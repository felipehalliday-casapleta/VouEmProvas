import { useState } from "react"
import { ArquivoCard } from "@/components/arquivo-card"
import { SearchBar } from "@/components/search-bar"
import { EmptyState } from "@/components/empty-state"
import { Gamepad2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MiniGamesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  
  // TODO: Remove mock data - replace with actual API call
  const mockGames = [
    {
      fileId: "game-001",
      tipoDocumento: "MiniGame",
      versao: "1.0",
      viewCount: 412,
      eventName: "ENEM 2024 - Quiz Interativo"
    },
    {
      fileId: "game-002",
      tipoDocumento: "MiniGame",
      versao: "2.0",
      viewCount: 287,
      eventName: "Vestibular - Jogo de Perguntas"
    },
    {
      fileId: "game-003",
      tipoDocumento: "MiniGame",
      versao: "1.3",
      viewCount: 195,
      eventName: "OAB - Simulador de Provas"
    }
  ]

  const filteredGames = mockGames.filter(game =>
    game.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleVisualize = (fileId: string) => {
    // TODO: Remove mock functionality - implement actual API call
    console.log('Visualizar game:', fileId)
    toast({
      title: "Abrindo minigame",
      description: "O minigame será aberto em uma nova aba.",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">MiniGames</h1>
          <p className="text-muted-foreground">Jogos educativos e interativos</p>
        </div>

        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar minigames..."
          />
        </div>

        {filteredGames.length === 0 ? (
          <EmptyState
            icon={Gamepad2}
            title="Nenhum minigame encontrado"
            description="Não há minigames correspondentes à sua busca."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGames.map((game) => (
              <ArquivoCard
                key={game.fileId}
                {...game}
                onVisualize={() => handleVisualize(game.fileId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
