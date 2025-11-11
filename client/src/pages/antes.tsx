import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { EventCard } from "@/components/event-card"
import { SearchBar } from "@/components/search-bar"
import { FilterChips } from "@/components/filter-chips"
import { EmptyState } from "@/components/empty-state"
import { ChevronLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Evento } from "@shared/schema"

export default function AntesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  
  const { data: eventos = [], isLoading } = useQuery<Evento[]>({
    queryKey: ['/api/eventos?when=antes'],
  })

  const allTipos = Array.from(new Set(eventos.map(e => e.tipo).filter(Boolean)))

  const filteredEvents = eventos.filter(event => {
    const matchesSearch = event.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.descricao?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilters.length === 0 || (event.tipo && selectedFilters.includes(event.tipo))
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Antes</h1>
          <p className="text-muted-foreground">Eventos anteriores a hoje</p>
        </div>

        <div className="space-y-6 mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar eventos anteriores..."
            data-testid="input-search"
          />
          
          {allTipos.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-3">Filtrar por tipo:</p>
              <FilterChips
                options={allTipos}
                selected={selectedFilters}
                onChange={setSelectedFilters}
              />
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-48" data-testid={`skeleton-event-${i}`} />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            icon={ChevronLeft}
            title="Nenhum evento encontrado"
            description={searchQuery || selectedFilters.length > 0
              ? "Tente ajustar seus filtros de busca"
              : "Não há eventos anteriores correspondentes aos filtros."}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
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
      </div>
    </div>
  )
}
