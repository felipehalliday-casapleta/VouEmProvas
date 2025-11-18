// server/sheets.ts — VOU EM PROVAS v3 (Service Account + Seu Schema)
// Compatível com seus tabs/colunas atuais.
// Eventos: A..M (ID, Nome, Data, Tipo, Genero, DataExibicao, VersaoDescritivo, CriadoEm, AtualizadoEm, Local, AnotacoesDaCriacao, Status, DataISO)
// Arquivos: A..I (FileID, EventID, TipoDocumento, Versao, ViewURL, DriveId, Origem, ViewCount, AtualizadoEm)
// Fotos: A..J (FotoID, EventID, DriveId, Ordem, Imagem, Descricao, CriadoEm, AtualizadoEm, Ativo, Credito)
// Logs: A..F (LogID, FileID, EventID, UserEmail, ViewedAt, ViewSource)

import { google } from 'googleapis'
import type { Evento, Arquivo, Foto, Log } from '@shared/schema'

let sheetsClient: any = null

// ---------- Auth / Client ----------

function getServiceAccountAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY

  if (!email || !privateKey) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY are required')
  }

  // Corrige \n escapado em secrets
  const formattedKey = privateKey.replace(/\\n/g, '\n')

  const auth = new google.auth.JWT({
    email,
    key: formattedKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  return auth
}

function getSheetsClient() {
  if (!sheetsClient) {
    const auth = getServiceAccountAuth()
    sheetsClient = google.sheets({ version: 'v4', auth })
  }
  return sheetsClient
}

function getSpreadsheetId(): string {
  const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID
  if (!SPREADSHEET_ID) throw new Error('GOOGLE_SHEET_ID environment variable is required')
  return SPREADSHEET_ID
}

// ---------- Helpers ----------

async function readSheetData(range: string): Promise<any[][]> {
  const sheets = getSheetsClient()
  const spreadsheetId = getSpreadsheetId()
  const response = await sheets.spreadsheets.values.get({ spreadsheetId, range })
  return response.data.values || []
}

async function updateSheetData(range: string, values: any[][]): Promise<void> {
  const sheets = getSheetsClient()
  const spreadsheetId = getSpreadsheetId()
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  })
}

async function appendSheetData(range: string, values: any[][]): Promise<void> {
  const sheets = getSheetsClient()
  const spreadsheetId = getSpreadsheetId()
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  })
}

function parseDateBR(dateStr: string): Date | null {
  if (!dateStr) return null
  const p = dateStr.split('/')
  if (p.length !== 3) return null
  const [day, month, year] = p
  const d = new Date(Number(year), Number(month) - 1, Number(day))
  return isNaN(d.getTime()) ? null : d
}

function parseDateISO(dateStr: string): Date | null {
  if (!dateStr) return null
  // aceita yyyy-mm-dd ou ISO completo; Date parse nativo cobre
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? null : d
}

function safeLower(s?: string) {
  return (s || '').toString().toLowerCase()
}

// ---------- Row mappers (SEU SCHEMA) ----------

// EVENTOS (A..M)
function rowToEvento(row: any[]): Evento | null {
  // Espera 13 colunas (A..M). Aceita menos e preenche vazio.
  const r = Array.isArray(row) ? row : []
  const A = r[0] || ''  // ID
  const B = r[1] || ''  // Nome
  const C = r[2] || ''  // Data (DD/MM/AAAA - legado)
  const D = r[3] || ''  // Tipo
  const E = r[4] || ''  // Genero
  const F = r[5] || ''  // DataExibicao
  const G = r[6] || ''  // VersaoDescritivo
  const H = r[7] || ''  // CriadoEm
  const I = r[8] || ''  // AtualizadoEm
  const J = r[9] || ''  // Local
  const K = r[10] || '' // AnotacoesDaCriacao
  const L = r[11] || '' // Status
  const M = r[12] || '' // DataISO (yyyy-mm-dd preferencial)

  // Tipos base do app (mantém compatibilidade) + extras via "as any"
  const base: Evento = {
    id: A,
    nome: B,
    data: C,            // preserva campo legado
    descricao: '',      // se você tiver uma coluna de descrição, mapeie aqui
    status: (L as any) || 'Em Andamento',
    tipo: D,
    local: J,
  }

  const withExtras = {
    ...base,
    genero: E,
    dataExibicao: F,
    versaoDescritivo: G,
    criadoEm: H,
    atualizadoEm: I,
    anotacoesDaCriacao: K,
    dataISO: M,
  }

  // Se não houver ID ou Nome, ignore a linha
  if (!A && !B) return null
  return withExtras as Evento
}

// ARQUIVOS (A..I)
function rowToArquivo(row: any[]): Arquivo | null {
  const r = Array.isArray(row) ? row : []
  const A = r[0] || ''  // FileID
  const B = r[1] || ''  // EventID
  const C = r[2] || ''  // TipoDocumento
  const D = r[3] || ''  // Versao
  const E = r[4] || ''  // ViewURL
  const F = r[5] || ''  // DriveId
  const G = r[6] || ''  // Origem
  const H = r[7] || '0' // ViewCount
  const I = r[8] || ''  // AtualizadoEm

  const base: Arquivo = {
    id: A,
    eventoId: B,
    // O tipo original esperava "tipo" (já existia), mantemos:
    tipo: (C as any) || 'Documento',
    viewUrl: E,
    viewCount: parseInt(String(H), 10) || 0,
    // Campos adicionais do seu schema:
  } as any

  const withExtras = {
    ...base,
    versao: D,
    driveId: F,
    origem: G,
    atualizadoEm: I,
    // nome não existe nesse schema; mantemos vazio para compat:
    nome: (base as any).nome ?? '',
  }

  if (!A && !B) return null
  return withExtras as Arquivo
}

// FOTOS (A..J)
function rowToFoto(row: any[]): Foto | null {
  const r = Array.isArray(row) ? row : []
  const A = r[0] || ''  // FotoID
  const B = r[1] || ''  // EventID
  const C = r[2] || ''  // DriveId
  const D = r[3] || ''  // Ordem
  const E = r[4] || ''  // Imagem (URL)
  const F = r[5] || ''  // Descricao (caption)
  const G = r[6] || ''  // CriadoEm
  const H = r[7] || ''  // AtualizadoEm
  const I = r[8] || ''  // Ativo
  const J = r[9] || ''  // Credito

  const base: Foto = {
    id: A,
    eventoId: B,
    url: E,
    caption: F,
  } as any

  const withExtras = {
    ...base,
    driveId: C,
    ordem: D,
    criadoEm: G,
    atualizadoEm: H,
    ativo: I,
    credito: J,
  }

  if (!A && !B) return null
  return withExtras as Foto
}

// LOGS leitura (A..F)
function rowToLog(row: any[]): Log {
  const r = Array.isArray(row) ? row : []
  return {
    // Seu schema real: LogID, FileID, EventID, UserEmail, ViewedAt, ViewSource
    // O tipo Log do @shared/schema pode ter chaves diferentes; mantemos básicos via "as any".
    id: r[0] || '',           // LogID
    arquivoId: r[1] || '',    // FileID
    eventoId: r[2] || '',     // EventID
    userEmail: r[3] || '',    // UserEmail
    timestamp: r[4] || '',    // ViewedAt (como timestamp)
    action: r[5] || '',       // ViewSource
  } as any
}

// ---------- Queries ----------

export async function getEventos(
  when?: 'hoje' | 'antes' | 'depois',
  query?: string
): Promise<Evento[]> {
  // Seu schema: 13 colunas (A..M)
  const rows = await readSheetData('Eventos!A2:M')
  const eventos = rows.map(rowToEvento).filter((e): e is Evento => e !== null)

  let filtered = eventos

  if (when) {
    // Base: use DataISO (M) se existir; senão Data (C)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    filtered = eventos.filter((evento) => {
      const dataISO = (evento as any).dataISO as string | undefined
      const prefer = parseDateISO(dataISO || '')
      const fallback = parseDateBR(evento.data || '')
      const eventDate = prefer || fallback
      if (!eventDate) return false
      eventDate.setHours(0, 0, 0, 0)

      if (when === 'hoje') return eventDate.getTime() === today.getTime()
      if (when === 'antes') return eventDate.getTime() < today.getTime()
      return eventDate.getTime() > today.getTime()
    })
  }

  if (query) {
    const q = safeLower(query)
    filtered = filtered.filter((e) => {
      const nome = safeLower(e.nome)
      const descricao = safeLower((e as any).descricao)
      const local = safeLower(e.local)
      const tipo = safeLower(e.tipo)
      const genero = safeLower((e as any).genero)
      return (
        nome.includes(q) ||
        (descricao && descricao.includes(q)) ||
        (local && local.includes(q)) ||
        (tipo && tipo.includes(q)) ||
        (genero && genero.includes(q))
      )
    })
  }

  return filtered
}

export async function getEventoById(id: string): Promise<{
  evento: Evento
  arquivos: Arquivo[]
  fotos: Foto[]
} | null> {
  const eventosRows = await readSheetData('Eventos!A2:M')
  const eventos = eventosRows.map(rowToEvento).filter((e): e is Evento => e !== null)
  const evento = eventos.find((e) => e.id === id)
  if (!evento) return null

  const arquivos = await getArquivosByEvent(id)
  const fotos = await getFotosByEvent(id)

  return { evento, arquivos, fotos }
}

export async function getArquivosByEvent(eventoId: string): Promise<Arquivo[]> {
  const rows = await readSheetData('Arquivos!A2:I')
  return rows
    .map(rowToArquivo)
    .filter((a): a is Arquivo => a !== null && a.eventoId === eventoId)
}

export async function getFotosByEvent(eventoId: string): Promise<Foto[]> {
  const rows = await readSheetData('Fotos!A2:J')
  return rows
    .map(rowToFoto)
    .filter((f): f is Foto => f !== null && f.eventoId === eventoId)
}

export async function getArquivos(): Promise<Arquivo[]> {
  const rows = await readSheetData('Arquivos!A2:I')
  return rows.map(rowToArquivo).filter((a): a is Arquivo => a !== null)
}

// Logs (leitura completa, útil para status)
async function getLogs(): Promise<Log[]> {
  const rows = await readSheetData('Logs!A2:F')
  return rows.map(rowToLog)
}

// ---------- Mutations ----------

export async function appendLog(
  eventoId: string,
  arquivoId: string,
  action: string,      // usaremos como ViewSource
  userEmail: string
): Promise<void> {
  // Seu schema de Logs: (A..F) LogID | FileID | EventID | UserEmail | ViewedAt | ViewSource
  // LogID pode ser gerado por fórmula/ARRAYFORMULA; enviamos vazio.
  const viewedAtISO = new Date().toISOString()
  await appendSheetData('Logs!A:F', [[
    '',             // LogID (A)
    arquivoId,      // FileID (B)
    eventoId,       // EventID (C)
    userEmail,      // UserEmail (D)
    viewedAtISO,    // ViewedAt (E)
    action,         // ViewSource (F) — ex.: "view"
  ]])
}

export async function incrementViewCount(arquivoId: string, userEmail: string): Promise<void> {
  // Carrega todas as linhas cruas
  const rows = await readSheetData('Arquivos!A2:I')
  
  // Encontra o arquivo e índice na lista de linhas cruas (antes do filter)
  let arquivo: Arquivo | null = null
  let rowIndex = -1
  for (let i = 0; i < rows.length; i++) {
    const a = rowToArquivo(rows[i])
    if (a && a.id === arquivoId) {
      arquivo = a
      rowIndex = i + 2  // +2 porque começa em A2 (row 2 na planilha)
      break
    }
  }

  if (!arquivo || rowIndex === -1) throw new Error('Arquivo não encontrado')

  // Coluna H (8ª, index humano) = ViewCount
  const newViewCount = (arquivo.viewCount || 0) + 1
  await updateSheetData(`Arquivos!H${rowIndex}`, [[newViewCount]])

  await appendLog(arquivo.eventoId, arquivoId, 'view', userEmail)
}

export async function updateEventoStatus(eventoId: string, newStatus: string): Promise<void> {
  // Carrega todas as linhas cruas
  const rows = await readSheetData('Eventos!A2:M')
  
  // Encontra o índice na lista de linhas cruas (antes do filter)
  let rowIndex = -1
  for (let i = 0; i < rows.length; i++) {
    const evento = rowToEvento(rows[i])
    if (evento && evento.id === eventoId) {
      rowIndex = i + 2  // +2 porque começa em A2 (row 2 na planilha)
      break
    }
  }

  if (rowIndex === -1) throw new Error('Evento não encontrado')

  // Coluna L (12ª, index humano) = Status
  await updateSheetData(`Eventos!L${rowIndex}`, [[newStatus]])
}

// ---------- Dashboard / Status ----------

export async function getStatusData() {
  const eventos = await getEventos()
  const arquivos = await getArquivos()
  const logs = await getLogs()

  const totalViews = arquivos.reduce((sum, a) => sum + (a.viewCount || 0), 0)

  const videoCount = arquivos.filter((a) => safeLower((a as any).tipo) === 'video').length
  const miniGameCount = arquivos.filter((a) => safeLower((a as any).tipo) === 'minigame').length

  return {
    totalEventos: eventos.length,
    totalArquivos: arquivos.length,
    totalViews,
    videoCount,
    miniGameCount,

    recentLogs: logs.slice(-10).reverse().map(log => {
      const ev = eventos.find(e => e.id === log.eventoId);
      return {
        ...log,
        eventoNome: ev?.nome || "—",
      };
    }),
  }
}
