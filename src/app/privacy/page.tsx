import { Navigation } from "@/components/layout/navigation"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
          
          <p className="text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
              <p className="text-foreground leading-relaxed">
                Welcome to Judie AI ("we," "our," or "us"). This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our AI-powered chat and lead 
                management platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
              <h3 className="text-xl font-medium text-foreground mb-3">Personal Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Name and contact information (email, phone number)</li>
                <li>Account credentials and profile information</li>
                <li>Communication preferences</li>
                <li>Social media handles and profile information</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Usage Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Chat messages and conversation history</li>
                <li>AI interaction logs and queries</li>
                <li>Lead management and note-taking data</li>
                <li>Device information and browser data</li>
                <li>Usage analytics and platform interactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Provide and maintain our AI chat and lead management services</li>
                <li>Process and respond to your inquiries and support requests</li>
                <li>Improve our AI algorithms and platform functionality</li>
                <li>Send you updates, notifications, and marketing communications</li>
                <li>Ensure platform security and prevent fraudulent activities</li>
                <li>Comply with legal obligations and protect our rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Information Sharing</h2>
              <p className="text-foreground leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share 
                your information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li><strong>Service Providers:</strong> With trusted third-party vendors who assist in platform operations</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                <li><strong>Consent:</strong> When you explicitly consent to sharing your information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
              <p className="text-foreground leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your 
                personal information against unauthorized access, alteration, disclosure, or destruction. 
                This includes encryption, secure data transmission, access controls, and regular security audits.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Data Retention</h2>
              <p className="text-foreground leading-relaxed">
                We retain your personal information for as long as necessary to provide our services, 
                comply with legal obligations, resolve disputes, and enforce our agreements. Chat history 
                and lead information are retained according to your account settings and preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
              <p className="text-foreground leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li><strong>Access:</strong> Request copies of your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Restriction:</strong> Request limitation of processing your information</li>
                <li><strong>Objection:</strong> Object to processing of your information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Cookies and Tracking</h2>
              <p className="text-foreground leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience, analyze usage 
                patterns, and provide personalized content. You can manage your cookie preferences through 
                your browser settings, though some features may not function properly if cookies are disabled.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Links</h2>
              <p className="text-foreground leading-relaxed">
                Our platform may contain links to third-party websites or services. We are not responsible 
                for the privacy practices or content of these external sites. We encourage you to review 
                the privacy policies of any third-party services you visit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Children's Privacy</h2>
              <p className="text-foreground leading-relaxed">
                Our services are not intended for children under the age of 13. We do not knowingly collect 
                personal information from children under 13. If we become aware that we have collected 
                personal information from a child under 13, we will take steps to delete such information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">International Data Transfers</h2>
              <p className="text-foreground leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. 
                We ensure that such transfers are conducted in accordance with applicable data protection 
                laws and with appropriate safeguards in place.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Updates to This Policy</h2>
              <p className="text-foreground leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices 
                or applicable laws. We will notify you of any material changes by posting the updated 
                policy on our platform and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
              <p className="text-foreground leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our 
                data practices, please contact us:
              </p>
              <div className="bg-muted/30 border rounded-lg p-4">
                <p className="text-foreground"><strong>Email:</strong> privacy@judieai.com</p>
                <p className="text-foreground"><strong>Address:</strong> [Your Company Address]</p>
                <p className="text-foreground"><strong>Phone:</strong> [Your Contact Number]</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}