// Tipler ve yedek (fallback) veri

export type Firma = {
  id: string;
  ad: string;
  sehir: string;
  adres: string;
  konumUrl: string;
  kategori: string[];
  aciklama: string;
  gorseller: string[];
  logo: string;
};

// Build sürecinde /firma.json okunamazsa ekrandaki ilk render boşa düşmesin diye fallback
export const DEFAULT_VERI: Firma[] = [
  {
    id: "komagene-plajyolu",
    ad: "Komagene Plajyolu",
    sehir: "Kocaeli",
    adres: "Cumhuriyet, Sulucak Sk. Işın Sitesi No:1/2A, 41100 İzmit/Kocaeli",
    konumUrl:
      "https://www.google.com/maps/search/?api=1&query=Komagene+Plajyolu+Cumhuriyet+Sulucak+Sk+Işın+Sitesi+İzmit",
    kategori: ["Yemek"],
    aciklama: "Öğrenci indirimi: %10.",
    gorseller: ["/images/komagene-plajyolu/1.jpg"],
    logo: "/images/komagene-plajyolu/1.jpg",
  },
  {
    id: "pike-pet",
    ad: "Pike Pet Market",
    sehir: "Kocaeli",
    adres:
      "Pike Pet Market Plajyolu, Miraç Sitesi, Cumhuriyet, Sulucak Sk. D:3A, 41570 İzmit/Kocaeli",
    konumUrl:
      "https://www.google.com/maps/search/?api=1&query=Pike+Pet+Market+Plajyolu+İzmit",
    kategori: ["Pet Shop"],
    aciklama: "Öğrenci indirimi: %10.",
    gorseller: [
      "/images/pike-pet/2.jpg",
      "/images/pike-pet/3.jpg",
      "/images/pike-pet/4.jpg",
      "/images/pike-pet/5.jpg",
    ],
    logo: "/images/pike-pet/2.jpg",
  },
  {
    id: "kahve-filosu",
    ad: "Kahve Filosu",
    sehir: "Kocaeli",
    adres:
      "Yürüyüş Yolu Eren Camii karşısı, Cedit, Atatürk Blv. 5A, 41001 İzmit/Kocaeli",
    konumUrl:
      "https://www.google.com/maps/search/?api=1&query=Kahve+Filosu+Cedit+Atatürk+Blv+İzmit",
    kategori: ["Kafe"],
    aciklama: "Öğrenci indirimi: %15–%20.",
    gorseller: [
      "/images/kahve-filosu/6.jpg",
      "/images/kahve-filosu/7.jpg",
      "/images/kahve-filosu/8.jpg",
      "/images/kahve-filosu/9.jpg",
    ],
    logo: "/images/kahve-filosu/6.jpg",
  },
  {
    id: "bag-yolu-pilav",
    ad: "Bağ Yolu Pilav",
    sehir: "Kocaeli",
    adres: "Işık Apartmanı, Serdar, İnkılap Cd., 41100 İzmit/Kocaeli",
    konumUrl:
      "https://www.google.com/maps/search/?api=1&query=Bağ+Yolu+Pilav+Serdar+İnkılap+Cd+İzmit",
    kategori: ["Yemek"],
    aciklama: "Öğrenci indirimi: %10.",
    gorseller: ["/images/bag-yolu-pilav/10.jpeg", "/images/bag-yolu-pilav/11.jpeg"],
    logo: "/images/bag-yolu-pilav/10.jpeg",
  },
  {
    id: "italian",
    ad: "Di Grande Valore Italian",
    sehir: "Kocaeli",
    adres: "Alikahya Fatih, Kural Sk., 41310 İzmit/Kocaeli",
    konumUrl:
      "https://www.google.com/maps/search/?api=1&query=Di+Grande+Valore+Italian+Alikahya+Fatih+Kural+Sk",
    kategori: ["Yemek", "Restoran"],
    aciklama: "Öğrenci indirimi: %15.",
    gorseller: [
      "/images/italian/12.jpg",
      "/images/italian/13.jpg",
      "/images/italian/14.jpg",
      "/images/italian/15.jpg",
      "/images/italian/16.jpg",
    ],
    logo: "/images/italian/12.jpg",
  },
  {
    id: "art-galeri",
    ad: "Hulda Art Gallery Tattoo & Piercing",
    sehir: "Kocaeli",
    adres: "Karabaş, İstiklal Cd. No:174 D:301 Kat:3, 41040 İzmit/Kocaeli",
    konumUrl:
      "https://www.google.com/maps/search/?api=1&query=Hulda+Art+Gallery+Tattoo+%26+Piercing+İzmit",
    kategori: ["Dövme", "Piercing"],
    aciklama:
      "3–4 cm minimal: 2000₺ • 4–6 cm minimal: 4000₺ • Diğer tüm modellerde %20 indirim.",
    gorseller: [
      "/images/art-galeri/17.jpg",
      "/images/art-galeri/18.jpg",
      "/images/art-galeri/19.jpg",
      "/images/art-galeri/20.jpg",
      "/images/art-galeri/21.jpg",
    ],
    logo: "/images/art-galeri/17.jpg",
  },
  {
    id: "esra-yucekal",
    ad: "Esra Yücekal Güzellik Salonu",
    sehir: "Kocaeli",
    adres:
      "Mehmet Ali Paşa Mah. Turan Güneş Cad. No:230 Üçyol (Akbank karşısı) 41001 İzmit/Kocaeli",
    konumUrl:
      "https://www.google.com/maps/search/?api=1&query=Esra+Yücekal+Güzellik+Salonu+İzmit",
    kategori: ["Güzellik Salonu"],
    aciklama: "Öğrenci indirimi: %15.",
    gorseller: [
      "/images/esra-yucekal/21.jpg",
      "/images/esra-yucekal/22.jpg",
      "/images/esra-yucekal/23.jpg",
      "/images/esra-yucekal/24.png",
      "/images/esra-yucekal/25.jpg",
    ],
    logo: "/images/esra-yucekal/21.jpg",
  },
  {
    id: "parmella-makarna",
    ad: "Parmella Makarna",
    sehir: "Kocaeli",
    adres: "Karabaş, Asım Efendi Sk. 10 A, 41040 İzmit/Kocaeli",
    konumUrl:
      "https://www.google.com/maps/search/?api=1&query=Parmella+Makarna+Asım+Efendi+Sk+İzmit",
    kategori: ["Yemek"],
    aciklama: "Öğrenci indirimi: %10.",
    gorseller: [
      "/images/parmella-makarna/26.jpg",
      "/images/parmella-makarna/27.jpg",
      "/images/parmella-makarna/28.jpg",
      "/images/parmella-makarna/29.jpg",
      "/images/parmella-makarna/30.jpg",
      "/images/parmella-makarna/31.jpg",
    ],
    logo: "/images/parmella-makarna/26.jpg",
  },
  {
    id: "suit",
    ad: "Happy Yellow Suit Kartepe",
    sehir: "Kocaeli",
    adres: "Nusretiye, Ak Sk. No:14, 41080 Kartepe/Kocaeli",
    konumUrl:
      "https://www.google.com/maps/search/?api=1&query=Happy+Yellow+Suit+Kartepe",
    kategori: ["Konaklama"],
    aciklama: "Hafta içi öğrenci indirimi: %35.",
    gorseller: [
      "/images/suit/31.jpg",
      "/images/suit/32.jpg.jpeg",
      "/images/suit/33.jpg",
      "/images/suit/34.jpg",
      "/images/suit/35.jpeg",
      "/images/suit/36.jpg",
      "/images/suit/37.jpg",
      "/images/suit/38.jpg",
      "/images/suit/39.jpg",
    ],
    logo: "/images/suit/31.jpg",
  },
  {
    id: "mantici",
    ad: "Obur Közde Mantı",
    sehir: "Kocaeli",
    adres: "Rıza Aygün İşhanı, Tepecik, Kemaliye Cd. No:22-A, 41200 İzmit/Kocaeli",
    konumUrl:
      "https://www.google.com/maps/search/?api=1&query=Obur+Közde+Mantı+Kemaliye+Cd+İzmit",
    kategori: ["Yemek"],
    aciklama: "Öğrenci indirimi: %20.",
    gorseller: [
      "/images/mantici/40.jpg",
      "/images/mantici/41.jpg",
      "/images/mantici/42.jpg",
      "/images/mantici/43.jpg",
      "/images/mantici/44.png",
      "/images/mantici/45.png",
    ],
    logo: "/images/mantici/40.jpg",
  },
  {
    id: "maydonoz-doner",
    ad: "Maydonoz Döner İzmit Merkez",
    sehir: "Kocaeli",
    adres: "Ömerağa, Alemdar Cd. No:18/A, 41001 İzmit/Kocaeli",
    konumUrl:
      "https://www.google.com/maps/search/?api=1&query=Maydonoz+Döner+Alemdar+Cd+İzmit",
    kategori: ["Yemek"],
    aciklama: "Öğrenci indirimi: %20.",
    gorseller: [
      "/images/maydonoz-doner/46.jpg",
      "/images/maydonoz-doner/47.jpg",
      "/images/maydonoz-doner/48.jpg",
      "/images/maydonoz-doner/49.jpg",
    ],
    logo: "/images/maydonoz-doner/46.jpg",
  },
  {
    id: "foto-klinik",
    ad: "Foto Klinik",
    sehir: "Kocaeli",
    adres: "K1, Ömerağa, Ömerağa Mah., Abdurrahman Yüksel Cd., 41300 İzmit/Kocaeli",
    konumUrl:
      "https://www.google.com/maps/search/?api=1&query=Foto+Klinik+Abdurrahman+Yüksel+Cd+İzmit",
    kategori: ["Fotoğrafçı"],
    aciklama: "Öğrenci indirimi: %5.",
    gorseller: ["/images/foto-klinik/50.jpg", "/images/foto-klinik/51.jpg", "/images/foto-klinik/52.jpg"],
    logo: "/images/foto-klinik/50.jpg",
  },
  {
    id: "disci",
    ad: "Dentizmit Ağız ve Diş Sağlığı Polikliniği",
    sehir: "Kocaeli",
    adres: "Ömerağa, Karayolu Cd. No:59/2, 41100 İzmit/Kocaeli",
    konumUrl:
      "https://www.google.com/maps/search/?api=1&query=Dentizmit+Ağız+ve+Diş+Sağlığı+Karayolu+Cd+İzmit",
    kategori: ["Dişçi"],
    aciklama: "Öğrenci indirimi: %20.",
    gorseller: ["/images/disci/53.jpg", "/images/disci/54.jpg", "/images/disci/55.jpg", "/images/disci/56.png"],
    logo: "/images/disci/53.jpg",
  },
  {
    id: "efe-kirtasiye",
    ad: "Efe Kırtasiye",
    sehir: "Kocaeli",
    adres: "Esentepe, Hamit Kaplan Blv. No:209/A, 41780 Körfez/Kocaeli",
    konumUrl:
      "https://www.google.com/maps/search/?api=1&query=Efe+Kırtasiye+Hamit+Kaplan+Blv+Körfez",
    kategori: ["Kırtasiye"],
    aciklama: "Öğrenci indirimi: %20.",
    gorseller: ["/images/efe-kirtasiye/57.jpg", "/images/efe-kirtasiye/58.jpg", "/images/efe-kirtasiye/59.jpg"],
    logo: "/images/efe-kirtasiye/57.jpg",
  },
  {
    id: "amor",
    ad: "AMOR AROMA Café & Fast Food",
    sehir: "Kocaeli",
    adres: "Hacıhasan, İnönü Cd. No:47 D:E, 41200 İzmit/Kocaeli",
    konumUrl:
      "https://www.google.com/maps/search/?api=1&query=AMOR+Aroma+Cafe+İnönü+Cd+İzmit",
    kategori: ["Yemek", "Kafe"],
    aciklama: "Öğrenci indirimi: %20.",
    gorseller: ["/images/amor/60.jpg", "/images/amor/61.jpg", "/images/amor/62.jpg"],
    logo: "/images/amor/60.jpg",
  },
  {
    id: "frida-kafe",
    ad: "Frida Cafe İzmit",
    sehir: "Kocaeli",
    adres: "Tepecik, Tokoğlu Sk. No:5, 41050 İzmit/Kocaeli",
    konumUrl:
      "https://www.google.com/maps/search/?api=1&query=Frida+Cafe+Tokoğlu+Sk+İzmit",
    kategori: ["Kafe"],
    aciklama: "Öğrenci indirimi: %10.",
    gorseller: [
      "/images/frida-kafe/63.jpg",
      "/images/frida-kafe/64.jpg",
      "/images/frida-kafe/65.jpg",
      "/images/frida-kafe/66.jpg",
      "/images/frida-kafe/67.jpg",
      "/images/frida-kafe/68.jpg",
    ],
    logo: "/images/frida-kafe/63.jpg",
  },
  {
    id: "debatu",
    ad: "DeBatu HairDesing",
    sehir: "Kocaeli",
    adres: "Erenler, Deve Bağırtan Sk. 85/A, 41100 İzmit/Kocaeli",
    konumUrl:
      "https://www.google.com/maps/search/?api=1&query=DeBatu+HairDesing+Deve+Bağırtan+Sk+İzmit",
    kategori: ["Berber", "Kuaför"],
    aciklama: "Öğrenci indirimi: %20.",
    gorseller: [
      "/images/debatu/69.jpg",
      "/images/debatu/70.jpg",
      "/images/debatu/71.jpg",
      "/images/debatu/72.jpg",
      "/images/debatu/73.jpg",
    ],
    logo: "/images/debatu/69.jpg",
  },
  {
    id: "cicek-sepeti",
    ad: "Çiçek Sepeti Gebze",
    sehir: "Kocaeli",
    adres: "Hacıhalil, 1207. Sk. No:13, 41400 Gebze/Kocaeli",
    konumUrl:
      "https://www.google.com/maps/search/?api=1&query=Çiçek+Sepeti+1207.+Sk+Gebze",
    kategori: ["Çiçekçi"],
    aciklama: "Öğrenci indirimi: %20.",
    gorseller: [
      "/images/cicek-sepeti/74.png",
      "/images/cicek-sepeti/75.jpg",
      "/images/cicek-sepeti/76.jpg",
      "/images/cicek-sepeti/77.png",
      "/images/cicek-sepeti/78.jpg",
      "/images/cicek-sepeti/79.jpg",
      "/images/cicek-sepeti/80.jpg",
      "/images/cicek-sepeti/81.jpg",
    ],
    logo: "/images/cicek-sepeti/74.png",
  },
  {
    id: "viamore-flowers",
    ad: "Viamore Flowers",
    sehir: "Kocaeli",
    adres: "Yenişehir, Atayurt Cd. No:4 D:A, 41050 İzmit/Kocaeli",
    konumUrl: "https://maps.app.goo.gl/XiYpZ51y5tmabyLW9",
    kategori: ["Çiçekçi"],
    aciklama: "Öğrenci indirimi: %15.",
    gorseller: [
      "/images/Viamore-Flowers/82.jpg",
      "/images/Viamore-Flowers/83.jpg",
      "/images/Viamore-Flowers/84.jpg",
      "/images/Viamore-Flowers/85.jpg",
    ],
    logo: "/images/Viamore-Flowers/82.jpg",
  },
  {
    id: "luur-coffee",
    ad: "Luur Coffee & More",
    sehir: "Kocaeli",
    adres: "Yenişehir, Atayurt Cd. No:4 D:A, 41050 İzmit/Kocaeli",
    konumUrl: "https://maps.app.goo.gl/1z3RZLjie3oqVLJq5",
    kategori: ["Kafe"],
    aciklama: "Öğrenci indirimi: %20.",
    gorseller: [
      "/images/Luur-Coffee-&-More/86.jpg",
      "/images/Luur-Coffee-&-More/87.jpg",
      "/images/Luur-Coffee-&-More/88.jpg",
    ],
    logo: "/images/Luur-Coffee-&-More/86.jpg",
  },
  {
    id: "fade-hair-studio",
    ad: "Fade Hair Studio",
    sehir: "Kocaeli",
    adres:
      "Fade Hair Studio, HALKEVİ E-5 YANI KEMAL PAŞA MAH.ANKARA KARAYOLU CAD. BİLYİL APR. 9/A, 41200 İzmit/Kocaeli",
    konumUrl: "https://maps.app.goo.gl/YKPkHKSHN3k2ruVy9",
    kategori: ["Berber"],
    aciklama: "Öğrenciler için saç & sakal 500 TL.",
    gorseller: ["/images/Fade-Hair-Studio/89.jpg"],
    logo: "/images/Fade-Hair-Studio/89.jpg",
  },

  /* ---------------- YENİ EKLENEN 5 DÜKKAN ---------------- */

  {
    id: "kavurmaci-remzi",
    ad: "Kavurmacı Remzi",
    sehir: "Kocaeli",
    adres: "Kuruçeşme Fatih, İsmail Özen Cd. No:17/A, 41100 İzmit/Kocaeli",
    konumUrl: "https://maps.app.goo.gl/we86LV759okxLD9y7",
    kategori: ["Yemek"],
    aciklama: "Öğrenci indirimi: %10.",
    gorseller: [
      "/images/kavurmaci-remzi/90.jpg",
      "/images/kavurmaci-remzi/91.jpg",
      "/images/kavurmaci-remzi/92.jpg",
    ],
    logo: "/images/kavurmaci-remzi/90.jpg",
  },
  {
    id: "sert-cetin-cafe",
    ad: "Sertçetin Kafe",
    sehir: "Kocaeli",
    adres: "Karabaş, 41040 İzmit/Kocaeli",
    konumUrl: "https://maps.app.goo.gl/HSdKg2VPD1TsqEU7A",
    kategori: ["Kafe"],
    aciklama: "Öğrenci indirimi: %10.",
    gorseller: ["/images/sert-cetin-cafe/93.jpeg", "/images/sert-cetin-cafe/94.webp"],
    logo: "/images/sert-cetin-cafe/93.jpeg",
  },
  {
    id: "blue-white-guzellik-salonu",
    ad: "Blue White",
    sehir: "Kocaeli",
    adres: "Kozluk, Orduevi Sk. No:A, 41200 İzmit/Kocaeli",
    konumUrl: "https://maps.app.goo.gl/fp8PMKhpJEuKFvqG6",
    kategori: ["Güzellik Salonu"],
    aciklama: "Öğrenci indirimi: %30.",
    gorseller: [
      "/images/blue-white-guzellik-salonu/95.jpeg",
      "/images/blue-white-guzellik-salonu/96.jpeg",
    ],
    logo: "/images/blue-white-guzellik-salonu/95.jpeg",
  },
  {
    id: "simay-pismaniye",
    ad: "Simay Pişmaniye",
    sehir: "Kocaeli",
    adres: "Ömerağa, İstiklal Cd., Saroğlu İş Hanı No:83 Kat:1, İzmit/Kocaeli",
    konumUrl:
      "https://www.google.com/maps/search/?api=1&query=Simay+Pişmaniye+İzmit",
    kategori: ["Tatlı"],
    aciklama: "Öğrenci indirimi: %50.",
    gorseller: ["/images/simay-pismaniye/97.jpg"],
    logo: "/images/simay-pismaniye/97.jpg",
  },
  {
    id: "belsa-han-sofrasi",
    ad: "Belsa Han Sofrası",
    sehir: "Kocaeli",
    adres: "İzmit/Kocaeli",
    konumUrl:
      "https://www.google.com/maps/search/?api=1&query=Belsa+Han+Sofrası+İzmit",
    kategori: ["Yemek"],
    aciklama: "Öğrenci indirimi: %10.",
    gorseller: ["/images/belsa-han-sofrasi/98.jpg"],
    logo: "/images/belsa-han-sofrasi/98.jpg",
  },
];
