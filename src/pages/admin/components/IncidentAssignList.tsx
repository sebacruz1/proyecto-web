import IncidentCard from "./IncidentCard";

const PENDING_INCIDENTS = [
  {
    id: "RD-003",
    title: "Sospecha de robo",
    priority: "ALTA" as const,
    category: "Robo",
    guards: ["Guardia Juan (Zona Sur)", "Guardia Pedro (Zona Norte)"],
  },
  {
    id: "RD-004",
    title: "Emergencia médica",
    priority: "ALTA" as const,
    category: "Médico",
    guards: ["Guardia Juan (Zona Sur)", "Guardia Ana (Centro)"],
  },
];

export default function IncidentAssignList() {
  return (
    <section className="mt-4 flex flex-col gap-4">
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Asignación de incidentes pendientes
        </h2>
        <hr className="mt-2 border-slate-300" />
      </div>
      {PENDING_INCIDENTS.map((incident) => (
        <IncidentCard key={incident.id} {...incident} />
      ))}
    </section>
  );
}
