# The Han Studio

Private lesson-scheduling app for Prof. Chi Ho Han's piano studio at IU Jacobs.

**Stack:** Vite · React 18 · React Router · Supabase (auth + Postgres + realtime) · Lucide icons.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in your Supabase URL, anon key, and admin email
npm run dev
```

Then in Supabase → SQL editor, paste and run [`supabase/schema.sql`](supabase/schema.sql) once. It creates the tables, RLS policies, the `accept_swap_request` RPC, the auto-profile trigger, and enables realtime.

To make your account admin after first sign-in:
```sql
update profiles set role = 'admin' where email = 'chiho@example.com';
```

## Design language

- **Typography:** Fraunces italic (display/serif), Inter (UI), JetBrains Mono (times).
- **Palette:** warm paper `#F7F4ED` · deep ink `#1C1B18` · terracotta accent `#9B2D1F`.
- **Radii:** nested scale — xs 8 · sm 12 · md 16 · lg 20 · xl 24 · pill 999 (tokens in `src/index.css`).
- **Buttons:** `primary · accent · secondary · outline · ghost · danger`, plus a `round` icon-only variant.
- **Layout:** horizontal top-nav under the wordmark (see `components/Shell.jsx`).

## Routes

| Path            | Role    | Component                  |
| --------------- | ------- | -------------------------- |
| `/login`        | anon    | `pages/Login.jsx`          |
| `/book`         | student | `pages/student/Book.jsx`   |
| `/my-lessons`   | student | `pages/student/MyLessons.jsx` |
| `/studio-class` | both    | `pages/StudioClass.jsx`    |
| `/policy`       | both    | `pages/student/Policy.jsx` |
| `/schedule`     | admin   | `pages/admin/Schedule.jsx` |
| `/open-slots`   | admin   | `pages/admin/OpenSlots.jsx` |
| `/students`     | admin   | `pages/admin/Students.jsx` |
| `/students/:id` | admin   | `pages/admin/StudentDetail.jsx` |
