import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

export async function POST(request) {
  const origin = request.headers.get("origin") || "*";

  try {
    const body = await request.json();

    const {
      full_name,
      phone,
      city,
      license_types,
      score_percentage,
      experience_level,
      has_bus_license,
      has_c_license, // NY
      has_ce_license, // NY
      has_ykb,
      adr_status,
      truck_card,
      kran_card,
      bio,
      tiktok_url,
      linkedin_url, // NY
      instagram_url, // NY
      facebook_url, // NY
      youtube_url,
      external_user_id,
    } = body;

    // Vi använder UPSERT för att undvika dubbletter på samma användare
    const { data, error } = await supabaseAdmin
      .from("market_drivers")
      .upsert(
        {
          full_name,
          phone,
          city,
          license_types: license_types || "C, CE, YKB",
          score_percentage: parseInt(score_percentage) || 0,
          experience_level: experience_level || "0-2 år",
          has_bus_license: !!has_bus_license,
          has_c_license: !!has_c_license, // Sparas i egen kolumn
          has_ce_license: !!has_ce_license, // Sparas i egen kolumn
          has_ykb: !!has_ykb,
          adr_status: adr_status || "Saknas",
          truck_card: !!truck_card,
          kran_card: !!kran_card,
          bio,
          linkedin_url,
          instagram_url,
          facebook_url,
          tiktok_url,
          youtube_url,
          external_user_id,
          is_unlocked: false, // Behåll låst tills rekryterare betalar
          is_verified: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "external_user_id" }, // Om ID finns -> Uppdatera raden
      )
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500, headers: { "Access-Control-Allow-Origin": origin } },
      );
    }

    return NextResponse.json(
      { success: true, driverId: data[0]?.id },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    );
  } catch (err) {
    console.error("Fetch Error:", err);
    return NextResponse.json(
      { error: "Internt serverfel" },
      { status: 500, headers: { "Access-Control-Allow-Origin": origin } },
    );
  }
}

export async function OPTIONS(request) {
  const origin = request.headers.get("origin") || "*";
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
