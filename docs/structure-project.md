# Portfolio Project Structure

Target architecture untuk project portfolio Next.js baru.

Jangan membuat semua folder di awal. Buat folder ketika feature memiliki
implementation nyata.

## Recommended route map

### Required routes

```text
/{locale}
/{locale}/work
/{locale}/work/{slug}
/{locale}/about
/{locale}/contact
```

### Optional routes

```text
/{locale}/blog
/{locale}/blog/{slug}
/{locale}/resume
/{locale}/uses
/{locale}/sign-in
/{locale}/dashboard
```

Optional route hanya dibuat jika diaktifkan pada brief.

## Target filesystem

```text
.
├── docs/
│   ├── README.md
│   ├── portfolio-brief.md
│   ├── prompt-from-scratch.md
│   ├── structure-project.md
│   └── implementation-roadmap.md
├── messages/
│   ├── en.json
│   └── id.json
├── public/
│   ├── documents/
│   │   └── resume.pdf
│   └── images/
│       ├── profile/
│       └── projects/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (portfolio)/
│   │   │   │   ├── about/
│   │   │   │   ├── contact/
│   │   │   │   ├── work/
│   │   │   │   │   ├── [slug]/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── not-found.tsx
│   │   ├── api/
│   │   │   ├── contact/           # optional
│   │   │   ├── health/
│   │   │   └── turnstile/verify/  # optional with form/auth
│   │   ├── global-error.tsx
│   │   ├── layout.tsx
│   │   ├── manifest.ts
│   │   ├── opengraph-image.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── mobile-navigation.tsx
│   │   │   ├── site-footer.tsx
│   │   │   ├── site-header.tsx
│   │   │   └── site-shell.tsx
│   │   ├── seo/
│   │   │   └── json-ld.tsx
│   │   └── ui/
│   ├── config/
│   │   ├── navigation.ts
│   │   ├── site.ts
│   │   └── social-links.ts
│   ├── content/
│   │   ├── experience.ts
│   │   ├── profile.ts
│   │   └── projects/
│   │       ├── index.ts
│   │       ├── saku-finance.ts
│   │       └── ...
│   ├── features/
│   │   ├── contact/
│   │   │   ├── actions/
│   │   │   ├── components/
│   │   │   └── schemas/
│   │   └── portfolio/
│   │       ├── components/
│   │       ├── repositories/
│   │       └── schemas/
│   ├── i18n/
│   ├── lib/
│   │   ├── errors/
│   │   ├── helpers/
│   │   ├── logger/
│   │   ├── security/
│   │   ├── seo/
│   │   └── validation/
│   ├── proxy.ts
│   └── types/
├── Dockerfile
├── next.config.ts
└── package.json
```

## Dependency direction

```text
app ───────────────► features ─────────► lib
 │                       │                ▲
 ├──────────────────────► components ─────┘
 └──────────────────────► config/types
```

Rules:

- `lib` tidak mengimpor `features`.
- `components/ui` tidak mengerti domain project atau contact.
- Page/layout menyusun data dan component; business rule berada di feature.
- Feature hanya mengekspos public API yang diperlukan.
- Content tidak mengimpor React component.
- Server-only module harus memakai `server-only` jika menyimpan integration atau secret.

## Content model

Gunakan local typed content sebagai default.

### Profile

```ts
type LocalizedText = {
  id: string;
  en: string;
};

type Profile = {
  name: string;
  role: LocalizedText;
  shortBio: LocalizedText;
  longBio: LocalizedText;
  location?: string;
  email?: string;
  availability?: LocalizedText;
};
```

### Project

```ts
type Project = {
  slug: string;
  title: string;
  category: string;
  summary: LocalizedText;
  role: string;
  year: string;
  stack: string[];
  responsibilities: LocalizedText[];
  decisions: LocalizedText[];
  metrics: Array<{
    label: LocalizedText;
    value: string;
    verified: boolean;
  }>;
  images: string[];
  liveUrl?: string;
  repositoryUrl?: string;
  featured: boolean;
};
```

Validasi content dengan Zod pada repository boundary.

## Repository interface

```ts
type ProjectRepository = {
  list(): Promise<Project[]>;
  listFeatured(): Promise<Project[]>;
  getBySlug(slug: string): Promise<Project | null>;
};
```

Page menggunakan repository, bukan membaca file content secara acak. Dengan
begitu local content dapat diganti CMS tanpa menulis ulang page.

## Server and client boundaries

### Server Component

- Page dan layout.
- Content repository.
- Project rendering.
- Metadata dan JSON-LD.
- Contact submission.
- Session/authorization jika admin diaktifkan.

### Client Component

- Mobile navigation.
- Locale switcher.
- Project filter jika filter berjalan di browser.
- Contact form interaction.
- Turnstile widget.

Jangan menjadikan satu page sebagai Client Component karena satu interactive
element.

## Initial project setup

Setelah menjalankan `create-next-app`:

- Hapus asset dan copy default Next.js yang tidak digunakan.
- Gunakan konfigurasi TypeScript, ESLint, Tailwind, App Router, dan `src/` dari
  hasil `create-next-app`.
- Buat folder secara bertahap sesuai feature yang dikerjakan.
- Instal dependency hanya ketika sudah memiliki consumer.
- Jangan membuat folder kosong hanya untuk menyerupai diagram struktur.
- Jangan membuat auth/dashboard jika brief tidak mengaktifkannya.

## Naming conventions

| Type | Example |
| --- | --- |
| Component file | `project-card.tsx` |
| Component export | `ProjectCard` |
| Schema | `project.schema.ts` |
| Repository | `project.repository.ts` |
| Server action | `send-contact.action.ts` |
| Config | `social-links.ts` |
| Route directory | `kebab-case` |

## Optional modules

### Blog

Tambahkan `features/blog`, `content/posts`, dan route blog hanya ketika brief
mengaktifkan blog.

### Admin/CMS

Jika admin diaktifkan:

- Tambahkan Better Auth.
- Tambahkan database adapter.
- Gunakan allowlist admin.
- Validasi authorization pada setiap mutation.
- Jangan mengandalkan proxy sebagai authorization.

### Contact form

Jika contact form diaktifkan:

- Zod validation client/server.
- Turnstile Siteverify.
- Rate limiting.
- Email provider.
- Privacy-safe logger.
