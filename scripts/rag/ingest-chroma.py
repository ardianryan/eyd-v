"""
Contoh Skrip Ingest RAG (Python): Memasukkan Dataset EYD V ke Chroma Vector Database
Persyaratan: pip install chromadb langchain-community
"""

import json
import os

def ingest_eyd_to_chroma():
    try:
        import chromadb
    except ImportError:
        print("⚠️ Harap instal chromadb terlebih dahulu: pip install chromadb")
        return

    # Path ke berkas chunks RAG
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    chunks_path = os.path.join(base_dir, "data", "eyd-v-chunks.jsonl")

    if not os.path.exists(chunks_path):
        print(f"❌ Berkas tidak ditemukan: {chunks_path}")
        return

    client = chromadb.Client()
    collection = client.get_or_create_collection(name="eyd_v_rules")

    documents = []
    metadatas = []
    ids = []

    print("📥 Membaca data/eyd-v-chunks.jsonl...")
    with open(chunks_path, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            item = json.loads(line)
            ids.append(item["id"])
            documents.append(item["content"])
            metadatas.append({
                "title": item.get("title", ""),
                "category": item.get("category", ""),
                "url": item.get("url", ""),
                "tags": ",".join(item.get("tags", []))
            })

    print(f"🚀 Menyimpan {len(documents)} pasal EYD V ke koleksi Chroma...")
    collection.add(
        ids=ids,
        documents=documents,
        metadatas=metadatas
    )

    print("✅ Ingest selesai! Menguji query pencarian semantik...")
    query_text = "kapan tanda koma digunakan sebelum kata tetapi?"
    results = collection.query(query_texts=[query_text], n_results=2)

    print(f"\nHasil query untuk: '{query_text}'")
    for i, doc in enumerate(results["documents"][0]):
        meta = results["metadatas"][0][i]
        print(f"\n[{i+1}] {meta['title']} ({meta['url']})")
        print(doc[:250] + "...")

if __name__ == "__main__":
    ingest_eyd_to_chroma()
