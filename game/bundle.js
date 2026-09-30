/* 自动生成，请勿直接编辑。改 game/ 下的源码后运行 ./build.sh */
/* 生成时间: 2026-09-30T06:00:02Z */

/* ===== game/data.js ===== */
/* ==========================================================
   《七日指令》 THE SEVEN-DAY DIRECTIVE
   赛博朋克宫廷生存卡牌 —— 数据层
   ========================================================== */
window.GAME_DATA = (function () {
  'use strict';

  const CONFIG = {
    deadlineDays: 7,        // 每张指令卡的期限
    apPerDay: 4,            // 每日行动点
    deckGoal: 12,           // 折完全部 12 张牌 = 通关
    startHand: 3,           // 开局只发三张：牌是挣来的
    handMax: 7,             // 手牌上限
    statCap: 10,
    trackCap: 12,
    version: '5.0.0',
  };


  /* ---------------- 城区（地图舞台） ---------------- */
  const DISTRICTS = [
    { id: 'tower',    name: '高塔商业区', en: 'TOWER',    x: 0.455, y: 0.2, color: '#7aa2f7', portrait: 'portrait-monitor',
      desc: '董事会在最高的那层。电梯要刷三次权限，所有人都在笑。' },
    { id: 'exchange', name: '交易所广场', en: 'EXCHANGE', x: 0.66, y: 0.34, color: '#e0b44a', portrait: 'portrait-scientist',
      desc: '穹顶集团的心脏。所有资本在这里换成信仰，再换成别人的命。' },
    { id: 'lab',      name: '研究所园区', en: 'LAB',      x: 0.855, y: 0.145, color: '#4ad0c8', portrait: 'portrait-scientist',
      desc: '在造一件没人敢签收的东西。走廊全程静音。' },
    { id: 'slum',     name: '下层居住区', en: 'SLUM',     x: 0.4, y: 0.56, color: '#c86bd8', portrait: 'portrait-fixer',
      desc: '酸性雨落在这里会变成泥。所有的线人都住在这儿。' },
    { id: 'docks',    name: '工业港区',   en: 'DOCKS',    x: 0.72, y: 0.64, color: '#e0554a', portrait: 'portrait-enforcer',
      desc: '合法外壳，非法内脏。凌晨三点最热闹。' },
    { id: 'orbit',    name: '轨道港',     en: 'ORBIT',    x: 0.905, y: 0.47, color: '#9fb0c4', portrait: 'portrait-witch',
      desc: '离开这颗星球只有一条路，而路是别人的。' },
  ];

  /* ---------------- 四大指令路径 ---------------- */
  const PATHS = [
    {
      id: 'control', name: '操控', en: 'CONTROL', color: '#c86bd8', sign: '⬢',
      stat: 'charm', statName: '魅力',
      verb: '拿下', demand: '需要具备社会接口的目标',
      win: { n1: '拿下一名下线', n2: '拿下一整个部门', n3: '拿下核心层的心腹' },
      tracks: { loyalty: -1, renown: 1, sin: 0, power: 2 },
      reward: { money: 6, intel: 2, chips: 2 },
    },
    {
      id: 'capital', name: '资本', en: 'CAPITAL', color: '#e0b44a', sign: '◈',
      stat: 'intellect', statName: '智慧',
      verb: '砸钱吞下', demand: '需要具备现金流或股权价值的目标',
      win: { n1: '吞下一笔小生意', n2: '吞下一家中层公司', n3: '吞下集团主脉' },
      tracks: { loyalty: 1, renown: 1, sin: 0, power: 1 },
      reward: { money: 18, intel: 1, chips: 3 },
    },
    {
      id: 'expand', name: '扩张', en: 'EXPAND', color: '#4ad0c8', sign: '◤',
      stat: 'force', statName: '战斗',
      verb: '强行占下', demand: '需要具备地盘、通道或产业的目标',
      win: { n1: '占下一条街巷通道', n2: '占下一个城区枢纽', n3: '占下战略级节点' },
      tracks: { loyalty: 1, renown: 1, sin: 1, power: 2 },
      reward: { money: 10, intel: 1, chips: 3 },
    },
    {
      id: 'purge', name: '清洗', en: 'PURGE', color: '#e0554a', sign: '✕',
      stat: 'stealth', statName: '隐匿',
      verb: '清理掉', demand: '需要具备肉体或职位的目标',
      win: { n1: '清掉一个麻烦', n2: '清掉一名中层', n3: '清掉一位董事' },
      tracks: { loyalty: -1, renown: -1, sin: 1, power: 1 },
      reward: { money: 8, intel: 2, chips: 4 },
    },
  ];

  /* ---------------- 三个品级 ---------------- */
  const TIERS = [
    { id: 1, key: 'iron', name: '黑铁', need: 1, color: '#8d99ae', diff: 0 },
    { id: 2, key: 'silver', name: '白银', need: 2, color: '#cfd8e3', diff: 12 },
    { id: 3, key: 'gold', name: '曜金', need: 3, color: '#f2c14e', diff: 26 },
  ];

  /* ---------------- 属性 ---------------- */
  const STATS = [
    { id: 'intellect', name: '智慧', desc: '投资、并购与看穿骗局' },
    { id: 'charm', name: '魅力', desc: '谈判、笼络与让人心动' },
    { id: 'force', name: '战斗', desc: '外勤、械斗与强行占地' },
    { id: 'stealth', name: '隐匿', desc: '跟踪、灭口与抹掉痕迹' },
    { id: 'vitality', name: '体魄', desc: '熬夜、挨打与扛住审讯' },
  ];

  /* ---------------- 名望四轨 ---------------- */
  const TRACKS = [
    { id: 'loyalty', name: '忠诚', desc: '董事会对你的信任，归零即被清算', color: '#4ad0c8' },
    { id: 'renown', name: '声望', desc: '业内与公众口碑，决定终局高度', color: '#7aa2f7' },
    { id: 'sin', name: '罪痕', desc: '你留下的把柄，过高会被反噬', color: '#e0554a' },
    { id: 'power', name: '权柄', desc: '实际掌握的人与系统资源', color: '#e0b44a' },
  ];

  /* ---------------- 出身 ---------------- */
  const ORIGINS = [
    {
      id: 'clerk', portrait: 'portrait-clerk', name: '合规部次长', tag: '最安全，也最慢',
      desc: '你熟悉集团每一份文件边角。忠诚起点高，但枪口从不朝着你。',
      stats: { intellect: 5, charm: 4, force: 2, stealth: 2, vitality: 3 },
      tracks: { loyalty: 5, renown: 3, sin: 0, power: 1 },
      money: 40, intel: 4, perk: '每日首次「董事会简报」额外 +1 忠诚。',
    },
    {
      id: 'fixer', portrait: 'portrait-fixer', name: '灰市掮客', tag: '关系网就是命',
      desc: '你认识所有人，所有人也认识你。钱与情报来得快，忠诚来得慢。',
      stats: { intellect: 4, charm: 5, force: 3, stealth: 3, vitality: 3 },
      tracks: { loyalty: 3, renown: 4, sin: 2, power: 2 },
      money: 70, intel: 6, perk: '「情报网」与「应酬」收益翻倍。',
    },
    {
      id: 'enforcer', portrait: 'portrait-enforcer', name: '外勤队长', tag: '动手的人活不长',
      desc: '你的手套下面有老茧。战斗与体魄出众，代价是董事会始终防着你。',
      stats: { intellect: 2, charm: 3, force: 6, stealth: 4, vitality: 5 },
      tracks: { loyalty: 3, renown: 3, sin: 2, power: 3 },
      money: 30, intel: 3, perk: '「清洗」与「扩张」成功时额外 +2 筹码。',
    },
    {
      id: 'ghost', portrait: 'portrait-ghost', name: '信息安全幽灵', tag: '没人见过你的脸',
      desc: '你能进任何系统，包括董事会自己的。隐匿极高，体魄堪忧。',
      stats: { intellect: 5, charm: 2, force: 2, stealth: 6, vitality: 2 },
      tracks: { loyalty: 4, renown: 2, sin: 1, power: 2 },
      money: 45, intel: 5, perk: '每日免费查看一条隐藏情报，且换牌只花 1 点行动。',
    },
  ];

  /* ---------------- 资产池（可被指令指向的目标） ---------------- */
  const ASSETS = [
    { id: 'a1', name: '外包监理', level: 1, tags: ['control', 'purge'], resist: 0, district: 'tower', note: '知道太多，位置太低。' },
    { id: 'a2', name: '街巷掮客', level: 1, tags: ['control', 'capital'], resist: 1, district: 'slum', note: '每条巷子的抽成都要经他手。' },
    { id: 'a3', name: '快递机群', level: 1, tags: ['expand', 'capital'], resist: 0, district: 'docks', note: '三十七架无人机，一条暗航线。' },
    { id: 'a4', name: '实习生池', level: 1, tags: ['control', 'capital'], resist: 0, district: 'tower', note: '便宜的忠诚，随时可以再招。' },
    { id: 'a5', name: '小型维修栈', level: 1, tags: ['expand'], resist: 1, district: 'slum', note: '帮会在这里修枪。' },
    { id: 'a6', name: '数据中台', level: 2, tags: ['capital', 'purge'], resist: 1, district: 'lab', note: '全集团的行为留痕都在这里。' },
    { id: 'a7', name: '物流子公司', level: 2, tags: ['expand', 'capital'], resist: 2, district: 'docks', note: '合法外壳，非法内脏。' },
    { id: 'a8', name: '安保承包商', level: 2, tags: ['expand', 'control'], resist: 2, district: 'docks', note: '枪是他们的，账是你的。' },
    { id: 'a9', name: '舆情频道', level: 2, tags: ['control', 'capital'], resist: 1, district: 'exchange', note: '每晚七点决定谁是好人和坏人。' },
    { id: 'a10', name: '研发二部', level: 2, tags: ['capital', 'purge'], resist: 2, district: 'lab', note: '在造一件没人敢签收的东西。' },
    { id: 'a11', name: '首席科学家', level: 3, tags: ['control', 'purge'], resist: 3, district: 'lab', note: '穹顶集团唯一的不可替代品。' },
    { id: 'a12', name: '穹顶交易所', level: 3, tags: ['capital', 'expand'], resist: 3, district: 'exchange', note: '所有资本在此换成信仰。' },
    { id: 'a13', name: '董事会监事', level: 3, tags: ['purge', 'control'], resist: 3, district: 'tower', note: '他手里有一份名单，名单上有你。' },
    { id: 'a14', name: '轨道港', level: 3, tags: ['expand', 'capital'], resist: 4, district: 'orbit', note: '离开这颗星球只有一条路。' },
  ];

  /* ---------------- 日常行动 ---------------- */
  const ACTIONS = [
    {
      id: 'brief', name: '董事会简报', cost: 1, icon: '⬢',
      desc: '列席早会，记下谁没来、谁在咳嗽。',
      run: { loyalty: 1, intel: 1 },
    },
    {
      id: 'study', name: '进修', cost: 1, icon: '◈',
      desc: '私人教席、黑市论文、被格式化的旧档案。',
      run: { statRandom: 1 },
    },
    {
      id: 'intel', name: '情报网', cost: 1, icon: '◉',
      desc: '让线人把今天的话都吐出来。',
      run: { intel: 2, reveal: true },
    },
    {
      id: 'biz', name: '家业', cost: 1, icon: '¥',
      desc: '你名下那几家不干净的店在替你赚钱。',
      run: { money: [8, 18] },
    },
    {
      id: 'field', name: '外勤', cost: 2, icon: '◤',
      desc: '亲自出门。可能带回来人、装备，或者伤。',
      run: { field: true },
    },
    {
      id: 'social', name: '应酬', cost: 1, icon: '♡',
      desc: '酒、灯光、包厢，以及恰到好处的沉默。',
      run: { charm: 1, renown: 1 },
    },
    {
      id: 'deal', name: '黑市交易', cost: 1, icon: '⇄',
      desc: '用钱换装备，用情报换钱。',
      run: { deal: true },
    },
    {
      id: 'clean', name: '善后', cost: 1, icon: '⌫',
      desc: '花 45 信用点买通关系，洗掉一层罪痕。',
      run: {},
    },
    {
      id: 'draw', name: '申领', cost: 2, icon: '▤',
      desc: '走一遍流程，从董事会那里再要一张指令卡。牌不够时的保底来源。',
      run: { draw: true },
    },

    /* ---------- 以下这些是「有地点才有意义」的行动 ----------
       以前九条行动全在一个全局面板里，站在哪儿都能干，
       于是地图和手牌都不重要了。现在每条行动挂在具体城区上，
       要办事就得点开那个地方。顺带把钱也变成能花出去的东西。 */
    {
      id: 'bribe', name: '买通窗口', cost: 1, price: 40, icon: '⇢',
      desc: '花 40 信用点跳过一道手续。钱替掉的是人情。',
      run: { bribe: true },
    },
    {
      id: 'meds', name: '买伤药', cost: 1, price: 30, icon: '✚',
      desc: '在无证诊所把伤处理掉。不留记录，也不用欠人情。',
      run: { meds: true },
    },
    {
      id: 'pass', name: '买通行条', cost: 1, price: 35, icon: '▥',
      desc: '从港区弄一张本来不该有的进场条。',
      run: { pass: true },
    },
    {
      id: 'rumor', name: '买消息', cost: 1, price: 30, icon: '◉',
      desc: '花 30 信用点，问一件别人不想让人知道的事。',
      run: { rumor: true },
    },
    {
      id: 'burn', name: '买纸', cost: 1, price: 80, icon: '⌫',
      desc: '让记忆银行把一条记录处理掉。贵，但干净。',
      run: { burn: true },
    },
    {
      id: 'keep', name: '买命', cost: 1, price: 100, icon: '♡',
      desc: '把已经被判回收的人多留三天。救不了，只是往后挪。',
      run: { keep: true },
    },
    {
      id: 'ticket', name: '押票', cost: 2, price: 120, icon: '➤',
      desc: '押一张离城的票。它是后路，不是出路。',
      run: { ticket: true },
    },
    {
      id: 'patrol', name: '跟巡检', cost: 1, icon: '◎',
      desc: '跟着巡检走一段，看哪些记录对不上。',
      run: { patrol: true },
    },
    {
      id: 'seam', name: '走到接缝', cost: 1, icon: '≋',
      desc: '在接缝外侧站一会儿。体魄 -1，情报 +3，罪痕 +1。',
      run: { seam: true },
    },
  ];

  /* ---------------- 每个城区能做什么 ----------------
     「站在这条街才谈得上办这件事」。
     玩家点开城区面板，看到的就是这里的行动。 */
  const DISTRICT_ACTIONS = {
    tower:    ['brief', 'social', 'draw'],
    exchange: ['biz', 'clean', 'bribe'],
    lab:      ['study'],
    slum:     ['intel', 'deal', 'meds', 'rumor'],
    docks:    ['field', 'pass'],
    orbit:    ['ticket'],
    ring:     ['patrol'],
    memory:   ['burn'],
    salvage:  ['keep'],
    outside:  ['seam'],
  };

  /* ---------------- 每日事件（每选项含结算脚本片段） ---------------- */
  const EVENTS = [
    {
      id: 'e1', portrait: 'portrait-fixer', district: 'slum', title: '一个孩子递来信封',
      text: '巷口，一个不到十岁的孩子把信封塞进你手里就跑。里面是一张照片：你昨晚在哪里、和谁。',
      options: [
        { label: '追上去，问出谁给的', run: { stat: 'force', dc: 2, ok: { intel: 3, sin: 1 }, bad: { vitality: -1, sin: 1 } } },
        { label: '把照片烧掉，当作没发生', run: { track: { loyalty: 1, sin: 1 } } },
        { label: '交给董事会，让他们去查', run: { track: { loyalty: 2, renown: -1, power: -1 } } },
      ],
    },
    {
      id: 'e2', portrait: 'portrait-monitor', district: 'tower', title: '监事会请你喝茶', tag: '权斗',
      text: '茶是真的好茶。对面的人一直在笑，笑到你把杯子握出汗。',
      options: [
        { label: '如实交代，只少说一句', run: { track: { loyalty: 2, sin: -1, renown: -1 } } },
        { label: '反问他的把柄', run: { stat: 'intellect', dc: 3, ok: { intel: 4, power: 1 }, bad: { loyalty: -2, sin: 1 } } },
        { label: '装病离席', run: { track: { loyalty: -1, vitality: -1, sin: 1 } } },
      ],
    },
    {
      id: 'e3', portrait: 'portrait-lu', district: 'slum', title: '旧日同事的葬礼',
      text: '他上周还在跟你抱怨加班。死亡证明上写着「自愿退出」。',
      options: [
        { label: '出席，并在众人面前发言', run: { track: { renown: 2, loyalty: -1, sin: 1 } } },
        { label: '不去，但要查清死因', run: { stat: 'stealth', dc: 3, ok: { intel: 4, sin: 1 }, bad: { sin: 1, vitality: -1 } } },
        { label: '送礼金，仅此而已', run: { money: -10, track: { loyalty: 1 } } },
      ],
    },
    {
      id: 'e4', portrait: 'portrait-yu', district: 'exchange', title: '午夜，交易所有一份错单',
      text: '系统崩了三秒，多出一笔没人认领的三百万信用点敞口。窗口只有一小时。',
      options: [
        { label: '吞下它', run: { stat: 'intellect', dc: 4, ok: { money: 90, track: { sin: 1 } }, bad: { money: -40, track: { loyalty: -2, sin: 1 } } } },
        { label: '上报，换一个恩情', run: { track: { loyalty: 3, renown: -1 } } },
        { label: '告诉灰市的人，抽成', run: { money: 25, track: { renown: 1, sin: 1 } } },
      ],
    },
    {
      id: 'e5', portrait: 'portrait-su', district: 'tower', title: '董事会在找你签字',
      text: '一份关于「定向削减冗余人力」的授权书。总数后面跟着四个零。',
      options: [
        { label: '签', run: { track: { loyalty: 3, power: 1, sin: 2, renown: -2 } } },
        { label: '拒签，并递上辞呈（姿态）', run: { track: { loyalty: -3, renown: 3, sin: -1 } } },
        { label: '签，但把名单换掉', run: { stat: 'stealth', dc: 4, ok: { track: { loyalty: 1, renown: 1, sin: 1 } }, bad: { track: { loyalty: -3 }, sin: 1 } } },
      ],
    },
    {
      id: 'e6', portrait: 'portrait-scientist', district: 'lab', title: '一条未被加密的私聊',
      text: '音轨里有两个人的呼吸，和一句「他不该活过这周」。其中一个是你认识的声音。',
      options: [
        { label: '顺着音轨找到人', run: { stat: 'stealth', dc: 3, ok: { intel: 5, power: 1 }, bad: { vitality: -2, sin: 1 } } },
        { label: '把音轨卖给目标', run: { money: 45, track: { renown: -1, sin: 2 } } },
        { label: '删除，自保', run: { track: { loyalty: 1, sin: 1 } } },
      ],
    },
    {
      id: 'e7', portrait: 'portrait-enforcer', district: 'docks', title: '有人替你挡了一刀',
      text: '外勤回来的路上，你的助理倒在副驾。他还有呼吸，但你只有一次选择。',
      options: [
        { label: '送他进私人诊所，花光现金', run: { money: -60, track: { renown: 2, loyalty: -1 } } },
        { label: '丢下他，抢在巡警前离开', run: { track: { sin: 2, renown: -3, vitality: 1 } } },
        { label: '联系灰市医生，用情报抵账', run: { intel: -4, track: { renown: 1, sin: 1 } } },
      ],
    },
    {
      id: 'e8', portrait: 'portrait-witch', district: 'orbit', title: '女术士的代理人',
      text: '一个穿银灰西装的人坐在你家客厅，说明天会下雨。他说他能让你看见牌底。',
      options: [
        { label: '接受：看牌底（获得情报与筹码）', run: { intel: 4, chips: 3, track: { sin: 2 } } },
        { label: '拒绝，并把他请出去', run: { track: { loyalty: 2, renown: 1 } } },
        { label: '当场把他扣下', run: { stat: 'force', dc: 4, ok: { power: 2, track: { sin: 1 }, intel: 2 }, bad: { vitality: -2, track: { loyalty: -2 } } } },
      ],
    },
    {
      id: 'e9', portrait: 'portrait-peng', district: 'lab', title: '旧档案：你自己的编号',
      text: '集团人事库里有一份关于你的评估，最后一栏写着「可回收」。',
      options: [
        { label: '改掉那一栏', run: { stat: 'stealth', dc: 3, ok: { track: { loyalty: 1, power: 1 } }, bad: { track: { sin: 2, loyalty: -1 } } } },
        { label: '把整份档案泄给媒体', run: { track: { renown: 3, loyalty: -3, sin: 1 } } },
        { label: '记下来，什么都不做', run: { track: { sin: 1, power: 1 } } },
      ],
    },
    {
      id: 'e10', portrait: 'portrait-yu', district: 'exchange', title: '一笔干净的生意',
      text: '一位老学者想买你手上某个部门的批文，出价不高，但他保证没有任何后患。',
      options: [
        { label: '卖给他', run: { money: 35, track: { renown: 1, loyalty: -1 } } },
        { label: '免费给他，换一份人情', run: { track: { renown: 2, sin: -1, loyalty: -1 } } },
        { label: '提高三倍价，压他', run: { stat: 'charm', dc: 3, ok: { money: 80 }, bad: { track: { renown: -2 } } } },
      ],
    },
    {
      id: 'e11', portrait: 'portrait-tie', district: 'docks', title: '停电的三十七分钟',
      text: '整栋楼黑了。有人趁着黑暗搬走了一批不该被搬走的东西。监控里只有一片雪花。',
      options: [
        { label: '带队封锁楼层，抓到人', run: { stat: 'force', dc: 4, ok: { power: 2, track: { loyalty: 2 }, intel: 2 }, bad: { vitality: -2, track: { loyalty: -1 } } } },
        { label: '趁乱自己搬一份', run: { money: 55, track: { sin: 1 } } },
        { label: '只记录时间，不动', run: { intel: 3, track: { loyalty: 1 } } },
      ],
    },
    {
      id: 'e12', portrait: 'portrait-fixer', district: 'slum', title: '一名下线的求救',
      text: '他发来定位，后面跟着三个字：「别过来」。',
      options: [
        { label: '过去', run: { stat: 'force', dc: 5, ok: { power: 3, track: { renown: 2, sin: 1 } }, bad: { vitality: -3, sin: 1 } } },
        { label: '派人过去', run: { money: -25, track: { renown: 1, power: 1 } } },
        { label: '删除定位', run: { track: { sin: 1, loyalty: 1, renown: -2 } } },
      ],
    },
    {
      id: 'e13', portrait: 'portrait-su', district: 'tower', title: '穹顶的雨',
      text: '酸性雨落在穹顶上，折射出一整座假的星空。有人说这是集团给穷人的礼物。',
      options: [
        { label: '投钱修缮下层排水', run: { money: -45, track: { renown: 3, loyalty: -1 } } },
        { label: '拍下照片，做成舆情素材', run: { track: { loyalty: 2, renown: -1 }, money: 15 } },
        { label: '站在雨里，什么也不做', run: { track: { sin: 1, vitality: -1, renown: 1 } } },
      ],
    },
    {
      id: 'e14', portrait: 'portrait-yu', district: 'exchange', title: '你的名字出现在牌桌上',
      text: '有人用你的名字下注，赔率是三赔一——赌你活不过这七天。',
      options: [
        { label: '自己也押一份', run: { stat: 'intellect', dc: 3, ok: { money: 70, track: { renown: 1 } }, bad: { money: -30, track: { sin: 1 } } } },
        { label: '查到庄家，砸了他的局', run: { stat: 'force', dc: 4, ok: { power: 2, renown: 2 }, bad: { vitality: -2, sin: 1 } } },
        { label: '假装没听说', run: { track: { loyalty: 1, sin: -1 } } },
      ],
    },
  ];

  /* ---------------- 命运商店 ---------------- */
  /* 局内商店已废弃：命运点只在局外结算，用于永久升级（game/meta.js NEXUS）。 */

  /* ---------------- 终局判定 ---------------- */
  const ENDINGS = [
    {
      id: 'sultan', name: '新的苏丹',
      priority: 100, cond: (s) => s.tracks.power >= 9 && s.tracks.sin >= 8 && s.tracks.loyalty < 6,
      text: '第十二张牌折下时，厅里的光暗了一瞬。没有人宣布什么，但你站起来的时候，所有人也跟着站起来了。董事的位置空着，你坐下去，尺寸刚好。窗外，穹顶上又下起了雨。',
    },
    {
      id: 'dog', name: '忠犬归位',
      priority: 96, cond: (s) => s.tracks.loyalty >= 9 && s.tracks.power < 8,
      text: '你把最后一张牌按在桌上，折得整整齐齐。董事会为你鼓了掌，很轻，像在夸奖一件工具保养得好。你被留了下来，也仅是被留了下来。',
    },
    {
      id: 'hero', name: '脏手的善人',
      priority: 92, cond: (s) => s.tracks.renown >= 8 && s.tracks.sin <= 3,
      text: '你折完牌，把那对代码臂卸在董事会桌上。档案里你叫「可回收」，从今天起不是了。下层的人后来在穹顶边缘给你立了一块没有名字的碑。',
    },
    {
      id: 'ghost_out', name: '幽灵离场',
      priority: 88, cond: (s) => s.tracks.sin <= 2 && s.tracks.renown < 5,
      text: '最后一天，没有告别的仪式。你在系统里删掉了自己的编号，穿过轨道港的侧门，头也不回。没有人追。奇怪的是，这比死更像一场胜利。',
    },
    {
      id: 'purged', name: '被回收',
      /* 折满十二张就算通关，游戏承诺过「折完全部十二张，你活下来」，
         通关的人不该再被判回收 —— 所以通关时这条让位给 w7
         「穹顶不需要干净的人」。罪痕满值只对没折完的人致命。 */
      priority: 84, cond: (s) => s.folded < CONFIG.deckGoal && s.tracks.sin >= 10,
      text: '你以为罪痕是勋章，其实那是编号。某一个清晨，你的门禁失效、账户清零、名字从系统里消失，连葬礼都省了。归档结论只有一行：「已回收」。',
    },
    {
      id: 'broken', name: '三十六层高的自由落体',
      /* 同上：折满十二张之后不再按忠诚判死。 */
      priority: 80, cond: (s) => s.folded < CONFIG.deckGoal && s.tracks.loyalty <= 0,
      text: '董事会不再需要你了。你被请进一间没有窗的会客室，对面的人一直在笑，笑到你不想再问下去。关于你的最后一条公开记录，是一次「自愿退出」。',
    },
    {
      id: 'emperor', name: '穹顶之上的名字',
      priority: 76, cond: (s) => s.tracks.power >= 10 && s.tracks.sin <= 6,
      text: '十二张牌，你折得干净漂亮。新签署的章程里，你的名字第一次出现在封面，而不是附录。穹顶的雨现在按你的规则落下来。',
    },
    {
      id: 'survivor', name: '活着就好',
      priority: 0, cond: () => true,
      text: '第十二张牌折下，你只是活着。在这里活着已经算一种功绩。你回到自己的椅子上，喝掉那杯已经凉透的茶，等下一场牌局发到你手上。',
    },
  ];

  return { CONFIG, DISTRICTS, PATHS, TIERS, STATS, TRACKS, ORIGINS, ASSETS, ACTIONS, DISTRICT_ACTIONS, EVENTS, ENDINGS };
})();

/* ===== game/content-extra.js ===== */
/* 由 design/WORLD.md 转换而来：30 条扩展事件 + 6 个扩展结局 */
(function () {
  'use strict';

  window.EVENTS_EXTRA = [
    { id: 'x1', portrait: 'portrait-monitor', district: 'tower', title: '电梯里的四次刷卡',
      text: '电梯停在 33 层，门没开，灯灭了两秒。同乘的四个人都在看你，然后其中一个人说：你的编号，是不是换了开头。',
      options: [
        { label: '承认，并顺势打听是谁换的', run: { intel: 3, track: { sin: 1 } } },
        { label: '假装没听见，盯着楼层显示器', run: { track: { loyalty: 1, renown: -1 } } },
        { label: '按下紧急通话，记录这次停梯', run: { intel: 2, vitality: -1, track: { loyalty: 1 } } },
      ] },
    { id: 'x2', portrait: 'portrait-su', district: 'tower', title: '监事会的空椅子',
      text: '简报会上，监事的位置空着，桌上那杯茶还是热的。散会前没有一个人提起这件事，就像那个人从来没坐过这里。',
      options: [
        { label: '主动去他办公室，留下自己的名字', run: { track: { loyalty: 2, power: 1, sin: 1 } } },
        { label: '把这件事报给董事会', run: { track: { loyalty: 3, renown: -2 } } },
        { label: '什么也不做，按时退场', run: { intel: 1, track: { sin: -1 } } },
      ] },
    { id: 'x3', portrait: 'portrait-monitor', district: 'tower', title: '一份没人认领的辞呈',
      text: '人事系统里出现一份辞呈，署名是你，日期是明天。你没有写过，但格式、措辞、连错别字的位置都对。',
      options: [
        { label: '当作系统故障，向上报备', run: { intel: 1, track: { loyalty: 2 } } },
        { label: '照单使用，让「你」先离开', run: { track: { sin: 1, power: 1, loyalty: -2 } } },
        { label: '查到提交人，亲自上门', run: { intel: 4, vitality: -1, track: { sin: 1 } } },
      ] },
    { id: 'x4', portrait: 'portrait-dai', district: 'exchange', title: '收盘前九十秒',
      text: '收盘前 90 秒，你的账号里多出一笔不属于你的保证金。金额不大，刚好够你买下一个人的忠诚，也刚好够你被追责。',
      options: [
        { label: '原路退回，并留下回执', run: { track: { loyalty: 2, renown: 1 } } },
        { label: '用它做一笔短线，赚完就撤', run: { money: 45, track: { sin: 2 } } },
        { label: '留着不动，观察谁会来认领', run: { intel: 3, track: { sin: 1 } } },
      ] },
    { id: 'x5', portrait: 'portrait-yu', district: 'exchange', title: '一位母亲的股权',
      text: '她把亡夫的股权换成回穹顶内侧的居住许可，手续差一个签名。签名栏上写着你的职位，不是你的名字。',
      options: [
        { label: '签。', run: { money: -15, track: { renown: 3, loyalty: -1 } } },
        { label: '不签，但帮她走别的门路', run: { track: { renown: 1, sin: -1 } } },
        { label: '签，条件是她把亡夫的档案给你', run: { intel: 4, track: { sin: 2, renown: 1 } } },
      ] },
    { id: 'x6', portrait: 'portrait-dai', district: 'exchange', title: '慈善晚宴的拍卖单',
      text: '晚宴拍卖的最后一件标的，是「一条不会被记录的下水道」。举牌的人里有董事会的人，也有下层来的人。',
      options: [
        { label: '举牌，把它买下来还给下层', run: { money: -60, track: { renown: 3, loyalty: -1 } } },
        { label: '举牌，然后转手卖给出价更高的人', run: { money: 70, track: { sin: 2, renown: -1 } } },
        { label: '不举牌，把整份拍卖名单拍下来', run: { intel: 3, chips: 1 } },
      ] },
    { id: 'x7', portrait: 'portrait-scientist', district: 'lab', title: '三号门禁的静音区',
      text: '三号门禁在凌晨出现 11 分钟空档，监控显示这段时间没有人进出。但你能闻到一股不属于这里的消毒水味。',
      options: [
        { label: '进去看那 11 分钟里有什么', run: { intel: 4, vitality: -2, track: { sin: 1 } } },
        { label: '把空档上报，换一次功劳', run: { track: { loyalty: 3, power: 1, sin: -1 } } },
        { label: '不动，只记下气味和值班表', run: { intel: 2, gear: 1 } },
      ] },
    { id: 'x8', portrait: 'portrait-peng', district: 'lab', title: '伦理审查的黑箱',
      text: '黑箱里有一个编号，标注是「志愿者」。编号对应的名字你有印象，是三个月前在这条走廊和你点过头的人。',
      options: [
        { label: '打开完整档案', run: { intel: 5, track: { sin: 1, loyalty: -1 } } },
        { label: '把编号抄下来，交给监事会', run: { track: { loyalty: 3, renown: 1, sin: 1 } } },
        { label: '装作没看见，转身离开', run: { intel: 1, track: { sin: -1 } } },
      ] },
    { id: 'x9', portrait: 'portrait-scientist', district: 'lab', title: '一只被退回的样品',
      text: '一只编号被涂改过的样品被退回，退回原因一栏写着「收件人已不存在」。签收栏是空的，等着被填。',
      options: [
        { label: '替程砚签下这个名字', run: { gear: 2, track: { power: 2, sin: 2 } } },
        { label: '把样品直接销毁', run: { intel: 1, track: { sin: -1, renown: 1 } } },
        { label: '把样品送到监事会', run: { track: { loyalty: 3, sin: 1 } } },
      ] },
    { id: 'x10', portrait: 'portrait-fixer', district: 'slum', title: '下雨天的排队',
      text: '雨落进来变成泥，队伍从街口排到巷尾，所有人都在等同一个排水阀被打开。阀门的钥匙在集团手里，开阀的申请单在你部门。',
      options: [
        { label: '批了这份申请', run: { money: -25, track: { renown: 3, loyalty: -2 } } },
        { label: '把申请转给灰市，让他们去开', run: { money: 30, track: { sin: 1, renown: 1 } } },
        { label: '不批，把申请压到期限结束', run: { track: { loyalty: 2, renown: -2, sin: 1 } } },
      ] },
    { id: 'x11', portrait: 'portrait-lu', district: 'slum', title: '诊所里的两份账单',
      text: '陆晚给你包完伤口，把两份账单并排放着。一份是你该付的，另一份的付款人写着「穹顶集团，代付」。',
      options: [
        { label: '付自己那份，把另一份撕掉', run: { money: -20, track: { renown: 2, sin: -1 } } },
        { label: '签下集团代付的那份', run: { track: { sin: 1, loyalty: 1 } } },
        { label: '问她另一份是谁在替谁付', run: { intel: 4, track: { sin: 1 } } },
      ] },
    { id: 'x12', portrait: 'portrait-fixer', district: 'slum', title: '巷子尽头的广播',
      text: '广播开始念名单，念到的一半人你见过。名单念完，广播说：以上人员已被回收，请勿询问。',
      options: [
        { label: '把名单录下来，逐一对', run: { intel: 5, track: { sin: 1 } } },
        { label: '找到广播的源头，把它关掉', run: { vitality: -2, track: { power: 2, renown: 1 } } },
        { label: '让灰市把这段广播转卖出去', run: { money: 40, track: { sin: 2, renown: -1 } } },
      ] },
    { id: 'x13', portrait: 'portrait-tie', district: 'docks', title: '凌晨三点的装箱单',
      text: '一张凌晨三点的装箱单，收货人一栏写着你的编制号，货物名一栏是空的。单子是真的，章也是真的。',
      options: [
        { label: '去码头，等这箱货到', run: { gear: 2, intel: 2, vitality: -2 } },
        { label: '把单子截下，报给监事会', run: { chips: 1, track: { loyalty: 3 } } },
        { label: '按单收货，然后原封不动转手', run: { money: 55, track: { sin: 2 } } },
      ] },
    { id: 'x14', portrait: 'portrait-enforcer', district: 'docks', title: '罢工的第四天',
      text: '罢工进入第四天。董事会要你三天内复工，工人要你一句话。铁贵说，只要你说这不是他们先动的手，他就信。',
      options: [
        { label: '替工人说这句话', run: { track: { renown: 3, loyalty: -3, power: 1 } } },
        { label: '按董事会要求强推复工', run: { track: { loyalty: 3, power: 2, renown: -2, sin: 1 } } },
        { label: '两边都不表态，私下给他们一笔钱', run: { money: -45, track: { renown: 1, sin: 1 } } },
      ] },
    { id: 'x15', portrait: 'portrait-tie', district: 'docks', title: '一艘没有登记的船',
      text: '船靠了岸，船上的人指名要见你。他们带来的东西既能救一些人，也能让很多人闭嘴。',
      options: [
        { label: '见，并接下这单', run: { money: 60, gear: 1, track: { sin: 2 } } },
        { label: '见，然后举报', run: { intel: 2, track: { loyalty: 4, renown: -2 } } },
        { label: '不见，把船赶走', run: { track: { sin: -1, renown: 1, loyalty: -1 } } },
      ] },
    { id: 'x16', portrait: 'portrait-witch', district: 'orbit', title: '候补名单',
      text: '候补名单上出现了你的名字，而你从没申请过出境。排在前面的人一个个都还在等，没有一个被叫到。',
      options: [
        { label: '查是谁把你放上去的', run: { intel: 4, track: { sin: 1 } } },
        { label: '接受这份名单，用一个名额换一份情报', run: { intel: 3, chips: 2, track: { sin: 1 } } },
        { label: '要求把自己从名单上删掉', run: { track: { loyalty: 2, renown: -1, power: -1 } } },
      ] },
    { id: 'x17', portrait: 'portrait-yuke', district: 'orbit', title: '一个不想走的人',
      text: '一个买到票的人跪着求你把他从名单上删掉。他说名单上是他的儿子，儿子的病撑不到这颗星球外面。',
      options: [
        { label: '帮他调换名单', run: { track: { renown: 2, sin: 2, power: 1 } } },
        { label: '拒绝，按流程送他儿子上船', run: { track: { loyalty: 3, renown: -2 } } },
        { label: '收钱，然后照办', run: { money: 50, track: { sin: 2, renown: -2 } } },
      ] },
    { id: 'x18', portrait: 'portrait-witch', district: 'orbit', title: '穹顶边缘的雨',
      text: '玻璃外面，雨一直下在穹顶那一边，像有人在另一个世界敲窗。雨客站在你旁边，问：你听过雨落在地上的声音吗。',
      options: [
        { label: '跟他走一段', run: { intel: 4, track: { power: 1, sin: 1, loyalty: -2 } } },
        { label: '留下，记录这条通道的位置', run: { intel: 3, track: { loyalty: 2 } } },
        { label: '转身，回去上班', run: { track: { loyalty: 1, sin: -1 } } },
      ] },
    { id: 'x19', portrait: 'portrait-su', district: 'tower', title: '董事会的投票',
      text: '一份关于「提前终止部分执行人合约」的议案进入表决。你没有被邀请旁听，但你收到了缺席投票的表格。',
      options: [
        { label: '投赞成，换一次信任', run: { track: { loyalty: 3, sin: 1, renown: -1 } } },
        { label: '投弃权，谁也不得罪', run: { track: { loyalty: 1, sin: -1 } } },
        { label: '找出议案附件的名单，看上面有没有自己', run: { intel: 5, track: { loyalty: -1 } } },
      ] },
    { id: 'x20', portrait: 'portrait-yu', district: 'exchange', title: '评级下调',
      text: '评级机构把你名下那家空壳公司列入「建议清算」观察名单。公告发出后，你的电话一直响，都是来问价的。',
      options: [
        { label: '公开澄清，稳住信用', run: { money: -30, track: { renown: 2 } } },
        { label: '趁低价把它彻底脱手', run: { money: 65, track: { power: -2, sin: 1 } } },
        { label: '让它清算，把资金转去别的地方', run: { money: 45, track: { loyalty: -2, sin: 2 } } },
      ] },
    { id: 'x21', portrait: 'portrait-peng', district: 'lab', title: '断电的七分钟',
      text: '园区断电七分钟，备用电源只保住了地下三层。监控里出现一段不该存在的影像：有人在签收栏上写字。',
      options: [
        { label: '调出那段影像，逐帧看', run: { intel: 5, track: { sin: 1 } } },
        { label: '通知安保，让他们去查', run: { track: { loyalty: 3, power: 1 } } },
        { label: '删除影像，替写下那个名字的人遮掩', run: { track: { sin: 2, power: 2, loyalty: -1 } } },
      ] },
    { id: 'x22', portrait: 'portrait-lu', district: 'slum', title: '一个孩子的名字',
      text: '一个孩子拦住你，报出一个名字，问这个人是不是你杀的。他说这个名字的时候，眼睛没有眨。',
      options: [
        { label: '承认，并给他一笔钱', run: { money: -35, track: { sin: -1, renown: 1 } } },
        { label: '否认，转身就走', run: { track: { sin: 1, renown: -1 } } },
        { label: '问是谁让他来问的', run: { intel: 3, track: { sin: 1 } } },
      ] },
    { id: 'x23', portrait: 'portrait-enforcer', district: 'docks', title: '保险公司的电话',
      text: '保险公司打来，问你要不要为「凌晨三点那批货」投保。他们说已经有人替你付了首年保费。',
      options: [
        { label: '接受，顺藤摸瓜查付款人', run: { intel: 4, track: { sin: 1 } } },
        { label: '拒绝，并报案', run: { track: { loyalty: 3, renown: -1 } } },
        { label: '接受，但不查', run: { gear: 1, track: { sin: 2 } } },
      ] },
    { id: 'x24', portrait: 'portrait-yuke', district: 'orbit', title: '轨道港的清舱',
      text: '轨道港宣布清舱，所有滞留人员一律遣返。清舱名单贴在墙上，第一行就是你的名字，后面跟着一个你没见过的职衔。',
      options: [
        { label: '按名单上船，看看船开去哪', run: { intel: 4, vitality: -2, track: { sin: 1 } } },
        { label: '撕掉名单，先走的人先查', run: { track: { power: 2, renown: -1, sin: 1 } } },
        { label: '把名单拍下来，交给雨客', run: { intel: 3, track: { power: 1, loyalty: -3 } } },
      ] },
    { id: 'x25', portrait: 'portrait-monitor', district: 'tower', title: '你的继任者',
      text: '走廊尽头有人和你打招呼，用的是你的头衔。他比你年轻，讲话比你稳，看你的眼神像在看一份过期的授权书。',
      options: [
        { label: '主动带他熟悉业务，把他留在身边', run: { track: { loyalty: 2, power: 1, sin: 1 } } },
        { label: '找出他上位的推荐人', run: { intel: 5, track: { sin: 1 } } },
        { label: '什么都不做，让他自己去碰壁', run: { track: { renown: 1, power: 1, loyalty: -1 } } },
      ] },
    { id: 'x26', portrait: 'portrait-dai', district: 'exchange', title: '一场公开的听证',
      text: '广场上开了一场公开听证，议题是「中层执行人权限的合理性」。你被安排坐在最后一排，话筒却一直递到你面前。',
      options: [
        { label: '上台，把流程的问题讲清楚', run: { track: { renown: 3, loyalty: -2 } } },
        { label: '拒绝发言，只提交书面意见', run: { intel: 2, track: { loyalty: 1 } } },
        { label: '把听证变成对某个具体人的指控', run: { track: { power: 2, sin: 2, renown: -1 } } },
      ] },
    { id: 'x27', portrait: 'portrait-fixer', district: 'slum', title: '灰市的规矩',
      text: '老鸦给你一张纸，上面写着三条规矩，第四条空着。他说第四条由你填，填完这张纸就算数。',
      options: [
        { label: '写下「不碰孩子」', run: { track: { renown: 2, sin: -1, power: 1 } } },
        { label: '写上「先付钱」', run: { money: 45, track: { sin: 1 } } },
        { label: '把纸折起来，不收', run: { track: { loyalty: 1, sin: -1 } } },
      ] },
    { id: 'x28', portrait: 'portrait-scientist', district: 'lab', title: '不可签收品',
      text: '程砚把那件东西推到你面前，签收栏空着。她说：你可以签，也可以不签，但无论如何，它明天都会完成。',
      options: [
        { label: '签下自己的名字', run: { gear: 2, track: { power: 3, sin: 2 } } },
        { label: '拒绝签收，并上报', run: { track: { loyalty: 3, renown: 2, power: -2 } } },
        { label: '替他找另一个人来签', run: { intel: 4, track: { sin: 2, renown: -1 } } },
      ] },
    { id: 'x29', portrait: 'portrait-tie', district: 'docks', title: '一箱没有标签的货',
      text: '吊机吊下来一箱没有标签的货，箱门缝里渗出类似血的气味。值班的人全都不见了，只剩下你和这箱东西。',
      options: [
        { label: '直接开箱', run: { gear: 2, intel: 3, vitality: -2, track: { sin: 1 } } },
        { label: '把箱子推回运单系统', run: { track: { loyalty: 2, sin: 1 } } },
        { label: '通知彭戬，让他带人来', run: { track: { loyalty: 3, power: 1, renown: -1 } } },
      ] },
    { id: 'x30', portrait: 'portrait-witch', district: 'orbit', title: '雨客的第二次见面',
      text: '雨客第二次来找你，这次他带了一张不是这个星球的轨道图。他说：上面没有穹顶，也没有你的编号。你可以留着，也可以烧掉。',
      options: [
        { label: '收下那张图', run: { intel: 5, track: { sin: 1, loyalty: -2 } } },
        { label: '收下并转交给监事会', run: { track: { loyalty: 4, power: 1, sin: 2 } } },
        { label: '当场烧掉，告诉他不要再来了', run: { track: { loyalty: 2, sin: -1, renown: 1 } } },
      ] },
  ];

  window.ENDINGS_EXTRA = [
    // 近似：文档条件为「power >= 8 且 renown >= 8 且 sin <= 4」，直接用四轨判定。
    { id: 'w1', name: '账本之外', priority: 60, cond: (s) => s.tracks.power >= 9 && s.tracks.renown >= 9 && s.tracks.sin <= 3,
      text: '你折完最后一张牌，然后把那本记着所有人的账，原样放回桌上。没有人拦你，因为你已经不需要被拦。你走出高塔，电梯这次没有停。街上的雨还在下，落在你肩上是凉的，你第一次觉得凉也是种证明。清算行连夜改了报价，把「执行人」这一栏删掉了。有人在广场上贴了一张纸，上面写着你的名字，第二天就被雨泡烂了，但你确实看见过。' },
    // 近似：文档依赖「与程砚关系」，系统暂无关系值，退化为折完全部 12 张牌且声望与权柄中上。
    { id: 'w2', name: '替她签收', priority: 58, cond: (s) => s.tracks.power >= 8 && s.tracks.sin >= 5 && s.tracks.renown < 8,
      text: '签收栏终于有了字。程砚看了很久，然后把笔递回给你，说：谢谢。那件东西完成后没有造成任何事，它只是安静地待在下面，等着被需要的那一天。你回到自己的办公室，发现桌上多了一份新指令，编号是空的。你把笔放好，坐下，等着第一个告诉你要怎么做的人。窗外，穹顶内侧的雾照旧。你替所有人签了一个名字。' },
    // 近似：文档依赖「与潮结盟」关系，系统暂无关系值，退化为忠诚跌破阈值的通关条件。
    { id: 'w3', name: '雨落进来', priority: 56, cond: (s) => s.tracks.loyalty <= 2 && s.tracks.sin >= 4,
      text: '穹顶第 41 号接缝在你手上裂开的时候，没有警报，只有风。风里有酸味，还有人抬头。第一场雨落在下层居住区的前十七秒里，没有人跑，所有人都在伸手。你站在雨里，衣服很快就湿透，编号也在同一时间被系统抹去。后来他们管那天叫第二次灰潮，也管那天叫第一次放晴。两个名字都没错，都跟你没关系了。' },
    // 近似：文档条件为「通关，但罪痕 >= 7 且忠诚 <= 4」。
    { id: 'w4', name: '第十二名', priority: 54, cond: (s) => s.tracks.sin >= 9 && s.tracks.loyalty <= 5,
      text: '最后一张牌折下，董事会为你开了香槟。第三杯时，例会的主持人向你介绍了对面那位，说：这位是第十二号。你才想起来，这一局牌本来有十二个人在打，而现在只剩你和对面的他。你和他对视了三秒，然后一起笑了。桌面下，两把枪都没有拔。桌上又发下一副新牌，洗完以后，谁也不会知道刚才那副是谁洗的。' },
    // 近似：文档条件为「money <= 20 且 renown >= 6 且通关」，直接用钱与声望判定。
    { id: 'w5', name: '十八块钱的葬礼', priority: 52, cond: (s) => s.money <= 25 && s.tracks.renown >= 8,
      text: '你死的时候账户里剩下十八块。陆晚用这笔钱给你买了最便宜的骨灰盒，老鸦替你出了剩下的运费。来的人不多，但每一个都真的认识你。名单上你那一栏被划掉，括号里写着「非回收」。穹顶照旧下雨，落在你留下过名字的那条巷口，声音比落在别处轻一点。这算不上什么好结局，但它确实是你自己挣来的。' },
    // 近似：文档条件为「四轨全部落在中段，且通关」，中段取 4 到 8 的闭区间。
    { id: 'w6', name: '穹顶照着旧样子',
      priority: 50, cond: (s) => s.folded >= 12 && s.tracks.power >= 4 && s.tracks.power <= 8 && s.tracks.renown >= 4 && s.tracks.renown <= 8 && s.tracks.sin >= 4 && s.tracks.sin <= 8 && s.tracks.loyalty >= 4 && s.tracks.loyalty <= 8,
      text: '你没有变成谁的人，也没有把谁变成你的人。十二张牌，每一张都折得既不漂亮也不难看。散局那天，你回到工位，把那杯茶重新泡了一遍。穹顶还是那个穹顶，雨还是那场雨，穷人和富人都还在原来的位置上。有人问你，这七天你做了什么。你想了想，说：我什么都没改。然后你听见自己在心里补了一句——这在穹顶里，已经很难。' },
    // 通关但罪痕压不下来。以前这种局面会被判「被回收」，等于折满十二张还死，
    // 和游戏开头承诺的「折完全部十二张，你活下来」直接打架。
    // 现在通关的归通关，脏的部分体现在活成什么样。
    { id: 'w7', name: '穹顶不需要干净的人',
      /* 门槛取 10，和原来「被回收」的判定线一致：
         以前 sin>=10 直接判死，现在通关的人改判这里。
         取 8 试过，会吞掉大半普通通关局，把其它赢法全压掉了。 */
      priority: 83, cond: (s) => s.folded >= 12 && s.tracks.sin >= 10,
      text: '十二张牌，你一张不落地折完了。清档那天，董事会没有提你的罪痕，一个字都没提——提了就得处理，不处理就得解释。你被留下了，职位还升了半格。只是从那以后，没人再跟你同一个电梯。有人在你工位旁边贴了新的巡检表，签名栏留给你，前面几栏永远空着。你签了。你签了很多年。' },
  ];
})();

/* ===== game/content-v2.js ===== */
/* ==========================================================
   《七日指令》v2 追加结局 —— 假好结局 / 真好结局 / 坏结局
   与既有结局一起按顺序判定，兜底结局始终在最后
   ========================================================== */
(function () {
  'use strict';

  window.ENDINGS_EXTRA2 = [

    /* ---------- 假好结局：看起来赢麻了，其实是被留了下来当下一副牌 ---------- */
    {
      id: 'v2_fake', name: '最配合的那个人',
      priority: 120, cond: (s) => s.folded >= 12 && s.tracks.loyalty >= 10 && s.tracks.power >= 9
                && s.tracks.sin >= 8 && s.tracks.renown <= 6,
      kind: 'fake',
      text: '十二张牌，你一张不落地折完，每一张都折在最合适的位置上。董事会为你开了会，会上所有人都站起来鼓掌，主持人说你已经证明了中层可以有多可靠。散会前，他把一副新牌推回你面前，说：那就再来一局。你低头看那副牌，第一张的编号是你自己的工号。你笑着点头，把牌收进内袋。掌声又响了一次，比刚才更热烈。你忽然想不起来，上一次有人问你累不累是什么时候。',
    },

    /* ---------- 真好结局：不靠任何一方，把规则本身改掉 ---------- */
    {
      id: 'v2_true', name: '牌不再发下来',
      /* 两条路都能走到这里：
         一条是你自己够干净、够有声望、手上也有权柄；
         另一条是她替你把「执行人」那一栏填了 —— 她把你从流程里拿出去，
         你才有机会走到流程外面。这一条是她的牺牲换来的。 */
      priority: 118, cond: (s) => s.folded >= 12 && (
        (s.tracks.renown >= 9 && s.tracks.sin <= 4 && s.tracks.power >= 9) ||
        (s.guideGone && s.tracks.sin <= 7)
      ),
      kind: 'true',
      text: '你把最后一张牌折掉，然后没有把它放进回收格，而是塞进了董事会那台发牌机的进纸口。机器卡住了，先是停了一秒，然后吐出一整叠空白的卡。你抽出最上面那张，翻过来给所有人看——什么都没有印。会议室里安静了很久，久到有人先笑了。那天以后，穹顶集团再没有下发过指令卡。你走出高塔的时候雨还在下，但落在地面上是干净的，没有酸味。有人在广场上念了一段广播，说回收名单已经全部清空。你没听清念的是谁的名字，你只是继续往前走。',
    },

    /* ---------- 坏结局：活着通关，但已经不是原来那个人 ---------- */
    {
      id: 'v2_bad', name: '我认得这张脸吗',
      priority: 116, cond: (s) => s.folded >= 12 && s.tracks.sin >= 7 && s.tracks.renown <= 4 && s.tracks.power <= 6,
      kind: 'bad',
      text: '第十二张牌折下的时候，你已经没有感觉了。折卡的手很稳，稳到你有点陌生。散局之后，你按习惯去了下层那家常去的诊所，陆晚抬头看了你很久，然后问：你找谁。你说是我。她把手里的针放下来，仔细看了看你的脸，说：你上次来是三年前，那时候你还会因为一句话脸红。你想找一句反驳的，但你不记得脸红是什么感觉。你转身出去，雨落在你身上，你发现有件小事值得高兴——你还记得回家的路。',
    },
  ];
})();

/* ===== game/content-map2.js ===== */
/* 地图扩张与初见事件 —— 由内容设计生成 */
(function () {
  'use strict';

  /* ---------------- 新增城区（六区 -> 十区） ---------------- */
  window.DISTRICTS_EXTRA = [
    {
      id: 'ring', name: '环带维修层', en: 'RING', x: 0.105, y: 0.12, color: '#98a2ad', portrait: 'portrait-peng',
      desc: '穹顶内侧的夹层，管壁一直在响。照明坏了一半没人换，剩下的把影子拉得很长。空气是铁锈和绝缘漆的味道。',
    },
    {
      id: 'memory', name: '记忆银行', en: 'MEMORY', x: 0.935, y: 0.29, color: '#86b6cf', portrait: 'portrait-dai',
      desc: '恒温负十八度，走廊只有制冷机的低鸣。柜台后面存着几十万份人格备份，每一份都比你值钱。光很冷，是蓝色的。',
    },
    {
      id: 'salvage', name: '回收场', en: 'SALVAGE', x: 0.43, y: 0.88, color: '#c9763c', portrait: 'portrait-fixer',
      desc: '义体、旧枪、报废终端在这里被拆成零件，再按斤卖回去。白天空地冒烟，夜里有人翻找还温的货。味道是焦塑料。',
    },
    {
      id: 'outside', name: '穹顶之外', en: 'OUTSIDE', x: 0.91, y: 0.91, color: '#7ea86b', portrait: 'portrait-yuke',
      desc: '接缝外侧，官方不允许任何人走的非法口子——轨道港那条路要票要号，这里只要肯淋雨。酸雨斜着落下来，把一切泡成绿色，站够十分钟衣服就发痒。远处有灯，那不是城。',
    },
  ];

  /* ---------------- 新增资产（可被指令指向的目标） ---------------- */
  window.ASSETS_EXTRA = [
    { id: 's1',  name: '接缝巡检班',     level: 1, tags: ['expand', 'control'],  resist: 1, district: 'ring',    note: '夜班的巡道工先签字，再假装什么都没看见。' },
    { id: 's2',  name: '备件灰库',       level: 2, tags: ['capital', 'expand'],  resist: 2, district: 'ring',    note: '清单上少了三百个密封圈，谁也没报案。' },
    { id: 's3',  name: '四十一号接缝控制台', level: 3, tags: ['expand', 'purge'], resist: 3, district: 'ring',    note: '开一次阀门需要两把钥匙，另一把在别人手里。' },
    { id: 's4',  name: '雨线落脚棚',     level: 1, tags: ['control', 'capital'], resist: 1, district: 'outside', note: '棚顶漏得很有规律，进来的人都先抖一抖外套。' },
    { id: 's5',  name: '酸雨集水渠',     level: 2, tags: ['capital', 'expand'],  resist: 2, district: 'outside', note: '水渠通向下层，也通向下层不该有的东西。' },
    { id: 's6',  name: '潮的接应船',     level: 3, tags: ['expand', 'purge'],    resist: 3, district: 'outside', note: '船不靠岸，人在水里走完最后十米。' },
    { id: 's7',  name: '义体拆解棚',     level: 1, tags: ['capital', 'purge'],   resist: 1, district: 'salvage', note: '手快的人一晚能拆出三副还能用的膝关节。' },
    { id: 's8',  name: '旧件翻新栈',     level: 2, tags: ['capital', 'control'], resist: 2, district: 'salvage', note: '翻新过的枪都有编号，编号是后刻的。' },
    { id: 's9',  name: '回收品分拣中心', level: 3, tags: ['expand', 'capital'],  resist: 3, district: 'salvage', note: '传送带从不停，谁也不敢问最后一段通到哪。' },
    { id: 's10', name: '记忆柜台',       level: 1, tags: ['control', 'capital'], resist: 1, district: 'memory',  note: '柜台玻璃很厚，办事的人都不看对方的眼睛。' },
    { id: 's11', name: '备份托管库',     level: 2, tags: ['purge', 'control'],   resist: 2, district: 'memory',  note: '有人的备份在这里放了七年，没人来取。' },
    { id: 's12', name: '人格副本交易所', level: 3, tags: ['capital', 'purge'],   resist: 4, district: 'memory',  note: '一份副本的报价，够买下一条街的整层住户。' },
  ];

  /* ---------------- 初见事件（第一次遇到某个 NPC） ---------------- */
  window.EVENTS_MEET = [
    {
      id: 'm1', portrait: 'portrait-monitor', district: 'tower', title: '初见 · 闻铎',
      text: '早会散得比平时快。你没来得及走，监事已经在门口等你，手里那杯茶一口没动。他说他叫闻铎，负责盯着董事会里谁在越界，也负责盯着你这样的新人。他问你编号前四位，然后记在本子上。走廊的空调正好在这一刻停了。',
      options: [
        { label: '报上编号，多解释一句', run: { intel: 2, track: { loyalty: 2, sin: 1 } } },
        { label: '只报编号，不多说', run: { track: { loyalty: 1, renown: 1 } } },
        { label: '反问他记这个做什么', run: { intel: 3, track: { loyalty: -1, power: 1 } } },
      ],
    },
    {
      id: 'm2', portrait: 'portrait-su', district: 'tower', title: '初见 · 苏纹',
      text: '你在走廊尽头找会议室，走了两圈都没找到。一个短发女人从屏风后抬起头，说：你迟到了十一分钟，会已经开完。她把护腕转过来，上面贴着今天所有会面的顺序，包括你被谁跳过。她说她叫苏纹，管日程，也管谁在哪一天见不到人。',
      options: [
        { label: '请她把自己排进去', run: { intel: 2, track: { loyalty: 1, power: 1 } } },
        { label: '记下那张顺序表', run: { intel: 3, track: { renown: 1, sin: 1 } } },
        { label: '道谢，明天再来', run: { track: { renown: 1 }, vitality: 1 } },
      ],
    },
    {
      id: 'm3', portrait: 'portrait-yu', district: 'exchange', title: '初见 · 郁南枝',
      text: '清算行的灯亮到凌晨。你替部门去补一份回执，柜台后面的女人连头都没抬，让你把文件放在第二格。她叫郁南枝，清算行首席，说话不用形容词。她扫了一眼你的签名，说：你的部门欠了三天结算，钱明天到，人就还能留着。',
      options: [
        { label: '承认差额，请她宽限一天', run: { track: { loyalty: 1, renown: 1 } } },
        { label: '把回执留下，问她名字', run: { intel: 2, track: { renown: 1 } } },
        { label: '顺手问一句自己的额度', run: { money: 20, intel: 1 } },
      ],
    },
    {
      id: 'm4', portrait: 'portrait-dai', district: 'exchange', title: '初见 · 戴思远',
      text: '审核窗口的队排到楼梯口。轮到你时，眼镜后面的男人先伸手要本子，而不是你的证件。他叫戴思远，合规伦理审查官，把你的每句话都记下来，最后问了一句：这份文件你读过吗。你说读过。他点头，说那就好，然后在你名字旁边画了一个圈。',
      options: [
        { label: '老实回答每一条', run: { intel: 2, track: { loyalty: 2, sin: -1 } } },
        { label: '问他那个圈是什么意思', run: { intel: 3, track: { renown: 1 } } },
        { label: '把自己的本子也拿出来', run: { intel: 1, track: { renown: 2, loyalty: -1 } } },
      ],
    },
    {
      id: 'm5', portrait: 'portrait-scientist', district: 'lab', title: '初见 · 程砚',
      text: '你送一份批复进园区，前台让你在三号门等。一个白大褂从静音走廊出来，眼镜腿上缠着胶带，接过文件只看落款。她说她叫程砚，是这里造东西的人。她没问你是谁，只问你有没有权签字。你说没有。她说那也行，下次记得带。',
      options: [
        { label: '承诺下次带批复来', run: { intel: 2, track: { loyalty: 1, power: 1 } } },
        { label: '问他地下在造什么', run: { intel: 3, track: { sin: 1 } } },
        { label: '替他把文件送到签收栏', run: { chips: 1, track: { renown: 1, power: 1 } } },
      ],
    },
    {
      id: 'm6', portrait: 'portrait-peng', district: 'lab', title: '初见 · 彭戬',
      text: '三号门禁把你拦了下来。检查你证件的人左手是义体，戴着从不摘的手套。他叫彭戬，研究所安保总管，只对院长和规则负责。他把你的包翻了一遍，什么也没找到，就说你可以进去了。走了两步他又叫住你，说他记住了你的鞋，下次别换。',
      options: [
        { label: '把鞋指给他看，笑一下', run: { track: { renown: 1, loyalty: 1 } } },
        { label: '问他记住了多少人的鞋', run: { intel: 3 } },
        { label: '请他喝一杯，被拒', run: { track: { renown: 1, loyalty: -1 } } },
      ],
    },
    {
      id: 'm7', portrait: 'portrait-fixer', district: 'slum', title: '初见 · 老鸦',
      text: '雨天的巷口，一个瘸腿的男人撑着棚布卖零件。你只是想问路，他先报出你部门的名字，然后报出你昨天在哪喝酒。他叫老鸦，灰市掮客，一条腿是旧货义体，记仇也记恩。他说：我不认识你，但我认识你的钱包。坐下喝口热的。',
      options: [
        { label: '坐下喝一杯，交个朋友', run: { intel: 2, track: { renown: 1, sin: 1 } } },
        { label: '问他从哪知道你部门', run: { intel: 3, track: { power: 1 } } },
        { label: '谢过，记下这个棚子', run: { intel: 1, track: { loyalty: 1 } } },
      ],
    },
    {
      id: 'm8', portrait: 'portrait-lu', district: 'slum', title: '初见 · 陆晚',
      text: '外勤留下的一道口子，你自己找上门。帘子后面的人没有问伤怎么来的，先让你把手洗干净。她叫陆晚，无证诊所医生，袖口有洗不掉的血渍。缝到第七针她抬头看你一眼，说：你手心一直攥着，是怕疼，还是怕我看出来你是谁。',
      options: [
        { label: '松开手，让她缝完', run: { vitality: 1, track: { renown: 1, sin: -1 } } },
        { label: '问她见过多少我这样的人', run: { intel: 2, track: { renown: 1 } } },
        { label: '报上工号，让她记账', run: { track: { loyalty: 1, sin: 1 } } },
      ],
    },
    {
      id: 'm9', portrait: 'portrait-tie', district: 'docks', title: '初见 · 铁贵',
      text: '装卸区罢工第三天，你代表部门去谈。铁贵把手上的油先擦干净，才伸手跟你握。他四十岁，装卸工会头目，说话不快也不漂亮。他说别的他不管，只想让兄弟们有一份看得见的活干。谈完他送你出闸口，说：下次来别带公文包，带耳朵。',
      options: [
        { label: '答应把诉求带上去', run: { track: { renown: 2, loyalty: -1 } } },
        { label: '只谈复工条件', run: { intel: 1, track: { loyalty: 2, renown: -1 } } },
        { label: '留下来看看他们干活', run: { intel: 2, vitality: 1, track: { renown: 1 } } },
      ],
    },
    {
      id: 'm10', portrait: 'portrait-witch', district: 'docks', title: '初见 · 银面',
      text: '凌晨三点的码头，一个穿银灰西装的人站在吊机下面，脸被一层流动的银色数据遮住。他自我介绍说叫银面，是代笔人，负责在这场牌局里删掉几行。他说他知道你手上第一张牌的期限，也知道你昨天想换掉它。他说：别急，先看看我能给你什么。',
      options: [
        { label: '收下他给的东西', run: { intel: 3, chips: 2, track: { sin: 1 } } },
        { label: '问他要什么报酬', run: { intel: 2, track: { loyalty: 1, sin: 1 } } },
        { label: '请他离开港区', run: { track: { loyalty: 2, renown: 1 } } },
      ],
    },
    {
      id: 'm11', portrait: 'portrait-wen', district: 'orbit', title: '初见 · 温仕成',
      text: '你去轨道港送一份出境函。票务柜台后面的老人驼着背，正在用旧笔手写票根。他叫温仕成，引航票务掮客，六十一岁，知道每个人的出境日期，也知道谁的日期被划掉过。他抬头问你要不要顺便查一眼自己的候补位次，说完自己先笑了。',
      options: [
        { label: '查，看自己排在第几', run: { intel: 3, track: { sin: 1 } } },
        { label: '不查，只把函送到', run: { track: { loyalty: 1, renown: 1 } } },
        { label: '问他划掉过谁', run: { chips: 1, intel: 2, track: { renown: -1 } } },
      ],
    },
    {
      id: 'm12', portrait: 'portrait-yuke', district: 'orbit', title: '初见 · 雨客',
      text: '候船厅的玻璃外面，雨一直下在穹顶那一边。一个风衣上有雨渍的男人站到你旁边，先笑了一下，才开口。他说他叫雨客，替穹顶外的「潮」传话，让里面的人知道雨落在地上是什么声音。他问你：你听见过吗。广播正好念到第七次延误。',
      options: [
        { label: '说没有，让他讲', run: { intel: 3, track: { sin: 1, loyalty: -1 } } },
        { label: '转身回去上班', run: { track: { loyalty: 2 } } },
        { label: '记住他风衣上的水印', run: { chips: 1, intel: 2, track: { sin: 1 } } },
      ],
    },
    {
      id: 'm13', portrait: 'portrait-monitor', district: 'tower', title: '初见 · 闻铎（茶室）',
      text: '第二次遇见是在监事会的茶室。他给你倒了一杯，说这茶是二十五年前留下的，那年穹顶裂过一次，名单上有八百多人。他叫闻铎，你上次就知道。他把杯子推到你面前，问如果你手里有一份没人看过的名单，你会送去哪。窗外正在下雨。',
      options: [
        { label: '答：交给看得见的人', run: { track: { renown: 1, loyalty: 1 } } },
        { label: '答：先留着，等有用', run: { intel: 2, track: { sin: 1, power: 1 } } },
        { label: '反问他为什么倒这杯', run: { intel: 3, track: { loyalty: -1 } } },
      ],
    },
    {
      id: 'm14', portrait: 'portrait-fixer', district: 'slum', title: '初见 · 老鸦（账本）',
      text: '这次是你主动去的。老鸦把账本摊在膝盖上，翻到某一页让你看：一列采购编号，收件方没有名字。他说穹顶集团每年都从他这里买一批不在清册上的东西，钱走的是现金。他问你敢不敢把这一页抄走，抄了，你们就算真的认识了。',
      options: [
        { label: '抄下来，撕走那一角', run: { intel: 4, track: { sin: 1 } } },
        { label: '只看，不抄', run: { intel: 2, track: { loyalty: 1 } } },
        { label: '把这一页记在心里', run: { intel: 3, track: { power: 1, sin: 1 } } },
      ],
    },
    {
      id: 'm15', portrait: 'portrait-lu', district: 'slum', title: '初见 · 陆晚（名册）',
      text: '你在她诊所的墙上看到一排名册，都是手写的名字和日期。陆晚说，来过的每个人都记一笔，这样万一人没了，至少还有个人替他记得。她翻到最后一页，留了半页空白，说这半页是给还没来的人的。她问你，要不要现在就把自己的名字写上。',
      options: [
        { label: '写上自己的名字', run: { track: { renown: 1, loyalty: -1, sin: -1 } } },
        { label: '留空，不写', run: { track: { sin: 1 } } },
        { label: '问她划掉过几个名字', run: { intel: 3, track: { renown: 1 } } },
      ],
    },
    {
      id: 'm16', portrait: 'portrait-witch', district: 'docks', title: '初见 · 银面（第二面）',
      text: '同一个吊机下面，银面这次先叫了你的名字，说你本该可以不这样。他说牌局的规则是别人写好的，他负责删掉几行，但删得越多，他自己也越薄。他把手抬起来给你看，指尖的数据比上次淡。他问你，愿不愿意替他记住一件事。',
      options: [
        { label: '答应替他记着', run: { intel: 3, chips: 2, track: { sin: 1 } } },
        { label: '问他删掉过哪几行', run: { intel: 4, track: { sin: 1, loyalty: -1 } } },
        { label: '拒绝，转头走', run: { track: { loyalty: 1, renown: 1 } } },
      ],
    },
  ];
})();

/* ===== game/content-briefs.js ===== */
/* 委托与通牒内容库 —— 由内容设计生成 */
(function () {
  'use strict';

  window.BRIEFS = [

    /* ================= demand 事务要求 ================= */
    { id: 'b1', kind: 'demand', npc: 'su-wen', district: 'tower',
      title: '三天内交出一份名单',
      text: '苏纹把一份空白表格放进你的收件箱，标题是「本季度接口人清单」，截止栏写着三天后上午九点。她说董事会只要名字，不问理由，也不需要附件。表格背面用铅笔写了六个字：别全填真的。',
      days: 3,
      solve: { type: 'resource', need: { intel: 3 } },
      onSolve: { intel: 1, track: { loyalty: 2 } },
      onExpire: { track: { loyalty: -2, sin: 1 } } },

    { id: 'b2', kind: 'demand', npc: 'dai-siyuan', district: 'exchange',
      title: '把这个部门的预算砍掉三成',
      text: '戴思远把审计底稿推过来，第三页用红笔圈住合规组的差旅与耗材两项。他说这一刀必须你签，砍掉三成，留下来的两成算你替他们争的。签完把底稿还他，不要复印。',
      days: 4,
      solve: { type: 'stat', stat: 'intellect', dc: 13 },
      onSolve: { money: 25, track: { loyalty: 2, power: 1 } },
      onExpire: { track: { loyalty: -3 } } },

    { id: 'b3', kind: 'demand', npc: 'yu-nanzhi', district: 'exchange',
      title: '收盘前平掉一笔对不上的账',
      text: '郁南枝说昨天的清算单多出一笔三十七万的尾差，来源栏填的是你的部门编号。她给你到今天收盘前的时间，用现金平掉，或者用一个说得过去的名字平掉。',
      days: 1,
      solve: { type: 'resource', need: { money: 40 } },
      onSolve: { track: { loyalty: 2, power: 1 } },
      onExpire: { track: { loyalty: -2, sin: 2 } },
      onRefuse: { track: { loyalty: -3 } },
      refuseLabel: '回绝' },

    { id: 'b4', kind: 'demand', npc: 'cheng-yan', district: 'lab',
      title: '补一份样本登记表',
      text: '程砚发来一条内部短讯，说三号柜的样本登记停在上周三，中间少了十一支。她不要你解释去向，只要求本周内把表补齐，扫码栏空着，签字栏也空着。',
      days: 4,
      solve: { type: 'resource', need: { intel: 2 } },
      onSolve: { intel: 2, gear: 1 },
      onExpire: { track: { loyalty: -2, sin: 1 } } },

    { id: 'b5', kind: 'demand', npc: 'peng-jian', district: 'lab',
      title: '把巡检记录补签回去',
      text: '彭戬把一叠巡检单拍在你桌上，说周二凌晨那趟无人值守缺了签名。他知道不是你值的班，但系统里挂的是你的编号，补签只要两分钟，笔就在他手里。',
      days: 2,
      solve: { type: 'stat', stat: 'stealth', dc: 12 },
      onSolve: { track: { power: 1, sin: 1 } },
      onExpire: { track: { sin: 2, loyalty: -1 } } },

    { id: 'b6', kind: 'demand', npc: 'tie-gui', district: 'docks',
      title: '交出工会的实到名单',
      text: '铁贵在码头办公室里点了根烟，说董事会要一份工会实到名单，用来核对罢工那天谁上了工。他把烟盒推给你，说名字他给，顺序要你来排。排错了算你的事。',
      days: 3,
      solve: { type: 'resource', need: { money: 30 } },
      onSolve: { intel: 2, track: { power: 1 } },
      onExpire: { track: { loyalty: -2, renown: -1 } },
      onRefuse: { track: { renown: 2, loyalty: -2 } },
      refuseLabel: '不接这活' },

    { id: 'b7', kind: 'demand', npc: 'lao-ya', district: 'slum',
      title: '找回一份被撤下的旧档案',
      text: '老鸦说档案馆昨晚撤了一批编号，其中一份属于三年前那桩事故。他不问你为什么要，只问两件事：出多少钱，什么时候要。他说这东西在他手上留不过四十小时。',
      days: 2,
      solve: { type: 'resource', need: { money: 55 } },
      onSolve: { intel: 3, track: { sin: 1 } },
      onExpire: { track: { sin: 1, renown: -1 } } },

    { id: 'b8', kind: 'demand', npc: 'wen-duo', district: 'tower',
      title: '本周把季度汇报提前交上来',
      text: '闻铎在走廊里拦住你，说下周的董事会简报提前到周五，你那一页要在周四下班前放到他桌上。他说不要图表，不要附件，要能一次念完的话，念完他自己会补两句。',
      days: 3,
      solve: { type: 'stat', stat: 'charm', dc: 13 },
      onSolve: { track: { loyalty: 3 } },
      onExpire: { track: { loyalty: -3, power: -1 } } },

    { id: 'b9', kind: 'demand', npc: 'wen-shicheng', district: 'orbit',
      title: '交出下个月的舱位分配表',
      text: '温仕成把一份手写的舱位表塞给你，说月台上有批货必须在表上，但收货人一栏不能出现。他要你以调度的名义重排一份正式版本，盖你部门的章，明天给他。',
      days: 3,
      solve: { type: 'district', district: 'orbit' },
      onSolve: { money: 20, intel: 1 },
      onExpire: { track: { loyalty: -2, sin: 1 } } },

    { id: 'b10', kind: 'demand', npc: 'yin-mian', district: 'docks',
      title: '让这批货的批文过期作废',
      text: '银面不露面，只让一个戴耳机的人把批文号念给你听。她说这批货三天后到港，你只要让它在系统里显示「已过期」，剩下的不用你管，也不要你出现在港区。',
      days: 3,
      solve: { type: 'stat', stat: 'intellect', dc: 12 },
      onSolve: { money: 35, track: { sin: 1 } },
      onExpire: { track: { sin: 2, loyalty: -1 } } },

    { id: 'b11', kind: 'demand', npc: 'yu-ke', district: 'orbit',
      title: '补一份外来样本的入境申报',
      text: '雨客在通讯里说，有件东西在轨道港停了四天，货单是空的，温度记录只到第二天。他需要一份写得像样的申报，写清它从哪来、哪天进来的、由谁签收。',
      days: 4,
      solve: { type: 'resource', need: { intel: 4, chips: 1 } },
      onSolve: { intel: 3, track: { sin: 1, power: 1 } },
      onExpire: { track: { loyalty: -2, sin: 1 } } },

    { id: 'b12', kind: 'demand', npc: 'lu-wan', district: 'slum',
      title: '把一批药品的批号改掉',
      text: '陆晚说你上月送来的那批镇痛剂批号过期三个月，她已经用掉一半。她要你换一批新的批号单，或者干脆换一批药。她说她只问药，不问你怎么弄来的。',
      days: 2,
      solve: { type: 'resource', need: { money: 45 } },
      onSolve: { track: { renown: 2, sin: -1 } },
      onExpire: { track: { renown: -2, sin: 1 } },
      onRefuse: { track: { renown: -2, loyalty: 1 } },
      refuseLabel: '不管' },

    /* ================= summon 高层传唤 ================= */
    { id: 'b13', kind: 'summon', npc: 'wen-duo', district: 'tower',
      title: '明天九点，董事会要见你',
      text: '闻铎的秘书打来电话，说董事会明天九点要听你本人讲那件事，通知上没有写议题。秘书提醒你三件事：正装、不带笔记、不带你的人。她说门禁只在九点前开一次。',
      days: 2,
      solve: { type: 'district', district: 'tower' },
      onSolve: { track: { loyalty: 2 } },
      onExpire: { track: { loyalty: -3, power: -1 } } },

    { id: 'b14', kind: 'summon', npc: 'su-wen', district: 'tower',
      title: '日程被改到今晚十一点',
      text: '苏纹把你原本下周三的面谈直接挪到今晚十一点，地点在高塔四十七层的小会议室。她说时间不是她定的，你要是改期，下一次排在四个月后，而且不是同一批人见你。',
      days: 1,
      solve: { type: 'stat', stat: 'vitality', dc: 12 },
      onSolve: { track: { loyalty: 1, power: 1 } },
      onExpire: { track: { loyalty: -3 } } },

    { id: 'b15', kind: 'summon', npc: 'yu-nanzhi', district: 'exchange',
      title: '清算行听证，你必须在场',
      text: '郁南枝发出正式听证通知，编号抄送监事会，事项一栏写着「一笔路径不明的资金」。她提醒你，缺席会在记录里写成拒不配合，之后再想解释就得多带一个律师。',
      days: 2,
      solve: { type: 'district', district: 'exchange' },
      onSolve: { intel: 2, track: { loyalty: 2 } },
      onExpire: { track: { loyalty: -3, sin: 1 } } },

    { id: 'b16', kind: 'summon', npc: 'dai-siyuan', district: 'exchange',
      title: '合规面谈，带着你的授权书',
      text: '戴思远约你周四下午做一次常规合规面谈，随信附了三页问题清单。最后一条写着：你是否曾绕过合规流程签发过任何一份文件。他建议你带上近三年的授权书副本。',
      days: 3,
      solve: { type: 'stat', stat: 'charm', dc: 14 },
      onSolve: { track: { loyalty: 2, renown: 1 } },
      onExpire: { track: { loyalty: -3, sin: 1 } } },

    { id: 'b17', kind: 'summon', npc: 'cheng-yan', district: 'lab',
      title: '三号项目的评审要你签到场',
      text: '程砚说三号项目的阶段评审下周开，签字栏只有三个人，其中一个是你。她说你来不来都能开，但评审结论要不要算数，取决于那一栏有没有你的名字。',
      days: 4,
      solve: { type: 'district', district: 'lab' },
      onSolve: { intel: 2, gear: 1 },
      onExpire: { track: { loyalty: -2, power: -1 } } },

    { id: 'b18', kind: 'summon', npc: 'peng-jian', district: 'lab',
      title: '安保事故复盘，你要到场说明',
      text: '彭戬把最后一次通知发到你终端，说周四凌晨那起门禁事故要复盘，你被列在当事人名单里。他说他只负责通知，不负责解释这份名单是怎么排出来的。',
      days: 2,
      solve: { type: 'stat', stat: 'force', dc: 11 },
      onSolve: { track: { power: 1, loyalty: 1 } },
      onExpire: { track: { loyalty: -2, sin: 1 } } },

    { id: 'b19', kind: 'summon', npc: 'lao-ya', district: 'slum',
      title: '灰市分账，要你本人到场',
      text: '老鸦说这次分账不去不行，场上有人点名要见你，见不到就把账本直接寄到高塔。时间定在后天凌晨，地点在下层旧水泵房，来时别带通讯设备。',
      days: 3,
      solve: { type: 'district', district: 'slum' },
      onSolve: { money: 30, track: { sin: 1 } },
      onExpire: { track: { sin: 2, loyalty: -1 } },
      onRefuse: { track: { renown: -2, loyalty: -1 } },
      refuseLabel: '不去' },

    { id: 'b20', kind: 'summon', npc: 'yin-mian', district: 'docks',
      title: '码头七号仓，午夜见面',
      text: '银面托人带了一张泊位单，七号仓，午夜。背面写着两行字：带一份你签得起的授权，别带任何会记录的东西。泊位单上的日期是今天，过时不补。',
      days: 1,
      solve: { type: 'stat', stat: 'stealth', dc: 13 },
      onSolve: { intel: 2, track: { power: 1, sin: 1 } },
      onExpire: { track: { loyalty: -2, renown: -1 } } },

    { id: 'b21', kind: 'summon', npc: 'wen-shicheng', district: 'orbit',
      title: '引航局约谈，签发人是你',
      text: '温仕成说引航局要就上一批货物的签发人做一次问询，名单上有你的名字。他建议你亲自去，因为上次代签的那个人已经被先叫去谈过一次，回来之后不怎么说话了。',
      days: 2,
      solve: { type: 'resource', need: { money: 50 } },
      onSolve: { track: { loyalty: 2 } },
      onExpire: { track: { loyalty: -2, sin: 1 } } },

    { id: 'b22', kind: 'summon', npc: 'yu-ke', district: 'orbit',
      title: '穹顶外有人要跟你说话',
      text: '雨客说穹顶外侧的信号塔今晚会开一次窗口，对面要跟你说一句话，就一句。他说你可以不来，也可以迟到，但窗只开十九分钟，开完这一段轨道就归别人了。',
      days: 1,
      solve: { type: 'district', district: 'orbit' },
      onSolve: { intel: 4, track: { sin: 1, power: 1 } },
      onExpire: { track: { sin: 1, renown: -1 } },
      onRefuse: { track: { loyalty: 2, renown: -1 } },
      refuseLabel: '不接这次通话' },

    { id: 'b23', kind: 'summon', npc: 'tie-gui', district: 'docks',
      title: '工会请你去码头讲一句话',
      text: '铁贵说工人后天上午在码头集合，只要一个人站上装卸台讲三句话，讲完就散，不喊口号，不递文件。他说这个人最好是你，因为你的名字还挂在集团编制上。',
      days: 3,
      solve: { type: 'stat', stat: 'charm', dc: 13 },
      onSolve: { track: { renown: 3, loyalty: -1 } },
      onExpire: { track: { renown: -2, sin: 1 } },
      onRefuse: { track: { renown: -2, loyalty: 1 } },
      refuseLabel: '不去站台' },

    { id: 'b24', kind: 'summon', npc: 'lu-wan', district: 'slum',
      title: '你要来一趟诊所，当面',
      text: '陆晚只在终端上留了一行字：这周来一趟，别派别人。她说有些东西不能过任何线路传，包括你自己那份体检报告，也包括报告第三页上多出来的那两行。',
      days: 3,
      solve: { type: 'district', district: 'slum' },
      onSolve: { vitality: 1, track: { renown: 1, sin: -1 } },
      onExpire: { track: { sin: 1, renown: -1 } } },

    /* ================= blood 血腥要求 ================= */
    { id: 'b25', kind: 'blood', npc: 'yin-mian', district: 'docks',
      title: '今晚要有一个人的名字从系统里消失',
      text: '银面说凌晨两点有一条船进港，名单上有个人不能下船。她把编号给你，说不用你动手，你只要让这个编号在今天之内不存在，交接单上会自己长出别的名字。',
      days: 1,
      solve: { type: 'fold', path: 'purge' },
      onSolve: { money: 40, track: { sin: 2, power: 1 } },
      onExpire: { track: { sin: 2, loyalty: -2 } },
      onRefuse: { track: { renown: 1, loyalty: -2, sin: -1 } },
      refuseLabel: '不接' },

    { id: 'b26', kind: 'blood', npc: 'peng-jian', district: 'lab',
      title: '让那个值班员永远闭嘴',
      text: '彭戬说上周三凌晨有个值班员看见了不该看的画面。这个人现在还在所里上班，还在同一条走廊刷卡，工牌上的照片甚至换了新的。他给你两天把这件事结束。',
      days: 2,
      solve: { type: 'fold', path: 'purge' },
      onSolve: { track: { power: 2, sin: 2 } },
      onExpire: { track: { sin: 2, loyalty: -2 } } },

    { id: 'b27', kind: 'blood', npc: 'wen-duo', district: 'tower',
      title: '一个编号今天必须作废',
      text: '闻铎没有解释这个编号是谁，只说是董事会的意思。他把一张纸推过来，上面只有一串数字和今天的日期。他说做完不要回话，也别让第二个人知道你见过这张纸。',
      days: 1,
      solve: { type: 'resource', need: { money: 80 } },
      onSolve: { track: { loyalty: 3, sin: 2 } },
      onExpire: { track: { loyalty: -3, sin: 1 } },
      onRefuse: { track: { loyalty: -3, renown: 1 } },
      refuseLabel: '这单我不做' },

    { id: 'b28', kind: 'blood', npc: 'yu-nanzhi', district: 'exchange',
      title: '把追债追到最后一步',
      text: '郁南枝说有个债务人三个月没露面，担保人还住在原来的地址，孩子在同一所学校。她要你让担保人明白，这笔账追的不是钱，追的是签名栏上那三个字。',
      days: 2,
      solve: { type: 'fold', path: 'purge' },
      onSolve: { money: 45, track: { power: 1, sin: 1 } },
      onExpire: { track: { loyalty: -2, sin: 1 } } },

    { id: 'b29', kind: 'blood', npc: 'lao-ya', district: 'slum',
      title: '处理掉一个不安静的线人',
      text: '老鸦说巷子里有个线人开始同时卖给两边，价格还越报越高，前天甚至报到了你的名字。他说这件事不收钱，他只问你哪天方便，因为这个人住的地方你熟。',
      days: 1,
      solve: { type: 'fold', path: 'purge' },
      onSolve: { intel: 2, track: { sin: 2, power: 1 } },
      onExpire: { track: { sin: 2, renown: -1 } } },

    { id: 'b30', kind: 'blood', npc: 'tie-gui', district: 'docks',
      title: '让罢工带头人今晚退场',
      text: '铁贵说工会里有人准备把谈判记录卖给董事会，开价不低，交接安排在明早。他给你一个班次和一条通道，说今晚这个人会独自走那条路，剩下的看你怎么想。',
      days: 1,
      solve: { type: 'fold', path: 'purge' },
      onSolve: { track: { power: 2, sin: 2 } },
      onExpire: { track: { sin: 2, loyalty: -2 } },
      onRefuse: { track: { renown: 2, sin: -1, loyalty: -1 } },
      refuseLabel: '放他走' },

    { id: 'b31', kind: 'blood', npc: 'yu-ke', district: 'orbit',
      title: '有个从穹顶外进来的人不能留记录',
      text: '雨客说昨天有个从外面进来的人，没有入境号，也没有体温记录，只有一张手写的过站条。这个人现在坐在轨道港候船区，两天后会有一班船停靠，那班船不查货。',
      days: 2,
      solve: { type: 'resource', need: { chips: 3 } },
      onSolve: { intel: 3, track: { sin: 2 } },
      onExpire: { track: { sin: 2, loyalty: -1 } } },

    { id: 'b32', kind: 'blood', npc: 'dai-siyuan', district: 'exchange',
      title: '让那个证人在问询前改口',
      text: '戴思远说下周有一场问询，关键证人提交的口供和物证对不上，时间差了两小时十七分。他要你在两天内让这份口供变得对得上，用什么方式他不指定。',
      days: 2,
      solve: { type: 'stat', stat: 'force', dc: 15 },
      onSolve: { track: { loyalty: 2, sin: 2 } },
      onExpire: { track: { loyalty: -3, sin: 1 } } },

    { id: 'b33', kind: 'blood', npc: 'cheng-yan', district: 'lab',
      title: '三号志愿者的名字要从名册上拿掉',
      text: '程砚说三号志愿者昨天出所之后没有再回来，名册上还留着签名，体检数据也还挂在系统里。她需要这个名字在今天之内从名册上消失，数据她自己会处理。',
      days: 1,
      solve: { type: 'fold', path: 'purge' },
      onSolve: { gear: 1, track: { sin: 2, power: 1 } },
      onExpire: { track: { sin: 2, loyalty: -2 } } },

    { id: 'b34', kind: 'blood', npc: 'wen-shicheng', district: 'orbit',
      title: '一个要跳船的人，别让他上船',
      text: '温仕成说今晚有一班船，票已经开出去了，持票人准备把同组三个人一起带走，连带一份不该出港的清单。他要你让这个人今天之内上不了任何一班船。',
      days: 1,
      solve: { type: 'district', district: 'orbit' },
      onSolve: { money: 25, track: { sin: 1, power: 1 } },
      onExpire: { track: { loyalty: -2, sin: 1 } } },

    { id: 'b35', kind: 'blood', npc: 'su-wen', district: 'tower',
      title: '高塔今天多了一位不该出现的访客',
      text: '苏纹说访客登记里多了一个名字，登记时间是今天早上七点零四分，签入人一栏填的是你的工号。她给你到下班前的时间，让这个名字变回从没来过。',
      days: 1,
      solve: { type: 'stat', stat: 'stealth', dc: 13 },
      onSolve: { intel: 2, track: { sin: 1, power: 1 } },
      onExpire: { track: { sin: 2, loyalty: -2 } } },

    { id: 'b36', kind: 'blood', npc: 'yu-nanzhi', district: 'exchange',
      title: '让那笔坏账彻底核销',
      text: '郁南枝说有一笔坏账在清算行挂了三年，账上的人早就不在了，只剩一个还在世的联系人每年寄一次函。她给你两天，让这笔账连同这个联系人的追索权一起终结。',
      days: 2,
      solve: { type: 'fold', path: 'purge' },
      onSolve: { money: 55, track: { sin: 2 } },
      onExpire: { track: { sin: 2, loyalty: -2 } } },

    /* ================= favor 人情托付 ================= */
    { id: 'b37', kind: 'favor', npc: 'lu-wan', district: 'slum',
      title: '帮她的病人弄一张合法身份',
      text: '陆晚说她手上有个人需要一份能过闸机的身份记录，年纪不大，伤口还没好，说话时不敢看人。她说她只有你一个能进系统的人，这件事不急，三天内都行。',
      days: 3,
      solve: { type: 'resource', need: { money: 35 } },
      onSolve: { track: { renown: 2, loyalty: -1, sin: 1 } },
      onExpire: { track: { sin: 1, renown: -1 } },
      onRefuse: { track: { sin: 1, renown: -1 } },
      refuseLabel: '帮不了' },

    { id: 'b38', kind: 'favor', npc: 'lao-ya', district: 'slum',
      title: '帮他把一个人从名单上留下来',
      text: '老鸦说下层的清理名单里有个人不该在上面，这人和他有点旧交情，早年替他挡过一刀。他不要你做什么大事，只要名单走流程的时候你多按一次暂停。',
      days: 2,
      solve: { type: 'stat', stat: 'charm', dc: 12 },
      onSolve: { track: { renown: 2, loyalty: -1, sin: 1 } },
      onExpire: { track: { sin: 1, renown: -1 } },
      onRefuse: { track: { renown: -2, sin: 1 } },
      refuseLabel: '不管这事' },

    { id: 'b39', kind: 'favor', npc: 'tie-gui', district: 'docks',
      title: '帮港区把被扣的工钱要回来',
      text: '铁贵说上个月有一笔工钱扣在集团账上，理由写在单子上，谁也看不懂，审批链停在一个已经不存在的岗位。他说工人不问理由，只问你什么时候能把钱放出去。',
      days: 3,
      solve: { type: 'stat', stat: 'intellect', dc: 13 },
      onSolve: { track: { renown: 3, loyalty: -1 } },
      onExpire: { track: { renown: -2, sin: 1 } },
      onRefuse: { track: { renown: -2, loyalty: 1 } },
      refuseLabel: '不签这个字' },

    { id: 'b40', kind: 'favor', npc: 'yin-mian', district: 'docks',
      title: '帮一个人离港，不登记',
      text: '银面说她有个委托人要上今晚的货船，没有出境许可，也没有体检报告。她不付你钱，只记你这个人情，还说这种人情以后比钱值钱，比钱也贵。',
      days: 2,
      solve: { type: 'district', district: 'docks' },
      onSolve: { track: { power: 1, sin: 1, renown: 1 } },
      onExpire: { track: { sin: 1, renown: -1 } } },

    { id: 'b41', kind: 'favor', npc: 'yu-ke', district: 'orbit',
      title: '给穹顶外的人带一件东西出来',
      text: '雨客说外面有人需要一份纸质的、没有被任何系统记录过的东西。东西你自己挑，只要上面有你的签字或印章。他说收件的人认得你，不用写名字。',
      days: 3,
      solve: { type: 'resource', need: { money: 25 } },
      onSolve: { intel: 2, track: { sin: 1, power: 1 } },
      onExpire: { track: { sin: 1 } },
      onRefuse: { track: { loyalty: 1, renown: -1 } },
      refuseLabel: '不带' },

    { id: 'b42', kind: 'favor', npc: 'wen-shicheng', district: 'orbit',
      title: '帮一个买不起票的人留个位子',
      text: '温仕成说有个常年在轨道港搬货的人，攒了两年钱还差一半，明年的名额就已经排完了。他说位子他能留一个，差额得有人补，这个人他推荐给你。',
      days: 3,
      solve: { type: 'resource', need: { money: 60 } },
      onSolve: { track: { renown: 3, loyalty: -1 } },
      onExpire: { track: { renown: -2, sin: 1 } },
      onRefuse: { track: { renown: -2, sin: 1 } },
      refuseLabel: '不垫这个钱' },

    { id: 'b43', kind: 'favor', npc: 'lu-wan', district: 'slum',
      title: '帮诊所弄一批能过审的耗材',
      text: '陆晚说诊所的耗材这个月被卡在审批上，清单里有一项她没法解释用途，写了三遍都被退回。她要你把它改成一个看起来合理的名字，剩下的表格她自己填。',
      days: 2,
      solve: { type: 'stat', stat: 'intellect', dc: 12 },
      onSolve: { track: { renown: 2, sin: 1 } },
      onExpire: { track: { renown: -1, sin: 1 } } },

    { id: 'b44', kind: 'favor', npc: 'tie-gui', district: 'docks',
      title: '帮一个受伤的工人顶下这起事故',
      text: '铁贵说有个工人被卷进昨天那起事故，工牌记录的违规时间是他自己的名字，扣款单已经开出来了。铁贵要你在事故单上把责任挪到设备上，别挪到人身上。',
      days: 2,
      solve: { type: 'stat', stat: 'force', dc: 12 },
      onSolve: { track: { renown: 2, loyalty: -1, sin: 1 } },
      onExpire: { track: { renown: -2, sin: 1 } } },

    { id: 'b45', kind: 'favor', npc: 'lao-ya', district: 'slum',
      title: '帮他把一份档案递给该去的地方',
      text: '老鸦说手上有一份档案，正规渠道递不上去，卡在第二道签收就没了回音。他说只有你能让它落进某个不该进的收件箱。递上去之后，你就当没见过这份东西。',
      days: 3,
      solve: { type: 'district', district: 'slum' },
      onSolve: { intel: 3, track: { sin: 1, renown: 1 } },
      onExpire: { track: { sin: 1, renown: -1 } },
      onRefuse: { track: { loyalty: 1 } },
      refuseLabel: '不递' },

    { id: 'b46', kind: 'favor', npc: 'yin-mian', district: 'docks',
      title: '帮她说服一个人，不要用刀',
      text: '银面说她的委托人准备今晚用更直接的方式解决一件事，已经把工具带上了。她说你只要能让他坐下来听你讲十分钟，这件事就不必有人受伤，也不必有人赔钱。',
      days: 2,
      solve: { type: 'stat', stat: 'charm', dc: 14 },
      onSolve: { track: { renown: 3, sin: -1, power: 1 } },
      onExpire: { track: { sin: 2, renown: -1 } } },

    { id: 'b47', kind: 'favor', npc: 'cheng-yan', district: 'lab',
      title: '帮她保下一个要被调岗的研究员',
      text: '程砚说组里有个研究员要被调去轨道港做记录员，理由是性格不适合团队协作，调岗单下周生效。她要你在单子上按一次退回，理由随便你写。',
      days: 3,
      solve: { type: 'resource', need: { intel: 3 } },
      onSolve: { track: { renown: 2, loyalty: -1, power: 1 } },
      onExpire: { track: { renown: -2 } } },

    { id: 'b48', kind: 'favor', npc: 'su-wen', district: 'tower',
      title: '帮她那天下午空出两个小时',
      text: '苏纹说她母亲那天要从穹顶外侧进来，手续都齐了，只差高塔的一趟电梯权限和一次访客确认。她要你把她下午的两个小时从日程里空出来，别人问起就说是会议。',
      days: 2,
      solve: { type: 'stat', stat: 'charm', dc: 12 },
      onSolve: { intel: 1, track: { renown: 2, loyalty: 1 } },
      onExpire: { track: { renown: -1, loyalty: -1 } } },

    /* ================= trap 陷阱与试探 ================= */
    { id: 'b49', kind: 'trap', npc: 'dai-siyuan', district: 'exchange',
      title: '一份等着你签的谅解书',
      text: '戴思远把一份谅解书放在你面前，说你签了对大家都方便，上面写着你的部门自愿承担一次操作失误。他补充说，不签也行，这件事会按规定流程往下走一遍。',
      days: 2,
      solve: { type: 'stat', stat: 'intellect', dc: 13 },
      onSolve: { track: { loyalty: 1, sin: 1 } },
      onExpire: { track: { loyalty: -2, sin: 2 } },
      onRefuse: { track: { renown: 1, loyalty: -2 } },
      refuseLabel: '不签' },

    { id: 'b50', kind: 'trap', npc: 'yu-nanzhi', district: 'exchange',
      title: '一笔送上门的短线',
      text: '郁南枝说有个渠道愿意让你用部门名义做一笔短线，收益归你，风险挂在部门账上。她说这个渠道平时不接中层，这次是有人替你说了一句话才破的例。',
      days: 2,
      solve: { type: 'fold', path: 'capital' },
      onSolve: { money: 70, track: { sin: 2 } },
      onExpire: { track: { sin: 1, loyalty: -2 } },
      onRefuse: { track: { loyalty: 1, renown: 1 } },
      refuseLabel: '不做这笔' },

    { id: 'b51', kind: 'trap', npc: 'wen-duo', district: 'tower',
      title: '一次提前的忠诚表态',
      text: '闻铎说监事会最近在做一次内部梳理，需要一批中层自愿提交近三年的联系人清单。他说提得早的人，名字会放在前面，提得晚的人，名字会放在另一个名单上。',
      days: 3,
      solve: { type: 'fold', path: 'control' },
      onSolve: { track: { loyalty: 2, sin: 1, power: -1 } },
      onExpire: { track: { loyalty: -2 } },
      onRefuse: { track: { renown: 1, loyalty: -2 } },
      refuseLabel: '不提交' },

    { id: 'b52', kind: 'trap', npc: 'su-wen', district: 'tower',
      title: '一次没有议题的会面',
      text: '苏纹说有人想在没有议题的情况下见你一面，地点在董事会那一层的一间空会议室，时间是明天中午。她说这个人你认识，而且你上次没有回他的消息。',
      days: 2,
      solve: { type: 'district', district: 'tower' },
      onSolve: { intel: 2, track: { sin: 1, power: 1 } },
      onExpire: { track: { power: -1, loyalty: -1 } } },

    { id: 'b53', kind: 'trap', npc: 'cheng-yan', district: 'lab',
      title: '一次免费的健康筛查',
      text: '程砚说研究所正在做一个免费筛查项目，参与者可以拿到一份完整的身体数据，还能换一笔不记名的补贴。名额只留给内部人，报名表上有一栏写着是否同意二次使用。',
      days: 3,
      solve: { type: 'stat', stat: 'vitality', dc: 12 },
      onSolve: { money: 30, vitality: -1, track: { sin: 1 } },
      onExpire: { track: { renown: -1 } },
      onRefuse: { track: { sin: -1, renown: 1 } },
      refuseLabel: '不去筛查' },

    { id: 'b54', kind: 'trap', npc: 'peng-jian', district: 'lab',
      title: '一次顺手的门禁授权',
      text: '彭戬说三号走廊今晚有一批设备要运出来，需要一份临时授权，用你的工号。他说东西不会出事，就算出了事也不会查到你头上，因为记录会跟着设备一起出园区。',
      days: 1,
      solve: { type: 'stat', stat: 'stealth', dc: 13 },
      onSolve: { gear: 2, track: { sin: 2 } },
      onExpire: { track: { sin: 2, loyalty: -2 } } },

    { id: 'b55', kind: 'trap', npc: 'lao-ya', district: 'slum',
      title: '一笔好得不真实的买卖',
      text: '老鸦说有人急着出一批货，价格是市价的三成，条件是要用你的名义过一手，货不落地，单据落地。他说他只赚介绍费，货和风险跟他一点关系都没有。',
      days: 2,
      solve: { type: 'resource', need: { money: 40 } },
      onSolve: { money: 65, track: { sin: 2, renown: -1 } },
      onExpire: { track: { sin: 1, renown: -1 } },
      onRefuse: { track: { renown: 1, sin: -1 } },
      refuseLabel: '不碰' },

    { id: 'b56', kind: 'trap', npc: 'tie-gui', district: 'docks',
      title: '一次举手之劳的放行',
      text: '铁贵说今晚有一辆车要从港区侧门出去，只装了一些废料，重量和单据都对得上。他说门岗那边只要一句你签的话，其余的他都安排好了，包括回来时的记录。',
      days: 1,
      solve: { type: 'fold', path: 'expand' },
      onSolve: { money: 35, track: { sin: 1, power: 1 } },
      onExpire: { track: { sin: 2, loyalty: -1 } } },

    { id: 'b57', kind: 'trap', npc: 'yin-mian', district: 'docks',
      title: '一次不需要你出面的见面',
      text: '银面说她的委托人想认识你，不必见面，只要你把工牌放在某个位置十五分钟，位置在码头边上的寄存柜。她说这十五分钟里不会有任何人碰它，锁也是你锁的。',
      days: 1,
      solve: { type: 'stat', stat: 'intellect', dc: 14 },
      onSolve: { track: { power: 2, sin: 1 } },
      onExpire: { track: { power: -1, sin: 1 } },
      onRefuse: { track: { loyalty: 1, power: -1 } },
      refuseLabel: '不放下工牌' },

    { id: 'b58', kind: 'trap', npc: 'yu-ke', district: 'orbit',
      title: '一次来自穹顶外的馈赠',
      text: '雨客说外面有人托他带件东西给你，不重，也不值钱，只是一段刻在金属上的编号。他说收不收都行，只是收下之后要记着这个号，因为对面也会记着。',
      days: 3,
      solve: { type: 'stat', stat: 'stealth', dc: 12 },
      onSolve: { intel: 3, track: { sin: 2, power: 1 } },
      onExpire: { track: { sin: 1 } },
      onRefuse: { track: { loyalty: 1, renown: -1 } },
      refuseLabel: '不收' },

    { id: 'b59', kind: 'trap', npc: 'wen-shicheng', district: 'orbit',
      title: '一次便宜的舱位',
      text: '温仕成说有一个长期空置的仓位最近放了折扣，只要报名就能锁住，付款可以延到入住当天。他说这种价位的名额很多人抢，他先来问你一句，别人还没通知。',
      days: 2,
      solve: { type: 'resource', need: { money: 70 } },
      onSolve: { track: { power: 1, renown: 1, sin: 1 } },
      onExpire: { track: { renown: -1 } },
      onRefuse: { track: { renown: -1 } },
      refuseLabel: '不锁' },

    { id: 'b60', kind: 'trap', npc: 'lu-wan', district: 'slum',
      title: '一次不用付钱的治疗',
      text: '陆晚说你这几个月的状态她都看在眼里，她可以给你做一次完整的修复，不收钱。条件是让她留一份完整的样本，包括血、组织，和时间戳，样本编号由她定。',
      days: 2,
      solve: { type: 'district', district: 'slum' },
      onSolve: { vitality: 2, track: { sin: 1 } },
      onExpire: { vitality: -1, track: { sin: 1 } },
      onRefuse: { vitality: -1, track: { renown: 1 } },
      refuseLabel: '不记录' },

  ];
})();

/* ===== game/content-briefs2.js ===== */
/* 委托与通牒（第二批，60 条）。 */
(function () {
  'use strict';

  window.BRIEFS2 = [

    /* ================= demand 事务要求 ================= */
    { id: 'd1', kind: 'demand', npc: 'su-wen', district: 'tower',
      title: '排一份下周的会客顺序',
      text: '苏纹把一张会客日程推到你面前，说下周有三拨人要进高塔，董事会不想让他们碰面，顺序由你来排。她说这不是礼貌问题，是路径问题，周三上午之前交给她。表格下面她留了半行铅笔字：别按亲疏排。',
      days: 2,
      solve: { type: 'resource', need: { money: 40 } },
      onSolve: { intel: 1, track: { loyalty: 2 } },
      onExpire: { track: { loyalty: -2, sin: 1 } } },

    { id: 'd2', kind: 'demand', npc: 'dai-siyuan', district: 'exchange',
      title: '补三个月前的培训签到',
      text: '戴思远说稽查下周会调上季度的合规培训记录，你们部门那一栏只有一次签到，日期还写错了一天。他要你在周一之前把三次签到补齐，笔迹别都一样，也别用同一种笔。他说这份顺序不进会议纪要，也不上系统。',
      days: 4,
      solve: { type: 'stat', stat: 'intellect', dc: 13 },
      onSolve: { track: { loyalty: 2, power: 1 } },
      onExpire: { track: { loyalty: -3 } } },

    { id: 'd3', kind: 'demand', npc: 'yu-nanzhi', district: 'exchange',
      title: '明天中午前把这两笔拆开',
      text: '郁南枝说有两笔同额度的转账在清算行被标成可疑，因为是同一天进出，而且同属一个楼层。她给你到明天中午，把其中一笔改走别的通道，手续费她出，单据要留痕但不能连号。她说尾号错一位就算两笔，两笔就是两个人来查。',
      days: 1,
      solve: { type: 'resource', need: { money: 45 } },
      onSolve: { track: { loyalty: 2, power: 1 } },
      onExpire: { track: { loyalty: -2, sin: 2 } },
      onRefuse: { track: { loyalty: -3 } },
      refuseLabel: '回绝' },

    { id: 'd4', kind: 'demand', npc: 'cheng-yan', district: 'lab',
      title: '把三号柜的温控记录补上',
      text: '程砚发来一条内部短讯，说三号柜周四凌晨断电四十分钟，记录里那一段是空的。她要求你在本周结束前补齐曲线，数值自己填，别填得太平。她说太平了看着像假的，她一眼就能看出来。她说她不想在伦理那一栏里看到空白。',
      days: 4,
      solve: { type: 'resource', need: { intel: 3 } },
      onSolve: { intel: 2, gear: 1 },
      onExpire: { track: { loyalty: -2, sin: 1 } } },

    { id: 'd5', kind: 'demand', npc: 'peng-jian', district: 'lab',
      title: '换掉走廊尽头那只摄像头',
      text: '彭戬说二号走廊尽头那只摄像头角度偏了，照不到消防门，巡检报告上连着三次记了这一条。他要你在两天内把这条记录处理掉，或者把那扇门的开合次数改回正常值，两样随你挑。他说记录这种东西，改一次就要一直改下去。',
      days: 2,
      solve: { type: 'stat', stat: 'stealth', dc: 12 },
      onSolve: { track: { power: 1, sin: 1 } },
      onExpire: { track: { sin: 2, loyalty: -1 } } },

    { id: 'd6', kind: 'demand', npc: 'tie-gui', district: 'docks',
      title: '把夜班的排班表重排一遍',
      text: '铁贵把上周的排班表拍在桌上，说罢工那天有九个人的班次对不上考勤机。他给你三天，按他的口述重排一份正式的，别问为什么。他说问了也没用，那台机器那天下午确实坏过。他把那台考勤机的检修单也一起放在桌上。',
      days: 3,
      solve: { type: 'district', district: 'docks' },
      onSolve: { intel: 2, track: { power: 1 } },
      onExpire: { track: { loyalty: -2, renown: -1 } },
      onRefuse: { track: { renown: 2, loyalty: -2 } },
      refuseLabel: '不接这活' },

    { id: 'd7', kind: 'demand', npc: 'lao-ya', district: 'slum',
      title: '到回收场取一只寄存箱',
      text: '老鸦说他有一只箱子寄在回收场，编号是手写的，只有他记得。他给你两天时间，用你部门的调拨单把它提出来。箱子里是什么他没说，只说别看，看完就不算他寄的了。他说箱子在四号堆场最里面那一排，锈得看不出编号。',
      days: 2,
      solve: { type: 'resource', need: { money: 55 } },
      onSolve: { intel: 3, track: { sin: 1 } },
      onExpire: { track: { sin: 1, renown: -1 } } },

    { id: 'd8', kind: 'demand', npc: 'wen-duo', district: 'tower',
      title: '周五前交两页风险说明',
      text: '闻铎在电梯里说，董事会要一份关于你们那条线的风险说明，两页，只写不利的那部分。他说不用掩饰，掩饰的东西他们看过太多，写清楚反而好交代，念完他自己会补两句。他说写完把稿子留在台上就行，别带走。',
      days: 3,
      solve: { type: 'stat', stat: 'charm', dc: 13 },
      onSolve: { track: { loyalty: 3 } },
      onExpire: { track: { loyalty: -3, power: -1 } } },

    { id: 'd9', kind: 'demand', npc: 'xun-jie', district: 'ring',
      title: '把环带的巡检缺口补平',
      text: '荀戒在环带三十二号段截住你，说上个月那根支撑柱的巡检记录空了一段，空缺那天是他值的班。他要你在两天内补一条正常读数进去，或者代他签一次到场。他把记录本从腰带里抽出来，那一页折了一个角，说签的是他的名字。',
      days: 2,
      solve: { type: 'district', district: 'ring' },
      onSolve: { intel: 2, track: { power: 1 } },
      onExpire: { track: { loyalty: -2, sin: 1 } } },

    { id: 'd10', kind: 'demand', npc: 'sa-er', district: 'salvage',
      title: '把回收场那批货挑出来',
      text: '萨尔说回收场新进了一批从穹顶外拉回来的东西，混在废钢里，编号早被磨掉了。她要你在三天内用调拨单把其中七件挑出来，单独堆在四号堆场。她说清单会给你，但别一次全给，分三次拿，每次少拿一件。',
      days: 3,
      solve: { type: 'resource', need: { money: 50 } },
      onSolve: { gear: 1, intel: 2, track: { sin: 1 } },
      onExpire: { track: { sin: 1, renown: -1 } } },

    { id: 'd11', kind: 'demand', npc: 'ban-tou', district: 'salvage',
      title: '把废料的重量重新登记',
      text: '班头把过磅单推过来，说昨天有一批废料出场时的重量和入库差了四百公斤，中间只经过你们的手。他给你两天，把差额平到合理区间，别平得太干净。他说查这个的人不识数，但会数小数点后面几位。他说数目这种东西，只要前后一致就没人细究。',
      days: 2,
      solve: { type: 'stat', stat: 'intellect', dc: 12 },
      onSolve: { money: 30, track: { power: 1 } },
      onExpire: { track: { loyalty: -2, sin: 1 } } },

    { id: 'd12', kind: 'demand', npc: 'wu-mian', district: 'memory',
      title: '补一张记忆柜台的交接单',
      text: '无面说记忆银行三号柜台的交接单少了一个签收时间，那段恰好没有监控。无面要你在本周内补上，具体到分钟，笔迹要像写字很慢的人。柜台外面排着长队，没有人说话，也没有人抬头看那台钟。无面把笔推过来，笔尖朝着自己那一侧。',
      days: 4,
      solve: { type: 'district', district: 'memory' },
      onSolve: { intel: 3, track: { sin: 1 } },
      onExpire: { track: { sin: 2, loyalty: -1 } } },

    /* ================= summon 传唤 ================= */
    { id: 'd13', kind: 'summon', npc: 'wen-duo', district: 'tower',
      title: '董事会临时加了一场答辩',
      text: '闻铎说董事会临时加了一场答辩，明天下午两点，你一个人去，讲你们那条线这季度的差错。他说稿子不用带，带一张纸的提纲就行。他还说，进去之后他们问什么你答什么，别自己加。他把一支笔放在桌上，说这个借你。',
      days: 1,
      solve: { type: 'stat', stat: 'charm', dc: 14 },
      onSolve: { track: { loyalty: 2, power: 1 } },
      onExpire: { track: { loyalty: -3, power: -1 } } },

    { id: 'd14', kind: 'summon', npc: 'su-wen', district: 'tower',
      title: '今晚十点，日程多了一栏',
      text: '苏纹把你今晚的日程改动截图发过来，说十点那一栏是新加的，没有议题，也没有参会人名单，只有一间会议室的编号。她让你准时到，别带记录设备。她说她也不知道里面是谁，只知道是董事会直接排的。',
      days: 1,
      solve: { type: 'resource', need: { money: 35 } },
      onSolve: { intel: 3, track: { loyalty: 1 } },
      onExpire: { track: { loyalty: -2, power: -1 } } },

    { id: 'd15', kind: 'summon', npc: 'dai-siyuan', district: 'exchange',
      title: '合规面谈挪到今晚下班后',
      text: '戴思远把面谈通知塞进你的工位抽屉，时间改到今晚七点，地点从会议室挪到地下一层的小问询室。他说这次不谈流程，只谈上个月那两次授权是谁按的。他让你带授权书原件，复印件不算，他说纸上有没有指纹差别很大。',
      days: 2,
      solve: { type: 'stat', stat: 'intellect', dc: 13 },
      onSolve: { track: { loyalty: 2 } },
      onExpire: { track: { loyalty: -3 } } },

    { id: 'd16', kind: 'summon', npc: 'yu-nanzhi', district: 'exchange',
      title: '清算行的复核要你亲自去',
      text: '郁南枝说周五上午有一场内部复核，清算行那边指名要签发人到场。她说你可以不带任何材料，人到了就行，但不到就会出现一条默认结论。她把时间写在你的手背上，用的是油性笔，说洗掉也得来。她说复核席上坐着的人不看材料，只看谁到了。',
      days: 2,
      solve: { type: 'district', district: 'exchange' },
      onSolve: { track: { loyalty: 2, power: 1 } },
      onExpire: { track: { loyalty: -3, sin: 1 } } },

    { id: 'd17', kind: 'summon', npc: 'cheng-yan', district: 'lab',
      title: '明早七点的评审要你到场',
      text: '程砚说三号项目的评审提前到明早七点，会场研究所地下二层，参会名单上写着你的工号。她说你不用准备，只用在签到场那一栏签个字。她把签到表翻到最后一页给你看，那一页只有三行格子。她说签完就能走，不用等散会。',
      days: 1,
      solve: { type: 'stat', stat: 'intellect', dc: 12 },
      onSolve: { intel: 2, gear: 1 },
      onExpire: { track: { loyalty: -2, power: -1 } } },

    { id: 'd18', kind: 'summon', npc: 'peng-jian', district: 'lab',
      title: '安保事故复盘，明天上午',
      text: '彭戬说周一那起门禁误报开了复盘会，时间定在明天上午九点，安保线以外只有一个旁听位，给了你。他说旁听席不发言，但你坐的位置正对着记录员的镜头。他还说，坐姿别太随便。他说镜头后面的人会把你坐了多久记下来。',
      days: 2,
      solve: { type: 'resource', need: { gear: 1 } },
      onSolve: { intel: 2, track: { power: 1 } },
      onExpire: { track: { loyalty: -2, sin: 1 } } },

    { id: 'd19', kind: 'summon', npc: 'lao-ya', district: 'slum',
      title: '灰市分账，账房先生等你',
      text: '老鸦说下层那间洗衣房后屋今晚九点开分账，账房先生等着见你一面。他说这不是鸿门宴，是要你当面确认一个数，确认完这笔就算结了。他让你带现金去，别带卡，卡后面会留痕。他说这笔钱当面点清，出了这间屋就不算数。',
      days: 1,
      solve: { type: 'district', district: 'slum' },
      onSolve: { money: 35, track: { sin: 1 } },
      onExpire: { track: { sin: 1, renown: -1 } } },

    { id: 'd20', kind: 'summon', npc: 'tie-gui', district: 'docks',
      title: '码头七号仓，午夜前到',
      text: '铁贵传话过来，说午夜前十一点半在七号仓等你，只他一个人。他说这件事不上台面，你也别带人。仓里堆着还没清关的橡胶，味道很重，他说在那说话，外面听不见，里面也看不清脸。他说橡胶的味道能盖住烟味，也能盖住别的。',
      days: 1,
      solve: { type: 'stat', stat: 'force', dc: 12 },
      onSolve: { intel: 2, track: { power: 1, sin: 1 } },
      onExpire: { track: { power: -1, renown: -1 } } },

    { id: 'd21', kind: 'summon', npc: 'yin-mian', district: 'docks',
      title: '女术士的代理人约你一面',
      text: '银面说委托人愿意见你，时间是后天傍晚，地点在一艘没登记的小船上。她说船不会开，只停在泊位，见面不超过二十分钟。她还说委托人有个习惯，说话时喜欢用第三人称称呼自己，你别觉得奇怪。她说委托人只问一句话，问完就走。',
      days: 2,
      solve: { type: 'resource', need: { money: 30 } },
      onSolve: { intel: 3, track: { sin: 1 } },
      onExpire: { intel: -1, track: { power: -1 } } },

    { id: 'd22', kind: 'summon', npc: 'yu-ke', district: 'outside',
      title: '穹顶外有人要见你一面',
      text: '雨客说外环那边有人想跟你说几句话，隔着气闸，不进来。后天下午气压窗口只有四十分钟，你得在第九道闸门外站着。他说不用带礼物，对方只想知道你上一次做决定时，先想到的是谁。他说对方不进门，你也不用出闸。',
      days: 2,
      solve: { type: 'district', district: 'outside' },
      onSolve: { intel: 3, track: { sin: 1, power: 1 } },
      onExpire: { intel: -1, track: { renown: -1 } } },

    { id: 'd23', kind: 'summon', npc: 'sa-er', district: 'salvage',
      title: '拾荒者的队伍要你去一趟',
      text: '萨尔说回收场那帮人这周不出工，起因是一张被压了两个月的配给单。她要你在三天内到堆场去，站在人群前面说一句话，说清那张单子什么时候能下来。她说他们不听文件，只听人。她说你站上去的时候他们不会鼓掌，只会安静。',
      days: 3,
      solve: { type: 'stat', stat: 'charm', dc: 13 },
      onSolve: { track: { renown: 2, loyalty: -1 } },
      onExpire: { track: { renown: -2, loyalty: -1 } } },

    { id: 'd24', kind: 'summon', npc: 'wu-mian', district: 'memory',
      title: '记忆银行要你去核对一次',
      text: '无面递来一张通知，说有一份记录里的授权人写的是你的工号，需要你本人到柜台确认一次。时间约在四天后下午，无面说不用带证件，柜台认得人。柜台里那盏灯很白，坐下来之后没人会催你。无面说那天柜台只开一半，灯不会全亮。',
      days: 4,
      solve: { type: 'district', district: 'memory' },
      onSolve: { intel: 2, track: { loyalty: 1 } },
      onExpire: { track: { loyalty: -2, sin: 1 } } },

    /* ================= blood 血腥差事 ================= */
    { id: 'd25', kind: 'blood', npc: 'wen-duo', district: 'tower',
      title: '今晚有个人要从系统里消失',
      text: '闻铎说高塔十七层有个人手上有份不该外流的会议录音，人还在楼里。他给你到今天午夜，让这个人的门禁记录、工位访问、考勤三样同时断在今天之前。他说别做得干净，干净了反而像抹过。他说录音交出去之前，这个人还算是一个人。',
      days: 1,
      solve: { type: 'fold', path: 'purge' },
      onSolve: { intel: 2, track: { sin: 2, power: 1 } },
      onExpire: { track: { sin: 2, loyalty: -2 } } },

    { id: 'd26', kind: 'blood', npc: 'yu-nanzhi', district: 'exchange',
      title: '把那个追债的人断在港区',
      text: '郁南枝说清算行有一笔账的追索权被一个人攥了三年，这人每季度寄一次函，最近开始去找记者。她给你两天，让这件事没有下一个季度。她说这人不是坏人，只是太有耐心。她说她会把信和笔一起收走，收得很干净。',
      days: 2,
      solve: { type: 'fold', path: 'purge', need: 1 },
      onSolve: { money: 60, track: { sin: 2 } },
      onExpire: { track: { sin: 2, loyalty: -2 } } },

    { id: 'd27', kind: 'blood', npc: 'dai-siyuan', district: 'exchange',
      title: '让那个稽核员提前病退',
      text: '戴思远说稽查组里有个人已经翻到去年那叠底稿，翻的速度比预期快了两周。他不要别的，只要这个人本周内离开岗位。他说方法随你，但手续上要像病退，像到人事那边挑不出毛病。他说病退这个说法最好用，因为它不需要解释。',
      days: 2,
      solve: { type: 'stat', stat: 'stealth', dc: 14 },
      onSolve: { track: { loyalty: 2, sin: 2 } },
      onExpire: { track: { sin: 2, loyalty: -2 } } },

    { id: 'd28', kind: 'blood', npc: 'peng-jian', district: 'lab',
      title: '把那个值班员调离这一层',
      text: '彭戬说监控室那个夜班值班员看见了不该看的一段，人没做错什么，就是嘴不太严。他给你到明天早上，让这个人不再出现在地下二层的班表上，用哪种方式他不问，只要周一之前不再见他。他说这人只是运气不好，撞在了那个时间点上。',
      days: 1,
      solve: { type: 'resource', need: { money: 50 } },
      onSolve: { track: { power: 1, sin: 1 } },
      onExpire: { track: { sin: 2, loyalty: -2 } } },

    { id: 'd29', kind: 'blood', npc: 'tie-gui', district: 'docks',
      title: '让罢工牵头人今晚退出',
      text: '铁贵说港口罢工那个牵头人今晚要在二号仓开个小会，会有十几个人去。他要你让这个会开不起来，也不用让他伤得多重，只要这几天站不起来。他说工人这块地他清楚，动手的分寸他知道，你只要把车开到位置。',
      days: 1,
      solve: { type: 'district', district: 'docks' },
      onSolve: { intel: 2, track: { sin: 2, power: 1 } },
      onExpire: { track: { sin: 2, renown: -2 } } },

    { id: 'd30', kind: 'blood', npc: 'lao-ya', district: 'slum',
      title: '处理掉一个不太安静的线人',
      text: '老鸦说下三层有个线人两头卖，上周把你们一次交接的时间说了出去。他说这人不用留，但也别做得太狠，留个能交代的说法就行。他把地址写在烟盒内侧，撕下来给你，说火里烧过就没人认得。他说下面的人换得快，少一个不会有人去数。',
      days: 2,
      solve: { type: 'stat', stat: 'force', dc: 13 },
      onSolve: { intel: 2, track: { sin: 2 } },
      onExpire: { track: { sin: 2, renown: -1 } } },

    { id: 'd31', kind: 'blood', npc: 'yin-mian', district: 'ring',
      title: '让一个人错过了那趟船',
      text: '银面说她的委托人今早改了主意，不想再让某个人离开这座城。她给你两天，让那人在登船前被拦下，方式不重要，只要上不了船。她说委托人原话是「她要留在这座城里，跟这里一起」。她说这是委托人的原话，她只负责转达。',
      days: 2,
      solve: { type: 'fold', path: 'control', need: 1 },
      onSolve: { track: { sin: 1, power: 2 } },
      onExpire: { track: { sin: 2, power: -1 } } },

    { id: 'd32', kind: 'blood', npc: 'wen-shicheng', district: 'orbit',
      title: '把那个没上船的记录抹干净',
      text: '温仕成说昨天凌晨有个人从轨道港的货梯下去，没有出境记录，也没过体检。这事上面今天已经开始查登船名单。他给你一天，把四号登船口七点前后的交接记录处理成设备故障，别留下一个人名。他说查到最后总要有一个原因，故障最省事。',
      days: 1,
      solve: { type: 'stat', stat: 'stealth', dc: 12 },
      onSolve: { money: 30, track: { sin: 1 } },
      onExpire: { track: { sin: 2, loyalty: -2 } } },

    { id: 'd33', kind: 'blood', npc: 'sa-er', district: 'salvage',
      title: '回收场那只手要处理掉',
      text: '萨尔说三号堆场那台压机这几天总卡，昨天清理的时候从料里挑出一只戴着手环的手。她说手环是登记过的。她给你两天，把这件事了结，别让它进任何一份事故报告。她说这块地她扫了八年，第一次不想扫。',
      days: 2,
      solve: { type: 'resource', need: { money: 40 } },
      onSolve: { intel: 2, track: { sin: 2 } },
      onExpire: { track: { sin: 2, renown: -1 } } },

    { id: 'd34', kind: 'blood', npc: 'xun-jie', district: 'ring',
      title: '把环带那个坠落记录改掉',
      text: '荀戒说上周环带有一处平台缺口，有人从那儿掉了下去，记录被写成检修期间无人通行。现在巡检员换班，那份记录还在。他给你两天，把它改成设备故障导致的坠落，责任人写设备编号，不写人。他说平台缺口的检修单他能补，现在缺的是一个名字。',
      days: 2,
      solve: { type: 'district', district: 'ring' },
      onSolve: { track: { power: 1, sin: 2 } },
      onExpire: { track: { sin: 2, loyalty: -1 } } },

    { id: 'd35', kind: 'blood', npc: 'wu-mian', district: 'memory',
      title: '把一段记忆提前结清掉',
      text: '无面说有一份记录的主人下周会来取，但柜台的排期已经把它移到了处理名单里。无面要你在两天内签字确认提前结清。无面说话时一直看着柜台后面的墙，说这是件让人不舒服的工作，签字的人通常不看。',
      days: 2,
      solve: { type: 'fold', path: 'purge', need: 1 },
      onSolve: { track: { sin: 2, loyalty: 1 } },
      onExpire: { track: { sin: 2, power: -1 } } },

    { id: 'd36', kind: 'blood', npc: 'cheng-yan', district: 'lab',
      title: '让那份样本来源查不下去',
      text: '程砚说伦理那边开始追问三号柜样本的来源人，问到这一步就有点近了。她要你在两天内让这条线断掉，方式由你，但别动研究所里的人。她说动了自己人就不好再往下了，这话说得很轻。她说这条线断在谁身上都行，别断在她组里。',
      days: 2,
      solve: { type: 'stat', stat: 'intellect', dc: 14 },
      onSolve: { intel: 2, gear: 1, track: { sin: 2 } },
      onExpire: { track: { sin: 2, loyalty: -2 } } },

    /* ================= favor 人情托付 ================= */
    { id: 'd37', kind: 'favor', npc: 'lu-wan', district: 'slum',
      title: '帮一个发烧的孩子躲过体检',
      text: '陆晚说她收了个发烧的孩子，烧退了但伤口还在，明天巡防要挨户做体检。她要你在明天中午前把孩子送进你名下一间空置的库房，门牌照常挂着不用的牌子。她说这次不用你出钱，只要你签一张临时占用单。',
      days: 1,
      solve: { type: 'resource', need: { money: 35 } },
      onSolve: { track: { renown: 2, loyalty: -1, sin: 1 } },
      onExpire: { track: { sin: 1, renown: -1 } },
      onRefuse: { track: { sin: 1, renown: -1 } },
      refuseLabel: '帮不了' },

    { id: 'd38', kind: 'favor', npc: 'yu-ke', district: 'outside',
      title: '给穹顶外的人送一箱药',
      text: '雨客说外环那边缺一批治烧伤的药，气闸只在后天傍晚开一次，东西得装在不保温的箱子里。他要你用维修物资的名义过一次申报，收件人写你们部门自己。他说送到就行，别问谁用，也别看开箱记录。他说药是用过的，箱子是空的，两边都不会细问。',
      days: 2,
      solve: { type: 'resource', need: { money: 45 } },
      onSolve: { intel: 2, track: { sin: 1, power: 1 } },
      onExpire: { track: { sin: 1, renown: -1 } },
      onRefuse: { track: { loyalty: 1 } },
      refuseLabel: '不送' },

    { id: 'd39', kind: 'favor', npc: 'wen-shicheng', district: 'orbit',
      title: '帮一个搬货的留住名额',
      text: '温仕成说轨道港那个常年在月台搬货的人，体检这关被卡住了，理由是肺功能边缘值。他要你以用人部门的名义出一份不需要体检的岗位说明，后天之前交到引航局。他说位子他留着，但只留到这一周结束。',
      days: 2,
      solve: { type: 'resource', need: { intel: 2 } },
      onSolve: { track: { renown: 2, loyalty: -1 } },
      onExpire: { track: { renown: -2, sin: 1 } } },

    { id: 'd40', kind: 'favor', npc: 'ban-tou', district: 'salvage',
      title: '帮班头把一个人的名字保住',
      text: '班头说回收场这季度要裁一批人，名单上有个老工人，手抖得厉害但没出过一次错。他要在三天内把这个人从裁撤名单挪到留用名单，理由栏空着也行。他说他自己填不了，他签的字从来没人认。他说那个人的手是抖的，但捡起的每一颗螺丝都是对的。',
      days: 3,
      solve: { type: 'stat', stat: 'charm', dc: 12 },
      onSolve: { track: { renown: 2, loyalty: -1 } },
      onExpire: { track: { renown: -2, sin: 1 } },
      onRefuse: { track: { renown: -2 } },
      refuseLabel: '不管这事' },

    { id: 'd41', kind: 'favor', npc: 'xun-jie', district: 'ring',
      title: '帮巡检员重抄一份承诺书',
      text: '荀戒说环带那起事故之后每个人都要补签一份安全承诺书，他那一份被组长退回来，说字太潦草。他要你替他重抄一遍，签名留白，明天上班前压在巡检站的抽屉里。他说这纸没别的用处，就是让人心里过得去。',
      days: 1,
      solve: { type: 'stat', stat: 'intellect', dc: 12 },
      onSolve: { track: { renown: 1, power: 1 } },
      onExpire: { track: { renown: -1, loyalty: -1 } } },

    { id: 'd42', kind: 'favor', npc: 'lu-wan', district: 'slum',
      title: '帮诊所把那位病人送出城',
      text: '陆晚说诊所里那个人伤口已经能走路，但留在城里迟早被人认出来。她要在两天内弄到一张去轨道的长途票，用别的名字。她说钱她凑了一半，剩下的用手上的止血粉抵，那批粉是正规货，批号对得上。她说票根她会烧掉，烧完这事就当没办过。',
      days: 2,
      solve: { type: 'district', district: 'slum' },
      onSolve: { track: { renown: 2, sin: 1 } },
      onExpire: { track: { sin: 1, renown: -1 } },
      onRefuse: { track: { renown: -1, sin: 1 } },
      refuseLabel: '不掺和' },

    { id: 'd43', kind: 'favor', npc: 'lao-ya', district: 'slum',
      title: '帮老鸦把一封信递上去',
      text: '老鸦手上有一封信，走正规渠道会在第二道签收没回音。他要你在三天内让它落进稽查组的内部收件箱，别署名，也别转手。他说这信寄出去之后你就当从没见过，问他他也不认，问急了还会翻脸。他说这信是谁写的不重要，重要的是谁收。',
      days: 3,
      solve: { type: 'stat', stat: 'stealth', dc: 13 },
      onSolve: { intel: 3, track: { sin: 1, renown: 1 } },
      onExpire: { track: { sin: 1, renown: -1 } } },

    { id: 'd44', kind: 'favor', npc: 'tie-gui', district: 'docks',
      title: '帮港区家属把抚恤办下来',
      text: '铁贵说上个月港区那起事故，家属的抚恤卡在工伤认定上，因为死者的工牌那天没打卡。他要你在两天内让认定走完，材料他来补，你只需要在事故经过那一栏签个字。他说这钱等不起，家里有两个孩子。',
      days: 2,
      solve: { type: 'resource', need: { money: 30 } },
      onSolve: { track: { renown: 3, loyalty: -1 } },
      onExpire: { track: { renown: -2, sin: 1 } },
      onRefuse: { track: { renown: -2, loyalty: 1 } },
      refuseLabel: '不签这个字' },

    { id: 'd45', kind: 'favor', npc: 'yin-mian', district: 'docks',
      title: '帮她的委托人补一段经历',
      text: '银面说她那位委托人这周要办一次离港备案，可身份记录里有一段空白，正好是三年。她要你在三天内把那段空白填成一段普通的工作经历，公司名随便挑一家已经注销的。她说填得越普通越好，普通到没人记得。',
      days: 3,
      solve: { type: 'stat', stat: 'intellect', dc: 13 },
      onSolve: { track: { power: 1, sin: 1, renown: 1 } },
      onExpire: { track: { sin: 1, renown: -1 } } },

    { id: 'd46', kind: 'favor', npc: 'cheng-yan', district: 'lab',
      title: '帮她留下那台旧离心机',
      text: '程砚说研究所那台旧离心机下个月要按资产清算拉走，编号已经进了报废单。她要你在三天内把报废单退回一次，理由写账实不符。她说这台机器还能转，转得比新来的那台稳，稳的东西不应该先走。她说清算的人只认编号，不认转数。',
      days: 3,
      solve: { type: 'fold', path: 'control', need: 1 },
      onSolve: { track: { renown: 2, loyalty: -1, power: 1 } },
      onExpire: { track: { renown: -2 } } },

    { id: 'd47', kind: 'favor', npc: 'su-wen', district: 'tower',
      title: '帮她过闸机那天不登记',
      text: '苏纹说她母亲后天要从穹顶外侧进来做一次复查，手续齐全，只是不想让名字进高塔的访客系统。她要你在两天内安排一条不登记的内部通道，用员工临时授权。她说刷一次就够，出来的时候不用再刷。她说她母亲怕的不是规矩，是名单。',
      days: 2,
      solve: { type: 'stat', stat: 'intellect', dc: 12 },
      onSolve: { track: { loyalty: 1, renown: 1 } },
      onExpire: { track: { renown: -1, loyalty: -1 } } },

    { id: 'd48', kind: 'favor', npc: 'wu-mian', district: 'memory',
      title: '帮一份记录的主人留副本',
      text: '无面说有一份记录下周就要按流程销毁，主人是个上了年纪的维修工，家里人希望留一份纸质副本。无面要你在三天内走一次复印审批，编号写别的。无面说这算违规，但柜台里从来没有人问过这一栏。无面说这一栏从建行那天起就没人填过。',
      days: 3,
      solve: { type: 'district', district: 'memory' },
      onSolve: { intel: 2, track: { sin: 1, renown: 1 } },
      onExpire: { track: { sin: 1 } },
      onRefuse: { track: { loyalty: 1 } },
      refuseLabel: '不办' },

    /* ================= trap 试探 ================= */
    { id: 'd49', kind: 'trap', npc: 'wu-mian', district: 'memory',
      title: '一份白送的记忆清仓权限',
      text: '无面把一张盖好章的记忆清仓授权推到窗口边上，说到今天下班前有效，没人会回来核对。用它的条件是以后每次柜台盘点，你都要在备注里写一句「无异常」。无面说这只是让他们省点事，不是要你做什么。',
      days: 2,
      solve: { type: 'fold', path: 'control', need: 1 },
      onSolve: { intel: 3, track: { sin: 1 } },
      onExpire: { track: { power: -1 } },
      onRefuse: { track: { renown: 1 } },
      refuseLabel: '把授权推回去' },

    { id: 'd50', kind: 'trap', npc: 'lu-wan', district: 'slum',
      title: '一位不用付钱的诊所常客',
      text: '陆晚说诊所近来多了一位常客，每次来都坐同一把椅子，走时留下一小包东西，说是还人情。她不肯拆，也不肯说是谁。她要你在三天内替她看一眼那包东西，如果她之后再提，就说你从没见过。她说那把椅子最近总是热的，但人走得很干净。',
      days: 3,
      solve: { type: 'fold', path: 'purge', need: 1 },
      onSolve: { intel: 3, track: { sin: 1, power: 1 } },
      onExpire: { track: { sin: 1, renown: -1 } },
      onRefuse: { track: { renown: 1, loyalty: -1 } },
      refuseLabel: '不碰' },

    { id: 'd51', kind: 'trap', npc: 'wen-shicheng', district: 'orbit',
      title: '一张便宜到离谱的舱位',
      text: '温仕成说四号登船口有个位子空着，价格只要正常价的两成，明早六点半走。他说位子的原主上周临时不去了，手续都已经办完。他让你三天内决定，决定之前不要问那个人的名字，问了这单就作废。他说原主的手续齐全，只是人已经没了。',
      days: 3,
      solve: { type: 'resource', need: { money: 30 } },
      onSolve: { track: { power: 1, sin: 1 } },
      onExpire: { track: { renown: -1 } },
      onRefuse: { track: { loyalty: 1 } },
      refuseLabel: '不要这个位子' },

    { id: 'd52', kind: 'trap', npc: 'yu-ke', district: 'outside',
      title: '一份来自穹顶外的馈赠',
      text: '雨客把一个没有封口的袋子放在闸门内侧，说是外环那边托他带来的，不收钱。袋子里是一叠手写的纸条，字迹和你一位已经不在的同事一样。雨客说这不是他写的，他只是没问是谁写的。雨客说他没拆过，也不打算知道里面写的是什么。',
      days: 2,
      solve: { type: 'fold', path: 'purge', need: 1 },
      onSolve: { intel: 3, track: { sin: 1 } },
      onExpire: { intel: -1, track: { power: -1 } },
      onRefuse: { track: { loyalty: 1 } },
      refuseLabel: '不签收' },

    { id: 'd53', kind: 'trap', npc: 'ban-tou', district: 'salvage',
      title: '一本记着两套数的台账',
      text: '班头把回收场的进货台账推过来，说这上面有两套数，一套给上面看，一套他自己记。他给你三天时间去核一遍，核完把第二种记法教给他手下那个学徒。他说这孩子聪明，学东西快得让人不安。他说孩子学会之后，这本台账就该换一个封面了。',
      days: 3,
      solve: { type: 'stat', stat: 'intellect', dc: 13 },
      onSolve: { intel: 2, money: 25, track: { power: 1 } },
      onExpire: { track: { renown: -1, power: -1 } },
      onRefuse: { track: { renown: 1, loyalty: -1 } },
      refuseLabel: '不教' },

    { id: 'd54', kind: 'trap', npc: 'sa-er', district: 'salvage',
      title: '一只不该归你的旧手环',
      text: '萨尔说从废料里翻出一只手环，编号被磨掉一半，另一半还认得出，是你们部门去年发出去的。她说这东西她不打算上报，给你两天拿走，怎么处置随你。她还说这手环原本戴在一只手上，那只手现在也归你了。',
      days: 2,
      solve: { type: 'fold', path: 'purge', need: 1 },
      onSolve: { intel: 2, track: { sin: 2 } },
      onExpire: { track: { sin: 1, renown: -1 } },
      onRefuse: { track: { renown: 1, sin: 1 } },
      refuseLabel: '不接手环' },

    { id: 'd55', kind: 'trap', npc: 'yu-nanzhi', district: 'exchange',
      title: '一笔提前结清的陈年旧账',
      text: '郁南枝说有一笔三年前的账突然被结清了，付款方是一个已经不存在的部门，收款方是你。钱不多，来得干净，路径也对。她让你两天内确认一下这笔钱的性质，确认完就当作季度奖金入账，不用再提。她说这笔钱挂在账上，比拿在手上更显眼。',
      days: 2,
      solve: { type: 'resource', need: { money: 40 } },
      onSolve: { money: 45, track: { power: 1, sin: 1 } },
      onExpire: { track: { sin: 1, loyalty: -1 } },
      onRefuse: { track: { loyalty: 1, renown: 1 } },
      refuseLabel: '退回这笔钱' },

    { id: 'd56', kind: 'trap', npc: 'dai-siyuan', district: 'exchange',
      title: '一份没有署名的审计底稿',
      text: '戴思远把一叠审计底稿放在你桌上，说这是有人匿名递到他办公室的，前面三页写的是别人的事，第四页开始写你。他给你三天时间去认笔迹，认出来告诉他，认不出来就当没这回事。底稿他没有留复印件。',
      days: 3,
      solve: { type: 'stat', stat: 'intellect', dc: 14 },
      onSolve: { intel: 3, track: { power: 1 } },
      onExpire: { track: { loyalty: -2, renown: -1 } },
      onRefuse: { track: { loyalty: 1, sin: 1 } },
      refuseLabel: '不认领' },

    { id: 'd57', kind: 'trap', npc: 'peng-jian', district: 'lab',
      title: '一把没人会查的备用钥匙',
      text: '彭戬把一把地下二层冷库的备用钥匙放在你手边，说到下个月换锁前都没人会用这把。他说拿着它什么都不用做，只要不还回来。他还说冷库里存的东西最近换过一批，现在的比上个月那批轻，也安静。他说钥匙上的编号已经被磨掉了，认不出是哪一间。',
      days: 3,
      solve: { type: 'district', district: 'lab' },
      onSolve: { gear: 1, intel: 2, track: { sin: 1 } },
      onExpire: { track: { sin: 1, loyalty: -1 } },
      onRefuse: { track: { loyalty: 1 } },
      refuseLabel: '把钥匙还回去' },

    { id: 'd58', kind: 'trap', npc: 'cheng-yan', district: 'lab',
      title: '一次不用登记的样本补录',
      text: '程砚说三号项目缺一组对照样本，正规流程要三周审批，她有办法当天补上，只要你在一张空白的入库单上先签字。她说这批样本来路干净，只是不想让它经过伦理那一关。她把签字笔横放在单子中间，没有催你。',
      days: 2,
      solve: { type: 'fold', path: 'purge', need: 1 },
      onSolve: { intel: 3, gear: 1, track: { sin: 1 } },
      onExpire: { track: { loyalty: -1, power: -1 } },
      onRefuse: { track: { loyalty: 1 } },
      refuseLabel: '不签这张单' },

    { id: 'd59', kind: 'trap', npc: 'xun-jie', district: 'ring',
      title: '一段可以随意填的巡检空档',
      text: '荀戒说环带那段巡检记录里有个四小时的空档，系统已经默认成设备维护，谁也不会去核对。他说这四小时你可以拿去办自己的事，只要在记录上按他的写法补一句「一切正常」。他说大家都是这么写的。',
      days: 2,
      solve: { type: 'fold', path: 'expand', need: 1 },
      onSolve: { intel: 2, track: { power: 1, sin: 1 } },
      onExpire: { track: { renown: -1 } },
      onRefuse: { track: { renown: 1, loyalty: 1 } },
      refuseLabel: '按实填写' },

    { id: 'd60', kind: 'trap', npc: 'wen-duo', district: 'tower',
      title: '一句可以替他说出口的话',
      text: '闻铎说下周董事会简报上有一句对你不利的话，他可以删掉，也可以换成另一句。换的那句会把责任挪到隔壁部门一个刚调来的人身上。他给你三天，让你自己决定要不要换。他说他不催，反正那天总要有人被念到。',
      days: 3,
      solve: { type: 'fold', path: 'control', need: 1 },
      onSolve: { track: { power: 2, sin: 1 } },
      onExpire: { track: { loyalty: -2 } },
      onRefuse: { track: { renown: 1, loyalty: 1 } },
      refuseLabel: '按原文念' },

  ];
})();

/* ===== game/intro.js ===== */
/* 世界观入门：开局的连续剧情段落。由内容设计生成。 */
(function () {
  'use strict';

  window.INTRO_SCENES = [
    {
      id: 'intro-1',
      order: 1,
      title: '你头顶的六万个接缝',
      text: '你入职那天抬头看过穹顶内侧。六万三千块板，每块都铸着编号，编号前面写着负责维护的部门。外面是酸雨和永远不散的黑云，雨落在板上是闷响，像有人在很远的地方敲铁皮。集团每年发一次通知，说穹顶的雨是恩赐，是替所有人挡住的东西。通知发到每个人终端上，落款日期写着：穹顶落成第两千零四十六年。没有一行写着穹顶什么时候开。你问过一次，合规部说这个问题不在培训手册里。从那天起你就懂了：所有人都在里面，所有人都不提这件事。',
      choices: [
        { label: '再抬头看一次穹顶内侧', relation: 1, run: { intel: 1 }, flag: 'looked_up' },
        { label: '低头看自己工牌上的编号', relation: 0, run: { intel: 1 }, flag: 'checked_badge' },
        { label: '不再想了，先去看今天的面板', relation: -1, run: { track: { loyalty: 1 } }, flag: 'skipped_dome' }
      ],
      tag: '世界观',
      when: {}
    },
    {
      id: 'intro-2',
      order: 2,
      title: '中层的一天从工牌开始',
      text: '你在穹顶集团做了九年，工牌编号 B-3312，中层。每天八点四十刷卡进楼，电梯在三十三层停，走廊尽头那间没有窗的会议叫「四号洽谈室」。你的工作是替上面把不愿意出面的事办完：劝退、合并、签一份很难看的补偿协议。大楼里的规矩很简单，不出错就没人记得你。你的工位靠着内墙，那段墙里埋着通风管，冬天有热气，夏天一点用都没有。楼下的人靠集团发的净水过日子，你靠集团的季度考评过日子，区别只是排队的楼层不同。',
      choices: [],
      tag: '世界观',
      when: {}
    },
    {
      id: 'intro-3',
      order: 3,
      title: '董事会把事务做成了牌局',
      text: '董事会在最高层，高塔商业区的顶。他们不缺钱，不缺人，也不缺时间，缺的是能把事情做得有趣的方式。于是几十年前有人提议，把公司事务做成牌局：一副十二张「指令卡」，每张写明要拿下哪个目标，拿下了就折掉，折掉的卡不再回到桌上。监事会起初反对，说这不合规，后来有人在反对文件上签了名，那件事就结束了。你听到的版本是：董事会觉得无聊，需要有人替他们玩。玩得久的人有名字，玩得短的没有。顶层的会议记录里，「折牌」和「处理」从来没被写成同一件事。',
      choices: [],
      tag: '世界观',
      when: {}
    },
    {
      id: 'intro-4',
      order: 4,
      title: '你被点名的那个下午',
      text: '四号洽谈室的灯有一盏在闪，谁都没让人来修，闪得久了，进门的人都不抬头看。下午三点二十，苏纹把一副牌推到你面前，牌面朝上，第一张写着「外包监理」，后面还有十一张。她说这不是征求意见，是通知。她没坐下，站在你对面的桌边。桌角放着一杯已经凉了的茶，没人喝。她报出你的工牌编号，报得比你自己还熟。走廊尽头电梯的楼层灯停在三十三层，一直没动。你听见自己说了一声「好」。出门的时候她补了一句：规矩和上次一样，七天。',
      choices: [
        { label: '当场翻看剩下那十一张', relation: 1, run: { intel: 3 }, flag: 'read_deck' },
        { label: '只问一句：过期了怎么办', relation: 2, run: { intel: 1, track: { loyalty: 1 } }, flag: 'asked_expiry' },
        { label: '先看苏纹的表情，再决定说什么', relation: 0, run: { intel: 2, track: { power: 1 } }, flag: 'watched_su' }
      ],
      tag: '处境',
      when: {}
    },
    {
      id: 'intro-5',
      order: 5,
      title: '十二张牌与七天的期限',
      text: '苏纹把规则说得很干净，像在念一份排期。十二张牌是一副，每张写明目标、路径、成功率，掷点过了才算折掉。每七天必须折掉至少一张，折不了就换人。她说「换人」的时候语速一点没变，这个词在他们系统里有一个正式写法，叫「回收」。她给你看了上一张桌的记录，最后一行写着「自愿退出」，日期是上周四，签字栏空着。折完十二张，你活下来。她还说，一局牌里最难的不是掷点，是你得亲手把那张牌按下去。',
      choices: [
        { label: '问她上周四那个人是谁', relation: 2, run: { intel: 3 }, flag: 'asked_last_week' },
        { label: '请她把回收的定义说清楚', relation: 1, run: { intel: 2, track: { sin: 1 } }, flag: 'asked_purge_def' },
        { label: '点头，说知道了', relation: 0, run: { track: { loyalty: 1 } }, flag: 'nodded' }
      ],
      tag: '规则',
      when: {}
    },
    {
      id: 'intro-6',
      order: 6,
      title: '四条路径各自的意思',
      text: '牌只有四种打法。操控是把人笼络过来，让他替你说话，成本低，见效慢；资本是花钱把别人的东西变成你的，签字的时候对方往往还在笑；扩张是带人占地方，占住了就写进你的资产表；清洗是让人消失，流程走完会有一份写着「离职」的证明。四条路都有人走，走得最多的是清洗，因为它最快。走廊上没人管你用什么方法，只管第七天到了牌折没折。苏纹说过一句：在上面，清洗不算违规，算正常工作量。',
      choices: [],
      tag: '规则',
      when: {}
    },
    {
      id: 'intro-7',
      order: 7,
      title: '忠诚归零与罪痕满值',
      text: '名望四条轨道，两条会直接要你的命。忠诚是董事会对你的信任，归零那天不用等通知，清算行会上门；上一个坐在你这位子的人，最后一次出现在系统里是「自愿退出」，日期是上周四，那天早上他还刷了卡。罪痕是你留下的把柄，满值不用别人动手，系统自己会把你反噬回去。你做的事越脏，这条涨得越快，裁一次人涨一点，走一次暗账涨一点。有人专门做善后，花一点力气把它压下去，但压不干净。',
      choices: [
        { label: '问那两条轨道现在各是多少', relation: 1, run: { intel: 2 }, flag: 'asked_tracks' },
        { label: '记住「善后」这个动作', relation: 0, run: { intel: 2, track: { power: 1 } }, flag: 'noted_cleanup' }
      ],
      tag: '规则',
      when: {}
    },
    {
      id: 'intro-8',
      order: 8,
      title: '声望和权柄用来做什么',
      text: '另外两条不会杀你，但决定你最后算哪一种赢。声望是业内和公众给你的口碑，董事会不在乎它，可它是你离开牌桌时唯一能带走的东西：同样活到第十二张，有人被写成「脏手的善人」，有人被写成「忠犬归位」。权柄是你实际握着的人和系统，手底下有多少人肯替你出门，你能调多少条通道的权限。权柄高的时候，判定线自己会往下掉，很多事不用你亲自去。四条轨道都在终端右下角，白天你几乎不会看它们。',
      choices: [],
      tag: '规则',
      when: {}
    },
    {
      id: 'intro-9',
      order: 9,
      title: '你的工位在第三十三层',
      text: '你有工位、有门禁卡、有一份还过得去的年度评级，办公室里没人跟你结仇，也没人给你留过一句真话。信息栏里躺着三十七条未读，全是流程文件。抽屉最里面是一只空的茶叶罐，你一直没扔，标签上的字已经糊了。你知道几件事：后勤班车七点一刻最后一班；加班到十一点以后，走廊的灯会一格一格暗下来；三十三层以上的楼梯门常年锁着。你也知道，你手里能立刻动用的，只有自己这张脸和这个编号。',
      choices: [
        { label: '翻一遍那三十七条未读', relation: 0, run: { intel: 2 }, flag: 'read_inbox' },
        { label: '把那只空茶叶罐扔了', relation: 1, run: { track: { power: 1 } }, flag: 'threw_tin' },
        { label: '去楼梯口推那扇锁着的门', relation: 2, run: { intel: 3, track: { sin: 1 } }, flag: 'tried_stair' }
      ],
      tag: '处境',
      when: {}
    },
    {
      id: 'intro-10',
      order: 10,
      title: '苏纹第一次叫你的名字',
      text: '苏纹是董事会日程官。她的名字不出现在任何一份对外文件里，但所有人的排期都要从她手上过一遍。她记得整层楼的作息：谁几点喝第一杯咖啡，谁的体检报告迟交了三天，谁上一次出现在监控画面里是几点几分，连电梯停在哪一层她都算得出来。她第一次叫你的名字，就在那杯凉茶旁边，叫的是全名，一个字都没含糊。她说从今天起她负责把你的七天排清楚，出了差错，她的排期表上会多一行字，那行字对谁都不好看，对你也是。',
      choices: [],
      tag: '人',
      when: {}
    },
    {
      id: 'intro-11',
      order: 11,
      title: '苏纹说她能帮你什么',
      text: '苏纹给了你三样东西。一份排期表，上面标出哪些时段可以动手、哪些时段别出事；一个内部号码，每天凌晨两点十七分之后打过去有人接，接的人不一定说话；一句提醒，她只帮你把时间排对，牌得你自己按下去，她不会替你按。她说她见过太多人把力气花在问为什么上，问到最后七天过去了，牌还在手上，人已经不在名单上。说完她就起身，把那杯凉茶留在桌上，没让人收。走到门口她回头看了你一眼，像在看一份还没填完的表。',
      choices: [],
      tag: '人',
      when: {}
    },
    {
      id: 'intro-12',
      order: 12,
      title: '现在，翻第一张牌',
      text: '你坐回工位。终端右下角四条轨道各自亮着，手边一副十二张的牌，第一张的边角有点卷，是被人捏过很多次的那种卷。穹顶的雨还在板上响，闷闷的，一层一层压下来，隔着墙都能听见。楼下的净水照常在发，顶层的灯照常在亮，日程官的表已经排到第七天。你不再需要有人解释这一切，你需要在第七天之前把手上这张牌折掉。牌桌是十二张，期限是七天，名望记在你身上，折不完的后果也记在你身上。现在，翻第一张。',
      choices: [],
      tag: '开始',
      when: {}
    }
  ];
})();

/* ===== game/story-main.js ===== */
/* ==========================================================
   《七日指令》主线剧情 —— 五幕
   引导者：苏纹（董事会日程官）
   她给玩家发牌，一路带着走，直到最后一幕由玩家决定这局怎么结束。
   ========================================================== */
(function () {
  'use strict';

  window.STORY_MAIN = [

    /* ==================== 第一幕 · 发牌 ==================== */
    {
      id: 'm-act1-1',
      act: 1, order: 1,
      npc: 'su-wen',
      district: 'tower',
      title: '苏纹：这副牌本来不是给你的',
      when: { minDay: 1 },
      text: '上周四的早会散得比平时快，长桌上还留着没人收的纸杯，窗外下了半宿的雨刚停，玻璃上全是水痕。三十七层的走廊刚拖过，地上一串湿脚印一直排到电梯口，不知道是谁的。苏纹在拐角等你，怀里抱着一叠日程表，最上面那张的收件人不是你，是另一个部门的编号。她把那张抽出来，随手换上另一张，纸边卷着，页脚印着「内部流转·勿带离」，换下来的那张她没扔，夹进自己表册的最里面。「十二张，七天一张，折不出来就换人。」说这话时她盯着电梯上行的指示灯，没看你，「上一副发出去的时候，我也是这么交代的。」电梯到了，她先进去，用手按住门等你。她袖口有一小片湿痕，是刚洗过手还是淋过雨，你分不清。她的工牌翻过来了，照片朝里。',
      options: [
        { label: '问上一副牌是谁在用', relation: 2, run: { intel: 3 }, flag: 'ask_prev',
          after: '你把问题问出口。她按下楼层键才回答：「上一副用到第九张，人就换了。」电梯上升的那几秒里，她翻了翻抱着的表，把其中一页折角又抹平，像是后悔留了痕。到三十七层她先出去，门合拢前回头看了你一眼，像在核对一个数字。' },
        { label: '什么也不问，跟上电梯', relation: 1, run: { track: { loyalty: 1 } },
          after: '你什么也没问，跟着她进了电梯。她在三十六层按停，把你领进一间没有门牌的小会议室，桌上摊着十二张空白指令卡和一支旧笔，笔帽裂了。她指了指最左边那张：「从这张开始。折的时候手别抖，也别折在编号上。」' },
        { label: '把日程表还给她，说这不归我管', relation: -1, run: { track: { power: 1, loyalty: -1 } },
          after: '你把日程表塞回她怀里。她没有接话，只把那张纸抽出来对折，夹进自己表册的最后一页，压平。电梯来了两趟她都没上。「这话我听过三次，」她说，「前两次说的人，现在都在这张表上。」说完她按下上行键，站到你前面。' },
      ],
    },
    {
      id: 'm-act1-2',
      act: 1, order: 2,
      npc: 'su-wen',
      district: 'tower',
      title: '苏纹：一个已经清空的名录',
      when: { minFolded: 2 },
      text: '三天前你折掉第二张卡，系统里连条通知都没留，只有卡片折口那道白印还翘着。工位上方的灯管坏了一根，没人来换，你桌上的光比平时暗一档。夜里十一点，苏纹把门推开一条缝，没开顶灯，只在你桌上放下一份名录，纸还带着复印机的余温，边角是热的。十七个名字，全部划了横线，最后一栏统一写着「已回收」，备注列里只有一行小字：均由本人自愿申请。她俯下身，用手指压在最下面那个名字上——那行没被划掉，因为墨还没干，指腹一按就晕开一点。「这个人今天还在档案里喘气，」她说，「你要不要记住他？」窗外高架上的车灯一盏一盏过去，把她的影子从你桌面扫到墙上，又扫回去。她走的时候把门带上，锁舌响了两次才咬合。',
      options: [
        { label: '记住这个名字', relation: 2, run: { intel: 3 }, flag: 'know_name',
          after: '你把那个名字念了一遍。她点头，没记在本子上，只把名录合起来，出门前撕掉那一页丢进碎纸机，机器卡了一下。你回到座位，发现私人备忘录里多了一行字，不是你打的——那三个字，笔画比你的工整，光标还在末尾闪。' },
        { label: '问她这十七个人是谁签的', relation: 1, run: { intel: 2, track: { sin: 1 } },
          after: '你问她这十七个人是谁签的。她翻到名录最后一页，指着右下角一处被涂掉又重写的签名：「字是我打的，手印是别人按的。」她把纸翻过来给你看背面，那里有十七个浅浅的凹坑，像被人用指腹反复按过，中间几个已经平了。' },
        { label: '把名录推回去', relation: -1, run: { track: { loyalty: 1 } },
          after: '你把名录推回桌沿。她停了两秒，收进文件夹，说了句「行」。走廊的感应灯一盏盏亮过去又灭掉，脚步声跟着灯走。第二天你桌上多了一张打印纸，只有一行日期，是你自己的入职日。没有署名，纸是从内线打印机出来的。' },
      ],
    },

    /* ==================== 第二幕 · 上桌 ==================== */
    {
      id: 'm-act2-1',
      act: 2, order: 1,
      npc: 'su-wen',
      district: 'tower',
      title: '苏纹：你活过了第一个七天',
      when: { minFolded: 3 },
      text: '茶水间的咖啡机三天前就坏了，报修单还贴在墙上，边角被人撕掉一小块，日期那行看不清。台面上堆着没人洗的杯子，水渍干成一圈圈白印。苏纹在这儿堵住你，手里那杯咖啡已经凉透，杯壁上留着一个浅浅的唇印。她喝东西一向慢，这杯看样子放了一上午。她先朝门口看了两眼，才把你叫到窗边：「按流程，活过第一个周期的人要更新一次档案。」她把终端转过来给你看，照片是你入职那天拍的，比现在瘦，领口别着临时工牌，工号那栏还是临时的编号。她往下翻了两屏，「续任建议」那一栏已经填好了，两个字：可以。「上面问我，你是不是能往下走。我填的可以。」她顿了一下，把杯子往旁边挪开一点，「你要是想改，现在还来得及。」',
      options: [
        { label: '不用改，继续', relation: 2, run: { track: { loyalty: 1, power: 1 } }, flag: 'kept_going',
          after: '你说不用改。她收回终端，把咖啡整杯倒进水槽，杯子随手扔进回收桶，盖子没盖严。她擦干手往外走，走到门口又停下：「那从今天起，你的名字会出现在三张不同的表上。」说完补了一句，「别去看第三张。」' },
        { label: '问她能不能把我从名单里删掉', relation: 1, run: { intel: 2, track: { sin: 1 } },
          after: '你问她能不能把你从名单里删掉。她低头戳了两下终端，屏幕弹出一行小字：操作需双人授权。她把手缩回来，说：「我删过一次，删的是别人。」说完把杯子里剩的冷水一饮而尽，像在冲掉什么味道。杯子冲干净放回架上，摆得很正。' },
        { label: '自己动手改那份档案', relation: -1, run: { statRandom: 1, track: { sin: 2, loyalty: -1 } },
          after: '你伸手把终端转过来，自己改了几处，提交成功的提示弹出来时，她没拦，只往后退了半步，看着你的手。屏幕上那张入职照换成了今天的样子，领口那张临时工牌也被系统抹掉了。她拿走终端时说了句：「从今天起，档案比我更熟你。」' },
      ],
    },
    {
      id: 'm-act2-2',
      act: 2, order: 2,
      npc: 'wen-duo',
      district: 'tower',
      title: '闻铎：一次没有预告的例行访问',
      when: { minFolded: 4 },
      text: '这场会面你没有约过。楼层的空调刚换过风口，吹出来的风里有一点灰味。上午十点，闻铎端着两杯水坐到你工位对面，手表链在桌角磕了一下，滴答声压住空调的嗡响。他带了一本很薄的手册，封面什么都没写，纸是灰的，像内部印的那种，纸边翘着，看得出来翻过很多遍。他翻到中间，那一页夹着一张你的门禁记录复印件，时间是上周四凌晨两点十一分，读卡器编号在三十三层。他把复件抽出来摆正，像是专门给你看的，杯口的水汽一缕缕散开，把复印件的一角洇软了。「例行核对。」他拧开水杯盖，没喝，「顺便问一句——那天你去三十三层做什么？」走廊的灯正好暗了一格，他的脸跟着黑下去，手册上的字也看不清了。',
      options: [
        { label: '如实说明那晚的去向', relation: 2, run: { track: { loyalty: 2, renown: -1 } }, flag: 'told_truth',
          after: '你一五一十说了，从进楼的时间说到电梯停靠的层数。他没记录，只在手册上画了个小圈，圈住一个时间点。临走前他把手册扣在桌上，封面朝上，你才看清压着一行浅字：留痕者免责。走到电梯口，他回头说：「下次别一个人上去。」' },
        { label: '反问他手上那份记录从哪来的', relation: 1, run: { intel: 3, track: { loyalty: -1 } },
          after: '你没答，反问他手上那份记录从哪来的。他手指在复件边缘停了一下，笑了：「系统每天四点导出一份，我只是拿到了其中一页。」他把手册合上，夹进腋下，又补了一句，「能拿到它的人，不止我一个。」' },
        { label: '说记不清了', relation: -1, run: { track: { sin: 1, loyalty: -1 } },
          after: '你说记不清了。他笑了下，笑到嘴角就够。他合上手册，用指尖把它推回你桌边：「那本先放你这儿。」他走后你翻开中间那一页，复印件已经不见了，只剩一圈浅浅的压痕，时间的位置是空的，纸还热着。' },
      ],
    },

    /* ==================== 第三幕 · 洗牌 ==================== */
    {
      id: 'm-act3-1',
      act: 3, order: 1,
      npc: 'su-wen',
      district: 'tower',
      title: '苏纹：有人在查我的排期表',
      when: { minFolded: 6 },
      text: '这一周你折掉第六张卡，楼下保安换了两拨，闸机旁边多了一台新的读卡器，红灯一直亮着。苏纹没有进办公室，站在门框外把话说完了，声音压得比走廊的空调还低。她说她的排期表三天前被调走过一次，回来时多了三处标注，全是她替你改过时间的记录，红笔，字迹不是她的，每处旁边还压出一道浅浅的折痕，像被人对着灯看过。她从文件袋里把那张纸抽出来，指着红标注给你看，指尖在各处之间来回挪，文件袋上用记号笔画着一道斜杠，那是她自己的标记。「我不怕被查，」她说，「我怕他们顺着我的表，一页页对照你哪天做了什么。」说完她把一份新的排期表塞给你，上面几个时段是空的，空得不像她会排出来的样子。',
      options: [
        { label: '按她给的排期走', relation: 3, run: { intel: 3, track: { loyalty: -1, sin: 1 } }, flag: 'trusted_su',
          after: '你按她给的表走。第三天那两个空出来的小时，你在三十九层一间没挂牌的会议室里坐到灯自己灭，没人来找你，也没人被找到。晚上她发来一条不需要回复的消息，只有一串房号，是你的门禁权限里本来没有的。' },
        { label: '把排期表退回去，让她别管', relation: -1, run: { track: { loyalty: 2, renown: 1 } },
          after: '你把表推回她手里，让她别管。她接过来直接对折两次，塞进外套口袋，没有争，也没看你。「行。」她说，「那从明天起，我按公事公办的表给你排。」第二天你的日程被排到晚上十点，一条缝都没留。' },
        { label: '留下表，但记下哪几处是她改的', relation: 1, run: { intel: 4, track: { sin: 1 } },
          after: '你把表收下了。回座位后你对着自己的旧记录核了半小时，把三处红笔标注的时间一一对上，抄进私人备忘录。第二天早上，那三行日期从系统里被抹掉了，抹得很干净。只有你的备忘还留着它们，还留着是哪天写的。' },
      ],
    },
    {
      id: 'm-act3-2',
      act: 3, order: 2,
      npc: 'su-wen',
      district: 'tower',
      title: '苏纹：她第一次把私人的东西拿出来',
      when: { minFolded: 7, minRel: 3 },
      text: '你折掉第七张卡的那个晚上，她第一次把私人的东西拿出来。那是一个纸质笔记本，深蓝色封皮，边角磨白了，封面上有几道指甲掐过的浅印，本子用一根断了半截的皮筋箍着，箍得不紧。前十几页是会议记录，字很小，行距挤得密；后面几十页是手写的名字，每一个后面跟着一个日期，日期后面什么都没写，空着。茶水间的灯管在头顶闪了两下，谁也没去管。你注意到她的指甲剪得很短，指节上有一块旧茧，是长年写字磨出来的。她把本子放在桌上，掌心一直没离开封皮。「我在这张椅子上坐了六年，」她说，「一直以为自己在排日程。上个月我才想明白，我排的是顺序。」窗外那栋楼还有几层亮着灯，隔着一层水汽看不清编号。她把本子推过来，手没松开，等你先接。',
      options: [
        { label: '接过本子', relation: 3, run: { intel: 4, track: { sin: 1 } }, flag: 'has_ledger',
          after: '你把本子接过来，指腹压在某页的折痕上。她的手空了，收回膝盖上，人往后坐直了些。走廊有人经过，脚步在门口停了一秒又走远。她低声说：「第十四页往后，别在公司里翻。」本子现在在你抽屉最里层，压着两块备用芯片。' },
        { label: '让她自己留着', relation: 1, run: { track: { loyalty: 1 }, statRandom: 1 },
          after: '你把手收回去，让她自己留着。她看了你一会儿，把本子重新塞回包里，拉链一直拉到底，包带在肩上绕了一圈才起身。「也好，」她说，「放我这儿，翻的人只会是我。」第二天她的工位多了一个带锁的抽屉，锁是新的，钥匙不知道在谁手上。那天下午抽屉被拉开过一次，里面只有一包没拆的纸巾。' },
        { label: '问她愿不愿意把本子交出去', relation: -1, run: { track: { loyalty: 2, renown: -1 } },
          after: '你问她愿不愿意把它交出去。她把本子往怀里收了半寸，手指停在封皮上，半天才说：「交出去，我就得在最后一页添一行。」她笑了一下，把本子放回包里。从那天起，她再没在你面前打开过它。后来你又见过那个包两次，都比从前鼓一点。' },
      ],
    },

    /* ==================== 第四幕 · 底牌 ==================== */
    {
      id: 'm-act4-1',
      act: 4, order: 1,
      npc: 'yin-mian',
      district: 'docks',
      title: '银面：一张不该存在的牌',
      when: { minFolded: 9 },
      text: '第九张卡折下去的那天，码头起了风，仓库的铁皮门被吹得一响一响，地上的积水一圈圈抖。路灯正在换班，一盏亮起来，旁边那盏就灭下去，水面反着一条碎红。银面在你必经的通道口等了很久，久到皮鞋面上的水痕已经干了，鞋尖上落了一层灰。她递给你一张卡，正面空白，反面印着一串编号，位数比你的指令卡多两位，墨色偏蓝，卡面比普通的厚一点，边上有个很小的圆孔。「这张不在你的牌堆里，」她说，「但它在结算表上。」她歪了歪头，像在听一段你听不见的电流声，「你们发牌的时候，好像忘了一件事——牌也会数人。」一滴雨穿过她影子的边缘，落在积水上，没有溅开。',
      options: [
        { label: '收下这张牌', relation: 2, run: { intel: 4, chips: 2, track: { sin: 1 } }, flag: 'blank_card',
          after: '你把卡收进内袋，纸面凉得贴着肋条。她看了一眼你放卡的位置，像是确认了什么，随后退进仓库侧门的阴影里，脚步声在铁皮上拖了两下就没了。第二天上午结算系统推来一条对账提醒，编号栏里那串数字，和你口袋里那张一模一样。提醒没有落款，你盯着看了三秒，它自己消失了。' },
        { label: '当场把它撕掉', relation: -1, run: { track: { loyalty: 2, renown: 1 } },
          after: '你当着她的面把卡撕成四片，扔进排水沟。她没拦，只看着水把纸片泡开、摊平、冲走。「撕了也一样，」她说，「结算表认编号，不认纸。」她走之后你低头看手，指缝里还留着一小块纸角，凉的，边缘的蓝墨蹭在皮肤上，洗了两遍才掉。' },
        { label: '问她是谁派她来的', relation: 1, run: { intel: 3, track: { power: 1 } },
          after: '你问她是谁派来的。她想了很久，久到风又吹过一阵，铁皮门响了两声。「上一个问我这个问题的人，」她说，「现在在结算表的倒数第三行。」她没给答案，只把两只手摊开给你看，手心干干净净，连个印子都没有。' },
      ],
    },
    {
      id: 'm-act4-2',
      act: 4, order: 2,
      npc: 'su-wen',
      district: 'tower',
      title: '苏纹：把你的名字从流程里拿掉',
      when: { minFolded: 10 },
      text: '凌晨三点，整栋楼只剩三十七层还亮着灯，前台那排工位全空着，有张椅子上还搭着没人带走的灰色外套。保洁的车停在走廊尽头没动，车斗里堆着没扔的纸箱。苏纹坐在她自己的工位上，屏幕上开着三份排期表，一份标红、一份标黄、一份全是空的。她手边摊着两个空掉的糖包和半盒没拆的药。你走到她身后她才回头，眼里有血丝，敲键盘的声音很轻，像怕吵醒谁。她把光标移到权限申请那一栏，清掉「执行人」后面的名字，让那一格变成空白，然后停下来看你。「从这里往下走，要么你变成写流程的人，要么你继续当被流程处理的人。」她说，「我只有一次机会做这件事。你说存还是不存。」桌上那杯水早凉了，茶叶沉在底下一动不动。',
      options: [
        { label: '让她存', relation: 3, run: { track: { power: 2, loyalty: -2, sin: 1 } }, flag: 'out_of_flow',
          after: '你说存。她按下保存，屏幕右下角跳出一行绿字，随即消失，连撤销按钮都没来得及亮。她合上笔记本，把两份纸质排期表往碎纸机里塞，按下开关才想起机器昨天就坏了，只好把纸撕成条塞进口袋。「明天开始，」她说，「没人会叫我给你排时间。」' },
        { label: '让她删掉这份申请', relation: -1, run: { track: { loyalty: 2 }, intel: 2 },
          after: '你说删掉。她愣了几秒，最后点了取消，空白的「执行人」一栏回到原来的名字。她关掉屏幕，整个人往后靠在椅背上，手还搭在键盘上。「行。」她说，「那我明天照旧给你排表。」走廊的灯在你们说话的时候灭过一次。' },
        { label: '问她自己想不想存', relation: 2, run: { intel: 3, track: { renown: 1 } },
          after: '你没答，反问她：你自己想不想存。她盯着那个光标，很久没动，指尖慢慢从键盘上挪开。「我在这张表上坐了六年，」她说，「这问题是第一个有人问我。」她最后把窗口最小化，没存，也没关。那件事就停在屏幕上，像被人按住的电梯门。' },
      ],
    },

    /* ==================== 第五幕 · 摊牌 ==================== */
    {
      id: 'm-act5-1',
      act: 5, order: 1,
      npc: 'su-wen',
      district: 'tower',
      title: '苏纹：最后一张牌发完了',
      when: { minFolded: 12 },
      text: '十二张牌全部折下，用了不到两个月。会议室里只剩下你和苏纹，长桌上的纸杯都收了，只剩她带来的那个牌盒，旧硬纸壳，边角用胶带补过两次，盒盖上有几道旧划痕。长桌尽头的投影还开着，蓝光落在墙上一动不动。她把牌一张张摞齐，动作比平时慢，指甲刮在盒沿上，细响在空房间里听得很清楚。「按流程，我现在要去系统里关掉这一局。」她说，「关掉以后，我不再是你的日程官，你也不再是执行人。我们可以不用再装了。」她把终端转过来，屏幕上那行「结案」按钮亮着，光标在下面闪。窗外天在亮，雨已经停了，会议室的空调还在吹。「你想怎么结束？」她问，手停在桌上没动。',
      options: [
        { label: '让她按下结案，回到原来的位置', relation: 1, run: { track: { loyalty: 2, power: 1 } },
          after: '她按下结案。屏幕黑下去之前跳出一行小字：本局无归档人。她看了两秒，把终端扣在桌面上。「流程走完了，」她说，「从今天起，我们只是同一栋楼里的两个人。」她收好牌盒先走了。你的门禁权限没变，日程表空了。' },
        { label: '自己接过终端，把整份流程删掉', relation: 3, run: { track: { renown: 2, sin: 2, loyalty: -2 } }, flag: 'broke_flow',
          after: '你伸手把终端拿过来，把整份流程一层层删掉，从执行人一直删到模板。她没拦，只把牌盒盖上，压住翘起的卡角。系统提示「无可用流程」时，天已经大亮。她起身替你把椅子推回桌下：「下一局要是还有牌，就没人替你发了。」' },
        { label: '请她一起离开这栋楼', relation: 2, run: { track: { renown: 3, loyalty: -2 } }, flag: 'left_together',
          after: '你请她一起离开这栋楼。她把牌盒留在桌上，没带——那是她六年来第一件没归档的东西。电梯下到一层时大厅还没开灯，你们从侧门出去，路面是湿的。她问你有没有地方可去，你说没有。她停了停，说她也没有。' },
      ],
    },
    /* ==================== 第五幕 · 摊牌（第二场）
       这里是整条主线的反转落点：
       苏纹就是二十五年前那个拒绝折牌的第十七名执行人。
       她没死，被留下来发牌；她帮你，是因为你折完十二张她才走得掉。
       她最后把自己填进「执行人」那一栏 ——
       二十五年前她拒绝折牌，二十五年后她终于折了最后一张，折的是自己。 */
    {
      id: 'm-act5-2',
      act: 5, order: 2,
      npc: 'su-wen',
      district: 'tower',
      title: '苏纹：第二十五年的那一栏',
      when: { minFolded: 12 },
      text: '天已经大亮。你正要起身，终端又亮了一次——不是结案回执，是一条红边通知：本局执行人申请更换，事由栏空着，签发人一栏也空着。\n\n苏纹看了一眼，没有惊讶，把牌盒推到你面前。「这一步我等了二十五年。」她说。\n\n她说她二十六岁进公司，做日程。二十五年前穹顶第四十一号接缝裂开的那天晚上，她坐在现在这个位置上，手里也有一副牌。「那时候一副牌不止十二张。」她说，「我把名单公开了。第二天，我的工号从系统里消失。所有人都以为我被处理了。」\n\n她把终端转过来，屏幕上有一条她自己的状态记录，四个字：已回收。\n\n「他们没杀我。他们算过账——杀一个不肯折牌的人，不如让她去发牌。」她说，「所以我留下来，给每一个人发牌。二十五年，我发过多少副，自己记不清了。」\n\n她翻开那本私人笔记本，停在最后几页。那些手写名字后面空着的日期，你现在明白了：那是她替每一个人排过的顺序。日期那一栏她一直没填，因为她填不了。\n\n「你以为我在帮你。」她说，「我是在等。等一个把十二张折完、还能回头看一眼的人。折完了，这一局才结得掉；结得掉，我才走得掉。」\n\n她把光标移到签发人那一栏。\n\n「换人的手续，必须由发布排期的人执行。执行人那一栏我填过很多人。这一次，我填我自己。」',
      options: [
        { label: '什么都没说，看着她把编号填进去', relation: 3, run: { guideFalls: true }, flag: 'guide_sacrifice_silent',
          after: '你没有说话。她一个一个数字敲进去，敲得很慢，像在核对。填完最后一个字符，屏幕停了两秒，跳出一行「已归档」。\n\n她把终端扣回桌上，起身，把椅子推回桌下。「牌盒你留着。」她说，「里面是空的。」\n\n她走出会议室，没有关门。走廊的灯在她身后一格一格暗下去——那一段你走过很多次，从来没见过它是怎么灭的。' },
        { label: '问她要不要再等一晚', relation: 2, run: { guideFalls: true }, flag: 'guide_sacrifice_ask',
          after: '你问她要不要再等一晚。她摇头，说二十五年里她等过很多个晚上，没有一个晚上会不一样。\n\n「你折完了十二张。」她说，「这是唯一一次不是我在替别人数日子。」\n\n她敲完编号，屏幕跳出一行「已归档」。她站起来的时候似乎想说什么，最后只把你的排期表往你那边推了推——表上空着三个时段，是她从来没敢填的那三个。' },
        { label: '伸手去抢那个按钮', relation: 1, run: { guideFalls: true }, flag: 'guide_sacrifice_stop',
          after: '你伸手去抢终端，她的动作比你快。她一只手压住屏幕，另一只手已经把编号填完了。\n\n「这一栏不是给你填的。」她说。这是她第一次用这种语气跟你说话。\n\n屏幕跳出一行「已归档」。她松开手，退回椅子上坐了一会儿，像刚跑完一段路。然后她起身，把牌盒推给你，走出门去，没有回头。' },
      ],
    },
  ];
})();

/* ===== game/story-npc-a.js ===== */
/* NPC 个人支线 A 组。每人三幕：相识 / 交情 / 分晓。 */
(function () {
  'use strict';

  window.STORY_NPC_A = [

    /* ============ 闻铎 · 董事会监事 · 高塔商业区 ============ */
    {
      id: 'wd-1',
      npc: 'wen-duo',
      stage: 1,
      act: 1,
      district: 'tower',
      title: '闻铎：茶室里的第二次见面',
      text: '高塔四十九层的茶室只开到下午四点，窗外是永远不散的雾。闻铎把杯子推到你面前，茶早就凉了，他自己一口没喝。他问你上个月在三十三层走廊站了多久，语气像在核对一张表格。他说没有别的意思，只想确认你还记不记得那天闻到的味道。走廊尽头的电梯停了一下层，响了三声，门没开。',
      when: { minFolded: 1 },
      options: [
        { label: '把那天的时间报给他', relation: 2, run: { intel: 2, track: { loyalty: 1 } }, flag: 'wd_told_time',
           after: '他把你报的时间记在纸角上，跟表格里那一栏对了一遍，两个数只差两分钟。他把纸折好收进内袋，说这一格总算有人替他填上了。服务生过来撤杯子，只端走了他那杯空的，你那杯凉茶还摆在桌上。' },
        { label: '反问他为什么查三十三层', relation: 1, run: { intel: 3, track: { loyalty: -1 } },
           after: '他没有答，反问你那晚在三十三层站了多久。你也没有答，两个人对着那杯凉茶坐了一会儿。走廊那部电梯又停了一次，门还是没开。他走的时候把排期表留在桌上，纸角压着一张没写字的便签。' },
        { label: '说那晚我没去过那里', relation: -2, run: { track: { sin: 1, loyalty: 1 } },
           after: '他听懂了，也没有拆穿，只把凉茶杯往你这边推了半寸，说好，那就当没去过。出茶室时他先按了电梯，电梯停了很久才到，两个人一路没有说话。第二天你部门的门禁记录里多了一条三十三层的通行，时间在凌晨。' },
      ],
    },
    {
      id: 'wd-2',
      npc: 'wen-duo',
      stage: 2,
      act: 2,
      district: 'tower',
      title: '闻铎：编号 J-1147 的复印件',
      text: '他把一只旧档案袋推过来，袋角磨得发白，封口只写了一行编号 J-1147。里面是三年前那场事故的原始签名页，收件人一栏被人涂掉了。他说这份东西在监事会走过七道流程，每一道都想让它消失。他要你确认那行被涂掉的名字，说完又补一句：你可以说没见过，也可以现在就走。',
      when: { minFolded: 5 },
      options: [
        { label: '帮他把涂掉的名字补上', relation: 3, run: { intel: 3, track: { loyalty: -1, power: 1 } }, flag: 'wd_helped',
           after: '你把名字念出来，他在复印件背面一笔一笔写下来，写完把档案袋重新封好，封口换了新胶带。他说这份东西以后再进监事会，经手人栏里就是你了。档案袋他收进包里，没有让你带走。' },
        { label: '问他拿什么换这份确认', relation: 0, run: { money: 50, track: { sin: 1, loyalty: -1 } },
           after: '他沉默了几秒，从内袋数出一沓现钞推过来，连信封都没有。他说价格他自己定，账上不会留痕。你把钱收了，档案袋他带了回去。第二天那行被涂掉的名字还是没有补上，流程照旧停在第七道。' },
        { label: '把档案袋原样推回去', relation: -2, run: { track: { loyalty: 2, power: -1 } },
           after: '你把袋子推回去，他没有伸手接，让它停在桌子中间，说行，那这份东西就还在他手里。他先起身走的，门在他身后合上。过了两周，监事会公开目录里 J-1147 那一栏的经手人还是空的，状态改成了待核。' },
      ],
    },
    {
      id: 'wd-3',
      npc: 'wen-duo',
      stage: 3,
      act: 3,
      district: 'tower',
      title: '闻铎：签在证人栏上的名字',
      text: '茶室已经关了。他带你走进四十九层尽头的档案间，制冷机的低鸣一直没停。J-1147 的最后一份文件摊在桌上，证人栏空着，笔已经旋开。他说：「签下去，我就是你的把柄；不签，你就成了我的。」说这句话时他手里还握着下午那只凉茶杯，杯壁的水痕干了一半。',
      when: { minFolded: 9 },
      options: [
        { label: '签字，站在他这一边', relation: 3, run: { intel: 4, track: { power: 2, sin: 1 } }, flag: 'wd_witness',
           after: '你在证人栏签了名，他把笔旋上，说这份文件从今往后两个人共有。制冷机还在响，他先走出去，在门口把灯关了。第二天你部门的材料里多了一份 J-1147 的抄件，抄件上没有落款。' },
        { label: '不签，把文件交回监事会', relation: -2, run: { track: { loyalty: 3, power: 1 } }, flag: 'wd_reported',
           after: '你把文件交回监事会，签收单上写的是你的编号。他第二天被叫去谈话，出来时在走廊上只点了一下头。那份文件的证人栏一直空着。他手上那只凉茶杯，你此后再没有见过。' },
        { label: '签，把复印件留给灰市', relation: 0, run: { money: 60, track: { sin: 2, renown: -1 } }, flag: 'wd_leak',
           after: '你签了字，趁他转身把复印件塞进外套。三天后灰市上有人在问 J-1147 的价格，问的人没有留名字。他来找过你一次，只问是不是你，你没有答。档案间的制冷机照旧响着。' },
      ],
    },

    /* ============ 苏纹 · 董事会日程官 · 高塔商业区 ============ */
    {
      id: 'sw-1',
      npc: 'su-wen',
      stage: 1,
      act: 1,
      district: 'tower',
      title: '苏纹：这一格本来不是你的',
      text: '周三下午三点，苏纹把周会往后挪了二十分钟，空出一格给你。她说这个时间不是她挑的，是有人替你留的。她低头在排期表上划了一道，用的是铅笔，划得很轻，像随时准备擦掉。走廊尽头的电梯停了一下层，她立刻把表合上，问你今天来高塔到底是为了什么。',
      when: { minFolded: 1 },
      options: [
        { label: '问她是谁替我留的时间', relation: 2, run: { intel: 3 }, flag: 'sw_asked',
           after: '她没有直接答，只在排期表空白处写了一个部门编号，写完立刻用橡皮擦掉，纸上还留着灰。她说这个名字你不要往外讲。三点那一格照旧空着，周会往后挪了二十分钟，没有人来过问。' },
        { label: '道谢，什么都不多问', relation: 1, run: { track: { loyalty: 1 } },
           after: '她点点头，说你懂规矩。三点那一格她替你留到散会，有人问起，她说是你自己调的时间。你没有多问，出门时她把铅笔收进袖子。排期表上那道铅笔印一直很浅。' },
        { label: '说这个时间我不会来', relation: -1, run: { track: { power: 1 } },
           after: '她把那一格划掉，用的还是铅笔，划得很轻，说好，就当没排过。周会照原时间开，你到的时候门已经关了。走廊尽头的电梯上上下下，她没有再抬头。那格空白后来填了别人的名字。' },
      ],
    },
    {
      id: 'sw-2',
      npc: 'su-wen',
      stage: 2,
      act: 2,
      district: 'tower',
      title: '苏纹：她第一次改了别人的表',
      text: '她把你的面谈挪到今晚十一点，理由写得规整：对方时间调整。排期表推到你面前，那一格里原本排着另一个人，名字被她用橡皮擦得很干净，只剩一点灰。她说这是她第一次替别人改表，现在退回去还来得及，只是退回去以后，那一格里填的就不会是你了。',
      when: { minFolded: 5 },
      options: [
        { label: '去，并让她留一份记录', relation: 3, run: { intel: 2, track: { loyalty: 1, power: 1 } }, flag: 'sw_kept_slot',
           after: '她把那一格的调整记录另存了一份，文件名只有日期。十一点的面谈照常开，对方来了，谈完在走廊上多站了两分钟。她第二天把记录给你看，说这是她第一次替人留底。' },
        { label: '让她把表改回原样', relation: -1, run: { track: { loyalty: 1, power: -1 } },
           after: '她照做，把那一格改了回去，橡皮擦过的灰用袖口抹了。她说那一格往后填的就不会是你。十一点那场面谈换了别人去，你第二天在公开目录里看到排期，那一格写的是另一个名字。' },
        { label: '问那个被擦掉的人是谁', relation: 2, run: { intel: 4, track: { sin: 1 } },
           after: '她说了名字，说完就后悔，让你当没听过。那人上个月调离高塔，调令的落款栏空着。她把排期表收进抽屉，抽屉钥匙挂在自己工牌后面。第二天她没有再提这件事，那一格的灰也擦干净了。' },
      ],
    },
    {
      id: 'sw-3',
      npc: 'su-wen',
      stage: 3,
      act: 3,
      district: 'tower',
      title: '苏纹：最后一格空白',
      text: '她约你在四十七层的空会议室见面，没有开灯，只有屏幕的光。桌上摊着这半个月的排期表，三个时段是空的，空得不像她排出来的。她说这三个空档是她给自己留的，也是给你留的。她把铅笔折成两截放在桌上，说这一次她不动笔，你想填什么就填什么。',
      when: { minFolded: 9 },
      options: [
        { label: '把空档填上她的名字', relation: 3, run: { intel: 3, track: { loyalty: 1, power: 2 } }, flag: 'sw_saved_her',
           after: '你把她的名字填进第一格，她看了一眼就把铅笔收起来，说这三格从今天起算她的。会议室没有开灯，屏幕的光照在她袖口上。第二天排期系统里那三格全满了，没有人来问过。' },
        { label: '交回董事会，写明三个空档', relation: -2, run: { track: { loyalty: 3, renown: -1 } }, flag: 'sw_handed',
           after: '表交上去当天下午，复核科来了两个人，把三个空档逐格抄走，又把她叫去问了一刻钟。她第二天照常上班，把桌上那两截断铅笔收进了笔筒，此后没有再替你留过时间。' },
        { label: '什么都不填，把表撕了', relation: 1, run: { track: { sin: 1, renown: 1 } },
           after: '你把表撕成两半，她没有拦，把两半收进抽屉，说这算是她第一次没有交表。第二天系统里那三格照旧空着，没有人补。她照常上班，只是把桌上那两截铅笔收进了笔筒。' },
      ],
    },

    /* ============ 郁南枝 · 清算行首席 · 交易所广场 ============ */
    {
      id: 'yn-1',
      npc: 'yu-nanzhi',
      stage: 1,
      act: 1,
      district: 'exchange',
      title: '郁南枝：三十七万的尾差',
      text: '交易所广场的清算行到晚上八点还亮着灯，屏幕上的数字一列列往下滚。郁南枝把昨天的清算单推过来，尾差三十七万，来源栏填的是你的部门编号。她递给你一支铅笔，让你自己圈出那一行。她说她只问数字不问人，今天这行数字上偏偏写着你的名字，你要她怎么抬头。',
      when: { minFolded: 1 },
      options: [
        { label: '圈出来，照着实话说明', relation: 2, run: { track: { loyalty: 2 } }, flag: 'yn_honest',
           after: '你把那一行圈了，照着实话讲了来龙去脉，她听完在本子上记了两条，说这行数字往后就挂在你的编号底下。清算单当天归档，尾差那一栏最后写的是部门追查未果，没有人再来问你。' },
        { label: '问她这行到底是谁填的', relation: 1, run: { intel: 3, track: { loyalty: -1 } },
           after: '她翻出提交记录，署名栏被人改过一次，改动的工号和你的差两位。她抄下来递给你，说这条线她自己不能往上报。当天夜里清算行那排灯比平时多亮了一个小时。' },
        { label: '说这不是我的部门编号', relation: -2, run: { track: { sin: 1 } },
           after: '她没有争，把清算单翻回来源栏，那串编号确实是你的部门。她说好，那就当我记错了。清算单第二天下班前归档，尾差挂在部门名下。她之后再没有让你单独进过清算室。' },
      ],
    },
    {
      id: 'yn-2',
      npc: 'yu-nanzhi',
      stage: 2,
      act: 2,
      district: 'exchange',
      title: '郁南枝：一笔挂了三年多的坏账',
      text: '她调出一笔挂了三年多的坏账，打印机一张一张往外吐纸。账上的人早就不在了，只剩一个还在世的联系人每年寄一次函。她要你把这笔账连同那个联系人的追索权一起终结。她的手指按在纸面那行姓氏上停了很久，那正是她自己的姓，她没说，你也没有问。',
      when: { minFolded: 5 },
      options: [
        { label: '帮她核销，先问清缘由', relation: 2, run: { money: 55, intel: 2, track: { sin: 1 } },
           after: '你把核销单填了，她只说了半句缘由就停住，说剩下半句等这笔账消掉再说。打印机吐完最后一张纸，她伸手把纸掀过来盖住那行姓氏。联系人当年的追索函从此不再寄出。' },
        { label: '按流程把坏账上报', relation: -2, run: { track: { loyalty: 2, renown: 1 } },
           after: '你按流程报了，复核科第二周来调卷，把联系人那栏也一并调走。她照常在清算行上班，只是不再让你碰挂账的卷宗。那笔坏账在账上又多活了三个月，最后按呆账核销。' },
        { label: '要她先说清和这人的关系', relation: 1, run: { intel: 4, track: { sin: 1 } },
           after: '她说那是她父亲的姓，说完就把账页合上，没有再解释。她给你一份追索函的抄件，说这份你留着，往后有人问就说不知道。那笔账最后是她自己报的核销，签名栏上只有她一个。' },
      ],
    },
    {
      id: 'yn-3',
      npc: 'yu-nanzhi',
      stage: 3,
      act: 3,
      district: 'exchange',
      title: '郁南枝：签收栏上的第二个名字',
      text: '凌晨的清算室里只剩一台终端在响。她把一份调整单放在你面前，金额栏写着一个刚好能把整条线抹平的数字，签收人栏留了两个空位。她说第一个她签，第二个留给你。铅笔递过来时笔尖已经削好，纸边压着一枚回形针，回形针上还夹着白天那张清算单的一角。',
      when: { minFolded: 9 },
      options: [
        { label: '签第二个名字，替她平账', relation: 3, run: { money: 70, track: { sin: 2, power: 1 } }, flag: 'yn_covered',
           after: '你在第二个空位签了名，她把两页对齐，用回形针别住，说这笔账从此挂在两个名字底下。终端响了一夜，天亮时那整条线的数字刚好平了。清算单原件她收进了自己的抽屉。' },
        { label: '不签，把调整单交给监事会', relation: -2, run: { track: { loyalty: 3, power: -1 } }, flag: 'yn_reported',
           after: '你把调整单交了上去，监事会第二天调走整卷。她照常来上班，进门先看一眼那台终端。调整单最后归档，签收人栏上只有一个名字，她的。你没有再进过那间清算室。' },
        { label: '签，但把原件复印一份', relation: 1, run: { intel: 4, track: { sin: 1, renown: -1 } }, flag: 'yn_copy',
           after: '你签了字，趁她去倒水把调整单复印了一份。她回来时看了你一眼，什么也没说，把回形针别回原件。那条线第二天平了账，你的抽屉里多了一张没有落款的抄件，纸边压得很直。' },
      ],
    },

    /* ============ 戴思远 · 合规伦理审查官 · 交易所广场 ============ */
    {
      id: 'ds-1',
      npc: 'dai-siyuan',
      stage: 1,
      act: 1,
      district: 'exchange',
      title: '戴思远：第三页的红笔圈',
      text: '合规处的会议室没有窗，只有一盏顶灯，灯管偶尔响一声。戴思远把审计底稿推给你，第三页用红笔圈住了差旅与耗材两项，旁边写着三成。他说这一刀必须你签，留下来的那部分算你替他们争的。他把笔递过来，手腕上那圈旧表带磨得快断，露出的压痕很深。',
      when: { minFolded: 1 },
      options: [
        { label: '签，并问这一刀砍到谁', relation: 2, run: { money: 25, intel: 2, track: { loyalty: 1 } },
           after: '你签了，他报了两个部门的名字，说完把笔收回去，笔帽拧得很紧。那三成额度当天核掉，底稿第三页的红圈旁边多出一行小字。被砍的两个部门月底来问过一回，没有人承认是谁点的圈。' },
        { label: '要求先看完整本底稿', relation: 1, run: { intel: 3, track: { loyalty: -1 } },
           after: '他把整本底稿推过来，缺了三页。你看完没有签，他说那就按原数往上报。第二天审计结论里那三成砍在了另一个部门头上，红笔圈的位置也换了，圈得比原来重。' },
        { label: '直接拒签，退回底稿', relation: -2, run: { track: { renown: 2, loyalty: -1 } },
           after: '你把底稿推回去，他收下了，说这一刀他会另找人签。合规处三天后换了签批人，那三成还是砍了。他碰见你时照例点头，只是不再把底稿往你面前推。' },
      ],
    },
    {
      id: 'ds-2',
      npc: 'dai-siyuan',
      stage: 2,
      act: 2,
      district: 'exchange',
      title: '戴思远：一份他签过的例外',
      text: '他把你叫进问询室，桌上摊着他三年前签过的一份合规例外，编号是红笔写的，纸角已经卷起。他说这份例外如今成了事故链条上的一环，签字的人只有他一个。他问你那份授权书副本还在不在你手里，问得很慢，眼睛一直没抬，手指在编号上蹭了两下。',
      when: { minFolded: 5 },
      options: [
        { label: '把副本给他，替他兜住', relation: 3, run: { intel: 2, track: { sin: 1 } },
           after: '你把副本交给他，他对着编号核了两遍，核完锁进抽屉，说这件事到此为止。第二天那份例外从事故链条里被抽了出来，抽件的记录栏空着，没有人补。他手腕上那圈表带换了新的。' },
        { label: '告诉他副本早就不在了', relation: -1, run: { track: { loyalty: 1 } },
           after: '他信了，没有追问，只把桌上那份例外翻到背面，用铅笔在编号上划了一道，说知道了。那次问询最后没有留下记录，例外照旧挂在链条上，签字的人还是他一个。' },
        { label: '问他要拿什么换这份副本', relation: 0, run: { money: 50, track: { sin: 1, power: 1 } },
           after: '他从内袋取出一只信封推过来，没有说话。你把副本给了他，他当场把编号对了一遍。这份例外后来还是从链条上抽掉了，抽出来那一页的边角留着回形针的印子。' },
      ],
    },
    {
      id: 'ds-3',
      npc: 'dai-siyuan',
      stage: 3,
      act: 3,
      district: 'exchange',
      title: '戴思远：他第一次没有签自己',
      text: '合规处的灯只开了一半，另一半坏了很久没人报修。他把一份新的例外申请推到桌子中间，申请人一栏写着另一个部门，签批人栏空着。他说这一份理由不成立，他不能签，也不想让你签。他把笔帽慢慢拧上，说这是他第一次不合规，剩下的事他一个人扛。',
      when: { minFolded: 9 },
      options: [
        { label: '把申请撤掉，替他担半份', relation: 3, run: { track: { renown: 2, loyalty: -1, power: 1 } }, flag: 'ds_covered',
           after: '你把申请抽回来，在撤件说明上写了自己的编号。复核科来问过一次，他把两页材料并排摆好，说责任两个人分。合规处那半排坏灯第二天被报修了，换灯的人没有进门。' },
        { label: '照流程签掉，这才合规', relation: -2, run: { track: { loyalty: 3, sin: 1 } }, flag: 'ds_signed',
           after: '你签了，理由栏照抄了申请人那一行。他看完把笔帽拧上，说他明白了。申请批下去两周后出了事，追责函上的签名位排到第四个。他留的那张签批联压在底稿最上层，一直没还。' },
        { label: '把申请和例外清单寄出去', relation: 0, run: { track: { renown: -2, sin: 1, power: 1 } }, flag: 'ds_leak',
           after: '你把两份材料一起寄了出去，收件人写的是外部追责组。第三天复核组进驻合规处，他签过的那些例外被逐条核对。他照常来上班，只是把红笔收进抽屉，此后不再往外拿。' },
      ],
    },

    /* ============ 程砚 · 首席科学家 · 研究所园区 ============ */
    {
      id: 'cy-1',
      npc: 'cheng-yan',
      stage: 1,
      act: 1,
      district: 'lab',
      title: '程砚：三号柜少了十一支',
      text: '研究所园区的走廊很干净，冷得像医院。程砚带你走到三号柜前，样本登记表停在上周三，中间少了十一支。她不要你解释去向，只要求本周内把表补齐，扫码栏空着，签字栏也空着。说完她就去看培养箱，背对着你站了很久，玻璃里映出的数字一直在往上跳。',
      when: { minFolded: 1 },
      options: [
        { label: '补齐表格，扫码栏留空', relation: 2, run: { intel: 2, gear: 1 },
           after: '你把表补到本周，扫码栏空着交了回去。她只看签字栏，看完说这一栏空着就还有说法。第二天三号柜换了新锁，钥匙挂在她工牌后面，谁也没有再提那十一支。' },
        { label: '追问这十一支去了哪', relation: 1, run: { intel: 3, track: { sin: 1 } },
           after: '她说了去向的一半，另一半让你去问排风记录。你查了当天的值班表，那一段里没有人签名。她转身去擦培养箱的玻璃，说这件事先停在这儿，别再往下问。' },
        { label: '不接这张表，让她找别人', relation: -2, run: { track: { loyalty: 1, power: -1 } },
           after: '她把表收回实验台，说那就换人。第二天另一个部门来签的字，扫码栏照样空着。你此后每次进三号实验室，门禁记录里都会多挂一行，没人解释，也没人来清。' },
      ],
    },
    {
      id: 'cy-2',
      npc: 'cheng-yan',
      stage: 2,
      act: 2,
      district: 'lab',
      title: '程砚：名册上多出来的那一行',
      text: '她把一份志愿者名册摊在实验台上。三号志愿者昨天出所之后再没有回来，签名还留在名册上，体检数据也还挂在系统里。她说需要这个名字在今天之内从名册上消失，数据她自己处理。旁边那台培养箱一直在响，像有什么东西在敲玻璃，她说话时手一直按着台面。',
      when: { minFolded: 5 },
      options: [
        { label: '替她把这一行抹掉', relation: 2, run: { gear: 1, track: { sin: 2, power: 1 } },
           after: '你把那一行从名册上抹掉，笔迹尽量压平。她当天就把体检数据从系统里撤了，撤得干干净净。名册那一栏空着，培养箱的响声一晚上没停。第二天她照常来上班，见面只谈样本编号。' },
        { label: '不抹，先查这人去了哪', relation: 0, run: { intel: 4, track: { renown: 1, sin: -1 } },
           after: '你调了那人的出所记录，最后一次刷卡在园区东门，时间比名册上晚四十分钟。她听完只看了一眼那张记录，把名册叠起来说这人回不来了。数据第二天还是从系统里撤了，她没有再提过这个名字。' },
        { label: '把名册原样交回伦理组', relation: -2, run: { track: { loyalty: 2, renown: 1 } },
           after: '你把名册交回伦理组，签收单上写的是你的编号。她当天被叫去谈话，出来时在走廊里站了一会儿。名册后来按流程归档，那一行还在，签名的位置被人用铅笔划了一道。' },
      ],
    },
    {
      id: 'cy-3',
      npc: 'cheng-yan',
      stage: 3,
      act: 3,
      district: 'lab',
      title: '程砚：签收栏',
      text: '三号实验室的灯全开着，一只没有标号的金属箱放在台面上，冷链记录停在前天凌晨。程砚把一份签收单推到你面前，签收人栏只留了一行空位。她说没人敢签，包括她自己。她站在箱子旁边，手从头到尾都搭在台面上，既没有碰过那只箱子，也没有看你。',
      when: { minFolded: 9 },
      options: [
        { label: '签字接收，站到她这边', relation: 3, run: { gear: 1, intel: 3, track: { sin: 1, power: 2 } }, flag: 'cy_signed',
           after: '你在签收单上签了字。冷链记录第二格被她补上，补的时间比原来晚二十分钟。那只金属箱当晚运出园区，谁都没有开过。她把签收单的另一份给了你，说这一份不归档。' },
        { label: '不签，把签收单上报董事会', relation: -2, run: { track: { loyalty: 3, renown: 1 } }, flag: 'cy_reported',
           after: '你把单子交了上去，董事会第二天派人封了实验室。她照旧来上班，站在走廊上等封条贴完。那只金属箱被整只运走，冷链记录和签收单一起进了档案，编号后面没有写名字。' },
        { label: '签，但先把数据拷一份', relation: 0, run: { intel: 4, track: { sin: 2 } }, flag: 'cy_backup',
           after: '你签了字，转身把箱上的数据拷了一份带走。她看见了，没有拦，只把签收单翻过去扣在台面上。第二天箱子里那份原始记录在系统里消失了，只剩你手里这一份。' },
      ],
    },

    /* ============ 彭戬 · 研究所安保总管 · 研究所园区 ============ */
    {
      id: 'pj-1',
      npc: 'peng-jian',
      stage: 1,
      act: 1,
      district: 'lab',
      title: '彭戬：缺了签名的那一趟',
      text: '安保总控室里有四块屏，最左边那块一直闪着红点。彭戬把一叠巡检单拍在你桌上，说周二凌晨那趟无人值守缺了签名。他知道不是你值的班，可系统里挂的是你的编号。他把笔递过来，说补签只要两分钟，笔就在他手里，签完这叠单子当场就归档。',
      when: { minFolded: 1 },
      options: [
        { label: '补签，先把事情压下去', relation: 2, run: { track: { power: 1, sin: 1 } },
           after: '你补了签，那叠单子当场归了档。他把笔插回胸前口袋，说这一趟就算过去了。半个月后那台无人值守的巡检仪报了一次故障，值班表上挂的还是你那一班。' },
        { label: '问他是谁动了系统', relation: 1, run: { intel: 3, track: { loyalty: -1 } },
           after: '他翻了系统日志，改动记录被清过一次，只剩一个临时账号。他把账号写在纸条上给你，说这行字他自己不能留。那份巡检单最后没有签名，挂在架子上等复核。' },
        { label: '不在任何单子上签字', relation: -2, run: { track: { loyalty: 2, power: -1 } },
           after: '你一张都没签，他把单子收回抽屉，说那就走正式流程。三天后上面派人来查，值班表被整本调走。他照常在总控室看屏，此后没有再问你一句话。' },
      ],
    },
    {
      id: 'pj-2',
      npc: 'peng-jian',
      stage: 2,
      act: 2,
      district: 'lab',
      title: '彭戬：钥匙盘上少了一把',
      text: '他把安保台的钥匙盘转到你面前，第三格是空的。他说昨晚有一批设备从三号走廊运出去，报的是你的工号，记录会跟着设备一起出园区，出到哪一步都算不到你头上。他问你还要不要那份临时授权，问到一半停住了，因为走廊的灯恰好灭了一排，四块屏上有两块跟着暗下去。',
      when: { minFolded: 5 },
      options: [
        { label: '给授权，帮他把记录抹掉', relation: 2, run: { gear: 1, track: { sin: 2 } },
           after: '你给了授权，他当场把那条出园记录改掉，改完把屏幕转过来只给你看一眼。那批设备从此没有在台账上出现过。钥匙盘第三格照旧空着，他没有补。' },
        { label: '不授权，让他向上面解释', relation: -1, run: { track: { loyalty: 2, renown: 1 } },
           after: '你拒绝了，他自己写了一份说明，交上去以后被问了三轮。设备记录最后按流程挂在你部门名下，出口那台读卡器换了一台新的。他没有再向你提过授权两个字。' },
        { label: '授权，要他记下谁下指令', relation: 1, run: { intel: 4, track: { sin: 1, power: 1 } },
           after: '你给了授权，让他把指令人的工号记下来。他抄了一份塞给你，自己那份没有留。那批设备出园区以后没有再回来，工号的主人在两个月后调了岗。' },
      ],
    },
    {
      id: 'pj-3',
      npc: 'peng-jian',
      stage: 3,
      act: 3,
      district: 'lab',
      title: '彭戬：他第一次没有开门',
      text: '凌晨三点，安保总控室只剩他一个人，四块屏有两块黑着。门禁读卡器一直在响，第七道上锁申请挂在屏上不动，卡号属于一个不该出现在园区里的人。他说他已经按过三次确认，这一次按了取消。他把钥匙盘推到桌子中间，说这道门他不开，明天写报告也好，撤职也好，他都认。读卡器又响了一声，屏幕上的时间跳到三点零七分。',
      when: { minFolded: 9 },
      options: [
        { label: '站他这边，这道门不开', relation: 3, run: { track: { renown: 2, loyalty: -1, power: 1 } }, flag: 'pj_refused',
           after: '你没让他开门，只把拒令的经过记在自己的值班本上。第七道上锁申请第二天被撤销，撤销栏的理由空着。他把钥匙盘推回原位，第三格还是空的，从此把椅子搬回门里。' },
        { label: '替他开门，记录算我头上', relation: 1, run: { intel: 2, track: { sin: 2, loyalty: 1 } },
           after: '你去按了确认，读卡器响到第二声就断了电，门始终没有开。第七道上锁申请两分钟后自己撤销，撤销栏的理由空着。记录挂在你名下，他写了一份三页的说明，只在最后一行提到那天夜里还有一次确认。' },
        { label: '按确认，上报他拒令', relation: -2, run: { track: { loyalty: 3, renown: -1 } }, flag: 'pj_reported',
           after: '你按了确认，又把拒令的经过报了上去。读卡器响到最后一声断了电，门没有开。他把钥匙盘交回工具间，写了一份三页的说明，纸压在四块屏下面。' },
      ],
    },

    /* ============ 老鸦 · 灰市掮客 · 下层居住区 ============ */
    {
      id: 'ly-1',
      npc: 'lao-ya',
      stage: 1,
      act: 1,
      district: 'slum',
      title: '老鸦：水泵房里的第一笔账',
      text: '下层旧水泵房的水声一晚上没停，铁管上结着一层白霜。老鸦蹲在管道边上，手边摊着一本手写账本，字歪得能看出是用左手写的。他说上次那件事他记住了，记住的方式是在账本上给你留了一行。他把账本合上，说这一行你先别问价，位置留着就行。',
      when: { minFolded: 1 },
      options: [
        { label: '认下这一行，问他图什么', relation: 2, run: { money: 20, intel: 2, track: { sin: 1 } },
           after: '你说这一行算你的，他没有答图什么，只把账本翻到下一页，说位置留着。那页上写着一串编号，末尾两位被墨水洇开了。水泵房的水声响了一整夜。' },
        { label: '把账本还他，这行不认', relation: -1, run: { track: { loyalty: 1, renown: 1 } },
           after: '你把账本还回去，他合上塞进腰后，说行，那就当我没写过。水管上的白霜第二天化了一片，账本第一页那一行被他自己划掉，划得很轻。' },
        { label: '问他这一行值多少', relation: 0, run: { money: 35, track: { sin: 1 } },
           after: '他报了个数，报完补一句说这一行往后可能不止这个数。你把钱付了，他在账本上把那一行圈起来，旁边添了个日期，写的是下个月。水泵房的铁管又开始结霜。' },
      ],
    },
    {
      id: 'ly-2',
      npc: 'lao-ya',
      stage: 2,
      act: 2,
      district: 'slum',
      title: '老鸦：名单上的一个旧交情',
      text: '他把你约到水管边的铁梯上，说下层的清理名单里有个人不该在上面。这人和他有点旧交情，早年替他挡过一刀，刀口到现在还留着。他不要你做什么大事，只要名单走流程的时候你多按一次暂停。他从口袋掏出一包没拆的烟，看了看又塞了回去，说这包是他留到事情办成那天才拆的。铁梯下面的水声一阵一阵的，他问你上次那件事，是不是还记着。',
      when: { minFolded: 5 },
      options: [
        { label: '按暂停，帮他把人留下', relation: 3, run: { track: { renown: 2, sin: 1, loyalty: -1 } }, flag: 'ly_saved',
           after: '名单在你手上多停了一天，那个人当天夜里被挪出了清理序列。他把那包烟拆开，抽出一支点上，剩下的塞给你。名单第二次走到你手上时，那个位置已经空了。' },
        { label: '不管这事，名单照走', relation: -2, run: { track: { loyalty: 1, sin: 1 } }, flag: 'ly_dropped',
           after: '名单照走，那个人在第三天被清走。他此后没有再约你上铁梯，见面只在市场那头，说的也只剩货和价。那包没拆的烟后来一直揣在他口袋里。' },
        { label: '按暂停，让他欠我一条', relation: 1, run: { intel: 3, track: { power: 1, sin: 1 } },
           after: '你按了暂停，也把话挑明，他点头认下。那个人被挪出序列，名字暂时挂着。半年后他托人送上来一只信封，里面只有一张纸条，写着一个工号。' },
      ],
    },
    {
      id: 'ly-3',
      npc: 'lao-ya',
      stage: 3,
      act: 3,
      district: 'slum',
      title: '老鸦：他撕了账本的第一页',
      text: '水泵房今晚没开灯，只有铁桶上那本账本翻着。老鸦翻到第一页，那一页记着灰市三十年的规矩：谁的货、谁的名字、谁的价，一条不漏。他说规矩里有一条，掮客不能替客户顶罪。现在他要撕掉这一页，手指已经按在纸边上，只等你点一下头。他说撕了以后灰市再没有他的位置，也再没有他替你挡下的那条规矩。铁桶上那本账本翻着，一页都还没少。',
      when: { minFolded: 9 },
      options: [
        { label: '让他撕，这份情我认下', relation: 3, run: { intel: 3, track: { renown: 1, sin: -1, power: 1 } }, flag: 'ly_tore',
           after: '他把那一页撕下来，撕得很慢，撕完扔进铁桶。第二天灰市上就有人问他的位置，他没答，照旧蹲在管道边上。那本账本从此少了第一页，装订线空着一道。' },
        { label: '把账本夺回来，规矩不能破', relation: -2, run: { track: { loyalty: 2, power: 1 } }, flag: 'ly_kept',
           after: '你把账本夺回来按在膝盖上，他没有再伸手。规矩保住了，他的位置也保住了。那天之后他见你时先看你的手，看完才说话。水泵房的水声一直没有停。' },
        { label: '让他撕，但先抄一份页', relation: 1, run: { intel: 4, track: { sin: 1, renown: -1 } }, flag: 'ly_copied',
           after: '你抄下那一页的条目，抄完他才撕。他把纸灰扫进水沟，说这一页两条命，一条是他的，一条是你的。抄件你锁进柜子，纸角一直压得很平。' },
      ],
    },

    /* ============ 陆晚 · 无证诊所医生 · 下层居住区 ============ */
    {
      id: 'lw-1',
      npc: 'lu-wan',
      stage: 1,
      act: 1,
      district: 'slum',
      title: '陆晚：手写单上的第七行',
      text: '无证诊所开在半层地下，消毒水味盖不住铁锈味。陆晚一边给你手上的划口穿线，一边说下个月那批药到了就得换新的。她把一张手写单推给你，第七行写着你的名字，剂量和时间都标好了，字是她的，笔画很急。她没抬头，说这一行她记了三个月。',
      when: { minFolded: 1 },
      options: [
        { label: '按单子来，把药钱付掉', relation: 2, run: { money: 45, track: { renown: 2, sin: -1 } },
           after: '你把钱压在单子下面，她数都没数就收进抽屉。药是分三次给的，最后一次她多留了一针。诊所门口那只灯泡那天换了新的，玻璃罩上的灰也擦干净了。' },
        { label: '问她为什么单记我一行', relation: 1, run: { intel: 3, track: { renown: 1 } },
           after: '她说这一行最早是记给自己看的，写着写着就不止一行了。她把单子翻给你看，前面几行是同一天。那晚她给你穿的线比平时细，走得也比平时慢。' },
        { label: '拿走单子，药我自己弄', relation: -2, run: { track: { loyalty: 1, sin: 1 } },
           after: '你把单子拿走了，她没有拦，只说药别乱配。半个月后你手上的线口发了炎，还是自己找到诊所来的。她把那张单子重新抄了一份，放在抽屉里没给你看。' },
      ],
    },
    {
      id: 'lw-2',
      npc: 'lu-wan',
      stage: 2,
      act: 2,
      district: 'slum',
      title: '陆晚：一只没有编号的旧义体',
      text: '她从柜子底层翻出一只旧义体，外壳磨得发白，接口处没有编号。她说这是给一个人留的，那人现在过不了闸机，也付不起钱。她要一份能过闸机的身份记录，只要一份，三天之内都算数。诊室外面有人一直在咳嗽，从头到尾没有停过，她说话时朝门口看了一眼。',
      when: { minFolded: 5 },
      options: [
        { label: '帮她弄一份身份记录', relation: 3, run: { money: 35, track: { renown: 2, sin: 1, loyalty: -1 } }, flag: 'lw_made_id',
           after: '你三天内把记录办了下来，那人当天就过了闸机。她把柜子底层那只旧义体取出来装了一次，装完那人能站起来了。这份记录后来在系统里被人注销过一回。' },
        { label: '帮不了，这事风险太大', relation: -2, run: { track: { loyalty: 1, sin: -1 } },
           after: '你说帮不了，她把义体推回柜子最底层，说那就再等等。一个月后那人没有再出现在诊所门口，柜子底层那格一直空着。她给你换药时不再多说一句话。' },
        { label: '先见这个人，再决定', relation: 1, run: { intel: 3, track: { renown: 1 } },
           after: '你见了那个人，他靠在诊室外面的墙上，一直咳嗽。你最后没有办记录，只留下自己的联系方式。她看在眼里，把手写单上的名字改成了一个代号，用铅笔写的。' },
      ],
    },
    {
      id: 'lw-3',
      npc: 'lu-wan',
      stage: 3,
      act: 3,
      district: 'slum',
      title: '陆晚：她第一次选了边',
      text: '诊所里多了两张床，靠里那张躺着一个穿灰制服的人。陆晚把一瓶标着别人名字的血浆塞进柜子，说你身后那条巷子里还有四个在等，她只来得及救一个。她把那张手写单撕成两半，一半塞进你手里，问你愿不愿意替她决定这一次该救谁。她从来不选边，缝过所有阵营的人，这一次她说她选不出来，选得出来的只有你。',
      when: { minFolded: 9 },
      options: [
        { label: '救制服那人，先问他是谁', relation: 0, run: { intel: 3, track: { loyalty: 2, renown: 1 } }, flag: 'lw_side_system',
           after: '你把人抬上靠里那张床，他醒过来报了工号和部门，说完又睡过去。巷子那边四个人那天走了三个。她给你留了一份名单，名单上第一个名字被划掉了。' },
        { label: '救巷子那边，听她的', relation: 3, run: { track: { renown: 2, loyalty: -1, sin: 1 } }, flag: 'lw_side_out',
           after: '你跟她去了巷子，四个人抬进来两个。制服那人半夜被同事接走，走的时候没有留名字。第二天她把两张床都腾空了，手写单撕掉的那一半烧在铁盘里。' },
        { label: '两边都不救，把人推走', relation: -2, run: { track: { renown: -1, sin: 1 } }, flag: 'lw_neutral',
           after: '你把两边都推开，她站着看了你一会儿，什么也没说，转身把两张床的空位都擦了一遍。第二天她照常开诊，只把门口那盏灯的瓦数换低了一档。靠里那张床空了很久。' },
      ],
    },

  ];
})();

/* ===== game/story-npc-b.js ===== */
/* NPC 个人支线 B 组。每人三幕：相识 / 交情 / 分晓。 */
(function () {
  'use strict';

  window.STORY_NPC_B = [
    /* ---------------- 铁贵 · 装卸工会头目 · docks ---------------- */
    {
      id: 'tg-1',
      npc: 'tie-gui',
      stage: 1,
      act: 1,
      district: 'docks',
      title: '铁贵：吊机下面那句话',
      text: '雨从穹顶接缝漏下来，在吊机底下积成一洼。铁贵站在那洼水里，雨衣湿透了也没脱，手里攥着一张装卸计件单。罢工第二天，三台吊机全停，警报灯从早亮到现在。他不是来找你讲道理，是把单子递过来：「上面这批货的报备号是你部门批的。你只要说一句，这是你自己签的。」',
      when: { minFolded: 1 },
      options: [
        { label: '当着工人的面替他说', relation: 2, run: { intel: 2, track: { renown: 1 } }, flag: 'tg_stood_up',
           after: '你当着人的面认了那句话，报备号那一栏当场补了一条批注，写着部门已阅。吊机还停着，工人没有散，铁贵把计件单折起来塞进雨衣内袋，收工前他站到你左边半步。' },
        { label: '把单子收下，什么也不说', relation: 1, run: { intel: 2, track: { sin: 1 } },
           after: '你把单子收下，什么也没有答话。警报灯亮到后半夜，三台吊机照旧停着。铁贵没有再问第二遍，只在点数时多看你一眼，那张单子在雨衣里被泡软了角。' },
        { label: '说这不是你签的，转身走', relation: -1, run: { track: { loyalty: 1 } },
           after: '你转身走的时候背后有人骂了一句，铁贵没有回头。那批货第二天换了船期，警报灯亮了一整夜。报备号那一栏照旧挂着，计件数没有人签，点数还在继续。' },
      ],
    },
    {
      id: 'tg-2',
      npc: 'tie-gui',
      stage: 2,
      act: 2,
      district: 'docks',
      title: '铁贵：第四天的手',
      text: '罢工进入第四天。冷库的制冷机一直在低鸣，货箱表面结了一层白霜。铁贵左手新换了绷带，边缘渗出一点黄。他把你叫到卷帘门后面，声音压得很低：「昨天夜里带走两个人，工号都记在我这儿。上面说停工时按天扣，扣满就把名额交给巡检。我要撑，就得让三十个人替我扛。」',
      when: { minFolded: 5 },
      options: [
        { label: '替他把两个工号藏进旧档案', relation: 3, run: { intel: 3, track: { sin: 2, renown: 1 } }, flag: 'tg_hid_roster',
           after: '你把两个工号混进旧档，归档日期往回写了半年。冷库那层白霜化了又结，他一直撑到第十四天。那两个人在复工名单里排在最后，谁也没有再点他们的名。' },
        { label: '劝他先把夜班撤下来', relation: 1, run: { intel: 2, track: { loyalty: 1 } },
           after: '他听了，夜班撤了三个小时，探照灯那晚扫过两次。停工照旧按天扣，他把计件单按在自己手里，没有往工人身上摊。十四天后他签了复工，条件写在一张纸上。' },
        { label: '说这局你插不了手', relation: -2, run: { track: { loyalty: 2 } },
           after: '你没有接这件事。罢工撑到第十九天，名单上少了七个人，四个是自己走的。铁贵此后没有再来找你，卷帘门下那盏灯一直亮着，谁也没有去关。' },
      ],
    },
    {
      id: 'tg-3',
      npc: 'tie-gui',
      stage: 3,
      act: 3,
      district: 'docks',
      title: '铁贵：把灯拆下来',
      text: '工会礼堂里，吊机上那盏警报灯被人拆了下来，摆在讲台正中，玻璃罩裂了一道。铁贵站在灯后面，四天拖成了十一天，工人少了七个。他念完名单，抬起头看你：「我准备签字复工，条件我一个人扛，名字不写别人的。你要想拦现在说；你要想接这份名单，也现在说。」',
      when: { minFolded: 9 },
      options: [
        { label: '站他这边，把名字接过来', relation: 3, run: { intel: 3, track: { renown: 2, sin: 1 } }, flag: 'tg_signed_with_him',
           after: '你接了名单，在礼堂后面签了字。复工当天吊机只开了两台，名单里剩下的名字他一个都没有念出来。那盏裂口的警报灯留在讲台上，后来被人搬去了门房。' },
        { label: '把名单交给董事会换复工', relation: -2, run: { money: 60, track: { loyalty: 2 } }, flag: 'tg_sold_out',
           after: '名单交上去，复工第三天就批了，多出来的名额他一个也没有报。他在礼堂里站到所有人都走空才出去，没有看你一眼。到年底还有七个名字没有回到名册上。' },
        { label: '不拦他，也不接名单', relation: -1, run: { intel: 1, track: { sin: -1 } },
           after: '你没有拦他，也没有接名单。他签完字把名单折成四折放进口袋，台上那盏灯谁也没有动。带走的七个人后来在港区别的队里上工，见了工会的人不说话。' },
      ],
    },

    /* ---------------- 银面 · 女术士的代理人 · docks ---------------- */
    {
      id: 'ym-1',
      npc: 'yin-mian',
      stage: 1,
      act: 1,
      district: 'docks',
      title: '银面：多出来的一次停电',
      text: '旧售票亭的玻璃上贴着停用七年的牌子。银面坐在里面，桌上一杯茶已经凉了，没动过。她没抬头：「码头明早六点四十会停一次电，十七分钟。停电那会儿，你的手机会收到一条不存在的到港通知。」你看了眼表，现在是六点三十八。她说完这句，才抬手示意你坐下。',
      when: { minFolded: 1 },
      options: [
        { label: '坐下，问她凭什么知道', relation: 2, run: { intel: 3 }, flag: 'ym_sat_down',
           after: '你坐下了。六点四十码头停了十七分钟电，你手机上那条不存在的到港通知准点响了。她给自己倒了杯热水，说这一次你先记住时间。你出门时她还在原位坐着。' },
        { label: '记下时间，先离开这里', relation: 0, run: { intel: 2, chips: 1 },
           after: '你把时间记在票根背面，走出了售票亭。六点三十八分你不在场，那条通知照常在六点四十到了你手上。她把杯子端起来看了一眼又放下，水一点也没有少。' },
        { label: '说这种把戏没人信', relation: -1, run: { track: { loyalty: 1 } },
           after: '你说了这句话，她没有反驳，只把停用牌子往玻璃上贴正了一点。第二天码头没有停电，也没有通知。那张票根你后来找出来过，背面写着的时间是六点三十八。' },
      ],
    },
    {
      id: 'ym-2',
      npc: 'yin-mian',
      stage: 2,
      act: 2,
      district: 'docks',
      title: '银面：她说的我们',
      text: '她约在停用货梯的机房，制冷机的低鸣比上次更响。门是从外面反锁的，锁舌上有新的刮痕。她从风衣内袋里抽出一张手写单，边角已经被攥软：「上周三下午三点十一分，有人拿这张单来提货。签名栏是我的字，但那不是我写的。」她说她的委托人已经在问这张单的下落，问到第二次就开始问她什么时候方便办离职。她把单子递到一半又收回去，「你拿着它，就等于替我把这件事认下来。」',
      when: { minFolded: 5, minRel: 2 },
      options: [
        { label: '接过单子，替她扛住这件事', relation: 3, run: { intel: 3, track: { sin: 2, power: 1 } }, flag: 'ym_took_slip',
           after: '你把单子接了过去。第二天委托人问到她，她说单子在别人手上。那份手写单你压在抽屉底下，边角的褶皱一直没有抹平。她的排班表照旧，只是每月少一班。' },
        { label: '不接，但帮她把签名比对清楚', relation: 1, run: { intel: 4, track: { sin: 1 } },
           after: '你没有接单子，把签名和档案里的旧笔迹对了一遍，差在收笔那一处。她把复印件收进风衣内袋，说这一份留着。委托人那边问了两回，之后就没有再问。' },
        { label: '让她自己交上去，你只当没见过', relation: -2, run: { track: { loyalty: 2, renown: -1 } },
           after: '她第二天自己交了上去。交接栏落的是她的编号，此后她不再进那间机房。路上碰见时她照例点头，只是不再提那张单子，凉茶杯也留在了桌上。' },
      ],
    },
    {
      id: 'ym-3',
      npc: 'yin-mian',
      stage: 3,
      act: 3,
      district: 'docks',
      title: '银面：替她说出那句话',
      text: '还是那间售票亭，停用的牌子掉了，凉茶的杯底在桌上留下一个圈。银面把一张写满缩写的手写单推过来，纸边上的字迹不像同一支笔写的。「这些编号里有一个是我的，可这些编号不是我的。」她第一次用「你的人」这个词，话却停在半句上，「你替我把那句话带出去，我就算你这边的人。」',
      when: { minFolded: 9 },
      options: [
        { label: '把话替她带出去，认下她', relation: 3, run: { intel: 3, track: { renown: 1, sin: 1 } }, flag: 'ym_spoke_for_her',
           after: '你把那句话带了出去，说的时候只报了编号，没有报名字。三天后有两个人来售票亭核过一次班次就走。她把那张手写单收回内袋，说这一句往后就算数。' },
        { label: '把单子交上去，摘清自己', relation: -2, run: { money: 50, track: { loyalty: 2 } }, flag: 'ym_reported',
           after: '你把单子交了上去，钱当天到账，交接栏签的是你的编号。第二天她照常坐在售票亭里，只是不再抬头看你，桌上那杯凉茶的水少了一指。' },
        { label: '把单子推回去，不接', relation: -1, run: { intel: 1, track: { sin: -1 } },
           after: '你把单子推了回去，她收进内袋，什么也没说，把凉茶倒了重添一杯。此后她没有再约过你，那些缩写的意思你到现在也不知道。亭子那盏灯改成了自动的。' },
      ],
    },

    /* ---------------- 温仕成 · 引航票务掮客 · orbit ---------------- */
    {
      id: 'ws-1',
      npc: 'wen-shicheng',
      stage: 1,
      act: 1,
      district: 'orbit',
      title: '温仕成：一张不该有的票',
      text: '轨道港的候船厅里，广播每九十秒报一次登船号。温仕成把一张纸质票夹在指缝间，票面上印的出发日期是后天，可舱位号在今天的系统里已经存在。「这张票不该有。」他说，「但它已经过了闸机。我只想知道，是你们部门放的行，还是有人借了你的编制号。」',
      when: { minFolded: 1 },
      options: [
        { label: '把票收下，去查闸机记录', relation: 2, run: { intel: 3 }, flag: 'ws_took_ticket',
           after: '你查了那天的闸机日志，通行时间是六点零七分，用的是一张临时卡。温仕成把票收回去，说这条记录他自己再留一份。那张票后来没有上船，压在投诉台下面。' },
        { label: '让他自己走流程报备', relation: 0, run: { track: { loyalty: 1 } },
           after: '他第二天去报了备，流程走到第三道卡住，票被登记作废。候船厅的大屏照常滚字，他把你当熟客，见面只聊票的班次，再也不提那天的事。' },
        { label: '说这票跟我部门无关', relation: -1, run: { intel: 1 },
           after: '你说与部门无关，他把票折起来收进衣袋，说行，那我自己查。半个月后他查出一个编制号，那两个号在他的手写名单上排在一起，中间隔着一行。' },
      ],
    },
    {
      id: 'ws-2',
      npc: 'wen-shicheng',
      stage: 2,
      act: 2,
      district: 'orbit',
      title: '温仕成：名单在变长',
      text: '引航层的走廊结着一层薄冰，管道外壁挂了霜。温仕成蹲在消防柜前，借着工作灯抄一份名单，纸上有十七个名字，其中四个被划掉又写回。「改名单的人用的是你们部门的模板。」他把灯递给你，「三个月前九个，现在十七个。我不查底细，我只想活到下个月还能卖票。」',
      when: { minFolded: 5, minRel: 2 },
      options: [
        { label: '替他做一份备份名单', relation: 2, run: { intel: 3, chips: 1 }, flag: 'ws_backup',
           after: '你把十七个名字抄了一份，被划掉的四个也照着留着。他把备份塞进消防柜上面那格，说这一份不在他手里更保险。第二个月名单变成十九个，他没有再让你抄。' },
        { label: '劝他停手，先离港', relation: 1, run: { money: -40, track: { renown: 1 } },
           after: '他听了劝，把引航层的差事交出去，用两班船的时间离了港。名单留在管道夹缝里，后来谁也没有找到。候船厅那张投诉台的玻璃底下，一直压着一张没填完的纸。' },
        { label: '把名单收走，按流程上交', relation: -2, run: { money: 45, track: { loyalty: 2, sin: 1 } },
           after: '你把名单收走交了上去，钱走的是外部账。复核科顺着名单查了两个月，四个人被调岗。温仕成此后卖票更快了，收票找零一句多余的话也不说。' },
      ],
    },
    {
      id: 'ws-3',
      npc: 'wen-shicheng',
      stage: 3,
      act: 3,
      district: 'orbit',
      title: '温仕成：第十八行',
      text: '他在登船口截住你，手里还是那份手写名单，第十七行下面多出一行新的，墨迹还没干。写的是他自己的名字，舱位号空着，改动用的还是你们部门的模板。「今天早上进的系统。」他把纸撕成两半，一半塞给你，「票我不卖了，人我得走。你拿这半张，够不够换我上那班船。」',
      when: { minFolded: 9 },
      options: [
        { label: '用半张单换他上船', relation: 3, run: { intel: 4, track: { renown: 1, sin: 1 } }, flag: 'ws_sent_him_off',
           after: '你把半张单送到了该到的地方，当晚闸口放行了一次。他把背包提起来又放下，说这一班他先不走。第十八行被核成一个化名，他此后照旧在候船厅卖票，手写名单收进了内袋。' },
        { label: '把两半纸都交上去', relation: -2, run: { money: 55, track: { loyalty: 3 } }, flag: 'ws_handed_list',
           after: '你把两半纸都交了上去，他的第十八行被核实，登船被拦。第二天他照常来卖票，工牌没有收，只是不再看登船口。名单按十八行结了案，第十九行那一栏空着。' },
        { label: '不接单，让他自己走', relation: -1, run: { track: { sin: -1 } },
           after: '你没有接那半张纸。他攥着两半站在登船口，站到闸机红灯扫了好几遍，最后塞进了自己口袋。此后他照旧卖票，只是每天收工前会往登船口那头看一眼。' },
      ],
    },

    /* ---------------- 雨客 · 潮的接触人 · orbit ---------------- */
    {
      id: 'yk-1',
      npc: 'yu-ke',
      stage: 1,
      act: 1,
      district: 'orbit',
      title: '雨客：他来传的那句话',
      text: '轨道港的货运通道湿度常年七十往上，墙上挂着一层水珠，鞋底每一步都带响。雨客站在闸口外侧，穿着一件拧不干的雨衣，把一个密封袋按在胸口。他不是来递东西的，是来念话的：「潮说，穹顶第七接缝在响，已经响过三次。第三次，你能听见。」念完他没有立刻走，手指在袋子封口上按了两下，像在等一句别的话。你问他袋子里是什么，他说不归他管，他只负责把话带到，带完就空着手回去。',
      when: { minFolded: 2 },
      options: [
        { label: '先问他这一趟跑了多久', relation: 2, run: { intel: 2, track: { renown: 1 } }, flag: 'yk_asked_him',
           after: '他说两天，路上换过三次车，密封袋一直按在胸口。他把雨衣下摆拧了一把水，说这趟跑得不算远。你回去查过一趟车次，最后一班比他说的晚四十分钟。' },
        { label: '让他把密封袋交给你', relation: 0, run: { intel: 3, track: { sin: 1 } },
           after: '他把袋子递过来，说里面是什么他不管，交出去他就当没带过。袋口那两下按过的印子还在。三天后潮那边有人来问袋子的下落，问你的人没有报名字。' },
        { label: '说接缝的事不该你管', relation: -2, run: { track: { loyalty: 1 } },
           after: '你说不管，他没有再念话，转身走进湿度里。第三次响声的日期他也没有报。第二天接缝外侧多了一道路过留下的水痕，脚印朝着港区里面。' },
      ],
    },
    {
      id: 'yk-2',
      npc: 'yu-ke',
      stage: 2,
      act: 2,
      district: 'orbit',
      title: '雨客：他第一次说我要',
      text: '他在换乘站的长椅上等了两个多小时，雨衣没换，水在座位底下积成一小片。他先说完该传的话，说潮要你三天内回话，然后停了很久，才补上一句不属于传话的句子：「我有个妹妹在环带，工号被划进回收名单了。这句不是潮要我说的，是我自己要说。」',
      when: { minFolded: 5 },
      options: [
        { label: '答应替他查那个工号', relation: 3, run: { intel: 3, track: { sin: 1, renown: 1 } }, flag: 'yk_promised',
           after: '你去环带调了那个工号，还在册，排在回收名单的最后一位。你把结果告诉他时，他把雨衣上的水抹了一把，说这一句他自己记着。那件雨衣他后来换了一件，旧的一直没扔。' },
        { label: '说清你能帮的和不能帮的', relation: 1, run: { intel: 2 },
           after: '你把能碰的和碰不得的都讲了，他听完点头，把该传的话又念了一遍。他说这样也好，至少知道哪一步会断。临走时他把座位底下的水抹干，长椅让给了别人。' },
        { label: '回绝，让他只传话就好', relation: -2, run: { track: { loyalty: 1 } },
           after: '你说你只传话。他没有再提妹妹，把该念的那几句一字不差念完就走。那件雨衣此后每次出现都拧得比上次干。环带的回收名单你没有去查，那个工号还在册。' },
      ],
    },
    {
      id: 'yk-3',
      npc: 'yu-ke',
      stage: 3,
      act: 3,
      district: 'orbit',
      title: '雨客：雨衣里面的东西',
      text: '他把你叫到第七接缝外侧，风从缝里穿过来，那件雨衣被吹得鼓起来。他把密封袋打开了，里面是妹妹的工牌和一张手写条，都不是潮的东西。「潮让我骗你一次，我没做。」他说，「这两样留给你，上不上报随你。你不报，我明天就得消失；你报了，我就回不去了。」',
      when: { minFolded: 9 },
      options: [
        { label: '收下工牌，替他压住', relation: 3, run: { intel: 3, track: { sin: 2 } }, flag: 'yk_kept_him',
           after: '你把工牌和手写条一起收下，压在抽屉最里层。他把雨衣下摆拧干，说这一份往后不算潮的。此后他照旧传话，念完就走，一句多余的话也不说。' },
        { label: '上报，换他一条活路', relation: -1, run: { money: 50, track: { loyalty: 2, renown: -1 } }, flag: 'yk_reported_him',
           after: '你把两样东西交了上去，换了个不追究的口径。他第二天在换乘站等着，手里空着，只穿着一件湿雨衣。此后他照常传话，只是不再自己走进接缝。' },
        { label: '两样都不收，让他自己选', relation: 0, run: { intel: 1 },
           after: '你把两样都推回去，没有接。他把工牌塞回雨衣内袋，说那就当我没说过。他转身往港区里走，雨衣下摆甩出一串水。此后传话他只报潮的句子，别的什么也不多讲。' },
      ],
    },

    /* ---------------- 荀戒 · 环带巡检员 · ring ---------------- */
    {
      id: 'xj-1',
      npc: 'xun-jie',
      stage: 1,
      act: 1,
      district: 'ring',
      title: '荀戒：照着手册念',
      text: '环带维修层的长廊结着冰，走一步要踢一下脚尖的霜。荀戒举着手电逐格照焊缝，照完一格念一句：「第七段，编号 0417，无位移，无渗漏，结论合格。」念到中途他停住，把手电压低：「按规程，你不该在这一层。你可以解释，也可以现在离开，我不记。」',
      when: { minFolded: 1 },
      options: [
        { label: '解释自己是来查编号的', relation: 2, run: { intel: 3 }, flag: 'xj_explained',
           after: '你说了编号，他把手电压低，照了一下你的鞋底。他说这一层不该有人，但他没有记。当天巡检记录上那一段依旧是合格，一个字没有改。他合上本子，先把灯关了。' },
        { label: '递上证件，请他照章记录', relation: 1, run: { track: { loyalty: 1 } },
           after: '他接过证件看了一遍，照章在本子上记了一行，落款写的是他的编号。他说这样对谁都干净。此后你进环带，门禁都会多挂一行记录，谁也没有来清。' },
        { label: '不说话，转身离开', relation: 0, run: { intel: 1 },
           after: '你没有答，他也没有追。他照旧逐格照焊缝，念到第七段时停了一下。那本巡检本上当天没有多出任何一行字，只有编号 0417 后面画着一个很小的勾。' },
      ],
    },
    {
      id: 'xj-2',
      npc: 'xun-jie',
      stage: 2,
      act: 2,
      district: 'ring',
      title: '荀戒：对不上的那一格',
      text: '他把手电照在第三十一格焊缝上，那里有一道新痕，编号被磨掉了一半。「按本子，这一格三个月前就封过了。」他翻回上一页，又翻回来，来回翻了三遍，最后把手电关了，「照规程我该报异常。异常上报要停整段环带，停一天，下面三千人的水就断一天。你说我记哪一页。」',
      when: { minFolded: 5 },
      options: [
        { label: '让他按规程报，别自己扛', relation: 0, run: { track: { loyalty: 2, renown: -1 } },
           after: '他第二天报了异常，环带停了一天，下面三千人的配给水推迟了十二小时。异常记录归到他的编号底下，他照旧来巡检。那道新痕的编号被重新打了一遍，打在旁边半寸的地方。' },
        { label: '让他先瞒，你去查那道痕', relation: 2, run: { intel: 4, track: { sin: 1 } }, flag: 'xj_covered',
           after: '你去查那道痕，磨痕的走向是从里往外，工具留下的。他按你说的先瞒了，本子上那一格照旧写合格。半个月后复核科翻到这一页，他把话全揽在自己身上，没有提你。' },
        { label: '说这不是你该管的', relation: -1, run: { track: { loyalty: 1 } },
           after: '你说不该管，他点了下头，把手电关了。异常那次谁也没有上报。那道痕在第三十一格上留着，他此后每次经过都照一下，照完就往下走，不再停。' },
      ],
    },
    {
      id: 'xj-3',
      npc: 'xun-jie',
      stage: 3,
      act: 3,
      district: 'ring',
      title: '荀戒：他改了那一页',
      text: '巡检本摊在操作台上，第三十一格那一页被重新写过，墨色和前后页都不一样。荀戒站在旁边，手电没开。「我改了。」他说得很平，「他们查下来，是我一个人的事。你只要做一件事：告诉我那道痕是人磨的，还是冻裂的。你说哪样，我就认哪样，我不再问你第二遍。」',
      when: { minFolded: 9 },
      options: [
        { label: '替他把这道痕说成冻裂', relation: 3, run: { intel: 3, track: { sin: 2 } }, flag: 'xj_lied_for_him',
           after: '你说了冻裂，他当场在那一页补了两个字，补的墨色和前后一样。核查看过一遍就走了，第三十一格照旧算合格。他给你留了一小截铅笔头，说这一页是他三十年里改的第二回。' },
        { label: '如实说，是有人磨的', relation: -1, run: { intel: 4, track: { loyalty: 2, renown: -1 } }, flag: 'xj_told_truth',
           after: '你照实说了，他把本子合上，第二天照流程报了上去。第三十一格按异常处理，环带停水一天，他的工号后面挂了一条记录。他照旧来巡检，只是不再让你跟在后面。' },
        { label: '不答，让他自己去验', relation: 0, run: { intel: 2 },
           after: '你没有答，他自己把那一格拆开验了一遍。验出来的结论他写在本子背面，没有往上报。那一页的墨色后来渐渐和其他页一致了，谁也没有再提起。' },
      ],
    },

    /* ---------------- 萨尔 · 潮的拾荒者 · outside ---------------- */
    {
      id: 'se-1',
      npc: 'sa-er',
      stage: 1,
      act: 1,
      district: 'outside',
      title: '萨尔：穹顶外面的人',
      text: '穹顶外壳的水顺着缝隙往下滴，滴在一块拆到一半的义体上，把编号冲得看不清了。萨尔蹲在旁边，用一把断头螺丝刀刮线路板。你走近，她先把手里的东西塞进怀里，然后才看你：「里面的。四个人来过，三个要买我的件，一个要烧我的窝。」她伸出手：「你哪个。」',
      when: { minFolded: 2 },
      options: [
        { label: '蹲下，帮她拆那块板', relation: 2, run: { intel: 2, gear: 1 }, flag: 'se_helped',
           after: '你蹲下把板子接过来，她把断头螺丝刀往你手边挪了挪。拆到第三层编号牌露出来，她用指腹抹掉上面的水，说这一块留着。你走的时候她没有跟你道别，只把那块板翻过来码在了义体底下。' },
        { label: '说明你来问接缝的事', relation: 1, run: { intel: 3 },
           after: '你报了来意，她把螺丝刀收进怀里，说里面的人问过一次接缝，问完就再没来过。她指了接缝外沿的方位，说那边的冰比别处厚。你走之后她把窝口那两块帆布重新压了一遍。' },
        { label: '什么都不说，退回去', relation: -1, run: { track: { loyalty: 1 } },
           after: '你没有答她的话，退回去时鞋底带出一片水。她在后面喊了一声，问你是哪一个，你没有回头。那块拆到一半的义体第二天被搬走了，原处只剩下一圈水印。' },
      ],
    },
    {
      id: 'se-2',
      npc: 'sa-er',
      stage: 2,
      act: 2,
      district: 'outside',
      title: '萨尔：她把泵让给你',
      text: '她的窝被撬了，义体零件散了一地，编号牌全不见了。萨尔坐在门口，小腿肿着，没让人扶。她把一支还能用的滤水泵推到你脚边：「潮里泡过的东西，喝了不干净。」她说得很短，像每个字都要省着用，「你拿这个。换你帮我查一件事，谁把编号牌收走的。」',
      when: { minFolded: 5 },
      options: [
        { label: '接下泵，答应替她查', relation: 3, run: { gear: 1, intel: 2, track: { sin: 1 } }, flag: 'se_deal',
           after: '你把泵接了下来，泵壳上的划痕朝着你这一侧。她报了一个编号牌的样子，说收回牌子的人只收编号，不收别的。第三天你查到收回点在下层，牌子已经进了打包箱，箱子封条上盖的是回收场的章。' },
        { label: '不收泵，只答应查编号牌', relation: 2, run: { intel: 3, track: { renown: 1 } },
           after: '你没有接泵，只把编号的事认了下来。她想了想，把泵放回脚边，说那就这么定。编号牌后来查出来了去向，是回收场那批货，她听完没有再去要，只把泵上的划痕又数了一遍。' },
        { label: '说外面的事你插不了手', relation: -2, run: { track: { loyalty: 1 } },
           after: '你说插不了手，她把泵收回怀里，说那就当我没提过。那批编号牌最后按失物处理，她此后再没有约你出过穹顶侧门。她窝口那两块帆布一直没换，颜色比别的都深。' },
      ],
    },
    {
      id: 'se-3',
      npc: 'sa-er',
      stage: 3,
      act: 3,
      district: 'outside',
      title: '萨尔：她第一次让你往里走',
      text: '她带你到穹顶正下方一间没有窗的屋子，地上摆着十几块编号牌，都是从义体上拆下来的。她把滤水泵放回你手里，泵壳上多了几道新划痕。「这块是你部门发出去的。」她指着一块牌子，「你现在有两条路：带走它去交差，或者把它留下，帮我记这十几个人原来叫什么。」',
      when: { minFolded: 9 },
      options: [
        { label: '留下，帮她记下名字', relation: 3, run: { intel: 3, track: { renown: 2, sin: 1 } }, flag: 'se_stayed',
           after: '你留了下来，把十几块牌子上的编号一个一个念给她听，她念一个人的名字就往地上按一下。记到第九个她停了一次，说这一块记岔了。那天你出门时她已经把牌子按顺序码成了两摞。' },
        { label: '带牌子走，按流程上报', relation: -2, run: { money: 55, track: { loyalty: 2 } }, flag: 'se_took_plate',
           after: '你把其中一块带走上报，流程走了两周，最后写成失物登记，编号后面补了归宿栏。她第二个月照常在穹顶外等你，脚边那两摞牌子少了一块，空印子还留着。' },
        { label: '把泵还她，谁也不欠谁', relation: -1, run: { track: { sin: -1 } },
           after: '你把泵还了回去，她没有接，说拿着吧。你放在脚边就走了，走出去两百步回头看，她还站在原地。那块泵后来跟着她搬到了别处，泵壳上的划痕一直没补。' },
      ],
    },

    /* ---------------- 班头 · 回收场领班 · salvage ---------------- */
    {
      id: 'bt-1',
      npc: 'ban-tou',
      stage: 1,
      act: 1,
      district: 'salvage',
      title: '班头：传送带上的那条手臂',
      text: '回收场的传送带一直响，制冷机把仓房压到零下。班头戴着一副磨白的皮手套，从带子上拎起一条拆到一半的义体手臂，翻过来看编号，又放回去。「这个月第三十二条。」他冲你抬了抬下巴，「你们部门的单子写的是拆干净，可这条手臂的接管还是热的。你说我照单办，还是照人办。」',
      when: { minFolded: 1 },
      options: [
        { label: '让他照人办，先别拆', relation: 2, run: { intel: 2, track: { sin: 1 } }, flag: 'bt_kept_arm',
           after: '他照你说的把手套停了，手臂单独放进一只木箱，木箱挪去值班室。当天那批单子进度掉了三成。他把编号抄在一张纸上压进抽屉，说这纸上的人名得等他查清。' },
        { label: '照单办，把编号登记清楚', relation: 1, run: { track: { loyalty: 1 } },
           after: '他按单子拆了，编号登记得很清楚，拆下来的接管另放一格，写的是留存待验。这单事后被稽查科抽走核过一遍，没有挑出毛病。他戴上手套接着干，没有再问过别的话。' },
        { label: '说活人不归你管，照单走', relation: -1, run: { track: { loyalty: 1, sin: 1 } },
           after: '你说这不是你能管的，他没有再问。那条手臂当天下午进了熔炉，交接单上签的是他的编号。他此后见到你来场里，会先把传送带的开关拨慢一格。' },
      ],
    },
    {
      id: 'bt-2',
      npc: 'ban-tou',
      stage: 2,
      act: 2,
      district: 'salvage',
      title: '班头：抽屉里的接管',
      text: '他把你领进值班室，拉开最下面那层抽屉：一支接管、一块编号牌、一张手写单，字是别人写的，签收栏空着。「这条手臂的主人还活着，在环带排队等排班。我把它拆下来的时候，接管还是温的。」他把手套摘了放在桌上，「巡检昨天来问过一次。你要想撇清，现在就可以走。」',
      when: { minFolded: 5, minRel: 2 },
      options: [
        { label: '替他把接管登记成报废件', relation: 3, run: { intel: 3, track: { sin: 2 } }, flag: 'bt_faked_scrap',
           after: '你替他把接管登记成报废件，编号空着，签收栏填了设备损耗。巡检来看过一次台账就走了。那只接管后来一直缩在抽屉最里面，他换了几副手套都没扔。' },
        { label: '劝他把东西交出去止损', relation: 0, run: { track: { loyalty: 2, renown: -1 } },
           after: '你劝他交，他拖了两天，最后还是把接管送进了台账。巡检那边按主动上报处理，只记了一次警告。他此后不再把抽屉拉开给你看，值班室的灯换成了节能的。' },
        { label: '说不掺和，转身就走', relation: -2, run: { intel: 1 },
           after: '你转身就走，他在后面把抽屉推回原位，没有再说话。巡检半个月后来问了一次，他把远的事都揽在自己身上。此后那间值班室的门上班时间一直半开着。' },
      ],
    },
    {
      id: 'bt-3',
      npc: 'ban-tou',
      stage: 3,
      act: 3,
      district: 'salvage',
      title: '班头：传送带停了',
      text: '传送带停了，场里安静得能听见管道里过水的声响。班头那副皮手套塞在抽屉边上，抽屉开着，接管还在原位。他说巡检今早拿走了设备日志，明天要跟编号比对。「我不求你保我，求你保这条。」他把接管推到你面前，「主人在环带，工号写在纸上。你把它还回去，怎么算账随你。」',
      when: { minFolded: 9 },
      options: [
        { label: '接下接管，答应还人', relation: 3, run: { intel: 3, track: { renown: 2, sin: 1 } }, flag: 'bt_returned_arm',
           after: '你把手接了下来，记清了纸上的工号。三天后你托环带的人把东西转过去，那人还在等排班。班头没有问你办了没有，只在交接单上把那一页翻了过去。' },
        { label: '把接管上交，换他免罚', relation: -1, run: { money: 50, track: { loyalty: 2 } }, flag: 'bt_handed_in',
           after: '你把东西交上去，巡检按主动上报处理，他记了警告没有调岗，钱是走你的账出去的。他此后见到你只聊货，不聊箱子，值班室那副皮手套换成了新的。' },
        { label: '不接，让他自己交', relation: -2, run: { intel: 1, track: { sin: -1 } },
           after: '你没有接，他自己写了份说明交上去，写明留存待验。处理下来记了一次警告，他留在线上，手套没换。值班室的抽屉他此后不再当着人拉开。' },
      ],
    },

    /* ---------------- 无面 · 记忆银行柜员 · memory ---------------- */
    {
      id: 'wm-1',
      npc: 'wu-mian',
      stage: 1,
      act: 1,
      district: 'memory',
      title: '无面：取号三十七',
      text: '记忆银行的柜台是冷的，玻璃后面只亮着一盏斜面灯。无面接过你的号单，读了上面的编号，又读了一遍。「三十七号，登记用途是企业核查。」它把单子翻过来，在背面写了一行字，推回给你，「这行不属于本次核查，无面只是照着抄的。你来的时候，门口是不是有人在等你。」',
      when: { minFolded: 2 },
      options: [
        { label: '承认门口是有人等过', relation: 2, run: { intel: 3 }, flag: 'wm_admitted',
           after: '你承认门口有人等过，它把号单翻回正面，在用途栏旁边补了一行很小的字。核查到第三项它停了停，说这一项不用写进去。你出门时门口那排椅子上已经换了一个人。' },
        { label: '反问它抄的是谁的档案', relation: 1, run: { intel: 3, track: { sin: 1 } },
           after: '它说是照着号单背面抄的，抄的时候并没有调档。它把单子推回给你，说这一行不属于本次核查，算它自己多写的。你走的时候它把那盏斜面灯挪了一寸，光照到了柜台边上。' },
        { label: '说没有，把单子推回去', relation: -1, run: { track: { loyalty: 1 } },
           after: '你说没有，它把单子接过去归档，归档栏写着无附加信息。核查当天结束，柜台的灯按时关了一半。你第二次去的时候号单上已经换了一串号码，不是三十七。' },
      ],
    },
    {
      id: 'wm-2',
      npc: 'wu-mian',
      stage: 2,
      act: 2,
      district: 'memory',
      title: '无面：不属于它的一段',
      text: '它把调阅记录摊在柜台上，最上面是你上次那张单子背面那行字的影印件。「无面归档时发现一段记忆，归属人是三十七号。」它说这句话时用了第三人称，「但那段记忆里的手不是无面的手，温度也不对。柜员没有温度。」它抬起头，「你能不能替无面看一眼，那段记忆里站在门口的人，是不是你。」',
      when: { minFolded: 5, minRel: 2 },
      options: [
        { label: '承认那段记忆里是自己', relation: 2, run: { intel: 4, track: { sin: 1 } }, flag: 'wm_confirmed',
           after: '你承认了，它把影印件收进抽屉，说这段记忆的归属就算核对完了。它没有追问手和温度的事，只把调阅记录往前翻了一页。柜台上那杯水它一口没动，一直放到下班。' },
        { label: '要求调出完整档案', relation: 1, run: { intel: 4, track: { loyalty: -1 } },
           after: '完整档案调了出来，中间缺了一页，缺的那页编号连着三十七号。它把复印件给你，说这一份不进柜台留存。此后你去记忆银行调阅，系统里都会多挂一条复核标记。' },
        { label: '说柜员的事与你无关', relation: -1, run: { track: { loyalty: 1 } },
           after: '你说与你无关，它把记录收回抽屉，说那就按无附加处理。核查照常结束，它重新坐回柜台后面读号、翻单、盖章。你此后再去，它只念号，不再多写一个字。' },
      ],
    },
    {
      id: 'wm-3',
      npc: 'wu-mian',
      stage: 3,
      act: 3,
      district: 'memory',
      title: '无面：它要把它取出来',
      text: '斜面灯坏了一格，柜台暗下去半边。无面把一段记忆的编号写在一张手写单上推过来：「三十七号。归属人写着无面，可无面不记得存过。」它停了一下，「按规程，不属于柜员的记忆要当场抹除；按无面想做的，是把它取出来交给你。你替它选一个，无面不问理由，也不留记录。」',
      when: { minFolded: 9 },
      options: [
        { label: '让它取出来，你带走', relation: 3, run: { intel: 4, track: { sin: 2, renown: 1 } }, flag: 'wm_extracted',
           after: '它把那段记忆取了出来，交到你手上，载体只有一张薄片。它说按规程这一件该抹，抹不抹它自己认。当天收柜前它照旧把号单排齐，只把那一格重新编了一次号。' },
        { label: '让它按规程当场抹除', relation: -2, run: { track: { loyalty: 3 } }, flag: 'wm_erased',
           after: '它当着你的面按了抹除，一格一格走完，屏幕上看不出动过。它说这样最省事，柜台还是柜台。此后它读号翻单照旧，只是不再用第三人称说自己。' },
        { label: '不替它选，让它自己定', relation: 1, run: { intel: 2, track: { sin: -1 } },
           after: '你没有替它选，它把单子扣在灯下坐了很久，最后收进了抽屉。第二天它照旧当班，只是开始自己留一份流水抄本，抄得很慢。那盏坏的斜面灯还是没换。' },
      ],
    },
  ];
})();

/* ===== game/story-npc-a2.js ===== */
/* NPC 个人支线 A 组·续：每人新增三幕（第 4-6 幕）。 */
(function () {
  'use strict';

  window.STORY_NPC_A2 = [

    /* ============ 闻铎 · 董事会监事 · 高塔商业区 ============ */
    {
      id: 'wd-4',
      npc: 'wen-duo',
      stage: 4,
      act: 3,
      district: 'tower',
      title: '闻铎：先写在登记栏上的名字',
      text: '茶室上个月改成了储物间，四十九层那扇门锁着，玻璃上还贴着当年那张「下午四点停供」的告示，边角翘起，被里面堆的纸箱顶住，纸箱上落着一层灰。闻铎把你约到楼梯间，从外套内侧掏出一只凉茶杯，杯口磕掉一块，正是三年前茶室里的那只，他一直留着，杯里那圈茶垢再也洗不掉。他把杯子搁在消防栓顶上，说旧案走到了第三轮核查，监事会这回点了名，要找一个还活着的经手人。你正要开口，他先递来一页影印件，是监事会公开目录的登记栏，联系人一栏写着你的编号，登记日期是上周三，比他第一次找你早了四天。「先写上，免得以后补。」他说这话时盯着楼梯灯的感应区，没看你。灯灭下去，两个人都没有出声。楼梯间的感应灯坏了三格，走到一半会突然黑下去。他说明天上午八点前给答复，逾期登记栏就当确认，谁也不用再来补签字。他把影印件折成四折塞进你口袋，折痕压得很实。',
      when: { minFolded: 7 },
      options: [
        { label: '问他凭什么先写我的名字', relation: 1, run: { intel: 3, track: { loyalty: -1 } },
          after: '你把问题问出口。他停了很久才答，登记是上周三定的，那时候他还没决定要不要找你。楼梯灯又亮了一格，照见杯子里那圈很深的茶垢。他补了一句：写上去的名字能撤，可撤一次要留一次痕，你手上已经有痕了。他说完低头看了一眼杯子，想喝又没喝。你下楼时他站在楼梯口没动，灯在他身后一格一格灭掉。' },
        { label: '认下登记栏，跟他一起做证人', relation: 2, run: { intel: 2, track: { power: 1, sin: 1 } },
          after: '你说认下。他点头，把凉茶杯收进口袋，杯口朝下，剩的那点水顺着裤缝淌了一线。他说明天的流程要你到场，签字就行。下楼时他一直走在你右边，楼梯间的灯一盏盏跟着脚步灭掉，到最后一层他先出去了。' },
        { label: '要求现在就把我的名字撤下来', relation: -2, run: { track: { loyalty: 2 } },
          after: '你说现在就撤。他没拦，把杯子从消防栓上拿下来倒扣在台阶上，水从杯沿滴到下一层，一滴一滴，滴了很久。他说撤一件要写两份说明，一份交监事会，一份交给他，两份都得你自己手写，不能代签，写了才算数。' },
      ],
    },
    {
      id: 'wd-5',
      npc: 'wen-duo',
      stage: 5,
      act: 4,
      district: 'tower',
      title: '闻铎：一份要你署名的证词',
      text: '这一周雨一直没停，监事会楼下的台阶积了半指深的水，鞋踩进去会响。闻铎约你在负一层车库见面，他靠在承重柱上，手里还捏着那只磕了口的凉茶杯，杯里晃着半杯自动售货机的热水，热气遇上冷空气就散了。他说第三轮核查要出书面证词，证人一栏他填了自己，第二栏空着，他要你填。填了，你就是那晚在三十三层的经手人，罪痕那一栏从今往后跟着你走；不填，他一个人扛，扛不过他认。车库入口的卷帘门升起又落下，一辆车开出去，尾灯把墙照亮一下又黑下去。他把笔递过来，笔帽是新的，笔身还是那支旧的，笔杆上留着一道被咬过的印子。他把笔在指间转了一圈，笔杆上那道牙印转了半圈又回来。证词一旦进第三轮，后面每份材料都要写经手人，写一个补一个，补到谁也说不清为止。车库顶上的灯管闪了两下，他的影子在承重柱上晃了晃。',
      when: { minFolded: 10 },
      options: [
        { label: '署名作证，跟他一起扛', relation: 2, run: { intel: 3, track: { loyalty: -1, sin: 1 } },
          after: '你签了。他把两份证词对齐，用杯底压住纸角，说材料明天进第三轮，进了第三轮就没有回头路。出车库时雨小了一些，他走在前面半步，一直没回头。你的公寓楼下当晚多了一辆没挂牌的车，停到天亮才走。他送你到卷帘门下面，抬手扶了一下门，没让你伸手。雨声隔着铁皮传进来，闷闷的。' },
        { label: '不署名，出钱替他另找证人', relation: -1, run: { money: 55, track: { loyalty: 1 } },
          after: '你说人不去，钱我来出。他收下那笔钱，第二天找了个退休的档案员签字，签在证人那栏。核查过关，他的编号干干净净，那个档案员的编号底下多了一条记录。他把新笔帽留给了你，笔身他带走了，说旧东西还是自己拿着。' },
        { label: '拒绝，把这件事先报给日程官', relation: -2, run: { track: { loyalty: 2, power: 1 } },
          after: '你没签，转身把证词的事报给了苏纹。第二天闻铎被叫去谈话，出来时在走廊上碰见你，只点了一下头，没有停步。他把那只凉茶杯留在了车库的承重柱上，谁也没去拿，直到物业清场，杯子后来被人挪到了柱子底下。' },
      ],
    },
    {
      id: 'wd-6',
      npc: 'wen-duo',
      stage: 6,
      act: 5,
      district: 'tower',
      title: '闻铎：听证会上念出的编号',
      text: '听证那天雨停了，监事会圆厅的空调开得过低，桌上每人一只纸杯，只有闻铎那只是他从口袋里掏出来的旧凉茶杯。他先陈述，讲了四十分钟，把 J-1147 的每一道流程一个个念过去，念到最后才提到经手人。他念出你的编号时，语速和念别的编号一模一样，没有停顿，也没有看你。念完他把杯子推到桌子中间，杯壁的水痕在灯下亮了一道。休会前主持人问材料里还有没有补充，他一只手按在那只杯子上，指节发白，停了三秒才开口，整个圆厅都在等他那句话。窗外高架上的车灯一盏一盏过去，照在圆厅的玻璃上，又滑下去。他念完之后翻到下一页，像是刚才那几句只是目录里的一行。圆厅外有人推门进来又退出去，门轴响了一声，全场没有人回头。他把那只杯子往自己这边挪了半寸，杯底在桌面上磨出一条浅白的弧线，正好停在材料边缘，谁也没去碰它。',
      when: { minFolded: 11 },
      options: [
        { label: '站起来补一句，替他把话说完', relation: 3, run: { intel: 3, track: { power: 2, sin: 1 } },
          after: '你站起来把话接下去，从三十三层那晚说到签名页，主持人记了两页。他始终按着那只杯子，直到你说完才把手松开。散会时他把杯子留在了桌上，说从今天起它不归他了，归谁他没说。散会的人从他身边走过去，他一直坐着，等人走空了才把纸杯收进兜里，只带走了旧杯子。' },
        { label: '沉默，只答他念的那个编号', relation: -2, run: { track: { loyalty: 2, renown: -1 } },
          after: '你什么也没补，只在问到时答了编号。结论当天出，责任分摊，你的名字排在第二行。他走出圆厅时把杯子拿走了，走到门口又停下等你，你没跟上去，他自己进了电梯，电梯下行了两层。第二天早上你桌上多了一份复印的材料，扉页上那个编号被人用铅笔圈过一次，圈得很轻。' },
        { label: '提前把复印件交给对面的人', relation: 0, run: { money: 50, track: { sin: 2, renown: -1 } },
          after: '你早一步把复印件递到了对面。听证到一半有人提出新证据，流程被打断，第十九条被翻出来重读了一遍。闻铎听完什么也没说，散会后在门口站了很久，杯子一直握在手里没喝，水都凉透了。对面的人当天就把复印件收走，之后再没提过这件事，也再没找过你，像这件事从来不存在。' },
      ],
    },

    /* ============ 苏纹 · 董事会日程官 · 高塔商业区 ============ */
    {
      id: 'sw-4',
      npc: 'su-wen',
      stage: 4,
      act: 3,
      district: 'tower',
      title: '苏纹：她第一次开口求人',
      text: '排期系统上周做了一次权限回收，苏纹的编辑权限被压到只读，她那张表现在每改一格都要走流程，改完还要等复核科盖章。周四夜里你从三十七层出来，她在楼梯口等你，怀里抱着表册，最上面那页折着角，折角上有一枚浅浅的指印。她说这是她第一次开口求人：下周二上午十点那一格，本来排着一个姓江的人，她要你换掉，换成她自己。理由她只说了一半，那人上周被点了名，名字进了回收名单，她只是想让他多活七天。她说这话时右手一直捏着那支铅笔，就是上次折成两截的那一支，接缝缠了一圈胶带。说完她又补一句：她替别人改过十一次，今天才是第一回求人。她把表册翻开又合上，动作很轻，像怕翻出别的名字。楼上传来电梯停靠的提示音，响了两下就没了。她说这一次她不要回报，只求你别问那个人为什么会被点名，问了也改不过来。',
      when: { minFolded: 8 },
      options: [
        { label: '替她换掉那一格', relation: 2, run: { intel: 2, track: { power: 1, sin: 1 } },
          after: '你去把那一格换了，系统里只留了一条时区调整的备注。第二天上午十点，姓江的人出现了，坐在原不属于他的位置上点了杯茶，坐满四十分钟才走。苏纹在走廊那头站着没过来，等人走了才合上表册。她把那一页的折角抹平，抹了两次，又在旁边补了一格空的，谁也没提那格是留给谁的。' },
        { label: '问她那十一次都改了谁', relation: 1, run: { intel: 4, track: { loyalty: -1 } },
          after: '她翻到表册中间，把十一次的日期一个个念给你听，念到第七次停住了，那一次改的是她自己的名字。她把表册抱紧，胶带缠着的铅笔从册子缝里露出一节。她说第七次以后她再没替自己改过，一次也没有。她把表册抱在怀里往楼上走，走到一半回头看了你一眼，什么也没说，像是要把这一眼记下来。' },
        { label: '不办，让她自己走流程', relation: -2, run: { track: { loyalty: 2 } },
          after: '你说走流程。她站了几秒，把表册抱得更紧，转身下楼，鞋跟踩在台阶上一格一格响。第二天她的编辑权限降到最低一档，表册换了人抱。楼道灯还亮着，那页折角一直在最上面，没人去碰它，谁也没敢动。' },
      ],
    },
    {
      id: 'sw-5',
      npc: 'su-wen',
      stage: 5,
      act: 4,
      district: 'tower',
      title: '苏纹：这次的痕迹挂在谁名下',
      text: '那次改动在系统里留了痕。周五下午，四十七层的表被调去复核，苏纹把复核单拿给你看：操作记录里署的是你的工号，改掉的却是她表册里的一格，两个时间戳只差两分钟。她说可以当场申诉，申诉就得交出那本表册，册子里有十一次改动，一条都不干净，条条都查得到人。电梯口的灯亮着，她站在灯下等你决定，灯管一响她就抬一下头。她说还有第二个办法：你认下这次操作，写一份说明，她把说明压进内部件，年末清档时一起消掉。她把表册抱得很紧，手指压在那页折角上，胶带缠着的铅笔夹在册子中间，露出一小截笔尖。她把复核单从册子缝里抽出来递给你，纸角压得很平。她说内部件每年清一次，清档那天她会在场，别人不在。走廊尽头的电梯响了一声，她立刻把表册翻到最上面那页盖上，像是那声音会看册子。',
      when: { minFolded: 10 },
      options: [
        { label: '认下操作记录，写说明', relation: 3, run: { intel: 2, track: { sin: 1, loyalty: -1 } },
          after: '你把说明写完交上去，落款用的是自己的工号。三天后复核单结案，结论一栏写着操作失误已说明。她来道谢时只把表册放在你桌角，翻开的那页折角被抹平了，铅笔还在，胶带换了新的一圈。她走的时候把册子压在键盘底下，只露出封面那一角，谁翻都得先动键盘，动了就会留痕。' },
        { label: '让她申诉，交出整本表册', relation: -2, run: { track: { loyalty: 2, renown: 1 } },
          after: '她第二天就交了表册。复核科把十一次改动逐条列出，最上面一条挂在她自己的权限编号底下。第三天她抱着空表册回四十七层，走廊灯只亮一半，她把表册锁进抽屉，钥匙交给了值班的。她下班前把抽屉钥匙又借回来一次，打开看了看那本空册子，合上，再锁回去，什么也没带走。' },
        { label: '认下，但要她先付价', relation: 0, run: { money: 60, track: { sin: 1, power: 1 } },
          after: '你说认，先付价。她答应了，钱走的是外部账，说明上写的还是你的工号，一个字没改。从那以后她每次来找你都先看一眼电梯指示灯，确认走廊上没人再开口。表册那页折角一直没动。清档那天她把那页折角抚平，用的是手指，没有再用铅笔，抚完就合上册子出了门。' },
      ],
    },
    {
      id: 'sw-6',
      npc: 'su-wen',
      stage: 6,
      act: 5,
      district: 'tower',
      title: '苏纹：清档记录上的最后一个名字',
      text: '年末清档那天高塔暖气检修，四十七层只有应急灯亮着，走廊看上去比平时短了一截。苏纹把那本表册摊在键盘上，翻到最后一页，原先记的十一次改动全被划掉，只剩一行新字，写得比她的字慢，像是想了很久：本次清档经手人，后面空着，空出一行半的位置。她说她可以签自己，把整本册子带走；也可以签你，把你写进清档记录，让这件事跟你一起转进下一年。她把那支铅笔从册子里抽出来，胶带那一圈已经磨开，笔尖断掉一小截，露出里面的木芯。她说这一次她不动笔，等你选。窗外高架上的车灯一盏盏过去，照得表册封面亮一下又暗下去。她用笔尖在那行空白上虚虚地划了一道，没有留下印子。她说清档记录只存一份，存进去就跟着走，跟着谁谁就得在下一年第一个月来签一次到。暖气管道里响了一阵，四十七层的灯跟着亮了一格，照见表册封面那道旧折痕。',
      when: { minFolded: 12 },
      options: [
        { label: '让她签自己，把册子带走', relation: 3, run: { intel: 3, track: { renown: 1, power: 1 } },
          after: '她签了自己的名字，抽出整本册子夹在腋下，出门时在灯下停了停，把铅笔丢进了楼道口的回收桶。清档记录里那一行是她的编号，你的名字从头到尾没出现。第二天她的工位空了，桌上只留一副耳机。那副耳机你后来在别人的工位上见过一次，摆的位置和原来一模一样，谁也没有认领的意思。' },
        { label: '签我，这件事我来背', relation: 2, run: { track: { sin: 1, loyalty: 1, power: 1 } },
          after: '你签了，她坐在旁边看笔尖落到最后一笔。清档记录跟着你转进下一年，你的编号在第一页第一行。她把铅笔留在你桌上，断了的那一小截自己收走，说留着当个记号，以后认得出来是谁的。年末清档名单上第一行是你的编号，第二行是日期。她签字那一栏还留着，一直空着。' },
        { label: '把表册交去复核科', relation: -2, run: { track: { loyalty: 2, power: -1 } },
          after: '你把册子交去复核科。当天封存，十一次改动逐条重查，从中查出三条超出权限。苏纹第二天照常来上班，把工牌放在桌上，谁问什么都答按流程。表册最后一页贴上封条，那一行空着。封条上盖的是复核科的章，日期是当天。她第二天来的时候看了一眼封条，什么也没说。' },
      ],
    },

    /* ============ 郁南枝 · 清算行首席 · 交易所广场 ============ */
    {
      id: 'yn-4',
      npc: 'yu-nanzhi',
      stage: 4,
      act: 3,
      district: 'exchange',
      title: '郁南枝：关联人那一栏',
      text: '上个月注销的那笔坏账被复核科翻出来了，卷宗编号后面多了一行小字：关联人。郁南枝约你在交易所广场底下的清算库房见面，那地方常年十六度，纸发脆，碰一下就有细屑掉下来，落在袖口上像灰。她把第一卷摊开，关联人一栏写着她的姓，关系栏写着直系。她说这笔账三年前她主动报过一次，报完就在归档室躺了两年，今年突然被人借出去，借阅栏上是空的，归还日期也没有。她说她父亲已经在回收场躺了六年，账却还活着，活着的账比人难下葬。库房最里面那台除湿机响了一阵，她自己伸手把卷宗合上，合得很快，像怕你多看一行。她把卷宗推回来的时候，拇指一直按在关联人那一栏上，按出一小片汗印。她说复核科这半年翻过三次旧账，翻一次动一个人，前两次翻的是别人，这一次翻到了她父亲的姓。库房的门缝里透进来一道走廊的光，正好落在那一行小字上。',
      when: { minFolded: 7 },
      options: [
        { label: '帮她把借阅记录查出来', relation: 2, run: { intel: 3, track: { loyalty: -1 } },
          after: '借阅记录查出来了，签名一栏空着，日期在四个月前，归还时间没有。她抄在便签上，塞进卷宗夹层。除湿机又响了一阵，她等它停才说话：借走的人还在楼里，楼层比清算行高，高两层。她把便签从卷宗夹层里又摸出来看了一遍，看完塞回去，塞得比刚才更深一格。' },
        { label: '劝她把关联如实上报', relation: -1, run: { track: { loyalty: 2, renown: 1 } },
          after: '她第二天把关联人那行圈出来递了上去，结论是关联属实待处理。名单没变，她的名字却从第九位挪到了第六位，理由栏多了半行字。她把那张软了的旧清算单压回抽屉，说这算是她第一次不自己扛。名单调整的通知下来那天，她把自己的抽屉清了一遍，只留一支铅笔和那枚回形针。' },
        { label: '抽走卷宗里的一页', relation: 0, run: { money: 50, track: { sin: 2 } },
          after: '你抽走一页，卷宗里留了一道裁口。她看见了，没吭声，只把剩下的部分按页码码齐。那页上有她父亲的一段手写备注，归了你。她后来补一句，那页她抄过三份，都放在别处，别人拿不走。她把卷宗交还归档室时在借阅单上签了字，签得比平时慢，落款那一笔压得很重。' },
      ],
    },
    {
      id: 'yn-5',
      npc: 'yu-nanzhi',
      stage: 5,
      act: 4,
      district: 'exchange',
      title: '郁南枝：名单上的第九个名字',
      text: '清算行周三发了一份内部名单，十九个人，排在第九的是郁南枝，理由栏只有四个字：关联未清。她把你叫到凌晨的清算室，只剩一台终端亮着，屏幕上正是那份名单，光标停在第九行一闪一闪。她说她只有两个晚上：要么把父亲的旧账彻底核销，把关联人抹平；要么收拾东西，等回收组上门，回收组从来只在清早上门。她把夹着回形针的旧清算单抽出来，纸角已经软了，就是第一次见面那张。她把铅笔放在桌上，笔尖朝着你，说核销要两个签名，一个签名是伪造，另一个是共谋。她没有催你，只把那枚回形针从单子上取下来，又别了回去。她把终端转过来给你看清第九行的编号，那串数字和你部门的差两位。她说清算行内部名单只管到下个月三号，三号之后名单会重排一次，重排时谁在上面谁在下面由别人定。她把回形针在指腹上压了一下，针脚弹开又合上。',
      when: { minFolded: 10 },
      options: [
        { label: '陪她核销，签第二个名字', relation: 3, run: { money: 55, track: { sin: 2, power: 1 } },
          after: '你签了。两个名字落下的时候，终端上的名单刷新了一次，第九位换成了别人，理由栏也跟着换了。她把回形针从旧清算单上取下来，别在调整单第一页，说这个留着以后用得着。凌晨四点，清算行的门从外面锁上了。你们从侧门出去的时候天刚亮，广场上的清扫车正在转圈，谁也没有回头看那栋楼。' },
        { label: '拒绝，劝她走正当申诉', relation: -2, run: { track: { loyalty: 2, renown: 1 } },
          after: '她说那她走申诉。三天后申诉驳回，理由一栏仍写着关联未清。回收组上门那天你只在场外，看见她拎着一只纸袋从侧门出来，袋口露出那枚回形针，压着一张核销单，走得很慢，一直没有抬头。她经过你身边时把回形针从纸袋里取出来放在台阶上，什么也没说，也没有回头。' },
        { label: '只把名单顺序改掉', relation: 0, run: { intel: 2, track: { sin: 1 } },
          after: '你只改了顺序。第二天名单第九位换成另一个人，那人下午来过清算行门口，站了一会儿没进来，抽完半支烟就走了。郁南枝把回形针别在名单复印件上给你，说这一份你收好，用得上时别装不认得，认得出来就拿出来。' },
      ],
    },
    {
      id: 'yn-6',
      npc: 'yu-nanzhi',
      stage: 6,
      act: 5,
      district: 'exchange',
      title: '郁南枝：金额栏留给你填',
      text: '回收组给的期限是周五八点。周四深夜，郁南枝把一份调整单压在清算桌上，金额栏空着，她说数字让你填，填多少都行，只要能压住关联人那一栏。她自己已经签了第一个名字，笔迹抖得不像她，最后一笔拖出去一条细线。桌角压着那枚回形针和那张已经软透的旧清算单，单子上她父亲的姓氏被铅笔涂淡过，只剩一点灰。她说还有第三条路：她今天下班前把自己的名字主动报进清算名单，走正当核销，账留着，人进去。说完她就不说话了，把铅笔推到你手边。清算室外面的走廊灯一格一格亮过去，脚步声停在门口，没有再往前。她说调整单只要递进去，复核科不会逐笔核对，只核金额和签名。金额栏空着不交，二十四小时后单子自动作废，作废的单子会留档，留档的单子上有她的名字。她把铅笔在桌面上转了个方向，笔尾朝你，笔尖朝着她自己。',
      when: { minFolded: 12 },
      options: [
        { label: '替她填数字，做下这笔账', relation: 3, run: { money: 70, track: { sin: 2, power: 1 } },
          after: '数字你填了。调整单递上去，关联人那栏被压平，名单上第九位没了。她把回形针别在你的文件夹上，说这一笔从此挂在两个名字底下。走廊那盏灯灭了，脚步声也退了，退到楼梯口就不响了。第二天名单重排，第九位换人，换上的那个下午就递了辞呈，谁也没拦。' },
        { label: '撕掉调整单，报她的名字核销', relation: -2, run: { track: { loyalty: 2, sin: -1 } },
          after: '你把单子撕了，替她报了名字。核销走正当流程，账留着，人进去了。她走之前把那张旧清算单给你，上面她父亲的姓氏被她用铅笔轻轻涂淡，只剩一点灰，擦不掉也看不清。她进去那天你站在广场对面，看见清算行的门开了一次又关上，之后再没有开过。' },
        { label: '单子留下，人先走', relation: 1, run: { intel: 3, track: { sin: 1, renown: -1 } },
          after: '你没签也没撕，把单子留在桌上先走了。第二天调整单被人补上了数字，签名是她的，笔迹比前一天稳。她照常上班，只是不再叫你去清算室，见面都在走廊，说的也只剩流程上的话。那张调整单后来归档在清算行的旧柜里，柜门锁着，钥匙在复核科，谁也没再去开。' },
      ],
    },

    /* ============ 戴思远 · 合规伦理审查官 · 交易所广场 ============ */
    {
      id: 'ds-4',
      npc: 'dai-siyuan',
      stage: 4,
      act: 3,
      district: 'exchange',
      title: '戴思远：追责函上的七个签名位',
      text: '三年前那份合规例外终于被追责了。追责函是周五下午到的，合规处那半排灯还是黑的，坏了一个月没人报修，灯管上积了一层灰。戴思远把函件摊在你面前，上面列着七个签名位，只有一个是实的，其余六个空着，空位旁边都用铅笔点过一个小点。他说追责组要他在函件上补全经手链条：补全了，责任分摊到六个人头上，每人一份；不补，就全落他一个人，落在他那个编号上。他说话时手腕上那圈旧表带又断了一根线头，他把线头往表带里塞了两次，都没塞住。他问你那份授权书副本还在不在你手里，问得很慢，眼睛一直没抬。函件最后一页贴着追责组的收件回执，回执上的日期是当天下午五点前。他说五点之前补不全，追责组就按现状归档，归档之后这件事就归他一个人的编号，谁也别想再翻。他把袖口往下拽了拽，盖住表带断的那一节。',
      when: { minFolded: 8 },
      options: [
        { label: '承认副本还在，交给他', relation: 2, run: { intel: 3, track: { loyalty: -1, sin: 1 } },
          after: '你说副本在你手里。他愣了两秒，把表带往下拽了拽，说明天就交。第二天函件上的经手链补齐六个名字，你的排在第六位。他把表带换了根新的，旧的收进抽屉，压在一沓底稿最底下。他后来每次看表都会先摸一下新表带，摸两下就停手，像是确认它还在。' },
        { label: '坚持说副本早就不在了', relation: -1, run: { track: { loyalty: 1 } },
          after: '你咬定副本没了。他没追问，只把函件对折夹进底稿最上面。追责结论一周后下来，七个签名位只落实一个，责任全落在他编号上。他的座位搬去走廊尽头，那半排灯还是黑的，没人报修。他搬走那天把函件的复印件留在了原工位的抽屉里，抽屉没上锁，也没人来收。' },
        { label: '让他先查第七个签名是谁', relation: 1, run: { intel: 4, track: { sin: 1 } },
          after: '第三天他回来了，说第七个签名是三年前的临时工号，人早被回收，记录只剩一格空栏。他把这条写进函件，追责组暂时停手。他把红笔收回口袋，说这次是拖住了，不是了结，拖不了多久。他把那份追责函夹进旧底稿的最上层，说这批底稿再不借出去了，谁要都不借。' },
      ],
    },
    {
      id: 'ds-5',
      npc: 'dai-siyuan',
      stage: 5,
      act: 4,
      district: 'exchange',
      title: '戴思远：最后一个空着的签名位',
      text: '追责组只给三天。周三夜里，戴思远把你约进合规处那间没有窗的会议室，顶灯只剩一半亮，灯管偶尔响一声，响完要过很久才有回声。函件上的七个签名位已经填了六个，最后一个空着，落款线正对着你坐的那把椅子，椅面上有一道很旧的划痕。他说他不劝你，只说清代价：签下去，你的名字进事故链条，年底考核里会多一条；不签，他一个人兜，兜完以后他手上那本例外清单会被整本调走，那本清单上有你和另外十一个人的名字。他把红笔放在函件上，笔帽没拧，笔尖朝着你。走廊有人推车过去，轮子响了一阵才停。他把函件翻到最后一页给你看，落款线下面还有一行小字：经手人签字即视为知悉全部内容。他说这行字是模板里带的，往年没人看，今年追责组拿它当过依据。会议室的灯管又响了一声，这次回声更长，像有人在里面说话。',
      when: { minFolded: 10 },
      options: [
        { label: '签下第七个签名位', relation: 3, run: { intel: 2, track: { loyalty: -1, sin: 2 } },
          after: '你签了。函件补齐七个签名，责任摊到四家公司三个部门。年底考核里你的名字底下多了一条备注。他把红笔帽拧上还给你，说这根笔跟你一样，签过的东西都留着，擦不掉，也改不回去。他把函件装进文件袋，袋口折了三折，说这一份要送到追责组手上，不经过任何人。' },
        { label: '不签，让他一个人兜', relation: -2, run: { track: { loyalty: 2, renown: 1 } },
          after: '你最终没签。结论写着经手不清、责任人一人。半个月后例外清单被整本调走，十一个名字全部进了问询记录。他工位清空那天，你桌上多了一张打印纸，上面只印着那七个签名位。那张纸你留了很久，后来在一次搬工位时丢了，丢在哪儿谁也不知道。' },
        { label: '不签，先把清单复印一份', relation: 0, run: { intel: 3, track: { sin: 2, renown: -1 } },
          after: '你把清单复印了一份。他没拦，看着复印机的光扫过去，扫了四遍才停。函件照旧交上去，你那份复印件在抽屉里放了很久。他后来问过一次，你说不在手上，他点头，没再问第二次。清单在原处又放了两个月，一直到追责组撤走，归进档案，谁也没有再翻过那十一页。' },
      ],
    },
    {
      id: 'ds-6',
      npc: 'dai-siyuan',
      stage: 6,
      act: 5,
      district: 'exchange',
      title: '戴思远：他第一次签了自己不该签的名字',
      text: '复核会开在周四上午。戴思远提前半小时到，把那份新的例外申请摊在桌上，申请人一栏写着另一个部门，理由不成立，和第三幕那份一模一样，只是这一次没有人拦他，走廊上连脚步声都没有。他把手表从手腕上解下来放在一边，表带早断了，戴着只是习惯，腕上留着一圈白印。他拿起笔，在签批人栏里写下自己的名字，写得很慢，每一笔都压到纸背，纸背鼓起一道浅痕。签完他把笔帽拧上，推到你面前，说还有第二栏：复核人。他第一次签了不该签的名字，那一栏要么是你，要么空着等追责组来填。会议室的灯这时全亮了。申请人栏那个部门的编号他念了一遍，念得很慢，像是要你记住。他说第二栏空着也行，追责组会从复核人名单里随机指派一个，指到谁算谁，连他自己都猜不到。他把解下来的表带在手心里卷了两圈，放到桌角，正好压在材料边上。',
      when: { minFolded: 11 },
      options: [
        { label: '签第二栏，跟他一起担', relation: 3, run: { intel: 2, track: { loyalty: -1, sin: 2 } },
          after: '你签了第二栏。两份材料一起归档，责任栏里写着两个名字。他把解下来的旧表带留给你，说这东西跟了他三年，现在不跟了。之后合规处的灯修好了，他那半边顶灯还是关着，没人碰。旧表带你收进抽屉最里面，跟那根红笔放在一起，两样东西一直没人来要。' },
        { label: '不签，把申请原件带走', relation: -2, run: { track: { renown: 2, loyalty: 1 } },
          after: '你把原件带走了。第二天复核会重开，申请作废，他签下的那个名字被画了一道红杠。他的位置还在，只是不再签任何例外。那根红笔后来一直放在你抽屉里，没人来要，也没人问起。他后来调去了另一个处室，走之前把手上的例外清单交接得干干净净，一条没留。' },
        { label: '两栏都空着，把材料寄出去', relation: 0, run: { track: { renown: -2, sin: 1, power: 1 } },
          after: '你没签，把两份材料一起寄了出去。第三天复核组进驻，合规处封门查了四天，名单上不只是这一份申请，还有十一份旧的。封门那天他没来上班，椅背上挂着那根空表带。复核组撤走那天你去了合规处，门开着，桌上的东西还在，没有人回来收拾。' },
      ],
    },

    /* ============ 程砚 · 首席科学家 · 研究所园区 ============ */
    {
      id: 'cy-4',
      npc: 'cheng-yan',
      stage: 4,
      act: 3,
      district: 'lab',
      title: '程砚：事故报告里空着的那一栏',
      text: '三号项目在周二凌晨出了事故，园区西侧的排风停了四十分钟，值班记录上只写了一句：异常已处置，落款是机器打的时间。程砚把你叫进三号实验室，那台一直响的培养箱现在静着，柜门贴了封条，封条边角被人揭起过一次又按平。她说事故报告已经写完，结论是设备老化，报告里只留一处空着，签收人，也就是把三号柜那批样本接进园区的人。她翻开第四页给你看，正是你签字的那天，签字栏旁边还有一点铅笔的余痕。她说记得你签的时候问过她去向，她没答。她把报告合上，说这份东西现在还在她手里，交上去只要十分钟。她把报告翻到封面，封面上印着三号项目的编号，编号后面用铅笔划了一道浅线。她说这份报告送上去之前，她还可以把排风停的时间从四十分钟改成二十分钟，改一个数字就够。她说这话时没抬头，看着报告里那处空白。',
      when: { minFolded: 7 },
      options: [
        { label: '认下签收责任', relation: 2, run: { intel: 3, track: { sin: 1, loyalty: -1 } },
          after: '你认了。报告当天交上去，结论写设备老化，签收人一栏是你的编号。她把报告首页钉在实验室门口的公告板上，谁走过都能看见，钉得很正。培养箱的封条三天后撕掉，柜子里空了。公告板上的报告首页一直贴到月底，边角被人翻起过，又按回去，谁也没撕。' },
        { label: '要求先看完整值班记录', relation: 1, run: { intel: 4, track: { loyalty: -1 } },
          after: '她翻了很久，最后只给你一份删过的摘要，排风停的时间被改成二十分钟。她说原件不在她手里，你信不信都行。那天以后你每次进园区，门禁记录都会多挂一行，没人解释，也没人来清。她把那份删过的摘要收进实验台最下面的抽屉，上了锁，钥匙挂在自己工牌后面。' },
        { label: '拒绝，让她自己填签收人', relation: -2, run: { track: { loyalty: 2, renown: 1 } },
          after: '你拒绝了。她当场把报告翻回第四页，用铅笔在签收人栏写下自己的名字，写完把铅笔折断扔进废料桶。第二天报告交上去，签收人是她的编号，结论还是设备老化，没人再提那四十分钟。废料桶里的半截铅笔第二天还在，她把台面擦干净才对你说了一句话：这回算清了。' },
      ],
    },
    {
      id: 'cy-5',
      npc: 'cheng-yan',
      stage: 5,
      act: 4,
      district: 'lab',
      title: '程砚：重测六天，还是补一行编号',
      text: '复核组进园区的第三天，程砚把一份新的签收单放在实验台上，冷链记录那栏还停在前天凌晨，格子的时间戳被划掉又写上。她说报告已经改到第三版：第二版签收人空着，第三版要重测数据，测一次六天，六天之后事故就过了追溯期。她只能选一条，要么让报告走设备老化，把签收栏补上你的编号；要么把样本重测，谁签的字谁留名，报告退回重写，追溯到哪一天算哪一天。她用指腹抹了下培养箱封条上的灰，抹出一道白。她说这一批样本里有一支是她自己的血样，第三幕那只没标号的箱子，就是从这儿出来的。她说这两条路她算过，重测六天要停一整条线，停线的损失写在项目表上，谁签字谁认。她把手从封条上收回来，指腹上沾了一点灰，她在实验服上擦了两次才擦掉。冷链记录那栏的时间戳还在跳，一格一格往前。',
      when: { minFolded: 10 },
      options: [
        { label: '走设备老化，让她补上我的编号', relation: 3, run: { money: 40, track: { sin: 2, power: 1 } },
          after: '你说走设备老化。数字补上，报告结了，追溯期平安过去。她第二天给你一只金属盒，里面是那支血样的残余部分，盒盖内侧用记号笔写着一个日期。她说留着，将来有人问起签收栏，这东西能替你说话。金属盒你放在柜子最上层，盒盖上的日期你后来查过，正是排风停的那天凌晨。' },
        { label: '重测六天，签收栏照实填', relation: -2, run: { intel: 3, track: { renown: 2, loyalty: 1 } },
          after: '六天里她没回过宿舍，第二版数据出来时人是瘦的，眼下有青。报告退回重写，签收人照实填，追溯期从头算起。追责下来评级降了一档，她没申诉，只说这一次纸上是干净的，晚半年也值。重测的数据进了新档，旧档封存，封条上写着作废，日期比她签的那份晚六天。' },
        { label: '拖着，两边都不交', relation: 0, run: { intel: 2, track: { sin: 1, renown: -1 } },
          after: '你拖着。第三天追溯期过去，报告自动归档，签收栏空着。复核组走的时候问过一句，她说人不在园区。那台培养箱后来被贴上停用的标，一直停到现在，没人来拆，也没人来问，实验室那盏灯也一直坏着。' },
      ],
    },
    {
      id: 'cy-6',
      npc: 'cheng-yan',
      stage: 6,
      act: 5,
      district: 'lab',
      title: '程砚：签收栏推到你面前',
      text: '追溯期最后一天的早上，三号实验室的灯全开着，走廊里一个人都没有。程砚把签收单摆在台面正中，签收人栏空着一行，旁边压着一支笔，笔尖朝外。她说第三版数据是她自己签的字，样本编号也是她编的，这件事已经做完，改不掉了。现在只剩这一栏：她可以签自己的名字，明天递辞呈；也可以让你签，把三号项目整个留下，包括那台封了条的培养箱。她说这话时没有看你，一直看着那只箱子，玻璃里映出的数字还是红的。她把笔往前推了一寸，手缩回台面边缘，指尖碰到台面就停住了。她说签收单只印了两份，一份进项目档案，一份她自己留着，留到项目结束。她把台面上那支笔的笔帽拧开又拧上，拧了三次。实验室的排风今天开着，风声盖过了别的声音，两个人站着都没说话。',
      when: { minFolded: 12 },
      options: [
        { label: '签下自己的名字，接下三号项目', relation: 3, run: { intel: 3, gear: 1, track: { sin: 1, power: 2 } },
          after: '你签了。三号项目的交接单当天生效，她的名字从项目表上撤下来。她走时把培养箱的钥匙放在台面上，说这台机器响过三个月，现在静了，比什么都好。项目从此留给了你。钥匙上还挂着一根细绳，绳结打得很紧。她把实验室的门带上，没有回头。' },
        { label: '让她签自己，辞呈我替她递', relation: 2, run: { track: { renown: 2, sin: -1 } },
          after: '她签了自己。辞呈是你去递的，人事收件时没多问，只把签收单归了档。她第二天离开园区，实验室的灯还是全开着，台面上压着那只空了的金属盒，盖子合得很平。人事第二天寄回一张收件回执，回执上写着辞呈已收，没有写原因，也没有写日期。' },
        { label: '把签收单交去伦理组', relation: -2, run: { track: { loyalty: 2, renown: 1 } },
          after: '你交去伦理组。当天封室，样本重新编号，事故结论改成操作失当，她的实验员资格被暂停。封条贴上台面那天她在场，看着贴完才走，走之前把台面从头到尾擦了一遍。伦理组重新编号那天你在走廊上碰见她，她手里抱着两只空盒子，谁也没有停步。' },
      ],
    },

    /* ============ 彭戬 · 研究所安保总管 · 研究所园区 ============ */
    {
      id: 'pj-4',
      npc: 'peng-jian',
      stage: 4,
      act: 3,
      district: 'lab',
      title: '彭戬：贴在他门上的停职通知',
      text: '停职通知是周三早上贴在总控室门上的，A4 纸，胶带贴得很正，四个角都压平了，落款是综合管理处。彭戬没撕，就让它贴着，自己搬了把椅子坐在门外，四块屏看不见了，只能听里面那台报警器偶尔响一声，响一声他数一次。他说那道门他到底没开，报告写了三页，结论四个字：未按规定执行。他找你只要一件事：那晚第七道上锁申请的卡号，系统里已经被抹掉，但记录仪的纸带还在他口袋里，边缘有一道撕过的毛口。他把纸带抽出一角给你看，上面一行编号只剩前半段。他说他不上诉，只想让那行卡号有个去处。他把那张通知的下角捋平了一次，捋完又翘起来。他说综合管理处给的理由只有一句：拒令未报。他说他不后悔，只后悔当晚没把第七道上锁申请截图存下来，截图比纸带管用。他说完把纸带折回口袋，毛口那一边朝里。',
      when: { minFolded: 8 },
      options: [
        { label: '接过纸带，替他把卡号查出来', relation: 2, run: { intel: 4, track: { loyalty: -1 } },
          after: '卡号查出来归一个临时工号，上个月就注销了。你把结果告诉他，他在门外的椅子上看了很久那张通知，最后说这一趟没白停职。纸带他自己收回口袋，毛口那边折了一折。他第二天把椅子搬回门里，通知还贴在门上，他坐在通知后面，四块屏又能看见了。' },
        { label: '劝他把纸带交上去申诉', relation: -1, run: { track: { loyalty: 2, renown: 1 } },
          after: '他第二天把纸带连同三页报告一起递上去，申诉被驳回，处分记档，复职的事往后拖。他每天照样来门口坐着，看里面那四块屏一块一块暗下去，报警器响一次他数一次。到了月底他被安排去看港区的仓库，总控室的钥匙交了出去，钥匙盘留在架子上。' },
        { label: '不接，让他自己收着', relation: -2, run: { track: { power: 1 } },
          after: '你没接。他把纸带塞回口袋，说那就先这样。停职期满他被调去港区看仓库，钥匙盘留在总控室架子上，第三格一直空着，没人补，也没人来查那格到底少了什么。他在港区待了两个月，回来过一次，只在总控室门口站了一会儿就走了，没进门。' },
      ],
    },
    {
      id: 'pj-5',
      npc: 'peng-jian',
      stage: 5,
      act: 4,
      district: 'lab',
      title: '彭戬：夜里那一次开门',
      text: '复职材料要等两周，这两周彭戬进不了园区，门禁卡已经被停掉。周五夜里他给你打电话，说总控室后面的储物柜里还留着一只钥匙盘，第三格空着，其余七把都是他自己的。他要你开一次门，就一次，取完就走，不碰别的东西。他说那把空格的钥匙在第九道上锁申请那晚被拔走了，只剩钥匙盘上一个空印子，他想把那处空印子拍下来，拍完就还。园区外围的灯只亮了一半，巡逻车刚过去一趟，地上的水渍还没干，反着光。他还说了一句：你开门这件事，记录会挂在你名下，出园区的时候会跟着你走，跟到年底都甩不掉。他说这话的时候没有提那晚的门禁记录会挂多久。电话里有风声，他大概站在园区外面，隔着围栏看过那排灯。他说如果记录跟着你出园区，你就把说明写简单点，只写取物，别写拍照，别写钥匙盘。',
      when: { minFolded: 10 },
      options: [
        { label: '给他开门，记录算我头上', relation: 3, run: { intel: 2, track: { sin: 1, loyalty: -1 } },
          after: '门开了。他进去七分钟，拍完空印子就出来，门禁记录挂在你名下。第二天综合管理处调了日志，你写了一份说明。钥匙盘他没带走，放回储物柜，第三格朝上摆着。那份说明写了两页，写的是取物，没有写拍照。他把照片存在自己的旧手机里，没上传。' },
        { label: '不开门，让他等复职', relation: -2, run: { track: { loyalty: 2, renown: 1 } },
          after: '你没开门。他在电话那头应了一声，没多说。复职下来后他第一件事就是去储物柜，钥匙盘还在，第三格还是空的。他把那处空印子拍下来，照片传给你一份，一句说明都没有。那张照片你存了下来。他复职以后不再坐门口那把椅子，改坐在屏前，一直坐到下班。' },
        { label: '开门，但把钥匙盘拍两份', relation: 1, run: { intel: 3, track: { sin: 1, power: 1 } },
          after: '你开了门，拍了两份，一份给他，一份自己留着。他看见你手机屏幕的时候停了一下，什么也没说。后来那份照片被人问过一次，你说没有，他也说没有，问的人转身就走了。照片你后来又翻出来看过一次，看的是第三格那处空印子，别的什么都没看。' },
      ],
    },
    {
      id: 'pj-6',
      npc: 'peng-jian',
      stage: 6,
      act: 5,
      district: 'lab',
      title: '彭戬：钥匙盘上的第三格',
      text: '复职通知和处分通知同一天到，两份纸都搁在总控室门口的椅子上，风把上面那张吹起一角，露出下面那行字。彭戬把四块屏挨个看了一遍，最左边那块的红点还在闪，闪得比上周慢。他手里捏着那只钥匙盘，第三格还是空的，空印子朝上。他说他可以把记录仪的纸带交上去，交出纸带就复职，处分抹掉，代价是那行卡号再也不会有人查；也可以把纸带留着，复职的事作废，明天开始他就不在园区上班了。他把钥匙盘搁在椅子上，两把钥匙磕了一下，声音很轻。他说最后一次，让你来选。他把两份通知叠在一起，对折了一次，压在钥匙盘底下。四块屏上最左边那块的红点还在闪，他说这红点三个月了没人管，谁也不在意它到底在报警什么。他把椅子往门边挪了半尺，让出门，让你先走。',
      when: { minFolded: 11 },
      options: [
        { label: '让他留着纸带，复职我去跑', relation: 3, run: { intel: 3, track: { power: 2, sin: 1 } },
          after: '纸带留在他手里。复职的事你跑了两周，只跑下来一个临时安保的岗。他把钥匙盘交给你保管，说岗位不重要，钥匙在谁手里才重要。第三格那处空印子他没再拍过第二次。临时岗上了两个月，园区里又出过一次上锁申请，这次他按了确认，记录上什么都没少。' },
        { label: '让他交纸带复职', relation: -2, run: { track: { loyalty: 2, renown: -1 } },
          after: '他交了纸带，复职当天生效，处分抹掉。那处空印子从此没人提。他把钥匙盘放回总控室的架子上，第三格朝里摆着，谁也看不见。见你的时候他只说了一句：这次算我认。那格空印子后来被新来的安保总管填上了钥匙，谁也没有提过原来那把去了哪里。' },
        { label: '把纸带拿走，两样都不给他', relation: 0, run: { money: 50, track: { sin: 2, renown: -1 } },
          after: '你把纸带拿走，两样都没给他。他没拦，只把钥匙盘放回椅子上，说随你。第二天园区里没见到他，也没见到那份复职通知。钥匙盘被收进储物柜，上了锁。储物柜的钥匙交到了综合管理处，柜子一直没开过，那格空印子还朝上摆着。' },
      ],
    },

    /* ============ 老鸦 · 灰市掮客 · 下层居住区 ============ */
    {
      id: 'ly-4',
      npc: 'lao-ya',
      stage: 4,
      act: 3,
      district: 'slum',
      title: '老鸦：公账上多出来的一笔',
      text: '灰市那边的人上周找过老鸦，来的是两个中年人，在他铺子门口站了十分钟没进门。水泵房的水声还是一阵一阵，他把账本摊在铁桶上，翻到撕掉那页留下的毛边，毛边还翘着，边上沾了一点烟灰。他说为了保你，他破了两条规矩：一条是不能替客户顶罪，一条是不能用灰市的名头做私活，前一条他自己认了，后一条记在了灰市的公账上，要还，而且要快。他把那包没拆的烟从口袋里掏出来，在手上掂了掂，说这包本来是留着事情办成那天拆的，现在看是拆不动了。他问你一句：那笔公账，你认不认。他把账本合上，用手压了一下边角，让它翘着的毛边贴回去。他说灰市要账从来不写期限，只写在人身上，写在谁头上谁就得自己记着日子。水泵房外面的巷子里有脚步声走过去又走回来，他没抬头。',
      when: { minFolded: 7 },
      options: [
        { label: '认下公账，钱我来出', relation: 3, run: { money: 70, track: { sin: 1, renown: 1 } },
          after: '你说钱我来出。他没道谢，只把那包烟拆了，抽出一支点上，剩下的塞回口袋。公账当天销掉，灰市收得干脆利落。水泵房的水一直没停，他翻回那页，用左手补了一行新的。他补的那一行字很小，写在页脚，写的是日期，别的什么都没写，也没让你看。' },
        { label: '不认，这是他自己破的规矩', relation: -2, run: { track: { loyalty: 2, power: 1 } },
          after: '你说不认。他把烟收回口袋，说行，这一笔他自己偿。十天后他那间铺子过了户，账本上那行被划掉。他见你还照常说话，只是不再让你碰他的账本，连铁桶都不让你挪。铺子过户那天他在门口站了一会儿，看着新主人换了锁，然后转身进了巷子。' },
        { label: '认账，但要转成灰市的人情', relation: 1, run: { money: 40, intel: 3, track: { power: 1, sin: 1 } },
          after: '你说认账，但走灰市的人情。他想了想，把账本中间那页翻出来，在空位上写了一个字：欠。他说这个字比钱管用，也比钱难还。水泵房的水声那晚一直没停，他数到很晚才走。那个欠字后来被灰市的人看到过一次，问了一句，他说是旧账，问的人就没再问。' },
      ],
    },
    {
      id: 'ly-5',
      npc: 'lao-ya',
      stage: 5,
      act: 4,
      district: 'slum',
      title: '老鸦：第十天的那一行空位',
      text: '灰市给的期限是十天。第十天晚上，老鸦把你叫到旧水泵房的铁梯上，水已经停了，管道上的白霜化了一半，地上湿着一片，踩上去不出声。他说灰市开的价不是钱，是人：要么他把自己三十年记的账交出去，要么去清算行把名下那间铺子过掉，两样都不留。他两样都不想给。他说还有第三条路，是最脏的一条，把你那张指令卡的编号写进灰市的公账，用你的名头把这一笔抵掉。他把账本翻到中间那页，那里留着一行空位，字是左手写的，笔画歪着，一直没有落笔。他说这一行，本来是给你留的。他把账本往前推了半寸，空位那一行朝着你。他说这一行不写也没事，灰市回头会找人来写，写谁的名字不看情分，只看谁的名字好用。铁梯下面湿着一片，反着一盏很远的楼道的灯。',
      when: { minFolded: 10 },
      options: [
        { label: '让他写我的编号', relation: 3, run: { track: { sin: 2, loyalty: -1, power: 1 } },
          after: '你让他写。编号落进公账那天，灰市把账收了，他撕掉那一页，毛边比上次还长。他把没拆的那包烟整包塞给你，说这包他拆不动了。旧水泵房的管道上，白霜又结了一层。他撕页那天没有开灯，撕下来的那页他没有烧，折起来塞进了外套内侧的口袋。' },
        { label: '拿钱把我那份买回来', relation: 2, run: { money: 70, track: { sin: 1 } },
          after: '你出钱把账买回来。他收下，账本上那页贴着，一个字没改，铺子保住了，人也留住了。他后来说，这一趟是他三十年里做过最不划算的一笔，也是最值的一笔，说完就再也不提。铺子的账他重新抄过一遍，抄到中间那页空位置时停了手，最后留了一行空白。' },
        { label: '拒绝，让他自己交账本', relation: -2, run: { track: { loyalty: 2, renown: 1 } },
          after: '你拒绝了。他没说话，第二天早上用铁皮盒把账本装好，去了清算行门口。灰市的人比他先到，站在台阶下等着。水泵房那天起再没开过灯，铁梯上落了一层灰。灰市的人收完账就走了，旧水泵房的门一直虚掩着，里面的水管上还挂着半层白霜。' },
      ],
    },
    {
      id: 'ly-6',
      npc: 'lao-ya',
      stage: 6,
      act: 5,
      district: 'slum',
      title: '老鸦：清算行门口的台阶',
      text: '第十天早上，老鸦站在清算行门口，穿着那件领口磨白的旧外套，手里拎着一只铁皮盒，里面是他三十年的账，盒子提手缠着胶布。交易所广场还没开门，风把地上的纸吹到台阶下面，贴着台阶角一圈一圈打转。他说他走进去，账本一变公，灰市上就再没有他的位置，你也再欠不着他；他也可以把铁皮盒交给你，让你替他走这一段，账本换成你的名字，铺子留着，人不用进去。他把铁皮盒搁在台阶上，两只手插回袖子里，说这盒子里的东西，你比清算行的人更清楚。台阶上的水还没干，映着盒子的一个角。他说铁皮盒里的账按年份分成七捆，最旧那一捆是三十年前的，纸都脆了，一动就掉渣。他说清算行收账不烧账，只重新编号，编完号以后每一笔都能查到经手人。他把手从袖子里抽出来，在盒盖上按了一下。',
      when: { minFolded: 12 },
      options: [
        { label: '替他走这趟，把账本接过来', relation: 3, run: { money: 60, track: { sin: 1, loyalty: -1, power: 1 } },
          after: '你拎起铁皮盒走进清算行。账本换成你的名字过了一遍，铺子留在他名下。他站在台阶下等你出来，手里空着，外套领口还是磨白的。他说这回轮到你被人记住了。他把那只空掉的手从袖子里抽出来，跟你握了一下，手心很凉，握完就揣回去。' },
        { label: '让他自己进去，我在外面等', relation: -2, run: { track: { loyalty: 2, renown: 1 } },
          after: '他自己进去了。出来时手里什么也没有，账本成了公本。灰市上再没人叫他老鸦，只剩几个老人还记得水泵房。他把那包没拆的烟留在台阶上，谁也没拿，吹到中午还在。那包烟后来被谁捡走了不知道，台阶上留了个压痕，到晚上下雨才冲平。' },
        { label: '都不动，把盒子留在台阶上', relation: 0, run: { intel: 3, track: { sin: 1, renown: -2 } },
          after: '你把盒子留在台阶上先走了。中午盒子不见了，摊主说是扫地的人收走的。三天后灰市换人管事，旧水泵房的水管被锯开，账本的纸屑在管道口堆了一小撮，一直没人扫。灰市换人以后规矩也换了，旧规矩里那两条再没人提过，提了也没人认得。' },
      ],
    },

    /* ============ 陆晚 · 无证诊所医生 · 下层居住区 ============ */
    {
      id: 'lw-4',
      npc: 'lu-wan',
      stage: 4,
      act: 3,
      district: 'slum',
      title: '陆晚：她收了一个不该收的人',
      text: '上周有人半夜敲诊所的门，敲三下就停了。陆晚收了他，现在那人躺在靠里那张床上，盖着一件灰制服，制服上的部门标被剪掉了，剪口很整齐。周四下午，市面上来了两个人，穿便服，拿着调档函，要她把这一周的病历全部交出去，态度客气，站在门口不进来。她把调档函折了一下塞进抽屉，说诊所从来不留完整病历，都是手写单，写完就烧。她说这话时没看你，手上在给一件器械消毒，酒精棉擦了三遍，擦到布都白了。抽屉里还压着那张撕成两半的手写单，两半都没扔，边上被药水洇黄了一角。她把调档函的回执压在药柜玻璃底下，压得很平。她说这两个人来了三次，第一次只站在巷口，第三次才敲门。床上那人睁着眼看天花板，一句话没说，手一直放在被子外面。',
      when: { minFolded: 7 },
      options: [
        { label: '帮她把单子全换成别的名字', relation: 3, run: { intel: 2, track: { sin: 2 } },
          after: '手写单全换成了别人的名字。那两个人来收档时翻了一遍，没找到问题，留下两张调档回执。陆晚把回执压在药瓶底下，转身给床上那人换药，胶布换了三次才贴正。那两张回执她一直压在药瓶底下，压到年底才拿出来，拿出来的时候边角已经发黄。' },
        { label: '劝她把该交的交出去', relation: -2, run: { track: { loyalty: 2, sin: -1 } },
          after: '她把能交的都交了，那人被带走时是自己下的床，走得很稳。她那天没给人看诊，坐在门口的小板凳上坐到半夜。抽屉里两半的手写单她没扔，也没再拼，就那样压着。后来她又收过两个不该收的人，每次都在门口的小板凳上坐到半夜，坐到灯灭。' },
        { label: '先弄清床上那人是哪一边的', relation: 1, run: { intel: 4, track: { renown: 1 } },
          after: '你去见了那人。他什么也不肯说，只在纸上画了一条竖线。你把纸拿给陆晚看，她认出那是第七层的层标，转身就去翻药柜最底下那本过期登记册，翻的时候手很稳。那本过期登记册她一直收在药柜最底下，谁要都不借，说是诊所的旧账，不能出屋。' },
      ],
    },
    {
      id: 'lw-5',
      npc: 'lu-wan',
      stage: 5,
      act: 4,
      district: 'slum',
      title: '陆晚：这一次名字要写在她自己的病历上',
      text: '调档函给了三天。第三天夜里，陆晚把靠里那张床推到帘子后面，自己坐在门口的小板凳上，膝盖上摊着那两半手写单。她说这回躲不过去了：要么交病历，要么把床上那个人交出去，要么诊所明天关门，她带着手写单去下一层，去更深的半层地下室。三条路里只有一条要你出手，交出病历可以，但交出去的名字得对得上，那需要一份能过系统的身份记录，和第一次那份一样，只是这一次要写在她自己的病历上。她把两半单子拼在一起，压在一只空药瓶下面。楼道灯一闪一闪，楼上有人走动，走了很久都没有停。她说身份记录不用太真，只要能过系统那一关，撑三天就够。她把手写单收进药瓶下面的抽屉，又把它拿出来折了一遍，折成更小的一块。她说这一次她不想再让人替她决定救谁。',
      when: { minFolded: 10 },
      options: [
        { label: '给她做一份病历身份', relation: 3, run: { money: 45, track: { sin: 2, loyalty: -1 } },
          after: '系统里那个名字对得上，调档函如期收档，人留在床上。她把两半手写单拼好压在药瓶下，说这一次是她的名字，下一次不用你出手了。诊所那晚的灯亮到很晚才灭。床上那人第七天自己走了，走前把灰制服的剪口缝上了，针脚很粗，缝完就放在床上。' },
        { label: '帮不了，让她自己决定', relation: -2, run: { track: { loyalty: 1, sin: -1 } },
          after: '你说帮不了，让她自己决定。第三天她交出去一半病历，人被带走了，诊所门口贴了张停诊的单子。她把手写单烧了一半，剩下那半卷起来塞进药瓶，谁也看不见。停诊的单子贴了三天就被人撕了，诊所照旧开门，只是不再留任何手写的东西。' },
        { label: '先见床上那人再定', relation: 1, run: { intel: 3, track: { renown: 1 } },
          after: '你先见了人。那人退烧后说了三句话，第三句里带着你部门的编号。你把话原样告诉陆晚，她沉默了一阵，把调档函从抽屉里拿出来，翻到背面看了看落款，又照原样折回去。调档函第三天到期，她把函件交了出去，交的是复印件，正本一直压在药瓶底下。' },
      ],
    },
    {
      id: 'lw-6',
      npc: 'lu-wan',
      stage: 6,
      act: 5,
      district: 'slum',
      title: '陆晚：撕成两半的那张单子',
      text: '那两个人第四天又来了，这回站在巷口，不进诊所，一个看表，一个看巷子深处。床上那人烧退了，能坐起来，穿着剪了标的灰制服，问什么也不答，只在纸上画过一条竖线。陆晚把两瓶标着别人名字的血浆从柜子里取出来摆到台面上，又把那张拼好的手写单撕成两半，这一次撕得很准，一半是上半段的名字，一半是下半段。她说这回她选得出来：留一半在诊所，把另一半连着身份记录一起交出去，人留下来，记录走掉。她把其中一半塞进你手里，说这一次她站街这边，签字的事要你来。她把两瓶血浆摆正，标签朝外，谁也看不出原来是谁的血。她说人留下以后，病历上那个名字要跟着走，走多久她不知道，也不问。巷口那两个人还在，一个看表，一个看巷子深处，谁也没有进来。',
      when: { minFolded: 12 },
      options: [
        { label: '接下那半张，替她把记录交出去', relation: 3, run: { intel: 3, track: { sin: 2, renown: 1, loyalty: -1 } },
          after: '你接了那半张。名字交出去，人留下，系统中那份记录挂在你的操作编号上。她第二天照常开诊，门口那盏灯换了新的。诊所靠里那张床空了很久，被单叠得很齐。那份记录挂在你的操作编号底下，到了年底才被归档，归档时没人问过一句是什么。' },
        { label: '把两半都交给对方', relation: -2, run: { track: { loyalty: 2, renown: -1 } },
          after: '两半都交了出去，人被带走，诊所当天下锁。她走之前把那张拼过的纸撕成四条扔进不同的垃圾桶，一条一个。你在巷口看见她拎着药箱往下层去，一路上没有回头。诊所锁了以后有人来敲过几次门，敲三下就停，停了很久也没人开，就再没敲过。' },
        { label: '两半都烧了，谁也别要', relation: 0, run: { track: { sin: 1, renown: 1 } },
          after: '你在楼道拐角把两张纸烧了，纸灰被风卷上来一层。那两个人第四天再来的时候什么也没拿到，只在巷口站了一会儿就走。她照旧开诊，见你的时候只点了一下头。巷口那两个人再没出现过，巷子里的人问起这件事，谁都说那天晚上很安静。' },
      ],
    },

  ];
})();

/* ===== game/story-npc-b2.js ===== */
/* NPC 个人支线 B 组·续：每人新增三幕（第 4-6 幕）。 */
(function () {
  'use strict';

  window.STORY_NPC_B2 = [

    {
      id: 'tg-4',
      npc: 'tie-gui',
      stage: 4,
      act: 3,
      district: 'docks',
      title: '铁贵：九个街口',
      text: '封锁令是周一凌晨贴出来的，铁贵把九个街口用集装箱横着堵了一排，箱门上刷的还是货号，不是标语。你到的时候雨正大，积水没到鞋帮，挡板上挂着那盏玻璃罩裂了的警报灯，裂口缠了两圈胶带，就是上次从吊机上拆下来的那一盏。铁贵站在箱门后面，没戴安全帽，左手那道伤还缠着绷带。他说上面给了清场时限，七十小时，到点就进场。「今晚有条船靠港，船上装的是拆了编号的义体件，要人进舱搬。这活不该做，做了工会就完了。我要你一句话，做还是不做。」说完他把一副手套放在你脚边，转身去点数。点到一半他又回头：「你不点头，我自己带人下去，出了事跟你没关系。」雨顺着箱门往下流，把那排货号冲得发亮。',
      when: { minFolded: 7 },
      options: [
        { label: '接下这趟活，跟他进舱', relation: 3, run: { intel: 3, track: { sin: 2, renown: 1 } }, flag: 'tg4_night_shift',
          after: '你把手套捡了起来。船凌晨两点靠港，四十个人贴着跳板下去，货一箱箱抬上来，没有一张单子。铁贵在跳板上站到天亮，天光泛白时把那盏警报灯取下来交给你，说这盏灯往后归你记着。工会账上当晚多出一笔谁也说不清的进项，第二天巡检来问，谁都说没听过那条船。' },
        { label: '拒绝，说这活不能做', relation: -2, run: { track: { loyalty: 2 } },
          after: '你说不做。他点了点头，把手套收回去，没再劝，转身去点数。第二天夜里船还是靠了，人少了一半，货抬到一半探照灯扫过来，带走六个人。铁贵没提你的名字，工会上也没人提，那六个人的工位空了三天。那盏警报灯后来被人从挡板上摘下去，扔进了集装箱的夹缝里。' },
        { label: '让他只派自愿的人，你不出面', relation: 0, run: { intel: 2, track: { sin: 1 } },
          after: '你说人自己报，你不出面。他答应了，挑了十九个自愿的，抄了一份名单压在抽屉里。船比说好的晚来两个小时，活干完天已经亮了。他把名单从抽屉里取出来撕了，说这一份不算数，剩下的都算他一个人的。那晚进舱的人后来各自领了一笔钱，谁也不知道钱从哪儿出。' },
      ],
    },

    {
      id: 'tg-5',
      npc: 'tie-gui',
      stage: 5,
      act: 4,
      district: 'docks',
      title: '铁贵：要落在一个人头上的那本日志',
      text: '那艘船的事过了六天，巡检把九个街口的封条全换成新版，箱门上多了一排编码，谁进过场都要留指纹。铁贵把你叫到冷库后面，左手绷带拆了，伤口边上发青。他说巡检要找人签一份装卸日志，那晚进舱的记录得落在一个人头上，签了就是一个人扛，别人干净。「我原本想自己签。」他把一支笔塞进你手里，「可我一签，印章就得跟着走，工会上下一百多号全得陪绑。你签，走你部门的流程，落在你名下，别人干净。」他低头从裤兜里摸出工会那枚旧印章，放在你手心里，章面上缺了一角。冷库门一开一关，白汽往外翻，翻过他的脚面。他没催你，把手插回兜里，站在白汽里等，等到眉毛上结了霜。',
      when: { minFolded: 10 },
      options: [
        { label: '签下装卸日志，落自己名下', relation: 3, run: { intel: 2, track: { sin: 2, power: 1 } }, flag: 'tg5_signed',
          after: '你在日志上签了名，四十六个进舱记录全挂在你名下。铁贵把印章收回去，说这份人情他记着。三天后你部门的内部件里多了一条备注，写着该次作业系员工个人行为。冷库后面的白汽照常往外翻，他见你时不再提签字的事，只在递烟时多停半秒。' },
        { label: '拒绝签字，也不接那枚印章', relation: -2, run: { track: { loyalty: 2 } },
          after: '你把笔和印章都推了回去。他没伸手接，笔滚到冷库门槛边上。第二天巡检进场，四十六个人挨个过了一遍，七个被带走。铁贵站在门口，谁问都说不知道。他后来托人把你落下那支笔还了回来，笔帽是新换的，笔身还带着冻库的凉。' },
        { label: '签，但要求日志先过一遍他的章', relation: 1, run: { intel: 3, track: { sin: 1 } },
          after: '你签了，条件是他先盖章。他当着你的面把缺角的印章按在页脚，按下去那一下用了很大的力。那份日志被拆成两份归档，一份进你部门，一份留在工会。之后两个星期巡检来过两次，两次都只看页脚，别的地方一页没翻。' },
      ],
    },

    /* ============ 银面 · 女术士的代理人 · docks ============ */

    {
      id: 'tg-6',
      npc: 'tie-gui',
      stage: 6,
      act: 5,
      district: 'docks',
      title: '铁贵：那盏灯最后挂在哪儿',
      text: '三个星期后封条撤了，九个街口的集装箱一箱一箱吊走，露出底下压平的路面，工会的木牌摘了，挂在门房墙上。铁贵没被带走，也没来上过班。他在吊机底下等你，脚边放着那盏裂了口的警报灯和一枚缺角的印章，胶带还是他缠的那两圈。清场追责的单子下来了，上面两个编号，一个是他的，一个是你部门那串。「有人找过我。」他蹲下去，把灯罩上松掉的那圈胶带重新缠紧，「交上去，我这边干干净净，单子上就剩你一个。」缠完他才抬头，「交不交，我等你来听一句。」吊机顶上积的水一滴一滴落下来，砸在灯罩上，声音很闷。吊机顶上的水积了一夜，落到天快亮才停，档位灯也灭了。',
      when: { minFolded: 11 },
      options: [
        { label: '让他别交，单子上的名字我来担', relation: 3, run: { intel: 3, track: { sin: 2, renown: 1 } }, flag: 'tg6_stood_by_him',
          after: '你让他别交。他把胶带那圈按平，站起来说了声行，把印章塞回裤兜。追责单最后只落了你那串编号，处理意见写着流程失当。他第二天回来上了工，警报灯重新挂上吊机，裂口还是缠着那两圈胶带，谁也没换。，胶带那两圈他缠得比原来紧。' },
        { label: '让他照实交名单，你去自证', relation: -2, run: { money: 50, track: { loyalty: 2 } },
          after: '你让他交。他交了，四十六个名字一个不落，工会彻底解散。你的编号排在第一位，处理结果是调岗降一级，工号后面挂了一条记录。他领了遣散费走的，走那天没来找你，门房里那盏灯归了下一任领班，胶带被人拆了换新的。' },
        { label: '把灯拿走，谁也别提这回事', relation: 0, run: { intel: 2, chips: 1, track: { sin: 1 } },
          after: '你把灯提走了，什么也没答，也没让他交。他在吊机下面站了一会儿，自己走了。追责单最后按证据不足搁下，两个编号都空着。那盏灯后来在你家阳台上放了很久，裂口对着墙角，胶带一直没拆，灯罩上落的灰像一层薄霜。' },
      ],
    },

    /* ============ 银面 · 终局 ============ */

    {
      id: 'ym-4',
      npc: 'yin-mian',
      stage: 4,
      act: 3,
      district: 'docks',
      title: '银面：她不记得的那一天',
      text: '售票亭改成了杂物间，停用牌子换成白底黑字的登记牌，牌子上的名字不是她的。银面还坐在里面，桌上那只凉茶杯也在，杯底那个圈被人擦过，没擦干净，木头颜色浅了一块。她把一张手写单推过来，单子上是三个日期，第三个日期旁边画了个问号。「这三天里有一天是银面在班，有一天不是你见到的那个银面。」她抬起手把袖子往上拉了拉，露出腕上一道旧编号，最后一位被磨掉了。「你替银面说一句：上周四下午，是谁坐在这个位置上的。」她问完闭上眼，像在等一句从很远的地方回来的话。杯子里的水一直是凉的，一口没动，杯壁上那道水痕也一直停在原处。登记簿压在桌角上，边角卷起。',
      when: { minFolded: 7 },
      options: [
        { label: '替她确认那一天的班次', relation: 2, run: { intel: 3, track: { sin: 1 } }, flag: 'ym4_confirmed',
          after: '你答了上周四下午是她。她睁开眼，把手写单上的问号划掉，改成一行很小的日期。她说这三天里有一天归你记得。你走的时候她还在擦杯底那个圈，擦了很久，圈没擦掉，反而清楚了一点。第二天杂物间的钥匙换了人拿，登记牌倒是一直没换。' },
        { label: '不答，先问她是谁', relation: 1, run: { intel: 4, track: { loyalty: -1 } },
          after: '你反问她是哪一个。她想了很久，把袖子放下来盖住那道旧编号，说这个问题她也问过自己，问到第三个答案就停了。她把三个日期里最后那个划掉，说那一天不算。当天晚些时候，登记牌上那个不属于她的名字被人撕了下去，胶还留在漆面上。' },
        { label: '说这不该问我，起身走', relation: -2, run: { track: { loyalty: 1 } },
          after: '你起身走了，杂物间里没有追出来的脚步声。第二天门锁换了，登记牌上换成一个更整齐的打印名字。桌角那只凉茶杯被人端走，杯底那个圈留在桌上，过了一天也被人擦干净了。那间屋子从此再没挂过手写的东西。' },
      ],
    },

    {
      id: 'ym-5',
      npc: 'yin-mian',
      stage: 5,
      act: 4,
      district: 'docks',
      title: '银面：她要你抄回一个年份',
      text: '委托人自己来过一趟，站在售票亭外面没进门，只把一张解约函从门缝里塞进去。银面把那张函读了四遍，读到第四遍才抬头，抬头的动作比前三次慢。她把手腕上那道旧编号抄在一张手写单上，推给你：「这行字不是我写的。」她停了停，又改口，「也不全是。」她要你替她跑一趟委托人的档案室，把编号对应的入职年份调出来，只要年份，不要档案，也不要复印件。「这一年你先替我记着。」她说，「往后我自己记不住的那天，你就照着念给我听。」凉茶杯里的水少了一指，杯壁上留着一道很浅的水痕。她把杯子往里挪了挪，挪到灯照不到的那半边，一直没再动。窗外的雨声一直没停。',
      when: { minFolded: 10 },
      options: [
        { label: '替她跑一趟档案室，抄回年份', relation: 3, run: { money: 30, intel: 3, track: { sin: 1 } },
          after: '你去了委托人那间档案室，只抄了入职年份，一页纸没动。回来时她还坐在原位，接过抄条读了两遍，把年份念出了声。她说往后再记不住，你就照着这一条念给她听。杯子里的水又少了一指，她把杯子挪到灯照不到的地方，一直没换水。' },
        { label: '拒绝，说那份档案我不能动', relation: -2, run: { track: { loyalty: 2 } },
          after: '你说不动。她把抄条拿回去，对折两次，塞进风衣内袋，说那就按解约函办。解约函交上去的第三天，售票亭门口那块登记牌被摘了。她照旧坐在里面，桌上多了一张空白手写单，谁也没再提编号的事，也没人再来查过班。' },
        { label: '帮她跑，但年份改早两年', relation: 0, run: { intel: 3, track: { sin: 2 } },
          after: '你抄回来的年份比档案里早了两年。她读完没有问，只把抄条压在杯底下面，说差两年，往后有人查起来，她就多两年可以待在这儿。那张抄条后来一直压在杯子底下没拿走，纸边被水汽泡软，字还看得清。杯子一直压着那张抄条，谁也没掀开过。' },
      ],
    },

    /* ============ 温仕成 · 引航票务掮客 · orbit ============ */

    {
      id: 'ym-6',
      npc: 'yin-mian',
      stage: 6,
      act: 5,
      district: 'docks',
      title: '银面：柜台后面那个位置',
      text: '杂物间的登记牌又换了，这回是空白一块，漆面新得反光，什么也没写。银面把那只凉茶杯端到桌面正中，杯底那个圈在木头上印出一道深痕，怎么擦都在。她说委托人已经把她从合同里划掉了，柜台后面这个位置下周归别人，「除非有人坐进来，用这个编号登记，银面就不用登记了。」她把腕上那道磨掉一位的编号抄在一张手写单上，连同杯子一起推过来。「你坐进来，银面明天就不在了。你不坐，银面自己走，走了也不会有人查。」码头外沿的汽笛长鸣了一声，登记牌上那块空白被灯照得发亮，木桌上那道圈印也亮了一下。她把手收回袖子里，坐着没动，汽笛隔一会儿又响了一声。',
      when: { minFolded: 11 },
      options: [
        { label: '替她坐进去，用她抄下的那个编号登记', relation: 3, run: { intel: 3, track: { sin: 2, renown: 1 } }, flag: 'ym6_took_seat',
          after: '你在登记牌上填了那串编号。她把凉茶杯往你手边推了推，说你留个东西在这儿，往后来人问起银面，你就说她在。她走的时候没关门，门一直开着。第二天柜台上只剩那只杯子，杯底那个圈在木头里印得更深。，木头那道圈比昨天又深了一点。' },
        { label: '让她自己消失，登记牌交上去', relation: -2, run: { money: 45, track: { loyalty: 2 } },
          after: '你把空白登记牌交了上去，编号栏照实填了待核。她第二天没来，第三天杂物间的门上贴了新牌，编号是别人的。桌角那只凉茶杯被人收走，杯底那个圈过了两天也擦干净了，木头颜色浅了一块，比周围淡一档。，柜台上再没留过手写的东西。' },
        { label: '杯子留下，编号谁都不填', relation: 0, run: { intel: 2, track: { sin: 1 } },
          after: '你只把杯子留下了，编号那栏空着。她看了很久，把抄条对折收进风衣内袋，说空着也好。这间杂物间一直是空的，登记牌上那块空白漆从年头到年尾没填过，杯子就摆在桌上没人动，落了一层灰，杯口朝上。，登记牌上那块空白一直空到年底。' },
      ],
    },

    /* ============ 温仕成 · 终局 ============ */

    {
      id: 'ws-4',
      npc: 'wen-shicheng',
      stage: 4,
      act: 3,
      district: 'orbit',
      title: '温仕成：第十九行',
      text: '候船厅的大屏又亮起延误信息，红色数字滚了半小时，谁也没被通知上船。温仕成把名单折成四折，压在投诉台的玻璃底下，第十九行写的是他自己，工号后四位正好是生日，备注栏写着随行一人。他说这份名单用的还是上次那个模板，连错别字都没改，改名单的人显然不打算藏。「我要你帮我改一行。」他把钢笔帽拧开又拧回去，「把随行一人划掉。我不带人走，我这一走，我妹妹还在环带。」窗外一艘空船正在离港，梯子收上去的声音隔着玻璃也听得见。他把手按在玻璃上，指尖压着折痕那一处，压了很久，指腹都压白了。大屏上的红色数字又滚过一轮，他这才把手从玻璃上拿开。',
      when: { minFolded: 8 },
      options: [
        { label: '替他把随行一人划掉', relation: 3, run: { intel: 3, track: { sin: 2 } }, flag: 'ws4_struck',
          after: '你划掉了那四个字，笔迹尽量压平。他把名单重新折成四折，压回玻璃底下。三天后那班船靠港，闸口放行时他一个人上的梯，背包很轻。他在梯口回头看了一眼候船厅，广播正好开始报下一班船号，他没再看第二眼。' },
        { label: '拒绝，让他自己处理', relation: -2, run: { track: { loyalty: 2 } },
          after: '你说这一行我不动。他把钢笔帽拧回去收进衣袋，什么也没讲。第二天名单被投诉台清掉，他那一行还在，随行一人四个字也没划。那班船他上了，两个人一起走的，闸口记录里第二个人的名字签的是空名。，闸口的记录当天被人抄走了一份。' },
        { label: '先问他妹妹的工号', relation: 1, run: { intel: 4, track: { loyalty: -1 } },
          after: '你没动笔，先问了工号。他报出来，报完又重复了一遍，像怕你没记住。他把名单往你这边推了半寸，说这行字你随时可以改，改之前先记着那个号。那份名单从此一直压在投诉台的玻璃下面，谁都没再动过，连清台的人都绕开了那一格。' },
      ],
    },

    {
      id: 'ws-5',
      npc: 'wen-shicheng',
      stage: 5,
      act: 4,
      district: 'orbit',
      title: '温仕成：横线下面留空的那一行',
      text: '候船厅当天清场，广播停了，只剩行李车滚过地面的声音。温仕成坐在最后一排，名单摊在膝上，第十九行下面空出一行，他用尺子比着画了一条横线。他说名单要重抄一份报进系统，报进去就查得到是谁抄的。「我抄不了，我的字他们认得。」他把钢笔递过来，「你照着抄，横线那行留空。留空的意思是他们知道有人要补上去；不空，就补不上。」讲到一半他抬头看登船口，那里正在放下下一班船的梯子，梯子落地的声音很钝。他把妹妹的工号写在纸角上，又用手掌按住了，一直没松开，笔在另一只手里转了两圈。清场的时限快到了，广播里开始放预备登船的提示，他一个字也没听进去。',
      when: { minFolded: 10 },
      options: [
        { label: '按他说的抄，横线留空', relation: 3, run: { intel: 2, money: 40, track: { sin: 2 } },
          after: '你照抄了一份，横线那一行空着。两天后系统里出现第十八行，补的是一个化名，工号对不上任何人。温仕成把原件收进内袋，说空着那一行就是留给查的人看的。候船厅的大屏当天恢复运行，登船号照常滚动，他站在最后一排看了一会儿才走。' },
        { label: '明确拒绝，说这一行不能空', relation: -2, run: { track: { loyalty: 2 } },
          after: '你说不抄，也不留空。他把纸收回内袋，坐着看了一会儿登船口，然后起身走了。三天后系统里第十九行被补全，随行一人划掉，备注改成单人出行。他没再约过你，闸口的梯子照样每天放下三次，候船厅里那张投诉台换成了金属的。' },
        { label: '不抄，把名单拍下来留底', relation: 0, run: { intel: 4, chips: 1, track: { sin: 1 } },
          after: '你没抄，只把那份名单拍了下来，两半都拍。他看了一眼，说拍了好，拍的比抄的准。名单原件当晚被他投进候船厅的意见箱，第二天清早箱子就清空了。你手里那份替你把这一行留了下来，后来他再没提过那张纸。' },
      ],
    },

    /* ============ 雨客 · 潮的接触人 · orbit ============ */

    {
      id: 'ws-6',
      npc: 'wen-shicheng',
      stage: 6,
      act: 5,
      district: 'orbit',
      title: '温仕成：只剩一张的过闸票',
      text: '港区开始查名单，逐行核对，候船厅第一次坐了人，广播压得很低，报号的声音短了一截。温仕成等在闸口内侧，手里两样东西：一张过闸票，边角对折过；半张名单，就是上次撕开的那半，边上是毛的。他说第十九行被找出来了，查的人认得他的字，这一班船是最后一班不查的。「票只有一张。」他把票和那半张纸并排放着，「我上，名单就是物证；你上，我留在这儿把话讲完。你点哪一个。」闸机每隔一会儿响一声，红灯把地面照成一条一条的，正好从他鞋边切过去。他把钢笔也从内袋抽出来，搁在那半张名单上，笔帽没拧。闸机的红灯又扫过一遍，把两个人照在同一条光里。闸口外面那盏吊灯一直在晃。',
      when: { minFolded: 11 },
      options: [
        { label: '送他上船，撕掉半张名单', relation: 3, run: { intel: 3, track: { sin: 2, renown: 1 } }, flag: 'ws6_sent_him',
          after: '你把票推给他，半张名单当场撕了，碎片分两次扔进两边的垃圾桶。闸机放行，他一个人上的梯，背包里装着一件换洗衣服。那半张纸进了回收，查名单的人只找到第十八行，结案写着化名无实人，名单从此按十八行归档。' },
        { label: '让他留下作证，票交回窗口', relation: -2, run: { money: 55, track: { loyalty: 2 } },
          after: '你把票交回窗口，票款当场退进公司账。他把钢笔收进内袋，留在候船厅把话讲了一遍，讲了三个小时，笔录写到第九页。名单第十九行被核实，他领了两个月的行政处理，工牌没被收。那班船他后来再没上过，闸口的梯子照旧每天放三次。' },
        { label: '两样都不接，让他自己定', relation: 0, run: { intel: 3, chips: 1, track: { sin: 1 } },
          after: '票和名单都留在他手里，你一句没选。他在闸口坐到夜里，最后把票撕了、名单也撕了，两样一起投进意见箱。那一班船照常开走，他没上。后来他还在候船厅卖票，字写得比从前慢，卖完票会把票根压平再递出去。' },
      ],
    },

    /* ============ 雨客 · 终局 ============ */

    {
      id: 'yk-4',
      npc: 'yu-ke',
      stage: 4,
      act: 3,
      district: 'orbit',
      title: '雨客：他要进去一次',
      text: '第七接缝外沿结了冰，他那件雨衣的下摆冻得发硬，走一步响一下。雨客蹲在配电箱后面，把密封袋放在膝盖上，袋子外面又缠了三层胶带，结打在同一个位置。他说潮这次要人进去，进到接缝里面把一段线换掉，换完门就封，人人都知道封了就出不来。「我报了名。」他说这话时没抬眼看你，「袋子里的东西你先拿着，等我出不来那天，你替我送到环带第三水塔。」他报了一个工号，又报了一个名字，报完把袋子往前递了一半。缝口那里有风过来，把他额前的头发全吹到一边。他站起来把帽子扣上，往缝口走，走了几步又停下，等你伸手。缝口的冰在他脚下裂开一道，风把裂缝里的水吹出来。',
      when: { minFolded: 8 },
      options: [
        { label: '接下袋子，答应送到水塔', relation: 3, run: { intel: 3, track: { sin: 1, renown: 1 } }, flag: 'yk4_took_bag',
          after: '你把袋子接了过来，他又把袋口的胶带按紧了一下才松手。他报的工号和名字你都记住了。他走进缝口时没有回头，门在里面合上的声音很轻。第三天缝口封上，链条挂了一道铅封，铅封编号就是他进去那天登记的号。' },
        { label: '拒绝，让他自己留着', relation: -2, run: { track: { loyalty: 2 } },
          after: '你说不接。他把袋子抱回怀里，两只手抱着，站了一会儿才转身。他进去以后门封了，袋子的事潮那边找过你两回，你都说不知道。后来那个袋子被人从缝口推出来过一次，又推了回去，谁也没有拆开，封口的胶带一直没换。' },
        { label: '接下袋子，但要求先看一眼', relation: 1, run: { intel: 4, track: { sin: 1 } },
          after: '你说可以接，但要先看。他犹豫了几秒，拆开最外面那层胶带，让你看见袋子里的一块工牌和一张写坏的手写条。他说看过了就等于认了。你把胶带重新缠好，缠得比原来紧。他走的时候脚步比来时快，走到缝口才回头看了一眼。' },
      ],
    },

    {
      id: 'yk-5',
      npc: 'yu-ke',
      stage: 5,
      act: 4,
      district: 'orbit',
      title: '雨客：从缝口推出来的袋子',
      text: '进缝第三天，里面递出来一张条子，字是雨客的，只有六个字：门关上了，别等。第四天那个密封袋被人从缝口推出来，外面三层胶带少了两层，重新缠过，缠得很松，结打在侧面。你拆开看，里面多了一块工牌，是环带第三水塔的检修牌，牌子边缘涂着一小块蓝漆，和他那件雨衣上的补丁一个颜色。袋子里还有一张手写条，托你把工牌送到水塔第三格，收件人那一栏被水汽泡开，只剩一个字。潮那边当天又来问袋子在哪，问话的人站在你侧后方，一直盯着你的手，直到你把外套扣上，他才往缝口那边走。袋子最外面那个结你一直没解开，绳头留着他缠的那一段，摸上去还是硬的。缝口外沿的冰又开始结。',
      when: { minFolded: 10 },
      options: [
        { label: '按他说的，把牌子送到水塔第三格', relation: 3, run: { intel: 3, track: { sin: 1, renown: 1 } },
          after: '你去了第三水塔，第三格的管路归一个上了年纪的检修工管。他看了牌子一眼，什么都没问，把牌子塞进工具箱最底层，说这个人他记得。回来的路上你把剩下两层胶带拆了收好，袋子空着带回家，放在抽屉里，一直没扔。' },
        { label: '拒绝，把袋子交给潮那边', relation: -2, run: { money: 45, track: { loyalty: 2, renown: -1 } },
          after: '你把袋子交了出去。潮那边的人当着你的面拆开，看了工牌，把牌子留在自己手里，手写条撕成了两半。当天缝口的铅封换了一次号，旧号的记录被涂掉了。水塔第三格那天没等到任何人，值班表上那一栏也空着。，老检修工后来问过一次。' },
        { label: '先自己保管，谁也不交', relation: 0, run: { intel: 3, chips: 1, track: { sin: 2 } },
          after: '你把袋子压进抽屉最里面，谁也不交。潮那边来了三次，来了三次你都说不清楚。那块涂蓝漆的工牌一直没送出去，半年后它的边角锈出一层壳，锈迹从蓝漆边缘往里长。你后来再没打开过那个袋子。，袋子外面那层胶带你也收着。' },
      ],
    },

    /* ============ 荀戒 · 环带巡检员 · ring ============ */

    {
      id: 'yk-6',
      npc: 'yu-ke',
      stage: 6,
      act: 5,
      district: 'orbit',
      title: '雨客：只剩一个人认得的牌子',
      text: '接缝那道铅封挂了一个月，潮的人不再出现，缝口结的冰开始化，顺着外沿往下淌水。你把袋子里的工牌取出来，边角锈了一圈，蓝漆还剩一角，颜色比原来深。水塔第三格那位老检修工来找过你一趟，问你认不认得这块牌子，「认得他的人一个都没了。」他把牌子放在桌上，说水塔下个月拆第三格，拆之前得有人先认人，认完再拆，拆完牌子跟着管走。牌子边上那点蓝漆在灯下反光，像一小块没干的漆。他等你一句话：认，还是不认。窗外有车从港区开过去，灯扫了一层又灭了。桌角那块牌子摆了一晚，锈色在灯下看得更清，谁也没来收，值班室的钟走到两点，老检修工坐在椅子上睡着了。',
      when: { minFolded: 11 },
      options: [
        { label: '认下这块牌子，替他记着', relation: 3, run: { intel: 3, track: { renown: 2, sin: 1 } }, flag: 'yk6_remembered',
          after: '你在登记表上填了那个名字，工号是他报给你的那串。老检修工把牌子收回工具箱，说拆格的时候这块牌子会跟着走。你拿回那张写坏的手写条，一直夹在工作证后面，条子上的字被水汽泡过，还能看清，字迹拐得很急。' },
        { label: '不认，把牌子交回潮的档案', relation: -2, run: { money: 40, track: { loyalty: 2 } },
          after: '你把牌子交了上去，潮的档案收件栏盖了一个章，没写收件人。水塔第三格按计划拆了，那段管路换了新管，锈迹洗得干干净净。那块牌子进了档案库，编号后面一直空着归宿人，谁也没再动过那一格。，拆格那天谁也没去看那一格。' },
        { label: '把名字记在纸上，不签自己的名', relation: 0, run: { intel: 2, track: { sin: 1 } },
          after: '你把名字抄在一张白纸上，压在水塔的值班记录里，落款那栏空着，谁也不知道是谁写的。第三格拆完，那张纸被人扫出来过一次，又被人塞回原位。名字在纸上，牌子在箱底，两样对不上，也谁都没去对。，值班记录后来换过一本。' },
      ],
    },

    /* ============ 荀戒 · 终局 ============ */

    {
      id: 'xj-4',
      npc: 'xun-jie',
      stage: 4,
      act: 3,
      district: 'ring',
      title: '荀戒：影印件上的日期',
      text: '复核科的人昨天下午来过，把巡检本从一个铁柜里整本抱走，抱走前当着荀戒的面对了页码和页数，连装订线的松紧都核过。今天他约你在长廊尽头说话，手电没开，就着应急灯那点白光。他把一张纸摊在管线保温层上，是第三十一格那一页的影印件，页脚印着复印日期，比他的改动早三个月。「我动的那一页，是在复印之后写的。」他声音很平，「他们现在要我签字承认改动发生在原件上，签了这三十年就都不算了。你只要说一句：这份影印件你见过，见过它在我动手之前。」应急灯灭了一格，管线里的水声一直在响，顺着墙面往下走，墙根积了一小汪。他把影印件折好收进口袋。',
      when: { minFolded: 7 },
      options: [
        { label: '作证，说这份影印件我见过', relation: 3, run: { intel: 3, track: { sin: 2 } }, flag: 'xj4_saw_copy',
          after: '你说了那句话，复核科的人把影印件收进证物袋，页脚那行日期记进了笔录。荀戒当天没有被带走，第二天照常开工。他把手电重新打开，照在第三十一格上照了很久，说这一格往后按新的编号排。那天环带没停水，巡检本也照常归位。' },
        { label: '拒绝作证，让他按流程认', relation: -2, run: { track: { loyalty: 2 } },
          after: '你说不掺和。他没再讲什么，把影印件折起来塞进工装口袋，连夜去复核科签了字。第三十一格从此按改动后的记录归档，那页影印件从档案里消失。他后来在长廊上遇见你，只点了一下头，手电照在你脚边的霜上。' },
        { label: '先去查原件的借阅记录', relation: 1, run: { intel: 4, track: { loyalty: -1 } },
          after: '你先去查了借阅记录，原件在两个月前被人调走过一次，签名栏空着。你把记录抄给荀戒，他看了一遍，说这一趟还是得他自己签。他把抄条折小塞进手电后盖，说留着以后能验。复核科那边，他当天没有签，本子也没交。' },
      ],
    },

    {
      id: 'xj-5',
      npc: 'xun-jie',
      stage: 5,
      act: 4,
      district: 'ring',
      title: '荀戒：中控室里的三样东西',
      text: '听证排在周四上午，地点是环带中控室。长桌上摆着三样东西：巡检本原件、那页影印件、一支手电，手电是荀戒那支，灯罩上有磕痕。他要你当证人，说的只有一句话：那页抄写发生在复印之后。他站在桌边，把巡检本翻到第三十一格，翻的时候手指避开了页脚，像怕碰坏什么。他说这一句出口，他工号后面会挂上一条记录，你的名字会跟他排在同一行。「你要是不来。」他把手电推到桌子中间，「我就照他们写的签，签完这三十年就都不算了。」中控室的风机一直响，台下坐了七个环带的人，谁都没说话，笔录员的手停在纸上。手电就摆在桌子正中间，灯一直没开，谁也没去碰。',
      when: { minFolded: 10 },
      options: [
        { label: '到场作证，跟他排在同一行', relation: 3, run: { intel: 3, track: { sin: 2, renown: 1 } },
          after: '你到场把那一句说了，笔录记了两页。结论下来，改动属实但非法，处罚折半，荀戒保留了巡检岗。他把手电从桌上拿回来，灯罩上那道磕痕对着你这一侧。环带那天没停水，七个旁听的人散场时都看了你一眼。，笔录员把本子合上时手一直在抖。' },
        { label: '拒绝作证，也不去现场', relation: -2, run: { track: { loyalty: 2 } },
          after: '你没去。听证照常开，他一个人把话讲完，讲到最后一句时停了很久。结局是工号后面挂上一条改动记录，巡检岗调去仓库点料，手电交了回来。他把手电放在操作台上，说这支灯以后只照焊缝，不照页码。，仓库点料那间屋子没有窗。' },
        { label: '到场，但只说影印件的日期', relation: 1, run: { intel: 4 },
          after: '你到场只讲了影印件页脚那行日期，没有替他的动机作保。复核科把日期核了一遍，结论写着日期属实、动机不明。他点点头，说这一句也够了。回环带的路上他把手电的开关拨了两下，灯亮了一下就灭，他也没再拨第三次。' },
      ],
    },

    /* ============ 萨尔 · 潮的拾荒者 · outside ============ */

    {
      id: 'xj-6',
      npc: 'xun-jie',
      stage: 6,
      act: 5,
      district: 'ring',
      title: '荀戒：最后一班的那本记录',
      text: '环带整体换管，旧巡检本要归档封存，封存前有一道核对，三十年里所有改动都得报一次。荀戒值最后一班，把巡检本摞在操作台上，最上面那本翻在第三十一格。他说仓库点料的日子比巡检松，他有时间把那三十年抄一遍，「抄出来公开，环带得停；不抄，这本子明天进库，往后谁都看不见。」他把那支手电从抽屉里拿出来，灯罩上的磕痕朝上，灯泡是新的。「你要我把它照完，还是要我把它关掉。」操作台底下的地面在轻轻抖，是水泵在换班。长廊尽头结了新霜，白的一片，从墙根一直铺到脚边，走一步响一下。操作台边上还搁着他那本没合上的巡检本，页码停在第三十一格，纸角翘着。',
      when: { minFolded: 12 },
      options: [
        { label: '让他抄，把三十年的记录公开', relation: 3, run: { intel: 4, track: { renown: 2, sin: 1 } }, flag: 'xj6_published',
          after: '他抄了四十一页，按段编号，交去环带工会公开栏贴了三天。环带停了四十八小时换管，三千人领了配给水，没有出事。他把手电留给你，说这支灯以后照哪一格都行，不用再对着页码。贴过的那几页被风吹卷了边，谁也没去揭。' },
        { label: '让他把本子原样交上去', relation: -2, run: { money: 45, track: { loyalty: 2 } },
          after: '本子第二天进了库，第三十一格那页压在封条底下。核对结论写着历年记录完整，无一例改动。他照常点料，点完就去长廊尽头站一会儿。手电交回了工具间，和别人的一排灯挂在一起，磕痕朝里，谁也没认出那一支。' },
        { label: '手电收下，抄不抄他自己定', relation: 0, run: { intel: 2, track: { sin: 1 } },
          after: '你把手电收下了，没让他抄，也没让他交。他把本子摞回去，第二天照常送进库。那三十年他到底报了多少改动，没人知道。手电在你家里放着，隔一阵你拨一下开关，灯还亮，光比原来暗一些，照在墙上是个圆。，墙上那道圆比原来小。' },
      ],
    },

    /* ============ 萨尔 · 终局 ============ */

    {
      id: 'se-4',
      npc: 'sa-er',
      stage: 4,
      act: 3,
      district: 'outside',
      title: '萨尔：她要一次开门',
      text: '穹顶侧门的检修口一共只开过几次，铰链上的漆早掉光了，露出底下的锈。萨尔带着三个人等在口子外头，都用废帆布裹着，其中一个女孩的手上还有没拆的针脚，线头露在袖口外面。她把滤水泵塞回你怀里，泵壳上的划痕比上次又多了几道。「潮里泡过的人活不过两个冬天。」她说，「门开十一分钟，人进去，门关上。你在里面按开关，剩下的我来。」说完她从怀里掏出十几块编号牌，一块一块摆在脚边，像在数人头。「他们进去以后，牌子归你。往后要认人，你只能认牌子。」她把手按在铰链上，等你答话，掌心压着那道掉漆的边。外面的风把帆布吹得贴在身上，三个人的脸都蒙着。',
      when: { minFolded: 8 },
      options: [
        { label: '按她说的，按下开关', relation: 3, run: { intel: 2, track: { sin: 2, renown: 1 } }, flag: 'se4_opened',
          after: '你按了十一分钟。门内侧的灯灭了两回又亮回来，三个人贴着你身后走过，鞋底带进来的水在地上拖了一长道。门合上以后，萨尔把地上的编号牌推给你，一共十四块，都有拆过的印子。她说明年起，认人只能靠这些牌子。' },
        { label: '拒绝，说这道门我不能开', relation: -2, run: { track: { loyalty: 2 } },
          after: '你说不开。她盯着你看了几秒，把滤水泵收回怀里，领着那三个人沿穹顶外沿走了，走很远还能看见帆布下面那双没拆针脚的手。第二天侧门的铰链被人浇了焊，检修口的漆面盖住了原本的划痕。那十几块编号牌一块也没留在原地。' },
        { label: '开门，但只放一个进来', relation: 0, run: { intel: 2, track: { sin: 1 } },
          after: '你只按了一小会儿，门缝开出一个人的宽度，进去的是那个女孩。萨尔在门外没有进来，把剩下的帆布裹紧了。门合上后她在外面站到天黑，脚的印子留在潮水压平的沙地上，第二天还在，第三天被雨冲平了。，门的铰链上留了一道新的磨痕。' },
      ],
    },

    {
      id: 'se-5',
      npc: 'sa-er',
      stage: 5,
      act: 4,
      district: 'outside',
      title: '萨尔：门开过以后',
      text: '门开过那次，进来三个人，走了两个，那个手上有针脚的女孩留在检修口内侧蹲着，一直没起来。萨尔没进来，站在口子外面，一只手按着铰链。巡检来得比预想快，先量铰链的磨损，再数地上的脚印，一个人数了两遍。「三个人。」她先开口，「两个是路过的，一个是我。」这句话说完她看着你，等你接。她脚边那十几块编号牌还摆着，分成了三摞，其中一摞少了一块，空出来的印子还很清楚。她把滤水泵从怀里取出来，泵身上多了一道很新的划痕，划痕里嵌着一点红锈，她没去擦，就那么举着等你回话。巡检的人把本子翻开一页，笔尖悬在上面没落，风把纸角吹得直响，谁也没先写字。',
      when: { minFolded: 10 },
      options: [
        { label: '替她把那一个人认下来', relation: 3, run: { intel: 3, track: { sin: 2 } },
          after: '你说进去的是她。巡检记完脚印走了，铰链加了一道封条。她把泵塞回你手里，说这份算她的。那个女孩当晚被送进城里，登记用的是你部门的一张临时卡，卡上的名字是空的，三天后那张卡被注销，注销单压在抽屉里。' },
        { label: '拒绝替她担，照实说三个人', relation: -2, run: { track: { loyalty: 2 } },
          after: '你照实讲了。巡检把两个人带走登记，铰链的封条当场焊死，检修口这一季再没开过。萨尔把编号牌一块块收回怀里，收完站在口子外面看了很久，然后沿穹顶外沿走，没回头。那块滤水泵她带走了，泵壳上的划痕一直没补。' },
        { label: '只认一半，说进去的是两个人', relation: 0, run: { intel: 2, track: { sin: 1 } },
          after: '你说进去的是两个，另一个是自己钻进来的。巡检按两个人的口径登记，留了一页待核。萨尔把剩下那摞牌子分成两半，一半塞给你，说这一半往后你替他们记着，别当没发生过。那页待核的记录后来一直空着。，第一页的边角被翻得起了毛。' },
      ],
    },
  
/* ============ 班头 · 回收场领班 · salvage ============ */

    {
      id: 'se-6',
      npc: 'sa-er',
      stage: 6,
      act: 5,
      district: 'outside',
      title: '萨尔：清口子外面那两百步',
      text: '侧门那圈焊过的封条起了壳，巡检走后没人再补，缝里塞了沙。萨尔等在口子外面的沙地上，帆布收了，脚边十四块编号牌码成两摞，压着那块滤水泵，泵壳上的划痕朝上。她说巡检要清口子外两百步，清完这一带就再没人待得下。「三条路。」她把泵拎起来晃了晃，泵壳里的水响了一下，「我跟你进去，牌子归你，我算你部门的人；我留在这儿，门我自己焊上，谁都别来；你把这摞牌子带走，就当没见过我。」潮水正往上涨，沙地上先前那些脚印一个一个被填平，边上的义体壳子被水泡得发白。她把泵放回两摞牌子中间，站着没动。口子里的灯灭了一格，铰链的影子在沙地上拉长了一截。',
      when: { minFolded: 12 },
      options: [
        { label: '带她进城，牌子一起带走', relation: 3, run: { intel: 2, money: 30, track: { sin: 1, renown: 1 } }, flag: 'se6_brought_her_in',
          after: '她跟着你进了侧门，登记用的是一张临时卡，编号空着。十四块牌子你带回城里，装进一个铁盒。她在城里住了三天，第四天自己搬去了环带的旧宿舍，说那儿离水塔近，心里踏实。泵留给了你，泵壳上的划痕一直没补。' },
        { label: '按流程办，把牌子交上去清场', relation: -2, run: { money: 50, track: { loyalty: 2 } },
          after: '牌子交了上去，清场按通知执行，口子外两百步整平了。萨尔当天就没了踪影，谁也没再见过她。巡检在沙地上找到一块拆到一半的义体，编号磨得看不清，登记单上归了失物。你的处理结果写着流程合规，那一栏下面没有备注。' },
        { label: '把牌子带走，谁也不带走', relation: 0, run: { intel: 3, gear: 1, track: { sin: 2 } },
          after: '你把牌子收进包里走了，她也没跟来。门当天晚上被焊上，焊口的颜色比旧漆亮。半年后你在城里认出一块牌子上的编号，对上了环带一张旧档案。你把铁盒从柜子里取出来，重新数了一遍，十四块还在，一块没少。' },
      ],
    },

    {
      id: 'bt-4',
      npc: 'ban-tou',
      stage: 4,
      act: 3,
      district: 'salvage',
      title: '班头：停线通知',
      text: '拆解线的停线通知上午十点挂上去，红纸黑字，贴在闸门上，下面署着你部门的章。班头把线停了，可传送带没清，十二个货箱原封不动码在尽头，箱口的封条写着入库日期，其中四个是三天前的。他把你领到箱前，那副磨白的皮手套在第三个箱子上敲了两下，里面闷闷地回了两下，停了一会儿，又回了一下。「这批货没拆完。」他往下压了压嗓子，「有个箱子里的人在敲，敲了两天。照单走，我明天就得开线，开线就是往里送水。」他说完把手套的指尖捏了捏，指尖那一圈已经磨得透光。仓房另一头的制冷机一直在响，谁也没去关，货箱表面的白霜一层一层往外长。他的手套一直没摘。',
      when: { minFolded: 7 },
      options: [
        { label: '撕开封条，先看第三个箱子', relation: 2, run: { intel: 3, track: { sin: 2 } }, flag: 'bt4_opened_box',
          after: '你和班头一起撕的封条。箱子里面蜷着一个人，嘴唇发青，手指还在动。班头把手套摘下来盖在他脸上挡光，说拆解线今晚不能开。那个人后来被抬进值班室，登记簿上第三箱那一行写的是空箱，页脚压着一个他自己的手印。' },
        { label: '拒绝开箱，让他照单办', relation: -2, run: { track: { loyalty: 2 } },
          after: '你说照单办。班头戴上手套，把第三个箱子推上传送带，箱子进水槽的时候他背过身去。当晚十二个箱子全部拆完，交接单上落的是他的编号。第二天他照常来接早班，手套换了一副新的，旧的那副塞在抽屉最底下没扔。' },
        { label: '让他先把箱子挪进冻库', relation: 1, run: { intel: 2, track: { sin: 1 } },
          after: '箱子被挪进冻库最里面那格，班头自己搬的，没让人搭手。挪动记录写成设备检修，签了他的名字。停线的日子一天天过去，他每天去冻库待十几分钟，出来时手上都是霜，谁也不问他在里面做什么。，白汽每天都在同一个时间往外涌。' },
      ],
    },

    {
      id: 'bt-5',
      npc: 'ban-tou',
      stage: 5,
      act: 4,
      district: 'salvage',
      title: '班头：那张挪动记录',
      text: '冻库第三格那个箱子被人翻出来了，箱口的封条重新贴过，日期和巡检的台账对不上。班头戴着新换的皮手套站在库门口，说巡检已经问过两回，问的是谁挪的箱子、谁把检修记录改成设备故障。「单子上签的是我的编号。」他把手套摘下来，搭在冻库的把手上，「我认，最多调岗；你要是现在把那张挪动记录从你部门的单据里抽出来，这事就落我一个人身上，我认得更省事。你抽不抽。」冻库里的白汽一阵一阵往外涌，贴着地面散开，把门槛边上那副旧手套的印子盖住了，又露出来，白汽里带着一股铁锈的味。他没再说话，就那么看着你。他没再说话，就那么看着你，手套边的霜化成一圈水。',
      when: { minFolded: 10 },
      options: [
        { label: '抽走那张挪动记录，替他兜下', relation: 3, run: { intel: 3, track: { sin: 2 } }, flag: 'bt5_pulled_slip',
          after: '你把那张记录抽了出来，单据里留了一道裁口，谁也没追问。巡检结案写着设备故障检修，班头记了一次警告。他照旧戴那副新手套来上班，旧手套一直放在把手边上，谁也没扔。冻库第三格那箱子的记录再没被翻起来。' },
        { label: '拒绝，把记录留在单据里', relation: -2, run: { track: { loyalty: 2 } },
          after: '你说不抽。他把手套戴回去，什么也没讲，转身在账上签了自己那串编号。三天后调岗通知下来，他去点料，不进拆解线了。那张挪动记录留在你部门，稽查科来借阅过一次，看完还了回来，纸角多了一道折痕。，那副旧手套一直压在抽屉最底下。' },
        { label: '不抽，替他跑一趟申诉', relation: 1, run: { money: 40, intel: 2, track: { sin: 1 } },
          after: '你没抽，转去替他跑了一趟申诉，走的是工伤认定的口子。申诉上到第二级被驳回，好在调岗没降薪。他把酬谢塞给你，是一副旧手套，掌心那两块磨得发亮，说这副才是他真正戴了六年的，让你收着。，你收进抽屉，一直没舍得戴。' },
      ],
    },

    {
      id: 'bt-6',
      npc: 'ban-tou',
      stage: 6,
      act: 5,
      district: 'salvage',
      title: '班头：钥匙搁在登记簿上',
      text: '值班室那张登记簿翻到第三箱那页，上面写着空箱。人抬走以后在城里活了六天，第六天名字又被人从名单里划掉。班头把登记簿推到桌子中间，抽屉里那副旧手套和那只接管都在，接管上的编号被磨掉了一半。他说巡检已经拿到冻库的钥匙，明天开库，箱子里剩的那点痕迹一看就知道不是空箱。「三条道。」他把钥匙搁在簿子上，「我把它藏起来，明天说库锁坏了；我把簿子交上去，人名写我的；我把钥匙给你，剩下的你自己写。」值班室的暖气管在响，一下一下，像有人在里面敲。他两只手都放在桌上，没有去碰那把钥匙。钥匙上那根皮绳磨得起了毛，绳结打得很旧，谁也没动过。',
      when: { minFolded: 11 },
      options: [
        { label: '帮他藏，对外说库锁坏了', relation: 3, run: { intel: 2, track: { sin: 2, renown: 1 } }, flag: 'bt6_hid_box',
          after: '你们把第三格那点痕迹清了，报的是锁芯锈死、开库延期。巡检来过一次，量了锁孔就走了。班头把那副旧手套和接管一起锁进抽屉最里面，说这两样留着，往后认人用。拆解线第二天重新开，传送带的声音跟以前一样。' },
        { label: '把钥匙和簿子交上去', relation: -2, run: { money: 55, track: { loyalty: 2 } },
          after: '你把钥匙和登记簿一起交了上去，第三箱那页抄了一遍附在后面。巡检结案写着违规作业，班头记过一次，扣三个月绩效。他照常来接早班，只是不再戴手套碰箱子，手冻得发红也空着手。那副旧手套一直躺在抽屉里。' },
        { label: '钥匙收下，簿子留在原处', relation: 0, run: { intel: 3, track: { sin: 1 } },
          after: '你把钥匙收进兜里，簿子留在桌上，什么也没说。第二天巡检开库，锁没坏，箱子里是空的。班头说可能是他记错了页数，结论按记录误差结案。那把钥匙一直在你手里，后来你也忘了它是哪一年配的。，巡检那边也没再来查过库。' },
      ],
    },

    /* ============ 无面 · 记忆银行柜员 · memory ============ */

    {
      id: 'wm-4',
      npc: 'wu-mian',
      stage: 4,
      act: 3,
      district: 'memory',
      title: '无面：多出来的第三班',
      text: '记忆银行这周换了排班表，柜员那一栏只剩一个编号，班次从两班压成一班。无面翻着表看了很久，把表推给你，指着一栏空白：「第三班是它上的，可它不记得上过。」它把号单翻过来，背面又是那行字，字迹比上次清楚了一些，笔画也整齐了一些。「这段记忆先出现在调阅记录里，昨天开始出现在别人的排班表上。」它说这话时用了第三人称，一只手一直按在表格那一栏上，「无面想知道，如果它从这里走出去，登记栏上还剩什么。」斜面灯有一格是坏的，光落在柜台上断成两截，它把表挪到亮的那半边，空白那一栏正好在光里。柜台外的号单压在窗口下面，一张没少，号码排到四十九。',
      when: { minFolded: 8 },
      options: [
        { label: '替它把第三班记下来', relation: 2, run: { intel: 3, track: { sin: 1 } }, flag: 'wm4_third_shift',
          after: '你在排班表那栏空白里补了一行，笔迹尽量写得平。它把表收回去，压在斜面灯下，说这一班往后就算有过了。第二天调阅记录里那行字淡了一些，排班表上第三班还在，签的是它自己的编号，谁也没来问过。，它把那页表折了个角。' },
        { label: '要求先调那一班的操作日志', relation: 1, run: { intel: 4, track: { loyalty: -1 } },
          after: '你要求先看日志。日志调出来了，第三班那两小时里只有一条操作记录：调阅三十七号，用途写着核对。它读完把日志合上，说核对这两个字不是它写的。那天之后它开始自己抄每一班的流水，抄得很慢，一页要写很久。' },
        { label: '说这不是我该确认的事', relation: -2, run: { track: { loyalty: 1 } },
          after: '你说不确认。它把手写单翻回去，号单照原样还给你，背面那行字还在。这周排班表第三栏的空白一直没补，柜员名录的核对被报到了复核科。它照常坐在柜台后面读号、翻单、盖章，速度比上个月慢，盖章的位置却没偏过一次。' },
      ],
    },

    {
      id: 'wm-5',
      npc: 'wu-mian',
      stage: 5,
      act: 4,
      district: 'memory',
      title: '无面：担保栏',
      text: '清柜通知下来那天，无面把柜台后面的抽屉一个个清空，只剩那张号单，背面那行字已经能被灯照得看清。它说这段记忆取出来，它就得从柜台后面走出来，走出来的那个不叫无面。取件单已经报了上去，主审要一个担保人，担保栏得填一个在职编号，出了问题由担保人接。「无面填不了自己。」它把笔放在单子边上，笔杆朝你，「名字落上去，无面就取；不落，这份单明天作废，那段记忆归档案，归进去就再没人认领。」柜台上那盏斜面灯换了新灯泡，光落在担保栏那一格上，一格一格很整齐。它把手放在单子上，没有翻页，一直没翻。窗口外的号码牌翻到了下一号，叫了两声没人应。',
      when: { minFolded: 10 },
      options: [
        { label: '在担保栏填上自己的编号', relation: 3, run: { intel: 3, track: { sin: 2, power: 1 } }, flag: 'wm5_guaranteed',
          after: '你填了编号，落款压得很实。取件单当夜进了主审，两天后批下来。无面把号单收进内袋，说这一笔它记着。清柜那天柜台后面空了半格，斜面灯照在空处，比平时亮一点，也照得更远一点。，柜台后面的抽屉空了一格，灯照进去。' },
        { label: '拒绝担保，让它走档案', relation: -2, run: { track: { loyalty: 2 } },
          after: '你说不担保。它把笔收回笔筒，把取件单对折两次，送进了作废格。那段记忆当天归档，归属栏写着待认领。它照旧坐在柜台后面读号、翻单、盖章，速度跟从前一样，只是不再用第三人称说自己。，它把号单背面那行字又抄了一遍。' },
        { label: '填，但要求先看那段记忆', relation: 1, run: { intel: 4, track: { sin: 1 } },
          after: '你说可以填，但要先看。它调出那段记忆，只放了一小段：一个下雨的门口，一只手按在把手上，指尖压得很紧。它说你看到的就是这些，后面的连它也认不出。你填了编号，它把号单叠好塞进内袋，说这一笔往后你还得替它作证一次。' },
      ],
    },

    {
      id: 'wm-6',
      npc: 'wu-mian',
      stage: 6,
      act: 5,
      district: 'memory',
      title: '无面：两张单子',
      text: '记忆银行这个月清柜，柜员名录重排，三十七号那一栏从名录里被划掉，编号空着，划痕比别的栏深。无面把斜面灯修好了，灯全亮，柜台第一次照得没有影子。它推过来两张单：一张取件单，取的是三十七号那段不属于它的记忆，取完柜台后面这个编号就空着没人补；一张注销单，注销的是它自己。「无面只能签一张。」它说这话时头一次用了第一人称，说完又改了回去，「你替无面看，签哪张。」两张单子并排摊在灯下，纸面压得很平，边角一个折痕都没有。它把手放在两张单子中间那道缝上，等你开口，指节一直没动。灯下没有影子，柜台前后都很亮，连柜员那一栏的名字也照得出来。',
      when: { minFolded: 12 },
      options: [
        { label: '让它签取件，记忆你带走', relation: 3, run: { intel: 4, chips: 1, track: { sin: 2, renown: 1 } }, flag: 'wm6_extracted',
          after: '它签了取件单，凭证是一张薄薄的载体，你用内袋装好。柜台后面那个编号当天注销，名录上留了一格空。你走的时候灯还全亮着，它说这一段往后归你拿着，别再送回来。载体在你抽屉里放了很久，纸边一直没黄。' },
        { label: '让它签注销单，编号归档案', relation: -2, run: { money: 45, track: { loyalty: 2 } },
          after: '它签了注销单，签名栏写得比平时慢。柜员名录上三十七号正式注销，那段记忆按无主件封存。它最后一班照常坐到收柜，灯一格一格关掉。你出门时回了一次头，柜台后面已经没有人了，斜面灯是灭的，柜台上那张号单也不在。' },
        { label: '两张都不签，把单子退回去', relation: 1, run: { intel: 2, track: { sin: -1 } },
          after: '你把两张单子都推了回去，说它自己定。它把单子收进抽屉，压在号单下面，什么也没签。清柜那天它是最后一个走的，灯关了才出来。三十七号那一栏整年空着，编号没补，也没注销，谁来问都答还在核对。，那格空着的编号一直没补。' },
      ],
    },
/* ============ 铁贵 · 终局 ============ */
  ];
})();

/* ===== game/voice-a.js ===== */
/* NPC 语音库 A 组：8 人。由内容设计生成。 */
(function () {
  'use strict';
  window.NPC_VOICE_A = {
    'wen-duo': {
      name: '闻铎',
      role: '董事会监事',
      district: 'tower',
      low: [
        '你把编号报得太快了。真话不用抢着说。我记得你上个月交的材料，第三页和第五页不是同一个人写的。',
        '别站那么近。我不收东西，也不收话。你要真想让我记住你，就把下次的简报写得短一点，短到能一次念完。',
        '监事会不看结果，只看流程有没有被绕过。你现在这个走法，三个月之后我得亲自找你谈一次，谈完你自己收拾。',
        '你今天来是想问事，还是想让我看见你来过。这两件我都能帮，价钱不一样，你先说清楚要哪一件。',
      ],
      mid: [
        '董事会里有一半人已经不记得上次的决议内容了。这不是坏事，木头上的人不咬人。你要小心的是那些还记得的。',
        '我年轻的时候也以为写进记录的东西才算数。后来我发现，真正算数的是那些被人从记录里删掉的东西。',
        '你这周别去交易所那一层。有些账在对，对完谁在场谁要签一个字，那栏不是给人手写的。',
        '我本子里记了三百多个人，能活到退休的不多。他们有个共同点：都肯让出一点自己本来就不在乎的东西。',
      ],
      high: [
        '我女儿在环带做巡检。她的名字在我自己的名单上，排第三十一。我每天上班就是在想办法把这个顺序往后挪。',
        '我盯了七年董事会，一次都没往上递过东西。我算过，递上去最多拉下来两个人，剩下的会把我女儿的班次排到四十一号接缝去。',
        '你要是真有那一天，记得我这份本子。它不厚，可它记得住谁在什么时候，替谁改过一行字。',
        '我这辈子没给人倒过茶。你上周那杯凉的，是我第一次倒的。别谢我，我是在赌你以后用得上。',
      ],
      reactions: [
        { when: { sin: [7, 12] }, text: '你身上那个味道我认得。他不再看你，把本子推到桌子另一头。以后见面记得隔一张桌子，这话我只说一次。' },
        { when: { loyalty: [0, 2] }, text: '他把茶杯盖上。你最近对董事会说话的态度，我这里有三份记录，三份都写得很难看。我不想再添第四份。' },
        { when: { money: [0, 15] }, text: '你这个月的报销单我看到了。不是同情你，是提醒你，穷的人最容易被钱叫去干活，干完还得自己签收。' },
        { when: { folded: [8, 12] }, text: '你折到第八张了。他第一次没有翻本子。我到这个数的时候也是一个人，剩下几张，别人不会再替你数。' },
        { when: { power: [8, 12] }, text: '你现在能自己叫电梯上四十七层了。这不全是好事。那一层的门，进去容易，出来得有人替你按。' },
      ],
      topics: [
        {
          id: 'wd1', label: '问他监事会手里有什么', once: true, minRelation: 0,
          reply: '他翻到本子第一页给你看，上面只有三行：审计口径、人事异动、越权签发。他说这三样都要留底，留底的意思就是永远有人能翻到。他还说监事会一年只看两个人的档，今年一个看完了，另一个还没定。',
          give: { intel: 2 }, track: { loyalty: 1 }, relation: 1,
        },
        {
          id: 'wd2', label: '问他上次的决议删了什么', once: true, minRelation: 0,
          reply: '他说没有删，只是没写。上次那份决议关于三号项目的追加，写进记录的是一亿四，实际批下去的是两亿一。差的那七千万在另一份文件里，那份文件没有编号，也没有签收人，只有一栏空着。',
          give: { intel: 3 }, track: { renown: 1 }, relation: 1,
        },
        {
          id: 'wd3', label: '问他本子里记了我什么', once: true, minRelation: 3,
          reply: '他说记了你三次。第一次是你报编号时的语速，第二次是你没接那杯茶，第三次是你今天进门先看窗子、后看人。他说这三条单看都没用，凑在一起能看出一个人怕什么，怕的东西在哪一层。',
          give: { intel: 2 }, track: { power: 1 }, relation: 1,
        },
        {
          id: 'wd4', label: '问他名单上还有谁', once: false, minRelation: 3,
          reply: '他把本子往回抽了半寸，报出两个名字，都是你认识的中层。一个上个月调去了轨道港，一个还在原岗位，但半年没签过字。他说这两个人唯一的区别是，一个自己走了，一个在等通知，等的人通常等不到。',
          give: { intel: 3 }, track: { sin: 1 }, relation: 2,
        },
        {
          id: 'wd5', label: '问他有没有怕的东西', once: true, minRelation: 6,
          reply: '他看了很久窗外那条接缝，说他怕的是一份人事表上他女儿那一栏的出生年份。他说自己盯了七年别人，只有那一栏是怎么算都算不平的账，每年都要重新填一次，每年填的数都不一样。',
          give: { intel: 3, chips: 1 }, track: { renown: 1, power: 1 }, relation: 2,
        },
      ],
      first: '早会散得比平时快。你没来得及走，监事已经在门口等你，手里那杯茶一口没动。他说他叫闻铎，负责盯着董事会里谁在越界，也负责盯着你这样的新人。他问你编号前四位，然后记在本子上。走廊的空调正好在这一刻停了，你们谁都没提这件事。',
    },

    'su-wen': {
      name: '苏纹',
      role: '董事会日程官',
      district: 'tower',
      low: [
        '请坐，但不要坐那一张，那是我留给下一位的。她把你的名字在屏幕上往下拖了一格，你先等一会儿，顺序会自己说话。',
        '你的面谈在周三下午两点，时长二十分钟。她念完才抬头，二十分钟是我的标准配置，不是给你的评价，别多想。',
        '改期要走流程。她把表格推过来，流程本身不慢，慢的是审批它的人。你上次那张表还停在第四级，没人催它。',
        '我不记人的脸，我记编号。她笑了一下，笑得很标准。你上次来穿深色，这次穿浅的，这对我的工作毫无帮助。',
      ],
      mid: [
        '今天下午三点的会取消了两个人，其中一个是我叫出去的。她一边改排期一边说，有些会开不成，比开成了有用。',
        '我这张表上，有些人一周出现四次，有些人三个月一次。你不用问我是怎么排的，你只要看谁总排在最后一格。',
        '你上次问的那个人我查了。他确实在会上，但记录里没有他的名字。这种情况一般是有人替他签了到，签的人还在岗。',
        '顺序表其实不排事，排的是人和人之间的距离。你今天排第四位，说明上面对你还算有耐心，耐心是有额度的。',
      ],
      high: [
        '我母亲后天从穹顶外面进来。手续都齐了，只差一趟高塔电梯和一次访客确认。我把你下午那两个小时留空了，用的是会议的名义。',
        '我做这份工作九年，唯一一次改动顺序，是把一个人的面谈往后推了三天。三天后他没有再来，那件事也没人再提。',
        '我不喜欢记编号，可记久了会明白，编号是唯一不会撒谎的东西。你的编号后面被加过一个字母，你想知道是哪一个吗。',
        '我桌上有一份永远不打开的信封，是我自己的排期变更申请。写好了，没交。晚上加班我会看一眼，然后放回去。',
      ],
      reactions: [
        { when: { sin: [7, 12] }, text: '你手上那个东西，进我这条走廊之前先收起来。她把登记板翻过来挡在两人中间。我不做记录，但别人的眼睛会做。' },
        { when: { loyalty: [0, 2] }, text: '她调出你的考勤表，指着两个空档。这两个小时系统里写的是外出。写外出的人，回来通常要被叫去谈一次。' },
        { when: { money: [0, 15] }, text: '你的报销拖了三周。她轻声说，我可以让它从别的科目里过，但那样它的编号就得改。你付不起改编号的代价。' },
        { when: { folded: [8, 12] }, text: '这是第八张了。她翻了一下你的记录。前面七张的时间我都能背出来。后面几张，你是不是开始不看日子了。' },
        { when: { power: [8, 12] }, text: '你现在可以自己约人了。她把屏幕转开。但同时约你的人也多了一倍。我给你留的那两个空格，本来是我自己的。' },
      ],
      topics: [
        {
          id: 'sw1', label: '问她今天谁被跳过', once: true, minRelation: 0,
          reply: '她把护腕转过来，指着第三行说，今天有两个人被跳过，一个是外派回来的处长，一个是刚升上来的你。她说跳过那一栏填的原因是日程冲突，但填这栏的人是她，所以你可以理解为这是她的意思。',
          give: { intel: 2 }, track: { loyalty: 1 }, relation: 1,
        },
        {
          id: 'sw2', label: '问她排期的规矩是什么', once: false, minRelation: 0,
          reply: '她说规则只有一条：谁排在最后，谁就是今天最不重要的人。她说这不是评价，是提醒，因为重要的会永远占着前两格，剩下的格子是用来装人的，装满了就往下压，压到底就没人看得见。',
          give: { intel: 2 }, relation: 1,
        },
        {
          id: 'sw3', label: '问她这个月谁的会最多', once: true, minRelation: 3,
          reply: '她调出统计，指着一个名字说这个人一个月出现了十九次，位置从第七格升到第一格，中间没有升职，也没有调岗。她说这种情况只有一种解释：有人开始需要他在场，而需要他到场的那件事还没开始。',
          give: { intel: 3 }, track: { power: 1 }, relation: 1,
        },
        {
          id: 'sw4', label: '问她能不能插一个会', once: false, minRelation: 3,
          reply: '她说可以，但插进去的会必须从别人那里挪时间。她报出三个名字，让你选一个，其中一个是上次替你说过话的人。她说选完不要改，改的话下一次你的名字会自动落到最后一格，而且我不解释。',
          give: { intel: 2 }, relation: 2,
        },
        {
          id: 'sw5', label: '问她自己有没有排期', once: true, minRelation: 6,
          reply: '她愣了一下，说她没有排期，她的名字只在系统里出现过一次，是三年前入职那天。停了几秒，她说明年她母亲要做一个手术，她需要把那一天空出来，可她的表上没有一天是她自己的，一格都没有。',
          give: { intel: 3, money: 30 }, track: { renown: 1 }, relation: 2,
        },
      ],
      first: '你在走廊尽头找会议室，走了两圈都没找到。一个短发女人从屏风后抬起头，说你迟到了十一分钟，会已经开完。她把护腕转过来，上面贴着今天所有会面的顺序，包括你被谁跳过。她说她叫苏纹，管日程，也管谁在哪一天见不到人。',
    },

    'yu-nanzhi': {
      name: '郁南枝',
      role: '清算行首席',
      district: 'exchange',
      low: [
        '数额对不上就是对不上。她把屏幕转过来给你看，差额三十七万，来源栏是你的部门编号。还有三十分钟收盘，你自己算。',
        '我不听解释，解释不进账。她连笔都没停。你要么现在补上，要么给我一个能写进摘要栏的名字，两个选项，没有第三个。',
        '新来的都以为我是找人麻烦。我不是。麻烦是账自己找上来的，我只是恰好坐在它对面，顺手签个字。',
        '你的信用记录我看过了。不难看，但也不好看。中间那两年是空的，空的两年比负数更让人不安。',
      ],
      mid: [
        '今天有一笔从环带过来的转账，七分钟进，七分钟出。我记下了。不是因为它可疑，是因为它快得像在赶时间。',
        '我给你插了一次平账窗口。不是帮你，是这笔账挂在我这里也一样难看。窗口开到明早六点，过点不候。',
        '清算行不站队。我们只认哪一笔钱先到。你可以在任何一边赢，但你不能两边都欠，欠两边的人最后都没来销户。',
        '我见过有人用一个假名平掉三百万，三个月后那个假名出现在另一份账上。名字是可以借的，借过的名字要还利息。',
      ],
      high: [
        '我父亲那辈做清算用纸。他说纸有一个好处，就是删不掉，只能烧。我现在每天删三百条记录，删到手都记得快捷键在哪。',
        '我桌上那盏灯从来不关。不是为了加班，是关掉之后我会开始算自己这些年平掉了多少不该平的账，那个数比三十七万大得多。',
        '我女儿在记忆银行做柜台，恒温负十八度。她说那里最安静的活是看着别人来取备份。她做过一次，回家两天没说话。',
        '如果哪天你在账上看到我的名字，不要替我争。那时候你只需要做一件事：把差额补上，然后不再看第二眼。',
      ],
      reactions: [
        { when: { sin: [7, 12] }, text: '你的名字这个月出现过四次。她把屏幕转开。其中两次的来源栏是空的。我不问你做了什么，只提醒你，空栏最后都要有人填。' },
        { when: { loyalty: [0, 2] }, text: '你部门这个季度的结算慢了六天。她没有抬头。慢六天不是问题，问题是慢六天的人还坐在原来的位置上。' },
        { when: { money: [0, 15] }, text: '你账上只剩这么多。她把余额念出来，不加评论。这个数在我们这层楼叫清零前夜。要不要我帮你把下周那笔挪一挪。' },
        { when: { folded: [8, 12] }, text: '第八张了。她第一次停下手。我这儿有个客户，折到第九张的时候来清算自己的账户，他算得很干净。你比他多一张，也比他多一分侥幸。' },
        { when: { power: [8, 12] }, text: '你现在能签大额了。她记下一行。签大额的人来我这里的次数会变多。这不是好消息，这是额度变高的意思。' },
      ],
      topics: [
        {
          id: 'yn1', label: '问那笔差额从哪来', once: true, minRelation: 0,
          reply: '她说来源栏写着你的部门编号，但付款方的账户开了两年，只出过一笔钱，就是这一笔。她说这笔账的形态很干净，干净得像有人专门为它开了一个户，开完就等一个合适的人来签收。',
          give: { intel: 2 }, relation: 1,
        },
        {
          id: 'yn2', label: '问她清算行的规矩', once: false, minRelation: 0,
          reply: '她说规矩三条：到账为准、名实一致、当日清零。她把第三条念了两遍，说这条最难，因为清不掉的账不会消失，只会换个名字留到明天，名字换得多了，账就跟原主人没关系了。',
          give: { intel: 2 }, relation: 1,
        },
        {
          id: 'yn3', label: '问她最近哪笔账反常', once: true, minRelation: 3,
          reply: '她说有一笔从环带过来的钱，七分钟进、七分钟出，中间过了三次户，每一次的头尾都对得上。她把那三个过户号抄给你，说不是让你去查，是让你知道这种速度是练过的，练过的人不止做过一次。',
          give: { intel: 3 }, track: { power: 1 }, relation: 1,
        },
        {
          id: 'yn4', label: '问她能不能宽限一天', once: false, minRelation: 3,
          reply: '她说可以，宽限一天按日息算，日息不高，但会记进你的行内评级。她把评级表翻给你看，你的名字在B档第七行。她说升一档要半年，掉一档只要一笔，而且掉档那笔通常不是最大的那笔。',
          give: { money: 40 }, relation: 2,
        },
        {
          id: 'yn5', label: '问她有没有算不平的账', once: true, minRelation: 6,
          reply: '她沉默了几秒，说她父亲退休那年留下三页废表，其中一页的差额她算了十年。她说那不是钱的问题，是那一页上有一个名字被两种笔迹写过，前一种像签字，后一种像补签，她分不清哪个是真的。',
          give: { intel: 3 }, track: { renown: 1 }, relation: 2,
        },
      ],
      first: '清算行的灯亮到凌晨。你替部门去补一份回执，柜台后面的女人连头都没抬，让你把文件放在第二格。她叫郁南枝，清算行首席，说话不用形容词。她扫了一眼你的签名，说你的部门欠了三天结算，钱明天到，人就还能留着。',
    },

    'dai-siyuan': {
      name: '戴思远',
      role: '合规伦理审查官',
      district: 'exchange',
      low: [
        '你读了，但你没看懂。他把文件推回来。没关系，我们这里大部分人签的就是自己没看懂的东西，签完照样下班。',
        '问完这三个问题你就可以走了。他翻到第四页。第四个问题我不问，因为你肯定要撒谎，而我不想再抄一遍。',
        '合规不是拦你，合规是给你留一个可以交代的说法。他摘下眼镜擦了擦。你现在这个说法准备得太临时了，临时的东西在问询室里撑不过两轮。',
        '请坐，坐之前把手里的东西放桌上。不是规定，是我不想在记录里写你当时手里握着什么。',
      ],
      mid: [
        '我今天审了十一份文件，九份是真的，两份是补的。补的那两份我看出来了，还是签了，因为不签的话写文件的人就得下去。',
        '那个圈不是标记，是给我自己看的位置，提醒我下次翻页的时候记得这一页有你。你放心，这种圈我一年画不了几个。',
        '上次那件事，物证和口供差两小时十七分。这种误差在我们行里叫操作空间。有人用它救人，有人用它杀人，我用它写报告。',
        '我不缺理想，我缺的是愿意在文件上签第二个名字的人。签字栏只有一格的时候，事情就只能烂在我这儿，烂得很安静。',
      ],
      high: [
        '我妻子在交易所做柜员。她不知道我每天签什么，我也不想让她知道。我们家的规矩是，回家不问对方白天见了谁。',
        '我审过一件案子，审到一半发现证据是我自己两年前签的。我签的时候是真信的。那天之后我改了工作方式：先怀疑自己，再怀疑别人。',
        '我这副眼镜的度数三年涨了两百。你以为是看文件看的？是看人看的。文件不会在你面前变脸。',
        '要是有一天我坐在问询室里，被问的是我自己。你别替我说话，你只要把当年我替你画过圈的那一页，原样拿出来就行。',
      ],
      reactions: [
        { when: { sin: [7, 12] }, text: '你袖口有痕迹，别擦了，我记录靠眼睛不靠手。他低头写完，合上本子。你可以走了。下次来带一份能看的材料。' },
        { when: { loyalty: [0, 2] }, text: '你最近交上来的东西越来越像给上面看的样子。他叹气。像给上面看的东西，通常是没有人愿意为它负责的。' },
        { when: { money: [0, 15] }, text: '你的年终还没批。他合上本子。我知道为什么，你也知道。缺钱的人做决定会快，快决定在我的卷宗里都不好看。' },
        { when: { folded: [8, 12] }, text: '第八张。他吹了吹笔尖。上一个折到这个数的人来我这儿是为了补一份自述，写了七页，最后一页只有一句话：我以为还剩很多。' },
        { when: { power: [8, 12] }, text: '你现在手上的章比我多。他把笔放下。章多的意思是你签的字开始能压别人了。这不是权力，是负债，迟早要还。' },
      ],
      topics: [
        {
          id: 'ds1', label: '问他圈是什么意思', once: true, minRelation: 0,
          reply: '他说圈是给自己看的，提醒他这一页翻过去之前得多看一眼。他说他一年画不了几个圈，画了圈的人后来大多没出事，也有两个出了事，但都没牵连别人，所以他还在画。',
          give: { intel: 2 }, relation: 1,
        },
        {
          id: 'ds2', label: '问审计里最常见的错', once: false, minRelation: 0,
          reply: '他说是日期。说谎话需要想象力，改日期只要一支笔。他翻了翻卷宗，说昨天就有两份文件，签名日期比文件生成日期早了四天，四天里文件还不存在，签的人却已经在为它负责了。',
          give: { intel: 2 }, relation: 1,
        },
        {
          id: 'ds3', label: '问上次那件物证的事', once: true, minRelation: 3,
          reply: '他把三页底稿抽出来给你看，口供时间和门禁记录差两小时十七分，中间那段没有任何记录。他说这种空白在合规术语里叫未覆盖时段，在行里叫可以办事的两个小时，很多人花大价钱买的就是这两个小时。',
          give: { intel: 3 }, track: { power: 1 }, relation: 1,
        },
        {
          id: 'ds4', label: '问他有没有替人担责', once: true, minRelation: 3,
          reply: '他说担过两次，一次是为了一个实习生，一次是为了自己。他说为了自己的那次，他在报告里把责任写给了流程，流程不会辩驳，也不会申冤，所以他到现在还记得那份报告的编号和当天的天气。',
          give: { intel: 3 }, relation: 2,
        },
        {
          id: 'ds5', label: '问他为什么还留着工作', once: true, minRelation: 6,
          reply: '他笑了，说理由很难看。他妻子在交易所，女儿的学费每年涨百分之十二，全城只有这份工作能让他每天看清一件事：哪些人被处理掉了，用的是什么名目，以及轮到他还有几格。',
          give: { intel: 3 }, track: { sin: 1, renown: 1 }, relation: 2,
        },
      ],
      first: '审核窗口的队排到楼梯口。轮到你时，眼镜后面的男人先伸手要本子，而不是你的证件。他叫戴思远，合规伦理审查官，把你的每句话都记下来，最后问了一句：这份文件你读过吗。你说读过。他点头，说那就好，然后在你名字旁边画了一个圈。',
    },

    'cheng-yan': {
      name: '程砚',
      role: '首席科学家',
      district: 'lab',
      low: [
        '三号柜的登记停在上周三，中间少了十一支。不是问你去哪了，是问你什么时候把表补齐，表格不齐我不签字。',
        '你站的位置挡住我的光了。她把样本架挪开。有事说事，我手上这批不能停，停了要重做，重做要重取样本。',
        '签字栏空着就是没签。我不认口头授权，也不认当时在忙。她把表格翻过来给你看，空栏和失踪是同一个意思。',
        '你说你会补，所有人都说会补。她把计时器按了一下。三十分钟，我看着你补，补不完今天就别走。',
      ],
      mid: [
        '三号项目的评审下周开，签字栏三个人，其中一个是你。来不来都能开，但结论算不算数，取决于那一栏有没有你的名字。',
        '我这儿的规矩是数据不撒谎。人会撒谎，样本不会。所以我信任仪器超过信任人，包括信任我自己，尤其是取样之前。',
        '上周有个研究员被调去轨道港做记录员，理由是性格不适合协作。我看了那份单子，理由那一栏的字迹不是人事写的。',
        '我做过一个实验，把同一批样本分给两组人做，结论差了两个标准差。差异不在样本，在做的人。所以我现在只信双盲，也只信第三个数。',
      ],
      high: [
        '三号志愿者出所之后没有回来。签名还在名册上，体检数据也还挂在系统里。我需要这个名字今天之内消失，数据我自己处理。',
        '我母亲当年也是做研究的，她留下一本笔记，最后一页写着不要为了结果修改过程。我现在每天都在修改过程。',
        '我这副眼镜的胶带是学生贴的，她已经不在了。三年前她调去了回收场，理由是设备维护岗缺人，那年回收场一共缺四个人。',
        '你要是哪天觉得我冷，那是对的。我得冷，不然看数据的时候会想把每一行都改成我想看到的样子。',
      ],
      reactions: [
        { when: { sin: [7, 12] }, text: '你身上的味道会污染样本。她把你拦在门口。有话在这儿说，别进去。进去出来，我这批全得废。' },
        { when: { loyalty: [0, 2] }, text: '你这个月的报告改了四版，落款一次比一次软。她记了一笔。软落款在评审里等于没落款，评审组只看最后那位签字人。' },
        { when: { money: [0, 15] }, text: '我知道那点补贴对你重要。她没有安慰的意思。但我这儿没有不记名的钱，只有记在样本编号上的钱，你要就得留下编号。' },
        { when: { folded: [8, 12] }, text: '第八张。她停了一下。折到这一步的人通常开始把重要的事往后放。我这里的事不能往后放，样本会过期。' },
        { when: { power: [8, 12] }, text: '你现在能批预算了。她点头。批预算的人容易相信数字。提醒你一句，数字是别人写的，样本是我取的。' },
      ],
      topics: [
        {
          id: 'cy1', label: '问三号柜少了什么', once: true, minRelation: 0,
          reply: '她说少了十一支冻存样本，编号连续，说明取走的人知道顺序。她说登记表上的时间栏被人用同色的笔补过一次，补得很像，但没有翻页的痕迹，说明补的时候表还摊在桌上。',
          give: { intel: 2 }, relation: 1,
        },
        {
          id: 'cy2', label: '问她实验在做什么', once: false, minRelation: 0,
          reply: '她说做的是把损伤后的组织还原到出厂状态，理论上可行，实际上一百次里成功七次。她说那七次里只有一次样本是活的，剩下六次她保留了数据，删掉了记录，因为记录写得越清楚，越有人想拿去用。',
          give: { intel: 2 }, relation: 1,
        },
        {
          id: 'cy3', label: '问被调走的研究员', once: true, minRelation: 3,
          reply: '她报了一个名字和调岗日期，说这个人走之前把三年的实验日志打包留在了她桌上。她说日志她没看，锁在三号柜的底层，钥匙只有一把，在她身上，另一把在归档室里，归档室的锁换了。',
          give: { intel: 3, gear: 1 }, relation: 1,
        },
        {
          id: 'cy4', label: '问那批志愿者的去处', once: true, minRelation: 3,
          reply: '她说名册上有二十七个名字，其中五个在出所之后换了地址，两个换了名字。她给你抄了那五个地址里的两个，说这两个人还接电话，剩下的不确定，不确定的意思是她打过去是空号，但号还在。',
          give: { intel: 3 }, track: { renown: 1 }, relation: 2,
        },
        {
          id: 'cy5', label: '问她有没有后悔过', once: true, minRelation: 6,
          reply: '她把计时器按停，说有过一次。她把一组数据从负值改成了零，因为那组数据会把一个人判定成不适合继续参与。她说那个人后来活了下来，所以她到现在也不知道那次改动算是救了人还是毁了人。',
          give: { intel: 3 }, track: { sin: 1 }, relation: 2,
        },
      ],
      first: '你送一份批复进园区，前台让你在三号门等。一个白大褂从静音走廊出来，眼镜腿上缠着胶带，接过文件只看落款。她说她叫程砚，是这里造东西的人。她没问你是谁，只问你有没有权签字。你说没有。她说那也行，下次记得带。',
    },

    'peng-jian': {
      name: '彭戬',
      role: '研究所安保总管',
      district: 'lab',
      low: [
        '包打开。他把扫描枪举起来。上次你没带违禁品，这次也未必。流程就是流程，我不跟你讲人情。',
        '巡检单上缺一个签名。不是你值的班，但系统里挂的是你的编号。补签两分钟，笔在我手里，要不要。',
        '别跟我讲道理。道理是给写报告的人用的，我这一层只有记录，和记录里没有的东西，两样都不好惹。',
        '我记住了你的鞋，下次别换。换了鞋我就得重新认你一遍，那很麻烦，麻烦的事我一般直接卡住。',
      ],
      mid: [
        '周四凌晨的门禁事故要复盘，你被列在当事人名单里。名单不是我排的，我只负责通知，不负责解释它怎么排出来的。',
        '三号走廊今晚有一批设备要出园区，需要一份用你工号的临时授权。东西不会出事，就算出事，记录也会跟着设备一起出去。',
        '上周三凌晨有个值班员看见了不该看的画面。人还在所里上班，还在同一条走廊刷卡，工牌上的照片甚至是新拍的。',
        '我不查你是谁，我查你从哪来、到哪去。前者写在档案里，后者写在我手上这本册子里，册子比档案准，因为册子是我写的。',
      ],
      high: [
        '我这只左手是所里给换的。那年出事，我签了保密协议，换手是协议里的一条。现在我每天早上都得给它上油。',
        '我盯着一栋楼盯了十四年。楼里出来的人我一个名字都记不住，只记得鞋，鞋不会骗人，人会，人还会换脸。',
        '我有个规矩：放人过去之前先让他把包放下。放下包的人，说的话我信一半；不放的，一句都不信。这规矩用了十年，没错过。',
        '我只对院长和规则负责，但规则这两年改过三次。改规则的人现在不在岗了，签字还留在文件上，没人去动它。',
      ],
      reactions: [
        { when: { sin: [7, 12] }, text: '你今天走路的姿势不对。他挡在闸机前。不是怀疑你，是我得写一份记录。你站那儿别动，三十秒就够。' },
        { when: { loyalty: [0, 2] }, text: '你上周有两次刷卡记录在禁区外侧。他念给你听。我写的是设备巡检。下次你自己想个说法，别让我替你编。' },
        { when: { money: [0, 15] }, text: '你最近来得太勤，车费不便宜吧。他把册子合上。我这儿有夜班的津贴名额，要的话明天报上来，我签字。' },
        { when: { folded: [8, 12] }, text: '第八张。他抬头看你一眼。折到这个数的人来所里的时候都会多走两步，像是在数还能走几趟。你也是。' },
        { when: { power: [8, 12] }, text: '你现在能签放行单了。他把闸机抬起来。提醒你，签放行单的人出了事，第一个查工号，不是查脸。' },
      ],
      topics: [
        {
          id: 'pj1', label: '问他记住多少双鞋', once: true, minRelation: 0,
          reply: '他说册子上记了四百多双，能对上名字的只有三分之一。他说鞋比脸准，换脸要钱，换鞋不要钱，所以人换脸不换鞋。他把第一页翻给你看，第一个名字是你部门上一任负责人。',
          give: { intel: 2 }, relation: 1,
        },
        {
          id: 'pj2', label: '问三号走廊运什么', once: false, minRelation: 0,
          reply: '他说清单上写的是报废制冷机组，实际重量差了百分之四十。他说他不问是什么，他只负责让记录出门。记录出了门，东西就跟研究所没关系了，出了事也查不到这一栋楼。',
          give: { intel: 2 }, relation: 1,
        },
        {
          id: 'pj3', label: '问那个值班员的下场', once: true, minRelation: 3,
          reply: '他说那个人第二天换了新工牌，照片是新拍的。他说换工牌要走三道审批，三道全在同一天办完。他把审批编号抄给你，编号的年份是去年，也就是说那张照片去年就拍好了，一直在等。',
          give: { intel: 3 }, track: { power: 1 }, relation: 1,
        },
        {
          id: 'pj4', label: '问他为什么只认记录', once: true, minRelation: 3,
          reply: '他说他年轻时放一个人进来过，那人后来带走了两箱东西。事后追责，记录里没有那人的名字，只有他放行的那一秒。他说从那天起他就只认写下来的东西，因为没写下来的，最后都得自己扛。',
          give: { intel: 2 }, relation: 2,
        },
        {
          id: 'pj5', label: '问他左手是谁签的字', once: true, minRelation: 6,
          reply: '他把手套往上拉了半寸，露出接口上的老疤，说协议里有一条：接受替换的人可以在五级岗一直待到退休。他说签字的那位早就不在了，条款还在，因为条款不会退休，人退了它还站着。',
          give: { intel: 3 }, track: { loyalty: 1 }, relation: 2,
        },
      ],
      first: '三号门禁把你拦了下来。检查你证件的人左手是义体，戴着从不摘的手套。他叫彭戬，研究所安保总管，只对院长和规则负责。他把你的包翻了一遍，什么也没找到，就说你可以进去了。走了两步他又叫住你，说他记住了你的鞋，下次别换。',
    },

    'lao-ya': {
      name: '老鸦',
      role: '灰市掮客',
      district: 'slum',
      low: [
        '押金先放桌上。他把那张纸盖住。不是我信不过你，是这一行的规矩：先给钱的人，才听得见真话。',
        '你要的东西我手上没有。他倒了口热的给你。但我认识一个有的，介绍费单收，成不成另说，成了也不退。',
        '这棚子明天可能就不在了。他拍了拍棚布。所以你说的话我记，你的钱我也先收。收了钱我才有力气挪窝。',
        '别问价格，先问自己付不付得起后果。价格我这儿便宜，后果要另算，算的时候我不在旁边。',
      ],
      mid: [
        '档案馆昨晚撤了一批编号，其中一份是三年前那桩事故的。这东西在我手上留不过四十小时。你出多少，什么时候要。',
        '你上次说过那个名字，我替你打听过了。人还在，就是换了地方住。这种事我不多加价，加价的是他现在的房东。',
        '巷子里有个线人开始两头卖，价格越报越高，前天报到了你的名字。这事我不收钱。我只问你哪天方便，我知道你熟那边。',
        '我这条腿是旧货，装的时候那人少收我一千。我记了十七年。他上个月来找我办事，我一件没收他钱，茶也没让他请。',
      ],
      high: [
        '下层的清理名单上有个人不该在上面。这人早年替我挡过一刀。我不要你做大事，只要名单走流程的时候你多按一次暂停。',
        '我这一行讲一句话：债可以赖，人不能忘。你哪天要是倒台了，我这条棚子给你留个角落，热的管够，酒没有。',
        '我手上有份档案，正规渠道递不上去，卡在第二道签收就没了回音。只有你能让它落进某个不该进的收件箱。递完你就当没见过。',
        '我女儿在环带做清洁。她不知道我做什么，我也不想让她知道。你要是在哪份名单上看见她的工号，先跟我说一声。',
      ],
      reactions: [
        { when: { sin: [7, 12] }, text: '你最近的手不干净啊。他笑着把桌下的箱子往里挪了半尺。不是嫌你，是嫌麻烦。东西放这儿，人站外面。' },
        { when: { loyalty: [0, 2] }, text: '你跟上面那条线快断了。他倒了杯水。断线的人来找我，我一般不接。你是例外，因为你还欠我一顿酒。' },
        { when: { money: [0, 15] }, text: '你钱包薄了。他把那杯热的推过来。这杯不要钱。我这儿记账，不记人情，下回一起算，算不清就当我请。' },
        { when: { folded: [8, 12] }, text: '第八张了。他把烟按灭。折到第九张的人我见过两个，一个搬去了穹顶之外，一个搬进了回收场。前者活得还不错。' },
        { when: { power: [8, 12] }, text: '你现在说话带分量了。他给你让了让。但我得提醒你，我这儿只认拿来能卖的东西，不认你手上有几个章。' },
      ],
      topics: [
        {
          id: 'ly1', label: '问他手上有什么货', once: true, minRelation: 0,
          reply: '他掀开棚布下面一层，说货不多：一批旧义体的关节、两套还能用的通行贴片、一份撤档编号的复印件。他说前两样有钱就能拿，第三样不是钱的问题，是谁敢拿，拿了往哪放。',
          give: { gear: 1 }, track: { sin: 1 }, relation: 1,
        },
        {
          id: 'ly2', label: '问他消息都从哪来', once: false, minRelation: 0,
          reply: '他笑了，说消息不是从哪来，是从谁手里漏出来。他说昨天有人在下层喝多了说了三句话，其中一句是一个编号。他把那个编号对应的高塔楼层数给你听，是四十七，数完他就不说了。',
          give: { intel: 2 }, relation: 1,
        },
        {
          id: 'ly3', label: '问他那个两头卖的人', once: true, minRelation: 3,
          reply: '他说那人姓周，住下半层第四排，门口摆着一盆枯了的植物。他说周昨天晚上报价报到五百，比上周翻了一倍。他说翻得这么快，说明周手上确实有东西，也说明周快没命了。',
          give: { intel: 3 }, relation: 2,
        },
        {
          id: 'ly4', label: '问他早年欠过谁的情', once: true, minRelation: 3,
          reply: '他收起笑，说欠过一个叫洪姐的人，早年替他挡了一刀，后来死在清理名单上。他说他每年清明往那条巷子寄一封信，收件人只写地址不写名字，邮差认得，信也没丢过一封。',
          give: { intel: 2 }, track: { renown: 1 }, relation: 1,
        },
        {
          id: 'ly5', label: '问他信不信人这回事', once: true, minRelation: 6,
          reply: '他说不信，但他记账。这些年他记了四本账，名字划掉了一半。留下的那一半里有三个是拿了钱不还的，一个是拿了钱还回来的。他说前者他认，因为那是行规；后者他认一辈子，因为那不是行规。',
          give: { intel: 3 }, track: { renown: 1 }, relation: 2,
        },
      ],
      first: '雨天的巷口，一个瘸腿的男人撑着棚布卖零件。你只是想问路，他先报出你部门的名字，然后报出你昨天在哪喝酒。他叫老鸦，灰市掮客，一条腿是旧货义体，记仇也记恩。他说他不认识你，但他认识你的钱包，让你坐下喝口热的。',
    },

    'lu-wan': {
      name: '陆晚',
      role: '无证诊所医生',
      district: 'slum',
      low: [
        '先把袖子卷上去。她把托盘拖过来。我不问你怎么弄的，但我得知道你上一次缝是什么时候，用的是什么线。',
        '你上月送来那批镇痛剂，批号过期三个月，我已经用掉一半。你要么换一批批号单，要么换一批药，我只问药。',
        '这儿不挂号，也不留名。她洗手，背对着你。你要是想留点东西在记录里，出门左转，楼上那家有台账。',
        '伤口不深，但位置不好。她剪断线。你那边的人是不是都从同一个角度挨刀。这不是巧合，是有人练过。',
      ],
      mid: [
        '诊所的耗材被卡在审批上，清单里有一项我没法解释用途，写了三遍都被退回。你帮我改成一个合理的名字，剩下的表我自己填。',
        '你上个月瘦了六斤。别问我怎么知道的，我给你缝过两次。第一次你皮带扣在第三个孔，这次在第五个。',
        '我手上有个孩子需要一份能过闸机的身份记录，年纪不大，伤口还没好，说话时不敢看人。不急，三天内都行。',
        '这里的人有一个共同点：来的时候都不说疼。不说疼的人通常已经自己决定要撑到底了，撑到底的人不需要我劝说。',
      ],
      high: [
        '你这几个月的样子我都看在眼里，我可以给你做一次完整修复，不收钱。条件是留一份完整样本，包括血、组织和时间戳。',
        '我原来在园区里做临床。三年前那批数据我没签，后来就没有执照了。我不后悔，只是有时候想不起来自己以前的名字写在哪个工牌上。',
        '我这诊所的灯是旧的，电压不稳。可我最怕的不是断电，是哪天有人拿着一份报告走进来，告诉我我救过的哪一个人是错的。',
        '你手上那道旧疤，边上那几针是你自己收的还是别人收的？收得很随便。你要是不想让人看出来，下次别自己动手。',
      ],
      reactions: [
        { when: { sin: [7, 12] }, text: '你手上的伤我不问了。她把针放下。但我要问你一句：你现在做的事，流血的是自己还是别人。' },
        { when: { loyalty: [0, 2] }, text: '你最近来得太吵。她把帘子拉上。不是指声音，是指你身上带着的眼睛变多了。这儿的人怕眼睛。' },
        { when: { money: [0, 15] }, text: '这次不收钱。她把你放下的卡推回去。你欠我的不是钱。等你手上有余量的时候，把楼下那家的药价压一压。' },
        { when: { folded: [8, 12] }, text: '第八张。她看了你一眼。我这儿接过四个折到第九张的人，三个是自己走进来的，第四个是被抬进来的。' },
        { when: { power: [8, 12] }, text: '你现在说话，别人要停下来听。她一边收拾器械。这是好事，也是我今天要给你做一次全面检查的原因。权力会上身体。' },
      ],
      topics: [
        {
          id: 'lw1', label: '问她的诊所怎么开的', once: true, minRelation: 0,
          reply: '她说没有执照，也不需要，来的人不查这个。她说诊所开到今年第四年，第一个月只有三个人进过帘子，现在一晚上能有十一个，其中一半是被正规医院退回来的，退回来的时候都不说话。',
          give: { intel: 2 }, relation: 1,
        },
        {
          id: 'lw2', label: '问她见过多少我这样的人', once: false, minRelation: 0,
          reply: '她说记住的不多。她说穿得体面、伤口在中线、来得都在凌晨两点到四点之间的，这三年有九个。她说前八个里现在还在城里的只有三个，剩下的不是搬走了，是没有人再来缝第二次。',
          give: { intel: 2 }, relation: 1,
        },
        {
          id: 'lw3', label: '问那份体检报告的第三页', once: true, minRelation: 3,
          reply: '她把第三页抽出来，指着多出来的两行说，那两个项目代码在公开清单里查不到，能对上的只有研究所的内部编号。她说这两行写的是用药史和一次采样时间，而那个采样时间你当时在做别的事。',
          give: { intel: 3 }, track: { sin: 1 }, relation: 1,
        },
        {
          id: 'lw4', label: '问她能不能改记录', once: false, minRelation: 3,
          reply: '她说能，但只能改她自己的。她给你看她的台账，每一条只写日期、伤口位置和用药，没有名字。她说这是她唯一的规矩，改了这条规矩，这个地方就得关门，关门之后就没人接这些人。',
          give: { intel: 2 }, relation: 2,
        },
        {
          id: 'lw5', label: '问她这辈子最怕什么', once: true, minRelation: 6,
          reply: '她停下手里的动作，说怕的是某天有人拿着一张单子来，让她在名单上认一个人。她说她认人靠伤口，别人认人靠编号。只要她认错一次，之后她救过的每一个人都得重新算一遍，算不清。',
          give: { intel: 3 }, relation: 2,
        },
      ],
      first: '外勤留下的一道口子，你自己找上门。帘子后面的人没有问伤怎么来的，先让你把手洗干净。她叫陆晚，无证诊所医生，袖口有洗不掉的旧血渍。缝到第七针她抬头看你一眼，说你手心一直攥着，是怕疼，还是怕她看出来你是谁。',
    },
  };
})();

/* ===== game/voice-b.js ===== */
/* NPC 语音库 B 组：8 人。由内容设计生成。 */
(function () {
  'use strict';
  window.NPC_VOICE_B = {

    /* ---------------------------------------------------------- */
    'tie-gui': {
      name: '铁贵',
      role: '装卸工会头目',
      district: 'docks',

      low: [
        '他把扳手搁在铁皮上，说：你来晚了两年。码头这地方，先来的先说话。你今天想打听什么，先讲清楚是谁让你来的，我再决定听不听。',
        '吊机在头顶转，他抬头看了一眼，又低头看你的鞋：包挺新。上次来谈的人，回去就把我们卖了。我凭什么知道你不一样，你先说一句我信得过的。',
        '他点了根烟，把火柴盒压在名单上：董事会要的东西我这里都有，就是不知道哪一份该给你。你先说你能还我什么，别说好听的。',
        '他把你让进铁皮房，屋里只有一把凳子。他说坐吧，又补一句：坐之前想清楚，这屋里谈过的话，出了门都会变味，到时候别怪我没提醒。',
      ],

      mid: [
        '他给你倒了半杯凉茶，说：三号泊位夜班少了七个人，账上还挂着全勤。这种事每个月都有，我不查，查了没人干活，货还是得他们卸。',
        '他把手套脱了一只，露出左手小指缺了半截：上个月装柜的时候掉的。报工伤要三道签字，我懒得排，兄弟们的饭不能等。',
        '他说：你要是真想在这条线上站住，先记住一件事——七号仓的钥匙有三把，我手里只有一把。另外两把在谁手里，你猜得到，别问我要名字。',
        '他压低声音：工会里有人开始往高塔递东西了。我不知道是谁，但我知道他坐哪一趟班车。这种事我不想动手，我手底下的人要吃饭。',
      ],

      high: [
        '他把烟按灭，说：我儿子在研究所园区做清洁，工号是我托人弄的。他不知道我干什么。你要是有天在上面听见他的名字，帮我把它划掉。',
        '他说：我这辈子没求过人，今天算一次。罢工再拖下去，我先撑不住的不是良心，是账。你替我在上面拖三天，我把港口的夜间通道给你开一条。',
        '他忽然笑了，笑得很难看：你们觉得我硬。我晚上回那间铁皮房，一样要听水响。我怕的不是死，是死之前工人们先不信我了。',
        '他把一个旧皮夹推给你，里面是张三年前的全家照：拿着。万一哪天他们找你，你就说你认识我。我把名字押在你手上，你别弄丢。',
      ],

      reactions: [
        { when: { sin: [7, 12] },      text: '你最近手上不干净，我闻得出来，港口的人鼻子都好使。今天这话我只说一半，剩下半句你自己想。' },
        { when: { loyalty: [0, 2] },   text: '上面已经在排你的位置了。你手上还有活干，是因为还没人肯接你这一摊。这话不收钱，你自己掂量。' },
        { when: { money: [0, 15] },    text: '口袋里没几个钱了吧。码头的活按周结，先干后拿。你敢不敢上手，敢的话我现在就给你排班。' },
        { when: { folded: [8, 12] },   text: '你手上那叠东西快折完了。折得这么快的人我见过三个，一个走了，两个后来不见了。' },
        { when: { power: [8, 12] },    text: '你现在说话比上个月重了。行，重话我听着。但码头不归你管，这一点你别忘。' },
      ],

      topics: [
        {
          id: 'tg1', label: '问他码头上的规矩', once: true, minRelation: 0,
          reply: '他拿螺丝刀在铁皮上划了三道：卸货看班次，过磅看人，签字看脸色。三道里最值钱的是第二道，磅房那个老头能让你少写两吨，也能让你多写两吨。别问价，先问他是谁的班。',
          give: { intel: 2 }, track: { loyalty: 1 }, relation: 1,
        },
        {
          id: 'tg2', label: '问他哪里能弄到通行条', once: false, minRelation: 0,
          reply: '他说：西闸口那条道，凌晨两点到四点没人守，只有一条狗。狗归仓库看门的管，姓什么你别打听。走那条道的时候把鞋换软的，铁皮地上响，响声比人先到。',
          give: { chips: 1 }, relation: 1,
        },
        {
          id: 'tg3', label: '问工会里谁在往外递话', once: true, minRelation: 3,
          reply: '他往门外看了一眼，说：查班表。每周四下午请病假的那个，姓吴，装卸二班。他老婆上个月在高塔做过体检，免费的。这事我只跟你说一次，你别拿去换钱。',
          give: { intel: 3 }, track: { power: 1 }, relation: 1,
        },
        {
          id: 'tg4', label: '问他手上的旧伤哪来的', once: true, minRelation: 3,
          reply: '他把左手摊开给你看：五年前压的。那次是我自己签的字，说机器合规，好让兄弟们按时开工。后来查下来，签字的是我。我认，因为不认的话，要坐进去三个人。',
          give: { intel: 1 }, track: { renown: 1 }, relation: 2,
        },
        {
          id: 'tg5', label: '把儿子的事托给你', once: true, minRelation: 6,
          reply: '他沉默了很久才说：研究所园区清洁组，工号后四位 4071。他没做过坏事，只是有个当头的爹。哪天有人在名单上圈他，你替我拦一下。港口的夜班，随你调。',
          give: { intel: 2 }, track: { sin: 1 }, relation: 2,
        },
      ],

      first: '装卸区罢工第三天，你代表部门去谈。铁贵先把手上的机油擦干净，才伸手跟你握。四十岁的人，话不快也不漂亮。他说别的他不管，只想让兄弟们有一份看得见的活干。谈完他送你出闸口，说下次来别带公文包，带耳朵。',
    },

    /* ---------------------------------------------------------- */
    'yin-mian': {
      name: '银面',
      role: '女术士的代理人',
      district: 'docks',

      low: [
        '它没有看你，看的是你手里那份文件：你晚到十一分钟。不是怪你，是我算错了。我算你会在路上停一次，你没停。',
        '它说：我们之间不需要信任，只需要对齐。你要的那行字我可以删，代价是你得先告诉我，你怕的是什么。',
        '它的声音很平：你上个月签过一份东西，编号我念得出。别紧张，我只是习惯先把手上的牌读一遍，再决定要不要用。',
        '它抬起手，指尖的数据比上次淡了一点：你看，每替你删一行，我自己就少一点。所以请你想清楚再开口，我不喜欢浪费。',
      ],

      mid: [
        '它说：三天后有条船进港。船上有一个人的名字被划掉了，但人还在。系统里没有他，现实里有。这种差，是最贵的差。',
        '它偏了偏头：你昨天在交易所做的那个决定，六小时后才生效。在那之前你可以改，改的代价从我这里扣。我不收钱。',
        '它说：我不预测，我只是比你们早读到结果。你们的世界里，事和话之间隔着时间。我这边没有这段。',
        '它递来一张泊位单，纸是干的：七号仓午夜。来的时候不要带任何会记录的东西，包括手环，也包括你脑子里那句想说又没说的话。',
      ],

      high: [
        '它说：我删过太多行，快想不起自己原本写在第几行。你要是愿意，替我记一件事——吊机下面那时是三点十一分，不是三点十分。差这一分钟，我还在。',
        '它盯着你看了很久：你身上有条线已经被人画好了。我可以帮你挪，但挪完我不确定你还是你。你想清楚，我不催你。',
        '它说：我见过下一个来找你的人。他会在雨天，穿灰色。这句话本不该说，说了我就又薄一点。就当你替我记着。',
        '它把手收进袖子里：你们都以为我在牌桌上。其实这几个月我都在桌子底下，捡别人掉的边角。你要给我的东西，不用给整张，给一角就够。',
      ],

      reactions: [
        { when: { sin: [7, 12] },    text: '你身上的味道变了。不是血，是血之后的安静。我很熟悉这种安静，我就是从这个地方来的。' },
        { when: { loyalty: [0, 2] }, text: '上面已经不再叫你的名字了，他们现在用编号叫你。你们叫这个流程，我叫这个——结尾。' },
        { when: { money: [0, 15] },  text: '你现在缺的不是钱，是时间。不过这两样在我这里可以换。你出个价，我按秒算。' },
        { when: { folded: [8, 12] }, text: '你折到第几张了。越往后字越少。到最后一张，你会发现上面本来就没写什么。' },
        { when: { power: [8, 12] },  text: '它往后退了半步：你现在说话，系统会等你说完再执行。这种事我见过两次，上一次那个人，现在是文件名。' },
      ],

      topics: [
        {
          id: 'ym1', label: '问它到底替谁做事', once: true, minRelation: 0,
          reply: '它说：替一个不在这里的人。她不出面，因为露面就要占一行，占了行就会被读到。她做的事你们叫术，我叫排版。你要她的名字可以，先拿一样你自己也舍不得的东西来换。',
          give: { intel: 2 }, track: { sin: 1 }, relation: 1,
        },
        {
          id: 'ym2', label: '问那批货什么时候到', once: false, minRelation: 0,
          reply: '它说：三天，差四十分钟。进了七号仓以后别碰车厢内侧，那里贴着的东西不是货单。你要想看一眼，先把袖子拉下来，手腕露在外面的人，我这边不好记录。',
          give: { chips: 1 }, relation: 1,
        },
        {
          id: 'ym3', label: '问它指尖为什么会变淡', once: true, minRelation: 3,
          reply: '它把指尖抬到灯下，数据确实更薄了：每删一行，我少一点。删掉的东西不会消失，只是从这张桌子挪到另一张。你折牌的时候，也该想想第二张桌子在哪边。',
          give: { intel: 3 }, track: { power: 1 }, relation: 1,
        },
        {
          id: 'ym4', label: '问它记不记得穹顶裂那次', once: true, minRelation: 3,
          reply: '它停了很久：那年名单上有八百多个名字，我删了最后四十行，其中一行是我自己的。所以我现在只能站在吊机下面，不能上楼。你别问我怕不怕，我不太会这个。',
          give: { intel: 2 }, track: { sin: 1 }, relation: 2,
        },
        {
          id: 'ym5', label: '托它替你改一行字', once: true, minRelation: 6,
          reply: '它没问改哪一行，只说：明早六点看你的授权栏，那里会多一个你没签过的章。别去查它从哪来，查了会连着删掉另外两行。这件事我不收钱，你欠我一次就行。',
          give: { intel: 2, chips: 2 }, track: { sin: 1, power: 1 }, relation: 2,
        },
      ],

      first: '凌晨三点的码头，一个穿银灰西装的人站在吊机下面，脸上一层流动的银色数据。它说它叫银面，是代笔人，负责在这场牌局里删掉几行。它知道你手上第一张牌的期限，也知道你昨晚想换掉它。它说：别急，先看看我能给你什么。',
    },

    /* ---------------------------------------------------------- */
    'wen-shicheng': {
      name: '温仕成',
      role: '引航票务掮客',
      district: 'orbit',

      low: [
        '他把笔搁下，笑着说：候补位次啊，查是要钱的，不看是不花钱的。你要是只打算看一眼，那我这张脸就白摆了。',
        '他手指在票根上敲了两下：你这编号我见过三次。三次里两次是问别人，一次是问自己。你猜我记不记得是哪一次。',
        '他说：出境这事别问政策，政策是写给人看的。你要问的是哪一班船不查货、哪一种票根不用留底。这些我懂一些，价钱另说。',
        '他把手写的票根码整齐：你今天来找我不是为了那份函。你眼睛一直在看墙上的航班板。看吧，看够了我们再说别的。',
      ],

      mid: [
        '他凑近了些：第五班，凌晨一点二十。那个班次的名额是我留的，留了两年，谁也不给，就等一个出得起价也走得动的人。',
        '他说：引航局上个月换了个签发人。新来的签第一份单子的时候手在抖，我看见了。手抖的人，比谁都怕别人手抖。',
        '他把一本旧票根翻开给你看：这些都是划掉的。划掉的原因只有一个，人先走了。系统里还候补着，人已经不在城里。这种事我这柜台一年要过十几回。',
        '他压低声音：你要办身份，先别动照片。照片一动，档案就醒。先换的是出生地，往后才是名字。顺序错了，等于自己按了铃。',
      ],

      high: [
        '他忽然不笑了：我今年六十一，卖了三十七年票。四年前我给自己留过一个位置，后来让给了一个抱着孩子的女人。我不后悔，就是半夜偶尔会想那班船。',
        '他把笔递给你：拿着。这支笔签过的票根，有一半的人已经不在这颗星球上了。你哪天想走，拿张纸来，我给你办最慢的那一班，慢的才安全。',
        '他叹了口气：我这一行最重的不是钱，是记性。我忘不掉每一个划掉的名字。你要是在上面听见有人提起我，替我记一句——我是卖票的，不是判官。',
        '他说：别看我嘴上滑，我这柜台后头没有第二条路。有人问过我害不害怕，我怕的是有一天没人再来问位次，那说明船上不剩人了。',
      ],

      reactions: [
        { when: { sin: [7, 12] },    text: '他笑容缩了一寸：你最近办过的事，我柜台上留了影子。我不问，也不记名字。但你要让我办票，得先把影子擦干净，不然它跟你上船。' },
        { when: { loyalty: [0, 2] }, text: '他压低声：你上面那几位已经不看你的报告了，他们改看你的行程。你哪天走、几点到，比我清楚。我劝你少填真的目的地。' },
        { when: { money: [0, 15] },  text: '他打量你一眼：钱包空了吧。没关系，我这儿可以先欠，位置给你留着，价以后补。我这行最不怕欠账，最怕人没了。' },
        { when: { folded: [8, 12] }, text: '他数着手指：你手上那叠东西快折到底了。走不走你自己定，但我提前说一句，最后一张票根，我这里只留过两个人的名字。' },
        { when: { power: [8, 12] },  text: '他把背挺直了一点：哦，现在是能说话的人了。行，位置我给你留正经的。上去之后记得，船票是给人坐的，不是给人念的。' },
      ],

      topics: [
        {
          id: 'ws1', label: '问哪一班船不查货', once: true, minRelation: 0,
          reply: '他在票根背面写了个数字，是时间不是编号：一点二十。那一班查货的是个新人，只认章不认人。你上船之前把章擦掉，别抹花，抹花的比没有的还显眼。别告诉第三个人。',
          give: { intel: 2, money: 20 }, relation: 1,
        },
        {
          id: 'ws2', label: '问怎么看自己的候补位次', once: false, minRelation: 0,
          reply: '他说：位次不在墙上那块板上，在我这本旧票根里。你报编号，我翻三页。翻到你就是候补；翻不到，说明你被人从名单里勾出去过一次，又被塞回来一次。你要是急着走，现在就把编号报给我。',
          give: { intel: 1, chips: 1 }, relation: 1,
        },
        {
          id: 'ws3', label: '问他划掉过谁的名字', once: true, minRelation: 3,
          reply: '他翻到一页，指给你看三个编号，没有名字：这个走了，这个没走成，这个是我划错的，后来赔了他家一笔钱。引航局不知道这件事。你要把这一页抄走，我这柜台就没了。',
          give: { intel: 3 }, track: { sin: 1 }, relation: 1,
        },
        {
          id: 'ws4', label: '问他怎么给人换身份', once: true, minRelation: 3,
          reply: '他拿笔尖点着纸：先改出生地，再改工号尾数，名字最后动。动名字那天之前，你所有旧档案都得先冻住。冻档案要人。你手里有没有能签字的人，这才是我要问的。',
          give: { chips: 2 }, track: { power: 1 }, relation: 2,
        },
        {
          id: 'ws5', label: '把他那支笔接下来', once: true, minRelation: 6,
          reply: '他把笔在袖口擦干净才递给你：拿着。笔尖有点歪，写字往左偏，我留位置的时候都用它。你要走的那天早些来，别穿上班那件。柜台认得衣服，不认得人。来的时候把钱备足，位置我先替你留着。',
          give: { intel: 2, gear: 1 }, track: { renown: 1 }, relation: 2,
        },
      ],

      first: '你去轨道港送一份出境函。票务柜台后面的老人驼着背，正用旧笔手写票根。他说他叫温仕成，引航票务掮客，六十一岁，知道每个人的出境日期，也知道谁的日期被划掉过。他抬头问你要不要查一眼自己的候补位次，说完自己先笑了。',
    },

    /* ---------------------------------------------------------- */
    'yu-ke': {
      name: '雨客',
      role: '穹顶外「潮」的接触人',
      district: 'orbit',

      low: [
        '他不看你，看玻璃上的雨痕：你们这里的雨，落下来是斜的。外面不是。你要是真想知道，下次别带通讯器来。',
        '他说：我不是来拉你的。我只是站在这里，看谁在这个方向多站一会儿。你站了三分钟，比别人久。',
        '他把手插进风衣口袋：说话的价钱不是钱。你有过那种时候吗，说了一句话，第二天发现自己记得的和别人不一样。',
        '他笑了一下：里面的人管我们叫潮。潮不是谁，是水到齐了。你要想认识它，先学会不解释。',
      ],

      mid: [
        '他说：穹顶外侧有条信号塔，今晚十一点开一次窗口，只开十九分钟。对面要跟你说一句话，就一句。来不来你自己定，迟到了就当没听。',
        '他把风衣下摆撩起来，里面的衬里是湿的：我三个月前淋的那场雨，到现在没干。外面就是这样，进去的东西出不来。你先想清楚什么是不带回来的。',
        '他递给你半张手写的过站条，纸边是毛的：这个能过接缝，编号那栏是空的。空的地方你自己填，填错了比不填更麻烦。填法我不能教你，教了就不是你的。',
        '他说：里面的人以为外面是荒的。外面有东西，只是不按楼层排。你从轨道港往出走十分钟就明白了，回头的路只有一条，而且不一定还在。',
      ],

      high: [
        '他很久没说话，才开口：我第一次出来的时候身上还带着工牌。那枚工牌大概现在还挂在我原来的工位上。你要是有机会经过，帮我看一眼它还在不在。',
        '他说：潮里面没人叫我的名字。我进来一趟，就是为了听有人叫我一声。你说一次，我就记你一次。这买卖我不亏。',
        '他把手伸到雨里，收回来的时候指尖在滴：我快分不清哪些记忆是我的了。有一半是从别人身上带出来的，混在一起洗不掉。哪天听我说了两次同一件事，你提醒我。',
        '他说：我怕的不是外面。我怕的是有一天站在这里，不再认得这块玻璃。你记住我的样子，比记住我说的话有用，样子比话晚一点没。',
      ],

      reactions: [
        { when: { sin: [7, 12] },    text: '他退后半步，像被雨打到：你身上有味道。不是血，是处理干净之后留下的那种空。外面的人对空很敏感，空的东西会招水。' },
        { when: { loyalty: [0, 2] }, text: '他说：里面的人已经开始不认你了。这其实是好消息。不认你的人越多，你走出去的时候越轻。' },
        { when: { money: [0, 15] },  text: '他看你一眼：钱对我不算什么。你要是真缺，我可以给你一条不花钱的路，只是回来的时候衣服会烂。要不要。' },
        { when: { folded: [8, 12] }, text: '他数了数你手上的折痕：折了这么多张还没走。里面有一种人就是这样，折到手空了才肯往外看。窗只开十九分钟，记住这个数。' },
        { when: { power: [8, 12] },  text: '他说：你现在说话有人听了。那你说话的时候替外面留一句。外面听不见高塔，但听得见雨。你说一句实话，就有人接。' },
      ],

      topics: [
        {
          id: 'yk1', label: '问他外面到底是什么样', once: true, minRelation: 0,
          reply: '他说：外面没有楼层，也没有上午下午。雨是斜着下的，站够十分钟衣服就开始发痒。远处有灯，那不是城，是一群人烧东西取暖。你要去，先接受一件事——那里没有表。',
          give: { intel: 2 }, track: { sin: 1 }, relation: 1,
        },
        {
          id: 'yk2', label: '问那件停港的样本是什么', once: false, minRelation: 0,
          reply: '他说：那东西在轨道港停了四天，货单是空的，温度记录只到第二天。我不知道它是什么，只知道它一直是冷的。你别用手碰，它认温度不认人。非要看，就隔着玻璃看，别让它照到你。',
          give: { intel: 1, chips: 1 }, relation: 1,
        },
        {
          id: 'yk3', label: '问潮到底要你做什么', once: true, minRelation: 3,
          reply: '他说：潮不要你做事，它只要你去。你要做的那件事，是你自己带过去的。有人去是为了找活，有人是为了找一个死掉的人的名字。你带什么过去，只有你知道。',
          give: { intel: 3 }, track: { sin: 1 }, relation: 1,
        },
        {
          id: 'yk4', label: '问接缝那条路怎么走', once: true, minRelation: 3,
          reply: '他在地上画了一条线：从轨道港东侧第三根支柱往下，贴着管壁走四百步，会看到一处渗水。别从渗水处钻，往左挪十步，那里有缝。雨大的时候别去，走完这段路的人，鞋会留一半在那。',
          give: { chips: 2, gear: 1 }, track: { power: 1 }, relation: 2,
        },
        {
          id: 'yk5', label: '答应替他记着名字', once: true, minRelation: 6,
          reply: '他沉默了很久才说：我叫雨客，是外面的人给起的，原来那个名字我记不清了。你哪天在外面听见有人喊一个没人应的名字，就当是喊我。这件事不难，就是得一直记着。',
          give: { intel: 3 }, track: { renown: 1, sin: 1 }, relation: 2,
        },
      ],

      first: '候船厅的玻璃外面，雨一直下在穹顶那一边。一个风衣上有雨渍的男人站到你旁边，先笑了一下才开口。他说他叫雨客，替穹顶外的潮传话，让里面的人知道雨落在地上是什么声音。他问你：你听见过吗。广播正好念到第七次延误。',
    },

    /* ---------------------------------------------------------- */
    'xun-jie': {
      name: '荀戒',
      role: '环带巡检员',
      district: 'ring',

      low: [
        '他翻开登记板：先说事，再说你要什么。规程第十二条，非当班人员进入接缝区，必须报明目的与停留时长。这两项你都没报。',
        '他把笔按在纸上没写：你上次来过，自己签的，八分十九秒，比今天早。你要做的事是不是还和上次一样，不一样就重报一次。',
        '他说：我不判断你是好人还是坏人，我判断你有没有按顺序来。顺序对了，灯亮不亮都不归我管。',
        '他指了一下身后的管壁：这一段昨天响得很厉害，我在记录里写了三行。你走夜路别贴那边，规程里没写这条，是我自己加的。',
      ],

      mid: [
        '他把登记板翻给你看：这半个月有四趟夜班没签退。其中两趟的人第二天调走，另两趟的人还在班上。系统里都算正常。我只管写，不管问。',
        '他说：四十一号控制台的阀门要两把钥匙。一把在我这儿，另一把在维修班。他们上周把钥匙借出去过一次，登记写的是测试。测试不需要两把。',
        '他把一只旧手电递给你：亮度不够，但不会冒火花。接缝区有些地方怕火星，规程里没写，是老师傅教的，他退休了。你拿着。',
        '他说：在这里死了人也不会有名字，只会有一行编号加一个日期。上一行是三个月前的。我抄了一份留在家里，我知道这不合规，但没人来查我。',
      ],

      high: [
        '他把登记板合上，第一次没有记录：我在这条管廊上巡了七年，签过四千多份单子。有一份是我妻子那个区的，我签的时候手没抖，回家路上抖了一路。',
        '他说：我不怕出事，我怕没人问我。这一层只有我一个人上班。你要是愿意，路过的时候跟我对一下时间。对时间不违规，规程里没有禁止。',
        '他压低声音：四十一号接缝有一次压力异常，我上报了，被退回三次，理由写数据不足。第四次我改了一个数字，通过了。这件事我到现在都记得清。',
        '他说：我按规程活了太多年，有时候夜里分不清是自己想这么干，还是规程要我这么干。你别笑，这种话我只跟你一个人说。',
      ],

      reactions: [
        { when: { sin: [7, 12] },    text: '他把登记板往回收了一点：你的记录里最近多了几条不该有的空白。我不问内容，但我会照实写时间。你想清楚再来，写下去的东西我改不了。' },
        { when: { loyalty: [0, 2] }, text: '他说：你的名字最近从当班名单里掉了两次。系统说是排班调整，我看了三天，没看出调整在哪。你上去以后自己多问一句。' },
        { when: { money: [0, 15] },  text: '他翻了两页，说：你要是缺钱，巡检班的夜班补贴还有名额，一晚四十，按规程得先签三个月。你不嫌脏就报，我替你填表。' },
        { when: { folded: [8, 12] }, text: '他数了一下你进出的次数：你这阵子来得频，每次待得短。按规程我得写事由，我写的是交接检查。别让我写第二次不一样的说法。' },
        { when: { power: [8, 12] },  text: '他站直了些：你现在的权限能看整层记录。我不介意。要看就看全，别只看你要看的那一行，漏掉的那行往往更要紧。' },
      ],

      topics: [
        {
          id: 'xj1', label: '问他这一层谁说了算', once: true, minRelation: 0,
          reply: '他翻登记板给你看：名义上归设施部，实际上没人来。有两天是安全处的人夜里来过，登记只写巡查。我看过他们的鞋，不是巡道工的鞋。这一层真正说了算的是谁，你自己想。',
          give: { intel: 2 }, relation: 1,
        },
        {
          id: 'xj2', label: '问接缝最近为什么响', once: false, minRelation: 0,
          reply: '他说：内衬层有位移，正常一年走三毫米，这个月走了十一毫米。我报了，上面回的是数据不足。你要想听真话，晚上十一点来，管壁最响的时候贴着听就知道了。',
          give: { intel: 1, chips: 1 }, relation: 1,
        },
        {
          id: 'xj3', label: '问他那份被退回的报告', once: true, minRelation: 3,
          reply: '他从夹层抽出一张纸给你看，上面三个退回章：第一次写数据不足，第二次写格式不符，第三次没写理由只盖了个章。第四次我改了数字。原件在我这儿，你敢拿就拿着。',
          give: { intel: 3 }, track: { power: 1 }, relation: 1,
        },
        {
          id: 'xj4', label: '问他四十一号控制台', once: true, minRelation: 3,
          reply: '他把手电关了：那台控制台开一次阀门要两把钥匙，另一把名义上在维修班。上周他们借出去过一次，登记写测试，测试不用两把钥匙。你要用它，先找到另一把在谁手里。',
          give: { gear: 1 }, track: { renown: 1 }, relation: 2,
        },
        {
          id: 'xj5', label: '问他要那份家里的记录', once: true, minRelation: 6,
          reply: '他犹豫了很久，从内袋里拿出一张折了四折的纸：这三个月的编号我都抄了，一共十一行。你只要给我一句话，说你见过。我不需要你救我，你只要记得这一层上死过的不只是数字。',
          give: { intel: 2 }, track: { sin: 1, loyalty: -1 }, relation: 2,
        },
      ],

      first: '环带巡检班的灯坏了一半，荀戒拿着登记板从管廊里出来。他先核对你的通行记录，再问你的名字，顺序不能颠倒。他说他负责这四百米接缝，谁夜里走过、走了几分钟、灯亮没亮，他都要记。他合上笔帽，说：从现在起，你算我今天第五条记录。',
    },

    /* ---------------------------------------------------------- */
    'sa-er': {
      name: '萨尔',
      role: '潮的拾荒者',
      district: 'outside',

      low: [
        '他手上没停：你不是这边的人，鞋底太干净。说你要什么，别绕。',
        '他把腕轴搁在膝盖上：这边不认名字，只认你带了几样东西。你有盐吗，没有就先站着。',
        '他往棚外看了一眼：你后面没人跟吧。有过人来问路，第二天带了一队人来。那棚子就没了。',
        '他说：我说话短，不是没礼貌。是这儿风大，一句话说长了会被吹散。你听着点。',
      ],

      mid: [
        '他从怀里摸出一块用布包着的金属片：从接应船上割的。上面有编号，编号不是穹顶的。我留了半年，想找个肯看的人。你看得懂，就归你。',
        '他说：潮里面不是没规矩，是规矩不写在纸上。你拿走一样东西，得留下一样。留什么不能挑轻的，挑轻的下次没人接你。',
        '他把手摊开，掌心有两道新口子：三天前从水渠过来，捞到个还热的东西。别问是什么。你要想知道，今晚跟我走一趟，我不保证你回得来。',
        '他说：里面的人怕外面，外面的人怕水。我不怕，我在这边长大。我只怕一件事——哪天潮把这边也认成里面。',
      ],

      high: [
        '他咳了很久才说：我妹妹进里面去了，六年。她走的时候说赚够钱就回来。我把每一件捞到的东西都数着，等凑够数去找她。你里面要有熟人，帮我问一句她还记不记得我。',
        '他把腕轴装回旧义体，拧了两下：这条胳膊是我哥的。他去年没回来。我戴着它干活，算两个人一起干。你别说可怜，我不听这个词。',
        '他说：我不信人，我信盐。盐不会骗人。你给我带一次盐，我就记你一次；带三次，你就能在棚里睡。这样简单，也不用说谢谢。',
        '他站起来，比你矮一头：我知道我这辈子进不去，没关系。我就站在接缝这边，看谁走过去。走过去的人多了，总有一天有一个会记得回来。',
      ],

      reactions: [
        { when: { sin: [7, 12] },    text: '他往后退了一步，手摸到棚柱后面：你身上有事，我闻得出来。这里的人不问你做过什么，只问你有没有没做完的。没做完的会跟你出来，带到这边来。' },
        { when: { loyalty: [0, 2] }, text: '他笑了一下，很难看：上面没人要你了。那你更该留点盐。等你真出来，除了盐什么都换不到。' },
        { when: { money: [0, 15] },  text: '他说：钱在这边没用。你要真想换，拿你身上最舍不得的一样来。你舍不得的东西，说明你还有在里面的理由。' },
        { when: { folded: [8, 12] }, text: '他看你手上的折痕：折得这么快还站着。里面的人折到后来会开始抖，我见过两个。撑不住就早点出来，这边的路不认加班。' },
        { when: { power: [8, 12] },  text: '他往你身后看，又看你的手：你说话现在是命令了。这边不听命令，命令会让水响。你进来的时候把声音放低一点。' },
      ],

      topics: [
        {
          id: 'se1', label: '问他潮到底在捡什么', once: true, minRelation: 0,
          reply: '他说：捡能用的。义体、旧枪、报废终端，还有水冲下来的东西，潮不挑。真正值钱的是从接应船上掉下来的那一类，编号不是穹顶的，我也看不出是哪里的。你不信可以自己看。',
          give: { intel: 2 }, relation: 1,
        },
        {
          id: 'se2', label: '问他要盐用来做什么', once: false, minRelation: 0,
          reply: '他说：水渠的水不能直接喝，得煮，煮的时候放盐，杂的东西会沉，这条这里人人都知道。你要留下过夜，先去接雨水，棚顶漏水有三处，第三处最干净。接水的时候别站外面，风会把水带偏。',
          give: { intel: 1, vitality: 1 }, relation: 1,
        },
        {
          id: 'se3', label: '问那条过站条怎么写', once: true, minRelation: 3,
          reply: '他在地上画了三道：从接缝外进来的人得有张手写的过站条，条子上的编号是我填的。上个月我填错了一次，那个人进去以后就没出来。我不知道是填错的事还是别的事。你要填，我教你怎么写。',
          give: { intel: 3 }, track: { sin: 1 }, relation: 1,
        },
        {
          id: 'se4', label: '问他捞过最烫手的东西', once: true, minRelation: 3,
          reply: '他想了很久：一个箱子，锁着，还热。我搬到棚里，半夜锁自己化了，里面是空的，只有一层水。我把水倒进水渠，第二天渠里死了鱼。那个箱子现在还压在我床板底下。',
          give: { chips: 2, gear: 1 }, track: { power: 1 }, relation: 2,
        },
        {
          id: 'se5', label: '让他替你找一个人', once: true, minRelation: 6,
          reply: '他说：你给个编号，我去问。要是那个人还在外面，我给你带一样他身上的东西；要是不在了，我什么也不带，这样你不用猜。这件事不收盐，算我欠你一次。',
          give: { intel: 3 }, track: { renown: 1, sin: 1 }, relation: 2,
        },
      ],

      first: '接缝外侧的落脚棚漏得很有规律。一个矮个子男人蹲在棚下拧一件旧义体的腕轴，听见脚步就停了手。他说他叫萨尔，在潮里捡东西，捡得到就吃，捡不到就等。他问你有没有带盐。他说，带了盐的人，他一般愿意多说两句。',
    },

    /* ---------------------------------------------------------- */
    'ban-tou': {
      name: '班头',
      role: '回收场领班',
      district: 'salvage',

      low: [
        '他把面包渣拍掉：先说价钱。我这地方不赊账，不看脸。你是拿货还是出货。',
        '他把你从头看到脚：你身上没味，说明不是干活的。行，那我按最贵的报。',
        '他踢了一脚旁边的零件箱：这边的东西都有编号，编号是我后刻的。你问来源，我一律说不知道。',
        '他说：别跟我称兄道弟，我记不住。你报个名，我记在本子上。名字不对，下一次价钱翻倍。',
      ],

      mid: [
        '他把一只膝关节举起来给你看：三副里能用的就这一副，另外两副轴承磨穿了。天天有人来买这个，出价比原厂低一半。我不卖好的，好的我自己留着。',
        '他压低声音：前天晚上有人来翻过栈，没翻到东西，翻到了我留的一份清单，上面有编号和收货人。那份清单现在不在我这儿了。',
        '他说：我这一行公道不公道全看秤。秤在我手上，我可以少算你半斤。半斤我记在账上，等你还。你可以不信我，但秤你带不走。',
        '他抹了一把脸：上个月分拣线卡过一次，卡住的是一个人。没死，少了两根手指。报告写的是操作不当。那人的名字我留着，等他要赔偿，我给他作证。',
      ],

      high: [
        '他忽然把声音放低：我有个弟弟在外面，跟你差不多年纪。他哪天摸到这条线上来，你替我别让他碰传送带。这事我只能托你，别人我不信。',
        '他说：我在这一行干了十九年，手上的东西全是别人的。捡回来、翻新、再卖出去。有时候半夜我会想，这么多东西，哪一件本来是给我的。',
        '他把最外层手套脱了，手背上全是旧疤：你别看我粗。我不坑人，是因为我知道被坑的人会回来。回来的人最麻烦，砍不死也赶不走。',
        '他把那块干面包掰了一半递你：吃吧。说句实话，你上礼拜来的时候我当你是上面派来的探子。现在不像了。探子不会站这么久，还闻这味道。',
      ],

      reactions: [
        { when: { sin: [7, 12] },    text: '他扫你一眼：你手上的事我不问。但你把货带进我这片地，就等于把编号留在我的秤上。你要给钱，我替你抹平；不给钱，别往这边放东西。' },
        { when: { loyalty: [0, 2] }, text: '他把秤杆搭上肩膀：你在上面已经不吃香了。行，在我这儿你还有用。价钱我给公道，你替我把这条线记着就行。' },
        { when: { money: [0, 15] },  text: '他啐了一口：没钱的来了。行，先干活。我这缺个分拣的，一天四十，干三天抵一件货。你要是不肯动手，线你也不用问了。' },
        { when: { folded: [8, 12] }, text: '他看你一眼，又看你手：你这阵子来过几趟了。折到这份上还到处跑的人，不是在找货，是在找退路。我这儿没有退路，只有废料。' },
        { when: { power: [8, 12] },  text: '他把秤放下了：你现在能一句话封掉我这片地。那我说明白——我不惹你，账给你按实算。你也别拿规程压我，我认得你，也认得你这身衣服。' },
      ],

      topics: [
        {
          id: 'bt1', label: '问他回收场的秤准不准', once: true, minRelation: 0,
          reply: '他把秤盘往你面前一推：准不准看人。你要出货，我少算你半斤；你要买货，我按实来。那半斤记在我账上，不算你的。这条规矩是我定的，来过的人都知道。',
          give: { money: 20 }, relation: 1,
        },
        {
          id: 'bt2', label: '问他有没有能用的枪', once: false, minRelation: 0,
          reply: '他指着最里面那排箱子：能响的九支，编号都后刻过。你查编号查不到，查到的是另一支枪。要买别挑最亮的，亮的是擦出来的。挑沉的，沉的那支上过手，有人替你试过火。',
          give: { gear: 1 }, relation: 1,
        },
        {
          id: 'bt3', label: '问那晚是谁翻的栈', once: true, minRelation: 3,
          reply: '他往传送带那边看了一眼：三个人，两男一女。女的没进门，站外面看风。男的一个是旧件翻新栈的，我认识他的鞋。他们找的是清单不是货。你别去问翻新栈，问了他就知道是我说的。',
          give: { intel: 3 }, track: { power: 1 }, relation: 1,
        },
        {
          id: 'bt4', label: '问他卡住的那人现在怎样', once: true, minRelation: 3,
          reply: '他把一只断了两根指头的手套翻出来：人还在，右手废了。报告写操作不当，他签了字，因为不签拿不到药。名字我留着。你哪天能改那份报告，我把我留的原件给你。',
          give: { intel: 2 }, track: { renown: 1 }, relation: 2,
        },
        {
          id: 'bt5', label: '收下他递来的半个面包', once: true, minRelation: 6,
          reply: '他把面包掰开，一半塞你手里：吃。跟你说句实话——那条传送带最后一段没人敢问通到哪。我知道一个数，从这头到那头十一分钟。十一分钟，够运走一个人。你哪天要查，从我这条线进去。',
          give: { intel: 2, vitality: 1 }, track: { sin: 1 }, relation: 2,
        },
      ],

      first: '回收场白天空地冒烟。班头蹲在分拣线旁边啃干面包，见你过来把面包往兜里一塞。他手上戴着三层手套，最外面那层已经破了。他说他叫班头，管这条线，一天过手两百斤零件。他上下打量你，说：你这双鞋不该走进来，踩到油你赔不起。',
    },

    /* ---------------------------------------------------------- */
    'wu-mian': {
      name: '无面',
      role: '记忆银行柜员',
      district: 'memory',

      low: [
        '它把一份表单推出来，手指没有碰到纸：请写清你要取的是哪一段。这里不接受形容，只接受年月与编号。形容会被归到噪声。',
        '它说：你的编号在三年前有过一次查询记录，查询人已注销。这类记录我们保留七十年，不是因为重要，是因为没人来删。',
        '它微微偏头，像在比对：你的声音和我们存的一份备份相似度很高。不是你的备份。你要不要听一次。费用从那一份里扣。',
        '它说：这里恒温负十八度。人不在这里，只有人做过的事在这里。你不用紧张，紧张不影响档案，但会影响你说的地址。',
      ],

      mid: [
        '它把一段记录调出来，屏幕上是蓝的：这一份备份托管了七年，没人来取。按规程满十年转存下一层，下一层不对外开放。你要是认识托管人，让他今年来。晚一年，就要走流程找人了。',
        '它说：人格副本交易所的报价上周涨了百分之十七。涨的原因是一份稀有样本入库。稀有不是因为它好，是因为它删不掉。',
        '它把手放在台面上，手的形状有点不对：柜员做久了会忘记自己是不是被存进来的。无面不确认这一点。它只负责把名字写对。',
        '它说：三个月前有个女人来查一个孩子的备份。编号她背得出，日期背得出，就是名字背不出。她在这里站了四个小时。最后我给了她一份空表。你把名字准备好再来。',
      ],

      high: [
        '它沉默了一会儿：无面原本不是柜员。它是一份托管的备份，放得太久，管理员给了它一个柜台。所以你问它自己的记忆，它答不上来。它现在用的这一段，是替别人保管的。',
        '它说：我可以让你看一眼备份是什么样子。看过之后你会开始想知道自己那一份在哪里。这个顺序不可逆。要不要看，你决定。这里不催人。',
        '它把灯调暗了一格：负十八度，安静的时候我能听见纸在响。那些是没被读过的名字。你哪天不在了，你那一份也会响。这是这里唯一的声音。',
        '它说：我记录过你四次来访，每次都不漏。你能被人记住，是稀有事件。柜台不记恩，不记仇，只记时间。你现在站在这里，我已经写完这一行。',
      ],

      reactions: [
        { when: { sin: [7, 12] },    text: '它说：你的记录里有几处被改过，改的人也签了字，签字的人不是你的上级。无面不问原因，只提示：这些改动十年后会重新出现，届时没有人能解释。' },
        { when: { loyalty: [0, 2] }, text: '它翻了一页：你的权限还剩三分之一。权限用完那天，你的备份会自动转为托管状态，需要有人来取。目前登记的联系人一栏是空的，请你尽快填一位。' },
        { when: { money: [0, 15] },  text: '它说：查询费可以欠，这里唯一不接受欠账的是托管费。托管费一断缴，那一份就会沉到下一层，取出来要两个人签字。你现在缺的，是那两个人的名字。' },
        { when: { folded: [8, 12] }, text: '它看着你的手，没有表情：你折的次数已经超过多数人。折得越多，存进来的东西越轻。到最后你存进来的可能只剩一段日期。要不要现在先存一段。' },
        { when: { power: [8, 12] },  text: '它站直了：你的权限现在可以调走整个柜台。无面不阻止。它只按规程提示：柜台一旦换人，原先的存取记录会重新编号。你原本那一份，也许就不叫那个名字了。' },
      ],

      topics: [
        {
          id: 'wm1', label: '问它自己有没有备份', once: true, minRelation: 0,
          reply: '它停了一下：有。编号它记得，取不出来，那把钥匙的授权七年前就过期了，续期申请至今没有人提交。这个问题之前有两个人问过。第一位已注销，第二位在下一层。你是第三个。',
          give: { intel: 2 }, track: { sin: 1 }, relation: 1,
        },
        {
          id: 'wm2', label: '问托管七年的那份备份', once: false, minRelation: 0,
          reply: '它调出编号给你看，屏幕上一行蓝字：托管日七年零四个月，无读取记录。按规程满十年转存下一层。你要找托管人，先得有他的全名。这里不认照片，不认关系，只认名字。名字错了，表就退回来。',
          give: { intel: 2 }, relation: 1,
        },
        {
          id: 'wm3', label: '问那条自动转托管的规定', once: true, minRelation: 3,
          reply: '它说：权限归零当日，备份自动转入托管状态，需一位联系人签字才能取出，规程第九条原文如此。联系人一栏空着的人，占我们库里三成。你要写名字，现在就可以写，写谁由你定。',
          give: { intel: 3 }, track: { power: 1 }, relation: 1,
        },
        {
          id: 'wm4', label: '问能不能看一份备份', once: true, minRelation: 3,
          reply: '它把灯调暗了一格：可以，一次一段，看的时候不能带任何东西进来。看过之后你会开始想知道自己那一份在哪里，这个顺序不可逆。你要看，就报一个编号。不报，我就报你自己的。',
          give: { chips: 2 }, track: { sin: 1 }, relation: 2,
        },
        {
          id: 'wm5', label: '托它替你存一段记忆', once: true, minRelation: 6,
          reply: '它没有问内容：编号我写下了。这一段的读取权限只有你能开，费用记在你名下，前三年免。提醒你一句——柜员不替人保管秘密，只保管事实。你说的每一个字，都会按原样存在这里。',
          give: { intel: 2 }, track: { renown: 1, loyalty: -1 }, relation: 2,
        },
      ],

      first: '记忆银行的柜台玻璃很厚。柜台后面的人站起来，你看不出它的性别，也看不出年龄。它说它叫无面，是这里的柜员，负责存取，也负责决定哪一份该沉到下面。它把你的编号念了一遍，没有念错。它说：你来取，还是来存。这里的顺序不一样。',
    },

  };
})();

/* ===== game/lore.js ===== */
/* 世界观碎片：每个 NPC 主动讲给你听的事。 */
(function () {
  'use strict';
  window.LORE = {

    /* ==================== 闻铎 · 董事会监事 · 男 ==================== */
    'wen-duo': [
      {
        id: 'wd-l1', topic: '牌局为什么用纸做', minRel: 0,
        text: '董事会不看文件，看牌。十三个人坐在长桌那头，把要办的事写在卡上，谁抽到谁去办。章程里管这叫议程可视化管理，我抄过那一页，抄完就知道这东西为什么必须用纸做——纸能烧。你手上那十二张，每张后面都压着一个人的名字。有几张的名字，以前也坐过那张桌子。',
      },
      {
        id: 'wd-l2', topic: '上一批玩牌的人', minRel: 0,
        text: '上一批一共四个人。头一个折到第九张那天早上没来上班，工位收得很干净，干净得像没人坐过。第二个改了名字，调到轨道港做票务核录。第三个我见过一次，在下层，他认出我，却不说话。第四个折完了十二张，现在是董事会里最年轻的那位，也是最不爱提自己怎么上来的那位。',
      },
      {
        id: 'wd-l3', topic: '罪痕是按次算的', minRel: 3,
        text: '我经手过四十七份人事档案。同一个编号被标红三次的，没有一个还留在系统里。标红不需要案由，只需要三个不同部门的签字。你现在两次了，第二次是上周三下午四点那份会议记录，那天你多问了一句预算谁批的。我没有替你算，是你自己签的字。三次之后他们要动的不是人，是你留下的那一栏。',
      },
      {
        id: 'wd-l4', topic: '回收单上的三个去处', minRel: 6,
        text: '回收单上只有三个目的地。第一栏写环带，去的人还在，只是工号进了排班表，排到第几百位，等一处漏水的接缝。第二栏写记忆银行，人去，身体不去。第三栏是空的，签收人自己填，填完这一栏的人在系统里查不到来路，也查不到去向。我见过三个拿到第三栏的，都是笑着走出去的。',
      },
    ],

    /* ==================== 苏纹 · 董事会日程官 · 女 ==================== */
    'su-wen': [
      {
        id: 'sw-l1', topic: '七天是怎么数的', minRel: 0,
        text: '期限不是从发卡那天算，是从卡片进入你名下账户的那一秒。系统会在第七天的二十三点五十九分打一次标记，那之前折掉一张，标记就不落。有人以为可以拖到第八天早上补，补不了，标记是自动的。我桌上有一份表，每一格都是七天，从年初排到年底，格与格之间没有缝。',
      },
      {
        id: 'sw-l2', topic: '日程表上的红格', minRel: 0,
        text: '我排的是董事会今年的日程。一月到十二月，每周两场简报，每场四十分钟，中间休息七分钟。红格是他们自己划的，划红格的那天不排任何事。去年有十一个红格，今年到昨天是十七个。划红格的手从来不抖，划完把笔放回原来的位置，位置一点没偏。',
      },
      {
        id: 'sw-l3', topic: '忠诚不是态度', minRel: 3,
        text: '忠诚不是你怎么想，是别人怎么记。董事会记忠诚只看两样：签字的时间，和请示的频次。签得早不算好，签得准才算。请示太勤的人会被标成没有主见，请示太少的人会被标成不需要盯着。两种都要处理，方式不一样，一种调岗，一种不调。调完以后，表格上那一栏都会变成好看的颜色。',
      },
      {
        id: 'sw-l4', topic: '上一个日程官去哪了', minRel: 6,
        text: '我前面那个日程官叫岑，比我小两岁。她做满三年，最后一项工作是替一张卡排期。卡折掉之后，她把自己也排进了下一周的空档，那格本来是留给董事会务虚会的。她走的时候没有交接，只把椅子推回桌子底下，推得很正。第二天有人来擦桌子，擦完问她那一栏要不要填，我说不用填。',
      },
    ],

    /* ==================== 郁南枝 · 清算行首席 · 女 ==================== */
    'yu-nanzhi': [
      {
        id: 'yn-l1', topic: '集团靠什么赚钱', minRel: 0,
        text: '集团不靠生产赚钱。生产在下层，那些厂的利润按季度报上来，占集团总收入的百分之十一。真正的钱在另外三块：水、地和许可。水是穹顶的排水与净化，地是城区的地面权，许可是让一件事合法发生或者合法不发生。最后一块最贵，也最干净，账面上一分钱成本都没有。这三块去年合计占九成一。',
      },
      {
        id: 'yn-l2', topic: '吞并的价格怎么算', minRel: 0,
        text: '吞并的价格不算资产，算负债。我们买一家公司之前先看它欠谁、欠多久、欠过多少人的命。欠得越乱越便宜，因为没人替它清账。上周一家物流子公司，账面资产三千万，负债折成一千二，我们出九百万拿下，其中一百万是给原来的老板买一张离境票的。票不是给他走的，是给他闭嘴的。',
      },
      {
        id: 'yn-l3', topic: '声望是折算出来的', minRel: 3,
        text: '声望在清算行有对应汇率。上周的价：一条慈善新闻加三点，收购时不还价加一点，替下层的排水阀签个字加两点，杀人被查到扣八点。声望高的人走得远，但不是走得稳。声望和罪痕是两条不同的线，一条决定你最后算哪种赢，一条决定你什么时候被算账。做我们这行，只盯第二条。',
      },
      {
        id: 'yn-l4', topic: '清算行的清算流程', minRel: 6,
        text: '清算不是我动手。清算行发一张对账函，对方在四十八小时内把钱、关系、人一并交出来，交不出就交名字。我们只做三件事：定价、算清、归档。人不归我们处理，归回收场。去年经我手的清算一共十九笔，十九笔的签名栏都是我，可我只见过其中四个当事人。另外十五个，我只见过文件。',
      },
    ],

    /* ==================== 戴思远 · 合规伦理审查官 · 男 ==================== */
    'dai-siyuan': [
      {
        id: 'ds-l1', topic: '合规部为什么没人', minRel: 0,
        text: '合规部去年十二个人，今年四个。不是裁的，是主动申请的调岗：一个去了交易所，三个去了下层做现场审核。没人愿意坐在这里，因为这里每一个结论都只能写成建议，建议没有后果，也就没有功劳。我留下来是因为我在做一件事：把每一份建议都编号留底。这不合规，但也没人管。管的人去年调走了。',
      },
      {
        id: 'ds-l2', topic: '清洗在流程里叫什么', minRel: 0,
        text: '清洗在正式文件里叫人员关系终止。要三样东西：一份岗位空缺说明、一份资产交回清单、一份签字。签字那一栏不写名字，写编号。我审过三十一份终止单，二十九份手续是齐的，另外两份少一页。少的那一页没人补，也没人问。我问过一次，第二天我的调岗申请被系统退回来了。',
      },
      {
        id: 'ds-l3', topic: '罪痕是留给自己看的', minRel: 3,
        text: '罪痕不是别人记的，是你自己签的。你每做一件越过规程的事，系统就在行为日志里留一行。那行不会自动上报，只在两种时候被调出来：你要升的时候，和你要被处理的时候。前一种给你扣分，后一种给你定价。我见过有人把日志清得很干净，那种人升得最快，也消失得最干净。',
      },
      {
        id: 'ds-l4', topic: '审计记录里的旧玩家', minRel: 6,
        text: '我翻过五年前那批人的记录。四个人，一共折了三十一张牌，超过通关线很多。但审计结论里没有赢家这一栏，只有三个字：已归档。归档的意思不是他们没事，是这件事不再需要有人对它负责。四份档案我都调过，调阅记录显示，我是三年半以来第一个打开过它们的人。',
      },
    ],

    /* ==================== 程砚 · 首席科学家 · 女 ==================== */
    'cheng-yan': [
      {
        id: 'cy-l1', topic: '穹顶的官方解释', minRel: 0,
        text: '穹顶在官方档案里叫气候灾后保护工程。写得很干净：外侧酸雨，内侧可居，设计寿命一百二十年，现役第八十一年。我做过接缝材料的老化测试，实测数据比设计值快。也就是说，一百二十年这个说法，最多是多写的三十年，而那三十年不在我的名册上。名册上没有的东西，我不会替它签字。',
      },
      {
        id: 'cy-l2', topic: '人格备份是什么', minRel: 0,
        text: '我们做的备份不是把一个人存起来，是把他能被系统识别的那部分留住：语言习惯、决策倾向、对特定编号的反应。原始数据每季度刷新一次，刷新意味着新的覆盖旧的。备份三份，一份在记忆银行，一份在研究所，第三份在轨道港的一艘船上。前两份我随时能拿到，第三份我从来没拿到过。',
      },
      {
        id: 'cy-l3', topic: '扩张要占的是设施', minRel: 3,
        text: '扩张在文件里叫节点接管。要占的从来不是地盘，是设施：变电站、泵房、通信塔、冷冻舱。谁能把这些停下来，谁就占了那条街。我们院里报上去的接管清单有四十七个节点，实际有控制权的只有九个。剩下那些写在纸上，属于已规划，已规划的意思是，等有人先占下来，再补手续。',
      },
      {
        id: 'cy-l4', topic: '名册上删掉的一列', minRel: 6,
        text: '院里的名册有九列，第十列存在过，现在没有。那一列叫来源，记录每一份血样从哪儿来。第八十一年第三季度那次换版，来源被合并进备注，备注不参与统计。我手上留着一份旧版复印件。纸是热的不是冷的，那是我自己抄的，抄的时候还没想好要不要留下它。',
      },
    ],

    /* ==================== 彭戬 · 研究所安保总管 · 男 ==================== */
    'peng-jian': [
      {
        id: 'pj-l1', topic: '占地是什么意思', minRel: 0,
        text: '占地不是打进去，是站在那儿不走。安保手册第一条：任何非授权进入的人，先由外圈处置，外圈处置不了再报我。外圈是我们的承包商，四个队，每队十一人。过去三年外圈一共处置过两百八十一次，其中十九次需要我签字确认。那十九份都还在柜子里，编号从零一四排到零三二。',
      },
      {
        id: 'pj-l2', topic: '园区里的静音走廊', minRel: 0,
        text: '三号走廊全程静音，地板铺的是吸音料，走路没有回声。静音不是为了保密，是为了让人听得见自己的心跳，进去的人会自然放慢脚步。走廊尽头是伦理审查室，进去过的人出来都会先去洗手。我在门口站了六年，六年里洗手的有两百多个，洗两遍的占一半。洗完第二遍的人，一般不回原来的岗位。',
      },
      {
        id: 'pj-l3', topic: '权柄看你能叫动谁', minRel: 3,
        text: '权柄不看你的职级，看你能叫动几个人，以及那几个人是谁的人。你现在的数里，有你自己的两名外勤，还有一条保安通道。别人给你面子，是因为不确定你后面站着谁。这种不确定只能撑一段时间。撑不住的那天，第一件事就是有人来问我：你是不是天天走三号走廊。',
      },
      {
        id: 'pj-l4', topic: '人是怎么被带走的', minRel: 6,
        text: '园区里的人被带走不走大门。走地下二层的货物梯，货梯里常备推车，推车上铺防尘布。带走前会有一张单子给我，单子上写的是设备借出。我把单子归档，归档的盒子编号跟真设备盒一样，放在同一排货架上。谁要查，得先知道自己在查什么。不知道的人翻到那排架子，只会觉得无聊。',
      },
    ],

    /* ==================== 老鸦 · 灰市掮客 · 男 ==================== */
    'lao-ya': [
      {
        id: 'ly-l1', topic: '四条路在灰市的价', minRel: 0,
        text: '四条路我这儿都有价。操控最便宜，一份把柄两百；资本看量，五万起谈；扩张贵，一条街的通道要价一万二，包三天；清洗最贵，我一般不接，接了先付全款，事成退两成。规矩只有一条：钱先到，话后到。你先问话再问价的，我就当你是来打听的，打听的价另算，一般比原价高三成。',
      },
      {
        id: 'ly-l2', topic: '回收的路可以买', minRel: 0,
        text: '回收单进了环路，也不是全没办法。第一栏我认识两个巡检，能让人在环带多待半年，价钱按接缝算，一米四百。第二栏我没办法，记忆银行不收钱，它只看编号。第三栏最怪，我做过两回，都是家属来买的，要的东西一样：一个不留记录的名字，和一口能烧的东西。做完那两回我就不接了。',
      },
      {
        id: 'ly-l3', topic: '穹顶以前不叫穹顶', minRel: 3,
        text: '穹顶以前不叫穹顶，叫四号开发区。我小时候跟着家里搬进来，那时候上面还开着，能看到天，天是灰的。后来接缝开始渗，集团说是外面的酸雨过来了，就把它一封，封完改名。我记性好，记得那张施工公告上写的竣工日期，比后来档案里写的晚了三年。公告我撕了一角留着，现在压在摊子的秤底下。',
      },
      {
        id: 'ly-l4', topic: '那个戴银面具的', minRel: 6,
        text: '那个代理人我不接它的生意。不是不敢，是它不按价签走。它来只做两件事：问一个编号还在不在，留一样东西让人转交。东西不能打开，也不值钱，一封信、一枚扣子、一段录音。有人问我是男是女，我说不出来。我给谁介绍过它，谁半年内都出了一件大事，四回里三回是坏事，剩下一回不好说。',
      },
    ],

    /* ==================== 陆晚 · 无证诊所医生 · 女 ==================== */
    'lu-wan': [
      {
        id: 'lw-l1', topic: '雨落进来会变泥', minRel: 0,
        text: '雨在穹顶外侧是雨，进到下层就变泥。七区那边的管线是老式的，酸性雨一落，管壁积的粉就起来，雨变成灰白色的浆，沾到皮肤上两个钟头就开始烂。我这儿一年治一百多个这样的病人。治不好的是那些第二天才来的，来的时候伤口已经开始结痂，痂下面还是烂的，只能往下挖。',
      },
      {
        id: 'lw-l2', topic: '排水阀在谁手里', minRel: 0,
        text: '下层有十四个排水阀，七个在集团手里，四个在工会手上，剩下三个没人管，坏了也没人管。下雨天的排队就是等阀门开。开阀的申请单要走到你那个部门才算最后一道。我见过有人抱着单子等三天，三天里雨停了两次，又下了三次。你不用替他们难过，你把单子批了，他们就少等一天。',
      },
      {
        id: 'lw-l3', topic: '罪痕是长在身上的', minRel: 3,
        text: '罪痕在文件上是一行字，在人身上是一道疤。我这儿来过一个中层，右肩后面有四个针眼，排得很正。他说是体检。我给他缝的时候数了数，四个针眼对应四张回收单。他还年轻，手一直在抖。我没问他做了什么，问了也白问。针眼的排法是人家定的，不是他定的。',
      },
      {
        id: 'lw-l4', topic: '被回收的人还剩什么', minRel: 6,
        text: '被回收的人，身体大多会回来一部分，装在袋子里送到我这儿，让我判断还能不能算人。多数时候不能，我签字，东西送回收场。有一次送来的是个熟脸，护士出身，教过我打针。她手背上有个旧烫伤，我认出来的时候手抖了一下。她的登记表我留了一份，那一栏我写的是无人认领。',
      },
    ],

    /* ==================== 铁贵 · 装卸工会头目 · 男 ==================== */
    'tie-gui': [
      {
        id: 'tg-l1', topic: '港区一天过多少货', minRel: 0,
        text: '港区一天过七千四百件。注册在册的四千三百件，剩下三千一百件走夜班。夜班那批不写货单，写散件，散件在账上按重量算，一吨三百二。真正值钱的不是重量，是里面夹的东西：义体关节、军用级电池，还有整箱的接缝封条。封条是穹顶的命，谁拿到封条，谁就能决定哪一段先漏。',
      },
      {
        id: 'tg-l2', topic: '潮是水到齐了', minRel: 0,
        text: '外面那个潮，港区的人说法不一样。有人说它是雨，下够了就成潮。有人说它是人，是这八十年里被冲出去的人。我们装卸工会自己有说法：潮不算东西，算日子。你哪天听说有人从接缝往外走了而且回来了，那天就算潮来了。我干了二十六年，见过两回。两回之后，港区都少了几个人。',
      },
      {
        id: 'tg-l3', topic: '工会怎么守住街口', minRel: 3,
        text: '扩张到我这儿就是一个字：人。我们工会一千一百二十七个在册会员，管着港区九个街口和两条货道。守街口靠三样：饭、班次、欠账。饭是每天两顿，班次是排谁去挡人，欠账是让想动我们的人先掂量。上个月有承包商想插一条道，我们没动手，把他手下的班次全买空了。人没了，他就开不了工。',
      },
      {
        id: 'tg-l4', topic: '划单的人还会回来', minRel: 6,
        text: '我手下被划过三个人的单。第一个在环带，还在排队等排班，我每个月给他寄盐和鞋。第二个的义体上了回收场的传送带，我让人把接管截下来了，现在还锁在库里。第三个没消息，档案上写已转出，转到哪儿谁也不说。我留着他们三个的工牌，挂在装卸处门后头。谁问我都说，这是值班牌。',
      },
    ],

    /* ==================== 银面 · 女术士的代理人 · 性别不明 ==================== */
    'yin-mian': [
      {
        id: 'ym-l1', topic: '牌桌上有个空位', minRel: 0,
        text: '牌桌上有个位置一直空着，桌上放着筹码，没人去碰。发牌的人不问，围观的人不提。我为什么知道？因为空位置对面那把椅子我认识。有人坐过一次，坐完第二天就没了。这一局里最要紧的一条不是怎么赢，是不要让空位置边上的人觉得，你会去坐它。坐过的人留下的东西，现在还在我这儿。',
      },
      {
        id: 'ym-l2', topic: '我不替谁说话', minRel: 0,
        text: '我不替谁说话，也不替谁看事。你要想让我记一句话，说完就走，别回头看。你要想让我替你去见什么人，先说清你需要他记住你的哪一面。人只记得住一面，多了就记岔。我见过太多人想让人记住全部，结果什么都没留下。那个女术士也一样，她只留了名字，剩下的都交出去了。',
      },
      {
        id: 'ym-l3', topic: '权柄是别人欠你的', minRel: 3,
        text: '权柄不是你有多少，是多少人不敢欠你。你去数一数，现在有多少人因为怕你而按时回话，那就是你的数。你签过的字、放过的人、替谁压下去的报告，都算在这笔账上。账不会自己平。平账的那天，你要在，你的名字也要在。这两样缺一样，账就落到别人头上，落到别人头上就是别人的权柄了。',
      },
      {
        id: 'ym-l4', topic: '上一位坐这把椅子的人', minRel: 6,
        text: '我位置上一个人折了九张，折到第七张的时候开始改名字，改成他母亲那一族的姓。第九张之后，他把牌都推回去了，说不会玩。三天后他来送一样东西，让我转交。他没说给谁，只说谁先来找就给谁。那东西我留着，到现在只有一个人来问过。他问的不是那东西，是你的名字，问完就走了。',
      },
    ],

    /* ==================== 温仕成 · 引航票务掮客 · 男 ==================== */
    'wen-shicheng': [
      {
        id: 'ws-l1', topic: '离境票的真实规则', minRel: 0,
        text: '离境的票面上写座位号，真正管用的只有两样：一个在册的入港事由，和一个愿意替你签收的人。前者决定你能不能过闸机，后者决定你落地之后有没有名字。票是明码的，二十万起步，砍价扣排队名次，名次比钱难补。我这摊子最贵的一张卖过六十四万，买家是个做账的，他买完就没再出现过。',
      },
      {
        id: 'ws-l2', topic: '穹顶建成前有票根', minRel: 0,
        text: '我箱底留着穹顶建成前的票根，纸都脆了。那时候进出的船一天四趟，票根上印着日期和工种。后来封穹顶，船停了十一天。第十一天回来的那趟只下来两个人，一个是我师父，一个是军需官。师父下船只说了一句话：外面的天不是黑的，是灰的，灰的也能看。说完他就去办了离职。',
      },
      {
        id: 'ws-l3', topic: '声望能换一张票', minRel: 3,
        text: '声望在我这儿能折票价。捐过下层排水阀的折两万，在交易所替中小股东出过头被记过档的折三万，被董事会点名表扬过的我反而不收，那种人的票往往过不了闸机。你名声越大，走得越看得见；走得越看得见，就越有人等着看你走。你这半年名声还行，我劝你先别涨了。',
      },
      {
        id: 'ws-l4', topic: '有人买票真的走了', minRel: 6,
        text: '前年有个客人，买票时报的是真名，还在票根背面写了日期。他是那批玩牌局的人里第四个，折到第六张就停了。他走的第二天，他家里被人翻过一遍，翻得很整齐，只少了一本相册。去年有个小子拿着他的票根来问我是不是真有这么个人，我说有。他就不问了，转身去排下个月的队。',
      },
    ],

    /* ==================== 雨客 · 穹顶外「潮」的接触人 · 性别年龄不明 ==================== */
    'yu-ke': [
      {
        id: 'yk-l1', topic: '外面没有楼层', minRel: 0,
        text: '外面没有楼层，也没有早上。你从接缝出来，站够十分钟衣服就开始发痒，那是酸的。天不黑，是灰的，灰得像一块没洗的布。远处有灯的地方不是城，是几堆烧东西的火。围着火的人不看你，先看你的鞋。你要真出来，第一件要学的不是走，是等。等的时候不能站着，得蹲下来。',
      },
      {
        id: 'yk-l2', topic: '潮不是人也不是水', minRel: 0,
        text: '里面的人问潮是什么，我每次说法都不一样。潮不是水，水是它路过的东西；潮也不是人，人只是还没被它冲散的。它更像是一种腾出来的空——哪里死的人太多，哪里就腾出空，空够大了，潮就来了。你问我要不要怕。我怕的不是潮，是有一天潮认出我，把我当成已经空掉的那部分。',
      },
      {
        id: 'yk-l3', topic: '穹顶是后罩上的', minRel: 3,
        text: '他们说穹顶是保护，是先有灾难再有罩子。我听到的是反的。先有的城，先有的四号开发区，罩子是在某一年突然封上的，封的时候外面还有人。我认识一个人，他的姐姐就是封罩那天没进来的。他说那天没有公告，只有风。你那边的档案里，这一年大概率写着四个字：接缝检修。',
      },
      {
        id: 'yk-l4', topic: '接缝外面有灯', minRel: 6,
        text: '你问外面有没有人活着。有，但不算活得好。他们会用轨道港丢下来的东西搭棚子，把接缝渗下来的水接起来，沉两天再喝。他们有名字，只是不写在任何系统里。你要想知道有多少人，别去数，去听。晚上贴着接缝能听见敲打的声音，一下一下的。那个频率是有人在修东西，不是风。',
      },
    ],

    /* ==================== 荀戒 · 环带巡检员 · 男 ==================== */
    'xun-jie': [
      {
        id: 'xj-l1', topic: '环带是烂尾的开发区', minRel: 0,
        text: '环带不是为维修建的，是先建的开发区，后来没钱了。档案里叫它四号开发区配套层，预算超了三倍，第三年停工，工地上的人没撤，住下了，就成了环带居民。我念了十一年规程，第一条写环带用途是设施维护，没写住人。可我这四百米里有六百多户。我每天打着手电走一圈，其实是在替他们数门牌。',
      },
      {
        id: 'xj-l2', topic: '规程里没有回收两字', minRel: 0,
        text: '规程里没有回收这两个字。人被转出时，转出单上写的是编制撤销。送过来的人先进排班表，排班表后面是房间号，房间号后面是接缝编号。我核过的转出单有九十多张，其中三分之一的人在半年内改了工号，改了工号就等于换了一个人。规程最后一条写着：环带不承担人员去向的记录义务。',
      },
      {
        id: 'xj-l3', topic: '排班表上的工号', minRel: 3,
        text: '排班表贴在管廊尽头，纸是潮的，字会花。第一列工号，第二列区段，第三列班次，第四列空着，留给巡检签。你问我这里有没有认识的人，有过。前年有个人来的第三天，工号被划了，划掉的那格第二天被人补上一模一样的字，只是末尾一位从七变成一。我照着签了，规程没写不许签。',
      },
      {
        id: 'xj-l4', topic: '第四十一号接缝', minRel: 6,
        text: '第四十一号接缝在我这四百米的末端，是全环带渗水最厉害的一处。上面给我的定额是每天擦一次，我实际每天擦两次，冬天三次。为什么是它？因为它外侧正好对着轨道港的下风口，谁把东西从港区丢下去，都从这儿落。我捡过鞋子、工牌、一封没拆的信。信我没拆，交上去了，登记编号是零四一七杠十一。',
      },
    ],

    /* ==================== 萨尔 · 潮的拾荒者 · 女 ==================== */
    'sa-er': [
      {
        id: 'se-l1', topic: '潮里怎么分东西', minRel: 0,
        text: '潮里分东西不按人分，按先来后到。谁先看见谁拿，抢的人以后没人带他。你拿了一样，得留一样，留的不能挑轻的，挑轻的下次没人接你。我们那儿有句话：拿走的是别人的，留下的是自己的。你听不听得懂不重要，做得对不对才重要。我刚来的时候不懂规矩，被罚过两次，第三次就记住了。',
      },
      {
        id: 'se-l2', topic: '外面的人怎么活', minRel: 0,
        text: '外面的人怎么活？捡、换、等。捡接缝漏下来的，换彼此有的，等雨停。雨停的日子不多，一年到头大概四十来天。那些天最热闹，有人晒衣服，有人修棚子，有人往城里方向走，走到接缝外看一眼就回来。我们不叫那边城里，叫干的那边。干的那边的人过来，第一句总问：你们吃什么。',
      },
      {
        id: 'se-l3', topic: '回收料流到外面', minRel: 3,
        text: '回收场的东西有一部分会漏到外面。路线是从港区夜班出来的，装散件，一吨三百二，过接缝的时候穿的是运输船的名。漏下来的东西我捡过：一只义体手、一块没烧完的芯片，还有一个完整的工牌。工牌上的照片是个年轻姑娘。我把它挂在棚子口，挂了半年，后来被水冲走了。那天我找了一整天。',
      },
      {
        id: 'se-l4', topic: '穹顶里才是笼子', minRel: 6,
        text: '你们说我们在外面，你们在里面。我走过一次接缝，去过干的那边。那边什么都亮，什么都有人管，连你走路的步频都有人记。你们怕外面的雨，我怕里面的管。在里面待了两天我就出来了，出来那天正好下雨，我淋了一身，高兴得要命。你们管这叫牺牲，我们那儿管这叫被放出来。你想出来吗，我带你走。',
      },
    ],

    /* ==================== 班头 · 回收场领班 · 男 ==================== */
    'ban-tou': [
      {
        id: 'bt-l1', topic: '回收场怎么结账', minRel: 0,
        text: '我这儿结账按件，不按人。一件上肢四块，下肢六块，带编号的加两块，编号磨掉的不收。集团的单子写拆干净，意思是取出可用件，剩下的按废料走。我一天过手两百斤，月底报的数跟实际差三到五个点。差的那些我留着，给工伤的人换件。这事上层知道，但上层也算在我的人头费里，所以没人开口。',
      },
      {
        id: 'bt-l2', topic: '义体接管还是温的', minRel: 0,
        text: '判断一条义体是拆的还是收的，看接管。收的接管凉，拆的接管温。我干这行八年，手上过了大概四万条，温的只见过十九条，其中十一条是这半年到的。这半年集团的单子格外多，单子上写设备报废。可温的东西不叫报废，叫还没停下。我这双手套就是那时候换的，之前那副沾了点东西，洗不掉。',
      },
      {
        id: 'bt-l3', topic: '我拆过五个玩家', minRel: 3,
        text: '我拆过五个玩家，都是折不出来的那种。第一个是女的，手上还戴着年会的表。第二个送来时穿着制服，扣子都在。第三个只有一条腿。第四个和第五个是一起送来的，装在两个袋子里，袋子上的编号连着。当时头儿站在传送带那头看着我拆，一句话没说，抽完手里的烟才走。我现在看谁都像那五个。',
      },
      {
        id: 'bt-l4', topic: '下层人怎么攒钱', minRel: 6,
        text: '下层的钱藏在三样地方：饭票、鞋、孩子的学费。没人存账户，账户里的钱是会被扣的。我这条线上的人，攒够一个学期的钱要八个月，中途要是下场雨，就变十个月。上月有个小伙子来卖义体，说卖了要给妹妹买名额。义体是他自己的，卖了就剩一条腿。我按最高的价收的，还是不够，这事我没告诉他。',
      },
    ],

    /* ==================== 无面 · 记忆银行柜员 · 性别年龄不明 ==================== */
    'wu-mian': [
      {
        id: 'wm-l1', topic: '这里存取的是什么', minRel: 0,
        text: '这里存两种东西。一种是不想记得的事，删除费用一次付清，付清之后原主的调用权限作废。另一种是不能忘的事，存进来按编号封存，封存期一百年。前者多，后者少。一百年是个说法，不是承诺——柜子在地下第八层，那一层常年零下。也没有哪一条规定写着，柜子到期那天由谁来开。',
      },
      {
        id: 'wm-l2', topic: '人格备份是备份给谁', minRel: 0,
        text: '人格备份不是备份给你自己，是备份给需要调用它的部门。调用的时候不通知原主，原主也不知道自己被调用过几次。有人不带身体来存取，站在柜台前面，无面看不出年龄，也看不出是不是那个人。它只核对编号，编号对就办。无面不判断谁是人，这不是它这一栏的工作。这一栏的表格上只有两格：收，或者拒。',
      },
      {
        id: 'wm-l3', topic: '编号被标红三次', minRel: 3,
        text: '你的编号在系统里有三栏：登记栏、调用栏、封存栏。登记栏写来路，调用栏写次数，封存栏一般空着。无面见过的编号里，调用栏超过二十次的只有十一个，那十一个人的封存栏都填了同一个日期。日期是可以提前写的。你的调用栏现在是四次。四次不算多，多和不多之间，隔的不是数，是有人开始念你的号。',
      },
      {
        id: 'wm-l4', topic: '被回收的人的记忆', minRel: 6,
        text: '被回收的人，记忆不一定跟着消失。转出单上有一栏叫资料处置，三个选项：随主体销毁、移交调用、暂存待定。选暂存的要送到我这里，柜子在地下第八层。无面见过一份暂存记录，编号末位是七。来送的人用银色的东西遮住脸，放下一只盒子就走了，没说这是什么，也没说什么时候来取。盒子到现在还在。',
      },
    ],

  };
})();

/* ===== game/card-sources.js ===== */
/* 卡牌获取来源库：牌不是发全的，靠这些来源逐张挣来。 */
(function () {
  'use strict';
  window.CARD_SOURCES = [
    { id: 'cs1', kind: 'npc', npc: 'wen-duo', need: 3, n: 1, path: 'control', tier: 2, once: true,
      hint: '闻铎在简报会上替你压下一次问责，散会后把一张没用过的指令塞进你的文件夹。' },
    { id: 'cs2', kind: 'npc', npc: 'su-wen', need: 2, n: 1, path: 'capital', tier: 1, once: true,
      hint: '苏纹把你的日程挪到董事会之前，顺手把日程表背面那页空白撕给了你。' },
    { id: 'cs3', kind: 'npc', npc: 'yu-nanzhi', need: 4, n: 1, path: 'capital', tier: 3, once: true,
      hint: '郁南枝核完你的账，把一份无人认领的抵押清单推过来，编号栏是空的。' },
    { id: 'cs4', kind: 'npc', npc: 'dai-siyuan', need: 3, n: 1, path: 'control', tier: 2, once: true,
      hint: '戴思远在审查结论上写了「无异常」，然后把整份附件单独留给了你。' },
    { id: 'cs5', kind: 'npc', npc: 'cheng-yan', need: 4, n: 1, path: 'expand', tier: 3, once: true,
      hint: '程砚把实验记录的第 41 页抽出来交给你，那一页在系统里从来不存在。' },
    { id: 'cs6', kind: 'npc', npc: 'peng-jian', need: 3, n: 1, path: 'purge', tier: 2, once: true,
      hint: '彭戬批准你走一次旧货梯，条件是用完那张通行条必须当场烧掉。' },
    { id: 'cs7', kind: 'npc', npc: 'lao-ya', need: 5, n: 2, path: 'purge', tier: 3, once: true,
      hint: '老鸦欠你一次人情，他在灰市冷库里交给你两张没签过名的指令，纸还是潮的。' },
    { id: 'cs8', kind: 'npc', npc: 'lu-wan', need: 3, n: 1, path: 'control', tier: 2, once: true,
      hint: '陆晚给你缝好伤口，把一张写满编号的处方单叠进你的袖口，说这是诊金。' },
    { id: 'cs9', kind: 'npc', npc: 'tie-gui', need: 4, n: 1, path: 'expand', tier: 2, once: true,
      hint: '铁贵让工会的人替你封住三号泊位两小时，交接时把一张指令压在装卸单底下。' },
    { id: 'cs10', kind: 'npc', npc: 'yin-mian', need: 4, n: 1, path: 'control', tier: 3, once: true,
      hint: '银面用第三人称讲完你的下一步，然后把一张牌放在桌上，说这局她已经替你开过了。' },
    { id: 'cs11', kind: 'npc', npc: 'wen-shicheng', need: 3, n: 1, path: 'capital', tier: 2, once: true,
      hint: '温仕成把引航票价的空档告诉你，作为交换，你收下他名下最后一张指令额度。' },
    { id: 'cs12', kind: 'npc', npc: 'yu-ke', need: 5, n: 1, path: 'purge', tier: 3, once: true,
      hint: '雨客从穹顶外带回来一张被酸雨泡软的纸片，展开后上面是指令卡该有的编号。' },
    { id: 'cs13', kind: 'npc', npc: 'xun-jie', need: 3, n: 1, path: 'expand', tier: 2, once: true,
      hint: '荀戒巡检到环带第七段，把一张盖过章的空白指令夹进值班记录还给你签收。' },
    { id: 'cs14', kind: 'npc', npc: 'sa-er', need: 3, n: 1, path: 'purge', tier: 2, once: true,
      hint: '萨尔在堆里翻出一块没被熔掉的牌，掰开外壳后里面的编号还能认。' },
    { id: 'cs15', kind: 'npc', npc: 'ban-tou', need: 4, n: 1, path: 'purge', tier: 3, once: true,
      hint: '班头把当天的回收清单给你看了一页，夹在中间的那张指令已经被登记为已销毁。' },
    { id: 'cs16', kind: 'npc', npc: 'wu-mian', need: 5, n: 1, path: 'control', tier: 3, once: true,
      hint: '无面问你借了一段记忆做抵押，还回来的除记忆之外还有一张没人取走的指令。' },
    { id: 'cs17', kind: 'district', district: 'tower', need: 3, n: 1, path: 'control', tier: 2, once: false,
      hint: '你在高塔商业区跑满三趟简报，董事会把一张新指令挂在你的编号下。' },
    { id: 'cs18', kind: 'district', district: 'exchange', need: 3, n: 1, path: 'capital', tier: 2, once: false,
      hint: '交易所广场连做三次交割，清算行按惯例给你追加一张吞并用的指令。' },
    { id: 'cs19', kind: 'district', district: 'lab', need: 3, n: 1, path: 'expand', tier: 2, once: false,
      hint: '研究所园区三次夜间权限记录里都有你的编号，安保科按流程补发一张进场牌。' },
    { id: 'cs20', kind: 'district', district: 'slum', need: 3, n: 1, path: 'control', tier: 2, once: false,
      hint: '下层居住区三栋楼的人替你签了联名，灰市收下这份人情，回你一张笼络人的牌。' },
    { id: 'cs21', kind: 'district', district: 'docks', need: 3, n: 1, path: 'expand', tier: 2, once: false,
      hint: '工业港区三班货都经你手放行，工会把一张占地用的指令压在交接单下面。' },
    { id: 'cs22', kind: 'district', district: 'orbit', need: 3, n: 1, path: 'capital', tier: 3, once: false,
      hint: '轨道港三次过境申报都盖了你的章，票务那条线开始主动往你手里塞额度。' },
    { id: 'cs23', kind: 'district', district: 'ring', need: 3, n: 1, path: 'purge', tier: 2, once: false,
      hint: '环带维修层三处巡检都由你签收，值班室里那张没人认领的指令换到了你名下。' },
    { id: 'cs24', kind: 'district', district: 'memory', need: 3, n: 1, path: 'control', tier: 3, once: false,
      hint: '记忆银行连续三次给你开了加急窗口，柜员顺手把一张逾期未取的指令转给你。' },
    { id: 'cs25', kind: 'stat', stat: 'intellect', need: 9, n: 1, path: 'capital', tier: 2, once: true,
      hint: '你把三份互相矛盾的报表拼成一条线索，清算行认定你够格接下一张资本牌。' },
    { id: 'cs26', kind: 'stat', stat: 'charm', need: 8, n: 1, path: 'control', tier: 2, once: true,
      hint: '你在走廊里让两个不肯说话的人同时开了口，董事会据此给你补一张笼络牌。' },
    { id: 'cs27', kind: 'stat', stat: 'force', need: 8, n: 1, path: 'expand', tier: 2, once: true,
      hint: '装卸区的冲突里你站在最前面没退，工会认这个人情，回你一张占地牌。' },
    { id: 'cs28', kind: 'stat', stat: 'stealth', need: 11, n: 1, path: 'purge', tier: 3, once: true,
      hint: '连续十一天没人能说清你昨天在哪，这份干净的被遗忘本身换到一张清洗牌。' },
    { id: 'cs29', kind: 'track', track: 'power', need: 7, n: 1, path: 'purge', tier: 3, once: true,
      hint: '权柄涨到七分，董事会开始把最难的那类指令交到你手上，一张盖了最高编号的牌。' },
    { id: 'cs30', kind: 'track', track: 'renown', need: 6, n: 1, path: 'control', tier: 2, once: true,
      hint: '声望到六分，下层开始有人替你传话，灰市把一张笼络牌当贺礼送了来。' },
    { id: 'cs31', kind: 'day', need: 5, n: 1, tier: 2, once: true,
      hint: '活到第五天，董事会按惯例给撑过第一轮的人补一张牌，附信只有一行编号。' },
    { id: 'cs32', kind: 'day', need: 10, n: 2, tier: 3, once: true,
      hint: '活到第十天，日程官把你的名字从待处理名单划掉，随信补两张没写目标的指令。' },
  ];

  window.EVENTS_V5 = [
    { id: 'v1', portrait: 'portrait-monitor', district: 'tower', title: '三十三层电梯里的第二张工牌',
      text: '电梯在三十三层停住，灯灭两秒。门开时走廊上站着两个人，胸牌编号和你的一模一样，照片却不是你。其中一个先开口，说系统今天多印了一张，问你要不要认领。你手里那份简报还夹着没签完的问责单，走廊尽头的通风口一直在响，像有人在里面数数。',
      options: [
        { label: '认领这张工牌，先去查打印记录',
          run: { intel: 3, track: { sin: 1 } },
          after: '你查到打印指令来自排版室，发起人一栏是空的。工牌收进内袋时卡角还有点毛。第二天有一个陌生工号替你签收了两份文件，签名栏写的是你的名字。' },
        { label: '当场注销，写进异常报告',
          run: { track: { loyalty: 2, renown: 1 } },
          after: '异常报告进了系统，当天这条记录被同一个工号翻过三次。第三次之后，走廊上那两个人当中的一个调去了别的楼层，工牌也换了新的，编号尾数改了。' },
        { label: '什么也不认，把工牌留在原地',
          run: { intel: 1, vitality: -1 },
          after: '你走了三层楼才想起更衣箱里少了一件外套。折回去看时工牌还在原地，编号被磨掉了一位，照片那半张脸成了白板。你捡起来，又放回了原位。' },
      ] },
    { id: 'v2', portrait: 'portrait-su', district: 'tower', title: '苏纹递来的日程表背面有一行字',
      text: '苏纹把明天的日程折好递给你，背面有一行手写的字，写着十点四十分，二楼小会议室，不要带记录仪。她没提这行字，也没看你的眼睛。你注意到她指甲缝里有干掉的墨，像刚改过谁的排程。走廊的灯每隔八秒闪一次，闪到第三次时她侧身让你先走。',
      options: [
        { label: '按时去，不带记录仪',
          run: { intel: 4, track: { power: 1 }, grantCard: { n: 1, path: 'control', tier: 2 } },
          after: '小会议室里坐着苏纹和郁南枝，桌上只摆了三杯水。出门时苏纹递给你一张笼络类指令牌，说这是排程之外的空档，登记在她名下，别去系统里查。' },
        { label: '带记录仪，把过程全存下来',
          run: { intel: 2, chips: 1, track: { sin: 1 } },
          after: '录音存了四十分钟，回放时中段全是白噪音，只剩翻纸的声音。文件里多出一条不知道谁加的批注，写着「此处删去」，署名是一个你不认识的工号。' },
        { label: '不去，也不问这行字',
          run: { track: { loyalty: 1, renown: -1 } },
          after: '第二天你的日程整体后移两小时。苏纹照旧递来新表，背面干净，一个字也没有。你问起昨天那行字，她说昨天的表她没有留底，顺手把旧表收走了。' },
      ] },
    { id: 'v3', portrait: 'portrait-dai', district: 'tower', title: '合规部送来的附件多出来一页',
      text: '戴思远让你签收一份审查附件，一共十七页，目录只列了十六页。多出来的那页没有标题，是一张电梯停梯记录，时间正好是昨晚十点四十分。他站在旁边没有解释，也没有催你签。窗外正在下酸雨，玻璃上留着一道擦不掉的痕。他把笔帽拧上又拧开，说这一页可以不签，但要记在你名下。',
      options: [
        { label: '签收，但先翻到第十七页',
          run: { intel: 3, track: { sin: 1 } },
          after: '第十七页背面有手写批注，写着「此件不入档」。你把那页的纸角折了个记号，附件当晚就被系统标成已归档。第二天你再翻开，折角是平的，像被人熨过一遍。' },
        { label: '当场问这页从哪来',
          run: { track: { loyalty: 2, renown: 1 } },
          after: '戴思远说他也想找人问这个问题，然后让你先走。当天下午他被叫去了监事会，回来时手里没有那十七页，随身的记录册也换成了一本新的，封皮是空的。' },
        { label: '拒签，把附件整份退回',
          run: { intel: 1, track: { sin: -1, loyalty: -1 } },
          after: '三天后附件重新送达，页数变成了十六页，目录和内容终于对上。缺的那一页再没人提起，退件登记上的经办人也不是他的名字，日期戳却是当天的。' },
      ] },
    { id: 'v4', portrait: 'portrait-monitor', district: 'tower', title: '季度通报会上被空掉的一栏名次',
      text: '季度通报会念到第三名时停了半秒。投影上那一行是空白的，编号还在。台上的人翻过这一页，继续念第四名。散会时每个人手里都拿到一页补充说明，关于第三名一个字也没有，纸却比别的页厚。你把它对着灯看，背面有压痕，像一个被划掉又重新描过的编号，描的方向和你写字的手势一样。',
      options: [
        { label: '去问排行榜的算法',
          run: { intel: 3, chips: 1 },
          after: '算法组给了你一份参数表，权重那一栏被人改过，改动日期是上周五。签名栏只有一个已经离职的工号，尾数四位和你的一样。你把参数表抄了一份收好，第二天这一栏又改回了原值。' },
        { label: '主动申请把自己的名次往后挪',
          run: { track: { loyalty: 2, sin: 1 }, grantCard: { n: 1, path: 'capital', tier: 2 } },
          after: '调位申请当天通过。第二天你收到一张资本类指令牌，随附的纸条上只有「祝贺」两个字，苏纹说这是上头的意思，牌先记在你名下，出不出手由你。' },
        { label: '什么都不问，把补充说明收好',
          run: { intel: 1 },
          after: '你把那张纸夹进了没归档的那叠文件里。第二天这叠文件被人从头到尾翻过一次，压痕还在，顺序全变了，页码却一张没少，多出来的一页被人抽走了。' },
      ] },
    { id: 'v5', portrait: 'portrait-monitor', district: 'tower', title: '四十层连廊上的一张临时封条',
      text: '四十层的连廊被贴了封条，理由是设备检修，检修单上却没有工程编号。封条后面能听见有人在搬东西，金属擦着地面。保安站在楼梯口，只拦你一个人，说这条道今天不开放，语气像在背一段写好很久的话。他手里的登记板夹着一张白纸，上面已经写好了你的工号。',
      options: [
        { label: '绕到四十一层，从通风井往下看',
          run: { intel: 4, vitality: -1, track: { sin: 1 } },
          after: '你看到他们把一台机柜推向货梯，机柜侧面贴着一张标签，上面的编号是你的。保安第二天调离了这条道，登记板上那张白纸也不见了。' },
        { label: '出示权限，要求当场撕封条',
          run: { track: { power: 2, loyalty: -1 } },
          after: '封条撕开，里面已经空了，地上一层新打的蜡。第二天的交接记录上写着那位保安自愿调岗，检修单也补上了工程编号，申请人一栏是你的部门。' },
        { label: '退回去，把封条编号拍照存档',
          run: { intel: 2 },
          after: '照片存进私人空间，编号一共十一位。三天后这条封条的编号在系统里查不到，检修申请也一并消失，保安换成了一个没见过你的新面孔。' },
      ] },
    { id: 'v6', portrait: 'portrait-ghost', district: 'tower', title: '休息室里自己亮起来的那盏灯',
      text: '休息室的感应灯会自己亮，亮的位置总在同一把椅子上。清洁记录显示这把椅子每天被擦两次，比别的椅子多一次。今天早上你坐上那把椅子，桌面上有一圈没干的水痕，形状像一枚工牌，边缘比工牌圆一点。你翻开门禁日志，这一层昨晚的进出记录比平时干净。',
      options: [
        { label: '调取这一层的门禁日志',
          run: { intel: 4, track: { sin: 1 } },
          after: '日志里有个工号每天出现两次，查不到姓名和照片。你把那串数字抄在鞋盒内侧的纸上，三天后这串工号从日志里改成了一条设备记录。' },
        { label: '换个位置坐，不去动那摊水',
          run: { track: { sin: -1 }, vitality: 1 },
          after: '你换了位置，感应灯整晚没有亮。第二天那个工号的日志一起消失了，清洁记录还是每天两次。那把椅子的椅面一直没干过，你伸手摸过，是凉的，没有味道。' },
        { label: '按水痕的轮廓等一个人',
          run: { intel: 2, vitality: -1, grantCard: { n: 1 } },
          after: '十分钟后无面推门进来，把一张没人认领的指令牌放在桌上，说这局的登记人写的是你的编号，牌先放你这里，取不取随你。' },
      ] },
    { id: 'v7', portrait: 'portrait-yu', district: 'exchange', title: '收盘前九十秒多出来的一笔保证金',
      text: '收盘前九十秒，你的账户里多出一笔不属于你的保证金，金额不大，刚好够买下一个人的忠诚，也刚好够你被追责。清算行的回执打出来时纸还是热的。交易大厅的电子屏闪了两下，那一行的数字又跳了一次，跳完之后就没有再动。柜台那边有人在数收据，数到一半停下来看了你一眼。',
      options: [
        { label: '原路退回，附上回执编号',
          run: { track: { loyalty: 2, renown: 1 }, money: -15 },
          after: '退单第二天，另一个部门的账户被查。你那份回执编号在系统里留着，审查员看过一次，把编号抄走之后就没有再来找你，退单手续费扣了十五点，账上写着正常调账。' },
        { label: '用它做一笔短线，赚完就撤',
          run: { money: 60, track: { sin: 2 } },
          after: '赚了六十点信用点，第三天这笔流水被标了黄标。你把钱拆成七笔转出，每笔都踩在审核线下面。第七笔到账的当天下午，清算行给这批流水补了一个备注，写着来源已核实。' },
        { label: '不动，观察谁来认领',
          run: { intel: 3, chips: 1 },
          after: '第四天深夜有人用外网端口试图平掉这笔仓位，操作记录里留了一个你在简报会上见过的签名缩写。你把缩写和当天到会名单比了一遍，只有一个人对得上，那个人当天没有签到。' },
      ] },
    { id: 'v8', portrait: 'portrait-scientist', district: 'exchange', title: '一份签名栏空着的抵押单',
      text: '郁南枝让助理送来一份抵押单，标的写着「某实验室的设备残值」，签名栏空着，备注里只有一行，说这单不急，等你有空再签。抵押单的边角有咖啡渍，渍形的边缘整齐，像被人用尺子压着画过。助理把单子放下就走，没让你签收，也没留回执单的副本。',
      options: [
        { label: '签，先问清残值归谁',
          run: { money: 45, track: { sin: 1, loyalty: -1 } },
          after: '残值四十五点当天到账，归属一栏写的是研究所。三天后程砚在走廊遇见你，只看了一眼你袖口的墨迹，说这单的标的三个月前就已经报废过一次了。' },
        { label: '不签，把抵押单退回去',
          run: { track: { loyalty: 2, renown: 1 } },
          after: '退回的当天下午，这份抵押单出现在另一个部门的进度表里。郁南枝的助理再没上门，咖啡渍却印在了你桌垫上，形状和那张单子一对，位置也差点对上。' },
        { label: '签，但把标的改成设备清单里没有的那一项',
          run: { intel: 3, money: 15, grantCard: { n: 1, path: 'capital', tier: 2 } },
          after: '改标的的过程走了两个小时，郁南枝最后放行，并附了一张资本类指令牌。她说这单本来就该由你来结，残值算十五点，剩下的走她自己的额度。' },
      ] },
    { id: 'v9', portrait: 'portrait-dai', district: 'exchange', title: '慈善晚宴上最后一件被拍卖的标的',
      text: '晚宴拍卖的最后一件标的，是「一条不会被记录的下水道」，起拍价不高，加价幅度却被人临时改小。举牌的人里有董事会的人，也有下层来的人，两拨人坐得不远，却互相不看。台上那把木槌敲了三次才落下，槌头有一道旧裂痕，裂痕里嵌着一小片金漆。',
      options: [
        { label: '举牌，买下来还给下层',
          run: { money: -60, track: { renown: 3, loyalty: -1 } },
          after: '成交单上你的名字排在第二行，第一行是空号。第二天那条下水道口被人挂上了一块手写的牌子，写着一个巷子的名字。你付的六十点走的慈善科目，账面看起来合规。' },
        { label: '举牌，转手卖给出价更高的人',
          run: { money: 75, track: { sin: 2, renown: -1 } },
          after: '转手赚了七十五点，买家走的是侧门，没有登记姓名。一周后那条下水道被正式登记为集团资产，编号末尾加了一个字母，拍卖记录里那一行也改了措辞。' },
        { label: '不举牌，把整份拍卖名单拍下来',
          run: { intel: 3, chips: 1 },
          after: '名单上有一半的名字你查不到任职记录，另一半里有三位是研究所的在编。照片存在私人目录下，没有备份。晚宴结束后名单的原件被收走，收走的人没有当场清点页数。' },
      ] },
    { id: 'v10', portrait: 'portrait-ghost', district: 'exchange', title: '邻座交易员桌上那杯没动过的咖啡',
      text: '邻座的交易员今天没来，桌上那杯咖啡还是满的，杯壁上的水珠已经干了。系统里他的工位状态是「在岗」，下单记录停在前天下午三点，最后一笔是卖空自己的部门。保洁绕过了那张桌子，像有人交代过。他椅背上搭着一件外套，袖口别着工牌，工牌的照片被磨得看不清了。',
      options: [
        { label: '替他平掉那笔空单',
          run: { money: -30, track: { loyalty: 2, renown: 1 } },
          after: '平仓花了三十点，亏损记在部门公共账上。三天后那位交易员的工位状态改成了「外派」，咖啡杯被收走了，外套还挂在椅背上，谁也没有去动它。' },
        { label: '照他的记录跟着做一笔',
          run: { money: 50, track: { sin: 2 } },
          after: '你跟进的仓位两天后翻了一倍。结算时清算行多收了一笔解释不清的手续费，账单上写着你的部门编号。第三天你那张椅子旁的外套不见了，工位也被清空。' },
        { label: '把他的键鼠拆下来，翻一遍本地日志',
          run: { intel: 4, vitality: -1 },
          after: '本地日志里最后一条是导出操作，导出的对象是整层楼的门禁名单。文件落地在交易所的一台公用终端上，那台终端的摄像头正好坏了一整个下午。' },
      ] },
    { id: 'v11', portrait: 'portrait-su', district: 'exchange', title: '交易大厅电子屏上闪过的乱码',
      text: '下午两点整，大厅最大的那块电子屏闪出一行乱码，持续四秒，随后恢复成正常的报价流。四个人抬头看了一眼，又低下头。值班工程师说这是信号干扰。你在乱码里认出了自己的工号，数字顺序被打乱过，打乱的规律像按了某种排程。屏幕侧面贴着一张已经过期的检修标签，日期是上周三。',
      options: [
        { label: '找值班工程师要原始日志',
          run: { intel: 3, chips: 1 },
          after: '日志里那四秒被标成校验失败，来源端口指向研究所园区。你抄下端口号，工程师当天申请了换岗，换岗理由写的是身体不适，第二天他没有来上班。' },
        { label: '上报为设备故障，不深究',
          run: { track: { loyalty: 2 }, money: 15 },
          after: '故障报告批下来时附带了一笔十五点的绩效补贴。第二天那块屏换了一块新的，位置也挪了，挪到了大厅另一侧，看报价要转身，多走七步。' },
        { label: '把乱码抄下来，找苏纹对一遍排程',
          run: { intel: 2, track: { power: 1 }, grantCard: { n: 1, path: 'control', tier: 2 } },
          after: '苏纹看了一眼就明白，说这是排程系统在提示名字被移出名单。她给了你一张笼络类指令牌，说牌比名单管用，名单上的人她管不了，牌给谁她还能定。' },
      ] },
    { id: 'v12', portrait: 'portrait-yu', district: 'exchange', title: '清算行走廊里一个从没被叫到的号码',
      text: '清算行的叫号屏今天坏了一半，只显示单数。你拿到的是四十七号，前面的四十六号从上午九点坐到下午两点，一次也没被叫到。她手里那叠材料最上面一格是空的，只有装订线勒出的印子。保安换了三次岗，每次换岗都在看她。走廊尽头的饮水机空了，没人来换。',
      options: [
        { label: '把自己的号让给她，替她进去问',
          run: { track: { renown: 2, loyalty: -1 }, money: -20 },
          after: '柜台查不到她的登记记录，材料等于不存在。你垫了二十点帮她把手续补了一遍，回执上她写的是另一个姓氏。她把最上面那页抽走，剩下的留给了你。' },
        { label: '不动，只记下她的排队号码和材料规格',
          run: { intel: 3 },
          after: '你记下号码，两天后这串数字出现在一份内部涉密清单里。那位女士再没出现在清算行走廊，保安也从三班改成了两班，中午那一班撤掉了。' },
        { label: '找郁南枝的助理插一次队',
          run: { intel: 2, track: { power: 1 }, grantCard: { n: 1, path: 'capital', tier: 3 } },
          after: '助理直接把你带到三楼。出来时郁南枝让助理塞给你一张资本类指令牌，说插队这件事按集团规矩要付利息，牌就是利息，她还让你别把号给别人。' },
      ] },
    { id: 'v13', portrait: 'portrait-scientist', district: 'lab', title: '研究所三号门禁空掉的十一分钟',
      text: '三号门禁在凌晨出现十一分钟空档，监控显示这段时间没有人进出。但你能闻到一股不属于这里的消毒水味，比平时那种淡，带一点铁锈。走廊尽头的液氮管结了一层白霜，霜上有一枚很浅的鞋印，尺码比你的小。值班记录上这十一分钟被人用竖线划成了两段，划得很匀。',
      options: [
        { label: '进去看那十一分钟里有什么',
          run: { intel: 4, vitality: -2, track: { sin: 1 } },
          after: '里面一间小样本间的门虚掩着，架上空了一格，标签还挂在边上。你出来时霜已经化了，鞋印也没了，权限记录里只留下你进去四分钟，剩下七分钟写成了设备自检。' },
        { label: '把空档上报，换一次功劳',
          run: { track: { loyalty: 3, power: 1, sin: -1 } },
          after: '安保科当天封了三号门禁，加装一道闸机。文件上你的名字排在程砚前面，她看过后什么也没说，只在附件上补了一行字，写着当班值守人为彭戬。' },
        { label: '不动，只记下气味和值班表',
          run: { intel: 2, gear: 1, grantCard: { n: 1, path: 'expand', tier: 2 } },
          after: '值班表上那十一分钟的值守人是彭戬。三天后他在旧货梯口叫住你，塞给你一张扩张类指令牌，说这层楼该有人接手，牌他本来是要交上去的。' },
      ] },
    { id: 'v14', portrait: 'portrait-peng', district: 'lab', title: '伦理审查黑箱里的一枚编号',
      text: '黑箱里有一个编号，标注是「志愿者」。编号对应的名字你有印象，是三个月前在这条走廊和你点过头的人。档案柜的锁是新换的，钥匙孔边缘还有划痕。彭戬站在门口的阴影里，手一直插在兜里，说这一箱今天不归他管，钥匙在楼上。柜顶的灰上有一道抹痕，像被人伸手够过。',
      options: [
        { label: '打开完整档案',
          run: { intel: 5, track: { sin: 1, loyalty: -1 } },
          after: '档案里写着自愿终止，签字的手和别人不是同一支笔，压痕的方向也和人名对不上。你把编号抄下来，柜门关上时锁舌弹得比别的柜子响，走廊的灯同时闪了一下。' },
        { label: '把编号抄下来，交给监事会',
          run: { track: { loyalty: 3, renown: 1, sin: 1 } },
          after: '监事会收了材料，一周后回执写着程序合规。那个编号在系统里改成了已结项，签字人换成了戴思远，抄送名单里却有你的工号，此前你没在流程里出现过。' },
        { label: '装作没看见，转身离开',
          run: { intel: 1, track: { sin: -1 } },
          after: '你走到电梯口才发觉手心是湿的。第二天黑箱被人搬走了，柜子还在，锁孔里塞着一小团纸，纸上什么都没写。那位和你点过头的名字，此后再没出现在花名册上。' },
      ] },
    { id: 'v15', portrait: 'portrait-scientist', district: 'lab', title: '一只被退回又被转寄三次的样品',
      text: '一只编号被涂改过的样品被退回，退回原因一栏写着「收件人已不存在」。签收栏是空的，等着被填。样品箱上贴着三次转寄的标签，最上面那张是昨天才贴的，胶还没干透。程砚的工位空着，显示屏没关，屏保上是一行跑不完的编号，滚到某个位置会顿一下。',
      options: [
        { label: '替程砚签下这个名字',
          run: { gear: 2, track: { power: 2, sin: 2 } },
          after: '签完你去实验室还箱子，程砚在门后等着，只问你签的是谁的名字。她收下样品，把编号那一栏重新写了一遍，写完之后把原标签撕下来烧掉，灰留在瓷盘里。' },
        { label: '把样品直接销毁',
          run: { intel: 1, track: { sin: -1, renown: 1 } },
          after: '销毁流程走了两小时，炉温记录留了底。第二天退回单上多了一行系统备注，写着物品状态已更正。第三天研究所把你调出这个流程，交接人换成了新来的一个人。' },
        { label: '把样品送到监事会',
          run: { track: { loyalty: 3, sin: 1 }, grantCard: { n: 1, path: 'purge', tier: 2 } },
          after: '闻铎亲自过问这件事，让苏纹给你一张清洗类指令牌，说这条线该收尾了，别让它再转寄第四次。样品当天入库，入库单编号写在你的名下，收件人一栏空着。' },
      ] },
    { id: 'v16', portrait: 'portrait-peng', district: 'lab', title: '恒温箱里多出来的第七格',
      text: '恒温箱第七格本来空着，今天打开时里面放着一支标记为「已使用」的试剂管。管壁上有指纹，指纹的方向是从内往外擦的。巡检单上这一格连续三天都写着「无内容」，签的都是同一个缩写，笔画比其他人粗，写的时候笔尖压得很重。箱门内侧的密封条上沾了一小段纸纤维。',
      options: [
        { label: '把试剂管带走，做一次分析',
          run: { intel: 4, vitality: -1, track: { sin: 1 } },
          after: '分析结果显示成分为常规缓冲液，唯一异常的是批号属于三年前。你把结果锁进私人目录，管子在当晚熔掉了，熔样登记上写的名字不是你的，工号却对得上。' },
        { label: '照巡检单填「无内容」，关上箱门',
          run: { track: { loyalty: 2, sin: -1 }, vitality: 1 },
          after: '当天巡检单顺利通过复核。第二天第七格里放着的是一支空管，签缩写的人换了笔迹，写法更轻。你把两次巡检单都留了一份复印，编号正好接得上，中间没有断号。' },
        { label: '把这一格单独报给程砚',
          run: { intel: 2, track: { power: 1 }, grantCard: { n: 1, path: 'expand', tier: 2 } },
          after: '程砚看完没说话，只把恒温箱的权限转到你名下。当晚彭戬送来一张扩张类指令牌，说这格空位该换主人了，牌是他从安保科的例会上顺手带出来的。' },
      ] },
    { id: 'v17', portrait: 'portrait-dai', district: 'lab', title: '被同色墨水涂掉的一行实验记录',
      text: '交接记录上有一行被人用同色墨水涂掉，涂得很密，对着灯也看不出原来写的是什么。这一页的其他行都填得工工整整。值班员的签名还在，日期比前一行晚了两天。实验室的除湿机一直响，声音像有人隔着墙翻纸。你把纸端起斜看，涂痕的走向是自左向右，写字的人应该是左手。',
      options: [
        { label: '用显影剂把这一行还原',
          run: { intel: 5, track: { sin: 1, loyalty: -1 } },
          after: '还原出来的是一句关于样本销毁数量的记录，数字和你手上那份清单差了三。你把差异抄在一张便签上，第二天显影剂被列为非在册试剂，领用要两级签字。' },
        { label: '把这一页整张留底，不还原',
          run: { intel: 3, chips: 1 },
          after: '留底件扫描时多生成了一份缓存，落在实验室公用服务器上。三天后那份缓存被系统自动清理，清理日志里的操作人是一个已经注销的临时工号，痕迹留在你这份留底上。' },
        { label: '问值班员这两天发生了什么',
          run: { track: { loyalty: 1, renown: 1 }, intel: 1 },
          after: '值班员说他不记得自己签过这一页，但他的工号确实在。第二天他换了工牌挂绳，颜色和别人的不一样，值班表也改了，他的名字从夜班挪到了白班最后一个格。' },
      ] },
    { id: 'v18', portrait: 'portrait-peng', district: 'lab', title: '夜班表上被红笔圈起来的名字',
      text: '夜班表贴在更衣室门后，有七个名字被红笔圈过，其中一个是你。圈线画得很轻，像怕被人看到。表上这个人连续值了十一天夜班，中间没有休。更衣柜最下面一层的柜门半开着，里面挂着一件没取走的白大褂，口袋鼓着一小块，像塞了一张折过很多次的单子。',
      options: [
        { label: '接下这十一天的班，一口气值完',
          run: { intel: 3, vitality: -2, track: { power: 1 }, grantCard: { n: 1, path: 'purge', tier: 2 } },
          after: '第十一天清晨彭戬来交接，给你一张清洗类指令牌，说这个岗位本来该有两个人，另一个位子空了很久。交接记录上你只签了姓，名那一栏留给他补，他也没补。' },
        { label: '找安保科问圈线是谁画的',
          run: { intel: 2, track: { loyalty: 1 } },
          after: '安保科查不到落笔人，只说这张表是手抄的副本。原件那一份已经没有七个名字，只剩四个，剩下的三个位置留着红笔的印子，纸背也透出了同样的红。' },
        { label: '照常上班，不作任何调整',
          run: { track: { sin: -1 }, vitality: 1 },
          after: '你照常值了三天，红圈被擦掉了两个。第四天那把空柜子的门被人从里面锁上了，锁芯是新换的，钥匙没交到更衣室，也没人问起那件白大褂去了哪里。' },
      ] },
    { id: 'v19', portrait: 'portrait-fixer', district: 'slum', title: '下雨天里排队等着打开的一只排水阀',
      text: '雨落进来变成泥，队伍从街口排到巷尾，所有人都在等同一个排水阀被打开。阀门的钥匙在集团手里，开阀的申请单在你部门。前面那个抱着孩子的女人已经站了四十分钟，孩子的鞋底泡得发白。队伍里没有人说话，只有雨水敲铁皮的声音，一直没停过。',
      options: [
        { label: '批了这份申请，今天就把阀打开',
          run: { money: -25, track: { renown: 3, loyalty: -2 } },
          after: '阀开了两个小时，水退了半条街，巷口的人陆续散掉。审批单上你用的是代签，费用走的部门杂项，扣了二十五点。第二天部门质询会上没人提这件事，那位女人也没再来道谢。' },
        { label: '把申请转给灰市，让他们去开',
          run: { money: 35, track: { sin: 1, renown: 1 } },
          after: '老鸦的人当天下午就把阀拧开了，收了你三十五点。巷口多了一块手写的牌子，写着下次找谁。你部门的申请单在系统里一直挂着，第三天自动作废，理由栏没人填。' },
        { label: '不批，把申请压到期限结束',
          run: { track: { loyalty: 2, renown: -2, sin: 1 } },
          after: '申请在系统里挂了七天自动作废。第八天那条巷子的排水口被居民自己砸了个洞，修单落在你的部门，维修预算比那份申请贵三倍，审批人还是你。' },
      ] },
    { id: 'v20', portrait: 'portrait-lu', district: 'slum', title: '无证诊所柜台上并排放着的两份账单',
      text: '陆晚给你包完伤口，把两份账单并排放着。一份是你该付的，另一份的付款人写着「穹顶集团，代付」。听诊器挂在椅背上，管子上缠着胶布。里屋有病人在咳，声音很轻，像刻意压着。她把笔放在两份账单中间，没有推给任何一边，自己转身去收药盘。',
      options: [
        { label: '付自己那份，把另一份撕掉',
          run: { money: -20, track: { renown: 2, sin: -1 } },
          after: '陆晚把撕掉的纸收进抽屉，说代付的那份她每个月都要撕一次。里屋的咳声在你出门时停了。你花了二十点，回执上写的项目是常规诊疗，编号是空的。' },
        { label: '签下集团代付的那份',
          run: { track: { sin: 1, loyalty: 1 }, money: 15 },
          after: '签完账上多了十五点补贴。陆晚看着你签名，没说什么，只是把听诊器换了个方向挂。第二天她门口多了一张集团统一发放的价目表，上面有三种药被划掉了。' },
        { label: '两份都付，问她代付是给谁用的',
          run: { money: -40, intel: 3, track: { renown: 1 }, grantCard: { n: 1, path: 'control', tier: 2 } },
          after: '陆晚给了你一张写满编号的处方单，说这是她攒的人情。她把一张笼络类指令牌压在账单底下，说牌比钱好使，找她看病的人里有一半是拿着这种牌来的。' },
      ] },
    { id: 'v21', portrait: 'portrait-tie', district: 'slum', title: '整栋楼一夜之间换掉的电表',
      text: '整栋楼的电表昨天全被换过一遍，新表走得比旧表快。换表的人没留工单，只在中庭贴了一张手写的通知，说系统升级。住户围在通知下面看，谁也不说话。楼梯口那盏灯还是坏的，第二天也没人来修。中庭地上的包装带没收拾，印着一家已经注销的厂名。',
      options: [
        { label: '查这批电表的采购来源',
          run: { intel: 4, track: { sin: 1 } },
          after: '采购单走的是一家注销过的供应商，收货人栏写的是你的部门。你把单号记下，第二天通知被人撕了，包装带也扫干净了，只有电表还在走，走得比前一天还快。' },
        { label: '把新表读数上报，要求重新核算',
          run: { track: { loyalty: 2, renown: 1 } },
          after: '核算组回了误差在允许范围。电费照收，但这一栋的读数在系统里被单独标了颜色。你拿到了核算组长的工号，他三天后调去了另一条线，回你邮件的人换了名字。' },
        { label: '私下找铁贵，让他组织人把旧表装回去',
          run: { track: { power: 2, sin: 1 }, money: -20 },
          after: '铁贵当晚带人装回了十一块旧表，收了你二十点的人工。三天后他没有出现，工位上的水杯还在。旧表在第二个星期又被换掉，这次换表的人带了保安。' },
      ] },
    { id: 'v22', portrait: 'portrait-fixer', district: 'slum', title: '灰市摊位上压着的一张手抄名单',
      text: '老鸦的摊位上摆着自己抄的名单，抄在旧报纸背面，字很小。名单上的人都在这一周消失，名字旁边写着日期和一个数字。他用一块压板压着那张纸，风一吹就压一下，动作熟练得像做过很多次。摊位后面堆着没拆的货箱，箱角有用刀划过的记号，一共七道。',
      options: [
        { label: '出钱把名单买下来',
          run: { money: -45, intel: 3, track: { renown: 1 } },
          after: '名单到手后你核了三个名字，都查得到记录，只是状态改成了外派。老鸦收钱时没抬眼，把压板也一起给了你。第二天他的摊位空了半天，货箱的划痕从七道变成了八道。' },
        { label: '要求老鸦别再抄这份名单',
          run: { track: { loyalty: 1, sin: -1 } },
          after: '老鸦把报纸折起来收进怀里，说这一份本来就只抄给自己看。第二天摊位换了位置，人和货都不见了半天，回来时报纸背面是白的，压板换了一块新的。' },
        { label: '照名单上的顺序留言给上面',
          run: { intel: 2, track: { power: 1 }, grantCard: { n: 1, path: 'purge', tier: 2 } },
          after: '你的留言当天就有人回。回信的附袋里装着一张清洗类指令牌，附言只有四个字，写着清完为止。你按顺序核了一遍名单，最后一行留的是你的名字，日期还没填。' },
      ] },
    { id: 'v23', portrait: 'portrait-tie', district: 'slum', title: '装卸工会门口并排放着的三把空椅子',
      text: '工会门口摆着三把空椅子，椅面上放着名字和工号，人却不在。铁贵说是请假，请假条是他自己写的。椅子旁边的地砖被人重新铺过，颜色比别处新。他说话时一只手一直在盘那串钥匙，盘到第三圈时金属碰出一声轻响，他停了一下，又接着盘。',
      options: [
        { label: '要三份请假条的复印件',
          run: { intel: 3, chips: 1 },
          after: '三份条子的日期是同一天，笔迹不一样但压痕一致，像照着一张描的。铁贵给了你复印件，原件当天烧了，烧完的纸灰倒进了门口那只装水的桶里，桶面浮着几片没化开的黑边。' },
        { label: '替那三个人把工位调回原来位置',
          run: { track: { renown: 2, loyalty: -1 }, money: -25 },
          after: '调位花了二十五点走关系。三个人当中有两个回来了，第三个的名字从名册上消失了。回来的两个人不怎么说话，其中一个把椅子从门口搬进了里屋，之后再没搬出来。' },
        { label: '什么也不做，把椅子的位置记下来',
          run: { intel: 1, track: { sin: -1 } },
          after: '第二天椅子还在，名字被人擦掉了一半。地砖上的新色差也淡了，像被人重新压过。铁贵把钥匙收进了兜里，见到你时先开口说了别的，那三把椅子此后再没有放过名字。' },
      ] },
    { id: 'v24', portrait: 'portrait-lu', district: 'slum', title: '巷口突然挂上牌子的那间诊室',
      text: '巷口那间临街的铺面昨天挂上了诊所的牌子，执照号是真的，法人是陆晚。铺面原本是仓库，门口堆着没搬走的木箱。今天早上有一个穿灰雨衣的男人在门口站了半小时，没进门，也没走。雨衣的下摆沾着泥，泥的颜色和这条巷子里的不一样，比这里的深。',
      options: [
        { label: '进去问陆晚这是谁开的',
          run: { intel: 3, track: { sin: 1 } },
          after: '陆晚说执照是别人替她办的，她只在上面签了名。雨衣男人当天下午又来了，手里多了一个没封口的纸袋。她收下了纸袋，把牌子摘下来擦了擦，又挂回去，位置往左挪了一寸。' },
        { label: '替她把牌子摘下来，暂缓开业',
          run: { track: { renown: 2, loyalty: -1 } },
          after: '牌子摘下来放到铺面里，第二天又被挂回去了。这次门框上多了一道新刷的漆，颜色和原来不太一样。门口的木箱少了两只，箱子底下的地面扫得很干净，连脚印都没有。' },
        { label: '守在对面，等那男人离开再跟一段',
          run: { intel: 4, vitality: -1 },
          after: '男人最后进了集团侧门，刷卡进去的，卡面没有照片。你记下时间，回程时发现那间铺面门口的木箱已经搬空，地上留着一圈箱底的印子，比箱子本身小一号。' },
      ] },
    { id: 'v25', portrait: 'portrait-tie', district: 'docks', title: '三号泊位底下压着的一张手写货单',
      text: '铁贵让工会的人封了三号泊位两小时，理由是机械检修。检修单是手写的，笔迹和上周那份一模一样。压在最下面那张货单上有一个你熟悉的收货章，日期比检修申请还要早一天。潮水味顺着通风口一路飘到办公室，码头上没有人卸货，吊机停着不动，钩子悬在半空里晃。',
      options: [
        { label: '掀开货单看完整的收货记录',
          run: { intel: 4, track: { sin: 1 } },
          after: '收货方是研究所园区，货名写的是废弃耗材。你抄下批号，两小时后泊位解封，那张货单不见了。铁贵说他自己也没见过这单子，检修单也跟着换成了新的一张，编号是连着的。' },
        { label: '照单放行，什么也不过问',
          run: { money: 40, track: { loyalty: 1, sin: 1 } },
          after: '放行当天账上多了四十点。铁贵之后再没提这件事，只是在食堂见到你时把烟换到了另一只手。第三天那批货的收货记录被系统标成已结项，经办人一栏填的是你的部门。' },
        { label: '把检修单的漏洞报上去',
          run: { track: { loyalty: 3, renown: 1, power: 1 }, grantCard: { n: 1, path: 'expand', tier: 2 } },
          after: '安保科奖励了你的举报，附袋里放着一张扩张类指令牌。铁贵被谈话一次，回来后把三号泊位的钥匙换了一把，新钥匙他谁也没给，挂钩上空了两天。' },
      ] },
    { id: 'v26', portrait: 'portrait-wen', district: 'docks', title: '引航票价表上一个临时的空档',
      text: '温仕成在码头边的茶摊上给你看了一页价目表，明天凌晨两点到四点会有一个空档，系统价格会掉到平时的三成。他说这个空档不是他做的，是排程里本来就有的。茶杯边上有一圈盐渍，海风一直往这边吹，价目表的纸角被风掀起来，他用手一直压着没让它翻过去。',
      options: [
        { label: '吃下这个空档，转手卖出去',
          run: { money: 65, track: { sin: 2 } },
          after: '空档里你转了三笔引航额度，赚了六十五点。第二天这个时段被人从系统里删掉了，只剩一条改单记录，改单人的工号是空的，操作时间卡在系统维护那一分钟里。' },
        { label: '把空档报给合规部',
          run: { track: { loyalty: 2, renown: 1 }, money: 15 },
          after: '合规部以系统故障处置，奖了你十五点。温仕成再没请你喝茶，价目表也换了新的版本，新表上的时段被人用尺子重新划过，凌晨两点到四点那一栏整段涂掉了。' },
        { label: '不要空档，只要他手上那张指令额度',
          run: { intel: 2, track: { power: 1 }, grantCard: { n: 1, path: 'capital', tier: 2 } },
          after: '温仕成掏出一张资本类指令牌，说他名下最后一张额度就是这个。他说完把茶钱一起结了，走的时候把那张价目表撕了，撕完的纸片都塞进了茶摊的火炉里。' },
      ] },
    { id: 'v27', portrait: 'portrait-enforcer', district: 'docks', title: '冷库门口新挂上去的第二把锁',
      text: '工业港区的冷库门口多了一把新锁，旧的还挂在旁边，没摘。值班员说这是安保科加的，理由是上周少了两箱货。但你查到那两箱货的签收人就在港区当班，今天还在，工牌挂得好好的。冷库门缝里往外冒白气，在门槛上结了一层薄冰，值班员一直站在冰没有化的那一侧。',
      options: [
        { label: '找值班员要上周的点货记录',
          run: { intel: 3, chips: 1 },
          after: '点货记录上少的两箱货被改成了破损报废，签字人是安保科的临时代签。你把这份记录单独留了底，第二天点货记录换了新本子，旧本子上的页数比装订线少了两页。' },
        { label: '当面找那位签收人对质',
          run: { track: { power: 2, renown: 1 }, vitality: -1 },
          after: '对方承认货没少，是先把货挪到了三号库。你要求写书面说明，字据当晚落在了你的抽屉里，写字的纸是冷库的出入单背面，背面还有没擦净的油印。' },
        { label: '什么都不查，把新锁的编号记下',
          run: { intel: 2 },
          after: '锁的编号在系统里查不到备案。三天后这把锁换了位置，挂到了另一扇门上，旧锁也被摘走了一只。值班员的工牌换成了新的，照片上他比现在胖一点，应该是早年拍的。' },
      ] },
    { id: 'v28', portrait: 'portrait-fixer', district: 'docks', title: '两个集装箱之间夹着的一只纸箱',
      text: '两个集装箱之间夹着一只纸箱，箱角被雨水泡软了一半，胶带是新的。箱子上没有运单，只写了一个编号，和灰市那边用的一种编号格式很像。夜班的灯只照亮一半场区，另一半一直黑着，没有人往那边走。吊机今天没开，轨道上落着一层细灰，灰上没有脚印。',
      options: [
        { label: '拆开箱子看一眼',
          run: { intel: 4, gear: 1, track: { sin: 1 } },
          after: '箱子里是成套的队服，胸口的标识被拆掉了，线头还是新的。你取走一件当证物，剩下的原样封回去。第二天箱子还在原处，封胶带的方向换了，从横着贴变成了斜着贴。' },
        { label: '把箱子搬到值班室登记',
          run: { track: { loyalty: 2, renown: 1 } },
          after: '值班室登记为无主货物，放在货架第二层。三天后编号被人认领，认领人一栏填的是集团的一个内部部门，签收人只写了一个姓，签名很潦草，看不出是什么字。' },
        { label: '把编号传给老鸦，问他认不认',
          run: { intel: 2, money: 25, grantCard: { n: 1, path: 'purge', tier: 2 } },
          after: '老鸦一眼就认出来了，付了你二十五点情报钱，还塞给你一张清洗类指令牌，说这批货不是他的，但有人要清。你回头去看，那只纸箱已经不在了，场区的地面也扫过。' },
      ] },
    { id: 'v29', portrait: 'portrait-tie', district: 'docks', title: '装卸工会门口摆出来的临时入会表',
      text: '工会门口摆着一张临时入会表，要求填姓名、工号、部门担保人。担保人一栏预填的是你的名字，墨迹比表上其他地方新。铁贵在里屋打电话，声音压得很低。表上已经有十七个签名，最后三个的日期是今天。表格用一颗钉子钉在门板上，钉帽是新的，门板上还留着旧钉孔。',
      options: [
        { label: '把自己的名字划掉，重新填一份担保人',
          run: { track: { loyalty: 2, renown: 1, sin: -1 } },
          after: '新表当天贴出去，签名的少了四个。铁贵出来看了一眼，什么也没问，把旧表收进了柜子。晚上你路过工会，门板上那颗新钉帽已经被取走了，只剩一个圆形的印。' },
        { label: '认下担保，把十七个人收进名下',
          run: { track: { power: 3, loyalty: -2, sin: 1 } },
          after: '十七个人归你调度，第二天工会台账上你的名字被单独列了一行。铁贵电话里的那个人再没打过来，铁贵自己倒是在食堂排了一次队，站在你后面，没打招呼。' },
        { label: '把这张表拍下来，交给人事部核对',
          run: { intel: 3, track: { loyalty: 1 } },
          after: '人事部查出三个工号不存在。表格被回收重制，担保人那一栏改成了部门集体。铁贵被叫去问了一次话，回来时手上那串钥匙少了两把，他没提去哪了。' },
      ] },
    { id: 'v30', portrait: 'portrait-enforcer', district: 'docks', title: '凌晨被叫停的一次卸货作业',
      text: '凌晨的卸货到一半被叫停，理由写的是区域调压，但港区的气压表没有任何波动。吊机停在半空，货悬在离地三米的地方晃。值班主管拿着对讲机站了很久，一句话也没说出去，直到远处一列黑车开进来。车厢的窗全是黑的，没有牌照，进场的速度比园区里任何一辆车都快。',
      options: [
        { label: '上前要求出示叫停依据',
          run: { track: { power: 2, loyalty: -1 }, intel: 2 },
          after: '依据文件是现场打印的，编号跳号。主管当众道歉，那条货最后被吊回了船上，去向不明。你把跳号的数字记下，第二天的值班表上，这位主管的名字换到了别的时间段。' },
        { label: '退到库房后面，把整个过程录下来',
          run: { intel: 4, vitality: -1, track: { sin: 1 } },
          after: '录像里黑车没有牌照，下来的人进的是港区最深的那间办公室，门开的时候里面有灯光漏出来。你留了备份，原件当天删了。录像里报时的钟比你的表慢三分钟，一直是这个差。' },
        { label: '按流程补一张区域调压的记录',
          run: { track: { loyalty: 3, sin: 1 }, money: 20 },
          after: '记录补齐后账面上多出二十点加班补贴。主管第二天调去了别的班次，对讲机留在桌上，电池还是满的。气压表的记录纸也换了新的一卷，旧卷的末段被剪掉了。' },
      ] },
    { id: 'v31', portrait: 'portrait-wen', district: 'orbit', title: '过境申报单上多出的一个章',
      text: '轨道港的过境申报单上多出一个章，章的样式和集团常用的不一样，边线更细。同一天有三份申报都盖了这个章，出发地一栏写着穹顶外。窗口里的人把单子翻过去又翻回来，最后让你先在等候区坐一会儿。挂钟的秒针卡了两下。',
      options: [
        { label: '坐着等，什么都不问',
          run: { intel: 3, track: { sin: 1 } },
          after: '四十分钟后有人把单子送回来，章已经被压平。申报通过，但那三份记录的出发地被改成了无人区。' },
        { label: '把章的形状描在便签上',
          run: { intel: 2, chips: 1 },
          after: '便签收进内袋。晚上你对比了自己的空白指令，发现边缘纹路有一部分对得上。' },
        { label: '直接要求见盖章的人',
          run: { track: { power: 2, loyalty: -1 }, grantCard: { n: 1, path: 'capital', tier: 3 } },
          after: '出来的是温仕成。他说这三份本来就是你名下的空额，走完就给你一张资本类指令牌，界别比别人的高一档。' },
      ] },
    { id: 'v32', portrait: 'portrait-yuke', district: 'orbit', title: '候船厅里的一件湿雨衣',
      text: '候船厅的椅子上搭着一件还在滴水的雨衣，水滴落在地砖上，聚成一小片。厅里没有下雨，外面也没有下雨。雨衣的口袋翻出来一半，里面是一张对折的纸。广播每隔十分钟报一次同样的班次号，那个班次今天没有到港。',
      options: [
        { label: '把雨衣交给失物处，纸不看',
          run: { track: { loyalty: 2, renown: 1 } },
          after: '失物处登记为无主物品，编号排在当天第七件。三天后雨衣被领走了，领取人签名一栏只画了一道横。' },
        { label: '取出那张纸，看上面写了什么',
          run: { intel: 4, track: { sin: 1 } },
          after: '纸上是一串坐标和一小时的时间。你核对了当天的班次表，那个时间里没有任何船只停靠。' },
        { label: '守着雨衣等它的主人',
          run: { intel: 2, vitality: -1, grantCard: { n: 1, path: 'purge', tier: 2 } },
          after: '两小时后雨客进来取雨衣，看了你一眼，把一张清洗类指令牌压在座椅上。她说这张牌一直找不到合适的持有者。' },
      ] },
    { id: 'v33', portrait: 'portrait-enforcer', district: 'orbit', title: '登船口被退回的一件行李',
      text: '登船口的检查台上放着一件被退回的行李，锁扣完好，标签上是集团内部编号。检查员说这件行李的申报重量和实际不符，差了三公斤。行李的主人已经上船了，船还没走，停在那里，引擎一直没关。',
      options: [
        { label: '当场开箱验看',
          run: { intel: 4, gear: 1, track: { sin: 1 } },
          after: '箱内是三层叠好的资料盒，最下面一层压着一枚旧工牌。检查员在旁记录时手抖了一下，多写了一个零。' },
        { label: '照实重报重量，让行李随船走',
          run: { track: { loyalty: 2 }, money: 20 },
          after: '改单费二十点，行李被送上船。船开走十分钟后，那件行李的名称在系统里被改成了普通耗材。' },
        { label: '扣下行李，通知安保科来取',
          run: { track: { loyalty: 3, power: 1 }, grantCard: { n: 1, path: 'expand', tier: 2 } },
          after: '安保科当晚取走行李，奖励里附了一张扩张类指令牌。行李的主人没有下船，船照常离港。' },
      ] },
    { id: 'v34', portrait: 'portrait-sal', district: 'orbit', title: '停机坪边的一排空油桶',
      text: '停机坪边上一排油桶，编号连号，缺了中间三个。缺号的位置地面积着一层新灰，没有人扫。萨尔蹲在旁边翻一只桶盖，看到你之后把桶盖盖了回去，动作不快也不慢。远处的塔台灯在转，光扫过来时她的脸是白的。',
      options: [
        { label: '问她那三个桶去哪了',
          run: { intel: 3, track: { sin: 1 } },
          after: '萨尔说桶是空的，被人提前拖走了，拖走时地面留了辙。你沿着辙找到一堆被烧过的编号牌。' },
        { label: '帮她一起把桶盖全部复位',
          run: { track: { renown: 2, loyalty: -1 }, vitality: -1 },
          after: '十二只桶盖全部盖好。第二天这排桶被整体拖走，编号顺序重排，缺号的事没人再提。' },
        { label: '把缺号记下来，报给港区管理',
          run: { track: { loyalty: 2, renown: 1 } },
          after: '港区管理回复说这批桶已经报废。你在报废单上看到签收人，是上周刚被外派的一个工号。' },
      ] },
    { id: 'v35', portrait: 'portrait-wen', district: 'orbit', title: '一张提前售出的引航票',
      text: '系统里有一张引航票在出发前七十二小时就被售出，购票人一栏空着。售票窗口的日志显示这张票是用工号购买的，不是名字。今天登船名单上没有对应的乘客，票也没有退。售票员一直在擦那块有机玻璃。',
      options: [
        { label: '按票号追查购票工号',
          run: { intel: 4, chips: 1, track: { sin: 1 } },
          after: '工号属于研究所的一个已注销编制。你查到最后一次使用记录，时间在三个月前，地点是三号门禁。' },
        { label: '把这张票作废，登记为空票',
          run: { track: { loyalty: 2 }, renown: -1 },
          after: '作废申请当天通过。晚上售票员的工位换了人，玻璃也换了一块新的。' },
        { label: '自己买下这张票，保留登船权',
          run: { money: -50, intel: 2, grantCard: { n: 1, path: 'capital', tier: 2 } },
          after: '花五十点接手后，票面自动换成你的名字。温仕成随后送来一张资本类指令牌，说有了票， boarded 的事才好谈。' },
      ] },
    { id: 'v36', portrait: 'portrait-enforcer', district: 'orbit', title: '塔台里换掉的一个频率',
      text: '塔台的通讯记录里，昨晚有一段频率被换成了备用频道，持续十九分钟。值班记录上写着设备自检，但自检的表格没有填。塔台玻璃上有一块地方被擦得特别亮，比别处干净，像有人贴着玻璃往外看了很久。',
      options: [
        { label: '调出那十九分钟的录音',
          run: { intel: 5, track: { sin: 1, loyalty: -1 } },
          after: '录音里只有一段报数，数字和你手上指令卡的编号格式一致。播到第十四个数时录音断了。' },
        { label: '把值班记录补完整，按自检结案',
          run: { track: { loyalty: 2, sin: 1 }, money: 15 },
          after: '补录后结案，账上多了十五点夜班费。塔台当班的人第二天升了一级，见到你时点了下头。' },
        { label: '查这十九分钟里穹顶外的天气',
          run: { intel: 3, gear: 1 },
          after: '那段时间穹顶外晴，气象记录上却标着酸雨。你顺手取了一件野外装备，编号也是空的。' },
      ] },
    { id: 'v37', portrait: 'portrait-ring', district: 'ring', title: '第七段的巡检签字',
      text: '环带第七段的巡检记录上，签名栏是空的，日期却已经填好。荀戒把笔递给你，说这一段的灯坏了三盏，写不写都一样。通道壁上凝着一层水汽，顺着焊缝往下爬，在脚边汇成一小汪。风机转得比平时慢。',
      options: [
        { label: '签，但先在壁面上做一处标记',
          run: { intel: 3, chips: 1 },
          after: '你在一处焊缝上划了道浅痕。三天后那段壁面被重新喷漆，痕和焊线一起消失了。' },
        { label: '不签，要求先把灯修好',
          run: { track: { loyalty: 2, renown: 1 }, vitality: -1 },
          after: '灯在第五天修好，换下来的灯泡里有一只是新的。荀戒把签字栏划掉，重新抄了一份。' },
        { label: '签，并顺手把这一段划进自己的巡查区',
          run: { intel: 2, track: { power: 1 }, grantCard: { n: 1, path: 'expand', tier: 2 } },
          after: '巡查区变更当天生效。荀戒把一段旧钥匙交给你，另附一张扩张类指令牌，说这一段迟早要有人真管。' },
      ] },
    { id: 'v38', portrait: 'portrait-enforcer', district: 'ring', title: '结冰的管道旁的一双鞋',
      text: '环带维修层的管道结了冰，冰层里冻着一双工装鞋，鞋带还系着。值班的人说这段管线已经停用两年，没人来。管道保温层的作业单贴在墙上，最新一张的日期是昨天，签名是空的。',
      options: [
        { label: '把冰敲开，把鞋取出来',
          run: { intel: 4, vitality: -1, track: { sin: 1 } },
          after: '鞋里塞着一卷纸，展开是一份手写清单，记着十二个编号。冰化得很快，走廊里一整天都是水。' },
        { label: '把作业单拍照，报给安保科',
          run: { track: { loyalty: 3, renown: 1 } },
          after: '安保科当天封了这条支线，冰被整体切除运走。你在封条编号上看到了自己的部门代码。' },
        { label: '照作业单把这段管线重新标为在用',
          run: { intel: 2, money: 25, grantCard: { n: 1, path: 'control', tier: 2 } },
          after: '重标流程走完，账上多了一笔二十五点的维护费。荀戒给了你一张笼络类指令牌，说这条线归你管，人也就归你管。' },
      ] },
    { id: 'v39', portrait: 'portrait-ring', district: 'ring', title: '环带深处的第九个检修口',
      text: '环带共有十个检修口，第九个今天被焊死了，焊口还没有完全冷却。焊工说这是临时处置，怕有人从外面进。可这个检修口朝内，外面进不来。焊条头丢在地上，一共三根，长短都差不多。',
      options: [
        { label: '找焊工要作业指令号',
          run: { intel: 3, chips: 1 },
          after: '指令号是真的，申请人是安保科，理由栏写着防渗。你把号码抄下，第二天这条申请从系统里消失。' },
        { label: '把焊口切开一条缝',
          run: { intel: 4, gear: 1, vitality: -1, track: { sin: 1 } },
          after: '缝里吹出来的风是温的，带着一点消毒水味。你取了一件随身装备，焊口当晚又被补上，补得更厚。' },
        { label: '向上申请把这一段整体停用',
          run: { track: { loyalty: 2, power: 1 }, money: -15 },
          after: '停用申请批下来，花十五点做了一次安全评估。评估人当天没进现场，报告写了四页。' },
      ] },
    { id: 'v40', portrait: 'portrait-ghost', district: 'ring', title: '值班室里的两台收音机',
      text: '环带值班室桌上摆着两台收音机，一台开着，另一台没插电也在响。荀戒说他只听得见开的那台。第二台的声音很小，像隔着几层布，播的不是任何频道。窗外的环带外壁一直在响，是风压。',
      options: [
        { label: '把那台没插电的拆开看',
          run: { intel: 4, gear: 1, track: { sin: 1 } },
          after: '机壳里除了正常的电路，多了一块不属于这个型号的板子，编号被砂纸磨过。你把它收进口袋。' },
        { label: '把它关掉，用布盖起来',
          run: { track: { sin: -1, loyalty: 1 }, vitality: 1 },
          after: '盖布之后值班室里静了很多。第二天这台机器被搬走，原来的位置落了一层圆形的灰印。' },
        { label: '坐下来，听完整段广播',
          run: { intel: 3, vitality: -1, grantCard: { n: 1, path: 'purge', tier: 2 } },
          after: '广播里念了七个工号，最后一个是你。念完之后荀戒递来一张清洗类指令牌，说他也不知道这牌是从哪台机器里掉出来的。' },
      ] },
    { id: 'v41', portrait: 'portrait-enforcer', district: 'ring', title: '被拆走的三个螺栓',
      text: '环带一段护栏上有三个螺栓被拆走，孔里塞着纸，防止锈。检修单上这段护栏的状态是完好。荀戒说他上个月巡过这一段，那时候螺栓还在。护栏外侧就是几十米落差的井，风从下往上灌。',
      options: [
        { label: '把纸取出来看',
          run: { intel: 3, track: { sin: 1 } },
          after: '纸上写着一串数字和两个字，字迹是新的。你把纸留下，当天护栏被整体换掉。' },
        { label: '自己用备件把螺栓补上',
          run: { vitality: -1, track: { renown: 2, loyalty: -1 } },
          after: '补好之后你在护栏上拍了照。第二个月安全检查通了，检验员看的是你的照片，不是现场。' },
        { label: '按检修单结案，不补',
          run: { track: { loyalty: 2, sin: -1 }, money: 15 },
          after: '结案后这段护栏被标为「待更换」，进了下一年度的预算。你因此拿到一笔十五点的绩效。' },
      ] },
    { id: 'v42', portrait: 'portrait-ring', district: 'ring', title: '环带外的敲击声',
      text: '今天凌晨，环带外壁被人从外面敲了七下，间隔很均匀。值班的人记录了时间，没有记录别的。壁面的震动传感数据是有的，但系统把它标成了风压扰动。荀戒站在壁边听了一会儿，没有说话。',
      options: [
        { label: '申请一次外壁巡检',
          run: { intel: 4, track: { power: 1 }, money: -20, vitality: -1 },
          after: '巡检花了二十点和一整夜。外壁上有一处新擦痕，位置在检修口旁边，长度和你手掌差不多。' },
        { label: '按风压扰动结案，不动',
          run: { track: { loyalty: 2, sin: 1 } },
          after: '记录按扰动归档。第二天那条传感曲线被系统重算了一遍，峰值低了一半。' },
        { label: '照着七下的间隔回敲，等人回应',
          run: { intel: 3, track: { sin: 1 }, grantCard: { n: 1 } },
          after: '外面没有回敲，但第二天值班室门缝里塞进一张空白指令牌，没有登记人，编号却是有效的。' },
      ] },
    { id: 'v43', portrait: 'portrait-mem', district: 'memory', title: '柜台前的一笔逾期记忆',
      text: '无面把一份逾期未取的记忆放在柜台上，寄存人是三年前的一个工号，最后一次刷卡记录也是三年前。存单背面写着一句提示，说若逾期，交由任意一位在职中层处置。柜台的玻璃隔断上有一道裂纹，用透明胶贴着。',
      options: [
        { label: '取出这段记忆，自己用',
          run: { intel: 5, track: { sin: 2, loyalty: -1 } },
          after: '记忆里是一间会议室的完整录音，讲话的人里有三个你认得。取完之后你连做了两晚同一个梦。' },
        { label: '照流程销毁，填一份处置单',
          run: { track: { loyalty: 3, sin: -1 }, money: 15 },
          after: '处置单签完，柜员给了你十五点的流程补贴。存单被剪角归档，编号当天从索引里删除。' },
        { label: '把存单转给寄存人的家属，附一份说明',
          run: { track: { renown: 3, loyalty: -2 } },
          after: '家属来取的时候带了一张旧的工牌照片。她说那个人三年前被转去了外派，此后没有回过家。' },
      ] },
    { id: 'v44', portrait: 'portrait-ghost', district: 'memory', title: '同一段记忆的两次寄存',
      text: '系统里查到同一段记忆被寄存过两次，间隔半年，寄存人不同，编码完全一致。第二次的寄存人今天还在柜台边站着，等着取东西。她把寄存凭条折成很小的方块，握在手心里，一直没松开。',
      options: [
        { label: '把两次寄存的记录都调出来',
          run: { intel: 4, chips: 1, track: { sin: 1 } },
          after: '两份记录的内容一致，但第一次那份的备注栏多了一行，写着「请勿归还本人」。你把两页都留了底。' },
        { label: '先让她把东西取走，事后再查',
          run: { track: { renown: 2, loyalty: -1 } },
          after: '她取出东西后走得很快，没有回头。当天晚上那份第一次的寄存记录被人手动改成了「已合并」。' },
        { label: '当场告知她这段记忆有第二份',
          run: { intel: 3, track: { renown: 1, sin: 1 }, grantCard: { n: 1, path: 'control', tier: 2 } },
          after: '她愣住了，随后把手上那张凭条给了你。凭条背面写着你的工号，另附一张笼络类指令牌，说是早准备好的。' },
      ] },
    { id: 'v45', portrait: 'portrait-mem', district: 'memory', title: '被划掉的一行索引',
      text: '记忆索引里有一行被划掉，红线画得很直，用的不是索引笔。这一行对应的编号在系统里仍然有效，只是查不到内容。柜员说这种情况每个月都有两三笔，一般不会有人来问。除湿机在响，声音比昨天大一些。',
      options: [
        { label: '顺着编号去查对应的寄存人',
          run: { intel: 4, track: { sin: 1, loyalty: -1 } },
          after: '寄存人的工号属于研究所园区，最后一次出现是三号门禁的空档那天。红线是谁画的查不到。' },
        { label: '把这一行抄进自己的记录，报个异常',
          run: { track: { loyalty: 2, renown: 1 } },
          after: '异常工单被受理，两天后回复「索引维护」。那行红线被擦掉了，编号也一并注销。' },
        { label: '要求柜员把这一行复原',
          run: { track: { power: 2 }, intel: 2, grantCard: { n: 1, path: 'purge', tier: 2 } },
          after: '复原申请走了特殊通道，当天通过。柜员在交接时给你一张清洗类指令牌，说这类索引最好别再有人碰。' },
      ] },
    { id: 'v46', portrait: 'portrait-ghost', district: 'memory', title: '寄存柜里的一段空白',
      text: '寄存柜里有一段被标记为已存满的记忆，读出来却是空白，整整三十分钟。柜员说不可能是空的，存满标记要占满配额才会亮。你把空白读了一遍，中间能听见一点环境声，像有人在走路，脚步很轻。',
      options: [
        { label: '把环境声单独抽出来比对',
          run: { intel: 3, chips: 1 },
          after: '脚步声的间隔是固定的，和环带通道某一段的实地步频一致。你把音频留下，其余销毁。' },
        { label: '按空白处理，销掉这个柜位',
          run: { track: { loyalty: 2, sin: 1 }, money: 15 },
          after: '柜位注销当天就腾给了别人。第二天新寄存人来了三次，每次都在同一时间。' },
        { label: '留下这段空白，不销柜位',
          run: { intel: 1, track: { sin: -1 } },
          after: '你替这段空白续了三年。柜员看了你一眼，说续费的人一般都不会再来第二次。' },
      ] },
    { id: 'v47', portrait: 'portrait-mem', district: 'memory', title: '柜台外的一次代取',
      text: '有人持代理书来取一段记忆，代理书上的委托人和被委托人写的是同一个人。柜员核了三遍，两张证件都是真的，照片也都对得上。来取的人穿得普通，站在柜台前不动，等柜员先说话。',
      options: [
        { label: '照代理书放行',
          run: { money: 30, track: { loyalty: 1, sin: 1 } },
          after: '放行之后账上多了三十点手续费。当天的操作日志里，这条记录被标记为「本人代取」。' },
        { label: '要求现场做一次生物核对',
          run: { intel: 3, track: { loyalty: 2, renown: 1 } },
          after: '生物核对通过，但数据在系统里留了第二份快照。来取的人走后，柜员把快照单独拷了一份。' },
        { label: '暂缓放行，先查委托人的在岗状态',
          run: { intel: 4, track: { sin: 1 } },
          after: '委托人在岗状态显示「外派」，已满两年。你把查询单留着，那位来取的人第二天又来了一次。' },
      ] },
    { id: 'v48', portrait: 'portrait-ghost', district: 'memory', title: '被归还的一段记忆',
      text: '柜员说今天有一位客户主动归还记忆，理由是「用不上了」。归还流程要销毁原文，客户却要求先放一遍。放的时候他闭着眼，跟着默念。柜台上那台老播放器的指示灯一直在闪，比平时暗。',
      options: [
        { label: '允许先放一遍，再销毁',
          run: { intel: 3, track: { renown: 1 }, vitality: -1 },
          after: '播放时长比登记的多出四分钟。客户走时说了句「果然被剪过」，之后这段记忆还是销了。' },
        { label: '要求按流程直接销毁，不放',
          run: { track: { loyalty: 2, sin: -1 } },
          after: '客户签名时手停了两秒。销毁后系统里这条记录的状态改成「已了结」，经办人是你。' },
        { label: '先把这段记忆复制一份，再销毁',
          run: { intel: 5, track: { sin: 2 } },
          after: '复制件存在不联网的离线介质里。原件的销毁凭证齐全，客户第二天收到回执时语气很平静。' },
      ] },
    { id: 'v49', portrait: 'portrait-sal', district: 'salvage', title: '熔炉前的一批入炉单',
      text: '回收场的熔炉今天多烧了一批，入炉单上写着「办公设备」，共二十七件。班头把单子压在台钳下面，说这批是加急。炉口的铁皮被烤得发红，热气把墙上的排班表吹得一直翻。萨尔在边上数箱子，数到二十三以后就不数了。',
      options: [
        { label: '拿单子核对件数，找出少的那几箱',
          run: { intel: 4, track: { sin: 1 } },
          after: '四箱没有入炉记录，编号连号。班头说这四箱已经出库，出库单上的签字是安保科的。' },
        { label: '照单签收，把加急单存档',
          run: { track: { loyalty: 2, sin: -1 }, money: 20 },
          after: '签收后账上多了二十点加急补贴。三天后这批单子被系统标为「已结项」，编号连号的那四箱再没出现过。' },
        { label: '拦住入炉，要求开箱逐件清点',
          run: { track: { power: 2, renown: 1 }, vitality: -1 },
          after: '清点花了四小时，炉子降了温重新点过一次。第二天班头在场区见到你，把安全帽往下压了压。' },
      ] },
    { id: 'v50', portrait: 'portrait-enforcer', district: 'salvage', title: '堆场里的一块旧工牌',
      text: '堆场里翻出一块旧工牌，照片被酸雨蚀掉了，只剩下半张脸。卡上的部门和你的部门一样，工号差一位。班头说这批牌是上个月从环带收上来的，一起有十二块。这块牌被扔在传送带边上，没人捡。',
      options: [
        { label: '把十二块牌都找出来，核对工号',
          run: { intel: 4, vitality: -1, track: { sin: 1 } },
          after: '十二个工号里有七个还能在系统里查到，状态都是外派。另五个工号从来没有登记过。' },
        { label: '只把自己的那块收好，不再多问',
          run: { intel: 1, track: { sin: -1 } },
          after: '牌子收进抽屉最下层。当天下午收料的人来问过一句有没有见到旧牌，你说没有。' },
        { label: '把这块牌交给班头，登记入库',
          run: { track: { loyalty: 2 }, intel: 2 },
          after: '登记为「待销毁硬质废物」，编号当天生效。第二天这十二块牌的去向全改成了已熔。' },
      ] },
    { id: 'v51', portrait: 'portrait-ghost', district: 'salvage', title: '称重台上多出来的三公斤',
      text: '回收场的称重台今天连续三车都比台账重三公斤，误差稳定得像被调过。班头说是台面结露，让工人擦了一遍，读数没变。称重台旁边的记录屏一直在跳数字，从下往上滚，每次滚到同样的位置会顿一下。',
      options: [
        { label: '重新做一次空载校准',
          run: { intel: 3, chips: 1 },
          after: '空载读数是负的三公斤。校正记录当天打印出来，班头把那张纸折起来放进口袋，没归档。' },
        { label: '按现值过秤，把差额记账',
          run: { money: 35, track: { sin: 1, loyalty: 1 } },
          after: '差额进了部门的小账，你分到三十五点。第二台秤在三天后换掉了，换下来的那台还在库里。' },
        { label: '把这三车的来源单独报一次',
          run: { track: { loyalty: 3, renown: 1 }, grantCard: { n: 1, path: 'expand', tier: 2 } },
          after: '来源是研究所园区的清运单。安保科表扬了你的细致，附袋里装着一张扩张类指令牌，说这片区域可以扩一扩。' },
      ] },
    { id: 'v52', portrait: 'portrait-sal', district: 'salvage', title: '冷库外被丢掉的雨衣',
      text: '冷库外面挂着三件雨衣，都是同一批的，标签上的尺码一样。今天是晴天，穹顶内侧已经半个月没有降雨。萨尔说这三件是昨天从货箱里翻出来的，还有一股药味。冷库门开着一条缝，里面的白气往外走得很慢。',
      options: [
        { label: '取一件雨衣做残留检测',
          run: { intel: 4, gear: 1, track: { sin: 1 } },
          after: '残留里有两种不属于回收场的清洗剂，其中一种只在研究所订得到。你把结果抄下来，雨衣还回去了。' },
        { label: '把三件雨衣全部烧掉',
          run: { track: { sin: -1, loyalty: 1 } },
          after: '烧掉的过程很短，只剩三颗金属扣。班头看了灰烬一眼，说这种事以后不用他签字。' },
        { label: '顺着标签查货箱的来源批次',
          run: { intel: 3, money: 25, grantCard: { n: 1, path: 'purge', tier: 2 } },
          after: '批次来自三号库的加急货。班头付了你二十五点封口，另塞一张清洗类指令牌，说这箱子的事他到不了上面。' },
      ] },
    { id: 'v53', portrait: 'portrait-out', district: 'salvage', title: '场区围栏上的一个缺口',
      text: '回收场靠穹顶一侧的围栏上有个缺口，边上的网被剪断，断口是新的。缺口外面就是酸雨层，地面上却没有雨蚀的痕迹，只有一串脚印进出。巡检记录上这一段的最近一次检查是两周前，签的是班头。',
      options: [
        { label: '沿脚印走进去看一段',
          run: { intel: 4, vitality: -1, track: { sin: 1 } },
          after: '脚印通向一个被沙土半埋的箱体，箱盖上的编号你在港区货单上见过。你没开箱，只拍了照。' },
        { label: '当天把缺口焊上并报备',
          run: { track: { loyalty: 3, renown: 1 } },
          after: '焊补当天完成。第二天围栏上多了一道监控线，缺口位置也被记进了巡检重点。' },
        { label: '不填，只在班头的巡检表上抄一份日期',
          run: { intel: 2, track: { sin: 1 } },
          after: '两周前的巡检表是你抄的。三个月后这一栏成了唯一能证明缺口存在过的记录。' },
      ] },
    { id: 'v54', portrait: 'portrait-enforcer', district: 'salvage', title: '一台还没销毁的终端',
      text: '回收场的压机今天停了一次，停的时候压着的是一台还能开机的终端。屏幕上留着最后一条登录记录，工号是研究所的。班头站在压机旁边抽烟，说这台本该昨天就碎掉的，机器坏了，责任在他。',
      options: [
        { label: '趁停机把终端里的数据拷出来',
          run: { intel: 5, track: { sin: 2 }, vitality: -1 },
          after: '数据里有一份出库清单，和港区三号泊位的货单能对上。你把清单单独存好，终端按原样压碎了。' },
        { label: '通知研究所派人来取终端',
          run: { track: { loyalty: 2, renown: 1 }, money: 15 },
          after: '研究所当天来人，签收时绕过了你的名字。班头被扣了一天工时，压机三天后才修好。' },
        { label: '把压机修好，照原定流程销毁',
          run: { track: { loyalty: 3, sin: -1 } },
          after: '压机修好后终端被压成一块，日志由你签字确认。研究所那边再没提过这台设备。' },
      ] },
    { id: 'v55', portrait: 'portrait-yuke', district: 'outside', title: '穹顶外带回来的一只箱子',
      text: '雨客把一只箱子放在你办公室门口，箱体上凝着一层酸雨的壳，摸上去是脆的。他说箱子里没有东西，他只是要一个存放的地方。箱子的封条是新的，压印着一个你在空白指令上见过的编号格式。',
      options: [
        { label: '收下箱子，不问里面',
          run: { intel: 2, track: { sin: 1 } },
          after: '箱子在你办公室放了六天。第七天早上它不见了，地板上留着一个干燥的方框印。' },
        { label: '拒收，让他带去别处',
          run: { track: { loyalty: 2, renown: 1 } },
          after: '雨客什么也没说，把箱子提走了。三天后穹顶内侧贴出一张寻物启事，丢了的是同一只型号。' },
        { label: '收下，并在当天打开看一次',
          run: { intel: 4, chips: 1, track: { sin: 1 }, grantCard: { n: 1, path: 'purge', tier: 3 } },
          after: '箱子里是一叠空白指令卡的毛坯，边角还没切齐。雨客后来给你一张清洗类指令牌，说这批货本来就有你的一份。' },
      ] },
    { id: 'v56', portrait: 'portrait-out', district: 'outside', title: '穹顶内侧的雨线',
      text: '穹顶内侧今天出现一条细窄的雨线，从接缝处漏下来，落在一条很少人走的货运通道上。通道地面被腐蚀出一小片白点。维保的人来看过一次，说这是正常渗漏，一周内会修，然后就走了。',
      options: [
        { label: '自己带人先把这条通道封了',
          run: { track: { renown: 2, loyalty: -1 }, money: -20 },
          after: '封道花了二十点。第二天维保的人还是没来，通道已经被你封着，通行的人绕了两百米。' },
        { label: '把渗漏点拍照报修，等流程',
          run: { track: { loyalty: 2, renown: 1 } },
          after: '报修单在系统里排到了下周。这条雨线在第三天自己停了，白点被人用砂纸磨掉。' },
        { label: '顺着渗漏点往上查接缝的检修记录',
          run: { intel: 4, track: { sin: 1 } },
          after: '这段接缝的检修记录缺了两次，缺的那两次正好是对应那条货运通道停用的时间段。' },
      ] },
    { id: 'v57', portrait: 'portrait-sal', district: 'outside', title: '气闸里的一名陌生人',
      text: '凌晨的气闸打开过一次，进来一个人，登记表上写的是外派返岗，工号却查不到。他穿着外出的防护服，袖口有一圈白色的盐霜。值守的人让他先在缓冲间等，等了两个小时，他一直站着没坐。',
      options: [
        { label: '让他先坐下，给他补一份登记',
          run: { track: { renown: 2, loyalty: -1 }, vitality: -1 },
          after: '登记补完，工号还是查不到。他走的时候把防护服留在了缓冲间，里面没有一个口袋。' },
        { label: '按无登记人员流程上报',
          run: { track: { loyalty: 3, renown: 1 } },
          after: '安保科十分钟后就到，把人带走。当天缓冲间做了一次全面消杀，记录上写着发现不明来源盐渍。' },
        { label: '把防护服的袖口剪下一块留存',
          run: { intel: 3, gear: 1, track: { sin: 1 } },
          after: '袖口的盐霜成分里有酸雨里才有的元素。你把样本收好，防护服第二天被统一销毁。' },
      ] },
    { id: 'v58', portrait: 'portrait-yuke', district: 'outside', title: '一张被雨水泡开的手写单',
      text: '穹顶内侧的排水沟里捞出一张手写单，纸已经泡开，字迹还能认出一半。上面记的是十二个日期和一个重复出现的编号。捞的人把单子摊在水泥台上晾，风一吹就卷边。你往下看时，编号里有三个和空白指令的格式一样。',
      options: [
        { label: '把单子烘干，完整抄一份',
          run: { intel: 4, chips: 1, track: { sin: 1 } },
          after: '抄完你核了三个日期，都对应着董事会例会的第二天。原单在交班时被扔进了普通垃圾。' },
        { label: '把单子交给合规部',
          run: { track: { loyalty: 3, renown: 1 } },
          after: '合规部收下并出具了收条。一周后回复「无可核实事项」，那十二个日期没有一个被提起。' },
        { label: '把单子放回排水沟，不带走',
          run: { intel: 1, track: { sin: -1 } },
          after: '你走开不到十分钟，那张单子就不见了。排水沟当天下班前做了一次清掏。' },
      ] },
    { id: 'v59', portrait: 'portrait-out', district: 'outside', title: '观测窗外的一个人影',
      text: '穹顶的观测窗每隔一段时间自动除雾，除到第四格时，外面站着一个人影，距离约三十米。除雾程序走完，人影就不在了。观测记录里那四秒的图像被系统标成了噪点，连续三天都是同一格。',
      options: [
        { label: '调出那四秒的原始图像',
          run: { intel: 5, track: { sin: 1, loyalty: -1 } },
          after: '原始图像里人影的防护服上有编号，样式和雨客那件一样。三天的图像里，那个人换了三个姿势。' },
        { label: '把这一格列入禁止除雾区域',
          run: { track: { loyalty: 2, sin: -1 }, money: 15 },
          after: '设置当天生效，第四格不再自动除雾。之后观测记录里再没出现过噪点，窗面上多了一层灰。' },
        { label: '亲自去观测窗外侧走一段',
          run: { intel: 3, vitality: -2, track: { sin: 1 }, grantCard: { n: 1, path: 'expand', tier: 3 } },
          after: '外侧只有新积的沙尘和一串被吹散的脚印。回程时值守的人给了你一张扩张类指令牌，说穹顶外的地迟早要有人去占。' },
      ] },
    { id: 'v60', portrait: 'portrait-sal', district: 'outside', title: '穹顶接缝处的一枚螺栓',
      text: '萨尔在穹顶接缝处捡到一枚螺栓，螺帽上有编号，和环带检修口用的是同一批。螺栓是新的，没有锈，螺纹上还留着油脂。她把螺栓放在你手心里，说这东西不该出现在外面，说完就转身走了。',
      options: [
        { label: '把螺栓拿去环带比对',
          run: { intel: 4, track: { sin: 1 } },
          after: '环带第十号检修口的备件箱里少了一枚同批螺栓，缺件记录上写着「自然损耗」。你把两者都对上了。' },
        { label: '把螺栓交回库房，登记为拾得物',
          run: { track: { loyalty: 2, renown: 1 } },
          after: '登记编号当天生成。三天后这枚螺栓被列入待销毁清单，和你当天交上去的那批一起处理。' },
        { label: '留着螺栓，记住萨尔交给你的动作',
          run: { intel: 2, track: { power: 1 }, grantCard: { n: 1, path: 'control', tier: 2 } },
          after: '螺栓收进抽屉。半个月后萨尔捎来一张笼络类指令牌，说潮那边的人让她转交，理由是她自己也没听懂。' },
      ] },
  ];
})();

/* ===== game/approval.js ===== */
/* 认可桥段：十六个人各自在什么条件下才肯把牌交出来。
   拿卡不是刷关系，是他在这一场戏里看清了你是什么样的人。
   字段：id / npc / title / when / text / options / grant / passLine
   when 至少给 minRel 与 minFolded，另可用 minDay / flag / track。
   options 里 pass:true 的选项才给牌（grant），pass:false 是他看出来你在演，不给。
   通过时人物卡带着 passLine 那句原话进手牌。 */
(function () {
  'use strict';
  window.APPROVALS = [

    /* ============ 闻铎 · 董事会监事 · 高塔商业区 ============ */
    {
      id: 'ap-wen-duo',
      npc: 'wen-duo',
      title: '闻铎：只认自己写的那一栏',
      when: { minRel: 4, minFolded: 2, minDay: 3 },
      text: '茶室上个月改成了储物间，纸箱堆到门口，玻璃上那张「下午四点停供」的告示还贴着，边角翘起，被箱子顶住。闻铎把你约在四十九层的楼梯间，靠墙站着，脚边放着一只磕了口的凉茶杯，杯里那圈水痕早就干了，他不扔。他摊开一份审计底稿，第三页有一栏数字被人重新写过，涂层颜色比旁边深，纸背还能摸到旧数压出的凹痕。他没有问是不是你改的，只把那页纸转了个方向，让改过的那一栏正对着你。这一栏在监事会走过七道流程，每一道都有人在纸上找一行字，找到了就往下按。你伸手把纸翻回原样，说这一栏是你改的，原来的数你还记得，改完没报备，也没有找人补签。他听完没有立刻接话，先是把那页纸的折角压平。然后他掏出那本硬皮本子，在某一页写了两行，报出两个日期：一个是你改的那天，一个是你今天进门的时间，中间隔了十一天，两个数他都写在自己那一栏里。他说本子里记了三百多个号，每一个号都在往上走，他每天上班要做的事就是把其中一个往后挪一格，挪一格，那张表上就少一格可以留给别人。他说这句话的时候看着走廊尽头那扇锁着的门。',
      options: [
        { label: '当面认下是自己改的，一个字不改', relation: 2, pass: true, flag: 'ap_wd_own',
          after: '他把两个日期抄在纸角上，抄完核对了一遍，两个数只差两分钟。他说改过的事不报不算数，报过才算，这是监事会的规矩，也是他自己私下的规矩。他先推开楼梯间的门让你走，自己跟在后面，声控灯灭了他也没跺脚，一路摸着扶手走到那扇锁着的门前停了一下。他说明天起你每月来报一行给他，不用写事由，写日期和那一栏原来的数就行。' },
        { label: '说那一栏是别人改的，你只是经手', relation: -1, pass: false,
          after: '他把底稿合上，没有翻回去核对。他说经手的人比改的人多，监事会大厅里坐着的都是经手人，真在纸上写字的没几个。他把那只磕了口的杯子端起来又放下，说这杯茶他今天不倒了，凉茶倒出来没有味道，留着还能当个凭据。他先走了，脚步声一直响到楼下。' },
        { label: '不承认，提出用一个编号换这次不追究', relation: -2, pass: false,
          after: '他笑了一下，笑得比平时久，笑完把本子塞回内袋，扣子扣了两道。他说编号他每天要过一遍，多一个少一个他心里都有数，你这个他已经有了，不必再送。他把底稿夹进公文包，出门前把楼梯间的灯按灭了，楼道一下子只剩余光。' },
      ],
      grant: true,
      passLine: '我这一栏也改过，改的是名单上一个号的位置。你那一栏是你自己写的，我记。',
    },

    /* ============ 苏纹 · 董事会日程官 · 高塔商业区 ============ */
    {
      id: 'ap-su-wen',
      npc: 'su-wen',
      title: '苏纹：她等了二十五年的那一格',
      when: { minRel: 5, minFolded: 3, minDay: 5 },
      text: '她的排期表上有一格是手写填的，名字下面那栏日期一直空着，铅笔痕被擦过太多次，纸面已经起毛，边上还有一枚浅浅的指印。她把一张没有编号的申请单推到桌角，说这份东西还差最后两道手续：第一道要有人签，第二道要有人送。她说这话的时候没有解释为什么要办，也没有说这件事和她有什么关系，只在合上表册时问你今天几点走。你拿着单子去了流程科，排了四十分钟的队，第二天早上把回执放回她桌上。她看了一眼回执，又看了一眼那格空着的日期，说这两天排期很紧，你的事往后放一放没关系。她说的「你的事」，是你自己递进系统的那份面谈申请，从上周拖到现在她一次都没提过。第三天她把表摊开让你看，那一格的日期还是空的，名字旁边多出一个很小的记号，像用笔尖点的。她说这一格空了很多年，谁问起她都说是排期问题。她办公桌最下面那个抽屉锁着，钥匙用一根旧线拴在桌腿上，没见过她开。走廊的电梯停了一下层，响了三声，门没开，她立刻把表册合上，用掌心压了压。',
      options: [
        { label: '什么都不问，去把最后两道手续走完', relation: 2, pass: true, flag: 'ap_sw_closed',
          after: '她把回执夹进表册，铁夹坏了一边，她用橡皮筋捆了两圈。她说这一格她填不了，别人替她走完，也算走完。当天下午她把你那份面谈申请挪到了周四上午第一格，理由栏写的是对方时间调整。你临走时她还在低头对表，铅笔一直没落到纸上，电梯那边又响了一次，这回门开了。' },
        { label: '问那一格空着的是谁的日期', relation: -1, pass: false,
          after: '她把表册合上，动作不快，合完用掌心又压了一压。她说排期表上的空格都是排期问题，没有别的说法。那张没有编号的申请单她当天下午就抽了回去，回执还给你的时候折成四折，折痕压得很深，像折过很多次的那种纸。' },
        { label: '办完手续，同时把这张单子报进系统留档', relation: -2, pass: false,
          after: '她没有拦你，也没有再看那张单子一眼。她说留档是应有的程序，她这一行本来就是替别人留档的人。周四那格面谈照旧排给了别人，你的申请退回到待排，退件理由那一栏空着，登录记录里操作人写的是系统自动。' },
      ],
      grant: true,
      passLine: '我等了二十五年，等的是一个不问的人。你把这件事收尾了。',
    },

    /* ============ 郁南枝 · 清算行首席 · 交易所广场 ============ */
    {
      id: 'ap-yu-nanzhi',
      npc: 'yu-nanzhi',
      title: '郁南枝：对不上的那三十七万',
      when: { minRel: 4, minFolded: 3, minDay: 4 },
      text: '交易所广场的清算行到晚上八点还亮着灯，屏幕上的数字一列一列往下滚。郁南枝把昨天的清算单推过来，尾差三十七万四，来源栏填的是你部门的编号。她说这本该在上午的核对里抹平，抹不平就挂账，挂账的单子今晚十二点进复核，进复核的账跟着经手人走。她把一支削好的铅笔放在纸边，笔尖朝你，让你自己圈出那一行。你没有先看单子，先把那笔交割的编号和时间报了出来，报得比她自己记的还准，然后说这三十七万四是你这边出的，出错的是三号交割那次回流。她低头核对了一遍，两个数对得上。她把铅笔接回去，在来源栏那一行上划了两道，改成清算行内部暂记，纸边压着一枚用旧的回形针，回形针被夹过很多次，开口已经松了。她说改完之后这笔钱挂在她名下，月底要写一份说明，说明里一个字都不会出现你的编号。她低头写字，手腕上那只旧表表盘有裂，秒针还是准的。走廊的灯灭了一排，只剩她头顶那一盏，屏幕上那行红字还在闪。',
      options: [
        { label: '当场认下差额，报出那笔交割的编号', relation: 2, pass: true, flag: 'ap_yn_counted',
          after: '她把交割编号抄在单子的空白角上，抄完核了两遍，两个数都对得上。她说对得上的账她签，对不上的她从来不签。她把那枚旧回形针取下来夹进你那页纸，说这一枚下次还要用，用完再还她。走之前她关了屏幕，清算室只剩下过道的灯，门禁记录里她把自己的工号写在最后一行。' },
        { label: '说这行数字不是你们出的，要求复核科来核', relation: -1, pass: false,
          after: '她把单子收回抽屉锁上，钥匙放回表带下面。她说复核科明早九点上班，材料她自己准备，不用你送。第二天尾差的来源栏改成了清算行内部，后面跟了一行小字，写着责任已隔离，经手人那一栏是空的。第三天她没有再开过那盏台灯。' },
        { label: '认下差额，但问能不能下周补齐', relation: 0, pass: false,
          after: '她说不补。挂账只挂一晚，过了十二点就进复核，复核里的每一笔都跟着经手人走一辈子。她把铅笔放回笔筒，笔尖朝下，说这一行今晚必须有一个字，字是谁的她就记谁的。桌上的单子她推到桌子正中，一直摆到第二天上午有人来收。' },
      ],
      grant: true,
      passLine: '这一行我挂了，名字我写的，数我认。你报的那一笔，对得上。',
    },

    /* ============ 戴思远 · 合规伦理审查官 · 研究所园区 ============ */
    {
      id: 'ap-dai-siyuan',
      npc: 'dai-siyuan',
      title: '戴思远：没人愿意作废的例外',
      when: { minRel: 4, minFolded: 3, track: { sin: [0, 6] } },
      text: '合规处那半排灯坏了一个月没人报修，戴思远就在暗的那半张桌子上办公，本子摊开，一行一行往下写，写完把笔帽一颗一颗扣上。他把一份例外申请推过来，申请人一栏填的是你部门的编号，事由写得含糊，后面附了一张上周的差旅报销。这份例外批下去，你出差那趟的账能全额报，代价是审查记录上多一条他签的字。他没有把笔推给你，也没有把纸收回去，笔就放在纸边，笔帽朝上。他说这一份理由不成立，按流程该退回；可他手上已经批过一份理由不成立的，编号还在归档里躺着，三年前的事，到现在每一道核查都要翻出来念一遍，念一次他就要在那份材料上再签一次字。他说完把本子翻到前面，指给你看那一页：同样的表格，同样的空栏，只是签名的人换过三茬。他的旧表带早断了，用一段黑线缠着，线头打结的地方磨得发亮。走廊那头堆着两只没拆的纸箱，箱口的胶带翘了边，上面落了一层灰。',
      options: [
        { label: '当场把这份例外作废，差旅费自己垫', relation: 2, pass: true, flag: 'ap_ds_void',
          after: '你把纸对折按齐，走到走廊尽头送进碎纸机。机器响的时候他抬手按了一下，像要拦，手停在半空又收回去。他抽出别在袖口的红笔，在退回联上写了两个字，写得很慢。他说这一趟的差旅说明要写清是自垫，写清以后每次核档都会有人翻到。他说完把本子合上，暗的那半张桌上，纸箱的胶带被风吹起来一角。' },
        { label: '签下去，省下这笔差旅钱', relation: -1, pass: false,
          after: '你签完把笔放回原处，笔帽朝下。他看了那行签名一眼，把例外夹进归档，夹子扣上，动作跟平时一样规整。他说合规处不会漏掉这一份，三年前那两份也都在，编号他都记得住。他重新翻开本子，一行一行往下写，没有再跟你说别的话。' },
        { label: '不作废，让他按流程退回，改走别的科目报掉', relation: 0, pass: false,
          after: '他说退回也是走流程，走流程的单子最后还是要落回他手上。他把红笔别回袖口，说换科目不算作废，只算挪了个地方，挪过的东西他本子里都记着。他把例外推到桌角，说明天上午再处理，让你先回，灯他没关，让那半排一直亮着。' },
      ],
      grant: true,
      passLine: '我替人遮过一份，遮了三年。你这一份是你自己撕的，我记你这一笔。',
    },

    /* ============ 程砚 · 首席科学家 · 研究所园区 ============ */
    {
      id: 'ap-cheng-yan',
      npc: 'cheng-yan',
      title: '程砚：签收栏上留出的那一行',
      when: { minRel: 4, minFolded: 3, minDay: 4 },
      text: '三号实验室的灯全开着，走廊里一个人都没有，冷气把纸角吹得一直在抖。程砚把一份签收单摆在台面正中，签收人栏空着一行，旁边压着一支笔，笔尖朝外。她说这只箱子的编号属于三号项目最后一批样本，冷链记录停在前天凌晨，中间那四十多分钟没有数据。说明写设备老化，这一批就整体销毁，数据作废，重测要六天；写不下去，就得有人认，认了以后追溯期内所有核查都会找上签收人。她说话像在念说明书，句子之间没有停顿，讲到「会找上签收人」的时候停了一下，抬眼看了你一下，又低下去。她说她自己不能签，她的编号印在三号项目所有记录的第一页，她一签，整条线都停。培养箱的温度显示一直在跳，玻璃内壁上蒙着一层薄雾，看不清里面。她把手从台面上抬起来又放回去，手指压着那张单子的一角，压得纸边起了折。她说这个问题她已经问过四个人，四个人都说明天再看，而今天是追溯期的最后一天。她说完就等着，没有劝，也没有解释。',
      options: [
        { label: '签自己的名字，不问那个人会怎么样', relation: 3, pass: true, flag: 'ap_cy_signed',
          after: '你把名字写在签收栏里，笔画压过格线。她把单子收走，先扫了一遍码，再把台面上那支笔转了个方向，笔尖朝里。她说重测不用做了，这批数据明天就能挂上网，追溯期内所有核查都找她和你。她的语速跟刚才一样，只是手不再压着桌边。走廊尽头有辆推车经过，轮子响了一路。' },
        { label: '劝她把结论写成设备老化，重测六天', relation: -1, pass: false,
          after: '她把单子往里收了半寸，收完又推回原位。她说重测六天的数据出不来，六天之后追溯期正好过去，设备老化这四个字就是三个人一起写的，写在结论栏里。她低头去调培养箱的参数，背对着你站了很久，玻璃上那层雾一直没散，数字还在往上跳。' },
        { label: '答应签，但要求她把那四十多分钟写进附页', relation: 0, pass: false,
          after: '她说附页要一起报，报上去附页比正文先被翻到。她把笔从台面上拿起来递还给你，说这一栏她再想想。培养箱的降温提示响了一声，她转身去看，没有再回头。单子在台面上压了一夜，第二天早上被收进档案盒，签收栏还是空的。' },
      ],
      grant: true,
      passLine: '签收栏本来是我留给自己的。你签得比我快，这一栏以后写你的字。',
    },

    /* ============ 彭戬 · 研究所安保总管 · 研究所园区 ============ */
    {
      id: 'ap-peng-jian',
      npc: 'peng-jian',
      title: '彭戬：他在规则里吃的那次亏',
      when: { minRel: 4, minFolded: 4, minDay: 5 },
      text: '安保总控室里有四块屏，最左边那块一直闪红点，其余三块滚的是各楼层的门禁记录。彭戬把一叠巡检单拍在桌上，说周二凌晨那趟无人值守缺了签名，系统里挂的是你的编号，挂错了也是挂着。他说补签两分钟，笔就在他手里，签完当场归档，第二天综合管理处不会来问。你要是不签，这趟缺岗要走异常流程，异常流程会扣安保科当月绩效，也会把你三个月的园区权限压到只读，进研究所要提前两天报批。他说这些话的时候一直看着屏幕，没有看你。他没有提这条只有他一个人顶得住，也没有提他前天刚上过一趟报告。你把巡检单推回去，说不签，走异常流程。他站起来去打电话，报的是自己的工号，声音很平，报完把笔插回胸前的口袋。第二天通知贴在门上，扣的是他的绩效，你的权限也压了。他没有为这件事再找过你，第三天你按流程重新报批进园区，队伍排在最后一个。他在门岗核单子的时候问了一句你来做什么，核完就放行了。',
      options: [
        { label: '不签，让异常流程照走，也不去找关系', relation: 2, pass: true, flag: 'ap_pj_rule',
          after: '他在门岗核你的报批单，核了三遍，第三遍才盖章。他说权限压了就是压了，流程走完会自动恢复，别去综合管理处找人说话。他把钥匙盘拿在手里转了半圈，第三格还是空的。你进门的时候，他让闸门多开了两秒，红点还亮着。' },
        { label: '签下去，把这件事平息掉', relation: -1, pass: false,
          after: '他递笔的动作很快，签完就把单子收走归档，封皮压平，边角对齐。他说事情了了，绩效保住了，你的权限也是满的。第二天他把钥匙盘从抽屉里拿出来又放回去，第三格空着，他看了那格一会儿，什么也没说。' },
        { label: '不签，但去综合管理处说一次情', relation: -2, pass: false,
          after: '他接到电话那天下午就来问你有没有去找过人。他说这条规则他背了十一年，谁找关系绕过去，他这边就记一笔。他当场在门禁系统里给你的编号后面加了一行备注，不加解释。那把钥匙盘他没再拿出来过。' },
      ],
      grant: true,
      passLine: '规则不替谁打算盘。你在它上面吃了亏没绕，我这条道给你走。',
    },

    /* ============ 老鸦 · 灰市掮客 · 灰市 ============ */
    {
      id: 'ap-lao-ya',
      npc: 'lao-ya',
      title: '老鸦：一笔和你无关的欠账',
      when: { minRel: 5, minFolded: 3, minDay: 4 },
      text: '灰市冷库最里面那排铁架塌过一角，钢管上还留着弯痕，过道口那盏灯照下来，光里全是浮着的霜。老鸦蹲在架子边上，手边摊着那本用左手写的账本，字歪，行距却齐。他报出一个数：三万二。这笔账挂在一个上个月就没了的掮客名下，货从冷库出去，钱没结，灰市按规矩要找一个经手的人补上。他没有说那个人是谁，只把账本翻到那一页，用指甲压着那行字，说这一页今晚要有人按手印，不按就转给清算行，转过去之后经手那一栏写谁的名字，他管不了。他不是在要钱，也不是在讨便宜，冷库里那盏灯照着他一双冻红的手，他等的是看你会不会把这笔账按到别人头上。你按了手印，钱自己划，事后没去找上家，也没托人改那行字。他看着那枚手印看了一会儿，说这一笔本来就不该你赔。他把本子翻回第一页给你看了半眼，那一页最上面写着一个名字，写了三十年，纸都磨薄了，他立刻合上，扣好，塞进外套内袋。',
      options: [
        { label: '按手印，钱自己划，不去找上家', relation: 3, pass: true, flag: 'ap_ly_paid',
          after: '他把账本翻到第一页又立刻合上，动作很快，像是不想让你看清那名字。他说这本子记仇，也记恩，白的赔的一共没几笔。他给你留了一行，位置在中间，没写数，也没写日期。冷库的门关上的时候，他把过道那盏灯留给了你。' },
        { label: '认这笔账，但要在账本上注明不是你经手的', relation: 0, pass: false,
          after: '他没有拦，把笔递过来让你自己写。你写完，他看着那行字说，账本上写清了也没用，灰市只认谁按的手印。他把本子收进内袋，扣子扣了两道，说你这个人他记下了，记在另一页。冷库的门是他先推开的，风灌进来，把霜吹了一层。' },
        { label: '不认，让他们转给清算行', relation: -2, pass: false,
          after: '他说行，转给清算行的账最后也会落到某个人头上，落谁头上他都不看。他把账本卷起来塞进外套，站起身的时候膝盖响了一声，说冷库里站久了都是这个样子，谁也一样。过道那盏灯他没关，一直亮到你走出去。' },
      ],
      grant: true,
      passLine: '这本子记仇，也记恩。跟你无关的钱你赔了，这一笔我记你一辈子。',
    },

    /* ============ 陆晚 · 无证诊所医生 · 下层居住区 ============ */
    {
      id: 'ap-lu-wan',
      npc: 'lu-wan',
      title: '陆晚：登记本上一直空着的那页',
      when: { minRel: 4, minFolded: 3, minDay: 3 },
      text: '无证诊所开在半层地下，消毒水味压不住铁锈味，门帘底下一直有风。陆晚让你把袖子往上撸，看你手腕上那道口子，缝七针，线是黑的，扎得比上一回密。她一边缝一边说下个月那批药到了就得换新的，药商换了东家，价涨了三成。她没有问这道口子是怎么来的，没有问你为什么半夜才来，也没有问外面那条巷子里有没有人在等你。你把袖子放下来的时候说了一句，这件事别记进本子里。她点头，说本子里不记伤口，只记剂量和时间。她把桌上那本登记本往里推了推，本子很厚，边上磨得起毛，中间有一页夹着回形针，页脚折过又压平，折痕很旧。她说那一页空着，等一个人回来填，等了三年。她说这句话的时候手很稳，针脚没有歪，也没有停。她给你缠上纱布，说三天后来换药，来晚了就把摊子搬到下面那层去，再下面还有一层，一直到底。诊室外面有人咳了很久，从头到尾没有停过。',
      options: [
        { label: '不问伤口，也不问她会不会说出去', relation: 3, pass: true, flag: 'ap_lw_silent',
          after: '她把线头剪齐，纱布按平，多余的胶带折了两折。她说她这里三天以后有新的药，来得早能剩下一支。她把你那只空袖子理好，袖口有血，她用凉水搓了两把，没搓干净也不管了。登记本上你的名字写在剂量那一栏的边上，写得很小，页脚那枚回形针还在原位。' },
        { label: '问她那一页上等的是谁', relation: -2, pass: false,
          after: '她手上的动作停了一下，针还在肉里，停完继续缝，速度跟刚才一样。她说本子上那一页翻过去了，她记不清。缠纱布的时候她多绕了一圈，绕得很紧。你没再说话，她也没有抬头。三天后她自己去了下面那层，诊所门上贴了张纸条，字很短。' },
        { label: '答应三天后带药来，顺便打听登记本的规矩', relation: 0, pass: false,
          after: '她说规矩就一条，来的人不问来的人。她把药箱扣上，锁挂在把手最里面那一格。你出门的时候她把灯调暗了一点，说这条巷子夜里有巡检，走路别看别人家的窗。登记本还是摊在桌上，那一页没有翻开过。' },
      ],
      grant: true,
      passLine: '我这里不登记伤口，也不登记谁问过。你什么都没问，我认你。',
    },

    /* ============ 铁贵 · 装卸工会头目 · 工业港区 ============ */
    {
      id: 'ap-tie-gui',
      npc: 'tie-gui',
      title: '铁贵：吊机底下他站的那一边',
      when: { minRel: 4, minFolded: 3, minDay: 3 },
      text: '雨从穹顶接缝往下漏，在吊机底下积成一洼。铁贵站在那洼水里，雨衣湿透也没脱，左手还缠着绷带，边缘渗黄。三台吊机全停，警报灯从早上亮到现在，工人坐在箱堆后面，没人去领饭。他把一张装卸计件单递过来，上面那批货的报备号是你部门批的。上面要人认一句这是谁批的，认了今天就能复工，不认就按停工时扣，扣满就把名额交给巡检。他没让你认，他说这是他自己的事，他扛，说完把单子从你手里抽走了一半，又停住。你走到箱堆前，当着那三十个人说这一批的报备号是你批的。雨更大了，脚下那洼水没过鞋帮。铁贵把单子折起来收进内袋，一个字没说。当天夜里复工，两台吊机先开，第三台到第二天中午才动。第二天工会上报的名单里少了两个工号，那两个号他还留着，工资照发，钱从工会账上出，账上那笔缺口挂到现在还没销。他手套的食指磨穿了一个洞，一直没换。',
      options: [
        { label: '当着三十个人认下报备号是自己批的', relation: 3, pass: true, flag: 'ap_tg_stood',
          after: '他把你拉到卷帘门后面，压低声音说这话不便宜，说出来就收不回去。他从口袋掏出两张纸，是那两个死人的工号牌复印件，角都磨圆了。他说这两个号他养了四年，工会账上那笔窟窿就是这两个号。他把复印件撕了，说以后不用纸记，记人。雨衣他脱下来搭在箱门上，水顺着往下淌。' },
        { label: '认下，同时要他出一份复工承诺书', relation: 0, pass: false,
          after: '他看了一遍承诺书，问是不是要报上去。他说报上去的纸最后都会落到那批人手里，他不签。他自己去台阶上跟工人说了两句话，工人散回去上工。承诺书你带走了，第二天那份名单上还是少了两个号，窟窿照旧挂着。' },
        { label: '不认，让他们去找部门', relation: -2, pass: false,
          after: '他点头说行，让你走。他把那张计件单塞回口袋，站在洼水里又等了半小时。夜里两台吊机先开，第三台到第二天中午才动。他没再来找过你，之后交接单上的签名换成了另一个人的字。' },
      ],
      grant: true,
      passLine: '场面上的话谁都会说，站没站过来我一眼就看得出来。你站了。',
    },

    /* ============ 银面 · 女术士的代理人 · 轨道港 ============ */
    {
      id: 'ap-yin-mian',
      npc: 'yin-mian',
      title: '银面：正面空白的那张厚卡',
      when: { minRel: 5, minFolded: 4, minDay: 4 },
      text: '旧售票亭的玻璃上还贴着停用七年的牌子，边角翘起，里面那盏灯只亮一半。银面坐在柜台后面，桌上一杯凉茶没动过，杯底在木头上印出一个圈。她从风衣内袋抽出一张卡，比普通的指令卡厚，正面一片空白，反面两行编号，比别处多两位。她把卡推到桌子正中，说银面不记得这张卡是什么时候做的，也不记得上面那个编号是不是她的。她说码头明早六点四十会停一次电，停十七分钟，停电那会儿有人会来取这张卡，取的人她不认识。她要你在那十七分钟里把卡收下，收进内袋，不是放在桌上替她看着，是带着走。她说这话的时候一直用第三人称，说「银面」两个字像在说别人。她没有解释卡是干什么用的，也没有说为什么给你。你自己也知道，收一张来路不明的卡，编号会留在门禁记录里，出了事第一个被翻到的是收卡的人。她没有催，端起那杯凉茶，茶一口没喝。她说这一局她已经替你开过了，现在只看你信不信她。',
      options: [
        { label: '收下卡，带进内袋，不问编号', relation: 3, pass: true, flag: 'ap_ym_took',
          after: '她看着你收好，才把那杯茶放下，杯底又多印了一圈。她说她记得这张卡，也想不起为什么要做它，做了七年没舍得撕。她让你别拿它去查，查的人会先找到你。六点四十分灯灭了一下，她坐在原处没动，来取卡的人始终没有出现。' },
        { label: '收下，但当面把卡背的编号记下来', relation: 0, pass: false,
          after: '你把编号念了一遍，她复述得比你还准，一个字不差。她说银面记得住编号，记不住的是别的事。她把卡收回内袋，说这张卡还是放在她这里。茶她端起来倒掉了，杯底那个圈还印在木头上，擦不掉。' },
        { label: '当着她的面把卡撕了', relation: -3, pass: false,
          after: '卡很厚，第一下没撕开。她一直看着，看第二下撕开，然后把你撕出的两片码齐，推回给你。她说银面回去再想想。她走出售票亭的时候，玻璃上那块停用牌子掉了下来，落在她的脚印旁边，没人去捡。' },
      ],
      grant: true,
      passLine: '正面是空的，她留给自己一个编号。你收下了，她就不用自己填了。',
    },

    /* ============ 温仕成 · 引航票务掮客 · 轨道港 ============ */
    {
      id: 'ap-wen-shicheng',
      npc: 'wen-shicheng',
      title: '温仕成：他自己留的那张票',
      when: { minRel: 4, minFolded: 3, minDay: 4 },
      text: '轨道港的候船厅广播每九十秒报一次登船号，报完那两秒厅里很静。温仕成把你约在违规行李检查口，那里没有摄像头，只有一个坏了的扫描门，红点闪两下就灭。他把半张名单摊在台面上，撕口还是毛的，上面十九行，最后一行写着他自己的名字，工号后四位是生日，备注栏写着随行一人。他说这份名单报进系统就要查是谁抄的，他的字复核科认得，他抄不了。他要你把这半张收着，收着就行，不用抄，不用报，也不要去问最后一行为什么写成这样。他说这些话的时候手里转着一支笔，笔帽没扣，转得很稳。他提到的每一件东西都算得清：这张票的价钱、这份名单转手过几次、他名下最后一张额度还剩几位。只有最后一行那个备注栏他没有算，也没有解释。厅里的广播又响了一次，报的是一个已经走过的航班号。他把那半张纸往你这边推了半寸，笔尖在备注栏那行字上停了一下，又收回去。',
      options: [
        { label: '收下那半张，不揭穿备注栏那一行', relation: 2, pass: true, flag: 'ap_ws_kept',
          after: '他把笔帽扣上，说这一行他改过三次，改到最后自己都记不清哪一版是真的。他把手上那张过闸票的边角对齐折了两折，塞进你的口袋，说是订金，也说是封口。广播再响的时候他已经进了闸口内侧，回头没有看你，扫描门的红点闪了两下就灭了。' },
        { label: '收下，同时劝他把那一行报上去', relation: -1, pass: false,
          after: '他说报上去就有人来问他抄的是哪一版，他答不上来。你把那半张递回去，他没有伸手接，让它停在台面上。他先走了，检查口的扫描门一直坏着，红点闪了两下，再没亮过。' },
        { label: '把这份名单报进系统，换一笔核实奖金', relation: -3, pass: false,
          after: '他听你说完，点了点头，说明白。他把名字那一行从纸上描掉，描得很整齐，像一栏本来就空着的备注。过了一个星期，候船厅的投诉台多了一份没人认领的失物登记，登记人那一栏空着。' },
      ],
      grant: true,
      passLine: '这笔账我没算，也没打算让别人替我算。你不算它，我就给你。',
    },

    /* ============ 雨客 · 穹顶外的接触人 · 穹顶之外 ============ */
    {
      id: 'ap-yu-ke',
      npc: 'yu-ke',
      title: '雨客：牌子上的那行编号',
      when: { minRel: 4, minFolded: 4, minDay: 5 },
      text: '第七接缝外侧常年湿度七十往上，墙上挂着一层水珠，走一步鞋底响一下。雨客蹲在配电箱后面，雨衣下摆冻得发硬，把一个密封袋按在膝盖上，袋子外面缠了三层胶带，结都打在同一个位置。他说潮要人记住一块牌子上的编号，八位，前四位是水塔的号，后四位是检修牌自己的号。他不写，也不用笔，让你跟着他念，念到第三遍的时候他把密封袋打开一条缝，里面那块牌子锈了一圈，蓝漆只剩一角。他说这行编号他自己记得，可认得的人只剩一个，他怕哪天过闸机的时候被人从名单上划掉，这行就没人再说了。他问你能不能替他记住，记住就行，不要抄在本子上，不要报进任何系统。他说话一句一句往外挤，说的时候在看缝口结的冰，一直没有看你。他没有提到妹妹两个字，只在说到水塔的时候停了一会儿，停完接着念编号。风从缝里穿过来，袋子上的胶带被吹起一个角。',
      options: [
        { label: '跟着他念三遍，记在脑子里，不写下来', relation: 3, pass: true, flag: 'ap_yk_kept',
          after: '他让你自己复述一遍，第三遍你念完，他把胶带重新按平，结还是打在侧面。他说行。他把那块牌子塞回袋子，说这条缝他以后还会来，来的时候会按三下配电箱的铁壳。他走之前回头看了一眼缝口，那里的冰开始化了，水顺着外沿往下淌。' },
        { label: '记住编号，回去抄一份存档', relation: -1, pass: false,
          after: '他没有拦，也没有再打开袋子。他说抄下来也行，反正他明天就得消失。他把袋子重新缠好，缠得比刚才紧。你走出两百步回头，配电箱后面已经没有人，水珠还在往下滴，脚印被新结的霜盖住了。' },
        { label: '问这块牌子原来是谁的', relation: -2, pass: false,
          after: '他把袋子往怀里收了收，说不说这个。他把胶带的结解开又重打了一遍，打了一遍又一遍。你们在风里站了一会儿，最后他先走，走的还是来的时候那条线，脚印一个压着一个。' },
      ],
      grant: true,
      passLine: '这块牌子原来有两个人认得。现在就剩你一个了，你记住了。',
    },

    /* ============ 荀戒 · 环带巡检员 · 环带维修层 ============ */
    {
      id: 'ap-xun-jie',
      npc: 'xun-jie',
      title: '荀戒：第三十一格那道痕',
      when: { minRel: 4, minFolded: 3, minDay: 4 },
      text: '环带维修层的长廊结着冰，走一步要踢一下脚尖的霜。荀戒把巡检本摊在操作台上，翻到第三十一格那一页，页脚有一道手电磕过的印子，和本子别处的磨损不一样。那一格焊缝上有一道新痕，编号被磨掉一半，按本子这格三个月前就封过了。他照着手册念了一遍处置条款，念得很熟，一个字不差：异常上报要停整段环带，停一天下面三千人的水就断一天，结论栏必须填位移量，填完送复核科。他说这一段他念了十二年，从来没卡过。他把手电关了放在旁边，让你替他把那道痕重新量一遍，量完由你报数，他照你报的数写。你报出的数是零点四毫米，比规程里的判别值小一点。他照着写进结论栏，笔尖在那格上停了两次才落下去。写完他把本子合上，说明天这页要送复核科，这行字是他写的，最后填进本子的是他的编号。他让你记住这一页有两个人量过，报数的人是谁，他不写进去。',
      options: [
        { label: '报出实测的数，不写进任何记录，也不上报', relation: 3, pass: true, flag: 'ap_xj_measured',
          after: '他把本子夹进抽屉最底层，钥匙挂在操作台的钩子上，那钩子有一道旧弯。他说这道痕是他自己划的，划完就没打算报。他把手电推开给你，灯罩上那个磕痕在暗里也能摸出来。你走的时候他把长廊的应急灯留到了下一班。' },
        { label: '按规程报异常，停段处置', relation: -1, pass: false,
          after: '他在表上签了自己的编号，签完把笔横着放在本子上。他说停一天就是三千人的水，规程里写得明明白白，写规程的人不在这条长廊上。他拿着本子去了中控室，背对着你站到最后，手电没有带走。' },
        { label: '替他量，但要求他把这一页的修改报上去', relation: 0, pass: false,
          after: '他把本子翻回前一页又翻回来，来回翻了三次，最后合上。他说报上去这一格就归他一个人顶，他先想想。手电他留在操作台上，第二天值班记录里那页还是空的，一行新墨都没有。' },
      ],
      grant: true,
      passLine: '手册我念得比谁都熟。这一格报不进本子，我就认你量过的那个数。',
    },

    /* ============ 萨尔 · 潮的拾荒者 · 穹顶之外 ============ */
    {
      id: 'ap-sa-er',
      npc: 'sa-er',
      title: '萨尔：被收走的那块编号牌',
      when: { minRel: 4, minFolded: 3, minDay: 4 },
      text: '穹顶外壳的水顺着缝往下滴，滴在一块拆到一半的义体上，把编号冲得看不清。萨尔蹲在旁边用断头螺丝刀刮线路板，一条小腿肿着，没让人扶。她要你查一块编号牌的来路：这块牌子是上周有人从她窝里跟另外十几块一起收走的，编号后四位她在板上拓过一遍，拓片还贴在泵壳内侧。她要的不多，只要一个名字，号码就行，做什么用的、家里还有谁，她都不问。你去港区的报废登记里翻了两趟，第三趟在叉车保养记录的背面找到那行字，持牌人是个给回收场跑短途的司机，去年冬天车翻了，牌子按流程销号，销号单上签名那一栏是经办人的缩写。你把名字报给她的时候她正在给滤水泵换壳，手停了一下，接着拧螺丝。她说这个人她见过一面，替她挡过一次巡检。她把换下来的旧壳敲平，搁在牌子旁边，两个编号对在一起，差一位。她没问你要不要报酬，直接把泵推到你脚边。',
      options: [
        { label: '查到持牌人的名字，告诉她，不问用途', relation: 3, pass: true, flag: 'ap_se_found',
          after: '她把那块牌子用帆布包起来，包完压在水泵底下。她说这一块她不卖了，留着。她给你留了一个位置，就在侧门检修口外面那堆编号牌旁边，说以后要找人，先到这儿来看一圈。滤水泵的壳她换好了，划痕朝上晾着。' },
        { label: '查到名字，顺手把销号单的编号报上去登记', relation: -2, pass: false,
          after: '她把螺丝刀放下，说报上去这一块就完了，销号的东西回不来。她把牌子收进怀里，帆布裹得很紧。水泵她拎回去了，没有推给你。第二天她不在窝里，堆里留了一只空壳，划痕还是那几道。' },
        { label: '只查到柜段编号，说不清是谁', relation: -1, pass: false,
          after: '她把拓下来的那行字对了一遍，说柜段她自己也能查，她要的是名字。她把断头螺丝刀插回后腰，站起身的时候那条肿着的腿撑得很直。她朝壳里面走，走到一半回头说了一句，下次别带半份东西来。' },
      ],
      grant: true,
      passLine: '里面的人来过四个，没有一个把名字查到底。你查了，牌子给你。',
    },

    /* ============ 班头 · 回收场领班 · 回收场 ============ */
    {
      id: 'ap-ban-tou',
      npc: 'ban-tou',
      title: '班头：冻库第三箱里的东西',
      when: { minRel: 4, minFolded: 4, minDay: 5 },
      text: '回收场的制冷机把仓房压到零下，混凝土上结着一层白霜，踩过的脚印过一会儿就自己填平了。班头戴着一副磨白的皮手套，站在冻库门口，第三格的箱门锁着，封条是他自己贴的，日期比入库日期晚了三天。他说箱子里那批货是活的，抬进来的时候还有体温，登记簿上写的是空箱。他压了两个星期没报，工号核对过四遍，其中一个号到现在还挂在环带的排班上。他把钥匙从裤兜掏出来，搁在登记簿上，说巡检明天要来开库，钥匙现在交出去，交出去以后箱子里是什么就跟他无关；不交，明天开库的时候册子上经手那一栏写的是他的名字，二十一年的工龄一个人扛。他没有说他想怎么办，只说这两个晚上他一直在想那两天的班是谁排的。他把手套摘下来搭在把手上，食指那儿磨穿了一个洞。冷库门缝里有白气冒出来，落在地上化成一小片水，没人去擦。',
      options: [
        { label: '替他把这件事压住，钥匙交给保管，不上报', relation: 3, pass: true, flag: 'ap_bt_covered',
          after: '他把钥匙推过来，钥匙上拴着一张塑料牌，牌上的编号用记号笔描过两遍。他说钥匙放你这儿，箱门别开，巡检要是问到，就说钥匙在他抽屉里丢了。他把登记簿翻到空箱那页，在页角按了个指印，指印压在日期上。冷库的门关上以后，白气慢慢散了，仓房里只剩下制冷机的低鸣。' },
        { label: '劝他明天开库上报，先保自己', relation: -1, pass: false,
          after: '他把钥匙收回去，攥在手套里。他说上报也是一样，箱子里是人，写进册子就是回收流程的活体销毁，写谁的名字谁就得签。他把门锁上，转身去拉闸，仓房暗了一半，白霜在暗里泛着灰，他没再说话。' },
        { label: '不接钥匙，只答应去查这两天是谁排的班', relation: 0, pass: false,
          after: '他看着你，说排班表贴在值班室外的墙上，谁都能看，查出来也换不回那两个人。他把手套重新戴上，食指那个洞正好在关节上。冻库的锁他检查了两遍，第二遍只是拉了拉门把，锁没开。' },
      ],
      grant: true,
      passLine: '这箱东西我压了两周，没敢让第二个人知道。你知道了，也没往外说。',
    },

    /* ============ 无面 · 记忆银行柜员 · 记忆银行 ============ */
    {
      id: 'ap-wu-mian',
      npc: 'wu-mian',
      title: '无面：借一段记忆做对照',
      when: { minRel: 5, minFolded: 4, minDay: 6 },
      text: '记忆银行的柜台是冷的，玻璃后面只亮着一盏斜面灯，灯管修过，照得台面上没有影子。无面接过你的号单，读了上面的编号，又读第二遍，把单子翻过来在背面写了一行字，字很整齐，笔画比柜员该有的样子慢。它说它归档的时候发现一段记忆，归属人写的是它自己，可它不记得存过这一段。它不像这行业的人说话，讲到自己的时候一直用「无面」两个字，像在念一个别人的名字。它要的是做一次对照：把你的一段记忆临时调出来，跟那段记忆里同一个位置的画面比一比，比完立刻归还，不留副本；银行规程里这种操作要有一个在职编号做担保。它把担保栏推到你面前，说这一栏出了问题由担保人接。它还说了另一句：对照结束以后，它就有可能把那段不属于它的记忆取出来，取出来之后，柜台后面这个编号会空着，没人来补。斜面灯照在它脸上，看不出年纪。',
      options: [
        { label: '把记忆借给它对照一次，在担保栏签上编号', relation: 3, pass: true, flag: 'ap_wm_loaned',
          after: '对照用了四十七秒，屏幕上两段画面在同一格上重合，重合的地方是一片柜台，柜台上有一只手，手心的温度不对。它把记忆原样还回，归还单压在号单下面。它说这一段的编号它能记起来了，记起来之后它得决定要不要取出来。你走的时候斜面灯还亮着，柜台后面第一次有了影子。' },
        { label: '借，但要求先看那段记忆的归属人全档', relation: -1, pass: false,
          after: '它把档位调出来又关掉。它说归属人全档要主审批，批下来这段记忆就已经进了清柜流程。它把担保栏收回抽屉，抽屉推回去的时候磕了一下栏杆。号单还给你，背面那行字用橡皮擦掉了，纸面留着一条浅白的印子。' },
        { label: '不借，把号单收回来', relation: -2, pass: false,
          after: '它把号单推回来，纸角对得很齐。它说也是，担保这件事对担保人不划算。它继续读下一张单子，读了三遍编号。你的号单背面那行字被擦过，灯照上去，那条印子还在。' },
      ],
      grant: true,
      passLine: '无面借过别人的记忆，也借过别人的名字。你是第一个把记忆借出来还不要回的人。',
    },
  ];
})();

/* 十六人齐全：wen-duo / su-wen / yu-nanzhi / dai-siyuan / cheng-yan / peng-jian /
   lao-ya / lu-wan / tie-gui / yin-mian / wen-shicheng / yu-ke /
   xun-jie / sa-er / ban-tou / wu-mian */

/* ===== game/relation-events.js ===== */
/* 跨圈层关系事件：让十六个人之间真的互相牵扯。
   每条把一个公司内圈／技术圈／底层／港区／离城通道／边缘地带的人
   和另一个圈层的人连起来：text 是当场看到的那一层，reveal 是内情。 */
(function () {
  'use strict';

  window.RELATION_EVENTS = [

    /* 1. 公司内圈 ↔ 技术圈 */
    { id: 're1', a: 'su-wen', b: 'cheng-yan', district: 'lab',
      title: '三号项目签收栏空着的那一格',
      text: '研究所三号项目的验收会排在周三下午。程砚把样机推到台前，签收栏空着，笔横在纸上。她说这一栏需要排期系统里的人来签，不是研究所的人。苏纹到场时只带了一个文件夹，没有带任何仪器。她翻到签收页，看的时间比看样机长。她问程砚：这条线的上一个签收人是谁。程砚说是七年前的一个助理研究员，签完之后调去环带，档案在第二年注销。苏纹把文件夹合上，说这一栏今天先不签，她要回高塔核对一份旧排期。散会时程砚把笔留在桌上，没有带走。',
      reveal: '表面是研究所按流程找人签字。实际这一栏每填一次，就有一个签收人被安排进环带，程砚手上已经空过七格。苏纹不签不是守规矩，是在核对那个注销日期和自己本子上的一格。',
      options: [
        { label: '让程砚把上一任签收人的档案调给你看', run: { intel: 3, track: { sin: 1 } },
          after: '档案调出来了，只有一页，姓名栏被改过一次，改后的名字是一个编号。程砚站在你旁边，把那一页翻过去，说下面的不用看。你注意到她翻页的手很稳，稳得像在演示设备。你抄走那个编号，没有告诉她为什么抄。' },
        { label: '劝她这一栏干脆空着，别找人签', run: { track: { renown: 1, loyalty: -1 } },
          after: '程砚把笔收进口袋，说空着的栏三个月后会自动生成一个默认签收人，名单她控制不了。她说完就走，椅子归位，纸的边缘对得很齐。第二周的排期上，三号项目的验收会取消了，理由一栏写着材料未齐。' },
      ], bothMet: true },

    { id: 're2', a: 'wen-duo', b: 'peng-jian', district: 'lab',
      title: '钥匙盘第三格压着的那张纸',
      text: '闻铎到研究所盘点安保值守记录，一个月一次，例行公事。彭戬把钥匙盘端出来，十六个格子，只有第三格空着，格底还压着一张写了日期的纸。闻铎问这一格是丢了还是借出去了。彭戬说这一格从来没挂过钥匙，登记表上也没有这一格。闻铎把值守记录往前翻，翻到去年十一月，那一页多了一行手写编号，编号后面没有名字。他没有拍照，只把编号抄在自己笔记本的最后一页，然后问彭戬：研究所的排放名单是谁定的。',
      reveal: '表面是例行盘点。那行编号是闻铎女儿工号的前四位，他每天在高塔把她的号往后挪一格，现在发现它已先一步进了研究所的记录。彭戬看出了这一点，第三格才一直空着。',
      options: [
        { label: '抄下编号，去环带对巡检名册', run: { intel: 3, track: { sin: 1 } },
          after: '你在环带对上了名册，那一串编号对应的巡检员今年入册，工龄两年，姓氏和你一样。名册上没有照片。你把那一页抄下来，出来时彭戬正从楼上下来，看见你，点了点头，什么也没问。' },
        { label: '当着彭戬的面把登记表上的空格补齐', run: { track: { loyalty: 2, renown: -1 } },
          after: '你第三格补上，写明未挂钥匙，签了自己的名字。彭戬看着你写完，把表收进柜子，说这一格以后就按这样记。他送你到电梯口，临关门前说了一句：记录补上了，人也得补上。电梯下行，他没有动。' },
      ], bothMet: true },

    /* 2. 技术圈 ↔ 底层 */
    { id: 're3', a: 'cheng-yan', b: 'lao-ya', district: 'slum',
      title: '从灰市买回来的那台报废记录仪',
      text: '程砚出现在下层，穿研究所的通行外套，手里拎着一只空的仪器箱。老鸦把一台报废记录仪放在桌上，外壳有撬痕，编号被磨过。程砚没有开机，先看背面。她说这台不是她丢的那台，丢的那台上个月已经进了回收场。老鸦说明白，但还是让她把箱子和机器对上号，做成一笔干净的买卖。她付了钱，多给了一份，让老鸦三个月内不要在附近再出手第二台同样的机器。老鸦收了钱，第一次没有把编号写进规矩本。',
      reveal: '表面是旧设备买卖。程砚在回收三号项目的签收扫描件，让那七个名字不再有证据。老鸦不记编号，是因为他认得这台机器属于研究所哪个部门，也猜得到谁在替谁擦纸。',
      options: [
        { label: '问她为什么肯多付这三个月的钱', run: { intel: 3, chips: 1, track: { sin: 1 } },
          after: '她说那不是买，是封口费，按季度付比按次付便宜。她把空箱提起来，箱子比刚来时轻了一点。你送她到街口，她一次也没有回头。当夜，你店里那台同型号的报废机被人买走，买主没有留名字。' },
        { label: '把编号抄下来，但不写进规矩本', run: { track: { loyalty: -1, sin: 1 } },
          after: '你在纸上抄了编号，没往本子上落笔。三天后你发现最后两位和你记的不一样，你记的是被磨掉之前的那两位。你把纸烧了。那年冬天灰市又出了一台同型号机器，买家不是研究所的人，口音很生。' },
      ], bothMet: true },

    /* 3. 技术圈 ↔ 边缘地带 */
    { id: 're4', a: 'peng-jian', b: 'wu-mian', district: 'memory',
      title: '记忆银行柜台前那张调阅单',
      text: '彭戬排队到柜台，递进去一张调阅单，写的是研究所园区三号门十一月四日夜里那一段。无面看了很久，说不归它管，单子上的时段在它这一柜是空的。彭戬说那就取你们有的那一段。无面问他要取谁的记忆。彭戬说取我自己的。无面这才抬头，说取自己的要留一段做押，先报押哪一段。柜台上有本登记簿，翻开的这一页只写了三行，字迹不是同一个人。彭戬把手按在包上，他今天没带那盘钥匙。窗外排队的人往后退了半步，没有人说话。',
      reveal: '表面是安保总管来调监控。彭戬其实想让柜台取走他自己十一月四日那一段，把钥匙盘第三格的来历清掉，好在下一次有人问起时答得干净。无面看出了，所以先要押，押的正是他今晚最想处理的那段。',
      options: [
        { label: '不取自己的，改调三号门那一段', run: { intel: 4, track: { sin: 1, vitality: -1 } },
          after: '无面把单子推回来，说这一段在系统里不存在，能查到不存在的东西的人，只有写过它的人。你退出柜台，回研究所翻了三遍当天的记录，十一月四日后面那三页的纸比前后都新。你把钥匙盘从包里拿出来，又放了回去。' },
        { label: '按柜台规矩留下那段记忆', run: { intel: 2, track: { loyalty: 1, sin: 1 } },
          after: '你把钥匙盘放在柜台上，无面没有碰它，只让你报一个编号。你报了研究所的旧编号。它写下来，又划掉，说这段不用押。你走出记忆银行的时候天还没黑，回到研究所，你想不起钥匙盘第三格原先挂的是什么。' },
      ], bothMet: true },

    /* 4. 公司内圈 ↔ 底层 */
    { id: 're5', a: 'yu-nanzhi', b: 'lu-wan', district: 'slum',
      title: '诊所台面上那只磨白的硬壳文件盒',
      text: '清算行的人到下层只走一条路，不拐弯。郁南枝进诊所时手里拎着一只硬壳文件盒，盒角磨得发白。她把盒子放在台面上，说要用现金买一份伤情记录，不写姓名，不留副本。陆晚问她记录写给谁用。她说写给我自己。台面上有一盏小灯，灯罩上有一道旧裂，光正好照出盒盖侧面半行编号。陆晚翻登记本，翻到中间那页停住了，那页是空的。她没有问那半行编号是什么，只问伤在哪个位置。郁南枝把左袖卷到肘上，说这里。',
      reveal: '表面是清算行首席来买一份不写名的记录。实际郁南枝那块空白金额栏一直没填，她要用这份记录把自己在清算行的那一格先销掉，好给名单第九位留出余地。陆晚那页空着的登记本，等的也是同一个人。',
      options: [
        { label: '替她按下录入，把伤处记在无名项下', run: { intel: 2, money: 20, track: { sin: 1 } },
          after: '系统里生成了一条没有姓名的伤情记录，编号排在陆晚当月的第三十位。郁南枝付了现金，不要找零。她走后，陆晚把登记本那页翻过去，用铅笔在页边写了一个日期，又擦掉了。三天后清算行发来一份函，说该笔现金来源不明，暂不认定。' },
        { label: '告诉她这份记录撤不掉，另想办法', run: { track: { renown: 1, loyalty: -1 } },
          after: '你把系统里的旧痕翻给她看，同一年还有两条被改过的记录，改动者的工号都是同一个。郁南枝看了很久，把文件盒重新扣好，说不买了。她走出诊所时把袖口放下来，走姿比进来时慢。第二周，清算行那份空白金额栏被人填上了，填的是一笔无名支出。' },
      ], bothMet: true },

    /* 5. 公司内圈 ↔ 港区 */
    { id: 're6', a: 'dai-siyuan', b: 'tie-gui', district: 'docks',
      title: '吊机下翻出来的三年前那份例外',
      text: '合规复审的通知提前一天送到港区，落款是戴思远。铁贵把账本摔在桌上，说查就查，工人的劳保凭什么查三遍。戴思远没有翻账本，先要三年前那份合规例外的原件。铁贵从抽屉最底下抽出文件夹，纸边发黄，第八页有一处签名，签得很小。戴思远看那个签名看了很久，比自己当初签字那次还久。他问那笔劳保现在还在不在发。铁贵说在发，按月发，收款人两个，工号都是注销过的。',
      reveal: '表面是合规复审劳保支出。实际那份例外批复是戴思远三年前签的，他一直在替这笔钱遮。他这次亲自跑港区，不是来查账，是来看那两个工号还在不在发放名单上——只要还在发，他那页例外就还没有坏。',
      options: [
        { label: '让他把例外原件收进卷宗，如实上报', run: { intel: 3, track: { loyalty: 2, renown: -1 } },
          after: '卷宗编号补齐后送进合规部。铁贵当天夜里把港区的劳保发放表全部换成了新的，旧表烧了。戴思远收到回执，在签收人一栏写下自己的名字，写完停了一会儿才放下笔。此后港区每月多出一笔没有收款人的支出。' },
        { label: '当面问他这一页当初是谁要他签的', run: { intel: 4, track: { sin: 1, loyalty: -1 } },
          after: '戴思远没有回答，把原件推回给铁贵，说这份不在本次复审范围里。他走出仓库时，港区的广播正在报当班人数，数字比昨天少了两个。第二天他的办公桌上多了一份手写的名单，十三个人，第一个是他自己的名字。' },
      ], bothMet: true },

    /* 6. 公司内圈 ↔ 离城通道 */
    { id: 're7', a: 'su-wen', b: 'wen-shicheng', district: 'orbit',
      title: '票闸前那张留了三年的实名票',
      text: '温仕成在轨道港的窗口后面坐了一整天，桌上只有一张票。苏纹来时没有排队，直接走到窗口前，把一张排期单推进去。单子上只有一栏，票号后四位和温仕成桌上那张对得上。她问这张票是谁订的。温仕成说订票人那一栏是空的，系统里也没有记录，票是他自己留的。苏纹把单子收回来，说这一栏不该空着，空着的票最后都会算到排期的人头上。温仕成笑了一下，说他留了三年，一次也没卖。',
      reveal: '表面是日程官来核一张没卖出去的票。实际票的订票人一栏写着苏纹的旧编号，而她档案里的状态是「已回收」，名字不该再出现在任何系统里。温仕成留着这张票，是一直在等一个认得那串编号的人来问。',
      options: [
        { label: '把票买过来，买断那一栏', run: { money: -60, intel: 2, track: { sin: 1 } },
          after: '你付了票面价的一半，温仕成把票推给你，没有开收据。回执上订票人那一栏被涂掉了，涂得很平。你走到票闸前试了一次，闸机没有响，也没有放行。温仕成在后面说了一句：这张票不认人。' },
        { label: '什么都不买，把排期单留给他', run: { intel: 3, track: { renown: 1 } },
          after: '你把排期单留在窗口，转身走了。温仕成立刻把单子收进抽屉最里面。三个月后你再去轨道港，那张票还贴在窗口内侧，纸边已经翘起来，票号的后四位被雨水泡得看不清了。' },
      ], bothMet: true },

    /* 7. 公司内圈 ↔ 边缘地带 */
    { id: 're8', a: 'yu-nanzhi', b: 'ban-tou', district: 'salvage',
      title: '入库单上多出来的一行小号字',
      text: '清算行的车开进回收场，压过一层碎玻璃。郁南枝没有要人陪同，只让班头把最近三个月的入库单搬出来。她一份一份对，对到某一页时停住了，问第三箱货现在在哪。班头说在冻库，压了两周，还没报。郁南枝把单子平放在桌上，指着日期旁边的一行小号字。那行字是和入库单一起打出来的，不是手写的。班头低头看，看完什么也没说，把冻库钥匙从腰上解下来，放在桌上。',
      reveal: '表面是清算行来核已回收资产的入库。实际郁南枝在找箱单第九行那个编号，那是她自己的号，已经预印在下一批回收单上。班头压着不报不是懒，是他开箱时看见了活人，也看见了那行字。',
      options: [
        { label: '拿钥匙开箱，先看清里面是什么', run: { intel: 4, gear: 1, track: { sin: 1 } },
          after: '冻库第三箱里有三个人，穿着回收场的防尘布，还活着。你退出来时把箱门重新锁好。郁南枝站在门口没有进去，只问了一句：第九行是不是在里面。你说没有。她把钥匙收进自己口袋，说这一趟她会记成「货箱未开」。' },
        { label: '把入库单收走，替班头压下去', run: { track: { loyalty: -1, renown: 1 } },
          after: '你把那份入库单折好带走。班头把钥匙重新挂回腰上，说这批货他还能压三天。两天后清算行发来一份补单，要求第三箱在本月内结清，补单的经手人一栏是空的。班头把那张补单压在冻库门后面，一直没动。' },
      ], bothMet: true },

    /* 8. 技术圈 ↔ 港区 */
    { id: 're9', a: 'peng-jian', b: 'tie-gui', district: 'docks',
      title: '港区夜里那台走班的货梯',
      text: '港区三号货梯夜里在动。研究所的报废件按合同只能走陆运，可这一批挂的是装卸工会的班次。铁贵把出库单递给彭戬，品名一栏写着「钢结构件」，重量比两星期前那一批重四十公斤。彭戬只查两件事：箱封号和人证。他要求开箱。铁贵说开箱要工会的人在旁边，人不齐，明天再说。彭戬说明天这一批就过清关口，开不了。两个人在货梯前站了很久，电梯的指示灯停在二楼，一直没动。',
      reveal: '表面是工会替研究所走货。实际箱里是研究所锁具间的旧钥匙盘，彭戬要用工会的货梯把第三格空位的东西换出去，铁贵要这批件走完，好把工会账上少的那笔钱平掉。两个人各有一笔账，都指望这一趟车。',
      options: [
        { label: '让铁贵开箱，按封号逐件对', run: { intel: 3, track: { sin: 1 } },
          after: '箱开了，里面是三十六只旧锁芯，编号全部磨平。彭戬数了两遍，数目对得上，签了放行。铁贵在出库单上补了一行：开箱验收，无差异。那天夜里工会账上少的那笔钱被记成了「件损」，数目正好。货梯停在二楼又停了很久。' },
        { label: '把开箱报告直接递到合规部', run: { track: { loyalty: 2, renown: -1 } },
          after: '报告送上去，合规部压了九天，回条写「经核，品名与实物一致」。那批件照样过了清关口。铁贵第二天把货梯班次表重排了一遍，研究所的名字从表上消失。彭戬的钥匙盘第三格还是空的，锁芯换了一批新的。' },
      ], bothMet: true },

    /* 9. 技术圈 ↔ 离城通道 */
    { id: 're10', a: 'cheng-yan', b: 'yu-ke', district: 'orbit',
      title: '卸货坡道上换掉的那只传感器',
      text: '轨道港后门有一段卸货坡道，白天封着。程砚等在坡道边，手上是一只装满冰袋的箱子，要换一只从外面带进来的旧传感器。雨客来时鞋上还有烧灼痕，把传感器放在坡道边，没有递过来。他先问箱子里是什么。程砚说冰袋。雨客说他要看。程砚打开箱盖，冰袋底下是两张签收页，纸边发黑。雨客看完，把传感器推过去，收下了箱子，没有要钱。他走之前说了一句：以后不要再夹纸。',
      reveal: '表面是研究所私下换零件。程砚其实要把三号项目那七张签收页运出穹顶，让它们在雨里烂掉。雨客要箱子不要钱，因为那两张纸上有他认得的号段——他妹妹的工牌上就是那一段。',
      options: [
        { label: '追问他那个号段和他妹妹的关系', run: { intel: 4, track: { sin: 1 } },
          after: '雨客没有回答，把冰袋解开，把签收页折进工牌后面。坡道尽头的卷帘门降下一半，他弯着腰过去。你看见他口袋里工牌的边角，号段和纸上的一样。第二天坡道上多了一批新传感器。' },
        { label: '替他把那段号子抄一份留下', run: { intel: 2, track: { renown: 1 } },
          after: '你抄下号段，雨客看着你抄，抄完他自己又划了一遍。他说这个号段的人不止他妹妹一个。三个月后，轨道港的排班表上多了一个没有名字的夜班岗，岗位上不挂工牌。' },
      ], bothMet: true },

    /* 10. 底层 ↔ 港区 */
    { id: 're11', a: 'lao-ya', b: 'yin-mian', district: 'docks',
      title: '灰市桌上被扣下的第九块工牌',
      text: '银面到灰市从来不报名字。那天她要一批旧工牌，说是替人收的，价钱按块算。老鸦把她挑出的十七块摊开，一块一块看号段，看到第九块时停住了。那块牌的号段和他规矩本第一页写的一串数字连得上。他没有多问，只把那一块拿开，说这块不卖。银面问他凭什么。老鸦说这块牌上的人还在上班，牌是补发的，补发的人不姓这个姓。银面把手收回袖子里，说那就十六块。',
      reveal: '表面是替人收旧工牌。银面在凑一张名单，要凑齐一整段号段，才能把穹顶外面的人算进城里。老鸦扣下那块，是因为那段号段的最后一格写着苏纹，那是他记了三十年的一个恩。',
      options: [
        { label: '让他把第九块牌的来历说清楚', run: { intel: 4, track: { sin: 1 } },
          after: '老鸦翻开规矩本第一页给你看，那串数字后面有一个日期，日期是二十五年前。他说那天有人替他垫过一笔医药费，名字他到现在没问过。银面把十六块牌收好，临走回头看了一眼那个本子。' },
        { label: '劝他把整批都卖给她', run: { money: 30, track: { loyalty: -1 } },
          after: '老鸦接了这单，十七块牌全过手，你分了两成。半个月后，城里多出一批查不到的旧工牌在读卡口刷过。老鸦把规矩本第一页撕下来烧了，第二天换了一本新的，第一页空着。' },
      ], bothMet: true },

    /* 11. 底层 ↔ 离城通道 */
    { id: 're12', a: 'lu-wan', b: 'sa-er', district: 'slum',
      title: '诊所台面上那半包白色的盐',
      text: '萨尔进城只为了拿药。她从穹顶外的接口爬进来，落地时膝盖磕在管道上，伤口已经开始发白。陆晚给她清理的时候没有问她从哪来。药是两瓶旧的抗生素，标签上的字被雨泡过。萨尔要付的是她身上唯一带进城的东西：一小包灰白色的粉，说是外面晒出来的盐。陆晚看了那包盐很久，最后收下半包，说剩下半包留给她自己止血。萨尔走之前问：城里的人是不是都不用这种盐。',
      reveal: '表面是外面的人拿盐换药。实际那包粉是回收场烧过的灰，萨尔从灰堆里捡的，想拿进城验一验里面有没有她要找的人。陆晚收下，是因为她认得这个颜色——上一批被回收的人，最后也是这个颜色。',
      options: [
        { label: '陪她把那半包盐送去化验', run: { intel: 3, track: { sin: 1 } },
          after: '化验只出了一行：无机盐，含微量金属。没有人名，没有编号。萨尔把报告折好塞进衣领，说她母亲最后一次进城是七年前。你把报告抄了一份，夹进诊所那页空着的登记本。' },
        { label: '替她把两瓶药都付掉', run: { money: -20, track: { renown: 1 } },
          after: '你把两瓶药的钱都补上。萨尔把药按在胸口，从通道爬出去时回头看了两次。之后每次下雨，诊所门口的台阶上都会多一小堆白色的盐，一直堆到入冬。' },
      ], bothMet: true },

    /* 12. 边缘地带 ↔ 公司内圈 */
    { id: 're13', a: 'xun-jie', b: 'su-wen', district: 'ring',
      title: '巡检本第三十一格那道划痕',
      text: '环带巡检本每月上交一次，最先送到苏纹桌上。荀戒这本交到第七页，第三十一格有一道划痕，比别的格子深。苏纹翻到那页，用指甲压了压，问这一格是谁划的。荀戒说笔尖蹭的。她说蹭不出这么深，墨都透到纸背了。她翻回前一页对编号，对完再翻回来，合上本子还给他，说不用重抄，这一页就这么留着。荀戒接本子时手指在封面角上停了一下。走廊尽头的安全门被风吹得响了一声，两个人都没有回头。',
      reveal: '表面是日程官过目巡检本。第三十一格原写的编号属于闻铎的女儿，那道痕是荀戒亲手划的。苏纹不让他重抄，是留着这道痕当证据。',
      options: [
        { label: '让他把那一格重抄，划痕就没了', run: { intel: 3, track: { sin: 1 } },
          after: '荀戒照着重抄，抄完那一格干净得像没人来过。你留下他抄废的那页，折进袖子里。三个月后你拿这页去对环带名册，名册上第三十一行已经空了，纸面同样干净得可疑。你把两页并在一起看，才发现空缺的位置分毫不差。' },
        { label: '把本子带回机房，自己先拍一份', run: { track: { sin: 1, loyalty: -1 } },
          after: '你把本子带进高塔机房，拍完照片再还回去。还的时候荀戒已经在楼下等，他把本子翻到第三十一格看了看，说这一页有人动过。他说这话时没有生气，只是把本子换到另一只手上拿，走的时候步子比来时稳。' },
      ], bothMet: true },

    /* 13. 边缘地带 ↔ 底层 */
    { id: 're14', a: 'xun-jie', b: 'lu-wan', district: 'ring',
      title: '卡口铁皮屋后面那个没有记录的人',
      text: '环带卡口的铁皮屋后面蹲着一个人，腿上缠着已经发黑的布。陆晚是被叫来的，她拎着药箱走过来，没有问那人是怎么伤的。荀戒站在三步外，手按在巡检本上，说这个人没有进环带的记录，按规程不能带走。陆晚说不用带走，她在这儿就能处理，处理完他自己会走。她蹲下去解布，荀戒把本子翻开又合上。最后他退到卡口的灯下面，说给她二十分钟，过了灯就熄了。灯把两人的影子拉得很长，一直压在铁丝网上。',
      reveal: '表面是巡检员拦一个没有记录的人。那人其实是从回收场跑出来的，荀戒认得他布上缝的编号。他给二十分钟，是等陆晚把伤处理干净，好让这人自己走回下层去。',
      options: [
        { label: '问他为什么不照规程上报', run: { intel: 4, track: { sin: 1 } },
          after: '荀戒说上报之后人不会走回下层，会被记成环带遗失件，编号进回收清单。他把本子第三十一格翻给你看，那格是空的。你记下编号，出了卡口就把纸撕碎，碎纸扔进路边的排水口，看它顺着水走了很久。' },
        { label: '替他把这一趟卡口记录补上', run: { track: { loyalty: 2, renown: -1 } },
          after: '你在巡检本上添了一行过卡记录，写的是当日遣返。荀戒看着你写完，把本子按在胸口收好。第二天清晨，卡口后面的铁皮屋被人拆掉了，地上只剩一圈油迹和两枚拧下来的螺丝。' },
      ], bothMet: true },

    /* 14. 公司内圈 ↔ 港区 */
    { id: 're15', a: 'wen-duo', b: 'yin-mian', district: 'docks',
      title: '港区库房尽头那口没上锁的空箱',
      text: '闻铎去港区核对一份资产清单，走到库房尽头时，一口空箱敞着，锁扣是新换的。银面正站在箱子旁边，把袖子往上拉。她说这口箱是替人暂存的，里头本来有东西，昨天取走了。闻铎问取件人签了什么。她说签了一个号。闻铎把清单翻到最后，那一栏的资产编号后四位，和他本子上每天往后挪的那一格对得上。他合上清单，说这一项他记成已核。银面看着他，没有道谢。',
      reveal: '表面是监事来核资产。箱里原先是银面攒的旧工牌，收件人号段正是闻铎女儿的工号。闻铎记成已核，是他第一次没有把女儿的号往后挪。',
      options: [
        { label: '把这一项如实写成缺失', run: { intel: 4, track: { sin: 1, loyalty: -1 } },
          after: '你在清单上写了缺失，编号照抄。银面把箱盖合上，说这样写也行，反正她手里还有第二批。三天后港区的资产台账少了一页，缺失项一个不剩，补录的日期栏是空白的，连经手人都没写。' },
        { label: '让她把签的那个号抄给你', run: { intel: 3, chips: 1, track: { sin: 1 } },
          after: '她报了一串数字，前四位和你知道的一样，后两位没见过。你抄在清单背面。她把袖子放下来，从库房后门出去，门没有关严，风把清单从桌上吹下来，捡起来时多了半页没人写过的空白。' },
      ], bothMet: true },

    /* 15. 公司内圈 ↔ 边缘地带 */
    { id: 're16', a: 'dai-siyuan', b: 'wu-mian', district: 'memory',
      title: '柜台前叠齐的那两份调阅单',
      text: '合规例行抽查轮到记忆银行。戴思远带了两份调阅单进门，日期不同，柜员号是同一个。无面把登记簿推出来，翻到那两页，说这两回取的不是同一个人。戴思远问押了什么。无面说押的是取件人自己的一段。戴思远把单子收起来，问柜台有没有留下押品的编号。无面说押品不进编号，只有取件人自己记得。柜台外面队伍往前挪了一格。戴思远没有让后面的人等，他退开半步，把两份单子叠齐，折成一样宽。',
      reveal: '表面是抽查记忆银行的调阅留痕。两回的取件人都是戴思远自己，他三年前用同一段记忆押过两次，想弄清他签的那份例外有没有被人改过。无面早就认得这个柜员号。',
      options: [
        { label: '让他把两次的押品档案调出来核', run: { intel: 4, track: { sin: 1 } },
          after: '档案只有一页，押品一栏写着「已归还原件持有人」。戴思远看了很久，说他记得押的是别的。无面把那一页收回去，说记忆银行只记数量，不记内容。你走的时候柜台上的灯换成了暖色的，登记簿翻在新的那一页。' },
        { label: '劝他别再取自己那一段', run: { track: { loyalty: 2, renown: -1 } },
          after: '戴思远把单子折起来塞进内袋，说他这不是第一次被人这么劝。他走出记忆银行时在台阶上站了一会儿，才把车叫来。那两份调阅单后来没有进卷宗，合规部当月的抽查报告上，记忆银行一栏写着「无异常」。' },
      ], bothMet: true },

    /* 16. 离城通道 ↔ 边缘地带 */
    { id: 're17', a: 'wen-shicheng', b: 'ban-tou', district: 'salvage',
      title: '出城货单上重量对不上的那一格',
      text: '回收场有一批冻品要出城，走的是引航票务的通道。温仕成拿着货单来对数，看到第三格时停住了，重量比上一次少了十四公斤。班头说冻库抄表的时候掉了一格电，那天的秤不准。温仕成没有争，把货单倒过来看背面，问这一批里有没有按件计的。班头说有三件。温仕成把三件圈出来，说按件计的不用过秤，改走人工验收，走完再补一张核对联。班头把手套摘下来，放在秤台上，说行。',
      reveal: '表面是票务掮客来核出城的货重。那三件按件计的货里有两件是空的，班头要借引航的通道把冻库里的活人送出去。温仕成圈出这三件，是给它们换一条不需要过秤的路。',
      options: [
        { label: '按他圈的三件改走人工验收', run: { intel: 3, money: 20, track: { sin: 1 } },
          after: '三件货贴上人工验收的标签，当天夜里出了回收场。你分到的是押运的跑腿钱。第二天秤台被重新标定过，贴了张新的检定条，检定员一栏的字迹和温仕成货单上的批注是同一支笔。' },
        { label: '把重量对不上的那一格如实写上', run: { track: { loyalty: 2, renown: -1 } },
          after: '你在货单上照实填了少十四公斤，还签了自己的名字。温仕成把单子收好，说这一趟不走引航的通道了。班头什么也没说，把冻库的第三箱挪到最里面。三天后那批货从另一个口出去了，单子上没有人签字。' },
      ], bothMet: true },

    /* 17. 离城通道 ↔ 边缘地带 */
    { id: 're18', a: 'sa-er', b: 'xun-jie', district: 'outside',
      title: '环带外侧那道被人剪开的铁丝网',
      text: '环带外侧有一段铁丝网，剪口很新。荀戒巡线到这里时，萨尔正蹲在网后面，把一只铁桶掉了个方向。她先开口，问他哪个。荀戒说环带巡检。萨尔说那正好，问他城里现在收不收湿的盐。荀戒把手电往下压了压，没有照她的脸，说这一段的网他明早补。萨尔把铁桶推进网下的缝里，说桶里是石灰，防水用的。两个人都看着那只桶，谁也没有伸手。风吹过来，铁桶里传出一点很轻的响动。',
      reveal: '表面是巡检员撞上从外面进来的人。桶里装的不是石灰，是萨尔从外面带进来的两段旧管道，管口刻着编号，全是环带里失踪的巡检员的。荀戒不照她的脸，是因为他认出了其中一段。',
      options: [
        { label: '按流程把这一段写进巡检记录', run: { intel: 3, track: { loyalty: 2, sin: -1 } },
          after: '你写明环带外侧铁丝网破损，建议次日修补。萨尔看着你写完，把铁桶抱起来往坡下走，走到一半回头说了一句：城里的人写字比说话多。第二天网补好了，补的那一格比左右的都亮。' },
        { label: '先把桶里的东西倒出来看一眼', run: { intel: 4, track: { sin: 1 } },
          after: '桶口倒出来的是两段旧管，管壁上有环带的刻号。萨尔没有拦你，只说这两段她捡了半年。你抄下刻号，把管塞回去，替她把铁桶滚到网下。她走时没有再问你哪个，坡下的灯一直亮到她走出视线。' },
      ], bothMet: true },

    /* 18. 技术圈 ↔ 边缘地带 */
    { id: 're19', a: 'peng-jian', b: 'xun-jie', district: 'ring',
      title: '环带仓库门口少掉的三把旧锁',
      text: '研究所的老仓库在环带边上，门锁每季度由安保换一次。彭戬带了三把新锁来，荀戒在门口登记。登记簿上这一格写着旧锁十一把，拆下来数完只有八把。荀戒把数字写在格子里，抬头看彭戬。彭戬说少的那三把在去年那次搬迁里报损了，损单在研究所。荀戒问损单编号。彭戬报了一个号，报得很快。荀戒没有抄，只把格子里的八改成十一，签了名。换下来的锁堆在门边，谁也没有数第二遍，风从环带外面吹进来，锁上的灰浮了一层。',
      reveal: '表面是研究所按季来换门锁。少的那三把锁的齿形来自环带，是彭戬给自己留的退路。荀戒把八改回十一，从这一笔起替研究所记假账。',
      options: [
        { label: '问他那三把锁的损单编号是从哪记来的', run: { intel: 4, track: { sin: 1 } },
          after: '他说得比上一次慢，中间停了一次。你回去查研究所的报损台账，那一栏写的是十一把，编号对得上，只是签收人的笔迹和彭戬报号时的笔迹不一样。你抄下编号，没有往上送。当晚老仓库换了新锁，钥匙盘第三格第一次挂上一把带齿的小钥匙。' },
        { label: '让他按八把如实登记，损单的事不追', run: { track: { loyalty: 2, renown: -1 } },
          after: '荀戒在格子里写了八，把本子合上，说这样写他月底要多跑一趟环带解释。彭戬没有拦他。第二天巡检本发下来，那一格被人重新描过，八写成了十一，描的笔是研究所配发的。荀戒看了一眼，把本子收进包里，没有提这件事。' },
      ], bothMet: true },

    /* 19. 离城通道 ↔ 公司内圈 */
    { id: 're20', a: 'yu-ke', b: 'dai-siyuan', district: 'orbit',
      title: '坡道上那张被雨泡开的旧回执',
      text: '轨道港后门的坡道上积了水。戴思远来取一份三年前的回执，原件本应存在港区的档案室，现在只剩一张被雨泡开的纸。雨客把它从坡道边捡起来，压在石头上。他说这张纸是他从外面捡回来的，纸上有他们那边的人的名字。戴思远没有接，蹲下去看，看到第一行的编号后面跟着一个名字。他问雨客认不认识这个名字。雨客说认识，是他妹妹。水把纸边泡得起毛，字还在。戴思远把纸折了两折，装进内袋，膝盖上留下两块湿印。',
      reveal: '表面是审查官来补一份丢了的旧回执。那份合规例外是戴思远三年前自己签的，名单上第一个名字就是雨客的妹妹。纸一直在雨客手上。',
      options: [
        { label: '问他为什么要把这份纸亲手收走', run: { intel: 4, track: { sin: 1 } },
          after: '戴思远说他签过的每一份例外三年后都会被抽查，纸在他手里，抽查就抽不到。他说话时一直在看坡道上的水。你记下回执编号，回去翻合规部的旧卷，那一卷里这份确实是缺的，缺的那一格贴着补录标签，日期写的是三年前。' },
        { label: '劝雨客这份纸不要交出去', run: { track: { renown: 1, loyalty: -1 } },
          after: '雨客把纸重新压回石头下面，说他留了三年，就是在等一个肯蹲下来看的人。戴思远走到坡道口时停了半步，没有回头。三天后港区档案室补了一份复印件，签名栏是空的，原本至今还压在坡道边那块石头下面。' },
      ], bothMet: true },

    /* 20. 边缘地带 ↔ 港区 */
    { id: 're21', a: 'xun-jie', b: 'tie-gui', district: 'docks',
      title: '吊机下面多出来的两顶安全帽',
      text: '港区清关那天要清点人数。铁贵把当班的工牌挂了满满一排，三十七块，比排班表上多两块。荀戒是随进出口核验来的，他数了两遍，问多出来的两块是谁。铁贵说那是代班的，代班不记名。荀戒说代班也得有号。铁贵把两块牌翻过来，背面是空的，他说这两块牌挂在这儿挂了三年，一直在发劳保。荀戒没有再问，把手电收进腰袋。吊机在两人头顶上转过去，绳子绷得很紧，没有人抬头。',
      reveal: '表面是随行核验人数。那两块空牌对应工会账上已经注销的两个工号，人死了三年，劳保按月照发。荀戒收手电不再问，因为他在环带见过同样的一排空牌。',
      options: [
        { label: '把那两块牌的挂绳取下来看背面', run: { intel: 4, track: { sin: 1 } },
          after: '背面没有字，只有两道被汗浸过的印子，印子的形状和正面的号位对得上。你记下那两格的位置，回去查工会的劳保发放表，两个工号的发放日期都是每月十五号，从未间断。铁贵把挂绳接过去重新挂上，说你查不出什么的。' },
        { label: '让他把代班的号补进清关表', run: { track: { loyalty: 2, renown: -1 } },
          after: '你把清关表上的人数改成三十九，代班那一栏写「当班补录」。铁贵在表格末尾按了个手印，按得很重。清关那天下午，港区广播报的当班人数是三十九，排班表上少的那两个数这一次没有出现。' },
      ], bothMet: true },

    /* 21. 公司内圈 ↔ 离城通道 */
    { id: 're22', a: 'yu-nanzhi', b: 'yu-ke', district: 'orbit',
      title: '夜班窗口退回来的那件旧货',
      text: '轨道港的夜班登记处只开一扇窗。郁南枝来的时候带的是清算行的封条和一张出入凭证，她要核一件从港区退回的旧件。雨客把东西从坡道那头提过来，放在窗台上，没有拆封。郁南枝先看封条，再对凭证上的编号，看到第三行时手指停住了。她问这件是哪个口退回来的。雨客说后门那个口。她把凭证折回去一半，说这件不用核了，退件理由那一栏她自己来填。窗台上的灯照在封条上，胶面有一层细灰，谁也没有伸手去碰。',
      reveal: '表面是清算行按封条核一件退件。旧件里是程砚塞出去的签收页，早被雨水泡烂。郁南枝认出自己的编号就在第三行，这一笔她打算自己填成误退。',
      options: [
        { label: '问她为什么忽然不用核了', run: { intel: 3, track: { sin: 1 } },
          after: '她说凭证上的收件栏是空的，空栏的件不进清算，只能记失。她把封条撕开一半又按住，最后整个撕了。雨客看着她撕，什么也没问。你抄下编号。回高塔第二天，清算行的台账上多了一笔无主退件，金额栏是空的，经手人一栏也没有落笔。' },
        { label: '把退件理由照实写成货物损坏', run: { track: { loyalty: 2, renown: -1 } },
          after: '你把理由写成货物损坏，签了自己的名字。郁南枝把凭证收进内袋，说这样填清算行会派人来验。三天后验证的人到了轨道港，验的是另一件货，编号对不上。她把那份写了损坏的凭证压在办公桌玻璃下面，一直没有归档。' },
      ], bothMet: true },

    /* 22. 底层 ↔ 离城通道 */
    { id: 're23', a: 'lao-ya', b: 'wen-shicheng', district: 'slum',
      title: '灰市柜台上那张过期的旧票根',
      text: '温仕成到灰市从来不买件，只买票。那天他向老鸦要的是一张过期的旧票根，纸面上还留着半个印。老鸦翻规矩本，说票根这种东西他不收。温仕成把三张钞票压在柜台上，说不是收，是换。老鸦问换什么。他说换一句真话，关于二十五年前那张票是谁先退的。老鸦把钱推回去，从柜台底下摸出一张票根，说这张不要钱，要的是你告诉我，退了票的人后来去了哪。柜台上那盏灯有点低，两个人的影子都压在纸上。',
      reveal: '表面是票务掮客来换一张旧票根。票根上的退票人名字是苏纹，老鸦留了三十年，为的是还一笔恩。温仕成来问，是因为他手上那张留了三年的实名票也是同一个号段。',
      options: [
        { label: '替他把那句真话说出来', run: { intel: 4, track: { sin: 1 } },
          after: '你说退了票的人还在发牌，名册上没有她的名字。老鸦把票根按在柜台上，说你不用再往下说了。他把规矩本翻到第一页，那一页的字迹很久没有变过。温仕成把三张钞票收回去，什么也没带走，走出灰市时天刚亮，柜台上的灯还亮着。' },
        { label: '让他把票根换给温仕成', run: { money: 40, track: { loyalty: -1 } },
          after: '老鸦收了钱，把票根推过去，又用指甲在印痕上划了一道。温仕成拿走票根，回轨道港后把它贴在自己窗口内侧，和那张留了三年的实名票并排。半个月后你路过那扇窗，两张纸都有了折痕，深浅和位置一模一样。' },
      ], bothMet: true },

    /* 23. 港区 ↔ 边缘地带 */
    { id: 're24', a: 'yin-mian', b: 'wu-mian', district: 'docks',
      title: '当铺里那块磨掉号段的旧牌',
      text: '银面到港区边上的当铺不是为了当东西，是要赎。她拿一块磨掉号段的旧牌，要换柜台后面压着的一只小盒子。无面那天不在记忆银行，它在当铺后间歇脚，盒子是它自己放在那里的。它接过旧牌翻过来看背面，说这块牌上没有号，物不对账。银面说号磨掉了，盒子上有。无面看了她很久，问盒子里是她自己的东西还是别人的。银面说，是它自己的。两个人都没有再说话，当铺的挂钟走了一格，门外的装卸铃响了一遍。',
      reveal: '表面是港区当铺里一次赎当。盒中存着银面自己的编号，她记不住自己是谁，全靠这件东西。无面说盒子是它的，因为它也快记不住柜台后面那个自己了。',
      options: [
        { label: '让无面把盒子打开，先看里面是什么', run: { intel: 4, track: { sin: 1 } },
          after: '盒里是一张对折的薄纸，纸上只有一串数字，没有名字。无面看了一眼就把盒子合上，说这串它见过，在同一批押品里。银面把旧牌留在柜台上，没有要盒子。挂钟又走了一格，当铺的门帘被风拉了一下，之后就没有再动过。' },
        { label: '劝她把盒子留给当铺，别赎了', run: { track: { renown: 1, loyalty: -1 } },
          after: '银面把旧牌收回袖子里，说这一件她下个月还会来。无面把盒子重新压到柜台底下，压得比原先深。你出了当铺往港区走，身后那盏灯灭了又亮。三个月后你再来打听，柜台后面换了人，没有谁记得那只盒子。' },
      ], bothMet: true },

  ];
})();

/* ===== game/event-gates.js ===== */
/* ==========================================================
   事件触发条件表
   200 条事件原本一条条件都没有，第 1 天就可能抽到本该后期才
   发生的事。这里把条件集中成一张表，改条件只动这一个文件，
   不用去翻四个上万行的大内容文件。

   字段说明（全部可选，缺省即不限制）：
     t     配重档：1 轻 / 2 中 / 3 重。早局偏爱轻事件，越往后
           重事件权重越高（engine.evWeight）。
     d     最少第几天才出现。
     D     最迟第几天还可能出现，过期不再出。
     f     最少折掉几张牌才出现。
     F     最多折掉几张牌还可能出现。
     a     限定在第几幕（1-5）。
     w     硬条件，走剧情层那套条件族：
             { track: { sin: [5, 99] } }  罪痕至少 5
             { stat:  { intellect: [8,99] } }
             { have:  ['flagA'] } / { not: ['flagB'] }

   写法约定：条件只写「这条为什么还不能出」，不要写多余的限制。
   事件池里永远保留足够多的可抽项，全部抽满会重开一轮。
   ========================================================== */
(function () {
  'use strict';

  /* ---------- 一、原生 14 条：开局就有，默认轻事件 ---------- */
  var GATES = {
    e1:  { t: 1, d: 1, D: 4, f: 0, F: 2 },       // 一个孩子递来信封
    e2:  { t: 2, d: 2, f: 1 },                    // 监事会请你喝茶
    e3:  { t: 2, d: 2, f: 1 },                    // 旧日同事的葬礼
    e4:  { t: 1, d: 1, D: 6 },                    // 午夜，交易所有一份错单
    e5:  { t: 2, d: 3, f: 2 },                    // 董事会在找你签字
    e6:  { t: 1, d: 1, D: 5 },                    // 一条未被加密的私聊
    e7:  { t: 2, d: 1, D: 6 },                    // 有人替你挡了一刀
    e8:  { t: 2, d: 4, f: 2 },                    // 女术士的代理人
    e9:  { t: 3, d: 5, f: 4, a: 3 },              // 旧档案：你自己的编号
    e10: { t: 1, d: 2, D: 6 },                    // 一笔干净的生意
    e11: { t: 1, d: 1, D: 6 },                    // 停电的三十七分钟
    e12: { t: 2, d: 2, f: 1 },                    // 一名下线的求救
    e13: { t: 3, d: 6, f: 5 },                    // 穹顶的雨
    e14: { t: 3, d: 5, f: 4 },                    // 你的名字出现在牌桌上

    /* ---------- 二、x1-x30：中局主线感，分城区铺 ---------- */
    /* 高塔商业区：董事会与合规部，偏忠诚与权柄 */
    x1:  { t: 1, d: 1, D: 5 },                    // 电梯里的四次刷卡
    x2:  { t: 2, d: 3, f: 2 },                    // 监事会的空椅子
    x3:  { t: 2, d: 4, f: 3 },                    // 一份没人认领的辞呈
    x19: { t: 3, d: 6, f: 6, a: 3 },              // 董事会的投票
    x25: { t: 3, d: 7, f: 8, a: 4 },              // 你的继任者

    /* 交易所广场：清算与资本 */
    x4:  { t: 1, d: 1, D: 5 },                    // 收盘前九十秒
    x5:  { t: 2, d: 3, f: 2 },                    // 一位母亲的股权
    x6:  { t: 2, d: 4, f: 3 },                    // 慈善晚宴的拍卖单
    x20: { t: 2, d: 5, f: 4 },                    // 评级下调
    x26: { t: 3, d: 6, f: 6 },                    // 一场公开的听证

    /* 研究所园区：程砚与伦理审查 */
    x7:  { t: 1, d: 1, D: 5 },                    // 三号门禁的静音区
    x8:  { t: 2, d: 4, f: 3, a: 2 },              // 伦理审查的黑箱
    x9:  { t: 2, d: 3, f: 2 },                    // 一只被退回的样品
    x21: { t: 2, d: 5, f: 4 },                    // 断电的七分钟
    x28: { t: 3, d: 6, f: 6 },                    // 不可签收品

    /* 下层居住区：老鸦、陆晚，偏罪痕与声望 */
    x10: { t: 1, d: 1 },                          // 下雨天的排队
    x11: { t: 1, d: 1, D: 5 },                    // 诊所里的两份账单
    x12: { t: 2, d: 3, f: 2 },                    // 巷子尽头的广播
    x22: { t: 2, d: 4, f: 3 },                    // 一个孩子的名字
    x27: { t: 3, d: 5, f: 5, w: { track: { sin: [4, 99] } } },   // 灰市的规矩

    /* 工业港区：铁贵与工会 */
    x13: { t: 1, d: 1, D: 5 },                    // 凌晨三点的装箱单
    x14: { t: 2, d: 3, f: 2 },                    // 罢工的第四天
    x15: { t: 3, d: 5, f: 4 },                    // 一艘没有登记的船
    x23: { t: 2, d: 4, f: 3 },                    // 保险公司的电话
    x29: { t: 3, d: 6, f: 6 },                    // 一箱没有标签的货

    /* 轨道港：离城的那条路 */
    x16: { t: 2, d: 2, f: 1 },                    // 候补名单
    x17: { t: 2, d: 4, f: 3 },                    // 一个不想走的人
    x18: { t: 3, d: 5, f: 5 },                    // 穹顶边缘的雨
    x24: { t: 3, d: 6, f: 6 },                    // 轨道港的清舱
    x30: { t: 3, d: 7, f: 8, a: 4 },              // 雨客的第二次见面

    /* ---------- 三、m1-m16：初见，每人只一次 ---------- */
    /* 前十二个是各自的第一次见面，开局期就该铺开；
       后四个是第二面，要等关系上来。
       metNpcs 的去重由 engine.evPass 统一处理。 */
    m1:  { t: 1, d: 1, D: 3 }, m2:  { t: 1, d: 1, D: 3 },
    m3:  { t: 1, d: 2, D: 4 }, m4:  { t: 1, d: 2, D: 4 },
    m5:  { t: 1, d: 2, D: 4 }, m6:  { t: 1, d: 3, D: 5 },
    m7:  { t: 1, d: 2, D: 4 }, m8:  { t: 1, d: 2, D: 4 },
    m9:  { t: 1, d: 3, D: 5 }, m10: { t: 1, d: 3, D: 6 },
    m11: { t: 1, d: 3, D: 6 }, m12: { t: 1, d: 4, D: 7 },
    m13: { t: 2, d: 4, f: 3, w: { minRel: 3, npc: 'wen-duo' } },
    m14: { t: 2, d: 4, f: 3, w: { minRel: 3, npc: 'lao-ya' } },
    m15: { t: 2, d: 5, f: 4, w: { minRel: 3, npc: 'lu-wan' } },
    m16: { t: 2, d: 5, f: 4, w: { minRel: 4, npc: 'yin-mian' } },
  };

  /* ---------- 四、v1-v60 与 y1-y80：按城区分进度带 ----------
     两个批次的条件规则一致，只是 y 批整体比 v 批晚一档：
     事件写得更具体、施压更硬，就不该在第 2 天冒出来。
     同城区内按序号切三档：前 2 条中局、中 2 条偏后、后 2 条后期。
  ------------------------------------------------------------ */
  var LATE = { v: 0, y: 1 };     // y 批整体晚一档

  function bandFor(n, late) {
    /* n 是该城区内的序号 1..6（v）或 1..8（y），late 再加一档。
       前两档开局就能抽到，过了第 5 天自动退出池子，把位置让给后期事件。 */
    var k = n + late;
    if (k <= 2) return { t: 1, d: 1, D: 5 };
    if (k <= 4) return { t: 2, d: 2, f: 1 };
    if (k <= 6) return { t: 2, d: 3, f: 3 };
    return { t: 3, d: 4, f: 5 };
  }

  /* 把 v1..v60 / y1..y80 按「每城区连续 6 条 / 8 条」切开 */
  (function buildBanded() {
    var i, n;
    for (i = 0; i < 60; i++) {
      n = (i % 6) + 1;
      GATES['v' + (i + 1)] = bandFor(n, LATE.v);
    }
    for (i = 0; i < 80; i++) {
      n = (i % 8) + 1;
      GATES['y' + (i + 1)] = bandFor(n, LATE.y);
    }
  })();

  /* ---------- 五、少数条目补硬条件 ----------
     这几条的内容本身依赖某个状态，不满足时看着会很突兀。
     例：谈罪痕的、谈某人关系的、谈穹顶接缝的。
  ------------------------------------------------------------ */
  var EXTRA = {
    /* 罪痕相关：身上没味道的人不该撞上清算行的追债戏 */
    v12: { w: { track: { sin: [3, 99] } } },     // 清算行走廊里一个从没被叫到的号码
    v24: { w: { track: { sin: [3, 99] } } },     // 巷口突然挂上牌子的那间诊室
    y16: { w: { track: { sin: [4, 99] } } },     // 一份自愿放弃补偿的空白声明

    /* 忠诚见底：董事会已经不打算留你了 */
    v4:  { w: { track: { loyalty: [0, 5] } } },  // 季度通报会上被空掉的一栏名次
    y5:  { w: { track: { loyalty: [0, 5] } } },  // 工位被换到走廊尽头的角落

    /* 权柄起来以后：董事会开始把你当牌手 */
    v14: { w: { track: { power: [5, 99] } } },   // 拍卖会清单上的一格旧编号
    y8:  { w: { track: { power: [5, 99] } } },   // 董事会秘书推过来的那一页纸

    /* 声望起来以后：外面开始有人替你说话 */
    v9:  { w: { track: { renown: [5, 99] } } },  // 慈善晚宴上最后一件被拍卖的标的
    y48: { w: { track: { renown: [5, 99] } } },  // 观景层投诉箱里的一封实名信

    /* 穹顶之外：得先跟雨客或萨尔打过照面，才知道那条路存在 */
    v55: { w: { met: 'yu-ke' } },                // 穹顶外带回来的一只箱子
    v57: { w: { met: 'yu-ke' } },                // 气闸里的一名陌生人
    v60: { d: 5, f: 5, w: { met: 'yu-ke' } },    // 穹顶接缝处的一枚螺栓
    y79: { w: { met: 'sa-er' } },                // 潮的拾荒队这周要过穹顶一次
    y80: { d: 6, f: 6, t: 3, w: { met: 'yu-ke' } }, // 穹顶第 41 号接缝的一次响动

    /* 环带：得认识荀戒才有人带你上去 */
    v37: { w: { met: 'xun-jie' } },
    v42: { w: { met: 'xun-jie' } },
    y49: { w: { met: 'xun-jie' } },
    y55: { w: { met: 'xun-jie' } },

    /* 记忆银行：得认识无面 */
    v43: { w: { met: 'wu-mian' } },
    v48: { w: { met: 'wu-mian' } },
    y60: { w: { met: 'wu-mian' } },
    y64: { w: { met: 'wu-mian' } },

    /* 回收场：得认识班头 */
    v49: { w: { met: 'ban-tou' } },
    v54: { w: { met: 'ban-tou' } },
    y66: { w: { met: 'ban-tou' } },
    y72: { w: { met: 'ban-tou' } },
  };

  Object.keys(EXTRA).forEach(function (k) {
    GATES[k] = Object.assign({}, GATES[k] || {}, EXTRA[k]);
  });

  window.EVENT_GATES = GATES;

  /* 给没有写进表的条目一个安全默认：当轻事件处理，别把事件池饿死 */
  window.gateOf = function (e) {
    if (!e) return null;
    var g = GATES[e.id];
    if (g) return g;
    return { t: e.tier || 1, d: 1 };
  };
})();

/* ===== game/events-v6.js ===== */
/* 随机事件扩充（第二批，80 条）。 */
(function () {
  'use strict';

  window.EVENTS_V6 = [
    { id: 'y1', portrait: 'portrait-monitor', district: 'tower', title: '四十一层多出来的一段走廊',
      text: '电梯在四十一层停下，你按的是三十三层。门开时外面多出一段走廊，封条是新的，胶还没干透。走廊尽头有人背对着你打电话，念的是你的编号前四位，念完又念了一遍。门开始合，你的手压在开门键上，没有松。你在这一层没有任何会议，通讯录里也查不到这一层的任何一个人。走廊那盏灯每两秒闪一次，和你的心跳对不上。',
      options: [
        { label: '走出来，看清打电话的人', run: { intel: 3, vitality: -1, track: { sin: 1 } },
          after: '你走出来，走廊只有八米，尽头是一扇消防门。那人挂了电话回头看你，说：你走错楼层了。他从你身边过去，外套上是消毒水的味道。消防门后面的门牌号，在这栋楼的图纸上不存在。' },
        { label: '按住关门，回到自己的楼层', run: { track: { loyalty: 1, sin: -1 } },
          after: '你回到三十三层，电梯正常得让人不安。当天下午，物业发来一份通知，说四十一层正在封闭检修，感谢配合。通知没有落款，抄送名单里有你的工号，排在第一个。' },
        { label: '申领这段监控，报给监事会', run: { intel: 2, chips: 1, track: { loyalty: 2, renown: -1 } },
          after: '调阅申请批下来了，给你的却是一段空白。技术科说那十一秒的录像被覆盖过一次，用的是你自己的权限。你把空白录像原样交上去，闻铎收下，什么也没问。' },
      ] },
    { id: 'y2', portrait: 'portrait-su', district: 'tower', title: '日程表上被划掉的那一格预留',
      text: '苏纹把明天的日程投在墙上，十四点半那一格用红笔划掉了，划得很直。她说这一格是上周预留的，预留人一栏写着你的名字，可没人记得是谁预留的。她问你是恢复，还是就这么留着。走廊里还站着一个人，工牌翻了过去，看不见名字，他说有件事，只要你签个字就行。',
      options: [
        { label: '让她恢复这一格，自己坐进去', run: { intel: 3, track: { sin: 1, renown: 1 } },
          after: '你坐进去，房间里只有一张椅子和一台老终端。终端开机后弹出一份待签列表，都是你的权限能签的字。你签了两个，第三个跳出一行红字：该目标已失效。你退出来时，日程表上那一格又消失了。' },
        { label: '把这一格让给走廊里的人', run: { grantCard: { n: 1, path: 'control' }, track: { loyalty: -1, sin: 1 } },
          after: '那人进去待了十七分钟，出来时把一张指令卡放在你桌上，说这是苏纹让转的。牌面目标是「城北调度室」，路径是操控。他走后，你在日程系统的操作日志里看到，这一格是三分钟前才出现的。' },
        { label: '什么都不改，照原样过星期三', run: { track: { loyalty: 1, sin: -1 } },
          after: '你什么也没做，第二天十四点半你在工位上喝完了一杯茶。当天晚上，苏纹把那张日程表归档了，归档备注是「无效预留」。走廊里那个人没有再来，工牌翻过去的那一面，也没人见过。' },
      ] },
    { id: 'y3', portrait: 'portrait-dai', district: 'tower', title: '合规部送来的一份带痕复印件',
      text: '合规部送来一份复印件，一共九页，第八页边角有一块咖啡渍，形状和你上个月交上去的那份一模一样。戴思远的便签贴在第一页，只有一句：请确认这份是否由你本人提交。你那份原件还在抽屉里锁着，编号是连号，中间少了一页。便签的胶已经不太粘，边角卷起来。',
      options: [
        { label: '确认，说是本人提交', run: { intel: 2, track: { loyalty: 2, sin: 1 } },
          after: '你签了字，戴思远把复印件收进柜子里，说这样就行了。一周后，这份复印件出现在另一起案子的证据清单里，清单一栏写着「由本人确认，无异议」。你想起来了，那天你并没有看第九页。' },
        { label: '否认，并要求核对原件', run: { intel: 4, grantCard: { n: 1, path: 'control' }, track: { loyalty: -1, renown: 1 } },
          after: '戴思远把原件调出来，第八页干干净净。他停了两秒，把便签撕下来收进抽屉，又从抽屉里抽出一张操控指令卡推给你，说这份是补的程序材料。他合上本子，没有给你看记录上写的那一句。' },
        { label: '不回应，让它在期限里作废', run: { track: { sin: 1, renown: -1 } },
          after: '你没回。第十天，系统发来一条自动通知：逾期未确认，按原提交归档。同一天，人事那边多了一条关于你的备注，措辞很客气，只有四个字，需要观察。' },
      ] },
    { id: 'y4', portrait: 'portrait-yu', district: 'tower', title: '提前半天到账的一笔清算款',
      text: '郁南枝发来一条结算通知，金额六十四点五，备注写着「预付」。你的部门这个季度没有任何预付款项。通知底下附着一行小字：当日未退回，视为接受。现在离十一点半还有四十分钟，清算行的退回通道不需要手续，也不需要理由。通知的落款时间是十一点二十九分。',
      options: [
        { label: '十一点半前原路退回', run: { track: { loyalty: 2, renown: 1 } },
          after: '你在十一点二十七分按下退回键，回执号跳出来。当天下午郁南枝的助手打来电话，只说了一句：收到。第二天你的部门结算单上多了一行备注，「该席位资金往来清晰」，落款是清算行。' },
        { label: '留下，等对方自己来认', run: { money: 65, track: { sin: 2 } },
          after: '钱在账上待了十一天，没有人来认，也没有催收。第十二天早上，它被合并成一笔正式拨款，拨款依据一栏是空的。郁南枝在走廊里遇见你，点了一下头，像是这笔账从头到尾都跟你无关。' },
        { label: '退一半，另一半留作保证金', run: { money: 30, intel: 2, track: { sin: 1, loyalty: -1 } },
          after: '你退了三十二。第二天清算行发来一份简短的函，说保证金已受理，编号 Y-4471。函件最后一句话是：该笔资金不产生利息，也不接受归还。你把它夹进抽屉，和那份少了一页的原件放在一起。' },
      ] },
    { id: 'y5', portrait: 'portrait-clerk', district: 'tower', title: '工位被换到走廊尽头的角落',
      text: '行政发来一份工位调整表，你的位置从十七层换到十九层走廊尽头，靠消防通道，那一片没有监控。表上写的原因是「业务需要」，签字栏空着。同一天，你的门禁多出一层权限，能打开十九层那扇一直锁着的门，权限有效期写着三十天。走廊的灯开关在门外面，你摸了一下。',
      options: [
        { label: '搬过去，试试那扇门', run: { intel: 3, vitality: -1, grantCard: { n: 1 }, track: { sin: 1 } },
          after: '门后面是一间没有窗的会议室，桌上放着一份没封口的卷宗，第一页是一张清洗指令卡，目标栏空着。卷宗里夹着一张便签：补给你。你把卡收下，会议室的门在你身后自动锁上，灯灭了。' },
        { label: '拒绝调整，要求回原工位', run: { track: { loyalty: 1, renown: -1 } },
          after: '你提交了不同意书，行政过了四天才回，说可以维持原工位，但门禁权限已经回收。之后一周，你的部门例会被挪到了没有你名字的会议室。十七层的空调出风口正对着你的后颈。' },
        { label: '搬过去，把这件事报给行政主管', run: { intel: 2, track: { loyalty: 2, sin: -1 } },
          after: '行政主管看完你的报告，说这是例行轮换，全公司这个月换了四十多个工位。他把报告归了档，编号是连号里的第三份。当天下午，十九层那扇门的权限在你卡上失效了，比预计早了十天。' },
      ] },
    { id: 'y6', portrait: 'portrait-ghost', district: 'tower', title: '内部通讯里多出来的一个群',
      text: '内部通讯里多了一个群，名字是一串数字，成员三十二人，全部隐藏身份，只有你的名字是公开的。群里第一条消息发自三天前，是一份排班表，每天夜里都有人被标红。今天标红的名字，是替你签过字的那个人。群里没人说话，也没人退。群里最近一条消息的时间停在昨天二十三点。',
      options: [
        { label: '把排班表存下来，逐日对', run: { intel: 4, track: { sin: 1 } },
          after: '你存了整张表，对着值班记录逐日核。前七天标红的人里，有五个的工牌已经注销，注销原因都是「主动离职」。第八天夜里，排班表上标红的名字换成了你，标红时间写着凌晨四点零七分。' },
        { label: '退群，截图留证', run: { intel: 2, chips: 1, track: { loyalty: 2, renown: -1 } },
          after: '你退出群聊的瞬间，聊天记录全部清空，只有你提前截下的三张图还在。你把图存进离线盘。第二天，那个群还在，成员变成了三十一人，公开的名字换成了一串编号，那串编号不是你的。' },
        { label: '在群里问一句：标红是什么意思', run: { intel: 3, vitality: -1, track: { power: 1, sin: 1 } },
          after: '消息发出去，三十二个人里没有人回。七分钟后，群里弹出一条系统提示：发起人已退出。你被默认为群主。当晚你的终端多了一次异地登录，登录地显示为环带维修层，你从没去过那里。' },
      ] },
    { id: 'y7', portrait: 'portrait-monitor', district: 'tower', title: '那一天电梯广播念了你的名字',
      text: '早高峰，电梯广播忽然换了内容，念了三个名字，第一个是你，后面跟着一句「以上人员请到十七层复核」。电梯里的人都在看楼层显示器，没有人看你。你到十七层时，复核室的门开着，里面没有桌子，也没有人，只有一把椅子对着墙。复核室墙上有块屏幕，黑着，边框很新。',
      options: [
        { label: '进去，把复核走完', run: { intel: 3, vitality: -1, track: { loyalty: 2, sin: 1 } },
          after: '你坐下，墙上一块屏幕亮了，滚动播放你过去三个月的考勤。播完跳出一行结论：无异常。灯灭了，门还开着。你出来时，走廊里有个人刚把名单上的第二个名字划掉。' },
        { label: '不进去，直接回工位', run: { track: { loyalty: -2, sin: 1 } },
          after: '你转身走了。当天下午，复核室的那份名单被归档，你那一栏写着「未出席」。三天后，你的门禁少了一层权限，人事没有通知，是刷卡时才发现刷不开的。' },
        { label: '先找苏纹，问是谁排的名单', run: { intel: 2, track: { power: 1, loyalty: -1 } },
          after: '苏纹翻了排期系统，说这次广播是自动触发的，触发条件是门禁异常，不是人为安排。她把触发记录导给了你，记录显示触发时间比你进电梯早了四分钟，那时你还在楼下排队。' },
      ] },
    { id: 'y8', portrait: 'portrait-su', district: 'tower', title: '董事会秘书推过来的那一页纸',
      text: '例会开始前，苏纹把一页纸推给你，是下周的旁听名单，六个名字，第五个是你。她说这一页只印了一份，会后统一销毁。名单上第四个人，上个月刚被调去环带维修层，理由一栏写着「个人申请」。他的工位昨天清空了，桌上那盆植物还在。纸是单面打印的，背面透出上一份文件的字。',
      options: [
        { label: '收下，会上照名单发言', run: { track: { loyalty: 2, power: 1, sin: 1 } },
          after: '你按名单的顺序发了言，说了三段话，都是记录好的口径。散会时，主持人点了一下你的工号，说留下。会议纪要里，你发言那一段被完整摘录，而其他人说的都只有一句「略」。' },
        { label: '问她第四个人现在在哪', run: { intel: 4, track: { sin: 1 } },
          after: '苏纹说她不知道，但给了你一个内线号码，说这是环带那边的排班线，半夜打才有人接。当晚你打过去，接电话的人报了三个部门名，没有一个是你的，然后挂断。你记下了背景音里的滴水声。' },
        { label: '把纸推回去，说这次不参加', run: { track: { renown: -1, loyalty: -1 } },
          after: '你把纸推回去。苏纹没说什么，把它收进文件夹，走到碎纸机前站了一会儿，最后走了回来。第二天你没有被安排旁听，也没有被安排任何事。整周你的日程表都是空的，空得很整齐。' },
      ] },
    { id: 'y9', portrait: 'portrait-yu', district: 'exchange', title: '收盘前三分钟的一张错价单',
      text: '收盘前三分钟，系统挂出一张错价单，买入价和卖出价写反了，挂单人一栏空着。只要点一下就能吃掉里面的差价。清算行那边没有撤单，也没有技术员上线，像是故意摆在那里。屏幕右下角有一行很小的字：仅限本席位。挂单编号连号，前一位属于一笔早已作废的委托。',
      options: [
        { label: '吃掉差价，立刻平仓', run: { money: 70, track: { sin: 2 } },
          after: '你在最后四十秒平了仓，落袋七万。收盘后两小时，那张单子的挂单人补上了，是清算行自己的内部账户。第二天没有人提这件事，只是你的席位保证金门槛被悄悄调高了一档。' },
        { label: '不碰，把截图交给清算行', run: { intel: 3, chips: 1, track: { loyalty: 2, renown: -1 } },
          after: '你把截图发过去，对方回了一句收到。第二天郁南枝让人送来一张通行条，凭它可以走一次内部结算的绿色通道，仅限一次。你以前排过四十分钟的队，这次用了两分钟。' },
        { label: '反向挂一笔，等对方来找', run: { intel: 2, grantCard: { n: 1, path: 'capital' }, track: { sin: 1 } },
          after: '你的反向单挂出去，四秒就被吃掉，对方的账户连编码都查不到。第二天早上，一张资本指令卡从门缝塞进来，附一张纸条：昨天那把，算你赢。字迹是左手写的，纸是清算行的专用纸。' },
      ] },
    { id: 'y10', portrait: 'portrait-dai', district: 'exchange', title: '一份没有归档授权的签名样本',
      text: '审核窗口下班后，戴思远的助手送来一个档案袋，里面是你的签名样本，一共七份。其中三份不是你签的，起笔收笔学得很准，只有捺的收锋短了半分。助手说这是例行比对，结果两周后进档案，比对过程不需要你参加，也不需要你同意。档案袋的封口线是后打的，孔位对不齐。',
      options: [
        { label: '配合比对，并指出那三份', run: { intel: 3, track: { loyalty: 2 } },
          after: '你把三份挑出来，助手当场登记在案，说会并入报告。两周后你调阅那份报告，结论是「样本一致性良好」。你指出过的那三份，在报告里被编号合并进了另外四份，看不出哪张是哪张。' },
        { label: '要求调取比对程序，问谁有权取样', run: { intel: 4, track: { power: 1, loyalty: -1 } },
          after: '你递了调阅申请，程序文本当天就送到了，采样授权一栏是空的。你顺着编号往下查，发现这批样本来自一个三个月前就注销的部门。注销文件上的签批人，姓氏和你一样。' },
        { label: '取回样本，拒绝进入比对', run: { track: { loyalty: -2, renown: -1 } },
          after: '你把档案袋取回来了，助手提醒你，取样是系统自动完成的，样本还有备份。你确认了这点，还是取走了。之后一个月里，你的每份文件都被要求提供两份身份证明，窗口的人说是常规抽查。' },
      ] },
    { id: 'y11', portrait: 'portrait-yu', district: 'exchange', title: '一笔坏账的第七次展期申请',
      text: '一笔账挂了七次展期，每次都是同一个人签字。第八次展期申请今天到期，签批栏空白，逾期不签就自动转成核销，核销意味着债务会转到经手人头上。经手人那一栏，写的是你的编制号，尽管你从没见过这笔钱。展期单上的章每次都是同一个角度，压痕很深。',
      options: [
        { label: '签，把展期续上', run: { intel: 2, track: { loyalty: 1, sin: 1 } },
          after: '你签了第八次。系统自动生成了一条备注：连续展期八次，建议复核。建议状态一直是待办，没有人处理。这笔账半年后消失了，消失的当天，你的额度上限被调高了两个百分点。' },
        { label: '不签，让它核销', run: { money: -40, track: { renown: -1, loyalty: -1 } },
          after: '债务按规则转到了你名下，从当月的部门预算里扣。你没提异议，扣款在第三天完成。郁南枝那边发来一份结清通知，通知末尾附了一句：此账目已封存，请勿引用。' },
        { label: '查清前七次是谁签的', run: { intel: 4, chips: 1, track: { sin: 1 } },
          after: '前七次签名是同一个笔迹，前三次用的是同一支笔，墨水型号一致。你把样本带出来比对，发现那个人在第四次展期后就被调走了。调令的签发日期，比这笔账的挂账日期还早了一天。' },
      ] },
    { id: 'y12', portrait: 'portrait-clerk', district: 'exchange', title: '一个专问冷门标的的陌生人',
      text: '一个陌生人坐在交易席位旁边，问价问了一个小时，问的都是没人要的标的。他走的时候留下一张纸条，上面是一个地址和一句话：今天下午四点，来不来都行。纸条背面印着清算行的水印，编号格式是旧版的，七年前就不再使用。纸条的水印要在灯下侧着看才显出来。',
      options: [
        { label: '去。', run: { intel: 3, vitality: -1, grantCard: { n: 1, path: 'capital' }, track: { sin: 1 } },
          after: '地址是交易所地下二层的旧档案室，铁柜有一半是空的。他在里面等你，递来一张资本指令卡，说是手上最后一张，目标写着「交易所旧档区」。名单他留在桌上，第一页第三行被裁掉了，他自己先走了。' },
        { label: '把纸条交给合规部', run: { chips: 1, track: { loyalty: 2, renown: -1 } },
          after: '合规部收下了纸条，说这属于线索移交。两天后戴思远约你谈了十分钟，问你当时为什么不追出去。你说他在打电话。戴思远在本子上记了两笔，抬头时说：那一层确实有信号屏蔽。' },
        { label: '不去，把纸条烧掉', run: { track: { sin: 1, renown: -1 } },
          after: '你在消防通道里把纸条烧了，水印那一角烧不干净，你用鞋底碾了两下。第二天，那个席位旁边坐了一个新的人，同样问价问了一小时，同样问的都是没人要的标的，只是没有再留纸条。' },
      ] },
    { id: 'y13', portrait: 'portrait-scientist', district: 'exchange', title: '广场主屏幕上的一行免责声明',
      text: '广场主屏幕今天多了一行免责声明，说本日行情「不构成对任何主体的价值判断」。声明在屏幕底部滚动了整个上午。中午，一则公告被撤了下来，公告内容是某个部门被整体转让，买方一栏用的是编号。你部门的编号，和它只差一位。滚动的声明字号比行情数字小两号。',
      options: [
        { label: '查那则被撤下的公告', run: { intel: 4, track: { sin: 1 } },
          after: '公告存活了六分钟，缓存里还留着一半。买方编号的末位是 7，你部门是 6。你往下翻，看到人员安置方案那一栏写着「整体并入，岗位保留」。方案里没有写保留多久。' },
        { label: '把这件事告诉部门里的人', run: { track: { renown: 2, loyalty: -2 } },
          after: '你说了，十七个人的部门，当天就有四个去人才系统更新了简历。第二天主管找你谈话，说这种事不该由你来讲。你的工位当天晚上被清走了一半绿植，行政说是季度养护。' },
        { label: '截图存证，按兵不动', run: { intel: 3, chips: 1, track: { sin: 1, loyalty: -1 } },
          after: '你把截图存了三份，两个离线盘一个纸质。三周后，编号末位是 7 的那个部门被整体并入了集团直属机构，安置方案和公告上写的一样。你的部门没有任何变化，只是例会改到了隔周举行。' },
      ] },
    { id: 'y14', portrait: 'portrait-yu', district: 'exchange', title: '拍卖会清单上的一格旧编号',
      text: '夜间拍卖的清单里有一样东西，编号 Y-11，说明只有一行「权益类，详见内档」。标的预估价比整层写字楼还高。举牌的不是人，是七个自动席位，每次加价都精准地压在前一手之上。你手里有一张别人的委托牌，权限到今晚零点。清单上 Y-11 那一行用了加粗，别的行没有。',
      options: [
        { label: '跟到第三手就停', run: { intel: 3, track: { sin: 1 } },
          after: '你在第三手停了。落槌价翻了四倍，买家是一个你查不到的托管账户。清算行当晚就完成了过户，结算速度比正常快了十一倍。第二天，Y-11 这个编号在系统里被划掉，备注是「已合并」。' },
        { label: '用委托牌一口气抬到底', run: { money: -70, grantCard: { n: 1, path: 'capital' }, track: { power: 2, sin: 2 } },
          after: '你抬到底，赢下标的。清算行送来的不是资产，是一张资本指令卡，附注写着「原持有方转让剩余处置权」。你回头查委托牌的主人，才发现那个委托人上周已经注销，注销申请是他自己提的。' },
        { label: '放弃举牌，记下七个席位的出价规律', run: { intel: 4, chips: 2, track: { sin: 1 } },
          after: '你把七次加价的时间差记下来，间隔都是 1.7 秒，误差不到百分之一。这是同一台机器的节奏。第二天，这七个席位从拍卖系统的可见名单里消失了，但出价记录还在，用的是同一台时钟。' },
      ] },
    { id: 'y15', portrait: 'portrait-yu', district: 'exchange', title: '清算行门口排了整整一夜的队',
      text: '清算行门口排了一夜的队，队伍里有七八个人拿着同一份合同的复印件。合同是同一天签的，签的位置在第三页，第三页的页眉颜色和其他页不一样。早上八点开门，柜台只开了两个窗口，第一个窗口挂出的牌子写着「本日仅办理注销」。柜台后面挂着一块白板，写着今天的额度，被擦过一半。',
      options: [
        { label: '插队进去，问合同的事', run: { intel: 4, vitality: -1, track: { sin: 1 } },
          after: '你挤到窗口前，柜员翻了三页就合上了，说这份合同的第三页是后补的，补页人签的是你的部门编号。你回头找那几个拿复印件的人，队伍已经散了，只留下地上一层湿脚印。' },
        { label: '陪着排，记下每个人的工牌', run: { intel: 3, track: { renown: 1, loyalty: -1 } },
          after: '你排了两个小时，记下六个工牌号，其中三个属于一个已经解散的子公司。你把号记在纸上，交给你认识的一个柜员，他看了一眼，说这几个人上周刚办过注销，注销原因是资产转让。' },
        { label: '不排队，把这份合同的复印件买一份', run: { money: -25, intel: 3, track: { sin: 1 } },
          after: '你花了一笔钱从队伍里买到一份复印件。第三页确实是后补的，骑缝章对不上。你把复印件摊在桌上看了很久，发现页眉那行小字的字号，比上一页大了半磅，像是从别处剪过来又贴上去的。' },
      ] },
    { id: 'y16', portrait: 'portrait-dai', district: 'exchange', title: '一份自愿放弃补偿的空白声明',
      text: '一份自愿放弃补偿的声明摆在传送带上，一共四十份，签名整齐，日期集中在同一天。声明里提到的补偿，是下半年的岗位调整补偿。签完字的这些人，今天都还在正常上班。传送带走到尽头，等着下一道盖章，章在你手边。传送带的滚轮上缠着一根线头，转了两圈才掉。',
      options: [
        { label: '盖章，让流程走完', run: { track: { loyalty: 2, sin: 2, renown: -1 } },
          after: '你盖了章，四十份声明入库。下个月岗位调整启动时，签字的人没有一个拿到补偿，他们去问，答复是本人已自愿放弃。名单里有两个人的工位，就在你隔壁。' },
        { label: '扣下，逐份找人对笔迹', run: { intel: 4, vitality: -1, track: { renown: 2, loyalty: -2 } },
          after: '你把四十份压了两天，抽出七份对上人。七个人里有五个说没见过这张纸。你把两份证据交到合规部，剩下的原样退回。退回当天，你收到一份岗位调整通知，调整去向写着「待定」。' },
        { label: '抽走自己认识的那几份，其余照盖', run: { intel: 2, track: { sin: 1, power: 1 } },
          after: '你抽走三份，塞进碎纸机，其余的全盖了。三个月后公司被查，那四十份声明的清单上没有你动过三份的痕迹。你留下的那一份复印件，纸张已经泛黄，签名那栏的墨迹比别处深。' },
      ] },
    { id: 'y17', portrait: 'portrait-peng', district: 'lab', title: '三号冷库门上那张没编号的封条',
      text: '三号冷库的封条是新贴的，胶面还没干，编号栏空着。彭戬说这不是他贴的，所里今天没有人领过封条。冷库里面存着上周送来的十七份样本，温度计一直在跳，从负十八跳到负十四，再跳回去。值班表上，昨夜那班的人写着「已调岗」，调令是今天早上才补的。',
      options: [
        { label: '撕开封条，进去点样', run: { intel: 4, vitality: -1, track: { sin: 1 } },
          after: '你进去点了三遍，十七份变成十六份，少的那份编号被刮掉了。冷库最深处的货架上有一层薄霜被人擦过。你把编号记下，出来时把封条按原样贴回去，胶已经不太粘了。' },
        { label: '不动封条，先去补一张调令', run: { intel: 3, track: { loyalty: 2, sin: -1 } },
          after: '你去人事补了那份调令的副件，副件上的时间戳和值班表对不上，早了六个小时。把副件交上去时，彭戬看了一眼，说以后这种事直接找他，然后把它锁进了自己的抽屉。' },
        { label: '上报安保，让彭戬带队开门', run: { chips: 1, track: { loyalty: 3, power: 1, renown: -1 } },
          after: '彭戬带了四个人来，开门、清点、录像，全程按规程走。清点结果是十七份，一份不少。他把录像封存，编号写进了记录。你站在门口，看着那份本来少掉的样本重新出现在货架上。' },
      ] },
    { id: 'y18', portrait: 'portrait-scientist', district: 'lab', title: '程砚递过来的一支断掉的笔',
      text: '程砚把一支断掉的笔放在你面前，笔帽上刻着一串编号，是上一批志愿者的。她说这支笔在实验记录里出现过十九次，签的都是不同的人名，而笔的主人在第十一次之后就再没出现过。她问你，这份记录要不要按流程归档。走廊上的送样车正一辆接一辆过去。',
      options: [
        { label: '按流程归档，一个字不改', run: { track: { loyalty: 3, renown: 1, sin: -1 } },
          after: '你把记录原样归了档，编号连号，看不出缺口。归档后第七天，那批志愿者名单被整体转入长期项目，状态一栏统一写着进行中。程砚把断笔收回了上衣口袋，没有再说这件事。' },
        { label: '扣下记录，替她重做一份', run: { grantCard: { n: 1, path: 'purge' }, intel: 3, track: { power: 2, sin: 2, loyalty: -1 } },
          after: '你重做了一份，把第十一次之后的签名并入了同一栏。程砚看完，夹了一张清洗指令卡在里面，目标写着「四号样本间值守」。她说这张是上周发下来没人接的。记录归档那天，四号间的值守换了人。' },
        { label: '把断笔和记录一起交到伦理审查', run: { intel: 4, chips: 1, track: { loyalty: 2, power: -1, sin: 1 } },
          after: '戴思远亲自来取件，登记完说了一句话：这批记录两年前就该到这里。审查启动了，四个月后出了结论，结论只有两页，第一页列的是流程瑕疵，第二页整页是空的。' },
      ] },
    { id: 'y19', portrait: 'portrait-scientist', district: 'lab', title: '培养箱编号牌上多出的一格',
      text: '培养箱的编号牌上少了一格，编号从 14 直接跳到 16。值班员说前天还是连的。柜门上的日志显示，昨晚两点到两点四十之间有人开过箱，刷卡号是空号，门禁系统里没有这个号。你手上的温度记录写着这段时间箱内恒定，恒定得像是没人开过。墙上的值班表和这份日志差了三分钟，表是新换的。',
      options: [
        { label: '调出这段门禁原始日志', run: { intel: 4, chips: 1, track: { sin: 1 } },
          after: '日志导出来的是一段乱码，时间戳还在。技术科说这是读卡器故障，换了个新的。你把乱码存下，用老版本的解码器跑了一遍，跑出来的是一个九位工号，前两位是研究所代号。' },
        { label: '重新编号，把 15 号补上', run: { gear: 1, track: { loyalty: 2, sin: 1 } },
          after: '你补了一个 15 号上去，牌子是现打的，字体对不上。第二天早上，编号牌又少了一格，这次缺的是 17 号。你把新旧两块牌子并排放着，发现它们的钻孔位置差了半毫米。' },
        { label: '不动，把这件事写在交接班本上', run: { intel: 2, track: { renown: 1, loyalty: -1 } },
          after: '你写了三行字，交接班本当天就被收走了，人事说要换新版。三天后新本子发下来，最后一页有一条手写的抄录，内容和你写的一样，笔迹不是你的，日期是昨天。' },
      ] },
    { id: 'y20', portrait: 'portrait-peng', district: 'lab', title: '一辆停在样本门外的黑色推车',
      text: '一辆黑色推车停在样本门外，车轮上沾着泥，实验室里没有泥。推车上盖着防尘布，布角压着一张收据，收据上的时间是凌晨一点十七分，货名一栏写的是「耗材」。你查了当天所有的收货记录，没有这一单。推车的把手是温的。收据的纸边是毛的，像是从本子上撕下来的。',
      options: [
        { label: '掀开布，打开最上面那箱', run: { gear: 1, intel: 3, vitality: -1, track: { sin: 1 } },
          after: '最上面那箱是密封袋，袋子里是十几副还没拆的义体关节，编号被磨掉了。你合上箱盖，把布重新盖好。第二天早上推车不见了，门外的地面被冲过一遍，水迹是从墙根往外扫的。' },
        { label: '拍照留证，交给彭戬', run: { intel: 2, chips: 1, track: { loyalty: 3, renown: -1 } },
          after: '彭戬看了照片，说这条通道夜里十点断电，推车进不来。他调了后门的记录，凌晨那段时间一片空白。他把照片存进安保档案，编号后面加了两个字：待查。' },
        { label: '绕开走，当没看见', run: { track: { sin: 1, loyalty: -1 } },
          after: '你绕开了，走进样本间，把门带上。当天下午，你的门禁记录被系统标记为一次「例行巡检」，是你从没做过的动作。标记是你自己权限写的，写的时候你正在开会。' },
      ] },
    { id: 'y21', portrait: 'portrait-peng', district: 'lab', title: '一个被挖掉一页的伦理委员会名录',
      text: '伦理委员会的名录挂在研究所一层，今天第四页被整齐地挖掉了一块，缺口边缘很平，像是用刀切的。缺掉的那一格对应三行名字，前两行还能看见半个姓。前台说早上来就那样了，监控在那段时间正好检修，检修单是上周批的。缺口的四边对着走廊的光，反光很平。',
      options: [
        { label: '找旧版名录，比对缺的名字', run: { intel: 4, track: { sin: 1 } },
          after: '你在档案室的废纸箱里翻到一份三年前的旧名录，比对下来缺的是三个外聘委员。三个人的联系方式都已经注销，注销手续是同一周办的。旧名录的第四页，也被挖掉过一块。' },
        { label: '报修，要求补全名录', run: { track: { loyalty: 2, renown: 1, sin: -1 } },
          after: '你报了修，行政补印了一份新的，缺的那一行换成两个在职内审。补印版挂上去的当天下午，有人在新名录前站了十几分钟，把第四页那两行抄进了本子。你看见了，但没看清脸。' },
        { label: '把缺口那块的形状描下来存证', run: { intel: 3, chips: 1, track: { power: 1, sin: 1 } },
          after: '你把缺口描在纸上，量了尺寸。三天后，新名录上出现了同样的缺口，尺寸一模一样，位置往下移了半行。你把两张描图叠在一起，缺口重叠的部分，正好是一个完整的名字。' },
      ] },
    { id: 'y22', portrait: 'portrait-scientist', district: 'lab', title: '一位十年后回来的外聘专家',
      text: '一位外聘专家来所里做技术交流，讲了四十分钟，全程没有用幻灯片，所有的数据都背下来。散场后他没走，站在三号走廊尽头看了很久那扇没有编号的门。他说他十年前在这里工作过，那扇门当时不在这。接待单上，他的到访理由写的是「学术合作」。',
      options: [
        { label: '带他去看那扇门', run: { intel: 3, grantCard: { n: 1, path: 'purge' }, track: { sin: 1, power: 1 } },
          after: '他站在门前看了两分钟，说门后的东西他拆过。他从内袋里抽出一张指令卡塞给你，说这是当年剩的，他早就不做这行了。卡面目标写着「环带检修班」，路径是清洗。他当天下午就离城了。' },
        { label: '安排他提前返程', run: { track: { loyalty: 3, renown: -1, sin: 1 } },
          after: '你给他改签了当天最晚一班轨道船。他上船前说了一句：那扇门后面有风，你站久了能感觉到。你回所里看了一眼，门缝确实凉。接待单上他的行程被标注为「提前结束，无后续」。' },
        { label: '把他引荐给程砚', run: { intel: 3, track: { power: 1, loyalty: -1 } },
          after: '两个人关在会议室里谈了两个小时。出来时程砚把一份旧课题的编号抄给了你，说这是那个人当年的项目号，项目结项日期是十年前，结项结论六个字：不具备可行性。' },
      ] },
    { id: 'y23', portrait: 'portrait-peng', district: 'lab', title: '消防演习名单上的三个工号',
      text: '研究所要搞一次消防演习，名单发到每个组，你组里多出三个工号，编制都在，人从来没有出现过。行政说他们是外派，外派去向一栏空着。演习当天要按名单点名，缺勤的要写情况说明，说明表已经印好了，缺勤人签字栏留白。说明表的格式和上一版有一点差别，编号少了一栏。',
      options: [
        { label: '按名单报缺勤，如实写说明', run: { intel: 3, track: { loyalty: 2, sin: -1 } },
          after: '你交了三份说明，缺勤人签字栏空着。行政收下，说这种外派的一般不算缺勤，让你重写。你重写了一份，用词照旧。三份说明最后躺在档案袋里，袋子上写着「暂缓处理」。' },
        { label: '把三个人从名单上划掉', run: { track: { sin: 1, loyalty: -1 } },
          after: '你划掉三个工号，行政没有追问。演习当天人数报上去和名单一致，锐减三个也没人发现。两周后，这三个人中的两个出现在了另一个组的名单上，工号后面多了一个后缀。' },
        { label: '顺着工号查这三个人存不存在', run: { intel: 4, chips: 1, track: { sin: 1 } },
          after: '编内系统里三个人都在，照片都是同一底片翻印的，肩宽差了两像素。你查到他们的入职日期是同一天，入职手续是同一台终端提交的。那台终端三年前的资产编号，属于被拆掉的旧机房。' },
      ] },
    { id: 'y24', portrait: 'portrait-scientist', district: 'lab', title: '程砚在凌晨两点留下的便条',
      text: '凌晨两点，程砚在你桌角压了一张便条，写着三行字，是三个实验编号。她自己已经进了无菌区，预计六小时。便条背面写着：不管哪一组数据先出来，别让第三个人知道。所里的夜班只有三个人在，一个刚换了班，一个在看监控。便条的墨迹有一处被手抹过，字还在。',
      options: [
        { label: '等数据，全程自己盯着', run: { intel: 4, vitality: -2, track: { sin: 1 } },
          after: '你守了六个半小时，三组数据出了两组，第三组的曲线在第四小时断了一截。程砚出来时看了一眼屏幕，把断掉的那段单独导出，删了原始文件。她说这截本来就是不该有的。' },
        { label: '把便条交到伦理审查备案', run: { intel: 2, chips: 1, track: { loyalty: 3, power: -1, sin: 1 } },
          after: '戴思远收到便条后当天就来了所里，站在无菌区外面等了一个上午。程砚出来时他什么也没说，只让她补一份实验说明。那份说明的编号，比另外两组数据的编号各早了一天。' },
        { label: '照她说的做，但把三组数据各留一份底', run: { intel: 3, chips: 2, track: { power: 1, sin: 1 } },
          after: '你导了三份底，一份存离线盘，两份压在办公桌夹层。程砚交付数据时只交了前两份。半年后集团来查课题，第一份数据被完整采信，第二份被要求重做，第三份你始终没有拿出来。' },
      ] },
    { id: 'y25', portrait: 'portrait-lu', district: 'slum', title: '诊所上门送来的第二张账单',
      text: '陆晚自己找上办公室，手里捏着一张已经付过的旧账单。账单上的金额被人改过一次，改的数字和原件差十一块，笔迹比你平时的潦草。她说这是从你们公司财务那头退回来的，退回理由写着「金额与备案不符」。改金额的那一栏，经手人编号是你的。',
      options: [
        { label: '承认是自己改的，把钱补上', run: { money: -15, track: { renown: 2, loyalty: -1 } },
          after: '你补上十一块，陆晚把账单撕成两半塞进口袋，说这事算了。回公司后你才发现，那份备案的提交时间比你收到账单早两天。备案表上的签名，比你平时写得工整。' },
        { label: '不承认，让她按原单再报一次', run: { track: { sin: 1, renown: -1 } },
          after: '让她重报，第二次财务通过了，附属说明写着「金额已核实」。她没有再提是谁改的。两个月后，你的诊疗记录里多了一栏备注，写着「结算存在争议」，这栏以前从来没有开过。' },
        { label: '查公司那头是谁退的单', run: { intel: 4, track: { sin: 1 } },
          after: '退单的操作人是一个已经离职的结算员，账号还在用。你顺着会话记录往上翻，翻到一条他给别人的消息：这个人的单子先别过。消息发出去的日期，比你第一次去那家诊所还早。' },
      ] },
    { id: 'y26', portrait: 'portrait-fixer', district: 'slum', title: '老鸦把抽头从两成改成三成',
      text: '你替灰市跑的那条线，抽头一直是两成。今天老鸦把你叫到巷子里，说要改成三成，从这个星期开始。他说上面换了人，他自己的份子也从三成变成四成。巷口停着一辆电车，车上两个人在等他的答复，一个在看表，一个在看你。巷子里的地面是湿的，电车没有熄火。',
      options: [
        { label: '答应，但要把上面的线介绍给你', run: { grantCard: { n: 1, path: 'control' }, track: { sin: 2, power: 1 } },
          after: '老鸦愣了一下就答应了。第二天他领你去见了一个不报名字的人，对方递来一张操控指令卡，目标写着「下层三街自来水阀」。这张卡的纸质比灰市平时流水用的好得多。抽头从此三成，你没有再谈过。' },
        { label: '不答应，这条线换人做', run: { money: -30, track: { renown: 1, loyalty: -1 } },
          after: '你退出这条线，把原来的三个下线带走。老鸦没有拦，只是当着你的面把抽头写在墙上，还是三成。三个月后那条线散了，接手的两个人一个进了回收场，一个再也没有出现过。' },
        { label: '答应，但要求账目每月当面对', run: { intel: 3, track: { power: 1, sin: 1 } },
          after: '老鸦每个月十号跟你对账，头两次账目很干净。第三个月多出一笔你没见过的支出，名目写着「场地」。你问场地在哪，他说是给别人腾的地方。这句话说完，他把账本合上了。' },
      ] },
    { id: 'y27', portrait: 'portrait-lu', district: 'slum', title: '后巷诊所里一场没有登记的截肢',
      text: '后巷的诊所里在动一场没有登记的手术，屋里只点了两盏灯。陆晚出来过一次，手套上是血，让你帮忙把一辆推车推到后门，推车上的东西盖着白布，形状不是人的形状，但重得不像器械。远处有巡逻车的声音，正在往这条巷子拐。远处那声音不连续，隔着两堵墙才听得出是车。',
      options: [
        { label: '把推车推走，推到最远的那条巷', run: { intel: 2, vitality: -1, track: { sin: 2, power: 1 } },
          after: '你把车推到巷尾，掀开布看了一眼，是一只改装过的义体腿，编号被人刮掉了。你在原地等了一刻钟，巡逻车没进巷子。第二天，这辆车出现在回收场的拆解台上，编号那一栏已经磨平。' },
        { label: '不推，把诊所的事报给巡逻', run: { track: { loyalty: 2, renown: -2, sin: 1 } },
          after: '你报了，巡逻队来了三个人，在其中一盏灯下面站了一会儿，没有进屋，只贴了一张整改通知。第二天，这家诊所的窗子用木板钉上了半扇。陆晚没有问是不是你报的，你也没有说。' },
        { label: '推走，但把车上的东西换下来一件', run: { gear: 1, intel: 2, track: { sin: 2 } },
          after: '你换下来一只还没拆封的关节，塞进外套，剩下的推到地方。陆晚后来清点时看了你一眼，什么也没说。那只关节你一直没敢用，放在柜子里，包装上那串编号你查过一次，查不到。' },
      ] },
    { id: 'y28', portrait: 'portrait-enforcer', district: 'slum', title: '一张贴错了楼号的回收通知',
      text: '一张回收通知贴在你住的那栋楼门口，楼号写的是隔壁，但名单上有你的名字，字很小，排在第九位。名单上其他人你都认识，都是这半年陆续搬走的。贴通知的人没有留联系方式，胶水抹得很厚，撕下来会带掉一层墙皮。浆糊抹得很厚，边角已经翘起一处。',
      options: [
        { label: '撕掉，去隔壁楼问一圈', run: { intel: 3, grantCard: { n: 1, path: 'purge' }, track: { renown: 1, sin: 1 } },
          after: '隔壁楼的名单上也有九个名字，头一个就是你那份上排第一的。两栋楼合起来十七个人。楼里的管理员说不认得这张单子，临走却塞给你一张清洗指令卡，目标写着「三号楼夜间巡查」，说是上面发下来没人接的。' },
        { label: '拍照留证，报给集团内审', run: { intel: 2, chips: 1, track: { loyalty: 2, renown: -1 } },
          after: '内审回了你一份受理编号，说这张通知不是集团制式，可能是仿印。你按编号又问了两次，答复都是正在核实。那面墙上的胶印留着，过了一冬也没人清过，来年下雨才泡掉。' },
        { label: '当没看见，照旧过日子', run: { track: { sin: 1, loyalty: -1 } },
          after: '你没有撕它，也没再看第二眼。三个月里，名单上第九位之后的三个名字都搬走了，理由栏统一写着「个人原因」。你的名字一直在第九位，纸角翘起来，字迹被雨泡过又干了。' },
      ] },
    { id: 'y29', portrait: 'portrait-ghost', district: 'slum', title: '楼道里轮值保管的一只药箱',
      text: '三个地下诊所共用一只药箱，今晚轮到你保管。药箱的铜挂锁换成了一把磁扣锁，锁上印着集团医材的编号。打开看了一眼，底层多了一排没有标签的小瓶，瓶子外面还贴着一张追踪标签，标签的激活状态是开启的。挂锁的钥匙只有两把，另一把在别人手里。',
      options: [
        { label: '撕掉追踪标签，留几瓶备用', run: { gear: 1, intel: 2, track: { sin: 2 } },
          after: '你把标签撕下来贴在楼下的垃圾桶上，瓶子留下三支。第二天早上那只垃圾桶不在原位，被换成了新的。三天里没人再找你，但那三支瓶子你再没敢动过，一直塞在药箱的最底下。' },
        { label: '不拆封，原箱交给下一班', run: { track: { renown: 1, sin: -1 } },
          after: '你把箱子原样交出去，交接时数了三遍，数目都对。下一班的医生当着你的面打开箱子，那排没标签的瓶子还在。她看了一眼就合上了，说：这批不是我们的。' },
        { label: '把药箱整个退回给医材部', run: { track: { loyalty: 2, renown: -2 } },
          after: '医材部收下了箱子，登记时把整箱划为「报废回收」。两周后，三个地下诊所的常用药同时断了三种，你要用的那种排在第一。医材部的答复是补货周期四十五天，没有加急通道。' },
      ] },
    { id: 'y30', portrait: 'portrait-lu', district: 'slum', title: '一个抱孩子的女人要借你的身份',
      text: '一个女人在诊所门口拦住你，抱着一个五六岁的孩子，要用你的身份登记住院。她说自己的身份在三天前被划成了「已注销」，任何一家诊所收她都是违规。孩子的额头很烫，抱着人的手在抖。登记终端就摆在门口的台子上，读卡口亮着。终端上的读卡口红着，一直在等一张卡。',
      options: [
        { label: '用自己的身份登记', run: { money: -25, vitality: -1, track: { renown: 3, loyalty: -2, sin: 1 } },
          after: '登记通过了，孩子的名字挂在你名下，护士看了你两眼，没有多问。孩子的烧当天就退了。三天后，你的档案里多出一条亲属关系记录，你申请删除，行政说要走三道审核，目前还挂着。' },
        { label: '不登记，给她钱走别的门路', run: { money: -35, track: { renown: 1, sin: 1 } },
          after: '你给了钱，让她去找陆晚。陆晚收下了孩子，用的是诊所自己的应急额度，额度这个季度已经透支了两次。你在巷口站了一会儿，孩子被抱进去的时候没有哭。' },
        { label: '拒绝，让她去找社区登记点', run: { track: { loyalty: 1, renown: -2 } },
          after: '你指了路，登记点在两条街外，晚上八点关门。你没有再看她。第二天早上路过那家登记点，门口的长椅上没有人。诊所那天照常开门，陆晚比平时早了半小时。' },
      ] },
    { id: 'y31', portrait: 'portrait-fixer', district: 'slum', title: '灰市牌桌上出现的一份单子',
      text: '灰市的墙上今天贴出一份单子，写着七个名字和对应的价码，最贵的一个排在第三。你的名字在第六位，价码是四百二。老鸦说这是给外地来的买主看的，谁也说不准买主会挑哪个。他把一支笔递给你，说想划掉的话现在就可以划。单子用的是灰市惯用的那种纸，边上有毛刺。',
      options: [
        { label: '划掉自己的名字', run: { money: -40, track: { sin: 1, loyalty: -1 } },
          after: '你划了，老鸦当着你的面把单子重新抄了一遍，第六位换成了一个你不认识的名字。划掉是要给钱的，这规矩你知道。三周后，那位替代者的名字出现在了一则回收简报里，位置很靠后。' },
        { label: '不划，但把买主的来路问清', run: { intel: 4, track: { sin: 1, power: 1 } },
          after: '老鸦说买主是通过三个中间人找上来的，验资用的是清算行的临时户。你顺着临时户的编号查到开户行，开户那天有一条备注：仅限一次性使用。这笔户头在单子贴出来的第二天就销了。' },
        { label: '自己买下那三个人，让他们别接这单', run: { money: -80, grantCard: { n: 1 }, track: { renown: 2, sin: 2, power: 1 } },
          after: '你出钱买下前三个人，让他们这单别接，白拿一份钱。老鸦照办。第二天那位买主亲自来了，递给你一张没有署名的指令卡，说既然你把活退了，就自己干。卡面目标写着「灰市三巷库房」。' },
      ] },
    { id: 'y32', portrait: 'portrait-clerk', district: 'slum', title: '楼栋管理员要收一笔安静费',
      text: '楼栋管理员在一层贴了通知，说本楼这个季度的「噪音投诉」超标，每户补交一笔安静费。通知是复印件，没有公章，落款日期是三天后。他自己站在通知旁边，手里拿着一沓收据，收据是手写的，编号连号。他认得楼里每一个人，包括你。收据的数字写得很快，有几个压到了下一行。',
      options: [
        { label: '交钱，拿一张收据', run: { money: -20, track: { renown: 1, sin: -1 } },
          after: '你交了钱，收据上写着「安静费」，编号是 0071。你把它夹进门缝里的电费单一起。三天后，楼里的公告栏换了一张新通知，说安静费取消，已交的凭收据退款。你没有去退，那张收据第二年还在门缝里。' },
        { label: '不交，把这件事报给管委会', run: { track: { renown: 2, loyalty: -1 } },
          after: '管委会说管理员不是他们的人。你回头去找，一层那个位置换了人，新来的是个年轻人，收据本也换成了带公章的。他把新旧两本放在一起，编号连不起来，中间少了三十多号。' },
        { label: '不交，反过来问他这笔钱归谁', run: { intel: 3, track: { power: 1, sin: 1 } },
          after: '他说归楼栋自管小组，小组的账户你去查了，开户不到两个月，流水七笔，全部是整数。他第二天就把通知撕了，收据本也收走了。楼里再没人提过安静费，只是走廊的灯换成了更暗的一款。' },
      ] },
    { id: 'y33', portrait: 'portrait-tie', district: 'docks', title: '一张凌晨三点被人改过的过磅单',
      text: '过磅单压在门房的玻璃下面，时间是凌晨三点零六分，重量一栏被人用铅笔改过一次，改后的数字比原数多了十四吨。门房的人说这单是铁贵签的字，可铁贵这个星期一直在医院。单子背面有一串手写的柜号，柜号开头的字母，是已经停用的老码头编号。',
      options: [
        { label: '去老码头找那个柜子', run: { intel: 3, gear: 1, vitality: -1, track: { sin: 1 } },
          after: '柜子停在废轨上，锁是新的。你撬开一条缝，里面是空箱，箱底铺着一层防潮纸，纸上有压过的痕迹，形状像两排并列的圆筒。你合上柜门时，远处传来一声短促的汽笛，没有船进港。' },
        { label: '把单子交给铁贵手下的人', run: { intel: 2, track: { renown: 1, loyalty: -1 } },
          after: '你把单子递过去，对方看了三秒就撕了，撕得很碎，扔进了卸货口的排水沟。他说这几天别来港区。第二天，老码头那段废轨被封，理由是结构检修，工期四十五天。' },
        { label: '照单把重量差额填进自己的库存', run: { money: 45, track: { sin: 2 } },
          after: '你把十四吨挂在自己名下，随货一起出港。这笔账在系统里躺了两个月，没人碰。第三个月码头盘库，盘出来的差额正好十四吨，盘库报告上写的是「历史遗留误差，不建议追查」。' },
      ] },
    { id: 'y34', portrait: 'portrait-tie', district: 'docks', title: '一箱从吊机上下来的无标货',
      text: '吊机吊下来一箱没有标签的货，箱门缝里渗出类似血的气味。值班的人全都不见了，只剩下你和这箱东西。按规定，无标签货物要在两小时内退港，退港单要两个人签字，另一个签字人今天调休。箱门缝里渗出来的气味越来越重，值班室的门还开着。',
      options: [
        { label: '开箱，看一眼再决定', run: { gear: 2, intel: 3, vitality: -2, track: { sin: 1 } },
          after: '箱里是十二副冷冻保存的脏器，每副都带着编号，编号体系和研究所的样本一致。你重新钉好箱盖，把气味最重的那一角擦了一遍。退港单你一个人签了，另一个人那栏画了一道横。' },
        { label: '按规程退港，把单子递上去', run: { chips: 1, track: { loyalty: 2, sin: -1 } },
          after: '你一个人走完全套流程，退港单被受理，编号进了当日台账。三天后，港区发来一份通报表扬，表扬人写的是你的部门。同一天，那箱货出现在了另一班船的舱单上，货名一栏是空的。' },
        { label: '拖到冷库深处，等风头过去', run: { money: 40, intel: 2, track: { sin: 2, power: 1 } },
          after: '你把箱子推进冷库最里面，用一批旧托盘挡住。五天后来了一辆没有牌照的车，把箱子拉走，付款用的现金。来人什么都没说，只留了半张名片，上面印着一个已经注销的转运公司。' },
      ] },
    { id: 'y35', portrait: 'portrait-enforcer', district: 'docks', title: '港区罢工进行到第四天的上午',
      text: '罢工进入第四天，装卸区停了十六条船，其中三条是急货。董事会的通知是三天内复工，工人要的是一句准话。铁贵让人带话给你：只要你说这次不是他们先动的手，他就让夜班先上人。今天中午之前必须给出答复。夜班的人已经到齐了一半，都站在铁门后面。',
      options: [
        { label: '替他这句话背书', run: { grantCard: { n: 1, path: 'expand' }, track: { renown: 3, loyalty: -3, power: 1 } },
          after: '你在港区食堂当着八十个人的面说了这句。夜班当晚复工，急货装完两条。铁贵塞给你一张扩张指令卡，目标写着「三号装卸班组」，说这是他自己那副牌里不用的。董事会那边当天下午把你从急货对接人里划掉了。' },
        { label: '按董事会口径强推复工', run: { track: { loyalty: 3, power: 2, renown: -2, sin: 1 } },
          after: '安保入场，两条船当天装完，第三条拖到第二天凌晨。复工率报上去是九成，实际到岗的只有六成。之后一个月，港区的交接班记录里出现了十一次「设备故障」，每次都在夜班。' },
        { label: '不表态，私下垫一笔钱', run: { money: -45, track: { renown: 1, sin: 1 } },
          after: '你让老鸦把钱发下去，用停工补贴的名目，来源写成外部捐赠。工人们拿了钱，第三天勉强复工。董事会问起钱从哪来，你说不知道，事后也没有人再查这笔账。' },
      ] },
    { id: 'y36', portrait: 'portrait-ghost', district: 'docks', title: '港区调度系统在凌晨重排了一次',
      text: '港区调度系统在凌晨两点自动重排了一次泊位，把三条船的靠泊顺序整体倒了过来，重排理由一栏是空的。重排后，三号泊位上多出一个四小时的窗口。值班调度员说这不是他做的，他的账号那一夜只登录了一次，登录地显示在环带。重排后的表格里，三号泊位那一行底色是灰的。',
      options: [
        { label: '在窗口期去三号泊位蹲一晚', run: { intel: 3, vitality: -1, track: { sin: 1 } },
          after: '你在集装箱后面蹲了三小时，两点四十来了一辆高架车，卸下两只箱子就撤了。箱子上没有船名，只有一串手写的粉笔号。天亮后调度系统又重排了一次，把泊位顺序恢复成了原来的样子。' },
        { label: '把重排日志报给信息安全', run: { intel: 2, chips: 1, track: { loyalty: 2, renown: -1 } },
          after: '信息安全受理了，回复说这是一次例行优化，日志已归档。你申请调阅，拿到的是摘要版，三点四十分那一段被标成了「系统自动维护」。摘要版最后一页有个人名，是签发人，签的是你的名字。' },
        { label: '不动系统，只在三号泊位加装一个摄像头', run: { gear: 1, intel: 3, track: { power: 1, sin: 1 } },
          after: '摄像头装好，第三天凌晨拍到了一段影像，你取回来播放，画面里只有两只箱子在动，没有看到人也没有看到车。你把录像循环放了四遍，才发现地面上的影子是从泊位外侧斜着进来的。' },
      ] },
    { id: 'y37', portrait: 'portrait-tie', district: 'docks', title: '装卸工会这一届的头目选举',
      text: '装卸工会要换一届头目，这次有两个人报名，一个是铁贵推的旧人，一个是码头上新冒出来的年轻人。选票印好了，一共八百张，投票明天开始。两个人都来找过你，一个要你出人维持秩序，一个要你出面说句话。选票的纸是回收场裁的，边上留着毛边。',
      options: [
        { label: '替铁贵的人出头', run: { money: 35, track: { power: 2, renown: -1 } },
          after: '你调了六十个人维持秩序，投票当天没出岔子，旧人以四百七十票当选。三天后，你收到一份装卸费分成的新比例，比原来高半个百分点。年轻人的名字从会员名册上消失了，注销理由是「主动退会」。' },
        { label: '替年轻人说一句话', run: { grantCard: { n: 1, path: 'control' }, track: { renown: 3, power: 1, loyalty: -2 } },
          after: '你在交接班会上说了一句，说码头该让新人试试。年轻人最后以十一票之差输掉。输完那天晚上他找到你，把一张操控指令卡放在桌上，目标写着「工人食堂三档口」，说这是他在牌桌上赢来的，用不上。' },
        { label: '两边都不见', run: { track: { sin: -1, renown: 1 } },
          after: '你两天没去码头。投票结果照旧，旧人赢，票数比预计的少了四十。事后两个人都没有再来找你。港区的交接班照常，只有食堂的价目表在一个月后涨了一档。' },
      ] },
    { id: 'y38', portrait: 'portrait-enforcer', district: 'docks', title: '一艘船身上没有名字的货船',
      text: '船靠了岸，船身上没有名字，吃水线比载重表上画的深。船上的人点名要见你，说是老鸦介绍的。他们带来的东西既能救一些人，也能让很多人闭嘴，货还压在舱底，天亮前必须卸完。船靠得比规定位置往里两米，跳板是自己搭的，抽水机一直在响，响得很有规律。',
      options: [
        { label: '见，接下这单', run: { money: 60, gear: 1, track: { sin: 2 } },
          after: '货是三十箱没有批号的抗生素，你当晚卸完，钱当场结清。这批药一周后出现在三个地下诊所，价格比市面低一半。你要的那一箱留在港区库房最里侧，现在还没有开过。' },
        { label: '见，然后举报', run: { intel: 2, chips: 1, track: { loyalty: 3, renown: -2 } },
          after: '你把船位和卸货时间报了上去。巡查队凌晨四点到了，船已经空了，舱底只剩下压舱水。你的举报记录被受理，编号很高。老鸦那边当天断了你一条线，第二天又接上了，只是抽头涨到了三成五。' },
        { label: '不见，让人把船赶走', run: { track: { sin: -1, renown: 1, loyalty: -1 } },
          after: '你让值班的人放话，船半小时后离港。第二天海上起了雾，那条航道封了半天。你听说那天夜里有一艘小船在防波堤外漂了很久，天亮时不见了。港区没有人提这件事。' },
      ] },
    { id: 'y39', portrait: 'portrait-tie', district: 'docks', title: '七号冷库那批货要放一次风',
      text: '七号冷库的压缩机今天凌晨报了一次警，修好以后温度回升了两度，停了四十分钟。库里存着一批需要恒温的货，货主是清算行的关联公司。按规定，温控异常要在两小时内报备，报备以后这批货要做报废处理。货主那边已经来了人，站在办公室外面等着。',
      options: [
        { label: '按规程报备，让这批货走报废', run: { intel: 2, track: { loyalty: 3, renown: 1, sin: -1 } },
          after: '你报了备，报废流程当天启动，货主在场全程录像。报废结论出来那天，清算行发来一份函，说这批货已完成核销。函件里附了一张明细，明细上的数量比你库里实际存的多了两箱。' },
        { label: '不报，把四十分钟改成十二分钟', run: { money: 55, track: { sin: 2, power: 1 } },
          after: '你在记录上改了时间，货主那边的签收人也改了。这批货顺利放行，到港时温度正常。半个月后，货主公司的质检报告里多了一行小字，说该批次存在「记录存疑」。这份报告没有流出他们内部。' },
        { label: '报备，但要求清算行出一份补充保证', run: { intel: 3, track: { power: 1, renown: -1, sin: 1 } },
          after: '你要了一份补充保证，清算行的人当天就签了，落款用的是印章而不是签名。这份保证你收进抽屉。三个月后，同一批货在另一个港区出了事，你那份保证被调走，调走单上是戴思远的名字。' },
      ] },
    { id: 'y40', portrait: 'portrait-enforcer', district: 'docks', title: '港区夜班整整一个班组丢了九个人',
      text: '夜班第四班组一共九个人，交接的时候进来五个，签退一个也没有。调度说九个人都在系统里正常签退过，签退时间集中在凌晨四点十二分。五点整，有人看见四班组的工具包整整齐齐摆在休息室地上，九个，一个不少。休息室的灯还亮着，插座上插着九个充电头。',
      options: [
        { label: '把人一个个查到底', run: { intel: 4, vitality: -1, track: { sin: 1 } },
          after: '你查到六个人，剩下的三个地址一栏都是同一个门牌号，这个地址在环带维修层，是一间已经废弃的配电间。你去过一次，门上挂着一把没有锁孔的锁。九个人的工具包最终按无人认领处理了。' },
        { label: '报案，把记录交给巡查队', run: { chips: 1, track: { loyalty: 2, renown: -1 } },
          after: '巡查队来了两个人，做了笔录，登记了九个工号。三周后结案，结论写的是「集体离职，程序合规」。你申请看签退记录原件，原件已按流程销毁，销毁审批人签名潦草，看不清姓。' },
        { label: '先压下这件事，私下问铁贵', run: { intel: 3, track: { power: 1, sin: 1 } },
          after: '铁贵说这九个人里，有四个上个月找过他问过去环带的门路，他没答应。说完他把烟掐了，说四班组以后不要了。第二天，港区招工启事贴出来，四班组那一栏被整块涂掉。' },
      ] },
    { id: 'y41', portrait: 'portrait-clerk', district: 'orbit', title: '候补名单上被划掉又补上的一行',
      text: '候补名单重新公示了一次，你的名字还在，只是往后挪了十七位。挪的位置上换成了一个编号，编号后面写着「优先」。排在你前面的人这半年一个一个被叫到，叫到以后没有一个回来过。公示栏的玻璃今天裂了一道，裂缝正压着你的名字。公示栏前面没人站，玻璃上的裂缝是从下往上走的。',
      options: [
        { label: '接住那张「优先」，把名额换成东西', run: { intel: 2, chips: 2, vitality: -1, track: { loyalty: -1, sin: 1 } },
          after: '你把优先权转给了一家中介，换回两份信息和一个不记名的通行条。第三天那家中介的门锁着，玻璃上贴着一张手写的通知，说本店暂停营业。你的名字仍在名单上，只是后面那个「优先」不见了。' },
        { label: '查是谁把你挪下去的', run: { intel: 4, chips: 1, track: { sin: 1 } },
          after: '挪动记录在一个已经停用的调度账号名下，那个账号的最后一次操作是两年前。你顺着它往下查，查到一串转岗名单，八个人都在这半年内的同一周被划掉，划掉用的同一支笔。' },
        { label: '自己申请从名单上撤下来', run: { track: { loyalty: 2, renown: -1, power: -1 } },
          after: '你递交了撤榜申请，需要两道签字，第一道当天就过了。第二道一直卡着。一周后，引航处来了一个人，问你为什么要撤，他说他记得你，你去年替别人排过一次队。' },
      ] },
    { id: 'y42', portrait: 'portrait-yuke', district: 'orbit', title: '引航票务退回来的一张旧票根',
      text: '引航处退回来一张票，乘客一栏是你的名字，航次是七年前的首班。票根上的座位号被划掉又写了一遍，写的是另一个人的姓。退票理由写着「乘客未到达」，可这张票从来没有人使用过，也没有人取消过。柜台后面的机器今天打不出新票。机器出票口的纸卷还剩一半，边上卡着一角旧票。',
      options: [
        { label: '查这张票的原持有人', run: { intel: 4, track: { sin: 1 } },
          after: '原持有人的档案里照片是空的，只有一栏备注：随首批离站。首批的日期比你入职早三个月。你去看那次航班的舱单，舱单上这个姓氏出现了两次，另一个名字被涂掉了，涂得很厚。' },
        { label: '把票留着，不追', run: { gear: 1, intel: 2, track: { sin: 1 } },
          after: '你把票根夹进工作证夹层，此后每次过闸机都会响一声，安保查了两次也没查出问题。半年后你在清理夹层时发现，票根上的座位号又变了，这一次写的是一个你不认识的名字。' },
        { label: '把票交回引航处并登记异议', run: { track: { loyalty: 2, renown: 1 } },
          after: '你交了异议，引航处当场受理，编号留了底。三天后他们回复，说这张票是制票机的余票，属于系统误差。回复便签的签名栏，盖的是引航处的旧公章，这个章两年前就换掉了。' },
      ] },
    { id: 'y43', portrait: 'portrait-witch', district: 'orbit', title: '穹顶外侧停住不动的一小片云',
      text: '观景窗外的云今天压得很低，能在云里看见一条直线，像被谁用尺子量过。值班的人说这是气流，不是气流。云走得很慢，走到四十一号接缝外侧时停了一下，停了大概两分钟，然后继续往东。观景层的游客都举着终端在录。玻璃上留着一层薄雾，是有人在上面站久了留下的。',
      options: [
        { label: '把这段影像买下来', run: { intel: 3, track: { sin: 1 } },
          after: '你从一个游客手里买下了原始影像，付现金。回去逐帧看，云停的那两分钟里，四十一号接缝外侧的雨是往上走的。你把这段单独剪出来，锁进了离线盘，再没有打开过。' },
        { label: '上报观测记录', run: { chips: 1, track: { loyalty: 3, renown: -1 } },
          after: '你把记录提交给观景层管理方，管理方转给了一个你查不到的部门。三天后，观景层贴出告示，说近日设备存在成像偏差，已修复。你再看那片云，云是直的，没有再停。' },
        { label: '去四十一号接缝外侧站到云走的那个位置', run: { intel: 4, vitality: -2, grantCard: { n: 1, path: 'purge' }, track: { sin: 2, loyalty: -2 } },
          after: '你在接缝外侧站了四十分钟，雨把外套泡软了。回来时袖口里多了一张清洗指令卡，纸质粗糙，边角发绿，卡面目标写着「观景层巡场」。你不知道它是什么时候塞进去的，那件外套后来你烧了。' },
      ] },
    { id: 'y44', portrait: 'portrait-ghost', district: 'orbit', title: '舱单上多出的一位无名乘客',
      text: '一艘定期客船的舱单上多了一个乘客，姓名栏是空的，座位号却填得很实，就在你去年坐过的那个位置上。船务的人说这个位置这一趟没卖票。名单是系统出的，系统里那行记录的开头，跟你去年的订单号只差最后一位。座位号是三等舱靠窗那一个，票样是上一代的。',
      options: [
        { label: '按名单上船，坐到那个位置上', run: { intel: 4, vitality: -1, track: { sin: 1, loyalty: -1 } },
          after: '你换了票上船，那个座位靠着舷窗，桌板下面贴着一张旧标签，是你的字迹。船开了四十分钟，广播念了一遍乘客名单，念到空姓那一栏时跳了过去。你在终点站下车，没有人查你的票。' },
        { label: '把异常报给船务调度', run: { intel: 2, chips: 1, track: { loyalty: 2, renown: -1 } },
          after: '调度查了一遍，说那行记录是缓存残留，已经清了。你要求打印清库前的日志，拿到手的是两页，中间少了一页，页码还断在 2 和 4 之间。你把它折好放进口袋，没有再问。' },
        { label: '记下座位号，把票退掉', run: { intel: 2, money: 15, track: { sin: -1, renown: 1 } },
          after: '你把票退掉，拿回了大半票款。退票那天下了一场小雨，穹顶内侧的地面是干的。你把座位号写在便签上贴进抽屉，一年后再看，那串数字在纸上淡了一半，像被水洇过。' },
      ] },
    { id: 'y45', portrait: 'portrait-yuke', district: 'orbit', title: '离港检疫隔间的一张复检单',
      text: '离港检疫隔间里挂着一张复检单，编号是当天最早的。单子上的人昨天进过隔间，今天又进了同一个隔间，两次的检疫员签名不一样，笔迹却是同一只手写的。隔间的窗帘拉了一半，里面的灯一直亮着，没有人出来。隔间的排风一直开着，门缝下面有纸片在动。',
      options: [
        { label: '敲门进去，看是谁', run: { intel: 3, vitality: -1, track: { sin: 1 } },
          after: '里面是一个中年男人，坐在椅子上，手臂上插着两支采血管。他说他每天来，已经来了十一天，单子是别人替他填的。你看了眼单子，编号栏从 1 写到 11，都是同一天的日期。' },
        { label: '把复检单抄一份带走', run: { intel: 3, chips: 1, track: { sin: 1, power: 1 } },
          after: '你抄下编号和人名，走的时候没有回头。三天后，隔间里的那个人不在了，检疫单也换成了空白的。你把抄写的纸拿给陆晚看，她说这个病她见过，不该出现在这里。' },
        { label: '不介入，把隔间报给巡查', run: { track: { loyalty: 2, renown: -1 } },
          after: '巡查来了四个人，把隔间封了半天，重新做了一次登记。当天下午所有离港检疫流程提速了一倍，排队的人抱怨，没有人再提那个隔间。窗帘这次是全部拉上的。' },
      ] },
    { id: 'y46', portrait: 'portrait-witch', district: 'orbit', title: '女术士的代理人在候机厅坐了一天',
      text: '银面坐在候机厅第三排，什么都没带，也没有买票。它从上午坐到现在，看着每一班离港的人过闸。等你经过的时候，它说了一句话，说你上周在交易所点过头的那个人，今天不会登机。广播正在念登机号。候机厅里播了三遍登机通知，第三遍漏了两个名字。',
      options: [
        { label: '问它为什么告诉你', run: { intel: 3, track: { power: 1, sin: 1 } },
          after: '它说因为它收过那个人的钱，收钱办事，事没办成，钱要退。说完它把一枚旧筹码放在椅子上就走了。你捡起筹码，背面刻着一个编号，这个编号属于一个已经注销的俱乐部。' },
        { label: '去登机口拦住那个人', run: { vitality: -1, track: { renown: 2, sin: 1, power: -1 } },
          after: '你在闸机前拦住了他，他愣了几秒，转身改签。当天那班船起飞后四十分钟，通讯里播报了一次舱压异常，没有人员伤亡。他第二天请你喝了一次茶，没提为什么。' },
        { label: '什么也不做，照常登机', run: { track: { sin: 1, loyalty: 1 } },
          after: '你上了船，舱里有一半的空位。落地后你听说那班船延误了两个小时，原因没有公布。候机厅第三排那把椅子，椅面上留着一块圆形的印子，像是有人坐了很久。' },
      ] },
    { id: 'y47', portrait: 'portrait-clerk', district: 'orbit', title: '轨道港冷舱停电的那六个小时',
      text: '冷舱停电六小时，里面存着要运往外站的两百份样本。备用电源切进来时，温度已经回到零上。样本的货主是研究所，研究所那边没有打电话来问，倒是清算行先来了人，站在冷舱门口对着一份清单核对。冷舱门上的温度计还停在零上，指针歪了一点。',
      options: [
        { label: '照实报损，并附温控记录', run: { intel: 2, track: { loyalty: 3, renown: 1, power: -1 } },
          after: '你把记录附着一起报上去，研究所当天回函，说这批样本同意报废。清算行的人站在旁边看完了整个过程，临走时把清单收走了一份。报废清单上多出来的两箱，最后也没有人解释。' },
        { label: '挑出还能用的，重新贴标', run: { money: 40, grantCard: { n: 1, path: 'expand' }, track: { sin: 2, power: 1 } },
          after: '你挑出九十份看着没问题的，重新贴了批次标，发往外站。三周后外站回传的接收单上一切正常。清算行的人第三次来的时候，给了你一张扩张指令卡，目标写着「轨道港二号冷舱」。' },
        { label: '让清算行的人自己去数', run: { intel: 3, track: { sin: 1, loyalty: -1 } },
          after: '你把冷舱钥匙交出去，自己在办公室等。他们数了五个小时，出来的数字比你记录的多三十份。他们向你要签字确认，你没有签。第二天那份清单被编入内部档案，编号是你的部门号加一串流水。' },
      ] },
    { id: 'y48', portrait: 'portrait-out', district: 'orbit', title: '观景层投诉箱里的一封实名信',
      text: '观景层的投诉箱里躺着一封信，投诉对象写的是穹顶本身。写信人说，透过观景窗看到的雨是斜的，可落在玻璃上的声音是直的。信纸背面贴着一小块干掉的苔，绿色的，不是穹顶内侧会长的东西。信是实名投的，署名写在你部门。投诉箱的投口朝下开，信要折三折才塞得进去。',
      options: [
        { label: '去找到写信的人', run: { intel: 3, vitality: -1, track: { sin: 1 } },
          after: '写信的人已经不在观景层了。他的工号在系统里显示为「已转岗」，去向是一栏空白。你把那块苔带在身上，回来查了图鉴，说这种苔只长在常年潮湿、酸度高的地方，穹顶内侧没有这种地方。' },
        { label: '把信转给舆情科并附说明', run: { track: { loyalty: 3, renown: 1, sin: -1 } },
          after: '舆情科受理了，回执上写着「已按常规信处理」。三周后观景层换了一批玻璃，换成更厚的。投诉箱还在原位，锈了一层，箱口朝下开，往下倒的时候会卡住。' },
        { label: '自己写一份回复，投回信箱', run: { track: { renown: 2, sin: -1, loyalty: -1 } },
          after: '你写了两百字，告诉他雨声的事没有问题，是风的缘故。投回去的时候箱子是满的。第二天你把箱子里的信都倒了，一共十九封，其中八封写的是同一件事，署名各不一样。' },
      ] },
    { id: 'y49', portrait: 'portrait-ring', district: 'ring', title: '环带维修层里那处往上爬的渗水',
      text: '四十一号接缝内侧有一处渗水，从上周开始，水位线每天都往上抬半厘米。巡检记录里写着「微量渗出，观察」。渗出来的水是绿的，味道很淡，落在管壁上留一道白痕。荀戒说他值了四年夜班，没见过这一处渗水。渗水的地方管壁发白，白痕一直往下走了一米多。',
      options: [
        { label: '把渗水点单独取样', run: { intel: 4, vitality: -1, track: { sin: 1 } },
          after: '你取了一小瓶，第二天瓶壁出现了一层绿膜，瓶子已经换过两个。你把样本交给陆晚，她看了一眼说这不是雨水，比雨水酸得多。样本最后封在诊所的冷藏柜里，标签上只写了日期。' },
        { label: '照记录填「继续观察」', run: { track: { loyalty: 2, sin: 1 } },
          after: '你按原样填了。两星期后那一处旁边又出现了第二处。巡检班的人开始从那段走廊绕行，绕行记录的路程比原来多了两百米，考勤上没人提这件事。水位线继续抬。' },
        { label: '上报警报，要求整段停用', run: { chips: 1, track: { loyalty: 2, renown: 1, power: -1, sin: -1 } },
          after: '警报上去了，那一段封了四天，做了一次全面检查。结论是接缝密封件老化，已更换。新的密封件型号和生产日期你查了一下，是七年前的批次，出库单上没有。' },
      ] },
    { id: 'y50', portrait: 'portrait-ring', district: 'ring', title: '巡检记录里被涂黑的一整个班次',
      text: '这个季度的巡检记录里有一整个班次被涂黑了，用的是标准修改液，涂得很平。那一班应该是上周三的夜班，当班的人现在是三个人，涂黑后的表格里只剩两个人。第三个名字在纸背面压出的凹痕里还看得出来，姓荀。修改液的反光是哑的，别处的纸面有光。',
      options: [
        { label: '把纸对着灯照，抄下凹痕里的名字', run: { intel: 4, grantCard: { n: 1, path: 'expand' }, track: { sin: 1 } },
          after: '凹痕里是两个字，是荀戒带了三年的徒弟。名字你记下了，那一晚的门禁记录干净得反常。荀戒第二天照常上班，把一张扩张指令卡放在你桌上，目标写着「巡检班三号段」，说他留了半年没人接。' },
        { label: '把记录送去安保复核', run: { intel: 2, chips: 1, track: { loyalty: 3, renown: -1 } },
          after: '安保复核了一遍，出具书面意见说记录涂改属于笔误，已由当班组长确认。书面意见上签批的当班组长是荀戒。他签完之后来找过你一次，站在门口没进来，只说了一句：那天有风。' },
        { label: '按涂黑后的版本重新誊一份', run: { track: { sin: 2, loyalty: -1, power: 1 } },
          after: '你重誊了一份，字迹和原件很像。原件你收进抽屉。三个月后集团来查巡检档案，你交的是誊本，查的人翻了两页就合上了。原件在你抽屉里，涂黑那一处慢慢泛出了底下的格子线。' },
      ] },
    { id: 'y51', portrait: 'portrait-peng', district: 'ring', title: '控制室墙上不见的那把阀门钥匙',
      text: '四十一号接缝控制台的备用钥匙有两把，一把在控制室墙上，一把按规定存在研究所保险柜。今天控制室那把不见了，墙上留着一个挂钩印，挂钩还在。监控显示昨夜两点有人进来过，那人戴着手套，走的路线避开了所有明亮区域。墙上的挂钩空着，旁边挂着一条抹布，是干的。',
      options: [
        { label: '封住这一段，等钥匙自己回来', run: { intel: 2, chips: 1, track: { loyalty: 2, power: -1 } },
          after: '你把门锁换成新的，钥匙孔也换了。第三天早上，旧钥匙插在新锁旁边的墙上，插得很正。整段走廊的照明那一天全坏了，报修单是你填的，维修记录上写着「光管批次问题」。' },
        { label: '带着人去查另一把钥匙', run: { intel: 3, vitality: -1, track: { sin: 1, power: 1 } },
          after: '保险柜看不出被开过，里面的钥匙还在，只是齿口被磨过一遍，磨得很轻。彭戬把钥匙拿去比对，说磨损方向不对，像是被反着插了很多次。他没有把这句话写进报告。' },
        { label: '当作丢失上报，承担失窃责任', run: { money: -35, track: { loyalty: 3, sin: -1, renown: 1 } },
          after: '你在报告里写了自己保管不严。集团扣了一笔赔偿，数目比钥匙的市价高很多。半个月后，那把钥匙出现在回收场的旧件堆里，编号被磨掉了，荀戒认出来是因为齿口上有一道他做的记号。' },
      ] },
    { id: 'y52', portrait: 'portrait-ring', district: 'ring', title: '备用件柜上少了一批密封圈',
      text: '备用件柜上少了三百个密封圈，账面上写的是「现场领用」。领用单的编号连号，签字栏是同一个人，七天里领了六次。你今天在走廊上碰到这个人，他手里什么都没有，工装洗得很干净，指甲缝里也没有黑。柜子那一格里剩下的密封圈码得很整齐，方向一致。',
      options: [
        { label: '跟踪他一整天', run: { intel: 3, vitality: -1, track: { sin: 1, power: 1 } },
          after: '他下班后去了下层居住区，在一家五金铺门口站了一会儿，没有进去，又原路返回。他跟的这个人在领用单上写的是检修三班，可检修三班的名单里没有他。你把当天的路线记下，全在监控盲区。' },
        { label: '照单销账，向他要一张现场照片', run: { intel: 2, track: { loyalty: 2, sin: 1 } },
          after: '他给了你一张照片，拍的是四十一号接缝内侧，密封圈摆了一排，数目看着差不多。照片的拍摄时间比领用单早两天。你把照片存进档案，销账当天完成，柜子上那一格空了很久。' },
        { label: '按账追责，报给物资部', run: { chips: 1, track: { loyalty: 3, renown: -1, power: 1 } },
          after: '物资部派人来盘了一次，结论是账实相符。你不信，自己又数了一遍，柜子里确实有三百个新的，包装纸都没拆。领用单上那个人你后来再没见过，检修三班的考勤里也从来没有过这个名字。' },
      ] },
    { id: 'y53', portrait: 'portrait-ring', district: 'ring', title: '环带里的一间没有编号的配电间',
      text: '环带维修层有一段走廊，图纸上标的是配电间，实际走的是一扇钢板门，门上没有编号，也没有锁孔。门缝下面有点光，光在动，是有人走动挡住的那种。荀戒说他接班第一年就见过这扇门，那时门口还挂着「高压危险」的牌子，牌子后来摘了。走廊尽头的应急灯这两天一直亮着，没人来换。',
      options: [
        { label: '守到门开', run: { intel: 4, vitality: -1, track: { sin: 1 } },
          after: '你守了两个多小时，门是自己开的，里面没有人。房间中间摆着一张长桌，桌上摊着七八份名单，都是环带巡检班的排班表，用红笔圈了不少名字。你拍了两张，退回原位，门在你身后合上，没有响。' },
        { label: '把这件事写进巡检异常记录', run: { intel: 2, track: { loyalty: 3, sin: -1 } },
          after: '你写了三行字，册子交上去的第二天就换成了新版，异常那一页被撕掉了。新册子第一页印着「发现异常请立即上报」，落款日期是三年前。荀戒在新册子上替你补了那三行，笔迹仿得很像。' },
        { label: '带人进去，把灯具拆掉', run: { gear: 1, track: { power: 2, sin: 2, renown: -1 } },
          after: '你带了三个人，拆了里面的灯管。拆到第四根时，灯灭了整段走廊，只有门口那盏应急灯亮。你们退出来，门关上，走廊安静得能听见管壁里的水声。第二天门缝下面还是有光。' },
      ] },
    { id: 'y54', portrait: 'portrait-peng', district: 'ring', title: '巡检班这个月丢的两顶安全帽',
      text: '环带巡检班这个月报丢了两顶安全帽，报损单上写的是「意外损坏」。库房管理员说这两顶帽子其实是同一个编号换过一次，领了三次。帽子里侧的姓名贴被撕掉过，胶印还留着，撕下来的位置正对着额头。库房的领用本摊在台面上，压角的是个空杯子。',
      options: [
        { label: '顺着编号查这三次领用', run: { intel: 4, chips: 1, track: { sin: 1 } },
          after: '三次领用分属三个人，其中两个现在还在环带，第三个的人事状态是「外派待回」，外派地写的是穹顶之外。你去查这个人的班表，他最后一次进环带是四十一天前，进去以后再没有刷卡记录。' },
        { label: '给库房补一批新帽，不再追', run: { money: -20, track: { loyalty: 1, renown: 1, sin: -1 } },
          after: '你自掏腰包补了一批，库房管理员说没必要。新帽子发下去三天，那顶被撕过姓名贴的旧帽子又出现在挂钩上，内侧干干净净，看不出撕过的痕迹。' },
        { label: '把报损单原样签了', run: { track: { sin: 1, loyalty: -1 } },
          after: '你签了，报损流程当天走完。一个月后，环带那年年底的物资盘点里，安全帽一项少了七顶，报损理由统一写着「意外损坏」，签批人里的第一个名字是你。' },
      ] },
    { id: 'y55', portrait: 'portrait-ring', district: 'ring', title: '凌晨三点管壁里传出来的敲击声',
      text: '夜班三点，管壁里传出敲击声，三下一组，隔十几秒一组，敲了半个多小时。整段走廊只有你一个人。主管道里走的是冷却液，不该有这种声音。你贴着管壁听，声音是从两个检修口中间传出来的，那一段没有检修口。管壁是凉的，敲上去的声音比平时闷。',
      options: [
        { label: '敲回去，看有没有回应', run: { intel: 3, vitality: -1, track: { sin: 1 } },
          after: '你敲了三下，对面停了很久，接着回了两下。你继续敲，对面把两组变成了四下。你记下节奏，去找巡检班对，荀戒听完沉默了一会儿，说这个节奏是三十年前环带检修用的老信号。' },
        { label: '把这一段报修', run: { intel: 2, track: { loyalty: 2, sin: -1 } },
          after: '报修单第二天就被接了，维修队把那段管壁刷了一层密封胶，敲击声当夜就没了。三天后你经过那里，胶面鼓起一个指头大的泡，用手按是硬的。维修记录上写的是「管内气泡，已排除」。' },
        { label: '不管，把耳塞塞上', run: { track: { sin: 1, renown: -1 } },
          after: '你塞上耳塞，剩下四个小时听不见动静。交班时你看见交接本上多了一行别人的字：昨夜三点至三点四十，管内有敲击。这一行不是荀戒写的，也不是你的班。' },
      ] },
    { id: 'y56', portrait: 'portrait-ring', district: 'ring', title: '一个月里申请第三次换班的巡道工',
      text: '巡道工这个月第三次申请换班，理由写的是「身体不适」，附带一张没盖章的病假条。他管的正是四十一号接缝那一段，走了三年，路线熟得闭着眼都能走。今天他站在调度室门口，手里捏着那张病假条，没有递进来。调度室门口的签到表上，他那一栏已经空了三天。',
      options: [
        { label: '批他换班，问清为什么', run: { intel: 3, track: { renown: 2, sin: 1, power: -1 } },
          after: '他说那段走廊最近多了个东西，走到第一百四十步就会听见有人跟上来，回头没有人。他数过，每次都是一百四十步。你替他把班换了，当天下午自己走了一遍，走到第一百四十步，管壁响了一下。' },
        { label: '按制度打回，让他继续走', run: { track: { loyalty: 2, sin: 2, renown: -2 } },
          after: '你把病假条推回去，说没盖章不行。他第二天照常上班，第三天请假，第四天开始旷工。第五天调度室收到他的辞工单，理由一栏空着，交表的人是荀戒。' },
        { label: '给他一张指令卡，让他自己去办', run: { grantCard: { n: 1, path: 'expand' }, track: { power: 2, sin: 2, loyalty: -1 } },
          after: '你从抽屉里抽出一张扩张指令卡给他，目标写着「接缝巡检班」，说这张牌能让他名正言顺地留下，也能让那段走廊归他管。他收下卡，换了班，一周后提着两把新锁回来，说一百四十步那个地方，他锁上了。' },
      ] },
    { id: 'y57', portrait: 'portrait-dai', district: 'memory', title: '记忆柜台前排着一份拆检中的备份',
      text: '记忆银行负十八度的走廊里，恒温柜第三排有一格在拆检，柜门开着，冷气往外冒白雾。柜位标签上是一个七年前的日期。柜里的备份被取走了一半，剩下的半份标签还贴在里面，写着一个姓，这个姓在集团的任职记录里已经查不到了。白雾顺着地面往外爬，爬到门槛就散开了。',
      options: [
        { label: '调出这一格的存取记录', run: { intel: 4, track: { sin: 1 } },
          after: '存取记录一共两条，第一条是七年前存入，第二条是三天前取出，操作人一栏是空号。你把这个空号和交易所那台旧终端上的空号对了一下，是同一位。柜位标签上那个姓，同样出现在环带巡检班的旧名册里。' },
        { label: '把柜门关上，把标签抄下来', run: { intel: 3, chips: 1, track: { sin: 1, power: 1 } },
          after: '你关上柜门，抄下标签。第二天那一格的标签换成了一张空白的，柜位号往后挪了一格。你把抄下的条子给无面看，无面看了很久，说这个姓是内部的写法，外面的档案上不会这么写。' },
        { label: '上报拆检异常', run: { intel: 2, track: { loyalty: 3, renown: -1, sin: -1 } },
          after: '管理方回复说这一格属于长期委托保管，委托方已到期未续，按规定拆检销毁。回复函的落款日期是上个月，比你发现柜门开的那天早了九天。你把函件归档，那一格从此再没有亮过灯。' },
      ] },
    { id: 'y58', portrait: 'portrait-mem', district: 'memory', title: '拿着旧纸凭条来取备份的老人',
      text: '柜台前站着一位老人，出示的取件凭证是纸质的，编号是旧制式。系统里查不到这张凭条，无面说按新规只能作废。老人说这份备份是他妻子的，存进去的时候说好是七年，今天正好七年整，约定的日子一天都没差。老人把凭条放在台面上，纸已经被手帕擦过很多次。',
      options: [
        { label: '替他手动调档，把备份取出来', run: { grantCard: { n: 1, path: 'control' }, track: { renown: 3, loyalty: -2, sin: 1 } },
          after: '你走了一次特殊流程，把档调出来了。老人捧着那盒备份在走廊里坐了一刻钟，没有打开。走之前他从怀里抽出一张操控指令卡给你，目标写着「记忆柜台二号窗口」，说这是当年托他保管的，如今用不上了。' },
        { label: '按新规作废，替他登记预约', run: { track: { loyalty: 3, renown: -2 } },
          after: '你替他登了预约，排期在四个月后。他点了点头，把纸凭条折成四折收好。四个月后那天他没有来，系统提示预约逾期自动失效。那一格备份在柜子里又存了一年，最后按无主处理。' },
        { label: '先查这家属关系是否成立', run: { intel: 4, track: { sin: 1, loyalty: -1 } },
          after: '你查到了那份委托的原件，委托人签名和老人出示的凭条上一致。家属关系那一栏是空的，备注写着「依本人意愿不予登记」。老人等你查完，说了一句：登记了就不会让我来取了。' },
      ] },
    { id: 'y59', portrait: 'portrait-mem', district: 'memory', title: '负十七层冷柜报警器又响了一次',
      text: '冷柜报警器响了一次，持续四十秒，是负十七层的三号柜段。值班的人跑去看了，温度正常，压缩机正常，柜门锁得好好的。报警记录里那四十秒被标成了「误报」，标的人不是当晚值班的那个。这个月已经误报过四次，每次都是负十七层。值班记录本压在柜台上，上一页有半行字被撕掉。',
      options: [
        { label: '把四次误报的时间点排出来', run: { intel: 4, track: { sin: 1 } },
          after: '四次分别在四个不同的星期，间隔都是七天零几个小时，时间越来越靠后。你按这个间隔推到下一次，那天夜里你守在负十七层。三号柜段响的时候，你看见最里面那一格的指示灯灭了一下，又亮起来。' },
        { label: '报修压缩机，要求全面检修', run: { money: -30, chips: 1, track: { loyalty: 2, renown: 1, sin: -1 } },
          after: '检修花了两天，换了两个传感器。之后三个月没有再误报。第四个月开始，误报从负十七层挪到了负十八层，间隔还是七天。检修报告被归进设备档案，结论一栏写着「运行良好」。' },
        { label: '把报警记录删掉，只在交接本上写一笔', run: { intel: 2, track: { sin: 2, power: 1 } },
          after: '你删了那四十秒，交接本上只写了「巡检正常」。当晚的值班员第二天调休，接他班的人不认识三号柜段的位置。后来那一格里存的东西被提过一次，提取单上没有签名，只有一个日期。' },
      ] },
    { id: 'y60', portrait: 'portrait-yu', district: 'memory', title: '交易所里一份人格副本的挂牌价',
      text: '人格副本交易所挂出一份副本，挂牌价比上个月高了四成，说明里写着「来源清晰，无纠纷」。这份副本的编号前缀是一串字母，对应的是集团内部的编制序列。交易所的买家席位里，有三个是最近才开的户。交易所的挂屏一个小时刷新一次，这行字没动。',
      options: [
        { label: '查这份副本的前缀对应谁', run: { intel: 4, chips: 1, track: { sin: 1 } },
          after: '前缀对应的编制号你查到了，这个人在两个月前被列为「清退」，清退原因一栏空着。你去调他的备份托管记录，记录显示存入时间是十年前，存入人签名那一栏，写的是他自己的名字。' },
        { label: '买下这份副本', run: { money: -70, grantCard: { n: 1, path: 'capital' }, intel: 3, track: { power: 2, sin: 2 } },
          after: '你付了全款，交易所交付的除了副本还有一张资本指令卡，说这是打包标的的附赠。副本你一直没有打开。卡面目标写着「交易所席位三席」，是当晚就生效的那种。' },
        { label: '把挂牌信息报到合规部', run: { intel: 2, track: { loyalty: 3, renown: 1, power: -1 } },
          after: '合规部查了三天，说挂牌程序合规，来源证明齐全。他们退回来的材料里多了一页，是来源证明的复印件。证明上的签名和委托书上的签名，笔画走向不太一样，但格式完全一致。' },
      ] },
    { id: 'y61', portrait: 'portrait-dai', district: 'memory', title: '托管库里有份备份今天到期了',
      text: '托管库有一份备份的托管期今天到期，托管的是一家已经注销的公司。按规定，到期后要通知委托人，通知方式是在库里的公告板上贴三十天。这份备份已经贴了三十天，没有人来。今天要决定是销毁，还是转为无主保管。公告板上压着一张旧通知，边角是七年前的章。',
      options: [
        { label: '转为无主保管，先不销毁', run: { money: -25, intel: 3, track: { sin: 1, renown: 1 } },
          after: '你办了转存，费用按无主保管的最低档收，从你的部门预算里出。两年后再查这份备份的托管记录，续存人一栏多了一个编号，这个编号属于一家去年新成立的公司，经营范围写着信息服务。' },
        { label: '按规程销毁', run: { track: { loyalty: 2, sin: 1 } },
          after: '你签了销毁单，操作在当天下午执行。销毁记录上有一行需要填「销毁见证人」，你填了自己。一个月后清算行来调这份销毁记录，看完之后问了一句：销毁时你有没有在场。你说有。' },
        { label: '先打开看一眼，确认内容', run: { intel: 5, vitality: -1, track: { sin: 2, loyalty: -1 } },
          after: '你打开了一角，看到的是格式化的行为记录，日期最近的一条在五年前。记录里出现了一个人名，是郁南枝。你合上资料，把它原样封好，按无主保管转存。这件事你谁也没有提。' },
      ] },
    { id: 'y62', portrait: 'portrait-ghost', district: 'memory', title: '负十八度走廊里的一段脚印',
      text: '记忆银行的走廊地面做了防凝处理，不会留脚印。今天早上负十八度那段地面上留了一串，从电梯口一直走到托管库最里面那一排，然后停住。脚印只有去的，没有回的。当晚值班的两个人都在岗，谁也没看见有人进来。防凝处理的地面反光很强，那串脚印比周围暗。',
      options: [
        { label: '跟着脚印走一遍', run: { intel: 3, vitality: -1, track: { sin: 1 } },
          after: '你跟着走到那一排，脚印停在一格柜门前，柜门是锁的，柜位号和你上周抄下的那张标签差一个数字。你把手贴上去，柜门是凉的，比旁边几格凉得多。回头看，你的脚印也没有留下。' },
        { label: '拍照，先把地面处理掉', run: { intel: 2, chips: 1, track: { sin: 2, power: 1 } },
          after: '你拍了照，让清洁班把地面重做了一遍。清洁记录上写的是「例行除霜」。当天下午，托管库的温控参数被改过一次，改的人用的是值班账号，那个账号当晚没有登录记录。' },
        { label: '报给管理方，要求调监控', run: { intel: 3, track: { loyalty: 2, renown: -1 } },
          after: '监控调出来了，负十八度那几个摄像头在凌晨两点到两点十分之间黑屏，黑屏的触发方式是机房侧断电，断电单是前一天上午批的。批单人签的是你的工号，那张单子你见过，但你没有签。' },
      ] },
    { id: 'y63', portrait: 'portrait-mem', district: 'memory', title: '记忆柜台玻璃内侧的一行字',
      text: '记忆柜台的玻璃内侧起了一层雾，雾上有人用手指写过一行字，写得很小：三号柜段不要开。柜台外面排着队，没有人往里看。无面把玻璃擦了一遍，雾很快又起来了，字没有跟着回来，但玻璃上留着一道手指抹过的痕。柜台前排队的人低头看着自己的号，号码跳得很慢。',
      options: [
        { label: '去负十七层看三号柜段', run: { intel: 4, vitality: -1, grantCard: { n: 1, path: 'purge' }, track: { sin: 2, loyalty: -1 } },
          after: '三号柜段最里面那一格的锁是好的，柜门上的霜比别处厚。你擦开霜，柜门内侧贴着一张清洗指令卡，目标写着「负十八度夜班」，路径是清洗。你把卡收下，把霜重新抹平，出来时走廊上没有人。' },
        { label: '问无面是谁写的', run: { intel: 3, track: { sin: 1 } },
          after: '无面说玻璃内侧只有他们能碰到，但它不记得写过。它把手举到玻璃前比了一下，手指比字迹长了半节。它说自己这半年换过一次班，换班那天的事，一点都想不起来。' },
        { label: '把这件事写进当班日志，不再管', run: { track: { loyalty: 2, sin: -1 } },
          after: '你写了三句，注明时间地点。日志归档时被编进了季度常规记录，没有任何后续。三个月后柜台的玻璃整体换成了磨砂的，雾再也起不来了，谁写什么都看不见。' },
      ] },
    { id: 'y64', portrait: 'portrait-dai', district: 'memory', title: '一笔走了三道审批的清除申请',
      text: '托管库里有一份备份被提交了清除申请，申请单走了三道审批，三道都过了，只差执行。申请人一栏是公司名，公司三个月前注销。备份的所有人编号，和你在交易所见过的那个编号只差一位。执行单今天下午两点前必须回签。执行单是纸质的，纸角压着一枚回形针，已经生锈。',
      options: [
        { label: '签，把清除做完', run: { track: { loyalty: 2, sin: 2, power: 1 } },
          after: '你签了，清除在两点零七分完成。清除日志里多了一条备注，写着「执行人已备份，可追溯」。这句备注不是你填的。一周后，清算行调取了这条日志，调取申请上的理由是「账目复核」。' },
        { label: '压下不签，让申请过期', run: { intel: 3, track: { renown: 1, loyalty: -2 } },
          after: '你没有签，申请在当天两点正式失效。失效通知自动发给了申请人，那个已注销的公司邮箱居然回了一封自动回复，内容是一串编号。你把编号记下，托管库里那一份备份，从此没有动过。' },
        { label: '签，但把执行对象改成另一份', run: { grantCard: { n: 1, path: 'control' }, intel: 3, track: { sin: 2, power: 2 } },
          after: '你换了一份无主备份顶上，操作记录做得干净。清除完成后，申请人那边没有再回话，倒是无面把一个信封推给你，里面是一张操控指令卡，目标写着「记忆柜台夜班」，是它自己的名义。' },
      ] },
    { id: 'y65', portrait: 'portrait-enforcer', district: 'salvage', title: '分拣带上滚过来的一只手臂',
      text: '分拣带今天卡了一次，卡住的东西是一只还连着神经接口的义体手臂，肘部有编号，编号是三年前的批次。班头说不值得报，按废件处理就行。这只手臂的编号，和你在研究所档案里见过的一份志愿者名单，前缀一致。分拣带的滚轮上还挂着几根线，卡住时拉的。',
      options: [
        { label: '把手臂留下，拆接口读编号', run: { gear: 1, intel: 3, vitality: -1, track: { sin: 1 } },
          after: '接口里存着一段短的记录，只有四个小时，都是走路的画面，天一直是灰的。你把记录导出来，画面最后一帧停在一扇钢板门前。那只手臂没有编号的那一侧，皮肤色比另一侧新。' },
        { label: '按废件处理，让带子继续走', run: { money: 20, track: { sin: 1, loyalty: 1 } },
          after: '你把它推回带上，班头当着你的面把它砸平，编号那一段砸得最重。当天这条带的出件量比平时多两成。下班时班头说了一句，说这种货最近多了，来源都一样，你问是哪里，他没答。' },
        { label: '拍照，把编号报给研究所', run: { intel: 4, chips: 1, track: { loyalty: 2, power: -1, sin: 1 } },
          after: '研究所回了函，说这个编号的样本已全部注销，请按废件处理。你申请核对注销清单，清单上这一批一共四十七件，注销日期是同一天，办理人签名那一栏被涂黑过，涂得很厚。' },
      ] },
    { id: 'y66', portrait: 'portrait-fixer', district: 'salvage', title: '班头要你签一车翻新枪的出库单',
      text: '班头推来一车翻新过的枪，一共十四支，编号是后刻的，刻痕比原编号浅。出库单上写着「五金件」，收货方是一家修理厂。他说这车货要你签一个字，签完就跟你没关系。分拣棚外面停着一辆没有喷字的货车。磅秤就在棚子门口，秤面上还留着一层薄灰。',
      options: [
        { label: '签，什么都不问', run: { money: 50, track: { sin: 2, power: 1 } },
          after: '你签了，货车十分钟后开走。当天晚上，回收场外的路灯坏了两盏，第二天修好。这车枪三周后出现在下层居住区的两起纠纷里，用的是同一批后刻编号。单子在档案室放了半年，没有人来查。' },
        { label: '不签，让他自己出库', run: { track: { renown: 1, loyalty: -1, sin: -1 } },
          after: '你没签，班头没说什么，自己找人签了。之后他的出库单再没往你桌上放，回收场里有三样你要用的旧件，报价都比以前高了两成。他见到你照常点头，只不递烟了。' },
        { label: '签，但要求这十四支的编号全抄一份', run: { intel: 3, chips: 1, grantCard: { n: 1, path: 'purge' }, track: { sin: 2, power: 2 } },
          after: '你抄了十四串编号，班头看着你抄完，从口袋里掏出一张清洗指令卡放在单子上，说这是场里压着的废牌，送你。目标写着「回收场夜巡岗」。你签了单，卡也收了，抄下来的那页纸你锁进了柜子。' },
      ] },
    { id: 'y67', portrait: 'portrait-sal', district: 'salvage', title: '一个拾荒者从灰堆里扒出的东西',
      text: '萨尔在灰堆里扒出一只金属盒，盒子是密封的，外壁被烧过一层。她不认识上面的标记，只认得盒子沉。她问你要不要，说不要她就砸开当废铁卖。盒子的锁扣是军规款，回收场的常规废件里没有这一种。灰堆冒着很淡的烟，白天没人管，晚上才浇一次水。',
      options: [
        { label: '出钱买下，原封不动带走', run: { money: -30, gear: 1, intel: 2, track: { sin: 1 } },
          after: '你付了钱，把盒子带回住处，放在床底。一个月后你打开看了一眼，里面是一块烧变形的存储片，读不出任何东西。你把存储片扔了，盒子留着，用来装旧钥匙。' },
        { label: '让她当场砸开', run: { intel: 3, vitality: -1, track: { sin: 1, renown: -1 } },
          after: '盒子砸开了，里面是两枚印章和半包烟。印章上的字被烧糊了，能认出两个字，是公司名的后半截。萨尔拿走了烟，说你早该让她砸。那两枚印章第二天出现在灰市的摊上，标价很便宜。' },
        { label: '不买，把位置报给回收场', run: { intel: 2, track: { loyalty: 2, renown: -1 } },
          after: '你报了位置，回收场当天清了一遍那堆灰，扒出四只一样的盒子，全部按危废处理。萨尔那几天没再露面。清完以后，灰堆那块地方的地面颜色比周围浅了一圈，像被人刮掉过一层。' },
      ] },
    { id: 'y68', portrait: 'portrait-enforcer', district: 'salvage', title: '一个来认领哥哥义体的男人',
      text: '一个男人来回收场认领一副义体，说那是他哥哥的，三个月前在港区出事。他出示的材料齐全，签收栏也填好了，只差场里的确认章。这副义体在昨天已经被拆成了零件，分装在三只筐里，标签是按重量走的。三只筐摆在验收台下面，标签是按重量贴的。',
      options: [
        { label: '把零件拼回去，让他带走', run: { money: -25, track: { renown: 3, loyalty: -1, sin: -1 } },
          after: '你让两个工人拼了三个小时，拼回来八成的件。男人把东西装上车，走前留了一个地址。三个月后你路过那个地址，是一间还在营业的小修理铺，招牌上写着义体两个字，字是新刷的。' },
        { label: '按重量结账，让他自己挑', run: { money: 35, track: { renown: -2, sin: 1 } },
          after: '你按废件价给他结了账，三筐全归他。他挑了半小时，装走了两筐，把最重的那筐留下了。留下的那筐里有一枚工牌，工牌上的照片被磨花了，工号还能看清，属于港区夜班。' },
        { label: '查他那份材料的真伪', run: { intel: 3, track: { loyalty: 3, renown: 1, sin: -1 } },
          after: '材料是真的，事故记录却查不到，港区那一栏只写了「自愿离职」。你把这个结果告诉他，他在门口站了很久，最后什么也没带走。那副义体的零件在那三只筐里又放了两个月。' },
      ] },
    { id: 'y69', portrait: 'portrait-fixer', district: 'salvage', title: '灰堆里的一个还在响的终端',
      text: '分拣区最东头有一只旧终端，屏幕碎了，机箱还在通电，每隔一会儿响一声。拆到它的时候工人不敢动手，因为屏幕虽然碎了，底下那行光标还在闪。终端背面贴着一张资产标签，标签是研究所的，编号被水泡过。响的间隔越来越长，从十几秒拉到了将近一分钟。',
      options: [
        { label: '断电，拆开看里面的东西', run: { gear: 1, intel: 3, vitality: -1, track: { sin: 1 } },
          after: '机箱里多了一块不是原厂的板子，走线接得很粗。板子上插着一张卡，卡面写着「待交付」。你把卡拔下来装进口袋，终端再没响过。那张卡你后来给老鸦看过，他摇了摇头说不接这种货。' },
        { label: '不拆，直接交给研究所', run: { intel: 2, chips: 1, grantCard: { n: 1, path: 'expand' }, track: { loyalty: 2, power: 1, renown: -1 } },
          after: '研究所当天来了两个人把终端取走，登记时给了一张回执，回执背面夹着一张扩张指令卡，目标写着「回收场东区分拣带」。取件的人没有解释这张卡的来路，只说要你收好。' },
        { label: '把机箱灌进废料车，连响一起埋', run: { track: { sin: 2, loyalty: -1 } },
          after: '你让车把它压在了最底下。当天下午那趟废料车的过磅数比平时多了四十公斤。第二天开始，东区那条龙门吊的限位开关老是乱跳，修了三次，最后是把那一整段轨道换掉才好。' },
      ] },
    { id: 'y70', portrait: 'portrait-sal', district: 'salvage', title: '萨尔要借回收场的一间棚子过夜',
      text: '萨尔今天不回灰堆了，要在回收场借一间棚子过夜。她说灰堆那边今夜有人清场，来的不是巡查，是几家一起动手。班头说棚子不借外人，借了明天要写说明。棚子的门锁着，钥匙在班头腰上。棚子的顶是新换的，四周堆着没有收走的废料，铁皮上还有余温。',
      options: [
        { label: '把棚子借出去，说明自己写', run: { track: { renown: 2, loyalty: -2, sin: 1 } },
          after: '你自己写了说明，措辞是临时存放物资。萨尔在棚里待了一夜，早上走的时候把地扫了一遍。当天中午，灰堆那边清完场，扒出的东西装了两车。班长在食堂看了你一眼，没说话。' },
        { label: '不借，按规矩来', run: { track: { loyalty: 2, renown: -2 } },
          after: '你把钥匙还回去，萨尔转身就走，没有多说。三天后你又见到她，她从穹顶外侧那边回来，衣服全湿了。她说那晚她在水渠边蹲了一夜，蹲到天亮，谁也没找到她。' },
        { label: '带她进场里最里面的那间库房', run: { intel: 3, gear: 1, track: { sin: 2, power: 1 } },
          after: '你把她安排在存放危废的里间，那间没有监控。第二天早上她走了，留下的不是钱，是一小卷旧图纸。图纸上画的是四十一号接缝的结构，画得比现在用的版本细，落款日期是十四年前。' },
      ] },
    { id: 'y71', portrait: 'portrait-enforcer', district: 'salvage', title: '一批过期的义体电池要回流',
      text: '库房里有一批过了保质期的义体电池，性能掉到六成，按规程应当销毁。今天有人来报价，说要全收，价格比销毁费用高不少。来的人是老鸦介绍的，谈的时候一直看着门口，不谈交货，只谈出库单怎么开。报价单压在茶杯下面，数字是用铅笔写的，能擦掉。',
      options: [
        { label: '卖，出库单按废件开', run: { money: 65, track: { sin: 2, renown: -1 } },
          after: '货当天拉走，出库单开的是废件，重量对得上。三个月后，下层居住区有三个人因为电池爆燃受伤，用的批次和你出库的那一批对得上。单子上的用途栏写着「再生材料」，签字人是你。' },
        { label: '不卖，按规程销毁', run: { money: -20, track: { loyalty: 3, renown: 1 } },
          after: '销毁走的是标准流程，录像全程留档。买方代表走的时候说了一句：你会后悔的。之后一个月，你的库房申请连续三次被驳回，理由都是「流程待完善」，第四次批下来时，批的是一间更小的库房。' },
        { label: '卖，但要求所有电池先做一次放电处理', run: { money: 45, intel: 2, track: { sin: 1, power: 1 } },
          after: '你让人把每块电池都放了一遍电，留了记录。买方收了货，价格降了两成。放电记录你存了一份，后来港区那起火灾调查时，这份记录被调走过一次，调走单上没有理由。' },
      ] },
    { id: 'y72', portrait: 'portrait-sal', district: 'salvage', title: '回收场夜里丢了一整排货架',
      text: '回收场北区夜里丢了一整排货架，连货架带东西，地脚螺栓是齐根断的，断面很干净。值守的人说一夜没听见动静。第二天早上，那块地面的划痕是从里往外拖的，拖痕只有半截，到水泥台边就断了，像是被抬了上去。北区的水泥台边上有两道白痕，像是货架角磨过。',
      options: [
        { label: '顺着拖痕往场外找', run: { intel: 3, vitality: -1, grantCard: { n: 1, path: 'expand' }, track: { sin: 1 } },
          after: '拖痕在场外的土路上消失，留下两组轮胎印，间距比常规货车宽，跟港区的高架车接近。班头追出来，塞给你一张扩张指令卡，目标写着「回收场北区」，说货架找不回来，这张牌赔给你。' },
        { label: '把这件事按下，自己补上账', run: { money: -30, intel: 2, track: { sin: 2, power: 1 } },
          after: '你按废件价把这一排补进了账，走了内部损耗。一个月后，北区又丢了一排，这次连螺栓都留在原地，货架是整排抬走的。值守从那以后改成两个人，工资是从你的部门预算里出的。' },
        { label: '报案，要求查当晚的门禁', run: { intel: 2, chips: 1, track: { loyalty: 3, renown: -1 } },
          after: '门禁记录显示当晚有两次开门，间隔十一分钟，刷卡用的是场里的临时卡。临时卡的申领记录上写着「外部协作单位」，单位名称一栏是空的。报案结案时，结论写的是「物资清运，手续不全」。' },
      ] },
    { id: 'y73', portrait: 'portrait-yuke', district: 'outside', title: '接缝外侧墙根下的一排赤脚印',
      text: '穹顶外侧的接缝根下有一排脚印，从水渠那边过来，走到墙根就停了。脚印是赤脚的，尺寸不大，雨把边缘泡得发软。停住的那面墙上有几道划痕，很浅，和穹顶内侧维修工用的撬棍痕迹一模一样。墙根的砖缝里塞着几根断绳，绳头是新的，剪口很齐。',
      options: [
        { label: '顺着脚印往回走到水渠', run: { intel: 3, vitality: -2, track: { sin: 1 } },
          after: '脚印在水渠边上变成两段，一段往下游走，一段往回。下游那段尽头有一只翻倒的塑料桶，桶里是空的，桶底有一层绿苔。你站了一会儿，酸雨把外套的袖口咬出了毛边。' },
        { label: '把这处划痕报给环带巡检', run: { intel: 2, track: { loyalty: 2, renown: -1, sin: -1 } },
          after: '巡检来了一次，把划痕填平，抹了一层密封料。填完以后那面墙的颜色比旁边深一点，像一块补丁。你下次去的时候，脚印没有了，划痕也没有了，补丁的颜色已经晒得跟旁边一样。' },
        { label: '在墙根守一夜', run: { intel: 4, vitality: -2, grantCard: { n: 1, path: 'expand' }, track: { sin: 2, loyalty: -1 } },
          after: '后半夜雨停了，一个人从水渠那边过来，赤脚，走到墙根就蹲下，用手在墙上摸了很久。他没有发现你。天亮后你回到墙根，砖缝里塞着一张湿透的扩张指令卡，目标写着「雨线落脚棚」。' },
      ] },
    { id: 'y74', portrait: 'portrait-sal', district: 'outside', title: '一辆架在接缝斜坡上的空平板车',
      text: '一辆平板车架在接缝外侧的斜坡上，车轮用石头垫住，车上是空的，绳还挂着。车头朝里，说明有人从这里把东西拉进了穹顶。垫车的石头是从里面搬出来的，边角带着切割的痕迹，是环带检修用的那种料。斜坡是土夯的，这两天没有下雨，车辙还在。',
      options: [
        { label: '把车推下水渠，断掉这条路', run: { track: { loyalty: 2, renown: 1, sin: -1 } },
          after: '你把车推下去，车翻在水渠里，轮子还在转。第二天车不见了，水渠里的淤沙多了厚厚一层。那条斜坡上的绳子也换了新的，比原来粗。这条路三天后就又通了。' },
        { label: '把车留着，蹲在附近看谁来拉', run: { intel: 3, vitality: -1, track: { sin: 1 } },
          after: '你蹲了两个下午，第二天傍晚来了三个人，两男一女，都不说话，把车拉进斜坡里去了。进去以后没有出来。你把三个人的鞋印记下来，其中一双鞋底是环带检修的制式。' },
        { label: '把石头搬开，看车会不会滑', run: { intel: 2, track: { sin: 1, power: 1 } },
          after: '石头搬开，车没动，垫得很紧。你数了数石头，一共七块，都是从同一面墙上敲下来的。那面墙在斜坡下面，敲出来的缺口被雨泡成了黑色，缺口的高度和你肩膀差不多。' },
      ] },
    { id: 'y75', portrait: 'portrait-out', district: 'outside', title: '穹顶外侧水渠边的一处集水坑',
      text: '水渠边有一处集水坑，坑底积着绿色的水，水面很静。坑壁上刻着刻度，从底下往上数，一共十一格，最新的一格刻痕很新。刻痕旁边的石头缝里塞着一小块布，布是灰的，边角有缝线，像是从工装裤上撕下来的。水面上浮着一层灰膜，风一吹就散开再合上。',
      options: [
        { label: '把布取出来，查是谁的工装', run: { intel: 4, vitality: -1, track: { sin: 1 } },
          after: '布上的缝线是双针，制式是十年前的旧款，编号早就停用了。你拿着布去回收场问，班头看了一眼说是巡检班的旧工装。巡检班现在的制服用的是单针，换过两回。' },
        { label: '按水位的刻度推算上涨速度', run: { intel: 3, chips: 1, track: { sin: 1 } },
          after: '按刻痕的间距推算，水位两年前就开始涨，最近三个月涨得最快。你把日期记在本子上。雨季结束以后你再去，坑里的水明显低了一格，底下那几道旧刻痕露出来了，刻得比新的浅。' },
        { label: '填掉这个坑，免得有人掉进去', run: { track: { renown: 1, loyalty: 1, sin: -1 } },
          after: '你搬了十几块石头把坑填了，填完手上有两道口子。半个月后再去，坑被重新挖开了，挖得比原来大，坑壁上多了一道新的刻痕。你填的那些石头整齐地码在一旁，一块没少。' },
      ] },
    { id: 'y76', portrait: 'portrait-yuke', district: 'outside', title: '雨客约在接缝外的一次见面',
      text: '雨客约在穹顶外侧见面，地点是一段废掉的高架桥墩下面。他带来了两个人，都不说话，站在雨里。他说潮那边想知道穹顶内侧的换气周期，问你能不能给。作为交换，他可以给你一样东西，现在就放在他脚边。桥墩的钢筋露在外面，断口上凝着一层水珠。',
      options: [
        { label: '给，把换气周期写在纸上', run: { intel: 2, gear: 1, grantCard: { n: 1, path: 'expand' }, track: { loyalty: -3, sin: 2 } },
          after: '你把周期写在纸上交出去。他脚边是一张扩张指令卡，目标写着「接缝四十一号控制台」，纸质粗糙，边角发绿。他把卡递给你时说了一句：这个不是我们这边的做法。身后的两个人始终没动。' },
        { label: '不给，但提出换别的东西', run: { intel: 3, track: { power: 1, sin: 1 } },
          after: '你提出用环带巡检的排班表换。雨客想了很久，说可以，但要三天时间。三周后他给了你一份排班表，是两年前的版本。他说这是他们手里最新的一份，换气周期他们自己去数。' },
        { label: '拒绝，转身回穹顶', run: { track: { loyalty: 3, renown: -1, sin: -1 } },
          after: '你没有接话，转身走了。走出二十米，身后还是没有人动。第二天你在办公室收到一只信封，里面是半张高架桥的图纸，画到一半就停了，停笔的位置正好是墩脚。' },
      ] },
    { id: 'y77', portrait: 'portrait-sal', district: 'outside', title: '斜坡下面挂着一具被雨泡胀的工装',
      text: '接缝外的斜坡下面挂着一具工装，被雨泡得发胀，里面没有人。衣服是整套的，扣子扣到最上面一颗，兜里有一张湿透的门禁卡，卡上的照片已经看不清，工号还能读。这套工装挂的位置，人够不到，除非从上面下来。衣服上的扣子是用铜线缠的，缠法不是厂里的做法。',
      options: [
        { label: '把门禁卡取下来，查工号', run: { intel: 4, grantCard: { n: 1, path: 'control' }, track: { sin: 1 } },
          after: '工号属于环带巡检班，人在职，考勤没断，工装就穿在他身上。你没有去问他。当天夜里门缝里塞进来一张操控指令卡，目标写着「接驳斜坡值守」，卡面潮湿，边角发绿，没人来认。' },
        { label: '保持原样，拍下位置', run: { intel: 3, chips: 1, track: { sin: 1, power: 1 } },
          after: '你拍了照，把位置记在水渠那条线的坐标上。两星期后再去，工装还在，被风吹得转了个方向，正面朝墙了。你复看了照片，发现衣领内侧有一道线，是手工缝的，缝法跟制式的不一样。' },
        { label: '把工装取下，烧掉', run: { track: { sin: 2, renown: -1, loyalty: -1 } },
          after: '你把它取下来，在水渠边烧了。衣服泡透了，烧得很慢，冒出的烟是白的。烧完剩下两颗金属扣子，你踢进了水里。那天夜里穹顶那边报了一次空气质量异常，持续二十分钟，没有查出原因。' },
      ] },
    { id: 'y78', portrait: 'portrait-out', district: 'outside', title: '碎石里埋着的一段被人切断的旧铁轨',
      text: '接缝外侧的碎石里埋着一段旧铁轨，轨枕已经烂了，轨面还算平。铁轨往前走一段就断了，断口是切开的，切面很新，切口上还留着刀痕的毛刺。这一段铁轨在穹顶的图纸上没有标注，在旧地图上标的是货运线。碎石缝里长着薄薄一层绿苔，比别处的颜色深。',
      options: [
        { label: '顺着铁轨往断口那头走', run: { intel: 4, vitality: -2, track: { sin: 1 } },
          after: '断口那边是一片塌陷的地基，混凝土块下面压着几根钢梁，钢梁上还有编号。你搬开一块，下面露出一段封死的隧道口，封口的水泥很新，比旁边的混凝土干净得多。雨开始大起来，你退回来了。' },
        { label: '把断口拍照，交给环带', run: { intel: 2, chips: 1, track: { loyalty: 2, sin: -1 } },
          after: '环带收到照片，回复说这一段属于历史遗留，无需处理。两周后你再去看，断口被一块钢板盖住了，钢板没有编号，四角打了膨胀螺栓，螺栓上还有出厂油。' },
        { label: '撬一根轨枕带回去，当废铁卖', run: { money: 30, track: { sin: 1, renown: -1 } },
          after: '轨枕烂得只剩一半，你扛了一公里。回收场按废木料收，价格很低，钱还不够来回的车费。班头看了一眼说这料他见过，是十四年前的货，那一批只铺了很短一段，后来全拆了。' },
      ] },
    { id: 'y79', portrait: 'portrait-yuke', district: 'outside', title: '潮的拾荒队这周要过穹顶一次',
      text: '雨客带来口信，说潮的拾荒队这周要过穹顶一次，走的是接缝外侧那条旧水渠，一共九个人，回来的时候可能多也可能少。他要你这一晚把水渠内侧的那盏巡检灯关掉，灯关十分钟就够。灯的开关在环带的配电盘上。水渠内侧的灯装得很低，光只照到水面上一小片。',
      options: [
        { label: '关灯，什么都不问', run: { money: 55, intel: 2, track: { loyalty: -3, sin: 2 } },
          after: '你把灯关了十一分钟，水渠那边没有声音。第二天早上配电盘上多了一张纸条，压着一沓现金。九个人进去了，那天晚上出来的只有六个，另外三个的名字雨客没有提，你也没有问。' },
        { label: '不关灯，但把巡检班调到别处', run: { intel: 3, track: { power: 1, sin: 1, loyalty: -2 } },
          after: '你把当晚的巡检路线往北挪了四百米，理由是北区管壁渗水。九个人过渠时灯还亮着，走得很慢。事后荀戒问过你为什么挪班，你说渗水。他看了你一会儿，把排班本合上了。' },
        { label: '报给安保，让他们自己决定', run: { chips: 1, track: { loyalty: 3, renown: -2, sin: 1 } },
          after: '安保当晚在水渠内侧布了人。九个人只进来了两个，其余的在接缝外侧就折回去了。两个进来的人被带走登记，登记表上的理由写的是「误入」。雨客此后没有再联系过你，一句也没有。' },
      ] },
    { id: 'y80', portrait: 'portrait-out', district: 'outside', title: '穹顶第 41 号接缝的一次响动',
      text: '四十一号接缝在外侧响了一次，声音很闷，像是有人从里面敲。响声之后，接缝上那块补过的密封料鼓起一小块，鼓的位置正对着环带那条走廊。巡检记录这一栏写的是「正常」，是昨夜下班前填的，填的人是荀戒。响声之后有半分钟，管壁是安静的，然后又是水声。',
      options: [
        { label: '自己爬上去，摸那块鼓起的地方', run: { intel: 4, vitality: -2, track: { sin: 1 } },
          after: '密封料是软的，按下去会回弹，底下有气流。你把耳朵贴上去，能听见管壁里的水声，水声的节奏和穹顶内侧的换气周期一致。你退下来时手上沾了一层绿粉，回家洗了两遍才掉。' },
        { label: '把这一处记进巡检异常本', run: { intel: 2, chips: 1, track: { loyalty: 3, renown: -1 } },
          after: '你写在异常本上，编号连号。三天后异常本被收走，换成了新的，你写的那一页没有出现在旧本子里。荀戒把新本子放在桌上时说：这本子一个月一换，别写太多。' },
        { label: '把鼓包按回去，再用密封料补一层', run: { gear: 1, track: { sin: 2, power: 1, renown: -1 } },
          after: '你把鼓包按平，补了一层新料，抹得和旁边一样。补完那天夜里，四十一号接缝内侧的渗水量比平时少了一半。集团年报里那一段的维修项被划掉了，划的人不是巡检班。' },
      ] },
  ];
})();


/* ===== game/afterstory.js ===== */
/* 结局后日谈。每个结局之后，世界变成了什么样。 */
(function () {
  'use strict';
  window.AFTERSTORY = {
    'v2_fake': '三个月后，你原来的工位换了人，桌上多了一张培训通知，签发人写的是你。那副新牌没人再提，它确实存在，收在第十一层的柜子里，第一张的编号已经被划掉重写。楼里的人开始用「最配合的那个」指代整整一批人，指谁都可以。下层的墙上有人写过一次你的名字，第二天被刷掉，第三天又出现，写在同一个位置。发牌机上个月重新上过油，声音比从前轻。没人注意到它的进纸口里还卡着半张空白卡，取不出来，也没人去取。',

    'v2_true': '发牌机拆走以后，那层会议室改成了档案室，第一年只放了一排空柜。回收名单清空那天，广播念到最后一名时停了一下，念的人自己也不知道该不该停。程砚在名册背面签了第一次字，签的是名册上原本没有的东西。管线里不再下发新的编号，例行检修表换成了一张空白表格，没人知道该填什么。有人在广场上问，牌不发了以后我们做什么。没有人回答，因为确实还没有答案。港区夜班的散件照旧走，一吨三百二。',

    'v2_bad': '你走以后，陆晚把登记本上你那一页划掉，没写原因，只在边角补了一个日期，日期是她第一次见你的那天。诊所门口那把椅子被搬到里屋，后来雨大，椅子腿泡涨了，没人修。你的通行记录里多出三年空白，系统按惯例标成请假。例会照常发牌，轮到第十二个人的位置时，主持人叫的是你后面那个名字，念得很顺。你的旧邻居说见过你一次，在雨里，没打伞，走得不快也不慢。',

    'sultan': '董事的椅子尺寸确实刚好。你上任第一件事是改例会时间，从那以后所有人都提前十分钟到。雨落下来还是那场雨，只是公告里多了「分区降雨」四个字。巡检的定额从每天两次改成三次，经费那栏写着可接受损耗。老鸦摊子秤底下那角旧公告被人翻了个面，背面什么都没有。接缝档案重新编了号，第四十一号排到了第九。散会时有人发现，会议桌尽头空着一把椅子，一整年没人搬走，也没人问是谁的。',

    'dog': '你的权限卡每天换一次，换卡的人从来不看你的脸。下层开始用「那条」指代你，说的时候声音很轻，怕被听见。程砚的名册上，你那一行写的是工号不是名字，签字栏一直空着。公司年度表彰给了你一个奖，奖状上的称呼是中层员工的模范。走廊尽头有一排备用挂钩，你的工牌挂在最右边那个位置，周末保洁也不取。之后每一批新人进来，都会被带到那个挂钩前面看上一眼。',

    'hero': '碑立起来那天，来的人不多，走的人比来的多。碑上没有名字，所以也没有哪一天算祭日。陆晚的诊所账上多了一笔匿名款，她没查，一直垫在抽屉最下面。监事会把你移出重点观察，档案那一栏写的是已失效。街上有人拿「可回收」当骂人的话，说了两年才慢慢不说了。碑上的字被雨泡掉一半，剩下那一半是谁刻的，谁都没有说，也没人肯说是自己刻的。',

    'ghost_out': '轨道港侧门的记录仪三年没换过，里面最后一条是空的。你的工号没有注销，直接转给了下一批新人，第一个领到卡的人说卡面上有别人的指纹印。宿舍那张床后来睡了第三个人，前两个都搬走了，一个往北，一个不知道往哪。你房里的那盆植物撑了四十天，之后被搬到走廊，没人认领。档案里你那一行留着空白，按规矩，空白可以填任何东西。监事会在核对时停了一秒，然后翻过去了。',

    'purged': '你的账户清零用了不到四分钟，门禁是当天下班后换的。工号末尾那位数字从七改成一，第二天有人照着签了巡检单，规程里没写不许签。程砚在名册上找到过你的名字一次，划掉，没有写替代的编号。床铺第二天就分出去了，第三个住进来的人姓什么，写在排班表第二列。回收单第三栏始终空着，说要填的那个人后来也没有填。归档结论那一行是打印体，只有「已回收」三个字是手写。',

    'broken': '你的门禁卡在当天下午就作废了，办公室三点搬空，四点有人进去量窗帘尺寸。自愿退出那张表归档时盖了章，章是圆的，看不出是哪个部门。你的社保号在月底注销，原因那栏填的是正常。会客室换了新地毯，颜色比原来深，遮得住脚印。下层诊所里，陆晚问过你一句话，没有人记得是哪一句。你最后提的那个问题，档案里没有记，问了也没有人答。',

    'emperor': '新章程的封面印了你的名字，字体比正文大两号。雨从那以后按区下，高塔那一片全年降雨天数从一百零四天减到八十九天，下层那一片没变。程砚被调去做老化测试复核，报告要求写两版，一版上报，一版留底。老鸦的摊子后来有了编号，写在灯箱背面，写得歪。章程第二页上有一行签名，字迹是你的，名字不是。翻章程的人大多翻到第二页就停了，后面没人看。',

    'w1': '清算行连夜改的报价里，执行人那一栏删得很干净，连模板都换成了新的。广场上那张写你名字的纸第三天被雨泡烂，扫街的把它和其他垃圾一起收走。那本账被人翻过，中间少了几页，正好是记着人名的那几页。下层后来有人按账本上没写的方式做事，做得比写着的还顺。你走出高塔那天电梯没停，这个细节被写进当年的一份内部简报。账本最后一页是空的，压在会议桌抽屉里，锁没上。',

    'w2': '签收栏终于有字以后，那件东西安静地待在下面，等的日子比做完的日子长。程砚调去了别的楼，工牌换过一次颜色，之后没人再提她签过什么。你桌上那份新指令放了两个月，编号那一栏一直是空的，没有人来填。例会照开，发牌不再叫发牌，改叫例行下发。有人在档案里查过你替谁签过字，查了三次都没查到，第三次连名字都记错了。',

    'w3': '第四十一号接缝那一段再没修过，巡检的定额从每天两次退回一次，因为他擦的是别处。第一场雨落在下层居住区时，前十七秒里没有人跑，往后三天都是如此。集团的公告把那一年写成接缝检修，旁边同一页是降雨量统计，数字比往年好看。雨客说他不再往接缝外面走了，因为潮已经进来了，进来得比人快。下层的孩子管那几天叫放晴，大人叫灰潮，两边吵过一阵，后来不吵了。',

    'w4': '那副牌洗过之后就没人认得出是哪一副了，发牌顺序照旧按工号排。例会主持人的名单后来添的新名字比划掉的多。走廊尽头的椅子被人数过一次，数出十三把，记的人自己都笑，说大概多算了一把。会议室里的香槟杯收走了三只，其中一只杯口有裂。你和他后来在别的会上见过两次，都点头，没有握手。桌上那副新牌的第一张，编号栏留白。',

    'w5': '陆晚买的骨灰盒是最便宜的那种，收据她留了三年才丢。老鸦替你出的运费记在自己本上，旁边写「不催」，之后再没翻过那一页。名单里你那一栏被划掉，括号里写着非回收，这行字是别人补的，笔迹很新。巷口的雨确实比别处轻，轻到有人专门去那儿站过。老鸦摊子秤底下压的那张纸后来又多了二张，是名单的另一份抄本。抄到一半停了，剩下的半页空着。',

    'w6': '第二天你回到工位，茶还在窗台上，凉着，杯底有一圈水痕。发牌没有停，排期表上的格子照旧一天一格，填得规规矩矩。你的工号末尾没改，这一栏在整层楼里很常见，谁的名字后面都一样。下层的队在早上七点排到巷口，长度和上个月差不多。监事会那一年没有增补椅子，也没有减。有人问你七日里改了什么，你说没改。这句话后来被写进年终简报的讨论部分，写在最末一段。',
    'w7': '清档之后没有人再提那七天。你的工号没有改，权限也没有降，排期表上的格子照旧一天一格。只是楼层里的惯例悄悄变了一点：开会时没有人坐你对面，交接班的记录本上，你那一栏永远最先被签好，字迹比你自己的还工整。有人在下面写了一句「经手人已确认」，没有署名，也没有日期。你后来问过一次是谁写的，问到第三个人就不问了。',

    'survivor': '第十三张牌发到你手上那天，天气和第十二张那天一模一样。你名下在陆晚诊所记着的一笔账还没清，她也没催。老鸦问过你一次要不要办第三栏的单子，你说不用，他就没再问，也没记下来。排期表上你的名字后面那一格永远是空的，签的人签了几十年，从没在那格上落过笔。你还是坐在原来的椅子上喝茶，茶比从前泡得久一点。楼里的人换了两茬，新来的不知道你折过十二张牌。',
  };
})();

/* ===== game/audio.js ===== */
/* ==========================================================
   《七日指令》音效层 —— 全部用 Web Audio 合成，不带任何素材文件
   风格取向：冷、干、电子感、克制。
   取材自场景里的金属门禁、蜂鸣器、继电器、纸张折断与低频脉冲，
   所以大量用的是“短噪声瞬态 + 窄带滤波 + 极快包络”，
   只有结局音用正弦和弦，且刻意压低音量，避免出现欢庆感。
   浏览器策略要求 AudioContext 必须在用户手势之后创建/恢复，
   因此 init() 只做一件事：把上下文备好；没 init 前 play 一律静默。
   ========================================================== */
(function () {
  'use strict';

  const KEY = 'sdd.audio.v1';   // 音效开关状态的持久化键
  const BGM_KEY = 'sdd.bgm.v1'; // BGM 开关单独存，会有人只想关音乐不想关音效
  const MAX_VOICES = 8;         // 同时发声上限，超了直接丢弃新音效，避免叠成爆音
  const MIN_DUR = 0.05;         // 最短音效时长（秒），再短就只是一次爆点，谈不上辨识度
  const MAX_DUR = 1.2;          // 最长音效时长（秒），再长会拖住后续判定的节奏
  const TAIL = 0.15;            // 尾部余量（秒），给包络收干净和节点断开留时间

  /* 全部可用音效名，顺序固定，界面层可直接用来做音效开关列表 */
  const NAMES = [
    'deal', 'hover', 'foldOk', 'foldFail', 'crit', 'fumble',
    'draw', 'gain', 'warn', 'openPanel', 'endBad', 'endGood',
  ];

  let ctx = null;         // AudioContext，init 之前是 null
  let master = null;      // 总输出，所有音效过这里，便于统一音量与静音
  let noiseBuf = null;    // 噪声缓冲只生成一次，反复复用，省内存也省 CPU
  let voices = 0;         // 当前还在发声的路数
  let on = readEnabled(); // 音效开关，默认开启（除非系统要求减弱动效）
  let bgmOn = readBgmEnabled(); // BGM 开关，独立于音效

  /* ---------------- 开关状态：读、写、以及系统偏好 ---------------- */

  /* 曾经这里做过一件事：系统开了「减弱动态效果」就默认静音。
     那是错的 —— prefers-reduced-motion 说的是「少动」，不是「别出声」。
     macOS 上这个开关很容易被打开（辅助功能里点一下、或者系统更新后
     跟着别的设置一起开），结果就是音效和 BGM 双双默认静音，
     玩家只会觉得「这游戏没声音」，根本不会想到是系统偏好。
     现在音频一律默认开启，要静音由玩家自己按开关；
     「少动」那条偏好交回给 CSS，去关动画（见 style-v3.css）。 */
  function readEnabled() {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw === '0') return false;
      if (raw === '1') return true;
    } catch (e) { /* 隐私模式下 localStorage 不可用，走默认值 */ }
    return true;
  }

  function writeEnabled(v) {
    try { window.localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) {}
  }

  /* BGM 单独一套读写。会有人只想关音乐、留着音效反馈，
     所以不跟 KEY 混在一起。 */
  function readBgmEnabled() {
    try {
      const raw = window.localStorage.getItem(BGM_KEY);
      if (raw === '0') return false;
      if (raw === '1') return true;
    } catch (e) { /* 隐私模式走默认值 */ }
    return true;
  }

  function writeBgmEnabled(v) {
    try { window.localStorage.setItem(BGM_KEY, v ? '1' : '0'); } catch (e) {}
  }

  /* ---------------- 上下文与基础构件 ---------------- */

  /* 噪声缓冲：1 秒白噪声。纸响、气流、碎裂感都从这一段里裁剪出来 */
  function makeNoiseBuf(context) {
    const len = Math.floor(context.sampleRate * 1);
    const buf = context.createBuffer(1, len, context.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  function init() {
    try {
      if (ctx) { resumeCtx(); return; }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;                       // 老浏览器不支持，之后所有 play 静默
      ctx = new AC();
      master = ctx.createGain();
      /* 总音量压到一半以下，游戏里音效不该抢戏。
         关掉音效时这里直接归零 —— play() 只是不再新建声音，
         已经在小节里跑的 BGM 得靠总闸才停得住。 */
      master.gain.value = on ? 0.6 : 0.0001;
      master.connect(ctx.destination);
      noiseBuf = makeNoiseBuf(ctx);
      resumeCtx();
      document.addEventListener('visibilitychange', bgmVisibility);
      bgmSync();                             // 上下文备好了，BGM 该响就响起来
    } catch (e) {
      ctx = null;                            // 初始化失败就彻底退回静默模式
      master = null;
    }
  }

  /* 手势后再 resume。resume 返回 Promise，失败也只吞掉，绝不抛给调用方 */
  function resumeCtx() {
    try {
      if (ctx && ctx.state === 'suspended' && ctx.resume) {
        const p = ctx.resume();
        if (p && p.catch) p.catch(function () {});
      }
    } catch (e) {}
  }

  /* 一次发声的记账对象：统一出口、记录到点该断开的节点 */
  function newVoice() {
    const v = {
      t0: ctx.currentTime,
      end: 0,
      nodes: [],
      out: null,
      /* 登记一个节点的结束时间，用来算整体时长 */
      note: function (until) { if (until > v.end) v.end = until; },
      add: function (n) { v.nodes.push(n); return n; },
    };
    v.out = ctx.createGain();
    v.out.gain.value = 1;                    // 出口固定 1，音量全在各自包络里控制
    v.out.connect(master);
    v.add(v.out);
    voices++;
    return v;
  }

  /* 收尾：到点把这一路的节点全部 stop + disconnect，防止节点泄漏 */
  function release(v) {
    const span = Math.max(MIN_DUR, Math.min(MAX_DUR, v.end - v.t0)) + TAIL;
    window.setTimeout(function () {
      voices = Math.max(0, voices - 1);
      for (let i = 0; i < v.nodes.length; i++) {
        const n = v.nodes[i];
        try { if (n.stop) n.stop(); } catch (e) {}
        try { n.disconnect(); } catch (e) {}
      }
      v.nodes.length = 0;
    }, span * 1000);
  }

  /* 一个带扫频与包络的振荡器音。
     f0->f1 用指数扫频：电子设备掉电/升调的听感更像线性扫频，
     包络一律 起音 -> 峰值 -> 指数衰减到近零，避免出现“咔”的爆音。 */
  function tone(v, opt) {
    const t0 = v.t0 + (opt.at || 0);
    const dur = opt.dur;
    const o = ctx.createOscillator();
    o.type = opt.type || 'sine';
    o.frequency.setValueAtTime(opt.f0, t0);
    if (opt.f1 && opt.f1 !== opt.f0) {
      o.frequency.exponentialRampToValueAtTime(Math.max(1, opt.f1), t0 + dur);
    }
    const g = ctx.createGain();
    const peak = opt.gain == null ? 0.2 : opt.gain;
    const atk = opt.attack == null ? 0.004 : opt.attack;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    let tail = g;
    if (opt.filter) {
      const f = ctx.createBiquadFilter();
      f.type = opt.filter.type || 'lowpass';
      f.frequency.setValueAtTime(Math.max(20, opt.filter.f0), t0);
      if (opt.filter.f1 && opt.filter.f1 !== opt.filter.f0) {
        f.frequency.exponentialRampToValueAtTime(Math.max(20, opt.filter.f1), t0 + dur);
      }
      f.Q.value = opt.filter.q == null ? 1 : opt.filter.q;
      g.connect(f);
      tail = f;
      v.add(f);
    }
    tail.connect(opt.dest || v.out);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
    v.add(o);
    v.add(g);
    v.note(t0 + dur);
    return o;
  }

  /* 一段经过滤波的噪声：纸响、气流、碎裂的底子都是它。
     用 loop 播放同一段缓冲，靠增益包络裁出极短的一截。 */
  function noise(v, opt) {
    const t0 = v.t0 + (opt.at || 0);
    const dur = opt.dur;
    const s = ctx.createBufferSource();
    s.buffer = noiseBuf;
    s.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = opt.filter || 'bandpass';
    f.frequency.setValueAtTime(Math.max(20, opt.f0), t0);
    if (opt.f1 && opt.f1 !== opt.f0) {
      f.frequency.exponentialRampToValueAtTime(Math.max(20, opt.f1), t0 + dur);
    }
    f.Q.value = opt.q == null ? 1 : opt.q;
    const g = ctx.createGain();
    const peak = opt.gain == null ? 0.15 : opt.gain;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + (opt.attack == null ? 0.002 : opt.attack));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f);
    f.connect(g);
    g.connect(opt.dest || v.out);
    s.start(t0);
    s.stop(t0 + dur + 0.02);
    v.add(s);
    v.add(f);
    v.add(g);
    v.note(t0 + dur);
    return s;
  }

  /* ---------------- 音效配方表：每个都只用上面两个构件拼 ---------------- */
  const SOUNDS = {
    /* 发牌：卡落到桌面的纸响。只有噪声瞬态，不带任何音高 */
    deal: function (v) {
      noise(v, { dur: 0.055, filter: 'bandpass', f0: 2400, f1: 1200, q: 0.9, gain: 0.16, attack: 0.001 });
    },

    /* 悬停：极轻的高频点触。音量压到几乎只是“确认一下指针到了” */
    hover: function (v) {
      tone(v, { type: 'triangle', f0: 3200, dur: 0.03, gain: 0.045, attack: 0.001 });
      noise(v, { dur: 0.02, filter: 'highpass', f0: 4200, q: 0.7, gain: 0.03, attack: 0.001 });
    },

    /* 折牌成功：金属切断感。两个不成谐波的方波叠出锋利的“咔”，带通削掉浑浊 */
    foldOk: function (v) {
      tone(v, {
        type: 'square', f0: 1850, f1: 1400, dur: 0.1, gain: 0.09, attack: 0.001,
        filter: { type: 'bandpass', f0: 2200, q: 1.6 },
      });
      tone(v, {
        type: 'square', f0: 2680, f1: 2100, dur: 0.075, gain: 0.05, attack: 0.001,
        filter: { type: 'highpass', f0: 1500 },
      });
      noise(v, { dur: 0.035, filter: 'highpass', f0: 3000, q: 0.8, gain: 0.09, attack: 0.001 });
    },

    /* 折牌失败：沉闷下坠。正弦下滑 + 低通兜住高频，听起来发闷而不是“错误提示” */
    foldFail: function (v) {
      tone(v, {
        type: 'sine', f0: 240, f1: 82, dur: 0.34, gain: 0.17, attack: 0.006,
        filter: { type: 'lowpass', f0: 900 },
      });
      tone(v, {
        type: 'triangle', f0: 118, f1: 60, dur: 0.3, gain: 0.1, attack: 0.008,
        filter: { type: 'lowpass', f0: 500 },
      });
      noise(v, { dur: 0.12, filter: 'lowpass', f0: 420, q: 0.7, gain: 0.07 });
    },

    /* 暴击：成功的金属锋之上再叠一层上行亮音，亮但不吵 */
    crit: function (v) {
      SOUNDS.foldOk(v);
      tone(v, {
        type: 'triangle', f0: 720, f1: 1720, dur: 0.26, gain: 0.1, attack: 0.004, at: 0.02,
        filter: { type: 'lowpass', f0: 4200 },
      });
      tone(v, { type: 'sine', f0: 1440, f1: 2400, dur: 0.18, gain: 0.05, attack: 0.003, at: 0.06 });
    },

    /* 崩盘：低频冲击打底，宽噪声做碎裂感，整体不超过半秒 */
    fumble: function (v) {
      tone(v, {
        type: 'sine', f0: 92, f1: 34, dur: 0.45, gain: 0.3, attack: 0.003,
        filter: { type: 'lowpass', f0: 260 },
      });
      noise(v, { dur: 0.3, filter: 'lowpass', f0: 1100, f1: 300, q: 0.6, gain: 0.16, attack: 0.002 });
      noise(v, { dur: 0.08, filter: 'bandpass', f0: 700, q: 0.8, gain: 0.09 });
    },

    /* 抽到新指令卡：两音符上行，间隔很短，像读卡器的“滴—嗒” */
    draw: function (v) {
      tone(v, {
        type: 'triangle', f0: 660, dur: 0.09, gain: 0.11, attack: 0.003,
        filter: { type: 'lowpass', f0: 3200 },
      });
      tone(v, {
        type: 'triangle', f0: 990, dur: 0.14, gain: 0.11, attack: 0.003, at: 0.085,
        filter: { type: 'lowpass', f0: 3600 },
      });
    },

    /* 获得资源/关系提升：温和单音。慢起慢落，不带雀跃的上扬 */
    gain: function (v) {
      tone(v, {
        type: 'sine', f0: 523, dur: 0.3, gain: 0.13, attack: 0.03,
        filter: { type: 'lowpass', f0: 1800 },
      });
      tone(v, { type: 'sine', f0: 784, dur: 0.22, gain: 0.05, attack: 0.04, at: 0.03 });
    },

    /* 期限告警：两声重复蜂鸣。方波给电子味，带通把刺耳的高次谐波削掉 */
    warn: function (v) {
      const boom = {
        type: 'square', f0: 890, dur: 0.1, gain: 0.1, attack: 0.002,
        filter: { type: 'bandpass', f0: 1000, q: 2.2 },
      };
      tone(v, boom);
      tone(v, { type: boom.type, f0: boom.f0, dur: boom.dur, gain: boom.gain, attack: boom.attack, at: 0.17, filter: boom.filter });
    },

    /* 打开面板：气动滑轨。噪声带通从低扫到高，像门缝吸了一口气 */
    openPanel: function (v) {
      noise(v, { dur: 0.2, filter: 'bandpass', f0: 380, f1: 1900, q: 1.1, gain: 0.1, attack: 0.012 });
      tone(v, {
        type: 'triangle', f0: 300, f1: 620, dur: 0.14, gain: 0.04, attack: 0.01,
        filter: { type: 'lowpass', f0: 1500 },
      });
    },

    /* 坏结局：下行低频拖长。两个八度关系叠在一起，尾巴更厚也更沉 */
    endBad: function (v) {
      tone(v, {
        type: 'sine', f0: 168, f1: 58, dur: 1.0, gain: 0.2, attack: 0.05,
        filter: { type: 'lowpass', f0: 700 },
      });
      tone(v, {
        type: 'sine', f0: 84, f1: 30, dur: 1.0, gain: 0.16, attack: 0.06, at: 0.04,
        filter: { type: 'lowpass', f0: 400 },
      });
      noise(v, { dur: 0.5, filter: 'lowpass', f0: 500, f1: 180, q: 0.6, gain: 0.05 });
    },

    /* 好结局：上行的三音和弦。起音慢、音量低，是“松开”而不是庆祝 */
    endGood: function (v) {
      const steps = [392, 494, 587];   // G4 B4 D5，大三和弦依次展开
      for (let i = 0; i < steps.length; i++) {
        tone(v, {
          type: 'sine', f0: steps[i], dur: 0.9 - i * 0.12, gain: 0.1, attack: 0.07, at: i * 0.14,
          filter: { type: 'lowpass', f0: 2400 },
        });
      }
      tone(v, {
        type: 'triangle', f0: 196, f1: 294, dur: 0.95, gain: 0.05, attack: 0.1,
        filter: { type: 'lowpass', f0: 900 },
      });
    },
  };

  /* ==========================================================
     BGM —— 循环音轨，走 Web Audio 播放

     音轨是 Meowa 生成的（assets/bgm-main.mp3，约 3 分钟）。

     为什么不用 <audio>：线上网关给页面加的 CSP 里没有 media-src，
     于是 media-src 回落到 default-src 'none'，浏览器直接拒绝加载
     任何音频文件 —— 本地跑得好好的（本地无 CSP），一上线就
     MediaError.code=4、networkState=3，连请求都不发出去。
     改成 fetch 取回字节、decodeAudioData 解码、AudioBufferSourceNode
     播放：CSP 的 media-src 管不到 Web Audio，而 connect-src 里已经
     有应用自身的源，同源 fetch 是放行的。

     顺带解决两件事：BGM 与音效共用 master 总闸（关音效时音乐自然停），
     音量渐变也能用 AudioParam 的斜坡做，比手推 element.volume 干净。
     ========================================================== */

  const BGM_SRC = 'assets/bgm-main.mp3';
  const BGM_VOL = 0.8;          // 再经 master，音轨本身录得偏轻
  const BGM_FADE_IN = 2.6;      // 淡入秒数
  const BGM_FADE_OUT = 1.2;     // 淡出秒数

  let bgmBuf = null;            // 解码后的音轨，只解一次
  let bgmLoading = false;       // 是否正在取/解码
  let bgmFailed = false;        // 取过一次拿不到就不再重试
  let bgmSource = null;         // 正在播的 BufferSource
  let bgmGain = null;           // BGM 专用增益，接在 master 上
  let bgmLive = false;          // 是否正在播放

  /* 该不该有音乐：音效总闸开着、BGM 开关开着、标签页在前台 */
  function bgmWant() {
    return !!(on && bgmOn && !document.hidden);
  }

  function bgmLoad() {
    if (bgmBuf || bgmLoading || bgmFailed) return;
    if (!ctx) return;
    bgmLoading = true;
    fetch(BGM_SRC)
      .then(function (r) {
        if (!r.ok) throw new Error('bgm http ' + r.status);
        return r.arrayBuffer();
      })
      .then(function (buf) {
        /* 新浏览器返回 Promise，老 Safari 只认回调，两条路都挂上 */
        return new Promise(function (res, rej) {
          let done = false;
          const ok = function (d) { if (!done) { done = true; res(d); } };
          const no = function (e) { if (!done) { done = true; rej(e); } };
          const pr = ctx.decodeAudioData(buf, ok, no);
          if (pr && pr.then) pr.then(ok).catch(no);
        });
      })
      .then(function (decoded) {
        bgmBuf = decoded;
        bgmLoading = false;
        bgmSync();                       // 解好了，如果本来就该响，现在响
      })
      .catch(function () {
        bgmLoading = false;
        bgmFailed = true;                // 拿不到就彻底放弃，不反复重试
      });
  }

  function bgmStart() {
    try {
      if (bgmLive) return;
      if (!ctx || !master) return;
      if (!bgmBuf) { bgmLoad(); return; }   // 还没解码完，加载完会自动接上
      const t = ctx.currentTime;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(BGM_VOL, t + BGM_FADE_IN);
      g.connect(master);

      const src = ctx.createBufferSource();
      src.buffer = bgmBuf;
      src.loop = true;
      src.connect(g);
      src.start();                          // 不传时间参数：立即开始。
                                            // 早先合成版就是在这里把绝对
                                            // 时刻减成了相对值，整段排到过去
      bgmGain = g;
      bgmSource = src;
      bgmLive = true;
    } catch (e) { bgmLive = false; }
  }

  function bgmStop() {
    try {
      if (!bgmLive) return;
      bgmLive = false;
      const g = bgmGain, src = bgmSource;
      bgmGain = null;
      bgmSource = null;
      if (!g || !ctx) return;
      const t = ctx.currentTime;
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(Math.max(0.0001, g.gain.value), t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + BGM_FADE_OUT);
      window.setTimeout(function () {
        try { if (src) { src.stop(); src.disconnect(); } } catch (e) {}
        try { g.disconnect(); } catch (e) {}
      }, (BGM_FADE_OUT + 0.3) * 1000);
    } catch (e) {}
  }

  /* 开关、上下文、标签页可见性，任何一处变了都调这里对齐 */
  function bgmSync() {
    try {
      if (bgmWant()) bgmStart();
      else bgmStop();
    } catch (e) {}
  }

  /* 切后台就停（BufferSource 没有 pause，只能停掉再重起），
     回前台再由 bgmSync 接上。省电，也避免后台出声。 */
  function bgmVisibility() { bgmSync(); }

  function setBgmEnabled(v) {
    try {
      bgmOn = !!v;
      writeBgmEnabled(bgmOn);
      bgmSync();
    } catch (e) {}
  }

  function bgmToggle() {
    try {
      setBgmEnabled(!bgmOn);
      return bgmOn;
    } catch (e) {
      return false;
    }
  }

  /* ---------------- 对外接口 ---------------- */

  /* 播一个音效。opts 可选：
     opts.gain  0..1 的音量缩放，默认 1
     opts.delay 延迟秒数，默认 0 */
  function play(name, opts) {
    try {
      if (!on) return;                        // 关掉了就什么都不做
      if (!ctx || !master) return;            // 还没 init，静默返回
      const build = SOUNDS[name];
      if (!build) return;                     // 未知音效名静默忽略
      if (voices >= MAX_VOICES) return;       // 并发超限，丢新的，不排队
      resumeCtx();
      const o = opts || {};
      const v = newVoice();
      if (o.gain != null) {
        v.out.gain.value = Math.max(0, Math.min(1, o.gain));
      }
      if (o.delay) v.t0 = v.t0 + Math.max(0, o.delay);
      build(v);
      release(v);
    } catch (e) { /* 音效永远不能影响游戏流程 */ }
  }

  /* 总闸。音效与 BGM 一起受它控制，分开开关用各自的 setBgmEnabled。 */
  function applyMasterLevel() {
    try {
      if (!ctx || !master) return;
      const now = ctx.currentTime;
      const target = on ? 0.6 : 0.0001;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), now);
      master.gain.exponentialRampToValueAtTime(target, now + (on ? 0.35 : 0.6));
    } catch (e) {}
  }

  function setEnabled(v) {
    try {
      on = !!v;
      writeEnabled(on);
      applyMasterLevel();
      bgmSync();
    } catch (e) {}
  }

  /* 切换开关，返回切换后的状态，方便界面直接读回来渲染按钮 */
  function toggle() {
    try {
      setEnabled(!on);
      return on;
    } catch (e) {
      return false;
    }
  }

  window.GAME_AUDIO = {
    init: init,
    ready: function () { return !!(ctx && master); },
    enabled: function () { return on; },
    setEnabled: setEnabled,
    toggle: toggle,
    play: play,
    names: function () { return NAMES.slice(); },
    /* --- BGM：与音效分开开关，但同受总闸控制 --- */
    bgmEnabled: function () { return bgmOn; },
    setBgmEnabled: setBgmEnabled,
    bgmToggle: bgmToggle,
    bgmLive: function () { return bgmLive; },
    bgmStart: bgmSync,
    /* 这两个是给界面/调试用的补充信息，不属于约定接口，改起来不影响调用方 */
    state: function () { return ctx ? ctx.state : 'none'; },
    voices: function () { return voices; },
  };
})();

/* ===== game/save.js ===== */
/* 局内存档：把当前这一局原样存下来，下次打开还能接着玩。 */
(function () {
  'use strict';
  const D = window.GAME_DATA;
  const C = D.CONFIG;

  /* 跨局档案用 sdd.profile.v1，这里必须另起一个 key。
     两件事的生命周期完全不同：档案要跟人一辈子，这一局只活七天，
     混在一起就会出现「清掉存档把命运点也清了」这种事故。 */
  const KEY = 'sdd.run.v1';
  const LOG_KEEP = 60;      // 日志只回溯这么多条，再多存档会被撑大
  const MAX_DEPTH = 12;     // 快照最大深度，防止恶意/意外深链拖死序列化

  /* ==========================================================
     一、快照生成
     状态里混了三类不能直接 JSON 化的东西：
       1) 带方法的对象（s.rng）—— JSON 只留下数据字段，方法全丢
       2) 数据表引用（s.origin / s.ending）—— 存下来会变成一份死副本，
          以后改数据表也追不回来，所以只存 id
       3) 意外混进来的函数、undefined、循环引用 —— 序列化要么丢字段要么抛错
     所以先自己做一次深度克隆，把不能存的东西在进 JSON 之前就摘掉。
     宁可少存一个字段，也不能让存档抛出去——抛一次，玩家这七天就没了。
     ========================================================== */
  function isPlainObject(v) {
    if (!v || typeof v !== 'object') return false;
    const proto = Object.getPrototypeOf(v);
    return proto === Object.prototype || proto === null;
  }

  /* 返回 undefined 表示「这个值不要存」，调用方负责跳过该键 */
  function clone(v, ancestors, depth) {
    if (v === null) return null;
    const t = typeof v;
    if (t === 'number') return isFinite(v) ? v : 0;      // NaN / Infinity 存不回来，归零
    if (t === 'string' || t === 'boolean') return v;
    /* undefined / function / symbol / bigint 全部跳过 */
    if (t !== 'object') return undefined;
    if (depth > MAX_DEPTH) return undefined;
    /* 祖先链检测循环引用：命中就断开这一支，不建环 */
    if (ancestors.indexOf(v) >= 0) return undefined;
    if (v instanceof Date) return v.toISOString();
    const anc = ancestors.concat([v]);
    if (Array.isArray(v)) {
      const out = [];
      for (let i = 0; i < v.length; i++) {
        const c = clone(v[i], anc, depth + 1);
        out.push(c === undefined ? null : c);            // 数组保长度，洞补 null
      }
      return out;
    }
    /* DOM 节点、Map、Set 这类非纯对象一律不存：存了也还原不回来 */
    if (!isPlainObject(v)) return undefined;
    const out = {};
    Object.keys(v).forEach((k) => {
      const c = clone(v[k], anc, depth + 1);
      if (c !== undefined) out[k] = c;
    });
    return out;
  }

  function encode(S) {
    const snap = clone(S, [], 0) || {};

    /* rng 是本局随机流，带一堆方法。只留种子文本与显示名，
       读回来用 create(seed) 重建——同一种子就是同一条序列，可复现。 */
    const seed = (S.rng && S.rng.seedText) || S.seed || null;
    const label = (S.rng && S.rng.label) || S.seedLabel || null;
    delete snap.rng;
    snap.__rng = { seed: seed, label: label };
    snap.seed = seed;
    snap.seedLabel = label;

    /* origin / ending 是数据表里的对象引用，只存 id，读回来查表 */
    snap.origin = S.origin ? S.origin.id : null;
    snap.ending = S.ending ? S.ending.id : null;

    /* 日志按天累积，保留太多存档会越来越大，只留最近的 */
    if (Array.isArray(snap.log)) snap.log = snap.log.slice(0, LOG_KEEP);
    if (Array.isArray(snap.dayLog)) snap.dayLog = snap.dayLog.slice(0, LOG_KEEP);
    if (Array.isArray(snap.cardLog)) snap.cardLog = snap.cardLog.slice(-40);

    return {
      version: C.version,                 // 与跨局档案无关，跟着游戏数据版本走
      at: new Date().toISOString(),
      state: snap,
    };
  }

  function decode(pack) {
    if (!pack || typeof pack !== 'object') return null;
    if (pack.version !== C.version) return null;
    const S = pack.state;
    if (!S || typeof S !== 'object') return null;

    /* 随机流还原 */
    const info = S.__rng || {};
    const seed = info.seed || S.seed || null;
    delete S.__rng;
    S.seed = seed;
    S.seedLabel = info.label || S.seedLabel || seed;
    /* seed 为空时 create 会退回系统随机，好歹能把局开起来 */
    S.rng = window.GAME_RNG.create(seed, info.label || null);

    /* 数据表引用还原：id 找不到就退回默认值，不让 undefined 流进引擎 */
    S.origin = (D.ORIGINS || []).find((o) => o.id === S.origin) || (D.ORIGINS || [])[0] || null;
    S.ending = S.ending ? ((D.ENDINGS || []).find((e) => e.id === S.ending) || null) : null;

    /* 老版本留下的字段可能不全，补齐形状，避免下游 .forEach 直接炸 */
    if (!S.stats || typeof S.stats !== 'object') S.stats = {};
    if (!S.tracks || typeof S.tracks !== 'object') S.tracks = {};
    if (!Array.isArray(S.hand)) S.hand = [];
    if (!Array.isArray(S.deck)) S.deck = [];
    if (!Array.isArray(S.log)) S.log = [];
    if (!Array.isArray(S.dayLog)) S.dayLog = [];
    if (!Array.isArray(S.briefs)) S.briefs = [];
    if (!Array.isArray(S.briefSeen)) S.briefSeen = [];
    if (!S.dailyUsed || typeof S.dailyUsed !== 'object') S.dailyUsed = {};
    if (!S.metNpcs || typeof S.metNpcs !== 'object') S.metNpcs = {};
    if (!S.pathFoldCount || typeof S.pathFoldCount !== 'object') S.pathFoldCount = {};
    if (!S.briefDistrictHits || typeof S.briefDistrictHits !== 'object') S.briefDistrictHits = {};
    if (!S.relations || typeof S.relations !== 'object') S.relations = {};
    if (typeof S.phase !== 'string') S.phase = 'play';
    if (typeof S.day !== 'number' || !isFinite(S.day)) S.day = 1;
    if (typeof S.phase === 'string' && S.phase !== 'play' && S.phase !== 'event' && S.phase !== 'end') S.phase = 'play';
    if (S.phase === 'end' && !S.ending) S.phase = 'play';   // 没结局的 end 状态走不下去
    return S;
  }

  /* ==========================================================
     二、localStorage 包一层
     隐私模式下 getItem/setItem 都可能直接抛，配额满了 setItem 也抛。
     所有读写都在这里消化掉，绝不让异常冒到调用方。
     ========================================================== */
  function rawGet() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function rawSet(txt) {
    try { localStorage.setItem(KEY, txt); return true; } catch (e) { return false; }
  }
  function rawDel() {
    try { localStorage.removeItem(KEY); } catch (e) { /* 隐私模式忽略 */ }
  }

  /* 统一读取入口：坏 JSON、旧版本一律当没有，并把脏档删掉，
     免得每次进游戏都拿一份读不懂的东西反复失败。 */
  function readPack() {
    const raw = rawGet();
    if (!raw) return null;
    let pack = null;
    try { pack = JSON.parse(raw); } catch (e) { pack = null; }
    if (!pack || typeof pack !== 'object' || !pack.state) { rawDel(); return null; }
    if (pack.version !== C.version) { rawDel(); return null; }
    return pack;
  }

  /* ==========================================================
     三、对外接口
     ========================================================== */
  function canSave(S) {
    if (!S || typeof S !== 'object') return { ok: false, why: '没有进行中的这一局。' };
    if (!S.origin) return { ok: false, why: '这一局还没开局。' };
    if (S.phase === 'end' || S.ending) return { ok: false, why: '这一局已经收场了，不用存。' };
    return { ok: true };
  }

  function save(S) {
    const ok = canSave(S);
    if (!ok.ok) return { ok: false, why: ok.why };
    try {
      if (!rawSet(JSON.stringify(encode(S)))) {
        return { ok: false, why: '浏览器不让写本地存储（可能是隐私模式或空间已满）。' };
      }
      return { ok: true };
    } catch (e) {
      return { ok: false, why: '存档写入失败。' };
    }
  }

  function load() {
    try {
      const pack = readPack();
      if (!pack) return null;
      const S = decode(pack);
      if (!S) { rawDel(); return null; }
      return S;
    } catch (e) {
      return null;
    }
  }

  function clear() { rawDel(); }

  /* 摘要：只解析一层外层，不还原整局，给「继续上一局」按钮用。
     按钮要的只是几个数字，没必要把整局 rebuild 一遍。 */
  function meta() {
    try {
      const pack = readPack();
      if (!pack) return null;
      const st = pack.state || {};
      const o = (D.ORIGINS || []).find((x) => x.id === st.origin) || null;
      const e = st.ending ? ((D.ENDINGS || []).find((x) => x.id === st.ending) || null) : null;
      return {
        day: Number(st.day) || 0,
        folded: Number(st.folded) || 0,
        origin: o ? o.name : (st.origin || ''),
        originId: st.origin || null,
        endingName: e ? e.name : '',
        savedAt: pack.at || '',
        version: pack.version,
      };
    } catch (e) {
      return null;
    }
  }

  function peek() {
    const m = meta();
    if (!m) return null;
    try {
      const pack = readPack();
      const st = (pack && pack.state) || {};
      return {
        day: m.day,
        folded: m.folded,
        origin: m.origin,
        originId: m.originId,
        endingName: m.endingName,
        savedAt: m.savedAt,
        version: m.version,
        seedLabel: st.seedLabel || st.seed || '',
        phase: st.phase || 'play',
        deadline: Number(st.deadline) || 0,
        hand: Array.isArray(st.hand) ? st.hand.length : 0,
        deck: Array.isArray(st.deck) ? st.deck.length : 0,
      };
    } catch (e) {
      return m;   // 详细字段读不出来也不能让按钮没得显示
    }
  }

  window.GAME_SAVE = {
    KEY,
    canSave,
    save,
    load,
    clear,
    peek,
    meta,
  };
})();

/* ===== game/rng.js ===== */
/* ==========================================================
   《七日指令》随机数层
   每一局用一个种子驱动：牌堆构成、城区分布、NPC 名单、
   事件与委托抽取全部走同一条随机流。
   同一种子 = 同一局。种子显示在界面上，可以复现、可以分享。
   ========================================================== */
(function () {
  'use strict';

  /* mulberry32：32 位种子，周期足够一局使用，速度快且分布均匀 */
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hash(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  /* 人类可读的种子：四个短词，便于口头分享 */
  const WORDS = [
    '穹顶', '酸雨', '接缝', '编号', '回收', '档案', '清单', '夜班',
    '清算', '纸页', '电梯', '接驳', '灰市', '诊所', '码头', '轨道',
  ];

  function makeSeed(rng) {
    const pick = () => WORDS[Math.floor(rng() * WORDS.length)];
    return pick() + '-' + pick() + '-' + Math.floor(rng() * 90 + 10);
  }

  /* 一次对局的随机流：所有子系统从这里取数，保证可复现 */
  function create(seedText, labelText) {
    const text = seedText || String(Date.now()) + '-' + Math.random();
    const rng = mulberry32(hash(text));
    const api = {
      seedText: text,
      /** 0..1 */
      next: rng,
      /** 0..n-1 */
      int(n) { return Math.floor(rng() * n); },
      /** a..b 含两端 */
      range(a, b) { return a + Math.floor(rng() * (b - a + 1)); },
      /** 从数组取一个 */
      pick(arr) { return arr[Math.floor(rng() * arr.length)]; },
      /** 取 n 个不重复 */
      sample(arr, n) {
        const c = arr.slice();
        api.shuffle(c);
        return c.slice(0, Math.min(n, c.length));
      },
      /** 原地洗牌（Fisher-Yates，走本局随机流） */
      shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(rng() * (i + 1));
          const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
        }
        return arr;
      },
      /** 概率判定 */
      chance(p) { return rng() < p; },
      /** 按权重取一项，weights 与 arr 等长 */
      weighted(arr, weights) {
        let total = 0;
        for (let i = 0; i < weights.length; i++) total += weights[i];
        let r = rng() * total;
        for (let i = 0; i < arr.length; i++) {
          r -= weights[i];
          if (r <= 0) return arr[i];
        }
        return arr[arr.length - 1];
      },
      /** 派生一个子流，用于互不干扰的子系统（如牌堆 vs 事件） */
      fork(tag) { return create(text + '#' + tag); },
    };
    // 玩家自己填的种子就直接当显示名，否则生成一个易读的
    api.label = labelText || (seedText ? seedText : makeSeed(rng));
    return api;
  }

  window.GAME_RNG = { create, mulberry32, hash, makeSeed, WORDS };
})();

/* ===== game/engine.js ===== */
/* ==========================================================
   《七日指令》核心引擎 —— 状态机 + 结算
   随机化版：牌堆、目标、事件、委托全部由本局种子驱动
   ========================================================== */
(function () {
  'use strict';
  const D = window.GAME_DATA;
  const C = D.CONFIG;

  /* ==========================================================
     一、合并扩展内容（在数据加载后立即执行一次）
     ========================================================== */
  (function mergeAll() {
    const seen = {};
    D.ENDINGS.forEach((e) => { seen[e.id] = 1; });
    const take = (pool) => {
      const out = [];
      (pool || []).forEach((e) => { if (!seen[e.id]) { seen[e.id] = 1; out.push(e); } });
      return out;
    };

    // 城区：按 id 去重追加
    if (Array.isArray(window.DISTRICTS_EXTRA)) {
      const have = {};
      D.DISTRICTS.forEach((d) => { have[d.id] = 1; });
      window.DISTRICTS_EXTRA.forEach((d) => { if (!have[d.id]) { have[d.id] = 1; D.DISTRICTS.push(d); } });
    }

    // 目标资产：按 id 去重追加
    if (Array.isArray(window.ASSETS_EXTRA)) {
      const have = {};
      D.ASSETS.forEach((a) => { have[a.id] = 1; });
      window.ASSETS_EXTRA.forEach((a) => { if (!have[a.id]) { have[a.id] = 1; D.ASSETS.push(a); } });
    }

    // 事件：普通扩展 + 初见事件
    const evSeen = {};
    D.EVENTS.forEach((e) => { evSeen[e.id] = 1; });
    const pushEv = (pool) => (pool || []).forEach((e) => {
      if (!evSeen[e.id]) { evSeen[e.id] = 1; D.EVENTS.push(e); }
    });
    pushEv(window.EVENTS_EXTRA);
    pushEv(window.EVENTS_MEET);
    pushEv(window.EVENTS_V5);
    pushEv(window.EVENTS_V6);

    // 结局：三类定调结局条件最具体，排最前；其余扩展插在兜底之前
    const tiered = take(window.ENDINGS_EXTRA2);
    if (tiered.length) D.ENDINGS.unshift(...tiered);
    const extra = take(window.ENDINGS_EXTRA);
    if (extra.length) {
      let at = D.ENDINGS.findIndex((e) => e.id === 'survivor');
      if (at < 0) at = D.ENDINGS.length;
      D.ENDINGS.splice(at, 0, ...extra);
    }
  })();

  /* ==========================================================
     二、基础工具
     ========================================================== */
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  /* ==========================================================
     二·五、NPC 名录
     初见事件里只有名字（写在标题里），没有稳定 id。
     这里建立 名字 / 立绘 → id 的索引，供「认识」面板与委托面板共用。
     ========================================================== */
  const NPCS = {
    'wen-duo': { name: '闻铎', role: '董事会监事', district: 'tower', portrait: 'portrait-monitor' },
    'su-wen': { name: '苏纹', role: '董事会日程官', district: 'tower', portrait: 'portrait-su' },
    'yu-nanzhi': { name: '郁南枝', role: '清算行首席', district: 'exchange', portrait: 'portrait-yu' },
    'dai-siyuan': { name: '戴思远', role: '合规伦理审查官', district: 'exchange', portrait: 'portrait-dai' },
    'cheng-yan': { name: '程砚', role: '首席科学家', district: 'lab', portrait: 'portrait-scientist' },
    'peng-jian': { name: '彭戬', role: '研究所安保总管', district: 'lab', portrait: 'portrait-peng' },
    'lao-ya': { name: '老鸦', role: '灰市掮客', district: 'slum', portrait: 'portrait-fixer' },
    'lu-wan': { name: '陆晚', role: '无证诊所医生', district: 'slum', portrait: 'portrait-lu' },
    'tie-gui': { name: '铁贵', role: '装卸工会头目', district: 'docks', portrait: 'portrait-tie' },
    'yin-mian': { name: '银面', role: '女术士的代理人', district: 'docks', portrait: 'portrait-witch' },
    'wen-shicheng': { name: '温仕成', role: '引航票务掮客', district: 'orbit', portrait: 'portrait-wen' },
    'yu-ke': { name: '雨客', role: '穹顶外「潮」的接触人', district: 'orbit', portrait: 'portrait-yuke' },
    /* 四个新城区新增的常驻角色 */
    'xun-jie': { name: '荀戒', role: '环带巡检员', district: 'ring', portrait: 'portrait-ring' },
    'sa-er': { name: '萨尔', role: '潮的拾荒者', district: 'outside', portrait: 'portrait-out' },
    'ban-tou': { name: '班头', role: '回收场领班', district: 'salvage', portrait: 'portrait-sal' },
    'wu-mian': { name: '无面', role: '记忆银行柜员', district: 'memory', portrait: 'portrait-mem' },
  };

  const NAME_TO_ID = {};
  const PORTRAIT_TO_ID = {};
  Object.keys(NPCS).forEach((id) => {
    NAME_TO_ID[NPCS[id].name] = id;
    PORTRAIT_TO_ID[NPCS[id].portrait] = id;
  });

  /**
   * 从事件推出发布者 id。三条路依次尝试：
   *   1. 事件自带 npc 字段
   *   2. 标题里的「初见 · 名字」，去掉括号补充
   *   3. 立绘文件名反查
   */
  function npcIdOf(ev) {
    if (!ev) return null;
    if (ev.npc && NPCS[ev.npc]) return ev.npc;
    if (ev.portrait && PORTRAIT_TO_ID[ev.portrait]) return PORTRAIT_TO_ID[ev.portrait];
    const t = String(ev.title || '');
    const m = t.match(/初见\s*[·・:：]\s*([^\s（(]+)/);
    if (m && NAME_TO_ID[m[1]]) return NAME_TO_ID[m[1]];
    // 兜底：标题里直接出现名字
    const keys = Object.keys(NAME_TO_ID);
    for (let i = 0; i < keys.length; i++) {
      if (t.indexOf(keys[i]) >= 0) return NAME_TO_ID[keys[i]];
    }
    return null;
  }

  const npcOf = (id) => NPCS[id] || null;

  // 本局随机流。newGame 之前调用时退回系统随机，避免报错。
  let R = null;
  const fallback = window.GAME_RNG.create('bootstrap');
  const rngOf = () => R || fallback;

  const rnd = (n) => rngOf().int(n);
  const pick = (arr) => rngOf().pick(arr);
  const shuffle = (a) => rngOf().shuffle(a.slice());

  /* ==========================================================
     三、牌堆
     ========================================================== */
  function newDeck() {
    const deck = [];
    let uid = 0;
    D.PATHS.forEach((p) => {
      D.TIERS.forEach((t) => {
        const count = t.id === 3 ? 1 : 2;   // 4 路径 × (2+2+1) = 20 张
        for (let i = 0; i < count; i++) {
          deck.push({ uid: 'c' + (uid++), pathId: p.id, tier: t.id, need: t.need, target: null });
        }
      });
    });
    // 开局的三张要保证是可折的：先各路径取一张最低品级，打乱后放最前
    const easy = [];
    D.PATHS.forEach((p) => {
      const c = deck.find((x) => x.pathId === p.id && x.tier === 1 && !easy.includes(x));
      if (c) easy.push(c);
    });
    shuffle(easy);
    const rest = deck.filter((c) => easy.indexOf(c) < 0);
    shuffle(rest);
    return easy.concat(rest);
  }

  /* ==========================================================
     四、开局
     ========================================================== */
  function newGame(originId, seedText) {
    R = window.GAME_RNG.create(seedText);

    const o = D.ORIGINS.find((x) => x.id === originId) || D.ORIGINS[0];
    const all = newDeck();

    const s = {
      version: C.version,
      seed: R.seedText,
      seedLabel: R.label,
      phase: 'play',
      day: 1,
      deadline: C.deadlineDays,
      ap: C.apPerDay,
      apMax: C.apPerDay,
      origin: o,
      stats: Object.assign({}, o.stats),
      tracks: Object.assign({}, o.tracks),
      money: o.money,
      intel: o.intel,
      chips: 0,
      gear: 0,
      boostDiscount: 0,
      foresight: false,
      /* 开局只发三张：牌是挣来的，不是发全的。
         其余十七张留在牌堆，靠主线、关系、委托、城区动作逐张拿到。 */
      hand: all.slice(0, C.startHand),
      deck: all.slice(C.startHand),
      folded: 0,
      fortune: 0,
      log: [],
      pendingEvent: null,
      ending: null,
      lastRoll: null,
      lastResult: null,
      dailyUsed: {},
      rng: R,
      /* --- 委托系统 --- */
      briefs: [],
      briefSeen: [],
      briefCounter: 0,
      briefDone: 0,
      briefExpired: 0,
      briefRefused: 0,
      /* --- 用于委托条件的计数器 --- */
      pathFoldCount: {},
      briefDistrictHits: {},
      /* --- 认识过的 NPC --- */
      metNpcs: {},
      /* --- 认可过你的 NPC ---
         认识不等于拿到卡。一个人要先在某件具体的事上看清你是什么样的人，
         才肯把自己的牌交出来。十六个人条件各不相同。 */
      approved: {},
      dayLog: [],
    };

    seedHand(s);
    pushLog(s, 'day', '第一天。董事会把一副牌推到你面前。本局种子 ' + R.label + '。');
    return s;
  }

  // 补牌：带地区权重，让目标分布随本局随机
  function seedHand(s) {
    s.hand.forEach((c) => { if (!c.target) c.target = pickTarget(s, c); });
  }

  /* ==========================================================
     四·五、卡牌获取
     牌不再开局发全。所有新牌都从牌堆里按条件抽出来，
     来源记在 s.cardLog 里，玩家能看到每一张是怎么来的。
     ========================================================== */
  function grantCard(s, opts) {
    const o = opts || {};
    const n = o.n || 1;
    const got = [];
    for (let i = 0; i < n; i++) {
      if (!s.deck.length) break;
      if (s.hand.length >= (C.handMax || 7)) break;

      let idx = -1;
      // 优先匹配偏好：先按路径+品级，再按路径，再按品级，最后随便一张
      if (o.path) {
        idx = s.deck.findIndex((c) => c.pathId === o.path && (!o.tier || c.tier === o.tier));
        if (idx < 0) idx = s.deck.findIndex((c) => c.pathId === o.path);
      }
      if (idx < 0 && o.tier) idx = s.deck.findIndex((c) => c.tier === o.tier);
      if (idx < 0) idx = 0;

      const card = s.deck.splice(idx, 1)[0];
      card.target = pickTarget(s, card);
      card.from = o.reason || '来源不明';
      card.gotDay = s.day;
      s.hand.push(card);
      got.push(card);
      s.cardLog = s.cardLog || [];
      s.cardLog.push({ day: s.day, card: label(card), reason: card.from });
      if (s.cardLog.length > 40) s.cardLog.shift();
    }
    if (got.length) {
      pushLog(s, 'good', '获得 ' + got.map((c) => '「' + label(c) + '」').join('、') +
        '（' + (o.reason || '来源不明') + '）');
    }
    return got;
  }


  /* ---------------- 引导者退场 ----------------
     苏纹把「执行人」那一栏改成自己的编号，替玩家走完最后一步。
     她不在了，从她那条流程里发出来的牌也就不在结算表上：
     牌堆清空、申领失效。玩家手里剩几张就是几张。
     这是这一局最疼的一次损失，也是通往真正出路必须付的价。 */
  function guideFalls(s) {
    if (s.guideGone) return { ok: false, why: '这一步已经走过了。' };
    s.guideGone = true;
    const lost = (s.deck || []).length;
    s.deck = [];
    s.boardClosed = true;
    pushLog(s, 'bad', '苏纹把「执行人」改成了自己的编号。牌堆清空。');
    const got = grantCard(s, { reason: '她最后留下的那张', n: 1 });
    return { ok: true, lost: lost, card: got.length ? got[0] : null };
  }

  /* ---------------- 认可 ----------------
     他认可你之后，才把自己的牌交出来。
     这件事只发生一次，之后再找他也不会多给。 */
  function approve(s, npcId) {
    if (!npcId) return null;
    s.approved = s.approved || {};
    if (s.approved[npcId]) return null;
    s.approved[npcId] = 1;
    const info = npcOf(npcId) || { name: npcId };
    const got = grantCard(s, { reason: info.name + '认可了你', n: 1 });
    pushLog(s, 'good', info.name + '认可了你' + (got.length ? '，并把他的牌交给你' : ''));
    return got.length ? got[0] : null;
  }

  function isApproved(s, npcId) {
    return !!(s && s.approved && s.approved[npcId]);
  }

  /* ---------------- 申领：保底牌源 ----------------
     折不动牌的时候，还能走一趟流程再要一张。
     代价是 2 点行动，等于放弃当天的一半行动力。
  ------------------------------------------------------------ */
  function drawCard(s) {
    if (s.guideGone) {
      return { ok: false, why: '排期的人不在了，董事会那边没人替你走流程。' };
    }
    if (!s.deck || !s.deck.length) return { ok: false, why: '董事会那边也没有余牌了。' };
    if (s.hand.length >= (C.handMax || 7)) return { ok: false, why: '手上拿不下了，先折掉几张。' };
    const cost = 2;
    if (s.ap < cost) return { ok: false, why: '申领要走三道流程，至少要 2 点行动。' };
    s.ap -= cost;
    const lines = [];
    const got = grantCard(s, { reason: '你走了一趟流程', n: 1 });
    if (!got.length) return { ok: false, why: '没领到。' };
    lines.push('你把申请递上去，等了四十分钟，窗口后面的人从抽屉里抽出一张：' + label(got[0]) + '。');
    lines.push('消耗 2 点行动。牌堆还剩 ' + s.deck.length + ' 张。');
    pushLog(s, 'info', '申领到一张 ' + label(got[0]));
    return { ok: true, lines: lines, card: got[0], ap: s.ap };
  }

  /* ---------------- 按来源库检查是否有新牌可拿 ----------------
     CARD_SOURCES 里的每条都带 trigger，满足就给。
     每条只给一次，记在 s.cardSourceUsed 里。
  ------------------------------------------------------------ */
  function checkCardSources(s) {
    const list = Array.isArray(window.CARD_SOURCES) ? window.CARD_SOURCES : [];
    if (!list.length) return [];
    s.cardSourceUsed = s.cardSourceUsed || {};
    s.cardLog = s.cardLog || [];
    const got = [];
    for (let i = 0; i < list.length; i++) {
      const cs = list[i];
      if (!cs || !cs.id || s.cardSourceUsed[cs.id]) continue;
      /* 兼容两种写法：kind/need 与 source/trigger */
      const kind = cs.kind || cs.source || 'npc';
      const t = cs.trigger || {};
      const need = cs.need != null ? cs.need : null;
      let ok = false;

      if (kind === 'npc') {
        const who = cs.npc || t.npc;
        if (!who || !(s.metNpcs && s.metNpcs[who])) continue;
        /* 认可制：以前只要关系值刷到线就自动给牌，人成了提款机。
           现在必须先发生一次「认可」——他在具体的事上看清了你。
           关系值仍然要够，但它只是门槛，不再是理由。 */
        if (!(s.approved && s.approved[who])) continue;
        ok = ST_rel(s, who) >= (need != null ? need : (t.minRel != null ? t.minRel : 1));
      } else if (kind === 'district') {
        const hits = (s.briefDistrictHits && s.briefDistrictHits[cs.district]) || 0;
        ok = hits >= (need != null ? need : (t.minHits != null ? t.minHits : 2));
      } else if (kind === 'stat') {
        ok = (s.stats[cs.stat] || 0) >= (need != null ? need : 7);
      } else if (kind === 'track') {
        ok = (s.tracks[cs.track] || 0) >= (need != null ? need : 6);
      } else if (kind === 'day') {
        ok = s.day >= (need != null ? need : (t.minDay != null ? t.minDay : 5));
      } else {
        /* 兜底：仍支持旧的 trigger 写法 */
        ok = true;
        if (t.minRel != null && (!csrf_npc(cs) || ST_rel(s, csrf_npc(cs)) < t.minRel)) ok = false;
        if (ok && t.minFolded != null && s.folded < t.minFolded) ok = false;
        if (ok && t.minDay != null && s.day < t.minDay) ok = false;
        if (ok && t.flag && !(s.storyFlags && s.storyFlags[t.flag])) ok = false;
        if (ok && t.met && !(s.metNpcs && s.metNpcs[t.met])) ok = false;
      }
      if (!ok) continue;

      const n = cs.n || (cs.grant && cs.grant.n) || 1;
      const path = cs.path || (cs.grant && cs.grant.path) || null;
      const tier = cs.tier || (cs.grant && cs.grant.tier) || null;
      const cards = grantCard(s, { reason: cs.hint || cs.title || '来源', n: n, path: path, tier: tier });
      if (cards.length) {
        s.cardSourceUsed[cs.id] = 1;
        got.push({ src: cs, cards: cards });
      }
    }
    return got;
  }
  /* 旧写法里 npc 可能写在 trigger 上，取出来备用 */
  function csrf_npc(cs) { return cs.npc || (cs.trigger && cs.trigger.npc) || null; }

  /* 只读关系值，避免循环依赖 */
  function ST_rel(s, npcId) {
    if (!s.relations) s.relations = {};
    return Number(s.relations[npcId]) || 0;
  }

  /** 供外部查询：还能拿到几张 */
  function cardsLeft(s) { return s.deck ? s.deck.length : 0; }

  /** 按路径统计手牌，给"某条路径需要几张"这类条件用 */
  function handPathCount(s, pathId) {
    return (s.hand || []).filter((c) => c.pathId === pathId).length;
  }

  /* ==========================================================
     五、查询
     ========================================================== */
  const pathOf = (id) => D.PATHS.find((p) => p.id === id);
  const tierOf = (id) => D.TIERS.find((t) => t.id === id);
  const assetOf = (id) => D.ASSETS.find((a) => a.id === id);
  const districtOf = (id) => (D.DISTRICTS || []).find((d) => d.id === id);
  const statName = (k) => {
    const x = D.STATS.find((v) => v.id === k);
    return x ? x.name : k;
  };
  const trackName = (k) => {
    const x = D.TRACKS.find((v) => v.id === k);
    return x ? x.name : k;
  };

  function pickTarget(s, card) {
    const path = pathOf(card.pathId);
    let pool = D.ASSETS.filter((a) => a.tags.indexOf(path.id) >= 0 && a.level === card.tier);
    if (!pool.length) pool = D.ASSETS.filter((a) => a.level === card.tier);
    if (!pool.length) return null;
    return pick(pool).id;
  }

  /* ==========================================================
     六、判定
     dc 由 级别 / 目标抗性 / 主属性 / 装备 / 权柄 / 加注 共同决定
     ========================================================== */
  function checkDC(s, card, boost) {
    const path = pathOf(card.pathId);
    const target = assetOf(card.target);
    let dc = 6 + card.tier * 2;
    if (target) dc += (target.resist || 0) * 2;
    dc -= Math.floor(s.stats[path.stat] * 0.8);
    dc -= s.gear;
    dc -= Math.floor(s.tracks.power / 4);
    dc -= (boost || 0);
    return clamp(dc, 3, 19);
  }

  function successRate(s, card, boost) {
    return clamp((21 - checkDC(s, card, boost)) / 20, 0.05, 0.95);
  }

  function roll(s, card, boost) {
    const dc = checkDC(s, card, boost);
    const r = 1 + rnd(20);
    const pass = r >= dc || r === 20;
    s.lastRoll = { r: r, dc: dc, pass: pass, crit: r === 20, fumble: r === 1 };
    return s.lastRoll;
  }

  /* ==========================================================
     七、折卡
     ========================================================== */
  function canFold(s, card) {
    if (!card) return { ok: false, why: '牌不在手里。' };
    const target = assetOf(card.target);
    if (!target) return { ok: false, why: '这张牌没有可用目标，先换一张。' };
    if (target.level !== card.tier) return { ok: false, why: '指令级别与目标级别不匹配。' };
    if (s.ap < 2) return { ok: false, why: '这一天已经没有力气出门了。' };
    return { ok: true, why: pathOf(card.pathId).verb + target.name };
  }

  const BOOST_COST = 20, BOOST_VAL = 3;
  const CHIP_PER = 2, CHIP_CAP = 5;

  function boostCost(s) {
    return Math.max(10, BOOST_COST - (s.boostDiscount || 0));
  }

  function fold(s, uid, useBoost, chipSpend) {
    const card = s.hand.find((c) => c.uid === uid);
    if (!card) return { ok: false, why: '牌不在手里。' };
    const gate = canFold(s, card);
    if (!gate.ok) return gate;

    let boost = 0;
    if (useBoost) {
      const cost = boostCost(s);
      if (s.money < cost) return { ok: false, why: '加注需要 ' + cost + ' 信用点。' };
      s.money -= cost;
      boost = BOOST_VAL;
    }
    let chipsUsed = 0;
    if (chipSpend) {
      chipsUsed = Math.min(Math.floor(s.chips / CHIP_PER), CHIP_CAP, Math.max(0, chipSpend | 0));
      if (chipsUsed > 0) { s.chips -= chipsUsed * CHIP_PER; boost += chipsUsed; }
    }

    const path = pathOf(card.pathId);
    const target = assetOf(card.target);
    const out = roll(s, card, boost);
    s.ap -= 2;

    const res = { ok: true, pass: out.pass, crit: out.crit, fumble: out.fumble, r: out.r, dc: out.dc, lines: [], fold: false };
    const extra = [];
    if (useBoost) extra.push('现金加注 +' + BOOST_VAL);
    if (chipsUsed) extra.push('投入 ' + (chipsUsed * CHIP_PER) + ' 芯片 +' + chipsUsed);
    res.lines.push('掷出 ' + out.r + '，判定线 ' + out.dc + '（成功率 ' + Math.round(successRate(s, card, boost) * 100) + '%）' + (extra.length ? '，' + extra.join('、') : '') + '。');

    if (out.pass) {
      res.lines.push(path.verb + '「' + target.name + '」成功。');
      const rw = path.reward;
      const mul = out.crit ? 1.8 : (0.85 + rngOf().next() * 0.3);
      const gain = Math.round(rw.money * mul);
      s.money += gain;
      s.intel += rw.intel;
      s.chips += rw.chips;
      res.lines.push('+ ' + gain + ' 信用点、+' + rw.intel + ' 情报、+' + rw.chips + ' 指令芯片。');
      addTracks(s, path.tracks);
      if (trackLine(path.tracks)) res.lines.push(trackLine(path.tracks) + '。');
      if (s.origin.id === 'enforcer' && (path.id === 'purge' || path.id === 'expand')) {
        s.chips += 2; res.lines.push('外勤本能：+2 芯片。');
      }

      s.hand = s.hand.filter((c) => c.uid !== card.uid);
      s.folded += 1;
      s.fortune += 1 + card.tier;
      s.deadline = C.deadlineDays;
      res.fold = true;
      res.lines.push('牌已折断，期限重置为 7 天。');

      // 给委托系统记账
      s.pathFoldCount[path.id] = (s.pathFoldCount[path.id] || 0) + 1;
      if (target.district) s.briefDistrictHits[target.district] = (s.briefDistrictHits[target.district] || 0) + 1;

      // 不再自动补牌：折掉一张就少一张，新牌要自己去挣
      if (s.folded % 2 === 0) {
        s.chips += 3;
        s.apMax = Math.min(6, C.apPerDay + Math.floor(s.folded / 4));
        res.lines.push('董事会追加授权：+3 芯片。');
      }
      // 每折两张，董事会补发一张（这是最稳的牌源）
      if (s.folded % 2 === 0) {
        const got = grantCard(s, { reason: '董事会按进度补发', n: 1 });
        if (got.length) res.lines.push('董事会补发一张：' + label(got[0]) + '。');
      }
      if (s.folded >= C.deckGoal) res.lines.push('十二张牌，全部折断。');
    } else {
      res.lines.push(path.verb + '「' + target.name + '」失败。');
      s.stats.vitality = clamp(s.stats.vitality - 1, 0, C.statCap);
      if (card.tier >= 2) s.tracks.sin = clamp(s.tracks.sin + 1, 0, C.trackCap);
      const loss = Math.min(s.money, 8 + card.tier * 4);
      s.money -= loss;
      res.lines.push('体魄 -1，善后花掉 ' + loss + ' 信用点。');
      if (out.fumble) {
        s.tracks.loyalty = clamp(s.tracks.loyalty - 1, 0, C.trackCap);
        res.lines.push('崩盘：现场留证，忠诚 -1。');
      }
      if (s.origin.id === 'ghost' && rngOf().chance(0.6)) {
        s.tracks.sin = Math.max(0, s.tracks.sin - 1);
        res.lines.push('幽灵协议：痕迹被抹掉一部分，罪痕 -1。');
      }
    }
    s.lastResult = res;
    pushLog(s, out.pass ? 'good' : 'bad', (out.pass ? '✔ ' : '✘ ') + path.name + ' ' + target.name);
    checkEnd(s);
    return res;
  }

  function addTracks(s, t) {
    Object.keys(t || {}).forEach((k) => {
      s.tracks[k] = clamp(s.tracks[k] + t[k], 0, C.trackCap);
    });
  }

  function trackLine(t) {
    const parts = [];
    D.TRACKS.forEach((k) => { if (t[k.id]) parts.push(k.name + (t[k.id] > 0 ? ' +' : ' ') + t[k.id]); });
    return parts.join('，');
  }

  function label(c) {
    return tierOf(c.tier).name + '·' + pathOf(c.pathId).name;
  }

  /* ==========================================================
     八、日常行动
     设计说明见 design/ACTIONS.md：
     行动不是附加的小游戏，它是「不用掷点就能把局面推回安全区」的唯一手段。
     折牌有失败风险，行动则稳定产出资源与属性，用来把判定线压下去。
     牌堆与行动的关系：行动 → 资源/属性 → 更高的成功率 → 更少失败损失。
     ========================================================== */
  function doAction(s, actionId) {
    const a = D.ACTIONS.find((x) => x.id === actionId);
    if (!a) return { ok: false, why: '没有这个行动。' };

    let cost = a.cost;
    if (s.origin.id === 'ghost' && actionId === 'intel') cost = 1;
    if (s.ap < cost) return { ok: false, why: '行动点不够。' };

    /* 花钱的行动：先验钱，钱不够就别扣行动点 */
    if (a.price && s.money < a.price) {
      return { ok: false, why: a.name + '需要 ' + a.price + ' 信用点，你拿不出来。' };
    }

    if (actionId === 'clean') {
      const c = 45;
      s.dailyUsed = s.dailyUsed || {};
      if (s.dailyUsed.clean) return { ok: false, why: '一天只能善后一次，监事会盯得紧。' };
      if (s.money < c) return { ok: false, why: '善后需要 ' + c + ' 信用点，你拿不出来。' };
    }

    s.ap -= cost;
    const mult = s.origin.id === 'fixer' && (actionId === 'intel' || actionId === 'social') ? 2 : 1;
    const lines = [];
    const r = a.run;

    if (r.money) {
      let g = Array.isArray(r.money) ? rngOf().range(r.money[0], r.money[1]) : r.money;
      g *= mult; s.money += g;
      lines.push('家业进账 ' + g + ' 信用点。');
    }
    if (r.intel) { const g = r.intel * mult; s.intel += g; lines.push('+' + g + ' 情报。'); }
    if (r.reveal) { s.revealed = true; lines.push('所有指令目标已显形。'); }
    if (r.loyalty) { addTracks(s, { loyalty: r.loyalty }); lines.push('忠诚 +' + r.loyalty + '。'); }
    if (r.charm) { s.stats.charm = clamp(s.stats.charm + 1, 0, C.statCap); lines.push('魅力 +1。'); }
    if (r.renown) { addTracks(s, { renown: r.renown * mult }); lines.push('声望 +' + r.renown * mult + '。'); }
    if (r.statRandom) {
      const k = pick(D.STATS).id;
      s.stats[k] = clamp(s.stats[k] + 1, 0, C.statCap);
      lines.push('进修完成：' + statName(k) + ' +1。');
    }
    if (r.field) lines.push(fieldOp(s));
    if (r.draw) {
      if (s.guideGone) {
        lines.push('排期的人不在了。窗口后面没有人，抽屉是空的。');
      } else {
        const got = grantCard(s, { reason: '你走了一趟流程', n: 1 });
        if (got.length) {
          lines.push('窗口后面的人从抽屉里抽出一张：' + label(got[0]) + '。牌堆还剩 ' + s.deck.length + ' 张。');
        } else {
          lines.push('董事会那边也没有余牌了。');
        }
      }
    }
    if (r.deal) {
      if (s.intel >= 3) { s.intel -= 3; s.chips += 3; lines.push('用 3 情报换来 3 枚指令芯片。'); }
      else if (s.money >= 25) { s.money -= 25; s.intel += 4; lines.push('花 25 信用点买到 4 份情报。'); }
      else lines.push('你手上既没有情报也没有现金，黑市的人礼貌地请你出去。');
    }
    if (actionId === 'clean') {
      s.money -= 45;
      s.dailyUsed.clean = true;
      s.tracks.sin = Math.max(0, s.tracks.sin - 1);
      lines.push('花掉 45 信用点买通关系，罪痕 -1。这一天不能再做第二次。');
    }
    /* ---------- 花钱办事 ---------- */
    if (a.price) { s.money -= a.price; lines.push('花掉 ' + a.price + ' 信用点。'); }
    if (r.bribe) {
      s.intel += 2; addTracks(s, { loyalty: 1 });
      lines.push('手续少了一道。窗口后面的人把钱压进抽屉，情报 +2，忠诚 +1。');
    }
    if (r.meds) {
      s.stats.vitality = clamp(s.stats.vitality + 2, 0, C.statCap);
      lines.push('伤处理好了，体魄 +2。陆晚没问伤是怎么来的，也没写进本子。');
    }
    if (r.pass) {
      s.intel += 1;
      s.storyFlags = s.storyFlags || {}; s.storyFlags.passToken = 1;
      lines.push('拿到一张进场条，情报 +1。');
    }
    if (r.rumor) {
      s.intel += 2;
      s.storyFlags = s.storyFlags || {};
      s.storyFlags.rumorBought = (s.storyFlags.rumorBought || 0) + 1;
      lines.push('买到一件别人不想让人知道的事，情报 +2。');
    }
    if (r.burn) {
      s.tracks.sin = Math.max(0, s.tracks.sin - 2);
      lines.push('一段记录从系统里消失，罪痕 -2。');
    }
    if (r.keep) {
      s.storyFlags = s.storyFlags || {}; s.storyFlags.graceKeep = 1;
      lines.push('那个人多留三天。三天之后还是三天之后。');
    }
    if (r.ticket) {
      s.storyFlags = s.storyFlags || {}; s.storyFlags.ticket = 1;
      lines.push('票押上了。它躺在你的档案里，像一行还没生效的注脚。');
    }
    if (r.patrol) {
      lines.push('巡检本前三十格都是「合格」。第三十一格那道痕，是新的。');
    }
    if (r.seam) {
      s.intel += 3;
      s.stats.vitality = clamp(s.stats.vitality - 1, 0, C.statCap);
      addTracks(s, { sin: 1 });
      lines.push('风里有酸味。情报 +3，体魄 -1，罪痕 +1。');
    }
    if (r.vitality) {
      s.stats.vitality = clamp(s.stats.vitality + r.vitality, 0, C.statCap);
      lines.push('体魄 ' + r.vitality + '。');
    }
    if (r.track) { addTracks(s, r.track); lines.push(trackLine(r.track) + '。'); }

    if (actionId === 'brief' && s.origin.id === 'clerk') {
      addTracks(s, { loyalty: 1 });
      lines.push('合规部资历：忠诚额外 +1。');
    }
    pushLog(s, 'info', a.name + '：' + lines.join(' '));
    return { ok: true, lines: lines, ap: s.ap };
  }

  function fieldOp(s) {
    const r = rngOf().int(100);
    if (r < 45) { const m = 15 + rnd(35); s.money += m; return '你在城南收了一笔外账，+' + m + ' 信用点。'; }
    if (r < 70) { const g = 1 + rnd(3); s.intel += g; return '你顺着一条货运线摸到名录，+' + g + ' 情报。'; }
    if (r < 88) { const c = 1 + rnd(3); s.chips += c; return '你在废弃仓里拆到还能用的部件，+' + c + ' 芯片。'; }
    s.stats.vitality = clamp(s.stats.vitality - 1, 0, C.statCap);
    const m = 20 + rnd(30); s.money += m;
    return '出门遇到伏击，你带着伤和 ' + m + ' 信用点回来。体魄 -1。';
  }

  /* ==========================================================
     九、换牌
     ========================================================== */
  function swapCard(s, uid) {
    const idx = s.hand.findIndex((c) => c.uid === uid);
    if (idx < 0) return { ok: false, why: '牌不在手里。' };
    if (s.deck.length === 0) return { ok: false, why: '牌堆已经空了，没有别的牌可换。' };
    const cost = s.origin.id === 'ghost' ? 1 : 2;
    if (s.ap < cost) return { ok: false, why: '换牌需要 ' + cost + ' 点行动。' };
    s.ap -= cost;
    const used = s.hand[idx];
    const nc = s.deck.shift();
    nc.target = pickTarget(s, nc);
    s.hand[idx] = nc;
    s.deck.push(used);
    pushLog(s, 'info', '你把「' + label(used) + '」退回，换成「' + label(nc) + '」。');
    return { ok: true, card: nc };
  }

  /* ==========================================================
     十、回合推进
     ========================================================== */
  function endDay(s) {
    s.day += 1;
    s.deadline -= 1;
    s.ap = s.apMax;
    s.dailyUsed = {};

    if (s.money > 0) s.money -= Math.min(s.money, 4 + s.folded * 2);

    // 罪痕自然消散
    if (s.tracks.sin >= 4 && rngOf().chance(0.65)) s.tracks.sin -= 1;
    // 监事会追查
    if (s.tracks.sin >= 8 && rngOf().chance(0.4)) {
      s.tracks.loyalty = clamp(s.tracks.loyalty - 1, 0, C.trackCap);
      s.intel = Math.max(0, s.intel - 2);
      pushLog(s, 'bad', '监事会开始查你。忠诚 -1，情报 -2。');
    }
    // 忠诚自然回流
    if (s.tracks.loyalty > 0 && s.tracks.loyalty < C.trackCap) {
      s.tracks.loyalty = clamp(s.tracks.loyalty + 1, 0, C.trackCap);
    }

    s.hand.forEach((c) => { c.target = pickTarget(s, c); });
    if (!s.briefDistrictHits) s.briefDistrictHits = {};
    if (!s.pathFoldCount) s.pathFoldCount = {};

    /* --- 牌源：满足条件的人会开始给你牌 --- */
    const newCards = checkCardSources(s);
    if (newCards.length) {
      newCards.forEach((x) => {
        pushLog(s, 'good', '「' + (x.src.title || '') + '」→ 得到 ' +
          x.cards.map((c) => label(c)).join('、'));
      });
    }

    /* --- 委托：先结算超期，再看是否来新的 --- */
    const expired = window.GAME_BRIEFS ? window.GAME_BRIEFS.tick(s) : [];
    const incoming = window.GAME_BRIEFS ? window.GAME_BRIEFS.maybeSpawn(s) : null;

    if (s.deadline <= 0) {
      pushLog(s, 'bad', '期限归零。会客室的门在你身后关上了。');
      s.ending = endingById('broken');
      s.phase = 'end';
      return { ok: true, dead: true, expired: expired, incoming: incoming };
    }

    // 故事优先：主线或 NPC 支线占用今天的日程，没有才出随机事件
    const story = pickStory(s);
    if (story) {
      s.pendingStory = story;
      s.pendingEvent = null;
      s.phase = 'event';
      pushLog(s, 'day', '第 ' + s.day + ' 天。剩余期限 ' + s.deadline + ' 天。');
      return { ok: true, story: story, expired: expired, incoming: incoming };
    }

    const ev = pickEvent(s);
    if (!ev) {
      /* 事件池被条件筛空了（正常不该发生，gate 表留了兜底档）。
         宁可给玩家一个安静的白天，也不要抛异常卡死。 */
      pushLog(s, 'day', '第 ' + s.day + ' 天。今天没有别的事。');
      s.phase = 'play';
      return { ok: true, expired: expired, incoming: incoming };
    }
    s.pendingEvent = ev;
    s.phase = 'event';
    pushLog(s, 'day', '第 ' + s.day + ' 天。剩余期限 ' + s.deadline + ' 天。');
    return { ok: true, event: ev, expired: expired, incoming: incoming };
  }

  /* ==========================================================
     事件抽取
     以前就是把全部事件洗一遍按顺序发，200 条事件一条条件都没有，
     第 1 天就可能抽到本该后期才发生的事。
     现在分三层门控：
     1) 硬条件：事件自带 when（复用剧情层那一套条件族）
     2) 进度带：minDay / maxDay / minFolded / maxFolded / act
     3) 配重：tier 越高越往后出，未标注的按轻事件处理
     没通过条件的事件不消耗，留在池里等以后满足。
     ========================================================== */
  let eventBag = [];
  const evSeen = {};

  /* 取这条事件的门控：优先用集中表 game/event-gates.js，没有就退回事件自带字段 */
  function gateOf(e) {
    if (!e) return null;
    const T = window.EVENT_GATES;
    if (T && T[e.id]) return T[e.id];
    return null;
  }

  function evPass(s, e) {
    if (!e) return false;
    if (evSeen[e.id]) return false;
    const g = gateOf(e) || {};
    const ST = window.GAME_STORY;

    /* 1) 硬条件：集中表的 w，或事件自带的 when。四族写法都支持 */
    const when = g.w || e.when;
    if (when && ST && typeof ST.condOk === 'function') {
      if (!ST.condOk(s, when)) return false;
    }

    /* 2) 进度带：集中表优先，事件自带字段兜底 */
    const day = s.day || 0;
    const folded = s.folded || 0;
    const minDay = g.d != null ? g.d : e.minDay;
    const maxDay = g.D != null ? g.D : e.maxDay;
    const minF = g.f != null ? g.f : e.minFolded;
    const maxF = g.F != null ? g.F : e.maxFolded;
    if (minDay != null && day < minDay) return false;
    if (maxDay != null && day > maxDay) return false;
    if (minF != null && folded < minF) return false;
    if (maxF != null && folded > maxF) return false;

    /* 3) 幕：集中表优先 */
    const act = g.a != null ? g.a : e.act;
    if (act != null) {
      const a = ST && ST.actOf ? ST.actOf(folded) : null;
      if (a && a.n !== act) return false;
    }

    /* 4) 初见：同一个人只初识一次 */
    const who = npcIdOf(e);
    if (who && String(e.title || '').indexOf('初见') >= 0) {
      if (s.metNpcs && s.metNpcs[who]) return false;
    }
    return true;
  }

  /* 配重：早局偏爱轻事件，越往后重事件权重越高。
     档位优先取集中表的 t，没有就用事件自带的 tier。 */
  function evWeight(s, e) {
    const g = gateOf(e) || {};
    const tier = g.t != null ? g.t : (e.tier || 1);
    const prog = Math.min(1, (s.folded || 0) / Math.max(1, C.deckGoal));
    if (tier >= 3) return 0.12 + prog * 1.6;
    if (tier === 2) return 0.45 + prog * 0.9;
    return 1.25 - prog * 0.55;
  }

  /* 跨圈层关系事件：两个不同圈层的人都认识之后才可能触发。
     它是「人跟人有关系」这件事唯一的可见出口 ——
     以前十六个人各在各的圈里，玩家看不到他们之间的牵扯。 */
  function pickRelationEvent(s) {
    const list = Array.isArray(window.RELATION_EVENTS) ? window.RELATION_EVENTS : [];
    if (!list.length) return null;
    s.relSeen = s.relSeen || {};
    const hot = list.filter((e) => {
      if (!e || !e.id || s.relSeen[e.id]) return false;
      if (e.bothMet === false) return true;
      return !!(s.metNpcs && s.metNpcs[e.a] && s.metNpcs[e.b]);
    });
    if (!hot.length) return null;
    const e = hot[rngOf().range(0, hot.length - 1)];
    s.relSeen[e.id] = 1;
    return {
      id: e.id,
      title: e.title,
      /* reveal 是内情，跟在正文后面，和正文之间空一行 */
      text: (e.text || '') + (e.reveal ? '\n\n' + e.reveal : ''),
      options: e.options || [],
      portrait: null,
      district: e.district || null,
      npc: null,
      isRelation: true,
    };
  }

  function pickEvent(s) {
    /* 关系事件优先：它比随机事件更有信息量，而且见过就不再出现 */
    const rel = pickRelationEvent(s);
    if (rel) return rel;

    const all = D.EVENTS;
    if (!all.length) return null;

    /* 先找满足条件的候选 */
    let pool = [];
    for (let i = 0; i < all.length; i++) {
      if (evPass(s, all[i])) pool.push(all[i]);
    }
    /* 全部用完（或条件太苛刻）就把已出清空，允许重开一轮 */
    if (!pool.length) {
      Object.keys(evSeen).forEach((k) => { delete evSeen[k]; });
      for (let i = 0; i < all.length; i++) if (evPass(s, all[i])) pool.push(all[i]);
    }
    if (!pool.length) return null;

    /* 按配重抽 */
    let total = 0;
    const w = pool.map((e) => { const x = Math.max(0.01, evWeight(s, e)); total += x; return x; });
    let r = rngOf().next() * total;
    let pickIdx = 0;
    for (let i = 0; i < pool.length; i++) { r -= w[i]; if (r <= 0) { pickIdx = i; break; } }
    const e = pool[pickIdx];
    evSeen[e.id] = 1;

    const npcId = npcIdOf(e);
    const out = {
      id: e.id, title: e.title, text: e.text, options: e.options,
      portrait: e.portrait || null,
      district: e.district || null,
      npc: npcId,
    };
    if (npcId && String(e.title || '').indexOf('初见') >= 0) {
      out.isMeet = true;
      s.metNpcs = s.metNpcs || {};
      s.metNpcs[npcId] = (s.metNpcs[npcId] || 0) + 1;
    }
    return out;
  }

  function resolveEvent(s, optIdx) {
    const ev = s.pendingEvent;
    if (!ev) return { ok: false };
    const opt = ev.options[optIdx];
    if (!opt) return { ok: false };
    const lines = [];
    const r = opt.run;

    if (r.stat) {
      const dc = r.dc;
      const rr = 1 + rnd(20);
      const pass = rr >= dc;
      lines.push('掷出 ' + rr + '，判定线 ' + dc + '。' + (pass ? '成功。' : '失败。'));
      applyEffect(s, pass ? r.ok : r.bad, lines);
    } else {
      applyEffect(s, r, lines);
    }
    s.pendingEvent = null;
    s.phase = 'play';
    pushLog(s, 'event', ev.title + ' → ' + opt.label);
    checkEnd(s);
    /* 选项的 after：选完之后实际发生了什么。
       单独带出来，由界面接在结果后面显示，不混进数值行。 */
    return { ok: true, lines: lines, after: opt.after || null, ev: ev, opt: opt };
  }

  function applyEffect(s, eff, lines) {
    if (!eff) return;
    // 顶层直接写名望键时并入 track
    const bare = {};
    Object.keys(eff).forEach((k) => { if (D.TRACKS.some((t) => t.id === k)) bare[k] = eff[k]; });
    if (Object.keys(bare).length) {
      eff = Object.assign({}, eff, { track: Object.assign({}, bare, eff.track || {}) });
    }
    if (eff.money) { s.money = Math.max(0, s.money + eff.money); lines.push('信用点 ' + (eff.money > 0 ? '+' : '') + eff.money + '。'); }
    if (eff.intel) { s.intel = Math.max(0, s.intel + eff.intel); lines.push('情报 ' + (eff.intel > 0 ? '+' : '') + eff.intel + '。'); }
    if (eff.chips) { s.chips = Math.max(0, s.chips + eff.chips); lines.push('芯片 ' + (eff.chips > 0 ? '+' : '') + eff.chips + '。'); }
    if (eff.vitality) { s.stats.vitality = clamp(s.stats.vitality + eff.vitality, 0, C.statCap); lines.push('体魄 ' + eff.vitality + '。'); }
    if (eff.gear) { s.gear += eff.gear; lines.push('装备 +' + eff.gear + '。'); }
    if (eff.guideFalls) {
      const gf = guideFalls(s);
      if (gf.ok) {
        lines.push('她把自己填进了「执行人」那一栏。');
        lines.push('牌堆里剩下 ' + gf.lost + ' 张指令卡当场作废——那些牌是从她的流程里发出来的。');
        lines.push('从这一刻起，董事会不再发牌给这一局。');
        if (gf.card) lines.push('桌上只留下一张：' + label(gf.card) + '。');
      }
    }
    if (eff.grantCard) {
      const g = eff.grantCard || {};
      const got = grantCard(s, { reason: '这趟没有白跑', n: g.n || 1, path: g.path || null, tier: g.tier || null });
      if (got.length) lines.push('拿到一张：' + got.map((c) => label(c)).join('、') + '。');
    }
    if (eff.resetDeadline) { s.deadline = C.deadlineDays; lines.push('期限重置为 7 天。'); }
    if (eff.statRandom) {
      const k = pick(D.STATS).id;
      s.stats[k] = clamp(s.stats[k] + eff.statRandom, 0, C.statCap);
      lines.push(statName(k) + ' +' + eff.statRandom + '。');
    }
    if (eff.track) {
      addTracks(s, eff.track);
      const tl = trackLine(eff.track);
      if (tl) lines.push(tl + '。');
    }
  }

  /* ==========================================================
     十·五、故事系统挂点
     每天结束时先看有没有故事场景（主线优先），没有才走随机事件。
     ========================================================== */
  function pickStory(S) {
    const ST = window.GAME_STORY;
    if (!ST) return null;
    return ST.nextScene(S);
  }

  function resolveStory(S, scene, optIdx) {
    const ST = window.GAME_STORY;
    if (!ST) return { ok: false };
    const r = ST.resolve(S, scene, optIdx);
    S.pendingEvent = null;
    S.phase = 'play';

    /* 认可桥段：他在这段戏里看清了你是什么样的人。
       选到「演给他看」的那一条，他就不给 —— 这一点必须真的影响结果，
       否则认可制又变回刷数值。 */
    if (r && r.ok && scene && (scene.kind === 'approval' || scene.approval)) {
      const opt = (scene.options || [])[optIdx] || {};
      /* 数据里标了 pass: true 的选项才算「他认可你」。
         只要有任意一条标了 pass，就按这个标记判；
         一条都没标的老数据退回「没标 fail 就算过」。 */
      const opts = scene.options || [];
      const marked = opts.some((o) => o.pass === true);
      const passes = marked ? opt.pass === true : (!opt.fail && !opt.noGrant);
      if (passes) {
        const got = approve(S, scene.npc);
        if (got) {
          r.lines = (r.lines || []).concat([
            (scene.npcName || '他') + '把一张牌推过来：' + label(got) + '。',
            '这张牌不是董事会发的，是他自己的。',
          ]);
          r.approved = true;
        } else if (isApproved(S, scene.npc)) {
          /* 之前就认可过了，这次不再重复给 */
        }
      } else {
        r.lines = (r.lines || []).concat(['他看出来了。这件事他不会再提，牌也不会给你。']);
      }
    }

    checkEnd(S);
    return r;
  }

  /* 供 story.js 调用，避免两处重复实现 */
  function applyEffectPublic(S, eff, lines) { applyEffect(S, eff, lines || []); }

  /* ==========================================================
     十一、终局
     ========================================================== */
  /* 一局怎么结束。
     顺序很重要：原来先查忠诚与罪痕、最后才查有没有折完，于是
     折满十二张的同时撞上罪痕满值，就会被判「被回收」—— 和游戏
     开头写给玩家的「折完全部十二张，你活下来」直接矛盾。
     现在通关优先：折完就是活下来，四轨只决定你活成哪一种。
     没折完的，才轮到忠诚清零与罪痕满值把人带走。 */
  function checkEnd(s) {
    if (s.folded >= C.deckGoal) { s.ending = pickEnding(s); s.phase = 'end'; return; }
    if (s.tracks.loyalty <= 0) { s.ending = endingById('broken'); s.phase = 'end'; return; }
    if (s.tracks.sin >= C.trackCap) { s.ending = endingById('purged'); s.phase = 'end'; return; }
  }

  /* 结局判定：按显式 priority 从高到低挑第一个命中的。
     以前是「数组顺序即优先级」，顺序被人动一下就悄悄改了结局，
     现在优先级写在数据里，谁都能看见。 */
  function pickEnding(s) {
    const list = D.ENDINGS.slice().sort((a, b) => (b.priority || 0) - (a.priority || 0));
    for (let i = 0; i < list.length; i++) {
      if (typeof list[i].cond === 'function' && list[i].cond(s)) return list[i];
    }
    return list[list.length - 1];
  }
  function endingById(id) {
    return D.ENDINGS.find((e) => e.id === id) || D.ENDINGS[D.ENDINGS.length - 1];
  }

  function pushLog(s, kind, text) {
    s.log.unshift({ kind: kind, text: text, day: s.day });
    if (s.log.length > 80) s.log.pop();
  }

  /* ==========================================================
     十三、导出
     ========================================================== */
  window.GAME_ENGINE = {
    newGame, fold, doAction, swapCard, endDay, resolveEvent,
    resolveStory, pickStory, approve, isApproved, guideFalls, pickRelationEvent, evPass, evWeight, pickEvent, applyEffectPublic, grantCard, cardsLeft, handPathCount, checkCardSources, drawCard,
    pathOf, tierOf, assetOf, districtOf, label, npcOf, npcIdOf, NPCS,
    checkDC, successRate, canFold, trackLine, checkEnd,
    boostCost, statName, trackName,
    BOOST_COST, BOOST_VAL, CHIP_PER, CHIP_CAP,
    get rng() { return R; },
  };
})();

/* ===== game/briefs.js ===== */
/* ==========================================================
   《七日指令》委托与通牒系统
   第二条压力线：除了你自己的十二张牌，别人也会给你派活。
   委托有硬期限，超期要付代价。它们挂在城区上，不进手牌。
   ========================================================== */
(function () {
  'use strict';
  const D = window.GAME_DATA;

  const MAX_ACTIVE = 3;
  const SPAWN_BASE = 0.62;      // 每天出现新委托的基础概率
  const SPAWN_RAMP = 0.04;      // 每过一天上升

  /* ---------------- 取内容库 ---------------- */
  function pool() {
    const p = Array.isArray(window.BRIEFS) ? window.BRIEFS.slice() : [];
    if (Array.isArray(window.BRIEFS2)) p.push.apply(p, window.BRIEFS2);
    return p.filter((b) => b && b.id && b.kind && b.solve);
  }

  /* ---------------- 数值效果 ---------------- */
  function applyEffect(S, eff, lines) {
    if (!eff) return;
    if (eff.money) { S.money = Math.max(0, S.money + eff.money); lines.push('信用点 ' + (eff.money > 0 ? '+' : '') + eff.money + '。'); }
    if (eff.intel) { S.intel = Math.max(0, S.intel + eff.intel); lines.push('情报 ' + (eff.intel > 0 ? '+' : '') + eff.intel + '。'); }
    if (eff.chips) { S.chips = Math.max(0, S.chips + eff.chips); lines.push('芯片 ' + (eff.chips > 0 ? '+' : '') + eff.chips + '。'); }
    if (eff.gear) { S.gear = Math.max(0, S.gear + eff.gear); lines.push('装备 ' + (eff.gear > 0 ? '+' : '') + eff.gear + '。'); }
    if (eff.vitality) { S.stats.vitality = Math.max(0, Math.min(D.CONFIG.statCap, S.stats.vitality + eff.vitality)); lines.push('体魄 ' + eff.vitality + '。'); }
    if (eff.resetDeadline) { S.deadline = D.CONFIG.deadlineDays; lines.push('期限重置为 7 天。'); }
    if (eff.track) {
      const parts = [];
      D.TRACKS.forEach((t) => {
        if (eff.track[t.id]) {
          S.tracks[t.id] = Math.max(0, Math.min(D.CONFIG.trackCap, S.tracks[t.id] + eff.track[t.id]));
          parts.push(t.name + (eff.track[t.id] > 0 ? ' +' : ' ') + eff.track[t.id]);
        }
      });
      if (parts.length) lines.push(parts.join('，') + '。');
    }
  }

  /* ---------------- 生成一条新委托 ----------------
     规则：只有你认识的人才会给你派活。
     没见过的 NPC 不进候选池 —— 不会一上来就是个陌生人派任务。
  ------------------------------------------------ */
  function spawn(S, forceKind) {
    const all = pool();
    if (!all.length) return null;
    const active = S.briefs || [];
    if (active.length >= MAX_ACTIVE) return null;

    const usedIds = {};
    active.forEach((b) => { usedIds[b.briefId] = 1; });
    (S.briefSeen || []).forEach((id) => { usedIds[id] = 1; });

    // 只保留认识的人发来的委托
    const met = S.metNpcs || {};
    const known = all.filter((b) => met[b.npc]);
    // 开局前三天如果熟人还不够，先由已有的熟人补齐
    if (!known.length) return null;

    let cands = known.filter((b) => !usedIds[b.id]);
    if (!cands.length) { S.briefSeen = []; cands = known.slice(); }   // 用完了就重新洗一轮
    if (forceKind) {
      const f = cands.filter((b) => b.kind === forceKind);
      if (f.length) cands = f;
    }

    // 第 1 天不放血腥类与陷阱类，给玩家一点缓冲
    if (S.day <= 1) {
      const soft = cands.filter((b) => b.kind !== 'blood' && b.kind !== 'trap');
      if (soft.length) cands = soft;
    }

    const rng = S.rng || window.GAME_RNG.create(String(Date.now()));
    const def = rng.pick(cands);
    const brief = {
      uid: 'br' + (S.briefCounter = (S.briefCounter || 0) + 1),
      briefId: def.id,
      kind: def.kind,
      npc: def.npc,
      district: def.district,
      title: def.title,
      text: def.text,
      days: def.days,
      left: def.days,
      solve: def.solve,
      onSolve: def.onSolve,
      onExpire: def.onExpire,
      onRefuse: def.onRefuse || null,
      refuseLabel: def.refuseLabel || '回绝',
      issuedDay: S.day,
    };
    S.briefs.push(brief);
    S.briefSeen = S.briefSeen || [];
    S.briefSeen.push(def.id);
    if (S.briefSeen.length > 40) S.briefSeen.shift();
    S.log.unshift({ kind: 'brief', day: S.day, text: '新委托 · ' + def.title + '（' + brief.left + ' 天内）' });
    if (S.log.length > 80) S.log.pop();
    return brief;
  }

  /* ---------------- 今日是否会来新委托 ---------------- */
  function maybeSpawn(S) {
    const rng = S.rng;
    if (!rng) return null;
    const active = (S.briefs || []).length;
    if (active >= MAX_ACTIVE) return null;
    const p = Math.min(0.92, SPAWN_BASE + (S.day - 1) * SPAWN_RAMP) * (active === 0 ? 1.25 : 1);
    if (!rng.chance(p)) return null;
    let kind = null;
    // 每四天左右来一次血腥要求，让压力有节奏
    if (S.day >= 3 && S.day % 4 === 0 && !(S.briefs || []).some((b) => b.kind === 'blood')) kind = 'blood';
    return spawn(S, kind);
  }

  /* ---------------- 完成条件判定 ---------------- */
  function canSolve(S, b, opt) {
    const sv = b.solve;
    if (!sv) return { ok: false, why: '这条委托没有可执行的方式。' };
    if (sv.type === 'resource') {
      const need = sv.need || {};
      const lack = [];
      Object.keys(need).forEach((k) => {
        const have = k === 'money' ? S.money : k === 'intel' ? S.intel : k === 'chips' ? S.chips : k === 'gear' ? S.gear : 0;
        if (have < need[k]) lack.push(resName(k) + ' 还差 ' + (need[k] - have));
      });
      if (lack.length) return { ok: false, why: lack.join('，') + '。' };
      return { ok: true };
    }
    if (sv.type === 'stat') {
      const dc = sv.dc || 12;
      const val = S.stats[sv.stat] || 0;
      const rate = Math.max(0.05, Math.min(0.95, (21 - Math.max(3, dc - val)) / 20));
      return { ok: true, why: '判定 ' + statName(sv.stat) + '，成功率约 ' + Math.round(rate * 100) + '%' };
    }
    if (sv.type === 'district') {
      // 需要把一张牌投到指定城区（本局是否已经投过）
      const done = (S.briefDistrictHits || {})[sv.district];
      if (!done) {
        const dist = (D.DISTRICTS || []).find((d) => d.id === sv.district);
        return { ok: false, why: '先把一张指令卡投到' + (dist ? dist.name : sv.district) + '。' };
      }
      return { ok: true };
    }
    if (sv.type === 'fold') {
      const n = (S.pathFoldCount || {})[sv.path] || 0;
      const need = sv.need || 1;
      if (n < need) {
        const p = (D.PATHS || []).find((x) => x.id === sv.path);
        return { ok: false, why: '还要再折 ' + (need - n) + ' 张' + (p ? p.name : sv.path) + '类指令。' };
      }
      return { ok: true };
    }
    return { ok: false, why: '未知的完成方式。' };
  }

  function resName(k) {
    return { money: '信用点', intel: '情报', chips: '芯片', gear: '装备' }[k] || k;
  }
  function statName(k) {
    const s = (D.STATS || []).find((x) => x.id === k);
    return s ? s.name : k;
  }

  /* ---------------- 执行完成 ---------------- */
  function solve(S, uid) {
    const idx = (S.briefs || []).findIndex((b) => b.uid === uid);
    if (idx < 0) return { ok: false, why: '这条委托已经不在了。' };
    const b = S.briefs[idx];
    const gate = canSolve(S, b);
    if (!gate.ok) return { ok: false, why: gate.why };

    const lines = [];
    const sv = b.solve;

    if (sv.type === 'resource') {
      const need = sv.need || {};
      Object.keys(need).forEach((k) => {
        if (k === 'money') S.money -= need[k];
        else if (k === 'intel') S.intel -= need[k];
        else if (k === 'chips') S.chips -= need[k];
        else if (k === 'gear') S.gear -= need[k];
        lines.push('交出 ' + resName(k) + ' ' + need[k] + '。');
      });
    } else if (sv.type === 'stat') {
      const rng = S.rng || window.GAME_RNG.create(String(Date.now()));
      const dc = sv.dc || 12;
      const r = 1 + rng.int(20);
      const pass = r >= dc || r === 20;
      lines.push('掷出 ' + r + '，判定线 ' + dc + '。' + (pass ? '办妥了。' : '没办成。'));
      if (!pass) {
        // 失败 = 超期代价，但委托仍算清掉
        applyEffect(S, b.onExpire, lines);
        S.briefs.splice(idx, 1);
        S.log.unshift({ kind: 'bad', day: S.day, text: '委托失败 · ' + b.title });
        return { ok: true, pass: false, lines: lines, brief: b };
      }
    } else if (sv.type === 'district') {
      S.briefDistrictHits[sv.district] = 0;   // 消耗掉
      lines.push('你在' + ((D.DISTRICTS || []).find((d) => d.id === sv.district) || {}).name + '把事办了。');
    } else if (sv.type === 'fold') {
      const n = sv.need || 1;
      S.pathFoldCount[sv.path] -= n;
      lines.push('你交出了 ' + n + ' 张成绩单。');
    }

    applyEffect(S, b.onSolve, lines);

    // 交差的人会再给你一点东西：一半概率多给一张牌
    const rng = S.rng || window.GAME_RNG.create(String(Date.now()));
    if (rng.chance(0.5) && S.deck && S.deck.length) {
      const got = window.GAME_ENGINE.grantCard(S, {
        reason: '委托交差后对方补的',
        path: (b.solve && b.solve.path) || null,
        n: 1,
      });
      if (got.length) lines.push('对方另外塞给你一张：' + window.GAME_ENGINE.label(got[0]) + '。');
    }

    S.briefs.splice(idx, 1);
    S.briefDone = (S.briefDone || 0) + 1;
    S.fortune += 1 + b.days;
    lines.push('命运点 +' + (1 + b.days) + '。');
    S.log.unshift({ kind: 'good', day: S.day, text: '委托完成 · ' + b.title });
    return { ok: true, pass: true, lines: lines, brief: b };
  }

  /* ---------------- 主动回绝 ---------------- */
  function refuse(S, uid) {
    const idx = (S.briefs || []).findIndex((b) => b.uid === uid);
    if (idx < 0) return { ok: false, why: '这条委托已经不在了。' };
    const b = S.briefs[idx];
    const lines = [];
    applyEffect(S, b.onRefuse || b.onExpire, lines);
    if (!lines.length) lines.push('你什么也没说，对方记住了。');
    S.briefs.splice(idx, 1);
    S.briefRefused = (S.briefRefused || 0) + 1;
    S.log.unshift({ kind: 'bad', day: S.day, text: '委托回绝 · ' + b.title });
    return { ok: true, lines: lines, brief: b };
  }

  /* ---------------- 每日推进：倒计时与超期 ---------------- */
  function tick(S) {
    const expired = [];
    (S.briefs || []).forEach((b) => { b.left -= 1; });
    for (let i = (S.briefs || []).length - 1; i >= 0; i--) {
      const b = S.briefs[i];
      if (b.left > 0) continue;
      const lines = [];
      applyEffect(S, b.onExpire, lines);
      expired.push({ brief: b, lines: lines });
      S.log.unshift({ kind: 'bad', day: S.day, text: '委托超期 · ' + b.title });
      S.briefs.splice(i, 1);
      S.briefExpired = (S.briefExpired || 0) + 1;
    }
    return expired;
  }

  /* ---------------- 供地图使用的汇总 ---------------- */
  function byDistrict(S) {
    const map = {};
    (S.briefs || []).forEach((b) => {
      (map[b.district] = map[b.district] || []).push(b);
    });
    return map;
  }

  function urgentCount(S) {
    return (S.briefs || []).filter((b) => b.left <= 1).length;
  }

  const KIND = {
    demand: { name: '事务要求', color: '#7aa2f7', mark: '◆' },
    summon: { name: '高层传唤', color: '#e0b44a', mark: '⬢' },
    blood: { name: '血腥要求', color: '#e0554a', mark: '✕' },
    favor: { name: '人情托付', color: '#5fd08a', mark: '♡' },
    trap: { name: '试探', color: '#c86bd8', mark: '◎' },
  };

  window.GAME_BRIEFS = { spawn, maybeSpawn, canSolve, solve, refuse, tick, byDistrict, urgentCount, applyEffect, KIND, MAX_ACTIVE, pool };
})();

/* ===== game/story.js ===== */
/* ==========================================================
   《七日指令》故事引擎
   1) 五幕主线：折牌数推进，引导者一路带着走
   2) NPC 关系值与个人支线：每人三幕（相识 / 交情 / 分晓）
   3) 委托只从认识的人那里来
   场景以「主线」身份占用当天的日程，优先于随机事件。
   ========================================================== */
(function () {
  'use strict';
  const D = window.GAME_DATA;
  const E = window.GAME_ENGINE;

  /* ---------------- 引导者 ---------------- */
  const GUIDE = 'su-wen';   // 苏纹，董事会日程官。她给你发牌，也给你收尸。

  /* ---------------- 五幕定义 ---------------- */
  const ACTS = [
    { n: 1, key: 'deal',   name: '发牌', from: 0,  to: 2,
      hook: '你被点名，替董事会玩这一局。' },
    { n: 2, key: 'seat',   name: '上桌', from: 3,  to: 5,
      hook: '你活过了第一个七天，董事会开始真正看你。' },
    { n: 3, key: 'shuffle',name: '洗牌', from: 6,  to: 8,
      hook: '监事会介入了。有人开始查你，也查到了她。' },
    { n: 4, key: 'hole',   name: '底牌', from: 9,  to: 11,
      hook: '穹顶的接缝在响。你手里第一次有了能反打的东西。' },
    { n: 5, key: 'showdown', name: '摊牌', from: 12, to: 99,
      hook: '十二张牌全部折下。现在轮到你决定这局怎么结束。' },
  ];

  const actOf = (folded) => ACTS.find((a) => folded >= a.from && folded <= a.to) || ACTS[ACTS.length - 1];

  /* ---------------- 关系值 ---------------- */
  function rel(S, npcId) {
    if (!S.relations) S.relations = {};
    return Number(S.relations[npcId]) || 0;
  }
  function addRel(S, npcId, v) {
    if (!S.relations) S.relations = {};
    if (!npcId) return 0;
    S.relations[npcId] = Math.max(0, Math.min(10, rel(S, npcId) + (v || 0)));
    return S.relations[npcId];
  }
  const relTier = (v) => (v >= 8 ? 'high' : v >= 4 ? 'mid' : 'low');

  function isMet(S, npcId) {
    if (!npcId) return false;
    if (S.metNpcs && S.metNpcs[npcId]) return true;
    return false;
  }
  function markMet(S, npcId) {
    if (!npcId) return;
    S.metNpcs = S.metNpcs || {};
    S.metNpcs[npcId] = (S.metNpcs[npcId] || 0) + 1;
  }

  /* ---------------- 场景池 ---------------- */
  function mainScenes() { return Array.isArray(window.STORY_MAIN) ? window.STORY_MAIN : []; }
  /* 认可桥段单独一组：它不是支线，不按 stage 排，
     而是「这个人已经认识、条件也够了」时插进来的一段戏。
     走完这一段，他才把牌交出来。 */
  function approvalScenes() {
    return Array.isArray(window.APPROVALS) ? window.APPROVALS : [];
  }

  function npcScenes() {
    const out = [];
    if (Array.isArray(window.STORY_NPC_A)) out.push(...window.STORY_NPC_A);
    if (Array.isArray(window.STORY_NPC_B)) out.push(...window.STORY_NPC_B);
    if (Array.isArray(window.STORY_NPC_A2)) out.push(...window.STORY_NPC_A2);
    if (Array.isArray(window.STORY_NPC_B2)) out.push(...window.STORY_NPC_B2);
    return out;
  }
  function allScenes() { return mainScenes().concat(npcScenes()); }

  const fired = (S, id) => !!(S.storyFired && S.storyFired[id]);

  /* ---------------- 条件求值 ----------------
     支持四种条件族，策划写内容时不用碰引擎：
       stat:  { folded: [5,12], day: [3,99], money: [0,20], intel: [3,99], chips: [0,2] }
       track: { sin: [7,12], loyalty: [0,3], renown: [0,4], power: [8,12] }
       have:  ['has_ledger', 'trusted_su']        剧情标记，全部满足
       not:   ['broke_flow']                      排斥的标记
     也兼容旧写法：act / minFolded / maxFolded / minDay / minRel / met / flag / notFlag
  ------------------------------------------------ */
  const STAT_KEYS = { folded: (s) => s.folded, day: (s) => s.day, money: (s) => s.money,
    intel: (s) => s.intel, chips: (s) => s.chips, gear: (s) => s.gear,
    cards: (s) => (s.hand ? s.hand.length : 0), deck: (s) => (s.deck ? s.deck.length : 0) };

  function inRange(val, range) {
    if (val == null) return false;
    if (!Array.isArray(range)) return val === range;
    return val >= range[0] && val <= range[1];
  }

  function condOk(S, when) {
    if (!when) return true;

    /* --- 旧写法（保留兼容） --- */
    if (when.act && actOf(S.folded).n !== when.act) return false;
    if (when.minFolded != null && S.folded < when.minFolded) return false;
    if (when.maxFolded != null && S.folded > when.maxFolded) return false;
    if (when.minDay != null && S.day < when.minDay) return false;
    if (when.minRel != null && rel(S, when.npc) < when.minRel) return false;
    if (when.flag && !(S.storyFlags && S.storyFlags[when.flag])) return false;
    if (when.notFlag && S.storyFlags && S.storyFlags[when.notFlag]) return false;
    if (when.met && !isMet(S, when.met)) return false;

    /* --- 数值族 --- */
    if (when.stat) {
      for (const k in when.stat) {
        const fn = STAT_KEYS[k];
        if (!fn) continue;
        if (!inRange(fn(S), when.stat[k])) return false;
      }
    }

    /* --- 名望族 --- */
    if (when.track) {
      for (const k in when.track) {
        const v = (S.tracks && S.tracks[k]) || 0;
        if (!inRange(v, when.track[k])) return false;
      }
    }

    /* --- 标记族 --- */
    if (when.have) {
      const list = Array.isArray(when.have) ? when.have : [when.have];
      for (let i = 0; i < list.length; i++) {
        if (!(S.storyFlags && S.storyFlags[list[i]])) return false;
      }
    }
    if (when.not) {
      const list = Array.isArray(when.not) ? when.not : [when.not];
      for (let i = 0; i < list.length; i++) {
        if (S.storyFlags && S.storyFlags[list[i]]) return false;
      }
    }
    return true;
  }

  /* ---------------- 把条件翻译成人话，给界面显示 ---------------- */
  function describeWhen(S, when) {
    if (!when) return '';
    const bits = [];
    const rng = (r) => (Array.isArray(r) ? r[0] + '-' + r[1] : String(r));

    if (when.act) bits.push('第 ' + when.act + ' 幕');
    if (when.minFolded != null) bits.push('已折 ≥' + when.minFolded);
    if (when.maxFolded != null) bits.push('已折 ≤' + when.maxFolded);
    if (when.minDay != null) bits.push('第 ' + when.minDay + ' 天起');
    if (when.minRel != null) {
      const info = window.GAME_ENGINE.npcOf ? window.GAME_ENGINE.npcOf(when.npc) : null;
      bits.push((info ? info.name : '他') + '关系 ≥' + when.minRel);
    }
    if (when.met) {
      const info = window.GAME_ENGINE.npcOf ? window.GAME_ENGINE.npcOf(when.met) : null;
      bits.push('已认识' + (info ? info.name : ''));
    }
    if (when.stat) for (const k in when.stat) {
      const name = { folded: '已折牌', day: '天数', money: '信用点', intel: '情报',
        chips: '芯片', gear: '装备', cards: '手牌', deck: '牌堆剩余' }[k] || k;
      bits.push(name + ' ' + rng(when.stat[k]));
    }
    if (when.track) for (const k in when.track) {
      const name = window.GAME_ENGINE.trackName ? window.GAME_ENGINE.trackName(k) : k;
      bits.push(name + ' ' + rng(when.track[k]));
    }
    if (when.have) {
      const list = Array.isArray(when.have) ? when.have : [when.have];
      const names = list.map(flagName);
      bits.push('需 ' + names.join('、'));
    }
    if (when.not) {
      const list = Array.isArray(when.not) ? when.not : [when.not];
      bits.push('不能 ' + list.map(flagName).join('、'));
    }
    return bits.join(' · ');
  }

  /* 剧情标记的可读名（只列常用的，其余直接显示 key） */
  const FLAG_NAMES = {
    ask_prev: '问过上一副牌', know_name: '记住了名录上的名字', kept_going: '被允许继续',
    told_truth: '对监事说了实话', trusted_su: '把排期交给苏纹', has_ledger: '拿到了那本笔记',
    blank_card: '收下了空白卡', out_of_flow: '把自己从流程里摘出', broke_flow: '删掉了整份流程',
    left_together: '邀她一起离开',
    wd_told_number: '向闻铎报了编号', sw_changed_table: '替苏纹改过表',
    cy_signed: '替程砚签了收', ym_took_slip: '替银面扛下单子', yk_asked_him: '问过雨客本人',
  };
  function flagName(k) { return FLAG_NAMES[k] || k; }

  /* ---------------- 初见：把十六次初识排进前六天 ----------------
     玩家必须先认识人，委托和支线才有来源。
     所以初识不走随机事件池，而是按顺序定时出现。
  ------------------------------------------------------------ */
  function meetScenes() {
    const src = D.EVENTS.filter((e) => String(e.title || '').indexOf('初见') === 0);
    return src.map((e, i) => ({
      id: 'meet-' + e.id,
      meet: true,
      npc: null,                 // npc 由引擎的 npcIdOf 反查，这里留空
      eventId: e.id,
      district: e.district,
      portrait: e.portrait,
      title: e.title,
      text: e.text,
      options: e.options,
      // 第 1 天出两条，之后每天两条，最多排到第 8 天
      minDay: Math.min(8, 1 + Math.floor(i / 2)),
      order: i,
    }));
  }

  /* ---------------- 选下一个故事场景 ----------------
     优先级：主线 > 初见 > NPC 支线。同一时刻只推一个。
  ------------------------------------------------ */
  function nextScene(S) {
    if (!S) return null;

    // 1) 主线按幕推进
    const act = actOf(S.folded).n;
    const mains = mainScenes()
      .filter((sc) => !fired(S, sc.id))
      .filter((sc) => (sc.act || 0) <= act)
      .filter((sc) => condOk(S, sc.when));
    if (mains.length) {
      mains.sort((a, b) => (a.order || 0) - (b.order || 0));
      return decorate(S, mains[0], 'main');
    }

    // 2) 初见：到日子就出，保证玩家前八天认识足够多的人
    const meets = meetScenes()
      .filter((sc) => !fired(S, sc.id))
      .filter((sc) => S.day >= sc.minDay)
      .filter((sc) => {
        // 已经认识的人不再重复初见
        const e = D.EVENTS.find((x) => x.id === sc.eventId);
        const id = e && E.npcIdOf ? E.npcIdOf(e) : null;
        return !(id && isMet(S, id));
      });
    if (meets.length) {
      meets.sort((a, b) => a.order - b.order);
      return decorate(S, meets[0], 'meet');
    }

    /* 2.5) 认可桥段：他还没认可你，而你俩已经认识、条件也够了，就先演这一段。
            排在支线前面 —— 拿不到牌这件事比看戏重要。 */
    const unapproved = approvalScenes()
      .filter((sc) => !fired(S, sc.id))
      .filter((sc) => sc.npc && isMet(S, sc.npc))
      .filter((sc) => !(S.approved && S.approved[sc.npc]))
      .filter((sc) => condOk(S, Object.assign({ npc: sc.npc }, sc.when || {})));
    if (unapproved.length) {
      return decorate(S, unapproved[0], 'approval');
    }

    // 3) NPC 支线：按 stage 从小到大，先出早的
    const npc = npcScenes()
      .filter((sc) => !fired(S, sc.id))
      .filter((sc) => isMet(S, sc.npc))
      .filter((sc) => {
        if (sc.stage > 1) {
          const prev = npcScenes().find((x) => x.npc === sc.npc && x.stage === sc.stage - 1);
          if (prev && !fired(S, prev.id)) return false;
        }
        return true;
      })
      .filter((sc) => condOk(S, Object.assign({ npc: sc.npc }, sc.when || {})));
    if (npc.length) {
      npc.sort((a, b) => (a.stage - b.stage) || ((a.pri || 0) - (b.pri || 0)));
      return decorate(S, npc[0], 'line');
    }
    return null;
  }

  function decorate(S, sc, kind) {
    const npcId = sc.npc || (kind === 'main' ? GUIDE : null);
    const info = E.npcOf ? E.npcOf(npcId) : null;
    // 初见场景的 npc 要当场反查，否则 resolve 阶段找不到是谁
    let meetNpc = null;
    if (sc.meet) {
      const e = D.EVENTS.find((x) => x.id === sc.eventId);
      meetNpc = e && E.npcIdOf ? E.npcIdOf(e) : null;
    }
    const finalNpc = npcId || meetNpc;
    const finalInfo = info || (finalNpc && E.npcOf ? E.npcOf(finalNpc) : null);
    return {
      story: true,
      kind: kind,                       // main | line | meet | approval
      approval: kind === 'approval',
      meet: !!sc.meet,
      eventId: sc.eventId || null,
      id: sc.id,
      npc: finalNpc,
      npcName: finalInfo ? finalInfo.name : (sc.npcName || ''),
      npcRole: finalInfo ? finalInfo.role : '',
      portrait: sc.portrait || (finalInfo ? finalInfo.portrait : null),
      district: sc.district || (finalInfo ? finalInfo.district : null),
      act: sc.act || actOf(S.folded).n,
      actName: actOf(S.folded).name,
      stage: sc.stage || 0,
      title: sc.title,
      text: sc.text,
      options: (sc.options || []).map((o) => Object.assign({}, o)),
    };
  }

  /* ---------------- 结算一个故事场景 ---------------- */
  function resolve(S, scene, optIdx) {
    if (!scene) return { ok: false };
    const opt = scene.options[optIdx];
    if (!opt) return { ok: false };

    const lines = [];
    // 效果统一交给引擎处理，story 只负责关系值与标记
    if (opt.run) E.applyEffectPublic(S, opt.run, lines);

    // 初见：把这个人登记进「认识」，并给一点初始关系值
    let meetNpc = null;
    if (scene.meet) {
      const e = D.EVENTS.find((x) => x.id === scene.eventId);
      meetNpc = e && E.npcIdOf ? E.npcIdOf(e) : null;
      if (meetNpc) {
        markMet(S, meetNpc);
        const info = E.npcOf(meetNpc);
        const before = rel(S, meetNpc);
        const after = addRel(S, meetNpc, opt.relation != null ? opt.relation : 1);
        lines.unshift('你认识了 ' + (info ? info.name : '一个人') +
          (info ? '（' + info.role + '）' : '') + '，关系 ' + after + '/10。');
      }
    }

    if (scene.npc && (opt.relation != null || !opt.run)) {
      const before = rel(S, scene.npc);
      const after = addRel(S, scene.npc, opt.relation != null ? opt.relation : 1);
      if (after !== before && scene.npcName) lines.push(scene.npcName + ' 对你的看法变了（关系 ' + before + ' → ' + after + '）。');
    }
    if (opt.flag) {
      S.storyFlags = S.storyFlags || {};
      S.storyFlags[opt.flag] = 1;
    }
    if (opt.mainFlag) {
      S.mainFlags = S.mainFlags || {};
      S.mainFlags[opt.mainFlag] = 1;
    }

    S.storyFired = S.storyFired || {};
    S.storyFired[scene.id] = 1;

    // 主线推进：记录走过的幕
    if (scene.kind === 'main') {
      S.storySeenActs = S.storySeenActs || {};
      S.storySeenActs[scene.act] = (S.storySeenActs[scene.act] || 0) + 1;
    }

    S.log.unshift({
      kind: 'story',
      day: S.day,
      text: (scene.kind === 'main' ? '主线 · '
        : scene.kind === 'meet' ? '初见 · '
        : (scene.npcName || '') + ' · ') + scene.title,
    });
    if (S.log.length > 80) S.log.pop();

    return { ok: true, lines: lines, scene: scene, opt: opt };
  }

  /* ---------------- 当前主线进度（给 UI 显示） ---------------- */
  function progress(S) {
    const act = actOf(S.folded);
    const idx = ACTS.findIndex((a) => a.n === act.n);
    const upcoming = mainScenes()
      .filter((sc) => !fired(S, sc.id))
      .filter((sc) => (sc.act || 0) <= act.n)
      .filter((sc) => condOk(S, sc.when))
      .sort((a, b) => (a.order || 0) - (b.order || 0))[0];
    return {
      act: act.n, name: act.name, hook: act.hook,
      total: ACTS.length,
      exited: idx,
      nextTitle: upcoming ? upcoming.title : null,
    };
  }

  /* ---------------- 引导者是否已登场 ---------------- */
  function ensureGuide(S) {
    if (!S.storyFlags) S.storyFlags = {};
    if (!S.storyFlags.guideIntro) markMet(S, GUIDE);
  }

  window.GAME_STORY = {
    GUIDE, ACTS, actOf, rel, addRel, relTier, isMet, markMet,
    nextScene, resolve, progress, ensureGuide, allScenes, mainScenes, npcScenes, approvalScenes, condOk,
    describeWhen, flagName, inRange,
  };
})();

/* ===== game/dialogue.js ===== */
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

/* ===== game/meta.js ===== */
/* ==========================================================
   《七日指令》元层 —— 跨局档案与命运商店
   命运点与永久升级存在本地，游戏内不再出现商店
   ========================================================== */
(function () {
  'use strict';
  const D = window.GAME_DATA;
  const C = D.CONFIG;
  const KEY = 'sdd.profile.v1';

  const STAT_CAP = C.statCap;

  /* ---------------- 命运商店：永久升级（可叠加） ---------------- */
  const NEXUS = [
    {
      id: 'n_str', name: '强化疗程', cost: 6, max: 5, icon: '◈',
      desc: '开局随机两项属性各 +1',
      apply(s, n) {
        for (let i = 0; i < n * 2; i++) {
          const k = D.STATS[Math.floor(Math.random() * D.STATS.length)].id;
          s.stats[k] = Math.min(STAT_CAP, s.stats[k] + 1);
        }
      },
    },
    {
      id: 'n_cash', name: '起始资金', cost: 5, max: 6, icon: '¥',
      desc: '开局 +30 信用点',
      apply(s, n) { s.money += 30 * n; },
    },
    {
      id: 'n_intel', name: '情报底子', cost: 5, max: 5, icon: '◉',
      desc: '开局 +2 情报',
      apply(s, n) { s.intel += 2 * n; },
    },
    {
      id: 'n_chip', name: '芯片囤积', cost: 7, max: 5, icon: '▣',
      desc: '开局 +2 指令芯片',
      apply(s, n) { s.chips += 2 * n; },
    },
    {
      id: 'n_gear', name: '定制义体', cost: 9, max: 4, icon: '◤',
      desc: '开局装备战力 +1',
      apply(s, n) { s.gear += n; },
    },
    {
      id: 'n_loyal', name: '董事信任', cost: 8, max: 4, icon: '⬢',
      desc: '初始忠诚 +1',
      apply(s, n) { s.tracks.loyalty = Math.min(C.trackCap, s.tracks.loyalty + n); },
    },
    {
      id: 'n_renown', name: '行业声望', cost: 8, max: 4, icon: '♡',
      desc: '初始声望 +1',
      apply(s, n) { s.tracks.renown = Math.min(C.trackCap, s.tracks.renown + n); },
    },
    {
      id: 'n_power', name: '人脉权柄', cost: 10, max: 4, icon: '✦',
      desc: '初始权柄 +1',
      apply(s, n) { s.tracks.power = Math.min(C.trackCap, s.tracks.power + n); },
    },
    {
      id: 'n_clean', name: '洗白档案', cost: 12, max: 3, icon: '⌫',
      desc: '初始罪痕 −1',
      apply(s, n) { s.tracks.sin = Math.max(0, s.tracks.sin - n); },
    },
    {
      id: 'n_boost', name: '议价能力', cost: 9, max: 2, icon: '⇄',
      desc: '加注花费每次 −5（最低 10）',
      apply(s, n) { s.boostDiscount = 5 * n; },
    },
    {
      id: 'n_ap', name: '作息管理', cost: 14, max: 2, icon: '◆',
      desc: '每日行动点 +1',
      apply(s, n) { s.apMax += n; s.ap = s.apMax; },
    },
    {
      id: 'n_grasp', name: '局势嗅觉', cost: 16, max: 1, icon: '◎',
      desc: '开局即为全部指令标注最优目标，并揭示所有城区事件',
      apply(s, n) { if (n > 0) s.foresight = true; },
    },
  ];

  /* ---------------- 档案读写 ---------------- */
  function blank() {
    return { version: 1, fortune: 0, upgrades: {}, runs: 0, wins: 0, endings: {}, best: null, lastRun: null };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      const p = Object.assign(blank(), JSON.parse(raw));
      p.upgrades = p.upgrades || {};
      p.endings = p.endings || {};
      p.fortune = Number(p.fortune) || 0;
      return p;
    } catch (e) {
      return blank();
    }
  }

  function save(p) {
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { /* 隐私模式忽略 */ }
    return p;
  }

  function reset() { return save(blank()); }

  /* ---------------- 升级 ---------------- */
  function levelOf(p, id) { return Number(p.upgrades[id]) || 0; }

  function canBuy(p, id) {
    const item = NEXUS.find((x) => x.id === id);
    if (!item) return { ok: false, why: '没有这项升级。' };
    const lv = levelOf(p, id);
    if (lv >= item.max) return { ok: false, why: '已经满级。' };
    if (p.fortune < item.cost) return { ok: false, why: '命运点不足，还差 ' + (item.cost - p.fortune) + ' 点。' };
    return { ok: true, item, lv };
  }

  function buy(p, id) {
    const g = canBuy(p, id);
    if (!g.ok) return g;
    p.fortune -= g.item.cost;
    p.upgrades[id] = g.lv + 1;
    save(p);
    return { ok: true, item: g.item, level: g.lv + 1 };
  }

  function refundAll(p) {
    let back = 0;
    NEXUS.forEach((it) => {
      const lv = levelOf(p, it.id);
      if (lv > 0) { back += lv * it.cost; p.upgrades[it.id] = 0; }
    });
    p.upgrades = {};
    p.fortune += back;
    save(p);
    return back;
  }

  /* ---------------- 应用到新一局 ---------------- */
  function applyToRun(s, p) {
    const gained = [];
    NEXUS.forEach((it) => {
      const lv = levelOf(p, it.id);
      if (lv > 0) { it.apply(s, lv); gained.push(it.name + ' Lv' + lv); }
    });
    s.profileApplied = gained;
    return gained;
  }

  /* ==========================================================
     结算：按「这一局打成什么样」给命运点
     以前只算折了几张牌，结局好坏、委托做没做、活了几天、
     认识了谁，一律不算。现在每一项都单独计分，并留下明细，
     终局屏可以逐条展示给玩家看。
     ========================================================== */

  /* 结局分量：越难达成的结局给得越多。
     「被回收」「自由落体」是失败，只给一点参与分。 */
  const ENDING_SCORE = {
    v2_true: 40,   // 牌不再发下来
    emperor: 30,   // 穹顶之上的名字
    sultan: 28,    // 新的苏丹
    hero: 26,      // 脏手的善人
    w1: 24,        // 账本之外
    ghost_out: 22, // 幽灵离场
    w3: 20,        // 雨落进来
    dog: 18,       // 忠犬归位
    w5: 16,        // 十八块钱的葬礼
    w4: 14,        // 第十二名
    w6: 12,        // 穹顶照着旧样子
    w7: 18,        // 穹顶不需要干净的人（通关，但罪痕压不下来）
    w2: 10,        // 替她签收
    survivor: 10,  // 活着就好
    v2_fake: 8,    // 最配合的那个人（看着赢，其实被留下）
    v2_bad: 6,     // 我认得这张脸吗
    purged: 3,     // 被回收
    broken: 2,     // 三十六层高的自由落体
  };

  function scoreRun(s) {
    const rows = [];
    const add = (label, value, note) => {
      if (value) rows.push({ label: label, value: value, note: note || '' });
    };
    const tr = s.tracks || {};
    const win = (s.folded || 0) >= C.deckGoal;

    /* 折牌：命中多少条指令。这就是原来的全部算法，现在只是明细里的一项 */
    add('折断的指令卡', Math.max(0, s.fortune || 0), (s.folded || 0) + ' / ' + C.deckGoal + ' 张');

    /* 结局：这一局最后落成什么样，是最大的一笔 */
    const eid = s.ending ? s.ending.id : '';
    const ev = eid ? (ENDING_SCORE[eid] != null ? ENDING_SCORE[eid] : 8) : 0;
    add('结局', ev, s.ending ? s.ending.name : '未结束');

    /* 委托：做成的算，超期和回绝要扣 */
    const done = s.briefDone || 0, over = s.briefExpired || 0, refuse = s.briefRefused || 0;
    add('委托交差', done * 3, done + ' 件');
    add('委托超期', -over, over + ' 件');
    add('委托回绝', -refuse, refuse + ' 件');

    /* 存活天数：活下来本身在这座城里就算成绩 */
    add('存活天数', Math.min(30, s.day || 0), (s.day || 0) + ' 天');

    /* 关系：认识的人越多，下一局开局能拿到的牌源越多 */
    const met = Object.keys(s.metNpcs || {}).length;
    add('认识的人', Math.min(16, met), met + ' 人');

    /* 名望四轨的总积累 */
    const sum = (tr.loyalty || 0) + (tr.renown || 0) + (tr.sin || 0) + (tr.power || 0);
    add('名望积累', Math.round(sum / 4),
      '忠诚 ' + (tr.loyalty || 0) + ' · 声望 ' + (tr.renown || 0) +
      ' · 罪痕 ' + (tr.sin || 0) + ' · 权柄 ' + (tr.power || 0));

    /* 通关：十二张全折完，额外给一笔 */
    add('折完全部十二张', win ? 12 : 0, win ? '通关' : '未完');

    const total = rows.reduce((a, r) => a + r.value, 0);
    return { rows: rows, total: Math.max(0, total), win: win };
  }

  function settle(p, s) {
    const sc = scoreRun(s);
    const earned = sc.total;
    p.fortune += earned;
    p.runs += 1;
    const win = sc.win;
    if (win) p.wins += 1;
    const eid = s.ending ? s.ending.id : 'none';
    p.endings[eid] = (p.endings[eid] || 0) + 1;
    const run = {
      at: new Date().toISOString(),
      ending: s.ending ? s.ending.name : '未结束',
      endingId: eid,
      origin: s.origin.name,
      days: s.day,
      folded: s.folded,
      points: earned,
      rows: sc.rows,
      win: win,
      tracks: Object.assign({}, s.tracks),
    };
    if (!p.best || run.points > p.best.points) p.best = run;
    p.lastRun = run;
    save(p);
    return { earned: earned, total: p.fortune, run: run, win: win, rows: sc.rows };
  }

  function ownedCount(p) { return NEXUS.filter((it) => levelOf(p, it.id) > 0).length; }

  window.GAME_META = { NEXUS, KEY, blank, load, save, reset, levelOf, canBuy, buy, refundAll, applyToRun, settle, scoreRun, ENDING_SCORE, ownedCount };
})();

/* ===== game/map.js ===== */
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

  /* ---------------- 节点坐标自适应 ----------------
     地图数据里的 x/y 是按 16:9 构图定的。可见带变扁（横屏手机）
     或变窄（竖屏）时，直接按百分比放会让边缘节点掉出可视区。
     这里把数据坐标线性重映射到安全带里，保证任何画幅下
     十个城区都在可视范围内。
  ------------------------------------------------ */
  function computeRemap() {
    const list = D.DISTRICTS || [];
    if (!list.length) return { x0: 0, x1: 1, y0: 0, y1: 1 };
    let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity;
    list.forEach((d) => {
      xmin = Math.min(xmin, d.x); xmax = Math.max(xmax, d.x);
      ymin = Math.min(ymin, d.y); ymax = Math.max(ymax, d.y);
    });
    return { x0: xmin, x1: xmax, y0: ymin, y1: ymax };
  }

  function placeOf(d, r) {
    const spanX = (r.x1 - r.x0) || 1;
    const spanY = (r.y1 - r.y0) || 1;
    // 左右各留 7%，上下各留 15%（节点标签在下方，下部要留多些）
    const px = 0.07 + ((d.x - r.x0) / spanX) * 0.86;
    const py = 0.15 + ((d.y - r.y0) / spanY) * 0.68;
    return { x: px, y: py };
  }

  /* ---------------- 建立节点 ---------------- */
  function buildNodes(container, nodeClick) {
    host = container;
    onNode = nodeClick;
    host.innerHTML = '';

    const remap = computeRemap();

    D.DISTRICTS.forEach((d) => {
      const pos = placeOf(d, remap);
      const el = document.createElement('button');
      el.className = 'node';
      el.dataset.district = d.id;
      el.style.left = (pos.x * 100).toFixed(2) + '%';
      el.style.top = (pos.y * 100).toFixed(2) + '%';
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

    /* 节点位置可能因为画幅变化移动过，引线跟着重画 */
    lastS = S;
    drawGuide(S);
  }

  let currentUid = null;
  function selectedReaches(S, distId) {
    if (!S || !currentUid) return false;
    const c = S.hand.find((x) => x.uid === currentUid);
    if (!c) return false;
    return districtOfAsset(c.target) === distId;
  }
  function setSelected(uid) { currentUid = uid; }

  /* ---------------- 地图指引引线 ----------------
     选一张手牌，就从牌上拉一条线到目标城区。
     以前只在右上角弹一句「目标在某某区」，眼睛还得自己在图上找；
     现在线直接指过去，端点带脉冲圈，目标节点同步亮一档。
     牌在底栏、线在地图层，两边坐标系不同，所以要换算成图层内坐标。
  ------------------------------------------------ */
  let guideTimer = null;

  function drawGuide(S, origin) {
    const svg = document.getElementById('map-guide');
    const path = document.getElementById('guide-path');
    const dot = document.getElementById('guide-dot');
    const arrow = document.getElementById('guide-arrow');
    const callout = document.getElementById('node-callout');
    if (!svg || !path || !dot) return;

    const clear = () => {
      svg.classList.remove('on');
      dot.classList.remove('pulse');
      path.setAttribute('d', '');
      if (arrow) arrow.setAttribute('points', '');
      if (callout) { callout.hidden = true; callout.textContent = ''; }
      document.querySelectorAll('.node.guide').forEach((n) => n.classList.remove('guide'));
    };

    /* 拖拽时用被拖的那张牌，普通选中时用 currentUid */
    const uid = origin && origin.uid ? origin.uid : currentUid;
    if (!S || !uid) { clear(); return; }
    const card = S.hand.find((c) => c.uid === uid);
    if (!card) { clear(); return; }
    const distId = districtOfAsset(card.target);
    if (!distId) { clear(); return; }

    /* 终点：目标城区节点，nodeRect 给的就是视口坐标 */
    const nr = nodeRect(distId);
    if (!nr) { clear(); return; }
    const ex = nr.cx;
    const ey = nr.cy;

    /* 起点：拖动时跟手，否则取手牌上那张牌的上沿中点 */
    let sx, sy;
    if (origin && origin.x != null) {
      sx = origin.x;
      sy = origin.y;
    } else {
      const cardEl = document.querySelector('#hand .card[data-uid="' + uid + '"]');
      if (!cardEl) { clear(); return; }
      const cr = cardEl.getBoundingClientRect();
      sx = cr.left + cr.width / 2;
      sy = cr.top;
    }

    /* 控制点往上抬：线从底栏拱上去，正好落在节点上 */
    const lift = Math.max(70, Math.abs(sy - ey) * 0.45);
    const midY = Math.min(sy, ey) - lift;
    path.setAttribute('d',
      'M ' + sx.toFixed(1) + ' ' + sy.toFixed(1) +
      ' C ' + sx.toFixed(1) + ' ' + midY.toFixed(1) + ' ' +
              ex.toFixed(1) + ' ' + midY.toFixed(1) + ' ' +
              ex.toFixed(1) + ' ' + (ey - 46).toFixed(1));

    /* 箭头压在节点上方，朝下指着落点 */
    if (arrow) {
      const tipY = ey - 30;
      arrow.setAttribute('points',
        ex.toFixed(1) + ',' + tipY.toFixed(1) + ' ' +
        (ex - 11).toFixed(1) + ',' + (tipY - 18).toFixed(1) + ' ' +
        (ex + 11).toFixed(1) + ',' + (tipY - 18).toFixed(1));
    }
    dot.setAttribute('cx', ex.toFixed(1));
    dot.setAttribute('cy', ey.toFixed(1));
    dot.classList.add('pulse');
    svg.classList.add('on');

    /* 落点标注：贴在节点上方，写清是哪个城区 */
    if (callout) {
      const d = districtById(distId);
      callout.innerHTML = '放这里 <i>· ' + (d ? d.name : '') + '</i>';
      callout.style.left = ex.toFixed(1) + 'px';
      callout.style.top = (nr.top - 34).toFixed(1) + 'px';
      callout.hidden = false;
    }

    document.querySelectorAll('.node').forEach((n) => {
      n.classList.toggle('guide', n.dataset.district === distId);
    });
  }

  /* 画幅变化或横向滚动手牌时线要跟着重画，不然会错位。
     这里没有实时状态可读，所以记住最近一次 syncNodes 传进来的 S。 */
  let lastS = null;
  function armGuide() {
    if (guideTimer) cancelAnimationFrame(guideTimer);
    guideTimer = requestAnimationFrame(() => {
      guideTimer = null;
      drawGuide(lastS);
    });
  }
  window.addEventListener('resize', armGuide);
  document.addEventListener('scroll', armGuide, true);

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
      /* 拖的一部分人从来不「点选」牌，直接拖上去。
         那就在拖动过程中也把线画出来，别让指引只在点击路径里才有。 */
      drawGuide(getState(), { x: ev.clientX, y: ev.clientY, uid: activeUid });
    });

    document.addEventListener('pointerup', (ev) => {
      if (!dragging) return;
      dragging = false;
      if (ghost) { ghost.remove(); ghost = null; }
      document.querySelectorAll('.node').forEach((n) => n.classList.remove('hover'));
      /* 松手后回到「按选中状态画」——没选中就自己消失 */
      drawGuide(getState());
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

  /* ---------------- 取某个城区节点在屏幕上的位置 ----------------
     剧情面板要贴着对应节点出现，所以这里给出节点的视口矩形。
  ------------------------------------------------ */
  function nodeRect(distId) {
    const el = document.querySelector('.node[data-district="' + distId + '"]');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return null;
    return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height,
             cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
  }

  /** 城区是否在当前可见的地图带里 */
  function districtVisible(distId) {
    const layer = document.getElementById('map-layer');
    if (!layer) return false;
    const lr = layer.getBoundingClientRect();
    const nr = nodeRect(distId);
    if (!nr) return false;
    return nr.cx >= lr.left && nr.cx <= lr.right && nr.cy >= lr.top && nr.cy <= lr.bottom;
  }

  window.GAME_MAP = { buildNodes, syncNodes, attachDrag, districtDetail, districtById, districtOfAsset, setSelected, drawGuide, summary, nodeRect, districtVisible };
})();

/* ===== game/ui.js ===== */
/* ==========================================================
   《七日指令》界面层 v3
   主页（种子 + 命运商店）→ 出身 → 牌局 → 委托 → 终局
   ========================================================== */
(function () {
  'use strict';
  const D = window.GAME_DATA;
  const E = window.GAME_ENGINE;
  const M = window.GAME_MAP;
  const MET = window.GAME_META;
  const B = window.GAME_BRIEFS;
  const RNG = window.GAME_RNG;
  const AU = window.GAME_AUDIO;   // 音效层，全部合成，无素材
  const SV = window.GAME_SAVE;    // 局内存档：关掉页面还能接着玩
  const $ = (id) => document.getElementById(id);

  let S = null;
  let P = MET.load();
  let selectedUid = null;
  let drawerOpen = null;
  let settled = null;

  const ART = 'assets/';
  const CARD_ART = {
    control: ART + 'card-control.webp',
    capital: ART + 'card-capital.webp',
    expand: ART + 'card-expand.webp',
    purge: ART + 'card-purge.webp',
  };
  const PORTRAIT = (id) => (id ? ART + id + '.webp' : '');

  /* 城区场景图：目前只有环带维修层与后来补的几张，
     表里没有的城区就不显示这一块。 */
  const DISTRICT_ART = {
    tower:    ART + 'district-tower.webp',
    exchange: ART + 'district-exchange.webp',
    lab:      ART + 'district-lab.webp',
    slum:     ART + 'district-slum.webp',
    docks:    ART + 'district-docks.webp',
    orbit:    ART + 'district-orbit.webp',
    ring:     ART + 'district-ring.webp',
    memory:   ART + 'district-memory.webp',
    salvage:  ART + 'district-salvage.webp',
    outside:  ART + 'district-outside.webp',
  };

  /* 立绘兜底：新城区角色图未生成时退回同区已有肖像，避免出现碎图 */
  const FALLBACK = {
    'portrait-ring': 'portrait-peng',
    'portrait-out': 'portrait-yuke',
    'portrait-sal': 'portrait-fixer',
    'portrait-mem': 'portrait-dai',
  };
  /* 已生成的立绘，避免再走 onerror */
  const HAS = {
    'portrait-ring': 1, 'portrait-out': 1, 'portrait-sal': 1, 'portrait-mem': 1,
  };
  function imgTag(cls, id, extra) {
    if (!id) return '';
    const fb = HAS[id] ? null : (FALLBACK[id] || null);
    const onerr = fb
      ? ' onerror="this.onerror=null;this.src=\'' + ART + fb + '.webp\';"'
      : ' onerror="this.style.visibility=\'hidden\';"';
    return '<img class="' + cls + '" src="' + PORTRAIT(id) + '" alt="" loading="lazy"' + (extra || '') + onerr + '>';
  }


  /* NPC 名录：id → 显示信息 */
  const NPCS = {
    'wen-duo': { name: '闻铎', role: '董事会监事', district: 'tower', portrait: 'portrait-monitor' },
    'su-wen': { name: '苏纹', role: '董事会日程官', district: 'tower', portrait: 'portrait-su' },
    'yu-nanzhi': { name: '郁南枝', role: '清算行首席', district: 'exchange', portrait: 'portrait-yu' },
    'dai-siyuan': { name: '戴思远', role: '合规伦理审查官', district: 'exchange', portrait: 'portrait-dai' },
    'cheng-yan': { name: '程砚', role: '首席科学家', district: 'lab', portrait: 'portrait-scientist' },
    'peng-jian': { name: '彭戬', role: '研究所安保总管', district: 'lab', portrait: 'portrait-peng' },
    'lao-ya': { name: '老鸦', role: '灰市掮客', district: 'slum', portrait: 'portrait-fixer' },
    'lu-wan': { name: '陆晚', role: '无证诊所医生', district: 'slum', portrait: 'portrait-lu' },
    'tie-gui': { name: '铁贵', role: '装卸工会头目', district: 'docks', portrait: 'portrait-tie' },
    'yin-mian': { name: '银面', role: '女术士的代理人', district: 'docks', portrait: 'portrait-witch' },
    'wen-shicheng': { name: '温仕成', role: '引航票务掮客', district: 'orbit', portrait: 'portrait-wen' },
    'yu-ke': { name: '雨客', role: '穹顶外「潮」的接触人', district: 'orbit', portrait: 'portrait-yuke' },
  };
  const npcOf = (id) => NPCS[id] || { name: id || '某个人', role: '身份不明', district: null, portrait: null };

  function show(id) {
    document.querySelectorAll('.screen').forEach((el) => el.classList.remove('active'));
    $(id).classList.add('active');
  }

  /* ==========================================================
     主页
     ========================================================== */
  function renderHome() {
    /* 有存档就把「继续上一局」亮出来，并写清存到哪了 */
    const rb = $('btn-resume');
    if (rb) {
      let m = null;
      try { m = SV ? SV.meta() : null; } catch (e) { m = null; }
      if (m) {
        const when = String(m.savedAt || '').replace('T', ' ').slice(5, 16);
        $('resume-sub').textContent = '第 ' + m.day + ' 天 · 已折 ' + m.folded + '/12 · ' +
          (m.origin || '') + ' · ' + when;
        rb.hidden = false;
      } else {
        rb.hidden = true;
      }
    }

    $('pf-fortune').textContent = P.fortune;
    $('pf-runs').textContent = P.runs;
    $('pf-wins').textContent = P.wins;
    $('pf-endings').textContent = Object.keys(P.endings).length + '/' + D.ENDINGS.length;
    $('pf-met').textContent = Object.keys(P.metNpcs || {}).length + '/' + Object.keys(NPCS).length;
    $('nexus-dot').hidden = P.fortune < minCost();
    $('pf-last').textContent = P.lastRun
      ? '上一局：' + P.lastRun.ending + '（' + P.lastRun.origin + '，' + P.lastRun.days + ' 天，折牌 ' + P.lastRun.folded + '/12）+' + P.lastRun.points + ' 命运点'
      : '还没有记录。第一局从主页开始，留空种子就是随机局。';
  }

  function minCost() {
    let m = Infinity;
    MET.NEXUS.forEach((it) => { if (MET.levelOf(P, it.id) < it.max) m = Math.min(m, it.cost); });
    return m === Infinity ? 9999 : m;
  }

  /* ==========================================================
     命运商店
     ========================================================== */
  function renderNexus() {
    $('nx-fortune').textContent = P.fortune;
    const wrap = $('nexus-list');
    wrap.innerHTML = '';
    MET.NEXUS.forEach((it) => {
      const lv = MET.levelOf(P, it.id);
      const maxed = lv >= it.max;
      const gate = MET.canBuy(P, it.id);
      const el = document.createElement('div');
      el.className = 'nx-card' + (maxed ? ' maxed' : gate.ok ? ' affordable' : '');
      el.innerHTML =
        '<div class="nx-top"><span class="nx-icon">' + it.icon + '</span>' +
        '<div class="nx-name">' + esc(it.name) + '</div>' +
        '<div class="nx-lv">' + lv + '<span>/' + it.max + '</span></div></div>' +
        '<p class="nx-desc">' + esc(it.desc) + '</p>' +
        '<div class="nx-pips">' + Array.from({ length: it.max }).map((_, i) =>
          '<span class="pip' + (i < lv ? ' on' : '') + '"></span>').join('') + '</div>' +
        '<button class="btn btn-gold nx-buy">' + (maxed ? '已满级' : '升级 ' + it.cost + ' 点') + '</button>';
      const b = el.querySelector('.nx-buy');
      if (maxed) b.setAttribute('disabled', 'disabled');
      else if (!gate.ok) { b.setAttribute('disabled', 'disabled'); b.title = gate.why; }
      else b.onclick = () => onBuy(it.id);
      wrap.appendChild(el);
    });
  }

  /* ==========================================================
     结局图鉴
     档案里早就统计了每个结局见过几次，只是从来没展示过。
     见过的摊开来，没见过的只留一行编号 —— 让玩家知道还差几个。
     ========================================================== */
  const ENDING_HINT = {
    v2_true: '把规则本身改掉',
    v2_fake: '看起来赢了，其实被留下当下一副牌',
    v2_bad: '活着出来了，但不太认得自己',
    sultan: '权柄够高、罪痕够深、忠诚够低',
    emperor: '权柄封顶，而手上还不算太脏',
    hero: '声望够高，罪痕压得很低',
    ghost_out: '罪痕几乎没有，声望也不高',
    dog: '忠诚极高，但权柄一直上不去',
    purged: '罪痕满值',
    broken: '忠诚归零，或期限归零',
    w1: '权柄与声望双高，罪痕极低',
    w2: '权柄中上、罪痕不浅、声望平平',
    w3: '忠诚跌破底线，罪痕已经攒起来了',
    w4: '罪痕很高，忠诚很低，但牌折完了',
    w5: '通关时身上没剩几个钱，声望却不低',
    w6: '四轨全落在中段，哪一边都不站',
    w7: '十二张全折完，但罪痕已经压不下来',
    survivor: '十二张折完，仅此而已',
  };
  const ENDING_KIND = {
    v2_true: '真好', v2_fake: '假好', v2_bad: '坏',
    purged: '失败', broken: '失败',
  };

  function renderCompendium() {
    const P2 = P || {};
    const seen = P2.endings || {};
    const got = Object.keys(seen).length;
    $('cp-count').textContent = got;
    const tot = $('cp-total');
    if (tot) tot.textContent = D.ENDINGS.length;

    const wrap = $('cp-list');
    wrap.innerHTML = '';
    D.ENDINGS.slice().sort((a, b) => (b.priority || 0) - (a.priority || 0)).forEach((e) => {
      const n = seen[e.id] || 0;
      const kind = ENDING_KIND[e.id] || '';
      const el = document.createElement('div');
      el.className = 'cp-card' + (n ? '' : ' locked') + (kind ? ' k-' + kind : '');
      if (n) {
        el.innerHTML =
          '<div class="cp-top">' +
            (kind ? '<span class="cp-kind t-' + kind + '">' + kind + '</span>' : '') +
            '<b class="cp-name">' + esc(e.name) + '</b>' +
            (n > 1 ? '<span class="cp-times">×' + n + '</span>' : '<span class="cp-times new">首次</span>') +
          '</div>' +
          '<p class="cp-text">' + esc(e.text) + '</p>' +
          ((window.AFTERSTORY || {})[e.id]
            ? '<div class="cp-after"><span>后来</span>' + esc(window.AFTERSTORY[e.id]) + '</div>' : '') +
          '<div class="cp-hint">' + esc(ENDING_HINT[e.id] || '') + '</div>';
      } else {
        el.innerHTML =
          '<div class="cp-top"><b class="cp-name">未知结局</b></div>' +
          '<div class="cp-lock">◆</div>' +
          '<div class="cp-hint">' + esc(ENDING_HINT[e.id] || '还没见过这一种') + '</div>';
      }
      wrap.appendChild(el);
    });
  }

  function openCompendium() {
    renderCompendium();
    show('screen-compendium');
  }

  function onBuy(id) {
    const r = MET.buy(P, id);
    if (!r.ok) { nxNote(r.why, true); return; }
    nxNote(r.item.name + ' 升到 Lv' + r.level + '，下一局开局生效。');
    renderNexus(); renderHome();
  }
  function onRefund() {
    if (!confirm('把所有永久升级重置并退还全部命运点？')) return;
    const back = MET.refundAll(P);
    renderNexus(); renderHome();
    nxNote('已重置，退回 ' + back + ' 命运点。');
  }
  function nxNote(text, isErr) {
    const el = $('nx-note');
    el.textContent = text;
    el.className = 'nx-note show' + (isErr ? ' err' : '');
    clearTimeout(nxNote._t);
    nxNote._t = setTimeout(() => { el.className = 'nx-note'; }, 3200);
  }

  /* ==========================================================
     出身
     ========================================================== */
  function renderOrigins() {
    const wrap = $('origin-list');
    wrap.innerHTML = '';
    D.ORIGINS.forEach((o) => {
      const el = document.createElement('div');
      el.className = 'origin-card';
      el.innerHTML =
        imgTag('origin-portrait', o.portrait) +
        '<div class="tag">' + esc(o.tag) + '</div>' +
        '<h4>' + esc(o.name) + '</h4>' +
        '<p>' + esc(o.desc) + '</p>' +
        '<div class="mini-stats">' + D.STATS.map((s) => '<span>' + s.name + ' ' + o.stats[s.id] + '</span>').join('') + '</div>' +
        '<div class="perk">' + esc(o.perk) + '</div>';
      el.onclick = () => start(o.id);
      wrap.appendChild(el);
    });
  }

  function gotoOrigin() {
    const seed = ($('seed-input').value || '').trim();
    let text = seed;
    if (!text) {
      text = RNG.makeSeed(RNG.create(String(Date.now()) + Math.random()).next);
      $('seed-input').value = text;
    }
    $('origin-seed').textContent = '本局种子 ' + text;
    show('screen-origin');
  }

  /* ==========================================================
     开局
     ========================================================== */
  function start(originId) {
    const seed = ($('seed-input').value || '').trim() || undefined;
    S = E.newGame(originId, seed);
    const gained = MET.applyToRun(S, P);
    selectedUid = null;
    settled = null;
    show('screen-game');
    M.buildNodes($('map-grid'), onNodeClick);
    M.attachDrag($('map-grid'), () => S, onDrop, onPickCard);
    renderAll();
    if (gained.length) hint('本局已生效：' + gained.join('、'), 4200);
    autosave();
    // 开局先来一条委托，让新系统立刻可见
    if (B && !S.briefs.length) { B.spawn(S); renderAll(); }
    setTimeout(() => hint('种子 ' + S.seedLabel + ' · 遇到新的委托点顶部 ◈', 4200), 1400);
    // 开局走世界观入门剧情，不再弹独立的教程浮层
    setTimeout(() => startIntro(), 260);
  }

  function quitToHome() {
    if (S && !S.ending && !confirm('回到主页？进度已自动保存，下次可以接着玩。')) return;
    S = null;
    show('screen-home');
    renderHome();
  }

  /* 接着上一局：把状态原样读回来，重建本该由 start() 做的那些接线 */
  function resumeRun() {
    let back = null;
    try { back = SV ? SV.load() : null; } catch (e) { back = null; }
    if (!back) { toast('没有可继续的牌局', '存档读不出来，可能已过期或损坏。开一局新的吧。'); return; }
    S = back;
    selectedUid = null;
    settled = null;
    lastHandCount = null;
    show('screen-game');
    M.buildNodes($('map-grid'), onNodeClick);
    M.attachDrag($('map-grid'), () => S, onDrop, onPickCard);
    renderAll();
    /* 存下来的时候可能正停在一个待处理的事件或剧情上 */
    if (S.pendingStory) { setTimeout(() => queueStory(S.pendingStory), 260); }
    else if (S.pendingEvent) { setTimeout(() => showEvent(S.pendingEvent), 260); }
    else { setTimeout(() => hint('接着第 ' + S.day + ' 天 · 已折 ' + S.folded + '/12', 4200), 500); }
  }

  /* ==========================================================
     渲染
     ========================================================== */
  function renderAll() {
    if (!S) return;
    renderHud();
    renderHand();
    renderTracks();
    renderStats();
    renderPeople();
    renderLog();
    M.syncNodes(S);
    renderGoal();
    renderBriefBadge();
  }

  function renderGoal() {
    const el = $('hud-goal');
    const foldable = S.hand.filter((c) => E.canFold(S, c).ok);
    const need = 12 - S.folded;
    const urgent = B ? B.urgentCount(S) : 0;
    if (urgent > 0) {
      el.textContent = '有 ' + urgent + ' 条委托今天到期，先去处理';
      el.classList.add('urgent');
      return;
    }
    if (S.deadline <= 2) {
      el.textContent = foldable.length ? '期限只剩 ' + S.deadline + ' 天，把卡投到 ' + distNameOf(foldable[0]) + ' 折掉' : '期限只剩 ' + S.deadline + ' 天，先攒资源再折牌';
      el.classList.add('urgent');
      return;
    }
    el.classList.remove('urgent');
    // 有主线等着就说主线，否则说牌
    if (window.GAME_STORY) {
      const p = window.GAME_STORY.progress(S);
      if (p.nextTitle) { el.textContent = '第 ' + p.act + ' 幕 · ' + p.name + '：' + p.nextTitle; return; }
    }
    if (foldable.length) {
      el.textContent = '还能折 ' + foldable.length + ' 张，还差 ' + need + ' 张通关';
    } else if (S.hand.length <= 1 && S.deck && S.deck.length) {
      el.textContent = '手上没牌了，去「行动」里申领一张';
    } else {
      el.textContent = '暂时没有可折的牌，换牌或用行动攒资源';
    }
  }

  function distNameOf(card) {
    const a = E.assetOf(card.target);
    const d = a ? M.districtById(a.district) : null;
    return d ? d.name : '对应城区';
  }

  function renderBriefBadge() {
    const n = (S.briefs || []).length;
    const badge = $('brief-badge');
    badge.hidden = n === 0;
    badge.textContent = n;
    const urgent = B ? B.urgentCount(S) : 0;
    badge.classList.toggle('hot', urgent > 0);
  }

  function renderHud() {
    $('hud-day').textContent = S.day;
    $('hud-folded').textContent = S.folded;
    $('hud-money').textContent = S.money;
    $('hud-intel').textContent = S.intel;
    $('hud-chips').textContent = S.chips;
    $('hud-gear').textContent = S.gear;
    $('hud-ap').textContent = S.ap;
    $('hud-apmax').textContent = S.apMax;
    const dl = $('hud-deadline');
    dl.textContent = S.deadline;
    dl.classList.toggle('danger', S.deadline <= 2);

    const maxChip = Math.min(Math.floor(S.chips / E.CHIP_PER), E.CHIP_CAP);
    const range = $('chip-range');
    range.max = String(maxChip);
    if (parseInt(range.value, 10) > maxChip) range.value = String(maxChip);
    $('chip-show').textContent = range.value + '/' + maxChip;
    $('boost-cost').textContent = E.boostCost(S);
    $('chk-boost').disabled = S.money < E.boostCost(S);

    // 牌堆与手牌：让「牌是挣来的」这件事可见
    const deckEl = $('hud-deck');
    if (deckEl && S.deck) {
      deckEl.textContent = S.hand.length + ' / ' + S.deck.length;
      deckEl.title = '手上 ' + S.hand.length + ' 张（上限 ' + (D.CONFIG.handMax || 7) + '）· 牌堆还有 ' + S.deck.length + ' 张';
      deckEl.classList.toggle('low', S.hand.length <= 1);
    }

    // 主线幕进度
    if (window.GAME_STORY) {
      const p = window.GAME_STORY.progress(S);
      $('hud-act-n').textContent = p.act;
      $('hud-act-name').textContent = p.name;
      const el = $('hud-act');
      el.title = '第 ' + p.act + ' 幕 · ' + p.name + '\n' + p.hook + (p.nextTitle ? '\n下一步：' + p.nextTitle : '');
    }
  }

  function renderHand() {
    const wrap = $('hand');
    wrap.innerHTML = '';
    if (!S.hand.length) { wrap.innerHTML = '<p class="pane-hint">手上没有牌了。</p>'; return; }
    S.hand.forEach((c) => {
      const p = E.pathOf(c.pathId), t = E.tierOf(c.tier);
      const target = E.assetOf(c.target);
      const gate = E.canFold(S, c);
      const dist = target ? M.districtById(target.district) : null;
      const rate = Math.round(E.successRate(S, c) * 100);
      const rc = rate >= 65 ? 'var(--ok)' : rate >= 45 ? 'var(--gold)' : 'var(--red)';
      const el = document.createElement('div');
      el.className = 'card t' + c.tier + (gate.ok ? '' : ' locked') + (selectedUid === c.uid ? ' picked' : '');
      el.style.setProperty('--c', p.color);
      el.dataset.uid = c.uid;
      /* 卡面结构照抄实体牌的版式：顶部名条 → 中部插画 → 底部文字板。
         曜金卡用描金字，和实体牌里苏丹卡的处理一致。 */
      el.innerHTML =
        '<div class="card-band">' +
          '<span class="card-tier">' + esc(t.name) + '</span>' +
          '<span class="card-path">' + esc(p.name) + '</span>' +
        '</div>' +
        '<div class="card-art" style="background-image:url(' + CARD_ART[c.pathId] + ')"></div>' +
        '<div class="card-body">' +
          '<div class="card-verb">' + esc(p.verb) + '</div>' +
          '<div class="card-target"><span>' + esc(target ? target.name : '无目标') + '</span>' +
            '<span class="zone">' + esc(dist ? dist.name : '—') + '</span></div>' +
          '<div class="card-rate"><span style="color:' + rc + '">' + rate + '%</span>' +
            '<span class="rate-bar"><span class="rate-fill" style="width:' + rate + '%;background:' + rc + '"></span></span></div>' +
          '<div class="card-act">' +
            '<button class="btn btn-primary" data-drag="' + c.uid + '">投放</button>' +
            '<button class="btn btn-ghost" data-swap="' + c.uid + '">换</button>' +
          '</div>' +
        '</div>';
      wrap.appendChild(el);
    });
    wrap.querySelectorAll('[data-swap]').forEach((b) => {
      b.onclick = (e) => { e.stopPropagation(); onSwap(b.getAttribute('data-swap')); };
    });
    /* 发牌音：手牌张数变了才响，不然每次刷新都在响 */
    if (lastHandCount !== null && S.hand.length > lastHandCount) {
      for (let i = 0; i < Math.min(3, S.hand.length - lastHandCount); i++) {
        setTimeout(() => sfx('deal'), i * 90);
      }
    }
    lastHandCount = S.hand.length;
  }

  /* 每个城区有自己的行动表。
     以前九条行动挤在一个全局面板里，站在哪儿都能干同一批事，
     地图和手牌就都失去了意义；玩家也看不懂那些行动跟折牌什么关系。
     现在「办哪件事」和「去哪儿」绑在一起，点开城区才看得到。 */
  function renderDistrictActions(distId) {
    const wrap = $('dt-actions');
    if (!wrap) return;
    wrap.innerHTML = '';
    const ids = (D.DISTRICT_ACTIONS && D.DISTRICT_ACTIONS[distId]) || [];
    if (!ids.length) {
      wrap.innerHTML = '<p class="pane-hint">这个地方没有你能做的事。</p>';
      return;
    }
    ids.forEach((id) => {
      const a = D.ACTIONS.find((x) => x.id === id);
      if (!a) return;
      const poor = !!a.price && S.money < a.price;
      const el = document.createElement('div');
      el.className = 'act';
      el.title = a.desc || '';
      el.innerHTML = '<span class="ic">' + a.icon + '</span>' +
        '<div class="an">' + esc(a.name) + '</div>' +
        '<div class="ac">' + a.cost + ' 行动点' +
        (a.price ? ' · ' + a.price + ' 信用点' : '') + '</div>';
      if (S.ap < a.cost || poor) el.setAttribute('disabled', 'disabled');
      else el.onclick = () => onAction(a.id);
      wrap.appendChild(el);
    });
  }

  function renderTracks() {
    const wrap = $('tracks');
    wrap.innerHTML = '';
    D.TRACKS.forEach((t) => {
      const v = S.tracks[t.id];
      const el = document.createElement('div');
      el.className = 'track';
      el.innerHTML =
        '<div class="track-top"><span class="track-name">' + esc(t.name) + '</span>' +
        '<span class="track-val" style="color:' + t.color + '">' + v + '</span></div>' +
        '<div class="track-bar"><div class="track-fill" style="width:' + Math.round(v / D.CONFIG.trackCap * 100) + '%;background:' + t.color + '"></div></div>' +
        '<div class="track-desc">' + esc(t.desc) + '</div>';
      wrap.appendChild(el);
    });
  }

  function renderStats() {
    const wrap = $('stats');
    wrap.innerHTML = '';
    D.STATS.forEach((s) => {
      const el = document.createElement('div');
      el.className = 'stat';
      el.innerHTML = '<span class="sk">' + esc(s.name) + '</span><b>' + S.stats[s.id] + '</b>';
      el.title = s.desc;
      wrap.appendChild(el);
    });
    const ex = document.createElement('div');
    ex.className = 'stat';
    ex.innerHTML = '<span class="sk">出身</span><b>' + esc(S.origin.name) + '</b>';
    wrap.appendChild(ex);
    if ((S.profileApplied || []).length) {
      const pf = document.createElement('div');
      pf.className = 'stat';
      pf.innerHTML = '<span class="sk">强化</span><b>' + S.profileApplied.length + ' 项</b>';
      pf.title = S.profileApplied.join('、');
      wrap.appendChild(pf);
    }
  }

  /* 认识的人：交给对话层渲染，可以点进去反复搭话 */
  function renderPeople() {
    const host = $('people');
    if (!host) return;
    if (window.GAME_VOICE) {
      window.GAME_VOICE.renderPeople(S, host, openTalk);
    } else {
      host.innerHTML = '<p class="pane-hint">对话系统尚未加载。</p>';
    }
  }

  /* ---------- 对话屏 ---------- */
  let talkNpc = null;
  let lastHandCount = null;   // 用来判断手牌是不是刚变多

  function openTalk(npcId) {
    talkNpc = npcId;
    show('screen-talk');
    renderTalk();
  }

  function renderTalk() {
    const host = $('talk-body');
    if (!host || !talkNpc) return;
    window.GAME_VOICE.renderTalk(S, talkNpc, host, {
      onBack: () => { talkNpc = null; show('screen-game'); renderAll(); openDrawer('people'); },
      onTopic: (tid) => {
        const r = window.GAME_VOICE.talk(S, talkNpc, tid);
        if (!r.ok) { toast('聊不下去', r.why); return; }
        window.GAME_VOICE.showReply(host, r);
        // 刷新关系值与话题锁定状态
        const back = host.querySelector('[data-back]');
        if (back) {
          renderTalk();
          const fresh = $('talk-body').querySelector('#talk-reply');
          if (fresh) window.GAME_VOICE.showReply($('talk-body'), r);
        }
        renderAll();
      },
    });
  }

  function renderLog() {
    const wrap = $('log');
    wrap.innerHTML = '';
    S.log.forEach((l) => {
      const el = document.createElement('div');
      el.className = 'log-item ' + l.kind;
      el.innerHTML = '<span class="d">D' + l.day + '</span>' + esc(l.text);
      wrap.appendChild(el);
    });
  }

  /* 委托面板 */
  function renderBriefs() {
    const wrap = $('briefs-list');
    const list = S.briefs || [];
    $('bf-count').textContent = list.length;
    wrap.innerHTML = '';
    if (!list.length) {
      wrap.innerHTML = '<p class="pane-hint">此刻没有人给你派活。放心折你的牌——但不会太久。</p>';
      return;
    }
    list.forEach((b) => {
      const def = B.KIND[b.kind] || {};
      const npc = npcOf(b.npc);
      const gate = B.canSolve(S, b);
      const el = document.createElement('div');
      el.className = 'brief-card' + (b.left <= 1 ? ' urgent' : '');
      el.style.setProperty('--bc', def.color || '#e0b44a');
      el.innerHTML =
        '<div class="brief-head">' +
          imgTag('brief-face', npc.portrait) +
          '<div class="brief-meta">' +
            '<div class="brief-kind" style="color:' + (def.color || '#e0b44a') + '">' + (def.mark || '◈') + ' ' + (def.name || '委托') + '</div>' +
            '<div class="brief-title">' + esc(b.title) + '</div>' +
            '<div class="brief-from">来自 ' + esc(npc.name) + ' · ' + esc(npc.role) + '</div>' +
          '</div>' +
          '<div class="brief-days"><b>' + b.left + '</b><span>天</span></div>' +
        '</div>' +
        '<p class="brief-text">' + esc(b.text) + '</p>' +
        '<div class="brief-foot">' +
          '<span class="brief-need' + (gate.ok ? ' ok' : '') + '">' + (gate.ok ? '可以交差：' + esc(gate.why || '条件已满足') : '还差：' + esc(gate.why)) + '</span>' +
          '<div class="brief-act">' +
            '<button class="btn btn-primary btn-sm" data-solve="' + b.uid + '"' + (gate.ok ? '' : ' disabled') + '>交差</button>' +
            '<button class="btn btn-ghost btn-sm" data-refuse="' + b.uid + '">' + esc(b.refuseLabel || '回绝') + '</button>' +
          '</div>' +
        '</div>';
      wrap.appendChild(el);
    });
    wrap.querySelectorAll('[data-solve]').forEach((btn) => {
      btn.onclick = () => onSolveBrief(btn.getAttribute('data-solve'));
    });
    wrap.querySelectorAll('[data-refuse]').forEach((btn) => {
      btn.onclick = () => onRefuseBrief(btn.getAttribute('data-refuse'));
    });
  }

  function hint(text, ms) {
    const el = $('map-hint');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(hint._t);
    hint._t = setTimeout(() => el.classList.remove('show'), ms || 2400);
  }

  /* 抽屉是否开着。类名是 open，不是 on —— on 是给面板和侧栏按钮用的，
     这两个混淆过一次，所以收成一个函数，别在别处再手写。 */
  function isDrawerOpen() {
    const d = $('drawer');
    return !!(d && d.classList.contains('open'));
  }

  /* 直接把抽屉切到某一栏，不带「再点一次就收起」的开关语义。
     城区详情要能在原地刷新（折完牌列表就变了），
     如果用 openDrawer 刷新，会因为它已经是当前栏而被关掉。 */
  function setDrawer(name) {
    drawerOpen = name;
    $('drawer').classList.add('open');
    document.querySelectorAll('.pane').forEach((p) => p.classList.remove('on'));
    $('pane-' + name).classList.add('on');
    document.querySelectorAll('.rail-btn').forEach((b) => b.classList.toggle('on', b.dataset.panel === name));
  }

  function openDrawer(name) {
    const titles = { actions: '行动', tracks: '名望与属性', people: '认识的人', log: '记录', district: '城区' };
    if (drawerOpen === name) return closeDrawer();
    $('drawer-title').textContent = titles[name] || name;
    setDrawer(name);
  }
  function closeDrawer() {
    drawerOpen = null;
    $('drawer').classList.remove('open');
    document.querySelectorAll('.rail-btn').forEach((b) => b.classList.remove('on'));
  }

  /* ==========================================================
     地图交互
     ========================================================== */
  function onPickCard(uid) {
    if (!uid) return;
    const card = S.hand.find((c) => c.uid === uid);
    if (!card) return;
    selectedUid = selectedUid === uid ? null : uid;
    M.setSelected(selectedUid);
    renderAll();
    if (selectedUid) {
      const target = E.assetOf(card.target);
      const d = target ? M.districtById(target.district) : null;
      /* 线已经指到目标城区了，这里不再重复报地名，
         只说「怎么放」，省得两处信息互相打架。 */
      if (d) hint('顺着线拖到「' + d.name + '」即可投放', 3000);
      else hint('这张牌暂时没有可投目标，换一张', 2600);
    }
  }

  function onNodeClick(distId) {
    maybeIntro('firstNode');
    if (selectedUid) {
      const card = S.hand.find((c) => c.uid === selectedUid);
      const target = card ? E.assetOf(card.target) : null;
      if (target && target.district === distId) {
        const gate = E.canFold(S, card);
        if (gate.ok) return onFold(selectedUid);
        toast('还不能执行', gate.why);
        return;
      }
    }
    openDistrict(distId);
  }

  function onDrop(uid, distId, mismatch) {
    const card = S.hand.find((c) => c.uid === uid);
    if (!card) return;
    if (mismatch) {
      const d = M.districtById(distId);
      toast('地点不对', '「' + E.label(card) + '」的目标不在' + d.name + '。');
      return;
    }
    const gate = E.canFold(S, card);
    if (!gate.ok) { toast('无法执行', gate.why); return; }
    onFold(uid);
  }

  let lastDistrict = null;   // 动作结算后要原地刷新这一栏

  function openDistrict(distId) {
    lastDistrict = distId;
    maybeIntro('openDistrict');
    const info = M.districtDetail(S, distId);
    if (!info) return;
    $('dt-tag').textContent = info.district.en || '';
    $('dt-title').textContent = info.district.name;
    $('dt-desc').textContent = info.district.desc || '';

    /* 城区场景图：有的城区才有，没有就整块不显示，不留空框 */
    const sc = $('dt-scene');
    if (sc) {
      const art = DISTRICT_ART[distId];
      if (art) {
        sc.innerHTML = '<img src="' + art + '" alt="" loading="lazy" ' +
          'onerror="this.parentNode.hidden=true;">';
        sc.hidden = false;
      } else {
        sc.hidden = true;
        sc.innerHTML = '';
      }
    }

    // 委托
    const bh = $('dt-brief-head'), bw = $('dt-briefs');
    if (info.briefs.length) {
      bh.hidden = false;
      bw.innerHTML = '';
      info.briefs.forEach((r) => {
        const el = document.createElement('div');
        el.className = 'dt-brief';
        el.style.borderLeftColor = r.color;
        el.innerHTML = '<div class="dt-brief-top"><b style="color:' + r.color + '">' + r.mark + ' ' + esc(r.title) + '</b>' +
          '<span class="dt-brief-days' + (r.days <= 1 ? ' hot' : '') + '">' + r.days + ' 天</span></div>' +
          '<span class="note">' + esc(r.text) + '</span>' +
          (r.ok ? '<button class="btn btn-primary btn-sm go">交差</button>' : '<span class="note">还差：' + esc(r.why) + '</span>');
        if (r.ok) el.querySelector('.go').onclick = () => {
          const at = distId;
          onSolveBrief(r.uid);
          setTimeout(() => openDistrict(at), 40);   // 交完差这一栏要重画
        };
        bw.appendChild(el);
      });
    } else { bh.hidden = true; bw.innerHTML = ''; }

    // 指令
    const cw = $('dt-cards');
    cw.innerHTML = '';
    if (!info.cards.length) cw.innerHTML = '<p class="pane-hint">此处暂无手牌可投放。</p>';
    info.cards.forEach((r) => {
      const el = document.createElement('div');
      el.className = 'dt-card' + (r.ok ? '' : ' locked');
      el.style.borderLeftColor = r.color;
      el.innerHTML = '<b style="color:' + r.color + '">' + esc(r.label) + '</b>' +
        '<span class="note">' + esc(r.note) + '</span>' +
        (r.ok ? '<button class="btn btn-primary btn-sm go">' + esc(r.verb) + '</button>'
              : '<span class="note">' + esc(r.why) + '</span>');
      if (r.ok) el.querySelector('.go').onclick = () => {
          const at = distId;
          onFold(r.uid);
          setTimeout(() => openDistrict(at), 620);   // 折牌有裂开动画，等它播完再刷新
        };
      cw.appendChild(el);
    });

    $('dt-assets').innerHTML = info.assets.length
      ? info.assets.map((a) => '<span>' + esc(a) + '</span>').join('')
      : '<span style="opacity:.6">暂无</span>';
    $('dt-events').innerHTML = info.events.length
      ? info.events.map((x) => '<span>' + esc(x) + '</span>').join('')
      : '<span style="opacity:.6">暂无</span>';

    /* 以前这里是 show('screen-district')，一整页模态框把地图盖死。
       现在改成抽屉里的一栏：地图、手牌、指引线全都还看得见。 */
    renderDistrictActions(distId);
    setDrawer('district');
    $('drawer-title').textContent = info.district.name;
  }

  /* ==========================================================
     动作
     ========================================================== */
  function onFold(uid) {
    const card = S.hand.find((c) => c.uid === uid);
    if (!card) return;
    const gate = E.canFold(S, card);
    if (!gate.ok) { toast('无法执行', gate.why); return; }
    const boost = $('chk-boost').checked;
    const chipSpend = parseInt($('chip-range').value, 10) || 0;
    /* 先让这张牌在手上裂开，再刷新界面。折牌就是这个游戏的核心动作，
       值得半秒的交代。 */
    const node = document.querySelector('#hand .card[data-uid="' + uid + '"]');
    if (node) node.classList.add('breaking');
    const r = E.fold(S, uid, boost, chipSpend);
    if (!r.ok) {
      if (node) node.classList.remove('breaking');
      toast('无法执行', r.why);
      return;
    }
    selectedUid = null;
    M.setSelected(null);
    $('chk-boost').checked = false;
    $('chip-range').value = '0';
    if (r.pass) sfx(r.crit ? 'crit' : 'foldOk');
    else sfx(r.fumble ? 'fumble' : 'foldFail');
    const title = r.pass ? (r.crit ? '暴击 · 指令达成' : '指令达成') : (r.fumble ? '崩盘 · 指令失败' : '指令失败');
    const delay = node ? 420 : 0;
    if (delay) setTimeout(() => { showResult(title, r.lines, r.pass); afterAction(); }, delay);
    else { showResult(title, r.lines, r.pass); afterAction(); }
  }

  function onSwap(uid) {
    const r = E.swapCard(S, uid);
    if (!r.ok) { toast('换不了', r.why); return; }
    selectedUid = null;
    M.setSelected(null);
    afterAction();
  }

  function onAction(id) {
    const r = E.doAction(S, id);
    if (!r.ok) { toast('做不了', r.why); return; }
    /* 以前点完行动什么都不显示，只有角落里的数字悄悄变了一下 ——
       玩家看不懂那些行动在干什么，一半原因在这里。 */
    if (r.lines && r.lines.length) showResult('办完了', r.lines, true);
    afterAction();
    if (drawerOpen === 'district' && lastDistrict) openDistrict(lastDistrict);
  }

  function onSolveBrief(uid) {
    const r = B.solve(S, uid);
    if (!r.ok) { toast('还交不了', r.why); return; }
    renderAll();
    renderBriefs();
    const title = r.pass ? '委托完成' : '委托未办成';
    showResult(title, r.lines, r.pass);
    if (S.phase === 'end' && S.ending) showEnd();
    else autosave();
  }

  function onRefuseBrief(uid) {
    if (!confirm('回绝这条委托？对方会记住。')) return;
    const r = B.refuse(S, uid);
    if (!r.ok) { toast('回绝不了', r.why); return; }
    renderAll();
    renderBriefs();
    showResult('你回绝了', r.lines, false);
    if (S.phase === 'end' && S.ending) showEnd();
    else autosave();
  }

  function onEndDay() {
    const r = E.endDay(S);
    renderAll();
    renderBriefs();
    if (r.dead && S.ending) {
      try { if (SV) SV.clear(); } catch (e) {}
      showEnd();
      return;
    }
    autosave();
    // 先播报超期与新委托，再出当日的故事或事件
    const notes = [];
    (r.expired || []).forEach((x) => { notes.push('「' + x.brief.title + '」超期。' + x.lines.join(' ')); });
    if (r.incoming) notes.push('新委托：「' + r.incoming.title + '」（' + r.incoming.left + ' 天内）。');
    const next = r.story || r.event || null;
    if (notes.length) {
      showResult('这一天的账', notes, false);
      pendingEvent = next;
      return;
    }
    if (next) showEvent(next);
  }

  let pendingEvent = null;

  function afterAction() {
    /* 折完第一张之后补讲制度来历 —— 这时候他才看得懂 */
    if (S && S.folded > 0) maybeIntro('firstFold');
    renderAll();
    if (S.phase === 'end' && S.ending) {
      /* 收场了就清掉存档，免得下次进来「继续」到一个已结束的局 */
      try { if (SV) SV.clear(); } catch (e) {}
      showEnd();
      return;
    }
    autosave();
  }

  /* 自动存档：每一次会改变状态的动作之后都写一遍。
     失败不提示 —— 玩家不需要知道隐私模式下的存储限制。 */
  function autosave() {
    try { if (SV && S) SV.save(S); } catch (e) { /* 静默 */ }
  }

  /* ==========================================================
     剧情面板
     剧情贴着 NPC / 城区节点出现，不做全屏：地图始终可见，
     玩家能看到这段话发生在哪。窄屏时退化为贴底部的长条。
     ========================================================== */
  let storyQueue = [];       // 待播的场景
  let storyDone = null;      // 播完后的回调
  let storyIsIntro = false;
  let storyCurrent = null;


  function storyLayer(on) {
    const el = $('story-layer');
    if (!el) return;
    el.hidden = !on;
  }


  /* ---------- 正文内联高亮 ----------
     正文里写成【罪痕】【忠诚】这类方括号术语时，
     渲染成高亮标记，玩家读到就知道这是面板上的哪个数。 */
  const TERM_COLOR = {
    '罪痕': 'sin', '忠诚': 'loyalty', '声望': 'renown', '权柄': 'power',
    '信用点': 'money', '情报': 'intel', '指令芯片': 'chips', '芯片': 'chips',
    '装备': 'gear', '体魄': 'vitality', '智慧': 'intellect', '魅力': 'charm',
    '战斗': 'force', '隐匿': 'stealth',
  };
  function richText(raw) {
    if (!raw) return '';
    // 先转义，再替换方括号
    let out = esc(raw);
    out = out.replace(/【([^】]{1,10})】/g, (m, term) => {
      const kind = TERM_COLOR[term];
      const cls = kind ? ' term term-' + kind : ' term';
      return '<b class="' + cls.trim() + '">' + term + '</b>';
    });
    // 段落换行保留
    return out;
  }

  /* ==========================================================
     开场：读三段就能进牌局
     原来开局一口气播完十二段、2304 字，玩家还没摸到牌就先读了五屏。
     现在只留三段（世界、你的身份、你被点名的处境，约 570 字），
     其余九段改成「按需补讲」——第一次遇到对应的事时才插进来。
     在玩家正好要用到的时候讲，才记得住；
     而且这个时候他手上已经有一张牌了，读起来是想知道，不是被灌。
     ========================================================== */
  const INTRO_OPENING = ['intro-1', 'intro-2', 'intro-4'];

  const INTRO_LATER = {
    /* 第一次点开地图上的城区：讲规则与四条路径 —— 此刻他正要出牌 */
    'intro-5':  'firstNode',
    'intro-6':  'firstNode',
    'intro-7':  'firstNode',
    /* 手上出现第一张折得动的牌：推他翻第一张 */
    'intro-12': 'firstReady',
    /* 第一次认识一个人：介绍苏纹 */
    'intro-10': 'metAny',
    'intro-11': 'metAny',
    /* 第一次折完牌：这时候才看得懂制度是怎么来的 */
    'intro-3':  'firstFold',
    /* 第一次名望真的变动：两条不杀人的轨道才有意义 */
    'intro-8':  'firstFold',
    /* 第一次走进具体城区：工位与门禁的常识 */
    'intro-9':  'openDistrict',
  };

  function introScenes() {
    const list = Array.isArray(window.INTRO_SCENES) ? window.INTRO_SCENES : [];
    return list.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  function introToScene(sc, i, total) {
    return {
      story: true, kind: 'intro', id: sc.id, tag: sc.tag || '世界观',
      title: sc.title, text: sc.text, portrait: null, npc: null, npcName: '',
      district: 'tower',
      idx: i + 1, total: total,
      options: (sc.choices || []).map((c) => ({ label: c.label, relation: c.relation, run: c.run, flag: c.flag })),
    };
  }

  /* 按 id 把还没看过的几段排进队列 */
  function queueIntroIds(ids) {
    S.introDone = S.introDone || {};
    const all = introScenes();
    const pick = ids
      .map((id) => all.find((sc) => sc.id === id))
      .filter((sc) => sc && !S.introDone[sc.id]);
    if (!pick.length) return false;
    storyIsIntro = true;
    pick.forEach((sc, i) => storyQueue.push(introToScene(sc, i + 1, pick.length)));
    storyDone = () => { storyIsIntro = false; storyLayer(false); renderAll(); };
    if ($('story-layer').hidden) showStory(storyQueue.shift());
    return true;
  }

  /* 按需补讲的入口：某件事第一次发生时调一次 */
  function maybeIntro(trigger) {
    if (!S || S.phase === 'end') return false;
    if (!storyLayerHidden()) return false;    // 正在读东西就别插队
    const ids = Object.keys(INTRO_LATER).filter((id) => INTRO_LATER[id] === trigger);
    if (!ids.length) return false;
    return queueIntroIds(ids);
  }
  function storyLayerHidden() {
    const el = $('story-layer');
    return !el || el.hidden;
  }

  function startIntro() {
    S.introDone = S.introDone || {};
    /* 已经开过局的档（存档读回来）不再重播开场三段 */
    const played = INTRO_OPENING.some((id) => S.introDone[id]);
    if (played) { storyLayer(false); return; }
    if (!queueIntroIds(INTRO_OPENING)) { storyLayer(false); return; }
    /* 三段读完给他一句指引，别让他在空地图上发愣 */
    setTimeout(() => hint('点开地图上任意一个城区，那里有你今天能做的事', 5200), 600);
  }

  /* ---------- 面板落点：优先贴着节点，其次左右侧，最后贴底 ---------- */
  function placePanel(scene) {
    const panel = $('story-panel');
    const pin = $('story-pin');
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const M = 10;

    const narrow = vw <= 820;
    const shortLand = window.matchMedia('(orientation:landscape) and (max-height:560px)').matches;

    // 面板尺寸：先按内容量出来
    panel.style.left = '0px';
    panel.style.top = '0px';
    panel.style.bottom = 'auto';
    const pw = panel.offsetWidth || 440;
    const ph = panel.offsetHeight || 320;

    // 找出这段剧情对应的节点位置
    const distId = scene.district;
    const rect = (distId && M && M.nodeRect) ? M.nodeRect(distId) : null;
    const inBand = rect && M.districtVisible ? M.districtVisible(distId) : false;

    if (rect && inBand && !narrow) {
      pin.hidden = false;
      pin.style.left = rect.cx + 'px';
      pin.style.top = rect.cy + 'px';
    } else {
      pin.hidden = true;
    }

    let x, y;

    if (narrow) {
      // 窄屏：贴底长条，让地图上半部分仍然可见
      x = M;
      y = vh - ph - M;
      if (shortLand) y = vh - ph - 6;
      x = Math.max(M, Math.min(x, vw - pw - M));
      y = Math.max(M, Math.min(y, vh - ph - M));
      pin.hidden = true;
    } else if (rect && inBand) {
      // 优先放节点右侧；右侧不够就放左侧；上下夹紧
      const gap = 26;
      if (rect.right + gap + pw < vw - M) x = rect.right + gap;
      else if (rect.left - gap - pw > M) x = rect.left - gap - pw;
      else x = Math.min(Math.max(rect.cx + gap, M), vw - pw - M);
      y = rect.cy - ph / 2;
      y = Math.max(M, Math.min(y, vh - ph - M));
      x = Math.max(M, Math.min(x, vw - pw - M));
    } else {
      // 节点不在可见带里（例如剧情挂在别的区）：放右侧竖向
      x = vw - pw - M - (shortLand ? 90 : 0);
      y = (vh - ph) / 2;
      x = Math.max(M, Math.min(x, vw - pw - M));
      y = Math.max(M, Math.min(y, vh - ph - M));
    }

    panel.style.left = Math.round(x) + 'px';
    panel.style.top = Math.round(y) + 'px';
    panel.style.bottom = 'auto';
  }

  function showStory(scene) {
    if (!scene) { if (storyDone) storyDone(); return; }
    storyCurrent = scene;

    // 顶部
    const badge = $('story-badge');
    if (scene.kind === 'intro') badge.textContent = scene.tag || '世界观';
    else if (scene.kind === 'main') badge.textContent = '主线';
    else if (scene.kind === 'meet') badge.textContent = '初见';
    else if (scene.kind === 'approval') badge.textContent = '认可 · ' + (scene.npcName || '');
    else badge.textContent = scene.npcName ? scene.npcName + ' 的故事' : '故事';

    $('story-progress').innerHTML =
      '<span>' + (scene.idx || '·') + '</span><i>/</i><span>' + (scene.total || '·') + '</span>';

    $('story-act').textContent = scene.actName
      ? '第 ' + (scene.act || 1) + ' 幕 · ' + scene.actName + (scene.stage ? ' · 第 ' + scene.stage + ' 段' : '')
      : (scene.npcRole || '');

    // 立绘
    const face = $('story-face');
    const pid = scene.portrait || null;
    if (pid) {
      const fb = FALLBACK[pid] || null;
      face.onerror = fb ? function () { this.onerror = null; this.src = PORTRAIT(fb); }
                        : function () { this.hidden = true; };
      face.hidden = false;
      face.src = PORTRAIT(pid);
      face.alt = scene.npcName || '';
    } else { face.hidden = true; face.removeAttribute('src'); }

    // 正文
    $('story-title').textContent = scene.title || '';
    $('story-text').innerHTML = richText(scene.text || '');
    $('story-body').scrollTop = 0;

    $('story-skip').hidden = !(storyIsIntro || scene.kind === 'intro');

    // 触发条件：告诉玩家这段为什么现在发生
    const condEl = $('story-cond');
    const desc = scene.when && window.GAME_STORY
      ? window.GAME_STORY.describeWhen(S, scene.when) : '';
    if (desc) { condEl.textContent = '触发：' + desc; condEl.hidden = false; }
    else { condEl.hidden = true; }

    // 选项
    renderChoices(scene.options, (o, i) => onStoryChoice(scene, o, i));

    storyLayer(true);
    // 渲染完再定位，尺寸才准
    requestAnimationFrame(() => placePanel(scene));
  }

  function renderChoices(options, onPick) {
    const wrap = $('story-choices');
    wrap.innerHTML = '';
    const opts = (options || []).length ? options : [{ label: '继续' }];
    opts.forEach((o, i) => {
      const b = document.createElement('button');
      b.className = 'story-choice';
      b.type = 'button';
      b.innerHTML = opts.length > 1
        ? '<span class="num">' + (i + 1) + '</span>' + esc(o.label)
        : esc(o.label);
      b.onclick = () => onPick(o, i);
      wrap.appendChild(b);
    });
    $('story-hint').hidden = opts.length > 1;
  }

  function onStoryChoice(scene, opt, i) {
    if (scene.kind === 'intro') {
      S.introDone = S.introDone || {};
      S.introDone[scene.id] = 1;
      S.storyFlags = S.storyFlags || {};
      if (opt.flag) S.storyFlags[opt.flag] = 1;
      const lines = [];
      if (opt.run && E.applyEffectPublic) E.applyEffectPublic(S, opt.run, lines);
      renderAll();
      advanceStory();
      return;
    }

    // 正式剧情：交给引擎结算
    const r = E.resolveStory(S, scene, i);
    renderAll();

    // 结果接在正文后面，读起来是一段事的收尾，而不是一条系统提示
    if (opt.after) {
      const cur = $('story-text').textContent;
      $('story-text').textContent = cur + '\n\n' + opt.after;
      $('story-body').scrollTop = $('story-body').scrollHeight;
    } else if (r.ok && r.lines && r.lines.length) {
      $('story-text').textContent = ($('story-text').textContent) + '\n\n' + r.lines.join('\n');
      $('story-body').scrollTop = $('story-body').scrollHeight;
    }

    renderChoices([{ label: storyQueue.length ? '继续' : '回到牌局' }], () => advanceStory());
    requestAnimationFrame(() => placePanel(scene));
  }

  function advanceStory() {
    if (storyQueue.length) { showStory(storyQueue.shift()); return; }
    storyLayer(false);
    renderAll();
    if (S.phase === 'end' && S.ending) showEnd();
    if (storyDone) { const d = storyDone; storyDone = null; d(); }
  }

  /* 把引擎推来的一条剧情放进队列并播出 */
  function queueStory(scene) {
    storyQueue.push(scene);
    const el = $('story-layer');
    if (!el || el.hidden) showStory(storyQueue.shift());
  }

  /* ==========================================================
     事件弹窗（非剧情类：每日随机事件）
     ========================================================== */
  function showEvent(ev) {
    if (ev && ev.story) { queueStory(ev); return; }
    showEventModal(ev);
  }

  function showEventModal(ev) {
    const isStory = !!ev.story;
    const d = ev.district ? M.districtById(ev.district) : null;

    // 标签行：区分主线、初见、个人支线、普通事件
    const tag = $('ev-dist');
    if (isStory && ev.kind === 'main') {
      tag.innerHTML = '<span class="tag-main">主线 · 第 ' + ev.act + ' 幕 ' + esc(ev.actName || '') + '</span>';
    } else if (isStory && ev.kind === 'approval') {
      tag.innerHTML = '<span class="tag-approve">认可 · ' + esc(ev.npcName || '') + '</span>';
    } else if (isStory && ev.kind === 'meet') {
      tag.innerHTML = '<span class="tag-meet">初见 · ' + esc(ev.npcName || '') +
        (ev.npcRole ? ' · ' + esc(ev.npcRole) : '') + '</span>';
    } else if (isStory) {
      tag.innerHTML = '<span class="tag-line">' + esc(ev.npcName || '') + ' 的故事 · 第 ' + (ev.stage || 1) + ' 段</span>';
    } else {
      tag.textContent = d ? d.name : '事件';
    }

    $('ev-title').textContent = ev.title;
    $('ev-text').textContent = ev.text;

    const img = $('ev-portrait');
    const fb = ev.portrait ? (FALLBACK[ev.portrait] || null) : null;
    img.onerror = fb ? function () { this.onerror = null; this.src = PORTRAIT(fb); }
                     : function () { this.style.visibility = 'hidden'; };
    img.style.visibility = 'visible';
    img.src = ev.portrait ? PORTRAIT(ev.portrait) : '';
    img.alt = ev.portrait || '';
    img.hidden = !ev.portrait;

    const wrap = $('ev-options');
    wrap.innerHTML = '';
    ev.options.forEach((o, i) => {
      const b = document.createElement('button');
      b.className = 'ev-opt';
      b.textContent = o.label;
      b.onclick = () => {
        const r = isStory ? E.resolveStory(S, ev, i) : E.resolveEvent(S, i);
        // 初见事件要登记认识的人
        if (!isStory && ev.isMeet && ev.npc && window.GAME_STORY) {
          window.GAME_STORY.markMet(S, ev.npc);
        }
        show('screen-game');
        renderAll();
        if (r.ok) {
          /* 先看数值，再看后来发生了什么。有 after 就多一屏。 */
          showResult(isStory ? (ev.kind === 'main' ? '主线推进' : '关系推进') : '结果', r.lines, null, r.after);
        }
        if (S.phase === 'end' && S.ending) { try { if (SV) SV.clear(); } catch (e) {} showEnd(); }
        else autosave();
      };
      wrap.appendChild(b);
    });
    show('screen-event');
  }

  /* ==========================================================
     弹窗
     ========================================================== */
  function showResult(title, lines, ok, after) {
    $('res-body').innerHTML =
      '<div class="res-big" style="color:' + (ok === true ? 'var(--ok)' : ok === false ? 'var(--red)' : 'var(--cyan)') + '">' + esc(title) + '</div>' +
      lines.map((l) => {
        const cls = /失败|崩盘|超期|还差/.test(l) ? 'fail' : (/成功|完成|^\+/.test(l) ? 'ok' : '');
        return '<div class="res-line ' + cls + '">' + esc(l) + '</div>';
      }).join('') +
      (after ? '<div class="res-after"><div class="res-after-t">后来</div>' +
        '<p class="res-after-x">' + esc(after) + '</p></div>' : '');
    show('screen-result');
  }
  function toast(title, msg) { showResult(title, [msg], null); }

  /* ==========================================================
     终局
     ========================================================== */
  function showEnd() {
    const e = S.ending;
    $('end-title').textContent = e.name;
    $('end-text').textContent = e.text;
    const bits = [
      '出身 ' + S.origin.name, '种子 ' + S.seedLabel, '存活 ' + S.day + ' 天', '折牌 ' + S.folded + '/12',
      '忠诚 ' + S.tracks.loyalty, '声望 ' + S.tracks.renown,
      '罪痕 ' + S.tracks.sin, '权柄 ' + S.tracks.power,
      '委托完成 ' + (S.briefDone || 0), '委托超期 ' + (S.briefExpired || 0),
      '遇见 ' + Object.keys(S.metNpcs || {}).length + ' 人',
    ];
    $('end-summary').innerHTML = bits.map((b) => '<span>' + esc(b) + '</span>').join('');
    if (!settled) settled = MET.settle(P, S);

    // 后日谈：世界在你之后变成了什么样
    const after = (window.AFTERSTORY || {})[e.id];
    const box = $('end-after');
    if (after) { $('end-after-text').textContent = after; box.hidden = false; }
    else { box.hidden = true; }

    $('end-points').textContent = '+' + settled.earned;
    $('end-total').textContent = settled.total;

    /* 结算明细：这一局每项表现各换了多少命运点，逐条摊开。
       以前只有一个总数，玩家不知道钱是怎么来的。 */
    const rows = settled.rows || (settled.run && settled.run.rows) || [];
    const rb = $('end-breakdown');
    if (rb) {
      if (rows.length) {
        rb.innerHTML = rows.map((r) => {
          const cls = r.value < 0 ? 'neg' : '';
          return '<div class="eb-row ' + cls + '">' +
            '<span class="eb-l">' + esc(r.label) + '</span>' +
            '<span class="eb-n">' + esc(r.note || '') + '</span>' +
            '<b class="eb-v">' + (r.value > 0 ? '+' : '') + r.value + '</b>' +
          '</div>';
        }).join('') + '<div class="eb-row eb-sum"><span class="eb-l">合计</span>' +
          '<span class="eb-n"></span><b class="eb-v">+' + settled.earned + '</b></div>';
        rb.hidden = false;
      } else { rb.hidden = true; rb.innerHTML = ''; }
    }
    show('screen-end');
  }

  function report() {
    if (!S || !S.ending) return '';
    return [
      '《七日指令》战报',
      '结局：' + S.ending.name,
      '种子：' + S.seedLabel,
      '出身：' + S.origin.name,
      '存活：' + S.day + ' 天',
      '折牌：' + S.folded + '/12',
      '忠诚 ' + S.tracks.loyalty + ' / 声望 ' + S.tracks.renown + ' / 罪痕 ' + S.tracks.sin + ' / 权柄 ' + S.tracks.power,
      '委托：完成 ' + (S.briefDone || 0) + '，超期 ' + (S.briefExpired || 0),
      '本局命运点：+' + (settled ? settled.earned : S.fortune),
    ].join('\n');
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* 音效：浏览器要求 AudioContext 在用户手势之后才能启动，
     所以第一次点任意按钮时顺手 init 一次，之后一路可用。
     拿不到就静默 —— 音效永远不该影响能不能玩。 */
  function sfx(name) {
    try { if (AU) AU.play(name); } catch (e) { /* 静默 */ }
  }
  function armAudio() {
    try { if (AU && !AU.ready()) AU.init(); } catch (e) { /* 静默 */ }
  }
  document.addEventListener('pointerdown', armAudio, { once: true });
  document.addEventListener('keydown', armAudio, { once: true });

  /* ==========================================================
     绑定
     ========================================================== */
  $('btn-play').onclick = gotoOrigin;
  $('btn-resume').onclick = resumeRun;
  $('btn-howto').onclick = () => show('screen-howto');
  $('btn-compendium').onclick = openCompendium;

  /* 音效与 BGM 两个开关，状态各自写进 localStorage，刷新后保持。
     分开是有意的：有人只想关音乐，留着折牌与判定的音效反馈。 */
  function renderAudioBtn() {
    const b = $('btn-audio');
    if (b) {
      const on = AU ? AU.enabled() : false;
      b.classList.toggle('off', !on);
      b.textContent = on ? '♪ 音效' : '♪ 已关';
    }
    const m = $('btn-bgm');
    if (m) {
      const on = AU ? AU.bgmEnabled() : false;
      m.classList.toggle('off', !on);
      m.textContent = on ? '♫ 音乐' : '♫ 已关';
    }
  }
  $('btn-audio').onclick = () => {
    armAudio();
    if (AU) AU.toggle();
    renderAudioBtn();
    if (AU && AU.enabled()) sfx('gain');
  };
  $('btn-bgm').onclick = () => {
    armAudio();
    if (AU) AU.bgmToggle();
    renderAudioBtn();
    if (AU && AU.bgmEnabled()) sfx('gain');
  };
  renderAudioBtn();

  /* ==========================================================
     键盘
     桌面端全靠鼠标太慢。只绑最常用的几个，不抢输入框的键。
     ========================================================== */
  function typing(e) {
    const t = e.target;
    if (!t) return false;
    const tag = (t.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || t.isContentEditable;
  }

  document.addEventListener('keydown', (e) => {
    if (typing(e)) return;
    const gameOn = document.getElementById('screen-game').classList.contains('active');
    const storyOn = !document.getElementById('story-layer').hidden;

    /* Esc：先关剧情层，再关抽屉，最后取消选中 */
    if (e.key === 'Escape') {
      if (storyOn) { return; }             // 剧情层必须选完，不给 Esc 逃
      if (isDrawerOpen()) { closeDrawer(); return; }
      if (selectedUid) {
        selectedUid = null;
        M.setSelected(null);
        renderHand();
        M.drawGuide(S);
      }
      return;
    }

    if (!gameOn || storyOn || !S || S.phase === 'end') return;

    /* 1-9 选牌。注意这里不能只 renderHand：引线是在 syncNodes 里画的，
       不走一遍地图层的刷新，线就不会出现。 */
    if (/^[1-9]$/.test(e.key)) {
      const i = parseInt(e.key, 10) - 1;
      if (S.hand[i]) {
        selectedUid = S.hand[i].uid;
        M.setSelected(selectedUid);
        renderHand();
        M.drawGuide(S);
        sfx('hover');
      }
      return;
    }

    /* Enter：把选中的牌投出去 */
    if (e.key === 'Enter' && selectedUid) {
      const c = S.hand.find((x) => x.uid === selectedUid);
      const t = c ? E.assetOf(c.target) : null;
      if (t && t.district) onDrop(selectedUid, t.district, false);
      else toast('牌上没有目标', '这张牌暂时没有可投放的地点。');
      return;
    }

    /* 空格：结束这一天 */
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      onEndDay();
      return;
    }

    /* 面板快捷键 */
    /* 行动已经挂到地点上，不再有全局的 a 键；其余三个保留 */
    const map = { t: 'tracks', p: 'people', l: 'log' };
    const k = String(e.key).toLowerCase();
    if (map[k]) {
      if (isDrawerOpen() && drawerOpen === map[k]) closeDrawer();
      else openDrawer(map[k]);
    }
  });
  $('cp-back').onclick = () => { show('screen-home'); renderHome(); };
  $('howto-close').onclick = () => show('screen-home');
  $('btn-nexus').onclick = () => { renderNexus(); show('screen-nexus'); };
  $('nx-back').onclick = () => { show('screen-home'); renderHome(); };
  $('nx-refund').onclick = onRefund;
  $('origin-back').onclick = () => show('screen-home');
  $('btn-quit').onclick = quitToHome;
  $('btn-tutorial').onclick = () => show('screen-howto');
  $('btn-briefs').onclick = () => { if (!S) return; renderBriefs(); show('screen-briefs'); };
  $('briefs-back').onclick = () => { show('screen-game'); renderAll(); };
  $('btn-seed-rand').onclick = () => {
    const rng = RNG.create(String(Date.now()) + Math.random());
    $('seed-input').value = rng.label;
  };
  $('btn-again').onclick = () => { S = null; settled = null; gotoOrigin(); };
  $('btn-nexus2').onclick = () => { S = null; settled = null; renderNexus(); show('screen-nexus'); };
  $('btn-copy').onclick = () => {
    const t = report();
    if (!t) return;
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => toast('已复制', ['战报已复制。']), () => {});
    else window.prompt('复制战报：', t);
  };
  $('btn-res-ok').onclick = () => {
    show('screen-game');
    if (pendingEvent) { const ev = pendingEvent; pendingEvent = null; setTimeout(() => showEvent(ev), 60); }
  };
  $('dt-close').onclick = () => closeDrawer();
  $('drawer-close').onclick = closeDrawer;
  $('btn-endday').onclick = onEndDay;
  document.querySelectorAll('.rail-btn').forEach((b) => { b.onclick = () => openDrawer(b.dataset.panel); });
  document.querySelectorAll('.screen.overlay').forEach((s) => {
    s.addEventListener('click', (e) => {
      if (e.target === s && s.id !== 'screen-end' && s.id !== 'screen-result') {
        show(S ? 'screen-game' : 'screen-home');
      }
    });
  });

  const bg = $('map-bg');
  bg.onerror = () => bg.classList.add('missing');

  renderOrigins();
  renderHome();
  window.__GAME = {
    get state() { return S; },
    engine: E, data: D, map: M, meta: MET, briefs: B, rng: RNG,
    get profile() { return P; },
    renderAll: () => renderAll(),
  };
})();
