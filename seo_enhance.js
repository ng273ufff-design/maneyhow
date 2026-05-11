/**
 * マネとく全記事SEO強化
 * - canonical URL追加
 * - Schema.org JSON-LD（Article）追加
 * - 関連記事セクション追加
 */
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://ng273ufff-design.github.io/maneyhow';
const ARTICLES_DIR = path.join(__dirname, 'articles');

const ARTICLES = {
  '106man.html': {title: '年収106万円の壁が全企業に拡大', desc: '2026年10月から社会保険適用拡大が全企業に。手取りへの影響と対策を解説。', date: '2026-04-29', category: '法改正'},
  'aoyiro.html': {title: '青色申告65万円控除の申請手順', desc: 'e-Tax提出で最大65万円控除を受ける方法を2026年最新版で解説。', date: '2026-04-21', category: '個人事業主'},
  'card.html': {title: '2026年版おすすめクレジットカード比較', desc: '年会費・ポイント還元・特典で選ぶ最強の1枚を目的別に解説。', date: '2026-04-29', category: 'クレジットカード'},
  'crypto-basic.html': {title: 'ビットコインって結局何？初心者向け解説', desc: '仕組み・買い方・リスク・税金まで基礎をまとめた完全ガイド。', date: '2026-04-29', category: '仮想通貨'},
  'crypto-exchange.html': {title: '仮想通貨取引所おすすめ比較【2026年版】', desc: 'Coincheck・bitFlyer・GMOコインを徹底比較。初心者に最適な取引所を解説。', date: '2026-04-29', category: '仮想通貨'},
  'crypto-market.html': {title: '円安・利上げ時代の仮想通貨投資戦略', desc: '円安ヘッジとしてのビットコイン投資を正直に分析。', date: '2026-04-29', category: '仮想通貨'},
  'crypto-recommend.html': {title: '2026年おすすめ仮想通貨3選', desc: '初心者が最初に持つべきBTC・ETH・SOLの3銘柄を厳選解説。', date: '2026-04-29', category: '仮想通貨'},
  'crypto-tax.html': {title: '仮想通貨の確定申告【2026年版】', desc: '雑所得の計算方法・税率・無申告のリスクをわかりやすく解説。', date: '2026-04-29', category: '仮想通貨'},
  'furusato.html': {title: 'ふるさと納税2026年版完全ガイド', desc: '上限額計算と損しない使い方。会社員・個人事業主別の活用法を解説。', date: '2026-04-15', category: '節税'},
  'hojokin.html': {title: '個人事業主向け補助金・助成金まとめ', desc: '2026年最新の補助金情報。今すぐ申請できる制度を一覧で解説。', date: '2026-04-27', category: '補助金'},
  'hojokin2.html': {title: '中小企業向けIT補助金2026年版', desc: 'IT導入補助金・ものづくり補助金の採択率を上げる申請書の書き方。', date: '2026-04-17', category: '補助金'},
  'ideco.html': {title: 'iDeCo 2026年完全ガイド', desc: 'iDeCoの仕組み・節税効果・新NISAとの違いを徹底解説。', date: '2026-05-11', category: '資産運用'},
  'invoice.html': {title: 'インボイス制度2026年の最新動向', desc: '登録・未登録の影響を図解で整理。免税事業者はどうすべきか。', date: '2026-04-25', category: '税金'},
  'kinri.html': {title: '日銀利上げで住宅ローンはどう変わる？', desc: '金利上昇局面での住宅ローン対策を徹底解説。今すぐ確認すべきこと。', date: '2026-04-28', category: '金利'},
  'nisa.html': {title: '新NISAと利上げの関係【2026年版】', desc: '金利上昇局面での新NISA活用法と正しい投資戦略を解説。', date: '2026-04-23', category: '資産運用'},
  'roudou.html': {title: '2026年労働基準法改正まとめ', desc: '残業規制・有休取得義務など、中小企業が今すぐ対応すべき3つのこと。', date: '2026-04-19', category: '法改正'},
};

const RELATED = {
  '資産運用': ['ideco.html', 'nisa.html', 'crypto-basic.html'],
  '仮想通貨': ['crypto-basic.html', 'crypto-exchange.html', 'crypto-tax.html', 'crypto-recommend.html'],
  '節税': ['furusato.html', 'ideco.html', 'aoyiro.html'],
  '税金': ['invoice.html', 'aoyiro.html', 'crypto-tax.html'],
  '個人事業主': ['aoyiro.html', 'invoice.html', 'hojokin.html'],
  '補助金': ['hojokin.html', 'hojokin2.html', 'aoyiro.html'],
  '法改正': ['106man.html', 'roudou.html', 'invoice.html'],
  'クレジットカード': ['card.html', 'furusato.html', 'nisa.html'],
  '金利': ['kinri.html', 'nisa.html', 'ideco.html'],
};

function buildJsonLd(slug, meta) {
  return `<link rel="canonical" href="${BASE_URL}/articles/${slug}">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${meta.title}",
  "description": "${meta.desc}",
  "image": "${BASE_URL}/og-image.png",
  "author": {
    "@type": "Organization",
    "name": "マネとく",
    "url": "${BASE_URL}/"
  },
  "publisher": {
    "@type": "Organization",
    "name": "マネとく",
    "logo": {
      "@type": "ImageObject",
      "url": "${BASE_URL}/logo.png"
    }
  },
  "datePublished": "${meta.date}",
  "dateModified": "${meta.date}",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "${BASE_URL}/articles/${slug}"
  },
  "articleSection": "${meta.category}",
  "inLanguage": "ja-JP"
}
</script>`;
}

function buildRelatedHtml(slug, category) {
  let rels = (RELATED[category] || RELATED['資産運用']).filter(s => s !== slug).slice(0, 3);
  let cards = '';
  for (const r of rels) {
    const m = ARTICLES[r] || {};
    cards += `
    <a href="${r}" class="rel-card">
      <div class="rel-cat">${m.category || ''}</div>
      <div class="rel-title">${m.title || ''}</div>
    </a>`;
  }
  return `
<style>
.related-section { max-width:760px; margin:48px auto 32px; padding:0 24px; }
.related-section h3 { font-size:18px; font-weight:900; color:#0f2d5e; margin-bottom:16px; padding-left:14px; border-left:4px solid #16a34a; }
.related-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:14px; }
.rel-card { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; text-decoration:none; color:#0f172a; transition:all 0.2s; box-shadow:0 1px 4px rgba(15,45,94,0.06); }
.rel-card:hover { transform:translateY(-2px); box-shadow:0 4px 12px rgba(15,45,94,0.12); border-color:#16a34a; }
.rel-cat { font-size:11px; font-weight:700; color:#16a34a; margin-bottom:6px; }
.rel-title { font-size:14px; font-weight:700; line-height:1.5; }
</style>
<div class="related-section">
  <h3>📚 関連記事もチェック</h3>
  <div class="related-grid">${cards}
  </div>
</div>
`;
}

function enhance(slug) {
  const p = path.join(ARTICLES_DIR, slug);
  if (!fs.existsSync(p)) { console.log(`SKIP: ${slug} not found`); return false; }
  let html = fs.readFileSync(p, 'utf-8');
  const meta = ARTICLES[slug];
  if (!meta) { console.log(`SKIP: ${slug} no metadata`); return false; }

  if (!html.includes('application/ld+json')) {
    const jsonld = buildJsonLd(slug, meta);
    const twitterRe = /(<meta name="twitter:site"[^>]*>)/;
    if (twitterRe.test(html)) {
      html = html.replace(twitterRe, `$1\n${jsonld}`);
    } else {
      html = html.replace('</head>', `${jsonld}\n</head>`);
    }
    console.log(`✓ ${slug}: added canonical + JSON-LD`);
  }

  if (!html.includes('related-section')) {
    const rel = buildRelatedHtml(slug, meta.category);
    html = html.replace(/<footer/, `${rel}<footer`);
    console.log(`✓ ${slug}: added related articles`);
  }

  fs.writeFileSync(p, html, 'utf-8');
  return true;
}

let success = 0;
for (const slug of Object.keys(ARTICLES)) {
  if (enhance(slug)) success++;
}
console.log(`\nDone: ${success}/${Object.keys(ARTICLES).length} articles enhanced`);
