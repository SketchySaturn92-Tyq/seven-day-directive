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
