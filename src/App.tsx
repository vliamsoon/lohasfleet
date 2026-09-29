import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
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

  // If user is not logged in or pending approval, show auth modal
  if (!currentUser || !isApproved) {
    return <AuthModal />;
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
    <div className="min-h-screen bg-[#fcf8ff] text-[#1c1b20] antialiased">
      {/* Left Fixed Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Pane */}
      <div className="pl-64">
        {/* Fixed Top Header */}
        <Header />

        {/* Dynamic Route Workspace */}
        <main className="relative pt-24 w-full px-8 bg-[#fcf8ff] min-h-screen">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Auth Modal if needed */}
      <AuthModal />
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
