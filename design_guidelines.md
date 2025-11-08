# Design Guidelines: VOU EM PROVAS Internal Dashboard

## Design Approach
**Design System**: shadcn/ui + Tailwind with inspiration from Linear and Vercel Dashboard - modern internal tools that excel at information density with clean, professional aesthetics.

**Core Principle**: Data-first clarity with purposeful hierarchy. Every element serves the user's goal of quickly finding and accessing event information.

---

## Typography

**Font Family**: 
- Primary: `font-sans` (Inter or similar via Google Fonts)
- Monospace: `font-mono` for IDs, dates, technical fields

**Hierarchy**:
- Page Titles: `text-3xl font-semibold` 
- Section Headers: `text-xl font-semibold`
- Card Titles: `text-lg font-medium`
- Body Text: `text-base font-normal`
- Metadata/Labels: `text-sm font-medium`
- Secondary Info: `text-sm font-normal`
- Captions: `text-xs`

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16** (e.g., `p-4`, `gap-6`, `mb-8`, `mt-16`)

**Container Strategy**:
- Main content: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Detail views: `max-w-5xl mx-auto px-4`
- Full-width tables: `w-full` with internal max-width

**Grid Patterns**:
- Event cards: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- File cards: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
- Photo gallery: `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4`

**Vertical Rhythm**: `space-y-6` between major sections, `space-y-4` within sections

---

## Navigation

**Top Navigation Bar**:
- Fixed header with `h-16` height
- Logo/app name on left
- Main navigation tabs (Hoje, Antes, Depois, Vídeos, MiniGames, Status, Busca)
- User menu + theme toggle on right
- Use shadcn Tabs component for primary navigation
- Subtle border bottom for separation

**Mobile Navigation**:
- Collapse to hamburger menu at `md` breakpoint
- Sheet/drawer component from shadcn for mobile menu

---

## Component Library

### Event Cards
- Contained card with `rounded-lg border` and `p-6`
- Top: Event name (`text-lg font-semibold`)
- Row of metadata chips: Tipo, Genero badges (`text-xs font-medium px-2.5 py-0.5 rounded-full`)
- Date display: `text-sm` with DD/MM format
- Status indicator (if applicable)
- Bottom: Action button or link to detail view
- Hover: subtle elevation change

### File/Arquivo Cards
- Compact card with `p-4 rounded-md border`
- Icon for document type (PDF, Video, Game) - use Heroicons
- TipoDocumento label (`text-sm font-medium`)
- Versao chip if exists (`text-xs badge`)
- ViewCount display: `text-xs` with eye icon
- "Visualizar" button: primary action button
- Grid layout within card for metadata

### Photo Gallery
- Aspect ratio containers: `aspect-square` or `aspect-video`
- Image: `object-cover rounded-md`
- Optional Credito overlay on hover: `absolute bottom-0 left-0 right-0 p-2 text-xs`
- Order by Ordem field
- Hide Ativo=false items

### Data Tables (for Logs)
- shadcn Table component
- Compact row height: `py-2`
- Fixed header with `sticky top-0`
- Alternating row treatment for readability
- Sort indicators on headers
- Pagination if needed: shadcn Pagination component

### Empty States
- Centered vertically with icon (from Heroicons)
- Clear messaging: `text-lg font-medium`
- Optional action button
- `py-12` padding minimum

### Loading States
- Skeleton components matching card structures
- Use shadcn Skeleton with appropriate dimensions
- Animate with `animate-pulse`

### Search/Busca
- Prominent search bar with `h-12` height
- Search icon (Heroicons magnifying glass)
- Clear button when has value
- Real-time filtering or debounced search
- Filter chips below for Tipo/TipoDocumento

---

## Page Layouts

### List Pages (Hoje, Antes, Depois)
1. Page header: Title + optional date range info (`mb-8`)
2. Filter bar: Search input + filter chips (`mb-6`)
3. Event cards grid
4. Pagination if needed
5. Empty state if no results

### Event Detail Page
1. Breadcrumb navigation (`mb-4`)
2. Event header section: All event fields in `grid grid-cols-1 md:grid-cols-2 gap-4` (`mb-12`)
3. Arquivos section: Heading + file cards grid (`mb-12`)
4. Fotos section: Heading + photo gallery grid (`mb-12`)
5. Logs section (admin only): Heading + compact table

### Vídeos/MiniGames Pages
- Same pattern as list pages but filtered by TipoDocumento
- Video thumbnails or game icons prominently displayed

### Status Page
- Dashboard-style with metric cards in `grid grid-cols-1 md:grid-cols-3 gap-6`
- Last processed timestamp
- Status indicators with icons

---

## Interactions

**Buttons**:
- Primary: medium size with `px-4 py-2 rounded-md font-medium`
- Secondary: outlined variant
- Icon buttons: `h-10 w-10` for consistent sizing

**Toast Notifications**:
- shadcn Toast/Sonner component
- Position: bottom-right
- Success/error variants with icons
- Auto-dismiss after 3-5 seconds

**Modals/Dialogs**: 
- shadcn Dialog component
- Used sparingly - prefer inline actions
- Max width `max-w-2xl`

**Form Inputs**:
- shadcn Input, Select components
- Label above input: `text-sm font-medium mb-2`
- Input height: `h-10`
- Consistent border radius: `rounded-md`

---

## Accessibility
- All interactive elements keyboard accessible (Tab navigation)
- Focus indicators clearly visible
- ARIA labels on icon-only buttons
- Skip to content link
- Proper heading hierarchy (h1 → h2 → h3)
- Sufficient contrast ratios (handled by shadcn defaults)

---

## Icons
**Library**: Heroicons (outline style) via CDN
- Document icon for PDFs
- Play icon for videos  
- Puzzle piece for MiniGames
- Eye icon for view counts
- Calendar for dates
- Search, Filter, Menu, User, Settings, etc.

---

## Responsive Breakpoints
- Mobile: base (< 640px)
- Tablet: `md:` (768px)
- Desktop: `lg:` (1024px)
- Wide: `xl:` (1280px)

**Mobile-First Approach**: Stack everything vertically on mobile, expand to multi-column at `md` and `lg` breakpoints.