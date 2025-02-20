"use client"
import React from "react";
import Image from "next/image";

import Text from "@/components/ui/Text";

import productsData from "@/lib/constants/ProductsData";
import { useRouter } from "next/navigation";

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
            <Image
              className="max-h-[313.93px] w-full object-cover cursor-pointer"
              src={product.image}
              alt={product.title}
              onClick={() => handleNavigation(product.slugtitle)}
              width={401.99}
              height={313.93}
            />

            <div className="flex justify-between items-start mt-6">
              <p className="text-[#000000] text-[24px] leading-[30.77px] font-futurapt font-medium max-w-[169px] mob:text-[20px] mob:leading-[25.64px]">
                {product.title}
              </p>
              <div className="bg-[#EBF1E0] px-3 py-1 max-h-[44.07px] flex items-center rounded-full">
                <p className="text-[#000000] text-[24px] leading-[30.77px] font-futurapt font-medium mob:text-[20px] mob:leading-[25.64px]">
                  {product.price}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
