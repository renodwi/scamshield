import { InfoPage } from "../_components/info-page";

export default function CaraKerjaPage() {
  return (
    <InfoPage
      activePage="cara-kerja"
      icon="sparkles"
      title="Cara Kerja Scam Shield"
      description="Scam Shield membantu membaca pola percakapan yang mencurigakan dari screenshot atau teks, lalu memberi gambaran risiko agar Anda bisa mengambil keputusan dengan lebih hati-hati."
      asideTitle="Alur Singkat"
      asideItems={[
        "Masukkan screenshot atau teks percakapan yang ingin dicek.",
        "Sistem membaca tanda bahaya seperti tekanan waktu, permintaan data, dan pola iming-iming.",
        "Hasil analisis ditampilkan sebagai bahan pertimbangan, bukan pengganti kewaspadaan pribadi.",
      ]}
      sections={[
        {
          title: "Kirim Percakapan",
          body: "Gunakan upload gambar atau paste teks dari chat yang terasa mencurigakan. Pastikan bagian penting percakapan terlihat agar analisis lebih mudah dipahami.",
        },
        {
          title: "Analisis Pola Risiko",
          body: "Konten dicek untuk menemukan indikasi penipuan seperti permintaan transfer mendadak, tautan mencurigakan, atau instruksi yang menekan korban.",
        },
        {
          title: "Baca Hasilnya",
          body: "Anda mendapatkan ringkasan risiko dan sinyal yang perlu diperhatikan sebelum membalas, mengirim uang, atau membagikan informasi pribadi.",
        },
      ]}
    />
  );
}
