# Aturan keamanan klien

- Token JWT hanya di cookie `vowly_token` (httpOnly, SameSite=Lax, Secure di https, masa berlaku = `exp`). Tidak ada
  token di JS, localStorage, URL, log, atau respons JSON ke browser (login hanya mengembalikan profil).
- Proxy `/api/backend` meneruskan token, jadi bukan open relay: segmen path dibatasi regex, panjang maks, daftar blokir,
  dan metode state-changing menolak `Origin` berbeda host. Ubah hanya dengan tes di `vowly.test.ts` dan izin pengguna.
- `safeNext` untuk setiap redirect `?next=`: hanya path dalam situs. Jangan redirect ke URL dari input.
- Token undangan kolaborasi ditampilkan sekali dan tidak disimpan; jangan menaruhnya di URL yang dicatat/analytics.
- Data pribadi tamu/keluarga (nama, WhatsApp, rekening angpao) hanya ditampilkan ke pengguna berizin dan tidak masuk
  log, tes, contoh, atau layanan pihak ketiga. Data uji dikarang (`@example.com`).
- Unggahan: validasi ukuran (8 MB) dan tipe di klien hanya untuk UX; API yang menentukan. Buka berkas lewat URL
  bertanda tangan (`/files/{id}/url`) dengan `noopener,noreferrer`; jangan menyimpan URL itu.
- Jangan `dangerouslySetInnerHTML` untuk data dari API/pengguna. Render sebagai teks.
- Rahasia hanya dari env server; `.env*` selain `.env.example` tidak dibaca atau di-commit.
