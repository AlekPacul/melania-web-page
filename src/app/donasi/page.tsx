import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CopyButton from "@/components/CopyButton";

export const metadata: Metadata = {
  title: "Persembahan & Donasi",
  description:
    "Berikan persembahan kasih untuk Paroki Santa Melania Bandung via QRIS, Bank BCA (7773937771), atau OCBC NISP. Setiap persembahan mendukung pelayanan dan pembangunan paroki.",
  keywords: [
    "donasi gereja Bandung",
    "persembahan Paroki Santa Melania",
    "rekening gereja Bandung",
    "QRIS gereja Bandung",
  ],
  alternates: { canonical: "/donasi" },
  openGraph: {
    title: "Persembahan Kasih — Paroki Santa Melania Bandung",
    description:
      "Berikan persembahan untuk Paroki Santa Melania Bandung via QRIS atau transfer bank.",
    url: "/donasi",
  },
};

const banks = [
  {
    name: "Bank BCA",
    color: "#003f8a",
    abbr: "BCA",
    display: "777 – 393 – 777 – 1",
    copy: "7773937771",
    holder: "PGAK Santa Melania",
  },
  {
    name: "Bank OCBC NISP",
    color: "#e85d00",
    abbr: "OCBC",
    display: "010 – 80000 – 665 – 1",
    copy: "0108000066 51",
    holder: "PGAK Santa Melania",
  },
];

const ppgBank = {
  name: "Bank OCBC NISP",
  color: "#e85d00",
  abbr: "OCBC",
  display: "010 – 8000 – 18755",
  copy: "010800018755",
  holder: "PGAK Santa Melania",
};

export default function Donasi() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Header */}
        <section className="bg-[#f4f3f2] py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <p className="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              Pelayanan
            </p>
            <h1
              className="text-[#1a3b4c] text-4xl lg:text-5xl font-semibold leading-tight mb-4"
              style={{ fontFamily: "Noto Serif, serif", letterSpacing: "-0.02em" }}
            >
              Persembahan Kasih
            </h1>
            <p className="text-[#41484b] max-w-xl text-lg leading-relaxed">
              Setiap persembahan, besar maupun kecil, adalah wujud syukur dan kepercayaan kepada
              karya Tuhan melalui Gereja.
            </p>
          </div>
        </section>

        {/* Scripture */}
        <div className="bg-[#1a3b4c] py-10">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p
              className="text-white/80 italic text-lg leading-relaxed"
              style={{ fontFamily: "Noto Serif, serif" }}
            >
              &ldquo;Hendaklah masing-masing memberikan menurut kerelaan hatinya, jangan dengan
              sedih hati atau karena paksaan, sebab Allah mengasihi orang yang memberi dengan
              sukacita.&rdquo;
            </p>
            <cite className="text-white/40 text-sm mt-3 block not-italic">— 2 Korintus 9:7</cite>
          </div>
        </div>

        {/* Payment Methods */}
        <section className="py-20 bg-[#faf9f8]">
          <div className="max-w-lg mx-auto px-6 space-y-6">

            {/* QRIS */}
            <div className="bg-white rounded-2xl p-8 editorial-shadow text-center">
              <h2
                className="text-[#1a3b4c] text-lg font-semibold mb-6"
                style={{ fontFamily: "Noto Serif, serif" }}
              >
                Scan QRIS
              </h2>
              <img
                src="/assets/qris.png"
                alt="QRIS Paroki Santa Melania"
                className="w-52 mx-auto rounded-xl editorial-shadow"
              />
              <p className="text-[#71787c] text-sm mt-5">Semua bank & e-wallet didukung</p>
              <p className="text-[#735a3a] text-sm font-medium mt-1">a.n. PGAK Santa Melania</p>
            </div>

            {/* Bank Accounts */}
            <div className="bg-white rounded-2xl p-8 editorial-shadow">
              <h2
                className="text-[#1a3b4c] text-lg font-semibold mb-6"
                style={{ fontFamily: "Noto Serif, serif" }}
              >
                Transfer Bank
              </h2>
              <div className="space-y-4">
                {banks.map((bank) => (
                  <div key={bank.copy} className="bg-[#f4f3f2] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: bank.color }}
                      >
                        {bank.abbr}
                      </div>
                      <span className="text-[#1a3b4c] text-sm font-semibold">{bank.name}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[#1a1c1c] font-bold text-xl tracking-wider">
                        {bank.display}
                      </p>
                      <CopyButton value={bank.copy} />
                    </div>
                    <p className="text-[#41484b] text-sm mt-1">a.n. {bank.holder}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* PPG Account */}
            <div className="bg-white rounded-2xl p-8 editorial-shadow">
              <h2
                className="text-[#1a3b4c] text-lg font-semibold mb-2"
                style={{ fontFamily: "Noto Serif, serif" }}
              >
                Rekening PPG
              </h2>
              <p className="text-[#41484b] text-sm mb-5">
                Untuk pembayaran PPG dapat ditransfer melalui:
              </p>
              <div className="bg-[#f4f3f2] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: ppgBank.color }}
                  >
                    {ppgBank.abbr}
                  </div>
                  <span className="text-[#1a3b4c] text-sm font-semibold">{ppgBank.name}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[#1a1c1c] font-bold text-xl tracking-wider">
                    {ppgBank.display}
                  </p>
                  <CopyButton value={ppgBank.copy} />
                </div>
                <p className="text-[#41484b] text-sm mt-1">a.n. {ppgBank.holder}</p>
              </div>
            </div>

            {/* WhatsApp Contact */}
            <div className="bg-[#f4f3f2] rounded-2xl p-6 text-center">
              <p className="text-[#41484b] text-sm mb-4">
                Sudah transfer? Kirim bukti pembayaran ke sekretariat paroki via WhatsApp
              </p>
              <a
                href="https://wa.me/6281321272634"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#25d366] text-white text-sm font-medium rounded-full hover:bg-[#1ebe5d] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Kami
              </a>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
