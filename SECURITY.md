# Kebijakan Keamanan (Security Policy)

Dokumen ini memuat kebijakan keamanan dan tata cara pelaporan celah kerentanan untuk paket serta ekosistem **EYD V**.

---

## 🛡️ Versi yang Didukung

Pembaruan keamanan dan perbaikan celah kritis diberikan secara aktif untuk versi rilis berikut:

| Versi Paket | Status Dukungan |
|:---:|:---:|
| **5.x.x** | ✅ Didukung Penuh (Rilis Utama Aktif) |
| < 5.0.0 | ❌ Tidak Didukung |

Pengguna disarankan memperbarui paket ke versi stabil terbaru menggunakan perintah:
```bash
npm update eyd-v
```

---

## 🚨 Pelaporan Celah Kerentanan (Responsible Disclosure)

Jika Anda menemukan potensi kerentanan keamanan (seperti injeksi perintah pada CLI, eksploitasi deserialisasi data, ketergantungan paket berbahaya, atau celah pada server MCP), **harap jangan melaporkannya melalui tiket publik (GitHub Issues)**.

Kirimkan laporan rinci langsung ke:
📧 **me@ardianryan.com**

Sertakan informasi berikut:
1. Subjek surel: `[SECURITY] Laporan Kerentanan EYD V - <Nama Masalah>`
2. Deskripsi rinci mengenai sifat kerentanan dan potensi dampaknya.
3. Langkah reproduksi masalah (skrip contoh atau skenario eksploitasi sederhana).
4. Usulan perbaikan atau mitigasi teknis (jika ada).

---

## ⏱️ Waktu Tanggap & Penanganan

* **Konfirmasi Penerimaan**: Laporan akan dikonfirmasi penerimaannya dalam waktu maksimal **1 x 24 jam**.
* **Investigasi & Verifikasi**: Penilaian tingkat risiko dan replikasi masalah diselesaikan dalam waktu **72 jam**.
* **Rilis Tambalan**: Perbaikan darurat (*security patch*) akan diterbitkan ke npm sesegera mungkin.

Setelah perbaikan resmi diterbitkan, nama pelapor akan dicantumkan pada catatan rilis sebagai bentuk apresiasi (kecuali jika pelapor meminta tetap anonim).
