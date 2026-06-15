import logo from "@/assets/santodomingo.webp";

type NavbarProps = {
  role?: string;
  onLogout?: () => void;
  onEditProfile?: () => void;
};

export default function Navbar({ role, onLogout, onEditProfile }: NavbarProps) {
  return (
    <header className="w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Escudo oficial de la Municipalidad de Santo Domingo"
            className="h-12 w-12 object-contain"
            loading="lazy"
            decoding="async"
            width="48"
            height="48"
          />
          <div className="leading-none">
            <p
              className="text-base font-semibold text-blue-700 sm:text-lg"
              aria-hidden="true"
            >
              Santo Domingo Seguro
            </p>
            <p
              className="text-xs uppercase tracking-wide text-slate-400 sm:text-sm"
              aria-hidden="true"
            >
              Municipalidad de Santo Domingo
            </p>
          </div>
        </div>
        {role && onLogout ? (
          <div className="flex items-center gap-3">
            {onEditProfile ? (
              <button
                type="button"
                onClick={onEditProfile}
                className="h-11 rounded-md border border-blue-200 bg-white px-4 text-sm font-medium text-blue-800 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Editar perfil
              </button>
            ) : null}
            <div
              className="flex h-11 min-w-24 items-center justify-center rounded-md border border-slate-300 bg-slate-100 px-3 text-sm font-semibold text-slate-700"
              aria-label={`Rol actual: ${role}`}
            >
              {role}
            </div>
            <button
              type="button"
              onClick={onLogout}
              aria-label="Cerrar sesión y salir del sistema"
              className="h-11 rounded-md bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Salir
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}

