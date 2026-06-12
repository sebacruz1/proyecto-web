import type { Incident, Patrullero } from "../hooks/useAdminDashboard";
import IncidentCard from "./IncidentCard";
import { IoTrashOutline } from "react-icons/io5";

type Props = {
  incidents: Incident[];
  patrulleros: Patrullero[];
  loading: boolean;
  onAssign: (incidentId: number, patrulleroId: number) => Promise<boolean>;
  onDelete: (incidentId: number) => Promise<boolean>;
};

export default function IncidentAssignList({ incidents, patrulleros, loading, onAssign, onDelete }: Props) {
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
          <div key={incident.id} className="relative group">
            <IncidentCard
              incident={incident}
              patrulleros={patrulleros}
              onAssign={onAssign}
            />
            {/* Botón DELETE superpuesto con Tailwind */}
            <button
              onClick={() => onDelete(incident.id)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 opacity-0 shadow-sm transition-all hover:bg-red-100 group-hover:opacity-100"
              title="Eliminar incidente"
            >
              <IoTrashOutline className="h-5 w-5" />
            </button>
          </div>
        ))
      )}
    </section>
  );
}
