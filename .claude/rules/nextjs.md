# Aturan Next.js / React

- App Router; server component default. `"use client"` hanya untuk komponen yang butuh state, efek, atau event.
- Halaman di `src/app` tipis: `requireSession`, ambil data awal bila perlu, render view dari `src/features/*`.
- Rute terlindungi: `src/proxy.ts` (matcher) hanya gerbang cepat; **keabsahan sesi diperiksa** di layout/halaman
  server (`requireSession`) dan oleh API. Rute terlindungi baru → tambahkan ke matcher *dan* panggil `requireSession`.
- Parameter `params`/`searchParams` adalah Promise (Next 16): `await`. Validasi UUID/format sebelum dipakai.
- Tidak ada `setState` sinkron di `useEffect` (lint `react-hooks/set-state-in-effect`); turunkan state dari data
  atau set di callback async. Hindari `eslint-disable` baru.
- Aksesibilitas: label terhubung ke input, `role="alert"` untuk galat, `aria-current="page"` di navigasi aktif,
  tombol ikon punya `aria-label`, modal menutup dengan Esc dan memerangkap fokus (komponen `Modal`).
- Ikon: `react-icons/hi2` (impor tertarget). Jangan menambah pustaka UI/ikon baru tanpa izin.
- Impor memakai alias `@/…`; tidak ada impor lintas fitur ke dalam folder fitur lain kecuali lewat `components/` atau `lib/`.
