-- Initialize PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Verify PostGIS installation
SELECT PostGIS_Version();

-- Create initial schema (will be managed by Prisma migrations later)
-- This is just to verify the database is working

COMMENT ON DATABASE hemaweb IS 'HemaWeb - Blood Donation Platform Database';

