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
import AdminNav from "./components/AdminNav";
import DashboardView from "./components/DashboardView";
import PartnersView from "./components/PartnersView";
import TransactionsView from "./components/TransactionsView";
import AddPartnerModal from "./components/AddPartnerModal";

export default function SuperAdmin() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { schools, bookings, addSchool, deleteSchool, onboardingRequests } =
    useData();

  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAdding, setIsAdding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return null;
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col">
      {/* OM MAN INTE ÄR INLOGGAD */}
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl mb-6">
            <span className="text-white font-black text-2xl italic">Y</span>
          </div>
          <h1 className="text-3xl font-[1000] uppercase italic tracking-tighter mb-2 text-slate-900">
            Admin Centralen
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-slate-400">
            Logga in för att hantera YKB
          </p>

          <SignInButton mode="modal">
            <button className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-blue-600 transition-all cursor-pointer shadow-2xl border-none">
              Logga in som Admin
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      {/* OM MAN ÄR INLOGGAD */}
      <SignedIn>
        {user?.primaryEmailAddress?.emailAddress === adminEmail ? (
          <>
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
                <button className="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all cursor-pointer border border-red-100 outline-none">
                  Logga ut från Admin
                </button>
              </SignOutButton>
            </div>

            <AdminNav activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="p-6 md:p-12 max-w-[1600px] mx-auto w-full">
              {activeTab === "dashboard" && (
                <DashboardView
                  bookings={bookings}
                  onboardingRequests={onboardingRequests}
                  setActiveTab={setActiveTab}
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

              {activeTab === "transactions" && (
                <TransactionsView bookings={bookings} schools={schools} />
              )}
            </main>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <h2 className="text-xl font-black uppercase mb-4 text-slate-900 text-slate-900">
              Obehörig Åtkomst
            </h2>
            <p className="text-slate-400 text-xs mb-6">
              Ditt konto har inte admin-rättigheter.
            </p>
            <SignOutButton redirectUrl="/api/admin">
              <button className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold uppercase border-none cursor-pointer">
                Logga ut och byt konto
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
