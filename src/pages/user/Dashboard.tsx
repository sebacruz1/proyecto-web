import Navbar from "@/components/layout/Navbar";
import ActionButtons from "./components/ActionButtons";
import SOSCard from "./components/SOS";
import UserInfoGrid from "./components/UserInfoGrid";
import { useUserDashboard } from "./hooks/useUserDashboard";

export default function Dashboard() {
  const { user, handleLogout } = useUserDashboard();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role="user" onLogout={handleLogout} />
      <main className="p-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Usuario</h1>
        <p className="mt-1 text-slate-700 font-medium">
          Bienvenido {user?.firstName} {user?.lastName}
        </p>
        <p className="mt-2 text-slate-600">Sesión iniciada como usuario.</p>
        <UserInfoGrid
          email={user?.email}
          rut={user?.rut}
          address={user?.address}
        />
        <SOSCard />
        <ActionButtons />
      </main>
    </div>
  );
}
