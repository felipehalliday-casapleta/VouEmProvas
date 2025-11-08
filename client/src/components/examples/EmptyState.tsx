import { EmptyState } from '../empty-state'
import { ThemeProvider } from '../theme-provider'
import { Calendar } from 'lucide-react'

export default function EmptyStateExample() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background p-8">
        <EmptyState
          icon={Calendar}
          title="Nenhum evento encontrado"
          description="Não há eventos programados para hoje. Verifique outros períodos."
        />
      </div>
    </ThemeProvider>
  )
}
