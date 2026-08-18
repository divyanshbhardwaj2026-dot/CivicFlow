import React, { useState, useEffect, useCallback } from 'react';
import {
  PortalType,
  User,
  Complaint,
  ComplaintCluster,
  Hotspot,
  DashboardMetrics,
  CategoryMetric,
  CityMetric,
  DepartmentMetric,
  City,
  Department,
  FilterState,
  SSEEvent,
} from './types';
import { api } from './lib/api';
import { RoleSelectionGateway } from './components/RoleSelectionGateway';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { CitizenDashboard } from './components/CitizenPortal/CitizenDashboard';
import { NewComplaintForm } from './components/CitizenPortal/NewComplaintForm';
import { ComplaintDetailModal } from './components/CitizenPortal/ComplaintDetailModal';
import { AdminDashboard } from './components/AdminPortal/AdminDashboard';
import { IncidentClusterDetailModal } from './components/AdminPortal/IncidentClusterDetailModal';
import { RealtimeToast } from './components/RealtimeToast';

export default function App() {
  // Navigation & Role State
  const [currentPortal, setCurrentPortal] = useState<PortalType>(() => {
    const saved = localStorage.getItem('civicflow_portal');
    return (saved as PortalType) || null;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('civicflow_user');
    return saved ? JSON.parse(saved) : null;
  });

  // UI Modals & Views
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<ComplaintCluster | null>(null);
  const [clusterMembers, setClusterMembers] = useState<Complaint[]>([]);
  const [toastEvent, setToastEvent] = useState<SSEEvent | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Data Store
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [clusters, setClusters] = useState<ComplaintCluster[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [categories, setCategories] = useState<CategoryMetric[]>([]);
  const [citiesData, setCitiesData] = useState<CityMetric[]>([]);
  const [departmentsData, setDepartmentsData] = useState<DepartmentMetric[]>([]);
  const [citiesList, setCitiesList] = useState<City[]>([]);
  const [departmentsList, setDepartmentsList] = useState<Department[]>([]);

  // Save Portal & User selections to localStorage
  const handleSelectPortal = (portal: PortalType) => {
    setCurrentPortal(portal);
    if (portal) {
      localStorage.setItem('civicflow_portal', portal);
    } else {
      localStorage.removeItem('civicflow_portal');
    }
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthOpen(false);
    localStorage.setItem('civicflow_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('civicflow_user');
  };

  // Primary Data Fetcher
  const loadDashboardData = useCallback(async () => {
    try {
      const [
        complaintsRes,
        clustersRes,
        hotspotsRes,
        metricsRes,
        catRes,
        cityRes,
        deptRes,
        citiesRef,
        deptRef,
      ] = await Promise.all([
        api.getComplaints(),
        api.getClusters(),
        api.getHotspots(),
        api.getDashboardSummary(),
        api.getCategoryMetrics(),
        api.getCityMetrics(),
        api.getDepartmentMetrics(),
        api.getCities(),
        api.getDepartments(),
      ]);

      setComplaints(complaintsRes.complaints || []);
      setClusters(clustersRes || []);
      setHotspots(hotspotsRes || []);
      setMetrics(metricsRes);
      setCategories(catRes || []);
      setCitiesData(cityRes || []);
      setDepartmentsData(deptRes || []);
      setCitiesList(citiesRef || []);
      setDepartmentsList(deptRef || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Real-Time Server-Sent Events (SSE) Listener
  useEffect(() => {
    const eventSource = new EventSource('/api/v1/events');

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'complaint_created') {
          const newComplaint: Complaint = payload.data;
          setComplaints(prev => [newComplaint, ...prev.filter(c => c.id !== newComplaint.id)]);
          setToastEvent({
            type: 'complaint_created',
            data: {
              complaint: newComplaint,
              message: `New ${newComplaint.category?.replace('_', ' ') || 'Grievance'} logged in ${newComplaint.location || 'Municipal Ward'}`,
            },
            timestamp: new Date().toISOString(),
          });
          // Refresh aggregated metrics
          api.getDashboardSummary().then(setMetrics).catch(() => {});
          api.getCategoryMetrics().then(setCategories).catch(() => {});
          api.getCityMetrics().then(setCitiesData).catch(() => {});
          api.getClusters().then(setClusters).catch(() => {});
        } else if (payload.type === 'complaint_updated') {
          const updated: Complaint = payload.data;
          setComplaints(prev => prev.map(c => (c.id === updated.id ? updated : c)));
          if (selectedComplaint?.id === updated.id) {
            setSelectedComplaint(updated);
          }
          api.getDashboardSummary().then(setMetrics).catch(() => {});
        } else if (payload.type === 'cluster_created' || payload.type === 'cluster_updated') {
          api.getClusters().then(setClusters).catch(() => {});
        }
      } catch (e) {
        console.error('SSE JSON parse error:', e);
      }
    };

    eventSource.onerror = () => {
      // SSE reconnects automatically
    };

    return () => {
      eventSource.close();
    };
  }, [selectedComplaint]);

  // Simulation Trigger for Presentation Demos
  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const res = await api.simulateComplaint();
      if (res.data) {
        setComplaints(prev => [res.data, ...prev.filter(c => c.id !== res.data.id)]);
        setToastEvent({
          type: 'complaint_created',
          data: {
            complaint: res.data,
            message: `Simulated grievance triaged: ${res.data.category?.replace('_', ' ')} in ${res.data.location}`,
          },
          timestamp: new Date().toISOString(),
        });
        loadDashboardData();
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  // When a cluster is selected, fetch its member complaints
  const handleSelectCluster = async (cluster: ComplaintCluster) => {
    setSelectedCluster(cluster);
    try {
      const res = await api.getCluster(cluster.id);
      setClusterMembers(res.member_complaints || []);
    } catch (err) {
      const clusterMemberIds = cluster.member_complaint_ids || (cluster as any).complaint_ids || [];
      const matched = complaints.filter(c => clusterMemberIds.includes(c.id));
      setClusterMembers(matched);
    }
  };

  const handleDispatchCluster = async (clusterId: string) => {
    try {
      await api.dispatchCluster(clusterId);
      setClusters(prev =>
        prev.map(c => (c.id === clusterId ? { ...c, status: 'RESOLVED' as any } : c))
      );
      if (selectedCluster?.id === clusterId) {
        setSelectedCluster(prev => (prev ? { ...prev, status: 'RESOLVED' as any } : null));
      }
    } catch (err) {
      console.error('Dispatch cluster error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 1. First Screen: Role Selection Gateway (if portal is not chosen yet) */}
      {!currentPortal ? (
        <RoleSelectionGateway onSelectPortal={handleSelectPortal} />
      ) : (
        <>
          {/* Header Navigation */}
          <Navbar
            currentPortal={currentPortal}
            currentUser={currentUser}
            onSwitchPortal={handleSelectPortal}
            onOpenAuth={() => setIsAuthOpen(true)}
            onLogout={handleLogout}
            onSimulate={handleSimulate}
            isSimulating={isSimulating}
          />

          {/* Main Body View based on Selected Portal */}
          <main className="flex-1 py-6 px-4 sm:px-6">
            {currentPortal === 'citizen' ? (
              isNewComplaintOpen ? (
                <NewComplaintForm
                  cities={citiesList}
                  currentUserId={currentUser?.id}
                  currentUserName={currentUser?.name}
                  onCancel={() => setIsNewComplaintOpen(false)}
                  onComplaintSubmitted={(newC) => {
                    setIsNewComplaintOpen(false);
                    setComplaints(prev => [newC, ...prev.filter(c => c.id !== newC.id)]);
                    setSelectedComplaint(newC);
                    loadDashboardData();
                  }}
                />
              ) : (
                <CitizenDashboard
                  complaints={complaints}
                  currentUser={currentUser}
                  onOpenNewComplaint={() => setIsNewComplaintOpen(true)}
                  onSelectComplaint={setSelectedComplaint}
                />
              )
            ) : (
              <AdminDashboard
                metrics={metrics}
                categories={categories}
                cityMetrics={citiesData}
                clusters={clusters}
                complaints={complaints}
                cities={citiesList}
                departments={departmentsList}
                currentUser={currentUser}
                onSelectComplaint={setSelectedComplaint}
                onSelectCluster={handleSelectCluster}
                onDispatchCluster={handleDispatchCluster}
                onRefresh={loadDashboardData}
                onSimulate={handleSimulate}
                isSimulating={isSimulating}
                onComplaintUpdated={(updated) => {
                  setComplaints(prev => prev.map(c => (c.id === updated.id ? updated : c)));
                  loadDashboardData();
                }}
              />
            )}
          </main>

          {/* Official Civic Footer (Matching Reference Layout) */}
          <footer className="bg-slate-900 text-slate-400 text-xs px-6 py-6 border-t border-slate-800 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-bold text-white">CivicFlow AI</span> • National Smart Governance &amp; Grievance Redressal Network
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                <span>Citizen Charter</span>
                <span>Privacy &amp; Data Ethics</span>
                <span>Open Data API</span>
                <span>24x7 Help Desk</span>
              </div>
            </div>
          </footer>

          {/* Modals & Overlays */}
          {isAuthOpen && (
            <AuthModal
              onClose={() => setIsAuthOpen(false)}
              onLogin={handleAuthSuccess}
            />
          )}

          <ComplaintDetailModal
            complaint={selectedComplaint}
            isAdmin={currentPortal === 'admin'}
            onClose={() => setSelectedComplaint(null)}
            onComplaintUpdated={(updated) => {
              setSelectedComplaint(updated);
              setComplaints(prev => prev.map(c => (c.id === updated.id ? updated : c)));
              loadDashboardData();
            }}
          />

          <IncidentClusterDetailModal
            cluster={selectedCluster}
            memberComplaints={clusterMembers}
            complaints={complaints}
            onClose={() => setSelectedCluster(null)}
            onDispatchCluster={handleDispatchCluster}
            onSelectComplaint={setSelectedComplaint}
          />

          <RealtimeToast
            event={toastEvent}
            onClose={() => setToastEvent(null)}
            onSelectComplaint={c => setSelectedComplaint(c)}
          />
        </>
      )}
    </div>
  );
}
