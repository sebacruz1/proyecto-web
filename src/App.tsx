import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";
import { ToastProvider } from "./components/ui/ToastProvider";
import { IoReloadOutline } from "react-icons/io5";

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
            <Route path="*" element={<h2>404 - La página no existe</h2>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
