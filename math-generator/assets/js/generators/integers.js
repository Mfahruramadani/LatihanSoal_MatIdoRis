import { randInt, choose } from "../utils.js";

export function generateInteger(subtype, difficulty) {
  const limit = difficulty === "easy" ? 10 : difficulty === "medium" ? 50 : 200;
  const a = randInt(-limit, limit), b = randInt(-limit, limit);
  let op = subtype === "mixed" ? choose(["+", "−", "×"]) : subtype;
  let answer, prompt;
  if (op === "addition") op = "+";
  if (op === "subtraction") op = "−";
  if (op === "multiplication") op = "×";
  if (op === "+") { answer = a + b; prompt = `${a} + (${b})`; }
  else if (op === "−") { answer = a - b; prompt = `${a} − (${b})`; }
  else { answer = a * b; prompt = `${a} × (${b})`; }
  return { prompt: `${prompt} = ?`, answer: String(answer), explanation: `${prompt} = ${answer}` };
}
