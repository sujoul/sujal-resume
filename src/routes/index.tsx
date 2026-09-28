import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight, BriefcaseBusiness, Camera, GraduationCap, Mail, MapPin, Menu, Sparkles, X } from "lucide-react";
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
  return <article className={`memory-card memory-${item.kind} reveal`}><div className="memory-placeholder"><Camera /><span>Memory {String(index + 1).padStart(2, "0")}</span></div><div className="memory-caption"><span>{item.title}</span><p>{item.caption}</p></div></article>;
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
        if (item.external_url) return [item.id, item.external_url] as const;
        if (!item.storage_path) return [item.id, ""] as const;
        const { data: signed } = await import("@/integrations/supabase/client").then(({ supabase }) => supabase.storage.from("journey-media").createSignedUrl(item.storage_path as string, 3600));
        return [item.id, signed?.signedUrl || ""] as const;
      }));
      setUrls(Object.fromEntries(pairs));
    }).catch(() => undefined);
  }, []);
  const timeline = journey.length ? journey : FALLBACK_JOURNEY;
  const profile = media.find(item => item.is_profile_photo);
  const album = useMemo(() => media.filter(item => !item.is_profile_photo), [media]);

  return <div className="site-shell" id="top">
    <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />
    <Header scrolled={scrolled} active={active} />
    <main>
      <section className="journey-hero" aria-labelledby="hero-title">
        <img src={heroVisual} alt="Layered digital interfaces representing Sujal's web-building journey" className="hero-art" fetchPriority="high" />
        <div className="hero-vignette" />
        <div className="section-wrap relative z-10 pt-36 pb-20 md:pt-44 md:pb-28">
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
        <div className="album-grid">{album.length ? album.map((item, index) => <article key={item.id} className={`memory-card reveal ${index % 3 === 1 ? "memory-tall" : ""}`}>{item.media_type === "video" ? <video src={urls[item.id]} controls preload="metadata" aria-label={item.alt_text || item.title} /> : <img src={urls[item.id]} alt={item.alt_text || item.title} loading="lazy" />}<div className="memory-caption"><span>{item.date_label || item.location || `Memory ${index + 1}`}</span><p>{item.caption || item.title}</p></div></article>) : MEMORY_PLACEHOLDERS.map((item, index) => <MemoryPlaceholder key={item.title} item={item} index={index} />)}</div>
        <div className="profile-journey reveal"><div className="profile-orbit"><div className="profile-circle">{profile && urls[profile.id] ? <img src={urls[profile.id]} alt={profile.alt_text || "Sujal in a lavender jacket"} /> : <span>S</span>}</div></div><div><p className="section-kicker">Portrait / The person within the album</p><h3>The story keeps moving.</h3><p>{profile ? profile.caption : "The lavender-jacket portrait will appear here after it is uploaded in the admin panel."}</p></div></div>
      </div></section>

      <section id="work" className="section-rule scroll-mt-24"><div className="section-wrap section-space"><SectionTitle eyebrow="04 / Web work" title="Ideas turned into practical digital work." copy="These examples are practice projects and concepts, presented honestly—not as commissioned client work." /><div className="project-grid">{PROJECTS.map(project => <article key={project.name} className="project-card reveal"><ProjectVisual theme={project.theme} /><div className="p-6"><p className="section-kicker">{project.number} · {project.category}</p><h3 className="mt-4 font-display text-2xl font-semibold">{project.name}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{project.description}</p></div></article>)}</div><div className="work-note reveal"><span>Project pricing</span><strong>Depends on the deal/project work.</strong></div></div></section>

      <section id="contact" className="contact-band scroll-mt-24"><div className="section-wrap section-space contact-grid"><div><p className="section-kicker">05 / Start a conversation</p><h2 className="section-heading mt-6">Have a website in mind?<br /><span className="text-gradient">Let’s shape the next chapter.</span></h2><p className="mt-6 max-w-lg leading-8 text-muted-foreground">For websites, webpages, landing pages, portfolios, and small-business projects, reach SD Infotech directly by email.</p><Button asChild variant="hero" size="hero" className="mt-8"><a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Project inquiry — SD Infotech")}`}><Mail /> Email SD Infotech</a></Button></div><div className="social-panel"><span>Elsewhere in the journey</span>{SOCIAL_LINKS.map(link => <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="social-link"><PlatformIcon platform={link.icon} className="size-5" /><span>{link.name}</span><ArrowUpRight /></a>)}</div></div></section>
    </main>
    <footer className="section-wrap flex flex-col gap-5 py-9 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>© 2026 SD Infotech. All Rights Reserved.</span><a href="/admin" className="text-faint hover:text-foreground">Admin</a></footer>
    <Button variant="glass" size="icon" className={`back-top fixed right-5 bottom-5 z-50 ${scrolled ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-label="Back to top" onClick={() => scrollTo({ top: 0, behavior: "smooth" })}><ArrowUp /></Button>
  </div>;
}