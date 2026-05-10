import { IoCall } from "react-icons/io5";

export default function SOS() {
  return (
    <section className="mt-8 flex justify-center">
      <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm lg:h-[20rem]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-400 text-white">
          <IoCall className="h-8 w-8" />
        </div>
        <p className="mt-4 text-3xl font-bold text-red-600">SOS 1458</p>
        <p className="mt-1 text-sm font-medium text-slate-600">
          Botón de emergencia
        </p>
        <button
          type="button"
          className="uppercase mt-5 h-11 w-full rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-500"
        >
          Solicitar ayuda ahora
        </button>
      </div>
    </section>
  );
}
