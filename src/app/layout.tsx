import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";


const futurapt = localFont({
  src: [
    {
      path: "../../public/fonts/FuturaPT/FuturaPTLight.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/FuturaPT/FuturaPTMedium.otf",
      weight: "500",
      style: "medium",
    },
    {
      path: "../../public/fonts/FuturaPT/FuturaPTBold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-futurapt",
});
const futura = localFont({
  src: [
   
    {
      path: "../../public/fonts/Futura/Futura Medium.ttf",
      weight: "500",
      style: "medium",
    },
 
  ],
  variable: "--font-futura",
});

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
      <body
        className={` ${futurapt.variable} ${futura.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
