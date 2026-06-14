import { clearAuthUser, getAuthUser } from "@/lib/authUser";
import { api, ApiError } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/ToastProvider";

export type Incident = {
  id: number;
  description: string;
  type: string;
  status: string;
  lat: number;
  lng: number;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  patrullero_first_name: string | null;
  patrullero_last_name: string | null;
  assignment_status: string | null;
};

export type Patrullero = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};

export type TypeStat = {
  type: string;
  total: number;
};

export type Stats = {
  casesThisMonth: number;
  casesResolved: number;
  byType: TypeStat[];
};

export function useAdminDashboard() {
  const navigate = useNavigate();
  const [user] = useState(() => getAuthUser());
  const { showToast } = useToast();

  const [stats, setStats] = useState<Stats>({ casesThisMonth: 0, casesResolved: 0, byType: [] });
  const [pendingIncidents, setPendingIncidents] = useState<Incident[]>([]);
  const [assignedIncidents, setAssignedIncidents] = useState<Incident[]>([]);
  const [patrulleros, setPatrulleros] = useState<Patrullero[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchingRef = useRef(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login", { replace: true });
      return;
    }

    if (fetchingRef.current) return;
    fetchingRef.current = true;

    async function fetchData() {
      try {
        const [statsData, pendingData, assignedData, patrolData] = await Promise.all([
          api.get<Stats>("/api/stats"),
          api.get<Incident[]>("/api/incidents?status=recibido"),
          api.get<Incident[]>("/api/incidents?status=en_desarrollo"),
          api.get<Patrullero[]>("/api/users?role=patrullero"),
        ]);

        setStats(statsData);
        setPendingIncidents(pendingData);
        setAssignedIncidents(assignedData);
        setPatrulleros(patrolData);
      } catch (e) {
        if (!(e instanceof ApiError && e.status === 401)) {
          console.error("Error cargando datos del dashboard:", e);
        }
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    }

    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const refetch = () => {
    if (fetchingRef.current || !user) return;
    fetchingRef.current = true;
    setLoading(true);

    Promise.all([
      api.get<Stats>("/api/stats"),
      api.get<Incident[]>("/api/incidents?status=recibido"),
      api.get<Incident[]>("/api/incidents?status=en_desarrollo"),
      api.get<Patrullero[]>("/api/users?role=patrullero"),
    ])
      .then(([statsData, pendingData, assignedData, patrolData]) => {
        setStats(statsData);
        setPendingIncidents(pendingData);
        setAssignedIncidents(assignedData);
        setPatrulleros(patrolData);
      })
      .catch((e) => {
        if (!(e instanceof ApiError && e.status === 401)) {
          console.error(e);
        }
      })
      .finally(() => {
        setLoading(false);
        fetchingRef.current = false;
      });
  };

  const resolveIncident = async (incidentId: number) => {
    try {
      await api.put(`/api/incidents/${incidentId}`, { status: "resuelto" });
      showToast("Incidente marcado como resuelto.", "success");
      refetch();
      return true;
    } catch {
      showToast("Error al resolver el incidente.", "error");
      return false;
    }
  };

  const assignPatrullero = async (incidentId: number, patrulleroId: number) => {
    try {
      await api.post("/api/assignments", { incidentId, patrulleroId });
      showToast("Patrullero asignado correctamente.", "success");
      refetch();
      return true;
    } catch {
      showToast("Error al asignar patrullero.", "error");
      return false;
    }
  };
  
  const deleteIncident = async (incidentId: number) => {
    if (!window.confirm("¿Estás seguro de eliminar permanentemente este incidente?")) return false;
    
    try {
      await api.delete(`/api/incidents/${incidentId}`);
      showToast("Incidente eliminado del sistema.", "success");
      refetch();
      return true;
    } catch {
      showToast("Error al eliminar el incidente.", "error");
      return false;
    }
  };

  const handleLogout = () => {
    clearAuthUser();
    navigate("/login", { replace: true });
  };

  return { user, stats, pendingIncidents, assignedIncidents, patrulleros, loading, assignPatrullero, resolveIncident, deleteIncident, handleLogout };
}
