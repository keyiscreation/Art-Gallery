import React from "react";
import Image from "next/image";

import bgl from "@/public/images/home5bg.png";
import Text from "@/components/ui/Text";
import Link from "next/link";

const FifthSection = () => {
  return (
    <div className="relative ">
      <Image
        className="absolute w-full object-cover object-center h-full z-0 custom-scale"
        src={bgl}
        alt="bg"
      />
      <div className=" min-h-screen overflow-hidden flex items-center justify-start  px-14 mob:px-5 ">
        <div className="relative z-10 w-full">
          <Text as="h2" className="mb-3 uppercase max-w-[900px] font-light">
          What you surround yourself with shapes how you see the world
          </Text>
          <Link href="/store">
            <Text className="text-accent items-center uppercase tracking-[0.7px] underline underline-offset-[3px] ">
            shop artwork <span className="">→</span>{" "}
            </Text>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FifthSection;
