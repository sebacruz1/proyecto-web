import { useState } from "react";
import { IoClose } from "react-icons/io5";

type RegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [rut, setRut] = useState("");
  const [address, setAddress] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const sanitizeEmail = (value: string) => value.trim().toLowerCase();

  const closeModal = () => {
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanRut = rut.trim();
    const cleanAddress = address.trim();
    const cleanEmail = sanitizeEmail(registerEmail);
    setRegisterEmail(cleanEmail);

    if (
      !cleanFirstName ||
      !cleanLastName ||
      !cleanRut ||
      !cleanAddress ||
      !cleanEmail ||
      !registerPassword ||
      !registerConfirmPassword
    ) {
      setRegisterError("Completa todos los campos.");
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError("Las contraseñas no coinciden.");
      return;
    }

    if (!acceptedTerms) {
      setRegisterError("Debes aceptar los términos y condiciones.");
      return;
    }

    setRegisterSuccess("Cuenta creada en modo demo.");
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl lg:max-w-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-800">
            Registro Único Ciudadano
          </h3>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar modal"
          >
            <IoClose className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-sm text-slate-500">
          Ingrese sus datos para acceder al sistema municipal.
        </p>

        <form onSubmit={handleRegisterSubmit} noValidate>
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label
                htmlFor="registerFirstName"
                className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-600"
              >
                Nombre
              </label>
              <input
                id="registerFirstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Tu nombre"
                autoComplete="given-name"
              />
            </div>

            <div>
              <label
                htmlFor="registerLastName"
                className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-600"
              >
                Apellido
              </label>
              <input
                id="registerLastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Tu apellido"
                autoComplete="family-name"
              />
            </div>

            <div>
              <label
                htmlFor="registerRut"
                className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-600"
              >
                RUT
              </label>
              <input
                id="registerRut"
                type="text"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="12.345.678-9"
              />
            </div>

            <div>
              <label
                htmlFor="registerAddress"
                className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-600"
              >
                Dirección
              </label>
              <input
                id="registerAddress"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Tu dirección"
                autoComplete="street-address"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="registerEmail"
                className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-600"
              >
                Correo electrónico
              </label>
            <input
              id="registerEmail"
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              onBlur={() => setRegisterEmail((prev) => sanitizeEmail(prev))}
              className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="usuario@email.com"
              autoComplete="email"
              />
            </div>

            <div>
              <label
                htmlFor="registerPassword"
                className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-600"
              >
                Contraseña
              </label>
              <input
                id="registerPassword"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label
                htmlFor="registerConfirmPassword"
                className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-600"
              >
                Confirmar contraseña
              </label>
              <input
                id="registerConfirmPassword"
                type="password"
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
              />
            </div>
          </div>

          <label className="mb-4 flex cursor-pointer items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded accent-blue-700"
            />
            <span className="text-sm text-slate-700">
              Acepto los términos y condiciones.
            </span>
          </label>

          {registerError && (
            <div className="mb-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-500">{registerError}</p>
            </div>
          )}

          {registerSuccess && (
            <div className="mb-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
              <p className="text-sm text-emerald-600">{registerSuccess}</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="h-11 flex-1 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-11 flex-1 rounded-xl bg-blue-800 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Crear cuenta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
