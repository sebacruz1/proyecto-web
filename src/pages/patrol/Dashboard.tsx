import Navbar from "@/components/layout/Navbar";
import AssignedIncidentList from "./components/AssignedIncident";
import IncidentDetailModal, {
  type AssignedIncident,
} from "./components/IncidentDetailModal";
import IncidentMap from "./components/IncidentMap";
import ShiftPanel from "./components/ShiftPanel";
import { usePatrolDashboard } from "./hooks/usePatrolDashboard";
import { useState } from "react";
import ProfileEditModal from "@/components/profile/ProfileEditModal";
import { useToast } from "@/components/ui/ToastProvider";

export default function Dashboard() {
  const {
    user,
    isShiftStarted,
    position,
    gpsError,
    loading,
    startShift,
    endShift,
    handleLogout,
    updateProfile,
  } = usePatrolDashboard();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] =
    useState<AssignedIncident | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { showToast } = useToast();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        role={user?.roleDisplay}
        onLogout={handleLogout}
        onEditProfile={() => setIsProfileOpen(true)}
      />
      <main className="mx-auto max-w-2xl px-4 py-8 flex flex-col gap-8">
        <ShiftPanel
          isShiftStarted={isShiftStarted}
          loading={loading}
          gpsError={gpsError}
          onStart={startShift}
          onEnd={endShift}
        />
        <IncidentMap position={position} />
        {isShiftStarted ? (
          <AssignedIncidentList
            onSelect={setSelectedIncident}
            refreshKey={refreshKey}
          />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Inicia tu turno para ver los incidentes asignados.
            </p>
          </div>
        )}
      </main>
      {isProfileOpen && user ? (
        <ProfileEditModal
          user={user}
          onClose={() => setIsProfileOpen(false)}
          onSaved={(changes) => {
            updateProfile(changes);
            showToast("Perfil actualizado correctamente.", "success");
          }}
        />
      ) : null}
      {selectedIncident ? (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onUpdated={() => {
            setSelectedIncident(null);
            setRefreshKey((k) => k + 1);
          }}
        />
      ) : null}
    </div>
  );
}
