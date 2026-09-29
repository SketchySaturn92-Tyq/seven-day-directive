/* ==========================================================
   《七日指令》界面层 v2
   主页（含命运商店） → 出身 → 游戏 → 终局结算回点数
   ========================================================== */
(function () {
  'use strict';
  const D = window.GAME_DATA;
  const E = window.GAME_ENGINE;
  const M = window.GAME_MAP;
  const T = window.GAME_TUTORIAL;
  const MET = window.GAME_META;
  const $ = (id) => document.getElementById(id);

  let S = null;
  let P = MET.load();
  let selectedUid = null;
  let drawerOpen = null;

  const ART = 'assets/';
  const CARD_ART = {
    control: ART + 'card-control.webp',
    capital: ART + 'card-capital.webp',
    expand: ART + 'card-expand.webp',
    purge: ART + 'card-purge.webp',
  };
  const PORTRAIT = (id) => (id ? ART + id + '.webp' : '');

  function show(id) {
    document.querySelectorAll('.screen').forEach((el) => el.classList.remove('active'));
    $(id).classList.add('active');
  }

  /* ================= 主页 ================= */
  function renderHome() {
    $('pf-fortune').textContent = P.fortune;
    $('pf-runs').textContent = P.runs;
    $('pf-wins').textContent = P.wins;
    $('pf-endings').textContent = Object.keys(P.endings).length + '/' + D.ENDINGS.length;
    $('nexus-dot').hidden = P.fortune < minCost();
    if (P.lastRun) {
      const r = P.lastRun;
      $('pf-last').textContent =
        '上一局：' + r.ending + '（' + r.origin + '，' + r.days + ' 天，折牌 ' + r.folded + '/12）+' + r.points + ' 命运点';
    } else {
      $('pf-last').textContent = '还没有记录。第一局会从合规部次长开始。';
    }
  }

  function minCost() {
    let m = Infinity;
    MET.NEXUS.forEach((it) => { if (MET.levelOf(P, it.id) < it.max) m = Math.min(m, it.cost); });
    return m === Infinity ? 9999 : m;
  }

  /* ================= 命运商店 ================= */
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
        '<div class="nx-top">' +
          '<span class="nx-icon">' + it.icon + '</span>' +
          '<div class="nx-name">' + esc(it.name) + '</div>' +
          '<div class="nx-lv">' + lv + '<span>/' + it.max + '</span></div>' +
        '</div>' +
        '<p class="nx-desc">' + esc(it.desc) + '</p>' +
        '<div class="nx-pips">' +
          Array.from({ length: it.max }).map((_, i) =>
            '<span class="pip' + (i < lv ? ' on' : '') + '"></span>').join('') +
        '</div>' +
        '<button class="btn nx-buy">' + (maxed ? '已满级' : '✦ ' + it.cost) + '</button>';
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

  // 商店内的行内反馈，不弹全屏弹窗
  function nxNote(text, isErr) {
    const el = $('nx-note');
    if (!el) return;
    el.textContent = text;
    el.className = 'nx-note show' + (isErr ? ' err' : '');
    clearTimeout(nxNote._t);
    nxNote._t = setTimeout(() => { el.className = 'nx-note'; }, 3200);
  }

  /* ================= 出身 ================= */
  function renderOrigins() {
    const wrap = $('origin-list');
    wrap.innerHTML = '';
    D.ORIGINS.forEach((o) => {
      const el = document.createElement('div');
      el.className = 'origin-card';
      el.innerHTML =
        '<img class="origin-portrait" src="' + PORTRAIT(o.portrait) + '" alt="" loading="lazy">' +
        '<div class="tag">' + esc(o.tag) + '</div>' +
        '<h4>' + esc(o.name) + '</h4>' +
        '<p>' + esc(o.desc) + '</p>' +
        '<div class="mini-stats">' + D.STATS.map((s) => '<span>' + s.name + ' ' + o.stats[s.id] + '</span>').join('') + '</div>' +
        '<div class="perk">' + esc(o.perk) + '</div>';
      el.onclick = () => start(o.id);
      wrap.appendChild(el);
    });
  }

  /* ================= 开局 ================= */
  function start(originId) {
    S = E.newGame(originId);
    const gained = MET.applyToRun(S, P);
    selectedUid = null;
    show('screen-game');
    M.buildNodes($('map-grid'), onNodeClick);
    M.attachDrag($('map-grid'), () => S, onDrop, onPickCard);
    renderAll();
    if (gained.length) hint('本局已生效：' + gained.join('、'), 4200);
    if (!T.isDone()) setTimeout(() => T.start(), 460);
  }

  function quitToHome() {
    if (S && !S.ending && !confirm('回到主页？这一局尚未结束，进度会丢失（已获得的命运点不会）。')) return;
    S = null;
    show('screen-home');
    renderHome();
  }

  /* ================= 渲染 ================= */
  function renderAll() {
    if (!S) return;
    renderHud();
    renderHand();
    renderActions();
    renderTracks();
    renderStats();
    renderLog();
    M.syncNodes($('map-grid'), S);
    renderGoal();
  }

  // 把「现在该做什么」写清楚
  function renderGoal() {
    const el = $('hud-goal');
    if (!S) return;
    if (S.phase === 'end') { el.textContent = '牌局结束'; return; }
    const foldable = S.hand.filter((c) => E.canFold(S, c).ok);
    const need = 12 - S.folded;
    if (S.deadline <= 2) {
      el.textContent = foldable.length
        ? '期限只剩 ' + S.deadline + ' 天，把卡投到 ' + distNameOf(foldable[0]) + ' 折掉'
        : '期限只剩 ' + S.deadline + ' 天，先攒资源再折牌';
      el.classList.add('urgent');
    } else if (foldable.length) {
      el.textContent = '还能折 ' + foldable.length + ' 张，还差 ' + need + ' 张通关';
      el.classList.remove('urgent');
    } else {
      el.textContent = '暂时没有可折的牌，换牌或用行动攒资源';
      el.classList.remove('urgent');
    }
  }

  function distNameOf(card) {
    const a = E.assetOf(card.target);
    const d = a ? M.districtById(a.district) : null;
    return d ? d.name : '对应城区';
  }

  function renderHud() {
    $('hud-day').textContent = S.day;
    $('hud-folded').textContent = S.folded;
    $('hud-money').textContent = S.money;
    $('hud-intel').textContent = S.intel;
    $('hud-chips').textContent = S.chips;
    $('hud-ap').textContent = S.ap;
    $('hud-apmax').textContent = S.apMax;
    const dl = $('hud-deadline');
    dl.textContent = S.deadline;
    dl.classList.toggle('danger', S.deadline <= 2);

    const maxChip = Math.min(Math.floor(S.chips / E.CHIP_PER), E.CHIP_CAP);
    const range = $('chip-range');
    if (range) {
      range.max = String(maxChip);
      if (parseInt(range.value, 10) > maxChip) range.value = String(maxChip);
      $('chip-show').textContent = range.value + '/' + maxChip;
    }
    const cb = $('chk-boost');
    if (cb) cb.disabled = S.money < boostCost();
  }

  function boostCost() { return Math.max(10, E.BOOST_COST - (S.boostDiscount || 0)); }

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
      const rateColor = rate >= 65 ? 'var(--ok)' : rate >= 45 ? 'var(--gold)' : 'var(--red)';

      const el = document.createElement('div');
      el.className = 'card' + (gate.ok ? '' : ' locked') + (selectedUid === c.uid ? ' picked' : '');
      el.style.setProperty('--c', p.color);
      el.dataset.uid = c.uid;
      el.innerHTML =
        '<div class="card-art" style="background-image:url(' + CARD_ART[c.pathId] + ')">' +
          '<span class="card-tier">' + t.name + '</span>' +
        '</div>' +
        '<div class="card-body">' +
          '<div class="card-path" style="color:' + p.color + '">' + esc(p.name) + '</div>' +
          '<div class="card-verb">' + esc(p.verb) + '</div>' +
          '<div class="card-target">' +
            '<span>' + esc(target ? target.name : '无目标') + '</span>' +
            '<span class="zone">' + esc(dist ? dist.name : '—') + '</span>' +
          '</div>' +
          '<div class="card-rate">' +
            '<span style="color:' + rateColor + '">' + rate + '%</span>' +
            '<span class="rate-bar"><span class="rate-fill" style="width:' + rate + '%;background:' + rateColor + '"></span></span>' +
          '</div>' +
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
      el.innerHTML = '<span class="ic">' + a.icon + '</span><div class="an">' + esc(a.name) + '</div><div class="ac">' + a.cost + ' 行动点</div>';
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

  function hint(text, ms) {
    const el = $('map-hint');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(hint._t);
    hint._t = setTimeout(() => el.classList.remove('show'), ms || 2400);
  }

  function openDrawer(name) {
    const titles = { actions: '行动', tracks: '名望与属性', log: '记录' };
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

  /* ================= 地图 ================= */
  function onPickCard(uid) {
    if (!uid) return;
    const card = S.hand.find((c) => c.uid === uid);
    if (!card) return;
    selectedUid = selectedUid === uid ? null : uid;
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
    $('dt-tag').textContent = info.district.en;
    $('dt-title').textContent = info.district.name;
    $('dt-desc').textContent = info.district.desc;
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

  /* ================= 动作 ================= */
  function onFold(uid) {
    const card = S.hand.find((c) => c.uid === uid);
    if (!card) return;
    const gate = E.canFold(S, card);
    if (!gate.ok) { toast('无法执行', gate.why); return; }
    const boost = $('chk-boost') && $('chk-boost').checked;
    const chipSpend = $('chip-range') ? parseInt($('chip-range').value, 10) || 0 : 0;
    const r = E.fold(S, uid, boost, chipSpend);
    if (!r.ok) { toast('无法执行', r.why); return; }
    selectedUid = null;
    if ($('chk-boost')) $('chk-boost').checked = false;
    if ($('chip-range')) $('chip-range').value = '0';
    const title = r.pass ? (r.crit ? '暴击 · 指令达成' : '指令达成') : (r.fumble ? '崩盘 · 指令失败' : '指令失败');
    showResult(title, r.lines, r.pass);
    afterAction();
  }

  function onSwap(uid) {
    const r = E.swapCard(S, uid);
    if (!r.ok) { toast('换不了', r.why); return; }
    selectedUid = null;
    afterAction();
  }

  function onAction(id) {
    const r = E.doAction(S, id);
    if (!r.ok) { toast('做不了', r.why); return; }
    afterAction();
  }

  function onEndDay() {
    const r = E.endDay(S);
    renderAll();
    if (r.dead && S.ending) { showEnd(); return; }
    if (r.event) showEvent(r.event);
  }

  function afterAction() {
    renderAll();
    if (S.phase === 'end' && S.ending) showEnd();
  }

  /* ================= 事件 ================= */
  function showEvent(ev) {
    const d = ev.district ? M.districtById(ev.district) : null;
    $('ev-dist').textContent = d ? d.name : '事件';
    $('ev-title').textContent = ev.title;
    $('ev-text').textContent = ev.text;
    const img = $('ev-portrait');
    img.src = ev.portrait ? PORTRAIT(ev.portrait) : '';
    img.alt = ev.portrait || '';
    const wrap = $('ev-options');
    wrap.innerHTML = '';
    ev.options.forEach((o, i) => {
      const b = document.createElement('button');
      b.className = 'ev-opt';
      b.textContent = o.label;
      b.onclick = () => {
        const r = E.resolveEvent(S, i);
        show('screen-game');
        renderAll();
        if (r.ok) showResult('结果', r.lines, null);
        if (S.phase === 'end' && S.ending) showEnd();
      };
      wrap.appendChild(b);
    });
    show('screen-event');
  }

  /* ================= 弹窗 ================= */
  function showResult(title, lines, ok) {
    $('res-body').innerHTML =
      '<div class="res-big" style="color:' + (ok === true ? 'var(--ok)' : ok === false ? 'var(--red)' : 'var(--cyan)') + '">' + esc(title) + '</div>' +
      lines.map((l) => {
        const cls = /失败|崩盘/.test(l) ? 'fail' : (/成功|^\+/.test(l) ? 'ok' : '');
        return '<div class="res-line ' + cls + '">' + esc(l) + '</div>';
      }).join('');
    show('screen-result');
  }
  function toast(title, msg) { showResult(title, [msg], null); }

  /* ================= 终局 ================= */
  let settled = null;
  function showEnd() {
    const e = S.ending;
    $('end-title').textContent = e.name;
    $('end-text').textContent = e.text;
    const bits = [
      '出身 ' + S.origin.name, '存活 ' + S.day + ' 天', '折牌 ' + S.folded + '/12',
      '忠诚 ' + S.tracks.loyalty, '声望 ' + S.tracks.renown,
      '罪痕 ' + S.tracks.sin, '权柄 ' + S.tracks.power,
    ];
    $('end-summary').innerHTML = bits.map((b) => '<span>' + esc(b) + '</span>').join('');
    if (!settled) settled = MET.settle(P, S);
    $('end-points').textContent = '+' + settled.earned;
    $('end-total').textContent = settled.total;
    show('screen-end');
  }

  function report() {
    if (!S || !S.ending) return '';
    return [
      '《七日指令》战报',
      '结局：' + S.ending.name,
      '出身：' + S.origin.name,
      '存活：' + S.day + ' 天',
      '折牌：' + S.folded + '/12',
      '忠诚 ' + S.tracks.loyalty + ' / 声望 ' + S.tracks.renown + ' / 罪痕 ' + S.tracks.sin + ' / 权柄 ' + S.tracks.power,
      '本局命运点：+' + (settled ? settled.earned : S.fortune),
    ].join('\n');
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ================= 绑定 ================= */
  $('btn-play').onclick = () => show('screen-origin');
  $('btn-howto').onclick = () => show('screen-howto');
  $('howto-close').onclick = () => show('screen-home');
  $('btn-nexus').onclick = () => { renderNexus(); show('screen-nexus'); };
  $('nx-back').onclick = () => { show('screen-home'); renderHome(); };
  $('nx-refund').onclick = onRefund;
  $('origin-back').onclick = () => show('screen-home');
  $('btn-quit').onclick = quitToHome;
  $('btn-tutorial').onclick = () => T.reset();
  $('btn-restart') && ($('btn-restart').onclick = quitToHome);
  $('btn-again').onclick = () => { S = null; settled = null; show('screen-origin'); };
  $('btn-nexus2').onclick = () => { S = null; settled = null; renderNexus(); show('screen-nexus'); };
  $('btn-copy').onclick = () => {
    const t = report();
    if (!t) return;
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => toast('已复制', ['战报已复制。']), () => {});
    else window.prompt('复制战报：', t);
  };
  $('btn-res-ok').onclick = () => show('screen-game');
  $('dt-close').onclick = () => show('screen-game');
  $('drawer-close').onclick = closeDrawer;
  $('btn-endday').onclick = onEndDay;
  document.querySelectorAll('.rail-btn').forEach((b) => { b.onclick = () => openDrawer(b.dataset.panel); });
  document.querySelectorAll('.screen.overlay').forEach((s) => {
    s.addEventListener('click', (e) => {
      if (e.target === s && s.id !== 'screen-end') show(S ? 'screen-game' : 'screen-home');
    });
  });

  const bg = $('map-bg');
  bg.onerror = () => bg.classList.add('missing');

  T.bind();
  renderOrigins();
  renderHome();
  window.__GAME = { get state() { return S; }, engine: E, data: D, map: M, tutorial: T, meta: MET, get profile() { return P; } };
})();
