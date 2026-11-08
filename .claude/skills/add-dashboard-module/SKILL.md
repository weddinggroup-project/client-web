---
name: add-dashboard-module
description: Menambah halaman atau modul dashboard baru di client dari endpoint API yang sudah ada. Gunakan saat diminta layar dashboard, daftar CRUD, atau form baru.
---

Argumen: nama modul atau endpoint. Jika kosong, tanya modul mana.

1. **Lingkup.** Cari endpoint di kontrak API (repo API: `docs/api-contract.md`) dan layar di Figma. Bila endpoint belum
   ada, berhenti dan laporkan (jangan meniru di klien). Cek `docs/api-mapping.md` agar tidak duplikat.
2. **Pola.** Baca `src/features/dashboard/budget/budget-view.tsx` (daftar + ringkasan) dan `crud/crud-table.tsx`;
   baca `.claude/rules/api-client.md`, `nextjs.md`, `design.md`.
3. **Bangun:**
   - Tipe di `src/lib/vowly/types.ts` (skill `sync-api-types`).
   - `src/features/dashboard/<modul>/<modul>-view.tsx` (`"use client"`): `DashHeader`, ringkasan `StatCard` bila ada,
     `CrudTable` dengan `columns`, `fields`, `toInitial`, `toPayload` (helper di `crud/payload.ts`).
   - Halaman tipis `src/app/dashboard/[projectId]/<slug>/page.tsx` dengan `metadata`.
   - Tambah item di `src/features/dashboard/nav.ts` bila perlu menu (label dan sub-judul dari Figma).
4. **Aturan data.** PUT parsial; `""` menghapus field opsional saat edit; UUID nol melepas relasi; uang lewat `money()`.
   Opsi relasi (meja, vendor, sesi) dimuat dengan `useResource` `limit: 100`.
5. **Keadaan.** Memuat, kosong, galat, dan 403 ditangani (sudah di `CrudTable`/`ErrorState`); validasi server
   dipetakan ke field.
6. **Tes.** Fungsi murni baru diuji; tambah/ubah spec Playwright bila alur penting.
7. **Verifikasi.** `pnpm lint typecheck test build`. Jalankan agent `code-reviewer`.
8. **Dokumen.** Perbarui `docs/api-mapping.md` dan bagian "Status" di `CLAUDE.md`.
9. **Laporan:** layar Figma, endpoint, tes dan hasil, asumsi. Jangan commit kecuali diminta.
