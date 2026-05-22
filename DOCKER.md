# Docker Setup for Vinci Backend

This project includes Docker configuration for both development and production environments.

## Files Overview

- **Dockerfile** - Production-optimized multi-stage build
- **Dockerfile.dev** - Development build with watch mode and debugging
- **docker-compose.yml** - Production environment with PostgreSQL
- **docker-compose.dev.yml** - Development environment with live reload
- **.dockerignore** - Files to exclude from Docker builds

## Prerequisites

- Docker (version 20.10+)
- Docker Compose (version 1.29+)

## Development Environment

### Quick Start

```bash
# Start the development environment
docker-compose -f docker-compose.dev.yml up

# Or run in background
docker-compose -f docker-compose.dev.yml up -d
```

This will:

- Start PostgreSQL on port 5432
- Start NestJS app on port 3000 with watch mode enabled
- Mount your code for live reload
- Enable debugging on port 9229

### Access Services

- **Application**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Debugger**: chrome://devtools/remote/ws://localhost:9229

### Run Commands in Dev Container

```bash
# Run migrations
docker-compose -f docker-compose.dev.yml exec app npm run prisma:migrate

# Run tests
docker-compose -f docker-compose.dev.yml exec app npm run test

# View logs
docker-compose -f docker-compose.dev.yml logs -f app

# Stop all services
docker-compose -f docker-compose.dev.yml down
```

## Production Environment

### Setup

1. Create `.env` file with your production values:

```bash
cp .env.example .env
# Edit .env with your actual configuration
```

2. Ensure your Firebase service account key is available:

```bash
# Place your Firebase key at the project root
cp /path/to/firebase-key.json ./firebase-key.json
```

### Build and Run

```bash
# Build the production image
docker build -t vinci-back:latest .

# Start services
docker-compose up -d

# View logs
docker-compose logs -f app
```

### Environment Variables

Key variables in `docker-compose.yml`:

- `DB_USER` - PostgreSQL username (default: postgres)
- `DB_PASSWORD` - PostgreSQL password
- `DB_NAME` - Database name (default: vinci)
- `NODE_ENV` - Set to "production"
- `JWT_SECRET` - Your JWT secret key (⚠️ change from default)
- `APP_URL` - Application URL for external access

### Database Migrations

Migrations run automatically on app startup. To manually run:

```bash
docker-compose exec app npx prisma migrate deploy
```

### Backup Database

```bash
# Backup
docker-compose exec db pg_dump -U postgres vinci > backup.sql

# Restore
docker-compose exec -T db psql -U postgres vinci < backup.sql
```

## Common Commands

### Development

```bash
# Start services
docker-compose -f docker-compose.dev.yml up

# Stop services
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f [service-name]

# Rebuild image
docker-compose -f docker-compose.dev.yml build --no-cache

# Access database
docker-compose -f docker-compose.dev.yml exec db psql -U postgres -d vinci
```

### Production

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f app

# Restart app
docker-compose restart app

# Access database
docker-compose exec db psql -U postgres -d vinci
```

## Health Checks

Both the app and database have health checks configured:

```bash
# Check app health
docker-compose ps

# Manual health check
curl http://localhost:3000/health
```

## Volumes

- **postgres_data** - PostgreSQL data persistence
- **./uploads** - Application uploads directory
- **./firebase-key.json** - Firebase credentials (mounted read-only)

## Network

All services communicate on the `vinci-network` (or `vinci-network-dev` in dev mode).

## Troubleshooting

### App won't connect to database

- Ensure PostgreSQL container is healthy: `docker-compose ps`
- Check database credentials in `.env`
- Verify `DATABASE_URL` format: `postgresql://user:password@db:5432/dbname`

### Port conflicts

If ports 3000 or 5432 are in use:

- Change in `.env`: `APP_PORT=3001` or `DB_PORT=5433`
- Or modify `docker-compose.yml` port mappings

### Rebuild after dependency changes

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

## Performance Tips

- Use `.dockerignore` to exclude unnecessary files
- Keep dependencies minimal
- Use alpine images (already configured)
- Mount volumes only when needed

## Security Notes

⚠️ **Important for Production:**

- Change `JWT_SECRET` from default value
- Use strong database password
- Store `.env` securely (not in version control)
- Use environment-specific compose files
- Enable HTTPS in production
- Use dedicated database credentials
- Restrict network access appropriately

## References

- [NestJS Docker Guide](https://docs.nestjs.com/deployment/docker)
- [Prisma Docker Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-docker)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
