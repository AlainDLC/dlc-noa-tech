import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export const getStudentContext = async () => {
  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      name, city, date, slots, price, address, campaign_label,
      partners ( name )
    `,
    )
    .gt("slots", 0)
    .order("date", { ascending: true })
    .limit(40);

  if (error) throw error;
  return data && data.length > 0
    ? JSON.stringify(data)
    : "Inga kurser hittades.";
};
