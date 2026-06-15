import {
  clearAuthUser,
  getAuthUser,
  updateAuthUser,
  type AuthUser,
} from "@/lib/authUser";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useUserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getAuthUser());

  useEffect(() => {
    if (!user || user.role !== "user") {
      navigate("/login", { replace: true });
    }
  }, [navigate, user]);

  const handleLogout = () => {
    clearAuthUser();
    navigate("/login", { replace: true });
  };

  const updateProfile = (changes: {
    firstName: string;
    lastName: string;
    address: string;
    phone: string | null;
  }) => {
    if (!user) return;
    const next: AuthUser = { ...user, ...changes };
    updateAuthUser(next);
    setUser(next);
  };

  return { user, handleLogout, updateProfile };
}
