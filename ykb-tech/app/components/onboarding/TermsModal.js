import { X } from "lucide-react";

export default function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <h3 className="text-xl font-black uppercase italic tracking-tighter">
            Kommersiella Villkor
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-700 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-8 md:p-12 overflow-y-auto max-h-[70vh] text-slate-600 space-y-6">
          {/* Villkorstexten här... */}
          <section>
            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />{" "}
              Provisionsmodell
            </h4>
            <p className="text-sm leading-relaxed">
              YKB-CENTRALEN tillämpar en rörlig provisionsmodell...
            </p>
          </section>
          {/* Fler sektioner... */}
        </div>
        <div className="p-6 border-t bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase text-xs"
          >
            Stäng
          </button>
        </div>
      </div>
    </div>
  );
}
