import { useEffect, useState } from 'react';
import { Activity, ArrowRight, HeartHandshake, MapPin, Settings2, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import BloodRequestCard from '../../components/common/BloodRequestCard';
import ConnectionCard from '../../components/common/ConnectionCard';
import { ErrorState, LoadingState } from '../../components/common/FeedbackState';
import { getOpenBloodRequests } from '../../services/bloodRequestService';
import { getDonorProfile } from '../../services/donorService';
import { getReceivedConnections } from '../../services/connectionService';
import { getApiErrorMessage } from '../../services/errorMessage';
import useAuthStore from '../../store/authStore';

const DonorDashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const [data, setData] = useState({ profile: null, requests: [], connections: [] });
  const [state, setState] = useState({ loading: true, error: '' });

  useEffect(() => {
    Promise.allSettled([getDonorProfile(), getOpenBloodRequests(), getReceivedConnections()]).then((results) => {
      const [profileResult, requestsResult, connectionsResult] = results;
      const rejected = results.find((result) => result.status === 'rejected');
      setData({
        profile: profileResult.status === 'fulfilled' ? profileResult.value.data.donorProfile : null,
        requests: requestsResult.status === 'fulfilled' ? requestsResult.value.data.requests || [] : [],
        connections: connectionsResult.status === 'fulfilled' ? connectionsResult.value.data.connections || [] : [],
      });
      setState({ loading: false, error: rejected ? getApiErrorMessage(rejected.reason, 'Some donor activity could not be loaded.') : '' });
    });
  }, []);

  if (state.loading) return <AppLayout role="DONOR"><LoadingState label="Loading your donor dashboard..." /></AppLayout>;

  const pendingConnections = data.connections.filter((connection) => connection.status === 'PENDING');
  const acceptedConnections = data.connections.filter((connection) => connection.status === 'ACCEPTED');

  return <AppLayout role="DONOR"><div className="space-y-6">
    <PageHeader eyebrow="Donor workspace" title={`Welcome, ${user?.name || 'donor'}`} description="Stay available, review open requests, and respond to people who need support." action={<Link to="/donor/profile" className="inline-flex items-center gap-2 bg-white px-4 py-3 border border-slate-200 hover:border-red-200 rounded-xl font-semibold text-slate-700 hover:text-red-700 text-sm"><Settings2 className="w-4 h-4" /> My profile</Link>} />
    {state.error && <ErrorState message={state.error} />}
    <div className="gap-4 grid sm:grid-cols-2 xl:grid-cols-5"><StatCard label="Availability" value={data.profile ? data.profile.is_available ? 'Available' : 'Unavailable' : 'Incomplete'} icon={Activity} accent={data.profile?.is_available ? 'emerald' : 'slate'} /><StatCard label="Open requests" value={data.requests.length} icon={MapPin} accent="red" /><StatCard label="Pending connections" value={pendingConnections.length} icon={HeartHandshake} accent="amber" /><StatCard label="Accepted connections" value={acceptedConnections.length} icon={HeartHandshake} accent="emerald" /><StatCard label="Blood group" value={data.profile?.blood_group || '—'} icon={UserRound} accent="blue" /></div>
    {data.profile && <div className="flex flex-wrap items-center gap-x-6 gap-y-2 bg-white shadow-sm px-5 py-4 border border-slate-200 rounded-2xl text-slate-600 text-sm"><span><strong className="text-slate-900">City:</strong> {data.profile.city}</span><span><strong className="text-slate-900">Age:</strong> {data.profile.age}</span><span><strong className="text-slate-900">Gender:</strong> {data.profile.gender}</span></div>}
    <div className="gap-6 grid xl:grid-cols-[1.3fr_1fr]"><section className="space-y-4"><div className="flex justify-between items-center"><h3 className="font-bold text-slate-900">Open blood requests</h3><Link to="/donor/requests" className="inline-flex items-center gap-1 font-semibold text-red-600 text-sm">View all <ArrowRight className="w-4 h-4" /></Link></div>{data.requests.slice(0, 2).map((request) => <BloodRequestCard key={request.id} request={request} />)}{data.requests.length === 0 && <div className="bg-white p-8 border border-slate-300 border-dashed rounded-2xl text-slate-500 text-sm text-center">No open blood requests are available right now.</div>}</section><section className="space-y-4"><div className="flex justify-between items-center"><h3 className="font-bold text-slate-900">Recent connection activity</h3><Link to="/donor/connections" className="inline-flex items-center gap-1 font-semibold text-red-600 text-sm">Review <ArrowRight className="w-4 h-4" /></Link></div>{data.connections.slice(0, 2).map((connection) => <ConnectionCard key={connection.id} connection={connection} perspective="donor" />)}{data.connections.length === 0 && <div className="bg-white p-8 border border-slate-300 border-dashed rounded-2xl text-slate-500 text-sm text-center">No connection requests yet.</div>}</section></div>
  </div></AppLayout>;
};

export default DonorDashboardPage;
