import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import ReportIncidentModal from "@/components/ui/ReportIncidentModal";
import PastIncidentsModal from "@/components/ui/PastIncidentsModal";

export default function ActionButtons() {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isPastOpen, setIsPastOpen] = useState(false);

  const ACTIONS = [
    {
      label: "Generar reporte",
      icon: <FaPlus className="h-5 w-5" aria-hidden="true" />,
      iconBg: "bg-blue-100 text-blue-700",
      onClick: () => setIsReportOpen(true),
    },
    {
      label: "Ver reportes pasados",
      icon: <IoTimeOutline className="h-6 w-6" aria-hidden="true" />,
      iconBg: "bg-slate-100 text-slate-700",
      onClick: () => setIsPastOpen(true),
    },
  ];

  return (
    <>
      <section
        className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        aria-label="Acciones principales"
      >
        {ACTIONS.map(({ label, icon, iconBg, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            aria-label={label}
            className="group flex min-h-40 w-[20rem] max-w-full flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-center text-base font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:h-[20rem] sm:w-[20rem]"
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-110 ${iconBg}`}
            >
              {icon}
            </span>
            {label}
          </button>
        ))}
      </section>

      <ReportIncidentModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
      <PastIncidentsModal
        isOpen={isPastOpen}
        onClose={() => setIsPastOpen(false)}
      />
    </>
  );
}
