import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

export async function POST(request) {
  // Hämta origin dynamiskt för att undvika CORS-missmatch
  const origin = request.headers.get("origin") || "*";

  try {
    const body = await request.json();
    const { full_name, phone, city, license_types, score_percentage } = body;

    // Säkerhetscheck för miljövariabler i loggen
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error(
        "KRITISKT FEL: SUPABASE_SERVICE_ROLE_KEY saknas på Vercel!",
      );
    }

    const { data, error } = await supabaseAdmin
      .from("market_drivers")
      .insert([
        {
          full_name,
          phone,
          city,
          license_types,
          score_percentage: parseInt(score_percentage) || 0,
          is_unlocked: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json(
        { error: error.message },
        {
          status: 500,
          headers: { "Access-Control-Allow-Origin": origin },
        },
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
    console.error("Server Error:", err);
    return NextResponse.json(
      { error: "Internt serverfel" },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": origin },
      },
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
