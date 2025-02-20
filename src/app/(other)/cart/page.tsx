"use client";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";

import useShoppingCart from "@/hooks/useShoppingCart";
import { Fragment } from "react";
export default function CartPage() {
  const {
    cartProducts,
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    cartProductsTotalPrice,
  } = useShoppingCart();
  
  return (
    <>
      <div className="overflow-hidden px-5 pb-16">
        <div className="mx-auto w-full max-w-[1267.97px] ">
          <Text as="h1" className="text-black ">
            Shopping Cart
          </Text>
          {cartProducts.map((product) => (
            <Fragment key={product.id}>
              <div className="flex flex-wrap justify-between my-10">
                <div className="flex gap-4 relative min-w-[30%] mob:min-w-full ">
                  <Image
                    className="w-[132px] h-[132px] object-cover"
                    src={product.image}
                    alt="product"
                  />

                  <div className="">
                    <Text className="text-[#000000] text-[16px] leading-[20px] font-medium  mob:max-w-[180px]">
                      {product.title}
                    </Text>
                    <Text className="text-[#000000] text-[16px] leading-[20px] mt-2">
                      Size: Large
                    </Text>

                    {/* mob */}
                    <div className="flex justify-between mt-10">
                      <div className="ml-20 mob:ml-0 mob:block hidden">
                        <Text className="text-[#000000] text-[16px] leading-[20px]">
                          <span
                            onClick={() =>
                              decreaseCartQuantity(Number(product.id))
                            }
                            className="mr-2 cursor-pointer"
                          >
                            -
                          </span>
                          {getItemQuantity(Number(product.id))}
                          <span
                            onClick={() =>
                              increaseCartQuantity(Number(product.id))
                            }
                            className="ml-2 cursor-pointer"
                          >
                            +
                          </span>
                        </Text>
                      </div>

                      <div className=" gap-5 mob:block hidden">
                        <Text className="text-[#000000] text-[16px] leading-[20px]">
                          {product.price}
                        </Text>
                        <Text
                          onClick={() => removeFromCart(product.id)}
                          className=" absolute top-0 right-0 text-[#000000] text-[16px] leading-[20px] font-medium cursor-pointer"
                        >
                          x
                        </Text>
                      </div>
                    </div>
                    {/* mob */}
                  </div>
                </div>
                {/*  */}

                <div className="ml-20 mob:ml-0 mob:hidden min-w-[100px]">
                  <Text className="text-[#000000] text-[16px] leading-[20px]">
                    <span
                      onClick={() => decreaseCartQuantity(Number(product.id))}
                      className="mr-2 cursor-pointer"
                    >
                      -
                    </span>
                    {getItemQuantity(product.id)}
                    <span
                      onClick={() => increaseCartQuantity(Number(product.id))}
                      className="ml-2 cursor-pointer"
                    >
                      +
                    </span>
                  </Text>
                </div>

                <div className="flex gap-5 mob:hidden">
                  <Text className="text-[#000000] text-[16px] leading-[20px]">
                  ${(parseFloat(product.price) * getItemQuantity(product.id)).toFixed(2)}
                  </Text>
                  <Text
                    onClick={() => removeFromCart(product.id)}
                    className="text-[#000000] text-[16px] leading-[20px] font-medium cursor-pointer"
                  >
                    x
                  </Text>
                </div>
              </div>
              <hr className="border-[0.5px] border-black/50 w-full my-5" />
            </Fragment>
          ))}
          <div className="flex justify-end mt-5">
            <div className="flex  w-full max-w-[363px] justify-between">
              <Text className="text-[16px] text-black font-medium ">
                Subtotal
              </Text>
              <Text className="text-[22px] leading-[28px] text-black font-medium">
                ${cartProductsTotalPrice || 0}
              </Text>
            </div>
          </div>

          <div className="flex justify-end mob:justify-start mt-5">
            <Link href="/checkout" className="w-full max-w-[363px]">
              <Button className="max-w-[363px] h-[57px] rounded-[10px] bg-black text-white  ">
                Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
