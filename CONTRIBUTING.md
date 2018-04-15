#### İlkeler
Otağ Çatı çalışması temel ilkeleri şunlardır:

* JavaScript prototip tabanlı olduğu için yöntemleri olabildiğince prototipleştirmek
* Ön yüz(Frontend) DOM ögelerinden oluştuğu için Otağ Bileşenlerini DOM ekseninde yazmak
* İstemci cihazını etkin kullanarak sunucu yükünü azaltırken kod kalitesi ve verimliliğe dikkat ederek aygıt pil ömrünü korumak
* Zengin bileşenleri tek biçimlilik ile yalınlaştırmak
* Temel yazımı koruyarak bilinen Otağ yazımından uzaklaşmamak
* Yalınlık ve başarımı bir arada sağlamak
* En gerekli ve temel özellikleri barındırmak

#### Değişiklik yönergesi
* Eğer bir kodun değiştirilmesi gerektiğini düşünüyorsanız bunun için bir ya da daha fazla sebep sunabiliyor olmalısınız. Bu sebepler 'Bunu daha farklı yapabilirim' ya da 'Bu çok çirkin' gibi nedenler, geçerli nedenler değildir. 
* Vakit nakittir, bir kodu değiştirmek/yeniden yazmak enerji kaybına neden olur. Eğer yapmak istediğiniz değişiklikler çok önemli bir fayda getirmiyorsa değiştirmek için zaman harcamamalısınız.
* Kodun her bir satırı işlemelidir. Mevcut kodları, belgelendirmelerle anlaşılmış çıktıları, Otağ ile geliştirilen tasarıları kökten etkileyip zarara neden olabilecek değişiklikler önlenmelidir.
* Bir yöntem başka yöntemleri kullanabilir. Bu yüzden iç bağımlılıklara zarar verilmemelidir.
* Yapacağınız değişiklikler anlaşılabilir olmalıdır. Eğer yalınlığı etkilemeden kodu kısaltıyorsanız bu iyidir. Eğer yalınlığı da artırıyorsanız çok iyidir.
* Çalışma zamanı başarımına engel olunmamalıdır. Karmaşıklık(Büyük O yazımı) denetimine özen gösterilmeden sadece yalınlaştırma/kod kısaltma amaçlanan değişiklikler iyi değildir. Özellikle temel ve sık kullanılan işlevler/yöntemler konusunda titiz olunmalıdır.
* Erken aşamalarda değişiklik/geliştirme niyetinizi belirtin. Yöntemler geliştirilirken Oğulcuk, [Dölüt](https://tr.wiktionary.org/wiki/d%C3%B6l%C3%BCt) aşamalarında sağlaması gereken nitelikler belirlenir, tasarı daha kolay değiştirilebilir/geliştirilebilir. Bu aşamalarda yapacağınız öneriler ve işbirlikleri sonrasına göre çok daha büyük katkı sağlar. Oturmuş kısımlardansa, tasarım aşamasındaki bölümlere odaklanın. Oturmuş kodları/yöntemleri geliştirmek daha sıkıntılı bir süreç olacaktır.
* Sağlıklı tasarım önemlidir. Girdiler, çıktılar, her türlü biçim (bkz: çokbiçimlilik) için özenle belirlenmelidir. Düzgün arayüzü bulunmayan işlevler/yöntemler ileride böceklere neden olması kaçınılmazdır.

#### Katılım sağlama
♥ Tasarının geliştirilmesi için bunları göz önünde bulundurularak katkı sağlayabilirsiniz.

#### Bileşen geliştirme
Wiki'de bulunan Bileşen Geliştirme belgesine dikkat ederek geliştirdiğiniz Otağ Bileşenleri'ni tanıtıyoruz.
