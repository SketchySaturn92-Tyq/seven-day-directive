/* 自动生成，请勿直接编辑。改 game/ 下的源码后运行 ./build.sh */
/* 生成时间: 2026-09-29T09:23:54Z */

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
    statCap: 10,
    trackCap: 12,
    swapCost: 2,            // 换牌消耗行动点
    version: '1.0.0',
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
      desc: '花 30 信用点买通关系，洗掉一层罪痕。',
      run: {},
    },
  ];

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
  const SHOP = [
    { id: 's_stat', name: '强化疗程', cost: 6, desc: '永久 +1 随机属性', run: { statRandom: 1 } },
    { id: 's_money', name: '洗白一批资金', cost: 4, desc: '+60 信用点', run: { money: 60 } },
    { id: 's_intel', name: '买断一份档案', cost: 4, desc: '+5 情报，并揭示全部资产', run: { intel: 5, reveal: true } },
    { id: 's_gear', name: '定制义体', cost: 8, desc: '+2 装备战力', run: { gear: 2 } },
    { id: 's_loyal', name: '替董事会擦一次手', cost: 7, desc: '忠诚 +3，罪痕 -2', run: { track: { loyalty: 3, sin: -2 } } },
    { id: 's_renown', name: '买一次头版', cost: 7, desc: '声望 +3，忠诚 -1', run: { track: { renown: 3, loyalty: -1 } } },
    { id: 's_power', name: '收编一支安保队', cost: 9, desc: '权柄 +3，罪痕 +1', run: { track: { power: 3, sin: 1 } } },
    { id: 's_days', name: '延期一次（重置期限）', cost: 10, desc: '倒计时重置为 7 天', run: { resetDeadline: true } },
  ];

  /* ---------------- 终局判定 ---------------- */
  const ENDINGS = [
    {
      id: 'sultan', name: '新的苏丹',
      cond: (s) => s.tracks.power >= 9 && s.tracks.sin >= 8 && s.tracks.loyalty < 6,
      text: '第十二张牌折下时，厅里的光暗了一瞬。没有人宣布什么，但你站起来的时候，所有人也跟着站起来了。董事的位置空着，你坐下去，尺寸刚好。窗外，穹顶上又下起了雨。',
    },
    {
      id: 'dog', name: '忠犬归位',
      cond: (s) => s.tracks.loyalty >= 9 && s.tracks.power < 8,
      text: '你把最后一张牌按在桌上，折得整整齐齐。董事会为你鼓了掌，很轻，像在夸奖一件工具保养得好。你被留了下来，也仅是被留了下来。',
    },
    {
      id: 'hero', name: '脏手的善人',
      cond: (s) => s.tracks.renown >= 8 && s.tracks.sin <= 3,
      text: '你折完牌，把那对代码臂卸在董事会桌上。档案里你叫「可回收」，从今天起不是了。下层的人后来在穹顶边缘给你立了一块没有名字的碑。',
    },
    {
      id: 'ghost_out', name: '幽灵离场',
      cond: (s) => s.tracks.sin <= 2 && s.tracks.renown < 5,
      text: '最后一天，没有告别的仪式。你在系统里删掉了自己的编号，穿过轨道港的侧门，头也不回。没有人追。奇怪的是，这比死更像一场胜利。',
    },
    {
      id: 'purged', name: '被回收',
      cond: (s) => s.tracks.sin >= 10,
      text: '你以为罪痕是勋章，其实那是编号。某一个清晨，你的门禁失效、账户清零、名字从系统里消失，连葬礼都省了。归档结论只有一行：「已回收」。',
    },
    {
      id: 'broken', name: '三十六层高的自由落体',
      cond: (s) => s.tracks.loyalty <= 0,
      text: '董事会不再需要你了。你被请进一间没有窗的会客室，对面的人一直在笑，笑到你不想再问下去。关于你的最后一条公开记录，是一次「自愿退出」。',
    },
    {
      id: 'emperor', name: '穹顶之上的名字',
      cond: (s) => s.tracks.power >= 10 && s.tracks.sin <= 6,
      text: '十二张牌，你折得干净漂亮。新签署的章程里，你的名字第一次出现在封面，而不是附录。穹顶的雨现在按你的规则落下来。',
    },
    {
      id: 'survivor', name: '活着就好',
      cond: () => true,
      text: '第十二张牌折下，你只是活着。在这里活着已经算一种功绩。你回到自己的椅子上，喝掉那杯已经凉透的茶，等下一场牌局发到你手上。',
    },
  ];

  return { CONFIG, DISTRICTS, PATHS, TIERS, STATS, TRACKS, ORIGINS, ASSETS, ACTIONS, EVENTS, SHOP, ENDINGS };
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
    { id: 'w1', name: '账本之外', cond: (s) => s.tracks.power >= 9 && s.tracks.renown >= 9 && s.tracks.sin <= 3,
      text: '你折完最后一张牌，然后把那本记着所有人的账，原样放回桌上。没有人拦你，因为你已经不需要被拦。你走出高塔，电梯这次没有停。街上的雨还在下，落在你肩上是凉的，你第一次觉得凉也是种证明。清算行连夜改了报价，把「执行人」这一栏删掉了。有人在广场上贴了一张纸，上面写着你的名字，第二天就被雨泡烂了，但你确实看见过。' },
    // 近似：文档依赖「与程砚关系」，系统暂无关系值，退化为折完全部 12 张牌且声望与权柄中上。
    { id: 'w2', name: '替她签收', cond: (s) => s.tracks.power >= 8 && s.tracks.sin >= 5 && s.tracks.renown < 8,
      text: '签收栏终于有了字。程砚看了很久，然后把笔递回给你，说：谢谢。那件东西完成后没有造成任何事，它只是安静地待在下面，等着被需要的那一天。你回到自己的办公室，发现桌上多了一份新指令，编号是空的。你把笔放好，坐下，等着第一个告诉你要怎么做的人。窗外，穹顶内侧的雾照旧。你替所有人签了一个名字。' },
    // 近似：文档依赖「与潮结盟」关系，系统暂无关系值，退化为忠诚跌破阈值的通关条件。
    { id: 'w3', name: '雨落进来', cond: (s) => s.tracks.loyalty <= 2 && s.tracks.sin >= 4,
      text: '穹顶第 41 号接缝在你手上裂开的时候，没有警报，只有风。风里有酸味，还有人抬头。第一场雨落在下层居住区的前十七秒里，没有人跑，所有人都在伸手。你站在雨里，衣服很快就湿透，编号也在同一时间被系统抹去。后来他们管那天叫第二次灰潮，也管那天叫第一次放晴。两个名字都没错，都跟你没关系了。' },
    // 近似：文档条件为「通关，但罪痕 >= 7 且忠诚 <= 4」。
    { id: 'w4', name: '第十二名', cond: (s) => s.tracks.sin >= 9 && s.tracks.loyalty <= 5,
      text: '最后一张牌折下，董事会为你开了香槟。第三杯时，例会的主持人向你介绍了对面那位，说：这位是第十二号。你才想起来，这一局牌本来有十二个人在打，而现在只剩你和对面的他。你和他对视了三秒，然后一起笑了。桌面下，两把枪都没有拔。桌上又发下一副新牌，洗完以后，谁也不会知道刚才那副是谁洗的。' },
    // 近似：文档条件为「money <= 20 且 renown >= 6 且通关」，直接用钱与声望判定。
    { id: 'w5', name: '十八块钱的葬礼', cond: (s) => s.money <= 25 && s.tracks.renown >= 8,
      text: '你死的时候账户里剩下十八块。陆晚用这笔钱给你买了最便宜的骨灰盒，老鸦替你出了剩下的运费。来的人不多，但每一个都真的认识你。名单上你那一栏被划掉，括号里写着「非回收」。穹顶照旧下雨，落在你留下过名字的那条巷口，声音比落在别处轻一点。这算不上什么好结局，但它确实是你自己挣来的。' },
    // 近似：文档条件为「四轨全部落在中段，且通关」，中段取 4 到 8 的闭区间。
    { id: 'w6', name: '穹顶照着旧样子',
      cond: (s) => s.folded >= 12 && s.tracks.power >= 4 && s.tracks.power <= 8 && s.tracks.renown >= 4 && s.tracks.renown <= 8 && s.tracks.sin >= 4 && s.tracks.sin <= 8 && s.tracks.loyalty >= 4 && s.tracks.loyalty <= 8,
      text: '你没有变成谁的人，也没有把谁变成你的人。十二张牌，每一张都折得既不漂亮也不难看。散局那天，你回到工位，把那杯茶重新泡了一遍。穹顶还是那个穹顶，雨还是那场雨，穷人和富人都还在原来的位置上。有人问你，这七天你做了什么。你想了想，说：我什么都没改。然后你听见自己在心里补了一句——这在穹顶里，已经很难。' },
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
      cond: (s) => s.folded >= 12 && s.tracks.loyalty >= 10 && s.tracks.power >= 9
                && s.tracks.sin >= 8 && s.tracks.renown <= 6,
      kind: 'fake',
      text: '十二张牌，你一张不落地折完，每一张都折在最合适的位置上。董事会为你开了会，会上所有人都站起来鼓掌，主持人说你已经证明了中层可以有多可靠。散会前，他把一副新牌推回你面前，说：那就再来一局。你低头看那副牌，第一张的编号是你自己的工号。你笑着点头，把牌收进内袋。掌声又响了一次，比刚才更热烈。你忽然想不起来，上一次有人问你累不累是什么时候。',
    },

    /* ---------- 真好结局：不靠任何一方，把规则本身改掉 ---------- */
    {
      id: 'v2_true', name: '牌不再发下来',
      cond: (s) => s.folded >= 12 && s.tracks.renown >= 9 && s.tracks.sin <= 4 && s.tracks.power >= 9,
      kind: 'true',
      text: '你把最后一张牌折掉，然后没有把它放进回收格，而是塞进了董事会那台发牌机的进纸口。机器卡住了，先是停了一秒，然后吐出一整叠空白的卡。你抽出最上面那张，翻过来给所有人看——什么都没有印。会议室里安静了很久，久到有人先笑了。那天以后，穹顶集团再没有下发过指令卡。你走出高塔的时候雨还在下，但落在地面上是干净的，没有酸味。有人在广场上念了一段广播，说回收名单已经全部清空。你没听清念的是谁的名字，你只是继续往前走。',
    },

    /* ---------- 坏结局：活着通关，但已经不是原来那个人 ---------- */
    {
      id: 'v2_bad', name: '我认得这张脸吗',
      cond: (s) => s.folded >= 12 && s.tracks.sin >= 7 && s.tracks.renown <= 4 && s.tracks.power <= 6,
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
      text: '早会散得比平时快。苏纹在走廊拐角等你，手里抱着一叠日程表，最上面那张的收件人不是你。她把那张抽出来，换上另一张，动作快得像早就练过。「十二张，七天一张，折不出来就换人。」她说话的时候没看你，「上一副发出去的时候，也是这样交代的。」电梯到了，她先进去，按住门等你。',
      options: [
        { label: '问上一副牌是谁在用', relation: 2, run: { intel: 3 }, flag: 'ask_prev' },
        { label: '什么也不问，跟上电梯', relation: 1, run: { track: { loyalty: 1 } } },
        { label: '把日程表还给她，说这不归我管', relation: -1, run: { track: { power: 1, loyalty: -1 } } },
      ],
    },
    {
      id: 'm-act1-2',
      act: 1, order: 2,
      npc: 'su-wen',
      district: 'tower',
      title: '苏纹：一个已经清空的名录',
      when: { minFolded: 2 },
      text: '夜里十一点，苏纹把一份名录推到你面前。十七个名字，全部划了横线，最后一栏统一写着「已回收」。备注列里只有一行字：均由本人自愿申请。她把手指压在最下面那个名字上——那行没被划掉，因为墨还没干。「这个人今天还在。」她说，「你要不要记住他？」',
      options: [
        { label: '记住这个名字', relation: 2, run: { intel: 3 }, flag: 'know_name' },
        { label: '问她这十七个人是谁签的', relation: 1, run: { intel: 2, track: { sin: 1 } } },
        { label: '把名录推回去', relation: -1, run: { track: { loyalty: 1 } } },
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
      text: '苏纹在茶水间堵住你，手里那杯咖啡已经凉了。「按流程，活过第一个周期的人要更新一次档案。」她把终端转过来给你看，照片是你入职那天拍的，比现在瘦。「上面问我，你是不是可以往下走。」她顿了一下，「我填的是可以。你要是想改，现在还能改。」',
      options: [
        { label: '不用改，继续', relation: 2, run: { track: { loyalty: 1, power: 1 } }, flag: 'kept_going' },
        { label: '问她能不能把我从名单里删掉', relation: 1, run: { intel: 2, track: { sin: 1 } } },
        { label: '自己动手改那份档案', relation: -1, run: { statRandom: 1, track: { sin: 2, loyalty: -1 } } },
      ],
    },
    {
      id: 'm-act2-2',
      act: 2, order: 2,
      npc: 'wen-duo',
      district: 'tower',
      title: '闻铎：一次没有预告的例行访问',
      when: { minFolded: 4 },
      text: '你没有约过这场会面。闻铎坐在你工位对面，桌上放着一本很薄的手册，封面什么都没写。他翻到中间，那一页夹着一张你的门禁记录复印件，时间是上周四凌晨两点十一分。「例行核对。」他说，「顺便问一句——那天你去三十三层做什么？」走廊的灯正好暗了一格。',
      options: [
        { label: '如实说明那晚的去向', relation: 2, run: { track: { loyalty: 2, renown: -1 } }, flag: 'told_truth' },
        { label: '反问他手上那份记录从哪来的', relation: 1, run: { intel: 3, track: { loyalty: -1 } } },
        { label: '说记不清了', relation: -1, run: { track: { sin: 1, loyalty: -1 } } },
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
      text: '苏纹没有进你的办公室，站在门口就把话说完了。她的排期表被调走过一次，回来时多了三处标注，全是她替你改过时间的记录。「我不怕被查，」她说，声音压得很低，「我怕他们顺着我的表，查到你哪天做了什么。」她把一份新的排期表塞给你，上面有几个时段是空的，空得不像她排的。',
      options: [
        { label: '按她给的排期走', relation: 3, run: { intel: 3, track: { loyalty: -1, sin: 1 } }, flag: 'trusted_su' },
        { label: '把排期表退回去，让她别管', relation: -1, run: { track: { loyalty: 2, renown: 1 } } },
        { label: '留下表，但记下哪几处是她改的', relation: 1, run: { intel: 4, track: { sin: 1 } } },
      ],
    },
    {
      id: 'm-act3-2',
      act: 3, order: 2,
      npc: 'su-wen',
      district: 'tower',
      title: '苏纹：她第一次把私人的东西拿出来',
      when: { minFolded: 7, minRel: 3 },
      text: '她给你的是一个纸质笔记本，边角磨白了。前十几页是会议记录，后面几十页是手写的名字，每一个后面都跟着日期，日期后面什么都没写。「我在这张椅子上坐了六年，」她说，「我一直以为我是在排日程。上个月我才想明白，我在排的是顺序。」她把本子推过来，没有松手，等你先接。',
      options: [
        { label: '接过本子', relation: 3, run: { intel: 4, track: { sin: 1 } }, flag: 'has_ledger' },
        { label: '让她自己留着', relation: 1, run: { track: { loyalty: 1 }, statRandom: 1 } },
        { label: '问她愿不愿意把本子交出去', relation: -1, run: { track: { loyalty: 2, renown: -1 } } },
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
      text: '银面在你必经的路上等了很久，久到鞋面上的水已经干了。她递给你一张卡，正面空白，反面印着一个不存在的编号。「这张不在你的牌堆里，」她说，「但它在结算表上。」她歪了歪头，像是在听什么你没听见的声音，「你们发牌的时候，好像忘了一件事——牌也会数人。」雨滴穿过她影子的边缘，落在地上。',
      options: [
        { label: '收下这张牌', relation: 2, run: { intel: 4, chips: 2, track: { sin: 1 } }, flag: 'blank_card' },
        { label: '当场把它撕掉', relation: -1, run: { track: { loyalty: 2, renown: 1 } } },
        { label: '问她是谁派她来的', relation: 1, run: { intel: 3, track: { power: 1 } } },
      ],
    },
    {
      id: 'm-act4-2',
      act: 4, order: 2,
      npc: 'su-wen',
      district: 'tower',
      title: '苏纹：把你的名字从流程里拿掉',
      when: { minFolded: 10 },
      text: '凌晨三点，苏纹在她的工位上，屏幕上开着三份不同的排期表。她调出一份权限申请，把「执行人」那一栏填成空白，然后停下来看你。「从这里往下走，要么你变成写流程的人，要么你继续当被流程处理的人。」她把光标停在保存键上，「我只有一次机会做这件事。你说存还是不存。」',
      options: [
        { label: '让她存', relation: 3, run: { track: { power: 2, loyalty: -2, sin: 1 } }, flag: 'out_of_flow' },
        { label: '让她删掉这份申请', relation: -1, run: { track: { loyalty: 2 }, intel: 2 } },
        { label: '问她自己想不想存', relation: 2, run: { intel: 3, track: { renown: 1 } } },
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
      text: '十二张牌全部折下，会议室里只剩下你和苏纹。她把牌收拾好，一张张摞齐，动作比平时慢。「按流程，我现在要去系统里关掉这一局。」她说，「关掉以后，我不再是你的日程官，你也不再是执行人。我们可以不用再装了。」她把终端转过来，屏幕上是那行「结案」按钮，光标闪着。「你想怎么结束？」',
      options: [
        { label: '让她按下结案，回到原来的位置', relation: 1, run: { track: { loyalty: 2, power: 1 } } },
        { label: '自己接过终端，把整份流程删掉', relation: 3, run: { track: { renown: 2, sin: 2, loyalty: -2 } }, flag: 'broke_flow' },
        { label: '请她一起离开这栋楼', relation: 2, run: { track: { renown: 3, loyalty: -2 } }, flag: 'left_together' },
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
        { label: '把那天的时间报给他', relation: 2, run: { intel: 2, track: { loyalty: 1 } }, flag: 'wd_told_time' },
        { label: '反问他为什么查三十三层', relation: 1, run: { intel: 3, track: { loyalty: -1 } } },
        { label: '说那晚我没去过那里', relation: -2, run: { track: { sin: 1, loyalty: 1 } } },
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
        { label: '帮他把涂掉的名字补上', relation: 3, run: { intel: 3, track: { loyalty: -1, power: 1 } }, flag: 'wd_helped' },
        { label: '问他拿什么换这份确认', relation: 0, run: { money: 50, track: { sin: 1, loyalty: -1 } } },
        { label: '把档案袋原样推回去', relation: -2, run: { track: { loyalty: 2, power: -1 } } },
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
        { label: '签字，站在他这一边', relation: 3, run: { intel: 4, track: { power: 2, sin: 1 } }, flag: 'wd_witness' },
        { label: '不签，把文件交回监事会', relation: -2, run: { track: { loyalty: 3, power: 1 } }, flag: 'wd_reported' },
        { label: '签，把复印件留给灰市', relation: 0, run: { money: 60, track: { sin: 2, renown: -1 } }, flag: 'wd_leak' },
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
        { label: '问她是谁替我留的时间', relation: 2, run: { intel: 3 }, flag: 'sw_asked' },
        { label: '道谢，什么都不多问', relation: 1, run: { track: { loyalty: 1 } } },
        { label: '说这个时间我不会来', relation: -1, run: { track: { power: 1 } } },
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
        { label: '去，并让她留一份记录', relation: 3, run: { intel: 2, track: { loyalty: 1, power: 1 } }, flag: 'sw_kept_slot' },
        { label: '让她把表改回原样', relation: -1, run: { track: { loyalty: 1, power: -1 } } },
        { label: '问那个被擦掉的人是谁', relation: 2, run: { intel: 4, track: { sin: 1 } } },
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
        { label: '把空档填上她的名字', relation: 3, run: { intel: 3, track: { loyalty: 1, power: 2 } }, flag: 'sw_saved_her' },
        { label: '交回董事会，写明三个空档', relation: -2, run: { track: { loyalty: 3, renown: -1 } }, flag: 'sw_handed' },
        { label: '什么都不填，把表撕了', relation: 1, run: { track: { sin: 1, renown: 1 } } },
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
        { label: '圈出来，照着实话说明', relation: 2, run: { track: { loyalty: 2 } }, flag: 'yn_honest' },
        { label: '问她这行到底是谁填的', relation: 1, run: { intel: 3, track: { loyalty: -1 } } },
        { label: '说这不是我的部门编号', relation: -2, run: { track: { sin: 1 } } },
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
        { label: '帮她核销，先问清缘由', relation: 2, run: { money: 55, intel: 2, track: { sin: 1 } } },
        { label: '按流程把坏账上报', relation: -2, run: { track: { loyalty: 2, renown: 1 } } },
        { label: '要她先说清和这人的关系', relation: 1, run: { intel: 4, track: { sin: 1 } } },
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
        { label: '签第二个名字，替她平账', relation: 3, run: { money: 70, track: { sin: 2, power: 1 } }, flag: 'yn_covered' },
        { label: '不签，把调整单交给监事会', relation: -2, run: { track: { loyalty: 3, power: -1 } }, flag: 'yn_reported' },
        { label: '签，但把原件复印一份', relation: 1, run: { intel: 4, track: { sin: 1, renown: -1 } }, flag: 'yn_copy' },
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
        { label: '签，并问这一刀砍到谁', relation: 2, run: { money: 25, intel: 2, track: { loyalty: 1 } } },
        { label: '要求先看完整本底稿', relation: 1, run: { intel: 3, track: { loyalty: -1 } } },
        { label: '直接拒签，退回底稿', relation: -2, run: { track: { renown: 2, loyalty: -1 } } },
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
        { label: '把副本给他，替他兜住', relation: 3, run: { intel: 2, track: { sin: 1 } } },
        { label: '告诉他副本早就不在了', relation: -1, run: { track: { loyalty: 1 } } },
        { label: '问他要拿什么换这份副本', relation: 0, run: { money: 50, track: { sin: 1, power: 1 } } },
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
        { label: '把申请撤掉，替他担半份', relation: 3, run: { track: { renown: 2, loyalty: -1, power: 1 } }, flag: 'ds_covered' },
        { label: '照流程签掉，这才合规', relation: -2, run: { track: { loyalty: 3, sin: 1 } }, flag: 'ds_signed' },
        { label: '把申请和例外清单寄出去', relation: 0, run: { track: { renown: -2, sin: 1, power: 1 } }, flag: 'ds_leak' },
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
        { label: '补齐表格，扫码栏留空', relation: 2, run: { intel: 2, gear: 1 } },
        { label: '追问这十一支去了哪', relation: 1, run: { intel: 3, track: { sin: 1 } } },
        { label: '不接这张表，让她找别人', relation: -2, run: { track: { loyalty: 1, power: -1 } } },
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
        { label: '替她把这一行抹掉', relation: 2, run: { gear: 1, track: { sin: 2, power: 1 } } },
        { label: '不抹，先查这人去了哪', relation: 0, run: { intel: 4, track: { renown: 1, sin: -1 } } },
        { label: '把名册原样交回伦理组', relation: -2, run: { track: { loyalty: 2, renown: 1 } } },
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
        { label: '签字接收，站到她这边', relation: 3, run: { gear: 1, intel: 3, track: { sin: 1, power: 2 } }, flag: 'cy_signed' },
        { label: '不签，把签收单上报董事会', relation: -2, run: { track: { loyalty: 3, renown: 1 } }, flag: 'cy_reported' },
        { label: '签，但先把数据拷一份', relation: 0, run: { intel: 4, track: { sin: 2 } }, flag: 'cy_backup' },
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
        { label: '补签，先把事情压下去', relation: 2, run: { track: { power: 1, sin: 1 } } },
        { label: '问他是谁动了系统', relation: 1, run: { intel: 3, track: { loyalty: -1 } } },
        { label: '不在任何单子上签字', relation: -2, run: { track: { loyalty: 2, power: -1 } } },
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
        { label: '给授权，帮他把记录抹掉', relation: 2, run: { gear: 1, track: { sin: 2 } } },
        { label: '不授权，让他向上面解释', relation: -1, run: { track: { loyalty: 2, renown: 1 } } },
        { label: '授权，要他记下谁下指令', relation: 1, run: { intel: 4, track: { sin: 1, power: 1 } } },
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
        { label: '站他这边，这道门不开', relation: 3, run: { track: { renown: 2, loyalty: -1, power: 1 } }, flag: 'pj_refused' },
        { label: '替他开门，记录算我头上', relation: 1, run: { intel: 2, track: { sin: 2, loyalty: 1 } } },
        { label: '按确认，上报他拒令', relation: -2, run: { track: { loyalty: 3, renown: -1 } }, flag: 'pj_reported' },
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
        { label: '认下这一行，问他图什么', relation: 2, run: { money: 20, intel: 2, track: { sin: 1 } } },
        { label: '把账本还他，这行不认', relation: -1, run: { track: { loyalty: 1, renown: 1 } } },
        { label: '问他这一行值多少', relation: 0, run: { money: 35, track: { sin: 1 } } },
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
        { label: '按暂停，帮他把人留下', relation: 3, run: { track: { renown: 2, sin: 1, loyalty: -1 } }, flag: 'ly_saved' },
        { label: '不管这事，名单照走', relation: -2, run: { track: { loyalty: 1, sin: 1 } }, flag: 'ly_dropped' },
        { label: '按暂停，让他欠我一条', relation: 1, run: { intel: 3, track: { power: 1, sin: 1 } } },
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
        { label: '让他撕，这份情我认下', relation: 3, run: { intel: 3, track: { renown: 1, sin: -1, power: 1 } }, flag: 'ly_tore' },
        { label: '把账本夺回来，规矩不能破', relation: -2, run: { track: { loyalty: 2, power: 1 } }, flag: 'ly_kept' },
        { label: '让他撕，但先抄一份页', relation: 1, run: { intel: 4, track: { sin: 1, renown: -1 } }, flag: 'ly_copied' },
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
        { label: '按单子来，把药钱付掉', relation: 2, run: { money: 45, track: { renown: 2, sin: -1 } } },
        { label: '问她为什么单记我一行', relation: 1, run: { intel: 3, track: { renown: 1 } } },
        { label: '拿走单子，药我自己弄', relation: -2, run: { track: { loyalty: 1, sin: 1 } } },
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
        { label: '帮她弄一份身份记录', relation: 3, run: { money: 35, track: { renown: 2, sin: 1, loyalty: -1 } }, flag: 'lw_made_id' },
        { label: '帮不了，这事风险太大', relation: -2, run: { track: { loyalty: 1, sin: -1 } } },
        { label: '先见这个人，再决定', relation: 1, run: { intel: 3, track: { renown: 1 } } },
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
        { label: '救制服那人，先问他是谁', relation: 0, run: { intel: 3, track: { loyalty: 2, renown: 1 } }, flag: 'lw_side_system' },
        { label: '救巷子那边，听她的', relation: 3, run: { track: { renown: 2, loyalty: -1, sin: 1 } }, flag: 'lw_side_out' },
        { label: '两边都不救，把人推走', relation: -2, run: { track: { renown: -1, sin: 1 } }, flag: 'lw_neutral' },
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
        { label: '当着工人的面替他说', relation: 2, run: { intel: 2, track: { renown: 1 } }, flag: 'tg_stood_up' },
        { label: '把单子收下，什么也不说', relation: 1, run: { intel: 2, track: { sin: 1 } } },
        { label: '说这不是你签的，转身走', relation: -1, run: { track: { loyalty: 1 } } },
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
        { label: '替他把两个工号藏进旧档案', relation: 3, run: { intel: 3, track: { sin: 2, renown: 1 } }, flag: 'tg_hid_roster' },
        { label: '劝他先把夜班撤下来', relation: 1, run: { intel: 2, track: { loyalty: 1 } } },
        { label: '说这局你插不了手', relation: -2, run: { track: { loyalty: 2 } } },
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
        { label: '站他这边，把名字接过来', relation: 3, run: { intel: 3, track: { renown: 2, sin: 1 } }, flag: 'tg_signed_with_him' },
        { label: '把名单交给董事会换复工', relation: -2, run: { money: 60, track: { loyalty: 2 } }, flag: 'tg_sold_out' },
        { label: '不拦他，也不接名单', relation: -1, run: { intel: 1, track: { sin: -1 } } },
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
        { label: '坐下，问她凭什么知道', relation: 2, run: { intel: 3 }, flag: 'ym_sat_down' },
        { label: '记下时间，先离开这里', relation: 0, run: { intel: 2, chips: 1 } },
        { label: '说这种把戏没人信', relation: -1, run: { track: { loyalty: 1 } } },
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
        { label: '接过单子，替她扛住这件事', relation: 3, run: { intel: 3, track: { sin: 2, power: 1 } }, flag: 'ym_took_slip' },
        { label: '不接，但帮她把签名比对清楚', relation: 1, run: { intel: 4, track: { sin: 1 } } },
        { label: '让她自己交上去，你只当没见过', relation: -2, run: { track: { loyalty: 2, renown: -1 } } },
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
        { label: '把话替她带出去，认下她', relation: 3, run: { intel: 3, track: { renown: 1, sin: 1 } }, flag: 'ym_spoke_for_her' },
        { label: '把单子交上去，摘清自己', relation: -2, run: { money: 50, track: { loyalty: 2 } }, flag: 'ym_reported' },
        { label: '把单子推回去，不接', relation: -1, run: { intel: 1, track: { sin: -1 } } },
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
        { label: '把票收下，去查闸机记录', relation: 2, run: { intel: 3 }, flag: 'ws_took_ticket' },
        { label: '让他自己走流程报备', relation: 0, run: { track: { loyalty: 1 } } },
        { label: '说这票跟我部门无关', relation: -1, run: { intel: 1 } },
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
        { label: '替他做一份备份名单', relation: 2, run: { intel: 3, chips: 1 }, flag: 'ws_backup' },
        { label: '劝他停手，先离港', relation: 1, run: { money: -40, track: { renown: 1 } } },
        { label: '把名单收走，按流程上交', relation: -2, run: { money: 45, track: { loyalty: 2, sin: 1 } } },
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
        { label: '用半张单换他上船', relation: 3, run: { intel: 4, track: { renown: 1, sin: 1 } }, flag: 'ws_sent_him_off' },
        { label: '把两半纸都交上去', relation: -2, run: { money: 55, track: { loyalty: 3 } }, flag: 'ws_handed_list' },
        { label: '不接单，让他自己走', relation: -1, run: { track: { sin: -1 } } },
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
        { label: '先问他这一趟跑了多久', relation: 2, run: { intel: 2, track: { renown: 1 } }, flag: 'yk_asked_him' },
        { label: '让他把密封袋交给你', relation: 0, run: { intel: 3, track: { sin: 1 } } },
        { label: '说接缝的事不该你管', relation: -2, run: { track: { loyalty: 1 } } },
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
        { label: '答应替他查那个工号', relation: 3, run: { intel: 3, track: { sin: 1, renown: 1 } }, flag: 'yk_promised' },
        { label: '说清你能帮的和不能帮的', relation: 1, run: { intel: 2 } },
        { label: '回绝，让他只传话就好', relation: -2, run: { track: { loyalty: 1 } } },
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
        { label: '收下工牌，替他压住', relation: 3, run: { intel: 3, track: { sin: 2 } }, flag: 'yk_kept_him' },
        { label: '上报，换他一条活路', relation: -1, run: { money: 50, track: { loyalty: 2, renown: -1 } }, flag: 'yk_reported_him' },
        { label: '两样都不收，让他自己选', relation: 0, run: { intel: 1 } },
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
        { label: '解释自己是来查编号的', relation: 2, run: { intel: 3 }, flag: 'xj_explained' },
        { label: '递上证件，请他照章记录', relation: 1, run: { track: { loyalty: 1 } } },
        { label: '不说话，转身离开', relation: 0, run: { intel: 1 } },
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
        { label: '让他按规程报，别自己扛', relation: 0, run: { track: { loyalty: 2, renown: -1 } } },
        { label: '让他先瞒，你去查那道痕', relation: 2, run: { intel: 4, track: { sin: 1 } }, flag: 'xj_covered' },
        { label: '说这不是你该管的', relation: -1, run: { track: { loyalty: 1 } } },
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
        { label: '替他把这道痕说成冻裂', relation: 3, run: { intel: 3, track: { sin: 2 } }, flag: 'xj_lied_for_him' },
        { label: '如实说，是有人磨的', relation: -1, run: { intel: 4, track: { loyalty: 2, renown: -1 } }, flag: 'xj_told_truth' },
        { label: '不答，让他自己去验', relation: 0, run: { intel: 2 } },
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
        { label: '蹲下，帮她拆那块板', relation: 2, run: { intel: 2, gear: 1 }, flag: 'se_helped' },
        { label: '说明你来问接缝的事', relation: 1, run: { intel: 3 } },
        { label: '什么都不说，退回去', relation: -1, run: { track: { loyalty: 1 } } },
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
        { label: '接下泵，答应替她查', relation: 3, run: { gear: 1, intel: 2, track: { sin: 1 } }, flag: 'se_deal' },
        { label: '不收泵，只答应查编号牌', relation: 2, run: { intel: 3, track: { renown: 1 } } },
        { label: '说外面的事你插不了手', relation: -2, run: { track: { loyalty: 1 } } },
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
        { label: '留下，帮她记下名字', relation: 3, run: { intel: 3, track: { renown: 2, sin: 1 } }, flag: 'se_stayed' },
        { label: '带牌子走，按流程上报', relation: -2, run: { money: 55, track: { loyalty: 2 } }, flag: 'se_took_plate' },
        { label: '把泵还她，谁也不欠谁', relation: -1, run: { track: { sin: -1 } } },
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
        { label: '让他照人办，先别拆', relation: 2, run: { intel: 2, track: { sin: 1 } }, flag: 'bt_kept_arm' },
        { label: '照单办，把编号登记清楚', relation: 1, run: { track: { loyalty: 1 } } },
        { label: '说活人不归你管，照单走', relation: -1, run: { track: { loyalty: 1, sin: 1 } } },
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
        { label: '替他把接管登记成报废件', relation: 3, run: { intel: 3, track: { sin: 2 } }, flag: 'bt_faked_scrap' },
        { label: '劝他把东西交出去止损', relation: 0, run: { track: { loyalty: 2, renown: -1 } } },
        { label: '说不掺和，转身就走', relation: -2, run: { intel: 1 } },
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
        { label: '接下接管，答应还人', relation: 3, run: { intel: 3, track: { renown: 2, sin: 1 } }, flag: 'bt_returned_arm' },
        { label: '把接管上交，换他免罚', relation: -1, run: { money: 50, track: { loyalty: 2 } }, flag: 'bt_handed_in' },
        { label: '不接，让他自己交', relation: -2, run: { intel: 1, track: { sin: -1 } } },
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
        { label: '承认门口是有人等过', relation: 2, run: { intel: 3 }, flag: 'wm_admitted' },
        { label: '反问它抄的是谁的档案', relation: 1, run: { intel: 3, track: { sin: 1 } } },
        { label: '说没有，把单子推回去', relation: -1, run: { track: { loyalty: 1 } } },
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
        { label: '承认那段记忆里是自己', relation: 2, run: { intel: 4, track: { sin: 1 } }, flag: 'wm_confirmed' },
        { label: '要求调出完整档案', relation: 1, run: { intel: 4, track: { loyalty: -1 } } },
        { label: '说柜员的事与你无关', relation: -1, run: { track: { loyalty: 1 } } },
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
        { label: '让它取出来，你带走', relation: 3, run: { intel: 4, track: { sin: 2, renown: 1 } }, flag: 'wm_extracted' },
        { label: '让它按规程当场抹除', relation: -2, run: { track: { loyalty: 3 } }, flag: 'wm_erased' },
        { label: '不替它选，让它自己定', relation: 1, run: { intel: 2, track: { sin: -1 } } },
      ],
    },
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
        const count = t.id === 3 ? 1 : 2;   // 4 路径 × (2+2+1) = 20 张，抽 12 张入场
        for (let i = 0; i < count; i++) {
          deck.push({ uid: 'c' + (uid++), pathId: p.id, tier: t.id, need: t.need, target: null });
        }
      });
    });
    return shuffle(deck);
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
      hand: all.slice(0, 5),
      deck: all.slice(5),
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

      if (s.deck.length && s.hand.length < 5) {
        const nc = s.deck.shift();
        nc.target = pickTarget(s, nc);
        s.hand.push(nc);
      }
      if (s.folded % 2 === 0) {
        s.chips += 3;
        s.apMax = Math.min(6, C.apPerDay + Math.floor(s.folded / 4));
        res.lines.push('董事会追加授权：+3 芯片。');
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
    s.pendingEvent = ev;
    s.phase = 'event';
    pushLog(s, 'day', '第 ' + s.day + ' 天。剩余期限 ' + s.deadline + ' 天。');
    return { ok: true, event: ev, expired: expired, incoming: incoming };
  }

  let eventBag = [];
  function pickEvent(s) {
    const all = D.EVENTS;
    if (!all.length) return null;
    if (eventBag.length === 0) eventBag = shuffle(all.map((e, i) => i));
    const e = all[eventBag.pop()];
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
    return { ok: true, lines: lines };
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
    checkEnd(S);
    return r;
  }

  /* 供 story.js 调用，避免两处重复实现 */
  function applyEffectPublic(S, eff, lines) { applyEffect(S, eff, lines || []); }

  /* ==========================================================
     十一、终局
     ========================================================== */
  function checkEnd(s) {
    if (s.tracks.loyalty <= 0) { s.ending = endingById('broken'); s.phase = 'end'; return; }
    if (s.tracks.sin >= C.trackCap) { s.ending = endingById('purged'); s.phase = 'end'; return; }
    if (s.folded >= C.deckGoal) { s.ending = pickEnding(s); s.phase = 'end'; }
  }

  function pickEnding(s) {
    for (let i = 0; i < D.ENDINGS.length; i++) if (D.ENDINGS[i].cond(s)) return D.ENDINGS[i];
    return D.ENDINGS[D.ENDINGS.length - 1];
  }
  function endingById(id) {
    return D.ENDINGS.find((e) => e.id === id) || D.ENDINGS[D.ENDINGS.length - 1];
  }

  /* ==========================================================
     十二、命运商店（局内直接购买，主页另有一套永久升级）
     ========================================================== */
  function buyShop(s, id) {
    const it = D.SHOP.find((x) => x.id === id);
    if (!it) return { ok: false, why: '没有这件东西。' };
    if (s.fortune < it.cost) return { ok: false, why: '命运点数不够。' };
    s.fortune -= it.cost;
    const lines = [];
    applyEffect(s, it.run, lines);
    pushLog(s, 'info', '命运商店：' + it.name);
    return { ok: true, lines: lines };
  }

  function pushLog(s, kind, text) {
    s.log.unshift({ kind: kind, text: text, day: s.day });
    if (s.log.length > 80) s.log.pop();
  }

  /* ==========================================================
     十三、导出
     ========================================================== */
  window.GAME_ENGINE = {
    newGame, fold, doAction, swapCard, endDay, resolveEvent, buyShop,
    resolveStory, pickStory, applyEffectPublic,
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
    const p = Array.isArray(window.BRIEFS) ? window.BRIEFS : [];
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
  function npcScenes() {
    const out = [];
    if (Array.isArray(window.STORY_NPC_A)) out.push(...window.STORY_NPC_A);
    if (Array.isArray(window.STORY_NPC_B)) out.push(...window.STORY_NPC_B);
    return out;
  }
  function allScenes() { return mainScenes().concat(npcScenes()); }

  const fired = (S, id) => !!(S.storyFired && S.storyFired[id]);

  /* ---------------- 条件求值 ---------------- */
  function condOk(S, when) {
    if (!when) return true;
    if (when.act && actOf(S.folded).n !== when.act) return false;
    if (when.minFolded != null && S.folded < when.minFolded) return false;
    if (when.maxFolded != null && S.folded > when.maxFolded) return false;
    if (when.minDay != null && S.day < when.minDay) return false;
    if (when.minRel != null && rel(S, when.npc) < when.minRel) return false;
    if (when.flag && !(S.storyFlags && S.storyFlags[when.flag])) return false;
    if (when.notFlag && S.storyFlags && S.storyFlags[when.notFlag]) return false;
    if (when.met && !isMet(S, when.met)) return false;
    return true;
  }

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
      kind: kind,                       // main | line | meet
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
    nextScene, resolve, progress, ensureGuide, allScenes, mainScenes, npcScenes, condOk,
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
      el.innerHTML =
        faceTag('person-face', info.portrait) +
        '<div class="person-info">' +
          '<div class="person-name">' + esc(info.name) +
            (id === ST.GUIDE ? '<span class="guide-tag">引导者</span>' : '') + '</div>' +
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

    const g = greeting(S, npcId);
    const first = firstLine(S, npcId);
    const shown = first || (g ? g.text : '');

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
      '<div id="talk-reply" class="talk-reply" hidden></div>' +
      '<div class="row"><button class="btn btn-ghost" data-back="1">返回名单</button></div>';

    host.querySelector('[data-back]').onclick = handlers.onBack;
    host.querySelectorAll('[data-topic]').forEach((b) => {
      b.onclick = () => handlers.onTopic(b.getAttribute('data-topic'));
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

  window.GAME_VOICE = { voiceOf, greeting, topicState, talk, firstLine, renderPeople, renderTalk, showReply, talkPercent };
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

  /* ---------------- 结算 ---------------- */
  function settle(p, s) {
    const earned = Math.max(0, s.fortune);
    p.fortune += earned;
    p.runs += 1;
    const win = s.folded >= C.deckGoal;
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
      tracks: Object.assign({}, s.tracks),
    };
    if (!p.best || run.points > p.best.points) p.best = run;
    p.lastRun = run;
    save(p);
    return { earned: earned, total: p.fortune, run: run, win: win };
  }

  function ownedCount(p) { return NEXUS.filter((it) => levelOf(p, it.id) > 0).length; }

  window.GAME_META = { NEXUS, KEY, blank, load, save, reset, levelOf, canBuy, buy, refundAll, applyToRun, settle, ownedCount };
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

  window.GAME_MAP = { buildNodes, syncNodes, attachDrag, districtDetail, districtById, districtOfAsset, setSelected, summary, nodeRect, districtVisible };
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
    // 开局先来一条委托，让新系统立刻可见
    if (B && !S.briefs.length) { B.spawn(S); renderAll(); }
    setTimeout(() => hint('种子 ' + S.seedLabel + ' · 遇到新的委托点顶部 ◈', 4200), 1400);
    // 开局走世界观入门剧情，不再弹独立的教程浮层
    setTimeout(() => startIntro(), 260);
  }

  function quitToHome() {
    if (S && !S.ending && !confirm('回到主页？这一局尚未结束，进度会丢失（已获得的命运点不会）。')) return;
    S = null;
    show('screen-home');
    renderHome();
  }

  /* ==========================================================
     渲染
     ========================================================== */
  function renderAll() {
    if (!S) return;
    renderHud();
    renderHand();
    renderActions();
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
    if (foldable.length) el.textContent = '还能折 ' + foldable.length + ' 张，还差 ' + need + ' 张通关';
    else el.textContent = '暂时没有可折的牌，换牌或用行动攒资源';
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
      el.className = 'card' + (gate.ok ? '' : ' locked') + (selectedUid === c.uid ? ' picked' : '');
      el.style.setProperty('--c', p.color);
      el.dataset.uid = c.uid;
      el.innerHTML =
        '<div class="card-art" style="background-image:url(' + CARD_ART[c.pathId] + ')"><span class="card-tier">' + t.name + '</span></div>' +
        '<div class="card-body">' +
          '<div class="card-path" style="color:' + p.color + '">' + esc(p.name) + '</div>' +
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
  }

  function renderActions() {
    const wrap = $('actions');
    wrap.innerHTML = '';
    D.ACTIONS.forEach((a) => {
      const el = document.createElement('div');
      el.className = 'act';
      el.innerHTML = '<span class="ic">' + a.icon + '</span><div class="an">' + esc(a.name) + '</div>' +
        '<div class="ac">' + a.cost + ' 行动点</div>';
      el.title = a.desc || '';
      if (S.ap < a.cost) el.setAttribute('disabled', 'disabled');
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

  function openDrawer(name) {
    const titles = { actions: '行动', tracks: '名望与属性', people: '认识的人', log: '记录' };
    if (drawerOpen === name) return closeDrawer();
    drawerOpen = name;
    $('drawer-title').textContent = titles[name] || name;
    $('drawer').classList.add('open');
    document.querySelectorAll('.pane').forEach((p) => p.classList.remove('on'));
    $('pane-' + name).classList.add('on');
    document.querySelectorAll('.rail-btn').forEach((b) => b.classList.toggle('on', b.dataset.panel === name));
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
      if (d) { hint('目标在' + d.name + '，点亮的节点可以直接投放', 3000); openDistrict(d.id); }
      else hint('这张牌暂时没有可投目标，换一张', 2600);
    }
  }

  function onNodeClick(distId) {
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

  function openDistrict(distId) {
    const info = M.districtDetail(S, distId);
    if (!info) return;
    $('dt-tag').textContent = info.district.en || '';
    $('dt-title').textContent = info.district.name;
    $('dt-desc').textContent = info.district.desc || '';

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
        if (r.ok) el.querySelector('.go').onclick = () => { show('screen-game'); onSolveBrief(r.uid); };
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
      if (r.ok) el.querySelector('.go').onclick = () => { show('screen-game'); onFold(r.uid); };
      cw.appendChild(el);
    });

    $('dt-assets').innerHTML = info.assets.length
      ? info.assets.map((a) => '<span>' + esc(a) + '</span>').join('')
      : '<span style="opacity:.6">暂无</span>';
    $('dt-events').innerHTML = info.events.length
      ? info.events.map((x) => '<span>' + esc(x) + '</span>').join('')
      : '<span style="opacity:.6">暂无</span>';

    show('screen-district');
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
    const r = E.fold(S, uid, boost, chipSpend);
    if (!r.ok) { toast('无法执行', r.why); return; }
    selectedUid = null;
    M.setSelected(null);
    $('chk-boost').checked = false;
    $('chip-range').value = '0';
    const title = r.pass ? (r.crit ? '暴击 · 指令达成' : '指令达成') : (r.fumble ? '崩盘 · 指令失败' : '指令失败');
    showResult(title, r.lines, r.pass);
    afterAction();
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
    afterAction();
  }

  function onSolveBrief(uid) {
    const r = B.solve(S, uid);
    if (!r.ok) { toast('还交不了', r.why); return; }
    renderAll();
    renderBriefs();
    const title = r.pass ? '委托完成' : '委托未办成';
    showResult(title, r.lines, r.pass);
    if (S.phase === 'end' && S.ending) showEnd();
  }

  function onRefuseBrief(uid) {
    if (!confirm('回绝这条委托？对方会记住。')) return;
    const r = B.refuse(S, uid);
    if (!r.ok) { toast('回绝不了', r.why); return; }
    renderAll();
    renderBriefs();
    showResult('你回绝了', r.lines, false);
    if (S.phase === 'end' && S.ending) showEnd();
  }

  function onEndDay() {
    const r = E.endDay(S);
    renderAll();
    renderBriefs();
    if (r.dead && S.ending) { showEnd(); return; }
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
    renderAll();
    if (S.phase === 'end' && S.ending) showEnd();
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

  function introScenes() {
    const list = Array.isArray(window.INTRO_SCENES) ? window.INTRO_SCENES : [];
    return list.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  /* 开局：把世界观入门排进队列 */
  function startIntro() {
    const list = introScenes();
    if (!list.length) { storyLayer(false); return; }
    S.introDone = S.introDone || {};
    const fresh = list.filter((sc) => !S.introDone[sc.id]);
    if (!fresh.length) { storyLayer(false); return; }
    storyIsIntro = true;
    storyQueue = fresh.map((sc, i) => ({
      story: true, kind: 'intro', id: sc.id, tag: sc.tag || '世界观',
      title: sc.title, text: sc.text, portrait: null, npc: null, npcName: '',
      district: 'tower',                    // 入门剧情挂在引导者所在的城区
      idx: i + 1, total: fresh.length,
      options: (sc.choices || []).map((c) => ({ label: c.label, relation: c.relation, run: c.run, flag: c.flag })),
    }));
    storyDone = () => { storyIsIntro = false; storyLayer(false); renderAll(); };
    showStory(storyQueue.shift());
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
    $('story-text').textContent = scene.text || '';
    $('story-body').scrollTop = 0;

    $('story-skip').hidden = !(storyIsIntro || scene.kind === 'intro');

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
        if (r.ok) showResult(isStory ? (ev.kind === 'main' ? '主线推进' : '关系推进') : '结果', r.lines, null);
        if (S.phase === 'end' && S.ending) showEnd();
      };
      wrap.appendChild(b);
    });
    show('screen-event');
  }

  /* ==========================================================
     弹窗
     ========================================================== */
  function showResult(title, lines, ok) {
    $('res-body').innerHTML =
      '<div class="res-big" style="color:' + (ok === true ? 'var(--ok)' : ok === false ? 'var(--red)' : 'var(--cyan)') + '">' + esc(title) + '</div>' +
      lines.map((l) => {
        const cls = /失败|崩盘|超期|还差/.test(l) ? 'fail' : (/成功|完成|^\+/.test(l) ? 'ok' : '');
        return '<div class="res-line ' + cls + '">' + esc(l) + '</div>';
      }).join('');
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
    $('end-points').textContent = '+' + settled.earned;
    $('end-total').textContent = settled.total;
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

  /* ==========================================================
     绑定
     ========================================================== */
  $('btn-play').onclick = gotoOrigin;
  $('btn-howto').onclick = () => show('screen-howto');
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
  $('dt-close').onclick = () => show('screen-game');
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
