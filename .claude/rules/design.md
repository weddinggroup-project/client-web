# Aturan desain

Sumber kebenaran tampilan: Figma "Mockup Vowly" (file `DocQJcmXJBrQw8u561gbp8`): Landing (node 0:1), Dashboard user
(5291:255), Dashboard Revisi (5351:2). Ringkasan token di `docs/design-system.md`.

- Warna hanya dari token Tailwind di `src/app/globals.css` (`primary`, `blush`, `gold`, `cream`, `ink`, `ink-soft`, …).
  Jangan menulis hex baru di komponen; tambah token di `globals.css` bila Figma memang punya warna baru.
- Font: Inter (UI landing), Playfair Display (judul, `font-serif`), DM Sans (dashboard, `font-dash`).
- Kit dashboard di `src/components/dash/`: `Panel`, `DashHeader`, `SectionTitle`, `StatCard`, `Badge`, `ProgressBar`,
  `btn.*`, `Modal`, `FormModal`, `EmptyState/ErrorState/LoadingBlock`, `Pagination`, `useFeedback`. Pakai ulang;
  buat komponen baru hanya bila kit tidak cukup.
- Setiap daftar punya tiga keadaan: memuat, kosong (dengan ajakan), galat (dengan "Coba lagi"). 403 = "belum dibuka".
- Responsif: sidebar menjadi laci di bawah `lg`; tabel digulir horizontal. Uji lebar 375px.
- Fitur yang tidak ada di API tidak digambar sebagai fungsional (mis. lonceng notifikasi): hilangkan atau beri keterangan.
