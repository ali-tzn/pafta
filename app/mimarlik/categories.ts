export type ArchitectureCategory = {
  slug: string;
  name: string;
  label: string;
  description: string;
  introduction: string;
  plannedTopics: string[];
};

export const architectureCategories: ArchitectureCategory[] = [
  {
    slug: "akimlar",
    name: "Mimarlık Akımları",
    label: "Mimarlık Akımları",
    description:
      "Modernizmden dekonstrüktivizme mimarlık akımlarını tarihsel bağlamları, özellikleri ve yapı örnekleriyle incele.",
    introduction:
      "Mimarlık akımları, belirli bir dönemin teknoloji, toplum, sanat ve düşünce ortamına verilen ortak veya tartışmalı tasarım cevaplarıdır. Bu bölümde akımlar yalnızca cephe biçimleriyle değil; plan, strüktür, malzeme, kent ve kullanıcı anlayışlarıyla ele alınır.",
    plannedTopics: [
      "Art Nouveau",
      "Art Deco",
      "Konstrüktivizm",
      "De Stijl",
      "Organik mimarlık",
      "Metabolizm",
      "High-Tech mimarlık",
      "Eleştirel bölgeselcilik",
    ],
  },
  {
    slug: "kavramlar",
    name: "Mimari Kavramlar",
    label: "Mimari Kavramlar",
    description:
      "Bağlam, tipoloji, tektonik, ölçek, mekân ve işlev gibi temel mimarlık kavramlarını anlaşılır örneklerle öğren.",
    introduction:
      "Mimari kavramlar, tasarım kararlarını açıklamak ve eleştirmek için kullanılan düşünme araçlarıdır. Bu bölüm; stüdyo kritiğinde, araştırma raporunda ve proje sunumunda sık karşılaşılan kavramları açık tanımlar ve örnekler üzerinden ele alır.",
    plannedTopics: [
      "Bağlam",
      "Tipoloji",
      "Tektonik",
      "Genius loci",
      "İnsan ölçeği",
      "Kamusal alan",
      "Form ve işlev",
      "Mekânsal hiyerarşi",
    ],
  },
  {
    slug: "mimarlar",
    name: "Önemli Mimarlar",
    label: "Önemli Mimarlar",
    description:
      "Mimarlık tarihine yön veren mimarların tasarım yaklaşımlarını, önemli yapılarını ve eleştirilerini incele.",
    introduction:
      "Bir mimarı yalnızca ünlü yapılarıyla değil; yaşadığı dönem, tasarım düşüncesi, üretim yöntemi ve mimarlık tartışmalarındaki yeriyle anlamak gerekir. Bu bölüm mimarları kısa biyografiler yerine fikirleri ve projeleri üzerinden inceler.",
    plannedTopics: [
      "Le Corbusier",
      "Mies van der Rohe",
      "Frank Lloyd Wright",
      "Alvar Aalto",
      "Tadao Ando",
      "Zaha Hadid",
      "Louis Kahn",
      "Sedad Hakkı Eldem",
    ],
  },
  {
    slug: "yapilar",
    name: "İkonik Yapılar",
    label: "İkonik Yapılar",
    description:
      "Mimarlık tarihinin önemli yapılarını plan, kesit, strüktür, malzeme, bağlam ve kullanıcı deneyimi üzerinden analiz et.",
    introduction:
      "İkonik yapılar yalnızca görsel olarak tanınan nesneler değildir. Bir yapının neden önemli olduğunu anlamak için programını, dolaşımını, taşıyıcı sistemini, malzemesini, bağlamını ve sonraki üretimler üzerindeki etkisini birlikte okumak gerekir.",
    plannedTopics: [
      "Villa Savoye",
      "Farnsworth House",
      "Fallingwater",
      "Barcelona Pavyonu",
      "Bauhaus Dessau",
      "Salk Enstitüsü",
      "Kimbell Sanat Müzesi",
      "Sydney Opera Binası",
    ],
  },
];

export function getArchitectureCategory(slug: string) {
  return architectureCategories.find((category) => category.slug === slug);
}
