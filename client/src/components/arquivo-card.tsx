import { Card, CardContent } from "@/components/ui/card"
import { FileText, Video, Gamepad2, Eye } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { apiRequest, queryClient } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"

export interface ArquivoCardProps {
  id: string
  nome: string            // ainda existe na API, mas não usamos na UI
  tipo: string            // aqui vem o TipoDocumento: Descritivo, Gabarito, etc.
  viewUrl: string
  viewCount: number
  canViewStats?: boolean  // true só para admin
}

export function ArquivoCard({
  id,
  nome,
  tipo,
  viewUrl,
  viewCount,
  canViewStats,
}: ArquivoCardProps) {
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

  const handleClick = () => {
    if (!viewMutation.isPending) {
      viewMutation.mutate()
    }
  }

  const getIcon = () => {
    const t = (tipo || "").toLowerCase()

    if (t.includes("vídeo") || t.includes("video")) return Video
    if (t.includes("mini")) return Gamepad2

    // descritivo, gabarito, roteiro, etc.
    return FileText
  }


  const Icon = getIcon()

  return (
    <Card
      className="hover-elevate transition-all cursor-pointer"
      onClick={handleClick}
      data-testid={`card-arquivo-${id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Ícone do tipo de arquivo */}
          <div className="shrink-0 h-10 w-10 rounded-md bg-muted flex items-center justify-center">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Título = TipoDocumento (Descritivo, Gabarito, Roteiro, etc.) */}
            <p className="text-sm font-medium truncate">
              {tipo}
            </p>

            {/* Olhinho + contagem — só ADMIN vê */}
            {canViewStats && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Eye className="h-3 w-3" />
                <span>{viewCount}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
