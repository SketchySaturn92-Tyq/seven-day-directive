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

  /* ==========================================================
     结算：按「这一局打成什么样」给命运点
     以前只算折了几张牌，结局好坏、委托做没做、活了几天、
     认识了谁，一律不算。现在每一项都单独计分，并留下明细，
     终局屏可以逐条展示给玩家看。
     ========================================================== */

  /* 结局分量：越难达成的结局给得越多。
     「被回收」「自由落体」是失败，只给一点参与分。 */
  const ENDING_SCORE = {
    v2_true: 40,   // 牌不再发下来
    emperor: 30,   // 穹顶之上的名字
    sultan: 28,    // 新的苏丹
    hero: 26,      // 脏手的善人
    w1: 24,        // 账本之外
    ghost_out: 22, // 幽灵离场
    w3: 20,        // 雨落进来
    dog: 18,       // 忠犬归位
    w5: 16,        // 十八块钱的葬礼
    w4: 14,        // 第十二名
    w6: 12,        // 穹顶照着旧样子
    w2: 10,        // 替她签收
    survivor: 10,  // 活着就好
    v2_fake: 8,    // 最配合的那个人（看着赢，其实被留下）
    v2_bad: 6,     // 我认得这张脸吗
    purged: 3,     // 被回收
    broken: 2,     // 三十六层高的自由落体
  };

  function scoreRun(s) {
    const rows = [];
    const add = (label, value, note) => {
      if (value) rows.push({ label: label, value: value, note: note || '' });
    };
    const tr = s.tracks || {};
    const win = (s.folded || 0) >= C.deckGoal;

    /* 折牌：命中多少条指令。这就是原来的全部算法，现在只是明细里的一项 */
    add('折断的指令卡', Math.max(0, s.fortune || 0), (s.folded || 0) + ' / ' + C.deckGoal + ' 张');

    /* 结局：这一局最后落成什么样，是最大的一笔 */
    const eid = s.ending ? s.ending.id : '';
    const ev = eid ? (ENDING_SCORE[eid] != null ? ENDING_SCORE[eid] : 8) : 0;
    add('结局', ev, s.ending ? s.ending.name : '未结束');

    /* 委托：做成的算，超期和回绝要扣 */
    const done = s.briefDone || 0, over = s.briefExpired || 0, refuse = s.briefRefused || 0;
    add('委托交差', done * 3, done + ' 件');
    add('委托超期', -over, over + ' 件');
    add('委托回绝', -refuse, refuse + ' 件');

    /* 存活天数：活下来本身在这座城里就算成绩 */
    add('存活天数', Math.min(30, s.day || 0), (s.day || 0) + ' 天');

    /* 关系：认识的人越多，下一局开局能拿到的牌源越多 */
    const met = Object.keys(s.metNpcs || {}).length;
    add('认识的人', Math.min(16, met), met + ' 人');

    /* 名望四轨的总积累 */
    const sum = (tr.loyalty || 0) + (tr.renown || 0) + (tr.sin || 0) + (tr.power || 0);
    add('名望积累', Math.round(sum / 4),
      '忠诚 ' + (tr.loyalty || 0) + ' · 声望 ' + (tr.renown || 0) +
      ' · 罪痕 ' + (tr.sin || 0) + ' · 权柄 ' + (tr.power || 0));

    /* 通关：十二张全折完，额外给一笔 */
    add('折完全部十二张', win ? 12 : 0, win ? '通关' : '未完');

    const total = rows.reduce((a, r) => a + r.value, 0);
    return { rows: rows, total: Math.max(0, total), win: win };
  }

  function settle(p, s) {
    const sc = scoreRun(s);
    const earned = sc.total;
    p.fortune += earned;
    p.runs += 1;
    const win = sc.win;
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
      rows: sc.rows,
      win: win,
      tracks: Object.assign({}, s.tracks),
    };
    if (!p.best || run.points > p.best.points) p.best = run;
    p.lastRun = run;
    save(p);
    return { earned: earned, total: p.fortune, run: run, win: win, rows: sc.rows };
  }

  function ownedCount(p) { return NEXUS.filter((it) => levelOf(p, it.id) > 0).length; }

  window.GAME_META = { NEXUS, KEY, blank, load, save, reset, levelOf, canBuy, buy, refundAll, applyToRun, settle, scoreRun, ENDING_SCORE, ownedCount };
})();
