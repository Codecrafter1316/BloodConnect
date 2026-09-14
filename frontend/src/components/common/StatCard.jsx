import { ArrowDownRight, ArrowUpRight, BarChart3 } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon = BarChart3, accent = 'red', trend }) => {
  const colors = {
    red: 'bg-red-50 text-red-700',
    blue: 'bg-blue-50 text-blue-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    slate: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="bg-white shadow-sm p-5 border border-slate-200 rounded-2xl">
      <div className="flex justify-between items-start gap-3">
        <div>
          <p className="text-slate-500 text-sm">{label}</p>
          <p className="mt-2 font-bold text-slate-900 text-3xl tracking-tight">{value ?? 0}</p>
        </div>
        <div className={`rounded-xl p-3 ${colors[accent] || colors.red}`}><Icon className="w-5 h-5" /></div>
      </div>
      {trend && <div className="flex items-center gap-1 mt-4 font-semibold text-slate-500 text-xs">{trend === 'up' ? <ArrowUpRight className="w-4 h-4 text-emerald-600" /> : <ArrowDownRight className="w-4 h-4 text-slate-400" />} Current platform total</div>}
    </div>
  );
};

export default StatCard;
