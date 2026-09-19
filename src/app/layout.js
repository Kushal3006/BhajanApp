import { Geist, Geist_Mono } from "next/font/google";
import ClientShell from "@/components/ClientShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bhakti | Devotional Bhajans",
  description: "Browse, play, and save devotional bhajans, aartis, stotras, mantra chants, and offline-ready spiritual content.",
  applicationName: "Bhakti",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-50 pb-20">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
