import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh: refreshToken
        });
        
        localStorage.setItem('access_token', response.data.access_token);
        originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// ==================== AUTH ENDPOINTS ====================

export const login = async (username: string, password: string) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  
  const response = await api.post('/auth/token', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const register = async (userData: any) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// ==================== EVENTS ENDPOINTS ====================

export const getEvents = async (params?: {
  event_type?: string;
  start_date?: string;
  end_date?: string;
  parish_id?: number;  // Add this
  skip?: number;
  limit?: number;
}) => {
  const response = await api.get('/events', { params });
  return response.data;
};

export const getEvent = async (id: number) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export const createEvent = async (eventData: any) => {
  const response = await api.post('/events', eventData);
  return response.data;
};

export const updateEvent = async (id: number, eventData: any) => {
  const response = await api.put(`/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id: number) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};

// ==================== PARISHES ENDPOINTS ====================

export const getParishes = async () => {
  try {
    const response = await api.get('/parishes');
    return response.data;
  } catch (error) {
    console.error('Error fetching parishes:', error);
    return []; // Return empty array on error
  }
};


export const getParish = async (id: number) => {
  const response = await api.get(`/parishes/${id}`);
  return response.data;
};

export const createParish = async (parishData: any) => {
  const response = await api.post('/parishes', parishData);
  return response.data;
};

export const updateParish = async (id: number, parishData: any) => {
  const response = await api.put(`/parishes/${id}`, parishData);
  return response.data;
};

export const deleteParish = async (id: number) => {
  const response = await api.delete(`/parishes/${id}`);
  return response.data;
};

// ==================== USERS ENDPOINTS ====================

export const getUsers = async (params?: {
  role?: string;
  skip?: number;
  limit?: number;
}) => {
  const response = await api.get('/users', { params });
  return response.data;
};

export const getUser = async (id: number) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const getPriests = async () => {
  try {
    const response = await api.get('/users', { params: { role: 'PRIEST' } });
    return response.data;
  } catch (error) {
    console.error('Error fetching priests:', error);
    return []; // Return empty array on error
  }
};


// ==================== SACRAMENT RECORDS ENDPOINTS ====================

export const createSacramentRecord = async (recordData: any) => {
  try {
    console.log('Creating sacrament with data:', recordData);
    const response = await api.post('/sacraments', recordData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getSacramentRecords = async (params?: {
  parish_id?: number;
  sacrament_type?: string;
}) => {
  const response = await api.get('/sacraments', { params });
  return response.data;
};

export const updateSacramentRecord = async (id: number, recordData: any) => {
  const response = await api.put(`/sacrament-records/${id}`, recordData);
  return response.data;
};

export const deleteSacramentRecord = async (id: number) => {
  const response = await api.delete(`/sacrament-records/${id}`);
  return response.data;
};

// ==================== ANNOUNCEMENTS ENDPOINTS ====================

export const getAnnouncements = async (params?: {
  skip?: number;
  limit?: number;
}) => {
  const response = await api.get('/announcements', { params });
  return response.data;
};

export const createAnnouncement = async (announcementData: any) => {
  const response = await api.post('/announcements', announcementData);
  return response.data;
};

export const deleteAnnouncement = async (id: number) => {
  const response = await api.delete(`/announcements/${id}`);
  return response.data;
};

// ==================== DASHBOARD STATS ====================

export const getDashboardStats = async (role?: string) => {
  const response = await api.get('/dashboard/stats', { params: { role } });
  return response.data;
};

// ==================== HELPER FUNCTIONS ====================

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

export const getUserRole = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      return JSON.parse(user).role;
    } catch {
      return null;
    }
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export default api;