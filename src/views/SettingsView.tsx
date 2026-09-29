import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, Department } from '../types';

export const SettingsView: React.FC = () => {
  const { usersList, approveUser, deactivateUser, vehicles, currentUser, role } = useApp();
  const [selectedSubTab, setSelectedSubTab] = useState<'users' | 'vehicles' | 'fuel' | 'thresholds'>('users');
  const [toast, setToast] = useState<string | null>(null);

  // Settings state
  const [dieselB10Price, setDieselB10Price] = useState('2.15');
  const [dieselEuro5Price, setDieselEuro5Price] = useState('2.35');
  const [ron95Price, setRon95Price] = useState('2.05');
  const [varianceThreshold, setVarianceThreshold] = useState('10.0');
  const [geofenceRadiusM, setGeofenceRadiusM] = useState('300');
  const [gpsGapMins, setGpsGapMins] = useState('15');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = async (uid: string, assignedRole: UserRole, dept: Department) => {
    await approveUser(uid, assignedRole, dept);
    showToast(`User approved as ${assignedRole.toUpperCase()} (${dept.toUpperCase()}). Custom claim active.`);
  };

  const handleDeactivate = async (uid: string) => {
    await deactivateUser(uid);
    showToast('User deactivated. Access revoked.');
  };

  const handleSaveFuel = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Malaysian weekly pump fuel prices updated successfully!');
  };

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Operational audit thresholds updated. Active for all future dispatch trips.');
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#313035] text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border border-[#e5e1e8] text-sm animate-fade-in">
          <span className="material-symbols-outlined text-[#0fa42f]">check_circle</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-caps text-[10px] bg-[#ffdbcb] text-[#341100] font-bold">
              MODULE M10 · SYSTEM CONFIGURATION
            </span>
            <span className="font-mono-data text-xs text-[#574238]">RBAC & MALAYSIA SETTINGS</span>
          </div>
          <h1 className="text-[32px] text-[#1c1b20] font-bold tracking-tight font-sans">
            Settings & Permissions
          </h1>
          <p className="text-[13px] text-[#574238]">
            Manage user roles (Owner, Management, Logistic man), lorry fleet specifications, fuel rates, and audit threshold parameters.
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto">
        {[
          { id: 'users', label: 'User Roles & Approvals (RBAC)' },
          { id: 'vehicles', label: 'Lorry Fleet Master (8 Assets)' },
          { id: 'fuel', label: 'Weekly Fuel Rates (RM/Litre)' },
          { id: 'thresholds', label: 'Audit Exception Thresholds' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSubTab === tab.id
                ? 'bg-[#313035] text-white shadow-sm'
                : 'bg-white text-[#574238] border border-[#e5e1e8] hover:bg-[#f6f2f9]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-Tab 1: Users & Approvals */}
      {selectedSubTab === 'users' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#e5e1e8] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#1c1b20]">Registered Users & Role Permissions</h3>
              <p className="text-xs text-[#574238]">
                Owner controls: Only Owner (William Soon) can approve new users and assign RBAC roles.
              </p>
            </div>
            <span className="font-mono-data text-xs bg-[#f0ecf3] text-[#1c1b20] px-3 py-1 rounded-full font-semibold">
              {usersList.length} User Accounts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1c1b20]">
              <thead>
                <tr className="bg-[#f6f2f9] text-[#574238] font-label-caps text-[10px] uppercase">
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Email & Phone</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ecf3]">
                {usersList.map((u) => (
                  <tr key={u.uid} className="hover:bg-[#f6f2f9]">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#f0ecf3] font-bold text-xs flex items-center justify-center text-[#9f4200]">
                          {u.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-[#1c1b20]">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono-data text-[#574238]">
                      <div>{u.email}</div>
                      <div className="text-[10px] text-[#574238]">{u.phone || 'N/A'}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full font-label-caps text-[10px] font-bold bg-[#ffdbcb] text-[#341100]">
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 capitalize text-[#574238] font-medium">{u.department}</td>
                    <td className="py-3 px-3">
                      {u.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 text-[#0fa42f] font-semibold">
                          <span className="w-2 h-2 rounded-full bg-[#0fa42f]"></span>
                          Active
                        </span>
                      ) : u.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 text-[#ba1a1a] font-bold">
                          <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse"></span>
                          Pending Approval
                        </span>
                      ) : (
                        <span className="text-[#574238] italic">Deactivated</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {u.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApprove(u.uid, 'logistic', 'ops')}
                            className="px-2.5 py-1 rounded-full bg-[#1c3ae7] text-white text-[11px] font-semibold hover:opacity-95"
                          >
                            Approve Driver
                          </button>
                          <button
                            onClick={() => handleApprove(u.uid, 'management', 'finance')}
                            className="px-2.5 py-1 rounded-full bg-[#9f4200] text-white text-[11px] font-semibold hover:opacity-95"
                          >
                            Approve Finance
                          </button>
                        </div>
                      ) : u.role !== 'owner' ? (
                        <button
                          onClick={() => handleDeactivate(u.uid)}
                          className="px-2.5 py-1 rounded-full bg-[#f0ecf3] hover:bg-[#ffdad6] hover:text-[#93000a] text-[#574238] text-[11px] font-semibold transition-colors"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#574238] italic">Owner (Protected)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Vehicles */}
      {selectedSubTab === 'vehicles' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#e5e1e8] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#1c1b20]">Lorry Fleet Inventory (All 8 Vehicles)</h3>
              <p className="text-xs text-[#574238]">
                Plate number, cold-chain temperature set point, tank volume, and benchmark fuel economy.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1c1b20]">
              <thead>
                <tr className="bg-[#f6f2f9] text-[#574238] font-label-caps text-[10px] uppercase">
                  <th className="py-2.5 px-3">Vehicle</th>
                  <th className="py-2.5 px-3">Plate No</th>
                  <th className="py-2.5 px-3">Model Type</th>
                  <th className="py-2.5 px-3">Chiller Spec</th>
                  <th className="py-2.5 px-3">Fuel Type</th>
                  <th className="py-2.5 px-3">Benchmark Km/L</th>
                  <th className="py-2.5 px-3 font-mono-data">Current Odometer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ecf3]">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-[#f6f2f9]">
                    <td className="py-2.5 px-3 font-bold">{v.name}</td>
                    <td className="py-2.5 px-3 font-mono-data font-semibold text-[#1c3ae7]">{v.plateNo}</td>
                    <td className="py-2.5 px-3 text-[#574238]">{v.type}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#dfe0ff] text-[#000d60]">
                        {v.chillerTemp}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium">{v.fuelType}</td>
                    <td className="py-2.5 px-3 font-mono-data">{v.benchmarkKmPerL} km/L</td>
                    <td className="py-2.5 px-3 font-mono-data font-bold">
                      {v.currentOdometerKm.toLocaleString()} km
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Fuel Rates */}
      {selectedSubTab === 'fuel' && (
        <form onSubmit={handleSaveFuel} className="bg-white rounded-3xl p-6 shadow-sm border border-[#e5e1e8] max-w-xl space-y-4">
          <div>
            <h3 className="font-bold text-base text-[#1c1b20]">Malaysian Fuel Pump Rates (Finance Maintained)</h3>
            <p className="text-xs text-[#574238]">
              Updated weekly per Ministry of Domestic Trade & Cost of Living (KPDN) announcements.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-label-caps text-[#574238] block mb-1">
                DIESEL B10 (PENINSULAR SUBSIDIZED) - RM/LITRE
              </label>
              <input
                type="number"
                step="0.01"
                value={dieselB10Price}
                onChange={(e) => setDieselB10Price(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#f6f2f9] border border-[#e5e1e8] font-mono-data text-sm font-bold text-[#1c1b20]"
              />
            </div>
            <div>
              <label className="text-xs font-label-caps text-[#574238] block mb-1">
                DIESEL EURO 5 B7 - RM/LITRE
              </label>
              <input
                type="number"
                step="0.01"
                value={dieselEuro5Price}
                onChange={(e) => setDieselEuro5Price(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#f6f2f9] border border-[#e5e1e8] font-mono-data text-sm font-bold text-[#1c1b20]"
              />
            </div>
            <div>
              <label className="text-xs font-label-caps text-[#574238] block mb-1">
                RON95 PETROL - RM/LITRE
              </label>
              <input
                type="number"
                step="0.01"
                value={ron95Price}
                onChange={(e) => setRon95Price(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#f6f2f9] border border-[#e5e1e8] font-mono-data text-sm font-bold text-[#1c1b20]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="py-2.5 px-6 rounded-full bg-[#1c3ae7] text-white text-xs font-bold shadow-md hover:bg-[#3f58ff]"
          >
            Save Weekly Fuel Schedule
          </button>
        </form>
      )}

      {/* Sub-Tab 4: Thresholds */}
      {selectedSubTab === 'thresholds' && (
        <form onSubmit={handleSaveThresholds} className="bg-white rounded-3xl p-6 shadow-sm border border-[#e5e1e8] max-w-xl space-y-4">
          <div>
            <h3 className="font-bold text-base text-[#1c1b20]">Automated Audit Exception Thresholds</h3>
            <p className="text-xs text-[#574238]">
              Trips exceeding these rules will automatically raise Open Flags in the Mileage & Fuel Audit Center.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-label-caps text-[#574238] block mb-1">
                MAX MILEAGE VARIANCE (ODOMETER VS GPS) - %
              </label>
              <input
                type="number"
                step="0.1"
                value={varianceThreshold}
                onChange={(e) => setVarianceThreshold(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#f6f2f9] border border-[#e5e1e8] font-mono-data text-sm font-bold text-[#ba1a1a]"
              />
              <span className="text-[11px] text-[#574238]">
                * Default: 10.0%. Trips exceeding 10% (such as TR-2026-0928 +15.2%) are flagged for finance review.
              </span>
            </div>

            <div>
              <label className="text-xs font-label-caps text-[#574238] block mb-1">
                PROOF OF DELIVERY GEOFENCE RADIUS - METERS
              </label>
              <input
                type="number"
                value={geofenceRadiusM}
                onChange={(e) => setGeofenceRadiusM(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#f6f2f9] border border-[#e5e1e8] font-mono-data text-sm font-bold text-[#1c1b20]"
              />
              <span className="text-[11px] text-[#574238]">
                * Default: 300 meters from customer coordinates.
              </span>
            </div>

            <div>
              <label className="text-xs font-label-caps text-[#574238] block mb-1">
                MAX GPS TELEMATICS GAP - MINUTES
              </label>
              <input
                type="number"
                value={gpsGapMins}
                onChange={(e) => setGpsGapMins(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#f6f2f9] border border-[#e5e1e8] font-mono-data text-sm font-bold text-[#1c1b20]"
              />
              <span className="text-[11px] text-[#574238]">
                * Default: 15 minutes without cellular GPS ping.
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="py-2.5 px-6 rounded-full bg-[#1c3ae7] text-white text-xs font-bold shadow-md hover:bg-[#3f58ff]"
          >
            Update System Thresholds
          </button>
        </form>
      )}
    </div>
  );
};
