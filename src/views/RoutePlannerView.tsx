import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScanDOModal } from '../components/ScanDOModal';

export const RoutePlannerView: React.FC = () => {
  const { deliveryOrders, trips, optimizeRoute, dispatchRouteToDriver } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPostcode, setSelectedPostcode] = useState<string>('all');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [isClustering, setIsClustering] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentTrip = trips.find((t) => t.tripId === 'TR-2026-0929') || trips[2] || trips[0];

  const handleAutoGroup = () => {
    setIsClustering(true);
    setTimeout(() => {
      setIsClustering(false);
      showToast('Clustering complete: 4 consignments consolidated under Subang-Damansara (47xxx) & Mont Kiara (50xxx) corridors.');
    }, 700);
  };

  const handleRunRoutesAI = async () => {
    setIsOptimizing(true);
    const result = await optimizeRoute(currentTrip.tripId);
    setIsOptimizing(false);
    showToast(`AI Optimization Success: Re-ordered 3 waypoints. Total savings: ${result.kmSaved} km (16.5% reduction) and ${result.timeSavedMins} minutes driving time.`);
  };

  const handleDispatch = async () => {
    setIsDispatching(true);
    await dispatchRouteToDriver(currentTrip.tripId);
    setTimeout(() => {
      setIsDispatching(false);
      showToast("Dispatched to Ahmad's Driver Terminal via Firebase Cloud Messaging (/topics/driver_ahmad_wvc8821)!");
    }, 1000);
  };

  // Filter DOs in staging pool
  const filteredDOs = deliveryOrders.filter((d) => {
    const matchesSearch =
      d.doNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.postcode.includes(searchQuery);

    if (!matchesSearch) return false;
    if (selectedPostcode === '47500') return d.postcode === '47500';
    if (selectedPostcode === '47301') return d.postcode === '47301' || d.postcode === '47400';
    if (selectedPostcode === '50480') return d.postcode === '50480';
    return true;
  });

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#313035] text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border border-[#e5e1e8] text-sm">
          <span className="material-symbols-outlined text-[#0fa42f]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 py-4 mb-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full font-label-caps text-[10px] bg-[#dfe0ff] text-[#000d60] font-bold">
              AUTONOMOUS GEODISPATCH v3.4
            </span>
            <span className="text-[#574238] font-mono-data text-[12px]">
              · Engine: Google Routes AI + LOHAS Fleet Routing
            </span>
          </div>
          <h1 className="text-[32px] text-[#1c1b20] font-bold tracking-tight font-sans">
            Route Planner & Delivery Order Board
          </h1>
          <p className="text-[14px] text-[#574238] max-w-2xl">
            Geocoded Delivery Order Dispatch & Waypoint Optimization Engine. Synchronized with live cold-chain logistics across Klang Valley corridors.
          </p>
        </div>

        {/* Action Cluster */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowScanModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#ebe7ed] hover:bg-[#e5e1e8] text-[#1c1b20] text-[13px] font-semibold transition-all shadow-xs active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#9f4200]">document_scanner</span>
            <span>+ Upload / Scan DO Photo</span>
          </button>

          <button
            onClick={handleAutoGroup}
            disabled={isClustering}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#f0ecf3] hover:bg-[#ebe7ed] text-[#1c1b20] text-[13px] font-semibold transition-all shadow-xs active:scale-95 border border-[#e5e1e8]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#1c3ae7]">
              {isClustering ? 'sync' : 'pin_drop'}
            </span>
            <span>{isClustering ? 'Clustering Postcodes...' : 'Auto-Group by Postcode'}</span>
          </button>

          <button
            onClick={handleRunRoutesAI}
            disabled={isOptimizing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ff7f35] hover:bg-[#9f4200] text-white text-[13px] font-bold transition-all shadow-md active:scale-95 group"
            type="button"
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                isOptimizing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'
              }`}
            >
              auto_awesome
            </span>
            <span>{isOptimizing ? 'Solving TSP with Google Routes...' : 'Run Google Routes AI'}</span>
          </button>
        </div>
      </div>

      {/* Operational Metric Rail */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e5e1e8] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[10px] text-[#574238] uppercase tracking-wider font-semibold">
              Unassigned Pool
            </span>
            <span className="p-1 rounded-full bg-[#ffdbcb] text-[#341100] material-symbols-outlined text-[16px]">
              pending_actions
            </span>
          </div>
          <div className="mt-2">
            <div className="text-[36px] font-bold text-[#1c1b20] leading-tight font-sans">
              18 <span className="text-[14px] text-[#574238] font-normal">DOs</span>
            </div>
            <span className="font-mono-data text-[12px] text-[#9f4200] font-medium">4 Hot-List Organics</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e5e1e8] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[10px] text-[#574238] uppercase tracking-wider font-semibold">
              Chilled Capacity
            </span>
            <span className="p-1 rounded-full bg-[#dfe0ff] text-[#000d60] material-symbols-outlined text-[16px]">
              ac_unit
            </span>
          </div>
          <div className="mt-2">
            <div className="text-[36px] font-bold text-[#1c1b20] leading-tight font-sans">82.4%</div>
            <span className="font-mono-data text-[12px] text-[#574238] font-medium">1,840 kg of 2,200 kg allocated</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e5e1e8] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[10px] text-[#574238] uppercase tracking-wider font-semibold">
              Projected Cost Delta
            </span>
            <span className="p-1 rounded-full bg-[#dfe0ff] text-[#000d60] material-symbols-outlined text-[16px]">
              trending_down
            </span>
          </div>
          <div className="mt-2">
            <div className="text-[36px] font-bold text-[#1c3ae7] leading-tight font-sans">-16.5%</div>
            <span className="font-mono-data text-[12px] text-[#574238] font-medium">RM 34.20 diesel savings today</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e5e1e8] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[10px] text-[#574238] uppercase tracking-wider font-semibold">
              SLA Commitment
            </span>
            <span className="p-1 rounded-full bg-[#dfe0ff] text-[#000d60] material-symbols-outlined text-[16px]">
              verified
            </span>
          </div>
          <div className="mt-2">
            <div className="text-[36px] font-bold text-[#1c1b20] leading-tight font-sans">99.4%</div>
            <span className="font-mono-data text-[12px] text-[#574238] font-medium">Within promised morning slot</span>
          </div>
        </div>
      </div>

      {/* Main Split Layout: 5 cols Left (Pool) / 7 cols Right (Route Workspace) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Staged DO Pool (5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#f6f2f9] p-4 rounded-3xl shadow-sm border border-[#e5e1e8] flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#9f4200] text-[20px]">inventory_2</span>
                  <h2 className="text-[18px] text-[#1c1b20] font-semibold">Staged DO Pool</h2>
                </div>
                <span className="font-mono-data text-[11px] px-2.5 py-0.5 rounded-full bg-[#e5e1e8] text-[#574238] font-semibold">
                  {filteredDOs.length} Staged in Pool
                </span>
              </div>

              {/* Malaysian Postcode Search */}
              <div className="relative flex items-center bg-white rounded-full px-4 py-2 shadow-xs border border-[#e5e1e8]">
                <span className="material-symbols-outlined text-[18px] text-[#574238] mr-2">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search DO#, Client, or 5-digit postcode (e.g. 47500)..."
                  className="bg-transparent text-[12px] text-[#1c1b20] focus:outline-none w-full placeholder:text-[#574238]/60"
                />
                <span className="inline-flex items-center px-2 py-0.5 rounded-full font-mono-data text-[10px] bg-[#ffdbcb] text-[#341100] font-bold shrink-0">
                  MY POST
                </span>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-nowrap">
                <button
                  onClick={() => setSelectedPostcode('all')}
                  className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-colors ${
                    selectedPostcode === 'all'
                      ? 'bg-[#313035] text-[#f3eff6]'
                      : 'bg-white hover:bg-[#f0ecf3] text-[#574238] border border-[#e5e1e8]'
                  }`}
                >
                  All Klang Valley
                </button>
                <button
                  onClick={() => setSelectedPostcode('47500')}
                  className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-colors ${
                    selectedPostcode === '47500'
                      ? 'bg-[#313035] text-[#f3eff6]'
                      : 'bg-white hover:bg-[#f0ecf3] text-[#574238] border border-[#e5e1e8]'
                  }`}
                >
                  Subang (47500)
                </button>
                <button
                  onClick={() => setSelectedPostcode('47301')}
                  className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-colors ${
                    selectedPostcode === '47301'
                      ? 'bg-[#313035] text-[#f3eff6]'
                      : 'bg-white hover:bg-[#f0ecf3] text-[#574238] border border-[#e5e1e8]'
                  }`}
                >
                  PJ / Damansara (47301)
                </button>
                <button
                  onClick={() => setSelectedPostcode('50480')}
                  className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-colors ${
                    selectedPostcode === '50480'
                      ? 'bg-[#313035] text-[#f3eff6]'
                      : 'bg-white hover:bg-[#f0ecf3] text-[#574238] border border-[#e5e1e8]'
                  }`}
                >
                  Mont Kiara (50480)
                </button>
              </div>
            </div>

            {/* Draggable Staged Delivery Cards */}
            <div className="flex flex-col gap-2.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredDOs.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white hover:shadow-md transition-all rounded-2xl p-4 flex flex-col gap-2 border border-[#e5e1e8] border-l-4 border-l-[#1c3ae7] cursor-grab"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#574238]/40 group-hover:text-[#1c1b20] text-[20px] -ml-1">
                        drag_indicator
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono-data text-[12px] font-bold text-[#1c1b20]">{item.doNumber}</span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full font-label-caps text-[10px] bg-[#dfe0ff] text-[#000d60] font-bold">
                            OCR {item.ocrConfidence}%
                          </span>
                        </div>
                        <h3 className="text-[14px] leading-tight font-semibold text-[#1c1b20] mt-0.5">
                          {item.customerName}
                        </h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono-data text-[12px] px-2 py-0.5 rounded-full bg-[#ebe7ed] text-[#1c1b20] font-bold">
                        {item.postcode}
                      </span>
                      <span className="block font-label-caps text-[10px] text-[#574238] mt-0.5">{item.state}</span>
                    </div>
                  </div>

                  <div className="bg-[#f6f2f9] p-2 rounded-xl flex items-center justify-between text-[#574238] text-[12px]">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="material-symbols-outlined text-[16px] text-[#9f4200]">eco</span>
                      <span className="truncate">{item.itemsSummary}</span>
                    </div>
                    <span className="font-mono-data font-semibold text-[#1c1b20] shrink-0 ml-2">
                      {item.weightKg} kg
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[12px]">
                    <div className="flex items-center gap-1 text-[#574238]">
                      <span className="material-symbols-outlined text-[15px]">schedule</span>
                      <span>
                        Promised: <strong className="text-[#1c1b20]">{item.windowStart} - {item.windowEnd}</strong>
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 font-label-caps text-[10px] px-2 py-0.5 rounded-full bg-[#f0ecf3] text-[#574238]">
                      <span className="material-symbols-outlined text-[12px] text-[#9f4200]">fingerprint</span>
                      Auto-Geocoded
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Audit Trail Note */}
            <div className="bg-[#f0ecf3] p-3 rounded-2xl flex items-center justify-between border border-[#e5e1e8]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#574238]">history_edu</span>
                <span className="font-mono-data text-[11px] text-[#574238]">
                  Seq override logging active · OpsID: #MY-WS-99
                </span>
              </div>
              <span className="font-label-caps text-[10px] text-[#1c3ae7] font-bold uppercase tracking-wider">
                Audit Ready
              </span>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL: Active Route Builder, Map & Dispatcher (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          {/* Driver & Vehicle Selector Card */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-[#e5e1e8] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 shadow-sm border border-[#e5e1e8]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUKxyyZaDuDHnnzmZis3iO0XSbXx97OErwTFbD8y0e4UzU4RepCdoutFLrxU7O8B9MLYwqSEeaaunZ6K2ZgNW58_26rxngOLAOrcnoBr-EhkM6HeOz9oOfGqNWZ-TheEwi8h7P9-Rt-aG8f-mA_utrxFx2x8sChQqy6u43pf5jEyJQmX1-69ewV5ymmergooOS5tO67JdCt3-xAkihnrbXPEPiY5T60MJbBh-FTCQk-q9PdnOJqM-O2A"
                  alt="Ahmad Razali"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[17px] text-[#1c1b20] font-bold">Ahmad Razali</h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-caps text-[10px] bg-[#dfe0ff] text-[#000d60] font-bold">
                    LEAD LOGISTICIAN
                  </span>
                </div>
                <p className="text-[12px] text-[#574238] flex items-center gap-1.5 mt-0.5">
                  <span>Lorry #3</span>
                  <span>·</span>
                  <strong className="font-mono-data text-[#1c1b20]">WVC 8821</strong>
                  <span>·</span>
                  <span>3-Ton Chilled Box (Chiller 3.2°C)</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={() => alert('Available Lorries in Klang Valley:\n- Lorry 3 (WVC 8821 - Assigned)\n- Lorry 1 (WA 8821 X)\n- Lorry 4 (WVG 3004)\n- Lorry 6 (VCB 1190)')}
                className="px-3 py-1.5 rounded-full bg-[#f0ecf3] hover:bg-[#ebe7ed] text-[#1c1b20] text-[12px] font-semibold transition-colors flex items-center gap-1 border border-[#e5e1e8]"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                <span>Switch Asset</span>
              </button>
              <div className="px-3 py-1.5 rounded-full bg-[#dfe0ff] text-[#000d60] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1c3ae7] animate-pulse"></span>
                <span className="font-mono-data text-[11px] font-bold">FCM READY</span>
              </div>
            </div>
          </div>

          {/* AI Routing Telemetry Delta Banner */}
          <div className="bg-[#f6f2f9] p-4 rounded-3xl shadow-sm border border-[#e5e1e8] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1c3ae7] text-[20px]">insights</span>
                <span className="text-[15px] text-[#1c1b20] font-bold">AI Routing Telemetry Delta</span>
              </div>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full font-mono-data text-[12px] bg-[#1c3ae7] text-white font-bold">
                16.5% REDUCTION
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              {/* Distance Card */}
              <div className="bg-white p-3 rounded-2xl border border-[#e5e1e8] flex items-center justify-between">
                <div>
                  <span className="font-label-caps text-[10px] text-[#574238] block uppercase font-semibold">
                    Planned Distance
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-[24px] font-bold text-[#1c1b20]">
                      {currentTrip.plannedKm ? currentTrip.plannedKm.toFixed(1) : '62.4'} km
                    </span>
                    <span className="text-[12px] line-through text-[#574238]">74.8 km</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center text-[#9f4200] font-mono-data text-[12px] font-bold bg-[#ffdbcb] px-2.5 py-0.5 rounded-full">
                    -12.4 km Saved
                  </span>
                </div>
              </div>

              {/* Time Card */}
              <div className="bg-white p-3 rounded-2xl border border-[#e5e1e8] flex items-center justify-between">
                <div>
                  <span className="font-label-caps text-[10px] text-[#574238] block uppercase font-semibold">
                    Estimated Drive Time
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-[24px] font-bold text-[#1c1b20]">2h 45m</span>
                    <span className="text-[12px] line-through text-[#574238]">3h 23m</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center text-[#1c3ae7] font-mono-data text-[12px] font-bold bg-[#dfe0ff] px-2.5 py-0.5 rounded-full">
                    -38 mins Saved
                  </span>
                </div>
              </div>
            </div>

            {/* Hatched Progression Indicator */}
            <div className="relative w-full h-3 rounded-full bg-[#e5e1e8] overflow-hidden mt-1">
              <div className="absolute left-0 top-0 bottom-0 bg-[#1c3ae7] rounded-full" style={{ width: '83.5%' }}></div>
              <div
                className="absolute right-0 top-0 bottom-0 opacity-50 bg-hatched-pattern"
                style={{ width: '16.5%' }}
              ></div>
            </div>
          </div>

          {/* Interactive Klang Valley Map Visual */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-[#e5e1e8] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[16px] text-[#1c1b20] font-bold">Klang Valley Waypoint Map & Pathing</h4>
                <p className="text-[12px] text-[#574238]">Federal Highway & SPRINT Expressways optimized live</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono-data text-[11px] text-[#574238]">Traffic: Normal (Green)</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#0fa42f]"></span>
              </div>
            </div>

            {/* Map Visual Canvas */}
            <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-[#f0ecf3] shadow-inner border border-[#e5e1e8]">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCnYIY0TlE7YcUtUeUp8-4Dhx3bHeiz6IdatbyDMeTy3Le7Sme7rXgZRN3-OHnycHuquuOL5t_nkBdkxu1B0qa5tWp3TfJDq9W3RKVpbWJkYDoIu0y6eifb-9xBuhaBRGd46ILARbKHD6mcI8sr_wuu_-DMSk46Vd5w_5oxs4dcvyQR0uYzqbJMSrwo9y16POyFkgF8jlvx6aep4qz1iVcNq3lyZ_5qD2mWtvHaAPADnobyCnvRf1kzHA')`,
                }}
              ></div>

              {/* Dynamic SVG Route Line Overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 600 320">
                <path
                  d="M 80 230 C 140 210, 200 170, 240 180 S 340 140, 420 120 S 500 70, 540 60"
                  stroke="#1c3ae7"
                  strokeOpacity="0.25"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 80 230 C 140 210, 200 170, 240 180 S 340 140, 420 120 S 500 70, 540 60"
                  stroke="#1c3ae7"
                  strokeWidth="3.5"
                  strokeDasharray="6 6"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>

              {/* Pin 0: Subang Central DC */}
              <div className="absolute left-16 bottom-14 transform -translate-x-1/2 flex flex-col items-center">
                <div className="px-2 py-0.5 rounded-md bg-[#313035] text-white font-mono-data text-[10px] font-bold shadow-md">
                  START #0
                </div>
                <div className="w-7 h-7 rounded-full bg-[#9f4200] flex items-center justify-center text-white shadow-lg border-2 border-white">
                  <span className="material-symbols-outlined text-[15px]">warehouse</span>
                </div>
                <span className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-semibold text-[#1c1b20] shadow-xs mt-1">
                  Subang Central DC
                </span>
              </div>

              {/* Stop 1: Empire Subang */}
              <div className="absolute left-1/3 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="px-2 py-0.5 rounded-md bg-[#1c3ae7] text-white font-mono-data text-[10px] font-bold shadow-md">
                  STOP 1 · 11:15 AM
                </div>
                <div className="w-6 h-6 rounded-full bg-white text-[#1c3ae7] flex items-center justify-center font-bold text-xs shadow-md border border-[#1c3ae7]">
                  1
                </div>
                <span className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-semibold text-[#1c1b20] shadow-xs mt-1">
                  Empire Subang (47500)
                </span>
              </div>

              {/* Stop 2: Citta Mall */}
              <div className="absolute left-2/3 top-1/3 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="px-2 py-0.5 rounded-md bg-[#1c3ae7] text-white font-mono-data text-[10px] font-bold shadow-md">
                  STOP 2 · 12:05 PM
                </div>
                <div className="w-6 h-6 rounded-full bg-white text-[#1c3ae7] flex items-center justify-center font-bold text-xs shadow-md border border-[#1c3ae7]">
                  2
                </div>
                <span className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-semibold text-[#1c1b20] shadow-xs mt-1">
                  Citta Mall (47301)
                </span>
              </div>

              {/* Stop 3: Mont Kiara */}
              <div className="absolute right-12 top-10 flex flex-col items-center">
                <div className="px-2 py-0.5 rounded-md bg-[#1c3ae7] text-white font-mono-data text-[10px] font-bold shadow-md">
                  STOP 3 · 01:45 PM
                </div>
                <div className="w-6 h-6 rounded-full bg-white text-[#1c3ae7] flex items-center justify-center font-bold text-xs shadow-md border border-[#1c3ae7]">
                  3
                </div>
                <span className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-semibold text-[#1c1b20] shadow-xs mt-1">
                  Arcoris Kiara (50480)
                </span>
              </div>

              {/* Floating Map Legend */}
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md flex items-center gap-3 font-label-caps text-[10px] border border-[#e5e1e8]">
                <span className="flex items-center gap-1 text-[#1c1b20]">
                  <span className="w-2 h-2 rounded-full bg-[#9f4200]"></span> DC Origin
                </span>
                <span className="flex items-center gap-1 text-[#1c1b20]">
                  <span className="w-2 h-2 rounded-full bg-[#1c3ae7]"></span> Geocoded Stop
                </span>
                <span className="text-[#574238] font-mono-data">Peninsular Map v24.1</span>
              </div>
            </div>

            {/* Sequential Stop Manifest Table */}
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="font-label-caps text-[10px] text-[#574238] uppercase tracking-wider font-semibold">
                Optimized Sequence & Window Verification
              </span>

              {/* Item 0 */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f6f2f9] text-[#1c1b20] text-[12px] border border-[#e5e1e8]">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#e5e1e8] flex items-center justify-center font-mono-data text-[11px] font-bold text-[#574238]">
                    0
                  </span>
                  <div>
                    <span className="font-semibold">Subang Jaya Central DC (Loading Dock 4)</span>
                    <span className="block font-mono-data text-[11px] text-[#574238]">
                      Depart: 10:45 AM · Sealed Cold Manifest
                    </span>
                  </div>
                </div>
                <span className="font-mono-data text-[12px] text-[#1c3ae7] font-semibold">Origin</span>
              </div>

              {/* Item 1 */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-[#f6f2f9] transition-colors text-[#1c1b20] text-[12px] border border-[#e5e1e8]">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#dfe0ff] text-[#000d60] flex items-center justify-center font-mono-data text-[11px] font-bold">
                    1
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Jaya Grocer (Empire Subang)</span>
                      <span className="font-mono-data text-[11px] text-[#574238]">DO-9042</span>
                    </div>
                    <span className="block font-mono-data text-[11px] text-[#574238]">
                      ETA: 11:15 AM (Window: 11:00 AM - 01:00 PM) · 7.2 km
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 font-label-caps text-[10px] text-[#0fa42f] font-bold">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span> ON TIME
                </span>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-[#f6f2f9] transition-colors text-[#1c1b20] text-[12px] border border-[#e5e1e8]">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#dfe0ff] text-[#000d60] flex items-center justify-center font-mono-data text-[11px] font-bold">
                    2
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Village Grocer (Citta Mall)</span>
                      <span className="font-mono-data text-[11px] text-[#574238]">DO-9041</span>
                    </div>
                    <span className="block font-mono-data text-[11px] text-[#574238]">
                      ETA: 12:05 PM (Window: 10:00 AM - 12:00 PM) · 14.1 km
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 font-label-caps text-[10px] text-[#9f4200] font-bold">
                  <span className="material-symbols-outlined text-[14px]">warning</span> +5M DELAY RISK
                </span>
              </div>

              {/* Item 3 */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-[#f6f2f9] transition-colors text-[#1c1b20] text-[12px] border border-[#e5e1e8]">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#dfe0ff] text-[#000d60] flex items-center justify-center font-mono-data text-[11px] font-bold">
                    3
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Qra (Arcoris Mont Kiara)</span>
                      <span className="font-mono-data text-[11px] text-[#574238]">DO-9043</span>
                    </div>
                    <span className="block font-mono-data text-[11px] text-[#574238]">
                      ETA: 01:45 PM (Window: 01:30 PM - 03:00 PM) · 21.8 km
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 font-label-caps text-[10px] text-[#0fa42f] font-bold">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span> ON TIME
                </span>
              </div>
            </div>

            {/* Dispatch Action Bar */}
            <div className="mt-2 pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#f0ecf3] p-3 rounded-2xl border border-[#e5e1e8]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#dfe0ff] text-[#000d60] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                </div>
                <div>
                  <span className="text-[13px] font-bold text-[#1c1b20] block">Driver Terminal Direct Push</span>
                  <span className="font-mono-data text-[11px] text-[#574238]">
                    FCM Channel: /topics/driver_ahmad_wvc8821
                  </span>
                </div>
              </div>
              <button
                onClick={handleDispatch}
                disabled={isDispatching}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#1c3ae7] hover:bg-[#3f58ff] text-white text-[13px] font-bold transition-all shadow-md active:scale-95 disabled:opacity-75"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isDispatching ? 'sync' : 'send'}
                </span>
                <span>{isDispatching ? 'Transmitting Manifest...' : "Confirm & Dispatch to Ahmad's Driver App"}</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Modal for DO scanning */}
      <ScanDOModal isOpen={showScanModal} onClose={() => setShowScanModal(false)} />
    </div>
  );
};
