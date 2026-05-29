import { clearAuthUser, getAuthUser } from "@/lib/authUser";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export function useAdminDashboard() {
  const navigate = useNavigate();
  const [user] = useState(() => getAuthUser());

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

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    };

    async function fetchData() {
      try {
        const [statsRes, incidentsRes, patrolRes] = await Promise.all([
          fetch(`${BASE}/api/stats`, { headers }),
          fetch(`${BASE}/api/incidents`, { headers }),
          fetch(`${BASE}/api/users?role=patrullero`, { headers }),
        ]);

        if (statsRes.status === 401) {
          clearAuthUser();
          navigate("/login", { replace: true });
          return;
        }

        if (statsRes.ok) setStats(await statsRes.json());
        if (incidentsRes.ok) {
          const all: Incident[] = await incidentsRes.json();
          setPendingIncidents(all.filter((i) => i.status === "recibido"));
          setAssignedIncidents(all.filter((i) => i.status === "en_desarrollo"));
        }
        if (patrolRes.ok) setPatrulleros(await patrolRes.json());
      } catch (e) {
        console.error("Error cargando datos del dashboard:", e);
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

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    };

    Promise.all([
      fetch(`${BASE}/api/stats`, { headers }),
      fetch(`${BASE}/api/incidents`, { headers }),
      fetch(`${BASE}/api/users?role=patrullero`, { headers }),
    ])
      .then(async ([statsRes, incidentsRes, patrolRes]) => {
        if (statsRes.ok) setStats(await statsRes.json());
        if (incidentsRes.ok) {
          const all: Incident[] = await incidentsRes.json();
          setPendingIncidents(all.filter((i) => i.status === "recibido"));
          setAssignedIncidents(all.filter((i) => i.status === "en_desarrollo"));
        }
        if (patrolRes.ok) setPatrulleros(await patrolRes.json());
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
        fetchingRef.current = false;
      });
  };

  const resolveIncident = async (incidentId: number) => {
    if (!user) return false;
    const res = await fetch(`${BASE}/api/incidents/${incidentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ status: "resuelto" }),
    });
    if (res.ok) refetch();
    return res.ok;
  };

  const assignPatrullero = async (incidentId: number, patrulleroId: number) => {
    if (!user) return false;
    const res = await fetch(`${BASE}/api/assignments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ incidentId, patrulleroId }),
    });
    if (res.ok) refetch();
    return res.ok;
  };

  const handleLogout = () => {
    clearAuthUser();
    navigate("/login", { replace: true });
  };

  return { user, stats, pendingIncidents, assignedIncidents, patrulleros, loading, assignPatrullero, resolveIncident, handleLogout };
}
