# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Scale Survey is a minimalist survey application that enables users to create and manage live surveys. Surveys are distributed to participants via unique URLs in the format `/survey/{key}`.

**Key Features:**
- Anonymous survey creation - no account required
- Survey owners receive a secret admin code upon creation
- Local browser storage of created surveys (IndexedDB via Dexie)
- "My Surveys" page for easy access to created surveys without admin codes
- 5 question types: Single Choice, Multiple Choice, Text, Rating (stars), Scale (numeric)
- Drag-and-drop question reordering
- Edit draft surveys before publishing
- Survey owners can save drafts and publish when ready
- Configurable start/end dates for each survey
- Optional live results viewing for participants
- Real-time response updates using Convex subscriptions
- CSV export for survey results
- Dark mode support

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Runtime:** Bun (package manager and runtime)
- **Language:** TypeScript (strict mode enabled)
- **Database:** Convex (real-time backend with TypeScript)
- **Local Storage:** Dexie (IndexedDB wrapper for client-side survey storage)
- **Styling:** Tailwind CSS v4
- **UI Library:** shadcn/ui (New York style)
- **Forms:** react-hook-form + zod validation
- **Charts:** recharts
- **Icons:** lucide-react
- **Drag and Drop:** @dnd-kit
- **Date Utilities:** date-fns

## Development Commands

```bash
# Install dependencies
bun install

# Start Convex dev server (run in separate terminal)
bunx convex dev

# Start Next.js development server
bun dev

# Build for production
bun build

# Start production server
bun start
```

### Running Convex Dev Server

The Convex dev server (`bunx convex dev`) must be running during development. Run it in a separate terminal before starting your Next.js dev server.

**When to run it:**
- **Initial setup:** First time cloning the project or setting up Convex
- **During development:** Keep it running alongside `bun dev` in a separate terminal
- **When making changes to:**
  - Database schema in `convex/schema.ts`
  - Any query, mutation, or action functions in `convex/` directory
  - It automatically regenerates TypeScript types in `convex/_generated/`

**Typical workflow:**
```bash
# Terminal 1: Start Convex dev server
bunx convex dev

# Terminal 2: Start Next.js development server
bun dev
```

**Note:** You don't need to run it for production builds (uses production Convex deployment) or when only working on frontend code that doesn't interact with Convex.

## Architecture

### Directory Structure

```
src/
   app/              # Next.js App Router pages and layouts
      page.tsx       # Landing page
      create/        # Survey creation page
      surveys/       # "My Surveys" listing page
      access/        # Admin access page
      survey/[key]/  # Participant survey pages
      admin/[code]/  # Admin dashboard, edit, and results
         page.tsx    # Admin dashboard
         edit/       # Edit draft surveys
         results/    # Results view with CSV export
      layout.tsx     # Root layout with font configuration
      globals.css    # Global styles and Tailwind config
   components/
      ui/            # shadcn/ui components (auto-generated)
      landing/       # Landing page components
      survey-builder/ # Survey creation components
         survey-form.tsx # Shared form component (create/edit)
         survey-basic-info.tsx
         question-builder.tsx
         survey-settings.tsx
         success-modal.tsx
      questions/     # Question type components (modular)
         single-choice/
         multiple-choice/
         text/
         rating/
         scale/
      site-header.tsx # Reusable header component
      theme-toggle.tsx # Dark mode toggle
   hooks/           # Custom React hooks
      use-mobile.ts
   lib/
      db.ts         # Dexie database setup for local storage
      questions/    # Question type registry system
      utils.ts      # cn() utility for class merging
   types/
      questions.ts  # Question type definitions
convex/             # Convex backend functions and schema
   schema.ts        # Database schema definitions
   surveys.ts       # Survey mutations and queries
   questions.ts     # Question mutations and queries
   responses.ts     # Response mutations and queries
   _generated/      # Auto-generated Convex types
```

### Import Aliases

Configured via tsconfig.json and components.json:
- `@/*` → `src/*`
- `@/components` → `src/components`
- `@/components/ui` → `src/components/ui`
- `@/lib` → `src/lib`
- `@/hooks` → `src/hooks`
- `@/types` → `src/types`

### Question Type System

The project uses a modular question type system:

1. **Registry**: `src/lib/questions/registry.ts` - Central registry for all question types
2. **Types**: Each question type has 3 components:
   - `EditorComponent` - For survey creation
   - `ResponseComponent` - For participants to answer
   - `ResultsComponent` - For viewing aggregated results
3. **Adding new types**: Create components in `src/components/questions/{type}/` and register in `src/lib/questions/init.ts`

### UI Components

All UI components use shadcn/ui and are located at `@/components/ui`. The project uses the "New York" style variant with:
- Neutral base color
- CSS variables for theming
- Lucide React for icons
- RSC (React Server Components) support enabled

To add new shadcn components, use:
```bash
bunx shadcn@latest add <component-name>
```

### Styling

- Tailwind CSS v4 with CSS variables for theming
- `cn()` utility in `@/lib/utils.ts` combines clsx and tailwind-merge for conditional classes
- Global styles in `src/app/globals.css`
- Dark mode via next-themes

### Type Safety

- TypeScript strict mode enabled
- Target: ES2017
- Path aliases configured for clean imports
- Zod schemas for runtime validation
- Question configs stored as JSON strings in database

### Database (Convex)

Convex is a real-time backend with TypeScript-first schema definitions:
- Database schema defined in `convex/schema.ts`
- Three main tables: surveys, questions, responses
- Queries, mutations, and actions in `convex/` directory
- Auto-generated TypeScript types in `convex/_generated/`
- Real-time subscriptions built-in
- Use `useQuery` and `useMutation` hooks from `convex/react`
- Admin code authentication for mutations

### Local Storage (Dexie)

Browser-based storage for survey metadata using Dexie (IndexedDB wrapper):
- Database setup in `src/lib/db.ts`
- Stores survey metadata (ID, admin code, key, title, status, timestamps)
- Enables "My Surveys" page without requiring admin codes
- Uses `useLiveQuery` hook from `dexie-react-hooks` for reactive queries
- Automatically tracks last accessed timestamp for sorting
- Survey data persists in browser across sessions

## Development Guidelines

1. **Always use Bun** as the package manager (not npm or yarn)
2. **Use Convex** for all database operations (queries, mutations, and real-time subscriptions)
3. **Use shadcn/ui components** from `@/components/ui` for all UI elements
4. **Follow Next.js App Router patterns**: Server Components by default, Client Components only when needed
5. **Use the cn() utility** from `@/lib/utils` for conditional className merging
6. **Leverage path aliases** (`@/components`, `@/lib`, etc.) in imports
7. **Use context7 and chrome-devtools MCP servers** to fetch up-to-date documentation and test UI in the browser
8. **Maintain TODO.md as a work log**: Update it as you work on tasks to keep track of progress
9. **Commit frequently**: Make git commits whenever you complete a logical unit of work

## Work Log Guidelines

**IMPORTANT**: Always maintain `TODO.md` as a detailed work log. This helps track what has been done and what remains to be done.

### When to Update TODO.md

1. **Before starting work**: Review TODO.md to understand current state
2. **During development**: Mark items as in-progress or completed
3. **After completing tasks**: Update with ✅ checkmarks and add notes
4. **When discovering new tasks**: Add them to appropriate sections
5. **Before committing**: Ensure TODO.md reflects the work done

### Commit Guidelines

**Make commits whenever you complete:**
- A feature or component
- A bug fix
- A logical unit of refactoring
- Updates to documentation
- Any meaningful progress

**Commit message format:**
```
Brief description of change

- Detailed bullet points of what changed
- Why the change was made (if not obvious)
- Any technical notes

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Current Project Status

The MVP is **100% feature complete** with recent enhancements! All core features are implemented:
- ✅ Survey creation with 5 question types
- ✅ Drag-and-drop question reordering
- ✅ Local browser storage of created surveys (Dexie/IndexedDB)
- ✅ "My Surveys" page for managing surveys
- ✅ Edit draft surveys with full question management
- ✅ Shared SurveyForm component (DRY principle)
- ✅ Participant survey response pages
- ✅ Admin dashboard with results
- ✅ Live results with real-time updates
- ✅ CSV export
- ✅ Dark mode
- ✅ Responsive header with navigation

See TODO.md for detailed completion status of all phases.

## Code Architecture Patterns

### Shared Components (DRY Principle)

The project uses shared components to eliminate code duplication:

**SurveyForm Component** (`src/components/survey-builder/survey-form.tsx`):
- Reusable form for both create and edit modes
- Props-based configuration (mode: "create" | "edit")
- Handles form state, validation, and rendering
- Mode-specific buttons (Save Draft/Publish vs Save Changes)
- Change tracking for edit mode (disables save until changes made)

**Usage:**
```typescript
// Create mode
<SurveyForm
  mode="create"
  onSaveDraft={handleSaveDraft}
  onPublish={handlePublish}
  isSaving={isSaving}
/>

// Edit mode
<SurveyForm
  mode="edit"
  initialData={existingData}
  onSave={handleSave}
  isSaving={isSaving}
/>
```

### Edit Page Question Synchronization

The edit page (`src/app/admin/[code]/edit/page.tsx`) implements comprehensive question sync logic:

1. **Load existing data** using `useMemo` for efficient re-rendering
2. **Detect changes** by comparing question IDs
3. **Delete removed questions** from database
4. **Add new questions** to database
5. **Update existing questions** in database
6. **Reorder all questions** based on current order

This ensures the database accurately reflects user changes while maintaining data integrity.
