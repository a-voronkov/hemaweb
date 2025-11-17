-- Migration: Add blood drive registrations and radiusKm field

-- Add radiusKm field to blood_drives table
ALTER TABLE blood_drives ADD COLUMN IF NOT EXISTS "radiusKm" DOUBLE PRECISION DEFAULT 10;

-- Create blood_drive_registrations table
CREATE TABLE IF NOT EXISTS blood_drive_registrations (
  id TEXT PRIMARY KEY,
  "bloodDriveId" TEXT NOT NULL,
  "profileId" TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'registered',
  notes TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT blood_drive_registrations_bloodDriveId_fkey 
    FOREIGN KEY ("bloodDriveId") REFERENCES blood_drives(id) ON DELETE CASCADE,
  CONSTRAINT blood_drive_registrations_profileId_fkey 
    FOREIGN KEY ("profileId") REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT blood_drive_registrations_bloodDriveId_profileId_key 
    UNIQUE ("bloodDriveId", "profileId")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS blood_drive_registrations_bloodDriveId_idx 
  ON blood_drive_registrations("bloodDriveId");
CREATE INDEX IF NOT EXISTS blood_drive_registrations_profileId_idx 
  ON blood_drive_registrations("profileId");

-- Show results
SELECT 'Migration completed successfully' as status;
SELECT COUNT(*) as blood_drives_count FROM blood_drives;
SELECT COUNT(*) as registrations_count FROM blood_drive_registrations;

