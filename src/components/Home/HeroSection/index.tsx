import React from "react";
import Image from "next/image";

import bg from "@/public/images/herobg.png";
import bgshadow from "@/public/images/heroshadow.png";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Image
        className="absolute w-full object-cover object-center h-full"
        src={bg}
        alt="bg"
      />
      <Image
        className="absolute w-full object-cover object-center "
        src={bgshadow}
        alt="bgshadow"
      />
      <div className="absolute w-full h-full bg-black/30"></div>
    </div>
  );
};

export default HeroSection;
