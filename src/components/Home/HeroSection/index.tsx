import React from "react";
import Image from "next/image";

import useHomeData from "@/hooks/UseHomeData";

// import bg from "@/public/images/herobg.png";
// import bgshadow from "@/public/images/heroshadow.png";
import Spinner from "@/components/ui/Spinner";

const HeroSection = () => {
  const homedata = useHomeData();

  if (!homedata) {
    return <Spinner />;
  }
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Image
        className="absolute w-full object-cover object-center h-full"
        src={homedata.images.HerosectionImage2}
        alt="bg"
        fill
      />
      <Image
        className="absolute w-full object-cover object-center "
        src={homedata.images.HerosectionImage1}
        alt="bgshadow"
        width={200}
        height={200}
      />
      <div className="absolute w-full h-full bg-black/30"></div>
    </div>
  );
};

export default HeroSection;
