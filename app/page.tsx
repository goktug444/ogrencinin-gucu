'use client';

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Search, X, Building2, Globe, ImageIcon, UsersRound } from "lucide-react";
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

function FirmaKarti({ firma, onOpen }: { firma: Firma; onOpen: (f: Firma) => void }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onOpen(firma)}>
      <div className="aspect-video relative bg-muted">
        {firma.gorseller?.[0] ? (
          <Image
            src={firma.gorseller[0]}
            alt={firma.ad}
            fill
            className="object-cover"
            sizes="(min-width:1024px) 33vw, 100vw"
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
              className="rounded-xl object-cover border"
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

function FirmaDetayModal({
  acik,
  firma,
  onClose,
}: {
  acik: boolean;
  firma: Firma | null;
  onClose: () => void;
}) {
  if (!acik || !firma) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="max-w-3xl w-full rounded-2xl bg-background shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            {firma.logo ? (
              <Image src={firma.logo} alt={firma.ad} width={40} height={40} className="rounded-lg object-cover border" />
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
        <div className="w-full overflow-x-auto snap-x snap-mandatory no-scrollbar">
          <div className="flex w-full">
            {firma.gorseller.map((src, i) => (
              <div key={i} className="min-w-full snap-center">
                <Image
                  src={src}
                  alt={`${firma.ad} ${i + 1}`}
                  width={1200}
                  height={360}
                  className="w-full h-[260px] md:h-[360px] object-cover"
                  sizes="100vw"
                />
              </div>
            ))}
          </div>
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
              <a href={firma.konumUrl} target="_blank" rel="noreferrer">
                <Button className="w-full">Haritada Aç</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Marquee({ items = [] as string[] }) {
  const reel = React.useMemo(() => [...items, ...items, ...items], [items]);
  return (
    <div className="relative overflow-hidden">
      <div className="marquee-track flex gap-8 will-change-transform">
        {reel.map((src, i) => (
          <Image
            key={i}
            src={src}
            alt="logo"
            width={40}
            height={40}
            className="h-10 w-10 rounded-lg object-cover border shrink-0"
          />
        ))}
      </div>
      <style>{`
        .marquee-track { animation: marquee 24s linear infinite; }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

export default function App() {
  const [arama, setArama] = React.useState<string>("");
  const [sehir, setSehir] = React.useState<string>("Tümü");
  const [kategori, setKategori] = React.useState<string>("Tümü");
  const [secili, setSecili] = React.useState<Firma | null>(null);

  // Veriyi public/firma.json'dan çek (fallback: DEFAULT_VERI)
  const [firmalar, setFirmalar] = React.useState<Firma[]>(DEFAULT_VERI);
  React.useEffect(() => {
    fetch("/firma.json")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((d: Firma[]) => Array.isArray(d) && d.length ? setFirmalar(d) : null)
      .catch(() => { /* fallback DEFAULT_VERI ile devam */ });
  }, []);

  const sehirler = React.useMemo(
    () => ["Tümü", ...Array.from(new Set(firmalar.map((f) => f.sehir)))],
    [firmalar]
  );

  // Yeni kategoriler (veride olmasa bile listede görünsün)
  const EXTRA_KATS = ["Berber", "Güzellik Salonu", "Dişçi"];

  const kategoriler = React.useMemo(() => {
    const dyn = Array.from(new Set(firmalar.flatMap((f) => f.kategori)));
    for (const k of EXTRA_KATS) if (!dyn.includes(k)) dyn.push(k);
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

  const logoList = React.useMemo(
    () => firmalar.flatMap((f) => [f.logo, f.gorseller?.[0]].filter(Boolean) as string[]),
    [firmalar]
  );

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
              uygulamayı hedefler. konum ve görselleriyle
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
                {/* Son maddeyi başa aldım */}
                <li><strong>Öğrenci indirimleri</strong> için temel altyapı.</li>
                {/* Yeni cümle */}
                <li>Kuruluşumuz firma ve dükkanlarla antlaşarak <strong>öğrencilere özel indirimler</strong> uygulamayı hedefler.</li>
                <li>Firmalara <strong>temiz bir görünürlük</strong> ve reklam alanı sağlamak.</li>
                <li>Öğrencilere <strong>kolay erişilebilir</strong> firma bilgisi sunmak.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* KURUCU / HAKKIMIZDA KISA TANITIM */}
      <section id="kurucu" className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <SectionHeading title="Bu Siteyi Kimler Kurdu?" subtitle="Kısa tanıtım" icon={UsersRound} />
          <div className="grid md:grid-cols-3 gap-6">
            {[{
              ad: "Batuhan Tiktaş",
              gorev: "CEO",
              bio: "Vizyon ve iş birliğiyle öğrenci-firma köprüsünü büyütüyor.",
            }, {
              ad: "Batuhan Dinçer",
              gorev: "Kurucu",
              bio: "Ürün ve içerik stratejisini kurgulayıp uyguluyor.",
            }, {
              ad: "Burak Ergün",
              gorev: "Topluluk",
              bio: "Kocaeli’ndeki öğrenci geri bildirimlerini toplar ve paylaşır.",
            }].map((kisi, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-muted to-background grid place-items-center border">
                      <UsersRound className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold">{kisi.ad}</div>
                      <div className="text-xs text-muted-foreground">{kisi.gorev}</div>
                      <p className="text-sm text-muted-foreground mt-2">{kisi.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* LOGO MARQUEE – Akıcı görünüm */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <SectionHeading title="Anlaşmalı Firmalardan Bazıları" subtitle="Akıcı logo akışı" />
          <Marquee items={logoList} />
        </div>
      </section>

      {/* FİRMALAR – ARAMA & FİLTRE */}
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
                arama={arama}
                setArama={setArama}
                sehir={sehir}
                setSehir={setSehir}
                kategori={kategori}
                setKategori={setKategori}
                sehirler={sehirler}
                kategoriler={kategoriler}
              />
              <FirmaGrid data={filtreli} onOpen={(f) => setSecili(f)} />
            </TabsContent>
            <TabsContent value="kafe" className="space-y-6">
              <FiltreBar
                arama={arama}
                setArama={setArama}
                sehir={sehir}
                setSehir={setSehir}
                kategori={kategori}
                setKategori={setKategori}
                sehirler={sehirler}
                kategoriler={kategoriler}
              />
              <FirmaGrid
                data={filtreli.filter((f) => f.kategori.some((k) => ["Kafe", "Restoran", "Vegan"].includes(k)))}
                onOpen={(f) => setSecili(f)}
              />
            </TabsContent>
            <TabsContent value="calisma" className="space-y-6">
              <FiltreBar
                arama={arama}
                setArama={setArama}
                sehir={sehir}
                setSehir={setSehir}
                kategori={kategori}
                setKategori={setKategori}
                sehirler={sehirler}
                kategoriler={kategoriler}
              />
              <FirmaGrid
                data={filtreli.filter((f) => f.kategori.some((k) => ["Çalışma Alanı", "Kitabevi", "Kırtasiye"].includes(k)))}
                onOpen={(f) => setSecili(f)}
              />
            </TabsContent>
            <TabsContent value="spor" className="space-y-6">
              <FiltreBar
                arama={arama}
                setArama={setArama}
                sehir={sehir}
                setSehir={setSehir}
                kategori={kategori}
                setKategori={setKategori}
                sehirler={sehirler}
                kategoriler={kategoriler}
              />
              <FirmaGrid
                data={filtreli.filter((f) =>
                  f.kategori.some((k) =>
                    ["Spor Salonu", "Teknik Servis", "Elektronik", "Berber", "Güzellik Salonu", "Dişçi"].includes(k)
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
            <p className="mb-3">
              Bize e-posta ile ulaşın:
            </p>
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
            <div>
              © {new Date().getFullYear()} Öğrencinin Gücü — Basit ve faydalı bir firma rehberi
            </div>
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

function FiltreBar({
  arama,
  setArama,
  sehir,
  setSehir,
  kategori,
  setKategori,
  sehirler,
  kategoriler,
}: {
  arama: string;
  setArama: SetState<string>;
  sehir: string;
  setSehir: SetState<string>;
  kategori: string;
  setKategori: SetState<string>;
  sehirler: string[];
  kategoriler: string[];
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
        {sehirler.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <select
        className="h-11 rounded-md border bg-background px-3 text-sm"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
      >
        {kategoriler.map((k) => (
          <option key={k} value={k}>{k}</option>
        ))}
      </select>
    </div>
  );
}

function FirmaGrid({ data, onOpen }: { data: Firma[]; onOpen: (f: Firma) => void }) {
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
        <motion.div key={f.id} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <FirmaKarti firma={f} onOpen={onOpen} />
        </motion.div>
      ))}
    </div>
  );
}
