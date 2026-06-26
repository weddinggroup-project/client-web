# Portfolio Project Specification

Folder ini berisi specification untuk membangun portfolio pada **project
Next.js baru**.

Project portfolio dibuat di folder atau repository terpisah menggunakan
`create-next-app`. Setelah project dibuat, salin folder `docs/` ini ke dalam
project baru tersebut.

## Membuat project

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

Salin specification:

```bash
cp -R /path/to/portfolio-specification/docs ./docs
```

Setelah itu buka folder `personal-portfolio` sebagai working directory coding
agent.

## Source of truth

Urutan prioritas ketika dokumen berbeda:

1. Instruksi terbaru dari pemilik project.
2. [`portfolio-brief.md`](./portfolio-brief.md) — fakta dan kebutuhan produk.
3. [`structure-project.md`](./structure-project.md) — boundary arsitektur.
4. [`implementation-roadmap.md`](./implementation-roadmap.md) — urutan delivery.
5. [`prompt-from-scratch.md`](./prompt-from-scratch.md) — cara implementasi.
6. Kode project Next.js yang sedang aktif.

Coding agent tidak boleh mengarang informasi untuk mengisi data yang berstatus
`TODO` atau `UNVERIFIED`.

## Cara menggunakan

### 1. Lengkapi brief

Isi seluruh bagian `Required before implementation` pada
[`portfolio-brief.md`](./portfolio-brief.md).

Gunakan status:

- `VERIFIED`: boleh dipublikasikan.
- `DRAFT`: boleh digunakan sementara, harus direview.
- `TODO`: belum tersedia, jangan dipublikasikan.
- `PRIVATE`: tidak boleh masuk website atau log.

### 2. Tentukan scope

Default scope:

- Landing page.
- Work listing.
- Project detail/case study.
- About.
- Contact CTA atau contact form.
- Resume link.
- ID dan EN.

Blog, admin dashboard, CMS, database, dan authenticated area bersifat opsional.

### 3. Jalankan kickoff prompt

Berikan prompt berikut kepada coding agent di project baru:

```text
Repository aktif ini adalah project Next.js baru untuk portfolio Gani Ramadhan.
Gunakan project yang sudah dibuat dengan create-next-app dan jangan membuat
project lain di dalamnya.

Baca file berikut sepenuhnya:

1. docs/portfolio-brief.md
2. docs/structure-project.md
3. docs/implementation-roadmap.md
4. docs/prompt-from-scratch.md

Gunakan portfolio-brief.md sebagai source of truth fakta dan scope. Jangan
mengarang employment history, pendidikan, metric, testimonial, client name,
project outcome, atau informasi personal.

Mulai dari Phase 0 pada implementation-roadmap.md. Audit repository dan brief,
lalu laporkan:

- data yang siap digunakan;
- data yang masih TODO atau UNVERIFIED;
- fitur wajib;
- fitur opsional yang tidak akan dibangun;
- struktur dan file yang akan dibuat;
- dependency yang benar-benar diperlukan.

Setelah audit, lanjutkan implementasi fase demi fase. Jangan membangun blog,
dashboard, CMS, database, atau authentication apabila brief tidak
mengaktifkannya.
```

### 4. Review per fase

Jangan meminta coding agent mengerjakan seluruh project sebagai satu perubahan.
Review content, visual direction, dan architecture setelah setiap fase.

## Workflow

```text
Create Next.js project
     ↓
Copy specification docs
     ↓
Complete brief
     ↓
Audit project
     ↓
Foundation and content model
     ↓
Public pages
     ↓
Contact and integrations
     ↓
SEO, accessibility, performance
     ↓
Production release
```

## Definition of a safe handoff

- Repository aktif adalah project portfolio baru.
- Brief sudah membedakan fakta verified dan placeholder.
- Scope wajib dan opsional sudah dipilih.
- Credential hanya berada di environment lokal/deployment.
- Project URL, contact, dan resume sudah diverifikasi pemilik.
