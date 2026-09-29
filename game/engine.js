/* ==========================================================
   《七日指令》核心引擎 —— 状态机 + 结算
   平衡版：判定线贴合属性区间，失败不致死，罪痕软性施压
   ========================================================== */
(function () {
  'use strict';
  const D = window.GAME_DATA;
  const C = D.CONFIG;

  const rnd = (n) => Math.floor(Math.random() * n);
  const pick = (arr) => arr[rnd(arr.length)];
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  /* ---------------- 合并扩展内容（design/WORLD.md → content-extra.js） ---------------- */
  (function mergeExtra() {
    if (Array.isArray(window.EVENTS_EXTRA) && window.EVENTS_EXTRA.length) {
      const seen = {};
      D.EVENTS.forEach((e) => { seen[e.id] = 1; });
      window.EVENTS_EXTRA.forEach((e) => { if (!seen[e.id]) D.EVENTS.push(e); });
    }
    const seen = {};
    D.ENDINGS.forEach((e) => { seen[e.id] = 1; });
    const take = (pool) => {
      const out = [];
      (pool || []).forEach((e) => { if (!seen[e.id]) { seen[e.id] = 1; out.push(e); } });
      return out;
    };

    // 三类定调结局（假好 / 真好 / 坏）条件最具体，插到最前面，
    // 否则会被「脏手的善人」「第十二名」这类中段条件抢先命中。
    const tiered = take(window.ENDINGS_EXTRA2);
    if (tiered.length) D.ENDINGS.unshift(...tiered);

    // 其余扩展结局插在兜底结局之前（即「穹顶之上的名字」这类之后）
    const extra = take(window.ENDINGS_EXTRA);
    if (extra.length) {
      let at = D.ENDINGS.findIndex((e) => e.id === 'survivor');
      if (at < 0) at = D.ENDINGS.length;
      D.ENDINGS.splice(at, 0, ...extra);
    }
  })();

  function shuffle(a) {
    const r = a.slice();
    for (let i = r.length - 1; i > 0; i--) {
      const j = rnd(i + 1);
      [r[i], r[j]] = [r[j], r[i]];
    }
    return r;
  }

  /* ---------------- 牌堆 ---------------- */
  function newDeck() {
    const deck = [];
    let uid = 0;
    D.PATHS.forEach((p) => {
      D.TIERS.forEach((t) => {
        const count = t.id === 3 ? 1 : 2;   // 3 路径 × (2+2+1) × 4 = 需 12 张
        for (let i = 0; i < count; i++) {
          deck.push({ uid: 'c' + (uid++), pathId: p.id, tier: t.id, need: t.need, target: null });
        }
      });
    });
    return shuffle(deck);
  }

  /* ---------------- 开局 ---------------- */
  function newGame(originId) {
    const o = D.ORIGINS.find((x) => x.id === originId) || D.ORIGINS[0];
    const all = newDeck();
    const s = {
      version: C.version,
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
      hand: all.slice(0, 5),
      deck: all.slice(5),
      folded: 0,
      fortune: 0,
      log: [],
      revealed: false,
      pendingEvent: null,
      ending: null,
      lastRoll: null,
      lastResult: null,
    };
    s.hand.forEach((c) => { c.target = pickTarget(s, c); });
    pushLog(s, 'day', '第一天。董事会把一副牌推到你面前，女术士在旁边鼓掌。');
    return s;
  }

  /* ---------------- 查询 ---------------- */
  const pathOf = (id) => D.PATHS.find((p) => p.id === id);
  const tierOf = (id) => D.TIERS.find((t) => t.id === id);
  const assetOf = (id) => D.ASSETS.find((a) => a.id === id);
  const statName = (k) => { const x = D.STATS.find((v) => v.id === k); return x ? x.name : k; };

  function pickTarget(s, card) {
    const path = pathOf(card.pathId);
    const pool = D.ASSETS.filter((a) => a.tags.indexOf(path.id) >= 0 && a.level === card.tier);
    if (!pool.length) return null;
    return pick(pool).id;
  }

  /* ---------------- 判定线 ----------------
     dc = 8 + 级别*2 + 抗性*2 - 主属性*0.8 - 装备 - 权柄/4
     设计目标：铁牌 ~70-80%，银牌 ~50-60%，金牌 ~30-40%
  ------------------------------------------ */
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
    const dc = checkDC(s, card, boost);
    return clamp((21 - dc) / 20, 0.05, 0.95);
  }

  function roll(s, card, boost) {
    const dc = checkDC(s, card, boost);
    const r = 1 + rnd(20);
    const pass = r >= dc || r === 20;
    const crit = r === 20;
    const fumble = r === 1;
    s.lastRoll = { r: r, dc: dc, pass: pass, crit: crit, fumble: fumble };
    return s.lastRoll;
  }

  /* ---------------- 折卡 ---------------- */
  function canFold(s, card) {
    if (!card) return { ok: false, why: '牌不在手里。' };
    const target = assetOf(card.target);
    if (!target) return { ok: false, why: '这张牌没有可用目标，先换一张。' };
    if (target.level !== card.tier) return { ok: false, why: '指令级别与目标级别不匹配。' };
    if (s.ap < 2) return { ok: false, why: '这一天已经没有力气出门了。' };
    return { ok: true, why: pathOf(card.pathId).verb + target.name };
  }

  const BOOST_COST = 20, BOOST_VAL = 3;
  const CHIP_PER = 2, CHIP_CAP = 5;      // 每 2 枚芯片换 +1 判定，最多 +5

  function fold(s, uid, useBoost, chipSpend) {
    const card = s.hand.find((c) => c.uid === uid);
    if (!card) return { ok: false, why: '牌不在手里。' };
    const gate = canFold(s, card);
    if (!gate.ok) return gate;

    let boost = 0;
    if (useBoost) {
      if (s.money < BOOST_COST) return { ok: false, why: '加注需要 ' + BOOST_COST + ' 信用点。' };
      s.money -= BOOST_COST;
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
    const boostDesc = [];
    if (useBoost) boostDesc.push('现金加注 +' + BOOST_VAL);
    if (chipsUsed) boostDesc.push('投入 ' + (chipsUsed * CHIP_PER) + ' 芯片 +' + chipsUsed);
    res.lines.push('掷出 ' + out.r + '，判定线 ' + out.dc + '（成功率 ' + Math.round(successRate(s, card, boost) * 100) + '%）' + (boostDesc.length ? '，' + boostDesc.join('、') : '') + '。');

    if (out.pass) {
      res.lines.push(path.verb + '「' + target.name + '」成功。');
      const rw = path.reward;
      const mul = out.crit ? 1.8 : (0.85 + Math.random() * 0.3);
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

      if (s.deck.length && s.hand.length < 5) {
        const nc = s.deck.shift();
        nc.target = pickTarget(s, nc);
        s.hand.push(nc);
      }
      if (s.folded % 2 === 0) {
        s.chips += 3;
        s.apMax = Math.min(6, C.apPerDay + Math.floor(s.folded / 4));
        res.lines.push('董事会追加授权：+3 芯片。');
      }
      if (s.folded >= C.deckGoal) res.lines.push('十二张牌，全部折断。');
    } else {
      res.lines.push(path.verb + '「' + target.name + '」失败。');
      s.stats.vitality = clamp(s.stats.vitality - 1, 0, C.statCap);
      if (card.tier >= 2) s.tracks.sin = clamp(s.tracks.sin + 1, 0, C.trackCap);
      const loss = Math.min(s.money, 8 + card.tier * 4);
      s.money -= loss;
      res.lines.push('体魄 -1，罪痕 +1，善后花掉 ' + loss + ' 信用点。');
      if (out.fumble) {
        s.tracks.loyalty = clamp(s.tracks.loyalty - 1, 0, C.trackCap);
        res.lines.push('崩盘：现场留证，忠诚 -1。');
      }
      if (s.origin.id === 'ghost' && Math.random() < 0.6) {
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
    D.TRACKS.forEach((k) => {
      if (t[k.id]) parts.push(k.name + (t[k.id] > 0 ? ' +' : ' ') + t[k.id]);
    });
    return parts.join('，');
  }

  function label(c) {
    const p = pathOf(c.pathId), t = tierOf(c.tier);
    return t.name + '·' + p.name;
  }

  /* ---------------- 每日行动 ---------------- */
  function doAction(s, actionId) {
    const a = D.ACTIONS.find((x) => x.id === actionId);
    if (!a) return { ok: false, why: '没有这个行动。' };
    let cost = a.cost;
    if (s.origin.id === 'ghost' && actionId === 'intel') cost = 1;
    if (s.ap < cost) return { ok: false, why: '行动点不够。' };
    s.ap -= cost;

    const mult = s.origin.id === 'fixer' && (actionId === 'intel' || actionId === 'social') ? 2 : 1;
    const lines = [];
    const r = a.run;

    if (r.money) {
      let g = Array.isArray(r.money) ? r.money[0] + rnd(r.money[1] - r.money[0] + 1) : r.money;
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
    if (r.deal) {
      if (s.intel >= 3) { s.intel -= 3; s.chips += 3; lines.push('用 3 情报换来 3 枚指令芯片。'); }
      else if (s.money >= 25) { s.money -= 25; s.intel += 4; lines.push('花 25 信用点买到 4 份情报。'); }
      else lines.push('你手上既没有情报也没有现金，黑市的人礼貌地请你出去。');
    }
    if (actionId === 'clean') {
      const c = 45;
      s.dailyUsed = s.dailyUsed || {};
      if (s.dailyUsed.clean) {
        s.ap += cost;   // 退还行动点
        return { ok: false, why: '一天只能善后一次，监事会盯得紧。' };
      }
      if (s.money < c) {
        s.ap += cost;
        return { ok: false, why: '善后需要 ' + c + ' 信用点，你拿不出来。' };
      }
      s.money -= c;
      s.dailyUsed.clean = true;
      s.tracks.sin = Math.max(0, s.tracks.sin - 1);
      lines.push('花掉 ' + c + ' 信用点买通关系，罪痕 -1。这一天不能再做第二次。');
    }
    if (actionId === 'brief' && s.origin.id === 'clerk') {
      addTracks(s, { loyalty: 1 });
      lines.push('合规部资历：忠诚额外 +1。');
    }
    pushLog(s, 'info', a.name + '：' + lines.join(' '));
    return { ok: true, lines: lines, ap: s.ap };
  }

  function fieldOp(s) {
    const r = rnd(100);
    if (r < 45) { const m = 15 + rnd(35); s.money += m; return '你在城南收了一笔外账，+' + m + ' 信用点。'; }
    if (r < 70) { const g = 1 + rnd(3); s.intel += g; return '你顺着一条货运线摸到名录，+' + g + ' 情报。'; }
    if (r < 88) { const c = 1 + rnd(3); s.chips += c; return '你在废弃仓里拆到还能用的部件，+' + c + ' 芯片。'; }
    s.stats.vitality = clamp(s.stats.vitality - 1, 0, C.statCap);
    const m = 20 + rnd(30); s.money += m;
    return '出门遇到伏击，你带着伤和 ' + m + ' 信用点回来。体魄 -1。';
  }

  /* ---------------- 换牌 ---------------- */
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

  /* ---------------- 回合推进 ---------------- */
  function endDay(s) {
    s.day += 1;
    s.deadline -= 1;
    s.ap = s.apMax;
    s.dailyUsed = {};

    if (s.money > 0) s.money -= Math.min(s.money, 4 + s.folded * 2);

    if (s.tracks.sin >= 4 && Math.random() < 0.65) {
      s.tracks.sin -= 1;
    }
    if (s.tracks.sin >= 8 && Math.random() < 0.4) {
      s.tracks.loyalty = clamp(s.tracks.loyalty - 1, 0, C.trackCap);
      s.intel = Math.max(0, s.intel - 2);
      pushLog(s, 'bad', '监事会开始查你。忠诚 -1，情报 -2。');
    }
    if (s.tracks.loyalty > 0 && s.tracks.loyalty < C.trackCap) {
      s.tracks.loyalty = clamp(s.tracks.loyalty + 1, 0, C.trackCap);
    }
    s.hand.forEach((c) => { c.target = pickTarget(s, c); });

    if (s.deadline <= 0) {
      pushLog(s, 'bad', '期限归零。会客室的门在你身后关上了。');
      s.ending = endingById('broken');
      s.phase = 'end';
      return { ok: true, dead: true };
    }

    const ev = pickEvent();
    s.pendingEvent = ev;
    s.phase = 'event';
    pushLog(s, 'day', '第 ' + s.day + ' 天。剩余期限 ' + s.deadline + ' 天。');
    return { ok: true, event: ev };
  }

  let eventBag = [];
  function pickEvent() {
    if (eventBag.length === 0) eventBag = shuffle(D.EVENTS.map((e, i) => i));
    const e = D.EVENTS[eventBag.pop()];
    return {
      id: e.id, title: e.title, text: e.text, options: e.options,
      portrait: e.portrait || null, district: e.district || null,
    };
  }

  function resolveEvent(s, optIdx) {
    const ev = s.pendingEvent;
    if (!ev) return { ok: false };
    const opt = ev.options[optIdx];
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
    return { ok: true, lines: lines };
  }

  function applyEffect(s, eff, lines) {
    if (!eff) return;
    // 顶层直接写名望键（如 sin / loyalty）也统一并入 track
    const bare = {};
    Object.keys(eff).forEach((k) => {
      if (D.TRACKS.some((t) => t.id === k)) { bare[k] = eff[k]; }
    });
    if (Object.keys(bare).length) {
      const merged = Object.assign({}, bare, eff.track || {});
      eff = Object.assign({}, eff, { track: merged });
    }
    if (eff.money) { s.money = Math.max(0, s.money + eff.money); lines.push('信用点 ' + (eff.money > 0 ? '+' : '') + eff.money + '。'); }
    if (eff.intel) { s.intel = Math.max(0, s.intel + eff.intel); lines.push('情报 ' + (eff.intel > 0 ? '+' : '') + eff.intel + '。'); }
    if (eff.chips) { s.chips = Math.max(0, s.chips + eff.chips); lines.push('芯片 ' + (eff.chips > 0 ? '+' : '') + eff.chips + '。'); }
    if (eff.vitality) { s.stats.vitality = clamp(s.stats.vitality + eff.vitality, 0, C.statCap); lines.push('体魄 ' + eff.vitality + '。'); }
    if (eff.gear) { s.gear += eff.gear; lines.push('装备 +' + eff.gear + '。'); }
    if (eff.resetDeadline) { s.deadline = C.deadlineDays; lines.push('期限重置为 7 天。'); }
    if (eff.statRandom) {
      const k = pick(D.STATS).id;
      s.stats[k] = clamp(s.stats[k] + eff.statRandom, 0, C.statCap);
      lines.push(statName(k) + ' +' + eff.statRandom + '。');
    }
    if (eff.track) { addTracks(s, eff.track); if (trackLine(eff.track)) lines.push(trackLine(eff.track) + '。'); }
  }

  /* ---------------- 终局 ---------------- */
  function checkEnd(s) {
    if (s.tracks.loyalty <= 0) { s.ending = endingById('broken'); s.phase = 'end'; return; }
    if (s.tracks.sin >= C.trackCap) { s.ending = endingById('purged'); s.phase = 'end'; return; }
    if (s.folded >= C.deckGoal) { s.ending = pickEnding(s); s.phase = 'end'; }
  }

  function pickEnding(s) {
    for (let i = 0; i < D.ENDINGS.length; i++) if (D.ENDINGS[i].cond(s)) return D.ENDINGS[i];
    return D.ENDINGS[D.ENDINGS.length - 1];
  }
  function endingById(id) { return D.ENDINGS.find((e) => e.id === id) || D.ENDINGS[D.ENDINGS.length - 1]; }

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
    if (s.log.length > 60) s.log.pop();
  }

  window.GAME_ENGINE = {
    newGame, fold, doAction, swapCard, endDay, resolveEvent, buyShop,
    pathOf, tierOf, assetOf, label, checkDC, successRate, canFold, trackLine, checkEnd,
    BOOST_COST, BOOST_VAL, CHIP_PER, CHIP_CAP,
  };
})();
