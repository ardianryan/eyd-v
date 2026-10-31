function bibliographySection(text) {
  const visible = maskRanges(text, opaqueRanges(text));
  const heading = /^[ \t]*(?:#{1,6}[ \t]+)?(?:\*\*)?(?:Daftar Pustaka|References)(?:\*\*)?[ \t]*:?[ \t]*\r?$/im.exec(visible);
  return heading ? { start: heading.index, contentStart: heading.index + heading[0].length, end: text.length } : null;
}

function opaqueRanges(text) {
  const ranges = [];
  const add = regex => {
    for (const m of text.matchAll(regex)) ranges.push({ start: m.index, end: m.index + m[0].length });
  };
  // An unfinished fence protects the remainder, too.
  add(/^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?(?:^ {0,3}\1[^\S\n]*$|(?![\s\S]))/gm);
  add(/(`+)[^\n]*?\1/g);
  add(/"(?:\\.|[^"\\])*"|“[^”]*”|‘[^’]*’|(?<![\p{L}\d])'[^'\n]*'(?![\p{L}\d])/gu);
  add(/^(?: {4}|\t)[^\n]*(?:\n(?: {4}|\t)[^\n]*)*/gm);
  add(/^[ \t]*>[^\n]*(?:\n[ \t]*>[^\n]*)*/gm);
  add(/https?:\/\/[^\s<>]+|\b(?:doi:\s*)?10\.\d{4,9}\/[^\s<>]+/gi);
  return ranges;
}

function protectedRanges(text) {
  const ranges = opaqueRanges(text);
  const bib = bibliographySection(text);
  if (bib) ranges.push({ start: bib.start, end: bib.end });
  for (const regex of [
    /\([^()\n]*(?:\b\d{4}[a-z]?\b|n\.d\.)[^()\n]*\)/gi,
    /\[[\d\s,;–—-]+\]/g,
    /\b\d+(?:[.,]\d+)*(?:\s*[%‰])?/g,
    /\b[\p{Lu}][\p{L}'’.-]*(?:\s+(?:[\p{Lu}][\p{L}'’.-]*|&|dan|and|et\s+al\.|dkk\.))*\s*\((?:\d{4}[a-zA-Z]?|n\.d\.|t\.t\.)\)/gu
  ]) {
    for (const m of text.matchAll(regex)) ranges.push({ start: m.index, end: m.index + m[0].length });
  }
  return ranges;
}

function overlaps(ranges, start, length) {
  return ranges.some(r => start < r.end && start + length > r.start);
}

function maskRanges(text, ranges) {
  const chars = text.split('');
  for (const { start, end } of ranges) {
    for (let i = start; i < end; i++) if (chars[i] !== '\n' && chars[i] !== '\r') chars[i] = ' ';
  }
  return chars.join('');
}

module.exports = { bibliographySection, opaqueRanges, protectedRanges, overlaps, maskRanges };
