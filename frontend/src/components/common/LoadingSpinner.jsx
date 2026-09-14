const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div className="flex justify-center items-center min-h-50">
    <div className="flex flex-col items-center gap-3 text-slate-600">
      <div className="border-4 border-red-200 border-t-red-600 rounded-full w-10 h-10 animate-spin" />
      <span className="font-medium text-sm">{label}</span>
    </div>
  </div>
);

export default LoadingSpinner;
