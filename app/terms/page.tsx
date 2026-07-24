import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Koşulları",
  description:
    "PAFTA araçlarını, hesaplamalarını, dosya işlemlerini ve içeriklerini kullanırken geçerli koşulları inceleyin.",
  alternates: {
    canonical: "/terms",
  },
};

const sections = [
  {
    title: "1. Koşulların kabulü",
    content:
      "PAFTA’yı kullanarak bu koşulları kabul etmiş olursun. Koşulları kabul etmiyorsan platformu kullanmamalısın.",
  },
  {
    title: "2. Bilgilendirme amacı",
    content:
      "PAFTA’daki hesaplamalar, rehberler ve içerikler eğitim ve genel bilgilendirme amacıyla sunulur. Mimari, mühendislik, hukuki veya resmî proje onayı niteliğinde değildir.",
  },
  {
    title: "3. Hesaplamaların doğrulanması",
    content:
      "Araçların doğru sonuç vermesi için özen gösterilir; ancak kullanıcı girdileri, yuvarlama yöntemleri, güncel yönetmelikler ve projeye özgü koşullar sonucu etkileyebilir. Sonuçları teslim, uygulama veya resmî işlem öncesinde ilgili mevzuat ve yetkili uzmanlarla doğrulamak kullanıcının sorumluluğundadır.",
  },
  {
    title: "4. Dosya araçları",
    content:
      "Dosya işlemlerinden önce özgün dosyalarının yedeğini saklamalısın. Tarayıcı, cihaz, dosya yapısı veya beklenmeyen teknik sorunlar nedeniyle oluşabilecek veri kaybından PAFTA sorumlu tutulamaz.",
  },
  {
    title: "5. Uygun kullanım",
    content:
      "Platformu hukuka aykırı, zararlı, hizmeti bozacak veya başkalarının haklarını ihlal edecek şekilde kullanamazsın. Yalnızca işleme hakkına sahip olduğun dosya ve içerikleri kullanmalısın.",
  },
  {
    title: "6. Fikrî haklar ve dış bağlantılar",
    content:
      "PAFTA’nın özgün tasarımı, metinleri ve yazılım bileşenleri ilgili haklarla korunur. Kaynak sayfalarında verilen dış bağlantıların içerik ve güvenliğinden bağlantının sahibi olan üçüncü taraflar sorumludur.",
  },
  {
    title: "7. Hizmet ve koşullardaki değişiklikler",
    content:
      "PAFTA’nın özellikleri değiştirilebilir, geçici olarak durdurulabilir veya yeni koşullar eklenebilir. Güncel koşullar yayımlandığı tarihten itibaren geçerli olur.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <article className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Yasal
        </p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
          Kullanım Koşulları
        </h1>
        <p className="mt-4 text-sm text-slate-500">
          Son güncelleme: 24 Temmuz 2026
        </p>

        <div className="mt-10 space-y-5">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="mt-3 leading-7 text-slate-300">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        <p className="mt-8 text-sm leading-6 text-slate-500">
          Bu metin PAFTA’nın mevcut işleyişini açıklamak amacıyla hazırlanmış
          genel bir çerçevedir; özel hukuki danışmanlık yerine geçmez.
        </p>
      </article>
    </main>
  );
}
