# pgAdmin Setup Guide

## Overview

pgAdmin is a web-based database management tool for PostgreSQL. It's accessible at `https://pgadmin.hemaweb.world` and protected by the same Basic Auth as the Traefik dashboard.

## Access

- **URL**: https://pgadmin.hemaweb.world
- **Basic Auth**: Same credentials as Traefik dashboard (configured in `TRAEFIK_DASHBOARD_AUTH`)
- **pgAdmin Login**: 
  - Email: Set in `PGADMIN_EMAIL` (default: `admin@hemaweb.world`)
  - Password: Set in `PGADMIN_PASSWORD`

## First Time Setup

### 1. Access pgAdmin

1. Navigate to https://pgadmin.hemaweb.world
2. Enter Basic Auth credentials (Traefik dashboard credentials)
3. Login with pgAdmin credentials (email/password from .env)

### 2. Add PostgreSQL Server

After logging in, you need to add the PostgreSQL server:

1. **Right-click on "Servers"** in the left sidebar
2. **Select "Register" → "Server"**

3. **General Tab**:
   - Name: `HemaWeb Production` (or any name you prefer)

4. **Connection Tab**:
   - Host name/address: `postgres` (Docker service name)
   - Port: `5432`
   - Maintenance database: `hemaweb` (or value from `POSTGRES_DB`)
   - Username: `hemaweb` (or value from `POSTGRES_USER`)
   - Password: Value from `POSTGRES_PASSWORD` in .env
   - Save password: ✅ (optional, for convenience)

5. **Click "Save"**

### 3. Browse Database

Once connected, you can:
- Browse tables and schemas
- Run SQL queries
- View data
- Manage users and permissions
- Monitor database performance
- Create backups

## Security Considerations

### Two-Layer Authentication

pgAdmin is protected by **two layers of authentication**:

1. **Basic Auth (Traefik)**: First layer, same as Traefik dashboard
2. **pgAdmin Login**: Second layer, pgAdmin's own authentication

This provides defense in depth.

### Production Recommendations

1. **Change Default Passwords**:
   ```bash
   # Generate strong password for pgAdmin
   openssl rand -base64 32
   
   # Update .env on server
   PGADMIN_PASSWORD="your-strong-password-here"
   ```

2. **Restrict Access by IP** (optional):
   Add to docker-compose.yml:
   ```yaml
   labels:
     - "traefik.http.middlewares.pgadmin-ipwhitelist.ipwhitelist.sourcerange=YOUR_IP/32"
     - "traefik.http.routers.pgadmin.middlewares=pgadmin-auth,pgadmin-ipwhitelist"
   ```

3. **Use VPN**: Consider accessing pgAdmin only through VPN

4. **Regular Updates**: Keep pgAdmin image updated
   ```bash
   docker compose pull pgadmin
   docker compose up -d pgadmin
   ```

## Common Tasks

### View All Tables

1. Expand: Servers → HemaWeb Production → Databases → hemaweb → Schemas → public → Tables
2. Right-click on a table → View/Edit Data → All Rows

### Run SQL Query

1. Right-click on database → Query Tool
2. Write your SQL query
3. Press F5 or click Execute button

Example queries:

```sql
-- Count all users
SELECT COUNT(*) FROM users;

-- View all roles
SELECT * FROM user_role_ref;

-- Check recent donations
SELECT * FROM donation_records 
ORDER BY donation_date DESC 
LIMIT 10;

-- View medical centers with organization
SELECT 
  mc.name as center_name,
  mo.name as organization_name,
  mc.city
FROM medical_centers mc
JOIN medical_organizations mo ON mc.organization_id = mo.id;
```

### Export Data

1. Right-click on table → Import/Export
2. Select "Export"
3. Choose format (CSV, JSON, etc.)
4. Configure options
5. Click OK

### Create Backup

1. Right-click on database → Backup
2. Choose filename and format
3. Select backup options
4. Click Backup

## Troubleshooting

### Cannot Connect to Database

**Error**: "could not connect to server"

**Solution**:
- Ensure PostgreSQL container is running: `docker ps | grep postgres`
- Check connection details match .env values
- Use `postgres` as hostname (Docker service name), not `localhost`

### Forgot pgAdmin Password

**Solution**:
1. SSH to server
2. Update .env with new password
3. Restart pgAdmin:
   ```bash
   docker compose restart pgadmin
   ```

### Basic Auth Not Working

**Solution**:
- Verify `TRAEFIK_DASHBOARD_AUTH` is set correctly in .env
- Regenerate hash if needed:
  ```bash
  docker run --rm httpd:alpine htpasswd -nb admin your_password
  ```
- Update .env and restart Traefik:
  ```bash
  docker compose restart traefik
  ```

### pgAdmin Shows "Server Not Found"

**Solution**:
- The server connection was not saved
- Re-add the server following "First Time Setup" steps above

## Useful pgAdmin Features

### Query History

- View → Query History
- See all previously executed queries

### Dashboard

- Click on database name
- View real-time statistics:
  - Active connections
  - Database size
  - Transaction rate
  - Tuple statistics

### ERD (Entity Relationship Diagram)

- Right-click on database → ERD For Database
- Visual representation of table relationships

### Monitoring

- Dashboard → Server Activity
- View active queries and connections
- Kill long-running queries if needed

## Maintenance

### Regular Tasks

1. **Monitor Database Size**:
   ```sql
   SELECT pg_size_pretty(pg_database_size('hemaweb'));
   ```

2. **Check Active Connections**:
   ```sql
   SELECT * FROM pg_stat_activity;
   ```

3. **Vacuum Database** (if needed):
   ```sql
   VACUUM ANALYZE;
   ```

4. **Update Statistics**:
   ```sql
   ANALYZE;
   ```

## Uninstalling

To remove pgAdmin:

```bash
# Stop and remove container
docker compose stop pgadmin
docker compose rm pgadmin

# Remove volume (optional - deletes all pgAdmin data)
docker volume rm hemaweb_pgadmin_data
```

Then remove the pgAdmin service from docker-compose.yml.

## Related Documentation

- [DATABASE_SCHEMA_V2.md](./DATABASE_SCHEMA_V2.md) - Database schema documentation
- [QUICK_START.md](./QUICK_START.md) - Project setup guide
- [Official pgAdmin Documentation](https://www.pgadmin.org/docs/)

