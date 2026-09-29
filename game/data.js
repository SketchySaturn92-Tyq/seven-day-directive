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
