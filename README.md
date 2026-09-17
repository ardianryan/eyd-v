<p align="center">
  <img src="assets/banner.png" alt="EYD V Banner" width="100%">
</p>

<p align="center">
  <img src="assets/logo.png" width="140" alt="Logo Tut Wuri Handayani Kemendikdasmen RI">
</p>

<h1 align="center">EJAAN BAHASA INDONESIA YANG DISEMPURNAKAN (EYD V)</h1>

<p align="center">
  <strong>Universal AI Agent Skill, Domain-Specific Writing Engine, Dataset Terstruktur & Linter Ekosistem Berbasis EYD Edisi Kelima</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/eyd-v"><img src="https://img.shields.io/badge/npm-v5.2.0-007acc.svg?style=flat-square&logo=npm" alt="npm version"></a>
  <a href="https://ejaan.kemendikdasmen.go.id/"><img src="https://img.shields.io/badge/Pedoman-EYD%20Edisi%20V-28a745.svg?style=flat-square&logo=readme" alt="EYD V"></a>
  <a href="https://ejaan.kemendikdasmen.go.id/"><img src="https://img.shields.io/badge/Kemendikdasmen-RI-0099ff.svg?style=flat-square" alt="Kemendikdasmen RI"></a>
  <a href="https://modelcontextprotocol.io/"><img src="https://img.shields.io/badge/MCP-Compatible-8a2be2.svg?style=flat-square" alt="MCP Ready"></a>
  <img src="https://img.shields.io/badge/Tests-40%2F40%20Passed-brightgreen.svg?style=flat-square" alt="Tests">
  <a href="https://donate.ppti.me/"><img src="https://img.shields.io/badge/Dukung%20Kami-donate.ppti.me-ff4081.svg?style=flat-square&logo=heart" alt="Donasi"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-orange.svg?style=flat-square" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/AI%20Agents-Universal-success.svg?style=flat-square&logo=openai" alt="AI Agents Universal">
</p>

---

## 📢 Pernyataan Keterbukaan Informasi & Penafian (Disclaimer)

> [!NOTE]
> **Status Repositori**:
> Repositori ini merupakan **proyek independen komunitas sumber terbuka (open source) dan BUKAN repositori resmi** yang dikelola langsung oleh Badan Pengembangan dan Pembinaan Bahasa maupun Kementerian Pendidikan Dasar dan Menengah Republik Indonesia (Kemendikdasmen RI).
>
> **Sumber Data & Keterbukaan Informasi**:
> Seluruh kaidah kebahasaan, teks pasal, butir aturan, serta contoh kalimat yang ada di repositori ini disarikan langsung dari sumber publik resmi pemerintah:
> 1. Laman Resmi Pedoman Ejaan Bahasa Indonesia: [https://ejaan.kemendikdasmen.go.id/](https://ejaan.kemendikdasmen.go.id/)
> 2. Keputusan Kepala Badan Pengembangan dan Pembinaan Bahasa Kemendikbudristek RI Nomor **0424/I/BS.00.01/2022** tentang *Pedoman Umum Ejaan Bahasa Indonesia yang Disempurnakan (EYD Edisi Kelima)*.
> 3. Kamus Besar Bahasa Indonesia (KBBI VI Daring) untuk rujukan kosakata dan leksikon baku.
>
> **Tujuan Proyek**:
> Repositori ini dikembangkan untuk kepentingan **edukasi, keterbukaan informasi publik, standardisasi kecerdasan buatan (AI Agents), dan kemudahan akses masyarakat** terhadap pedoman berbahasa Indonesia yang baik dan benar. Logo *Tut Wuri Handayani* disertakan sebagai bentuk atribusi identitas sumber pedoman pendidikan Republik Indonesia.

---

## 📑 Daftar Isi

- [📢 Pernyataan Keterbukaan Informasi & Penafian](#-pernyataan-keterbukaan-informasi--penafian-disclaimer)
- [🌟 Keunggulan Utama](#-keunggulan-utama)
- [🎯 Domain Penulisan Profesional & Sub-Skill](#-domain-penulisan-profesional--sub-skill)
- [📖 Glosarium Istilah Teknologi, AI & Komputasi Awan](#-glosarium-istilah-teknologi-ai--komputasi-awan)
- [Penggunaan Instan via NPX](#penggunaan-instan-via-npx)
  - [1. Memeriksa Teks atau Berkas Dokumen (Linter)](#1-memeriksa-teks-atau-berkas-dokumen-linter)
  - [2. Cek Cepat Kata Baku & Padanan Istilah](#2-cek-cepat-kata-baku--padanan-istilah)
  - [3. Mode Pemantau Berkas Otomatis (Watch Mode)](#3-mode-pemantau-berkas-otomatis-watch-mode)
  - [4. Pemasang Git Pre-Commit Hook Otomatis](#4-pemasang-git-pre-commit-hook-otomatis)
  - [5. Server REST API Bawaan](#5-server-rest-api-bawaan)
  - [6. Mode Playground Interaktif di Terminal (REPL)](#6-mode-playground-interaktif-di-terminal-repl)
  - [7. Salin System Prompt Otomatis ke Clipboard](#7-salin-system-prompt-otomatis-ke-clipboard)
  - [8. Memasang Aturan ke AI IDE & Coding Agents](#8-memasang-aturan-ke-ai-ide--coding-agents)
  - [9. Mencari Kaidah & Pasal Resmi](#9-mencari-kaidah--pasal-resmi)
  - [10. Menjalankan MCP Server (Model Context Protocol)](#10-menjalankan-mcp-server-model-context-protocol)
- [☁️ Deployment Enterprise, Kontainer & Cloud Native](#️-deployment-enterprise-kontainer--cloud-native)
  - [1. Docker & Docker Compose](#1-docker--docker-compose)
  - [2. Cloudflare Workers](#2-cloudflare-workers)
  - [3. GitHub Composite Action (CI/CD)](#3-github-composite-action-cicd)
  - [4. Konfigurasi Proyek (.eydvrc.json)](#4-konfigurasi-proyek-eydvrcon)
- [🌐 Progressive Web App (PWA) & Web Playground](#-progressive-web-app-pwa--web-playground)
- [💻 Penggunaan Programmatic (Node.js & TypeScript SDK)](#-penggunaan-programmatic-nodejs--typescript-sdk)
- [🧠 AI Learning, Fine-Tuning & RAG Hub](#-ai-learning-fine-tuning--rag-hub)
- [🏅 Lencana Kepatuhan EYD V (Compliance Badge)](#-lencana-kepatuhan-eyd-v-compliance-badge)
- [📂 Struktur Repositori & Pengetahuan](#-struktur-repositori--pengetahuan)
- [🧪 Evaluasi & Pengujian](#-evaluasi--pengujian)
- [💖 Dukungan & Donasi](#-dukungan--donasi)
- [🤝 Komunitas, Kontribusi & Tata Kelola](#-komunitas-kontribusi--tata-kelola)
- [📄 Lisensi & Hak Cipta](#-lisensi--hak-cipta)

---

## 🌟 Keunggulan Utama

* 🏛️ **100% Selaras Pedoman Resmi**: Mencakup 38 menu tampilan dan 4 Bab utama EYD V (Penggunaan Huruf, Penulisan Kata, Penggunaan Tanda Baca, Penulisan Unsur Serapan), SK Penetapan resmi, serta Kata Pengantar Kepala Badan Bahasa.
* 🎯 **4 Domain Penulisan Profesional**: Modul khusus untuk UX Writing produk digital, Copywriting/Pemasaran (EPI), Penulisan SEO Organik, serta Karya Ilmiah/Akademik.
* 📖 **Glosarium Istilah Teknologi & AI (115+ Kata)**: Padanan baku resmi istilah komputasi awan, AI, dan rekayasa perangkat lunak beserta panduan alih kode (*code-switching*).
* 🤖 **Universal Agent Skill (`SKILL.md`) & Sub-Skills**: Siap dipasang ke Google Antigravity, Claude Code, Cursor IDE, Windsurf, Copilot, Cline, dan agen AI lainnya.
* ⚡ **Model Context Protocol (MCP Server)**: Dilengkapi server MCP bawaan (`npx eyd-v mcp`) dengan tool `check_spelling`, `search_rules`, `lookup_word`, dan `lookup_tech_term`.
* **Server REST API & Cloud Native**: REST API mandiri tanpa dependensi luar (`npx eyd-v serve`), Dockerfile multi-stage, docker-compose, Cloudflare Workers endpoint, dan GitHub Actions runner.
* 📊 **Indeks Keterbacaan & DevEx**: Fitur skor kemudahan membaca (`--score`), linting git staged (`--staged`), pemantau berkas (`watch`), pre-commit hook (`hook`), dan parser nilai file i18n JSON.
* ✍️ **Panduan Penulisan Alami & Anti-Slop AI**: Mengeliminasi klise robotik (*"di era modern ini"*, *"sangat krusial"*, *"menyelami"*) serta koma subordinatif liar sebelum kata *karena/sehingga*.
* 🧠 **AI Fine-Tuning & Alignment Ready**: Dilengkapi dataset SFT (ChatML, Alpaca), DPO (Direct Preference Optimization), UX microcopy, marketing copy, dan evaluasi penulisan ilmiah.

---

## 🎯 Domain Penulisan Profesional & Sub-Skill

Versi 5.2.0 menghadirkan modul penulisan domain khusus yang dapat diaktifkan melalui opsi CLI `--mode=<domain>` atau dipasang sebagai sub-skill independen:

| Domain | Sub-Skill | Panduan Detail | Fokus Utama |
|:---|:---|:---|:---|
| **UX Writing** | [`skills/eyd-v-ux/`](skills/eyd-v-ux/) | [`docs/profesional/01-ux-writing-dan-produk.md`](docs/profesional/01-ux-writing-dan-produk.md) | Mikro-kopi ringkas, pesan galat solutif, CTA jelas, konsistensi sapaan (*Anda* vs *kamu*). |
| **Pemasaran** | [`skills/eyd-v-marketing/`](skills/eyd-v-marketing/) | [`docs/profesional/02-copywriting-dan-pemasaran.md`](docs/profesional/02-copywriting-dan-pemasaran.md) | Etika Pariwara Indonesia (EPI), pencegahan klaim superlatif berlebihan, formula AIDA/PAS. |
| **SEO Organik** | [`skills/eyd-v-seo/`](skills/eyd-v-seo/) | [`docs/profesional/03-penulisan-seo-organik.md`](docs/profesional/03-penulisan-seo-organik.md) | Panjang judul (50–60 karakter), deskripsi meta (120–155 karakter), struktur hierarki heading logis. |
| **Karya Ilmiah** | [`skills/eyd-v-academic/`](skills/eyd-v-academic/) | [`docs/profesional/04-karya-ilmiah-dan-akademik.md`](docs/profesional/04-karya-ilmiah-dan-akademik.md) | Register formal, objektivitas, eliminasi ragam lisan, sitasi standar APA Edisi ke-7 / IEEE. |

---

## 📖 Glosarium Istilah Teknologi, AI & Komputasi Awan

Koleksi 115+ padanan baku resmi untuk istilah teknologi modern tersedia di [`data/glosarium-istilah-teknologi.json`](data/glosarium-istilah-teknologi.json) dan panduan komprehensif di [`docs/profesional/05-glosarium-istilah-teknologi-dan-ai.md`](docs/profesional/05-glosarium-istilah-teknologi-dan-ai.md).

Beberapa contoh padanan umum:
* `prompt engineering` ➔ **rekayasa prompt**
* `machine learning` ➔ **pembelajaran mesin**
* `cloud computing` ➔ **komputasi awan**
* `database` ➔ **basis data**
* `cache` ➔ **tembolok**
* `screenshot` ➔ **tangkapan layar**
* `download` / `upload` ➔ **unduh** / **unggah**

---

## Penggunaan Instan via NPX

Tidak memerlukan instalasi global, cukup jalankan perintah berikut di terminal:

### 1. Memeriksa Teks atau Berkas Dokumen (Linter)
```bash
# Periksa kalimat langsung
npx eyd-v check "Dimana kamu kuliah pasca sarjana?"

# Periksa berkas teks/markdown dan perbaiki langsung di tempat (--fix)
npx eyd-v check artikel.md --fix

# Periksa berkas dengan analisis skor keterbacaan (--score)
npx eyd-v check artikel.md --score

# Periksa berkas dengan mode domain tertentu
npx eyd-v check panduan-aplikasi.md --mode=ux
npx eyd-v check landing-page.md --mode=marketing
npx eyd-v check artikel-blog.md --mode=seo
npx eyd-v check skripsi.md --mode=academic

# Periksa perubahan file yang sudah di-stage di git (--staged)
npx eyd-v check --staged

# Periksa berkas lokalisasi i18n JSON (hanya memeriksa nilai teks)
npx eyd-v check locales/id.json

# Format anotasi bawaan GitHub Actions (--format=github)
npx eyd-v check docs/ --format=github

# Dukungan Stdin / Pipeline Unix
cat naskah.txt | npx eyd-v check
git diff | npx eyd-v check

# Keluaran JSON terstruktur untuk bot / pipeline CI/CD
npx eyd-v check "Sistem analisa ini penting, karena baru." --json
```

### 2. Cek Cepat Kata Baku & Padanan Istilah
```bash
# Cek apakah kata baku atau nonbaku menurut KBBI/EYD V
npx eyd-v kata antri
# Keluaran: Kata "antri" NONBAKU. Bentuk baku yang benar: "antre".

# Cari padanan istilah teknologi resmi
npx eyd-v istilah cache
# Keluaran: Istilah: "cache" | Padanan: "tembolok" | Kategori: Komputasi
```

### 3. Mode Pemantau Berkas Otomatis (Watch Mode)
```bash
# Pantau berkas atau direktori secara otomatis saat disimpan
npx eyd-v watch docs/
npx eyd-v watch artikel.md --fix
```

### 4. Pemasang Git Pre-Commit Hook Otomatis
```bash
# Pasang git hook pre-commit otomatis di repositori Anda
npx eyd-v hook
```

### 5. Server REST API Bawaan
```bash
# Jalankan server REST API lokal (default port 3000)
npx eyd-v serve
PORT=8080 npx eyd-v serve
```

### 6. Mode Playground Interaktif di Terminal (REPL)
```bash
npx eyd-v repl
```

### 7. Salin System Prompt Otomatis ke Clipboard
```bash
npx eyd-v prompt --copy
```

### 8. Memasang Aturan ke AI IDE & Coding Agents
```bash
# Menu interaktif pemilihan IDE:
npx eyd-v install

# Pasang ke SEMUA platform sekaligus:
npx eyd-v install --all

# Pasang ke platform spesifik:
npx eyd-v install --antigravity   # Google Antigravity (~/.gemini/config/skills/eyd-v/)
npx eyd-v install --cursor        # Cursor IDE (.cursor/rules/ & .cursorrules)
npx eyd-v install --windsurf      # Windsurf / Cascade (.windsurfrules)
npx eyd-v install --claude        # Claude Code CLI (.claude/skills/eyd-v/ & CLAUDE.md)
npx eyd-v install --copilot       # GitHub Copilot (.github/copilot-instructions.md)
npx eyd-v install --cline         # Cline / Roo Code (.clinerules)
```

### 9. Mencari Kaidah & Pasal Resmi
```bash
npx eyd-v search "tanda koma konjungsi"
npx eyd-v search "huruf kapital jabatan"
npx eyd-v search "bentuk terikat"
```

### 10. Menjalankan MCP Server (Model Context Protocol)
```bash
npx eyd-v mcp
```

Konfigurasi `claude_desktop_config.json` atau Cursor MCP:
```json
{
  "mcpServers": {
    "eyd-v": {
      "command": "npx",
      "args": ["-y", "eyd-v", "mcp"]
    }
  }
}
```

---

## ☁️ Deployment Enterprise, Kontainer & Cloud Native

### 1. Docker & Docker Compose
Menjalankan REST API server EYD V dalam kontainer Docker:
```bash
# Menjalankan kontainer mandiri
docker build -t eyd-v .
docker run -d -p 3000:3000 --name eyd-v-api eyd-v

# Atau menggunakan Docker Compose
docker-compose up -d
```

Uji endpoint API:
```bash
curl -X POST http://localhost:3000/api/check   -H "Content-Type: application/json"   -d '{"text": "Dimana kamu membeli pasca sarjana?", "mode": "ux"}'
```

### 2. Cloudflare Workers
Deploy REST API serverless berkecepatan tinggi ke edge network Cloudflare:
```bash
# Masuk ke folder workers dan deploy via Wrangler
cd workers
npx wrangler deploy
```

### 3. GitHub Composite Action (CI/CD)
Tambahkan langkah pemeriksaan EYD V otomatis pada berkas `.github/workflows/ci.yml`:
```yaml
name: Lint EYD V
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Jalankan EYD V Linter
        uses: ardianryan/eyd-v@v5.2.0
        with:
          target: "docs/"
          mode: "all"
          score: "true"
```

### 4. Konfigurasi Proyek (`.eydvrc.json`)
Buat berkas `.eydvrc.json` di akar direktori proyek Anda:
```json
{
  "mode": "all",
  "score": true,
  "ignoreWords": ["webhook", "frontend", "backend"],
  "preferredPronoun": "Anda"
}
```

---

## 🌐 Progressive Web App (PWA) & Web Playground

Repositori ini menyertakan aplikasi web mandiri yang dapat digunakan secara luring (offline) berkat dukungan Progressive Web App (PWA):
* 🖥️ **Buka Langsung**: Buka berkas `demo/index.html` di browser apa pun.
* 📱 **PWA Offline**: Dapat diinstal ke perangkat (Chrome/Edge/Safari) dan bekerja sepenuhnya tanpa sambungan internet.
* 🎯 **Selektor Domain & Skor Keterbacaan**: Memilih mode UX, Marketing, SEO, atau Akademik dan menghitung indeks keterbacaan secara visual.
* ☁️ **GitHub Pages**: Siap diakses langsung di [https://ardianryan.github.io/eyd-v/](https://ardianryan.github.io/eyd-v/).

---

## 💻 Penggunaan Programmatic (Node.js & TypeScript SDK)

```bash
npm install eyd-v
```

```javascript
const {
  checkEyd,
  checkSingleWord,
  lookupTechTerm,
  searchRules,
  getRuleById
} = require("eyd-v");

// 1. Memeriksa Teks
const result = checkEyd("Kita harus merubah sistem analisa ini.", {
  mode: "marketing",
  score: true
});
console.log(result.valid); // false
console.log(result.correctedText); // "Kita harus mengubah sistem analisis ini."
console.log(result.readability.readingEase); // Skor keterbacaan

// 2. Cek Cepat Kata Baku
const wordCheck = checkSingleWord("antri");
console.log(wordCheck.isBaku); // false
console.log(wordCheck.suggestion); // "antre"

// 3. Pencarian Padanan Istilah Teknologi
const term = lookupTechTerm("cache");
console.log(term.indonesian); // "tembolok"
console.log(term.category); // "Komputasi"

// 4. Mencari Kaidah EYD V
const rules = searchRules("tanda titik dua", { limit: 3 });
console.log(rules[0].title);
```

---

## 🧠 AI Learning, Fine-Tuning & RAG Hub

Dataset terkurasi untuk pelatihan dan evaluasi model AI tersedia di direktori [`data/ai-learning/`](data/ai-learning/):
* **`instruction-tuning-chatml.jsonl` (321 dialog)**: SFT ChatML kaidah ortografi & morfologi.
* **`alpaca-instructions.json` (271 entri)**: Format Alpaca standar.
* **`dpo-preference.jsonl` (75 pasang)**: Preferensi DPO kaidah dasar EYD V.
* **`ux-microcopy-chatml.jsonl` (50 dialog)**: SFT ChatML nada mikro-kopi UX produk digital.
* **`marketing-copy-dpo.jsonl` (50 pasang)**: DPO iklan etis vs bombastis sesuai EPI.
* **`academic-writing-eval.jsonl` (50 pengujian)**: Evaluasi register ilmiah baku.
* **`qa-evaluation.jsonl` (246 pasang)**: Ground-truth retrieval RAG.
* **`eyd-v-chunks.jsonl` (246 semantic chunks)**: Potongan semantis siap indeks ke Vector DB (Pinecone, Chroma, Qdrant, Vectorize).

Jalankan model lokal menggunakan Ollama:
```bash
ollama create eyd-v -f prompts/Modelfile
ollama run eyd-v "Sunting naskah ini: Dimana anda pasca sarjana?"
```

---

## 🏅 Lencana Kepatuhan EYD V (*Compliance Badge*)

Sematkan lencana resmi pada `README.md` dokumentasi proyek Anda:

<p align="center">
  <img src="assets/badge-eyd-v.svg" alt="Bahasa Indonesia: EYD V Baku">
</p>

```markdown
[![EYD V Compliant](https://img.shields.io/badge/Bahasa%20Indonesia-EYD%20V%20Baku-28a745.svg?style=flat-square&logo=readme)](https://github.com/ardianryan/eyd-v)
```

---

## 📂 Struktur Repositori & Pengetahuan

```text
eyd-v/
├── Dockerfile                        # Kontainer Node Alpine siap produksi
├── docker-compose.yml                # Orkestrasi Docker lokal
├── action.yml                        # GitHub Composite Action
├── .eydvrc.json                      # Berkas konfigurasi linter proyek
├── SKILL.md                          # Definisi Universal Agent Skill
├── package.json                      # Konfigurasi package & bin CLI
├── bin/
│   └── cli.js                        # CLI executable (check, serve, watch, hook, dll)
├── src/
│   ├── index.js                      # Programmatic SDK Library
│   ├── index.d.ts                    # Definisi TypeScript lengkap
│   ├── linter.js                     # Mesin validasi ejaan, domain & keterbacaan
│   ├── server.js                     # Peladen HTTP REST API bawaan
│   └── mcp-server.js                 # Server Model Context Protocol (stdio)
├── skills/                           # Sub-skill domain profesional
│   ├── eyd-v-ux/                     # Sub-skill UX writing
│   ├── eyd-v-marketing/              # Sub-skill Copywriting & EPI
│   ├── eyd-v-seo/                    # Sub-skill SEO organik
│   └── eyd-v-academic/               # Sub-skill karya ilmiah
├── data/
│   ├── eyd-v-all-rules.json          # Dataset lengkap seluruh pasal EYD V
│   ├── eyd-v-chunks.jsonl            # 246 semantic chunks siap RAG
│   ├── leksikon-kata-baku.json       # Kamus leksikon kata baku & aturan KTSP
│   ├── glosarium-istilah-teknologi.json # 115+ istilah teknologi & AI
│   └── ai-learning/                  # 7 dataset SFT, DPO, dan evaluasi
├── docs/
│   ├── profesional/                  # Panduan kepenulisan profesional
│   ├── 00-pendahuluan/               # SK & Kata Pengantar resmi
│   ├── 01-penggunaan-huruf/          # 8 subbab penggunaan huruf
│   ├── 02-penulisan-kata/            # 9 subbab penulisan kata
│   ├── 03-penggunaan-tanda-baca/     # 15 subbab tanda baca
│   └── 04-penulisan-unsur-serapan/   # Kaidah serapan umum & khusus
├── prompts/                          # System prompts siap pakai
├── templates/                        # Konfigurasi Cursor, Windsurf, Copilot, Cline
├── workers/                          # Endpoint Cloudflare Workers
├── tests/                            # Pengujian benchmark & fitur lanjutan
└── demo/                             # Web Playground interaktif & PWA luring
```

---

## 🧪 Evaluasi & Pengujian

Pengujian mencakup seluruh kasus benchmark ortografi dan fitur lanjutan v5.2.0:
```bash
npm test
```
Hasil pengujian:
```text
========================================
Hasil Uji Benchmark: 33 Lulus, 0 Gagal (100% Sukses)
========================================
Seluruh 40 Pengujian Linter & Fitur Lanjutan Lulus 100%!
```

---

## 💖 Dukungan & Donasi

Ekosistem **EYD V** dikembangkan dan dipelihara secara mandiri sebagai proyek sumber terbuka (*open source*) demi memajukan teknologi kecerdasan buatan dan pemrosesan bahasa alami (NLP) Indonesia yang tertib, bernalar, dan berstandar ilmiah.

Jika repositori, dataset, pustaka, atau perkakas ini bermanfaat bagi pekerjaan atau riset Anda, Anda dapat mendukung keberlanjutan proyek ini melalui:

<p align="center">
  <a href="https://donate.ppti.me/" target="_blank">
    <img src="https://img.shields.io/badge/Dukung%20Kami%20di-donate.ppti.me-ff4081.svg?style=for-the-badge&logo=heart&logoColor=white" alt="Donasi via donate.ppti.me" height="45">
  </a>
</p>

<p align="center">
  ☕ <strong>Tautan Donasi:</strong> <a href="https://donate.ppti.me/">https://donate.ppti.me/</a>
</p>

---

## 🤝 Komunitas, Kontribusi & Tata Kelola

Proyek ini menjunjung tinggi standar tata kelola proyek sumber terbuka yang transparan dan tertib:

* 📖 **[Panduan Kontribusi](CONTRIBUTING.md)**: Alur kerja fork, standar pengujian, dan tata cara pengajuan PR.
* 🛡️ **[Kode Etik (Code of Conduct)](CODE_OF_CONDUCT.md)**: Standar perilaku komunitas yang inklusif dan profesional.
* 🔒 **[Kebijakan Keamanan (Security)](SECURITY.md)**: Prosedur pelaporan kerentanan secara bertanggung jawab ke `me@ardianryan.com`.
* 📜 **[Catatan Rilis (Changelog)](CHANGELOG.md)**: Riwayat pembaruan versi mengacu pada *Keep a Changelog*.
* 💬 **[Bantuan & Dukungan](SUPPORT.md)**: Panduan mencari solusi, berdiskusi, dan kontak pengelola.
* 📚 **[Panduan Sitasi (Citation)](CITATION.md)**: Format BibTeX dan APA untuk publikasi riset dan paper akademis.

---

## 📄 Lisensi & Hak Cipta

* Seluruh konten teks pedoman ejaan merupakan dokumen publik resmi milik **Badan Pengembangan dan Pembinaan Bahasa, Kementerian Pendidikan Dasar dan Menengah Republik Indonesia**.
* Perangkat lunak, skrip parsing, SDK, CLI, dan server MCP dilisensikan di bawah lisensi [MIT](LICENSE).
* Pengelola: **Ardian Ryan** ([me@ardianryan.com](mailto:me@ardianryan.com)).
