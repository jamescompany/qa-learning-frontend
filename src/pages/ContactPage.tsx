import React, { useState } from 'react';
import FormInput from '../components/forms/FormInput';
import toast from 'react-hot-toast';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Your Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              placeholder="James Kang"
            />
            <FormInput
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              placeholder="qalearning101@gmail.com"
            />
            <FormInput
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              placeholder="How can we help?"
            />
            <FormInput
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              multiline
              rows={5}
              disabled={isSubmitting}
              required
              placeholder="Tell us more about your inquiry..."
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 rounded-lg text-white transition-colors ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">📧</span>
                <div>
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <p className="text-gray-600">support@qalearningweb.com</p>
                  <p className="text-gray-600">info@qalearningweb.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">📍</span>
                <div>
                  <h3 className="font-medium text-gray-900">Office</h3>
                  <p className="text-gray-600">123 Tech Street</p>
                  <p className="text-gray-600">San Francisco, CA 94105</p>
                  <p className="text-gray-600">United States</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🕐</span>
                <div>
                  <h3 className="font-medium text-gray-900">Business Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Saturday - Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Follow Us</h2>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                <span className="sr-only">Twitter</span>
                𝕏
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                in
              </a>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h3 className="font-medium text-blue-900 mb-1">Looking for Support?</h3>
            <p className="text-blue-800 text-sm">
              Check out our documentation and FAQ section for quick answers to common questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;