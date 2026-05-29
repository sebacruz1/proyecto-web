import type { Incident, Patrullero } from "../hooks/useAdminDashboard";
import IncidentCard from "./IncidentCard";

type Props = {
  incidents: Incident[];
  patrulleros: Patrullero[];
  loading: boolean;
  onAssign: (incidentId: number, patrulleroId: number) => Promise<boolean>;
};

export default function IncidentAssignList({ incidents, patrulleros, loading, onAssign }: Props) {
  return (
    <section className="mt-4 flex flex-col gap-4">
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Incidentes pendientes de asignación
        </h2>
        <hr className="mt-2 border-slate-300" />
      </div>

      {loading ? (
        <p className="text-center text-sm text-slate-400 py-6">Cargando...</p>
      ) : incidents.length === 0 ? (
        <p className="text-center text-sm text-slate-400 py-6">
          No hay incidentes pendientes.
        </p>
      ) : (
        incidents.map((incident) => (
          <IncidentCard
            key={incident.id}
            incident={incident}
            patrulleros={patrulleros}
            onAssign={onAssign}
          />
        ))
      )}
    </section>
  );
}
