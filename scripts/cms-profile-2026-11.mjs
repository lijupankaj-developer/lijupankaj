// One-off CMS content update (November 2026): repositions the portfolio as
// "IT & Creative Technology Leader" and regroups portfolio categories.
//
// It writes ONLY the private draft (site_content.draft_content) and category rows.
// Nothing becomes public until the owner reviews the draft in /admin and presses Publish.
//
//   node scripts/cms-profile-2026-11.mjs            # dry run: prints the planned changes
//   node scripts/cms-profile-2026-11.mjs --apply    # applies them in one transaction
//
// Preserved untouched: experience entries, education, languages, AI & innovation apps,
// contact email/phone/location, profile photo, resume, theme, projects and media.

import process from "node:process";
import { fileURLToPath } from "node:url";

export const profileContent = {
  hero: {
    eyebrow: "Bridging Technology, Intelligence & Creative Innovation.",
    title: "Liju Pankaj",
    positioning: "IT & Creative Technology Leader",
    supportingText: "Enterprise Software Architecture • Artificial Intelligence • Digital Transformation • Creative Innovation",
    introduction: "I am a UAE-based IT and creative technology professional with over 20 years of experience spanning creative design, print production and technology, with a growing focus on enterprise software, business automation and digital infrastructure. I combine technical expertise, problem-solving and design thinking to develop secure, scalable and user-friendly digital solutions.",
    primaryButtonLabel: "Explore My Expertise",
    workButtonLabel: "View My Work",
    contactButtonLabel: "Get in Touch"
  },
  profile: {
    heading: "About me.",
    lead: "I am a multidisciplinary technology professional with extensive experience in information technology, enterprise software development, digital transformation, artificial intelligence and creative design.",
    paragraphs: [
      "My professional journey began in the creative industry and has evolved into a combination of technology leadership, software engineering, IT infrastructure and intelligent business solutions. I work across the full technology lifecycle, from understanding business requirements and designing system architecture to application development, deployment, security and ongoing optimization.",
      "My strength lies in connecting technical functionality with intuitive design, so that technology remains practical, efficient and accessible. I believe successful digital solutions must be secure, scalable, visually refined and easy to use."
    ],
    pillars: ["Technology leadership", "Enterprise software", "AI & automation", "Creative design"]
  },
  experienceHeading: "Over two decades of experience in the UAE.",
  portfolioIntroduction: "Branding, campaigns, events, exhibitions and digital design, combining creative thinking with careful execution. Technology work is shown only where it can be described without confidential client or business information.",
  contact: { eyebrow: "Open to technology and creative collaborations", heading: "Let’s build something secure, useful and well designed.", buttonLabel: "Get in Touch" },
  footerDescriptor: "IT & Creative Technology Leader · United Arab Emirates",
  navigation: [
    { id: "about", label: "About", href: "#about" },
    { id: "expertise", label: "Expertise", href: "#expertise" },
    { id: "experience", label: "Experience", href: "#experience" },
    { id: "work", label: "Work", href: "#work" },
    { id: "skills", label: "Skills", href: "#skills" },
    { id: "contact", label: "Contact", href: "#contact" }
  ]
};

/** Target portfolio categories, in display order. `from` lists existing category names folded into it. */
export const categoryPlan = [
  { name: "Enterprise Software & Applications", slug: "enterprise-software-applications", from: [] },
  { name: "Web Development", slug: "web-development", from: [] },
  { name: "AI & Automation", slug: "ai-automation", from: [] },
  { name: "IT Infrastructure & Digital Solutions", slug: "it-infrastructure-digital-solutions", from: [] },
  { name: "UI/UX Design", slug: "ui-ux-design", from: [] },
  { name: "Branding & Creative Design", slug: "branding-creative-design", from: ["Brand & Campaign", "Digital & Social", "Hospitality", "Banking & Corporate"] },
  { name: "Events & Exhibitions", slug: "events-exhibitions", from: ["Event & Exhibition"] }
];
/** Projects (matched by name) that belong in a different target category than their old category implies. */
export const projectOverrides = [{ match: /responsive websites/i, category: "UI/UX Design" }];

export function mergeProfile(draft) {
  const next = structuredClone(draft);
  next.hero = { ...next.hero, ...profileContent.hero };
  next.profile = structuredClone(profileContent.profile);
  next.experience = { ...next.experience, heading: profileContent.experienceHeading };
  next.portfolio = { ...next.portfolio, introduction: profileContent.portfolioIntroduction };
  next.contact = { ...next.contact, ...profileContent.contact };
  next.footer = { ...next.footer, descriptor: profileContent.footerDescriptor };
  next.visibility = { ...next.visibility, expertise: true, skills: true, capabilities: false };
  // Expertise and skills: drop any stored copy so the reviewed defaults are used (the CMS fills them in).
  delete next.expertise;
  delete next.skills;
  const existing = new Map((next.navigation?.items ?? []).map((item) => [item.id, item]));
  const items = profileContent.navigation.map((item) => ({ ...item, visible: true }));
  for (const [id, item] of existing) if (!items.some((row) => row.id === id)) items.push({ ...item, visible: id === "innovation" ? item.visible : false });
  next.navigation = { ...next.navigation, items };
  return next;
}

/** Plans category renames/creations and project moves. Never deletes rows; emptied old categories are deactivated. */
export function planCategories(categories, projects) {
  const byName = new Map(categories.map((row) => [row.name, row]));
  const used = new Set();
  const targets = categoryPlan.map((target, position) => {
    const reuse = byName.get(target.name) ?? target.from.map((name) => byName.get(name)).find((row) => row && !used.has(row.id));
    if (reuse) used.add(reuse.id);
    return { ...target, position, reuseId: reuse?.id ?? null, renameFrom: reuse && reuse.name !== target.name ? reuse.name : null };
  });
  const oldToTarget = new Map();
  for (const target of targets) for (const name of [target.name, ...target.from]) { const row = byName.get(name); if (row) oldToTarget.set(row.id, target.name); }
  const moves = [];
  for (const project of projects) {
    const override = projectOverrides.find((rule) => rule.match.test(project.name));
    const target = override?.category ?? (project.category_id ? oldToTarget.get(project.category_id) : undefined);
    const currentTarget = targets.find((row) => row.reuseId === project.category_id)?.name;
    if (target && target !== currentTarget) moves.push({ projectId: project.id, name: project.name, to: target });
  }
  const deactivate = categories.filter((row) => !targets.some((target) => target.reuseId === row.id) && row.is_active).map((row) => ({ id: row.id, name: row.name }));
  return { targets, moves, deactivate };
}

async function main() {
  const apply = process.argv.includes("--apply");
  const { default: postgres } = await import("postgres");
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
  const sql = postgres(process.env.DATABASE_URL, { max: 1, ssl: process.env.DATABASE_SSL === "disable" ? false : "require", connect_timeout: 20 });
  try {
    await sql.begin(async (tx) => {
      const [content] = await tx`select draft_content from public.site_content where singleton for update`;
      const categories = await tx`select id, name, slug, position, is_active from public.categories order by position`;
      const projects = await tx`select id, name, category_id from public.projects order by position`;
      const merged = mergeProfile(content.draft_content);
      const plan = planCategories(categories, projects);
      process.stdout.write(`Draft content: hero → "${merged.hero.title}" / "${merged.hero.positioning}"; navigation → ${merged.navigation.items.filter((i) => i.visible).map((i) => i.label).join(", ")}\n`);
      for (const t of plan.targets) process.stdout.write(`Category ${t.position + 1}. ${t.name}${t.renameFrom ? ` (renamed from "${t.renameFrom}")` : t.reuseId ? " (exists)" : " (new)"}\n`);
      for (const m of plan.moves) process.stdout.write(`Move project "${m.name}" → ${m.to}\n`);
      for (const d of plan.deactivate) process.stdout.write(`Deactivate empty old category "${d.name}"\n`);
      if (!apply) { process.stdout.write("Dry run only. Re-run with --apply to write the draft.\n"); return; }
      await tx`update public.site_content set draft_content = ${tx.json(merged)} where singleton`;
      // Park old slugs/names first so renames never collide with the unique constraints.
      for (const t of plan.targets) if (t.reuseId) await tx`update public.categories set name = ${"tmp-" + t.reuseId}, slug = ${"tmp-" + t.reuseId} where id = ${t.reuseId}`;
      const ids = new Map();
      for (const t of plan.targets) {
        if (t.reuseId) { await tx`update public.categories set name = ${t.name}, slug = ${t.slug}, position = ${t.position}, is_active = true where id = ${t.reuseId}`; ids.set(t.name, t.reuseId); }
        else { const [row] = await tx`insert into public.categories (name, slug, position, is_active) values (${t.name}, ${t.slug}, ${t.position}, true) returning id`; ids.set(t.name, row.id); }
      }
      for (const m of plan.moves) await tx`update public.projects set category_id = ${ids.get(m.to)} where id = ${m.projectId}`;
      for (const d of plan.deactivate) await tx`update public.categories set is_active = false, position = ${100 + d.id} where id = ${d.id}`;
      process.stdout.write("Applied to the private draft. Review /admin, then Publish.\n");
    });
  } finally { await sql.end(); }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
