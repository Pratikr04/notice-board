# Notice Board

A small notice board web app with full **create, read, update, and delete**. Notices are shown as responsive cards, **Urgent** notices are pinned to the top with a red badge (ordering is done in the database query), and every write goes through a validated API route.

**Live demo:** _add your Vercel URL here after deploying_

## Tech stack

| Layer          | Choice                                                        |
| -------------- | ------------------------------------------------------------- |
| Framework      | Next.js 14 — **Pages Router** (`pages/` directory)            |
| Database access| Prisma ORM                                                    |
| Database       | Prisma Postgres (free, hosted; any Postgres URL also works)   |
| Hosting        | Vercel (Hobby / free tier)                                    |
| Styling        | Tailwind CSS                                                  |
| Validation     | Zod, run **server-side** inside the API routes                |
| Language       | TypeScript                                                    |

## Features

- **Notices list** (`/`) — responsive card grid (1 / 2 / 3 columns), Edit + Delete on each card.
- **Add / Edit** (`/notices/new`, `/notices/[id]/edit`) — one shared form; edit mode pre-loads current values.
- **Delete** asks for confirmation in a modal first.
- **Server-side validation** — required fields and a valid date are enforced inside the API route, returning `400` with per-field errors. The browser cannot bypass it.
- **Urgent-first ordering in the DB** — `orderBy: [{ priority: "asc" }, { publishDate: "desc" }]`. The `Priority` enum declares `Urgent` before `Normal`, so ascending order puts all Urgent notices on top. Normal notices then sort by newest publish date.
- **Optional image** (bonus) — paste an image URL; it renders as a card banner.

## Fields

| Field         | Notes                                       |
| ------------- | ------------------------------------------- |
| `title`       | Short text. Required.                        |
| `body`        | Longer text. Required.                       |
| `category`    | `Exam` \| `Event` \| `General` (dropdown).   |
| `priority`    | `Normal` \| `Urgent`.                         |
| `publishDate` | A valid date.                                |
| `imageUrl`    | Optional image URL (bonus).                  |

## API routes

| Method   | Route                | Purpose                  | Success status |
| -------- | -------------------- | ------------------------ | -------------- |
| `GET`    | `/api/notices`       | List notices (ordered)   | `200`          |
| `POST`   | `/api/notices`       | Create a notice          | `201`          |
| `GET`    | `/api/notices/[id]`  | Read one notice          | `200`          |
| `PUT`    | `/api/notices/[id]`  | Update a notice          | `200`          |
| `DELETE` | `/api/notices/[id]`  | Delete a notice          | `204`          |

Invalid input returns `400` with `{ message, errors }`; unknown ids return `404`; wrong methods return `405`.

## Run locally

> Requires Node.js 18+.

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a free Postgres database**

   - Go to <https://console.prisma.io>, create a **Postgres** database (free, no credit card), and copy the connection string.
   - (Neon or Supabase also work — just paste their `postgresql://…` URL instead.)

3. **Add environment variables**

   Copy `.env.example` to `.env` and paste your connection string:

   ```bash
   cp .env.example .env
   ```

   ```env
   DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
   ```

4. **Create the database tables**

   ```bash
   npx prisma db push
   ```

5. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open <http://localhost:3000>.

## Deploy to Vercel

1. Push this repo to a **public** GitHub repository.
2. On <https://vercel.com>, **Import** the repo (Hobby / free plan).
3. Add an environment variable `DATABASE_URL` with the same value as your local `.env`.
4. Deploy. The build runs `prisma generate && next build` automatically (see `package.json`).
5. Run `npx prisma db push` once against the production database if you haven't already (it shares the same `DATABASE_URL`).

The app uses server-side rendering and a hosted database, so notices persist across refreshes and redeploys.

## One thing I would improve with more time

Add **authentication and roles** so only staff can create, edit, or delete notices while everyone else gets a read-only board, plus pagination/search and real file uploads (e.g. Vercel Blob / UploadThing) instead of pasting an image URL. I'd also add automated tests (Vitest + Playwright) around the API validation and the Urgent-ordering rule.

## Where and how AI was used

AI (Claude) was used as a pair-programming assistant to:

- Scaffold the Next.js Pages Router + Prisma + Tailwind project and config files.
- Draft the Prisma schema, the CRUD API routes, and the Zod validation layer.
- Generate the React components (list, card, shared form, confirm dialog) and styling.
- Write this README.

All generated code was reviewed, adjusted, and verified to build and run locally. The architectural decisions (enum ordering for the Urgent rule, server-side validation, SSR for reads) were made deliberately and checked against the assignment requirements.
