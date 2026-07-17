import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Font brand — dulu hanya disebut di CSS tapi tak pernah dimuat, sehingga
// UI jatuh ke font sistem. Sekarang dimuat sungguhan dan diikat ke --font-sans.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

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
    <html lang="id" className={jakarta.variable}>
      <body>
        {children}
        <span className="mockup-ribbon">PURWARUPA · MOCKUP</span>
      </body>
    </html>
  );
}
