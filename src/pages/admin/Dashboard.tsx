import Navbar from "@/components/layout/Navbar";
import IncidentAssignList from "./components/IncidentAssignList";
import IncidentChart from "./components/IncidentChart";
import StatsGrid from "./components/StatsGrid";
import { useAdminDashboard } from "./hooks/useAdminDashboard";

export default function Dashboard() {
  const { handleLogout } = useAdminDashboard();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role="administrador" onLogout={handleLogout} />
      <div className="h-1 w-full bg-blue-900" />
      <main className="mx-auto max-w-2xl px-4 py-8 flex flex-col gap-6">
        <section>
          <h1 className="text-xl font-bold uppercase tracking-wide text-blue-900">
            Control de gestión
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Consola de Administración Municipal
          </p>
        </section>
        <StatsGrid casesThisMonth={12} casesResolved={2} />
        <IncidentChart />
        <IncidentAssignList />
      </main>
    </div>
  );
}
