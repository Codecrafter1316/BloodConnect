import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import AppLayout from '../../layouts/AppLayout';
import PageHeader from '../../components/common/PageHeader';
import { ErrorState, LoadingState } from '../../components/common/FeedbackState';
import { getMe, updateMe } from '../../services/authService';
import { getApiErrorMessage } from '../../services/errorMessage';

const fieldClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100';

const RecipientProfilePage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '' });
  const [state, setState] = useState({ loading: true, saving: false, error: '', success: '' });
  const load = async () => { setState((prev) => ({ ...prev, loading: true, error: '' })); try { const { data } = await getMe(); setForm({ name: data.user.name || '', email: data.user.email || '', phone: data.user.phone || '', role: data.user.role || '' }); setState((prev) => ({ ...prev, loading: false })); } catch (error) { setState((prev) => ({ ...prev, loading: false, error: getApiErrorMessage(error, 'Unable to load profile.') })); } };
  useEffect(() => { load(); }, []);
  const update = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  const submit = async (event) => { event.preventDefault(); setState((prev) => ({ ...prev, saving: true, error: '', success: '' })); try { const { data } = await updateMe({ name: form.name, phone: form.phone || null }); setForm((prev) => ({ ...prev, name: data.user.name, phone: data.user.phone || '' })); setState((prev) => ({ ...prev, saving: false, success: data.message || 'Profile updated successfully.' })); } catch (error) { setState((prev) => ({ ...prev, saving: false, error: getApiErrorMessage(error, 'Unable to update profile.'), success: '' })); } };
  if (state.loading) return <AppLayout role="RECIPIENT"><LoadingState label="Loading profile..." /></AppLayout>;
  if (state.error && !form.email) return <AppLayout role="RECIPIENT"><div className="space-y-6"><PageHeader eyebrow="Account" title="Recipient profile" /><ErrorState message={state.error} onRetry={load} /></div></AppLayout>;
  return <AppLayout role="RECIPIENT"><div className="space-y-6 mx-auto max-w-2xl"><PageHeader eyebrow="Account" title="Recipient profile" description="Update the account information supported by BloodConnect." /><form onSubmit={submit} className="space-y-6 bg-white shadow-sm p-6 border border-slate-200 rounded-2xl">{state.error && <div className="bg-rose-50 px-4 py-3 border border-rose-200 rounded-xl text-rose-700 text-sm">{state.error}</div>}{state.success && <div className="flex items-center gap-2 bg-emerald-50 px-4 py-3 border border-emerald-200 rounded-xl text-emerald-700 text-sm"><CheckCircle2 className="w-4 h-4" />{state.success}</div>}<label className="font-semibold text-slate-700 text-sm">Name<input required maxLength="100" name="name" value={form.name} onChange={update} className={fieldClass} /></label><label className="font-semibold text-slate-700 text-sm">Email<input disabled name="email" value={form.email} className={`${fieldClass} cursor-not-allowed opacity-70`} /></label><label className="font-semibold text-slate-700 text-sm">Phone<input maxLength="20" name="phone" value={form.phone} onChange={update} className={fieldClass} /></label><label className="font-semibold text-slate-700 text-sm">Role<input disabled name="role" value={form.role} className={`${fieldClass} cursor-not-allowed opacity-70`} /></label><button disabled={state.saving} className="bg-red-600 hover:bg-red-700 disabled:opacity-60 px-4 py-3 rounded-xl w-full font-semibold text-white text-sm disabled:cursor-not-allowed">{state.saving ? 'Saving profile...' : 'Save profile changes'}</button><p className="bg-slate-50 p-4 rounded-xl text-slate-600 text-sm">Role, password, account status, and email cannot be changed from this profile form.</p></form></div></AppLayout>;
};

export default RecipientProfilePage;
