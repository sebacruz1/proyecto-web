import { MdArrowForwardIos } from "react-icons/md";

const priorityStyles = {
  ALTA: "bg-red-100 text-red-800 border-red-200",
  MEDIA: "bg-yellow-100 text-yellow-800 border-yellow-200",
  BAJA: "bg-green-100 text-green-800 border-green-200",
};

interface Props {
  id: string;
  title: string;
  priority: "ALTA" | "MEDIA" | "BAJA";
  category: string;
  date: string;
  onClick?: () => void;
}

export default function AssignedIncidentCard({
  id,
  title,
  priority,
  category,
  date,
  onClick,
}: Props) {
  return (
    <article
      onClick={onClick}
      className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:bg-slate-50"
    >
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`rounded border px-2 py-0.5 text-[10px] font-bold ${priorityStyles[priority]}`}
          >
            {priority}
          </span>
          <span className="text-xs font-semibold text-slate-400">{id}</span>
        </div>
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        <p className="mt-1 text-xs font-medium text-slate-500">
          {date} | {category}
        </p>
      </div>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <MdArrowForwardIos />
      </div>
    </article>
  );
}
