import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  try {
    const body = await req.json();
    const { id, school_name, email } = body;

    // 1. Skapa partnern i 'partners'-tabellen
    const { data: newPartner, error: partnerError } = await supabase
      .from("partners")
      .insert([
        {
          name: school_name,
          email: email,
          status: "pending",
          city: "Väntar på uppgifter",
        },
      ])
      .select()
      .single();

    if (partnerError) throw partnerError;

    // 2. Uppdatera status på ansökan till 'approved'
    const { error: updateError } = await supabase
      .from("onboarding_requests")
      .update({ status: "approved" })
      .eq("id", id);

    if (updateError) throw updateError;

    // 3. Retur till frontend
    return NextResponse.json({
      success: true,
      partner_id: newPartner.id, // Viktigt: Detta används för länken
      email: email,
    });
  } catch (err) {
    console.error("Approve Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
