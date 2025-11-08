import { NavHeader } from '../nav-header'
import { ThemeProvider } from '../theme-provider'

export default function NavHeaderExample() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background">
        <NavHeader />
        <div className="p-8">
          <p className="text-muted-foreground">Navigation header demo</p>
        </div>
      </div>
    </ThemeProvider>
  )
}
