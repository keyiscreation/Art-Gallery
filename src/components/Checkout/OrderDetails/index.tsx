"use client";

import React, { Fragment, useState } from "react";
import { useRouter } from "next/navigation";

import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import useShoppingCart from "@/hooks/useShoppingCart";

const OrderDetails = () => {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string>("");

  console.log(setSelectedSize);

  const {
    cartProducts,
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    cartProductsTotalPrice,
  } = useShoppingCart();
  const handleNavigation = (slugtitle: string) => {
    router.push(`/products/${slugtitle}`);
  };
  return (
    <div className="w-full max-w-[455.77px] relative">
      <div className="p-[34px] border border-[#000000]/30 bg-white w-full max-w-[455.77px]">
        <Text
          as="h1"
          className="text-[22px] font-medium leading-[28px] text-black"
        >
          Order Details
        </Text>
        <hr className="border-[0.5px] border-black/40 w-full mt-2 mb-5" />
        {cartProducts.map((product) => (
          <Fragment key={product.id}>
            <div className="flex justify-between">
              <div
                className="flex gap-3 cursor-pointer"
                onClick={() => handleNavigation(product.slugtitle)}
              >
                {/* <Image
                className="w-[66px] max-h-[66px] object-cover"
                src={product.image}
                alt="product"
                width={140}
                height={140}
                onContextMenu={(e) => e.preventDefault()}
                draggable="false"
              /> */}
                <div className="max-w-[106px]">
                  <Text className="text-[14px] font-medium leading-[18px] text-black">
                    {product.title}
                  </Text>
                  <Text className="text-[12px] leading-[15.3px] text-black">
                    Size: {product.size}
                  </Text>
                </div>
              </div>
              <div>
                <Text className="text-[14px] font-medium leading-[18px] text-black text-end">
                  {product.title}
                </Text>
                {/* <div className="flex justify-end">
                  <div className="bg-[#F2F2F2] p-2 max-w-[143.3px] flex justify-between gap-5 my-2">
                    <Text className="font-medium text-black">Qty</Text>
                    <Text className="font-medium text-black">
                      <span
                        onClick={() => decreaseCartQuantity(Number(product.id))}
                        className="mr-2 cursor-pointer text-[20px]"
                      >
                        -
                      </span>
                      {getItemQuantity(Number(product.id))}
                      <span
                        onClick={() => increaseCartQuantity(Number(product.id))}
                        className="ml-2 cursor-pointer"
                      >
                        +
                      </span>
                    </Text>
                  </div>
                </div> */}

                {/* <div className="border border-[#000000]/70 w-[143px] h-[45px] font-newCourier flex justify-between items-center my-2">
                  <button
                    onClick={() =>
                      increaseCartQuantity(product.id, selectedSize)
                    }
                    className="px-2 text-[24px]"
                  >
                    +
                  </button>
                  <Text className="text-[16px] text-[#000000] leading-[20px] font-newCourier">
                    {getItemQuantity(product.id, selectedSize)}
                  </Text>
                  <button
                    onClick={() =>
                      decreaseCartQuantity(product.id, selectedSize)
                    }
                    className="px-2 text-[24px] font-newCourier"
                  >
                    -
                  </button>
                </div> */}
                <div className="border border-[#000000]/70 w-[143px] h-[45px] font-newCourier flex justify-between items-center my-2">
                  <button
                    onClick={() =>
                      increaseCartQuantity(product.id, selectedSize)
                    }
                    className="px-2 text-[24px]"
                  >
                    +
                  </button>
                  <Text className="text-[16px] text-[#000000] leading-[20px] font-newCourier">
                    {getItemQuantity(product.id, selectedSize)}
                  </Text>
                  <button
                    onClick={() =>
                      decreaseCartQuantity(product.id, selectedSize)
                    }
                    className="px-2 text-[24px] font-newCourier"
                  >
                    -
                  </button>
                </div>

                <Text
                  onClick={() => removeFromCart(product.id)}
                  className="text-[12px] font-medium leading-[18px] text-[#FF0000] text-end underline cursor-pointer"
                >
                  Remove
                </Text>
              </div>
            </div>
          </Fragment>
        ))}
        <Text className="text-[10px] text-black mb-[4px] mt-2">
          Gift or Discount Code
        </Text>
        <form className="flex justify-center gap-[24px]">
          <input
            placeholder="E-mail Address"
            type="text"
            className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[45px] w-full max-w-[284px] text-[15px] text-black"
          />
          <Button className="max-w-[83px] h-[45px] bg-transparent border border-[#000000]/30 text-[15px] text-black font-medium hover:opacity-100">
            Apply
          </Button>
        </form>
        <div className="flex justify-between mt-5 mb-2">
          <Text className="text-[14px] font-medium leading-[18px] text-black">
            Subtotal
          </Text>
          <Text className="text-[14px] font-medium leading-[18px] text-black">
            $
            {cartProductsTotalPrice
              ? cartProductsTotalPrice.toFixed(2)
              : "0.00"}
          </Text>
        </div>
        <hr className="border-[0.5px] border-black/40 w-full mt-2 mb-3" />
        <div className="flex justify-between mb-2">
          <Text className="text-[24px] font-medium leading-[30.77px] text-black">
            Total
          </Text>
          <Text className="text-[24px] font-medium leading-[30.77px] text-black">
            $
            {cartProductsTotalPrice
              ? cartProductsTotalPrice.toFixed(2)
              : "0.00"}
          </Text>
        </div>
        <hr className="border-[0.5px] border-black w-full" />
      </div>
    </div>
  );
};

export default OrderDetails;
