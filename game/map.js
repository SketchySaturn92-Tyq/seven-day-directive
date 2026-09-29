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

  /* ---------------- 建立节点 ---------------- */
  function buildNodes(container, nodeClick) {
    host = container;
    onNode = nodeClick;
    host.innerHTML = '';

    D.DISTRICTS.forEach((d) => {
      const el = document.createElement('button');
      el.className = 'node';
      el.dataset.district = d.id;
      el.style.left = (d.x * 100).toFixed(2) + '%';
      el.style.top = (d.y * 100).toFixed(2) + '%';
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

    D.DISTRICTS.forEach((d) => {
      const el = host.querySelector('.node[data-district="' + d.id + '"]');
      if (!el) return;

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
  }

  let currentUid = null;
  function selectedReaches(S, distId) {
    if (!S || !currentUid) return false;
    const c = S.hand.find((x) => x.uid === currentUid);
    if (!c) return false;
    return districtOfAsset(c.target) === distId;
  }
  function setSelected(uid) { currentUid = uid; }

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
    });

    document.addEventListener('pointerup', (ev) => {
      if (!dragging) return;
      dragging = false;
      if (ghost) { ghost.remove(); ghost = null; }
      document.querySelectorAll('.node').forEach((n) => n.classList.remove('hover'));
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
        note: '抗性 ' + ((target && target.resist) || 0) + ' · 判定线 ' + E.checkDC(S, c) + ' · 成功率 ' + Math.round(E.successRate(S, c) * 100) + '%',
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

  window.GAME_MAP = { buildNodes, syncNodes, attachDrag, districtDetail, districtById, districtOfAsset, setSelected, summary };
})();
