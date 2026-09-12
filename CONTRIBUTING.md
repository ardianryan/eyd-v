# Panduan Kontribusi (Contributing Guide)

Terima kasih atas minat Anda untuk berkontribusi pada proyek **EYD V**! Proyek ini bertujuan untuk membangun ekosistem pengetahuan, dataset, dan perkakas kebahasaan Indonesia berstandar resmi **EYD Edisi Kelima** yang dapat digunakan oleh seluruh AI Agent, peneliti, pengembang perangkat lunak, dan masyarakat luas.

Untuk menjaga integritas data kebahasaan dan kualitas kode, seluruh kontributor diharapkan mengikuti panduan di bawah ini.

---

## 🧭 Prinsip Utama Kontribusi

1. **Kepatuhan pada Sumber Resmi**: Seluruh penambahan atau koreksi aturan ejaan wajib merujuk langsung pada pedoman resmi Badan Bahasa Kemendikdasmen RI (`https://ejaan.kemendikdasmen.go.id/`) atau Kamus Besar Bahasa Indonesia (KBBI VI).
2. **Kualitas & Presisi**: Perubahan pada mesin linter (`src/linter.js`) atau dataset (`data/`) wajib dilengkapi dengan kasus uji benchmark pada `tests/benchmark.json`.
3. **Komunikasi Terbuka & Santun**: Gunakan bahasa Indonesia yang baik, lugas, dan santun dalam setiap diskusi tiket (*issue*) maupun permintaan tarik (*pull request*).

---

## 🛠️ Alur Kerja Pengembangan (Development Workflow)

### 1. Kloning & Pemasangan Dependensi

Pastikan Anda telah memasang **Node.js (versi 18 ke atas)**:

```bash
# 1. Fork repositori ini ke akun GitHub Anda, lalu lakukan kloning:
git clone https://github.com/<username-anda>/eyd-v-skill.git
cd eyd-v-skill

# 2. Pasang seluruh dependensi pengembangan:
npm install
```

### 2. Membuat Ranting Kerja (*Branch*)

Gunakan format penamaan ranting yang deskriptif:
* `fitur/nama-fitur` untuk penambahan fitur baru.
* `perbaikan/nama-koreksi` untuk perbaikan bug atau koreksi leksikon.
* `dokumentasi/nama-dokumen` untuk pembaruan panduan.

```bash
git checkout -b perbaikan/leksikon-kata-baku
```

### 3. Melakukan Pengujian (*Testing*)

Sebelum mengajukan perubahan, pastikan seluruh pengujian otomatis lulus 100%:

```bash
npm test
```

Jika Anda menambahkan aturan linter baru:
1. Tambahkan pola regex & perbaikan di [`src/linter.js`](src/linter.js).
2. Tambahkan contoh kasus uji di [`tests/benchmark.json`](tests/benchmark.json).
3. Jalankan `npm test` untuk memastikan semua pengujian lulus.

---

## 📝 Konvensi Pesan Komit (*Commit Conventions*)

Kami menyarankan penggunaan format standar *Conventional Commits*:

* `feat:` Penambahan aturan linter, endpoint MCP, atau fungsionalitas CLI baru.
* `fix:` Koreksi aturan ejaan, kata baku, atau penanganan bug kode.
* `docs:` Pembaruan dokumentasi, panduan npx, atau berkas markdown.
* `test:` Penambahan kasus uji benchmark atau skrip evaluasi.
* `refactor:` Restrukturisasi kode tanpa mengubah fungsionalitas utama.

**Contoh:**
```bash
git commit -m "fix(linter): perbaiki peluluhan fonem s pada kata menyosialisasikan"
```

---

## 🚀 Mengajukan Permintaan Tarik (*Pull Request*)

1. Dorong (*push*) ranting kerja Anda ke repositori fork:
   ```bash
   git push origin perbaikan/leksikon-kata-baku
   ```
2. Buka GitHub dan ajukan **Pull Request** ke ranting utama (`main`).
3. Deskripsikan perubahan yang Anda buat secara jelas:
   * Apa masalah yang diselesaikan?
   * Rujukan pasal EYD V / KBBI mana yang digunakan?
   * Apakah `npm test` lulus tanpa galat?

---

## 📬 Pertanyaan & Diskusi

Jika Anda memiliki pertanyaan seputar kontribusi, ingin mendiskusikan gagasan baru, atau memerlukan bantuan, silakan buka **GitHub Discussion** atau hubungi pengelola utama melalui surel: **me@ardianryan.com**.
