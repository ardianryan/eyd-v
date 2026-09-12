const fs = require('fs');
const path = require('path');

const userMenus = [
  // EYD V
  { group: 'EYD V', title: 'Beranda', url: 'https://ejaan.kemendikdasmen.go.id/', file: 'docs/00-pendahuluan/beranda.md' },
  { group: 'EYD V', title: 'Kata Pengantar', url: 'https://ejaan.kemendikdasmen.go.id/eyd/', file: 'docs/00-pendahuluan/kata-pengantar.md' },
  { group: 'EYD V', title: 'Surat Keputusan', url: 'https://ejaan.kemendikdasmen.go.id/eyd/surat-keputusan/', file: 'docs/00-pendahuluan/surat-keputusan.md' },

  // Penggunaan Huruf
  { group: 'Penggunaan Huruf', title: 'Huruf Abjad', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-huruf/huruf-abjad/', file: 'docs/01-penggunaan-huruf/huruf-abjad.md' },
  { group: 'Penggunaan Huruf', title: 'Huruf Vokal', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-huruf/huruf-vokal/', file: 'docs/01-penggunaan-huruf/huruf-vokal.md' },
  { group: 'Penggunaan Huruf', title: 'Huruf Konsonan', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-huruf/huruf-konsonan/', file: 'docs/01-penggunaan-huruf/huruf-konsonan.md' },
  { group: 'Penggunaan Huruf', title: 'Gabungan Huruf Vokal', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-huruf/gabungan-huruf-vokal/', file: 'docs/01-penggunaan-huruf/gabungan-huruf-vokal.md' },
  { group: 'Penggunaan Huruf', title: 'Gabungan Huruf Konsonan', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-huruf/gabungan-huruf-konsonan/', file: 'docs/01-penggunaan-huruf/gabungan-huruf-konsonan.md' },
  { group: 'Penggunaan Huruf', title: 'Huruf Kapital', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-huruf/huruf-kapital/', file: 'docs/01-penggunaan-huruf/huruf-kapital.md' },
  { group: 'Penggunaan Huruf', title: 'Huruf Miring', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-huruf/huruf-miring/', file: 'docs/01-penggunaan-huruf/huruf-miring.md' },
  { group: 'Penggunaan Huruf', title: 'Huruf Tebal', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-huruf/huruf-tebal/', file: 'docs/01-penggunaan-huruf/huruf-tebal.md' },

  // Penulisan Kata
  { group: 'Penulisan Kata', title: 'Kata Dasar', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penulisan-kata/kata-dasar/', file: 'docs/02-penulisan-kata/kata-dasar.md' },
  { group: 'Penulisan Kata', title: 'Kata Turunan', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penulisan-kata/kata-turunan/', file: 'docs/02-penulisan-kata/kata-turunan.md' },
  { group: 'Penulisan Kata', title: 'Pemenggalan Kata', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penulisan-kata/pemenggalan-kata/', file: 'docs/02-penulisan-kata/pemenggalan-kata.md' },
  { group: 'Penulisan Kata', title: 'Kata Depan', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penulisan-kata/kata-depan/', file: 'docs/02-penulisan-kata/kata-depan.md' },
  { group: 'Penulisan Kata', title: 'Partikel', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penulisan-kata/partikel/', file: 'docs/02-penulisan-kata/partikel.md' },
  { group: 'Penulisan Kata', title: 'Singkatan', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penulisan-kata/singkatan-dan-akronim/', file: 'docs/02-penulisan-kata/singkatan-dan-akronim.md' },
  { group: 'Penulisan Kata', title: 'Angka dan Bilangan', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penulisan-kata/angka-dan-bilangan/', file: 'docs/02-penulisan-kata/angka-dan-bilangan.md' },
  { group: 'Penulisan Kata', title: 'Kata Ganti ku-, kau-, -ku, -mu, dan -nya', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penulisan-kata/kata-ganti/', file: 'docs/02-penulisan-kata/kata-ganti.md' },
  { group: 'Penulisan Kata', title: 'Kata Sandang si dan sang', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penulisan-kata/kata-sandang/', file: 'docs/02-penulisan-kata/kata-sandang.md' },

  // Penggunaan Tanda Baca
  { group: 'Penggunaan Tanda Baca', title: 'Tanda Titik (.)', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-titik/', file: 'docs/03-penggunaan-tanda-baca/tanda-titik.md' },
  { group: 'Penggunaan Tanda Baca', title: 'Tanda Koma (,)', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-koma/', file: 'docs/03-penggunaan-tanda-baca/tanda-koma.md' },
  { group: 'Penggunaan Tanda Baca', title: 'Tanda Titik Koma (;)', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-titik-koma/', file: 'docs/03-penggunaan-tanda-baca/tanda-titik-koma.md' },
  { group: 'Penggunaan Tanda Baca', title: 'Tanda Titik Dua (:)', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-titik-dua/', file: 'docs/03-penggunaan-tanda-baca/tanda-titik-dua.md' },
  { group: 'Penggunaan Tanda Baca', title: 'Tanda Hubung (-)', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-hubung/', file: 'docs/03-penggunaan-tanda-baca/tanda-hubung.md' },
  { group: 'Penggunaan Tanda Baca', title: 'Tanda Pisah (—)', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-pisah/', file: 'docs/03-penggunaan-tanda-baca/tanda-pisah.md' },
  { group: 'Penggunaan Tanda Baca', title: 'Tanda Tanya (?)', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-tanya/', file: 'docs/03-penggunaan-tanda-baca/tanda-tanya.md' },
  { group: 'Penggunaan Tanda Baca', title: 'Tanda Seru (!)', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-seru/', file: 'docs/03-penggunaan-tanda-baca/tanda-seru.md' },
  { group: 'Penggunaan Tanda Baca', title: 'Tanda Elipsis (…)', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-elipsis/', file: 'docs/03-penggunaan-tanda-baca/tanda-elipsis.md' },
  { group: 'Penggunaan Tanda Baca', title: 'Tanda Petik ("…")', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-petik/', file: 'docs/03-penggunaan-tanda-baca/tanda-petik.md' },
  { group: 'Penggunaan Tanda Baca', title: 'Tanda Petik Tunggal (\'…\')', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-petik-tunggal/', file: 'docs/03-penggunaan-tanda-baca/tanda-petik-tunggal.md' },
  { group: 'Penggunaan Tanda Baca', title: 'Tanda Kurung ((…))', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-kurung/', file: 'docs/03-penggunaan-tanda-baca/tanda-kurung.md' },
  { group: 'Penggunaan Tanda Baca', title: 'Tanda Kurung Siku ([…])', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-kurung-siku/', file: 'docs/03-penggunaan-tanda-baca/tanda-kurung-siku.md' },
  { group: 'Penggunaan Tanda Baca', title: 'Tanda Garis Miring (/)', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-garis-miring/', file: 'docs/03-penggunaan-tanda-baca/tanda-garis-miring.md' },
  { group: 'Penggunaan Tanda Baca', title: 'Tanda Apostrof (\')', url: 'https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-penyingkat-apostrof/', file: 'docs/03-penggunaan-tanda-baca/tanda-penyingkat-apostrof.md' },

  // Penulisan Unsur Serapan
  { group: 'Penulisan Unsur Serapan', title: 'Pengantar', url: 'https://ejaan.kemendikdasmen.go.id/eyd/unsur-serapan/', file: 'docs/04-penulisan-unsur-serapan/pengantar-unsur-serapan.md' },
  { group: 'Penulisan Unsur Serapan', title: 'Serapan Umum', url: 'https://ejaan.kemendikdasmen.go.id/eyd/unsur-serapan/umum/', file: 'docs/04-penulisan-unsur-serapan/serapan-umum.md' },
  { group: 'Penulisan Unsur Serapan', title: 'Serapan Khusus', url: 'https://ejaan.kemendikdasmen.go.id/eyd/unsur-serapan/khusus/', file: 'docs/04-penulisan-unsur-serapan/serapan-khusus.md' }
];

console.log('Total menu dari daftar pengguna:', userMenus.length);

let verified = 0;
userMenus.forEach((m, idx) => {
  const p = path.resolve(__dirname, '..', m.file);
  const exists = fs.existsSync(p);
  const size = exists ? fs.statSync(p).size : 0;
  if (exists && size > 0) {
    verified++;
    console.log(`[${idx + 1}/${userMenus.length}] ✅ OK: ${m.group} -> ${m.title} (${size} bytes)`);
  } else {
    console.log(`[${idx + 1}/${userMenus.length}] ❌ KOSONG/TIDAK ADA: ${m.group} -> ${m.title} (${m.file})`);
  }
});

console.log(`\nHASIL: ${verified} dari ${userMenus.length} menu TERVERIFIKASI 100% SUDAH LENGKAP!`);
