# PAFTA Proje Araçları Paketi

Bu paket aşağıdaki bölümleri ekler:

- Mimari Proje Başlangıç Merkezi
- Mekân Ölçüleri Kütüphanesi
- Pafta Yerleşim Oluşturucu
- Mimari Emsal Proje Atlası
- Yönetmelik Kontrol Asistanı

## V2 geliştirmeleri

- Header, bağlantı kalabalığını azaltan üç açılır menü grubuna dönüştürüldü.
- Proje Başlangıç Merkezi 14 yapı türüne çıkarıldı; apartman/toplu konut ve müstakil konut eklendi.
- Pafta Yerleşim Oluşturucu, her satırı dolduran 12 kolonlu otomatik grid sistemiyle yenilendi.
- Emsal Proje Atlası 30 projeye çıkarıldı ve her projeye yeni sekmede araştırma düğmesi eklendi.
- Yönetmelik Kontrol Asistanı basit ve gelişmiş sorgu modlarına ayrıldı.
- Gelişmiş modda nizam, Hmax, çekme mesafeleri, parsel ölçüleri, eğim, köşe parsel ve özel alan bilgileri kullanılabilir.

## V3 geliştirmeleri

- Açılır header menüleri kontrollü hale getirildi.
- Menü dışına tıklama, Escape tuşu veya bir bağlantı seçme menüleri kapatır.
- Aynı anda yalnızca bir kategori menüsü açık kalır.
- Yönetmelik raporuna sonuç durumu, emsal kullanım oranı ve oturum kullanım oranı eklendi.
- TAKS, çekme zarfı ve Hmax birlikte değerlendirilerek yaklaşık yerleşebilir oturum ve kapasite hesaplanır.
- Sayısal çakışmalar ayrı bölümde gösterilir.
- Projeye özel sıralı eylem planı, işaretlenebilir teknik kontrol listesi ve gerekli belge listesi oluşturulur.

## V4 geliştirmeleri

- Mimari İlişki ve Balon Diyagramı Oluşturucu eklendi.
- Mekân balonları m² değerlerine göre ölçeklenir.
- Kamusal, yarı kamusal, özel, servis ve dolaşım zonları renklendirilir.
- Yakın, ilişkili ve ayrı bağlantıları farklı çizgilerle gösterilir.
- Otomatik yerleşim ilişkileri dikkate alır ve balon çakışmalarını azaltır.
- Balonlar fare veya dokunmatik ekranla sürüklenebilir.
- Kat filtresi, mekân/ilişki düzenleme ve SVG, PNG, PDF çıktısı vardır.
- Proje Başlangıç Merkezi’ndeki program tek tuşla balon diyagramına aktarılabilir.

## V5 geliştirmeleri

- Duvar, çatı ve döşeme katman tasarımcısı eklendi.
- Katmanlar sürüklenebilir, sıralanabilir, eklenebilir ve silinebilir.
- Hazır malzemelerin kalınlık ve yaklaşık λ değerleri düzenlenebilir.
- Toplam ısıl direnç, U-değeri ve yaklaşık iletim ısı kaybı hesaplanır.
- Kullanıcının belirlediği hedef U-değeriyle karşılaştırma yapılır.
- Hedef için teorik ek yalıtım kalınlığı gösterilir.
- Katmanların oransal kesit görselleştirmesi ve ayrıntılı hesap tablosu oluşturulur.
- Hesap özeti kopyalanabilir ve rapor PDF olarak kaydedilebilir.

## V6 geliştirmeleri

- Malzemeler, özel sürükleme tutamacıyla canlı olarak yeniden sıralanabilir.
- Seçili katman ayrıntılı düzenleme alanında açılır; diğer katmanlar daha kompakt görünür.
- Katman çoğaltma, yukarı/aşağı taşıma ve hızlı silme kontrolleri eklendi.
- Aranabilir ve kategori filtreli malzeme paleti eklendi.
- Kesit, ölçülendirme çizgileri ve malzeme taramaları bulunan teknik SVG çizimine dönüştürüldü.
- Kesitte ısı akış yönü, U-değeri, katman kalınlıkları, λ ve R değerleri gösterilir.
- “Okunabilir” ve gerçek kalınlık oranlarını kullanan “Orantılı” kesit modları eklendi.
- Toplam kesit kalınlığı ile iç/dış yüzey dirençleri kesit özetinde gösterilir.
- Duvar kesiti yatay; çatı ve döşeme kesitleri ise doğru iç/dış yönleri ve ısı akışıyla dikey gösterilir.

Dosya Sağlık Kontrolü bu pakete dahil değildir.

## Kurulum

1. ZIP dosyasını açın.
2. ZIP içindeki `app` klasörünü ve bu dosyayı, PaftaEdu proje klasörünün içine kopyalayın.
3. Windows birleştirme/değiştirme onayı isterse dosyaların değiştirilmesine izin verin.
4. VS Code terminalinde proje klasöründe şu komutu çalıştırın:

   `npm run build`

5. Derleme başarılıysa:

   `npm run dev`

6. Tarayıcıdan `http://localhost:3000/proje-araclari` adresini açın.

## Kontrol edilecek adresler

- `/proje-araclari`
- `/proje-araclari/proje-baslangic`
- `/proje-araclari/mekan-olculeri`
- `/proje-araclari/pafta-yerlesimi`
- `/proje-araclari/emsal-atlasi`
- `/proje-araclari/yonetmelik-kontrol`
- `/proje-araclari/u-degeri-tasarimcisi`

Paket Next.js 16.2.11 üretim derlemesi ve ESLint ile kontrol edilmiştir.
