/**
 * 記事中盤インラインCTA追加スクリプト
 * 最初のh2の直前にテーマ別CTAボックスを挿入してCTR向上を狙う
 */
const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, 'articles');

// テーマ別CTA（既に承認済みのアフィリエイトリンクを使用）
const CTAS = {
  // 住宅ローン → モゲチェック2,564円
  'kinri.html': {
    title: '🏦 まずは無料で住宅ローン診断',
    body: '74銀行から一括比較。借入・借換のシミュレーションが無料で診断できます。',
    btn1: {href: 'https://px.a8.net/svt/ejp?a8mat=4B1WM2+G7GTMA+5YJRM', text: 'モゲチェックで借り換え診断'},
    btn2: {href: 'https://px.a8.net/svt/ejp?a8mat=4B1WM2+G6VE0I+3SUE+15OK2A', text: '新規購入もこちら'},
  },
  // iDeCo → 松井証券
  'ideco.html': {
    title: '💰 iDeCoを始めるならネット証券',
    body: '手数料の差が長期で大きく効きます。まずは無料の資料請求から。',
    btn1: {href: 'https://px.a8.net/svt/ejp?a8mat=4B1WM2+FXXVXU+3XCC+BYT9D', text: '松井証券でiDeCoを始める'},
    btn2: {href: 'https://px.a8.net/svt/ejp?a8mat=4B3NYZ+DOZOY+1IRY+1ZGVGH', text: '投資の学校で基礎を学ぶ'},
  },
  // NISA → 証券口座
  'nisa.html': {
    title: '📈 新NISAを始めるならネット証券',
    body: '手数料・ポイント還元・使いやすさで選ぶなら。口座開設は無料です。',
    btn1: {href: 'https://px.a8.net/svt/ejp?a8mat=4B1WM2+FXXVXU+3XCC+BYT9D', text: '松井証券でiDeCoも一緒に'},
    btn2: {href: 'https://px.a8.net/svt/ejp?a8mat=4B3NYZ+DOZOY+1IRY+1ZGVGH', text: '投資の学校（無料）'},
  },
  // クレジットカード → エポスカード
  'card.html': {
    title: '💳 年会費永年無料の人気カード',
    body: '審査が通りやすく即日発行も可能。マルイで5回開催の10%OFFも特典。',
    btn1: {href: 'https://px.a8.net/svt/ejp?a8mat=4B3NYY+E68I7M+38L8+BX3J5', text: 'エポスカードを発行する'},
  },
  // ふるさと納税 → 楽天/au PAY
  'furusato.html': {
    title: '🎁 まずはシミュレーターで上限額を確認',
    body: '年収を入れるだけで自己負担2,000円で済む寄付額がわかります。',
    btn1: {href: 'https://rpx.a8.net/svt/ejp?a8mat=4B1WM2+EDDPGY+2HOM+6C1VM&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0ea62065.34400275.0ea62066.204f04c0%2Fa26042907724_4B1WM2_EDDPGY_2HOM_6C1VM%3Fpc%3Dhttp%253A%252F%252Fwww.rakuten.co.jp%252F%26m%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252F', text: '楽天ふるさと納税で確認'},
    btn2: {href: 'https://px.a8.net/svt/ejp?a8mat=4B3NZ0+9T22IA+54OC+601S1', text: 'au PAYふるさと納税'},
  },
  // 青色申告 → 会計ソフト
  'aoyiro.html': {
    title: '📝 青色申告は会計ソフトが必須',
    body: 'e-Tax連携で65万円控除を受けるには複式簿記対応のソフトが必要です。',
    btn1: {href: 'https://px.a8.net/svt/ejp?a8mat=4B1WM2+GEM0VM+3SPO+9FDI8Y', text: 'freeeを無料で始める'},
    btn2: {href: 'https://px.a8.net/svt/ejp?a8mat=4B1WM3+LGDU+4JGQ+BXB8Z', text: 'マネーフォワード確定申告'},
  },
  // インボイス → 会計ソフト
  'invoice.html': {
    title: '📋 インボイス対応は会計ソフトで自動化',
    body: '適格請求書の発行・保存はソフトで自動化が便利。無料プランから始められます。',
    btn1: {href: 'https://px.a8.net/svt/ejp?a8mat=4B1WM2+GEM0VM+3SPO+9FDI8Y', text: 'freeeを無料で試す'},
    btn2: {href: 'https://px.a8.net/svt/ejp?a8mat=4B1WM3+LGDU+4JGQ+BXB8Z', text: 'マネーフォワード確定申告'},
  },
  // 補助金 → 会計ソフト/開業届
  'hojokin.html': {
    title: '📑 補助金申請には会計ソフトの帳簿が必須',
    body: '事業計画書・収支計画書もソフトのデータから作成できます。',
    btn1: {href: 'https://px.a8.net/svt/ejp?a8mat=4B1WM2+GEM0VM+3SPO+9FDI8Y', text: 'freeeで開業準備'},
    btn2: {href: 'https://px.a8.net/svt/ejp?a8mat=4B1WM3+1SBLE+4JGQ+1NQUK2', text: 'MFクラウド開業届'},
  },
  'hojokin2.html': {
    title: '🏢 IT補助金で会計ソフト導入が最大75%補助',
    body: 'freeeやマネーフォワードもIT導入補助金の対象。実質負担を抑えて導入できます。',
    btn1: {href: 'https://px.a8.net/svt/ejp?a8mat=4B1WM2+GEM0VM+3SPO+9FDI8Y', text: 'freee（IT補助金対象）'},
    btn2: {href: 'https://px.a8.net/svt/ejp?a8mat=4B1WM3+LGDU+4JGQ+BXB8Z', text: 'マネーフォワード'},
  },
  // 106万円の壁 → FP相談
  '106man.html': {
    title: '💼 家計の見直しは専門家に無料相談',
    body: '手取り減への対策は早めに。FPに無料で相談できます。',
    btn1: {href: 'https://px.a8.net/svt/ejp?a8mat=4B3NYZ+DOZOY+1IRY+1ZGVGH', text: 'お金の知識を無料で学ぶ'},
  },
  // 労働基準法 → 関連なし、freee人事労務
  'roudou.html': {
    title: '🏢 労務管理も自動化で楽に',
    body: '勤怠・給与計算・年末調整までクラウドで完結。',
    btn1: {href: 'https://px.a8.net/svt/ejp?a8mat=4B1WM2+GEM0VM+3SPO+9FDI8Y', text: 'freeeで労務管理'},
    btn2: {href: 'https://px.a8.net/svt/ejp?a8mat=4B1WM3+LGDU+4JGQ+BXB8Z', text: 'マネーフォワード'},
  },
  // 仮想通貨基礎 → 取引所
  'crypto-basic.html': {
    title: '₿ ビットコインを始めるなら大手取引所',
    body: '金融庁登録の国内取引所なら初心者でも安心。500円から購入可能。',
    btn1: {href: 'https://px.a8.net/svt/ejp?a8mat=4B1WM2+FXXVXU+3XCC+BYT9D', text: '松井証券で投資を始める'},
  },
  'crypto-exchange.html': {
    title: '₿ 取引所選びは初心者にとって最重要',
    body: '手数料・取扱銘柄・使いやすさで自分に合う1社を。',
    btn1: {href: 'https://px.a8.net/svt/ejp?a8mat=4B1WM2+FXXVXU+3XCC+BYT9D', text: '松井証券で投資を始める'},
  },
  'crypto-recommend.html': {
    title: '₿ まずは少額から始めてみよう',
    body: '500円〜1,000円で買えるので、まずは試してから本格運用を。',
    btn1: {href: 'https://px.a8.net/svt/ejp?a8mat=4B1WM2+FXXVXU+3XCC+BYT9D', text: '松井証券で投資を始める'},
  },
  'crypto-tax.html': {
    title: '📝 仮想通貨の確定申告は会計ソフトで',
    body: '取引履歴の集計・損益計算をソフトで自動化できます。',
    btn1: {href: 'https://px.a8.net/svt/ejp?a8mat=4B1WM3+LGDU+4JGQ+BXB8Z', text: 'マネーフォワード確定申告'},
    btn2: {href: 'https://px.a8.net/svt/ejp?a8mat=4B1WM2+GEM0VM+3SPO+9FDI8Y', text: 'freeeで申告'},
  },
  'crypto-market.html': {
    title: '₿ 円安ヘッジとして少額から検討',
    body: '長期保有を前提に、生活防衛資金を確保した上で。',
    btn1: {href: 'https://px.a8.net/svt/ejp?a8mat=4B1WM2+FXXVXU+3XCC+BYT9D', text: '松井証券で投資を始める'},
  },
};

function buildCtaHtml(cta) {
  const btns = [cta.btn1, cta.btn2].filter(Boolean).map(b =>
    `<a href="${b.href}" class="inline-cta-btn" target="_blank" rel="nofollow noopener">${b.text}</a>`
  ).join('');
  return `
<style>
.inline-cta { background: linear-gradient(135deg,#0f2d5e,#1e4d8c); border-radius: 14px; padding: 20px 22px; margin: 32px 0; color: #fff; box-shadow: 0 4px 12px rgba(15,45,94,0.15); }
.inline-cta h4 { font-size: 16px; font-weight: 900; margin: 0 0 8px; color: #fff; }
.inline-cta p { font-size: 13px; color: rgba(255,255,255,0.85); margin: 0 0 14px; line-height: 1.6; }
.inline-cta-btn { display: inline-block; background: #16a34a; color: #fff !important; font-size: 13px; font-weight: 800; padding: 10px 20px; border-radius: 24px; text-decoration: none; margin: 4px 6px 4px 0; transition: opacity 0.2s; }
.inline-cta-btn:hover { opacity: 0.85; }
.inline-cta-btn:nth-of-type(2) { background: transparent; border: 1.5px solid rgba(255,255,255,0.5); }
</style>
<div class="inline-cta">
  <h4>${cta.title}</h4>
  <p>${cta.body}</p>
  ${btns}
</div>
`;
}

function addInlineCta(slug) {
  const p = path.join(ARTICLES_DIR, slug);
  if (!fs.existsSync(p)) { console.log(`SKIP: ${slug} not found`); return false; }
  let html = fs.readFileSync(p, 'utf-8');
  const cta = CTAS[slug];
  if (!cta) { console.log(`SKIP: ${slug} no CTA defined`); return false; }
  if (html.includes('inline-cta')) { console.log(`SKIP: ${slug} already has inline CTA`); return false; }

  const ctaHtml = buildCtaHtml(cta);
  // 最初の <h2> の直前に挿入
  const h2Index = html.indexOf('<h2');
  if (h2Index === -1) { console.log(`SKIP: ${slug} no <h2> found`); return false; }
  html = html.slice(0, h2Index) + ctaHtml + html.slice(h2Index);

  fs.writeFileSync(p, html, 'utf-8');
  console.log(`✓ ${slug}: inline CTA added`);
  return true;
}

let success = 0;
for (const slug of Object.keys(CTAS)) {
  if (addInlineCta(slug)) success++;
}
console.log(`\nDone: ${success}/${Object.keys(CTAS).length} articles updated`);
