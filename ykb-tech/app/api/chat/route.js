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
      const { data: courses, error } = await supabase
        .from("courses")
        .select(
          `
          name, 
          city, 
          date, 
          slots, 
          price, 
          address, 
          campaign_label,
          partners!inner (
            name
          )
        `,
        )
        .gt("slots", 0)
        .order("date", { ascending: true })
        .limit(40);
      dbContext =
        courses && courses.length > 0
          ? JSON.stringify(courses)
          : "Just nu finns inga tillgängliga kurser i databasen.";
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
      systemInstruction = `Du är affärsstrateg för YKB-Centralen. 
    MÅL: Sälj in enkelheten och den ekonomiska tryggheten.
    ARGUMENT: 
    - Garanterad betalning: Eleven betalar i förskott, vi håller pengarna åt er.
    - Pengarna direkt: När ni scannar elevens QR-kod godkänns er utbetalning (95%) direkt.
    - Inget pappersarbete: Vi sköter all admin och fakturering.
    REGLER:
    - Max 35 ord.
    - Rak, ärlig och peppig "bransch-ton".
    - Avsluta med en fråga om deras nästa kursstart eller kassaflöde.`;
    } else {
      systemInstruction = `Du är bokningsassistent för YKB Centralen.
        TILLGÄNGLIGA KURSER FRÅN DATABASEN: ${dbContext}
        DIN ROLL: Hjälp eleven hitta rätt kurs och förklara bokningsfördelarna.
        REGLER:
        - Svara kort och trevligt. 
        - Nämn alltid skolan (partnerns namn) och priset.
        - Om de letar i en specifik stad (t.ex. Göteborg), visa bara de kurserna.
        - Tryck på att de får sin QR-kod direkt till mobilen efter betalning.
        - Förklara att QR-koden är deras biljett som skolan scannar på plats.
        - Avsluta med att fråga om de vill ha direktlänken för att boka en av platserna.`;
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
