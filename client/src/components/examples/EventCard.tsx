import { EventCard } from '../event-card'
import { ThemeProvider } from '../theme-provider'

export default function EventCardExample() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-sm">
          <EventCard
            eventId="evt-001"
            nome="ENEM 2024 - Prova de Linguagens e Códigos"
            tipo="ENEM"
            genero="Educação"
            data="10/11/2024"
            local="Brasília, DF"
            status="Ativo"
          />
        </div>
      </div>
    </ThemeProvider>
  )
}
