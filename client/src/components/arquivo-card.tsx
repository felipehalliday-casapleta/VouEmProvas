import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Video, Gamepad2, Eye } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { apiRequest, queryClient } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"

export interface ArquivoCardProps {
  id: string
  nome: string
  tipo: string
  viewUrl: string
  viewCount: number
}

export function ArquivoCard({ id, nome, tipo, viewUrl, viewCount }: ArquivoCardProps) {
  const { toast } = useToast()
  
  const viewMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/arquivos/${id}/view`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api', 'arquivos'] })
      queryClient.invalidateQueries({ queryKey: ['/api', 'eventos'] })
      window.open(viewUrl, '_blank')
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao abrir arquivo",
        description: error.message,
        variant: "destructive",
      })
    }
  })
  
  const getIcon = () => {
    if (tipo === "Video") return Video
    if (tipo === "MiniGame") return Gamepad2
    return FileText
  }

  const Icon = getIcon()

  return (
    <Card className="hover-elevate transition-all">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 h-10 w-10 rounded-md bg-muted flex items-center justify-center">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium line-clamp-2 mb-2">{nome}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="text-xs">
                {tipo}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="h-3 w-3" />
                <span>{viewCount}</span>
              </div>
            </div>

            <Button 
              size="sm" 
              className="w-full"
              onClick={() => viewMutation.mutate()}
              disabled={viewMutation.isPending}
              data-testid={`button-visualizar-${id}`}
            >
              {viewMutation.isPending ? "Abrindo..." : "Visualizar"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
