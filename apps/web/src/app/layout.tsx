// apps/web/src/app/layout.tsx
// ⚠️ ОТКЛЮЧАЕМ СТАТИЧЕСКУЮ ГЕНЕРАЦИЮ ДЛЯ ВСЕГО ПРИЛОЖЕНИЯ
export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "C4C Chess",
  description: "Play chess, earn C4C tokens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}