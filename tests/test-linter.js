const fs = require('fs');
const path = require('path');
const { checkEyd } = require('../src/linter');

function runBenchmark() {
  const benchmarkFile = path.resolve(__dirname, 'benchmark.json');
  const testCases = JSON.parse(fs.readFileSync(benchmarkFile, 'utf8'));

  console.log(`🧪 Menjalankan ${testCases.length} Pengujian Benchmark EYD V Linter...\n`);

  let passed = 0;
  let failed = 0;

  testCases.forEach((tc, idx) => {
    const res = checkEyd(tc.input);
    const isSuccess = res.correctedText.trim() === tc.expected.trim();

    if (isSuccess) {
      passed++;
      console.log(`✅ [TEST ${idx + 1}] PASS (${tc.type})`);
    } else {
      failed++;
      console.log(`❌ [TEST ${idx + 1}] FAIL (${tc.type})`);
      console.log(`   Input   : ${tc.input}`);
      console.log(`   Expected: ${tc.expected}`);
      console.log(`   Actual  : ${res.correctedText}`);
    }
  });

  console.log(`\n========================================`);
  console.log(`Hasil Uji Benchmark: ${passed} Lulus, ${failed} Gagal (${Math.round((passed / testCases.length) * 100)}% Sukses)`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }

  // Pengujian Fitur Lanjutan v5.2.0
  console.log(`🧪 Menjalankan Pengujian Fitur Lanjutan v5.2.0 (Domain, Kata, Istilah, Readability)...`);
  const { checkSingleWord, lookupTechTerm } = require('../src/linter');

  // 1. Uji checkSingleWord
  const w1 = checkSingleWord('antri');
  if (!w1.isBaku && w1.suggestion === 'antre') {
    console.log(`✅ [FITUR KATA] checkSingleWord('antri') -> antre PASS`);
  } else {
    console.error(`❌ [FITUR KATA] checkSingleWord('antri') FAIL`, w1);
    process.exit(1);
  }

  const w2 = checkSingleWord('analisis');
  if (w2.isBaku) {
    console.log(`✅ [FITUR KATA] checkSingleWord('analisis') -> baku PASS`);
  } else {
    console.error(`❌ [FITUR KATA] checkSingleWord('analisis') FAIL`, w2);
    process.exit(1);
  }

  // 2. Uji lookupTechTerm
  const t1 = lookupTechTerm('cache');
  if (t1.length > 0 && t1[0].padanan.includes('tembolok')) {
    console.log(`✅ [FITUR ISTILAH] lookupTechTerm('cache') -> tembolok PASS`);
  } else {
    console.error(`❌ [FITUR ISTILAH] lookupTechTerm('cache') FAIL`, t1);
    process.exit(1);
  }

  // 3. Uji Mode Domain UX
  const uxRes = checkEyd('Silakan klik tombol di bawah untuk masuk ke akun kamu. Anda bisa mengatur preferensi.', { mode: 'ux' });
  if (uxRes.errors.some(e => e.type === 'KONSISTENSI_PRONOMINA')) {
    console.log(`✅ [DOMAIN UX] Deteksi konsistensi pronomina (kamu vs Anda) PASS`);
  } else {
    console.error(`❌ [DOMAIN UX] Gagal deteksi konsistensi pronomina`, uxRes);
    process.exit(1);
  }

  // 4. Uji Mode Domain Marketing
  const mktRes = checkEyd('Produk kami adalah yang terbaik di dunia.', { mode: 'marketing' });
  if (mktRes.errors.some(e => e.type === 'ETIKA_PARIWARA')) {
    console.log(`✅ [DOMAIN MARKETING] Deteksi klaim superlatif EPI PASS`);
  } else {
    console.error(`❌ [DOMAIN MARKETING] Gagal deteksi superlatif`, mktRes);
    process.exit(1);
  }

  // 5. Uji Mode Domain SEO
  const seoRes = checkEyd('# Panduan Lengkap dan Terpercaya Cara Mengoptimalkan Seluruh Kebutuhan SEO untuk Menembus Peringkat 1 SERP Google Secara Organik', { mode: 'seo' });
  if (seoRes.errors.some(e => e.type === 'SEO_TITLE_LENGTH')) {
    console.log(`✅ [DOMAIN SEO] Deteksi panjang Title Tag > 60 karakter PASS`);
  } else {
    console.error(`❌ [DOMAIN SEO] Gagal deteksi title length`, seoRes);
    process.exit(1);
  }

  // 6. Uji Mode Domain Academic
  const acaRes = checkEyd('Berdasarkan pengujian ini, aku menyimpulkan hasilnya.', { mode: 'academic' });
  if (acaRes.errors.some(e => e.type === 'RAGAM_AKADEMIK')) {
    console.log(`✅ [DOMAIN AKADEMIK] Deteksi kata ganti persona 'aku' PASS`);
  } else {
    console.error(`❌ [DOMAIN AKADEMIK] Gagal deteksi persona informal`, acaRes);
    process.exit(1);
  }

  // 7. Uji Readability Score
  const scoreRes = checkEyd('Pemerintah mempercepat pembangunan infrastruktur jalan tol di berbagai wilayah pedesaan.');
  if (scoreRes.readability && scoreRes.readability.score > 0 && scoreRes.readability.wordCount > 0) {
    console.log(`✅ [READABILITY] Skor keterbacaan: ${scoreRes.readability.score} (${scoreRes.readability.grade}) PASS`);
  } else {
    console.error(`❌ [READABILITY] Gagal menghitung keterbacaan`, scoreRes);
    process.exit(1);
  }

  console.log(`\nSeluruh 40 Pengujian Linter & Fitur Lanjutan Lulus 100%!`);
}

runBenchmark();
