import { choose, shuffle, mc, bank, pickBank, mcItem } from "../utils.js";

const SYN = [["indah","cantik","jelek",1],["pintar","cerdas","bodoh",1],["rajin","tekun","malas",1],["cepat","lekas","lambat",1],["gembira","senang","sedih",1],
  ["hemat","irit","boros",2],["dermawan","murah hati","kikir",2],["bijaksana","arif","gegabah",2],["kuat","kukuh","lemah",2],["tenang","damai","gelisah",2],
  ["abadi","kekal","fana",3],["lugas","terus terang","bertele-tele",3],["gigih","ulet","mudah menyerah",3],["mutakhir","terbaru","usang",3],["ambigu","bermakna ganda","jelas",3]];
function synant(d) {
  const r = { easy: [1], medium: [1, 2], hard: [2, 3] }[d], e = choose(SYN.filter(x => r.includes(x[3]))), syn = Math.random() < .5;
  const wrong = SYN.filter(o => o !== e).flatMap(o => [o[1], o[2]]).filter(x => x !== e[1] && x !== e[2]);
  return mc(`Pilih ${syn ? "sinonim (persamaan kata)" : "antonim (lawan kata)"} dari kata “${e[0]}”.`, syn ? e[1] : e[2], shuffle(wrong),
    `${e[0]} bersinonim dengan ${e[1]} dan berantonim dengan ${e[2]}.`);
}
const BAKU = [["silakan","silahkan",1],["nasihat","nasehat",1],["risiko","resiko",1],["jadwal","jadual",1],["izin","ijin",1],["praktik","praktek",1],["teknik","tehnik",1],["antre","antri",1],
  ["sekadar","sekedar",2],["napas","nafas",2],["kuitansi","kwitansi",2],["andal","handal",2],["Jumat","Jum'at",2],["provinsi","propinsi",2],["objek","obyek",2],["sistem","sistim",2],
  ["hakikat","hakekat",3],["konkret","konkrit",3],["hierarki","hirarki",3],["atlet","atlit",3],["kualitas","kwalitas",3],["frekuensi","frekwensi",3]];
function baku(d) {
  const r = { easy: [1], medium: [1, 2], hard: [2, 3] }[d], e = choose(BAKU.filter(x => r.includes(x[2]))), flip = Math.random() < .5;
  return mc(`Manakah penulisan kata yang baku?`, e[0], [e[1]], `Bentuk baku menurut KBBI adalah “${e[0]}”, bukan “${e[1]}”.`, 2);
}
const MEANING = bank([
  "1|Arti kata “hemat” adalah ...|tidak boros|mahal~besar~cepat|Hemat berarti cermat dalam memakai uang atau barang.",
  "1|Arti kata “gembira” adalah ...|senang|marah~takut~lelah|Gembira = senang hati.",
  "2|Pada kalimat “Bunga bank bulan ini naik”, makna kata bunga adalah ...|imbalan atas uang simpanan/pinjaman|kembang tanaman~gadis cantik~hiasan meja|Dalam konteks perbankan, bunga adalah imbalan jasa uang.",
  "2|Pada kalimat “Kami duduk di kaki gunung”, makna kata kaki adalah ...|bagian bawah|anggota badan untuk berjalan~penopang meja~satuan panjang|Kaki gunung = bagian terbawah gunung.",
  "2|Pada kalimat “Kepala sekolah memberi sambutan”, makna kata kepala adalah ...|pemimpin|bagian tubuh atas~bagian depan surat~ujung benda|Kepala sekolah = pemimpin sekolah.",
  "3|Makna ungkapan “naik daun” adalah ...|sedang terkenal|memanjat pohon~sedang sakit~sedang bepergian|Naik daun = sedang populer.",
  "3|Makna ungkapan “panjang tangan” adalah ...|suka mencuri|suka menolong~rajin bekerja~bertubuh tinggi|Panjang tangan = suka mencuri.",
  "3|Makna kata “lestari” pada “Hutan harus dijaga agar tetap lestari” adalah ...|tetap seperti keadaan semula|cepat berubah~mudah rusak~sangat luas|Lestari = tetap dan tidak berubah."
]);
const EJAAN = bank([
  "1|Pilih kalimat yang tanda bacanya benar.|Ibu membeli apel, jeruk, dan mangga.|Ibu membeli apel jeruk, dan mangga.~Ibu, membeli apel jeruk dan mangga.~Ibu membeli, apel, jeruk dan, mangga.|Unsur pemerincian dipisahkan tanda koma.",
  "1|Pilih kalimat dengan huruf kapital yang benar.|Kami berlibur ke Bali pada bulan Juli.|kami berlibur ke bali pada bulan juli.~Kami berlibur ke bali pada bulan Juli.~Kami berlibur ke Bali pada Bulan juli.|Awal kalimat, nama tempat, dan nama bulan diawali huruf kapital.",
  "2|Pilih penulisan kata depan yang benar.|Adik pergi ke pasar dan makan di rumah.|Adik pergi kepasar dan makan dirumah.~Adik pergi ke pasar dan makan dirumah.~Adik pergi kepasar dan makan di rumah.|Kata depan ke dan di ditulis terpisah dari kata yang mengikutinya.",
  "2|Pilih penulisan yang benar.|Buku itu dibaca oleh semua siswa.|Buku itu di baca oleh semua siswa.~Buku itu di-baca oleh semua siswa.~Buku itu dibaca, oleh semua siswa.|Awalan di- pada kata kerja ditulis serangkai.",
  "2|Pilih penulisan kalimat langsung yang benar.|“Kapan kamu berangkat?” tanya Dina.|“Kapan kamu berangkat.” tanya Dina.~“Kapan kamu berangkat?”, tanya Dina.~“Kapan kamu berangkat?” Tanya Dina.|Kalimat tanya dalam petikan diakhiri tanda tanya, dan keterangan sesudahnya diawali huruf kecil.",
  "3|Pilih kalimat dengan ejaan dan tanda baca yang benar.|Setiap hari Senin, kami mengikuti upacara bendera.|Setiap hari senin kami mengikuti upacara bendera.~Setiap hari Senin kami, mengikuti upacara bendera.~setiap hari Senin, kami mengikuti upacara bendera|Nama hari berhuruf kapital; anak kalimat di awal diikuti koma."
]);
const GRAMMAR = bank([
  "1|Dia tinggal ___ Jakarta.|di|ke~oleh~akan|Kata depan di menyatakan tempat berada.",
  "1|Ayah ___ koran setiap pagi.|membaca|dibaca~terbaca~pembaca|Subjek Ayah melakukan perbuatan, jadi bentuk aktif membaca.",
  "2|Pilih kalimat yang efektif (tanpa pemborosan kata).|Mereka saling membantu.|Mereka saling membantu satu sama lain.~Mereka saling membantu-bantu satu sama lain.~Mereka membantu-bantu saling.|Saling sudah bermakna timbal balik, jadi “satu sama lain” berlebihan.",
  "2|Kakak sedang ___ nasi di dapur.|memasak|dimasak~masakan~pemasak|Subjek Kakak melakukan pekerjaan: memasak.",
  "3|Pilih kalimat yang efektif.|Pemerintah akan membangun jembatan baru di desa itu.|Di desa itu akan membangun jembatan baru pemerintah.~Jembatan baru akan membangun pemerintah di desa itu.~Pemerintah akan membangun jembatan baru di desa itu oleh.|Kalimat efektif memiliki subjek dan predikat yang jelas dan urutan yang logis.",
  "3|Ia tetap berangkat ___ hujan deras.|walaupun|sehingga~jadi~maka|Walaupun menyatakan pertentangan; tetap berangkat berlawanan dengan hujan deras."
]);
const TEXTS = [
  ["Pak Tono adalah petani di desa Sukamaju. Setiap pagi ia pergi ke sawah sebelum matahari terbit. Ia menanam padi dan sayuran. Hasil panennya dijual di pasar setiap hari Minggu.",
    bank(["1|Apa pekerjaan Pak Tono?|petani|pedagang~guru~sopir|Teks menyebut Pak Tono petani di desa Sukamaju.",
      "1|Kapan hasil panen dijual?|setiap hari Minggu|setiap pagi~setiap hari Senin~sebelum matahari terbit|Kalimat terakhir menyebut hari Minggu.",
      "2|Apa saja yang ditanam Pak Tono?|padi dan sayuran|padi dan jagung~sayuran dan buah~jagung dan singkong|Teks: ia menanam padi dan sayuran.",
      "3|Kesimpulan yang tepat dari teks adalah ...|Pak Tono bekerja sejak pagi untuk menghidupi keluarganya|Pak Tono tidak pernah berjualan~Pak Tono tinggal di kota besar~Pak Tono menanam padi di malam hari|Ia berangkat pagi dan menjual hasil panen, menunjukkan kerja keras."])],
  ["Sampah plastik membutuhkan ratusan tahun untuk terurai. Karena itu, banyak sekolah mengajak siswa membawa tas belanja sendiri dan botol minum isi ulang. Kebiasaan sederhana ini dapat mengurangi sampah plastik di lingkungan.",
    bank(["1|Berapa lama sampah plastik terurai?|ratusan tahun|beberapa hari~satu bulan~sepuluh tahun|Kalimat pertama menyebut ratusan tahun.",
      "2|Apa yang diajak sekolah untuk dibawa siswa?|tas belanja dan botol minum isi ulang|kantong plastik dan botol sekali pakai~buku dan pensil~makanan kemasan|Kalimat kedua menyebut tas belanja dan botol isi ulang.",
      "3|Gagasan utama teks tersebut adalah ...|kebiasaan sederhana dapat mengurangi sampah plastik|plastik adalah bahan terbaik~sekolah wajib menjual botol~sampah tidak berbahaya|Kalimat terakhir merangkum gagasan teks."])]
];
function reading(d) { const [text, qs] = choose(TEXTS), it = pickBank(qs, d); return mc(`${text}\n\nPertanyaan: ${it.prompt}`, it.answer, it.wrong, it.expl); }
export function generateIndonesian(sub, d) {
  const t = sub === "mixed" ? choose(["synant", "meaning", "baku", "ejaan", "grammar", "reading"]) : sub;
  return ({ synant: () => synant(d), meaning: () => mcItem(pickBank(MEANING, d)), baku: () => baku(d), ejaan: () => mcItem(pickBank(EJAAN, d)),
    grammar: () => mcItem(pickBank(GRAMMAR, d)), reading })[t]();
}
