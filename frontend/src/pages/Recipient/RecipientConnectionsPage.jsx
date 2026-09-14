import { useCallback, useEffect, useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import { CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import ConnectionCard from '../../components/common/ConnectionCard';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/FeedbackState';
import { getSentConnections, updateConnectionStatus } from '../../services/connectionService';
import { getApiErrorMessage } from '../../services/errorMessage';

const RecipientConnectionsPage = () => {
  const [connections, setConnections] = useState([]);
  const [state, setState] = useState({ loading: true, error: '', action: '' });

  const load = useCallback(async () => {
    setState({ loading: true, error: '', action: '' });
    try {
      const { data } = await getSentConnections();
      setConnections(data.connections || []);
      setState({ loading: false, error: '', action: '' });
    } catch (error) {
      setState({ loading: false, error: getApiErrorMessage(error, 'Unable to load connections.'), action: '' });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this pending connection request?')) return;
    setState((prev) => ({ ...prev, action: String(id), error: '' }));
    try { await updateConnectionStatus(id, 'CANCELLED'); await load(); } catch (error) { setState((prev) => ({ ...prev, action: '', error: getApiErrorMessage(error, 'Unable to cancel connection.') })); }
  };

  const complete = async (id) => {
    if (!window.confirm('Mark this accepted connection as completed?')) return;
    setState((prev) => ({ ...prev, action: String(id), error: '' }));
    try { await updateConnectionStatus(id, 'COMPLETED'); await load(); } catch (error) { setState((prev) => ({ ...prev, action: '', error: getApiErrorMessage(error, 'Unable to complete connection.') })); }
  };

  return <AppLayout role="RECIPIENT"><div className="space-y-6"><PageHeader eyebrow="Donor matches" title="Sent connections" description="Follow up on the donors you have contacted." />{state.loading && <LoadingState label="Loading connections..." />}{!state.loading && state.error && <ErrorState message={state.error} onRetry={load} />}{!state.loading && !state.error && connections.length === 0 && <EmptyState title="No connections yet" description="Find a donor and send your first connection request." />}{!state.loading && !state.error && connections.length > 0 && <div className="gap-4 grid lg:grid-cols-2">{connections.map((connection) => <ConnectionCard key={connection.id} connection={connection} perspective="recipient" actions={connection.status === 'PENDING' ? <button type="button" disabled={state.action === String(connection.id)} onClick={() => cancel(connection.id)} className="disabled:opacity-60 px-3 py-2 border border-slate-200 hover:border-rose-200 rounded-lg font-semibold text-slate-700 hover:text-rose-700 text-sm">{state.action === String(connection.id) ? 'Cancelling...' : 'Cancel request'}</button> : connection.status === 'ACCEPTED' ? <button type="button" disabled={state.action === String(connection.id)} onClick={() => complete(connection.id)} className="inline-flex items-center gap-2 hover:bg-emerald-50 disabled:opacity-60 px-3 py-2 border border-emerald-200 rounded-lg font-semibold text-emerald-700 text-sm"><CheckCircle2 className="w-4 h-4" />{state.action === String(connection.id) ? 'Saving...' : 'Mark completed'}</button> : null} />)}</div>}</div></AppLayout>;
};

export default RecipientConnectionsPage;
