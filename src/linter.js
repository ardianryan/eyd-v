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

  // 7b. Tanda Koma Keliru Sebelum Konjungsi Subordinatif (Anti-AI Slop)
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

  // 9. Lambang Rupiah (Rp. 50.000 atau Rp.50.000 atau Rp 50.000,- -> Rp50.000)
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

  // 9b. Format Jam dengan Tanda Titik (EYD V Tanda Titik #2)
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

  // 9c. Rentang Tanggal dan Bilangan dengan Tanda Pisah En Dash (EYD V Tanda Pisah #2)
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

  // 10. Pleonasme & Klise AI Slop
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

  // 11. Pemeriksaan Khusus Ranah Profesional (Domain Modes)
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
    const isGuidanceOnly = ['KONSISTENSI_PRONOMINA', 'ETIKA_PARIWARA', 'SEO_TITLE_LENGTH', 'RAGAM_AKADEMIK'].includes(err.type);
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

module.exports = {
  checkEyd,
  checkSingleWord,
  getLeksikon,
  getTechTerms,
  lookupTechTerm
};
