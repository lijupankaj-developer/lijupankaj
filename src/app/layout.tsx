import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { getPublishedSnapshot } from "@/lib/cms/snapshot";
import { themeFontUrl, themeVariables } from "@/lib/cms/theme";
import { seoMetadata } from "@/lib/seo";
import { themeInitScript } from "@/lib/theme-mode";
import "./globals.css";

export const metadata: Metadata = seoMetadata;

export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "light dark" };

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const snapshot = await getPublishedSnapshot();
  const fontUrl = themeFontUrl(snapshot.theme);
  return (
    <html lang="en-AE" style={themeVariables(snapshot.theme)} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeInitScript }} />{fontUrl && <link rel="stylesheet" href={fontUrl} />}</head>
      <body>{children}</body>
    </html>
  );
}
