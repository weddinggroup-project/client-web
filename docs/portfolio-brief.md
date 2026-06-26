# Portfolio Product Brief

Dokumen ini adalah source of truth untuk content dan scope portfolio.

Jangan mengganti data `TODO` dengan tebakan. Jangan menampilkan data `PRIVATE`.

## Document status

| Field | Value |
| --- | --- |
| Owner | Gani Ramadhan |
| Last reviewed | TODO |
| Content approval | DRAFT |
| Default locale | `id` |
| Supported locales | `id`, `en` |

## Required before implementation

Phase 1 tidak boleh dimulai sebelum item berikut selesai atau secara eksplisit
diturunkan dari scope:

- [ ] Public email ditentukan atau contact hanya memakai LinkedIn.
- [ ] Short bio ID dan EN tersedia.
- [ ] Minimal tiga featured project dipilih.
- [ ] Role dan kontribusi per featured project dikonfirmasi.
- [ ] Project/client visibility dikonfirmasi.
- [ ] Screenshot yang boleh dipublikasikan tersedia.
- [ ] Resume dipilih: tersedia, ditunda, atau dihapus dari scope.
- [ ] Optional feature pada bagian Scope sudah dicentang.
- [ ] Positioning DRAFT sudah direview pemilik.

## Product objective

Dalam 15 detik pertama, pengunjung harus memahami:

1. Siapa Gani.
2. Capability yang ditawarkan.
3. Bukti project yang pernah dikerjakan.
4. Cara menghubungi atau melihat profil profesional.

## Audience

| Audience | Kebutuhan utama |
| --- | --- |
| Recruiter | Role, pengalaman, stack, resume |
| Engineering manager | Scope kontribusi, keputusan teknis, kualitas delivery |
| Founder/client | Masalah yang dapat diselesaikan, bukti project, contact |
| Developer | Architecture, implementation detail, GitHub |

## Primary actions

Urutan prioritas:

1. Membuka selected project.
2. Membuka LinkedIn atau GitHub.
3. Menghubungi melalui email/contact form.
4. Membuka atau mengunduh resume.

## Verified references

| Source | URL | Status |
| --- | --- | --- |
| LinkedIn | <https://www.linkedin.com/in/ganiramadhan35/> | VERIFIED link; profile content requires owner review |
| Ganipedia | <https://ganipedia.com/en> | VERIFIED |
| GitHub | <https://github.com/ganiramadhan> | VERIFIED link |

Fakta publik yang sudah ditemukan dari Ganipedia:

- 12+ project selesai.
- 10+ klien.
- 3+ tahun pengalaman.
- SAKU Finance.
- Website Desa Mekarjaya.
- BPDA Bujapi profile, CMS, dan HRMIS.
- Batik Merawit.

Metric, role, contribution, employment history, dan outcome project tetap harus
dikonfirmasi pemilik sebelum publikasi.

## Brand and positioning

### Identity

| Field | Value | Status |
| --- | --- | --- |
| Full name | Gani Ramadhan | VERIFIED |
| Brand | Ganipedia | VERIFIED |
| Primary role | Full-stack Web Developer | DRAFT |
| Location | TODO | TODO |
| Timezone | Asia/Jakarta | DRAFT |
| Availability | TODO | TODO |

### Positioning ID

> Full-stack web developer di balik Ganipedia yang membangun website dan
> aplikasi web dengan fokus pada kejelasan produk, arsitektur yang dapat dirawat,
> dan delivery yang dapat diandalkan.

Status: DRAFT.

### Positioning EN

> The full-stack web developer behind Ganipedia, building websites and web
> applications with a focus on product clarity, maintainable architecture, and
> reliable delivery.

Status: DRAFT.

## Public profile data

Complete before release:

| Field | Indonesia | English | Status |
| --- | --- | --- | --- |
| Short bio | TODO | TODO | TODO |
| Long bio | TODO | TODO | TODO |
| Current focus | TODO | TODO | TODO |
| Availability copy | TODO | TODO | TODO |

### Contact and social

| Field | Value | Status |
| --- | --- | --- |
| Public email | TODO | TODO |
| LinkedIn | <https://www.linkedin.com/in/ganiramadhan35/> | VERIFIED |
| GitHub | <https://github.com/ganiramadhan> | VERIFIED |
| Ganipedia | <https://ganipedia.com/en> | VERIFIED |
| Resume PDF | TODO | TODO |
| WhatsApp | PRIVATE unless owner approves | PRIVATE |

## Project content

### Featured project selection

Default candidates:

1. SAKU Finance.
2. Website Desa Mekarjaya.
3. BPDA Bujapi Platform.
4. Batik Merawit.

Pilih maksimal empat project untuk homepage.

### Required fields per project

```text
title
slug
category
summaryId
summaryEn
role
year
status
clientVisibility
problem
responsibilities[]
constraints[]
approach[]
decisions[]
stack[]
metrics[]
screenshots[]
liveUrl
repositoryUrl
lessons[]
```

Aturan:

- `clientVisibility` harus `public` sebelum nama client ditampilkan.
- Metric harus memiliki sumber atau konfirmasi pemilik.
- Jika repository private, jangan menampilkan repository URL.
- Jika screenshot memuat data sensitif, redact sebelum masuk `public/`.
- Jelaskan kontribusi personal; jangan mengklaim hasil seluruh tim.

### Project worksheet

Salin tabel ini untuk setiap project:

| Field | Value | Status |
| --- | --- | --- |
| Project | TODO | TODO |
| Public title | TODO | TODO |
| Role | TODO | TODO |
| Period/year | TODO | TODO |
| Team | TODO | TODO |
| Problem | TODO | TODO |
| Contribution | TODO | TODO |
| Stack | TODO | TODO |
| Outcome | TODO | TODO |
| Metrics | TODO | TODO |
| Live URL | TODO | TODO |
| Screenshots approved | No | TODO |

## Experience

Employment history harus diisi pemilik dari sumber pribadi atau LinkedIn.

| Company/client | Role | Period | Scope | Public? | Status |
| --- | --- | --- | --- | --- | --- |
| TODO | TODO | TODO | TODO | TODO | TODO |

Jangan mengambil employment data dari tebakan atau snippet search engine.

## Scope

### Required

- [x] Bilingual ID/EN.
- [x] Landing page.
- [x] Selected work.
- [x] Work listing.
- [x] Project detail/case study.
- [x] About.
- [x] Contact CTA.
- [x] Responsive navigation.
- [x] Metadata, sitemap, Open Graph, hreflang.

### Optional — enable explicitly

- [ ] Blog/MDX.
- [ ] Contact form with email delivery.
- [ ] Resume HTML page.
- [ ] Uses page.
- [ ] Theme switcher.
- [ ] Admin dashboard.
- [ ] Google OAuth.
- [ ] CMS/database.
- [ ] Analytics.
- [ ] Error monitoring.

Unchecked optional features must not be implemented.

## Visual direction

- Modern, calm, technical, and editorial.
- Dark hero; light content sections are allowed.
- Ganipedia cyan/blue/violet accent.
- Strong typography and generous spacing.
- Project visuals should be real screenshots or purposeful SVG.
- Motion should be restrained and support comprehension.
- Respect `prefers-reduced-motion`.

Avoid:

- Generic stock photos.
- Skill percentage bars.
- Excessive glassmorphism.
- Gradient on every card.
- Fake terminal/code decoration without meaning.
- Auto-playing carousel.

## Content voice

- Concrete and concise.
- Outcome before technology.
- Active voice.
- Explain trade-offs honestly.
- Avoid unsupported superlatives.
- Avoid mixing Indonesian and English in one sentence unless it is a technical term.

## Privacy and security

- Never publish private phone numbers or addresses without approval.
- Never expose credentials, OAuth secrets, Turnstile secrets, cookies, or tokens.
- Do not log contact message content.
- Do not publish client screenshots without permission.
- Do not fabricate testimonial or metric.

## Release acceptance

- [ ] All required fields are VERIFIED or owner-approved DRAFT.
- [ ] ID and EN content are complete.
- [ ] Featured projects have approved visuals.
- [ ] All public links work.
- [ ] Resume contains no private data that should remain internal.
- [ ] No TODO, placeholder, lorem ipsum, or dummy secret is visible publicly.
