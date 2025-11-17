import { MainLayout } from '@/components/layout/main-layout';

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="container max-w-4xl px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p>
              By accessing and using HemaWeb ("the Platform"), you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to these Terms of Service, please do not 
              use the Platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Description of Service</h2>
            <p>
              HemaWeb is a platform that connects blood donors with hospitals and medical centers in Thailand. 
              The Platform facilitates:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Registration and verification of blood donors</li>
              <li>Discovery of blood donation drives and opportunities</li>
              <li>Communication between donors and medical facilities</li>
              <li>Tracking of donation history and eligibility</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. User Accounts</h2>
            <p>
              To use certain features of the Platform, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Donor Verification</h2>
            <p>
              Blood donor verification is conducted by authorized medical facilities. By participating in 
              the verification process, you:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Consent to medical screening and eligibility assessment</li>
              <li>Agree to provide accurate health information</li>
              <li>Understand that verification does not guarantee acceptance for donation</li>
              <li>Acknowledge that medical facilities have final authority on donor eligibility</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Medical Disclaimer</h2>
            <p>
              HemaWeb is a platform service only. We do not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide medical advice, diagnosis, or treatment</li>
              <li>Guarantee the safety or suitability of blood donation for any individual</li>
              <li>Assume responsibility for medical decisions made by users or medical facilities</li>
              <li>Warrant the accuracy of health information provided by users</li>
            </ul>
            <p>
              Always consult with qualified healthcare professionals regarding blood donation eligibility 
              and health concerns.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Our collection and use of personal information is governed 
              by our Privacy Policy. By using the Platform, you consent to our collection and use of 
              personal data as outlined in the Privacy Policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. User Conduct</h2>
            <p>
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide false or misleading information</li>
              <li>Impersonate any person or entity</li>
              <li>Use the Platform for any illegal purpose</li>
              <li>Interfere with or disrupt the Platform or servers</li>
              <li>Attempt to gain unauthorized access to any portion of the Platform</li>
              <li>Harass, abuse, or harm other users</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Intellectual Property</h2>
            <p>
              The Platform and its original content, features, and functionality are owned by HemaWeb 
              and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, HemaWeb shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages resulting from your use or inability 
              to use the Platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">10. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account and access to the Platform at our 
              sole discretion, without notice, for conduct that we believe violates these Terms of Service 
              or is harmful to other users, us, or third parties, or for any other reason.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. We will notify users of 
              any material changes by posting the new Terms of Service on this page and updating the 
              "Last updated" date.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Thailand, 
              without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">13. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="font-medium">
              Email: legal@hemaweb.world<br />
              Support: support@hemaweb.world
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

