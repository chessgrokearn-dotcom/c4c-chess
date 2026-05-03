// apps/web/src/app/layout.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { AppProviders } from "@/components/app-providers";
import { CONFIG } from "@/lib/config";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: CONFIG.APP_NAME,
  description: CONFIG.APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}