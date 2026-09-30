# 故事线与人际关系脑图

这一版梳理的是玩法层面的改造方案，不是代码改动。

## 文件

| 文件 | 说明 |
|---|---|
| `故事线与人际关系脑图.pdf` | 成品，四页，直接看这个 |
| `mindmap.html` | 排版中间稿（PDF 由它渲染） |
| `mindmap.build.py` | 生成器：把下面两份 JSON 合进 HTML |
| `relations.json` | 十六人的关系连线与圈层归属 |
| `storyline.json` | 主线九场与十六条支线的因果链 |
| `extract-relations.js` | 从 `game/*.js` 抽关系连线的脚本 |

## 重新生成

```sh
node design/mindmap/extract-relations.js      # 重抽关系 → relations.json
python3 design/mindmap/mindmap.build.py       # 合成 → mindmap.html
wkhtmltopdf --enable-local-file-access --encoding utf-8 --page-size A4 \
  --margin-top 13mm --margin-bottom 13mm --margin-left 11mm --margin-right 11mm \
  mindmap.html 故事线与人际关系脑图.pdf
```

（后两步的工作目录是 `design/mindmap/`。）

## 数据是怎么来的

- 关系连线由脚本从剧情场景、台词话题、世界观碎片、委托、事件里扫共现得到，
  每条都带 `文件名:条目id` 形式的出处，可回查。
- 除共现之外，另加两类**设定层面**的关系：同势力（同僚）、同城区。
  这两类在 JSON 里同样标明依据是设定表，不与剧情互动混为一谈。
- 剧情因果链由子任务从 `game/story-*.js` 抽取，117 个 id 全部与源文件逐字一致。

结论里用到的数字（10 城区 / 26 目标 / 200 事件 / 12 段入门 2304 字）都是实测值。
