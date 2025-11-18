# Stakeholders and Scope

## Stakeholders

- **Hospitals / Medical centers** - organizations that run blood drives, verify donors, and record donations.
- **Repeat donors** - people who have donated before and are likely to donate again if engaged properly.
- **Prospective donors** - people who have never donated or are unsure, and need guidance and reassurance.
- **System administrators / developers** - maintainers of the HemaWeb platform who onboard organizations and manage global settings and content.

Empathy-mapping in the original document focuses on what each stakeholder group **sees, thinks, feels, says, and does**, and on their pains and gains. These insights drive the requirements and UX decisions captured in the rest of the documentation.

## Functional scope by user type

### Individual users (donors)

#### 1. Unverified users

Unverified users can:

- Create an account with email/phone verification.
- Browse educational content about blood donation (articles, FAQs, etc.).
- View a map of nearby partner hospitals/medical centers.
- Edit account information (email, phone number, address, location).

#### 2. Verified users

Verified users can do everything unverified users can, and in addition:

- See nearby blood drives or emergency requests that match their blood type.
- Set donation availability status (e.g. available, emergencies only, not available).
- Donate blood at partnered medical centers.
- View a countdown until their next eligible donation date.
- View past donation records (where, when, how much blood was donated).
- Receive notifications about relevant nearby blood drives or emergency requests.
- Generate a certificate (PDF) for their latest donation.

### Medical center personnel

#### 1. Staff users

Staff users (frontline medical personnel) can:

- Verify donor information and eligibility when donors come to the hospital.
- Log accepted blood donations and set donor cooldown periods.
- View and search verification records for their medical center.
- View and search donation records for their medical center.
- Send targeted emergency alerts (by blood type).
- Create targeted blood drives (by blood type and radius).
- Check donor eligibility when they arrive to donate.
- View their own activity logs.

#### 2. Admin users

Admin users have staff capabilities plus:

- View activity logs for all staff in their medical center.
- Manage staff accounts for their medical center:
  - Create staff accounts.
  - Edit staff accounts.
  - Delete staff accounts.

#### 3. Super admin users

Super admins operate at the **medical organization** level and can:

- View activity logs across all medical centers under their organization.
- View and search donation records across all medical centers under their organization.
- View and search verification records across all medical centers under their organization.
- Manage staff accounts across all medical centers under their organization.
- Manage admin accounts:
  - Create admin accounts.
  - Edit admin accounts.
  - Delete admin accounts.
- Manage medical centers:
  - Create centers.
  - Edit centers.
  - Delete centers (including associated staff/admin accounts).

### System administrators (platform-level)

System administrators (for HemaWeb itself) can:

- Manage medical organizations (create, edit, delete).
- Manage super admin accounts (create, edit, delete).
- Manage informational records (create, edit, delete educational content).
- Suspend or unsuspend user accounts when needed.

## Limitations

### Dependency on partner adoption

The platform’s effectiveness depends on a critical mass of participating hospitals and donors in each region.

### Data silos (external donations)

Donations made outside the HemaWeb network are not automatically tracked. If donors give blood at non-partnered facilities and staff do not update the system, eligibility data can become inaccurate.

### Process adherence (human error)

Accurate, real-time data relies on hospital staff consistently logging donations and verifications in HemaWeb. Falling back to offline processes can desynchronize digital status from reality.

### Scope boundaries

HemaWeb is an information and coordination platform, **not**:

- A logistics provider for transporting blood.
- A system for medical testing or storage of blood products.
- A general appointment scheduling or communication platform between donors and hospitals.
- A guarantee of donor response or medical fitness at donation time.

### Technical and regulatory constraints

- **Connectivity** – real-time matching and alerts require reliable internet and location access.
- **Compliance** – handling donor and medical-related data must comply with Thailand’s PDPA and other applicable regulations.

