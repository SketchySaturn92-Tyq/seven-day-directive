/* ==========================================================
   《七日指令》地图层 —— 穹顶城市舞台
   城区节点承载：指令目标、每日事件、卡牌投放
   ========================================================== */
(function () {
  'use strict';
  const D = window.GAME_DATA;
  const E = window.GAME_ENGINE;
  const $ = (id) => document.getElementById(id);

  const districtById = (id) => D.DISTRICTS.find((d) => d.id === id);
  const districtOfAsset = (aid) => { const a = E.assetOf(aid); return a ? a.district : null; };

  /* ---------- 新建节点 DOM ---------- */
  function buildNodes(host, onNodeClick) {
    host.querySelectorAll('.node').forEach((n) => n.remove());
    D.DISTRICTS.forEach((d) => {
      const el = document.createElement('button');
      el.className = 'node';
      el.dataset.district = d.id;
      el.style.left = (d.x * 100).toFixed(2) + '%';
      el.style.top = (d.y * 100).toFixed(2) + '%';
      el.style.setProperty('--nc', d.color);
      el.innerHTML =
        '<span class="node-ring"></span>' +
        '<span class="node-core"></span>' +
        '<span class="node-name">' + d.name + '</span>' +
        '<span class="node-meta"></span>';
      el.title = d.name + ' —— ' + d.desc;
      el.addEventListener('click', () => onNodeClick(d.id));
      host.appendChild(el);
    });
  }

  /* ---------- 每帧刷新节点状态 ---------- */
  function syncNodes(host, S) {
    D.DISTRICTS.forEach((d) => {
      const el = host.querySelector('.node[data-district="' + d.id + '"]');
      if (!el) return;

      // 该城区可投放的指令卡
      const cards = S.hand.filter((c) => districtOfAsset(c.target) === d.id);
      const foldable = cards.filter((c) => E.canFold(S, c).ok);
      // 该城区待结算的事件
      const hasEvent = S.pendingEvent && S.pendingEvent.district === d.id;

      el.classList.toggle('active', cards.length > 0);
      el.classList.toggle('ready', foldable.length > 0);
      el.classList.toggle('eventing', !!hasEvent);
      el.classList.toggle('selected-dest', !!S.selectedCard && cardReaches(S, S.selectedCard, d.id));

      const badges = [];
      if (foldable.length) badges.push('<b class="bg-fold">' + foldable.length + '</b>');
      else if (cards.length) badges.push('<b class="bg-lock">' + cards.length + '</b>');
      if (hasEvent) badges.push('<b class="bg-ev">!</b>');
      el.querySelector('.node-meta').innerHTML = badges.join('');
      el.setAttribute('aria-label', d.name + '，可投放 ' + foldable.length + ' 张');
    });
  }

  function cardReaches(S, card, distId) {
    if (!card) return false;
    if (districtOfAsset(card.target) !== distId) return false;
    return true;
  }

  /* ---------- 拖拽投放 ---------- */
  function attachDrag(host, getState, onDrop, onPickCard) {
    let ghost = null, dragging = false, moved = false, activeUid = null;

    document.addEventListener('pointerdown', (ev) => {
      const btn = ev.target.closest('[data-drag]');
      const cardRoot = ev.target.closest('.card[data-uid]');
      if (!btn && !cardRoot) return;
      // 点在其它按钮上时不触发选中/拖拽，交给按钮自己的逻辑
      if (!btn && ev.target.closest('button')) return;
      const cardEl = btn ? btn.closest('.card') : cardRoot;
      activeUid = btn ? btn.getAttribute('data-drag') : cardRoot.dataset.uid;
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
      host.querySelectorAll('.node').forEach((n) => n.classList.toggle('hover', n === node));
      ghost.classList.toggle('over', !!node && nodeAccepts(node, getState(), activeUid));
    });

    document.addEventListener('pointerup', (ev) => {
      if (!dragging) return;
      dragging = false;
      if (ghost) { ghost.remove(); ghost = null; }
      host.querySelectorAll('.node').forEach((n) => n.classList.remove('hover'));
      const node = nodeUnder(ev.clientX, ev.clientY);
      const uid = activeUid;
      activeUid = null;
      if (!moved) { onPickCard(uid); return; }          // 轻点 = 选中
      if (node && uid) {
        if (nodeAccepts(node, getState(), uid)) onDrop(uid, node.dataset.district);
        else onDrop(uid, node.dataset.district, 'mismatch');
      }
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

  /* ---------- 城区详情 ---------- */
  function districtDetail(S, distId) {
    const d = districtById(distId);
    const cards = S.hand.filter((c) => districtOfAsset(c.target) === d.id);
    const rows = cards.map((c) => {
      const p = E.pathOf(c.pathId), t = E.tierOf(c.tier);
      const target = E.assetOf(c.target);
      const gate = E.canFold(S, c);
      const rate = Math.round(E.successRate(S, c) * 100);
      return {
        uid: c.uid,
        label: t.name + '·' + p.name + '「' + (target ? target.name : '无目标') + '」',
        note: '抗性 ' + ((target && target.resist) || 0) + ' · 判定线 ' + E.checkDC(S, c) + ' · 成功率 ' + rate + '%',
        ok: gate.ok, why: gate.why, color: p.color, verb: p.verb,
      };
    });

    const evs = D.EVENTS.filter((e) => e.district === d.id).map((e) => e.title);
    const assets = D.ASSETS.filter((a) => a.district === d.id)
      .map((a) => a.name + '（LV' + a.level + '）');

    return { district: d, cards: rows, events: evs, assets: assets };
  }

  window.GAME_MAP = { buildNodes, syncNodes, attachDrag, districtDetail, districtById, districtOfAsset };
})();
