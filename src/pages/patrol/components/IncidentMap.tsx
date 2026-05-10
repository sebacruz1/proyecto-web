export default function IncidentMap() {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="px-1 text-sm font-bold uppercase tracking-wide text-slate-500">
        Vista de incidentes globales
      </h2>
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-sm h-80">
        <iframe
          title="Mapa de incidentes"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-71.67%2C-33.66%2C-71.58%2C-33.58&layer=mapnik"
          className="h-full w-full rounded-lg"
          loading="lazy"
        />
      </div>
    </section>
  );
}
