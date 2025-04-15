"use client";
import React from "react";
import Image from "next/image";

import Text from "@/components/ui/Text";

import print1 from "@/public/images/store/print1.png";
import print2 from "@/public/images/store/print2.png";
import print3 from "@/public/images/store/print3.png";
import print4 from "@/public/images/store/print4.png";
import print5 from "@/public/images/store/print5.png";
import logo from "@/public/logo.png";

const reviews = [
  {
    id: 1,
    image: print1,
    review:
      "The photo is perfect. It was a housewarming gift for my son and he loves it. He had a party and everyone commented on the photo which I had framed for him and displayed on the wall. He's gotten tons and tons of compliments on the photo and at least a dozen people asked me where I purchased it from. Needless to say, I'm thrilled that I ordered the photo and very, very happy with the quality and speed at which I received it. I wouldn't hesitate to order again!!",
    reviewer: "- Mike Goodwin",
  },
  {
    id: 2,
    image: print2,
    review:
      "Absolutely stunning! The colors and detail are even better in person. I purchased this for my living room, and it has completely transformed the space.",
    reviewer: "- Sarah Thompson",
  },
  {
    id: 3,
    image: print3,
    review:
      "I bought this as a gift for my sister, and she adores it! The quality is top-notch, and it arrived quicker than expected. Would definitely recommend!",
    reviewer: "- James Carter",
  },
  {
    id: 4,
    image: print4,
    review:
      "The print exceeded my expectations! It’s even more beautiful in real life. Shipping was fast, and the packaging was secure.",
    reviewer: "- Emily Brown",
  },
  {
    id: 5,
    image: print5,
    review:
      "This artwork is breathtaking. Every guest in my home has commented on how gorgeous it looks. Worth every penny!",
    reviewer: "- Daniel Smith",
  },
];

const WhatToDo = () => {
  return (
    <div className="py-14 px-5">
      <div className="mx-auto w-full max-w-[1267.97px]">
        <Text
          as="h2"
          className="text-[40px] mb-5 text-center text-black leading-[37px] font-semibold font-newCourier"
        >
          What do I do if a print arrives damaged?
        </Text>

        <div className="mx-auto max-w-[1116px]">
          <Text className="text-center text-[20px] leading-[26px] font-newCourier text-black mt-10 ">
            We’ve all been there: days of eagerly anticipating an item we bought
            online, followed by intense devastation when we see a mangled box on
            our stoop.
          </Text>
          <Text className="text-center text-[20px] leading-[26px] font-newCourier text-black my-2 ">
            Hopefully this won’t happen with your prints, but if it does - don’t
            worry! Simply send me an email at nate@nateinthewild.com and I will
            get a new print shipped out to you{" "}
            <span className="font-bold">immediately*</span>, completely free of
            charge.
          </Text>
          <Text className="text-center text-[20px] leading-[26px] font-newCourier text-black ">
            *”Immediately” only has an asterisk here because sometimes I
            disappear into the wilderness and don’t have cell service. I promise
            you the moment I’m back in civilization I will take care of your
            replacement print.
          </Text>
        </div>

        {/*  */}

        <div className="flex flex-wrap justify-between gap-10 mt-20">
          {reviews.map((review) => (
            <div key={review.id} className="w-full relative max-w-[48%]">
              <div className="relative">
                <Image
                  className="max-h-[331px] w-full object-cover z-0"
                  src={review.image}
                  alt="print"
                  width={508}
                  height={331.93}
                  onContextMenu={(e) => e.preventDefault()}
                />
                {/* Watermark logo */}
                <div className="absolute inset-0 flex justify-center items-end opacity-80 pointer-events-none z-20">
                  <Image
                    className="max-w-[100px] max-h-[100px]" // Adjust size of watermark logo
                    src={logo} // Replace with your logo source
                    alt="Watermark Logo"
                  />
                </div>
              </div>
              <Text className="text-[#000000] font-newCourier text-[20px] leading-[24px] mt-8">
                {review.review}
              </Text>
              <Text className="text-[#000000] font-newCourier text-[20px] leading-[25px] mt-8">
                {review.reviewer}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatToDo;
