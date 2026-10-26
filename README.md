# SimpleCRM AI v2 — Admin + Sales

Source code Next.js ringan, PostgreSQL Railway, tanpa Prisma.

## Fitur
- Login Admin dan Sales dengan password bcrypt dan cookie HTTP-only.
- Admin melihat seluruh leads, membuat akun Sales, dan memilih PIC.
- Sales hanya bisa melihat dan mengubah leads miliknya (pembatasan server).
- Input leads, nominal rupiah, status Hot/Warm/Cold/Penawaran/Negosiasi/Won/Lost.
- Dashboard, jadwal follow-up, catatan komunikasi, dan analisis OpenAI atas permintaan.
- Tabel database dibuat otomatis saat login pertama; tidak perlu migrasi manual.

## Upload ke GitHub
1. Ekstrak ZIP ini.
2. Buat **repository GitHub baru** (disarankan agar proyek lama tidak tertimpa).
3. Upload **isi folder** `simplecrm-ai-v2` ke root repo: `app`, `components`, `lib`, `package.json`, `Dockerfile`, dll.
4. Jangan upload `.env` atau kredensial.

## Deploy Railway
1. Buat **project baru** di Railway.
2. Tambahkan **PostgreSQL**.
3. Tambahkan service aplikasi dari repository GitHub baru.
4. Buka **Variables** pada service aplikasi dan set:
   - `DATABASE_URL` = reference ke variabel `DATABASE_URL` service PostgreSQL, contoh `${{Postgres.DATABASE_URL}}` (nama `Postgres` harus sesuai service Anda).
   - `AUTH_SECRET` = string acak kuat minimal 32 karakter.
   - `ADMIN_EMAIL` = email login admin.
   - `ADMIN_PASSWORD` = password login admin **minimal 12 karakter**.
   - `OPENAI_API_KEY` = API key OpenAI (boleh dikosongkan untuk uji CRM).
   - `OPENAI_MODEL` = model API yang tersedia, default `gpt-4.1-mini`.
5. Railway akan memakai `Dockerfile`. Setelah deployment sukses, buka **Networking → Generate Domain**.
6. Buka URL aplikasi dan login dengan `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Tabel dan akun Admin otomatis dibuat pada login pertama.
7. Tambahkan akun Sales melalui menu **Tim Sales**.

### Penting
- `GPT-6.1` **tidak diasumsikan tersedia**; gunakan nama model yang benar-benar aktif pada akun API OpenAI.
- Mengubah `ADMIN_PASSWORD` setelah akun dibuat **tidak** mengganti password di database.
- Jangan tampilkan API key, password, atau DATABASE_URL dalam screenshot.
- Ini MVP: belum ada reset password, rate limit login, ekspor Excel, backup otomatis, atau audit log penuh. Sebelum dipakai untuk data pelanggan sensitif, lengkapi kontrol keamanan dan backup.
- Jika build gagal, kirim log build Railway lengkap, bukan hanya baris terakhir.

## Lokal
Node 22, PostgreSQL, lalu:
```sh
npm install
# salin .env.example menjadi .env.local dan isi variabel
npm run dev
```
Di PowerShell Windows yang memblokir npm.ps1, pakai `npm.cmd install` dan `npm.cmd run dev`.

## Status verifikasi
Kode dan struktur ZIP telah dibuat, tetapi build end-to-end belum dapat diverifikasi di lingkungan pembuat karena unduhan dependensi npm tidak selesai. Jangan menganggap deployment pasti sukses sebelum melihat Build Logs Railway.
