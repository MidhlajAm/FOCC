# FOCC Portal

The web portal of the **FOSS Open Source Community Club (FOCC)** — events, projects,
member directory, blog, and the club's annual bug hunt.

React + Vite on the front, a small Express API on the back, JSON on disk instead of a
database so anyone can clone this on a lab machine and have it running in two minutes.

> **Club members:** this repository is the target of **FOCC Bug Hunt 2026**.
> Read [HUNT.md](HUNT.md) before you start reading code.

---

## Run it

```bash
npm install          # installs both workspaces
npm run dev          # api on :4000, web on :5173
```

Open <http://localhost:5173>.

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs API and web dev server together |
| `npm run dev:api` | API only, on port 4000 |
| `npm run dev:web` | Vite dev server only, on port 5173 |
| `npm run build` | Production build of the client |
| `npm run reset-db` | Throws away `server/data/db.json` and rebuilds it from `seed.json` |

If the portal starts behaving strangely because of something you did to the data, run
`npm run reset-db` and restart the API. That is not cheating, that is housekeeping.

### Demo account

```
devika@focc.club / reactHooks99
```

Other member accounts exist in the seed data. Log in as whoever you need.

---

## Layout

```
client/                  React front end (Vite)
  src/
    api/client.js        thin fetch wrapper
    components/          Navbar, cards, Modal, Countdown, Pagination, ...
    context/             auth, theme, toasts
    pages/               one file per route
    utils/               dates, formatting, validation, scoring, sanitising
    styles/app.css       all of the CSS, tokens at the top
  public/avatars/        member avatars

server/                  Express API
  index.js               app wiring, CORS, error handler
  db.js                  loads seed.json into db.json, persists writes
  middleware/            auth, rate limiting, input helpers
  routes/                auth, users, events, projects, posts, leaderboard, admin, misc
  data/seed.json         the source of truth for demo content
  docs/                  member handbook, served through /api/docs
```

## API tour

| Method | Route | Notes |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Creates a member account |
| `POST` | `/api/auth/login` | Returns a session token |
| `POST` | `/api/auth/forgot` `/api/auth/reset` | Password recovery by emailed code |
| `GET` | `/api/users` `/api/users/:id` | Member directory |
| `PUT` | `/api/users/:id` | Update a profile |
| `PATCH` | `/api/users/:id/preferences` | Nested settings merge |
| `GET` | `/api/events` `/api/events/:slug` | Sessions |
| `POST` | `/api/events/:slug/register` `/cancel` | Seat booking, awards club points |
| `GET/POST` | `/api/projects` | Project wall, `POST /:slug/upvote` |
| `GET` | `/api/posts/:slug` | Blog post with comments, `POST /:slug/comments` |
| `GET` | `/api/leaderboard` | Bug hunt standings, `?level=1..4` |
| `GET/POST/DELETE` | `/api/admin/*` | Club administration |
| `GET` | `/api/stats` `/api/announcements` `/api/docs` `/api/certificate/:id` | Public odds and ends |

## Conventions

- Plain JavaScript and JSX. No TypeScript, on purpose — the club teaches reading code,
  not trusting a compiler to read it for you.
- No CSS framework. One stylesheet, custom properties at the top, dark theme first.
- The API has no database. `server/data/db.json` is the working copy and it is
  gitignored; `seed.json` is what ships.

## Contributing

Fork, branch, commit, push, open a pull request. First time? Read
[Your first pull request](http://localhost:5173/blog/first-pr-guide) on the club blog.

The club has been running since 2021 and every line here was written by a student.
Some of those lines are wrong. Finding out which is [the whole point](HUNT.md).

---

MIT for code, CC BY-SA 4.0 for content. `#focc:matrix.org`
