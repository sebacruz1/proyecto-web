import { useState } from "react";
import {
  IoClose,
  IoLocationOutline,
  IoReloadOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/components/ui/ToastProvider";

export interface AssignedIncident {
  id: number;
  type: string;
  description: string;
  status: string;
  assignment_status: string;
  lat: number;
  lng: number;
  created_at: string;
}

type Props = {
  incident: AssignedIncident;
  onClose: () => void;
  onUpdated: () => void;
};

const INCIDENT_STATUS_LABEL: Record<string, string> = {
  recibido: "Recibido",
  en_desarrollo: "En desarrollo",
  resuelto: "Resuelto",
};

const ASSIGNMENT_STATUS_LABEL: Record<string, string> = {
  asignado: "Asignado",
  en_camino: "En camino",
  completado: "Completado",
};

const ASSIGNMENT_STATUS_CLASS: Record<string, string> = {
  asignado: "bg-yellow-100 text-yellow-700 border-yellow-200",
  en_camino: "bg-blue-100 text-blue-700 border-blue-200",
  completado: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export default function IncidentDetailModal({
  incident,
  onClose,
  onUpdated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleUpdateStatus = async (newStatus: "en_camino" | "completado") => {
    setLoading(true);
    try {
      await api.patch(`/api/assignments/${incident.id}`, { status: newStatus });
      showToast("Estado actualizado correctamente.", "success");
      onUpdated();
      onClose();
    } catch (e) {
      const msg =
        e instanceof ApiError ? e.message : "No se pudo conectar al servidor.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const date = new Date(incident.created_at).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-2000 flex items-end justify-center bg-slate-900/50 px-4 pb-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 p-5">
          <div>
            <p className="text-xs font-semibold text-slate-400">
              INC-{incident.id}
            </p>
            <h3 className="mt-0.5 text-base font-bold text-slate-800">
              {incident.type}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100"
            aria-label="Cerrar"
          >
            <IoClose className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 p-5">
          {/* Estados */}
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {INCIDENT_STATUS_LABEL[incident.status] ?? incident.status}
            </span>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                ASSIGNMENT_STATUS_CLASS[incident.assignment_status] ??
                "bg-slate-100 text-slate-600"
              }`}
            >
              {ASSIGNMENT_STATUS_LABEL[incident.assignment_status] ??
                incident.assignment_status}
            </span>
          </div>

          {/* Descripción */}
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Descripción
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              {incident.description}
            </p>
          </div>

          {/* Fecha */}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <IoTimeOutline className="h-4 w-4 shrink-0" />
            <span>{date}</span>
          </div>

          {/* Ubicación */}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <IoLocationOutline className="h-4 w-4 shrink-0" />
            <a
              href={`https://www.google.com/maps?q=${Number(incident.lat)},${Number(incident.lng)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-blue-700"
            >
              {Number(incident.lat).toFixed(5)},{" "}
              {Number(incident.lng).toFixed(5)}
            </a>
          </div>

          {/* Acciones */}
          {incident.assignment_status === "asignado" && (
            <button
              type="button"
              onClick={() => handleUpdateStatus("en_camino")}
              disabled={loading}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-60"
            >
              {loading && <IoReloadOutline className="h-4 w-4 animate-spin" />}
              En camino
            </button>
          )}

          {incident.assignment_status === "en_camino" && (
            <button
              type="button"
              onClick={() => handleUpdateStatus("completado")}
              disabled={loading}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60"
            >
              {loading && <IoReloadOutline className="h-4 w-4 animate-spin" />}
              Marcar como completado
            </button>
          )}

          {incident.assignment_status === "completado" && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-700">
              Asignación completada
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
