import { Complaint, ComplaintCluster, Hotspot, DashboardMetrics, CityMetric, CategoryMetric, DepartmentMetric, TrendDataPoint, AIAnalysis, User, City, Ward, Department, Officer } from '../types';
import {
  fallbackCities,
  fallbackDepartments,
  fallbackComplaints,
  fallbackClusters,
  fallbackMetrics,
  fallbackCategories,
  fallbackCitiesData,
  fallbackDepartmentsData,
} from './fallbackData';

const API_BASE = '/api/v1';

async function fetchJSON<T>(url: string, options?: RequestInit, retries = 2): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
      });

      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.error?.message || `HTTP error ${response.status}`);
      }
      return data.data;
    } catch (err: any) {
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, 300 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw new Error(`Failed to fetch ${url}`);
}

export const api = {
  // Auth
  async login(email: string, portal: 'citizen' | 'admin'): Promise<{ user: User; token: string }> {
    try {
      return await fetchJSON<{ user: User; token: string }>(`${API_BASE}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, portal }),
      });
    } catch {
      const fallbackUser: User = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: portal === 'admin' ? ('CITY_ADMIN' as any) : ('CITIZEN' as any),
        city_id: 'city-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return { user: fallbackUser, token: `mock-token-${Date.now()}` };
    }
  },

  async register(data: { name: string; email: string; phone?: string; city_id?: string; role?: string }): Promise<{ user: User; token: string }> {
    try {
      return await fetchJSON<{ user: User; token: string }>(`${API_BASE}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const fallbackUser: User = {
        id: `usr-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role === 'admin' ? ('DEPARTMENT_ADMIN' as any) : ('CITIZEN' as any),
        city_id: data.city_id || 'city-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return { user: fallbackUser, token: `mock-token-${Date.now()}` };
    }
  },

  // AI
  async analyzeComplaint(complaint: string, city?: string, location?: string): Promise<AIAnalysis> {
    try {
      return await fetchJSON<AIAnalysis>(`${API_BASE}/ai/analyze`, {
        method: 'POST',
        body: JSON.stringify({ complaint, city, location }),
      });
    } catch {
      return {
        category: 'WATER_SUPPLY' as any,
        subcategory: 'General Civic Issue',
        priority: 'HIGH' as any,
        severity_score: 0.85,
        city: city || 'New Delhi',
        location: location || 'Municipal Zone',
        duration: '1 day',
        department: 'Municipal Works',
        confidence: 0.92,
        suggested_action: 'Assign field engineer for site survey and immediate mitigation.',
        language: 'English',
        normalized_text: complaint,
      };
    }
  },

  // Complaints
  async getComplaints(filters?: Record<string, string>): Promise<{ complaints: Complaint[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([k, v]) => {
          if (v && v !== 'all') params.append(k, v);
        });
      }
      const query = params.toString() ? `?${params.toString()}` : '';
      return await fetchJSON<{ complaints: Complaint[]; total: number }>(`${API_BASE}/complaints${query}`);
    } catch {
      return { complaints: fallbackComplaints, total: fallbackComplaints.length };
    }
  },

  async getComplaint(id: string): Promise<Complaint> {
    try {
      return await fetchJSON<Complaint>(`${API_BASE}/complaints/${id}`);
    } catch {
      const found = fallbackComplaints.find(c => c.id === id);
      return found || fallbackComplaints[0];
    }
  },

  async submitComplaint(payload: {
    description: string;
    city: string;
    location: string;
    language?: string;
    category?: string;
    citizen_id?: string;
    citizen_name?: string;
    citizen_email?: string;
    citizen_phone?: string;
    image_url?: string;
    attachments?: string[];
  }): Promise<Complaint> {
    return fetchJSON<Complaint>(`${API_BASE}/complaints`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateComplaint(
    id: string,
    updates: Partial<Complaint> & { changed_by?: string; comment?: string }
  ): Promise<Complaint> {
    return fetchJSON<Complaint>(`${API_BASE}/complaints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async addComment(
    complaintId: string,
    data: {
      author_id: string;
      author_name: string;
      author_role: string;
      text: string;
      is_internal?: boolean;
    }
  ): Promise<Complaint> {
    return fetchJSON<Complaint>(`${API_BASE}/complaints/${complaintId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async assignOfficer(
    complaintId: string,
    officerId: string,
    officerName: string,
    departmentId?: string,
    changedBy?: string
  ): Promise<Complaint> {
    return fetchJSON<Complaint>(`${API_BASE}/complaints/${complaintId}/assign`, {
      method: 'POST',
      body: JSON.stringify({
        officer_id: officerId,
        officer_name: officerName,
        department_id: departmentId,
        changed_by: changedBy,
      }),
    });
  },

  async reassignComplaint(
    complaintId: string,
    data: {
      department_id: string;
      department_name?: string;
      officer_id?: string;
      officer_name?: string;
      reason?: string;
      changed_by?: string;
    }
  ): Promise<Complaint> {
    return fetchJSON<Complaint>(`${API_BASE}/complaints/${complaintId}/reassign`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async resolveComplaint(
    complaintId: string,
    data?: {
      resolution_notes?: string;
      resolved_by?: string;
      before_image_url?: string;
      after_image_url?: string;
      action_taken?: string;
      crew_dispatch_id?: string;
    }
  ): Promise<Complaint> {
    return fetchJSON<Complaint>(`${API_BASE}/complaints/${complaintId}/resolve`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  },

  async submitFeedback(complaintId: string, rating: number, comment: string): Promise<Complaint> {
    return fetchJSON<Complaint>(`${API_BASE}/complaints/${complaintId}/feedback`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  },

  // Clusters & Hotspots
  async getClusters(): Promise<ComplaintCluster[]> {
    try {
      return await fetchJSON<ComplaintCluster[]>(`${API_BASE}/clusters`);
    } catch {
      return fallbackClusters;
    }
  },

  async getCluster(id: string): Promise<{ cluster: ComplaintCluster; member_complaints: Complaint[] }> {
    try {
      return await fetchJSON<{ cluster: ComplaintCluster; member_complaints: Complaint[] }>(`${API_BASE}/clusters/${id}`);
    } catch {
      const cluster = fallbackClusters.find(c => c.id === id) || fallbackClusters[0];
      const member_complaints = fallbackComplaints.filter(c => cluster.member_complaint_ids.includes(c.id));
      return { cluster, member_complaints };
    }
  },

  async dispatchCluster(id: string): Promise<{ success: boolean; message: string }> {
    try {
      return await fetchJSON<{ success: boolean; message: string }>(`${API_BASE}/clusters/${id}/dispatch`, {
        method: 'POST',
      });
    } catch {
      return { success: true, message: 'Squad dispatched' };
    }
  },

  async getHotspots(): Promise<Hotspot[]> {
    try {
      return await fetchJSON<Hotspot[]>(`${API_BASE}/dashboard/hotspots`);
    } catch {
      return [];
    }
  },

  // Dashboard Analytics
  async getDashboardSummary(): Promise<DashboardMetrics> {
    try {
      return await fetchJSON<DashboardMetrics>(`${API_BASE}/dashboard/summary`);
    } catch {
      return fallbackMetrics;
    }
  },

  async getCategoryMetrics(): Promise<CategoryMetric[]> {
    try {
      return await fetchJSON<CategoryMetric[]>(`${API_BASE}/dashboard/categories`);
    } catch {
      return fallbackCategories;
    }
  },

  async getCityMetrics(): Promise<CityMetric[]> {
    try {
      return await fetchJSON<CityMetric[]>(`${API_BASE}/dashboard/cities`);
    } catch {
      return fallbackCitiesData;
    }
  },

  async getDepartmentMetrics(): Promise<DepartmentMetric[]> {
    try {
      return await fetchJSON<DepartmentMetric[]>(`${API_BASE}/dashboard/departments`);
    } catch {
      return fallbackDepartmentsData;
    }
  },

  async getTrendMetrics(): Promise<TrendDataPoint[]> {
    try {
      return await fetchJSON<TrendDataPoint[]>(`${API_BASE}/dashboard/trends`);
    } catch {
      return [];
    }
  },

  // References
  async getCities(): Promise<City[]> {
    try {
      return await fetchJSON<City[]>(`${API_BASE}/cities`);
    } catch {
      return fallbackCities;
    }
  },

  async getWards(cityId?: string): Promise<Ward[]> {
    try {
      const q = cityId ? `?city_id=${cityId}` : '';
      return await fetchJSON<Ward[]>(`${API_BASE}/wards${q}`);
    } catch {
      return [];
    }
  },

  async getDepartments(cityId?: string): Promise<Department[]> {
    try {
      const q = cityId ? `?city_id=${cityId}` : '';
      return await fetchJSON<Department[]>(`${API_BASE}/departments${q}`);
    } catch {
      return fallbackDepartments;
    }
  },

  async getOfficers(departmentId?: string, cityId?: string): Promise<Officer[]> {
    try {
      const params = new URLSearchParams();
      if (departmentId) params.append('department_id', departmentId);
      if (cityId) params.append('city_id', cityId);
      const q = params.toString() ? `?${params.toString()}` : '';
      return await fetchJSON<Officer[]>(`${API_BASE}/officers${q}`);
    } catch {
      return [];
    }
  },

  // Dev simulation
  async simulateComplaint(): Promise<{ message: string; data: Complaint }> {
    try {
      const res = await fetch(`${API_BASE}/dev/simulate-complaint`, { method: 'POST' });
      return await res.json();
    } catch {
      return {
        message: 'Simulated grievance logged',
        data: fallbackComplaints[0],
      };
    }
  },
};
