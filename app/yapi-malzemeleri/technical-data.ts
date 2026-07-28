export type TechnicalValue = {
  label: string;
  value: string;
  note: string;
};

export type ThicknessChoice = {
  use: string;
  typical: string;
  decision: string;
};

export type MaterialTechnicalData = {
  values: TechnicalValue[];
  thicknesses: ThicknessChoice[];
  designChecks: string[];
};

const data: Record<string, MaterialTechnicalData> = {
  tugla: {
    values: [
      { label: "Birim hacim kütlesi", value: "yaklaşık 600–1.200 kg/m³", note: "Boşluk oranı ve ürün geometrisine göre değişir." },
      { label: "Isıl iletkenlik λ", value: "yaklaşık 0,20–0,60 W/mK", note: "Yoğunluk, nem ve boşluk düzeni etkilidir." },
      { label: "Basınç dayanımı", value: "ürün sınıfına bağlı", note: "Taşıyıcı ve dolgu ürünleri aynı kabul edilmez." },
      { label: "Yangın davranışı", value: "mineral ve yanmaz gövde", note: "Duvarın yangın direnci kalınlık, harç ve sıvayla birlikte belgelenir." },
    ],
    thicknesses: [
      { use: "İç bölme", typical: "8,5–13,5 cm blok", decision: "Ses, tesisat kanalı ve duvara asılacak yükleri birlikte değerlendir." },
      { use: "Dış dolgu", typical: "13,5–19 cm ve üzeri", decision: "Enerji hesabında ayrıca kesintisiz ısı yalıtım katmanı gerekebilir." },
      { use: "Akustik/yangın ayırıcı", typical: "proje hesabına göre", decision: "Tek ürün kalınlığı yerine sıva dâhil test edilmiş duvar sistemini seç." },
    ],
    designChecks: ["Harç ve düşey derz sürekliliği", "Kolon-kiriş birleşimindeki ısı köprüsü", "Ağır yükler için dübel ve ankraj", "Islak hacimde yüzey koruması"],
  },
  gazbeton: {
    values: [
      { label: "Kuru yoğunluk", value: "yaklaşık 350–700 kg/m³", note: "Dayanım ve ısı performansı sınıfla birlikte değişir." },
      { label: "Isıl iletkenlik λ", value: "yaklaşık 0,09–0,20 W/mK", note: "Tasarım değeri için üretici beyanı kullanılmalıdır." },
      { label: "Basınç dayanımı", value: "yaklaşık 2,5–5 N/mm²", note: "Ürün sınıfı ve kullanım amacı doğrulanır." },
      { label: "Su buharı davranışı", value: "buhar geçirimli mineral yapı", note: "Sıva ve boya katmanları toplam davranışı değiştirir." },
    ],
    thicknesses: [
      { use: "İç bölme", typical: "7,5–12,5 cm", decision: "Darbe, akustik ve tesisat gereksinimine göre artır." },
      { use: "Dış dolgu", typical: "15–25 cm", decision: "U değeri yalnız blok kalınlığıyla değil bütün cephe kesitiyle hesaplanır." },
      { use: "Yangın ayırıcı", typical: "sistem belgesine göre", decision: "İstenen dakika değeri için test/sınıflandırma raporunu kontrol et." },
    ],
    designChecks: ["İnce derz tutkal kalınlığı", "Nemden korunan parapet ve denizlik detayı", "Ağır elemanlar için gazbeton dübeli", "Kolon-kiriş birleşim filesi"],
  },
  bims: {
    values: [
      { label: "Kuru yoğunluk", value: "yaklaşık 500–1.000 kg/m³", note: "Pomza oranı ve boşluk geometrisine bağlıdır." },
      { label: "Isıl iletkenlik λ", value: "yaklaşık 0,12–0,35 W/mK", note: "Ürün beyanı ve tasarım nemi dikkate alınır." },
      { label: "Basınç dayanımı", value: "ürün sınıfına bağlı", note: "Dolgu blok ile taşıyıcı blok ayrılmalıdır." },
      { label: "Yangın davranışı", value: "mineral esaslı", note: "Duvar sisteminin yangın direnci ayrıca doğrulanır." },
    ],
    thicknesses: [
      { use: "İç bölme", typical: "10–15 cm", decision: "Akustik beklenti ve duvar yüksekliğine göre seçim yap." },
      { use: "Dış dolgu", typical: "15–25 cm", decision: "Cephe ısı yalıtımı ve yoğuşma hesabıyla birlikte değerlendir." },
      { use: "Tesisatlı duvar", typical: "15 cm ve üzeri", decision: "Kanal açılması sonrası kalan kesiti ve stabiliteyi kontrol et." },
    ],
    designChecks: ["Blok boyut toleransı", "Sıva aderansı", "Fire ve kırılma payı", "Uygun ankraj ve dübel"],
  },
  "tas-yunu": {
    values: [
      { label: "Isıl iletkenlik λ", value: "yaklaşık 0,034–0,041 W/mK", note: "Beyan edilen λD ürüne göre kontrol edilir." },
      { label: "Yoğunluk", value: "yaklaşık 30–180 kg/m³", note: "Cephe, çatı ve akustik ürünler farklı yoğunluktadır." },
      { label: "Yangın davranışı", value: "çoğunlukla A1/A2 sınıfı ürünler", note: "Kaplama ve bağlayıcı dâhil ürün sınıfını doğrula." },
      { label: "Su emme", value: "ürün tipine bağlı düşük değer", note: "Su yalıtımı yerine kullanılmaz." },
    ],
    thicknesses: [
      { use: "Dış cephe", typical: "5–15 cm", decision: "Yerel enerji hesabı, dübel boyu ve sistem onayına göre belirle." },
      { use: "Çatı", typical: "10–25 cm", decision: "U değeri, mertek yüksekliği ve yoğuşma riskini birlikte çöz." },
      { use: "Akustik bölme", typical: "4–10 cm", decision: "Boşluğu sıkıştırmadan doldur; levha katmanlarıyla sistem olarak seç." },
    ],
    designChecks: ["Ürünün cephe/çatı kullanım sınıfı", "Kesintisiz yerleşim", "Rüzgâr ve mekanik sabitleme", "Buhar kontrol katmanının konumu"],
  },
  "cam-yunu": {
    values: [
      { label: "Isıl iletkenlik λ", value: "yaklaşık 0,032–0,044 W/mK", note: "Rulo ve levha ürünleri farklı olabilir." },
      { label: "Yoğunluk", value: "yaklaşık 10–100 kg/m³", note: "Yoğunluk tek başına performans göstergesi değildir." },
      { label: "Yangın davranışı", value: "çoğunlukla A1/A2 ürünler", note: "Kaplama yüzeyi ürün sınıfını etkileyebilir." },
      { label: "Akustik davranış", value: "lifli ve gözenekli", note: "Ses yalıtımı tüm bölme sistemi üzerinden ölçülür." },
    ],
    thicknesses: [
      { use: "Çatı arası", typical: "10–25 cm", decision: "İki kat şaşırtmalı uygulama ısı köprülerini azaltabilir." },
      { use: "Kuru duvar", typical: "5–10 cm", decision: "Profil boşluğunu sıkıştırmadan doldur." },
      { use: "Asma tavan", typical: "5–15 cm", decision: "Akustik hedef, askı detayı ve yangın gereksinimini birlikte kontrol et." },
    ],
    designChecks: ["Sıkışma ve boşluk bırakmama", "Buhar kesici sürekliliği", "Nemden korunma", "Uygulayıcı koruyucu ekipmanı"],
  },
  eps: {
    values: [
      { label: "Isıl iletkenlik λ", value: "yaklaşık 0,031–0,040 W/mK", note: "Grafit katkılı ve beyaz ürünler farklıdır." },
      { label: "Yoğunluk", value: "yaklaşık 15–30 kg/m³", note: "Seçimi yalnız yoğunluğa göre yapma; CS ve λ değerine bak." },
      { label: "Basınç dayanımı", value: "yaklaşık 50–200 kPa", note: "Döşeme ve cephe ürünleri aynı değildir." },
      { label: "Su buharı direnci", value: "ürün tipine bağlı", note: "Yoğuşma hesabında beyan edilen μ değeri kullanılır." },
    ],
    thicknesses: [
      { use: "Mantolama", typical: "5–15 cm", decision: "U hesabı, dübel ve yangın bariyeri kararına göre seç." },
      { use: "Döşeme altı", typical: "3–10 cm", decision: "Kalınlık kadar basınç ve sünme sınıfı önemlidir." },
      { use: "Dolgu/geofoam", typical: "proje geometrisine göre", decision: "Uzun süreli yük, yangın ve çözücü temasını mühendislik hesabıyla kontrol et." },
    ],
    designChecks: ["ETICS sistem uyumu", "Yangın bariyerleri", "UV ve çözücüden korunma", "Döşemede uzun süreli basınç"],
  },
  xps: {
    values: [
      { label: "Isıl iletkenlik λ", value: "yaklaşık 0,029–0,038 W/mK", note: "Kalınlık ve üretim tipine göre değişir." },
      { label: "Basınç dayanımı", value: "yaklaşık 200–700 kPa", note: "Kısa süreli CS değeri ile uzun süreli tasarım yükünü karıştırma." },
      { label: "Su emme", value: "kapalı hücre nedeniyle düşük", note: "Derz ve hasarlı yüzeyler sistem davranışını etkiler." },
      { label: "Yangın davranışı", value: "yanıcı polimer ürün", note: "Koruyucu katman ve yangın detayı zorunludur." },
    ],
    thicknesses: [
      { use: "Temel/perde", typical: "4–10 cm", decision: "Toprak altı U hesabı ve dolgu basıncına göre seç." },
      { use: "Ters teras çatı", typical: "5–15 cm", decision: "Islak çalışma koşulu ve basınç dayanımı için uygun ürün kullan." },
      { use: "Otopark/döşeme", typical: "4–12 cm", decision: "Teker yükü, şap kalınlığı ve uzun süreli sünme kontrol edilir." },
    ],
    designChecks: ["Su yalıtımıyla katman sırası", "Şaşırtmalı derz", "UV’den korunma", "Yük sınıfına uygun basınç dayanımı"],
  },
};

const categoryFallback: Record<string, MaterialTechnicalData> = {
  cam: {
    values: [
      { label: "Nominal kalınlık", value: "ürün ve yük hesabına göre", note: "Cam boyutu, mesnet ve rüzgâr yükü birlikte değerlendirilir." },
      { label: "Işık geçirgenliği", value: "cam bileşimine göre değişir", note: "Kaplama, renk ve lamine ara katman etkiler." },
      { label: "U değeri", value: "tek cam değil ünite değeri", note: "Ara boşluk, gaz, kaplama ve doğrama birlikte ele alınır." },
      { label: "Güvenlik", value: "temperli/lamine kombinasyon", note: "Kullanım ve düşme riskine göre belirlenir." },
    ],
    thicknesses: [
      { use: "İç bölme/kapı", typical: "yaklaşık 8–12 mm", decision: "Panel boyutu ve güvenlik kullanımına göre statik kontrol gerekir." },
      { use: "Pencere ünitesi", typical: "ör. 4–16–4 ve proje türevleri", decision: "Bu yalnız başlangıç örneğidir; ısı, ses ve rüzgâr hesabıyla seç." },
      { use: "Korkuluk/çatı", typical: "lamine güvenlik bileşimi", decision: "Kırılma sonrası taşıma ve mesnet hesabı uzman tarafından yapılır." },
    ],
    designChecks: ["Isı ve güneş kontrolü", "Kenar mesafeleri ve mesnet", "Kırılma sonrası güvenlik", "Doğrama ve fitil uyumu"],
  },
  ahsap: {
    values: [
      { label: "Yoğunluk", value: "yaklaşık 400–750 kg/m³", note: "Tür, nem ve levha yapısına göre geniş aralık gösterir." },
      { label: "Nem içeriği", value: "kullanım sınıfına uygun", note: "Boyutsal hareket ve biyolojik dayanım için kritiktir." },
      { label: "Isıl iletkenlik λ", value: "yaklaşık 0,10–0,20 W/mK", note: "Lif yönü, yoğunluk ve nem etkiler." },
      { label: "Yangın tasarımı", value: "kesit/kömürleşme hesabı", note: "Yüzey sınıfı ile taşıyıcı yangın direnci farklıdır." },
    ],
    thicknesses: [
      { use: "Kaplama/mobilya", typical: "6–25 mm levha", decision: "Mesnet aralığı, vida tutma ve nem sınıfına göre seç." },
      { use: "Altlık/rijitlik levhası", typical: "11–22 mm", decision: "Aks aralığı ve taşıma yönü üretici tablosuyla doğrulanır." },
      { use: "Taşıyıcı ahşap/CLT", typical: "statik hesaba göre", decision: "Katman sayısı, açıklık, titreşim ve yangın hesabı gerekir." },
    ],
    designChecks: ["Nem ve kullanım sınıfı", "Lif/taşıma yönü", "Bağlantı ve kenar mesafesi", "Yangın ve biyolojik koruma"],
  },
  siva: {
    values: [
      { label: "Uygulama kalınlığı", value: "ürün sistemine bağlı", note: "Tek katta izin verilen kalınlık teknik föyden alınır." },
      { label: "Buhar geçirgenliği", value: "bağlayıcıya göre değişir", note: "Mevcut duvar ve son kat boyayla birlikte değerlendirilir." },
      { label: "Basınç/aderans", value: "ürün sınıfına bağlı", note: "Yüzey dayanımından daha sert sıva hasar oluşturabilir." },
      { label: "Kullanım ortamı", value: "iç/dış/ıslak hacim ayrımı", note: "Alçı, kireç ve çimento esaslı ürünler eşdeğer değildir." },
    ],
    thicknesses: [
      { use: "İç yüzey tesviyesi", typical: "yaklaşık 5–15 mm", decision: "Alt yüzey düzgünlüğü ve ürünün tek kat sınırını kontrol et." },
      { use: "Dış cephe sıvası", typical: "yaklaşık 10–20 mm sistem", decision: "Katlar, file ve kür şartları sistem tarifine göre belirlenir." },
      { use: "Onarım/kalın dolgu", typical: "katmanlı uygulama", decision: "Tek seferde aşırı kalınlık yerine uygun tamir harcı ve katman kullan." },
    ],
    designChecks: ["Yüzey emiciliği ve astar", "File gereken birleşimler", "Kür ve kuruma süresi", "Son katla buhar uyumu"],
  },
  beton: {
    values: [
      { label: "Yoğunluk", value: "yaklaşık 1.400–2.500 kg/m³", note: "Hafif ve normal beton sınıfları farklıdır." },
      { label: "Basınç dayanımı", value: "proje sınıfına göre", note: "Karakteristik sınıf statik projede tanımlanır." },
      { label: "Isıl iletkenlik λ", value: "yaklaşık 0,4–2,5 W/mK", note: "Yoğunluk ve nem değer üzerinde güçlü etkilidir." },
      { label: "Dayanıklılık", value: "çevresel etki sınıfına bağlı", note: "Su/çimento oranı, pas payı ve kür birlikte önemlidir." },
    ],
    thicknesses: [
      { use: "Taşıyıcı eleman", typical: "statik projeye göre", decision: "Kesit kalınlığı mimari varsayımla değil mühendislik hesabıyla belirlenir." },
      { use: "Şap/dolgu", typical: "ürün ve yük durumuna göre", decision: "Taşıyıcı betonla tesviye veya hafif dolgu betonunu ayır." },
      { use: "Prekast/GFRC eleman", typical: "sistem hesabına göre", decision: "Bağlantı, rötre, taşıma ve montaj yüklerini birlikte çöz." },
    ],
    designChecks: ["Dayanım ve çevresel etki sınıfı", "Donatı ve pas payı", "Kür ve derz planı", "Rötre, sünme ve çatlak kontrolü"],
  },
  "zemin-kaplama": {
    values: [
      { label: "Toplam sistem kalınlığı", value: "kaplama + yapıştırıcı/altlık", note: "Kot koordinasyonunda yalnız görünen ürünü kullanma." },
      { label: "Aşınma/servis sınıfı", value: "kullanım yoğunluğuna göre", note: "Konut, ticari alan ve endüstriyel alan gereksinimleri ayrıdır." },
      { label: "Kayma direnci", value: "mekân ve ıslaklık durumuna göre", note: "Güncel ürün test beyanı kontrol edilir." },
      { label: "Nem toleransı", value: "ürün ve alt zemine bağlı", note: "Alt zemin nemi yapıştırıcı ve kaplamayı bozabilir." },
    ],
    thicknesses: [
      { use: "İnce kaplama", typical: "2–6 mm", decision: "Alt zemin düzgünlüğü ve kapı/eşik kotlarını kontrol et." },
      { use: "Karo/taş", typical: "8–20 mm + yapıştırıcı", decision: "Boyut, yük, dış ortam ve taş cinsine göre kalınlık değişir." },
      { use: "Endüstriyel reçine", typical: "1–6 mm sistem", decision: "Trafik, kimyasal etki ve çatlak köprüleme ihtiyacına göre sistem seç." },
    ],
    designChecks: ["Alt zemin nemi ve düzgünlüğü", "Hareket derzlerinin devamı", "Kayma ve aşınma sınıfı", "Eşik ve bitiş kotları"],
  },
};

export function getMaterialTechnicalData(slug: string, category: string) {
  return data[slug] ?? categoryFallback[category];
}
