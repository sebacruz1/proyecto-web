import { useState } from "react";
import { IoClose, IoMailOutline } from "react-icons/io5";
import { api, ApiError } from "@/lib/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ForgotPasswordModal({ isOpen, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sanitizeEmail = (value: string) => value.trim().toLowerCase();

  const handleClose = () => {
    setEmail("");
    setError("");
    setSuccess("");
    onClose();
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanEmail = sanitizeEmail(email);
    if (!cleanEmail) {
      setError("El correo electrónico es obligatorio.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    setLoading(true);
    try {
      const data = await api.post<{ message: string }>("/api/forgot-password", {
        email: cleanEmail,
      });
      setSuccess(data.message);
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message);
      } else {
        setError("No se pudo conectar al servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-800">
            Recuperar contraseña
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar modal"
          >
            <IoClose className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-5 mt-1 text-sm text-slate-500">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu
          contraseña.
        </p>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <IoMailOutline className="h-7 w-7 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-emerald-700">{success}</p>
            <p className="text-xs text-slate-100">
              Revisa tu bandeja de entrada y sigue las instrucciones.
            </p>
            <p className="text-xs text-slate-400">
              En desarrollo, no tiene funcionalidad real.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-2 h-10 w-full rounded-xl bg-blue-800 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Entendido
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <label
              htmlFor="forgot-email"
              className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-600"
            >
              Correo electrónico
            </label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              onBlur={() => setEmail((prev) => sanitizeEmail(prev))}
              placeholder="usuario@email.com"
              autoComplete="email"
              className={`h-11 w-full rounded-xl border px-4 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                error
                  ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

            <div className="mt-5 flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="h-11 flex-1 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="h-11 flex-1 rounded-xl bg-blue-800 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Verificando..." : "Enviar enlace"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
