"use client";
import { useEffect } from "react"; // Behövs för RecenterMap
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 1. Fix för markör-ikoner (viktigt för att de ska synas!)
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 2. Komponenten som flyttar kameran när man klickar i listan
function RecenterMap({ activeSchool }) {
  const map = useMap();
  useEffect(() => {
    if (activeSchool) {
      map.flyTo([activeSchool.lat || 60.48, activeSchool.lng || 15.43], 12, {
        duration: 1.5,
      });
    }
  }, [activeSchool, map]);
  return null;
}

export default function MapComponent({ schools, activeSchool }) {
  return (
    <MapContainer center={[62.0, 15.0]} zoom={5} className="h-full w-full">
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

      {/* 3. Lägg till RecenterMap här inne */}
      <RecenterMap activeSchool={activeSchool} />

      {schools.map((school) => (
        <Marker
          key={school.id}
          position={[school.lat || 60.48, school.lng || 15.43]}
          icon={icon}
        >
          <Popup>
            <div className="font-bold text-slate-900">{school.name}</div>
            <div className="text-sm text-slate-500">{school.city}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
