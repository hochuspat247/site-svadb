# Wedding Invite Site

Frontend is built with Vite + React. Backend is a separate Node.js API with PostgreSQL.

## Stack

- Frontend: Vite, React
- Backend: Express
- Database: PostgreSQL

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL`.
3. Run the SQL from [server/schema.sql](/c:/Users/kulag/Downloads/Свадебное приглашение сайт/server/schema.sql:1).
4. Start frontend and backend together with `npm run dev:full`.

Frontend runs on `http://localhost:5173`.
Backend runs on `http://localhost:3001`.

## Production

Use a separate server directory, for example `/opt/wedding-invite`, and do not place this app inside `/opt/tennis-project-backend`.

Production deploy files are in [deploy/README.md](/c:/Users/kulag/Downloads/Свадебное приглашение сайт/deploy/README.md:1).

## API

- `POST /api/register` - RSVP registration
- `GET /api/guests` - guest list
- `POST /api/gift/book` - reserve a gift
- `GET /api/gifts` - get gift reservations
- `POST /api/music` - add a song request
- `GET /api/music` - get song requests

## Notes

- The frontend now talks to the local backend through `/api`.
- In development, Vite proxies `/api` to `http://localhost:3001`.
- Photos are stored as text data URLs in PostgreSQL, matching the current UI behavior.
