import { useState } from "react";
import { IoPersonAddOutline } from "react-icons/io5";
import Navbar from "@/components/layout/Navbar";
import StatsGrid from "./components/StatsGrid";
import IncidentChart from "./components/IncidentChart";
import IncidentAssignList from "./components/IncidentAssignList";
import AssignedIncidentList from "./components/AssignedIncidentList";
import CreateUserModal from "./components/CreateUserModal";
import { useAdminDashboard } from "./hooks/useAdminDashboard";

export default function Dashboard() {
  const { user, stats, pendingIncidents, assignedIncidents, patrulleros, loading, assignPatrullero, resolveIncident, handleLogout } =
    useAdminDashboard();
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleUserCreated = () => {
    setSuccessMsg("Usuario creado correctamente.");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role={user?.roleDisplay} onLogout={handleLogout} />
      <div className="h-1 w-full bg-blue-900" />
      <main className="mx-auto max-w-2xl px-4 py-8 flex flex-col gap-6">
        <section className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wide text-blue-900">
              Control de gestión
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Consola de Administración Municipal
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateUserOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 shadow"
          >
            <IoPersonAddOutline className="h-4 w-4" />
            Nuevo usuario
          </button>
        </section>

        {successMsg && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
            <p className="text-sm text-emerald-700">{successMsg}</p>
          </div>
        )}

        <StatsGrid
          casesThisMonth={stats.casesThisMonth}
          casesResolved={stats.casesResolved}
        />
        <IncidentChart byType={stats.byType} />
        <IncidentAssignList
          incidents={pendingIncidents}
          patrulleros={patrulleros}
          loading={loading}
          onAssign={assignPatrullero}
        />
        <AssignedIncidentList
          incidents={assignedIncidents}
          loading={loading}
          onResolve={resolveIncident}
        />
      </main>

      <CreateUserModal
        isOpen={isCreateUserOpen}
        onClose={() => setIsCreateUserOpen(false)}
        onCreated={handleUserCreated}
      />
    </div>
  );
}
