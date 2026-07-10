const FALLBACK_CARD_TYPES = {
  unit: "單位",
  program: "程式",
  mod: "改造",
  luxury: "奢侈品",
};
const FALLBACK_FACTIONS = {
  neutral: "中立",
  merc: "街頭",
  hacker: "駭客",
  corp: "企業",
};
const FALLBACK_RULES = {
  deckSize: 15,
  maxBoard: 4,
  maxOperatorLuxuries: 2,
  maxDeckLuxuries: 4,
  baseHandLimit: 7,
  startingLife: 20,
  maxEnergy: 5,
  openingHand: 3,
  drawPerTurn: 1,
};
const sourceData = window.CYBER_CARD_DATA || {};
const data = {
  cards: Array.isArray(sourceData.cards) ? sourceData.cards : [],
  originalCards: Array.isArray(sourceData.originalCards)
    ? sourceData.originalCards
    : Array.isArray(sourceData.cards)
      ? sourceData.cards
      : [],
  cardTypes:
    sourceData.cardTypes && Object.keys(sourceData.cardTypes).length > 0 ? sourceData.cardTypes : FALLBACK_CARD_TYPES,
  factions: sourceData.factions && Object.keys(sourceData.factions).length > 0 ? sourceData.factions : FALLBACK_FACTIONS,
  defaultRules: { ...FALLBACK_RULES, ...(sourceData.defaultRules || {}) },
};
const STORAGE_KEY = "cyberCardGameMods";
const ART_ATLASES = {
  1: { columns: 6, rows: 6, ratio: "1 / 1", zoom: 1, image: "url(assets/card-art-atlas.png)" },
  2: { columns: 6, rows: 6, ratio: "1 / 1", zoom: 1, image: "url(assets/card-art-atlas-2.png)" },
  3: { columns: 6, rows: 6, ratio: "1 / 1", zoom: 1, image: "url(assets/card-art-atlas-3.png)" },
  4: { columns: 6, rows: 6, ratio: "1 / 1", zoom: 1, image: "url(assets/card-art-atlas-4.png)" },
  5: { columns: 6, rows: 6, ratio: "1 / 1", zoom: 1, image: "url(assets/card-art-atlas-5.png)" },
};
const CUSTOM_IMAGE_PATTERN = /^data:image\/(?:png|jpe?g|webp);base64,[a-z0-9+/=]+$/i;
const effectOptions = [
  ["", "無額外效果", ""],
  ["draw_1", "抽 1 張牌", ""],
  ["draw_2", "抽 2 張牌", ""],
  ["heal_hero_2", "回復 2 生命", ""],
  ["heal_3", "回復 3 生命", ""],
  ["gain_shield_1", "獲得 1 護盾", ""],
  ["gain_shield_2", "獲得 2 護盾", ""],
  ["discount_1", "下一張牌費用 -1", ""],
  ["deal_2", "造成 2 傷害", "enemy"],
  ["deal_3", "造成 3 傷害", "enemy"],
  ["deal_2_gain_shield_1", "造成 2 傷害並獲得 1 護盾", "enemy"],
  ["deal_1_freeze", "造成 1 傷害並凍結", "enemyUnit"],
  ["draw_1_break_shield", "抽 1 張並移除敵方 1 護盾", ""],
  ["enemy_units_minus_1_attack", "敵方所有單位 -1 攻擊", ""],
  ["enemy_units_take_1", "敵方所有單位受到 1 傷害", ""],
  ["deal_1_all_enemies", "所有敵人受到 1 傷害", ""],
  ["summon_1_1_guard", "召喚 1/1 守衛", ""],
  ["summon_2_1_charge", "召喚 2/1 快攻", ""],
  ["buff_1_1_ready", "友方單位 +1/+1 並準備", "friendlyUnit"],
  ["buff_1_0_ready", "友方單位 +1/+0 並準備", "friendlyUnit"],
  ["buff_2_0", "友方單位 +2/+0", "friendlyUnit"],
  ["buff_attack_2_ready", "友方單位 +2/+0 並準備", "friendlyUnit"],
  ["buff_0_2_guard", "友方單位 +0/+2 並守衛", "friendlyUnit"],
  ["buff_0_3_guard", "友方單位 +0/+3 並守衛", "friendlyUnit"],
  ["buff_1_2_guard", "友方單位 +1/+2 並守衛", "friendlyUnit"],
  ["ready_all_units", "準備所有友方單位", ""],
];
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
  renderCustomCardForm();
  renderCustomCardList();
  renderCards();
  updateExportBox();
  document.querySelector("#saveRulesBtn").addEventListener("click", saveAll);
  document.querySelector("#resetModsBtn").addEventListener("click", resetAll);
  document.querySelector("#exportBtn").addEventListener("click", updateExportBox);
  document.querySelector("#importBtn").addEventListener("click", importMods);
  document.querySelector("#createCustomCardBtn").addEventListener("click", createCustomCard);
  document.querySelector("#clearCustomImageBtn").addEventListener("click", clearCustomImage);
  document.querySelector("#cancelCustomEditBtn").addEventListener("click", cancelCustomEdit);
  document.querySelector("#cardSearch").addEventListener("input", renderCards);
  document.querySelector("#cardEditorGrid").addEventListener("change", handleCardEditorChange);
  document.querySelector("#cardEditorGrid").addEventListener("click", handleCardEditorClick);
  document.querySelector("#customCardList").addEventListener("click", handleCustomCardListClick);
  document.querySelector("#customImage").addEventListener("change", handleCustomImageUpload);
  document.querySelector("#customType").addEventListener("change", updateCustomFormState);
  document.querySelector("#customEffect").addEventListener("change", syncTargetFromEffect);
  if (!sourceData.cards) {
    setStatus("主遊戲資料尚未載入，仍可建立自製卡；若卡牌列表空白，請重新整理頁面。");
  }
});

function loadMods() {
  try {
    return normalizeMods(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
  } catch {
    return normalizeMods({});
  }
}

function normalizeMods(saved) {
  return {
    rules: { ...data.defaultRules, ...(saved.rules || {}) },
    cards: saved.cards && typeof saved.cards === "object" ? saved.cards : {},
    customCards: Array.isArray(saved.customCards) ? saved.customCards : [],
  };
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

function renderCustomCardForm() {
  document.querySelector("#customType").innerHTML = Object.entries(data.cardTypes)
    .map(([value, label]) => `<option value="${value}">${label}</option>`)
    .join("");
  document.querySelector("#customFaction").innerHTML = Object.entries(data.factions)
    .map(([value, label]) => `<option value="${value}">${label}</option>`)
    .join("");
  document.querySelector("#customEffect").innerHTML = effectOptions
    .map(([value, label]) => `<option value="${value}">${label}</option>`)
    .join("");
  updateCustomFormState();
}

function updateCustomFormState() {
  const type = document.querySelector("#customType").value;
  const isUnit = type === "unit";
  const isLuxury = type === "luxury";
  document.querySelector("#customAttack").disabled = !isUnit;
  document.querySelector("#customHealth").disabled = !isUnit;
  document.querySelector("#customGuard").disabled = !isUnit;
  document.querySelector("#customCharge").disabled = !isUnit;
  document.querySelector("#customCashText").disabled = !isLuxury;
  document.querySelector("#customTarget").disabled = isLuxury;
  if (isLuxury) document.querySelector("#customTarget").value = "";
}

function syncTargetFromEffect() {
  const selected = effectOptions.find(([value]) => value === document.querySelector("#customEffect").value);
  if (selected && selected[2] !== undefined && !document.querySelector("#customTarget").disabled) {
    document.querySelector("#customTarget").value = selected[2];
  }
}

function renderCustomCardList() {
  const list = document.querySelector("#customCardList");
  if (!mods.customCards.length) {
    list.innerHTML = `<p class="empty-inline">目前沒有自製卡。</p>`;
    return;
  }

  list.innerHTML = `
    <h3>目前自製卡</h3>
    <div class="custom-card-items">
      ${mods.customCards
        .map(
          (card) => `
            <div class="custom-card-row" data-custom-card-id="${escapeAttr(card.id)}">
              <div class="editor-art mini-art" style="${getArtStyle(card)}" aria-hidden="true"></div>
              <div>
                <strong>${escapeHtml(card.name)}</strong>
                <p>${data.cardTypes[card.type] || card.type} · ${data.factions[card.faction] || card.faction}</p>
              </div>
              <div class="custom-card-actions">
                <button class="ghost-button compact-button" type="button" data-edit-custom-card>編輯</button>
                <button class="ghost-button compact-button danger-button" type="button" data-delete-custom-card>刪除</button>
              </div>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderCards() {
  const query = document.querySelector("#cardSearch")?.value.trim().toLowerCase() || "";
  const cards = data.originalCards.filter((card) => {
    const haystack = `${card.name} ${data.cardTypes[card.type]} ${data.factions[card.faction]} ${card.custom ? "自製" : ""}`.toLowerCase();
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
  const customArt = sanitizeCustomImage(current.customArt) || card.customArt || "";
  const previewCard = { ...card, customArt };
  return `
    <article class="editor-card" data-card-id="${escapeAttr(card.id)}">
      <div class="editor-top">
        <div class="editor-art" style="${getArtStyle(previewCard)}" aria-hidden="true"></div>
        <div>
          <strong>${escapeHtml(card.name)}</strong>
          <p>${data.cardTypes[card.type]} · ${data.factions[card.faction]}${card.custom ? " · 自製" : ""}</p>
        </div>
      </div>
      <div class="art-tools">
        <input class="file-input" id="art-${escapeAttr(card.id)}" data-card-art-upload type="file" accept="image/*" />
        <input data-card-field="customArt" type="hidden" value="${escapeAttr(current.customArt || "")}" />
        <label class="ghost-button compact-button" for="art-${escapeAttr(card.id)}">上傳圖片</label>
        <button class="ghost-button compact-button" type="button" data-clear-art>清除圖片</button>
        <button class="ghost-button compact-button" type="button" data-clone-card>複製成自製卡</button>
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
        <textarea data-card-field="text" maxlength="180" placeholder="${escapeAttr(card.text)}">${escapeHtml(text)}</textarea>
      </div>
    </article>
  `;
}

async function handleCardEditorChange(event) {
  if (!event.target.matches("[data-card-art-upload]")) return;
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const dataUrl = await resizeImageFile(file);
    const editor = event.target.closest(".editor-card");
    const card = data.originalCards.find((item) => item.id === editor.dataset.cardId);
    editor.querySelector('[data-card-field="customArt"]').value = dataUrl;
    editor.querySelector(".editor-art").setAttribute("style", getArtStyle({ ...card, customArt: dataUrl }));
    setStatus("圖片已載入，按「儲存設定」後會套用。");
  } catch {
    setStatus("圖片載入失敗，請換一張圖片。");
  } finally {
    event.target.value = "";
  }
}

function handleCardEditorClick(event) {
  if (event.target.matches("[data-clone-card]")) {
    const editor = event.target.closest(".editor-card");
    const card = data.originalCards.find((item) => item.id === editor.dataset.cardId);
    if (card) loadCardIntoCustomForm(card, true);
    return;
  }

  if (!event.target.matches("[data-clear-art]")) return;
  const editor = event.target.closest(".editor-card");
  const card = data.originalCards.find((item) => item.id === editor.dataset.cardId);
  editor.querySelector('[data-card-field="customArt"]').value = "";
  if (card.custom) {
    const nextMods = collectMods();
    nextMods.customCards = nextMods.customCards.map((item) => {
      if (item.id !== card.id) return item;
      const updated = { ...item };
      delete updated.customArt;
      return updated;
    });
    delete nextMods.cards[card.id]?.customArt;
    if (!persistMods(nextMods, "已清除這張自製卡的圖片。")) return;
    const updatedCard = { ...card };
    delete updatedCard.customArt;
    upsertCustomCardInData(updatedCard);
    renderCustomCardList();
    editor.querySelector(".editor-art").setAttribute("style", getArtStyle(updatedCard));
    updateExportBox();
    return;
  }
  editor.querySelector(".editor-art").setAttribute("style", getArtStyle(card));
  setStatus("已清除這張卡的自訂圖片，按「儲存設定」後會套用。");
}

function handleCustomCardListClick(event) {
  const row = event.target.closest("[data-custom-card-id]");
  if (!row) return;
  const id = row.dataset.customCardId;
  if (event.target.matches("[data-edit-custom-card]")) {
    const card = mods.customCards.find((item) => item.id === id);
    if (card) loadCardIntoCustomForm(card, false);
  }
  if (event.target.matches("[data-delete-custom-card]")) {
    deleteCustomCard(id);
  }
}

async function handleCustomImageUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const dataUrl = await resizeImageFile(file);
    document.querySelector("#customImageData").value = dataUrl;
    document.querySelector("#customPreview").setAttribute("style", getArtStyle({ customArt: dataUrl }));
    setStatus("自製卡圖片已載入。");
  } catch {
    setStatus("圖片載入失敗，請換一張圖片。");
  } finally {
    event.target.value = "";
  }
}

function loadCardIntoCustomForm(card, asCopy) {
  document.querySelector("#customEditingId").value = asCopy ? "" : card.id;
  document.querySelector("#customName").value = asCopy ? `${card.name} 複製` : card.name;
  document.querySelector("#customType").value = card.type;
  document.querySelector("#customFaction").value = card.faction;
  document.querySelector("#customCost").value = card.cost ?? 1;
  document.querySelector("#customAttack").value = card.attack ?? 1;
  document.querySelector("#customHealth").value = card.health ?? 1;
  document.querySelector("#customEffect").value = effectOptions.some(([value]) => value === card.effect) ? card.effect || "" : "";
  document.querySelector("#customTarget").value = card.target || "";
  document.querySelector("#customText").value = card.text || "";
  document.querySelector("#customCashText").value = card.cashText || "";
  document.querySelector("#customGuard").checked = Boolean(card.guard);
  document.querySelector("#customCharge").checked = Boolean(card.charge);
  document.querySelector("#customImageData").value = sanitizeCustomImage(card.customArt) || "";
  document.querySelector("#customPreview").setAttribute("style", getArtStyle(card));
  document.querySelector("#createCustomCardBtn").textContent = asCopy ? "建立卡牌" : "儲存自製卡";
  document.querySelector("#cancelCustomEditBtn").hidden = asCopy;
  updateCustomFormState();
  setStatus(asCopy ? "已複製到自製卡表單，可再調整後建立。" : "正在編輯自製卡。");
  document.querySelector("#customName").focus();
}

function clearCustomImage() {
  document.querySelector("#customImageData").value = "";
  document.querySelector("#customPreview").setAttribute("style", getArtStyle({ art: 0 }));
  setStatus("已清除自製卡表單圖片。");
}

function cancelCustomEdit() {
  clearCustomCardForm();
  setStatus("已取消編輯。");
}

function deleteCustomCard(cardId) {
  const nextMods = collectMods();
  nextMods.customCards = nextMods.customCards.filter((card) => card.id !== cardId);
  delete nextMods.cards[cardId];
  if (!persistMods(nextMods, "已刪除自製卡。")) return;
  removeCustomCardFromData(cardId);
  removeCardFromStoredDeck(cardId);
  clearCustomCardForm();
  renderCustomCardList();
  renderCards();
  updateExportBox();
}

function createCustomCard() {
  const editingId = document.querySelector("#customEditingId").value;
  const type = document.querySelector("#customType").value;
  const card = {
    id: editingId || makeCustomCardId(document.querySelector("#customName").value),
    name: document.querySelector("#customName").value.trim() || "自製卡",
    type,
    faction: document.querySelector("#customFaction").value,
    cost: clampInt(document.querySelector("#customCost").value, 0, 12, 1),
    text: document.querySelector("#customText").value.trim() || "自製卡牌。",
    custom: true,
  };
  const effect = document.querySelector("#customEffect").value;
  const target = document.querySelector("#customTarget").value;
  const customArt = sanitizeCustomImage(document.querySelector("#customImageData").value);
  if (effect) card.effect = effect;
  if (target && type !== "luxury") card.target = target;
  if (customArt) card.customArt = customArt;
  if (type === "unit") {
    card.attack = clampInt(document.querySelector("#customAttack").value, 0, 12, 1);
    card.health = clampInt(document.querySelector("#customHealth").value, 1, 20, 1);
    if (document.querySelector("#customGuard").checked) card.guard = true;
    if (document.querySelector("#customCharge").checked) card.charge = true;
  }
  if (type === "luxury") {
    card.cashText = document.querySelector("#customCashText").value.trim() || "抽 1 張牌。";
  }

  const nextMods = collectMods();
  if (editingId) {
    nextMods.customCards = nextMods.customCards.map((item) => (item.id === editingId ? card : item));
    delete nextMods.cards[editingId];
  } else {
    nextMods.customCards.push(card);
  }
  if (!persistMods(nextMods, editingId ? "自製卡已更新。" : "自製卡已建立。")) return;
  upsertCustomCardInData(card);
  clearCustomCardForm();
  renderCustomCardList();
  renderCards();
  updateExportBox();
}

function clearCustomCardForm() {
  document.querySelector("#customEditingId").value = "";
  document.querySelector("#customName").value = "";
  document.querySelector("#customType").value = "unit";
  document.querySelector("#customFaction").value = "neutral";
  document.querySelector("#customCost").value = "1";
  document.querySelector("#customAttack").value = "1";
  document.querySelector("#customHealth").value = "1";
  document.querySelector("#customEffect").value = "";
  document.querySelector("#customTarget").value = "";
  document.querySelector("#customText").value = "";
  document.querySelector("#customCashText").value = "";
  document.querySelector("#customImageData").value = "";
  document.querySelector("#customPreview").setAttribute("style", getArtStyle({ art: 0 }));
  document.querySelector("#customGuard").checked = false;
  document.querySelector("#customCharge").checked = false;
  document.querySelector("#createCustomCardBtn").textContent = "建立卡牌";
  document.querySelector("#cancelCustomEditBtn").hidden = true;
  updateCustomFormState();
}

function collectMods() {
  const rules = {};
  ruleFields.forEach(([key, , min, max]) => {
    const input = document.querySelector(`[data-rule="${key}"]`);
    rules[key] = input ? clampInt(input.value, min, max, data.defaultRules[key]) : data.defaultRules[key];
  });

  const cards = {};
  document.querySelectorAll(".editor-card").forEach((node) => {
    const original = data.originalCards.find((card) => card.id === node.dataset.cardId);
    if (!original) return;
    const cardMod = {};
    node.querySelectorAll("[data-card-field]").forEach((input) => {
      const field = input.dataset.cardField;
      if (input.disabled) return;
      if (field === "text") {
        if (input.value.trim()) cardMod.text = input.value.trim();
      } else if (field === "customArt") {
        const customArt = sanitizeCustomImage(input.value);
        if (customArt) cardMod.customArt = customArt;
      } else {
        const fallback = original[field] ?? 0;
        cardMod[field] = clampInt(input.value, Number(input.min), Number(input.max), fallback);
      }
    });
    if (isCardModified(original, cardMod)) cards[original.id] = cardMod;
  });

  return { rules, cards, customCards: mods.customCards || [] };
}

function isCardModified(original, cardMod) {
  if (cardMod.text) return true;
  if (cardMod.customArt) return true;
  if (Number(cardMod.cost) !== Number(original.cost)) return true;
  if (original.type === "unit" && Number(cardMod.attack) !== Number(original.attack)) return true;
  if (original.type === "unit" && Number(cardMod.health) !== Number(original.health)) return true;
  return false;
}

function saveAll() {
  const nextMods = collectMods();
  if (persistMods(nextMods, "已儲存。回到遊戲並重新開局即可套用。")) updateExportBox();
}

function resetAll() {
  (mods.customCards || []).forEach((card) => removeCardFromStoredDeck(card.id));
  localStorage.removeItem(STORAGE_KEY);
  setStatus("已重置為預設值。");
  window.setTimeout(() => window.location.reload(), 250);
}

function updateExportBox() {
  document.querySelector("#exportBox").value = JSON.stringify(collectMods(), null, 2);
}

function importMods() {
  try {
    const nextMods = normalizeMods(JSON.parse(document.querySelector("#exportBox").value || "{}"));
    const nextIds = new Set(nextMods.customCards.map((card) => card.id));
    (mods.customCards || []).forEach((card) => {
      if (!nextIds.has(card.id)) removeCardFromStoredDeck(card.id);
    });
    if (persistMods(nextMods, "匯入完成，正在重新整理。")) {
      window.setTimeout(() => window.location.reload(), 250);
    }
  } catch {
    setStatus("匯入失敗：JSON 格式不正確。");
  }
}

function persistMods(nextMods, successText) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMods));
    mods = nextMods;
    if (successText) setStatus(successText);
    return true;
  } catch {
    setStatus("儲存失敗：圖片資料可能太大，請清除幾張圖片或改用較小的圖片。");
    return false;
  }
}

function upsertCustomCardInData(card) {
  removeCustomCardFromData(card.id);
  data.cards.push(card);
  data.originalCards.push({ ...card });
}

function removeCustomCardFromData(cardId) {
  data.cards = data.cards.filter((card) => card.id !== cardId);
  data.originalCards = data.originalCards.filter((card) => card.id !== cardId);
}

function removeCardFromStoredDeck(cardId) {
  try {
    const saved = JSON.parse(localStorage.getItem("cyberCardDeck") || "{}");
    if (saved.counts && Object.prototype.hasOwnProperty.call(saved.counts, cardId)) {
      delete saved.counts[cardId];
      localStorage.setItem("cyberCardDeck", JSON.stringify(saved));
    }
  } catch {
    // Ignore broken deck storage; the game page will rebuild from valid cards.
  }
}

function setStatus(text) {
  document.querySelector("#modifierStatus").textContent = text;
}

function getArtStyle(card) {
  const customArt = sanitizeCustomImage(card?.customArt);
  if (customArt) {
    return `--art-image:url("${escapeCssUrl(customArt)}");--art-size:cover;--art-x:center;--art-y:center;--art-ratio:1 / 1;`;
  }
  const art = Number.isFinite(card?.art) ? card.art : 0;
  const atlas = ART_ATLASES[card?.atlas || 1] || ART_ATLASES[1];
  const zoom = atlas.zoom || 1;
  const col = art % atlas.columns;
  const row = Math.floor(art / atlas.columns);
  const x = getSpritePosition(col, atlas.columns, zoom);
  const y = getSpritePosition(row, atlas.rows, zoom);
  return `--art-image:${atlas.image};--art-size:${atlas.columns * 100 * zoom}% ${atlas.rows * 100 * zoom}%;--art-x:${x}%;--art-y:${y}%;--art-ratio:${atlas.ratio};`;
}

function getSpritePosition(index, count, zoom) {
  if (count <= 1) return 50;
  return ((0.5 - (index + 0.5) * zoom) / (1 - count * zoom)) * 100;
}

function resizeImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Not an image"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const image = new Image();
      image.onerror = reject;
      image.onload = () => {
        const size = 512;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const side = Math.min(image.width, image.height);
        const sx = (image.width - side) / 2;
        const sy = (image.height - side) / 2;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(image, sx, sy, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.84));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function makeCustomCardId(name) {
  const base =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 24) || "card";
  const used = new Set(data.originalCards.map((card) => card.id));
  let id = `custom_${base}_${Date.now().toString(36)}`;
  while (used.has(id)) id = `custom_${base}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`;
  return id;
}

function sanitizeCustomImage(value) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (trimmed.length > 450000) return "";
  return CUSTOM_IMAGE_PATTERN.test(trimmed) ? trimmed : "";
}

function clampInt(value, min, max, fallback) {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

function escapeCssUrl(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function escapeAttr(text) {
  return escapeHtml(text);
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
