/* ==========================================================
   《七日指令》新手教程 —— 聚光灯分步引导
   定位策略：每步实测目标矩形，再在若干候选位里挑一个
   既不出屏、也不压住高亮目标的落点
   ========================================================== */
(function () {
  'use strict';

  const STEPS = [
    {
      target: null,
      title: '十二张牌，一条命',
      text: '你是穹顶集团的中层，被董事会点名替他们玩这场牌局。手里这十二张「指令卡」，每折掉一张，期限就重置一次；折完全部十二张，你活下来。本局的种子显示在顶部，同一种子会生成同一局。',
    },
    {
      target: '#hud .hud-deadline',
      title: '七天，一条命',
      text: '每七天必须折掉至少一张牌。这个数字归零，你会在没有窗的会客室里等来「自愿退出」。',
      place: 'below',
    },
    {
      target: '#hand',
      title: '手牌在底部',
      text: '每张卡写明路径、目标、成功率与判定线。把卡拖到地图上对应的城区即可投放；也可以先点卡选中，再点城区执行。',
      place: 'above',
    },
    {
      target: '#map-grid .node[data-district="exchange"]',
      title: '十个城区，十个战场',
      text: '目标属于哪个城区，牌就得送到哪个城区。节点亮绿点代表此处有牌可折，金色感叹号是正在发生的事件，带有颜色的圆点代表这里有人给你派了活。',
      place: 'auto',
    },
    {
      target: '#btn-briefs',
      title: '别人也会给你派活',
      text: '除了自己的牌，每天还有人给你派委托：传唤、事务、人情，甚至要你今天处理掉一个人。委托有硬期限，同时最多三条，超期要付代价。这个按钮上是未处理的数量。',
      place: 'below',
    },
    {
      target: '#dock .dock-tools',
      title: '两条压低判定线的路',
      text: '判定线由卡级别、目标抗性、你的属性、装备与权柄共同决定。勾「加注」花信用点换 +3，或拉动芯片滑块，都能把线压下去。',
      place: 'above',
    },
    {
      target: '#map-hint',
      title: '行动是另一半玩法',
      text: '折牌是掷点，行动是不掷点的那一半：进修涨属性、家业赚钱、情报网显形、善后降罪痕。折一张牌吃掉 2 点行动，所以「今天折牌」和「今天攒资源」是互斥的。',
      place: 'above',
    },
    {
      target: '#rail',
      title: '四个抽屉',
      text: '行动花行动点换资源；名望四轨决定你的死法（忠诚归零被清算、罪痕满值被回收）；「认识」里是你遇见过的所有名字——每天结束都可能有人第一次出现在你面前。命运商店在主页。',
      place: 'right',
    },
    {
      target: '#btn-endday',
      title: '一天结束，一堆账要结',
      text: '结束这一天会推进日期、扣一次期限、给委托倒计时，并触发一个事件。现在开始吧。',
      place: 'above',
    },
  ];

  let idx = 0;
  let onDone = null;
  let bound = false;
  let raf = 0;

  const $ = (id) => document.getElementById(id);

  function start(done) {
    onDone = done || null;
    idx = 0;
    const root = $('tut');
    root.hidden = false;
    $('tut-total').textContent = String(STEPS.length);
    if (!bound) {
      window.addEventListener('resize', schedule);
      window.addEventListener('orientationchange', schedule);
      document.addEventListener('scroll', schedule, true);
      bound = true;
    }
    render();
    // 布局稳定后再校一次，避免字体或图片加载把位置带偏
    setTimeout(place, 60);
    setTimeout(place, 320);
  }

  function schedule() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(place);
  }

  function render() {
    const s = STEPS[idx];
    $('tut-idx').textContent = String(idx + 1);
    $('tut-title').textContent = s.title;
    $('tut-text').textContent = s.text;
    $('tut-next').textContent = idx === STEPS.length - 1 ? '开始游戏' : '下一步';
    place();
  }

  /* ---------- 目标矩形 ---------- */
  function targetRect(sel) {
    if (!sel) return null;
    const els = document.querySelectorAll(sel);
    if (!els.length) return null;
    let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
    els.forEach((el) => {
      if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') return;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return;
      const q = el.getBoundingClientRect();
      if (q.width < 1 || q.height < 1) return;
      l = Math.min(l, q.left); t = Math.min(t, q.top);
      r = Math.max(r, q.right); b = Math.max(b, q.bottom);
    });
    if (l === Infinity) return null;
    // 目标超出视口的部分裁掉，避免框到看不见的地方
    const vw = window.innerWidth, vh = window.innerHeight;
    const nl = Math.max(0, Math.min(l, vw));
    const nt = Math.max(0, Math.min(t, vh));
    const nr = Math.max(0, Math.min(r, vw));
    const nb = Math.max(0, Math.min(b, vh));
    if (nr - nl < 2 || nb - nt < 2) return null;
    return { left: nl, top: nt, right: nr, bottom: nb, width: nr - nl, height: nb - nt };
  }

  /* ---------- 矩形相交面积 ---------- */
  function overlap(a, b) {
    const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    return (w > 0 && h > 0) ? w * h : 0;
  }

  /* ---------- 放置 ---------- */
  function place() {
    const s = STEPS[idx];
    const hole = $('tut-hole');
    const card = $('tut-card');
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const M = 12;
    const PAD = 6;

    const rect = targetRect(s.target);

    // 没有目标：居中，并把框收掉
    if (!rect) {
      hole.style.left = '-9999px';
      hole.style.top = '-9999px';
      hole.style.width = '0px';
      hole.style.height = '0px';
      card.className = 'tut-card center';
      card.style.left = '';
      card.style.top = '';
      return;
    }

    // 高亮框
    hole.style.left = (rect.left - PAD) + 'px';
    hole.style.top = (rect.top - PAD) + 'px';
    hole.style.width = (rect.width + PAD * 2) + 'px';
    hole.style.height = (rect.height + PAD * 2) + 'px';

    // 先让卡片按内容撑开，再量真实尺寸
    card.className = 'tut-card';
    card.style.left = '0px';
    card.style.top = '0px';
    const cw = Math.min(card.offsetWidth || 330, vw - M * 2);
    const chh = card.offsetHeight || 200;
    const cardBox = (x, y) => ({ left: x, top: y, right: x + cw, bottom: y + chh });

    // 底栏与 HUD 也算障碍，避免卡片盖住关键 UI
    const dock = document.getElementById('dock');
    const dockRect = dock ? dock.getBoundingClientRect() : null;
    const hudRect = document.getElementById('hud')
      ? document.getElementById('hud').getBoundingClientRect() : null;

    const cands = [];
    const cx = (l) => Math.max(M, Math.min(l, vw - cw - M));
    const cy = (t) => Math.max(M, Math.min(t, vh - chh - M));

    // 依据每步声明的偏好排优先级
    const prefer = s.place || 'auto';
    const g = 14;
    const below = { x: cx(rect.left), y: cy(rect.bottom + g) };
    const above = { x: cx(rect.left), y: cy(rect.top - chh - g) };
    const right = { x: cx(rect.right + g), y: cy(rect.top) };
    const left = { x: cx(rect.left - cw - g), y: cy(rect.top) };
    const bc = { x: cx((vw - cw) / 2), y: cy(rect.bottom + g) };
    const ac = { x: cx((vw - cw) / 2), y: cy(rect.top - chh - g) };

    const order = {
      below: [below, above, right, left, bc, ac],
      above: [above, below, right, left, ac, bc],
      right: [right, left, below, above, bc, ac],
      left: [left, right, below, above, ac, bc],
      auto: [below, right, above, left, bc, ac],
    }[prefer] || [below, above, right, left, bc, ac];

    order.forEach((c) => cands.push(c));
    // 兜底：四角
    [[M, M], [vw - cw - M, M], [M, vh - chh - M], [vw - cw - M, vh - chh - M]]
      .forEach(([x, y]) => cands.push({ x, y }));

    let best = null, bestScore = -Infinity;
    cands.forEach((c) => {
      const box = cardBox(c.x, c.y);
      let score = 0;
      // 出屏重罚
      if (box.left < 0 || box.top < 0 || box.right > vw || box.bottom > vh) score -= 5000;
      // 压住高亮目标重罚
      score -= overlap(box, rect) / 40;
      // 压住底栏 / HUD 扣分
      if (dockRect) score -= overlap(box, dockRect) / 60;
      if (hudRect) score -= overlap(box, hudRect) / 60;
      // 同向优先（按 order 顺序给递减权重）
      score -= cands.indexOf(c) * 0.5;
      // 稍微偏好落在上半屏，视线更顺
      score -= Math.abs(box.top) / 100;
      if (score > bestScore) { bestScore = score; best = c; }
    });

    card.style.left = Math.round(best.x) + 'px';
    card.style.top = Math.round(best.y) + 'px';
  }

  function next() {
    if (idx >= STEPS.length - 1) return finish();
    idx += 1;
    render();
  }

  function finish() {
    $('tut').hidden = true;
    try { localStorage.setItem('sdd.tutorialDone', '1'); } catch (e) { /* 隐私模式 */ }
    if (onDone) onDone();
  }

  function isDone() {
    try { return localStorage.getItem('sdd.tutorialDone') === '1'; } catch (e) { return false; }
  }

  function reset() {
    try { localStorage.removeItem('sdd.tutorialDone'); } catch (e) { /* 忽略 */ }
    start();
  }

  function bind() {
    $('tut-next').onclick = next;
    $('tut-skip').onclick = finish;
    document.addEventListener('keydown', (e) => {
      if ($('tut').hidden) return;
      if (e.key === 'Enter' || e.key === 'ArrowRight') next();
      if (e.key === 'Escape') finish();
    });
  }

  window.GAME_TUTORIAL = { start, isDone, reset, bind, place, STEPS };
})();
