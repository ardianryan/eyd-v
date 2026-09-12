/**
 * Contoh Ingestion RAG (Node.js / TypeScript):
 * Memuat dan mengindeks dataset eyd-v-chunks.jsonl ke Vector Store / LLM Retriever
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function loadEydChunks() {
  const filePath = path.resolve(__dirname, '../../data/eyd-v-chunks.jsonl');
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const chunks = [];
  for await (const line of rl) {
    if (line.trim()) {
      chunks.push(JSON.parse(line));
    }
  }

  console.log(`✅ Berhasil memuat ${chunks.length} semantis chunks EYD V.`);
  console.log(`Contoh chunk pertama:`);
  console.log({
    id: chunks[0].id,
    title: chunks[0].title,
    category: chunks[0].category,
    preview: chunks[0].content.substring(0, 100) + '...'
  });

  return chunks;
}

if (require.main === module) {
  loadEydChunks();
}

module.exports = { loadEydChunks };
