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
