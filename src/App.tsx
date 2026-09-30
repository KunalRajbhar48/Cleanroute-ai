import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { CitizenReportPage } from './components/CitizenReportPage';
import { AdminDashboard } from './components/AdminDashboard';
import { InteractiveWasteMap } from './components/InteractiveWasteMap';
import { PredictiveHotspotsPage } from './components/PredictiveHotspotsPage';
import { RouteOptimizationPage } from './components/RouteOptimizationPage';
import { ComplaintManagementTable } from './components/ComplaintManagementTable';
import { VehicleFleetPage } from './components/VehicleFleetPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { AiAnalysisDashboard } from './components/AiAnalysisDashboard';
import { SpringBootApiModal } from './components/SpringBootApiModal';
import { CleanBotChat } from './components/CleanBotChat';
import { LoginModal } from './components/LoginModal';

import {
  Complaint,
  CollectionVehicle,
  PredictiveHotspot,
  NotificationItem,
  UserRole,
  ComplaintStatus,
} from './types';
import {
  INITIAL_COMPLAINTS,
  INITIAL_VEHICLES,
  INITIAL_HOTSPOTS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';

export default function App() {
  const [activePage, setActivePage] = useState<string>('landing');
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [vehicles, setVehicles] = useState<CollectionVehicle[]>(INITIAL_VEHICLES);
  const [hotspots] = useState<PredictiveHotspot[]>(INITIAL_HOTSPOTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [userRole, setUserRole] = useState<UserRole>('officer');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [selectedComplaintIdForMap, setSelectedComplaintIdForMap] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync dark class on document root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Add new complaint from citizen reporting form
  const handleAddComplaint = (newComplaint: Complaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);

    // Push new notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Complaint Received',
      message: `${newComplaint.id} (${newComplaint.category}) reported at ${newComplaint.locationName}.`,
      timestamp: 'Just now',
      read: false,
      type: 'info',
      linkPage: 'complaints',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Complaint ${newComplaint.id} registered and analyzed by CleanRoute AI!`);
  };

  // Assign vehicle to a complaint
  const handleAssignVehicle = (complaintId: string, vehicleId: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              assignedVehicleId: vehicleId,
              status: c.status === 'Pending' ? 'Assigned' : c.status,
            }
          : c
      )
    );

    // Update vehicle's assigned list
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId
          ? {
              ...v,
              assignedRouteComplaintIds: Array.from(
                new Set([...(v.assignedRouteComplaintIds || []), complaintId])
              ),
              status: 'Collecting',
            }
          : v
      )
    );

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Vehicle Dispatched',
      message: `Vehicle ${vehicleId} has been assigned to complaint ${complaintId}.`,
      timestamp: 'Just now',
      read: false,
      type: 'info',
      linkPage: 'routes',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Vehicle ${vehicleId} dispatched for complaint ${complaintId}!`);
  };

  // Update status (e.g. to 'Resolved')
  const handleUpdateStatus = (complaintId: string, status: ComplaintStatus) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status,
              resolvedAt: status === 'Resolved' ? new Date().toISOString() : c.resolvedAt,
              resolutionNotes:
                status === 'Resolved'
                  ? `Collected and verified by municipal unit on ${new Date().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}.`
                  : c.resolutionNotes,
            }
          : c
      )
    );

    if (status === 'Resolved') {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Complaint Resolved',
        message: `${complaintId} has been cleared and marked resolved.`,
        timestamp: 'Just now',
        read: false,
        type: 'success',
        linkPage: 'complaints',
      };
      setNotifications((prev) => [notif, ...prev]);
      showToast(`Complaint ${complaintId} marked as Resolved!`);
    }
  };

  // Navigate to map and focus on a specific complaint
  const handleNavigateToMap = (complaintId: string) => {
    setSelectedComplaintIdForMap(complaintId);
    setActivePage('map');
  };

  // Schedule preventive dispatch for a hotspot ward
  const handleSchedulePreventiveDispatch = (ward: string) => {
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Preventive Dispatch: ${ward}`,
      message: `Extra dual-stream compactor assigned to ${ward} to prevent predicted waste buildup.`,
      timestamp: 'Just now',
      read: false,
      type: 'warning',
      linkPage: 'routes',
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast(`Preventive collection scheduled for ${ward}!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F3EA] dark:bg-[#0F1A14] text-[#1E2923] dark:text-[#F5F3EA] transition-colors duration-300">
      {/* Top Floating Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={(page) => {
          setSelectedComplaintIdForMap(null);
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        userRole={userRole}
        setUserRole={setUserRole}
        isDark={isDark}
        setIsDark={setIsDark}
        notifications={notifications}
        setNotifications={setNotifications}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-[#234D3C] text-[#FAF8F2] shadow-2xl border border-[#DCE7DE]/30 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#A4B588] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Page Content Router */}
      <main className="flex-1">
        {activePage === 'landing' && (
          <LandingPage
            onNavigate={(page) => {
              setActivePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            complaints={complaints}
            hotspots={hotspots}
          />
        )}

        {activePage === 'report' && (
          <CitizenReportPage
            complaints={complaints}
            onAddComplaint={handleAddComplaint}
            onNavigate={(page) => {
              setActivePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activePage === 'dashboard' && (
          <AdminDashboard
            complaints={complaints}
            vehicles={vehicles}
            hotspots={hotspots}
            onNavigate={(page) => {
              setActivePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAssignVehicle={handleAssignVehicle}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {activePage === 'map' && (
          <InteractiveWasteMap
            complaints={complaints}
            vehicles={vehicles}
            hotspots={hotspots}
            onAssignVehicle={handleAssignVehicle}
            onUpdateStatus={handleUpdateStatus}
            selectedComplaintId={selectedComplaintIdForMap}
          />
        )}

        {activePage === 'hotspots' && (
          <PredictiveHotspotsPage
            hotspots={hotspots}
            vehicles={vehicles}
            onNavigate={(page) => {
              setActivePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSchedulePreventiveDispatch={handleSchedulePreventiveDispatch}
          />
        )}

        {activePage === 'routes' && (
          <RouteOptimizationPage
            vehicles={vehicles}
            complaints={complaints}
          />
        )}

        {activePage === 'complaints' && (
          <ComplaintManagementTable
            complaints={complaints}
            vehicles={vehicles}
            onAssignVehicle={handleAssignVehicle}
            onUpdateStatus={handleUpdateStatus}
            onNavigateToMap={handleNavigateToMap}
          />
        )}

        {activePage === 'vehicles' && (
          <VehicleFleetPage
            vehicles={vehicles}
            complaints={complaints}
            onNavigateToMap={() => setActivePage('map')}
            onNavigateToRoutes={() => setActivePage('routes')}
          />
        )}

        {activePage === 'analytics' && <AnalyticsPage />}

        {activePage === 'ai-analysis' && (
          <AiAnalysisDashboard
            complaints={complaints}
            onNavigateToMap={handleNavigateToMap}
          />
        )}

        {activePage === 'api-spec' && <SpringBootApiModal />}
      </main>

      {/* Floating CleanBot AI Assistant */}
      <CleanBotChat
        complaints={complaints}
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* User Login & Role Selection Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentRole={userRole}
        onSelectRole={(r) => {
          setUserRole(r);
          showToast(`Logged in as ${r.toUpperCase()} profile.`);
        }}
      />

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-[#234D3C]/10 dark:border-[#8EAD9A]/15 text-xs text-[#66736B] dark:text-[#95A89D]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1E2923] dark:text-[#F5F3EA]">
              CleanRoute AI
            </span>
            <span>·</span>
            <span>HackConquest AETHER 2026 Initiative</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActivePage('landing')}
              className="hover:text-[#1E2923] dark:hover:text-[#F5F3EA] transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => setActivePage('report')}
              className="hover:text-[#1E2923] dark:hover:text-[#F5F3EA] transition-colors"
            >
              Report Waste
            </button>
            <button
              onClick={() => setActivePage('dashboard')}
              className="hover:text-[#1E2923] dark:hover:text-[#F5F3EA] transition-colors"
            >
              Municipal Dashboard
            </button>
            <button
              onClick={() => setActivePage('api-spec')}
              className="hover:text-[#1E2923] dark:hover:text-[#F5F3EA] transition-colors"
            >
              Spring Boot API Spec
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
