/* ==========================================================
   《七日指令》委托与通牒系统
   第二条压力线：除了你自己的十二张牌，别人也会给你派活。
   委托有硬期限，超期要付代价。它们挂在城区上，不进手牌。
   ========================================================== */
(function () {
  'use strict';
  const D = window.GAME_DATA;

  const MAX_ACTIVE = 3;
  const SPAWN_BASE = 0.62;      // 每天出现新委托的基础概率
  const SPAWN_RAMP = 0.04;      // 每过一天上升

  /* ---------------- 取内容库 ---------------- */
  function pool() {
    const p = Array.isArray(window.BRIEFS) ? window.BRIEFS : [];
    return p.filter((b) => b && b.id && b.kind && b.solve);
  }

  /* ---------------- 数值效果 ---------------- */
  function applyEffect(S, eff, lines) {
    if (!eff) return;
    if (eff.money) { S.money = Math.max(0, S.money + eff.money); lines.push('信用点 ' + (eff.money > 0 ? '+' : '') + eff.money + '。'); }
    if (eff.intel) { S.intel = Math.max(0, S.intel + eff.intel); lines.push('情报 ' + (eff.intel > 0 ? '+' : '') + eff.intel + '。'); }
    if (eff.chips) { S.chips = Math.max(0, S.chips + eff.chips); lines.push('芯片 ' + (eff.chips > 0 ? '+' : '') + eff.chips + '。'); }
    if (eff.gear) { S.gear = Math.max(0, S.gear + eff.gear); lines.push('装备 ' + (eff.gear > 0 ? '+' : '') + eff.gear + '。'); }
    if (eff.vitality) { S.stats.vitality = Math.max(0, Math.min(D.CONFIG.statCap, S.stats.vitality + eff.vitality)); lines.push('体魄 ' + eff.vitality + '。'); }
    if (eff.resetDeadline) { S.deadline = D.CONFIG.deadlineDays; lines.push('期限重置为 7 天。'); }
    if (eff.track) {
      const parts = [];
      D.TRACKS.forEach((t) => {
        if (eff.track[t.id]) {
          S.tracks[t.id] = Math.max(0, Math.min(D.CONFIG.trackCap, S.tracks[t.id] + eff.track[t.id]));
          parts.push(t.name + (eff.track[t.id] > 0 ? ' +' : ' ') + eff.track[t.id]);
        }
      });
      if (parts.length) lines.push(parts.join('，') + '。');
    }
  }

  /* ---------------- 生成一条新委托 ----------------
     规则：只有你认识的人才会给你派活。
     没见过的 NPC 不进候选池 —— 不会一上来就是个陌生人派任务。
  ------------------------------------------------ */
  function spawn(S, forceKind) {
    const all = pool();
    if (!all.length) return null;
    const active = S.briefs || [];
    if (active.length >= MAX_ACTIVE) return null;

    const usedIds = {};
    active.forEach((b) => { usedIds[b.briefId] = 1; });
    (S.briefSeen || []).forEach((id) => { usedIds[id] = 1; });

    // 只保留认识的人发来的委托
    const met = S.metNpcs || {};
    const known = all.filter((b) => met[b.npc]);
    // 开局前三天如果熟人还不够，先由已有的熟人补齐
    if (!known.length) return null;

    let cands = known.filter((b) => !usedIds[b.id]);
    if (!cands.length) { S.briefSeen = []; cands = known.slice(); }   // 用完了就重新洗一轮
    if (forceKind) {
      const f = cands.filter((b) => b.kind === forceKind);
      if (f.length) cands = f;
    }

    // 第 1 天不放血腥类与陷阱类，给玩家一点缓冲
    if (S.day <= 1) {
      const soft = cands.filter((b) => b.kind !== 'blood' && b.kind !== 'trap');
      if (soft.length) cands = soft;
    }

    const rng = S.rng || window.GAME_RNG.create(String(Date.now()));
    const def = rng.pick(cands);
    const brief = {
      uid: 'br' + (S.briefCounter = (S.briefCounter || 0) + 1),
      briefId: def.id,
      kind: def.kind,
      npc: def.npc,
      district: def.district,
      title: def.title,
      text: def.text,
      days: def.days,
      left: def.days,
      solve: def.solve,
      onSolve: def.onSolve,
      onExpire: def.onExpire,
      onRefuse: def.onRefuse || null,
      refuseLabel: def.refuseLabel || '回绝',
      issuedDay: S.day,
    };
    S.briefs.push(brief);
    S.briefSeen = S.briefSeen || [];
    S.briefSeen.push(def.id);
    if (S.briefSeen.length > 40) S.briefSeen.shift();
    S.log.unshift({ kind: 'brief', day: S.day, text: '新委托 · ' + def.title + '（' + brief.left + ' 天内）' });
    if (S.log.length > 80) S.log.pop();
    return brief;
  }

  /* ---------------- 今日是否会来新委托 ---------------- */
  function maybeSpawn(S) {
    const rng = S.rng;
    if (!rng) return null;
    const active = (S.briefs || []).length;
    if (active >= MAX_ACTIVE) return null;
    const p = Math.min(0.92, SPAWN_BASE + (S.day - 1) * SPAWN_RAMP) * (active === 0 ? 1.25 : 1);
    if (!rng.chance(p)) return null;
    let kind = null;
    // 每四天左右来一次血腥要求，让压力有节奏
    if (S.day >= 3 && S.day % 4 === 0 && !(S.briefs || []).some((b) => b.kind === 'blood')) kind = 'blood';
    return spawn(S, kind);
  }

  /* ---------------- 完成条件判定 ---------------- */
  function canSolve(S, b, opt) {
    const sv = b.solve;
    if (!sv) return { ok: false, why: '这条委托没有可执行的方式。' };
    if (sv.type === 'resource') {
      const need = sv.need || {};
      const lack = [];
      Object.keys(need).forEach((k) => {
        const have = k === 'money' ? S.money : k === 'intel' ? S.intel : k === 'chips' ? S.chips : k === 'gear' ? S.gear : 0;
        if (have < need[k]) lack.push(resName(k) + ' 还差 ' + (need[k] - have));
      });
      if (lack.length) return { ok: false, why: lack.join('，') + '。' };
      return { ok: true };
    }
    if (sv.type === 'stat') {
      const dc = sv.dc || 12;
      const val = S.stats[sv.stat] || 0;
      const rate = Math.max(0.05, Math.min(0.95, (21 - Math.max(3, dc - val)) / 20));
      return { ok: true, why: '判定 ' + statName(sv.stat) + '，成功率约 ' + Math.round(rate * 100) + '%' };
    }
    if (sv.type === 'district') {
      // 需要把一张牌投到指定城区（本局是否已经投过）
      const done = (S.briefDistrictHits || {})[sv.district];
      if (!done) {
        const dist = (D.DISTRICTS || []).find((d) => d.id === sv.district);
        return { ok: false, why: '先把一张指令卡投到' + (dist ? dist.name : sv.district) + '。' };
      }
      return { ok: true };
    }
    if (sv.type === 'fold') {
      const n = (S.pathFoldCount || {})[sv.path] || 0;
      const need = sv.need || 1;
      if (n < need) {
        const p = (D.PATHS || []).find((x) => x.id === sv.path);
        return { ok: false, why: '还要再折 ' + (need - n) + ' 张' + (p ? p.name : sv.path) + '类指令。' };
      }
      return { ok: true };
    }
    return { ok: false, why: '未知的完成方式。' };
  }

  function resName(k) {
    return { money: '信用点', intel: '情报', chips: '芯片', gear: '装备' }[k] || k;
  }
  function statName(k) {
    const s = (D.STATS || []).find((x) => x.id === k);
    return s ? s.name : k;
  }

  /* ---------------- 执行完成 ---------------- */
  function solve(S, uid) {
    const idx = (S.briefs || []).findIndex((b) => b.uid === uid);
    if (idx < 0) return { ok: false, why: '这条委托已经不在了。' };
    const b = S.briefs[idx];
    const gate = canSolve(S, b);
    if (!gate.ok) return { ok: false, why: gate.why };

    const lines = [];
    const sv = b.solve;

    if (sv.type === 'resource') {
      const need = sv.need || {};
      Object.keys(need).forEach((k) => {
        if (k === 'money') S.money -= need[k];
        else if (k === 'intel') S.intel -= need[k];
        else if (k === 'chips') S.chips -= need[k];
        else if (k === 'gear') S.gear -= need[k];
        lines.push('交出 ' + resName(k) + ' ' + need[k] + '。');
      });
    } else if (sv.type === 'stat') {
      const rng = S.rng || window.GAME_RNG.create(String(Date.now()));
      const dc = sv.dc || 12;
      const r = 1 + rng.int(20);
      const pass = r >= dc || r === 20;
      lines.push('掷出 ' + r + '，判定线 ' + dc + '。' + (pass ? '办妥了。' : '没办成。'));
      if (!pass) {
        // 失败 = 超期代价，但委托仍算清掉
        applyEffect(S, b.onExpire, lines);
        S.briefs.splice(idx, 1);
        S.log.unshift({ kind: 'bad', day: S.day, text: '委托失败 · ' + b.title });
        return { ok: true, pass: false, lines: lines, brief: b };
      }
    } else if (sv.type === 'district') {
      S.briefDistrictHits[sv.district] = 0;   // 消耗掉
      lines.push('你在' + ((D.DISTRICTS || []).find((d) => d.id === sv.district) || {}).name + '把事办了。');
    } else if (sv.type === 'fold') {
      const n = sv.need || 1;
      S.pathFoldCount[sv.path] -= n;
      lines.push('你交出了 ' + n + ' 张成绩单。');
    }

    applyEffect(S, b.onSolve, lines);
    S.briefs.splice(idx, 1);
    S.briefDone = (S.briefDone || 0) + 1;
    S.fortune += 1 + b.days;
    lines.push('命运点 +' + (1 + b.days) + '。');
    S.log.unshift({ kind: 'good', day: S.day, text: '委托完成 · ' + b.title });
    return { ok: true, pass: true, lines: lines, brief: b };
  }

  /* ---------------- 主动回绝 ---------------- */
  function refuse(S, uid) {
    const idx = (S.briefs || []).findIndex((b) => b.uid === uid);
    if (idx < 0) return { ok: false, why: '这条委托已经不在了。' };
    const b = S.briefs[idx];
    const lines = [];
    applyEffect(S, b.onRefuse || b.onExpire, lines);
    if (!lines.length) lines.push('你什么也没说，对方记住了。');
    S.briefs.splice(idx, 1);
    S.briefRefused = (S.briefRefused || 0) + 1;
    S.log.unshift({ kind: 'bad', day: S.day, text: '委托回绝 · ' + b.title });
    return { ok: true, lines: lines, brief: b };
  }

  /* ---------------- 每日推进：倒计时与超期 ---------------- */
  function tick(S) {
    const expired = [];
    (S.briefs || []).forEach((b) => { b.left -= 1; });
    for (let i = (S.briefs || []).length - 1; i >= 0; i--) {
      const b = S.briefs[i];
      if (b.left > 0) continue;
      const lines = [];
      applyEffect(S, b.onExpire, lines);
      expired.push({ brief: b, lines: lines });
      S.log.unshift({ kind: 'bad', day: S.day, text: '委托超期 · ' + b.title });
      S.briefs.splice(i, 1);
      S.briefExpired = (S.briefExpired || 0) + 1;
    }
    return expired;
  }

  /* ---------------- 供地图使用的汇总 ---------------- */
  function byDistrict(S) {
    const map = {};
    (S.briefs || []).forEach((b) => {
      (map[b.district] = map[b.district] || []).push(b);
    });
    return map;
  }

  function urgentCount(S) {
    return (S.briefs || []).filter((b) => b.left <= 1).length;
  }

  const KIND = {
    demand: { name: '事务要求', color: '#7aa2f7', mark: '◆' },
    summon: { name: '高层传唤', color: '#e0b44a', mark: '⬢' },
    blood: { name: '血腥要求', color: '#e0554a', mark: '✕' },
    favor: { name: '人情托付', color: '#5fd08a', mark: '♡' },
    trap: { name: '试探', color: '#c86bd8', mark: '◎' },
  };

  window.GAME_BRIEFS = { spawn, maybeSpawn, canSolve, solve, refuse, tick, byDistrict, urgentCount, applyEffect, KIND, MAX_ACTIVE, pool };
})();
