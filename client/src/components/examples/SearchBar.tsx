import { useState } from 'react'
import { SearchBar } from '../search-bar'
import { ThemeProvider } from '../theme-provider'

export default function SearchBarExample() {
  const [search, setSearch] = useState('')

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-md">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar eventos..."
          />
          {search && (
            <p className="mt-4 text-sm text-muted-foreground">
              Buscando por: {search}
            </p>
          )}
        </div>
      </div>
    </ThemeProvider>
  )
}
