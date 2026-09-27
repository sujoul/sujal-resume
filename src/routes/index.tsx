import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, Code2, Globe2, LayoutTemplate, Menu, MonitorSmartphone, Search, UserRound, X, Mail, GraduationCap, Sparkles,  } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BENEFITS, CONTACT_EMAIL, NAV_ITEMS, PROCESS, PROJECTS, SERVICES, SKILLS, SOCIAL_LINKS } from "@/lib/site-content";
import heroVisual from "@/assets/developer-visual.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sujal — Web Developer & Freelance Web Creator" },
      { name: "description", content: "Sujal is a B.C.A. student and freelance web creator building modern websites, landing pages, portfolios, and custom web experiences for growing ideas." },
      { property: "og:title", content: "Sujal — Web Developer & Freelance Web Creator" },
      { property: "og:description", content: "Modern websites, landing pages, and portfolios built with care. Explore Sujal's work and start a project." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const serviceIcons = {
  globe: Globe2,
  layout: LayoutTemplate,
  user: UserRound,
  code: Code2,
  phone: MonitorSmartphone,
  search: Search,
};

function usePageMotion() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("");

  useEffect(() => {
    const updateScroll = () => {
      setScrolled(window.scrollY > 35);
      const available = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(available > 0 ? window.scrollY / available : 0);
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -25px 0px" });
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: "-30% 0px -55% 0px" });
    NAV_ITEMS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) sectionObserver.observe(element);
    });
    return () => {
      window.removeEventListener("scroll", updateScroll);
      revealObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);
  return { scrolled, progress, active };
}

function Header({ scrolled, active }: { scrolled: boolean; active: string }) {
  const [open, setOpen] = useState(false);
  return <>
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <nav aria-label="Main navigation" className="section-wrap nav-shell flex h-[66px] items-center justify-between rounded-md px-4 sm:px-6">
        <a href="#top" className="font-display flex items-center gap-2.5 text-xl font-bold text-foreground" aria-label="Sujal, back to top" onClick={() => setOpen(false)}>
          <span className="grid size-9 place-items-center rounded-sm border border-primary/30 bg-primary/10 text-primary"><span>S<span className="text-mint">.</span></span></span>
          <span>Sujal<span className="text-mint">.</span></span>
        </a>
        <div className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map(({ label, id }) => <a key={id} href={`#${id}`} className={`nav-link text-sm font-medium ${active === id ? "active text-foreground" : "text-muted-foreground"}`}>{label}</a>)}
        </div>
        <div className="hidden lg:block"><Button asChild variant="glass" size="sm" className="h-10 px-5"><a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Let's work together")}`}>Let's talk <ArrowUpRight /></a></Button></div>
        <Button variant="glass" size="icon" className="lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
      </nav>
      {open && <nav aria-label="Mobile navigation" className="section-wrap surface-glass mt-2 rounded-md p-3 shadow-xl lg:hidden">
        {NAV_ITEMS.map(({ label, id }) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className={`block rounded-sm px-4 py-3 text-sm font-medium ${active === id ? "bg-accent text-foreground" : "text-muted-foreground"}`}>{label}</a>)}
        <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Let's work together")}`} className="mt-2 flex items-center justify-between border-t border-border px-4 pt-4 pb-2 text-sm text-mint">Let's talk <ArrowUpRight size={16} /></a>
      </nav>}
    </header>
  </>;
}

function SectionIntro({ number, label, title, description }: { number: string; label: string; title: string; description?: string }) {
  return <div className="reveal mb-12 md:mb-16">
    <div className="section-kicker flex items-center gap-3"><span className="eyebrow-line" /> {number} / {label}</div>
    <h2 className="section-heading mt-5 max-w-3xl text-foreground">{title}</h2>
    {description && <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">{description}</p>}
  </div>;
}

function ProjectPreview({ theme, name }: { theme: string; name: string }) {
  return <div className={`project-preview ${theme}`} role="img" aria-label={`Stylized website interface preview for ${name}`}>
    <div className="mock-window">
      <div className="mock-topbar"><i className="mock-dot" /><i className="mock-dot" /><i className="mock-dot" /><span className="ml-auto h-1 w-12 rounded-full bg-foreground/10" /></div>
      {theme === "store" ? <div className="mock-body"><div className="mock-store-banner"><span className="mb-2 block h-1 w-12 rounded-full bg-mint/70" /><span className="mock-line mb-2 w-2/3" /><span className="mock-line dim w-1/2" /></div><div className="mt-3 grid h-[43%] grid-cols-3 gap-2"><div className="mock-product" /><div className="mock-product" /><div className="mock-product" /></div></div> : theme === "barber" ? <div className="mock-barber-body"><span className="mb-3 h-1 w-12 rounded-full bg-mint/60" /><span className="font-display text-xl font-semibold tracking-normal text-foreground sm:text-3xl">A finer cut.</span><span className="mock-line dim mt-3 w-1/2" /><span className="mt-5 h-4 w-14 rounded-sm bg-primary/80" /></div> : <div className="mock-portfolio-body"><div className="mb-7 flex justify-between"><span className="h-2 w-7 bg-mint/70" /><span className="h-1 w-14 bg-foreground/30" /></div><span className="mb-3 block h-1 w-14 bg-mint/70" /><span className="font-display block text-lg font-semibold leading-tight text-foreground sm:text-2xl">Creative work.<br />Clear purpose.</span><span className="mock-line dim mt-4 w-1/2" /></div>}
    </div>
    <span className="absolute right-4 bottom-4 font-display text-[10px] uppercase tracking-[.18em] text-foreground/60">Concept preview</span>
  </div>;
}

function ContactForm() {
  const [prepared, setPrepared] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const type = String(data.get("type") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = encodeURIComponent(`Project inquiry: ${type}`);
    const body = encodeURIComponent(`Hi Sujal,\n\n${message}\n\nProject type: ${type}\nName: ${name}\nEmail: ${email}`);
    setPrepared(true);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };
  return <form onSubmit={handleSubmit} className="reveal grid gap-5" aria-label="Project inquiry form">
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="block text-sm font-medium text-foreground">Your name <input className="form-field mt-2" name="name" type="text" autoComplete="name" placeholder="Your name" required /></label>
      <label className="block text-sm font-medium text-foreground">Email address <input className="form-field mt-2" name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
    </div>
    <label className="block text-sm font-medium text-foreground">Project type <select className="form-field mt-2" name="type" defaultValue="" required><option value="" disabled>Select a project type</option><option>Business website</option><option>Landing page</option><option>Personal portfolio</option><option>Custom webpage / UI</option><option>Something else</option></select></label>
    <label className="block text-sm font-medium text-foreground">Tell me about your project <textarea className="form-field textarea mt-2" name="message" placeholder="What are you looking to create?" required /></label>
    <div className="flex flex-wrap items-center gap-4"><Button type="submit" variant="hero" size="hero">Open email draft <ArrowUpRight /></Button><span className="max-w-[220px] text-xs leading-5 text-muted-foreground">This opens your email app. Nothing is submitted or stored here.</span></div>
    {prepared && <p role="status" className="text-sm text-mint">Your email draft is ready. If your email app didn't open, write to <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>}
  </form>;
}

function Index() {
  const { scrolled, progress, active } = usePageMotion();
  return <div className="site-shell" id="top">
    <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
    <Header scrolled={scrolled} active={active} />
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <img src={heroVisual} alt="Abstract web development workspace with layered website interfaces and code panels" width={1536} height={1024} className="hero-art" fetchPriority="high" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="section-wrap relative py-16 md:py-28">
          <div className="max-w-[780px]">
            <p className="font-display mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[.15em] text-mint sm:text-sm"><span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-50" /><span className="relative inline-flex size-2 rounded-full bg-mint" /></span> Student developer & freelance web creator</p>
            <h1 id="hero-title" className="hero-title text-foreground">Hi, I’m <span className="text-gradient">Sujal.</span><br />I build modern websites that turn ideas into digital experiences.</h1>
            <p className="mt-7 max-w-[540px] text-base leading-8 text-muted-foreground sm:text-lg">I create thoughtful websites, landing pages, and digital spaces that help people and businesses show up online with confidence.</p>
            <div className="mt-9 flex flex-wrap gap-3"><Button asChild variant="hero" size="hero"><a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Let's build a website")}`}>Hire me <ArrowUpRight /></a></Button><Button asChild variant="glass" size="hero"><a href="#work">View my work <ArrowDown /></a></Button></div>
            <div className="mt-12 flex flex-wrap items-center gap-2.5 sm:mt-16"><span className="mr-2 text-[11px] font-semibold uppercase tracking-[.18em] text-faint">What I work with</span>{["React", "JavaScript", "UI design"].map((skill) => <span key={skill} className="rounded-sm border border-border bg-card/40 px-3 py-1.5 text-xs text-foreground/80 backdrop-blur-sm">{skill}</span>)}</div>
          </div>
        </div>
        <span className="hero-side-label absolute right-8 bottom-20 hidden text-[10px] uppercase tracking-[.2em] text-muted-foreground xl:block">Design with purpose — build with care</span>
      </section>

      <section id="about" className="section-space section-wrap scroll-mt-24" aria-labelledby="about-title">
        <div className="grid items-center gap-14 lg:grid-cols-[.88fr_1.12fr] lg:gap-24">
          <div className="reveal relative max-w-[470px]">
            <div className="profile-frame" role="img" aria-label="Profile photo placeholder for Sujal, showing a decorative S monogram until a real photo is added"><span className="profile-monogram">S</span><span className="absolute bottom-10 left-10 z-10 font-display text-xs uppercase tracking-[.2em] text-foreground/70">Sujal / Web creator</span></div>
            <div className="surface-glass absolute -right-3 -bottom-6 flex items-center gap-4 rounded-sm px-5 py-4 shadow-2xl sm:-right-8"><span className="grid size-10 place-items-center rounded-sm bg-primary/10 text-primary"><GraduationCap size={20} /></span><div><span className="font-display block text-base font-semibold">B.C.A.</span><span className="text-xs text-muted-foreground">Computer Applications</span></div></div>
          </div>
          <div className="pt-10 lg:pt-0"><div className="section-kicker reveal flex items-center gap-3"><span className="eyebrow-line" /> 01 / About me</div><h2 id="about-title" className="section-heading reveal mt-5">A curious mind.<br /><span className="text-gradient">A builder at heart.</span></h2><p className="reveal mt-7 max-w-xl text-lg leading-8 text-foreground/85">I’m Sujal, a B.C.A. student and freelance web creator who enjoys turning ideas into well-considered digital experiences.</p><p className="reveal mt-5 max-w-xl leading-8 text-muted-foreground">I’m building my skills and my web-development business while studying. I work on modern websites, webpages, landing pages, portfolios, and small business sites—with a focus on clarity, usability, and the details that make a website feel right.</p><div className="reveal mt-9 flex flex-wrap gap-3"><span className="rounded-sm border border-border px-4 py-2 text-sm text-foreground/80">Always learning</span><span className="rounded-sm border border-border px-4 py-2 text-sm text-foreground/80">Thoughtful by design</span></div></div>
        </div>
      </section>

      <section id="services" className="section-rule scroll-mt-24"><div className="section-wrap section-space"><div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-24"><div><SectionIntro number="02" label="What I do" title="Digital spaces made to feel like you." description="From a focused landing page to a complete business presence, I build websites around your idea—not the other way around." /><div className="reveal hidden max-w-sm border-l border-mint/40 pl-5 text-sm leading-7 text-muted-foreground lg:block">Every project is different. Pricing depends on your requirements and the scope of the work.</div></div><div className="reveal">{SERVICES.map(({ number, icon, title, description }) => { const Icon = serviceIcons[icon as keyof typeof serviceIcons]; return <div className="service-item grid grid-cols-[36px_1fr_24px] gap-4 py-6 sm:grid-cols-[45px_1fr_24px] sm:gap-5" key={number}><span className="font-display pt-1 text-xs text-mint">{number}</span><div><div className="flex items-center gap-3"><Icon size={19} className="text-primary" strokeWidth={1.7} /><h3 className="font-display text-lg font-medium sm:text-xl">{title}</h3></div><p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">{description}</p></div><ArrowUpRight className="service-icon mt-1 text-faint" size={19} /></div>; })}<p className="border-t border-line pt-6 text-sm leading-7 text-muted-foreground lg:hidden">Pricing depends on your requirements and the scope of the work.</p></div></div></div></section>

      <section id="work" className="section-rule scroll-mt-24"><div className="section-wrap section-space"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><SectionIntro number="03" label="Selected work" title="Ideas made visible." description="A look at practice work and creative concepts that reflect how I approach the web." /><span className="reveal mb-12 text-xs uppercase tracking-[.16em] text-faint md:mb-16">01 — 03 / Projects</span></div><div className="grid gap-5 md:grid-cols-3">{PROJECTS.map((project, i) => <article className={`project-card reveal reveal-delay-${i + 1}`} key={project.name}><ProjectPreview theme={project.theme} name={project.name} /><div className="p-6"><div className="mb-5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[.14em] text-mint"><span>{project.category}</span><span>{project.number}</span></div><h3 className="font-display text-xl font-semibold sm:text-2xl">{project.name}</h3><p className="mt-3 min-h-[84px] text-sm leading-7 text-muted-foreground">{project.description}</p><div className="mt-5 flex flex-wrap gap-2">{project.tags.map(tag => <span key={tag} className="rounded-sm border border-border px-2.5 py-1 text-[11px] text-foreground/70">{tag}</span>)}</div></div></article>)}</div><p className="reveal mt-7 text-xs leading-6 text-muted-foreground">These are practice projects and concepts, not commissioned client work. Live demos are not available yet.</p></div></section>

      <section id="process" className="section-rule scroll-mt-24"><div className="section-wrap section-space"><SectionIntro number="04" label="The process" title="A simple path from idea to online." description="Good work starts with understanding what you need. Here’s how we can move from the first conversation to a finished site." /><div className="reveal relative grid gap-8 md:grid-cols-4 md:gap-6"><div className="process-line" aria-hidden="true" />{PROCESS.map((step) => <div key={step.number} className="relative grid grid-cols-[62px_1fr] gap-5 md:block"><span className="process-number">{step.number}</span><div className="md:mt-8"><h3 className="font-display text-xl font-semibold">{step.title}</h3><p className="mt-2 max-w-[250px] text-sm leading-7 text-muted-foreground">{step.description}</p></div></div>)}</div></div></section>

      <section id="skills" className="section-rule scroll-mt-24"><div className="section-wrap section-space grid gap-12 lg:grid-cols-[.95fr_1.05fr] lg:gap-24"><div><SectionIntro number="05" label="My toolkit" title="The tools behind the work." description="A growing toolkit I use and continue to learn as I build better experiences." /></div><div className="reveal flex flex-wrap content-center gap-3">{SKILLS.map((skill, i) => <span key={skill} className="skill-pill font-display inline-flex min-h-14 items-center gap-3 rounded-sm px-5 text-sm font-medium sm:text-base"><span className="font-sans text-[10px] text-mint">0{i + 1}</span>{skill}</span>)}</div></div></section>

      <section id="why" className="section-rule scroll-mt-24"><div className="section-wrap section-space"><SectionIntro number="06" label="Why work with me" title="Thoughtful work. Straightforward collaboration." /><div className="grid gap-x-10 gap-y-0 md:grid-cols-2">{BENEFITS.map((benefit, i) => <div key={benefit.number} className={`reveal reveal-delay-${(i % 2) + 1} grid grid-cols-[35px_1fr] gap-5 border-t border-line py-7 sm:py-9`}><span className="font-display text-xs text-mint">{benefit.number}</span><div><h3 className="font-display text-xl font-semibold">{benefit.title}</h3><p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">{benefit.description}</p></div></div>)}</div></div></section>

      <section id="contact" className="contact-band scroll-mt-24"><div className="section-wrap section-space grid gap-16 lg:grid-cols-[.9fr_1.1fr] lg:gap-24"><div className="reveal"><div className="section-kicker flex items-center gap-3"><span className="eyebrow-line" /> 07 / Get in touch</div><h2 className="section-heading mt-6">Have something in mind?<br /><span className="text-gradient">Let's build it.</span></h2><p className="mt-6 max-w-md text-base leading-8 text-muted-foreground">Tell me about your idea, whether it’s a fresh website, a focused page, or a portfolio that feels like you.</p><Button asChild variant="glass" size="hero" className="mt-8"><a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Let's work together")}`}><Mail /> Hire me by email <ArrowUpRight /></a></Button><div className="mt-12 border-t border-line pt-6"><p className="mb-2 text-xs uppercase tracking-[.16em] text-faint">Or write directly</p><a className="font-display text-lg text-foreground underline decoration-primary/50 underline-offset-8 transition-colors hover:text-primary" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a><p className="mt-3 max-w-xs text-xs leading-6 text-muted-foreground">Placeholder email — replace with Sujal's real address before sharing this site.</p></div></div><div><div className="mb-7 flex items-center gap-3 text-sm font-medium text-foreground"><span className="grid size-9 place-items-center rounded-sm bg-mint/10 text-mint"><Sparkles size={17} /></span> Tell me about your project</div><ContactForm /></div></div></section>
    </main>
    <footer className="section-wrap py-10"><div className="grid gap-8 border-b border-line pb-10 md:grid-cols-[1fr_auto] md:items-center"><div><a href="#top" className="font-display text-2xl font-bold">Sujal<span className="text-mint">.</span></a><p className="mt-2 text-sm text-muted-foreground">Web Developer · Student creator</p></div><div className="flex flex-wrap gap-3">{SOCIAL_LINKS.map((social) => <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={`${social.name} placeholder profile`} title={`${social.name} — placeholder URL`} className="grid size-10 place-items-center rounded-sm border border-border font-display text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary">{social.short}</a>)}</div></div><div className="flex flex-col gap-3 pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} Sujal. Made with intention.</span><span>Social links are placeholders until profiles are added.</span></div></footer>
    <Button variant="glass" size="icon" className={`back-top fixed right-5 bottom-5 z-50 size-11 transition-all duration-300 ${scrolled ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`} aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><ArrowUp size={18} /></Button>
  </div>;
}
