import { useEffect, useState } from "react";
import {
  IoCheckmarkCircleOutline,
  IoClose,
  IoLocateOutline,
} from "react-icons/io5";
import { api, ApiError } from "@/lib/api";

const INCIDENT_TYPES = [
  "Accidente Vehicular",
  "Luminaria Dañada",
  "Ruido Excesivo",
  "Vehículo Sospechoso",
  "Persona Sospechosa",
  "Vandalismo",
  "Basura Clandestina",
  "Otro",
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ReportIncidentModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;
  return <ReportIncidentContent onClose={onClose} />;
}

function ReportIncidentContent({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsError, setGpsError] = useState(() =>
    !navigator.geolocation ? "Tu navegador no soporta geolocalización." : "",
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setGpsError("No se pudo obtener tu ubicación. Verifica los permisos de GPS."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");

    const errors: Record<string, string> = {};
    if (!type) errors.type = "Selecciona un tipo de incidente.";
    if (!description.trim()) errors.description = "La descripción es obligatoria.";
    else if (description.trim().length < 10) errors.description = "Mínimo 10 caracteres.";
    if (!location) errors.location = gpsError || "Esperando ubicación GPS...";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoading(true);

    try {
      await api.post("/api/incidents", {
        type,
        description: description.trim(),
        lat: location!.lat,
        lng: location!.lng,
      });
      setSuccess(true);
    } catch (e) {
      if (e instanceof ApiError) setServerError(e.message);
      else setServerError("No se pudo conectar al servidor.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-xl border px-4 text-sm text-slate-900 outline-none transition focus:ring-2 ${
      fieldErrors[field]
        ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
        : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-800">Reportar incidente</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar modal"
          >
            <IoClose className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-5 mt-1 text-sm text-slate-500">
          Completa el formulario para enviar un reporte a la municipalidad.
        </p>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <IoCheckmarkCircleOutline className="h-8 w-8 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-emerald-700">
              ¡Reporte enviado correctamente!
            </p>
            <p className="text-xs text-slate-400">
              El personal municipal revisará tu reporte a la brevedad.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 h-10 w-full rounded-xl bg-blue-800 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Aceptar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="incident-type"
                className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-600"
              >
                Tipo de incidente
              </label>
              <select
                id="incident-type"
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setFieldErrors((p) => ({ ...p, type: "" }));
                }}
                className={`${inputClass("type")} h-11 bg-white`}
              >
                <option value="">Selecciona una opción...</option>
                {INCIDENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {fieldErrors.type && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.type}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="incident-description"
                className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-600"
              >
                Descripción
              </label>
              <textarea
                id="incident-description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setFieldErrors((p) => ({ ...p, description: "" }));
                }}
                maxLength={1000}
                rows={4}
                placeholder="Describe el incidente con el mayor detalle posible..."
                className={`${inputClass("description")} resize-none py-3`}
              />
              <div className="flex items-start justify-between">
                {fieldErrors.description ? (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.description}</p>
                ) : (
                  <span />
                )}
                <span className="mt-1 text-xs text-slate-400">{description.length}/1000</span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <IoLocateOutline
                className={`h-5 w-5 shrink-0 ${location ? "text-emerald-500" : "text-slate-400"}`}
              />
              <span className="text-xs text-slate-600">
                {location
                  ? `Ubicación obtenida (${location.lat.toFixed(5)}, ${location.lng.toFixed(5)})`
                  : gpsError || "Obteniendo tu ubicación GPS..."}
              </span>
            </div>
            {fieldErrors.location && (
              <p className="-mt-2 text-xs text-red-500">{fieldErrors.location}</p>
            )}

            {serverError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-sm text-red-500">{serverError}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-11 flex-1 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="h-11 flex-1 rounded-xl bg-blue-800 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Enviando..." : "Enviar reporte"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
