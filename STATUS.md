# Project Status

## Current State

**Production URL:** <https://hemaweb.world>
**API URL:** <https://hemaweb.world/api>
**Status:** Deployed and operational

## Infrastructure

### Server

- **Provider:** Digital Ocean
- **Domain:** hemaweb.world
- **SSL:** Active (Let's Encrypt)
- **Location:** /srv/hemaweb

### Services

All services running via Docker Compose:

- **Web (Next.js):** Port 3000
- **API (NestJS):** Port 3001
- **PostgreSQL:** Port 5432
- **Redis:** Port 6379
- **Nginx:** Ports 80, 443

### Deployment

- **Method:** GitHub Actions with self-hosted runner
- **Trigger:** Push to main branch
- **Process:** Automated build and deployment
- **User:** deployer

## Verification Results

### Container Status

All containers running successfully:

- postgres: healthy
- redis: healthy
- web: running
- api: running
- nginx: running

### Service Health

- HTTP (80): Working
- HTTPS (443): Working with valid SSL certificate
- API endpoint: Responding correctly
- Frontend: Accessible

### Known Issues

None critical. Minor warnings:

- Redis memory overcommit warning (non-critical for production)
- Nginx http2 syntax deprecation (already fixed in code, pending deployment)

## Recent Changes

1. Fixed TypeScript errors (13 issues resolved)
2. Simplified docker-compose.yml
3. Configured GitHub Actions Runner as systemd service
4. Set up automated deployment pipeline
5. Fixed file permissions for deployer user
6. Cleaned up documentation (removed emojis, translated to English)

## Next Steps

1. Test automated deployment workflow
2. Monitor application performance
3. Set up monitoring and alerting
4. Configure database backups
5. Review and optimize resource usage

## Access

### SSH

```bash
ssh deployer@hemaweb.world
ssh root@hemaweb.world
```

### Service Management

```bash
# GitHub Actions Runner
sudo systemctl status actions-runner

# Docker services
cd /srv/hemaweb
docker compose ps
docker compose logs -f
```

### Database

```bash
docker compose exec postgres psql -U hemaweb -d hemaweb
```

## Documentation

- Main README: [README.md](./README.md)
- Server Setup: [scripts/README.md](./scripts/README.md)
- Quick Commands: [scripts/QUICK_COMMANDS.md](./scripts/QUICK_COMMANDS.md)
- Deployment Guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Production Setup: [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md)

## Contact

For issues or questions, please open an issue on GitHub.

