const fs = require('fs');
const path = require('path');
const https = require('https');
const cheerio = require('cheerio');
const TurndownService = require('turndown');
const { gfm } = require('turndown-plugin-gfm');

const BASE_URL = 'https://ejaan.kemendikdasmen.go.id';

const URLS = [
  // Pendahuluan
  { url: `${BASE_URL}/`, category: '00-pendahuluan', slug: 'beranda', title: 'Beranda' },
  { url: `${BASE_URL}/eyd/`, category: '00-pendahuluan', slug: 'kata-pengantar', title: 'Kata Pengantar' },
  { url: `${BASE_URL}/eyd/surat-keputusan/`, category: '00-pendahuluan', slug: 'surat-keputusan', title: 'Surat Keputusan' },

  // I. Penggunaan Huruf
  { url: `${BASE_URL}/eyd/penggunaan-huruf/`, category: '01-penggunaan-huruf', slug: 'pengantar-penggunaan-huruf', title: 'Pengantar Penggunaan Huruf' },
  { url: `${BASE_URL}/eyd/penggunaan-huruf/huruf-abjad/`, category: '01-penggunaan-huruf', slug: 'huruf-abjad', title: 'Huruf Abjad' },
  { url: `${BASE_URL}/eyd/penggunaan-huruf/huruf-vokal/`, category: '01-penggunaan-huruf', slug: 'huruf-vokal', title: 'Huruf Vokal' },
  { url: `${BASE_URL}/eyd/penggunaan-huruf/huruf-konsonan/`, category: '01-penggunaan-huruf', slug: 'huruf-konsonan', title: 'Huruf Konsonan' },
  { url: `${BASE_URL}/eyd/penggunaan-huruf/gabungan-huruf-vokal/`, category: '01-penggunaan-huruf', slug: 'gabungan-huruf-vokal', title: 'Gabungan Huruf Vokal' },
  { url: `${BASE_URL}/eyd/penggunaan-huruf/gabungan-huruf-konsonan/`, category: '01-penggunaan-huruf', slug: 'gabungan-huruf-konsonan', title: 'Gabungan Huruf Konsonan' },
  { url: `${BASE_URL}/eyd/penggunaan-huruf/huruf-kapital/`, category: '01-penggunaan-huruf', slug: 'huruf-kapital', title: 'Huruf Kapital' },
  { url: `${BASE_URL}/eyd/penggunaan-huruf/huruf-miring/`, category: '01-penggunaan-huruf', slug: 'huruf-miring', title: 'Huruf Miring' },
  { url: `${BASE_URL}/eyd/penggunaan-huruf/huruf-tebal/`, category: '01-penggunaan-huruf', slug: 'huruf-tebal', title: 'Huruf Tebal' },

  // II. Penulisan Kata
  { url: `${BASE_URL}/eyd/penulisan-kata/`, category: '02-penulisan-kata', slug: 'pengantar-penulisan-kata', title: 'Pengantar Penulisan Kata' },
  { url: `${BASE_URL}/eyd/penulisan-kata/kata-dasar/`, category: '02-penulisan-kata', slug: 'kata-dasar', title: 'Kata Dasar' },
  { url: `${BASE_URL}/eyd/penulisan-kata/kata-turunan/`, category: '02-penulisan-kata', slug: 'kata-turunan', title: 'Kata Turunan' },
  { url: `${BASE_URL}/eyd/penulisan-kata/pemenggalan-kata/`, category: '02-penulisan-kata', slug: 'pemenggalan-kata', title: 'Pemenggalan Kata' },
  { url: `${BASE_URL}/eyd/penulisan-kata/kata-depan/`, category: '02-penulisan-kata', slug: 'kata-depan', title: 'Kata Depan' },
  { url: `${BASE_URL}/eyd/penulisan-kata/partikel/`, category: '02-penulisan-kata', slug: 'partikel', title: 'Partikel' },
  { url: `${BASE_URL}/eyd/penulisan-kata/singkatan-dan-akronim/`, category: '02-penulisan-kata', slug: 'singkatan-dan-akronim', title: 'Singkatan dan Akronim' },
  { url: `${BASE_URL}/eyd/penulisan-kata/angka-dan-bilangan/`, category: '02-penulisan-kata', slug: 'angka-dan-bilangan', title: 'Angka dan Bilangan' },
  { url: `${BASE_URL}/eyd/penulisan-kata/kata-ganti/`, category: '02-penulisan-kata', slug: 'kata-ganti', title: 'Kata Ganti ku-, kau-, -ku, -mu, dan -nya' },
  { url: `${BASE_URL}/eyd/penulisan-kata/kata-sandang/`, category: '02-penulisan-kata', slug: 'kata-sandang', title: 'Kata Sandang si dan sang' },

  // III. Penggunaan Tanda Baca
  { url: `${BASE_URL}/eyd/penggunaan-tanda-baca/`, category: '03-penggunaan-tanda-baca', slug: 'pengantar-penggunaan-tanda-baca', title: 'Pengantar Penggunaan Tanda Baca' },
  { url: `${BASE_URL}/eyd/penggunaan-tanda-baca/tanda-titik/`, category: '03-penggunaan-tanda-baca', slug: 'tanda-titik', title: 'Tanda Titik (.)' },
  { url: `${BASE_URL}/eyd/penggunaan-tanda-baca/tanda-koma/`, category: '03-penggunaan-tanda-baca', slug: 'tanda-koma', title: 'Tanda Koma (,)' },
  { url: `${BASE_URL}/eyd/penggunaan-tanda-baca/tanda-titik-koma/`, category: '03-penggunaan-tanda-baca', slug: 'tanda-titik-koma', title: 'Tanda Titik Koma (;)' },
  { url: `${BASE_URL}/eyd/penggunaan-tanda-baca/tanda-titik-dua/`, category: '03-penggunaan-tanda-baca', slug: 'tanda-titik-dua', title: 'Tanda Titik Dua (:)' },
  { url: `${BASE_URL}/eyd/penggunaan-tanda-baca/tanda-hubung/`, category: '03-penggunaan-tanda-baca', slug: 'tanda-hubung', title: 'Tanda Hubung (-)' },
  { url: `${BASE_URL}/eyd/penggunaan-tanda-baca/tanda-pisah/`, category: '03-penggunaan-tanda-baca', slug: 'tanda-pisah', title: 'Tanda Pisah (—)' },
  { url: `${BASE_URL}/eyd/penggunaan-tanda-baca/tanda-tanya/`, category: '03-penggunaan-tanda-baca', slug: 'tanda-tanya', title: 'Tanda Tanya (?)' },
  { url: `${BASE_URL}/eyd/penggunaan-tanda-baca/tanda-seru/`, category: '03-penggunaan-tanda-baca', slug: 'tanda-seru', title: 'Tanda Seru (!)' },
  { url: `${BASE_URL}/eyd/penggunaan-tanda-baca/tanda-elipsis/`, category: '03-penggunaan-tanda-baca', slug: 'tanda-elipsis', title: 'Tanda Elipsis (…)' },
  { url: `${BASE_URL}/eyd/penggunaan-tanda-baca/tanda-petik/`, category: '03-penggunaan-tanda-baca', slug: 'tanda-petik', title: 'Tanda Petik ("…")' },
  { url: `${BASE_URL}/eyd/penggunaan-tanda-baca/tanda-petik-tunggal/`, category: '03-penggunaan-tanda-baca', slug: 'tanda-petik-tunggal', title: 'Tanda Petik Tunggal (\'…\')' },
  { url: `${BASE_URL}/eyd/penggunaan-tanda-baca/tanda-kurung/`, category: '03-penggunaan-tanda-baca', slug: 'tanda-kurung', title: 'Tanda Kurung ((…))' },
  { url: `${BASE_URL}/eyd/penggunaan-tanda-baca/tanda-kurung-siku/`, category: '03-penggunaan-tanda-baca', slug: 'tanda-kurung-siku', title: 'Tanda Kurung Siku ([…])' },
  { url: `${BASE_URL}/eyd/penggunaan-tanda-baca/tanda-garis-miring/`, category: '03-penggunaan-tanda-baca', slug: 'tanda-garis-miring', title: 'Tanda Garis Miring (/)' },
  { url: `${BASE_URL}/eyd/penggunaan-tanda-baca/tanda-penyingkat-apostrof/`, category: '03-penggunaan-tanda-baca', slug: 'tanda-penyingkat-apostrof', title: 'Tanda Apostrof (\')' },

  // IV. Penulisan Unsur Serapan
  { url: `${BASE_URL}/eyd/unsur-serapan/`, category: '04-penulisan-unsur-serapan', slug: 'pengantar-unsur-serapan', title: 'Pengantar Unsur Serapan' },
  { url: `${BASE_URL}/eyd/unsur-serapan/umum/`, category: '04-penulisan-unsur-serapan', slug: 'serapan-umum', title: 'Serapan Umum' },
  { url: `${BASE_URL}/eyd/unsur-serapan/khusus/`, category: '04-penulisan-unsur-serapan', slug: 'serapan-khusus', title: 'Serapan Khusus' }
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EYD-V-Scraper/1.0)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = BASE_URL + redirectUrl;
        }
        return resolve(fetchUrl(redirectUrl));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch ${url}: status code ${res.statusCode}`));
      }
      let rawData = '';
      res.setEncoding('utf8');
      res.on('data', chunk => rawData += chunk);
      res.on('end', () => resolve(rawData));
    }).on('error', reject);
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('🚀 Memulai proses scraping EYD Edisi V dari https://ejaan.kemendikdasmen.go.id ...');

  const rootDir = path.resolve(__dirname, '..');
  const docsDir = path.join(rootDir, 'docs');
  const dataDir = path.join(rootDir, 'data');

  fs.mkdirSync(docsDir, { recursive: true });
  fs.mkdirSync(dataDir, { recursive: true });

  // Unduh search_index.json resmi terlebih dahulu
  console.log('📥 Mengunduh search_index.json resmi...');
  try {
    const rawSearch = await fetchUrl(`${BASE_URL}/search/search_index.json`);
    fs.writeFileSync(path.join(dataDir, 'raw-search-index.json'), rawSearch, 'utf8');
    console.log('✅ Berhasil mengunduh raw-search-index.json');
  } catch (err) {
    console.warn('⚠️ Gagal mengunduh raw-search-index.json:', err.message);
  }

  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    hr: '---'
  });
  td.use(gfm);

  // Custom rule for admonition examples
  td.addRule('admonitionExample', {
    filter: (node) => node.nodeName === 'DIV' && node.classList && node.classList.contains('admonition'),
    replacement: (content, node) => {
      const title = node.querySelector ? node.querySelector('.admonition-title') : null;
      const titleText = title ? title.textContent.trim() : 'Contoh:';
      const clone = node.cloneNode(true);
      const cloneTitle = clone.querySelector ? clone.querySelector('.admonition-title') : null;
      if (cloneTitle) cloneTitle.remove();
      const bodyMd = td.turndown(clone.innerHTML || '');
      return `\n\n> **${titleText}**\n${bodyMd.split('\n').map(l => '> ' + l).join('\n')}\n\n`;
    }
  });

  const allRulesStructured = [];
  const ragChunks = [];

  for (let i = 0; i < URLS.length; i++) {
    const item = URLS[i];
    console.log(`[${i + 1}/${URLS.length}] Mengambil: ${item.title} (${item.url})`);

    try {
      const html = await fetchUrl(item.url);
      const $ = cheerio.load(html);

      const article = $('article.md-content__inner');
      if (!article.length) {
        console.warn(`⚠️ Tidak menemukan elemen artikel pada ${item.url}`);
        continue;
      }

      // Bersihkan tombol/anchor internal yang mengganggu
      article.find('.headerlink').remove();
      article.find('.md-clipboard').remove();

      // Buat Markdown
      const mdContent = td.turndown(article.html());
      const catDir = path.join(docsDir, item.category);
      fs.mkdirSync(catDir, { recursive: true });

      const frontmatter = `---
title: "${item.title.replace(/"/g, '\\"')}"
category: "${item.category}"
source_url: "${item.url}"
edition: "EYD Edisi V (2022-sekarang)"
---

`;
      fs.writeFileSync(path.join(catDir, `${item.slug}.md`), frontmatter + mdContent, 'utf8');

      // Parsing struktur per aturan untuk JSON & RAG Chunks
      const pageTitle = article.find('h1').first().text().trim() || item.title;
      const pageRules = [];

      // Telusuri heading aturan (h2, h3, h4) atau paragraf kaidah
      const headings = article.find('h2, h3, h4');
      if (headings.length > 0) {
        headings.each((idx, el) => {
          const heading = $(el);
          const ruleTitle = heading.text().trim();
          const ruleId = heading.attr('id') || `${item.slug}-${idx + 1}`;

          // Ambil elemen siblings sampai heading berikutnya
          const contents = [];
          const examples = [];
          const notes = [];

          let curr = heading.next();
          while (curr.length && !curr.is('h1, h2, h3, h4')) {
            if (curr.hasClass('admonition')) {
              examples.push(curr.text().trim().replace(/^Misalnya:\s*/i, ''));
            } else if (curr.text().toLowerCase().includes('catatan:') || curr.find('label:contains("Catatan")').length) {
              notes.push(curr.text().trim());
            } else if (curr.is('table')) {
              contents.push(td.turndown($.html(curr)));
            } else {
              const txt = curr.text().trim();
              if (txt) contents.push(txt);
            }
            curr = curr.next();
          }

          const ruleObj = {
            id: `${item.slug}#${ruleId}`,
            category: item.category,
            section: pageTitle,
            title: ruleTitle,
            explanation: contents.join('\n\n'),
            examples: examples,
            notes: notes,
            url: `${item.url}#${ruleId}`
          };

          pageRules.push(ruleObj);

          // Buat chunk untuk RAG
          ragChunks.push({
            id: ruleObj.id,
            category: item.category,
            section: pageTitle,
            title: ruleTitle,
            content: `${pageTitle} - ${ruleTitle}\n\nKaidah:\n${contents.join('\n')}\n\nContoh:\n${examples.join('\n')}\n\nCatatan:\n${notes.join('\n')}`.trim(),
            examples: examples,
            url: ruleObj.url,
            tags: [item.category.replace(/^\d+-/, ''), item.slug, ...ruleTitle.toLowerCase().split(/\W+/).filter(w => w.length > 3)]
          });
        });
      } else {
        // Halaman umum / pengantar tanpa h2-h4 bertingkat
        const textContent = article.text().trim();
        const ruleObj = {
          id: item.slug,
          category: item.category,
          section: pageTitle,
          title: pageTitle,
          explanation: textContent,
          examples: [],
          notes: [],
          url: item.url
        };
        pageRules.push(ruleObj);
        ragChunks.push({
          id: item.slug,
          category: item.category,
          section: pageTitle,
          title: pageTitle,
          content: textContent,
          examples: [],
          url: item.url,
          tags: [item.category.replace(/^\d+-/, ''), item.slug]
        });
      }

      allRulesStructured.push({
        title: item.title,
        slug: item.slug,
        category: item.category,
        url: item.url,
        rules: pageRules
      });

      // Tunggu 100ms agar ramah server
      await sleep(100);
    } catch (err) {
      console.error(`❌ Gagal memproses ${item.url}:`, err.message);
    }
  }

  // Simpan JSON master
  console.log('💾 Menyimpan basis data terstruktur data/eyd-v-all-rules.json ...');
  fs.writeFileSync(path.join(dataDir, 'eyd-v-all-rules.json'), JSON.stringify(allRulesStructured, null, 2), 'utf8');

  console.log('💾 Menyimpan dataset RAG data/eyd-v-chunks.jsonl ...');
  const jsonlLines = ragChunks.map(c => JSON.stringify(c)).join('\n');
  fs.writeFileSync(path.join(dataDir, 'eyd-v-chunks.jsonl'), jsonlLines, 'utf8');

  console.log(`\n🎉 SELESAI! Berhasil memproses ${allRulesStructured.length} dokumen, menghasilkan ${ragChunks.length} chunks aturan RAG terstruktur.`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
