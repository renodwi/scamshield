import { InfoPage } from "../_components/info-page";

export default function TipsAmanPage() {
  return (
    <InfoPage
      activePage="tips-aman"
      icon="lock"
      title="Tips Aman Menghindari Penipuan"
      description="Beberapa kebiasaan sederhana bisa mengurangi risiko tertipu, terutama saat percakapan mulai meminta uang, data pribadi, kode OTP, atau keputusan yang terburu-buru."
      asideTitle="Prinsip Utama"
      asideItems={[
        "Jangan bagikan OTP, PIN, kata sandi, atau data kartu kepada siapa pun.",
        "Verifikasi identitas pengirim lewat kanal resmi sebelum mengikuti instruksi.",
        "Tunda keputusan jika percakapan membuat panik, terdesak, atau terlalu menggiurkan.",
      ]}
      sections={[
        {
          title: "Periksa Tautan",
          body: "Jangan langsung membuka tautan dari chat. Cek ejaan domain, sumber pengirim, dan hindari login dari link yang tidak berasal dari aplikasi atau situs resmi.",
        },
        {
          title: "Waspadai Tekanan",
          body: "Penipu sering membuat korban merasa harus bertindak cepat. Ambil jeda, minta pendapat orang terpercaya, dan jangan kirim uang saat emosi sedang ditekan.",
        },
        {
          title: "Simpan Bukti",
          body: "Simpan screenshot, nomor pengirim, tautan, dan detail transaksi. Bukti ini berguna jika Anda perlu melapor ke platform, bank, atau pihak berwenang.",
        },
      ]}
    />
  );
}
