# Aturan tes

- Vitest untuk logika murni dan komponen tanpa jaringan: tabel-driven (`it.each`), kasus batas dan gagal.
  Letakkan `*.test.ts(x)` di samping berkas. Tes tidak butuh API, jaringan, atau cookie asli.
- Logika yang bisa dipisah dari komponen ditaruh di fungsi murni lalu diuji (`wizard-api.ts`, `nav.ts`, `payload.ts`,
  `format.ts`, `proxy-path.ts`, `session-cookie.ts`).
- Playwright (`tests/e2e`): tes tanpa backend (landing, 404, gerbang sesi) selalu jalan; tes dashboard memakai
  `E2E_EMAIL`, `E2E_PASSWORD`, `E2E_PROJECT_ID` dan **dilewati** bila tidak ada. Data uji dikarang.
  Gunakan `PLAYWRIGHT_BASE_URL` untuk server yang sudah hidup; port 3000 sering dipakai proyek lain.
- Jangan melemahkan tes agar hijau. Tes baru untuk setiap bug yang diperbaiki.
- Sebelum selesai: `pnpm lint typecheck test`; `pnpm build` bila menyentuh routing, server component, atau env.
