#!/usr/bin/env node
/* ==========================================================
   《七日指令》自检脚本
   以前所有验证脚本都散在 /tmp，不进仓库、换台机器就没了。
   这个脚本只依赖 node，不需要浏览器，能跑的就跑：
     1) 每个 game/*.js 语法检查
     2) 数据层结构断言（条数、id 唯一、枚举合法、引号合规）
     3) 事件门控：候选池不能饿死
     4) 平衡模拟：跑 N 局看通关率与结局分布
     5) bundle 是否包含关键模块

   用法：
     node scripts/verify.js              全部检查
     node scripts/verify.js data         只跑数据层
     node scripts/verify.js sim 200      跑 200 局模拟
   ========================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const GAME = path.join(ROOT, 'game');

let pass = 0, fail = 0;
const failures = [];

function ok(msg) { pass++; console.log('  \x1b[32m✓\x1b[0m ' + msg); }
function bad(msg, detail) {
  fail++; failures.push(msg + (detail ? ' — ' + detail : ''));
  console.log('  \x1b[31m✗\x1b[0m ' + msg + (detail ? ' — ' + detail : ''));
}
function head(t) { console.log('\n\x1b[1m' + t + '\x1b[0m'); }

/* ---------------- 载入顺序：直接读 build.sh，避免两处维护 ---------------- */
function loadOrder() {
  const sh = fs.readFileSync(path.join(ROOT, 'build.sh'), 'utf8');
  const m = sh.match(/game\/[\w.-]+\.js/g) || [];
  return [...new Set(m)].filter((f) => !f.includes('bundle'));
}

/* 在干净的 vm 上下文里按顺序执行数据层，模拟浏览器 window */
function loadGame() {
  const vm = require('vm');
  const sandbox = { console: console, Math: Math, JSON: JSON, Date: Date };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  const loaded = [];
  const skipped = [];
  for (const rel of loadOrder()) {
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) { skipped.push(rel + '（不存在）'); continue; }
    const src = fs.readFileSync(p, 'utf8');
    /* UI / DOM 相关模块在 node 里跑不了，跳过它们的副作用 */
    if (/ui\.js|map\.js|dialogue\.js/.test(rel)) { skipped.push(rel); continue; }
    try {
      vm.runInContext(src, sandbox, { filename: rel });
      loaded.push(rel);
    } catch (e) {
      skipped.push(rel + '（' + e.message.slice(0, 60) + '）');
    }
  }
  return { W: sandbox, loaded, skipped };
}

/* ==========================================================
   一、语法
   ========================================================== */
function checkSyntax() {
  head('一、语法检查');
  const files = fs.readdirSync(GAME).filter((f) => f.endsWith('.js') && f !== 'bundle.js');
  let bad_n = 0;
  for (const f of files) {
    try {
      execFileSync(process.execPath, ['--check', path.join(GAME, f)], { stdio: 'pipe' });
    } catch (e) {
      bad_n++;
      bad('语法 ' + f, String(e.stderr || e.message).split('\n')[0].slice(0, 100));
    }
  }
  if (!bad_n) ok(files.length + ' 个源文件语法全部通过');
  return files.length;
}

/* ==========================================================
   二、数据层
   ========================================================== */
function checkData(g) {
  head('二、数据层');
  const W = g.W;
  const D = W.GAME_DATA;
  if (!D) { bad('GAME_DATA 未挂载'); return; }

  /* 基本表 */
  const tables = [
    ['城区', D.DISTRICTS], ['路径', D.PATHS], ['品级', D.TIERS],
    ['属性', D.STATS], ['名望轨道', D.TRACKS], ['出身', D.ORIGINS],
    ['资产', D.ASSETS], ['行动', D.ACTIONS], ['事件', D.EVENTS], ['结局', D.ENDINGS],
  ];
  tables.forEach(([n, arr]) => {
    if (Array.isArray(arr) && arr.length) ok(n + ' ' + arr.length + ' 条');
    else bad(n + ' 为空或不是数组');
  });

  /* id 唯一性 */
  const idSets = [
    ['事件', D.EVENTS], ['结局', D.ENDINGS], ['资产', D.ASSETS],
    ['城区', D.DISTRICTS], ['行动', D.ACTIONS],
  ];
  idSets.forEach(([n, arr]) => {
    const seen = {};
    const dup = [];
    (arr || []).forEach((x) => { if (seen[x.id]) dup.push(x.id); seen[x.id] = 1; });
    if (dup.length) bad(n + ' id 重复', dup.slice(0, 5).join(','));
    else ok(n + ' id 唯一（' + (arr || []).length + '）');
  });

  /* 每件事都必须有来源：卡牌来源表要能覆盖全部路径 */
  const CS = W.CARD_SOURCES || [];
  const kinds = {};
  CS.forEach((c) => { kinds[c.kind || c.source] = (kinds[c.kind || c.source] || 0) + 1; });
  if (CS.length >= 20 && kinds.npc) ok('卡牌来源 ' + CS.length + ' 条（npc ' + kinds.npc + '）');
  else bad('卡牌来源不足或缺少 npc 类', JSON.stringify(kinds));

  /* 结局：每条都要有显式 priority，且数值唯一 */
  const noPrio = (D.ENDINGS || []).filter((e) => e.priority == null).map((e) => e.id);
  if (noPrio.length) bad('结局缺 priority', noPrio.join(','));
  else {
    const pv = {};
    const clash = [];
    D.ENDINGS.forEach((e) => { if (pv[e.priority]) clash.push(e.id + '/' + pv[e.priority]); pv[e.priority] = e.id; });
    if (clash.length) bad('结局 priority 有并列', clash.join(','));
    else ok('结局 ' + D.ENDINGS.length + ' 条，priority 齐全且唯一');
  }

  /* 后日谈与结局一一对应 */
  const AF = W.AFTERSTORY || {};
  const missAfter = (D.ENDINGS || []).filter((e) => !AF[e.id]).map((e) => e.id);
  if (missAfter.length) bad('结局缺后日谈', missAfter.join(','));
  else ok('后日谈覆盖全部 ' + D.ENDINGS.length + ' 个结局');

  /* 事件门控：每条事件都要在表里 */
  const GATES = W.EVENT_GATES || {};
  const noGate = (D.EVENTS || []).filter((e) => !GATES[e.id]).map((e) => e.id);
  if (noGate.length) bad('事件缺门控', noGate.slice(0, 8).join(',') + (noGate.length > 8 ? ' 等 ' + noGate.length + ' 条' : ''));
  else ok('事件门控覆盖全部 ' + D.EVENTS.length + ' 条');

  /* 引号合规：中文正文里不允许出现弯引号 */
  const quoteFiles = ['content-extra.js', 'content-v2.js', 'content-map2.js', 'content-briefs.js',
    'content-briefs2.js', 'events-v6.js', 'card-sources.js', 'story-main.js',
    'story-npc-a.js', 'story-npc-b.js', 'story-npc-a2.js', 'story-npc-b2.js', 'afterstory.js'];
  let qBad = [];
  quoteFiles.forEach((f) => {
    const p = path.join(GAME, f);
    if (!fs.existsSync(p)) return;
    const raw = fs.readFileSync(p, 'utf8');
    const n = (raw.match(/[“”‘’]/g) || []).length;
    if (n) qBad.push(f + ' ×' + n);
  });
  if (qBad.length) bad('存在弯引号', qBad.join(' '));
  else ok('中文正文引号合规（' + quoteFiles.length + ' 个文件）');

  /* 委托字段合法性 */
  const pool = (W.BRIEFS || []).concat(W.BRIEFS2 || []);
  if (pool.length) {
    const badKind = pool.filter((b) => b.kind && !/^(demand|summon|blood|favor|trap)$/.test(b.kind)).map((b) => b.id);
    const badSolve = pool.filter((b) => !b.solve || !/^(resource|stat|district|fold)$/.test(b.solve.type)).map((b) => b.id);
    if (badKind.length) bad('委托 kind 非法', badKind.slice(0, 5).join(','));
    else if (badSolve.length) bad('委托 solve 类型非法', badSolve.slice(0, 5).join(','));
    else ok('委托 ' + pool.length + ' 条，kind 与 solve 合法');
  } else bad('委托库为空');

  /* 支线：每条选项都要有 after */
  const scenes = [].concat(W.STORY_MAIN || [], W.STORY_NPC_A || [], W.STORY_NPC_B || [],
    W.STORY_NPC_A2 || [], W.STORY_NPC_B2 || []);
  if (scenes.length) {
    let noAfter = 0, noOpts = 0;
    scenes.forEach((sc) => {
      if (!sc.options || !sc.options.length) { noOpts++; return; }
      sc.options.forEach((o) => { if (!o.after) noAfter++; });
    });
    if (noOpts) bad('剧情场景缺选项', noOpts + ' 场');
    else if (noAfter) bad('剧情选项缺 after', noAfter + ' 处');
    else ok('剧情 ' + scenes.length + ' 场，选项 after 全覆盖');
  } else bad('剧情库为空');
}

/* ==========================================================
   三、事件门控候选池
   ========================================================== */
function checkGates(g) {
  head('三、事件门控候选池');
  const W = g.W;
  const D = W.GAME_DATA, E = W.GAME_ENGINE;
  if (!E || !E.evPass) { bad('evPass 未导出'); return; }

  const mk = (day, folded, met) => ({
    day: day, folded: folded, metNpcs: met || {},
    tracks: { loyalty: 5, renown: 3, sin: 2, power: 2 },
    stats: { intellect: 5, charm: 4, force: 3, stealth: 3, vitality: 3 },
    storyFlags: {},
  });

  /* 前三天必须有足够的事件可抽，否则叙事会空转 */
  const early = [[1, 0], [2, 0], [2, 1], [3, 1], [3, 2], [4, 3]];
  let thin = [];
  early.forEach(([d, f]) => {
    const n = D.EVENTS.filter((e) => E.evPass(mk(d, f), e)).length;
    if (n < 8) thin.push('D' + d + '/折' + f + ' 只有 ' + n + ' 条');
  });
  if (thin.length) bad('早期候选池过小', thin.join('；'));
  else ok('早期（D1-D4）候选池均 ≥8 条');

  /* 后期不能全部挤满，重事件要留到后面 */
  const late = D.EVENTS.filter((e) => E.evPass(mk(8, 11), e)).length;
  if (late >= 20) ok('后期（D8/折11）候选 ' + late + ' 条');
  else bad('后期候选池过小', late + ' 条');

  /* 初见去重 */
  const met = { 'wen-duo': 1 };
  const a = D.EVENTS.filter((e) => /初见/.test(e.title || '') && E.evPass(mk(3, 1), e)).length;
  const b = D.EVENTS.filter((e) => /初见/.test(e.title || '') && E.evPass(mk(3, 1, met), e)).length;
  if (b < a) ok('初见去重生效（认识闻铎后少 ' + (a - b) + ' 条）');
  else bad('初见去重未生效', 'a=' + a + ' b=' + b);

  /* 抽 500 次不能抛异常、不能返回 null */
  let nulls = 0, errs = 0;
  const s = mk(4, 3);
  for (let i = 0; i < 500; i++) {
    try { if (!E.pickEvent || !E.pickEvent(s)) nulls++; } catch (e) { errs++; }
  }
  if (errs) bad('pickEvent 抛异常', errs + ' 次');
  else if (nulls) bad('pickEvent 返回空', nulls + ' 次');
  else if (E.pickEvent) ok('pickEvent 连抽 500 次无异常无空值');
}

/* ==========================================================
   四、结算
   ========================================================== */
function checkScoring(g) {
  head('四、结算计分');
  const W = g.W;
  const M = W.GAME_META;
  if (!M || !M.scoreRun) { bad('scoreRun 未导出'); return; }

  const base = {
    folded: 12, fortune: 24, day: 9, briefDone: 4, briefExpired: 1, briefRefused: 0,
    metNpcs: { a: 1, b: 1, c: 1 }, tracks: { loyalty: 6, renown: 7, sin: 3, power: 8 },
    ending: { id: 'emperor', name: '穹顶之上的名字' },
  };
  const r1 = M.scoreRun(base);
  const r2 = M.scoreRun(Object.assign({}, base, { ending: { id: 'broken', name: '三十六层高的自由落体' } }));
  const r3 = M.scoreRun(Object.assign({}, base, { ending: { id: 'v2_true', name: '牌不再发下来' } }));

  if (r3.total > r1.total && r1.total > r2.total) {
    ok('结局分量分层正确（真好 ' + r3.total + ' > 权柄 ' + r1.total + ' > 失败 ' + r2.total + '）');
  } else {
    bad('结局分量未分层', r3.total + ' / ' + r1.total + ' / ' + r2.total);
  }

  /* 明细行数要够，且合计对得上 */
  if (r1.rows.length >= 6) ok('结算明细 ' + r1.rows.length + ' 行');
  else bad('结算明细过少', r1.rows.length + ' 行');

  const sum = r1.rows.reduce((a, x) => a + x.value, 0);
  if (sum === r1.total) ok('明细合计与总分一致（' + sum + '）');
  else bad('明细合计对不上', sum + ' vs ' + r1.total);

  /* 失败局不能给出比成功局还高的分 */
  const dead = M.scoreRun({
    folded: 0, fortune: 0, day: 8, briefDone: 0, briefExpired: 0, briefRefused: 0,
    metNpcs: {}, tracks: { loyalty: 0, renown: 0, sin: 3, power: 0 },
    ending: { id: 'broken', name: '三十六层高的自由落体' },
  });
  if (dead.total < r1.total) ok('失败局得分低于通关局（' + dead.total + ' < ' + r1.total + '）');
  else bad('失败局得分不合理', dead.total + ' vs ' + r1.total);

  /* 全部结局都要有分量定义 */
  const ES = M.ENDING_SCORE || {};
  const missing = (W.GAME_DATA.ENDINGS || []).filter((e) => ES[e.id] == null).map((e) => e.id);
  if (missing.length) bad('结局缺分量定义', missing.join(','));
  else ok('结局分量覆盖全部 ' + W.GAME_DATA.ENDINGS.length + ' 个结局');
}

/* ==========================================================
   五、平衡模拟
   ========================================================== */
function simulate(g, N) {
  const W = g.W;
  const D = W.GAME_DATA, E = W.GAME_ENGINE, B = W.GAME_BRIEFS, ST = W.GAME_STORY;

  function play(oid, seed) {
    const s = E.newGame(oid, seed);
    if (ST && ST.ensureGuide) ST.ensureGuide(s);
    let guard = 0;
    while (s.phase !== 'end' && guard++ < 1500) {
      if (s.pendingStory) { const sc = s.pendingStory; s.pendingStory = null; E.resolveStory(s, sc, 0); continue; }
      if (s.pendingEvent) { s.pendingEvent = null; E.resolveEvent(s, 0); continue; }
      const free = (s.briefs || []).find((b) => B.canSolve(s, b).ok);
      if (free) { B.solve(s, free.uid); continue; }
      const soon = (s.briefs || []).find((b) => b.left <= 1);
      if (soon) { B.refuse(s, soon.uid); continue; }
      let best = null;
      s.hand.forEach((c) => {
        if (!E.canFold(s, c).ok) return;
        const r = E.successRate(s, c);
        if (!best || r > best.r) best = { c: c, r: r };
      });
      if (best && best.r >= 0.55) { if (E.fold(s, best.c.uid, false, 0).ok) continue; }
      if (best && s.chips >= 6 && best.r >= 0.35) { if (E.fold(s, best.c.uid, false, 3).ok) continue; }
      if (s.hand.length <= 2 && s.deck.length && s.ap >= 2) {
        if (D.ACTIONS.some((a) => a.id === 'draw') && E.doAction(s, 'draw').ok) continue;
      }
      let acted = false;
      for (const a of ['study', 'biz', 'brief', 'intel', 'field']) {
        const d = D.ACTIONS.find((x) => x.id === a);
        if (d && s.ap >= d.cost && E.doAction(s, a).ok) { acted = true; break; }
      }
      if (acted) continue;
      E.endDay(s);
    }
    return s;
  }

  let wins = 0, stuck = 0, sumHand = 0, sumDay = 0;
  const endings = {};
  for (let i = 0; i < N; i++) {
    const s = play('clerk', 'verify-' + i);
    if (s.folded >= 12) wins++;
    if (s.hand.length === 0 && s.deck.length > 0) stuck++;
    sumHand += s.hand.length;
    sumDay += s.day;
    const k = s.ending ? s.ending.id : 'none';
    endings[k] = (endings[k] || 0) + 1;
  }
  return { N, wins, stuck, sumHand, sumDay, endings };
}

function checkSim(g, N) {
  head('五、平衡模拟（' + N + ' 局）');
  const r = simulate(g, N);
  const rate = r.wins / r.N * 100;
  console.log('  通关率 ' + rate.toFixed(1) + '% | 平均终局手牌 ' +
    (r.sumHand / r.N).toFixed(1) + ' | 平均存活 ' + (r.sumDay / r.N).toFixed(1) + ' 天');

  if (rate >= 55 && rate <= 96) ok('通关率在合理区间（55%-96%）');
  else bad('通关率异常', rate.toFixed(1) + '%');

  if (r.stuck === 0) ok('无「有牌堆却无牌可折」的死局');
  else bad('出现死局', r.stuck + ' 局');

  const distinct = Object.keys(r.endings).length;
  if (distinct >= 3) ok('触达 ' + distinct + ' 种结局');
  else bad('结局过于集中', distinct + ' 种');

  const names = {};
  (g.W.GAME_DATA.ENDINGS || []).forEach((e) => { names[e.id] = e.name; });
  Object.keys(r.endings).sort((a, b) => r.endings[b] - r.endings[a]).forEach((k) => {
    console.log('    ' + String(names[k] || k).padEnd(12) + r.endings[k]);
  });
}

/* ==========================================================
   六、产物
   ========================================================== */
function checkBundle() {
  head('六、构建产物');
  const bp = path.join(GAME, 'bundle.js');
  const cp = path.join(ROOT, 'bundle.css');
  if (!fs.existsSync(bp)) { bad('game/bundle.js 不存在，先跑 ./build.sh'); return; }
  const b = fs.readFileSync(bp, 'utf8');
  const must = {
    '起点三张': 'startHand',
    '申领行动': "'draw'",
    '卡牌来源表': 'CARD_SOURCES',
    '事件门控表': 'EVENT_GATES',
    '剧情条件族': 'describeWhen',
    '结算明细': 'scoreRun',
    '结局优先级': 'priority',
  };
  let missing = [];
  Object.keys(must).forEach((k) => { if (!b.includes(must[k])) missing.push(k); });
  if (missing.length) bad('bundle 缺少模块', missing.join('、'));
  else ok('bundle 含全部关键模块（' + (b.length / 1024).toFixed(0) + 'KB）');

  if (fs.existsSync(cp)) {
    const c = fs.readFileSync(cp, 'utf8');
    const cssMust = { '卡牌名条': 'card-band', '曜金描金': '.card.t3', '结算明细': 'end-breakdown' };
    const cm = Object.keys(cssMust).filter((k) => !c.includes(cssMust[k]));
    if (cm.length) bad('bundle.css 缺少样式', cm.join('、'));
    else ok('bundle.css 含全部关键样式（' + (c.length / 1024).toFixed(0) + 'KB）');
  } else bad('bundle.css 不存在');
}

/* ==========================================================
   主流程
   ========================================================== */
const mode = process.argv[2] || 'all';
const N = parseInt(process.argv[3], 10) || 120;

console.log('\x1b[1m《七日指令》自检\x1b[0m  ' + new Date().toISOString().replace('T', ' ').slice(0, 19));

if (mode === 'all' || mode === 'syntax') checkSyntax();

let g = null;
if (mode !== 'syntax') {
  g = loadGame();
  if (g.skipped.length) console.log('\n跳过：' + g.skipped.join('、'));
}
if (mode === 'all' || mode === 'data') { checkData(g); checkScoring(g); }
if (mode === 'all' || mode === 'data' || mode === 'gates') checkGates(g);
if (mode === 'all' || mode === 'sim') checkSim(g, mode === 'sim' ? (parseInt(process.argv[3], 10) || 120) : N);
if (mode === 'all' || mode === 'bundle') checkBundle();

console.log('\n' + (fail === 0
  ? '\x1b[32m全部通过\x1b[0m（' + pass + ' 项）'
  : '\x1b[31m' + fail + ' 项失败\x1b[0m，' + pass + ' 项通过'));
if (fail) { failures.forEach((f) => console.log('  · ' + f)); process.exit(1); }
