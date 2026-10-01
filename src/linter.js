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
 * Memeriksa teks terhadap aturan EYD Edisi V dan ranah profesional
 * @param {string} text - Teks bahasa Indonesia yang akan diperiksa
 * @param {object} options - Opsi pemeriksaan (mode, ignoreWords, preferredPronoun)
 * @returns {object} Hasil pemeriksaan berisi daftar kesalahan, saran perbaikan, teks yang sudah diperbaiki, dan skor keterbacaan
 */
function checkEyd(text, options = {}) {
  if (!text || typeof text !== 'string') {
    return { valid: true, errorCount: 0, errors: [], correctedText: text || '', readability: null };
  }

  const mode = options.mode || 'general'; // 'general' | 'ux' | 'marketing' | 'seo' | 'academic'
  const ignoreWords = (options.ignoreWords || []).map(w => w.toLowerCase());
  const preferredPronoun = options.preferredPronoun || null;

  const errors = [];
  let correctedText = text;
  const leksikon = getLeksikon();

  // Preposisi penunjuk tempat atau arah (EYD V Bab II.D)
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

  // Bentuk terikat (EYD V Bab II.B)
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

  // Gabungan kata atau kata majemuk (EYD V Bab II.C)
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

  // Partikel 'pun' terpisah vs 12 konjungsi serangkai (EYD V Bab II.E)
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

  // Peluluhan fonem k, t, s, p dengan awalan meN- / peN-
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

  // Penyelarasan kata baku berbasis leksikon KBBI VI
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

  // Tanda koma sebelum konjungsi pertentangan (EYD V Bab III.B)
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

  // Pencegahan tanda koma sebelum konjungsi subordinatif (EYD V Bab III.B #4)
  // EYD V Tanda Koma #4: Tanda koma TIDAK digunakan jika anak kalimat mengiringi induk kalimat
  const konjungsiSubordinatif = ['karena', 'sebab', 'sehingga', 'bahwa', 'agar', 'supaya'];
  konjungsiSubordinatif.forEach(konj => {
    const reg = new RegExp(`(\\w+)(,\\s+)(${konj})\\b`, 'gi');
    let match;
    while ((match = reg.exec(text)) !== null) {
      errors.push({
        type: 'TANDA_BACA_SUBORDINATIF',
        original: match[0],
        suggestion: `${match[1]} ${match[3]}`,
        rule: `Tanda koma tidak digunakan sebelum konjungsi subordinatif '${match[3]}' jika anak kalimat berada di belakang induk kalimat`,
        reference: 'eyd/penggunaan-tanda-baca/tanda-koma/#4',
        index: match.index
      });
    }
  });

  // Singkatan umum tiga huruf bertitik tanpa garis miring (EYD V Bab II.F)
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

  // Format lambang rupiah tanpa titik atau spasi (EYD V Bab II.G)
  const rupiahRegex = /\b(Rp)\.?\s*(\d+(?:\.\d+)*)(?:,-)?\b/gi;
  let rpMatch;
  while ((rpMatch = rupiahRegex.exec(text)) !== null) {
    const cleanNum = rpMatch[2];
    if (rpMatch[0] !== `Rp${cleanNum}`) {
      errors.push({
        type: 'ANGKA_DAN_MATA_UANG',
        original: rpMatch[0],
        suggestion: `Rp${cleanNum}`,
        rule: "Lambang 'Rp' ditulis tanpa titik dan tanpa spasi sebelum angka",
        reference: 'eyd/penulisan-kata/angka-dan-bilangan/#lambang-rupiah',
        index: rpMatch.index
      });
    }
  }

  // Pemisah waktu menggunakan tanda titik (EYD V Bab III.A #2)
  // Contoh: pukul 08:30 -> pukul 08.30, 08:30 WIB -> 08.30 WIB
  const waktuPatterns = [
    { regex: /\b(pukul|jam)\s+([01]?\d|2[0-3]):([0-5]\d)\b/gi, fix: (m, p1, p2, p3) => `${p1} ${p2}.${p3}` },
    { regex: /\b([01]?\d|2[0-3]):([0-5]\d)(\s+(?:WIB|WITA|WIT))\b/gi, fix: (m, p1, p2, p3) => `${p1}.${p2}${p3}` }
  ];
  waktuPatterns.forEach(pat => {
    let match;
    while ((match = pat.regex.exec(text)) !== null) {
      errors.push({
        type: 'TANDA_BACA_WAKTU',
        original: match[0],
        suggestion: pat.fix(...match),
        rule: "Tanda titik digunakan untuk memisahkan angka jam, menit, dan detik (bukan tanda titik dua)",
        reference: 'eyd/penggunaan-tanda-baca/tanda-titik/#2',
        index: match.index
      });
    }
  });

  // Rentang bilangan dan tanggal menggunakan tanda pisah en dash (EYD V Bab III.F)
  // Contoh: 10-15 September -> 10–15 September
  const rentangTanggalRegex = /\b(\d{1,2})\s*-\s*(\d{1,2})\s+(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\b/gi;
  let rentangMatch;
  while ((rentangMatch = rentangTanggalRegex.exec(text)) !== null) {
    errors.push({
      type: 'TANDA_PISAH_RENTANG',
      original: rentangMatch[0],
      suggestion: `${rentangMatch[1]}–${rentangMatch[2]} ${rentangMatch[3]}`,
      rule: "Tanda pisah en dash (–) digunakan di antara dua bilangan atau tanggal yang berarti 'sampai dengan'",
      reference: 'eyd/penggunaan-tanda-baca/tanda-pisah/#2',
      index: rentangMatch.index
    });
  }

  // Huruf kapital nama geografi yang diikuti nama diri (EYD V Bab I.B #6)
  const unsurGeografi = ['pulau', 'gunung', 'sungai', 'danau', 'selat', 'teluk', 'bukit', 'lembah', 'pegunungan', 'kota', 'kabupaten', 'provinsi'];
  const namaDiriGeografi = [
    'jawa', 'sumatra', 'sumatera', 'kalimantan', 'sulawesi', 'papua', 'bali', 'lombok', 'madura', 'flores',
    'merapi', 'bromo', 'semeru', 'rinjani', 'kerinci', 'sinabung', 'krakatau',
    'musi', 'kapuas', 'barito', 'mahakam', 'ciliwung', 'cisadane',
    'toba', 'poso', 'singkarak', 'matano',
    'sunda', 'malaka', 'makassar'
  ];
  const geografiRegex = new RegExp(`\\b(${unsurGeografi.join('|')})\\s+(${namaDiriGeografi.join('|')})\\b`, 'gi');
  let geoMatch;
  while ((geoMatch = geografiRegex.exec(text)) !== null) {
    const p1 = geoMatch[1];
    const p2 = geoMatch[2];
    const expected = p1.charAt(0).toUpperCase() + p1.slice(1).toLowerCase() + ' ' + p2.charAt(0).toUpperCase() + p2.slice(1).toLowerCase();
    if (geoMatch[0] !== expected) {
      errors.push({
        type: 'HURUF_KAPITAL_GEOGRAFI',
        original: geoMatch[0],
        suggestion: expected,
        rule: "Huruf kapital digunakan sebagai huruf pertama nama geografi yang diikuti nama diri",
        reference: 'eyd/penggunaan-huruf/huruf-kapital/#6',
        index: geoMatch.index
      });
    }
  }

  // Huruf kecil untuk nama jenis yang berasal dari nama geografi (EYD V Bab I.B #6 Catatan)
  const namaJenisPatterns = [
    { regex: /\b(kunci\s+Inggris)\b/g, fix: 'kunci inggris', rule: "Nama jenis ditulis dengan huruf kecil: 'kunci inggris'", ref: 'eyd/penggunaan-huruf/huruf-kapital/#6-catatan' },
    { regex: /\b(jeruk\s+Bali)\b/g, fix: 'jeruk bali', rule: "Nama jenis ditulis dengan huruf kecil: 'jeruk bali'", ref: 'eyd/penggunaan-huruf/huruf-kapital/#6-catatan' },
    { regex: /\b(petai\s+Cina)\b/g, fix: 'petai cina', rule: "Nama jenis ditulis dengan huruf kecil: 'petai cina'", ref: 'eyd/penggunaan-huruf/huruf-kapital/#6-catatan' },
    { regex: /\b(pisang\s+Ambon)\b/g, fix: 'pisang ambon', rule: "Nama jenis ditulis dengan huruf kecil: 'pisang ambon'", ref: 'eyd/penggunaan-huruf/huruf-kapital/#6-catatan' },
    { regex: /\b(bika\s+Ambon)\b/g, fix: 'bika ambon', rule: "Nama jenis makanan ditulis dengan huruf kecil: 'bika ambon'", ref: 'eyd/penggunaan-huruf/huruf-kapital/#6-catatan' },
    { regex: /\b(gula\s+Jawa)\b/g, fix: 'gula jawa', rule: "Nama jenis ditulis dengan huruf kecil: 'gula jawa'", ref: 'eyd/penggunaan-huruf/huruf-kapital/#6-catatan' },
    { regex: /\b(garam\s+Inggris)\b/g, fix: 'garam inggris', rule: "Nama jenis ditulis dengan huruf kecil: 'garam inggris'", ref: 'eyd/penggunaan-huruf/huruf-kapital/#6-catatan' },
    { regex: /\b(salak\s+Pondoh)\b/g, fix: 'salak pondoh', rule: "Nama jenis ditulis dengan huruf kecil: 'salak pondoh'", ref: 'eyd/penggunaan-huruf/huruf-kapital/#6-catatan' }
  ];
  namaJenisPatterns.forEach(pat => {
    let match;
    while ((match = pat.regex.exec(text)) !== null) {
      errors.push({
        type: 'HURUF_KECIL_NAMA_JENIS',
        original: match[0],
        suggestion: pat.fix,
        rule: pat.rule,
        reference: pat.ref,
        index: match.index
      });
    }
  });

  // Huruf kapital untuk nama bangsa, suku bangsa, dan bahasa (EYD V Bab I.B #5)
  const bangsaBahasaPatterns = [
    { regex: /\b(bahasa)\s+(indonesia|inggris|jepang|jerman|prancis|arab|mandarin|belanda)\b/g, fix: (m, p1, p2) => `${p1} ${p2.charAt(0).toUpperCase() + p2.slice(1)}`, rule: "Nama bahasa diawali huruf kapital", ref: 'eyd/penggunaan-huruf/huruf-kapital/#5' },
    { regex: /\b(suku)\s+(jawa|sunda|batak|dayak|bugis|minang|bali|madura|banjar)\b/g, fix: (m, p1, p2) => `${p1} ${p2.charAt(0).toUpperCase() + p2.slice(1)}`, rule: "Nama suku bangsa diawali huruf kapital", ref: 'eyd/penggunaan-huruf/huruf-kapital/#5' },
    { regex: /\b(bangsa)\s+(indonesia)\b/g, fix: (m, p1, p2) => `${p1} ${p2.charAt(0).toUpperCase() + p2.slice(1)}`, rule: "Nama bangsa diawali huruf kapital", ref: 'eyd/penggunaan-huruf/huruf-kapital/#5' }
  ];
  bangsaBahasaPatterns.forEach(pat => {
    let match;
    while ((match = pat.regex.exec(text)) !== null) {
      errors.push({
        type: 'HURUF_KAPITAL_BANGSA_BAHASA',
        original: match[0],
        suggestion: pat.fix(...match),
        rule: pat.rule,
        reference: pat.ref,
        index: match.index
      });
    }
  });

  // Bilangan tingkat dengan angka menggunakan 'ke-' bertanda hubung (EYD V Bab II.G)
  const bilanganTingkatRegex = /\b(ke)\s*(\d+)\b/gi;
  let btMatch;
  while ((btMatch = bilanganTingkatRegex.exec(text)) !== null) {
    if (btMatch[0] !== `ke-${btMatch[2]}`) {
      errors.push({
        type: 'BILANGAN_TINGKAT',
        original: btMatch[0],
        suggestion: `ke-${btMatch[2]}`,
        rule: "Bilangan tingkat yang ditulis dengan angka dirangkaikan dengan tanda hubung setelah 'ke-'",
        reference: 'eyd/penulisan-kata/angka-dan-bilangan/#bilangan-tingkat',
        index: btMatch.index
      });
    }
  }

  // Bilangan berakhiran -an menggunakan tanda hubung (EYD V Bab II.G)
  const bilanganAkhiranAnRegex = /\b(tahun\s+)?(\d{2,4})\s*an\b/gi;
  let anMatch;
  while ((anMatch = bilanganAkhiranAnRegex.exec(text)) !== null) {
    const prefix = anMatch[1] || '';
    const num = anMatch[2];
    const expected = `${prefix}${num}-an`;
    if (anMatch[0] !== expected) {
      errors.push({
        type: 'BILANGAN_AKHIRAN_AN',
        original: anMatch[0],
        suggestion: expected,
        rule: "Bilangan yang mendapat akhiran '-an' dirangkaikan dengan tanda hubung",
        reference: 'eyd/penulisan-kata/angka-dan-bilangan/#akhiran-an',
        index: anMatch.index
      });
    }
  }

  // Bilangan pada awal kalimat (EYD V Bab II.G #3)
  const awalKalimatAngkaRegex = /(?:^|[.!?]\s+)(\d+)\s+([a-zA-Z]+)/g;
  let akMatch;
  while ((akMatch = awalKalimatAngkaRegex.exec(text)) !== null) {
    const full = akMatch[0];
    const num = akMatch[1];
    const word = akMatch[2];
    const matchOffset = full.indexOf(num);
    const startIdx = akMatch.index + matchOffset;
    errors.push({
      type: 'ANGKA_AWAL_KALIMAT',
      original: `${num} ${word}`,
      suggestion: 'Tulis huruf atau susun ulang kalimat',
      rule: "Bilangan pada awal kalimat ditulis dengan huruf atau susunan kalimat diubah",
      reference: 'eyd/penulisan-kata/angka-dan-bilangan/#awal-kalimat',
      index: startIdx
    });
  }

  // Eliminasi klise dan frasa penggelembung tanpa substansi
  const pleonasmePatterns = [
    { regex: /\b(adalah\s+merupakan)\b/gi, fix: 'adalah', rule: "Hindari pleonasme 'adalah merupakan', pilih salah satu", ref: 'docs/kaidah-kalimat-efektif.md' },
    { regex: /\b(agar\s+supaya)\b/gi, fix: 'agar', rule: "Hindari pleonasme 'agar supaya', pilih salah satu", ref: 'docs/kaidah-kalimat-efektif.md' },
    { regex: /\b(demi\s+untuk)\b/gi, fix: 'demi', rule: "Hindari pleonasme 'demi untuk', pilih salah satu", ref: 'docs/kaidah-kalimat-efektif.md' },
    { regex: /\b(sangat\s+indah\s+sekali)\b/gi, fix: 'sangat indah', rule: "Hindari pleonasme penguat ganda 'sangat ... sekali'", ref: 'docs/kaidah-kalimat-efektif.md' },
    { regex: /\b(di\s+era\s+modern\s+ini)\b/gi, fix: 'saat ini', rule: "Hindari klise pembuka AI 'di era modern ini', ganti dengan ungkapan langsung atau sebutkan konteksnya", ref: 'docs/panduan-anti-slop-penulisan-alami.md' },
    { regex: /\b(sangat\s+krusial)\b/gi, fix: 'sangat penting', rule: "Hindari kata penggelembung AI 'sangat krusial', sebutkan dampak nyatanya secara spesifik", ref: 'docs/panduan-anti-slop-penulisan-alami.md' },
    { regex: /\b(memiliki\s+peran\s+penting\s+dalam)\b/gi, fix: 'berperan dalam', rule: "Gunakan bentuk aktif yang lebih ringkas dan alami daripada 'memiliki peran penting dalam'", ref: 'docs/panduan-anti-slop-penulisan-alami.md' }
  ];

  pleonasmePatterns.forEach(pat => {
    let match;
    while ((match = pat.regex.exec(text)) !== null) {
      const isCapitalized = match[0][0] === match[0][0].toUpperCase();
      const suggested = isCapitalized ? pat.fix.charAt(0).toUpperCase() + pat.fix.slice(1) : pat.fix;
      errors.push({
        type: 'PLEONASME',
        original: match[0],
        suggestion: suggested,
        rule: pat.rule,
        reference: pat.ref,
        index: match.index
      });
    }
  });

  // Validasi ranah penulisan profesional spesifik
  if (mode === 'ux') {
    // Larangan mencampur kata ganti 'Anda' dan 'kamu'
    const hasAnda = /\bAnda\b/.test(text);
    const hasKamu = /\b(kamu|mu)\b/i.test(text);
    if (hasAnda && hasKamu) {
      errors.push({
        type: 'KONSISTENSI_PRONOMINA',
        original: 'Anda & kamu',
        suggestion: preferredPronoun || 'Pilih salah satu: konsisten "Anda" atau "kamu"',
        rule: 'Hindari mencampuradukkan kata ganti sapaan Anda dan kamu dalam satu antarmuka produk',
        reference: 'docs/profesional/01-ux-writing-dan-produk.md',
        index: 0
      });
    }
  } else if (mode === 'marketing') {
    // Deteksi klaim superlatif berlebihan (Etika Pariwara Indonesia)
    const superlatifRegex = /\b(terbaik di dunia|nomor 1 di indonesia|paling ampuh|termurah se-indonesia|tanpa tandingan)\b/gi;
    let mMatch;
    while ((mMatch = superlatifRegex.exec(text)) !== null) {
      errors.push({
        type: 'ETIKA_PARIWARA',
        original: mMatch[0],
        suggestion: 'Sebutkan keunggulan berbasis data/fakta konkret',
        rule: 'Klaim superlatif mutlak wajib didasarkan pada data/riset terverifikasi menurut Etika Pariwara Indonesia',
        reference: 'docs/profesional/02-copywriting-dan-pemasaran.md',
        index: mMatch.index
      });
    }
  } else if (mode === 'seo') {
    // Peringatan panjang Title Tag jika teks diawali '# '
    const titleMatch = text.match(/^#\s+(.+)$/m);
    if (titleMatch && titleMatch[1].length > 60) {
      errors.push({
        type: 'SEO_TITLE_LENGTH',
        original: titleMatch[1],
        suggestion: titleMatch[1].substring(0, 57) + '...',
        rule: `Panjang Title Tag (${titleMatch[1].length} karakter) melebihi batas ideal 60 karakter di SERP Google`,
        reference: 'docs/profesional/03-penulisan-seo-organik.md',
        index: titleMatch.index
      });
    }
  } else if (mode === 'academic') {
    // Larangan kata ganti persona pertama informal pada karya ilmiah
    const academicPronomina = /\b(aku|saya|kita|kamu)\b/gi;
    let pMatch;
    while ((pMatch = academicPronomina.exec(text)) !== null) {
      errors.push({
        type: 'RAGAM_AKADEMIK',
        original: pMatch[0],
        suggestion: 'peneliti / gunakan kalimat pasif formal',
        rule: `Hindari penggunaan kata ganti orang '${pMatch[0]}' dalam karya tulis ilmiah formal`,
        reference: 'docs/profesional/04-karya-ilmiah-dan-akademik.md',
        index: pMatch.index
      });
    }
  } else if (mode === 'legal') {
    // Penyelarasan bahasa perundang-undangan dan dokumen hukum formal
    const legalPola = [
      { regex: /\b(klausul)\b/gi, fix: 'klausula', rule: "Gunakan bentuk baku 'klausula' dalam dokumen hukum formal", ref: 'docs/profesional/06-penulisan-hukum-dan-perundang-undangan.md' },
      { regex: /\b(merubah)\b/gi, fix: 'mengubah', rule: "Bentuk baku adalah 'mengubah' (bukan 'merubah')", ref: 'docs/profesional/06-penulisan-hukum-dan-perundang-undangan.md' }
    ];
    legalPola.forEach(lp => {
      let lMatch;
      while ((lMatch = lp.regex.exec(text)) !== null) {
        if (lp.fix.toLowerCase() !== lMatch[0].toLowerCase()) {
          errors.push({
            type: 'ISTILAH_HUKUM',
            original: lMatch[0],
            suggestion: lp.fix,
            rule: lp.rule,
            reference: lp.ref,
            index: lMatch.index
          });
        }
      }
    });
  } else if (mode === 'finance') {
    // Penyelarasan istilah keuangan dan pasar modal
    const finPola = [
      { regex: /\b(cash\s+flow)\b/gi, fix: 'arus kas', rule: "Gunakan padanan baku 'arus kas' untuk istilah 'cash flow'", ref: 'docs/profesional/07-penulisan-bisnis-dan-finansial.md' },
      { regex: /\b(capital\s+gain)\b/gi, fix: 'keuntungan modal', rule: "Gunakan padanan baku 'keuntungan modal' untuk istilah 'capital gain'", ref: 'docs/profesional/07-penulisan-bisnis-dan-finansial.md' },
      { regex: /\b(break\s*even\s*point)\b/gi, fix: 'titik impas', rule: "Gunakan padanan baku 'titik impas' untuk istilah 'break-even point'", ref: 'docs/profesional/07-penulisan-bisnis-dan-finansial.md' },
      { regex: /\b(hedging)\b/gi, fix: 'lindung nilai', rule: "Gunakan padanan baku 'lindung nilai' untuk istilah 'hedging'", ref: 'docs/profesional/07-penulisan-bisnis-dan-finansial.md' }
    ];
    finPola.forEach(fp => {
      let fMatch;
      while ((fMatch = fp.regex.exec(text)) !== null) {
        errors.push({
          type: 'ISTILAH_FINANSIAL',
          original: fMatch[0],
          suggestion: fp.fix,
          rule: fp.rule,
          reference: fp.ref,
          index: fMatch.index
        });
      }
    });
  }

  // Filter ignoreWords jika ditetapkan di opsi / .eydvrc.json
  const filteredErrors = errors.filter(err => {
    if (ignoreWords.includes(err.original.toLowerCase())) return false;
    return true;
  });

  // Urutkan kesalahan berdasarkan posisi teks
  filteredErrors.sort((a, b) => a.index - b.index);

  // Buat teks perbaikan (replace dari belakang ke depan agar index tidak bergeser)
  const uniqueErrors = [];
  const visitedIndices = new Set();

  for (let i = filteredErrors.length - 1; i >= 0; i--) {
    const err = filteredErrors[i];
    if (visitedIndices.has(err.index)) continue;
    visitedIndices.add(err.index);
    uniqueErrors.unshift(err);

    // Jangan replace jika suggestion berupa kalimat petunjuk (bukan teks pengganti)
    const isGuidanceOnly = ['KONSISTENSI_PRONOMINA', 'ETIKA_PARIWARA', 'SEO_TITLE_LENGTH', 'RAGAM_AKADEMIK', 'ANGKA_AWAL_KALIMAT'].includes(err.type);
    if (!isGuidanceOnly && err.suggestion) {
      const before = correctedText.substring(0, err.index);
      const after = correctedText.substring(err.index + err.original.length);
      correctedText = before + err.suggestion + after;
    }
  }

  // Hitung Skor Keterbacaan Naskah (Readability Metrics)
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const wordCount = words.length;
  const sentenceCount = sentences.length || 1;
  const avgWordsPerSentence = Math.round((wordCount / sentenceCount) * 10) / 10;
  
  // Deteksi rasio aktif vs pasif sederhana (berawalan me- vs di-)
  const activeVerbs = words.filter(w => /^me[nmlrwy]?/i.test(w)).length;
  const passiveVerbs = words.filter(w => /^di[a-z]+/i.test(w)).length;
  const totalVerbs = activeVerbs + passiveVerbs || 1;
  const activeRatio = Math.round((activeVerbs / totalVerbs) * 100);

  // Skor 0-100 (Skor ideal jika kata per kalimat antara 10-15)
  let readabilityScore = 100 - Math.abs(avgWordsPerSentence - 13) * 3;
  if (readabilityScore < 30) readabilityScore = 30;
  if (readabilityScore > 100) readabilityScore = 100;

  return {
    valid: uniqueErrors.length === 0,
    errorCount: uniqueErrors.length,
    errors: uniqueErrors,
    correctedText: correctedText,
    readability: {
      score: Math.round(readabilityScore),
      wordCount: wordCount,
      sentenceCount: sentenceCount,
      avgWordsPerSentence: avgWordsPerSentence,
      activeRatio: activeRatio,
      grade: readabilityScore >= 80 ? 'Sangat Mudah Dipahami' : readabilityScore >= 60 ? 'Cukup Mudah Dipahami' : 'Kompleks / Akademik'
    }
  };
}

let techTermsData = null;
function getTechTerms() {
  if (!techTermsData) {
    const termsPath = path.resolve(__dirname, '../data/glosarium-istilah-teknologi.json');
    if (fs.existsSync(termsPath)) {
      techTermsData = JSON.parse(fs.readFileSync(termsPath, 'utf8'));
    } else {
      techTermsData = [];
    }
  }
  return techTermsData;
}

/**
 * Mencari padanan istilah teknologi dan AI
 * @param {string} query - Kata kunci istilah dalam bahasa Inggris atau Indonesia
 * @returns {Array<object>} Daftar kecocokan istilah teknologi
 */
function lookupTechTerm(query) {
  if (!query || typeof query !== 'string') return [];
  const q = query.trim().toLowerCase();
  const terms = getTechTerms();
  return terms.filter(t => 
    t.term.toLowerCase().includes(q) || 
    t.padanan.toLowerCase().includes(q) ||
    t.kategori.toLowerCase().includes(q)
  );
}

/**
 * Memeriksa satu kata secara instan terhadap leksikon KBBI & EYD V
 * @param {string} word - Satu kata yang akan diperiksa
 * @returns {object} Status kebakaan kata beserta saran jika nonbaku
 */
function checkSingleWord(word) {
  if (!word || typeof word !== 'string') {
    return { word: '', isBaku: true, suggestion: '', message: 'Kata kosong' };
  }

  const cleanWord = word.trim().toLowerCase();
  const leksikon = getLeksikon();

  // 1. Cek apakah kata ini merupakan kata baku resmi (kunci di kata_baku_map)
  if (leksikon.kata_baku_map && leksikon.kata_baku_map[cleanWord]) {
    return {
      word: word.trim(),
      isBaku: true,
      suggestion: word.trim(),
      rule: `Bentuk '${word.trim()}' adalah kata baku resmi menurut KBBI & EYD V.`,
      reference: 'KBBI VI & EYD V'
    };
  }

  // 2. Cek apakah kata ini ada di dalam daftar varian nonbaku (nilai di kata_baku_map)
  if (leksikon.kata_baku_map) {
    for (const [baku, nonbakuList] of Object.entries(leksikon.kata_baku_map)) {
      if (Array.isArray(nonbakuList) && nonbakuList.includes(cleanWord)) {
        return {
          word: word.trim(),
          isBaku: false,
          suggestion: baku,
          rule: `Bentuk baku adalah '${baku}' (bukan '${word.trim()}')`,
          reference: 'KBBI VI & EYD V'
        };
      }
    }
  }

  // 2. Cek linter kalimat pendek untuk menangkap aturan morfologi KTSP
  const linterRes = checkEyd(word.trim());
  if (!linterRes.valid && linterRes.errors.length > 0) {
    const err = linterRes.errors[0];
    return {
      word: word.trim(),
      isBaku: false,
      suggestion: err.suggestion,
      rule: err.rule,
      reference: err.reference || 'EYD V'
    };
  }

  return {
    word: word.trim(),
    isBaku: true,
    suggestion: word.trim(),
    rule: `Bentuk '${word.trim()}' tidak terindikasi nonbaku menurut pangkalan data leksikon EYD V.`,
    reference: 'KBBI VI & EYD V'
  };
}

let legalFinanceTermsData = null;
function getLegalFinanceTerms() {
  if (!legalFinanceTermsData) {
    const termsPath = path.resolve(__dirname, '../data/glosarium-istilah-hukum-finansial.json');
    if (fs.existsSync(termsPath)) {
      legalFinanceTermsData = JSON.parse(fs.readFileSync(termsPath, 'utf8'));
    } else {
      legalFinanceTermsData = [];
    }
  }
  return legalFinanceTermsData;
}

/**
 * Mencari padanan istilah hukum dan finansial
 * @param {string} query - Kata kunci istilah hukum atau keuangan
 * @returns {Array<object>} Daftar kecocokan istilah
 */
function lookupLegalFinanceTerm(query) {
  if (!query || typeof query !== 'string') return [];
  const q = query.trim().toLowerCase();
  const terms = getLegalFinanceTerms();
  return terms.filter(t => 
    t.term.toLowerCase().includes(q) || 
    t.baku.toLowerCase().includes(q) ||
    t.kategori.toLowerCase().includes(q)
  );
}

module.exports = {
  checkEyd,
  checkSingleWord,
  getLeksikon,
  getTechTerms,
  lookupTechTerm,
  getLegalFinanceTerms,
  lookupLegalFinanceTerm
};
