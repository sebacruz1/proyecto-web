import { useState } from "react";
import { IoClose, IoReloadOutline } from "react-icons/io5";
import { ApiError } from "@/lib/api";

export type UserToEdit = {
  id: number;
  first_name: string;
  last_name: string;
  address: string;
  phone: string | null;
  email: string;
  role: string;
};

type Props = {
  user: UserToEdit | null;
  onClose: () => void;
  onSave: (
    id: number,
    data: {
      firstName: string;
      lastName: string;
      address: string;
      phone: string | null;
    },
  ) => Promise<void>;
};

export default function EditUserModal({ user, onClose, onSave }: Props) {
  const [firstName, setFirstName] = useState(() => user?.first_name ?? "");
  const [lastName, setLastName] = useState(() => user?.last_name ?? "");
  const [address, setAddress] = useState(() => user?.address ?? "");
  const [phone, setPhone] = useState(() => user?.phone ?? "");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  if (!user) return null;

  const clearFieldError = (field: string) =>
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setServerError("");

    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = "El nombre es obligatorio.";
    if (!lastName.trim()) errors.lastName = "El apellido es obligatorio.";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await onSave(user.id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        address: address.trim(),
        phone: phone.trim() || null,
      });
      onClose();
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.fields && Object.keys(e.fields).length > 0) {
          setFieldErrors(e.fields);
        } else {
          setServerError(e.message);
        }
      } else {
        setServerError("No se pudo conectar al servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `h-11 w-full rounded-xl border px-4 text-sm outline-none transition focus:ring-2 ${
      fieldErrors[field]
        ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
        : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-blue-800">
            Editar usuario
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100"
            aria-label="Cerrar"
          >
            <IoClose className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-5 text-sm text-slate-500">
          {user.email} — <span className="capitalize">{user.role}</span>
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-600">
                Nombre
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  clearFieldError("firstName");
                }}
                className={inputClass("firstName")}
                placeholder="Juan"
              />
              {fieldErrors.firstName && (
                <p className="mt-1 text-xs text-red-500">
                  {fieldErrors.firstName}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-600">
                Apellido
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  clearFieldError("lastName");
                }}
                className={inputClass("lastName")}
                placeholder="Pérez"
              />
              {fieldErrors.lastName && (
                <p className="mt-1 text-xs text-red-500">
                  {fieldErrors.lastName}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-600">
              Dirección{" "}
              <span className="normal-case text-slate-400">(opcional)</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                clearFieldError("address");
              }}
              className={inputClass("address")}
              placeholder="Av. Principal 123"
            />
            {fieldErrors.address && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.address}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-600">
              Teléfono{" "}
              <span className="normal-case text-slate-400">(opcional)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                clearFieldError("phone");
              }}
              className={inputClass("phone")}
              placeholder="+56912345678"
            />
            {fieldErrors.phone && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>
            )}
          </div>

          {serverError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-500">{serverError}</p>
            </div>
          )}

          <div className="flex gap-2 mt-1">
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
              className="h-11 flex-1 rounded-xl bg-blue-800 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <IoReloadOutline className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
