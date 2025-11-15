import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Activity, Video, Gamepad2, Eye, FileText } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Log } from "@shared/schema"

interface StatusData {
  totalEventos: number
  totalArquivos: number
  totalViews: number
  videoCount: number
  miniGameCount: number
  recentLogs: Log[]
}

export default function StatusPage() {
  const { data: status, isLoading } = useQuery<StatusData>({
    queryKey: ['/api', 'status'],
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mb-2">Status do Sistema</h1>
            <p className="text-muted-foreground">Monitoramento e informações da automação</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!status) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mb-2">Status do Sistema</h1>
            <p className="text-muted-foreground">Não foi possível carregar os dados do sistema</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Status do Sistema</h1>
          <p className="text-muted-foreground">Monitoramento e informações da automação</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-eventos">{status.totalEventos}</div>
              <p className="text-xs text-muted-foreground mt-1">
                No banco de dados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Arquivos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-arquivos">{status.totalArquivos}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Documentos, vídeos e jogos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Visualizações</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-views">{status.totalViews}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Arquivos visualizados
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-base">Vídeos</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold" data-testid="text-video-count">{status.videoCount}</span>
                <Badge variant="outline">Vídeos disponíveis</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-base">MiniGames</CardTitle>
              <Gamepad2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold" data-testid="text-minigame-count">{status.miniGameCount}</span>
                <Badge variant="outline">Jogos disponíveis</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {status.recentLogs.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Atividade Recente</h2>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Data/Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {status.recentLogs.map((log, index) => (
                    <TableRow key={index} data-testid={`row-log-${index}`}>
                      <TableCell className="font-mono text-sm" data-testid={`text-user-${index}`}>
                        {log.userEmail}
                      </TableCell>
                      <TableCell className="text-sm" data-testid={`text-eventoNome-${index}`}>
                        {log.eventoNome}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground" data-testid={`text-timestamp-${index}`}>
                        {log.timestamp}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
