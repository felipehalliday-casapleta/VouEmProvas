import { useState } from 'react'
import { FilterChips } from '../filter-chips'
import { ThemeProvider } from '../theme-provider'

export default function FilterChipsExample() {
  const [selected, setSelected] = useState<string[]>([])

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background p-8">
        <FilterChips
          options={['ENEM', 'Vestibular', 'Concurso', 'OAB']}
          selected={selected}
          onChange={setSelected}
        />
        {selected.length > 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            Selecionados: {selected.join(', ')}
          </p>
        )}
      </div>
    </ThemeProvider>
  )
}
