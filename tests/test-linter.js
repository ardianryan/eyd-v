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
  console.log(`Hasil Uji: ${passed} Lulus, ${failed} Gagal (${Math.round((passed / testCases.length) * 100)}% Sukses)`);
  console.log(`========================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runBenchmark();
