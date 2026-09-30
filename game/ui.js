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
    show('screen-game');
    M.buildNodes($('map-grid'), onNodeClick);
    M.attachDrag($('map-grid'), () => S, onDrop, onPickCard);
    renderAll();
    if (gained.length) hint('本局已生效：' + gained.join('、'), 4200);
    // 开局先来一条委托，让新系统立刻可见
    if (B && !S.briefs.length) { B.spawn(S); renderAll(); }
    setTimeout(() => hint('种子 ' + S.seedLabel + ' · 遇到新的委托点顶部 ◈', 4200), 1400);
    // 开局走世界观入门剧情，不再弹独立的教程浮层
    setTimeout(() => startIntro(), 260);
  }

  function quitToHome() {
    if (S && !S.ending && !confirm('回到主页？这一局尚未结束，进度会丢失（已获得的命运点不会）。')) return;
    S = null;
    show('screen-home');
    renderHome();
  }

  /* ==========================================================
     渲染
     ========================================================== */
  function renderAll() {
    if (!S) return;
    renderHud();
    renderHand();
    renderActions();
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
      el.className = 'card' + (gate.ok ? '' : ' locked') + (selectedUid === c.uid ? ' picked' : '');
      el.style.setProperty('--c', p.color);
      el.dataset.uid = c.uid;
      el.innerHTML =
        '<div class="card-art" style="background-image:url(' + CARD_ART[c.pathId] + ')"><span class="card-tier">' + t.name + '</span></div>' +
        '<div class="card-body">' +
          '<div class="card-path" style="color:' + p.color + '">' + esc(p.name) + '</div>' +
          '<div class="card-verb">' + esc(p.verb) + '</div>' +
          '<div class="card-target"><span>' + esc(target ? target.name : '无目标') + '</span>' +
            '<span class="zone">' + esc(dist ? dist.name : '—') + '</span></div>' +
          '<div class="card-rate"><span style="color:' + rc + '">' + rate + '%</span>' +
            '<span class="rate-bar"><span class="rate-fill" style="width:' + rate + '%;background:' + rc + '"></span></span></div>' +
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
  }

  function renderActions() {
    const wrap = $('actions');
    wrap.innerHTML = '';
    D.ACTIONS.forEach((a) => {
      const el = document.createElement('div');
      el.className = 'act';
      el.innerHTML = '<span class="ic">' + a.icon + '</span><div class="an">' + esc(a.name) + '</div>' +
        '<div class="ac">' + a.cost + ' 行动点</div>';
      el.title = a.desc || '';
      if (S.ap < a.cost) el.setAttribute('disabled', 'disabled');
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

  function openDrawer(name) {
    const titles = { actions: '行动', tracks: '名望与属性', people: '认识的人', log: '记录' };
    if (drawerOpen === name) return closeDrawer();
    drawerOpen = name;
    $('drawer-title').textContent = titles[name] || name;
    $('drawer').classList.add('open');
    document.querySelectorAll('.pane').forEach((p) => p.classList.remove('on'));
    $('pane-' + name).classList.add('on');
    document.querySelectorAll('.rail-btn').forEach((b) => b.classList.toggle('on', b.dataset.panel === name));
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
      if (d) { hint('目标在' + d.name + '，点亮的节点可以直接投放', 3000); openDistrict(d.id); }
      else hint('这张牌暂时没有可投目标，换一张', 2600);
    }
  }

  function onNodeClick(distId) {
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

  function openDistrict(distId) {
    const info = M.districtDetail(S, distId);
    if (!info) return;
    $('dt-tag').textContent = info.district.en || '';
    $('dt-title').textContent = info.district.name;
    $('dt-desc').textContent = info.district.desc || '';

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
        if (r.ok) el.querySelector('.go').onclick = () => { show('screen-game'); onSolveBrief(r.uid); };
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
      if (r.ok) el.querySelector('.go').onclick = () => { show('screen-game'); onFold(r.uid); };
      cw.appendChild(el);
    });

    $('dt-assets').innerHTML = info.assets.length
      ? info.assets.map((a) => '<span>' + esc(a) + '</span>').join('')
      : '<span style="opacity:.6">暂无</span>';
    $('dt-events').innerHTML = info.events.length
      ? info.events.map((x) => '<span>' + esc(x) + '</span>').join('')
      : '<span style="opacity:.6">暂无</span>';

    show('screen-district');
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
    const r = E.fold(S, uid, boost, chipSpend);
    if (!r.ok) { toast('无法执行', r.why); return; }
    selectedUid = null;
    M.setSelected(null);
    $('chk-boost').checked = false;
    $('chip-range').value = '0';
    const title = r.pass ? (r.crit ? '暴击 · 指令达成' : '指令达成') : (r.fumble ? '崩盘 · 指令失败' : '指令失败');
    showResult(title, r.lines, r.pass);
    afterAction();
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
    afterAction();
  }

  function onSolveBrief(uid) {
    const r = B.solve(S, uid);
    if (!r.ok) { toast('还交不了', r.why); return; }
    renderAll();
    renderBriefs();
    const title = r.pass ? '委托完成' : '委托未办成';
    showResult(title, r.lines, r.pass);
    if (S.phase === 'end' && S.ending) showEnd();
  }

  function onRefuseBrief(uid) {
    if (!confirm('回绝这条委托？对方会记住。')) return;
    const r = B.refuse(S, uid);
    if (!r.ok) { toast('回绝不了', r.why); return; }
    renderAll();
    renderBriefs();
    showResult('你回绝了', r.lines, false);
    if (S.phase === 'end' && S.ending) showEnd();
  }

  function onEndDay() {
    const r = E.endDay(S);
    renderAll();
    renderBriefs();
    if (r.dead && S.ending) { showEnd(); return; }
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

  function afterAction() {
    renderAll();
    if (S.phase === 'end' && S.ending) showEnd();
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

  function introScenes() {
    const list = Array.isArray(window.INTRO_SCENES) ? window.INTRO_SCENES : [];
    return list.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  /* 开局：把世界观入门排进队列 */
  function startIntro() {
    const list = introScenes();
    if (!list.length) { storyLayer(false); return; }
    S.introDone = S.introDone || {};
    const fresh = list.filter((sc) => !S.introDone[sc.id]);
    if (!fresh.length) { storyLayer(false); return; }
    storyIsIntro = true;
    storyQueue = fresh.map((sc, i) => ({
      story: true, kind: 'intro', id: sc.id, tag: sc.tag || '世界观',
      title: sc.title, text: sc.text, portrait: null, npc: null, npcName: '',
      district: 'tower',                    // 入门剧情挂在引导者所在的城区
      idx: i + 1, total: fresh.length,
      options: (sc.choices || []).map((c) => ({ label: c.label, relation: c.relation, run: c.run, flag: c.flag })),
    }));
    storyDone = () => { storyIsIntro = false; storyLayer(false); renderAll(); };
    showStory(storyQueue.shift());
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
        if (S.phase === 'end' && S.ending) showEnd();
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

  /* ==========================================================
     绑定
     ========================================================== */
  $('btn-play').onclick = gotoOrigin;
  $('btn-howto').onclick = () => show('screen-howto');
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
  $('dt-close').onclick = () => show('screen-game');
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
