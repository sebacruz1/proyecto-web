import { useEffect, useState } from "react";
import {
  IoClose,
  IoDocumentTextOutline,
  IoReloadOutline,
} from "react-icons/io5";
import { api, ApiError } from "@/lib/api";

type Incident = {
  id: number;
  type: string;
  description: string;
  status: "recibido" | "en_desarrollo" | "resuelto";
  created_at: string;
};

const STATUS_LABEL: Record<Incident["status"], string> = {
  recibido: "Recibido",
  en_desarrollo: "En desarrollo",
  resuelto: "Resuelto",
};

const STATUS_CLASS: Record<Incident["status"], string> = {
  recibido: "bg-yellow-100 text-yellow-700",
  en_desarrollo: "bg-blue-100 text-blue-700",
  resuelto: "bg-emerald-100 text-emerald-700",
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PastIncidentsModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;
  return <PastIncidentsContent onClose={onClose} />;
}

function PastIncidentsContent({ onClose }: { onClose: () => void }) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Incident[]>("/api/incidents?mine=true")
      .then(setIncidents)
      .catch((e) => {
        if (e instanceof ApiError) setError(e.message);
        else setError("No se pudo conectar al servidor.");
      })
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div
        className="flex w-full max-w-lg flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl"
        style={{ maxHeight: "85vh" }}
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-6 pb-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-800">
              Mis reportes
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Historial de incidentes que has reportado.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar modal"
          >
            <IoClose className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-400">
              <IoReloadOutline className="h-8 w-8 animate-spin" />
              <p className="text-sm">Cargando reportes...</p>
            </div>
          )}

          {!loading && error && (
            <p className="py-8 text-center text-sm text-red-500">{error}</p>
          )}

          {!loading && !error && incidents.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-400">
              <IoDocumentTextOutline className="h-10 w-10" />
              <p className="text-sm font-medium">
                No has realizado ningún reporte aún.
              </p>
            </div>
          )}

          {!loading && !error && incidents.length > 0 && (
            <ul className="flex flex-col gap-3">
              {incidents.map((inc) => (
                <li
                  key={inc.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-800">
                      {inc.type}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASS[inc.status]}`}
                    >
                      {STATUS_LABEL[inc.status]}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">
                    {inc.description}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    {formatDate(inc.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 w-full rounded-xl border border-slate-300 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
