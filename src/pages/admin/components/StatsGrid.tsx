interface Props {
  casesThisMonth: number;
  casesResolved: number;
}

export default function StatsGrid({ casesThisMonth, casesResolved }: Props) {
  return (
    <section className="grid grid-cols-2 gap-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Casos este mes
        </p>
        <p className="mt-2 text-4xl font-black text-blue-900">
          {casesThisMonth}
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Casos resueltos
        </p>
        <p className="mt-2 text-4xl font-black text-green-600">
          {casesResolved}
        </p>
      </div>
    </section>
  );
}
