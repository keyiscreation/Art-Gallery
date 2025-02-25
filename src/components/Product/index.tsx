"use client";
import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";

import Text from "../ui/Text";

// import productimg from "@/public/images/photos on wall 1.png";
import Button from "../ui/Button";
import RelatedProducts from "./RelatedProducts";
import useShoppingCart from "@/hooks/useShoppingCart";
import { useRouter } from "next/navigation";

import logo from "@/public/watermark.png";
// import { useAtomValue } from "@/jotai/useAtomValue";

interface ProductProps {
  product: {
    id: number;
    title: string;
    slugtitle: string;
    price: string;
    image: StaticImageData;
    sizes: string[];
  };
}
const Product: React.FC<ProductProps> = ({ product }) => {
  // const [cartItems, setCartItems] = useAtomValue("cart");

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [showValidationMessage, setShowValidationMessage] = useState(false);

  const router = useRouter();
  const {
    // cartProducts,
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    // removeFromCart,
    // cartProductsTotalPrice,
  } = useShoppingCart();

  console.log(selectedSize, "selectedSize");
  const onAddToCart = async (id: number) => {
    const quantity = getItemQuantity(id);

    // Show validation message if size is not selected
    if (!selectedSize) {
      setShowValidationMessage(true);
      return;
    }

    // If quantity is already greater than 0, just navigate to the cart
    if (quantity > 0) {
      router.push(`/cart`);
      return;
    }

    // Increase the cart quantity only if item is not already in the cart
    increaseCartQuantity(id);
    router.push(`/cart`);
  };

  const onBuyNow = (id: number) => {
    // const quantity = getItemQuantity(id);
    // if (id === 0 || quantity === 0) {
    //   setShowValidationMessage(true);
    //   return;
    // }
    // router.push(`/checkout`);

    const quantity = getItemQuantity(id);

    // Show validation message if size is not selected
    if (!selectedSize) {
      setShowValidationMessage(true);
      return;
    }

    // If quantity is already greater than 0, just navigate to the cart
    if (quantity > 0) {
      router.push(`/checkout`);
      return;
    }

    // Increase the cart quantity only if item is not already in the cart
    increaseCartQuantity(id);
    router.push(`/checkout`);
  };

  return (
    <div>
      <div className="mx-auto w-full max-w-[1267.97px] mob:px-5">
        <Text as="h1" className="text-black text-center">
          Product Page
        </Text>
        <hr className="border-[0.5px] border-black/50 w-full my-5" />

        <div className="flex flex-wrap items-end gap-10 mt-16 mb-14">
          <div className="w-full max-w-[670px] relative">
            {/* Image container with watermark */}
            <div className="relative w-full h-full">
              {/* Image with watermark */}
              <Image
                className="w-full max-w-[670px] object-cover"
                src={product.image}
                alt={product.title}
                onContextMenu={(e) => e.preventDefault()} // Disable right-click
                draggable="false" // Disable image dragging
              />

              {/* Watermark logo */}
              <div className="absolute inset-0 flex justify-center items-center  pointer-events-none z-20">
                <Image className="w-full" src={logo} alt="Watermark Logo" />
              </div>
            </div>
          </div>

          <div className="w-full max-w-[465px]">
            <Text className="text-[38px] text-[#000000] font-semibold font-futura leading-[48px]">
              {product.title}
            </Text>
            <Text className="text-[26px] text-[#000000] font-normal font-futurapt leading-[33.33px]">
              Price ${product.price}
            </Text>
            <Text className="text-[18px] text-[#000000] font-normal font-futurapt leading-[23.08px] mt-3">
              {product.title}
            </Text>

            <Text className="text-[16px] text-[#000000]  font-futurapt leading-[20.51px] font-medium mt-8 mb-1">
              Size:
            </Text>
            <select
              className="border border-[#000000] w-full max-w-[307px] h-[66px] p-2 text-[16px] font-medium"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {product.sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <Text className="text-[16px] text-[#000000]  font-futurapt leading-[20.51px] font-medium mt-4 mb-1">
              Quantity:
            </Text>
            <div className="border border-[#000000]/70 w-[77px] h-[65px] flex justify-between items-center">
              <button
                onClick={() => decreaseCartQuantity(Number(product.id))}
                className=" px-2 text-[24px]"
              >
                -
              </button>
              <Text className="text-[16px] text-[#000000] leading-[20px] mt-1">
                {getItemQuantity(Number(product.id))}
              </Text>
              <button
                onClick={() => increaseCartQuantity(Number(product.id))}
                className=" px-2 text-[24px]"
              >
                +
              </button>
            </div>

            <div className="flex  tab:gap-5 gap-5 mt-10 w-full">
              <Button
                onClick={() => onAddToCart(Number(product.id))}
                className="bg-[#000000] rounded-[10px] text-[#FFFFFF] font-futurapt font-medium w-full"
              >
                Add To Cart
              </Button>

              <Button
                onClick={() => onBuyNow(Number(product.id))}
                className="bg-[#000000] rounded-[10px] text-[#FFFFFF] font-futurapt font-medium w-full"
              >
                Buy Now
              </Button>
            </div>

            {showValidationMessage && (
              <p className="text-gradient text-[16px] font-jakrata font-medium">
                Please add quantity before adding to cart.
              </p>
            )}
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

        <div className="space-y-1">
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
        </div>

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
