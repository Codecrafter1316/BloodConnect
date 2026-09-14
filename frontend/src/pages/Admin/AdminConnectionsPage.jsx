import { useCallback, useEffect, useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/FeedbackState';
import { getAdminConnections } from '../../services/adminService';
import { getApiErrorMessage } from '../../services/errorMessage';

const statuses = ['', 'PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED'];
const formatDate = (value) => value ? new Date(value).toLocaleString() : 'Not available';

const AdminConnectionsPage = () => {
  const [connections, setConnections] = useState([]);
  const [status, setStatus] = useState('');
  const [state, setState] = useState({ loading: true, error: '' });
  const load = useCallback(async () => { setState({ loading: true, error: '' }); try { const { data } = await getAdminConnections(status ? { status } : undefined); setConnections(data.connections || []); setState({ loading: false, error: '' }); } catch (error) { setState({ loading: false, error: getApiErrorMessage(error, 'Unable to load connections.') }); } }, [status]);
  useEffect(() => { load(); }, [load]);
  return <AppLayout role="ADMIN"><div className="space-y-6"><PageHeader eyebrow="Moderation" title="Connections" description="Review donor and recipient matching activity." /><div className="flex flex-wrap gap-3"><select aria-label="Connection status filter" value={status} onChange={(event) => setStatus(event.target.value)} className="bg-white px-4 py-3 border border-slate-200 rounded-xl text-sm">{statuses.map((value) => <option key={value} value={value}>{value || 'All statuses'}</option>)}</select><button type="button" onClick={load} className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-semibold text-white text-sm">Apply filter</button></div>{state.loading && <LoadingState label="Loading connections..." />}{!state.loading && state.error && <ErrorState message={state.error} onRetry={load} />}{!state.loading && !state.error && connections.length === 0 && <EmptyState title="No connections found" description="Try another connection status filter." />}{!state.loading && !state.error && connections.length > 0 && <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[1100px] text-sm text-left"><thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider"><tr><th className="px-5 py-4">Connection</th><th className="px-5 py-4">Donor</th><th className="px-5 py-4">Recipient</th><th className="px-5 py-4">Blood request</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Created</th></tr></thead><tbody className="divide-y divide-slate-100">{connections.map((connection) => <tr key={connection.id}><td className="px-5 py-4 font-mono text-slate-500 text-xs">#{connection.id}</td><td className="px-5 py-4 font-semibold text-slate-900">{connection.donor?.name || '—'}<div className="font-normal text-slate-500 text-xs">{connection.donor?.email || ''}</div></td><td className="px-5 py-4 font-semibold text-slate-900">{connection.recipient?.name || '—'}<div className="font-normal text-slate-500 text-xs">{connection.recipient?.email || ''}</div></td><td className="px-5 py-4"><span className="font-bold text-red-700">{connection.bloodRequest?.blood_group || '—'}</span><div className="text-slate-500 text-xs">{connection.bloodRequest?.hospital_name || '—'} · {connection.bloodRequest?.city || '—'}</div><div className="text-slate-500 text-xs">{connection.bloodRequest?.units_required || '—'} unit(s)</div></td><td className="px-5 py-4"><StatusBadge status={connection.status} /></td><td className="px-5 py-4 text-slate-500">{formatDate(connection.created_at)}</td></tr>)}</tbody></table></div></div>}</div></AppLayout>;
};

export default AdminConnectionsPage;
