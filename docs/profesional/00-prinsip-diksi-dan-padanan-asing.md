# Prinsip Diksi, Padanan Asing & Kode Ragam Bahasa Indonesia

Panduan ini mengadopsi prinsip linguistik Ivan Lanin (*"Baku tak mesti kaku, baik dan benar sesuai konteks"*) serta riset sosiolinguistik *coding agent* (`ajipurn/bahasa-indonesia-skill`).

---

## 1. Menghindari Purisme Berlebihan (*Hyper-Correction*)

Kelemahan terbesar penerjemahan mesin atau purisme bahasa yang berlebihan adalah memaksakan padanan kata yang asing dan ganjil bagi pengguna di industri modern. 

Contoh: Memaksakan kata *"peladen"* untuk *server*, atau *"tetikus"* untuk *mouse* dalam konteks dokumentasi teknis koding/server justru menimbulkan ambiguitas bagi pembaca.

### Matriks Diksi 3 Kategori:

| Kategori | Kebijakan Penggunaan | Contoh Kata Baku / Padanan | Keterangan |
|:---|:---|:---|:---|
| 🟢 **Kategori 1: Wajib Bahasa Indonesia** | Kata umum yang padanannya sudah lazim dan alami di masyarakat | *unduh* (bukan download), *unggah* (bukan upload), *tautan* (bukan link), *surel* (bukan email), *peramban* (bukan browser), *masuk* (bukan login), *keluar* (bukan logout), *pengaturan* (bukan setting) | Wajib gunakan bentuk bahasa Indonesia di semua dokumen formal, UI, dan artikel. |
| 🟡 **Kategori 2: Boleh Istilah Asing (*Monospace / Code*)** | Istilah teknis, rekayasa perangkat lunak, arsitektur data, dan protokol yang jika diterjemahkan justru membingungkan | `commit`, `pull request`, `deploy`, `pipeline`, `payload`, `cache`, `cookies`, `middleware`, `token`, `endpoint` | Tulis dalam format *monospace / code block* atau cetak miring jika dalam teks naratif. |
| 🔴 **Kategori 3: Terlarang Mutlak (AI Slop / Kalke)** | Terjemahan harfiah kata per kata dari bahasa Inggris yang merusak sintaksis bahasa Indonesia | *di mana* (kalke dari where), *yang mana* (kalke dari which), *menyelami* (kalke dari delve into), *memainkan peran penting dalam* (kalke dari plays an important role in) | Wajib diganti dengan kalimat aktif konkret atau kata hubung yang tepat. |

---

## 2. Konsistensi Pronomina & Kata Ganti Sapaan

Dalam satu naskah, antarmuka, atau dokumen, **DILARANG** mencampuradukkan kata ganti:

* **Ragam Formal & Akademis**: Gunakan *Penulis* atau bentuk pasif persona ketiga (*"Berdasarkan analisis..."*). Hindari *aku* atau *kita*.
* **Ragam Produk & Aplikasi (UI/UX)**: Pilih salah satu sesuai persona brand:
  - *Anda*: Formal, santun, jarak sosial terjaga (perbankan, aplikasi finansial, instansi resmi).
  - *Kamu*: Akrab, hangat, kasual (aplikasi gaya hidup, edutech, media sosial).
  - ❌ *Salah*: Di satu tombol tertulis *"Akun Anda"*, lalu di halaman sebelah tertulis *"Profil Kamu"*.

---

## 3. Protokol Tiga Langkah Menulis (*Three-Step Writing Protocol*)

Setiap agen AI atau penulis harus mematuhi tiga tahap ini:

1. **Sebelum Menulis (*Pre-writing*)**:
   - Tentukan pembaca sasaran (*target audience*).
   - Tentukan medium (*UI button, caption medsos, artikel SEO, makalah ilmiah*).
   - Rumuskan satu pesan inti (*core takeaway*).
2. **Saat Menulis (*Drafting*)**:
   - Terapkan variasi panjang kalimat (*Sentence Cadence*): selingi kalimat sedang dengan kalimat pendek tegas (3–7 kata).
   - Hindari kata penggelembung (*puffery*) tanpa bukti konkret.
   - Singkirkan koma sebelum konjungsi subordinatif (*karena, sehingga, bahwa*).
3. **Sesudah Menulis (*Post-writing / Verification*)**:
   - Lakukan *read-aloud test* (baca nyaring dalam hati, apakah terdengar mengalir seperti manusia berbicara).
   - Jalankan linter EYD V: `npx eyd-v check <berkas>`.
