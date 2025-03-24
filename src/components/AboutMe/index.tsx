import React from "react";
import Image from "next/image";

import Text from "../ui/Text";

import left from "@/public/images/about/left.png";
import center from "@/public/images/about/center.png";
import right from "@/public/images/about/right.png";
import youtube from "@/public/icons/youtube.svg";
import twiter from "@/public/icons/u_twitter.svg";
import insta from "@/public/icons/u_instagram.svg";
import fb from "@/public/icons/u_facebook-f.svg";

const AboutMe = () => {
  return (
    <div>
      <div className="mx-auto w-full max-w-[1267.97px] mob:px-5">
        <div className="flex justify-between">
          
          <Text as="h1" className="text-black text-center mob:text-[24px] mob:leading-[30.77px] mob:mb-5">
            ABOUT ME
          </Text>

          <div className="flex justify-center items-center gap-5 mt-5 mob:hidden">
            <Image
              className="w-[24.52px] h-[24.52px]"
              src={youtube}
              alt="youtube"
            />
            <Image
              className="w-[24.52px] h-[24.52px]"
              src={twiter}
              alt="twiter"
            />
            <Image
              className="w-[24.52px] h-[24.52px]"
              src={insta}
              alt="insta"
            />
            <Image className="w-[24.52px] h-[24.52px]" src={fb} alt="fb" />
          </div>
        </div>
        <hr className="border-[0.5px] border-black/50 w-full my-5 mob:hidden" />

        <Text className="text-black text-[16px] leading-[20px]">
          The World Through My Lens:{" "}
          <span className="font-medium">
            {" "}
            A Story of Street Art and Human Expression{" "}
          </span>
          <br />
          <br />
          Photography is more than capturing a moment—it is about uncovering the
          unspoken narratives of the world, the silent dialogues etched into
          walls, the defiant beauty of urban decay, and the raw human expression
          that refuses to be silenced. Traveling across the globe, from the
          neon-lit backstreets of Tokyo to the crumbling alleyways of Buenos
          Aires, I have sought out art that exists beyond galleries—art that is
          created in the streets, often ephemeral, always honest. My work is a
          reflection of this tension:the fragility of creation in spaces built
          for control.
          <br />
          <br />
          The walls of our cities are not just concrete; they are canvases of
          protest, poetry, and identity. In peeling posters and faded stencils,
          in hurried graffiti and intricate murals, we find traces of voices
          longing to be heard. Each crack in a wall tells a story, each
          brushstroke is an act of defiance against erasure.
          <br />
          <br />
          There is a certain vulnerability and strength in street art—created in
          the open, destined to fade, yet carrying an urgency that demands
          attention. Every photograph is a moment of connection, a fragment of
          time where art and environment merge, revealing the pulse of a place,
          the stories beneath the surface.
          <br />
          <br />
          These images are not just photographs; they are remnants of
          resistance, whispers of an untold revolution. Each piece is a limited
          edition, a unique imprint of time and place, sealed with
          authenticity—a testimony to the power of creation in a world that so
          often erases.
          <br />
          <br />
          To own one of these photographs is not just to collect art—it is to
          hold a moment of truth, a story that might otherwise disappear.
          <br />
          <br />
          The Key is Creation.
        </Text>
        {/* mob social */}
        <div className="mob:block hidden py-5">
          <div className="flex justify-center items-center gap-5 mt-5 ">
            <Image
              className="w-[24.52px] h-[24.52px]"
              src={youtube}
              alt="youtube"
            />
            <Image
              className="w-[24.52px] h-[24.52px]"
              src={twiter}
              alt="twiter"
            />
            <Image
              className="w-[24.52px] h-[24.52px]"
              src={insta}
              alt="insta"
            />
            <Image className="w-[24.52px] h-[24.52px]" src={fb} alt="fb" />
          </div>
        </div>
        {/* mob social end */}
        <div className="flex gap-5 mob:gap-2 mt-6 mb-20">
          <Image className="mob:max-w-[23%]" src={left} alt="left" width={298} height={440} />
          <Image className="mob:max-w-[50%]" src={center} alt="center" width={646.82} height={862.42} />
          <Image className="mob:max-w-[23%]" src={right} alt="right" width={298} height={440} />
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
