import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const { loginWithGoogle, switchUserRole, usersList, currentUser, isApproved, adminSlot, setShowAdminModal } = useApp();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await loginWithGoogle();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Google sign-in was cancelled or encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  // If user is logged in but pending approval
  if (currentUser && !isApproved) {
    return (
      <div className="fixed inset-0 bg-[#fcf8ff] z-[100] flex flex-col items-center justify-center p-6">
        <div className="bg-white max-w-md w-full rounded-3xl p-8 shadow-2xl border border-[#e5e1e8] text-center">
          <div className="w-16 h-16 rounded-full bg-[#ffdbcb] text-[#9f4200] flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px]">hourglass_top</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1c1b20]">Account Pending Approval</h2>
          <p className="text-sm text-[#574238] mt-2 leading-relaxed">
            Welcome to <strong>LOHAS Fleet</strong>, {currentUser.name}! Your account has been registered with status{' '}
            <span className="font-bold text-[#ba1a1a]">Pending</span>.
          </p>
          <div className="my-5 p-4 rounded-2xl bg-[#f6f2f9] text-left text-xs border border-[#e5e1e8] space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#574238]">Email:</span>
              <span className="font-mono-data font-semibold text-[#1c1b20]">{currentUser.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#574238]">Requested Role:</span>
              <span className="font-semibold capitalize text-[#1c1b20]">{currentUser.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#574238]">Hub:</span>
              <span className="font-semibold text-[#1c1b20]">Klang Valley DC</span>
            </div>
          </div>
          <p className="text-xs text-[#574238]">
            An operational administrator (<strong>William Soon</strong>) must approve your role before you can access dispatch manifests, routes, and financial audit logs.
          </p>

          <div className="mt-6 pt-4 border-t border-[#f0ecf3] space-y-3">
            <button
              onClick={() => switchUserRole('user_owner_william')}
              className="w-full py-2.5 px-4 rounded-full bg-[#9f4200] text-white text-xs font-semibold hover:opacity-95 transition-all"
            >
              Log in as William Soon (Owner to Approve)
            </button>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-[#1c3ae7] font-semibold hover:underline block mx-auto"
            >
              Refresh Status
            </button>
          </div>
        </div>

        {/* Footer Admin Link */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAdminModal(true)}
            className="inline-flex items-center gap-1.5 text-xs text-[#574238] hover:text-[#1c1b20] font-semibold bg-white/80 border border-[#e5e1e8] px-4 py-2 rounded-full shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px] text-[#9f4200]">
              {adminSlot.isClaimed ? 'lock' : 'lock_open'}
            </span>
            <span>
              {adminSlot.isClaimed ? 'Master Admin Login (Footer Link)' : 'Admin Sign Up (1 Slot Open)'}
            </span>
          </button>
        </div>
      </div>
    );
  }

  // If no user is logged in
  if (!currentUser) {
    return (
      <div className="fixed inset-0 bg-[#fcf8ff]/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-6">
        <div className="bg-white max-w-lg w-full rounded-3xl p-8 shadow-2xl border border-[#e5e1e8]">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-[#ff7f35] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <span className="material-symbols-outlined text-[28px]">local_shipping</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ffdbcb] text-[#341100] mb-1">
              ORGANIC FOOD WHOLESALE MALAYSIA
            </div>
            <h1 className="text-2xl font-bold text-[#1c1b20]">LOHAS Fleet Portal</h1>
            <p className="text-xs text-[#574238] mt-1">
              Autonomous Geocoded Dispatch & Real-Time Mileage Odometer Audit
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-[#ffdad6] text-[#93000a] text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Real Google Auth */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 rounded-full bg-[#1c3ae7] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#3f58ff] transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.344-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
            </svg>
            <span>{loading ? 'Connecting Google Account...' : 'Sign In with Google'}</span>
          </button>

          {/* Quick Demo Role Picker */}
          <div className="mt-6 pt-5 border-t border-[#f0ecf3]">
            <div className="text-center font-label-caps text-[10px] text-[#574238] mb-3">
              OR QUICK TEST ANY OF THE 3 ROLES
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              <button
                onClick={() => switchUserRole('user_owner_william')}
                className="p-2.5 rounded-2xl bg-[#f6f2f9] hover:bg-[#ffdbcb]/60 border border-[#e5e1e8] transition-colors"
              >
                <div className="text-xs font-bold text-[#1c1b20]">William Soon</div>
                <div className="text-[10px] text-[#9f4200] font-semibold">Owner / Level 3 Approver</div>
              </button>
              <button
                onClick={() => switchUserRole('user_mgmt_adeline')}
                className="p-2.5 rounded-2xl bg-[#f6f2f9] hover:bg-[#dfe0ff]/60 border border-[#e5e1e8] transition-colors"
              >
                <div className="text-xs font-bold text-[#1c1b20]">Adeline Tan</div>
                <div className="text-[10px] text-[#1c3ae7] font-semibold">Management · Finance</div>
              </button>
              <button
                onClick={() => switchUserRole('user_mgmt_hazim')}
                className="p-2.5 rounded-2xl bg-[#f6f2f9] hover:bg-[#f0ecf3] border border-[#e5e1e8] transition-colors"
              >
                <div className="text-xs font-bold text-[#1c1b20]">Hazim bin Zulkifli</div>
                <div className="text-[10px] text-[#574238] font-semibold">Management · Ops</div>
              </button>
              <button
                onClick={() => switchUserRole('user_driver_ahmad')}
                className="p-2.5 rounded-2xl bg-[#f6f2f9] hover:bg-[#dfe0ff]/60 border border-[#e5e1e8] transition-colors"
              >
                <div className="text-xs font-bold text-[#1c1b20]">Ahmad Razali</div>
                <div className="text-[10px] text-[#1c3ae7] font-semibold">Logistic Man · Driver (Lorry 3)</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Admin Link (Strictly placed in the footer per user request) */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAdminModal(true)}
            className="inline-flex items-center gap-2 text-xs text-[#574238] hover:text-[#1c1b20] font-semibold bg-white/90 border border-[#e5e1e8] px-4 py-2 rounded-full shadow-xs hover:border-[#1c3ae7] transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-[#9f4200]">
              {adminSlot.isClaimed ? 'lock' : 'lock_open'}
            </span>
            <span>
              {adminSlot.isClaimed ? 'Master Admin Login (Footer Link)' : 'Admin Sign Up (1 Slot Open)'}
            </span>
            {adminSlot.isClaimed ? (
              <span className="font-mono-data text-[10px] px-2 py-0.5 rounded-full bg-[#dfe0ff] text-[#000d60] font-bold">
                Claimed
              </span>
            ) : (
              <span className="font-mono-data text-[10px] px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] font-bold">
                1 Slot Available
              </span>
            )}
          </button>
        </div>
      </div>
    );
  }

  return null;
};
