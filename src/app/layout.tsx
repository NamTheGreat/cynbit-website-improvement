import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cynbit Architecture Studio | Interactive Project & Cost Estimator",
  description:
    "Interactive enterprise solution scoping, tech stack configuration, and real-time cost estimation by Cynbit Technologies.",
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
      <body className="antialiased min-h-screen flex flex-col glow-gradient selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
