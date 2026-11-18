import { randInt, choose, shuffle, mc, mcNum, bank, pickBank, mcItem } from "../utils.js";

const R = (d, e, m, h) => d === "easy" ? e : d === "medium" ? m : h;
const num = (p, a, e) => Math.random() < .5 ? mcNum(p, a, e) : { prompt: p, answer: String(a), explanation: e };

function series(d) {
  const t = choose(R(d, ["add", "sub"], ["geo", "square", "alt"], ["diff2", "inter", "fib", "cube"])), s = [];
  let e;
  if (t === "add") { const a = randInt(1, 20), k = randInt(2, 9); for (let i = 0; i < 6; i++) s.push(a + i * k); e = `Selisih tetap: +${k}.`; }
  if (t === "sub") { const a = randInt(50, 90), k = randInt(2, 9); for (let i = 0; i < 6; i++) s.push(a - i * k); e = `Selisih tetap: −${k}.`; }
  if (t === "geo") { const a = randInt(1, 4), r = choose([2, 3]); for (let i = 0; i < 6; i++) s.push(a * r ** i); e = `Setiap suku dikali ${r}.`; }
  if (t === "square") { const o = randInt(1, 4); for (let i = 0; i < 6; i++) s.push((i + o) ** 2); e = `Deret kuadrat: ${o}², ${o + 1}², ${o + 2}², ...`; }
  if (t === "alt") { const a = randInt(2, 6), b = randInt(7, 12); s.push(randInt(1, 10)); for (let i = 0; i < 5; i++) s.push(s[i] + (i % 2 ? b : a)); e = `Selisih bergantian: +${a}, +${b}, +${a}, ...`; }
  if (t === "diff2") { const d0 = randInt(1, 4), c = randInt(1, 3); s.push(randInt(1, 10)); for (let i = 0; i < 5; i++) s.push(s[i] + d0 + i * c); e = `Selisih antarsuku bertambah ${c} setiap langkah: ${d0}, ${d0 + c}, ${d0 + 2 * c}, ...`; }
  if (t === "inter") { const x = randInt(1, 9), y = randInt(20, 40), a = randInt(2, 5), b = randInt(2, 6);
    for (let i = 0; i < 6; i++) s.push(i % 2 ? y + (i - 1) / 2 * b * -1 : x + i / 2 * a); e = `Dua deret bergantian: suku ganjil naik ${a} (mulai ${x}), suku genap turun ${b} (mulai ${y}).`; }
  if (t === "fib") { s.push(randInt(1, 5), randInt(1, 5)); for (let i = 2; i < 6; i++) s.push(s[i - 1] + s[i - 2]); e = "Setiap suku adalah jumlah dua suku sebelumnya."; }
  if (t === "cube") { const o = randInt(1, 2); for (let i = 0; i < 6; i++) s.push((i + o) ** 3); e = `Deret pangkat tiga: ${o}³, ${o + 1}³, ...`; }
  return num(`Lanjutkan deret: ${s.slice(0, 5).join(", ")}, ...?`, s[5], `${e} Suku berikutnya = ${s[5]}.`);
}

const CYC = [["▲", "▶", "▼", "◀"], ["○", "◔", "◑", "◕", "●"], ["□", "▣", "■"], ["←", "↖", "↑", "↗", "→"], ["◇", "◆", "◈"], ["♠", "♥", "♦", "♣"], ["①", "②", "③", "④"],
  ["☀", "☁", "☂"], ["◐", "◓", "◑", "◒"], ["⬆", "➡", "⬇", "⬅"], ["△", "□", "○"], ["★", "☆"], ["◢", "◣", "◤", "◥"], ["▁", "▃", "▅", "▇"], ["✦", "✧", "✶"]];
function shape(d) {
  const t = choose(R(d, ["cycle"], ["cycle", "grow"], ["inter", "grow", "cycle"]));
  if (t === "grow") { const a = randInt(1, 4), k = randInt(1, 4), g = choose(["●", "■", "★", "▲", "◆", "♥"]);
    return num(`Pola bentuk: ${[0, 1, 2, 3].map(i => g.repeat(a + i * k)).join("  |  ")}  | ...\nBerapa jumlah ${g} pada bentuk ke-6?`, a + 5 * k, `Setiap bentuk bertambah ${k} ${g}. Bentuk ke-6 = ${a} + 5 × ${k} = ${a + 5 * k}.`); }
  const cyc = choose(CYC), extra = choose(CYC.filter(c => c !== cyc));
  if (t === "cycle") { const o = randInt(0, cyc.length - 1), k = cyc.length + randInt(1, d === "hard" ? 2 : 3), s = Array.from({ length: k + 1 }, (_, i) => cyc[(i + o) % cyc.length]);
    return mc(`Lanjutkan pola: ${s.slice(0, k).join(" ")} ?`, s[k], [...cyc, ...extra], `Pola berulang setiap ${cyc.length} bentuk: ${cyc.join(" ")}.`); }
  const A = cyc, B = extra, oa = randInt(0, A.length - 1), ob = randInt(0, B.length - 1), s = Array.from({ length: 8 }, (_, i) => i % 2 ? B[(((i - 1) / 2) + ob) % B.length] : A[((i / 2) + oa) % A.length]);
  return mc(`Dua pola bergantian. Lanjutkan: ${s.slice(0, 7).join(" ")} ?`, s[7], [...A, ...B], `Posisi ganjil mengikuti ${A.join(" ")}; posisi genap mengikuti ${B.join(" ")}.`);
}

const ANA = bank([
  "1|Burung : Terbang = Ikan : ?|Berenang|Berlari~Terbang~Merayap|Burung bergerak dengan terbang, ikan dengan berenang.",
  "1|Panas : Dingin = Siang : ?|Malam|Pagi~Terang~Matahari|Hubungan lawan kata.",
  "1|Mata : Melihat = Telinga : ?|Mendengar|Berbicara~Mencium~Merasa|Hubungan alat indra dan fungsinya.",
  "2|Dokter : Rumah sakit = Guru : ?|Sekolah|Murid~Buku~Kelas|Hubungan profesi dan tempat bekerja.",
  "2|Pisau : Memotong = Pensil : ?|Menulis|Menghapus~Mengukur~Membaca|Hubungan alat dan fungsinya.",
  "2|Padi : Beras = Gandum : ?|Tepung|Roti~Sawah~Jagung|Hasil olahan langsung dari bahan dasarnya.",
  "3|Haus : Minum = Lelah : ?|Istirahat|Berlari~Belajar~Bekerja|Keadaan dan tindakan yang mengatasinya.",
  "3|Hakim : Putusan = Penulis : ?|Karangan|Pengadilan~Penerbit~Pembaca|Pelaku dan hasil karyanya.",
  "1|Kaki : Sepatu = Tangan : ?|Sarung tangan|Jari~Kuku~Lengan|Bagian tubuh dan pelindung yang dikenakan padanya.",
  "1|Ayam : Telur = Sapi : ?|Susu|Daging~Kandang~Rumput|Hewan dan hasil yang diberikannya.",
  "1|Besar : Kecil = Tinggi : ?|Rendah|Panjang~Jauh~Lebar|Hubungan lawan kata.",
  "1|Siang : Matahari = Malam : ?|Bulan|Pagi~Bintang jatuh~Awan|Waktu dan benda langit yang tampak.",
  "1|Buku : Dibaca = Makanan : ?|Dimakan|Dimasak~Dibeli~Dicuci|Benda dan kegunaannya.",
  "1|Api : Panas = Es : ?|Dingin|Cair~Basah~Putih|Benda dan sifatnya.",
  "2|Petani : Sawah = Nelayan : ?|Laut|Kapal~Jala~Pantai|Pekerja dan tempat bekerjanya.",
  "2|Sendok : Makan = Gunting : ?|Memotong|Menulis~Mengukur~Menjahit|Alat dan fungsinya.",
  "2|Mobil : Bensin = Manusia : ?|Makanan|Air~Udara~Kendaraan|Sumber tenaga.",
  "2|Lampu : Terang = Kipas : ?|Sejuk|Gelap~Panas~Bunyi|Alat dan efek yang dihasilkan.",
  "2|Menulis : Pena = Menggambar : ?|Pensil|Kertas~Warna~Papan|Kegiatan dan alat utamanya.",
  "2|Sehat : Sakit = Kaya : ?|Miskin|Rajin~Bahagia~Pintar|Hubungan lawan kata.",
  "2|Kepala : Topi = Kaki : ?|Sepatu|Celana~Jari~Betis|Bagian tubuh dan penutupnya.",
  "3|Pelukis : Kuas = Penjahit : ?|Jarum|Kain~Benang~Baju|Pelaku dan alat kerja utamanya.",
  "3|Dingin : Beku = Panas : ?|Mendidih|Hangat~Terik~Menguap|Tingkat tertinggi dari keadaan.",
  "3|Sutradara : Film = Arsitek : ?|Bangunan|Cat~Tukang~Gambar|Pencipta dan karyanya.",
  "3|Mendaki : Gunung = Menyelam : ?|Laut|Kolam~Ikan~Pantai|Kegiatan dan medan yang dituju.",
  "3|Kemarau : Kekeringan = Hujan lebat : ?|Banjir|Dingin~Petir~Pelangi|Fenomena dan dampak yang ditimbulkan.",
  "3|Vaksin : Pencegahan = Obat : ?|Penyembuhan|Penyakit~Apotek~Dokter|Sarana dan tujuannya.",
  "3|Hemat : Boros = Rajin : ?|Malas|Pandai~Giat~Tekun|Hubungan lawan kata."
]);
function analogy(d) {
  if (Math.random() < .5) return mcItem(pickBank(ANA, d));
  const f = choose(R(d, [["×", 2], ["×", 3], ["+", 5]], [["×", 4], ["+", 12], ["²"]], [["²+1"], ["³"], ["×", 7, "−1"]])), a = randInt(2, 9), b = randInt(2, 9) + (a === 2 ? 1 : 0);
  const fn = x => f[0] === "×" ? (f[2] ? x * f[1] - 1 : x * f[1]) : f[0] === "+" ? x + f[1] : f[0] === "²" ? x * x : f[0] === "³" ? x ** 3 : x * x + 1;
  const rule = f[0] === "×" ? (f[2] ? `dikali ${f[1]} lalu dikurangi 1` : `dikali ${f[1]}`) : f[0] === "+" ? `ditambah ${f[1]}` : f[0] === "²" ? "dikuadratkan" : f[0] === "³" ? "dipangkatkan tiga" : "dikuadratkan lalu ditambah 1";
  return num(`${a} : ${fn(a)} = ${b} : ?`, fn(b), `Aturannya: bilangan pertama ${rule}. Jadi ${b} → ${fn(b)}.`);
}

const REAL = [["kucing", "hewan", "makhluk hidup"], ["mawar", "bunga", "tumbuhan"], ["apel", "buah", "makanan"], ["kursi", "perabot", "benda"], ["sapi", "mamalia", "hewan"], ["elang", "burung", "hewan"],
  ["mobil", "kendaraan", "benda buatan"], ["sepeda", "kendaraan", "alat transportasi"], ["melati", "bunga", "tumbuhan"], ["bayam", "sayuran", "tumbuhan"], ["pensil", "alat tulis", "benda"],
  ["dokter", "tenaga kesehatan", "pekerja"], ["segitiga", "bangun datar", "bangun geometri"], ["paus", "mamalia", "hewan"], ["jeruk", "buah", "makanan"], ["meja", "perabot", "benda"]];
const NON = ["blorg", "kiplat", "zumen", "trapi", "vekos", "lundar", "morvin", "tesqu", "dalpo", "rintu", "gavel", "sorki", "bunzo", "peltra", "ximar", "wokan", "jelto", "nirba", "casul", "dovek"];
function syllogism(d) {
  const t = choose(R(d, ["A", "C"], ["A", "B", "C"], ["B", "C", "D", "E"])), [A, B, C] = d === "easy" ? choose(REAL) : shuffle(NON).slice(0, 3), X = choose(["Rina", "Dani", "Toni", "Lisa", "Hadi", "Maya", "Yoga", "Sari", "Bimo", "Nita"]);
  const P = {
    A: [`Semua ${A} adalah ${B}.`, `Semua ${B} adalah ${C}.`, `Semua ${A} adalah ${C}`, [`Semua ${C} adalah ${A}`, `Tidak ada ${A} yang merupakan ${C}`, "Tidak dapat disimpulkan"], "Jika A ⊂ B dan B ⊂ C, maka A ⊂ C."],
    B: [`Tidak ada ${B} yang merupakan ${C}.`, `Semua ${A} adalah ${B}.`, `Tidak ada ${A} yang merupakan ${C}`, [`Semua ${A} adalah ${C}`, `Sebagian ${A} adalah ${C}`, `Semua ${C} adalah ${A}`], `${A} termasuk ${B}, dan ${B} terpisah dari ${C}.`],
    C: [`Semua ${A} adalah ${B}.`, `${X} adalah ${A}.`, `${X} adalah ${B}`, [`${X} bukan ${B}`, `Semua ${B} adalah ${A}`, "Tidak dapat disimpulkan"], `${X} termasuk ${A}, dan semua ${A} adalah ${B}.`],
    D: [`Semua ${A} adalah ${B}.`, `Sebagian ${C} adalah ${A}.`, `Sebagian ${C} adalah ${B}`, [`Semua ${C} adalah ${B}`, `Tidak ada ${C} yang merupakan ${B}`, `Sebagian ${B} bukan ${A}`], `Anggota ${C} yang termasuk ${A} pasti termasuk ${B}.`],
    E: [`Semua ${A} adalah ${B}.`, `Semua ${C} adalah ${B}.`, "Tidak dapat disimpulkan", [`Semua ${A} adalah ${C}`, `Semua ${C} adalah ${A}`, `Tidak ada ${A} yang merupakan ${C}`], `${A} dan ${C} sama-sama termasuk ${B}, tetapi hubungan keduanya tidak ditentukan.`]
  }[t];
  return mc(`Premis 1: ${P[0]}\nPremis 2: ${P[1]}\nKesimpulan yang pasti benar adalah ...`, P[2], P[3], P[4]);
}

const PQ = [["hari hujan", "jalanan basah"], ["Dina rajin belajar", "Dina lulus ujian"], ["bel berbunyi", "siswa masuk kelas"], ["suhu mencapai 100°C", "air mendidih"], ["lampu merah menyala", "kendaraan berhenti"],
  ["Budi menabung setiap hari", "tabungan Budi bertambah"], ["matahari terbenam", "hari menjadi gelap"], ["listrik padam", "lampu mati"], ["tanaman disiram", "tanaman tumbuh subur"], ["Andi berlatih rutin", "Andi menjadi juara"],
  ["es dipanaskan", "es mencair"], ["baterai habis", "ponsel mati"], ["api menyala", "asap muncul"], ["hujan deras turun", "sungai meluap"], ["Rudi sakit", "Rudi tidak masuk sekolah"],
  ["sinyal hilang", "telepon terputus"], ["guru masuk kelas", "siswa berdiri"], ["lampu dinyalakan", "ruangan terang"], ["bensin habis", "motor berhenti"], ["ujian dimulai", "siswa mengerjakan soal"],
  ["musim kemarau tiba", "sumur mengering"], ["air dibekukan", "air menjadi es"], ["Tika menabung", "Tika bisa membeli sepeda"], ["pintu dikunci", "pencuri tidak bisa masuk"], ["alarm berbunyi", "penghuni terbangun"],
  ["Sari makan buah", "Sari mendapat vitamin"], ["jalan diperbaiki", "perjalanan menjadi lancar"], ["kopi dibiarkan", "kopi menjadi dingin"], ["hujan tidak turun", "sawah kekeringan"], ["kereta datang", "penumpang naik"]];
const NEG = bank([
  "2|Negasi dari “Semua siswa membawa buku” adalah ...|Ada siswa yang tidak membawa buku|Semua siswa tidak membawa buku~Tidak ada siswa yang membawa buku~Beberapa siswa membawa buku|Negasi “semua” adalah “ada yang tidak”.",
  "3|Negasi dari “Ada kucing yang berwarna putih” adalah ...|Semua kucing tidak berwarna putih|Ada kucing yang tidak berwarna putih~Semua kucing berwarna putih~Beberapa kucing berwarna putih|Negasi “ada” adalah “semua tidak”.",
  "2|Negasi dari “Semua burung dapat terbang” adalah ...|Ada burung yang tidak dapat terbang|Semua burung tidak dapat terbang~Tidak ada burung yang terbang~Beberapa burung dapat terbang|Negasi “semua” adalah “ada yang tidak”.",
  "2|Negasi dari “Tidak ada siswa yang terlambat” adalah ...|Ada siswa yang terlambat|Semua siswa terlambat~Semua siswa tidak terlambat~Beberapa siswa tidak terlambat|Negasi “tidak ada” adalah “ada”.",
  "2|Negasi dari “Hari ini cerah” adalah ...|Hari ini tidak cerah|Hari ini mendung dan hujan~Besok cerah~Kemarin tidak cerah|Negasi pernyataan tunggal cukup ditambah “tidak”.",
  "3|Negasi dari “Ada siswa yang menyukai matematika” adalah ...|Semua siswa tidak menyukai matematika|Ada siswa yang tidak menyukai matematika~Semua siswa menyukai matematika~Tidak ada siswa yang tidak menyukai matematika|Negasi “ada” adalah “semua tidak”.",
  "3|Negasi dari “Ia rajin dan pandai” adalah ...|Ia tidak rajin atau tidak pandai|Ia tidak rajin dan tidak pandai~Ia rajin atau pandai~Ia tidak rajin tetapi pandai|Hukum De Morgan: ¬(p ∧ q) ≡ ¬p ∨ ¬q.",
  "3|Negasi dari “Ia membawa payung atau jas hujan” adalah ...|Ia tidak membawa payung dan tidak membawa jas hujan|Ia tidak membawa payung atau jas hujan saja~Ia membawa payung dan jas hujan~Ia membawa salah satunya|Hukum De Morgan: ¬(p ∨ q) ≡ ¬p ∧ ¬q.",
  "3|Negasi dari “Jika hujan maka jalanan basah” adalah ...|Hujan dan jalanan tidak basah|Tidak hujan dan jalanan basah~Jika tidak hujan maka jalanan tidak basah~Jika jalanan basah maka hujan|Negasi p → q adalah p ∧ ¬q."
]);
function statement(d) {
  if (d !== "easy" && Math.random() < .3) return mcItem(pickBank(NEG, d));
  const [p, q] = choose(PQ), t = choose(R(d, ["mp"], ["mp", "mt", "contra"], ["mt", "ac", "da", "contra"])), nq = `Tidak benar bahwa ${q}`, np = `Tidak benar bahwa ${p}`, cs = "Tidak dapat disimpulkan";
  const pre = `Jika ${p}, maka ${q}.`;
  const T = { mp: [`${pre}\nDiketahui: ${p}.`, q, [nq, np, cs], "Modus ponens: p → q dan p, maka q."],
    mt: [`${pre}\nDiketahui: ${nq}.`, np, [p, q, cs], "Modus tollens: p → q dan ¬q, maka ¬p."],
    ac: [`${pre}\nDiketahui: ${q}.`, cs, [p, np, nq], "Q benar tidak memastikan P benar (kekeliruan mengafirmasi konsekuen)."],
    da: [`${pre}\nDiketahui: ${np}.`, cs, [q, nq, p], "P salah tidak memastikan Q salah (kekeliruan menyangkal anteseden)."],
    contra: [`Pernyataan: ${pre}\nManakah yang ekuivalen dengan pernyataan itu (kontraposisi)?`, `Jika tidak benar bahwa ${q}, maka tidak benar bahwa ${p}.`, [`Jika ${q}, maka ${p}.`, `Jika tidak benar bahwa ${p}, maka tidak benar bahwa ${q}.`, `Jika ${p}, maka tidak benar bahwa ${q}.`], "Kontraposisi dari p → q adalah ¬q → ¬p."] }[t];
  return mc(`${T[0]}${t === "contra" ? "" : "\nKesimpulan yang pasti benar adalah ..."}`, T[1], T[2], T[3]);
}

const CAUSE = bank([
  "1|Ibu lupa menyiram tanaman selama dua minggu. Akibat yang paling mungkin adalah ...|Tanaman layu|Tanaman tumbuh subur~Tanaman berbuah banyak~Tanaman berpindah tempat|Kekurangan air membuat tanaman layu.",
  "1|Budi terjatuh di jalan. Penyebab yang paling masuk akal adalah ...|Jalanan licin|Hari cerah~Budi sedang makan~Jalanan kering dan rata|Jalan licin mudah membuat orang terjatuh.",
  "2|Debit air waduk menurun drastis pada musim kemarau panjang. Penyebab paling logis adalah ...|Hujan jarang turun|Ikan di waduk bertambah~Waduk terlalu luas~Hari libur nasional|Kurang hujan mengurangi pasokan air.",
  "2|Setelah lampu jalan dipasang, jumlah kecelakaan malam hari berkurang. Penjelasan paling tepat adalah ...|Jarak pandang pengemudi menjadi lebih baik|Kendaraan menjadi lebih cepat~Pengemudi menjadi lebih mengantuk~Jalan menjadi lebih sempit|Penerangan meningkatkan jarak pandang.",
  "3|Penjualan es krim dan jumlah orang berenang sama-sama naik saat musim panas. Kesimpulan paling tepat adalah ...|Keduanya dipengaruhi oleh suhu tinggi, bukan saling menyebabkan|Es krim membuat orang berenang~Berenang membuat es krim terjual~Es krim menaikkan suhu udara|Hubungan dua hal tidak selalu sebab-akibat; ada faktor ketiga (suhu).",
  "3|Sekolah menambah jam pelajaran, tetapi nilai siswa tidak naik. Penjelasan yang paling hati-hati adalah ...|Lamanya belajar belum tentu efektif tanpa kualitas pembelajaran|Siswa pasti malas~Guru pasti tidak mengajar~Nilai tidak mungkin dapat naik|Jangan menyimpulkan berlebihan; ada banyak faktor lain.",
  "1|Rina minum air putih banyak sehabis olahraga. Akibat yang paling mungkin adalah ...|Rasa hausnya hilang|Ia semakin lapar~Ia menjadi mengantuk~Ia kedinginan|Minum air mengatasi haus.",
  "1|Jalan menuju sekolah tertutup pohon tumbang. Akibat yang paling mungkin adalah ...|Siswa sulit lewat|Siswa lebih cepat tiba~Jalan menjadi lebar~Sekolah libur selamanya|Pohon tumbang menghalangi jalan.",
  "1|Baju Ali basah kuyup. Penyebab yang paling masuk akal adalah ...|Ia kehujanan|Ia sedang tidur~Hari sangat panas dan kering~Ia sedang membaca|Hujan membuat baju basah.",
  "1|Sepeda Dedi tidak bisa melaju karena ...|Rantainya putus|Ban terisi penuh~Rodanya baru~Dedi sedang makan|Rantai putus membuat sepeda tidak bisa berjalan.",
  "1|Nilai ulangan Tika naik setelah ia rajin belajar. Penyebab kenaikan nilainya adalah ...|Tika rajin belajar|Tika sering bermain~Soal menjadi lebih mudah saja~Tika tidur lebih lama|Belajar rajin meningkatkan hasil.",
  "1|Makanan itu cepat basi. Penyebab yang paling mungkin adalah ...|Disimpan di tempat panas dan terbuka|Disimpan di kulkas~Dibungkus rapat dan dingin~Baru dimasak|Suhu panas mempercepat pembusukan.",
  "2|Banyak ikan mati di sungai setelah pabrik membuang limbah. Penyebab paling logis adalah ...|Limbah mencemari air sungai|Ikan terlalu banyak makan~Sungai terlalu dalam~Air sungai terlalu dingin|Limbah mencemari air dan membahayakan ikan.",
  "2|Harga cabai naik tajam saat panen gagal. Penjelasan paling tepat adalah ...|Pasokan cabai berkurang|Permintaan cabai hilang~Petani menurunkan harga~Pedagang kekurangan uang|Pasokan sedikit dengan permintaan tetap menaikkan harga.",
  "2|Siswa yang sarapan lebih mudah berkonsentrasi. Penjelasan yang paling tepat adalah ...|Tubuh memperoleh energi untuk berpikir|Sarapan membuat jam pelajaran lebih singkat~Sarapan membuat soal lebih mudah~Siswa lain tidak berkonsentrasi|Energi dari makanan mendukung konsentrasi.",
  "2|Kota itu sering macet setelah jumlah kendaraan bertambah pesat. Penyebabnya adalah ...|Kapasitas jalan tidak sebanding dengan jumlah kendaraan|Jalan menjadi sepi~Lampu lalu lintas dicabut~Kendaraan berkurang|Kendaraan bertambah sementara jalan tetap.",
  "2|Setelah rutin berolahraga, kesehatan Pak Doni membaik. Hubungan yang paling mungkin adalah ...|Olahraga membantu meningkatkan kebugaran|Pak Doni semakin tua~Kesehatan tidak berkaitan dengan olahraga~Pak Doni berhenti makan|Olahraga rutin menyehatkan tubuh.",
  "2|Listrik padam di seluruh desa. Penyebab yang paling mungkin adalah ...|Gardu induk mengalami gangguan|Semua warga tidur~Semua lampu baru~Hari sedang cerah|Gangguan sumber listrik memadamkan satu wilayah.",
  "3|Angka kriminalitas turun setelah patroli ditambah. Kesimpulan yang paling hati-hati adalah ...|Penambahan patroli mungkin berperan, tetapi faktor lain perlu diperiksa|Patroli pasti satu-satunya penyebab~Kriminalitas tidak berkaitan dengan patroli~Penduduk pasti berkurang|Korelasi tidak otomatis berarti satu-satunya sebab.",
  "3|Siswa yang memakai kacamata cenderung nilainya tinggi. Kesimpulan yang tepat adalah ...|Kacamata tidak otomatis menyebabkan nilai tinggi|Kacamata membuat siswa pintar~Siswa pintar pasti berkacamata~Nilai tinggi membuat mata rusak|Dua hal yang berjalan bersama belum tentu saling menyebabkan.",
  "3|Toko A lebih ramai setelah mengganti logo. Penjelasan yang paling hati-hati adalah ...|Banyak faktor dapat berperan, termasuk promosi dan lokasi|Logo pasti penyebab satu-satunya~Logo tidak mungkin berpengaruh~Pelanggan pasti pindah dari toko lain|Sebab-akibat memerlukan bukti yang lebih kuat.",
  "3|Petani menanam varietas baru dan panennya naik, tetapi musim itu juga sangat baik. Penjelasan yang tepat adalah ...|Kenaikan panen dapat disebabkan varietas baru, musim, atau keduanya|Varietas baru pasti penyebabnya~Musim pasti penyebabnya~Panen tidak mungkin naik|Ada lebih dari satu faktor yang bekerja bersamaan."
]);
const CE = [["Ibu lupa menyiram tanaman selama dua minggu", "tanaman layu"], ["Budi tidak membawa payung saat hujan deras", "bajunya basah kuyup"], ["Adik makan terlalu banyak permen", "giginya berlubang"],
  ["Lampu kamar lupa dimatikan semalaman", "tagihan listrik membengkak"], ["Rani tidur larut malam setiap hari", "ia mengantuk di sekolah"], ["Bensin motor Ayah habis di jalan", "motornya mogok"],
  ["Sampah dibuang ke selokan", "selokan tersumbat"], ["Petani menyiram sawah secara teratur", "padinya tumbuh subur"], ["Bola mengenai kaca jendela", "kacanya pecah"], ["Dina tidak mengerjakan PR", "ia ditegur guru"],
  ["Es krim dibiarkan di bawah matahari", "es krim meleleh"], ["Dika tidak menyikat gigi", "giginya kotor"], ["Ayam tidak diberi makan seharian", "ayam kelaparan"], ["Pintu kulkas dibiarkan terbuka", "makanan cepat rusak"],
  ["Ani belajar dengan giat", "nilainya meningkat"], ["Sungai dipenuhi sampah", "air sungai tercemar"], ["Pohon di lereng gunung ditebang", "terjadi tanah longsor"], ["Warga menanam banyak pohon", "udara menjadi lebih sejuk"],
  ["Ban sepeda tertusuk paku", "ban menjadi kempis"], ["Rina lupa membawa kunci", "ia tidak bisa masuk rumah"], ["Air dipanaskan terus-menerus", "air mendidih dan menguap"], ["Siswa datang terlambat", "ia tertinggal pelajaran pertama"]];
function causeGen() {
  const e = choose(CE), others = shuffle(CE.filter(o => o !== e));
  if (Math.random() < .5) return mc(`${e[0]}. Akibat yang paling mungkin adalah ...`, e[1], others.slice(0, 3).map(o => o[1]), `${e[0]}, sehingga ${e[1]}.`);
  return mc(`${e[1][0].toUpperCase() + e[1].slice(1)}. Penyebab yang paling masuk akal adalah ...`, e[0], others.slice(0, 3).map(o => o[0]), `${e[0]}, sehingga ${e[1]}.`);
}
const CONF = [["penjualan es krim", "jumlah orang yang berenang", "suhu udara yang tinggi"], ["penjualan payung", "jumlah kecelakaan lalu lintas", "musim hujan"],
  ["jumlah pemadam kebakaran yang datang", "besarnya kerugian kebakaran", "besarnya api"], ["ukuran sepatu anak", "kemampuan membacanya", "usia anak"],
  ["penjualan penghangat ruangan", "jumlah penderita flu", "musim dingin"], ["penjualan kipas angin", "kasus sengatan panas", "cuaca yang sangat panas"],
  ["jumlah toko buku", "jumlah perpustakaan", "jumlah penduduk kota"], ["penjualan jaket tebal", "jumlah pendaki gunung", "musim liburan di daerah dingin"]];
function confGen() {
  const [a, b, c] = choose(CONF);
  return mc(`${a[0].toUpperCase() + a.slice(1)} dan ${b} sama-sama meningkat pada waktu yang sama. Kesimpulan yang paling tepat adalah ...`, `Keduanya kemungkinan dipengaruhi faktor lain, yaitu ${c}`,
    [`${a[0].toUpperCase() + a.slice(1)} menyebabkan ${b}`, `${b[0].toUpperCase() + b.slice(1)} menyebabkan ${a}`, "Keduanya pasti tidak berhubungan sama sekali"], "Dua hal yang naik bersamaan belum tentu saling menyebabkan; mungkin ada faktor ketiga.");
}
function cause(d) { const r = Math.random(); return d === "hard" ? (r < .45 ? confGen() : mcItem(pickBank(CAUSE, d))) : (r < .6 ? causeGen() : mcItem(pickBank(CAUSE, d))); }
const NM = ["Andi", "Budi", "Cici", "Dodi", "Eka", "Fina"];
function puzzle(d) {
  if (d !== "easy" && Math.random() < .35) { const c = randInt(8, 14), x = randInt(2, 6), y = randInt(2, 6), sum = Math.random() < .5 && d === "hard";
    return num(`Ani ${x} tahun lebih tua dari Budi. Budi ${y} tahun lebih tua dari Cici. Cici berumur ${c} tahun. Berapa ${sum ? "jumlah umur ketiganya" : "umur Ani"}?`, sum ? c + (c + y) + (c + x + y) : c + x + y,
      `Budi = ${c} + ${y} = ${c + y}; Ani = ${c + y} + ${x} = ${c + x + y}.${sum ? ` Jumlah = ${c} + ${c + y} + ${c + x + y}.` : ""}`); }
  const n = R(d, 3, 4, 5), o = shuffle(NM).slice(0, n), st = shuffle(o.slice(0, -1).map((x, i) => `${x} lebih tinggi daripada ${o[i + 1]}.`)).join("\n");
  const q = R(d, [0, "tertinggi"], choose([[0, "tertinggi"], [n - 1, "terpendek"]]), choose([[1, "tertinggi kedua"], [n - 2, "terpendek kedua"], [2, "berada di tengah"]]));
  return mc(`${st}\nSiapa yang ${q[1]}?`, o[q[0]], o, `Urutkan dari tertinggi: ${o.join(" > ")}. Jadi yang ${q[1]} adalah ${o[q[0]]}.`);
}
const REASON = bank([
  "1|Semua mamalia bernapas dengan paru-paru. Paus adalah mamalia. Maka paus bernapas dengan paru-paru. Jenis penalarannya adalah ...|Deduktif|Induktif~Analogi~Sebab-akibat|Dari aturan umum ke kasus khusus.",
  "1|Lima ekor kucing yang diamati makan ikan, sehingga disimpulkan semua kucing makan ikan. Jenis penalarannya adalah ...|Induktif|Deduktif~Silogisme~Sebab-akibat|Dari kasus khusus ke kesimpulan umum.",
  "2|Setiap pagi selama seminggu matahari terbit di timur, sehingga disimpulkan matahari selalu terbit di timur. Kesimpulan ini bersifat ...|Induktif|Deduktif~Pasti benar secara logis~Tidak berdasarkan pengamatan|Generalisasi dari pengamatan.",
  "2|Manakah yang merupakan penalaran deduktif?|Semua logam menghantarkan listrik; tembaga logam; jadi tembaga menghantarkan listrik.|Tiga besi diuji dan menghantarkan listrik; jadi semua logam menghantarkan listrik.~Hari ini mendung; jadi besok pasti hujan.~Tetangga membawa payung; jadi hujan.|Deduktif bergerak dari premis umum ke kesimpulan khusus.",
  "3|Seorang peneliti menemukan 100 angsa putih dan menyimpulkan semua angsa putih. Kelemahan kesimpulan itu adalah ...|Satu angsa yang tidak putih sudah cukup membantahnya|Jumlah angsa terlalu banyak~Angsa tidak dapat diamati~Warna putih tidak ada|Kesimpulan induktif hanya mungkin benar, bukan pasti.",
  "3|Jika premis-premis benar dan bentuk argumen deduktif valid, maka kesimpulannya ...|pasti benar|mungkin benar~biasanya benar~tidak dapat diuji|Kevalidan deduktif menjamin kesimpulan benar bila premis benar."
]);
const DED = [["mamalia", "bernapas dengan paru-paru", "Paus"], ["burung", "memiliki sayap", "Elang"], ["logam", "menghantarkan listrik", "Tembaga"], ["segitiga", "memiliki tiga sisi", "Bangun ABC"],
  ["siswa kelas VI", "mengikuti ujian akhir", "Rani"], ["tumbuhan hijau", "melakukan fotosintesis", "Padi"], ["bilangan genap", "habis dibagi dua", "Bilangan 18"], ["reptil", "berdarah dingin", "Kadal"],
  ["planet", "mengelilingi matahari", "Mars"], ["serangga", "memiliki enam kaki", "Semut"], ["warga negara", "wajib membayar pajak", "Pak Ali"], ["besi", "memuai jika dipanaskan", "Rel kereta"]];
const IND = [["kucing yang ia lihat", "menyukai ikan", "kucing"], ["apel dari kebun itu", "manis rasanya", "apel kebun itu"], ["burung gereja yang diamati", "dapat terbang", "burung gereja"],
  ["siswa di kelasnya", "menyukai olahraga", "siswa kelas itu"], ["mangga dari pohon itu", "bergetah", "mangga pohon itu"], ["ayam di peternakan itu", "bertelur setiap hari", "ayam peternakan itu"],
  ["pasien yang minum obat itu", "sembuh", "pasien yang minum obat itu"], ["sungai di daerah itu", "mengalir ke laut", "sungai daerah itu"], ["bunga di taman itu", "mekar di pagi hari", "bunga taman itu"],
  ["batu yang dijatuhkan", "jatuh ke bawah", "batu"]];
const TYPES = ["Deduktif", "Induktif", "Analogi", "Sebab-akibat"];
function reasonGen(d) {
  const deductive = Math.random() < .5, n = choose([3, 5, 10, 20, 100]);
  if (deductive) { const [a, p, x] = choose(DED);
    return mc(`Semua ${a} ${p}. ${x} adalah ${a}. Maka ${x.charAt(0).toLowerCase() + x.slice(1)} ${p}.\nJenis penalarannya adalah ...`, "Deduktif", ["Induktif", "Analogi", "Sebab-akibat"], "Dari premis umum (semua ...) ke kesimpulan khusus: deduktif."); }
  const [obs, p, gen] = choose(IND), lv = choose(d === "easy" ? [1] : [2, 3]);
  if (lv === 1) return mc(`Seorang anak mengamati ${n} ${obs} dan semuanya ${p}. Ia menyimpulkan bahwa semua ${gen} ${p}.\nJenis penalarannya adalah ...`, "Induktif", ["Deduktif", "Analogi", "Sebab-akibat"], "Dari kasus-kasus khusus ke kesimpulan umum: induktif.");
  return mc(`Setelah memeriksa ${n} ${obs} yang ${p}, seorang peneliti menyimpulkan semua ${gen} ${p}. Kesimpulan ini bersifat ...`, "mungkin benar, tetapi tidak pasti", ["pasti benar", "pasti salah", "tidak dapat diuji sama sekali"], "Kesimpulan induktif bersifat probabilitas: mungkin benar, tidak pasti.");
}
function reasoning(d) { return Math.random() < .35 ? mcItem(pickBank(REASON, d)) : reasonGen(d); }
export function generateLogic(sub, d) {
  const t = sub === "mixed" ? choose(["series", "shape", "analogy", "syllogism", "statement", "cause", "puzzle", "reasoning"]) : sub;
  return ({ series: () => series(d), shape: () => shape(d), analogy: () => analogy(d), syllogism: () => syllogism(d), statement: () => statement(d),
    cause: () => cause(d), puzzle: () => puzzle(d), reasoning: () => reasoning(d) })[t]();
}
