# pgAdmin Access Instructions

## Quick Access

**URL**: https://pgadmin.hemaweb.world

## Login Steps

### Step 1: Basic Authentication (Traefik)
When you open the URL, you'll see a browser login prompt:
- **Username**: `admin` (same as Traefik dashboard)
- **Password**: Your Traefik dashboard password

### Step 2: pgAdmin Login
After Basic Auth, you'll see the pgAdmin login page:
- **Email**: `admin@hemaweb.world`
- **Password**: `HemaWeb2025!`

## First Time Setup - Add Database Server

After logging in for the first time:

1. **Right-click on "Servers"** in the left sidebar
2. **Select "Register" → "Server"**
3. **Fill in the details**:

   **General Tab**:
   - Name: `HemaWeb Production`

   **Connection Tab**:
   - Host: `postgres`
   - Port: `5432`
   - Database: `hemaweb`
   - Username: `hemaweb`
   - Password: (check .env file on server for `POSTGRES_PASSWORD`)
   - ✅ Save password

4. **Click "Save"**

## Common Tasks

### View Tables
1. Expand: Servers → HemaWeb Production → Databases → hemaweb → Schemas → public → Tables
2. Right-click on any table → View/Edit Data → All Rows

### Run SQL Query
1. Right-click on database → Query Tool
2. Write your SQL
3. Press F5 or click Execute

### Example Queries

```sql
-- Count users by role
SELECT r.name, COUNT(*) 
FROM users u 
JOIN user_role_ref r ON u."roleId" = r.id 
GROUP BY r.name;

-- View all medical centers
SELECT 
  mc.name as center,
  mo.name as organization,
  mc.city
FROM medical_centers mc
JOIN medical_organizations mo ON mc."organizationId" = mo.id;

-- Recent donations
SELECT * FROM donation_records 
ORDER BY "donationDate" DESC 
LIMIT 10;
```

## Security Notes

- pgAdmin is protected by **two layers** of authentication
- Only accessible via HTTPS with Let's Encrypt certificate
- Same Basic Auth as Traefik dashboard for consistency
- Keep credentials secure!

## Full Documentation

See [docs/PGADMIN_SETUP.md](docs/PGADMIN_SETUP.md) for complete documentation.

