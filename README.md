# Vowly — Wedding Planner Platform

Vowly membantu calon pengantin merencanakan pernikahan yang lebih terarah,
hemat waktu, dan minim stres — mulai dari vendor, budget, undangan digital,
hingga tamu undangan, semua dalam satu tempat.

Repository ini adalah **frontend client** Vowly: landing page, pusat bantuan,
halaman produk "Undangan Digital" beserta wizard pemesanannya, alur
autentikasi (login/daftar/lupa password), dan admin dashboard internal.

## Stack

- Next.js 16 App Router dan React 19
- TypeScript strict
- Tailwind CSS 4 dengan design token custom (lihat `src/app/globals.css`)
- Server Components sebagai default
- Better Auth email/password-ready dengan dummy admin starter
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
cp .env.example .env.local
pnpm dev
```

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
│   ├── dashboard/             # Admin dashboard (protected)
│   ├── api/                   # Auth dan health
│   └── layout.tsx
├── components/
│   ├── landing/                # Section landing page (navbar, hero, footer, dst.)
│   └── ui/                     # Reusable UI primitives (Button, Card, Input, dst.)
├── config/                     # Typed configuration dan constants
├── features/                   # Business/domain modules
│   ├── auth/                   # Form login, daftar, lupa password
│   ├── help-center/             # Pusat bantuan
│   ├── undangan-digital/       # Halaman produk + wizard pemesanan
│   ├── orders/, products/, profile/  # Modul admin dashboard
├── lib/
│   ├── api/                    # API client dan response helpers
│   ├── auth/                   # Better Auth dan session helpers
│   ├── errors/
│   ├── helpers/
│   ├── logger/
│   └── validation/
├── test/
└── types/
```

## Environment

Variabel wajib untuk menjalankan auth (lihat `.env.example` untuk daftar lengkap):

```dotenv
NEXT_PUBLIC_APP_URL=http://localhost:3303
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3303
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
