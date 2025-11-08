import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Video, Gamepad2, Eye } from "lucide-react"

export interface ArquivoCardProps {
  fileId: string
  tipoDocumento: string
  versao?: string
  viewCount: number
  onVisualize: () => void
}

export function ArquivoCard({ fileId, tipoDocumento, versao, viewCount, onVisualize }: ArquivoCardProps) {
  const getIcon = () => {
    if (tipoDocumento.includes("Video")) return Video
    if (tipoDocumento.includes("MiniGame")) return Gamepad2
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
            <p className="text-sm font-medium line-clamp-2 mb-2">{tipoDocumento}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {versao && (
                <Badge variant="outline" className="text-xs">
                  v{versao}
                </Badge>
              )}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="h-3 w-3" />
                <span>{viewCount}</span>
              </div>
            </div>

            <Button 
              size="sm" 
              className="w-full"
              onClick={onVisualize}
              data-testid={`button-visualizar-${fileId}`}
            >
              Visualizar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
