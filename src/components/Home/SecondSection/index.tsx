import React from "react";
import Image from "next/image";

import bg from "@/public/images/secondbg.png";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import Link from "next/link";

const SecondSection = () => {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center custom-scale">
      <Image
        className="absolute w-full object-cover object-center h-full z-0"
        src={bg}
        alt="bg"
      />

      <div className="relative z-10 w-full  ">
        <Text as="h1" className="text-center">
          LOREM IPSUM
        </Text>
        
        <div className="flex justify-center">
          <Link className="max-w-[273px] w-full" href="/store">
            <Button className=" mt-4">LIMITED EDITION</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SecondSection;
