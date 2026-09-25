/**
 * API Client - AssetFlow Frontend
 *
 * Centralized API client for communicating with the backend.
 * Handles authentication, request formatting, and error handling.
 */

import {
  type Allocation,
  type AppNotification,
  type Asset,
  type AssetCategory,
  type AuditCycle,
  type Booking,
  type Department,
  type MaintenanceRequest,
  type User,
  toQueryString,
} from "@/types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

interface ListEnvelope<T> {
  total?: number;
  page?: number;
  limit?: number;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("assetflow_token");
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("assetflow_token", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("assetflow_token");
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Request failed");
      }

      return data.data as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Request failed");
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

const api = new ApiClient(API_BASE);

// Shared list response shapes
export interface DepartmentsResponse extends ListEnvelope<Department> {
  departments: Department[];
}
export interface CategoriesResponse extends ListEnvelope<AssetCategory> {
  categories: AssetCategory[];
}
export interface AssetsResponse extends ListEnvelope<Asset> {
  assets: Asset[];
}
export interface EmployeesResponse extends ListEnvelope<User> {
  employees: User[];
}
export interface AllocationsResponse extends ListEnvelope<Allocation> {
  allocations: Allocation[];
}
export interface BookingsResponse extends ListEnvelope<Booking> {
  bookings: Booking[];
}
export interface MaintenanceResponse extends ListEnvelope<MaintenanceRequest> {
  requests: MaintenanceRequest[];
}
export interface AuditsResponse extends ListEnvelope<AuditCycle> {
  cycles: AuditCycle[];
}
export interface NotificationsResponse extends ListEnvelope<AppNotification> {
  notifications: AppNotification[];
}

export interface DashboardStats {
  totalAssets?: number;
  allocatedAssets?: number;
  maintenanceToday?: number;
  activeBookings?: number;
  [key: string]: unknown;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthResponse {
  message?: string;
}

export type ReportRow = Record<string, unknown>;

// Dashboard API
export const dashboardApi = {
  getStats: () => api.get<DashboardStats>("/dashboard/stats"),
};

// Assets API
export const assetsApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<AssetsResponse>(`/assets?${toQueryString(params)}`),
  getById: (id: string) => api.get<Asset>(`/assets/${id}`),
  create: (data: Record<string, unknown>) => api.post<Asset>("/assets", data),
  update: (id: string, data: Record<string, unknown>) => api.put<Asset>(`/assets/${id}`, data),
  delete: (id: string) => api.delete<unknown>(`/assets/${id}`),
  getSummary: () => api.get<ReportRow>("/assets/summary"),
};

// Categories API
export const categoriesApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<CategoriesResponse>(`/asset-categories?${toQueryString(params)}`),
  getById: (id: string) => api.get<AssetCategory>(`/asset-categories/${id}`),
  create: (data: Record<string, unknown>) => api.post<AssetCategory>("/asset-categories", data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put<AssetCategory>(`/asset-categories/${id}`, data),
};

// Departments API
export const departmentsApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<DepartmentsResponse>(`/departments?${toQueryString(params)}`),
  getById: (id: string) => api.get<Department>(`/departments/${id}`),
  create: (data: Record<string, unknown>) => api.post<Department>("/departments", data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put<Department>(`/departments/${id}`, data),
};

// Employees API
export const employeesApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<EmployeesResponse>(`/employees?${toQueryString(params)}`),
  getById: (id: string) => api.get<User>(`/employees/${id}`),
  create: (data: Record<string, unknown>) => api.post<AuthResponse>("/auth/signup", data),
  update: (id: string, data: Record<string, unknown>) => api.put<User>(`/employees/${id}`, data),
  promote: (id: string, role: string) => api.patch<User>(`/employees/${id}/promote`, { role }),
};

// Allocations API
export const allocationsApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<AllocationsResponse>(`/allocations?${toQueryString(params)}`),
  checkout: (data: Record<string, unknown>) => api.post<Allocation>("/allocations/checkout", data),
  checkin: (id: string, data: Record<string, unknown>) =>
    api.post<Allocation>(`/allocations/check-in/${id}`, data),
  getOverdue: (params?: Record<string, unknown>) =>
    api.get<AllocationsResponse>(`/allocations/overdue?${toQueryString(params)}`),
};

// Bookings API
export const bookingsApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<BookingsResponse>(`/bookings?${toQueryString(params)}`),
  create: (data: Record<string, unknown>) => api.post<Booking>("/bookings", data),
  cancel: (id: string) => api.post<Booking>(`/bookings/${id}/cancel`),
  reschedule: (id: string, data: Record<string, unknown>) =>
    api.put<Booking>(`/bookings/${id}/reschedule`, data),
  getResourceHistory: (resourceId: string) =>
    api.get<BookingsResponse>(`/bookings/resource/${resourceId}`),
};

// Maintenance API
export const maintenanceApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<MaintenanceResponse>(`/maintenance?${toQueryString(params)}`),
  create: (data: Record<string, unknown>) => api.post<MaintenanceRequest>("/maintenance", data),
  updateStatus: (id: string, status: string, data?: Record<string, unknown>) =>
    api.patch<MaintenanceRequest>(`/maintenance/${id}/status`, { status, ...data }),
  getAssetHistory: (assetId: string) =>
    api.get<MaintenanceResponse>(`/maintenance/asset/${assetId}`),
};

// Audits API
export const auditsApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<AuditsResponse>(`/audits?${toQueryString(params)}`),
  getById: (id: string) => api.get<AuditCycle>(`/audits/${id}`),
  create: (data: Record<string, unknown>) => api.post<AuditCycle>("/audits", data),
  start: (id: string) => api.post<AuditCycle>(`/audits/${id}/start`),
  verifyAsset: (id: string, assetId: string, data: Record<string, unknown>) =>
    api.post<AuditCycle>(`/audits/${id}/verify/${assetId}`, data),
  close: (id: string) => api.post<AuditCycle>(`/audits/${id}/close`),
  getDiscrepancies: (id: string) => api.get<ReportRow[]>(`/audits/${id}/discrepancies`),
};

// Notifications API
export const notificationsApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<NotificationsResponse>(`/notifications?${toQueryString(params)}`),
  markRead: (id: string) => api.patch<AppNotification>(`/notifications/${id}/read`),
  markAllRead: () => api.patch<unknown>("/notifications/read-all"),
};

// Reports API
export const reportsApi = {
  getUtilization: (params?: Record<string, unknown>) =>
    api.get<ReportRow[]>(`/reports/utilization?${toQueryString(params)}`),
  getUsageComparison: (params?: Record<string, unknown>) =>
    api.get<ReportRow[]>(`/reports/usage-comparison?${toQueryString(params)}`),
  getMaintenanceFrequency: (params?: Record<string, unknown>) =>
    api.get<ReportRow[]>(`/reports/maintenance-frequency?${toQueryString(params)}`),
  getRetirementForecast: (params?: Record<string, unknown>) =>
    api.get<ReportRow[]>(`/reports/retirement-forecast?${toQueryString(params)}`),
  getDepartmentSummary: (params?: Record<string, unknown>) =>
    api.get<ReportRow[]>(`/reports/departments-summary?${toQueryString(params)}`),
  getBookingHeatmap: (params?: Record<string, unknown>) =>
    api.get<ReportRow[]>(`/reports/bookings-heatmap?${toQueryString(params)}`),
};

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>("/auth/login", { email, password }),
  register: (data: Record<string, unknown>) => api.post<AuthResponse>("/auth/signup", data),
  logout: () => api.post<unknown>("/auth/logout"),
  getMe: () => api.get<User>("/auth/me"),
  forgotPassword: (email: string) => api.post<AuthResponse>("/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) =>
    api.put<AuthResponse>(`/auth/reset-password/${token}`, { password }),
};

export default api;
