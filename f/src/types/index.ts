// User Types
export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'engineer';
  createdAt?: Date;
}

// Device Types
export interface Device {
  _id: string;
  name: string;
  serialId: string;
  hospitalId: User | string;
  status: 'Working' | 'Fault' | 'Under Maintenance';
  location?: string;
  createdAt?: Date;
}

// Maintenance Request Types
export interface MaintenanceRequest {
  _id: string;
  deviceId: Device | string;
  hospitalId: User | string;
  assignedEngineer?: User | string;
  issueDescription: string;
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed';
  createdAt: Date;
  updatedAt?: Date;
}

// Device Log Types
export interface DeviceLog {
  _id: string;
  deviceId: Device | string;
  changedby: User | string;
  oldStatus: 'Working' | 'Fault' | 'Under Maintenance';
  newStatus: 'Working' | 'Fault' | 'Under Maintenance';
  notes?: string;
  createdAt: Date;
}

// Form Data Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'customer' | 'engineer';
  hospitalName?: string;
  specialization?: string;
  phone?: string;
}

export interface DeviceFormData {
  name: string;
  serialId: string;
  hospitalId: string;
  location?: string;
  status?: string;
}

export interface MaintenanceFormData {
  deviceId: string;
  issueDescription: string;
}

export interface MaintenanceUpdateData {
  status: 'In Progress' | 'Completed';
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

// Component Props Types
export interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export interface NavbarProps {
  user: User;
  onLogout: () => void;
}

export interface DeviceListProps {
  devices: Device[];
}

export interface MaintenanceListProps {
  requests: MaintenanceRequest[];
  engineers?: User[];
  onUpdate: () => void;
  isAdmin?: boolean;
  isEngineer?: boolean;
}

export interface ReportFaultProps {
  devices: Device[];
  onClose: () => void;
}

export interface AddDeviceProps {
  onClose: () => void;
}

export interface DevicesResponse {
  devices: Device[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalDevices: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
