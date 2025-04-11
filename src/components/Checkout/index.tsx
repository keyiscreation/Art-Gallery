"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import useShoppingCart from "@/hooks/useShoppingCart";

import StripeForm from "./Stripe";
import Text from "../ui/Text";
import OrderDetails from "./OrderDetails";
import PayPalButtons from "../Paypal/PaypalButton";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
type CartItem = {
  title: string;
  price: number;
  quantity: number;
  qrLink?: string;
  pathnode: string;
  slugtitle: string;
  size: string;
  licenseNumber?: string;
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
  const { cartProducts, getItemQuantity } = useShoppingCart();

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

    // Prepare final order data with cart details
    const updatedFormData = { ...formData };
    updatedFormData["cartValues"] = cartProducts.map((product) => ({
      title: product.title,
      price: Number(product.price),
      quantity: getItemQuantity(product.id),
      pathnode: product.pathnode,
      slugtitle: product.slugtitle,
      qrLink: product.qrLink,
      size: product.size || "",
      licenseNumber: product.licenseNumber,
    }));
  };

  return (
    <div className="pb-16 pt-20 px-5 bg-[#f6f6f6] mt-[-70px]">
      <div className="mx-auto w-full max-w-[1267.97px]">
        <Text as="h1" className="text-black text-center">
          Checkout
        </Text>
        <hr className="border-[0.5px] border-black/50 w-full my-5" />
        <div className="flex flex-wrap justify-center gap-16 mob:gap-2 mt-20 mb-5">
          {/* Details Form */}
          <div className="w-full max-w-[555px] border border-[#000000]/20 px-[25px] py-[25px] mb-10 bg-[#FFFFFF]">
            <form className="w-full" onSubmit={handleSubmit} autoComplete="off">
              <div className="flex gap-[16px] mb-3">
                <Text
                  as="h1"
                  className="text-[22px] text-[#000000] font-futuraBT font-normal"
                >
                  Add New Address
                </Text>
              </div>
              <div className="flex mob:block w-full gap-5 justify-between mb-2">
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
                    className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[45px] w-full text-[15px]"
                  />
                </div>
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
                    className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[45px] w-full text-[15px]"
                  />
                </div>
              </div>
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
                  className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[45px] w-full text-[15px]"
                />
              </div>
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
                  className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[45px] w-full text-[15px]"
                />
              </div>
              <div className="flex mob:block w-full gap-5 justify-between mb-5">
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
                    className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[45px] w-full text-[15px]"
                  />
                </div>
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
                    className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[45px] w-full text-[15px]"
                  />
                </div>
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
                    className="px-3 border-[1px] bg-[#F2F2F2] outline-none h-[45px] w-full text-[15px]"
                  />
                </div>
              </div>
            </form>
            <Elements stripe={stripePromise}>
              <StripeForm formData={formData} handleSubmit={handleSubmit} />
            </Elements>
          </div>
          {/* Order Details Section */}
          <OrderDetails />
        </div>
        <PayPalButtons />
      </div>
    </div>
  );
};

export default Checkout;
