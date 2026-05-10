import { clearAuthUser, getAuthUser } from "@/lib/authUser";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function usePatrolDashboard() {
  const navigate = useNavigate();
  const user = getAuthUser();
  const [isShiftStarted, setIsShiftStarted] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "patrullero") {
      navigate("/login", { replace: true });
    }
  }, [navigate, user]);

  const handleLogout = () => {
    clearAuthUser();
    navigate("/login", { replace: true });
  };

  const toggleShift = () => setIsShiftStarted((prev) => !prev);

  return { handleLogout, isShiftStarted, toggleShift };
}
