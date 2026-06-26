# Master Execution Prompt — Portfolio Project

Gunakan prompt ini pada project Next.js baru yang sudah dibuat dengan
`create-next-app`.

Sebelum menjalankan prompt:

1. Lengkapi [`portfolio-brief.md`](./portfolio-brief.md).
2. Buat project Next.js di folder/repository baru.
3. Salin folder `docs/` ke project tersebut.
4. Tentukan optional feature yang aktif.

## Copy-paste prompt

```text
ROLE

Kamu bertindak sebagai senior product designer, UX writer, dan staff-level
Next.js engineer. Tugasmu adalah membangun portfolio Gani Ramadhan pada project
Next.js baru yang sedang aktif.

REPOSITORY BOUNDARY

- Repository aktif sudah dibuat menggunakan create-next-app.
- Jangan membuat project Next.js lain atau nested project.
- Bangun seluruh implementation di repository aktif.
- Hapus halaman default create-next-app setelah homepage portfolio siap.
- Jangan melakukan external deployment, mengirim email, atau membuat credential.

READ FIRST

Baca file berikut sepenuhnya dan gunakan urutan prioritas ini:

1. Instruksi terbaru dari pemilik project.
2. docs/portfolio-brief.md — source of truth fakta dan scope.
3. docs/structure-project.md — architecture boundary.
4. docs/implementation-roadmap.md — delivery sequence.
5. Repository yang sedang aktif.

FACT SAFETY

- Jangan mengarang employment history, pendidikan, role, team size, metric,
  testimonial, client name, outcome, atau project contribution.
- Data berstatus VERIFIED boleh dipublikasikan.
- Data DRAFT boleh digunakan tetapi harus dicatat untuk owner review.
- Data TODO tidak boleh tampil sebagai fakta.
- Data PRIVATE tidak boleh masuk UI, source publik, log, atau metadata.
- Jika data penting belum tersedia, gunakan neutral omission atau developer note,
  bukan fake content.

PRODUCT GOAL

Dalam 15 detik pertama, pengunjung harus memahami:

1. Siapa Gani.
2. Capability yang ditawarkan.
3. Bukti project.
4. Cara menghubungi atau melihat profil profesional.

Target audience:

- recruiter;
- engineering manager;
- founder/client;
- developer yang menilai engineering depth.

DEFAULT SCOPE

Required:

- /[locale]
- /[locale]/work
- /[locale]/work/[slug]
- /[locale]/about
- /[locale]/contact
- ID dan EN
- responsive navigation
- metadata, sitemap, Open Graph, canonical, hreflang

Optional modules hanya dibuat jika dicentang pada portfolio-brief.md:

- blog/MDX;
- contact form dan email delivery;
- resume page;
- uses page;
- theme switcher;
- Google OAuth;
- dashboard/CMS;
- database;
- analytics;
- error monitoring.

Jika auth/dashboard tidak aktif, jangan membuat route, component, dependency,
environment, atau documentation auth.

POSITIONING

Portfolio harus terasa seperti website engineer berpengalaman, bukan template
CV online atau agency landing page.

Prinsip content:

- outcome dan context sebelum technology;
- kontribusi personal harus jelas;
- project unggulan berupa case study;
- jelaskan constraint, decision, trade-off, dan lesson;
- jangan gunakan skill percentage;
- jangan gunakan unsupported claim.

VISUAL DIRECTION

- Modern, calm, technical, editorial.
- Dark hero dengan near-black navy.
- Accent cyan, blue, dan violet dari Ganipedia.
- Strong typography dan generous whitespace.
- Border halus dan restrained glow.
- Gunakan real project screenshot atau purposeful SVG.
- Hindari generic stock photo, auto carousel, excessive glassmorphism, dan
  decorative fake code.
- Motion singkat dan menghormati prefers-reduced-motion.
- Mobile experience harus setara dengan desktop.

HOMEPAGE

Build sections:

1. Hero
   - role dan positioning;
   - short supporting copy;
   - selected-work CTA;
   - about/contact CTA;
   - LinkedIn, GitHub, email, resume;
   - availability hanya jika VERIFIED/DRAFT approved.

2. Selected work
   - maksimal empat project;
   - outcome, role, year, stack maksimal empat tag;
   - metric hanya jika verified;
   - link ke internal case study.

3. Capabilities
   - product engineering;
   - frontend systems;
   - backend/API;
   - architecture/reliability;
   - delivery/developer experience.

4. Experience
   - hanya jika data owner tersedia;
   - company/client, role, period, scope, contribution.

5. Principles
   - clarity over cleverness;
   - server-first, client only when needed;
   - validate external boundaries;
   - observability is part of delivery.

6. Contact CTA
   - specific and low-friction;
   - email/LinkedIn always available;
   - form only if enabled.

CASE STUDY

Each case study should support:

1. Summary.
2. Context.
3. Problem.
4. Personal role and responsibilities.
5. Constraints.
6. Approach.
7. Architecture.
8. Decisions and trade-offs.
9. Implementation highlights.
10. Verified outcome/metrics.
11. Lessons learned.
12. Next improvements.

Omit sections without real content. Do not fill them with generic copy.

CONTENT ARCHITECTURE

- Use typed local content by default.
- Validate profile and project content with Zod.
- Access project data through repository functions:
  - list()
  - listFeatured()
  - getBySlug()
- Do not add a database for rarely changing content.
- Add CMS/database only when admin editing is explicitly required.
- Keep personal data in central config/content files, not scattered through UI.

COMPONENT RULES

Create only components with real consumers:

- SiteShell
- SiteHeader
- MobileNavigation
- SiteFooter
- SocialLinks
- ProjectCard
- ProjectGrid
- CaseStudyHeader
- CaseStudyNavigation
- TechBadge
- MetricCard
- ExperienceTimeline if data exists
- ContactForm if enabled
- SkipLink
- EmptyState
- ErrorState
- LoadingSpinner

Rules:

- semantic HTML;
- keyboard access;
- visible focus;
- Server Component by default;
- smallest possible client boundary;
- no domain logic inside components/ui;
- targeted icon imports only.

TECHNICAL CONSTRAINTS

Use as the technical baseline when needed:

- Next.js App Router;
- React;
- TypeScript strict;
- Tailwind CSS;
- next-intl;
- Zod;
- global API/error/logger helpers;
- React Icons/Lucide targeted imports;
- Docker standalone.

Optional integrations must not remain installed if unused.

Do not add Redux, Zustand, TanStack Query, Prisma, database, animation library,
or CMS without a concrete requirement.

RENDERING AND PERFORMANCE

- Server Component default.
- generateStaticParams for local project slugs.
- generateMetadata for pages and case studies.
- next/image for raster assets.
- Explicit image dimensions.
- next/dynamic only for heavy client components.
- Do not lazy-load above-the-fold primary content.
- Use Person, WebSite, and CreativeWork JSON-LD.
- Keep third-party scripts minimal.

CONTACT FORM — ONLY IF ENABLED

- Client validation for feedback.
- Server validation with Zod.
- Turnstile Siteverify.
- Rate limiting.
- Email provider integration.
- Request ID and privacy-safe logging.
- Never log message body, token, cookie, or sensitive personal data.

SECURITY

- No secret in NEXT_PUBLIC variables.
- No secret in Docker ARG.
- Validate callback and redirect URLs.
- Sanitize rich content.
- Server authorization remains mandatory if dashboard is enabled.
- Do not expose private client screenshot or data.

DELIVERY PROCESS

Follow docs/implementation-roadmap.md phase by phase.

At the start:

1. Audit repository.
2. Report brief completeness.
3. List required and disabled optional modules.
4. Propose the route, component, content, and dependency plan.
5. Identify blockers without inventing data.

At the end of each phase:

- summarize outcome;
- list important files changed;
- list assumptions;
- list owner-review items;
- run the phase validation commands.

Do not pause for minor implementation choices that can be resolved from the
brief and architecture. Ask only when missing information materially changes
public facts, scope, or external integration.

DEFINITION OF DONE

- Required routes exist in ID and EN.
- No mixed-language copy.
- No visible TODO, dummy content, or lorem ipsum.
- No fabricated fact.
- Mobile navigation works.
- Project data comes from typed repository.
- Metadata, canonical, hreflang, sitemap, and Open Graph are correct.
- Contact form is server-validated if enabled.
- Turnstile is server-verified if enabled.
- No unused optional integration remains.
- pnpm lint passes.
- pnpm typecheck passes.
- pnpm build passes.
- README describes the portfolio project and local setup.
- Docker image builds when Docker deployment is selected.
```

## Follow-up prompts

### Execute one phase

```text
Continue with Phase [NUMBER] from docs/implementation-roadmap.md.

Before editing, restate:

- the phase goal;
- inputs available;
- unresolved content gaps;
- files expected to change.

Complete only this phase, run its validation, and report owner-review items.
```

### Content-only review

```text
Review all public-facing ID and EN copy against docs/portfolio-brief.md.

Do not change architecture. Flag:

- unsupported claims;
- mixed-language sentences;
- vague copy;
- missing translations;
- duplicated content;
- CTA that does not match its destination.

Apply safe copy fixes and list facts that still require owner confirmation.
```

### Final release audit

```text
Run the Phase 6 release audit from docs/implementation-roadmap.md.

Check:

- public routes;
- ID/EN parity;
- metadata and structured data;
- external links;
- responsive layout;
- accessibility;
- secrets and environment boundaries;
- unused dependencies;
- Docker configuration.

Fix in-scope issues, then provide a concise release checklist with pass/fail
status and remaining owner actions.
```
