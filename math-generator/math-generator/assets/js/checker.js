import { normalizeText, parseFraction, parseFactors, normWord } from "./utils.js";

const eq = (a, b) => a !== null && b !== null && Math.abs(a - b) < 1e-9;

export function isCorrect(q, user) {
  if (q.kind === "seq") { const n = x => String(x ?? "").toLowerCase().replace(/[^a-z0-9]/g, ""); return !!n(user) && n(user) === n(q.answer); }
  if (q.kind === "choice") return String(user) === q.answer;
  if (q.kind === "vocab") { const a = normWord(user); return !!a && q.accept.some(x => normWord(x) === a); }
  const v = q.answerValue;
  if (Array.isArray(v)) { // urutan: bandingkan nilai, bukan teks
    const parts = String(user).split(/\s*[;,]\s*|\s+/).filter(Boolean);
    return parts.length === v.length && parts.every((p, i) => eq(parseFraction(p), parseFraction(v[i])));
  }
  if (q.kind === "factors") {
    const a = parseFactors(user), b = parseFactors(q.answer);
    return !!a && !!b && a.length === b.length && a.every((x, i) => x === b[i]);
  }
  if (v && typeof v === "object") return eq(parseFraction(user), v.n / v.d);
  const e = parseFraction(q.answer), a = parseFraction(user);
  if (e !== null) {
    if (a !== null && eq(a, e)) return true;
    // "40.000" / "1.250.000" / "10 000" = pemisah ribuan, bukan desimal
    if (Number.isInteger(e) && Math.abs(e) >= 1000) {
      const raw = String(user).trim().replace(/[−–—]/g, "-").replace(/(?<=\d)[.\s](?=\d{3}(?!\d))/g, "");
      return eq(parseFraction(raw), e);
    }
    if (a !== null) return false;
  }
  return normalizeText(user) === normalizeText(q.answer);
}
