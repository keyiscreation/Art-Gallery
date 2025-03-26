import React from "react";
import Image from "next/image";
import Link from "next/link";

import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import useHomeData from "@/hooks/UseHomeData";

const SecondSection = () => {
  const homedata = useHomeData();

  if (!homedata) {
    return;
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center custom-scale">
      <Image
        className="absolute w-full object-cover object-center h-full z-0"
        src={homedata.images.SecondSection}
        alt="Second Section Background"
        fill
      />

      <div className="relative z-10 w-full">
        <Text as="h1" className="text-center">
          {homedata.secondSectionTitle}
        </Text>

        <div className="flex justify-center">
          <Link className="max-w-[273px] w-full" href="/store">
            <Button className="mt-4">{homedata.secondSectionBtnTitle}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SecondSection;
