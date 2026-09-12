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
size_categories:
- n<1K
task_categories:
- text-generation
- question-answering
- token-classification
pretty_name: EYD Edisi V Indonesian Grammar Dataset
---

# Dataset Resmi EYD Edisi Kelima (Kemendikdasmen RI)

Dataset resmi berbasis **Keputusan Kepala Badan Pengembangan dan Pembinaan Bahasa Kemendikbudristek RI Nomor 0424/I/BS.00.01/2022** tentang *Pedoman Umum Ejaan Bahasa Indonesia yang Disempurnakan (EYD Edisi Kelima)*.

## Komposisi Dataset

1. **`instruction-tuning-chatml.jsonl` (321 baris)**:
   Format standar OpenAI / ChatML untuk Supervised Fine-Tuning (SFT). Berisi Q&A kaidah pasal dan tugas penyuntingan kalimat.
   ```json
   {
     "id": "rule-qa-1",
     "messages": [
       {"role": "system", "content": "..."},
       {"role": "user", "content": "Bagaimana kaidah penulisan menurut EYD V mengenai ...?"},
       {"role": "assistant", "content": "..."}
     ]
   }
   ```

2. **`alpaca-instructions.json` (271 entri)**:
   Format Stanford Alpaca (`instruction`, `input`, `output`).

3. **`dpo-preference.jsonl` (75 pasang)**:
   Dataset Direct Preference Optimization (DPO) untuk alignment model LLM bahasa Indonesia agar tidak berhalusinasi atau menggunakan ejaan nonbaku (*dimana*, *pasca sarjana*, *merubah*, dll.).
   * `prompt`: Kalimat atau pertanyaan pengguna
   * `chosen`: Jawaban baku sesuai EYD V
   * `rejected`: Jawaban keliru yang lazim dihasilkan AI

4. **`qa-evaluation.jsonl` (246 pasang)**:
   Dataset ground-truth untuk menguji performa retrieval sistem RAG (Recall@k, MRR, nDCG).

## Cara Memuat Dataset dengan Python:

```python
import json

def load_jsonl(path):
    with open(path, "r", encoding="utf-8") as f:
        return [json.loads(line) for line in f if line.strip()]

# Memuat data SFT
sft_data = load_jsonl("data/ai-learning/instruction-tuning-chatml.jsonl")
print(f"Total SFT: {len(sft_data)}")

# Memuat data DPO
dpo_data = load_jsonl("data/ai-learning/dpo-preference.jsonl")
print(f"Total DPO: {len(dpo_data)}")
```
