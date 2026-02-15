import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  try {
    const body = await req.json();

    // Vi mappar om namnen från formuläret till databasens kolumner
    // name -> contact_person
    // school -> school_name
    const { name, email, school } = body;

    const { data, error } = await supabase.from("onboarding_requests").insert([
      {
        school_name: school,
        contact_person: name,
        email: email,
        status: "pending",
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Onboarding Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
