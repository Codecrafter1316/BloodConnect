import { CalendarDays, Hospital, MapPin } from 'lucide-react';
import StatusBadge from './StatusBadge';

const formatDate = (value) => value ? new Date(value).toLocaleString() : 'Unknown date';

const ConnectionCard = ({ connection, perspective, actions }) => {
  const person = perspective === 'donor' ? connection.recipient : connection.donor;
  const request = connection.bloodRequest;

  return (
    <article className="bg-white shadow-sm p-5 border border-slate-200 rounded-2xl">
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <p className="font-bold text-slate-500 text-xs uppercase tracking-wider">{perspective === 'donor' ? 'Recipient' : 'Donor'}</p>
          <h3 className="mt-1 font-semibold text-slate-900">{person?.name || 'Unknown user'}</h3>
          {perspective === 'donor' && person?.email && <p className="mt-1 text-slate-500 text-sm">{person.email}</p>}
        </div>
        <StatusBadge status={connection.status} />
      </div>
      <div className="gap-3 grid sm:grid-cols-2 mt-4 text-slate-600 text-sm">
        <span className="flex items-center gap-2"><span className="font-bold text-red-600">{request?.blood_group || '—'}</span> blood group</span>
        <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" />{request?.city || '—'}</span>
        <span className="flex items-center gap-2"><Hospital className="w-4 h-4 text-red-500" />{request?.hospital_name || '—'}</span>
        <span className="flex items-center gap-2"><span className="font-semibold text-slate-700">{request?.units_required || '—'}</span> unit(s)</span>
        <span className="flex items-center gap-2"><span className="font-semibold text-amber-700 uppercase">{request?.urgency || '—'}</span> urgency</span>
        {request?.required_date && <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-red-500" />Required by {new Date(request.required_date).toLocaleDateString()}</span>}
        <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-red-500" />{formatDate(connection.created_at)}</span>
      </div>
      {connection.message && <p className="bg-slate-50 mt-4 p-3 rounded-xl text-slate-600 text-sm">{connection.message}</p>}
      {actions && <div className="flex flex-wrap gap-2 mt-5 pt-4 border-slate-100 border-t">{actions}</div>}
    </article>
  );
};

export default ConnectionCard;
