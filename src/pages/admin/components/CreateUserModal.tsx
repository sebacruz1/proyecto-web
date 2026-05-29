import { useEffect, useState } from "react";
import { IoClose, IoReloadOutline } from "react-icons/io5";
import { getAuthUser } from "@/lib/authUser";

type RoleOption = { id: number; name: string; display_name: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export default function CreateUserModal({ isOpen, onClose, onCreated }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [rut, setRut] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleName, setRoleName] = useState("patrullero");
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const token = getAuthUser()?.token ?? "";
    fetch(`${BASE}/api/roles`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data: RoleOption[]) => {
        setRoles(data);
        if (data.length > 0 && !data.find((r) => r.name === roleName)) {
          setRoleName(data[0].name);
        }
      })
      .catch(() => {});
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = () => {
    setFirstName("");
    setLastName("");
    setRut("");
    setAddress("");
    setPhone("");
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const authUser = getAuthUser();
    if (!authUser?.token) {
      setError("Sesión expirada.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUser.token}`,
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          rut: rut.trim(),
          address: address.trim(),
          phone: phone.trim() || undefined,
          email: email.trim().toLowerCase(),
          password,
          role: roleName,
        }),
      });
      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(payload.message ?? "Error al crear el usuario.");
        return;
      }
      reset();
      onCreated();
      onClose();
    } catch {
      setError("No se pudo conectar al servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-blue-800">Crear usuario</h3>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100"
            aria-label="Cerrar"
          >
            <IoClose className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-5 text-sm text-slate-500">
          El usuario podrá iniciar sesión inmediatamente.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Rol desde BD */}
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-600">
              Rol
            </p>
            {roles.length === 0 ? (
              <p className="text-sm text-slate-400">Cargando roles...</p>
            ) : (
              <div
                className={`grid gap-2 rounded-xl bg-slate-100 p-1`}
                style={{ gridTemplateColumns: `repeat(${roles.length}, 1fr)` }}
              >
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRoleName(r.name)}
                    className={`h-9 rounded-lg text-sm font-medium transition ${
                      roleName === r.name
                        ? "bg-blue-700 text-white shadow"
                        : "bg-transparent text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {r.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mb-3 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-600">
                Nombre
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Juan"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-600">
                Apellido
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Pérez"
              />
            </div>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-600">
                RUT
              </label>
              <input
                type="text"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                required
                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="12.345.678-9"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-600">
                Teléfono{" "}
                <span className="normal-case text-slate-400">(opcional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="+56912345678"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-600">
              Dirección
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Av. Principal 123"
            />
          </div>

          <div className="mb-3 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-600">
                Correo
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="usuario@correo.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-600">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </div>

          {error && (
            <div className="mb-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="h-11 flex-1 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || roles.length === 0}
              className="h-11 flex-1 rounded-xl bg-blue-800 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <IoReloadOutline className="h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear usuario"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
