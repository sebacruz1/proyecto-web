import { setAuthUser } from "@/lib/authUser";
import Navbar from "@/components/layout/Navbar";
import RegisterModal from "@/components/ui/RegisterModal";
import { useState } from "react";
import {
    IoAlertCircleOutline,
    IoEye,
    IoEyeOff,
    IoReloadOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [accessType, setAccessType] = useState<"ciudadano" | "municipal">(
    "ciudadano",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const sanitizeEmail = (value: string) => value.trim().toLowerCase();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const cleanEmail = sanitizeEmail(email);
    setEmail(cleanEmail);

    if (!cleanEmail || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

    try {
      const response = await fetch(`${apiBaseUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail.toLowerCase(),
          password,
        }),
      });

      const payload = (await response.json()) as {
        id?: number;
        message?: string;
        role?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        rut?: string;
        address?: string;
      };

      if (!response.ok) {
        setError(
          payload.message ?? "Credenciales incorrectas. Intenta nuevamente.",
        );
        return;
      }

      const userRole = payload.role ?? "";
      const validRoles = ["admin", "user", "patrullero"] as const;

      if (!validRoles.includes(userRole as (typeof validRoles)[number])) {
        setError("Rol de usuario no soportado.");
        return;
      }

      const typedRole = userRole as (typeof validRoles)[number];

      if (accessType === "ciudadano" && userRole !== "user") {
        setError("Este acceso es solo para ciudadanos.");
        return;
      }

      if (accessType === "municipal" && userRole === "user") {
        setError("Este acceso es solo para personal municipal.");
        return;
      }

      if (!payload.id || !payload.email) {
        setError("No se pudieron leer los datos del usuario.");
        return;
      }

      setAuthUser({
        id: payload.id,
        email: payload.email,
        role: typedRole,
        firstName: payload.firstName ?? "Usuario",
        lastName: payload.lastName ?? "",
        rut: payload.rut ?? "No disponible",
        address: payload.address ?? "No disponible",
      });

      navigate(`/${userRole}/dashboard`, { replace: true });
    } catch {
      setError("No se pudo conectar al servidor de autenticación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden">
      <Navbar />
      <div className="absolute -top-24 -left-10 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />

      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-800">
              ACCESO IDENTIFICADO
            </h1>
            <p className="text-slate-600 font-semibold text-sm mt-1">
              Seguridad Ciudadana Municipal
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur rounded-2xl border border-slate-200 p-8 shadow-xl shadow-slate-300/40">
            <div className="mb-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-600">
                Tipo de acceso
              </p>
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setAccessType("ciudadano")}
                  className={`h-10 rounded-lg text-sm font-medium transition ${
                    accessType === "ciudadano"
                      ? "bg-blue-700 text-white shadow"
                      : "bg-transparent text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Ciudadano
                </button>
                <button
                  type="button"
                  onClick={() => setAccessType("municipal")}
                  className={`h-10 rounded-lg text-sm font-medium transition ${
                    accessType === "municipal"
                      ? "bg-blue-700 text-white shadow"
                      : "bg-transparent text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Personal municipal
                </button>
              </div>
            </div>

            <div className="mb-6 text-slate-600 text-sm">
              <strong>Credenciales de prueba:</strong>
              {accessType === "municipal" ? (
                <ul>
                  <li>admin@correo.com | password</li>
                  <li>patrullero@correo.com | password</li>
                </ul>
              ) : (
                <ul>
                  <li>user@correo.com | password</li>
                </ul>
              )}
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2"
                >
                  RUT / CORREO
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmail((prev) => sanitizeEmail(prev))}
                  placeholder="Ingrese su identificaión"
                  autoComplete="email"
                  required
                  className="w-full h-11 bg-white border border-slate-300 rounded-xl px-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full h-11 bg-white border border-slate-300 rounded-xl px-4 pr-12 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    aria-label={
                      showPass ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition"
                  >
                    {showPass ? <IoEyeOff /> : <IoEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600">Recordarme</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-500 transition"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
                  <IoAlertCircleOutline className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-blue-800 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-white text-sm font-medium transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30"
              >
                {loading ? (
                  <>
                    <IoReloadOutline className="w-4 h-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  "ENTRAR AL PORTAL"
                )}
              </button>
            </form>

            <button
              type="button"
              onClick={() => setIsRegisterOpen(true)}
              className="block mx-auto mt-4 text-blue-700 text-sm font-medium transition hover:text-blue-900"
            >
              ¿No tiene cuenta? Registrese aquí
            </button>
          </div>
        </div>
      </div>
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </div>
  );
}
