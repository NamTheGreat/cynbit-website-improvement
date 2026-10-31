import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cynbit Technologies — Architecture Studio v2.4",
  description:
    "Deterministic cloud orchestration, multi-agent AI framework sizing, and zero-waste infrastructure modeling tailored for high-scale enterprise deployments.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-[#0b0d13] text-[#e2e2eb] cyber-grid-canvas selection:bg-[#00f2fe] selection:text-[#0b0d13]">
        {children}
      </body>
    </html>
  );
}
