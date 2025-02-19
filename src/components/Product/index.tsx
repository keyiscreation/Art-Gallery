"use client";
import React, { useState } from "react";
import Image from "next/image";

import Text from "../ui/Text";

import productimg from "@/public/images/photos on wall 1.png";
import Button from "../ui/Button";
import RelatedProducts from "./RelatedProducts";
import Link from "next/link";

const sizes = ["Small", "Medium", "Large", "X-Large"];
const Product = () => {
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0]);

  return (
    <div>
      <div className="mx-auto w-full max-w-[1267.97px] mob:px-5">
        <Text as="h1" className="text-black text-center">
          Product Page
        </Text>
        <hr className="border-[0.5px] border-black/50 w-full my-5" />

        <div className="flex flex-wrap items-end gap-10 mt-16 mb-14">
          <div className="w-full max-w-[670px]">
            <Image
              className="w-full max-w-[670px] object-cover"
              src={productimg}
              alt="productimg"
            />
          </div>

          <div className="max-w-[465px]">
            <Text className="text-[38px] text-[#000000] font-semibold font-futura leading-[48px]">
              Two Infinities, And Beyond
            </Text>
            <Text className="text-[26px] text-[#000000] font-normal font-futurapt leading-[33.33px]">
              From $250.00
            </Text>
            <Text className="text-[18px] text-[#000000] font-normal font-futurapt leading-[23.08px] mt-3">
              Two Infinities, And Beyond
            </Text>

            <Text className="text-[16px] text-[#000000]  font-futurapt leading-[20.51px] font-medium mt-8 mb-1">
              Size:
            </Text>
            <select
              className="border border-[#000000] w-full max-w-[307px] h-[66px] p-2 text-[16px] font-futurapt outline-none font-medium"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {sizes.map((size) => (
                <option
                  className="text-[16px] font-futurapt"
                  key={size}
                  value={size}
                >
                  {size}
                </option>
              ))}
            </select>

            <Text className="text-[16px] text-[#000000]  font-futurapt leading-[20.51px] font-medium mt-4 mb-1">
              Quantity:
            </Text>
            <div className="border border-[#000000]/70 w-[77px] h-[65px] flex justify-center items-center">
              <Text className="text-[16px] text-[#000000] leading-[20px]">
                1
              </Text>
            </div>

            <Link className="w-full max-w-[273px]" href="/cart">
              <Button className="bg-[#000000] rounded-[10px] text-[#FFFFFF] font-futurapt font-medium mt-10">
                Add To Cart
              </Button>
            </Link>
          </div>
        </div>

        {/*  */}
        <Text className="text-[#000000] text-[20px] leading-[25.64px] mb-6">
          Standing under a starry night sky and staring into space feels like a
          glimpse into infinity. I remember as a child lying on my my back in
          our backyard, staring up at the stars and feeling like I could fall
          off the earth into eternity. On an amazing calm summer evening near
          Mount Hood, Oregon, we were treated to an absolutely perfect
          reflection of the stars above. With the heavens above reflected below
          I finally didn’t feel separated from the cosmos, but rather enveloped
          in them, floating through infinity.
        </Text>

        <Text className="text-[#000000] text-[20px] font-medium leading-[25px]">
          PRINT SIZES:
        </Text>
        <Text className="text-[#000000] text-[20px] font-normal leading-[25px]">
          The four print sizes offered in this collection are specifically
          chosen to allow for easy framing:
        </Text>
        <Text className="text-[#000000] text-[20px] font-medium leading-[25px]">
          SMALL: <span className="font-normal"> 12&rdquo; x 18&rdquo;</span>
        </Text>
        <Text className="text-[#000000] text-[20px] font-normal leading-[25px]">
          The four print sizes offered in this collection are specifically
          chosen to allow for easy framing:
        </Text>
        <Text className="text-[#000000] text-[20px] font-medium leading-[25px]">
          MEDIUM:{" "}
          <span className="font-normal">
            16&rdquo; x 24&rdquo; *Best Value Price/Size Ratio
          </span>
        </Text>

        <Text className="text-[#000000] text-[20px] font-normal leading-[25px]">
          Edition of 7 includes: A signed certificate of authenticity, with
          edition number.
        </Text>
        <Text className="text-[#000000] text-[20px] font-medium leading-[25px]">
          LARGE: <span className="font-normal">24”x 36</span>
        </Text>
        <Text className="text-[#000000] text-[20px] font-normal leading-[25px]">
          Edition of 3 includes: A signed certificate of authenticity, with
          edition number.
        </Text>
        <Text className="text-[#000000] text-[20px] font-medium leading-[25px]">
          EXTRA LARGE:{" "}
          <span className="font-normal">40&rdquo; x 60&rdquo;</span>
        </Text>

        <Text className="text-[#000000] text-[20px] font-normal leading-[25px]">
          Fully exclusive 1 of 1 edition includes: A signed certificate of
          authenticity, with edition number.
        </Text>

        {/* more info */}
        <Text className="text-[#000000] text-[20px] font-normal leading-[25px] mt-5">
          For more information, please see my Print Sizing Guide.
        </Text>
        <Text className="text-[#000000] text-[20px] font-normal leading-[25px] mt-5">
          Printed on Hahnemühle Photo Rag®, a museum-quality archival paper with
          brilliant colors, deep blacks, striking contrasts and perfect
          reproduction of detail. This acid- and lignin-free paper meets the
          most exacting requirements for age resistance, for photos that last
          several lifetimes. All prints include a signed Certificate of
          Authenticity along with edition number. 
        </Text>
        <Text className="text-[#000000] text-[20px] font-normal leading-[25px] mt-5">
          Ships Worldwide within 5-7 business days.
        </Text>

        <Text className="text-[#000000] text-[20px] font-medium leading-[25px] mt-5">
          Quality Guaranteed:{" "}
          <span className="font-normal">
            {" "}
            If your print arrives damaged, please email me at
            Nate@nateinthewild.com to receive a replacement, absolutely free.
          </span>
        </Text>

        {/* related products */}
        <RelatedProducts />
      </div>
    </div>
  );
};

export default Product;
