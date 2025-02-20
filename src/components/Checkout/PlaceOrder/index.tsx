"use client";
import React, { Fragment } from "react";
import Image from "next/image";

import useShoppingCart from "@/hooks/useShoppingCart";

import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";

const PlaceOrder = () => {
  const {
    cartProducts,
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    cartProductsTotalPrice,
  } = useShoppingCart();

  return (
    <div className="w-full  bg-[#F0F0F0] rounded-[13.48px]  mt-5 px-[30px] py-[45px] ">
      {/* <Button className="max-w-[446.51px] h-[60.19px] rounded-[7.19px] mb-3">
        Place Order
      </Button>

      <Text
       
        className="text-[16px] text-[#000000] font-futuraBT font-normal max-w-[430.34px] "
      >
        {" "}
        By placing your order, you agree to our company{" "}
        <span className="font-medium"> Privacy policy </span> and{" "}
        <span className="font-medium"> Conditions of use.</span>
      </Text> */}
      {/* <hr className="h-px my-8 bg-[#B0B0B0] border-0 " /> */}

      <Text className="text-[22px] text-[#000000] font-futuraBT font-normal  ">
        Order Summary
      </Text>

      {cartProducts.map((product) => (
        <Fragment key={product.id}>
          <div className="flex items-center gap-[55px] my-4">
            <Image
              className="rounded-lg"
              src={product.image}
              alt=""
              width={64}
              height={64}
            />
            <Text className="text-[22px] text-[#000000] font-futuraBT font-normal ">
              {product.title}
            </Text>
          </div>
        </Fragment>
      ))}
      <div className="flex justify-between mb-2">
        <Text className="text-[16px] text-[#575757] font-futuraBT font-normal  ">
          {" "}
          Items {cartProducts.length}
        </Text>
        <Text className="text-[16px] text-[#575757] font-futuraBT font-normal ">
          {" "}
          ${cartProductsTotalPrice}
        </Text>
      </div>
      <div className="flex justify-between mb-2">
        <Text className="text-[16px] text-[#575757] font-futuraBT font-normal  ">
          {" "}
          Shipping and handling:
        </Text>
        <Text className="text-[16px] text-[#575757] font-futuraBT font-normal ">
          {" "}
          $0
        </Text>
      </div>
      <div className="flex justify-between mb-2">
        <Text className="text-[16px] text-[#575757] font-futuraBT font-normal  ">
          {" "}
          Before tax:
        </Text>
        <Text className="text-[16px] text-[#575757] font-futuraBT font-normal ">
          {" "}
          ${cartProductsTotalPrice}
        </Text>
      </div>
      <div className="flex justify-between mb-2">
        <Text className="text-[16px] text-[#575757] font-futuraBT font-normal  ">
          {" "}
          Tax Collected:
        </Text>
        <Text className="text-[16px] text-[#575757] font-futuraBT font-normal ">
          {" "}
          $0
        </Text>
      </div>

      <hr className="h-px mb-5 mt-14 bg-[#B0B0B0] border-0 " />
      <div className="flex justify-between mb-2">
        <Text className="text-[22px] text-[#000000] font-futuraBT font-normal  ">
          {" "}
          Order Total:
        </Text>
        <Text className="text-[22px] text-[#000000] font-futuraBT font-normal ">
          {" "}
          ${cartProductsTotalPrice}
        </Text>
      </div>
    </div>
  );
};

export default PlaceOrder;
