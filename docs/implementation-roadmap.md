# Portfolio Implementation Roadmap

Setiap fase memiliki output dan review gate. Jangan lanjut jika input fase belum
siap.

## Phase 0 — Repository and brief audit

### Input

- Project Next.js baru dari `create-next-app`.
- `portfolio-brief.md`.
- Asset dan resume yang tersedia.

### Tasks

- [ ] Audit package, route awal, konfigurasi, dan environment project.
- [ ] Tandai brief field sebagai VERIFIED, DRAFT, TODO, atau PRIVATE.
- [ ] Tentukan optional feature yang aktif.
- [ ] Buat daftar asset yang kurang.
- [ ] Catat credential/integration yang diperlukan tanpa menampilkan secret.

### Output

- Scope summary.
- Content gap list.
- Struktur, dependency, dan file implementation plan.

### Review gate

Owner menyetujui scope dan data yang boleh dipublikasikan.

## Phase 1 — Foundation and content model

### Tasks

- [ ] Perbarui package name.
- [ ] Buat `siteConfig`.
- [ ] Buat navigation dan social config.
- [ ] Buat profile/project Zod schema.
- [ ] Buat typed local content.
- [ ] Buat project repository.
- [ ] Siapkan route groups.
- [ ] Hapus halaman default `create-next-app` setelah homepage portfolio siap.
- [ ] Instal hanya dependency yang digunakan.

### Output

- Content dapat dibaca melalui repository.
- Route skeleton tersedia.
- Project tidak lagi menampilkan halaman default `create-next-app`.

### Validation

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Phase 2 — Design system and shell

### Tasks

- [ ] Finalisasi color, typography, spacing, radius, dan shadow tokens.
- [ ] Buat site header/footer.
- [ ] Buat mobile navigation.
- [ ] Buat locale switcher.
- [ ] Buat skip link dan visible focus states.
- [ ] Buat project card, tech badge, metric card, dan section heading.
- [ ] Verifikasi reduced motion.

### Output

- Shared shell responsive.
- Reusable portfolio component primitives.

### Review gate

Owner menyetujui visual direction pada mobile dan desktop.

## Phase 3 — Required public pages

### Tasks

- [ ] Homepage.
- [ ] Work listing.
- [ ] Project detail.
- [ ] About.
- [ ] Contact CTA atau form sesuai brief.
- [ ] Localized not-found state.
- [ ] Project navigation previous/next.

### Output

- Seluruh required route berfungsi pada ID dan EN.
- Project detail menggunakan content repository.

### Manual review

- [ ] Tidak ada mixed-language copy.
- [ ] Tidak ada TODO/lorem ipsum yang terlihat.
- [ ] Semua CTA dan external link bekerja.
- [ ] Layout mobile tidak overflow.

## Phase 4 — Contact and optional integrations

Jalankan hanya module yang diaktifkan.

### Contact form

- [ ] Zod schema.
- [ ] Server action/Route Handler.
- [ ] Turnstile Siteverify.
- [ ] Rate limiting.
- [ ] Email provider.
- [ ] Success/error state.
- [ ] Privacy-safe logging.

### Blog

- [ ] Pilih MDX strategy yang aktif dan maintained.
- [ ] Article schema/repository.
- [ ] Listing/detail route.
- [ ] Syntax highlighting jika diperlukan.

### Admin

- [ ] Database adapter Better Auth.
- [ ] Admin allowlist/role.
- [ ] Server authorization.
- [ ] Content mutation audit.

## Phase 5 — SEO and polish

### Tasks

- [ ] Metadata unik per route.
- [ ] Canonical dan hreflang.
- [ ] Dynamic sitemap.
- [ ] Open Graph images.
- [ ] Person/WebSite/CreativeWork JSON-LD.
- [ ] Image dimensions dan optimization.
- [ ] Accessibility audit.
- [ ] Lighthouse review.
- [ ] Broken-link review.

### Performance rules

- Server Component default.
- Jangan lazy-load hero atau main content.
- Dynamic import hanya untuk client dependency berat.
- Hindari third-party script yang tidak diperlukan.

## Phase 6 — Release

### Environment

- [ ] Production URL.
- [ ] Google OAuth callback jika auth aktif.
- [ ] Turnstile production hostname jika Turnstile aktif.
- [ ] Email provider jika contact form aktif.
- [ ] Analytics/error monitoring jika dipilih.

### Final checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```

### Release checklist

- [ ] No visible TODO or dummy content.
- [ ] No secret in source, log, Docker ARG, or client bundle.
- [ ] All required ID/EN pages complete.
- [ ] Resume and social links work.
- [ ] Project facts approved.
- [ ] Contact flow works if enabled.
- [ ] Docker image builds if Docker deployment is used.
- [ ] README menjelaskan portfolio dan cara menjalankannya.
- [ ] Deployment rollback path is known.

## Change discipline

- Satu fase per perubahan besar.
- Jangan membangun optional feature sebelum required pages selesai.
- Jangan menambahkan dependency tanpa consumer nyata.
- Jangan membuat CMS hanya untuk menghindari mengedit typed content.
- Setelah fase selesai, ringkas keputusan dan file yang berubah.
