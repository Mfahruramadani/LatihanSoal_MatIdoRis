/* ==========================================================
   MENTAL LAB — Sistem progres pemain (XP, Level, Title, Gemcrys)
   Modul ini tidak menyentuh DOM, sehingga mudah diuji dan dikembangkan.
========================================================== */

export const PROGRESS_KEY = "mentallab-progress-v1";

/* ---------- Aturan (satu tempat untuk semua angka) ---------- */
export const RULES = {
  xpPerAnswered: 5,
  xpPerCorrect: 5,
  xpCompletionBonus: 20,
  xpAccuracyBonus80: 30,   // akurasi 80–99%
  xpAccuracyBonus100: 50,  // akurasi 100% (tidak ditumpuk dengan bonus 80%)
  gemcrysPerLevel: 10,
  maxRewardedSessions: 500
};

export const TITLES = [
  { from: 51, title: "Grandmaster" },
  { from: 36, title: "Master" },
  { from: 21, title: "Expert" },
  { from: 11, title: "Scholar" },
  { from: 6, title: "Apprentice" },
  { from: 1, title: "Novice" }
];

/* ---------- Kurva level ---------- */

// Total XP minimum untuk mencapai level L: 25 × (L × (L + 1) − 2)
export function xpForLevel(level) {
  const L = Math.max(1, Math.floor(level));
  return 25 * (L * (L + 1) - 2);
}

// Level tertinggi yang syaratnya terpenuhi oleh total XP (selalu dari total kumulatif).
export function levelFromXp(xp) {
  const total = Math.max(0, Math.floor(Number(xp) || 0));
  let level = Math.max(1, Math.floor((-1 + Math.sqrt(1 + 4 * (2 + total / 25))) / 2));
  while (xpForLevel(level + 1) <= total) level++;   // koreksi galat pembulatan
  while (level > 1 && xpForLevel(level) > total) level--;
  return level;
}

export function titleForLevel(level) {
  return TITLES.find(t => level >= t.from).title;
}

// Progres menuju level berikutnya.
export function levelProgress(xp) {
  const total = Math.max(0, Math.floor(Number(xp) || 0));
  const level = levelFromXp(total);
  const base = xpForLevel(level), next = xpForLevel(level + 1);
  return { level, title: titleForLevel(level), total, base, next, into: total - base, needed: next - base, percent: Math.min(100, (total - base) / (next - base) * 100) };
}

/* ---------- Perhitungan XP sesi ---------- */

// total = jumlah soal sesi, answered = soal yang diisi, correct = soal benar.
export function calculateSessionXp({ total, answered, correct }) {
  const t = Math.max(0, Math.floor(total) || 0);
  const a = Math.min(t, Math.max(0, Math.floor(answered) || 0));
  const c = Math.min(a, Math.max(0, Math.floor(correct) || 0));
  const parts = [];
  const answeredXp = a * RULES.xpPerAnswered, correctXp = c * RULES.xpPerCorrect;
  if (answeredXp) parts.push({ key: "answered", label: `Soal dijawab (${a})`, xp: answeredXp });
  if (correctXp) parts.push({ key: "correct", label: `Jawaban benar (${c})`, xp: correctXp });
  if (t > 0 && a === t) parts.push({ key: "completion", label: "Semua soal dijawab", xp: RULES.xpCompletionBonus });
  // Bonus akurasi: hanya satu yang berlaku.
  if (t > 0 && c === t) parts.push({ key: "accuracy", label: "Akurasi 100%", xp: RULES.xpAccuracyBonus100 });
  else if (t > 0 && c * 100 >= t * 80) parts.push({ key: "accuracy", label: "Akurasi 80–99%", xp: RULES.xpAccuracyBonus80 });
  return { parts, total: parts.reduce((sum, p) => sum + p.xp, 0), accuracy: t ? c / t * 100 : 0 };
}

/* ---------- Penyimpanan ---------- */

const emptyProgress = () => ({ version: 1, xp: 0, level: 1, gemcrys: 0, claimedLevels: [], rewardedSessions: [] });
let memoryFallback = null;   // dipakai bila localStorage diblokir, agar aplikasi tetap berjalan

const toInt = (v, min = 0) => { const n = Math.floor(Number(v)); return Number.isFinite(n) && n >= min ? n : min; };
const uniqueInts = (arr, min) => Array.isArray(arr) ? [...new Set(arr.map(Number).filter(n => Number.isInteger(n) && n >= min))].sort((a, b) => a - b) : [];

function sanitize(raw) {
  const p = emptyProgress();
  if (!raw || typeof raw !== "object") return p;
  p.xp = toInt(raw.xp);
  p.level = levelFromXp(p.xp);                       // level selalu diturunkan dari total XP
  p.gemcrys = toInt(raw.gemcrys);
  p.claimedLevels = uniqueInts(raw.claimedLevels, 2);   // tidak dibuang walau di atas level saat ini: reward satu level tetap hanya sekali
  p.rewardedSessions = Array.isArray(raw.rewardedSessions) ? raw.rewardedSessions.filter(s => typeof s === "string").slice(-RULES.maxRewardedSessions) : [];
  return p;
}

export function loadProgress() {
  try {
    const text = localStorage.getItem(PROGRESS_KEY);
    return text ? sanitize(JSON.parse(text)) : (memoryFallback ? sanitize(memoryFallback) : emptyProgress());
  } catch {
    return memoryFallback ? sanitize(memoryFallback) : emptyProgress();
  }
}

function saveProgress(progress) {
  memoryFallback = progress;
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); return true; } catch { return false; }
}

// Hanya untuk pengujian / reset manual oleh pengembang.
export function resetProgress() { memoryFallback = null; try { localStorage.removeItem(PROGRESS_KEY); } catch { /* abaikan */ } }

/* ---------- Pemberian reward (idempoten per sesi) ---------- */

export function newSessionId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/*
   Memberi reward untuk satu sesi yang SUDAH selesai dan hasilnya tervalidasi.
   Mengembalikan null bila sesi ini sudah pernah diklaim (refresh, klik ganda, buka ulang hasil).
   Data dibaca ulang dari storage saat klaim sehingga dua tab tidak saling menimpa.
*/
export function awardSession(sessionId, stats) {
  if (!sessionId || typeof sessionId !== "string") return null;
  const progress = loadProgress();
  if (progress.rewardedSessions.includes(sessionId)) return null;

  const session = calculateSessionXp(stats);
  const oldXp = progress.xp, oldLevel = levelFromXp(oldXp);
  const newXp = oldXp + session.total, newLevel = levelFromXp(newXp);

  // Gemcrys: tiap level yang dilewati (> 1) memberi reward satu kali.
  const claimed = new Set(progress.claimedLevels), newlyClaimed = [];
  for (let l = oldLevel + 1; l <= newLevel; l++) if (l >= 2 && !claimed.has(l)) { claimed.add(l); newlyClaimed.push(l); }
  const gemcrysGained = newlyClaimed.length * RULES.gemcrysPerLevel;

  const updated = {
    version: 1,
    xp: newXp,
    level: newLevel,
    gemcrys: progress.gemcrys + gemcrysGained,
    claimedLevels: [...claimed].sort((a, b) => a - b),
    rewardedSessions: [...progress.rewardedSessions, sessionId].slice(-RULES.maxRewardedSessions)
  };
  saveProgress(updated);

  return {
    sessionId,
    xpGained: session.total,
    breakdown: session.parts,
    accuracy: session.accuracy,
    oldXp, newXp, oldLevel, newLevel,
    levelsGained: newLevel - oldLevel,
    oldTitle: titleForLevel(oldLevel), newTitle: titleForLevel(newLevel),
    titleChanged: titleForLevel(oldLevel) !== titleForLevel(newLevel),
    gemcrysGained,
    gemcrys: updated.gemcrys,
    progress: levelProgress(newXp)
  };
}
