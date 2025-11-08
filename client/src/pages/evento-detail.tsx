import { useState } from "react"
import { useRoute, Link } from "wouter"
import { ArquivoCard } from "@/components/arquivo-card"
import { PhotoGrid, type Photo } from "@/components/photo-grid"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Calendar, MapPin, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function EventoDetailPage() {
  const [, params] = useRoute("/evento/:id")
  const { toast } = useToast()
  
  // TODO: Remove mock data - replace with actual API call
  const mockEvent = {
    eventId: params?.id || "evt-001",
    nome: "ENEM 2024 - Primeiro Dia",
    tipo: "ENEM",
    genero: "Educação",
    data: "08/11/2024",
    local: "Todo Brasil",
    status: "Ativo",
    versaoDescritivo: "v2.1",
    anotacoes: "Prova de Linguagens, Códigos e suas Tecnologias e Redação"
  }

  const mockArquivos = [
    {
      fileId: "file-001",
      tipoDocumento: "Descritivo (PDF)",
      versao: "2.1",
      viewCount: 145
    },
    {
      fileId: "file-002",
      tipoDocumento: "Gabarito (PDF)",
      versao: "1.0",
      viewCount: 89
    },
    {
      fileId: "file-003",
      tipoDocumento: "Resumo Em Video",
      versao: "1.5",
      viewCount: 234
    }
  ]

  const mockFotos: Photo[] = [
    {
      fotoId: "photo-1",
      imagem: "https://placehold.co/400x400/4F46E5/FFF?text=ENEM+2024",
      descricao: "Entrada do local de prova",
      credito: "João Silva",
      ordem: 1
    },
    {
      fotoId: "photo-2",
      imagem: "https://placehold.co/400x400/7C3AED/FFF?text=Sala+01",
      descricao: "Sala de aplicação",
      ordem: 2
    }
  ]

  const mockLogs = [
    { userEmail: "felipe@exemplo.com", viewedAt: "08/11/2024 14:30" },
    { userEmail: "maria@exemplo.com", viewedAt: "08/11/2024 13:15" },
    { userEmail: "joao@exemplo.com", viewedAt: "08/11/2024 10:45" }
  ]

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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/hoje">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <Card className="mb-12">
          <CardHeader>
            <div className="flex items-start justify-between gap-4 mb-4">
              <CardTitle className="text-2xl">{mockEvent.nome}</CardTitle>
              {mockEvent.status && (
                <Badge variant="secondary">{mockEvent.status}</Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">{mockEvent.tipo}</Badge>
              {mockEvent.genero && (
                <Badge variant="outline">{mockEvent.genero}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Data:</span>
                <span>{mockEvent.data}</span>
              </div>
              {mockEvent.local && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Local:</span>
                  <span>{mockEvent.local}</span>
                </div>
              )}
              {mockEvent.versaoDescritivo && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Versão:</span>
                  <span>{mockEvent.versaoDescritivo}</span>
                </div>
              )}
            </div>
            {mockEvent.anotacoes && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="text-sm font-medium mb-1">Anotações:</p>
                <p className="text-sm text-muted-foreground">{mockEvent.anotacoes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Arquivos</h2>
          {mockArquivos.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum arquivo disponível.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockArquivos.map((arquivo) => (
                <ArquivoCard
                  key={arquivo.fileId}
                  {...arquivo}
                  onVisualize={() => handleVisualize(arquivo.fileId)}
                />
              ))}
            </div>
          )}
        </div>

        {mockFotos.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6">Fotos</h2>
            <PhotoGrid photos={mockFotos} />
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-6">Visualizações (Admin)</h2>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Data/Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLogs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm">{log.userEmail}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{log.viewedAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  )
}
