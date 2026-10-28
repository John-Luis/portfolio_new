"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const navItems = ["about", "projects", "stack", "credentials", "contact"];
const terminalLines = [
  "initializing bridge: hardware <-> software",
  "reading sensor... mapping to action",
  "compiling embedded C++...",
  "tracking hand landmarks...",
];

const projects = [
  {
    domain: "Computer Vision",
    tone: "code",
    title: "Computer Vision Virtual Controller",
    description: "A real-time hand-tracking interface that lets a webcam replace a mouse, built for touchless control without any extra hardware.",
    problem: "Physical input devices break down the moment hands are occupied, dirty, or out of reach. A webcam is already there and unused.",
    approach: "MediaPipe tracks 21 hand landmarks per frame; OpenCV handles the video pipeline; landmark positions are mapped to screen coordinates and smoothed before PyAutoGUI drives the OS cursor.",
    result: "A working touchless controller with pinch-to-click gesture recognition, running in real time on consumer webcam hardware.",
    tags: ["Python", "OpenCV", "MediaPipe", "PyAutoGUI"],
  },
  {
    domain: "Embedded Safety",
    tone: "signal",
    title: "Automated Gas Detection & Mitigation",
    description: "A standalone safety system that detects hazardous gas concentration and responds without waiting on a human or a network connection.",
    problem: "Gas leaks need a response measured in seconds, not in however long it takes someone to notice and react.",
    approach: "An MQ-135 sensor's digital alert output is wired directly into Arduino digital pin 2. Firmware writes a status update to an LCD and switches on a DC fan to ventilate the space.",
    result: "A closed-loop detect-and-mitigate cycle that runs entirely on the microcontroller, with no cloud or app dependency.",
    tags: ["Arduino", "Embedded C++", "MQ-135", "LCD", "Circuit Design"],
  },
  {
    domain: "Software Architecture",
    tone: "code",
    title: "MathEngine CLI",
    description: "A command-line file processor built to prove out a clean OOP architecture for data work, not just to get one answer out of one file.",
    problem: "Ad-hoc scripts for reading, computing, and logging data get tangled fast and do not survive a second use case.",
    approach: "Object-oriented design separates file reading, math computation, and logging into independent classes behind a single CLI entry point.",
    result: "A reusable processor where swapping a data source or output format is a one-class change, not a rewrite.",
    tags: ["Python", "OOP", "CLI", "Pandas"],
  },
  {
    domain: "Hardware Security",
    tone: "signal",
    title: "Embedded Hardware Security Lab",
    description: "An ongoing exploration of firmware and hardware-level security, the layer below the app where most security guidance stops applying.",
    problem: "Embedded devices trust their communication protocols and firmware by default, which is exactly where they are least tested.",
    approach: "Hands-on testing of hardware communication protocols and firmware behavior to understand how embedded systems fail and where they should be hardened.",
    result: "A growing set of protocol notes and firmware test cases that inform how I design every other embedded project.",
    tags: ["Embedded C", "Firmware", "Protocols", "Hardware Security"],
  },
];

const credentials = [
  ["Education", "B.S. Computer Engineering", "Polytechnic University of the Philippines", "Coursework focused on hardware-software integration, object-oriented programming, and embedded systems.", "signal"],
  ["Certification", "ISC2 Candidate", "ISC2", "A verified digital credential demonstrating foundational knowledge in cybersecurity and system defense.", "warn"],
  ["Certification", "Python Essentials 1 & 2", "Cisco Networking Academy", "Validates comprehensive proficiency in Python, from fundamental programming concepts to advanced data structures and OOP.", "warn"],
  ["Leadership & Community", "Red Senior", "Google Developer Groups (GDG) on Campus - PUP", "Helping lead and organize a student developer community focused on hands-on technical learning.", "code"],
  ["Hands-On Workshop", "DIY Flipper Zero Hardware Workshop", "", "Participated in an in-person technical session on embedded device hacking, sub-GHz transmission, and hardware diagnostics.", "signal"],
];

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (name === "sun") return <svg {...common}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>;
  if (name === "moon") return <svg {...common}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>;
  if (name === "mail") return <svg {...common}><path d="M4 4h16v16H4z" /><path d="m22 6-10 7L2 6" /></svg>;
  if (name === "github") return <svg {...common}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>;
  if (name === "linkedin") return <svg {...common}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>;
  if (name === "code") return <svg {...common}><path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16" /></svg>;
  if (name === "layers") return <svg {...common}><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83zM22 12.18l-8.58 3.9a2 2 0 0 1-1.66 0L3.18 12.18M22 17.18l-8.58 3.9a2 2 0 0 1-1.66 0l-8.58-3.9" /></svg>;
  return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M15 2v2M9 2v2M15 20v2M9 20v2M20 15h2M20 9h2M2 15h2M2 9h2" /></svg>;
}

function subscribeTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("portfolio-theme-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("portfolio-theme-change", callback);
  };
}

function readTheme() {
  try { return localStorage.getItem("portfolio-theme") === "light"; }
  catch { return false; }
}

export default function Home() {
  const light = useSyncExternalStore(subscribeTheme, readTheme, () => false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [progress, setProgress] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lineIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;
    const type = () => {
      const line = terminalLines[lineIndex];
      characterIndex += deleting ? -1 : 1;
      setTyped(line.slice(0, characterIndex));
      if (!deleting && characterIndex === line.length) {
        deleting = true;
        timeout = setTimeout(type, 1600);
        return;
      }
      if (deleting && characterIndex === 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % terminalLines.length;
      }
      timeout = setTimeout(type, deleting ? 28 : 42);
    };
    timeout = setTimeout(type, 900);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const documentElement = document.documentElement;
      const value = documentElement.scrollHeight - documentElement.clientHeight;
      setProgress(value ? (documentElement.scrollTop / value) * 100 : 0);
      const sections = ["home", ...navItems];
      let current = "home";
      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= 160) current = id;
      });
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const setTheme = () => {
    try { localStorage.setItem("portfolio-theme", light ? "dark" : "light"); }
    catch { return; }
    window.dispatchEvent(new Event("portfolio-theme-change"));
  };
  const colors = light ? { bg: "#f3f7f5", soft: "#e9f0ed", surface: "#ffffff", border: "#c9d8d1", text: "#14231c", dim: "#52645b", faint: "#526b60", signal: "#087a45", code: "#126aa3", warn: "#b85c1f" } : { bg: "#090d12", soft: "#0d131a", surface: "#121922", border: "#212b38", text: "#e8eef4", dim: "#93a1b0", faint: "#8b9aaa", signal: "#58f7a6", code: "#57b8ff", warn: "#ff9e5c" };

  return (
    <main style={{ backgroundColor: colors.bg, color: colors.text }} id="main-content" tabIndex={-1} className="min-h-screen overflow-x-hidden font-sans transition-colors duration-300">
      <a href="#home" className="skip-link">Skip to content</a>
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-[#57b8ff] to-[#58f7a6] transition-transform" style={{ transform: `scaleX(${progress / 100})` }} />
      <div aria-hidden="true" className="pointer-events-none fixed left-7 top-0 z-40 hidden h-screen w-8 items-center justify-center xl:flex">
        <div className="relative h-[62vh] w-0.5 bg-[#212b38]">
          <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-[#57b8ff] to-[#58f7a6] shadow-[0_0_10px_rgba(88,247,166,0.5)]" style={{ height: `${progress}%` }} />
          {["home", ...navItems].map((id, index) => <span key={id} className={`absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${active === id ? "border-[#58f7a6] bg-[#58f7a6] shadow-[0_0_0_4px_rgba(88,247,166,0.15),0_0_14px_rgba(88,247,166,0.7)]" : index < ["home", ...navItems].indexOf(active) ? "border-[#57b8ff] bg-[#2a5c82]" : "border-[#212b38]"}`} style={{ top: `${index * 20}%` }}><span className={`absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider ${active === id ? "text-[#58f7a6]" : "text-[#5d6b7a]"}`}>{id}</span></span>)}
        </div>
      </div>

      <header className={`fixed inset-x-0 top-0 z-50 h-[72px] border-b backdrop-blur-xl transition-colors ${progress > 2 ? "shadow-lg" : ""}`} style={{ backgroundColor: `${colors.bg}d9`, borderColor: colors.border }}>
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-2 px-5 sm:px-7">
          <a href="#home" className="flex items-center gap-2 font-mono text-xs font-bold tracking-tight sm:text-sm"><span className="flex h-7 w-7 items-center justify-center rounded-lg border" style={{ backgroundColor: colors.surface, borderColor: colors.border }}><span className="h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: colors.signal, color: colors.signal }} /></span>John Luis V. Mayor</a>
          <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">{navItems.map((item) => <a key={item} href={`#${item}`} aria-current={active === item ? "location" : undefined} className={`rounded-md px-3 py-2 font-mono text-xs capitalize transition-colors ${active === item ? "bg-white/5" : ""}`} style={{ color: active === item ? colors.text : colors.dim }}>{active === item && <span style={{ color: colors.signal }}>{"// "}</span>}{item}</a>)}</nav>
          <div className="flex items-center gap-2"><a href="#contact" className="hidden rounded-md border px-3.5 py-2 font-mono text-xs sm:block" style={{ borderColor: colors.signal, color: colors.signal }}>Get in touch</a><button type="button" onClick={setTheme} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border" style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }} aria-label={light ? "Switch to dark mode" : "Switch to light mode"}><Icon name={light ? "moon" : "sun"} /></button><button type="button" ref={menuButton} onClick={() => setMenuOpen(!menuOpen)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border lg:hidden" style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-controls="mobile-navigation" aria-expanded={menuOpen}><span className="font-mono text-lg">{menuOpen ? "x" : "="}</span></button></div>
        </div>
        {menuOpen && <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-b px-7 py-2 lg:hidden" style={{ backgroundColor: colors.soft, borderColor: colors.border }}>{navItems.map((item) => <a key={item} href={`#${item}`} onClick={() => setMenuOpen(false)} className="block border-b py-3 font-mono text-sm capitalize last:border-0" style={{ color: colors.dim }}>{item}</a>)}</nav>}
      </header>

      <section id="home" tabIndex={-1} className="mx-auto flex min-h-[90svh] max-w-7xl items-center px-7 pb-20 pt-32"><div className="max-w-4xl"><p className="mb-5 font-mono text-xs uppercase tracking-[0.18em]" style={{ color: colors.signal }}>Computer engineering · Software + hardware</p><div aria-hidden="true" className="terminal-line mb-7 inline-flex max-w-full items-center gap-2.5 rounded-lg border px-3.5 py-2 font-mono text-xs" style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.dim }}><span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: colors.signal }} />{typed || terminalLines[0]}<span className="h-3.5 w-1.5 animate-pulse" style={{ backgroundColor: colors.code }} /></div><h1 className="text-[clamp(2.6rem,7vw,5.5rem)] font-bold leading-[1.05] tracking-[-0.045em] text-balance">Building where <span className="bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(110deg, ${colors.signal}, ${colors.code})` }}>circuits meet code</span>.</h1><p className="mt-4 font-mono text-sm sm:text-base" style={{ color: colors.code }}>{"// John Luis V. Mayor · Computer Engineering Student"}</p><p className="mt-6 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: colors.dim }}>I turn sensor readings and camera input into useful actions. I build computer vision tools in Python and automation systems in embedded C++, connecting software to the world around it.</p><div className="mt-9 flex flex-wrap gap-3"><a href="#projects" className="rounded-lg px-5 py-3 font-mono text-sm font-semibold transition-transform hover:-translate-y-0.5" style={{ backgroundColor: colors.signal, color: light ? "#ffffff" : "#04120a" }}>View case studies</a><a href="#contact" className="rounded-lg border px-5 py-3 font-mono text-sm font-semibold transition-colors hover:border-[#57b8ff]" style={{ borderColor: colors.border, color: colors.text }}>Let’s talk <span aria-hidden="true">↗</span></a></div><div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t pt-6 font-mono text-xs" style={{ borderColor: colors.border, color: colors.dim }}><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.signal }} />Open to internships &amp; collaborations</span><a href="https://github.com/John-Luis" className="inline-flex items-center gap-2"><Icon name="github" size={16} />Explore my GitHub <span aria-hidden="true">↗</span></a></div></div></section>

      <section id="about" className="border-t py-24" style={{ borderColor: colors.border }}><div className="mx-auto grid max-w-7xl gap-12 px-7 lg:grid-cols-[1.3fr_1fr]"><div><Eyebrow number="01" label="About" color={colors.signal} /><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Two disciplines, one feedback loop.</h2><div className="mt-5 max-w-2xl space-y-4 text-base leading-relaxed" style={{ color: colors.dim }}><p>I specialize in bridging the physical and digital worlds using <strong style={{ color: colors.text }}>Python</strong> for object-oriented systems and computer vision, and <strong style={{ color: colors.text }}>embedded C++</strong> for microcontrollers and IoT automation.</p><p>In practice, a gesture recognized by a camera becomes a cursor movement; a gas sensor&apos;s voltage swing becomes an LCD warning and a fan spinning up. I&apos;m most interested in the handoff points, where a sensor reading becomes a decision, and a decision becomes a physical action.</p></div></div><InfoPanel colors={colors} /></div></section>

      <section id="projects" className="border-t py-24" style={{ borderColor: colors.border }}><div className="mx-auto max-w-7xl px-7"><SectionIntro number="02" label="Projects" title="Case studies" description="Four projects spanning the same loop from a different angle each time: sense something in the physical world, decide, then act - in software, in hardware, or both." colors={colors} /><div className="space-y-5">{projects.map((project, index) => <article key={project.title} className="grid gap-7 rounded-2xl border p-6 transition-transform hover:-translate-y-1 sm:p-8 lg:grid-cols-[36px_1fr]" style={{ backgroundColor: colors.surface, borderColor: colors.border }}><div className="font-mono text-xs" style={{ color: colors.faint }}>{String(index + 1).padStart(2, "0")}<span className="mt-3 hidden h-full w-px bg-[#212b38] lg:block" /></div><div><span className="inline-block rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider" style={{ color: project.tone === "code" ? colors.code : colors.signal, borderColor: project.tone === "code" ? colors.code : colors.signal, backgroundColor: project.tone === "code" ? "rgba(87,184,255,.08)" : "rgba(88,247,166,.08)" }}>{project.domain}</span><h3 className="mt-3 text-xl font-bold">{project.title}</h3><p className="mt-2" style={{ color: colors.dim }}>{project.description}</p><div className="mt-5 grid gap-5 md:grid-cols-3">{[["Problem", project.problem], ["Approach", project.approach], ["Result", project.result]].map(([label, text]) => <div key={label}><h4 className="font-mono text-[10px] uppercase tracking-wider" style={{ color: colors.faint }}>{label}</h4><p className="mt-2 text-sm leading-relaxed" style={{ color: colors.dim }}>{text}</p></div>)}</div><div className="mt-5 flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="rounded-md border px-2.5 py-1 font-mono text-xs" style={{ borderColor: colors.border, color: colors.dim }}>{tag}</span>)}</div></div></article>)}</div></div></section>

      <section id="stack" className="border-t py-24" style={{ borderColor: colors.border }}><div className="mx-auto max-w-7xl px-7"><SectionIntro number="03" label="Stack" title="Tools I build with" description="Grouped by which side of the bridge they live on." colors={colors} /><div className="grid gap-5 md:grid-cols-3">{[["code", "Languages", ["Python", "C / C++", "HTML/CSS/JS", "SQL"]], ["layers", "Frameworks & Libraries", ["OpenCV", "MediaPipe", "Pandas", "PyAutoGUI"]], ["cpu", "Hardware", ["Arduino", "MQ-135", "Embedded C", "Circuit Design"]]].map(([icon, title, tags], index) => <div key={title as string} className="rounded-xl border p-7" style={{ backgroundColor: colors.surface, borderColor: colors.border }}><span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border" style={{ backgroundColor: colors.soft, borderColor: colors.border, color: index === 0 ? colors.signal : index === 1 ? colors.code : colors.warn }}><Icon name={icon as string} /></span><h3 className="mb-4 font-bold">{title as string}</h3><div className="flex flex-wrap gap-2">{(tags as string[]).map((tag) => <span key={tag} className="rounded-md border px-2.5 py-1.5 font-mono text-xs" style={{ backgroundColor: colors.soft, borderColor: colors.border, color: colors.dim }}>{tag}</span>)}</div></div>)}</div></div></section>

      <section id="credentials" className="border-t py-24" style={{ borderColor: colors.border }}><div className="mx-auto max-w-7xl px-7"><SectionIntro number="04" label="Credentials" title="Education, certifications & community" description="Formal coursework, verified credentials, and the workshops and communities I show up for outside of class." colors={colors} /><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{credentials.map(([kicker, title, org, description, tone]) => <div key={title} className="flex min-h-56 flex-col gap-4 rounded-xl border p-7" style={{ backgroundColor: colors.surface, borderColor: colors.border }}><div className="flex h-10 w-10 items-center justify-center rounded-lg border" style={{ backgroundColor: colors.soft, borderColor: colors.border, color: colors[tone as keyof typeof colors] }}><Icon name={tone === "code" ? "layers" : "cpu"} /></div><div><div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: colors.faint }}>{kicker}</div><h3 className="mt-1 font-bold">{title}</h3>{org && <p className="mt-1 font-mono text-xs" style={{ color: colors.dim }}>{org}</p>}</div><p className="mt-auto text-sm leading-relaxed" style={{ color: colors.dim }}>{description}</p></div>)}</div></div></section>

      <section id="contact" className="border-t py-24" style={{ borderColor: colors.border }}><div className="mx-auto max-w-7xl px-7"><div className="rounded-2xl border bg-gradient-to-br from-[#58f7a6]/[0.06] to-[#57b8ff]/[0.06] p-9 text-center px-5 sm:p-14" style={{ borderColor: colors.border }}><Eyebrow number="05" label="Contact" color={colors.signal} centered /><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Let&apos;s build something that closes the loop.</h2><p className="mx-auto mt-4 max-w-xl" style={{ color: colors.dim }}>Open to internships, collaborations, and conversations about automation, computer vision, or embedded systems.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><ContactLink href="mailto:johnmayor535@gmail.com" icon="mail" text="johnmayor535@gmail.com" colors={colors} /><ContactLink href="https://github.com/John-Luis" icon="github" text="github.com/John-Luis" colors={colors} /><ContactLink href="https://linkedin.com/in/johnluismayor" icon="linkedin" text="linkedin.com/in/johnluismayor" colors={colors} /></div></div></div></section>
      <footer className="mx-auto max-w-7xl px-7 pb-12 text-center font-mono text-xs" style={{ color: colors.faint }}>© {new Date().getFullYear()} John Luis V. Mayor - built with Next.js &amp; Tailwind CSS.</footer>
    </main>
  );
}

function Eyebrow({ number, label, color, centered = false }: { number: string; label: string; color: string; centered?: boolean }) { return <div className={`mb-3 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.12em] ${centered ? "justify-center" : ""}`} style={{ color }}><span className="h-px w-4" style={{ backgroundColor: color }} />{number} / {label}</div>; }
function SectionIntro({ number, label, title, description, colors }: { number: string; label: string; title: string; description: string; colors: Record<string, string> }) { return <div className="mb-12 max-w-2xl"><Eyebrow number={number} label={label} color={colors.signal} /><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2><p className="mt-3 leading-relaxed" style={{ color: colors.dim }}>{description}</p></div>; }
function InfoPanel({ colors }: { colors: Record<string, string> }) { const rows = [["name", "J. L. V. Mayor"], ["role", "CpE Student"], ["focus", "Automation · CV · Embedded"], ["core_lang", "Python, C/C++"], ["domain", "OOP Systems · MCU I/O"], ["status", "open to opportunities"]]; return <div className="rounded-xl border p-6 font-mono text-xs" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>{rows.map(([key, value]) => <div key={key} className="flex justify-between gap-3 border-b py-2.5 last:border-0" style={{ borderColor: colors.border, color: colors.dim }}><span>{key}</span><span className="text-right" style={{ color: key === "status" ? colors.signal : colors.text }}>{value}</span></div>)}</div>; }
function ContactLink({ href, icon, text, colors }: { href: string; icon: string; text: string; colors: Record<string, string> }) { return <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="flex items-center min-h-11 max-w-full gap-2 rounded-lg border px-3 py-2.5 font-mono text-xs transition-transform hover:-translate-y-0.5" style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}><span className="shrink-0"><Icon name={icon} size={16} /></span><span className="break-all">{text}</span></a>; }