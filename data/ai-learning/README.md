---
language:
- id
license: mit
tags:
- indonesian
- grammar
- eyd
- spelling
- instruction-tuning
- dpo
- rag
- ux-writing
- marketing-copy
- academic-writing
size_categories:
- n<1K
task_categories:
- text-generation
- question-answering
- token-classification
pretty_name: EYD Edisi V Indonesian Grammar Dataset
---

# Dataset Resmi EYD Edisi Kelima & Ranah Profesional (Kemendikdasmen RI)

Dataset resmi berbasis **Keputusan Kepala Badan Pengembangan dan Pembinaan Bahasa Kemendikbudristek RI Nomor 0424/I/BS.00.01/2022** tentang *Pedoman Umum Ejaan Bahasa Indonesia yang Disempurnakan (EYD Edisi Kelima)* dan standar penulisan 4 ranah profesional (UX Writing, Marketing, SEO, dan Akademik).

## Komposisi Dataset

1. **`instruction-tuning-chatml.jsonl` (321 baris)**:
   Format standar OpenAI / ChatML untuk Supervised Fine-Tuning (SFT). Berisi Q&A kaidah pasal dan tugas penyuntingan kalimat umum.

2. **`alpaca-instructions.json` (271 entri)**:
   Format Stanford Alpaca (`instruction`, `input`, `output`).

3. **`dpo-preference.jsonl` (75 pasang)**:
   Dataset Direct Preference Optimization (DPO) untuk alignment model LLM bahasa Indonesia agar tidak berhalusinasi atau menggunakan ejaan nonbaku (*dimana*, *pasca sarjana*, *merubah*, dll.).

4. **`qa-evaluation.jsonl` (246 pasang)**:
   Dataset ground-truth untuk menguji performa retrieval sistem RAG (Recall@k, MRR, nDCG).

5. **`ux-microcopy-chatml.jsonl` (50 pasang)**:
   Dataset ChatML untuk pelatihan penulisan microcopy antarmuka produk digital (pesan galat, tombol aksi, empty states, notifikasi toast).

6. **`marketing-copy-dpo.jsonl` (50 pasang)**:
   Dataset preferensi DPO untuk melatih model memproduksi copywriting tajam berbasis persona dan membuang bahasa generik klise AI (*AI slop*).

7. **`academic-writing-eval.jsonl` (50 pasang)**:
   Dataset evaluasi kalimat ilmiah formal berstruktur IMRaD, perbaikan klausa buntung tanpa subjek, dan kepatuhan format waktu/angka.

## Cara Memuat Dataset dengan Python:

```python
import json

def load_jsonl(path):
    with open(path, "r", encoding="utf-8") as f:
        return [json.loads(line) for line in f if line.strip()]

# Memuat data UX Microcopy
ux_data = load_jsonl("data/ai-learning/ux-microcopy-chatml.jsonl")
print(f"Total UX: {len(ux_data)}")

# Memuat data Marketing DPO
mkt_dpo = load_jsonl("data/ai-learning/marketing-copy-dpo.jsonl")
print(f"Total Marketing DPO: {len(mkt_dpo)}")

# Memuat data Academic Eval
aca_eval = load_jsonl("data/ai-learning/academic-writing-eval.jsonl")
print(f"Total Academic Eval: {len(aca_eval)}")
```
