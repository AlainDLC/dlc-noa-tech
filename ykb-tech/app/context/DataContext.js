"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [schools, setSchools] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [onboardingRequests, setOnboardingRequests] = useState([]);
  const [activeSchool, setActiveSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- HUVUDFUNKTION FÖR ATT HÄMTA ALL DATA ---
  const refreshData = async () => {
    try {
      setLoading(true);
      console.log("DataContext: Uppdaterar all data från Supabase...");

      // 1. Hämta Partners inkl. deras kurser
      // OBS: Vi tar bort .eq("status", "active") för att säkerställa att allt syns under demot
      const { data: partnersData, error: partnersError } = await supabase
        .from("partners")
        .select("*, courses(*)");

      if (partnersError) throw partnersError;

      // 2. Hämta Bokningar
      const { data: bookingsData } = await supabase
        .from("bookings")
        .select("*");

      // 3. Hämta Onboarding-ansökningar
      const { data: requestsData } = await supabase
        .from("onboarding_requests")
        .select("*");

      // --- FORMATERING AV DATA FÖR FILTRERING OCH KARTA ---
      if (partnersData) {
        const formattedPartners = partnersData.map((p) => ({
          ...p,
          lat: p.lat ? parseFloat(p.lat) : 59.3293,
          lng: p.lng ? parseFloat(p.lng) : 18.0686,
          // Mappar om kurser till 'schedule' för att SearchPage-filtren ska fungera
          schedule:
            p.courses?.map((c) => ({
              id: c.id,
              date: c.date,
              label: c.name,
              slots: c.slots,
              price: c.price || 4995,
            })) || [],
        }));
        setSchools(formattedPartners);
      }

      if (bookingsData) setBookings(bookingsData);
      if (requestsData) setOnboardingRequests(requestsData);
    } catch (error) {
      console.error("DataContext Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // --- FUNKTIONER FÖR ATT MANIPULERA DATA ---

  const addBooking = async (newBooking) => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert([newBooking])
        .select()
        .single(); // Returnerar det skapade objektet med ID till modalen

      if (error) throw error;

      // Uppdatera state lokalt för snabb respons
      setBookings((prev) => [...prev, data]);
      return data;
    } catch (err) {
      console.error("Fel vid sparande av bokning:", err.message);
      return null;
    }
  };

  const updateSlots = async (courseId, change) => {
    try {
      // 1. Hämta aktuellt antal platser
      const { data: course } = await supabase
        .from("courses")
        .select("slots")
        .eq("id", courseId)
        .single();

      if (course) {
        // 2. Uppdatera med det nya antalet (nuvarande + change, t.ex. -1)
        const { error: updateError } = await supabase
          .from("courses")
          .update({ slots: Math.max(0, course.slots + change) })
          .eq("id", courseId);

        if (updateError) throw updateError;

        // 3. Refresha allt så att SearchPage visar rätt siffror direkt
        await refreshData();
      }
    } catch (err) {
      console.error("Slot-update fel:", err.message);
    }
  };

  const addSchool = async (newSchool) => {
    try {
      const query = encodeURIComponent(
        `${newSchool.address}, ${newSchool.city}, Sweden`,
      );
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
      );
      const data = await response.json();

      let coords = { lat: 59.3293, lng: 18.0686 };
      if (data && data.length > 0) {
        coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }

      const { error } = await supabase
        .from("partners")
        .insert([
          { ...newSchool, lat: coords.lat, lng: coords.lng, status: "active" },
        ]);

      if (!error) refreshData();
    } catch (error) {
      console.error("Geocoding misslyckades:", error);
    }
  };

  const updateSchool = async (id, updatedFields) => {
    const { error } = await supabase
      .from("partners")
      .update(updatedFields)
      .eq("id", id);
    if (!error) refreshData();
  };

  const deleteSchool = async (id) => {
    const { error } = await supabase.from("partners").delete().eq("id", id);
    if (!error) refreshData();
  };

  return (
    <DataContext.Provider
      value={{
        schools,
        bookings,
        onboardingRequests,
        activeSchool,
        loading,
        setActiveSchool,
        refreshData,
        addSchool,
        updateSchool,
        deleteSchool,
        addBooking,
        updateSlots,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData måste användas inom en DataProvider");
  return context;
};
