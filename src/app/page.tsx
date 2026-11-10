import { ExpertiseIcon } from "@/components/public/expertise-icon";
import { ThemeToggle } from "@/components/public/theme-toggle";
import { InnovationGrid } from "@/components/public/innovation-grid";
import { ParallaxController } from "@/components/public/parallax-controller";
import { PortfolioGallery } from "@/components/public/portfolio-gallery";
import { ScrollProgress } from "@/components/public/scroll-progress";
import { getPublishedSnapshot } from "@/lib/cms/snapshot";
import { buildStructuredData, serializeJsonLd } from "@/lib/seo";
import Image from "next/image";

export const revalidate = 60;

export default async function HomePage() {
  const snapshot = await getPublishedSnapshot();
  const { sections, projects, categories } = snapshot;
  const profileUrl = sections.hero.profileMediaId ? `/api/media/${sections.hero.profileMediaId}` : sections.hero.profileFallbackUrl;
  const featured = projects.filter((project) => project.featured).slice(0, 8);
  const remaining = projects.filter((project) => !featured.some((item) => item.id === project.id));
  const portfolioProjects = [...featured, ...remaining];
  const visibleCategories = categories.filter((category) => projects.some((project) => project.category?.id === category.id));
  const structuredData = buildStructuredData(snapshot);
  const visibleNav = sections.navigation.items.filter((item) => item.visible);
  const order = (["profile", "expertise", "experience", "portfolio", "skills", "capabilities", "innovation", "education"] as const).filter((key) => sections.visibility[key]);
  const label = (key: (typeof order)[number]) => String(order.indexOf(key) + 1).padStart(2, "0");

  return (
    <main className="public-site">
      <ParallaxController />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Liju Pankaj, home"><span>LIJU</span> PANKAJ</a>
        <nav aria-label="Primary navigation">
          {visibleNav.map((item) => <a key={item.id} href={item.href}>{item.label}</a>)}
        </nav>
        <div className="header-tools">
          <ThemeToggle />
          <details className="mobile-nav">
            <summary aria-label="Open menu"><span aria-hidden="true" /></summary>
            <nav aria-label="Mobile navigation">{visibleNav.map((item) => <a key={item.id} href={item.href}>{item.label}</a>)}</nav>
          </details>
        </div>
        <ScrollProgress />
      </header>

      <section className="hero" id="top" data-section-reveal>
        <div className="hero-copy" data-parallax data-parallax-speed="0.025" data-parallax-max="30">
          <p className="eyebrow">{sections.hero.eyebrow}</p>
          <h1>{sections.hero.title}</h1>
          <p className="positioning">{sections.hero.positioning}</p>
          {sections.hero.supportingText && <p className="hero-supporting">{sections.hero.supportingText}</p>}
          <p className="hero-intro">{sections.hero.introduction}</p>
          <div className="hero-actions">
            <a className="primary-button" href={sections.visibility.expertise ? "#expertise" : "#about"}>{sections.hero.primaryButtonLabel}</a>
            {sections.visibility.portfolio && <a className="outline-button" href="#work">{sections.hero.workButtonLabel}</a>}
            {sections.visibility.contact && <a className="outline-button" href="#contact">{sections.hero.contactButtonLabel}</a>}
          </div>
          <dl className="hero-facts"><div><dt>Experience</dt><dd>24 years</dd></div><div><dt>UAE practice</dt><dd>21 years</dd></div><div><dt>Based in</dt><dd>{sections.hero.location}</dd></div></dl>
        </div>
        <div className="portrait-frame" data-parallax data-parallax-speed="0.06" data-parallax-max="42"><Image src={profileUrl} alt={`Portrait of Liju Pankaj, ${sections.hero.positioning}`} width={900} height={1125} priority sizes="(max-width: 620px) 90vw, (max-width: 900px) 440px, 28vw" /></div>
      </section>

      {sections.visibility.profile && <section className="section profile-section" id="about" data-section-reveal>
        <div className="section-label"><span>{label("profile")}</span><p>Professional profile</p></div>
        <div className="section-content" data-parallax data-parallax-speed="0.022" data-parallax-max="24"><h2>{sections.profile.heading}</h2><p className="lead">{sections.profile.lead}</p><div className="profile-copy">{sections.profile.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><div className="pillars">{sections.profile.pillars.map((pillar) => <span key={pillar}>{pillar}</span>)}</div></div>
      </section>}

      {sections.visibility.expertise && <section className="section" id="expertise" data-section-reveal>
        <div className="section-label"><span>{label("expertise")}</span><p>Expertise</p></div>
        <div className="section-content" data-parallax data-parallax-speed="0.02" data-parallax-max="24"><h2>{sections.expertise.heading}</h2>{sections.expertise.introduction && <p className="lead narrow">{sections.expertise.introduction}</p>}<div className="expertise-grid">{sections.expertise.groups.map((group) => <article key={group.id}><ExpertiseIcon name={group.icon} /><h3>{group.title}</h3>{group.summary && <p>{group.summary}</p>}<ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></div>
      </section>}

      {sections.visibility.experience && <section className="section" id="experience" data-section-reveal>
        <div className="section-label"><span>{label("experience")}</span><p>Experience</p></div>
        <div className="section-content" data-parallax data-parallax-speed="0.02" data-parallax-max="24"><h2>{sections.experience.heading}</h2><div className="timeline">{sections.experience.items.map((item) => <article key={item.id}><div><p className="meta">{item.period}</p><p>{item.location}</p></div><div><h3>{item.title}</h3><p className="company">{item.company}</p><p>{item.summary}</p></div></article>)}</div></div>
      </section>}

      {sections.visibility.portfolio && <section className="section work-section" id="work" data-section-reveal>
        <div className="section-label"><span>{label("portfolio")}</span><p>Portfolio</p></div>
        <div className="section-content" data-parallax data-parallax-speed="0.018" data-parallax-max="22"><h2>{sections.portfolio.heading}</h2><p className="lead narrow">{sections.portfolio.introduction}</p>{portfolioProjects.length ? <PortfolioGallery projects={portfolioProjects} categories={visibleCategories} /> : <div className="empty-portfolio"><span aria-hidden="true">LP</span><p>{sections.portfolio.emptyMessage}</p><small>Image coming soon</small></div>}</div>
      </section>}

      {sections.visibility.skills && <section className="section" id="skills" data-section-reveal>
        <div className="section-label"><span>{label("skills")}</span><p>Technical skills</p></div>
        <div className="section-content" data-parallax data-parallax-speed="0.02" data-parallax-max="24"><h2>{sections.skills.heading}</h2>{sections.skills.introduction && <p className="lead narrow">{sections.skills.introduction}</p>}<div className="skills-grid">{sections.skills.groups.map((group) => <div key={group.id}><h3>{group.name}</h3><ul className="tool-list">{group.items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}</div></div>
      </section>}

      {sections.visibility.capabilities && <section className="section" id="capabilities" data-section-reveal>
        <div className="section-label"><span>{label("capabilities")}</span><p>Capabilities</p></div>
        <div className="section-content" data-parallax data-parallax-speed="0.02" data-parallax-max="24"><h2>{sections.capabilities.heading}</h2><div className="capability-grid">{sections.capabilities.items.map((item, index) => <article key={item.id}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.summary}</p></article>)}</div><div className="tool-list">{sections.capabilities.tools.map((tool) => <span key={tool}>{tool}</span>)}</div></div>
      </section>}

      {sections.visibility.innovation && <section className="section innovation-section" id="innovation" data-section-reveal>
        <div className="section-label"><span>{label("innovation")}</span><p>AI & innovation</p></div>
        <div className="section-content" data-parallax data-parallax-speed="0.02" data-parallax-max="24"><h2>{sections.innovation.heading}</h2><p className="lead narrow">{sections.innovation.introduction}</p><InnovationGrid apps={sections.innovation.apps} accessNote={sections.innovation.accessNote} /></div>
      </section>}

      {sections.visibility.education && <section className="section compact-section" id="education" data-section-reveal>
        <div className="section-label"><span>{label("education")}</span><p>Foundation</p></div>
        <div className="section-content" data-parallax data-parallax-speed="0.024" data-parallax-max="24"><h2>{sections.education.heading}</h2><div className="education-grid">{sections.education.items.map((item) => <article key={item.id}><h3>{item.qualification}</h3><p>{item.institution}</p></article>)}<article><h3>Languages</h3><p>{sections.education.languages.join(" · ")}</p></article></div></div>
      </section>}

      {sections.visibility.contact && <section className="contact-section" id="contact" data-section-reveal><p className="eyebrow" data-parallax data-parallax-speed="0.05" data-parallax-max="24">{sections.contact.eyebrow}</p><h2 data-parallax data-parallax-speed="0.035" data-parallax-max="28">{sections.contact.heading}</h2><a className="contact-email" data-parallax data-parallax-speed="0.025" data-parallax-max="24" href={`mailto:${sections.contact.email}`}>{sections.contact.email}</a><div data-parallax data-parallax-speed="0.04" data-parallax-max="24"><a href={`tel:${sections.contact.phone.replace(/\s/g, "")}`}>{sections.contact.phone}</a><span>{sections.contact.location}</span></div><a className="primary-button" data-parallax data-parallax-speed="0.055" data-parallax-max="28" href={`mailto:${sections.contact.email}`}>{sections.contact.buttonLabel}</a></section>}
      <footer><p>© {new Date().getFullYear()} {sections.footer.copyright}</p><p>{sections.footer.descriptor}</p><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}
