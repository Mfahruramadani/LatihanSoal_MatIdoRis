# Math Generator

Latihan matematika berbasis HTML, CSS, Vanilla JavaScript (ES Modules). Jalankan lewat server lokal: `python -m http.server 8000`, buka `http://localhost:8000`.

## Materi (13)
Operasi hitung, bilangan bulat, pecahan, mengurutkan pecahan, KPK, FPB, **desimal, persentase, pangkat dan akar, faktor/faktorisasi prima, pecahan campuran, pembulatan dan estimasi**, serta **kosakata bahasa Inggris** (arti kata per kata, dua arah).

## Menambah materi baru
1. Buat `assets/js/generators/nama.js` yang mengembalikan `{ prompt, answer, explanation, answerValue?, kind? }`.
2. Daftarkan di `TOPICS` pada `generator.js` (field `gen`, `title`, `description`, `subtypes`). Kartu beranda dibuat otomatis.

## Format jawaban
Desimal: `3,5` atau `3.5`. Pecahan: `3/4`. Campuran: `2 3/4`. Urutan: `1/3, 1/2, 3/4` (dinilai berdasarkan nilai). Faktorisasi: `2 × 2 × 3`, `2x2x3`, atau `2^2*3`.

## Kosakata bahasa Inggris
Daftar kata ada di `generators/english.js` (format `"inggris|arti1/arti2"`, awalan `~` untuk kata kerja). Tambah kata cukup dengan menambah baris di `EASY`, `MEDIUM`, atau `HARD`. Arah Indonesia → Inggris otomatis menerima semua kata Inggris yang punya arti sama.

## v6: tiga kelompok materi
Beranda dikelompokkan: **Matematika**, **Bahasa Inggris**, **Bahasa Indonesia**. Materi baru: Perbandingan, Bilangan Negatif (soal cerita), Konversi Satuan, Aritmetika Sosial, Aljabar Dasar, English Practice, Bahasa Indonesia.
- Format soal: isian angka/teks dan **pilihan ganda** (generator mengembalikan `choices`, `kind: "choice"`).
- Hitung cepat: pilih *Batas waktu* di pengaturan latihan.
- Bank soal bahasa ada di `generators/english2.js` dan `generators/indonesian.js` (format `tingkat|soal|jawaban|salah1~salah2|pembahasan`); tambahkan baris baru untuk memperbanyak variasi.

## v7: Logika, Kecepatan Berpikir, Memori
- `generators/logic.js`, `speed.js`, `memory.js` (satu topik per kategori, submateri dipilih di pengaturan).
- Soal **bertimer**: field `timeLimit` (detik). Soal berganti otomatis saat waktu habis; tombol Sebelumnya disembunyikan (`noBack`).
- Soal **memori**: field `memorize: { content, seconds }`. Informasi ditampilkan lebih dulu, lalu disembunyikan sebelum pertanyaan muncul. Informasi ditampilkan kembali di halaman hasil.
- Topik dengan `single: true` otomatis memakai mode satu soal per tampilan.
- Jawaban urutan (`kind: "seq"`) boleh ditulis dengan atau tanpa spasi.

## Perubahan v8: soal baru terus

- **Anti-duplikat antar-sesi.** Soal yang pernah keluar dicatat (hash saja) di `localStorage` per jenis latihan dan tidak muncul lagi sampai seluruh soal berbeda terpakai, lalu putaran baru dimulai. Tombol "Hapus riwayat" juga mereset catatan ini.
- **Tanda pengenal soal = prompt + jawaban** (atau `key` bila diisi generator). Sebelumnya hanya prompt, sehingga soal pilihan ganda dengan kalimat tetap dianggap kembar.
- **Tidak ada duplikat dalam satu sesi.** Bila soal berbeda tidak cukup, jumlah soal dikurangi dan pengguna diberi tahu.
- **Petunjuk jumlah soal berbeda** ditampilkan di halaman pengaturan (perkiraan statistik).
- Generator bahasa dan logika kini berbasis template (nama, tempat, kata, kalimat dikombinasikan) dengan bank soal lebih besar; rentang angka pada generator matematika dilebarkan.
- Bug diperbaiki: kata baku hanya 2 pilihan, perbandingan pangkat dengan dua sisi sama (`4² atau 4²`), kontraposisi yang mengecilkan huruf nama, distraktor "buss/likeing", dan pilihan "the" yang juga benar.
- Alat ukur: `node tools/measure-pool.mjs` melaporkan jumlah soal berbeda per materi/submateri/kesulitan serta memeriksa kualitas pilihan dan penilaian jawaban.

## Sistem progres: XP, Level, Title, Gemcrys

- **XP per sesi** (hanya setelah sesi diperiksa/selesai, termasuk waktu habis): +5 per soal dijawab, +5 per jawaban benar, +20 bila semua soal dijawab, dan satu bonus akurasi (80–99% = +30, 100% = +50, tidak ditumpuk). Soal kosong tidak memberi XP. Akurasi dihitung dari seluruh soal sesi.
- **Level** dari total XP kumulatif: `XP(L) = 25 × (L × (L + 1) − 2)`. **Title**: Novice 1–5, Apprentice 6–10, Scholar 11–20, Expert 21–35, Master 36–50, Grandmaster 51+.
- **Gemcrys**: +10 tiap level yang dicapai (level 1 tidak), sekali per level; naik beberapa level sekaligus dihitung semuanya.
- **Penyimpanan**: `localStorage` kunci `mentallab-progress-v1` (xp, level, gemcrys, level terklaim, ID sesi yang sudah dapat reward). Level selalu dihitung ulang dari total XP.
- **Anti-ganda**: tiap sesi punya ID unik; reward hanya sekali per ID (klik ganda, refresh, atau membuka ulang hasil tidak menambah). "Hapus riwayat" hanya menghapus riwayat latihan, bukan progres.
- **Kode**: `assets/js/progress.js` (logika), `assets/js/progress-ui.js` (tampilan), terhubung di `finishPractice()` dan `beginSession()` pada `app.js`.
- **Pengujian**: `node --test tools/progress.test.mjs` (logika) dan, setelah `npm i jsdom`, `node tools/integration.harness.mjs main` lalu `... reload` (alur aplikasi nyata).
