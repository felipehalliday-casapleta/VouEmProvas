import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, CheckCircle2, Clock, Database } from "lucide-react"

export default function StatusPage() {
  // TODO: Remove mock data - replace with actual API call from Config tab
  const mockStatus = {
    lastProcessed: "08/11/2024 15:30:45",
    totalEvents: 156,
    activeEvents: 12,
    automationStatus: "OK",
    databaseStatus: "Connected"
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStatus.totalEvents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                No banco de dados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eventos Ativos</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStatus.activeEvents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Em andamento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Última Atualização</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-mono">{mockStatus.lastProcessed.split(' ')[1]}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {mockStatus.lastProcessed.split(' ')[0]}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status da Automação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Worker Status</span>
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {mockStatus.automationStatus}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                O worker está processando eventos normalmente.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Conexão com Sheets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Database</span>
                <Badge variant="default" className="bg-green-600">
                  <Database className="h-3 w-3 mr-1" />
                  {mockStatus.databaseStatus}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Conectado ao Google Sheets com sucesso.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
