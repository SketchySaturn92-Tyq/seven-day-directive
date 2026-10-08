/* ==========================================================
   《七日指令》界面层 v3
   主页（种子 + 命运商店）→ 出身 → 牌局 → 委托 → 终局
   ========================================================== */
(function () {
  'use strict';
  const D = window.GAME_DATA;
  const E = window.GAME_ENGINE;
  const M = window.GAME_MAP;
  const MET = window.GAME_META;
  const B = window.GAME_BRIEFS;
  const RNG = window.GAME_RNG;
  const AU = window.GAME_AUDIO;   // 音效层，全部合成，无素材
  const SV = window.GAME_SAVE;    // 局内存档：关掉页面还能接着玩
  const $ = (id) => document.getElementById(id);

  let S = null;
  let P = MET.load();
  let selectedUid = null;
  let drawerOpen = null;
  let settled = null;

  const ART = 'assets/';
  const CARD_ART = {
    control: ART + 'card-control.webp',
    capital: ART + 'card-capital.webp',
    expand: ART + 'card-expand.webp',
    purge: ART + 'card-purge.webp',
  };
  const PORTRAIT = (id) => (id ? ART + id + '.webp' : '');

  /* 城区场景图：目前只有环带维修层与后来补的几张，
     表里没有的城区就不显示这一块。 */
  const DISTRICT_ART = {
    tower:    ART + 'district-tower.webp',
    exchange: ART + 'district-exchange.webp',
    lab:      ART + 'district-lab.webp',
    slum:     ART + 'district-slum.webp',
    docks:    ART + 'district-docks.webp',
    orbit:    ART + 'district-orbit.webp',
    ring:     ART + 'district-ring.webp',
    memory:   ART + 'district-memory.webp',
    salvage:  ART + 'district-salvage.webp',
    outside:  ART + 'district-outside.webp',
  };

  /* 立绘兜底：新城区角色图未生成时退回同区已有肖像，避免出现碎图 */
  const FALLBACK = {
    'portrait-ring': 'portrait-peng',
    'portrait-out': 'portrait-yuke',
    'portrait-sal': 'portrait-fixer',
    'portrait-mem': 'portrait-dai',
  };
  /* 已生成的立绘，避免再走 onerror */
  const HAS = {
    'portrait-ring': 1, 'portrait-out': 1, 'portrait-sal': 1, 'portrait-mem': 1,
  };
  function imgTag(cls, id, extra) {
    if (!id) return '';
    const fb = HAS[id] ? null : (FALLBACK[id] || null);
    const onerr = fb
      ? ' onerror="this.onerror=null;this.src=\'' + ART + fb + '.webp\';"'
      : ' onerror="this.style.visibility=\'hidden\';"';
    return '<img class="' + cls + '" src="' + PORTRAIT(id) + '" alt="" loading="lazy"' + (extra || '') + onerr + '>';
  }


  /* NPC 名录：id → 显示信息 */
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
  };
  const npcOf = (id) => NPCS[id] || { name: id || '某个人', role: '身份不明', district: null, portrait: null };

  function show(id) {
    document.querySelectorAll('.screen').forEach((el) => el.classList.remove('active'));
    $(id).classList.add('active');
  }

  /* ==========================================================
     主页
     ========================================================== */
  function renderHome() {
    /* 有存档就把「继续上一局」亮出来，并写清存到哪了 */
    const rb = $('btn-resume');
    if (rb) {
      let m = null;
      try { m = SV ? SV.meta() : null; } catch (e) { m = null; }
      if (m) {
        const when = String(m.savedAt || '').replace('T', ' ').slice(5, 16);
        $('resume-sub').textContent = '第 ' + m.day + ' 天 · 已折 ' + m.folded + '/12 · ' +
          (m.origin || '') + ' · ' + when;
        rb.hidden = false;
      } else {
        rb.hidden = true;
      }
    }

    $('pf-fortune').textContent = P.fortune;
    $('pf-runs').textContent = P.runs;
    $('pf-wins').textContent = P.wins;
    $('pf-endings').textContent = Object.keys(P.endings).length + '/' + D.ENDINGS.length;
    $('pf-met').textContent = Object.keys(P.metNpcs || {}).length + '/' + Object.keys(NPCS).length;
    $('nexus-dot').hidden = P.fortune < minCost();
    $('pf-last').textContent = P.lastRun
      ? '上一局：' + P.lastRun.ending + '（' + P.lastRun.origin + '，' + P.lastRun.days + ' 天，折牌 ' + P.lastRun.folded + '/12）+' + P.lastRun.points + ' 命运点'
      : '还没有记录。第一局从主页开始，留空种子就是随机局。';
  }

  function minCost() {
    let m = Infinity;
    MET.NEXUS.forEach((it) => { if (MET.levelOf(P, it.id) < it.max) m = Math.min(m, it.cost); });
    return m === Infinity ? 9999 : m;
  }

  /* ==========================================================
     命运商店
     ========================================================== */
  function renderNexus() {
    $('nx-fortune').textContent = P.fortune;
    const wrap = $('nexus-list');
    wrap.innerHTML = '';
    MET.NEXUS.forEach((it) => {
      const lv = MET.levelOf(P, it.id);
      const maxed = lv >= it.max;
      const gate = MET.canBuy(P, it.id);
      const el = document.createElement('div');
      el.className = 'nx-card' + (maxed ? ' maxed' : gate.ok ? ' affordable' : '');
      el.innerHTML =
        '<div class="nx-top"><span class="nx-icon">' + it.icon + '</span>' +
        '<div class="nx-name">' + esc(it.name) + '</div>' +
        '<div class="nx-lv">' + lv + '<span>/' + it.max + '</span></div></div>' +
        '<p class="nx-desc">' + esc(it.desc) + '</p>' +
        '<div class="nx-pips">' + Array.from({ length: it.max }).map((_, i) =>
          '<span class="pip' + (i < lv ? ' on' : '') + '"></span>').join('') + '</div>' +
        '<button class="btn btn-gold nx-buy">' + (maxed ? '已满级' : '升级 ' + it.cost + ' 点') + '</button>';
      const b = el.querySelector('.nx-buy');
      if (maxed) b.setAttribute('disabled', 'disabled');
      else if (!gate.ok) { b.setAttribute('disabled', 'disabled'); b.title = gate.why; }
      else b.onclick = () => onBuy(it.id);
      wrap.appendChild(el);
    });
  }

  /* ==========================================================
     结局图鉴
     档案里早就统计了每个结局见过几次，只是从来没展示过。
     见过的摊开来，没见过的只留一行编号 —— 让玩家知道还差几个。
     ========================================================== */
  const ENDING_HINT = {
    v2_true: '把规则本身改掉',
    v2_fake: '看起来赢了，其实被留下当下一副牌',
    v2_bad: '活着出来了，但不太认得自己',
    sultan: '权柄够高、罪痕够深、忠诚够低',
    emperor: '权柄封顶，而手上还不算太脏',
    hero: '声望够高，罪痕压得很低',
    ghost_out: '罪痕几乎没有，声望也不高',
    dog: '忠诚极高，但权柄一直上不去',
    purged: '罪痕满值',
    broken: '忠诚归零，或期限归零',
    w1: '权柄与声望双高，罪痕极低',
    w2: '权柄中上、罪痕不浅、声望平平',
    w3: '忠诚跌破底线，罪痕已经攒起来了',
    w4: '罪痕很高，忠诚很低，但牌折完了',
    w5: '通关时身上没剩几个钱，声望却不低',
    w6: '四轨全落在中段，哪一边都不站',
    w7: '十二张全折完，但罪痕已经压不下来',
    survivor: '十二张折完，仅此而已',
  };
  const ENDING_KIND = {
    v2_true: '真好', v2_fake: '假好', v2_bad: '坏',
    purged: '失败', broken: '失败',
  };

  function renderCompendium() {
    const P2 = P || {};
    const seen = P2.endings || {};
    const got = Object.keys(seen).length;
    $('cp-count').textContent = got;
    const tot = $('cp-total');
    if (tot) tot.textContent = D.ENDINGS.length;

    const wrap = $('cp-list');
    wrap.innerHTML = '';
    D.ENDINGS.slice().sort((a, b) => (b.priority || 0) - (a.priority || 0)).forEach((e) => {
      const n = seen[e.id] || 0;
      const kind = ENDING_KIND[e.id] || '';
      const el = document.createElement('div');
      el.className = 'cp-card' + (n ? '' : ' locked') + (kind ? ' k-' + kind : '');
      if (n) {
        el.innerHTML =
          '<div class="cp-top">' +
            (kind ? '<span class="cp-kind t-' + kind + '">' + kind + '</span>' : '') +
            '<b class="cp-name">' + esc(e.name) + '</b>' +
            (n > 1 ? '<span class="cp-times">×' + n + '</span>' : '<span class="cp-times new">首次</span>') +
          '</div>' +
          '<p class="cp-text">' + esc(e.text) + '</p>' +
          ((window.AFTERSTORY || {})[e.id]
            ? '<div class="cp-after"><span>后来</span>' + esc(window.AFTERSTORY[e.id]) + '</div>' : '') +
          '<div class="cp-hint">' + esc(ENDING_HINT[e.id] || '') + '</div>';
      } else {
        el.innerHTML =
          '<div class="cp-top"><b class="cp-name">未知结局</b></div>' +
          '<div class="cp-lock">◆</div>' +
          '<div class="cp-hint">' + esc(ENDING_HINT[e.id] || '还没见过这一种') + '</div>';
      }
      wrap.appendChild(el);
    });
  }

  function openCompendium() {
    renderCompendium();
    show('screen-compendium');
  }

  function onBuy(id) {
    const r = MET.buy(P, id);
    if (!r.ok) { nxNote(r.why, true); return; }
    nxNote(r.item.name + ' 升到 Lv' + r.level + '，下一局开局生效。');
    renderNexus(); renderHome();
  }
  function onRefund() {
    if (!confirm('把所有永久升级重置并退还全部命运点？')) return;
    const back = MET.refundAll(P);
    renderNexus(); renderHome();
    nxNote('已重置，退回 ' + back + ' 命运点。');
  }
  function nxNote(text, isErr) {
    const el = $('nx-note');
    el.textContent = text;
    el.className = 'nx-note show' + (isErr ? ' err' : '');
    clearTimeout(nxNote._t);
    nxNote._t = setTimeout(() => { el.className = 'nx-note'; }, 3200);
  }

  /* ==========================================================
     出身
     ========================================================== */
  function renderOrigins() {
    const wrap = $('origin-list');
    wrap.innerHTML = '';
    D.ORIGINS.forEach((o) => {
      const el = document.createElement('div');
      el.className = 'origin-card';
      el.innerHTML =
        imgTag('origin-portrait', o.portrait) +
        '<div class="tag">' + esc(o.tag) + '</div>' +
        '<h4>' + esc(o.name) + '</h4>' +
        '<p>' + esc(o.desc) + '</p>' +
        '<div class="mini-stats">' + D.STATS.map((s) => '<span>' + s.name + ' ' + o.stats[s.id] + '</span>').join('') + '</div>' +
        '<div class="perk">' + esc(o.perk) + '</div>';
      el.onclick = () => start(o.id);
      wrap.appendChild(el);
    });
  }

  function gotoOrigin() {
    const seed = ($('seed-input').value || '').trim();
    let text = seed;
    if (!text) {
      text = RNG.makeSeed(RNG.create(String(Date.now()) + Math.random()).next);
      $('seed-input').value = text;
    }
    $('origin-seed').textContent = '本局种子 ' + text;
    show('screen-origin');
  }

  /* ==========================================================
     开局
     ========================================================== */
  function start(originId) {
    const seed = ($('seed-input').value || '').trim() || undefined;
    S = E.newGame(originId, seed);
    const gained = MET.applyToRun(S, P);
    selectedUid = null;
    settled = null;
    /* 基线要在开局就对齐到当前段位。设成 null 的话，第一次折牌那一下
       只是把 null 填成 2 就返回了，跨段提示会被吞掉一次。 */
    markStageBaseline();
    show('screen-game');
    M.buildNodes($('map-grid'), onNodeClick);
    M.attachDrag($('map-grid'), () => S, onDrop, onPickCard);
    renderAll();
    M.syncNodes(S);            // 一开局就要把没开放的城区藏起来
    if (gained.length) hint('本局已生效：' + gained.join('、'), 4200);
    autosave();
    // 开局先来一条委托，让新系统立刻可见
    if (B && !S.briefs.length) { B.spawn(S); renderAll(); }
    setTimeout(() => hint('种子 ' + S.seedLabel + ' · 遇到新的委托点顶部 ◈', 4200), 1400);
    // 开局走世界观入门剧情，不再弹独立的教程浮层
    setTimeout(() => startIntro(), 260);
  }

  function quitToHome() {
    if (S && !S.ending && !confirm('回到主页？进度已自动保存，下次可以接着玩。')) return;
    S = null;
    show('screen-home');
    renderHome();
  }

  /* 接着上一局：把状态原样读回来，重建本该由 start() 做的那些接线 */
  function resumeRun() {
    let back = null;
    try { back = SV ? SV.load() : null; } catch (e) { back = null; }
    if (!back) { toast('没有可继续的牌局', '存档读不出来，可能已过期或损坏。开一局新的吧。'); return; }
    S = back;
    selectedUid = null;
    settled = null;
    lastHandCount = null;
    markStageBaseline();
    show('screen-game');
    M.buildNodes($('map-grid'), onNodeClick);
    M.attachDrag($('map-grid'), () => S, onDrop, onPickCard);
    renderAll();
    M.syncNodes(S);
    /* 存下来的时候可能正停在一个待处理的事件或剧情上 */
    if (S.pendingStory) { setTimeout(() => queueStory(S.pendingStory), 260); }
    else if (S.pendingEvent) { setTimeout(() => showEvent(S.pendingEvent), 260); }
    else { setTimeout(() => hint('接着第 ' + S.day + ' 天 · 已折 ' + S.folded + '/12', 4200), 500); }
  }

  /* ==========================================================
     渲染
     ========================================================== */
  function renderAll() {
    if (!S) return;
    renderHud();
    renderHand();
    renderTracks();
    renderStats();
    renderPeople();
    renderLog();
    M.syncNodes(S);
    renderGoal();
    renderBriefBadge();
  }

  function renderGoal() {
    const el = $('hud-goal');
    const foldable = S.hand.filter((c) => E.canFold(S, c).ok);
    const need = 12 - S.folded;
    const urgent = B ? B.urgentCount(S) : 0;
    if (urgent > 0) {
      el.textContent = '有 ' + urgent + ' 条委托今天到期，先去处理';
      el.classList.add('urgent');
      return;
    }
    if (S.deadline <= 2) {
      el.textContent = foldable.length ? '期限只剩 ' + S.deadline + ' 天，把卡投到 ' + distNameOf(foldable[0]) + ' 折掉' : '期限只剩 ' + S.deadline + ' 天，先攒资源再折牌';
      el.classList.add('urgent');
      return;
    }
    el.classList.remove('urgent');
    // 有主线等着就说主线，否则说牌
    if (window.GAME_STORY) {
      const p = window.GAME_STORY.progress(S);
      if (p.nextTitle) { el.textContent = '第 ' + p.act + ' 幕 · ' + p.name + '：' + p.nextTitle; return; }
    }
    if (foldable.length) {
      el.textContent = '还能折 ' + foldable.length + ' 张，还差 ' + need + ' 张通关';
    } else if (S.hand.length <= 1 && S.deck && S.deck.length) {
      el.textContent = '手上没牌了，去「行动」里申领一张';
    } else {
      el.textContent = '暂时没有可折的牌，换牌或用行动攒资源';
    }
  }

  function distNameOf(card) {
    const a = E.assetOf(card.target);
    const d = a ? M.districtById(a.district) : null;
    return d ? d.name : '对应城区';
  }

  function renderBriefBadge() {
    const n = (S.briefs || []).length;
    const badge = $('brief-badge');
    badge.hidden = n === 0;
    badge.textContent = n;
    const urgent = B ? B.urgentCount(S) : 0;
    badge.classList.toggle('hot', urgent > 0);
  }

  function renderHud() {
    $('hud-day').textContent = S.day;
    $('hud-folded').textContent = S.folded;
    $('hud-money').textContent = S.money;
    $('hud-intel').textContent = S.intel;
    $('hud-chips').textContent = S.chips;
    $('hud-gear').textContent = S.gear;
    $('hud-ap').textContent = S.ap;
    $('hud-apmax').textContent = S.apMax;
    const dl = $('hud-deadline');
    dl.textContent = S.deadline;
    dl.classList.toggle('danger', S.deadline <= 2);

    const maxChip = Math.min(Math.floor(S.chips / E.CHIP_PER), E.CHIP_CAP);
    const range = $('chip-range');
    range.max = String(maxChip);
    if (parseInt(range.value, 10) > maxChip) range.value = String(maxChip);
    $('chip-show').textContent = range.value + '/' + maxChip;
    $('boost-cost').textContent = E.boostCost(S);
    $('chk-boost').disabled = S.money < E.boostCost(S);

    // 牌堆与手牌：让「牌是挣来的」这件事可见
    const deckEl = $('hud-deck');
    if (deckEl && S.deck) {
      deckEl.textContent = S.hand.length + ' / ' + S.deck.length;
      deckEl.title = '手上 ' + S.hand.length + ' 张（上限 ' + (D.CONFIG.handMax || 7) + '）· 牌堆还有 ' + S.deck.length + ' 张';
      deckEl.classList.toggle('low', S.hand.length <= 1);
    }

    // 主线幕进度
    if (window.GAME_STORY) {
      const p = window.GAME_STORY.progress(S);
      $('hud-act-n').textContent = p.act;
      $('hud-act-name').textContent = p.name;
      const el = $('hud-act');
      el.title = '第 ' + p.act + ' 幕 · ' + p.name + '\n' + p.hook + (p.nextTitle ? '\n下一步：' + p.nextTitle : '');
    }
  }

  function renderHand() {
    const wrap = $('hand');
    wrap.innerHTML = '';
    if (!S.hand.length) { wrap.innerHTML = '<p class="pane-hint">手上没有牌了。</p>'; return; }
    S.hand.forEach((c) => {
      const p = E.pathOf(c.pathId), t = E.tierOf(c.tier);
      const target = E.assetOf(c.target);
      const gate = E.canFold(S, c);
      const dist = target ? M.districtById(target.district) : null;
      const rate = Math.round(E.successRate(S, c) * 100);
      const rc = rate >= 65 ? 'var(--ok)' : rate >= 45 ? 'var(--gold)' : 'var(--red)';
      const el = document.createElement('div');
      el.className = 'card t' + c.tier + (gate.ok ? '' : ' locked') + (selectedUid === c.uid ? ' picked' : '');
      el.style.setProperty('--c', p.color);
      el.dataset.uid = c.uid;
      /* 卡面结构照抄实体牌的版式：顶部名条 → 中部插画 → 底部文字板。
         曜金卡用描金字，和实体牌里苏丹卡的处理一致。 */
      el.innerHTML =
        '<div class="card-band">' +
          '<span class="card-tier">' + esc(t.name) + '</span>' +
          '<span class="card-path">' + esc(p.name) + '</span>' +
          '<span class="card-power" title="这张牌自带的力量，可以烧掉换判定加值">' + (c.power || c.tier) + '</span>' +
        '</div>' +
        '<div class="card-art" style="background-image:url(' + CARD_ART[c.pathId] + ')"></div>' +
        '<div class="card-body">' +
          '<div class="card-verb">' + esc(p.verb) + '</div>' +
          '<div class="card-target"><span>' + esc(target ? target.name : '无目标') + '</span>' +
            '<span class="zone">' + esc(dist ? dist.name : '—') + '</span></div>' +
          '<div class="card-rate"><span style="color:' + rc + '">' + rate + '%</span>' +
            '<span class="rate-bar"><span class="rate-fill" style="width:' + rate + '%;background:' + rc + '"></span></span></div>' +
          /* 失败会付出什么。原来卡面只有成功率，玩家得先失败一次才知道
             代价是什么 —— 而「先看后果再决定要不要冒险」正是这游戏的核心判断。 */
          '<div class="card-risk" title="失败代价">败 ' + esc(E.foldRisk(S, c).join(' · ')) + '</div>' +
          '<div class="card-act">' +
            '<button class="btn btn-primary" data-drag="' + c.uid + '">投放</button>' +
            '<button class="btn btn-ghost" data-swap="' + c.uid + '">换</button>' +
          '</div>' +
        '</div>';
      wrap.appendChild(el);
    });
    wrap.querySelectorAll('[data-swap]').forEach((b) => {
      b.onclick = (e) => { e.stopPropagation(); onSwap(b.getAttribute('data-swap')); };
    });
    /* 发牌音：手牌张数变了才响，不然每次刷新都在响 */
    if (lastHandCount !== null && S.hand.length > lastHandCount) {
      for (let i = 0; i < Math.min(3, S.hand.length - lastHandCount); i++) {
        setTimeout(() => sfx('deal'), i * 90);
      }
    }
    lastHandCount = S.hand.length;
    renderFuelPicker();
  }

  /* 烧牌下拉：列出手上除当前选中之外的所有指令卡，
     每一条都标出它自带的力量值。选它 = 把它烧掉换加值。 */
  function renderFuelPicker() {
    const sel = $('fuel-pick');
    if (!sel) return;
    const keep = sel.value;
    sel.innerHTML = '<option value="">不烧</option>';
    (S.hand || []).forEach((c) => {
      if (selectedUid && c.uid === selectedUid) return;
      const p = E.pathOf(c.pathId), t = E.tierOf(c.tier);
      const o = document.createElement('option');
      o.value = c.uid;
      o.textContent = t.name + '·' + p.name + ' +' + (c.power || c.tier);
      sel.appendChild(o);
    });
    if (keep && sel.querySelector('option[value="' + keep + '"]')) sel.value = keep;
    updateFuelPower();
    sel.onchange = updateFuelPower;
  }

  function updateFuelPower() {
    const sel = $('fuel-pick');
    const out = $('fuel-power');
    if (!out) return;
    if (!sel || !sel.value) { out.textContent = '0'; return; }
    const c = (S.hand || []).find((x) => x.uid === sel.value);
    out.textContent = c ? ('+' + (c.power || c.tier)) : '0';
  }

  /* 每个城区有自己的行动表。
     以前九条行动挤在一个全局面板里，站在哪儿都能干同一批事，
     地图和手牌就都失去了意义；玩家也看不懂那些行动跟折牌什么关系。
     现在「办哪件事」和「去哪儿」绑在一起，点开城区才看得到。 */
  /* 城区行动面板。
     以前每行只写「1 行动点」，玩家点完不知道刚才换来了什么；
     做过一次之后按钮还是亮的，点下去才弹一句「只能做一次」。
     现在把「会得到什么」和「今天还剩几次」都印在按钮上。 */
  function renderDistrictActions(distId) {
    const wrap = $('dt-actions');
    if (!wrap) return;
    wrap.innerHTML = '';
    const ids = (D.DISTRICT_ACTIONS && D.DISTRICT_ACTIONS[distId]) || [];
    if (!ids.length) {
      wrap.innerHTML = '<p class="pane-hint">这个地方没有你能做的事。</p>';
      return;
    }
    const used = S.dailyUsed || {};
    ids.forEach((id) => {
      const a = D.ACTIONS.find((x) => x.id === id);
      if (!a) return;
      const cap = a.perDay || 1;
      const done = used[id] || 0;
      const left = Math.max(0, cap - done);
      const poor = !!a.price && S.money < a.price;
      const noAp = S.ap < a.cost;
      const el = document.createElement('div');
      el.className = 'act' + (left <= 0 ? ' spent' : '');
      el.title = a.desc || '';
      el.innerHTML = '<span class="ic">' + a.icon + '</span>' +
        '<div class="an">' + esc(a.name) +
          (cap > 1 ? '<i class="act-left">今天还剩 ' + left + '/' + cap + '</i>' : '') + '</div>' +
        '<div class="ac">' + a.cost + ' 行动点' +
          (a.price ? ' · ' + a.price + ' 信用点' : '') + '</div>' +
        '<div class="ag">' + esc(a.gain || '') + '</div>' +
        (left <= 0 ? '<div class="act-why">今天做满了，明天再来</div>'
          : poor ? '<div class="act-why">钱不够</div>'
          : noAp ? '<div class="act-why">行动点不够</div>' : '');
      if (noAp || poor || left <= 0) el.setAttribute('disabled', 'disabled');
      else el.onclick = () => onAction(a.id);
      wrap.appendChild(el);
    });
  }

  function renderTracks() {
    const wrap = $('tracks');
    wrap.innerHTML = '';
    D.TRACKS.forEach((t) => {
      const v = S.tracks[t.id];
      const el = document.createElement('div');
      el.className = 'track';
      el.innerHTML =
        '<div class="track-top"><span class="track-name">' + esc(t.name) + '</span>' +
        '<span class="track-val" style="color:' + t.color + '">' + v + '</span></div>' +
        '<div class="track-bar"><div class="track-fill" style="width:' + Math.round(v / D.CONFIG.trackCap * 100) + '%;background:' + t.color + '"></div></div>' +
        '<div class="track-desc">' + esc(t.desc) + '</div>';
      wrap.appendChild(el);
    });
  }

  function renderStats() {
    const wrap = $('stats');
    wrap.innerHTML = '';
    D.STATS.forEach((s) => {
      const el = document.createElement('div');
      el.className = 'stat';
      el.innerHTML = '<span class="sk">' + esc(s.name) + '</span><b>' + S.stats[s.id] + '</b>';
      el.title = s.desc;
      wrap.appendChild(el);
    });
    const ex = document.createElement('div');
    ex.className = 'stat';
    ex.innerHTML = '<span class="sk">出身</span><b>' + esc(S.origin.name) + '</b>';
    wrap.appendChild(ex);
    if ((S.profileApplied || []).length) {
      const pf = document.createElement('div');
      pf.className = 'stat';
      pf.innerHTML = '<span class="sk">强化</span><b>' + S.profileApplied.length + ' 项</b>';
      pf.title = S.profileApplied.join('、');
      wrap.appendChild(pf);
    }
  }

  /* 认识的人：交给对话层渲染，可以点进去反复搭话 */
  function renderPeople() {
    const host = $('people');
    if (!host) return;
    if (window.GAME_VOICE) {
      window.GAME_VOICE.renderPeople(S, host, openTalk);
    } else {
      host.innerHTML = '<p class="pane-hint">对话系统尚未加载。</p>';
    }
  }

  /* ---------- 对话屏 ---------- */
  let talkNpc = null;
  let lastHandCount = null;   // 用来判断手牌是不是刚变多

  function openTalk(npcId) {
    talkNpc = npcId;
    show('screen-talk');
    renderTalk();
  }

  function renderTalk() {
    const host = $('talk-body');
    if (!host || !talkNpc) return;
    window.GAME_VOICE.renderTalk(S, talkNpc, host, {
      onBack: () => { talkNpc = null; show('screen-game'); renderAll(); openDrawer('people'); },
      onTopic: (tid) => {
        const r = window.GAME_VOICE.talk(S, talkNpc, tid);
        if (!r.ok) { toast('聊不下去', r.why); return; }
        window.GAME_VOICE.showReply(host, r);
        // 刷新关系值与话题锁定状态
        const back = host.querySelector('[data-back]');
        if (back) {
          renderTalk();
          const fresh = $('talk-body').querySelector('#talk-reply');
          if (fresh) window.GAME_VOICE.showReply($('talk-body'), r);
        }
        renderAll();
      },
    });
  }

  function renderLog() {
    const wrap = $('log');
    wrap.innerHTML = '';
    S.log.forEach((l) => {
      const el = document.createElement('div');
      el.className = 'log-item ' + l.kind;
      el.innerHTML = '<span class="d">D' + l.day + '</span>' + esc(l.text);
      wrap.appendChild(el);
    });
  }

  /* 委托面板 */
  function renderBriefs() {
    const wrap = $('briefs-list');
    const list = S.briefs || [];
    $('bf-count').textContent = list.length;
    wrap.innerHTML = '';
    if (!list.length) {
      wrap.innerHTML = '<p class="pane-hint">此刻没有人给你派活。放心折你的牌——但不会太久。</p>';
      return;
    }
    list.forEach((b) => {
      const def = B.KIND[b.kind] || {};
      const npc = npcOf(b.npc);
      const gate = B.canSolve(S, b);
      const el = document.createElement('div');
      el.className = 'brief-card' + (b.left <= 1 ? ' urgent' : '');
      el.style.setProperty('--bc', def.color || '#e0b44a');
      el.innerHTML =
        '<div class="brief-head">' +
          imgTag('brief-face', npc.portrait) +
          '<div class="brief-meta">' +
            '<div class="brief-kind" style="color:' + (def.color || '#e0b44a') + '">' + (def.mark || '◈') + ' ' + (def.name || '委托') + '</div>' +
            '<div class="brief-title">' + esc(b.title) + '</div>' +
            '<div class="brief-from">来自 ' + esc(npc.name) + ' · ' + esc(npc.role) + '</div>' +
          '</div>' +
          '<div class="brief-days"><b>' + b.left + '</b><span>天</span></div>' +
        '</div>' +
        '<p class="brief-text">' + esc(b.text) + '</p>' +
        '<div class="brief-foot">' +
          '<span class="brief-need' + (gate.ok ? ' ok' : '') + '">' + (gate.ok ? '可以交差：' + esc(gate.why || '条件已满足') : '还差：' + esc(gate.why)) + '</span>' +
          '<div class="brief-act">' +
            '<button class="btn btn-primary btn-sm" data-solve="' + b.uid + '"' + (gate.ok ? '' : ' disabled') + '>交差</button>' +
            '<button class="btn btn-ghost btn-sm" data-refuse="' + b.uid + '">' + esc(b.refuseLabel || '回绝') + '</button>' +
          '</div>' +
        '</div>';
      wrap.appendChild(el);
    });
    wrap.querySelectorAll('[data-solve]').forEach((btn) => {
      btn.onclick = () => onSolveBrief(btn.getAttribute('data-solve'));
    });
    wrap.querySelectorAll('[data-refuse]').forEach((btn) => {
      btn.onclick = () => onRefuseBrief(btn.getAttribute('data-refuse'));
    });
  }

  function hint(text, ms) {
    const el = $('map-hint');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(hint._t);
    hint._t = setTimeout(() => el.classList.remove('show'), ms || 2400);
  }

  /* 抽屉是否开着。类名是 open，不是 on —— on 是给面板和侧栏按钮用的，
     这两个混淆过一次，所以收成一个函数，别在别处再手写。 */
  function isDrawerOpen() {
    const d = $('drawer');
    return !!(d && d.classList.contains('open'));
  }

  /* 直接把抽屉切到某一栏，不带「再点一次就收起」的开关语义。
     城区详情要能在原地刷新（折完牌列表就变了），
     如果用 openDrawer 刷新，会因为它已经是当前栏而被关掉。 */
  function setDrawer(name) {
    drawerOpen = name;
    $('drawer').classList.add('open');
    document.querySelectorAll('.pane').forEach((p) => p.classList.remove('on'));
    $('pane-' + name).classList.add('on');
    document.querySelectorAll('.rail-btn').forEach((b) => b.classList.toggle('on', b.dataset.panel === name));
  }

  function openDrawer(name) {
    const titles = { tracks: '名望与属性', people: '认识的人', log: '记录' };
    if (drawerOpen === name) return closeDrawer();
    /* 地点是独立页面，不再挤在抽屉里；开抽屉时顺手把它收掉 */
    closeDistrictPage();
    $('drawer-title').textContent = titles[name] || name;
    setDrawer(name);
  }
  function closeDrawer() {
    drawerOpen = null;
    $('drawer').classList.remove('open');
    document.querySelectorAll('.rail-btn').forEach((b) => b.classList.remove('on'));
  }

  /* ==========================================================
     地图交互
     ========================================================== */
  function onPickCard(uid) {
    if (!uid) return;
    const card = S.hand.find((c) => c.uid === uid);
    if (!card) return;
    selectedUid = selectedUid === uid ? null : uid;
    M.setSelected(selectedUid);
    renderAll();
    if (selectedUid) {
      const target = E.assetOf(card.target);
      const d = target ? M.districtById(target.district) : null;
      /* 线已经指到目标城区了，这里不再重复报地名，
         只说「怎么放」，省得两处信息互相打架。 */
      if (d) hint('顺着线拖到「' + d.name + '」即可投放', 3000);
      else hint('这张牌暂时没有可投目标，换一张', 2600);
    }
  }

  function onNodeClick(distId) {
    maybeIntro('firstNode');
    if (selectedUid) {
      const card = S.hand.find((c) => c.uid === selectedUid);
      const target = card ? E.assetOf(card.target) : null;
      if (target && target.district === distId) {
        const gate = E.canFold(S, card);
        if (gate.ok) return onFold(selectedUid);
        toast('还不能执行', gate.why);
        return;
      }
    }
    openDistrict(distId);
  }

  function onDrop(uid, distId, mismatch) {
    const card = S.hand.find((c) => c.uid === uid);
    if (!card) return;
    if (mismatch) {
      const d = M.districtById(distId);
      toast('地点不对', '「' + E.label(card) + '」的目标不在' + d.name + '。');
      return;
    }
    const gate = E.canFold(S, card);
    if (!gate.ok) { toast('无法执行', gate.why); return; }
    onFold(uid);
  }

  let lastDistrict = null;   // 动作结算后要原地刷新这一页

  function districtPageOpen() {
    const el = $('district-page');
    return !!(el && !el.hidden);
  }

  function openDistrict(distId) {
    lastDistrict = distId;
    maybeIntro('openDistrict');
    const info = M.districtDetail(S, distId);
    if (!info) return;
    renderDistrictPage(info);
  }

  /* 地点页面：左边这个地方的样子，右边一张纸写清这里能做什么，
     底部一排缩略图直接在地点之间翻。
     以前这里是左侧抽屉里的一栏，点右边的城区得把眼睛横穿整个屏幕。 */
  function renderDistrictPage(info) {
    const distId = info.district.id;
    const page = $('district-page');
    if (!page) return;

    /* 打开地点页时把抽屉收掉，两个面板不叠在一起 */
    if (isDrawerOpen()) closeDrawer();

    $('dp-tag').textContent = info.district.en || '';
    $('dp-title').textContent = info.district.name;
    $('dp-desc').textContent = info.district.desc || '';
    $('dp-paper-title').textContent = info.district.name;

    const sc = $('dp-scene');
    const art = DISTRICT_ART[distId];
    if (art) {
      sc.innerHTML = '<img src="' + art + '" alt="" ' +
        'onerror="this.parentNode.classList.add(\'no-art\');this.remove();">';
      sc.classList.remove('no-art');
    } else {
      sc.innerHTML = '';
      sc.classList.add('no-art');
    }

    // 委托
    const bh = $('dt-brief-head'), bw = $('dt-briefs');
    if (info.briefs.length) {
      bh.hidden = false;
      bw.innerHTML = '';
      info.briefs.forEach((r) => {
        const el = document.createElement('div');
        el.className = 'dt-brief';
        el.style.borderLeftColor = r.color;
        el.innerHTML = '<div class="dt-brief-top"><b style="color:' + r.color + '">' + r.mark + ' ' + esc(r.title) + '</b>' +
          '<span class="dt-brief-days' + (r.days <= 1 ? ' hot' : '') + '">' + r.days + ' 天</span></div>' +
          '<span class="note">' + esc(r.text) + '</span>' +
          (r.ok ? '<button class="btn btn-primary btn-sm go">交差</button>' : '<span class="note">还差：' + esc(r.why) + '</span>');
        if (r.ok) el.querySelector('.go').onclick = () => {
          onSolveBrief(r.uid);
          setTimeout(() => refreshDistrictPage(), 40);   // 交完差这一页要重画
        };
        bw.appendChild(el);
      });
    } else { bh.hidden = true; bw.innerHTML = ''; }

    // 指令
    const cw = $('dt-cards');
    cw.innerHTML = '';
    if (!info.cards.length) cw.innerHTML = '<p class="pane-hint">此处暂无手牌可投放。</p>';
    info.cards.forEach((r) => {
      const el = document.createElement('div');
      el.className = 'dt-card' + (r.ok ? '' : ' locked');
      el.style.borderLeftColor = r.color;
      el.innerHTML = '<b style="color:' + r.color + '">' + esc(r.label) + '</b>' +
        '<span class="note">' + esc(r.note) + '</span>' +
        (r.ok ? '<button class="btn btn-primary btn-sm go">' + esc(r.verb) + '</button>'
              : '<span class="note">' + esc(r.why) + '</span>');
      if (r.ok) el.querySelector('.go').onclick = () => {
          onFold(r.uid);
          setTimeout(() => refreshDistrictPage(), 620);   // 折牌有裂开动画，等它播完再刷新
        };
      cw.appendChild(el);
    });

    $('dt-assets').innerHTML = info.assets.length
      ? info.assets.map((a) => '<span>' + esc(a) + '</span>').join('')
      : '<span style="opacity:.6">暂无</span>';
    $('dt-events').innerHTML = info.events.length
      ? info.events.map((x) => '<span>' + esc(x) + '</span>').join('')
      : '<span style="opacity:.6">暂无</span>';

    renderDistrictActions(distId);
    renderDistrictStrip(distId);
    page.hidden = false;
    page.classList.add('on');
    /* 纸面滚回顶部：换一个地点还是停在上一个的滚动位置会很怪 */
    const paper = page.querySelector('.parchment-inner');
    if (paper) paper.scrollTop = 0;
  }

  /* 内容变了（折完牌、交完委托）原地重画这一页 */
  function refreshDistrictPage() {
    if (!districtPageOpen() || !lastDistrict) return;
    const info = M.districtDetail(S, lastDistrict);
    if (info) renderDistrictPage(info);
  }

  function closeDistrictPage() {
    const page = $('district-page');
    if (page) { page.hidden = true; page.classList.remove('on'); }
  }

  /* 底部一排地点缩略图。照着实体版的排布：等高小图横排，当前那张有亮框。 */
  function renderDistrictStrip(current) {
    const wrap = $('dp-index');
    if (!wrap) return;
    wrap.innerHTML = '';
    D.DISTRICTS.forEach((d) => {
      const open = E.districtOpen ? E.districtOpen(S, d.id) : true;
      const el = document.createElement('button');
      el.className = 'dp-thumb' + (d.id === current ? ' on' : '') + (open ? '' : ' locked');
      el.dataset.district = d.id;
      const art = DISTRICT_ART[d.id];
      el.innerHTML = '<span class="dp-thumb-art"' +
          (art ? ' style="background-image:url(' + art + ')"' : '') + '></span>' +
        '<span class="dp-thumb-name">' + esc(open ? d.name : '未开放') + '</span>';
      if (open) el.onclick = () => { if (d.id !== current) openDistrict(d.id); };
      else el.setAttribute('disabled', 'disabled');
      wrap.appendChild(el);
    });
    /* 箭头的可用状态要按「已开放」的那一串算，不能按全部地点算 ——
       否则开场只有高塔开放时，「下一个」看着能点，点下去却没反应。
       stepDistrict 也是走这一串，两边必须同一个口径。 */
    const openIds = D.DISTRICTS
      .filter((d) => (E.districtOpen ? E.districtOpen(S, d.id) : true))
      .map((d) => d.id);
    const at = openIds.indexOf(current);
    $('dp-prev').disabled = at <= 0;
    $('dp-next').disabled = at < 0 || at >= openIds.length - 1;
  }

  /* 上一个 / 下一个只走已开放的城区，跳过锁着的
     （否则点半天没反应，像卡住了） */
  function stepDistrict(dir) {
    const ids = D.DISTRICTS.filter((d) => (E.districtOpen ? E.districtOpen(S, d.id) : true)).map((d) => d.id);
    if (!ids.length) return;
    let i = ids.indexOf(lastDistrict);
    if (i < 0) i = 0;
    const j = Math.max(0, Math.min(ids.length - 1, i + dir));
    if (j !== i) openDistrict(ids[j]);
  }

  /* ==========================================================
     动作
     ========================================================== */
  function onFold(uid) {
    const card = S.hand.find((c) => c.uid === uid);
    if (!card) return;
    const gate = E.canFold(S, card);
    if (!gate.ok) { toast('无法执行', gate.why); return; }
    const boost = $('chk-boost').checked;
    const chipSpend = parseInt($('chip-range').value, 10) || 0;
    const fuelSel = $('fuel-pick');
    const fuelUid = fuelSel && fuelSel.value ? fuelSel.value : null;
    /* 先让这张牌在手上裂开，再刷新界面。折牌就是这个游戏的核心动作，
       值得半秒的交代。 */
    const node = document.querySelector('#hand .card[data-uid="' + uid + '"]');
    if (node) node.classList.add('breaking');
    const r = E.fold(S, uid, boost, chipSpend, fuelUid);
    if (!r.ok) {
      if (node) node.classList.remove('breaking');
      toast('无法执行', r.why);
      return;
    }
    selectedUid = null;
    M.setSelected(null);
    $('chk-boost').checked = false;
    $('chip-range').value = '0';
    if (fuelSel) fuelSel.value = '';
    if (r.pass) sfx(r.crit ? 'crit' : 'foldOk');
    else sfx(r.fumble ? 'fumble' : 'foldFail');
    const title = r.pass ? (r.crit ? '暴击 · 指令达成' : '指令达成') : (r.fumble ? '崩盘 · 指令失败' : '指令失败');
    const delay = node ? 420 : 0;
    if (delay) setTimeout(() => { showResult(title, r.lines, r.pass); afterAction(); }, delay);
    else { showResult(title, r.lines, r.pass); afterAction(); }
  }

  function onSwap(uid) {
    const r = E.swapCard(S, uid);
    if (!r.ok) { toast('换不了', r.why); return; }
    selectedUid = null;
    M.setSelected(null);
    afterAction();
  }

  function onAction(id) {
    const r = E.doAction(S, id);
    if (!r.ok) { toast('做不了', r.why); return; }
    /* 以前点完行动什么都不显示，只有角落里的数字悄悄变了一下 ——
       玩家看不懂那些行动在干什么，一半原因在这里。 */
    if (r.lines && r.lines.length) showResult('办完了', r.lines, true);
    /* 花掉第一笔行动点之后，把「这些东西能拿来干什么」补上 */
    maybeIntro('firstAction');
    afterAction();
    /* 在某个地点的页面上办完事，就地刷新那一页，别把玩家弹回地图 */
    if (districtPageOpen()) refreshDistrictPage();
  }

  function onSolveBrief(uid) {
    const r = B.solve(S, uid);
    if (!r.ok) { toast('还交不了', r.why); return; }
    renderAll();
    renderBriefs();
    const title = r.pass ? '委托完成' : '委托未办成';
    showResult(title, r.lines, r.pass);
    if (S.phase === 'end' && S.ending) showEnd();
    else autosave();
  }

  function onRefuseBrief(uid) {
    if (!confirm('回绝这条委托？对方会记住。')) return;
    const r = B.refuse(S, uid);
    if (!r.ok) { toast('回绝不了', r.why); return; }
    renderAll();
    renderBriefs();
    showResult('你回绝了', r.lines, false);
    if (S.phase === 'end' && S.ending) showEnd();
    else autosave();
  }

  function onEndDay() {
    const r = E.endDay(S);
    renderAll();
    renderBriefs();
    if (r.dead && S.ending) {
      try { if (SV) SV.clear(); } catch (e) {}
      showEnd();
      return;
    }
    autosave();
    /* 买命换来的那三天。引擎已经把期限改回 3 天，
       但玩家不看日志，得把这件事当面说给他听。 */
    if (r.grace) {
      showResult('门又开了', [
        '期限本来归零了。那个被往后挪的人在这里替你说了一句话。',
        '期限回到 3 天。这是买来的，不是挣来的。',
      ], true);
      return;
    }
    // 先播报超期与新委托，再出当日的故事或事件
    const notes = [];
    (r.expired || []).forEach((x) => { notes.push('「' + x.brief.title + '」超期。' + x.lines.join(' ')); });
    if (r.incoming) notes.push('新委托：「' + r.incoming.title + '」（' + r.incoming.left + ' 天内）。');
    const next = r.story || r.event || null;
    if (notes.length) {
      showResult('这一天的账', notes, false);
      pendingEvent = next;
      return;
    }
    if (next) showEvent(next);
  }

  let pendingEvent = null;

  /* 段位推进：地图和人物是分五段放开的。
     刚进新段时告诉玩家这一批多了什么，不然他不会注意到地图长大了。 */
  let lastStage = null;
  let lastOpenCount = 0;
  /* 开一局（或读档）时把基线一起对齐。
     只对齐 lastStage 是不够的：lastOpenCount 还留在 0，
     跨段时会算出「新放开」= 全部城区，把开局就有的高塔商业区也念一遍。 */
  function markStageBaseline() {
    if (!S || !E.stageOf) { lastStage = null; lastOpenCount = 0; return; }
    lastStage = E.stageOf(S);
    lastOpenCount = (E.openDistricts ? E.openDistricts(S).length : 0);
  }
  function noticeStage() {
    if (!S || !E.stageOf) return;
    const now = E.stageOf(S);
    const open = E.openDistricts ? E.openDistricts(S) : [];
    if (lastStage === null) { lastStage = now; lastOpenCount = open.length; return; }
    if (now <= lastStage) { lastStage = now; lastOpenCount = open.length; return; }
    lastStage = now;
    /* 只报这次多出来的那几个，别把开局就有的高塔商业区也念一遍 */
    const fresh = open.slice(lastOpenCount).map((d) => d.name);
    lastOpenCount = open.length;
    if (!fresh.length) return;
    hint('第 ' + now + ' 段 · 地图又放开一层：' + fresh.join('、'), 6000);
    sfx('draw');
    M.syncNodes(S);
  }

  function afterAction() {
    /* 折完第一张之后补讲制度来历 —— 这时候他才看得懂 */
    if (S && S.folded > 0) maybeIntro('firstFold');
    noticeStage();
    renderAll();
    if (S.phase === 'end' && S.ending) {
      /* 收场了就清掉存档，免得下次进来「继续」到一个已结束的局 */
      try { if (SV) SV.clear(); } catch (e) {}
      showEnd();
      return;
    }
    autosave();
  }

  /* 自动存档：每一次会改变状态的动作之后都写一遍。
     失败不提示 —— 玩家不需要知道隐私模式下的存储限制。 */
  function autosave() {
    try { if (SV && S) SV.save(S); } catch (e) { /* 静默 */ }
  }

  /* ==========================================================
     剧情面板
     剧情贴着 NPC / 城区节点出现，不做全屏：地图始终可见，
     玩家能看到这段话发生在哪。窄屏时退化为贴底部的长条。
     ========================================================== */
  let storyQueue = [];       // 待播的场景
  let storyDone = null;      // 播完后的回调
  let storyIsIntro = false;
  let storyCurrent = null;


  function storyLayer(on) {
    const el = $('story-layer');
    if (!el) return;
    el.hidden = !on;
  }


  /* ---------- 正文内联高亮 ----------
     正文里写成【罪痕】【忠诚】这类方括号术语时，
     渲染成高亮标记，玩家读到就知道这是面板上的哪个数。 */
  const TERM_COLOR = {
    '罪痕': 'sin', '忠诚': 'loyalty', '声望': 'renown', '权柄': 'power',
    '信用点': 'money', '情报': 'intel', '指令芯片': 'chips', '芯片': 'chips',
    '装备': 'gear', '体魄': 'vitality', '智慧': 'intellect', '魅力': 'charm',
    '战斗': 'force', '隐匿': 'stealth',
  };
  function richText(raw) {
    if (!raw) return '';
    // 先转义，再替换方括号
    let out = esc(raw);
    out = out.replace(/【([^】]{1,10})】/g, (m, term) => {
      const kind = TERM_COLOR[term];
      const cls = kind ? ' term term-' + kind : ' term';
      return '<b class="' + cls.trim() + '">' + term + '</b>';
    });
    // 段落换行保留
    return out;
  }

  /* ==========================================================
     开场：读三段就能进牌局
     原来开局一口气播完十二段、2304 字，玩家还没摸到牌就先读了五屏。
     现在只留三段（世界、你的身份、你被点名的处境，约 570 字），
     其余九段改成「按需补讲」——第一次遇到对应的事时才插进来。
     在玩家正好要用到的时候讲，才记得住；
     而且这个时候他手上已经有一张牌了，读起来是想知道，不是被灌。
     ========================================================== */
  const INTRO_OPENING = ['intro-1', 'intro-2', 'intro-4'];

  const INTRO_LATER = {
    /* 第一次点开地图上的城区：讲规则与四条路径 —— 此刻他正要出牌 */
    'intro-5':  'firstNode',
    'intro-6':  'firstNode',
    'intro-7':  'firstNode',
    /* 手上出现第一张折得动的牌：推他翻第一张 */
    'intro-12': 'firstReady',
    /* 第一次认识一个人：介绍苏纹 */
    'intro-10': 'metAny',
    'intro-11': 'metAny',
    /* 第一次折完牌：这时候才看得懂制度是怎么来的 */
    'intro-3':  'firstFold',
    /* 第一次名望真的变动：两条不杀人的轨道才有意义 */
    'intro-8':  'firstFold',
    /* 第一次走进具体城区：工位与门禁的常识 */
    'intro-9':  'openDistrict',
    /* 第一次真的花掉行动点：这时候他才想知道钱和那几样东西能干什么。
       早讲没有用 —— 手上没资源的时候，讲用途等于讲空话。 */
    'intro-13': 'firstAction',
  };

  function introScenes() {
    const list = Array.isArray(window.INTRO_SCENES) ? window.INTRO_SCENES : [];
    return list.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  function introToScene(sc, i, total) {
    return {
      story: true, kind: 'intro', id: sc.id, tag: sc.tag || '世界观',
      title: sc.title, text: sc.text, portrait: null, npc: null, npcName: '',
      district: 'tower',
      idx: i + 1, total: total,
      options: (sc.choices || []).map((c) => ({ label: c.label, relation: c.relation, run: c.run, flag: c.flag })),
    };
  }

  /* 按 id 把还没看过的几段排进队列 */
  function queueIntroIds(ids) {
    S.introDone = S.introDone || {};
    const all = introScenes();
    const pick = ids
      .map((id) => all.find((sc) => sc.id === id))
      .filter((sc) => sc && !S.introDone[sc.id]);
    if (!pick.length) return false;
    storyIsIntro = true;
    pick.forEach((sc, i) => storyQueue.push(introToScene(sc, i + 1, pick.length)));
    storyDone = () => { storyIsIntro = false; storyLayer(false); renderAll(); };
    if ($('story-layer').hidden) showStory(storyQueue.shift());
    return true;
  }

  /* 按需补讲的入口：某件事第一次发生时调一次 */
  function maybeIntro(trigger) {
    if (!S || S.phase === 'end') return false;
    if (!storyLayerHidden()) return false;    // 正在读东西就别插队
    const ids = Object.keys(INTRO_LATER).filter((id) => INTRO_LATER[id] === trigger);
    if (!ids.length) return false;
    return queueIntroIds(ids);
  }
  function storyLayerHidden() {
    const el = $('story-layer');
    return !el || el.hidden;
  }

  function startIntro() {
    S.introDone = S.introDone || {};
    /* 已经开过局的档（存档读回来）不再重播开场三段 */
    const played = INTRO_OPENING.some((id) => S.introDone[id]);
    if (played) { storyLayer(false); return; }
    if (!queueIntroIds(INTRO_OPENING)) { storyLayer(false); return; }
    /* 三段读完给他一句指引，别让他在空地图上发愣 */
    setTimeout(() => hint('点开地图上任意一个城区，那里有你今天能做的事', 5200), 600);
  }

  /* ---------- 面板落点：优先贴着节点，其次左右侧，最后贴底 ---------- */
  function placePanel(scene) {
    const panel = $('story-panel');
    const pin = $('story-pin');
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const M = 10;

    const narrow = vw <= 820;
    const shortLand = window.matchMedia('(orientation:landscape) and (max-height:560px)').matches;

    // 面板尺寸：先按内容量出来
    panel.style.left = '0px';
    panel.style.top = '0px';
    panel.style.bottom = 'auto';
    const pw = panel.offsetWidth || 440;
    const ph = panel.offsetHeight || 320;

    // 找出这段剧情对应的节点位置
    const distId = scene.district;
    const rect = (distId && M && M.nodeRect) ? M.nodeRect(distId) : null;
    const inBand = rect && M.districtVisible ? M.districtVisible(distId) : false;

    if (rect && inBand && !narrow) {
      pin.hidden = false;
      pin.style.left = rect.cx + 'px';
      pin.style.top = rect.cy + 'px';
    } else {
      pin.hidden = true;
    }

    let x, y;

    if (narrow) {
      // 窄屏：贴底长条，让地图上半部分仍然可见
      x = M;
      y = vh - ph - M;
      if (shortLand) y = vh - ph - 6;
      x = Math.max(M, Math.min(x, vw - pw - M));
      y = Math.max(M, Math.min(y, vh - ph - M));
      pin.hidden = true;
    } else if (rect && inBand) {
      // 优先放节点右侧；右侧不够就放左侧；上下夹紧
      const gap = 26;
      if (rect.right + gap + pw < vw - M) x = rect.right + gap;
      else if (rect.left - gap - pw > M) x = rect.left - gap - pw;
      else x = Math.min(Math.max(rect.cx + gap, M), vw - pw - M);
      y = rect.cy - ph / 2;
      y = Math.max(M, Math.min(y, vh - ph - M));
      x = Math.max(M, Math.min(x, vw - pw - M));
    } else {
      // 节点不在可见带里（例如剧情挂在别的区）：放右侧竖向
      x = vw - pw - M - (shortLand ? 90 : 0);
      y = (vh - ph) / 2;
      x = Math.max(M, Math.min(x, vw - pw - M));
      y = Math.max(M, Math.min(y, vh - ph - M));
    }

    panel.style.left = Math.round(x) + 'px';
    panel.style.top = Math.round(y) + 'px';
    panel.style.bottom = 'auto';
  }

  function showStory(scene) {
    if (!scene) { if (storyDone) storyDone(); return; }
    storyCurrent = scene;

    // 顶部
    const badge = $('story-badge');
    if (scene.kind === 'intro') badge.textContent = scene.tag || '世界观';
    else if (scene.kind === 'main') badge.textContent = '主线';
    else if (scene.kind === 'meet') badge.textContent = '初见';
    else if (scene.kind === 'approval') badge.textContent = '认可 · ' + (scene.npcName || '');
    else badge.textContent = scene.npcName ? scene.npcName + ' 的故事' : '故事';

    $('story-progress').innerHTML =
      '<span>' + (scene.idx || '·') + '</span><i>/</i><span>' + (scene.total || '·') + '</span>';

    $('story-act').textContent = scene.actName
      ? '第 ' + (scene.act || 1) + ' 幕 · ' + scene.actName + (scene.stage ? ' · 第 ' + scene.stage + ' 段' : '')
      : (scene.npcRole || '');

    // 立绘
    const face = $('story-face');
    const pid = scene.portrait || null;
    if (pid) {
      const fb = FALLBACK[pid] || null;
      face.onerror = fb ? function () { this.onerror = null; this.src = PORTRAIT(fb); }
                        : function () { this.hidden = true; };
      face.hidden = false;
      face.src = PORTRAIT(pid);
      face.alt = scene.npcName || '';
    } else { face.hidden = true; face.removeAttribute('src'); }

    // 正文
    $('story-title').textContent = scene.title || '';
    $('story-text').innerHTML = richText(scene.text || '');
    $('story-body').scrollTop = 0;

    $('story-skip').hidden = !(storyIsIntro || scene.kind === 'intro');

    // 触发条件：告诉玩家这段为什么现在发生
    const condEl = $('story-cond');
    const desc = scene.when && window.GAME_STORY
      ? window.GAME_STORY.describeWhen(S, scene.when) : '';
    if (desc) { condEl.textContent = '触发：' + desc; condEl.hidden = false; }
    else { condEl.hidden = true; }

    // 选项
    renderChoices(scene.options, (o, i) => onStoryChoice(scene, o, i));

    storyLayer(true);
    // 渲染完再定位，尺寸才准
    requestAnimationFrame(() => placePanel(scene));
  }

  function renderChoices(options, onPick) {
    const wrap = $('story-choices');
    wrap.innerHTML = '';
    const opts = (options || []).length ? options : [{ label: '继续' }];
    opts.forEach((o, i) => {
      const b = document.createElement('button');
      b.className = 'story-choice';
      b.type = 'button';
      b.innerHTML = opts.length > 1
        ? '<span class="num">' + (i + 1) + '</span>' + esc(o.label)
        : esc(o.label);
      b.onclick = () => onPick(o, i);
      wrap.appendChild(b);
    });
    $('story-hint').hidden = opts.length > 1;
  }

  function onStoryChoice(scene, opt, i) {
    if (scene.kind === 'intro') {
      S.introDone = S.introDone || {};
      S.introDone[scene.id] = 1;
      S.storyFlags = S.storyFlags || {};
      if (opt.flag) S.storyFlags[opt.flag] = 1;
      const lines = [];
      if (opt.run && E.applyEffectPublic) E.applyEffectPublic(S, opt.run, lines);
      renderAll();
      advanceStory();
      return;
    }

    // 正式剧情：交给引擎结算
    const r = E.resolveStory(S, scene, i);
    renderAll();

    // 结果接在正文后面，读起来是一段事的收尾，而不是一条系统提示
    if (opt.after) {
      const cur = $('story-text').textContent;
      $('story-text').textContent = cur + '\n\n' + opt.after;
      $('story-body').scrollTop = $('story-body').scrollHeight;
    } else if (r.ok && r.lines && r.lines.length) {
      $('story-text').textContent = ($('story-text').textContent) + '\n\n' + r.lines.join('\n');
      $('story-body').scrollTop = $('story-body').scrollHeight;
    }

    renderChoices([{ label: storyQueue.length ? '继续' : '回到牌局' }], () => advanceStory());
    requestAnimationFrame(() => placePanel(scene));
  }

  function advanceStory() {
    if (storyQueue.length) { showStory(storyQueue.shift()); return; }
    storyLayer(false);
    renderAll();
    if (S.phase === 'end' && S.ending) showEnd();
    if (storyDone) { const d = storyDone; storyDone = null; d(); }
  }

  /* 把引擎推来的一条剧情放进队列并播出 */
  function queueStory(scene) {
    storyQueue.push(scene);
    const el = $('story-layer');
    if (!el || el.hidden) showStory(storyQueue.shift());
  }

  /* ==========================================================
     事件弹窗（非剧情类：每日随机事件）
     ========================================================== */
  function showEvent(ev) {
    if (ev && ev.story) { queueStory(ev); return; }
    showEventModal(ev);
  }

  function showEventModal(ev) {
    const isStory = !!ev.story;
    const d = ev.district ? M.districtById(ev.district) : null;

    // 标签行：区分主线、初见、个人支线、普通事件
    const tag = $('ev-dist');
    if (isStory && ev.kind === 'main') {
      tag.innerHTML = '<span class="tag-main">主线 · 第 ' + ev.act + ' 幕 ' + esc(ev.actName || '') + '</span>';
    } else if (isStory && ev.kind === 'approval') {
      tag.innerHTML = '<span class="tag-approve">认可 · ' + esc(ev.npcName || '') + '</span>';
    } else if (isStory && ev.kind === 'meet') {
      tag.innerHTML = '<span class="tag-meet">初见 · ' + esc(ev.npcName || '') +
        (ev.npcRole ? ' · ' + esc(ev.npcRole) : '') + '</span>';
    } else if (isStory) {
      tag.innerHTML = '<span class="tag-line">' + esc(ev.npcName || '') + ' 的故事 · 第 ' + (ev.stage || 1) + ' 段</span>';
    } else {
      tag.textContent = d ? d.name : '事件';
    }

    $('ev-title').textContent = ev.title;
    $('ev-text').textContent = ev.text;

    const img = $('ev-portrait');
    const fb = ev.portrait ? (FALLBACK[ev.portrait] || null) : null;
    img.onerror = fb ? function () { this.onerror = null; this.src = PORTRAIT(fb); }
                     : function () { this.style.visibility = 'hidden'; };
    img.style.visibility = 'visible';
    img.src = ev.portrait ? PORTRAIT(ev.portrait) : '';
    img.alt = ev.portrait || '';
    img.hidden = !ev.portrait;

    const wrap = $('ev-options');
    wrap.innerHTML = '';
    ev.options.forEach((o, i) => {
      const b = document.createElement('button');
      b.className = 'ev-opt';
      b.textContent = o.label;
      b.onclick = () => {
        const r = isStory ? E.resolveStory(S, ev, i) : E.resolveEvent(S, i);
        // 初见事件要登记认识的人
        if (!isStory && ev.isMeet && ev.npc && window.GAME_STORY) {
          window.GAME_STORY.markMet(S, ev.npc);
        }
        show('screen-game');
        renderAll();
        if (r.ok) {
          /* 先看数值，再看后来发生了什么。有 after 就多一屏。 */
          showResult(isStory ? (ev.kind === 'main' ? '主线推进' : '关系推进') : '结果', r.lines, null, r.after);
        }
        if (S.phase === 'end' && S.ending) { try { if (SV) SV.clear(); } catch (e) {} showEnd(); }
        else autosave();
      };
      wrap.appendChild(b);
    });
    show('screen-event');
  }

  /* ==========================================================
     弹窗
     ========================================================== */
  function showResult(title, lines, ok, after) {
    $('res-body').innerHTML =
      '<div class="res-big" style="color:' + (ok === true ? 'var(--ok)' : ok === false ? 'var(--red)' : 'var(--cyan)') + '">' + esc(title) + '</div>' +
      lines.map((l) => {
        const cls = /失败|崩盘|超期|还差/.test(l) ? 'fail' : (/成功|完成|^\+/.test(l) ? 'ok' : '');
        return '<div class="res-line ' + cls + '">' + esc(l) + '</div>';
      }).join('') +
      (after ? '<div class="res-after"><div class="res-after-t">后来</div>' +
        '<p class="res-after-x">' + esc(after) + '</p></div>' : '');
    show('screen-result');
  }
  function toast(title, msg) { showResult(title, [msg], null); }

  /* ==========================================================
     终局
     ========================================================== */
  function showEnd() {
    const e = S.ending;
    $('end-title').textContent = e.name;
    $('end-text').textContent = e.text;
    const bits = [
      '出身 ' + S.origin.name, '种子 ' + S.seedLabel, '存活 ' + S.day + ' 天', '折牌 ' + S.folded + '/12',
      '忠诚 ' + S.tracks.loyalty, '声望 ' + S.tracks.renown,
      '罪痕 ' + S.tracks.sin, '权柄 ' + S.tracks.power,
      '委托完成 ' + (S.briefDone || 0), '委托超期 ' + (S.briefExpired || 0),
      '遇见 ' + Object.keys(S.metNpcs || {}).length + ' 人',
    ];
    $('end-summary').innerHTML = bits.map((b) => '<span>' + esc(b) + '</span>').join('');
    if (!settled) settled = MET.settle(P, S);

    // 后日谈：世界在你之后变成了什么样
    const after = (window.AFTERSTORY || {})[e.id];
    const box = $('end-after');
    if (after) { $('end-after-text').textContent = after; box.hidden = false; }
    else { box.hidden = true; }

    $('end-points').textContent = '+' + settled.earned;
    $('end-total').textContent = settled.total;

    /* 结算明细：这一局每项表现各换了多少命运点，逐条摊开。
       以前只有一个总数，玩家不知道钱是怎么来的。 */
    const rows = settled.rows || (settled.run && settled.run.rows) || [];
    const rb = $('end-breakdown');
    if (rb) {
      if (rows.length) {
        rb.innerHTML = rows.map((r) => {
          const cls = r.value < 0 ? 'neg' : '';
          return '<div class="eb-row ' + cls + '">' +
            '<span class="eb-l">' + esc(r.label) + '</span>' +
            '<span class="eb-n">' + esc(r.note || '') + '</span>' +
            '<b class="eb-v">' + (r.value > 0 ? '+' : '') + r.value + '</b>' +
          '</div>';
        }).join('') + '<div class="eb-row eb-sum"><span class="eb-l">合计</span>' +
          '<span class="eb-n"></span><b class="eb-v">+' + settled.earned + '</b></div>';
        rb.hidden = false;
      } else { rb.hidden = true; rb.innerHTML = ''; }
    }
    show('screen-end');
  }

  function report() {
    if (!S || !S.ending) return '';
    return [
      '《七日指令》战报',
      '结局：' + S.ending.name,
      '种子：' + S.seedLabel,
      '出身：' + S.origin.name,
      '存活：' + S.day + ' 天',
      '折牌：' + S.folded + '/12',
      '忠诚 ' + S.tracks.loyalty + ' / 声望 ' + S.tracks.renown + ' / 罪痕 ' + S.tracks.sin + ' / 权柄 ' + S.tracks.power,
      '委托：完成 ' + (S.briefDone || 0) + '，超期 ' + (S.briefExpired || 0),
      '本局命运点：+' + (settled ? settled.earned : S.fortune),
    ].join('\n');
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* 音效：浏览器要求 AudioContext 在用户手势之后才能启动，
     所以第一次点任意按钮时顺手 init 一次，之后一路可用。
     拿不到就静默 —— 音效永远不该影响能不能玩。 */
  function sfx(name) {
    try { if (AU) AU.play(name); } catch (e) { /* 静默 */ }
  }
  function armAudio() {
    try { if (AU && !AU.ready()) AU.init(); } catch (e) { /* 静默 */ }
  }
  document.addEventListener('pointerdown', armAudio, { once: true });
  document.addEventListener('keydown', armAudio, { once: true });

  /* ==========================================================
     绑定
     ========================================================== */
  $('btn-play').onclick = gotoOrigin;
  $('btn-resume').onclick = resumeRun;
  $('btn-howto').onclick = () => show('screen-howto');
  $('btn-compendium').onclick = openCompendium;

  /* 音效与 BGM 两个开关，状态各自写进 localStorage，刷新后保持。
     分开是有意的：有人只想关音乐，留着折牌与判定的音效反馈。 */
  function renderAudioBtn() {
    const b = $('btn-audio');
    if (b) {
      const on = AU ? AU.enabled() : false;
      b.classList.toggle('off', !on);
      b.textContent = on ? '♪ 音效' : '♪ 已关';
    }
    const m = $('btn-bgm');
    if (m) {
      const on = AU ? AU.bgmEnabled() : false;
      m.classList.toggle('off', !on);
      m.textContent = on ? '♫ 音乐' : '♫ 已关';
    }
  }
  $('btn-audio').onclick = () => {
    armAudio();
    if (AU) AU.toggle();
    renderAudioBtn();
    if (AU && AU.enabled()) sfx('gain');
  };
  $('btn-bgm').onclick = () => {
    armAudio();
    if (AU) AU.bgmToggle();
    renderAudioBtn();
    if (AU && AU.bgmEnabled()) sfx('gain');
  };
  renderAudioBtn();

  /* ==========================================================
     键盘
     桌面端全靠鼠标太慢。只绑最常用的几个，不抢输入框的键。
     ========================================================== */
  function typing(e) {
    const t = e.target;
    if (!t) return false;
    const tag = (t.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || t.isContentEditable;
  }

  document.addEventListener('keydown', (e) => {
    if (typing(e)) return;
    const gameOn = document.getElementById('screen-game').classList.contains('active');
    const storyOn = !document.getElementById('story-layer').hidden;

    /* Esc：先关剧情层，再关抽屉，最后取消选中 */
    if (e.key === 'Escape') {
      if (storyOn) { return; }             // 剧情层必须选完，不给 Esc 逃
      if (isDrawerOpen()) { closeDrawer(); return; }
      if (selectedUid) {
        selectedUid = null;
        M.setSelected(null);
        renderHand();
        M.drawGuide(S);
      }
      return;
    }

    if (!gameOn || storyOn || !S || S.phase === 'end') return;

    /* 1-9 选牌。注意这里不能只 renderHand：引线是在 syncNodes 里画的，
       不走一遍地图层的刷新，线就不会出现。 */
    if (/^[1-9]$/.test(e.key)) {
      const i = parseInt(e.key, 10) - 1;
      if (S.hand[i]) {
        selectedUid = S.hand[i].uid;
        M.setSelected(selectedUid);
        renderHand();
        M.drawGuide(S);
        sfx('hover');
      }
      return;
    }

    /* Enter：把选中的牌投出去 */
    if (e.key === 'Enter' && selectedUid) {
      const c = S.hand.find((x) => x.uid === selectedUid);
      const t = c ? E.assetOf(c.target) : null;
      if (t && t.district) onDrop(selectedUid, t.district, false);
      else toast('牌上没有目标', '这张牌暂时没有可投放的地点。');
      return;
    }

    /* 空格：结束这一天 */
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      onEndDay();
      return;
    }

    /* 面板快捷键 */
    /* 行动已经挂到地点上，不再有全局的 a 键；其余三个保留 */
    const map = { t: 'tracks', p: 'people', l: 'log' };
    const k = String(e.key).toLowerCase();
    if (map[k]) {
      if (isDrawerOpen() && drawerOpen === map[k]) closeDrawer();
      else openDrawer(map[k]);
    }
  });
  $('cp-back').onclick = () => { show('screen-home'); renderHome(); };
  $('howto-close').onclick = () => show('screen-home');
  $('btn-nexus').onclick = () => { renderNexus(); show('screen-nexus'); };
  $('nx-back').onclick = () => { show('screen-home'); renderHome(); };
  $('nx-refund').onclick = onRefund;
  $('origin-back').onclick = () => show('screen-home');
  $('btn-quit').onclick = quitToHome;
  $('btn-tutorial').onclick = () => show('screen-howto');
  $('btn-briefs').onclick = () => { if (!S) return; renderBriefs(); show('screen-briefs'); };
  $('briefs-back').onclick = () => { show('screen-game'); renderAll(); };
  $('btn-seed-rand').onclick = () => {
    const rng = RNG.create(String(Date.now()) + Math.random());
    $('seed-input').value = rng.label;
  };
  $('btn-again').onclick = () => { S = null; settled = null; gotoOrigin(); };
  $('btn-nexus2').onclick = () => { S = null; settled = null; renderNexus(); show('screen-nexus'); };
  $('btn-copy').onclick = () => {
    const t = report();
    if (!t) return;
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => toast('已复制', ['战报已复制。']), () => {});
    else window.prompt('复制战报：', t);
  };
  $('btn-res-ok').onclick = () => {
    show('screen-game');
    if (pendingEvent) { const ev = pendingEvent; pendingEvent = null; setTimeout(() => showEvent(ev), 60); }
  };
  $('dp-back').onclick = () => closeDistrictPage();
  $('dp-prev').onclick = () => stepDistrict(-1);
  $('dp-next').onclick = () => stepDistrict(1);
  $('drawer-close').onclick = closeDrawer;
  $('btn-endday').onclick = onEndDay;
  document.querySelectorAll('.rail-btn').forEach((b) => { b.onclick = () => openDrawer(b.dataset.panel); });
  document.querySelectorAll('.screen.overlay').forEach((s) => {
    s.addEventListener('click', (e) => {
      if (e.target === s && s.id !== 'screen-end' && s.id !== 'screen-result') {
        show(S ? 'screen-game' : 'screen-home');
      }
    });
  });

  const bg = $('map-bg');
  bg.onerror = () => bg.classList.add('missing');

  renderOrigins();
  renderHome();
  window.__GAME = {
    get state() { return S; },
    engine: E, data: D, map: M, meta: MET, briefs: B, rng: RNG,
    get profile() { return P; },
    renderAll: () => renderAll(),
  };
})();
