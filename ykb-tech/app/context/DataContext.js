"use client";
import { createContext, useContext, useState } from "react";
import { MOCK_SCHOOLS } from "../data/schools";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [schools, setSchools] = useState(MOCK_SCHOOLS);
  // 1. Lägg till state för den valda skolan
  const [activeSchool, setActiveSchool] = useState(null);

  const addSchool = (newSchool) => {
    setSchools((prev) => [
      ...prev,
      {
        ...newSchool,
        id: (prev.length + 1).toString(),
        rating: 5.0,
        lat: 60.48 + (Math.random() - 0.5) * 2, // Lite slumpmässig spridning för demo
        lng: 15.43 + (Math.random() - 0.5) * 2,
      },
    ]);
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
