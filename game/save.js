/* 局内存档：把当前这一局原样存下来，下次打开还能接着玩。 */
(function () {
  'use strict';
  const D = window.GAME_DATA;
  const C = D.CONFIG;

  /* 跨局档案用 sdd.profile.v1，这里必须另起一个 key。
     两件事的生命周期完全不同：档案要跟人一辈子，这一局只活七天，
     混在一起就会出现「清掉存档把命运点也清了」这种事故。 */
  const KEY = 'sdd.run.v1';
  const LOG_KEEP = 60;      // 日志只回溯这么多条，再多存档会被撑大
  const MAX_DEPTH = 12;     // 快照最大深度，防止恶意/意外深链拖死序列化

  /* ==========================================================
     一、快照生成
     状态里混了三类不能直接 JSON 化的东西：
       1) 带方法的对象（s.rng）—— JSON 只留下数据字段，方法全丢
       2) 数据表引用（s.origin / s.ending）—— 存下来会变成一份死副本，
          以后改数据表也追不回来，所以只存 id
       3) 意外混进来的函数、undefined、循环引用 —— 序列化要么丢字段要么抛错
     所以先自己做一次深度克隆，把不能存的东西在进 JSON 之前就摘掉。
     宁可少存一个字段，也不能让存档抛出去——抛一次，玩家这七天就没了。
     ========================================================== */
  function isPlainObject(v) {
    if (!v || typeof v !== 'object') return false;
    const proto = Object.getPrototypeOf(v);
    return proto === Object.prototype || proto === null;
  }

  /* 返回 undefined 表示「这个值不要存」，调用方负责跳过该键 */
  function clone(v, ancestors, depth) {
    if (v === null) return null;
    const t = typeof v;
    if (t === 'number') return isFinite(v) ? v : 0;      // NaN / Infinity 存不回来，归零
    if (t === 'string' || t === 'boolean') return v;
    /* undefined / function / symbol / bigint 全部跳过 */
    if (t !== 'object') return undefined;
    if (depth > MAX_DEPTH) return undefined;
    /* 祖先链检测循环引用：命中就断开这一支，不建环 */
    if (ancestors.indexOf(v) >= 0) return undefined;
    if (v instanceof Date) return v.toISOString();
    const anc = ancestors.concat([v]);
    if (Array.isArray(v)) {
      const out = [];
      for (let i = 0; i < v.length; i++) {
        const c = clone(v[i], anc, depth + 1);
        out.push(c === undefined ? null : c);            // 数组保长度，洞补 null
      }
      return out;
    }
    /* DOM 节点、Map、Set 这类非纯对象一律不存：存了也还原不回来 */
    if (!isPlainObject(v)) return undefined;
    const out = {};
    Object.keys(v).forEach((k) => {
      const c = clone(v[k], anc, depth + 1);
      if (c !== undefined) out[k] = c;
    });
    return out;
  }

  function encode(S) {
    const snap = clone(S, [], 0) || {};

    /* rng 是本局随机流，带一堆方法。只留种子文本与显示名，
       读回来用 create(seed) 重建——同一种子就是同一条序列，可复现。 */
    const seed = (S.rng && S.rng.seedText) || S.seed || null;
    const label = (S.rng && S.rng.label) || S.seedLabel || null;
    delete snap.rng;
    snap.__rng = { seed: seed, label: label };
    snap.seed = seed;
    snap.seedLabel = label;

    /* origin / ending 是数据表里的对象引用，只存 id，读回来查表 */
    snap.origin = S.origin ? S.origin.id : null;
    snap.ending = S.ending ? S.ending.id : null;

    /* 日志按天累积，保留太多存档会越来越大，只留最近的 */
    if (Array.isArray(snap.log)) snap.log = snap.log.slice(0, LOG_KEEP);
    if (Array.isArray(snap.dayLog)) snap.dayLog = snap.dayLog.slice(0, LOG_KEEP);
    if (Array.isArray(snap.cardLog)) snap.cardLog = snap.cardLog.slice(-40);

    return {
      version: C.version,                 // 与跨局档案无关，跟着游戏数据版本走
      at: new Date().toISOString(),
      state: snap,
    };
  }

  function decode(pack) {
    if (!pack || typeof pack !== 'object') return null;
    if (pack.version !== C.version) return null;
    const S = pack.state;
    if (!S || typeof S !== 'object') return null;

    /* 随机流还原 */
    const info = S.__rng || {};
    const seed = info.seed || S.seed || null;
    delete S.__rng;
    S.seed = seed;
    S.seedLabel = info.label || S.seedLabel || seed;
    /* seed 为空时 create 会退回系统随机，好歹能把局开起来 */
    S.rng = window.GAME_RNG.create(seed, info.label || null);

    /* 数据表引用还原：id 找不到就退回默认值，不让 undefined 流进引擎 */
    S.origin = (D.ORIGINS || []).find((o) => o.id === S.origin) || (D.ORIGINS || [])[0] || null;
    S.ending = S.ending ? ((D.ENDINGS || []).find((e) => e.id === S.ending) || null) : null;

    /* 老版本留下的字段可能不全，补齐形状，避免下游 .forEach 直接炸 */
    if (!S.stats || typeof S.stats !== 'object') S.stats = {};
    if (!S.tracks || typeof S.tracks !== 'object') S.tracks = {};
    if (!Array.isArray(S.hand)) S.hand = [];
    if (!Array.isArray(S.deck)) S.deck = [];
    if (!Array.isArray(S.log)) S.log = [];
    if (!Array.isArray(S.dayLog)) S.dayLog = [];
    if (!Array.isArray(S.briefs)) S.briefs = [];
    if (!Array.isArray(S.briefSeen)) S.briefSeen = [];
    if (!S.dailyUsed || typeof S.dailyUsed !== 'object') S.dailyUsed = {};
    if (!S.metNpcs || typeof S.metNpcs !== 'object') S.metNpcs = {};
    if (!S.pathFoldCount || typeof S.pathFoldCount !== 'object') S.pathFoldCount = {};
    if (!S.briefDistrictHits || typeof S.briefDistrictHits !== 'object') S.briefDistrictHits = {};
    if (!S.relations || typeof S.relations !== 'object') S.relations = {};
    if (typeof S.phase !== 'string') S.phase = 'play';
    if (typeof S.day !== 'number' || !isFinite(S.day)) S.day = 1;
    if (typeof S.phase === 'string' && S.phase !== 'play' && S.phase !== 'event' && S.phase !== 'end') S.phase = 'play';
    if (S.phase === 'end' && !S.ending) S.phase = 'play';   // 没结局的 end 状态走不下去
    return S;
  }

  /* ==========================================================
     二、localStorage 包一层
     隐私模式下 getItem/setItem 都可能直接抛，配额满了 setItem 也抛。
     所有读写都在这里消化掉，绝不让异常冒到调用方。
     ========================================================== */
  function rawGet() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function rawSet(txt) {
    try { localStorage.setItem(KEY, txt); return true; } catch (e) { return false; }
  }
  function rawDel() {
    try { localStorage.removeItem(KEY); } catch (e) { /* 隐私模式忽略 */ }
  }

  /* 统一读取入口：坏 JSON、旧版本一律当没有，并把脏档删掉，
     免得每次进游戏都拿一份读不懂的东西反复失败。 */
  function readPack() {
    const raw = rawGet();
    if (!raw) return null;
    let pack = null;
    try { pack = JSON.parse(raw); } catch (e) { pack = null; }
    if (!pack || typeof pack !== 'object' || !pack.state) { rawDel(); return null; }
    if (pack.version !== C.version) { rawDel(); return null; }
    return pack;
  }

  /* ==========================================================
     三、对外接口
     ========================================================== */
  function canSave(S) {
    if (!S || typeof S !== 'object') return { ok: false, why: '没有进行中的这一局。' };
    if (!S.origin) return { ok: false, why: '这一局还没开局。' };
    if (S.phase === 'end' || S.ending) return { ok: false, why: '这一局已经收场了，不用存。' };
    return { ok: true };
  }

  function save(S) {
    const ok = canSave(S);
    if (!ok.ok) return { ok: false, why: ok.why };
    try {
      if (!rawSet(JSON.stringify(encode(S)))) {
        return { ok: false, why: '浏览器不让写本地存储（可能是隐私模式或空间已满）。' };
      }
      return { ok: true };
    } catch (e) {
      return { ok: false, why: '存档写入失败。' };
    }
  }

  function load() {
    try {
      const pack = readPack();
      if (!pack) return null;
      const S = decode(pack);
      if (!S) { rawDel(); return null; }
      return S;
    } catch (e) {
      return null;
    }
  }

  function clear() { rawDel(); }

  /* 摘要：只解析一层外层，不还原整局，给「继续上一局」按钮用。
     按钮要的只是几个数字，没必要把整局 rebuild 一遍。 */
  function meta() {
    try {
      const pack = readPack();
      if (!pack) return null;
      const st = pack.state || {};
      const o = (D.ORIGINS || []).find((x) => x.id === st.origin) || null;
      const e = st.ending ? ((D.ENDINGS || []).find((x) => x.id === st.ending) || null) : null;
      return {
        day: Number(st.day) || 0,
        folded: Number(st.folded) || 0,
        origin: o ? o.name : (st.origin || ''),
        originId: st.origin || null,
        endingName: e ? e.name : '',
        savedAt: pack.at || '',
        version: pack.version,
      };
    } catch (e) {
      return null;
    }
  }

  function peek() {
    const m = meta();
    if (!m) return null;
    try {
      const pack = readPack();
      const st = (pack && pack.state) || {};
      return {
        day: m.day,
        folded: m.folded,
        origin: m.origin,
        originId: m.originId,
        endingName: m.endingName,
        savedAt: m.savedAt,
        version: m.version,
        seedLabel: st.seedLabel || st.seed || '',
        phase: st.phase || 'play',
        deadline: Number(st.deadline) || 0,
        hand: Array.isArray(st.hand) ? st.hand.length : 0,
        deck: Array.isArray(st.deck) ? st.deck.length : 0,
      };
    } catch (e) {
      return m;   // 详细字段读不出来也不能让按钮没得显示
    }
  }

  window.GAME_SAVE = {
    KEY,
    canSave,
    save,
    load,
    clear,
    peek,
    meta,
  };
})();
