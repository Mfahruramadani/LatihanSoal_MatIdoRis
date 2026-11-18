import { randInt, choose, fmtScaled as f } from "../utils.js";

export function generateDecimal(subtype, difficulty) {
  const op = subtype === "mixed" ? choose(["addition", "subtraction", "multiplication", "division"]) : subtype;
  const K = difficulty === "hard" ? 2 : 1, hi = difficulty === "easy" ? 99 : difficulty === "medium" ? 999 : 9999;
  let A, B, prompt, ans, how;
  if (op === "addition" || op === "subtraction") {
    A = randInt(11, hi); B = randInt(11, hi);
    if (op === "subtraction" && B > A) [A, B] = [B, A];
    const s = op === "addition" ? "+" : "−"; ans = op === "addition" ? A + B : A - B;
    prompt = `${f(A, K)} ${s} ${f(B, K)} = ?`; ans = f(ans, K);
    how = "Sejajarkan koma desimal, lalu hitung seperti bilangan bulat.";
  } else if (op === "multiplication") {
    A = randInt(11, hi); B = randInt(2, difficulty === "easy" ? 19 : 99);
    prompt = `${f(A, 1)} × ${f(B, 1)} = ?`; ans = f(A * B, 2);
    how = `Kalikan tanpa koma: ${A} × ${B} = ${A * B}. Ada 2 angka di belakang koma, jadi hasilnya ${ans}.`;
  } else {
    B = randInt(2, difficulty === "easy" ? 9 : 30); const Q = randInt(2, difficulty === "easy" ? 40 : 80);
    prompt = `${f(Q * B, 2)} ÷ ${f(B, 1)} = ?`; ans = f(Q, 1);
    how = `Kalikan kedua bilangan dengan 100 agar jadi bilangan bulat: ${Q * B} ÷ ${B * 10} = ${Q / 10}.`.replace(".", ",");
  }
  return { prompt, answer: ans, explanation: `${how} Jawaban: ${ans}.` };
}
