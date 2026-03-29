import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Manrope, Noto_Serif } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const notoSerif = Noto_Serif({ subsets: ["latin"], variable: "--font-noto-serif", style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: "Heartbeat — Modern Status Pages",
  description: "Monitor uptime, manage incidents, and share beautiful status pages with your users.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={cn("dark", GeistSans.variable, GeistMono.variable, manrope.variable, notoSerif.variable)}>
        <body className="font-sans antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
