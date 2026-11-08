# Aturan klien API

## Dua pintu, satu aturan
- Browser: `api.get/post/put/delete/upload` dari `src/lib/vowly/client.ts` → `/api/backend/*` (BFF menambahkan
  `Authorization: Bearer` dari cookie). Server component/route handler: `apiServer` / `requireSession` dari
  `src/lib/vowly/server.ts` (`server-only`).
- Jangan `fetch(API_BASE_URL…)` dari komponen klien; `API_BASE_URL` hanya server. Jangan `NEXT_PUBLIC_` untuk rahasia.
- Login/register/logout hanya lewat `/api/session/*` (menyetel/menghapus cookie). `/api/backend` menolak
  `auth/login`, `auth/register`, `admin`, `webhooks` (lihat `proxy-path.ts` dan tesnya).

## Envelope dan galat
- API membalas `{status, code, message, data, meta?}`. `api.*` melempar `ApiError(message, status, fields)`;
  422 membawa `fields` (nama JSON → pesan). `FormModal` menampilkan `fields` di bawah input yang sesuai.
- Pesan API sudah Bahasa Indonesia dan aman ditampilkan. Jangan menampilkan `error.stack` atau galat jaringan mentah.
- 401 di browser mengarahkan ke `/sign-in?next=…` otomatis; 403 pada dashboard berarti belum lunas (kunci);
  404 berarti tidak ada atau bukan milik pengguna — perlakukan sama.

## Data
- Daftar: `useResource(path, {page, limit, search, filter…})`; respons `meta` untuk `Pagination`. `limit` maks 100.
- PUT parsial: kirim hanya field yang diubah. String kosong menghapus field teks/tanggal opsional (kirim `""` saat
  edit, hilangkan saat buat — `optionalText`). UUID nol (`00000000-0000-0000-0000-000000000000`) melepas relasi.
- Uang: `int64` rupiah → `number`. Jangan `parseFloat`; gunakan `parseRupiah`/`money()`.
- Rate limit (429) ditampilkan sebagai pesan API apa adanya; jangan retry otomatis agresif. Polling invoice 5 dtk.
- Tipe di `src/lib/vowly/types.ts` mengikuti kontrak API; perubahan kontrak → skill `sync-api-types`.
