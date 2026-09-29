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
