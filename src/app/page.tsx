import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Selamat datang di Paroki Katolik Santa Melania Bandung. Melayani umat sejak 1954 di Jl. Melania No.1-3, Cihaur Geulis, Kota Bandung, Jawa Barat.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Paroki Santa Melania Bandung",
    description:
      "Paroki Katolik Santa Melania, Bandung. Melayani umat sejak 1954.",
    url: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  name: "Paroki Katolik Santa Melania",
  alternateName: "PGAK Santa Melania",
  url: "https://melania.katolik.or.id",
  logo: "https://melania.katolik.or.id/assets/logo.jpg",
  image: "https://melania.katolik.or.id/assets/logo.jpg",
  description:
    "Paroki Katolik Santa Melania Bandung, melayani umat sejak 1954 di Jl. Melania No.1-3, Cihaur Geulis, Kota Bandung.",
  foundingDate: "1954",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Melania No.1-3, Cihaur Geulis",
    addressLocality: "Kota Bandung",
    addressRegion: "Jawa Barat",
    postalCode: "40122",
    addressCountry: "ID",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -6.899,
    longitude: 107.625,
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+62-813-2127-2634",
    contactType: "customer service",
    availableLanguage: "Indonesian",
  },
  sameAs: ["https://melania.katolik.or.id"],
};

const ministries = [
  {
    icon: "🕯️",
    tag: "Liturgi Utama",
    title: "Perayaan Ekaristi Kudus",
    desc: "Jadwal Misa harian dan mingguan. Sabtu 17:00, Minggu 06:30 & 09:00, serta Misa Jumat Pertama setiap awal bulan.",
    link: "/jadwal-misa",
    linkLabel: "Lihat Jadwal Misa",
    image: "/assets/hero.jpg",
    external: false,
  },
  {
    icon: "📖",
    tag: "Pembinaan Iman",
    title: "Katekese",
    desc: "Pendalaman iman dan kelas katekumen dewasa untuk mempersiapkan diri menerima sakramen.",
    link: "https://wa.me/6281321272634",
    linkLabel: "Hubungi via WhatsApp",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMdzISg_6uw6iueFTkiEgraKfNRy2qLtA3jiu32WQbUCN0R56dHQsSIrPRwaTOnt66e8VVHNyxnYuvdONCH-zVKny0rIDr1Tc_5TlPboZtlpeqSxZPy0HTi5aQe72VmWYj-4TZ7hzrTfOBhVbCLFwg4tFo-m6JbKfhsCjxLWn383FkIbhlGyZlm-Wfzr7d6CQ3w003WwvTsyPnLSFPms3hGVqHc7J5H_2JZwtgFgVY_vSPMrglkr3XnPOv2nZcArTqDvEdgt8pO2aF",
    external: true,
  },
  {
    icon: "✨",
    tag: "Orang Muda",
    title: "OMK St. Melania",
    desc: "Wadah kreativitas dan pertumbuhan iman orang muda Katolik yang dinamis dan penuh semangat.",
    link: "https://www.instagram.com/omkstmelania/",
    linkLabel: "Ikuti di Instagram",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSVrUEVdcs4vFkBfWbR3xfKB9DLy-HdFEM3qLuvHakdYK3pQwsVwUbL7Ntmvo8tmQ9uNjNpz8qEVt-f4Ay7RbdEkSF-I-GP05kaXzU9aW9lh_DtUFrh0hZlImVE_G4APqZvJudD4wPoMnc_RCqX6AtMsQS3LKDCqfCnOMpo8nT5fbqjFHnxexKN8-p5t4ruZGIum7LwDXUk42KL-vKwmmDIGlP0O_0ZbuF_LsCS5lpPYVANqfZy1ZDpgHzhogIg3vKdFbfXppXTVZG",
    external: true,
  },
];

const reflections = [
  {
    date: "24 MEI 2024",
    datetime: "2024-05-24",
    title: "Menemukan Hening di Tengah Bisingnya Kota",
    excerpt:
      "Dalam setiap tarikan napas, ada kesempatan untuk kembali kepada-Nya. Gereja hadir sebagai ruang pernafasan spiritual di tengah kepenatan dunia.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSVrUEVdcs4vFkBfWbR3xfKB9DLy-HdFEM3qLuvHakdYK3pQwsVwUbL7Ntmvo8tmQ9uNjNpz8qEVt-f4Ay7RbdEkSF-I-GP05kaXzU9aW9lh_DtUFrh0hZlImVE_G4APqZvJudD4wPoMnc_RCqX6AtMsQS3LKDCqfCnOMpo8nT5fbqjFHnxexKN8-p5t4ruZGIum7LwDXUk42KL-vKwmmDIGlP0O_0ZbuF_LsCS5lpPYVANqfZy1ZDpgHzhogIg3vKdFbfXppXTVZG",
  },
  {
    date: "23 MEI",
    datetime: "2024-05-23",
    title: "Kekuatan Dalam Kerendahan Hati",
    excerpt:
      "Kerendahan hati bukan kelemahan, melainkan kekuatan yang tersembunyi di balik kesederhanaan yang tulus.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2lR4kbFlmfP-AqwgwIqS89qGcMZe1b1jbM-4W2TMvnuo7vV9jrTNs_RAJ5SYJciqKiZcrkCZJol3iMLGdCwLgj64z8911MuVViD-pS1CB-BLWIeUBZsBb01xGlJ0tRrR9YPmsK_MBHdCGNItVf6U-WAwX2dPQes3lBsOKNF9vUvRla2jUbesm2IpFf3c3BWZjUdKn3_wObSMducq4Jof4xJze_AguSEXg9rTXjS8PleXQ59QHl8daIWb-AMDeQeUpuWzQj7RK3009",
  },
  {
    date: "22 MEI",
    datetime: "2024-05-22",
    title: "Melayani Dengan Sukacita",
    excerpt:
      "Setiap tindakan kasih adalah doa yang hidup. Pelayanan sejati lahir bukan dari kewajiban, melainkan dari cinta.",
    image: null,
  },
];

const milestones = [
  { year: "1954", desc: "Sekitar 15 umat Katolik di sekitar Gedung Sate mulai berdoa bersama" },
  { year: "1956", desc: "Perayaan Ekaristi pertama di kelas Sekolah Rakyat, Paroki dibawah Katedral St. Petrus" },
  { year: "1978", desc: "Diresmikan sebagai Paroki mandiri oleh Pastor Ignasius Wibisono OSC" },
  { year: "1980", desc: "Gedung gereja saat ini diberkati oleh Uskup Arnts" },
  { year: "2018", desc: "Pastor Bernardus Jumiyana memimpin, membawa berbagai inisiatif pengembangan" },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="pt-16">
        {/* Hero */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/assets/hero.jpg"
              alt="Gereja Katolik Santa Melania Bandung"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Gradient mask — dark on left for text, fades out to right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f8]/95 via-[#faf9f8]/75 to-[#faf9f8]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f8]/60 via-transparent to-transparent" />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.2em] mb-6">
                Paroki Katolik · Bandung
              </p>
              <h1
                className="text-[#1a3b4c] text-4xl lg:text-6xl font-semibold leading-tight tracking-tight mb-6"
                style={{ fontFamily: "Noto Serif, serif", letterSpacing: "-0.02em" }}
              >
                Paroki
                <br />
                <em className="font-normal">Santa Melania</em>
              </h1>
              <p className="text-[#41484b] text-lg leading-relaxed mb-10 max-w-md">
                Melayani umat Bandung sejak 1954. Sebuah rumah iman yang merayakan tradisi
                Katolik melalui persekutuan dan pelayanan yang hidup.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/jadwal-misa"
                  className="px-8 py-3.5 bg-[#1a3b4c] text-white text-sm font-medium rounded-full hover:bg-[#335264] transition-colors"
                >
                  Lihat Jadwal Misa
                </Link>
                <Link
                  href="/donasi"
                  className="px-8 py-3.5 text-[#1a3b4c] text-sm font-medium rounded-full border border-[#1a3b4c]/30 hover:bg-[#1a3b4c]/5 transition-colors"
                >
                  Persembahan
                </Link>
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="hidden lg:block">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 editorial-shadow">
                <h3
                  className="text-[#1a3b4c] font-semibold mb-6"
                  style={{ fontFamily: "Noto Serif, serif" }}
                >
                  Jadwal Misa Minggu Ini
                </h3>
                <div className="space-y-4">
                  {[
                    { day: "Jumat*", time: "17:00", type: "Jumat Pertama" },
                    { day: "Sabtu", time: "17:00", type: "Misa Sabtu Sore" },
                    { day: "Minggu", time: "06:30", type: "Misa Pagi I" },
                    { day: "Minggu", time: "09:00", type: "Misa Pagi II" },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#41484b] w-12">{m.day}</span>
                        <span
                          className="text-[#1a3b4c] font-semibold text-lg"
                          style={{ fontFamily: "Noto Serif, serif" }}
                        >
                          {m.time}
                        </span>
                      </div>
                      <span className="text-xs text-[#735a3a] font-medium">{m.type}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[#71787c] text-xs mt-4">* Jumat pertama setiap awal bulan</p>
                <Link
                  href="/jadwal-misa"
                  className="mt-3 block text-center text-sm text-[#1a3b4c] font-medium hover:underline"
                >
                  Jadwal lengkap →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="bg-[#f4f3f2] py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-start">
            <div className="relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSVrUEVdcs4vFkBfWbR3xfKB9DLy-HdFEM3qLuvHakdYK3pQwsVwUbL7Ntmvo8tmQ9uNjNpz8qEVt-f4Ay7RbdEkSF-I-GP05kaXzU9aW9lh_DtUFrh0hZlImVE_G4APqZvJudD4wPoMnc_RCqX6AtMsQS3LKDCqfCnOMpo8nT5fbqjFHnxexKN8-p5t4ruZGIum7LwDXUk42KL-vKwmmDIGlP0O_0ZbuF_LsCS5lpPYVANqfZy1ZDpgHzhogIg3vKdFbfXppXTVZG"
                alt="Altar Gereja"
                className="w-full h-72 lg:h-96 object-cover rounded-2xl"
              />

              {/* Timeline */}
              <div className="mt-8 space-y-4">
                {milestones.map((m, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-[#735a3a] mt-1.5 flex-shrink-0" />
                      {i < milestones.length - 1 && (
                        <div className="w-px flex-1 bg-[#c1c7cc] mt-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <span
                        className="text-[#1a3b4c] text-sm font-semibold"
                        style={{ fontFamily: "Noto Serif, serif" }}
                      >
                        {m.year}
                      </span>
                      <p className="text-[#41484b] text-sm leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:pt-4">
              <p className="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                Sejarah Paroki
              </p>
              <h2
                className="text-[#1a3b4c] text-3xl lg:text-4xl font-semibold leading-tight mb-6"
                style={{ fontFamily: "Noto Serif, serif", letterSpacing: "-0.02em" }}
              >
                Tujuh Dekade
                <br />
                Melayani Umat Bandung
              </h2>
              <p className="text-[#41484b] leading-relaxed mb-5">
                Paroki Santa Melania berakar dari sekitar 15 umat Katolik di sekitar Gedung Sate
                yang mulai berdoa bersama di sebuah ruang kelas SPG Citarum pada tahun 1954.
                Perkembangan paroki tak terlepas dari keberadaan Yayasan St. Melania yang berdiri
                sejak 1930.
              </p>
              <p className="text-[#41484b] leading-relaxed mb-5">
                Pada tahun 1956, perayaan Ekaristi pertama diselenggarakan di kelas Sekolah Rakyat.
                Doa Rosario dan Legio Maria menjadi kekuatan penggerak utama. Pertumbuhan jemaat
                yang pesat menjadikan stasi ini diakui resmi sebagai &ldquo;Stasi St. Melania&rdquo;
                di bawah Paroki Katedral St. Petrus.
              </p>

              <blockquote className="border-l-4 border-[#735a3a] pl-5 my-8">
                <p
                  className="text-[#1a3b4c] text-lg italic leading-relaxed"
                  style={{ fontFamily: "Noto Serif, serif" }}
                >
                  &ldquo;Di mana dua atau tiga orang berkumpul dalam nama-Ku, di situ Aku ada di
                  tengah-tengah mereka.&rdquo;
                </p>
                <cite className="text-[#41484b] text-sm mt-2 block not-italic">— Matius 18:20</cite>
              </blockquote>

              <p className="text-[#41484b] leading-relaxed">
                Pada tahun 1978, di bawah kepemimpinan Pastor Ignasius Wibisono OSC, stasi ini
                resmi ditingkatkan menjadi paroki mandiri. Gedung gereja yang ada saat ini diberkati
                oleh Uskup Arnts pada tahun 1980, dan terus menjadi pusat iman bagi umat Bandung
                hingga hari ini.
              </p>
            </div>
          </div>
        </section>

        {/* Ministries */}
        <section className="py-24 bg-[#faf9f8]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-14">
              <div>
                <p className="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
                  Kehidupan Paroki
                </p>
                <h2
                  className="text-[#1a3b4c] text-3xl lg:text-4xl font-semibold"
                  style={{ fontFamily: "Noto Serif, serif", letterSpacing: "-0.02em" }}
                >
                  Eksplorasi Pelayanan
                </h2>
              </div>
              <a href="#" className="text-sm text-[#1a3b4c] font-medium hover:underline">
                Lihat Semua Pelayanan →
              </a>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ministries.map((m, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden editorial-shadow hover:ambient-shadow transition-shadow group"
                >
                  <div className="h-44 overflow-hidden">
                    <img
                      src={m.image}
                      alt={m.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-xs text-[#735a3a] font-semibold uppercase tracking-wider">
                      {m.tag}
                    </span>
                    <h3
                      className="text-[#1a3b4c] font-semibold mt-1 mb-2"
                      style={{ fontFamily: "Noto Serif, serif" }}
                    >
                      {m.title}
                    </h3>
                    <p className="text-[#41484b] text-sm leading-relaxed mb-4">{m.desc}</p>
                    {m.external ? (
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#1a3b4c] font-medium hover:underline"
                      >
                        {m.linkLabel} →
                      </a>
                    ) : (
                      <Link href={m.link} className="text-sm text-[#1a3b4c] font-medium hover:underline">
                        {m.linkLabel} →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Scripture Block */}
        <section className="bg-[#1a3b4c] py-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="w-8 h-1 bg-[#735a3a] mx-auto mb-8 rounded-full" />
            <blockquote
              className="text-white text-2xl lg:text-3xl font-normal leading-relaxed italic"
              style={{ fontFamily: "Noto Serif, serif" }}
            >
              &ldquo;Datanglah kepada-Ku, semua yang lelah dan berbeban berat, Aku akan memberi
              kelegaan kepadamu.&rdquo;
            </blockquote>
            <cite className="text-white/50 text-sm mt-6 block not-italic">— Matius 11:28</cite>
          </div>
        </section>

        {/* Daily Reflections */}
        <section className="py-24 bg-[#f4f3f2]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-14">
              <div>
                <p className="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
                  Bacaan & Renungan
                </p>
                <h2
                  className="text-[#1a3b4c] text-3xl lg:text-4xl font-semibold"
                  style={{ fontFamily: "Noto Serif, serif", letterSpacing: "-0.02em" }}
                >
                  Refleksi Harian
                </h2>
              </div>
              <a href="#" className="text-sm text-[#1a3b4c] font-medium hover:underline">
                Semua Refleksi →
              </a>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {reflections.map((r, i) => (
                <article key={i} className="bg-white rounded-2xl overflow-hidden editorial-shadow">
                  {r.image && (
                    <div className="h-48 overflow-hidden">
                      <img src={r.image} alt={r.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6">
                    <time
                      dateTime={r.datetime}
                      className="text-xs text-[#735a3a] font-semibold uppercase tracking-wider"
                    >
                      {r.date}
                    </time>
                    <h3
                      className="text-[#1a3b4c] font-semibold mt-2 mb-3 leading-snug"
                      style={{ fontFamily: "Noto Serif, serif" }}
                    >
                      {r.title}
                    </h3>
                    <p className="text-[#41484b] text-sm leading-relaxed">{r.excerpt}</p>
                    <a
                      href="#"
                      className="mt-4 inline-block text-sm text-[#1a3b4c] font-medium hover:underline"
                    >
                      Baca Selengkapnya →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Location / Map */}
        <section className="py-24 bg-[#faf9f8]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                  Kunjungi Kami
                </p>
                <h2
                  className="text-[#1a3b4c] text-3xl lg:text-4xl font-semibold mb-6"
                  style={{ fontFamily: "Noto Serif, serif", letterSpacing: "-0.02em" }}
                >
                  Lokasi Gereja
                </h2>
                <div className="bg-[#f4f3f2] rounded-2xl p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#1a3b4c]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-lg">📍</span>
                    </div>
                    <div>
                      <h3
                        className="text-[#1a3b4c] font-semibold mb-1"
                        style={{ fontFamily: "Noto Serif, serif" }}
                      >
                        Paroki Santa Melania
                      </h3>
                      <address className="not-italic text-[#41484b] text-sm leading-relaxed">
                        Jl. Melania No.1-3<br />
                        Cihaur Geulis, Kec. Cibeunying Kaler<br />
                        Kota Bandung, Jawa Barat 40122
                      </address>
                    </div>
                  </div>
                </div>
                <a
                  href="https://maps.app.goo.gl/tCd5SKadPSv4bLAS8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a3b4c] text-white text-sm font-medium rounded-full hover:bg-[#335264] transition-colors"
                >
                  <span>🗺️</span>
                  Buka di Google Maps
                </a>
              </div>

              {/* Map Embed */}
              <div className="rounded-2xl overflow-hidden editorial-shadow h-80 lg:h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8!2d107.625!3d-6.899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6f3b9e9e9e9%3A0x0!2sJl.+Melania+No.1-3%2C+Cihaur+Geulis%2C+Kec.+Cibeunying+Kaler%2C+Kota+Bandung%2C+Jawa+Barat+40122!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Gereja Katolik Santa Melania"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
