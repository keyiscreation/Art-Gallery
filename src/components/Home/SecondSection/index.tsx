import React from "react";
import Image from "next/image";

import bg from "@/public/images/secondbg.png";
import bgshadow from "@/public/images/secondshadow.png";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";

const SecondSection = () => {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center custom-scale">
      <Image
        className="absolute w-full object-cover object-center h-full z-0"
        src={bg}
        alt="bg"
      />
      <Image
        className="absolute w-full object-cover object-center z-0"
        src={bgshadow}
        alt="bgshadow"
      />
      <div className="absolute w-full h-full bg-black/10"></div>

      <div className="relative z-10 w-full max-w-[358px]">
        <Text as="h1" className="text-center">
          LOREM IPSUM
        </Text>
        <Button className="mx-auto mt-4">LIMITED EDITION</Button>
      </div>
    </div>
  );
};

export default SecondSection;
