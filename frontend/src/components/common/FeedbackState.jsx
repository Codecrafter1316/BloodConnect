import LoadingSpinner from './LoadingSpinner';

export const LoadingState = ({ label = 'Loading data...' }) => (
  <div className="flex flex-col justify-center items-center gap-3 bg-white p-8 border border-slate-200 rounded-2xl min-h-40 text-slate-500 text-sm">
    <LoadingSpinner />
    <span>{label}</span>
  </div>
);

export const EmptyState = ({ title = 'Nothing here yet', description = 'There is no data to display.' }) => (
  <div className="bg-white p-10 border border-slate-300 border-dashed rounded-2xl text-center">
    <h3 className="font-semibold text-slate-900">{title}</h3>
    <p className="mt-2 text-slate-500 text-sm">{description}</p>
  </div>
);

export const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="bg-rose-50 p-6 border border-rose-200 rounded-2xl text-rose-700 text-sm">
    <p>{message}</p>
    {onRetry && <button type="button" onClick={onRetry} className="mt-3 font-semibold underline">Try again</button>}
  </div>
);
