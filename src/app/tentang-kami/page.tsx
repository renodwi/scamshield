import { InfoPage } from "../_components/info-page";

export default function TentangKamiPage() {
  return (
    <InfoPage
      activePage="tentang-kami"
      icon="circle-help"
      title="Tentang Scam Shield"
      description="Scam Shield dibuat sebagai alat bantu awal untuk mengenali percakapan yang berpotensi berbahaya, terutama bagi pengguna yang ingin mengecek tanda penipuan sebelum merespons."
      asideTitle="Fokus Kami"
      asideItems={[
        "Membantu pengguna memahami sinyal risiko dalam percakapan digital.",
        "Mendorong keputusan yang lebih tenang sebelum membagikan data atau uang.",
        "Menjaga pengalaman sederhana agar mudah digunakan oleh siapa pun.",
      ]}
      sections={[
        {
          title: "Misi",
          body: "Kami ingin membuat proses pengecekan percakapan mencurigakan menjadi lebih mudah, cepat, dan mudah dipahami tanpa istilah teknis yang membingungkan.",
        },
        {
          title: "Pendekatan",
          body: "Scam Shield menyoroti pola-pola yang sering muncul dalam penipuan digital, lalu menyajikannya dalam bahasa yang praktis untuk membantu pengguna berhati-hati.",
        },
        {
          title: "Batasan",
          body: "Hasil analisis adalah alat bantu. Keputusan akhir tetap perlu mempertimbangkan konteks, verifikasi sumber resmi, dan pelaporan jika ada indikasi penipuan.",
        },
      ]}
    />
  );
}
