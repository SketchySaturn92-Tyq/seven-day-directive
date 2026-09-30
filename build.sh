#!/usr/bin/env bash
# 把 game/ 下的源码按依赖顺序拼成 bundle.js。
# 目的：把首屏 19 个脚本请求压到 1 个，避免隧道层的并发限制导致 503。
# 源码文件保持原样，方便阅读和改；改完跑一次 ./build.sh 即可。
set -euo pipefail
cd "$(dirname "$0")"

ORDER=(
  # 1) 纯数据层：只往 window 上挂数组，彼此无依赖
  game/data.js
  game/content-extra.js
  game/content-v2.js
  game/content-map2.js
  game/content-briefs.js
  game/content-briefs2.js
  # 2) 剧情与语音：同样是纯数据
  game/intro.js
  game/story-main.js
  game/story-npc-a.js
  game/story-npc-b.js
  game/story-npc-a2.js
  game/story-npc-b2.js
  game/voice-a.js
  game/voice-b.js
  game/lore.js
  game/card-sources.js
  game/approval.js
  game/relation-events.js
  game/event-gates.js
  game/events-v6.js
  game/afterstory.js
  # 3) 随机数层
  game/audio.js
  game/save.js
  game/rng.js
  # 4) 引擎（会合并上面的数据）
  game/engine.js
  game/briefs.js
  game/story.js
  game/dialogue.js
  # 5) 外围
  game/meta.js
  game/map.js
  # 6) 界面层：必须最后
  game/ui.js
)

OUT=game/bundle.js
{
  echo "/* 自动生成，请勿直接编辑。改 game/ 下的源码后运行 ./build.sh */"
  echo "/* 生成时间: $(date -u +%Y-%m-%dT%H:%M:%SZ) */"
  for f in "${ORDER[@]}"; do
    if [ ! -f "$f" ]; then
      echo "/* 跳过（文件不存在）: $f */"
      continue
    fi
    echo ""
    echo "/* ===== $f ===== */"
    cat "$f"
  done
} > "$OUT"

# CSS 同样合并，少一个请求
{
  echo "/* 自动生成，请勿直接编辑。改 style.css / style-v3.css 后运行 ./build.sh */"
  cat style.css
  cat style-v3.css
} > bundle.css

node --check "$OUT"
echo "已生成 $(wc -c < "$OUT") 字节的 $OUT"
echo "已生成 $(wc -c < bundle.css) 字节的 bundle.css"
