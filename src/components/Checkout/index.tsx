"use client";

import React, {
  ChangeEvent,
  FormEvent,
  Fragment,
  // useEffect,
  useState,
} from "react";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeForm from "./Stripe";
import Text from "../ui/Text";
import Button from "../ui/Button";
import useShoppingCart from "@/hooks/useShoppingCart";
import axios from "axios";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe("pk_test_cTSJAP6VIX6ChpugxrQuVYwg00B33lQZMq");

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

  // useEffect(() => {
  //   if (cartProducts.length === 0) {
  //     router.push("/cart");
  //   }
  // }, [cartProducts, router]);

  // console.log(cartProducts, "cartdata");

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

  // Updated input handler to convert number inputs accordingly.
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedFormData = { ...formData };

    updatedFormData["cartValues"] = cartProducts.map((product) => ({
      title: product.title,
      price: Number(product.price),
      quantity: getItemQuantity(product.id),
      pathnode: product.pathnode,
      slugtitle: product.slugtitle,
      qrLink: product.qrLink,
      size: product.size,
      licence: product.licenseNumber,
    }));

    // Optional: Log the final form data before sending
    console.log("Final formData to send:", updatedFormData);

    try {
      const emailres = await axios.post("/api/order", updatedFormData);
      const emaildata = emailres?.data;

      // CreativeHub API route to forward the order details
      const creativeHubRes = await axios.post(
        "/api/sync-order",
        updatedFormData
      );
      const creativeHubData = creativeHubRes?.data;

      if (
        emaildata &&
        emaildata.message === "Email Sent Successfully" &&
        creativeHubData &&
        creativeHubData.success
      ) {
        alert("Order is confirmed, check your email!");
      } else {
        throw new Error(emaildata?.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Email sent Error");
    }
  };

  const handleNavigation = (slugtitle: string) => {
    router.push(`/products/${slugtitle}`);
  };

  return (
    <div className="pb-16 pt-20 px-5 bg-[#f6f6f6] mt-[-70px]">
      <div className="mx-auto w-full max-w-[1267.97px] ">
        <Text as="h1" className="text-black text-center">
          Checkout
        </Text>
        <hr className="border-[0.5px] border-black/50 w-full my-5" />

        <div className="flex flex-wrap justify-center gap-16 mob:gap-2 mt-20 mb-5">
          {/* Details Form */}
          <div className="w-full max-w-[555px] border border-[#000000]/20 px-[25px] py-[25px] mb-10 bg-[#FFFFFF]">
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
                    className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[45px] w-full text-[15px] text-[#000000] font-normal placeholder:text-[#00000033] placeholder:text-[16px]"
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
                  className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[45px] w-full text-[15px] text-[#000000] font-normal placeholder:text-[#00000033] placeholder:text-[16px]"
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
                  placeholder="Street Address"
                  className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[45px] w-full text-[15px] text-[#000000] font-normal placeholder:text-[#00000033] placeholder:text-[16px]"
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
                    value={formData.aptNumber || ""}
                    onChange={handleInputChange}
                    min="0"
                    autoComplete="off"
                    placeholder="Apt Number"
                    className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[45px] w-full text-[15px] text-black font-normal placeholder:text-[#00000033] placeholder:text-[16px]"
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
                    className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[45px] w-full text-[15px] text-black font-normal placeholder:text-[#00000033] placeholder:text-[16px]"
                  />
                </div>
                {/* Zip Code */}
                <div className="w-full max-w-[182.38px] mob:max-w-full">
                  <Text className="text-[16px] text-[#000000] font-futuraBT font-normal mb-2">
                    Zip Code
                  </Text>
                  <input
                    type="number"
                    name="zipCode"
                    value={formData.zipCode || ""}
                    onChange={handleInputChange}
                    required
                    min="0"
                    autoComplete="off"
                    placeholder="Zip Code"
                    className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[45px] w-full text-[15px] text-black font-normal placeholder:text-[#00000033] placeholder:text-[16px]"
                  />
                </div>
              </div>
              {/* The submit button is integrated within the StripeForm component */}
            </form>
            <Elements stripe={stripePromise}>
              <StripeForm formData={formData} handleSubmit={handleSubmit} />
            </Elements>
          </div>
          {/* Order Details Section */}
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
                        width={140}
                        height={140}
                        onContextMenu={(e) => e.preventDefault()}
                        draggable="false"
                      />
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
                      <div className="flex justify-end">
                        <div className="bg-[#F2F2F2] p-2 max-w-[143.3px] flex justify-between gap-5 my-2">
                          <Text className="font-medium text-black">Qty</Text>
                          <Text className="font-medium text-black">
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
                              className="ml-2 cursor-pointer"
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
              <Text className="text-[10px] text-black mb-[4px] mt-2">
                Gift or Discount Code
              </Text>
              <form className="flex justify-center gap-[24px]">
                <input
                  placeholder="E-mail Address"
                  type="text"
                  className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[45px] w-full max-w-[284px] text-[15px] text-[#000000] font-futurapt font-normal"
                />
                <Button className="max-w-[83px] h-[45px] bg-transparent border border-[#000000]/30 text-[15px] text-[#000000] font-medium font-futurapt hover:opacity-100">
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
        </div>
      </div>
    </div>
  );
};

export default Checkout;
