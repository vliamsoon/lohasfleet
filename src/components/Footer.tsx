import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { adminSlot, setShowAdminModal } = useApp();

  return (
    <footer className="w-full mt-12 py-6 border-t border-[#e5e1e8] bg-[#f6f2f9]/70 rounded-3xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#574238]">
      {/* Brand & Hub Info */}
      <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
        <div className="flex items-center gap-1.5 font-bold text-[#1c1b20]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff7f35]"></span>
          <span>LOHAS Fleet</span>
          <span className="text-[10px] px-2 py-0.2 bg-[#ffdbcb] text-[#341100] rounded-full font-label-caps">
            MALAYSIA
          </span>
        </div>
        <span className="hidden sm:inline text-[#e5e1e8]">|</span>
        <span>Klang Valley DC (Hub ID: MY-SGR-01)</span>
        <span className="hidden sm:inline text-[#e5e1e8]">|</span>
        <span>Central Cold-Chain Chiller Telemetry 2-4°C</span>
      </div>

      {/* Admin Link (Strictly placed in Footer per user specification) */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowAdminModal(true)}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#313035] hover:text-white border border-[#e5e1e8] text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px] text-[#9f4200] group-hover:text-[#ff7f35]">
            {adminSlot.isClaimed ? 'lock' : 'lock_open'}
          </span>
          <span className="text-[#1c1b20] group-hover:text-white">
            {adminSlot.isClaimed ? 'System Admin Login' : 'Admin Sign Up (1 Slot Open)'}
          </span>
          {adminSlot.isClaimed ? (
            <span className="font-mono-data text-[10px] px-2 py-0.5 rounded-full bg-[#dfe0ff] text-[#000d60] font-bold group-hover:bg-white group-hover:text-[#313035]">
              Slot Claimed
            </span>
          ) : (
            <span className="font-mono-data text-[10px] px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] font-bold animate-pulse">
              Single Slot Available
            </span>
          )}
        </button>

        <span className="text-[11px] text-[#574238] font-mono-data hidden xl:inline">
          v3.4-prod
        </span>
      </div>
    </footer>
  );
};
