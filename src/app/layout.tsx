import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { nastaliq, naskh } from "./fonts";
import { PaperFilters } from "@/components/paper";
import "./globals.css";

export const metadata: Metadata = {
  title: "Write Pad",
  description: "A web notepad that feels like writing on a living sheet of 1930s cartoon paper.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="auto" className={`${nastaliq.variable} ${naskh.variable}`}>
      <body className="min-h-screen antialiased">
        <PaperFilters />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
