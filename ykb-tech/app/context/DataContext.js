"use client";
import { createContext, useContext, useState } from "react";
import { MOCK_SCHOOLS } from "../data/schools";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [schools, setSchools] = useState(MOCK_SCHOOLS);
  // 1. Lägg till state för den valda skolan
  const [activeSchool, setActiveSchool] = useState(null);

  const addSchool = async (newSchool) => {
    try {
      // Vi skapar en söksträng av adressen och staden
      const query = encodeURIComponent(
        `${newSchool.address}, ${newSchool.city}, Sweden`,
      );
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
      );
      const data = await response.json();

      let coords = { lat: 60.48, lng: 15.43 }; // Standard om sökning misslyckas

      if (data && data.length > 0) {
        coords = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }

      setSchools((prev) => [
        ...prev,
        {
          ...newSchool,
          id: (prev.length + 1).toString(),
          rating: 5.0,
          lat: coords.lat, // NU PEKAR DEN DIREKT!
          lng: coords.lng,
        },
      ]);
    } catch (error) {
      console.error("Geocoding misslyckades:", error);
      // Fallback så skolan ändå läggs till
    }
  };

  return (
    // 2. Skicka med activeSchool och setActiveSchool här
    <DataContext.Provider
      value={{ schools, addSchool, activeSchool, setActiveSchool }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
