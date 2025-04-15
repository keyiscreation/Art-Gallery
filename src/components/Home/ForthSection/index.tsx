import React from "react";
import Image from "next/image";

// import bgl from "@/public/images/home4left.png";
// import bgr from "@/public/images/home4right.png";
import Text from "@/components/ui/Text";
import Link from "next/link";
import useHomeData from "@/hooks/UseHomeData";

const ForthSection = () => {
  const homedata = useHomeData();

  if (!homedata) {
    return;
  }
  return (
    <div className="relative flex justify-center">
      <div className=" mob:w-full relative overflow-hidden w-full">
        <Image
          className="absolute left-0 object-cover object-center h-full z-0 custom-scale w-[50%]"
          src={homedata.images.ForthSection1}
          alt="bg"
          fill
        />
        <Image
          className="absolute right-0  object-cover object-center h-full z-0 custom-scale w-[50%]"
          src={homedata.images.ForthSection2}
          alt="bg"
          fill
        />
        <div className="bg-black opacity-40 absolute w-full h-full"></div>
        <div className=" min-h-screen overflow-hidden flex items-center justify-start  px-14 mob:px-5 ">
          <div className="relative z-10 w-full">
            <Text as="h2" className="mb-3 uppercase max-w-[900px] font-light">
              {homedata.fourthSectionTitle}
            </Text>
            <Link href="/store">
              <Text className="text-accent items-center uppercase  underline underline-offset-[3px]">
                {homedata.fourthSectionBtnTitle} <span className="">→</span>{" "}
              </Text>
            </Link>
          </div>
        </div>
      </div>
      {/* <div className="w-[50%] mob:hidden relative overflow-hidden">
       
      </div> */}
    </div>
  );
};

export default ForthSection;
