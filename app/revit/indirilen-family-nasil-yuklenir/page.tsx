import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Revit’e İndirilen Family Nasıl Yüklenir?",
  description:
    "İnternetten indirilen RFA family dosyasını Revit projesine yükleme, yerleştirme ve görünmeme sorunlarını çözme rehberi.",
  alternates: {
    canonical: "/revit/indirilen-family-nasil-yuklenir",
  },
};

export default function RevitLoadFamilyPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <article className="mx-auto max-w-4xl">
        <nav className="mb-8 text-sm text-slate-400">
          <Link href="/" className="transition hover:text-cyan-400">
            Ana Sayfa
          </Link>
          <span className="mx-2">/</span>
          <Link href="/revit" className="transition hover:text-cyan-400">
            Revit
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-200">Family yükleme</span>
        </nav>

        <header className="border-b border-slate-800 pb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Revit Başlangıç Rehberi
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
            Revit’e İndirilen Family Nasıl Yüklenir?
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            İnternetten indirdiğin mobilya, kapı, pencere veya tefriş dosyası
            çoğunlukla <strong>.rfa</strong> uzantılıdır. Bu dosya doğrudan proje
            dosyasına eklenir; ayrıca bir program gibi kurulmaz.
          </p>
        </header>

        <section className="mt-10 space-y-9 leading-8 text-slate-300">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              1. İndirdiğin dosyayı kontrol et
            </h2>
            <p className="mt-3">
              ZIP veya RAR arşivi indirdiysen önce dosyaları güvenli bir klasöre
              çıkart. Yükleyeceğin asıl family dosyasının uzantısı{" "}
              <strong>.rfa</strong> olmalıdır. <strong>.rvt</strong> uzantılı
              dosya bir Revit projesidir; içindeki family’leri ayrıca projene
              aktarman gerekebilir. İndirdiğin kaynağa güvenmiyorsan dosyayı
              açmadan önce güvenlik taramasından geçir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              2. Load Family komutunu kullan
            </h2>
            <p className="mt-3">
              Family’yi eklemek istediğin Revit projesini aç. Üst menüden{" "}
              <strong>Insert → Load from Library → Load Family</strong> yolunu
              izle. Açılan pencerede indirdiğin RFA dosyasını bul, seç ve{" "}
              <strong>Open</strong> düğmesine bas. Autodesk’in resmî iş akışında
              da family yükleme işlemi bu komut üzerinden yapılır.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
            <h2 className="text-xl font-semibold text-cyan-300">
              Alternatif yöntem
            </h2>
            <p className="mt-3">
              RFA dosyasını ayrı bir Revit penceresinde açtıysan Family
              Editor’daki <strong>Load into Project</strong> komutunu da
              kullanabilirsin. Birden fazla proje açıksa Revit hedef projeyi
              seçmeni ister.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              3. Family’yi projede bul
            </h2>
            <p className="mt-3">
              Dosya yüklendikten sonra family, <strong>Project Browser</strong>{" "}
              içindeki <strong>Families</strong> başlığı altında kendi
              kategorisinde görünür. Örneğin bir koltuk Furniture, bir lavabo
              Plumbing Fixtures, bir kapı ise Doors kategorisine yerleşebilir.
              Family adını göremiyorsan doğru kategoriye baktığından emin ol.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              4. Family’yi modele yerleştir
            </h2>
            <p className="mt-3">
              Mobilya ve birçok serbest bileşen için{" "}
              <strong>Architecture → Component → Place a Component</strong>{" "}
              komutunu kullan. Kapı ve pencere gibi host gerektiren family’ler
              kendi araçlarından yerleştirilir ve bir duvar ister. Bazı
              family’ler yüzeye, çalışma düzlemine veya tavana bağlı olabilir;
              bu durumda uygun görünüşü ve taşıyıcı yüzeyi açman gerekir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Family yüklendi ama görünmüyorsa
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <strong className="text-white">Doğru kategoriyi kontrol et:</strong>{" "}
                Project Browser’da family, beklediğinden farklı bir kategoriye
                yüklenmiş olabilir.
              </li>
              <li className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <strong className="text-white">Doğru komutu kullan:</strong>{" "}
                Kapılar Door, pencereler Window, serbest mobilyalar Component
                aracıyla yerleştirilir.
              </li>
              <li className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <strong className="text-white">Görünüş ayarlarına bak:</strong>{" "}
                Visibility/Graphics, disiplin, detay seviyesi, view range veya
                faz ayarları elemanı gizliyor olabilir.
              </li>
              <li className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <strong className="text-white">Host gereksinimini kontrol et:</strong>{" "}
                Duvar, tavan, yüzey veya çalışma düzlemi isteyen bir family uygun
                taşıyıcı olmadan yerleştirilemez.
              </li>
              <li className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <strong className="text-white">Revit sürümünü kontrol et:</strong>{" "}
                Daha yeni bir Revit sürümünde kaydedilmiş family eski sürümde
                açılamaz. Dosyanın uyumlu bir sürümünü indirmen gerekir.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              “Family zaten mevcut” uyarısı ne anlama gelir?
            </h2>
            <p className="mt-3">
              Aynı adlı family projede bulunuyorsa Revit mevcut sürümün üzerine
              yazmak isteyip istemediğini sorabilir. Family geometrisini
              güncellemek istiyorsan üzerine yazabilirsin. Projedeki type
              parametrelerini korumak istiyorsan parametre değerlerini de
              değiştiren seçenek yerine yalnızca family tanımını güncelleyen
              seçeneği tercih et. Önemli projelerde işlemden önce yedek almak
              güvenlidir.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Family dosyalarını düzenli sakla
            </h2>
            <p className="mt-3">
              İndirdiğin dosyaları Mobilya, Kapı, Pencere, Aydınlatma ve Tefriş
              gibi klasörlere ayır. Dosya adına üretici, ölçü ve Revit sürümü
              eklemek daha sonra doğru family’yi bulmayı kolaylaştırır. Çok
              sayıda family’yi her projeye yüklemek dosyayı ağırlaştırabilir;
              yalnızca gerçekten kullanacağın içerikleri projeye ekle.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">Sonuç</h2>
            <p className="mt-3">
              İndirilen bir Revit family’sini eklemek için temel yol{" "}
              <strong>Insert → Load Family</strong> komutudur. Yükleme
              tamamlandıktan sonra family’yi Project Browser’daki kategorisinden
              bulabilir ve uygun modelleme aracıyla yerleştirebilirsin. Görünmeme
              sorunlarının çoğu kategori, host veya görünüş ayarlarından
              kaynaklanır.
            </p>
          </div>
        </section>

        <aside className="mt-12 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold">Resmî Autodesk kaynakları</h2>
          <div className="mt-3 flex flex-col gap-2 text-cyan-400">
            <a
              href="https://help.autodesk.com/view/RVT/2025/ENU/?guid=GUID-2A6C26DE-63D7-48E8-A986-CAB6C362049A"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-300"
            >
              Load Families ↗
            </a>
            <a
              href="https://help.autodesk.com/view/RVT/2026/ENU/?guid=GUID-A69690A6-62F3-48C6-9F34-043051F815CE"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-300"
            >
              Revit Content Libraries ↗
            </a>
          </div>
        </aside>

        <Link
          href="/revit"
          className="mt-12 inline-flex rounded-xl border border-slate-700 px-5 py-3 font-semibold transition hover:border-cyan-400 hover:text-cyan-400"
        >
          ← Revit rehberlerine dön
        </Link>
      </article>
    </main>
  );
}
