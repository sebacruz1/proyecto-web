import logo from "@/assets/santodomingo.webp";
import { useEffect, useRef, useState } from "react";
import {
  IoAlertCircleOutline,
  IoEye,
  IoEyeOff,
  IoReloadOutline,
} from "react-icons/io5";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    timeoutRef.current = window.setTimeout(() => {
      setLoading(false);
      setError("Credenciales incorrectas. Intenta nuevamente.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute -top-24 -left-10 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/95 mb-4 shadow-lg">
            <img
              src={logo}
              alt="Logo Municipalidad de Santo Domingo"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Sistema de Patrullaje
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Municipalidad de Santo Domingo
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-2xl border border-slate-200 p-8 shadow-xl shadow-slate-300/40">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            Iniciar sesión
          </h2>
          <p className="text-slate-600 text-sm mb-6">Ingresa tus datos</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-2"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@email.com"
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
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-white text-sm font-medium transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30"
            >
              {loading ? (
                <>
                  <IoReloadOutline className="w-4 h-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Ingresar al sistema"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
