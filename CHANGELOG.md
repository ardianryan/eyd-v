# Catatan Rilis (Changelog)

Seluruh perubahan penting pada proyek **EYD V** didokumentasikan di berkas ini.
Format catatan ini mengacu pada panduan [Keep a Changelog](https://keepachangelog.com/id/1.0.0/) dan mengikuti standar [Semantic Versioning](https://semver.org/lang/id/).

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
