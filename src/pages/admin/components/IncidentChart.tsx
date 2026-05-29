import type { TypeStat } from "../hooks/useAdminDashboard";

const BAR_COLORS = [
  "bg-red-500",
  "bg-blue-700",
  "bg-orange-400",
  "bg-emerald-500",
  "bg-indigo-500",
  "bg-yellow-500",
];

type Props = { byType: TypeStat[] };

export default function IncidentChart({ byType }: Props) {
  const max = Math.max(...byType.map((t) => t.total), 1);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xs font-bold uppercase tracking-wide text-slate-600">
        Distribución por tipo de incidente
      </h2>
      <hr className="my-4 border-slate-200" />
      {byType.length === 0 ? (
        <p className="text-center text-sm text-slate-400 py-8">
          Sin incidentes registrados.
        </p>
      ) : (
        <div className="flex h-48 w-full gap-2">
          <div className="flex flex-col justify-between py-1 text-xs text-slate-400 min-w-6 text-right">
            {[
              max,
              Math.round(max * 0.75),
              Math.round(max * 0.5),
              Math.round(max * 0.25),
              0,
            ].map((v) => (
              <span key={v}>{v}</span>
            ))}
          </div>
          <div className="flex flex-1 items-end justify-around border-b border-l border-slate-300 pl-2">
            {byType.map(({ type, total }, i) => (
              <div key={type} className="flex flex-col items-center gap-1 w-12">
                <span className="text-[10px] font-semibold text-slate-600">
                  {total}
                </span>
                <div
                  className={`${BAR_COLORS[i % BAR_COLORS.length]} w-full rounded-t`}
                  style={{ height: `${(total / max) * 160}px` }}
                />
                <span className="text-[10px] text-slate-500 text-center leading-tight">
                  {type.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
