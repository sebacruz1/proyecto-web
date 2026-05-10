import { FaPlus } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";

const ACTIONS = [
  {
    label: "Generar reporte",
    icon: <FaPlus className="h-5 w-5" />,
    iconBg: "bg-blue-100 text-blue-700",
    onClick: () => {},
  },
  {
    label: "Ver reportes pasados",
    icon: <IoTimeOutline className="h-6 w-6" />,
    iconBg: "bg-slate-100 text-slate-700",
    onClick: () => {},
  },
];

export default function ActionButtons() {
  return (
    <section className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      {ACTIONS.map(({ label, icon, iconBg, onClick }) => (
        <button
          key={label}
          type="button"
          onClick={onClick}
          className="flex min-h-40 w-[20rem] max-w-full flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-center text-base font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 sm:h-[20rem] sm:w-[20rem]"
        >
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}
          >
            {icon}
          </span>
          {label}
        </button>
      ))}
    </section>
  );
}
