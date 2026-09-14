import { useEffect, useState } from 'react';
import { Activity, ArrowRight, ClipboardList, HeartHandshake, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import BloodRequestCard from '../../components/common/BloodRequestCard';
import { ErrorState, LoadingState } from '../../components/common/FeedbackState';
import { getMyBloodRequests } from '../../services/bloodRequestService';
import { getSentConnections } from '../../services/connectionService';
import { getApiErrorMessage } from '../../services/errorMessage';
import useAuthStore from '../../store/authStore';

const RecipientDashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const [data, setData] = useState({ requests: [], connections: [] });
  const [state, setState] = useState({ loading: true, error: '' });

  useEffect(() => {
    Promise.all([getMyBloodRequests(), getSentConnections()])
      .then(([requestsResponse, connectionsResponse]) => {
        setData({ requests: requestsResponse.data.requests || [], connections: connectionsResponse.data.connections || [] });
        setState({ loading: false, error: '' });
      })
      .catch((error) => setState({ loading: false, error: getApiErrorMessage(error, 'Unable to load your dashboard.') }));
  }, []);

  if (state.loading) return <AppLayout role="RECIPIENT"><LoadingState label="Loading your dashboard..." /></AppLayout>;

  const openRequests = data.requests.filter((request) => request.status === 'OPEN');
  const urgentRequests = data.requests.filter((request) => ['URGENT', 'CRITICAL'].includes(request.urgency));
  const pendingConnections = data.connections.filter((connection) => connection.status === 'PENDING');
  const acceptedConnections = data.connections.filter((connection) => connection.status === 'ACCEPTED');

  return <AppLayout role="RECIPIENT"><div className="space-y-6">
    <PageHeader eyebrow="Recipient workspace" title={`Welcome, ${user?.name || 'there'}`} description="Keep your request details current and connect with donors when you need support." action={<Link to="/recipient/requests/new" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-3 rounded-xl font-semibold text-white text-sm"><Plus className="w-4 h-4" /> Create blood request</Link>} />
    {state.error && <ErrorState message={state.error} />}
    {!state.error && <>
      <div className="gap-4 grid sm:grid-cols-2 xl:grid-cols-5"><StatCard label="Total requests" value={data.requests.length} icon={ClipboardList} /><StatCard label="Open requests" value={openRequests.length} icon={Activity} accent="emerald" /><StatCard label="Urgent requests" value={urgentRequests.length} icon={Activity} accent="amber" /><StatCard label="Pending connections" value={pendingConnections.length} icon={HeartHandshake} accent="blue" /><StatCard label="Accepted connections" value={acceptedConnections.length} icon={HeartHandshake} accent="emerald" /></div>
      <div className="gap-6 grid xl:grid-cols-[1.4fr_1fr]"><section className="space-y-4"><div className="flex justify-between items-center"><h3 className="font-bold text-slate-900">Recent requests</h3><Link to="/recipient/requests" className="inline-flex items-center gap-1 font-semibold text-red-600 text-sm">View all <ArrowRight className="w-4 h-4" /></Link></div>{data.requests.slice(0, 3).map((request) => <BloodRequestCard key={request.id} request={request} />)}{data.requests.length === 0 && <div className="bg-white p-8 border border-slate-300 border-dashed rounded-2xl text-slate-500 text-sm text-center">Create your first blood request to find matching donors.</div>}</section><section className="bg-red-50 p-6 border border-red-100 rounded-2xl"><h3 className="font-bold text-slate-900">Quick actions</h3><div className="space-y-3 mt-4"><Link to="/recipient/donors" className="flex justify-between items-center bg-white shadow-sm p-4 rounded-xl font-semibold text-slate-800 hover:text-red-700 text-sm">Find donors <ArrowRight className="w-4 h-4" /></Link><Link to="/recipient/connections" className="flex justify-between items-center bg-white shadow-sm p-4 rounded-xl font-semibold text-slate-800 hover:text-red-700 text-sm">Track connections <ArrowRight className="w-4 h-4" /></Link></div></section></div>
    </>}
  </div></AppLayout>;
};

export default RecipientDashboardPage;
