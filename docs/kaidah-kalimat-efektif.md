# Kaidah Kalimat Efektif & Pencegahan Kerancuan Sintaksis AI

Salah satu kelemahan terbesar model AI (Large Language Models) saat menghasilkan teks bahasa Indonesia—terutama ketika menerjemahkan dari bahasa Inggris atau merangkum data teknis—adalah produksi **kalimat tidak efektif, pleonastis, atau kalimat buntung (kehilangan subjek)**.

Dokumen ini menyajikan panduan eliminasi kerancuan sintaksis sesuai kaidah tata bahasa baku bahasa Indonesia.

---

## 1. Menghindari Kalimat Buntung (Kehilangan Subjek)

### Masalah pada AI:
Model AI sering mengawali kalimat dengan preposisi (*Berdasarkan...*, *Menurut...*, *Dalam...*, *Dengan...*) tanpa menghadirkan Subjek pada klausa utama. Akibatnya, kalimat tersebut hanya terdiri atas **Keterangan + Predikat**, tanpa Subjek.

### Perbaikan:
* ❌ *Berdasarkan penelitian ini membuktikan bahwa sistem tersebut efisien.*  
  (Kalimat tidak punya subjek karena 'penelitian ini' menjadi bagian dari frasa preposisi 'berdasarkan').
* ✅ **Penelitian ini membuktikan bahwa sistem tersebut efisien.** (Subjek: *Penelitian ini*)
* ✅ **Berdasarkan penelitian ini, peneliti menyimpulkan bahwa sistem tersebut efisien.** (Keterangan + Subjek: *peneliti*)

* ❌ *Di dalam dokumen ini menjelaskan tata cara pengujian.*
* ✅ **Dokumen ini menjelaskan tata cara pengujian.**
* ✅ **Di dalam dokumen ini dijelaskan tata cara pengujian.**

---

## 2. Menghindari Pleonasme (Pemborosan Kata)

Model AI kerap menggabungkan dua kata sinonim yang memiliki makna identik dalam satu frasa. Hal ini membuat naskah menjadi tidak efisien dan tidak baku.

| Bentuk Pleonastis (Keliru) | Bentuk Efektif (Baku) | Penjelasan Kaidah |
|:---|:---|:---|
| *adalah merupakan* | **adalah** atau **merupakan** | Pilih salah satu kopula definitif |
| *agar supaya* | **agar** atau **supaya** | Pilih salah satu konjungsi tujuan |
| *demi untuk* | **demi** atau **untuk** | Pilih salah satu preposisi tujuan |
| *saling tolong-menolong* | **saling menolong** atau **tolong-menolong** | Bentuk ulang sudah menyatakan saling |
| *banyak para hadirin* | **para hadirin** atau **banyak hadirin** | 'Para' sudah menyatakan jamak |
| *sangat indah sekali* | **sangat indah** atau **indah sekali** | Penguat derajat ganda |
| *maju ke depan* | **maju** | Maju sudah pasti ke depan |
| *turun ke bawah* | **turun** | Turun sudah pasti ke bawah |
| *hanya ... saja* | **hanya ...** atau **... saja** | Pilih salah satu pembatas |

---

## 3. Kerancuan Konjungsi Relatif (*di mana*, *yang mana*)

### Masalah pada AI:
AI yang terbiasa dengan struktur bahasa Inggris *where* atau *which* sering menyalin secara harfiah menjadi *di mana* atau *yang mana* dalam klausa relatif non-tempat.

* ❌ *Kami menyusun algoritma di mana dapat memproses data secara real-time.* (Terjemahan harfiah dari: *We designed an algorithm where...*)
* ✅ **Kami menyusun algoritma yang dapat memproses data secara langsung.**

* ❌ *Perusahaan mengalami krisis keuangan yang mana menyebabkan pemutusan kerja.*
* ✅ **Perusahaan mengalami krisis keuangan yang menyebabkan pemutusan kerja.**

> **Kaidah:**
> Kata *di mana* hanya boleh digunakan sebagai **kata tanya tempat** (*Di mana Anda tinggal?*) atau **keterangan tempat** (*Rumah di mana ia dilahirkan kini menjadi museum*). *Di mana* tidak boleh digunakan sebagai penghubung klausul penjelas.

---

## 4. Keparalelan Bentuk (*Parallelism*)

Unsur-unsur yang dirinci dalam kalimat majemuk setara wajib memiliki bentuk gramatikal yang sepadan (semua verba berawalan *me-*, atau semua verba berawalan *di-*, atau semua nomina).

* ❌ *Tugas sekretaris adalah mencatat notula, pengarsipan surat, dan membuat laporan mingguan.*  
  (Tidak paralel: verba *me-*, nomina *pe-an*, verba *me-*).
* ✅ **Tugas sekretaris adalah mencatat notula, mengarsipkan surat, dan membuat laporan mingguan.** (Paralel: semua verba aktif *me-*).
* ✅ **Tugas sekretaris adalah pencatatan notula, pengarsipan surat, dan pembuatan laporan mingguan.** (Paralel: semua nomina *pe-an*).
