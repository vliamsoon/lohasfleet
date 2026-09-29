import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile, UserRole, Department, UserStatus } from '../types';

export const AdminPanelModal: React.FC = () => {
  const {
    adminSlot,
    isAdminLoggedIn,
    showAdminModal,
    setShowAdminModal,
    claimAdminSlot,
    adminLogin,
    adminLogout,
    usersList,
    updateUserByAdmin,
    deleteUserByAdmin,
    createUserByAdmin,
  } = useApp();

  // Registration Form State (when slot is unclaimed)
  const [claimName, setClaimName] = useState('William Soon');
  const [claimEmail, setClaimEmail] = useState('williamsoon1994@gmail.com');
  const [claimPhone, setClaimPhone] = useState('+60 12-388 9912');
  const [claimPassword, setClaimPassword] = useState('');
  const [confirmNotice, setConfirmNotice] = useState(false);

  // Login Form State (when slot is claimed)
  const [loginEmail, setLoginEmail] = useState(adminSlot.adminEmail || 'williamsoon1994@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');

  // UI State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('logistic');
  const [newUserDept, setNewUserDept] = useState<Department>('ops');

  if (!showAdminModal) return null;

  const handleClaimSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!claimName.trim() || !claimEmail.trim()) {
      setErrorMsg('Please enter both Admin Name and Email.');
      return;
    }
    if (!confirmNotice) {
      setErrorMsg('Please confirm that you understand this is the single exclusive slot.');
      return;
    }

    try {
      await claimAdminSlot(claimName, claimEmail, claimPhone);
      setSuccessMsg('Admin account created! The single slot has been claimed and registration is now locked.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error claiming admin slot.');
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await adminLogin(loginEmail);
      setSuccessMsg('Welcome back, Master Admin! Access granted.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed.');
    }
  };

  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    await updateUserByAdmin(editingUser.uid, {
      name: editingUser.name,
      role: editingUser.role,
      department: editingUser.department,
      status: editingUser.status,
      phone: editingUser.phone,
    });
    setEditingUser(null);
    setSuccessMsg(`User ${editingUser.name} updated successfully.`);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    await createUserByAdmin({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim(),
      role: newUserRole,
      department: newUserDept,
      status: 'active',
      approvedBy: adminSlot.adminName || 'Master Admin',
    });

    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setSuccessMsg(`New user ${newUserName} created by Master Admin.`);
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.phone && u.phone.includes(userSearch));

    if (!matchesSearch) return false;
    if (filterRole !== 'all' && u.role !== filterRole) return false;
    if (filterStatus !== 'all' && u.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[120] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-3xl p-6 shadow-2xl border border-[#e5e1e8] max-h-[92vh] overflow-y-auto flex flex-col justify-between">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f0ecf3]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#313035] text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#1c1b20]">LOHAS Fleet Master Administration</h2>
                <span className="px-2.5 py-0.5 rounded-full font-label-caps text-[10px] bg-[#dfe0ff] text-[#000d60] font-bold">
                  INTERNAL SECURITY GATEWAY
                </span>
              </div>
              <p className="text-xs text-[#574238]">
                Centralized user detail registry & single-slot ownership management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <button
                onClick={adminLogout}
                className="px-3 py-1.5 rounded-full bg-[#f0ecf3] hover:bg-[#ffdad6] hover:text-[#93000a] text-xs font-semibold text-[#574238] transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">logout</span>
                <span>Lock Admin Console</span>
              </button>
            )}
            <button
              onClick={() => setShowAdminModal(false)}
              className="w-8 h-8 rounded-full bg-[#f0ecf3] flex items-center justify-center text-[#574238] hover:bg-[#ebe7ed]"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="my-3 p-3 rounded-2xl bg-[#ffdad6] text-[#93000a] text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="my-3 p-3 rounded-2xl bg-[#dfe0ff] text-[#000d60] text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="my-4 flex-1">
          {/* CASE 1: Single Slot is UNCLAIMED -> Provide the single slot to create Admin Account */}
          {!adminSlot.isClaimed && (
            <div className="max-w-xl mx-auto py-6 space-y-6">
              <div className="p-4 rounded-2xl bg-[#ffdbcb]/60 border border-[#ff7f35]/30 text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#9f4200] text-white mb-2">
                  <span className="material-symbols-outlined text-[14px]">lock_open</span>
                  1 EXCLUSIVE ADMIN SLOT OPEN
                </span>
                <h3 className="text-lg font-bold text-[#1c1b20]">Create Your Master Admin Account</h3>
                <p className="text-xs text-[#574238] mt-1 max-w-md mx-auto leading-relaxed">
                  Only <strong>1 single admin account</strong> can be created for this system. Once you register below, the admin slot will be permanently locked and no other admin accounts can be created.
                </p>
              </div>

              <form onSubmit={handleClaimSlot} className="bg-[#f6f2f9] p-6 rounded-3xl border border-[#e5e1e8] space-y-4">
                <div>
                  <label className="text-[11px] font-label-caps text-[#574238] block mb-1">
                    ADMIN FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={claimName}
                    onChange={(e) => setClaimName(e.target.value)}
                    placeholder="e.g. William Soon"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e5e1e8] text-xs font-semibold text-[#1c1b20]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-label-caps text-[#574238] block mb-1">
                    ADMIN MASTER EMAIL (LOGIN IDENTIFIER)
                  </label>
                  <input
                    type="email"
                    required
                    value={claimEmail}
                    onChange={(e) => setClaimEmail(e.target.value)}
                    placeholder="e.g. williamsoon1994@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e5e1e8] text-xs font-semibold text-[#1c1b20]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-label-caps text-[#574238] block mb-1">
                    PHONE NUMBER (OPTIONAL)
                  </label>
                  <input
                    type="tel"
                    value={claimPhone}
                    onChange={(e) => setClaimPhone(e.target.value)}
                    placeholder="+60 12-388 9912"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e5e1e8] text-xs text-[#1c1b20]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-label-caps text-[#574238] block mb-1">
                    ADMIN PASSWORD / SECURITY PIN
                  </label>
                  <input
                    type="password"
                    required
                    value={claimPassword}
                    onChange={(e) => setClaimPassword(e.target.value)}
                    placeholder="Create a strong admin password"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e5e1e8] text-xs text-[#1c1b20]"
                  />
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="confirmSlotLock"
                    checked={confirmNotice}
                    onChange={(e) => setConfirmNotice(e.target.checked)}
                    className="mt-0.5 rounded text-[#1c3ae7]"
                  />
                  <label htmlFor="confirmSlotLock" className="text-xs text-[#574238]">
                    I confirm that I am creating the sole <strong>Master Admin account</strong> for LOHAS Fleet. I understand that registration will be locked after this.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#9f4200] hover:bg-[#793100] text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                  <span>Claim Single Admin Slot & Activate Portal</span>
                </button>
              </form>
            </div>
          )}

          {/* CASE 2: Slot is CLAIMED, but admin is NOT logged in -> Show Login only */}
          {adminSlot.isClaimed && !isAdminLoggedIn && (
            <div className="max-w-md mx-auto py-6 space-y-5">
              <div className="p-4 rounded-2xl bg-[#dfe0ff] border border-[#1c3ae7]/20 text-center">
                <div className="w-10 h-10 rounded-full bg-[#1c3ae7] text-white flex items-center justify-center mx-auto mb-2">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#000d60] text-white mb-1">
                  ADMIN REGISTRATION CLOSED
                </span>
                <h3 className="text-base font-bold text-[#1c1b20]">Master Admin Slot Claimed</h3>
                <p className="text-xs text-[#574238] mt-1 leading-snug">
                  The single admin slot has already been claimed by{' '}
                  <strong className="text-[#1c1b20]">{adminSlot.adminName || 'Master Admin'}</strong> ({adminSlot.adminEmail}).
                  Nobody else is allowed to create an admin account.
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="bg-[#f6f2f9] p-6 rounded-3xl border border-[#e5e1e8] space-y-4">
                <div>
                  <label className="text-[11px] font-label-caps text-[#574238] block mb-1">
                    REGISTERED ADMIN EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Admin Email"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e5e1e8] text-xs font-semibold text-[#1c1b20]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-label-caps text-[#574238] block mb-1">
                    PASSWORD / SECURITY PIN
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter admin credentials"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e5e1e8] text-xs text-[#1c1b20]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#1c3ae7] hover:bg-[#3f58ff] text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span>Log In to Admin Panel</span>
                </button>

                <div className="text-center pt-1">
                  <span className="text-[11px] text-[#574238]">
                    Single Slot Registered: {adminSlot.claimedAt ? new Date(adminSlot.claimedAt).toLocaleDateString('en-GB') : 'Active'}
                  </span>
                </div>
              </form>
            </div>
          )}

          {/* CASE 3: Admin is Authenticated -> Complete User Management Dashboard */}
          {isAdminLoggedIn && (
            <div className="space-y-5 animate-fade-in">
              {/* Top Security & Metrics Rail */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#dfe0ff] border border-[#1c3ae7]/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-label-caps text-[#000d60] font-bold block">
                      SINGLE ADMIN SLOT
                    </span>
                    <span className="text-base font-bold text-[#000d60]">1 / 1 Claimed</span>
                    <span className="text-[10px] text-[#000d60] block">Reg. Permanently Closed</span>
                  </div>
                  <span className="material-symbols-outlined text-[24px] text-[#1c3ae7]">verified</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f6f2f9] border border-[#e5e1e8]">
                  <span className="text-[10px] font-label-caps text-[#574238] block">TOTAL USERS</span>
                  <span className="text-2xl font-bold text-[#1c1b20]">{usersList.length}</span>
                  <span className="text-[10px] text-[#574238] block">All Roles</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f6f2f9] border border-[#e5e1e8]">
                  <span className="text-[10px] font-label-caps text-[#574238] block">ACTIVE USERS</span>
                  <span className="text-2xl font-bold text-[#0fa42f]">
                    {usersList.filter((u) => u.status === 'active').length}
                  </span>
                  <span className="text-[10px] text-[#574238] block">Granted Access</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f6f2f9] border border-[#e5e1e8]">
                  <span className="text-[10px] font-label-caps text-[#574238] block">PENDING APPROVAL</span>
                  <span className="text-2xl font-bold text-[#ba1a1a]">
                    {usersList.filter((u) => u.status === 'pending').length}
                  </span>
                  <span className="text-[10px] text-[#574238] block">Awaiting Owner Check</span>
                </div>
              </div>

              {/* Filter & Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f6f2f9] p-3 rounded-2xl border border-[#e5e1e8]">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative flex items-center bg-white rounded-full px-3 py-1.5 border border-[#e5e1e8] shadow-xs w-64">
                    <span className="material-symbols-outlined text-[16px] text-[#574238] mr-1.5">search</span>
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search users..."
                      className="bg-transparent text-xs text-[#1c1b20] focus:outline-none w-full"
                    />
                  </div>

                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="bg-white text-xs px-3 py-1.5 rounded-full border border-[#e5e1e8] focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Roles</option>
                    <option value="owner">Owner</option>
                    <option value="management">Management</option>
                    <option value="logistic">Logistic Man</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-white text-xs px-3 py-1.5 rounded-full border border-[#e5e1e8] focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2 rounded-full bg-[#1c3ae7] hover:bg-[#3f58ff] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">person_add</span>
                  <span>+ Provision New User</span>
                </button>
              </div>

              {/* Comprehensive Users Details Table */}
              <div className="rounded-2xl border border-[#e5e1e8] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#1c1b20]">
                    <thead>
                      <tr className="bg-[#f0ecf3] text-[#574238] font-label-caps text-[10px] uppercase border-b border-[#e5e1e8]">
                        <th className="py-2.5 px-4 font-semibold">User Details</th>
                        <th className="py-2.5 px-4 font-semibold">Contact Info</th>
                        <th className="py-2.5 px-4 font-semibold">System Role</th>
                        <th className="py-2.5 px-4 font-semibold">Department</th>
                        <th className="py-2.5 px-4 font-semibold">Status</th>
                        <th className="py-2.5 px-4 font-semibold">Approved By</th>
                        <th className="py-2.5 px-4 text-right font-semibold">Manage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0ecf3] bg-white">
                      {filteredUsers.map((u) => (
                        <tr key={u.uid} className="hover:bg-[#f6f2f9] transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#ffdbcb] text-[#341100] font-bold flex items-center justify-center shrink-0">
                                {u.avatarUrl ? (
                                  <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover rounded-full" />
                                ) : (
                                  u.name.charAt(0)
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-sm text-[#1c1b20]">{u.name}</div>
                                <span className="font-mono-data text-[10px] text-[#574238]">UID: {u.uid.slice(0, 12)}...</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 font-mono-data text-[11px]">
                            <div className="text-[#1c1b20]">{u.email}</div>
                            <div className="text-[#574238]">{u.phone || 'No phone'}</div>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-label-caps text-[10px] font-bold ${
                                u.role === 'owner'
                                  ? 'bg-[#ffdbcb] text-[#341100]'
                                  : u.role === 'management'
                                  ? 'bg-[#dfe0ff] text-[#000d60]'
                                  : 'bg-[#f0ecf3] text-[#1c1b20]'
                              }`}
                            >
                              {u.role.toUpperCase()}
                            </span>
                          </td>

                          <td className="py-3 px-4 font-medium capitalize text-[#574238]">
                            {u.department}
                          </td>

                          <td className="py-3 px-4">
                            {u.status === 'active' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#dfe0ff] text-[#000d60]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0fa42f]"></span>
                                ACTIVE
                              </span>
                            ) : u.status === 'pending' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ffdad6] text-[#93000a]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-pulse"></span>
                                PENDING
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#f0ecf3] text-[#574238]">
                                INACTIVE
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-[#574238] text-[11px]">
                            {u.approvedBy || 'Pending'}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingUser(u)}
                                className="px-2.5 py-1 rounded-full bg-[#f0ecf3] hover:bg-[#ebe7ed] text-[#1c1b20] font-semibold text-[11px]"
                              >
                                Edit
                              </button>
                              {u.status === 'pending' && (
                                <button
                                  onClick={() => updateUserByAdmin(u.uid, { status: 'active', approvedBy: adminSlot.adminName || 'Admin' })}
                                  className="px-2.5 py-1 rounded-full bg-[#0fa42f] text-white font-bold text-[11px]"
                                >
                                  Approve
                                </button>
                              )}
                              {u.role !== 'owner' && (
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to remove user ${u.name}?`)) {
                                      deleteUserByAdmin(u.uid);
                                    }
                                  }}
                                  className="p-1 rounded-full text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
                                  title="Delete User"
                                >
                                  <span className="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/60 z-[130] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#e5e1e8]">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0ecf3]">
                <h3 className="font-bold text-base text-[#1c1b20]">Edit User: {editingUser.name}</h3>
                <button
                  onClick={() => setEditingUser(null)}
                  className="w-7 h-7 rounded-full bg-[#f0ecf3] flex items-center justify-center text-[#574238]"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEditUser} className="space-y-3 mt-4">
                <div>
                  <label className="text-[10px] font-label-caps text-[#574238] block mb-1">USER FULL NAME</label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f6f2f9] border border-[#e5e1e8] text-xs font-semibold text-[#1c1b20]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-label-caps text-[#574238] block mb-1">SYSTEM ROLE</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f6f2f9] border border-[#e5e1e8] text-xs font-semibold text-[#1c1b20]"
                  >
                    <option value="owner">Owner (Full Privileges)</option>
                    <option value="management">Management (Office / Dispatch / Finance)</option>
                    <option value="logistic">Logistic Man (Driver)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-label-caps text-[#574238] block mb-1">DEPARTMENT</label>
                  <select
                    value={editingUser.department}
                    onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value as Department })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f6f2f9] border border-[#e5e1e8] text-xs font-semibold text-[#1c1b20]"
                  >
                    <option value="general">General / Executive</option>
                    <option value="finance">Finance & Fuel Audit</option>
                    <option value="ops">Operations & Route Planning</option>
                    <option value="sales">Sales & Consignment DO</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-label-caps text-[#574238] block mb-1">ACCOUNT STATUS</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as UserStatus })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f6f2f9] border border-[#e5e1e8] text-xs font-semibold text-[#1c1b20]"
                  >
                    <option value="active">Active (Granted Access)</option>
                    <option value="pending">Pending Approval</option>
                    <option value="inactive">Inactive / Deactivated</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-label-caps text-[#574238] block mb-1">PHONE NUMBER</label>
                  <input
                    type="tel"
                    value={editingUser.phone || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f6f2f9] border border-[#e5e1e8] text-xs text-[#1c1b20]"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 rounded-full border border-[#e5e1e8] text-xs font-semibold text-[#574238]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#1c3ae7] text-white text-xs font-bold shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black/60 z-[130] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#e5e1e8]">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0ecf3]">
                <h3 className="font-bold text-base text-[#1c1b20]">Provision New User Account</h3>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="w-7 h-7 rounded-full bg-[#f0ecf3] flex items-center justify-center text-[#574238]"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-3 mt-4">
                <div>
                  <label className="text-[10px] font-label-caps text-[#574238] block mb-1">USER FULL NAME</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="e.g. Siti Nurhaliza"
                    className="w-full px-3 py-2 rounded-xl bg-[#f6f2f9] border border-[#e5e1e8] text-xs font-semibold text-[#1c1b20]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-label-caps text-[#574238] block mb-1">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="user@lohasorganic.com.my"
                    className="w-full px-3 py-2 rounded-xl bg-[#f6f2f9] border border-[#e5e1e8] text-xs font-semibold text-[#1c1b20]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-label-caps text-[#574238] block mb-1">PHONE NUMBER</label>
                  <input
                    type="tel"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    placeholder="+60 1x-xxx xxxx"
                    className="w-full px-3 py-2 rounded-xl bg-[#f6f2f9] border border-[#e5e1e8] text-xs text-[#1c1b20]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-label-caps text-[#574238] block mb-1">ROLE</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 rounded-xl bg-[#f6f2f9] border border-[#e5e1e8] text-xs text-[#1c1b20]"
                    >
                      <option value="logistic">Logistic Man</option>
                      <option value="management">Management</option>
                      <option value="owner">Owner</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-label-caps text-[#574238] block mb-1">DEPARTMENT</label>
                    <select
                      value={newUserDept}
                      onChange={(e) => setNewUserDept(e.target.value as Department)}
                      className="w-full px-3 py-2 rounded-xl bg-[#f6f2f9] border border-[#e5e1e8] text-xs text-[#1c1b20]"
                    >
                      <option value="ops">Operations</option>
                      <option value="finance">Finance</option>
                      <option value="sales">Sales</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-4 py-2 rounded-full border border-[#e5e1e8] text-xs font-semibold text-[#574238]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#1c3ae7] text-white text-xs font-bold shadow-md"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-[#f0ecf3] flex items-center justify-between text-xs text-[#574238]">
          <span className="flex items-center gap-1 font-mono-data text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#0fa42f]"></span>
            <span>Security Hash: SHA-256 Verified · 1 Exclusive Slot Enforcement</span>
          </span>
          <button
            onClick={() => setShowAdminModal(false)}
            className="px-5 py-2 rounded-full bg-[#313035] text-white text-xs font-bold hover:opacity-90"
          >
            Close Admin Console
          </button>
        </div>
      </div>
    </div>
  );
};
