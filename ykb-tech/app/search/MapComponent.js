"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix för markör-ikoner i Leaflet
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapComponent({ schools }) {
  return (
    <MapContainer center={[62.0, 15.0]} zoom={5} className="h-full w-full">
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      {schools.map((school) => (
        <Marker
          key={school.id}
          position={[school.lat || 60.48, school.lng || 15.43]}
          icon={icon}
        >
          <Popup>
            <div className="font-bold">{school.name}</div>
            <div className="text-sm">{school.city}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
