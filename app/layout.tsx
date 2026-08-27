import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: "What Do You See in a Melon? | FAMA",
  description: "From Agricultural Data to Digital Experience — an immersive FAMA presentation.",
  icons: {
    icon: "/favicon.svg?v=2",
    shortcut: "/favicon.svg?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-MY">
      <head>
        <link rel="preload" href="/assets/earls-favourite-melon.glb" as="fetch" type="model/gltf-binary" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Script
          src="https://nexus.sisda.my/widget.js"
          data-project="22222222-2222-2222-2222-222222222222"
          data-key="nxai_widget_test123"
          data-agent="b1160157-2af5-4d5d-8341-17eee18c8610"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
