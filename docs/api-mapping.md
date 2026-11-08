# Pemetaan layar ↔ endpoint API

Path di bawah `/api/v1`. `{id}` = proyek (undangan). Dashboard terkunci (403) sampai pesanan lunas.

| Layar (rute) | Komponen | Endpoint | Catatan |
| --- | --- | --- | --- |
| Masuk / Daftar | `features/auth/*` | `POST /auth/login`, `/auth/register` (via `/api/session/*`) | Lupa password: API belum ada, UI menyatakan itu |
| Daftar proyek `/dashboard` | `app/dashboard/page.tsx` | `GET /invitations` | 1 proyek → redirect |
| Layout proyek | `[projectId]/layout.tsx` | `GET /invitations/{id}`, `GET /invitations/{id}/home` | 403 = belum lunas |
| Home `/dashboard/{id}` | `home/home-view.tsx` | `GET /home`, `GET /guests` (hitung per `rsvp_status`), `GET /checklist-items` (total dan `status=selesai`), `GET /vendors?relationship_status=terkunci` | semua angka dari API; moodboard Figma tidak ada di API |
| Persiapan `/persiapan` | `persiapan/persiapan-view.tsx` | `/sessions` CRUD, `GET /sessions-summary`, `/emergency-contacts` CRUD, `GET /vendors` | `start/end_time` `HH:MM`; `vendor_ids` mengganti relasi |
| Budget `/budget` | `budget/budget-view.tsx` | `/budget-items` CRUD, `GET /budget-summary` | total anggaran diatur di Profile |
| Guest List `/tamu` | `guests/guests-view.tsx` | `/guests` CRUD, `/tables` CRUD, `GET /sessions` | meja kosong saat edit = UUID nol; `over_capacity` hanya peringatan |
| Checklist `/checklist` | `checklist/checklist-view.tsx` | `/checklist-items` CRUD | `cost_amount > 0` membuat pos anggaran otomatis |
| Dokumen `/dokumen` | `dokumen/dokumen-view.tsx` | `POST /files` (multipart), `GET /files/{fid}/url`, `/documents` CRUD, `GET /documents-summary` | tidak ada daftar berkas; hanya yang diunggah di sesi halaman dapat dipilih; "Pertahankan berkas saat ini" mencegah terlepas |
| Vendor `/vendor` | `vendors/vendors-view.tsx` | `/vendors` CRUD, `GET /vendor-curation` | `category` wajib |
| Undangan `/undangan` | `undangan/undangan-view.tsx` | `GET /templates`, `PUT /invitations/{id}` (`template_id`), `GET /guests`, `GET /deliveries`, `POST /deliveries/send`, `/collaborators` (+`/token`) | kirim butuh template; pemilik-only untuk kolaborator dan template |
| AI Assistant `/ai-agent` | `ai/ai-view.tsx` | `/ai/conversations` (+`/messages`, `/actions/{aid}/confirm|reject`) | tindakan hanya terkirim setelah konfirmasi; simulasi |
| Profile `/profil` | `profil/profil-view.tsx` | `PUT /invitations/{id}`, `/couple-members` CRUD, `/gift-accounts` CRUD, `POST /auth/change-password` | peran mempelai hanya dikirim saat buat |
| Landing harga `/` | `landing/pricing/pricing-section.tsx` | `GET /packages` (publik, server-side) | harga terendah paket aktif; tanpa API tampil "Lihat paket" |
| Wizard `/undangan-digital/pesan` | `wizard/order-wizard.tsx` | `GET /packages`, `/templates`, `GET /invitations/subdomain-check`, `POST /invitations`, `PUT /invitations/{id}`, `POST /collaborators`, `POST /vouchers/validate`, `GET/POST /orders`, `GET /invitations/{id}/orders`, `GET /orders/{id}` | hanya `mandiri_va`; metode lain tampil nonaktif; paket/template/harga dari API |
| Terima kolaborasi `/kolaborasi/terima` | `collaboration/accept-form.tsx` | `POST /collaborations/accept` | email akun harus sama dengan email undangan; gagal selalu 404 |

## Area admin (`/admin`)

| Layar | Komponen | Endpoint (via `/api/admin`) |
| --- | --- | --- |
| Ringkasan | `admin/admin-views.tsx` `AdminOverview` | `GET /users`, `/packages`, `/templates`, `/vouchers` (hanya `meta.total`) |
| Pengguna | `UsersAdmin` | `/users` CRUD; password wajib saat buat, kosong saat ubah = tidak diganti |
| Paket | `PackagesAdmin` | `/packages` CRUD; fitur satu per baris |
| Template | `TemplatesAdmin` | `/templates` CRUD |
| Voucher | `VouchersAdmin` | `/vouchers` CRUD; tanggal dikirim sebagai RFC 3339 UTC; menghapus yang sudah dipakai ditolak API (400) |

Admin tidak punya endpoint daftar pesanan/pendapatan di API, jadi ringkasan hanya menampilkan jumlah data.

## Pemetaan akses wizard → modul API

| Label Figma | Modul API (izin) |
| --- | --- |
| Administrasi | `documents` write, `profile` write |
| Manajemen Vendor | `vendors` write, `sessions` read |
| Sourvenir & Barang | `checklist` write |
| Budget & Anggaran | `budget` write |
| Tamu Undangan | `guests` write, `deliveries` write |
| To-do List Ibu/Ayah | `checklist` write |

Peran: "Pasangan" → `pasangan`; "Partner" → `panitia_vendor`. Tanpa akses dipilih, bawaan peran berlaku.
Pemetaan ini **(asumsi)** sampai pemilik produk mengonfirmasi (PRD Q-series).

## Belum didukung API (sengaja tidak diimplementasikan)

Alur Mitra/partner, notifikasi, lupa password, daftar berkas, verifikasi email, metode bayar selain Mandiri VA.

## Catatan tampilan yang dihitung di client dari data API

Kartu ringkasan Budget (persentase), grafik alokasi per kategori (`groupByCategory` dari `/budget-items`), statistik Guest List
(`rsvpTotals` dari `/guests`, akurat hanya bila total tamu <= 100 karena `limit` maks 100), kelompok fase Checklist
(`groupByPhase`) dan Persiapan (`groupSessions`), kelengkapan profil (`profileCompleteness`). Angka resmi (harga, total
pesanan, ringkasan anggaran) tetap dari API.
