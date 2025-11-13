# VOU EM PROVAS - Internal Dashboard

## Overview

VOU EM PROVAS is an internal web application for managing events ("provas"), their associated files, photos, and media content. The system reads and writes data to Google Sheets as its primary data source, providing a secure dashboard for viewing event information, accessing documents, and tracking file usage through view logs.

**Primary Purpose**: Provide an internal team with a clean, responsive interface to browse events (categorized as today/before/after), view associated files (documents, videos, minigames), manage photo galleries, and monitor system activity.

**Tech Stack**: Express.js backend + React (Vite) frontend with TypeScript, Tailwind CSS, and shadcn/ui component library.

**Current Status**: ✅ Fully implemented with Google OAuth authentication, Google Sheets integration, and all core features operational.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with Vite as the build tool, using TypeScript for type safety.

**Routing**: Wouter - a lightweight client-side router with pattern matching for dynamic routes.

**UI Component System**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling. The design follows a "New York" style preset with neutral color scheme and support for dark/light themes.

**State Management**: 
- TanStack Query (React Query) for server state management, caching, and data fetching
- React Context API for authentication state via `AuthContext`
- Local component state with React hooks for UI interactions

**Design System**:
- Custom CSS variables for theming with extensive HSL color palette
- Responsive grid layouts using Tailwind's utility classes
- Custom utility classes (`hover-elevate`, `active-elevate-2`) for interaction feedback
- Typography system using Inter font family from Google Fonts
- Spacing system based on Tailwind's standard scale (2, 4, 6, 8, 12, 16)

**Key Pages**:
- `/hoje` - Today's events (uses React Query for data fetching)
- `/antes` - Past events (uses React Query for data fetching)
- `/depois` - Future events (uses React Query for data fetching)
- `/videos` - Video files filtered view
- `/minigames` - MiniGame files filtered view
- `/evento/:id` - Event detail page with full event info, files, photos, and status management
- `/status` - System monitoring dashboard
- `/busca` - Global search across events and files

**Event Detail Page Features** (`/evento/:id`):
- Fetches complete event data via React Query with `["/api/eventos", id]` query key
- Displays full event metadata (name, type, genre, date, location, notes)
- Color-coded status badge (green/orange/gray/red for different statuses)
- Role-based status editing: admin/editor see Select dropdown, viewers see read-only Badge
- Status changes trigger mutation with automatic cache invalidation
- File listing with ArquivoCard components - clicking logs view and opens in new tab
- Photo gallery with PhotoGrid component and lightbox viewer
- Proper loading states with Skeleton components
- EmptyState components for not found/empty data scenarios
- Back button navigation using wouter Link component

### Backend Architecture

**Framework**: Express.js with TypeScript, running on Node.js.

**Server Structure**:
- `server/index.ts` - Main application entry point with middleware setup
- `server/routes.ts` - API route definitions and handlers
- `server/auth.ts` - Authentication logic using Google OAuth
- `server/sheets-client.ts` - Google Sheets API client wrapper
- `server/sheets-service.ts` - Business logic for reading/writing sheet data

**API Design**: RESTful endpoints following resource-based patterns:
- `POST /api/auth/google` - Google OAuth authentication
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Current user session
- `GET /api/eventos` - List events with optional query parameters (`when=hoje|antes|depois`, `query=search`)
- `GET /api/eventos/:id` - Event details with files and photos
- `PATCH /api/eventos/:id/status` - Update event status (admin/editor only)
- `GET /api/arquivos` - List all files
- `POST /api/arquivos/:id/view` - Increment view count and log access
- `GET /api/status` - System statistics and recent logs

**Middleware Stack**:
1. Security headers (CSP, X-Frame-Options, X-XSS-Protection, etc.)
2. Cookie parser for session management
3. JSON body parser with raw body capture
4. Request logging with timing information
5. Authentication middleware (`requireAuth`, `requireRole`)

**Development Tools**:
- Vite middleware integration for HMR in development
- Runtime error overlay plugin
- Static file serving in production

### Authentication & Authorization

**Authentication Method**: Google Identity Services (frontend) + Google Auth Library (backend verification) with JWT tokens stored in HTTP-only cookies.

**Flow**:
1. User clicks "Sign in with Google" on /login page (using Google Identity Services)
2. Frontend receives ID token from Google
3. Frontend sends ID token to POST /api/auth/google
4. Backend verifies token with Google's servers using google-auth-library
5. Backend checks user email against ROLE_MAP for role assignment
6. Backend creates JWT token with user data (email, name, role)
7. JWT stored in HTTP-only cookie (7 day expiration)
8. Backend returns user data to frontend
9. All subsequent API requests include cookie automatically
10. requireAuth middleware validates JWT from cookie on protected routes

**Authorization**:
- Role-based access control (RBAC) with three roles: `admin`, `editor`, `viewer`
- Role mapping configured via `ROLE_MAP` environment variable (JSON format)
- Protected routes use `requireAuth` middleware
- Role-specific access enforced via `requireRole` middleware
- Logs/status page restricted to admin role only

**Security Measures**:
- HTTP-only cookies prevent XSS token theft
- Secure cookie flag in production
- SameSite strict policy
- Server-side token verification only
- No secrets exposed to client
- Input sanitization on API routes
- Content Security Policy headers

### Data Storage & External Services

**Primary Data Source**: Google Sheets via Google Sheets API v4

**Integration Method**: Google Service Account with JWT authentication
- Direct API access using googleapis library
- Service Account credentials managed via environment variables
- Automatic authentication with private key

**Sheet Structure** (4 tabs):
1. **Eventos** - Event metadata (ID, name, date, type, genre, location, status, DataISO for filtering)
2. **Arquivos** - Files linked to events (ID, EventID, type, URL, view count)
3. **Fotos** - Photos linked to events (ID, EventID, image URL, description, credits, order)
4. **Logs** - View activity tracking (timestamp, EventID, FileID, user email, action)

**Data Operations**:
- **Read**: Fetch all rows from tabs, transform to typed objects
- **Write**: Append logs to Logs tab, update view counts in Arquivos tab, update event status in Eventos tab
- **Row Index Calculation**: Critical fix implemented - row indices calculated from raw sheet rows before filtering to avoid writing to wrong rows
- **Retry Logic**: Implemented for mutations with small backoff

**Data Transformations**:
- Row arrays converted to typed objects (`Evento`, `Arquivo`, `Foto`, `Log`)
- Date filtering based on `DataISO` field for hoje/antes/depois logic
- Timezone handling: `America/Sao_Paulo` set globally

### Schema & Type System

**Validation**: Zod schemas for runtime type checking and validation

**Core Types**:
- `Evento` - Event with status enum ('Planejado', 'Em Andamento', 'Concluído', 'Cancelado')
- `Arquivo` - File with type enum ('Video', 'MiniGame', 'Documento', 'Outro')
- `Foto` - Photo with optional caption and credits
- `Log` - Activity log entry
- `AuthUser` - Authenticated user with role
- `UserRole` - Role enum ('admin', 'editor', 'viewer')

**Shared Schema**: Located in `shared/schema.ts`, imported by both client and server for type consistency.

## External Dependencies

### Third-Party Services

**Google OAuth 2.0**: User authentication and identity verification
- Client ID required via `GOOGLE_CLIENT_ID` environment variable
- Frontend uses Google Sign-In JavaScript library
- Backend verifies tokens with `google-auth-library`

**Google Sheets API**: Primary database via Sheets API v4
- Accessed through Service Account authentication
- Requires `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
- Sheet must be shared with Service Account email as Editor
- Uses `googleapis` library with JWT authentication

### Key NPM Packages

**Backend**:
- `express` - Web framework
- `google-auth-library` - OAuth token verification
- `googleapis` - Google Sheets API client
- `jsonwebtoken` - JWT creation and validation
- `cookie-parser` - Cookie handling middleware

**Frontend**:
- `react` & `react-dom` - UI framework
- `@tanstack/react-query` - Server state management
- `wouter` - Client-side routing
- `@radix-ui/*` - Headless UI primitives (20+ components)
- `tailwindcss` - Utility-first CSS framework
- `zod` - Schema validation
- `date-fns` - Date manipulation

**Build & Development**:
- `vite` - Build tool and dev server
- `typescript` - Type checking
- `esbuild` - Server bundling for production
- `tsx` - TypeScript execution for development

### Environment Configuration

**Required Variables**:
- `GOOGLE_CLIENT_ID` - Google OAuth client ID (for backend verification)
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID (for frontend Google Sign-In)
- `GOOGLE_SHEET_ID` - Target spreadsheet ID
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Service Account email for Sheets access
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` - Service Account private key (JSON format)
- `JWT_SECRET` - Secret for signing JWT tokens (defaults to dev secret if not set)
- `ROLE_MAP` - JSON mapping emails to roles (defaults to {} if not set)
- `ENABLE_AUTOMATION` - Feature flag, set to "false" (no automation/webhooks)
- `TZ` - Timezone set to America/Sao_Paulo
- `NODE_ENV` - Environment flag (development/production)

### Deployment Architecture

**Development**: Vite dev server with HMR, middleware mode integration with Express
**Production**: 
- Client built to `dist/public` 
- Server bundled to `dist/index.js` with esbuild
- Static files served from built client directory
- Single Node.js process serves both API and static assets