import type { Metadata } from "next";

import localFont from "next/font/local";

import { AuthProvider } from "@/providers/AuthContext";

import "./globals.css";

const futurapt = localFont({
  src: [
    {
      path: "../../public/fonts/FuturaPT/FuturaPTLight.otf",
      weight: "300",
      style: "light",
    },
    {
      path: "../../public/fonts/FuturaPT/FuturaPTLight.otf",
      weight: "300",
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
      style: "bold",
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

const newCourier = localFont({
  src: [
    {
      path: "../../public/fonts/Courier-New/Courier-New.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Courier-New/Courier New Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-newCourier",
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
        className={` ${futurapt.variable} ${futura.variable} ${newCourier.variable}`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
