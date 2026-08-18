import React, { useState } from 'react';
import { Shield, Sparkles, RefreshCw, Layers, MapPin, Building2, Flame } from 'lucide-react';
import {
  DashboardMetrics,
  CategoryMetric,
  CityMetric,
  IncidentCluster,
  Complaint,
  City,
  Department,
  User,
} from '../../types';
import { KPIGrid } from './KPIGrid';
import { CategoryAnalyticsChart } from './CategoryAnalyticsChart';
import { CityAnalyticsChart } from './CityAnalyticsChart';
import { CivicMapView } from './CivicMapView';
import { HotspotsAndClustersPanel } from './HotspotsAndClustersPanel';
import { DepartmentStatusCard } from './DepartmentStatusCard';
import { ComplaintsTable } from './ComplaintsTable';

interface AdminDashboardProps {
  metrics: DashboardMetrics | null;
  categories: CategoryMetric[];
  cityMetrics: CityMetric[];
  clusters: IncidentCluster[];
  complaints: Complaint[];
  cities: City[];
  departments: Department[];
  currentUser: User | null;
  onSelectComplaint: (complaint: Complaint) => void;
  onSelectCluster: (cluster: IncidentCluster) => void;
  onDispatchCluster: (clusterId: string) => void;
  onRefresh: () => void;
  onSimulate: () => void;
  isSimulating?: boolean;
  onComplaintUpdated?: (complaint: Complaint) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  metrics,
  categories,
  cityMetrics,
  clusters,
  complaints,
  cities,
  departments,
  currentUser,
  onSelectComplaint,
  onSelectCluster,
  onDispatchCluster,
  onRefresh,
  onSimulate,
  isSimulating,
  onComplaintUpdated,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter complaints based on search and dropdown selections
  const filteredComplaints = complaints.filter(c => {
    const matchCity = selectedCity === 'all' || c.city_name.toLowerCase() === selectedCity.toLowerCase();
    const matchCategory = selectedCategory === 'all' || c.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchPriority = selectedPriority === 'all' || c.priority.toLowerCase() === selectedPriority.toLowerCase();
    const matchStatus = selectedStatus === 'all' || c.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchSearch =
      !searchQuery ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCity && matchCategory && matchPriority && matchStatus && matchSearch;
  });

  return (
    <div id="admin-dashboard" className="max-w-7xl mx-auto p-4 sm:p-8 text-slate-900 font-sans space-y-6">
      {/* Top Welcome & Quick Actions Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Administrator Command Console • Zonal Oversight</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Municipal Operations Command Center
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Real-time automated grievance intake triage, machine-learning incident clustering, and multi-city emergency crew dispatch system.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-stretch md:self-auto">
          <button
            onClick={onRefresh}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Sync Data</span>
          </button>

          <button
            onClick={onSimulate}
            disabled={isSimulating}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 text-amber-400 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulating...' : 'Simulate Complaint'}</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <KPIGrid metrics={metrics} />

      {/* Analytics Row: Category Distribution & City Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryAnalyticsChart
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <CityAnalyticsChart
          cities={cityMetrics}
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
        />
      </div>

      {/* Spatial Mapping & Active Incident Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CivicMapView
            clusters={clusters}
            complaints={complaints}
            selectedCity={selectedCity}
            onSelectCluster={onSelectCluster}
            onSelectComplaint={onSelectComplaint}
          />
        </div>
        <div>
          <HotspotsAndClustersPanel
            clusters={clusters}
            onSelectCluster={onSelectCluster}
            onDispatchCluster={onDispatchCluster}
          />
        </div>
      </div>

      {/* Department Workload Status */}
      <DepartmentStatusCard
        departments={departments}
        selectedDepartment={selectedCategory}
        onSelectDepartment={setSelectedCategory}
      />

      {/* Primary Complaints Triage Feed Table */}
      <ComplaintsTable
        complaints={filteredComplaints}
        cities={cities}
        departments={departments}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedPriority={selectedPriority}
        onSelectPriority={setSelectedPriority}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectComplaint={onSelectComplaint}
        onComplaintUpdated={onComplaintUpdated}
        currentUser={currentUser}
      />
    </div>
  );
};
