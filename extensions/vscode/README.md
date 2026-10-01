# Ekstensi VS Code / Cursor: EYD V Linter

Ekstensi resmi **EYD V** untuk editor Visual Studio Code, Cursor, dan Windsurf. Menampilkan garis bawah bergelombang (*squiggly warning*) langsung saat Anda menulis naskah, artikel Markdown, atau dokumen teks, lengkap dengan **Quick Fix satu klik** (*Cmd + .* / *Ctrl + .*).

---

## Fitur Utama

* **Diagnostik Ejaan Real-Time**: Otomatis memeriksa berkas `.md` dan `.txt` setiap kali ada perubahan naskah.
* **Quick Fix Terintegrasi**: Tekan pintasan keyboard `Cmd + .` (macOS) atau `Ctrl + .` (Windows/Linux) pada kata yang bergaris bawah untuk langsung menerapkan perbaikan baku.
* **Perbaiki Semua (*Fix All*)**: Jalankan perintah `EYD V: Terapkan Semua Perbaikan Otomatis` dari Command Palette (`Cmd + Shift + P`) untuk membersihkan seluruh dokumen dalam satu detik.
* **Pilihan Ranah Penulisan**: Dukungan validasi khusus untuk ranah *UX Writing*, *Pemasaran*, *SEO Organik*, *Akademik*, *Hukum*, dan *Finansial*.

---

## Cara Memasang Secara Lokal

1. Pastikan Anda telah memasang CLI `vsce`:
   ```bash
   npm install -g @vscode/vsce
   ```
2. Paketkan ekstensi ke berkas `.vsix`:
   ```bash
   cd extensions/vscode
   vsce package
   ```
3. Pasang berkas `.vsix` ke VS Code / Cursor:
   ```bash
   code --install-extension eyd-v-vscode-1.0.0.vsix
   ```
