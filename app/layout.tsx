import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NATURA — Belajar Farmakognosi",
  description:
    "Augmented reality untuk pembelajaran Farmakognosi siswa SMK Farmasi.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1537f9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        {children}
        <span className="mockup-ribbon">PURWARUPA · MOCKUP</span>
      </body>
    </html>
  );
}
