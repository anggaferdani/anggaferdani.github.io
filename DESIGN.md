# DESIGN.md

Acuan visual untuk [index.html](index.html). Semua nilai di bawah diambil dari kode yang sedang berjalan — kalau mengubah salah satunya, perbarui juga catatan ini.

## Prinsip

Referensinya Are.na: teks dulu, kromnya seminimal mungkin. Halaman ini punya satu kolom, satu keluarga huruf, dan hampir tidak ada garis pembatas. Hierarki dibangun lewat **ukuran teks dan jarak vertikal**, bukan lewat kartu, bayangan, atau warna aksen. Kalau sebuah elemen baru butuh border atau background untuk terlihat, biasanya jaraknya yang kurang.

## Warna

Dasar gelap netral, tanpa hue. Satu-satunya warna jenuh di halaman ini adalah hijau GitHub di grafik kontribusi.

| Peran | Nilai | Dipakai di |
|---|---|---|
| Background | `#000` | `body` |
| Teks utama | `#e7e7e7` (token `paper`) | seluruh copy |
| Teks sekunder | `#8a8a8a` (token `muted`) | tanggal, label bulan/hari, total, legend |
| Permukaan naik | `#101010` → `#141414` → `#1a1a1a` → `#1f1f1f` | thumbnail, tombol lightbox, tombol tahun aktif, hover |
| Garis & ring | `#242424` → `#2a2a2a` → `#2f2f2f`; `#262626` untuk `.rule` | ring thumbnail, ring tombol |
| Underline link | `#4a4a4a`, menjadi `#e7e7e7` saat hover | `a.link` |
| Seleksi teks | background `#e7e7e7`, teks `#000` | `::selection` |

Skala kontribusi (persis milik GitHub, jangan diubah sebagian): `#161b22` · `#0e4429` · `#006d32` · `#26a641` · `#39d353`.

Token `ink` (`#0a0a0a`) terdaftar di `tailwind.config` tapi belum terpakai di mana pun.

**Aturan:** permukaan baru pilih dari tangga `#101010`–`#1f1f1f`, garis dari `#242424`–`#2f2f2f`. Jangan memperkenalkan warna aksen — hijau grafik adalah milik data, bukan milik UI.

## Tipografi

Inter (400/500/700) dengan fallback Helvetica → Arial. Hanya tiga bobot yang dipakai; jangan tambah bobot baru.

| Peran | Class | Ukuran |
|---|---|---|
| Judul halaman & section | `text-xl sm:text-2xl font-bold tracking-tight` | 20 → 24px |
| Sub-judul (perusahaan, judul item) | `text-lg sm:text-xl font-bold` | 18 → 20px |
| Body | `text-lg sm:text-xl leading-relaxed` | 18 → 20px |
| Meta (rentang tanggal) | `text-base sm:text-lg text-muted` | 16 → 18px |
| Mikro (total, legend, tombol tahun) | `text-[11px]` | 11px |
| Mikro grafik (label bulan/hari) | `text-[10px]` | 10px |

Body sengaja sebesar heading — pembeda antara keduanya adalah bobot dan jarak, bukan ukuran. Ini disengaja; jangan "perbaiki" dengan mengecilkan body.

**Panjang baris** dibatasi per konteks, bukan seragam: `62ch` untuk paragraf intro, `58ch` untuk deskripsi pengalaman dan project, `52ch` untuk daftar kontak. Teks baru harus ikut memilih salah satu dari ketiganya.

## Layout & ritme

- Container luar: `max-w-[1500px]`, padding `px-6 sm:px-10`.
- Kolom konten: `max-w-[700px] mx-auto` — center, dan semua konten hidup di dalamnya.
- Jarak antar section: `pt-16 sm:pt-24 lg:pt-28` untuk section pertama, `pt-20 sm:pt-28` untuk berikutnya. Jarak dipasang sebagai padding-top pada section, bukan margin-bottom.
- Ekor halaman: spacer kosong `h-24 sm:h-28` — tidak ada footer.
- Ritme internal naik bertahap: `mt-1` (meta menempel judulnya) → `mt-2` → `mt-5`/`mt-6` → `mt-8` (blok baru). Jarak antar item list: `space-y-8` untuk pengalaman, `space-y-14` untuk project yang punya galeri.

Daftar bernomor memakai `list-decimal` asli dengan `::marker` berwarna `muted`, `ml-6 pl-2` — nomor menggantung di luar kolom teks.

## Sudut & permukaan

Radius sangat kecil dan berjenjang menurut ukuran elemen: `2px` (sel grafik) · `3px` (tombol tahun) · `4px` (thumbnail, gambar lightbox, tombol Esc). Tidak ada bayangan di mana pun; kedalaman dinyatakan lewat ring 1px.

## Gerak

Hanya dua: `scroll-behavior: smooth` pada dokumen, dan `transition duration-300 group-hover:scale-[1.03]` pada thumbnail project. Perubahan state lain (tombol tahun, underline link) berganti tanpa transisi berdurasi khusus. Pertahankan kehematan ini.

## Perilaku responsif

Praktis hanya ada satu breakpoint yang penting: **`sm` (640px)**. Di bawahnya ukuran teks turun satu tingkat, galeri jadi 2 kolom (`sm:grid-cols-3` di atasnya), dan grafik kontribusi berganti mode.

Grafik kontribusi adalah kasus khusus yang perlu dipahami sebelum diutak-atik:

- **< 640px:** kolom dikunci 11px dan pembungkusnya `overflow-x-auto` — scroll horizontal, sama seperti GitHub.
- **≥ 640px:** kolom jadi `1fr` dan scroll dimatikan — grafik melebar penuh mengikuti kolom 700px, sekitar 10px per kotak.

Alasannya: 53 minggu tidak muat di layar HP tanpa mengecilkan kotak sampai ~4px. Aturan ini hidup di CSS ([index.html:39-47](index.html#L39-L47)), bukan di JavaScript.

## Status kosong & kegagalan

Halaman ini tidak pernah menampilkan pesan error ke pengunjung.

- **Gambar tidak ada** → otomatis diganti placeholder SVG gelap bertuliskan "project image", ukuran 800×600 dengan garis silang tipis. Layout tidak bergeser.
- **API kontribusi gagal** → seluruh blok grafik tetap tersembunyi. Section About tetap utuh, kontak langsung menyusul deskripsi.
- **Tanggal yang belum lewat** di tahun berjalan digambar sebagai kotak level 0 tanpa tooltip — jumlah kolom tetap konsisten antar tahun sehingga ukuran kotak tidak berubah saat berganti tahun.

## Aksesibilitas

Sudah ada: `lang="id"`, `alt` deskriptif per screenshot, `role="dialog"` + `aria-modal` + `aria-label` pada lightbox, `aria-pressed` pada tombol tahun, tooltip `title` per hari, dan Esc untuk menutup lightbox.

Yang belum, kalau mau ditingkatkan: tidak ada style `focus-visible` khusus (mengandalkan default browser di atas background hitam), lightbox tidak menahan fokus di dalamnya dan tidak mengembalikan fokus ke thumbnail asal saat ditutup, serta level warna grafik tidak punya alternatif non-visual selain tooltip.

## Menambah sesuatu yang baru

**Project baru** — duplikasi `<li>` di dalam `<ol class="list-num">` pada section Projects: judul `text-lg sm:text-xl font-bold`, deskripsi `mt-2 max-w-[58ch]`, lalu grid galeri `mt-5 grid-cols-2 sm:grid-cols-3 gap-3`. Setiap thumbnail adalah `<button class="js-shot">` berisi satu `<img>` — class itulah yang menyambungkannya ke lightbox.

**Section baru** — `<section id="…" class="pt-20 sm:pt-28">` dengan `<h2 class="text-xl sm:text-2xl font-bold tracking-tight">`, diletakkan di dalam kolom 700px. Tidak perlu garis pemisah; jaraknya sudah cukup sebagai pembatas.
