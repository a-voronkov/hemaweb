#!/bin/bash

# HemaWeb Deployment Script for hemaweb.world
# This script deploys the application to Digital Ocean droplet

set -e  # Exit on error

echo "🚀 HemaWeb Deployment Script"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/srv/hemaweb"
REPO_URL="https://github.com/a-voronkov/hemaweb.git"
BRANCH="main"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    log_error "Please run as root (use sudo)"
    exit 1
fi

# Step 1: Update system
log_info "Updating system packages..."
apt update && apt upgrade -y

# Step 2: Install dependencies
log_info "Installing dependencies..."
apt install -y git curl wget nginx certbot python3-certbot-nginx

# Step 3: Install Node.js 20 LTS
if ! command -v node &> /dev/null; then
    log_info "Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
else
    log_info "Node.js already installed: $(node --version)"
fi

# Step 4: Install pnpm
if ! command -v pnpm &> /dev/null; then
    log_info "Installing pnpm..."
    npm install -g pnpm
else
    log_info "pnpm already installed: $(pnpm --version)"
fi

# Step 5: Install Docker (if not installed)
if ! command -v docker &> /dev/null; then
    log_info "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
else
    log_info "Docker already installed: $(docker --version)"
fi

# Step 6: Install Docker Compose (if not installed)
if ! command -v docker-compose &> /dev/null; then
    log_info "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    log_info "Docker Compose already installed: $(docker-compose --version)"
fi

# Step 7: Create project directory
log_info "Creating project directory..."
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# Step 8: Clone or update repository
if [ -d ".git" ]; then
    log_info "Updating repository..."
    git fetch origin
    git reset --hard origin/$BRANCH
    git pull origin $BRANCH
else
    log_info "Cloning repository..."
    git clone $REPO_URL .
    git checkout $BRANCH
fi

# Step 9: Copy environment files
log_info "Setting up environment files..."
if [ ! -f ".env" ]; then
    if [ -f ".env.production" ]; then
        cp .env.production .env
        log_info "Copied .env.production to .env"
    else
        log_warn ".env.production not found, using .env.example"
        cp .env.example .env
    fi
fi

if [ ! -f "packages/database/.env" ]; then
    echo "DATABASE_URL=\"postgresql://hemaweb:HW_db_P@ssw0rd_2024_Secure!@localhost:5432/hemaweb\"" > packages/database/.env
    log_info "Created packages/database/.env"
fi

# Step 10: Install dependencies
log_info "Installing project dependencies..."
pnpm install

# Step 11: Start Docker services
log_info "Starting Docker services..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Wait for PostgreSQL to be ready
log_info "Waiting for PostgreSQL to be ready..."
sleep 10

# Step 12: Run database migrations
log_info "Running database migrations..."
pnpm db:migrate

# Step 13: Seed database (only on first deployment)
if [ "$1" == "--seed" ]; then
    log_info "Seeding database..."
    pnpm db:seed
fi

# Step 14: Build applications (when ready)
# log_info "Building applications..."
# pnpm build

log_info "Deployment completed successfully! ✅"
echo ""
echo "Next steps:"
echo "1. Configure Nginx reverse proxy"
echo "2. Setup SSL with Let's Encrypt"
echo "3. Start application services"
echo ""
echo "Run './deploy.sh --seed' to seed the database on first deployment"

