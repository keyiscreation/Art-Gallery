import React from "react";
import Image from "next/image";

import Text from "../ui/Text";
import Button from "../ui/Button";

import youtube from "@/public/icons/youtubewhite.svg";
import twiter from "@/public/icons/twitter-white.svg";
import insta from "@/public/icons/instagram-white.svg";
import fb from "@/public/icons/facebook-white.svg";

const Footer = () => {
  return (
    <div className="py-20 mob:px-5 bg-[#000000]">
      <Text
        as="h2"
        className="text-center text-[30px] text-[#FFFFFF] leading-[38.46px] "
      >
        Newsletter
      </Text>
      <Text
        as="h2"
        className="text-center text-[#FFFFFF] font-medium text-[15px] leading-[38.46px] mb-5"
      >
        Get notified when new projects drop.
      </Text>

      <form action="" className="flex justify-center gap-[34px]">
        <input
          placeholder="E-mail Address"
          type="text"
          className="px-3 border-[1px] border-[#FFFFFF] outline-none h-[60px] w-full max-w-[250px] text-[15px] text-[#000000] font-futurapt font-normal placehoder:text-[#000000] "
        />

        <Button className="max-w-[146px]  bg-transparent border border-[#FFFFFF] text-[15px] text-[#FFFFFF] font-futurapt font-normal hover:opacity-100">
          SUBSCRIBE
        </Button>
      </form>

      <Text as="h1" className="text-center text-[#FFFFFF] mt-10">
        Follow
      </Text>
      <div className="flex justify-center items-center gap-5 mt-5">
        <Image
          className="w-[24.52px] h-[24.52px]"
          src={youtube}
          alt="youtube"
        />
        <Image className="w-[24.52px] h-[24.52px]" src={twiter} alt="twiter" />
        <Image className="w-[24.52px] h-[24.52px]" src={insta} alt="insta" />
        <Image className="w-[24.52px] h-[24.52px]" src={fb} alt="fb" />
      </div>
    </div>
  );
};

export default Footer;
