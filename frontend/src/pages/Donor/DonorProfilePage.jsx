import { useEffect, useState } from 'react';
import { CheckCircle2, Power } from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import PageHeader from '../../components/common/PageHeader';
import { ErrorState, LoadingState } from '../../components/common/FeedbackState';
import { createDonorProfile, getDonorProfile, updateAvailability, updateDonorProfile } from '../../services/donorService';
import { getApiErrorMessage } from '../../services/errorMessage';

const initialForm = { id: null, blood_group: '', age: '', gender: '', city: '', address: '', is_available: true, last_donation_date: '' };
const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genders = ['MALE', 'FEMALE', 'OTHER'];
const fieldClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100';
const normalizeProfile = (profile) => ({ ...initialForm, ...profile, age: profile.age || '', last_donation_date: profile.last_donation_date || '' });

const DonorProfilePage = () => {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState({ loading: true, saving: false, availability: false, error: '', success: '' });

  const load = async () => {
    setState((prev) => ({ ...prev, loading: true, error: '' }));
    try { const { data } = await getDonorProfile(); setForm(normalizeProfile(data.donorProfile)); setState((prev) => ({ ...prev, loading: false })); } catch (error) { if (error.response?.status === 404) setState((prev) => ({ ...prev, loading: false, error: '' })); else setState((prev) => ({ ...prev, loading: false, error: getApiErrorMessage(error, 'Unable to load donor profile.') })); }
  };

  useEffect(() => { load(); }, []);

  const update = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setState((prev) => ({ ...prev, saving: true, error: '', success: '' }));
    try {
      const payload = { ...form, age: Number(form.age), last_donation_date: form.last_donation_date || null };
      const { data } = form.id ? await updateDonorProfile(payload) : await createDonorProfile(payload);
      setForm(normalizeProfile(data.donorProfile));
      setState((prev) => ({ ...prev, saving: false, success: data.message || 'Donor profile saved successfully.' }));
    } catch (error) { setState((prev) => ({ ...prev, saving: false, error: getApiErrorMessage(error, 'Unable to save donor profile.'), success: '' })); }
  };

  const toggleAvailability = async () => {
    if (!form.id) { setState((prev) => ({ ...prev, error: 'Complete and save your donor profile before changing availability.' })); return; }
    const nextValue = !form.is_available;
    setState((prev) => ({ ...prev, availability: true, error: '', success: '' }));
    try { const { data } = await updateAvailability(nextValue); setForm((prev) => ({ ...prev, is_available: data.is_available })); setState((prev) => ({ ...prev, availability: false, success: data.message || 'Availability updated successfully.' })); } catch (error) { setState((prev) => ({ ...prev, availability: false, error: getApiErrorMessage(error, 'Unable to update availability.'), success: '' })); }
  };

  if (state.loading) return <AppLayout role="DONOR"><LoadingState label="Loading donor profile..." /></AppLayout>;
  if (state.error && !form.blood_group) return <AppLayout role="DONOR"><div className="space-y-6"><PageHeader eyebrow="Donor account" title="Donor profile" /><ErrorState message={state.error} onRetry={load} /></div></AppLayout>;

  return <AppLayout role="DONOR"><div className="space-y-6 mx-auto max-w-3xl"><PageHeader eyebrow="Donor account" title="Donor profile" description="Keep your matching details current and control availability from the server-backed profile." />
    <div className="flex flex-wrap justify-between items-center gap-4 bg-white shadow-sm p-5 border border-slate-200 rounded-2xl"><div><p className="text-slate-500 text-sm">Current availability</p><p className={`mt-1 font-bold ${form.is_available ? 'text-emerald-700' : 'text-slate-700'}`}>{form.is_available ? 'Available to donate' : 'Currently unavailable'}</p></div><button type="button" onClick={toggleAvailability} disabled={state.availability} className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-60 ${form.is_available ? 'bg-slate-700 hover:bg-slate-800' : 'bg-emerald-600 hover:bg-emerald-700'}`}><Power className="w-4 h-4" />{state.availability ? 'Updating...' : form.is_available ? 'Set unavailable' : 'Set available'}</button></div>
    <form onSubmit={submit} className="space-y-6 bg-white shadow-sm p-5 sm:p-7 border border-slate-200 rounded-2xl">{state.error && <div className="bg-rose-50 px-4 py-3 border border-rose-200 rounded-xl text-rose-700 text-sm">{state.error}</div>}{state.success && <div className="flex items-center gap-2 bg-emerald-50 px-4 py-3 border border-emerald-200 rounded-xl text-emerald-700 text-sm"><CheckCircle2 className="w-4 h-4" />{state.success}</div>}<div className="gap-5 grid sm:grid-cols-2"><label className="font-semibold text-slate-700 text-sm">Blood group<select required name="blood_group" value={form.blood_group} onChange={update} className={fieldClass}><option value="">Select group</option>{groups.map((group) => <option key={group}>{group}</option>)}</select></label><label className="font-semibold text-slate-700 text-sm">Age<input required min="18" type="number" name="age" value={form.age} onChange={update} className={fieldClass} /></label><label className="font-semibold text-slate-700 text-sm">Gender<select required name="gender" value={form.gender} onChange={update} className={fieldClass}><option value="">Select gender</option>{genders.map((gender) => <option key={gender}>{gender}</option>)}</select></label><label className="font-semibold text-slate-700 text-sm">City<input required name="city" value={form.city} onChange={update} className={fieldClass} /></label><label className="sm:col-span-2 font-semibold text-slate-700 text-sm">Address<input name="address" value={form.address || ''} onChange={update} className={fieldClass} /></label><label className="font-semibold text-slate-700 text-sm">Last donation date<input type="date" name="last_donation_date" value={form.last_donation_date || ''} onChange={update} className={fieldClass} /></label></div><button disabled={state.saving} className="bg-red-600 hover:bg-red-700 disabled:opacity-60 px-4 py-3 rounded-xl w-full font-semibold text-white text-sm disabled:cursor-not-allowed">{state.saving ? 'Saving profile...' : form.id ? 'Save profile changes' : 'Create donor profile'}</button></form>
  </div></AppLayout>;
};

export default DonorProfilePage;
