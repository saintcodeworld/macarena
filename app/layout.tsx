import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "$MMGA — Make Macarena Great Again Dashboard",
  description:
    "Make Macarena Great Again! The movement is back. Trending viral videos with the iconic MMGA soundtrack. $MMGA coin — the sound of the current era.",
  icons: {
  icon: [
    { url: "/download (3).png", sizes: "32x32", type: "image/png" },
    { url: "/download (3).png", sizes: "16x16", type: "image/png" },
    { url: "/download (3).png", sizes: "192x192", type: "image/png" },
  ],
  apple: [
    { url: "/download (3).png", sizes: "180x180", type: "image/png" },
  ],
},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
