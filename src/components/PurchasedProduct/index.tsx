"use client";
import React from "react";
import Image from "next/image";

import Text from "../ui/Text";

interface ProductProps {
  product: {
    id: string;
    name: string;
    slugtitle: string;
    price: number;
    image?: string;
    licenseNumber?: string;
    sizes: string[];
  };
}

const PurchasedProduct: React.FC<ProductProps> = ({ product }) => {
  // console.log(product.licenseNumber);
  return (
    <div>
      <div className="mx-auto w-full max-w-[1267.97px] mob:px-5 my-[100px]">
        <Text as="h1" className="text-black text-center font-futurapt">
          Purchased Product
        </Text>
        <Text as="h2" className="text-black text-[40px] text-center">
          License Number: {product.licenseNumber}
        </Text>
        <hr className="border-[0.5px] border-black/50 w-full my-5" />

        <div className=" mt-16 mb-14 flex justify-between items-center">
          <div className="w-full max-w-[670px] relative">
            {/* Image container with watermark */}
            <div className="relative w-full h-full">
              {/* Image with watermark */}

              {product.image ? (
                <Image
                  className="w-full max-w-[670px] object-cover"
                  src={product.image}
                  alt={product.name}
                  width={670}
                  height={500}
                  onContextMenu={(e) => e.preventDefault()}
                  draggable="false"
                />
              ) : (
                <div className="text-red-500 text-center">
                  No image available
                </div>
              )}

              {/* Watermark logo */}
              {/* <div className="absolute inset-0 flex justify-center items-center  pointer-events-none z-20">
                <Image className="w-full" src={logo} alt="Watermark Logo" />
              </div> */}
            </div>
          </div>

          <div className="w-full max-w-[465px]">
            <Text className="text-[38px] text-[#000000] font-semibold font-futurapt leading-[48px]">
              {product.name}
            </Text>
            <Text className="text-[26px] text-[#000000] font-normal font-futurapt leading-[33.33px]">
              Price ${product.price}
            </Text>
            <Text className="text-[18px] text-[#000000] font-normal font-futurapt leading-[23.08px] mt-3">
              {product.name}
            </Text>
          </div>
        </div>

        {/*  */}

        {/* more info */}
        <Text className="text-[#000000] text-[20px] font-normal leading-[25px] mt-5">
          For more information, please see Print Sizing Guide.
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
      </div>
    </div>
  );
};

export default PurchasedProduct;
