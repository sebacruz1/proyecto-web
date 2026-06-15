import Navbar from "@/components/layout/Navbar";
import ActionButtons from "./components/ActionButtons";
import SOSCard from "./components/SOS";
import UserInfoGrid from "./components/UserInfoGrid";
import { useUserDashboard } from "./hooks/useUserDashboard";
import { useState } from "react";
import ProfileEditModal from "@/components/profile/ProfileEditModal";
import { useToast } from "@/components/ui/ToastProvider";

export default function Dashboard() {
  const { user, handleLogout, updateProfile } = useUserDashboard();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { showToast } = useToast();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        role={user?.roleDisplay}
        onLogout={handleLogout}
        onEditProfile={() => setIsProfileOpen(true)}
      />
      <main className="p-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Usuario</h1>
        <p className="mt-1 text-slate-700 font-medium">
          Bienvenido {user?.firstName} {user?.lastName}
        </p>
        <UserInfoGrid
          email={user?.email}
          rut={user?.rut}
          address={user?.address}
          role={user?.roleDisplay}
        />
        <SOSCard />
        <ActionButtons />
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
