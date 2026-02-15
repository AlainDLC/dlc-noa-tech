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

      // 1. Hämta Partners inkl. deras kurser (Relationen courses(*))
      const { data: partnersData, error: partnersError } = await supabase
        .from("partners")
        .select("*, courses(*)")
        .eq("status", "active"); // Vi visar bara godkända partners i marketplace

      if (partnersError) throw partnersError;

      // 2. Hämta Bokningar
      const { data: bookingsData } = await supabase
        .from("bookings")
        .select("*");

      // 3. Hämta Onboarding-ansökningar (för Super Admin)
      const { data: requestsData } = await supabase
        .from("onboarding_requests")
        .select("*");

      // --- FORMATERING AV DATA ---
      if (partnersData) {
        const formattedPartners = partnersData.map((p) => ({
          ...p,
          // Säkra att koordinater är nummer för kartan
          lat: p.lat ? parseFloat(p.lat) : 59.3293,
          lng: p.lng ? parseFloat(p.lng) : 18.0686,
          // Formatera om courses till 'schedule' som SearchPage förväntar sig
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

  // Körs vid första laddning
  useEffect(() => {
    refreshData();
  }, []);

  // --- FUNKTIONER FÖR ATT MANIPULERA DATA ---

  const addSchool = async (newSchool) => {
    // Geocoding via Nominatim
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

      const schoolToSave = {
        ...newSchool,
        lat: coords.lat,
        lng: coords.lng,
        status: "active",
      };

      const { data: savedData, error } = await supabase
        .from("partners")
        .insert([schoolToSave])
        .select();
      if (!error) refreshData();
    } catch (error) {
      console.error("Geocoding/Insert misslyckades:", error);
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
  const addBooking = async (newBooking) => {
    try {
      console.log("DataContext: Sparar bokning med pris:", newBooking.price);

      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            partner_id: newBooking.schoolId,
            student_name: newBooking.name,
            student_email: newBooking.email,
            // HÄR SKER KOPPLINGEN:
            amount: newBooking.price,
            commission_amount: Math.round(newBooking.price * 0.15),
            status: "paid",
            course_date: newBooking.date,
          },
        ])
        .select();

      if (error) throw error;

      setBookings((prev) => [...prev, data[0]]);
      return true;
    } catch (err) {
      console.error("Fel vid sparande:", err.message);
      return false;
    }
  };

  const updateSlots = async (courseId, change) => {
    // Här bör vi egentligen uppdatera 'courses'-tabellen direkt
    // Men för att hålla det enkelt just nu kör vi en refresh efteråt
    try {
      // Hämta nuvarande slots först (eller använd change direkt i en RPC/increment)
      const { data: course } = await supabase
        .from("courses")
        .select("slots")
        .eq("id", courseId)
        .single();

      if (course) {
        await supabase
          .from("courses")
          .update({ slots: Math.max(0, course.slots + change) })
          .eq("id", courseId);

        refreshData(); // Uppdatera allt så att sök-sidan visar rätt antal direkt
      }
    } catch (err) {
      console.error("Slot-update fel:", err);
    }
  };

  const updateBooking = async (id, updatedFields) => {
    const { error } = await supabase
      .from("bookings")
      .update(updatedFields)
      .eq("id", id);
    if (!error) refreshData();
  };

  const saveSchool = async (schoolData) => {
    const { error } = await supabase.from("partners").upsert(schoolData);
    if (!error) refreshData();
  };

  return (
    <DataContext.Provider
      value={{
        schools,
        bookings,
        onboardingRequests,
        activeSchool,
        loading, // Viktigt: Exponera loading-staten
        setActiveSchool,
        refreshData,
        addSchool,
        updateSchool,
        deleteSchool,
        addBooking,
        updateBooking,
        saveSchool,
        updateSlots,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData måste användas inom en DataProvider");
  }
  return context;
};
