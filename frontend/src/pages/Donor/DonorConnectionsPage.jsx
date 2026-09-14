import { useCallback, useEffect, useState } from 'react';
import { Check, CheckCircle2, X } from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import PageHeader from '../../components/common/PageHeader';
import ConnectionCard from '../../components/common/ConnectionCard';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/FeedbackState';
import { getReceivedConnections, updateConnectionStatus } from '../../services/connectionService';
import { getApiErrorMessage } from '../../services/errorMessage';

const DonorConnectionsPage = () => {
  const [connections, setConnections] = useState([]);
  const [state, setState] = useState({ loading: true, error: '', action: '', success: '' });

  const load = useCallback(async () => {
    setState({ loading: true, error: '', action: '', success: '' });
    try { const { data } = await getReceivedConnections(); setConnections(data.connections || []); setState({ loading: false, error: '', action: '', success: '' }); } catch (error) { setState({ loading: false, error: getApiErrorMessage(error, 'Unable to load received connections.'), action: '', success: '' }); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = async (id, status) => {
    const labels = { ACCEPTED: 'accept this connection', REJECTED: 'reject this connection', COMPLETED: 'mark this connection as completed' };
    if (!window.confirm(`Are you sure you want to ${labels[status]}?`)) return;
    setState((prev) => ({ ...prev, action: `${id}-${status}`, error: '', success: '' }));
    try { await updateConnectionStatus(id, status); await load(); setState((prev) => ({ ...prev, action: '', success: `Connection ${status.toLowerCase()} successfully.` })); } catch (error) { setState((prev) => ({ ...prev, action: '', error: getApiErrorMessage(error, 'Unable to update connection.'), success: '' })); }
  };

  return <AppLayout role="DONOR"><div className="space-y-6"><PageHeader eyebrow="Your matches" title="Received connections" description="Respond to recipient requests and manage active matches." />{state.success && <div className="bg-emerald-50 px-4 py-3 border border-emerald-200 rounded-xl text-emerald-700 text-sm">{state.success}</div>}{state.loading && <LoadingState label="Loading received connections..." />}{!state.loading && state.error && <ErrorState message={state.error} onRetry={load} />}{!state.loading && !state.error && connections.length === 0 && <EmptyState title="No connection requests yet" description="Recipient connection requests will appear here." />}{!state.loading && !state.error && connections.length > 0 && <div className="gap-4 grid lg:grid-cols-2">{connections.map((connection) => <ConnectionCard key={connection.id} connection={connection} perspective="donor" actions={connection.status === 'PENDING' ? <><button type="button" disabled={Boolean(state.action)} onClick={() => update(connection.id, 'ACCEPTED')} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 px-3 py-2 rounded-lg font-semibold text-white text-sm"><Check className="w-4 h-4" /> {state.action === `${connection.id}-ACCEPTED` ? 'Accepting...' : 'Accept'}</button><button type="button" disabled={Boolean(state.action)} onClick={() => update(connection.id, 'REJECTED')} className="inline-flex items-center gap-2 disabled:opacity-60 px-3 py-2 border border-slate-200 hover:border-rose-200 rounded-lg font-semibold text-slate-700 hover:text-rose-700 text-sm"><X className="w-4 h-4" /> {state.action === `${connection.id}-REJECTED` ? 'Rejecting...' : 'Reject'}</button></> : connection.status === 'ACCEPTED' ? <button type="button" disabled={Boolean(state.action)} onClick={() => update(connection.id, 'COMPLETED')} className="inline-flex items-center gap-2 hover:bg-emerald-50 disabled:opacity-60 px-3 py-2 border border-emerald-200 rounded-lg font-semibold text-emerald-700 text-sm"><CheckCircle2 className="w-4 h-4" /> {state.action === `${connection.id}-COMPLETED` ? 'Saving...' : 'Mark completed'}</button> : null} />)}</div>}</div></AppLayout>;
};

export default DonorConnectionsPage;
