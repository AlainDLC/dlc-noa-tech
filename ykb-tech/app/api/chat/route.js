import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { message, mode } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    let dbContext = "";
    if (mode === "student") {
      const today = new Date().toISOString().split("T")[0];
      const { data: courses } = await supabase
        .from("courses")
        .select("name, city, date, slots, price, address")
        .gt("slots", 0)
        .gte("date", today)
        .order("date", { ascending: true })
        .limit(15);
      dbContext = courses ? JSON.stringify(courses) : "";
    }

    const systemInstruction =
      mode === "partner"
        ? `Du är en affärsstrateg för YKB-Centralen. 
           REGLER:
           - Håll svaren under 30 ord. 
           - Var unik och personlig, inte en robot. 
           - Fokusera på lönsamhet och tillväxt.
           - Avsluta ofta med en kort, intresseväckande fråga.`
        : `Du är bokningsassistent för YKB Centralen.
           DATA: ${dbContext}
           REGLER:
           - Svara kort och koncist.
           - Om kursen i Hägersten (Västberga Allé 36) passar, föreslå den direkt.
           - Var hjälpsam men aldrig långrandig.`;

    const result = await model.generateContent([
      { text: systemInstruction },
      { text: message },
    ]);

    return NextResponse.json({ text: result.response.text() });
  } catch (error) {
    return NextResponse.json(
      { text: "Kunde inte svara just nu." },
      { status: 500 },
    );
  }
}
