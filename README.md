# The Marlborough Playhouse

Website for The Marlborough Playhouse, an indoor play café for 0-6s in central Marlborough.

**Live site:** [themarlboroughplayhouse.com](https://themarlboroughplayhouse.com)

Built with Angular 17, TypeScript and Tailwind CSS, and deployed on Vercel.

## Features

- **Single-page home** with Plan your visit, Private hire and Contact sections. The nav links smooth-scroll to each section.
- **Live events** pulled from the [Bookwhen](https://bookwhen.com) booking system and shown as site-styled cards. Each event has its own page with the Bookwhen booking widget for that event.
- **Cookie consent** in line with UK rules (PECR). MailerLite's tracking script only loads after the visitor accepts, and the choice can be changed from the footer or the cookie policy page.
- **Mailing list popup** that posts straight to a MailerLite form, so it works without cookies or third-party scripts.
- **Scroll interactions** without animation libraries:
  - a parallax photo collage
  - a hero section that sinks behind an illustrated town skyline
  - cards and buttons that pop in as they come into view
  - a compact nav bar that slides in when scrolling back up
- **Accessibility:** reduced-motion support throughout, keyboard-accessible menus and dialogs, and layouts tested from phone to desktop.

## Tech stack

- [Angular 17](https://angular.dev) (standalone components, signals, built-in control flow)
- TypeScript
- [Tailwind CSS 3](https://tailwindcss.com) plus component CSS
- [Vercel](https://vercel.com) hosting and serverless functions
- [Bookwhen API v2](https://api.bookwhen.com/v2) for events
- [MailerLite](https://www.mailerlite.com) for the mailing list

## Getting started

### Prerequisites

- Node.js 22.18 or newer. The local API server runs the TypeScript function in `api/` directly, which needs Node's built-in TypeScript support.
- A Bookwhen API token (from your Bookwhen account settings), for the events pages.

### Setup

```bash
npm install
```

Create a `.env.local` file in the project root. It's gitignored, so it won't be committed.

```bash
BOOKWHEN_API_TOKEN=your-bookwhen-api-token
```

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs the site at `http://localhost:4200` along with a local copy of the `/api` functions. Use this for anything involving events. |
| `npm start` | Runs the site only. Everything works except the events pages. |
| `npm run build` | Production build into `dist/`. |
| `npm test` | Unit tests with Karma. |

## How it works

### Events (Bookwhen)

```
Browser  ->  /api/events (Vercel function)  ->  Bookwhen API
```

- `api/events.ts` fetches events from Bookwhen using the `BOOKWHEN_API_TOKEN` environment variable, so the token never reaches the browser.
- It returns only the fields the site displays, validates event ids, and hides Bookwhen's error details.
- Responses are cached on Vercel's CDN for 5 minutes, so changes in Bookwhen appear on the site within a few minutes.
- `/events` lists upcoming events. `/events/:id` shows one event and embeds Bookwhen's booking widget for it.
- Locally, `scripts/dev-api.mjs` runs the same function, and `proxy.conf.json` sends `/api` requests from the Angular dev server to it.

### Cookies and the mailing list

- `ConsentService` stores the visitor's choice and only injects MailerLite's universal script after they accept. If they later reject, it clears what MailerLite stored and reloads the page.
- `NewsletterService` posts sign-ups straight to the MailerLite form endpoint, which accepts requests from any site. The popup opens by itself once, 15 seconds after the visitor accepts cookies, and never on event booking pages. Visitors who reject cookies can still sign up from the footer link.
- The cookie policy page (`/cookie-policy`) lists everything the site stores. Keep it up to date if you add anything that sets cookies or uses browser storage, such as analytics.

### Directives

| Directive | Use |
| --- | --- |
| `appParallax` | Moves an element at a different speed from the page while scrolling. Use `parallaxFrom="viewport"` for elements further down the page. |
| `appPopIn` | Pops an element in the first time it scrolls into view, with an optional delay for staggering. |
| `appRainbowText` / `.rainbow-text` | Gives each letter a random colour from the brand palette. |

All animations respect the visitor's reduced-motion setting.

## Project structure

```
api/                 Vercel serverless functions (with their own tsconfig.json)
scripts/             Local development helpers
src/app/
  components/        Navbar, footer, cookie banner, mailing list popup
  consent/           Cookie consent service
  directives/        Parallax, pop-in and rainbow text
  events/            Events service, types and display helpers
  newsletter/        Mailing list service
  pages/             Home page sections, events, event and cookie policy pages
src/assets/          Images, logos and documents
vercel.json          Sends page routes to the Angular app so direct links work
```

## Deployment

The site deploys to Vercel automatically when changes are pushed to `main`.

- Set `BOOKWHEN_API_TOKEN` in the Vercel project's Environment Variables (Production and Preview). Vercel only reads environment variables when it deploys, so redeploy after changing it.
- `api/tsconfig.json` compiles the functions to CommonJS. The root `tsconfig.json` outputs ES modules for Angular, which would crash the functions on Vercel.
- `vercel.json` rewrites page routes like `/events/...` to `index.html`, so links to them open directly instead of returning a 404.

## Contributing with AI assistants

Coding guidelines for AI assistants are in [AGENTS.md](AGENTS.md).
