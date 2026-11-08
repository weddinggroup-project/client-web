---
name: sync-api-types
description: Menyelaraskan src/lib/vowly/types.ts dengan kontrak dan DTO API. Gunakan setelah API menambah atau mengubah endpoint atau field.
---

1. Baca bagian terkait di `docs/api-contract.md` repo API (path biasanya `../docs/api-contract.md` bila folder ini di
   dalam checkout API) dan DTO response di `internal/dto/*.go`.
2. Bandingkan dengan `src/lib/vowly/types.ts`: nama field (snake_case persis seperti JSON), nullability
   (`*T` → `T | null`), enum (union string literal), uang (`int64` → `number`), tanggal (string).
3. Perbarui tipe; jangan menambah field yang tidak ada di API. Field baru yang opsional aman; field dihapus/diubah
   adalah perubahan merusak — laporkan ke pengguna sebelum memperbaiki pemakainya.
4. `pnpm typecheck` menunjukkan pemakai yang perlu disesuaikan; sesuaikan hanya yang terdampak.
5. Perbarui `docs/api-mapping.md` bila endpoint baru dipakai layar.
6. Laporan: tipe yang berubah, pemakai terdampak, hasil `pnpm lint typecheck test`.
