import { choose, shuffle, mc, bank, pickBank, mcItem } from "../utils.js";

const LV = d => ({ easy: [1], medium: [1, 2], hard: [2, 3] }[d] || [1, 2, 3]);
const NAMA = ["Ani", "Budi", "Citra", "Dedi", "Eka", "Fajar", "Gita", "Hadi", "Indah", "Joko", "Rina", "Tono"];
const TEMPAT = ["rumah", "pasar", "sekolah", "kantor", "taman", "dapur", "toko", "perpustakaan", "lapangan", "stasiun", "kebun", "masjid"];
const KOTA = ["Bali", "Medan", "Bandung", "Surabaya", "Makassar", "Banjarmasin", "Yogyakarta", "Palembang", "Manado", "Semarang"];
const BULAN = ["Januari", "Maret", "Mei", "Juli", "Agustus", "September", "November", "Desember"];
const HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const BARANG = ["apel", "jeruk", "mangga", "roti", "buku", "pensil", "tas", "sepatu", "kue", "susu", "telur", "pisang"];

/* ---------- Sinonim dan antonim (kata, sinonim, antonim, tingkat) ---------- */
const SYN = [
  ["indah", "cantik", "jelek", 1], ["pintar", "cerdas", "bodoh", 1], ["rajin", "tekun", "malas", 1], ["cepat", "lekas", "lambat", 1], ["gembira", "senang", "sedih", 1],
  ["besar", "raya", "kecil", 1], ["tinggi", "jangkung", "rendah", 1], ["bersih", "suci", "kotor", 1], ["kuat", "perkasa", "lemah", 1], ["berani", "gagah", "takut", 1],
  ["ramai", "riuh", "sepi", 1], ["murah", "terjangkau", "mahal", 1], ["mudah", "gampang", "sukar", 1], ["jujur", "lurus", "curang", 1], ["sehat", "bugar", "sakit", 1],
  ["rapi", "teratur", "berantakan", 1], ["marah", "geram", "sabar", 1], ["dekat", "karib", "jauh", 1], ["terang", "benderang", "gelap", 1], ["baru", "mutakhir", "lama", 1],
  ["hemat", "irit", "boros", 2], ["dermawan", "murah hati", "kikir", 2], ["bijaksana", "arif", "gegabah", 2], ["kukuh", "kokoh", "rapuh", 2], ["tenang", "damai", "gelisah", 2],
  ["sopan", "santun", "kurang ajar", 2], ["ramah", "bersahabat", "ketus", 2], ["lengkap", "komplet", "kurang", 2], ["cemas", "khawatir", "tenteram", 2], ["pandai", "mahir", "canggung", 2],
  ["gigih", "ulet", "lekas menyerah", 2], ["fasih", "lancar", "gagap", 2], ["tulus", "ikhlas", "pura-pura", 2], ["sejahtera", "makmur", "melarat", 2], ["asli", "murni", "palsu", 2],
  ["hening", "senyap", "bising", 2], ["ceria", "riang", "murung", 2], ["bimbang", "ragu", "yakin", 2], ["luas", "lapang", "sempit", 2], ["akrab", "intim", "asing", 2],
  ["abadi", "kekal", "fana", 3], ["lugas", "terus terang", "bertele-tele", 3], ["mutakhir", "terkini", "usang", 3], ["ambigu", "bermakna ganda", "jelas", 3], ["efisien", "tepat guna", "boros waktu", 3],
  ["optimis", "penuh harapan", "pesimis", 3], ["kontradiksi", "pertentangan", "kesesuaian", 3], ["arogan", "sombong", "rendah hati", 3], ["frustrasi", "putus asa", "bersemangat", 3], ["inovatif", "pembaru", "konvensional", 3],
  ["spontan", "serta-merta", "terencana", 3], ["transparan", "terbuka", "tertutup", 3], ["konsisten", "taat asas", "plin-plan", 3], ["relevan", "bersangkut paut", "tidak berkaitan", 3], ["ironis", "bertolak belakang", "wajar", 3],
  ["kompleks", "rumit", "sederhana", 3], ["akurat", "cermat", "keliru", 3], ["eksplisit", "tersurat", "tersirat", 3], ["superior", "unggul", "inferior", 3], ["moderat", "sedang", "ekstrem", 3]
];
function synant(d) {
  const e = choose(SYN.filter(x => LV(d).includes(x[3]))), syn = Math.random() < .5;
  const wrong = shuffle(SYN.filter(o => o !== e).flatMap(o => [o[1], o[2]]).filter(x => x !== e[1] && x !== e[2]));
  return mc(`Pilih ${syn ? "sinonim (persamaan kata)" : "antonim (lawan kata)"} dari kata “${e[0]}”.`, syn ? e[1] : e[2], wrong,
    `${e[0]} bersinonim dengan ${e[1]} dan berantonim dengan ${e[2]}.`);
}

/* ---------- Kata baku (baku, tidak baku, tingkat) ---------- */
const BAKU = [
  ["silakan", "silahkan", 1], ["nasihat", "nasehat", 1], ["risiko", "resiko", 1], ["jadwal", "jadual", 1], ["izin", "ijin", 1], ["praktik", "praktek", 1], ["teknik", "tehnik", 1],
  ["antre", "antri", 1], ["apotek", "apotik", 1], ["analisis", "analisa", 1], ["aktivitas", "aktifitas", 1], ["cokelat", "coklat", 1], ["kaus", "kaos", 1], ["bus", "bis", 1],
  ["sekadar", "sekedar", 2], ["napas", "nafas", 2], ["kuitansi", "kwitansi", 2], ["andal", "handal", 2], ["Jumat", "Jum'at", 2], ["provinsi", "propinsi", 2], ["objek", "obyek", 2],
  ["sistem", "sistim", 2], ["hipotesis", "hipotesa", 2], ["ijazah", "ijasah", 2], ["teknologi", "tehnologi", 2], ["mengubah", "merubah", 2], ["berpikir", "berfikir", 2], ["paham", "faham", 2],
  ["terampil", "trampil", 2], ["salat", "shalat", 2], ["azan", "adzan", 2], ["kaus kaki", "kaos kaki", 2], ["gubuk", "gubug", 2], ["subjek", "subyek", 2], ["detail", "detil", 2],
  ["hakikat", "hakekat", 3], ["konkret", "konkrit", 3], ["hierarki", "hirarki", 3], ["atlet", "atlit", 3], ["kualitas", "kwalitas", 3], ["frekuensi", "frekwensi", 3], ["kuantitas", "kwantitas", 3],
  ["konsekuen", "konsekwen", 3], ["November", "Nopember", 3], ["Februari", "Pebruari", 3], ["sanksi", "sangsi", 3], ["tobat", "taubat", 3], ["khotbah", "kotbah", 3], ["Ramadan", "Ramadhan", 3],
  ["metode", "metoda", 3], ["persentase", "prosentase", 3], ["ekstrem", "ekstrim", 3], ["komplet", "komplit", 3], ["konferensi", "konperensi", 3], ["lembap", "lembab", 3], ["variabel", "variable", 3]
];
function baku(d) {
  const e = choose(BAKU.filter(x => LV(d).includes(x[2]))), others = shuffle(BAKU.filter(o => o !== e));
  if (Math.random() < .5) // pilih bentuk baku dari kata tidak baku
    return mc(`Bentuk baku dari kata “${e[1]}” adalah ...`, e[0], others.slice(0, 3).map(o => o[0]), `Bentuk baku menurut KBBI adalah “${e[0]}”, bukan “${e[1]}”.`);
  return mc(`Manakah kata yang TIDAK baku?`, e[1], others.slice(0, 3).map(o => o[0]), `“${e[1]}” tidak baku. Bentuk bakunya adalah “${e[0]}”.`);
}

/* ---------- Makna kata ---------- */
const MEANING = bank([
  "1|Arti kata “hemat” adalah ...|tidak boros|mahal~besar~cepat|Hemat berarti cermat dalam memakai uang atau barang.",
  "1|Arti kata “gembira” adalah ...|senang|marah~takut~lelah|Gembira = senang hati.",
  "1|Arti kata “bersih” adalah ...|tidak kotor|berat~banyak~jauh|Bersih = bebas dari kotoran.",
  "1|Arti kata “rajin” adalah ...|giat bekerja atau belajar|suka tidur~mudah marah~sangat lapar|Rajin = tekun dan giat.",
  "1|Arti kata “jujur” adalah ...|berkata sesuai kenyataan|suka berbohong~sering terlambat~mudah menangis|Jujur = lurus hati, tidak berbohong.",
  "1|Arti kata “bahagia” adalah ...|merasa senang dan tenteram|merasa lapar~merasa takut~merasa bingung|Bahagia = keadaan senang dan tenteram.",
  "1|Arti kata “pagi” adalah ...|waktu setelah matahari terbit|waktu matahari terbenam~waktu tengah malam~waktu istirahat siang|Pagi = bagian awal hari.",
  "1|Arti kata “petani” adalah ...|orang yang bercocok tanam|orang yang menjual kain~orang yang mengajar~orang yang mengobati|Petani = orang yang bekerja di bidang pertanian.",
  "1|Arti kata “perpustakaan” adalah ...|tempat menyimpan dan membaca buku|tempat menjual sayur~tempat berolahraga~tempat menonton film|Perpustakaan = tempat koleksi buku untuk dibaca.",
  "1|Arti kata “lelah” adalah ...|capek|segar~riang~kuat|Lelah = capek karena bekerja.",
  "1|Arti kata “tamu” adalah ...|orang yang berkunjung|pemilik rumah~penjaga~penjual|Tamu = orang yang datang berkunjung.",
  "1|Arti kata “gemuk” adalah ...|berbadan berisi|berbadan tinggi~berbadan kecil~berbadan kurus|Gemuk = banyak dagingnya.",
  "1|Arti kata “cerdas” adalah ...|pandai berpikir|sering tertawa~pandai menyanyi~cepat berlari|Cerdas = pandai dan tajam pikiran.",
  "1|Arti kata “sunyi” adalah ...|sepi tidak ada suara|sangat ramai~sangat terang~sangat panas|Sunyi = sepi.",
  "1|Arti kata “pelan” adalah ...|tidak cepat|sangat keras~sangat besar~sangat tinggi|Pelan = lambat.",
  "1|Arti kata “jarak” adalah ...|panjang antara dua tempat|waktu belajar~berat benda~luas ruangan|Jarak = ruang antara dua tempat.",
  "1|Arti kata “berani” adalah ...|tidak takut menghadapi bahaya|mudah menangis~suka menyendiri~malas bergerak|Berani = tidak gentar.",
  "1|Arti kata “bohong” adalah ...|berkata tidak sesuai kenyataan|berkata jujur~berkata pelan~berkata sopan|Bohong = tidak benar atau dusta.",
  "1|Arti kata “tangkas” adalah ...|cekatan|lamban~malas~ragu|Tangkas = gesit dan cekatan.",
  "1|Arti kata “pemalu” adalah ...|mudah merasa malu|suka bergurau~suka marah~suka berlari|Pemalu = mudah malu.",
  "1|Arti kata “dingin” adalah ...|bersuhu rendah|bersuhu tinggi~berwarna gelap~berbunyi keras|Dingin = suhunya rendah.",
  "1|Arti kata “kenyang” adalah ...|sudah cukup makan|sangat haus~sangat lelah~sangat takut|Kenyang = perut sudah penuh.",
  "1|Arti kata “bijak” adalah ...|pandai dan hati-hati dalam bertindak|suka berlari~mudah marah~suka mengeluh|Bijak = arif dalam bertindak.",
  "1|Arti kata “dekat” adalah ...|tidak jauh|sangat tinggi~sangat lama~sangat berat|Dekat = jaraknya tidak jauh.",
  "1|Arti kata “ramai” adalah ...|banyak orang atau suara|tidak ada orang~sangat gelap~sangat dingin|Ramai = banyak orang atau bunyi.",
  "1|Arti kata “bunga” pada “Taman itu penuh bunga” adalah ...|kembang tumbuhan|imbalan uang~gadis desa~hiasan emas|Dalam konteks taman, bunga = kembang.",
  "2|Pada kalimat “Bunga bank bulan ini naik”, makna kata bunga adalah ...|imbalan atas uang simpanan/pinjaman|kembang tanaman~gadis cantik~hiasan meja|Dalam konteks perbankan, bunga adalah imbalan jasa uang.",
  "2|Pada kalimat “Kami duduk di kaki gunung”, makna kata kaki adalah ...|bagian bawah|anggota badan untuk berjalan~penopang meja~satuan panjang|Kaki gunung = bagian terbawah gunung.",
  "2|Pada kalimat “Kepala sekolah memberi sambutan”, makna kata kepala adalah ...|pemimpin|bagian tubuh atas~bagian depan surat~ujung benda|Kepala sekolah = pemimpin sekolah.",
  "2|Pada kalimat “Ayah membeli buku tulis lima buah”, kata buah berfungsi sebagai ...|kata penggolong benda|nama tumbuhan~kata sifat~kata kerja|Buah di sini penggolong untuk benda.",
  "2|Pada kalimat “Ia tidak dapat menahan hati”, makna kata hati adalah ...|perasaan|organ tubuh~bagian tengah~ujung jari|Hati dalam kalimat ini berarti perasaan.",
  "2|Pada kalimat “Rumah itu dijual dengan harga tinggi”, kata tinggi bermakna ...|mahal|panjang ke atas~jauh~berat|Harga tinggi = mahal.",
  "2|Pada kalimat “Kakek sudah tua tetapi masih segar”, kata segar bermakna ...|sehat dan bugar|baru dipetik~dingin~basah|Segar pada orang berarti sehat dan bugar.",
  "2|Pada kalimat “Ibu menyimpan uang di bank”, makna kata menyimpan adalah ...|menaruh agar aman|membuang~meminjamkan~menghabiskan|Menyimpan = menaruh agar tidak hilang.",
  "2|Pada kalimat “Mata pelajaran favoritku adalah IPA”, makna kata mata adalah ...|bagian atau jenis|alat penglihat~titik~tajam|Mata pelajaran = jenis pelajaran.",
  "2|Pada kalimat “Ia menjadi tulang punggung keluarga”, makna tulang punggung adalah ...|penopang utama|bagian tubuh belakang~orang sakit~anggota termuda|Tulang punggung = orang yang menjadi tumpuan.",
  "2|Pada kalimat “Mereka bersikap lunak terhadap pelanggar”, kata lunak bermakna ...|tidak keras atau tegas|empuk~lembek seperti bubur~mudah rusak|Lunak dalam sikap = tidak tegas.",
  "2|Pada kalimat “Pemuda itu berhati batu”, makna ungkapan berhati batu adalah ...|tidak punya belas kasihan|bertenaga besar~suka mengumpulkan batu~berbadan keras|Berhati batu = tidak berperasaan.",
  "2|Pada kalimat “Adik pulang dengan tangan hampa”, makna tangan hampa adalah ...|tidak membawa apa-apa|tangan kosong tanpa sarung~tangan terluka~tangan kotor|Tangan hampa = tidak membawa hasil.",
  "2|Kata “menanggapi” pada “Wali kelas menanggapi pertanyaan siswa” berarti ...|memberi reaksi atau jawaban|menolak mentah-mentah~melupakan~mengulang-ulang|Menanggapi = memberi respons.",
  "2|Makna kata “pustaka” dalam “Pustaka itu menyimpan naskah kuno” adalah ...|kumpulan buku atau naskah|alat tulis~ruang olahraga~toko makanan|Pustaka = kitab atau buku.",
  "3|Makna ungkapan “naik daun” adalah ...|sedang terkenal|memanjat pohon~sedang sakit~sedang bepergian|Naik daun = sedang populer.",
  "3|Makna ungkapan “panjang tangan” adalah ...|suka mencuri|suka menolong~rajin bekerja~bertubuh tinggi|Panjang tangan = suka mencuri.",
  "3|Makna kata “lestari” pada “Hutan harus dijaga agar tetap lestari” adalah ...|tetap seperti keadaan semula|cepat berubah~mudah rusak~sangat luas|Lestari = tetap dan tidak berubah.",
  "3|Makna ungkapan “kambing hitam” adalah ...|orang yang dipersalahkan|hewan peliharaan~orang pemberani~barang berharga|Kambing hitam = pihak yang disalahkan.",
  "3|Makna ungkapan “besar kepala” adalah ...|sombong|berkepala besar~pandai~pemarah|Besar kepala = sombong.",
  "3|Makna ungkapan “buah bibir” adalah ...|bahan pembicaraan orang|makanan manis~hadiah ulang tahun~obat sariawan|Buah bibir = sesuatu yang banyak dibicarakan.",
  "3|Makna ungkapan “gulung tikar” adalah ...|bangkrut|pindah rumah~membersihkan lantai~berkemah|Gulung tikar = usaha berhenti karena rugi.",
  "3|Makna ungkapan “ringan tangan” adalah ...|suka membantu|suka memukul bola~tangannya sakit~tangannya kecil|Ringan tangan bisa berarti suka menolong.",
  "3|Makna ungkapan “banting tulang” adalah ...|bekerja keras|patah tulang~berolahraga berat~membuang barang|Banting tulang = bekerja keras.",
  "3|Makna ungkapan “cuci mata” adalah ...|berjalan-jalan melihat hal menarik|membersihkan mata~tidur siang~membasuh wajah|Cuci mata = melihat-lihat untuk hiburan.",
  "3|Makna ungkapan “angkat tangan” adalah ...|menyerah tidak sanggup|mengajukan diri~melambai~melempar bola|Angkat tangan = menyerah.",
  "3|Makna kata “eksploitasi” adalah ...|pemanfaatan secara berlebihan|penyimpanan hasil~penelitian ilmiah~penjagaan hutan|Eksploitasi = pengusahaan berlebihan demi keuntungan.",
  "3|Makna kata “kontras” dalam “warna bajunya kontras dengan dinding” adalah ...|sangat berbeda|sangat mirip~sangat cerah~sangat kusam|Kontras = perbedaan yang mencolok.",
  "3|Makna kata “prioritas” adalah ...|hal yang didahulukan|hal yang terakhir~hal yang dilupakan~hal yang ditolak|Prioritas = yang diutamakan."
]);

/* ---------- Ejaan dan tanda baca (dibangkitkan dari template) ---------- */
function ejaan(d) {
  const lv = choose(LV(d)), who = choose(NAMA);
  if (lv === 1) {
    const t = choose(["list", "kapital", "tanya", "nama"]);
    if (t === "list") { const [a, b, c] = shuffle(BARANG).slice(0, 3);
      return mc(`Pilih kalimat yang tanda bacanya benar.`, `${who} membeli ${a}, ${b}, dan ${c}.`, [`${who} membeli ${a} ${b}, dan ${c}.`, `${who}, membeli ${a} ${b} dan ${c}.`, `${who} membeli, ${a}, ${b} dan, ${c}.`], "Unsur pemerincian dipisahkan tanda koma; sebelum “dan” pada unsur terakhir ada koma.", 2); }
    if (t === "kapital") { const k = choose(KOTA), m = choose(BULAN);
      return mc(`Pilih kalimat dengan huruf kapital yang benar.`, `Kami berlibur ke ${k} pada bulan ${m}.`, [`kami berlibur ke ${k.toLowerCase()} pada bulan ${m.toLowerCase()}.`, `Kami berlibur ke ${k.toLowerCase()} pada bulan ${m}.`, `Kami berlibur ke ${k} pada Bulan ${m.toLowerCase()}.`], "Awal kalimat, nama tempat, dan nama bulan diawali huruf kapital."); }
    if (t === "tanya") { const q = choose(["Kapan kamu berangkat", "Siapa namamu", "Di mana rumahmu", "Apa kabarmu", "Mengapa kamu terlambat", "Berapa harga buku ini"]);
      return mc(`Pilih kalimat langsung yang benar.`, `“${q}?” tanya ${who}.`, [`“${q}.” tanya ${who}.`, `“${q}?”, tanya ${who}.`, `“${q}?” Tanya ${who}.`], "Kalimat tanya dalam petikan diakhiri tanda tanya; keterangan sesudahnya diawali huruf kecil."); }
    const h = choose(HARI), k = choose(KOTA);
    return mc(`Pilih kalimat dengan penulisan nama yang benar.`, `Pada hari ${h}, ${who} berangkat ke ${k}.`, [`Pada hari ${h.toLowerCase()}, ${who} berangkat ke ${k}.`, `Pada hari ${h}, ${who.toLowerCase()} berangkat ke ${k}.`, `pada hari ${h}, ${who} berangkat ke ${k}.`], "Nama hari, nama orang, dan nama kota diawali huruf kapital.");
  }
  if (lv === 2) {
    const t = choose(["depan", "di-", "ke", "petik"]), p = choose(TEMPAT);
    if (t === "depan") { const v = choose(["makan", "belajar", "bermain", "membaca"]);
      return mc(`Pilih penulisan kata depan yang benar.`, `${who} ${v} di ${p}.`, [`${who} ${v} di${p}.`, `${who} ${v} di-${p}.`, `${who} ${v} dI ${p}.`], "Kata depan di ditulis terpisah dari kata yang mengikutinya."); }
    if (t === "di-") { const v = choose([["dibaca", "baca", "Buku"], ["dimakan", "makan", "Kue"], ["ditulis", "tulis", "Surat"], ["dicuci", "cuci", "Baju"]]);
      return mc(`Pilih penulisan yang benar.`, `${v[2]} itu ${v[0]} oleh ${who}.`, [`${v[2]} itu di ${v[1]} oleh ${who}.`, `${v[2]} itu di-${v[1]} oleh ${who}.`, `${v[2]} itu ${v[0]}, oleh ${who}.`], "Awalan di- pada kata kerja ditulis serangkai."); }
    if (t === "ke") return mc(`Pilih penulisan kata depan yang benar.`, `${who} pergi ke ${p} sore ini.`, [`${who} pergi ke${p} sore ini.`, `${who} pergi ke-${p} sore ini.`, `${who} pergi keh ${p} sore ini.`], "Kata depan ke ditulis terpisah dari kata tempat.");
    const q = choose(["Aku akan datang besok", "Tolong tutup pintunya", "Jangan lupa membawa buku", "Hari ini kita belajar bersama"]);
    return mc(`Pilih penulisan kalimat langsung yang benar.`, `${who} berkata, “${q}.”`, [`${who} berkata “${q}”.`, `${who} berkata “${q.toLowerCase()}”`, `${who} berkata. “${q}.”`], "Kalimat langsung didahului koma dan kutipan diawali huruf kapital; tanda baca akhir berada di dalam tanda petik.");
  }
  const t = choose(["anak", "sapaan", "singkatan", "angka"]), h = choose(HARI), a = choose(BARANG);
  if (t === "anak") return mc(`Pilih kalimat dengan ejaan dan tanda baca yang benar.`, `Setiap hari ${h}, kami mengikuti upacara bendera.`, [`Setiap hari ${h.toLowerCase()} kami mengikuti upacara bendera.`, `Setiap hari ${h} kami, mengikuti upacara bendera.`, `setiap hari ${h}, kami mengikuti upacara bendera`], "Nama hari berhuruf kapital; anak kalimat di awal diikuti koma.");
  if (t === "sapaan") return mc(`Pilih penulisan yang benar.`, `Kata Bapak, “Hari ini kita pergi ke ${choose(KOTA)}.”`, [`Kata bapak, “Hari ini kita pergi ke ${choose(KOTA)}.”`, `Kata Bapak “hari ini kita pergi.”`, `Kata Bapak, hari ini kita pergi.”`], "Sapaan seperti Bapak berhuruf kapital bila dipakai sebagai kata ganti sapaan; kutipan langsung diawali kapital.");
  if (t === "singkatan") { const s = choose([["Dr.", "dokter"], ["Prof.", "profesor"], ["S.Pd.", "sarjana pendidikan"], ["Ir.", "insinyur"]]);
    return mc(`Penulisan gelar yang benar adalah ...`, `${s[0]}`, [s[0].replace(/\./g, ""), s[0].replace(".", ".."), s[0].toLowerCase()], `${s[0]} = singkatan gelar ${s[1]}, ditulis dengan titik dan huruf kapital sesuai kaidah.`); }
  const n = choose([3, 5, 12, 20]);
  return mc(`Penulisan yang benar untuk kalimat berikut adalah ...`, `Ibu membeli ${n} ${a} di pasar.`, [`Ibu membeli ${n} ${a} dipasar.`, `Ibu membeli ${n}${a} di pasar.`, `Ibu membeli ${n} ${a} di-pasar.`], "Kata depan di ditulis terpisah; angka dan kata benda dipisahkan spasi.");
}

/* ---------- Tata bahasa (template + bank) ---------- */
const PREP = [["tinggal", "di", 1], ["pergi", "ke", 1], ["berasal", "dari", 1], ["tiba", "di", 1], ["menuju", "ke", 1], ["pulang", "ke", 1], ["bermain", "di", 1], ["datang", "dari", 1], ["bekerja", "di", 1], ["berangkat", "dari", 1]];
const ACT = [["baca", "membaca", "koran"], ["tulis", "menulis", "surat"], ["masak", "memasak", "nasi"], ["cuci", "mencuci", "piring"], ["beli", "membeli", "sayur"], ["jual", "menjual", "kue"],
  ["lihat", "melihat", "burung"], ["buka", "membuka", "pintu"], ["ambil", "mengambil", "buku"], ["tanam", "menanam", "padi"], ["sapu", "menyapu", "halaman"], ["lukis", "melukis", "pemandangan"]];
const GRAM_BANK = bank([
  "2|Pilih kalimat yang efektif (tanpa pemborosan kata).|Mereka saling membantu.|Mereka saling membantu satu sama lain.~Mereka saling membantu-bantu satu sama lain.~Mereka membantu-bantu saling.|Saling sudah bermakna timbal balik, jadi “satu sama lain” berlebihan.",
  "2|Pilih kalimat yang efektif.|Para siswa mengikuti upacara.|Para siswa-siswa mengikuti upacara.~Para siswa-siswa itu semuanya mengikuti upacara.~Siswa-siswa para mengikuti upacara.|Kata para sudah menyatakan jamak, jadi tidak perlu diulang.",
  "2|Kata yang tepat untuk melengkapi “Hasil ujian ___ pada papan pengumuman.” adalah ...|diumumkan|mengumumkan~pengumuman~terumumkan|Subjek hasil ujian dikenai tindakan: bentuk pasif diumumkan.",
  "2|Kata “mempermudah” terbentuk dari kata dasar ...|mudah|permudah~mempermu~muda|Imbuhan memper- ditambahkan pada kata dasar mudah.",
  "2|Kalimat yang menggunakan kata “agar” dengan tepat adalah ...|Ia belajar giat agar lulus ujian.|Ia belajar giat agar tetapi lulus.~Agar belajar giat ia lulus ujian tetapi.~Ia agar belajar giat lulus.|Agar menyatakan tujuan.",
  "2|Kata yang tepat untuk melengkapi “Dia sangat ___ dalam bidang matematika.” adalah ...|mahir|mahirkan~memahiri~kemahiran|Setelah sangat dipakai kata sifat: mahir.",
  "2|Bentuk jamak yang benar dari “buku” adalah ...|buku-buku|bukubuku~buku2~para buku|Kata ulang ditulis dengan tanda hubung.",
  "2|Kalimat yang memakai kata depan “pada” dengan benar adalah ...|Pada hari Minggu kami berlibur.|Pada Jakarta kami berlibur.~Kami pada rumah berlibur.~Pada sekolah kami berlibur ke.|Pada dipakai untuk waktu dan orang, bukan untuk nama tempat.",
  "3|Pilih kalimat yang efektif.|Pemerintah akan membangun jembatan baru di desa itu.|Di desa itu akan membangun jembatan baru pemerintah.~Jembatan baru akan membangun pemerintah di desa itu.~Pemerintah akan membangun jembatan baru di desa itu oleh.|Kalimat efektif memiliki subjek dan predikat yang jelas dan urutan yang logis.",
  "3|Ia tetap berangkat ___ hujan deras.|walaupun|sehingga~jadi~maka|Walaupun menyatakan pertentangan; tetap berangkat berlawanan dengan hujan deras.",
  "3|Kalimat yang tidak memiliki subjek adalah ...|Pergi ke pasar membeli sayur.|Ibu pergi ke pasar membeli sayur.~Adik membaca buku di perpustakaan.~Kami belajar bersama sore ini.|Kalimat pertama tidak menyebut pelaku (subjek).",
  "3|Kata “sehingga” dipakai untuk menyatakan ...|akibat|pertentangan~syarat~pilihan|Sehingga menghubungkan sebab dengan akibat.",
  "3|Kata “meskipun” dipakai untuk menyatakan ...|pertentangan|akibat~tujuan~waktu|Meskipun menyatakan konsesi (pertentangan).",
  "3|Kalimat majemuk bertingkat ditandai dengan adanya ...|induk kalimat dan anak kalimat|dua kalimat setara~satu kata saja~hanya tanda seru|Kalimat majemuk bertingkat memiliki induk dan anak kalimat.",
  "3|Imbuhan pada kata “ketidakadilan” adalah ...|ke-an dan tidak|me-kan~ber-an~di-i|Ketidakadilan = ke- + tidak + adil + -an.",
  "3|Kalimat yang menggunakan konjungsi korelatif dengan benar adalah ...|Bukan hanya pandai, melainkan juga rajin.|Bukan hanya pandai, sehingga rajin.~Bukan pandai, juga karena rajin.~Hanya pandai, tetapi juga bukan.|Pasangan yang benar: bukan hanya ..., melainkan juga ...",
  "3|Pilihan kata yang tepat untuk melengkapi “Peraturan itu ___ semua warga.” adalah ...|mengikat|terikat oleh~mengikatkan~diikat|Peraturan mengikat semua warga (aktif transitif).",
  "3|Kalimat yang menggunakan kata “di mana” dengan tepat adalah ...|Di mana kamu menyimpan kunci itu?|Rumah di mana ia tinggal sangat luas.~Hal di mana kita bicarakan penting.~Sekolah di mana kami belajar bagus.|Di mana lazim dipakai sebagai kata tanya tempat, bukan kata penghubung."
]);
function grammar(d) {
  const lv = choose(LV(d)), who = choose(NAMA);
  const useBank = lv === 3 || (lv === 2 && Math.random() < .5);
  if (useBank) return mcItem(pickBank(GRAM_BANK, d));
  if (lv === 1 && Math.random() < .5) {
    const [v, p] = choose(PREP), place = p === "dari" ? choose(KOTA) : choose(TEMPAT.concat(KOTA));
    return mc(`${who} ${v} ___ ${place}.`, p, ["di", "ke", "dari", "pada", "untuk"].filter(x => x !== p), `Kata kerja “${v}” berpasangan dengan kata depan “${p}”.`);
  }
  const [root, act, obj] = choose(ACT), pas = "di" + root, ter = "ter" + root, pe = "pe" + root;
  if (lv === 1) return mc(`${who} sedang ___ ${obj}.`, act, [pas, ter, "pem" + root], `Subjek ${who} melakukan perbuatan, jadi dipakai bentuk aktif “${act}”.`);
  return mc(`${obj[0].toUpperCase() + obj.slice(1)} itu ___ oleh ${who}.`, pas, [act, ter, pe], `Pelaku disebut dengan “oleh”, jadi dipakai bentuk pasif “${pas}”.`);
}

/* ---------- Pemahaman bacaan ---------- */
const TEXTS = [
  ["Pak Tono adalah petani di desa Sukamaju. Setiap pagi ia pergi ke sawah sebelum matahari terbit. Ia menanam padi dan sayuran. Hasil panennya dijual di pasar setiap hari Minggu.",
    bank(["1|Apa pekerjaan Pak Tono?|petani|pedagang~guru~sopir|Teks menyebut Pak Tono petani di desa Sukamaju.",
      "1|Di desa apa Pak Tono tinggal?|Sukamaju|Sukamulya~Sukamakmur~Sukajaya|Teks menyebut desa Sukamaju.",
      "1|Apa yang dilakukan Pak Tono setiap pagi?|pergi ke sawah|pergi ke pasar~mengajar di sekolah~berenang di sungai|Teks: setiap pagi ia pergi ke sawah.",
      "1|Kapan hasil panen dijual?|setiap hari Minggu|setiap pagi~setiap hari Senin~sebelum matahari terbit|Kalimat terakhir menyebut hari Minggu.",
      "2|Apa saja yang ditanam Pak Tono?|padi dan sayuran|padi dan jagung~sayuran dan buah~jagung dan singkong|Teks: ia menanam padi dan sayuran.",
      "3|Kesimpulan yang tepat dari teks adalah ...|Pak Tono bekerja sejak pagi untuk menghidupi keluarganya|Pak Tono tidak pernah berjualan~Pak Tono tinggal di kota besar~Pak Tono menanam padi di malam hari|Ia berangkat pagi dan menjual hasil panen, menunjukkan kerja keras."])],
  ["Sampah plastik membutuhkan ratusan tahun untuk terurai. Karena itu, banyak sekolah mengajak siswa membawa tas belanja sendiri dan botol minum isi ulang. Kebiasaan sederhana ini dapat mengurangi sampah plastik di lingkungan.",
    bank(["1|Berapa lama sampah plastik terurai?|ratusan tahun|beberapa hari~satu bulan~sepuluh tahun|Kalimat pertama menyebut ratusan tahun.",
      "1|Apa yang dapat dikurangi dengan kebiasaan sederhana itu?|sampah plastik|sampah kertas~biaya sekolah~jumlah siswa|Kalimat terakhir menyebut sampah plastik.",
      "1|Siapa yang diajak membawa tas belanja sendiri?|siswa|guru saja~pedagang~petani|Sekolah mengajak siswa.",
      "2|Apa yang diajak sekolah untuk dibawa siswa?|tas belanja dan botol minum isi ulang|kantong plastik dan botol sekali pakai~buku dan pensil~makanan kemasan|Kalimat kedua menyebut tas belanja dan botol isi ulang.",
      "3|Gagasan utama teks tersebut adalah ...|kebiasaan sederhana dapat mengurangi sampah plastik|plastik adalah bahan terbaik~sekolah wajib menjual botol~sampah tidak berbahaya|Kalimat terakhir merangkum gagasan teks."])],
  ["Perpustakaan sekolah kami buka setiap hari Senin sampai Jumat, pukul 07.00 sampai 15.00. Siswa boleh meminjam dua buku selama satu minggu. Jika terlambat mengembalikan, siswa harus membayar denda seribu rupiah per hari.",
    bank(["1|Berapa buku yang boleh dipinjam siswa?|dua buku|satu buku~tiga buku~lima buku|Teks menyebut dua buku.",
      "1|Hari apa saja perpustakaan buka?|Senin sampai Jumat|setiap hari~Sabtu dan Minggu~hanya hari Senin|Teks: Senin sampai Jumat.",
      "1|Pukul berapa perpustakaan tutup?|15.00|07.00~12.00~17.00|Perpustakaan buka sampai pukul 15.00.",
      "2|Berapa denda keterlambatan per hari?|seribu rupiah|dua ribu rupiah~lima ratus rupiah~sepuluh ribu rupiah|Teks: denda seribu rupiah per hari.",
      "3|Jika Rani terlambat tiga hari, denda yang harus dibayar adalah ...|Rp3.000|Rp1.000~Rp2.000~Rp7.000|3 hari × Rp1.000 = Rp3.000."])],
  ["Hutan mangrove tumbuh di pantai berlumpur. Akarnya yang kuat menahan gelombang sehingga mengurangi pengikisan pantai. Selain itu, hutan mangrove menjadi tempat berkembang biak ikan dan kepiting. Karena manfaat besar itu, masyarakat pesisir menanam mangrove secara bergotong royong.",
    bank(["1|Di mana hutan mangrove tumbuh?|di pantai berlumpur|di puncak gunung~di gurun~di tengah kota|Kalimat pertama menyebut pantai berlumpur.",
      "1|Siapa yang menanam mangrove secara gotong royong?|masyarakat pesisir|petani gunung~pedagang kota~wisatawan|Teks menyebut masyarakat pesisir.",
      "2|Apa manfaat akar mangrove?|menahan gelombang dan mengurangi pengikisan pantai|menghasilkan garam~menyimpan air tawar~menghangatkan laut|Kalimat kedua menyebut manfaat akar.",
      "2|Hewan apa yang berkembang biak di hutan mangrove?|ikan dan kepiting|burung dan kelinci~sapi dan kambing~ular dan kuda|Kalimat ketiga menyebut ikan dan kepiting.",
      "3|Sikap yang sesuai dengan isi teks adalah ...|ikut menjaga dan menanam mangrove|menebang mangrove untuk lahan~membiarkan pantai terkikis~membuang sampah ke pantai|Teks mengajak menghargai manfaat mangrove."])],
  ["Dina mengikuti lomba menulis cerita pendek tingkat kota. Ia menulis tentang seorang anak nelayan yang bermimpi menjadi pelaut. Dina menulis setiap sore selama dua minggu. Hasilnya, ia meraih juara kedua dan mendapat piala serta buku.",
    bank(["1|Lomba apa yang diikuti Dina?|menulis cerita pendek|menggambar~menyanyi~berenang|Teks menyebut lomba menulis cerita pendek.",
      "1|Hadiah apa yang diterima Dina?|piala dan buku|uang dan tas~sepeda~jam tangan|Teks: piala serta buku.",
      "1|Cerita Dina tentang ...|anak nelayan yang bermimpi menjadi pelaut|petani yang menanam padi~dokter yang mengobati~guru yang mengajar|Teks menyebut anak nelayan.",
      "1|Berapa lama Dina menulis?|dua minggu|dua hari~dua bulan~satu minggu|Teks: dua minggu.",
      "2|Dina meraih juara ke ...|dua|satu~tiga~empat|Teks menyebut juara kedua.",
      "3|Pesan yang dapat diambil dari teks adalah ...|kerja keras dan ketekunan membuahkan hasil|keberuntungan menentukan segalanya~lomba tidak penting~menulis hanya untuk anak nelayan|Dina rajin menulis setiap sore dan berhasil."])],
  ["Hujan deras mengguyur kota sejak malam. Pagi harinya, beberapa jalan tergenang air. Warga bergotong royong membersihkan saluran air yang tersumbat sampah. Menjelang siang, air mulai surut dan jalan dapat dilalui kembali.",
    bank(["1|Apa yang terjadi pada pagi hari?|beberapa jalan tergenang|jalan berdebu~jalan kering~jalan ramai pedagang|Teks: pagi harinya beberapa jalan tergenang air.",
      "1|Apa yang terjadi sejak malam?|hujan deras mengguyur kota|terjadi kemarau~terjadi gempa~angin kencang tanpa hujan|Kalimat pertama menyebut hujan deras.",
      "2|Apa yang dibersihkan warga?|saluran air yang tersumbat sampah|atap rumah~lapangan sekolah~jembatan layang|Teks menyebut saluran air tersumbat sampah.",
      "2|Kapan air mulai surut?|menjelang siang|tengah malam~sore hari~keesokan harinya|Teks: menjelang siang.",
      "3|Penyebab utama genangan air menurut teks adalah ...|hujan deras dan saluran tersumbat sampah|kemarau panjang~gunung meletus~sungai kering|Teks menyebut hujan deras dan saluran tersumbat."])],
  ["Mikroskop adalah alat untuk melihat benda yang sangat kecil. Alat ini memiliki lensa yang dapat memperbesar bayangan benda. Dengan mikroskop, ilmuwan dapat mengamati sel dan bakteri yang tidak terlihat oleh mata biasa.",
    bank(["1|Mikroskop digunakan untuk melihat ...|benda yang sangat kecil|bintang di langit~benda yang jauh~warna pelangi|Teks: alat untuk melihat benda sangat kecil.",
      "1|Apa fungsi lensa mikroskop?|memperbesar bayangan benda|memperkecil benda~menyimpan cahaya~mengukur suhu|Teks: lensa memperbesar bayangan benda.",
      "2|Bagian mikroskop yang memperbesar bayangan adalah ...|lensa|kaki~lampu~kaca jendela|Teks menyebut lensa.",
      "2|Apa yang dapat diamati ilmuwan dengan mikroskop?|sel dan bakteri|planet dan komet~gunung dan sungai~awan dan angin|Teks menyebut sel dan bakteri.",
      "3|Kesimpulan yang tepat adalah ...|mikroskop membantu mengamati hal yang tak terlihat mata biasa|mikroskop dipakai melihat bintang~mikroskop memperkecil benda~mata biasa lebih jelas daripada mikroskop|Mikroskop memperbesar bayangan benda kecil."])],
  ["Koperasi sekolah menjual alat tulis dengan harga lebih murah daripada toko di luar. Keuntungannya dibagikan kembali kepada anggota pada akhir tahun. Karena itu, banyak siswa tertarik menjadi anggota koperasi.",
    bank(["1|Apa yang dijual koperasi sekolah?|alat tulis|makanan berat~pakaian~mainan|Teks: koperasi menjual alat tulis.",
      "1|Siapa yang mendapat pembagian keuntungan koperasi?|anggota koperasi|guru saja~pedagang luar~kepala sekolah|Teks: keuntungan dibagikan kepada anggota.",
      "2|Kapan keuntungan dibagikan?|pada akhir tahun|setiap hari~setiap minggu~pada awal tahun|Teks: pada akhir tahun.",
      "2|Mengapa banyak siswa menjadi anggota?|harga lebih murah dan keuntungan dibagi|koperasi gratis~koperasi dekat rumah~guru mewajibkan|Teks menyebut harga murah dan pembagian keuntungan.",
      "3|Pernyataan yang sesuai dengan teks adalah ...|anggota ikut menikmati keuntungan koperasi|koperasi lebih mahal dari toko~keuntungan hanya untuk guru~koperasi tidak punya anggota|Keuntungan dibagikan kepada anggota."])]
];
function reading(d) { const [text, qs] = choose(TEXTS), it = pickBank(qs, d); return mc(`${text}\n\nPertanyaan: ${it.prompt}`, it.answer, it.wrong, it.expl); }

export function generateIndonesian(sub, d) {
  const t = sub === "mixed" ? choose(["synant", "meaning", "baku", "ejaan", "grammar", "reading"]) : sub;
  return ({ synant: () => synant(d), meaning: () => mcItem(pickBank(MEANING, d)), baku: () => baku(d), ejaan: () => ejaan(d),
    grammar: () => grammar(d), reading: () => reading(d) })[t]();
}
