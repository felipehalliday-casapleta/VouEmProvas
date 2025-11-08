import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export interface Photo {
  fotoId: string
  imagem: string
  descricao?: string
  credito?: string
  ordem: number
}

interface PhotoGridProps {
  photos: Photo[]
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  const sortedPhotos = [...photos].sort((a, b) => a.ordem - b.ordem)

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {sortedPhotos.map((photo) => (
          <div
            key={photo.fotoId}
            className="group relative aspect-square overflow-hidden rounded-md cursor-pointer hover-elevate transition-all"
            onClick={() => setSelectedPhoto(photo)}
            data-testid={`photo-${photo.fotoId}`}
          >
            <img
              src={photo.imagem || "https://placehold.co/400x400?text=Imagem"}
              alt={photo.descricao || "Foto do evento"}
              className="h-full w-full object-cover"
            />
            {photo.credito && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                {photo.credito}
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-3xl">
          {selectedPhoto && (
            <div className="space-y-4">
              <img
                src={selectedPhoto.imagem || "https://placehold.co/800x800?text=Imagem"}
                alt={selectedPhoto.descricao || "Foto do evento"}
                className="w-full rounded-md"
              />
              {selectedPhoto.descricao && (
                <p className="text-sm">{selectedPhoto.descricao}</p>
              )}
              {selectedPhoto.credito && (
                <p className="text-xs text-muted-foreground">Crédito: {selectedPhoto.credito}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
