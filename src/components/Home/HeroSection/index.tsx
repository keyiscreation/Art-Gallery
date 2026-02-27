import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import Text from "@/components/ui/Text";
// import bg from "@/public/images/herobg.png";
import bgshadow from "@/public/images/heroshadow.png";
import Button from "@/components/ui/Button";

const HeroSection = () => {
  // const homedata = useHomeData();
  const CYCLE_MS = 5000;
  const homedata = {
    images: {
      HerosectionImage1: "/images/hero-slider/1.jpg",
      HerosectionImage2: "/images/hero-slider/2.jpg",
      HerosectionImage3: "/images/hero-slider/3.jpg"
    },
  };
  const [currentImage, setCurrentImage] = useState(0);

  // if (!homedata) {
  //   return <Spinner />;
  // }

  const images = useMemo(() => {
    if (!homedata?.images) return [];

    return Object.entries(homedata.images)
      .filter(([key, value]) => key.startsWith("HerosectionImage") && Boolean(value))
      .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
      .map(([, value]) => value);
  }, [homedata]);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, CYCLE_MS);

    return () => clearInterval(interval);
  }, [images, CYCLE_MS]);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ ["--hero-cycle" as string]: `${CYCLE_MS}ms` }}
    >
      <div className="absolute inset-0 z-10 bg-black/30" />
      {images.map((image, index) => (
        <Image
          key={`${image}-${index}`}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${index === currentImage ? "opacity-100 bg-slow-zoom" : "opacity-0"
            }`}
          src={image}
          alt={`hero image ${index + 1}`}
          fill
          priority={index === 0}
        />
      ))}

      <Image
        className="absolute inset-0 z-20 h-full w-full object-cover object-center"
        src={bgshadow}
        alt="bgshadow"
        width={200}
        height={200}
      />
      <div className="absolute inset-0 z-30 flex items-center justify-center  md:pt-[100px] px-6">
        <div className="flex  max-w-[1000px]  flex-col items-center gap-10 text-center">
          <Text className="text-centertext-[20px] font-normal leading-[25.64px] text-[#FFFFFF]">
            Limited edition photographic prints on museum-quality fine art paper.
            Each piece comes with a certificate of authenticity and edition number.
          </Text>

          <Button
            type="button"
            className="border border-white/70 bg-white/10 backdrop-blur-md py-5 text-[20px] text-white transition "
          >
            EXPLORE COLLECTION
          </Button>
        </div>
      </div>
    </div >
  );
};

export default HeroSection;
