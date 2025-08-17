import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
          <p className="text-gray-600 mb-4">
            We collect information you provide directly to us, such as when you create an account,
            submit content, or contact us for support.
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>Account information (name, email, password)</li>
            <li>Profile information (bio, avatar, location)</li>
            <li>Content you create (posts, comments, todos)</li>
            <li>Communications with us</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>Provide, maintain, and improve our services</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Protect against fraudulent or illegal activity</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Information Sharing</h2>
          <p className="text-gray-600 mb-4">
            We do not sell, trade, or otherwise transfer your personal information to third parties
            without your consent, except as described in this policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Data Security</h2>
          <p className="text-gray-600 mb-4">
            We implement appropriate technical and organizational measures to protect your personal
            information against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Your Rights</h2>
          <p className="text-gray-600 mb-4">
            You have the right to:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to our use of your data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            Email: privacy@qalearningweb.com
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

export default PrivacyPolicyPage;