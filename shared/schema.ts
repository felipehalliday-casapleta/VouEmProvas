import { z } from "zod";

export const eventoSchema = z.object({
  id: z.string(),
  nome: z.string(),
  data: z.string(), // legado (DD/MM/AAAA) — permanece
  descricao: z.string().optional(),

  status: z.enum(['Em Andamento', 'Pendente', 'Aprovado', 'Recusado']).optional(),
  tipo: z.string().optional(),
  local: z.string().optional(),

  // Extras do seu schema
  genero: z.string().optional(),
  dataExibicao: z.string().optional(),
  versaoDescritivo: z.string().optional(),
  criadoEm: z.string().optional(),
  atualizadoEm: z.string().optional(),
  anotacoesDaCriacao: z.string().optional(),
  dataISO: z.string().optional(), // preferível para filtros de data
});

export const arquivoSchema = z.object({
  id: z.string(),
  eventoId: z.string(),

  // No seu Sheets não há "nome" — deixe opcional
  nome: z.string().optional(),

  // Mantém enum existente
  tipo: z.enum(['Video', 'MiniGame', 'Documento', 'Outro']),

  viewUrl: z.string(),
  viewCount: z.number().default(0),

  // Extras do seu schema
  versao: z.string().optional(),
  driveId: z.string().optional(),
  origem: z.string().optional(),
  atualizadoEm: z.string().optional(),
});

export const fotoSchema = z.object({
  id: z.string(),
  eventoId: z.string(),
  url: z.string(),
  caption: z.string().optional(),

  // Extras do seu schema
  driveId: z.string().optional(),
  ordem: z.string().optional(),
  criadoEm: z.string().optional(),
  atualizadoEm: z.string().optional(),
  ativo: z.string().optional(),
  credito: z.string().optional(),
});

export const logSchema = z.object({
  // Seu layout: LogID | FileID | EventID | UserEmail | ViewedAt | ViewSource
  id: z.string().optional(),       // LogID
  arquivoId: z.string().optional(),// FileID
  eventoId: z.string().optional(), // EventID
  userEmail: z.string(),
  timestamp: z.string(),           // ViewedAt
  action: z.string(),              // ViewSource
  details: z.string().optional(),  // opcional, se quiser usar
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
