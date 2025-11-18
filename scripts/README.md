# Server Setup Scripts

Scripts for setting up hemaweb.world server

## 1. Setup GitHub Actions Runner as System Service

Run on server as root:

```bash
cd /srv/hemaweb/scripts
chmod +x setup-runner-service.sh
sudo ./setup-runner-service.sh
```

This will create a systemd service that automatically starts the runner on system boot and restarts it on failures.

### Service Management

```bash
# Check status
sudo systemctl status actions-runner

# Stop
sudo systemctl stop actions-runner

# Start
sudo systemctl start actions-runner

# Restart
sudo systemctl restart actions-runner

# View logs
sudo journalctl -u actions-runner -f
```

## 2. Change Folder Ownership to deployer

Run on server as root:

```bash
cd /srv/hemaweb/scripts
chmod +x change-ownership.sh
sudo ./change-ownership.sh
```

This will:

- Stop all Docker containers
- Change ownership of `/srv/hemaweb` to `deployer:deployer`
- Change ownership of all Docker volumes to `deployer:deployer`

## 3. Add deployer to docker Group

To allow deployer user to manage Docker without sudo:

```bash
sudo usermod -aG docker deployer
```

After this, deployer needs to log out and log back in for changes to take effect.

## 4. Setup GitHub Actions Runner

1. Go to repository settings on GitHub
2. Settings → Actions → Runners → New self-hosted runner
3. Select Linux and follow instructions to setup runner
4. During setup, add label `hemaweb`
5. After setup, run script `setup-runner-service.sh`

## 5. Verify Setup

After completing all steps, verify:

```bash
# Check that runner is working
sudo systemctl status actions-runner

# Check that deployer can manage Docker
sudo -u deployer docker ps

# Check folder ownership
ls -la /srv/hemaweb
```

## Deployment Structure

After setup, deployment works as follows:

1. Push to main branch → GitHub Actions triggers workflow
2. Workflow executes on self-hosted runner (on the same server)
3. Runner executes commands as deployer:
   - Pulls code from GitHub
   - Builds Docker images
   - Restarts containers
4. Services update without downtime (thanks to Docker Compose)

## Environment Variables

Create `.env` file in `/srv/hemaweb`:

```bash
# Database
POSTGRES_USER=hemaweb
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=hemaweb
DATABASE_URL=postgresql://hemaweb:your_secure_password@postgres:5432/hemaweb

# Redis
REDIS_PASSWORD=your_redis_password
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# App
NODE_ENV=production
CORS_ORIGIN=https://hemaweb.world
FRONTEND_URL=https://hemaweb.world
NEXT_PUBLIC_API_URL=https://hemaweb.world/api
NEXT_PUBLIC_APP_URL=https://hemaweb.world
NEXT_PUBLIC_APP_NAME=HemaWeb
```

## Troubleshooting

### Runner not starting

```bash
# Check logs
sudo journalctl -u actions-runner -n 50

# Check permissions
ls -la /srv/actions-runner
```

### Docker not working for deployer

```bash
# Check user groups
groups deployer

# Add to docker group
sudo usermod -aG docker deployer

# Re-login
```

### Containers not starting

```bash
# Check logs
docker compose logs

# Check status
docker compose ps

# Rebuild
docker compose build --no-cache
docker compose up -d
```
