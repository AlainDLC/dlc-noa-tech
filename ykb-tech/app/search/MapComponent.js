"use client";
import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Denna hjälpkomponent styr var kartan tittar
function RecenterMap({ activeSchool }) {
  const map = useMap();

  useEffect(() => {
    if (!activeSchool || !activeSchool.lat || !activeSchool.lng) return;

    // Fixar så att kartan fattar sin storlek (viktigt för mobiler/modaler)
    map.invalidateSize();

    const lat = parseFloat(activeSchool.lat);
    const lng = parseFloat(activeSchool.lng);

    if (!isNaN(lat) && !isNaN(lng)) {
      const timer = setTimeout(() => {
        try {
          map.setView([lat, lng], 14, { animate: true });
        } catch (e) {
          console.error("Kartan kunde inte flyttas än");
        }
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [activeSchool, map]);

  return null;
}

export default function MapComponent({ schools, activeSchool }) {
  // 🧠 Vi skapar ikonerna här inne med useMemo så de inte kraschar servern
  const blueIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
    [],
  );

  const redIcon = useMemo(
    () =>
      L.icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
    [],
  );

  return (
    <MapContainer center={[62.0, 15.0]} zoom={5} className="h-full w-full">
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

      <RecenterMap activeSchool={activeSchool} />

      {schools.map((school) => (
        <Marker
          key={school.id}
          position={[school.lat || 60.48, school.lng || 15.43]}
          icon={activeSchool?.id === school.id ? redIcon : blueIcon}
          zIndexOffset={activeSchool?.id === school.id ? 1000 : 0}
        >
          <Popup>
            <div className="p-1 text-black">
              <h4 className="font-black uppercase italic text-slate-900 text-sm">
                {school.name}
              </h4>
              <div className="mt-2 space-y-1">
                <p className="text-xs font-bold text-slate-600 flex items-center gap-1">
                  📍 {school.address || "Adress saknas"}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {school.city}
                </p>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.name + " " + school.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block text-center bg-blue-400 text-[10px] font-black py-2 rounded-lg uppercase tracking-widest hover:bg-blue-500 transition-colors"
              >
                <span className="text-white">Öppna i Google Maps</span>
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
