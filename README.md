# Overview

Scale Survey is a minimalist survey application designed to let registered users create and manage live surveys. These surveys can be distributed to anonymous participants through unique short URLs.

- The production website is available at [www.scalesurvey.com](https://www.scalesurvey.com)
- Each survey receives a dedicated short URL in the format `<survey-id>.scalesurvey.com`
- Survey owners can choose whether participants are able to view live survey results on the survey page
- Every survey has configurable start and end dates set before launch
- Survey owners can save surveys as drafts and publish them when ready

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Runtime:** Bun
- **Database:** Convex (real-time backend with TypeScript)
- **UI Library:** shadcn/ui
- **Language:** TypeScript (strict mode)

## Getting Started

```bash
# Install dependencies
bun install

# Start Convex dev server (Terminal 1)
bunx convex dev

# Start Next.js development server (Terminal 2)
bun dev
```

**Important:** You need to run both the Convex dev server (`bunx convex dev`) and the Next.js dev server (`bun dev`) in separate terminals during development. The Convex dev server watches for changes to your database schema and backend functions, automatically syncing them and regenerating TypeScript types.

## Development Guidelines

- Use [bun](https://bun.sh/) as the package manager
- Use [Convex](https://convex.dev/) for all database operations and real-time functionality
- Run `bunx convex dev` in a separate terminal during development
- Use [shadcn/ui](https://ui.shadcn.com/) as the component library; UI components are located at `@/components/ui`
- Follow the [Next.js App Router](https://nextjs.org/docs/app) architecture
