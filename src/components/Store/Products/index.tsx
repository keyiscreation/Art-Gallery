"use client";
import React from "react";
import Image from "next/image";

import Text from "@/components/ui/Text";

import productsData from "@/lib/constants/ProductsData";
import { useRouter } from "next/navigation";

import imghover from "@/public/images/store/Mask group (5).png";
import logo from "@/public/logo.png";

const Products = () => {
  const router = useRouter();

  const handleNavigation = (slugtitle: string) => {
    const slug = slugtitle;
    router.push(`/products/${slug}`);
  };

  return (
    <div className="mx-auto w-full max-w-[1267.97px] mob:px-5">
      <Text as="h1" className="text-black text-center">
        STORE
      </Text>

      <hr className="border-[0.5px] border-black/50 w-full my-5" />

      {/* products */}
      <div className="flex flex-wrap mob:justify-center mt-16 gap-[30px] justify-start mob:gap-[20px] mb-16">
        {productsData.map((product) => (
          <div key={product.id} className="w-full max-w-[401.99px]">
            {/* Image container with hover effect */}
            <div className="relative w-full">
              {/* First image (default image) */}
              <div className="relative w-full h-full">
                {/* First image (default image) */}
                <Image
                  className="max-h-[313.93px] w-full object-cover cursor-pointer transition-opacity duration-1000 ease-in-out"
                  src={product.image}
                  alt={product.title}
                  onClick={() => handleNavigation(product.slugtitle)}
                  width={401.99}
                  height={313.93}
                  onContextMenu={(e) => e.preventDefault()}
                />

                {/* Watermark logo */}
                <div className="absolute inset-0 flex justify-center items-center opacity-80 pointer-events-none z-20">
                  <Image
                    className="max-w-[100px] max-h-[100px]" // Adjust size of watermark logo
                    src={logo} // Replace with your logo source
                    alt="Watermark Logo"
                  />
                </div>

                {/* Second image (hovered image) */}
                <Image
                  className="absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-1000 ease-in-out opacity-0 hover:opacity-100"
                  src={imghover}
                  alt={product.title}
                  onClick={() => handleNavigation(product.slugtitle)}
                  width={401.99}
                  height={313.93}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
            </div>

            {/* Product details */}
            <div className="flex justify-between items-start mt-6">
              <Text className="text-[#000000] text-[24px] leading-[30.77px] font-futurapt font-medium max-w-[169px] mob:text-[20px] mob:leading-[25.64px]">
                {product.title}
              </Text>
              <div className="bg-[#EBF1E0] px-3 py-1 max-h-[44.07px] flex items-center rounded-full">
                <Text className="text-[#000000] text-[24px] leading-[30.77px] font-futurapt font-medium mob:text-[20px] mob:leading-[25.64px]">
                  ${product.price}
                </Text>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
