"use client";

import { useEffect } from "react";

export default function Toast({ show, onDone }: { show: boolean; onDone: () => void }) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [show, onDone]);

  return (
    <div
      className={`fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-2.5 bg-[#dcfce7] text-[#166534] text-sm font-medium px-5 py-3 rounded-full shadow-lg whitespace-nowrap">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Nomor rekening berhasil disalin
      </div>
    </div>
  );
}
