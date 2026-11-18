
import { TOPICS, createQuestions, estimatePool, clearSeen } from "./generator.js";
import { isCorrect } from "./checker.js";
import { formatTime } from "./utils.js";
import { awardSession, newSessionId } from "./progress.js";
import { renderPlayerCard, renderRewardPanel } from "./progress-ui.js";

/* ==========================================
   CONFIGURATION
========================================== */

const $ = (selector) => document.querySelector(selector);

const DEFAULT_NOTE = $("#settings-note").textContent;

const views = [
  "home-view",
  "setup-view",
  "practice-view",
  "result-view"
];

const HKEY = "mathgen-history-v1";
const THEME_KEY = "math-generator-theme-v1";

const state = {
  qTimer: null,
  topic: null,
  questions: [],
  mode: "sheet",
  current: 0,
  elapsed: 0,
  limit: 0,
  interval: null,
  startedAt: 0,
  results: [],
  label: "",
  sessionId: null,   // ID unik tiap sesi; dipakai agar reward hanya diklaim sekali
  reward: null       // hasil reward sesi ini (untuk ditampilkan ulang tanpa klaim ulang)
};


/* ==========================================
   THEME SYSTEM
========================================== */

function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Aplikasi tetap berjalan jika storage diblokir.
  }
}

function applyTheme(theme) {
  const isDark = theme === "dark";

  document.documentElement.dataset.theme = theme;

  const icon = $("#theme-icon");
  const label = $("#theme-label");
  const toggle = $("#theme-toggle");
  const meta = $('meta[name="theme-color"]');

  if (icon) {
    icon.textContent = isDark ? "☀" : "☾";
  }

  if (label) {
    label.textContent = isDark ? "Light mode" : "Dark mode";
  }

  if (toggle) {
    toggle.setAttribute(
      "aria-label",
      isDark ? "Aktifkan light mode" : "Aktifkan dark mode"
    );

    toggle.setAttribute(
      "aria-pressed",
      String(isDark)
    );
  }

  if (meta) {
    meta.content = isDark ? "#191d25" : "#f3f3ef";
  }

  saveTheme(theme);
}

function initializeTheme() {
  const saved = getSavedTheme();

  const systemPrefersDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const initialTheme = saved ||
    (systemPrefersDark ? "dark" : "light");

  applyTheme(initialTheme);

  $("#theme-toggle").addEventListener("click", () => {
    const currentTheme = document.documentElement.dataset.theme;

    applyTheme(
      currentTheme === "dark" ? "light" : "dark"
    );
  });
}


/* ==========================================
   HISTORY SYSTEM
========================================== */

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HKEY)) || [];
  } catch {
    return [];
  }
}

function saveHistory(entry) {
  try {
    const history = loadHistory();

    localStorage.setItem(
      HKEY,
      JSON.stringify([entry, ...history].slice(0, 200))
    );
  } catch {
    // Abaikan jika localStorage tidak tersedia.
  }
}

function renderHistory() {
  const history = loadHistory();
  const panel = $("#history-panel");

  panel.classList.toggle("hidden", !history.length);

  if (!history.length) return;

  const average = Math.round(
    history.reduce((total, item) => total + item.score, 0) /
    history.length
  );

  const totalQuestions = history.reduce(
    (total, item) => total + item.count,
    0
  );

  panel.innerHTML = `
    <div class="result-heading">
      <h2>Riwayat latihan</h2>
      <button class="text-button" id="clear-history">
        Hapus riwayat
      </button>
    </div>

    <div class="history-stats">
      <div class="result-stat">
        <strong>${history.length}</strong>
        <span>Sesi latihan</span>
      </div>

      <div class="result-stat">
        <strong>${average}</strong>
        <span>Rata-rata nilai</span>
      </div>

      <div class="result-stat">
        <strong>${totalQuestions}</strong>
        <span>Soal dikerjakan</span>
      </div>
    </div>

    <div class="review-list">
      ${history.slice(0, 8).map(item => `
        <div class="history-row">
          <span>
            ${new Date(item.ts).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short"
            })}
            · <strong>${escapeHTML(item.title)}</strong>
            · ${escapeHTML(item.label)}
          </span>

          <span>
            ${item.correct}/${item.count}
            · <strong>${item.score}</strong>
            · ${formatTime(item.seconds)}
          </span>
        </div>
      `).join("")}
    </div>
  `;
}


/* ==========================================
   NAVIGATION
========================================== */

function renderHome() {
  const groups = {};

  Object.entries(TOPICS).forEach(([key, topic]) => {
    const group = topic.group || "Matematika";

    if (!groups[group]) {
      groups[group] = [];
    }

    groups[group].push([key, topic]);
  });

  $("#topic-grid").innerHTML = Object.entries(groups)
    .map(([group, topics]) => {

      return `
        <h2 class="group-heading">${escapeHTML(group)}</h2>

        ${topics.map(([key, topic], index) => `
          <button class="topic-card" data-topic="${escapeHTML(key)}">

            <span class="topic-number">
              ${String(index + 1).padStart(2, "0")}
            </span>

            <span class="topic-name">
              ${escapeHTML(topic.title)}
            </span>

            <span class="topic-description">
              ${escapeHTML(topic.description)}
            </span>

          </button>
        `).join("")}

      `;
    })
    .join("");

  renderHistory();
  renderPlayerCard($("#player-card"));
}

function showView(id) {
  views.forEach(view => {
    $(`#${view}`).classList.toggle("hidden", view !== id);
  });

  if (id === "home-view") {
    renderHistory();
    renderPlayerCard($("#player-card"));
  }

  window.scrollTo({
    top: 0,
    behavior: "auto"
  });
}

function updatePoolHint() {
  const el = $("#pool-hint");
  if (!el || !state.topic) return;
  try {
    const p = estimatePool(state.topic, $("#subtype").value, $("#difficulty").value);
    const n = Number($("#question-count").value);
    el.classList.remove("hidden");
    if (p.large) el.textContent = "Variasi soal sangat banyak: setiap latihan berisi soal baru.";
    else if (p.est < n) el.textContent = `Pilihan ini hanya punya sekitar ${p.est} soal berbeda, jadi latihan akan berisi paling banyak ${p.est} soal tanpa pengulangan. Coba tingkat kesulitan atau jenis latihan lain untuk variasi lebih banyak.`;
    else el.textContent = `Perkiraan ${p.est} soal berbeda tersedia. Soal yang sudah keluar tidak diulang sampai semuanya terpakai.`;
  } catch { el.classList.add("hidden"); }
}

function openSetup(topicKey) {
  state.topic = topicKey;

  const topic = TOPICS[topicKey];

  $("#setup-title").textContent = topic.title;
  $("#setup-description").textContent = topic.description;

  $("#subtype").innerHTML = topic.subtypes
    .map(([value, label]) => `
      <option value="${escapeHTML(value)}">
        ${escapeHTML(label)}
      </option>
    `)
    .join("");

  $("#subtype").disabled = topic.subtypes.length === 1;

  $("#practice-mode")
    .closest("label")
    .classList.toggle("hidden", !!topic.single);

  $("#settings-note").textContent =
    topic.note || DEFAULT_NOTE;

  showView("setup-view");
  updatePoolHint();
}


/* ==========================================
   MAIN TIMER
========================================== */

function stopTimer() {
  if (state.interval) {
    clearInterval(state.interval);
  }

  state.interval = null;
}

function tick() {
  state.elapsed = Math.floor(
    (Date.now() - state.startedAt) / 1000
  );

  if (!state.limit) {
    $("#timer").textContent = formatTime(state.elapsed);
    return;
  }

  const remaining = Math.max(
    0,
    state.limit - state.elapsed
  );

  $("#timer").textContent = formatTime(remaining);

  $("#timer").classList.toggle(
    "urgent",
    remaining <= 10
  );

  if (remaining === 0) {
    finishPractice(true);
  }
}

function startTimer() {
  stopTimer();

  state.startedAt = Date.now() - state.elapsed * 1000;

  tick();

  state.interval = setInterval(tick, 500);
}


/* ==========================================
   PROGRESS
========================================== */

function updateProgress() {
  const answered = state.questions.filter(question =>
    String(question.userAnswer).trim() !== ""
  ).length;

  const total = state.questions.length;

  $("#progress-label").textContent =
    `${answered} terjawab · ${total} soal`;

  $("#progress-fill").style.width =
    `${total ? (answered / total) * 100 : 0}%`;
}

function saveAnswer(index, value) {
  state.questions[index].userAnswer = value;

  updateProgress();
}


/* ==========================================
   SHEET MODE
========================================== */

function renderSheet() {
  const box = $("#sheet-container");

  box.innerHTML = state.questions.map((question, index) => `
    <article class="question-card">

      <div class="question-card-top">
        <span>Soal ${index + 1}</span>
      </div>

      <div class="question-text">
        ${escapeHTML(question.prompt)}
      </div>

      ${
        question.choices
          ? choicesHTML(question, index)
          : `
            <input
              type="text"
              autocomplete="off"
              autocapitalize="off"
              autocorrect="off"
              spellcheck="false"
              aria-label="Jawaban soal ${index + 1}"
              data-answer-index="${index}"
              placeholder="Jawaban"
            >
          `
      }

    </article>
  `).join("");

  // Input jawaban biasa.
  box.querySelectorAll("input[data-answer-index]")
    .forEach(input => {

      const index = Number(input.dataset.answerIndex);

      input.value = state.questions[index].userAnswer;

      input.addEventListener("input", () => {
        saveAnswer(index, input.value);
      });

    });

  // Pilihan ganda.
  box.querySelectorAll("input[type=radio]")
    .forEach(radio => {

      const index = Number(radio.name.slice(2));

      radio.checked =
        state.questions[index].userAnswer === radio.value;

      radio.addEventListener("change", () => {
        saveAnswer(index, radio.value);
      });

    });
}

function choicesHTML(question, index) {
  return `
    <div class="choices" role="radiogroup">

      ${question.choices.map(choice => `
        <label class="choice">

          <input
            type="radio"
            name="q-${index}"
            value="${escapeHTML(choice)}"
          >

          <span>${escapeHTML(choice)}</span>

        </label>
      `).join("")}

    </div>
  `;
}


/* ==========================================
   QUESTION TIMER
========================================== */

function clearQTimer() {
  if (state.qTimer) {
    clearInterval(state.qTimer);
  }

  state.qTimer = null;

  $("#q-timer").classList.add("hidden");
}

function runQTimer(seconds, label, onEnd) {
  clearQTimer();

  let remaining = seconds;

  const element = $("#q-timer");

  element.classList.remove("hidden");

  const draw = () => {
    element.textContent = `${label} ${remaining} dtk`;

    element.classList.toggle(
      "urgent",
      remaining <= 3
    );
  };

  draw();

  state.qTimer = setInterval(() => {

    remaining--;

    draw();

    if (remaining <= 0) {
      clearQTimer();
      onEnd();
    }

  }, 1000);
}


/* ==========================================
   SINGLE QUESTION MODE
========================================== */

function advanceTimed() {
  const question = state.questions[state.current];

  if (!question.choices) {
    saveAnswer(
      state.current,
      $("#single-answer").value
    );
  }

  if (state.current === state.questions.length - 1) {
    finishPractice(true);
  } else {
    goSingle(1);
  }
}

function renderSingle() {
  clearQTimer();

  const question = state.questions[state.current];

  const last =
    state.current === state.questions.length - 1;

  const topic = TOPICS[state.topic] || {};

  const memo =
    !!question.memorize && !question.shown;

  $("#single-count").textContent =
    `Soal ${state.current + 1} dari ${state.questions.length}`;

  $("#memo-panel").classList.toggle("hidden", !memo);

  $("#single-question").classList.toggle("hidden", memo);

  $(".single-controls").classList.toggle("hidden", memo);

  if (memo) {

    $("#single-choices").classList.add("hidden");

    $(".answer-field").classList.add("hidden");

    $("#memo-content").textContent =
      question.memorize.content;

    const reveal = () => {
      question.shown = true;
      renderSingle();
    };

    $("#memo-ready").onclick = reveal;

    runQTimer(
      question.memorize.seconds,
      "Hafalkan:",
      reveal
    );

    updateProgress();

    return;
  }

  $("#single-question").textContent =
    question.prompt;

  $("#single-question").classList.toggle(
    "long",
    question.prompt.length > 90
  );

  const box = $("#single-choices");

  const isMultipleChoice = !!question.choices;

  box.classList.toggle(
    "hidden",
    !isMultipleChoice
  );

  $(".answer-field").classList.toggle(
    "hidden",
    isMultipleChoice
  );

  if (isMultipleChoice) {

    box.innerHTML = choicesHTML(
      question,
      state.current
    );

    box.querySelectorAll("input").forEach(radio => {

      radio.checked =
        question.userAnswer === radio.value;

      radio.addEventListener("change", () => {
        saveAnswer(state.current, radio.value);
      });

    });

  }

  $("#single-answer").value =
    isMultipleChoice ? "" : question.userAnswer;

  $("#previous-button").classList.toggle(
    "hidden",
    !!topic.noBack
  );

  $("#previous-button").disabled =
    state.current === 0;

  $("#previous-button").style.opacity =
    state.current === 0 ? ".45" : "1";

  $("#next-button").textContent =
    last
      ? "Soal terakhir"
      : topic.noBack
        ? "Lanjut"
        : "Berikutnya";

  if (!isMultipleChoice) {
    $("#single-answer").focus();
  }

  if (question.timeLimit) {
    runQTimer(
      question.timeLimit,
      "Sisa waktu:",
      advanceTimed
    );
  }

  updateProgress();
}

function goSingle(delta) {
  const question = state.questions[state.current];

  if (!question.choices) {
    saveAnswer(
      state.current,
      $("#single-answer").value
    );
  }

  state.current = Math.min(
    state.questions.length - 1,
    Math.max(0, state.current + delta)
  );

  renderSingle();
}


/* ==========================================
   SESSION MANAGEMENT
========================================== */

function beginSession(questions, subtitle) {
  if (!questions.length) {
    alert("Tidak ada soal yang berhasil dibuat.");
    return;
  }

  state.questions = questions;
  state.current = 0;
  state.elapsed = 0;
  state.sessionId = newSessionId();
  state.reward = null;

  $("#practice-title").textContent =
    TOPICS[state.topic].title;

  $("#practice-subtitle").textContent =
    subtitle +
    (state.limit
      ? ` · batas ${state.limit / 60} menit`
      : "");

  $("#timer").classList.remove("urgent");

  $("#sheet-container").classList.toggle(
    "hidden",
    state.mode !== "sheet"
  );

  $("#single-container").classList.toggle(
    "hidden",
    state.mode !== "single"
  );

  $("#finish-button").textContent =
    state.mode === "single"
      ? "Periksa semua jawaban"
      : "Periksa jawaban";

  if (state.mode === "sheet") {
    renderSheet();
  } else {
    renderSingle();
  }

  updateProgress();

  showView("practice-view");

  if (state.mode === "sheet") {
    $("#sheet-container input")?.focus({
      preventScroll: true
    });
  }

  startTimer();
}

function startPractice() {
  const difficulty = $("#difficulty").value;

  const count = Number(
    $("#question-count").value
  );

  state.mode = TOPICS[state.topic].single
    ? "single"
    : $("#practice-mode").value;

  state.limit =
    Number($("#time-limit").value) * 60;

  state.label =
    `${$("#subtype").selectedOptions[0].textContent} · ${difficultyLabel(difficulty)}`;

  const questions = createQuestions(
    state.topic,
    $("#subtype").value,
    difficulty,
    count,
    $("#shuffle").value === "yes"
  );

  if (questions.info && questions.info.produced < count && questions.length) {
    alert(`Hanya ${questions.length} soal berbeda yang tersedia untuk pilihan ini, jadi latihan berisi ${questions.length} soal tanpa pengulangan.`);
  }

  beginSession(
    questions,
    `${state.label} · ${questions.length} soal`
  );
}

function retryWrong() {
  const questions = state.results
    .filter(result => !result.correct)
    .map((result, index) => ({
      ...result,
      id: index + 1,
      userAnswer: ""
    }));

  questions.forEach(question => {
    delete question.correct;
    delete question.shown;
  });

  state.label = "Ulang soal salah";

  beginSession(
    questions,
    `Ulang soal salah · ${questions.length} soal`
  );
}


/* ==========================================
   FINISH & EVALUATION
========================================== */

function finishPractice(auto = false) {

  if (!state.questions.length) return;

  if (
    state.mode === "single" &&
    !state.questions[state.current].choices
  ) {
    saveAnswer(
      state.current,
      $("#single-answer").value
    );
  }

  const empty = state.questions.filter(question =>
    !String(question.userAnswer).trim()
  ).length;

  if (
    !auto &&
    empty &&
    !confirm(
      `Masih ada ${empty} soal belum dijawab. Tetap periksa jawaban?`
    )
  ) {
    return;
  }

  stopTimer();
  clearQTimer();

  const results = state.questions.map(question => ({
    ...question,
    correct: isCorrect(
      question,
      question.userAnswer
    )
  }));

  state.results = results;

  const correct = results.filter(
    result => result.correct
  ).length;

  const wrong = results.length - correct;

  const score = Math.round(
    correct / results.length * 100
  );

  saveHistory({
    ts: Date.now(),
    title: TOPICS[state.topic].title,
    label: state.label,
    count: results.length,
    correct,
    score,
    seconds: state.elapsed
  });

  // Reward progres: hanya sekali per sesi yang diselesaikan (idempoten lewat sessionId).
  const answered = results.filter(result => String(result.userAnswer).trim()).length;
  const granted = awardSession(state.sessionId, { total: results.length, answered, correct });
  if (granted) state.reward = granted;   // klik ganda / buka ulang hasil menampilkan reward yang sama, bukan klaim baru
  renderRewardPanel($("#reward-panel"), state.reward);

  $("#result-topic").textContent =
    TOPICS[state.topic].title +
    (auto ? " · waktu habis" : "");

  $("#score-value").textContent = score;

  $("#correct-value").textContent = correct;

  $("#wrong-value").textContent = wrong;

  $("#duration-value").textContent =
    formatTime(state.elapsed);

  $("#result-count").textContent =
    `${results.length} soal`;

  $("#retry-wrong-button").classList.toggle(
    "hidden",
    wrong === 0
  );

  $("#retry-wrong-button").textContent =
    `Ulangi ${wrong} soal yang salah`;

  $("#review-list").innerHTML =
    results.map((question, index) => `
      <article class="review-item ${
        question.correct ? "correct" : "incorrect"
      }">

        <div class="review-question">
          ${index + 1}. ${escapeHTML(question.prompt)}
        </div>

        <div class="review-status">
          ${question.correct ? "Benar" : "Perlu diperbaiki"}
        </div>

        <div class="review-detail">

          Jawabanmu:
          ${escapeHTML(question.userAnswer || "Tidak dijawab")}

          · Jawaban benar:
          <strong>${escapeHTML(question.answer)}</strong>

          <br>

          ${escapeHTML(question.explanation)}

          ${
            question.memorize
              ? `<br>Informasi tadi:
                  ${escapeHTML(
                    question.memorize.content.replace(/\n+/g, " · ")
                  )}`
              : ""
          }

        </div>

      </article>
    `).join("");

  showView("result-view");
}


/* ==========================================
   UTILITIES
========================================== */

function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]
  );
}

const difficultyLabel = value => ({
  easy: "Mudah",
  medium: "Sedang",
  hard: "Sulit"
})[value];


/* ==========================================
   EVENT LISTENERS
========================================== */

function initializeEvents() {

  // Pilih tema.
  //initializeTheme();

  // Pilih materi.
  $("#topic-grid").addEventListener("click", event => {
    const button = event.target.closest("[data-topic]");

    if (button) {
      openSetup(button.dataset.topic);
    }
  });

  // Hapus riwayat.
  $("#history-panel").addEventListener("click", event => {

    if (
      event.target.id === "clear-history" &&
      confirm("Hapus semua riwayat latihan?")
    ) {
      try {
        localStorage.removeItem(HKEY);
        clearSeen();
      } catch {
        // Abaikan.
      }

      renderHistory();
    }

  });

  // Kembali ke beranda.
  $("#back-home").addEventListener("click", () => {
    showView("home-view");
  });

  // Perkiraan jumlah soal berbeda saat pengaturan berubah.
  ["#subtype", "#difficulty", "#question-count"].forEach(id => $(id).addEventListener("change", updatePoolHint));

  // Mulai latihan.
  $("#setup-form").addEventListener("submit", event => {
    event.preventDefault();
    startPractice();
  });

  // Akhiri latihan.
  $("#quit-practice").addEventListener("click", () => {

    if (
      confirm(
        "Akhiri latihan? Jawaban yang sudah diisi tidak akan dinilai."
      )
    ) {
      stopTimer();
      clearQTimer();
      showView("home-view");
    }

  });

  // Periksa jawaban.
  $("#finish-button").addEventListener("click", () => {
    finishPractice();
  });

  // Enter pada lembar latihan.
  $("#sheet-container").addEventListener("keydown", event => {

    if (
      event.key !== "Enter" ||
      !event.target.matches("[data-answer-index]")
    ) {
      return;
    }

    event.preventDefault();

    const all = [
      ...document.querySelectorAll(
        "#sheet-container input[data-answer-index]"
      )
    ];

    const next = all[all.indexOf(event.target) + 1];

    if (next) {
      next.focus();
    } else {
      $("#finish-button").focus();
    }

  });

  // Jawaban mode satu soal.
  $("#single-answer").addEventListener("input", event => {
    saveAnswer(state.current, event.target.value);
  });

  // Enter pada mode satu soal.
  $("#single-answer").addEventListener("keydown", event => {

    if (event.key !== "Enter") return;

    event.preventDefault();

    if (state.current < state.questions.length - 1) {
      goSingle(1);
    } else {
      $("#finish-button").focus();
    }

  });

  // Navigasi soal.
  $("#previous-button").addEventListener("click", () => {
    goSingle(-1);
  });

  $("#next-button").addEventListener("click", () => {
    goSingle(1);
  });

  // Kembali dari hasil.
  $("#back-result-home").addEventListener("click", () => {
    showView("home-view");
  });

  // Latihan ulang.
  $("#retry-button").addEventListener("click", () => {
    openSetup(state.topic);
  });

  // Ulangi soal salah.
  $("#retry-wrong-button").addEventListener("click", () => {
    retryWrong();
  });

}


/* ==========================================
   INITIALIZATION
========================================== */

function initializeApp() {
  initializeEvents();
  renderHome();
}

initializeApp();
