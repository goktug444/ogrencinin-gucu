// app/page.tsx
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Search,
  X,
  Building2,
  Globe,
  ImageIcon,
  UsersRound,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Firma } from "@/lib/data";
import { DEFAULT_VERI } from "@/lib/data";

type IconComponent = React.ComponentType<{ className?: string }>;
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

/* ---------------- UI yardımcıları ---------------- */
function SectionHeading({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  icon?: IconComponent;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-xl bg-muted">
        {Icon ? <Icon className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
      </div>
      <div>
        <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

/** Görsel hatasında şeffaf yer tutucu + blur */
const FALLBACK_DATAURL =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675">
       <rect width="100%" height="100%" fill="#f3f4f6"/>
       <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
             fill="#9ca3af" font-family="Arial" font-size="22">Görsel yüklenemedi</text>
     </svg>`
  );

const BLUR_1PX =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

/* ---------------- Firma Kartı ---------------- */
function FirmaKarti({ firma, onOpen }: { firma: Firma; onOpen: (f: Firma) => void }) {
  const firstImg = (firma.gorseller || []).filter(Boolean)[0];

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onOpen(firma)}
    >
      {/* Mobilde daha dengeli görünmesi için oran ve makul yükseklik */}
      <div className="relative bg-muted" style={{ aspectRatio: "4 / 3" }}>
        {firstImg ? (
          <Image
            src={firstImg}
            alt={firma.ad}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            quality={82}
            placeholder="blur"
            blurDataURL={BLUR_1PX}
            className="object-cover"
            onError={(e) =>
              ((e.currentTarget as unknown as HTMLImageElement).src =
                FALLBACK_DATAURL)
            }
            priority={false}
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-muted-foreground">
            <ImageIcon className="w-8 h-8" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {firma.kategori.slice(0, 2).map((k) => (
            <Badge key={k} variant="secondary" className="backdrop-blur">
              {k}
            </Badge>
          ))}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {firma.logo ? (
            <Image
              src={firma.logo}
              alt={firma.ad}
              width={40}
              height={40}
              className="rounded-xl object-contain border bg-white"
              quality={80}
              placeholder="blur"
              blurDataURL={BLUR_1PX}
              onError={(e) =>
                ((e.currentTarget as unknown as HTMLImageElement).src =
                  FALLBACK_DATAURL)
              }
            />
          ) : (
            <div className="w-10 h-10 rounded-xl grid place-items-center border bg-muted/40">
              <Building2 className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold truncate">{firma.ad}</h3>
              <span className="text-xs text-muted-foreground shrink-0">
                {firma.sehir}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {firma.aciklama}
            </p>
            <div className="flex items-center gap-2 text-sm mt-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="truncate" title={firma.adres}>
                {firma.adres}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------- Harita URL ---------------- */
function buildMapUrl(f: Firma) {
  if (f.konumUrl?.startsWith("place_id:")) {
    const pid = f.konumUrl.split("place_id:")[1].trim();
    return `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(
      pid
    )}`;
  }
  if (f.konumUrl?.startsWith("http")) return f.konumUrl;
  const q = `${f.ad} ${f.adres || ""} ${f.sehir || ""}`.trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    q
  )}`;
}

/* ---------------- Detay Modal + Galeri (ok + swipe) ---------------- */
function FirmaDetayModal({
  acik,
  firma,
  onClose,
}: {
  acik: boolean;
  firma: Firma | null;
  onClose: () => void;
}) {
  const list = React.useMemo(
    () => (firma?.gorseller || []).filter(Boolean),
    [firma]
  );

  const [idx, setIdx] = React.useState(0);
  const touchStartX = React.useRef<number | null>(null);

  // Modal her açıldığında ilk görsele dön
  React.useEffect(() => {
    if (acik) setIdx(0);
  }, [acik, firma?.id]);

  const go = React.useCallback(
    (delta: number) => {
      if (!list.length) return;
      setIdx((prev) => {
        const next = (prev + delta + list.length) % list.length;
        return next;
      });
    },
    [list.length]
  );

  // Klavye ok tuşları
  React.useEffect(() => {
    if (!acik) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [acik, go, onClose]);

  // Dokunmatik swipe (telefon / tablet)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const deltaX = endX - touchStartX.current;

    // Eşik: 40px üzeri kaydırma -> foto değiştir
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        // sola kaydırma -> sonraki
        go(1);
      } else {
        // sağa kaydırma -> önceki
        go(-1);
      }
    }

    touchStartX.current = null;
  };

  if (!acik || !firma) return null;

  const aktifSrc =
    (list.length ? list[idx % list.length] : undefined) || FALLBACK_DATAURL;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* max-h + flex ile mobilde taşma yerine içerik içinde scroll olsun */}
      <div
        className="max-w-5xl w-full max-h-[90vh] rounded-2xl bg-background shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            {firma.logo ? (
              <Image
                src={firma.logo}
                alt={firma.ad}
                width={40}
                height={40}
                className="rounded-lg object-contain border bg-white"
                quality={80}
                placeholder="blur"
                blurDataURL={BLUR_1PX}
                onError={(e) =>
                  ((e.currentTarget as unknown as HTMLImageElement).src =
                    FALLBACK_DATAURL)
                }
              />
            ) : (
              <div className="w-10 h-10 rounded-lg grid place-items-center border bg-muted/40">
                <Building2 className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold">{firma.ad}</h3>
              <p className="text-sm text-muted-foreground">{firma.sehir}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Galeri – tek aktif görsel + blur arka plan */}
        <div className="relative bg-black flex-shrink-0">
          <div
            className="relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Blur arka plan (siyah kenar yerine) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url("${aktifSrc}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(24px)",
                opacity: 0.5,
              }}
              aria-hidden="true"
            />
            {/* Asıl görsel */}
            <Image
              src={aktifSrc}
              alt={firma.ad}
              fill
              sizes="100vw"
              quality={85}
              placeholder="blur"
              blurDataURL={BLUR_1PX}
              className="relative z-10 object-contain"
              onError={(e) =>
                ((e.currentTarget as unknown as HTMLImageElement).src =
                  FALLBACK_DATAURL)
              }
            />

            {list.length > 1 && (
              <>
                {/* Sol ok */}
                <button
                  type="button"
                  aria-label="Önceki"
                  onClick={() => go(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 text-white hover:bg-black/90 shadow z-20 pointer-events-auto"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Sağ ok */}
                <button
                  type="button"
                  aria-label="Sonraki"
                  onClick={() => go(1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 text-white hover:bg-black/90 shadow z-20 pointer-events-auto"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Noktalar */}
                <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2 z-20">
                  {list.map((_, i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i === idx ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bilgi alanı – fazla metin olursa burada dikey scroll olur */}
        <div className="p-4 grid md:grid-cols-3 gap-4 flex-1 overflow-y-auto">
          <div className="md:col-span-2 space-y-3">
            <SectionHeading
              title="Hakkında"
              subtitle="Kısa açıklama"
              icon={Globe}
            />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {firma.aciklama}
            </p>

            <div className="pt-2">
              <SectionHeading title="Kategoriler" icon={Building2} />
              <div className="flex flex-wrap gap-2">
                {firma.kategori.map((k) => (
                  <Badge key={k} variant="secondary">
                    {k}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <SectionHeading
              title="Konum"
              subtitle="Adres ve harita"
              icon={MapPin}
            />
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">{firma.adres}</p>
              <a href={buildMapUrl(firma)} target="_blank" rel="noreferrer">
                <Button className="w-full">Haritada Aç</Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* no-scrollbar sınıfı için stil (TabsList'te de kullanılıyor) */}
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}

/* ---------------- Logo Marquee (tekilleştirilmiş) ---------------- */
function Marquee({ items = [] as string[] }) {
  const unique = React.useMemo(() => Array.from(new Set(items)), [items]);
  const reel = React.useMemo(() => [...unique, ...unique], [unique]);
  return (
    <div className="relative overflow-hidden">
      <div className="marquee-track flex gap-8 will-change-transform">
        {reel.map((src, i) => (
          <Image
            key={`${src}-${i}`}
            src={src}
            alt="logo"
            width={40}
            height={40}
            className="h-10 w-10 rounded-lg object-contain border bg-white shrink-0"
            quality={80}
            placeholder="blur"
            blurDataURL={BLUR_1PX}
            onError={(e) =>
              ((e.currentTarget as unknown as HTMLImageElement).src =
                FALLBACK_DATAURL)
            }
          />
        ))}
      </div>
      <style>{`
        .marquee-track { animation: marquee 26s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
      `}</style>
    </div>
  );
}

/* ---------------- Kategori Kovaları (genel başlıklar) ---------------- */
const BUCKETS = [
  {
    key: "yiyecek",
    title: "Yiyecek & Tatlı",
    match: (k: string, ad: string) =>
      ["yemek", "kafe", "restoran", "tatlı", "pastane", "kahve", "fast food", "pide", "pilav"].some(
        (s) => inc(k, s) || inc(ad, s)
      ),
  },
  {
    key: "market",
    title: "Market",
    match: (k: string, ad: string) =>
      ["market", "bakkal"].some((s) => inc(k, s) || inc(ad, s)),
  },
  {
    key: "giyim",
    title: "Giyim",
    match: (k: string, ad: string) =>
      ["giyim", "kıyafet", "butik", "ayakkabı"].some(
        (s) => inc(k, s) || inc(ad, s)
      ),
  },
  {
    key: "konaklama",
    title: "Konaklama",
    match: (k: string, ad: string) =>
      ["otel", "pansiyon", "konaklama", "apart"].some(
        (s) => inc(k, s) || inc(ad, s)
      ),
  },
  {
    key: "egitim",
    title: "Eğitim & Kitap",
    match: (k: string, ad: string) =>
      ["çalışma alanı", "kitabevi", "kırtasiye", "kütüphane", "ders"].some(
        (s) => inc(k, s) || inc(ad, s)
      ),
  },
  {
    key: "guzellik",
    title: "Güzellik & Sağlık",
    match: (k: string, ad: string) =>
      ["kuaför", "berber", "güzellik", "estetik", "diş", "diyet"].some(
        (s) => inc(k, s) || inc(ad, s)
      ),
  },
  {
    key: "pet",
    title: "Pet Shop",
    match: (k: string, ad: string) =>
      ["pet", "veteriner"].some((s) => inc(k, s) || inc(ad, s)),
  },
  {
    key: "servis",
    title: "Servis & Teknik",
    match: (k: string, ad: string) =>
      ["teknik servis", "elektronik", "oto", "tamir", "fotoğrafçı"].some(
        (s) => inc(k, s) || inc(ad, s)
      ),
  },
  {
    key: "spor",
    title: "Spor & Aktivite",
    match: (k: string, ad: string) =>
      ["spor", "fitness", "salon", "yüzme"].some(
        (s) => inc(k, s) || inc(ad, s)
      ),
  },
  {
    key: "diger",
    title: "Diğer",
    match: () => true,
  },
] as const;

function inc(txt: string | undefined, needle: string) {
  return (txt ?? "").toLowerCase().includes(needle);
}

/* ---------------- Sayfa ---------------- */
export default function App() {
  const [arama, setArama] = React.useState<string>("");
  const [aktifBucket, setAktifBucket] = React.useState<string>("hepsi");
  const [secili, setSecili] = React.useState<Firma | null>(null);

  // Veri
  const [firmalar, setFirmalar] = React.useState<Firma[]>(DEFAULT_VERI);
  React.useEffect(() => {
    fetch("/firma.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: Firma[]) =>
        Array.isArray(d) && d.length ? setFirmalar(d as Firma[]) : null
      )
      .catch(() => {});
  }, []);

  // Filtreleme (şehir filtresi KALDIRILDI)
  const baseFiltered = React.useMemo(() => {
    const q = arama.trim().toLowerCase();
    return firmalar.filter((f) => {
      const matchQ =
        !q ||
        f.ad.toLowerCase().includes(q) ||
        f.sehir.toLowerCase().includes(q) ||
        f.kategori.some((k) => k.toLowerCase().includes(q)) ||
        f.aciklama.toLowerCase().includes(q);
      return matchQ;
    });
  }, [arama, firmalar]);

  const bucketFiltered = React.useMemo(() => {
    if (aktifBucket === "hepsi") return baseFiltered;
    const bucket =
      BUCKETS.find((b) => b.key === aktifBucket) ??
      BUCKETS[BUCKETS.length - 1];
    return baseFiltered.filter((f) => {
      const name = f.ad;
      return f.kategori.some((k) =>
        bucket.match(k.toLowerCase(), name.toLowerCase())
      );
    });
  }, [aktifBucket, baseFiltered]);

  const logoList = React.useMemo(() => {
    const raw = firmalar
      .map((f) => f.logo || (f.gorseller?.[0] ?? ""))
      .filter(Boolean) as string[];
    return raw;
  }, [firmalar]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur pt-[env(safe-area-inset-top)]">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UsersRound className="w-5 h-5" />
            <span className="font-semibold">Öğrencinin Gücü</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#amac" className="hover:text-foreground">
              Amaç
            </a>
            <a href="#kurucu" className="hover:text-foreground">
              Kurucular
            </a>
            <a href="#firmalar" className="hover:text-foreground">
              Firmalar
            </a>
            <a href="#iletisim" className="hover:text-foreground">
              İletişim
            </a>
          </nav>
          <a href="#firmalar">
            <Button>Firmalara Bak</Button>
          </a>
        </div>
      </header>

      {/* Amaç */}
      <section id="amac" className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-3xl md:text-4xl font-bold"
            >
              Öğrencinin Gücü: yalın ve güvenilir bir{" "}
              <span className="underline underline-offset-4">
                firma rehberi
              </span>
            </motion.h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Kuruluşumuz firma ve dükkanlarla anlaşarak öğrencilere özel
              indirimler uygular. Konum ve görselleriyle hızlıca fikir
              edinmenizi sağlar. Hesap açma derdi yok; haber akışında gezin ve
              size uygun yeri keşfedin. Anlaşmalı firmalara indirim kartınızı
              göstermeniz yeterlidir.
            </p>
            <div className="mt-6">
              <a href="#firmalar">
                <Button size="lg">Hemen Keşfet</Button>
              </a>
            </div>
          </div>
          <div className="md:pl-8">
            <div className="rounded-2xl border p-4 bg-muted/40">
              <SectionHeading
                title="Sitenin Amacı"
                subtitle="Kısa özet"
                icon={Globe}
              />
              <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                <li>
                  <strong>Öğrenci indirimleri</strong> için temel altyapı.
                </li>
                <li>
                  Firmalara <strong>temiz görünürlük</strong> ve basit reklam
                  alanı.
                </li>
                <li>
                  Öğrencilere <strong>kolay erişilebilir</strong> firma bilgisi.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Hakkımızda */}
      <section id="kurucu" className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <SectionHeading
            title="Bu Siteyi Kimler Kurdu?"
            subtitle="Kısa tanıtım"
            icon={UsersRound}
          />
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                <strong>
                  Farklı alanlarda uzman genç girişimcilerden oluşan ekibimiz
                </strong>
                , teknoloji ve yaratıcılığı bir araya getirerek{" "}
                <strong>ogrenciningucu.com</strong> için yenilikçi çözümler
                geliştiriyor.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Logo akışı */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <SectionHeading
            title="Anlaşmalı Firmalardan Bazıları"
            subtitle="Akıcı logo akışı"
          />
          <Marquee items={logoList} />
        </div>
      </section>

      {/* Firmalar + Kategori Sekmeleri */}
      <section id="firmalar">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <SectionHeading
            title="Firmaları Keşfet"
            subtitle="Arayın, filtreleyin, inceleyin"
            icon={Search}
          />

          <Tabs
            value={aktifBucket}
            onValueChange={setAktifBucket}
            className="w-full"
          >
            <TabsList className="mb-4 overflow-x-auto no-scrollbar whitespace-nowrap max-w-full">
              <TabsTrigger value="hepsi">Tümü</TabsTrigger>
              {BUCKETS.map((b) => (
                <TabsTrigger key={b.key} value={b.key}>
                  {b.title}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={aktifBucket} className="space-y-6">
              <FiltreBar arama={arama} setArama={setArama} />
              <FirmaGrid data={bucketFiltered} onOpen={(f) => setSecili(f)} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* İletişim */}
      <section id="iletisim" className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <SectionHeading
            title="İletişim"
            subtitle="Sorular ve iş birlikleri için"
            icon={UsersRound}
          />
          <div className="text-sm">
            <p className="mb-3">Bize e-posta ile ulaşın:</p>
            <a
              href="mailto:ogrenciningucu2@gmail.com"
              className="inline-flex items-center gap-2 font-medium hover:underline"
            >
              ogrenciningucu2@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              © {new Date().getFullYear()} Öğrencinin Gücü — Basit ve faydalı
              bir firma rehberi
            </div>
            <div className="flex items-center gap-3">
              <a className="hover:underline" href="#kurucu">
                Hakkımızda
              </a>
              <a className="hover:underline" href="#firmalar">
                Firmalar
              </a>
              <a className="hover:underline" href="#amac">
                Amaç
              </a>
              <a className="hover:underline" href="#iletisim">
                İletişim
              </a>
            </div>
          </div>
        </div>
      </footer>

      <FirmaDetayModal
        acik={!!secili}
        firma={secili}
        onClose={() => setSecili(null)}
      />
    </div>
  );
}

/* ---------------- Filtre Bar ---------------- */
function FiltreBar({
  arama,
  setArama,
}: {
  arama: string;
  setArama: SetState<string>;
}) {
  return (
    <div className="grid md:grid-cols-[minmax(0,1fr)] gap-3">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={arama}
          onChange={(e) => setArama(e.target.value)}
          placeholder="Ada veya şehre göre ara"
          className="pl-9 h-11"
        />
      </div>
    </div>
  );
}

/* ---------------- Grid ---------------- */
function FirmaGrid({
  data,
  onOpen,
}: {
  data: Firma[];
  onOpen: (f: Firma) => void;
}) {
  if (!data.length) {
    return (
      <div className="text-center text-muted-foreground py-16">
        Aramanızla eşleşen firma bulunamadı.
      </div>
    );
  }
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {data.map((f) => (
        <motion.div
          key={f.id}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <FirmaKarti firma={f} onOpen={onOpen} />
        </motion.div>
      ))}
    </div>
  );
}
