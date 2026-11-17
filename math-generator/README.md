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
