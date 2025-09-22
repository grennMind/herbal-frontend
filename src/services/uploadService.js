// File upload service for research attachments
class UploadService {
  constructor() {
    this.baseURL = '/api/uploads';
  }

  async uploadSingle(file) {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseURL}/single`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Upload failed');
    }

    return data.data;
  }

  async uploadMultiple(files) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseURL}/multiple`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Upload failed');
    }

    return data.data;
  }

  async deleteFile(publicId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseURL}/${publicId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Delete failed');
    }

    return data;
  }

  async getUploadInfo() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseURL}/info`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to get upload info');
    }

    return data.data;
  }

  // Utility function to format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Utility function to get file icon based on type
  getFileIcon(mimetype) {
    if (mimetype.startsWith('image/')) {
      return '🖼️';
    } else if (mimetype === 'application/pdf') {
      return '📄';
    } else if (mimetype.includes('word')) {
      return '📝';
    } else if (mimetype === 'text/plain') {
      return '📃';
    } else if (mimetype === 'text/csv') {
      return '📊';
    } else {
      return '📎';
    }
  }

  // Validate file before upload
  validateFile(file, maxSize = 10 * 1024 * 1024) { // 10MB default
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`);
    }

    if (file.size > maxSize) {
      throw new Error(`File size must be less than ${this.formatFileSize(maxSize)}`);
    }

    return true;
  }
}

export default new UploadService();
