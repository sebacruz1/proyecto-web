interface Props {
  id: string;
  title: string;
  priority: "ALTA" | "MEDIA" | "BAJA";
  category: string;
  guards: string[];
}

const priorityStyles = {
  ALTA: "bg-red-100 text-red-800 border-red-200",
  MEDIA: "bg-yellow-100 text-yellow-800 border-yellow-200",
  BAJA: "bg-green-100 text-green-800 border-green-200",
};

export default function IncidentCard({
  id,
  title,
  priority,
  category,
  guards,
}: Props) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`rounded border px-2 py-0.5 text-[10px] font-bold ${priorityStyles[priority]}`}
            >
              {priority}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              {id}
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
            {category}
          </span>
          <button className="text-[10px] font-bold uppercase text-blue-900 hover:underline">
            Ver detalles
          </button>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <select className="flex-1 cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#113264]">
          {guards.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <button className="rounded-md bg-blue-900 px-4 py-2 text-xs font-bold uppercase text-white transition hover:bg-blue-800">
          Asignar
        </button>
      </div>
    </article>
  );
}
