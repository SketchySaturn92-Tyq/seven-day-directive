#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把设计稿与两份抽取出来的结构数据合成一张连线脑图。

输入：
  relations.json  —— 十六名 NPC 的关系连线与势力归属
  storyline.json  —— 主线与十六条支线的因果链
输出：
  mindmap.html    —— 交给 wkhtmltopdf 的中间稿

为什么用脚本：关系连线要按数据算坐标，手写位置改一条得挪一片。
"""
import json
import os
import html

HERE = os.path.dirname(os.path.abspath(__file__))


def load(name):
    p = os.path.join(HERE, name)
    if not os.path.exists(p):
        return None
    try:
        with open(p, encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print('读取 %s 失败: %s' % (name, e))
        return None


REL = load('relations.json')
STORY = load('storyline.json')

# ---------------------------------------------------------------- 十六人
# 按圈层排：两行各八人，同圈层相邻，方便把连线看成一簇一簇的
NPC_ORDER = [
    'wen-duo', 'su-wen', 'yu-nanzhi', 'dai-siyuan',   # 公司内圈（4）
    'cheng-yan', 'peng-jian',                          # 技术圈（2）
    'lao-ya', 'lu-wan',                                # 底层（2）
    'tie-gui', 'yin-mian',                             # 港区（2）
    'wen-shicheng', 'yu-ke', 'sa-er',                  # 离城通道（3）
    'xun-jie', 'ban-tou', 'wu-mian',                   # 边缘地带（3）
]

NPC_FALLBACK = {
    'wen-duo': ('闻铎', '董事会监事', '董事会', 'tower'),
    'su-wen': ('苏纹', '董事会日程官', '董事会', 'tower'),
    'yu-nanzhi': ('郁南枝', '清算行首席', '清算行', 'exchange'),
    'dai-siyuan': ('戴思远', '合规伦理审查官', '合规伦理委员会', 'exchange'),
    'cheng-yan': ('程砚', '首席科学家', '研究所', 'lab'),
    'peng-jian': ('彭戬', '研究所安保总管', '研究所', 'lab'),
    'lao-ya': ('老鸦', '灰市掮客', '灰市', 'slum'),
    'lu-wan': ('陆晚', '无证诊所医生', '诊所／灰市', 'slum'),
    'tie-gui': ('铁贵', '装卸工会头目', '装卸工会', 'docks'),
    'yin-mian': ('银面', '女术士的代理人', '术士一方', 'docks'),
    'wen-shicheng': ('温仕成', '引航票务掮客', '引航票务', 'orbit'),
    'yu-ke': ('雨客', '穹顶外「潮」的接触人', '潮', 'orbit'),
    'xun-jie': ('荀戒', '环带巡检员', '环带巡检', 'ring'),
    'sa-er': ('萨尔', '潮的拾荒者', '潮', 'outside'),
    'ban-tou': ('班头', '回收场领班', '回收场', 'salvage'),
    'wu-mian': ('无面', '记忆银行柜员', '记忆银行', 'memory'),
}

NPC = {}
if REL and isinstance(REL.get('npc'), list):
    for it in REL['npc']:
        if it.get('id'):
            NPC[it['id']] = it
for k, (name, role, fac, dist) in NPC_FALLBACK.items():
    cur = NPC.setdefault(k, {'id': k})
    cur.setdefault('name', name)
    cur.setdefault('role', role)
    cur.setdefault('faction', fac)
    cur.setdefault('district', dist)

DIST_NAME = {
    'tower': '高塔商业区', 'exchange': '交易所广场', 'lab': '研究所园区',
    'slum': '下层居住区', 'docks': '工业港区', 'orbit': '轨道港',
    'ring': '环带维修层', 'memory': '记忆银行', 'salvage': '回收场',
    'outside': '穹顶之外',
}

# ---------------------------------------------------------------- 关系连线图
W, H = 1240, 470
COLS, ROWS = 8, 2
NODE_W, NODE_H = 132, 62
X0, X_STEP = 70, 148
Y_ROW = [178, 322]


def node_pos(i):
    return X0 + (i % COLS) * X_STEP, Y_ROW[i // COLS]


def render_graph():
    pos = {}
    for i, nid in enumerate(NPC_ORDER):
        if nid in NPC:
            pos[nid] = node_pos(i)

    raw_edges = (REL or {}).get('edge') or []
    lines = []
    for e in raw_edges:
        a, b = e.get('a'), e.get('b')
        if a not in pos or b not in pos:
            continue
        ax, ay = pos[a]
        bx, by = pos[b]
        ac = (ax + NODE_W / 2, ay + NODE_H / 2)
        bc = (bx + NODE_W / 2, by + NODE_H / 2)
        st = int(e.get('strength') or 1)
        kind = e.get('kind') or ''
        cls = 'e%d' % max(1, min(3, st))
        lines.append(
            '<line class="edge %s" x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f">'
            '<title>%s ／ %s（%s，强度 %d）</title></line>'
            % (cls, ac[0], ac[1], bc[0], bc[1],
               html.escape(str(NPC.get(a, {}).get('name', a))),
               html.escape(str(NPC.get(b, {}).get('name', b))),
               html.escape(kind), st))
    if not raw_edges:
        lines.append('<text class="ph" x="%d" y="490">关系数据待补</text>' % (W // 2))

    bands, groups = [], {}
    for i, nid in enumerate(NPC_ORDER):
        if nid in pos:
            groups.setdefault(NPC[nid].get('bloc') or NPC[nid].get('faction') or '—', []).append(i)
    for f, idxs in groups.items():
        if len(idxs) < 2:
            continue
        row = idxs[0] // COLS
        if any(j // COLS != row for j in idxs):
            continue
        xs = [node_pos(j)[0] for j in idxs]
        y = Y_ROW[row] - 16
        left, right = min(xs) - 6, max(xs) + NODE_W + 6
        bands.append('<rect class="band" x="%.0f" y="%.0f" width="%.0f" height="%d" rx="12"/>'
                     % (left, y, right - left, NODE_H + 32))
        bands.append('<text class="bandl" x="%.0f" y="%.0f" text-anchor="middle">%s</text>'
                     % ((left + right) / 2, y + 13, html.escape(f)))

    nodes = []
    for i, nid in enumerate(NPC_ORDER):
        if nid not in pos:
            continue
        d = NPC[nid]
        x, y = pos[nid]
        nodes.append(
            '<g transform="translate(%.0f,%.0f)">'
            '<rect class="nbox" width="%d" height="%d" rx="10"/>'
            '<text class="nname" x="%d" y="24" text-anchor="middle">%s</text>'
            '<text class="nrole" x="%d" y="41" text-anchor="middle">%s</text>'
            '<text class="nfac" x="%d" y="55" text-anchor="middle">%s</text></g>'
            % (x, y, NODE_W, NODE_H,
               NODE_W // 2, html.escape(str(d.get('name', nid))),
               NODE_W // 2, html.escape(str(d.get('role', ''))[:11]),
               NODE_W // 2, html.escape(str(d.get('faction', ''))[:8])))

    return ('<svg class="graph" viewBox="0 0 %d %d" xmlns="http://www.w3.org/2000/svg">'
            '<g>%s</g><g>%s</g><g>%s</g></svg>'
            % (W, H, ''.join(bands), ''.join(lines), ''.join(nodes)))


# ---------------------------------------------------------------- 卡牌类型
CARDS = [
    ('指令卡', '董事会发下来', '办成后归档折断', '放进地点的「令」槽',
     '声明这一趟要办成什么。它决定你去哪儿，不决定你怎么去。'),
    ('人物卡', '认识一个人就得一张', '不消耗', '放进「人」槽',
     '派谁去办。人的能力决定判定线，人的状态决定他还能被派几次。'),
    ('物品卡', '灰市买、事件里捡', '部分一次性', '放进「物」槽',
     '给这一趟加成：证件、工具、药、封条。用完可能就没了。'),
    ('证据卡', '罪痕高了会自己冒出来', '要主动消掉', '占着手牌',
     '负面牌。它不占槽位但占手牌，攒多了会招来清算行。'),
    ('地点卡', '剧情推进时解锁', '不消耗', '挂到地图上',
     '临时开一个新场所。有些地方不是一开始就该存在。'),
]

SLOTS = [
    ('人', '必填', '一张人物卡。默认是你自己；派人去就是把这趟交给别人。'),
    ('物', '可选', '一张物品卡。没有也能办，带上成功率高一截。'),
    ('令', '必填', '一张指令卡。写明这一趟要办成什么，办成了这张卡归档。'),
]

SENDS = [
    ('打工', '信用点', '按角色能力折算，稳定产出', '+1 忠诚', '体魄 −1', '低'),
    ('打探', '情报 · 揭示资产', '有失败概率，失败会打草惊蛇', '+1 情报底子', '关系 −1', '中'),
    ('顶罪', '罪痕 −2', '把身上的一件事算到他头上', '案底 +1', '案底满了他被回收', '高'),
]


def render_slots():
    """地点面板示意：三个槽 + 下方手牌 + 一条投放箭头。"""
    SW, SH = 1140, 340
    o = []
    o.append('<rect class="pan" x="40" y="18" width="546" height="196" rx="12"/>')
    o.append('<text class="ptit" x="62" y="46">地点面板 · 三号泊位</text>')
    o.append('<text class="psub" x="62" y="64">宵禁后无人值守。叉车停在通道口，货单缺一页。</text>')
    for i, (nm, req, _d) in enumerate(SLOTS):
        x = 62 + i * 168
        filled = (i == 0)
        o.append('<rect class="slot%s" x="%d" y="80" width="140" height="104" rx="10"/>'
                 % (' on' if filled else '', x))
        if filled:
            o.append('<rect class="mini" x="%d" y="92" width="116" height="60" rx="7"/>' % (x + 12))
            o.append('<text class="minit" x="%d" y="128" text-anchor="middle">铁贵</text>' % (x + 70))
        o.append('<text class="sreq" x="%d" y="158" text-anchor="middle">%s</text>' % (x + 70, req))
        o.append('<text class="slab" x="%d" y="174" text-anchor="middle">%s 槽</text>' % (x + 70, nm))
    o.append('<rect class="btn2" x="286" y="228" width="90" height="26" rx="13"/>')
    o.append('<text class="btnt" x="331" y="245" text-anchor="middle">执行</text>')
    o.append('<rect class="btn2" x="388" y="228" width="90" height="26" rx="13"/>')
    o.append('<text class="btnt" x="433" y="245" text-anchor="middle">取消</text>')

    o.append('<text class="handlab" x="640" y="46">手牌 · 五类</text>')
    cols = ['#c9a85a', '#74d0c8', '#8fa6ba', '#e0554a', '#7a9ad4']
    names = ['指令', '人物', '物品', '证据', '地点']
    for i, (c, nm) in enumerate(zip(cols, names)):
        x = 640 + i * 96
        o.append('<rect class="pc" x="%d" y="62" width="80" height="120" rx="9" fill="%s"/>' % (x, c))
        o.append('<text class="pct" x="%d" y="132" text-anchor="middle">%s</text>' % (x + 40, nm))
    o.append('<path class="arrow" d="M 690 192 C 620 316 300 320 180 190"/>')
    o.append('<text class="arrowlab" x="440" y="312" text-anchor="middle">'
             '把牌拖进槽里，才谈得上执行</text>')
    return ('<svg class="slotsvg" viewBox="0 0 %d %d" xmlns="http://www.w3.org/2000/svg">%s</svg>'
            % (SW, SH, ''.join(o)))


def legend():
    return """
<div class="legend">
  <span><i class="l1"></i>同场出现 · 同城区 · 同僚</span>
  <span><i class="l2"></i>一方在自己的内容里点名提到对方</span>
  <span><i class="l3"></i>双方互相提及</span>
</div>"""


# ---------------------------------------------------------------- 五段
PHASES = [
    ('第一段', '上桌', 1, '0 — 1 张', '1 个地点 · 2 个人 · 2 个行动',
     '你被点名叫上桌。只学会一件事：点开一个地点，把牌放进槽里。', '折掉第一张牌'),
    ('第二段', '跑腿', 2, '2 — 3 张', '＋2 城区 · ＋3 人 · ＋2 行动',
     '一层楼的事办不动了。你第一次往楼下走，第一次欠人情。', '还清第一笔人情'),
    ('第三段', '站队', 3, '4 — 6 张', '＋3 城区 · ＋4 人',
     '董事会裂成两半，两边的日程官都开始找你。选边，或者假装没看见。', '被某一方明确收编'),
    ('第四段', '沾手', 4, '7 — 9 张', '＋2 城区 · ＋4 人',
     '罪痕开始收利息。你第一次需要有人替你顶一件事。', '第一次派人顶罪'),
    ('第五段', '摊牌', 5, '10 — 12 张', '全部放开',
     '牌快折完了。这时你手里攒下的人，决定你最后是哪种赢法。', '折完第十二张'),
]

UNLOCK = [
    ('第一段', '高塔商业区', 1, 2, 2, 0),
    ('第二段', '＋交易所广场、下层居住区', 3, 5, 4, 1),
    ('第三段', '＋研究所园区、工业港区', 5, 9, 6, 3),
    ('第四段', '＋轨道港、环带维修层、回收场', 7, 13, 8, 6),
    ('第五段', '＋记忆银行、穹顶之外', 10, 16, 9, 12),
]

INTRO_NOW, INTRO_KEEP = 12, 3


def render_story():
    if not STORY or not STORY.get('main'):
        return '<p class="ph">故事线数据待补</p>'
    out = ['<div class="chain">']
    acts = {}
    for m in STORY['main']:
        acts.setdefault(m.get('act', 1), []).append(m)
    for act in sorted(acts):
        ms = acts[act]
        out.append('<div class="actrow"><div class="acttag">第 %s 幕<br><b>%s</b></div>'
                   '<div class="actbody">' % (act, html.escape(str(ms[0].get('actName') or ''))))
        for m in ms:
            who = '、'.join(html.escape(str(w)) for w in (m.get('who') or []))
            out.append(
                '<div class="mnode"><div class="mtitle">%s</div>'
                '<div class="mmeta">%s%s</div>'
                '<div class="mline"><span>起因</span>%s</div>'
                '<div class="mline"><span>决定</span>%s</div>'
                '<div class="mline"><span>去向</span>%s</div></div>'
                % (html.escape(str(m.get('title', ''))),
                   html.escape(DIST_NAME.get(m.get('where'), m.get('where') or '')),
                   ('　' + who) if who else '',
                   html.escape(str(m.get('cause', ''))),
                   html.escape(str(m.get('choice', ''))),
                   html.escape(' ／ '.join(str(x) for x in (m.get('leadsTo') or [])) or '—')))
        out.append('</div></div>')
    out.append('</div>')
    return ''.join(out)


def main():
    phases = ''.join(
        '<tr><td class="p1">%s<br><b>%s</b></td><td class="p2">%s</td><td class="p3">%s</td>'
        '<td>%s</td><td class="p4">%s</td></tr>'
        % (seg, name, fold, openwhat, story, passmark)
        for seg, name, _act, fold, openwhat, story, passmark in PHASES)

    cards = ''.join(
        '<tr><td class="p2">%s</td><td>%s</td><td>%s</td><td class="p3">%s</td>'
        '<td class="p4">%s</td></tr>' % row for row in CARDS)

    slots = ''.join(
        '<tr><td class="p2">%s</td><td class="p1">%s</td><td>%s</td></tr>' % row for row in SLOTS)

    unlock = ''.join(
        '<tr><td class="p1">%s</td><td>%s</td><td class="num">%d</td><td class="num">%d</td>'
        '<td class="num">%d</td><td class="num">%d</td></tr>' % row for row in UNLOCK)

    sends = ''.join(
        '<tr><td class="p2">%s</td><td>%s</td><td>%s</td><td class="up">%s</td>'
        '<td class="down">%s</td><td>%s</td></tr>' % row for row in SENDS)

    eg = (REL or {}).get('edge') or []
    doc = TEMPLATE.format(graph=render_graph(), legend=legend(), phases=phases,
                          edge_n=len(eg),
                          edge_strong=len([e for e in eg if int(e.get('strength') or 1) >= 2]),
                          cards=cards, slots=slots, slotsvg=render_slots(),
                          unlock=unlock, sends=sends, story=render_story(),
                          intro_now=INTRO_NOW, intro_keep=INTRO_KEEP)
    out = os.path.join(HERE, 'mindmap.html')
    with open(out, 'w', encoding='utf-8') as f:
        f.write(doc)
    print('已生成 %s（%d 字节）' % (out, len(doc.encode('utf-8'))))


TEMPLATE = """<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8">
<title>《七日指令》故事线与人际关系脑图</title>
<style>
  @page {{ size: A4; margin: 13mm 11mm; }}
  * {{ box-sizing: border-box; }}
  body {{ font-family: "Noto Sans CJK SC","Source Han Sans SC","WenQuanYi Micro Hei",sans-serif;
         color:#16202b; font-size:10pt; line-height:1.7; margin:0; }}
  h1 {{ font-size:19pt; margin:0 0 3mm; letter-spacing:.02em; }}
  h2 {{ font-size:13pt; margin:9mm 0 3mm; padding-bottom:1.6mm;
        border-bottom:1.2pt solid #16202b; letter-spacing:.05em; }}
  h3 {{ font-size:11pt; margin:5mm 0 2mm; }}
  .sub {{ color:#5b6672; font-size:9pt; margin:0 0 6mm; }}
  .lead {{ background:#f2f5f8; border-left:3pt solid #2b6ea8; padding:3mm 4mm; margin:0 0 6mm; }}
  table {{ width:100%; border-collapse:collapse; margin:3mm 0 4mm; }}
  th,td {{ border:.6pt solid #c3ccd6; padding:1.7mm 2.2mm; text-align:left;
           vertical-align:top; font-size:9pt; }}
  th {{ background:#e8eef4; font-weight:700; }}
  td.num {{ text-align:right; white-space:nowrap; font-variant-numeric:tabular-nums; }}
  .p1 {{ font-weight:700; color:#1f4f7a; }}
  .p2 {{ font-weight:700; }}
  .p3 {{ color:#55606c; }}
  .p4 {{ color:#8b95a1; }}
  .up {{ color:#1f7a45; }} .down {{ color:#b0342b; }}
  .ph {{ color:#9aa5b1; font-style:italic; }}

  .graphwrap {{ border:.6pt solid #c3ccd6; border-radius:3mm; padding:2mm; background:#fbfcfd; }}
  svg.graph {{ width:100%; height:auto; display:block; }}
  .band {{ fill:#eef3f8; stroke:#c9d6e2; stroke-width:.8; }}
  .bandl {{ font-size:8.5pt; fill:#5b6672; }}
  .edge {{ stroke-linecap:round; }}
  .edge.e1 {{ stroke:#c3ccd6; stroke-width:1; stroke-dasharray:2 3; }}
  .edge.e2 {{ stroke:#6f9dc4; stroke-width:1.6; }}
  .edge.e3 {{ stroke:#b0342b; stroke-width:2.2; }}
  .nbox {{ fill:#fff; stroke:#8fa6ba; stroke-width:1; }}
  .nname {{ font-size:10.5pt; font-weight:700; fill:#16202b; }}
  .nrole {{ font-size:7.5pt; fill:#5b6672; }}
  .nfac {{ font-size:7pt; fill:#9aa5b1; }}
  .legend {{ margin:2mm 0 0; font-size:8.5pt; color:#5b6672; }}
  .legend span {{ margin-right:6mm; }}
  .legend i {{ display:inline-block; width:9mm; height:0; vertical-align:middle;
               margin-right:1.5mm; border-top-width:2px; border-top-style:solid; }}
  .legend i.l1 {{ border-color:#c3ccd6; border-top-style:dashed; }}
  .legend i.l2 {{ border-color:#6f9dc4; }}
  .legend i.l3 {{ border-color:#b0342b; }}

  svg.slotsvg {{ width:100%; height:auto; display:block; margin:2mm 0 3mm; }}
  .pan {{ fill:#f4f7fa; stroke:#b9c7d4; stroke-width:1; }}
  .ptit {{ font-size:10pt; font-weight:700; fill:#16202b; }}
  .psub {{ font-size:8pt; fill:#5b6672; }}
  .slot {{ fill:#fff; stroke:#b9c7d4; stroke-width:1; stroke-dasharray:4 3; }}
  .slot.on {{ stroke:#2b6ea8; stroke-width:1.8; stroke-dasharray:none; fill:#eaf2fa; }}
  .mini {{ fill:#cfe3dd; stroke:#74a99f; stroke-width:.8; }}
  .minit {{ font-size:9pt; font-weight:700; fill:#20423c; }}
  .slab {{ font-size:9pt; font-weight:700; fill:#2b6ea8; }}
  .sreq {{ font-size:7.5pt; fill:#8b95a1; }}
  .pc {{ opacity:.9; }}
  .pct {{ font-size:9pt; font-weight:700; fill:#10202c; }}
  .handlab {{ font-size:9.5pt; font-weight:700; fill:#16202b; }}
  .arrow {{ fill:none; stroke:#2b6ea8; stroke-width:1.6; stroke-dasharray:6 5; }}
  .arrowlab {{ font-size:8.5pt; fill:#2b6ea8; }}
  .btn2 {{ fill:#dfe8f1; stroke:#b9c7d4; }}
  .btnt {{ font-size:8.5pt; fill:#2b4a6b; }}

  .chain {{ margin:2mm 0 4mm; }}
  .actrow {{ display:flex; gap:4mm; margin-bottom:3mm; }}
  .acttag {{ flex:0 0 22mm; background:#16202b; color:#fff; border-radius:2mm;
             padding:2mm; text-align:center; font-size:8.5pt; line-height:1.5; }}
  .actbody {{ flex:1; }}
  .mnode {{ border-left:2.5pt solid #2b6ea8; background:#f7f9fb;
            padding:2mm 3mm; margin-bottom:2mm; border-radius:0 2mm 2mm 0; }}
  .mtitle {{ font-weight:700; font-size:10pt; }}
  .mmeta {{ font-size:8pt; color:#5b6672; margin-bottom:1.2mm; }}
  .mline {{ font-size:8.5pt; }}
  .mline span {{ display:inline-block; min-width:9mm; color:#2b6ea8; font-weight:700; }}
  .foot {{ margin-top:8mm; padding-top:3mm; border-top:.6pt solid #c3ccd6;
           color:#5b6672; font-size:8pt; }}
</style></head><body>

<h1>《七日指令》故事线与人际关系脑图</h1>
<p class="sub">梳理时间 2026-09-30 ｜ 依据：现有 9 场主线、96 场支线、16 名 NPC 的实际文本</p>

<div class="lead">
毛病不在内容不够，在<b>一次给太多、而且给错了用法</b>。<br>
一局开场同时亮出 10 个城区、26 个可折目标、200 条事件、9 种行动、18 个结局，
还要先读完 <b>{intro_now} 段共 2304 字</b>才谈得上开始。<br>
更要紧的是：现在手牌只有一种牌（指令卡），唯一的用法是<b>撕掉</b>；
十六个人只会说话，玩家没有办法用他们。<br>
改造四件事：<b>点开地点出卡槽、把牌放进去</b>；<b>牌分成五类</b>；
<b>地图和人物分五段放出</b>；<b>开场砍到三段</b>。
</div>

<h2>一、核心交互：从「撕牌」改成「配牌」</h2>
<p>现在的循环是：拖一张指令卡到地图节点上 → 掷点 → 牌折断。整个过程玩家只做了一个动作，
而且做的是「把资源毁掉」。<br>
改成：<b>点开一个地点 → 面板出现三个槽 → 把牌放进槽里 → 执行</b>。
牌不再因为被使用而消失（指令卡办成后才归档），于是同一副手牌可以反复配置出不同打法。</p>
{slotsvg}
<table>
  <tr><th>槽位</th><th>是否必填</th><th>放什么、为什么</th></tr>
  {slots}
</table>
<p><b>为什么这一个改动能救玩法：</b>「撕牌」是一次性决策，玩家没有回旋；
「配牌」是组合题 —— 同一个地点，派闻铎去和派铁贵去，带不带证件，
成功率、后来的关系变化、会不会留下案底，全都不一样。
人物从背景变成了手里真正能用出去的东西。</p>

<h2>二、牌分成五类</h2>
<p>现在整个游戏只有一类牌，而且它唯一的用法是毁掉。改后五类并行，
手牌变成一叠「可以放上去的东西」。</p>
<table>
  <tr><th>类型</th><th>从哪来</th><th>会不会消耗</th><th>放哪儿</th><th>作用</th></tr>
  {cards}
</table>

<h2>三、五段式主线：每一段只解决一个问题</h2>
<table>
  <tr><th>段落</th><th>折牌</th><th>放开什么</th><th>这一段在讲什么</th><th>怎么算过</th></tr>
  {phases}
</table>

<h2>四、解锁阶梯：地图和人物是长出来的</h2>
<p>下面四栏是<b>累计值</b>。第二段结束时，玩家应该刚好认识五个人、走过三个城区，
而不是一上来面对十城十六人。</p>
<table>
  <tr><th>段落</th><th>累计开放的城区</th><th>累计城区数</th>
      <th>累计认识人数</th><th>累计可折牌种</th><th>累计事件池</th></tr>
  {unlock}
</table>

<h2>五、人物关系连线图</h2>
<p>线只画文本里真实出现过的关系，强度按依据分级。同势力的用底色带圈在一起。
这张图同时是「谁能被派去做什么」的地图：同势力的人互相牵制，跨势力的连线就是风险来源。</p>
<div class="graphwrap">{graph}</div>
{legend}
<p><b>这张图本身就是一条诊断。</b>十六个人在现有文本里只有 {edge_n} 条可查的连线，
其中真正算得上「互动」的只有 {edge_strong} 条，其余都只是同场出现、同城区或同势力。
把十六个人分到六圈之后你会发现：<b>圈子之间几乎没有横线</b> ——
研究所的人不认识港区的人，灰市的人够不到轨道港。这也是「牵扯不到很多人」的原因：
不是人不够，是他们之间没有关系可牵。</p>
<p>按圈层补齐之后，每个圈层内部先连起来，再让主线（苏纹）与两个人（银面、闻铎）
从不同圈层穿过去，人物网才立得起来。下图里强度 2 与 3 的线就是现成可用的穿线点。</p>

<h2>六、故事线主干</h2>
<p>每一场都写出「因为什么、要做什么决定、决定之后通向哪里」。支线全部挂在某一幕上。</p>
{story}

<h2>七、把人用出去：三格派遣</h2>
<p>每认识一个人就得到一张人物卡，除了放进地点的「人」槽，还可以放进三格派遣槽：</p>
<table>
  <tr><th>槽位</th><th>产出</th><th>机制</th><th>角色这边</th><th>反噬</th><th>失败风险</th></tr>
  {sends}
</table>
<h3>顶罪这一个槽为什么是关键的</h3>
<p>罪痕是玩家最常死的那个原因，现有版本没有任何办法把它转移出去，只能花钱善后。
顶罪给了唯一的转移路径，代价是<b>消耗一个人</b>：他替你背一件，案底加一；
案底满了，他被回收，那条六幕支线就此断在这里。<br>
于是「养人」和「用人」变成一对真矛盾 —— 这比单纯给个数值加成有意思得多，
也让十六条支线终于有了玩法上的分量。</p>

<h2>八、开场改造：{intro_now} 段变成 {intro_keep} 段加九个补讲</h2>
<table>
  <tr><th>原本</th><th>现在</th><th>理由</th></tr>
  <tr><td>开局播完 12 段，2304 字</td>
      <td>只播前 {intro_keep} 段（约 400 字），只讲三件必须当场知道的事：
          牌是什么、七天折一张、折不出来换人</td>
      <td>其余九段讲名望四轨、委托、穹顶接缝这些东西，玩家此刻没有对应界面可看，讲了也留不住</td></tr>
  <tr><td>十城区一次全开</td>
      <td>第一段只开高塔商业区，其余按段放开</td>
      <td>地图是空间信息，一次给十个等于没给</td></tr>
  <tr><td>十六人按天数陆续出现，没有节制</td>
      <td>每段限定新增人数，第五段才凑齐十六人</td>
      <td>认识一个人要记住名字、身份、立场、能用他做什么，一次来三个已是上限</td></tr>
  <tr><td>其余九段入门</td>
      <td>改成「补讲」，挂在第一次遇到对应概念时触发：<br>
          第一次名望变动 → 讲四轨；第一条委托 → 讲委托；第一次接触穹顶外 → 讲接缝</td>
      <td>在玩家正好要用到的时候讲，才记得住</td></tr>
</table>

<h2>九、落地顺序</h2>
<table>
  <tr><th>顺序</th><th>做什么</th><th>为什么排这里</th></tr>
  <tr><td class="p1">1</td><td>开局砍到 3 段，其余九段改成按需触发</td>
      <td>改动最小、体感最强，玩家第一分钟就能感觉出来</td></tr>
  <tr><td class="p1">2</td><td>地点面板加三个槽，把手牌投放改成「放进槽里再执行」</td>
      <td>这是玩法的正解，越早越好；判定公式可以沿用现有的</td></tr>
  <tr><td class="p1">3</td><td>人物卡与三格派遣槽（打工 / 打探 / 顶罪）</td>
      <td>让人从背景变成资源，十六条支线才有玩法意义</td></tr>
  <tr><td class="p2">4</td><td>城区与人物按折牌数分五段解锁</td>
      <td>解锁表已在这份文档里，改成数据即可</td></tr>
  <tr><td class="p2">5</td><td>物品卡与证据卡</td>
      <td>有了槽位之后才谈得上配牌，排在槽位之后</td></tr>
  <tr><td class="p2">6</td><td>支线按解锁节奏重排触发点</td>
      <td>十六条支线要在玩家认识该人之后才有意义</td></tr>
</table>

<div class="foot">
数据来源：关系连线与剧情因果由脚本从 <code>game/story-*.js</code>、<code>game/voice-*.js</code>、
<code>game/lore.js</code> 中抽取，每条连线都带可回查的出处；文本里查不到依据的没有画上去。<br>
本图只取结构手法，不含任何参考作品的原文与美术。
</div>

</body></html>
"""

if __name__ == '__main__':
    main()
