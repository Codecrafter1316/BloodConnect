import { useCallback, useEffect, useState } from 'react';
import { ShieldCheck, UserRound, X } from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/FeedbackState';
import { getAdminUser, getAdminUsers, updateUserStatus } from '../../services/adminService';
import { getApiErrorMessage } from '../../services/errorMessage';

const formatDate = (value) => value ? new Date(value).toLocaleString() : 'Not available';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({ role: '', is_active: '' });
  const [state, setState] = useState({ loading: true, error: '', action: '', success: '' });

  const load = useCallback(async (params = filters) => {
    setState((prev) => ({ ...prev, loading: true, error: '', success: '', action: '' }));
    try {
      const query = Object.fromEntries(Object.entries(params).filter(([, value]) => value));
      const { data } = await getAdminUsers(query);
      setUsers(data.users || []);
      setState((prev) => ({ ...prev, loading: false }));
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false, error: getApiErrorMessage(error, 'Unable to load users.') }));
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (user) => {
    if (!window.confirm(`${user.is_active ? 'Deactivate' : 'Activate'} ${user.name}?`)) return;
    setState((prev) => ({ ...prev, action: String(user.id), error: '', success: '' }));
    try {
      const { data } = await updateUserStatus(user.id, !user.is_active);
      setUsers((previous) => previous.map((item) => item.id === user.id ? { ...item, ...data.user, is_active: data.user.is_active } : item));
      setState((prev) => ({ ...prev, action: '', success: data.message || 'User status updated successfully.' }));
      if (selectedUser?.id === user.id) setSelectedUser((previous) => ({ ...previous, ...data.user }));
    } catch (error) {
      setState((prev) => ({ ...prev, action: '', error: getApiErrorMessage(error, 'Unable to update user status.'), success: '' }));
    }
  };

  const viewUser = async (id) => {
    setState((prev) => ({ ...prev, error: '', success: '' }));
    try { const { data } = await getAdminUser(id); setSelectedUser(data.user); } catch (error) { setState((prev) => ({ ...prev, error: getApiErrorMessage(error, 'Unable to load user details.') })); }
  };

  return <AppLayout role="ADMIN"><div className="space-y-6"><PageHeader eyebrow="Moderation" title="User management" description="Review accounts and control access to the platform." />
    <div className="flex sm:flex-row flex-col gap-3 bg-white shadow-sm p-4 border border-slate-200 rounded-2xl"><select aria-label="Role filter" value={filters.role} onChange={(event) => setFilters((prev) => ({ ...prev, role: event.target.value }))} className="bg-white px-4 py-3 border border-slate-200 rounded-xl text-sm"><option value="">All roles</option><option>DONOR</option><option>RECIPIENT</option><option>ADMIN</option></select><select aria-label="Status filter" value={filters.is_active} onChange={(event) => setFilters((prev) => ({ ...prev, is_active: event.target.value }))} className="bg-white px-4 py-3 border border-slate-200 rounded-xl text-sm"><option value="">All statuses</option><option value="true">Active</option><option value="false">Inactive</option></select><button type="button" onClick={() => load()} className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-semibold text-white text-sm">Apply filters</button></div>
    {state.success && <div className="bg-emerald-50 px-4 py-3 border border-emerald-200 rounded-xl text-emerald-700 text-sm">{state.success}</div>}{state.loading && <LoadingState label="Loading users..." />}{!state.loading && state.error && <ErrorState message={state.error} onRetry={load} />}{!state.loading && !state.error && users.length === 0 && <EmptyState title="No users found" description="Try a different role or account status." />}
    {!state.loading && !state.error && users.length > 0 && <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-sm text-left"><thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider"><tr><th className="px-5 py-4">User</th><th className="px-5 py-4">Role</th><th className="px-5 py-4">Donor profile</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Created</th><th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{users.map((user) => <tr key={user.id}><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="bg-red-50 p-2 rounded-lg text-red-600">{user.role === 'ADMIN' ? <ShieldCheck className="w-4 h-4" /> : <UserRound className="w-4 h-4" />}</div><div><p className="font-semibold text-slate-900">{user.name}</p><p className="text-slate-500 text-xs">{user.email}{user.phone ? ` · ${user.phone}` : ''}</p></div></div></td><td className="px-5 py-4 font-semibold text-slate-700">{user.role}</td><td className="px-5 py-4 text-slate-600">{user.donorProfile ? <><div>{user.donorProfile.blood_group} · {user.donorProfile.city}</div><div className="text-xs">{user.donorProfile.is_available ? 'Available' : 'Unavailable'}</div></> : '—'}</td><td className="px-5 py-4"><StatusBadge status={user.is_active ? 'ACTIVE' : 'INACTIVE'} /></td><td className="px-5 py-4 text-slate-500">{formatDate(user.created_at)}</td><td className="space-x-2 px-5 py-4 text-right"><button type="button" onClick={() => viewUser(user.id)} className="px-3 py-2 border border-slate-200 hover:border-blue-200 rounded-lg font-semibold text-slate-700 hover:text-blue-700 text-xs">View</button><button type="button" disabled={state.action === String(user.id)} onClick={() => toggle(user)} className="disabled:opacity-60 px-3 py-2 border border-slate-200 hover:border-red-200 rounded-lg font-semibold text-slate-700 hover:text-red-700 text-xs">{state.action === String(user.id) ? 'Saving...' : user.is_active ? 'Deactivate' : 'Activate'}</button></td></tr>)}</tbody></table></div></div>}
    {selectedUser && <div className="z-20 fixed inset-0 flex justify-center items-center bg-slate-900/40 p-4" role="dialog" aria-modal="true"><div className="bg-white shadow-xl p-6 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"><div className="flex justify-between items-start"><div><p className="font-bold text-red-600 text-xs uppercase tracking-wider">User details</p><h3 className="mt-1 font-bold text-slate-900 text-xl">{selectedUser.name}</h3></div><button type="button" onClick={() => setSelectedUser(null)} aria-label="Close user details" className="hover:bg-slate-100 p-2 rounded-lg text-slate-500"><X className="w-5 h-5" /></button></div><div className="gap-4 grid sm:grid-cols-2 mt-6 text-sm"><div><p className="text-slate-500">Email</p><p className="mt-1 font-semibold text-slate-900">{selectedUser.email}</p></div><div><p className="text-slate-500">Phone</p><p className="mt-1 font-semibold text-slate-900">{selectedUser.phone || 'Not provided'}</p></div><div><p className="text-slate-500">Role</p><p className="mt-1 font-semibold text-slate-900">{selectedUser.role}</p></div><div><p className="text-slate-500">Status</p><div className="mt-1"><StatusBadge status={selectedUser.is_active ? 'ACTIVE' : 'INACTIVE'} /></div></div><div><p className="text-slate-500">Created</p><p className="mt-1 font-semibold text-slate-900">{formatDate(selectedUser.created_at)}</p></div>{selectedUser.donorProfile && <><div><p className="text-slate-500">Blood group</p><p className="mt-1 font-semibold text-slate-900">{selectedUser.donorProfile.blood_group}</p></div><div><p className="text-slate-500">City</p><p className="mt-1 font-semibold text-slate-900">{selectedUser.donorProfile.city}</p></div><div><p className="text-slate-500">Age / gender</p><p className="mt-1 font-semibold text-slate-900">{selectedUser.donorProfile.age} · {selectedUser.donorProfile.gender}</p></div><div><p className="text-slate-500">Availability</p><p className="mt-1 font-semibold text-slate-900">{selectedUser.donorProfile.is_available ? 'Available' : 'Unavailable'}</p></div><div className="sm:col-span-2"><p className="text-slate-500">Address</p><p className="mt-1 font-semibold text-slate-900">{selectedUser.donorProfile.address || 'Not provided'}</p></div><div><p className="text-slate-500">Last donation</p><p className="mt-1 font-semibold text-slate-900">{selectedUser.donorProfile.last_donation_date || 'Not provided'}</p></div></>}</div></div></div>}
  </div></AppLayout>;
};

export default AdminUsersPage;
