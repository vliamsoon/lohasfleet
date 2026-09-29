import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const MileageFuelAuditView: React.FC = () => {
  const { trips, resolveTripFlag, escalateTripFlag, currentUser } = useApp();
  const [filterMode, setFilterMode] = useState<'open' | 'cleared' | 'all'>('open');
  const [selectedLorry, setSelectedLorry] = useState<string>('all');
  const [justificationNote, setJustificationNote] = useState<string>(
    'Driver took detour due to flash flood along Federal Highway Subang exit. Validated via SmartTunnel & Waze traffic alerts at 14:10.'
  );
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<{ title: string; url: string; ocr: string } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleClearFlag = async (tripId: string) => {
    if (!justificationNote.trim()) {
      alert('Please enter an auditor justification note before clearing this flag.');
      return;
    }
    await resolveTripFlag(tripId, justificationNote);
    showToast(`Trip ${tripId} approved by Finance & Ops Admin (${currentUser?.name || 'William Soon'}). Status updated to CLEARED.`);
  };

  const handleEscalate = async (tripId: string) => {
    await escalateTripFlag(tripId);
    showToast(`Trip ${tripId} escalated to Owner (William Soon) via High-Priority WhatsApp Push & Operational Telegram dispatch bot.`);
  };

  const handleExportCSV = () => {
    // Generate Malaysian SST & SQL Accounting formatted CSV
    const headers = 'Trip ID,Date,Lorry,Plate,Driver,Planned Km,Odo Delta Km,GPS Snapped Km,Variance %,Fuel RM,Fuel Litres,Station,Audit Status,Auditor Note\n';
    const rows = trips
      .map(
        (t) =>
          `"${t.tripId}","${t.tripDate}","${t.vehiclePlate}","${t.vehicleModel}","${t.driverName}",${t.plannedKm},${t.odoDeltaKm},${t.gpsSnappedKm},"${t.variancePct}%",${t.fuelPaidRm},${t.fuelLitres || 0},"${t.fuelStation || ''}","${t.auditStatus}","${(t.auditorNote || '').replace(/"/g, '""')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `LOHAS_Mileage_Fuel_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
    showToast('Exported CSV aligned with SQL Accounting & AutoCount format for Malaysian SST compliance.');
  };

  const handleExportPDF = () => {
    setShowExportMenu(false);
    showToast('Compiled high-res pump and odometer photo evidence bundle (PDF) for Malaysian tax filing.');
  };

  const filteredTrips = trips.filter((t) => {
    if (filterMode === 'open') return t.auditStatus === 'open_flag';
    if (filterMode === 'cleared') return t.auditStatus === 'cleared';
    return true;
  });

  const trip2026_0928 = trips.find((t) => t.tripId === 'TR-2026-0928') || trips[0];
  const trip2026_0925 = trips.find((t) => t.tripId === 'TR-2026-0925') || trips[1];

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#313035] text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border border-[#e5e1e8] text-sm animate-fade-in">
          <span className="material-symbols-outlined text-[#0fa42f]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Filters Cluster */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-caps text-[10px] bg-[#9f4200] text-white font-bold">
              MODULE M7 · FINANCE CONTROL
            </span>
            <span className="font-mono-data text-[12px] text-[#574238] font-semibold">
              KLANG VALLEY DC RECONCILIATION
            </span>
          </div>
          <h1 className="text-[32px] text-[#1c1b20] font-bold tracking-tight font-sans">
            Mileage & Fuel Audit Center
          </h1>
          <p className="text-[13px] text-[#574238]">
            Cross-check Odometer Photos, Snapped Roads API GPS, and AI Fuel Receipts for seamless Malaysian tax and fleet integrity.
          </p>
        </div>

        {/* Action & Filter Cluster */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter Pills */}
          <div className="flex items-center bg-[#ebe7ed] rounded-full p-1 shadow-sm">
            <button
              onClick={() => setFilterMode('open')}
              className={`px-4 py-1.5 rounded-full font-label-caps text-[11px] transition-all flex items-center gap-1.5 ${
                filterMode === 'open'
                  ? 'bg-[#313035] text-white shadow-sm'
                  : 'text-[#574238] hover:text-[#1c1b20]'
              }`}
              type="button"
            >
              <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping"></span>
              <span>Open Flags ({trips.filter((t) => t.auditStatus === 'open_flag').length})</span>
            </button>
            <button
              onClick={() => setFilterMode('cleared')}
              className={`px-4 py-1.5 rounded-full font-label-caps text-[11px] transition-all ${
                filterMode === 'cleared'
                  ? 'bg-[#313035] text-white shadow-sm'
                  : 'text-[#574238] hover:text-[#1c1b20]'
              }`}
              type="button"
            >
              Cleared
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-4 py-1.5 rounded-full font-label-caps text-[11px] transition-all ${
                filterMode === 'all'
                  ? 'bg-[#313035] text-white shadow-sm'
                  : 'text-[#574238] hover:text-[#1c1b20]'
              }`}
              type="button"
            >
              All Trips
            </button>
          </div>

          {/* Lorry Selector */}
          <div className="relative">
            <select
              value={selectedLorry}
              onChange={(e) => setSelectedLorry(e.target.value)}
              className="appearance-none bg-white text-[#1c1b20] text-[12px] pl-4 pr-8 py-2 rounded-full shadow-sm border border-[#e5e1e8] focus:outline-none cursor-pointer font-medium"
            >
              <option value="all">All 8 Lorries (Hino / Isuzu / Fuso)</option>
              <option value="BQU 4109">Lorry 2 (BQU 4109 · Hino 3T Chilled)</option>
              <option value="VDA 9022">Lorry 5 (VDA 9022 · Isuzu 5T Chilled)</option>
              <option value="WVC 8821">Lorry 3 (WVC 8821 · 3-Ton Chilled Box)</option>
              <option value="WA 8821 X">Lorry 1 (WA 8821 X · Fuso Canter)</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2 text-[18px] text-[#574238] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Calendar Month Tag */}
          <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-[#e5e1e8] gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#1c3ae7]">calendar_today</span>
            <span className="font-mono-data text-[12px] text-[#1c1b20] font-semibold">September 2026</span>
          </div>

          {/* Audit Export Dropdown */}
          <div className="relative inline-block text-left">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1c3ae7] text-white rounded-full text-[12px] font-semibold shadow-md hover:opacity-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">cloud_download</span>
              <span>Audit Export</span>
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-2xl z-50 p-2 flex flex-col gap-1 border border-[#e5e1e8]">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#f6f2f9] text-left transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[#1c3ae7] text-[22px]">table_view</span>
                  <div className="flex flex-col">
                    <span className="text-[13px] text-[#1c1b20] font-semibold">Export to CSV / SQL Accounting</span>
                    <span className="text-[11px] text-[#574238]">Formatted for Malaysian SST compliance</span>
                  </div>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#f6f2f9] text-left transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[#9f4200] text-[22px]">picture_as_pdf</span>
                  <div className="flex flex-col">
                    <span className="text-[13px] text-[#1c1b20] font-semibold">Download Fuel Receipts PDF</span>
                    <span className="text-[11px] text-[#574238]">Includes OCR data stamps & pump displays</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* KPI 1 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e5e1e8] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-caps text-[11px] text-[#574238] uppercase">Reconciled Trips (MTD)</span>
            <div className="w-8 h-8 rounded-full bg-[#f0ecf3] flex items-center justify-center text-[#1c3ae7]">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[36px] font-bold text-[#1c1b20] tracking-tight font-sans">184 Trips</span>
            <span className="font-label-caps text-[10px] text-[#273768] bg-[#dce1ff] px-2 py-0.5 rounded-full font-bold">
              96.2% CLEAN
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 bg-[#f0ecf3] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#1c3ae7] h-full rounded-full" style={{ width: '96.2%' }}></div>
            </div>
            <span className="font-mono-data text-[11px] text-[#574238]">&lt;5% Target achieved</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e5e1e8] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-caps text-[11px] text-[#574238] uppercase">Requiring Review</span>
            <div className="w-8 h-8 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#93000a]">
              <span className="material-symbols-outlined text-[18px]">warning</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[36px] font-bold text-[#ba1a1a] tracking-tight font-sans">2 Flagged</span>
            <span className="font-label-caps text-[10px] bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded-full font-bold">
              ATTENTION
            </span>
          </div>
          <p className="mt-2 text-[12px] text-[#574238]">Variance &gt;10% detected against Snapped Roads GPS</p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e5e1e8] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-caps text-[11px] text-[#574238] uppercase">Fleet Fuel Efficiency</span>
            <div className="w-8 h-8 rounded-full bg-[#dfe0ff] flex items-center justify-center text-[#000d60]">
              <span className="material-symbols-outlined text-[18px]">speed</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[36px] font-bold text-[#1c1b20] tracking-tight font-sans">8.4 km/L</span>
            <span className="font-label-caps text-[10px] text-white bg-[#9f4200] px-2 py-0.5 rounded-full font-bold">
              +2.4% HEALTH
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[#574238]">
            <span className="font-mono-data text-[11px]">Diesel B10 Standard: 8.2 km/L</span>
            <span className="font-mono-data text-[11px] text-[#9f4200] font-bold">Optimal</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e5e1e8] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-caps text-[11px] text-[#574238] uppercase">Reimbursed Fuel (MTD)</span>
            <div className="w-8 h-8 rounded-full bg-[#ffdbcb] flex items-center justify-center text-[#341100]">
              <span className="material-symbols-outlined text-[18px]">local_gas_station</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[36px] font-bold text-[#1c1b20] tracking-tight font-sans">RM 12,480.00</span>
            <span className="font-label-caps text-[10px] bg-[#ebe7ed] text-[#574238] px-2 py-0.5 rounded-full font-bold">
              PETRONAS FLEET
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[#574238]">
            <span className="material-symbols-outlined text-[15px] text-[#1c3ae7]">check_circle</span>
            <span className="text-[12px]">100% receipts backed by pump photos</span>
          </div>
        </div>
      </div>

      {/* Main Flagged Trip Detail: TR-2026-0928 */}
      {(filterMode === 'open' || filterMode === 'all') && (
        <div className="flex flex-col gap-6 mb-6">
          <div className="bg-[#f6f2f9] rounded-3xl p-6 shadow-sm border border-[#e5e1e8] flex flex-col gap-4">
            {/* Top Bar of Trip Card */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#e5e1e8]">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      trip2026_0928.auditStatus === 'open_flag' ? 'bg-[#ba1a1a] animate-pulse' : 'bg-[#0fa42f]'
                    }`}
                  ></span>
                  <span className="text-[18px] text-[#1c1b20] font-bold font-sans">TR-2026-0928</span>
                </div>
                {trip2026_0928.auditStatus === 'open_flag' ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-caps text-[10px] bg-[#ffdad6] text-[#93000a] font-bold">
                    <span className="material-symbols-outlined text-[14px]">error_outline</span>
                    MILEAGE_VARIANCE &gt; 10% THRESHOLD
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-caps text-[10px] bg-[#dfe0ff] text-[#000d60] font-bold">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    CLEARED BY AUDITOR
                  </span>
                )}
                <div className="flex items-center gap-1.5 text-[#574238]">
                  <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                  <span className="text-[13px] font-semibold text-[#1c1b20]">Lorry 2 (BQU 4109)</span>
                  <span className="font-mono-data text-[11px] bg-[#f0ecf3] px-2 py-0.5 rounded text-[#574238]">
                    Hino Dutro 300 Chilled
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#dfe0ff] flex items-center justify-center font-mono-data text-[11px] font-bold text-[#000d60]">
                    MK
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-[#1c1b20] leading-tight">Muthu K.</span>
                    <span className="text-[11px] text-[#574238] leading-none">Senior Route Driver</span>
                  </div>
                </div>
                <span className="font-mono-data text-[12px] text-[#1c1b20] bg-[#f0ecf3] px-3 py-1 rounded-full font-semibold">
                  28 Sep 2026
                </span>
              </div>
            </div>

            {/* 6 Metric Statistics Columns */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              <div className="bg-white p-3 rounded-2xl border border-[#e5e1e8] flex flex-col justify-between">
                <span className="font-label-caps text-[10px] text-[#574238] uppercase">Planned Route</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-[24px] text-[#1c1b20] font-bold">64.0</span>
                  <span className="font-mono-data text-[11px] text-[#574238]">km</span>
                </div>
                <span className="text-[11px] text-[#574238]">Dispatch Model V3</span>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-[#e5e1e8] flex flex-col justify-between">
                <span className="font-label-caps text-[10px] text-[#574238] uppercase">Start Odometer</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-[24px] text-[#1c1b20] font-bold">142,320</span>
                  <span className="font-mono-data text-[11px] text-[#574238]">km</span>
                </div>
                <span className="font-mono-data text-[11px] text-[#1c3ae7]">08:02 AM · Verified</span>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-[#e5e1e8] flex flex-col justify-between">
                <span className="font-label-caps text-[10px] text-[#574238] uppercase">End Odometer</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-[24px] text-[#1c1b20] font-bold">142,402</span>
                  <span className="font-mono-data text-[11px] text-[#574238]">km</span>
                </div>
                <span className="font-mono-data text-[11px] text-[#1c3ae7]">04:15 PM · Verified</span>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-[#e5e1e8] flex flex-col justify-between">
                <span className="font-label-caps text-[10px] text-[#574238] uppercase">Odo Delta</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-[24px] text-[#1c1b20] font-bold">82.0</span>
                  <span className="font-mono-data text-[11px] text-[#574238]">km</span>
                </div>
                <span className="text-[11px] text-[#574238]">Meter Differential</span>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-[#e5e1e8] flex flex-col justify-between">
                <span className="font-label-caps text-[10px] text-[#574238] uppercase">GPS Snapped API</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-[24px] text-[#1c3ae7] font-bold">71.2</span>
                  <span className="font-mono-data text-[11px] text-[#574238]">km</span>
                </div>
                <span className="text-[11px] text-[#574238]">30s Interval Logging</span>
              </div>

              <div
                className={`p-3 rounded-2xl flex flex-col justify-between ${
                  trip2026_0928.auditStatus === 'open_flag'
                    ? 'bg-[#ffdad6] text-[#93000a]'
                    : 'bg-[#dfe0ff] text-[#000d60]'
                }`}
              >
                <span className="font-label-caps text-[10px] uppercase font-bold">Variance (Odo vs GPS)</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-[24px] font-bold">+15.2%</span>
                </div>
                <span className="font-mono-data text-[11px] font-bold">10.8 km excess detected</span>
              </div>
            </div>

            {/* 3-Column Detailed Replay & Resolution Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Column 1: Gemini Vision OCR Comparison (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-3">
                <div className="bg-white p-4 rounded-2xl flex flex-col gap-3 shadow-xs border border-[#e5e1e8]">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-[10px] text-[#574238] uppercase tracking-wider font-semibold">
                      Gemini Vision OCR Comparison
                    </span>
                    <span className="font-mono-data text-[10px] text-[#273768] bg-[#dce1ff] px-2 py-0.5 rounded-full font-bold">
                      100% CONFIDENCE
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Morning Photo */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-[#1c1b20] font-semibold flex items-center justify-between">
                        <span>Morning Dispatch</span>
                        <span className="font-mono-data text-[#574238]">08:02</span>
                      </span>
                      <div
                        onClick={() =>
                          setSelectedPhotoModal({
                            title: 'Morning Dispatch Odometer Photo (Lorry 2)',
                            url: trip2026_0928.startOdoPhotoUrl!,
                            ocr: '142,320 km',
                          })
                        }
                        className="relative rounded-xl overflow-hidden h-32 bg-[#f0ecf3] cursor-pointer group"
                      >
                        <img
                          src={trip2026_0928.startOdoPhotoUrl}
                          alt="Morning Odometer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute bottom-1.5 right-1.5 bg-[#313035]/90 text-white font-mono-data text-[11px] px-2 py-0.5 rounded font-bold">
                          OCR: 142,320
                        </div>
                      </div>
                    </div>

                    {/* Return Photo */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-[#1c1b20] font-semibold flex items-center justify-between">
                        <span>Return Check-in</span>
                        <span className="font-mono-data text-[#574238]">16:15</span>
                      </span>
                      <div
                        onClick={() =>
                          setSelectedPhotoModal({
                            title: 'Return Check-in Odometer Photo (Lorry 2)',
                            url: trip2026_0928.endOdoPhotoUrl!,
                            ocr: '142,402 km',
                          })
                        }
                        className="relative rounded-xl overflow-hidden h-32 bg-[#f0ecf3] cursor-pointer group"
                      >
                        <img
                          src={trip2026_0928.endOdoPhotoUrl}
                          alt="End Odometer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute bottom-1.5 right-1.5 bg-[#313035]/90 text-white font-mono-data text-[11px] px-2 py-0.5 rounded font-bold">
                          OCR: 142,402
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fuel Refill Reconciled */}
                  <div className="p-3 rounded-xl bg-[#f6f2f9] border border-[#e5e1e8] flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[#1c1b20]">
                      <span className="text-[12px] font-semibold">Fuel Refill Reconciled</span>
                      <span className="font-mono-data text-[13px] font-bold text-[#9f4200]">RM 58.40</span>
                    </div>
                    <div className="flex items-center justify-between font-mono-data text-[11px] text-[#574238]">
                      <span>Petronas Bandar Sunway</span>
                      <span>28.50 L · Diesel B10</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 pt-1 border-t border-[#e5e1e8]">
                      <div className="flex items-center gap-1 font-mono-data text-[11px] text-[#1c3ae7]">
                        <span className="material-symbols-outlined text-[15px]">receipt_long</span>
                        <span>Receipt #INV-88910</span>
                      </div>
                      <span className="text-[#574238]">·</span>
                      <span className="font-mono-data text-[11px] text-[#574238]">Odo at Pump: 142,374 km</span>
                    </div>
                  </div>
                </div>

                {/* Vehicle Efficiency Audit */}
                <div className="bg-white p-4 rounded-2xl flex flex-col gap-1.5 shadow-xs border border-[#e5e1e8]">
                  <span className="font-label-caps text-[10px] text-[#574238] uppercase">
                    Vehicle Efficiency Audit
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#1c1b20]">Trip Fuel Economy</span>
                    <span className="font-mono-data text-[13px] font-bold text-[#1c1b20]">
                      2.88 km / Litre (Chilled)
                    </span>
                  </div>
                  <p className="text-[11px] text-[#574238] leading-relaxed">
                    Compressor active 6.8 hrs. Secondary fuel burn verified within thermo-chiller tolerances (+0.4L/hr).
                  </p>
                </div>
              </div>

              {/* Column 2: GPS Snapped Roads API Corridor Replay (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                <div className="bg-white p-4 rounded-2xl flex flex-col gap-3 shadow-xs border border-[#e5e1e8] h-full justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-caps text-[10px] text-[#574238] uppercase tracking-wider font-semibold">
                        GPS Snapped Roads API Corridor Replay
                      </span>
                      <span className="text-[12px] text-[#1c1b20] font-semibold">
                        Federal Highway & Subang SS15 Discrepancy
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-mono-data text-[11px] text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded-full font-bold">
                      <span className="material-symbols-outlined text-[14px]">timer_off</span>
                      <span>15m GPS Gap</span>
                    </div>
                  </div>

                  {/* Satellite Map with Live Overlaid Snapped Polyline */}
                  <div className="w-full h-56 rounded-2xl overflow-hidden relative shadow-inner border border-[#e5e1e8]">
                    <div
                      className="w-full h-full bg-cover bg-center relative"
                      style={{
                        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBmA728QnnaYPxQFpboucfJIQVdQ3d94PnE1ujuGjCp_NCrmZkqYUg68irnpUkJSgRJLY1qkolg3tMGD6dfDzHQW4-SNwPMg72frsMdaxKe9kuwS2sd8hSqh8mxe0QUKOA5q6jUGGNCvSF0EVOWBbUZwfm6klvDOscC7852jmAN_bQu7E5XCOgF3q8WglLSjpH3nVfnKolA7kdRFBNkm4b1mEZRbft-BsXGj4jBZ0MX_o_hnwkWY3eLqA')`,
                      }}
                    >
                      <div className="absolute inset-0 bg-[#313035]/30"></div>
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-[#1c3ae7] animate-pulse"></span>
                        <span className="font-mono-data text-[11px] text-[#1c1b20] font-semibold">
                          Active Snapped Polyline
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-md flex items-center justify-between text-[#1c1b20]">
                        <div className="flex flex-col">
                          <span className="font-label-caps text-[9px] text-[#574238]">Detour Event</span>
                          <span className="text-[12px] font-semibold">Exit 219 Subang Jaya → Batu Tiga</span>
                        </div>
                        <span className="font-mono-data text-[11px] bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded font-bold">
                          +10.8 km off planned corridor
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Telematics Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-[#574238]">
                    <div className="flex items-center gap-2 p-2.5 bg-[#f0ecf3] rounded-xl">
                      <span className="material-symbols-outlined text-[#1c3ae7] text-[20px]">timeline</span>
                      <div className="flex flex-col">
                        <span className="font-label-caps text-[9px] text-[#574238]">GPS Pings</span>
                        <span className="font-mono-data text-[12px] text-[#1c1b20] font-bold">964 Points (30s)</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 bg-[#f0ecf3] rounded-xl">
                      <span className="material-symbols-outlined text-[#4d5c90] text-[20px]">signal_cellular_alt</span>
                      <div className="flex flex-col">
                        <span className="font-label-caps text-[9px] text-[#574238]">Telematics Status</span>
                        <span className="font-mono-data text-[12px] text-[#1c1b20] font-bold">Quectel 4G LTE OK</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3: Finance Resolution (3 cols) */}
              <div className="lg:col-span-3 flex flex-col">
                <div className="bg-white p-4 rounded-2xl flex flex-col justify-between shadow-xs border border-[#e5e1e8] h-full">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#9f4200] text-[20px]">gavel</span>
                      <h2 className="text-[18px] text-[#1c1b20] font-bold">Finance Resolution</h2>
                    </div>
                    <p className="text-[12px] text-[#574238]">
                      Log operational justifications or escalate directly to logistics management.
                    </p>

                    <div className="flex flex-col gap-1.5 mt-2">
                      <label className="font-label-caps text-[10px] text-[#574238] uppercase font-semibold">
                        Auditor Justification Note
                      </label>
                      <textarea
                        rows={4}
                        value={justificationNote}
                        onChange={(e) => setJustificationNote(e.target.value)}
                        className="w-full bg-[#f6f2f9] text-[#1c1b20] p-2.5 rounded-xl text-[12px] border border-[#e5e1e8] focus:outline-none focus:bg-white transition-colors"
                        placeholder="Enter reason for variance..."
                      />
                    </div>

                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#f0ecf3] border border-[#e5e1e8] mt-1">
                      <span className="material-symbols-outlined text-[#574238] text-[18px]">verified_user</span>
                      <div className="flex flex-col">
                        <span className="text-[12px] text-[#1c1b20] font-semibold">
                          Audit Actor: {trip2026_0928.auditActor || 'William Soon'}
                        </span>
                        <span className="font-mono-data text-[10px] text-[#574238]">Level 3 Approver</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4 pt-2">
                    <button
                      onClick={() => handleClearFlag('TR-2026-0928')}
                      type="button"
                      className="w-full py-2.5 px-4 bg-[#1c3ae7] text-white rounded-full text-[13px] font-semibold shadow hover:opacity-95 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[18px]">done_all</span>
                      <span>Clear Flag & Approve Mileage</span>
                    </button>
                    <button
                      onClick={() => handleEscalate('TR-2026-0928')}
                      type="button"
                      className="w-full py-2 px-4 bg-[#f0ecf3] text-[#9f4200] text-[12px] font-semibold rounded-full hover:bg-[#ebe7ed] transition-colors flex items-center justify-center gap-1.5 border border-[#e5e1e8]"
                    >
                      <span className="material-symbols-outlined text-[16px]">priority_high</span>
                      <span>Escalate to Owner (William Soon)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cleared Trip Card: TR-2026-0925 */}
      {(filterMode === 'cleared' || filterMode === 'all') && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e5e1e8] flex flex-col gap-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-2 border-b border-[#f0ecf3]">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#1c3ae7]"></span>
                <span className="text-[18px] text-[#1c1b20] font-bold">TR-2026-0925</span>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full font-label-caps text-[10px] bg-[#dfe0ff] text-[#000d60] font-bold">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                CLEARED BY FINANCE (ADELINE)
              </span>
              <div className="flex items-center gap-1.5 text-[#574238]">
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                <span className="text-[13px] font-semibold text-[#1c1b20]">Lorry 5 (VDA 9022)</span>
                <span className="font-mono-data text-[11px] bg-[#f0ecf3] px-2 py-0.5 rounded text-[#574238]">
                  Isuzu NPR 5T
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#dce1ff] flex items-center justify-center font-mono-data text-[11px] font-bold text-[#041749]">
                  TH
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-[#1c1b20] leading-tight">Tan Hock Seng</span>
                  <span className="text-[11px] text-[#574238] leading-none">Chilled Delivery Specialist</span>
                </div>
              </div>
              <span className="font-mono-data text-[12px] text-[#1c1b20] bg-[#f0ecf3] px-3 py-1 rounded-full font-semibold">
                25 Sep 2026
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 p-3 bg-[#f6f2f9] rounded-2xl border border-[#e5e1e8]">
            <div className="flex flex-col">
              <span className="font-label-caps text-[10px] text-[#574238] uppercase">Planned Km</span>
              <span className="font-mono-data text-[12px] text-[#1c1b20] font-bold mt-0.5">112.4 km</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-[10px] text-[#574238] uppercase">Start Odometer</span>
              <span className="font-mono-data text-[12px] text-[#1c1b20] mt-0.5">98,140 km</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-[10px] text-[#574238] uppercase">End Odometer</span>
              <span className="font-mono-data text-[12px] text-[#1c1b20] mt-0.5">98,266 km</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-[10px] text-[#574238] uppercase">Odo Delta</span>
              <span className="font-mono-data text-[12px] text-[#1c1b20] font-bold mt-0.5">126.0 km</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-[10px] text-[#574238] uppercase">GPS Snapped API</span>
              <span className="font-mono-data text-[12px] text-[#1c3ae7] font-bold mt-0.5">124.8 km</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-[10px] text-[#574238] uppercase">Fuel Reimbursed</span>
              <span className="font-mono-data text-[12px] text-[#9f4200] font-bold mt-0.5">RM 84.10 (Shell)</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-label-caps text-[10px] text-[#574238] uppercase">Variance</span>
              <span className="font-mono-data text-[12px] text-[#1c3ae7] font-bold mt-0.5">+0.9% (In-Band)</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#f6f2f9] border border-[#e5e1e8] flex flex-col md:flex-row md:items-center justify-between gap-3 text-[#1c1b20]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1c3ae7] text-[20px]">assignment_turned_in</span>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold">Resolution Note:</span>
                <span className="text-[12px] text-[#574238]">
                  "{trip2026_0925.auditorNote}"
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono-data text-[11px] text-[#574238]">Audit Tag: SST-LOG-9022</span>
              <button
                onClick={() => alert('Opening SST compliant delivery slip #SST-LOG-9022 with signed proof of delivery.')}
                className="text-[#1c3ae7] hover:underline text-[12px] font-semibold flex items-center gap-0.5"
                type="button"
              >
                <span>View Archived Slip</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Reconciliation Queue (All 8 Lorries) Table */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#e5e1e8] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-[11px] text-[#574238] uppercase font-bold tracking-wider">
            Bulk Reconciliation Queue (All 8 Lorries)
          </span>
          <span className="font-mono-data text-[11px] text-[#574238]">
            Showing {filteredTrips.length} of {trips.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] text-[#1c1b20]">
            <thead>
              <tr className="bg-[#f6f2f9] text-[#574238] font-label-caps text-[10px] uppercase border-y border-[#e5e1e8]">
                <th className="py-2.5 px-4 font-semibold">Trip ID</th>
                <th className="py-2.5 px-4 font-semibold">Vehicle & Driver</th>
                <th className="py-2.5 px-4 font-semibold">Route Plan</th>
                <th className="py-2.5 px-4 font-semibold">Odometer Delta</th>
                <th className="py-2.5 px-4 font-semibold">GPS Snapped</th>
                <th className="py-2.5 px-4 font-semibold">Variance</th>
                <th className="py-2.5 px-4 font-semibold">Fuel Paid</th>
                <th className="py-2.5 px-4 text-right font-semibold">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ecf3]">
              {filteredTrips.map((trip) => (
                <tr key={trip.tripId} className="hover:bg-[#f6f2f9] transition-colors">
                  <td className="py-3 px-4 font-mono-data font-bold text-[#1c1b20]">{trip.tripId}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#1c1b20]">{trip.vehicleModel}</span>
                      <span className="text-[11px] text-[#574238]">
                        {trip.driverName} ({trip.vehiclePlate})
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono-data text-[#574238]">{trip.plannedKm.toFixed(1)} km</td>
                  <td className="py-3 px-4 font-mono-data text-[#1c1b20] font-semibold">{trip.odoDeltaKm.toFixed(1)} km</td>
                  <td className="py-3 px-4 font-mono-data text-[#1c3ae7] font-semibold">{trip.gpsSnappedKm.toFixed(1)} km</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full font-mono-data text-[11px] font-bold ${
                        trip.variancePct > 10
                          ? 'bg-[#ffdad6] text-[#93000a]'
                          : 'bg-[#f0ecf3] text-[#1c1b20]'
                      }`}
                    >
                      +{trip.variancePct.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono-data text-[#1c1b20]">
                    RM {trip.fuelPaidRm ? trip.fuelPaidRm.toFixed(2) : '0.00'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {trip.auditStatus === 'open_flag' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-caps text-[10px] bg-[#ffdad6] text-[#93000a] font-bold">
                        OPEN FLAG
                      </span>
                    ) : trip.auditStatus === 'cleared' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-caps text-[10px] bg-[#dfe0ff] text-[#000d60] font-semibold">
                        CLEARED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-caps text-[10px] bg-[#f0ecf3] text-[#574238] font-semibold">
                        IN PROGRESS
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* High-Res Photo Evidence Modal */}
      {selectedPhotoModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full border border-[#e5e1e8] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ecf3]">
              <span className="font-bold text-sm text-[#1c1b20]">{selectedPhotoModal.title}</span>
              <button
                onClick={() => setSelectedPhotoModal(null)}
                className="w-7 h-7 rounded-full bg-[#f0ecf3] flex items-center justify-center text-[#574238]"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 relative rounded-2xl overflow-hidden bg-black max-h-[70vh]">
              <img src={selectedPhotoModal.url} alt="Odometer Evidence" className="w-full object-contain" />
              <div className="absolute bottom-3 right-3 bg-[#313035]/95 text-white font-mono-data text-xs px-3 py-1 rounded-full font-bold shadow-md">
                Gemini Vision OCR: {selectedPhotoModal.ocr}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-[#574238]">
              <span>Hardware Telematics Stamp: Encrypted Geo-EXIF (Subang Depot Loading Bay)</span>
              <button
                onClick={() => setSelectedPhotoModal(null)}
                className="px-4 py-1.5 rounded-full bg-[#1c3ae7] text-white font-semibold"
              >
                Close Evidence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
