import type { Metadata, Viewport } from "next";
import { Inter, Outfit, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";

// Fonts configuration
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex",
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: "Lifting Social - Pre-Order Elite Gym Shaker",
  description: "Built for Those Who Lift. Reserve your limited-edition Elite Gym Shaker now.",
  keywords: ["Lifting Social", "gym shaker", "protein shaker", "fitness bottle", "pre-order"],
  openGraph: {
    title: "Lifting Social - Pre-Order Elite Gym Shaker",
    description: "Built for Those Who Lift. Reserve your limited-edition Elite Gym Shaker now.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} ${ibmPlexSans.variable} antialiased bg-white text-slate-900`}
      >
        <AnnouncementBar />
        {children}
      </body>
    </html>
  );
}
