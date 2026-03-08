# TWICEFLIX

TWICEFLIX is a fan-made streaming platform that archives all TWICE YouTube content — videos, shorts, and playlists — in one place. Built with Next.js, Supabase, and Redis, it features a custom sync pipeline that pulls data directly from the YouTube API and serves it with edge-cached endpoints for fast, global performance.

## Features

- **Video Browsing:** Browse all TWICE videos with thumbnail previews and filter by member or category
- **Shorts:** Dedicated section for TWICE YouTube Shorts
- **Playlists:** Browse and watch full TWICE playlists
- **Search:** Full-text search across videos, shorts, and playlists
- **Responsive Design:** Optimized for both desktop and mobile

## Tech Stack

- **Next.js** — React framework with App Router
- **Supabase** — PostgreSQL database with full-text search
- **Redis (Upstash)** — Edge caching for fast global performance
- **YouTube API** — Sync pipeline to fetch videos and playlists
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — Component library
- **Vercel** — Deployment and edge runtime

## Prerequisites

- Node.js and npm installed
- Supabase project with configured tables
- Upstash Redis instance
- YouTube Data API v3 key

## Installation

1. **Clone this repository:**

```bash
git clone https://github.com/rapsign/Twiceflix.git
cd twiceflix
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

```bash
NEXT_PUBLIC_YOUTUBE_API_KEY=your-youtube-api-key
NEXT_PUBLIC_API_TWICE_MEMBERS=https://qing762.is-a.dev
NEXT_PUBLIC_API_BASE=https://twiceflix-api.vercel.app/api
NEXT_PUBLIC_API_KEY= # Contact me to get the API key


```

4. **Run development server:**

```bash
npm run dev
```

The app will be available at http://localhost:3000.

## API

TWICEFLIX has a separate API project that handles data fetching and caching. See [TWICEFLIX API](https://twiceflix-api.vercel.app/) for full documentation.

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## Contact

Have questions, suggestions, or want to contribute? Feel free to reach out!

- 🌐 Portfolio: [rinaldi-a-prayuda.vercel.app](https://rinaldi-a-prayuda.vercel.app/)
- 💻 GitHub: [@username](https://github.com/rapsign)

> This project is a fan-made platform and is not affiliated with or endorsed by JYP Entertainment or TWICE.
