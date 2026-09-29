import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const LiveFleetGpsView: React.FC = () => {
  const { vehicles } = useApp();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[1].id);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[1];

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-caps text-[10px] bg-[#dfe0ff] text-[#000d60] font-bold">
              MODULE M5 · TELEMATICS RADAR
            </span>
            <span className="font-mono-data text-xs text-[#574238]">SNAPPED ROADS API · 30S LOGGING</span>
          </div>
          <h1 className="text-[32px] text-[#1c1b20] font-bold tracking-tight font-sans">
            Live Fleet & GPS Monitoring
          </h1>
          <p className="text-[13px] text-[#574238]">
            Real-time telemetry pings, continuous odometer tracking, and cold-chain thermal stability across Klang Valley.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-full border border-[#e5e1e8] shadow-xs text-xs">
            <span className="w-2 h-2 rounded-full bg-[#0fa42f] animate-pulse"></span>
            <span className="font-semibold text-[#1c1b20]">8/8 Lorries Transmitting</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Map & Telematics Inspection (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#e5e1e8] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1c1b20]">Klang Valley Satellite Corridor</h3>
                <span className="text-xs text-[#574238]">Quectel 4G LTE Encrypted Tunnel</span>
              </div>
              <span className="font-mono-data text-xs bg-[#f0ecf3] text-[#1c1b20] px-3 py-1 rounded-full font-semibold">
                Telemetry Ping: 2s ago
              </span>
            </div>

            {/* Simulated Satellite Map */}
            <div className="relative w-full h-96 rounded-2xl overflow-hidden bg-black border border-[#e5e1e8]">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBmA728QnnaYPxQFpboucfJIQVdQ3d94PnE1ujuGjCp_NCrmZkqYUg68irnpUkJSgRJLY1qkolg3tMGD6dfDzHQW4-SNwPMg72frsMdaxKe9kuwS2sd8hSqh8mxe0QUKOA5q6jUGGNCvSF0EVOWBbUZwfm6klvDOscC7852jmAN_bQu7E5XCOgF3q8WglLSjpH3nVfnKolA7kdRFBNkm4b1mEZRbft-BsXGj4jBZ0MX_o_hnwkWY3eLqA')`,
                }}
              ></div>

              {/* Pins for Lorries */}
              <div className="absolute top-1/4 left-1/4 bg-[#1c3ae7] text-white p-2 rounded-xl text-xs font-bold shadow-xl border border-white flex items-center gap-1.5 animate-bounce">
                <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                <span>Lorry 2 (BQU 4109)</span>
              </div>

              <div className="absolute top-1/2 right-1/3 bg-[#313035] text-white p-2 rounded-xl text-xs font-bold shadow-xl border border-white/20 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                <span>Lorry 3 (WVC 8821)</span>
              </div>

              <div className="absolute bottom-1/4 left-1/2 bg-[#313035] text-white p-2 rounded-xl text-xs font-bold shadow-xl border border-white/20 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                <span>Lorry 5 (VDA 9022)</span>
              </div>
            </div>

            {/* Selected Vehicle Diagnostic Bar */}
            <div className="p-4 rounded-2xl bg-[#f6f2f9] border border-[#e5e1e8] grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <span className="text-[10px] font-label-caps text-[#574238] block">VEHICLE & DRIVER</span>
                <span className="font-bold text-sm text-[#1c1b20]">{selectedVehicle.name} ({selectedVehicle.plateNo})</span>
                <span className="text-xs text-[#574238] block">{selectedVehicle.currentDriver}</span>
              </div>
              <div>
                <span className="text-[10px] font-label-caps text-[#574238] block">CURRENT ODOMETER</span>
                <span className="font-mono-data font-bold text-sm text-[#1c1b20]">
                  {selectedVehicle.currentOdometerKm.toLocaleString()} km
                </span>
                <span className="text-xs text-[#0fa42f] block">Continuity Verified</span>
              </div>
              <div>
                <span className="text-[10px] font-label-caps text-[#574238] block">CHILLER THERMAL TEMP</span>
                <span className="font-mono-data font-bold text-sm text-[#1c3ae7]">
                  {selectedVehicle.chillerTemp}
                </span>
                <span className="text-xs text-[#1c3ae7] block">Within 2-4°C SLA</span>
              </div>
              <div>
                <span className="text-[10px] font-label-caps text-[#574238] block">CORRIDOR LOCATION</span>
                <span className="text-xs font-semibold text-[#1c1b20] block">{selectedVehicle.currentLocation}</span>
                <span className="text-[11px] text-[#574238]">Active Cellular Lock</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Fleet Inventory List (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-[#e5e1e8] flex flex-col gap-3">
            <h3 className="font-bold text-sm text-[#1c1b20]">Fleet Assets ({vehicles.length} Lorries)</h3>
            <div className="space-y-2">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicleId(v.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    v.id === selectedVehicleId
                      ? 'bg-[#dfe0ff]/50 border-[#1c3ae7] shadow-xs'
                      : 'bg-[#f6f2f9] border-[#e5e1e8] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#1c1b20]">{v.name} ({v.plateNo})</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#dfe0ff] text-[#000d60]">
                      {v.chillerTemp}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#574238] mt-1">{v.type} · Driver: {v.currentDriver}</div>
                  <div className="flex items-center justify-between text-[10px] font-mono-data text-[#574238] mt-1">
                    <span>Odo: {v.currentOdometerKm.toLocaleString()} km</span>
                    <span className="text-[#0fa42f]">Normal</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
