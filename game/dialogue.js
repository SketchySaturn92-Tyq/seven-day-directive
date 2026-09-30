/* ==========================================================
   《七日指令》对话与档案层
   1) 人物档案：认识的人、关系值、可聊的话题
   2) 反复对话：同一人可以多次搭话，层级随关系值变化
   3) 主线进度：当前第几幕、引导者是谁
   ========================================================== */
(function () {
  'use strict';
  const D = window.GAME_DATA;
  const E = window.GAME_ENGINE;
  const ST = window.GAME_STORY;
  const $ = (id) => document.getElementById(id);

  const ART = 'assets/';
  const FALLBACK = {
    'portrait-ring': 'portrait-peng',
    'portrait-out': 'portrait-yuke',
    'portrait-sal': 'portrait-fixer',
    'portrait-mem': 'portrait-dai',
  };
  const HAS = { 'portrait-ring': 1, 'portrait-out': 1, 'portrait-sal': 1, 'portrait-mem': 1 };
  const PORTRAIT = (id) => (id ? ART + id + '.png'.replace('.png', '.webp') : '');

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function faceTag(cls, id, extra) {
    if (!id) return '';
    const fb = HAS[id] ? null : (FALLBACK[id] || null);
    const onerr = fb
      ? ' onerror="this.onerror=null;this.src=\'' + ART + fb + '.webp\';"'
      : ' onerror="this.style.visibility=\'hidden\';"';
    return '<img class="' + cls + '" src="' + PORTRAIT(id) + '" alt="" loading="lazy"' + (extra || '') + onerr + '>';
  }

  /* ---------------- 语音库 ---------------- */
  function voiceOf(npcId) {
    const A = window.NPC_VOICE_A || {};
    const B = window.NPC_VOICE_B || {};
    return A[npcId] || B[npcId] || null;
  }

  /* ---------------- 抽一句开场白 ----------------
     优先级：处境反应 > 关系层级台词
  ------------------------------------------------ */
  function greeting(S, npcId) {
    const v = voiceOf(npcId);
    if (!v) return null;
    const value = (k) => (k === 'money' ? S.money : k === 'intel' ? S.intel
      : k === 'chips' ? S.chips : k === 'folded' ? S.folded : (S.tracks ? S.tracks[k] : 0));

    for (let i = 0; i < (v.reactions || []).length; i++) {
      const r = v.reactions[i];
      let hit = true;
      Object.keys(r.when || {}).forEach((k) => {
        const range = r.when[k];
        const val = value(k);
        if (val == null || val < range[0] || val > range[1]) hit = false;
      });
      if (hit) return { text: r.text, tier: 'react' };
    }

    const rel = ST.rel(S, npcId);
    const tier = ST.relTier(rel);
    const pool = v[tier] || v.mid || v.low || [];
    const rng = S.rng || window.GAME_RNG.create(String(Date.now()));
    return { text: pool.length ? rng.pick(pool) : '', tier: tier };
  }

  /* ---------------- 把台词串成一段 ----------------
     不是随机抽一句，而是按「铺垫 → 信息 → 后手」的顺序，
     从该关系层级的池子里取 2-3 句，拼成一次完整的开口。
     同一个人每次开口的句数和顺序都不同，读起来像在跟你说话，
     而不是在播状态播报。
  ------------------------------------------------ */
  function compose(S, npcId, forceTier) {
    const v = voiceOf(npcId);
    if (!v) return null;
    const rel = ST.rel(S, npcId);
    const tier = forceTier || ST.relTier(rel);
    const rng = S.rng || window.GAME_RNG.create(String(Date.now()));
    const pools = {
      low: (v.low || []).slice(),
      mid: (v.mid || []).slice(),
      high: (v.high || []).slice(),
    };

    /* 铺垫优先用低一层级的口气，信息用当前层级，后手用高一层级。
       越熟的人，铺垫越短、后手越重。 */
    const order = tier === 'low' ? ['low', 'low', 'mid']
      : tier === 'mid' ? ['low', 'mid', 'mid', 'high']
      : ['mid', 'high', 'high'];

    const take = (k) => {
      const a = pools[k];
      if (!a || !a.length) return null;
      const i = rng.next() * a.length | 0;
      return a.splice(i, 1)[0];
    };

    const want = tier === 'high' ? 3 : (rng.next() < 0.55 ? 2 : 3);
    const out = [];
    for (let i = 0; i < order.length && out.length < want; i++) {
      const line = take(order[i]);
      if (line && out.indexOf(line) < 0) out.push(line);
    }
    if (!out.length) {
      const fb = take(tier) || take('mid') || take('low');
      if (fb) out.push(fb);
    }

    /* 处境反应优先压在最前面 —— 那是他看见你的第一眼 */
    const ctx = greeting(S, npcId);
    if (ctx && ctx.tier === 'react' && out.indexOf(ctx.text) < 0) out.unshift(ctx.text);

    return { text: out.join('\n\n'), tier: tier, parts: out.length };
  }

  /* ---------------- 话题可用性 ---------------- */
  function topicState(S, npcId, t) {
    if (!S.talkedTopics) S.talkedTopics = {};
    const used = Number(S.talkedTopics[t.id]) || 0;
    if (t.once && used > 0) return { ok: false, why: '已经聊过了', used };
    if (ST.rel(S, npcId) < (t.minRelation || 0)) {
      return { ok: false, why: '关系不够（需 ' + t.minRelation + '）', used };
    }
    return { ok: true, used };
  }

  /* ---------------- 聊一个话题 ---------------- */
  function talk(S, npcId, topicId) {
    const v = voiceOf(npcId);
    if (!v) return { ok: false, why: '这个人现在不想说话。' };
    const t = (v.topics || []).find((x) => x.id === topicId);
    if (!t) return { ok: false, why: '没有这个话题。' };

    const st = topicState(S, npcId, t);
    if (!st.ok) return { ok: false, why: st.why };

    const lines = [];
    if (t.give) E.applyEffectPublic(S, t.give, lines);
    if (t.track) E.applyEffectPublic(S, { track: t.track }, lines);

    const before = ST.rel(S, npcId);
    const after = ST.addRel(S, npcId, t.relation || 1);
    if (after !== before) lines.push(v.name + ' 对你的看法变了（关系 ' + before + ' → ' + after + '）。');

    S.talkedTopics[t.id] = st.used + 1;
    S.talkCount = (S.talkCount || 0) + 1;
    S.log.unshift({ kind: 'story', day: S.day, text: '与' + v.name + '交谈 · ' + t.label });
    if (S.log.length > 80) S.log.pop();

    return { ok: true, topic: t, lines: lines, reply: t.reply, name: v.name };
  }

  /* ---------------- 第一次见面的话 ---------------- */
  function firstLine(S, npcId) {
    const v = voiceOf(npcId);
    if (!v) return null;
    const key = 'first_' + npcId;
    if (S.talkedTopics && S.talkedTopics[key]) return null;
    S.talkedTopics = S.talkedTopics || {};
    S.talkedTopics[key] = 1;
    return v.first;
  }

  /* ==========================================================
     渲染：人物档案列表
     ========================================================== */
  function renderPeople(S, host, onOpen) {
    const met = S.metNpcs || {};
    const ids = Object.keys(met);
    if (!ids.length) {
      host.innerHTML = '<p class="pane-hint">你还没遇到任何人。每天结束时都可能有人第一次出现在你面前。</p>';
      return;
    }
    // 引导者排在最前
    ids.sort((a, b) => {
      if (a === ST.GUIDE) return -1;
      if (b === ST.GUIDE) return 1;
      return ST.rel(S, b) - ST.rel(S, a);
    });

    host.innerHTML = '';
    ids.forEach((id) => {
      const info = E.npcOf(id) || { name: id, role: '身份不明', district: null, portrait: null };
      const said = talkPercent(S, id);
      const d = info.district ? D.DISTRICTS.find((x) => x.id === info.district) : null;
      const rel = ST.rel(S, id);
      const el = document.createElement('div');
      el.className = 'person' + (id === ST.GUIDE ? ' is-guide' : '');
      const ok = !!(S.approved && S.approved[id]);
      el.innerHTML =
        faceTag('person-face', info.portrait) +
        '<div class="person-info">' +
          '<div class="person-name">' + esc(info.name) +
            (id === ST.GUIDE ? '<span class="guide-tag">引导者</span>' : '') +
            '<span class="appr ' + (ok ? 'yes' : 'no') + '" title="' +
              (ok ? '他已经认可你，牌在你手上' : '还没有认可你，再往后走走') + '">' +
              (ok ? '已认可' : '未认可') + '</span>' + '</div>' +
          '<div class="person-role">' + esc(info.role) + (d ? ' · ' + esc(d.name) : '') + '</div>' +
          '<div class="rel-row">' +
            '<span class="rel-bar"><span style="width:' + (rel * 10) + '%"></span></span>' +
            '<span class="rel-num">' + rel + '/10</span>' +
            '<span class="talked">聊过 ' + Math.round(said) + '%</span>' +
          '</div>' +
        '</div>' +
        '<button class="btn btn-primary btn-sm go">搭话</button>';
      el.querySelector('.go').onclick = () => onOpen(id);
      host.appendChild(el);
    });
  }

  function talkPercent(S, npcId) {
    const v = voiceOf(npcId);
    if (!v) return 0;
    const ts = v.topics || [];
    if (!ts.length) return 0;
    let done = 0;
    ts.forEach((t) => { if ((S.talkedTopics || {})[t.id]) done++; });
    return (done / ts.length) * 100;
  }

  /* ==========================================================
     渲染：单个人物的对话面板
     ========================================================== */
  function renderTalk(S, npcId, host, handlers) {
    const info = E.npcOf(npcId) || { name: npcId, role: '', portrait: null, district: null };
    const v = voiceOf(npcId);
    const rel = ST.rel(S, npcId);
    const d = info.district ? D.DISTRICTS.find((x) => x.id === info.district) : null;

    if (!v) {
      host.innerHTML =
        '<div class="talk-head">' + faceTag('talk-face', info.portrait) +
          '<div><h3>' + esc(info.name) + '</h3>' +
          '<p class="muted">' + esc(info.role) + (d ? ' · ' + esc(d.name) : '') + '</p></div>' +
        '</div>' +
        '<p class="talk-text">他还在忙，现在不想多说。</p>' +
        '<div class="row"><button class="btn btn-ghost" data-back="1">返回名单</button></div>';
      host.querySelector('[data-back]').onclick = handlers.onBack;
      return;
    }

    const first = firstLine(S, npcId);
    /* 不是抽一句，是把该层级的话串成一段：铺垫 → 信息 → 后手 */
    const cmp = compose(S, npcId);
    const shown = first || (cmp ? cmp.text : ((greeting(S, npcId) || {}).text || ''));

    const topicHtml = (v.topics || []).map((t) => {
      const st = topicState(S, npcId, t);
      const locked = !st.ok;
      return '<button class="topic' + (locked ? ' locked' : '') + '" data-topic="' + t.id + '"' +
        (locked ? ' disabled' : '') + '>' +
        '<span class="topic-label">' + esc(t.label) + '</span>' +
        '<span class="topic-note">' + (locked
          ? esc(st.why)
          : (t.once ? '只此一次' : '可以再聊') + ' · 关系 +' + (t.relation || 1)) + '</span>' +
        '</button>';
    }).join('');

    // 他会主动讲的这个世界的事
    const lore = loreOf(npcId);
    const loreHtml = lore.length ? lore.map((it) => {
      const st = loreState(S, npcId, it);
      const locked = !st.ok;
      return '<button class="topic topic-lore' + (locked ? ' locked' : '') + '" data-lore="' + it.id + '"' +
        (locked ? ' disabled' : '') + '>' +
        '<span class="topic-label">' + esc(it.topic) + '</span>' +
        '<span class="topic-note">' + (locked ? esc(st.why) : '听他讲') + '</span>' +
        '</button>';
    }).join('') : '';

    const lp = loreProgress(S);

    host.innerHTML =
      '<div class="talk-head">' + faceTag('talk-face', info.portrait) +
        '<div class="talk-id">' +
          '<h3>' + esc(v.name || info.name) + (npcId === ST.GUIDE ? '<span class="guide-tag">引导者</span>' : '') + '</h3>' +
          '<p class="muted">' + esc(v.role || info.role) + (d ? ' · ' + esc(d.name) : '') + '</p>' +
          '<div class="rel-row">' +
            '<span class="rel-bar"><span style="width:' + (rel * 10) + '%"></span></span>' +
            '<span class="rel-num">关系 ' + rel + '/10</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="talk-said">' + esc(shown) + '</div>' +
      '<h4 class="sub-t">可以聊的</h4>' +
      '<div class="topic-list">' + topicHtml + '</div>' +
      (loreHtml ? '<h4 class="sub-t">他想让你知道的事' +
        '<span class="lore-count">已听 ' + lp.got + '/' + lp.total + '</span></h4>' +
        '<div class="topic-list lore-list">' + loreHtml + '</div>' : '') +
      '<div id="talk-reply" class="talk-reply" hidden></div>' +
      '<div class="row"><button class="btn btn-ghost" data-back="1">返回名单</button></div>';

    host.querySelector('[data-back]').onclick = handlers.onBack;
    host.querySelectorAll('[data-topic]').forEach((b) => {
      b.onclick = () => handlers.onTopic(b.getAttribute('data-topic'));
    });
    host.querySelectorAll('[data-lore]').forEach((b) => {
      b.onclick = () => handlers.onLore(b.getAttribute('data-lore'));
    });
  }

  /* 显示一次对话的结果 */
  function showReply(host, r) {
    const box = host.querySelector('#talk-reply');
    if (!box) return;
    box.hidden = false;
    box.innerHTML =
      '<div class="reply-head">' + esc(r.name) + ' 说</div>' +
      '<p class="reply-text">' + esc(r.reply) + '</p>' +
      (r.lines && r.lines.length
        ? '<div class="reply-gain">' + r.lines.map((l) => '<span>' + esc(l) + '</span>').join('') + '</div>'
        : '');
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ---------------- 世界观碎片 ----------------
     NPC 会主动跟你讲这个世界的事：穹顶怎么来的、回收是怎么回事、
     名望四轨在生活里意味着什么。不同人讲同一个主题会有出入，
     玩家自己拼。
  ------------------------------------------------ */
  function loreOf(npcId) {
    const L = window.LORE || {};
    return Array.isArray(L[npcId]) ? L[npcId] : [];
  }

  function loreState(S, npcId, item) {
    if (!S.loreHeard) S.loreHeard = {};
    if (S.loreHeard[item.id]) return { ok: false, why: '已经听过了' };
    if (ST.rel(S, npcId) < (item.minRel || 0)) {
      return { ok: false, why: '关系不够（需 ' + item.minRel + '）' };
    }
    return { ok: true };
  }

  /* 聊一条世界观：不给数值，只把世界讲清楚 */
  function hearLore(S, npcId, loreId) {
    const v = voiceOf(npcId);
    const item = loreOf(npcId).find((x) => x.id === loreId);
    if (!item) return { ok: false, why: '没有这条。' };
    const st = loreState(S, npcId, item);
    if (!st.ok) return { ok: false, why: st.why };
    S.loreHeard[item.id] = 1;
    S.loreCount = (S.loreCount || 0) + 1;
    // 听人讲事本身就拉近关系
    const before = ST.rel(S, npcId);
    const after = ST.addRel(S, npcId, 1);
    const lines = [];
    if (after !== before) lines.push((v ? v.name : '他') + ' 对你的看法变了（关系 ' + before + ' → ' + after + '）。');
    S.log.unshift({ kind: 'story', day: S.day, text: '听' + (v ? v.name : '') + '讲 · ' + item.topic });
    if (S.log.length > 80) S.log.pop();
    return { ok: true, topic: item, reply: item.text, lines: lines, name: v ? v.name : '' };
  }

  function loreProgress(S) {
    const all = [];
    Object.keys(window.LORE || {}).forEach((k) => loreOf(k).forEach((x) => all.push(x)));
    const got = all.filter((x) => S.loreHeard && S.loreHeard[x.id]).length;
    return { got: got, total: all.length };
  }

  window.GAME_VOICE = { voiceOf, greeting, compose, topicState, talk, firstLine, renderPeople, renderTalk, showReply, talkPercent, loreOf, loreState, hearLore, loreProgress };
})();
