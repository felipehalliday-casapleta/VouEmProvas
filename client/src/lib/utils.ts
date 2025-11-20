import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusColor(status?: string) {
  switch (status) {
    case "Aprovado":
      return "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30"
    case "Pendente":
      return "bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30"
    case "Recusado":
      return "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30"
    case "Em Andamento":
    default:
      return "bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30"
  }
}
