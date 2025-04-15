import React from "react";
import Image from "next/image";

// import bg3 from "@/public/images/thirdsectionbg.png";
import Text from "@/components/ui/Text";
import Link from "next/link";
import useHomeData from "@/hooks/UseHomeData";

const ThirdSection = () => {
  const homedata = useHomeData();

  if (!homedata) {
    return;
  }
  return (
    <div className="relative ">
      <Image
        className="absolute w-full object-cover object-center h-full z-0 custom-scale"
        src={homedata.images.ThirdSection}
        alt="bg"
        fill
      />
      <div className=" min-h-screen overflow-hidden flex items-center justify-start  px-14 mob:px-5 ">
        <div className="relative z-10 w-full">
          <Text as="h2" className="mb-3 font-light">
            {homedata.thirdSectionTitle}
          </Text>
          <Link href="/store">
            <Text className="text-accent items-center uppercase ">
              {homedata.thirdSectionBtnTitle}{" "}
              <span className="ml-[2px]">→</span>{" "}
            </Text>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThirdSection;
