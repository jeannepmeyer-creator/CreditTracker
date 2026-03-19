import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Authentic Intel – Credit Tracker",
  description: "Track your On-Call Subscription credits",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
