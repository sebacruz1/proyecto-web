import { useState } from "react";
import { IoCall, IoReloadOutline } from "react-icons/io5";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/ToastProvider";

export default function SOS() {
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const handleSOS = () => {
    setLoading(true);

    // Se Verifica si el navegador soporta GPS
    if (!navigator.geolocation) {
      showToast("Tu navegador no soporta geolocalización", "error");
      setLoading(false);
      return;
    }

    // Se pide las coordenadas actuales
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          // Se hace el post al backend
          await api.post("/api/incidents", {
            type: "Emergencia (SOS)",
            description:
              "Botón de pánico activado por el ciudadano desde la aplicación.",
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });

          // Si el servidor responde se lanza el mensaje verde
          showToast(
            "¡Alerta SOS enviada! La patrulla va en camino.",
            "success",
          );
        } catch {
          // Si el servidor falla o no hay internet, lanzamos el Toast rojo
          showToast(
            "Error al enviar la alerta SOS. Intenta nuevamente.",
            "error",
          );
        } finally {
          setLoading(false);
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_) => {
        showToast(
          "Error al obtener tu ubicación. Verifica los permisos de GPS.",
          "error",
        );
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <section className="mt-8 flex justify-center">
      <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm lg:h-[20rem]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-400 text-white">
          <IoCall className="h-8 w-8" />
        </div>
        <p className="mt-4 text-3xl font-bold text-red-600">SOS 1458</p>
        <p className="mt-1 text-sm font-medium text-slate-600">
          Botón de emergencia
        </p>
        <button
          type="button"
          onClick={handleSOS}
          disabled={loading}
          className="uppercase mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <IoReloadOutline className="h-5 w-5 animate-spin" />
              Enviando Alerta...
            </>
          ) : (
            "Solicitar ayuda ahora"
          )}
        </button>
      </div>
    </section>
  );
}

