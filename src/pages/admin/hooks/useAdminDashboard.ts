import { clearAuthUser, getAuthUser } from "@/lib/authUser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAdminDashboard() {
  const navigate = useNavigate();
  const user = getAuthUser();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login", { replace: true });
    }
  }, [navigate, user]);

  const handleLogout = () => {
    clearAuthUser();
    navigate("/login", { replace: true });
  };

  return { handleLogout };
}
