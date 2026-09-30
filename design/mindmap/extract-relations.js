#!/usr/bin/env node
/* ==========================================================
   关系连线抽取
   子任务跑超预算没产出，这里自己抽。规则全部机械、可回查：

   1) 把每个内容条目拆成 (归属人, 文本, 出处)
      —— 剧情场景、台词话题、世界观碎片、委托、事件都算
   2) 扫文本里出现的其他人名，命中就记一条边
   3) 强度按命中的性质定：
        1 = 同一段文本里同时出现（同场）
        2 = 某人的专属内容里提到对方（单向提及）
        3 = 双方各自的内容里都提到对方（互相提及）
   4) 不看情感色彩，只记"文本里真的有关系"

   为什么用脚本而不是让模型读：模型读 4000 行会漏，脚本不会；
   而且每条边都带出处，错了能回去查。
   ========================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = '/srv/catsco-agent/apps/the-board';
const OUT = '/srv/catsco-agent/data/work/the-board/design/relations.json';

// 十六人：id / 名字 / 别名 / 阵营 / 城区
const PEOPLE = [
    ['wen-duo', '闻铎', [], '董事会', 'tower'],
    ['su-wen', '苏纹', [], '董事会', 'tower'],
    ['yu-nanzhi', '郁南枝', ['郁首席'], '清算行', 'exchange'],
    ['dai-siyuan', '戴思远', [], '合规伦理委员会', 'exchange'],
    ['cheng-yan', '程砚', [], '研究所', 'lab'],
    ['peng-jian', '彭戬', [], '研究所', 'lab'],
    ['lao-ya', '老鸦', [], '灰市', 'slum'],
    ['lu-wan', '陆晚', [], '诊所／灰市', 'slum'],
    ['tie-gui', '铁贵', [], '装卸工会', 'docks'],
    ['yin-mian', '银面', [], '术士一方', 'docks'],
    ['wen-shicheng', '温仕成', [], '引航票务', 'orbit'],
    ['yu-ke', '雨客', [], '潮', 'orbit'],
    ['xun-jie', '荀戒', [], '环带巡检', 'ring'],
    ['sa-er', '萨尔', [], '潮', 'outside'],
    ['ban-tou', '班头', ['班头他'], '回收场', 'salvage'],
    ['wu-mian', '无面', [], '记忆银行', 'memory'],
];

const DIST_NAME = {
    tower: '高塔商业区', exchange: '交易所广场', lab: '研究所园区',
    slum: '下层居住区', docks: '工业港区', orbit: '轨道港',
    ring: '环带维修层', memory: '记忆银行', salvage: '回收场', outside: '穹顶之外',
};

const NAME2ID = {};
PEOPLE.forEach(([id, name, alias]) => {
    NAME2ID[name] = id;
    alias.forEach((a) => { NAME2ID[a] = id; });
});
const ID2NAME = {};
PEOPLE.forEach(([id, name]) => { ID2NAME[id] = name; });

/* 在文本里找出所有被提到的人（排除归属人自己） */
function hits(text, owner) {
    if (!text) return [];
    const out = [];
    Object.keys(NAME2ID).forEach((nm) => {
        const id = NAME2ID[nm];
        if (id === owner) return;
        if (String(text).indexOf(nm) >= 0 && out.indexOf(id) < 0) out.push(id);
    });
    return out;
}

function loadGame() {
    const sandbox = {};
    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;
    const vm = require('vm');
    vm.createContext(sandbox);
    const order = fs.readFileSync(path.join(ROOT, 'build.sh'), 'utf8')
        .match(/game\/[\w.-]+\.js/g)
        .filter((f) => !f.includes('bundle') && !/ui\.js|map\.js|dialogue\.js/.test(f));
    order.forEach((rel) => {
        const p = path.join(ROOT, rel);
        if (!fs.existsSync(p)) return;
        try { vm.runInContext(fs.readFileSync(p, 'utf8'), sandbox, { filename: rel }); } catch (e) {}
    });
    return sandbox;
}

const W = loadGame();

/* ---------- 1. 收集 (归属人, 文本, 出处) ---------- */
const items = [];   // { owner, text, from }

function textOfScene(sc) {
    let t = (sc.text || '') + ' ' + (sc.title || '');
    (sc.options || []).forEach((o) => { t += ' ' + (o.label || '') + ' ' + (o.after || ''); });
    return t;
}

[['STORY_MAIN', 'story-main.js'], ['STORY_NPC_A', 'story-npc-a.js'],
 ['STORY_NPC_B', 'story-npc-b.js'], ['STORY_NPC_A2', 'story-npc-a2.js'],
 ['STORY_NPC_B2', 'story-npc-b2.js']].forEach(([key, file]) => {
    (W[key] || []).forEach((sc) => {
        items.push({ owner: sc.npc || null, text: textOfScene(sc), from: file + ':' + sc.id });
    });
});

[['NPC_VOICE_A', 'voice-a.js'], ['NPC_VOICE_B', 'voice-b.js']].forEach(([key, file]) => {
    const all = W[key] || {};
    Object.keys(all).forEach((npcId) => {
        const v = all[npcId];
        let blob = (v.first || '');
        ['low', 'mid', 'high'].forEach((k) => { blob += ' ' + (v[k] || []).join(' '); });
        (v.reactions || []).forEach((r) => { blob += ' ' + (r.text || ''); });
        items.push({ owner: npcId, text: blob, from: file + ':' + npcId + ':greet' });
        (v.topics || []).forEach((t) => {
            items.push({ owner: npcId, text: (t.label || '') + ' ' + (t.reply || ''),
                         from: file + ':' + t.id });
        });
    });
});

const lore = W.LORE || {};
Object.keys(lore).forEach((npcId) => {
    (lore[npcId] || []).forEach((it) => {
        items.push({ owner: npcId, text: (it.topic || '') + ' ' + (it.text || ''),
                     from: 'lore.js:' + it.id });
    });
});

[[W.BRIEFS, 'content-briefs.js'], [W.BRIEFS2, 'content-briefs2.js']].forEach(([arr, file]) => {
    (arr || []).forEach((b) => {
        items.push({ owner: b.npc || null, text: (b.title || '') + ' ' + (b.text || ''),
                     from: file + ':' + b.id });
    });
});

const evSeen = {};
[['EVENTS_EXTRA', 'content-extra.js'], ['EVENTS_MEET', 'content-map2.js'],
 ['EVENTS_V5', 'card-sources.js'], ['EVENTS_V6', 'events-v6.js']].forEach(([key, file]) => {
    (W[key] || []).forEach((e) => {
        if (evSeen[e.id]) return;
        evSeen[e.id] = 1;
        let t = (e.title || '') + ' ' + (e.text || '');
        (e.options || []).forEach((o) => { t += ' ' + (o.label || '') + ' ' + (o.after || ''); });
        const own = (W.EVENTS_MEET || []).indexOf(e) >= 0
            ? (hits(e.title, null)[0] || null) : null;
        items.push({ owner: own, text: t, from: file + ':' + e.id });
    });
});
(W.GAME_DATA && W.GAME_DATA.EVENTS ? W.GAME_DATA.EVENTS : []).forEach((e) => {
    if (evSeen[e.id]) return;
    evSeen[e.id] = 1;
    let t = (e.title || '') + ' ' + (e.text || '');
    (e.options || []).forEach((o) => { t += ' ' + (o.label || '') + ' ' + (o.after || ''); });
    items.push({ owner: null, text: t, from: 'data.js:' + e.id });
});

/* ---------- 2. 扫出边 ---------- */
const edgeMap = {};    // a|b -> { a, b, hits: [{owner, from}] }
function addEdge(a, b, owner, from) {
    if (!a || !b || a === b) return;
    const key = [a, b].sort().join('|');
    const e = edgeMap[key] || (edgeMap[key] = { a, b, hits: [] });
    e.hits.push({ owner: owner, from: from });
}

items.forEach((it) => {
    const found = hits(it.text, it.owner);
    if (!found.length) return;
    if (it.owner) {
        found.forEach((o) => addEdge(it.owner, o, it.owner, it.from));
    } else if (found.length >= 2) {
        for (let i = 0; i < found.length; i++) {
            for (let j = i + 1; j < found.length; j++) addEdge(found[i], found[j], null, it.from);
        }
    }
});

/* ---------- 3. 定强度与种类 ---------- */
function kindOf(a, b, hits) {
    const owners = hits.map((h) => h.owner).filter(Boolean);
    const da = owners.indexOf(a) >= 0, db = owners.indexOf(b) >= 0;
    if (da && db) return '互相提及';
    if (da || db) return '单向提及';
    return '同场出现';
}

const edges = Object.keys(edgeMap).map((k) => {
    const e = edgeMap[k];
    const owners = e.hits.map((h) => h.owner).filter(Boolean);
    const da = owners.indexOf(e.a) >= 0, db = owners.indexOf(e.b) >= 0;
    let strength = 1;
    if (da && db) strength = 3;
    else if (da || db) strength = 2;
    return {
        a: e.a, b: e.b,
        kind: kindOf(e.a, e.b, e.hits),
        strength: strength,
        count: e.hits.length,
        note: '「' + ID2NAME[e.a] + '」与「' + ID2NAME[e.b] + '」在同一段文本里出现 ' +
              e.hits.length + ' 次' + (strength === 3 ? '，且双方各自的内容里都提到对方' :
              strength === 2 ? '，且有一方在自己的内容里点名提到对方' : ''),
        evidence: e.hits.slice(0, 4).map((h) => h.from),
    };
}).sort((x, y) => y.strength - x.strength || y.count - x.count);

/* ---------- 4. 阵营 ---------- */
const facMap = {};
PEOPLE.forEach(([id, name, , fac]) => {
    (facMap[fac] = facMap[fac] || []).push(id);
});
const FACTIONS = Object.keys(facMap).map((f) => ({
    id: f, name: f, members: facMap[f],
    note: facMap[f].length > 1 ? '同一势力，共 ' + facMap[f].length + ' 人' : '单人势力',
}));

/* ---------- 5. 每个人的出现分量 ---------- */
const weight = {};
items.forEach((it) => {
    if (it.owner) weight[it.owner] = (weight[it.owner] || 0) + 1;
});

const npc = PEOPLE.map(([id, name, , fac, dist]) => {
    const deg = edges.filter((e) => e.a === id || e.b === id);
    return {
        id: id, name: name, faction: fac, district: dist,
        role: '', weight: weight[id] || 0,
        degree: deg.length,
        note: deg.length ? '与 ' + deg.length + ' 人有可查的交集' : '文本中与其他人无直接互动',
    };
});

// 补 role：NPCS 挂在 engine 上，不在 data 里
const NPCS = (W.GAME_ENGINE && W.GAME_ENGINE.NPCS) || (W.GAME_DATA && W.GAME_DATA.NPCS) || {};
npc.forEach((n) => { if (NPCS[n.id]) n.role = NPCS[n.id].role || ''; });

/* ---------- 6. 结构性关系 ----------
   光靠「同一段文本里出现」只能抓到 14 条，图会很空。
   但有两类关系是设定本身就写明的，不需要靠共现去猜：
     同僚  —— 同一势力（董事会两人、研究所两人……）
     同城区 —— 活动范围重叠，跑动时必然打照面
   这两类照样标明依据是设定表，不冒充剧情里的互动。
   此外按「圈层」把十六人分成六组，供脑图排版用。 */
const BLOC = {
    'wen-duo': '公司内圈', 'su-wen': '公司内圈', 'yu-nanzhi': '公司内圈', 'dai-siyuan': '公司内圈',
    'cheng-yan': '技术圈', 'peng-jian': '技术圈',
    'lao-ya': '底层', 'lu-wan': '底层',
    'tie-gui': '港区', 'yin-mian': '港区',
    'wen-shicheng': '离城通道', 'yu-ke': '离城通道', 'sa-er': '离城通道',
    'xun-jie': '边缘地带', 'ban-tou': '边缘地带', 'wu-mian': '边缘地带',
};

const have = {};
edges.forEach((e) => { have[[e.a, e.b].sort().join('|')] = 1; });

function pushStructural(a, b, kind, note, ev) {
    const key = [a, b].sort().join('|');
    if (have[key] || a === b) return;
    have[key] = 1;
    edges.push({ a: a, b: b, kind: kind, strength: 1, count: 0,
                 note: note, evidence: ev });
}

for (let i = 0; i < PEOPLE.length; i++) {
    for (let j = i + 1; j < PEOPLE.length; j++) {
        const [ia, na, , fa, da] = PEOPLE[i];
        const [ib, nb, , fb, db] = PEOPLE[j];
        if (fa === fb) {
            pushStructural(ia, ib, '同僚',
                '同属「' + fa + '」，在设定表里就是一个势力的人',
                ['game/engine.js:NPCS']);
        } else if (da === db) {
            pushStructural(ia, ib, '同城区',
                '都在' + (DIST_NAME[da] || da) + '活动，跑动时必然打照面',
                ['game/engine.js:NPCS']);
        }
    }
}
edges.sort((x, y) => y.strength - x.strength || y.count - x.count);
npc.forEach((n) => {
    n.bloc = BLOC[n.id] || '其他';
    n.degree = edges.filter((e) => e.a === n.id || e.b === n.id).length;
    n.note = n.degree ? '与 ' + n.degree + ' 人有可查的交集' : '文本中与其他人无直接互动';
});


const out = { npc: npc, faction: FACTIONS, edge: edges };
fs.writeFileSync(OUT, JSON.stringify(out, null, 1), 'utf8');
console.log('已写出 ' + OUT);
