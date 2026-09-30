# 参考项目技术选型解读：shewang-game-demo（Godot 复刻《苏丹的游戏》）

分析对象：`refs/shewang-game-demo`。方式：只读通读脚本/场景/数据/导出配置，未运行引擎。
**结论：为了「卡牌质感」换引擎不划算。Godot 相对我们，真正独占的只有 3D 骰子一项。**

---

## 一、它用了 Godot 的哪些能力

### 1. 卡牌本体：Control 节点树，不是自绘，不是 shader
- 卡 = `PanelContainer`（`DraggableCard.gd:4`）+ `TextureRect` 底图 + `Label` 文字（`CardFactory.gd:185-200`）
- 全项目只有一个 `_draw()`，且只画卡槽底图（`RiteSlotDrop.gd:187`）
- 唯一 shader 是 15 行圆角+染色（`shaders/round_corners.gdshader:1-16`，`CardFactory.gd:165-168`）
- 品质区分靠 **4 组预生成 PNG**（`CardFactory.gd:8-48`，`assets/images/sudanCards/` 16 张），非程序化
- 对我们的意义：卡面 = 图片 + 圆角 + 染色，和 CSS `border-radius`+`filter` 同档，无代差。

### 2. 手牌排布：纯手写算法，**没有扇形展开**
- 整套逻辑 205 行（`HandLayoutManager.gd:25-159`）：左堆+展开区+右堆三段，锚定左右边缘（`:55-58`）
- `stack_reveal=20`、卡宽 100、间距 8 全写死（`:16`、`:40`、`:42`）
- 展开窗跟随鼠标 `focus=(mouse.x-left)/avail*(n-1)`（`:69`），离开时冻结不回弹（`:66-70`）
- 迭代 16 次解 `k`/`si`，再「少堆一张」吸收右空挡（`:75-116`）；`z_index` 手工分三段域（`:137-139`）
- `MainScene.gd:108-119` **每帧**调 `arrange()`
- **grep `angle|rotation|扇形|fan` 在 `scripts/` 下零命中**——不是扇形，是横排+堆叠，且不旋转任何卡
- 对我们的意义：这条被高估了。CSS `flex`+`transform` 完全可复刻。

### 3. 动画：全是 `create_tween()`，零 AnimationPlayer、零粒子
grep：`AnimationPlayer|AnimationTree` 零命中，`GPUParticles|CPUParticles` 零命中。
- hover 抬起 `y-12` 0.15s `TRANS_BACK`（`DraggableCard.gd:35-36`）；松手弹回 0.25s（`:116-118`）
- 手牌横滑 X 轴 0.8s `TRANS_CUBIC`，带「目标没变不重启」防抖（`DraggableCard.gd:138-149`）
- 高亮脉冲 `set_loops(3)` 改 shader `tint`（`:173-175`）
- 抽卡落入：底部枢轴+`scale .92→1`+淡入（`SorceressScene.gd:359-361`、`:416-418`）；令匣开箱（`CardBox.gd:63-72`）
- **翻牌：未实现**（grep `flip|rotateY|backface` 零命中）。**折断：只有文字**（`SorceressScene.gd:506`、`:739`）
- 对我们的意义：它的动效层就是缓动曲线+位移缩放，是 CSS 的主场。

### 4. 3D：只用在骰子，且是第三方 addon
- 唯一 3D：`SettlementScreen.gd:533-608`。`SubViewport`(640×440 透明底) 嵌进 260px 高 `dice_tray`（`:205-207`）
- 手搭 `Camera3D`(-84° 俯视) + `DirectionalLight3D` + 2×`OmniLight3D` + `Environment`（`:548-579`）
- 骰子逻辑全在 CC0 addon `addons/dice_3d/`（**3826 行**，`plugin.cfg` 标 v0.1.0，README 要 4.7）
- 用的是 `DiceCinematicRoller3D`——**非物理**表演型（README 原文 `It does not use physics`），靠 `spin_turns=10`/`bounce_count=3`/`settle_start=0.70` 摆姿态
- `SettlementScreen.gd:658-674` 另有一套 3D 网格摆位（每行 5 枚、`freeze=true`）
- **文档与配置矛盾**：README 说 Forward+/Jolt，实际 `project.godot:42` 是 `gl_compatibility`、`:38` 是 `Godot Physics`；`:32` 有 `[dotnet]` 但无 C# 文件（模板残留）。以配置为准。
- 对我们的意义：**原版的 3D 桌面感在这份复刻里根本没实现**，只有一颗表演骰子。

### 5. 逐条判定：纯 CSS/Canvas 难或做不到的

| 效果 | 它的做法 | CSS/Canvas | 判定 |
|---|---|---|---|
| 卡面圆角+品质染色 | 15 行 shader | `border-radius`+`filter` | **CSS 更简单** |
| 手牌堆叠+滑窗 | 手写 205 行+Tween | 同款算法+`translateX` | **平手** |
| hover/弹回/脉冲 | Tween | `transition`+`@keyframes` | **平手** |
| 抽卡落入 | Tween 缩放淡入 | `@keyframes`+`transform-origin` | **平手** |
| 骰子 3D 滚动定格 | SubViewport+相机+灯光+addon | CSS 3D 可做但另一套工程量；刚体做不到 | **Godot 独占** |
| 真 3D 桌面/景深 | 本项目**未使用** | — | 不适用 |

---

## 二、选型痛点

### 1. 73MB 是什么占的
```
40M assets  ├─ 22M fonts（4 套中文全字库）
            ├─ 9.3M bgm（ogg/m4a）
            └─ 8.8M images
32M .git    └─ 单 pack，257 objects
```
字体：`庞门正道粗书体.ttf` **11.1MB**、`云峰字库重庆山城棒棒体.ttf` 5.4MB、`青柳隶书.ttf` 4.4MB、`优设字由棒棒体.otf` 1.5MB。
`.import` 里 `preload=[]`、**无 subset**——全字库原样进包，却只用在一行卡牌标题与数字上（`CardFactory.gd:49-50`）。
对我们的意义：22MB 只为几个卡牌标题字。我们不塞全字库是对的。

### 2. 平台限制与导出
`export_presets.cfg` **只有一个 Web preset**：
- `thread_support=false`——放弃多线程（避 SharedArrayBuffer/COOP-COEP）
- `vram_texture_compression/for_mobile=false`——**移动端未适配**
- `progressive_web_app/enabled=false`——无离线
- `export_path=""`、`custom_template=""`——默认模板；`script_export_mode=2`
- **仓库内无任何导出产物**（无 `.pck`/`.wasm`），实际产物大小**未核实**
- 版本口径不一：`project.godot:15` 写 4.6，addon README 写 4.7
- 对我们的意义：Godot Web 默认 WASM+单线程，首屏注定 MB 级；我们首屏 `bundle.js` 820KB+`bundle.css` 56KB。

### 3. 中文文本/字体的坑（实测命中）
- **`data/rites.json:903` 有 JSON 尾随逗号**，严格解析直接炸：`Expecting value: line 903 column 3`
- Godot 的 `JSON.parse_string` 宽容所以能跑；Python/Node 读同一份数据全失败
- `DataManager.gd:36-38`：解析失败静默跳过，只在文件不存在时警告——**数据格式错不报错，只少内容**
- 对我们的意义：必须坚持严格 JSON + 构建期校验。`build.sh` 已有 `node --check`，建议加一条 JSON 严格校验。

---

## 三、内容组织方式

### 1. data/ 是纯 JSON（非 GD 脚本、非表格）
`DataManager.gd:20-26` 全读入内存：

| 文件 | 规模 | 结构 |
|---|---|---|
| `sultan_cards.json` | 16 条 | 4 类型×4 品质，含 `elimination_paths[]` |
| `characters.json` | 5 条 | 八围属性 dict + tags |
| `rites.json` | 34 条/1701 行 | 槽位 DSL + 检定 + outcomes |
| `events.json` | 20 条 | trigger + choices + outcome |
| `books.json` | 6 条 | 属性增益 |
| `sorceress_dialogues.json` | 1 dict | 摄政王 UI 文案树 |

### 2. 事件调度：声明 7 种触发，**只实现 2 种**
- `trigger_condition.type` 有 7 种：`random`(9)/`reputation`(4)/`rite`(2)/`character_idle`(2)/`insight`(1)/`hold_card`(1)/`character_available`(1)
- `EventChecker.gd:14-30` 只 `match` 了 `random` 和 `reputation`，其余 `return false`，注释写「暂不实现」
- `choices[].outcome` 是自由字典，16 种 key（无 schema 约束）；调度靠 `priority` 升序（`:40-44`）+ `one_time` 去重
- 对我们的意义：**它是半成品**。结构可参考，完成度不要参考。

### 3. rites 的 DSL 值得借鉴
```json
{ "id":1, "name":"治理家业",
  "slots":[{"type":"character","required_tags":[],"optional":true},
           {"type":"item","label":"辅助物品","accepts":["intel"],"max":1}],
  "check":{"type":"combined","attributes":["soc","wis"],"required_successes":2},
  "outcomes":{"success":{"gold":3,"narrative":"…[角色]…"},"fail":{"gold":1,"narrative":"…"}} }
```
分类 `normal`(14)/`insight`(15)/`permanent`(5)；检定 `solo`(20)/`combined`(13)。两个可借点：
1. **声明式槽位**——槽位自declare 类型/标签/上限，UI 只判定能不能放（`RiteSlotDrop.gd:204-239`）
2. **`[角色]` 占位符**运行时替换（`rites.json:38`），不用模板引擎
- 对我们的意义：若我们的事件/委托也是「槽位+条件+分支」，这层直接借；轻占位符比模板引擎划算。

### 4. 对话系统：不是引擎，是 UI 文案表
顶层固定键 `greeting`/`entry_buttons`/`draw_flow`/`swap_flow`/`break_flow`/`chat_topics`/`flavor_by_type`。
`draw_flow` 只有 4 个键：三种开场词 + 按钮字。**无对话树、无条件分支、无变量插值。**
- 对我们的意义：它 763 行的 `SorceressScene.gd` 里对话是「按状态取一条文案」。**这块不要参考，架构比我们简单。**

---

## 四、真正值得抄的一件事：EventBus（与引擎无关）

`scripts/autoload/EventBus.gd`（48 行）声明 25+ 全局信号，按域分组：回合/令/仪式/检定/资源/角色/事件/游戏状态/灵光一现。
配套 6 个 autoload：`EventBus`/`TurnManager`/`ResourceManager`/`DataManager`/`GameManager`/`BGM`。
`docs/REFACTOR_SUMMARY.md` 记录从 1129 行 `MainScene` 拆出 10 个职责单一模块：`CardFactory`(309)/`HandLayoutManager`(205)/`PopupManager`(391)/`ResourceCardManager`(210)/`MapRitePanel`(202)/`StatusBar`(160)/`RiteDetailPopup`(486)/`RiteSettlementController`(81)/`RiteRewardApplier`(217)/`InsightController`(243)。

**对我们的意义：全文对我们最有价值的部分，且与引擎无关。** 它 `scripts/` 共 6650 行，架构比我们清楚；我们 `bundle.js` 10537 行是拼接产物，`engine.js`(838)/`ui.js`(1112) 边界模糊。信号总线+模块化，我们零引擎成本就能做。

---

## 五、结论

### 明确立场：不划算
1. **它的质感不是引擎给的。** 卡面=图片+圆角+染色，动效=缓动曲线+位移缩放，手牌=手写数学。这三样占观感 90%+，全引擎无关。
2. **它的 3D 桌感是空的。** 只一颗表演骰子，还是第三方 addon。为「复刻的桌感」换引擎，等于为一个不存在的效果付钱。
3. **换引擎要重写 2.4 万行。** 我们 `game/` 29 文件 23616 行 JS + 14.7 万字内容资产，迁移是重写不是翻译。
4. **代价立刻可见。** 首屏 820KB→WASM 级 MB 数；移动端要另配；作者为能部署放弃多线程。
5. **它完成度低于我们。** 7 种触发只实现 2 种；JSON 靠宽容解析才跑；字体 22MB 无子集化；文档与配置两套口径。它是学习型 MVP，不是工程标杆。

### 只在一种效果上划算
**3D 骰子。** 若要做真刚体碰撞滚骰，Godot 的 `DiceRollBox3D`（含重力/碰撞/摩擦/顶面检测）确实难在 Web 复刻。但参考项目用的还是**非物理**版本，且为一颗骰子换整个引擎不成立。

### 不换引擎拿到 80% 效果的路径（按性价比）
1. **手牌堆叠+滑窗**：移植 `HandLayoutManager.gd:25-159` 到 JS，用 `transform:translateX`+`transition`。纯数学，与引擎无关。**我们 `bundle.css:276` 现在是 `overflow-x:auto` 横滚，这是最直接可升级的一处。**
2. **卡牌翻转**：`perspective`+`rotateY(180deg)`+`backface-visibility`。**我们三个 CSS 文件里这三个属性零命中，是从未用过、零成本可用的能力。**
3. **发牌/落入/弹回**：`@keyframes`+`transform-origin:bottom`+`cubic-bezier(.34,1.56,.64,1)`（对应 `TRANS_BACK` 过冲）。我们只有 5 个 keyframes（`bundle.css:110/146/1117`、`style.css:109/145`），动效预算远没用完。
4. **高亮脉冲**：`@keyframes` 循环改 `box-shadow`/`filter`，替代 shader `tint` 往复。
5. **圆角+品质染色**：`border-radius`+`filter:brightness()/saturate()`+CSS 变量。已有 `--c` 体系（`bundle.css:287`），直接复用。
6. **骰子（若一定要）**：优先 CSS 3D 立方体 6 面 `rotate3d` 定格，够用零依赖；真要刚体再上 `three.js`+`cannon-es`，仍不必换引擎。

### 明确不要借鉴的
22MB 无子集中文字体 / 4 组预生成 PNG 做品质区分 / JSON 宽松解析+静默失败 / 7 种触发只实现 2 种的事件系统 / 固定键的伪对话系统。

---

## 六、效果对照表

| 效果名称 | 它怎么做的（file:line） | 我们现在的做法 | 是否值得换 | 不换引擎的替代方案 |
|---|---|---|---|---|
| 卡面圆角+品质配色 | 15 行 shader + 4 组 PNG（`round_corners.gdshader:1-16`、`CardFactory.gd:8-48`） | webp 卡面 + CSS 变量 `--c`（`bundle.css:281-300`） | 否 | `border-radius`+`filter` 染色 |
| 手牌排布（三段堆叠+滑窗） | 手写 205 行+每帧 `arrange()`（`HandLayoutManager.gd:25-159`、`MainScene.gd:108-119`） | `flex`+`overflow-x:auto`（`bundle.css:276`） | 否 | 移植其算法+`translateX` |
| 卡牌拖拽 | `_gui_input`/`_input` 手写，6px 阈值（`DraggableCard.gd:48-108`） | `pointerdown/move/up`+`cloneNode` ghost（`bundle.js:9287-9350`） | 否 | 已实现，平手 |
| 槽位放置判定 | `_get_drag_data`/`_can_drop_data`/`_drop_data`（`RiteSlotDrop.gd:80-239`） | `nodeAccepts`（`bundle.js:9343-9348`） | 否 | 把槽位声明式化 |
| hover 抬起+弹回 | Tween `TRANS_BACK`（`DraggableCard.gd:35-43`、`:116-118`） | `:hover{translateY(-8px)}`（`bundle.css:287`） | 否 | 加过冲 `cubic-bezier` |
| 发牌/抽卡落入 | Tween 缩放淡入，底部枢轴（`SorceressScene.gd:359-361`） | 无（面板直接出现） | 否 | `@keyframes`+`transform-origin:bottom` |
| 高亮脉冲 | Tween 循环改 shader `tint`（`DraggableCard.gd:173-175`） | 静态 `box-shadow` | 否 | `@keyframes` 循环改阴影/滤镜 |
| 卡牌翻转 | **未实现**（grep 零命中） | 无 | 否 | `perspective`+`rotateY(180deg)`+`backface-visibility` |
| 折令/断卡 | **仅文字**（`SorceressScene.gd:506`、`:739`） | 无 | 否 | 伪元素裂痕+`clip-path` 两段分离 |
| 3D 骰子（表演型） | SubViewport+相机+灯光+CC0 addon（`SettlementScreen.gd:533-608`、`addons/dice_3d/`） | 无（纯文本判定） | **只有这一项算划算** | CSS 3D 立方体定格；或单独引 `three.js` |
| 3D 骰子（真刚体） | `DiceRollBox3D`（addon，**本项目未用**） | 无 | 否（为一颗骰子不值） | `three.js`+`cannon-es` |
| 3D 桌面/景深/光照 | **未使用** | 无 | 不适用 | 不适用 |
| 全局事件总线 | 25+ 信号+6 autoload（`EventBus.gd:1-48`） | `engine.js` 内函数直调 | 否（与引擎无关） | 照抄架构：命名事件+单一职责模块 |
| 声明式槽位 DSL | `slots[]` 自declare（`rites.json:8-25`） | 判定写在 JS | 否（与引擎无关） | 数据驱动槽位，UI 只判定 |
| 叙事占位符 | 文本内 `[角色]` 运行时替换（`rites.json:38`） | 模板拼接 | 否（与引擎无关） | 沿用轻占位符 |
| 中文字体渲染 | 4 套全字库 22MB 无 subset（`assets/fonts/`） | 系统字体 | 否 | 不要学；需要时做字形子集 |

---

## 七、未核实项
1. Web 导出产物的实际体积（仓库内无 `.pck`/`.wasm`，`export_path` 为空）
2. 线上 GitHub Pages 版的实际首屏耗时与包体
3. `dice_3d` 在 Web 单线程导出下是否可用（README 要 4.7，项目声明 4.6）
4. `rites.json` 尾随逗号是否只有 903 行一处（本次只定位到首个失败点）
