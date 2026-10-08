/* ==========================================================
   《七日指令》地图层
   城区节点承载：指令目标、每日事件、委托
   支持 6-10 个城区，节点由数据驱动生成
   ========================================================== */
(function () {
  'use strict';
  const D = window.GAME_DATA;
  const E = window.GAME_ENGINE;
  const $ = (id) => document.getElementById(id);

  const districtById = (id) => (D.DISTRICTS || []).find((d) => d.id === id);
  const districtOfAsset = (aid) => {
    const a = E.assetOf(aid);
    return a ? a.district : null;
  };

  let host = null;
  let onNode = null;
  let dragBound = false;

  /* ---------------- 节点坐标自适应 ----------------
     地图数据里的 x/y 是按 16:9 构图定的。可见带变扁（横屏手机）
     或变窄（竖屏）时，直接按百分比放会让边缘节点掉出可视区。
     这里把数据坐标线性重映射到安全带里，保证任何画幅下
     十个城区都在可视范围内。
  ------------------------------------------------ */
  function computeRemap() {
    const list = D.DISTRICTS || [];
    if (!list.length) return { x0: 0, x1: 1, y0: 0, y1: 1 };
    let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity;
    list.forEach((d) => {
      xmin = Math.min(xmin, d.x); xmax = Math.max(xmax, d.x);
      ymin = Math.min(ymin, d.y); ymax = Math.max(ymax, d.y);
    });
    return { x0: xmin, x1: xmax, y0: ymin, y1: ymax };
  }

  function placeOf(d, r) {
    const spanX = (r.x1 - r.x0) || 1;
    const spanY = (r.y1 - r.y0) || 1;
    // 左右各留 7%，上下各留 15%（节点标签在下方，下部要留多些）
    const px = 0.07 + ((d.x - r.x0) / spanX) * 0.86;
    const py = 0.15 + ((d.y - r.y0) / spanY) * 0.68;
    return { x: px, y: py };
  }

  /* ---------------- 建立节点 ---------------- */
  function buildNodes(container, nodeClick) {
    host = container;
    onNode = nodeClick;
    host.innerHTML = '';

    const remap = computeRemap();

    D.DISTRICTS.forEach((d) => {
      const pos = placeOf(d, remap);
      const el = document.createElement('button');
      el.className = 'node';
      /* 还没开放的城区先不画上去。一张只有一个点的地图，
         比一张十个点但九个不能用的地图好懂。 */
      el.dataset.stage = d.stage || 1;
      el.dataset.district = d.id;
      el.style.left = (pos.x * 100).toFixed(2) + '%';
      el.style.top = (pos.y * 100).toFixed(2) + '%';
      el.style.setProperty('--nc', d.color);
      el.type = 'button';
      el.innerHTML =
        '<span class="node-ring"></span>' +
        '<span class="node-core"></span>' +
        '<span class="node-name">' + d.name + '</span>' +
        '<span class="node-meta"></span>';
      el.title = d.name + ' —— ' + (d.desc || '');
      el.addEventListener('click', () => { if (onNode) onNode(d.id); });
      host.appendChild(el);
    });
  }

  /* ---------------- 刷新节点状态 ---------------- */
  function syncNodes(S) {
    if (!host || !S) return;
    const briefMap = window.GAME_BRIEFS ? window.GAME_BRIEFS.byDistrict(S) : {};

    const stage = E.stageOf ? E.stageOf(S) : 5;
    D.DISTRICTS.forEach((d) => {
      const el = host.querySelector('.node[data-district="' + d.id + '"]');
      if (!el) return;
      /* 到段位才露出来。刚开的那一批给一个短动画，让玩家看见地图长大了。 */
      const open = (d.stage || 1) <= stage;
      const wasHidden = el.classList.contains('locked');
      el.classList.toggle('locked', !open);
      if (open && wasHidden) {
        el.classList.add('just-open');
        setTimeout(() => el.classList.remove('just-open'), 1600);
      }
      if (!open) {
        el.querySelector('.node-meta').innerHTML = '';
        return;
      }

      const cards = S.hand.filter((c) => districtOfAsset(c.target) === d.id);
      const foldable = cards.filter((c) => E.canFold(S, c).ok);
      const hasEvent = S.pendingEvent && S.pendingEvent.district === d.id;
      const briefs = briefMap[d.id] || [];
      const urgent = briefs.filter((b) => b.left <= 1);
      const picked = selectedReaches(S, d.id);

      el.classList.toggle('active', cards.length > 0 || briefs.length > 0);
      el.classList.toggle('ready', foldable.length > 0);
      el.classList.toggle('eventing', !!hasEvent);
      el.classList.toggle('picked', picked);
      el.classList.toggle('rejects', !!S._rejectDistrict && S._rejectDistrict === d.id);
      el.classList.toggle('has-brief', briefs.length > 0);
      el.classList.toggle('brief-urgent', urgent.length > 0);

      const badges = [];
      if (foldable.length) badges.push('<b class="bg-fold" title="可折牌">' + foldable.length + '</b>');
      else if (cards.length) badges.push('<b class="bg-lock" title="有牌但暂不可折">' + cards.length + '</b>');
      if (hasEvent) badges.push('<b class="bg-ev" title="此地正在发生事件">!</b>');
      if (briefs.length) {
        const kind = (window.GAME_BRIEFS.KIND[urgent.length ? urgent[0].kind : briefs[0].kind] || {});
        badges.push('<b class="bg-brief' + (urgent.length ? ' hot' : '') + '" style="background:' + (kind.color || '#e0b44a') + '" title="' + (kind.name || '委托') + '">' + (kind.mark || '◈') + briefs.length + '</b>');
      }
      el.querySelector('.node-meta').innerHTML = badges.join('');
      el.setAttribute('aria-label', d.name + '：可折 ' + foldable.length + '，委托 ' + briefs.length);
    });

    /* 节点位置可能因为画幅变化移动过，引线跟着重画 */
    lastS = S;
    drawGuide(S);
  }

  let currentUid = null;
  function selectedReaches(S, distId) {
    if (!S || !currentUid) return false;
    const c = S.hand.find((x) => x.uid === currentUid);
    if (!c) return false;
    return districtOfAsset(c.target) === distId;
  }
  function setSelected(uid) { currentUid = uid; }

  /* ---------------- 地图指引引线 ----------------
     选一张手牌，就从牌上拉一条线到目标城区。
     以前只在右上角弹一句「目标在某某区」，眼睛还得自己在图上找；
     现在线直接指过去，端点带脉冲圈，目标节点同步亮一档。
     牌在底栏、线在地图层，两边坐标系不同，所以要换算成图层内坐标。
  ------------------------------------------------ */
  let guideTimer = null;

  function drawGuide(S, origin) {
    const svg = document.getElementById('map-guide');
    const path = document.getElementById('guide-path');
    const dot = document.getElementById('guide-dot');
    const arrow = document.getElementById('guide-arrow');
    const callout = document.getElementById('node-callout');
    if (!svg || !path || !dot) return;

    const clear = () => {
      svg.classList.remove('on');
      dot.classList.remove('pulse');
      path.setAttribute('d', '');
      if (arrow) arrow.setAttribute('points', '');
      if (callout) { callout.hidden = true; callout.textContent = ''; }
      document.querySelectorAll('.node.guide').forEach((n) => n.classList.remove('guide'));
    };

    /* 拖拽时用被拖的那张牌，普通选中时用 currentUid */
    const uid = origin && origin.uid ? origin.uid : currentUid;
    if (!S || !uid) { clear(); return; }
    const card = S.hand.find((c) => c.uid === uid);
    if (!card) { clear(); return; }
    const distId = districtOfAsset(card.target);
    if (!distId) { clear(); return; }

    /* 终点：目标城区节点，nodeRect 给的就是视口坐标 */
    const nr = nodeRect(distId);
    if (!nr) { clear(); return; }
    const ex = nr.cx;
    const ey = nr.cy;

    /* 起点：拖动时跟手，否则取手牌上那张牌的上沿中点 */
    let sx, sy;
    if (origin && origin.x != null) {
      sx = origin.x;
      sy = origin.y;
    } else {
      const cardEl = document.querySelector('#hand .card[data-uid="' + uid + '"]');
      if (!cardEl) { clear(); return; }
      const cr = cardEl.getBoundingClientRect();
      sx = cr.left + cr.width / 2;
      sy = cr.top;
    }

    /* 控制点往上抬：线从底栏拱上去，正好落在节点上 */
    const lift = Math.max(70, Math.abs(sy - ey) * 0.45);
    const midY = Math.min(sy, ey) - lift;
    path.setAttribute('d',
      'M ' + sx.toFixed(1) + ' ' + sy.toFixed(1) +
      ' C ' + sx.toFixed(1) + ' ' + midY.toFixed(1) + ' ' +
              ex.toFixed(1) + ' ' + midY.toFixed(1) + ' ' +
              ex.toFixed(1) + ' ' + (ey - 46).toFixed(1));

    /* 箭头压在节点上方，朝下指着落点 */
    if (arrow) {
      const tipY = ey - 30;
      arrow.setAttribute('points',
        ex.toFixed(1) + ',' + tipY.toFixed(1) + ' ' +
        (ex - 11).toFixed(1) + ',' + (tipY - 18).toFixed(1) + ' ' +
        (ex + 11).toFixed(1) + ',' + (tipY - 18).toFixed(1));
    }
    dot.setAttribute('cx', ex.toFixed(1));
    dot.setAttribute('cy', ey.toFixed(1));
    dot.classList.add('pulse');
    svg.classList.add('on');

    /* 落点标注：贴在节点上方，写清是哪个城区 */
    if (callout) {
      const d = districtById(distId);
      callout.innerHTML = '放这里 <i>· ' + (d ? d.name : '') + '</i>';
      callout.style.left = ex.toFixed(1) + 'px';
      callout.style.top = (nr.top - 34).toFixed(1) + 'px';
      callout.hidden = false;
    }

    document.querySelectorAll('.node').forEach((n) => {
      n.classList.toggle('guide', n.dataset.district === distId);
    });
  }

  /* 画幅变化或横向滚动手牌时线要跟着重画，不然会错位。
     这里没有实时状态可读，所以记住最近一次 syncNodes 传进来的 S。 */
  let lastS = null;
  function armGuide() {
    if (guideTimer) cancelAnimationFrame(guideTimer);
    guideTimer = requestAnimationFrame(() => {
      guideTimer = null;
      drawGuide(lastS);
    });
  }
  window.addEventListener('resize', armGuide);
  document.addEventListener('scroll', armGuide, true);

  /* ---------------- 拖拽投放 ---------------- */
  function attachDrag(container, getState, onDrop, onPickCard) {
    if (dragBound) return;
    dragBound = true;
    let ghost = null, dragging = false, moved = false, activeUid = null;

    document.addEventListener('pointerdown', (ev) => {
      const btn = ev.target.closest('[data-drag]');
      const cardRoot = ev.target.closest('.card[data-uid]');
      if (!btn && !cardRoot) return;
      if (!btn && ev.target.closest('button')) return;
      const cardEl = btn ? btn.closest('.card') : cardRoot;
      activeUid = btn ? btn.getAttribute('data-drag') : (cardRoot && cardRoot.dataset.uid);
      if (!activeUid || !cardEl) return;

      dragging = true; moved = false;
      ghost = cardEl.cloneNode(true);
      ghost.className = 'card drag-ghost';
      ghost.style.width = cardEl.getBoundingClientRect().width + 'px';
      ghost.style.left = ev.clientX + 'px';
      ghost.style.top = ev.clientY + 'px';
      document.body.appendChild(ghost);
      ev.preventDefault();
    }, { passive: false });

    document.addEventListener('pointermove', (ev) => {
      if (!dragging || !ghost) return;
      moved = true;
      ghost.style.left = ev.clientX + 'px';
      ghost.style.top = ev.clientY + 'px';
      const node = nodeUnder(ev.clientX, ev.clientY);
      document.querySelectorAll('.node').forEach((n) => n.classList.toggle('hover', n === node));
      if (node) {
        const st = getState();
        ghost.classList.toggle('over', nodeAccepts(node, st, activeUid));
      }
      /* 拖的一部分人从来不「点选」牌，直接拖上去。
         那就在拖动过程中也把线画出来，别让指引只在点击路径里才有。 */
      drawGuide(getState(), { x: ev.clientX, y: ev.clientY, uid: activeUid });
    });

    document.addEventListener('pointerup', (ev) => {
      if (!dragging) return;
      dragging = false;
      if (ghost) { ghost.remove(); ghost = null; }
      document.querySelectorAll('.node').forEach((n) => n.classList.remove('hover'));
      /* 松手后回到「按选中状态画」——没选中就自己消失 */
      drawGuide(getState());
      const node = nodeUnder(ev.clientX, ev.clientY);
      const uid = activeUid;
      activeUid = null;
      if (!moved) { onPickCard(uid); return; }
      if (node && uid) {
        const st = getState();
        if (nodeAccepts(node, st, uid)) onDrop(uid, node.dataset.district);
        else onDrop(uid, node.dataset.district, 'mismatch');
      }
    });

    document.addEventListener('pointercancel', () => {
      dragging = false;
      if (ghost) { ghost.remove(); ghost = null; }
    });
  }

  function nodeUnder(x, y) {
    const el = document.elementFromPoint(x, y);
    return el ? el.closest('.node') : null;
  }

  function nodeAccepts(node, S, uid) {
    if (!S) return false;
    const card = S.hand.find((c) => c.uid === uid);
    if (!card) return false;
    return node.dataset.district === districtOfAsset(card.target) && E.canFold(S, card).ok;
  }

  /* ---------------- 城区详情 ---------------- */
  function districtDetail(S, distId) {
    const d = districtById(distId);
    if (!d) return null;

    const cards = S.hand.filter((c) => districtOfAsset(c.target) === d.id);
    const rows = cards.map((c) => {
      const p = E.pathOf(c.pathId), t = E.tierOf(c.tier);
      const target = E.assetOf(c.target);
      const gate = E.canFold(S, c);
      return {
        uid: c.uid,
        label: t.name + '·' + p.name + '「' + (target ? target.name : '无目标') + '」',
        note: '抗性 ' + ((target && target.resist) || 0) + ' · 判定线 ' + E.checkDC(S, c) + ' · 成功率 ' + Math.round(E.successRate(S, c) * 100) + '%' +
              '<br>失败：' + E.foldRisk(S, c).join(' · '),
        ok: gate.ok, why: gate.why, color: p.color, verb: p.verb,
      };
    });

    const briefs = (S.briefs || []).filter((b) => b.district === distId).map((b) => {
      const kind = window.GAME_BRIEFS.KIND[b.kind] || {};
      const gate = window.GAME_BRIEFS.canSolve(S, b);
      return {
        uid: b.uid, title: b.title, text: b.text, days: b.left,
        kindName: kind.name || '委托', color: kind.color || '#e0b44a', mark: kind.mark || '◈',
        ok: gate.ok, why: gate.why,
        npc: b.npc, refuseLabel: b.refuseLabel,
      };
    });

    const events = D.EVENTS.filter((e) => e.district === d.id).map((e) => e.title);
    const assets = D.ASSETS.filter((a) => a.district === d.id)
      .map((a) => a.name + '（LV' + a.level + '）');

    return { district: d, cards: rows, briefs: briefs, events: events, assets: assets };
  }

  /* ---------------- 地图总览（给 HUD 用） ---------------- */
  function summary(S) {
    const foldable = S.hand.filter((c) => E.canFold(S, c).ok).length;
    return {
      districts: D.DISTRICTS.length,
      foldable: foldable,
      briefs: (S.briefs || []).length,
      urgent: (S.briefs || []).filter((b) => b.left <= 1).length,
    };
  }

  /* ---------------- 取某个城区节点在屏幕上的位置 ----------------
     剧情面板要贴着对应节点出现，所以这里给出节点的视口矩形。
  ------------------------------------------------ */
  function nodeRect(distId) {
    const el = document.querySelector('.node[data-district="' + distId + '"]');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return null;
    return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height,
             cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
  }

  /** 城区是否在当前可见的地图带里 */
  function districtVisible(distId) {
    const layer = document.getElementById('map-layer');
    if (!layer) return false;
    const lr = layer.getBoundingClientRect();
    const nr = nodeRect(distId);
    if (!nr) return false;
    return nr.cx >= lr.left && nr.cx <= lr.right && nr.cy >= lr.top && nr.cy <= lr.bottom;
  }

  window.GAME_MAP = { buildNodes, syncNodes, attachDrag, districtDetail, districtById, districtOfAsset, setSelected, drawGuide, summary, nodeRect, districtVisible };
})();
