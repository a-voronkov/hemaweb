# System Design and Main Flows

This section summarizes the key logical flows that were originally captured as Data Flow Diagrams (DFDs). For full diagrams, refer to the images in `./images/dfds/`.

## Unverified user flows

### Sign up

- New users create an account by providing required details (e.g. email).
- The system checks for duplicate emails before creating the account.
- Result: an unverified user profile that can browse content and maps.

_Referenced diagram: `./images/dfds/image002.png` (Sign up DFD)._ 

### Log in

- Users authenticate with their credentials and receive an authenticated session.
- Role and verification status drive what they can access.

_Referenced diagram: `./images/dfds/image003.png` (Login DFD)._ 

### Browse informational resources

- Unverified users read articles, FAQs, and educational content about blood donation.
- This content is stored as informational records and rendered via the web UI.

_Referenced diagram: `./images/dfds/image004.png`._

### Discover verification centers

- Users see a map of nearby medical centers that partner with HemaWeb.
- The UI uses a map widget to convert pins to latitude/longitude; no direct Google Maps API calls from the backend.
- Locations are stored using PostGIS geography types in PostgreSQL.

_Referenced diagrams: `./images/dfds/image005.png` and `image006.png`._

## Verified donor flows

### Find nearby eligible blood donation requests

- The system checks that the user is a verified donor.
- It uses the donor’s blood type and location (GPS or stored profile location).
- A PostGIS query searches within a radius (e.g. 10km) for blood drives and emergency requests matching the donor’s blood type.
- Results are presented on a map/list.

_Referenced diagram: `./images/dfds/image007.png`._

### Display donation cooldown

- The account datastore tracks the next eligible donation date.
- The UI calculates the remaining time based on today’s date and either shows:
  - a countdown; or
  - a message that the donor is currently eligible.

_Referenced diagram: `./images/dfds/image008.png`._

### Display past donations

- The system queries the donation records datastore for the current donor.
- Records include where, when, and how much blood was donated.
- The UI formats and lists these records.

_Referenced diagram: `./images/dfds/image009.png`._

### Set donation availability status

- Donors can choose availability modes such as:
  - available for all drives;
  - emergencies only;
  - not available.
- This preference influences which notifications and opportunities they receive.

_Referenced diagram: `./images/dfds/image010.png`._

### Download latest donation certificate

- When requested, the system generates a PDF certificate from an HTML template using the latest donation record.
- Certificates are generated on demand and emailed to the user rather than stored permanently.

_Referenced diagram: `./images/dfds/image011.png`._

## Medical center personnel flows

### Login and roles

- Medical staff log in through a dedicated portal.
- Accounts are stored in a separate datastore from donor accounts.
- Role types: Staff, Admin, Super Admin, each with increasing scope and permissions.

_Referenced diagram: `./images/dfds/image012.png`._

### Verify user

- Staff perform medical checks and record donor information (e.g. blood type, eligibility).
- A verification record is stored, and documents (e.g. check-up certificate) are uploaded to S3; only the URL is stored in the database.

_Referenced diagram: `./images/dfds/image013.png`._

### Check if a user can donate

- Staff search for a donor by account ID.
- The system returns whether the donor is verified and whether they are currently eligible to donate.

_Referenced diagram: `./images/dfds/image014.png`._

### Accept blood donation

- After donation, staff record the donation details.
- The donor’s status is updated with a cooldown period (e.g. 56 days).
- An activity log entry is created.

_Referenced diagram: `./images/dfds/image015.png`._

### View verification and donation records

- Staff/admins can list and search verification and donation records.
- Super admins see all records under their medical organization; staff and admins are scoped to their own medical center.

_Referenced diagrams: `./images/dfds/image016.png`, `image017.png`._

### Display recent activities

- Activity logs track actions such as accepting donations, creating drives, and sending alerts.
- Staff see only their own logs; admins see their center’s logs; super admins see logs across their organization.

_Referenced diagram: `./images/dfds/image018.png`._

### Manage blood drives

- Staff can create blood drives of type "emergency" or scheduled, choosing a location (defaulting to their medical center or a custom pin).
- Ending or cancelling a drive changes its status from `active` to `finished`.

_Referenced diagrams: `./images/dfds/image019.png`, `image020.png`._

### Manage staff, admins, and medical centers

At different levels:

- **Admins** manage staff within their own center (create/edit/delete staff accounts).
- **Super admins**:
  - Manage admin accounts.
  - Manage medical centers (create/edit/delete).
  - See higher-level aggregated views across centers.

_Referenced diagrams: `./images/dfds/image021.png`–`image023.png`._

## System administrator (platform-level) flows

System administrators for HemaWeb can:

- Manage partnered medical organizations.
- Manage super admins under each organization.
- Suspend/unsuspend users.
- Manage informational articles about blood donation.

_Referenced diagrams: `./images/dfds/image024.png`–`image027.png`._

