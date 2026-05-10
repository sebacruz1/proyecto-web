import IncidentCard from "./AssignedIncidentCard";

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
