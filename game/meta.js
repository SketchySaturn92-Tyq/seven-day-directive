/* ==========================================================
   《七日指令》元层 —— 跨局档案与命运商店
   命运点与永久升级存在本地，游戏内不再出现商店
   ========================================================== */
(function () {
  'use strict';
  const D = window.GAME_DATA;
  const C = D.CONFIG;
  const KEY = 'sdd.profile.v1';

  const STAT_CAP = C.statCap;

  /* ---------------- 命运商店：永久升级（可叠加） ---------------- */
  const NEXUS = [
    {
      id: 'n_str', name: '强化疗程', cost: 6, max: 5, icon: '◈',
      desc: '开局随机两项属性各 +1',
      apply(s, n) {
        for (let i = 0; i < n * 2; i++) {
          const k = D.STATS[Math.floor(Math.random() * D.STATS.length)].id;
          s.stats[k] = Math.min(STAT_CAP, s.stats[k] + 1);
        }
      },
    },
    {
      id: 'n_cash', name: '起始资金', cost: 5, max: 6, icon: '¥',
      desc: '开局 +30 信用点',
      apply(s, n) { s.money += 30 * n; },
    },
    {
      id: 'n_intel', name: '情报底子', cost: 5, max: 5, icon: '◉',
      desc: '开局 +2 情报',
      apply(s, n) { s.intel += 2 * n; },
    },
    {
      id: 'n_chip', name: '芯片囤积', cost: 7, max: 5, icon: '▣',
      desc: '开局 +2 指令芯片',
      apply(s, n) { s.chips += 2 * n; },
    },
    {
      id: 'n_gear', name: '定制义体', cost: 9, max: 4, icon: '◤',
      desc: '开局装备战力 +1',
      apply(s, n) { s.gear += n; },
    },
    {
      id: 'n_loyal', name: '董事信任', cost: 8, max: 4, icon: '⬢',
      desc: '初始忠诚 +1',
      apply(s, n) { s.tracks.loyalty = Math.min(C.trackCap, s.tracks.loyalty + n); },
    },
    {
      id: 'n_renown', name: '行业声望', cost: 8, max: 4, icon: '♡',
      desc: '初始声望 +1',
      apply(s, n) { s.tracks.renown = Math.min(C.trackCap, s.tracks.renown + n); },
    },
    {
      id: 'n_power', name: '人脉权柄', cost: 10, max: 4, icon: '✦',
      desc: '初始权柄 +1',
      apply(s, n) { s.tracks.power = Math.min(C.trackCap, s.tracks.power + n); },
    },
    {
      id: 'n_clean', name: '洗白档案', cost: 12, max: 3, icon: '⌫',
      desc: '初始罪痕 −1',
      apply(s, n) { s.tracks.sin = Math.max(0, s.tracks.sin - n); },
    },
    {
      id: 'n_boost', name: '议价能力', cost: 9, max: 2, icon: '⇄',
      desc: '加注花费每次 −5（最低 10）',
      apply(s, n) { s.boostDiscount = 5 * n; },
    },
    {
      id: 'n_ap', name: '作息管理', cost: 14, max: 2, icon: '◆',
      desc: '每日行动点 +1',
      apply(s, n) { s.apMax += n; s.ap = s.apMax; },
    },
    {
      id: 'n_grasp', name: '局势嗅觉', cost: 16, max: 1, icon: '◎',
      desc: '开局即为全部指令标注最优目标，并揭示所有城区事件',
      apply(s, n) { if (n > 0) s.foresight = true; },
    },
  ];

  /* ---------------- 档案读写 ---------------- */
  function blank() {
    return { version: 1, fortune: 0, upgrades: {}, runs: 0, wins: 0, endings: {}, best: null, lastRun: null };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      const p = Object.assign(blank(), JSON.parse(raw));
      p.upgrades = p.upgrades || {};
      p.endings = p.endings || {};
      p.fortune = Number(p.fortune) || 0;
      return p;
    } catch (e) {
      return blank();
    }
  }

  function save(p) {
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { /* 隐私模式忽略 */ }
    return p;
  }

  function reset() { return save(blank()); }

  /* ---------------- 升级 ---------------- */
  function levelOf(p, id) { return Number(p.upgrades[id]) || 0; }

  function canBuy(p, id) {
    const item = NEXUS.find((x) => x.id === id);
    if (!item) return { ok: false, why: '没有这项升级。' };
    const lv = levelOf(p, id);
    if (lv >= item.max) return { ok: false, why: '已经满级。' };
    if (p.fortune < item.cost) return { ok: false, why: '命运点不足，还差 ' + (item.cost - p.fortune) + ' 点。' };
    return { ok: true, item, lv };
  }

  function buy(p, id) {
    const g = canBuy(p, id);
    if (!g.ok) return g;
    p.fortune -= g.item.cost;
    p.upgrades[id] = g.lv + 1;
    save(p);
    return { ok: true, item: g.item, level: g.lv + 1 };
  }

  function refundAll(p) {
    let back = 0;
    NEXUS.forEach((it) => {
      const lv = levelOf(p, it.id);
      if (lv > 0) { back += lv * it.cost; p.upgrades[it.id] = 0; }
    });
    p.upgrades = {};
    p.fortune += back;
    save(p);
    return back;
  }

  /* ---------------- 应用到新一局 ---------------- */
  function applyToRun(s, p) {
    const gained = [];
    NEXUS.forEach((it) => {
      const lv = levelOf(p, it.id);
      if (lv > 0) { it.apply(s, lv); gained.push(it.name + ' Lv' + lv); }
    });
    s.profileApplied = gained;
    return gained;
  }

  /* ---------------- 结算 ---------------- */
  function settle(p, s) {
    const earned = Math.max(0, s.fortune);
    p.fortune += earned;
    p.runs += 1;
    const win = s.folded >= C.deckGoal;
    if (win) p.wins += 1;
    const eid = s.ending ? s.ending.id : 'none';
    p.endings[eid] = (p.endings[eid] || 0) + 1;
    const run = {
      at: new Date().toISOString(),
      ending: s.ending ? s.ending.name : '未结束',
      endingId: eid,
      origin: s.origin.name,
      days: s.day,
      folded: s.folded,
      points: earned,
      tracks: Object.assign({}, s.tracks),
    };
    if (!p.best || run.points > p.best.points) p.best = run;
    p.lastRun = run;
    save(p);
    return { earned: earned, total: p.fortune, run: run, win: win };
  }

  function ownedCount(p) { return NEXUS.filter((it) => levelOf(p, it.id) > 0).length; }

  window.GAME_META = { NEXUS, KEY, blank, load, save, reset, levelOf, canBuy, buy, refundAll, applyToRun, settle, ownedCount };
})();
