import React from "react";
import Image from "next/image";

import bg3 from "@/public/images/thirdsectionbg.png";
import Text from "@/components/ui/Text";
import Link from "next/link";

const ThirdSection = () => {
  return (
    <div className="relative ">
      <Image
        className="absolute w-full object-cover object-center h-full z-0 custom-scale"
        src={bg3}
        alt="bg"
      />
      <div className=" min-h-screen overflow-hidden flex items-center justify-start  px-14 mob:px-5 ">
        <div className="relative z-10 w-full">
          <Text as="h2" className="mb-3 font-light">
            LIMITED EDITION PRINTS
          </Text>
          <Link href="/store" ><Text className="text-accent items-center uppercase tracking-[0.7px]">SHOP PRINTS  <span className="ml-[2px]">→</span> </Text></Link>
        </div>
      </div>
    </div>
  );
};

export default ThirdSection;
