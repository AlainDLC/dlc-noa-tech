import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  // Låt API-anropet gå direkt till din route.js utan Clerk-spärrar för tillfället
  if (req.nextUrl.pathname.startsWith("/api/approve")) {
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    // Hoppa över interna filer
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Kör alltid för API-rutter
    "/(api|trpc)(.*)",
  ],
};
