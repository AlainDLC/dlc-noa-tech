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
import { supabase } from "@/lib/supabase";
import AdminNav from "./components/AdminNav";
import DashboardView from "./components/DashboardView";
import PartnersView from "./components/PartnersView";
import TransactionsView from "./components/TransactionsView";
import AddPartnerModal from "./components/AddPartnerModal";
import ApprovalsView from "./components/ApprovalsView";
import { CheckCircle, Clock, CreditCard } from "lucide-react";

export default function SuperAdmin() {
  const { isLoaded, user } = useUser();
  const {
    schools,
    bookings,
    addSchool,
    deleteSchool,
    onboardingRequests,
    refreshData, // Använder refreshData från context
  } = useData();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAdding, setIsAdding] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [payouts, setPayouts] = useState([]); // State för utbetalningar

  useEffect(() => {
    setMounted(true);
    fetchPayouts();
  }, [activeTab]); // Hämta på nytt när man byter flik

  const fetchPayouts = async () => {
    const { data, error } = await supabase
      .from("payouts")
      .select("*")
      .eq("status", "pending_payout");
    if (!error) setPayouts(data);
  };

  const handleApprovePartner = async (request) => {
    const confirmApprove = confirm(`Vill du godkänna ${request.school_name}?`);
    if (!confirmApprove) return;

    try {
      const { data: existing } = await supabase
        .from("partners")
        .select("id")
        .eq("email", request.email)
        .single();

      if (existing) {
        await supabase
          .from("partners")
          .update({ status: "pending_registration" })
          .eq("id", existing.id);
      } else {
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
      await supabase.from("onboarding_requests").delete().eq("id", request.id);
      if (refreshData) await refreshData();
      alert("Partner godkänd!");
      setActiveTab("partners");
    } catch (err) {
      alert("Kunde inte godkänna: " + err.message);
    }
  };

  const handleProcessPayout = async (payoutId) => {
    try {
      const { error } = await supabase
        .from("payouts")
        .update({ status: "paid_out" }) // Uppdaterar status i DB
        .eq("id", payoutId);

      if (error) throw error;

      alert("Utbetalning slutförd! Pengarna markerade som skickade.");

      // --- FIXEN: Ta bort den utbetalda raden från UI direkt ---
      setPayouts((prevPayouts) => prevPayouts.filter((p) => p.id !== payoutId));

      // Uppdatera global data (valfritt men bra)
      if (refreshData) await refreshData();
    } catch (err) {
      console.error("Payout error:", err.message);
      alert("Kunde inte genomföra utbetalningen.");
    }
  };

  const handleDenyPartner = async (requestId) => {
    if (!confirm("Vill du radera denna ansökan helt?")) return;
    try {
      await supabase.from("onboarding_requests").delete().eq("id", requestId);
      if (refreshData) await refreshData();
    } catch (err) {
      alert("Kunde inte neka: " + err.message);
    }
  };

  if (!mounted || !isLoaded) return null;
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col text-slate-900">
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-10">
          <h1 className="text-3xl font-[1000] uppercase italic tracking-tighter mb-8 text-slate-900">
            Admin Centralen
          </h1>
          <SignInButton mode="modal">
            <button className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase italic tracking-widest cursor-pointer">
              Logga in
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        {user?.primaryEmailAddress?.emailAddress === adminEmail ? (
          <>
            <div className="bg-white border-b border-slate-100 p-3 flex justify-between items-center px-12 text-slate-900">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase text-slate-400">
                  System Admin: {user?.primaryEmailAddress?.emailAddress}
                </span>
              </div>
              <SignOutButton redirectUrl="/">
                <button className="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer">
                  Logga ut
                </button>
              </SignOutButton>
            </div>

            <AdminNav
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              bookings={bookings}
            />

            <main className="p-6 md:p-12 max-w-[1600px] mx-auto w-full text-slate-900">
              {activeTab === "dashboard" && (
                <DashboardView
                  bookings={bookings}
                  onboardingRequests={onboardingRequests}
                  setActiveTab={setActiveTab}
                  payouts={payouts}
                />
              )}
              {activeTab === "partners" && (
                <PartnersView
                  schools={schools}
                  bookings={bookings}
                  deleteSchool={deleteSchool}
                  openAddModal={() => setIsAdding(true)}
                />
              )}
              {activeTab === "approvals" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 text-slate-900">
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

              {/* PAYOUTS FLIKEN */}
              {activeTab === "payouts" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 text-slate-900">
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-8">
                    Payment <span className="text-blue-600">Settlements</span>
                  </h2>

                  {payouts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {payouts.map((p) => (
                        <div
                          key={p.id}
                          className="bg-white p-8 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm"
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                              <CreditCard size={24} />
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                                Utbetalning till skola
                              </p>
                              <h3 className="text-xl font-black uppercase italic tracking-tighter">
                                {p.description}
                              </h3>
                            </div>
                          </div>
                          <div className="flex items-center gap-8">
                            <div className="text-right">
                              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                                Belopp Netto
                              </p>
                              <p className="text-2xl font-black italic tracking-tighter text-emerald-600">
                                {p.amount.toLocaleString()} KR
                              </p>
                            </div>
                            <button
                              onClick={() => handleProcessPayout(p.id)}
                              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest hover:bg-emerald-600 transition-all cursor-pointer shadow-lg shadow-slate-100"
                            >
                              Process Payout
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-20 rounded-[3rem] border border-slate-200 text-center">
                      <p className="font-black text-slate-300 uppercase italic text-2xl tracking-tighter">
                        Inga utbetalningskrav just nu
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "transactions" && (
                <TransactionsView bookings={bookings} schools={schools} />
              )}
            </main>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900">
            <h2 className="text-xl font-black uppercase mb-4 text-slate-900">
              Obehörig Åtkomst
            </h2>
            <SignOutButton redirectUrl="/">
              <button className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold uppercase cursor-pointer">
                Logga ut
              </button>
            </SignOutButton>
          </div>
        )}
      </SignedIn>

      {isAdding && (
        <AddPartnerModal
          close={() => setIsAdding(false)}
          addSchool={addSchool}
        />
      )}
    </div>
  );
}
