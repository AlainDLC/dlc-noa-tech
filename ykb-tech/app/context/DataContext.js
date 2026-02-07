"use client";
import { createContext, useContext, useState } from "react";
import { MOCK_SCHOOLS } from "../data/schools";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [schools, setSchools] = useState(MOCK_SCHOOLS);
  const [activeSchool, setActiveSchool] = useState(null);
  const [bookings, setBookings] = useState([
    {
      id: "1",
      studentName: "Johan Andersson",
      courseLabel: "YKB Del 1 - Gods",
      date: "2026-03-20",
      status: "BETALD",
      schoolId: "1", // Kopplar bokningen till en specifik skola
    },
    {
      id: "2",
      studentName: "Maria Larsson",
      courseLabel: "YKB Fortbildning",
      date: "2026-04-12",
      status: "PENDING",
      schoolId: "2",
    },
  ]);

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

  // UPPDATERAD: Här är din kraftfulla update-funktion!
  const updateSchool = async (updatedSchool) => {
    // Om adressen ändrats vill vi kanske hämta nya koordinater (valfritt men snyggt)
    // För enkelhetens skull kör vi en vanlig uppdatering här:
    setSchools((prev) =>
      prev.map((school) =>
        school.id === updatedSchool.id
          ? { ...school, ...updatedSchool }
          : school,
      ),
    );
  };

  const addBooking = (newBooking) => {
    setBookings((prev) => [
      ...prev,
      { ...newBooking, id: Date.now().toString() },
    ]);
  };

  const deleteSchool = (id) => {
    setSchools((prev) => prev.filter((school) => school.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        schools,
        addSchool,
        updateSchool,
        activeSchool,
        setActiveSchool,
        deleteSchool,
        addBooking,
        bookings,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
