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
import { shuffle } from "./utils.js";

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

export function createQuestions(topic, subtype, difficulty, count, shouldShuffle) {
  const gen = TOPICS[topic].gen, seen = new Set(), questions = [];
  while (questions.length < count) {
    let q;
    for (let t = 0; t < 40; t++) { q = gen(subtype, difficulty); if (!seen.has(q.prompt + (q.memorize?.content || ""))) break; } // hindari soal kembar
    seen.add(q.prompt + (q.memorize?.content || ""));
    questions.push({ ...q, id: questions.length + 1, userAnswer: "" });
  }
  return shouldShuffle ? shuffle(questions) : questions;
}
