'use client';

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin, Search, X, Building2, Globe, ImageIcon, UsersRound,
  ChevronLeft, ChevronRight
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

function SectionHeading(
  { title, subtitle, icon: Icon }: { title: string; subtitle?: string; icon?: IconComponent }
) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-xl bg-muted">
        {Icon ? <Icon className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
      </div>
      <div>
        <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

/** Görsel hatasında şeffaf yer tutucu döner */
const FALLBACK_DATAURL =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675">
       <rect width="100%" height="100%" fill="#f3f4f6"/>
       <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
             fill="#9ca3af" font-family="Arial" font-size="22">Görsel yüklenemedi</text>
     </svg>`
  );

/* ----------------------------- Kart Bileşeni ----------------------------- */
function FirmaKarti({ firma, onOpen }: { firma: Firma; onOpen: (f: Firma) => void }) {
  const firstImg = (firma.gorseller || []).filter(Boolean)[0];

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onOpen(firma)}>
      <div className="aspect-video relative bg-muted">
        {firstImg ? (
          <Image
            src={firstImg}
            alt={firma.ad}
            fill
            // 3 sütun (lg), 2 sütun (sm) ve tek sütun (xs) için gerçekçi sizes
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            quality={90}
            className="object-cover"
            onError={(e) => ((e.currentTarget as unknown as HTMLImageElement).src = FALLBACK_DATAURL)}
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
              quality={90}
              onError={(e) => ((e.currentTarget as unknown as HTMLImageElement).src = FALLBACK_DATAURL)}
            />
          ) : (
            <div className="w-10 h-10 rounded-xl grid place-items-center border bg-muted/40">
              <Building2 className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold truncate">{firma.ad}</h3>
              <span className="text-xs text-muted-foreground shrink-0">{firma.sehir}</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{firma.aciklama}</p>
            <div className="flex items-center gap-2 text-sm mt-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="truncate" title={firma.adres}>{firma.adres}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ----------------------------- Harita URL ----------------------------- */
function buildMapUrl(f: Firma) {
  if (f.konumUrl?.startsWith("place_id:")) {
    const pid = f.konumUrl.split("place_id:")[1].trim();
    return `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(pid)}`;
  }
  if (f.konumUrl?.startsWith("http")) return f.konumUrl;
  const q = `${f.ad} ${f.adres || ""} ${f.sehir || ""}`.trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

/* ----------------------------- Modal + Galeri ----------------------------- */
function FirmaDetayModal({
  acik, firma, onClose,
}: { acik: boolean; firma: Firma | null; onClose: () => void }) {
  const list = React.useMemo(() => (firma?.gorseller || []).filter(Boolean), [firma]);
  const ref = React.useRef<HTMLDivElement>(null);
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    if (!acik) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acik, idx, list.length]);

  function go(delta: number) {
    if (!list.length || !ref.current) return;
    const next = (idx + delta + list.length) % list.length;
    setIdx(next);
    ref.current.scrollTo({ left: next * ref.current.clientWidth, behavior: "smooth" });
  }

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: true });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  if (!acik || !firma) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="max-w-5xl w-full rounded-2xl bg-background shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            {firma.logo ? (
              <Image
                src={firma.logo}
                alt={firma.ad}
                width={40}
                height={40}
                className="rounded-lg object-contain border bg-white"
                quality={90}
                onError={(e) => ((e.currentTarget as unknown as HTMLImageElement).src = FALLBACK_DATAURL)}
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

        {/* Görsel Galeri */}
        <div className="relative bg-black">
          <div ref={ref} className="w-full overflow-x-auto snap-x snap-mandatory no-scrollbar" style={{ scrollBehavior: 'smooth' }}>
            <div className="flex w-full">
              {list.length ? list.map((src, i) => (
                <div key={i} className="min-w-full snap-center grid place-items-center bg-black">
                  <Image
                    src={src}
                    alt={`${firma.ad} ${i + 1}`}
                    width={1600}
                    height={900}
                    sizes="100vw"
                    quality={92}
                    // Büyütürken netlik korunsun (contain + max yükseklik)
                    className="w-full h-[260px] md:h-[420px] object-contain bg-black"
                    onError={(e) => ((e.currentTarget as unknown as HTMLImageElement).src = FALLBACK_DATAURL)}
                  />
                </div>
              )) : (
                <div className="min-w-full snap-center grid place-items-center bg-black">
                  <Image
                    src={FALLBACK_DATAURL}
                    alt="Görsel yok"
                    width={1600}
                    height={900}
                    className="w-full h-[260px] md:h-[420px] object-contain"
                    sizes="100vw"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sol/Sağ butonları + noktalar */}
          {list.length > 1 && (
            <>
              <button
                aria-label="Önceki"
                onClick={() => go(-1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                aria-label="Sonraki"
                onClick={() => go(1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-2 inset-x-0 flex justify-center gap-2">
                {list.map((_, i) => (
                  <span key={i} className={`w-2 h-2 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'}`} />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-4 grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-3">
            <SectionHeading title="Hakkında" subtitle="Kısa açıklama" icon={Globe} />
            <p className="text-sm leading-relaxed text-muted-foreground">{firma.aciklama}</p>

            <div className="pt-2">
              <SectionHeading title="Kategoriler" icon={Building2} />
              <div className="flex flex-wrap gap-2">
                {firma.kategori.map((k) => (
                  <Badge key={k} variant="secondary">{k}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <SectionHeading title="Konum" subtitle="Adres ve harita" icon={MapPin} />
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">{firma.adres}</p>
              <a href={buildMapUrl(firma)} target="_blank" rel="noreferrer">
                <Button className="w-full">Haritada Aç</Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}

/* ----------------------------- Tekilleştirilmiş Marquee ----------------------------- */
function Marquee({ items = [] as string[] }) {
  // Önce logolar/ilk foto listesi → tekilleştir (aynı src bir kez)
  const unique = React.useMemo(() => Array.from(new Set(items)), [items]);
  // Akış için 2x kopya (sonsuz döngüde tekrar algılanmaz)
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
            quality={90}
            onError={(e) => ((e.currentTarget as unknown as HTMLImageElement).src = FALLBACK_DATAURL)}
          />
        ))}
      </div>
      <style>{`
        .marquee-track { animation: marquee 26s linear infinite; }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

/* ----------------------------- Sayfa ----------------------------- */
export default function App() {
  const [arama, setArama] = React.useState<string>("");
  const [sehir, setSehir] = React.useState<string>("Tümü");
  const [kategori, setKategori] = React.useState<string>("Tümü");
  const [secili, setSecili] = React.useState<Firma | null>(null);

  // Veriyi public/firma.json'dan çek (fallback: DEFAULT_VERI)
  const [firmalar, setFirmalar] = React.useState<Firma[]>(DEFAULT_VERI);
  React.useEffect(() => {
    fetch("/firma.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: Firma[]) => (Array.isArray(d) && d.length ? setFirmalar(d) : null))
      .catch(() => {});
  }, []);

  const sehirler = React.useMemo(
    () => ["Tümü", ...Array.from(new Set(firmalar.map((f) => f.sehir)))],
    [firmalar]
  );

  // Master kategori listesi (eski + yeni)
  const MASTER_KATS = [
    "Yemek","Kafe","Restoran","Vegan","Çalışma Alanı","Kitabevi","Kırtasiye",
    "Spor Salonu","Teknik Servis","Elektronik","Berber","Kuaför","Güzellik Salonu",
    "Dişçi","Pet Shop","Çiçekçi","Oto Kuaför","Oto Kiralama","Fotoğrafçı"
  ];

  const kategoriler = React.useMemo(() => {
    const dyn = Array.from(new Set(firmalar.flatMap((f) => f.kategori)));
    MASTER_KATS.forEach(k => { if (!dyn.includes(k)) dyn.push(k); });
    return ["Tümü", ...dyn];
  }, [firmalar]);

  const filtreli = React.useMemo(() => {
    return firmalar.filter((f) => {
      const q = arama.trim().toLowerCase();
      const matchQ =
        !q ||
        f.ad.toLowerCase().includes(q) ||
        f.sehir.toLowerCase().includes(q) ||
        f.kategori.some((k) => k.toLowerCase().includes(q)) ||
        f.aciklama.toLowerCase().includes(q);
      const matchSehir = sehir === "Tümü" || f.sehir === sehir;
      const matchKat = kategori === "Tümü" || f.kategori.includes(kategori);
      return matchQ && matchSehir && matchKat;
    });
  }, [arama, sehir, kategori, firmalar]);

  // Marquee için: logo varsa onu, yoksa ilk foto; sonra tekilleştirilecek
  const logoList = React.useMemo(() => {
    const raw = firmalar.map((f) => f.logo || (f.gorseller?.[0] ?? "")).filter(Boolean) as string[];
    return raw;
  }, [firmalar]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ÜST NAV */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur pt-[env(safe-area-inset-top)]">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UsersRound className="w-5 h-5" />
            <span className="font-semibold">Öğrencinin Gücü</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#amac" className="hover:text-foreground">Amaç</a>
            <a href="#kurucu" className="hover:text-foreground">Kurucular</a>
            <a href="#firmalar" className="hover:text-foreground">Firmalar</a>
            <a href="#iletisim" className="hover:text-foreground">İletişim</a>
          </nav>
          <a href="#firmalar">
            <Button>Firmalara Bak</Button>
          </a>
        </div>
      </header>

      {/* HERO / AMAÇ */}
      <section id="amac" className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-3xl md:text-4xl font-bold"
            >
              Öğrencinin Gücü: yalın ve güvenilir bir <span className="underline underline-offset-4">firma rehberi</span>
            </motion.h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Kuruluşumuz firma ve dükkanlarla antlaşarak öğrencilere özel indirimler
              uygulamayı hedefler. Konum ve görselleriyle
              hızlıca fikir edinmenizi sağlar. Hesap açma derdi yok, haber sitesi akışında
              gezin ve size uygun yeri keşfedin.
            </p>
            <div className="mt-6">
              <a href="#firmalar"><Button size="lg">Hemen Keşfet</Button></a>
            </div>
          </div>
          <div className="md:pl-8">
            <div className="rounded-2xl border p-4 bg-muted/40">
              <SectionHeading title="Sitenin Amacı" subtitle="Kısa özet" icon={Globe} />
              <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                <li><strong>Öğrenci indirimleri</strong> için temel altyapı.</li>
                <li>Kuruluşumuz firma ve dükkanlarla antlaşarak <strong>öğrencilere özel indirimler</strong> uygulamayı hedefler.</li>
                <li>Firmalara <strong>temiz bir görünürlük</strong> ve reklam alanı sağlamak.</li>
                <li>Öğrencilere <strong>kolay erişilebilir</strong> firma bilgisi sunmak.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* KURUCU / HAKKIMIZDA */}
      <section id="kurucu" className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <SectionHeading title="Bu Siteyi Kimler Kurdu?" subtitle="Kısa tanıtım" icon={UsersRound} />
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                <strong>Farklı alanlarda uzman genç girişimcilerden oluşan ekibimiz</strong>, teknoloji ve yaratıcılığı bir araya getirerek
                <strong> ogrenciningucu.com</strong> için yenilikçi çözümler geliştiriyor.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* LOGO MARQUEE */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <SectionHeading title="Anlaşmalı Firmalardan Bazıları" subtitle="Akıcı logo akışı" />
          <Marquee items={logoList} />
        </div>
      </section>

      {/* FİRMALAR */}
      <section id="firmalar">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <SectionHeading title="Firmaları Keşfet" subtitle="Arayın, filtreleyin, inceleyin" icon={Search} />

          <Tabs defaultValue="hepsi" className="w-full">
            <TabsList className="mb-4 overflow-x-auto no-scrollbar whitespace-nowrap">
              <TabsTrigger value="hepsi">Tümü</TabsTrigger>
              <TabsTrigger value="kafe">Kafe & Yemek</TabsTrigger>
              <TabsTrigger value="calisma">Çalışma & Kitap</TabsTrigger>
              <TabsTrigger value="spor">Spor & Servis</TabsTrigger>
            </TabsList>
            <TabsContent value="hepsi" className="space-y-6">
              <FiltreBar
                arama={arama} setArama={setArama}
                sehir={sehir} setSehir={setSehir}
                kategori={kategori} setKategori={setKategori}
                sehirler={sehirler} kategoriler={kategoriler}
              />
              <FirmaGrid data={filtreli} onOpen={(f) => setSecili(f)} />
            </TabsContent>
            <TabsContent value="kafe" className="space-y-6">
              <FiltreBar
                arama={arama} setArama={setArama}
                sehir={sehir} setSehir={setSehir}
                kategori={kategori} setKategori={setKategori}
                sehirler={sehirler} kategoriler={kategoriler}
              />
              <FirmaGrid
                data={filtreli.filter((f) =>
                  f.kategori.some((k) => ["Kafe", "Restoran", "Vegan", "Yemek"].includes(k))
                )}
                onOpen={(f) => setSecili(f)}
              />
            </TabsContent>
            <TabsContent value="calisma" className="space-y-6">
              <FiltreBar
                arama={arama} setArama={setArama}
                sehir={sehir} setSehir={setSehir}
                kategori={kategori} setKategori={setKategori}
                sehirler={sehirler} kategoriler={kategoriler}
              />
              <FirmaGrid
                data={filtreli.filter((f) =>
                  f.kategori.some((k) => ["Çalışma Alanı", "Kitabevi", "Kırtasiye"].includes(k))
                )}
                onOpen={(f) => setSecili(f)}
              />
            </TabsContent>
            <TabsContent value="spor" className="space-y-6">
              <FiltreBar
                arama={arama} setArama={setArama}
                sehir={sehir} setSehir={setSehir}
                kategori={kategori} setKategori={setKategori}
                sehirler={sehirler} kategoriler={kategoriler}
              />
              <FirmaGrid
                data={filtreli.filter((f) =>
                  f.kategori.some((k) =>
                    ["Spor Salonu", "Teknik Servis", "Elektronik", "Berber", "Kuaför", "Güzellik Salonu", "Dişçi", "Pet Shop", "Çiçekçi"].includes(k)
                  )
                )}
                onOpen={(f) => setSecili(f)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* İLETİŞİM */}
      <section id="iletisim" className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <SectionHeading title="İletişim" subtitle="Sorular ve iş birlikleri için" icon={UsersRound} />
          <div className="text-sm">
            <p className="mb-3">Bize e-posta ile ulaşın:</p>
            <a href="mailto:ogrenciningucu2@gmail.com" className="inline-flex items-center gap-2 font-medium hover:underline">
              ogrenciningucu2@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* ALT BİLGİ */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>© {new Date().getFullYear()} Öğrencinin Gücü — Basit ve faydalı bir firma rehberi</div>
            <div className="flex items-center gap-3">
              <a className="hover:underline" href="#kurucu">Hakkımızda</a>
              <a className="hover:underline" href="#firmalar">Firmalar</a>
              <a className="hover:underline" href="#amac">Amaç</a>
              <a className="hover:underline" href="#iletisim">İletişim</a>
            </div>
          </div>
        </div>
      </footer>

      <FirmaDetayModal acik={!!secili} firma={secili} onClose={() => setSecili(null)} />
    </div>
  );
}

/* ----------------------------- Filtre Bar ----------------------------- */
function FiltreBar({
  arama, setArama, sehir, setSehir, kategori, setKategori, sehirler, kategoriler,
}: {
  arama: string; setArama: SetState<string>;
  sehir: string; setSehir: SetState<string>;
  kategori: string; setKategori: SetState<string>;
  sehirler: string[]; kategoriler: string[];
}) {
  return (
    <div className="grid md:grid-cols-4 gap-3">
      <div className="md:col-span-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            placeholder="Ada, şehre veya kategoriye göre ara"
            className="pl-9 h-11"
          />
        </div>
      </div>
      <select
        className="h-11 rounded-md border bg-background px-3 text-sm"
        value={sehir}
        onChange={(e) => setSehir(e.target.value)}
      >
        {sehirler.map((s) => (<option key={s} value={s}>{s}</option>))}
      </select>
      <select
        className="h-11 rounded-md border bg-background px-3 text-sm"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
      >
        {kategoriler.map((k) => (<option key={k} value={k}>{k}</option>))}
      </select>
    </div>
  );
}

/* ----------------------------- Grid ----------------------------- */
function FirmaGrid({ data, onOpen }: { data: Firma[]; onOpen: (f: Firma) => void }) {
  if (!data.length) {
    return <div className="text-center text-muted-foreground py-16">Aramanızla eşleşen firma bulunamadı.</div>;
  }
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {data.map((f) => (
        <motion.div key={f.id} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <FirmaKarti firma={f} onOpen={onOpen} />
        </motion.div>
      ))}
    </div>
  );
}
