import { useEffect, useRef, useState } from "react";
import IncidentCard from "./AssignedIncidentCard";
import { type AssignedIncident } from "./IncidentDetailModal";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/ToastProvider";

type Props = {
  onSelect: (incident: AssignedIncident) => void;
  refreshKey?: number;
};

export default function AssignedIncident({ onSelect, refreshKey }: Props) {
  const [incidents, setIncidents] = useState<AssignedIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const isFirstRun = useRef(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
    } else {
      setLoading(true);
    }
    api
      .get<AssignedIncident[]>("/api/incidents/assigned")
      .then(setIncidents)
      .catch(() =>
        showToast("Error de conexión al cargar los incidentes.", "error"),
      )
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const getPriority = (type: string): "ALTA" | "MEDIA" | "BAJA" => {
    const t = type.toLowerCase();
    if (t.includes("emergencia") || t.includes("accidente")) return "ALTA";
    if (t.includes("sospechoso") || t.includes("vandalismo")) return "MEDIA";
    return "BAJA";
  };

  const active = incidents.filter((i) => i.assignment_status !== "completado");
  const completed = incidents.filter(
    (i) => i.assignment_status === "completado",
  );

  const renderCard = (incident: AssignedIncident) => (
    <IncidentCard
      key={incident.id}
      id={`INC-${incident.id}`}
      title={incident.type}
      category={incident.assignment_status.replace("_", " ").toUpperCase()}
      priority={getPriority(incident.type)}
      date={new Date(incident.created_at).toLocaleDateString("es-CL")}
      onClick={() => onSelect(incident)}
    />
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Activos */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Incidentes Activos
          </h2>
          <span className="rounded-full bg-blue-900 px-3 py-1 text-xs font-bold text-white">
            {loading ? "..." : active.length} ACTIVO(S)
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {loading ? (
            <p className="text-center text-sm text-slate-500 py-6">
              Cargando base de datos...
            </p>
          ) : active.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-6">
              No tienes incidentes activos.
            </p>
          ) : (
            active.map(renderCard)
          )}
        </div>
      </section>

      {/* Completados */}
      {!loading && completed.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Incidentes Completados
            </h2>
            <span className="rounded-full bg-emerald-700 px-3 py-1 text-xs font-bold text-white">
              {completed.length} COMPLETADO(S)
            </span>
          </div>
          <div className="flex flex-col gap-3">{completed.map(renderCard)}</div>
        </section>
      )}
    </div>
  );
}
