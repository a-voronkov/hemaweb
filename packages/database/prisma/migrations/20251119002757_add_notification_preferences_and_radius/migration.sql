-- AlterTable: Add notification preferences to profiles table
-- First drop the incorrectly named columns if they exist
ALTER TABLE "profiles" DROP COLUMN IF EXISTS emailnotifications;
ALTER TABLE "profiles" DROP COLUMN IF EXISTS notifyblooddrives;
ALTER TABLE "profiles" DROP COLUMN IF EXISTS notifyeligibility;
ALTER TABLE "profiles" DROP COLUMN IF EXISTS notificationradius;
ALTER TABLE "profiles" DROP COLUMN IF EXISTS notifyemergencyonly;
ALTER TABLE "profiles" DROP COLUMN IF EXISTS notifymybloodtypeonly;

-- Now add columns with correct camelCase names
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "emailNotifications" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "notifyBloodDrives" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "notifyEligibility" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "notificationRadius" INTEGER NOT NULL DEFAULT 10;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "notifyEmergencyOnly" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "notifyMyBloodTypeOnly" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable: Add radiusKm to blood_drives table
ALTER TABLE "blood_drives" ADD COLUMN IF NOT EXISTS "radiusKm" DOUBLE PRECISION DEFAULT 10;

