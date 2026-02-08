"use client";
import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Denna komponent fixar nu BÅDE centrering och mobil-buggen
function MapController({ activeSchool, showMap }) {
  const map = useMap();

  // FIX FÖR MOBILLÄGE: Tvingar kartan att rita om sig när man växlar vy
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
      if (activeSchool?.lat && activeSchool?.lng) {
        map.setView(
          [parseFloat(activeSchool.lat), parseFloat(activeSchool.lng)],
          14,
        );
      }
    }, 300); // En liten delay så att CSS-transitionen hinner bli klar
    return () => clearTimeout(timer);
  }, [showMap, map, activeSchool]);

  return null;
}

export default function MapComponent({ schools, activeSchool, showMap }) {
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
    <div className="h-full w-full">
      <MapContainer
        center={[62.1, 14.9]}
        zoom={5}
        className="h-full w-full"
        zoomControl={false} // Renare design på mobil
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

        {/* Vi skickar med showMap här så den vet när den ska uppdateras */}
        <MapController activeSchool={activeSchool} showMap={showMap} />

        {schools.map((school) => {
          const sLat = parseFloat(school.lat);
          const sLng = parseFloat(school.lng);
          if (isNaN(sLat) || isNaN(sLng)) return null;

          return (
            <Marker
              key={school.id}
              position={[sLat, sLng]}
              icon={activeSchool?.id === school.id ? redIcon : blueIcon}
            >
              <Popup>
                <div className="p-1 min-w-[140px]">
                  <h4 className="font-black uppercase italic text-sm m-0">
                    {school.name}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-500 m-0 mt-1">
                    📍 {school.address}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.name + " " + school.address + " " + school.city)}`}
                    target="_blank"
                    className="mt-3 block text-center bg-blue-600 text-white text-[10px] font-black py-2 rounded-lg uppercase no-underline"
                  >
                    Öppna i Maps
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
