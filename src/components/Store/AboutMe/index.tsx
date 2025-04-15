import React from "react";
import Image from "next/image";

import Text from "@/components/ui/Text";

import imgr from "@/public/images/store/aboutright.png";
import signature from "@/public/signatureblack.png";

const AboutMe = () => {
  return (
    <div className="bg-[#F6F6F6] px-5">
      <div className="mx-auto w-full max-w-[1267.97px] py-16 flex  flex-wrap gap-6 justify-between items-center">
        <div className="max-w-[545px] space-y-7">
          <Text
            as="h2"
            className="text-[#000000] text-[40px] font-newCourier font-semibold leading-[48.72px]"
          >
            Me
          </Text>

          <Text className="text-[#000000] text-[20px] font-newCourier font-normal leading-[25.64px]">
            Born and raised in Iceland—a land of vast, untamed landscapes—I have
            always been drawn not only to nature’s raw beauty but to the
            textures of human expression hidden within the world’s urban
            landscapes. My work is not just about photography; it is about
            seeing what others overlook
          </Text>

          <Text className="text-[#000000] text-[20px] font-newCourier font-normal leading-[25.64px]">
            Through my photography, I seek not just to showcase street art but
            to highlight the hidden narratives within the cracks of
            civilization—where power is challenged, where identity is reclaimed,
            where history is rewritten by those whose stories would otherwise be
            lost.
          </Text>
          <Text className="text-[#000000] text-[20px] font-newCourier font-normal leading-[25.64px]">
            To document street art is to document rebellion, survival, and the
            refusal to be erased. Walls tell the stories that institutions try
            to silence. In every peeling stencil, in every hurried brushstroke,
            there is an act of defiance, a demand to be remembered.
          </Text>
          <Text className="text-[#000000] text-[20px] font-newCourier font-normal leading-[25.64px]">
            Art, much like human struggle, is ephemeral. A mural that breathes
            life into a forgotten alley today may be covered in gray paint
            tomorrow. But in the moments before erasure, there is a truth, a
            rawness, a testament to existence. My work is an attempt to freeze
            those fleeting expressions—to capture the urgency of creation before
            it is wiped away, to preserve what was never meant to be permanent.
          </Text>
          <Image
            className="max-w-[100px] "
            src={signature}
            alt="Watermark Logo"
          />
        </div>
        <div className="">
          <Image src={imgr} alt="imgr" width={562} height={836} />
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
