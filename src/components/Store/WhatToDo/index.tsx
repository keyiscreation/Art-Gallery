"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

import Text from "@/components/ui/Text";
import logo from "@/public/logo.png";

interface ReviewType {
  id: string;
  image: string;
  review: string;
  reviewer: string;
}

const WhatToDo = () => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);

  const fetchReviews = async () => {
    const querySnapshot = await getDocs(collection(db, "reviews"));
    const fetchedReviews: ReviewType[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ReviewType[];

    setReviews(fetchedReviews);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

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
            worry! Simply send me an email at keyiscreation@gmail.com and I will
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

        {/* Reviews Section */}
        <div className="flex flex-wrap justify-center gap-[108px] mob:gap-10 mt-20">
          {reviews.map((review) => (
            <div key={review.id} className="w-full relative max-w-[45%]">
              <div className="relative">
                <Image
                  className="max-h-[331px] w-full object-cover z-0"
                  src={review.image}
                  alt="print"
                  width={508}
                  height={331.93}
                  onContextMenu={(e) => e.preventDefault()}
                />

                <div className="absolute inset-0 flex justify-center items-end opacity-80 pointer-events-none z-20">
                  <Image
                    className="max-w-[100px] max-h-[100px]"
                    src={logo}
                    alt="Watermark Logo"
                  />
                </div>
              </div>
              <Text className="text-[#000000] font-newCourier text-[20px] leading-[24px] mt-8">
                {review.review}
              </Text>
              <Text className="text-[#000000] font-newCourier text-[20px] leading-[25px] mt-8">
                - {review.reviewer}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatToDo;
