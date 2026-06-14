import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus Life Business Lab",
  description: "An accessibility-first business learning platform for doing business together.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Business Lab",
    statusBarStyle: "default"
  }
};

export const viewport: Viewport = {
  themeColor: "#ffd166",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
