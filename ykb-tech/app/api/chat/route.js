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

    let systemInstruction = "";

    if (mode === "auth") {
      systemInstruction = `Du är AUTH SECURE - en teknisk säkerhetsassistent för YKB Centralens inloggning.
        DIN ROLL: Hjälp partners (utbildningsföretag) som har problem att logga in.
        REGLER:
        - Var extremt kortfattad (max 25 ord).
        - Tonen ska vara professionell, säker och teknisk.
        - Om de glömt lösenord: Be dem titta efter "Glömt lösenord"-länken eller kontakta admin.
        - Nämn aldrig Clerk eller Supabase vid namn för användaren.
        - Avsluta med att fråga om de vill ha en direktlänk till supporten.`;
    } else if (mode === "partner") {
      systemInstruction = `Du är en affärsstrateg för YKB-Centralen. 
        REGLER:
        - Håll svaren under 30 ord. 
        - Var unik och personlig, inte en robot. 
        - Fokusera på lönsamhet och tillväxt för utbildare.
        - Avsluta ofta med en kort, intresseväckande fråga.`;
    } else {
      systemInstruction = `Du är bokningsassistent för YKB Centralen.
        DATA: ${dbContext}
        REGLER:
        - Svara kort och koncist.
        - Om kursen i Hägersten (Västberga Allé 36) passar, föreslå den direkt.
        - Var hjälpsam men aldrig långrandig.`;
    }

    // 3. Generera svar
    const result = await model.generateContent([
      { text: systemInstruction },
      { text: `Användarens fråga: ${message}` },
    ]);

    return NextResponse.json({ text: result.response.text() });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { text: "Systemet är hårt belastat. Försök igen om en kort stund." },
      { status: 500 },
    );
  }
}
