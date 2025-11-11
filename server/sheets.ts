import { google } from 'googleapis';
import type { Evento, Arquivo, Foto, Log } from '@shared/schema';

let sheetsClient: any = null;

function getServiceAccountAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  
  if (!email || !privateKey) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY are required');
  }

  const formattedKey = privateKey.replace(/\\n/g, '\n');

  const auth = new google.auth.JWT({
    email,
    key: formattedKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return auth;
}

function getSheetsClient() {
  if (!sheetsClient) {
    const auth = getServiceAccountAuth();
    sheetsClient = google.sheets({ version: 'v4', auth });
  }
  return sheetsClient;
}

function getSpreadsheetId(): string {
  const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
  if (!SPREADSHEET_ID) {
    throw new Error('GOOGLE_SHEET_ID environment variable is required');
  }
  return SPREADSHEET_ID;
}

async function readSheetData(range: string): Promise<any[][]> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  
  return response.data.values || [];
}

async function updateSheetData(range: string, values: any[][]): Promise<void> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values,
    },
  });
}

async function appendSheetData(range: string, values: any[][]): Promise<void> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values,
    },
  });
}

function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

function rowToEvento(row: any[]): Evento | null {
  if (!row || row.length < 3) return null;
  
  return {
    id: row[0] || '',
    nome: row[1] || '',
    data: row[2] || '',
    descricao: row[3] || '',
    status: (row[4] as any) || 'Planejado',
    tipo: row[5] || '',
    local: row[6] || '',
  };
}

function rowToArquivo(row: any[]): Arquivo | null {
  if (!row || row.length < 5) return null;
  
  return {
    id: row[0] || '',
    eventoId: row[1] || '',
    nome: row[2] || '',
    tipo: (row[3] as any) || 'Documento',
    viewUrl: row[4] || '',
    viewCount: parseInt(row[5] || '0', 10),
  };
}

function rowToFoto(row: any[]): Foto | null {
  if (!row || row.length < 3) return null;
  
  return {
    id: row[0] || '',
    eventoId: row[1] || '',
    url: row[2] || '',
    caption: row[3] || '',
  };
}

export async function getEventos(when?: 'hoje' | 'antes' | 'depois', query?: string): Promise<Evento[]> {
  const rows = await readSheetData('Eventos!A2:G');
  const eventos = rows.map(rowToEvento).filter((e): e is Evento => e !== null);
  
  let filtered = eventos;
  
  if (when) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    filtered = eventos.filter(evento => {
      const eventoDate = parseDate(evento.data);
      eventoDate.setHours(0, 0, 0, 0);
      
      if (when === 'hoje') {
        return eventoDate.getTime() === today.getTime();
      } else if (when === 'antes') {
        return eventoDate.getTime() < today.getTime();
      } else {
        return eventoDate.getTime() > today.getTime();
      }
    });
  }
  
  if (query) {
    const searchTerm = query.toLowerCase();
    filtered = filtered.filter(evento => 
      evento.nome.toLowerCase().includes(searchTerm) ||
      evento.descricao?.toLowerCase().includes(searchTerm) ||
      evento.local?.toLowerCase().includes(searchTerm)
    );
  }
  
  return filtered;
}

export async function getEventoById(id: string): Promise<{
  evento: Evento;
  arquivos: Arquivo[];
  fotos: Foto[];
} | null> {
  const eventosRows = await readSheetData('Eventos!A2:G');
  const eventos = eventosRows.map(rowToEvento).filter((e): e is Evento => e !== null);
  const evento = eventos.find(e => e.id === id);
  
  if (!evento) return null;
  
  const arquivos = await getArquivosByEvent(id);
  const fotos = await getFotosByEvent(id);
  
  return { evento, arquivos, fotos };
}

export async function getArquivosByEvent(eventoId: string): Promise<Arquivo[]> {
  const rows = await readSheetData('Arquivos!A2:F');
  return rows
    .map(rowToArquivo)
    .filter((a): a is Arquivo => a !== null && a.eventoId === eventoId);
}

export async function getFotosByEvent(eventoId: string): Promise<Foto[]> {
  const rows = await readSheetData('Fotos!A2:D');
  return rows
    .map(rowToFoto)
    .filter((f): f is Foto => f !== null && f.eventoId === eventoId);
}

export async function appendLog(eventoId: string, arquivoId: string, action: string, userEmail: string): Promise<void> {
  const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  await appendSheetData('Logs!A:E', [[
    timestamp,
    eventoId,
    arquivoId,
    action,
    userEmail,
  ]]);
}

export async function incrementViewCount(arquivoId: string, userEmail: string): Promise<void> {
  const rows = await readSheetData('Arquivos!A2:F');
  const arquivos = rows.map(rowToArquivo).filter((a): a is Arquivo => a !== null);
  const arquivo = arquivos.find(a => a.id === arquivoId);
  
  if (!arquivo) {
    throw new Error('Arquivo não encontrado');
  }
  
  const rowIndex = arquivos.findIndex(a => a.id === arquivoId) + 2;
  const newViewCount = arquivo.viewCount + 1;
  
  await updateSheetData(`Arquivos!F${rowIndex}`, [[newViewCount]]);
  await appendLog(arquivo.eventoId, arquivoId, 'view', userEmail);
}

export async function getArquivos(): Promise<Arquivo[]> {
  const rows = await readSheetData('Arquivos!A2:F');
  return rows.map(rowToArquivo).filter((a): a is Arquivo => a !== null);
}

async function getLogs(): Promise<Log[]> {
  const rows = await readSheetData('Logs!A2:E');
  
  return rows.map(row => ({
    timestamp: row[0] || '',
    eventoId: row[1] || '',
    arquivoId: row[2] || '',
    action: row[3] || '',
    userEmail: row[4] || '',
  }));
}

export async function getStatusData() {
  const eventos = await getEventos();
  const arquivos = await getArquivos();
  const logs = await getLogs();
  
  const totalViews = arquivos.reduce((sum, a) => sum + a.viewCount, 0);
  const videoCount = arquivos.filter(a => a.tipo === 'Video').length;
  const miniGameCount = arquivos.filter(a => a.tipo === 'MiniGame').length;
  
  return {
    totalEventos: eventos.length,
    totalArquivos: arquivos.length,
    totalViews,
    videoCount,
    miniGameCount,
    recentLogs: logs.slice(-20).reverse(),
  };
}
