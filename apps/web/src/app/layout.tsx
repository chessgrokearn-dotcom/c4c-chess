export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { AppProviders } from "@/components/app-providers";
const inter = Inter({ subsets: ["latin", "cyrillic"] });
export const metadata: Metadata = {
  title: "C4C Chess",
  description: "Play chess, earn C4C tokens on BSC",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}