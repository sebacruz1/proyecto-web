import { useState } from "react";
import { IoCheckmarkCircleOutline, IoReloadOutline } from "react-icons/io5";
import type { Incident } from "../hooks/useAdminDashboard";

type Props = {
  incidents: Incident[];
  loading: boolean;
  onResolve: (incidentId: number) => Promise<boolean>;
};

function AssignedCard({
  incident,
  onResolve,
}: {
  incident: Incident;
  onResolve: (id: number) => Promise<boolean>;
}) {
  const [resolving, setResolving] = useState(false);

  const handleResolve = async () => {
    setResolving(true);
    await onResolve(incident.id);
    setResolving(false);
  };

  const date = new Date(incident.created_at).toLocaleDateString("es-CL");
  const patrullero = incident.patrullero_first_name
    ? `${incident.patrullero_first_name} ${incident.patrullero_last_name}`
    : "Sin patrullero";

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 uppercase">
              {incident.type.replace(/_/g, " ")}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">#{incident.id}</span>
            <span className="text-[10px] text-slate-400">{date}</span>
          </div>
          <p className="text-sm font-semibold text-slate-800 line-clamp-2">
            {incident.description}
          </p>
        </div>
        <button
          onClick={handleResolve}
          disabled={resolving}
          title="Marcar como resuelto"
          className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50 shrink-0"
        >
          {resolving ? (
            <IoReloadOutline className="h-4 w-4 animate-spin" />
          ) : (
            <IoCheckmarkCircleOutline className="h-4 w-4" />
          )}
          Resolver
        </button>
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
        <span className="text-xs text-slate-500">Patrullero:</span>
        <span className="text-xs font-semibold text-slate-700">{patrullero}</span>
        {incident.assignment_status && (
          <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 uppercase">
            {incident.assignment_status.replace(/_/g, " ")}
          </span>
        )}
      </div>
    </article>
  );
}

export default function AssignedIncidentList({ incidents, loading, onResolve }: Props) {
  return (
    <section className="mt-2 flex flex-col gap-4">
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Incidentes en desarrollo ({incidents.length})
        </h2>
        <hr className="mt-2 border-slate-300" />
      </div>

      {loading ? (
        <p className="py-6 text-center text-sm text-slate-400">Cargando...</p>
      ) : incidents.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">
          No hay incidentes en desarrollo.
        </p>
      ) : (
        incidents.map((incident) => (
          <AssignedCard key={incident.id} incident={incident} onResolve={onResolve} />
        ))
      )}
    </section>
  );
}
