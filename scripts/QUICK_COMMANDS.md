# Quick Commands Cheatsheet

## SSH Connection

```bash
# As deployer user
ssh deployer@hemaweb.world

# As root (if needed)
ssh root@hemaweb.world
```

## GitHub Actions Runner

```bash
# Status
sudo systemctl status actions-runner

# Start
sudo systemctl start actions-runner

# Stop
sudo systemctl stop actions-runner

# Restart
sudo systemctl restart actions-runner

# Logs (live)
sudo journalctl -u actions-runner -f

# Last 100 lines of logs
sudo journalctl -u actions-runner -n 100
```

## Docker Compose

```bash
# Navigate to project folder
cd /srv/hemaweb

# Start all services
docker compose up -d

# Stop all services
docker compose down

# Rebuild and start
docker compose up -d --build

# Rebuild only API and Web
docker compose build web api
docker compose up -d web api

# Service status
docker compose ps

# All services logs
docker compose logs -f

# Specific service logs
docker compose logs api -f
docker compose logs web -f
docker compose logs postgres -f
docker compose logs nginx -f

# Last 50 lines of logs
docker compose logs api --tail 50
```

## Database

```bash
# Connect to PostgreSQL
docker compose exec postgres psql -U hemaweb -d hemaweb

# Execute SQL query
docker compose exec postgres psql -U hemaweb -d hemaweb -c "SELECT COUNT(*) FROM users;"

# Apply migrations
docker compose exec api pnpm db:migrate

# Seed with test data
docker compose exec api pnpm db:seed

# Open Prisma Studio (careful in production!)
docker compose exec api pnpm db:studio

# Database backup
docker compose exec postgres pg_dump -U hemaweb hemaweb > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
docker compose exec -T postgres psql -U hemaweb -d hemaweb < backup.sql
```

## Git Operations

```bash
cd /srv/hemaweb

# Check status
git status

# View last commits
git log --oneline -10

# Pull changes
git pull origin main

# Reset local changes
git reset --hard origin/main

# View changes
git diff
```

## Monitoring

```bash
# Container resource usage
docker stats

# Image sizes
docker images

# Volume sizes
docker system df

# Clean unused resources
docker system prune -a

# Check disk space
df -h

# Memory usage
free -h

# Processes
top
htop
```

## Health Checks

```bash
# Check API
curl http://localhost:3001/health

# Check Web
curl http://localhost:3000

# Check via external URL
curl https://hemaweb.world
curl https://hemaweb.world/api/health

# Check SSL certificate
curl -vI https://hemaweb.world 2>&1 | grep -i "SSL\|TLS"
```

## Service Restart

```bash
cd /srv/hemaweb

# Restart all
docker compose restart

# Restart specific service
docker compose restart api
docker compose restart web
docker compose restart nginx

# Full restart (with rebuild)
docker compose down
docker compose build
docker compose up -d
```

## Cleanup

```bash
# Stop and remove containers
docker compose down

# Stop and remove containers + volumes (CAREFUL!)
docker compose down -v

# Remove unused images
docker image prune -a

# Remove everything (VERY CAREFUL!)
docker system prune -a --volumes
```

## Access Permissions

```bash
# Check ownership
ls -la /srv/hemaweb

# Change ownership to deployer
sudo chown -R deployer:deployer /srv/hemaweb

# Check user groups
groups deployer

# Add to docker group
sudo usermod -aG docker deployer
```

## Environment Variables

```bash
# Edit .env
nano /srv/hemaweb/.env

# View variables (without values)
grep -v '^#' /srv/hemaweb/.env | grep -v '^$'

# After changing .env - restart
docker compose down
docker compose up -d
```

## Emergency Commands

```bash
# Stop all containers
docker stop $(docker ps -q)

# Kill all containers
docker kill $(docker ps -q)

# Reboot server
sudo reboot

# Check disk usage
du -sh /srv/hemaweb/*
du -sh /var/lib/docker/*
```
