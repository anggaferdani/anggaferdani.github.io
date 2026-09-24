# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Catatan bahasa: copy halaman dan komentar kode ditulis dalam bahasa Indonesia. Ikuti konvensi itu saat menambah teks atau komentar baru.

## Bentuk proyek

Situs portofolio statis satu halaman untuk Angga Ferdani. **Seluruh aplikasi ada di [index.html](index.html)** — markup, konfigurasi Tailwind, CSS custom, dan semua JavaScript berada dalam satu file. Tidak ada `package.json`, build step, dependency lokal, linter, maupun test.

```
index.html            seluruh situs (markup + <style> + <script>)
assets/projects/      screenshot project: quiz-1.jpg … quiz-6.jpg
```

## Menjalankan

Tidak ada build. Buka file-nya langsung:

```powershell
start index.html
```

`file://` berfungsi penuh — API contribution graph mengirim `Access-Control-Allow-Origin: *`, jadi fetch-nya tetap jalan tanpa server. Kalau butuh origin HTTP:

```powershell
python -m http.server 8000
```

Cek cepat sintaks kedua inline script tanpa membuka browser:

```powershell
node -e "const h=require('fs').readFileSync('index.html','utf8');[...h.matchAll(/<script(\b[^>]*)>([\s\S]*?)<\/script>/g)].forEach((m,i)=>{if(/\bsrc=/.test(m[1]))return;if(/importmap/.test(m[1])){try{JSON.parse(m[2]);console.log(i,'importmap OK')}catch(e){console.log(i,'importmap FAIL',e.message)}return}try{new Function(m[2].replace(/^\s*import[\s\S]*?;\s*$/gm,''));console.log(i,'OK')}catch(e){console.log(i,'FAIL',e.message)}})"
```

## Arsitektur

### Tailwind lewat CDN (runtime, bukan build)

`<script src="https://cdn.tailwindcss.com">` mengompilasi class di browser dan mengamati perubahan DOM, sehingga class yang dibuat JavaScript (tombol tahun, sel grafik) tetap dapat style. Konsekuensinya:

- Token tema custom (`ink`, `paper`, `muted`) didefinisikan di `tailwind.config` inline di [index.html:13-20](index.html#L13-L20), bukan di file config terpisah.
- Kalau suatu saat pindah ke Tailwind hasil build, class dinamis di JS (`BTN_ON`/`BTN_OFF`, `aspect-square w-full rounded-[2px]`) **tidak akan ter-generate** tanpa safelist.

### Kontrak layout

Dua container bersarang di [index.html:56-57](index.html#L56-L57): pembungkus luar `max-w-[1500px]` memegang padding tepi, kolom dalam `max-w-[700px] mx-auto` memegang semua konten. Section baru masuk ke dalam kolom dalam ini, jangan bikin container sendiri.

### GitHub contribution graph

Bagian paling berlapis di file ini — logikanya di [index.html:203-322](index.html#L203-L322), geometrinya di CSS [index.html:39-47](index.html#L39-L47).

- **Sumber data:** `github-contributions-api.jogruber.de/v4/<user>?y=all` (publik, tanpa token). Username diambil dari atribut `data-user` pada `#gh`, bukan hardcode di JS.
- **Satu request untuk semua tahun.** Respons dikelompokkan ke `byYear`, tombol tahun dibuat dari key-nya, dan `draw(year)` menggambar ulang dari memori — ganti tahun tidak memicu fetch baru.
- **Fail-closed.** `#gh` mulai dengan class `hidden` dan baru dibuka setelah fetch sukses. Kalau API mati atau offline, blok itu tetap tersembunyi, tanpa pesan error. Artinya ada jeda ~1,2 detik sebelum grafik muncul.
- **Pembagian tanggung jawab ukuran:** CSS yang menentukan lebar kolom — 11px + scroll horizontal di bawah 640px, `1fr` penuh di `sm` ke atas. JS hanya memberi sel class `aspect-square w-full` supaya tingginya mengikuti lebar. **Jangan set lebar sel dari JavaScript**; aturan `#gh-grid > span` di CSS-lah yang harus diubah kalau geometri mau diganti.
- **Tanggal ke depan** di tahun berjalan tetap digambar sebagai kotak level 0 (agar jumlah kolom konstan antar tahun) tapi tanpa tooltip, dan tidak ikut dihitung di total.

### Galeri project

- Nama file mengikuti pola `assets/projects/<slug-project><nnnn>.<ext>`, misal `empatpilarmpr0001.jpg`, `holomoc0001.png`. Besar-kecil huruf ekstensi harus persis sama dengan nama di disk (`empatpilarmpr0006.JPG` huruf besar) — hosting Linux membedakannya, Windows tidak, jadi salah ketik case tidak akan ketahuan saat dites lokal.
- **Gambar ditampilkan utuh, tanpa crop.** `<img class="js-shot w-full">` polos: tidak ada `aspect-*`, tidak ada `object-cover`, tinggi mengikuti rasio asli file. Konsekuensinya rasio gambar sumber langsung menentukan tampilan — screenshot yang lebih sempit dari 700px akan diperbesar dan pecah.
- **Video dan model 3D dibungkus `.shot-frame`,** dan border putih menempel di pembungkus itu, bukan di elemen medianya. Tinggi elemen video dihitung dari rasio sumber dan sering jatuh di pecahan piksel, sehingga border 1px sisi bawah bisa hilang saat dibulatkan browser. `dropShot()` membuang `.shot-frame` sekalian supaya tidak menyisakan bingkai kosong.
- Video memakai `preload="metadata"` (bukan autoplay) dan model `.glb` memakai `loading="lazy"` — file 4–10 MB itu tidak ikut terunduh saat halaman dibuka.
- Preview 3D memakai **three.js yang di-vendor lokal** di `assets/vendor/three/` (three.module.min.js + `jsm/loaders/GLTFLoader.js` + `jsm/utils/BufferGeometryUtils.js` — GLTFLoader mengimpor yang terakhir secara relatif, jadi struktur foldernya tidak boleh diratakan). Specifier `three` dan `three/addons/` dipetakan lewat `<script type="importmap">` di `<head>`, yang **harus** berada sebelum module script mana pun.
- **Preview 3D sengaja tanpa OrbitControls.** Begitu kontrol dipasang, three.js menangkap event `wheel` di atas canvas dan halaman berhenti bisa di-scroll saat kursor melewatinya. Model hanya berputar sendiri; canvas-nya inert.
- Model `.glb` dimuat lewat `fetch`, jadi **tidak jalan di `file://`** (CORS memblokir fetch dari origin file). Untuk mengetes preview 3D wajib lewat `python -m http.server`. Gambar dan video tetap tampil di `file://` karena tidak memakai `fetch`.
- Jumlah kolom grid mengikuti jumlah gambar: 1 gambar → `grid-cols-1` (lebar penuh), 2 gambar → `grid-cols-2`, 3 atau lebih → `grid-cols-3`. Tidak ada varian per-breakpoint — angkanya sama di mobile dan desktop. Kalau menambah/menghapus gambar, sesuaikan juga angka kolomnya.
- **`items-start` wajib ada** di tiap grid — tanpa itu `align-items: stretch` merentang `<img>` setinggi barisnya dan gambar jadi gepeng.
- Gambar yang gagal dimuat **dihapus dari DOM** ([index.html:349-355](index.html#L349-L355)), jadi galeri hanya berisi file yang benar-benar ada. Konsekuensinya path salah ketik hilang tanpa jejak — tidak ada gambar rusak, tapi juga tidak ada tanda bahwa gambar itu pernah ada.
- Tidak ada lightbox/pratinjau. Class `.js-shot` sekarang menempel langsung di `<img>`, bukan di tombol pembungkus.

## Saat mengubah

- Elemen JS-driven dicari lewat ID (`gh`, `gh-grid`, `gh-months`, `gh-years`, `gh-total`, `lightbox`, `lightbox-img`, `lightbox-close`) dan class `.js-shot`. Mengganti nama salah satunya berarti harus menyesuaikan skrip di bawah.
- Ukuran/warna kotak grafik hidup di tiga tempat yang harus konsisten: array `LEVELS` di JS, swatch legend di [index.html:96-100](index.html#L96-L100), dan aturan CSS `#gh-grid`.
- Setelah mengedit markup, cek keseimbangan tag sebelum menganggap selesai — file ini sudah cukup dalam nesting-nya.

## Impor konfigurasi agent lain

Terdeteksi ada `~/.codex/` dan `~/.gemini/` di mesin ini. Kalau mau memindahkan MCP server, slash command, subagent, atau instruksi dari sana ke Claude Code, balas `/import` untuk melihat daftar yang bisa diimpor, lalu `/import --yes=<digest>` untuk menerapkannya.
