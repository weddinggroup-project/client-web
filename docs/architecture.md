# Arsitektur client

## Alur sesi (BFF)

```text
Browser ──(JSON, same-origin)──> Next.js ──(Bearer JWT)──> Vowly API (Go)
            /api/session/*          cookie httpOnly           /api/v1/*
            /api/backend/*          vowly_token
```

- **Login/daftar** — form memanggil `POST /api/session/login|register`. Route handler memvalidasi (Zod), memanggil API,
  menyimpan JWT di cookie `vowly_token` (httpOnly, SameSite=Lax, Secure di https, `maxAge` dari klaim `exp`) dan hanya
  mengembalikan profil pengguna. Token tidak pernah dikirim ke JS.
- **Logout** — `POST /api/session/logout` menghapus cookie.
- **Panggilan data dari browser** — `api.*` (`src/lib/vowly/client.ts`) memanggil `/api/backend/<path>`. Route handler
  `src/app/api/backend/[...path]/route.ts` memeriksa path (`proxy-path.ts`) dan Origin, menambahkan `Authorization`,
  meneruskan ke `API_BASE_URL/api/v1/<path>`, dan mengembalikan respons apa adanya (termasuk multipart untuk unggahan).
  `GET /packages` dan `/templates` publik di API tetapi lewat proxy ini hanya untuk pengguna yang sudah masuk.
- **Panggilan dari server** — `apiServer` (`server-only`) membaca cookie dan memanggil API langsung. `requireSession()`
  memeriksa `GET /users/me` (di-cache per request) dan mengarahkan ke `/sign-in?next=` bila tidak sah.
- **Gerbang** — `src/proxy.ts` (pengganti middleware di Next 16) mengalihkan permintaan tanpa cookie untuk
  `/dashboard/*`, `/undangan-digital/pesan/*`, `/kolaborasi/*`. Ini hanya gerbang cepat; keabsahan diperiksa oleh
  `requireSession` dan API.
- **401** di browser → `window.location` ke `/sign-in?next=<path>`.

## Dashboard

`src/app/dashboard/[projectId]/layout.tsx` (server): `requireSession` → `GET /invitations/{id}` (404 → not-found) →
`GET /invitations/{id}/home`. `403` pada Home berarti pesanan belum lunas → halaman "Dashboard belum dibuka" dengan
tautan lanjutkan pembayaran (`/undangan-digital/pesan?project=<id>`). Bila lolos, `ProjectProvider` menyediakan
`project`, `user`, `daysUntil` ke shell (sidebar, header pil hitung mundur, menu pengguna) dan semua modul.

`/dashboard` mengambil daftar proyek: satu proyek → langsung ke dashboard-nya; kosong → ajakan memesan paket.

Setiap modul = satu `*-view.tsx` klien di `src/features/dashboard/<modul>/` + halaman tipis di `src/app/dashboard/[projectId]/<slug>/`.
Daftar memakai `CrudTable<T>` (pencarian, filter, paginasi, modal buat/ubah, hapus dengan konfirmasi, toast) yang
dikonfigurasi lewat `columns`, `fields`, `toInitial`, `toPayload`.

## Wizard pemesanan

`OrderWizard` mengorkestrasi langkah di atas komponen langkah yang sudah ada (UI dari Figma). Panggilan API terjadi
saat berpindah langkah (`advance`): buat proyek + cek subdomain → simpan lokasi (alamat digabung oleh `composeAddress`)
→ undang kolaborator (token ditampilkan sekali) → pilih template → validasi voucher/referral → buat pesanan
(`mandiri_va`) → invoice dengan polling `GET /orders/{id}` tiap 5 detik. Pesanan `pending` yang sudah ada dipakai ulang
(API menolak dua pesanan menunggu). `?project=<id>` melanjutkan proyek yang belum lunas. Pemetaan murni ada di
`wizard-api.ts` (diuji).

## Konfigurasi

`NEXT_PUBLIC_APP_URL` (menentukan flag Secure cookie dan metadata) dan `API_BASE_URL` (hanya server). Lihat `.env.example`.
