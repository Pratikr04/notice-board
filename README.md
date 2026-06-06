# Campus Notice Board

A notice board web app with full create, read, update, and delete. Notices show up as cards, urgent ones are pinned to the top with a red badge, and every change goes through a validated API route backed by a hosted Postgres database. Built with Next.js (Pages Router), Prisma, Neon Postgres, and Tailwind.

**Live demo:** _add your Vercel URL here_

## Stack

- Next.js 14 — Pages Router (the `pages/` directory)
- Prisma ORM
- PostgreSQL, hosted on Neon (free tier)
- Tailwind CSS
- Zod for server-side validation
- TypeScript

## What it does

- A list page (`/`) that shows every notice as responsive cards — one column on phones, two or three on larger screens. Each card has Edit and Delete buttons.
- One form used for both creating and editing. In edit mode it loads with the notice's current values.
- Delete asks for confirmation in a modal before anything is removed.
- Validation runs on the server, inside the API route, so empty fields or an invalid date are rejected even if the browser checks are skipped. The route responds with `400` and a per-field message.
- Urgent notices always appear above normal ones. That ordering happens in the database query, not in the browser: the `Priority` enum lists `Urgent` before `Normal`, so ordering by priority ascending puts every urgent notice on top. Within each group, the newest publish date comes first.
- Optional image per notice (the bonus) — upload a file or paste an image URL, shown as a banner on the card.
- A category filter and a search box on the list page.

## Notice fields

| Field         | Notes                                     |
| ------------- | ----------------------------------------- |
| `title`       | Short text. Required.                     |
| `body`        | Longer text. Required.                    |
| `category`    | `Exam`, `Event`, or `General` (dropdown). |
| `priority`    | `Normal` or `Urgent`.                     |
| `publishDate` | A valid date.                             |
| `imageUrl`    | Optional image (file upload or URL).      |

## API routes

| Method   | Route               | Purpose                | Success |
| -------- | ------------------- | ---------------------- | ------- |
| `GET`    | `/api/notices`      | List notices (ordered) | `200`   |
| `POST`   | `/api/notices`      | Create a notice        | `201`   |
| `GET`    | `/api/notices/[id]` | Read one notice        | `200`   |
| `PUT`    | `/api/notices/[id]` | Update a notice        | `200`   |
| `DELETE` | `/api/notices/[id]` | Delete a notice        | `204`   |

Invalid input returns `400` with `{ message, errors }`, unknown ids return `404`, and unsupported methods return `405`.

## Running it locally

Requires Node.js 18 or newer.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a free Postgres database at <https://neon.tech> (no credit card needed) and copy the **pooled** connection string. Supabase or any other hosted Postgres works the same way.

3. Copy `.env.example` to `.env` and paste your connection string:

   ```bash
   cp .env.example .env
   ```

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST-pooler.REGION.neon.tech/DB?sslmode=require"
   ```

4. Create the database tables:

   ```bash
   npx prisma db push
   ```

5. Start the dev server:

   ```bash
   npm run dev
   ```

   Open <http://localhost:3000>.

## Deploying to Vercel

1. Push this repo to a public GitHub repository.
2. Import it on <https://vercel.com> (free Hobby plan).
3. Add an environment variable `DATABASE_URL` with the same Neon connection string.
4. Deploy. The build runs `prisma generate && next build` automatically (see `package.json`).

Because reads happen on the server and the database is hosted, notices persist across refreshes and redeploys.

## Future scope

Things I would add with more time:

- Authentication and roles, so only staff can create, edit, or delete notices while everyone else sees a read-only board.
- Pagination once the list grows, with search handled on the server instead of in the browser.
- Real file uploads to object storage (Vercel Blob, S3, or UploadThing) instead of storing image data inline.
- An optional expiry or "pin until" date so outdated notices drop off the board automatically.
- Email or push notifications when an urgent notice is posted.
- Automated tests around the validation and the urgent-ordering rule (Vitest for the API, Playwright for the UI).

## How AI was used

## AI Usage

AI tools were permitted for this assignment, and I used Claude as a coding assistant during development.

The project was planned, implemented, configured, and tested by me. I used AI primarily to speed up development and help generate boilerplate code for some parts of the application, such as the Prisma schema, CRUD API routes, and Zod validation.

I was responsible for setting up the database, configuring the application, debugging issues, and making deployment-related decisions. For example, when deployment failed due to an incorrect database connection configuration, I identified the root cause and updated the project to use a direct Neon Postgres connection.

I manually tested all CRUD operations and verified that validation was being enforced on the server by sending requests directly to the API. I also reviewed and worked through the code to understand how each component interacts within the application.

While AI assisted with code generation and development efficiency, the overall implementation, debugging, configuration, testing, and final submission were completed by me.
