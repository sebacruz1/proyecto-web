import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";
import { ToastProvider } from "./components/ui/ToastProvider";
import { IoReloadOutline, IoWarningOutline } from "react-icons/io5";

/* lazy loading en lugar de descargar todo de una vez, los elementos pesados 
(como imágenes, vídeos o módulos de código) solo se cargan cuando aparecen en la pantalla*/
const Login = lazy(() => import("./pages/public/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const PatrolDashboard = lazy(() => import("./pages/patrol/Dashboard"));
const UserDashboard = lazy(() => import("./pages/user/Dashboard"));

function PageLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-500">
      <IoReloadOutline className="h-10 w-10 animate-spin text-blue-800" />
      <p className="mt-4 text-sm font-medium uppercase tracking-wider text-slate-400">
        Cargando panel seguro...
      </p>
    </div>
  );
}

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <IoWarningOutline className="h-16 w-16 text-blue-800" />
      <h1 className="mt-4 text-6xl font-black text-blue-900">404</h1>
      <p className="mt-2 text-lg font-semibold text-slate-700">Página no encontrada</p>
      <p className="mt-1 text-sm text-slate-400">La ruta que buscas no existe.</p>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mt-6 rounded-xl bg-blue-800 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Volver
      </button>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        {/* Suspense captura el estado de carga mientras se descarga el fragmento de la página */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/patrullero/dashboard" element={<PatrolDashboard />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/new" element={<UserDashboard />} />
            <Route path="/user/history" element={<UserDashboard />} />
            <Route path="/user/:id" element={<UserDashboard />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
