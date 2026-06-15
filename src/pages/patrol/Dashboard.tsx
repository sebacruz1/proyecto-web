import Navbar from "@/components/layout/Navbar";
import AssignedIncidentList from "./components/AssignedIncident";
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
        <AssignedIncidentList />
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
    </div>
  );
}
