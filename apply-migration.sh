#!/bin/bash
ssh -i "c:/Work/keys/t.openssh" root@hemaweb.world << 'EOF'
docker exec hemaweb-postgres psql -U hemaweb -d hemaweb << 'SQL'
INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) 
VALUES ('20251119002757_add_notification_preferences_and_radius', '20251119002757_add_notification_preferences_and_radius', NOW(), '20251119002757_add_notification_preferences_and_radius', NULL, NULL, NOW(), 1) 
ON CONFLICT DO NOTHING;
SQL
EOF

