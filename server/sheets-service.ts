import { readSheetData, appendSheetData } from './sheets-client';
import type { Evento, Arquivo, Foto, Log } from '@shared/schema';

function getSpreadsheetId(): string {
  const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
  if (!SPREADSHEET_ID) {
    throw new Error('GOOGLE_SHEET_ID environment variable is required');
  }
  return SPREADSHEET_ID;
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
  const spreadsheetId = getSpreadsheetId();
  const rows = await readSheetData(spreadsheetId, 'Eventos!A2:G');
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
  const spreadsheetId = getSpreadsheetId();
  const eventosRows = await readSheetData(spreadsheetId, 'Eventos!A2:G');
  const eventos = eventosRows.map(rowToEvento).filter((e): e is Evento => e !== null);
  const evento = eventos.find(e => e.id === id);
  
  if (!evento) return null;
  
  const arquivosRows = await readSheetData(spreadsheetId, 'Arquivos!A2:F');
  const arquivos = arquivosRows
    .map(rowToArquivo)
    .filter((a): a is Arquivo => a !== null && a.eventoId === id);
  
  const fotosRows = await readSheetData(spreadsheetId, 'Fotos!A2:D');
  const fotos = fotosRows
    .map(rowToFoto)
    .filter((f): f is Foto => f !== null && f.eventoId === id);
  
  return { evento, arquivos, fotos };
}

export async function incrementViewCount(arquivoId: string, userEmail: string): Promise<void> {
  const spreadsheetId = getSpreadsheetId();
  const rows = await readSheetData(spreadsheetId, 'Arquivos!A2:F');
  const arquivos = rows.map(rowToArquivo).filter((a): a is Arquivo => a !== null);
  const arquivo = arquivos.find(a => a.id === arquivoId);
  
  if (!arquivo) {
    throw new Error('Arquivo não encontrado');
  }
  
  const rowIndex = arquivos.findIndex(a => a.id === arquivoId) + 2;
  const newViewCount = arquivo.viewCount + 1;
  
  const sheets = await import('./sheets-client').then(m => m.getGoogleSheetsClient());
  const client = await sheets;
  
  await client.spreadsheets.values.update({
    spreadsheetId,
    range: `Arquivos!F${rowIndex}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[newViewCount]],
    },
  });
  
  const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  await appendSheetData(spreadsheetId, 'Logs!A:E', [[
    timestamp,
    arquivo.eventoId,
    arquivoId,
    'view',
    userEmail,
  ]]);
}

export async function getArquivos(): Promise<Arquivo[]> {
  const spreadsheetId = getSpreadsheetId();
  const rows = await readSheetData(spreadsheetId, 'Arquivos!A2:F');
  return rows.map(rowToArquivo).filter((a): a is Arquivo => a !== null);
}

export async function getLogs(): Promise<Log[]> {
  const spreadsheetId = getSpreadsheetId();
  const rows = await readSheetData(spreadsheetId, 'Logs!A2:E');
  
  return rows.map(row => ({
    timestamp: row[0] || '',
    eventoId: row[1] || '',
    arquivoId: row[2] || '',
    action: row[3] || '',
    userEmail: row[4] || '',
  }));
}

export async function getStatusData() {
  const spreadsheetId = getSpreadsheetId();
  const eventos = await getEventos();
  const arquivosRows = await readSheetData(spreadsheetId, 'Arquivos!A2:F');
  const arquivos = arquivosRows.map(rowToArquivo).filter((a): a is Arquivo => a !== null);
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
