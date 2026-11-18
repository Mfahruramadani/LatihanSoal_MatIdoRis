import { choose, normWord } from "../utils.js";

// Format: "inggris|arti1/arti2" — awalan "~" menandai kata kerja (jawaban "to eat" juga diterima).
const parse = lines => lines.map(l => {
  const v = l.startsWith("~"), [en, id] = (v ? l.slice(1) : l).split("|");
  return { en, id: id.split("/"), v };
});

const EASY = parse([
  "apple|apel","book|buku","cat|kucing","dog|anjing","house|rumah","water|air","fire|api","sun|matahari",
  "moon|bulan","star|bintang","tree|pohon","flower|bunga","fish|ikan","bird|burung","egg|telur","milk|susu",
  "rice|nasi","bread|roti","sugar|gula","salt|garam","red|merah","blue|biru","green|hijau","yellow|kuning",
  "black|hitam","white|putih","one|satu","two|dua","three|tiga","four|empat","five|lima","six|enam",
  "seven|tujuh","eight|delapan","nine|sembilan","ten|sepuluh","mother|ibu","father|ayah","sister|saudara perempuan",
  "boy|anak laki-laki","girl|anak perempuan","friend|teman/sahabat","teacher|guru","student|murid/siswa/pelajar",
  "school|sekolah","table|meja","chair|kursi","door|pintu","window|jendela","pen|pena","bag|tas","shoes|sepatu",
  "hat|topi","car|mobil","bicycle|sepeda","road|jalan","big|besar","small|kecil","hot|panas","cold|dingin",
  "good|baik/bagus","bad|buruk/jelek","new|baru","old|tua/lama","happy|senang/bahagia","sad|sedih",
  "~eat|makan/memakan","~drink|minum/meminum","~sleep|tidur","~run|lari/berlari","~walk|berjalan/jalan",
  "~read|membaca/baca","~write|menulis/tulis","~go|pergi","~come|datang","~sit|duduk","~stand|berdiri",
  "day|hari","night|malam","morning|pagi","hand|tangan","eye|mata","head|kepala","mouth|mulut","nose|hidung"
]);

const MEDIUM = parse([
  "kitchen|dapur","bedroom|kamar tidur","bathroom|kamar mandi","market|pasar","hospital|rumah sakit",
  "library|perpustakaan","airport|bandara","station|stasiun","village|desa","city|kota","river|sungai",
  "mountain|gunung","sea|laut","beach|pantai","forest|hutan","rain|hujan","wind|angin","cloud|awan",
  "weather|cuaca","month|bulan","week|minggu","year|tahun","time|waktu","money|uang","price|harga",
  "job|pekerjaan","~work|bekerja/kerja","~buy|membeli/beli","~sell|menjual/jual","~open|membuka/buka",
  "~close|menutup/tutup","~help|membantu/bantu/menolong/tolong","~ask|bertanya/tanya","~answer|menjawab/jawab",
  "~learn|belajar","~teach|mengajar","~cook|memasak/masak","~clean|membersihkan","clean|bersih","dirty|kotor",
  "cheap|murah","expensive|mahal","easy|mudah","difficult|sulit/susah","fast|cepat","slow|lambat","strong|kuat",
  "weak|lemah","tall|tinggi","short|pendek","heavy|berat","empty|kosong","full|penuh","clever|pintar/cerdas",
  "lazy|malas","brave|berani","afraid|takut","angry|marah","tired|lelah/capek","hungry|lapar","thirsty|haus",
  "sick|sakit","healthy|sehat","neighbor|tetangga","farmer|petani","doctor|dokter","driver|sopir/pengemudi",
  "police|polisi","shop|toko","holiday|liburan","birthday|ulang tahun","gift|hadiah/kado","letter|surat",
  "picture|gambar/foto","music|musik","song|lagu","story|cerita","question|pertanyaan","language|bahasa",
  "country|negara","island|pulau"
]);

const HARD = parse([
  "~achieve|mencapai","~improve|memperbaiki/meningkatkan","~decide|memutuskan","~allow|mengizinkan/memperbolehkan",
  "~avoid|menghindari","~borrow|meminjam","~lend|meminjamkan","~reduce|mengurangi","~increase|meningkatkan/bertambah",
  "~protect|melindungi","~develop|mengembangkan","~remember|mengingat/ingat","~forget|lupa/melupakan",
  "~believe|percaya","~suggest|menyarankan/mengusulkan","~prepare|menyiapkan/mempersiapkan","~arrive|tiba/sampai",
  "~leave|meninggalkan","enough|cukup","dangerous|berbahaya","important|penting","necessary|perlu/diperlukan",
  "different|berbeda","similar|mirip/serupa","famous|terkenal","polite|sopan","honest|jujur","generous|dermawan",
  "curious|penasaran","patient|sabar","successful|berhasil/sukses","available|tersedia","popular|populer",
  "environment|lingkungan","government|pemerintah","education|pendidikan","knowledge|pengetahuan",
  "experience|pengalaman","opportunity|kesempatan/peluang","research|penelitian","society|masyarakat",
  "health|kesehatan","traffic|lalu lintas/kemacetan","schedule|jadwal","invitation|undangan","information|informasi",
  "message|pesan","population|penduduk/populasi","pollution|polusi/pencemaran","energy|energi","economy|ekonomi",
  "culture|budaya","habit|kebiasaan","tradition|tradisi","ability|kemampuan","advantage|keuntungan/kelebihan",
  "disadvantage|kerugian/kekurangan","although|meskipun","because|karena","between|antara/di antara",
  "among|di antara","during|selama","without|tanpa","usually|biasanya","sometimes|kadang-kadang",
  "always|selalu","never|tidak pernah","suddenly|tiba-tiba","carefully|dengan hati-hati"
]);


// ---- v8: tambahan kosakata supaya tidak cepat berulang ----
const EASY2 = parse([
  "brother|saudara laki-laki","baby|bayi","man|laki-laki/pria","woman|perempuan/wanita","king|raja","queen|ratu","cow|sapi","horse|kuda","pig|babi","goat|kambing",
  "chicken|ayam","duck|bebek","mouse|tikus","lion|singa","elephant|gajah","monkey|monyet","snake|ular","banana|pisang","orange|jeruk","grape|anggur",
  "mango|mangga","potato|kentang","carrot|wortel","tomato|tomat","meat|daging","cake|kue","tea|teh","coffee|kopi","juice|jus","soup|sup",
  "spoon|sendok","fork|garpu","knife|pisau","plate|piring","glass|gelas","bed|tempat tidur","lamp|lampu","clock|jam","phone|telepon","paper|kertas",
  "pencil|pensil","ruler|penggaris","box|kotak","ball|bola","toy|mainan","foot|kaki","ear|telinga","hair|rambut","face|wajah","arm|lengan",
  "long|panjang","low|rendah","fat|gemuk","thin|kurus","wet|basah","dry|kering","soft|lembut","today|hari ini","tomorrow|besok","yesterday|kemarin",
  "afternoon|siang","evening|sore","~jump|melompat/lompat","~swim|berenang","~sing|bernyanyi/menyanyi","~dance|menari","~play|bermain/main","~laugh|tertawa",
  "~cry|menangis","~see|melihat/lihat","~hear|mendengar","~give|memberi/beri","~take|mengambil/ambil","~wash|mencuci/cuci","~wait|menunggu/tunggu",
  "~like|menyukai/suka","~want|ingin/mau/menginginkan","~wake|bangun"
]);
const MEDIUM2 = parse([
  "museum|museum","bridge|jembatan","park|taman","garden|kebun","field|lapangan","office|kantor","factory|pabrik","restaurant|restoran/rumah makan","hotel|hotel/penginapan",
  "ticket|tiket/karcis","passport|paspor","luggage|bagasi","journey|perjalanan","map|peta","address|alamat","size|ukuran","color|warna","shape|bentuk",
  "circle|lingkaran","square|persegi","line|garis","number|angka/nomor","list|daftar","rule|aturan","law|hukum","problem|masalah","solution|solusi/pemecahan",
  "idea|ide/gagasan","reason|alasan","result|hasil","dream|mimpi/impian","secret|rahasia","danger|bahaya","accident|kecelakaan","medicine|obat","fever|demam",
  "cough|batuk","vegetable|sayuran","fruit|buah","meal|hidangan","breakfast|sarapan","lunch|makan siang","dinner|makan malam","~travel|bepergian",
  "~visit|mengunjungi/kunjungi","~invite|mengundang/undang","~choose|memilih/pilih","~win|menang/memenangkan","~lose|kalah/kehilangan","~build|membangun",
  "~carry|membawa/bawa","~catch|menangkap/tangkap","~throw|melempar/lempar","~push|mendorong/dorong","~pull|menarik/tarik","~climb|memanjat/panjat/mendaki",
  "~wear|memakai/pakai/mengenakan","~count|menghitung/hitung","~paint|mengecat/melukis/lukis","quiet|tenang/sunyi","noisy|ribut/bising","beautiful|cantik/indah",
  "kind|ramah/baik hati","rude|kurang ajar/tidak sopan","smooth|halus","narrow|sempit","wide|lebar","deep|dalam","shallow|dangkal","sharp|tajam","bright|terang/cerah",
  "dark|gelap","safe|aman","early|awal","late|terlambat/larut"
]);
const HARD2 = parse([
  "~accept|menerima","~refuse|menolak","~admit|mengakui","~compare|membandingkan","~describe|menggambarkan/mendeskripsikan","~explain|menjelaskan","~discover|menemukan",
  "~invent|menciptakan","~measure|mengukur","~replace|mengganti/menggantikan","~require|membutuhkan/mensyaratkan","~provide|menyediakan","~complain|mengeluh",
  "~recommend|merekomendasikan","~participate|berpartisipasi/ikut serta","~support|mendukung","~encourage|menyemangati/mendorong","~prevent|mencegah","~consume|mengonsumsi",
  "~expect|mengharapkan","~depend|bergantung","behavior|perilaku","attitude|sikap","achievement|prestasi/pencapaian","benefit|manfaat","condition|kondisi/keadaan",
  "situation|situasi","community|komunitas","challenge|tantangan","goal|tujuan","effort|usaha/upaya","evidence|bukti","method|metode/cara","process|proses",
  "product|produk","resource|sumber daya","technology|teknologi","industry|industri","agriculture|pertanian","tourism|pariwisata","disaster|bencana","earthquake|gempa bumi",
  "flood|banjir","drought|kekeringan","climate|iklim","temperature|suhu","pressure|tekanan","essential|sangat penting/esensial","complicated|rumit","ordinary|biasa",
  "unusual|tidak biasa/aneh","obvious|jelas/nyata","impossible|mustahil","private|pribadi","public|publik/umum","local|lokal/setempat","foreign|asing",
  "however|namun/akan tetapi","therefore|oleh karena itu","instead|sebagai gantinya","already|sudah/telah","almost|hampir","recently|baru-baru ini","especially|terutama",
  "finally|akhirnya","immediately|segera/langsung"
]);

const LEVELS = { easy: [...EASY, ...EASY2], medium: [...MEDIUM, ...MEDIUM2], hard: [...HARD, ...HARD2] };

// Kamus balik Indonesia -> Inggris dari semua level, supaya kata bermakna ganda tetap dinilai benar.
const REVERSE = new Map();
for (const w of [...EASY, ...EASY2, ...MEDIUM, ...MEDIUM2, ...HARD, ...HARD2]) for (const id of w.id) {
  const k = normWord(id), list = REVERSE.get(k) || [];
  list.push(w.en); if (w.v) list.push("to " + w.en);
  REVERSE.set(k, list);
}

export function generateEnglish(subtype, difficulty) {
  const dir = subtype === "mixed" ? choose(["en_id", "id_en"]) : subtype;
  const w = choose(LEVELS[difficulty] || MEDIUM);
  if (dir === "en_id") {
    return { kind: "vocab", prompt: `Apa arti kata "${w.en}"?`, answer: w.id[0], accept: w.id,
      explanation: `"${w.en}" berarti ${w.id.join(", ")}.` };
  }
  const shown = choose(w.id), accept = [...new Set(REVERSE.get(normWord(shown)))];
  const others = [...new Set(accept.filter(a => !a.startsWith("to ")))].filter(a => a !== w.en);
  return { kind: "vocab", prompt: `Tulis dalam bahasa Inggris: "${shown}"`, answer: w.en, accept,
    explanation: `"${shown}" dalam bahasa Inggris adalah ${w.en}.` + (others.length ? ` Jawaban lain yang juga benar: ${others.join(", ")}.` : "") };
}
export { LEVELS };
