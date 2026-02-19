"use client";
import React, { useState, useEffect } from "react";
import {
  useUser,
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useData } from "../../context/DataContext";
import { supabase } from "@/lib/supabase"; // Se till att sökvägen stämmer
import AdminNav from "./components/AdminNav";
import DashboardView from "./components/DashboardView";
import PartnersView from "./components/PartnersView";
import TransactionsView from "./components/TransactionsView";
import AddPartnerModal from "./components/AddPartnerModal";
import ApprovalsView from "./components/ApprovalsView";

export default function SuperAdmin() {
  const { isLoaded, user } = useUser();
  const {
    schools,
    bookings,
    addSchool,
    deleteSchool,
    onboardingRequests,
    getData,
  } = useData();

  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAdding, setIsAdding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- FUNKTIONER FÖR ATT HANTERA ANSÖKNINGAR ---
  const handleApprovePartner = async (request) => {
    const confirmApprove = confirm(`Vill du godkänna ${request.school_name}?`);
    if (!confirmApprove) return;

    try {
      // 1. Kolla om partnern redan finns (för att undvika duplicate key error)
      const { data: existing } = await supabase
        .from("partners")
        .select("id")
        .eq("email", request.email)
        .single();

      if (existing) {
        // Om den finns, uppdatera bara statusen istället för att skapa ny
        await supabase
          .from("partners")
          .update({ status: "pending_registration" })
          .eq("id", existing.id);
      } else {
        // Om den INTE finns, skapa den som vanligt
        const { error: insertError } = await supabase.from("partners").insert([
          {
            name: request.school_name,
            email: request.email,
            city: "Väntar på uppgifter",
            status: "pending_registration",
          },
        ]);
        if (insertError) throw insertError;
      }

      // 2. Ta bort onboarding-förfrågan oavsett om partnern fanns eller inte
      await supabase.from("onboarding_requests").delete().eq("id", request.id);

      // 3. Uppdatera lokal data
      if (getData) await getData();

      alert("Partner godkänd! De kan nu slutföra sin registrering.");
      setActiveTab("partners");
    } catch (err) {
      alert("Kunde inte godkänna: " + err.message);
    }
  };

  const handleDenyPartner = async (requestId) => {
    if (!confirm("Vill du radera denna ansökan helt?")) return;

    try {
      await supabase.from("onboarding_requests").delete().eq("id", requestId);
      if (getData) await getData();
    } catch (err) {
      alert("Kunde inte neka: " + err.message);
    }
  };

  if (!mounted || !isLoaded) return null;

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col">
      {/* --- UTLOGGAT LÄGE --- */}
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl mb-6 text-white">
            <span className="font-black text-2xl italic">Y</span>
          </div>
          <h1 className="text-3xl font-[1000] uppercase italic tracking-tighter mb-2">
            Admin Centralen
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            Logga in för att hantera YKB
          </p>
          <SignInButton mode="modal">
            <button className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-blue-600 transition-all shadow-2xl border-none cursor-pointer">
              Logga in som Admin
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      {/* --- INLOGGAT LÄGE --- */}
      <SignedIn>
        {user?.primaryEmailAddress?.emailAddress === adminEmail ? (
          <>
            {/* Status Bar */}
            <div className="bg-white border-b border-slate-100 p-3 flex justify-between items-center px-12">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  System Admin:{" "}
                  <span className="text-slate-900">
                    {user?.primaryEmailAddress?.emailAddress}
                  </span>
                </span>
              </div>
              <SignOutButton redirectUrl="/">
                <button className="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all cursor-pointer border border-red-100">
                  Logga ut
                </button>
              </SignOutButton>
            </div>

            <AdminNav
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              bookings={bookings}
            />

            <main className="p-6 md:p-12 max-w-[1600px] mx-auto w-full">
              {/* Dashboard */}
              {activeTab === "dashboard" && (
                <DashboardView
                  bookings={bookings}
                  onboardingRequests={onboardingRequests}
                  setActiveTab={setActiveTab}
                />
              )}

              {/* Partners */}
              {activeTab === "partners" && (
                <PartnersView
                  schools={schools}
                  bookings={bookings}
                  deleteSchool={deleteSchool}
                  openAddModal={() => setIsAdding(true)}
                />
              )}

              {/* Approvals (Granskning av nya skolor) */}
              {activeTab === "approvals" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter">
                    Pending <span className="text-blue-600">Approvals</span>
                  </h2>
                  <ApprovalsView
                    requests={onboardingRequests}
                    onApprove={handleApprovePartner}
                    onDeny={handleDenyPartner}
                  />
                </div>
              )}

              {/* Payouts (Utbetalningar) */}
              {activeTab === "payouts" && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-8">
                    Payment <span className="text-blue-600">Settlements</span>
                  </h2>
                  <div className="bg-white p-20 rounded-[3rem] border border-slate-200 text-center">
                    <p className="font-black text-slate-300 uppercase italic text-2xl tracking-tighter">
                      Inga utbetalningskrav just nu
                    </p>
                  </div>
                </div>
              )}

              {/* Transaktioner */}
              {activeTab === "transactions" && (
                <TransactionsView bookings={bookings} schools={schools} />
              )}
            </main>
          </>
        ) : (
          /* Obehörig */
          <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <h2 className="text-xl font-black uppercase mb-4">
              Obehörig Åtkomst
            </h2>
            <p className="text-slate-400 text-xs mb-6 text-center">
              Ditt konto ({user?.primaryEmailAddress?.emailAddress}) har inte
              admin-rättigheter.
            </p>
            <SignOutButton redirectUrl="/">
              <button className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold uppercase border-none cursor-pointer">
                Logga ut
              </button>
            </SignOutButton>
          </div>
        )}
      </SignedIn>

      {/* Modaler */}
      {isAdding && (
        <AddPartnerModal
          close={() => setIsAdding(false)}
          addSchool={addSchool}
        />
      )}
    </div>
  );
}
