"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function PartnerLayout({ children }) {
  const { user, isLoaded } = useUser();
  const params = useParams();

  // VIKTIGT: Om din mapp heter [id] så använd params.id
  // Om din mapp heter [partnerId] så använd params.partnerId
  const urlIdentifier = params?.id || params?.partnerId;

  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      if (!isLoaded) return;

      if (!user) {
        console.log("Layout: Ingen användare hittad.");
        router.push("/");
        return;
      }

      // HÄR: Vi lägger till 'name' i select så loggen slutar visa undefined
      const { data: partner, error } = await supabase
        .from("partners")
        .select("id, slug, clerk_id, name")
        .eq("clerk_id", user.id)
        .single();

      if (error || !partner) {
        console.log("Åtkomst nekad: Ingen partner hittad.");
        router.push("/");
        return;
      }

      // Kontrollera om URL matchar antingen UUID eller Slug
      const isCorrectPath =
        partner.id === urlIdentifier || partner.slug === urlIdentifier;

      if (!isCorrectPath) {
        console.log("Layout: Fel URL. Skickar till rätt dashboard.");
        // Vi skickar användaren till slug-versionen om den finns, annars ID
        const targetPath = partner.slug || partner.id;
        router.push(`/partner/${targetPath}/dashboard`);
        return;
      }

      console.log("Layout: Auktoriserad för", partner.name);
      setAuthorized(true);
    }

    checkAccess();
  }, [user, isLoaded, urlIdentifier, router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-[1000] uppercase italic tracking-tighter text-slate-400">
            Verifierar Partner...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
