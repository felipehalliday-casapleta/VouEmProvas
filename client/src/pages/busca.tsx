import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { EventCard } from "@/components/event-card"
import { ArquivoCard } from "@/components/arquivo-card"
import { SearchBar } from "@/components/search-bar"
import { EmptyState } from "@/components/empty-state"
import { Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import type { Evento, Arquivo } from "@shared/schema"

export default function BuscaPage() {
  const [searchQuery, setSearchQuery] = useState("")
  
  const { data: eventos = [], isLoading: isLoadingEventos } = useQuery<Evento[]>({
    queryKey: searchQuery ? [`/api/eventos?query=${encodeURIComponent(searchQuery)}`] : ['/api', 'eventos'],
    enabled: !!searchQuery,
  })

  const { data: arquivos = [], isLoading: isLoadingArquivos } = useQuery<Arquivo[]>({
    queryKey: ['/api', 'arquivos'],
    enabled: !!searchQuery,
  })

  const filteredArquivos = arquivos.filter(arquivo =>
    arquivo.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    arquivo.tipo.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isLoading = isLoadingEventos || isLoadingArquivos

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Busca Global</h1>
          <p className="text-muted-foreground">Pesquise eventos e arquivos</p>
        </div>

        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar por nome, tipo ou documento..."
            data-testid="input-search"
          />
        </div>

        {!searchQuery ? (
          <EmptyState
            icon={Search}
            title="Digite para buscar"
            description="Use a barra de busca acima para encontrar eventos e arquivos."
          />
        ) : isLoading ? (
          <Tabs defaultValue="eventos" className="w-full">
            <TabsList>
              <TabsTrigger value="eventos" data-testid="tab-eventos">
                Eventos
              </TabsTrigger>
              <TabsTrigger value="arquivos" data-testid="tab-arquivos">
                Arquivos
              </TabsTrigger>
            </TabsList>
            <TabsContent value="eventos" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-48" data-testid={`skeleton-event-${i}`} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="arquivos" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-40" data-testid={`skeleton-arquivo-${i}`} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <Tabs defaultValue="eventos" className="w-full">
            <TabsList>
              <TabsTrigger value="eventos" data-testid="tab-eventos">
                Eventos ({eventos.length})
              </TabsTrigger>
              <TabsTrigger value="arquivos" data-testid="tab-arquivos">
                Arquivos ({filteredArquivos.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="eventos" className="mt-6">
              {eventos.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="Nenhum evento encontrado"
                  description="Tente buscar com outros termos."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {eventos.map((event) => (
                    <EventCard
                      key={event.id}
                      eventId={event.id}
                      nome={event.nome}
                      tipo={event.tipo}
                      data={event.data}
                      local={event.local}
                      status={event.status}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="arquivos" className="mt-6">
              {filteredArquivos.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="Nenhum arquivo encontrado"
                  description="Tente buscar com outros termos."
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredArquivos.map((arquivo) => (
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
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
