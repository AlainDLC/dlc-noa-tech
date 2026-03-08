import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function POST(request) {
  try {
    const { driverId } = await request.json();

    const { data, error } = await supabaseAdmin
      .from("market_drivers")
      .update({ is_unlocked: true })
      .eq("id", driverId)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, driver: data[0] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
