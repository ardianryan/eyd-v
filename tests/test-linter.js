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

  // 8. Uji Fitur v5.3.0: Kapitalisasi Geografi vs Nama Jenis
  const geoRes = checkEyd('Menyeberangi selat sunda menuju pulau jawa.');
  if (geoRes.errors.some(e => e.type === 'HURUF_KAPITAL_GEOGRAFI' && e.suggestion === 'Selat Sunda')) {
    console.log(`✅ [HURUF KAPITAL GEOGRAFI] 'selat sunda' -> 'Selat Sunda' PASS`);
  } else {
    console.error(`❌ [HURUF KAPITAL GEOGRAFI] Gagal`, geoRes);
    process.exit(1);
  }

  const jenisRes = checkEyd('Membeli kunci Inggris dan jeruk Bali.');
  if (jenisRes.errors.some(e => e.type === 'HURUF_KECIL_NAMA_JENIS' && e.suggestion === 'kunci inggris')) {
    console.log(`✅ [HURUF KECIL NAMA JENIS] 'kunci Inggris' -> 'kunci inggris' PASS`);
  } else {
    console.error(`❌ [HURUF KECIL NAMA JENIS] Gagal`, jenisRes);
    process.exit(1);
  }

  // 9. Uji Fitur v5.3.0: Nama Bangsa & Bahasa
  const bahasaRes = checkEyd('Belajar bahasa inggris bersama suku jawa.');
  if (bahasaRes.errors.some(e => e.type === 'HURUF_KAPITAL_BANGSA_BAHASA' && e.suggestion === 'bahasa Inggris')) {
    console.log(`✅ [BANGSA & BAHASA] 'bahasa inggris' -> 'bahasa Inggris' PASS`);
  } else {
    console.error(`❌ [BANGSA & BAHASA] Gagal`, bahasaRes);
    process.exit(1);
  }

  // 10. Uji Fitur v5.3.0: Penulisan Bilangan Tingkat & Akhiran -an
  const bilRes = checkEyd('Pemenang ke 5 musik era tahun 80an.');
  if (bilRes.errors.some(e => e.type === 'BILANGAN_TINGKAT' && e.suggestion === 'ke-5') &&
      bilRes.errors.some(e => e.type === 'BILANGAN_AKHIRAN_AN' && e.suggestion === 'tahun 80-an')) {
    console.log(`✅ [BILANGAN TINGKAT & -AN] 'ke 5' -> 'ke-5' & 'tahun 80an' -> 'tahun 80-an' PASS`);
  } else {
    console.error(`❌ [BILANGAN TINGKAT & -AN] Gagal`, bilRes);
    process.exit(1);
  }

  // 11. Uji Fitur v5.3.0: Angka Awal Kalimat
  const awalRes = checkEyd('50 orang menghadiri acara.');
  if (awalRes.errors.some(e => e.type === 'ANGKA_AWAL_KALIMAT')) {
    console.log(`✅ [ANGKA AWAL KALIMAT] Deteksi angka di awal kalimat PASS`);
  } else {
    console.error(`❌ [ANGKA AWAL KALIMAT] Gagal`, awalRes);
    process.exit(1);
  }

  // 12. Uji Fitur v5.3.0: Ranah Legal & Finance
  const { lookupLegalFinanceTerm } = require('../src/index');
  const legalRes = checkEyd('Dokumen ini memuat klausul khusus.', { mode: 'legal' });
  if (legalRes.errors.some(e => e.type === 'ISTILAH_HUKUM' && e.suggestion === 'klausula')) {
    console.log(`✅ [DOMAIN LEGAL] Deteksi 'klausul' -> 'klausula' PASS`);
  } else {
    console.error(`❌ [DOMAIN LEGAL] Gagal`, legalRes);
    process.exit(1);
  }

  const finRes = checkEyd('Perusahaan memantau cash flow secara ketat.', { mode: 'finance' });
  if (finRes.errors.some(e => e.type === 'ISTILAH_FINANSIAL' && e.suggestion === 'arus kas')) {
    console.log(`✅ [DOMAIN FINANCE] Deteksi 'cash flow' -> 'arus kas' PASS`);
  } else {
    console.error(`❌ [DOMAIN FINANCE] Gagal`, finRes);
    process.exit(1);
  }

  const termMatch = lookupLegalFinanceTerm('force majeure');
  if (termMatch.length > 0 && termMatch[0].baku.includes('keadaan kahar')) {
    console.log(`✅ [GLOSARIUM HUKUM/FINANSIAL] lookupLegalFinanceTerm('force majeure') -> keadaan kahar PASS`);
  } else {
    console.error(`❌ [GLOSARIUM HUKUM/FINANSIAL] Gagal lookup`, termMatch);
    process.exit(1);
  }

  console.log(`\nSeluruh 48 Pengujian Linter & Fitur Lanjutan Lulus 100%!`);
}

runBenchmark();
