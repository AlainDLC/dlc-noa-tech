"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
//import { MOCK_SCHOOLS } from "../data/schools";

const DataContext = createContext();

export function DataProvider({ children }) {
  /*const [schools, setSchools] = useState(MOCK_SCHOOLS);
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
*/
  const [schools, setSchools] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [onboardingRequests, setOnboardingRequests] = useState([]); // För din Super Admin-lista
  const [activeSchool, setActiveSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      setLoading(true);

      // 1. Hämta Bokningar
      const { data: bookingsData } = await supabase
        .from("bookings")
        .select("*");

      // 2. Hämta Skolor/Partners
      const { data: partnersData } = await supabase
        .from("partners")
        .select("*");

      // 3. Hämta Onboarding-ansökningar
      const { data: requestsData } = await supabase
        .from("onboarding_requests")
        .select("*");

      if (bookingsData) setBookings(bookingsData);
      if (partnersData) setSchools(partnersData);
      if (requestsData) setOnboardingRequests(requestsData);
    } catch (error) {
      console.error("Kunde inte hämta data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

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
    setBookings((prev) => [...prev, newBooking]);
  };

  const updateBooking = (id, updatedFields) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b)),
    );
  };

  const updateSlots = (schoolId, scheduleIndex, change) => {
    setSchools((prev) =>
      prev.map((school) => {
        if (school.id === schoolId) {
          const newSchedule = [...(school.schedule || [])];

          // Tvinga fram ett nummer med Number() eller parseInt
          const currentSlots = Number(newSchedule[scheduleIndex]?.slots || 0);

          // Räkna ut det nya värdet
          const newTotal = Math.max(0, currentSlots + change);

          newSchedule[scheduleIndex] = {
            ...newSchedule[scheduleIndex],
            slots: newTotal.toString(), // Spara som sträng igen om du vill
          };

          return { ...school, schedule: newSchedule };
        }
        return school;
      }),
    );
  };

  const saveSchool = (newSchoolData) => {
    setSchools((prev) => {
      // Kolla om skolan redan finns (vi matchar på ID eller organisationsnummer)
      const exists = prev.find(
        (s) =>
          s.id === newSchoolData.id ||
          (newSchoolData.orgNr && s.orgNr === newSchoolData.orgNr),
      );

      if (exists) {
        // Uppdatera befintlig skola
        return prev.map((s) =>
          s.id === exists.id ? { ...s, ...newSchoolData } : s,
        );
      } else {
        // Skapa en helt ny skola (Master-registrering)
        const schoolWithMeta = {
          ...newSchoolData,
          id: newSchoolData.id || Date.now().toString(),
          createdAt: new Date().toISOString(),
          rating: 5.0,
          schedule: newSchoolData.schedule || [],
          orgNr: newSchoolData.orgNr || "",
        };
        return [...prev, schoolWithMeta];
      }
    });
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
        updateSlots,
        bookings,
        updateBooking,
        saveSchool,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
