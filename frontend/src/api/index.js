// Centralized API Client Layer for FixNear Platform

const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('fixnear_auth_token');
  const defaultHeaders = {
    'Content-Type': 'application/json'
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.error || `HTTP error! Status: ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth API
  auth: {
    getUsers: () => request('/api/auth/users'),
    login: (email, password) => request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
    register: (userData) => request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
    getMe: () => request('/api/auth/me')
  },

  // Categories API
  categories: {
    getAll: () => request('/api/categories'),
    create: (categoryData) => request('/api/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    })
  },

  // Technicians API
  technicians: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.category) query.append('category', params.category);
      if (params.verified) query.append('verified', params.verified);
      if (params.min_rating) query.append('min_rating', params.min_rating);
      if (params.city) query.append('city', params.city);
      if (params.status) query.append('status', params.status);
      return request(`/api/technicians?${query.toString()}`);
    },
    getById: (id) => request(`/api/technicians/${id}`),
    update: (id, data) => request(`/api/technicians/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  // Bookings API
  bookings: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.customer_id) query.append('customer_id', params.customer_id);
      if (params.technician_id) query.append('technician_id', params.technician_id);
      if (params.status) query.append('status', params.status);
      return request(`/api/bookings?${query.toString()}`);
    },
    getById: (id) => request(`/api/bookings/${id}`),
    create: (bookingData) => request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    }),
    updateStatus: (id, statusData) => request(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData)
    })
  },

  // Reviews API
  reviews: {
    create: (reviewData) => request('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    })
  },

  // Payments API (Razorpay & Indian UPI)
  payments: {
    createOrder: (data) => request('/api/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    verify: (data) => request('/api/payments/verify', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // Admin API
  admin: {
    getVerifications: () => request('/api/admin/verifications'),
    verifyTechnician: (techId, status) => request(`/api/admin/verifications/${techId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
    getComplaints: () => request('/api/admin/complaints'),
    submitComplaint: (complaintData) => request('/api/admin/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData)
    }),
    updateComplaint: (id, resolutionData) => request(`/api/admin/complaints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(resolutionData)
    })
  },

  // Stats API
  stats: {
    getOverview: () => request('/api/stats')
  }
};
