const BARS = [
  { label: "Robo", color: "bg-red-500", height: "h-40" },
  { label: "Médico", color: "bg-blue-900", height: "h-28" },
  { label: "Luminaria", color: "bg-orange-400", height: "h-40" },
  { label: "Ruido", color: "bg-emerald-500", height: "h-16" },
  { label: "Otro", color: "bg-indigo-500", height: "h-40" },
];

export default function IncidentChart() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xs font-bold uppercase tracking-wide text-slate-600">
        Distribución por tipo de incidente
      </h2>
      <hr className="my-4 border-slate-200" />
      <div className="flex h-48 w-full gap-2">
        <div className="flex flex-col justify-between py-6 text-xs text-slate-400">
          <span>3</span>
          <span>2.25</span>
          <span>1.5</span>
          <span>0.75</span>
          <span>0</span>
        </div>
        <div className="flex flex-1 items-end justify-around border-b border-l border-slate-300 pb-0 pl-2">
          {BARS.map(({ label, color, height }) => (
            <div key={label} className="flex w-12 flex-col items-center gap-2">
              <div className={`${height} ${color} w-full`} />
              <span className="text-[10px] text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
