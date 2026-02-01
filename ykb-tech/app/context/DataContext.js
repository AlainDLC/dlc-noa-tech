"use client";
import { createContext, useContext, useState } from "react";
import { MOCK_SCHOOLS } from "../data/schools";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [schools, setSchools] = useState(MOCK_SCHOOLS);
  const [activeSchool, setActiveSchool] = useState(null);

  const addSchool = async (newSchool) => {
    try {
      const query = encodeURIComponent(
        `${newSchool.address}, ${newSchool.city}, Sweden`,
      );
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
      );
      const data = await response.json();

      let coords = { lat: 60.48, lng: 15.43 };

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
          lat: coords.lat,
          lng: coords.lng,
          // Här ser vi till att nextStart följer med in i listan
          description: newSchool.description || "",
          nextStart: newSchool.nextStart || "Kontakta för datum",
        },
      ]);
    } catch (error) {
      console.error("Geocoding misslyckades:", error);
    }
  };

  // Vi lägger till en tom funktion för updateSchool här så vi är redo för panelen sen
  const updateSchool = (id, updatedData) => {
    setSchools((prev) =>
      prev.map((school) =>
        school.id === id ? { ...school, ...updatedData } : school,
      ),
    );
  };

  return (
    <DataContext.Provider
      value={{
        schools,
        addSchool,
        updateSchool,
        activeSchool,
        setActiveSchool,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
