# Scale Survey

A minimalist survey application that enables users to create and manage live surveys with real-time results.

## Features

- ✅ **No Sign-Up Required** - Create surveys instantly without authentication
- ✅ **5 Question Types** - Single choice, multiple choice, text, star rating, and numeric scale
- ✅ **Drag-and-Drop** - Reorder questions easily during survey creation
- ✅ **Admin Access** - Receive a secret code for survey management
- ✅ **Live Results** - Optional real-time results viewing for participants
- ✅ **Survey Scheduling** - Configure start and end dates
- ✅ **Draft & Publish** - Save surveys as drafts and publish when ready
- ✅ **CSV Export** - Download survey responses
- ✅ **Dark Mode** - Full dark mode support
- ✅ **Real-time Updates** - Live response updates using Convex subscriptions

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Runtime:** Bun
- **Language:** TypeScript (strict mode)
- **Database:** Convex (real-time backend)
- **Styling:** Tailwind CSS v4
- **UI Library:** shadcn/ui (New York style)
- **Icons:** lucide-react
- **Drag & Drop:** @dnd-kit

## Getting Started

```bash
# Install dependencies
bun install

# Start Convex dev server (Terminal 1)
bunx convex dev

# Start Next.js development server (Terminal 2)
bun dev
```

**Important:** You need to run both the Convex dev server and the Next.js dev server in separate terminals during development. The Convex dev server watches for changes to your database schema and backend functions.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── page.tsx      # Landing page
│   ├── create/       # Survey creation
│   ├── access/       # Admin access
│   ├── survey/[key]/ # Participant views
│   └── admin/[code]/ # Admin dashboard
├── components/
│   ├── questions/    # Question type components (modular)
│   ├── survey-builder/ # Survey creation UI
│   └── landing/      # Landing page components
├── lib/
│   └── questions/    # Question type registry
└── types/
    └── questions.ts  # Type definitions

convex/              # Backend (Convex)
├── schema.ts        # Database schema
├── surveys.ts       # Survey operations
├── questions.ts     # Question operations
└── responses.ts     # Response operations
```

## Development

See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines and architecture documentation.

## Current Status

🎉 **MVP Complete!** All core features are fully implemented and tested.

See [TODO.md](./TODO.md) for detailed completion status.

## License

MIT
