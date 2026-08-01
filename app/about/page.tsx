import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "PAFTA’nın amacı, mimarlık öğrencilerine sunduğu araçlar ve platformun gelişim yaklaşımı hakkında bilgi edinin.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <article className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          PAFTA
        </p>

        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
          Mimarlık öğrencileri için tek dijital çalışma alanı
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-300">
          PAFTA; mimarlık öğrencilerinin farklı sitelerde, dosyalarda ve
          kaynaklarda aramak zorunda kaldığı araçları tek bir platformda
          buluşturmak amacıyla geliştiriliyor.
        </p>

        <div className="mt-10 space-y-8">
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">Neden PAFTA?</h2>
            <p className="mt-4 leading-7 text-slate-300">
              Ölçek hesabından PDF düzenlemeye, Revit sorunlarından teslim
              kontrolüne kadar mimarlık eğitimi boyunca tekrar tekrar ihtiyaç
              duyulan çözümler çoğu zaman dağınık ve birbirinden kopuk
              durumda. PAFTA bu süreci daha hızlı, anlaşılır ve erişilebilir
              hâle getirmeyi hedefliyor.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              İçerik standardı
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              İçerikleri nasıl hazırlıyoruz?
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                ["Gerçek ihtiyaç", "Konu ve araçlar; stüdyo, ofis stajı, teslim ve yazılım kullanımında tekrar eden sorunlardan seçilir."],
                ["Uygulama kontrolü", "Araçlar örnek girdilerle denenir; rehberlerde işlem sırası, beklenen çıktı ve sık hata birlikte açıklanır."],
                ["Kaynak şeffaflığı", "Teknik ve tarihsel içeriklerde resmî dokümantasyon, kurum arşivi veya üretici verisine bağlantı verilir."],
                ["Düzeltme süreci", "Hata bildirimi geldiğinde ilgili sayfa yeniden kontrol edilir; içeriklerin son kontrol tarihi görünür tutulur."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl bg-slate-950/70 p-5">
                  <h3 className="font-semibold text-cyan-300">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-amber-100">
              PAFTA neyin yerine geçmez?
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              PAFTA eğitim ve ön karar desteği sağlar. Yönetmelik yorumu,
              ruhsat kararı, statik veya enerji hesabı, ürün onayı ve profesyonel
              proje müellifliği yerine geçmez. Teknik sonuçlar güncel mevzuat,
              proje koşulları, uzman hesabı ve üretici belgesiyle doğrulanmalıdır.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">Editoryal sorumluluk</h2>
            <p className="mt-4 leading-7 text-slate-300">
              Sitedeki metin, araç ve arayüzlerin editoryal sorumluluğu PAFTA’ya
              aittir. İçerikler otomatik olarak yayımlanmaz; yayına alınmadan
              önce okunabilirlik, bağlantı, hesaplama mantığı ve öğrenciye
              sağlayacağı pratik katkı açısından gözden geçirilir.
            </p>
            <p className="mt-4 text-sm text-slate-500">Son genel içerik kontrolü: 1 Ağustos 2026</p>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">
              Öğrenci deneyiminden doğan bir proje
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              PAFTA, Özyeğin Üniversitesi Mimarlık Bölümü 4. sınıf öğrencisi
              tarafından geliştiriliyor. Mimarlık eğitimi sırasında eksikliği
              hissedilen hesaplama araçlarını, dosya işlemlerini ve uygulama
              rehberlerini daha erişilebilir hâle getirmek amacıyla oluşturuldu.
              Platformdaki içerikler ve araçlar, öğrencilik sürecinde karşılaşılan
              gerçek ihtiyaçlardan yola çıkarak geliştiriliyor.
            </p>
          </section>

          <section className="grid gap-5 sm:grid-cols-3">
            {[
              {
                title: "Pratik",
                text: "Uzun anlatımlar yerine doğrudan kullanılabilen araçlar ve açık adımlar.",
              },
              {
                title: "Öğrenci odaklı",
                text: "Mimarlık stüdyosu, teslim ve yazılım süreçlerinin gerçek ihtiyaçları.",
              },
              {
                title: "Gelişen",
                text: "Yeni hesaplamalar, rehberler ve kaynaklarla düzenli olarak büyüyen yapı.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <h2 className="font-semibold text-cyan-400">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.text}
                </p>
              </div>
            ))}
          </section>

          <section className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">
              Görüşlerin PAFTA’yı geliştirir
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              Eksik bir araç, hatalı bir sonuç veya yeni bir içerik önerisi
              fark edersen bize ulaşabilirsin.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-cyan-400 px-6 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              İletişime geç
            </Link>
          </section>
        </div>
      </article>
    </main>
  );
}
