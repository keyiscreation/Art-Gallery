"use client";
import React from "react";
import Image from "next/image";
import Text from "../ui/Text";
import useShoppingCart from "@/hooks/useShoppingCart";

interface SizeInfo {
  image: string;
  hoverImage: string;
  licenseNumber: string;
}

interface ProductProps {
  product: {
    id: string;
    name: string;
    slugtitle: string;
    price: number;
    image: string;
    hoverImage?: string;
    sizes?: Record<string, SizeInfo>;
  };
}

const QRProduct: React.FC<ProductProps> = ({ product }) => {
  const { cartProducts } = useShoppingCart();

  // 🟡 Find product from the cart using ID or slugtitle
  const cartProduct = cartProducts.find(
    (p) => p.id === product.id || p.slugtitle === product.slugtitle
  );

  // 🟡 Use the selected size if it exists in the cart
  const selectedSize = cartProduct?.size || null;
  const selectedSizeData = selectedSize ? product.sizes?.[selectedSize] : null;

  return (
    <div>
      <div className="mx-auto w-full max-w-[1267.97px] mob:px-5">
        <Text as="h1" className="text-black text-center">
          Product Detail
        </Text>
        <hr className="border-[0.5px] border-black/50 w-full my-5" />

        <div className="flex flex-wrap items-center gap-10 mt-16 mb-14">
          <div className="w-full max-w-[670px] relative">
            <div className="relative w-full h-full">
              {selectedSizeData?.image ? (
                <Image
                  className="w-full max-w-[670px] object-cover"
                  src={selectedSizeData.image}
                  alt={product.name}
                  width={670}
                  height={500}
                />
              ) : (
                <div className="w-full max-w-[670px] h-[500px] bg-gray-100 flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>
          </div>

          <div className="max-w-[500px]">
            <Text className="text-[30px] mb-2 text-[#000000] leading-[48px]">
              <span className="font-semibold">Product Name:</span>{" "}
              {product.name}
            </Text>
            <Text className="text-[26px] text-[#000000] font-normal leading-[33.33px]">
              <span className="font-semibold">Product Price:</span> $
              {product.price}
            </Text>

            <Text className="text-[22px] text-[#000000] font-normal leading-[33.33px] mt-4">
              <span className="font-semibold">Selected Size:</span>{" "}
              {selectedSize ? selectedSize : "Not selected"}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRProduct;
