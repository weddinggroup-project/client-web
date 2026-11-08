# Vowly — Wedding Planner Platform

Vowly membantu calon pengantin merencanakan pernikahan yang lebih terarah,
hemat waktu, dan minim stres — mulai dari vendor, budget, undangan digital,
hingga tamu undangan, semua dalam satu tempat.

Repository ini adalah **frontend client** Vowly: landing page, pusat bantuan,
halaman produk "Undangan Digital" beserta wizard pemesanannya, alur
autentikasi, dan dashboard Wedding Planner (Home, Persiapan, Budget, Guest List,
Checklist, Dokumen, Vendor, Undangan, AI Assistant, Profile) yang memakai Vowly API.

## Stack

- Next.js 16 App Router dan React 19
- TypeScript strict
- Tailwind CSS 4 dengan design token custom (lihat `src/app/globals.css`)
- Server Components sebagai default
- Autentikasi lewat Vowly API (JWT di cookie httpOnly, pola BFF; lihat `docs/architecture.md`)
- Routing satu bahasa tanpa locale prefix
- Typed API client dan standard API response
- Zod validation dan normalized errors
- Structured global logger
- React Select dan React Day Picker (dipakai ulang dengan tema Vowly di wizard)
- React Icons dengan targeted imports
- Vitest, Testing Library, dan Playwright
- ESLint, Husky, lint-staged, dan GitHub Actions
- Docker standalone multi-stage + Jenkins pipeline (`Jenkinsfile`)

## Menjalankan project

```bash
pnpm install
cp .env.example .env.local   # isi API_BASE_URL (default http://localhost:4000)
pnpm dev
```

Butuh Vowly API berjalan di `API_BASE_URL`. Panduan kontributor dan batasan AI ada di `CLAUDE.md`.

Buka:

- [http://localhost:3303](http://localhost:3303)

## Perintah

| Perintah | Kegunaan |
| --- | --- |
| `pnpm dev` | Development server di port 3303 |
| `pnpm dev:clean` | Bersihkan cache Next.js lalu jalankan dev server |
| `pnpm clean` | Menghapus cache `.next` |
| `pnpm lint` | Menjalankan ESLint |
| `pnpm typecheck` | Memeriksa TypeScript |
| `pnpm test` | Unit dan component test |
| `pnpm test:e2e` | Browser test Playwright |
| `pnpm build` | Production build |
| `pnpm check` | Lint, typecheck, test, dan build |
| `pnpm docker:build` | Membuat Docker image (`vowly-client`) |
| `pnpm docker:up` | Menjalankan via Docker Compose di port 3303 |

## Struktur project

```text
src/
├── app/
│   ├── page.tsx               # Landing page
│   ├── panduan-pengguna/      # Pusat bantuan
│   ├── undangan-digital/      # Halaman produk + wizard pemesanan
│   ├── sign-in/               # Login
│   ├── sign-up/               # Daftar akun
│   ├── forgot-password/       # Lupa password
│   ├── dashboard/             # Dashboard Wedding Planner per proyek (protected)
│   ├── kolaborasi/terima/     # Terima undangan kolaborasi
│   ├── api/                   # BFF: session/*, backend/[...path], health
│   └── layout.tsx
├── components/
│   ├── landing/                # Section landing page (navbar, hero, footer, dst.)
│   └── ui/                     # Reusable UI primitives (Button, Card, Input, dst.)
├── config/                     # Typed configuration dan constants
├── features/                   # Business/domain modules
│   ├── auth/                   # Form login, daftar, lupa password
│   ├── dashboard/              # Shell, CrudTable, modul Home..Profile
│   ├── collaboration/          # Form terima undangan kolaborasi
│   ├── help-center/             # Pusat bantuan
│   ├── undangan-digital/       # Halaman produk + wizard pemesanan
├── lib/
│   ├── api/                    # Helper respons route handler
│   ├── vowly/                  # Client/server API Vowly, tipe, format, proxy
│   ├── errors/
│   ├── helpers/
│   ├── logger/
│   └── validation/
├── test/
└── types/
```

## Environment

Lihat `.env.example`:

```dotenv
NEXT_PUBLIC_APP_URL=http://localhost:3303
API_BASE_URL=http://localhost:4000   # Vowly API, hanya dibaca server
```

## Pemeriksaan project

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

## Docker

```bash
cp .env.example .env.local
pnpm docker:up
```

Aplikasi tersedia di [http://localhost:3303](http://localhost:3303).

Dockerfile menggunakan Next.js standalone output, BuildKit cache, non-root
runtime, runtime-injected secrets, dan health check `/api/health` — semuanya
berjalan di port `3303` agar konsisten dengan `docker-compose.yml` dan
pipeline CI/CD di `Jenkinsfile`.

## CI/CD

`Jenkinsfile` membangun image `vowly-client`, mem-push ke registry, lalu
melakukan zero-downtime deploy ke server produksi via SSH — container selalu
di-expose pada port `3303` di dalam Docker network `vowly`.
