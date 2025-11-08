import { useState } from "react"
import { EventCard } from "@/components/event-card"
import { ArquivoCard } from "@/components/arquivo-card"
import { SearchBar } from "@/components/search-bar"
import { EmptyState } from "@/components/empty-state"
import { Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function BuscaPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  
  // TODO: Remove mock data - replace with actual API call
  const mockEvents = [
    {
      eventId: "evt-001",
      nome: "ENEM 2024 - Primeiro Dia",
      tipo: "ENEM",
      genero: "Educação",
      data: "08/11/2024",
      local: "Todo Brasil"
    },
    {
      eventId: "evt-002",
      nome: "Vestibular FUVEST 2024",
      tipo: "Vestibular",
      genero: "Educação",
      data: "26/11/2024",
      local: "São Paulo, SP"
    }
  ]

  const mockArquivos = [
    {
      fileId: "file-001",
      tipoDocumento: "Descritivo (PDF)",
      versao: "2.1",
      viewCount: 145,
      eventName: "ENEM 2024"
    },
    {
      fileId: "file-002",
      tipoDocumento: "Resumo Em Video",
      versao: "1.5",
      viewCount: 234,
      eventName: "ENEM 2024"
    }
  ]

  const filteredEvents = mockEvents.filter(event =>
    event.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.tipo.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredArquivos = mockArquivos.filter(arquivo =>
    arquivo.tipoDocumento.toLowerCase().includes(searchQuery.toLowerCase()) ||
    arquivo.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleVisualize = (fileId: string) => {
    // TODO: Remove mock functionality - implement actual API call
    console.log('Visualizar arquivo:', fileId)
    toast({
      title: "Abrindo arquivo",
      description: "O arquivo será aberto em uma nova aba.",
    })
  }

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
          />
        </div>

        {!searchQuery ? (
          <EmptyState
            icon={Search}
            title="Digite para buscar"
            description="Use a barra de busca acima para encontrar eventos e arquivos."
          />
        ) : (
          <Tabs defaultValue="eventos" className="w-full">
            <TabsList>
              <TabsTrigger value="eventos" data-testid="tab-eventos">
                Eventos ({filteredEvents.length})
              </TabsTrigger>
              <TabsTrigger value="arquivos" data-testid="tab-arquivos">
                Arquivos ({filteredArquivos.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="eventos" className="mt-6">
              {filteredEvents.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="Nenhum evento encontrado"
                  description="Tente buscar com outros termos."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <EventCard key={event.eventId} {...event} />
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
                      key={arquivo.fileId}
                      {...arquivo}
                      onVisualize={() => handleVisualize(arquivo.fileId)}
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
