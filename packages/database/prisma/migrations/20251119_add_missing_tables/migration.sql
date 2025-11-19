-- CreateTable: Donor Favorite Locations
CREATE TABLE IF NOT EXISTS "donor_favorite_locations" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "radiusKm" INTEGER NOT NULL DEFAULT 5,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donor_favorite_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Blood Drive Registrations
CREATE TABLE IF NOT EXISTS "blood_drive_registrations" (
    "id" TEXT NOT NULL,
    "bloodDriveId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'registered',
    "notes" TEXT,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blood_drive_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "donor_favorite_locations_profileId_idx" ON "donor_favorite_locations"("profileId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "donor_favorite_locations_isActive_idx" ON "donor_favorite_locations"("isActive");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "blood_drive_registrations_bloodDriveId_idx" ON "blood_drive_registrations"("bloodDriveId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "blood_drive_registrations_profileId_idx" ON "blood_drive_registrations"("profileId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "blood_drive_registrations_status_idx" ON "blood_drive_registrations"("status");

-- AddForeignKey
ALTER TABLE "donor_favorite_locations" ADD CONSTRAINT "donor_favorite_locations_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_drive_registrations" ADD CONSTRAINT "blood_drive_registrations_bloodDriveId_fkey" FOREIGN KEY ("bloodDriveId") REFERENCES "blood_drives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_drive_registrations" ADD CONSTRAINT "blood_drive_registrations_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

