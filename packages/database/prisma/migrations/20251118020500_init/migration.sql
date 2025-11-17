-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis" WITH VERSION "3.4.0";

-- CreateTable
CREATE TABLE "blood_type_ref" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blood_type_ref_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role_ref" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "permissions" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_role_ref_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blood_drive_status_ref" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blood_drive_status_ref_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blood_drive_type_ref" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blood_drive_type_ref_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availability_status_ref" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "availability_status_ref_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_type_ref" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "template" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_type_ref_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "bloodTypeId" TEXT,
    "availabilityStatusId" TEXT,
    "isDonorVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastDonationDate" TIMESTAMP(3),
    "nextEligibleDate" TIMESTAMP(3),
    "locationLat" DOUBLE PRECISION,
    "locationLng" DOUBLE PRECISION,
    "locationGeography" geography(Point, 4326),
    "address" TEXT,
    "city" TEXT,
    "country" TEXT DEFAULT 'Thailand',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_center_staff" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "medicalCenterId" TEXT,
    "organizationId" TEXT,
    "position" TEXT,
    "licenseNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_center_staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_admins" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "website" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "medical_organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_centers" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Thailand',
    "locationLat" DOUBLE PRECISION,
    "locationLng" DOUBLE PRECISION,
    "locationGeography" geography(Point, 4326),
    "phone" TEXT,
    "email" TEXT,
    "logoUrl" TEXT,
    "website" TEXT,
    "operatingHours" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "medical_centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blood_drives" (
    "id" TEXT NOT NULL,
    "medicalCenterId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "locationLat" DOUBLE PRECISION,
    "locationLng" DOUBLE PRECISION,
    "locationGeography" geography(Point, 4326),
    "address" TEXT,
    "city" TEXT,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3),
    "targetDonors" INTEGER,
    "actualDonors" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "blood_drives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blood_drive_blood_types" (
    "id" TEXT NOT NULL,
    "bloodDriveId" TEXT NOT NULL,
    "bloodTypeId" TEXT NOT NULL,
    "quantity" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blood_drive_blood_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donation_records" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "medicalCenterId" TEXT NOT NULL,
    "recordedById" TEXT NOT NULL,
    "bloodTypeId" TEXT NOT NULL,
    "donationDate" TIMESTAMP(3) NOT NULL,
    "volumeMl" INTEGER NOT NULL,
    "hemoglobinLevel" DOUBLE PRECISION,
    "bloodPressure" TEXT,
    "notes" TEXT,
    "certificateUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "donation_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_records" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "medicalCenterId" TEXT NOT NULL,
    "verifiedById" TEXT NOT NULL,
    "bloodTypeId" TEXT NOT NULL,
    "isEligible" BOOLEAN NOT NULL,
    "weight" DOUBLE PRECISION,
    "hemoglobinLevel" DOUBLE PRECISION,
    "bloodPressure" TEXT,
    "certificateUrl" TEXT,
    "notes" TEXT,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "verification_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "information_records" (
    "id" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "tags" TEXT[],
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "information_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_verification_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suspension_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "suspendedById" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "suspendedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsuspendedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "suspension_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blood_type_ref_code_key" ON "blood_type_ref"("code");

-- CreateIndex
CREATE UNIQUE INDEX "user_role_ref_code_key" ON "user_role_ref"("code");

-- CreateIndex
CREATE UNIQUE INDEX "blood_drive_status_ref_code_key" ON "blood_drive_status_ref"("code");

-- CreateIndex
CREATE UNIQUE INDEX "blood_drive_type_ref_code_key" ON "blood_drive_type_ref"("code");

-- CreateIndex
CREATE UNIQUE INDEX "availability_status_ref_code_key" ON "availability_status_ref"("code");

-- CreateIndex
CREATE UNIQUE INDEX "notification_type_ref_code_key" ON "notification_type_ref"("code");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_roleId_idx" ON "users"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE INDEX "profiles_userId_idx" ON "profiles"("userId");

-- CreateIndex
CREATE INDEX "profiles_bloodTypeId_idx" ON "profiles"("bloodTypeId");

-- CreateIndex
CREATE INDEX "profiles_isDonorVerified_idx" ON "profiles"("isDonorVerified");

-- CreateIndex
CREATE UNIQUE INDEX "medical_center_staff_userId_key" ON "medical_center_staff"("userId");

-- CreateIndex
CREATE INDEX "medical_center_staff_userId_idx" ON "medical_center_staff"("userId");

-- CreateIndex
CREATE INDEX "medical_center_staff_medicalCenterId_idx" ON "medical_center_staff"("medicalCenterId");

-- CreateIndex
CREATE INDEX "medical_center_staff_organizationId_idx" ON "medical_center_staff"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "system_admins_userId_key" ON "system_admins"("userId");

-- CreateIndex
CREATE INDEX "system_admins_userId_idx" ON "system_admins"("userId");

-- CreateIndex
CREATE INDEX "medical_organizations_isActive_idx" ON "medical_organizations"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "medical_centers_code_key" ON "medical_centers"("code");

-- CreateIndex
CREATE INDEX "medical_centers_organizationId_idx" ON "medical_centers"("organizationId");

-- CreateIndex
CREATE INDEX "medical_centers_isActive_idx" ON "medical_centers"("isActive");

-- CreateIndex
CREATE INDEX "blood_drives_medicalCenterId_idx" ON "blood_drives"("medicalCenterId");

-- CreateIndex
CREATE INDEX "blood_drives_createdById_idx" ON "blood_drives"("createdById");

-- CreateIndex
CREATE INDEX "blood_drives_typeId_idx" ON "blood_drives"("typeId");

-- CreateIndex
CREATE INDEX "blood_drives_statusId_idx" ON "blood_drives"("statusId");

-- CreateIndex
CREATE INDEX "blood_drives_startDateTime_idx" ON "blood_drives"("startDateTime");

-- CreateIndex
CREATE INDEX "blood_drive_blood_types_bloodDriveId_idx" ON "blood_drive_blood_types"("bloodDriveId");

-- CreateIndex
CREATE INDEX "blood_drive_blood_types_bloodTypeId_idx" ON "blood_drive_blood_types"("bloodTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "blood_drive_blood_types_bloodDriveId_bloodTypeId_key" ON "blood_drive_blood_types"("bloodDriveId", "bloodTypeId");

-- CreateIndex
CREATE INDEX "donation_records_profileId_idx" ON "donation_records"("profileId");

-- CreateIndex
CREATE INDEX "donation_records_medicalCenterId_idx" ON "donation_records"("medicalCenterId");

-- CreateIndex
CREATE INDEX "donation_records_recordedById_idx" ON "donation_records"("recordedById");

-- CreateIndex
CREATE INDEX "donation_records_donationDate_idx" ON "donation_records"("donationDate");

-- CreateIndex
CREATE INDEX "verification_records_profileId_idx" ON "verification_records"("profileId");

-- CreateIndex
CREATE INDEX "verification_records_medicalCenterId_idx" ON "verification_records"("medicalCenterId");

-- CreateIndex
CREATE INDEX "verification_records_verifiedById_idx" ON "verification_records"("verifiedById");

-- CreateIndex
CREATE INDEX "verification_records_verifiedAt_idx" ON "verification_records"("verifiedAt");

-- CreateIndex
CREATE INDEX "activity_logs_userId_idx" ON "activity_logs"("userId");

-- CreateIndex
CREATE INDEX "activity_logs_action_idx" ON "activity_logs"("action");

-- CreateIndex
CREATE INDEX "activity_logs_createdAt_idx" ON "activity_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "information_records_slug_key" ON "information_records"("slug");

-- CreateIndex
CREATE INDEX "information_records_slug_idx" ON "information_records"("slug");

-- CreateIndex
CREATE INDEX "information_records_isPublished_idx" ON "information_records"("isPublished");

-- CreateIndex
CREATE INDEX "information_records_category_idx" ON "information_records"("category");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "email_verification_tokens_token_key" ON "email_verification_tokens"("token");

-- CreateIndex
CREATE INDEX "email_verification_tokens_userId_idx" ON "email_verification_tokens"("userId");

-- CreateIndex
CREATE INDEX "email_verification_tokens_token_idx" ON "email_verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "password_reset_tokens_userId_idx" ON "password_reset_tokens"("userId");

-- CreateIndex
CREATE INDEX "password_reset_tokens_token_idx" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_typeId_idx" ON "notifications"("typeId");

-- CreateIndex
CREATE INDEX "notifications_isRead_idx" ON "notifications"("isRead");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "suspension_logs_userId_idx" ON "suspension_logs"("userId");

-- CreateIndex
CREATE INDEX "suspension_logs_suspendedById_idx" ON "suspension_logs"("suspendedById");

-- CreateIndex
CREATE INDEX "suspension_logs_isActive_idx" ON "suspension_logs"("isActive");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "user_role_ref"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_bloodTypeId_fkey" FOREIGN KEY ("bloodTypeId") REFERENCES "blood_type_ref"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_availabilityStatusId_fkey" FOREIGN KEY ("availabilityStatusId") REFERENCES "availability_status_ref"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_center_staff" ADD CONSTRAINT "medical_center_staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_center_staff" ADD CONSTRAINT "medical_center_staff_medicalCenterId_fkey" FOREIGN KEY ("medicalCenterId") REFERENCES "medical_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_center_staff" ADD CONSTRAINT "medical_center_staff_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "medical_organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_admins" ADD CONSTRAINT "system_admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_centers" ADD CONSTRAINT "medical_centers_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "medical_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_drives" ADD CONSTRAINT "blood_drives_medicalCenterId_fkey" FOREIGN KEY ("medicalCenterId") REFERENCES "medical_centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_drives" ADD CONSTRAINT "blood_drives_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_drives" ADD CONSTRAINT "blood_drives_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "blood_drive_type_ref"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_drives" ADD CONSTRAINT "blood_drives_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "blood_drive_status_ref"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_drive_blood_types" ADD CONSTRAINT "blood_drive_blood_types_bloodDriveId_fkey" FOREIGN KEY ("bloodDriveId") REFERENCES "blood_drives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_drive_blood_types" ADD CONSTRAINT "blood_drive_blood_types_bloodTypeId_fkey" FOREIGN KEY ("bloodTypeId") REFERENCES "blood_type_ref"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_records" ADD CONSTRAINT "donation_records_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_records" ADD CONSTRAINT "donation_records_medicalCenterId_fkey" FOREIGN KEY ("medicalCenterId") REFERENCES "medical_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_records" ADD CONSTRAINT "donation_records_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donation_records" ADD CONSTRAINT "donation_records_bloodTypeId_fkey" FOREIGN KEY ("bloodTypeId") REFERENCES "blood_type_ref"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_records" ADD CONSTRAINT "verification_records_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_records" ADD CONSTRAINT "verification_records_medicalCenterId_fkey" FOREIGN KEY ("medicalCenterId") REFERENCES "medical_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_records" ADD CONSTRAINT "verification_records_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_records" ADD CONSTRAINT "verification_records_bloodTypeId_fkey" FOREIGN KEY ("bloodTypeId") REFERENCES "blood_type_ref"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "information_records" ADD CONSTRAINT "information_records_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "system_admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "notification_type_ref"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suspension_logs" ADD CONSTRAINT "suspension_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suspension_logs" ADD CONSTRAINT "suspension_logs_suspendedById_fkey" FOREIGN KEY ("suspendedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

