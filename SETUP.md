# VOU EM PROVAS - Setup Guide

## Google Sheets Service Account Setup

### 1. Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Select or create a project
3. Click "Create Service Account"
4. Give it a name (e.g., "vou-em-provas-sheets")
5. Click "Create and Continue"
6. Skip role assignment (click "Continue")
7. Click "Done"

### 2. Create Service Account Key

1. Click on the newly created Service Account
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Select "JSON" format
5. Click "Create" - a JSON file will download

### 3. Extract Credentials

Open the downloaded JSON file and extract these values:

```json
{
  "client_email": "your-service-account@project.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
}
```

### 4. Configure Replit Secrets

Add these three secrets in Replit:

- **GOOGLE_SERVICE_ACCOUNT_EMAIL**: Copy the `client_email` value
- **GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY**: Copy the entire `private_key` value (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)
- **GOOGLE_SHEET_ID**: Get this from your Google Sheets URL
  - Example URL: `https://docs.google.com/spreadsheets/d/1ABC...XYZ/edit`
  - Sheet ID: `1ABC...XYZ`

### 5. Share Google Sheet

1. Open your Google Sheet
2. Click "Share" button
3. Add the Service Account email (from step 3)
4. Give it "Editor" permissions
5. Click "Send"

### 6. Sheet Structure

Ensure your Google Sheet has these tabs with the following columns:

**Eventos** (Tab 1):
- Column A: ID
- Column B: Nome
- Column C: Data (format: DD/MM/YYYY)
- Column D: Descrição
- Column E: Status (Planejado | Em Andamento | Concluído | Cancelado)
- Column F: Tipo
- Column G: Local

**Arquivos** (Tab 2):
- Column A: ID
- Column B: EventoID
- Column C: Nome
- Column D: Tipo (Video | MiniGame | Documento | Outro)
- Column E: ViewURL
- Column F: ViewCount

**Fotos** (Tab 3):
- Column A: ID
- Column B: EventoID
- Column C: URL
- Column D: Caption

**Logs** (Tab 4):
- Column A: Timestamp
- Column B: EventoID
- Column C: ArquivoID
- Column D: Action
- Column E: UserEmail

## Testing the Connection

Once configured, test the connection:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-11T21:45:13.710Z",
  "sheetsConnection": "ok",
  "eventosCount": 0
}
```

## User Authentication Setup

### Configure Google OAuth

1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID
3. Add authorized JavaScript origins (your Replit URL)
4. Copy the Client ID

### Add Replit Secrets

- **GOOGLE_CLIENT_ID**: Your OAuth Client ID
- **VITE_GOOGLE_CLIENT_ID**: Same OAuth Client ID (for frontend)
- **JWT_SECRET**: Random secret for JWT signing
- **ROLE_MAP**: JSON mapping emails to roles
  ```json
  {
    "admin@example.com": "admin",
    "editor@example.com": "editor",
    "viewer@example.com": "viewer"
  }
  ```

## Environment Variables Summary

Required secrets:
- ✅ GOOGLE_SERVICE_ACCOUNT_EMAIL
- ✅ GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
- ✅ GOOGLE_SHEET_ID
- ✅ GOOGLE_CLIENT_ID
- ✅ VITE_GOOGLE_CLIENT_ID
- ✅ JWT_SECRET
- ✅ ROLE_MAP

Optional (with defaults):
- ENABLE_AUTOMATION (default: false)
- TZ (default: America/Sao_Paulo)
- NODE_ENV (set by Replit)
