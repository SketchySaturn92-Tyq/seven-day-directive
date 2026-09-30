/* ==========================================================
   《七日指令》核心引擎 —— 状态机 + 结算
   随机化版：牌堆、目标、事件、委托全部由本局种子驱动
   ========================================================== */
(function () {
  'use strict';
  const D = window.GAME_DATA;
  const C = D.CONFIG;

  /* ==========================================================
     一、合并扩展内容（在数据加载后立即执行一次）
     ========================================================== */
  (function mergeAll() {
    const seen = {};
    D.ENDINGS.forEach((e) => { seen[e.id] = 1; });
    const take = (pool) => {
      const out = [];
      (pool || []).forEach((e) => { if (!seen[e.id]) { seen[e.id] = 1; out.push(e); } });
      return out;
    };

    // 城区：按 id 去重追加
    if (Array.isArray(window.DISTRICTS_EXTRA)) {
      const have = {};
      D.DISTRICTS.forEach((d) => { have[d.id] = 1; });
      window.DISTRICTS_EXTRA.forEach((d) => { if (!have[d.id]) { have[d.id] = 1; D.DISTRICTS.push(d); } });
    }

    // 目标资产：按 id 去重追加
    if (Array.isArray(window.ASSETS_EXTRA)) {
      const have = {};
      D.ASSETS.forEach((a) => { have[a.id] = 1; });
      window.ASSETS_EXTRA.forEach((a) => { if (!have[a.id]) { have[a.id] = 1; D.ASSETS.push(a); } });
    }

    // 事件：普通扩展 + 初见事件
    const evSeen = {};
    D.EVENTS.forEach((e) => { evSeen[e.id] = 1; });
    const pushEv = (pool) => (pool || []).forEach((e) => {
      if (!evSeen[e.id]) { evSeen[e.id] = 1; D.EVENTS.push(e); }
    });
    pushEv(window.EVENTS_EXTRA);
    pushEv(window.EVENTS_MEET);
    pushEv(window.EVENTS_V5);
    pushEv(window.EVENTS_V6);

    // 结局：三类定调结局条件最具体，排最前；其余扩展插在兜底之前
    const tiered = take(window.ENDINGS_EXTRA2);
    if (tiered.length) D.ENDINGS.unshift(...tiered);
    const extra = take(window.ENDINGS_EXTRA);
    if (extra.length) {
      let at = D.ENDINGS.findIndex((e) => e.id === 'survivor');
      if (at < 0) at = D.ENDINGS.length;
      D.ENDINGS.splice(at, 0, ...extra);
    }
  })();

  /* ==========================================================
     二、基础工具
     ========================================================== */
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  /* ==========================================================
     二·五、NPC 名录
     初见事件里只有名字（写在标题里），没有稳定 id。
     这里建立 名字 / 立绘 → id 的索引，供「认识」面板与委托面板共用。
     ========================================================== */
  const NPCS = {
    'wen-duo': { name: '闻铎', role: '董事会监事', district: 'tower', portrait: 'portrait-monitor' },
    'su-wen': { name: '苏纹', role: '董事会日程官', district: 'tower', portrait: 'portrait-su' },
    'yu-nanzhi': { name: '郁南枝', role: '清算行首席', district: 'exchange', portrait: 'portrait-yu' },
    'dai-siyuan': { name: '戴思远', role: '合规伦理审查官', district: 'exchange', portrait: 'portrait-dai' },
    'cheng-yan': { name: '程砚', role: '首席科学家', district: 'lab', portrait: 'portrait-scientist' },
    'peng-jian': { name: '彭戬', role: '研究所安保总管', district: 'lab', portrait: 'portrait-peng' },
    'lao-ya': { name: '老鸦', role: '灰市掮客', district: 'slum', portrait: 'portrait-fixer' },
    'lu-wan': { name: '陆晚', role: '无证诊所医生', district: 'slum', portrait: 'portrait-lu' },
    'tie-gui': { name: '铁贵', role: '装卸工会头目', district: 'docks', portrait: 'portrait-tie' },
    'yin-mian': { name: '银面', role: '女术士的代理人', district: 'docks', portrait: 'portrait-witch' },
    'wen-shicheng': { name: '温仕成', role: '引航票务掮客', district: 'orbit', portrait: 'portrait-wen' },
    'yu-ke': { name: '雨客', role: '穹顶外「潮」的接触人', district: 'orbit', portrait: 'portrait-yuke' },
    /* 四个新城区新增的常驻角色 */
    'xun-jie': { name: '荀戒', role: '环带巡检员', district: 'ring', portrait: 'portrait-ring' },
    'sa-er': { name: '萨尔', role: '潮的拾荒者', district: 'outside', portrait: 'portrait-out' },
    'ban-tou': { name: '班头', role: '回收场领班', district: 'salvage', portrait: 'portrait-sal' },
    'wu-mian': { name: '无面', role: '记忆银行柜员', district: 'memory', portrait: 'portrait-mem' },
  };

  const NAME_TO_ID = {};
  const PORTRAIT_TO_ID = {};
  Object.keys(NPCS).forEach((id) => {
    NAME_TO_ID[NPCS[id].name] = id;
    PORTRAIT_TO_ID[NPCS[id].portrait] = id;
  });

  /**
   * 从事件推出发布者 id。三条路依次尝试：
   *   1. 事件自带 npc 字段
   *   2. 标题里的「初见 · 名字」，去掉括号补充
   *   3. 立绘文件名反查
   */
  function npcIdOf(ev) {
    if (!ev) return null;
    if (ev.npc && NPCS[ev.npc]) return ev.npc;
    if (ev.portrait && PORTRAIT_TO_ID[ev.portrait]) return PORTRAIT_TO_ID[ev.portrait];
    const t = String(ev.title || '');
    const m = t.match(/初见\s*[·・:：]\s*([^\s（(]+)/);
    if (m && NAME_TO_ID[m[1]]) return NAME_TO_ID[m[1]];
    // 兜底：标题里直接出现名字
    const keys = Object.keys(NAME_TO_ID);
    for (let i = 0; i < keys.length; i++) {
      if (t.indexOf(keys[i]) >= 0) return NAME_TO_ID[keys[i]];
    }
    return null;
  }

  const npcOf = (id) => NPCS[id] || null;

  // 本局随机流。newGame 之前调用时退回系统随机，避免报错。
  let R = null;
  const fallback = window.GAME_RNG.create('bootstrap');
  const rngOf = () => R || fallback;

  const rnd = (n) => rngOf().int(n);
  const pick = (arr) => rngOf().pick(arr);
  const shuffle = (a) => rngOf().shuffle(a.slice());

  /* ==========================================================
     三、牌堆
     ========================================================== */
  function newDeck() {
    const deck = [];
    let uid = 0;
    D.PATHS.forEach((p) => {
      D.TIERS.forEach((t) => {
        const count = t.id === 3 ? 1 : 2;   // 4 路径 × (2+2+1) = 20 张
        for (let i = 0; i < count; i++) {
          deck.push({ uid: 'c' + (uid++), pathId: p.id, tier: t.id, need: t.need, target: null });
        }
      });
    });
    // 开局的三张要保证是可折的：先各路径取一张最低品级，打乱后放最前
    const easy = [];
    D.PATHS.forEach((p) => {
      const c = deck.find((x) => x.pathId === p.id && x.tier === 1 && !easy.includes(x));
      if (c) easy.push(c);
    });
    shuffle(easy);
    const rest = deck.filter((c) => easy.indexOf(c) < 0);
    shuffle(rest);
    return easy.concat(rest);
  }

  /* ==========================================================
     四、开局
     ========================================================== */
  function newGame(originId, seedText) {
    R = window.GAME_RNG.create(seedText);

    const o = D.ORIGINS.find((x) => x.id === originId) || D.ORIGINS[0];
    const all = newDeck();

    const s = {
      version: C.version,
      seed: R.seedText,
      seedLabel: R.label,
      phase: 'play',
      day: 1,
      deadline: C.deadlineDays,
      ap: C.apPerDay,
      apMax: C.apPerDay,
      origin: o,
      stats: Object.assign({}, o.stats),
      tracks: Object.assign({}, o.tracks),
      money: o.money,
      intel: o.intel,
      chips: 0,
      gear: 0,
      boostDiscount: 0,
      foresight: false,
      /* 开局只发三张：牌是挣来的，不是发全的。
         其余十七张留在牌堆，靠主线、关系、委托、城区动作逐张拿到。 */
      hand: all.slice(0, C.startHand),
      deck: all.slice(C.startHand),
      folded: 0,
      fortune: 0,
      log: [],
      pendingEvent: null,
      ending: null,
      lastRoll: null,
      lastResult: null,
      dailyUsed: {},
      rng: R,
      /* --- 委托系统 --- */
      briefs: [],
      briefSeen: [],
      briefCounter: 0,
      briefDone: 0,
      briefExpired: 0,
      briefRefused: 0,
      /* --- 用于委托条件的计数器 --- */
      pathFoldCount: {},
      briefDistrictHits: {},
      /* --- 认识过的 NPC --- */
      metNpcs: {},
      dayLog: [],
    };

    seedHand(s);
    pushLog(s, 'day', '第一天。董事会把一副牌推到你面前。本局种子 ' + R.label + '。');
    return s;
  }

  // 补牌：带地区权重，让目标分布随本局随机
  function seedHand(s) {
    s.hand.forEach((c) => { if (!c.target) c.target = pickTarget(s, c); });
  }

  /* ==========================================================
     四·五、卡牌获取
     牌不再开局发全。所有新牌都从牌堆里按条件抽出来，
     来源记在 s.cardLog 里，玩家能看到每一张是怎么来的。
     ========================================================== */
  function grantCard(s, opts) {
    const o = opts || {};
    const n = o.n || 1;
    const got = [];
    for (let i = 0; i < n; i++) {
      if (!s.deck.length) break;
      if (s.hand.length >= (C.handMax || 7)) break;

      let idx = -1;
      // 优先匹配偏好：先按路径+品级，再按路径，再按品级，最后随便一张
      if (o.path) {
        idx = s.deck.findIndex((c) => c.pathId === o.path && (!o.tier || c.tier === o.tier));
        if (idx < 0) idx = s.deck.findIndex((c) => c.pathId === o.path);
      }
      if (idx < 0 && o.tier) idx = s.deck.findIndex((c) => c.tier === o.tier);
      if (idx < 0) idx = 0;

      const card = s.deck.splice(idx, 1)[0];
      card.target = pickTarget(s, card);
      card.from = o.reason || '来源不明';
      card.gotDay = s.day;
      s.hand.push(card);
      got.push(card);
      s.cardLog = s.cardLog || [];
      s.cardLog.push({ day: s.day, card: label(card), reason: card.from });
      if (s.cardLog.length > 40) s.cardLog.shift();
    }
    if (got.length) {
      pushLog(s, 'good', '获得 ' + got.map((c) => '「' + label(c) + '」').join('、') +
        '（' + (o.reason || '来源不明') + '）');
    }
    return got;
  }


  /* ---------------- 申领：保底牌源 ----------------
     折不动牌的时候，还能走一趟流程再要一张。
     代价是 2 点行动，等于放弃当天的一半行动力。
  ------------------------------------------------------------ */
  function drawCard(s) {
    if (!s.deck || !s.deck.length) return { ok: false, why: '董事会那边也没有余牌了。' };
    if (s.hand.length >= (C.handMax || 7)) return { ok: false, why: '手上拿不下了，先折掉几张。' };
    const cost = 2;
    if (s.ap < cost) return { ok: false, why: '申领要走三道流程，至少要 2 点行动。' };
    s.ap -= cost;
    const lines = [];
    const got = grantCard(s, { reason: '你走了一趟流程', n: 1 });
    if (!got.length) return { ok: false, why: '没领到。' };
    lines.push('你把申请递上去，等了四十分钟，窗口后面的人从抽屉里抽出一张：' + label(got[0]) + '。');
    lines.push('消耗 2 点行动。牌堆还剩 ' + s.deck.length + ' 张。');
    pushLog(s, 'info', '申领到一张 ' + label(got[0]));
    return { ok: true, lines: lines, card: got[0], ap: s.ap };
  }

  /* ---------------- 按来源库检查是否有新牌可拿 ----------------
     CARD_SOURCES 里的每条都带 trigger，满足就给。
     每条只给一次，记在 s.cardSourceUsed 里。
  ------------------------------------------------------------ */
  function checkCardSources(s) {
    const list = Array.isArray(window.CARD_SOURCES) ? window.CARD_SOURCES : [];
    if (!list.length) return [];
    s.cardSourceUsed = s.cardSourceUsed || {};
    s.cardLog = s.cardLog || [];
    const got = [];
    for (let i = 0; i < list.length; i++) {
      const cs = list[i];
      if (!cs || !cs.id || s.cardSourceUsed[cs.id]) continue;
      /* 兼容两种写法：kind/need 与 source/trigger */
      const kind = cs.kind || cs.source || 'npc';
      const t = cs.trigger || {};
      const need = cs.need != null ? cs.need : null;
      let ok = false;

      if (kind === 'npc') {
        const who = cs.npc || t.npc;
        if (!who || !(s.metNpcs && s.metNpcs[who])) continue;
        ok = ST_rel(s, who) >= (need != null ? need : (t.minRel != null ? t.minRel : 1));
      } else if (kind === 'district') {
        const hits = (s.briefDistrictHits && s.briefDistrictHits[cs.district]) || 0;
        ok = hits >= (need != null ? need : (t.minHits != null ? t.minHits : 2));
      } else if (kind === 'stat') {
        ok = (s.stats[cs.stat] || 0) >= (need != null ? need : 7);
      } else if (kind === 'track') {
        ok = (s.tracks[cs.track] || 0) >= (need != null ? need : 6);
      } else if (kind === 'day') {
        ok = s.day >= (need != null ? need : (t.minDay != null ? t.minDay : 5));
      } else {
        /* 兜底：仍支持旧的 trigger 写法 */
        ok = true;
        if (t.minRel != null && (!csrf_npc(cs) || ST_rel(s, csrf_npc(cs)) < t.minRel)) ok = false;
        if (ok && t.minFolded != null && s.folded < t.minFolded) ok = false;
        if (ok && t.minDay != null && s.day < t.minDay) ok = false;
        if (ok && t.flag && !(s.storyFlags && s.storyFlags[t.flag])) ok = false;
        if (ok && t.met && !(s.metNpcs && s.metNpcs[t.met])) ok = false;
      }
      if (!ok) continue;

      const n = cs.n || (cs.grant && cs.grant.n) || 1;
      const path = cs.path || (cs.grant && cs.grant.path) || null;
      const tier = cs.tier || (cs.grant && cs.grant.tier) || null;
      const cards = grantCard(s, { reason: cs.hint || cs.title || '来源', n: n, path: path, tier: tier });
      if (cards.length) {
        s.cardSourceUsed[cs.id] = 1;
        got.push({ src: cs, cards: cards });
      }
    }
    return got;
  }
  /* 旧写法里 npc 可能写在 trigger 上，取出来备用 */
  function csrf_npc(cs) { return cs.npc || (cs.trigger && cs.trigger.npc) || null; }

  /* 只读关系值，避免循环依赖 */
  function ST_rel(s, npcId) {
    if (!s.relations) s.relations = {};
    return Number(s.relations[npcId]) || 0;
  }

  /** 供外部查询：还能拿到几张 */
  function cardsLeft(s) { return s.deck ? s.deck.length : 0; }

  /** 按路径统计手牌，给"某条路径需要几张"这类条件用 */
  function handPathCount(s, pathId) {
    return (s.hand || []).filter((c) => c.pathId === pathId).length;
  }

  /* ==========================================================
     五、查询
     ========================================================== */
  const pathOf = (id) => D.PATHS.find((p) => p.id === id);
  const tierOf = (id) => D.TIERS.find((t) => t.id === id);
  const assetOf = (id) => D.ASSETS.find((a) => a.id === id);
  const districtOf = (id) => (D.DISTRICTS || []).find((d) => d.id === id);
  const statName = (k) => {
    const x = D.STATS.find((v) => v.id === k);
    return x ? x.name : k;
  };
  const trackName = (k) => {
    const x = D.TRACKS.find((v) => v.id === k);
    return x ? x.name : k;
  };

  function pickTarget(s, card) {
    const path = pathOf(card.pathId);
    let pool = D.ASSETS.filter((a) => a.tags.indexOf(path.id) >= 0 && a.level === card.tier);
    if (!pool.length) pool = D.ASSETS.filter((a) => a.level === card.tier);
    if (!pool.length) return null;
    return pick(pool).id;
  }

  /* ==========================================================
     六、判定
     dc 由 级别 / 目标抗性 / 主属性 / 装备 / 权柄 / 加注 共同决定
     ========================================================== */
  function checkDC(s, card, boost) {
    const path = pathOf(card.pathId);
    const target = assetOf(card.target);
    let dc = 6 + card.tier * 2;
    if (target) dc += (target.resist || 0) * 2;
    dc -= Math.floor(s.stats[path.stat] * 0.8);
    dc -= s.gear;
    dc -= Math.floor(s.tracks.power / 4);
    dc -= (boost || 0);
    return clamp(dc, 3, 19);
  }

  function successRate(s, card, boost) {
    return clamp((21 - checkDC(s, card, boost)) / 20, 0.05, 0.95);
  }

  function roll(s, card, boost) {
    const dc = checkDC(s, card, boost);
    const r = 1 + rnd(20);
    const pass = r >= dc || r === 20;
    s.lastRoll = { r: r, dc: dc, pass: pass, crit: r === 20, fumble: r === 1 };
    return s.lastRoll;
  }

  /* ==========================================================
     七、折卡
     ========================================================== */
  function canFold(s, card) {
    if (!card) return { ok: false, why: '牌不在手里。' };
    const target = assetOf(card.target);
    if (!target) return { ok: false, why: '这张牌没有可用目标，先换一张。' };
    if (target.level !== card.tier) return { ok: false, why: '指令级别与目标级别不匹配。' };
    if (s.ap < 2) return { ok: false, why: '这一天已经没有力气出门了。' };
    return { ok: true, why: pathOf(card.pathId).verb + target.name };
  }

  const BOOST_COST = 20, BOOST_VAL = 3;
  const CHIP_PER = 2, CHIP_CAP = 5;

  function boostCost(s) {
    return Math.max(10, BOOST_COST - (s.boostDiscount || 0));
  }

  function fold(s, uid, useBoost, chipSpend) {
    const card = s.hand.find((c) => c.uid === uid);
    if (!card) return { ok: false, why: '牌不在手里。' };
    const gate = canFold(s, card);
    if (!gate.ok) return gate;

    let boost = 0;
    if (useBoost) {
      const cost = boostCost(s);
      if (s.money < cost) return { ok: false, why: '加注需要 ' + cost + ' 信用点。' };
      s.money -= cost;
      boost = BOOST_VAL;
    }
    let chipsUsed = 0;
    if (chipSpend) {
      chipsUsed = Math.min(Math.floor(s.chips / CHIP_PER), CHIP_CAP, Math.max(0, chipSpend | 0));
      if (chipsUsed > 0) { s.chips -= chipsUsed * CHIP_PER; boost += chipsUsed; }
    }

    const path = pathOf(card.pathId);
    const target = assetOf(card.target);
    const out = roll(s, card, boost);
    s.ap -= 2;

    const res = { ok: true, pass: out.pass, crit: out.crit, fumble: out.fumble, r: out.r, dc: out.dc, lines: [], fold: false };
    const extra = [];
    if (useBoost) extra.push('现金加注 +' + BOOST_VAL);
    if (chipsUsed) extra.push('投入 ' + (chipsUsed * CHIP_PER) + ' 芯片 +' + chipsUsed);
    res.lines.push('掷出 ' + out.r + '，判定线 ' + out.dc + '（成功率 ' + Math.round(successRate(s, card, boost) * 100) + '%）' + (extra.length ? '，' + extra.join('、') : '') + '。');

    if (out.pass) {
      res.lines.push(path.verb + '「' + target.name + '」成功。');
      const rw = path.reward;
      const mul = out.crit ? 1.8 : (0.85 + rngOf().next() * 0.3);
      const gain = Math.round(rw.money * mul);
      s.money += gain;
      s.intel += rw.intel;
      s.chips += rw.chips;
      res.lines.push('+ ' + gain + ' 信用点、+' + rw.intel + ' 情报、+' + rw.chips + ' 指令芯片。');
      addTracks(s, path.tracks);
      if (trackLine(path.tracks)) res.lines.push(trackLine(path.tracks) + '。');
      if (s.origin.id === 'enforcer' && (path.id === 'purge' || path.id === 'expand')) {
        s.chips += 2; res.lines.push('外勤本能：+2 芯片。');
      }

      s.hand = s.hand.filter((c) => c.uid !== card.uid);
      s.folded += 1;
      s.fortune += 1 + card.tier;
      s.deadline = C.deadlineDays;
      res.fold = true;
      res.lines.push('牌已折断，期限重置为 7 天。');

      // 给委托系统记账
      s.pathFoldCount[path.id] = (s.pathFoldCount[path.id] || 0) + 1;
      if (target.district) s.briefDistrictHits[target.district] = (s.briefDistrictHits[target.district] || 0) + 1;

      // 不再自动补牌：折掉一张就少一张，新牌要自己去挣
      if (s.folded % 2 === 0) {
        s.chips += 3;
        s.apMax = Math.min(6, C.apPerDay + Math.floor(s.folded / 4));
        res.lines.push('董事会追加授权：+3 芯片。');
      }
      // 每折两张，董事会补发一张（这是最稳的牌源）
      if (s.folded % 2 === 0) {
        const got = grantCard(s, { reason: '董事会按进度补发', n: 1 });
        if (got.length) res.lines.push('董事会补发一张：' + label(got[0]) + '。');
      }
      if (s.folded >= C.deckGoal) res.lines.push('十二张牌，全部折断。');
    } else {
      res.lines.push(path.verb + '「' + target.name + '」失败。');
      s.stats.vitality = clamp(s.stats.vitality - 1, 0, C.statCap);
      if (card.tier >= 2) s.tracks.sin = clamp(s.tracks.sin + 1, 0, C.trackCap);
      const loss = Math.min(s.money, 8 + card.tier * 4);
      s.money -= loss;
      res.lines.push('体魄 -1，善后花掉 ' + loss + ' 信用点。');
      if (out.fumble) {
        s.tracks.loyalty = clamp(s.tracks.loyalty - 1, 0, C.trackCap);
        res.lines.push('崩盘：现场留证，忠诚 -1。');
      }
      if (s.origin.id === 'ghost' && rngOf().chance(0.6)) {
        s.tracks.sin = Math.max(0, s.tracks.sin - 1);
        res.lines.push('幽灵协议：痕迹被抹掉一部分，罪痕 -1。');
      }
    }
    s.lastResult = res;
    pushLog(s, out.pass ? 'good' : 'bad', (out.pass ? '✔ ' : '✘ ') + path.name + ' ' + target.name);
    checkEnd(s);
    return res;
  }

  function addTracks(s, t) {
    Object.keys(t || {}).forEach((k) => {
      s.tracks[k] = clamp(s.tracks[k] + t[k], 0, C.trackCap);
    });
  }

  function trackLine(t) {
    const parts = [];
    D.TRACKS.forEach((k) => { if (t[k.id]) parts.push(k.name + (t[k.id] > 0 ? ' +' : ' ') + t[k.id]); });
    return parts.join('，');
  }

  function label(c) {
    return tierOf(c.tier).name + '·' + pathOf(c.pathId).name;
  }

  /* ==========================================================
     八、日常行动
     设计说明见 design/ACTIONS.md：
     行动不是附加的小游戏，它是「不用掷点就能把局面推回安全区」的唯一手段。
     折牌有失败风险，行动则稳定产出资源与属性，用来把判定线压下去。
     牌堆与行动的关系：行动 → 资源/属性 → 更高的成功率 → 更少失败损失。
     ========================================================== */
  function doAction(s, actionId) {
    const a = D.ACTIONS.find((x) => x.id === actionId);
    if (!a) return { ok: false, why: '没有这个行动。' };

    let cost = a.cost;
    if (s.origin.id === 'ghost' && actionId === 'intel') cost = 1;
    if (s.ap < cost) return { ok: false, why: '行动点不够。' };

    if (actionId === 'clean') {
      const c = 45;
      s.dailyUsed = s.dailyUsed || {};
      if (s.dailyUsed.clean) return { ok: false, why: '一天只能善后一次，监事会盯得紧。' };
      if (s.money < c) return { ok: false, why: '善后需要 ' + c + ' 信用点，你拿不出来。' };
    }

    s.ap -= cost;
    const mult = s.origin.id === 'fixer' && (actionId === 'intel' || actionId === 'social') ? 2 : 1;
    const lines = [];
    const r = a.run;

    if (r.money) {
      let g = Array.isArray(r.money) ? rngOf().range(r.money[0], r.money[1]) : r.money;
      g *= mult; s.money += g;
      lines.push('家业进账 ' + g + ' 信用点。');
    }
    if (r.intel) { const g = r.intel * mult; s.intel += g; lines.push('+' + g + ' 情报。'); }
    if (r.reveal) { s.revealed = true; lines.push('所有指令目标已显形。'); }
    if (r.loyalty) { addTracks(s, { loyalty: r.loyalty }); lines.push('忠诚 +' + r.loyalty + '。'); }
    if (r.charm) { s.stats.charm = clamp(s.stats.charm + 1, 0, C.statCap); lines.push('魅力 +1。'); }
    if (r.renown) { addTracks(s, { renown: r.renown * mult }); lines.push('声望 +' + r.renown * mult + '。'); }
    if (r.statRandom) {
      const k = pick(D.STATS).id;
      s.stats[k] = clamp(s.stats[k] + 1, 0, C.statCap);
      lines.push('进修完成：' + statName(k) + ' +1。');
    }
    if (r.field) lines.push(fieldOp(s));
    if (r.draw) {
      const got = grantCard(s, { reason: '你走了一趟流程', n: 1 });
      if (got.length) {
        lines.push('窗口后面的人从抽屉里抽出一张：' + label(got[0]) + '。牌堆还剩 ' + s.deck.length + ' 张。');
      } else {
        lines.push('董事会那边也没有余牌了。');
      }
    }
    if (r.deal) {
      if (s.intel >= 3) { s.intel -= 3; s.chips += 3; lines.push('用 3 情报换来 3 枚指令芯片。'); }
      else if (s.money >= 25) { s.money -= 25; s.intel += 4; lines.push('花 25 信用点买到 4 份情报。'); }
      else lines.push('你手上既没有情报也没有现金，黑市的人礼貌地请你出去。');
    }
    if (actionId === 'clean') {
      s.money -= 45;
      s.dailyUsed.clean = true;
      s.tracks.sin = Math.max(0, s.tracks.sin - 1);
      lines.push('花掉 45 信用点买通关系，罪痕 -1。这一天不能再做第二次。');
    }
    if (actionId === 'brief' && s.origin.id === 'clerk') {
      addTracks(s, { loyalty: 1 });
      lines.push('合规部资历：忠诚额外 +1。');
    }
    pushLog(s, 'info', a.name + '：' + lines.join(' '));
    return { ok: true, lines: lines, ap: s.ap };
  }

  function fieldOp(s) {
    const r = rngOf().int(100);
    if (r < 45) { const m = 15 + rnd(35); s.money += m; return '你在城南收了一笔外账，+' + m + ' 信用点。'; }
    if (r < 70) { const g = 1 + rnd(3); s.intel += g; return '你顺着一条货运线摸到名录，+' + g + ' 情报。'; }
    if (r < 88) { const c = 1 + rnd(3); s.chips += c; return '你在废弃仓里拆到还能用的部件，+' + c + ' 芯片。'; }
    s.stats.vitality = clamp(s.stats.vitality - 1, 0, C.statCap);
    const m = 20 + rnd(30); s.money += m;
    return '出门遇到伏击，你带着伤和 ' + m + ' 信用点回来。体魄 -1。';
  }

  /* ==========================================================
     九、换牌
     ========================================================== */
  function swapCard(s, uid) {
    const idx = s.hand.findIndex((c) => c.uid === uid);
    if (idx < 0) return { ok: false, why: '牌不在手里。' };
    if (s.deck.length === 0) return { ok: false, why: '牌堆已经空了，没有别的牌可换。' };
    const cost = s.origin.id === 'ghost' ? 1 : 2;
    if (s.ap < cost) return { ok: false, why: '换牌需要 ' + cost + ' 点行动。' };
    s.ap -= cost;
    const used = s.hand[idx];
    const nc = s.deck.shift();
    nc.target = pickTarget(s, nc);
    s.hand[idx] = nc;
    s.deck.push(used);
    pushLog(s, 'info', '你把「' + label(used) + '」退回，换成「' + label(nc) + '」。');
    return { ok: true, card: nc };
  }

  /* ==========================================================
     十、回合推进
     ========================================================== */
  function endDay(s) {
    s.day += 1;
    s.deadline -= 1;
    s.ap = s.apMax;
    s.dailyUsed = {};

    if (s.money > 0) s.money -= Math.min(s.money, 4 + s.folded * 2);

    // 罪痕自然消散
    if (s.tracks.sin >= 4 && rngOf().chance(0.65)) s.tracks.sin -= 1;
    // 监事会追查
    if (s.tracks.sin >= 8 && rngOf().chance(0.4)) {
      s.tracks.loyalty = clamp(s.tracks.loyalty - 1, 0, C.trackCap);
      s.intel = Math.max(0, s.intel - 2);
      pushLog(s, 'bad', '监事会开始查你。忠诚 -1，情报 -2。');
    }
    // 忠诚自然回流
    if (s.tracks.loyalty > 0 && s.tracks.loyalty < C.trackCap) {
      s.tracks.loyalty = clamp(s.tracks.loyalty + 1, 0, C.trackCap);
    }

    s.hand.forEach((c) => { c.target = pickTarget(s, c); });
    if (!s.briefDistrictHits) s.briefDistrictHits = {};
    if (!s.pathFoldCount) s.pathFoldCount = {};

    /* --- 牌源：满足条件的人会开始给你牌 --- */
    const newCards = checkCardSources(s);
    if (newCards.length) {
      newCards.forEach((x) => {
        pushLog(s, 'good', '「' + (x.src.title || '') + '」→ 得到 ' +
          x.cards.map((c) => label(c)).join('、'));
      });
    }

    /* --- 委托：先结算超期，再看是否来新的 --- */
    const expired = window.GAME_BRIEFS ? window.GAME_BRIEFS.tick(s) : [];
    const incoming = window.GAME_BRIEFS ? window.GAME_BRIEFS.maybeSpawn(s) : null;

    if (s.deadline <= 0) {
      pushLog(s, 'bad', '期限归零。会客室的门在你身后关上了。');
      s.ending = endingById('broken');
      s.phase = 'end';
      return { ok: true, dead: true, expired: expired, incoming: incoming };
    }

    // 故事优先：主线或 NPC 支线占用今天的日程，没有才出随机事件
    const story = pickStory(s);
    if (story) {
      s.pendingStory = story;
      s.pendingEvent = null;
      s.phase = 'event';
      pushLog(s, 'day', '第 ' + s.day + ' 天。剩余期限 ' + s.deadline + ' 天。');
      return { ok: true, story: story, expired: expired, incoming: incoming };
    }

    const ev = pickEvent(s);
    s.pendingEvent = ev;
    s.phase = 'event';
    pushLog(s, 'day', '第 ' + s.day + ' 天。剩余期限 ' + s.deadline + ' 天。');
    return { ok: true, event: ev, expired: expired, incoming: incoming };
  }

  let eventBag = [];
  function pickEvent(s) {
    const all = D.EVENTS;
    if (!all.length) return null;
    if (eventBag.length === 0) eventBag = shuffle(all.map((e, i) => i));
    const e = all[eventBag.pop()];
    const npcId = npcIdOf(e);
    const out = {
      id: e.id, title: e.title, text: e.text, options: e.options,
      portrait: e.portrait || null,
      district: e.district || null,
      npc: npcId,
    };
    if (npcId && String(e.title || '').indexOf('初见') >= 0) {
      out.isMeet = true;
      s.metNpcs = s.metNpcs || {};
      s.metNpcs[npcId] = (s.metNpcs[npcId] || 0) + 1;
    }
    return out;
  }

  function resolveEvent(s, optIdx) {
    const ev = s.pendingEvent;
    if (!ev) return { ok: false };
    const opt = ev.options[optIdx];
    if (!opt) return { ok: false };
    const lines = [];
    const r = opt.run;

    if (r.stat) {
      const dc = r.dc;
      const rr = 1 + rnd(20);
      const pass = rr >= dc;
      lines.push('掷出 ' + rr + '，判定线 ' + dc + '。' + (pass ? '成功。' : '失败。'));
      applyEffect(s, pass ? r.ok : r.bad, lines);
    } else {
      applyEffect(s, r, lines);
    }
    s.pendingEvent = null;
    s.phase = 'play';
    pushLog(s, 'event', ev.title + ' → ' + opt.label);
    checkEnd(s);
    /* 选项的 after：选完之后实际发生了什么。
       单独带出来，由界面接在结果后面显示，不混进数值行。 */
    return { ok: true, lines: lines, after: opt.after || null, ev: ev, opt: opt };
  }

  function applyEffect(s, eff, lines) {
    if (!eff) return;
    // 顶层直接写名望键时并入 track
    const bare = {};
    Object.keys(eff).forEach((k) => { if (D.TRACKS.some((t) => t.id === k)) bare[k] = eff[k]; });
    if (Object.keys(bare).length) {
      eff = Object.assign({}, eff, { track: Object.assign({}, bare, eff.track || {}) });
    }
    if (eff.money) { s.money = Math.max(0, s.money + eff.money); lines.push('信用点 ' + (eff.money > 0 ? '+' : '') + eff.money + '。'); }
    if (eff.intel) { s.intel = Math.max(0, s.intel + eff.intel); lines.push('情报 ' + (eff.intel > 0 ? '+' : '') + eff.intel + '。'); }
    if (eff.chips) { s.chips = Math.max(0, s.chips + eff.chips); lines.push('芯片 ' + (eff.chips > 0 ? '+' : '') + eff.chips + '。'); }
    if (eff.vitality) { s.stats.vitality = clamp(s.stats.vitality + eff.vitality, 0, C.statCap); lines.push('体魄 ' + eff.vitality + '。'); }
    if (eff.gear) { s.gear += eff.gear; lines.push('装备 +' + eff.gear + '。'); }
    if (eff.grantCard) {
      const g = eff.grantCard || {};
      const got = grantCard(s, { reason: '这趟没有白跑', n: g.n || 1, path: g.path || null, tier: g.tier || null });
      if (got.length) lines.push('拿到一张：' + got.map((c) => label(c)).join('、') + '。');
    }
    if (eff.resetDeadline) { s.deadline = C.deadlineDays; lines.push('期限重置为 7 天。'); }
    if (eff.statRandom) {
      const k = pick(D.STATS).id;
      s.stats[k] = clamp(s.stats[k] + eff.statRandom, 0, C.statCap);
      lines.push(statName(k) + ' +' + eff.statRandom + '。');
    }
    if (eff.track) {
      addTracks(s, eff.track);
      const tl = trackLine(eff.track);
      if (tl) lines.push(tl + '。');
    }
  }

  /* ==========================================================
     十·五、故事系统挂点
     每天结束时先看有没有故事场景（主线优先），没有才走随机事件。
     ========================================================== */
  function pickStory(S) {
    const ST = window.GAME_STORY;
    if (!ST) return null;
    return ST.nextScene(S);
  }

  function resolveStory(S, scene, optIdx) {
    const ST = window.GAME_STORY;
    if (!ST) return { ok: false };
    const r = ST.resolve(S, scene, optIdx);
    S.pendingEvent = null;
    S.phase = 'play';
    checkEnd(S);
    return r;
  }

  /* 供 story.js 调用，避免两处重复实现 */
  function applyEffectPublic(S, eff, lines) { applyEffect(S, eff, lines || []); }

  /* ==========================================================
     十一、终局
     ========================================================== */
  function checkEnd(s) {
    if (s.tracks.loyalty <= 0) { s.ending = endingById('broken'); s.phase = 'end'; return; }
    if (s.tracks.sin >= C.trackCap) { s.ending = endingById('purged'); s.phase = 'end'; return; }
    if (s.folded >= C.deckGoal) { s.ending = pickEnding(s); s.phase = 'end'; }
  }

  /* 结局判定：按显式 priority 从高到低挑第一个命中的。
     以前是「数组顺序即优先级」，顺序被人动一下就悄悄改了结局，
     现在优先级写在数据里，谁都能看见。 */
  function pickEnding(s) {
    const list = D.ENDINGS.slice().sort((a, b) => (b.priority || 0) - (a.priority || 0));
    for (let i = 0; i < list.length; i++) {
      if (typeof list[i].cond === 'function' && list[i].cond(s)) return list[i];
    }
    return list[list.length - 1];
  }
  function endingById(id) {
    return D.ENDINGS.find((e) => e.id === id) || D.ENDINGS[D.ENDINGS.length - 1];
  }

  /* ==========================================================
     十二、命运商店（局内直接购买，主页另有一套永久升级）
     ========================================================== */
  function buyShop(s, id) {
    const it = D.SHOP.find((x) => x.id === id);
    if (!it) return { ok: false, why: '没有这件东西。' };
    if (s.fortune < it.cost) return { ok: false, why: '命运点数不够。' };
    s.fortune -= it.cost;
    const lines = [];
    applyEffect(s, it.run, lines);
    pushLog(s, 'info', '命运商店：' + it.name);
    return { ok: true, lines: lines };
  }

  function pushLog(s, kind, text) {
    s.log.unshift({ kind: kind, text: text, day: s.day });
    if (s.log.length > 80) s.log.pop();
  }

  /* ==========================================================
     十三、导出
     ========================================================== */
  window.GAME_ENGINE = {
    newGame, fold, doAction, swapCard, endDay, resolveEvent, buyShop,
    resolveStory, pickStory, applyEffectPublic, grantCard, cardsLeft, handPathCount, checkCardSources, drawCard,
    pathOf, tierOf, assetOf, districtOf, label, npcOf, npcIdOf, NPCS,
    checkDC, successRate, canFold, trackLine, checkEnd,
    boostCost, statName, trackName,
    BOOST_COST, BOOST_VAL, CHIP_PER, CHIP_CAP,
    get rng() { return R; },
  };
})();
