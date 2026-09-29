import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { AdminPanelModal } from './components/AdminPanelModal';
import { OverviewView } from './views/OverviewView';
import { DeliveriesAndDOsView } from './views/DeliveriesAndDOsView';
import { RoutePlannerView } from './views/RoutePlannerView';
import { LiveFleetGpsView } from './views/LiveFleetGpsView';
import { MileageFuelAuditView } from './views/MileageFuelAuditView';
import { DriverMobileTerminalView } from './views/DriverMobileTerminalView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab, currentUser, isApproved } = useApp();

  // If user is not logged in or pending approval, show auth modal and admin modal
  if (!currentUser || !isApproved) {
    return (
      <div className="min-h-screen bg-[#fcf8ff] flex flex-col justify-between">
        <AuthModal />
        <AdminPanelModal />
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'deliveries-and-dos':
        return <DeliveriesAndDOsView />;
      case 'route-planner':
        return <RoutePlannerView />;
      case 'live-fleet-and-gps':
        return <LiveFleetGpsView />;
      case 'mileage-and-fuel-audit':
        return <MileageFuelAuditView />;
      case 'driver-terminal':
        return <DriverMobileTerminalView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <MileageFuelAuditView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf8ff] text-[#1c1b20] antialiased flex flex-col justify-between">
      {/* Left Fixed Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Pane */}
      <div className="pl-64 flex-1 flex flex-col justify-between">
        {/* Fixed Top Header (No Admin links here - per strict specification) */}
        <Header />

        {/* Dynamic Route Workspace */}
        <main className="relative pt-24 w-full px-8 bg-[#fcf8ff] flex-1">
          {renderActiveView()}
          {/* Footer containing the Admin Sign Up / Login Link */}
          <Footer />
        </main>
      </div>

      {/* Global Admin Modal */}
      <AdminPanelModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
