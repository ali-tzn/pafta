export type ArchitectureArticle = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: string;
  period: string;
  readingTime: string;
  intro: string;
  summary: string[];
  sections: { title: string; paragraphs: string[] }[];
  architects: string[];
  examples: { name: string; detail: string }[];
  faq: { question: string; answer: string }[];
  sources: { label: string; href: string }[];
  keywords: string[];
};

export const architectureArticles: ArchitectureArticle[] = [
  {
    slug: "modernizm-nedir",
    title: "Modernizm Nedir? Modern Mimarlığın Özellikleri ve Örnekleri",
    shortTitle: "Modernizm Nedir?",
    description:
      "Modern mimarlığın ortaya çıkışı, temel ilkeleri, önemli mimarları, malzemeleri ve ikonik yapı örnekleri hakkında kapsamlı öğrenci rehberi.",
    category: "Mimarlık Akımları",
    period: "19. yüzyıl sonu – 20. yüzyıl",
    readingTime: "9 dakika",
    intro:
      "Modernizm, sanayileşmenin sunduğu yeni malzeme ve üretim tekniklerini çağın toplumsal ihtiyaçlarıyla birleştiren geniş bir düşünce ve tasarım hareketidir. Mimarlıkta tarihsel üslupların doğrudan taklit edilmesine karşı çıkar; yapının işlevini, yapım sistemini ve mekânsal düzenini görünür kılmaya yönelir.",
    summary: [
      "İşlev, plan ve taşıyıcı sistem tasarımın temel belirleyicileridir.",
      "Çelik, betonarme ve geniş cam yüzeyler yeni mekân olanakları yaratır.",
      "Sade geometriler ve gereksiz bezemeden kaçınma yaygındır.",
      "Serbest plan, açık mekân ve standartlaşma önemli kavramlardır.",
      "Tek bir biçim dili değil, farklı yaklaşımları kapsayan geniş bir harekettir.",
    ],
    sections: [
      {
        title: "Modernizm hangi koşullarda ortaya çıktı?",
        paragraphs: [
          "Sanayi Devrimi, yapı üretimini ve kent yaşamını kökten değiştirdi. Demiryolları, fabrikalar, büyük sergi salonları ve hızlı büyüyen kentler; geleneksel yapım yöntemlerinin cevap vermekte zorlandığı yeni programlar doğurdu. Demir, çelik, betonarme ve seri üretim elemanlar daha geniş açıklıkların ve daha hızlı inşaatın önünü açtı.",
          "Modern mimarlar bu teknolojik değişimin yalnızca eski cephelerin arkasında saklanmaması gerektiğini savundu. Yapının kendi dönemini ifade etmesi, planın güncel yaşam biçimlerine cevap vermesi ve mimarlığın konut sorunları gibi toplumsal meselelere çözüm üretmesi amaçlandı.",
        ],
      },
      {
        title: "Modern mimarlığın temel özellikleri",
        paragraphs: [
          "Modern yapılarda biçim çoğunlukla plan, dolaşım, strüktür, ışık ve program arasındaki ilişkiden geliştirilir. Süsleme tamamen yok olmak zorunda değildir; fakat eklenmiş tarihsel bezeme yerine malzeme birleşimleri, oran, yüzey, detay ve taşıyıcı düzen estetik değerin parçası olur.",
          "Serbest plan, şerit pencere, düz çatı, pilotiler ve serbest cephe gibi ilkeler özellikle Le Corbusier’nin çalışmalarında sistemleşmiştir. Mies van der Rohe ise minimum elemanla sürekli mekân, hassas detay ve çelik-cam birlikteliğini öne çıkarmıştır. Bu yaklaşımlar modernizmin bütününü açıklamasa da dönemin güçlü yönelimlerini gösterir.",
        ],
      },
      {
        title: "Malzeme, strüktür ve cephe ilişkisi",
        paragraphs: [
          "Betonarme iskelet, duvarın taşıyıcı olma zorunluluğunu azaltarak daha serbest cephe ve plan düzenlerine izin verdi. Çelik strüktür geniş açıklıkları mümkün kılarken cam, doğal ışık ve iç-dış görsel ilişkisini güçlendirdi. Bu malzemeler yalnız teknik araçlar değil, modern yaşam fikrinin simgeleri olarak da kullanıldı.",
          "Bununla birlikte modern mimarlık yalnızca beyaz sıvalı beton ve camdan ibaret değildir. Alvar Aalto gibi mimarlar ahşap, tuğla, dokunsal yüzeyler ve peyzaj ilişkisi üzerinden daha insancıl yorumlar geliştirdi.",
        ],
      },
      {
        title: "Modernizme yöneltilen eleştiriler",
        paragraphs: [
          "Modernizmin evrensel çözümler üretme iddiası, yerel iklimi, kültürü ve kullanıcı farklılıklarını geri plana atabildiği gerekçesiyle eleştirilmiştir. Büyük ölçekli konut ve kent projelerinde insan ölçeğinin kaybolması, tekdüzelik ve kamusal yaşamın zayıflaması da tartışılmıştır.",
          "Bu eleştiriler modernizmin tamamen sona erdiği anlamına gelmez. Çağdaş mimarlığın açık plan, strüktürel açıklık, seri üretim ve işlevsel organizasyon gibi pek çok aracı modern hareketten miras alınmıştır.",
        ],
      },
      {
        title: "Modernizm ile çağdaş mimarlık aynı şey mi?",
        paragraphs: [
          "Modern mimarlık belirli tarihsel ve düşünsel koşullarda gelişmiş bir hareketi ifade eder. Çağdaş mimarlık ise içinde bulunduğumuz dönemde üretilen mimarlığın genel adıdır. Güncel bir yapı modernist ilkeler taşıyabilir; ancak çağdaş olan her yapı modernist değildir.",
        ],
      },
    ],
    architects: [
      "Le Corbusier",
      "Ludwig Mies van der Rohe",
      "Walter Gropius",
      "Alvar Aalto",
      "Frank Lloyd Wright",
    ],
    examples: [
      { name: "Villa Savoye", detail: "Le Corbusier, Poissy, 1928–1931" },
      { name: "Bauhaus Dessau", detail: "Walter Gropius, Dessau, 1925–1926" },
      { name: "Barcelona Pavyonu", detail: "Mies van der Rohe, 1929" },
      { name: "Paimio Sanatoryumu", detail: "Alvar Aalto, 1929–1933" },
    ],
    faq: [
      {
        question: "Modern mimarlık ne zaman başladı?",
        answer:
          "Kökleri 19. yüzyılın sanayileşme sürecine uzanır; 20. yüzyılın ilk yarısında belirgin bir uluslararası harekete dönüşür.",
      },
      {
        question: "Modernizm neden süslemeye karşıdır?",
        answer:
          "Asıl itiraz, tarihsel bezemenin işlev ve yapım mantığından bağımsız biçimde kopyalanmasınadır. Estetik; oran, malzeme, strüktür ve detay üzerinden aranır.",
      },
      {
        question: "Modern ve çağdaş mimarlık arasındaki fark nedir?",
        answer:
          "Modern mimarlık tarihsel bir hareket, çağdaş mimarlık ise günümüzde üretilen mimarlığın genel tanımıdır.",
      },
    ],
    sources: [
      {
        label: "MoMA – Modern mimarlığın endüstriyel kaynakları",
        href: "https://www.moma.org/magazine/articles/930",
      },
      {
        label: "MoMA – Ludwig Mies van der Rohe",
        href: "https://www.moma.org/collection/artists/7166",
      },
    ],
    keywords: [
      "modernizm nedir",
      "modern mimarlık",
      "modern mimarlık özellikleri",
      "modernist mimarlar",
      "modern yapı örnekleri",
    ],
  },
  {
    slug: "bauhaus-nedir",
    title: "Bauhaus Nedir? Okulun İlkeleri, Tarihi ve Mimarlığa Etkisi",
    shortTitle: "Bauhaus Nedir?",
    description:
      "Bauhaus okulunun kuruluşu, eğitim anlayışı, tasarım ilkeleri, dönemleri, önemli isimleri ve modern mimarlığa etkisi.",
    category: "Mimarlık Akımları",
    period: "1919–1933",
    readingTime: "8 dakika",
    intro:
      "Bauhaus, Walter Gropius tarafından 1919’da Almanya’da kurulan; sanat, zanaat, tasarım, teknoloji ve mimarlığı ortak bir üretim ortamında buluşturan etkili bir okuldur. Sıklıkla yalnızca sade bir biçim tarzı gibi anlatılsa da Bauhaus öncelikle deneysel bir eğitim modeli ve modern yaşamı yeniden düşünme girişimidir.",
    summary: [
      "1919’da Weimar’da kuruldu; Dessau ve Berlin dönemlerinden geçti.",
      "Sanat ile zanaat arasındaki ayrımı azaltmayı hedefledi.",
      "Atölye temelli, yaparak öğrenmeye dayalı bir eğitim geliştirdi.",
      "Tipografi, mobilya, tekstil, fotoğraf, sahne ve mimarlığı birlikte ele aldı.",
      "1933’te kapatıldı; öğretmen ve öğrencilerinin göçü fikirlerin dünyaya yayılmasını hızlandırdı.",
    ],
    sections: [
      {
        title: "Bauhaus’un kuruluş amacı",
        paragraphs: [
          "Gropius’un kurucu yaklaşımı güzel sanatlarla uygulamalı sanatları ortak üretimde buluşturmayı amaçlıyordu. Öğrenciler yalnızca biçim kuramı öğrenmiyor; malzemeyi, üretim yöntemini ve atölye disiplinini doğrudan deneyimliyordu.",
          "Amaç tekil ve pahalı sanat nesneleri üretmekten çok, modern toplumun gündelik eşyalarını, iç mekânlarını ve yapılarını nitelikli biçimde tasarlamaktı. Zaman içinde endüstriyle iş birliği ve seri üretime uygun prototipler daha önemli hâle geldi.",
        ],
      },
      {
        title: "Weimar, Dessau ve Berlin dönemleri",
        paragraphs: [
          "Weimar dönemi deneysel temel eğitim, sanat-zanaat birlikteliği ve dışavurumcu etkilerle öne çıkar. Okul 1925’te siyasi baskılar nedeniyle Dessau’ya taşındı. Gropius’un Dessau için tasarladığı okul yapısı, atölye kanadı ve cam cephesiyle Bauhaus yaklaşımının mimari simgesine dönüştü.",
          "Hannes Meyer döneminde toplumsal gereksinimler, ekonomi ve bilimsel analiz daha güçlü biçimde öne çıktı. Mies van der Rohe yönetiminde okulun mimarlık yönelimi belirginleşti. Berlin’de kısa süre özel kurum olarak devam eden okul, Nazi baskısıyla 1933’te kapandı.",
        ],
      },
      {
        title: "Bauhaus eğitim modeli",
        paragraphs: [
          "Öğrenciler renk, biçim, kompozisyon ve malzeme deneylerine dayanan hazırlık eğitiminin ardından metal, ahşap, tekstil, duvar resmi, tipografi veya sahne gibi atölyelere geçiyordu. Bu yapı, düşünceyle üretimi birbirinden ayırmamayı hedefliyordu.",
          "Paul Klee, Wassily Kandinsky, Josef Albers, László Moholy-Nagy ve Oskar Schlemmer gibi farklı disiplinlerden eğitmenler okulun tek bir estetik reçeteye indirgenmesini engelledi.",
        ],
      },
      {
        title: "Bauhaus’un mimarlığa etkisi",
        paragraphs: [
          "Bauhaus; işlevsel planlama, açık ve okunabilir strüktür, standart elemanlar, seri üretim ve farklı tasarım ölçeklerinin bütünleşmesi üzerinden modern mimarlığı etkiledi. Ancak her sade, beyaz ve geometrik yapıyı Bauhaus olarak adlandırmak doğru değildir.",
          "Okulun asıl mirası belirli bir cephe görünümünden çok; araştırma, prototipleme, disiplinler arası çalışma ve tasarımın toplumsal yaşamla ilişkilendirilmesidir.",
        ],
      },
    ],
    architects: [
      "Walter Gropius",
      "Hannes Meyer",
      "Ludwig Mies van der Rohe",
      "Marcel Breuer",
      "László Moholy-Nagy",
    ],
    examples: [
      { name: "Bauhaus Dessau", detail: "Walter Gropius, 1925–1926" },
      { name: "Usta Evleri", detail: "Walter Gropius, Dessau, 1925–1926" },
      { name: "ADGB Sendika Okulu", detail: "Hannes Meyer ve Hans Wittwer, 1928–1930" },
      { name: "Barcelona Sandalyesi", detail: "Mies van der Rohe ve Lilly Reich, 1929" },
    ],
    faq: [
      {
        question: "Bauhaus bir mimarlık akımı mı, okul mu?",
        answer:
          "Öncelikle 1919–1933 arasında faaliyet gösteren bir tasarım okuludur. Etkileri zamanla mimari ve görsel bir yaklaşımla ilişkilendirilmiştir.",
      },
      {
        question: "Bauhaus neden kapatıldı?",
        answer:
          "Artan siyasi baskı ve Nazi yönetiminin okulu hedef alması sonucunda 1933’te faaliyetini sonlandırdı.",
      },
      {
        question: "Bauhaus’un en önemli özelliği nedir?",
        answer:
          "Sanat, zanaat, teknoloji ve gündelik yaşamı atölye temelli, disiplinler arası bir eğitimde birleştirmesidir.",
      },
    ],
    sources: [
      {
        label: "Bauhaus-Archiv – Bauhaus koleksiyonu ve tarihi",
        href: "https://www.bauhaus.de/en/",
      },
      {
        label: "MoMA – Bauhaus 1919–1933",
        href: "https://www.moma.org/calendar/exhibitions/303",
      },
      {
        label: "Getty Research Institute – Bauhaus tarihi",
        href: "https://www.getty.edu/research/exhibitions_events/exhibitions/bauhaus/new_artist/history/",
      },
    ],
    keywords: [
      "bauhaus nedir",
      "bauhaus mimarlık",
      "bauhaus özellikleri",
      "bauhaus tarihi",
      "bauhaus mimarları",
    ],
  },
  {
    slug: "brutalizm-nedir",
    title: "Brutalizm Nedir? Brüt Beton, Özellikler ve Yapı Örnekleri",
    shortTitle: "Brutalizm Nedir?",
    description:
      "Brutalist mimarlığın kökeni, brüt beton kullanımı, temel tasarım özellikleri, önemli mimarları ve yapı örnekleri.",
    category: "Mimarlık Akımları",
    period: "1950’ler–1970’ler",
    readingTime: "8 dakika",
    intro:
      "Brutalizm, özellikle savaş sonrası dönemde gelişen; yapının malzemesini, strüktürünü, dolaşımını ve işlevsel parçalarını güçlü biçimde görünür kılan mimari yaklaşımdır. Adı çoğu zaman İngilizcedeki “brutal” sözcüğüyle ilişkilendirilse de önemli köklerinden biri Fransızca “béton brut”, yani ham betondur.",
    summary: [
      "Brüt beton yaygındır fakat brutalizm yalnızca beton kullanmak değildir.",
      "Strüktür, tesisat veya dolaşım elemanları okunabilir bırakılabilir.",
      "Büyük kütleler, derin gölgeler ve güçlü geometriler sık görülür.",
      "Toplu konut, üniversite, kültür ve kamu yapılarında yaygınlaşmıştır.",
      "Dürüst malzeme kullanımı ile anıtsal ifade arasında ilişki kurar.",
    ],
    sections: [
      {
        title: "Brutalizm nasıl ortaya çıktı?",
        paragraphs: [
          "İkinci Dünya Savaşı sonrasında Avrupa’da hızlı, ekonomik ve kamusal ölçekte yapı üretme ihtiyacı arttı. Modernizmin işlevsel ve toplumsal hedefleri sürdürülürken daha ağır, dokulu ve doğrudan bir mimari dil gelişti.",
          "Le Corbusier’nin Unité d’Habitation gibi geç dönem yapıları ham betonun plastik ve anıtsal olanaklarını gösterdi. Alison ve Peter Smithson’ın işleri ile Yeni Brutalizm tartışmaları, yaklaşımın İngiltere’de kuramsallaşmasında etkili oldu.",
        ],
      },
      {
        title: "Brutalist yapıların özellikleri",
        paragraphs: [
          "Kalıp izlerini taşıyan beton yüzeyler, tekrarlanan modüller, büyük konsollar, köprüler, dışarıdan okunan merdiven ve servis kuleleri yaygındır. Kütle çoğu zaman küçük parçalara ayrılmak yerine bütün ağırlığıyla algılanır.",
          "Bu görünüm yalnız estetik bir tercih değildir. Yapının nasıl ayakta durduğu, insanların nasıl dolaştığı ve farklı işlevlerin nerede bulunduğu cephe ve kütlede okunabilir hâle getirilir.",
        ],
      },
      {
        title: "Brüt beton ile brutalizm arasındaki fark",
        paragraphs: [
          "Brüt beton, yüzeyi sonradan kaplanmadan veya sıvanmadan bırakılan beton uygulamasıdır. Brutalizm ise malzeme, strüktür, program ve kütle ilişkisini kapsayan daha geniş bir mimari yaklaşımdır. Her brüt beton yapı brutalist olmadığı gibi brutalist bir yapıda tuğla, taş veya metal de kullanılabilir.",
        ],
      },
      {
        title: "Brutalizm neden tartışmalıdır?",
        paragraphs: [
          "Brutalist yapılar güçlü mekânsal karakterleri ve malzeme dürüstlükleri nedeniyle değer görür. Buna karşılık büyük ölçek, sert yüzey, bakım sorunları ve çevreyle kurulan zayıf ilişki kullanıcılar tarafından soğuk veya baskıcı bulunabilir.",
          "Beton yüzeylerin su, kir ve hatalı onarımlarla yıpranması da yapının ilk tasarım niteliğini gölgeleyebilir. Günümüzde birçok brutalist yapı yıkım tehdidi, koruma ve yeniden kullanım tartışmalarının merkezindedir.",
        ],
      },
    ],
    architects: [
      "Le Corbusier",
      "Alison ve Peter Smithson",
      "Paul Rudolph",
      "Marcel Breuer",
      "Kenzo Tange",
    ],
    examples: [
      { name: "Unité d’Habitation", detail: "Le Corbusier, Marsilya, 1947–1952" },
      { name: "Barbican Estate", detail: "Chamberlin, Powell and Bon, Londra" },
      { name: "Boston City Hall", detail: "Kallmann, McKinnell & Knowles, 1968" },
      { name: "Yale Art and Architecture Building", detail: "Paul Rudolph, 1963" },
    ],
    faq: [
      {
        question: "Brutalizm neden bu isimle anılır?",
        answer:
          "İsim, önemli ölçüde Le Corbusier’nin ham beton için kullandığı Fransızca “béton brut” ifadesiyle ilişkilidir.",
      },
      {
        question: "Her beton bina brutalist midir?",
        answer:
          "Hayır. Brutalizm yalnız malzemeyi değil; strüktür, program, dolaşım ve kütlenin açık biçimde ifade edilmesini kapsar.",
      },
      {
        question: "Brutalizm modernizmin parçası mı?",
        answer:
          "Genellikle savaş sonrası modern mimarlığın içindeki güçlü yönelimlerden biri olarak değerlendirilir.",
      },
    ],
    sources: [
      {
        label: "RIBA – Brutalism",
        href: "https://www.architecture.com/explore-architecture/brutalism",
      },
      {
        label: "V&A – Brutalist architecture",
        href: "https://www.vam.ac.uk/articles/brutalist-architecture",
      },
    ],
    keywords: [
      "brutalizm nedir",
      "brüt beton mimari",
      "brutalist mimarlık",
      "brutalizm özellikleri",
      "brutalist yapılar",
    ],
  },
  {
    slug: "postmodernizm-nedir",
    title: "Postmodernizm Nedir? Postmodern Mimarlık ve Özellikleri",
    shortTitle: "Postmodernizm Nedir?",
    description:
      "Postmodern mimarlığın modernizme eleştirisi, tarihsel göndermeleri, temel özellikleri, önemli mimarları ve örnek yapıları.",
    category: "Mimarlık Akımları",
    period: "1960’lar sonrası",
    readingTime: "8 dakika",
    intro:
      "Postmodern mimarlık, modernizmin evrensellik, sadelik ve tarihsel süreklilikten kopuş iddialarına karşı gelişen farklı yaklaşımları kapsar. Tarihsel biçimleri yeniden yorumlar; ironi, sembol, renk, bağlam ve kullanıcıların okuyabildiği mimari işaretlerle ilgilenir.",
    summary: [
      "Modernizmin tek ve evrensel dil iddiasını sorgular.",
      "Tarihsel öğeleri kopyalamak yerine dönüştürerek kullanabilir.",
      "İroni, çelişki, sembol ve çok anlamlılık önemlidir.",
      "Cephe, kentin iletişim kuran bir parçası olarak ele alınır.",
      "Tek bir üsluptan çok farklı tavırları barındırır.",
    ],
    sections: [
      {
        title: "Postmodern mimarlık neden ortaya çıktı?",
        paragraphs: [
          "20. yüzyıl ortasında modernist kent planlaması ve seri konut üretimi, tekdüzelik ve insan ölçeğinden uzaklaşma gerekçeleriyle eleştirilmeye başladı. Bazı mimarlar, yalnızca işlev ve teknolojinin mimarlığın kültürel anlamını açıklamak için yetersiz kaldığını düşündü.",
          "Robert Venturi, karmaşıklık ve çelişkinin mimarlığın doğal parçası olduğunu savundu. Denise Scott Brown ve Steven Izenour ile yürüttüğü çalışmalar, gündelik kent peyzajındaki tabelaları, ticari imgeleri ve kullanıcıların çevreyi nasıl okuduğunu mimarlık tartışmasına taşıdı.",
        ],
      },
      {
        title: "Postmodern mimarlığın biçim dili",
        paragraphs: [
          "Klasik alınlık, sütun, kemer veya simetri gibi öğeler yeni malzeme, ölçek ve bağlamlarda yeniden ortaya çıkabilir. Bu öğelerin yapısal zorunluluktan çok iletişim ve anlam üretme amacıyla kullanılması mümkündür.",
          "Renkli yüzeyler, beklenmedik oranlar, parçalı cepheler ve mizahi göndermeler yaygındır. Ancak bütün postmodern yapılar renkli ya da bezemeli değildir; ortak nokta modernist saflık ve tek anlamlılığa mesafedir.",
        ],
      },
      {
        title: "Modernizm ile postmodernizm arasındaki fark",
        paragraphs: [
          "Modernizm çoğunlukla biçimin işlev, strüktür ve çağdaş üretim yöntemlerinden doğmasını vurgular. Postmodernizm ise mimarlığın aynı zamanda kültürel hafıza, sembol, iletişim ve bağlam taşıdığını öne çıkarır.",
          "Bu karşıtlık kesin sınırlar oluşturmaz. Birçok yapı modern teknikleri tarihsel göndermelerle bir araya getirir; iki yaklaşım arasındaki geçişler mimarın, yerin ve programın koşullarına göre değişir.",
        ],
      },
      {
        title: "Postmodernizme yöneltilen eleştiriler",
        paragraphs: [
          "Eleştirmenler postmodern tarihsel göndermelerin yüzeysel dekorasyona veya kolay tüketilen imgelere dönüşebildiğini savunur. Buna karşın postmodernizm, mimarlıkta çoğulculuk ve yerel bağlam tartışmalarını güçlendirmiştir.",
        ],
      },
    ],
    architects: [
      "Robert Venturi",
      "Denise Scott Brown",
      "Michael Graves",
      "Charles Moore",
      "Aldo Rossi",
    ],
    examples: [
      { name: "Vanna Venturi House", detail: "Robert Venturi, 1962–1964" },
      { name: "Piazza d’Italia", detail: "Charles Moore, New Orleans, 1978" },
      { name: "Portland Building", detail: "Michael Graves, 1982" },
      { name: "Neue Staatsgalerie", detail: "James Stirling, Stuttgart, 1984" },
    ],
    faq: [
      {
        question: "Postmodernizm modernizmin tam karşıtı mı?",
        answer:
          "Tam bir karşıtlıktan çok modernizmin sınırlı görülen yönlerine verilen farklı cevapları kapsar; modern yapım tekniklerini kullanmaya devam edebilir.",
      },
      {
        question: "Postmodern mimarlık neden tarihsel öğeler kullanır?",
        answer:
          "Kültürel hafıza, bağlam ve kullanıcıyla iletişim kurmak; bazen de ironi ve eleştiri üretmek için kullanır.",
      },
      {
        question: "Postmodern mimarlık ne zaman başladı?",
        answer:
          "Eleştirileri 1960’larda belirginleşmiş, 1970 ve 1980’lerde uluslararası ölçekte etkili olmuştur.",
      },
    ],
    sources: [
      {
        label: "V&A – Postmodernism",
        href: "https://www.vam.ac.uk/articles/what-is-postmodernism",
      },
      {
        label: "The Architectural Review – Postmodern architecture",
        href: "https://www.architectural-review.com/essays/postmodernism",
      },
    ],
    keywords: [
      "postmodernizm nedir",
      "postmodern mimarlık",
      "postmodernizm özellikleri",
      "modernizm postmodernizm farkı",
      "postmodern yapılar",
    ],
  },
  {
    slug: "dekonstruktivizm-nedir",
    title: "Dekonstrüktivizm Nedir? Mimarlıkta Parçalanma ve Geometri",
    shortTitle: "Dekonstrüktivizm Nedir?",
    description:
      "Dekonstrüktivist mimarlığın ortaya çıkışı, parçalı geometrisi, önemli mimarları, MoMA 1988 sergisi ve yapı örnekleri.",
    category: "Mimarlık Akımları",
    period: "1980’ler sonrası",
    readingTime: "8 dakika",
    intro:
      "Dekonstrüktivizm, mimarlıkta alışılmış bütünlük, düzen, simetri ve kararlı geometrileri sorgulayan yaklaşımlarla ilişkilidir. Parçalanmış kütleler, çakışan sistemler, eğik düzlemler ve kontrollü gerilim hissi sık görülür; ancak amaç yalnızca karmaşık veya eğri biçimler üretmek değildir.",
    summary: [
      "Bütün ve dengeli kompozisyon fikrini sorgular.",
      "Parçalanma, kayma, çakışma ve beklenmedik geometriler kullanabilir.",
      "Yapı düzensiz görünse de tasarım ve taşıyıcı sistem dikkatle kontrol edilir.",
      "1988 MoMA sergisi kavramın yaygınlaşmasında önemli bir dönüm noktasıdır.",
      "Tek bir ortak üsluptan çok benzer sorular soran farklı mimarları kapsar.",
    ],
    sections: [
      {
        title: "Dekonstrüktivizm nasıl ortaya çıktı?",
        paragraphs: [
          "1988’de Philip Johnson ve Mark Wigley tarafından MoMA’da düzenlenen Deconstructivist Architecture sergisi, yedi mimar ve ofisin çalışmalarını bir araya getirerek kavramın mimarlık ortamında görünürlük kazanmasını sağladı. Sergide Peter Eisenman, Frank Gehry, Zaha Hadid, Rem Koolhaas, Daniel Libeskind, Bernard Tschumi ve Coop Himmelblau yer aldı.",
          "Bu mimarların tümü aynı manifesto altında çalışmıyordu. Ortaklıkları, modern mimarlığın saf ve kararlı geometrisini içeriden bozarak yeni mekânsal ilişkiler araştırmalarında görülüyordu.",
        ],
      },
      {
        title: "Biçimsel ve mekânsal özellikler",
        paragraphs: [
          "Dik açılı sistemlerin kaydırılması, farklı geometrilerin üst üste bindirilmesi, yüzeylerin katlanması ve yapının parçalı okunması sık kullanılan araçlardır. Dolaşım, strüktür ve kabuk birbirleriyle gerilimli ilişkiler kurabilir.",
          "Ortaya çıkan dinamik görünüm rastlantısal değildir. Özellikle dijital modelleme ve üretim teknolojilerinin gelişmesiyle karmaşık geometriler hassas biçimde analiz edilip uygulanabilir hâle gelmiştir.",
        ],
      },
      {
        title: "Dekonstrüksiyon felsefesiyle ilişkisi",
        paragraphs: [
          "Terim, Jacques Derrida’nın dekonstrüksiyon düşüncesiyle ilişkilendirilse de mimari uygulamalar bu felsefenin doğrudan biçime çevrilmiş hâli değildir. Bazı mimarlar ve kuramcılar metin, anlam ve ikili karşıtlıklar üzerinden güçlü ilişkiler kurarken bazıları daha çok geometrik ve mekânsal deneylerle ilgilenir.",
          "Bu nedenle her kırık, eğik veya karmaşık yapıyı dekonstrüktivist olarak sınıflandırmak kavramı yüzeysel hâle getirir.",
        ],
      },
      {
        title: "Eleştiriler ve güncel etkiler",
        paragraphs: [
          "Dekonstrüktivist yapılar güçlü deneyimler üretirken maliyet, yapım karmaşıklığı, işlevsel kullanım ve kent bağlamı açısından eleştirilebilir. İkonik biçimin programın önüne geçtiği örnekler özellikle tartışmalıdır.",
          "Buna rağmen parametrik tasarım, dijital üretim, parçalı kütle organizasyonu ve akışkan dolaşım gibi çağdaş konular üzerinde kalıcı etkiler bırakmıştır.",
        ],
      },
    ],
    architects: [
      "Peter Eisenman",
      "Frank Gehry",
      "Zaha Hadid",
      "Daniel Libeskind",
      "Bernard Tschumi",
      "Rem Koolhaas",
    ],
    examples: [
      { name: "Vitra Design Museum", detail: "Frank Gehry, 1989" },
      { name: "Vitra İtfaiye İstasyonu", detail: "Zaha Hadid, 1993" },
      { name: "Yahudi Müzesi Berlin", detail: "Daniel Libeskind, 2001" },
      { name: "Parc de la Villette", detail: "Bernard Tschumi, 1982–1998" },
    ],
    faq: [
      {
        question: "Dekonstrüktivizm ile dekonstrüksiyon aynı şey mi?",
        answer:
          "Aynı değildir. Dekonstrüksiyon felsefi ve eleştirel bir düşünce alanıdır; dekonstrüktivizm ise belirli mimari tartışmaları tanımlamak için kullanılan bir terimdir.",
      },
      {
        question: "Her eğri yapı dekonstrüktivist midir?",
        answer:
          "Hayır. Biçim tek başına yeterli değildir; geometrik sistemlerin, mekânsal düzenin ve bütünlük fikrinin nasıl sorgulandığı önemlidir.",
      },
      {
        question: "1988 MoMA sergisinde kimler vardı?",
        answer:
          "Peter Eisenman, Frank Gehry, Zaha Hadid, Rem Koolhaas, Daniel Libeskind, Bernard Tschumi ve Coop Himmelblau.",
      },
    ],
    sources: [
      {
        label: "MoMA – Deconstructivist Architecture sergisi",
        href: "https://www.moma.org/calendar/exhibitions/1813",
      },
      {
        label: "MoMA – 1988 sergi kataloğu",
        href: "https://www.moma.org/documents/moma_catalogue_1813_300062863.pdf",
      },
    ],
    keywords: [
      "dekonstrüktivizm nedir",
      "dekonstrüktivist mimarlık",
      "dekonstrüksiyon mimarlık",
      "zaha hadid akımı",
      "dekonstrüktivist yapılar",
    ],
  },
];

export function getArchitectureArticle(slug: string) {
  return architectureArticles.find((article) => article.slug === slug);
}

architectureArticles.push(...additionalArchitectureArticles);
import { additionalArchitectureArticles } from "./more-articles";
