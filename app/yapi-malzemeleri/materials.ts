export type RatingKey =
  | "thermal"
  | "acoustic"
  | "fire"
  | "moisture"
  | "lightness"
  | "workability"
  | "economy";

export type Material = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  uses: string[];
  advantages: string[];
  considerations: string[];
  selectionNotes: string[];
  ratings: Record<RatingKey, number>;
  keywords: string[];
};

export type MaterialCategory = {
  slug: string;
  name: string;
  description: string;
  icon: string;
};

export const materialCategories: MaterialCategory[] = [
  {
    slug: "duvar",
    name: "Duvar Malzemeleri",
    description:
      "Bölme ve dolgu duvarlarında kullanılan tuğla, gazbeton ve bims blokları karşılaştır.",
    icon: "▦",
  },
  {
    slug: "yalitim",
    name: "Yalıtım Malzemeleri",
    description:
      "Isı, ses ve yangın performansı için taş yünü, cam yünü, EPS ve XPS seçeneklerini incele.",
    icon: "≋",
  },
  {
    slug: "cam",
    name: "Cam Türleri",
    description:
      "Cephe, pencere ve iç mekânlarda kullanılan düz, temperli, lamine ve Low-E camları öğren.",
    icon: "◇",
  },
  {
    slug: "ahsap",
    name: "Ahşap ve Levha Ürünleri",
    description:
      "Masif ahşap, kontrplak, OSB ve CLT ürünlerinin yapıdaki kullanım alanlarını karşılaştır.",
    icon: "▤",
  },
  {
    slug: "siva",
    name: "Sıva Malzemeleri",
    description:
      "Alçı, çimento ve kireç esaslı sıvaların iç-dış mekân performanslarını incele.",
    icon: "▥",
  },
  {
    slug: "beton",
    name: "Beton Türleri",
    description:
      "Normal, yüksek dayanımlı, lifli ve hafif betonların temel özelliklerini öğren.",
    icon: "▰",
  },
  {
    slug: "zemin-kaplama",
    name: "Zemin Kaplamaları",
    description:
      "Porselen karo, doğal taş, epoksi, lamine parke ve vinil zeminleri karşılaştır.",
    icon: "▧",
  },
];

export const materials: Material[] = [
  {
    slug: "tugla",
    name: "Tuğla",
    category: "duvar",
    summary:
      "Pişmiş kil esaslı, yaygın bulunan ve farklı boşluk oranlarında üretilebilen geleneksel duvar malzemesi.",
    description:
      "Tuğla; kilin biçimlendirilip pişirilmesiyle üretilen, taşıyıcı olmayan bölme ve dolgu duvarlarında yaygın kullanılan bir yapı malzemesidir. Ürünün boşluk oranı, geometrisi ve üretim standardı ısı, ses, ağırlık ve basınç davranışını belirler.",
    uses: ["Dış dolgu duvarları", "İç bölme duvarları", "Cephe ve dekoratif yüzeyler"],
    advantages: [
      "Yaygın tedarik ve bilinen uygulama yöntemi",
      "Kâgir ve masif duvar hissi",
      "Doğru katmanlarla dengeli ısı ve ses performansı",
      "Farklı kalınlık ve ürün tipleri",
    ],
    considerations: [
      "Harç işçiliği ve uygulama süresi projeye göre artabilir",
      "Isı köprüleri ve derz sürekliliği dikkat ister",
      "Suya açık yüzeylerde doğru kaplama ve detay gerekir",
    ],
    selectionNotes: [
      "Taşıyıcı veya dolgu ürünü olduğuna bak",
      "Duvar kalınlığını yangın, ses ve tesisat gereksinimleriyle birlikte seç",
      "Üreticinin performans beyanını ve ilgili standardı kontrol et",
    ],
    ratings: { thermal: 3, acoustic: 4, fire: 5, moisture: 3, lightness: 2, workability: 3, economy: 4 },
    keywords: ["tuğla duvar", "delikli tuğla", "tuğla özellikleri"],
  },
  {
    slug: "gazbeton",
    name: "Gazbeton",
    category: "duvar",
    summary:
      "Gözenekli yapısı sayesinde hafiflik ve ısı performansını bir araya getiren blok duvar ürünü.",
    description:
      "Gazbeton; çimento, kireç, silisli malzeme ve gözenek oluşturucu bileşenlerle üretilen hafif bir mineral esaslı yapı ürünüdür. Hassas ölçülü bloklar ince derz uygulamasına izin verebilir ve kolay kesilebilmesi şantiye işçiliğini hızlandırabilir.",
    uses: ["Dış dolgu duvarları", "İç bölme duvarları", "Yangın ayırıcı duvarlar", "Dolgu ve parapetler"],
    advantages: [
      "Düşük birim ağırlık",
      "İyi ısı yalıtım katkısı",
      "Kolay kesim ve tesisat kanalı açma",
      "Mineral yapısı nedeniyle güçlü yangın davranışı",
    ],
    considerations: [
      "Darbe ve noktasal yüklere karşı uygun dübel gerekir",
      "Su ve nem detayları doğru çözülmelidir",
      "İnce sıva uygulamasında yüzey hazırlığı önemlidir",
    ],
    selectionNotes: [
      "Yoğunluk ve basınç dayanımı sınıfını projeye göre seç",
      "Cephede yalnız blok değerine değil tüm duvar katmanına bak",
      "Ağır dolap ve ekipmanlar için bağlantı detayını önceden çöz",
    ],
    ratings: { thermal: 5, acoustic: 3, fire: 5, moisture: 3, lightness: 5, workability: 5, economy: 4 },
    keywords: ["gazbeton nedir", "gazbeton duvar", "gazbeton özellikleri"],
  },
  {
    slug: "bims",
    name: "Bims Blok",
    category: "duvar",
    summary:
      "Pomza agregalı hafif yapısıyla dolgu ve bölme duvarlarında kullanılan blok malzeme.",
    description:
      "Bims blok, doğal pomza agregasının bağlayıcılarla bir araya getirilmesiyle üretilen gözenekli ve hafif bir duvar elemanıdır. Ürün geometrisi, yoğunluğu ve boşluk düzeni performansı önemli ölçüde etkiler.",
    uses: ["İç bölme duvarları", "Dış dolgu duvarları", "Isı ve ses odaklı kâgir duvarlar"],
    advantages: [
      "Gözenekli ve görece hafif yapı",
      "Isı performansına katkı",
      "Kâgir uygulama alışkanlıklarına uygunluk",
      "Farklı kalınlık ve blok geometrileri",
    ],
    considerations: [
      "Ürün kalitesi ve boyut hassasiyeti üreticiye göre değişebilir",
      "Yüzey ve sıva uyumu kontrol edilmelidir",
      "Ağır eleman bağlantılarında uygun dübel kullanılmalıdır",
    ],
    selectionNotes: [
      "Blok yoğunluğu ve boşluk geometrisini karşılaştır",
      "Ses performansını yalnız malzeme üzerinden değil duvar sistemi üzerinden değerlendir",
      "Şantiye kırılma ve fire oranını hesaba kat",
    ],
    ratings: { thermal: 4, acoustic: 4, fire: 5, moisture: 3, lightness: 4, workability: 4, economy: 4 },
    keywords: ["bims nedir", "bims blok", "bims gazbeton tuğla karşılaştırma"],
  },
  {
    slug: "tas-yunu",
    name: "Taş Yünü",
    category: "yalitim",
    summary: "Mineral lifli yapısıyla ısı, ses ve yangın performansında kullanılan yalıtım ürünü.",
    description:
      "Taş yünü, mineral hammaddelerin yüksek sıcaklıkta eritilip lif hâline getirilmesiyle üretilir. Yoğunluk ve kaplama türüne bağlı olarak cephe, çatı, bölme duvar ve tesisat uygulamalarında kullanılabilir.",
    uses: ["Mantolama sistemleri", "Giydirme cephe arkası", "Çatı ve döşeme", "Akustik bölmeler"],
    advantages: ["Güçlü yangın davranışı", "Ses yutma katkısı", "Buhar geçirgen sistemlere uygunluk"],
    considerations: ["Islanmaya karşı detay gerekir", "Uygulamada kişisel koruma kullanılmalıdır", "Yoğunluk doğru seçilmelidir"],
    selectionNotes: ["Cephe ve çatı ürünlerini karıştırma", "Yangın sınıfı ve yoğunluğu kontrol et", "Mekanik sabitlemeyi sisteme göre çöz"],
    ratings: { thermal: 5, acoustic: 5, fire: 5, moisture: 3, lightness: 4, workability: 3, economy: 3 },
    keywords: ["taş yünü", "taş yünü yalıtım", "yangın yalıtımı"],
  },
  {
    slug: "cam-yunu",
    name: "Cam Yünü",
    category: "yalitim",
    summary: "Hafif mineral lifli yapısıyla çatı, bölme ve tesisatlarda kullanılan yalıtım malzemesi.",
    description:
      "Cam yünü, cam esaslı hammaddenin liflendirilmesiyle üretilir. Rulo veya levha biçimindeki ürünler hafiflikleri ve boşlukları doldurabilmeleri nedeniyle özellikle kuru duvar ve çatı sistemlerinde kullanılır.",
    uses: ["Çatı araları", "Alçı levha bölmeler", "Asma tavanlar", "Tesisat yalıtımı"],
    advantages: ["Hafif ve esnek uygulama", "Isı ve akustik katkı", "Boşluklara uyum"],
    considerations: ["Sıkışma performansı düşürebilir", "Nem ve yoğuşma detayı gerekir", "Koruyucu ekipmanla uygulanmalıdır"],
    selectionNotes: ["Kalınlık ve yoğunluğu sistem hesabına göre seç", "Buhar kesici gereksinimini kontrol et", "Kesintisiz yerleşim sağla"],
    ratings: { thermal: 5, acoustic: 5, fire: 5, moisture: 2, lightness: 5, workability: 4, economy: 4 },
    keywords: ["cam yünü", "cam yünü yalıtım", "taş yünü cam yünü farkı"],
  },
  {
    slug: "eps",
    name: "EPS",
    category: "yalitim",
    summary: "Genleştirilmiş polistiren esaslı, hafif ve ekonomik ısı yalıtım levhası.",
    description:
      "EPS, polistiren taneciklerinin genleştirilip kalıplanmasıyla oluşan hücresel bir yalıtım ürünüdür. Mantolama, döşeme ve dolgu uygulamalarında farklı yoğunluk ve dayanım sınıflarıyla kullanılır.",
    uses: ["Dış cephe mantolama", "Döşeme altı", "Sandviç sistemler", "Hafif dolgu"],
    advantages: ["Düşük ağırlık", "Ekonomik seçenekler", "Kolay kesim", "Yaygın sistem bileşenleri"],
    considerations: ["Yangın detayı sistem olarak çözülmelidir", "UV ve çözücülerden korunmalıdır", "Darbe dayanımı kaplama sistemine bağlıdır"],
    selectionNotes: ["Yoğunluk yerine beyan edilen basınç ve ısı değerlerini kontrol et", "Yangın bariyerlerini projeye ekle", "Onaylı mantolama sistemi kullan"],
    ratings: { thermal: 5, acoustic: 2, fire: 2, moisture: 4, lightness: 5, workability: 5, economy: 5 },
    keywords: ["EPS yalıtım", "mantolama köpüğü", "EPS XPS farkı"],
  },
  {
    slug: "xps",
    name: "XPS",
    category: "yalitim",
    summary: "Kapalı hücreli yapısı ve basınç dayanımıyla suya ve yüke açık bölgelerde kullanılan levha.",
    description:
      "XPS, ekstrüde polistiren esaslı kapalı hücreli bir ısı yalıtım ürünüdür. Su emme direnci ve basınç performansı nedeniyle temel, teras, otopark ve döşeme uygulamalarında öne çıkar.",
    uses: ["Ters teras çatılar", "Temel ve perde dışı", "Döşeme altı", "Yük alan yalıtım katmanları"],
    advantages: ["Düşük su emme", "Yüksek basınç performansı", "Kolay kesim ve uygulama"],
    considerations: ["Yangın güvenliği sistem düzeyinde çözülmelidir", "UV ışınından korunmalıdır", "Her cephe sistemi için uygun olmayabilir"],
    selectionNotes: ["Basınç dayanım sınıfını yüke göre seç", "Derzleri şaşırtmalı yerleştir", "Su yalıtımıyla katman sırasını doğru kur"],
    ratings: { thermal: 5, acoustic: 2, fire: 2, moisture: 5, lightness: 5, workability: 5, economy: 3 },
    keywords: ["XPS yalıtım", "XPS nedir", "EPS XPS karşılaştırma"],
  },
  {
    slug: "duz-cam",
    name: "Düz Cam",
    category: "cam",
    summary: "Pencere, cephe ve işlenmiş cam ürünlerinin temelini oluşturan standart cam.",
    description:
      "Düz cam, çoğunlukla float yöntemiyle üretilen ve sonraki temperleme, lamine etme veya kaplama işlemlerine temel oluşturan cam ürünüdür.",
    uses: ["Pencere", "İç bölme", "Ayna ve mobilya", "İşlenmiş cam üretimi"],
    advantages: ["Yüksek ışık geçirgenliği", "Yaygın kalınlık seçenekleri", "İşlenebilir temel ürün"],
    considerations: ["Kırılma güvenliği gereken yerde tek başına uygun olmayabilir", "Isı performansı cam ünitesine bağlıdır", "Kenar ve montaj detayları önemlidir"],
    selectionNotes: ["Güvenlik gereksinimini belirle", "Tek cam yerine tüm yalıtım camı ünitesini değerlendir", "Rüzgâr yüküne göre kalınlık hesabı yaptır"],
    ratings: { thermal: 2, acoustic: 2, fire: 1, moisture: 5, lightness: 2, workability: 3, economy: 5 },
    keywords: ["düz cam", "float cam", "mimari cam türleri"],
  },
  {
    slug: "temperli-cam",
    name: "Temperli Cam",
    category: "cam",
    summary: "Isıl işlemle dayanımı artırılan ve kırıldığında küçük parçalara ayrılan güvenlik camı.",
    description:
      "Temperli cam, kontrollü ısıtma ve hızlı soğutmayla yüzeyinde basınç gerilmeleri oluşturulan camdır. Darbe ve sıcaklık farklarına standart cama göre daha dayanıklıdır.",
    uses: ["Cam kapılar", "Duş bölmeleri", "Cepheler", "Korkuluk sistemleri"],
    advantages: ["Artırılmış mekanik dayanım", "Daha güvenli kırılma biçimi", "Isıl gerilime direnç"],
    considerations: ["Temper sonrası kesilemez veya delinemez", "Korkulukta tek başına kalıntı taşıma sağlamayabilir", "Nikel sülfür riski projeye göre değerlendirilir"],
    selectionNotes: ["Tüm delik ve kesimleri temper öncesi tanımla", "Düşmeye karşı korumada lamine kombinasyonu düşün", "Isıl işlem standardını doğrula"],
    ratings: { thermal: 2, acoustic: 2, fire: 2, moisture: 5, lightness: 2, workability: 2, economy: 3 },
    keywords: ["temperli cam", "güvenlik camı", "temperli cam özellikleri"],
  },
  {
    slug: "lamine-cam",
    name: "Lamine Cam",
    category: "cam",
    summary: "Cam tabakalarının ara katmanla birleştirilmesi sayesinde kırıldığında parçaları tutabilen güvenlik camı.",
    description:
      "Lamine cam, iki veya daha fazla cam levhanın polimer ara katmanla birleştirilmesiyle üretilir. Kırılma sonrasında parçaların ara katmana tutunması güvenlik ve bazı akustik uygulamalar için avantaj sağlar.",
    uses: ["Korkuluklar", "Çatı camları", "Vitrinler", "Akustik cam üniteleri"],
    advantages: ["Kırılan parçaları tutma", "Güvenlik katmanı", "Ara katmana bağlı akustik ve UV seçenekleri"],
    considerations: ["Kenarların neme karşı korunması gerekir", "Ağırlık ve maliyet artabilir", "Taşıyıcılık tasarımı uzman hesabı ister"],
    selectionNotes: ["Ara katman türünü kullanım yerine göre seç", "Kenar detayını açıkta bırakma", "Temperli-lamine kombinasyonunu risk analizine göre belirle"],
    ratings: { thermal: 2, acoustic: 4, fire: 2, moisture: 4, lightness: 1, workability: 2, economy: 2 },
    keywords: ["lamine cam", "temperli lamine cam farkı", "korkuluk camı"],
  },
  {
    slug: "low-e-cam",
    name: "Low-E Cam",
    category: "cam",
    summary: "Düşük yayınımlı kaplamasıyla cam üzerinden gerçekleşen ısı transferini azaltmaya yardımcı olan ürün.",
    description:
      "Low-E cam, yüzeyindeki düşük yayınımlı ince kaplama sayesinde uzun dalga ısı ışınımını kontrol eder. Performansı kaplamanın türüne, cam ünitesindeki yüzey konumuna, boşluk ve gaz dolgusuna bağlıdır.",
    uses: ["Yalıtım camı üniteleri", "Konut pencereleri", "Ofis cepheleri", "Enerji verimli kabuklar"],
    advantages: ["Isı kaybı veya güneş kontrolüne katkı", "Şeffaflığı koruyan kaplama seçenekleri", "Enerji performansına destek"],
    considerations: ["Kaplama yüzeyi doğru konumlandırılmalıdır", "Renk ve yansıma numuneyle kontrol edilmelidir", "Tek başına tüm cephe performansını belirlemez"],
    selectionNotes: ["U değeri, güneş ısı kazanç katsayısı ve ışık geçirgenliğini birlikte değerlendir", "Cephe yönlerine göre cam seç", "Üretici hesaplarını enerji modeliyle doğrula"],
    ratings: { thermal: 5, acoustic: 3, fire: 1, moisture: 5, lightness: 2, workability: 2, economy: 2 },
    keywords: ["Low-E cam", "ısı kontrol camı", "enerji verimli cam"],
  },
  {
    slug: "masif-ahsap",
    name: "Masif Ahşap",
    category: "ahsap",
    summary: "Doğal ağaç dokusunu koruyan, taşıyıcı ve kaplama amaçlı kullanılabilen malzeme.",
    description:
      "Masif ahşap, ağacın doğal lif yapısını koruyan kesilmiş ve kurutulmuş ahşap üründür. Tür, nem oranı, lif yönü, kusurlar ve koruyucu işlem performansı doğrudan etkiler.",
    uses: ["Taşıyıcı elemanlar", "Doğrama", "Kaplama", "Mobilya ve iç mekân"],
    advantages: ["Doğal görünüm", "Kolay işlenebilirlik", "Yenilenebilir kaynak potansiyeli", "İyi ağırlık-dayanım ilişkisi"],
    considerations: ["Nem hareketi ve boyutsal değişim", "Biyolojik zararlılara karşı koruma", "Yangın ve birleşim detayları"],
    selectionNotes: ["Ahşap türü ve dayanım sınıfını belirle", "Kullanım sınıfına göre koruma yap", "Nem hareketine izin veren detay çöz"],
    ratings: { thermal: 4, acoustic: 3, fire: 2, moisture: 2, lightness: 4, workability: 5, economy: 3 },
    keywords: ["masif ahşap", "yapıda ahşap", "ahşap özellikleri"],
  },
  {
    slug: "kontrplak",
    name: "Kontrplak",
    category: "ahsap",
    summary: "Lif yönleri çaprazlanan ince ahşap katmanların preslenmesiyle üretilen levha.",
    description:
      "Kontrplak, soyma kaplama tabakalarının lif yönleri birbirine dik gelecek şekilde yapıştırılmasıyla üretilir. Katman düzeni masif ahşaba göre daha dengeli boyutsal davranış sağlar.",
    uses: ["Kalıp", "Mobilya", "İç kaplama", "Taşıyıcı levha ve diyafram"],
    advantages: ["İki yönde dengeli davranış", "Yüksek levha dayanımı", "İşlenebilir yüzey"],
    considerations: ["Yapıştırıcı ve kullanım sınıfı önemlidir", "Kenarlar neme duyarlı olabilir", "Görünür yüzey kalitesi sınıfa göre değişir"],
    selectionNotes: ["İç-dış kullanım sınıfını kontrol et", "Katman ve yüzey kalitesini belirle", "Taşıyıcı kullanımda mühendislik verisi kullan"],
    ratings: { thermal: 3, acoustic: 3, fire: 2, moisture: 3, lightness: 4, workability: 5, economy: 3 },
    keywords: ["kontrplak", "plywood", "kontrplak özellikleri"],
  },
  {
    slug: "osb",
    name: "OSB",
    category: "ahsap",
    summary: "Yönlendirilmiş ahşap yongaların reçineyle preslenmesiyle üretilen yapısal levha.",
    description:
      "OSB, uzun ahşap yongaların katmanlar hâlinde yönlendirilip bağlayıcıyla preslenmesiyle üretilir. Duvar, çatı ve döşeme kaplamalarında diyafram veya altlık olarak kullanılabilir.",
    uses: ["Hafif karkas kaplama", "Çatı altlığı", "Döşeme altlığı", "Geçici ve dekoratif uygulamalar"],
    advantages: ["Büyük levha boyutu", "Yapısal kaplama potansiyeli", "Hızlı montaj", "Karakteristik yüzey"],
    considerations: ["Kenar şişmesi ve nem riski", "Sınıfına uygun kullanım gerekir", "Görünür yüzeyde emisyon ve kaplama seçimi önemlidir"],
    selectionNotes: ["OSB sınıfını neme ve yüke göre seç", "Levha derzlerinde genleşme boşluğu bırak", "Kenarları sudan koru"],
    ratings: { thermal: 3, acoustic: 3, fire: 2, moisture: 2, lightness: 4, workability: 5, economy: 4 },
    keywords: ["OSB levha", "OSB nedir", "kontrplak OSB farkı"],
  },
  {
    slug: "clt",
    name: "CLT",
    category: "ahsap",
    summary: "Ahşap tabakaların çapraz yönlerde yapıştırılmasıyla oluşan büyük boyutlu taşıyıcı panel.",
    description:
      "CLT, masif ahşap lamellerin katmanlar hâlinde çapraz yönlendirilip yapıştırılmasıyla üretilen mühendislik ürünüdür. Duvar, döşeme ve çatı paneli olarak prefabrike yapı sistemlerinde kullanılır.",
    uses: ["Taşıyıcı duvar", "Döşeme paneli", "Çatı paneli", "Modüler ve prefabrike yapılar"],
    advantages: ["Yüksek prefabrikasyon", "Hızlı kuru montaj", "Görünür ahşap yüzey", "Görece hafif taşıyıcı sistem"],
    considerations: ["Nem yönetimi kritik", "Yangın ve birleşim mühendisliği gerekir", "Tedarik ve lojistik planlanmalıdır"],
    selectionNotes: ["Panel açıklıklarını mühendisle belirle", "Üretim öncesi tüm tesisat boşluklarını koordine et", "Şantiye su koruma planı hazırla"],
    ratings: { thermal: 4, acoustic: 3, fire: 3, moisture: 2, lightness: 4, workability: 4, economy: 2 },
    keywords: ["CLT nedir", "çapraz lamine ahşap", "ahşap taşıyıcı panel"],
  },
  {
    slug: "alci-siva",
    name: "Alçı Sıva",
    category: "siva",
    summary: "İç mekânlarda düzgün yüzey ve hızlı uygulama sağlayan alçı esaslı sıva.",
    description:
      "Alçı sıva, iç duvar ve tavanlarda düzgün, boyaya hazır yüzey oluşturmak için kullanılan mineral esaslı kaplamadır. Nem ve dış hava etkisine sürekli açık alanlar için uygun ürün değildir.",
    uses: ["İç duvar", "Tavan", "Tuğla ve gazbeton yüzeyler", "Onarım ve düzeltme"],
    advantages: ["Düzgün yüzey", "Hızlı priz ve uygulama", "İç mekânda nem dengeleme katkısı"],
    considerations: ["Sürekli ıslak ve dış ortamda kullanılmaz", "Yüzey emiciliği kontrol edilmelidir", "Kalınlık ve kuruma süresi önemlidir"],
    selectionNotes: ["Alt yüzeye uygun astar kullan", "Islak hacimde sistem detayını doğrula", "Boya öncesi tam kuruma bekle"],
    ratings: { thermal: 3, acoustic: 2, fire: 5, moisture: 1, lightness: 4, workability: 5, economy: 4 },
    keywords: ["alçı sıva", "alçı sıva özellikleri", "iç cephe sıvası"],
  },
  {
    slug: "cimento-esasli-siva",
    name: "Çimento Esaslı Sıva",
    category: "siva",
    summary: "İç ve dış yüzeylerde dayanıklı alt katman oluşturabilen çimento esaslı kaplama.",
    description:
      "Çimento esaslı sıva; çimento, agrega ve katkıların karışımıdır. Dış cephe, ıslak hacim ve dayanım gerektiren yüzeylerde uygun sistem bileşenleriyle kullanılabilir.",
    uses: ["Dış cephe", "Islak hacim", "Kâgir duvarlar", "Seramik altı yüzey"],
    advantages: ["Neme karşı alçıya göre daha dayanıklı", "İç-dış kullanım seçenekleri", "Sağlam altlık"],
    considerations: ["Rötre çatlağı riski", "Kür ve uygulama koşulları önemlidir", "Buhar geçirgenliği karışıma bağlıdır"],
    selectionNotes: ["Hazır karışımın kullanım yerini kontrol et", "Farklı yüzey birleşimlerinde file düşün", "Kür ve katman kalınlığına uy"],
    ratings: { thermal: 2, acoustic: 3, fire: 5, moisture: 4, lightness: 2, workability: 3, economy: 4 },
    keywords: ["çimento sıva", "dış cephe sıvası", "çimento esaslı sıva"],
  },
  {
    slug: "kirec-siva",
    name: "Kireç Esaslı Sıva",
    category: "siva",
    summary: "Buhar geçirgenliği ve geleneksel yapılarla uyumu nedeniyle tercih edilen sıva türü.",
    description:
      "Kireç esaslı sıva, özellikle tarihi kâgir yapılarda esneklik ve buhar geçirgenliği nedeniyle kullanılır. Bağlayıcı türü ve hidrolik özellikleri kullanım alanını belirler.",
    uses: ["Tarihi yapı onarımı", "Nefes alan duvar sistemleri", "İç ve korunaklı dış yüzeyler"],
    advantages: ["Yüksek buhar geçirgenliği", "Geleneksel kâgirle uyum", "Görece esnek davranış"],
    considerations: ["Daha yavaş dayanım gelişimi", "Usta uygulaması gerekebilir", "Sert çimento esaslı katmanlarla uyumsuzluk"],
    selectionNotes: ["Mevcut harç analizine göre ürün seç", "Tarihi yapıda uzman görüşü al", "Hızlı kuruma ve güneşten koru"],
    ratings: { thermal: 3, acoustic: 3, fire: 5, moisture: 3, lightness: 3, workability: 3, economy: 3 },
    keywords: ["kireç sıva", "tarihi yapı sıvası", "nefes alan sıva"],
  },
  {
    slug: "normal-beton",
    name: "Normal Beton",
    category: "beton",
    summary: "Çimento, su, agrega ve gerektiğinde katkılarla üretilen yaygın taşıyıcı yapı malzemesi.",
    description:
      "Normal beton, yapıların temel taşıyıcı elemanlarında kullanılan en yaygın beton grubudur. Dayanım sınıfı, çevresel etki, kıvam, agrega ve kür koşulları birlikte tanımlanmalıdır.",
    uses: ["Temel", "Kolon ve perde", "Kiriş", "Döşeme"],
    advantages: ["Yaygın üretim", "Basınç dayanımı", "Farklı kalıplara uyum", "Donatıyla birlikte çok yönlü kullanım"],
    considerations: ["Çekme davranışı için donatı gerekir", "Kür kalitesi kritiktir", "Yüksek öz ağırlık ve karbon etkisi"],
    selectionNotes: ["Yalnız dayanım değil çevresel etki sınıfını da belirle", "Yerleştirme ve vibrasyon planı yap", "Numune ve saha kalite kontrolünü uygula"],
    ratings: { thermal: 1, acoustic: 5, fire: 4, moisture: 4, lightness: 1, workability: 3, economy: 4 },
    keywords: ["beton nedir", "normal beton", "beton özellikleri"],
  },
  {
    slug: "yuksek-dayanimli-beton",
    name: "Yüksek Dayanımlı Beton",
    category: "beton",
    summary: "Daha yüksek basınç dayanımı ve yoğun performans kontrolü gerektiren beton.",
    description:
      "Yüksek dayanımlı beton, yüksek yapı, büyük yük veya kesit küçültme gibi hedeflerde kullanılan; karışım tasarımı, üretim ve kür kontrolü daha hassas beton grubudur.",
    uses: ["Yüksek yapı kolonları", "Ağır yüklü elemanlar", "Köprü ve altyapı", "Kesit optimizasyonu"],
    advantages: ["Yüksek basınç kapasitesi", "Kesit küçültme potansiyeli", "Uygun tasarımda dayanıklılık"],
    considerations: ["Kırılganlık ve yangın davranışı özel analiz ister", "Sıkı kalite kontrol", "Daha yüksek maliyet ve uzmanlık"],
    selectionNotes: ["Gereksiz yüksek sınıftan kaçın", "Pompalama ve yerleştirme denemesi yap", "Yangın ve rötre hesabını ihmal etme"],
    ratings: { thermal: 1, acoustic: 5, fire: 3, moisture: 5, lightness: 1, workability: 2, economy: 2 },
    keywords: ["yüksek dayanımlı beton", "yüksek performanslı beton", "beton sınıfları"],
  },
  {
    slug: "lifli-beton",
    name: "Lifli Beton",
    category: "beton",
    summary: "Çelik, sentetik, cam veya diğer liflerle çatlak kontrolü ve tokluk kazandırılan beton.",
    description:
      "Lifli beton, karışıma dağıtılan liflerle çatlak sonrası davranışın, darbe direncinin veya plastik rötre kontrolünün geliştirildiği beton türüdür. Lif türü tasarım amacına göre seçilir.",
    uses: ["Endüstriyel zemin", "Püskürtme beton", "Prekast eleman", "İnce kabuk ve cephe elemanı"],
    advantages: ["Çatlak kontrolü", "Tokluk ve darbe direnci", "Bazı uygulamalarda donatı optimizasyonu"],
    considerations: ["Lif topaklanması ve işlenebilirlik", "Yüzey bitişi etkilenebilir", "Her lif taşıyıcı donatının yerine geçmez"],
    selectionNotes: ["Lif türünü hedef performansa göre seç", "Dozaj ve karışım denemesi yap", "Statik ikameyi mühendislik hesabıyla doğrula"],
    ratings: { thermal: 1, acoustic: 5, fire: 4, moisture: 4, lightness: 1, workability: 2, economy: 2 },
    keywords: ["lifli beton", "çelik lifli beton", "fiber beton"],
  },
  {
    slug: "hafif-beton",
    name: "Hafif Beton",
    category: "beton",
    summary: "Hafif agrega veya gözenekli yapı sayesinde birim ağırlığı azaltılmış beton grubu.",
    description:
      "Hafif beton, hafif agrega, köpük veya gözenek oluşturma yöntemleriyle normal betona göre daha düşük birim ağırlığa sahip betonları kapsar. Taşıyıcı ve taşıyıcı olmayan farklı türleri vardır.",
    uses: ["Eğim ve dolgu", "Hafif blok", "Prefabrike eleman", "Taşıyıcı hafif beton sistemleri"],
    advantages: ["Düşük öz ağırlık", "Isı performansına katkı", "Taşıyıcı yükleri azaltma potansiyeli"],
    considerations: ["Dayanım ve su emme türüne göre değişir", "Yüzey ve bağlantı detayları", "Pompalama ve bitiş farklı olabilir"],
    selectionNotes: ["Taşıyıcı olup olmadığını kesinleştir", "Yoğunluk ve dayanımı birlikte değerlendir", "Su emme ve kaplama uyumunu kontrol et"],
    ratings: { thermal: 4, acoustic: 3, fire: 4, moisture: 3, lightness: 5, workability: 3, economy: 3 },
    keywords: ["hafif beton", "köpük beton", "hafif agrega betonu"],
  },
  {
    slug: "porselen-karo",
    name: "Porselen Karo",
    category: "zemin-kaplama",
    summary: "Düşük su emme ve yüksek aşınma seçenekleriyle iç-dış zeminde kullanılan seramik kaplama.",
    description:
      "Porselen karo, yoğun gövdeli ve yüksek sıcaklıkta pişirilen seramik kaplama ürünüdür. Yüzey dokusu, kayma direnci, aşınma sınıfı ve kalınlık kullanım yerine göre seçilir.",
    uses: ["Konut ve ticari zemin", "Islak hacim", "Teras", "Cephe kaplaması"],
    advantages: ["Düşük su emme", "Geniş desen ve boyut", "Kolay bakım", "Aşınma seçenekleri"],
    considerations: ["Derz ve altlık hareketi", "Kayganlık riski", "Büyük ebatta hassas uygulama"],
    selectionNotes: ["Kayma sınıfını kullanım yerine göre seç", "Dış mekânda don ve su performansını doğrula", "Büyük ebat için uygun yapıştırıcı ve tesviye kullan"],
    ratings: { thermal: 1, acoustic: 2, fire: 5, moisture: 5, lightness: 2, workability: 3, economy: 4 },
    keywords: ["porselen karo", "seramik zemin", "zemin kaplama malzemeleri"],
  },
  {
    slug: "dogal-tas",
    name: "Doğal Taş",
    category: "zemin-kaplama",
    summary: "Mermer, granit, traverten gibi farklı jeolojik özelliklere sahip doğal kaplama grubu.",
    description:
      "Doğal taş tek bir performans sınıfı değildir. Taşın mineral yapısı, gözenekliliği, yüzey işlemi ve damar yönü dayanıklılık ve bakım gereksinimini belirler.",
    uses: ["İç ve dış zemin", "Merdiven", "Duvar kaplama", "Peyzaj"],
    advantages: ["Doğal ve benzersiz görünüm", "Uygun türde uzun ömür", "Yeniden parlatma ve onarım potansiyeli"],
    considerations: ["Leke ve su emme", "Ağırlık", "Taş türüne göre don ve aşınma farkı", "Damar kaynaklı kırılma"],
    selectionNotes: ["Taşı kullanım adına değil test verisine göre seç", "Yüzey işlemini kayma riskine göre belirle", "Numune ve damar yönünü onayla"],
    ratings: { thermal: 1, acoustic: 3, fire: 5, moisture: 3, lightness: 1, workability: 2, economy: 2 },
    keywords: ["doğal taş zemin", "mermer granit farkı", "taş kaplama"],
  },
  {
    slug: "epoksi",
    name: "Epoksi Zemin",
    category: "zemin-kaplama",
    summary: "Reçine esaslı, derzsiz ve farklı performans katmanlarıyla uygulanabilen zemin sistemi.",
    description:
      "Epoksi zemin, reçine ve sertleştirici bileşenlerden oluşan kaplama sistemidir. İnce boya tipi uygulamadan kalın, kendiliğinden yayılan veya agregalı sistemlere kadar farklı çözümleri vardır.",
    uses: ["Otopark", "Endüstriyel alan", "Laboratuvar", "Ticari ve teknik hacim"],
    advantages: ["Derzsiz yüzey", "Kolay temizlik", "Kimyasal ve aşınma seçenekleri", "Renk ve işaretleme"],
    considerations: ["Altlık nemi ve çatlakları", "UV sararması", "Kayganlık", "Uygulama koşullarına hassasiyet"],
    selectionNotes: ["Altlık nemini ölç", "Trafik ve kimyasal yükü tanımla", "Kaymaz agregayı kullanım yerine göre seç"],
    ratings: { thermal: 1, acoustic: 2, fire: 2, moisture: 5, lightness: 4, workability: 2, economy: 3 },
    keywords: ["epoksi zemin", "endüstriyel zemin", "epoksi kaplama"],
  },
  {
    slug: "lamine-parke",
    name: "Lamine Parke",
    category: "zemin-kaplama",
    summary: "Üstte gerçek ahşap tabakası bulunan, katmanlı yapısıyla boyutsal dengesi artırılmış parke.",
    description:
      "Lamine parke, gerçek ahşap üst tabakanın taşıyıcı alt katmanlarla birleştirilmesiyle üretilir. Masif parkeye göre nem hareketini azaltan katmanlı bir kurguya sahiptir.",
    uses: ["Konut", "Otel", "Ofis", "Kuru iç mekânlar"],
    advantages: ["Doğal ahşap yüzey", "Sıcak dokunuş", "Katmanlı boyutsal denge", "Bazı ürünlerde yenileme"],
    considerations: ["Su ve çizilme hassasiyeti", "Yerden ısıtma uyumu ürüne bağlıdır", "Akustik altlık gereksinimi"],
    selectionNotes: ["Üst ahşap tabaka kalınlığını kontrol et", "Nem ve yerden ısıtma koşulunu doğrula", "Yüzer veya yapıştırma sistemini projeye göre seç"],
    ratings: { thermal: 4, acoustic: 4, fire: 2, moisture: 2, lightness: 4, workability: 4, economy: 3 },
    keywords: ["lamine parke", "parke türleri", "ahşap zemin"],
  },
  {
    slug: "vinil-zemin",
    name: "Vinil Zemin",
    category: "zemin-kaplama",
    summary: "Rulo, karo veya plank biçiminde üretilen esnek ve bakımı kolay zemin kaplaması.",
    description:
      "Vinil zemin, PVC esaslı farklı katman ve aşınma yüzeyleriyle üretilen kaplama grubudur. Homojen, heterojen, LVT ve akustik ürünlerin performansları birbirinden farklıdır.",
    uses: ["Sağlık ve eğitim yapıları", "Ofis", "Mağaza", "Konut"],
    advantages: ["Kolay bakım", "Geniş desen seçeneği", "Esnek ve sessiz ürün alternatifleri", "Hızlı uygulama"],
    considerations: ["Altlık kusurlarını gösterebilir", "Emisyon belgeleri kontrol edilmelidir", "Keskin yük ve çizilme riski"],
    selectionNotes: ["Aşınma tabakası ve kullanım sınıfını seç", "Alt zemini çok düzgün hazırla", "Kayma ve iç hava kalitesi belgelerini kontrol et"],
    ratings: { thermal: 3, acoustic: 4, fire: 3, moisture: 5, lightness: 5, workability: 5, economy: 4 },
    keywords: ["vinil zemin", "LVT", "PVC zemin kaplama"],
  },
];

export const ratingLabels: Record<RatingKey, string> = {
  thermal: "Isı performansı",
  acoustic: "Ses performansı",
  fire: "Yangın davranışı",
  moisture: "Neme dayanım",
  lightness: "Hafiflik",
  workability: "Uygulama kolaylığı",
  economy: "Ekonomiklik",
};

export function getCategory(slug: string) {
  return materialCategories.find((category) => category.slug === slug);
}

export function getMaterialsByCategory(category: string) {
  return materials.filter((material) => material.category === category);
}

export function getMaterial(category: string, slug: string) {
  return materials.find(
    (material) => material.category === category && material.slug === slug
  );
}

export const materialSearchItems = [
  {
    title: "Yapı Malzemeleri Rehberi",
    href: "/yapi-malzemeleri",
    keywords: ["malzeme", "duvar", "yalıtım", "cam", "ahşap", "sıva", "beton", "zemin"],
  },
  {
    title: "Yapı Malzemesi Karşılaştırma",
    href: "/yapi-malzemeleri/karsilastir",
    keywords: ["karşılaştır", "bims gazbeton tuğla", "malzeme seçimi"],
  },
  ...materialCategories.map((category) => ({
    title: category.name,
    href: `/yapi-malzemeleri/${category.slug}`,
    keywords: [category.description],
  })),
  ...materials.map((material) => ({
    title: material.name,
    href: `/yapi-malzemeleri/${material.category}/${material.slug}`,
    keywords: material.keywords,
  })),
];
