/* ==========================================================
   《七日指令》故事引擎
   1) 五幕主线：折牌数推进，引导者一路带着走
   2) NPC 关系值与个人支线：每人三幕（相识 / 交情 / 分晓）
   3) 委托只从认识的人那里来
   场景以「主线」身份占用当天的日程，优先于随机事件。
   ========================================================== */
(function () {
  'use strict';
  const D = window.GAME_DATA;
  const E = window.GAME_ENGINE;

  /* ---------------- 引导者 ---------------- */
  const GUIDE = 'su-wen';   // 苏纹，董事会日程官。她给你发牌，也给你收尸。

  /* ---------------- 五幕定义 ---------------- */
  const ACTS = [
    { n: 1, key: 'deal',   name: '发牌', from: 0,  to: 2,
      hook: '你被点名，替董事会玩这一局。' },
    { n: 2, key: 'seat',   name: '上桌', from: 3,  to: 5,
      hook: '你活过了第一个七天，董事会开始真正看你。' },
    { n: 3, key: 'shuffle',name: '洗牌', from: 6,  to: 8,
      hook: '监事会介入了。有人开始查你，也查到了她。' },
    { n: 4, key: 'hole',   name: '底牌', from: 9,  to: 11,
      hook: '穹顶的接缝在响。你手里第一次有了能反打的东西。' },
    { n: 5, key: 'showdown', name: '摊牌', from: 12, to: 99,
      hook: '十二张牌全部折下。现在轮到你决定这局怎么结束。' },
  ];

  const actOf = (folded) => ACTS.find((a) => folded >= a.from && folded <= a.to) || ACTS[ACTS.length - 1];

  /* ---------------- 关系值 ---------------- */
  function rel(S, npcId) {
    if (!S.relations) S.relations = {};
    return Number(S.relations[npcId]) || 0;
  }
  function addRel(S, npcId, v) {
    if (!S.relations) S.relations = {};
    if (!npcId) return 0;
    S.relations[npcId] = Math.max(0, Math.min(10, rel(S, npcId) + (v || 0)));
    return S.relations[npcId];
  }
  const relTier = (v) => (v >= 8 ? 'high' : v >= 4 ? 'mid' : 'low');

  function isMet(S, npcId) {
    if (!npcId) return false;
    if (S.metNpcs && S.metNpcs[npcId]) return true;
    return false;
  }
  function markMet(S, npcId) {
    if (!npcId) return;
    S.metNpcs = S.metNpcs || {};
    S.metNpcs[npcId] = (S.metNpcs[npcId] || 0) + 1;
  }

  /* ---------------- 场景池 ---------------- */
  function mainScenes() { return Array.isArray(window.STORY_MAIN) ? window.STORY_MAIN : []; }
  function npcScenes() {
    const out = [];
    if (Array.isArray(window.STORY_NPC_A)) out.push(...window.STORY_NPC_A);
    if (Array.isArray(window.STORY_NPC_B)) out.push(...window.STORY_NPC_B);
    return out;
  }
  function allScenes() { return mainScenes().concat(npcScenes()); }

  const fired = (S, id) => !!(S.storyFired && S.storyFired[id]);

  /* ---------------- 条件求值 ---------------- */
  function condOk(S, when) {
    if (!when) return true;
    if (when.act && actOf(S.folded).n !== when.act) return false;
    if (when.minFolded != null && S.folded < when.minFolded) return false;
    if (when.maxFolded != null && S.folded > when.maxFolded) return false;
    if (when.minDay != null && S.day < when.minDay) return false;
    if (when.minRel != null && rel(S, when.npc) < when.minRel) return false;
    if (when.flag && !(S.storyFlags && S.storyFlags[when.flag])) return false;
    if (when.notFlag && S.storyFlags && S.storyFlags[when.notFlag]) return false;
    if (when.met && !isMet(S, when.met)) return false;
    return true;
  }

  /* ---------------- 初见：把十六次初识排进前六天 ----------------
     玩家必须先认识人，委托和支线才有来源。
     所以初识不走随机事件池，而是按顺序定时出现。
  ------------------------------------------------------------ */
  function meetScenes() {
    const src = D.EVENTS.filter((e) => String(e.title || '').indexOf('初见') === 0);
    return src.map((e, i) => ({
      id: 'meet-' + e.id,
      meet: true,
      npc: null,                 // npc 由引擎的 npcIdOf 反查，这里留空
      eventId: e.id,
      district: e.district,
      portrait: e.portrait,
      title: e.title,
      text: e.text,
      options: e.options,
      // 第 1 天出两条，之后每天两条，最多排到第 8 天
      minDay: Math.min(8, 1 + Math.floor(i / 2)),
      order: i,
    }));
  }

  /* ---------------- 选下一个故事场景 ----------------
     优先级：主线 > 初见 > NPC 支线。同一时刻只推一个。
  ------------------------------------------------ */
  function nextScene(S) {
    if (!S) return null;

    // 1) 主线按幕推进
    const act = actOf(S.folded).n;
    const mains = mainScenes()
      .filter((sc) => !fired(S, sc.id))
      .filter((sc) => (sc.act || 0) <= act)
      .filter((sc) => condOk(S, sc.when));
    if (mains.length) {
      mains.sort((a, b) => (a.order || 0) - (b.order || 0));
      return decorate(S, mains[0], 'main');
    }

    // 2) 初见：到日子就出，保证玩家前八天认识足够多的人
    const meets = meetScenes()
      .filter((sc) => !fired(S, sc.id))
      .filter((sc) => S.day >= sc.minDay)
      .filter((sc) => {
        // 已经认识的人不再重复初见
        const e = D.EVENTS.find((x) => x.id === sc.eventId);
        const id = e && E.npcIdOf ? E.npcIdOf(e) : null;
        return !(id && isMet(S, id));
      });
    if (meets.length) {
      meets.sort((a, b) => a.order - b.order);
      return decorate(S, meets[0], 'meet');
    }

    // 3) NPC 支线：按 stage 从小到大，先出早的
    const npc = npcScenes()
      .filter((sc) => !fired(S, sc.id))
      .filter((sc) => isMet(S, sc.npc))
      .filter((sc) => {
        if (sc.stage > 1) {
          const prev = npcScenes().find((x) => x.npc === sc.npc && x.stage === sc.stage - 1);
          if (prev && !fired(S, prev.id)) return false;
        }
        return true;
      })
      .filter((sc) => condOk(S, Object.assign({ npc: sc.npc }, sc.when || {})));
    if (npc.length) {
      npc.sort((a, b) => (a.stage - b.stage) || ((a.pri || 0) - (b.pri || 0)));
      return decorate(S, npc[0], 'line');
    }
    return null;
  }

  function decorate(S, sc, kind) {
    const npcId = sc.npc || (kind === 'main' ? GUIDE : null);
    const info = E.npcOf ? E.npcOf(npcId) : null;
    // 初见场景的 npc 要当场反查，否则 resolve 阶段找不到是谁
    let meetNpc = null;
    if (sc.meet) {
      const e = D.EVENTS.find((x) => x.id === sc.eventId);
      meetNpc = e && E.npcIdOf ? E.npcIdOf(e) : null;
    }
    const finalNpc = npcId || meetNpc;
    const finalInfo = info || (finalNpc && E.npcOf ? E.npcOf(finalNpc) : null);
    return {
      story: true,
      kind: kind,                       // main | line | meet
      meet: !!sc.meet,
      eventId: sc.eventId || null,
      id: sc.id,
      npc: finalNpc,
      npcName: finalInfo ? finalInfo.name : (sc.npcName || ''),
      npcRole: finalInfo ? finalInfo.role : '',
      portrait: sc.portrait || (finalInfo ? finalInfo.portrait : null),
      district: sc.district || (finalInfo ? finalInfo.district : null),
      act: sc.act || actOf(S.folded).n,
      actName: actOf(S.folded).name,
      stage: sc.stage || 0,
      title: sc.title,
      text: sc.text,
      options: (sc.options || []).map((o) => Object.assign({}, o)),
    };
  }

  /* ---------------- 结算一个故事场景 ---------------- */
  function resolve(S, scene, optIdx) {
    if (!scene) return { ok: false };
    const opt = scene.options[optIdx];
    if (!opt) return { ok: false };

    const lines = [];
    // 效果统一交给引擎处理，story 只负责关系值与标记
    if (opt.run) E.applyEffectPublic(S, opt.run, lines);

    // 初见：把这个人登记进「认识」，并给一点初始关系值
    let meetNpc = null;
    if (scene.meet) {
      const e = D.EVENTS.find((x) => x.id === scene.eventId);
      meetNpc = e && E.npcIdOf ? E.npcIdOf(e) : null;
      if (meetNpc) {
        markMet(S, meetNpc);
        const info = E.npcOf(meetNpc);
        const before = rel(S, meetNpc);
        const after = addRel(S, meetNpc, opt.relation != null ? opt.relation : 1);
        lines.unshift('你认识了 ' + (info ? info.name : '一个人') +
          (info ? '（' + info.role + '）' : '') + '，关系 ' + after + '/10。');
      }
    }

    if (scene.npc && (opt.relation != null || !opt.run)) {
      const before = rel(S, scene.npc);
      const after = addRel(S, scene.npc, opt.relation != null ? opt.relation : 1);
      if (after !== before && scene.npcName) lines.push(scene.npcName + ' 对你的看法变了（关系 ' + before + ' → ' + after + '）。');
    }
    if (opt.flag) {
      S.storyFlags = S.storyFlags || {};
      S.storyFlags[opt.flag] = 1;
    }
    if (opt.mainFlag) {
      S.mainFlags = S.mainFlags || {};
      S.mainFlags[opt.mainFlag] = 1;
    }

    S.storyFired = S.storyFired || {};
    S.storyFired[scene.id] = 1;

    // 主线推进：记录走过的幕
    if (scene.kind === 'main') {
      S.storySeenActs = S.storySeenActs || {};
      S.storySeenActs[scene.act] = (S.storySeenActs[scene.act] || 0) + 1;
    }

    S.log.unshift({
      kind: 'story',
      day: S.day,
      text: (scene.kind === 'main' ? '主线 · '
        : scene.kind === 'meet' ? '初见 · '
        : (scene.npcName || '') + ' · ') + scene.title,
    });
    if (S.log.length > 80) S.log.pop();

    return { ok: true, lines: lines, scene: scene, opt: opt };
  }

  /* ---------------- 当前主线进度（给 UI 显示） ---------------- */
  function progress(S) {
    const act = actOf(S.folded);
    const idx = ACTS.findIndex((a) => a.n === act.n);
    const upcoming = mainScenes()
      .filter((sc) => !fired(S, sc.id))
      .filter((sc) => (sc.act || 0) <= act.n)
      .filter((sc) => condOk(S, sc.when))
      .sort((a, b) => (a.order || 0) - (b.order || 0))[0];
    return {
      act: act.n, name: act.name, hook: act.hook,
      total: ACTS.length,
      exited: idx,
      nextTitle: upcoming ? upcoming.title : null,
    };
  }

  /* ---------------- 引导者是否已登场 ---------------- */
  function ensureGuide(S) {
    if (!S.storyFlags) S.storyFlags = {};
    if (!S.storyFlags.guideIntro) markMet(S, GUIDE);
  }

  window.GAME_STORY = {
    GUIDE, ACTS, actOf, rel, addRel, relTier, isMet, markMet,
    nextScene, resolve, progress, ensureGuide, allScenes, mainScenes, npcScenes, condOk,
  };
})();
