import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();

    // HÄR: Senare lägger vi kod för att skicka mejl eller spara i databas
    console.log("Ny intresseanmälan mottagen:", data);

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
