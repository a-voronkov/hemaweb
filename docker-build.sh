#!/bin/bash

# Docker build script with caching optimization
# This script builds Docker images with layer caching enabled

set -e

echo "🚀 Starting optimized Docker build..."

# Enable BuildKit for better caching
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Build with cache
echo "📦 Building images with cache..."
docker-compose build --parallel

echo "✅ Build complete!"
echo ""
echo "To start the services, run:"
echo "  docker-compose up -d"

