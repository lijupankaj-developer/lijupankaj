import { describe, expect, it } from "vitest";
import { defaultSections } from "@/content/defaults";
import { siteSectionsSchema } from "@/lib/cms/validation";
// @ts-expect-error -- plain ESM operations script without type declarations
import { mergeProfile, planCategories, profileContent } from "../scripts/cms-profile-2026-11.mjs";

function legacyDraft() {
  const draft = structuredClone(defaultSections) as unknown as Record<string, Record<string, unknown>>;
  delete draft.expertise; delete draft.skills;
  delete draft.hero.supportingText; delete draft.hero.workButtonLabel; delete draft.hero.contactButtonLabel;
  delete draft.contact.eyebrow; delete draft.visibility.expertise; delete draft.visibility.skills;
  draft.hero.title = "Senior Graphic Designer";
  draft.contact.phone = "+971 00 000 0000";
  draft.navigation.items = [{ id: "about", label: "About", href: "#about", visible: true }, { id: "innovation", label: "AI Innovation", href: "#innovation", visible: false }];
  return draft;
}

describe("November 2026 profile update script", () => {
  it("produces a draft the CMS accepts, keeping personal details", () => {
    const parsed = siteSectionsSchema.safeParse(mergeProfile(legacyDraft()));
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.hero.title).toBe("Liju Pankaj");
    expect(parsed.data.hero.positioning).toBe("IT & Creative Technology Leader");
    expect(parsed.data.contact.phone).toBe("+971 00 000 0000");
    expect(parsed.data.visibility.capabilities).toBe(false);
    expect(parsed.data.expertise.groups).toHaveLength(6);
    expect(parsed.data.navigation.items.filter((item) => item.visible).map((item) => item.id)).toEqual(["about", "expertise", "experience", "work", "skills", "contact"]);
  });

  it("matches the built-in defaults so fallback and CMS show the same copy", () => {
    expect(defaultSections.hero.introduction).toBe(profileContent.hero.introduction);
    expect(defaultSections.profile).toEqual(profileContent.profile);
    expect(JSON.stringify(mergeProfile(legacyDraft()))).not.toMatch(/nebulix/i);
  });

  it("regroups categories without deleting anything", () => {
    const categories = ["Event & Exhibition", "Brand & Campaign", "Digital & Social", "Hospitality", "Banking & Corporate"].map((name, index) => ({ id: index + 1, name, slug: `c${index}`, position: index, is_active: true }));
    const projects = [
      { id: 10, name: "LEAP", category_id: 1 }, { id: 11, name: "Rove Hotels", category_id: 4 },
      { id: 12, name: "Emirates NBD — Retail Campaigns", category_id: 3 }, { id: 13, name: "CMS & Responsive Websites", category_id: 3 },
      { id: 14, name: "Al Huzaifa Furniture", category_id: 2 }
    ];
    const plan = planCategories(categories, projects);
    expect(plan.targets.map((t: { name: string }) => t.name)).toHaveLength(7);
    expect(plan.targets.find((t: { name: string }) => t.name === "Events & Exhibitions").reuseId).toBe(1);
    expect(plan.targets.find((t: { name: string }) => t.name === "Branding & Creative Design").reuseId).toBe(2);
    expect(plan.moves).toEqual([
      { projectId: 11, name: "Rove Hotels", to: "Branding & Creative Design" },
      { projectId: 12, name: "Emirates NBD — Retail Campaigns", to: "Branding & Creative Design" },
      { projectId: 13, name: "CMS & Responsive Websites", to: "UI/UX Design" }
    ]);
    expect(plan.deactivate.map((d: { name: string }) => d.name)).toEqual(["Digital & Social", "Hospitality", "Banking & Corporate"]);
  });
});
