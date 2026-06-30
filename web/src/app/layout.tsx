import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FIFA World Cup 2026 Predictor",
  description: "AI-powered World Cup 2026 predictions using Poisson regression + Monte Carlo simulation. Find out who's most likely to win the World Cup.",
  openGraph: {
    title: "FIFA World Cup 2026 Predictor",
    description: "AI-powered predictions using Poisson ML + Monte Carlo. Who will lift the trophy?",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
