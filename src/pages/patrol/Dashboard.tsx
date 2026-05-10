import Navbar from "@/components/layout/Navbar";
import AssignedIncidentList from "./components/AssignedIncident";
import IncidentMap from "./components/IncidentMap";
import ShiftPanel from "./components/ShiftPanel";
import { usePatrolDashboard } from "./hooks/usePatrolDashboard";

export default function Dashboard() {
  const { handleLogout, isShiftStarted, toggleShift } = usePatrolDashboard();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role="patrullero" onLogout={handleLogout} />
      <main className="mx-auto max-w-2xl px-4 py-8 flex flex-col gap-8">
        <ShiftPanel isShiftStarted={isShiftStarted} onToggle={toggleShift} />
        <IncidentMap />
        <AssignedIncidentList />
      </main>
    </div>
  );
}
