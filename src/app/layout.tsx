import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/lib/query-client";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Mobile-optimized viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0a0a0a',
  viewportFit: 'cover',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://roboticsdiu.club'),
  title: "DIU Robotics Club | Dhaka International University",
  description: "Official portal of DIU Robotics Club (DIURC) - Learn, Build & Innovate. Join competitive LFR, Robo Soccer, and embedded systems innovation.",
  keywords: [
    "DIU Robotics Club",
    "DIURC",
    "Robotics",
    "Line Follower Robot",
    "LFR",
    "Robo Soccer",
    "Combat Robotics",
    "Embedded Systems",
    "IoT",
    "Drones",
    "Autonomous Systems",
    "Dhaka International University",
    "DIU",
  ],
  authors: [{ name: "DIU Robotics Club" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "DIU Robotics Club | Dhaka International University",
    description: "Official portal of DIU Robotics Club (DIURC) - Learn, Build & Innovate. Join competitive LFR, Robo Soccer, and embedded systems innovation.",
    type: "website",
    siteName: "DIU Robotics Club",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "DIU Robotics Club Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DIU Robotics Club | Dhaka International University",
    description: "Official portal of DIU Robotics Club (DIURC) - Learn, Build & Innovate. Join competitive LFR, Robo Soccer, and embedded systems innovation.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
