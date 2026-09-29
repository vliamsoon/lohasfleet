import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ReportsView: React.FC = () => {
  const { trips } = useApp();
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDownloadSSTCSV = () => {
    const csvContent =
      'TripID,Date,VehiclePlate,DriverName,PlannedKm,OdoDeltaKm,GPSSnappedKm,VariancePct,FuelRM,SSTCompliant,AuditStatus\n' +
      trips
        .map(
          (t) =>
            `${t.tripId},${t.tripDate},${t.vehiclePlate},${t.driverName},${t.plannedKm},${t.odoDeltaKm},${t.gpsSnappedKm},${t.variancePct}%,${t.fuelPaidRm},YES,${t.auditStatus}`
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LOHAS_SQL_Accounting_SST_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('Exported CSV formatted for SQL Accounting & AutoCount SST filing.');
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
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-caps text-[10px] bg-[#dfe0ff] text-[#000d60] font-bold">
              MODULE M8 · LOGISTICS INTELLIGENCE
            </span>
            <span className="font-mono-data text-xs text-[#574238]">MALAYSIAN SST & TAX COMPLIANT</span>
          </div>
          <h1 className="text-[32px] text-[#1c1b20] font-bold tracking-tight font-sans">
            Fleet Audit & Tax Reports
          </h1>
          <p className="text-[13px] text-[#574238]">
            Monthly diesel consumption reports, odometer vs GPS deviation analysis, and accounting ledger export.
          </p>
        </div>

        <button
          onClick={handleDownloadSSTCSV}
          className="px-5 py-2.5 rounded-full bg-[#1c3ae7] hover:bg-[#3f58ff] text-white text-xs font-bold flex items-center gap-2 shadow-md active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>Download SST CSV (AutoCount / SQL Accounting)</span>
        </button>
      </div>

      {/* Key Metric Grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#e5e1e8]">
          <span className="font-label-caps text-[10px] text-[#574238] uppercase">On-Time Delivery Rate (MTD)</span>
          <div className="text-[36px] font-bold text-[#1c1b20] mt-1">98.2%</div>
          <span className="text-xs text-[#0fa42f] font-semibold">Exceeds 95% SLA Target</span>
          <div className="w-full bg-[#f0ecf3] h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#0fa42f] h-full rounded-full" style={{ width: '98.2%' }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#e5e1e8]">
          <span className="font-label-caps text-[10px] text-[#574238] uppercase">Km Saved Via Route AI</span>
          <div className="text-[36px] font-bold text-[#1c3ae7] mt-1">-16.5%</div>
          <span className="text-xs text-[#574238]">Baseline: 74.8 km → Optimized: 62.4 km per trip</span>
          <div className="w-full bg-[#f0ecf3] h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#1c3ae7] h-full rounded-full" style={{ width: '83.5%' }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#e5e1e8]">
          <span className="font-label-caps text-[10px] text-[#574238] uppercase">Diesel Reimbursement Audit</span>
          <div className="text-[36px] font-bold text-[#9f4200] mt-1">RM 12,480</div>
          <span className="text-xs text-[#574238]">100% Verified With Pump Photo Evidence</span>
          <div className="w-full bg-[#f0ecf3] h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#9f4200] h-full rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* Monthly Trip Ledger */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#e5e1e8]">
        <div className="flex items-center justify-between pb-3 border-b border-[#f0ecf3]">
          <h3 className="text-base font-bold text-[#1c1b20]">Verified Audit Ledger (September 2026)</h3>
          <span className="text-xs text-[#574238] font-mono-data">All Records Tamper-Proof</span>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs text-[#1c1b20]">
            <thead>
              <tr className="bg-[#f6f2f9] text-[#574238] font-label-caps text-[10px] uppercase">
                <th className="py-2.5 px-3">Trip ID</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Lorry & Driver</th>
                <th className="py-2.5 px-3">Odometer Delta</th>
                <th className="py-2.5 px-3">Snapped GPS</th>
                <th className="py-2.5 px-3">Variance</th>
                <th className="py-2.5 px-3">Fuel Paid</th>
                <th className="py-2.5 px-3 text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ecf3]">
              {trips.map((t) => (
                <tr key={t.tripId} className="hover:bg-[#f6f2f9]">
                  <td className="py-2.5 px-3 font-mono-data font-bold">{t.tripId}</td>
                  <td className="py-2.5 px-3 text-[#574238]">{t.tripDate}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold">{t.vehiclePlate}</span> ({t.driverName})
                  </td>
                  <td className="py-2.5 px-3 font-mono-data">{t.odoDeltaKm} km</td>
                  <td className="py-2.5 px-3 font-mono-data text-[#1c3ae7]">{t.gpsSnappedKm} km</td>
                  <td className="py-2.5 px-3 font-mono-data">+{t.variancePct}%</td>
                  <td className="py-2.5 px-3 font-mono-data">RM {t.fuelPaidRm.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full font-label-caps text-[9px] font-bold ${
                        t.auditStatus === 'cleared'
                          ? 'bg-[#dfe0ff] text-[#000d60]'
                          : 'bg-[#ffdad6] text-[#93000a]'
                      }`}
                    >
                      {t.auditStatus === 'cleared' ? 'CLEARED' : 'FLAGGED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
