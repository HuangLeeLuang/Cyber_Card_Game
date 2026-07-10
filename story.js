const STORY_ACTIVE_KEY = "cyberStoryBattle";
const STORY_PROGRESS_KEY = "cyberStoryProgress";

const STORY_CHAPTERS = [
  {
    id: "chapter-1",
    title: "第一章：地下牌局",
    description: "先學會召喚單位、攻擊、處理守衛，再理解奢侈品裝備。",
    clearTitle: "地下牌局破關",
    clearCopy: "你已經能完成基本出牌、攻擊與裝備。下一章會加入抽牌與目標法術。",
    clearImage: 0,
    battles: [
      {
        id: "c1-1",
        title: "第一張單位",
        enemyName: "練習對手",
        enemyOperator: "corp",
        enemyLife: 8,
        intro: "先把單位放到場上。單位活下來後，下一回合就能攻擊。",
        hint: "提示：按快速配牌也可以，這場只要學會召喚單位和攻擊操作者。",
        ruleText: "敵人生命較低，沒有特殊規則。",
        enemyDeck: [
          "security_intern",
          "security_intern",
          "chrome_runner",
          "chrome_runner",
          "market_drone",
          "street_medic",
          "corp_guard",
          "emp_pulse",
          "data_broker",
          "limited_watch",
          "alloy_skin",
          "tax_drone",
          "dock_guard",
          "black_market_tip",
          "sapphire_watch",
        ],
      },
      {
        id: "c1-2",
        title: "守衛在前",
        enemyName: "巷口守衛",
        enemyOperator: "corp",
        enemyLife: 10,
        intro: "有守衛時，攻擊必須先處理守衛。這是防守牌組最常用的節奏。",
        hint: "提示：先攻擊有守衛的單位，再攻擊敵方操作者。",
        ruleText: "敵人會使用較多守衛，但攻擊力不高。",
        enemyDeck: [
          "security_intern",
          "security_intern",
          "corp_guard",
          "corp_guard",
          "dock_guard",
          "dock_guard",
          "street_medic",
          "credit_audit",
          "asset_freeze",
          "titanium_lining",
          "sky_estate",
          "boardroom_knight",
          "tax_drone",
          "dividend_burst",
          "sapphire_watch",
        ],
      },
      {
        id: "c1-3",
        title: "程式與改造",
        enemyName: "測試程式員",
        enemyOperator: "hacker",
        enemyLife: 11,
        intro: "程式通常會造成傷害、抽牌或改變局勢。改造則要選友方單位作為目標。",
        hint: "提示：有目標的牌會要求你點選合法目標。黃色外框就是能點的地方。",
        ruleText: "敵人會使用少量傷害程式，方便練習目標選擇。",
        enemyDeck: [
          "packet_ghost",
          "packet_ghost",
          "daemon_swarm",
          "daemon_swarm",
          "backdoor_agent",
          "virus_inject",
          "packet_theft",
          "logic_trap",
          "neural_reflex",
          "emp_pulse",
          "data_broker",
          "cipher_urchin",
          "memory_splice",
          "firewall_leak",
          "cloaking_loop",
        ],
      },
      {
        id: "c1-4",
        title: "車庫莊家",
        enemyName: "車庫莊家",
        enemyOperator: "merc",
        enemyLife: 12,
        intro: "奢侈品可以裝備操作者，也可以裝到單位。裝單位通常比較快，裝操作者通常比較穩。",
        hint: "提示：這場試著把奢侈品裝到單位上，必要時也可以變現。",
        ruleText: "章節最終戰。勝利後會解鎖破關圖片。",
        clearBattle: true,
        clearImage: 0,
        enemyDeck: [
          "flash_splicer",
          "flash_splicer",
          "blade_courier",
          "blade_courier",
          "overclock_strike",
          "weapon_contract",
          "carbon_blade",
          "cyber_car",
          "limited_sneakers",
          "night_rider",
          "asphalt_samurai",
          "drone_biker",
          "reflex_chip",
          "aurora_hypercar",
          "phantom_sneakers",
        ],
      },
    ],
  },
  {
    id: "chapter-2",
    title: "第二章：資料寺院",
    description: "開始練習抽牌、凍結、手牌上限，以及用程式掌控節奏。",
    clearTitle: "資料寺院破關",
    clearCopy: "你已經會用資源和目標效果控制戰局。下一章會面對更厚的護盾和守衛。",
    clearImage: 1,
    battles: [
      {
        id: "c2-1",
        title: "補牌課程",
        enemyName: "資料學徒",
        enemyOperator: "hacker",
        enemyLife: 12,
        intro: "牌打太快會缺手牌。抽牌效果能讓你保留下一回合的選擇。",
        hint: "提示：不要一次把手牌打空。抽牌牌可以留到手牌少時再用。",
        ruleText: "敵人會抽牌，但前期單位較弱。",
        enemyDeck: [
          "cipher_urchin",
          "cipher_urchin",
          "packet_ghost",
          "market_drone",
          "data_broker",
          "data_broker",
          "memory_splice",
          "memory_splice",
          "phishing_gala",
          "backdoor_agent",
          "mirror_netrunner",
          "black_card_bag",
          "obsidian_bag",
          "holo_art_vault",
          "limited_watch",
        ],
      },
      {
        id: "c2-2",
        title: "凍結測試",
        enemyName: "封包守門人",
        enemyOperator: "hacker",
        enemyLife: 13,
        intro: "凍結會讓單位暫時不能攻擊。遇到高攻擊單位時，凍結比直接打死更省資源。",
        hint: "提示：若你的大單位被凍結，先改用其他單位或程式處理場面。",
        ruleText: "敵人會使用凍結，但生命仍然偏低。",
        enemyDeck: [
          "packet_ghost",
          "daemon_swarm",
          "daemon_swarm",
          "asset_freeze",
          "asset_freeze",
          "drone_hijack",
          "drone_hijack",
          "firewall_leak",
          "virus_inject",
          "logic_trap",
          "mirror_netrunner",
          "ghost_broker",
          "crypto_timepiece",
          "sapphire_watch",
          "cloaking_loop",
        ],
      },
      {
        id: "c2-3",
        title: "資料金庫",
        enemyName: "金庫代理",
        enemyOperator: "corp",
        enemyLife: 14,
        intro: "有時候不用急著打臉，先處理會累積價值的敵方單位更穩。",
        hint: "提示：如果敵人抽很多牌，先解掉抽牌單位，再慢慢攻擊操作者。",
        ruleText: "敵人會混合護盾和抽牌。",
        enemyDeck: [
          "security_intern",
          "corp_guard",
          "tax_drone",
          "executive_drone",
          "credit_audit",
          "credit_audit",
          "dividend_burst",
          "asset_recall",
          "premium_armor",
          "vault_attendant",
          "black_market_tip",
          "skyline_scan",
          "obsidian_bag",
          "sky_penthouse",
          "holo_art_vault",
        ],
      },
      {
        id: "c2-4",
        title: "資料寺院管理者",
        enemyName: "寺院管理者",
        enemyOperator: "hacker",
        enemyLife: 15,
        intro: "這場會同時出現抽牌、凍結和奢侈品。慢慢解題就好。",
        hint: "提示：保留一兩張解場程式，別讓敵人的資源單位一直站場。",
        ruleText: "章節最終戰。勝利後會解鎖資料寺院破關圖片。",
        clearBattle: true,
        clearImage: 1,
        enemyDeck: [
          "cipher_urchin",
          "mirror_netrunner",
          "mirror_netrunner",
          "ghost_broker",
          "datavault_sage",
          "quantum_thief",
          "memory_splice",
          "phishing_gala",
          "firewall_leak",
          "zero_day_bid",
          "drone_hijack",
          "neural_lace",
          "holo_art_vault",
          "crypto_timepiece",
          "obsidian_bag",
        ],
      },
    ],
  },
  {
    id: "chapter-3",
    title: "第三章：企業空港",
    description: "練習面對護盾、厚血守衛、飛機與郵輪，最後挑戰王冠郵輪。",
    clearTitle: "企業空港破關",
    clearCopy: "你已經能打穿企業防線。最後只剩下王冠郵輪。",
    clearImage: 2,
    battles: [
      {
        id: "c3-1",
        title: "護盾櫃台",
        enemyName: "空港櫃台長",
        enemyOperator: "corp",
        enemyLife: 14,
        enemyShield: 2,
        intro: "護盾會先擋傷害。先用小傷害消掉護盾，再用高傷害收尾。",
        hint: "提示：護盾不是生命，打掉後不會自動回來，除非敵人再獲得護盾。",
        ruleText: "敵人開局有 2 護盾。",
        enemyDeck: [
          "security_intern",
          "compliance_sentinel",
          "tax_drone",
          "tax_drone",
          "executive_drone",
          "corp_guard",
          "credit_audit",
          "dividend_burst",
          "dividend_burst",
          "premium_armor",
          "executive_plating",
          "designer_jacket",
          "armored_limo",
          "sky_estate",
          "sky_penthouse",
        ],
      },
      {
        id: "c3-2",
        title: "登機門守衛",
        enemyName: "登機門保全",
        enemyOperator: "corp",
        enemyLife: 16,
        intro: "厚血守衛會拖慢快攻。這時候改造自己的單位，或用程式解場都可以。",
        hint: "提示：不要把所有攻擊都浪費在護盾上；先建立場面再一次推進。",
        ruleText: "敵人有較多守衛，但缺少爆發。",
        enemyDeck: [
          "compliance_sentinel",
          "compliance_sentinel",
          "boardroom_knight",
          "boardroom_knight",
          "elevator_guard",
          "elevator_guard",
          "terminal_architect",
          "court_injunction",
          "asset_freeze",
          "executive_plating",
          "prestige_protocol",
          "orbital_estate",
          "corporate_yacht",
          "designer_jacket",
          "sky_penthouse",
        ],
      },
      {
        id: "c3-3",
        title: "私人航線",
        enemyName: "飛艇經理",
        enemyOperator: "merc",
        enemyLife: 16,
        intro: "飛機和載具類奢侈品會讓節奏突然加速。看到敵方能立刻攻擊的單位，要優先處理。",
        hint: "提示：保留守衛或凍結，能防止飛機載具一波打穿你。",
        ruleText: "敵人會用載具和速攻單位搶節奏。",
        enemyDeck: [
          "night_rider",
          "flash_splicer",
          "asphalt_samurai",
          "drone_biker",
          "jetpack_raider",
          "hangar_duelist",
          "chrome_pilot",
          "bounty_ping",
          "airstrike_contract",
          "getaway_route",
          "magrail_blade",
          "pilot_exosuit",
          "private_airship",
          "aurora_hypercar",
          "phantom_sneakers",
        ],
      },
      {
        id: "c3-4",
        title: "王冠郵輪",
        enemyName: "王冠持有人",
        enemyOperator: "corp",
        enemyLife: 18,
        enemyShield: 3,
        intro: "最後一戰會用到前面所有觀念：守衛、護盾、抽牌、奢侈品裝備與變現。",
        hint: "提示：每回合先看敵方守衛，再決定要解場、鋪場，還是變現奢侈品收尾。",
        ruleText: "最終戰。勝利後會顯示完整通關恭喜圖片。",
        clearBattle: true,
        finalBattle: true,
        clearImage: 3,
        enemyDeck: [
          "compliance_sentinel",
          "boardroom_knight",
          "elevator_guard",
          "terminal_architect",
          "aero_lawyer",
          "credit_audit",
          "court_injunction",
          "dividend_burst",
          "executive_plating",
          "prestige_protocol",
          "sky_penthouse",
          "orbital_estate",
          "corporate_yacht",
          "oceanic_cruise",
          "luxury_cruise",
        ],
      },
    ],
  },
];

document.addEventListener("DOMContentLoaded", () => {
  renderStory();
  document.querySelector("#resetStoryBtn").addEventListener("click", resetStory);
  document.querySelector("#continueStoryBtn").addEventListener("click", continueStory);
});

function renderStory() {
  const progress = loadProgress();
  const flatBattles = flattenBattles();
  const completedCount = flatBattles.filter((item) => progress.completed[item.battle.id]).length;
  const nextBattle = flatBattles.find((item, index) => isBattleUnlocked(index, progress) && !progress.completed[item.battle.id]);

  document.querySelector("#continueStoryBtn").disabled = !nextBattle;
  document.querySelector("#storyProgressSummary").innerHTML = `
    <p><strong>${completedCount} / ${flatBattles.length}</strong> 場完成</p>
    <p>${nextBattle ? `下一場：${nextBattle.chapter.title}／${nextBattle.battle.title}` : "劇情已全部完成。"}</p>
  `;

  document.querySelector("#chapterList").innerHTML = STORY_CHAPTERS.map((chapter) => renderChapter(chapter, progress, flatBattles)).join("");
  document.querySelectorAll("[data-start-story]").forEach((button) => {
    button.addEventListener("click", () => {
      const battleId = button.dataset.startStory;
      const item = flatBattles.find((entry) => entry.battle.id === battleId);
      if (item) startStoryBattle(item.chapter, item.battle);
    });
  });
}

function renderChapter(chapter, progress, flatBattles) {
  const battles = chapter.battles
    .map((battle) => {
      const flatIndex = flatBattles.findIndex((item) => item.battle.id === battle.id);
      const unlocked = isBattleUnlocked(flatIndex, progress);
      const completed = Boolean(progress.completed[battle.id]);
      const status = completed ? "已完成" : unlocked ? "可挑戰" : "未解鎖";
      return `
        <article class="story-node ${completed ? "completed" : ""} ${unlocked ? "unlocked" : "locked"}">
          <div>
            <span class="story-status">${status}</span>
            <h3>${battle.title}</h3>
            <p>${battle.intro}</p>
            <strong>${battle.ruleText}</strong>
          </div>
          <button class="${completed ? "ghost-button" : "primary-button"}" data-start-story="${battle.id}" ${unlocked ? "" : "disabled"}>
            ${completed ? "重玩配牌" : "進入配牌"}
          </button>
        </article>
      `;
    })
    .join("");

  return `
    <section class="section-band story-chapter">
      <div class="story-chapter-heading">
        <div>
          <h2>${chapter.title}</h2>
          <p>${chapter.description}</p>
        </div>
      </div>
      <div class="story-node-list">${battles}</div>
    </section>
  `;
}

function continueStory() {
  const progress = loadProgress();
  const flatBattles = flattenBattles();
  const nextBattle = flatBattles.find((item, index) => isBattleUnlocked(index, progress) && !progress.completed[item.battle.id]);
  if (nextBattle) startStoryBattle(nextBattle.chapter, nextBattle.battle);
}

function startStoryBattle(chapter, battle) {
  const activeBattle = {
    id: battle.id,
    chapterId: chapter.id,
    chapterTitle: chapter.title,
    battleTitle: battle.title,
    enemyName: battle.enemyName,
    enemyOperator: battle.enemyOperator,
    enemyLife: battle.enemyLife,
    enemyShield: battle.enemyShield || 0,
    intro: battle.intro,
    hint: battle.hint,
    ruleText: battle.ruleText,
    enemyDeck: battle.enemyDeck,
    clearBattle: Boolean(battle.clearBattle),
    finalBattle: Boolean(battle.finalBattle),
    clearTitle: battle.finalBattle ? "恭喜通關" : chapter.clearTitle,
    clearCopy: battle.finalBattle ? "你完成了王冠序章，已經掌握賽博牌局的基礎規則。" : chapter.clearCopy,
    clearImage: battle.clearImage ?? chapter.clearImage,
  };
  localStorage.setItem(STORY_ACTIVE_KEY, JSON.stringify(activeBattle));
  window.location.href = "index.html?story=1";
}

function resetStory() {
  const confirmed = window.confirm("要重置劇情進度嗎？已完成的關卡會清空。");
  if (!confirmed) return;
  localStorage.removeItem(STORY_PROGRESS_KEY);
  localStorage.removeItem(STORY_ACTIVE_KEY);
  renderStory();
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORY_PROGRESS_KEY) || "{}");
    return {
      completed: saved.completed || {},
      lastClear: saved.lastClear || null,
    };
  } catch {
    return { completed: {}, lastClear: null };
  }
}

function flattenBattles() {
  return STORY_CHAPTERS.flatMap((chapter) => chapter.battles.map((battle) => ({ chapter, battle })));
}

function isBattleUnlocked(flatIndex, progress) {
  if (flatIndex <= 0) return true;
  const previous = flattenBattles()[flatIndex - 1];
  return Boolean(previous && progress.completed[previous.battle.id]);
}
