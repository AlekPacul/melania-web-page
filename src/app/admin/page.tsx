import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Coming Soon",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#1a3b4c] flex flex-col items-center justify-center px-6 text-center">
      <img
        src="/assets/logo.jpg"
        alt="Logo Paroki Santa Melania"
        className="w-20 h-20 rounded-full object-cover mb-8 opacity-90"
      />
      <p className="text-white/50 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
        Paroki Santa Melania
      </p>
      <h1
        className="text-white text-4xl lg:text-5xl font-semibold mb-4"
        style={{ fontFamily: "Noto Serif, serif", letterSpacing: "-0.02em" }}
      >
        Segera Hadir
      </h1>
      <p className="text-white/60 max-w-sm leading-relaxed mb-10">
        Halaman admin sedang dalam pengembangan. Kami akan segera hadir dengan fitur pengelolaan paroki yang lengkap.
      </p>
      <div className="w-12 h-px bg-white/20 mb-10" />
      <Link
        href="/"
        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-full transition-colors"
      >
        ← Kembali ke Beranda
      </Link>
    </div>
  );
}
