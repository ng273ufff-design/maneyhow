/* マネとく - 統合アクセス解析（GA4 + Microsoft Clarity）
 * 使い方:
 *  1) 下記 GA4_ID に G-XXXXXXXXXX を貼る → GA4有効化
 *  2) 下記 CLARITY_ID に Clarity Project ID を貼る → Clarity有効化
 *  3) 空のままなら何もロードしない（安全）
 *  ID変更だけで全16記事に即反映される。
 */
(function () {
  'use strict';

  // ============================================================
  // ★★★ ここに ID を貼るだけ ★★★
  // ============================================================
  const GA4_ID = 'G-0NQHWCG4YM';   // マネとくブログ (2026-05-12)
  const CLARITY_ID = '';            // 例: 'abcdefghij'
  // ============================================================

  // ---------- GA4 ----------
  if (GA4_ID && GA4_ID.startsWith('G-')) {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA4_ID, {
      page_title: document.title,
      page_path: location.pathname,
    });

    // 記事ページ専用カスタムイベント
    initArticleEvents();
  }

  // ---------- Microsoft Clarity ----------
  if (CLARITY_ID && CLARITY_ID.length > 0) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1;
      t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  // ============================================================
  // 記事ページ用イベント（GA4 のみ）
  //  - scroll_depth: 25/50/75/90%
  //  - cta_click: アフィリエイトリンククリック
  //  - read_complete: 90%到達=記事読了
  //  - article_exit: 離脱時の最終位置
  // ============================================================
  function initArticleEvents() {
    const milestones = new Set();
    let maxScrollPct = 0;
    let readComplete = false;

    function pctScrolled() {
      const h = document.documentElement;
      return Math.round((window.scrollY / Math.max(1, h.scrollHeight - window.innerHeight)) * 100);
    }

    function throttle(fn, delay) {
      let last = 0;
      return function () {
        const now = Date.now();
        if (now - last >= delay) { last = now; fn.apply(this, arguments); }
      };
    }

    window.addEventListener('scroll', throttle(function () {
      const pct = pctScrolled();
      if (pct > maxScrollPct) maxScrollPct = pct;
      [25, 50, 75, 90].forEach(function (m) {
        if (pct >= m && !milestones.has(m)) {
          milestones.add(m);
          window.gtag('event', 'scroll_depth', {
            depth_percent: m,
            article_slug: location.pathname.split('/').pop().replace('.html', ''),
          });
          if (m === 90 && !readComplete) {
            readComplete = true;
            window.gtag('event', 'read_complete', {
              article_slug: location.pathname.split('/').pop().replace('.html', ''),
            });
          }
        }
      });
    }, 400), { passive: true });

    // CTAクリック（アフィリエイトリンク全般）
    document.addEventListener('click', function (e) {
      const a = e.target.closest('a');
      if (!a) return;
      const href = (a.href || '').toLowerCase();
      const text = (a.textContent || '').trim().substring(0, 50);

      // 外部リンク = CTA候補
      if (href && !href.includes(location.hostname) && href.startsWith('http')) {
        let ctaType = 'external';
        if (href.includes('mogecheck')) ctaType = 'mogecheck';
        else if (href.includes('eposcard') || href.includes('epos')) ctaType = 'epos';
        else if (href.includes('rakuten')) ctaType = 'rakuten';
        else if (href.includes('sbisec') || href.includes('sbi')) ctaType = 'sbi';
        else if (href.includes('a8.net') || href.includes('valuecommerce') || href.includes('linksynergy') || href.includes('afi-b')) ctaType = 'affiliate';

        window.gtag('event', 'cta_click', {
          cta_type: ctaType,
          cta_text: text,
          link_url: href,
          article_slug: location.pathname.split('/').pop().replace('.html', ''),
        });
      }
    });

    // 離脱時の最終スナップショット
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        window.gtag('event', 'article_exit', {
          article_slug: location.pathname.split('/').pop().replace('.html', ''),
          max_scroll_percent: maxScrollPct,
          read_complete: readComplete,
        });
      }
    });
  }
})();
