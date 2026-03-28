import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const BASE_URL = "https://melania.katolik.or.id";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Paroki Santa Melania Bandung",
    template: "%s | Paroki Santa Melania Bandung",
  },
  description:
    "Paroki Katolik Santa Melania, Bandung. Melayani umat sejak 1954 di Jl. Melania No.1-3, Cihaur Geulis, Kota Bandung. Jadwal Misa, Donasi, dan informasi paroki.",
  keywords: [
    "Paroki Santa Melania",
    "Gereja Katolik Bandung",
    "Jadwal Misa Bandung",
    "Gereja Cibeunying Kaler",
    "Katolik Bandung",
    "Santa Melania Bandung",
    "Misa Bandung",
    "PGAK Santa Melania",
  ],
  authors: [{ name: "Paroki Santa Melania Bandung" }],
  creator: "Paroki Santa Melania Bandung",
  publisher: "Paroki Santa Melania Bandung",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: BASE_URL,
    siteName: "Paroki Santa Melania Bandung",
    title: "Paroki Santa Melania Bandung",
    description:
      "Paroki Katolik Santa Melania, Bandung. Melayani umat sejak 1954. Jadwal Misa, informasi paroki, dan persembahan.",
    images: [
      {
        url: "/assets/logo.jpg",
        width: 800,
        height: 800,
        alt: "Logo Paroki Santa Melania Bandung",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Paroki Santa Melania Bandung",
    description:
      "Paroki Katolik Santa Melania, Bandung. Melayani umat sejak 1954.",
    images: ["/assets/logo.jpg"],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-full flex flex-col pb-16 md:pb-0">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
