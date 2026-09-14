import { useEffect, useState } from 'react';
import { Activity, CheckCircle2, Droplets, HeartHandshake, ShieldCheck, UserCheck, Users, UserX } from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { ErrorState, LoadingState } from '../../components/common/FeedbackState';
import { getAdminDashboard } from '../../services/adminService';
import { getApiErrorMessage } from '../../services/errorMessage';

const AdminDashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [state, setState] = useState({ loading: true, error: '' });

  useEffect(() => {
    getAdminDashboard()
      .then(({ data }) => {
        setDashboard(data.dashboard);
        setState({ loading: false, error: '' });
      })
      .catch((error) => setState({ loading: false, error: getApiErrorMessage(error, 'Unable to load admin dashboard.') }));
  }, []);

  if (state.loading) return <AppLayout role="ADMIN"><LoadingState label="Loading platform statistics..." /></AppLayout>;

  return (
    <AppLayout role="ADMIN">
      <div className="space-y-6">
        <PageHeader eyebrow="Administration" title="Platform overview" description="Live moderation and activity statistics from BloodConnect." />
        {state.error && <ErrorState message={state.error} />}
        {dashboard && <>
          <div className="gap-4 grid sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total users" value={dashboard.totalUsers} icon={Users} />
            <StatCard label="Active users" value={dashboard.activeUsers} icon={UserCheck} accent="emerald" />
            <StatCard label="Inactive users" value={dashboard.inactiveUsers} icon={UserX} accent="slate" />
            <StatCard label="Total requests" value={dashboard.totalBloodRequests} icon={Droplets} accent="red" />
          </div>
          <div className="gap-4 grid sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Donors" value={dashboard.totalDonors} icon={HeartHandshake} accent="blue" />
            <StatCard label="Recipients" value={dashboard.totalRecipients} icon={Activity} accent="amber" />
            <StatCard label="Open requests" value={dashboard.openBloodRequests} icon={Droplets} accent="red" />
            <StatCard label="Admins" value={dashboard.totalAdmins} icon={ShieldCheck} accent="slate" />
          </div>
          <div className="gap-4 grid sm:grid-cols-3">
            <StatCard label="Total connections" value={dashboard.totalConnections} icon={HeartHandshake} accent="blue" />
            <StatCard label="Pending connections" value={dashboard.pendingConnections} icon={Activity} accent="amber" />
            <StatCard label="Accepted connections" value={dashboard.acceptedConnections} icon={CheckCircle2} accent="emerald" />
          </div>
        </>}
      </div>
    </AppLayout>
  );
};

export default AdminDashboardPage;
