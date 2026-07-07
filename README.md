# Event Scheduler Client

Next.js frontend for browsing sessions, managing organiser events, and building attendee agendas.

## Setup

```bash
npm install
```

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Routes

**Public**
- `/` — landing page
- `/schedule` — public session list with track/time filters
- `/schedule/[sessionId]` — session detail
- `/auth/login`, `/auth/register`, `/auth/register/organiser`

**Attendee**
- `/attendee/dashboard`
- `/attendee/agenda`
- `/attendee/profile`

**Organiser**
- `/organiser/dashboard`
- `/organiser/sessions`
- `/organiser/sessions/new`
- `/organiser/sessions/edit/[id]`
- `/organiser/profile`

**Admin** (seeded accounts only)
- `/admin/dashboard`
- `/admin/attendees` — approve, edit, delete attendees
- `/admin/attendees/edit/[id]`
- `/admin/organisers` — approve, edit, delete organisers
- `/admin/organisers/edit/[id]`

## Demo logins

Start the API and run `python run_seeders.py`, then use these accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@eventscheduler.com` | `Admin123!` |
| Organiser | `organiser1@eventscheduler.com` | `Organiser123!` |
| Attendee | `attendee1@eventscheduler.com` | `Attendee123!` |

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run typecheck` — TypeScript validation
