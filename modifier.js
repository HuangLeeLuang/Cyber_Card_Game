const data = window.CYBER_CARD_DATA;
const STORAGE_KEY = "cyberCardGameMods";
const ART_ATLASES = {
  1: { columns: 6, rows: 6, image: "url(assets/card-art-atlas.png)" },
  2: { columns: 10, rows: 6, image: "url(assets/card-art-atlas-2.png)" },
};
const ruleFields = [
  ["deckSize", "牌組張數", 8, 30],
  ["maxBoard", "場上單位上限", 2, 8],
  ["maxOperatorLuxuries", "操作者奢侈品上限", 0, 4],
  ["maxDeckLuxuries", "牌組奢侈品上限", 0, 10],
  ["baseHandLimit", "手牌上限", 3, 12],
  ["startingLife", "起始生命", 8, 40],
  ["maxEnergy", "能量上限", 3, 12],
  ["openingHand", "起手張數", 1, 8],
  ["drawPerTurn", "每回合抽牌", 1, 4],
];

let mods = loadMods();

document.addEventListener("DOMContentLoaded", () => {
  renderRules();
  renderCards();
  updateExportBox();
  document.querySelector("#saveRulesBtn").addEventListener("click", saveAll);
  document.querySelector("#resetModsBtn").addEventListener("click", resetAll);
  document.querySelector("#exportBtn").addEventListener("click", updateExportBox);
  document.querySelector("#importBtn").addEventListener("click", importMods);
  document.querySelector("#cardSearch").addEventListener("input", renderCards);
});

function loadMods() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      rules: { ...data.defaultRules, ...(saved.rules || {}) },
      cards: saved.cards || {},
    };
  } catch {
    return { rules: { ...data.defaultRules }, cards: {} };
  }
}

function renderRules() {
  document.querySelector("#ruleEditor").innerHTML = ruleFields
    .map(([key, label, min, max]) => {
      const value = mods.rules[key] ?? data.defaultRules[key];
      return `
        <div class="field">
          <label for="rule-${key}">${label}</label>
          <input id="rule-${key}" data-rule="${key}" type="number" min="${min}" max="${max}" value="${value}" />
        </div>
      `;
    })
    .join("");
}

function renderCards() {
  const query = document.querySelector("#cardSearch")?.value.trim().toLowerCase() || "";
  const cards = data.originalCards.filter((card) => {
    const haystack = `${card.name} ${data.cardTypes[card.type]} ${data.factions[card.faction]}`.toLowerCase();
    return haystack.includes(query);
  });

  document.querySelector("#cardEditorGrid").innerHTML = cards.map(renderCardEditor).join("");
}

function renderCardEditor(card) {
  const current = mods.cards[card.id] || {};
  const cost = current.cost ?? card.cost;
  const attack = current.attack ?? card.attack ?? "";
  const health = current.health ?? card.health ?? "";
  const text = current.text ?? "";
  return `
    <article class="editor-card" data-card-id="${card.id}">
      <div class="editor-top">
        <div class="editor-art" style="${getArtStyle(card)}" aria-hidden="true"></div>
        <div>
          <strong>${card.name}</strong>
          <p>${data.cardTypes[card.type]} · ${data.factions[card.faction]}</p>
        </div>
      </div>
      <div class="editor-fields">
        <div class="field">
          <label>費用</label>
          <input data-card-field="cost" type="number" min="0" max="12" value="${cost}" />
        </div>
        <div class="field">
          <label>攻擊</label>
          <input data-card-field="attack" type="number" min="0" max="12" value="${attack}" ${card.type !== "unit" ? "disabled" : ""} />
        </div>
        <div class="field">
          <label>生命</label>
          <input data-card-field="health" type="number" min="1" max="20" value="${health}" ${card.type !== "unit" ? "disabled" : ""} />
        </div>
      </div>
      <div class="field">
        <label>自訂文字</label>
        <textarea data-card-field="text" maxlength="160" placeholder="${card.text}">${escapeHtml(text)}</textarea>
      </div>
    </article>
  `;
}

function collectMods() {
  const rules = {};
  ruleFields.forEach(([key, , min, max]) => {
    const input = document.querySelector(`[data-rule="${key}"]`);
    rules[key] = clampInt(input.value, min, max, data.defaultRules[key]);
  });

  const cards = {};
  document.querySelectorAll(".editor-card").forEach((node) => {
    const original = data.originalCards.find((card) => card.id === node.dataset.cardId);
    const cardMod = {};
    node.querySelectorAll("[data-card-field]").forEach((input) => {
      const field = input.dataset.cardField;
      if (input.disabled) return;
      if (field === "text") {
        if (input.value.trim()) cardMod.text = input.value.trim();
      } else {
        const fallback = original[field] ?? 0;
        cardMod[field] = clampInt(input.value, Number(input.min), Number(input.max), fallback);
      }
    });
    if (isCardModified(original, cardMod)) cards[original.id] = cardMod;
  });

  return { rules, cards };
}

function isCardModified(original, cardMod) {
  if (cardMod.text) return true;
  if (Number(cardMod.cost) !== Number(original.cost)) return true;
  if (original.type === "unit" && Number(cardMod.attack) !== Number(original.attack)) return true;
  if (original.type === "unit" && Number(cardMod.health) !== Number(original.health)) return true;
  return false;
}

function saveAll() {
  mods = collectMods();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mods));
  updateExportBox();
  setStatus("已儲存。回到遊戲並重新開局即可套用。");
}

function resetAll() {
  localStorage.removeItem(STORAGE_KEY);
  mods = { rules: { ...data.defaultRules }, cards: {} };
  renderRules();
  renderCards();
  updateExportBox();
  setStatus("已重置為預設值。");
}

function updateExportBox() {
  document.querySelector("#exportBox").value = JSON.stringify(mods, null, 2);
}

function importMods() {
  try {
    const imported = JSON.parse(document.querySelector("#exportBox").value || "{}");
    mods = {
      rules: { ...data.defaultRules, ...(imported.rules || {}) },
      cards: imported.cards || {},
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mods));
    renderRules();
    renderCards();
    updateExportBox();
    setStatus("匯入完成。");
  } catch {
    setStatus("匯入失敗：JSON 格式不正確。");
  }
}

function setStatus(text) {
  document.querySelector("#modifierStatus").textContent = text;
}

function getArtStyle(card) {
  const art = Number.isFinite(card?.art) ? card.art : 0;
  const atlas = ART_ATLASES[card?.atlas || 1] || ART_ATLASES[1];
  const col = art % atlas.columns;
  const row = Math.floor(art / atlas.columns);
  const x = atlas.columns > 1 ? (col / (atlas.columns - 1)) * 100 : 0;
  const y = atlas.rows > 1 ? (row / (atlas.rows - 1)) * 100 : 0;
  return `--art-image:${atlas.image};--art-size:${atlas.columns * 100}% ${atlas.rows * 100}%;--art-x:${x}%;--art-y:${y}%;`;
}

function clampInt(value, min, max, fallback) {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
