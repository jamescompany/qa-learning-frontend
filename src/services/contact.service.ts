import api from './api';

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

class ContactService {
  async sendMessage(data: ContactData): Promise<ContactResponse> {
    // Use longer timeout for email operations
    const response = await api.post<ContactResponse>('/contact', data, {
      timeout: 60000 // 60 seconds for email sending
    });
    return response.data;
  }

  async testEmail(): Promise<{
    success: boolean;
    message: string;
    recipient?: string;
    config?: any;
  }> {
    const response = await api.get('/contact/test-email');
    return response.data;
  }
}

export const contactService = new ContactService();