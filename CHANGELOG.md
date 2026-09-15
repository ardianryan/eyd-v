# Catatan Rilis (Changelog)

Seluruh perubahan penting pada proyek **EYD V** didokumentasikan di berkas ini.
Format catatan ini mengacu pada panduan [Keep a Changelog](https://keepachangelog.com/id/1.0.0/) dan mengikuti standar [Semantic Versioning](https://semver.org/lang/id/).

---

## [5.1.1] - 2026-09-15

### Ditambahkan
* **Standar Global Metadata AI Agent (`llms.txt` & `llms-full.txt`)**:
  * Berkas `llms.txt` dan `llms-full.txt` (88 KB teks murni) berstandar industri agar mesin pencari AI (Perplexity, Cursor, ChatGPT) dapat menelusuri seluruh pasal EYD V secara instan tanpa parsing HTML.
* **Perintah CLI `prompt --copy` (Clipboard Integration)**:
  * Memungkinkan pengguna menyalin seluruh System Prompt EYD V langsung ke Clipboard OS (`pbcopy`, `clip`, `xclip`) via `npx eyd-v prompt --copy` untuk langsung di-paste ke ChatGPT atau Claude.ai.
* **Perintah CLI `repl` (Interactive Terminal Playground)**:
  * Masuk ke sesi uji interaktif `npx eyd-v repl` untuk memeriksa kalimat berulang kali di terminal tanpa mengetik ulang perintah.
* **Opsi CLI `--fix` (In-Place Auto-Fixing)**:
  * Menuliskan perbaikan ejaan dan tanda baca langsung ke berkas target (`npx eyd-v check file.md --fix`) disertai pencadangan otomatis berkas `.bak`.
* **Opsi CLI `--json`**:
  * Keluaran berformat JSON terstruktur untuk integrasi bot, pipeline CI/CD, atau aplikasi pihak ketiga.
* **Dukungan Unix Stdin / Pipe**:
  * Kemampuan membaca masukan teks dari pipe terminal (`cat file.txt | npx eyd-v check` atau `git diff | npx eyd-v check`).
* **Menu Pemasangan Interaktif (`npx eyd-v install`)**:
  * Menu seleksi interaktif berbasis nomor untuk memilih IDE sasaran (Antigravity, Cursor, Windsurf, Claude Code, GitHub Copilot, Cline).
* **Template Multi-IDE Lengkap**:
  * `templates/windsurf/.windsurfrules` untuk Windsurf / Cascade.
  * `templates/copilot/copilot-instructions.md` untuk GitHub Copilot.
  * `templates/cline/.clinerules` untuk Cline / Roo Code.
* **Prompt Terstruktur XML untuk Anthropic Claude** (`prompts/claude-system-prompt.xml`):
  * Penggunaan tag XML resmi Anthropic untuk kedisiplinan nalar model Claude 3.5 Sonnet / Opus 4.5.
* **Paket Bundel `dist/eyd-v.skill`**:
  * Berkas bundel zip terverifikasi untuk dipasang via menu `Settings ➔ Skills` pada Claude.ai Web.
* **Lencana Kepatuhan Komunitas (*Compliance Badge*)**:
  * Berkas SVG `assets/badge-eyd-v.svg` dan cuplikan Markdown resmi untuk disematkan pada dokumentasi pihak ketiga.
* **Panduan Custom GPT** (`docs/panduan-custom-gpt-setup.md`):
  * Panduan membangun bot publik EYD V di OpenAI GPT Store.
* **Otomasi GitHub Pages** (`.github/workflows/deploy-pages.yml`):
  * Deployment otomatis web demo playground ke `https://ardianryan.github.io/eyd-v/`.

---

## [5.1.0] - 2026-09-15

### Ditambahkan
* **Panduan Penulisan Alami & Anti-Slop AI** ([`docs/panduan-anti-slop-penulisan-alami.md`](docs/panduan-anti-slop-penulisan-alami.md)):
  * Penjelasan 3 tingkat register bahasa: Tier 1 (Formal & Akademis), Tier 2 (Fungsional & Semi-Formal: Menu, UI Copy, Info Publik), Tier 3 (Komunikatif & Lugas).
  * Katalog kosakata klise dan penggelembung (*AI slop & puffery*) beserta alternatif konkret to-the-point.
  * Formula ritme kalimat (*Sentence DNA / Cadence*) untuk memecah kebosanan kalimat AI yang seragam.
  * Panduan penulisan menu kuliner dan teks pengumuman/antarmuka (UI/UX) bebas halusinasi ejaan.
* **Deteksi Koma Subordinatif pada Linter** (`src/linter.js`):
  * Penegakan kaidah EYD V Tanda Koma #4: Penghapusan otomatis tanda koma yang salah diletakkan sebelum konjungsi subordinatif (`karena`, `sebab`, `sehingga`, `bahwa`, `agar`, `supaya`) ketika anak kalimat mengiringi induk kalimat.
* **Deteksi Klise Pembuka & Kosakata AI Slop pada Linter**:
  * Koreksi otomatis terhadap pembuka klise seperti *"di era modern ini"* menjadi *"saat ini"*, *"sangat krusial"* menjadi *"sangat penting"*, dan *"memiliki peran penting dalam"* menjadi *"berperan dalam"*.
* **Kasus Uji Benchmark Baru** (`tests/benchmark.json`):
  * Penambahan pengujian benchmark untuk koma subordinatif dan reduksi slop AI, mempertahankan skor 100% kelulusan (31 pengujian).

### Diubah
* **Penyempurnaan Universal Skill (`SKILL.md`) & System Prompt**:
  * Mengintegrasikan larangan koma subordinatif dan prinsip kepenulisan manusia yang alami pada `SKILL.md` dan `prompts/system-prompt-indonesia.md`.

---

## [5.0.0] - 2026-09-12

### Ditambahkan
* **Scraping Penuh EYD Edisi Kelima**:
  * Pengambilan data lengkap dari 38 menu tampilan dan subbab resmi Kemendikdasmen RI (`https://ejaan.kemendikdasmen.go.id/`).
  * Konversi dokumen ke format Markdown modular di folder `docs/`.
* **Dataset Terstruktur & RAG Ready**:
  * Kompilasi seluruh pasal ke format hierarkis `data/eyd-v-all-rules.json`.
  * Partisi 246 semantic chunks siap vector database pada `data/eyd-v-chunks.jsonl`.
* **Universal Agent Skill (`SKILL.md`)**:
  * Spesifikasi skill AI berstandar internasional yang kompatibel dengan Google Antigravity, Claude Code, Cursor IDE, Copilot, dan Windsurf.
* **Model Context Protocol (MCP Server)**:
  * Server MCP via stdio (`src/mcp-server.js`) dengan alat `search_eyd`, `get_rule`, `check_spelling`, dan `lookup_word`.
* **Universal CLI Tool (`npx eyd-v`)**:
  * Fitur `check`: Linter pemeriksa ejaan dan tata bahasa interaktif.
  * Fitur `search`: Mesin pencari kaidah dan pasal resmi instan di terminal.
  * Fitur `install`: Pemasang skill otomatis multi-platform (`--antigravity`, `--cursor`, `--claude`, `--all`).
  * Fitur `init-hook`: Pembuat pre-commit hook otomatis untuk proyek git.
* **AI Learning & Fine-Tuning Hub**:
  * Dataset ChatML multi-turn (`instruction-tuning-chatml.jsonl`) berisi 321 pasang percakapan.
  * Dataset Stanford Alpaca (`alpaca-instructions.json`) berisi 271 instruksi.
  * Dataset DPO (*Direct Preference Optimization*) berisi 75 pasang preferensi untuk melatih model agar menghindari kesalahan ejaan.
  * Modelfile resmi untuk inferensi lokal via Ollama (`prompts/Modelfile`).
* **Leksikon Kata Baku & Morfologi**:
  * Kamus kata baku vs nonbaku populer pada `data/leksikon-kata-baku.json`.
  * Dokumentasi kaidah peluluhan fonem KTSP pada `docs/kaidah-peluluhan-ktsp.md`.
  * Dokumentasi pembaruan EYD V vs PUEBI pada `docs/pembaruan-eyd-v-vs-puebi.md`.
* **Pengujian & Evaluasi**:
  * Suite pengujian benchmark 25 kasus uji dengan tingkat kelulusan 100%.
