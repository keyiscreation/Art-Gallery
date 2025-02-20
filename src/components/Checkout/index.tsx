"use client"; // Required for App Router in Next.js

import React, { ChangeEvent, FormEvent, Fragment, useState } from "react";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import StripeForm from "./Stripe";
import { orderDataKeys } from "@/lib/constants/orderdetail";

import Text from "../ui/Text";

import Button from "../ui/Button";
import useShoppingCart from "@/hooks/useShoppingCart";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

interface IndexSignature {
  [key: string | number]: any;
}
const Checkout = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const {
    cartProducts,
    getItemQuantity,
    // increaseCartQuantity,
    // decreaseCartQuantity,
    // removeFromCart,
    // cartProductsTotalPrice,
  } = useShoppingCart();

  // Static Dummy Data
  // const accordionData = [
  //   {
  //     title: "What is Tailwind CSS?",
  //     content:
  //       "Tailwind CSS is a utility-first CSS framework for creating modern designs.",
  //   },
  //   {
  //     title: "Is Tailwind good for React?",
  //     content:
  //       "Yes! Tailwind works seamlessly with React, making UI development faster.",
  //   },
  //   {
  //     title: "How to install Tailwind?",
  //     content:
  //       "Run `npm install tailwindcss` and configure it in your project.",
  //   },
  // ];

  // const handleToggle = (index: number) => {
  //   setOpenIndex(openIndex === index ? null : index);
  // };

  const [formData, setFormData] = useState<IndexSignature>(orderDataKeys);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="pb-16 pt-20 px-5 bg-[#f6f6f6] mt-[-70px]">
      <div className="mx-auto w-full max-w-[1267.97px] ">
        <Text as="h1" className="text-black text-center">
          Shopping Cart
        </Text>

        <hr className="border-[0.5px] border-black/50 w-full my-5" />

        <div className="flex flex-wrap justify-center gap-16 mob:gap-2 mt-20 mb-5">
          {/* details */}

          <Elements stripe={stripePromise}>
            {/* <StripeForm formData={formData} handleSubmit={handleSubmit} /> */}
            <StripeForm formData={formData} handleSubmit={handleSubmit} />
          </Elements>
          {/* <div className="">
            {accordionData.map((item, index) => (
              <div key={index} className="border-b border-gray-300">
                <button
                  className="w-full text-left flex justify-between items-center py-4 text-[20px] font-medium text-[#000000]"
                  onClick={() => handleToggle(index)}
                >
                  {item.title}
                  <span
                    className={`transform transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    ▼
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openIndex === index
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pb-4 text-[18px] font-normal text-[#555] leading-[24px]">
                    {item.content}
                  </div>
                </div>
              </div>
            ))}
          </div> */}

          {/* order details */}
          <div className="p-[34px] border border-[#000000]/30 bg-white w-full max-w-[455.77px]">
            <Text className="text-[22px] font-medium leading-[28px] text-black">
              Order Details
            </Text>
            <hr className="border-[0.5px] border-black/40 w-full mt-2 mb-5" />

            {cartProducts.map((product) => (
              <Fragment key={product.id}>
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <Image
                      className="w-[66px] max-h-[66px] object-cover"
                      src={product.image}
                      alt="product"
                    />
                    <div className="max-w-[106px]">
                      <Text className="text-[14px] font-medium leading-[18px] text-black">
                        {product.title}
                      </Text>
                      <Text className="text-[12px]  leading-[15.3px] text-black">
                        Size: Large
                      </Text>
                    </div>
                  </div>

                  <div className="">
                    <Text className="text-[14px] font-medium leading-[18px] text-black text-end">
                      {product.title}
                    </Text>

                    <div className="bg-[#F2F2F2] p-2  max-w-[103.3px] flex justify-between gap-10 my-2">
                      <Text className="font-medium text-black">Qty</Text>
                      <Text className="font-medium text-black">
                        {" "}
                        {getItemQuantity(Number(product.id))}
                      </Text>
                    </div>
                    <Text className="text-[12px] font-medium leading-[18px] text-[#FF0000] text-end underline underline-offset-2 cursor-pointer">
                      Remove
                    </Text>
                  </div>
                </div>
              </Fragment>
            ))}

            {/* apply */}
            <Text className="text-[10px] text-black mb-[4px] mt-2">
              Gift or Discount Code
            </Text>
            <form action="" className="flex justify-center gap-[24px]">
              <input
                placeholder="E-mail Address"
                type="text"
                className="px-3 border-[1px] bg-[#F2F2F2]  outline-none h-[45] w-full max-w-[284px] text-[15px] text-[#00000033] font-futurapt font-normal placehoder:text-[#000000] "
              />

              <Button className="max-w-[83px] h-[45px]  bg-transparent border border-[#000000]/30 text-[15px] text-[#000000] font-medium font-futurapt  hover:opacity-100">
                Apply
              </Button>
            </form>

            {/* rates */}
            <div className="flex justify-between mt-5 mb-2">
              <Text className="text-[14px] font-medium leading-[18px] text-black">
                Subtotal
              </Text>
              <Text className="text-[14px] font-medium leading-[18px] text-black">
                $2000.00
              </Text>
            </div>
            <div className="flex justify-between  mb-2">
              <Text className="text-[14px] font-medium leading-[18px] text-black">
                Tax
              </Text>
              <Text className="text-[14px] font-medium leading-[18px] text-black">
                $20.00
              </Text>
            </div>
            <div className="flex justify-between  mb-5">
              <Text className="text-[14px] font-medium leading-[18px] text-black">
                Shipping
              </Text>
              <Text className="text-[14px] font-medium leading-[18px] text-black">
                $20.00
              </Text>
            </div>

            <hr className="border-[0.5px] border-black/40 w-full mt-2 mb-3" />
            <div className="flex justify-between  mb-2">
              <Text className="text-[24px] font-medium leading-[30.77px] text-black">
                Total
              </Text>
              <Text className="text-[24px] font-medium leading-[30.77px] text-black">
                $0.00
              </Text>
            </div>

            <hr className="border-[0.5px] border-black w-full  " />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
