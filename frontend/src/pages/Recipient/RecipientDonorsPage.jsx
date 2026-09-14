import { useEffect, useState } from 'react';
import { HeartHandshake, MapPin, Search, UserRound, X } from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import PageHeader from '../../components/common/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/FeedbackState';
import { getMyBloodRequests } from '../../services/bloodRequestService';
import { searchDonors } from '../../services/donorService';
import { sendConnectionRequest } from '../../services/connectionService';
import { getApiErrorMessage } from '../../services/errorMessage';

const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const inputClass = 'rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100';

const RecipientDonorsPage = () => {
  const [filters, setFilters] = useState({ blood_group: '', city: '' });
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState('');
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [state, setState] = useState({ loading: true, error: '', action: '', success: '' });

  const load = async (params = filters) => {
    setState((prev) => ({ ...prev, loading: true, error: '', success: '' }));
    try {
      const [donorResponse, requestResponse] = await Promise.all([searchDonors(params), getMyBloodRequests()]);
      const openRequests = (requestResponse.data.requests || []).filter((request) => request.status === 'OPEN');
      setDonors(donorResponse.data.donors || []);
      setRequests(openRequests);
      setSelectedRequest((previous) => previous || String(openRequests[0]?.id || ''));
      setState((prev) => ({ ...prev, loading: false }));
    } catch (error) {
      setState({ loading: false, error: getApiErrorMessage(error, 'Unable to find donors. Please check your filters.'), action: '', success: '' });
    }
  };

  useEffect(() => { load(); }, []);

  const clearFilters = () => {
    const cleared = { blood_group: '', city: '' };
    setFilters(cleared);
    load(cleared);
  };

  const connect = async (donorId) => {
    if (!selectedRequest) {
      setState((prev) => ({ ...prev, error: 'Create or select an open blood request first.' }));
      return;
    }

    setState((prev) => ({ ...prev, action: String(donorId), error: '', success: '' }));
    try {
      await sendConnectionRequest({ blood_request_id: Number(selectedRequest), donor_id: donorId });
      setState((prev) => ({ ...prev, action: '', success: 'Connection request sent. You can track it from Connections.' }));
      setSelectedDonor(null);
    } catch (error) {
      const message = error.response?.status === 409 ? 'You have already sent a request to this donor.' : getApiErrorMessage(error, 'Unable to send connection request. Please try again.');
      setState((prev) => ({ ...prev, action: '', error: message }));
    }
  };

  return <AppLayout role="RECIPIENT"><div className="space-y-6">
    <PageHeader eyebrow="Donor network" title="Find available donors" description="Search donors by the filters supported by BloodConnect. Availability is checked by the backend." />
    <div className="gap-3 grid md:grid-cols-[1fr_1fr_1.5fr_auto_auto] bg-white shadow-sm p-4 border border-slate-200 rounded-2xl"><select aria-label="Blood group" value={filters.blood_group} onChange={(event) => setFilters((prev) => ({ ...prev, blood_group: event.target.value }))} className={inputClass}><option value="">All blood groups</option>{groups.map((group) => <option key={group}>{group}</option>)}</select><input aria-label="City" placeholder="City" value={filters.city} onChange={(event) => setFilters((prev) => ({ ...prev, city: event.target.value }))} className={inputClass} /><select aria-label="Blood request" value={selectedRequest} onChange={(event) => setSelectedRequest(event.target.value)} className={inputClass}><option value="">Select an open request</option>{requests.map((request) => <option key={request.id} value={request.id}>{request.blood_group} · {request.hospital_name}</option>)}</select><button type="button" onClick={() => load()} className="inline-flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-3 rounded-xl font-semibold text-white text-sm"><Search className="w-4 h-4" /> Search</button><button type="button" onClick={clearFilters} className="px-4 py-3 border border-slate-200 hover:border-red-200 rounded-xl font-semibold text-slate-700 hover:text-red-700 text-sm">Clear</button></div>
    {state.error && <ErrorState message={state.error} />}{state.success && <div className="bg-emerald-50 px-4 py-3 border border-emerald-200 rounded-xl text-emerald-700 text-sm">{state.success}</div>}{state.loading && <LoadingState label="Finding donors..." />}{!state.loading && !state.error && donors.length === 0 && <EmptyState title="No donors found" description="Try another blood group or city." />}
    {!state.loading && donors.length > 0 && <div className="gap-4 grid md:grid-cols-2 xl:grid-cols-3">{donors.map((donor) => <article key={donor.id} className="bg-white shadow-sm p-5 border border-slate-200 rounded-2xl"><div className="flex justify-between items-start gap-3"><div className="flex items-center gap-3"><div className="bg-red-50 p-3 rounded-xl text-red-600"><UserRound className="w-5 h-5" /></div><div><h3 className="font-semibold text-slate-900">{donor.user?.name || 'Available donor'}</h3><p className="text-slate-500 text-sm">{donor.gender || 'Profile'}{donor.age ? ` · ${donor.age} years` : ''}</p></div></div><span className="bg-red-50 px-2.5 py-1 rounded-lg font-bold text-red-700 text-sm">{donor.blood_group}</span></div><p className="flex items-center gap-2 mt-4 text-slate-600 text-sm"><MapPin className="w-4 h-4 text-red-500" />{donor.city}</p><div className="flex gap-2 mt-5"><button type="button" onClick={() => setSelectedDonor(donor)} className="flex-1 px-3 py-3 border border-slate-200 hover:border-red-200 rounded-xl font-semibold text-slate-700 hover:text-red-700 text-sm">View details</button><button type="button" onClick={() => connect(donor.user_id)} disabled={state.action === String(donor.user_id)} className="inline-flex flex-1 justify-center items-center gap-2 bg-slate-900 hover:bg-slate-700 disabled:opacity-60 px-3 py-3 rounded-xl font-semibold text-white text-sm"><HeartHandshake className="w-4 h-4" />{state.action === String(donor.user_id) ? 'Sending...' : 'Connect'}</button></div></article>)}</div>}
    {selectedDonor && <div className="z-20 fixed inset-0 flex justify-center items-center bg-slate-900/40 p-4" role="dialog" aria-modal="true"><div className="bg-white shadow-xl p-6 rounded-2xl w-full max-w-md"><div className="flex justify-between items-start"><div><p className="font-bold text-red-600 text-xs uppercase tracking-wider">Donor details</p><h3 className="mt-1 font-bold text-slate-900 text-xl">{selectedDonor.user?.name || 'Available donor'}</h3></div><button type="button" aria-label="Close donor details" onClick={() => setSelectedDonor(null)} className="hover:bg-slate-100 p-2 rounded-lg text-slate-500"><X className="w-5 h-5" /></button></div><div className="gap-4 grid sm:grid-cols-2 mt-6 text-sm"><div><p className="text-slate-500">Blood group</p><p className="mt-1 font-semibold text-red-700">{selectedDonor.blood_group}</p></div><div><p className="text-slate-500">Availability</p><p className="mt-1 font-semibold text-emerald-700">{selectedDonor.is_available ? 'Available' : 'Unavailable'}</p></div><div><p className="text-slate-500">City</p><p className="mt-1 font-semibold text-slate-900">{selectedDonor.city}</p></div><div><p className="text-slate-500">Gender / age</p><p className="mt-1 font-semibold text-slate-900">{selectedDonor.gender || '—'}{selectedDonor.age ? ` · ${selectedDonor.age} years` : ''}</p></div></div><button type="button" onClick={() => connect(selectedDonor.user_id)} disabled={Boolean(state.action)} className="inline-flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 mt-6 px-4 py-3 rounded-xl w-full font-semibold text-white text-sm"><HeartHandshake className="w-4 h-4" />{state.action ? 'Sending request...' : 'Send connection request'}</button></div></div>}
  </div></AppLayout>;
};

export default RecipientDonorsPage;
