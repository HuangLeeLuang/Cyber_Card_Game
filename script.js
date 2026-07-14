const CARD_TYPES = {
  unit: "單位",
  program: "程式",
  mod: "改造",
  luxury: "奢侈品",
};

const FACTIONS = {
  neutral: "中立",
  merc: "街頭",
  hacker: "駭客",
  corp: "企業",
};

const OPERATORS = {
  merc: {
    id: "merc",
    name: "街頭傭兵",
    style: "快攻、速攻、武器爆發",
    skillName: "火力壓制",
    skillCost: 2,
    skillText: "造成 1 點傷害；本回合打出奢侈品後改為 2 點。",
    passiveName: "街頭氣勢",
    passiveText: "每回合第一個召喚的單位 +1 攻擊。",
  },
  hacker: {
    id: "hacker",
    name: "黑帽駭客",
    style: "抽牌、干擾、病毒傷害",
    skillName: "資料竊取",
    skillCost: 2,
    skillText: "抽 1 張牌。",
    passiveName: "零日捷徑",
    passiveText: "每回合第一張程式費用 -1。",
  },
  corp: {
    id: "corp",
    name: "企業主管",
    style: "護盾、守衛、資產滾動",
    skillName: "信用護盾",
    skillCost: 2,
    skillText: "獲得 2 點護盾。",
    passiveName: "資本緩衝",
    passiveText: "每回合第一次獲得護盾時額外 +1。",
  },
};

const CUSTOM_CARD_EFFECTS = new Set([
  "",
  "draw_1",
  "draw_2",
  "heal_hero_2",
  "heal_3",
  "gain_shield_1",
  "gain_shield_2",
  "deal_2",
  "deal_3",
  "deal_1_freeze",
  "deal_2_gain_shield_1",
  "draw_1_gain_shield_1",
  "draw_1_break_shield",
  "enemy_units_minus_1_attack",
  "enemy_units_take_1",
  "deal_1_all_enemies",
  "discount_1",
  "summon_1_1_guard",
  "summon_2_1_charge",
  "buff_1_1_ready",
  "buff_1_0_ready",
  "buff_2_0",
  "buff_attack_2_ready",
  "buff_0_2_guard",
  "buff_0_3_guard",
  "buff_1_2_guard",
  "ready_all_units",
]);
const CUSTOM_CARD_TARGETS = new Set(["", "enemy", "enemyUnit", "friendlyUnit"]);
const CUSTOM_IMAGE_PATTERN = /^data:image\/(?:png|jpe?g|webp);base64,[a-z0-9+/=]+$/i;

const CARDS = [
  {
    id: "chrome_runner",
    name: "鍍鉻跑腿",
    type: "unit",
    faction: "neutral",
    cost: 1,
    attack: 1,
    health: 2,
    art: 0,
    text: "便宜可靠的街頭單位。",
  },
  {
    id: "market_drone",
    name: "市場無人機",
    type: "unit",
    faction: "neutral",
    cost: 1,
    attack: 1,
    health: 1,
    art: 1,
    text: "入場：若你有已裝備的奢侈品，抽 1 張牌。",
    effect: "draw_if_luxury",
  },
  {
    id: "street_medic",
    name: "黑診所醫師",
    type: "unit",
    faction: "neutral",
    cost: 2,
    attack: 1,
    health: 3,
    art: 2,
    text: "入場：恢復 2 點生命。",
    effect: "heal_hero_2",
  },
  {
    id: "security_bot",
    name: "安保機器人",
    type: "unit",
    faction: "neutral",
    cost: 3,
    attack: 2,
    health: 4,
    guard: true,
    art: 3,
    text: "守衛。",
  },
  {
    id: "emp_pulse",
    name: "電磁脈衝",
    type: "program",
    faction: "neutral",
    cost: 2,
    target: "enemy",
    art: 5,
    text: "造成 2 點傷害。",
    effect: "deal_2",
  },
  {
    id: "data_broker",
    name: "資料掮客",
    type: "program",
    faction: "neutral",
    cost: 2,
    art: 26,
    text: "抽 2 張牌。",
    effect: "draw_2",
  },
  {
    id: "neural_reflex",
    name: "反射神經",
    type: "mod",
    faction: "neutral",
    cost: 1,
    target: "friendlyUnit",
    art: 7,
    text: "一個友方單位 +1/+1，並可立即攻擊。",
    effect: "buff_1_1_ready",
  },
  {
    id: "alloy_skin",
    name: "合金皮層",
    type: "mod",
    faction: "neutral",
    cost: 2,
    target: "friendlyUnit",
    art: 24,
    text: "一個友方單位 +0/+3 並獲得守衛。",
    effect: "buff_0_3_guard",
  },
  {
    id: "cyber_car",
    name: "賽博超跑",
    type: "luxury",
    faction: "neutral",
    cost: 2,
    art: 9,
    text: "裝備單位：+1 攻擊並可攻擊。裝備操作者：每回合第一個單位可立即攻擊。變現：本回合獲得 2 能量。",
    cashText: "本回合獲得 2 能量。",
  },
  {
    id: "limited_watch",
    name: "限量名錶",
    type: "luxury",
    faction: "neutral",
    cost: 2,
    art: 10,
    text: "裝備單位：+0/+1。裝備操作者：回合開始時若手牌少於對手，抽 1 張。變現：下一張牌費用 -2。",
    cashText: "下一張牌費用 -2。",
  },
  {
    id: "black_card_bag",
    name: "黑卡名包",
    type: "luxury",
    faction: "neutral",
    cost: 2,
    art: 11,
    text: "裝備單位：+1/+1。裝備操作者：手牌上限 +2。變現：抽 2 張牌。",
    cashText: "抽 2 張牌。",
  },
  {
    id: "limited_sneakers",
    name: "限量球鞋",
    type: "luxury",
    faction: "neutral",
    cost: 2,
    art: 12,
    text: "裝備單位：+1 攻擊並可攻擊。裝備操作者：你的 1 費單位入場時 +1 攻擊。變現：所有友方單位可攻擊。",
    cashText: "所有友方單位可攻擊。",
  },
  {
    id: "designer_jacket",
    name: "高訂戰術外套",
    type: "luxury",
    faction: "neutral",
    cost: 2,
    art: 13,
    text: "裝備單位：+0/+3 並獲得守衛。裝備操作者：每回合第一次受到的英雄傷害 -1。變現：獲得 3 護盾。",
    cashText: "獲得 3 護盾。",
  },
  {
    id: "sky_estate",
    name: "空中豪宅",
    type: "luxury",
    faction: "neutral",
    cost: 3,
    art: 14,
    text: "裝備單位：+0/+2 並獲得守衛。裝備操作者：回合結束時獲得 1 護盾。變現：恢復 4 生命。",
    cashText: "恢復 4 生命。",
  },
  {
    id: "private_jet",
    name: "私人噴射機",
    type: "luxury",
    faction: "neutral",
    cost: 3,
    art: 15,
    text: "裝備單位：+1 攻擊並可攻擊。裝備操作者：每回合第一張程式費用 -1。變現：全隊可攻擊。",
    cashText: "全隊可攻擊。",
  },
  {
    id: "luxury_cruise",
    name: "星港郵輪",
    type: "luxury",
    faction: "neutral",
    cost: 4,
    art: 16,
    text: "裝備單位：+0/+2 並獲得守衛。裝備操作者：回合結束時若生命低於對手，恢復 1。變現：召喚兩名 1/2 守衛。",
    cashText: "召喚兩名 1/2 守衛。",
  },
  {
    id: "flash_splicer",
    name: "快閃械手",
    type: "unit",
    faction: "merc",
    cost: 1,
    attack: 2,
    health: 1,
    charge: true,
    art: 17,
    text: "速攻。",
  },
  {
    id: "blade_courier",
    name: "電磁刀客",
    type: "unit",
    faction: "merc",
    cost: 2,
    attack: 3,
    health: 2,
    art: 18,
    text: "高攻擊低生命的壓力單位。",
  },
  {
    id: "contract_killer",
    name: "合約獵手",
    type: "unit",
    faction: "merc",
    cost: 3,
    attack: 4,
    health: 2,
    charge: true,
    art: 6,
    text: "速攻。",
  },
  {
    id: "overclock_strike",
    name: "超頻斬擊",
    type: "program",
    faction: "merc",
    cost: 1,
    target: "enemy",
    art: 20,
    text: "造成 1 點傷害。若你有已裝備的奢侈品，改為 2 點。",
    effect: "deal_1_luxury_2",
  },
  {
    id: "weapon_contract",
    name: "武器合約",
    type: "program",
    faction: "merc",
    cost: 2,
    target: "friendlyUnit",
    art: 27,
    text: "一個友方單位本回合 +2 攻擊，並可立即攻擊。",
    effect: "buff_attack_2_ready",
  },
  {
    id: "carbon_blade",
    name: "碳纖維刀臂",
    type: "mod",
    faction: "merc",
    cost: 2,
    target: "friendlyUnit",
    art: 25,
    text: "一個友方單位 +2/+0。",
    effect: "buff_2_0",
  },
  {
    id: "packet_ghost",
    name: "封包幽靈",
    type: "unit",
    faction: "hacker",
    cost: 1,
    attack: 1,
    health: 3,
    art: 29,
    text: "耐打的低費駭客。",
  },
  {
    id: "daemon_swarm",
    name: "惡意程式群",
    type: "unit",
    faction: "hacker",
    cost: 2,
    attack: 2,
    health: 2,
    art: 19,
    text: "入場：對敵方英雄造成 1 點傷害。",
    effect: "ping_enemy_hero",
  },
  {
    id: "backdoor_agent",
    name: "後門特工",
    type: "unit",
    faction: "hacker",
    cost: 3,
    attack: 3,
    health: 3,
    art: 30,
    text: "入場：抽 1 張牌。",
    effect: "draw_1",
  },
  {
    id: "virus_inject",
    name: "病毒注入",
    type: "program",
    faction: "hacker",
    cost: 2,
    target: "enemy",
    art: 35,
    text: "造成 2 點傷害，抽 1 張牌。",
    effect: "deal_2_draw_1",
  },
  {
    id: "packet_theft",
    name: "封包竊取",
    type: "program",
    faction: "hacker",
    cost: 1,
    art: 4,
    text: "抽 1 張牌，敵方失去 1 點護盾。",
    effect: "draw_1_break_shield",
  },
  {
    id: "logic_trap",
    name: "邏輯陷阱",
    type: "program",
    faction: "hacker",
    cost: 3,
    art: 23,
    text: "敵方所有單位 -1 攻擊。",
    effect: "enemy_units_minus_1_attack",
  },
  {
    id: "security_intern",
    name: "安保實習生",
    type: "unit",
    faction: "corp",
    cost: 1,
    attack: 1,
    health: 2,
    guard: true,
    art: 21,
    text: "守衛。",
  },
  {
    id: "corp_guard",
    name: "企業保鑣",
    type: "unit",
    faction: "corp",
    cost: 2,
    attack: 2,
    health: 3,
    guard: true,
    art: 22,
    text: "守衛。",
  },
  {
    id: "executive_drone",
    name: "董事無人機",
    type: "unit",
    faction: "corp",
    cost: 3,
    attack: 3,
    health: 3,
    art: 28,
    text: "入場：獲得 1 點護盾。",
    effect: "gain_shield_1",
  },
  {
    id: "credit_audit",
    name: "信用稽核",
    type: "program",
    faction: "corp",
    cost: 2,
    target: "enemy",
    art: 33,
    text: "造成 2 點傷害，獲得 1 點護盾。",
    effect: "deal_2_gain_shield_1",
  },
  {
    id: "asset_freeze",
    name: "資產凍結",
    type: "program",
    faction: "corp",
    cost: 2,
    target: "enemyUnit",
    art: 34,
    text: "造成 1 點傷害，並使目標下回合不能攻擊。",
    effect: "deal_1_freeze",
  },
  {
    id: "premium_armor",
    name: "白金防彈衣",
    type: "mod",
    faction: "corp",
    cost: 2,
    target: "friendlyUnit",
    art: 31,
    text: "一個友方單位 +1/+2 並獲得守衛。",
    effect: "buff_1_2_guard",
  },
];

CARDS.push(
  {
    id: "night_rider",
    name: "夜雨騎手",
    type: "unit",
    faction: "neutral",
    cost: 1,
    attack: 2,
    health: 1,
    charge: true,
    atlas: 2,
    art: 0,
    text: "速攻。",
  },
  {
    id: "clinic_fixers",
    name: "街角義肢師",
    type: "unit",
    faction: "neutral",
    cost: 2,
    attack: 1,
    health: 3,
    atlas: 2,
    art: 1,
    text: "進場：回復操作者 2 生命。",
    effect: "heal_hero_2",
  },
  {
    id: "dock_guard",
    name: "碼頭盾衛",
    type: "unit",
    faction: "neutral",
    cost: 2,
    attack: 2,
    health: 2,
    guard: true,
    atlas: 2,
    art: 2,
    text: "守衛。",
  },
  {
    id: "archive_monk",
    name: "資料寺僧",
    type: "unit",
    faction: "neutral",
    cost: 3,
    attack: 2,
    health: 4,
    atlas: 2,
    art: 10,
    text: "進場：回復操作者 3 生命。",
    effect: "heal_3",
  },
  {
    id: "orbital_guide",
    name: "軌道導遊",
    type: "unit",
    faction: "neutral",
    cost: 3,
    attack: 3,
    health: 2,
    atlas: 3,
    art: 3,
    text: "進場：抽 1 張牌。",
    effect: "draw_1",
  },
  {
    id: "vault_attendant",
    name: "金庫招待員",
    type: "unit",
    faction: "neutral",
    cost: 4,
    attack: 3,
    health: 5,
    guard: true,
    atlas: 3,
    art: 8,
    text: "守衛。進場：獲得 1 護盾。",
    effect: "gain_shield_1",
  },
  {
    id: "black_market_tip",
    name: "黑市線報",
    type: "program",
    faction: "neutral",
    cost: 1,
    atlas: 2,
    art: 31,
    text: "抽 1 張牌，獲得 1 護盾。",
    effect: "draw_1_gain_shield_1",
  },
  {
    id: "skyline_scan",
    name: "天際線掃描",
    type: "program",
    faction: "neutral",
    cost: 2,
    atlas: 3,
    art: 14,
    text: "抽 2 張牌。",
    effect: "draw_2",
  },
  {
    id: "pulse_auction",
    name: "脈衝拍賣",
    type: "program",
    faction: "neutral",
    cost: 2,
    target: "enemy",
    atlas: 3,
    art: 4,
    text: "造成 2 傷害，抽 1 張牌。",
    effect: "deal_2_draw_1",
  },
  {
    id: "emergency_route",
    name: "緊急航道",
    type: "program",
    faction: "neutral",
    cost: 3,
    atlas: 3,
    art: 17,
    text: "召喚一個 2/1 速攻載具。",
    effect: "summon_2_1_charge",
  },
  {
    id: "titanium_lining",
    name: "鈦纖內襯",
    type: "mod",
    faction: "neutral",
    cost: 1,
    target: "friendlyUnit",
    atlas: 3,
    art: 0,
    text: "一個友方單位 +0/+2 並獲得守衛。",
    effect: "buff_0_2_guard",
  },
  {
    id: "reflex_chip",
    name: "反射晶片",
    type: "mod",
    faction: "neutral",
    cost: 1,
    target: "friendlyUnit",
    atlas: 3,
    art: 15,
    text: "一個友方單位 +1/+0，並可立刻攻擊。",
    effect: "buff_1_0_ready",
  },
  {
    id: "aurora_hypercar",
    name: "極光超跑",
    type: "luxury",
    faction: "neutral",
    cost: 2,
    atlas: 2,
    art: 20,
    text: "裝備單位：+1 攻擊並可立刻攻擊。裝備操作者：你的第一個單位更適合搶節奏。變現：本回合獲得 2 能量。",
    cashText: "本回合獲得 2 能量。",
  },
  {
    id: "sapphire_watch",
    name: "藍晶名錶",
    type: "luxury",
    faction: "neutral",
    cost: 2,
    atlas: 2,
    art: 14,
    text: "裝備單位：+0/+1。裝備操作者：若你手牌較少，回合開始抽 1 張牌。變現：下一張牌費用 -2。",
    cashText: "下一張牌費用 -2。",
  },
  {
    id: "phantom_sneakers",
    name: "幻影球鞋",
    type: "luxury",
    faction: "neutral",
    cost: 2,
    atlas: 2,
    art: 18,
    text: "裝備單位：+1 攻擊並可立刻攻擊。裝備操作者：你的低費單位更有爆發力。變現：重置所有友方單位。",
    cashText: "重置所有友方單位。",
  },
  {
    id: "obsidian_bag",
    name: "黑曜手袋",
    type: "luxury",
    faction: "neutral",
    cost: 2,
    atlas: 2,
    art: 17,
    text: "裝備單位：+1/+1。裝備操作者：手牌上限 +1。變現：抽 2 張牌。",
    cashText: "抽 2 張牌。",
  },
  {
    id: "sky_penthouse",
    name: "雲端頂層宅",
    type: "luxury",
    faction: "neutral",
    cost: 3,
    atlas: 2,
    art: 30,
    text: "裝備單位：+0/+2 並獲得守衛。裝備操作者：回合結束獲得 1 護盾。變現：回復 4 生命。",
    cashText: "回復 4 生命。",
  },
  {
    id: "oceanic_cruise",
    name: "遠洋郵輪",
    type: "luxury",
    faction: "neutral",
    cost: 4,
    atlas: 2,
    art: 25,
    text: "裝備單位：+0/+2 並獲得守衛。裝備操作者：落後生命時回合結束回復 1。變現：召喚兩個 1/2 守衛。",
    cashText: "召喚兩個 1/2 守衛。",
  },
  {
    id: "asphalt_samurai",
    name: "柏油武士",
    type: "unit",
    faction: "merc",
    cost: 1,
    attack: 2,
    health: 2,
    atlas: 2,
    art: 8,
    text: "街頭常見的穩定前鋒。",
  },
  {
    id: "drone_biker",
    name: "無人機騎士",
    type: "unit",
    faction: "merc",
    cost: 2,
    attack: 3,
    health: 1,
    charge: true,
    atlas: 2,
    art: 21,
    text: "速攻。",
  },
  {
    id: "jetpack_raider",
    name: "噴射背包掠手",
    type: "unit",
    faction: "merc",
    cost: 2,
    attack: 2,
    health: 2,
    atlas: 2,
    art: 24,
    text: "進場：對敵方操作者造成 1 傷害。",
    effect: "ping_enemy_hero",
  },
  {
    id: "hangar_duelist",
    name: "機庫決鬥客",
    type: "unit",
    faction: "merc",
    cost: 3,
    attack: 4,
    health: 3,
    atlas: 2,
    art: 5,
    text: "高攻擊的中段壓力單位。",
  },
  {
    id: "cruise_bodyguard",
    name: "郵輪保鑣",
    type: "unit",
    faction: "merc",
    cost: 3,
    attack: 2,
    health: 5,
    guard: true,
    atlas: 2,
    art: 9,
    text: "守衛。",
  },
  {
    id: "chrome_pilot",
    name: "鍍鉻飛行員",
    type: "unit",
    faction: "merc",
    cost: 4,
    attack: 4,
    health: 4,
    atlas: 2,
    art: 4,
    text: "進場：下一張牌費用 -1。",
    effect: "discount_1",
  },
  {
    id: "bounty_ping",
    name: "懸賞定位",
    type: "program",
    faction: "merc",
    cost: 2,
    target: "enemy",
    atlas: 2,
    art: 13,
    text: "造成 3 傷害。",
    effect: "deal_3",
  },
  {
    id: "airstrike_contract",
    name: "空襲合約",
    type: "program",
    faction: "merc",
    cost: 3,
    target: "enemy",
    atlas: 2,
    art: 23,
    text: "造成 2 傷害，獲得 1 護盾。",
    effect: "deal_2_gain_shield_1",
  },
  {
    id: "getaway_route",
    name: "脫身路線",
    type: "program",
    faction: "merc",
    cost: 2,
    atlas: 2,
    art: 27,
    text: "重置所有友方單位。",
    effect: "ready_all_units",
  },
  {
    id: "shock_deal",
    name: "震撼交易",
    type: "program",
    faction: "merc",
    cost: 2,
    target: "enemyUnit",
    atlas: 3,
    art: 19,
    text: "對一個敵方單位造成 1 傷害並凍結。",
    effect: "deal_1_freeze",
  },
  {
    id: "magrail_blade",
    name: "磁軌刀鋒",
    type: "mod",
    faction: "merc",
    cost: 2,
    target: "friendlyUnit",
    atlas: 3,
    art: 24,
    text: "一個友方單位 +2/+0。",
    effect: "buff_2_0",
  },
  {
    id: "pilot_exosuit",
    name: "飛行外骨骼",
    type: "mod",
    faction: "merc",
    cost: 2,
    target: "friendlyUnit",
    atlas: 3,
    art: 25,
    text: "一個友方單位 +1/+2 並獲得守衛。",
    effect: "buff_1_2_guard",
  },
  {
    id: "private_airship",
    name: "私人飛艇",
    type: "luxury",
    faction: "merc",
    cost: 3,
    atlas: 2,
    art: 22,
    text: "裝備單位：+1 攻擊並可立刻攻擊。裝備操作者：每回合第一張程式費用 -1。變現：抽 1 張牌並獲得 1 能量。",
    cashText: "抽 1 張牌並獲得 1 能量。",
  },
  {
    id: "armored_limo",
    name: "防彈禮車",
    type: "luxury",
    faction: "merc",
    cost: 3,
    atlas: 2,
    art: 26,
    text: "裝備單位：+1/+1。裝備操作者：本回合第一次受傷 -1。變現：獲得 3 護盾。",
    cashText: "獲得 3 護盾。",
  },
  {
    id: "cipher_urchin",
    name: "密碼街童",
    type: "unit",
    faction: "hacker",
    cost: 1,
    attack: 1,
    health: 2,
    atlas: 3,
    art: 5,
    text: "進場：抽 1 張牌。",
    effect: "draw_1",
  },
  {
    id: "mirror_netrunner",
    name: "鏡像網行者",
    type: "unit",
    faction: "hacker",
    cost: 2,
    attack: 2,
    health: 3,
    atlas: 2,
    art: 3,
    text: "若你有裝備中的奢侈品，進場抽 1 張牌。",
    effect: "draw_if_luxury",
  },
  {
    id: "ghost_broker",
    name: "幽影掮客",
    type: "unit",
    faction: "hacker",
    cost: 3,
    attack: 2,
    health: 4,
    atlas: 3,
    art: 11,
    text: "進場：抽 1 張牌，獲得 1 護盾。",
    effect: "draw_1_gain_shield_1",
  },
  {
    id: "datavault_sage",
    name: "資料庫賢者",
    type: "unit",
    faction: "hacker",
    cost: 3,
    attack: 3,
    health: 3,
    atlas: 2,
    art: 6,
    text: "進場：抽 1 張牌。",
    effect: "draw_1",
  },
  {
    id: "quantum_thief",
    name: "量子竊賊",
    type: "unit",
    faction: "hacker",
    cost: 4,
    attack: 4,
    health: 3,
    atlas: 3,
    art: 6,
    text: "若你有裝備中的奢侈品，進場抽 1 張牌。",
    effect: "draw_if_luxury",
  },
  {
    id: "phishing_gala",
    name: "釣魚晚宴",
    type: "program",
    faction: "hacker",
    cost: 2,
    atlas: 3,
    art: 20,
    text: "抽 2 張牌。",
    effect: "draw_2",
  },
  {
    id: "memory_splice",
    name: "記憶剪接",
    type: "program",
    faction: "hacker",
    cost: 1,
    atlas: 2,
    art: 12,
    text: "抽 1 張牌，獲得 1 護盾。",
    effect: "draw_1_gain_shield_1",
  },
  {
    id: "firewall_leak",
    name: "防火牆洩漏",
    type: "program",
    faction: "hacker",
    cost: 2,
    target: "enemy",
    atlas: 3,
    art: 7,
    text: "造成 2 傷害，抽 1 張牌。",
    effect: "deal_2_draw_1",
  },
  {
    id: "zero_day_bid",
    name: "零日競標",
    type: "program",
    faction: "hacker",
    cost: 3,
    target: "enemy",
    atlas: 3,
    art: 16,
    text: "造成 3 傷害。",
    effect: "deal_3",
  },
  {
    id: "drone_hijack",
    name: "無人機劫持",
    type: "program",
    faction: "hacker",
    cost: 2,
    target: "enemyUnit",
    atlas: 3,
    art: 22,
    text: "凍結一個敵方單位。",
    effect: "freeze_enemy_unit",
  },
  {
    id: "cloaking_loop",
    name: "匿蹤迴圈",
    type: "mod",
    faction: "hacker",
    cost: 1,
    target: "friendlyUnit",
    atlas: 3,
    art: 12,
    text: "一個友方單位 +1/+0，並可立刻攻擊。",
    effect: "buff_1_0_ready",
  },
  {
    id: "neural_lace",
    name: "神經蕾絲",
    type: "mod",
    faction: "hacker",
    cost: 2,
    target: "friendlyUnit",
    atlas: 3,
    art: 18,
    text: "一個友方單位 +1/+1，並可立刻攻擊。",
    effect: "buff_1_1_ready",
  },
  {
    id: "holo_art_vault",
    name: "全息藝術金庫",
    type: "luxury",
    faction: "hacker",
    cost: 3,
    atlas: 2,
    art: 15,
    text: "裝備單位：+1/+1。裝備操作者：手牌上限 +1。變現：抽 1 張牌並獲得 1 護盾。",
    cashText: "抽 1 張牌並獲得 1 護盾。",
  },
  {
    id: "crypto_timepiece",
    name: "加密時計",
    type: "luxury",
    faction: "hacker",
    cost: 2,
    atlas: 2,
    art: 19,
    text: "裝備單位：+0/+1。裝備操作者：若你空手牌，回合開始抽 1 張牌。變現：抽 1 張牌，下一張牌費用 -1。",
    cashText: "抽 1 張牌，下一張牌費用 -1。",
  },
  {
    id: "compliance_sentinel",
    name: "合規哨兵",
    type: "unit",
    faction: "corp",
    cost: 1,
    attack: 1,
    health: 3,
    guard: true,
    atlas: 3,
    art: 26,
    text: "守衛。",
  },
  {
    id: "boardroom_knight",
    name: "董事會騎士",
    type: "unit",
    faction: "corp",
    cost: 2,
    attack: 2,
    health: 4,
    guard: true,
    atlas: 3,
    art: 10,
    text: "守衛。",
  },
  {
    id: "tax_drone",
    name: "稅務無人機",
    type: "unit",
    faction: "corp",
    cost: 2,
    attack: 2,
    health: 2,
    atlas: 2,
    art: 7,
    text: "進場：獲得 1 護盾。",
    effect: "gain_shield_1",
  },
  {
    id: "diamond_agent",
    name: "鑽石特勤",
    type: "unit",
    faction: "corp",
    cost: 3,
    attack: 3,
    health: 3,
    atlas: 3,
    art: 27,
    text: "進場：抽 1 張牌，獲得 1 護盾。",
    effect: "draw_1_gain_shield_1",
  },
  {
    id: "elevator_guard",
    name: "電梯守門人",
    type: "unit",
    faction: "corp",
    cost: 3,
    attack: 2,
    health: 5,
    guard: true,
    atlas: 2,
    art: 34,
    text: "守衛。",
  },
  {
    id: "aero_lawyer",
    name: "空勤法務",
    type: "unit",
    faction: "corp",
    cost: 4,
    attack: 3,
    health: 4,
    atlas: 3,
    art: 2,
    text: "進場：敵方所有單位 -1 攻擊。",
    effect: "enemy_units_minus_1_attack",
  },
  {
    id: "terminal_architect",
    name: "航廈建築師",
    type: "unit",
    faction: "corp",
    cost: 4,
    attack: 3,
    health: 5,
    atlas: 3,
    art: 23,
    text: "進場：召喚一個 1/1 守衛。",
    effect: "summon_1_1_guard",
  },
  {
    id: "asset_recall",
    name: "資產追回",
    type: "program",
    faction: "corp",
    cost: 1,
    atlas: 2,
    art: 33,
    text: "抽 1 張牌，移除敵方 1 護盾。",
    effect: "draw_1_break_shield",
  },
  {
    id: "court_injunction",
    name: "法院禁制令",
    type: "program",
    faction: "corp",
    cost: 2,
    target: "enemyUnit",
    atlas: 3,
    art: 1,
    text: "對一個敵方單位造成 1 傷害並凍結。",
    effect: "deal_1_freeze",
  },
  {
    id: "dividend_burst",
    name: "股利爆發",
    type: "program",
    faction: "corp",
    cost: 2,
    atlas: 3,
    art: 13,
    text: "獲得 2 護盾。",
    effect: "gain_shield_2",
  },
  {
    id: "executive_plating",
    name: "主管裝甲層",
    type: "mod",
    faction: "corp",
    cost: 2,
    target: "friendlyUnit",
    atlas: 3,
    art: 28,
    text: "一個友方單位 +0/+3 並獲得守衛。",
    effect: "buff_0_3_guard",
  },
  {
    id: "prestige_protocol",
    name: "威望協議",
    type: "mod",
    faction: "corp",
    cost: 2,
    target: "friendlyUnit",
    atlas: 3,
    art: 9,
    text: "一個友方單位 +1/+2 並獲得守衛。",
    effect: "buff_1_2_guard",
  },
  {
    id: "orbital_estate",
    name: "軌道莊園",
    type: "luxury",
    faction: "corp",
    cost: 4,
    atlas: 2,
    art: 29,
    text: "裝備單位：+0/+2 並獲得守衛。裝備操作者：回合結束獲得 1 護盾。變現：回復 2 生命並獲得 2 護盾。",
    cashText: "回復 2 生命並獲得 2 護盾。",
  },
  {
    id: "corporate_yacht",
    name: "企業遊艇",
    type: "luxury",
    faction: "corp",
    cost: 3,
    atlas: 3,
    art: 29,
    text: "裝備單位：+0/+2 並獲得守衛。裝備操作者：落後生命時回合結束回復 1。變現：召喚一個 2/2 守衛並抽 1 張牌。",
    cashText: "召喚一個 2/2 守衛並抽 1 張牌。",
  },
  {
    id: "skyline_patrol",
    name: "????",
    type: "unit",
    faction: "neutral",
    cost: 1,
    attack: 1,
    health: 2,
    atlas: 4,
    art: 0,
    text: "??????????????? 1 ???",
    effect: "draw_if_luxury",
  },
  {
    id: "neon_food_runner",
    name: "?????",
    type: "unit",
    faction: "neutral",
    cost: 1,
    attack: 2,
    health: 1,
    charge: true,
    atlas: 4,
    art: 1,
    text: "???",
  },
  {
    id: "archive_paramedic",
    name: "?????",
    type: "unit",
    faction: "neutral",
    cost: 2,
    attack: 1,
    health: 3,
    atlas: 4,
    art: 2,
    text: "???????? 2 ???",
    effect: "heal_hero_2",
  },
  {
    id: "chrome_doorman",
    name: "????",
    type: "unit",
    faction: "neutral",
    cost: 2,
    attack: 1,
    health: 4,
    guard: true,
    atlas: 4,
    art: 3,
    text: "???",
  },
  {
    id: "drone_sommelier",
    name: "?????",
    type: "unit",
    faction: "neutral",
    cost: 3,
    attack: 2,
    health: 3,
    atlas: 4,
    art: 4,
    text: "????? 1 ???",
    effect: "gain_shield_1",
  },
  {
    id: "transit_hacker",
    name: "????",
    type: "unit",
    faction: "neutral",
    cost: 3,
    attack: 3,
    health: 2,
    atlas: 4,
    art: 5,
    text: "???? 1 ???",
    effect: "draw_1",
  },
  {
    id: "skybridge_guardian",
    name: "?????",
    type: "unit",
    faction: "neutral",
    cost: 4,
    attack: 3,
    health: 5,
    guard: true,
    atlas: 4,
    art: 6,
    text: "???????? 1 ???",
    effect: "gain_shield_1",
  },
  {
    id: "vending_mech",
    name: "?????",
    type: "unit",
    faction: "neutral",
    cost: 2,
    attack: 2,
    health: 2,
    atlas: 4,
    art: 7,
    text: "??????????? 1 ????",
    effect: "ping_enemy_hero",
  },
  {
    id: "flash_arbitrage",
    name: "????",
    type: "program",
    faction: "neutral",
    cost: 1,
    atlas: 4,
    art: 8,
    text: "????????? -1?",
    effect: "discount_1",
  },
  {
    id: "contract_scan",
    name: "????",
    type: "program",
    faction: "neutral",
    cost: 1,
    atlas: 4,
    art: 9,
    text: "? 1 ???",
    effect: "draw_1",
  },
  {
    id: "pulse_invoice",
    name: "????",
    type: "program",
    faction: "neutral",
    cost: 2,
    target: "enemy",
    atlas: 4,
    art: 10,
    text: "?? 2 ?????? 1 ???",
    effect: "deal_2_gain_shield_1",
  },
  {
    id: "ghost_lane",
    name: "????",
    type: "program",
    faction: "neutral",
    cost: 2,
    target: "enemyUnit",
    atlas: 4,
    art: 11,
    text: "?? 1 ?????????",
    effect: "deal_1_freeze",
  },
  {
    id: "black_tide_market",
    name: "????",
    type: "program",
    faction: "neutral",
    cost: 3,
    atlas: 4,
    art: 12,
    text: "? 2 ???",
    effect: "draw_2",
  },
  {
    id: "reflex_gloves",
    name: "????",
    type: "mod",
    faction: "neutral",
    cost: 1,
    target: "friendlyUnit",
    atlas: 4,
    art: 13,
    text: "??????? +1/+0 ????",
    effect: "buff_1_0_ready",
  },
  {
    id: "carbon_sleeve",
    name: "????",
    type: "mod",
    faction: "neutral",
    cost: 1,
    target: "friendlyUnit",
    atlas: 4,
    art: 14,
    text: "??????? +0/+2 ??????",
    effect: "buff_0_2_guard",
  },
  {
    id: "overclock_lace",
    name: "????",
    type: "mod",
    faction: "neutral",
    cost: 2,
    target: "friendlyUnit",
    atlas: 4,
    art: 15,
    text: "??????? +2/+0 ????",
    effect: "buff_attack_2_ready",
  },
  {
    id: "solar_supercar",
    name: "????",
    type: "luxury",
    faction: "neutral",
    cost: 2,
    atlas: 4,
    art: 16,
    text: "?????+1 ????????????????????????????????? 2 ???",
    cashText: "?? 2 ???",
  },
  {
    id: "chrono_boutique_watch",
    name: "????",
    type: "luxury",
    faction: "neutral",
    cost: 2,
    atlas: 4,
    art: 17,
    text: "?????+0/+1?????????????????????? 1 ??????????????? -2?",
    cashText: "????????? -2?",
  },
  {
    id: "diamond_airliner",
    name: "????",
    type: "luxury",
    faction: "neutral",
    cost: 3,
    atlas: 4,
    art: 18,
    text: "?????+1 ?????????????????????? -1????? 1 ????? 1 ???",
    cashText: "? 1 ????? 1 ???",
  },
  {
    id: "marina_resort",
    name: "?????",
    type: "luxury",
    faction: "neutral",
    cost: 4,
    atlas: 4,
    art: 19,
    text: "?????+0/+2 ?????????????????? 1 ???????? 4 ???",
    cashText: "?? 4 ???",
  },
  {
    id: "riot_courier",
    name: "????",
    type: "unit",
    faction: "merc",
    cost: 1,
    attack: 2,
    health: 1,
    charge: true,
    atlas: 4,
    art: 20,
    text: "???",
  },
  {
    id: "chrome_bouncer",
    name: "????",
    type: "unit",
    faction: "merc",
    cost: 2,
    attack: 2,
    health: 3,
    guard: true,
    atlas: 4,
    art: 21,
    text: "???",
  },
  {
    id: "railgun_valet",
    name: "?????",
    type: "unit",
    faction: "merc",
    cost: 2,
    attack: 3,
    health: 2,
    atlas: 4,
    art: 22,
    text: "????????",
  },
  {
    id: "debt_collector",
    name: "?????",
    type: "unit",
    faction: "merc",
    cost: 3,
    attack: 3,
    health: 3,
    atlas: 4,
    art: 23,
    text: "??????????? 1 ????",
    effect: "ping_enemy_hero",
  },
  {
    id: "armored_vip",
    name: "????",
    type: "unit",
    faction: "merc",
    cost: 3,
    attack: 2,
    health: 5,
    guard: true,
    atlas: 4,
    art: 24,
    text: "???",
  },
  {
    id: "convoy_captain",
    name: "????",
    type: "unit",
    faction: "merc",
    cost: 4,
    attack: 4,
    health: 4,
    atlas: 4,
    art: 25,
    text: "????????????",
    effect: "ready_all_units",
  },
  {
    id: "bounty_tag",
    name: "????",
    type: "program",
    faction: "merc",
    cost: 1,
    target: "enemy",
    atlas: 4,
    art: 26,
    text: "?? 2 ????",
    effect: "deal_2",
  },
  {
    id: "barricade_contract",
    name: "????",
    type: "program",
    faction: "merc",
    cost: 2,
    atlas: 4,
    art: 27,
    text: "???? 1/1 ???",
    effect: "summon_1_1_guard",
  },
  {
    id: "firebrand_offer",
    name: "????",
    type: "program",
    faction: "merc",
    cost: 3,
    target: "enemy",
    atlas: 4,
    art: 28,
    text: "?? 3 ????",
    effect: "deal_3",
  },
  {
    id: "street_takeover",
    name: "????",
    type: "program",
    faction: "merc",
    cost: 3,
    atlas: 4,
    art: 29,
    text: "??????? 1 ????",
    effect: "deal_1_all_enemies",
  },
  {
    id: "shock_baton",
    name: "????",
    type: "mod",
    faction: "merc",
    cost: 1,
    target: "friendlyUnit",
    atlas: 4,
    art: 30,
    text: "??????? +2/+0?",
    effect: "buff_2_0",
  },
  {
    id: "riot_plating",
    name: "????",
    type: "mod",
    faction: "merc",
    cost: 2,
    target: "friendlyUnit",
    atlas: 4,
    art: 31,
    text: "??????? +1/+2 ??????",
    effect: "buff_1_2_guard",
  },
  {
    id: "graviton_motorcycle",
    name: "????",
    type: "luxury",
    faction: "merc",
    cost: 2,
    atlas: 4,
    art: 32,
    text: "?????+1 ????????????????????????????????? 2 ???",
    cashText: "?? 2 ???",
  },
  {
    id: "obsidian_cruiser",
    name: "????",
    type: "luxury",
    faction: "merc",
    cost: 3,
    atlas: 4,
    art: 33,
    text: "?????+0/+2 ??????????????????????? 1???????? 1/2 ???",
    cashText: "???? 1/2 ???",
  },
  {
    id: "packet_sprite",
    name: "????",
    type: "unit",
    faction: "hacker",
    cost: 1,
    attack: 1,
    health: 1,
    atlas: 4,
    art: 34,
    text: "???? 1 ???",
    effect: "draw_1",
  },
  {
    id: "ghost_anchor",
    name: "????",
    type: "unit",
    faction: "hacker",
    cost: 2,
    attack: 1,
    health: 4,
    guard: true,
    atlas: 4,
    art: 35,
    text: "???",
  },
  {
    id: "mirror_scout",
    name: "????",
    type: "unit",
    faction: "hacker",
    cost: 2,
    attack: 2,
    health: 2,
    atlas: 5,
    art: 0,
    text: "??????????????? 1 ???",
    effect: "draw_if_luxury",
  },
  {
    id: "datastream_duelist",
    name: "??????",
    type: "unit",
    faction: "hacker",
    cost: 3,
    attack: 3,
    health: 2,
    charge: true,
    atlas: 5,
    art: 1,
    text: "???",
  },
  {
    id: "proxy_oracle",
    name: "????",
    type: "unit",
    faction: "hacker",
    cost: 3,
    attack: 2,
    health: 4,
    atlas: 5,
    art: 2,
    text: "???? 1 ????? 1 ???",
    effect: "draw_1_gain_shield_1",
  },
  {
    id: "firewall_bard",
    name: "??????",
    type: "unit",
    faction: "hacker",
    cost: 4,
    attack: 3,
    health: 5,
    atlas: 5,
    art: 3,
    text: "????????? -1 ???",
    effect: "enemy_units_minus_1_attack",
  },
  {
    id: "zero_day_ping",
    name: "????",
    type: "program",
    faction: "hacker",
    cost: 1,
    target: "enemy",
    atlas: 5,
    art: 4,
    text: "?? 2 ????",
    effect: "deal_2",
  },
  {
    id: "recursive_map",
    name: "????",
    type: "program",
    faction: "hacker",
    cost: 2,
    atlas: 5,
    art: 5,
    text: "? 2 ???",
    effect: "draw_2",
  },
  {
    id: "black_ice_rain",
    name: "???",
    type: "program",
    faction: "hacker",
    cost: 3,
    atlas: 5,
    art: 6,
    text: "???????? 1 ????",
    effect: "enemy_units_take_1",
  },
  {
    id: "memory_heist",
    name: "????",
    type: "program",
    faction: "hacker",
    cost: 2,
    atlas: 5,
    art: 7,
    text: "? 1 ??????? 1 ???",
    effect: "draw_1_break_shield",
  },
  {
    id: "quantum_mirror_skin",
    name: "????",
    type: "mod",
    faction: "hacker",
    cost: 1,
    target: "friendlyUnit",
    atlas: 5,
    art: 8,
    text: "??????? +1/+1 ????",
    effect: "buff_1_1_ready",
  },
  {
    id: "rootkit_spurs",
    name: "????",
    type: "mod",
    faction: "hacker",
    cost: 2,
    target: "friendlyUnit",
    atlas: 5,
    art: 9,
    text: "??????? +1/+0 ????",
    effect: "buff_1_0_ready",
  },
  {
    id: "quantum_runway_sneakers",
    name: "??????",
    type: "luxury",
    faction: "hacker",
    cost: 2,
    atlas: 5,
    art: 10,
    text: "?????+1 ???????????????? 1 ????? +1 ???????????????",
    cashText: "?????????",
  },
  {
    id: "stealth_data_bag",
    name: "?????",
    type: "luxury",
    faction: "hacker",
    cost: 2,
    atlas: 5,
    art: 11,
    text: "?????+1/+1??????????? +1????? 2 ???",
    cashText: "? 2 ???",
  },
  {
    id: "lobby_warden",
    name: "????",
    type: "unit",
    faction: "corp",
    cost: 1,
    attack: 1,
    health: 3,
    guard: true,
    atlas: 5,
    art: 12,
    text: "???",
  },
  {
    id: "dividend_sentinel",
    name: "????",
    type: "unit",
    faction: "corp",
    cost: 2,
    attack: 2,
    health: 2,
    atlas: 5,
    art: 13,
    text: "????? 1 ???",
    effect: "gain_shield_1",
  },
  {
    id: "boardroom_mediator",
    name: "??????",
    type: "unit",
    faction: "corp",
    cost: 3,
    attack: 2,
    health: 5,
    guard: true,
    atlas: 5,
    art: 14,
    text: "??????????? 2 ???",
    effect: "heal_hero_2",
  },
  {
    id: "merger_titan",
    name: "????",
    type: "unit",
    faction: "corp",
    cost: 5,
    attack: 5,
    health: 5,
    atlas: 5,
    art: 15,
    text: "????? 2 ???",
    effect: "gain_shield_2",
  },
  {
    id: "audit_wave",
    name: "????",
    type: "program",
    faction: "corp",
    cost: 2,
    target: "enemyUnit",
    atlas: 5,
    art: 16,
    text: "?? 1 ?????????",
    effect: "deal_1_freeze",
  },
  {
    id: "golden_parachute",
    name: "?????",
    type: "program",
    faction: "corp",
    cost: 3,
    atlas: 5,
    art: 17,
    text: "?? 3 ???",
    effect: "heal_3",
  },
  {
    id: "monopoly_clause",
    name: "????",
    type: "program",
    faction: "corp",
    cost: 3,
    atlas: 5,
    art: 18,
    text: "?????? -1 ???",
    effect: "enemy_units_minus_1_attack",
  },
  {
    id: "executive_exosuit",
    name: "?????",
    type: "mod",
    faction: "corp",
    cost: 2,
    target: "friendlyUnit",
    atlas: 5,
    art: 19,
    text: "??????? +0/+3 ??????",
    effect: "buff_0_3_guard",
  },
  {
    id: "orbital_limo",
    name: "????",
    type: "luxury",
    faction: "corp",
    cost: 3,
    atlas: 5,
    art: 20,
    text: "?????+1/+1????????????????? -1?????? 3 ???",
    cashText: "?? 3 ???",
  },
  {
    id: "sapphire_skytower",
    name: "?????",
    type: "luxury",
    faction: "corp",
    cost: 4,
    atlas: 5,
    art: 21,
    text: "?????+0/+2 ?????????????????? 1 ???????? 4 ???",
    cashText: "?? 4 ???",
  },
  {
    id: "executive_airliner",
    name: "????",
    type: "luxury",
    faction: "corp",
    cost: 3,
    atlas: 5,
    art: 22,
    text: "?????+1 ?????????????????????? -1????? 1 ????? 1 ???",
    cashText: "? 1 ????? 1 ???",
  },
  {
    id: "legacy_watch",
    name: "????",
    type: "luxury",
    faction: "corp",
    cost: 2,
    atlas: 5,
    art: 23,
    text: "?????+0/+1?????????????????????? 1 ??????????????? -2?",
    cashText: "????????? -2?",
  },
);

CARDS.push(
  {
    id: "chrome_rush_gauntlet",
    name: "碳鉻震動刀",
    type: "luxury",
    faction: "neutral",
    cost: 2,
    atlas: 5,
    art: 24,
    text: "武器。打出後自動裝備操作者。2 攻擊／3 耐久。",
    cashText: "本回合獲得 2 能量。",
  },
  {
    id: "aegis_guard_gauntlet",
    name: "神盾磁軌手槍",
    type: "luxury",
    faction: "corp",
    cost: 3,
    atlas: 5,
    art: 25,
    text: "武器。打出後自動裝備操作者。2 攻擊／3 耐久。",
    cashText: "獲得 3 護盾。",
  },
  {
    id: "cipher_pulse_gauntlet",
    name: "密碼脈衝步槍",
    type: "luxury",
    faction: "hacker",
    cost: 2,
    atlas: 5,
    art: 26,
    text: "武器。打出後自動裝備操作者。2 攻擊／3 耐久。",
    cashText: "抽 1 張牌，下一張牌費用 -1。",
  },
  {
    id: "meteor_fist_gauntlet",
    name: "隕火重機槍",
    type: "luxury",
    faction: "merc",
    cost: 3,
    atlas: 5,
    art: 27,
    text: "武器。打出後自動裝備操作者。3 攻擊／2 耐久。",
    cashText: "對敵方操作者造成 2 點傷害。",
  },
  {
    id: "ghost_key_gauntlet",
    name: "幽鑰狙擊槍",
    type: "luxury",
    faction: "hacker",
    cost: 2,
    atlas: 5,
    art: 28,
    text: "武器。打出後自動裝備操作者。3 攻擊／1 耐久。",
    cashText: "抽 2 張牌。",
  },
  {
    id: "sovereign_gauntlet",
    name: "主權晶盾拳套",
    type: "luxury",
    faction: "corp",
    cost: 3,
    atlas: 5,
    art: 29,
    text: "武器。打出後自動裝備操作者。2 攻擊／2 耐久。",
    cashText: "獲得 4 點護盾。",
  },
);

const NEW_CARD_TEXT_FIXES = {
  cyber_car: {
    type: "unit",
    attack: 3,
    health: 2,
    charge: true,
    text: "載具。快攻。高速但較脆弱的前線單位。",
  },
  aurora_hypercar: {
    type: "unit",
    attack: 2,
    health: 3,
    charge: true,
    text: "載具。快攻。進場時獲得 1 護盾。",
    effect: "gain_shield_1",
  },
  armored_limo: {
    type: "unit",
    attack: 2,
    health: 5,
    guard: true,
    text: "載具。守衛。進場時獲得 1 護盾。",
    effect: "gain_shield_1",
  },
  sky_estate: {
    type: "unit",
    attack: 1,
    health: 6,
    guard: true,
    text: "設施。守衛。進場時獲得 2 護盾。",
    effect: "gain_shield_2",
  },
  sky_penthouse: {
    type: "unit",
    attack: 2,
    health: 6,
    guard: true,
    text: "設施。守衛。進場時恢復操作者 2 生命。",
    effect: "heal_hero_2",
  },
  skyline_patrol: { name: "天幕巡警", text: "進場：若你有已裝備的奢侈品，抽 1 張牌。" },
  neon_food_runner: { name: "夜市快送員", text: "快攻。" },
  archive_paramedic: { name: "檔案醫護員", text: "進場：回復操作者 2 生命。" },
  chrome_doorman: { name: "鉻門守衛", text: "守衛。" },
  drone_sommelier: { name: "無人侍酒師", text: "進場：獲得 1 護盾。" },
  transit_hacker: { name: "捷運駭客", text: "進場：抽 1 張牌。" },
  skybridge_guardian: { name: "空橋守護者", text: "守衛。進場：獲得 1 護盾。" },
  vending_mech: { name: "販售機機兵", text: "進場：對敵方操作者造成 1 點傷害。" },
  flash_arbitrage: { name: "閃價套利", text: "本回合下一張牌費用 -1。" },
  contract_scan: { name: "合約掃描", text: "抽 1 張牌。" },
  pulse_invoice: { name: "脈衝發票", text: "造成 2 點傷害並獲得 1 護盾。" },
  ghost_lane: { name: "幽巷封鎖", text: "造成 1 點傷害並凍結目標。" },
  black_tide_market: { name: "黑潮市場", text: "抽 2 張牌。" },
  reflex_gloves: { name: "反射手套", text: "使一個友方單位 +1/+0 並準備。" },
  carbon_sleeve: { name: "碳纖護套", text: "使一個友方單位 +0/+2 並獲得守衛。" },
  overclock_lace: { name: "超頻鞋帶", text: "使一個友方單位 +2/+0 並準備。" },
  solar_supercar: {
    name: "日冕超跑",
    type: "unit",
    attack: 3,
    health: 2,
    charge: true,
    text: "載具。快攻。以太陽動力發動突擊。",
  },
  chrono_boutique_watch: {
    name: "時序名錶",
    text: "裝備單位：+0/+1。裝備操作者：回合開始時，若手牌少於敵方，抽 1 張牌。變現：本回合下一張牌費用 -2。",
    cashText: "本回合下一張牌費用 -2。",
  },
  diamond_airliner: {
    name: "鑽石客機",
    text: "裝備單位：+1 攻擊並準備。裝備操作者：每回合第一張程式費用 -1。變現：抽 1 張牌並獲得 1 能量。",
    cashText: "抽 1 張牌並獲得 1 能量。",
  },
  marina_resort: {
    name: "海港度假村",
    text: "裝備單位：+0/+2 並獲得守衛。裝備操作者：回合結束獲得 1 護盾。變現：回復 4 生命。",
    cashText: "回復 4 生命。",
  },
  riot_courier: { name: "暴動信差", text: "快攻。" },
  chrome_bouncer: { name: "鉻拳保鑣", text: "守衛。" },
  railgun_valet: { name: "磁軌泊車手", text: "高速的街頭單位。" },
  debt_collector: { name: "債務收割者", text: "進場：對敵方操作者造成 1 點傷害。" },
  armored_vip: { name: "裝甲貴賓", text: "守衛。" },
  convoy_captain: { name: "車隊隊長", text: "進場：準備你的所有單位。" },
  bounty_tag: { name: "賞金標記", text: "造成 2 點傷害。" },
  barricade_contract: { name: "路障合約", text: "召喚一個 1/1 守衛。" },
  firebrand_offer: { name: "火線報價", text: "造成 3 點傷害。" },
  street_takeover: { name: "街區接管", text: "對所有敵人造成 1 點傷害。" },
  shock_baton: { name: "電擊短棍", text: "使一個友方單位 +2/+0。" },
  riot_plating: { name: "鎮暴鍍層", text: "使一個友方單位 +1/+2 並獲得守衛。" },
  graviton_motorcycle: {
    name: "重力機車",
    type: "unit",
    attack: 3,
    health: 1,
    charge: true,
    text: "載具。快攻。低生命的高速突擊單位。",
  },
  obsidian_cruiser: {
    name: "黑曜郵輪",
    text: "裝備單位：+0/+2 並獲得守衛。裝備操作者：落後生命時回合結束回復 1。變現：召喚兩個 1/2 守衛。",
    cashText: "召喚兩個 1/2 守衛。",
  },
  packet_sprite: { name: "封包精靈", text: "進場：抽 1 張牌。" },
  ghost_anchor: { name: "幽網錨手", text: "守衛。" },
  mirror_scout: { name: "鏡面斥候", text: "進場：若你有已裝備的奢侈品，抽 1 張牌。" },
  datastream_duelist: { name: "資料流決鬥者", text: "快攻。" },
  proxy_oracle: { name: "代理先知", text: "進場：抽 1 張牌並獲得 1 護盾。" },
  firewall_bard: { name: "防火牆吟遊者", text: "進場：敵方所有單位 -1 攻擊。" },
  zero_day_ping: { name: "零日脈衝", text: "造成 2 點傷害。" },
  recursive_map: { name: "遞迴地圖", text: "抽 2 張牌。" },
  black_ice_rain: { name: "黑冰雨", text: "敵方所有單位受到 1 點傷害。" },
  memory_heist: { name: "記憶竊案", text: "抽 1 張牌，移除敵方 1 護盾。" },
  quantum_mirror_skin: { name: "量子鏡皮", text: "使一個友方單位 +1/+1 並準備。" },
  rootkit_spurs: { name: "根權馬刺", text: "使一個友方單位 +1/+0 並準備。" },
  quantum_runway_sneakers: {
    name: "量子伸展球鞋",
    text: "裝備單位：+1 攻擊並準備。裝備操作者：你打出的 1 費以下單位 +1 攻擊。變現：準備你的所有單位。",
    cashText: "準備你的所有單位。",
  },
  stealth_data_bag: {
    name: "匿蹤資料包",
    text: "裝備單位：+1/+1。裝備操作者：手牌上限 +1。變現：抽 2 張牌。",
    cashText: "抽 2 張牌。",
  },
  lobby_warden: { name: "大廳監督", text: "守衛。" },
  dividend_sentinel: { name: "股利哨兵", text: "進場：獲得 1 護盾。" },
  boardroom_mediator: { name: "董事會調停者", text: "守衛。進場：回復操作者 2 生命。" },
  merger_titan: { name: "併購巨像", text: "進場：獲得 2 護盾。" },
  audit_wave: { name: "審計波束", text: "造成 1 點傷害並凍結目標。" },
  golden_parachute: { name: "黃金降落傘", text: "回復 3 生命。" },
  monopoly_clause: { name: "壟斷條款", text: "敵方所有單位 -1 攻擊。" },
  executive_exosuit: { name: "高管外骨骼", text: "使一個友方單位 +0/+3 並獲得守衛。" },
  orbital_limo: {
    name: "軌道禮車",
    type: "unit",
    attack: 3,
    health: 5,
    guard: true,
    text: "載具。守衛。企業級軌道護送車。",
  },
  sapphire_skytower: {
    name: "藍寶石天塔",
    text: "裝備單位：+0/+2 並獲得守衛。裝備操作者：回合結束獲得 1 護盾。變現：回復 4 生命。",
    cashText: "回復 4 生命。",
  },
  executive_airliner: {
    name: "董事專機",
    text: "裝備單位：+1 攻擊並準備。裝備操作者：每回合第一張程式費用 -1。變現：抽 1 張牌並獲得 1 能量。",
    cashText: "抽 1 張牌並獲得 1 能量。",
  },
  legacy_watch: {
    name: "傳承名錶",
    text: "裝備單位：+0/+1。裝備操作者：回合開始時，若手牌少於敵方，抽 1 張牌。變現：本回合下一張牌費用 -2。",
    cashText: "本回合下一張牌費用 -2。",
  },
};

CARDS.forEach((card) => {
  const fix = NEW_CARD_TEXT_FIXES[card.id];
  if (fix) Object.assign(card, fix);
});

const WEAPON_CARD_IDS = new Set([
  "chrome_rush_gauntlet",
  "aegis_guard_gauntlet",
  "cipher_pulse_gauntlet",
  "meteor_fist_gauntlet",
  "ghost_key_gauntlet",
  "sovereign_gauntlet",
]);

const LUXURY_MODE_PLANS = {
  limited_watch: { primary: "equipUnit", primaryLabel: "裝備單位" },
  sapphire_watch: { primary: "equipHero", primaryLabel: "裝備操作者" },
  crypto_timepiece: { primary: "equipHero", primaryLabel: "裝備操作者" },
  chrono_boutique_watch: { primary: "equipUnit", primaryLabel: "裝備單位" },
  legacy_watch: { primary: "equipHero", primaryLabel: "裝備操作者" },
  black_card_bag: { primary: "equipHero", primaryLabel: "裝備操作者" },
  obsidian_bag: { primary: "equipUnit", primaryLabel: "裝備單位" },
  stealth_data_bag: { primary: "equipUnit", primaryLabel: "裝備單位" },
  limited_sneakers: { primary: "equipUnit", primaryLabel: "裝備單位" },
  phantom_sneakers: { primary: "equipUnit", primaryLabel: "裝備單位" },
  quantum_runway_sneakers: { primary: "equipUnit", primaryLabel: "裝備單位" },
  designer_jacket: { primary: "equipUnit", primaryLabel: "裝備單位" },
  private_jet: { primary: "unit", primaryLabel: "部署單位" },
  private_airship: { primary: "unit", primaryLabel: "部署單位" },
  diamond_airliner: { primary: "unit", primaryLabel: "部署單位" },
  executive_airliner: { primary: "unit", primaryLabel: "部署單位" },
  luxury_cruise: { primary: "unit", primaryLabel: "部署單位" },
  oceanic_cruise: { primary: "unit", primaryLabel: "部署單位" },
  obsidian_cruiser: { primary: "unit", primaryLabel: "部署單位" },
  corporate_yacht: { primary: "unit", primaryLabel: "部署單位" },
  orbital_estate: { primary: "unit", primaryLabel: "建造設施" },
  marina_resort: { primary: "unit", primaryLabel: "建造設施" },
  sapphire_skytower: { primary: "unit", primaryLabel: "建造設施" },
  holo_art_vault: { primary: "unit", primaryLabel: "建造設施" },
};

CARDS.forEach((card) => {
  if (card.type === "luxury" && !WEAPON_CARD_IDS.has(card.id)) {
    const plan = LUXURY_MODE_PLANS[card.id];
    card.text = `升值：留在手牌每回合 +1，最高 +2。打出時選擇${plan?.primaryLabel || "主要用途"}或啟動程式。`;
  }
});

const DEFAULT_RULES = {
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
const ACTIVE_MODS = loadStoredMods();
const ACTIVE_RULES = ACTIVE_MODS.rules;
const STORY_ACTIVE_KEY = "cyberStoryBattle";
const STORY_PROGRESS_KEY = "cyberStoryProgress";

addStoredCustomCards(ACTIVE_MODS.customCards);
const ORIGINAL_CARDS = CARDS.map((card) => ({ ...card }));
applyStoredCardMods(ACTIVE_MODS.cards);

const CARD_BY_ID = Object.fromEntries(CARDS.map((card) => [card.id, card]));
const DECK_SIZE = ACTIVE_RULES.deckSize;
const MAX_BOARD = ACTIVE_RULES.maxBoard;
const MAX_OPERATOR_LUXURIES = ACTIVE_RULES.maxOperatorLuxuries;
const MAX_DECK_LUXURIES = ACTIVE_RULES.maxDeckLuxuries;
const BASE_HAND_LIMIT = ACTIVE_RULES.baseHandLimit;
const STARTING_LIFE = ACTIVE_RULES.startingLife;
const MAX_ENERGY = ACTIVE_RULES.maxEnergy;
const OPENING_HAND = ACTIVE_RULES.openingHand;
const DRAW_PER_TURN = ACTIVE_RULES.drawPerTurn;
const ART_ATLASES = {
  1: { columns: 6, rows: 6, ratio: "1 / 1", zoom: 1, image: "url(assets/card-art-atlas.webp)" },
  2: { columns: 6, rows: 6, ratio: "1 / 1", zoom: 1, image: "url(assets/card-art-atlas-2.webp)" },
  3: { columns: 6, rows: 6, ratio: "1 / 1", zoom: 1, image: "url(assets/card-art-atlas-3.webp)" },
  4: { columns: 6, rows: 6, ratio: "1 / 1", zoom: 1, image: "url(assets/card-art-atlas-4.webp)" },
  5: { columns: 6, rows: 6, ratio: "1 / 1", zoom: 1, image: "url(assets/card-art-atlas-5.webp?v=weapons-20260714)" },
};
const OPERATOR_WEAPONS = {
  chrome_rush_gauntlet: { type: "刀", attack: 2, durability: 3 },
  aegis_guard_gauntlet: { type: "手槍", attack: 2, durability: 3 },
  cipher_pulse_gauntlet: { type: "步槍", attack: 2, durability: 3 },
  meteor_fist_gauntlet: { type: "機槍", attack: 3, durability: 2 },
  ghost_key_gauntlet: { type: "狙擊槍", attack: 3, durability: 1 },
  sovereign_gauntlet: { type: "拳套", attack: 2, durability: 2 },
};

let selectedOperator = "merc";
let selectedOpponent = "random";
let activeFilter = "all";
let deckCounts = {};
let unitSeq = 1;
let luxurySeq = 1;
let game = null;
let activeStoryBattle = null;

const elements = {};

document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector("#cardLibrary")) return;
  cacheElements();
  bindStaticEvents();
  activeStoryBattle = loadActiveStoryBattle();
  loadDeck();
  renderBuilder();
  showView("builder");
});

if (typeof window !== "undefined") {
  window.CYBER_CARD_DATA = {
    cards: CARDS,
    originalCards: ORIGINAL_CARDS,
    cardTypes: CARD_TYPES,
    factions: FACTIONS,
    operators: OPERATORS,
    defaultRules: DEFAULT_RULES,
    activeRules: ACTIVE_RULES,
  };
}

function cacheElements() {
  elements.landingView = document.querySelector("#landingView");
  elements.enterGameBtn = document.querySelector("#enterGameBtn");
  elements.builderNotice = document.querySelector("#builderNotice");
  elements.opponentSelect = document.querySelector("#opponentSelect");
  elements.operatorList = document.querySelector("#operatorList");
  elements.operatorDetail = document.querySelector("#operatorDetail");
  elements.cardLibrary = document.querySelector("#cardLibrary");
  elements.deckList = document.querySelector("#deckList");
  elements.deckCount = document.querySelector("#deckCount");
  elements.luxuryCount = document.querySelector("#luxuryCount");
  elements.deckTypeMix = document.querySelector("#deckTypeMix");
  elements.deckMeterFill = document.querySelector("#deckMeterFill");
  elements.startGameBtn = document.querySelector("#startGameBtn");
  elements.quickBuildBtn = document.querySelector("#quickBuildBtn");
  elements.clearDeckBtn = document.querySelector("#clearDeckBtn");
  elements.builderView = document.querySelector("#builderView");
  elements.gameView = document.querySelector("#gameView");
  elements.playerHero = document.querySelector("#playerHero");
  elements.aiHero = document.querySelector("#aiHero");
  elements.playerBoard = document.querySelector("#playerBoard");
  elements.aiBoard = document.querySelector("#aiBoard");
  elements.playerLuxuries = document.querySelector("#playerLuxuries");
  elements.aiLuxuries = document.querySelector("#aiLuxuries");
  elements.playerHand = document.querySelector("#playerHand");
  elements.aiHandCount = document.querySelector("#aiHandCount");
  elements.turnStatus = document.querySelector("#turnStatus");
  elements.heroSkillBtn = document.querySelector("#heroSkillBtn");
  elements.endTurnBtn = document.querySelector("#endTurnBtn");
  elements.actionPanel = document.querySelector("#actionPanel");
  elements.gameLog = document.querySelector("#gameLog");
  elements.playerDiscardCount = document.querySelector("#playerDiscardCount");
  elements.aiDiscardCount = document.querySelector("#aiDiscardCount");
  elements.playerDiscardList = document.querySelector("#playerDiscardList");
  elements.aiDiscardList = document.querySelector("#aiDiscardList");
  elements.playReveal = document.querySelector("#playReveal");
  elements.storyBattleBanner = document.querySelector("#storyBattleBanner");
  elements.storyResult = document.querySelector("#storyResult");
}

function bindStaticEvents() {
  elements.enterGameBtn?.addEventListener("click", enterSite);
  elements.landingView?.addEventListener("click", enterSite);
  elements.landingView?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") enterSite();
  });

  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.view === "game") {
        handleBattleNavigation();
        return;
      }
      showView(button.dataset.view);
    });
  });

  elements.opponentSelect?.addEventListener("change", () => {
    selectedOpponent = elements.opponentSelect.value;
    saveDeck();
  });

  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderLibrary();
    });
  });

  elements.quickBuildBtn.addEventListener("click", quickBuildDeck);
  elements.clearDeckBtn.addEventListener("click", () => {
    deckCounts = {};
    saveDeck();
    renderBuilder();
  });
  elements.startGameBtn.addEventListener("click", startGame);
  elements.endTurnBtn.addEventListener("click", endPlayerTurn);
  elements.heroSkillBtn.addEventListener("click", useHeroSkill);
}

function enterSite() {
  document.body.classList.remove("landing-active");
  if (elements.landingView) elements.landingView.hidden = true;
  document.querySelector('.tab-button[data-view="builder"]')?.focus();
}

function handleBattleNavigation() {
  if (getDeckTotal() === DECK_SIZE) {
    if (game && !game.gameOver) {
      showView("game");
      return;
    }
    startGame();
    return;
  }
  showView("builder");
  showBuilderNotice(`牌組尚未完成：目前 ${getDeckTotal()} / ${DECK_SIZE} 張。補滿後再點「對戰」即可直接開戰。`);
}

function showBuilderNotice(message) {
  if (!elements.builderNotice) return;
  elements.builderNotice.textContent = message;
  elements.builderNotice.hidden = false;
  elements.builderNotice.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function showView(view) {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  elements.builderView.classList.toggle("active", view === "builder");
  elements.gameView.classList.toggle("active", view === "game");
}

function loadStoredMods() {
  const mods = {
    rules: { ...DEFAULT_RULES },
    cards: {},
    customCards: [],
  };
  if (typeof localStorage === "undefined") return mods;

  try {
    const saved = JSON.parse(localStorage.getItem("cyberCardGameMods") || "{}");
    if (saved.rules && typeof saved.rules === "object") {
      mods.rules.deckSize = clampInt(saved.rules.deckSize, 8, 30, DEFAULT_RULES.deckSize);
      mods.rules.maxBoard = clampInt(saved.rules.maxBoard, 2, 8, DEFAULT_RULES.maxBoard);
      mods.rules.maxOperatorLuxuries = clampInt(saved.rules.maxOperatorLuxuries, 0, 4, DEFAULT_RULES.maxOperatorLuxuries);
      mods.rules.maxDeckLuxuries = clampInt(saved.rules.maxDeckLuxuries, 0, 10, DEFAULT_RULES.maxDeckLuxuries);
      mods.rules.baseHandLimit = clampInt(saved.rules.baseHandLimit, 3, 12, DEFAULT_RULES.baseHandLimit);
      mods.rules.startingLife = clampInt(saved.rules.startingLife, 8, 40, DEFAULT_RULES.startingLife);
      mods.rules.maxEnergy = clampInt(saved.rules.maxEnergy, 3, 12, DEFAULT_RULES.maxEnergy);
      mods.rules.openingHand = clampInt(saved.rules.openingHand, 1, 8, DEFAULT_RULES.openingHand);
      mods.rules.drawPerTurn = clampInt(saved.rules.drawPerTurn, 1, 4, DEFAULT_RULES.drawPerTurn);
    }
    if (saved.cards && typeof saved.cards === "object") {
      mods.cards = saved.cards;
    }
    if (Array.isArray(saved.customCards)) {
      mods.customCards = sanitizeStoredCustomCards(saved.customCards);
    }
  } catch {
    return mods;
  }

  mods.rules.maxDeckLuxuries = Math.min(mods.rules.maxDeckLuxuries, mods.rules.deckSize);
  return mods;
}

function addStoredCustomCards(customCards) {
  const usedIds = new Set(CARDS.map((card) => card.id));
  sanitizeStoredCustomCards(customCards).forEach((card) => {
    if (usedIds.has(card.id)) return;
    usedIds.add(card.id);
    CARDS.push(card);
  });
}

function sanitizeStoredCustomCards(customCards) {
  if (!Array.isArray(customCards)) return [];
  const usedIds = new Set(CARDS.map((card) => card.id));
  const normalized = [];
  customCards.forEach((raw, index) => {
    const card = normalizeCustomCard(raw, index);
    if (!card || usedIds.has(card.id)) return;
    usedIds.add(card.id);
    normalized.push(card);
  });
  return normalized;
}

function normalizeCustomCard(raw, index) {
  if (!raw || typeof raw !== "object") return null;
  const id = normalizeCustomCardId(raw.id || `custom_card_${index + 1}`);
  const type = CARD_TYPES[raw.type] ? raw.type : "unit";
  const faction = FACTIONS[raw.faction] ? raw.faction : "neutral";
  const effect = CUSTOM_CARD_EFFECTS.has(raw.effect) ? raw.effect : "";
  const target = CUSTOM_CARD_TARGETS.has(raw.target) ? raw.target : "";
  const card = {
    id,
    name: sanitizeShortText(raw.name, "自製卡", 24),
    type,
    faction,
    cost: clampInt(raw.cost, 0, 12, 1),
    text: sanitizeShortText(raw.text, "自製卡牌。", 180),
    custom: true,
  };

  const customArt = sanitizeCustomImage(raw.customArt);
  if (customArt) card.customArt = customArt;
  if (effect) card.effect = effect;
  if (target && type !== "luxury") card.target = target;

  if (type === "unit") {
    card.attack = clampInt(raw.attack, 0, 12, 1);
    card.health = clampInt(raw.health, 1, 20, 1);
    if (raw.guard === true) card.guard = true;
    if (raw.charge === true) card.charge = true;
  }

  if (type === "luxury") {
    card.cashText = sanitizeShortText(raw.cashText, "抽 1 張牌。", 80);
  }

  return card;
}

function normalizeCustomCardId(value) {
  const cleaned = String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
  if (!cleaned) return `custom_${Date.now().toString(36)}`;
  return cleaned.startsWith("custom_") ? cleaned : `custom_${cleaned}`;
}

function sanitizeShortText(value, fallback, maxLength) {
  const text = typeof value === "string" ? value.trim() : "";
  return (text || fallback).slice(0, maxLength);
}

function sanitizeCustomImage(value) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (trimmed.length > 450000) return "";
  return CUSTOM_IMAGE_PATTERN.test(trimmed) ? trimmed : "";
}

function applyStoredCardMods(cardMods) {
  if (!cardMods || typeof cardMods !== "object") return;
  CARDS.forEach((card) => {
    const mod = cardMods[card.id];
    if (!mod || typeof mod !== "object") return;
    card.cost = clampInt(mod.cost, 0, 12, card.cost);
    if (card.type === "unit") {
      card.attack = clampInt(mod.attack, 0, 12, card.attack);
      card.health = clampInt(mod.health, 1, 20, card.health);
    }
    if (typeof mod.text === "string" && mod.text.trim()) {
      card.text = mod.text.trim().slice(0, 180);
    }
    const customArt = sanitizeCustomImage(mod.customArt);
    if (customArt) card.customArt = customArt;
  });
}

function loadActiveStoryBattle() {
  if (typeof localStorage === "undefined") return null;
  try {
    const battle = JSON.parse(localStorage.getItem(STORY_ACTIVE_KEY) || "null");
    if (!battle || !battle.id || !Array.isArray(battle.enemyDeck)) return null;
    return battle;
  } catch {
    return null;
  }
}

function clearActiveStoryBattle() {
  activeStoryBattle = null;
  if (typeof localStorage !== "undefined") localStorage.removeItem(STORY_ACTIVE_KEY);
}

function clampInt(value, min, max, fallback) {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

function loadDeck() {
  try {
    const raw = localStorage.getItem("cyberCardDeck") || "{}";
    const saved = JSON.parse(raw);
    if (saved.operator && OPERATORS[saved.operator]) selectedOperator = saved.operator;
    if (saved.opponent === "random" || OPERATORS[saved.opponent]) selectedOpponent = saved.opponent;
    if (saved.counts && typeof saved.counts === "object") deckCounts = saved.counts;
  } catch {
    deckCounts = {};
  }
  removeInvalidDeckCards();
}

function saveDeck() {
  localStorage.setItem(
    "cyberCardDeck",
    JSON.stringify({
      operator: selectedOperator,
      opponent: selectedOpponent,
      counts: deckCounts,
    }),
  );
}

function renderBuilder() {
  if (elements.opponentSelect) elements.opponentSelect.value = selectedOpponent;
  renderStoryBattleBanner();
  renderOperators();
  renderLibrary();
  renderDeckList();
}

function renderStoryBattleBanner() {
  if (!elements.storyBattleBanner) return;
  if (!activeStoryBattle) {
    elements.storyBattleBanner.hidden = true;
    elements.storyBattleBanner.innerHTML = "";
    return;
  }

  elements.storyBattleBanner.hidden = false;
  elements.storyBattleBanner.innerHTML = `
    <div>
      <span class="story-status">劇情戰鬥</span>
      <h2>${activeStoryBattle.chapterTitle}／${activeStoryBattle.battleTitle}</h2>
      <p>${activeStoryBattle.intro}</p>
      <strong>${activeStoryBattle.hint}</strong>
    </div>
    <div class="story-banner-actions">
      <span>${activeStoryBattle.ruleText}</span>
      <a class="ghost-button" href="story.html">回劇情地圖</a>
    </div>
  `;
}

function renderOperators() {
  elements.operatorList.innerHTML = Object.values(OPERATORS)
    .map(
      (operator) => `
        <button class="operator-button ${operator.id === selectedOperator ? "active" : ""}" data-operator="${operator.id}">
          <strong>${operator.name}</strong>
          <span>${operator.style}</span>
        </button>
      `,
    )
    .join("");

  elements.operatorList.querySelectorAll(".operator-button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedOperator = button.dataset.operator;
      removeInvalidDeckCards();
      saveDeck();
      renderBuilder();
    });
  });

  const operator = OPERATORS[selectedOperator];
  elements.operatorDetail.innerHTML = `
    <strong>${operator.skillName}</strong>
    <span>${operator.skillCost} 能量：${operator.skillText}</span>
    <strong>${operator.passiveName}</strong>
    <span>${operator.passiveText}</span>
  `;
}

function renderLibrary() {
  const cards = CARDS.filter((card) => {
    const factionAllowed = card.faction === "neutral" || card.faction === selectedOperator;
    const typeAllowed = activeFilter === "all" || card.type === activeFilter;
    return factionAllowed && typeAllowed;
  });

  elements.cardLibrary.innerHTML = cards.map((card) => renderCatalogCard(card)).join("");
  elements.cardLibrary.querySelectorAll("[data-add-card]").forEach((button) => {
    button.addEventListener("click", () => addCardToDeck(button.dataset.addCard));
  });
  elements.cardLibrary.querySelectorAll("[data-remove-card]").forEach((button) => {
    button.addEventListener("click", () => removeCardFromDeck(button.dataset.removeCard));
  });
}

function renderCatalogCard(card) {
  const count = deckCounts[card.id] || 0;
  const total = getDeckTotal();
  const luxuryTotal = getDeckLuxuryTotal();
  const maxCopies = getMaxCopies(card);
  const canAdd =
    total < DECK_SIZE &&
    count < maxCopies &&
    (card.type !== "luxury" || luxuryTotal < MAX_DECK_LUXURIES);

  return `
    <article class="catalog-card" data-type="${card.type}">
      <div class="card-topline">
        <span class="cost-badge">${card.cost}</span>
        <span class="type-chip">${CARD_TYPES[card.type]} · ${FACTIONS[card.faction]}</span>
      </div>
      <h3>${card.name}</h3>
      <div class="card-art" style="${getArtStyle(card)}" aria-hidden="true"></div>
      <p class="card-text">${card.text}</p>
      <div class="card-footer">
        ${renderCardStats(card)}
        <div class="count-controls">
          <button class="card-action" data-remove-card="${card.id}" ${count === 0 ? "disabled" : ""}>−</button>
          <span class="count-number">${count}</span>
          <button class="card-action" data-add-card="${card.id}" ${canAdd ? "" : "disabled"}>＋</button>
        </div>
      </div>
    </article>
  `;
}

function renderCardStats(card) {
  if (card.type !== "unit") {
    return `<span class="type-chip">${card.type === "luxury" ? (OPERATOR_WEAPONS[card.id] ? "武器" : "升值二選一") : "即時效果"}</span>`;
  }
  return `
    <div class="stats">
      <span class="stat-badge">${card.attack}</span>
      <span class="stat-badge danger">${card.health}</span>
    </div>
  `;
}

function renderDeckList() {
  const entries = Object.entries(deckCounts)
    .filter(([, count]) => count > 0)
    .sort(([a], [b]) => CARD_BY_ID[a].cost - CARD_BY_ID[b].cost || CARD_BY_ID[a].name.localeCompare(CARD_BY_ID[b].name));

  elements.deckList.innerHTML =
    entries.length === 0
      ? `<div class="empty-message">尚未加入卡牌</div>`
      : entries
          .map(([id, count]) => {
            const card = CARD_BY_ID[id];
            return `
              <div class="deck-entry" data-type="${card.type}">
                <span class="cost-badge">${card.cost}</span>
                <div>
                  <div class="deck-entry-name">${card.name}</div>
                  <div class="deck-entry-type">${CARD_TYPES[card.type]}</div>
                </div>
                <strong>x${count}</strong>
              </div>
            `;
          })
          .join("");

  const total = getDeckTotal();
  const luxuryTotal = getDeckLuxuryTotal();
  const typeCounts = Object.entries(deckCounts).reduce(
    (counts, [id, count]) => {
      const type = CARD_BY_ID[id]?.type;
      if (type) counts[type] += count;
      return counts;
    },
    { unit: 0, program: 0, mod: 0, luxury: 0 },
  );
  elements.deckCount.textContent = `${total} / ${DECK_SIZE}`;
  elements.luxuryCount.textContent = `奢侈品 ${luxuryTotal} / ${MAX_DECK_LUXURIES}`;
  elements.deckTypeMix.innerHTML = Object.entries(typeCounts)
    .map(([type, count]) => `<span data-type="${type}"><strong>${count}</strong>${CARD_TYPES[type]}</span>`)
    .join("");
  elements.deckMeterFill.style.width = `${Math.min(100, (total / DECK_SIZE) * 100)}%`;
  elements.startGameBtn.disabled = total !== DECK_SIZE;
}

function addCardToDeck(cardId) {
  const card = CARD_BY_ID[cardId];
  if (!card) return;
  const count = deckCounts[cardId] || 0;
  if (getDeckTotal() >= DECK_SIZE) return;
  if (count >= getMaxCopies(card)) return;
  if (card.type === "luxury" && getDeckLuxuryTotal() >= MAX_DECK_LUXURIES) return;
  deckCounts[cardId] = count + 1;
  saveDeck();
  renderBuilder();
}

function removeCardFromDeck(cardId) {
  if (!deckCounts[cardId]) return;
  deckCounts[cardId] -= 1;
  if (deckCounts[cardId] <= 0) delete deckCounts[cardId];
  saveDeck();
  renderBuilder();
}

function quickBuildDeck() {
  const recipes = {
    merc: [
      "flash_splicer",
      "flash_splicer",
      "asphalt_samurai",
      "asphalt_samurai",
      "drone_biker",
      "jetpack_raider",
      "hangar_duelist",
      "bounty_ping",
      "bounty_ping",
      "getaway_route",
      "magrail_blade",
      "reflex_chip",
      "aurora_hypercar",
      "phantom_sneakers",
      "meteor_fist_gauntlet",
    ],
    hacker: [
      "cipher_urchin",
      "cipher_urchin",
      "mirror_netrunner",
      "mirror_netrunner",
      "ghost_broker",
      "datavault_sage",
      "memory_splice",
      "memory_splice",
      "firewall_leak",
      "firewall_leak",
      "drone_hijack",
      "cloaking_loop",
      "holo_art_vault",
      "crypto_timepiece",
      "ghost_key_gauntlet",
    ],
    corp: [
      "compliance_sentinel",
      "compliance_sentinel",
      "boardroom_knight",
      "boardroom_knight",
      "tax_drone",
      "elevator_guard",
      "terminal_architect",
      "court_injunction",
      "court_injunction",
      "dividend_burst",
      "executive_plating",
      "prestige_protocol",
      "sky_penthouse",
      "orbital_estate",
      "sovereign_gauntlet",
    ],
  };

  deckCounts = {};
  recipes[selectedOperator].forEach((id) => {
    deckCounts[id] = (deckCounts[id] || 0) + 1;
  });
  saveDeck();
  renderBuilder();
}

function removeInvalidDeckCards() {
  Object.keys(deckCounts).forEach((id) => {
    const card = CARD_BY_ID[id];
    if (!card || (card.faction !== "neutral" && card.faction !== selectedOperator)) {
      delete deckCounts[id];
    }
  });
}

function getDeckTotal() {
  return Object.values(deckCounts).reduce((sum, count) => sum + count, 0);
}

function getDeckLuxuryTotal() {
  return Object.entries(deckCounts).reduce((sum, [id, count]) => {
    return sum + (CARD_BY_ID[id]?.type === "luxury" ? count : 0);
  }, 0);
}

function getMaxCopies(card) {
  return card.type === "luxury" ? 1 : 2;
}

function getArtStyle(card) {
  const customArt = sanitizeCustomImage(card?.customArt);
  if (customArt) {
    return `--art-image:url('${escapeCssUrl(customArt)}');--art-size:cover;--art-x:center;--art-y:center;--art-ratio:1 / 1;`;
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

function escapeCssUrl(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function getSpritePosition(index, count, zoom) {
  if (count <= 1) return 50;
  return ((0.5 - (index + 0.5) * zoom) / (1 - count * zoom)) * 100;
}

function startGame() {
  if (getDeckTotal() !== DECK_SIZE) return;
  if (elements.builderNotice) elements.builderNotice.hidden = true;
  unitSeq = 1;
  luxurySeq = 1;
  activeStoryBattle = loadActiveStoryBattle();
  const playerDeck = expandDeck(deckCounts);
  const aiDeck = activeStoryBattle ? buildStoryAiDeck(activeStoryBattle) : buildAiDeck();
  const aiOperatorId = activeStoryBattle?.enemyOperator || resolveOpponentOperator();

  const firstSide = Math.random() < 0.5 ? "player" : "ai";
  game = {
    turn: firstSide,
    firstSide,
    awaitMulligan: true,
    gameOver: false,
    pending: null,
    selectedAttacker: null,
    selectedHeroAttack: false,
    revealing: false,
    impacts: [],
    impactTimer: null,
    log: [],
    storyBattle: activeStoryBattle ? { ...activeStoryBattle } : null,
    storyResolved: false,
    storyResult: null,
    player: createPlayer("你", "player", selectedOperator, playerDeck),
    ai: createPlayer(
      activeStoryBattle?.enemyName || "對手",
      "ai",
      aiOperatorId,
      aiDeck,
    ),
  };

  if (activeStoryBattle) {
    game.ai.life = activeStoryBattle.enemyLife || STARTING_LIFE;
    game.ai.shield = activeStoryBattle.enemyShield || 0;
  }

  drawCards(game.player, OPENING_HAND, false);
  drawCards(game.ai, OPENING_HAND, false);
  const firstPlayer = getPlayerBySide(firstSide);
  firstPlayer.maxEnergy = 1;
  firstPlayer.energy = 1;
  game.player.batteryAvailable = firstSide === "ai";
  game.ai.batteryAvailable = firstSide === "player";
  if (firstSide === "player") game.player.stats.turns = 1;
  addLog(`你選擇了 ${OPERATORS[selectedOperator].name}。`);
  if (activeStoryBattle) {
    addLog(`劇情關卡：${activeStoryBattle.battleTitle}。`);
    addLog(activeStoryBattle.hint);
  }
  addLog(`${firstSide === "player" ? "你" : "對手"}取得先手；後手獲得一枚備用電池。`);
  addLog("起手完成，可以保留或重抽一次。");
  showView("game");
  renderGame();
}

function expandDeck(counts) {
  const ids = [];
  Object.entries(counts).forEach(([id, count]) => {
    for (let i = 0; i < count; i += 1) ids.push(id);
  });
  return shuffle(ids);
}

function buildAiDeck() {
  return shuffle([
    "security_intern",
    "compliance_sentinel",
    "compliance_sentinel",
    "boardroom_knight",
    "tax_drone",
    "corp_guard",
    "court_injunction",
    "dividend_burst",
    "credit_audit",
    "executive_plating",
    "asset_freeze",
    "terminal_architect",
    "data_broker",
    "orbital_estate",
    "corporate_yacht",
  ]);
}

function buildStoryAiDeck(battle) {
  return shuffle((battle.enemyDeck || []).filter((id) => CARD_BY_ID[id]));
}

function createPlayer(name, side, operatorId, deck) {
  return {
    name,
    side,
    operatorId,
    life: STARTING_LIFE,
    shield: 0,
    operatorGuardTurns: 0,
    deck,
    hand: [],
    board: [],
    luxuries: [],
    discard: [],
    batteryAvailable: false,
    maxEnergy: 0,
    energy: 0,
    nextDiscount: 0,
    skillUsed: false,
    stats: { turns: 0, cardsPlayed: 0, heroDamage: 0, luxuriesEquipped: 0, luxuriesCashed: 0 },
    flags: createTurnFlags(),
  };
}

function createTurnFlags() {
  return {
    firstUnitPlayed: false,
    firstProgramPlayed: false,
    playedLuxuryThisTurn: false,
    jacketUsed: false,
    operatorPassiveUsed: false,
    heroAttacked: false,
    luxuryShieldUsed: false,
  };
}

function resolveOpponentOperator() {
  if (selectedOpponent !== "random" && OPERATORS[selectedOpponent]) return selectedOpponent;
  const candidates = Object.keys(OPERATORS).filter((operatorId) => operatorId !== selectedOperator);
  const pool = candidates.length ? candidates : Object.keys(OPERATORS);
  return pool[Math.floor(Math.random() * pool.length)];
}

function renderGame() {
  if (!game) return;
  renderHero(elements.playerHero, game.player);
  renderHero(elements.aiHero, game.ai);
  renderBoard(elements.playerBoard, game.player);
  renderBoard(elements.aiBoard, game.ai);
  renderOperatorLuxuries(elements.playerLuxuries, game.player);
  renderOperatorLuxuries(elements.aiLuxuries, game.ai);
  renderHand();
  renderTurnBar();
  renderActionPanel();
  renderLog();
  renderStoryResult();
  bindGameTargets();
}

function renderHero(container, player) {
  const operator = OPERATORS[player.operatorId];
  const heroTitle = game?.storyBattle && player.side === "ai" ? player.name : operator.name;
  const equippedWeapon = findOperatorWeapon(player);
  container.innerHTML = `
    <h2>${heroTitle}</h2>
    <div class="hero-stats">
      <div class="hero-stat"><span>生命</span><strong>${player.life}</strong></div>
      <div class="hero-stat"><span>護盾</span><strong>${player.shield}</strong></div>
      <div class="hero-stat"><span>能量</span><strong>${player.energy} / ${player.maxEnergy}</strong></div>
      <div class="hero-stat"><span>牌庫</span><strong>${player.deck.length}</strong></div>
    </div>
    ${player.operatorGuardTurns > 0 && player.shield > 0 ? `<div class="operator-guard-badge">操作者守衛 ${player.operatorGuardTurns}</div>` : ""}
    ${
      equippedWeapon
        ? `<button class="hero-attack-button" data-hero-attack="${player.side}" ${canHeroAttack(player) ? "" : "disabled"}>
            ${equippedWeapon.weapon.type} ${equippedWeapon.weapon.attack}／${equippedWeapon.attachment.durability}
          </button>`
        : ""
    }
  `;
  container.classList.toggle("targetable", isTargetNodeLegal({ kind: "hero", owner: player.side }));
  container.classList.toggle("impact-shake", hasImpact("hero", player.side));
}

function renderBoard(container, player) {
  const slots = [...player.board];
  while (slots.length < MAX_BOARD) slots.push(null);
  container.classList.toggle("impact-zone", hasImpact("board", player.side));
  container.innerHTML = slots
    .map((unit) => (unit ? renderUnit(unit, player) : `<div class="empty-slot">空位</div>`))
    .join("");
}

function renderUnit(unit, player) {
  const card = CARD_BY_ID[unit.cardId] || { art: 35 };
  const tags = [];
  if (unit.guard) tags.push("守衛");
  if (unit.charge) tags.push("速攻");
  if (unit.frozenTurns > 0) tags.push("凍結");
  const selected = game?.selectedAttacker === unit.uid;
  const targetable = isTargetNodeLegal({ kind: "unit", owner: player.side, uid: unit.uid });
  const luxuryCard = unit.luxury ? CARD_BY_ID[unit.luxury.cardId] : null;
  const canCash = player.side === "player" && canPlayerAct();

  return `
    <div class="unit-card target-node ${unit.canAttack && player.side === "player" ? "can-attack" : ""} ${selected ? "selected" : ""} ${targetable ? "targetable" : ""} ${hasImpact("unit", player.side, unit.uid) ? "impact-shake" : ""}"
      data-target-kind="unit"
      data-owner="${player.side}"
      data-uid="${unit.uid}"
      data-type="unit"
      style="${getArtStyle(card)}">
      <div class="unit-art" aria-hidden="true"></div>
      <div class="unit-name">${unit.name}</div>
      <div class="unit-tags">${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
      ${luxuryCard ? renderAttachedLuxury(unit.luxury, luxuryCard, canCash) : ""}
      <div class="unit-stats">
        <span class="stat-badge">${unit.attack}</span>
        <span class="stat-badge danger">${unit.health}</span>
      </div>
    </div>
  `;
}

function renderAttachedLuxury(attachment, card) {
  return `
    <div class="attached-luxury">
      <span>裝備：${card.name}</span>
    </div>
  `;
}

function renderOperatorLuxuries(container, player) {
  const slots = [...player.luxuries];
  while (slots.length < MAX_OPERATOR_LUXURIES + 1) slots.push(null);
  container.classList.toggle("impact-zone", hasImpact("luxury", player.side));
  container.innerHTML = slots
    .map((luxury) => {
      if (!luxury) return `<div class="empty-slot">裝備／武器空位</div>`;
      const card = CARD_BY_ID[luxury.cardId];
      return `
        <div class="luxury-card" data-type="luxury" style="${getArtStyle(card)}">
          <div class="luxury-thumb" aria-hidden="true"></div>
          <div class="luxury-copy">
            <strong>${card.name}</strong>
            <p>${getLuxuryStatus(luxury, card)}</p>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderHand() {
  elements.aiHandCount.textContent = game.ai.hand.length;
  elements.playerHand.innerHTML =
    game.player.hand.length === 0
      ? `<div class="empty-slot">手牌已空</div>`
      : game.player.hand.map((entry, index) => renderHandCard(entry, index)).join("");

  elements.playerHand.querySelectorAll("[data-hand-index]").forEach((button) => {
    button.addEventListener("click", () => playCardFromHand(Number(button.dataset.handIndex)));
  });
}

function renderHandCard(entry, index) {
  const card = CARD_BY_ID[getHandCardId(entry)];
  const appreciation = getHandAppreciation(entry);
  const cost = getPlayableCost(card, game.player);
  const playable = canPlayCard(game.player, card);
  return `
    <button class="hand-card ${playable ? "playable" : ""}" data-hand-index="${index}" data-type="${card.type}">
      <div class="card-topline">
        <span class="cost-badge">${cost}</span>
        <span class="type-chip">${CARD_TYPES[card.type]}</span>
        ${isAppreciatingLuxury(card) ? `<span class="appreciation-badge">+${appreciation}</span>` : ""}
      </div>
      <h3>${card.name}</h3>
      <div class="card-art" style="${getArtStyle(card)}" aria-hidden="true"></div>
      <p class="card-text">${card.text}</p>
      <div class="card-footer">${renderCardStats(card)}</div>
    </button>
  `;
}

function showPlayedCard(card, owner) {
  if (!game || !elements.playReveal) return Promise.resolve();
  game.revealing = true;
  elements.playReveal.hidden = false;
  elements.playReveal.innerHTML = `
    <article class="play-reveal-card" data-type="${card.type}">
      <div class="play-reveal-label">${owner.side === "player" ? "你使用" : "對手使用"}</div>
      <div class="card-topline">
        <span class="cost-badge">${card.cost}</span>
        <span class="type-chip">${CARD_TYPES[card.type]} ・ ${FACTIONS[card.faction]}</span>
      </div>
      <h3>${card.name}</h3>
      <div class="card-art" style="${getArtStyle(card)}" aria-hidden="true"></div>
      <p class="card-text">${card.text}</p>
      <div class="card-footer">${renderCardStats(card)}</div>
    </article>
  `;

  return new Promise((resolve) => {
    window.setTimeout(() => {
      elements.playReveal.hidden = true;
      elements.playReveal.innerHTML = "";
      if (game) game.revealing = false;
      resolve();
    }, 1000);
  });
}

function hasImpact(kind, owner, uid = null) {
  return Boolean(
    game?.impacts?.some((impact) => {
      return impact.kind === kind && impact.owner === owner && (uid === null || impact.uid === uid);
    }),
  );
}

function addImpact(kind, owner, uid = null) {
  if (!game) return;
  const impact = { kind, owner, uid };
  const exists = game.impacts.some((item) => item.kind === kind && item.owner === owner && item.uid === uid);
  if (!exists) game.impacts.push(impact);
}

function markTargetImpact(target) {
  if (!target) return;
  if (target.kind === "hero") {
    addImpact("hero", target.owner);
    return;
  }
  if (target.kind === "unit") {
    addImpact("unit", target.owner, target.uid);
    addImpact("board", target.owner);
  }
}

function markCardImpact(card, owner, opponent, target, summonedUnit = null) {
  if (target) markTargetImpact(target);

  if (summonedUnit) {
    addImpact("unit", owner.side, summonedUnit.uid);
    addImpact("board", owner.side);
  }

  if (card.type === "luxury") {
    addImpact("luxury", owner.side);
  }

  const effect = card.effect || "";
  const affectsOwner =
    card.type === "unit" ||
    effect.includes("draw") ||
    effect.includes("heal") ||
    effect.includes("shield") ||
    effect.includes("ready") ||
    effect.includes("summon") ||
    effect.includes("buff") ||
    effect.includes("discount");
  const affectsEnemy = effect.includes("deal") || effect.includes("enemy") || effect.includes("freeze");

  if (affectsOwner) addImpact("hero", owner.side);
  if (effect.includes("ready") || effect.includes("summon") || effect.includes("buff")) addImpact("board", owner.side);
  if (affectsEnemy && !target) {
    addImpact("hero", opponent.side);
    addImpact("board", opponent.side);
  }
}

function clearImpactsSoon() {
  if (!game) return;
  if (game.impactTimer) window.clearTimeout(game.impactTimer);
  game.impactTimer = window.setTimeout(() => {
    if (!game) return;
    game.impacts = [];
    game.impactTimer = null;
    renderGame();
  }, 720);
}

function renderTurnBar() {
  const playerOperator = OPERATORS[game.player.operatorId];
  elements.heroSkillBtn.textContent = `${playerOperator.skillName} · ${playerOperator.skillCost}`;
  elements.heroSkillBtn.disabled =
    !canPlayerAct() ||
    game.player.skillUsed ||
    game.player.energy < playerOperator.skillCost;
  elements.endTurnBtn.disabled = !canPlayerAct();

  if (game.gameOver) {
    elements.turnStatus.textContent = game.player.life > 0 ? "你贏了" : "你輸了";
  } else if (game.awaitMulligan) {
    elements.turnStatus.textContent = "起手選擇";
  } else if (game.revealing) {
    elements.turnStatus.textContent = "卡牌展示中";
  } else if (game.pending) {
    elements.turnStatus.textContent = "選擇裝備或效果目標";
  } else if (game.selectedAttacker) {
    elements.turnStatus.textContent = "選擇攻擊目標";
  } else if (game.selectedHeroAttack) {
    elements.turnStatus.textContent = "選擇武器攻擊目標";
  } else {
    elements.turnStatus.textContent = game.turn === "player" ? "你的回合" : "對手回合";
  }
}

function renderActionPanel() {
  if (!game) {
    elements.actionPanel.innerHTML = `<div class="notice">先完成配牌再開始對戰。</div>`;
    return;
  }

  if (game.gameOver) {
    const stats = game.player.stats;
    elements.actionPanel.innerHTML = `
      <div class="notice">${game.player.life > 0 ? "勝利" : "敗北"}。這局結束了。</div>
      <div class="match-stats">
        <span><strong>${stats.turns}</strong>回合</span>
        <span><strong>${stats.cardsPlayed}</strong>出牌</span>
        <span><strong>${stats.heroDamage}</strong>傷害</span>
        <span><strong>${stats.luxuriesEquipped}</strong>裝備</span>
        <span><strong>${stats.luxuriesCashed}</strong>奢侈品程式</span>
      </div>
      <button class="primary-button" id="rematchBtn">再打一場</button>
      <button class="ghost-button" id="backToBuilderBtn">回配牌</button>
      ${game.storyBattle ? `<button class="ghost-button" id="storyMapBtn">回劇情地圖</button>` : ""}
    `;
    document.querySelector("#rematchBtn").addEventListener("click", startGame);
    document.querySelector("#backToBuilderBtn").addEventListener("click", () => showView("builder"));
    document.querySelector("#storyMapBtn")?.addEventListener("click", () => {
      window.location.href = "story.html";
    });
    return;
  }

  if (game.awaitMulligan) {
    elements.actionPanel.innerHTML = `
      <div class="notice">起手 3 張，可重抽一次。</div>
      <div class="button-row">
        <button class="primary-button" id="keepHandBtn">保留</button>
        <button class="ghost-button" id="mulliganBtn">重抽</button>
      </div>
    `;
    document.querySelector("#keepHandBtn").addEventListener("click", keepOpeningHand);
    document.querySelector("#mulliganBtn").addEventListener("click", mulliganHand);
    return;
  }

  if (game.pending) {
    if (game.pending.type === "luxuryModeChoice") {
      const card = CARD_BY_ID[game.pending.cardId];
      const plan = getLuxuryPlan(card);
      const level = game.pending.appreciation;
      const primaryDisabled = plan.primary === "unit"
        ? game.player.board.length >= MAX_BOARD
        : plan.primary === "equipUnit"
          ? !game.player.board.some((unit) => !unit.luxury)
          : game.player.luxuries.filter((item) => item.kind === "equipment").length >= MAX_OPERATOR_LUXURIES;
      elements.actionPanel.innerHTML = `
        <div class="notice">「${card.name}」目前升值 +${level}，選擇一種用途。</div>
        <div class="choice-buttons">
          <button class="primary-button luxury-mode-button" id="luxuryPrimaryBtn" ${primaryDisabled ? "disabled" : ""}>
            <strong>${plan.primaryLabel}</strong><span>${getLuxuryModePreview(card, plan.primary, level)}</span>
          </button>
          <button class="ghost-button luxury-mode-button" id="luxuryProgramBtn">
            <strong>啟動程式</strong><span>${getLuxuryModePreview(card, "program", level)}</span>
          </button>
        </div>
        <button class="ghost-button" id="cancelPendingBtn">取消</button>
      `;
      document.querySelector("#luxuryPrimaryBtn")?.addEventListener("click", chooseLuxuryPrimaryMode);
      document.querySelector("#luxuryProgramBtn")?.addEventListener("click", () => chooseLuxuryMode("program"));
      document.querySelector("#cancelPendingBtn").addEventListener("click", cancelPendingAction);
      return;
    }
    elements.actionPanel.innerHTML = `
      <div class="notice">正在使用「${CARD_BY_ID[game.pending.cardId].name}」，請點選合法目標。</div>
      <button class="ghost-button" id="cancelPendingBtn">取消</button>
    `;
    document.querySelector("#cancelPendingBtn").addEventListener("click", cancelPendingAction);
    return;
  }

  if (game.selectedAttacker) {
    const unit = findUnitByUid(game.selectedAttacker);
    elements.actionPanel.innerHTML = `
      <div class="notice">「${unit?.name || "單位"}」準備攻擊。</div>
      <button class="ghost-button" id="cancelAttackBtn">取消</button>
    `;
    document.querySelector("#cancelAttackBtn").addEventListener("click", () => {
      game.selectedAttacker = null;
      renderGame();
    });
    return;
  }

  elements.actionPanel.innerHTML = `
    <div class="notice">
      ${game.storyBattle ? game.storyBattle.hint : "奢侈品留在手牌會升值，打出時選擇部署／裝備或啟動程式；武器會自動裝備。"}
    </div>
    ${game.player.batteryAvailable ? `<button class="primary-button" id="backupBatteryBtn">使用備用電池 · +1 能量</button>` : ""}
  `;
  document.querySelector("#backupBatteryBtn")?.addEventListener("click", () => useBackupBattery(game.player));
}

function renderStoryResult() {
  if (!elements.storyResult) return;
  const result = game?.storyResult;
  if (!result || !game.gameOver || game.player.life <= 0) {
    elements.storyResult.hidden = true;
    elements.storyResult.innerHTML = "";
    return;
  }

  elements.storyResult.hidden = false;
  elements.storyResult.innerHTML = `
    <section class="story-result-panel">
      <div class="story-result-art" style="${getStoryClearStyle(result.image)}" aria-hidden="true"></div>
      <div class="story-result-copy">
        <span class="story-status">${result.final ? "最終通關" : "章節破關"}</span>
        <h2>${result.title}</h2>
        <p>${result.copy}</p>
        <div class="button-row">
          <button id="storyResultMapBtn" class="primary-button">回劇情地圖</button>
          <button id="storyResultCloseBtn" class="ghost-button">留在牌局</button>
        </div>
      </div>
    </section>
  `;
  document.querySelector("#storyResultMapBtn").addEventListener("click", () => {
    window.location.href = "story.html";
  });
  document.querySelector("#storyResultCloseBtn").addEventListener("click", () => {
    game.storyResult = null;
    renderStoryResult();
  });
}

function getStoryClearStyle(index = 0) {
  const col = index % 2;
  const row = Math.floor(index / 2);
  return `--story-art-x:${col * 100}%;--story-art-y:${row * 100}%;`;
}

function renderLog() {
  elements.gameLog.innerHTML = game.log.map((line) => `<div class="log-line">${line}</div>`).join("");
  renderDiscard(game.player, elements.playerDiscardCount, elements.playerDiscardList);
  renderDiscard(game.ai, elements.aiDiscardCount, elements.aiDiscardList);
}

function renderDiscard(player, countElement, listElement) {
  if (!countElement || !listElement) return;
  countElement.textContent = player.discard.length;
  listElement.innerHTML = player.discard.length
    ? player.discard
        .slice()
        .reverse()
        .map((id) => `<span>${CARD_BY_ID[id]?.name || "衍生單位"}</span>`)
        .join("")
    : `<span class="muted-copy">尚無棄牌</span>`;
}

function bindGameTargets() {
  document.querySelectorAll("[data-cash-luxury]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      cashLuxury(button.dataset.cashLuxury);
    });
  });

  document.querySelectorAll(".target-node").forEach((node) => {
    node.addEventListener("click", () => {
      const target = {
        kind: node.dataset.targetKind,
        owner: node.dataset.owner,
        uid: node.dataset.uid,
      };
      handleTargetClick(target);
    });
  });

  document.querySelectorAll("[data-hero-attack]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      if (button.dataset.heroAttack !== "player" || !canHeroAttack(game.player)) return;
      game.selectedAttacker = null;
      game.selectedHeroAttack = true;
      renderGame();
    });
  });
}

function keepOpeningHand() {
  game.awaitMulligan = false;
  addLog("你保留了起手。");
  beginBattleAfterMulligan();
}

function mulliganHand() {
  game.player.deck.push(...game.player.hand.map(getHandCardId));
  game.player.hand = [];
  game.player.deck = shuffle(game.player.deck);
  drawCards(game.player, OPENING_HAND, false);
  game.awaitMulligan = false;
  addLog("你重抽了起手。");
  beginBattleAfterMulligan();
}

function beginBattleAfterMulligan() {
  renderGame();
  if (game.firstSide === "ai") window.setTimeout(() => runAiTurn(true), 450);
}

function useBackupBattery(player) {
  if (!player?.batteryAvailable || game.turn !== player.side || game.gameOver) return;
  player.batteryAvailable = false;
  player.energy += 1;
  addLog(`${player.name}使用備用電池，獲得 1 能量。`);
  renderGame();
}

async function playCardFromHand(handIndex) {
  if (!canPlayerAct() || game.pending || game.selectedAttacker) return;
  const entry = game.player.hand[handIndex];
  const cardId = getHandCardId(entry);
  const card = CARD_BY_ID[cardId];
  if (!canPlayCard(game.player, card)) return;

  if (isAppreciatingLuxury(card)) {
    game.pending = { type: "luxuryModeChoice", handIndex, cardId, appreciation: getHandAppreciation(entry) };
    renderGame();
    return;
  }

  if (needsTarget(card)) {
    const targets = getLegalTargetsForCard(card, game.player, game.ai);
    if (targets.length === 0) return;
    game.pending = { type: "playCard", handIndex, cardId };
    renderGame();
    return;
  }

  await playCardWithReveal(game.player, game.ai, handIndex, null);
}

function findOperatorWeapon(player) {
  for (const attachment of player.luxuries) {
    const weapon = OPERATOR_WEAPONS[attachment.cardId];
    if (weapon) return { attachment, weapon };
  }
  return null;
}

function getLuxuryStatus(attachment, card) {
  const weapon = OPERATOR_WEAPONS[card.id];
  if (weapon) return `${weapon.type} ${weapon.attack} 攻擊／${attachment.durability} 耐久`;
  return `已裝備｜升值 +${attachment.appreciation || 0}`;
}

function canHeroAttack(player) {
  return Boolean(
    findOperatorWeapon(player) &&
      !player.flags.heroAttacked &&
      (player.side !== "player" || canPlayerAct()),
  );
}

function cancelPendingAction() {
  game.pending = null;
  renderGame();
}

function getHandCardId(entry) {
  return typeof entry === "string" ? entry : entry?.cardId;
}

function getHandAppreciation(entry) {
  return typeof entry === "object" && entry ? entry.appreciation || 0 : 0;
}

function isAppreciatingLuxury(card) {
  return Boolean(card?.type === "luxury" && !OPERATOR_WEAPONS[card.id]);
}

function getLuxuryPlan(card) {
  return LUXURY_MODE_PLANS[card?.id] || { primary: "equipUnit", primaryLabel: "裝備單位" };
}

function appreciateHand(player) {
  player.hand.forEach((entry) => {
    const card = CARD_BY_ID[getHandCardId(entry)];
    if (isAppreciatingLuxury(card) && typeof entry === "object") {
      entry.appreciation = Math.min(2, getHandAppreciation(entry) + 1);
    }
  });
}

function chooseLuxuryPrimaryMode() {
  if (!game?.pending || game.pending.type !== "luxuryModeChoice") return;
  const plan = getLuxuryPlan(CARD_BY_ID[game.pending.cardId]);
  if (plan.primary === "equipUnit") {
    game.pending.type = "luxuryModeTarget";
    game.pending.mode = plan.primary;
    renderGame();
    return;
  }
  if (plan.primary === "equipHero" && game.player.luxuries.filter((item) => item.kind === "equipment").length >= MAX_OPERATOR_LUXURIES) return;
  chooseLuxuryMode(plan.primary);
}

async function chooseLuxuryMode(mode, target = null) {
  if (!game?.pending || !["luxuryModeChoice", "luxuryModeTarget"].includes(game.pending.type)) return;
  const pending = { ...game.pending };
  const card = CARD_BY_ID[pending.cardId];
  game.pending = null;
  renderGame();
  await showPlayedCard(card, game.player);
  resolveAppreciatedLuxury(game.player, game.ai, pending.handIndex, mode, pending.appreciation, target);
}

async function playCardWithReveal(owner, opponent, handIndex, target) {
  const cardId = getHandCardId(owner.hand[handIndex]);
  const card = CARD_BY_ID[cardId];
  if (!card || !canPlayCard(owner, card)) return;
  await showPlayedCard(card, owner);
  resolvePlayCard(owner, opponent, handIndex, target);
}

async function handleTargetClick(target) {
  if (!canPlayerAct()) return;

  if (game.pending) {
    if (game.pending.type === "luxuryModeTarget") {
      if (target.owner !== "player" || target.kind !== "unit") return;
      const unit = game.player.board.find((item) => item.uid === target.uid);
      if (!unit || unit.luxury) return;
      await chooseLuxuryMode(game.pending.mode, target);
      return;
    }
    if (game.pending.type !== "playCard") return;
    const card = CARD_BY_ID[game.pending.cardId];
    if (!isLegalCardTarget(card, game.player, game.ai, target)) return;
    const handIndex = game.pending.handIndex;
    game.pending = null;
    renderGame();
    await playCardWithReveal(game.player, game.ai, handIndex, target);
    return;
  }

  if (game.selectedAttacker) {
    if (!isLegalAttackTarget(game.player, game.ai, target)) return;
    resolveAttack(game.player, game.ai, game.selectedAttacker, target);
    return;
  }

  if (game.selectedHeroAttack) {
    elements.actionPanel.innerHTML = `
      <div class="notice">操作者準備使用武器攻擊。</div>
      <button class="ghost-button" id="cancelHeroAttackBtn">取消</button>
    `;
    document.querySelector("#cancelHeroAttackBtn").addEventListener("click", () => {
      game.selectedHeroAttack = false;
      renderGame();
    });
    return;
  }


  if (game.selectedHeroAttack) {
    if (!isLegalAttackTarget(game.player, game.ai, target)) return;
    resolveHeroAttack(game.player, game.ai, target);
    return;
  }

  if (target.owner === "player" && target.kind === "unit") {
    const unit = game.player.board.find((item) => item.uid === target.uid);
    if (!unit || !unit.canAttack || unit.attack <= 0) return;
    game.selectedAttacker = unit.uid;
    renderGame();
  }
}

function resolvePlayCard(owner, opponent, handIndex, target) {
  const cardId = getHandCardId(owner.hand[handIndex]);
  const card = CARD_BY_ID[cardId];
  if (!card || !canPlayCard(owner, card)) return;

  const cost = getPlayableCost(card, owner);
  owner.energy -= cost;
  consumeDiscount(owner);
  owner.hand.splice(handIndex, 1);
  owner.stats.cardsPlayed += 1;

  let summonedUnit = null;
  if (card.type === "unit") {
    summonedUnit = summonUnit(owner, opponent, card);
  } else if (card.type === "luxury") {
    placeLuxury(owner, opponent, card);
  } else {
    owner.discard.push(card.id);
    if (card.type === "program") owner.flags.firstProgramPlayed = true;
    applyCardEffect(card, owner, opponent, target);
    addLog(`${owner.name}使用「${card.name}」。`);
  }

  cleanupDeadUnits();
  markCardImpact(card, owner, opponent, target, summonedUnit);
  checkGameOver();
  renderGame();
  clearImpactsSoon();
}

function summonUnit(owner, opponent, card) {
  if (owner.board.length >= MAX_BOARD) return null;
  const unit = {
    uid: `u${unitSeq++}`,
    owner: owner.side,
    cardId: card.id,
    name: card.name,
    attack: card.attack,
    health: card.health,
    maxHealth: card.health,
    guard: Boolean(card.guard),
    baseGuard: Boolean(card.guard),
    charge: Boolean(card.charge),
    canAttack: Boolean(card.charge),
    frozenTurns: 0,
    luxury: null,
  };

  if (owner.operatorId === "merc" && !owner.flags.firstUnitPlayed) {
    unit.attack += 1;
    addLog(`街頭氣勢讓「${card.name}」攻擊 +1。`);
  }

  if (
    (hasOperatorLuxury(owner, "cyber_car") ||
      hasOperatorLuxury(owner, "aurora_hypercar") ||
      hasOperatorLuxury(owner, "solar_supercar") ||
      hasOperatorLuxury(owner, "graviton_motorcycle") ||
      hasOperatorLuxury(owner, "chrome_rush_gauntlet")) &&
    !owner.flags.firstUnitPlayed
  ) {
    unit.canAttack = true;
    unit.charge = true;
    addLog("賽博超跑讓第一個單位立刻上路。");
  }

  if (
    (hasOperatorLuxury(owner, "limited_sneakers") ||
      hasOperatorLuxury(owner, "phantom_sneakers") ||
      hasOperatorLuxury(owner, "quantum_runway_sneakers")) &&
    card.cost <= 1
  ) {
    unit.attack += 1;
    addLog("限量球鞋讓低費單位攻擊 +1。");
  }

  owner.flags.firstUnitPlayed = true;
  owner.board.push(unit);
  addLog(`${owner.name}召喚「${card.name}」。`);
  applyCardEffect(card, owner, opponent, null);
  return unit;
}

function placeLuxury(owner, opponent, card) {
  const attachment = {
    uid: `l${luxurySeq++}`,
    cardId: card.id,
    host: "hero",
  };

  const weapon = OPERATOR_WEAPONS[card.id];
  if (weapon) {
    const equipped = findOperatorWeapon(owner);
    if (equipped) {
      owner.luxuries = owner.luxuries.filter((item) => item.uid !== equipped.attachment.uid);
      owner.discard.push(equipped.attachment.cardId);
      addLog(`${owner.name}卸下「${CARD_BY_ID[equipped.attachment.cardId].name}」。`);
    }
    attachment.durability = weapon.durability;
    attachment.kind = "weapon";
    owner.luxuries.push(attachment);
    owner.stats.luxuriesEquipped += 1;
    addLog(`${owner.name}裝備「${card.name}」。`);
  } else {
    attachment.kind = "investment";
    attachment.turnsLeft = 2;
    owner.luxuries.push(attachment);
    addLog(`${owner.name}投資「${card.name}」，將產生 2 次收益。`);
  }

  owner.flags.playedLuxuryThisTurn = true;
}

const LUXURY_UNIT_STATS = {
  private_jet: [[2, 3], [3, 3], [4, 4]],
  private_airship: [[2, 4], [3, 4], [4, 5]],
  diamond_airliner: [[3, 3], [3, 4], [4, 5]],
  executive_airliner: [[2, 4], [3, 5], [4, 6]],
  luxury_cruise: [[1, 5], [2, 6], [3, 7]],
  oceanic_cruise: [[1, 6], [2, 7], [3, 8]],
  obsidian_cruiser: [[2, 5], [3, 6], [4, 7]],
  corporate_yacht: [[2, 4], [3, 5], [4, 6]],
  orbital_estate: [[0, 5], [0, 7], [1, 8]],
  marina_resort: [[0, 5], [0, 6], [1, 7]],
  sapphire_skytower: [[1, 5], [1, 7], [2, 8]],
  holo_art_vault: [[0, 4], [0, 5], [1, 6]],
};

const LUXURY_PROGRAM_PREVIEWS = {
  limited_watch: ["下一張牌 -1 費", "下一張牌 -2 費", "抽 1 張；下一張牌 -2 費"],
  sapphire_watch: ["獲得 2 護盾", "獲得 3 護盾與守衛 1", "獲得 4 護盾與守衛 2"],
  crypto_timepiece: ["抽 1 張", "抽 1 張；下一張牌 -1 費", "抽 2 張；下一張牌 -1 費"],
  chrono_boutique_watch: ["下一張牌 -1 費", "下一張牌 -2 費", "抽 1 張；下一張牌 -2 費"],
  legacy_watch: ["抽 1 張", "抽 1 張、1 護盾與守衛 1", "抽 2 張、1 護盾與守衛 2"],
  black_card_bag: ["抽 1 張", "抽 2 張", "抽 2 張並獲得 1 能量"],
  obsidian_bag: ["抽 1 張", "抽 2 張", "抽 2 張；下一張牌 -1 費"],
  stealth_data_bag: ["抽 1 張", "抽 1 張；下一張牌 -1 費", "抽 2 張；下一張牌 -1 費"],
  limited_sneakers: ["準備 1 個單位", "準備 2 個單位", "準備所有友方單位"],
  phantom_sneakers: ["準備 1 個單位", "準備 1 個單位並 +1 攻擊", "全隊準備並 +1 攻擊"],
  quantum_runway_sneakers: ["準備 1 個單位", "準備 1 個單位並 +2 攻擊", "全隊準備並 +2 攻擊"],
  designer_jacket: ["獲得 2 護盾", "獲得 3 護盾與守衛 1", "獲得 4 護盾、守衛 2 並恢復 1 生命"],
  private_jet: ["準備 1 個單位", "準備 2 個單位", "準備所有友方單位"],
  private_airship: ["抽 1 張", "抽 1 張並獲 1 能量", "抽 2 張並獲 1 能量"],
  diamond_airliner: ["抽 1 張", "抽 1 張並獲 1 能量", "抽 2 張並獲 1 能量"],
  executive_airliner: ["獲得 2 護盾", "抽 1 張、3 護盾與守衛 1", "抽 2 張、3 護盾與守衛 2"],
  luxury_cruise: ["召喚 1 個 1/2 守衛", "召喚 2 個 1/2 守衛", "召喚 2 個 2/2 守衛"],
  oceanic_cruise: ["恢復 2 生命並召喚 1/2 守衛", "恢復 3 生命並召喚 1/2 守衛", "恢復 4 生命並召喚 2 個 1/2 守衛"],
  obsidian_cruiser: ["召喚 1 個 1/2 守衛", "召喚 2 個 1/2 守衛", "召喚 2 個 1/2 守衛並對敵方全體造成 1 傷害"],
  corporate_yacht: ["召喚 2/2 守衛", "召喚 2/2 守衛並抽 1 張", "召喚 3/3 守衛、抽 1 張並獲 1 護盾"],
  orbital_estate: ["恢復 2 生命", "恢復 2 生命、2 護盾與守衛 1", "恢復 4 生命、3 護盾與守衛 2"],
  marina_resort: ["恢復 2 生命", "恢復 4 生命", "恢復 5 生命並抽 1 張"],
  sapphire_skytower: ["獲得 3 護盾", "恢復 2 生命、3 護盾與守衛 1", "恢復 4 生命、4 護盾、守衛 2 並抽 1 張"],
  holo_art_vault: ["獲得 1 護盾", "抽 1 張、1 護盾與守衛 1", "抽 2 張、2 護盾與守衛 2"],
};

const LUXURY_PRIMARY_PREVIEWS = {
  limited_watch: ["單位 +0/+1", "單位 +0/+2", "單位 +1/+2"],
  sapphire_watch: ["每回合首次獲盾額外 +1", "裝備時獲 1 護盾；每回合首次獲盾額外 +1", "裝備時獲 2 護盾；每回合首次獲盾額外 +2"],
  crypto_timepiece: ["空手時回合開始抽 1 張", "手牌不超過 1 張時抽 1 張", "觸發抽牌後下一張牌 -1 費"],
  chrono_boutique_watch: ["單位 +0/+1", "單位 +0/+2", "單位 +1/+2 並準備"],
  legacy_watch: ["手牌較少時回合開始抽 1 張", "手牌相同也能觸發", "觸發時再獲 1 護盾"],
  black_card_bag: ["手牌上限 +1", "手牌上限 +2", "手牌上限 +2 並抽 1 張"],
  obsidian_bag: ["單位 +1/+1", "單位 +1/+2", "單位 +2/+2"],
  stealth_data_bag: ["單位 +1/+1", "單位 +1/+2", "單位 +2/+2"],
  limited_sneakers: ["單位 +1/+0 並準備", "單位 +1/+1 並準備", "單位 +2/+1 並準備"],
  phantom_sneakers: ["單位 +1/+0 並準備", "單位 +1/+1 並準備", "單位 +2/+1 並準備"],
  quantum_runway_sneakers: ["單位 +1/+0 並準備", "單位 +1/+1 並準備", "單位 +2/+1 並準備"],
  designer_jacket: ["單位 +0/+3 並獲守衛", "單位 +0/+4 並獲守衛", "單位 +1/+4 並獲守衛"],
  private_jet: ["部署 2/3 快攻", "部署 3/3 快攻", "部署 4/4 快攻"],
  private_airship: ["部署 2/4 守衛", "部署 3/4 守衛並抽 1 張", "部署 4/5 守衛並抽 1 張"],
  diamond_airliner: ["部署 3/3", "部署 3/4 並抽 1 張", "部署 4/5 並抽 1 張"],
  executive_airliner: ["部署 2/4 守衛", "部署 3/5 守衛並獲 2 護盾", "部署 4/6 守衛並獲 3 護盾"],
  luxury_cruise: ["部署 1/5 守衛", "部署 2/6 守衛", "部署 3/7 守衛並召喚 1/2 保全"],
  oceanic_cruise: ["部署 1/6 守衛", "部署 2/7 守衛", "部署 3/8 守衛"],
  obsidian_cruiser: ["部署 2/5 守衛", "部署 3/6 守衛", "部署 4/7 守衛"],
  corporate_yacht: ["部署 2/4 守衛", "部署 3/5 守衛並抽 1 張", "部署 4/6 守衛、抽 1 張並獲 1 護盾"],
  orbital_estate: ["建造 0/5 守衛", "建造 0/7 守衛", "建造 1/8 守衛"],
  marina_resort: ["建造 0/5 守衛", "建造 0/6 守衛", "建造 1/7 守衛"],
  sapphire_skytower: ["建造 1/5 守衛", "建造 1/7 守衛並獲 2 護盾", "建造 2/8 守衛並獲 3 護盾"],
  holo_art_vault: ["建造 0/4 守衛", "建造 0/5 守衛並抽 1 張", "建造 1/6 守衛並抽 1 張"],
};

function formatLuxuryLevels(previews) {
  return `+0 ${previews[0]}；+1 ${previews[1]}；+2 ${previews[2]}`;
}

function formatLuxuryPrimaryLevels(plan, previews) {
  const cleaned = previews.map((preview) => {
    if (plan.primary === "equipUnit") return preview.replace(/^單位 /, "");
    if (plan.primary === "unit") return preview.replace(/^(部署|建造) /, "");
    return preview;
  });
  return formatLuxuryLevels(cleaned);
}

CARDS.forEach((card) => {
  if (!LUXURY_MODE_PLANS[card.id]) return;
  const plan = LUXURY_MODE_PLANS[card.id];
  card.text = `${plan.primaryLabel}：${formatLuxuryPrimaryLevels(plan, LUXURY_PRIMARY_PREVIEWS[card.id])}。程式：${formatLuxuryLevels(LUXURY_PROGRAM_PREVIEWS[card.id])}。`;
});

function getLuxuryModePreview(card, mode, level) {
  if (mode === "program") return LUXURY_PROGRAM_PREVIEWS[card.id]?.[level] || "啟動卡牌的即時效果";
  if (LUXURY_PRIMARY_PREVIEWS[card.id]) return LUXURY_PRIMARY_PREVIEWS[card.id][level];
  if (mode === "unit") {
    const stats = LUXURY_UNIT_STATS[card.id]?.[level];
    return stats ? `部署為 ${stats[0]}/${stats[1]} 單位` : "部署為特殊單位";
  }
  return mode === "equipHero"
    ? `裝備操作者，啟用升值 +${level} 的持續效果`
    : `裝備單位，依升值 +${level} 強化能力`;
}

function resolveAppreciatedLuxury(owner, opponent, handIndex, mode, level, target = null) {
  const entry = owner.hand[handIndex];
  const card = CARD_BY_ID[getHandCardId(entry)];
  if (!card || !isAppreciatingLuxury(card) || !canPlayCard(owner, card)) return;
  owner.energy -= getPlayableCost(card, owner);
  consumeDiscount(owner);
  owner.hand.splice(handIndex, 1);
  owner.stats.cardsPlayed += 1;
  owner.flags.playedLuxuryThisTurn = true;

  if (mode === "program") {
    owner.discard.push(card.id);
    owner.stats.luxuriesCashed += 1;
    applyAppreciatedProgram(owner, opponent, card.id, level);
    addLog(`${owner.name}以 +${level} 啟動「${card.name}」的程式效果。`);
  } else if (mode === "unit") {
    summonLuxuryUnit(owner, card, level);
  } else {
    equipAppreciatedLuxury(owner, card, level, mode, target);
  }

  addImpact("luxury", owner.side);
  cleanupDeadUnits();
  checkGameOver();
  renderGame();
  clearImpactsSoon();
}

function summonLuxuryUnit(owner, card, level) {
  if (owner.board.length >= MAX_BOARD) return;
  const [attack, health] = LUXURY_UNIT_STATS[card.id][level];
  const guardIds = new Set([
    "private_airship", "executive_airliner", "luxury_cruise", "oceanic_cruise",
    "obsidian_cruiser", "corporate_yacht", "orbital_estate", "marina_resort",
    "sapphire_skytower", "holo_art_vault",
  ]);
  const unit = {
    uid: `u${unitSeq++}`,
    owner: owner.side,
    cardId: card.id,
    name: card.name,
    attack,
    health,
    maxHealth: health,
    guard: guardIds.has(card.id),
    baseGuard: guardIds.has(card.id),
    charge: card.id === "private_jet",
    canAttack: card.id === "private_jet",
    frozenTurns: 0,
    luxury: null,
  };
  owner.board.push(unit);
  if (["diamond_airliner", "private_airship", "corporate_yacht", "holo_art_vault"].includes(card.id) && level >= 1) drawCards(owner, 1);
  if (["executive_airliner", "sapphire_skytower"].includes(card.id) && level >= 1) gainShield(owner, level + 1);
  if (card.id === "luxury_cruise" && level >= 2) summonToken(owner, "郵輪保全", 1, 2, true);
  if (card.id === "corporate_yacht" && level >= 2) gainShield(owner, 1);
  addLog(`${owner.name}以 +${level} 將「${card.name}」部署為 ${attack}/${health} 單位。`);
}

function equipAppreciatedLuxury(owner, card, level, mode, target) {
  const attachment = {
    uid: `l${luxurySeq++}`,
    cardId: card.id,
    kind: "equipment",
    host: mode === "equipHero" ? "hero" : "unit",
    appreciation: level,
    bonus: null,
  };
  if (mode === "equipHero") {
    owner.luxuries.push(attachment);
    if (card.id === "black_card_bag" && level >= 2) drawCards(owner, 1);
    if (card.id === "sapphire_watch" && level >= 1) owner.shield += level;
    addLog(`${owner.name}以 +${level} 把「${card.name}」裝備到操作者。`);
  } else {
    const unit = owner.board.find((item) => item.uid === target?.uid);
    if (!unit || unit.luxury) return;
    attachment.unitUid = unit.uid;
    attachment.bonus = applyLuxuryUnitBonus(unit, card.id);
    if (level >= 1) {
      attachment.bonus.health += 1;
      unit.health += 1;
      unit.maxHealth += 1;
    }
    if (level >= 2) {
      attachment.bonus.attack += 1;
      unit.attack += 1;
      if (["limited_sneakers", "phantom_sneakers", "quantum_runway_sneakers"].includes(card.id)) readyUnit(unit);
    }
    unit.luxury = attachment;
    addLog(`${owner.name}以 +${level} 把「${card.name}」裝備到「${unit.name}」。`);
  }
  owner.stats.luxuriesEquipped += 1;
}

function applyAppreciatedProgram(owner, opponent, cardId, level) {
  const draw = (amount) => drawCards(owner, amount);
  const ready = (amount, bonus = 0) => {
    owner.board.slice(0, amount === Infinity ? owner.board.length : amount).forEach((unit) => {
      readyUnit(unit);
      unit.attack += bonus;
    });
  };
  switch (cardId) {
    case "limited_watch": owner.nextDiscount += level === 0 ? 1 : 2; if (level === 2) draw(1); break;
    case "sapphire_watch": gainShieldWithOperatorGuard(owner, 2 + level, level); break;
    case "crypto_timepiece": draw(level === 2 ? 2 : 1); if (level >= 1) owner.nextDiscount += 1; break;
    case "chrono_boutique_watch": owner.nextDiscount += level === 0 ? 1 : 2; if (level === 2) draw(1); break;
    case "legacy_watch": draw(level === 2 ? 2 : 1); if (level >= 1) gainShieldWithOperatorGuard(owner, 1, level); break;
    case "black_card_bag": draw(level === 0 ? 1 : 2); if (level === 2) owner.energy += 1; break;
    case "obsidian_bag": draw(level === 0 ? 1 : 2); if (level === 2) owner.nextDiscount += 1; break;
    case "stealth_data_bag": draw(level === 2 ? 2 : 1); if (level >= 1) owner.nextDiscount += 1; break;
    case "limited_sneakers": ready(level === 0 ? 1 : level === 1 ? 2 : Infinity); break;
    case "phantom_sneakers": ready(level === 2 ? Infinity : 1, level >= 1 ? 1 : 0); break;
    case "quantum_runway_sneakers": ready(level === 2 ? Infinity : 1, level >= 1 ? 2 : 0); break;
    case "designer_jacket": gainShieldWithOperatorGuard(owner, 2 + level, level); if (level === 2) healHero(owner, 1); break;
    case "private_jet": ready(level === 0 ? 1 : level === 1 ? 2 : Infinity); break;
    case "private_airship":
    case "diamond_airliner": draw(level === 2 ? 2 : 1); if (level >= 1) owner.energy += 1; break;
    case "executive_airliner": gainShieldWithOperatorGuard(owner, 2 + Math.min(level, 1), level); if (level >= 1) draw(level); break;
    case "luxury_cruise": summonToken(owner, "郵輪保全", level === 2 ? 2 : 1, 2, true); if (level >= 1) summonToken(owner, "郵輪保全", level === 2 ? 2 : 1, 2, true); break;
    case "oceanic_cruise": healHero(owner, 2 + level); summonToken(owner, "郵輪保全", 1, 2, true); if (level === 2) summonToken(owner, "郵輪保全", 1, 2, true); break;
    case "obsidian_cruiser": summonToken(owner, "黑曜保全", 1, 2, true); if (level >= 1) summonToken(owner, "黑曜保全", 1, 2, true); if (level === 2) opponent.board.forEach((unit) => damageUnit(unit, 1)); break;
    case "corporate_yacht": summonToken(owner, "遊艇保全", level === 2 ? 3 : 2, level === 2 ? 3 : 2, true); if (level >= 1) draw(1); if (level === 2) gainShieldWithOperatorGuard(owner, 1, level); break;
    case "orbital_estate": healHero(owner, level === 2 ? 4 : 2); if (level >= 1) gainShieldWithOperatorGuard(owner, level + 1, level); break;
    case "marina_resort": healHero(owner, level === 0 ? 2 : level === 1 ? 4 : 5); if (level === 2) draw(1); break;
    case "sapphire_skytower": healHero(owner, level === 0 ? 0 : level * 2); gainShieldWithOperatorGuard(owner, 3 + Math.max(0, level - 1), level); if (level === 2) draw(1); break;
    case "holo_art_vault": if (level >= 1) draw(level === 2 ? 2 : 1); gainShieldWithOperatorGuard(owner, level === 2 ? 2 : 1, level); break;
    default: {
      const customCard = CARD_BY_ID[cardId];
      if (customCard?.effect) applyCardEffect(customCard, owner, opponent, null);
      else draw(1);
      break;
    }
  }
}

function processInvestments(player, opponent) {
  const completed = [];
  player.luxuries.forEach((investment) => {
    if (investment.kind !== "investment") return;
    const card = CARD_BY_ID[investment.cardId];
    applyLuxuryCashEffect(player, opponent, investment.cardId);
    investment.turnsLeft -= 1;
    player.stats.luxuriesCashed += 1;
    addImpact("luxury", player.side);
    addLog(`「${card.name}」產生投資收益，剩餘 ${investment.turnsLeft} 次。`);
    if (investment.turnsLeft <= 0) completed.push(investment);
  });
  completed.forEach((investment) => {
    player.luxuries = player.luxuries.filter((item) => item.uid !== investment.uid);
    player.discard.push(investment.cardId);
    addLog(`「${CARD_BY_ID[investment.cardId].name}」投資到期。`);
  });
}

function applyLuxuryUnitBonus(unit, cardId) {
  const bonus = { attack: 0, health: 0, grantedGuard: false };
  switch (cardId) {
    case "cyber_car":
    case "limited_sneakers":
    case "private_jet":
    case "aurora_hypercar":
    case "phantom_sneakers":
    case "private_airship":
    case "solar_supercar":
    case "diamond_airliner":
    case "graviton_motorcycle":
    case "quantum_runway_sneakers":
    case "executive_airliner":
    case "chrome_rush_gauntlet":
    case "meteor_fist_gauntlet":
      bonus.attack = 1;
      if (cardId === "meteor_fist_gauntlet") bonus.attack = 2;
      readyUnit(unit);
      break;
    case "limited_watch":
    case "sapphire_watch":
    case "crypto_timepiece":
    case "chrono_boutique_watch":
    case "legacy_watch":
    case "cipher_pulse_gauntlet":
      bonus.health = 1;
      break;
    case "black_card_bag":
    case "obsidian_bag":
    case "holo_art_vault":
    case "armored_limo":
    case "stealth_data_bag":
    case "orbital_limo":
    case "aegis_guard_gauntlet":
    case "ghost_key_gauntlet":
      bonus.attack = 1;
      bonus.health = 1;
      break;
    case "sovereign_gauntlet":
      bonus.health = 2;
      bonus.grantedGuard = !unit.guard;
      unit.guard = true;
      break;
    case "designer_jacket":
      bonus.health = 3;
      bonus.grantedGuard = !unit.guard;
      unit.guard = true;
      break;
    case "sky_estate":
    case "luxury_cruise":
    case "sky_penthouse":
    case "oceanic_cruise":
    case "orbital_estate":
    case "corporate_yacht":
    case "marina_resort":
    case "obsidian_cruiser":
    case "sapphire_skytower":
      bonus.health = 2;
      bonus.grantedGuard = !unit.guard;
      unit.guard = true;
      break;
    default:
      if (CARD_BY_ID[cardId]?.custom && CARD_BY_ID[cardId]?.type === "luxury") {
        bonus.attack = 1;
        bonus.health = 1;
      }
      break;
  }
  unit.attack += bonus.attack;
  unit.health += bonus.health;
  unit.maxHealth += bonus.health;
  return bonus;
}

function removeLuxuryUnitBonus(unit, attachment) {
  if (!unit || !attachment?.bonus) return;
  const bonus = attachment.bonus;
  unit.attack = Math.max(0, unit.attack - bonus.attack);
  unit.maxHealth = Math.max(1, unit.maxHealth - bonus.health);
  unit.health = Math.max(1, Math.min(unit.health - bonus.health, unit.maxHealth));
  if (bonus.grantedGuard) unit.guard = false;
}

function applyCardEffect(card, owner, opponent, target) {
  const targetUnit = target?.kind === "unit" ? getUnitFromTarget(target) : null;

  switch (card.effect) {
    case "draw_if_luxury":
      if (countAttachedLuxuries(owner) > 0) drawCards(owner, 1);
      break;
    case "heal_hero_2":
      healHero(owner, 2);
      break;
    case "deal_2":
      dealDamageToTarget(target, 2, owner);
      break;
    case "deal_3":
      dealDamageToTarget(target, 3, owner);
      break;
    case "draw_2":
      drawCards(owner, 2);
      break;
    case "draw_1_gain_shield_1":
      drawCards(owner, 1);
      gainShield(owner, 1);
      break;
    case "heal_3":
      healHero(owner, 3);
      break;
    case "summon_1_1_guard":
      summonToken(owner, "保全節點", 1, 1, true);
      break;
    case "summon_2_1_charge": {
      const token = summonToken(owner, "疾行載具", 2, 1, false);
      if (token) {
        token.charge = true;
        readyUnit(token);
      }
      break;
    }
    case "buff_1_1_ready":
      buffUnit(targetUnit, 1, 1);
      readyUnit(targetUnit);
      break;
    case "buff_1_0_ready":
      buffUnit(targetUnit, 1, 0);
      readyUnit(targetUnit);
      break;
    case "buff_0_3_guard":
      buffUnit(targetUnit, 0, 3);
      if (targetUnit) targetUnit.guard = true;
      break;
    case "buff_0_2_guard":
      buffUnit(targetUnit, 0, 2);
      if (targetUnit) targetUnit.guard = true;
      break;
    case "deal_1_luxury_2":
      dealDamageToTarget(target, countAttachedLuxuries(owner) > 0 ? 2 : 1, owner);
      break;
    case "buff_attack_2_ready":
      buffUnit(targetUnit, 2, 0);
      readyUnit(targetUnit);
      break;
    case "buff_2_0":
      buffUnit(targetUnit, 2, 0);
      break;
    case "ping_enemy_hero":
      damageHero(opponent, 1, owner);
      break;
    case "draw_1":
      drawCards(owner, 1);
      break;
    case "deal_2_draw_1":
      dealDamageToTarget(target, 2, owner);
      drawCards(owner, 1);
      break;
    case "draw_1_break_shield":
      drawCards(owner, 1);
      opponent.shield = Math.max(0, opponent.shield - 1);
      break;
    case "enemy_units_minus_1_attack":
      opponent.board.forEach((unit) => {
        unit.attack = Math.max(0, unit.attack - 1);
      });
      break;
    case "enemy_units_take_1":
      opponent.board.forEach((unit) => damageUnit(unit, 1));
      break;
    case "gain_shield_1":
      gainShield(owner, 1);
      break;
    case "gain_shield_2":
      gainShield(owner, 2);
      break;
    case "deal_2_gain_shield_1":
      dealDamageToTarget(target, 2, owner);
      gainShield(owner, 1);
      break;
    case "deal_1_freeze":
      if (targetUnit) {
        damageUnit(targetUnit, 1);
        targetUnit.frozenTurns = Math.max(targetUnit.frozenTurns, 1);
        targetUnit.canAttack = false;
      }
      break;
    case "freeze_enemy_unit":
      if (targetUnit) {
        targetUnit.frozenTurns = Math.max(targetUnit.frozenTurns, 1);
        targetUnit.canAttack = false;
      }
      break;
    case "ready_all_units":
      owner.board.forEach((unit) => readyUnit(unit));
      break;
    case "deal_1_all_enemies":
      damageHero(opponent, 1, owner);
      opponent.board.forEach((unit) => damageUnit(unit, 1));
      break;
    case "discount_1":
      owner.nextDiscount += 1;
      break;
    case "buff_1_2_guard":
      buffUnit(targetUnit, 1, 2);
      if (targetUnit) targetUnit.guard = true;
      break;
    default:
      break;
  }
}

function cashLuxury(uid) {
  if (!canPlayerAct()) return;
  const owner = game.player;
  const opponent = game.ai;
  const found = findLuxuryAttachment(owner, uid);
  if (!found) return;
  const card = CARD_BY_ID[found.attachment.cardId];
  detachLuxury(owner, found);
  applyLuxuryCashEffect(owner, opponent, card.id);
  addImpact("hero", owner.side);
  addImpact("board", owner.side);
  addImpact("luxury", owner.side);
  addLog(`${owner.name}變現「${card.name}」。`);
  cleanupDeadUnits();
  checkGameOver();
  renderGame();
  clearImpactsSoon();
}

function findLuxuryAttachment(owner, uid) {
  const operatorIndex = owner.luxuries.findIndex((item) => item.uid === uid);
  if (operatorIndex >= 0) {
    return { location: "operator", index: operatorIndex, attachment: owner.luxuries[operatorIndex] };
  }
  for (const unit of owner.board) {
    if (unit.luxury?.uid === uid) {
      return { location: "unit", unit, attachment: unit.luxury };
    }
  }
  return null;
}

function detachLuxury(owner, found) {
  if (found.location === "operator") {
    owner.luxuries.splice(found.index, 1);
    return;
  }
  removeLuxuryUnitBonus(found.unit, found.attachment);
  found.unit.luxury = null;
}

function applyLuxuryCashEffect(owner, opponent, cardId) {
  switch (cardId) {
    case "meteor_fist_gauntlet":
      damageHero(opponent, 2, owner);
      break;
    case "ghost_key_gauntlet":
      drawCards(owner, 2);
      break;
    case "sovereign_gauntlet":
      gainShield(owner, 4);
      break;
    case "cyber_car":
    case "aurora_hypercar":
    case "solar_supercar":
    case "graviton_motorcycle":
    case "chrome_rush_gauntlet":
      owner.energy += 2;
      break;
    case "limited_watch":
    case "sapphire_watch":
    case "chrono_boutique_watch":
    case "legacy_watch":
      owner.nextDiscount += 2;
      break;
    case "black_card_bag":
    case "obsidian_bag":
    case "stealth_data_bag":
      drawCards(owner, 2);
      break;
    case "limited_sneakers":
    case "private_jet":
    case "phantom_sneakers":
    case "quantum_runway_sneakers":
      owner.board.forEach((unit) => readyUnit(unit));
      break;
    case "designer_jacket":
    case "armored_limo":
    case "orbital_limo":
    case "aegis_guard_gauntlet":
      gainShield(owner, 3);
      break;
    case "sky_estate":
    case "sky_penthouse":
    case "marina_resort":
    case "sapphire_skytower":
      healHero(owner, 4);
      break;
    case "luxury_cruise":
    case "oceanic_cruise":
    case "obsidian_cruiser":
      summonToken(owner, "郵輪保全", 1, 2, true);
      summonToken(owner, "郵輪保全", 1, 2, true);
      break;
    case "private_airship":
    case "diamond_airliner":
    case "executive_airliner":
      drawCards(owner, 1);
      owner.energy += 1;
      break;
    case "holo_art_vault":
      drawCards(owner, 1);
      gainShield(owner, 1);
      break;
    case "crypto_timepiece":
    case "cipher_pulse_gauntlet":
      drawCards(owner, 1);
      owner.nextDiscount += 1;
      break;
    case "orbital_estate":
      healHero(owner, 2);
      gainShield(owner, 2);
      break;
    case "corporate_yacht":
      summonToken(owner, "遊艇保全", 2, 2, true);
      drawCards(owner, 1);
      break;
    default:
      drawCards(owner, 1);
      break;
  }
}

function useHeroSkill() {
  if (!canPlayerAct()) return;
  const player = game.player;
  const opponent = game.ai;
  const operator = OPERATORS[player.operatorId];
  if (player.skillUsed || player.energy < operator.skillCost) return;
  player.energy -= operator.skillCost;
  player.skillUsed = true;

  if (player.operatorId === "merc") {
    damageHero(opponent, player.flags.playedLuxuryThisTurn ? 2 : 1, player);
    addImpact("hero", opponent.side);
  } else if (player.operatorId === "hacker") {
    drawCards(player, 1);
    addImpact("hero", player.side);
  } else if (player.operatorId === "corp") {
    gainShield(player, 2);
    addImpact("hero", player.side);
  }

  addLog(`${player.name}啟動「${operator.skillName}」。`);
  checkGameOver();
  renderGame();
  clearImpactsSoon();
}

function endPlayerTurn() {
  if (!canPlayerAct()) return;
  game.pending = null;
  game.selectedAttacker = null;
  game.selectedHeroAttack = false;
  processEndOfTurn(game.player, game.ai);
  if (checkGameOver()) {
    renderGame();
    return;
  }
  game.turn = "ai";
  renderGame();
  window.setTimeout(runAiTurn, 550);
}

async function runAiTurn(skipStart = false) {
  if (!game || game.gameOver) return;
  if (!skipStart) startTurn(game.ai, game.player);
  if (game.ai.batteryAvailable) useBackupBattery(game.ai);

  let guard = 0;
  while (guard < 12) {
    guard += 1;
    const playableIndex = chooseAiPlayableCard();
    if (playableIndex < 0) break;
    await playAiCard(playableIndex);
    if (game.gameOver) break;
  }

  if (!game.gameOver) useAiHeroSkill();
  if (!game.gameOver) aiHeroAttack();
  if (!game.gameOver) aiAttack();
  processEndOfTurn(game.ai, game.player);

  if (!checkGameOver()) {
    startTurn(game.player, game.ai);
    addLog("輪到你了。");
  }
  renderGame();
  clearImpactsSoon();
}

function aiHeroAttack() {
  if (!canHeroAttack(game.ai)) return;
  const guards = game.player.board.filter((unit) => unit.guard);
  const target = game.player.operatorGuardTurns > 0 && game.player.shield > 0
    ? { kind: "hero", owner: "player" }
    : guards.length
      ? { kind: "unit", owner: "player", uid: guards[0].uid }
      : { kind: "hero", owner: "player" };
  resolveHeroAttack(game.ai, game.player, target, false);
}

function chooseAiPlayableCard() {
  const playable = game.ai.hand
    .map((entry, index) => ({ card: CARD_BY_ID[getHandCardId(entry)], index }))
    .filter(({ card }) => canPlayCard(game.ai, card));

  playable.sort((a, b) => {
    const scoreA = getAiCardScore(a.card);
    const scoreB = getAiCardScore(b.card);
    return scoreB - scoreA || b.card.cost - a.card.cost;
  });
  return playable[0]?.index ?? -1;
}

function getAiCardScore(card) {
  if (card.type === "unit") return 10 + card.cost;
  if (card.type === "luxury") return 8 + card.cost;
  if (card.type === "program") return 6 + card.cost;
  return 5 + card.cost;
}

async function playAiCard(handIndex) {
  const owner = game.ai;
  const opponent = game.player;
  const entry = owner.hand[handIndex];
  const card = CARD_BY_ID[getHandCardId(entry)];
  if (isAppreciatingLuxury(card)) {
    await showPlayedCard(card, owner);
    const level = getHandAppreciation(entry);
    const plan = getLuxuryPlan(card);
    let mode = plan.primary;
    let target = null;
    if (mode === "unit" && owner.board.length >= MAX_BOARD) mode = "program";
    if (mode === "equipHero" && owner.luxuries.filter((item) => item.kind === "equipment").length >= MAX_OPERATOR_LUXURIES) mode = "program";
    if (mode === "equipUnit") {
      const unit = owner.board.find((item) => !item.luxury);
      if (unit) target = { kind: "unit", owner: owner.side, uid: unit.uid };
      else mode = "program";
    }
    resolveAppreciatedLuxury(owner, opponent, handIndex, mode, level, target);
    return;
  }
  if (card.type === "luxury") {
    await showPlayedCard(card, owner);
    resolvePlayCard(owner, opponent, handIndex, null);
    return;
  }
  const target = chooseAiTarget(card);
  if (needsTarget(card) && !target) return;
  await playCardWithReveal(owner, opponent, handIndex, target);
}

function chooseAiTarget(card) {
  if (card.type === "luxury") {
    const units = game.ai.board.filter((unit) => !unit.luxury);
    const prefersUnit = [
      "limited_sneakers",
      "designer_jacket",
      "luxury_cruise",
      "sky_estate",
      "aurora_hypercar",
      "solar_supercar",
      "phantom_sneakers",
      "quantum_runway_sneakers",
      "sky_penthouse",
      "oceanic_cruise",
      "obsidian_cruiser",
      "private_airship",
      "diamond_airliner",
      "executive_airliner",
      "armored_limo",
      "orbital_limo",
      "orbital_estate",
      "corporate_yacht",
      "marina_resort",
      "sapphire_skytower",
    ].includes(card.id);
    if (prefersUnit && units.length > 0) return { kind: "unit", owner: "ai", uid: units[0].uid };
    if (game.ai.luxuries.length < MAX_OPERATOR_LUXURIES) return { kind: "hero", owner: "ai" };
    if (units.length > 0) return { kind: "unit", owner: "ai", uid: units[0].uid };
    return null;
  }

  if (!card.target) return null;
  if (card.target === "friendlyUnit") {
    const target = game.ai.board.slice().sort((a, b) => b.attack + b.health - (a.attack + a.health))[0];
    return target ? { kind: "unit", owner: "ai", uid: target.uid } : null;
  }

  if (card.target === "enemyUnit") {
    const target = game.player.board.slice().sort((a, b) => b.attack - a.attack || a.health - b.health)[0];
    return target ? { kind: "unit", owner: "player", uid: target.uid } : null;
  }

  if (card.target === "enemy") {
    const guard = game.player.board.find((unit) => unit.guard && unit.health <= 2);
    if (guard) return { kind: "unit", owner: "player", uid: guard.uid };
    if (game.player.life <= 4) return { kind: "hero", owner: "player" };
    const target = game.player.board.slice().sort((a, b) => b.attack - a.attack || a.health - b.health)[0];
    return target ? { kind: "unit", owner: "player", uid: target.uid } : { kind: "hero", owner: "player" };
  }

  return null;
}

function useAiHeroSkill() {
  const ai = game.ai;
  const player = game.player;
  const operator = OPERATORS[ai.operatorId];
  if (ai.energy < operator.skillCost || ai.skillUsed) return;
  ai.energy -= operator.skillCost;
  ai.skillUsed = true;

  if (ai.operatorId === "merc") {
    damageHero(player, ai.flags.playedLuxuryThisTurn ? 2 : 1, ai);
    addImpact("hero", player.side);
  } else if (ai.operatorId === "hacker") {
    drawCards(ai, 1);
    addImpact("hero", ai.side);
  } else {
    gainShield(ai, 2);
    addImpact("hero", ai.side);
  }

  addLog(`對手啟動「${operator.skillName}」。`);
  checkGameOver();
}

function aiAttack() {
  const ai = game.ai;
  const player = game.player;
  ai.board.forEach((unit) => {
    if (game.gameOver || !unit.canAttack || unit.attack <= 0) return;
    const guards = player.board.filter((target) => target.guard);
    const targetUnit = guards[0] || null;
    if (player.operatorGuardTurns > 0 && player.shield > 0) {
      resolveAttack(ai, player, unit.uid, { kind: "hero", owner: "player" }, false);
      return;
    }
    if (targetUnit) {
      resolveAttack(ai, player, unit.uid, { kind: "unit", owner: "player", uid: targetUnit.uid }, false);
    } else {
      resolveAttack(ai, player, unit.uid, { kind: "hero", owner: "player" }, false);
    }
  });
}

function startTurn(player, opponent) {
  game.turn = player.side;
  resetPerTurnFlags();
  player.maxEnergy = Math.min(MAX_ENERGY, player.maxEnergy + 1);
  player.energy = player.maxEnergy;
  player.skillUsed = false;
  player.nextDiscount = 0;
  player.flags.firstUnitPlayed = false;
  player.flags.firstProgramPlayed = false;
  player.flags.playedLuxuryThisTurn = false;
  player.flags.operatorPassiveUsed = false;
  player.flags.heroAttacked = false;
  player.flags.luxuryShieldUsed = false;
  if (player.side === "player") player.stats.turns += 1;
  readyBoardForTurn(player);
  appreciateHand(player);
  drawCards(player, DRAW_PER_TURN);
  processStartOfTurn(player, opponent);
}

function resetPerTurnFlags() {
  [game.player, game.ai].forEach((player) => {
    player.flags.jacketUsed = false;
  });
}

function readyBoardForTurn(player) {
  player.board.forEach((unit) => {
    if (unit.frozenTurns > 0) {
      unit.frozenTurns -= 1;
      unit.canAttack = false;
    } else {
      unit.canAttack = true;
    }
  });
}

function processStartOfTurn(player, opponent) {
  const legacyWatch = getOperatorEquipment(player, "legacy_watch");
  const legacyThreshold = legacyWatch?.appreciation >= 1 ? opponent.hand.length : opponent.hand.length - 1;
  if (legacyWatch && player.hand.length <= legacyThreshold) {
    drawCards(player, 1);
    if (legacyWatch.appreciation >= 2) gainShield(player, 1);
    addLog(`傳承名錶讓${player.name}補進 1 張牌。`);
  }
  const cryptoWatch = getOperatorEquipment(player, "crypto_timepiece");
  if (cryptoWatch && player.hand.length <= (cryptoWatch.appreciation >= 1 ? 1 : 0)) {
    drawCards(player, 1);
    if (cryptoWatch.appreciation >= 2) player.nextDiscount += 1;
    addLog(`加密時計讓${player.name}補進 1 張牌。`);
  }
  if (hasOperatorLuxury(player, "cipher_pulse_gauntlet") && player.hand.length === 0) drawCards(player, 1);
}

function processEndOfTurn(player, opponent) {
  if (
    hasOperatorLuxury(player, "sky_estate") ||
    hasOperatorLuxury(player, "sky_penthouse") ||
    hasOperatorLuxury(player, "orbital_estate") ||
    hasOperatorLuxury(player, "marina_resort") ||
    hasOperatorLuxury(player, "sapphire_skytower")
  ) {
    gainShield(player, 1);
    addLog(`空中豪宅為${player.name}提供 1 點護盾。`);
  }
  if (
    (hasOperatorLuxury(player, "luxury_cruise") ||
      hasOperatorLuxury(player, "oceanic_cruise") ||
      hasOperatorLuxury(player, "corporate_yacht") ||
      hasOperatorLuxury(player, "obsidian_cruiser")) &&
    player.life < opponent.life
  ) {
    healHero(player, 1);
    addLog(`星港郵輪讓${player.name}恢復 1 點生命。`);
  }
  if (opponent.operatorGuardTurns > 0) {
    opponent.operatorGuardTurns -= 1;
    if (opponent.operatorGuardTurns === 0) addLog(`${opponent.name}的操作者守衛結束。`);
  }
}

function resolveAttack(owner, opponent, attackerUid, target, shouldRender = true) {
  const attacker = owner.board.find((unit) => unit.uid === attackerUid);
  if (!attacker || !attacker.canAttack || attacker.attack <= 0) return;

  attacker.canAttack = false;
  game.selectedAttacker = null;
  addImpact("unit", owner.side, attacker.uid);
  markTargetImpact(target);

  if (target.kind === "hero") {
    damageHero(opponent, attacker.attack, owner);
    addLog(`${attacker.name}攻擊${opponent.name}。`);
  } else {
    const defender = opponent.board.find((unit) => unit.uid === target.uid);
    if (!defender) return;
    damageUnit(defender, attacker.attack);
    damageUnit(attacker, defender.attack);
    addLog(`${attacker.name}攻擊「${defender.name}」。`);
  }

  cleanupDeadUnits();
  checkGameOver();
  if (shouldRender) {
    renderGame();
    clearImpactsSoon();
  }
}

function resolveHeroAttack(owner, opponent, target, shouldRender = true) {
  const equipped = findOperatorWeapon(owner);
  if (!equipped || owner.flags.heroAttacked || !isLegalAttackTarget(owner, opponent, target)) return;
  const { attachment, weapon } = equipped;
  owner.flags.heroAttacked = true;
  game.selectedHeroAttack = false;
  addImpact("hero", owner.side);
  markTargetImpact(target);

  if (target.kind === "hero") {
    damageHero(opponent, weapon.attack, owner);
    addLog(`${owner.name}使用${weapon.type}攻擊${opponent.name}。`);
  } else {
    const defender = opponent.board.find((unit) => unit.uid === target.uid);
    if (!defender) return;
    damageUnit(defender, weapon.attack);
    damageHero(owner, defender.attack, opponent);
    addLog(`${owner.name}使用${weapon.type}攻擊「${defender.name}」。`);
  }

  attachment.durability -= 1;
  if (attachment.durability <= 0) {
    const index = owner.luxuries.findIndex((item) => item.uid === attachment.uid);
    if (index >= 0) owner.luxuries.splice(index, 1);
    owner.discard.push(attachment.cardId);
    addLog(`${owner.name}的${weapon.type}耗盡耐久。`);
  }

  cleanupDeadUnits();
  checkGameOver();
  if (shouldRender) {
    renderGame();
    clearImpactsSoon();
  }
}

function canPlayCard(player, card) {
  if (!game || game.gameOver || !card) return false;
  if (player.side === "player" && !canPlayerAct()) return false;
  if (player.energy < getPlayableCost(card, player)) return false;
  if (card.type === "unit" && player.board.length >= MAX_BOARD) return false;
  if (needsTarget(card) && getLegalTargetsForCard(card, player, getOpponent(player)).length === 0) return false;
  return true;
}

function canPlayerAct() {
  return Boolean(game && game.turn === "player" && !game.awaitMulligan && !game.gameOver && !game.revealing);
}

function needsTarget(card) {
  return Boolean(card.target);
}

function getPlayableCost(card, player) {
  let cost = card.cost;
  if (card.type === "program" && player.operatorId === "hacker" && !player.flags.firstProgramPlayed) {
    cost -= 1;
  }
  if (
    card.type === "program" &&
    (hasOperatorLuxury(player, "private_jet") ||
      hasOperatorLuxury(player, "private_airship") ||
      hasOperatorLuxury(player, "diamond_airliner") ||
      hasOperatorLuxury(player, "executive_airliner")) &&
    !player.flags.firstProgramPlayed
  ) {
    cost -= 1;
  }
  if (player.nextDiscount > 0) {
    cost -= player.nextDiscount;
  }
  return Math.max(0, cost);
}

function consumeDiscount(player) {
  player.nextDiscount = 0;
}

function getLegalTargetsForCard(card, owner, opponent) {
  if (card.type === "luxury") {
    return [];
  }

  if (card.target === "friendlyUnit") {
    return owner.board.map((unit) => ({ kind: "unit", owner: owner.side, uid: unit.uid }));
  }
  if (card.target === "enemyUnit") {
    return opponent.board.map((unit) => ({ kind: "unit", owner: opponent.side, uid: unit.uid }));
  }
  if (card.target === "enemy") {
    return [
      { kind: "hero", owner: opponent.side },
      ...opponent.board.map((unit) => ({ kind: "unit", owner: opponent.side, uid: unit.uid })),
    ];
  }
  return [];
}

function isLegalCardTarget(card, owner, opponent, target) {
  return getLegalTargetsForCard(card, owner, opponent).some((legal) => {
    return legal.kind === target.kind && legal.owner === target.owner && (!legal.uid || legal.uid === target.uid);
  });
}

function isLegalAttackTarget(owner, opponent, target) {
  if (target.owner !== opponent.side) return false;
  const guards = opponent.board.filter((unit) => unit.guard);
  const operatorGuard = opponent.operatorGuardTurns > 0 && opponent.shield > 0;
  if (guards.length > 0 || operatorGuard) {
    if (target.kind === "hero") return operatorGuard;
    return target.kind === "unit" && guards.some((unit) => unit.uid === target.uid);
  }
  return target.kind === "hero" || target.kind === "unit";
}

function isTargetNodeLegal(target) {
  if (!canPlayerAct()) return false;
  if (game.pending) {
    if (game.pending.type === "luxuryModeTarget") {
      if (target.owner !== "player" || target.kind !== "unit") return false;
      return Boolean(game.player.board.find((unit) => unit.uid === target.uid && !unit.luxury));
    }
    if (game.pending.type !== "playCard") return false;
    const card = CARD_BY_ID[game.pending.cardId];
    return isLegalCardTarget(card, game.player, game.ai, target);
  }
  if (game.selectedAttacker) return isLegalAttackTarget(game.player, game.ai, target);
  if (game.selectedHeroAttack) return isLegalAttackTarget(game.player, game.ai, target);
  return false;
}

function getUnitFromTarget(target) {
  const player = getPlayerBySide(target.owner);
  return player?.board.find((unit) => unit.uid === target.uid) || null;
}

function getPlayerBySide(side) {
  if (!game) return null;
  return side === "player" ? game.player : game.ai;
}

function getOpponent(player) {
  return player.side === "player" ? game.ai : game.player;
}

function findUnitByUid(uid) {
  return [...game.player.board, ...game.ai.board].find((unit) => unit.uid === uid) || null;
}

function hasOperatorLuxury(player, cardId) {
  return player.luxuries.some((luxury) => luxury.cardId === cardId && luxury.kind !== "investment");
}

function getOperatorEquipment(player, cardId) {
  return player.luxuries.find((luxury) => luxury.cardId === cardId && luxury.kind === "equipment") || null;
}

function countAttachedLuxuries(player) {
  return player.luxuries.length + player.board.filter((unit) => unit.luxury).length;
}

function drawCards(player, amount, logDraw = true) {
  for (let i = 0; i < amount; i += 1) {
    if (player.deck.length === 0) {
      damageHero(player, 1, null, true);
      addLog(`${player.name}牌庫耗盡，受到 1 點傷害。`);
      continue;
    }
    const cardId = player.deck.shift();
    const card = CARD_BY_ID[cardId];
    if (player.hand.length >= getHandLimit(player)) {
      player.discard.push(cardId);
      if (logDraw) addLog(`${player.name}手牌已滿，燒掉「${card.name}」。`);
    } else {
      player.hand.push({ cardId, appreciation: 0 });
      if (logDraw && player.side === "player") addLog(`${player.name}抽到「${card.name}」。`);
      if (logDraw && player.side === "ai") addLog(`${player.name}抽了 1 張牌。`);
    }
  }
}

function getHandLimit(player) {
  let limit = BASE_HAND_LIMIT;
  const blackBag = getOperatorEquipment(player, "black_card_bag");
  if (blackBag) limit += blackBag.appreciation >= 1 ? 2 : 1;
  if (hasOperatorLuxury(player, "obsidian_bag")) limit += 1;
  if (hasOperatorLuxury(player, "holo_art_vault")) limit += 1;
  if (hasOperatorLuxury(player, "stealth_data_bag")) limit += 1;
  return limit;
}

function dealDamageToTarget(target, amount, sourcePlayer) {
  if (!target) return;
  if (target.kind === "hero") {
    damageHero(getPlayerBySide(target.owner), amount, sourcePlayer);
  } else {
    const unit = getUnitFromTarget(target);
    if (unit) damageUnit(unit, amount);
  }
}

function damageHero(player, amount, sourcePlayer = null, ignoreReduction = false) {
  if (!player || amount <= 0) return;
  let incoming = amount;
  if (
    !ignoreReduction &&
    (hasOperatorLuxury(player, "designer_jacket") ||
      hasOperatorLuxury(player, "armored_limo") ||
      hasOperatorLuxury(player, "orbital_limo") ||
      hasOperatorLuxury(player, "aegis_guard_gauntlet")) &&
    !player.flags.jacketUsed
  ) {
    incoming = Math.max(0, incoming - 1);
    player.flags.jacketUsed = true;
    addLog("高訂戰術外套減少了 1 點傷害。");
  }
  const blocked = Math.min(player.shield, incoming);
  player.shield -= blocked;
  incoming -= blocked;
  player.life = Math.max(0, player.life - incoming);
  if (player.shield <= 0) player.operatorGuardTurns = 0;
  if (sourcePlayer && incoming + blocked > 0) {
    sourcePlayer.stats.heroDamage += incoming + blocked;
    addLog(`${sourcePlayer.name}造成 ${incoming + blocked} 點傷害。`);
  }
}

function damageUnit(unit, amount) {
  if (!unit || amount <= 0) return;
  unit.health -= amount;
}

function buffUnit(unit, attack, health) {
  if (!unit) return;
  unit.attack += attack;
  unit.health += health;
  unit.maxHealth += health;
}

function readyUnit(unit) {
  if (!unit) return;
  unit.canAttack = true;
  unit.frozenTurns = 0;
}

function healHero(player, amount) {
  player.life = Math.min(STARTING_LIFE, player.life + amount);
}

function gainShield(player, amount) {
  let total = amount;
  if (player.operatorId === "corp" && !player.flags.operatorPassiveUsed && amount > 0) {
    total += 1;
    player.flags.operatorPassiveUsed = true;
    addLog(`資本緩衝讓${player.name}額外獲得 1 點護盾。`);
  }
  const sapphireWatch = getOperatorEquipment(player, "sapphire_watch");
  if (sapphireWatch && !player.flags.luxuryShieldUsed && amount > 0) {
    total += sapphireWatch.appreciation >= 2 ? 2 : 1;
    player.flags.luxuryShieldUsed = true;
    addLog(`藍晶名錶讓${player.name}額外獲得護盾。`);
  }
  player.shield += total;
}

function gainShieldWithOperatorGuard(player, amount, appreciation) {
  gainShield(player, amount);
  if (amount > 0 && appreciation > 0 && player.shield > 0) {
    player.operatorGuardTurns = Math.max(player.operatorGuardTurns, appreciation);
    addLog(`${player.name}獲得操作者守衛 ${appreciation}。`);
  }
}

function summonToken(player, name, attack, health, guard = false) {
  if (player.board.length >= MAX_BOARD) return null;
  const token = {
    uid: `u${unitSeq++}`,
    owner: player.side,
    cardId: "token",
    name,
    attack,
    health,
    maxHealth: health,
    guard,
    baseGuard: guard,
    charge: false,
    canAttack: false,
    frozenTurns: 0,
    luxury: null,
  };
  player.board.push(token);
  return token;
}

function cleanupDeadUnits() {
  [game.player, game.ai].forEach((player) => {
    const dead = player.board.filter((unit) => unit.health <= 0);
    dead.forEach((unit) => {
      if (unit.luxury) {
        player.discard.push(unit.luxury.cardId);
        addLog(`「${CARD_BY_ID[unit.luxury.cardId].name}」隨「${unit.name}」離場。`);
      }
      if (unit.cardId !== "token" && CARD_BY_ID[unit.cardId]) player.discard.push(unit.cardId);
      addLog(`「${unit.name}」被摧毀。`);
    });
    player.board = player.board.filter((unit) => unit.health > 0);
  });
}

function checkGameOver() {
  if (!game) return false;
  if (game.player.life <= 0 || game.ai.life <= 0) {
    game.gameOver = true;
    game.pending = null;
    game.selectedAttacker = null;
    game.selectedHeroAttack = false;
    addLog(game.player.life > 0 ? "你贏得了這場牌局。" : "對手贏得了這場牌局。");
    if (game.player.life > 0) completeStoryBattle();
    return true;
  }
  return false;
}

function completeStoryBattle() {
  if (!game?.storyBattle || game.storyResolved) return;
  game.storyResolved = true;
  const battle = game.storyBattle;
  const progress = loadStoryProgress();
  progress.completed[battle.id] = true;
  progress.lastCompleted = battle.id;

  if (battle.clearBattle) {
    progress.lastClear = {
      title: battle.clearTitle,
      copy: battle.clearCopy,
      image: battle.clearImage,
      final: Boolean(battle.finalBattle),
    };
    game.storyResult = { ...progress.lastClear };
  }

  localStorage.setItem(STORY_PROGRESS_KEY, JSON.stringify(progress));
  clearActiveStoryBattle();
}

function loadStoryProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORY_PROGRESS_KEY) || "{}");
    return {
      completed: saved.completed || {},
      lastCompleted: saved.lastCompleted || null,
      lastClear: saved.lastClear || null,
    };
  } catch {
    return { completed: {}, lastCompleted: null, lastClear: null };
  }
}

function addLog(message) {
  if (!game) return;
  game.log.unshift(message);
  game.log = game.log.slice(0, 36);
}

function shuffle(items) {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
