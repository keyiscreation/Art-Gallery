import React from "react";
import Image from "next/image";

import Text from "../ui/Text";

// import print1 from "@/public/images/prints/related1.png";
// import print2 from "@/public/images/prints/related2.png";

import productsData from "@/lib/constants/ProductsData";
import { useRouter } from "next/navigation";

const RelatedProducts = () => {
  const router = useRouter();

  const handleNavigation = (slugtitle: string) => {
    const slug = slugtitle;
    router.push(`/products/${slug}`);
  };

  return (
    <div className="pt-10 pb-16">
      <Text as="h2" className="text-black text-[36px] leading-[46.15px]">
        You Might Also Like
      </Text>

      <div className="flex gap-10 justify-between mt-7">
        {productsData.slice(5, 8).map((product) => (
          <div key={product.id} className="w-full max-w-[395px]">
            <Image
              className="w-full object-cover h-[285px] cursor-pointer"
              src={product.image}
              alt={product.title}
              onClick={() => handleNavigation(product.slugtitle)}
            />

            <Text className="text-[24px] text-black text-center font-medium leading-[30.77px] mt-4">
              {product.title}
            </Text>
            <Text className="text-[18px] text-black text-center leading-[23px] mt-1">
              ${product.price}
            </Text>
          </div>
        ))}

        {/* <div className="w-full max-w-[395px]">
          <Image
            className="w-full object-cover h-[285px]"
            src={print2}
            alt="print1"
          />

          <Text className="text-[24px] text-black text-center font-medium leading-[30.77px] mt-4">
            Morning Reflections
          </Text>
          <Text className="text-[18px] text-black text-center leading-[23px] mt-1">
            From $250.00
          </Text>
        </div>
        <div className="w-full max-w-[395px]">
          <Image
            className="w-full object-cover h-[285px]"
            src={print1}
            alt="print1"
          />

          <Text className="text-[24px] text-black text-center font-medium leading-[30.77px] mt-4">
            Morning Reflections
          </Text>
          <Text className="text-[18px] text-black text-center leading-[23px] mt-1">
            From $250.00
          </Text>
        </div> */}
      </div>
    </div>
  );
};

export default RelatedProducts;
