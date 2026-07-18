import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

// Font brand - menggunakan Quicksand sesuai permintaan
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s — NATURA",
    default: "NATURA — Belajar Farmakognosi",
  },
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
    <html lang="id" className={quicksand.variable}>
      <body>{children}</body>
    </html>
  );
}
