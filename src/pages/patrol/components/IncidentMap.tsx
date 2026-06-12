import { memo } from "react"; // <-- 1. Importamos memo
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Coords } from "../hooks/usePatrolDashboard";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function RecenterMap({ position }: { position: Coords }) {
  const map = useMap();
  map.setView([position.lat, position.lng], map.getZoom());
  return null;
}

const DEFAULT_CENTER: [number, number] = [-33.6366, -71.6273];

type Props = { position: Coords | null };

// Envolvemos todo el componente en React.memo
const IncidentMap = memo(function IncidentMap({ position }: Props) {
  const center: [number, number] = position
    ? [position.lat, position.lng]
    : DEFAULT_CENTER;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Tu ubicación actual
        </h2>
        {position && (
          <span className="text-[10px] text-slate-400">
            {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
          </span>
        )}
      </div>
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm h-80">
        <MapContainer
          center={center}
          zoom={15}
          className="h-full w-full rounded-xl"
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {position && (
            <>
              <RecenterMap position={position} />
              <Marker position={[position.lat, position.lng]}>
                <Popup>Tu posición actual</Popup>
              </Marker>
            </>
          )}
        </MapContainer>
        
        {/*Agregamos z-[1000] para que la capa bloquee correctamente la interacción si no hay turno */}
        {!position && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-xl">
            <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">
              Inicia el turno para ver tu ubicación
            </p>
          </div>
        )}
      </div>
    </section>
  );
}, (prevProps, nextProps) => {
  // Si antes era null y ahora es null, no re-renderizar
  if (!prevProps.position && !nextProps.position) return true;
  // Si uno de los dos es null y el otro no, SÍ re-renderizar
  if (!prevProps.position || !nextProps.position) return false;
  
  // Solo re-renderizar si las coordenadas realmente cambiaron
  return (
    prevProps.position.lat === nextProps.position.lat &&
    prevProps.position.lng === nextProps.position.lng
  );
});

export default IncidentMap;