# PAFTA

**Mimarlık Öğrencilerinin Dijital Kampüsü**

PAFTA; mimarlık öğrencileri için hesaplama araçlarını, PDF işlemlerini,
öğrenci yardımcılarını ve Revit/BIM kaynaklarını tek yerde toplayan bir
Next.js uygulamasıdır.

## Teknoloji

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- PDF.js, pdf-lib ve JSZip

## Yerel geliştirme

Node.js 22.13 veya daha yeni bir sürüm kullanılması önerilir.

```bash
npm install
npm run dev
```

Ardından [http://localhost:3000](http://localhost:3000) adresini açın.

## Site adresi ve SEO

Yayın ortamında `NEXT_PUBLIC_SITE_URL` değişkenini sitenin kesin adresiyle
tanımlayın. Örnek değer `.env.example` dosyasında bulunur. PAFTA alan adı
alınana kadar yerel geliştirmede otomatik olarak `http://localhost:3000`
kullanılır.

Google Analytics ve AdSense hazırlığı ortam değişkenleri üzerinden yapılır:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
```

Bu değerler tanımlanmadığında analiz ve reklam kodları yüklenmez. Değerler
tanımlandığında ilgili kodlar yalnızca ziyaretçi izin verdikten sonra
etkinleşir.

## Kontroller

Değişiklikleri kaydetmeden önce:

```bash
npm run lint
npm run build
```

Mevcut durum ve sıradaki işler için [PROJECT_STATUS.md](PROJECT_STATUS.md)
dosyasına bakın.
