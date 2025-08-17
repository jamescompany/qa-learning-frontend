import api from './api';

interface FileUploadResponse {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

interface FileListResponse {
  files: FileUploadResponse[];
  total: number;
  page: number;
  limit: number;
}

class FileService {
  async uploadFile(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<FileUploadResponse> {
    const response = await api.uploadFile('/files/upload', file, onProgress);
    return response.data;
  }

  async uploadMultipleFiles(
    files: File[],
    onProgress?: (progress: number) => void
  ): Promise<FileUploadResponse[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await api.post<FileUploadResponse[]>('/files/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  }

  async getFiles(page: number = 1, limit: number = 20): Promise<FileListResponse> {
    const response = await api.get<FileListResponse>(
      `/files?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getFile(id: string): Promise<FileUploadResponse> {
    const response = await api.get<FileUploadResponse>(`/files/${id}`);
    return response.data;
  }

  async deleteFile(id: string): Promise<void> {
    await api.delete(`/files/${id}`);
  }

  async downloadFile(id: string, filename: string): Promise<void> {
    const response = await api.get(`/files/${id}/download`, {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  async getFilePreviewUrl(id: string): Promise<string> {
    const response = await api.get<{ url: string }>(`/files/${id}/preview`);
    return response.data.url;
  }

  validateFile(
    file: File,
    options: {
      maxSize?: number; // in bytes
      allowedTypes?: string[];
    } = {}
  ): { valid: boolean; error?: string } {
    const { maxSize = 10 * 1024 * 1024, allowedTypes = [] } = options; // Default 10MB

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds ${(maxSize / 1024 / 1024).toFixed(2)}MB limit`,
      };
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }

    return { valid: true };
  }

  getFileIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) return '=¼';
    if (mimeType.startsWith('video/')) return '<¥';
    if (mimeType.startsWith('audio/')) return '<µ';
    if (mimeType.includes('pdf')) return '=Ä';
    if (mimeType.includes('word') || mimeType.includes('document')) return '=Ý';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return '=Ê';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '=Ë';
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return '=æ';
    return '=Á';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

export default new FileService();