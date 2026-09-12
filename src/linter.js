const fs = require('fs');
const path = require('path');

let leksikonData = null;
function getLeksikon() {
  if (!leksikonData) {
    const leksikonPath = path.resolve(__dirname, '../data/leksikon-kata-baku.json');
    if (fs.existsSync(leksikonPath)) {
      leksikonData = JSON.parse(fs.readFileSync(leksikonPath, 'utf8'));
    } else {
      leksikonData = { kata_baku_map: {} };
    }
  }
  return leksikonData;
}

/**
 * Memeriksa teks terhadap aturan EYD Edisi V
 * @param {string} text - Teks bahasa Indonesia yang akan diperiksa
 * @returns {object} Hasil pemeriksaan berisi daftar kesalahan, saran perbaikan, dan teks yang sudah diperbaiki
 */
function checkEyd(text) {
  if (!text || typeof text !== 'string') {
    return { valid: true, errorCount: 0, errors: [], correctedText: text || '' };
  }

  const errors = [];
  let correctedText = text;
  const leksikon = getLeksikon();

  // 1. Pemeriksaan Preposisi (Kata Depan di & ke yang keliru dirangkai)
  const preposisiDiPatterns = [
    { regex: /\b(dimana)\b/gi, fix: 'di mana', rule: "Kata Depan 'di' menyatakan tempat ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(disana)\b/gi, fix: 'di sana', rule: "Kata Depan 'di' menyatakan tempat ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(disini)\b/gi, fix: 'di sini', rule: "Kata Depan 'di' menyatakan tempat ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(disitu)\b/gi, fix: 'di situ', rule: "Kata Depan 'di' menyatakan tempat ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(diantara)\b/gi, fix: 'di antara', rule: "Kata Depan 'di' menyatakan posisi/jarak ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(diatas)\b/gi, fix: 'di atas', rule: "Kata Depan 'di' menyatakan posisi/arah ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(dibawah)\b/gi, fix: 'di bawah', rule: "Kata Depan 'di' menyatakan posisi/arah ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(disamping)\b/gi, fix: 'di samping', rule: "Kata Depan 'di' menyatakan posisi ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(didepan)\b/gi, fix: 'di depan', rule: "Kata Depan 'di' menyatakan posisi ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(dibelakang)\b/gi, fix: 'di belakang', rule: "Kata Depan 'di' menyatakan posisi ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(didalam)\b/gi, fix: 'di dalam', rule: "Kata Depan 'di' menyatakan posisi ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(diluar)\b/gi, fix: 'di luar', rule: "Kata Depan 'di' menyatakan posisi ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(dirumah)\b/gi, fix: 'di rumah', rule: "Kata Depan 'di' mendahului kata tempat ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(dikantor)\b/gi, fix: 'di kantor', rule: "Kata Depan 'di' mendahului kata tempat ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(disekolah)\b/gi, fix: 'di sekolah', rule: "Kata Depan 'di' mendahului kata tempat ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" }
  ];

  const preposisiKePatterns = [
    { regex: /\b(kemana)\b/gi, fix: 'ke mana', rule: "Kata Depan 'ke' menyatakan arah ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(kesana)\b/gi, fix: 'ke sana', rule: "Kata Depan 'ke' menyatakan arah ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(kesini)\b/gi, fix: 'ke sini', rule: "Kata Depan 'ke' menyatakan arah ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(kedepan)\b/gi, fix: 'ke depan', rule: "Kata Depan 'ke' menyatakan arah ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(kebelakang)\b/gi, fix: 'ke belakang', rule: "Kata Depan 'ke' menyatakan arah ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(kedalam)\b/gi, fix: 'ke dalam', rule: "Kata Depan 'ke' menyatakan arah ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(keatas)\b/gi, fix: 'ke atas', rule: "Kata Depan 'ke' menyatakan arah ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(kebawah)\b/gi, fix: 'ke bawah', rule: "Kata Depan 'ke' menyatakan arah ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(kekantor)\b/gi, fix: 'ke kantor', rule: "Kata Depan 'ke' menyatakan tujuan ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(kesekolah)\b/gi, fix: 'ke sekolah', rule: "Kata Depan 'ke' menyatakan tujuan ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" },
    { regex: /\b(kepasar)\b/gi, fix: 'ke pasar', rule: "Kata Depan 'ke' menyatakan tujuan ditulis terpisah", ref: "eyd/penulisan-kata/kata-depan/#1" }
  ];

  [...preposisiDiPatterns, ...preposisiKePatterns].forEach(pat => {
    let match;
    while ((match = pat.regex.exec(text)) !== null) {
      const original = match[0];
      const isCapitalized = original[0] === original[0].toUpperCase();
      const suggested = isCapitalized ? pat.fix.charAt(0).toUpperCase() + pat.fix.slice(1) : pat.fix;
      errors.push({
        type: 'PREPOSISI',
        original: original,
        suggestion: suggested,
        rule: pat.rule,
        reference: pat.ref,
        index: match.index
      });
    }
  });

  // 2. Bentuk Terikat yang keliru dipisah
  const bentukTerikatPatterns = [
    { regex: /\b(pasca\s+sarjana)\b/gi, fix: 'pascasarjana', rule: "Bentuk terikat 'pasca-' ditulis serangkai", ref: "eyd/penulisan-kata/kata-turunan/#bentuk-terikat" },
    { regex: /\b(pasca\s+panen)\b/gi, fix: 'pascapanen', rule: "Bentuk terikat 'pasca-' ditulis serangkai", ref: "eyd/penulisan-kata/kata-turunan/#bentuk-terikat" },
    { regex: /\b(antar\s+kota)\b/gi, fix: 'antarkota', rule: "Bentuk terikat 'antar-' ditulis serangkai", ref: "eyd/penulisan-kata/kata-turunan/#bentuk-terikat" },
    { regex: /\b(antar\s+negara)\b/gi, fix: 'antarnegara', rule: "Bentuk terikat 'antar-' ditulis serangkai", ref: "eyd/penulisan-kata/kata-turunan/#bentuk-terikat" },
    { regex: /\b(antar\s+warga)\b/gi, fix: 'antarwarga', rule: "Bentuk terikat 'antar-' ditulis serangkai", ref: "eyd/penulisan-kata/kata-turunan/#bentuk-terikat" },
    { regex: /\b(sub\s+bagian)\b/gi, fix: 'subbagian', rule: "Bentuk terikat 'sub-' ditulis serangkai", ref: "eyd/penulisan-kata/kata-turunan/#bentuk-terikat" },
    { regex: /\b(multi\s+dimensi)\b/gi, fix: 'multidimensi', rule: "Bentuk terikat 'multi-' ditulis serangkai", ref: "eyd/penulisan-kata/kata-turunan/#bentuk-terikat" },
    { regex: /\b(non\s+aktif)\b/gi, fix: 'nonaktif', rule: "Bentuk terikat 'non-' ditulis serangkai", ref: "eyd/penulisan-kata/kata-turunan/#bentuk-terikat" },
    { regex: /\b(pra\s+nikah)\b/gi, fix: 'pranikah', rule: "Bentuk terikat 'pra-' ditulis serangkai", ref: "eyd/penulisan-kata/kata-turunan/#bentuk-terikat" },
    { regex: /\b(ekstra\s+kurikuler)\b/gi, fix: 'ekstrakurikuler', rule: "Bentuk terikat 'ekstra-' ditulis serangkai", ref: "eyd/penulisan-kata/kata-turunan/#bentuk-terikat" },
    { regex: /\b(tuna\s+wisma)\b/gi, fix: 'tunawisma', rule: "Bentuk terikat 'tuna-' ditulis serangkai", ref: "eyd/penulisan-kata/kata-turunan/#bentuk-terikat" },
    { regex: /\b(tuna\s+netra)\b/gi, fix: 'tunanetra', rule: "Bentuk terikat 'tuna-' ditulis serangkai", ref: "eyd/penulisan-kata/kata-turunan/#bentuk-terikat" },
    { regex: /\b(non\s+ASEAN)\b/gi, fix: 'non-ASEAN', rule: "Bentuk terikat diikuti huruf kapital menggunakan tanda hubung (-)", ref: "eyd/penulisan-kata/kata-turunan/#bentuk-terikat" }
  ];

  bentukTerikatPatterns.forEach(pat => {
    let match;
    while ((match = pat.regex.exec(text)) !== null) {
      errors.push({
        type: 'BENTUK_TERIKAT',
        original: match[0],
        suggestion: pat.fix,
        rule: pat.rule,
        reference: pat.ref,
        index: match.index
      });
    }
  });

  // 3. Gabungan Kata (Kata Majemuk yang keliru disambung / dipisah)
  const gabunganKataPatterns = [
    { regex: /\b(tandatangan)\b/gi, fix: 'tanda tangan', rule: "Gabungan kata dasar tanpa konfiks ditulis terpisah", ref: "eyd/penulisan-kata/kata-turunan/#gabungan-kata" },
    { regex: /\b(tanggungjawab)\b/gi, fix: 'tanggung jawab', rule: "Gabungan kata dasar tanpa konfiks ditulis terpisah", ref: "eyd/penulisan-kata/kata-turunan/#gabungan-kata" },
    { regex: /\b(kerjasama)\b/gi, fix: 'kerja sama', rule: "Gabungan kata dasar tanpa konfiks ditulis terpisah", ref: "eyd/penulisan-kata/kata-turunan/#gabungan-kata" },
    { regex: /\b(terimakasih)\b/gi, fix: 'terima kasih', rule: "Gabungan kata dasar 'terima kasih' ditulis terpisah", ref: "eyd/penulisan-kata/kata-turunan/#gabungan-kata" },
    { regex: /\b(tatabahasa)\b/gi, fix: 'tata bahasa', rule: "Gabungan kata dasar tanpa konfiks ditulis terpisah", ref: "eyd/penulisan-kata/kata-turunan/#gabungan-kata" },
    { regex: /\b(wali\s*kota)\b/gi, fix: 'wali kota', rule: "Gabungan kata 'wali kota' ditulis terpisah", ref: "eyd/penulisan-kata/kata-turunan/#gabungan-kata" },
    { regex: /\b(bertandatangan)\b/gi, fix: 'bertanda tangan', rule: "Gabungan kata dengan awalan saja ditulis terpisah", ref: "eyd/penulisan-kata/kata-turunan/#gabungan-kata" },
    { regex: /\b(bertanggungjawab)\b/gi, fix: 'bertanggung jawab', rule: "Gabungan kata dengan awalan saja ditulis terpisah", ref: "eyd/penulisan-kata/kata-turunan/#gabungan-kata" },
    { regex: /\b(bekerjasama)\b/gi, fix: 'bekerja sama', rule: "Gabungan kata dengan awalan saja ditulis terpisah", ref: "eyd/penulisan-kata/kata-turunan/#gabungan-kata" },
    { regex: /\b(pertanggung\s+jawaban)\b/gi, fix: 'pertanggungjawaban', rule: "Gabungan kata yang mendapat awalan dan akhiran sekaligus ditulis serangkai", ref: "eyd/penulisan-kata/kata-turunan/#gabungan-kata" }
  ];

  gabunganKataPatterns.forEach(pat => {
    let match;
    while ((match = pat.regex.exec(text)) !== null) {
      if (match[0].toLowerCase() === pat.fix.toLowerCase() && match[0] === pat.fix) continue;
      const original = match[0];
      const isCapitalized = original[0] === original[0].toUpperCase();
      const suggested = isCapitalized ? pat.fix.charAt(0).toUpperCase() + pat.fix.slice(1) : pat.fix;
      errors.push({
        type: 'GABUNGAN_KATA',
        original: original,
        suggestion: suggested,
        rule: pat.rule,
        reference: pat.ref,
        index: match.index
      });
    }
  });

  // 4. Partikel 'pun'
  const partikelPunPatterns = [
    { regex: /\b(apapun)\b/gi, fix: 'apa pun', rule: "Partikel 'pun' ditulis terpisah dari kata yang mendahuluinya", ref: "eyd/penulisan-kata/partikel/#pun" },
    { regex: /\b(siapapun)\b/gi, fix: 'siapa pun', rule: "Partikel 'pun' ditulis terpisah dari kata yang mendahuluinya", ref: "eyd/penulisan-kata/partikel/#pun" },
    { regex: /\b(kapanpun)\b/gi, fix: 'kapan pun', rule: "Partikel 'pun' ditulis terpisah dari kata yang mendahuluinya", ref: "eyd/penulisan-kata/partikel/#pun" },
    { regex: /\b(satupun)\b/gi, fix: 'satu pun', rule: "Partikel 'pun' ditulis terpisah dari kata yang mendahuluinya", ref: "eyd/penulisan-kata/partikel/#pun" },
    { regex: /\b(merekapun)\b/gi, fix: 'mereka pun', rule: "Partikel 'pun' ditulis terpisah dari kata yang mendahuluinya", ref: "eyd/penulisan-kata/partikel/#pun" },
    { regex: /\b(sekalipun)\b/gi, fix: 'sekali pun', rule: "Jika bermakna 'satu kali pun', partikel 'pun' ditulis terpisah (jika bermakna 'walaupun', dirangkai)", ref: "eyd/penulisan-kata/partikel/#pun", condition: (ctx) => ctx.toLowerCase().includes('tidak pernah') || ctx.toLowerCase().includes('belum pernah') }
  ];

  partikelPunPatterns.forEach(pat => {
    let match;
    while ((match = pat.regex.exec(text)) !== null) {
      if (pat.condition && !pat.condition(text)) continue;
      const original = match[0];
      const isCapitalized = original[0] === original[0].toUpperCase();
      const suggested = isCapitalized ? pat.fix.charAt(0).toUpperCase() + pat.fix.slice(1) : pat.fix;
      errors.push({
        type: 'PARTIKEL',
        original: original,
        suggestion: suggested,
        rule: pat.rule,
        reference: pat.ref,
        index: match.index
      });
    }
  });

  // 5. Kesalahan Peluluhan KTSP
  const ktspPatterns = [
    { regex: /\b(merubah)\b/gi, fix: 'mengubah', rule: "Kata dasar 'ubah' mendapat awalan meN- menjadi 'mengubah'", ref: "eyd/penulisan-kata/kata-turunan/#afiksasi" },
    { regex: /\b(merubahnya)\b/gi, fix: 'mengubahnya', rule: "Kata dasar 'ubah' mendapat awalan meN- menjadi 'mengubahnya'", ref: "eyd/penulisan-kata/kata-turunan/#afiksasi" },
    { regex: /\b(mensosialisasikan)\b/gi, fix: 'menyosialisasikan', rule: "Fonem /s/ luluh menjadi /ny/ saat diawali meN-", ref: "eyd/penulisan-kata/kata-turunan/#peluluhan-ktsp" },
    { regex: /\b(mensukseskan)\b/gi, fix: 'menyukseskan', rule: "Fonem /s/ luluh menjadi /ny/ saat diawali meN-", ref: "eyd/penulisan-kata/kata-turunan/#peluluhan-ktsp" },
    { regex: /\b(mempesona)\b/gi, fix: 'memesona', rule: "Fonem /p/ luluh menjadi /m/ saat diawali meN-", ref: "eyd/penulisan-kata/kata-turunan/#peluluhan-ktsp" },
    { regex: /\b(mempengaruhi)\b/gi, fix: 'memengaruhi', rule: "Fonem /p/ luluh menjadi /m/ saat diawali meN-", ref: "eyd/penulisan-kata/kata-turunan/#peluluhan-ktsp" },
    { regex: /\b(mentargetkan)\b/gi, fix: 'menargetkan', rule: "Fonem /t/ luluh menjadi /n/ saat diawali meN-", ref: "eyd/penulisan-kata/kata-turunan/#peluluhan-ktsp" },
    { regex: /\b(mengkelola)\b/gi, fix: 'mengelola', rule: "Fonem /k/ luluh menjadi /ng/ saat diawali meN-", ref: "eyd/penulisan-kata/kata-turunan/#peluluhan-ktsp" },
    { regex: /\b(mengritik)\b/gi, fix: 'mengkritik', rule: "Gugus konsonan /kr/ tidak luluh saat diawali meN-", ref: "eyd/penulisan-kata/kata-turunan/#peluluhan-ktsp" }
  ];

  ktspPatterns.forEach(pat => {
    let match;
    while ((match = pat.regex.exec(text)) !== null) {
      errors.push({
        type: 'PELULUHAN_KTSP',
        original: match[0],
        suggestion: pat.fix,
        rule: pat.rule,
        reference: pat.ref,
        index: match.index
      });
    }
  });

  // 6. Kata Nonbaku dari Leksikon
  if (leksikon.kata_baku_map) {
    for (const [baku, nonbakuList] of Object.entries(leksikon.kata_baku_map)) {
      for (const nonbaku of nonbakuList) {
        if (!nonbaku || nonbaku.length < 2) continue;
        const reg = new RegExp(`\\b(${nonbaku})\\b`, 'gi');
        let match;
        while ((match = reg.exec(text)) !== null) {
          const original = match[0];
          // Jangan duplikasi kesalahan yang sudah tercakup
          if (errors.some(e => e.index === match.index && e.original.toLowerCase() === original.toLowerCase())) {
            continue;
          }
          const isCapitalized = original[0] === original[0].toUpperCase();
          const suggested = isCapitalized ? baku.charAt(0).toUpperCase() + baku.slice(1) : baku;
          errors.push({
            type: 'KOSAKATA_NONBAKU',
            original: original,
            suggestion: suggested,
            rule: `Kata baku adalah '${baku}' (bukan '${original}')`,
            reference: 'KBBI & EYD V',
            index: match.index
          });
        }
      }
    }
  }

  // 7. Tanda Baca (Koma sebelum konjungsi pertentangan)
  const konjungsiPertentangan = ['tetapi', 'melainkan', 'sedangkan', 'padahal'];
  konjungsiPertentangan.forEach(konj => {
    const reg = new RegExp(`(\\S+)\\s+(${konj})\\b`, 'gi');
    let match;
    while ((match = reg.exec(text)) !== null) {
      // Periksa apakah kata sebelumnya diakhiri tanda baca
      const prevChar = match[1].slice(-1);
      if (['.', ',', '!', '?', ';', ':', '—', '-'].includes(prevChar)) continue;
      
      errors.push({
        type: 'TANDA_BACA',
        original: `${match[1]} ${match[2]}`,
        suggestion: `${match[1]}, ${match[2]}`,
        rule: `Gunakan tanda koma sebelum konjungsi pertentangan '${match[2]}' dalam kalimat majemuk setara`,
        reference: 'eyd/penggunaan-tanda-baca/tanda-koma/#3',
        index: match.index
      });
    }
  });

  // 8. Singkatan Nonbaku dengan Garis Miring (s/d, a/n, d/a, u/p)
  const singkatanPatterns = [
    { regex: /\b(s\/d)\b/gi, fix: 's.d.', rule: "Singkatan 'sampai dengan' ditulis 's.d.' (bukan 's/d')", ref: 'eyd/penulisan-kata/singkatan-dan-akronim/#1' },
    { regex: /\b(a\/n)\b/gi, fix: 'a.n.', rule: "Singkatan 'atas nama' ditulis 'a.n.' (bukan 'a/n')", ref: 'eyd/penulisan-kata/singkatan-dan-akronim/#1' },
    { regex: /\b(d\/a)\b/gi, fix: 'd.a.', rule: "Singkatan 'dengan alamat' ditulis 'd.a.' (bukan 'd/a')", ref: 'eyd/penulisan-kata/singkatan-dan-akronim/#1' },
    { regex: /\b(u\/p)\b/gi, fix: 'u.p.', rule: "Singkatan 'untuk perhatian' ditulis 'u.p.' (bukan 'u/p')", ref: 'eyd/penulisan-kata/singkatan-dan-akronim/#1' }
  ];

  singkatanPatterns.forEach(pat => {
    let match;
    while ((match = pat.regex.exec(text)) !== null) {
      const original = match[0];
      const isCapitalized = original[0] === original[0].toUpperCase();
      const suggested = isCapitalized ? pat.fix.toUpperCase() : pat.fix;
      errors.push({
        type: 'SINGKATAN',
        original: original,
        suggestion: suggested,
        rule: pat.rule,
        reference: pat.ref,
        index: match.index
      });
    }
  });

  // 9. Lambang Rupiah (Rp. 50.000 atau Rp.50.000 -> Rp50.000)
  const rupiahRegex = /\b(Rp)\.?\s*(\d+)/gi;
  let rpMatch;
  while ((rpMatch = rupiahRegex.exec(text)) !== null) {
    if (rpMatch[0] !== `Rp${rpMatch[2]}`) {
      errors.push({
        type: 'ANGKA_DAN_MATA_UANG',
        original: rpMatch[0],
        suggestion: `Rp${rpMatch[2]}`,
        rule: "Lambang 'Rp' ditulis tanpa titik dan tanpa spasi sebelum angka",
        reference: 'eyd/penulisan-kata/angka-dan-bilangan/#lambang-rupiah',
        index: rpMatch.index
      });
    }
  }

  // 10. Pleonasme (Pemborosan Kata)
  const pleonasmePatterns = [
    { regex: /\b(adalah\s+merupakan)\b/gi, fix: 'adalah', rule: "Hindari pleonasme 'adalah merupakan', pilih salah satu", ref: 'docs/kaidah-kalimat-efektif.md' },
    { regex: /\b(agar\s+supaya)\b/gi, fix: 'agar', rule: "Hindari pleonasme 'agar supaya', pilih salah satu", ref: 'docs/kaidah-kalimat-efektif.md' },
    { regex: /\b(demi\s+untuk)\b/gi, fix: 'demi', rule: "Hindari pleonasme 'demi untuk', pilih salah satu", ref: 'docs/kaidah-kalimat-efektif.md' },
    { regex: /\b(sangat\s+indah\s+sekali)\b/gi, fix: 'sangat indah', rule: "Hindari pleonasme penguat ganda 'sangat ... sekali'", ref: 'docs/kaidah-kalimat-efektif.md' }
  ];

  pleonasmePatterns.forEach(pat => {
    let match;
    while ((match = pat.regex.exec(text)) !== null) {
      errors.push({
        type: 'PLEONASME',
        original: match[0],
        suggestion: pat.fix,
        rule: pat.rule,
        reference: pat.ref,
        index: match.index
      });
    }
  });

  // Urutkan kesalahan berdasarkan posisi teks
  errors.sort((a, b) => a.index - b.index);

  // Buat teks perbaikan (replace dari belakang ke depan agar index tidak bergeser)
  const uniqueErrors = [];
  const visitedIndices = new Set();

  for (let i = errors.length - 1; i >= 0; i--) {
    const err = errors[i];
    if (visitedIndices.has(err.index)) continue;
    visitedIndices.add(err.index);
    uniqueErrors.unshift(err);

    const before = correctedText.substring(0, err.index);
    const after = correctedText.substring(err.index + err.original.length);
    correctedText = before + err.suggestion + after;
  }

  return {
    valid: uniqueErrors.length === 0,
    errorCount: uniqueErrors.length,
    errors: uniqueErrors,
    correctedText: correctedText
  };
}

module.exports = {
  checkEyd,
  getLeksikon
};
