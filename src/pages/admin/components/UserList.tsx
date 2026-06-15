import { IoPencilOutline, IoTrashOutline } from "react-icons/io5";
import type { UserToEdit } from "./EditUserModal";

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string;
  role: string;
  role_display: string;
};

type Props = {
  users: User[];
  loading: boolean;
  onEdit: (user: UserToEdit) => void;
  onDelete: (id: number) => void;
};

const ROLE_CLASS: Record<string, string> = {
  admin:      "bg-purple-100 text-purple-700",
  patrullero: "bg-blue-100 text-blue-700",
  user:       "bg-slate-100 text-slate-600",
};

export default function UserList({ users, loading, onEdit, onDelete }: Props) {
  return (
    <section className="mt-4 flex flex-col gap-4">
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Gestión de usuarios
        </h2>
        <hr className="mt-2 border-slate-300" />
      </div>

      {loading ? (
        <p className="py-6 text-center text-sm text-slate-400">Cargando...</p>
      ) : users.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">No hay usuarios registrados.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {users.map((u) => (
            <li
              key={u.id}
              className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800 truncate">
                    {u.first_name} {u.last_name}
                  </span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_CLASS[u.role] ?? "bg-slate-100 text-slate-600"}`}>
                    {u.role_display}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-400 truncate">{u.email}</p>
              </div>

              <div className="flex shrink-0 items-center gap-1 ml-3">
                <button
                  type="button"
                  onClick={() => onEdit({
                    id: u.id,
                    first_name: u.first_name,
                    last_name: u.last_name,
                    address: u.address,
                    phone: u.phone,
                    email: u.email,
                    role: u.role,
                  })}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                  title="Editar usuario"
                >
                  <IoPencilOutline className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(u.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                  title="Eliminar usuario"
                >
                  <IoTrashOutline className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
