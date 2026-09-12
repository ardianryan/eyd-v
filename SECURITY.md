# Kebijakan Keamanan (Security Policy)

Keamanan informasi, integritas data, dan kenyamanan pengguna adalah prioritas utama bagi kami. Dokumen ini menjelaskan kebijakan keamanan dan prosedur pelaporan kerentanan untuk ekosistem **EYD V**.

---

## 🛡️ Versi yang Didukung

Pembaruan keamanan dan perbaikan celah kritis diberikan secara aktif untuk versi-versi berikut:

| Versi Paket | Status Dukungan |
|:---:|:---:|
| **5.x.x** | ✅ Didukung Penuh (Rilis Utama Aktif) |
| < 5.0.0 | ❌ Tidak Didukung |

Kami sangat menyarankan pengguna dan pengembang untuk selalu memperbarui dependensi ke versi rilis terbaru menggunakan perintah:
```bash
npm update eyd-v
```

---

## 🚨 Melaporkan Kerentanan Keamanan (Responsible Disclosure)

Jika Anda menemukan potensi kerentanan keamanan (seperti masalah injeksi perintah pada CLI, eksploitasi deserialisasi data, ketergantungan paket berbahaya, atau celah pada server MCP), **MOHON UNTUK TIDAK MELAPORKANNYA MELALUI TIKET PUBLIK (GITHUB ISSUES)**.

Langkah pelaporan yang aman:

1. Kirimkan laporan rinci Anda melalui surel ke:
   📧 **me@ardianryan.com**
2. Cantumkan subjek surel: `[SECURITY] Laporan Kerentanan EYD V - <Nama Masalah>`
3. Sertakan informasi berikut dalam surel Anda:
   * Deskripsi rinci mengenai sifat kerentanan.
   * Langkah-langkah reproduksi masalah (kode contoh atau skenario eksploitasi sederhana).
   * Dampak potensial jika celah tersebut dieksploitasi.
   * Saran perbaikan atau mitigasi (jika ada).

---

## ⏱️ Komitmen & Waktu Tanggap

* **Konfirmasi Penerimaan**: Tim kami akan membalas dan mengonfirmasi penerimaan laporan Anda dalam waktu **1 x 24 jam**.
* **Investigasi & Verifikasi**: Penilaian tingkat risiko dan verifikasi celah akan diselesaikan dalam waktu maksimal **72 jam**.
* **Penyelesaian & Rilis Tambalan**: Perbaikan darurat (*security patch*) akan diterbitkan sesegera mungkin tergantung tingkat keparahan risiko.

Setelah tambalan keamanan resmi dirilis ke npm, kami akan memberikan atribusi ucapan terima kasih kepada pelapor atas kontribusinya dalam menjaga keamanan ekosistem ini (kecuali jika pelapor meminta untuk tetap anonim).
