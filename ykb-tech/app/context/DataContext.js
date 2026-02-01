"use client";
import { createContext, useContext, useState } from "react";
import { MOCK_SCHOOLS } from "../data/schools"; // Vi utgår från din startdata

const DataContext = createContext();

export function DataProvider({ children }) {
  const [schools, setSchools] = useState(MOCK_SCHOOLS);

  const addSchool = (newSchool) => {
    setSchools((prev) => [
      ...prev,
      {
        ...newSchool,
        id: (prev.length + 1).toString(), // Skapa ett enkelt ID
        rating: 5.0, // Nya skolor får topp-betyg direkt!
        lat: 60.48, // Standard-koordinat för demo (Borlänge)
        lng: 15.43,
      },
    ]);
  };

  return (
    <DataContext.Provider value={{ schools, addSchool }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
