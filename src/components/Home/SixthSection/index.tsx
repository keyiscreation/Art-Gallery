import React from "react";
import Image from "next/image";
import Link from "next/link";

import bgl from "@/public/images/home6bg.png";
import Text from "@/components/ui/Text";

const SixthSection = () => {
  return (
    <div className="relative ">
      <Image
        className="absolute w-full object-cover object-center h-full z-0 custom-scale"
        src={bgl}
        alt="bg"
      />
      <div className=" min-h-screen overflow-hidden flex items-center justify-start  px-14 mob:px-5 ">
        <div className="relative z-10 w-full">
          <Text as="h2" className="mb-3">
          LIMITED EDITION PRINTS
          </Text>
          <Link href="#">
            <Text className="text-accent items-center uppercase tracking-[0.7px]">
            SHOP PRINTS <span className="ml-[2px]">→</span>{" "}
            </Text>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SixthSection;
