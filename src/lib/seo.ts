import type { Metadata } from "next";
import type { PublishedSnapshot } from "@/types/cms";

export const siteUrl = "https://lijupankaj.com";
export const seoTitle = "Liju Pankaj | IT & Creative Technology Leader | UAE";
export const seoDescription = "Liju Pankaj is a UAE-based IT and creative technology professional specializing in enterprise software, ERP, AI automation, cloud infrastructure, digital transformation, and design.";
export const siteName = "Liju Pankaj";
export const knowsAbout = ["Information Technology", "Enterprise Software", "ERP Systems", "Software Architecture", "Artificial Intelligence", "Business Automation", "Digital Transformation", "Cloud Infrastructure", "Cybersecurity", "Web Development", "UI/UX Design", "Graphic Design", "Brand Identity", "Event & Exhibition Design"];

export const seoMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: { absolute: seoTitle, template: "%s | Liju Pankaj" },
  description: seoDescription,
  alternates: { canonical: "/" },
  authors: [{ name: "Liju Pankaj", url: siteUrl }],
  creator: "Liju Pankaj",
  publisher: "Liju Pankaj",
  category: "Technology and Creative Portfolio",
  keywords: ["Liju Pankaj", "Liju Pankaj UAE", "IT professional", "enterprise software", "ERP", "AI automation", "digital transformation", "creative technology", "graphic design"],
  icons: [
    { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
    { rel: "icon", url: "/favicon.png", type: "image/png" },
  ],
  openGraph: {
    title: seoTitle,
    description: seoDescription,
    url: "/",
    siteName,
    type: "profile",
    locale: "en_AE",
    images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: "Liju Pankaj, IT & Creative Technology Leader, United Arab Emirates" }],
  },
  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: seoDescription,
    images: ["/opengraph-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export function buildStructuredData(snapshot: PublishedSnapshot) {
  const { sections, projects } = snapshot;
  const profileImage = sections.hero.profileMediaId
    ? `${siteUrl}/api/media/${sections.hero.profileMediaId}`
    : new URL(sections.hero.profileFallbackUrl, siteUrl).toString();
  const personId = `${siteUrl}/#person`;

  const portfolioItems = projects.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "CreativeWork",
      name: project.name,
      description: project.overview,
      dateCreated: project.year,
      genre: project.category?.name ?? "Design",
      creator: { "@id": personId },
      image: project.images[0] ? `${siteUrl}/api/media/${project.images[0].media.id}` : undefined,
    },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        alternateName: "Liju Pankaj - IT & Creative Technology Leader",
        description: seoDescription,
        inLanguage: "en-AE",
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profile-page`,
        url: siteUrl,
        name: seoTitle,
        description: seoDescription,
        dateModified: snapshot.publishedAt ?? undefined,
        isPartOf: { "@id": `${siteUrl}/#website` },
        mainEntity: { "@id": personId },
        primaryImageOfPage: { "@type": "ImageObject", contentUrl: profileImage },
        hasPart: { "@id": `${siteUrl}/#selected-work` },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: "Liju Pankaj",
        url: siteUrl,
        image: profileImage,
        jobTitle: "IT & Creative Technology Professional",
        description: "UAE-based technology professional specializing in enterprise software, AI, digital transformation, IT infrastructure, and creative technology.",
        email: `mailto:${sections.contact.email}`,
        address: { "@type": "PostalAddress", addressCountry: "AE" },
        homeLocation: { "@type": "Country", name: "United Arab Emirates" },
        knowsLanguage: sections.education.languages,
        knowsAbout,
        alumniOf: sections.education.items.map((item) => ({
          "@type": "EducationalOrganization",
          name: item.institution,
        })),
        hasOccupation: {
          "@type": "Occupation",
          name: "IT & Creative Technology Professional",
          occupationLocation: { "@type": "Country", name: "United Arab Emirates" },
          skills: sections.expertise.groups.map((group) => group.title).join(", "),
        },
      },
      {
        "@type": "ItemList",
        "@id": `${siteUrl}/#selected-work`,
        name: "Selected Work",
        numberOfItems: portfolioItems.length,
        itemListElement: portfolioItems,
      },
    ],
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
