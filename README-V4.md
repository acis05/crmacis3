# SimpleCRM AI v4 — Dashboard & Cash In

Upgrade dari v3. Upload semua file ke root repository GitHub yang sama, **jangan hapus database PostgreSQL**.

## Tambahan
- Menu Cash In: tambah, edit, hapus proyeksi dan realisasi; pilihan bulan, tingkat kepastian, PIC, lead/customer terkait.
- Dashboard: KPI pipeline, hot leads, won, follow-up, cash in bulan ini, bulan depan, grafik 6 bulan.
- Analisis AI agregat langsung dari dashboard, mengikuti hak akses Admin/Sales. Tidak mengirim nama/nomor telepon customer ke AI dashboard.
- Tabel `cashflows` dibuat otomatis ketika aplikasi mengakses database.

## Railway
Pertahankan DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, OPENAI_API_KEY, OPENAI_MODEL (`gpt-6-luna` jika tersedia untuk project), PORT=8080, HOSTNAME=0.0.0.0, target domain 8080.

**Penting:** Backup PostgreSQL sebelum deploy, khususnya jika sudah ada data produksi. Proyeksi bukan realisasi. Fitur ini bukan sistem akuntansi atau rekonsiliasi bank.

Source belum menjalani uji end-to-end Railway; pastikan Build Logs dan login berhasil setelah upload.
