-- Current Prisma schema uses medical_centers."workingHours", but the initial
-- migration only created "operatingHours". Keep this idempotent because the
-- temporary production instance was bootstrapped manually before this migration
-- was added.
ALTER TABLE "medical_centers" ADD COLUMN IF NOT EXISTS "workingHours" JSONB;
