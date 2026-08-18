export enum Category {
  WATER_SUPPLY = 'WATER_SUPPLY',
  WASTE_MANAGEMENT = 'WASTE_MANAGEMENT',
  ROADS = 'ROADS',
  STREET_LIGHTING = 'STREET_LIGHTING',
  DRAINAGE = 'DRAINAGE',
  ELECTRICITY = 'ELECTRICITY',
  PUBLIC_TRANSPORT = 'PUBLIC_TRANSPORT',
  SANITATION = 'SANITATION',
  ENCROACHMENT = 'ENCROACHMENT',
  PUBLIC_INFRASTRUCTURE = 'PUBLIC_INFRASTRUCTURE',
  OTHER = 'OTHER',
}

export enum Priority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum ComplaintStatus {
  SUBMITTED = 'SUBMITTED',
  AI_PROCESSING = 'AI_PROCESSING',
  CLASSIFIED = 'CLASSIFIED',
  ROUTED = 'ROUTED',
  ASSIGNED = 'ASSIGNED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  REOPENED = 'REOPENED',
}

export enum Role {
  CITIZEN = 'CITIZEN',
  OFFICER = 'OFFICER',
  DEPARTMENT_ADMIN = 'DEPARTMENT_ADMIN',
  CITY_ADMIN = 'CITY_ADMIN',
}

export type PortalType = 'citizen' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  city_id?: string;
  department_id?: string;
  department_name?: string;
  jurisdiction_id?: string;
  jurisdiction_name?: string;
  phone?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  created_at: string;
}

export interface Ward {
  id: string;
  city_id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  city_id: string;
  category_mapping: Category[];
  head_officer?: string;
  contact_email?: string;
  created_at: string;
}

export interface Officer {
  id: string;
  name: string;
  email: string;
  department_id: string;
  city_id: string;
  ward_id?: string;
  workload: number;
  status: 'ACTIVE' | 'INACTIVE';
  designation: string;
  phone: string;
  created_at: string;
}

export interface ComplaintComment {
  id: string;
  complaint_id: string;
  author_id: string;
  author_name: string;
  author_role: Role | string;
  text: string;
  is_internal?: boolean;
  created_at: string;
}

export interface ResolutionEvidence {
  notes: string;
  resolved_by: string;
  resolved_at: string;
  before_image_url?: string | null;
  after_image_url?: string | null;
  action_taken?: string;
  crew_dispatch_id?: string;
}

export interface ComplaintStatusHistory {
  id: string;
  complaint_id: string;
  old_status: ComplaintStatus;
  new_status: ComplaintStatus;
  changed_by: string;
  timestamp: string;
  comment?: string;
}

export type TimelineEvent = ComplaintStatusHistory;

export interface Feedback {
  id: string;
  complaint_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface AIAnalysis {
  language: string;
  original_language?: string;
  normalized_text: string;
  category: Category;
  subcategory?: string | null;
  priority: Priority;
  severity_score: number;
  city: string;
  location: string;
  duration?: string | null;
  affected_population_estimate?: string | null;
  department: string;
  suggested_action: string;
  confidence: number;
}

export interface Complaint {
  id: string;
  citizen_id: string;
  citizen_name?: string;
  citizen_email?: string;
  citizen_phone?: string;
  description: string;
  original_language: string;
  normalized_text: string;
  category: Category;
  subcategory?: string | null;
  priority: Priority;
  severity_score: number;
  city_id: string;
  city_name: string;
  ward_id?: string | null;
  ward_name?: string | null;
  location: string;
  latitude: number;
  longitude: number;
  duration?: string | null;
  image_url?: string | null;
  attachments?: string[];
  department_id?: string | null;
  department_name?: string | null;
  departmentId?: string | null;
  administrator_id?: string | null;
  administratorId?: string | null;
  jurisdiction_id?: string | null;
  jurisdictionId?: string | null;
  assigned_officer_id?: string | null;
  assigned_officer_name?: string | null;
  status: ComplaintStatus;
  ai_confidence: number;
  suggested_action?: string | null;
  sla_hours?: number;
  sla_deadline?: string;
  cluster_id?: string | null;
  related_complaints_count?: number;
  history?: ComplaintStatusHistory[];
  timeline?: ComplaintStatusHistory[];
  comments?: ComplaintComment[];
  resolution_evidence?: ResolutionEvidence | null;
  feedback?: Feedback | null;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
}

export interface ComplaintCluster {
  id: string;
  title: string;
  category: Category;
  city_id: string;
  city_name: string;
  ward_id?: string | null;
  ward_name?: string | null;
  location: string;
  latitude: number;
  longitude: number;
  complaint_count: number;
  priority: Priority;
  confidence: number;
  status: 'ACTIVE' | 'RESOLVING' | 'RESOLVED';
  recommended_action: string;
  member_complaint_ids: string[];
  spike_percentage: number;
  first_reported_at: string;
  last_reported_at: string;
  created_at: string;
  updated_at: string;
}

export interface Hotspot {
  id: string;
  title: string;
  city: string;
  ward: string;
  location: string;
  lat: number;
  lng: number;
  category: Category;
  complaint_count: number;
  primary_issue: string;
  severity: Priority;
  confidence: number;
  recommended_action: string;
}

export interface DashboardMetrics {
  total_complaints: number;
  pending_complaints: number;
  resolved_complaints: number;
  in_progress_complaints: number;
  critical_complaints: number;
  high_priority_complaints: number;
  average_resolution_hours: number;
  ai_routed_percentage: number;
  active_clusters: number;
  today_new_complaints: number;
}

export interface CityMetric {
  city_id: string;
  city: string;
  total_complaints: number;
  critical_complaints: number;
  high_priority: number;
  pending: number;
  resolved: number;
  resolution_rate: number;
  top_category: Category;
}

export interface CategoryMetric {
  category: Category;
  display_name: string;
  count: number;
  percentage: number;
  critical_count: number;
  avg_resolution_hours: number;
  trend: 'up' | 'down' | 'stable';
  growth_rate: number;
}

export interface DepartmentMetric {
  department_id: string;
  department_name: string;
  total_assigned: number;
  pending: number;
  in_progress: number;
  resolved: number;
  workload_percentage: number;
  officers_count: number;
}

export interface TrendDataPoint {
  date: string;
  total: number;
  water: number;
  waste: number;
  roads: number;
  drainage: number;
  electricity: number;
  other: number;
}

export interface AIProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: string;
}

export interface FilterState {
  city: string;
  ward: string;
  category: string;
  department: string;
  priority: string;
  status: string;
  searchQuery: string;
  dateRange: 'all' | 'today' | '7d' | '30d';
}

export interface RealtimeEvent {
  type: string;
  data?: any;
  timestamp: string;
  complaint?: Complaint;
  cluster?: ComplaintCluster;
  message?: string;
}

export type SSEEvent = RealtimeEvent;
export type IncidentCluster = ComplaintCluster;

