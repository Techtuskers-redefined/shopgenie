import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Update this to your actual backend URL
const API_BASE_URL = __DEV__ 
  ? 'http://192.168.29.118:3000/api'  // Development
  : 'https://your-production-api.com/api'; // Production

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });
          
          await SecureStore.setItemAsync('accessToken', response.data.accessToken);
          await SecureStore.setItemAsync('refreshToken', response.data.refreshToken);
          
          // Retry original request
          error.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return api.request(error.config);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
      }
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth endpoints
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  // Google OAuth login
  googleLogin: async (idToken: string) => {
    const response = await api.post('/auth/google', { idToken });
    return response.data;
  },

  // Apple OAuth login
  appleLogin: async (idToken: string) => {
    const response = await api.post('/auth/apple', { idToken });
    return response.data;
  },

  // Assistant endpoints
  searchProducts: async (prompt: string) => {
    const response = await api.post('/assistant/search', { prompt });
    return response.data;
  },

  // Shopping list endpoints
  saveShoppingList: async (listData: any) => {
    const response = await api.post('/shopping-lists', listData);
    return response.data;
  },

  getShoppingLists: async () => {
    const response = await api.get('/shopping-lists');
    return response.data;
  },

  updateShoppingList: async (id: string, updates: any) => {
    const response = await api.put(`/shopping-lists/${id}`, updates);
    return response.data;
  },

  deleteShoppingList: async (id: string) => {
    const response = await api.delete(`/shopping-lists/${id}`);
    return response.data;
  },

  // Deals endpoints
  getDeals: async (filters?: { aisle?: number; category?: string }) => {
    const params = new URLSearchParams();
    if (filters?.aisle) params.append('aisle', filters.aisle.toString());
    if (filters?.category) params.append('category', filters.category);
    
    const response = await api.get(`/deals?${params.toString()}`);
    return response.data;
  },

  getLocationDeals: async (aisle: number) => {
    const response = await api.get(`/deals/location/${aisle}`);
    return response.data;
  },

  // Insights endpoints
  getInsights: async () => {
    const response = await api.get('/insights');
    return response.data;
  },

  updateInsights: async (data: { savings?: number; calories?: number; healthScore?: number }) => {
    const response = await api.post('/insights/update', data);
    return response.data;
  },
};