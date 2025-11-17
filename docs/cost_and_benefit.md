# Cost and Benefit Analysis

This document summarizes the cost and benefit analysis outlined in the original specification.

## Cost Analysis

### LOC and COCOMO Estimates

From the original estimates:

- **Frontend (Next.js, Tailwind CSS, JavaScript):** ~8,800 LOC
- **Backend (Node.js, Express.js, PostgreSQL, Prisma):** ~7,000 LOC
- **Database & Infrastructure (AWS, security):** ~2,500 LOC
- **APIs & Integrations (Google Maps, etc.):** ~2,100 LOC

Total estimated LOC: ~20,400 (≈20.4 KLOC).

The project is classified as **Semi-Detached (Moderate)** in the COCOMO model, due to medium complexity, cloud integrations, and healthcare-domain constraints.

Example COCOMO results from the document (semi-detached mode):

- Estimated size: ~16.2 KLOC (alternative estimate used in sample calculation).
- Effort (person-months): `P ≈ 3.0 × (16.2)^1.12 ≈ 68.9` person-months.
- Development period (months): `T ≈ 2.5 × (68.9)^0.35 ≈ 11` months.
- Average team size: `N = P / T ≈ 6.3` → about 6–7 people.

### Team and Cost Structure

The original document outlines a professional team sized around these COCOMO estimates, with a total development team cost on the order of several million THB (e.g., ~฿3,200,000 for 8 months in one proposed structure), plus ongoing QA, maintenance, and project management costs.

### Yearly Operational Costs

Operational costs focus primarily on cloud infrastructure and supporting services.

- Pricing assumptions: 1 USD ≈ 33 THB (subject to change).
- Ongoing costs include compute, storage, networking, monitoring, and security.
- Additional yearly costs include QA/maintenance and project management/collaboration tooling.

These costs are intended as estimates and will depend heavily on actual usage and AWS pricing.

## Benefit Analysis

### Qualitative Benefits – Hospitals & Public Health

- **Enhanced Emergency Response** – Faster ability to locate eligible donors in critical situations.
- **Improved Operational Efficiency** – Reduced staff time spent on manual outreach.
- **Data-Driven Decisions** – Analytics on donor behavior and donation patterns help plan targeted blood drives.

### Qualitative Benefits – Donors

- **Increased Accessibility & Convenience** – Easier to discover when/where to donate and check eligibility.
- **Empowerment and Engagement** – Donors can see their impact and stay engaged with the system.
- **Combatting Misinformation** – Centralized, trusted content reduces fear and myths around donation.

### Strategic Value and ROI

HemaWeb’s primary return is social rather than purely financial.

Strategic goals include:

- Significantly increasing the active donor base in launch regions within the first 2 years.
- Reducing donor response times during emergencies via real-time communication.
- Improving repeat donation rates through automated reminders and better visibility.

The platform’s value comes from both:

- Administrative cost savings (less manual coordination by hospital staff).
- Social value (lives saved and better public health outcomes).

Under reasonable adoption assumptions, the initial development investment is expected to be recouped through these combined benefits within a few years.

