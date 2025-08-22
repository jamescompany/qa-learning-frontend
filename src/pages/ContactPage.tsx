import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormInput from '../components/forms/FormInput';
import toast from 'react-hot-toast';
import { contactService } from '../services/contact.service';

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
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

  // Email validation regex
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if form is valid
  const isFormValid = formData.name && 
                      formData.email && 
                      isValidEmail(formData.email) &&
                      formData.subject && 
                      formData.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!isFormValid) {
      toast.error(t('about.contact.form.fillAllFields'));
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await contactService.sendMessage(formData);
      
      if (response.success) {
        toast.success(response.message || t('about.contact.form.successMessage'));
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        toast.error(response.message || t('about.contact.form.errorMessage'));
      }
    } catch (error: any) {
      console.error('Error sending contact message:', error);
      toast.error(
        error.response?.data?.detail || 
        error.message || 
        t('about.contact.form.errorMessage')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">{t('about.contact.title')}</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('about.contact.form.title')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label={t('about.contact.form.name')}
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              placeholder={t('about.contact.form.namePlaceholder')}
            />
            <FormInput
              label={t('about.contact.form.email')}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              placeholder={t('about.contact.form.emailPlaceholder')}
            />
            <FormInput
              label={t('about.contact.form.subject')}
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              placeholder={t('about.contact.form.subjectPlaceholder')}
            />
            <FormInput
              label={t('about.contact.form.message')}
              name="message"
              value={formData.message}
              onChange={handleChange}
              multiline
              rows={5}
              disabled={isSubmitting}
              required
              placeholder={t('about.contact.form.messagePlaceholder')}
            />
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-2 px-4 rounded-lg text-white transition-colors ${
                !isFormValid || isSubmitting
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600'
              }`}
              title={!isFormValid ? t('about.contact.form.fillAllFields') : ''}
            >
              {isSubmitting ? t('about.contact.form.submitting') : t('about.contact.form.submit')}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('about.contact.info.title')}</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">📧</span>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{t('about.contact.info.email')}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{t('about.contact.info.emailSupport')}</p>
                  <p className="text-gray-600 dark:text-gray-400">{t('about.contact.info.emailInfo')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;