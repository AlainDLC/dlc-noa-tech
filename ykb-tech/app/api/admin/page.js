"use client";
import React, { useState, useEffect } from "react";
import { useUser, SignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
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

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAdding, setIsAdding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <SignIn routing="hash" forceRedirectUrl="/admin" />
      </div>
    );
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (user.primaryEmailAddress?.emailAddress !== adminEmail) {
    console.error("Obehörigt inloggningsförsök!");
    redirect("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col">
      <AdminNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="p-6 md:p-12 max-w-[1600px] mx-auto w-full">
        {activeTab === "dashboard" && (
          <DashboardView
            bookings={bookings}
            onboardingRequests={onboardingRequests}
            setActiveTab={setActiveTab} // HÄR ÄR FIXEN! Nu kan komponenten byta flik.
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

      {isAdding && (
        <AddPartnerModal
          close={() => setIsAdding(false)}
          addSchool={addSchool}
        />
      )}
    </div>
  );
}
