# PAFTA V8 — Gelişmiş Tasarım Araçları

## Güneş, Yönlenme ve Cephe Asistanı

- Türkiye'nin 81 il merkezi
- Özel enlem ve boylam girişi
- Tarih ve 15 dakikalık saat seçimi
- 0–359° serbest cephe azimutu
- NOAA/GML yaklaşımına dayalı yaklaşık güneş yüksekliği ve azimutu
- Saatlik cephe etkisi grafiği
- 21 Mart, 21 Haziran, 23 Eylül ve 21 Aralık karşılaştırması
- Pencere ölçüsü, saçak, saçak boşluğu, sol/sağ düşey kırıcı
- Çevre yapı/engel açısı
- Cam SHGC/g değeri ve kullanıma göre karar raporu
- Gökyüzü planı ve cephe kesiti

## Vaziyet Yerleşimi ve Yapı Oturumu Simülatörü

- Nokta ekleyerek serbest biçimli parsel çizimi
- Parsel köşelerini sürükleyerek düzenleme ve silme
- Yol/ön cephe olarak istenen parsel kenarını seçme
- Ön ve diğer sınırlar için farklı çekme mesafeleri
- Birden fazla yapı kütlesi ekleme, sürükleme, döndürme, çoğaltma ve silme
- Kat adedi, yapı eni ve boyu düzenleme
- Çokgen parsel alanı, oturum alanı, oturum oranı ve toplam kat alanı
- Yapı köşelerinin parsel içinde ve gerçek kenar mesafelerine uygunluk kontrolü
- Döndürülebilir kuzey oku

## Mimari Detay Kütüphanesi

- Kütüphane kartlarında katman ön izlemeleri
- Her detay sayfasında kategoriye göre yatay/dikey teknik katman şeması
- Katman numaraları, lider çizgileri ve süreklilik uyarıları
- Temel ve ıslak hacim detaylarında birleşime özel ek grafikler

## Header

Header menüsü şu doğrudan gruplara ayrıldı:

- Tasarım
- Teknik + Hesap
- PDF
- Pafta + Teslim
- Kütüphaneler
- Öğrenci + AI

PDF araçlarına artık başka bir üst menüden geçmeden doğrudan ulaşılır.

## Kurulum ve kontrol

1. ZIP içeriğini proje klasörüne çıkartın ve dosya değişimini onaylayın.
2. `npm run build`
3. `npm run dev`
4. Kontrol adresleri:
   - `/proje-araclari/gunes-yonlenme`
   - `/proje-araclari/vaziyet-simulatoru`
   - `/mimari-detaylar`

Paket Next.js 16.2.11 üretim derlemesi ve ESLint ile kontrol edilmiştir.
