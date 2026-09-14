import { CalendarDays, Hospital, MapPin, Package } from 'lucide-react';
import StatusBadge from './StatusBadge';

const formatDate = (value) => value ? new Date(value).toLocaleDateString() : 'Unknown date';

const BloodRequestCard = ({ request, action, showRecipient = false }) => (
  <article className="bg-white shadow-sm p-5 border border-slate-200 rounded-2xl">
    <div className="flex flex-wrap justify-between items-start gap-3">
      <div>
        <div className="flex items-center gap-2"><span className="bg-red-50 px-2.5 py-1 rounded-lg font-bold text-red-700 text-sm">{request.blood_group}</span><StatusBadge status={request.status} /></div>
        {showRecipient && <p className="mt-3 font-semibold text-slate-900 text-sm">{request.recipient?.name || 'Recipient'}</p>}
      </div>
      <span className="bg-amber-50 px-2.5 py-1 rounded-full font-bold text-amber-700 text-xs uppercase">{request.urgency || 'NORMAL'}</span>
    </div>
    <div className="gap-3 grid sm:grid-cols-2 mt-4 text-slate-600 text-sm">
      <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" />{request.city}</span>
      <span className="flex items-center gap-2"><Hospital className="w-4 h-4 text-red-500" />{request.hospital_name}</span>
      <span className="flex items-center gap-2"><Package className="w-4 h-4 text-red-500" />{request.units_required} unit(s)</span>
      <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-red-500" />{formatDate(request.created_at)}</span>
      {request.required_date && <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-red-500" />Required by {new Date(request.required_date).toLocaleDateString()}</span>}
    </div>
    {request.description && <p className="mt-4 pt-4 border-slate-100 border-t text-slate-600 text-sm leading-6">{request.description}</p>}
    {action && <div className="mt-5 pt-4 border-slate-100 border-t">{action}</div>}
  </article>
);

export default BloodRequestCard;
