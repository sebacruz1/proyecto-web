import { clearAuthUser, getAuthUser } from "@/lib/authUser";
import { api } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const GPS_INTERVAL_MS = 30_000;

function getCurrentPosition(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10_000 },
    ),
  );
}

export type Coords = { lat: number; lng: number };

export function usePatrolDashboard() {
  const navigate = useNavigate();
  const [user] = useState(() => getAuthUser());

  const [shiftId, setShiftId] = useState<number | null>(null);
  const [position, setPosition] = useState<Coords | null>(null);
  const [gpsError, setGpsError] = useState("");
  const [loading, setLoading] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!user || user.role !== "patrullero") {
      navigate("/login", { replace: true });
    }
  }, [navigate, user]);

  useEffect(() => {
    if (!user?.token) return;
    api
      .get<{ id?: number }>("/api/shifts/active")
      .then((data) => {
        if (data?.id) {
          setShiftId(data.id);
          startGpsInterval(data.id);
        }
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function startGpsInterval(id: number) {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(async () => {
      try {
        const coords = await getCurrentPosition();
        setPosition({ lat: coords.latitude, lng: coords.longitude });
        await api.post(`/api/shifts/${id}/gps`, {
          lat: coords.latitude,
          lng: coords.longitude,
        });
      } catch {
        // silencioso si el GPS falla puntualmente
      }
    }, GPS_INTERVAL_MS);
  }

  function stopGpsInterval() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  const startShift = async () => {
    if (!user?.token) return;
    setGpsError("");
    setLoading(true);
    try {
      const coords = await getCurrentPosition();
      const pos = { lat: coords.latitude, lng: coords.longitude };
      setPosition(pos);

      const data = await api.post<{ shiftId: number }>(
        "/api/shifts/start",
        pos,
      );
      setShiftId(data.shiftId);
      startGpsInterval(data.shiftId);
    } catch (e) {
      if (e instanceof GeolocationPositionError) {
        setGpsError(
          "No se pudo obtener tu ubicación. Activa el GPS e intenta de nuevo.",
        );
      } else {
        setGpsError("Error al conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  const endShift = async () => {
    if (!user?.token || !shiftId) return;
    setLoading(true);
    try {
      const coords = await getCurrentPosition().catch(() => null);
      await api.post(`/api/shifts/${shiftId}/end`, {
        lat: coords?.latitude ?? null,
        lng: coords?.longitude ?? null,
      });
      stopGpsInterval();
      setShiftId(null);
      setPosition(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => () => stopGpsInterval(), []);

  const handleLogout = () => {
    stopGpsInterval();
    clearAuthUser();
    navigate("/login", { replace: true });
  };

  return {
    user,
    isShiftStarted: shiftId !== null,
    position,
    gpsError,
    loading,
    startShift,
    endShift,
    handleLogout,
  };
}
