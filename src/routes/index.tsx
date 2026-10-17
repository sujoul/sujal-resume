import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight, BriefcaseBusiness, Camera, ChevronLeft, ChevronRight, GraduationCap, Mail, Menu, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "@/components/platform-icon";
import { getPublishedPortfolio, type JourneyEntry, type MediaItem } from "@/lib/portfolio-data";
import { BRAND, CONTACT_EMAIL, FALLBACK_JOURNEY, MEMORY_PLACEHOLDERS, NAV_ITEMS, PROJECTS, SOCIAL_LINKS } from "@/lib/site-content";
import heroVisual from "@/assets/developer-visual.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Sujal's Journey — SD Infotech" },
    { name: "description", content: "A personal journey album and professional portfolio by Sujal—memories, education, practical web work, and the story behind SD Infotech." },
    { property: "og:title", content: "Sujal's Journey — SD Infotech" },
    { property: "og:description", content: "Memories, milestones, and practical web work from Sujal's continuing journey." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function useJourneyMotion() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("");
  useEffect(() => {
    const update = () => {
      const available = document.documentElement.scrollHeight - innerHeight;
      setScrolled(scrollY > 30);
      setProgress(available > 0 ? scrollY / available : 0);
      const profile = document.querySelector<HTMLElement>(".profile-orbit");
      if (profile) {
        const album = document.getElementById("album");
        const rect = album?.getBoundingClientRect();
        const travel = rect ? Math.max(0, Math.min(1, (innerHeight - rect.top) / Math.max(rect.height, 1))) : 0;
        profile.style.setProperty("--profile-travel", String(travel));
      }
    };
    update(); addEventListener("scroll", update, { passive: true });
    const reveal = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")), { threshold: .08 });
    document.querySelectorAll(".reveal").forEach((element) => reveal.observe(element));
    const sections = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)), { rootMargin: "-30% 0px -58%" });
    NAV_ITEMS.forEach(({ id }) => { const element = document.getElementById(id); if (element) sections.observe(element); });
    return () => { removeEventListener("scroll", update); reveal.disconnect(); sections.disconnect(); };
  }, []);
  return { scrolled, progress, active };
}

function Header({ scrolled, active }: { scrolled: boolean; active: string }) {
  const [open, setOpen] = useState(false);
  return <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
    <nav className="section-wrap nav-shell flex h-16 items-center justify-between rounded-md px-4 sm:px-6" aria-label="Main navigation">
      <a href="#top" className="font-display flex items-center gap-3 text-lg font-semibold"><span className="brand-mark">SD</span><span>{BRAND}</span></a>
      <div className="hidden gap-7 lg:flex">{NAV_ITEMS.map(item => <a key={item.id} href={`#${item.id}`} className={`nav-link text-sm ${active === item.id ? "active" : "text-muted-foreground"}`}>{item.label}</a>)}</div>
      <Button asChild variant="glass" size="sm" className="hidden lg:inline-flex"><a href={`mailto:${CONTACT_EMAIL}`}>Let's talk <ArrowUpRight /></a></Button>
      <Button variant="glass" size="icon" className="lg:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(value => !value)}>{open ? <X /> : <Menu />}</Button>
    </nav>
    {open && <nav className="section-wrap surface-glass mt-2 grid rounded-md p-3 lg:hidden" aria-label="Mobile navigation">{NAV_ITEMS.map(item => <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)} className="rounded-sm px-4 py-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">{item.label}</a>)}</nav>}
  </header>;
}

function SectionTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <div className="reveal mb-12 md:mb-16"><p className="section-kicker"><span className="eyebrow-line" /> {eyebrow}</p><h2 className="section-heading mt-5 max-w-4xl">{title}</h2>{copy && <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">{copy}</p>}</div>;
}

function MemoryPlaceholder({ item, index }: { item: typeof MEMORY_PLACEHOLDERS[number]; index: number }) {
  return <><div className="memory-placeholder"><Camera /><span>Memory {String(index + 1).padStart(2, "0")}</span></div><div className="memory-caption"><span>{item.title}</span><p>{item.caption}</p></div></>;
}

function JourneyCarousel({ album, urls }: { album: MediaItem[]; urls: Record<string, string> }) {
  const slides = album.length ? album : MEMORY_PLACEHOLDERS;
  const [activeIndex, setActiveIndex] = useState(0);
  const dragStart = useRef<number | null>(null);
  const dragDistance = useRef(0);
  const goTo = useCallback((next: number) => setActiveIndex(Math.max(0, Math.min(slides.length - 1, next))), [slides.length]);
  useEffect(() => { if (activeIndex >= slides.length) setActiveIndex(Math.max(0, slides.length - 1)); }, [activeIndex, slides.length]);
  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    dragStart.current = event.clientX;
    dragDistance.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    if (dragStart.current === null) return;
    dragDistance.current = event.clientX - dragStart.current;
  }
  function pointerUp(event: PointerEvent<HTMLDivElement>) {
    if (dragStart.current === null) return;
    const distance = event.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(distance) > 45) goTo(activeIndex + (distance < 0 ? 1 : -1));
  }
  return <div className="journey-carousel" aria-roledescription="carousel" aria-label="Journey photo album">
    <div className="carousel-viewport" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={() => { dragStart.current = null; }}>
      <div className="carousel-track" style={{ "--active-index": activeIndex } as CSSProperties}>
        {slides.map((entry, index) => {
          const item = album.length ? entry as MediaItem : null;
          const placeholder = album.length ? null : entry as typeof MEMORY_PLACEHOLDERS[number];
          const distance = Math.abs(index - activeIndex);
          return <article key={item?.id || placeholder?.title} className={`memory-card carousel-slide ${index === activeIndex ? "is-active" : ""}`} aria-hidden={distance > 1} onClick={() => goTo(index)}>
            {item ? urls[item.id] ? item.media_type === "video" ? <video src={urls[item.id]} controls={index === activeIndex} preload="metadata" aria-label={item.alt_text || item.title} /> : <img src={urls[item.id]} alt={item.alt_text || item.title} loading={index === 0 ? "eager" : "lazy"} draggable={false} /> : <div className="memory-placeholder"><Camera /><span>Preparing memory</span></div> : placeholder ? <MemoryPlaceholder item={placeholder} index={index} /> : null}
            {item && <div className="memory-caption"><span>{item.date_label || item.location || `Memory ${index + 1}`}</span><p>{item.caption || item.title}</p></div>}
          </article>;
        })}
      </div>
    </div>
    {slides.length > 1 && <div className="carousel-controls"><Button variant="outline" size="icon" aria-label="Previous memory" disabled={activeIndex === 0} onClick={() => goTo(activeIndex - 1)}><ChevronLeft /></Button><div className="carousel-dots" aria-label={`Memory ${activeIndex + 1} of ${slides.length}`}>{slides.map((_, index) => <button key={index} type="button" className={index === activeIndex ? "active" : ""} aria-label={`Show memory ${index + 1}`} aria-current={index === activeIndex ? "true" : undefined} onClick={() => goTo(index)} />)}</div><Button variant="outline" size="icon" aria-label="Next memory" disabled={activeIndex === slides.length - 1} onClick={() => goTo(activeIndex + 1)}><ChevronRight /></Button></div>}
  </div>;
}

function ProjectVisual({ theme }: { theme: string }) {
  return <div className={`project-visual ${theme}`}><div className="browser-frame"><div className="browser-bar"><i /><i /><i /></div><div className="browser-scene"><span /><strong>{theme === "store" ? "A considered storefront." : theme === "barber" ? "A sharper local presence." : "A story with purpose."}</strong><small>Concept preview</small></div></div></div>;
}

function Index() {
  const { scrolled, progress, active } = useJourneyMotion();
  const [journey, setJourney] = useState<JourneyEntry[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  useEffect(() => {
    getPublishedPortfolio().then(async data => {
      setJourney(data.journey); setMedia(data.media);
      const pairs = await Promise.all(data.media.map(async item => {
        if (!item.storage_path) return [item.id, item.external_url || ""] as const;
        const { data: signed } = await import("@/integrations/supabase/client").then(({ supabase }) => supabase.storage.from("journey-media").createSignedUrl(item.storage_path as string, 3600));
        return [item.id, signed?.signedUrl || ""] as const;
      }));
      setUrls(Object.fromEntries(pairs));
    }).catch(() => undefined);
  }, []);
  const timeline = journey.length ? journey : FALLBACK_JOURNEY;
  const profile = media.find(item => item.is_profile_photo && item.media_type === "image");
  const album = useMemo(() => media, [media]);

  useEffect(() => {
    const portraitUrl = profile ? urls[profile.id] : undefined;
    const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!icon) return;
    icon.href = "/site-icon.svg";
    icon.type = "image/svg+xml";
    if (!portraitUrl) return;

    let cancelled = false;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 96;
        const context = canvas.getContext("2d");
        if (!context) return;
        const crop = Math.min(image.naturalWidth, image.naturalHeight);
        const x = (image.naturalWidth - crop) / 2;
        const y = Math.max(0, (image.naturalHeight - crop) * .24);
        context.fillStyle = "#edf5ff";
        context.fillRect(0, 0, 96, 96);
        context.beginPath();
        context.arc(48, 48, 46, 0, Math.PI * 2);
        context.clip();
        context.drawImage(image, x, y, crop, crop, 2, 2, 92, 92);
        icon.href = canvas.toDataURL("image/png");
        icon.type = "image/png";
      } catch {
        // Keep the light placeholder when an external photo disallows canvas access.
      }
    };
    image.src = portraitUrl;
    return () => { cancelled = true; };
  }, [profile?.id, urls]);

  return <div className="site-shell" id="top">
    <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />
    <Header scrolled={scrolled} active={active} />
    <main>
      <section className="journey-hero" aria-labelledby="hero-title">
        <img src={heroVisual} alt="Layered digital interfaces representing Sujal's web-building journey" className="hero-art" fetchPriority="high" />
        <div className="hero-vignette" />
         <div className="section-wrap hero-content relative z-10 pt-36 pb-20 md:pt-44 md:pb-28">
          <p className="section-kicker mb-7">Personal journey · Professional direction</p>
          <h1 id="hero-title" className="hero-title max-w-5xl">I’m Sujal.<br /><span className="text-gradient">This is the journey behind the work.</span></h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">A growing album of memories, education, practical web projects, and the future I’m building through SD Infotech.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Button asChild variant="hero" size="hero"><a href="#album">Enter the album <ArrowDown /></a></Button><Button asChild variant="glass" size="hero"><a href={`mailto:${CONTACT_EMAIL}`}>Work with me <ArrowUpRight /></a></Button></div>
        </div>
        <div className="hero-index">01 <span /> Journey in progress</div>
      </section>

      <section id="story" className="section-wrap section-space scroll-mt-24"><div className="story-grid">
        <div><SectionTitle eyebrow="01 / About the journey" title="Not a résumé. A record of becoming." /><p className="reveal max-w-2xl text-xl leading-9 text-foreground/90">I’m a B.C.A. graduate building my professional direction through real practice, continuous learning, and web experiences made with care.</p><p className="reveal mt-6 max-w-2xl leading-8 text-muted-foreground">My work includes modern websites, webpages, landing pages, portfolios, and small-business websites. I bring professional-level coding and web-development experience to the work—without losing the curiosity that started the journey.</p></div>
        <div className="story-notes reveal"><div><GraduationCap /><span>B.C.A.</span><small>Bachelor of Computer Applications</small></div><div><BriefcaseBusiness /><span>SD Infotech</span><small>Practical, project-based web work</small></div><div><Sparkles /><span>Looking forward</span><small>Learning, building, and refining the direction</small></div></div>
      </div></section>

      <section id="timeline" className="section-rule scroll-mt-24"><div className="section-wrap section-space"><SectionTitle eyebrow="02 / Milestones" title="The chapters connect." copy="Education, experimentation, professional focus, and what comes next—each part belongs to the same continuing story." /><div className="timeline-track">{timeline.map((entry, index) => <article key={entry.id} className="timeline-entry reveal"><span className="timeline-dot">{String(index + 1).padStart(2, "0")}</span><div><p className="section-kicker">{entry.date_label}{entry.location && ` · ${entry.location}`}</p><h3>{entry.title}</h3><p>{entry.summary}</p>{entry.details && <small>{entry.details}</small>}</div></article>)}</div></div></section>

      <section id="album" className="album-band scroll-mt-24"><div className="section-wrap section-space"><SectionTitle eyebrow="03 / Photo journey" title="Fragments of one unfolding life." copy="Travel, work, discipline, and ordinary moments—the photographs can change, but their place in the journey remains connected." />
         <JourneyCarousel album={album} urls={urls} />
         <div className="profile-journey reveal"><div className="profile-orbit"><div className="profile-circle">{profile && urls[profile.id] ? <img src={urls[profile.id]} alt={profile.alt_text || "Portrait of Sujal"} loading="lazy" /> : <span>S</span>}</div></div><div><p className="section-kicker">Portrait / The person within the album</p><h3>The story keeps moving.</h3><p>{profile ? profile.caption : "A portrait will complete this part of the journey soon."}</p></div></div>
      </div></section>

      <section id="work" className="section-rule scroll-mt-24"><div className="section-wrap section-space"><SectionTitle eyebrow="04 / Web work" title="Ideas turned into practical digital work." copy="These examples are practice projects and concepts, presented honestly—not as commissioned client work." /><div className="project-grid">{PROJECTS.map(project => <article key={project.name} className="project-card reveal"><ProjectVisual theme={project.theme} /><div className="p-6"><p className="section-kicker">{project.number} · {project.category}</p><h3 className="mt-4 font-display text-2xl font-semibold">{project.name}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{project.description}</p></div></article>)}</div><div className="work-note reveal"><span>Project pricing</span><strong>Depends on the deal/project work.</strong></div></div></section>

       <section id="contact" className="contact-band scroll-mt-24"><div className="section-wrap section-space contact-grid"><div><p className="section-kicker">05 / Start a conversation</p><h2 className="section-heading mt-6">Have a website in mind?<br /><span className="text-gradient">Let’s shape the next chapter.</span></h2><p className="mt-6 max-w-lg leading-8 text-muted-foreground">For websites, webpages, landing pages, portfolios, and small-business projects, reach SD Infotech directly by email.</p><Button asChild variant="hero" size="hero" className="mt-8"><a href={`mailto:${CONTACT_EMAIL}`}><Mail /> Email SD Infotech</a></Button></div><div className="text-center md:text-left"><p className="section-kicker">Direct contact</p><a className="mt-5 inline-block font-display text-lg text-primary underline-offset-4 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></div></div></section>
    </main>
    <footer className="section-wrap flex flex-col items-center gap-5 py-10 text-center text-sm text-muted-foreground"><div className="footer-social" aria-label="Social profiles">{SOCIAL_LINKS.map(link => <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name} title={link.name}><PlatformIcon platform={link.icon} className="size-5" /></a>)}</div><span>© 2026 SD Infotech. All Rights Reserved.</span></footer>
    <Button variant="glass" size="icon" className={`back-top fixed right-5 bottom-5 z-50 ${scrolled ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-label="Back to top" onClick={() => scrollTo({ top: 0, behavior: "smooth" })}><ArrowUp /></Button>
  </div>;
}