import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getStudentContext } from "@/lib/ykbService";
import { getSystemInstruction } from "@/lib/prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { message, mode } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // 1. Hämta kontext baserat på mode
    let dbContext = "";
    if (mode === "student") {
      dbContext = await getStudentContext();
    }

    // 2. Hämta färdigbyggd instruktion
    const systemInstruction = getSystemInstruction(mode, dbContext);

    // 3. Kör AI
    const result = await model.generateContent([
      { text: systemInstruction },
      { text: `Användarens fråga: ${message}` },
    ]);

    return NextResponse.json({ text: result.response.text() });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { text: "Systemfel, försök igen." },
      { status: 500 },
    );
  }
}
