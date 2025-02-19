import React from "react";
import Image from "next/image";

import Text from "@/components/ui/Text";

import productsData from "@/lib/constants/ProductsData";

// const products = [
//   {
//     id: 1,
//     title: "Two Infinities, And Beyond",
//     price: "$0.00",
//     image: product,
//   },
//   {
//     id: 2,
//     title: "Infinite Possibilities",
//     price: "$10.99",
//     image: product,
//   },
//   {
//     id: 3,
//     title: "Beyond The Horizon",
//     price: "$20.99",
//     image: product,
//   },
// ];

const Products = () => {
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
              className="max-h-[313.93px] w-full object-cover"
              src={product.image}
              alt={product.title}
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
