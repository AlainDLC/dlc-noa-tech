import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Detta är hjärtat i kopplingen - glöm inte ordet 'export'
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log(
  "Kollar env:",
  process.env.NEXT_PUBLIC_SUPABASE_URL ? "HITTAD" : "SAKNAS",
);

export async function getCoords(address, city) {
  try {
    const query = `${address}, ${city}, Sweden`;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      {
        headers: {
          "User-Agent": "YKB-Centralen-App", // Krävs för att det ska vara gratis
        },
      },
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        /* lat: parseFloat(data[0].lat), // Gör om sträng "57.68" till siffra 57.68
            lng: parseFloat(data[0].lon),*/
        lat: data[0].lat,
        lng: data[0].lon,
      };
    }
  } catch (error) {
    console.error("Geokodning misslyckades:", error);
  }
  return null;
}
