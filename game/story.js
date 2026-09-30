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
  /* 认可桥段单独一组：它不是支线，不按 stage 排，
     而是「这个人已经认识、条件也够了」时插进来的一段戏。
     走完这一段，他才把牌交出来。 */
  function approvalScenes() {
    return Array.isArray(window.APPROVALS) ? window.APPROVALS : [];
  }

  function npcScenes() {
    const out = [];
    if (Array.isArray(window.STORY_NPC_A)) out.push(...window.STORY_NPC_A);
    if (Array.isArray(window.STORY_NPC_B)) out.push(...window.STORY_NPC_B);
    if (Array.isArray(window.STORY_NPC_A2)) out.push(...window.STORY_NPC_A2);
    if (Array.isArray(window.STORY_NPC_B2)) out.push(...window.STORY_NPC_B2);
    return out;
  }
  function allScenes() { return mainScenes().concat(npcScenes()); }

  const fired = (S, id) => !!(S.storyFired && S.storyFired[id]);

  /* ---------------- 条件求值 ----------------
     支持四种条件族，策划写内容时不用碰引擎：
       stat:  { folded: [5,12], day: [3,99], money: [0,20], intel: [3,99], chips: [0,2] }
       track: { sin: [7,12], loyalty: [0,3], renown: [0,4], power: [8,12] }
       have:  ['has_ledger', 'trusted_su']        剧情标记，全部满足
       not:   ['broke_flow']                      排斥的标记
     也兼容旧写法：act / minFolded / maxFolded / minDay / minRel / met / flag / notFlag
  ------------------------------------------------ */
  const STAT_KEYS = { folded: (s) => s.folded, day: (s) => s.day, money: (s) => s.money,
    intel: (s) => s.intel, chips: (s) => s.chips, gear: (s) => s.gear,
    cards: (s) => (s.hand ? s.hand.length : 0), deck: (s) => (s.deck ? s.deck.length : 0) };

  function inRange(val, range) {
    if (val == null) return false;
    if (!Array.isArray(range)) return val === range;
    return val >= range[0] && val <= range[1];
  }

  function condOk(S, when) {
    if (!when) return true;

    /* --- 旧写法（保留兼容） --- */
    if (when.act && actOf(S.folded).n !== when.act) return false;
    if (when.minFolded != null && S.folded < when.minFolded) return false;
    if (when.maxFolded != null && S.folded > when.maxFolded) return false;
    if (when.minDay != null && S.day < when.minDay) return false;
    if (when.minRel != null && rel(S, when.npc) < when.minRel) return false;
    if (when.flag && !(S.storyFlags && S.storyFlags[when.flag])) return false;
    if (when.notFlag && S.storyFlags && S.storyFlags[when.notFlag]) return false;
    if (when.met && !isMet(S, when.met)) return false;

    /* --- 数值族 --- */
    if (when.stat) {
      for (const k in when.stat) {
        const fn = STAT_KEYS[k];
        if (!fn) continue;
        if (!inRange(fn(S), when.stat[k])) return false;
      }
    }

    /* --- 名望族 --- */
    if (when.track) {
      for (const k in when.track) {
        const v = (S.tracks && S.tracks[k]) || 0;
        if (!inRange(v, when.track[k])) return false;
      }
    }

    /* --- 标记族 --- */
    if (when.have) {
      const list = Array.isArray(when.have) ? when.have : [when.have];
      for (let i = 0; i < list.length; i++) {
        if (!(S.storyFlags && S.storyFlags[list[i]])) return false;
      }
    }
    if (when.not) {
      const list = Array.isArray(when.not) ? when.not : [when.not];
      for (let i = 0; i < list.length; i++) {
        if (S.storyFlags && S.storyFlags[list[i]]) return false;
      }
    }
    return true;
  }

  /* ---------------- 把条件翻译成人话，给界面显示 ---------------- */
  function describeWhen(S, when) {
    if (!when) return '';
    const bits = [];
    const rng = (r) => (Array.isArray(r) ? r[0] + '-' + r[1] : String(r));

    if (when.act) bits.push('第 ' + when.act + ' 幕');
    if (when.minFolded != null) bits.push('已折 ≥' + when.minFolded);
    if (when.maxFolded != null) bits.push('已折 ≤' + when.maxFolded);
    if (when.minDay != null) bits.push('第 ' + when.minDay + ' 天起');
    if (when.minRel != null) {
      const info = window.GAME_ENGINE.npcOf ? window.GAME_ENGINE.npcOf(when.npc) : null;
      bits.push((info ? info.name : '他') + '关系 ≥' + when.minRel);
    }
    if (when.met) {
      const info = window.GAME_ENGINE.npcOf ? window.GAME_ENGINE.npcOf(when.met) : null;
      bits.push('已认识' + (info ? info.name : ''));
    }
    if (when.stat) for (const k in when.stat) {
      const name = { folded: '已折牌', day: '天数', money: '信用点', intel: '情报',
        chips: '芯片', gear: '装备', cards: '手牌', deck: '牌堆剩余' }[k] || k;
      bits.push(name + ' ' + rng(when.stat[k]));
    }
    if (when.track) for (const k in when.track) {
      const name = window.GAME_ENGINE.trackName ? window.GAME_ENGINE.trackName(k) : k;
      bits.push(name + ' ' + rng(when.track[k]));
    }
    if (when.have) {
      const list = Array.isArray(when.have) ? when.have : [when.have];
      const names = list.map(flagName);
      bits.push('需 ' + names.join('、'));
    }
    if (when.not) {
      const list = Array.isArray(when.not) ? when.not : [when.not];
      bits.push('不能 ' + list.map(flagName).join('、'));
    }
    return bits.join(' · ');
  }

  /* 剧情标记的可读名（只列常用的，其余直接显示 key） */
  const FLAG_NAMES = {
    ask_prev: '问过上一副牌', know_name: '记住了名录上的名字', kept_going: '被允许继续',
    told_truth: '对监事说了实话', trusted_su: '把排期交给苏纹', has_ledger: '拿到了那本笔记',
    blank_card: '收下了空白卡', out_of_flow: '把自己从流程里摘出', broke_flow: '删掉了整份流程',
    left_together: '邀她一起离开',
    wd_told_number: '向闻铎报了编号', sw_changed_table: '替苏纹改过表',
    cy_signed: '替程砚签了收', ym_took_slip: '替银面扛下单子', yk_asked_him: '问过雨客本人',
  };
  function flagName(k) { return FLAG_NAMES[k] || k; }

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
      /* 认识人也是分段的：一开局只放两个人出来。
         以前是按天数每天两条，最多排到第八天 —— 结果玩家前三天就认识一半人，
         记不住谁是谁。现在跟城区用同一套段位：折得越多，认识的人越多。 */
      meetStage: Math.min(5, 1 + Math.floor(i / 3)),
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
    const stage = E.stageOf ? E.stageOf(S) : 5;
    const meets = meetScenes()
      .filter((sc) => !fired(S, sc.id))
      .filter((sc) => (sc.meetStage || 1) <= stage)
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

    /* 2.5) 认可桥段：他还没认可你，而你俩已经认识、条件也够了，就先演这一段。
            排在支线前面 —— 拿不到牌这件事比看戏重要。 */
    const unapproved = approvalScenes()
      .filter((sc) => !fired(S, sc.id))
      .filter((sc) => sc.npc && isMet(S, sc.npc))
      .filter((sc) => !(S.approved && S.approved[sc.npc]))
      .filter((sc) => condOk(S, Object.assign({ npc: sc.npc }, sc.when || {})));
    if (unapproved.length) {
      return decorate(S, unapproved[0], 'approval');
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
      kind: kind,                       // main | line | meet | approval
      approval: kind === 'approval',
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
    nextScene, resolve, progress, ensureGuide, allScenes, mainScenes, npcScenes, approvalScenes, condOk,
    describeWhen, flagName, inRange,
  };
})();
