import { IoReloadOutline, IoLocationOutline, IoWarningOutline } from "react-icons/io5";

interface Props {
  isShiftStarted: boolean;
  loading: boolean;
  gpsError: string;
  onStart: () => void;
  onEnd: () => void;
}

export default function ShiftPanel({ isShiftStarted, loading, gpsError, onStart, onEnd }: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wide text-blue-900">
            Panel de patrullaje
          </h1>
          <p className="mt-1 text-xs font-semibold uppercase text-slate-400">
            Central de monitoreo comunal
          </p>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
          isShiftStarted
            ? "bg-green-100 text-green-700"
            : "bg-slate-100 text-slate-500"
        }`}>
          <IoLocationOutline className="h-3.5 w-3.5" />
          {isShiftStarted ? "En turno" : "Sin turno"}
        </div>
      </div>

      {gpsError && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <IoWarningOutline className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{gpsError}</p>
        </div>
      )}

      <button
        type="button"
        onClick={isShiftStarted ? onEnd : onStart}
        disabled={loading}
        className={`w-full rounded-md py-4 text-sm font-bold uppercase text-white transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 ${
          isShiftStarted
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? (
          <>
            <IoReloadOutline className="h-4 w-4 animate-spin" />
            {isShiftStarted ? "Finalizando..." : "Obteniendo ubicación..."}
          </>
        ) : isShiftStarted ? (
          "Finalizar turno"
        ) : (
          <>
            <IoLocationOutline className="h-4 w-4" />
            Iniciar turno
          </>
        )}
      </button>

      {isShiftStarted && (
        <p className="mt-3 text-center text-xs text-slate-400">
          Tu posición se actualiza automáticamente cada 30 segundos
        </p>
      )}
    </section>
  );
}
