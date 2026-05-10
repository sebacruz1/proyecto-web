import { IoIosSend } from "react-icons/io";

interface Props {
  isShiftStarted: boolean;
  onToggle: () => void;
}

export default function ShiftPanel({ isShiftStarted, onToggle }: Props) {
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
        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200">
          <IoIosSend />
        </button>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className={`w-full rounded-md py-4 text-sm font-bold uppercase text-white transition shadow-sm ${
          isShiftStarted
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isShiftStarted ? "Finalizar turno" : "Iniciar turno (Validar GPS)"}
      </button>
    </section>
  );
}
