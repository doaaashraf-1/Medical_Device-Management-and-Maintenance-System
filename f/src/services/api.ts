import axios,{ AxiosResponse } from 'axios'
import {
  User,
  Device,
  MaintenanceRequest,
  LoginFormData,
  RegisterFormData,
  DeviceFormData,
  MaintenanceFormData,
  MaintenanceUpdateData,
  AuthResponse,
  ApiResponse,
  DevicesResponse
} from '../types';
const API_URL = 'http://localhost:5000'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      // Redirect to login if needed
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
/* ========= Auth API ========= */

export const authAPI = {
  login: (credentials: LoginFormData): Promise<AxiosResponse<AuthResponse>> => 
    api.post('/auth/login', credentials),
  
  register: (userData: RegisterFormData): Promise<AxiosResponse<{ message: string }>> => 
    api.post('/auth/register', userData),
  
  logout: (): Promise<AxiosResponse<{ message: string }>> => {
    // With JWT, logout is client-side only - just remove the token
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    return Promise.resolve({ data: { message: 'Logged out successfully' } } as AxiosResponse<{ message: string }>);
  },
  
  getCurrentUser: (): Promise<AxiosResponse<AuthResponse>> => 
    api.get('/auth/me')
};

// Device API
export const deviceAPI = {
  getAll: (): Promise<AxiosResponse<DevicesResponse>> => 
    api.get('/device'),
  
  getById: (id: string): Promise<AxiosResponse<Device>> => 
    api.get(`/device/${id}`),
  
  create: (data: DeviceFormData): Promise<AxiosResponse<Device>> => 
    api.post('/device/create', data),
  
  updateStatus: (id: string, data: { status: string; notes?: string }): Promise<AxiosResponse<Device>> => 
    api.patch(`/devices/${id}/status`, data),
  
  getHistory: (id: string): Promise<AxiosResponse<any[]>> => 
    api.get(`/devices/${id}/history`)
};

// Maintenance API
export const maintenanceAPI = {
  getAll: (): Promise<AxiosResponse<MaintenanceRequest[]>> => 
    api.get('/maintenance'),
  
  create: (data: MaintenanceFormData): Promise<AxiosResponse<MaintenanceRequest>> => 
    api.post('/maintenance/create', data),
  
  assignEngineer: (id: string, engineerId: string): Promise<AxiosResponse<MaintenanceRequest>> => 
    api.post(`/maintenance/assign/${id}`, { engineerId }),
  
  updateStatus: (id: string, data: MaintenanceUpdateData): Promise<AxiosResponse<MaintenanceRequest>> => 
    api.patch(`/maintenance/${id}/status`, data)
};

// User API
export const userAPI = {
  getAll: (): Promise<AxiosResponse<User[]>> => 
    api.get('/users'),
  
  getEngineers: (): Promise<AxiosResponse<User[]>> => 
    api.get('/users/engineer'),
  
  getCustomers: (): Promise<AxiosResponse<User[]>> => 
    api.get('/users/customer')
};

export default api

