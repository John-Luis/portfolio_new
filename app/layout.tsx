import type { Metadata } from "next";
import "./globals.css";

const title = "John Luis V. Mayor | Software & Hardware Developer";
const description = "Computer engineering student building computer vision tools, embedded systems, and automation with Python and C++. Explore projects by John Luis V. Mayor.";

export const metadata: Metadata = {
  title,
  description,
  authors: [{ name: "John Luis V. Mayor" }],
  openGraph: { title, description, type: "website", locale: "en_US", siteName: "John Luis V. Mayor" },
  twitter: { card: "summary", title, description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
