import { ArquivoCard } from '../arquivo-card'
import { ThemeProvider } from '../theme-provider'

export default function ArquivoCardExample() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-sm">
          <ArquivoCard
            fileId="file-001"
            tipoDocumento="Descritivo (PDF)"
            versao="1.2"
            viewCount={42}
            onVisualize={() => console.log('Visualizar clicked')}
          />
        </div>
      </div>
    </ThemeProvider>
  )
}
