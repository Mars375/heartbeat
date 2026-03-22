import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Heartbeat — Modern Status Pages",
  description: "Monitor uptime, manage incidents, and share beautiful status pages with your users.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
