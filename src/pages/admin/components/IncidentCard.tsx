import { useState } from "react";
import type { Incident, Patrullero } from "../hooks/useAdminDashboard";

type Props = {
  incident: Incident;
  patrulleros: Patrullero[];
  onAssign: (incidentId: number, patrulleroId: number) => Promise<boolean>;
};

export default function IncidentCard({
  incident,
  patrulleros,
  onAssign,
}: Props) {
  const [selectedId, setSelectedId] = useState<number | "">(
    patrulleros[0]?.id ?? "",
  );
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleAssign = async () => {
    if (!selectedId) return;
    setLoading(true);
    const ok = await onAssign(incident.id, Number(selectedId));
    if (ok) setDone(true);
    setLoading(false);
  };

  const date = new Date(incident.created_at).toLocaleDateString("es-CL");

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 uppercase">
              {incident.type.replace(/_/g, " ")}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              #{incident.id}
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-800 line-clamp-2">
            {incident.description}
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 shrink-0 ml-2">{date}</span>
      </div>

      {done ? (
        <p className="text-center text-sm font-semibold text-emerald-600">
          Patrullero asignado
        </p>
      ) : patrulleros.length === 0 ? (
        <p className="text-center text-sm text-slate-400">
          Sin patrulleros disponibles
        </p>
      ) : (
        <div className="flex items-center gap-3">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            className="flex-1 cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
          >
            {patrulleros.map((p) => (
              <option key={p.id} value={p.id}>
                {p.first_name} {p.last_name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAssign}
            disabled={loading || !selectedId}
            className="rounded-md bg-blue-900 px-4 py-2 text-xs font-bold uppercase text-white transition hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? "..." : "Asignar"}
          </button>
        </div>
      )}
    </article>
  );
}
