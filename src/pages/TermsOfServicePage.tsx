import React from 'react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600 mb-4">
            By accessing and using QA Learning Web, you agree to be bound by these Terms of Service
            and all applicable laws and regulations. If you do not agree with any of these terms,
            you are prohibited from using this site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Use License</h2>
          <p className="text-gray-600 mb-4">
            Permission is granted to temporarily access the materials on QA Learning Web for personal,
            non-commercial use only. This is the grant of a license, not a transfer of title.
          </p>
          <p className="text-gray-600 mb-4">Under this license you may not:</p>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>Modify or copy the materials</li>
            <li>Use the materials for commercial purposes</li>
            <li>Attempt to reverse engineer any software</li>
            <li>Remove any copyright or proprietary notations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Content</h2>
          <p className="text-gray-600 mb-4">
            You retain ownership of any content you submit to QA Learning Web. By submitting content,
            you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and
            distribute your content in connection with our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Prohibited Uses</h2>
          <p className="text-gray-600 mb-4">You may not use our service to:</p>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>Post illegal, harmful, or offensive content</li>
            <li>Impersonate others or misrepresent your affiliation</li>
            <li>Spam or send unsolicited messages</li>
            <li>Interfere with the operation of the service</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Account Responsibilities</h2>
          <p className="text-gray-600 mb-4">
            You are responsible for maintaining the confidentiality of your account credentials
            and for all activities that occur under your account. You must notify us immediately
            of any unauthorized use of your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Disclaimer</h2>
          <p className="text-gray-600 mb-4">
            The materials on QA Learning Web are provided on an 'as is' basis. We make no warranties,
            expressed or implied, and hereby disclaim all warranties including, without limitation,
            implied warranties of merchantability and fitness for a particular purpose.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Limitations</h2>
          <p className="text-gray-600 mb-4">
            In no event shall QA Learning Web or its suppliers be liable for any damages arising
            out of the use or inability to use the materials on our site, even if we have been
            notified of the possibility of such damages.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Termination</h2>
          <p className="text-gray-600 mb-4">
            We may terminate or suspend your account immediately, without prior notice or liability,
            for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Changes to Terms</h2>
          <p className="text-gray-600 mb-4">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
            If a revision is material, we will provide at least 30 days notice prior to any new terms
            taking effect.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Contact Information</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about these Terms of Service, please contact us at:
            <br />
            Email: legal@qalearningweb.com
          </p>
        </section>

        <section>
          <p className="text-sm text-gray-500 mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfServicePage;