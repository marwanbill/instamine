# InstaMine — starter scaffold

PERN stack, TypeScript on both sides. See the full architecture write-up in
`instamine-project-setup.md` (shared earlier in chat) for the reasoning behind these choices.

## What's included

- `server/` — Express + TypeScript API with Prisma, Google OAuth verification, JWT
  httpOnly-cookie sessions, and an `/api/auth` module fully wired end to end.
- `client/` — Vite + React + TypeScript app with Tailwind v4, the homepage (Navbar, Hero,
  GalleryPreview, TalentsPreview, Footer), the click-to-sign-in AuthModal, and the two auth
  states in the navbar (Google button vs. Notifications + Profile menu).

Gallery, Talents, and CV modules are stubbed (placeholder data, page shells, and clear
comments pointing at the API routes to build next) — the auth flow and page structure are
fully functional.

## 1. Prerequisites

- Node.js 20+
- A local PostgreSQL database
- A Google Cloud OAuth Client ID (Web application), with `http://localhost:5173` as an
  authorized JavaScript origin

## 2. Backend

```bash
cd server
npm install
cp .env.example .env   # fill in DATABASE_URL, GOOGLE_CLIENT_ID, JWT_SECRET, CLIENT_URL
npx prisma migrate dev --name init
npm run dev             # http://localhost:5000
```

## 3. Frontend

```bash
cd client
npm install
cp .env.example .env   # fill in VITE_GOOGLE_CLIENT_ID, VITE_API_URL
npm run dev             # http://localhost:5173
```

## 4. Try it

1. Open the app — you should see the navbar with the Google sign-in button, the Hero with
   the blue/yellow lines, and the (placeholder) Gallery/Talents previews.
2. Click any gallery photo or talent post → the AuthModal should open.
3. Sign in with Google inside the modal → the modal closes, the navbar swaps to the
   notification bell + profile avatar.

## Next steps

- Replace the gradient placeholder in `Hero.tsx` with a real background photo.
- Build the `gallery`, `talents`, and `cv` backend modules following the same pattern as
  `modules/auth` (controller / service / routes), and swap the placeholder arrays in
  `GalleryPreview.tsx` / `TalentsPreview.tsx` for real `useQuery` calls.
- Add a `notifications` module and wire `NotificationBell.tsx` to it (Socket.IO if you want
  it live instead of polling).
