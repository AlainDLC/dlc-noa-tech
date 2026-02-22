// hooks/useMarketplace.js
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useMarketplace() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("partners").select(`
        id, name, city, address, lat, lng, slug, description,
        courses (*) 
      `);

      if (!error && data) {
        const formatted = data.map((school) => ({
          ...school,
          schedule: school.courses.map((c) => ({
            date: c.date,
            label: c.name,
            slots: c.slots,
            price: c.price || 5000,
            campaign_label: c.campaign_label,
          })),
        }));
        setSchools(formatted);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return { schools, loading };
}
