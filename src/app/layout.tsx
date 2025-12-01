import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import "./globals.css";

import PageTransitionWrapper from "@/components/PageTransitionWrapper";

export const metadata: Metadata = {
  title: "Kavyalok",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PageTransitionWrapper>
          {children}
          <Analytics />
        </PageTransitionWrapper>
      </body>
    </html>
  );
}
