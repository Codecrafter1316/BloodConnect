import { useCallback, useEffect, useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/FeedbackState';
import { getAdminBloodRequests } from '../../services/adminService';
import { getApiErrorMessage } from '../../services/errorMessage';

const statuses = ['', 'OPEN', 'PARTIALLY_FULFILLED', 'FULFILLED', 'CANCELLED'];
const formatDate = (value) => value ? new Date(value).toLocaleString() : 'Not available';

const AdminBloodRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState('');
  const [state, setState] = useState({ loading: true, error: '' });
  const load = useCallback(async () => { setState({ loading: true, error: '' }); try { const { data } = await getAdminBloodRequests(status ? { status } : undefined); setRequests(data.requests || []); setState({ loading: false, error: '' }); } catch (error) { setState({ loading: false, error: getApiErrorMessage(error, 'Unable to load blood requests.') }); } }, [status]);
  useEffect(() => { load(); }, [load]);
  return <AppLayout role="ADMIN"><div className="space-y-6"><PageHeader eyebrow="Moderation" title="Blood requests" description="Monitor recipient requests across the platform." /><div className="flex flex-wrap gap-3"><select aria-label="Request status filter" value={status} onChange={(event) => setStatus(event.target.value)} className="bg-white px-4 py-3 border border-slate-200 rounded-xl text-sm">{statuses.map((value) => <option key={value} value={value}>{value ? value.replaceAll('_', ' ') : 'All statuses'}</option>)}</select><button type="button" onClick={load} className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-semibold text-white text-sm">Apply filter</button></div>{state.loading && <LoadingState label="Loading blood requests..." />}{!state.loading && state.error && <ErrorState message={state.error} onRetry={load} />}{!state.loading && !state.error && requests.length === 0 && <EmptyState title="No blood requests found" description="Try another status filter." />}{!state.loading && !state.error && requests.length > 0 && <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-sm text-left"><thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider"><tr><th className="px-5 py-4">Request</th><th className="px-5 py-4">Recipient</th><th className="px-5 py-4">Need</th><th className="px-5 py-4">Location</th><th className="px-5 py-4">Urgency</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Created</th></tr></thead><tbody className="divide-y divide-slate-100">{requests.map((request) => <tr key={request.id}><td className="px-5 py-4 font-mono text-slate-500 text-xs">#{request.id}</td><td className="px-5 py-4 font-semibold text-slate-900">{request.recipient?.name || 'Recipient'}<div className="font-normal text-slate-500 text-xs">{request.recipient?.email || ''}</div></td><td className="px-5 py-4"><span className="font-bold text-red-700">{request.blood_group}</span><div className="text-slate-500 text-xs">{request.units_required} unit(s)</div></td><td className="px-5 py-4 text-slate-600">{request.hospital_name}<div className="text-xs">{request.city}</div></td><td className="px-5 py-4 font-bold text-amber-700 text-xs uppercase">{request.urgency}</td><td className="px-5 py-4"><StatusBadge status={request.status} /></td><td className="px-5 py-4 text-slate-500">{formatDate(request.created_at)}</td></tr>)}</tbody></table></div></div>}</div></AppLayout>;
};

export default AdminBloodRequestsPage;
