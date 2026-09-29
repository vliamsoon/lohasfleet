import React from 'react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, auditFlags, role } = useApp();

  const openFlagsCount = auditFlags.filter((f) => f.status === 'open').length;

  const navLinks = [
    { id: 'overview', label: 'Home / Overview', icon: 'grid_view' },
    { id: 'deliveries-and-dos', label: 'Deliveries & DOs', icon: 'local_shipping' },
    { id: 'route-planner', label: 'Route Planner', icon: 'alt_route' },
    { id: 'live-fleet-and-gps', label: 'Live Fleet & GPS', icon: 'satellite_alt' },
    {
      id: 'mileage-and-fuel-audit',
      label: 'Mileage & Fuel Audit',
      icon: 'local_gas_station',
      badge: openFlagsCount > 0 ? `${openFlagsCount}` : undefined,
      badgeColor: 'bg-[#ba1a1a] text-white',
    },
    { id: 'driver-terminal', label: "Driver Mobile App", icon: 'smartphone' },
    { id: 'reports', label: 'Reports', icon: 'bar_chart' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#f6f2f9] z-50 flex flex-col pt-6 pb-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-[#e5e1e8]">
      {/* Operational Hub Identifier */}
      <div className="px-6 mb-6 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#1c3ae7] animate-pulse"></div>
          <span className="font-label-caps text-[11px] text-[#574238] uppercase tracking-wider font-semibold">
            Operational Hub
          </span>
        </div>
        <span className="text-[18px] text-[#1c1b20] font-semibold leading-tight">
          Klang Valley DC
        </span>
        <span className="font-mono-data text-[12px] text-[#574238]">
          Hub ID: MY-SGR-01
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 space-y-1 flex flex-col">
        {navLinks.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-full transition-all text-left w-full ${
                isActive
                  ? 'bg-[#313035] text-[#f3eff6] font-semibold shadow-sm'
                  : 'text-[#574238] hover:bg-[#f0ecf3] hover:text-[#1c1b20]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="text-[13px]">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Cold Chain Sensor Telemetry Status */}
      <div className="px-4 pt-4">
        <div className="p-4 rounded-2xl bg-[#f0ecf3] border border-[#e5e1e8] flex flex-col gap-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[10px] text-[#574238] uppercase font-bold tracking-wider">
              Cold Chain
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#dfe0ff] text-[#000d60]">
              OPTIMAL
            </span>
          </div>
          <p className="text-[12px] text-[#1c1b20] font-medium leading-snug">
            Central Chiller 2-4°C Active Telemetry
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#574238] font-mono-data">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0fa42f]"></span>
            <span>8 Lorries Thermo-Locked</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
