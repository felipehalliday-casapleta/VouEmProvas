# Test Commands for VOU EM PROVAS

## Health Check (No Authentication Required)

Test the Google Sheets Service Account connection:

```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-11T21:46:45.508Z",
  "sheetsConnection": "ok",
  "eventosCount": 0
}
```

## Authentication Test

### 1. Test Protected Endpoint Without Auth (Should Fail)

```bash
curl http://localhost:5000/api/eventos
```

**Expected Response:**
```json
{"error":"Authentication required"}
```

### 2. Login with Google (Requires Valid ID Token)

```bash
curl -X POST http://localhost:5000/api/auth/google \
  -H 'Content-Type: application/json' \
  -c cookies.txt \
  -d '{"idToken": "YOUR_GOOGLE_ID_TOKEN_HERE"}'
```

**Expected Response:**
```json
{
  "email": "user@example.com",
  "name": "User Name",
  "role": "viewer"
}
```

### 3. Test Protected Endpoint With Auth Cookie

```bash
curl http://localhost:5000/api/eventos \
  -b cookies.txt
```

**Expected Response:**
```json
[]
```
(Empty array if no eventos in the sheet, or an array of event objects)

## Data Operations Test

### Get Eventos (with filters)

```bash
# All eventos
curl http://localhost:5000/api/eventos -b cookies.txt

# Today's eventos
curl http://localhost:5000/api/eventos?when=hoje -b cookies.txt

# Past eventos
curl http://localhost:5000/api/eventos?when=antes -b cookies.txt

# Future eventos
curl http://localhost:5000/api/eventos?when=depois -b cookies.txt

# Search eventos
curl "http://localhost:5000/api/eventos?query=festa" -b cookies.txt
```

### Get Event Details

```bash
curl http://localhost:5000/api/eventos/EVENT_ID_HERE -b cookies.txt
```

### Record File View

```bash
curl -X POST http://localhost:5000/api/arquivos/ARQUIVO_ID_HERE/view \
  -b cookies.txt
```

### Get Status (Admin Only)

```bash
curl http://localhost:5000/api/status -b cookies.txt
```

**Expected Response (if user is admin):**
```json
{
  "totalEventos": 0,
  "totalArquivos": 0,
  "totalViews": 0,
  "videoCount": 0,
  "miniGameCount": 0,
  "recentLogs": []
}
```

## Logout

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

## Quick Test Script

Run all health checks:

```bash
#!/bin/bash
echo "Testing health endpoint..."
curl -s http://localhost:5000/api/health | grep -q "healthy" && echo "✅ Healthy" || echo "❌ Failed"

echo "Testing auth protection..."
curl -s http://localhost:5000/api/eventos | grep -q "Authentication required" && echo "✅ Protected" || echo "❌ Not protected"

echo "Done!"
```

## Production URL

Replace `http://localhost:5000` with your Replit app URL when testing the deployed version.
