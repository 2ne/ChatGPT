# Snip

Snip is a mobile-first UK barber marketplace and booking prototype. Customers
can find nearby barbers, choose a service and appointment, then manage their
booking. The prototype also includes diary and team availability views.

## Live prototype

https://2ne.github.io/ChatGPT/snip/

## Status

High-fidelity front-end prototype. Demo bookings and availability are stored in
the browser using `localStorage`; there is no production account, payment or
booking backend.

## Stack

- React and TypeScript
- Vite
- Tailwind CSS
- Vaul drawers
- Sonner notifications

## Setup

Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

Open the local address shown by Vite.

## Commands

- `npm run dev`: start the development server
- `npm run typecheck`: run TypeScript checks
- `npm run build`: create a production build in `dist/`
- `npm run preview`: preview the production build

## Key decisions

- The project is standalone and has no ChatGPT Sites dependencies.
- Asset URLs are relative so the build can be hosted below a path.
- Approximate location defaults to Brighton in the prototype. People can opt
  into browser geolocation for precise distance sorting.
- Data remains local to the browser until a backend is introduced.
