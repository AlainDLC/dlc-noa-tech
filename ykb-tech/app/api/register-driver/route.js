import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { full_name, phone, city, license_types, score_percentage } = body;

    const { data, error } = await supabaseAdmin
      .from("market_drivers")
      .insert([
        {
          full_name,
          phone,
          city,
          license_types,
          score_percentage: parseInt(score_percentage),
          is_unlocked: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json(
        { error: "Kunde inte spara förare" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Förare tillagd i Leaderboard",
        driverId: data[0].id,
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "https://www.driveai.se", // Tillåt DrivAI
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    );
  } catch (err) {
    return NextResponse.json({ error: "Internt serverfel" }, { status: 500 });
  }
}

// Hantera Preflight-anrop (viktigt för webbläsaren)
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "https://www.driveai.se",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    },
  );
}
