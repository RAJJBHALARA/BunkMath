# BunkMath ⚡

> Know exactly when to bunk.

## Problem

Indian college students have no simple way to track attendance per subject and know exactly how many classes they can skip safely.

Most colleges in India have a strict rule — **if your attendance drops below 75% (or 80/85%), you're barred from exams.** Yet students have no easy tool to track this in real time. They either ask friends, maintain messy spreadsheets, or just guess.

**BunkMath solves this.** One-tap daily tracking, subject-wise percentage, bunk calculator, and exam warnings — all in a beautiful dark UI built for Gen Z.

Inspired by [Razorpay Fix My Itch](https://razorpay.com/m/fix-my-itch).

## Live Demo

[https://bunkmath.vercel.app](https://bunkmath.vercel.app)

## Screenshots

| Setup Screen | Dashboard | Stats |
|---|---|---|
| ![Setup](screenshots/setup.png) | ![Dashboard](screenshots/dashboard.png) | ![Stats](screenshots/stats.png) |

## Features

- ⚡ **Per subject attendance tracking** — individual percentages for each subject
- 🟢 **Smart safe-skip counter** — know exactly how many classes you can bunk
- 🔴 **Recovery calculator** — tells you how many classes to attend if you're short
- 📅 **Timetable** — only shows today's subjects when marking attendance
- 🔥 **Streak tracker** — track consecutive days of marking attendance
- 📊 **Bunk budget calculator** — overall skip budget across all subjects
- ⚠️ **Exam eligibility warning** — alerts when you're at risk of being barred
- 🎓 **College template presets** — Engineering, Diploma CS, BCA/BSc for fast setup
- 📱 **Mid-semester entry** — join anytime with your current attendance numbers
- 💾 **Works offline** — no backend, no sign-up, uses localStorage only
- 🎨 **Dark purple Gen Z aesthetic** — glassmorphism + neon glow UI
- ⚙️ **Configurable** — works with any college's attendance policy (75/80/85%)

## The "Hidden Data" Problem & Our Clever Solution
During development, we attempted to scrape real-time attendance directly from University Portals. We discovered a massive roadblock: **Universities securely encapsulate raw attendance data (Attended / Total classes) on the backend server, and only ever transmit the final calculated percentage (e.g., "64%") to the frontend client to prevent exactly this kind of scraping.** 

Because the raw integers literally do not exist in the client network traffic, standard integration isn't possible.

To creatively bypass this backend restriction, we built the **Timetable Auto-Calculator**. 
- BunkMath houses a complete global calendar of University Holidays.
- Users input their weekly timetable (Days of the week) and their only known data point: the Aggregate Percentage.
- Our custom `calendar.js` algorithm maps their active days against the start of the semester, completely removing known university holidays to reverse-engineer the absolute number of `Conducted` classes.
- It then interpolates the raw `Attended` classes from the percentage, saving users from having to manually track their existing attendance records when onboarding!

## Tech Stack

| Technology | Usage |
|---|---|
| [React](https://react.dev) | UI framework |
| [Vite](https://vitejs.dev) | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [React Router v6](https://reactrouter.com) | Client-side routing |
| localStorage | Data persistence (no backend) |

## Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/attendanceiq.git
cd attendanceiq
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready to deploy.

## Project Structure

```
src/
├── App.jsx                 # Routes configuration
├── main.jsx                # Entry point + dark mode
├── index.css               # Global styles + glass effects
├── pages/
│   ├── SetupScreen.jsx     # First-time setup + templates
│   ├── Dashboard.jsx       # Main attendance dashboard
│   ├── StatsScreen.jsx     # Quick stats overview
│   └── ProfileScreen.jsx   # Settings + reset
└── components/
    ├── SubjectCard.jsx     # Individual subject attendance card
    ├── UpdateModal.jsx     # Daily attendance marking modal
    └── BottomNav.jsx       # Bottom navigation bar
```

## How It Works

1. **Setup** — Pick your college template (or custom), set min attendance %, choose subjects and their class days
2. **Daily** — Tap "Update Today" → mark each subject Present/Absent → done
3. **Track** — Dashboard shows real-time %, safe skips, recovery needed, and exam warnings

## Inspiration

Built from a real problem listed on [Razorpay Fix My Itch](https://razorpay.com/m/fix-my-itch).
Every Indian college student needs this.

## License

MIT
