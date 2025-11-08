import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Eye } from "lucide-react"
import { Link } from "wouter"

export interface EventCardProps {
  eventId: string
  nome: string
  tipo: string
  genero?: string
  data: string
  local?: string
  status?: string
}

export function EventCard({ eventId, nome, tipo, genero, data, local, status }: EventCardProps) {
  return (
    <Card className="hover-elevate transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-lg font-semibold line-clamp-2">{nome}</CardTitle>
          {status && (
            <Badge variant="secondary" className="text-xs shrink-0">
              {status}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default" className="text-xs">
            {tipo}
          </Badge>
          {genero && (
            <Badge variant="outline" className="text-xs">
              {genero}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 pb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{data}</span>
        </div>
        {local && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{local}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3">
        <Link href={`/evento/${eventId}`} className="w-full">
          <Button variant="secondary" className="w-full" data-testid={`button-view-${eventId}`}>
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
