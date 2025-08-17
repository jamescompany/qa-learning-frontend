import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">About QA Learning Web</h1>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            QA Learning Web is dedicated to helping quality assurance professionals enhance their skills,
            share knowledge, and collaborate on testing best practices. We believe in continuous learning
            and the power of community-driven education.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">📚 Learning Resources</h3>
              <p className="text-gray-600">
                Access a comprehensive library of QA tutorials, best practices, and industry insights.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">👥 Community Forum</h3>
              <p className="text-gray-600">
                Connect with other QA professionals, ask questions, and share your expertise.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">✅ Task Management</h3>
              <p className="text-gray-600">
                Organize your testing tasks, track progress, and manage your QA workflow efficiently.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your learning journey and celebrate your achievements along the way.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get Started</h2>
          <p className="text-gray-600 mb-4">
            Join our community today and take your QA skills to the next level. Whether you're a beginner
            looking to learn the basics or an experienced tester seeking advanced techniques, we have
            resources tailored for you.
          </p>
          <div className="flex gap-4">
            <a href="/signup" className="btn btn-primary">
              Sign Up Now
            </a>
            <a href="/posts" className="btn btn-secondary">
              Browse Resources
            </a>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-600">
            Have questions or feedback? We'd love to hear from you!
            <br />
            Email: support@qalearningweb.com
            <br />
            Follow us on social media for updates and tips.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;