import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { currentUser, role, department, activeTab, setActiveTab, switchUserRole, usersList, logout } = useApp();
  const [timeString, setTimeString] = useState<string>('14:32:08 SGT');
  const [showRoleMenu, setShowRoleMenu] = useState<boolean>(false);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Live Malaysian clock in SGT (GMT+8)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to GMT+8
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kuala_Lumpur',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      const formatted = new Intl.DateTimeFormat('en-GB', options).format(now);
      setTimeString(`${formatted} SGT`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Home / Overview' },
    { id: 'deliveries-and-dos', label: 'Deliveries & DOs' },
    { id: 'route-planner', label: 'Route Planner' },
    { id: 'live-fleet-and-gps', label: 'Live Fleet & GPS' },
    { id: 'mileage-and-fuel-audit', label: 'Mileage & Fuel Audit' },
    { id: 'driver-terminal', label: 'Driver App' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' },
  ];

  // Role display label
  const getRoleLabel = () => {
    if (!currentUser) return 'Guest';
    if (currentUser.role === 'owner') return 'Owner / Ops Admin';
    if (currentUser.role === 'management') {
      return `Management · ${currentUser.department.toUpperCase()}`;
    }
    return 'Logistic Man · Driver';
  };

  return (
    <>
      <header className="fixed top-0 left-64 right-0 h-20 bg-[#fcf8ff]/95 backdrop-blur-xl z-40 flex items-center justify-between px-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e5e1e8]">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#ff7f35] flex items-center justify-center text-white shadow-sm font-bold text-sm">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[19px] text-[#1c1b20] tracking-tight font-bold font-sans">
                LOHAS Fleet
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-caps text-[10px] bg-[#ffdbcb] text-[#341100] font-bold">
                ORGANIC WHOLESALE
              </span>
            </div>
          </div>
        </div>

        {/* Central Pill Navigation */}
        <div className="hidden xl:flex items-center bg-[#f0ecf3] rounded-full p-1 border border-[#e5e1e8]">
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-sans transition-all duration-200 ${
                    isActive
                      ? 'bg-[#313035] text-[#f3eff6] font-semibold shadow-sm'
                      : 'text-[#574238] hover:text-[#1c1b20] hover:bg-[#e5e1e8]/60 font-medium'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Info & Control Cluster */}
        <div className="flex items-center gap-4">
          {/* Malaysian Time */}
          <div className="hidden md:flex flex-col text-right">
            <span className="font-mono-data text-[12px] text-[#1c1b20] font-semibold">{timeString}</span>
            <span className="font-label-caps text-[10px] text-[#574238]">Asia/Kuala_Lumpur GMT+8</span>
          </div>

          {/* Cloud Health Pill */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#f6f2f9] border border-[#e5e1e8] px-3 py-1 rounded-full">
            <span className="h-2 w-2 rounded-full bg-[#1c3ae7] animate-pulse"></span>
            <span className="text-[12px] font-semibold text-[#1c1b20]">100% Cloud</span>
          </div>

          {/* Quick Search */}
          <div
            onClick={() => setShowSearchModal(true)}
            className="relative flex items-center bg-white rounded-full px-3.5 py-1.5 border border-[#e5e1e8] shadow-[0_1px_3px_rgba(0,0,0,0.02)] cursor-pointer hover:border-[#1c3ae7] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-[#574238] mr-1.5">search</span>
            <span className="text-[12px] text-[#574238] w-24 lg:w-28 truncate">Quick search...</span>
            <kbd className="font-mono-data text-[10px] bg-[#f0ecf3] px-1.5 py-0.5 rounded text-[#574238] font-semibold ml-1">⌘K</kbd>
          </div>

          {/* Notification Button */}
          <button
            onClick={() => alert('Operational Notifications: 2 Open Mileage Flags detected on Lorry 2 (BQU 4109). All cold-chain chillers within 2-4°C.')}
            className="relative w-9 h-9 rounded-full bg-[#f0ecf3] flex items-center justify-center text-[#1c1b20] hover:bg-[#ebe7ed] transition-colors border border-[#e5e1e8]"
            type="button"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white"></span>
          </button>

          {/* User Profile Pill & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-[#f0ecf3] hover:bg-[#ebe7ed] transition-colors border border-[#e5e1e8]"
              type="button"
            >
              <div className="w-8 h-8 rounded-full bg-[#9f4200] text-white flex items-center justify-center font-bold text-xs overflow-hidden shadow-xs">
                {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{currentUser?.name.charAt(0) || 'W'}</span>
                )}
              </div>
              <div className="hidden 2xl:flex flex-col text-left">
                <span className="text-[13px] font-semibold text-[#1c1b20] leading-tight flex items-center gap-1">
                  {currentUser?.name || 'William Soon'}
                  <span className="material-symbols-outlined text-[14px]">expand_more</span>
                </span>
                <span className="font-label-caps text-[10px] text-[#574238] leading-none">
                  {getRoleLabel()}
                </span>
              </div>
            </button>

            {/* Role Switcher & Account Dropdown */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-2xl border border-[#e5e1e8] p-3 z-50">
                <div className="pb-2 mb-2 border-b border-[#f0ecf3]">
                  <span className="font-label-caps text-[10px] text-[#574238] block mb-1">
                    CURRENT ACCOUNT (ROLE PERMISSION)
                  </span>
                  <div className="font-semibold text-sm text-[#1c1b20]">{currentUser?.name}</div>
                  <div className="text-xs text-[#574238] font-mono-data">{currentUser?.email}</div>
                  <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffdbcb] text-[#341100]">
                    ROLE: {currentUser?.role.toUpperCase()} ({currentUser?.department.toUpperCase()})
                  </div>
                </div>

                <div className="py-1">
                  <span className="font-label-caps text-[10px] text-[#574238] block mb-1.5 px-1">
                    QUICK ROLE SWITCHER (FOR TESTING ALL JOURNEYS)
                  </span>
                  <div className="space-y-1">
                    {usersList.map((user) => (
                      <button
                        key={user.uid}
                        onClick={() => {
                          switchUserRole(user.uid);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          user.uid === currentUser?.uid ? 'bg-[#ffdbcb]/60 font-semibold text-[#341100]' : 'hover:bg-[#f6f2f9] text-[#1c1b20]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#f0ecf3] flex items-center justify-center font-bold text-[10px]">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="leading-tight">{user.name}</div>
                            <div className="text-[10px] text-[#574238] capitalize">
                              {user.role} · {user.department}
                            </div>
                          </div>
                        </div>
                        {user.uid === currentUser?.uid && (
                          <span className="material-symbols-outlined text-[16px] text-[#9f4200]">check</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-[#f0ecf3] flex items-center justify-between">
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setShowRoleMenu(false);
                    }}
                    className="text-xs text-[#1c3ae7] font-semibold hover:underline"
                  >
                    User Management
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setShowRoleMenu(false);
                    }}
                    className="text-xs text-[#ba1a1a] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">logout</span>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Quick Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-5 shadow-2xl border border-[#e5e1e8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ecf3]">
              <div className="flex items-center gap-2 text-[#1c1b20]">
                <span className="material-symbols-outlined text-[#1c3ae7]">search</span>
                <span className="font-bold text-base">Quick Search LOHAS Fleet</span>
              </div>
              <button
                onClick={() => setShowSearchModal(false)}
                className="w-7 h-7 rounded-full bg-[#f0ecf3] flex items-center justify-center text-[#574238] hover:bg-[#ebe7ed]"
              >
                ✕
              </button>
            </div>
            <div className="mt-3">
              <input
                type="text"
                autoFocus
                placeholder="Search DO# (e.g. DO-9041), Lorry (e.g. BQU 4109), Postcode (47500)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#f6f2f9] border border-[#e5e1e8] text-sm focus:outline-none focus:border-[#1c3ae7]"
              />
            </div>
            <div className="mt-4 space-y-1.5">
              <div className="text-[11px] font-label-caps text-[#574238]">SUGGESTED DISPATCH SEARCHES</div>
              <button
                onClick={() => {
                  setActiveTab('mileage-and-fuel-audit');
                  setShowSearchModal(false);
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-[#f6f2f9] flex items-center justify-between text-xs"
              >
                <span>Flagged Trip: <strong>TR-2026-0928</strong> (Lorry 2 BQU 4109)</span>
                <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] font-bold text-[10px]">Open Flag</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('route-planner');
                  setShowSearchModal(false);
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-[#f6f2f9] flex items-center justify-between text-xs"
              >
                <span>Staged Consignment: <strong>DO-9041</strong> (Village Grocer Citta Mall)</span>
                <span className="px-2 py-0.5 rounded-full bg-[#dfe0ff] text-[#000d60] font-bold text-[10px]">Postcode 47301</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('overview');
                  setShowSearchModal(false);
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-[#f6f2f9] flex items-center justify-between text-xs"
              >
                <span>Fleet Telemetry: <strong>8 Active Lorries</strong> in Klang Valley</span>
                <span className="px-2 py-0.5 rounded-full bg-[#ffdbcb] text-[#341100] font-bold text-[10px]">Telemetry Live</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
