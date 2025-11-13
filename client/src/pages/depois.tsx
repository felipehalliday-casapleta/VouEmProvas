import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { EventCard } from "@/components/event-card";
import { bucketByDateISO } from "@/lib/date-tz";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { Calendar } from "lucide-react";

type Evento = {
  id: string;
  nome: string;
  tipo?: string;
  data?: string | null;
  dataISO?: string | null;
  local?: string | null;
  status?: string | null;
};

export default function DepoisPage() {
  const { data: eventos = [], isLoading } = useQuery<Evento[]>({
    queryKey: ["/api/eventos"],
  });

  const filtered = useMemo(
    () => eventos.filter((e) => bucketByDateISO(e.dataISO) === "depois"),
    [eventos]
  );

  if (isLoading) {
    return (
      <main className="p-6">
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Depois</h1>
      {filtered.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <EventCard
              key={e.id}
              eventId={e.id}
              nome={e.nome}
              tipo={e.tipo}
              data={e.data ?? null}
              dataISO={e.dataISO ?? null}
              local={e.local ?? null}
              status={e.status ?? null}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="Nenhum evento futuro"
          description="Não há eventos futuros programados."
        />
      )}
    </main>
  );
}
