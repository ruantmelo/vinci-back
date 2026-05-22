A social network that allows users share photos

## Features

- Push Notification
- Responsive
- Image upload

## Tech Stack

**Client:** Next.js and TailwindCSS [Frontend repository](https://github.com/ruan-melo/vinci-front/)

**Server:** NestJS, GraphQL and Firebase (Realtime Database, Cloud Messaging)

## How to Run

This repository contains the backend for Vinci (NestJS + GraphQL + Prisma).

Prerequisites

- Node.js 18+ and npm
- Docker & Docker Compose (recommended for local development)

Environment configuration

1. Copy the example env file and edit values:

   cp .env.example .env

2. Important environment variables (add or verify in `.env`):

- `DB_USER` — Postgres user (default: `postgres`)
- `DB_PASSWORD` — Postgres password
- `DB_NAME` — Postgres database name (default: `vinci`)
- `DB_PORT` — Postgres port (default: `5432`)
- `DATABASE_URL` — Optional; if set, must match the DB connection string format
- `NODE_ENV` — `development` or `production`
- `JWT_SECRET` — JWT signing secret (change in production)
- `JWT_EXPIRES_IN` — e.g. `7d`
- `PASSWORD_ROUNDS` — bcrypt salt rounds (default: `10`)
- `STORAGE_TYPE` — `disk` or other configured providers
- `GOOGLE_APPLICATION_CREDENTIALS` — path to Firebase key (when using Firebase)
- `FIREBASE_DATABASE_URL` — Firebase database URL

Running locally (without Docker)

1. Install dependencies:

   npm ci

2. If you changed Prisma schema or want to apply migrations locally (development):

   npx prisma migrate dev

3. Run in development mode (watch + reload):

   npm run start:dev

4. Build and run production mode:

   npm run build
   npm run start:prod

Running with Docker (recommended)

Development (live reload):

    docker-compose -f docker-compose.dev.yml up --build

Production (compose):

    # make sure .env and firebase-key.json (if used) are configured
    docker-compose up --build -d

Running migrations inside the container

    # run once after the database is ready
    docker-compose exec app npx prisma migrate deploy

Testing

    npm run test

Useful commands

- View logs:

  docker-compose logs -f app

- Stop services:

  docker-compose down

Notes

- Keep `.env` out of version control and change `JWT_SECRET` for production.
- Uploaded files are stored in the `uploads/` folder (mounted in Docker compose).
- See `DOCKER.md` for additional Docker usage and troubleshooting tips.
