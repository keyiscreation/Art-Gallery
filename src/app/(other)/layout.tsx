import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar/NavbarStore";
import Footer from "@/components/Footer/FooterStore";

export const metadata: Metadata = {
  title: "Art Gallery",
  description: "Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
