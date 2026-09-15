# Glosarium Padanan Istilah Teknologi, Rekayasa Perangkat Lunak, dan Kecerdasan Buatan (AI)

Dokumen ini memuat daftar padanan resmi berpedoman pada **Keputusan Badan Pengembangan dan Pembinaan Bahasa Kemendikdasmen RI**, **Kamus Besar Bahasa Indonesia (KBBI VI)**, dan **konsensus praktisi industri teknologi Indonesia**.

Tujuan glosarium ini adalah memandu perekayasa perangkat lunak, penulis teknis (*technical writer*), penerjemah dokumentasi, dan model AI agar tertib menggunakan istilah bahasa Indonesia yang baku tanpa terjebak pada purisme kaku yang membingungkan pengembang (*over-correction*).

---

## 1. Kaidah Matriks Tiga Kategori Diksi Teknologi

1. 🟢 **Kategori 1: Wajib Indonesia**: Kosakata yang sudah sangat lazim dan wajib diterjemahkan dalam teks antarmuka maupun dokumentasi (*unduh*, *unggah*, *tautan*, *peramban*, *pengaturan*, *galat*, *berkas*).
2. 🟡 **Kategori 2: Istilah Teknis Boleh Asing (Format Monospace)**: Kata kerja atau objek teknis pemrograman spesifik yang jika diterjemahkan justru membingungkan developer. Wajib diformat `monospace` (*`commit`*, *`deploy`*, *`pipeline`*, *`payload`*, *`cache`*).
3. 🔴 **Kategori 3: Kalke AI Terlarang**: Terjemahan harfiah kata per kata dari bahasa Inggris yang merusak sintaksis bahasa Indonesia (*di mana* sebagai relative pronoun, *yang mana*, *menyelami*, *memainkan peran penting*).

---

## 2. Tabel Glosarium Istilah Terpilih

| Istilah Asing (Inggris) | Padanan Baku Indonesia | Kategori | Catatan Penggunaan |
|:---|:---|:---|:---|
| **API** | antarmuka pemrograman aplikasi | Software | Boleh disingkat API dalam teks teknis. |
| **Backend** | sisi belakang / punggung sistem | Software | Boleh menggunakan `backend` (monospace). |
| **Backup** | cadangan / pencadangan | Sistem | *Melakukan pencadangan basis data secara berkala.* |
| **Bandwidth** | lebar pita | Jaringan | Ukuran kapasitas transmisi data. |
| **Benchmark** | tolok ukur / uji patok | Evaluasi | *Pengujian tolok ukur performa model AI.* |
| **Browser** | peramban | Web | Wajib menggunakan *peramban*. |
| **Bug** | kutu / galat logika | Software | *Memperbaiki kutu perangkat lunak.* |
| **Cache / Caching** | tembolok / penembolokan | Software | *Menghapus memori tembolok peramban.* |
| **Cloud Computing** | komputasi awan | Cloud | Layanan infrastruktur berbasis internet. |
| **Codebase** | basis kode | Software | Seluruh repositori kode sumber proyek. |
| **Command Line (CLI)** | antarmuka baris perintah | Tooling | Boleh disingkat CLI. |
| **Commit** | komit / mencatat perubahan | Git | Boleh menggunakan kata `commit` monospace. |
| **Compiler** | kompilator | Software | Penerjemah kode sumber ke biner. |
| **Dashboard** | dasbor | UI/UX | *Lihat statistik pada dasbor analitik.* |
| **Database** | basis data | Data | Wajib menggunakan *basis data*. |
| **Debugging** | penelusuran galat / pengawakutuan | Software | Proses melacak dan membasmi galat. |
| **Default** | bawaan / setelan baku | Sistem | *Kembali ke pengaturan bawaan pabrik.* |
| **Deploy / Deployment**| terapkan / peluncuran | DevOps | *Menerapkan pembaruan ke peladen produksi.* |
| **Deprecated** | usang / tidak lagi didukung | Software | Fitur yang akan dihapus di versi rilis depan. |
| **Download** | unduh | General | Wajib menggunakan *unduh* (bukan download). |
| **Dropdown** | menu tarik-turun | UI/UX | Komponen pemilihan antarmuka. |
| **Endpoint** | titik akhir | Web/API | Alamat URL pemanggilan layanan REST. |
| **Error** | galat | Software | Wajib menggunakan *galat* (bukan eror/error). |
| **Feature** | fitur | Software | Kemampuan fungsional produk. |
| **File** | berkas | General | Wajib menggunakan *berkas* (bukan file). |
| **Fine-Tuning** | penalaan halus | AI | Pelatihan lanjutan model pada dataset khusus. |
| **Firewall** | dinding api | Keamanan | Penyaring lalu lintas jaringan berbahaya. |
| **Folder / Directory**| direktori / map | Sistem | Wadah penyimpanan hierarkis berkas. |
| **Frontend** | sisi depan / muka sistem | Software | Antarmuka pengguna (UI). |
| **Framework** | kerangka kerja | Software | Struktur pondasi pemrograman. |
| **Function Calling** | pemanggilan fungsi | AI | Eksekusi tool/alat otomatis oleh LLM. |
| **Gateway** | gerbang jaringan | Jaringan | Gerbang masuk transmisi sistem. |
| **Generative AI** | kecerdasan buatan generatif | AI | Model pembuat teks, kode, atau visual. |
| **Ground Truth** | kebenaran dasar / data acuan | AI | Nilai rujukan standar pengujian. |
| **Hallucination** | halusinasi | AI | Kondisi saat model mengarang jawaban fiktif. |
| **Hardware** | perangkat keras | General | Komponen fisik mesin komputer. |
| **Heading** | tajuk | Menulis | Judul bagian hierarkis (H1, H2, H3). |
| **Hook** | pengait / pemikat perhatian | Copywriting | Kalimat pembuka yang memicu rasa ingin tahu. |
| **Hosting** | penyewaan peladen / inang | Cloud | Penyedia server aplikasi web. |
| **Hyperlink** | tautan | Web | Wajib menggunakan *tautan* (bukan link). |
| **Inference** | inferensi | AI | Proses kalkulasi model saat menghasilkan teks. |
| **Input** | masukan | General | Data yang dimasukkan ke dalam sistem. |
| **Install** | pasang / pemasangan | General | Wajib menggunakan *pasang* (bukan instal). |
| **Interface** | antarmuka | General | Media interaksi antara sistem dan manusia. |
| **Keyword** | kata kunci | SEO | Kata sasaran penelusuran mesin pencari. |
| **Latency** | latensi / jeda waktu respon | Jaringan | Durasi keterlambatan sinyal data. |
| **Library** | pustaka | Software | Kumpulan paket kode siap pakai. |
| **Load Balancer** | penyeimbang beban | Infrastruktur| Penyalur beban jaringan ke multi-server. |
| **Login / Sign in** | masuk | UI/UX | Wajib menggunakan *masuk* (bukan log in). |
| **Logout / Sign out**| keluar | UI/UX | Wajib menggunakan *keluar* (bukan log out). |
| **Merge** | gabung / penggabungan ranting | Git | Menggabungkan cabang ke ranting utama. |
| **Microcopy** | teks mikro antarmuka | UX Writing | Label tombol, placeholder, teks bantuan kecil. |
| **Middleware** | peranti perantara | Software | Lapisan konektor logika aplikasi. |
| **Modal Dialog** | jendela sembulan / modal | UI/UX | Dialog yang memblokir layar belakang. |
| **Monitoring** | pemantauan | DevOps | Pengawasan metrik operasional secara aktif. |
| **Newsletter** | nawala | Marketing | Surat berkala yang dikirim ke pelanggan. |
| **Offline** | luring (luar jaringan) | General | Kondisi perangkat tanpa koneksi internet. |
| **Online** | daring (dalam jaringan) | General | Kondisi perangkat terhubung ke internet. |
| **Open Source** | sumber terbuka | Software | Kode perangkat lunak bebas diakses publik. |
| **Output** | keluaran | General | Hasil akhir komputasi atau pemrosesan data. |
| **Package** | paket | Software | Modul pustaka yang didistribusikan. |
| **Patch** | tambalan | Software | Perbaikan kecil peranti lunak. |
| **Payload** | muatan data | Web/API | Data inti yang ditransmisikan dalam paket. |
| **Pipeline** | alur pipa / alur kerja otomatis| DevOps | Urutan tahapan build, test, dan deployment. |
| **Placeholder** | teks pemegang tempat | UI/UX | Teks petunjuk abu-abu di dalam kolom input. |
| **Plugin** | colokan / pengaya | Software | Modul penambah kemampuan sistem. |
| **Preview** | pratinjau | UI/UX | Tampilan sementara sebelum disimpan/rilis. |
| **Prompt** | perintah pemantik / permintaan | AI | Teks instruksi yang diinput ke model LLM. |
| **Pull Request (PR)** | permintaan tarik | Git | Pengajuan merger kode ke cabang utama. |
| **Query** | kueri / permintaan data | Data | Perintah pencarian ke basis data. |
| **Rate Limit** | batas laju panggilan | Web/API | Batasan jumlah panggilan API per detik. |
| **Real-time** | waktu nyata | Sistem | Pemrosesan seketika tanpa jeda tunda. |
| **Refactor** | faktorkan ulang | Software | Penataan ulang kode tanpa mengubah keluaran. |
| **Repository** | repositori | Git | Ruang penyimpanan kode dan riwayat komit. |
| **Request** | permintaan | Web/API | Pesan kiriman dari klien menuju server. |
| **Response** | tanggapan | Web/API | Balasan yang dikirim server kepada klien. |
| **RAG** | generasi berdasar temu kembali| AI | Pengambilan konteks dokumen sebelum LLM. |
| **Runtime** | lingkungan waktu eksekusi | Software | Wadah pengeksekusi kode program. |
| **Screenshot** | tangkapan layar | General | Wajib menggunakan *tangkapan layar*. |
| **Search Engine** | mesin pencari | Web | Sistem perayap dan pengindeks web. |
| **Server** | peladen | Jaringan | Boleh menggunakan `server` monospace teknis. |
| **Service Worker** | pekerja layanan latar | Web/PWA | Skrip penangan cache dan mode luring. |
| **Settings** | pengaturan | General | Menu konfigurasi sistem atau profil. |
| **Software** | perangkat lunak | General | Program komputer. |
| **Source Code** | kode sumber | Software | Naskah teks asli logika pemrograman. |
| **Staging** | pra-produksi / uji coba | DevOps | Server pengujian sebelum rilis publik. |
| **Streaming** | pengaliran data | Web/AI | Pengiriman data bertahap per token/paket. |
| **Thread** | utasan | Medsos | Rangkaian postingan bersambung di platform. |
| **Token** | token | AI/Keamanan | Potongan kata pada model atau identitas sesi. |
| **Tooltip** | balon petunjuk / petunjuk alat| UI/UX | Keterangan kecil saat kursor melayang. |
| **Upload** | unggah | General | Wajib menggunakan *unggah* (bukan upload). |
| **User** | pengguna | General | Wajib menggunakan *pengguna* (bukan user). |
| **User Journey** | perjalanan pengguna | UX | Alur tahapan pengguna berinteraksi di aplikasi. |
| **Validation** | validasi / pengesahan | Software | Pemeriksaan ketepatan format masukan. |
| **Vector Database** | basis data vektor | AI | Basis data khusus representasi embedding. |
| **Webhook** | kait web | Web/API | Callback HTTP otomatis saat timbul peristiwa. |
| **Workflow** | alur kerja | General | Tata urutan proses bisnis atau rekayasa. |

---

## 3. Akses via CLI

Gunakan perintah terminal bawaan `eyd-v` untuk memeriksa padanan istilah secara instan:

```bash
npx eyd-v istilah cache
npx eyd-v istilah deployment
npx eyd-v istilah prompt
```
