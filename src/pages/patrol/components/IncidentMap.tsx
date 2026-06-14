import { memo, useEffect, useState } from "react"; 
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import type { Coords } from "../hooks/usePatrolDashboard";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function RecenterMap({ position }: { position: Coords }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], map.getZoom());
      // Forzamos la actualización de tamaño por seguridad
      map.invalidateSize(); 
    }
  }, [map, position]);

  return null;
}

const DEFAULT_CENTER: [number, number] = [-33.6366, -71.6273];

type Props = { position: Coords | null };

const IncidentMap = memo(function IncidentMap({ position }: Props) {
  // 1. Estado para asegurar que el DOM esté listo antes de inyectar Leaflet
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

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
        
        {/* 2. Solo renderizamos el mapa cuando el componente está montado */}
        {isMounted && (
          <MapContainer
            // 3. LA SOLUCIÓN NUCLEAR: Al cambiar la key, React destruye el mapa viejo 
            // y crea uno nuevo, obligando a Leaflet a recalcular todo desde cero.
            key={position ? "tracking" : "idle"} 
            center={center}
            zoom={15}
            // 4. Alto forzado en píxeles (320px es el equivalente a h-80 de Tailwind)
            style={{ height: "320px", width: "100%", zIndex: 0 }} 
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
        )}
        
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
  if (!prevProps.position && !nextProps.position) return true;
  if (!prevProps.position || !nextProps.position) return false;
  
  return (
    prevProps.position.lat === nextProps.position.lat &&
    prevProps.position.lng === nextProps.position.lng
  );
});

export default IncidentMap;