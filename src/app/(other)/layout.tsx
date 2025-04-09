// app/(other)/layout.tsx
import Navbar from "@/components/Navbar/NavbarStore";
import Footer from "@/components/Footer/FooterStore";
import PayPalProvider from "@/providers/PaypalProvider";
import localFont from "next/font/local";
import "./stripe.css";

const futurapt = localFont({
  src: [
    {
      path: "../../../public/fonts/FuturaPT/FuturaPTLight.otf",
      weight: "300",
      style: "light",
    },
    {
      path: "../../../public/fonts/FuturaPT/FuturaPTLight.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../public/fonts/FuturaPT/FuturaPTMedium.otf",
      weight: "500",
      style: "medium",
    },
    {
      path: "../../../public/fonts/FuturaPT/FuturaPTBold.otf",
      weight: "700",
      style: "bold",
    },
  ],
  variable: "--font-futurapt",
});

const futura = localFont({
  src: [
    {
      path: "../../../public/fonts/Futura/Futura Medium.ttf",
      weight: "500",
      style: "medium",
    },
  ],
  variable: "--font-futura",
});

export default function OtherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PayPalProvider>
        <Navbar />
        <div className={`${futurapt.variable} ${futura.variable}`}>
          {children}
        </div>
        <Footer />
      </PayPalProvider>
    </>
  );
}
