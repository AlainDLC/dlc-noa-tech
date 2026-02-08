"use client";
import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import AdminNav from "./components/AdminNav";
import DashboardView from "./components/DashboardView";
import PartnersView from "./components/PartnersView";
import TransactionsView from "./components/TransactionsView";
import AddPartnerModal from "./components/AddPartnerModal";

export default function SuperAdmin() {
  const { schools, bookings, addSchool, deleteSchool, onboardingRequests } =
    useData();
  const [activeTab, setActiveTab] = useState("dashboard"); // Styr vyn
  const [isAdding, setIsAdding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col">
      <AdminNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="p-6 md:p-12 max-w-[1600px] mx-auto w-full">
        {/* Renderar rätt vy baserat på flik */}
        {activeTab === "dashboard" && (
          <DashboardView
            bookings={bookings}
            onboardingRequests={onboardingRequests}
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
