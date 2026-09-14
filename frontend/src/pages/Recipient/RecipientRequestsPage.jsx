import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, XCircle } from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import PageHeader from '../../components/common/PageHeader';
import BloodRequestCard from '../../components/common/BloodRequestCard';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/FeedbackState';
import { cancelBloodRequest, getMyBloodRequests } from '../../services/bloodRequestService';
import { getSentConnections } from '../../services/connectionService';
import { getApiErrorMessage } from '../../services/errorMessage';

const RecipientRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [state, setState] = useState({ loading: true, error: '', action: '' });

  const loadRequests = useCallback(async () => {
    setState({ loading: true, error: '', action: '' });
    try {
      const [requestsResponse, connectionsResponse] = await Promise.all([getMyBloodRequests(), getSentConnections()]);
      const connections = connectionsResponse.data.connections || [];
      const withCounts = (requestsResponse.data.requests || []).map((request) => ({
        ...request,
        connectionCount: connections.filter((connection) => connection.blood_request_id === request.id).length,
      }));
      setRequests(withCounts);
      setState({ loading: false, error: '', action: '' });
    } catch (error) {
      setState({ loading: false, error: getApiErrorMessage(error, 'Unable to load your blood requests.'), action: '' });
    }
  }, []);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this blood request?')) return;
    setState((prev) => ({ ...prev, action: String(id), error: '' }));
    try { await cancelBloodRequest(id); await loadRequests(); } catch (error) { setState((prev) => ({ ...prev, action: '', error: getApiErrorMessage(error, 'Unable to cancel this request.') })); }
  };

  return <AppLayout role="RECIPIENT"><div className="space-y-6"><PageHeader eyebrow="Recipient workspace" title="My blood requests" description="Track every active request and keep donors informed." action={<Link to="/recipient/requests/new" className="inline-flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 shadow-sm px-4 py-3 rounded-xl font-semibold text-white text-sm transition"><Plus className="w-4 h-4" /> New request</Link>} />{state.loading && <LoadingState label="Loading your requests..." />}{!state.loading && state.error && <ErrorState message={state.error} onRetry={loadRequests} />}{!state.loading && !state.error && requests.length === 0 && <EmptyState title="No blood requests yet" description="Create your first blood request to find matching donors." />}{!state.loading && !state.error && requests.length > 0 && <div className="gap-4 grid lg:grid-cols-2">{requests.map((request) => <BloodRequestCard key={request.id} request={request} action={<div className="flex flex-wrap justify-between items-center gap-3"><span className="inline-flex items-center gap-2 text-slate-500 text-sm"><Users className="w-4 h-4" /> {request.connectionCount} connection{request.connectionCount === 1 ? '' : 's'}</span>{request.status === 'OPEN' && <button type="button" disabled={state.action === String(request.id)} onClick={() => handleCancel(request.id)} className="inline-flex items-center gap-2 disabled:opacity-60 font-semibold text-rose-600 hover:text-rose-700 text-sm"><XCircle className="w-4 h-4" />{state.action === String(request.id) ? 'Cancelling...' : 'Cancel request'}</button>}</div>} />)}</div>}</div></AppLayout>;
};

export default RecipientRequestsPage;
