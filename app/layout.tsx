import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "iRecord — Marine mammal sightings",
  description: "Mobile field records for boat-based marine mammal surveys.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"><body>{children}</body></html>
  );
}
