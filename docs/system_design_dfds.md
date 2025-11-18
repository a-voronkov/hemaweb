# System Design - Data Flow Diagrams (DFDs)

This document summarizes the key DFDs from the original specification. Diagrams are organized in `./images/dfds/`.

## Unverified User DFDs

Functions available to unverified users:

### User Sign Up Process

A new user signs up with an email. The system checks whether the email is already used to avoid duplicates.

![User Sign Up DFD](./images/dfds/donor/user-signup.png)

### User Login Process

![User Login DFD](./images/dfds/donor/user-login.png)

### Browse Informational Resources

Unverified users can browse and read blood-donation-related content (articles, FAQs, etc.).

![Browse Informational Resources DFD](./images/dfds/donor/browse-information.png)

### Discover Verification Centers

Unverified users can view a map of nearby medical centers where they can get verified as donors.

![Discover Verification Centers DFD](./images/dfds/donor/discover-verification-centers.png)

### Update Account Information

Unverified users can update their account info (phone, password, location). Location is selected via a Google Map UI widget, which converts a pin to latitude/longitude stored as a PostGIS geography type. The frontend widget is used only for coordinate picking; there is no direct backend call to Google Maps.

![Update Account Information DFD](./images/dfds/donor/update-account-info.png)

## Verified Donor DFDs

### Find Nearby Eligible Blood Donation Requests

The system checks that the user is verified, then uses the donor's blood type and location (from GPS or stored profile) to query blood drives within a radius (e.g., 10 km) using PostGIS.

![Find Nearby Requests DFD](./images/dfds/donor/find-nearby-blood-requests.png)

### Display Donation Cooldown

Shows a countdown until the donor's next eligible donation date, based on account data.

![Donation Cooldown DFD](./images/dfds/donor/display-donation-cooldown.png)

### Display Past Donations

Displays past donation records: hospital, date, and volume.

![Past Donations DFD](./images/dfds/donor/display-past-donations.png)

### Set Donation Availability Status

Allows donors to set their availability (e.g., available, emergencies only, unavailable).

![Availability Status DFD](./images/dfds/donor/set-availability-status.png)

### Download the Latest Donation Certificate

Generates a PDF certificate for the latest donation from an HTML template and emails it to the donor. Certificates are not stored permanently in the datastore.

![Donation Certificate DFD](./images/dfds/donor/download-donation-certificate.png)

## Medical Center Personnel DFDs

### Medical Personnel Login

Medical staff (Staff/Admin/Super Admin) log in via a separate portal. Their accounts are stored in a separate datastore from donors.

![Medical Personnel Login DFD](./images/dfds/medical-staff/personnel-login.png)

### Verify User

Staff verify unverified users by performing medical checks and updating donor information (e.g., blood type, eligibility). A check-up certificate is uploaded to Amazon S3, with a URL stored in the datastore.

![Verify User DFD](./images/dfds/medical-staff/verify-user.png)

### Check If the User Can Donate

Checks whether a donor is verified and currently eligible before donation.

![Check Eligibility DFD](./images/dfds/medical-staff/check-user-can-donate.png)

### Accept Blood Donation

Staff record donation information and place donors on a timeout (e.g., 56 days). Actions are logged in activity logs.

![Accept Donation DFD](./images/dfds/medical-staff/accept-blood-donation.png)

### View Verification Records

View verification records. Permissions depend on role (staff vs admin vs super admin).

![View Verification Records DFD](./images/dfds/medical-staff/view-verification-records.png)

### View Donation Records

View donation records with similar permission rules.

![View Donation Records DFD](./images/dfds/medical-staff/view-donation-records.png)

### Display Recent Activities

Activity logs show actions done by medical staff (creating drives, recording donations, etc.) with visibility depending on role.

![Activity Logs DFD](./images/dfds/medical-staff/display-recent-activities.png)

### Create a New Blood Donation Drive

Staff create drives (emergency or scheduled) and set location via map or default center location.

![Create Blood Drive DFD](./images/dfds/medical-staff/create-blood-drive.png)

### Complete a Blood Drive

Ending a drive marks its status as "finished" in the Blood Drives datastore.

![Complete Blood Drive DFD](./images/dfds/medical-staff/complete-blood-drive.png)

### Manage Medical Center Staff Accounts (Admins)

Admins manage staff accounts (create, edit, delete). Staff accounts are tied to medical center and organization IDs.

![Manage Staff Accounts DFD](./images/dfds/medical-staff/manage-staff-accounts.png)

### Manage Medical Center Admin Accounts (Super Admins)

Super admins create admin accounts tied to specific medical centers.

![Manage Admin Accounts DFD](./images/dfds/medical-staff/manage-admin-accounts.png)

### Manage Medical Centers (Super Admins)

Super admins create, edit, and delete medical centers and assign logos. Deletion cascades to associated staff and admin accounts.

![Manage Medical Centers DFD](./images/dfds/medical-staff/manage-medical-centers.png)

## System Administrator (Developers) DFDs

### Manage Partnered Medical Organizations

![Manage Organizations DFD](./images/dfds/system-admin/manage-medical-organizations.png)

### Manage Super Admins Under Medical Organizations

![Manage Super Admins DFD](./images/dfds/system-admin/manage-super-admins.png)

### Suspend or Unsuspend Users

![Suspend Users DFD](./images/dfds/system-admin/suspend-unsuspend-users.png)

### Manage Blood Donation Informational Articles

![Manage Articles DFD](./images/dfds/system-admin/manage-informational-articles.png)
