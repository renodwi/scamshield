import Image from "next/image";

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
    >
      <section className="mt-8 rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-card sm:p-7 lg:p-8">
        <div className="grid gap-7 lg:grid-cols-[minmax(260px,360px)_1fr] lg:items-center lg:gap-10">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[360px] overflow-hidden rounded-[1.3rem] bg-slate-100 shadow-sm lg:mx-0">
            <Image
              src="/reno.webp"
              alt="Reno dalam kampanye Juara Vibe Coding"
              fill
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 60vw, 100vw"
              className="object-cover"
              priority={false}
            />
          </div>

          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Halo sobat coding 👋</h2>
            <div className="mt-5 space-y-4 text-base leading-8 text-slate-700 sm:text-lg sm:leading-9">
              <p>
                Terima kasih telah mencoba website sederhana ini. Website ini dibuat tujuannya adalah untuk
                menyelesaikan tantangan dari <span className="font-semibold">#JuaraVibeCoding</span>.
              </p>
              <p>
                Website ini terinspirasi dari teman saya yang dimana waktu itu dia pernah terkena scam yang jumlahnya
                cukup besar untuk kalangan anak SMA.
              </p>
              <p>
                Semoga dengan adanya website ini, kita dapat menjadi lebih hati-hati kembali dalam melakukan transaksi
                daring.
              </p>
            </div>
          </div>
        </div>
      </section>
    </InfoPage>
  );
}
