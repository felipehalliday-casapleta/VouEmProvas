import { useState } from "react"
import { EventCard } from "@/components/event-card"
import { SearchBar } from "@/components/search-bar"
import { FilterChips } from "@/components/filter-chips"
import { EmptyState } from "@/components/empty-state"
import { ChevronLeft } from "lucide-react"

export default function AntesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  
  // TODO: Remove mock data - replace with actual API call
  const mockEvents = [
    {
      eventId: "evt-101",
      nome: "ENEM 2023 - Segundo Dia",
      tipo: "ENEM",
      genero: "Educação",
      data: "12/11/2023",
      local: "Todo Brasil"
    },
    {
      eventId: "evt-102",
      nome: "Vestibular FUVEST 2024 - 1ª Fase",
      tipo: "Vestibular",
      genero: "Educação",
      data: "26/11/2023",
      local: "São Paulo, SP"
    },
    {
      eventId: "evt-103",
      nome: "Concurso TJ-SP - Prova Discursiva",
      tipo: "Concurso",
      genero: "Jurídico",
      data: "05/10/2023",
      local: "São Paulo, SP"
    },
    {
      eventId: "evt-104",
      nome: "OAB XXXVIII - 2ª Fase",
      tipo: "OAB",
      genero: "Direito",
      data: "15/09/2023",
      local: "Nacional"
    }
  ]

  const allTipos = Array.from(new Set(mockEvents.map(e => e.tipo)))

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.nome.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilters.length === 0 || selectedFilters.includes(event.tipo)
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

        {filteredEvents.length === 0 ? (
          <EmptyState
            icon={ChevronLeft}
            title="Nenhum evento encontrado"
            description="Não há eventos anteriores correspondentes aos filtros."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.eventId} {...event} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
