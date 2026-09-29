import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScanDOModal } from '../components/ScanDOModal';

export const OverviewView: React.FC = () => {
  const { deliveryOrders, trips, auditFlags, setActiveTab } = useApp();
  const [showScanModal, setShowScanModal] = useState(false);
  const [geminiQuery, setGeminiQuery] = useState('why did Lorry 2 consume +12% fuel?');
  const [aiAnswer, setAiAnswer] = useState<string | null>(
    'Lorry 2 [BQU 4109] idle time surged by 28 mins near Sunway Toll due to accident gridlock. Chiller unit ran on auxiliary power at +4.1kW while stationary, explaining the 12% diesel variance.'
  );
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAskGemini = (e: React.FormEvent) => {
    e.preventDefault();
    if (!geminiQuery.trim()) return;
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      if (geminiQuery.toLowerCase().includes('lorry 2') || geminiQuery.toLowerCase().includes('fuel')) {
        setAiAnswer(
          'Lorry 2 [BQU 4109] idle time surged by 28 mins near Sunway Toll due to accident gridlock. Chiller unit ran on auxiliary power at +4.1kW while stationary, explaining the 12% diesel variance.'
        );
      } else if (geminiQuery.toLowerCase().includes('cold') || geminiQuery.toLowerCase().includes('temp')) {
        setAiAnswer(
          'All 8 chilled lorries are reporting optimal temperatures between 2.1°C and 3.5°C across Federal Highway, LDP, and SPRINT corridors. Zero spoilage alerts.'
        );
      } else {
        setAiAnswer(
          `Analysis of ${geminiQuery}: Klang Valley dispatch efficiency is running at 96.4% on-time SLA with RM 34.20 daily fuel optimization savings.`
        );
      }
    }, 600);
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Header & Subtitle */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono-data text-[12px] text-[#ff7f35] font-bold">
              DC-SUBANG // ROUTE ENGINE
            </span>
            <span className="text-[#574238] font-mono-data text-[12px]">
              • MY-SGR TELEMETRY LIVE
            </span>
          </div>
          <h1 className="text-[32px] text-[#1c1b20] font-bold tracking-tight font-sans">
            Operations & Fleet Overview
          </h1>
          <p className="text-[13px] text-[#574238]">
            LOHAS Organic Wholesale Logistics Hub · Selangor & Klang Valley Network
          </p>
        </div>

        {/* Date & Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-white px-3.5 py-2 rounded-full shadow-sm border border-[#e5e1e8] gap-2 text-xs">
            <span className="material-symbols-outlined text-[16px] text-[#9f4200]">calendar_today</span>
            <span className="font-semibold text-[#1c1b20]">Today, 29 Sep 2026</span>
          </div>

          <div className="relative">
            <select className="appearance-none bg-white text-[#1c1b20] text-xs pl-3 pr-7 py-2 rounded-full shadow-sm border border-[#e5e1e8] focus:outline-none cursor-pointer font-medium">
              <option>All Depots (Subang HQ)</option>
              <option>Petaling Jaya Satellite Dock</option>
              <option>Klang Port Cold Storage</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-2 text-[16px] text-[#574238] pointer-events-none">
              expand_more
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-[#f0ecf3] text-[#574238] px-3 py-2 rounded-full text-xs font-semibold border border-[#e5e1e8]">
            <span className="material-symbols-outlined text-[15px]">trending_up</span>
            <span>vs Yesterday</span>
          </div>

          <button
            onClick={() => setShowScanModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#ff7f35] hover:bg-[#9f4200] text-white rounded-full text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
            <span>+ Quick Scan DO</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* KPI 1 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e5e1e8] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[10px] text-[#574238] uppercase">Cold-Chain SLA Met</span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-label-caps text-[10px] bg-[#dfe0ff] text-[#000d60] font-bold">
              ↑ +1.8% wk
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-[36px] font-bold text-[#1c1b20] leading-tight font-sans">96.4%</span>
              <span className="text-xs text-[#574238]">Target ≥95%</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-[#574238]">
              <span>138 / 143 Manifests Confirmed</span>
              <span className="w-2 h-2 rounded-full bg-[#1c3ae7]"></span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e5e1e8] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[10px] text-[#574238] uppercase">Fleet Deployment</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-caps text-[10px] bg-[#f0ecf3] text-[#1c1b20] font-bold">
              100% UTILITY
            </span>
          </div>
          <div className="mt-2">
            <span className="text-[36px] font-bold text-[#1c1b20] leading-tight font-sans">8 / 8 Active</span>
            <p className="mt-1 text-[11px] text-[#574238] truncate">
              5 Klang Valley · 2 PJ & Damansara · 1 Port Klang
            </p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e5e1e8] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[10px] text-[#574238] uppercase">Fuel Spend (Sep MTD)</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-caps text-[10px] bg-[#dfe0ff] text-[#000d60] font-bold">
              -4.2% Under
            </span>
          </div>
          <div className="mt-2">
            <span className="text-[36px] font-bold text-[#1c1b20] leading-tight font-sans">RM 8,420.50</span>
            <div className="mt-1 flex items-center justify-between text-[11px] text-[#574238]">
              <span>Avg: 8.2 km/L diesel</span>
              <span className="material-symbols-outlined text-[14px]">local_gas_station</span>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div
          onClick={() => setActiveTab('mileage-and-fuel-audit')}
          className="bg-white p-4 rounded-2xl shadow-sm border border-[#e5e1e8] flex flex-col justify-between cursor-pointer hover:border-[#ba1a1a] transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[10px] text-[#574238] uppercase font-bold">Audit & Exceptions</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-caps text-[10px] bg-[#ffdad6] text-[#93000a] font-bold">
              ACTION REQ
            </span>
          </div>
          <div className="mt-2">
            <span className="text-[36px] font-bold text-[#ba1a1a] leading-tight font-sans">2 Open Flags</span>
            <p className="mt-1 text-[11px] text-[#574238]">
              1 Odo variance &gt;10% · 1 Geofence drift (340m)
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Delivery Funnel + Live Telemetry Map + Autonomous Dispatch Banner */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Today's Delivery Funnel Execution */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#e5e1e8] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1c3ae7] text-[20px]">filter_alt</span>
                <h3 className="text-[16px] text-[#1c1b20] font-bold">Today's Delivery Funnel Execution</h3>
              </div>
              <span className="font-mono-data text-[11px] text-[#574238]">Sync: 14:31:40</span>
            </div>
            <p className="text-[12px] text-[#574238] -mt-2">
              Live telemetry status across 148 wholesale organic consignments
            </p>

            <div className="space-y-3">
              {/* Funnel Step 1 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-[#1c1b20]">
                    <span className="w-2 h-2 rounded-full bg-[#1c3ae7]"></span>
                    1. Scheduled at Subang Depots
                  </span>
                  <span className="font-mono-data font-bold">148 DOs (100%)</span>
                </div>
                <div className="w-full bg-[#f0ecf3] h-3.5 rounded-full overflow-hidden">
                  <div className="bg-[#1c3ae7] h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              {/* Funnel Step 2 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-[#1c1b20]">
                    <span className="w-2 h-2 rounded-full bg-[#1c3ae7]"></span>
                    2. Out For Delivery (En Route Corridor)
                  </span>
                  <span className="font-mono-data font-bold">94 Consignments (63.5%)</span>
                </div>
                <div className="w-full bg-[#f0ecf3] h-3.5 rounded-full overflow-hidden">
                  <div className="bg-[#1c3ae7] h-full rounded-full" style={{ width: '63.5%' }}></div>
                </div>
              </div>

              {/* Funnel Step 3 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-[#1c1b20]">
                    <span className="w-2 h-2 rounded-full bg-[#1c3ae7]"></span>
                    3. Arrived at Receiving Bay / Dock
                  </span>
                  <span className="font-mono-data font-bold">28 Consignments (18.9%)</span>
                </div>
                <div className="w-full bg-[#f0ecf3] h-3.5 rounded-full overflow-hidden">
                  <div className="bg-[#1c3ae7] h-full rounded-full" style={{ width: '18.9%' }}></div>
                </div>
              </div>

              {/* Bottom Delivered & Verified Micro-Pills */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 rounded-2xl bg-[#f6f2f9] border border-[#e5e1e8]">
                  <div className="text-[10px] font-label-caps text-[#574238] uppercase mb-0.5">
                    DELIVERED / UNLOADED
                  </div>
                  <div className="font-bold text-sm text-[#1c1b20]">22 DOs</div>
                  <div className="w-full bg-[#e5e1e8] h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-[#1c3ae7] h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#dfe0ff] border border-[#e5e1e8]">
                  <div className="text-[10px] font-label-caps text-[#000d60] uppercase mb-0.5">
                    POD VERIFIED BY AI
                  </div>
                  <div className="font-bold text-sm text-[#000d60]">22 / 22 (100%)</div>
                  <div className="w-full bg-white/70 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-[#1c3ae7] h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Fleet Routing Telemetry Interactive Map */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#e5e1e8] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#9f4200] text-[18px]">satellite_alt</span>
                  <h3 className="text-[16px] text-[#1c1b20] font-bold">Live Fleet Routing Telemetry</h3>
                </div>
                <p className="text-[11px] text-[#574238]">
                  Corridors: Federal Highway, LDP Highway, NKVE & Cold-Chain Transit
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-[#f0ecf3] px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#1c3ae7] animate-pulse"></span>
                <span className="font-mono-data text-[10px] font-semibold text-[#1c1b20]">GPS Refresh: 5s</span>
              </div>
            </div>

            {/* Map Canvas */}
            <div className="relative w-full h-72 rounded-2xl overflow-hidden bg-[#f0ecf3] border border-[#e5e1e8]">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCnYIY0TlE7YcUtUeUp8-4Dhx3bHeiz6IdatbyDMeTy3Le7Sme7rXgZRN3-OHnycHuquuOL5t_nkBdkxu1B0qa5tWp3TfJDq9W3RKVpbWJkYDoIu0y6eifb-9xBuhaBRGd46ILARbKHD6mcI8sr_wuu_-DMSk46Vd5w_5oxs4dcvyQR0uYzqbJMSrwo9y16POyFkgF8jlvx6aep4qz1iVcNq3lyZ_5qD2mWtvHaAPADnobyCnvRf1kzHA')`,
                }}
              ></div>

              {/* Pin 1: LORRY 1 */}
              <div className="absolute top-12 left-1/3 bg-[#313035]/95 text-white p-2 rounded-xl shadow-lg border border-white/20 text-xs flex flex-col gap-0.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold">LORRY 1 [WVC 8821]</span>
                  <span className="font-mono-data text-[10px] text-[#ffdbcb]">62 km/h</span>
                </div>
                <span className="text-[10px] text-[#dfc0b3]">LDP to Federal East</span>
              </div>

              {/* Pin 2: LORRY 2 */}
              <div className="absolute top-28 right-1/4 bg-[#313035]/95 text-white p-2 rounded-xl shadow-lg border border-white/20 text-xs flex flex-col gap-0.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold">LORRY 2 [BQU 4109]</span>
                  <span className="font-mono-data text-[10px] text-[#dfe0ff]">Docked</span>
                </div>
                <span className="text-[10px] text-[#dfc0b3]">Jaya Grocer 1 Utama</span>
                <span className="text-[9px] text-[#0fa42f] flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[11px]">photo_camera</span>
                  POD Vision AI in Progress
                </span>
              </div>

              {/* Pin 3: LORRY 3 */}
              <div className="absolute bottom-8 left-1/4 bg-[#313035]/95 text-white p-2 rounded-xl shadow-lg border border-white/20 text-xs flex flex-col gap-0.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold">LORRY 3 [VDA 9022]</span>
                  <span className="font-mono-data text-[10px] text-[#ffdbcb]">Stationary</span>
                </div>
                <span className="text-[10px] text-[#dfc0b3]">Petronas Subang West</span>
                <span className="text-[9px] text-[#ffdbcb]">Refill logged: 65.4 L SmartPay</span>
              </div>
            </div>

            {/* Live Vehicle Telemetry Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-2xl bg-[#f6f2f9] border border-[#e5e1e8] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold font-mono-data text-[#1c1b20]">WVC 8821</div>
                  <div className="text-[10px] text-[#574238]">LDP to Federal East</div>
                </div>
                <span className="px-2 py-0.5 rounded-full font-label-caps text-[9px] font-bold bg-[#dfe0ff] text-[#000d60]">
                  EN ROUTE
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-[#f6f2f9] border border-[#e5e1e8] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold font-mono-data text-[#1c1b20]">BQU 4109</div>
                  <div className="text-[10px] text-[#574238]">Petronas Utama</div>
                </div>
                <span className="px-2 py-0.5 rounded-full font-label-caps text-[9px] font-bold bg-[#ffdbcb] text-[#341100]">
                  CAPTURING
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-[#f6f2f9] border border-[#e5e1e8] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold font-mono-data text-[#1c1b20]">VDA 9022</div>
                  <div className="text-[10px] text-[#574238]">Petronas Subang</div>
                </div>
                <span className="px-2 py-0.5 rounded-full font-label-caps text-[9px] font-bold bg-[#dfe0ff] text-[#000d60]">
                  AUDIT OK
                </span>
              </div>
            </div>
          </div>

          {/* Autonomous Dispatch Banner */}
          <div className="bg-[#9f4200] text-white p-5 rounded-3xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white text-[22px]">auto_awesome</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">15.4% km saved today (84.2 km total)</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono-data">
                    Model Gemini-Pro-Fleet
                  </span>
                </div>
                <p className="text-xs text-white/90 mt-1 max-w-xl leading-relaxed">
                  Google Routes engine consolidated 3 separate supermarket multi-drop manifests across Subang Jaya and Petaling Jaya postcodes 47500–47800 avoiding NKVE rush-hour toll bottlenecks.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('route-planner')}
              className="px-5 py-2.5 rounded-full bg-white text-[#9f4200] text-xs font-bold shrink-0 hover:bg-[#f6f2f9] transition-all shadow-md active:scale-95"
            >
              View Geo Clusters
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): Active DO Feed + Gemini Assistant */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Active DO Feed */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#e5e1e8] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1c3ae7] text-[20px]">feed</span>
                <h3 className="text-[16px] text-[#1c1b20] font-bold">Active DO Feed</h3>
              </div>
              <span className="font-mono-data text-[11px] text-[#574238] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#0fa42f] animate-pulse"></span>
                Live
              </span>
            </div>
            <p className="text-[12px] text-[#574238] -mt-1">
              Real-time consignments & automated AI POD status
            </p>

            <div className="space-y-2.5">
              {deliveryOrders.slice(0, 4).map((d) => (
                <div
                  key={d.id}
                  className="p-3 rounded-2xl bg-[#f6f2f9] border border-[#e5e1e8] hover:bg-white transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-data text-[12px] font-bold text-[#1c1b20]">{d.doNumber}</span>
                    {d.status === 'delivered' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#dfe0ff] text-[#000d60]">
                        <span className="material-symbols-outlined text-[13px]">verified</span>
                        Delivered (AI POD Pass)
                      </span>
                    ) : d.status === 'arrived' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1c3ae7] text-white">
                        Arrived at Dock
                      </span>
                    ) : d.status === 'out_for_delivery' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#dfe0ff] text-[#000d60]">
                        Out for Delivery
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ebe7ed] text-[#574238]">
                        Scheduled
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-xs text-[#1c1b20] mt-1">{d.customerName}</div>
                  <div className="flex items-center justify-between text-[11px] text-[#574238] mt-0.5">
                    <span>{d.itemsSummary}</span>
                    <span className="font-mono-data">{d.postcode}</span>
                  </div>
                  {d.driverName && (
                    <div className="flex items-center justify-between text-[10px] text-[#574238] mt-1.5 pt-1 border-t border-[#e5e1e8]">
                      <span>Driver: {d.driverName}</span>
                      {d.deliveredAt && <span className="font-mono-data">Verified @ {d.deliveredAt}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('deliveries-and-dos')}
              className="w-full py-2.5 rounded-full bg-[#f0ecf3] hover:bg-[#ebe7ed] text-[#1c1b20] text-xs font-semibold text-center mt-1 border border-[#e5e1e8] transition-colors"
            >
              Open Delivery Manifest Register (148)
            </button>
          </div>

          {/* Gemini Logistics Assistant (NLP Dispatched) */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#e5e1e8] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff7f35] text-[20px]">auto_awesome</span>
                <h3 className="text-[16px] text-[#1c1b20] font-bold">Gemini Logistics Assistant</h3>
              </div>
              <span className="font-label-caps text-[10px] px-2 py-0.5 rounded-full bg-[#ffdbcb] text-[#341100] font-bold">
                NLP DISPATCHED
              </span>
            </div>
            <p className="text-[12px] text-[#574238] -mt-1">
              Ask operational questions in plain English or Malay across routes, sensor anomalies, and driver consumption.
            </p>

            {/* Prompt Input */}
            <form onSubmit={handleAskGemini} className="relative flex items-center">
              <span className="absolute left-3 font-mono-data text-[12px] text-[#9f4200] font-bold">/lorry</span>
              <input
                type="text"
                value={geminiQuery}
                onChange={(e) => setGeminiQuery(e.target.value)}
                placeholder="Ask logistics telemetry..."
                className="w-full pl-16 pr-11 py-2.5 rounded-full bg-[#f6f2f9] border border-[#e5e1e8] text-xs text-[#1c1b20] focus:outline-none focus:border-[#ff7f35]"
              />
              <button
                type="submit"
                disabled={isAiLoading}
                className="absolute right-1.5 w-8 h-8 rounded-full bg-[#ff7f35] text-white flex items-center justify-center hover:bg-[#9f4200] transition-colors active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isAiLoading ? 'refresh' : 'arrow_forward'}
                </span>
              </button>
            </form>

            {/* Quick Suggestion Chips */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-[#574238]">Quick:</span>
              <button
                type="button"
                onClick={() => setGeminiQuery('why did Lorry 2 consume +12% fuel?')}
                className="px-2 py-0.5 rounded-full bg-[#f0ecf3] hover:bg-[#ebe7ed] text-[#1c1b20] font-mono-data text-[10px]"
              >
                /lorry fuel variance
              </button>
              <button
                type="button"
                onClick={() => setGeminiQuery('show cold chain temperature health')}
                className="px-2 py-0.5 rounded-full bg-[#f0ecf3] hover:bg-[#ebe7ed] text-[#1c1b20] font-mono-data text-[10px]"
              >
                /cold-chain 2-4°C
              </button>
            </div>

            {/* AI Diagnostics Response Card */}
            {aiAnswer && (
              <div className="p-4 rounded-2xl bg-[#f6f2f9] border border-[#e5e1e8] flex flex-col gap-2 animate-fade-in">
                <div className="flex items-center justify-between text-[11px] text-[#574238]">
                  <span className="font-label-caps text-[#1c3ae7] font-bold">TELEMETRY DIAGNOSTICS</span>
                  <span className="font-mono-data">Model latency: 310ms</span>
                </div>
                <p className="text-xs text-[#1c1b20] leading-relaxed">
                  <strong>Lorry 2 [BQU 4109]</strong> {aiAnswer}
                </p>
                <div className="flex items-center justify-between text-[10px] text-[#574238] pt-1.5 border-t border-[#e5e1e8]">
                  <span>Reefer Load: 3.2°C Stable</span>
                  <span className="text-[#0fa42f] font-semibold">No Spoiling Risk</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ScanDOModal isOpen={showScanModal} onClose={() => setShowScanModal(false)} />
    </div>
  );
};
