import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusColor(status?: string) {
  switch (status) {
    case "Elaborando Proposta":
      return "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30";

    case "Em Análise (Diretoria de Provas)":
      return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30";

    case "Aceito (Diretoria de Provas)":
      // Verde claro
      return "bg-green-300/20 text-green-500 dark:text-green-200 border-green-300/30";

    case "De Acordo (Diretor Geral)":
      // Verde médio
      return "bg-green-400/20 text-green-600 dark:text-green-300 border-green-400/30";

    case "Aguardando Feedback (Cliente)":
      return "bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30";

    case "Aprovado":
      // Verde forte (mantido)
      return "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30";

    case "Recusado":
      return "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30";

    case "Em Andamento":
    default:
      return "bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30";
  }
}

