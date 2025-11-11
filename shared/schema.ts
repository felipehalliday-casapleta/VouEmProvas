import { z } from "zod";

export const eventoSchema = z.object({
  id: z.string(),
  nome: z.string(),
  data: z.string(),
  descricao: z.string().optional(),
  status: z.enum(['Planejado', 'Em Andamento', 'Concluído', 'Cancelado']).optional(),
  tipo: z.string().optional(),
  local: z.string().optional(),
});

export const arquivoSchema = z.object({
  id: z.string(),
  eventoId: z.string(),
  nome: z.string(),
  tipo: z.enum(['Video', 'MiniGame', 'Documento', 'Outro']),
  viewUrl: z.string(),
  viewCount: z.number().default(0),
});

export const fotoSchema = z.object({
  id: z.string(),
  eventoId: z.string(),
  url: z.string(),
  caption: z.string().optional(),
});

export const logSchema = z.object({
  timestamp: z.string(),
  eventoId: z.string().optional(),
  arquivoId: z.string().optional(),
  action: z.string(),
  userEmail: z.string(),
  details: z.string().optional(),
});

export const userRoleSchema = z.enum(['admin', 'editor', 'viewer']);

export const authUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  role: userRoleSchema,
});

export type Evento = z.infer<typeof eventoSchema>;
export type Arquivo = z.infer<typeof arquivoSchema>;
export type Foto = z.infer<typeof fotoSchema>;
export type Log = z.infer<typeof logSchema>;
export type UserRole = z.infer<typeof userRoleSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
