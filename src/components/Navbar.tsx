"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/jadwal-misa", label: "Jadwal Misa" },
  { href: "/donasi", label: "Donasi" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-[#c1c7cc]/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/assets/logo.jpg"
            alt="Logo Paroki Santa Melania"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span
            className="text-[#1a3b4c] text-sm font-semibold leading-tight"
            style={{ fontFamily: "Noto Serif, serif" }}
          >
            Santa Melania
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-[#1a3b4c]"
                  : "text-[#41484b] hover:text-[#1a3b4c]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/donasi"
            className="px-5 py-2 bg-[#1a3b4c] text-white text-sm font-medium rounded-full hover:bg-[#335264] transition-colors"
          >
            Persembahan
          </Link>
        </nav>
      </div>
    </header>
  );
}
