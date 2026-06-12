/*import IncidentCard from "./AssignedIncidentCard";

const ASSIGNED_INCIDENTS = [
  {
    id: "RD-001",
    title: "Luminaria dañada",
    priority: "MEDIA" as const,
    category: "LUMINARIA",
    date: "08/05/2026",
  },
  {
    id: "RD-002",
    title: "Vehículo sospechoso",
    priority: "ALTA" as const,
    category: "SEGURIDAD",
    date: "08/05/2026",
  },
];

export default function AssignedIncident() {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Incidentes asignados
        </h2>
        <span className="rounded-full bg-blue-900 px-3 py-1 text-xs font-bold text-white">
          {ASSIGNED_INCIDENTS.length} ACTIVO(S)
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {ASSIGNED_INCIDENTS.map((incident) => (
          <IncidentCard key={incident.id} {...incident} />
        ))}
      </div>
    </section>
  );
}
*/

import { useEffect, useState } from "react";
import IncidentCard from "./AssignedIncidentCard";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/ToastProvider";

interface Incident {
  id: number;
  type: string;
  description: string;
  status: string;
  created_at: string;
}

export default function AssignedIncident() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchIncidents = async () => {
    try {
      // Se Hace el GET a nuestra API REST
      const data = await api.get<Incident[]>("/api/incidents");
      
      // Filtramos para mostrar en pantalla solo los incidentes que no estén resueltos
      const activos = data.filter((inc) => inc.status !== "resuelto");
      setIncidents(activos);
    } catch (error) {
      console.error("Error al cargar incidentes:", error);
      showToast("Error de conexión al cargar los incidentes.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta automáticamente al cargar el dashboard del patrullero
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchIncidents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pequeña función para calcular la prioridad visual según el tipo de incidente reportado
  const getPriority = (type: string): "ALTA" | "MEDIA" | "BAJA" => {
    const t = type.toLowerCase();
    if (t.includes("emergencia") || t.includes("accidente")) return "ALTA";
    if (t.includes("sospechoso") || t.includes("vandalismo")) return "MEDIA";
    return "BAJA";
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Incidentes Activos
        </h2>
        <span className="rounded-full bg-blue-900 px-3 py-1 text-xs font-bold text-white">
          {loading ? "..." : incidents.length} ACTIVO(S)
        </span>
      </div>
      
      <div className="flex flex-col gap-3">
        {loading ? (
          <p className="text-center text-sm text-slate-500 py-6">Cargando base de datos...</p>
        ) : incidents.length === 0 ? (
          <p className="text-center text-sm text-slate-500 py-6">No hay incidentes pendientes en la zona.</p>
        ) : (
          incidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              id={`INC-${incident.id}`}
              title={incident.type}
              category={incident.status.replace("_", " ").toUpperCase()}
              priority={getPriority(incident.type)}
              date={new Date(incident.created_at).toLocaleDateString("es-CL")} // Formato de fecha local
              onClick={() => {
                // Dejamos el clic preparado para el siguiente paso (El Update del CRUD)
                showToast(`Has seleccionado el incidente INC-${incident.id}`, "success");
              }}
            />
          ))
        )}
      </div>
    </section>
  );
}