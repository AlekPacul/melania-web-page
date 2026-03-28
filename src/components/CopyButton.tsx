"use client";

import { useState } from "react";
import Toast from "./Toast";

export default function CopyButton({ value }: { value: string }) {
  const [show, setShow] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setShow(true);
  };

  return (
    <>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[#e9e8e7] text-[#41484b] hover:bg-[#1a3b4c] hover:text-white transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
        Salin
      </button>
      <Toast show={show} onDone={() => setShow(false)} />
    </>
  );
}
