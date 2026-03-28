import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1a3b4c] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* About */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/logo.jpg"
                alt="Logo Paroki Santa Melania"
                className="w-10 h-10 rounded-full object-cover"
              />
              <h3 className="text-white font-semibold" style={{ fontFamily: "Noto Serif, serif" }}>
                Gereja Katolik Santa Melania
              </h3>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Melayani umat Bandung sejak 1954. Paroki Santa Melania hadir sebagai rumah iman
              bagi setiap pencari makna dalam tradisi Katolik.
            </p>
            <a
              href="https://wa.me/6281321272634"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-[#25d366]/20 hover:bg-[#25d366]/30 text-white text-sm rounded-full transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#25d366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Kami
            </a>
          </div>

          {/* Menu */}
          <div>
            <h4 className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-4">Menu</h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Beranda" },
                { href: "/jadwal-misa", label: "Jadwal Misa" },
                { href: "/donasi", label: "Donasi" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-4">Lokasi</h4>
            <address className="not-italic text-white/60 text-sm leading-relaxed">
              Jl. Melania No.1-3<br />
              Cihaur Geulis, Kec. Cibeunying Kaler<br />
              Kota Bandung, Jawa Barat 40122
            </address>
            <a
              href="https://maps.app.goo.gl/tCd5SKadPSv4bLAS8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-white/40 hover:text-white/70 text-xs transition-colors underline"
            >
              Buka di Google Maps →
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-center">
          <p className="text-white/40 text-xs">
            © 2024 Gereja Katolik Santa Melania. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
