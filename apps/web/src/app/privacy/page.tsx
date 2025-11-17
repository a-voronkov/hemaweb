import { MainLayout } from '@/components/layout/main-layout';

export default function PrivacyPage() {
  return (
    <MainLayout>
      <div className="container max-w-4xl px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Introduction</h2>
            <p>
              HemaWeb ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our 
              platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold">2.1 Personal Information</h3>
            <p>We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name, email address, and phone number</li>
              <li>Date of birth and gender</li>
              <li>Blood type and medical eligibility information</li>
              <li>Location data (with your consent)</li>
              <li>Donation history and preferences</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4">2.2 Automatically Collected Information</h3>
            <p>When you use our Platform, we automatically collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, time spent, features used)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
            <p>We use the collected information for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing and maintaining our services</li>
              <li>Matching donors with blood donation opportunities</li>
              <li>Sending notifications about nearby blood drives</li>
              <li>Verifying donor eligibility with medical facilities</li>
              <li>Improving our Platform and user experience</li>
              <li>Communicating with you about your account and our services</li>
              <li>Ensuring platform security and preventing fraud</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Information Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-semibold">4.1 With Medical Facilities</h3>
            <p>
              We share your donor information with authorized hospitals and medical centers for the 
              purpose of donor verification and blood donation coordination.
            </p>

            <h3 className="text-xl font-semibold mt-4">4.2 With Your Consent</h3>
            <p>
              We may share your information with third parties when you give us explicit consent to do so.
            </p>

            <h3 className="text-xl font-semibold mt-4">4.3 Legal Requirements</h3>
            <p>
              We may disclose your information if required by law or in response to valid requests by 
              public authorities.
            </p>

            <h3 className="text-xl font-semibold mt-4">4.4 We Do Not Sell Your Data</h3>
            <p>
              We do not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal 
              information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication</li>
              <li>Secure data storage and backup procedures</li>
            </ul>
            <p>
              However, no method of transmission over the Internet is 100% secure, and we cannot guarantee 
              absolute security.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Your Rights and Choices</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access and receive a copy of your personal data</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal data</li>
              <li>Object to or restrict certain processing of your data</li>
              <li>Withdraw consent at any time</li>
              <li>Opt-out of marketing communications</li>
            </ul>
            <p>
              To exercise these rights, please contact us at privacy@hemaweb.world
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes outlined 
              in this Privacy Policy, unless a longer retention period is required by law. Donation history 
              may be retained for medical record-keeping purposes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Children's Privacy</h2>
            <p>
              Our Platform is not intended for individuals under the age of 18. We do not knowingly collect 
              personal information from children. If you believe we have collected information from a child, 
              please contact us immediately.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of 
              residence. We ensure appropriate safeguards are in place to protect your information in 
              accordance with this Privacy Policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material 
              changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <p className="font-medium">
              Email: privacy@hemaweb.world<br />
              Support: support@hemaweb.world
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

