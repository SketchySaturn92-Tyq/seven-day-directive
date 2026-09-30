# 参考解读：xuezhong-sultan-game（雪中悍刀行·天命之局）

对象：`/srv/catsco-agent/data/work/the-board/refs/xuezhong-sultan-game`
方法：只读代码取证。**不采信它自带的 EXPLORE_*.md / PHASE*.md 结论**，文档声称的数字一律自己重算。

---

## 0. 前提：它的文档不可信，代码可信

- 仓库只有 1 个 commit（`9fd3978`），但 `PHASE1_FINAL_DELIVERY.md:205-212` 列了 3 条以上提交历史 → 历史被重建过。
- `PHASE2_COMPLETION.md:76` 称"55 个事件"，实测 `src/data/events.ts` 只有 **36** 个 `event_` 顶层键（id 1,2,6,7,8,10,11…55，大量缺号）。
- `PHASE2_COMPLETION.md:16` 称"30 个角色"，实测 `src/data/characters.ts` **32** 个键。
- `PHASE1_SUMMARY.md:135` 称主界面有"手牌区域"，实测 `src/App.tsx` **无任何 `cards.hand` 读取点**，无手牌 UI。
- `EXPLORE_*.md` 是旧快照：其 P0（天命卡不 Game Over、结果 3 秒自动关、0 骰可投）**当前已修**（§5.2）；
  另一批 bug（事件列表不过滤、loadGame 无校验）**至今仍在**。教训：自带报告只能当线索。

---

## 1. 技术栈

- `package.json:6-13`：`vite` / `tsc && vite build` / `playwright test`。
- `package.json:14-30`：react 18.3.1、**zustand 4.5**、framer-motion 11；devDeps：vite 5、typescript 5.3、tailwind 3.4、@playwright/test。
- **纯前端无后端**：`src/` 下 grep `fetch(|axios|express|http://localhost` **0 命中**。
- **无游戏引擎、无 Canvas/WebGL**：grep `canvas|webgl|three|phaser|pixi` 在 `src/` 与 `index.html` **0 命中**。全靠 DOM + CSS 动画。
- `vite.config.ts`：只 react 插件 + `alias {'@':'/src'}` + port 5174。`tsconfig.json` 开 `strict`/`noUnusedLocals`。

## 2. 卡牌系统

### 2.1 数据结构（`src/types/game.ts`）

- `Card` `5-22`：`id/name/type/tier/description/image?/attributes?{martial,strategy,virtue}/abilities?/loyalty?/affection?/tags?`
- `CardType` `2`：`character|equipment|intelligence|item|location`；`CardTier` `3`：`gold|silver|bronze|stone`
- `Ability` `24-29`：`id/name/description/effect`，**effect 是字符串标记，不是逻辑**
- `Character extends Card` `46-53`；`DestinyCard` `34-43`（`daysRemaining`+`completed`）；`CardRequirement` `104-109`

### 2.2 手牌 / 抽牌 / 弃牌 / 保留

- 四区容器 `types/game.ts:163-168`：`cards = {hand, deck, discard, destinyCards}`。
- 动作集中在 `stores/gameStore.ts`：`addCard 242`、`removeCard 249`（→discard）、`investCard 257`（→事件 investedCards）、`returnCard 279`、`completeEvent 335`（归还投入牌）。
- **"保留"未实现**；`deck` 无洗牌/抽牌函数。`drawDestinyCard 312-315` 是 TODO 空壳，只有 `console.log`。

### 2.3 卡牌获取节奏（本题最关键）——**链路是死的**

- `src/data/initialState.ts:19-24`：`hand: []`、`deck: []`、`discard: []` **全空**。
- 全仓 grep `addCard(`（排除类型声明）**0 命中** → 没有任何地方发过一张牌。
- 所以既非"开局全给"也非"逐步获取"，而是**永远没有牌**。类型层、store 层、`investCard`/`returnCard` 都写好了，但**没有内容源、没有 UI 入口**。这是它最大的工程事故。

### 2.4 升级 / 合成 / 转化：**没有**

- grep `upgrade|merge|convert|合成|转化` 只命中两处**文案**：`characters.ts:676-681` 的 `specialAbility:'铸剑炉：可升级武器品质'`、`types/game.ts:346` 的 `destinyCardTierBonus` 注释。
- `weapon_upgrade`/`assassination_high_success`/`combat_bonus_30` 这类 `effect` 字符串**全仓无消费者**，纯展示文本。

### 2.5 生成器写了但没接线

- `utils/destinyCardGenerator.ts:94-113` `generateDestinyCard()` 4 type × 4 tier **均匀随机**。
- `:115-137` `getDestinyTypeWeight`/`getTierWeight` 实现了"天数越大越危险"曲线，但**零调用点**（死代码）。
- `utils/destinyEventPool.ts:7-126` 另有 `destinyEventPools[type][tier]→eventId[]`，仅被 `DestinyCardDisplay.tsx:6,24` 用于"完成按钮可否点"。

## 3. 剧情与分支

### 3.1 数据结构

- `GameEvent` `types/game.ts:90-102`：`id/name/type/description/duration/daysRemaining/requiredCards/investedCards/choices/triggerConditions?/stage?`
- `EventType` `56`：`destiny|main|side|random|ritual`（ritual 无实例）
- `EventChoice` `58-64`：`id/text/requirements?/diceCheck?/consequences[]`
- `DiceCheck` `66-70`：`attributes[]/successThreshold/difficulty`
- `Requirement` `72-78`：`type(attribute|reputation|card|character)/attribute?/reputation?/value?/cardId?`
- `EventConsequence` `80-88`：`type(attribute|reputation|card|character|gold|ending)+可选字段+description`
- `Condition` `111-115`：`type(day|attribute|reputation|character|event)/operator/value`
- `stage?` 字段全仓**无使用**。

### 3.2 分支条件：声明式数据 + 单一 switch 求值，不是脚本

- 求值入口 `gameStore.ts:14-61` `checkTriggerCondition()`，`switch(type)` 处理 `day/attribute/reputation/character`。
- 硬伤 1：**没指定具体项时 `attribute`/`reputation` 取"最大值"**（`gameStore.ts:31-42` 用 `Math.max`），`reputation>=80` 实为"六项最高一项 ≥80"。
- 硬伤 2：角色条件用**字符串拼接 hack**——`events.ts:59` 写 `value:'jiangni_affection_30'`，由 `gameStore.ts:44-56` 按 `_` 切成 `charId/affection|loyalty/threshold`；同类见 `:909/:933/:978`。
- 覆盖率：36 个事件仅 **12 个**带 `triggerConditions`。
- 结局侧是**另一套枚举**：`EndingCondition` `types/game.ts:242-247`，类型更多（含 `event_choice/destiny_completed/character_count/narrator/rebirth_purchased`），求值在 `utils/endingEngine.ts:43-158`。**两套条件系统并存，字段近似但不通用。**

### 3.3 "选择结果分两段"（先数值后叙述）：**没有**

- `components/EventModal.tsx:83-132` `applyConsequences()`：成功时把每条 consequence 的 `description` 直接拼进 `resultText`（`:93/:102/:116`），数值与叙述**同一句话**（"姜泥好感+15"）；失败只追加 `'\n事件失败，没有获得奖励。'`（`:127-129`）。
- 对照我们：`game/events-v6.js:9-14` 每选项是 `run:{...}`（数值）+ `after:'...'`（叙述）两字段，**我们已经做了它没做的事**，别丢。

### 3.4 结局判定与优先级

- 数据 108 条（`src/data/endings.ts`），helper `e()` 一行压一条（`:4-6`），字段：`id/name/route/title/description/epilogue/conditions/conditionLogic/priority/difficulty/hidden/scoreWeights/rewards`。
- `utils/endingEngine.ts:182-197` `findBestEnding()`：全量 filter + `sort(priority 降序)` 取第 1 条；**同分靠 sort 稳定性，无显式 tie-breaker**。
- `conditionLogic` 支持 `'and'|'or'`（`:171-176`），但 helper `endings.ts:5` **硬编码 `'and'`**，实际无一条用 or。
- 触发时机 `gameStore.ts:632-685`：天命卡到期 → 先查 `shop_revival` buff（`:643-663`，给回 7 天），否则 `triggerEnding()`；`day>=150` 强制结算（`:671`）；否则每日检查 **`priority>=70` 才自动触发**（`:677-682`）。
- 兜底 `endingEngine.ts:378-380` 固定回 `ending_59`（处决/悲剧）。
- 评分 `:216-372`：5 维各 0-100 → S/A/B/C/D，乘 `scoreWeights` 加权，首通额外 +20 轮回点（`:361`）。

## 4. 存档与状态管理

- **单一 Zustand store**（`stores/gameStore.ts:157`），不用 Context/reducer；`type GameStore = GameState & GameActions`（`:155`）。
- **两层分离，做得对**：局内 `localStorage['save_slot_N']`（`:459`，结构 `SaveData` `types/game.ts:203-209`）；跨局 `localStorage['meta_state']`（`:77/:85`，结构 `MetaState` `types/game.ts:396-409`）。
- 缺陷 1：`saveGame :437-460` 白名单只存 11 个字段，**漏 `endingResult/narratorConfig/shopItems/metaProgress`**（`types/game.ts:412-419`）。
- 缺陷 2：`loadGame :463-476` **无 try-catch、无 schema 校验**，直接 `JSON.parse`+`set`（`EXPLORE_C` BUG-C008 提过，**至今未修**）。
- 缺陷 3：多档参数存在，UI 写死 `saveGame(1)/loadGame(1)`（`App.tsx:332/:338`）。
- 缺陷 4：**无自动存档**，刷新即丢当前局。

## 5. 它踩过的坑（已自核真假）

### 5.1 真的、至今仍在

1. **卡牌系统是死代码**（§2.3）：`initialState.ts:19-24` 全空 + 零 `addCard` 调用。
2. **事件列表不做门控**：`App.tsx:479` 直接 `Object.values(events).map(...)` 渲染全部 36 条，不查 `triggerConditions`、不排已完成；第 1 天可见 `day>=90` 的事件（旧 BUG-C005，行号漂移但问题仍在）。
3. **`loadGame` 无校验**（§4 缺陷 2）。
4. **条件系统两套 + 字符串 hack**（§3.2）。
5. **说书人规则大量字段无消费点**：`rewardMultiplier/blockedEndings/bonusCharacters/eventWeightModifiers/destinyCardTierBonus` 定义在 `types/game.ts:313-362`、求值在 `utils/narratorSystem.ts:163-186`，全仓无调用；`endingEngine.ts:188-192` **注释自认** `blockedEndings` 没接入。同类：`EXPLORE_B` BUG-B004 的声望里程碑无消费。
6. **测试产物进了 git**：`.gitignore` 写了 `playwright-report/`/`test-results/`，但 `git ls-files` 仍列出 `playwright-report/index.html`、`test-results/.last-run.json`、根目录 **`test-debug-screenshot.png`(308KB)** —— 先提交后加 ignore 无效。
7. **文档虚构进度**（§0）。

### 5.2 真的、但已被后续修掉（别照抄旧报告）

| 旧报告指控 | 旧位置 | 现状 |
|---|---|---|
| 天命卡到期只 console.log | `gameStore.ts:66-68` | 已实现：`:640-668` 复活兜底 + `triggerEnding()` |
| 天命卡无"完成"入口 | `DestinyCardDisplay.tsx` | 已有"完成天命"按钮 `:207-231` + `checkDestinyCompletion` |
| 事件结果 3 秒自动关闭 | 旧 `EventModal.tsx:91-94` | 已改手动"确认" `EventModal.tsx:280-296`，组件内已无 setTimeout |
| 0 骰仍可投掷 | 旧 `EventModal.tsx:153-158` | 已加 `insufficient` 拦截（`:205-208, :237-247`） |
| 声望越界 | 旧 `gameStore.ts:220-225` | 已 clamp `[-100,100]` + 连锁反应（`:371-384`） |
| 角色重复招募 | 旧 `gameStore.ts:228-230` | 已去重（`:387-391`） |

### 5.3 判断为"写给自己看"、不作教训

- `PHASE1_FINAL_DELIVERY.md:152-156` 的"<2s / 60FPS / 100% 覆盖率"——无测量脚本支撑。
- `:10-40` 大段"frontend-design skill 应用""避免 generic AI 美学"是 prompt 回应，非技术结论。
- 但 `EXPLORE_A_REPORT.md:6` 那句 **"通过 ≠ 无bug"** 是真教训：108 个 e2e 全绿，却漏掉"整条卡牌链路是死的"这种 P0。

## 6. 结论

### 6.1 值得借鉴的 6 条（附我们代码对应位置）

1. **卡牌必须有明确获取节奏，开局只给少量。** 它做砸了（`initialState.ts:19-24` 全空）。我们是对的：`game/data.js:11-17` `startHand:3` + `deckGoal:12`；来源表 `game/card-sources.js`（**32 条** `cs1..cs32`，分 `npc/district`，带 `need/once`），落地 `game/engine.js:223` `grantCard` / `:281` `checkCardSources`。**底线：不许出现"有卡牌类型但没有来源"。**
2. **用 `priority` 数值解结局冲突，不靠代码顺序。** 它对：`endingEngine.ts:194` 显式排序 + `priority>=70` 分层（`gameStore.ts:677-682`）。我们对：`game/engine.js:799-802` `pickEnding` 是**按数组顺序取首个命中**，顺序即优先级，隐含且脆弱；`data.js:338-378` 8 条结局末尾用 `cond: () => true` 兜底。建议加显式 `priority`。
3. **"期限卡 + 到期处决 + 一次兜底复活"三段压力。** `gameStore.ts:640-668`：到期先查 `shop_revival`，用了回 7 天。我们 `engine.js:629-687` `endDay` + `data.js:11` `deadlineDays:7` 已有前两段，**缺"花钱买一次宽限"这个缓冲**——低成本体验改进点。
4. **跨局档案与局内状态彻底分离，各用各的 key。** 它 `meta_state` vs `save_slot_N`；我们同构且更完整：`game/meta.js:9` `KEY='sdd.profile.v1'`，`:84` 含 `runs/wins/endings{}/best/lastRun`，`settle` 在 `:153`。两边都有 `version` 字段（`types/game.ts:204` / `meta.js:84`），保留。
5. **数据表用压缩 helper，一行一条。** `endings.ts:4-19` 用 `e()` + `attr()/rep()/charaff()` 构造器把 108 条压进 175 行。我们 `design/CONTENT-SPEC.md` 已有内容规范，可把 `endings.js` 对齐成"构造函数 + 一行一条"，降低后续加结局成本。
6. **分路径探索式测试 + 编号 bug 台账，比"全绿"有信息量。** 它 `e2e/` 17 个 spec / 9483 行 + `CONSOLIDATED_ISSUES.md` + A/B/C 清单，每条带复现步骤 + `file:line` + 截图名。我们对：`find -name "*.spec.*" -o -name "*.test.*"` **0 结果**，目前零自动化测试。至少需要一份可复跑的冒烟脚本。

### 6.2 不要学的 3 条

1. **"先建类型和 store，实现留着以后补" → 产出死代码。** 证据：`initialState.ts:19-24` 空容器 + 零 `addCard`；`drawDestinyCard :312-315`、`updateEventProgress :355-358` 是 TODO 空壳；`investCard/returnCard` 无 UI 调用；`getDestinyTypeWeight/getTierWeight` 无调用；`stage` 无使用；说书人 5 个规则字段无消费。我们现状：`card-sources.js` 32 条 → `engine.js:281` 有消费 → `ui.js` 有展示，链路是通的。**守住"每个字段都有消费者"。**
2. **不要相信自己的阶段报告，别把测试产物当进度证明。** 它同仓库同时存在"55 事件✅/14-14 全通过 100%"和"18 条 P0-P2 未修"。我们 `design/CONTENT-SPEC.md` 定位是**规格**（"内容扩充子任务的共同规范"）而非完成声明——这个定位对，继续维持"规格 ≠ 已完成"。
3. **不要把测试产物和大文件提交进仓库。** 它 `git ls-files` 里躺着 308KB 截图与 report，而 ignore 规则先于提交才有效。我们 `assets/` 只有 webp 立绘、无测试残留，保持。

### 6.3 一句话对比

它强在 **UI/动画/结局内容量/报告工程化**（108 条同构结局、9483 行 e2e、水墨视觉体系），弱在 **核心玩法链路是断的**（卡牌无来源、事件无门控、条件两套、多系统只有壳）。我们反过来：玩法链路（12 张牌 + 32 条来源 + 四轨道 + 两段式叙述）是通的，**缺内容量与验证手段**。因此最有价值的借鉴不是它的代码结构，而是**内容组织手法**（§6.1-5）与**测试台账手法**（§6.1-6）。

---

## 附：未核实项

- 未运行它的 `npm install / npm run dev / npx playwright test`，所有"已修/仍在"均为源码静态阅读结论。
- 未核实"36 个事件"是否有意删减（`PHASE2_COMPLETION.md:76` 明说 55），仅确认当前文件实际为 36。
- 未核实 `e2e/explore-*.spec.ts` 是否仍跑得通（其报告与当前代码已不同步，推测部分断言会失败）。
