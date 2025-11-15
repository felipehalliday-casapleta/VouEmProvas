// client/src/components/event-card.tsx
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type EventCardProps = {
  eventId: string;
  nome: string;
  tipo?: string;
  data?: string | null;
  dataISO?: string | null;
  local?: string | null;
  status?: string | null;
  versaoDescritivo?: string | null;
};

export function EventCard({
  eventId,
  nome,
  tipo,
  data,
  dataISO,
  local,
  status,
  versaoDescritivo
}: EventCardProps) {
  const nomeCompleto = versaoDescritivo
  ? `${nome} v${versaoDescritivo}`
  : nome;

  return (
    <Link href={`/evento/${encodeURIComponent(eventId)}`} className="block">
      <Card className="h-full hover:shadow-md transition-shadow" data-testid={`card-evento-${eventId}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg line-clamp-2">{nomeCompleto}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            {tipo && <Badge variant="secondary">{tipo}</Badge>}
            {status && <Badge variant="outline">{status}</Badge>}
          </div>

          {(data || dataISO) && (
            <div className="text-muted-foreground">
              {data ?? `Data: ${dataISO}`}
            </div>
          )}

          {local && (
            <div className="text-muted-foreground">
              Local: {local}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default EventCard;
