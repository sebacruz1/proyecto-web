import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Coords } from "../hooks/usePatrolDashboard";

// Leaflet no encuentra los assets de los markers cuando se bundlea con Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function RecenterMap({ position }: { position: Coords }) {
  const map = useMap();
  map.setView([position.lat, position.lng], map.getZoom());
  return null;
}

const DEFAULT_CENTER: [number, number] = [-33.6366, -71.6273];

type Props = { position: Coords | null };

export default function IncidentMap({ position }: Props) {
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
        {!position && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl">
            <p className="text-sm text-slate-500">
              Inicia el turno para ver tu ubicación
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
