import { IoClose } from "react-icons/io5";
import UserList from "./UserList";
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
  isOpen: boolean;
  users: User[];
  loading: boolean;
  onClose: () => void;
  onEdit: (user: UserToEdit) => void;
  onDelete: (id: number) => void;
};

export default function UsersManagementModal({
  isOpen,
  users,
  loading,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-800">Editar usuarios</h3>
            <p className="text-sm text-slate-500">
              Selecciona un usuario para abrir su edición.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100"
            aria-label="Cerrar"
          >
            <IoClose className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <UserList
            users={users}
            loading={loading}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
}
