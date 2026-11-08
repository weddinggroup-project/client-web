# Design system (dari Figma "Mockup Vowly")

Sumber: file `DocQJcmXJBrQw8u561gbp8` — Landing Page (node 0:1), Dashboard user (5291:255), Dashboard Revisi (5351:2).
Token di `src/app/globals.css` (Tailwind 4 `@theme`).

## Font

| Peran | Font | Kelas |
| --- | --- | --- |
| UI umum / landing | Inter | `font-sans` |
| Judul | Playfair Display | `font-serif` |
| Dashboard | DM Sans | `font-dash` |

## Warna

| Token | Hex | Pakai |
| --- | --- | --- |
| `primary` | `#6b3f45` | tombol utama landing/wizard, tautan |
| `accent` | `#a97078` | logo, aksen |
| `secondary` / `blush` | `#f6e4e8` / `#f4c2c2` | permukaan lembut, item sidebar aktif, tombol utama dashboard |
| `blush-foreground` | `#734e4e` | teks di atas blush |
| `gold` / `gold-foreground` | `#e8e0ba` / `#635f40` | garis/hover, lencana, border kiri item aktif |
| `cream` | `#faf6ee` | latar dashboard |
| `ink` / `ink-soft` | `#1c1c18` / `#504444` | teks utama / sekunder |
| `muted`, `border`, `card-border` | `#f3ede1`, `#e9e1d3`, `#ece4d6` | permukaan netral dan garis |
| `success`, `warning`, `error` | `#16a34a`, `#d97706`, `#dc2626` | status |

## Dashboard

- Sidebar 260px (putih, border `gold/40`): brand "Vowly" serif; bagian MAIN MENU, ASSISTANT, ACCOUNT; item = ikon + judul
  + sub-judul; aktif = `blush` + border kiri 4px `gold-foreground`.
- Header 64px: pil `Judul • N Hari Menuju Akad & Resepsi` (border `gold`, latar `blush/30`) dan menu pengguna.
- Konten maks 1100px; kartu `rounded-2xl border-gold/50 bg-white`; judul halaman serif 32px dengan eyebrow lencana gold.
- Tombol: `btn.primary` (blush), `btn.solid` (primary), `btn.secondary` (outline gold), `btn.danger`, `btn.icon`.
- Lencana status: `Badge` tone `neutral|gold|blush|success|warning|danger`.

## Tidak diimplementasikan dari Figma

Lonceng notifikasi, alur Mitra, dan komponen yang tidak punya endpoint API (lihat `api-mapping.md`).
