import { useState } from "react";
import { IoPersonAddOutline } from "react-icons/io5";
import Navbar from "@/components/layout/Navbar";
import StatsGrid from "./components/StatsGrid";
import IncidentChart from "./components/IncidentChart";
import IncidentAssignList from "./components/IncidentAssignList";
import AssignedIncidentList from "./components/AssignedIncidentList";
import CreateUserModal from "./components/CreateUserModal";
import EditUserModal, { type UserToEdit } from "./components/EditUserModal";
import UsersManagementModal from "./components/UsersManagementModal";
import { useAdminDashboard } from "./hooks/useAdminDashboard";
import { useToast } from "@/components/ui/ToastProvider";

export default function Dashboard() {
  const {
    user,
    stats,
    pendingIncidents,
    assignedIncidents,
    patrulleros,
    users,
    loading,
    assignPatrullero,
    resolveIncident,
    deleteIncident,
    deleteUser,
    editUser,
    refetch,
    handleLogout,
  } = useAdminDashboard();
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserToEdit | null>(null);
  const { showToast } = useToast();

  const handleUserCreated = () => {
    showToast("Usuario creado correctamente.", "success");
    refetch();
    setIsCreateUserOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role={user?.roleDisplay} onLogout={handleLogout} />
      <div className="h-1 w-full bg-blue-900" />
      <main className="mx-auto max-w-2xl px-4 py-8 flex flex-col gap-6">
        <section className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wide text-blue-900">
              Control de gestión
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Consola de Administración Municipal
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIsCreateUserOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-blue-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 shadow"
            >
              <IoPersonAddOutline className="h-4 w-4" />
              Nuevo usuario
            </button>
            <button
              type="button"
              onClick={() => setIsUsersOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-medium text-blue-800 transition hover:bg-blue-50 shadow-sm"
            >
              Editar usuarios
            </button>
          </div>
        </section>

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
          onDelete={deleteIncident}
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
      <UsersManagementModal
        isOpen={isUsersOpen}
        users={users}
        loading={loading}
        onClose={() => setIsUsersOpen(false)}
        onEdit={(user) => {
          setUserToEdit(user);
        }}
        onDelete={deleteUser}
      />
      <EditUserModal
        key={userToEdit?.id ?? "closed"}
        user={userToEdit}
        onClose={() => setUserToEdit(null)}
        onSave={editUser}
      />
    </div>
  );
}
