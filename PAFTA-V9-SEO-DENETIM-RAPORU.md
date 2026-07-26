# PAFTA V9 — Site Geneli SEO Denetim Raporu

## Kapsam

- 83 route `page.tsx` dosyası denetlendi.
- Dinamik sayfalarla birlikte 243 üretim sayfası kontrol edildi.
- 83/83 route, kendine ait metadata veya doğrudan route layout metadata kapsamına alındı.
- Canonical adresler, başlık şablonları, açıklamalar, Open Graph ve Twitter kartları gözden geçirildi.

## Düzeltilen temel sorunlar

- Aynı klasör açıklamasını kullanan hesap, PDF ve öğrenci araçları ayrıştırıldı.
- Başlık sonunda iki kez “PAFTA” oluşmasına yol açabilecek sayfa başlıkları temizlendi.
- Ana sayfa başlığı `absolute` yapılarak marka başlığının tekrarlanması önlendi.
- Yönlendirme sayfası `/student-tools/submission-inspector` için `noindex` ve hedef canonical tanımlandı.
- Sitemap güncelleme tarihi yeni sürüme göre güncellendi.
- Favicon kaynakları PAFTA ikonunda birleştirildi.

## Araç sayfaları

36 araç/araç grubu `WebApplication` ve `BreadcrumbList` yapılandırılmış verisi kapsamına alındı.

Her araç için çeşitlendirilen alanlar:

- Benzersiz başlık
- Benzersiz açıklama
- Sayfaya özgü canonical
- Arama niyetine göre anahtar ifadeler
- Open Graph ve Twitter paylaşım verisi
- Uygulama kategorisi
- Ücretsiz kullanım bilgisi
- Özellik listesi
- Ana sayfa → kategori → araç breadcrumb zinciri

Kapsanan ana gruplar:

- Mimari ve teknik hesap araçları
- PDF araçları
- Öğrenci araçları
- Tasarım araçları
- Pafta ve teslim araçları

## İçerik sayfaları

Mimari detay, Revit, BIM, yapı malzemesi, proje rehberi, emsal proje ve mekân ölçüsü içerikleri `Article` ve `BreadcrumbList` yapılandırılmış verisiyle çeşitlendirildi.

İçerik şemalarında:

- Başlık ve açıklama
- İçerik bölümü
- Sayfa adresi
- Anahtar ifadeler
- PAFTA yazar/yayıncı bilgisi
- Yayıncı logosu
- İçerik breadcrumb zinciri

tanımlandı.

## Site kimliği

Kök şemada:

- `Organization`
- `WebSite`
- PAFTA adı ve adresi
- 512×512 logo
- İletişim e-postası
- Yayıncı ilişkisi

tanımlandı.

## Doğrulama

- ESLint: yeni hata yok
- Önceden var olan 8 uyarı devam ediyor
- Next.js 16.2.11 üretim derlemesi: başarılı
- Üretilen sayfa sayısı: 243
- Örnek araç HTML’lerinde title, canonical, `WebApplication` ve `BreadcrumbList` doğrulandı
- Örnek içerik HTML’lerinde canonical, `Article` ve `BreadcrumbList` doğrulandı

## Yayın sonrası

1. GitHub’a yükleyin ve Netlify yayınının tamamlanmasını bekleyin.
2. Search Console’da sitemap durumunu kontrol edin.
3. Öncelikli sayfalarda URL Denetimi → Canlı URL Testi → Dizine Eklenmesini İste adımlarını uygulayın.
4. Yapılandırılmış Veri Sonuçları / Geliştirmeler raporunun oluşması için Google’ın yeniden taramasını bekleyin.

SEO tanımları görünürlüğü destekler; tek başına sıralama garantisi vermez. Sayfa yararı, rekabet, site geçmişi, gerçek kullanım ve doğal bağlantılar sıralamayı ayrıca etkiler.
