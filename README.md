# 🍷 Small Plates, Big Stakes

### Andrew Stephens First Date Futures Exchange

> **A first date. A tapas place. A nation watching.**

A mobile-first, absurdly overproduced **live prediction market** for one (1)
normal first date. Andrew is getting tapas with Linley in Dallas tonight, and the
group chat has decided this warrants an ESPN / sportsbook / NASA-Mission-Control
dashboard with live odds, animated market bars, and real-time vote streaming.

It is a very serious financial dashboard for a very unserious event.

---

## ✨ Features

- 📱 **Mobile-first & thumb-friendly** — big tap targets, safe-area aware, looks premium on an iPhone.
- 🎨 **Premium "wine bar at night" UI** — deep navy/burgundy/gold palette, glassy cards, subtle gradients, animated progress bars, micro-interactions.
- 🃏 **7 live prediction markets** — venue, start time, duration, drink count, opening line, second date, and the long-term *Mrs. Stephens* futures.
- 📊 **Live results** — after you vote, a market flips to animated percentage bars with a **★ Favorite** highlight and your pick marked.
- ⚡ **Real-time updates** — vote counts tick up live as other people vote, via Supabase Realtime.
- 🧾 **Animated ballot receipt** — "BALLOT SUBMITTED. Voter has entered the market." with a tongue-in-cheek risk-exposure readout.
- 📰 **Scrolling breaking-news ticker** and a **Mission Control market summary**.
- 🚨 **Emergency Andrew Override** (it does not work; only Linley can move this market).
- 🖼️ **Hand-built SVG cartoon avatars** of Linley & Andrew — with drop-in support for custom images later.
- 🔌 **Zero-config demo mode** — runs instantly with realistic mock data + a simulated live feed if Supabase isn't set up yet.

---

## 🧱 Tech stack

| | |
|---|---|
| **Framework** | React 18 + TypeScript |
| **Build tool** | Vite 5 |
| **Styling** | Tailwind CSS 3 |
| **Backend / realtime** | Supabase (Postgres + Realtime) |
| **Hosting** | GitHub Pages or Vercel |

---

## 🚀 Quick start (runs in demo mode, zero setup)

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open the printed URL (usually `http://localhost:5173`). 🎉

With **no environment variables set**, the app automatically runs in **DEMO
MODE**: it seeds a believable, already-lively board and drips in simulated votes
so you can see the live-updating UI immediately. Votes are local-only and reset
on refresh. This is perfect for previewing and for screenshots.

To get **shared, cross-device live voting**, wire up Supabase below. 👇

---

## 🔌 Going live with Supabase

### 1. Create a project

Create a free project at [supabase.com](https://supabase.com). Then grab your
credentials from **Project Settings → API**:

- **Project URL** → `VITE_SUPABASE_URL`
- **`anon` `public` key** → `VITE_SUPABASE_ANON_KEY` (safe to expose in the browser)

### 2. Add your environment variables

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-goes-here
```

> Vite only exposes variables prefixed with `VITE_` to the browser. Restart the
> dev server after editing. The app detects real values and switches from
> **Demo Data** to **Live Data** automatically (see the status pill under the ticker).

### 3. Create the database schema

In the Supabase dashboard, open **SQL Editor → New query**, paste the following,
and run it:

```sql
-- ── Tables ──────────────────────────────────────────────────────────────────
create table if not exists polls (
  id            text primary key,
  title         text not null,
  question      text not null,
  display_order integer not null default 0
);

create table if not exists options (
  id            text primary key,
  poll_id       text not null references polls (id) on delete cascade,
  label         text not null,
  display_order integer not null default 0
);

create table if not exists votes (
  id                uuid primary key default gen_random_uuid(),
  poll_id           text not null references polls (id) on delete cascade,
  option_id         text not null references options (id) on delete cascade,
  voter_fingerprint text not null,
  voter_name        text,           -- public display name for the "who's in the market" roster
  created_at        timestamptz not null default now(),
  -- One vote per device fingerprint per market (casual duplicate guard).
  constraint votes_one_per_poll unique (poll_id, voter_fingerprint)
);

create index if not exists votes_poll_option_idx on votes (poll_id, option_id);

-- ── Row Level Security ───────────────────────────────────────────────────────
-- The anon key is public, so RLS decides what the browser can do.
alter table polls   enable row level security;
alter table options enable row level security;
alter table votes   enable row level security;

-- Anyone can read the board.
create policy "Public can read polls"   on polls   for select using (true);
create policy "Public can read options" on options for select using (true);
create policy "Public can read votes"   on votes   for select using (true);

-- Anyone can cast a vote — insert only (no updates or deletes from the client).
create policy "Public can cast votes"   on votes   for insert with check (true);

-- ── Realtime ─────────────────────────────────────────────────────────────────
-- Stream new votes to every connected browser.
alter publication supabase_realtime add table votes;
```

> If you ever need to reset, `alter publication supabase_realtime drop table votes;`
> removes it from the realtime stream. You can also toggle realtime per-table
> under **Database → Replication** in the dashboard.

> **Upgrading an existing database?** If your tables predate the "who's in the
> market" roster, add the column once (existing rows simply keep a blank name):
>
> ```sql
> alter table votes add column if not exists voter_name text;
> ```

### 4. Seed the markets

The poll/option ids below **must** match `src/data/markets.ts`. This block is
generated from that file, and it's safe to re-run (it upserts). Paste & run it in
the SQL Editor:

```sql
insert into polls (id, title, question, display_order) values
  ('venue', 'Tapas Location Intelligence', 'Where is the date?', 1),
  ('start-time', 'First Contact Window', 'What time does the date start?', 2),
  ('duration', 'Date Duration Market', 'How long will it last?', 3),
  ('drinks', 'Andrew Beverage Index', 'How many drinks will Andrew have?', 4),
  ('opening-line', 'Opening Line Roulette', 'What will Andrew’s opening line be?', 5),
  ('second-date', 'Second Date Probability', 'Will there be a second date?', 6),
  ('mrs-stephens', 'Long-Term Futures Market', 'Is this the future Mrs. Andrew Stephens?', 7)
on conflict (id) do update
  set title = excluded.title,
      question = excluded.question,
      display_order = excluded.display_order;

insert into options (id, poll_id, label, display_order) values
  ('venue-cafe-madrid', 'venue', 'Cafe Madrid', 1),
  ('venue-barcelona', 'venue', 'Barcelona Wine Bar', 2),
  ('venue-mystery', 'venue', 'Mystery third place, Andrew lied', 3),
  ('venue-chips-salsa', 'venue', 'He said tapas but meant chips and salsa', 4),
  ('start-time-6pm', 'start-time', '6:00 PM, aggressive adult behavior', 1),
  ('start-time-630pm', 'start-time', '6:30 PM, respectable', 2),
  ('start-time-7pm', 'start-time', '7:00 PM, classic first date', 3),
  ('start-time-730pm', 'start-time', '7:30 PM, Andrew needed extra mirror time', 4),
  ('start-time-8pm', 'start-time', '8:00 PM or later, tapas after dark', 5),
  ('duration-under-60', 'duration', 'Under 60 minutes, she has “an early morning”', 1),
  ('duration-1-1p5', 'duration', '1 to 1.5 hours, polite but no sparks', 2),
  ('duration-1p5-2p5', 'duration', '1.5 to 2.5 hours, solid outing', 3),
  ('duration-2p5-plus', 'duration', '2.5+ hours, Andrew is cooking', 4),
  ('duration-4-plus', 'duration', '4+ hours, start looking at wedding venues', 5),
  ('drinks-0', 'drinks', '0, suspicious discipline', 1),
  ('drinks-1', 'drinks', '1, gentleman mode', 2),
  ('drinks-2', 'drinks', '2, optimal operating range', 3),
  ('drinks-3', 'drinks', '3, story-repeat danger zone', 4),
  ('drinks-4-plus', 'drinks', '4+, the group chat needs to intervene', 5),
  ('opening-line-smart', 'opening-line', '“I heard you’re smart.”', 1),
  ('opening-line-like-tapas', 'opening-line', '“So do you like tapas?”', 2),
  ('opening-line-never-been', 'opening-line', '“I’ve actually never been here, but I’ve heard things.”', 3),
  ('opening-line-pictures', 'opening-line', '“You look exactly like your pictures, which is good.”', 4),
  ('opening-line-not-weird', 'opening-line', '“I was told not to say anything weird.”', 5),
  ('opening-line-parking', 'opening-line', '“How was parking?”', 6),
  ('opening-line-45-minutes', 'opening-line', '“I’m not usually awkward, this is just the first 45 minutes.”', 7),
  ('opening-line-your-story', 'opening-line', '“So what’s your story?”', 8),
  ('second-date-yes', 'second-date', 'Yes, book it', 1),
  ('second-date-maybe', 'second-date', 'Maybe, depends on dessert', 2),
  ('second-date-no-educational', 'second-date', 'No, but it was educational', 3),
  ('second-date-business-days', 'second-date', 'Linley will need 3 to 5 business days', 4),
  ('second-date-andrew-claims', 'second-date', 'Andrew will claim it went great regardless', 5),
  ('mrs-stephens-loading', 'mrs-stephens', 'Yes, Mrs. Stephens loading', 1),
  ('mrs-stephens-upside', 'mrs-stephens', 'Too early, but the board likes the upside', 2),
  ('mrs-stephens-group-lore', 'mrs-stephens', 'No, but she will become group lore', 3),
  ('mrs-stephens-6-weeks', 'mrs-stephens', 'They’ll date for 6 weeks and confuse everyone', 4),
  ('mrs-stephens-fumbles', 'mrs-stephens', 'Andrew fumbles the franchise', 5)
on conflict (id) do update
  set poll_id = excluded.poll_id,
      label = excluded.label,
      display_order = excluded.display_order;
```

### 5. Restart & verify

Restart `npm run dev`. The status bar should now read **Live Data**, and votes
will persist and stream live across every device that opens the link. 🍷

---

## 🧠 How it works

- **Demo vs. Live** — `src/lib/supabaseClient.ts` checks for real `VITE_` values.
  If they're missing/placeholder, the app uses `mockBackend.ts`; otherwise it uses
  `supabaseBackend.ts`. Both implement the same `VoteBackend` interface, so the rest
  of the app doesn't care which is running.
- **Live counts** — counts are computed from the `votes` table. The hook
  (`useVotes.ts`) loads a baseline, then subscribes to Supabase Realtime `INSERT`s and
  ticks the numbers up. Your own vote is applied **optimistically** and its realtime
  echo is de-duped so it isn't double-counted.
- **Duplicate prevention (casual)** — three light layers, no login:
  1. a per-poll `localStorage` key, `small-plates-vote-{pollId}`, hides options once you've voted;
  2. a random device **fingerprint** in `localStorage` (`small-plates-fingerprint`);
  3. a DB `unique (poll_id, voter_fingerprint)` constraint as a backstop.

  This stops casual double-voting. It is **not** ballot security — clearing storage
  or switching devices resets it, which is completely fine for a group-chat bit.
- **States** — loading skeletons, an error state with a *Reconnect to Market* retry,
  and success/optimistic states are all handled.

---

## 🎨 Customizing

Everything is data-driven and easy to edit:

| Want to change… | Edit |
|---|---|
| Markets / questions / options | `src/data/markets.ts` (then re-run the seed SQL) |
| Breaking-news ticker | `src/data/tickers.ts` |
| Colors, fonts, animations | `tailwind.config.js` + `src/index.css` |
| Mock board's starting odds | `SEED_WEIGHTS` in `src/lib/mockBackend.ts` |
| Ballot receipt risk lines | `src/components/BallotReceipt.tsx` |

### Custom avatar art (optional)

The app ships with hand-built **SVG avatars**, so it looks great with zero assets.
To swap in custom illustrations (AI-generated, drawn, or photos), just drop files at:

```
public/assets/linley-avatar.png
public/assets/andrew-avatar.png
```

They're picked up **automatically** — `Avatar.tsx` fades the image in over the SVG
when it loads and keeps the SVG if the file is missing. No code changes required.
See `public/assets/README.md` for art-direction notes.

---

## 🗂️ Project structure

```
src/
├── App.tsx                     # Layout + orchestration
├── main.tsx
├── index.css                   # Tailwind + base styles + premium background
├── types.ts                    # Shared types + VoteBackend interface
├── data/
│   ├── markets.ts              # The 7 prediction markets (source of truth)
│   └── tickers.ts              # Breaking-news headlines
├── hooks/
│   └── useVotes.ts             # Load + realtime + optimistic voting + guards
├── lib/
│   ├── supabaseClient.ts       # Env detection -> client or null (demo)
│   ├── supabaseBackend.ts      # Live backend (Postgres + Realtime)
│   ├── mockBackend.ts          # Demo backend (seeded data + simulated feed)
│   ├── voteBackend.ts          # Picks the backend (singleton)
│   ├── counts.ts               # Count math + leader helpers
│   └── fingerprint.ts          # Device fingerprint + localStorage guards
└── components/
    ├── Hero.tsx                # LINLEY vs ANDREW matchup graphic
    ├── avatars/                # SVG cartoon portraits
    ├── Avatar.tsx              # SVG-with-drop-in-PNG wrapper
    ├── LiveTicker.tsx
    ├── MarketCard.tsx
    ├── VoteOption.tsx
    ├── ResultsBar.tsx
    ├── MarketSummary.tsx
    ├── BallotReceipt.tsx
    ├── EmergencyOverride.tsx
    └── Pill.tsx                # LIVE / MARKET OPEN / etc. status labels
```

---

## ☁️ Deploy

The build uses a **relative base path** (`base: './'` in `vite.config.ts`), so the
same build works whether it's served from a domain root or a subpath. No changes
needed for either host.

### Vercel (recommended, easiest)

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new). Vercel auto-detects Vite
   (Build: `npm run build`, Output: `dist`).
3. Add the two environment variables in **Settings → Environment Variables**:
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Deploy. Share the `*.vercel.app` link in the group chat. 📲

> Skipping the env vars still deploys a working site — it just runs in demo mode.

### GitHub Pages (included workflow)

A ready-to-go Actions workflow lives at `.github/workflows/deploy.yml`.

1. Push to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. *(Optional, for live voting)* add repo secrets under
   **Settings → Secrets and variables → Actions**: `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY`.
4. Push to `main` (or run the workflow manually). It builds and publishes to
   `https://<your-username>.github.io/small-plates-big-stakes/`.

---

## 📜 Scripts

```bash
npm run dev       # Start the dev server
npm run build     # Type-check + production build to dist/
npm run preview   # Preview the production build locally
npm run lint      # Type-check only (tsc --noEmit)
```

---

## ⚖️ Disclaimer

> Not affiliated with Andrew Stephens, Linley, tapas, romance, or common sense.

Positions are final-ish. The board does not offer refunds, only opinions.
