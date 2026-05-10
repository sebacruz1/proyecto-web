import logo from "@/assets/santodomingo.webp";

type NavbarProps = {
  role?: string;
  onLogout?: () => void;
};

export default function Navbar({ role, onLogout }: NavbarProps) {
  return (
    <header className="w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo municipalidad de Santo Domingo"
            className="h-12 w-12 object-contain"
          />
          <div className="leading-none">
            <p className="text-base font-semibold text-blue-700 sm:text-lg">
              Santo Domingo Seguro
            </p>
            <p className="text-xs uppercase tracking-wide text-slate-400 sm:text-sm">
              Municipalidad de Santo Domingo
            </p>
          </div>
        </div>
        {role && onLogout ? (
          <div className="flex items-center gap-3">
            <div className="flex h-11 min-w-24 items-center justify-center rounded-md border border-slate-300 bg-slate-100 px-3 text-sm font-semibold text-slate-700">
              {role}
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="h-11 rounded-md bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-500"
            >
              Salir
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
