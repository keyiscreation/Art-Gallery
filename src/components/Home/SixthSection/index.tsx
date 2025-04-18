import React from "react";
import Image from "next/image";
import Link from "next/link";

// import bgl from "@/public/images/home6bg.png";
import Text from "@/components/ui/Text";
import useHomeData from "@/hooks/UseHomeData";
import Spinner from "@/components/ui/Spinner";

const SixthSection = () => {
  const homedata = useHomeData();

  if (!homedata) {
    return <Spinner />;
  }
  return (
    <div className="relative ">
      <Image
        className="absolute w-full object-cover object-center h-full z-0 custom-scale"
        src={homedata.images.SixthSection}
        alt="bg"
        fill
      />
      <div className=" min-h-screen overflow-hidden flex items-center justify-start  px-14 mob:px-5 ">
        <div className="relative z-10 w-full">
          <Text as="h2" className="mb-3 font-light">
            {homedata.sixthSectionTitle}
          </Text>
          <Link href="/store">
            <Text className="text-accent items-center uppercase tracking-[0.7px] underline underline-offset-[3px]">
              {homedata.sixthSectionBtnTitle} <span className="">→</span>{" "}
            </Text>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SixthSection;
