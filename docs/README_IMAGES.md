# Images Directory

This directory contains all diagrams, UI mockups, and charts from the original HemaWeb project specification, organized by category with descriptive filenames.

## Directory Structure

```
images/
├── branding/
│   └── hemaweb-logo.png
├── dfds/
│   ├── donor/
│   ├── medical-staff/
│   └── system-admin/
├── data-model/
│   └── er-diagram.png
├── ui/
│   ├── donor/
│   ├── medical-staff/
│   └── system-admin/
└── project-management/
    └── timeline/
```

**Total: 82 images**

## Contents by Category

### Branding (`branding/`)

- `hemaweb-logo.png` – HemaWeb logo/header

### Data Flow Diagrams (`dfds/`)

#### Donor Flows (`dfds/donor/`)

- `user-signup.png` – User Sign Up DFD
- `user-login.png` – User Login DFD
- `browse-information.png` – Browse Informational Resources DFD
- `discover-verification-centers.png` – Discover Verification Centers DFD
- `update-account-info.png` – Update Account Information DFD
- `find-nearby-blood-requests.png` – Find Nearby Blood Donation Requests DFD
- `display-donation-cooldown.png` – Display Donation Cooldown DFD
- `display-past-donations.png` – Display Past Donations DFD
- `set-availability-status.png` – Set Donation Availability Status DFD
- `download-donation-certificate.png` – Download Donation Certificate DFD

#### Medical Staff Flows (`dfds/medical-staff/`)

- `personnel-login.png` – Medical Personnel Login DFD
- `verify-user.png` – Verify User DFD
- `check-user-can-donate.png` – Check If User Can Donate DFD
- `accept-blood-donation.png` – Accept Blood Donation DFD
- `view-verification-records.png` – View Verification Records DFD
- `view-donation-records.png` – View Donation Records DFD
- `display-recent-activities.png` – Display Recent Activities DFD
- `create-blood-drive.png` – Create Blood Donation Drive DFD
- `complete-blood-drive.png` – Complete Blood Drive DFD
- `manage-staff-accounts.png` – Manage Staff Accounts (Admin) DFD
- `manage-admin-accounts.png` – Manage Admin Accounts (Super Admin) DFD
- `manage-medical-centers.png` – Manage Medical Centers (Super Admin) DFD

#### System Admin Flows (`dfds/system-admin/`)

- `manage-medical-organizations.png` – Manage Medical Organizations DFD
- `manage-super-admins.png` – Manage Super Admins DFD
- `suspend-unsuspend-users.png` – Suspend/Unsuspend Users DFD
- `manage-informational-articles.png` – Manage Informational Articles DFD

### Data Model (`data-model/`)

- `er-diagram.png` – Entity-Relationship Diagram

### UI Mockups (`ui/`)

#### Donor Mobile Web App (`ui/donor/`)

- `auth-screen-1.png` – Donor Authentication Screen 1
- `auth-screen-2.png` – Donor Authentication Screen 2
- `unverified-home-info.png` – Unverified User Home/Info
- `unverified-map-centers.png` – Map of Medical Centers
- `unverified-educational-content.png` – Educational Content
- `unverified-additional-1.png` – Additional Unverified Screen 1
- `unverified-additional-2.png` – Additional Unverified Screen 2
- `profile-settings.png` – Profile/Settings
- `verified-home-drives.png` – Verified User Home/Drives
- `verified-donation-cooldown.png` – Donation Cooldown Display
- `verified-donation-history.png` – Donation History
- `verified-availability-status.png` – Availability Status Controls
- `verified-certificate-other.png` – Certificate/Other Verified Screens

#### Medical Staff Desktop Web App (`ui/medical-staff/`)

**Authentication:**
- `auth-screen.png` – Medical Staff Authentication

**Super Admin Screens:**
- `super-admin-main-menu.png` – Super Admin Main Menu
- `super-admin-create-blood-drive.png` – Create Blood Drive
- `super-admin-all-admin-accounts.png` – All Admin Accounts
- `super-admin-all-medical-centers.png` – All Medical Centers
- `super-admin-all-donation-records.png` – All Donation Records
- `super-admin-all-verification-records.png` – All Verification Records
- `super-admin-create-admin-account.png` – Create Admin Account
- `super-admin-edit-admin-account.png` – Edit Admin Account
- `super-admin-all-staff-accounts.png` – All Staff Accounts
- `super-admin-create-staff-account.png` – Create Staff Account
- `super-admin-edit-staff-account.png` – Edit Staff Account
- `super-admin-create-medical-center.png` – Create Medical Center
- `super-admin-edit-medical-center.png` – Edit Medical Center

**Admin Screens:**
- `admin-main-menu.png` – Admin Main Menu
- `admin-create-blood-drive.png` – Create Blood Drive
- `admin-donation-records.png` – Donation Records
- `admin-verification-records.png` – Verification Records
- `admin-staff-accounts.png` – Staff Accounts
- `admin-add-staff.png` – Add Staff
- `admin-edit-staff.png` – Edit Staff

**Staff Screens:**
- `staff-main-menu.png` – Staff Main Menu
- `staff-create-blood-drive.png` – Create Blood Drive
- `staff-donation-records.png` – Donation Records
- `staff-verification-records.png` – Verification Records
- `staff-verify-donor.png` – Verify Donor
- `staff-accept-donation.png` – Accept Donation

#### System Admin Web App (`ui/system-admin/`)

- `auth-screen.png` – System Admin Authentication
- `main-menu.png` – System Admin Main Menu
- `create-medical-organization.png` – Create Medical Organization
- `edit-medical-organization.png` – Edit Medical Organization
- `create-super-admin.png` – Create Super Admin
- `edit-super-admin.png` – Edit Super Admin
- `info-records-main-menu.png` – Information Records Main Menu
- `create-info-record.png` – Create Information Record
- `edit-info-record.png` – Edit Information Record

### Project Management (`project-management/timeline/`)

- `timeline-chart-1.png` – Project Timeline Chart 1
- `timeline-chart-2.png` – Project Timeline Chart 2
- `timeline-chart-3.png` – Project Timeline Chart 3
- `timeline-chart-4.png` – Project Timeline Chart 4
- `timeline-chart-5.png` – Project Timeline Chart 5

## Usage

All images are referenced in the documentation using descriptive relative paths:

```markdown
![Description](./images/category/descriptive-name.png)
```

For example:
- DFD diagrams: `./images/dfds/donor/user-signup.png`
- ER diagram: `./images/data-model/er-diagram.png`
- UI mockups: `./images/ui/donor/auth-screen-1.png`
- Timeline charts: `./images/project-management/timeline/timeline-chart-1.png`

