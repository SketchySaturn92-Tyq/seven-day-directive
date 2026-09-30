/* 地图扩张与初见事件 —— 由内容设计生成 */
(function () {
  'use strict';

  /* ---------------- 新增城区（六区 -> 十区） ---------------- */
  window.DISTRICTS_EXTRA = [
    {
      id: 'ring', stage: 4, name: '环带维修层', en: 'RING', x: 0.105, y: 0.12, color: '#98a2ad', portrait: 'portrait-peng',
      desc: '穹顶内侧的夹层，管壁一直在响。照明坏了一半没人换，剩下的把影子拉得很长。空气是铁锈和绝缘漆的味道。',
    },
    {
      id: 'memory', stage: 5, name: '记忆银行', en: 'MEMORY', x: 0.935, y: 0.29, color: '#86b6cf', portrait: 'portrait-dai',
      desc: '恒温负十八度，走廊只有制冷机的低鸣。柜台后面存着几十万份人格备份，每一份都比你值钱。光很冷，是蓝色的。',
    },
    {
      id: 'salvage', stage: 4, name: '回收场', en: 'SALVAGE', x: 0.43, y: 0.88, color: '#c9763c', portrait: 'portrait-fixer',
      desc: '义体、旧枪、报废终端在这里被拆成零件，再按斤卖回去。白天空地冒烟，夜里有人翻找还温的货。味道是焦塑料。',
    },
    {
      id: 'outside', stage: 5, name: '穹顶之外', en: 'OUTSIDE', x: 0.91, y: 0.91, color: '#7ea86b', portrait: 'portrait-yuke',
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
