#!/bin/bash

# Script to setup GitHub Actions runner as a systemd service
# Run this on the server as root

set -e

echo "🔧 Setting up GitHub Actions runner as systemd service..."

# Create systemd service file
cat > /etc/systemd/system/actions-runner.service << 'EOF'
[Unit]
Description=GitHub Actions Runner
After=network.target

[Service]
Type=simple
User=deployer
WorkingDirectory=/srv/actions-runner
ExecStart=/srv/actions-runner/run.sh
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=actions-runner

# Environment
Environment="RUNNER_ALLOW_RUNASROOT=0"

[Install]
WantedBy=multi-user.target
EOF

echo "✅ Systemd service file created"

# Reload systemd
systemctl daemon-reload

# Enable service to start on boot
systemctl enable actions-runner.service

# Start the service
systemctl start actions-runner.service

echo "✅ Service started"

# Check status
systemctl status actions-runner.service --no-pager

echo ""
echo "🎉 GitHub Actions runner is now running as a systemd service!"
echo ""
echo "Useful commands:"
echo "  sudo systemctl status actions-runner   # Check status"
echo "  sudo systemctl stop actions-runner     # Stop service"
echo "  sudo systemctl start actions-runner    # Start service"
echo "  sudo systemctl restart actions-runner  # Restart service"
echo "  sudo journalctl -u actions-runner -f   # View logs"

