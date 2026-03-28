import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Jadwal Misa",
  description:
    "Jadwal Misa Paroki Santa Melania Bandung. Misa harian Senin–Jumat pukul 06:00, Sabtu 17:00 (Vigili), Minggu 06:30 & 09:00. Misa Jumat Pertama setiap awal bulan pukul 17:00.",
  keywords: [
    "jadwal misa Bandung",
    "misa Paroki Santa Melania",
    "jadwal misa Santa Melania",
    "misa minggu Bandung",
  ],
  alternates: { canonical: "/jadwal-misa" },
  openGraph: {
    title: "Jadwal Misa — Paroki Santa Melania Bandung",
    description:
      "Jadwal lengkap Misa harian dan mingguan Paroki Santa Melania Bandung.",
    url: "/jadwal-misa",
  },
};

const weeklySchedule = [
  {
    day: "Senin – Kamis",
    masses: [
      { time: "06:00", type: "Misa Harian", note: "" },
    ],
  },
  {
    day: "Jumat",
    masses: [
      { time: "06:00", type: "Misa Harian", note: "" },
      { time: "17:00", type: "Misa Jumat Pertama", note: "Jumat pertama awal bulan" },
    ],
  },
  {
    day: "Sabtu",
    masses: [
      { time: "17:00", type: "Misa Sabtu Sore", note: "" },
    ],
  },
  {
    day: "Minggu",
    masses: [
      { time: "06:30", type: "Misa Pagi I", note: "" },
      { time: "09:00", type: "Misa Pagi II", note: "" },
    ],
  },
];


const guidelines = [
  {
    icon: "👔",
    title: "Busana Sopan",
    desc: "Kenakan pakaian yang sopan dan layak untuk memasuki rumah Tuhan.",
  },
  {
    icon: "🕐",
    title: "Hadir Tepat Waktu",
    desc: "Diharapkan hadir 10–15 menit sebelum Misa dimulai.",
  },
  {
    icon: "🍞",
    title: "Puasa Ekaristi",
    desc: "Puasa selama 1 jam sebelum menerima Komuni Kudus.",
  },
  {
    icon: "📵",
    title: "Nonaktifkan Ponsel",
    desc: "Matikan atau silent ponsel selama perayaan berlangsung.",
  },
];

export default function JadwalMisa() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Header */}
        <section className="bg-[#f4f3f2] py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <p className="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              Liturgi
            </p>
            <h1
              className="text-[#1a3b4c] text-4xl lg:text-5xl font-semibold leading-tight mb-4"
              style={{ fontFamily: "Noto Serif, serif", letterSpacing: "-0.02em" }}
            >
              Jadwal Misa
            </h1>
            <p className="text-[#41484b] max-w-xl text-lg leading-relaxed">
              Bergabunglah bersama umat Paroki Santa Melania dalam perayaan Ekaristi. Jadwal dapat
              berubah sesuai kalender liturgi.
            </p>
          </div>
        </section>

        {/* Weekly Schedule */}
        <section className="py-20 bg-[#faf9f8]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <h2
              className="text-[#1a3b4c] text-2xl font-semibold mb-10"
              style={{ fontFamily: "Noto Serif, serif" }}
            >
              Jadwal Mingguan
            </h2>

            <div className="space-y-6">
              {weeklySchedule.map((schedule, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden editorial-shadow">
                  <div className="bg-[#1a3b4c] px-6 py-4">
                    <h3
                      className="text-white font-semibold"
                      style={{ fontFamily: "Noto Serif, serif" }}
                    >
                      {schedule.day}
                    </h3>
                  </div>
                  <div className="divide-y divide-[#f4f3f2]">
                    {schedule.masses.map((mass, j) => (
                      <div
                        key={j}
                        className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-6">
                          <span
                            className="text-[#1a3b4c] text-2xl font-semibold w-16"
                            style={{ fontFamily: "Noto Serif, serif" }}
                          >
                            {mass.time}
                          </span>
                          <span className="text-[#1a1c1c] font-medium">{mass.type}</span>
                        </div>
                        {mass.note && (
                          <span className="text-xs bg-[#fddab2] text-[#735a3a] px-3 py-1 rounded-full font-medium self-start sm:self-auto">
                            {mass.note}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[#71787c] text-sm mt-6 italic">
              * Jadwal dapat berubah sewaktu-waktu sesuai kalender liturgi. Periksa warta jemaat
              untuk perubahan jadwal hari raya.
            </p>
          </div>
        </section>


        {/* Guidelines */}
        <section className="py-20 bg-[#faf9f8]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <h2
              className="text-[#1a3b4c] text-2xl font-semibold mb-10"
              style={{ fontFamily: "Noto Serif, serif" }}
            >
              Persiapan Perayaan Ekaristi
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {guidelines.map((g, i) => (
                <div key={i} className="bg-[#f4f3f2] rounded-2xl p-6">
                  <div className="text-3xl mb-4">{g.icon}</div>
                  <h3
                    className="text-[#1a3b4c] font-semibold mb-2"
                    style={{ fontFamily: "Noto Serif, serif" }}
                  >
                    {g.title}
                  </h3>
                  <p className="text-[#41484b] text-sm leading-relaxed">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#1a3b4c]">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2
              className="text-white text-3xl font-semibold mb-4"
              style={{ fontFamily: "Noto Serif, serif" }}
            >
              Butuh Informasi Lebih Lanjut?
            </h2>
            <p className="text-white/60 mb-8">
              Hubungi sekretariat paroki untuk informasi jadwal khusus, sakramen, atau keperluan
              pastoral lainnya.
            </p>
            <a
              href="https://wa.me/6281321272634"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#1a3b4c] text-sm font-medium rounded-full hover:bg-white/90 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#25d366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Kami
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
