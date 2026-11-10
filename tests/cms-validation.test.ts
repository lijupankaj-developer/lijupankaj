import { describe, expect, it } from "vitest";
import { defaultSnapshot, defaultTheme } from "@/content/defaults";
import { normalizeTheme, themeVariables } from "@/lib/cms/theme";
import { publishedSnapshotSchema, themeSchema } from "@/lib/cms/validation";

describe("controlled website theme", () => {
  it("accepts the curated default theme and emits bounded CSS tokens", () => {
    expect(themeSchema.safeParse(defaultTheme).success).toBe(true);
    const variables = themeVariables(defaultTheme);
    expect(variables["--hero-heading-max"]).toBe("104px");
    expect(variables["--container"]).toBe("1440px");
  });

  it("rejects dangerous size values and unapproved fonts", () => {
    expect(themeSchema.safeParse({ ...defaultTheme, bodySize: 200 }).success).toBe(false);
    expect(normalizeTheme({ ...defaultTheme, bodyFont: "Untrusted Remote Font" })).toEqual(defaultTheme);
  });
});

describe("published snapshot boundary", () => {
  it("accepts the built-in safe fallback with no portfolio images", () => {
    expect(publishedSnapshotSchema.safeParse(defaultSnapshot).success).toBe(true);
    expect(defaultSnapshot.projects).toEqual([]);
  });

  it("upgrades a snapshot published before the expertise and skills sections existed", () => {
    const legacy = structuredClone(defaultSnapshot) as unknown as { sections: Record<string, unknown> & { hero: Record<string, unknown>; contact: Record<string, unknown>; visibility: Record<string, unknown> } };
    delete legacy.sections.expertise; delete legacy.sections.skills;
    delete legacy.sections.hero.supportingText; delete legacy.sections.hero.workButtonLabel; delete legacy.sections.hero.contactButtonLabel;
    delete legacy.sections.contact.eyebrow; delete legacy.sections.visibility.expertise; delete legacy.sections.visibility.skills;
    const parsed = publishedSnapshotSchema.safeParse(legacy);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.sections.expertise.groups).toHaveLength(6);
    expect(parsed.data.sections.skills.groups.length).toBeGreaterThan(0);
    expect(parsed.data.sections.visibility.expertise).toBe(true);
    expect(parsed.data.sections.hero.workButtonLabel).toBe("View My Work");
  });

  it("rejects unknown expertise icons", () => {
    const snapshot = structuredClone(defaultSnapshot) as unknown as { sections: { expertise: { groups: Array<{ icon: string }> } } };
    snapshot.sections.expertise.groups[0].icon = "javascript:alert(1)";
    expect(publishedSnapshotSchema.safeParse(snapshot).success).toBe(false);
  });

  it("requires meaningful alt text for every published project image", () => {
    const snapshot = structuredClone(defaultSnapshot);
    snapshot.projects = [{
      id: 1, slug: "test-project", name: "Test", client: "Client", year: "2026", category: null,
      overview: "Overview", role: "Role", contribution: "Contribution", deliverables: [], featured: false, position: 0,
      images: [{ id: 1, media: { id: 1, fileName: "test.jpg", storagePath: "user/hash/test.jpg", alt: "", width: 100, height: 100, mimeType: "image/jpeg", variants: {} }, alt: "", caption: "", focalX: 50, focalY: 50, isCover: true, position: 0 }]
    }];
    expect(publishedSnapshotSchema.safeParse(snapshot).success).toBe(false);
  });
});
