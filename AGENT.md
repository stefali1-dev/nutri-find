# AGENT.md

This file provides guidance to AI Agents(Claude Code, Github Copilot, etc.) when working with code in this repository.

## Project Overview

NutriFind is a two-sided marketplace connecting clients with verified nutritionists in Romania. Built with Next.js 15 (Pages Router), TypeScript, Supabase (PostgreSQL + Auth + Storage), Tailwind CSS 4.1, and shadcn/ui component library.

**Key distinction**: Clients browse and book without authentication. Only nutritionists have user accounts.

**UI/UX Standards**: The project follows a consistent design system using shadcn/ui components with green (#16a34a) as the primary brand color. All forms use standardized Input, Button, Label, and Textarea components for consistency.

## Development Commands

```bash
# Development
npm run dev           # Start dev server on http://localhost:3000

# Production
npm run build         # Build for production
npm start             # Start production server

# Code quality
npm run lint          # Run ESLint
```

## Architecture Overview

### Routing Structure (Pages Router)

```
src/pages/
├── api/
│   └── send-email.ts        # Only API route - handles email via SelfMailKit
├── nutritionisti/
│   ├── index.tsx            # Nutritionist landing page
│   ├── login.tsx            # Nutritionist authentication
│   ├── onboarding.tsx       # 6-step registration wizard
│   ├── dashboard.tsx        # Nutritionist dashboard (protected)
│   ├── rezultate.tsx        # Search results (client-facing)
│   └── [id]/
│       ├── index.tsx        # Public profile view
│       └── edit.tsx         # Profile editor (protected)
├── index.tsx                # Homepage
├── cauta-nutritionist.tsx   # Client questionnaire flow
└── [legal pages]            # despre, contact, gdpr, etc.
```

### Service Layer Pattern

All database operations use service classes (not direct Supabase calls in components):

```typescript
// src/lib/services/nutritionistService.ts
NutritionistService.getNutritionistById(id)
NutritionistService.createNutritionist(data)
NutritionistService.updateNutritionist(data)
NutritionistService.getVerifiedNutritionists()
NutritionistService.uploadDocument(userId, nutritionistId, documentType, file)
NutritionistService.uploadProfilePhoto(userId, file)

// src/lib/services/bookingService.ts
BookingService.createBooking(data)
BookingService.getBookingsByNutritionist(nutritionistId)

// src/lib/services/emailService.ts
emailService.sendWelcomeEmail(toEmail, nutritionistName)
```

**Pattern**: All service methods return `{data, error}` tuples (Supabase-style).

### Authentication & Authorization

**AuthContext** (`src/context/AuthContext.tsx`):
- Wraps entire app in `_app.tsx`
- Global hook: `useAuth()` returns `{ nutritionist, loading }`
- Only nutritionists have accounts (clients are unauthenticated)

**Authorization pattern** for protected pages:
```typescript
// Server-side in getServerSideProps
const { data: { user } } = await supabase.auth.getUser()
if (!user) return { redirect: { destination: '/nutritionisti/login' } }

// Check ownership
const { data: nutritionist } = await NutritionistService.getNutritionistById(id)
if (nutritionist.user_id !== user.id) return { redirect: { destination: '/' } }
```

### Database Schema (Supabase)

**Primary tables**:

1. **nutritionists** - Profile data
   - `user_id` (FK to Supabase auth.users)
   - JSONB fields: `work_types`, `specializations`, `education[]`, `certifications[]`, `services[]`
   - Status fields: `verification_status`, `account_status`

2. **booking_requests** - Client booking submissions
   - `nutritionist_id` (FK to nutritionists)
   - `status`: 'pending' | 'confirmed' | 'cancelled' | 'rejected'

3. **nutritionist_documents** - Document metadata (files in Storage)

4. **romanian_locations** - Location autocomplete lookup

5. **waitlist** - Email collection for marketing

**Supabase Storage buckets**:
- `profile-photos` - Nutritionist avatars
- `nutritionist-documents` - Verification documents (CDR certificates, etc.)

### Type System

Strong TypeScript throughout with separation of Create/Update types:

```typescript
// src/lib/types/nutritionist.ts
interface NutritionistData { ... }            // Full profile
type CreateNutritionistData = Omit<...>       // For registration
type UpdateNutritionistData = Partial<...>    // For edits
```

### Custom Hooks

**useNutritionist** (`src/lib/hooks/useNutritionist.ts`):
```typescript
const {
  nutritionist,
  loading,
  error,
  loadNutritionist,           // By ID
  loadNutritionistByUserId,   // By auth user_id
  updateNutritionist,
  refreshNutritionist,
  setError
} = useNutritionist(id?)
```

### Key Components

**NutritionistCard** (`src/components/ui/nutritionist-card.tsx`) - Reusable card for displaying nutritionist profiles
- Responsive layout with proper overflow handling
- Truncation for long text (location, bio, name)
- Mobile-optimized spacing and touch targets
- Integrated with shadcn/ui Button and Badge components

**LocationSearch** - Romanian cities autocomplete
- Queries `romanian_locations` table
- Debounced search
- Used in onboarding and profile edit

**BookingModal** - Client booking form
- No authentication required
- Uses shadcn/ui form components (Input, Label, Textarea, Button)
- Creates `booking_requests` record
- Validates email/phone format with inline error display

**Toast** - Notification system
- Types: success, error, info
- Auto-dismiss with timer
- Use via `useToast()` hook

### Reusable UI Components (shadcn/ui)

Located in `src/components/ui/`:
- **Button** - Primary action buttons with variants (default, outline, destructive, ghost)
- **Card** - Content containers with CardHeader, CardContent, CardFooter
- **Badge** - Status indicators and tags with variants
- **Input** - Form text inputs with consistent styling
- **Textarea** - Multi-line text inputs
- **Select** - Dropdown selects
- **Label** - Form labels with accessibility support

All components use the `cn()` utility from `@/lib/utils` for class name merging.

### Path Aliases

Use `@/` for imports:
```typescript
import { supabase } from '@/lib/supabaseClient'
import { NutritionistService } from '@/lib/services/nutritionistService'
```

## Data Flow Patterns

### Client Journey (No Auth)
1. Browse nutritionists → `/nutritionisti/rezultate`
2. View profile → `/nutritionisti/[id]`
3. Submit booking → `BookingModal` creates `booking_requests` record

### Nutritionist Journey (With Auth)
1. Registration → `/nutritionisti/onboarding` (6 steps)
   - Creates Supabase Auth user
   - Creates nutritionists profile
   - Sends welcome email (graceful failure if email fails)
2. Login → `/nutritionisti/login`
3. Complete profile → `/nutritionisti/[id]/edit`
4. Manage practice → `/nutritionisti/dashboard`

### Email Integration

Emails sent via internal API route:
```typescript
POST /api/send-email
Body: { toEmail, subject, htmlContent }
```
- Uses SelfMailKit API (SELFMAILKIT_API_KEY in env)
- Called from `emailService.ts` client-side
- Currently only sends welcome emails after registration

## Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SELFMAILKIT_API_KEY=         # Server-side only
```

## Common Patterns

### Error Handling
```typescript
const { data, error } = await NutritionistService.someMethod()
if (error) {
  console.error('Error:', error)
  // Handle error
  return
}
// Use data safely
```

### Data Transformation
Service layer ensures arrays are never null:
```typescript
const transformed = {
  ...data,
  education: data.education || [],
  specializations: data.specializations || [],
  birth_date: data.birth_date?.split('T')[0] || ''
}Class name utility** (`src/lib/utils.ts`):
- `cn()` - Combines clsx and tailwind-merge for conditional class names

**
```

### Protected Page Pattern
Always check authentication in `getServerSideProps`:
```typescript
export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerSupabaseClient(context)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { redirect: { destination: '/nutritionisti/login', permanent: false } }
  }

  // Fetch data...
}
```

## Utilities

**Specialization helpers** (`src/lib/utils.ts`):
- `getSpecializationEmoji(code)` - Returns emoji for specialization
- `getSpecializationLabel(code)` - Returns Romanian label
- `getSpecializationDisplay(code)` - Returns "Emoji Label"

**Predefined options**:
- `specializations` array - All available specializations
- `consultationTypes` array - Online/Cabinet/Hybrid with metadata

## Known Architectural Decisions

1. **No App Router**: Uses Pages Router (Next.js 15) with traditional routing
2. **Minimal API routes**: Only `/api/send-email` - most operations use Supabase client-side with RLS
3. **Single-role auth**: Only nutritionists have accounts; clients are anonymous
4. **Service layer**: All database operations abstracted into service classes
8. **shadcn/ui for consistency**: All new UI components use shadcn/ui for consistent styling and behavior
9. **Green brand color**: Primary brand color is green-600 (#16a34a) used throughout the app
5. **No client-side persistence**: Beyond sessionStorage for temporary data
6. **JSONB for arrays**: Education, certifications, services, specializations stored as JSONB in PostgreSQL
7. **Verification workflow**: Nutritionists upload documents → admin verifies → `verification_status` updated

## Security Considerations

- Row Level Security (RLS) enabled on Supabase tables
- Nutritionist edit pages check ownership via `user_id` match
- File uploads restricted to authenticated nutritionists
- Document uploads stored with user-specific paths in Storage
- Email API key stored server-side only (not exposed to client)

## Supabase Database Management (CLI)

**Important**: This project is linked to the remote Supabase project `nutrifind` (ref: `gittfqvauudnyhqejfwa`). Check link status with:
```bash
supabase projects list
```

### Common Database Workflows

**Pull remote schema** (to capture current state):
```bash
supabase db pull
```
Creates a new migration file in `supabase/migrations/` with the remote schema. Automatically prompts to update remote migration history table.

**Push local migrations** (deploy to production):
```bash
supabase db push --linked
```
Applies all local migrations from `supabase/migrations/` to the remote database. Use `--dry-run` to preview changes.

**List migration status**:
```bash
supabase migration list --linked
```
Shows which migrations exist locally vs remotely, with timestamps.

**Repair migration history** (if sync breaks):
```bash
supabase migration repair <version> --status applied --linked
# or
supabase migration repair <version> --status reverted --linked
```

**Inspect remote database**:
```bash
# View table statistics
supabase inspect db table-stats --linked

# Check for bloat
supabase inspect db bloat --linked

# See long-running queries
supabase inspect db long-running-queries --linked
```

**Local development** (requires Docker, not typically needed for this project):
```bash
supabase db start           # Start local Postgres
supabase db reset --local   # Reset local with migrations
supabase status             # Get local connection strings
```

**Note**: This project does NOT run a local Supabase stack. All development connects directly to the remote database via environment variables in `.env.local`.

### Direct Postgres Queries (psql)

**Setup**: Export the database password as an environment variable (add to `~/.zshrc`):
```bash
export POSTGRES_PASSWORD="your_password_here"
```

Connection string format:
```
postgresql://postgres:${POSTGRES_PASSWORD}@db.gittfqvauudnyhqejfwa.supabase.co:5432/postgres
```

**Query with direct terminal output** (no pager):
```bash
psql "postgresql://postgres:${POSTGRES_PASSWORD}@db.gittfqvauudnyhqejfwa.supabase.co:5432/postgres" -P pager=off -c "YOUR_SQL_QUERY"
```

Example queries:
```bash
# List nutritionists
psql "postgresql://postgres:${POSTGRES_PASSWORD}@db.gittfqvauudnyhqejfwa.supabase.co:5432/postgres" -P pager=off -c "SELECT id, full_name, email, verification_status FROM nutritionists LIMIT 5;"

# Count records by status
psql "postgresql://postgres:${POSTGRES_PASSWORD}@db.gittfqvauudnyhqejfwa.supabase.co:5432/postgres" -P pager=off -c "SELECT verification_status, COUNT(*) FROM nutritionists GROUP BY verification_status;"

# View tables
psql "postgresql://postgres:${POSTGRES_PASSWORD}@db.gittfqvauudnyhqejfwa.supabase.co:5432/postgres" -P pager=off -c "\dt"
```

The `-P pager=off` flag ensures results print directly to the terminal instead of opening in a pager.

Run freely only read-only queries.
FOR WRITE/DELETE COMMAND(BREAKING COMMANDS) ASK FOR PERIMISSION EXPLICITLY. DO NOT RUN UNLESS GIVEN PERMISSION
