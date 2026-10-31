const { checkEyd } = require('./linter');
const { bibliographySection, opaqueRanges, maskRanges, protectedRanges, overlaps } = require('./academic-spans');

const LIMITATIONS = [
  'Pemeriksaan lokal berbasis pola; tidak memverifikasi keberadaan publikasi, DOI, metode, atau dukungan sumber terhadap klaim.',
  'Pencocokan sitasi mencakup bentuk umum APA penulis–tahun atau IEEE bernomor, bukan validasi seluruh aturan format bibliografi.',
  'Daftar pustaka harus berada di akhir naskah di bawah judul Daftar Pustaka atau References. Bentuk yang tidak dikenali memerlukan tinjauan manual.'
];

function validateOptions(text, options) {
  if (typeof text !== 'string' || !text.trim()) throw new TypeError('Teks akademik wajib berupa string yang tidak kosong.');
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new TypeError('Opsi wajib berupa objek.');
  if (options.citationStyle !== undefined && !['apa', 'ieee'].includes(options.citationStyle)) throw new TypeError('citationStyle harus apa atau ieee.');
  if (options.avoidFirstPerson !== undefined && typeof options.avoidFirstPerson !== 'boolean') throw new TypeError('avoidFirstPerson harus boolean.');
  if (options.ignoreWords !== undefined && (!Array.isArray(options.ignoreWords) || options.ignoreWords.some(w => typeof w !== 'string'))) throw new TypeError('ignoreWords harus berupa array string.');
}

function location(text, index, length) {
  const before = text.slice(0, index);
  return { index, length, line: before.split('\n').length, column: index - before.lastIndexOf('\n') };
}

function normalize(value) {
  return value.normalize('NFKC').toLocaleLowerCase('id').replace(/[’']/g, '').replace(/\s+/g, ' ').trim();
}

function citationAuthors(raw) {
  const abbreviated = /\b(?:et\s+al\.|dkk\.)$/i.test(raw.trim());
  const cleaned = raw.replace(/\b(?:et\s+al\.|dkk\.)$/i, '').trim();
  const authors = cleaned.split(/\s*(?:&|\bdan\b|\band\b)\s*/i).map(normalize);
  return { authors, abbreviated };
}

function referenceAuthors(raw) {
  // Family names followed by initials; a name without initials can be a mononym or organization.
  const names = [...raw.matchAll(/(?:^|,\s*|&\s*)([\p{L}][\p{L}\s'’.-]*?),\s*(?:[\p{L}]\.\s*)+/gu)].map(m => normalize(m[1]));
  if (names.length) return names;
  return raw.replace(/\.\s*$/, '').split(/\s+(?:&|dan|and)\s+/i).map(normalize);
}

function reviewAcademic(text, options = {}) {
  validateOptions(text, options);
  const eyd = checkEyd(text, { ...options, mode: 'academic' });
  const findings = [];
  function add(code, category, severity, index, original, reason, suggestion, autoFix = false) {
    findings.push({ code, category, severity, location: location(text, index, original.length), original, reason, suggestion, autoFix });
  }
  const guidance = new Set(['RAGAM_AKADEMIK', 'ANGKA_AWAL_KALIMAT']);
  for (const error of eyd.errors) add(error.type, guidance.has(error.type) ? 'style' : 'eyd', guidance.has(error.type) ? 'warning' : 'error', error.index, error.original, error.rule, error.suggestion, !guidance.has(error.type));

  const protectedSpans = protectedRanges(text);
  const prose = maskRanges(text, protectedSpans);
  const checks = [
    ['SUBJEK_TIDAK_JELAS', /\b(?:Berdasarkan|Dari)\s+[^.!?\n]{1,100}?\b(?:menunjukkan|membuktikan|mengindikasikan)\b/gi, 'Pembuka berpreposisi berpotensi menghilangkan subjek kalimat.', 'Tinjau subjek, misalnya: Hasil analisis menunjukkan …'],
    ['ACUAN_KABUR', /\bHal\s+(?:ini|tersebut)\b/gi, 'Acuan ungkapan ini perlu diperiksa dalam konteks.', 'Sebutkan temuan atau objek yang dirujuk jika acuannya tidak jelas.'],
    ['UNGKAPAN_BERLEBIHAN', /\b(?:sangat\s+(?:signifikan|krusial)|solusi\s+(?:inovatif|revolusioner)|terbukti\s+paling\s+efektif)\b/gi, 'Ungkapan berpotensi melebihi bukti yang disajikan.', 'Sesuaikan kekuatan klaim dengan data dan cakupan penelitian.']
  ];
  for (const [code, regex, reason, suggestion] of checks) {
    for (const m of prose.matchAll(regex)) add(code, 'style', 'warning', m.index, text.slice(m.index, m.index + m[0].length), reason, suggestion);
  }
  const bib = bibliographySection(text);
  const opaque = opaqueRanges(text);
  for (const m of text.matchAll(/\[PERLU\s+(DATA|RUJUKAN|VERIFIKASI)\s*:[^\]]*\]/gi)) {
    if (!overlaps(opaque, m.index, m[0].length)) add(`PERLU_${m[1].toUpperCase()}`, 'evidence', 'warning', m.index, m[0], 'Bahan penelitian belum lengkap.', 'Lengkapi dari bahan yang dapat diperiksa; jangan mengarang isian.');
  }

  const style = options.citationStyle || null;
  const citations = [];
  const references = [];
  let unparsedCount = 0;
  const unparsed = (index, original, reason) => {
    unparsedCount++;
    add('FORMAT_SITASI_TIDAK_DIKENALI', 'citation', 'warning', index, original, reason, 'Periksa manual atau gunakan bentuk sitasi yang didukung.');
  };
  if (style) {
    if (!bib) add('DAFTAR_PUSTAKA_TIDAK_DITEMUKAN', 'citation', 'warning', text.length, '', 'Bagian Daftar Pustaka atau References tidak ditemukan.', 'Tambahkan daftar pustaka dengan judul yang dikenali.');
    if (bib) {
      let current = null;
      const flush = () => {
        if (!current) return;
        const raw = text.slice(current.index, current.end).trimEnd();
        if (style === 'ieee') {
          const m = /^\[(\d+)\]\s+(.+)/s.exec(raw);
          if (m && Number(m[1]) > 0 && Number.isSafeInteger(Number(m[1]))) references.push({ id: String(Number(m[1])), text: raw, location: location(text, current.index, raw.length) });
          else unparsed(current.index, raw, 'Entri IEEE harus diawali nomor positif dalam kurung siku.');
        } else {
          const m = /^(.+?)\s*\((\d{4}[a-z]?)(?:,\s*[^)]*)?\)\./is.exec(raw);
          if (m && /\p{L}/u.test(m[1])) {
            const authors = referenceAuthors(m[1]);
            const year = m[2].toLowerCase();
            references.push({ id: `${authors.join('&')}|${year}`, authors, year, text: raw, location: location(text, current.index, raw.length) });
          } else unparsed(current.index, raw, 'Entri APA penulis–tahun tidak dapat dikenali.');
        }
        current = null;
      };
      let offset = bib.contentStart;
      for (const line of text.slice(offset).split(/\n/)) {
        const trim = line.trim();
        const startsEntry = style === 'ieee' ? /^\[\d+\]/.test(trim) : /^.+?\s*\(\d{4}[a-z]?(?:,\s*[^)]*)?\)\./i.test(trim);
        if (!trim || startsEntry || (current && !/^[ \t]/.test(line))) flush();
        if (trim) {
          if (current) current.end = offset + line.length;
          else current = { index: offset + line.indexOf(trim), end: offset + line.length };
        }
        offset += line.length + 1;
      }
      flush();
      if (!references.length && !unparsedCount) unparsed(bib.contentStart, '', 'Daftar pustaka tidak berisi entri yang dapat diproses.');
    }

    const body = text.slice(0, bib ? bib.start : text.length);
    const visible = maskRanges(body, opaqueRanges(body));
    if (style === 'ieee') {
      for (const m of visible.matchAll(/\[[^\]\n]+\](?:[ \t]*[–—-][ \t]*\[[^\]\n]+\])?/g)) {
        if (!/^\[\d/.test(m[0])) continue;
        const content = m[0].replace(/\]\s*([–—-])\s*\[/g, '$1').slice(1, -1);
        const ids = [];
        let valid = true;
        for (const part of content.split(/[,;]/)) {
          const pair = /^\s*(\d+)\s*(?:[–—-]\s*(\d+))?\s*$/.exec(part);
          const start = pair ? Number(pair[1]) : 0;
          const end = pair && pair[2] ? Number(pair[2]) : start;
          if (!pair || start < 1 || !Number.isSafeInteger(end) || end < start || end - start > 1000) { valid = false; break; }
          for (let n = start; n <= end; n++) ids.push(String(n));
        }
        if (!valid) unparsed(m.index, m[0], 'Nomor atau rentang sitasi IEEE tidak dapat diproses (maksimal 1.001 nomor per rentang).');
        else for (const id of new Set(ids)) citations.push({ id, text: m[0], location: location(text, m.index, m[0].length) });
      }
    } else {
      for (const m of visible.matchAll(/\([^()\n]*\)/g)) {
        const inside = m[0].slice(1, -1);
        if (!/\b\d{4}[a-z]?\b|\bn\.d\.|\bt\.t\.|\bin press\b/i.test(inside)) continue;
        let raw = inside;
        let index = m.index;
        if (/^\d{4}[a-z]?(?:\s*,\s*\d{4}[a-z]?)*$/i.test(inside)) {
          const prefix = visible.slice(0, m.index);
          const author = /([\p{Lu}][\p{L}'’.-]*(?:\s+(?:[\p{Lu}][\p{L}'’.-]*|&|dan|and|et\s+al\.|dkk\.))*)\s*$/u.exec(prefix);
          if (!author) { unparsed(index, m[0], 'Tahun tidak memiliki penulis naratif yang dikenali.'); continue; }
          const name = author[1].replace(/^(?:Menurut|Lihat|Berdasarkan|Temuan|Penelitian|Studi)\s+/u, '');
          raw = `${name}, ${inside}`;
          index = author.index + author[1].indexOf(name);
        }
        for (const group of raw.split(';')) {
          const parsed = /^\s*([^,]+),\s*(\d{4}[a-z]?(?:\s*,\s*\d{4}[a-z]?)*)(?:\s*,\s*(?:p{1,2}\.|hlm\.)\s*\d+(?:\s*[-–]\s*\d+)?)?\s*$/i.exec(group);
          if (!parsed || !/\p{L}/u.test(parsed[1])) { unparsed(index, text.slice(index, m.index + m[0].length), 'Bentuk APA di luar penulis–tahun umum atau menggunakan tanggal tanpa tahun numerik.'); continue; }
          if (/[\[\]"]|^\s*\p{Lu}\.\s/u.test(parsed[1])) {
            unparsed(index, text.slice(index, m.index + m[0].length), 'Alias organisasi, judul sebagai penulis, atau disambiguasi inisial belum didukung.');
            continue;
          }
          const { authors, abbreviated } = citationAuthors(parsed[1]);
          for (const year of parsed[2].toLowerCase().split(/\s*,\s*/)) citations.push({ id: `${authors.join('&')}${abbreviated ? '*' : ''}|${year}`, authors, abbreviated, year, text: text.slice(index, m.index + m[0].length), location: location(text, index, m.index + m[0].length - index) });
        }
      }
    }

    const incomplete = style === 'apa' ? /\([^()\n]*\b\d{4}[a-z]?\b[^()\n]*(?=\n|$)/gi : /\[\d[^\]\n]*(?=\n|$)/g;
    for (const m of visible.matchAll(incomplete)) unparsed(m.index, m[0], 'Penutup sitasi tidak ditemukan.');

    const byId = new Map();
    for (const ref of references) {
      if (byId.has(ref.id)) add('PENGENAL_RUJUKAN_GANDA', 'citation', 'error', ref.location.index, ref.text, `Pengenal ${ref.id} digunakan lebih dari sekali.`, 'Bedakan pengenal atau hapus entri yang terduplikasi.');
      byId.set(ref.id, ref);
    }
    const used = new Set();
    for (const cite of citations) {
      const matches = style === 'ieee' ? references.filter(r => r.id === cite.id) : references.filter(r => r.year === cite.year && (cite.abbreviated ? r.authors.length >= 3 && r.authors[0] === cite.authors[0] : r.authors.join('&') === cite.authors.join('&')));
      cite.referenceIds = [...new Set(matches.map(r => r.id))];
      for (const ref of matches) used.add(ref.id);
      if (!matches.length) add('SITASI_TANPA_RUJUKAN', 'citation', 'error', cite.location.index, cite.text, `Tidak ada entri yang cocok untuk ${cite.id}.`, 'Tambahkan sumber yang digunakan atau perbaiki pengenal sitasi.');
      else if (matches.length > 1) add('SITASI_AMBIGU', 'citation', 'error', cite.location.index, cite.text, 'Sitasi cocok dengan lebih dari satu entri.', 'Bedakan penulis atau akhiran tahun sesuai pedoman sitasi.');
    }
    for (const ref of references) if (!used.has(ref.id)) add('RUJUKAN_TIDAK_DISITASI', 'citation', 'warning', ref.location.index, ref.text, 'Entri belum cocok dengan sitasi yang dikenali dalam teks.', 'Periksa penggunaan sumber dan kemungkinan format sitasi yang belum didukung.');
  }
  findings.sort((a, b) => a.location.index - b.location.index || a.code.localeCompare(b.code));
  const errorCount = findings.filter(f => f.severity === 'error').length;
  return {
    valid: errorCount === 0, errorCount, warningCount: findings.length - errorCount, eyd, findings,
    citations: { style, status: !style ? 'not-requested' : (!bib || unparsedCount ? 'partial' : 'checked'), items: citations, references, unparsedCount },
    limitations: [...LIMITATIONS, ...(!style ? ['Pilih citationStyle apa atau ieee untuk menjalankan pencocokan sitasi.'] : [])]
  };
}

module.exports = { reviewAcademic };
