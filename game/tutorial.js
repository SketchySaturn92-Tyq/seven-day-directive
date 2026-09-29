/* ==========================================================
   《七日指令》新手教程 —— 聚光灯分步引导
   ========================================================== */
(function () {
  'use strict';

  const STEPS = [
    {
      target: null,
      title: '这是一场牌局，也是一场审判',
      text: '你是穹顶集团的中层。董事会把一副牌推到你面前：手里这副「指令卡」共 12 张，每折掉一张，期限就重置一次。折完全部 12 张，你活下来。',
    },
    {
      target: '#hud .hud-deadline',
      title: '七天，一条命',
      text: '每七天必须折掉至少一张指令卡。倒计时归零，你会在没有窗的会客室里等来「自愿退出」。',
    },
    {
      target: '#hand',
      title: '手牌在底部',
      text: '每张卡写明了路径、目标、判定线和成功率。把卡拖到地图上对应的城区即可投放；也可以轻点卡片选中，再点城区执行。',
    },
    {
      target: '#map-grid .node',
      title: '六个城区，六个战场',
      text: '目标属于哪个城区，卡就得送到哪个城区。节点上的绿点表示此处有牌可折，金色感叹号表示这里正在发生事件。',
    },
    {
      target: '#map-hint',
      title: '成功率不是运气',
      text: '判定线由卡级别、目标抗性、你的属性、装备和权柄共同决定。点「加注」花信用点，或用底部滑块投入芯片，都能把线压下去。',
    },
    {
      target: '#rail',
      title: '四个抽屉',
      text: '行动花行动点换资源。名望四轨决定你的死法：忠诚归零被清算，罪痕满值被回收。商店用命运点买永久强化，记录里是全部历史。',
    },
    {
      target: '#btn-endday',
      title: '一天结束，一件事发生',
      text: '结束这一天会推进日期、扣一次期限，并触发一个事件。事件的选择会写进你的名望。现在，开始吧。',
    },
  ];

  let idx = 0;
  let onDone = null;
  let resizeBound = false;

  const $ = (id) => document.getElementById(id);

  function start(done) {
    onDone = done || null;
    idx = 0;
    $('tut').hidden = false;
    $('tut-total').textContent = String(STEPS.length);
    if (!resizeBound) {
      window.addEventListener('resize', place);
      resizeBound = true;
    }
    render();
  }

  function render() {
    const s = STEPS[idx];
    $('tut-idx').textContent = String(idx + 1);
    $('tut-title').textContent = s.title;
    $('tut-text').textContent = s.text;
    $('tut-next').textContent = idx === STEPS.length - 1 ? '开始游戏' : '下一步';
    place();
  }

  function place() {
    const s = STEPS[idx];
    const hole = $('tut-hole');
    const card = $('tut-card');
    const pad = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let rect = null;
    if (s.target) {
      const els = document.querySelectorAll(s.target);
      if (els.length) {
        // 多个元素时取并集
        let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
        els.forEach((el) => {
          const q = el.getBoundingClientRect();
          if (q.width === 0 && q.height === 0) return;
          l = Math.min(l, q.left); t = Math.min(t, q.top);
          r = Math.max(r, q.right); b = Math.max(b, q.bottom);
        });
        if (l !== Infinity) rect = { left: l, top: t, right: r, bottom: b, width: r - l, height: b - t };
      }
    }

    if (!rect) {
      hole.style.left = '-9999px';
      hole.style.top = '-9999px';
      hole.style.width = '0px';
      hole.style.height = '0px';
      card.className = 'tut-card center';
      card.style.left = ''; card.style.top = '';
      return;
    }

    hole.style.left = (rect.left - pad) + 'px';
    hole.style.top = (rect.top - pad) + 'px';
    hole.style.width = (rect.width + pad * 2) + 'px';
    hole.style.height = (rect.height + pad * 2) + 'px';

    card.className = 'tut-card';
    const cw = 340, ch = 200;
    let cx, cy;
    // 优先放元素下方
    if (rect.bottom + ch + 24 < vh) {
      cy = rect.bottom + 16;
      cx = Math.min(Math.max(rect.left, 12), vw - cw - 12);
    } else if (rect.top - ch - 24 > 0) {
      cy = rect.top - ch - 16;
      cx = Math.min(Math.max(rect.left, 12), vw - cw - 12);
    } else {
      cx = Math.min(Math.max(rect.right + 16, 12), vw - cw - 12);
      cy = Math.min(Math.max(rect.top, 12), vh - ch - 12);
    }
    card.style.left = cx + 'px';
    card.style.top = cy + 'px';
  }

  function next() {
    if (idx >= STEPS.length - 1) return finish();
    idx += 1;
    render();
  }

  function finish() {
    $('tut').hidden = true;
    localStorage.setItem('sdd.tutorialDone', '1');
    if (onDone) onDone();
  }

  function isDone() {
    return localStorage.getItem('sdd.tutorialDone') === '1';
  }

  function reset() {
    localStorage.removeItem('sdd.tutorialDone');
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

  window.GAME_TUTORIAL = { start, isDone, reset, bind, STEPS };
})();
