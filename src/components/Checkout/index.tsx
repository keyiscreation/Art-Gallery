"use client";

import React, {
  ChangeEvent,
  FormEvent,
  Fragment,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeForm from "./Stripe";

// import { orderDataKeys } from "@/lib/constants/orderdetail";

import Text from "../ui/Text";

import Button from "../ui/Button";
import useShoppingCart from "@/hooks/useShoppingCart";
import axios from "axios";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  // process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
  "pk_test_cTSJAP6VIX6ChpugxrQuVYwg00B33lQZMq"
);

type CartItem = {
  title: string;
  price: number;
  quantity: number;
  qrLink?: string;
};

type OrderFormData = {
  firstName: string;
  lastName: string;
  email: string;
  streetAddress: string;
  aptNumber?: number;
  state: string;
  zipCode: number;
  cartValues: CartItem[];
};

const Checkout = () => {
  const {
    cartProducts,
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    cartProductsTotalPrice,
  } = useShoppingCart();

  const router = useRouter();

  useEffect(() => {
    if (cartProducts.length === 0) {
      router.push("/cart");
    }
  }, [cartProducts, router]);

  console.log(cartProducts, "cartdata");

  const [formData, setFormData] = useState<OrderFormData>({
    firstName: "",
    lastName: "",
    email: "",
    streetAddress: "",
    aptNumber: undefined,
    state: "",
    zipCode: 0,
    cartValues: [],
  });

  // const [loading, setLoading] = useState(false);

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
    // setLoading(true);

    const updatedFormData = { ...formData };

    updatedFormData["cartValues"] = cartProducts.map((product) => ({
      title: product.title,
      price: Number(product.price), // Ensure it's a number
      quantity: getItemQuantity(product.id),
      pathnode: product.pathnode,
      slugtitle: product.slugtitle,
      qrLink: product.qrLink,
      size: product.size,
      licence: product.licenseNumber,
    }));

    // console.log(updatedFormData, "qrLink form data");
    try {
      const res = await axios.post("/api/order", updatedFormData);
      const data = res?.data;

      if (data && data.message === "Email Sent Successfully") {
        alert("Order is confirmed, check your email!");
        // setLoading(false);
      } else {
        throw new Error(data?.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Email sent Error");
    }
  };

  const handleNavigation = (slugtitle: string) => {
    const slug = slugtitle;
    router.push(`/products/${slug}`);
  };

  return (
    <div className="pb-16 pt-20 px-5 bg-[#f6f6f6] mt-[-70px]">
      <div className="mx-auto w-full max-w-[1267.97px] ">
        <Text as="h1" className="text-black text-center">
          Checkout
        </Text>

        <hr className="border-[0.5px] border-black/50 w-full my-5" />

        <div className="flex flex-wrap justify-center gap-16 mob:gap-2 mt-20 mb-5">
          {/* details */}
          <div className="w-full  max-w-[555px] border border-[#000000]/20 px-[25px] py-[25px] mb-10  bg-[#FFFFFF]">
            <form className="w-full" onSubmit={handleSubmit} autoComplete="off">
              <div className="flex gap-[16px] mb-3">
                <Text className="text-[22px] text-[#000000] font-futuraBT font-normal">
                  Add New Address
                </Text>
              </div>

              <div className="flex mob:block w-full gap-5 justify-between mb-2">
                {/* First Name */}
                <div className="w-full max-w-[272.22px] mob:max-w-full">
                  <Text className="text-[16px] text-[#000000] font-futuraBT font-normal mb-2">
                    First Name
                  </Text>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                    placeholder="First Name"
                    className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[45px] w-full text-[15px] text-[#000000]  font-normal placeholder:text-[#00000033] placeholder:text-[16px]"
                  />
                </div>

                {/* Last Name */}
                <div className="w-full max-w-[272.22px] mob:max-w-full">
                  <Text className="text-[16px] text-[#000000] font-futuraBT font-normal mb-2">
                    Last Name
                  </Text>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                    placeholder="Last Name"
                    className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[45px] w-full text-[15px] text-[#000000] font-normal placeholder:text-[#00000033] placeholder:text-[16px]"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-2">
                <Text className="text-[16px] text-[#000000] font-futuraBT font-normal mb-2">
                  Email
                </Text>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  autoComplete="off"
                  placeholder="Email"
                  className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[45px] w-full text-[15px] text-[#000000]  font-normal placeholder:text-[#00000033] placeholder:text-[16px]"
                />
              </div>

              {/* Street Address */}
              <div className="mb-2">
                <Text className="text-[16px] text-[#000000] font-futuraBT font-normal mb-2">
                  Street Address
                </Text>
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  required
                  autoComplete="off"
                  placeholder=" Street Address"
                  className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[45px] w-full text-[15px] text-[#000000]  font-normal placeholder:text-[#00000033] placeholder:text-[16px]"
                />
              </div>

              {/* Apt, State, Zip */}
              <div className="flex mob:block w-full gap-5 justify-between mb-5">
                {/* Apt Number */}
                <div className="w-full max-w-[182.38px] mob:max-w-full">
                  <Text className="text-[16px] text-[#000000] font-futuraBT font-normal mb-2">
                    Apt Number
                  </Text>
                  <input
                    type="number"
                    name="aptNumber"
                    value={formData.aptNumber}
                    onChange={handleInputChange}
                    min="0"
                    autoComplete="off"
                    placeholder="Apt Number"
                    className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[45px] w-full text-[15px] text-black  font-normal placeholder:text-[#00000033] placeholder:text-[16px]"
                  />
                </div>

                {/* State */}
                <div className="w-full max-w-[182.38px] mob:max-w-full">
                  <Text className="text-[16px] text-[#000000] font-futuraBT font-normal mb-2">
                    State
                  </Text>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                    placeholder="State"
                    className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[45px] w-full text-[15px] text-black  font-normal placeholder:text-[#00000033]  placeholder:text-[16px] "
                  />
                </div>

                {/* Zip */}
                <div className="w-full max-w-[182.38px] mob:max-w-full">
                  <Text className="text-[16px] text-[#000000] font-futuraBT font-normal mb-2">
                    Zip Code
                  </Text>
                  <input
                    type="number"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    min="0"
                    autoComplete="off"
                    placeholder="Zip Code"
                    className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[45px] w-full text-[15px] text-black  font-normal placeholder:text-[#00000033] placeholder:text-[16px]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              {/* <Button
                type="submit"
                className="mt-4 bg-black max-w-full text-white flex justify-center items-center"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit"
                )}
              </Button> */}
            </form>

            <Elements stripe={stripePromise}>
              <StripeForm formData={formData} handleSubmit={handleSubmit} />
            </Elements>
          </div>

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
          <div className="w-full max-w-[455.77px] relative">
            <div className="p-[34px] border border-[#000000]/30 bg-white w-full max-w-[455.77px] max-h-full mob:max-h-full">
              <Text className="text-[22px] font-medium leading-[28px] text-black">
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
                      <Image
                        className="w-[66px] max-h-[66px] object-cover"
                        src={product.image}
                        alt="product"
                        onContextMenu={(e) => e.preventDefault()}
                        draggable="false" // Disable dragging
                      />
                      <div className="max-w-[106px]">
                        <Text className="text-[14px] font-medium leading-[18px] text-black">
                          {product.title}
                        </Text>
                        <Text className="text-[12px]  leading-[15.3px] text-black">
                          Size: {product.size}
                        </Text>
                      </div>
                    </div>

                    <div className="">
                      <Text className="text-[14px] font-medium leading-[18px] text-black text-end">
                        {product.title}
                      </Text>

                      <div className=" flex justify-end">
                        <div className="bg-[#F2F2F2] p-2  max-w-[143.3px] flex justify-between gap-5 my-2">
                          <Text className="font-medium text-black">Qty</Text>
                          <Text className="font-medium text-black">
                            {" "}
                            <span
                              onClick={() =>
                                decreaseCartQuantity(Number(product.id))
                              }
                              className="mr-2 cursor-pointer text-[20px]"
                            >
                              -
                            </span>
                            {getItemQuantity(Number(product.id))}
                            <span
                              onClick={() =>
                                increaseCartQuantity(Number(product.id))
                              }
                              className="ml-2 cursor-pointer "
                            >
                              +
                            </span>
                          </Text>
                        </div>
                      </div>
                      <Text
                        onClick={() => removeFromCart(product.id)}
                        className="text-[12px] font-medium leading-[18px] text-[#FF0000] text-end underline underline-offset-2 cursor-pointer"
                      >
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
                  className="px-3 border-[1px] bg-[#F2F2F2]  outline-none h-[45] w-full max-w-[284px] text-[15px] text-[#000000] font-futurapt font-normal placehoder:text-[#000000] "
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
                  $
                  {cartProductsTotalPrice
                    ? cartProductsTotalPrice.toFixed(2)
                    : "0.00"}
                </Text>
              </div>
              {/* <div className="flex justify-between  mb-2">
              <Text className="text-[14px] font-medium leading-[18px] text-black">
                Tax
              </Text>
              <Text className="text-[14px] font-medium leading-[18px] text-black">
                $20.00
              </Text>
            </div> */}
              {/* <div className="flex justify-between  mb-5">
              <Text className="text-[14px] font-medium leading-[18px] text-black">
                Shipping
              </Text>
              <Text className="text-[14px] font-medium leading-[18px] text-black">
                $20.00
              </Text>
            </div> */}

              <hr className="border-[0.5px] border-black/40 w-full mt-2 mb-3" />
              <div className="flex justify-between  mb-2">
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

              <hr className="border-[0.5px] border-black w-full  " />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
