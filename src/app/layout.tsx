import type { Metadata } from "next";
import "./globals.css";
import LenisInit from "@/components/LenisInit";

export const metadata: Metadata = {
  title: "Gateway — MCP for Slack",
  description: "One Slack agent. Every MCP server. Connect your entire toolchain to Slack through a single integration.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-ink text-paper font-body antialiased">
        <LenisInit />
        {children}
      </body>
    </html>
  );
}
