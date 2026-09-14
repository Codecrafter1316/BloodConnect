const PageHeader = ({ eyebrow, title, description, action }) => (
  <div className="flex sm:flex-row flex-col sm:justify-between sm:items-end gap-4">
    <div>
      {eyebrow && <p className="font-bold text-red-600 text-xs uppercase tracking-[0.2em]">{eyebrow}</p>}
      <h2 className="mt-1 font-bold text-slate-900 text-2xl sm:text-3xl tracking-tight">{title}</h2>
      {description && <p className="mt-2 max-w-2xl text-slate-600 text-sm">{description}</p>}
    </div>
    {action}
  </div>
);

export default PageHeader;
