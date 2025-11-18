#!/bin/bash

# Script to stop Docker and change ownership to deployer user
# Run this on the server as root

set -e

echo "🛑 Stopping Docker containers..."
cd /srv/hemaweb
docker compose down

echo "📦 Changing ownership of /srv/hemaweb to deployer..."
chown -R deployer:deployer /srv/hemaweb

echo "📦 Finding and changing ownership of Docker volumes..."
# Get volume names
VOLUMES=$(docker volume ls --format '{{.Name}}' | grep hemaweb || true)

if [ -n "$VOLUMES" ]; then
  echo "Found volumes:"
  echo "$VOLUMES"
  
  # Change ownership of volume data
  for volume in $VOLUMES; do
    VOLUME_PATH=$(docker volume inspect $volume --format '{{.Mountpoint}}')
    if [ -d "$VOLUME_PATH" ]; then
      echo "Changing ownership of $VOLUME_PATH..."
      chown -R deployer:deployer "$VOLUME_PATH"
    fi
  done
else
  echo "No hemaweb volumes found"
fi

echo "✅ Ownership changed successfully!"
echo ""
echo "You can now run Docker commands as deployer user:"
echo "  sudo -u deployer docker compose up -d"

