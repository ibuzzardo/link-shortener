# URL Shortener

> Built with [Dark Factory v4](https://github.com/ibuzzardo/dark-factory-v4) — autonomous AI software development pipeline

**[Live Demo](https://link-shortener-six-orpin.vercel.app)**


A URL shortener API with analytics dashboard built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- Shorten URLs with 6-character alphanumeric codes
- Click tracking and analytics
- Dark-themed responsive dashboard
- In-memory storage (no database required)
- RESTful API endpoints

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd link-shortener
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:4004`.

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### POST /api/shorten
Shorten a URL.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "shortCode": "abc123",
  "shortUrl": "http://localhost:4004/api/abc123",
  "originalUrl": "https://example.com"
}
```

### GET /api/[code]
Redirect to the original URL and increment click count.

**Response:** 302 redirect or 404 if code not found.

### GET /api/stats
Get analytics for all shortened URLs.

**Response:**
```json
[
  {
    "shortCode": "abc123",
    "originalUrl": "https://example.com",
    "clicks": 5,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## Environment Variables

- `PORT`: Server port (default: 4004)
- `NEXT_PUBLIC_BASE_URL`: Base URL for short links

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Storage:** In-memory Map
- **Validation:** Zod

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── [code]/route.ts    # Redirect endpoint
│   │   ├── shorten/route.ts   # URL shortening endpoint
│   │   └── stats/route.ts     # Analytics endpoint
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Dashboard page
└── lib/
    ├── store.ts               # In-memory storage
    ├── types.ts               # TypeScript interfaces
    └── utils.ts               # Utility functions
```