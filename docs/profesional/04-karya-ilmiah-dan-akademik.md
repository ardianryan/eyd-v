# Karya ilmiah dan riset berbasis bukti

EYD V menjadi dasar ejaan. Ketentuan struktur, persona, dan sitasi mengikuti pedoman kampus atau jurnal. Gunakan sub-skill [akademik](../../skills/eyd-v-academic/SKILL.md) untuk alur riset dan penyusunan naskah.

## Bahasa dan integritas

Gunakan kalimat bersubjek jelas, istilah konsisten, dan klaim yang sesuai kekuatan bukti. “Saya” dan “kami” tidak otomatis salah; hindari mengganti persona jika pedoman mengizinkannya. IMRaD sesuai untuk banyak laporan empiris, tetapi bukan struktur wajib semua karya ilmiah.

Saat menyunting, pertahankan angka, satuan, hasil, arah hubungan, kutipan, dan identitas sumber. Catat masalah substansi terpisah. Gunakan `[PERLU DATA: …]`, `[PERLU RUJUKAN: …]`, atau `[PERLU VERIFIKASI: …]` jika bahan belum cukup.

## Pemeriksaan lokal

```sh
npx eyd-v academic naskah.md --citation-style=apa
npx eyd-v academic naskah.md --citation-style=ieee --json
npx eyd-v check naskah.md --mode=academic --fix
```

Command `academic` tidak menulis ulang berkas. Pencocokan sitasi memerlukan gaya eksplisit. Daftar pustaka ditempatkan di akhir naskah dengan judul `Daftar Pustaka` atau `References`. Command `check` dalam mode akademik melindungi kutipan, kode, angka, URL, DOI, sitasi umum, dan daftar pustaka dari koreksi.

Laporan memisahkan kesalahan EYD, saran gaya, bahan belum lengkap, dan masalah sitasi. Status sitasi `checked` berarti pemrosesan bentuk yang dikenali selesai, bukan seluruh sitasi benar; periksa temuannya. Status `partial` berarti ada format yang tidak dikenali atau bagian daftar pustaka belum ditemukan. Tanpa gaya, status `not-requested`.

Belum ada verifikasi publikasi daring, pembacaan PDF/DOCX, penilaian kebenaran ilmiah, atau audit otomatis dukungan sumber terhadap klaim. Format APA/IEEE yang didukung dan rujukan resmi dijelaskan dalam [panduan sitasi](../../skills/eyd-v-academic/references/sitasi.md).

<!-- eyd-v:docs-navigation -->
## Dokumentasi terkait

[Panduan proyek](../../README.md) · [Catatan perubahan](../../CHANGELOG.md).
<!-- /eyd-v:docs-navigation -->
