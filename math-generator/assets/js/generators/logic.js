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

const CYC = [["▲", "▶", "▼", "◀"], ["○", "◔", "◑", "◕", "●"], ["□", "▣", "■"], ["←", "↖", "↑", "↗", "→"], ["◇", "◆", "◈"]];
function shape(d) {
  const t = choose(R(d, ["cycle"], ["cycle", "grow"], ["inter", "grow", "cycle"]));
  if (t === "grow") { const a = randInt(1, 3), k = randInt(1, 3), g = choose(["●", "■", "★"]);
    return num(`Pola bentuk: ${[0, 1, 2, 3].map(i => g.repeat(a + i * k)).join("  |  ")}  | ...\nBerapa jumlah ${g} pada bentuk ke-6?`, a + 5 * k, `Setiap bentuk bertambah ${k} ${g}. Bentuk ke-6 = ${a} + 5 × ${k} = ${a + 5 * k}.`); }
  const cyc = choose(CYC), extra = choose(CYC.filter(c => c !== cyc));
  if (t === "cycle") { const k = cyc.length + (d === "hard" ? 1 : 2), s = Array.from({ length: k + 1 }, (_, i) => cyc[i % cyc.length]);
    return mc(`Lanjutkan pola: ${s.slice(0, k).join(" ")} ?`, s[k], [...cyc, ...extra], `Pola berulang setiap ${cyc.length} bentuk: ${cyc.join(" ")}.`); }
  const A = cyc, B = extra, s = Array.from({ length: 8 }, (_, i) => i % 2 ? B[((i - 1) / 2) % B.length] : A[(i / 2) % A.length]);
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
  "3|Hakim : Putusan = Penulis : ?|Karangan|Pengadilan~Penerbit~Pembaca|Pelaku dan hasil karyanya."
]);
function analogy(d) {
  if (Math.random() < .5) return mcItem(pickBank(ANA, d));
  const f = choose(R(d, [["×", 2], ["×", 3], ["+", 5]], [["×", 4], ["+", 12], ["²"]], [["²+1"], ["³"], ["×", 7, "−1"]])), a = randInt(2, 9), b = randInt(2, 9) + (a === 2 ? 1 : 0);
  const fn = x => f[0] === "×" ? (f[2] ? x * f[1] - 1 : x * f[1]) : f[0] === "+" ? x + f[1] : f[0] === "²" ? x * x : f[0] === "³" ? x ** 3 : x * x + 1;
  const rule = f[0] === "×" ? (f[2] ? `dikali ${f[1]} lalu dikurangi 1` : `dikali ${f[1]}`) : f[0] === "+" ? `ditambah ${f[1]}` : f[0] === "²" ? "dikuadratkan" : f[0] === "³" ? "dipangkatkan tiga" : "dikuadratkan lalu ditambah 1";
  return num(`${a} : ${fn(a)} = ${b} : ?`, fn(b), `Aturannya: bilangan pertama ${rule}. Jadi ${b} → ${fn(b)}.`);
}

const REAL = [["kucing", "hewan", "makhluk hidup"], ["mawar", "bunga", "tumbuhan"], ["apel", "buah", "makanan"], ["kursi", "perabot", "benda"]];
const NON = ["blorg", "kiplat", "zumen", "trapi", "vekos", "lundar"];
function syllogism(d) {
  const t = choose(R(d, ["A"], ["A", "B", "C"], ["B", "C", "D", "E"])), [A, B, C] = (t === "A" && d === "easy") ? choose(REAL) : shuffle(NON).slice(0, 3), X = choose(["Rina", "Dani", "Toni"]);
  const P = {
    A: [`Semua ${A} adalah ${B}.`, `Semua ${B} adalah ${C}.`, `Semua ${A} adalah ${C}`, [`Semua ${C} adalah ${A}`, `Tidak ada ${A} yang merupakan ${C}`, "Tidak dapat disimpulkan"], "Jika A ⊂ B dan B ⊂ C, maka A ⊂ C."],
    B: [`Tidak ada ${B} yang merupakan ${C}.`, `Semua ${A} adalah ${B}.`, `Tidak ada ${A} yang merupakan ${C}`, [`Semua ${A} adalah ${C}`, `Sebagian ${A} adalah ${C}`, `Semua ${C} adalah ${A}`], `${A} termasuk ${B}, dan ${B} terpisah dari ${C}.`],
    C: [`Semua ${A} adalah ${B}.`, `${X} adalah ${A}.`, `${X} adalah ${B}`, [`${X} bukan ${B}`, `Semua ${B} adalah ${A}`, "Tidak dapat disimpulkan"], `${X} termasuk ${A}, dan semua ${A} adalah ${B}.`],
    D: [`Semua ${A} adalah ${B}.`, `Sebagian ${C} adalah ${A}.`, `Sebagian ${C} adalah ${B}`, [`Semua ${C} adalah ${B}`, `Tidak ada ${C} yang merupakan ${B}`, `Sebagian ${B} bukan ${A}`], `Anggota ${C} yang termasuk ${A} pasti termasuk ${B}.`],
    E: [`Semua ${A} adalah ${B}.`, `Semua ${C} adalah ${B}.`, "Tidak dapat disimpulkan", [`Semua ${A} adalah ${C}`, `Semua ${C} adalah ${A}`, `Tidak ada ${A} yang merupakan ${C}`], `${A} dan ${C} sama-sama termasuk ${B}, tetapi hubungan keduanya tidak ditentukan.`]
  }[t];
  return mc(`Premis 1: ${P[0]}\nPremis 2: ${P[1]}\nKesimpulan yang pasti benar adalah ...`, P[2], P[3], P[4]);
}

const PQ = [["hari hujan", "jalanan basah"], ["Dina rajin belajar", "Dina lulus ujian"], ["bel berbunyi", "siswa masuk kelas"], ["suhu mencapai 100°C", "air mendidih"]];
const NEG = bank([
  "2|Negasi dari “Semua siswa membawa buku” adalah ...|Ada siswa yang tidak membawa buku|Semua siswa tidak membawa buku~Tidak ada siswa yang membawa buku~Beberapa siswa membawa buku|Negasi “semua” adalah “ada yang tidak”.",
  "3|Negasi dari “Ada kucing yang berwarna putih” adalah ...|Semua kucing tidak berwarna putih|Ada kucing yang tidak berwarna putih~Semua kucing berwarna putih~Beberapa kucing berwarna putih|Negasi “ada” adalah “semua tidak”.",
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
    contra: [`Pernyataan: ${pre}\nManakah yang ekuivalen dengan pernyataan itu (kontraposisi)?`, `Jika ${nq.toLowerCase()}, maka ${np.toLowerCase()}.`, [`Jika ${q}, maka ${p}.`, `Jika ${np.toLowerCase()}, maka ${nq.toLowerCase()}.`, `Jika ${p}, maka ${nq.toLowerCase()}.`], "Kontraposisi dari p → q adalah ¬q → ¬p."] }[t];
  return mc(`${T[0]}${t === "contra" ? "" : "\nKesimpulan yang pasti benar adalah ..."}`, T[1], T[2], T[3]);
}

const CAUSE = bank([
  "1|Ibu lupa menyiram tanaman selama dua minggu. Akibat yang paling mungkin adalah ...|Tanaman layu|Tanaman tumbuh subur~Tanaman berbuah banyak~Tanaman berpindah tempat|Kekurangan air membuat tanaman layu.",
  "1|Budi terjatuh di jalan. Penyebab yang paling masuk akal adalah ...|Jalanan licin|Hari cerah~Budi sedang makan~Jalanan kering dan rata|Jalan licin mudah membuat orang terjatuh.",
  "2|Debit air waduk menurun drastis pada musim kemarau panjang. Penyebab paling logis adalah ...|Hujan jarang turun|Ikan di waduk bertambah~Waduk terlalu luas~Hari libur nasional|Kurang hujan mengurangi pasokan air.",
  "2|Setelah lampu jalan dipasang, jumlah kecelakaan malam hari berkurang. Penjelasan paling tepat adalah ...|Jarak pandang pengemudi menjadi lebih baik|Kendaraan menjadi lebih cepat~Pengemudi menjadi lebih mengantuk~Jalan menjadi lebih sempit|Penerangan meningkatkan jarak pandang.",
  "3|Penjualan es krim dan jumlah orang berenang sama-sama naik saat musim panas. Kesimpulan paling tepat adalah ...|Keduanya dipengaruhi oleh suhu tinggi, bukan saling menyebabkan|Es krim membuat orang berenang~Berenang membuat es krim terjual~Es krim menaikkan suhu udara|Hubungan dua hal tidak selalu sebab-akibat; ada faktor ketiga (suhu).",
  "3|Sekolah menambah jam pelajaran, tetapi nilai siswa tidak naik. Penjelasan yang paling hati-hati adalah ...|Lamanya belajar belum tentu efektif tanpa kualitas pembelajaran|Siswa pasti malas~Guru pasti tidak mengajar~Nilai tidak mungkin dapat naik|Jangan menyimpulkan berlebihan; ada banyak faktor lain."
]);
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
export function generateLogic(sub, d) {
  const t = sub === "mixed" ? choose(["series", "shape", "analogy", "syllogism", "statement", "cause", "puzzle", "reasoning"]) : sub;
  return ({ series: () => series(d), shape: () => shape(d), analogy: () => analogy(d), syllogism: () => syllogism(d), statement: () => statement(d),
    cause: () => mcItem(pickBank(CAUSE, d)), puzzle: () => puzzle(d), reasoning: () => mcItem(pickBank(REASON, d)) })[t]();
}
