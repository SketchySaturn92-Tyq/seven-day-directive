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

  /* 系统开了“减弱动态效果”时，默认不发声；这也符合无障碍习惯 */
  function prefersReduce() {
    try {
      const mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
      return !!(mq && mq.matches);
    } catch (e) {
      return false;
    }
  }

  function readEnabled() {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw === '0') return false;
      if (raw === '1') return true;
    } catch (e) { /* 隐私模式下 localStorage 不可用，走默认值 */ }
    return !prefersReduce();
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
    return !prefersReduce();
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
