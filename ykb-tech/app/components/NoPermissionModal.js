"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { ShieldAlert, Lock, Zap, ArrowRight, ShieldCheck } from "lucide-react";

export function NoPermissionModal({ isOpen, onOpenChange }) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      radius="3xl"
      classNames={{
        backdrop: "bg-slate-950/80 backdrop-blur-xl",
        base: "border border-slate-200/50 bg-white/90 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] mx-4 overflow-hidden",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            {/* Dekorativ accent-bar längst upp */}
            <div className="h-2 w-full bg-gradient-to-r from-red-500 via-[#0000ff] to-blue-400" />

            <ModalHeader className="flex flex-col gap-1 pt-10 px-8 text-left">
              <div className="flex items-start justify-between w-full">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none">
                      Security Protocol \ 403
                    </span>
                  </div>
                  <h2 className="text-4xl font-[1000] italic uppercase tracking-tighter text-slate-900 leading-[0.9]">
                    Access <br />
                    <span className="text-[#0000ff]">Restricted</span>
                  </h2>
                </div>
                <div className="bg-slate-900 p-4 rounded-2xl rotate-3 shadow-lg">
                  <Lock className="text-white" size={32} />
                </div>
              </div>
            </ModalHeader>

            <ModalBody className="py-8 px-8 text-left">
              <div className="space-y-6">
                <p className="text-slate-600 text-lg font-medium leading-tight italic">
                  "Den här profilen är krypterad för att skydda förarens
                  personuppgifter."
                </p>

                {/* Info Cards */}
                <div className="grid gap-3">
                  <div className="group flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-blue-50 hover:border-blue-200">
                    <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                      <ShieldCheck size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">
                        Status
                      </p>
                      <p className="text-sm font-bold text-slate-900 leading-none">
                        Verifierad YKB-kompetens
                      </p>
                    </div>
                  </div>

                  <div className="group flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-blue-50 hover:border-blue-200">
                    <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                      <Zap size={20} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">
                        Krav
                      </p>
                      <p className="text-sm font-bold text-slate-900 leading-none italic">
                        Företagsabonnemang krävs
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>

            <ModalFooter className="flex flex-col gap-4 pb-12 px-8 pt-4">
              <Button
                className="bg-slate-900 text-white font-[1000] uppercase italic tracking-[0.1em] w-full h-16 rounded-2xl shadow-xl flex items-center justify-between px-8 group overflow-hidden relative"
                onPress={onClose}
              >
                <span className="relative z-10">Uppgradera nu</span>
                <ArrowRight
                  size={20}
                  className="relative z-10 group-hover:translate-x-2 transition-transform"
                />
                <div className="absolute inset-0 bg-[#0000ff] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Button>

              <button
                onClick={onClose}
                className="group flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors italic"
              >
                <ShieldAlert size={12} className="group-hover:animate-shake" />
                Fortsätt som gäst
              </button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
