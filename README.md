# Ganipedia Next.js Starter

Starter Next.js modern dan reusable untuk membuat project baru dengan fondasi
yang konsisten, aman, dan production-ready.

Repository ini adalah **starter**, bukan portfolio final. Blueprint portfolio di
folder `docs/` ditujukan untuk project Next.js baru yang dibuat secara terpisah
menggunakan `create-next-app`.

## Stack

- Next.js 16 App Router dan React 19
- TypeScript strict
- Tailwind CSS 4
- Server Components sebagai default
- Better Auth dan Google OAuth
- Cloudflare Turnstile server verification
- Internationalization ID/EN dengan `next-intl`
- Typed API client dan standard API response
- Zod validation dan normalized errors
- Structured global logger
- React Select dan React Day Picker
- React Icons dengan targeted imports
- Vitest, Testing Library, dan Playwright
- ESLint, Husky, lint-staged, dan GitHub Actions
- Docker standalone multi-stage

## Menjalankan starter

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Buka:

- [http://localhost:3000/id](http://localhost:3000/id)
- [http://localhost:3000/en](http://localhost:3000/en)

## Perintah

| Perintah | Kegunaan |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm dev:clean` | Bersihkan cache Next.js lalu jalankan dev server |
| `pnpm clean` | Menghapus cache `.next` |
| `pnpm lint` | Menjalankan ESLint |
| `pnpm typecheck` | Memeriksa TypeScript |
| `pnpm test` | Unit dan component test |
| `pnpm test:e2e` | Browser test Playwright |
| `pnpm build` | Production build |
| `pnpm check` | Lint, typecheck, test, dan build |
| `pnpm docker:build` | Membuat Docker image |
| `pnpm docker:up` | Menjalankan Docker Compose |

## Struktur starter

```text
src/
├── app/
│   ├── [locale]/             # Localized routes
│   ├── api/                  # Auth, health, Turnstile
│   └── layout.tsx
├── components/
│   ├── layout/               # Site dan application shell
│   ├── sections/             # Demo landing sections
│   └── ui/                   # Reusable UI primitives
├── config/                   # Typed configuration dan constants
├── features/                 # Business/domain modules
├── i18n/                     # Locale routing dan navigation
├── lib/
│   ├── api/                  # API client dan response helpers
│   ├── auth/                 # Better Auth dan session helpers
│   ├── errors/
│   ├── helpers/
│   ├── logger/
│   ├── security/             # Turnstile verification
│   └── validation/
├── test/
└── types/
```

## Mengeksekusi prompt portfolio di project Next.js baru

Blueprint portfolio tersedia di:

- [docs/README.md](docs/README.md)
- [docs/portfolio-brief.md](docs/portfolio-brief.md)
- [docs/prompt-from-scratch.md](docs/prompt-from-scratch.md)
- [docs/structure-project.md](docs/structure-project.md)
- [docs/implementation-roadmap.md](docs/implementation-roadmap.md)

### Langkah eksekusi

1. Buat project Next.js baru:

```bash
pnpm create next-app personal-portfolio \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd personal-portfolio
```

2. Salin folder `docs/` ke project tersebut.
3. Buka `personal-portfolio` sebagai working directory coding agent.
4. Lengkapi data dan status verifikasi pada `docs/portfolio-brief.md`.
5. Tentukan fitur opsional yang benar-benar dibutuhkan.
6. Berikan prompt berikut kepada coding agent.

```text
Gunakan project Next.js yang sedang aktif. Project ini sudah dibuat menggunakan
create-next-app. Jangan membuat project atau scaffold lain di dalamnya.

Baca dokumen berikut secara berurutan:

1. docs/portfolio-brief.md
2. docs/structure-project.md
3. docs/implementation-roadmap.md
4. docs/prompt-from-scratch.md

Implementasikan portfolio berdasarkan specification tersebut di project ini.
Hapus halaman default create-next-app setelah homepage portfolio siap.

Gunakan informasi publik berikut sebagai referensi:

- LinkedIn: https://www.linkedin.com/in/ganiramadhan35/
- Ganipedia: https://ganipedia.com/en

Jangan mengarang employment history, pendidikan, metric, testimonial, atau
informasi personal yang tidak tersedia pada brief maupun sumber yang dapat
diverifikasi.

Kerjakan sesuai fase pada implementation-roadmap.md. Setelah setiap fase,
jalankan pemeriksaan yang relevan dan jelaskan file yang berubah.
```

### Prompt singkat untuk coding agent

Jika brief sudah lengkap:

```text
Bangun portfolio Gani Ramadhan pada project Next.js ini menggunakan
docs/portfolio-brief.md sebagai source of truth content,
docs/structure-project.md sebagai aturan arsitektur, dan
docs/implementation-roadmap.md sebagai urutan pengerjaan. Ikuti execution rules
dari docs/prompt-from-scratch.md.

Project sudah dibuat menggunakan create-next-app. Jangan membuat nested project
atau scaffold baru.
```

## Authentication dan Turnstile

Isi environment berikut jika project portfolio membutuhkan sign-in:

```dotenv
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
TURNSTILE_EXPECTED_HOSTNAME=localhost
```

Google callback URL:

```text
http://localhost:3000/api/auth/callback/google
```

Turnstile diverifikasi di server melalui Siteverify. Secret tidak boleh memakai
prefix `NEXT_PUBLIC_` atau menjadi Docker build argument.

## Pemeriksaan project

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

Sesuaikan command dengan tooling yang benar-benar dipasang pada project baru.

## Docker

```bash
pnpm docker:up
```

Dockerfile menggunakan Next.js standalone output, BuildKit cache, non-root
runtime, runtime-injected secrets, dan health check `/api/health`.
