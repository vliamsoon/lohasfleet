import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const DriverMobileTerminalView: React.FC = () => {
  const { trips, updateTripOdometer, updateDeliveryOrderStatus, currentUser } = useApp();
  const [lang, setLang] = useState<'en' | 'bm' | 'zh'>('en');
  const [step, setStep] = useState<'start' | 'route' | 'pod' | 'fuel' | 'end'>('route');
  const [currentOdoInput, setCurrentOdoInput] = useState<number>(92350);
  const [podPhoto, setPodPhoto] = useState<string | null>(null);
  const [podChecking, setPodChecking] = useState(false);
  const [podResult, setPodResult] = useState<{ passed: boolean; distanceM: number } | null>(null);
  const [fuelLitres, setFuelLitres] = useState<number>(30);
  const [fuelAmount, setFuelAmount] = useState<number>(64.5);
  const [toast, setToast] = useState<string | null>(null);

  const activeTrip = trips.find((t) => t.tripId === 'TR-2026-0929') || trips[2] || trips[0];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleStartTrip = () => {
    updateTripOdometer(activeTrip.tripId, currentOdoInput);
    showToast('Trip Started! Morning Odometer 92,350 km locked via Gemini OCR.');
    setStep('route');
  };

  const handleSimulatePOD = () => {
    setPodChecking(true);
    setTimeout(() => {
      setPodChecking(false);
      setPodResult({ passed: true, distanceM: 28 });
      updateDeliveryOrderStatus('do_9042', 'delivered');
      showToast('POD Verified! Customer stamp & receiver signature matched. Geofence: 28m (PASS).');
    }, 900);
  };

  const t = {
    en: {
      title: 'LOHAS Driver Terminal',
      lorry: 'Assigned Lorry',
      startTrip: '1. Morning Dispatch (Odometer Photo)',
      route: '2. Today Waypoint Run',
      pod: '3. Proof of Delivery (Live Camera)',
      fuel: '4. Fuel Refill Entry',
      endTrip: '5. Return Check-in (End Odo)',
      waze: 'Navigate with Waze',
      gmaps: 'Google Maps',
      arrived: 'Mark Arrived',
      delivered: 'Live POD Photo',
    },
    bm: {
      title: 'Terminal Pemandu LOHAS',
      lorry: 'Lori Ditugaskan',
      startTrip: '1. Pelepasan Pagi (Foto Odometer)',
      route: '2. Laluan Penghantaran Hari Ini',
      pod: '3. Bukti Penghantaran (Kamera Langsung)',
      fuel: '4. Log Minyak Diesel',
      endTrip: '5. Tamat Trip (Odo Petang)',
      waze: 'Pandu arah Waze',
      gmaps: 'Google Maps',
      arrived: 'Tiba di Lokasi',
      delivered: 'Foto POD Pelanggan',
    },
    zh: {
      title: 'LOHAS 司机车载终端',
      lorry: '指派货车',
      startTrip: '1. 早间出车里程照 (Gemini识别)',
      route: '2. 今日路线送货清单',
      pod: '3. 现场签收拍照与核验 (POD)',
      fuel: '4. 中途加油报销记录',
      endTrip: '5. 晚间回厂里程打卡',
      waze: '使用 Waze 导航',
      gmaps: '使用谷歌地图',
      arrived: '到达卸货区',
      delivered: '签收单拍照',
    },
  }[lang];

  return (
    <div className="flex flex-col items-center w-full pb-16">
      {/* Toast */}
      {toast && (
        <div className="fixed top-24 z-50 bg-[#313035] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-[#e5e1e8] text-sm animate-fade-in">
          <span className="material-symbols-outlined text-[#0fa42f]">check_circle</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Mobile Shell Mockup Container */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#e5e1e8] overflow-hidden">
        {/* Terminal Header */}
        <div className="bg-[#1c1b20] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#ff7f35] flex items-center justify-center font-bold text-xs">
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
            </div>
            <div>
              <h2 className="font-bold text-sm leading-tight">{t.title}</h2>
              <span className="text-[10px] text-[#ffdbcb] font-mono-data">
                {currentUser?.name || 'Ahmad Razali'} (Lorry 3 · WVC 8821)
              </span>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-[#313035] rounded-full p-0.5 border border-white/10 text-[10px] font-bold">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 rounded-full ${lang === 'en' ? 'bg-[#ff7f35] text-white' : 'text-white/60'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('bm')}
              className={`px-2 py-0.5 rounded-full ${lang === 'bm' ? 'bg-[#ff7f35] text-white' : 'text-white/60'}`}
            >
              BM
            </button>
            <button
              onClick={() => setLang('zh')}
              className={`px-2 py-0.5 rounded-full ${lang === 'zh' ? 'bg-[#ff7f35] text-white' : 'text-white/60'}`}
            >
              中文
            </button>
          </div>
        </div>

        {/* Chilled Temperature Banner */}
        <div className="bg-[#dfe0ff] px-4 py-2 flex items-center justify-between text-[#000d60] text-xs">
          <div className="flex items-center gap-1.5 font-semibold">
            <span className="material-symbols-outlined text-[16px]">ac_unit</span>
            <span>Chiller Telemetry: 3.2°C (Optimal)</span>
          </div>
          <span className="font-mono-data text-[10px] font-bold">GPS: 30s Pings</span>
        </div>

        {/* Step Navigation Pill Bar */}
        <div className="grid grid-cols-4 bg-[#f0ecf3] p-1 border-b border-[#e5e1e8] text-[11px] font-semibold text-center">
          <button
            onClick={() => setStep('start')}
            className={`py-2 rounded-xl transition-all ${step === 'start' ? 'bg-white text-[#1c1b20] shadow-xs' : 'text-[#574238]'}`}
          >
            Start Odo
          </button>
          <button
            onClick={() => setStep('route')}
            className={`py-2 rounded-xl transition-all ${step === 'route' ? 'bg-white text-[#1c1b20] shadow-xs' : 'text-[#574238]'}`}
          >
            Stops
          </button>
          <button
            onClick={() => setStep('pod')}
            className={`py-2 rounded-xl transition-all ${step === 'pod' ? 'bg-white text-[#1c1b20] shadow-xs' : 'text-[#574238]'}`}
          >
            POD Drop
          </button>
          <button
            onClick={() => setStep('end')}
            className={`py-2 rounded-xl transition-all ${step === 'end' ? 'bg-white text-[#1c1b20] shadow-xs' : 'text-[#574238]'}`}
          >
            End Odo
          </button>
        </div>

        {/* Body based on Step */}
        <div className="p-4 space-y-4">
          {/* STEP 1: Morning Odometer */}
          {step === 'start' && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center">
                <span className="text-xs font-label-caps text-[#574238] block mb-1">
                  MANDATORY START TRIP CONTROL
                </span>
                <h3 className="font-bold text-base text-[#1c1b20]">Morning Odometer Capture</h3>
                <p className="text-xs text-[#574238] mt-1">
                  Take a photo of Lorry 3 dashboard before leaving Subang Depot Loading Dock.
                </p>
              </div>

              <div className="relative rounded-2xl overflow-hidden h-48 bg-[#f0ecf3] border-2 border-dashed border-[#1c3ae7] flex flex-col items-center justify-center p-3">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-ptQK2jVXZc8gfr1a8vC8Ef_Ur3uXQ9KdYdLZI-qV_267_e4PmLr-jMlTjLeXZggByhsuvaRVB2OpQV5NsskB7qbgquFzGYSXp8va_YwehFryj1XXpGueESGp5cXOMpQnnmBUDfLaFOF2Eu4Yl3A50Sof6Wr9OvLg9qLxbEsQxEHYVDQw4CRod9WeuBTxgeTrZHQpceire8yPeDz6ylLMGjCsaKY_xPERrkedpcCBgmpYWil1FOdrrA"
                  alt="Odometer preview"
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white font-mono-data text-xs px-2.5 py-1 rounded-full font-bold">
                  Gemini OCR: 92,350 km
                </div>
              </div>

              <div>
                <label className="text-[11px] font-label-caps text-[#574238] block mb-1">
                  CONFIRM ODOMETER READING (KM)
                </label>
                <input
                  type="number"
                  value={currentOdoInput}
                  onChange={(e) => setCurrentOdoInput(Number(e.target.value))}
                  className="w-full py-3 px-4 rounded-2xl bg-[#f6f2f9] border border-[#e5e1e8] font-mono-data text-lg font-bold text-center text-[#1c1b20]"
                />
              </div>

              <button
                onClick={handleStartTrip}
                className="w-full py-3 rounded-full bg-[#1c3ae7] hover:bg-[#3f58ff] text-white font-bold text-sm shadow-md active:scale-95"
              >
                Confirm & Lock Start Odometer
              </button>
            </div>
          )}

          {/* STEP 2: Ordered Stops */}
          {step === 'route' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0ecf3]">
                <div>
                  <h3 className="font-bold text-sm text-[#1c1b20]">Trip Manifest #TR-2026-0929</h3>
                  <span className="text-[11px] text-[#574238]">4 Consignments · 62.4 km planned</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full font-label-caps text-[10px] bg-[#dfe0ff] text-[#000d60] font-bold">
                  ACTIVE
                </span>
              </div>

              {/* Stop 1 */}
              <div className="p-3 rounded-2xl bg-[#f6f2f9] border border-[#e5e1e8] space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1c3ae7] text-white flex items-center justify-center font-mono-data text-xs font-bold">
                      1
                    </span>
                    <div>
                      <div className="font-bold text-sm text-[#1c1b20]">Jaya Grocer · Empire Subang</div>
                      <span className="text-[11px] text-[#574238]">DO-9042 · 20 bags Organic Brown Rice</span>
                    </div>
                  </div>
                  <span className="font-mono-data text-xs font-bold text-[#1c3ae7]">47500</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#574238]">
                  <span>Window: 11:00 AM - 1:00 PM</span>
                  <span className="text-[#0fa42f] font-semibold">ETA: 11:15 AM (On-time)</span>
                </div>

                {/* Deep Navigation Links */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href="https://waze.com/ul?q=Empire+Shopping+Gallery+Subang"
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 rounded-xl bg-[#00d0ff]/20 text-[#006080] font-bold text-xs flex items-center justify-center gap-1 hover:bg-[#00d0ff]/30"
                  >
                    <span className="material-symbols-outlined text-[16px]">navigation</span>
                    <span>{t.waze}</span>
                  </a>
                  <a
                    href="https://maps.google.com/?q=Empire+Shopping+Gallery+Subang"
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 rounded-xl bg-[#4285f4]/20 text-[#1a73e8] font-bold text-xs flex items-center justify-center gap-1 hover:bg-[#4285f4]/30"
                  >
                    <span className="material-symbols-outlined text-[16px]">map</span>
                    <span>{t.gmaps}</span>
                  </a>
                </div>

                <button
                  onClick={() => setStep('pod')}
                  className="w-full py-2.5 rounded-xl bg-[#ff7f35] text-white text-xs font-bold flex items-center justify-center gap-1 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                  <span>Arrived & Capture POD Photo</span>
                </button>
              </div>

              {/* Stop 2 */}
              <div className="p-3 rounded-2xl bg-white border border-[#e5e1e8] space-y-1">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#f0ecf3] text-[#574238] flex items-center justify-center font-mono-data text-xs font-bold">
                      2
                    </span>
                    <div>
                      <div className="font-semibold text-xs text-[#1c1b20]">Village Grocer · Citta Mall</div>
                      <span className="text-[10px] text-[#574238]">DO-9041 · 14 ctns Cucumbers & Bok Choy</span>
                    </div>
                  </div>
                  <span className="font-mono-data text-xs text-[#574238]">47301</span>
                </div>
                <div className="text-[10px] text-[#574238] flex justify-between">
                  <span>Window: 10:00 - 12:00 PM</span>
                  <span className="text-[#9f4200]">ETA 12:05 PM (+5m delay risk)</span>
                </div>
              </div>

              {/* Stop 3 */}
              <div className="p-3 rounded-2xl bg-white border border-[#e5e1e8] space-y-1">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#f0ecf3] text-[#574238] flex items-center justify-center font-mono-data text-xs font-bold">
                      3
                    </span>
                    <div>
                      <div className="font-semibold text-xs text-[#1c1b20]">Qra · Arcoris Mont Kiara</div>
                      <span className="text-[10px] text-[#574238]">DO-9043 · 8 boxes Kale & Microgreens</span>
                    </div>
                  </div>
                  <span className="font-mono-data text-xs text-[#574238]">50480</span>
                </div>
                <div className="text-[10px] text-[#574238] flex justify-between">
                  <span>Window: 01:30 - 03:00 PM</span>
                  <span className="text-[#0fa42f]">ETA 01:45 PM (On-time)</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Proof of Delivery (POD) */}
          {step === 'pod' && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center">
                <span className="text-xs font-label-caps text-[#574238] block mb-1">
                  CUSTOMER HANDOVER VERIFICATION
                </span>
                <h3 className="font-bold text-base text-[#1c1b20]">Proof of Delivery (DO-9042)</h3>
                <p className="text-xs text-[#574238] mt-0.5">
                  Jaya Grocer Empire Subang (Postcode 47500)
                </p>
              </div>

              {/* Camera Simulator */}
              <div className="relative rounded-2xl overflow-hidden h-52 bg-black border border-[#e5e1e8] flex items-center justify-center">
                <img
                  src={
                    podPhoto ||
                    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'
                  }
                  alt="Customer DO signed"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-[#0fa42f] text-white px-2 py-0.5 rounded-full font-mono-data text-[10px] font-bold">
                  Geofence Pinpoint: 28m OK
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#f6f2f9] border border-[#e5e1e8] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#574238]">
                  <span>Consignment:</span>
                  <span className="font-mono-data font-bold text-[#1c1b20]">DO-9042 (20 bags Brown Rice)</span>
                </div>
                <div className="flex justify-between text-[#574238]">
                  <span>Receiver Name:</span>
                  <span className="font-semibold text-[#1c1b20]">Kelvin (Receiving Dept)</span>
                </div>
                <div className="flex justify-between text-[#574238]">
                  <span>Chilled Box Seal:</span>
                  <span className="text-[#0fa42f] font-semibold">Intact & Passed</span>
                </div>
              </div>

              <button
                onClick={handleSimulatePOD}
                disabled={podChecking}
                className="w-full py-3 rounded-full bg-[#0fa42f] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {podChecking ? 'sync' : 'verified'}
                </span>
                <span>{podChecking ? 'Verifying AI Signature & Stamp...' : 'Verify POD & Complete Drop'}</span>
              </button>

              <button
                onClick={() => setStep('route')}
                className="w-full py-2 rounded-full border border-[#e5e1e8] text-xs font-semibold text-[#574238]"
              >
                Back to Stops List
              </button>
            </div>
          )}

          {/* STEP 4: End Trip Odometer */}
          {step === 'end' && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center">
                <span className="text-xs font-label-caps text-[#574238] block mb-1">
                  DEPOT RETURN CHECK-IN
                </span>
                <h3 className="font-bold text-base text-[#1c1b20]">End Trip & Odometer Audit</h3>
                <p className="text-xs text-[#574238] mt-1">
                  Photograph evening odometer at Subang Central DC bay before key handover.
                </p>
              </div>

              <div className="relative rounded-2xl overflow-hidden h-44 bg-[#f0ecf3] border-2 border-dashed border-[#1c3ae7] flex flex-col items-center justify-center p-3">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAntJfkFjibXQkihB-fGi_F0DJJz4PSX_QCR4eM3cTcFSAsS-DDuPFjkQpWV0fDUYjv5IU_QVd4d5ej8qdGJp1R5iBCAleEicqN-qOxgTqvRucnzRqG5PB-vRupXhS6GU_BP8q0leR2yL0atUMI7v7OOq5ZXstQfP1sjlzJ_qsuQr_xZjjJdyl8ZmWFgOMdGw8YMOlI5qyp53mFqW_HjiuxavLup6BGC9_2xYzm9IqSGCZFin3gMinAIw"
                  alt="End odometer"
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white font-mono-data text-xs px-2.5 py-1 rounded-full font-bold">
                  Gemini OCR: 92,414 km
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#dfe0ff] text-[#000d60] text-xs space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Start Odo: 92,350 km</span>
                  <span>End Odo: 92,414 km</span>
                </div>
                <div className="flex justify-between font-mono-data font-bold">
                  <span>Delta: 64.0 km</span>
                  <span>Snapped GPS: 62.4 km (Variance: +2.5%)</span>
                </div>
                <span className="text-[10px] text-[#000d60] block pt-1">
                  ✓ Within Malaysian Fleet 10% threshold. Auto-cleared for finance reimbursement!
                </span>
              </div>

              <button
                onClick={() => {
                  updateTripOdometer(activeTrip.tripId, 92350, 92414);
                  showToast('Trip #TR-2026-0929 Completed! Manifest logged to Finance Audit Queue.');
                  setStep('route');
                }}
                className="w-full py-3 rounded-full bg-[#1c3ae7] text-white font-bold text-sm shadow-md active:scale-95"
              >
                Submit End Trip Manifest
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
