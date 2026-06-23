const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

// Helper to get auth header
function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Global API object
export const api = {
  // Auth
  register: async (email, password, name, phone) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, phone })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  getCurrentUser: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return await res.json();
  },

  // Orders
  createOrder: async (orderData) => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(orderData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to place order');
    return data;
  },

  getOrders: async () => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
  },

  getOrderDetails: async (orderId) => {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch order details');
    return await res.json();
  },

  updateOrderStatus: async (orderId, status) => {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update order status');
    return data;
  },

  assignOrder: async (orderId, writerId) => {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/assign`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ writer_id: writerId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to assign order');
    return data;
  },

  // Files
  getOrderFiles: async (orderId) => {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/files`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch files');
    return await res.json();
  },

  uploadFile: async (orderId, file, fileType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_type', fileType);

    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/files`, {
      method: 'POST',
      headers: {
        ...getAuthHeader() // Multer sets its own boundary Content-Type, do not specify it manually
      },
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'File upload failed');
    return data;
  },

  downloadFileUrl: (fileId) => {
    const token = localStorage.getItem('token');
    return `${API_BASE_URL}/files/download/${fileId}?token=${token}`; // Token can be passed or header, since download is link, token in url works if server supports it, or download via fetch. Let's provide direct link with token or download via fetch.
  },

  downloadFile: async (fileId, fileName) => {
    const res = await fetch(`${API_BASE_URL}/files/download/${fileId}`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('File download failed');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  // Messages
  getMessages: async (orderId) => {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/messages`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return await res.json();
  },

  sendMessage: async (orderId, text) => {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ message_text: text })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send message');
    return data;
  }
};
