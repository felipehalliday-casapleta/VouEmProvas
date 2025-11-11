import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ArquivoCard } from "@/components/arquivo-card"
import { SearchBar } from "@/components/search-bar"
import { EmptyState } from "@/components/empty-state"
import { Gamepad2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Arquivo } from "@shared/schema"

export default function MiniGamesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  
  const { data: allArquivos = [], isLoading } = useQuery<Arquivo[]>({
    queryKey: ['/api', 'arquivos'],
  })

  const games = allArquivos.filter(arquivo => arquivo.tipo === 'MiniGame')

  const filteredGames = games.filter(game =>
    game.nome.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            data-testid="input-search"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-40" data-testid={`skeleton-game-${i}`} />
            ))}
          </div>
        ) : filteredGames.length === 0 ? (
          <EmptyState
            icon={Gamepad2}
            title="Nenhum minigame encontrado"
            description={searchQuery
              ? "Não há minigames correspondentes à sua busca."
              : "Não há minigames disponíveis no momento."}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGames.map((game) => (
              <ArquivoCard
                key={game.id}
                id={game.id}
                nome={game.nome}
                tipo={game.tipo}
                viewUrl={game.viewUrl}
                viewCount={game.viewCount}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
