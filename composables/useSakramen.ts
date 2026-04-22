export interface Sacrament {
  slug: string
  title: string
  subtitle: string
  icon: string
  colorBar: string
  colorIcon: string
  colorBadge: string
  description: string
  requirements: { label: string; items: string[] }[]
  process: string[]
  contact: string
  note?: string
}

const SAKRAMEN: Sacrament[] = [
  {
    slug: 'baptis',
    title: 'Baptis',
    subtitle: 'Sakramen Inisiasi Pertama',
    icon: 'i-lucide-droplets',
    colorBar: 'bg-sky-500',
    colorIcon: 'text-sky-600',
    colorBadge: 'bg-sky-50 text-sky-700',
    description:
      'Baptis adalah pintu masuk ke dalam Gereja Katolik dan awal kehidupan iman Kristiani. Melalui air dan Roh Kudus, seseorang dilahirkan kembali sebagai anak Allah dan anggota Tubuh Kristus.',
    requirements: [
      {
        label: 'Bayi / Anak',
        items: [
          'Fotokopi Akta Kelahiran anak',
          'Fotokopi KTP kedua orang tua',
          'Fotokopi Surat Nikah Gereja (Katolik)',
          'Formulir pendaftaran dari sekretariat paroki',
          'Minimal satu orang tua adalah Katolik aktif',
        ],
      },
      {
        label: 'Dewasa (RCIA)',
        items: [
          'Mengikuti program RCIA (Rite of Christian Initiation of Adults)',
          'Fotokopi KTP',
          'Surat persetujuan dari keluarga (bila diperlukan)',
          'Wawancara dengan pastor paroki',
        ],
      },
    ],
    process: [
      'Hubungi sekretariat paroki untuk mendaftar',
      'Mengisi formulir pendaftaran dan melengkapi dokumen',
      'Mengikuti bimbingan pra-baptis (2–3 pertemuan)',
      'Penetapan tanggal baptis oleh pastor',
      'Penerimaan Sakramen Baptis pada Misa yang dijadwalkan',
    ],
    contact: 'Sekretariat Paroki — Senin s/d Jumat, 08.00–16.00',
  },
  {
    slug: 'ekaristi',
    title: 'Komuni Pertama',
    subtitle: 'Sakramen Ekaristi',
    icon: 'i-lucide-wheat',
    colorBar: 'bg-amber-500',
    colorIcon: 'text-amber-600',
    colorBadge: 'bg-amber-50 text-amber-700',
    description:
      'Ekaristi adalah pusat dan puncak kehidupan Kristiani. Komuni Pertama merupakan momen seorang anak menyambut Tubuh dan Darah Kristus untuk pertama kalinya, setelah menyelesaikan persiapan katekese.',
    requirements: [
      {
        label: 'Persyaratan',
        items: [
          'Sudah menerima Sakramen Baptis',
          'Berusia minimal 7–8 tahun (kelas 2 SD)',
          'Sudah menerima Sakramen Tobat (Pengakuan Dosa) pertama',
          'Mengikuti program Bina Iman Anak (BIA) atau katekese paroki',
          'Fotokopi Surat Baptis',
          'Pas foto terbaru 3×4 (2 lembar)',
        ],
      },
    ],
    process: [
      'Mendaftarkan anak ke program katekese paroki',
      'Mengikuti seluruh sesi bimbingan katekese (±6 bulan)',
      'Penerimaan Sakramen Tobat pertama',
      'Retret atau rekoleksi pra-Komuni Pertama',
      'Perayaan Misa Komuni Pertama bersama',
    ],
    contact: 'Koordinator Katekese Paroki — sekretariat atau melalui WhatsApp paroki',
  },
  {
    slug: 'krisma',
    title: 'Krisma',
    subtitle: 'Sakramen Penguatan',
    icon: 'i-lucide-flame',
    colorBar: 'bg-orange-500',
    colorIcon: 'text-orange-600',
    colorBadge: 'bg-orange-50 text-orange-700',
    description:
      'Krisma menyempurnakan rahmat Baptis dan memperkuat penerima dengan karunia Roh Kudus. Sakramen ini meneguhkan iman dan mempersiapkan orang beriman untuk menjadi saksi Kristus yang dewasa.',
    requirements: [
      {
        label: 'Persyaratan',
        items: [
          'Sudah menerima Sakramen Baptis dan Komuni Pertama',
          'Berusia minimal 14 tahun atau sesuai ketentuan keuskupan',
          'Mengikuti program Krisma yang diselenggarakan paroki (±1 tahun)',
          'Fotokopi Surat Baptis dan Surat Komuni Pertama',
          'Memiliki wali Krisma (sponsor) yang Katolik aktif',
          'Pas foto terbaru 3×4 (2 lembar)',
        ],
      },
    ],
    process: [
      'Mendaftar ke sekretariat pada periode pendaftaran Krisma',
      'Mengikuti seluruh program pembinaan iman (katekese Krisma)',
      'Wawancara dengan pastor paroki',
      'Retret atau rekoleksi pra-Krisma',
      'Penerimaan Sakramen Krisma dari Uskup',
    ],
    contact: 'Sekretariat Paroki — informasi jadwal program Krisma tahunan',
    note: 'Jadwal program Krisma biasanya diumumkan pada awal tahun. Pantau papan pengumuman dan media sosial paroki.',
  },
  {
    slug: 'pernikahan',
    title: 'Pernikahan',
    subtitle: 'Sakramen Perkawinan',
    icon: 'i-lucide-heart',
    colorBar: 'bg-rose-500',
    colorIcon: 'text-rose-600',
    colorBadge: 'bg-rose-50 text-rose-700',
    description:
      'Perkawinan Katolik adalah perjanjian antara seorang pria dan wanita yang diberkati Allah, mencerminkan kasih Kristus kepada Gereja. Persiapan yang matang diperlukan agar pasangan siap menjalani kehidupan pernikahan Kristiani.',
    requirements: [
      {
        label: 'Dokumen yang Diperlukan',
        items: [
          'Surat Baptis asli terbaru (max. 6 bulan, dari paroki tempat dibaptis)',
          'Fotokopi KTP kedua calon mempelai',
          'Fotokopi Kartu Keluarga',
          'Surat Keterangan Belum Menikah dari Kelurahan',
          'Surat Pengantar dari paroki asal (bila beda paroki)',
          'Akte kelahiran (fotokopi)',
          'Pas foto berdampingan 4×6 (2 lembar)',
        ],
      },
      {
        label: 'Untuk Pernikahan Beda Agama / Beda Gereja',
        items: [
          'Diperlukan izin khusus dari Uskup (Dispensasi)',
          'Konsultasi terlebih dahulu dengan pastor paroki',
        ],
      },
    ],
    process: [
      'Datang ke sekretariat minimal 6 bulan sebelum rencana pernikahan',
      'Wawancara awal dengan pastor paroki',
      'Melengkapi seluruh dokumen yang dipersyaratkan',
      'Mengikuti Kursus Persiapan Perkawinan (KPP) — wajib',
      'Pengumuman nikah (3 Minggu berturut-turut)',
      'Perayaan Misa Perkawinan sesuai jadwal yang ditetapkan',
    ],
    contact: 'Sekretariat Paroki — mohon datang langsung untuk konsultasi awal',
    note: 'Proses administrasi memerlukan waktu minimal 3–6 bulan. Hubungi paroki sesegera mungkin setelah merencanakan pernikahan.',
  },
  {
    slug: 'pengakuan',
    title: 'Pengakuan Dosa',
    subtitle: 'Sakramen Rekonsiliasi',
    icon: 'i-lucide-handshake',
    colorBar: 'bg-emerald-500',
    colorIcon: 'text-emerald-600',
    colorBadge: 'bg-emerald-50 text-emerald-700',
    description:
      'Sakramen Tobat atau Rekonsiliasi adalah sarana rahmat Allah untuk menyembuhkan luka dosa dan memulihkan persekutuan dengan Allah dan Gereja. Melalui pengakuan yang tulus, dosa diampuni oleh Allah melalui imam.',
    requirements: [
      {
        label: 'Persiapan',
        items: [
          'Sudah menerima Sakramen Baptis',
          'Melakukan pemeriksaan batin (examen conscientiae)',
          'Menyesali dosa dengan sungguh-sungguh',
          'Bertekad untuk tidak mengulangi dosa',
        ],
      },
    ],
    process: [
      'Datang ke gereja pada jam pengakuan yang tersedia',
      'Menunggu giliran dengan tenang dan berdoa',
      'Mengakui dosa kepada imam dengan jujur',
      'Menerima absolusi dan penitensi dari imam',
      'Melaksanakan penitensi yang diberikan',
    ],
    contact: 'Jadwal pengakuan dosa tersedia setiap Sabtu sore dan sebelum Misa tertentu',
    note: 'Hubungi sekretariat atau langsung tanyakan kepada imam bila memerlukan jadwal khusus di luar jam reguler.',
  },
  {
    slug: 'pengurapan',
    title: 'Pengurapan Orang Sakit',
    subtitle: 'Sakramen Penyembuhan',
    icon: 'i-lucide-activity',
    colorBar: 'bg-violet-500',
    colorIcon: 'text-violet-600',
    colorBadge: 'bg-violet-50 text-violet-700',
    description:
      'Pengurapan Orang Sakit memberikan rahmat kekuatan, kedamaian, dan keberanian kepada orang yang menderita sakit berat atau menghadapi kematian. Sakramen ini bukan hanya untuk orang sekarat, tetapi bagi siapa pun yang sakit serius.',
    requirements: [
      {
        label: 'Siapa yang Dapat Menerimanya',
        items: [
          'Umat Katolik yang menderita sakit serius atau kronis',
          'Lansia yang mulai lemah karena usia',
          'Pasien sebelum menjalani operasi besar',
          'Orang yang menghadapi sakaratul maut',
        ],
      },
    ],
    process: [
      'Hubungi pastor paroki atau sekretariat segera setelah ada keperluan',
      'Pastor akan mengunjungi orang sakit di rumah atau rumah sakit',
      'Penerimaan Sakramen dapat disertai Pengakuan Dosa dan Komuni',
      'Untuk keperluan mendesak (kondisi kritis), hubungi nomor darurat paroki',
    ],
    contact: 'Sekretariat Paroki — tersedia 24 jam untuk kondisi darurat',
    note: 'Jangan menunggu terlalu lama. Hubungi paroki sesegera mungkin ketika ada anggota keluarga yang sakit serius.',
  },
]

export function useSakramen() {
  function getAll(): Sacrament[] {
    return SAKRAMEN
  }

  function getBySlug(slug: string): Sacrament | undefined {
    return SAKRAMEN.find(s => s.slug === slug)
  }

  return { getAll, getBySlug }
}
