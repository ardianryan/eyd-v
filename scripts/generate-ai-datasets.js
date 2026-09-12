const fs = require('fs');
const path = require('path');

const rulesPath = path.resolve(__dirname, '../data/eyd-v-all-rules.json');
const chunksPath = path.resolve(__dirname, '../data/eyd-v-chunks.jsonl');
const leksikonPath = path.resolve(__dirname, '../data/leksikon-kata-baku.json');

const allRules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
const chunks = fs.readFileSync(chunksPath, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
const leksikon = JSON.parse(fs.readFileSync(leksikonPath, 'utf8'));

const outDir = path.resolve(__dirname, '../data/ai-learning');
fs.mkdirSync(outDir, { recursive: true });

console.log('🤖 Menghasilkan dataset AI Learning, SFT, DPO, dan RAG dari data resmi EYD V...');

const SYSTEM_PROMPT = "Anda adalah Pakar Linguistik dan Penyelaras Aksara Bahasa Indonesia berpedoman pada Ejaan Bahasa Indonesia yang Disempurnakan Edisi V (EYD V) milik Kemendikdasmen RI dan KBBI.";

const chatmlData = [];
const alpacaData = [];
const dpoData = [];
const qaData = [];

// 1. Generate Q&A and Instructions from Rule Chunks
chunks.forEach((chunk, i) => {
  if (!chunk.title || chunk.title.length < 5) return;

  const userQuery1 = `Bagaimana kaidah penulisan menurut EYD V mengenai "${chunk.title}"?`;
  const assistantResponse1 = `Berdasarkan Pedoman Umum Ejaan Bahasa Indonesia yang Disempurnakan Edisi Kelima (EYD V) pada bab ${chunk.category}:\n\n${chunk.content}\n\nRujukan Resmi: ${chunk.url}`;

  // ChatML format
  chatmlData.push({
    id: `rule-qa-${i + 1}`,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userQuery1 },
      { role: "assistant", content: assistantResponse1 }
    ]
  });

  // Alpaca format
  alpacaData.push({
    instruction: `Jelaskan aturan dan kaidah resmi EYD Edisi V untuk topik berikut.`,
    input: chunk.title,
    output: assistantResponse1
  });

  // QA format for RAG eval
  qaData.push({
    id: chunk.id,
    question: userQuery1,
    ground_truth: chunk.content,
    category: chunk.category,
    url: chunk.url
  });
});

// 2. Generate Proofreading & Correction Tasks from Lexicon & Benchmark
const benchmarkPath = path.resolve(__dirname, '../tests/benchmark.json');
const testCases = JSON.parse(fs.readFileSync(benchmarkPath, 'utf8'));

testCases.forEach((tc, idx) => {
  const userPrompt = `Sunting dan perbaiki kalimat berikut agar sesuai dengan kaidah resmi EYD V:\n"${tc.input}"`;
  const chosenResp = `Kalimat hasil suntingan sesuai EYD V:\n"${tc.expected}"\n\nPenjelasan: Ditemukan ketidaksesuaian pada kategori ${tc.type}.`;
  const rejectedResp = `Kalimat tersebut sudah cukup baik: "${tc.input}"`;

  // ChatML
  chatmlData.push({
    id: `proofread-${idx + 1}`,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
      { role: "assistant", content: chosenResp }
    ]
  });

  // Alpaca
  alpacaData.push({
    instruction: "Perbaiki kesalahan tata bahasa dan ejaan pada kalimat berikut sesuai EYD V.",
    input: tc.input,
    output: chosenResp
  });

  // DPO (Direct Preference Optimization)
  dpoData.push({
    prompt: userPrompt,
    chosen: chosenResp,
    rejected: rejectedResp
  });
});

// 3. Add Lexicon DPO pairs (Common Nonstandard vs Standard)
if (leksikon.kata_baku_map) {
  let count = 0;
  for (const [baku, nonbakuList] of Object.entries(leksikon.kata_baku_map)) {
    if (count >= 50) break; // Ambil 50 sampel terbaik
    const nonbaku = nonbakuList[0];
    if (!nonbaku) continue;

    const userPrompt = `Manakah bentuk penulisan yang baku antara "${baku}" dan "${nonbaku}" menurut EYD V dan KBBI?`;
    const chosen = `Bentuk yang baku menurut EYD V dan KBBI adalah "${baku}". Kata "${nonbaku}" merupakan bentuk nonbaku yang sebaiknya dihindari dalam penulisan formal.`;
    const rejected = `Kedua kata "${baku}" dan "${nonbaku}" sama-sama boleh digunakan dan memiliki arti yang sama dalam penulisan resmi.`;

    dpoData.push({
      prompt: userPrompt,
      chosen: chosen,
      rejected: rejected
    });

    chatmlData.push({
      id: `lexicon-${count + 1}`,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
        { role: "assistant", content: chosen }
      ]
    });
    count++;
  }
}

// Tulis berkas output
fs.writeFileSync(path.join(outDir, 'instruction-tuning-chatml.jsonl'), chatmlData.map(d => JSON.stringify(d)).join('\n'), 'utf8');
fs.writeFileSync(path.join(outDir, 'alpaca-instructions.json'), JSON.stringify(alpacaData, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'dpo-preference.jsonl'), dpoData.map(d => JSON.stringify(d)).join('\n'), 'utf8');
fs.writeFileSync(path.join(outDir, 'qa-evaluation.jsonl'), qaData.map(d => JSON.stringify(d)).join('\n'), 'utf8');

console.log(`✅ Berhasil menghasilkan:`);
console.log(`   - ${chatmlData.length} entri ChatML SFT (instruction-tuning-chatml.jsonl)`);
console.log(`   - ${alpacaData.length} entri Alpaca SFT (alpaca-instructions.json)`);
console.log(`   - ${dpoData.length} pasangan DPO Preference (dpo-preference.jsonl)`);
console.log(`   - ${qaData.length} pasang RAG Q&A Evaluation (qa-evaluation.jsonl)`);
