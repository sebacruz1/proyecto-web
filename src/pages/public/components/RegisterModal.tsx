import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { api, ApiError } from "@/lib/api";

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const sanitizeEmail = (value: string) => value.trim().toLowerCase();

  const clearFieldError = (field: string) =>
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const handleRegisterSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setServerError("");
    setRegisterSuccess("");

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanRut = rut.trim();
    const cleanAddress = address.trim();
    const cleanEmail = sanitizeEmail(registerEmail);
    setRegisterEmail(cleanEmail);

    const errors: Record<string, string> = {};
    if (!cleanFirstName) errors.firstName = "El nombre es obligatorio.";
    if (!cleanLastName) errors.lastName = "El apellido es obligatorio.";
    if (!cleanRut) errors.rut = "El RUT es obligatorio.";
    if (!cleanAddress) errors.address = "La dirección es obligatoria.";
    if (!cleanEmail) errors.email = "El correo electrónico es obligatorio.";
    if (!registerPassword) errors.password = "La contraseña es obligatoria.";
    else if (registerPassword.length < 6)
      errors.password = "Mínimo 6 caracteres.";
    if (!registerConfirmPassword)
      errors.confirmPassword = "Confirma tu contraseña.";
    else if (registerPassword !== registerConfirmPassword)
      errors.confirmPassword = "Las contraseñas no coinciden.";
    if (!acceptedTerms)
      errors.terms = "Debes aceptar los términos y condiciones.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    try {
      await api.post("/api/register", {
        firstName: cleanFirstName,
        lastName: cleanLastName,
        rut: cleanRut,
        address: cleanAddress,
        email: cleanEmail,
        password: registerPassword,
      });
      setRegisterSuccess("¡Cuenta creada! Ya puedes iniciar sesión.");
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.fields) setFieldErrors(e.fields);
        setServerError(e.message);
      } else {
        setServerError("No se pudo conectar al servidor.");
      }
    }
  };

  if (!isOpen) return null;

  const inputClass = (field: string) =>
    `h-11 w-full rounded-xl border px-4 text-sm text-slate-900 outline-none transition focus:ring-2 ${
      fieldErrors[field]
        ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
        : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl lg:max-w-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-800">
            Registro Único Ciudadano
          </h3>
          <button
            type="button"
            onClick={onClose}
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
                onChange={(e) => {
                  setFirstName(e.target.value);
                  clearFieldError("firstName");
                }}
                className={inputClass("firstName")}
                placeholder="Tu nombre"
                autoComplete="given-name"
              />
              {fieldErrors.firstName && (
                <p className="mt-1 text-xs text-red-500">
                  {fieldErrors.firstName}
                </p>
              )}
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
                onChange={(e) => {
                  setLastName(e.target.value);
                  clearFieldError("lastName");
                }}
                className={inputClass("lastName")}
                placeholder="Tu apellido"
                autoComplete="family-name"
              />
              {fieldErrors.lastName && (
                <p className="mt-1 text-xs text-red-500">
                  {fieldErrors.lastName}
                </p>
              )}
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
                onChange={(e) => {
                  setRut(e.target.value);
                  clearFieldError("rut");
                }}
                className={inputClass("rut")}
                placeholder="12.345.678-9"
              />
              {fieldErrors.rut && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.rut}</p>
              )}
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
                onChange={(e) => {
                  setAddress(e.target.value);
                  clearFieldError("address");
                }}
                className={inputClass("address")}
                placeholder="Tu dirección"
                autoComplete="street-address"
              />
              {fieldErrors.address && (
                <p className="mt-1 text-xs text-red-500">
                  {fieldErrors.address}
                </p>
              )}
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
                onChange={(e) => {
                  setRegisterEmail(e.target.value);
                  clearFieldError("email");
                }}
                onBlur={() => setRegisterEmail((prev) => sanitizeEmail(prev))}
                className={inputClass("email")}
                placeholder="usuario@email.com"
                autoComplete="email"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
              )}
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
                onChange={(e) => {
                  setRegisterPassword(e.target.value);
                  clearFieldError("password");
                }}
                className={inputClass("password")}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
              />
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {fieldErrors.password}
                </p>
              )}
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
                onChange={(e) => {
                  setRegisterConfirmPassword(e.target.value);
                  clearFieldError("confirmPassword");
                }}
                className={inputClass("confirmPassword")}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <label
            className={`mb-1 flex cursor-pointer items-start gap-2 rounded-xl border px-3 py-2 ${fieldErrors.terms ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50"}`}
          >
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => {
                setAcceptedTerms(e.target.checked);
                clearFieldError("terms");
              }}
              className="mt-0.5 h-4 w-4 rounded accent-blue-700"
            />
            <span className="text-sm text-slate-700">
              Acepto los términos y condiciones.
            </span>
          </label>
          {fieldErrors.terms && (
            <p className="mb-3 mt-1 text-xs text-red-500">
              {fieldErrors.terms}
            </p>
          )}

          {serverError && (
            <div className="mb-3 mt-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-500">{serverError}</p>
            </div>
          )}

          {registerSuccess && (
            <div className="mb-3 mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
              <p className="text-sm text-emerald-600">{registerSuccess}</p>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
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
