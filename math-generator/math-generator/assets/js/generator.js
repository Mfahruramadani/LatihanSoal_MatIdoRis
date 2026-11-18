import { generateArithmetic } from "./generators/arithmetic.js";
import { generateInteger } from "./generators/integers.js";
import { generateFraction } from "./generators/fractions.js";
import { generateOrdering } from "./generators/ordering.js";
import { generateLCM } from "./generators/lcm.js";
import { generateGCD } from "./generators/gcd.js";
import { generateDecimal } from "./generators/decimals.js";
import { generatePercent } from "./generators/percent.js";
import { generatePower } from "./generators/powers.js";
import { generateFactor } from "./generators/factors.js";
import { generateMixedFraction } from "./generators/mixedfractions.js";
import { generateRounding } from "./generators/rounding.js";
import { generateEnglish } from "./generators/english.js";
import { generateEnglishPlus } from "./generators/english2.js";
import { generateIndonesian } from "./generators/indonesian.js";
import { generateRatio, generateUnits, generateSocial, generateAlgebra, generateNegative } from "./generators/mathplus.js";
import { generateLogic } from "./generators/logic.js";
import { generateSpeed } from "./generators/speed.js";
import { generateMemory } from "./generators/memory.js";
import { shuffle, hash53 } from "./utils.js";

const OPS = [["mixed","Operasi campuran"],["addition","Penjumlahan"],["subtraction","Pengurangan"],["multiplication","Perkalian"],["division","Pembagian"]];

export const TOPICS = {
  arithmetic: {
    gen: (s, d) => generateArithmetic(s, d),
    title: "Operasi Hitung",
    description: "Latihan operasi hitung dasar dan campuran.",
    subtypes: [
      ["mixed", "Operasi campuran"],
      ["addition", "Penjumlahan"],
      ["subtraction", "Pengurangan"],
      ["multiplication", "Perkalian"],
      ["division", "Pembagian"],
      ["parentheses", "Operasi dengan tanda kurung"]
    ]
  },
  integers: {
    gen: (s, d) => generateInteger(s, d),
    title: "Bilangan Bulat",
    description: "Latihan operasi bilangan positif dan negatif.",
    subtypes: [
      ["mixed", "Operasi campuran"],
      ["addition", "Penjumlahan bilangan bulat"],
      ["subtraction", "Pengurangan bilangan bulat"],
      ["multiplication", "Perkalian bilangan bulat"]
    ]
  },
  fractions: {
    gen: (s, d) => generateFraction(s, d),
    title: "Bilangan Pecahan",
    description: "Latihan operasi pecahan biasa.",
    subtypes: [
      ["mixed", "Operasi campuran"],
      ["addition", "Penjumlahan pecahan"],
      ["subtraction", "Pengurangan pecahan"],
      ["multiplication", "Perkalian pecahan"],
      ["division", "Pembagian pecahan"]
    ]
  },
  ordering: {
    gen: (s, d) => generateOrdering(d),
    title: "Mengurutkan Pecahan",
    description: "Latihan membandingkan dan mengurutkan pecahan.",
    subtypes: [["ordering", "Urutkan pecahan"]]
  },
  lcm: {
    gen: (s, d) => generateLCM(d),
    title: "KPK",
    description: "Latihan kelipatan persekutuan terkecil.",
    subtypes: [["lcm", "Menentukan KPK"]]
  },
  gcd: {
    gen: (s, d) => generateGCD(d),
    title: "FPB",
    description: "Latihan faktor persekutuan terbesar.",
    subtypes: [["gcd", "Menentukan FPB"]]
  },
  decimals: { gen: (s, d) => generateDecimal(s, d), title: "Bilangan Desimal", description: "Tambah, kurang, kali, bagi bilangan desimal.", subtypes: OPS },
  percent: { gen: (s, d) => generatePercent(s, d), title: "Persentase", description: "Persen dari bilangan, diskon, kenaikan, konversi pecahan ke persen.",
    subtypes: [["mixed","Campuran"],["of","Persen dari bilangan"],["discount","Diskon"],["increase","Kenaikan persen"],["convert","Pecahan ke persen"]] },
  powers: { gen: (s, d) => generatePower(s, d), title: "Pangkat dan Akar", description: "Kuadrat, kubik, akar, dan sifat pangkat.",
    subtypes: [["mixed","Campuran"],["square","Kuadrat"],["cube","Pangkat tiga"],["sqrt","Akar kuadrat"],["cbrt","Akar pangkat tiga"],["laws","Sifat pangkat"]] },
  factors: { gen: (s, d) => generateFactor(s, d), title: "Faktor dan Faktorisasi Prima", description: "Faktorisasi prima, banyak faktor, bilangan prima.",
    subtypes: [["mixed","Campuran"],["factorization","Faktorisasi prima"],["count","Banyak faktor"],["isprime","Bilangan prima atau bukan"]] },
  mixedfractions: { gen: (s, d) => generateMixedFraction(s, d), title: "Pecahan Campuran", description: "Ubah bentuk dan operasi pecahan campuran.",
    subtypes: [["mixed","Campuran"],["to_mixed","Ubah ke pecahan campuran"],["to_improper","Ubah ke pecahan biasa"],["add","Penjumlahan"],["subtract","Pengurangan"]] },
  rounding: { gen: (s, d) => generateRounding(s, d), title: "Pembulatan dan Estimasi", description: "Membulatkan bilangan dan menaksir hasil.",
    subtypes: [["mixed","Campuran"],["round","Pembulatan"],["estimate","Estimasi hasil"]] },
  english: { group: "Bahasa Inggris", gen: (s, d) => generateEnglish(s, d), title: "Kosakata Bahasa Inggris", description: "Latihan arti kata per kata: Inggris ke Indonesia dan sebaliknya.",
    note: "Jawab dengan satu kata (atau frasa pendek). Huruf besar/kecil, spasi, dan tanda hubung tidak memengaruhi nilai. Mudah = kata dasar, Sedang = kata sehari-hari, Sulit = kata akademik dan kata sambung.",
    subtypes: [["mixed","Campuran"],["en_id","Inggris → Indonesia"],["id_en","Indonesia → Inggris"]] },
  ratio: { gen: (s, d) => generateRatio(s, d), title: "Perbandingan", description: "Rasio, skala peta, pembagian, senilai dan berbalik nilai.",
    subtypes: [["mixed","Campuran"],["simplify","Menyederhanakan"],["direct","Senilai"],["scale","Skala"],["share","Pembagian"],["inverse","Berbalik nilai"]] },
  negatives: { gen: (s, d) => generateNegative(s, d), title: "Bilangan Negatif (Soal Cerita)", description: "Suhu, kedalaman, saldo, dan operasi bilangan negatif.",
    subtypes: [["mixed","Campuran"],["temp","Suhu"],["compare","Membandingkan"],["depth","Kedalaman"],["balance","Saldo"],["multi","Berlangkah"]] },
  units: { gen: (s, d) => generateUnits(s, d), title: "Konversi Satuan", description: "Panjang, massa, volume, waktu, dan kecepatan.",
    subtypes: [["mixed","Campuran"],["down","Satuan besar ke kecil"],["up","Satuan kecil ke besar"],["compound","Satuan bertingkat"],["speed","Kecepatan"]] },
  social: { gen: (s, d) => generateSocial(s, d), title: "Aritmetika Sosial", description: "Untung rugi, diskon, bunga, pajak, dan tabungan.",
    subtypes: [["mixed","Campuran"],["profit","Untung dan rugi"],["discount","Diskon"],["interest","Bunga tunggal"],["percent","Persentase untung"],["tax","Diskon dan pajak"],["tara","Bruto, tara, neto"],["savings","Tabungan"]] },
  algebra: { gen: (s, d) => generateAlgebra(s, d), title: "Aljabar Dasar", description: "Substitusi, persamaan linear, dan menyederhanakan bentuk aljabar.",
    subtypes: [["mixed","Campuran"],["subst","Substitusi"],["onestep","Persamaan satu langkah"],["twostep","Persamaan dua langkah"],["bothsides","Variabel di dua ruas"],["bracket","Dengan tanda kurung"],["word","Soal cerita"],["simplify","Menyederhanakan"]] },
  englishplus: { group: "Bahasa Inggris", gen: (s, d) => generateEnglishPlus(s, d), title: "English Practice", description: "Angka, hari dan bulan, tata bahasa, sinonim-antonim, frasa, dan menyusun kalimat.",
    subtypes: [["mixed","Campuran"],["numbers","Angka"],["days","Hari dan bulan"],["translate","Terjemahan (pilihan ganda)"],["fill","Melengkapi kalimat"],["pos","Jenis kata (verb, noun, adjective, adverb)"],["synant","Sinonim dan antonim"],["phrases","Frasa sehari-hari"],["order","Menyusun kalimat"]] },
  indonesian: { group: "Bahasa Indonesia", gen: (s, d) => generateIndonesian(s, d), title: "Bahasa Indonesia", description: "Sinonim, antonim, makna kata, kata baku, ejaan, tata bahasa, dan bacaan.",
    subtypes: [["mixed","Campuran"],["synant","Sinonim dan antonim"],["meaning","Makna kata"],["baku","Kata baku"],["ejaan","Ejaan dan tanda baca"],["grammar","Tata bahasa"],["reading","Pemahaman bacaan"]] },
  logic: { group: "Logika", gen: (s, d) => generateLogic(s, d), title: "Latihan Logika", description: "Deret, pola bentuk, analogi, silogisme, logika pernyataan, sebab-akibat, teka-teki, dan penalaran.",
    subtypes: [["mixed","Campuran"],["series","Deret angka"],["shape","Pola gambar dan bentuk"],["analogy","Analogi"],["syllogism","Silogisme"],["statement","Logika pernyataan"],["cause","Sebab-akibat"],["puzzle","Teka-teki logika"],["reasoning","Penalaran deduktif dan induktif"]] },
  speed: { group: "Kecepatan Berpikir", single: true, noBack: true, note: "Setiap soal punya batas waktu sendiri dan berganti otomatis saat waktu habis. Soal yang tidak sempat dijawab dihitung salah.",
    gen: (s, d) => generateSpeed(s, d), title: "Kecepatan Berpikir", description: "Hitung cepat, angka terbesar/terkecil, simbol, pencarian, perbandingan, dan deteksi perubahan pola.",
    subtypes: [["mixed","Campuran"],["calc","Hitung cepat"],["maxmin","Angka terbesar dan terkecil"],["symbol","Pencocokan simbol"],["find","Pencarian angka dan huruf"],["compare","Perbandingan angka"],["diff","Deteksi perbedaan pola"],["change","Reaksi terhadap perubahan pola"]] },
  memory: { group: "Memori", single: true, noBack: true, note: "Informasi ditampilkan beberapa detik lalu disembunyikan. Jawab dari ingatan; informasi tidak bisa dilihat lagi.",
    gen: (s, d) => generateMemory(s, d), title: "Latihan Memori", description: "Urutan angka dan huruf, posisi objek, pasangan kata-gambar, pola visual, daftar benda, dan informasi singkat.",
    subtypes: [["mixed","Campuran"],["digits","Urutan angka"],["letters","Urutan huruf"],["positions","Posisi objek"],["pairs","Pasangan kata dan gambar"],["visual","Pola visual"],["list","Daftar benda"],["info","Informasi singkat"]] }
};

/* ==========================================================
   Anti-duplikat v8
   - Tanda pengenal soal = prompt + jawaban (bukan prompt saja), atau q.key bila diisi generator.
   - Riwayat soal yang pernah keluar disimpan antar-sesi (hash saja) di localStorage.
   - Soal tidak diulang dalam satu sesi. Kalau kumpulan soal baru habis, riwayat
     jenis latihan itu direset (putaran baru). Kalau soal berbeda memang kurang
     dari jumlah yang diminta, jumlah soal dikurangi, bukan diduplikasi.
========================================================== */
const SEEN_KEY = "mathgen-seen-v1", SEEN_CAP = 600, TRIES = 250;
const sigOf = q => (q.key ?? (q.prompt + "||" + q.answer)) + (q.memorize?.content || "");

function loadSeen() { try { return JSON.parse(localStorage.getItem(SEEN_KEY)) || {}; } catch { return {}; } }
function saveSeen(all) { try { localStorage.setItem(SEEN_KEY, JSON.stringify(all)); } catch { /* localStorage tidak tersedia */ } }
export function clearSeen() { try { localStorage.removeItem(SEEN_KEY); } catch { /* abaikan */ } }

export function createQuestions(topic, subtype, difficulty, count, shouldShuffle) {
  const gen = TOPICS[topic].gen, key = `${topic}|${subtype}|${difficulty}`;
  const all = loadSeen();
  let hist = new Set(all[key] || []), order = [...hist], reset = false;
  const session = new Set(), questions = [];
  const draw = avoidHistory => {
    for (let t = 0; t < TRIES; t++) {
      const q = gen(subtype, difficulty), h = hash53(sigOf(q));
      if (session.has(h) || (avoidHistory && hist.has(h))) continue;
      return { q, h };
    }
    return null;
  };
  while (questions.length < count) {
    let r = draw(true);
    if (!r && hist.size) { hist = new Set(); order = []; reset = true; r = draw(false); } // putaran baru
    if (!r) break; // soal berbeda sudah habis
    session.add(r.h);
    if (!hist.has(r.h)) { hist.add(r.h); order.push(r.h); }
    questions.push({ ...r.q, id: questions.length + 1, userAnswer: "" });
  }
  all[key] = order.slice(-SEEN_CAP);
  saveSeen(all);
  const result = shouldShuffle ? shuffle(questions) : questions;
  result.info = { requested: count, produced: questions.length, reset };
  return result;
}

/* Perkiraan banyaknya soal berbeda (estimator Chao1 dari sampel acak). */
const poolCache = new Map();
export function estimatePool(topic, subtype, difficulty) {
  const k = `${topic}|${subtype}|${difficulty}`;
  if (poolCache.has(k)) return poolCache.get(k);
  const gen = TOPICS[topic].gen, N = 600, freq = new Map();
  for (let i = 0; i < N; i++) { const h = hash53(sigOf(gen(subtype, difficulty))); freq.set(h, (freq.get(h) || 0) + 1); }
  const d = freq.size, f1 = [...freq.values()].filter(v => v === 1).length, f2 = [...freq.values()].filter(v => v === 2).length;
  const out = { distinct: d, large: d >= N * 0.9, est: Math.round(d + f1 * (f1 - 1) / (2 * (f2 + 1))) };
  poolCache.set(k, out);
  return out;
}
