type Guide = {
  title: string;
  description: string;
  category: string;
  keyPoints: string[];
  workflow: string[];
  pitfalls: string[];
};

const revitContext: Record<string, { before: string[]; evidence: string[]; advanced: string }> = {
  "Proje Kurulumu": {
    before: ["Proje birimi ve ortak sıfır kotu", "Mimari–statik koordinat kararı", "Ofis adlandırma standardı"],
    evidence: ["Kesit ve cephede datum kontrolü", "Örnek plan görünüşü", "Koordinasyon modelinde çakışma kontrolü"],
    advanced: "Kararı tek görünüşte değil, bağlantılı model ve tekrarlanan kat davranışında test et.",
  },
  Koordinasyon: {
    before: ["Kaynak dosyanın birimi ve koordinatı", "Bağlantının güncelleme sorumlusu", "Model/CAD sürüm tarihi"],
    evidence: ["Origin ve Survey Point kontrol görünüşü", "Link sürüm kaydı", "İki referans noktayla konum doğrulaması"],
    advanced: "Elle taşıma ile geçici olarak doğru görünen bağlantılar sonraki güncellemede bozulabilir; dönüşümü belgeli kur.",
  },
  Modelleme: {
    before: ["Elemanın gerçek yapım katmanları", "Doğru kategori ve host ilişkisi", "Tip–örnek parametresi kararı"],
    evidence: ["Plan, kesit ve 3D birlikte kontrol", "Malzeme ve metraj testi", "Birleşim ve detay seviyesi kontrolü"],
    advanced: "Modeli yalnız doğru görünecek şekilde değil; kesit, schedule, detay ve revizyonda tutarlı davranacak şekilde kur.",
  },
  "Hata Çözümü": {
    before: ["Uyarıdaki eleman kimlikleri", "Sorun öncesi son değişiklik", "Yedek proje kopyası"],
    evidence: ["Uyarı sayısındaki değişim", "Plan–kesit–3D karşılaştırması", "Düzeltme sonrası yeniden üretim testi"],
    advanced: "Belirtiyi görünüşte gizlemek yerine ilişki, host, sketch veya geometri kaynağını düzelt.",
  },
  Görünürlük: {
    before: ["View Template ve Discipline", "Phase, Workset ve Design Option", "Crop, Scope Box ve View Range"],
    evidence: ["Template’siz test görünüşü", "Reveal Hidden Elements kontrolü", "Başka görünüşle karşılaştırma"],
    advanced: "Görünmeyen elemanı yeniden modellemeden önce görünüşe özel ve model genelindeki filtreleri sırayla ele.",
  },
  "Proje Yönetimi": {
    before: ["Ekip standardı ve yetkiler", "Merkezi model/yedek durumu", "Değişikliğin etkileyeceği görünüşler"],
    evidence: ["Browser ve schedule kontrolü", "Warning/performans karşılaştırması", "Ekip üyesiyle senkronizasyon testi"],
    advanced: "Tek kullanıcıda çalışan çözümün worksharing, template ve teslim standardında da sürdürülebilir olduğunu doğrula.",
  },
  Dokümantasyon: {
    before: ["Pafta ölçüsü ve baskı ölçeği", "Titleblock ve numaralandırma standardı", "Görünüş şablonu"],
    evidence: ["PDF deneme baskısı", "Sheet list ve referans kontrolü", "Aynı seride hizalama karşılaştırması"],
    advanced: "Ekrandaki düzen yerine baskıdaki okunabilirliği; viewport başlığı, referans ve revizyon bilgisiyle birlikte değerlendir.",
  },
  Malzeme: {
    before: ["Graphics ve Appearance ihtiyacı", "Gerçek doku ölçüsü", "Paylaşılan asset kullanımı"],
    evidence: ["Hidden Line ve Realistic karşılaştırması", "Render önizlemesi", "Dış yazılıma aktarım testi"],
    advanced: "Aynı malzemenin kesit taraması, gerçekçi görünüşü ve render asseti üç ayrı kontrol alanıdır.",
  },
  Arazi: {
    before: ["Kot verisinin birimi ve referansı", "Mevcut–öneri faz kurgusu", "Nokta yoğunluğu"],
    evidence: ["Boyuna/enine kesit", "Kazı-dolgu hacim kontrolü", "Koordinasyon modelinde temel kesişimi"],
    advanced: "Araziyi görsel yüzey olarak değil; faz, malzeme, kazı ve koordinat bilgisi taşıyan sistem elemanı olarak yönet.",
  },
  Family: {
    before: ["Family kategorisi ve host türü", "Type/Instance davranışı", "Gerekli schedule/tag alanları"],
    evidence: ["Family Types ile flex testi", "Farklı projede yükleme testi", "Plan–kesit–3D görünürlük testi"],
    advanced: "Family’yi tek ölçüde değil, minimum–ortalama–maksimum parametre değerlerinde flex ederek doğrula.",
  },
  Sunum: {
    before: ["Sunum görünüşünün kopyası", "Model geometrisini değiştirmeme kararı", "Çıktı ölçeği"],
    evidence: ["Ana modelle konum karşılaştırması", "PDF çıktısı", "Görünüş bağımlılık kontrolü"],
    advanced: "Sunum tekniğini üretim modelinden ayır; görünüşe özel araçları tercih ederek model koordinatını koru.",
  },
};

const bimContext: Record<string, { before: string[]; evidence: string[]; advanced: string }> = {
  "BIM Temelleri": {
    before: ["Proje hedefi ve kullanım senaryosu", "Beklenen teslim ve karar", "Sorumlu taraf"],
    evidence: ["Tanımlı model kullanımı", "Ölçülebilir başarı kriteri", "Teslim örneği"],
    advanced: "BIM terimini yazılım özelliğiyle değil, üretilen bilginin hangi kararı desteklediğiyle tanımla.",
  },
  "Bilgi Gereksinimi": {
    before: ["Bilgiyi kullanacak taraf", "Teslim kilometre taşı", "Kabul ölçütü"],
    evidence: ["Eleman bazlı gereksinim matrisi", "Örnek doğru/yanlış teslim", "Doğrulama kuralı"],
    advanced: "Daha fazla veri istemek yerine doğru zamanda kullanılacak, doğrulanabilir minimum bilgiyi tarif et.",
  },
  "Open BIM": {
    before: ["Alıcı ve kaynak yazılımlar", "IFC sürümü/MVD", "Property ve sınıflandırma eşlemesi"],
    evidence: ["Test export raporu", "Alıcı yazılım ekran görüntüsü", "Geometri ve property karşılaştırması"],
    advanced: "Başarılı export dosyanın açılması değil, amaçlanan nesne ve bilgilerin alıcı tarafta korunmasıdır.",
  },
  "Bilgi Yönetimi": {
    before: ["Rol ve onay yetkileri", "CDE durumları", "Dosya/metadata standardı"],
    evidence: ["Revizyon geçmişi", "Onay kayıtları", "Teslim ve sorumluluk matrisi"],
    advanced: "Klasör yapısını süreç sanma; her belgenin durumu, sahibi, onayı ve geçerli sürümü görünür olmalıdır.",
  },
  Standartlar: {
    before: ["Sözleşme ve yerel gereksinimler", "Proje tarafları", "Bilgi teslim planı"],
    evidence: ["Standart maddesi–proje uygulaması eşlemesi", "BEP/CDE kaydı", "Denetim sonucu"],
    advanced: "Standardı kopyalanan metin olarak değil, projedeki sorumlu, zaman ve doğrulama adımına dönüştür.",
  },
  Koordinasyon: {
    before: ["Ortak koordinat ve model sürümü", "Test matrisi ve tolerans", "Disiplin sorumluları"],
    evidence: ["Federasyon modeli", "Atanmış issue listesi", "Kapanış doğrulaması"],
    advanced: "Clash sayısını azaltmak hedef değildir; gerçek tasarım/yapım risklerini sorumlu ve tarihle kapatmak hedeftir.",
  },
  Kalite: {
    before: ["Teslim amacı ve kabul kriteri", "Kontrol kapsamı", "Model sürümü"],
    evidence: ["Kontrol raporu", "Hata trendi", "Örneklemle doğrulanmış veri"],
    advanced: "Görsel kontrol, kural tabanlı kontrol ve belge kontrolünü aynı kalite planında birleştir.",
  },
  "Proje Stratejisi": {
    before: ["Ekip ve proje büyüklüğü", "Model sahipliği", "Teknoloji ve teslim kısıtları"],
    evidence: ["Pilot çalışma", "Sorumluluk matrisi", "Performans ve koordinasyon ölçümü"],
    advanced: "Stratejiyi proje başlamadan pilot dosyayla test et; model bölme ve yazılım kararının değiştirme maliyeti yüksektir.",
  },
  "Ekip Yönetimi": {
    before: ["Görev listesi", "Yetki sınırları", "Karar ve eskalasyon yolu"],
    evidence: ["RACI matrisi", "Toplantı karar kaydı", "Teslim sorumlusu"],
    advanced: "Rol adı tek başına sorumluluk üretmez; her görev için üreten, kontrol eden ve onaylayan tarafı ayır.",
  },
  "BIM Kullanımları": {
    before: ["Model kullanım amacı", "Gerekli sınıflandırma", "Kaynak sistem ve güncelleme periyodu"],
    evidence: ["Kontrollü miktar/zaman örneği", "Revizyon fark raporu", "Kaynak veriye izlenebilir bağlantı"],
    advanced: "Animasyon veya otomatik tabloyu sonuç sanma; model çıktısını saha, maliyet veya tasarım kararıyla doğrula.",
  },
  İşletme: {
    before: ["İşletmecinin kullanım senaryosu", "Asset kimlik standardı", "Bakım sistemi bağlantısı"],
    evidence: ["Doğrulanmış varlık kaydı", "Belge ve mekân bağlantısı", "Devreye alma onayı"],
    advanced: "Yapım modelindeki her veriyi taşımak yerine işletmede güncellenecek kritik varlık bilgisini seç.",
  },
  Strateji: {
    before: ["Mevcut süreç ve darboğaz", "Ölçülebilir hedef", "İnsan–süreç–teknoloji bütünü"],
    evidence: ["Başlangıç ölçümü", "Pilot proje sonucu", "İyileştirme yol haritası"],
    advanced: "Lisans satın almayı dönüşüm sanma; başarıyı tekrar iş, bilgi kaybı ve teslim kalitesi üzerinden ölç.",
  },
};

function fallback(kind: "revit" | "bim") {
  return kind === "revit"
    ? {
        before: ["Proje kopyası", "İlgili görünüş ve şablon", "Ofis modelleme standardı"],
        evidence: ["Plan–kesit–3D kontrolü", "Uyarı ve çıktı testi", "Değişiklik öncesi/sonrası karşılaştırması"],
        advanced: "İşlemi ana teslim modeline uygulamadan önce küçük bir test görünüşünde doğrula.",
      }
    : {
        before: ["Kullanım amacı", "Sorumlu taraf", "Teslim ve kabul kriteri"],
        evidence: ["Kayıtlı karar", "Kontrol raporu", "Doğrulanmış teslim"],
        advanced: "Süreci proje hedefi, sorumluluk ve ölçülebilir kontrol adımıyla ilişkilendir.",
      };
}

export default function TechnicalGuideDetails({
  guide,
  kind,
}: {
  guide: Guide;
  kind: "revit" | "bim";
}) {
  const context =
    (kind === "revit" ? revitContext[guide.category] : bimContext[guide.category]) ??
    fallback(kind);

  return (
    <>
      <section className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold">Neden önemli?</h2>
          <p className="mt-4 leading-7 text-slate-300">
            {guide.description} Yanlış veya belgesiz bir karar, sonraki aşamada
            koordinasyon kaybı, yeniden çalışma ve teslim tutarsızlığı
            oluşturabilir. Bu nedenle sonucu yalnız ekranda değil, ilişkili
            görünüşler ve proje çıktıları üzerinden doğrulamak gerekir.
          </p>
        </div>
        <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
          <h2 className="text-2xl font-bold text-cyan-200">İleri seviye not</h2>
          <p className="mt-4 leading-7 text-slate-300">{context.advanced}</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Başlamadan önce hazırla</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {context.before.map((item, index) => (
            <div key={item} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <span className="text-sm font-semibold text-cyan-300">0{index + 1}</span>
              <p className="mt-3 leading-6 text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Karar ve doğrulama tablosu</h2>
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-900 text-slate-300">
                <tr>
                  <th className="px-5 py-4">Kontrol konusu</th>
                  <th className="px-5 py-4">Uygulamada sorulacak soru</th>
                  <th className="px-5 py-4">Kanıt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {guide.keyPoints.map((point, index) => (
                  <tr key={point}>
                    <td className="px-5 py-4 font-medium text-white">{point}</td>
                    <td className="px-5 py-4 leading-6 text-slate-400">
                      {guide.workflow[index % guide.workflow.length]} adımı bu
                      kararı gerçekten karşılıyor mu?
                    </td>
                    <td className="px-5 py-4 leading-6 text-cyan-200">
                      {context.evidence[index % context.evidence.length]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
