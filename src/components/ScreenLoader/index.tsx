"use client";

import Image from "next/image";
import logo from "@/public/logo.png";
import Text from "../ui/Text";

export default function ScreenLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
      <div className="loader-logo-zoom relative h-20 w-40 mb-2">
        <Image src={logo} alt="logo" className="object-contain w-full h-full" />
      </div>
      {/* Golden line: spreads from center while loading */}
      <div className="loader-line my-5 h-px w-20 bg-[#D4AF37]" />
      <Text className="loader-welcome-zoom text-center font-medium uppercase tracking-[0.35em] text-white mt-2">
        WELCOME
      </Text>
    </div>
  );
}
