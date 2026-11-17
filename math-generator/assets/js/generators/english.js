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

const LEVELS = { easy: EASY, medium: MEDIUM, hard: HARD };

// Kamus balik Indonesia -> Inggris dari semua level, supaya kata bermakna ganda tetap dinilai benar.
const REVERSE = new Map();
for (const w of [...EASY, ...MEDIUM, ...HARD]) for (const id of w.id) {
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
