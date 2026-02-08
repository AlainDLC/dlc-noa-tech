// components/AddPartnerModal.js
import React, { useState } from "react";
import { X } from "lucide-react";

export default function AddPartnerModal({ close, addSchool }) {
  const [newPartner, setNewPartner] = useState({ name: "", city: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.city) return;
    addSchool({ id: Date.now().toString(), ...newPartner });
    close();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[3rem] p-12 w-full max-w-md shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 text-slate-900">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">
            Add <span className="text-blue-600">Partner</span>
          </h2>
          <button
            onClick={close}
            className="text-slate-300 hover:text-slate-900 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Skolans Namn"
            required
            className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all"
            onChange={(e) =>
              setNewPartner({ ...newPartner, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Stad"
            required
            className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all"
            onChange={(e) =>
              setNewPartner({ ...newPartner, city: e.target.value })
            }
          />
          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
          >
            Spara Partner
          </button>
        </form>
      </div>
    </div>
  );
}
