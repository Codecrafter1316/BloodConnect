const toneByStatus = {
  OPEN: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  ACTIVE: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  ACCEPTED: 'bg-blue-50 text-blue-700 ring-blue-200',
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-200',
  REJECTED: 'bg-rose-50 text-rose-700 ring-rose-200',
  CANCELLED: 'bg-slate-100 text-slate-600 ring-slate-200',
  COMPLETED: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  INACTIVE: 'bg-slate-100 text-slate-600 ring-slate-200',
};

const StatusBadge = ({ status }) => {
  const label = String(status || 'UNKNOWN').replaceAll('_', ' ');
  const tone = toneByStatus[status] || 'bg-slate-100 text-slate-600 ring-slate-200';

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ring-1 ${tone}`}>{label}</span>;
};

export default StatusBadge;
