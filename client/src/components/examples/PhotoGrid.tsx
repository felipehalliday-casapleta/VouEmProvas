import { PhotoGrid } from '../photo-grid'
import { ThemeProvider } from '../theme-provider'

export default function PhotoGridExample() {
  const mockPhotos = [
    {
      fotoId: 'photo-1',
      imagem: 'https://placehold.co/400x400/4F46E5/FFF?text=Foto+1',
      descricao: 'Primeira foto do evento',
      credito: 'João Silva',
      ordem: 1
    },
    {
      fotoId: 'photo-2',
      imagem: 'https://placehold.co/400x400/7C3AED/FFF?text=Foto+2',
      credito: 'Maria Santos',
      ordem: 2
    },
    {
      fotoId: 'photo-3',
      imagem: 'https://placehold.co/400x400/2563EB/FFF?text=Foto+3',
      ordem: 3
    },
  ]

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background p-8">
        <PhotoGrid photos={mockPhotos} />
      </div>
    </ThemeProvider>
  )
}
