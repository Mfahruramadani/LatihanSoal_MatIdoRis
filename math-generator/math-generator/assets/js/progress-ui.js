/* Tampilan progres pemain. Hanya merender data dari progress.js. */
import { loadProgress, levelProgress } from "./progress.js";

const fmt = n => Number(n).toLocaleString("id-ID");

function barHTML(p) {
  const pct = Math.round(p.percent * 10) / 10;
  return `
    <div class="progress-meta">
      <span>MENUJU LEVEL ${p.level + 1}</span>
      <span>${fmt(p.into)} / ${fmt(p.needed)} XP</span>
    </div>
    <div class="progress-track" role="progressbar" aria-label="Progres menuju level ${p.level + 1}"
         aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}">
      <div class="progress-fill" style="width:${pct}%"></div>
    </div>`;
}

// Kartu progres di beranda.
export function renderPlayerCard(el) {
  if (!el) return;
  const data = loadProgress(), p = levelProgress(data.xp);
  el.innerHTML = `
    <div class="player-stats">
      <div class="player-stat"><span class="stat-label">LEVEL</span><strong>${p.level}</strong></div>
      <div class="player-stat"><span class="stat-label">TITLE</span><strong>${p.title}</strong></div>
      <div class="player-stat"><span class="stat-label">TOTAL XP</span><strong>${fmt(p.total)}</strong></div>
      <div class="player-stat"><span class="stat-label">GEMCRYS</span><strong>${fmt(data.gemcrys)}</strong></div>
    </div>
    <div class="player-bar">${barHTML(p)}</div>`;
}

// Ringkasan reward di halaman hasil. reward = hasil awardSession().
export function renderRewardPanel(el, reward) {
  if (!el) return;
  if (!reward) { el.classList.add("hidden"); el.innerHTML = ""; return; }

  const rows = reward.breakdown.length
    ? reward.breakdown.map(r => `<li><span>${r.label}</span><strong>+${fmt(r.xp)}</strong></li>`).join("")
    : `<li><span>Belum ada soal yang dijawab</span><strong>+0</strong></li>`;

  let levelUp = "";
  if (reward.levelsGained > 0) {
    const headline = reward.levelsGained === 1
      ? `Naik ke Level ${reward.newLevel}`
      : `Naik ${reward.levelsGained} level: Level ${reward.oldLevel} → Level ${reward.newLevel}`;
    levelUp = `
      <div class="levelup" role="status">
        <span class="stat-label">LEVEL UP</span>
        <strong>${headline}</strong>
        <p>Title: ${reward.newTitle}${reward.titleChanged ? " (title baru)" : ""} · +${fmt(reward.gemcrysGained)} Gemcrys</p>
      </div>`;
  }

  el.classList.remove("hidden");
  el.innerHTML = `
    <div class="reward-head">
      <div>
        <span class="section-kicker">PLAYER PROGRESS</span>
        <h2>+${fmt(reward.xpGained)} XP</h2>
      </div>
      <span class="reward-level">LV ${reward.newLevel} · ${reward.newTitle}</span>
    </div>
    <ul class="reward-list">${rows}</ul>
    ${levelUp}
    <div class="player-bar">${barHTML(reward.progress)}</div>`;
}
