import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Authentic Intelligence – Credit Tracker",
  description: "On-Call Subscription credit tracker for Authentic Intelligence clients",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
