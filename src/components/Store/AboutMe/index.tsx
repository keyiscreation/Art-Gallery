import React from "react";
import Image from "next/image";

import Text from "@/components/ui/Text";

import imgr from "@/public/images/store/aboutright.png";

const AboutMe = () => {
  return (
    <div className="bg-[#F6F6F6] px-5">
      <div className="mx-auto w-full max-w-[1267.97px] py-16 flex  flex-wrap gap-6 justify-between items-center">
        <div className="max-w-[545px] space-y-7">
          <Text
            as="h2"
            className="text-[#000000] text-[38px] font-futurapt font-medium leading-[48.72px]"
          >
            Hey, I’m Nate
          </Text>

          <Text className="text-[#000000] text-[20px] font-futurapt font-normal leading-[25.64px]">
            I started with photography as a way to clear my head during a tough
            time in my life. It helped me live in the moment, and focus on what
            really matters. Standing on a summit watching the sun fade beyond
            the horizon, and the stars slowly emerge from the inky blackness
            consumes you on a level that&apos;s nearly indescribable. Taking
            those feelings and attempting to freeze them into a single still
            frame is an incredible challenge, and an experience that I&apos;ve
            found truly motivates me to get out and experience the world.
          </Text>

          <Text className="text-[#000000] text-[20px] font-futurapt font-normal leading-[25.64px]">
            When I began, I did that for me. It was my way of forcing myself to
            look at a moment from every angle, and truly experience the moment I
            was in, As I grew in my photography I had several people ask where
            they could buy these prints, and while the concept was foreign, the
            compliment is immense.
          </Text>
          <Text className="text-[#000000] text-[20px] font-futurapt font-normal leading-[25.64px]">
            I hope that you enjoy what you see, and above all that it encourages
            you to get outside, see the beautiful planet we all live on, and
            experience moments of your own. And if you feel inclined to hang one
            of my pictures on your wall, then you were with me when I took that
            shot, at least in spirit.
          </Text>
        </div>
        <div className="">
          <Image src={imgr} alt="imgr" width={562} height={836} />
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
