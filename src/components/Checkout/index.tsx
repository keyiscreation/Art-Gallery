"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import useShoppingCart from "@/hooks/useShoppingCart";

import StripeForm from "./Stripe";
import Text from "../ui/Text";
import OrderDetails from "./OrderDetails";
import PayPalButtons from "../Paypal/PaypalButton";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";

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
  image?: string;
};

type OrderFormData = {
  firstName: string;
  lastName: string;
  email: string;
  streetAddress: string;
  // aptNumber?: number;
  state: string;
  zipCode: number;
  cartValues: CartItem[];
};

const Checkout = () => {
  const { cartProducts, getItemQuantity, cartProductsTotalPrice } =
    useShoppingCart();
  const [loading, setLoading] = useState(false);
  const [showPaymentMethods, setshowPaymentMethods] = useState(false);
  const [amountToChargefromUser, setamountToChargefromUser] = useState(0);
  const [embryonicOrderIdProp, setembryonicOrderIdProp] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const [formData, setFormData] = useState<OrderFormData>({
    firstName: "",
    lastName: "",
    email: "",
    streetAddress: "",
    // aptNumber: undefined,
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
    setLoading(true);

    // Prepare final order data with cart details
    const updatedFormData = { ...formData };

    // console.log("form data", formData);
    updatedFormData["cartValues"] = cartProducts.map((product) => ({
      title: product.title,
      price: Number(amountToChargefromUser),
      quantity: getItemQuantity(product.id),
      pathnode: product.pathnode,
      slugtitle: product.slugtitle,
      qrLink: product.qrLink,
      size: product.size ? product.size : "Default", // Assuming `sizes` is a map and we join the keys as a string
      licenseNumber: product.licenseNumber || "",
    }));

    // api hiiting

    try {
      // Exclude additionalInfo from validation check
      const { ...formDataWithoutAdditionalInfo } = formData;

      const allFieldsFilled: boolean = Object.values(
        formDataWithoutAdditionalInfo
      ).every((value: string | number | undefined | object) =>
        typeof value === "string"
          ? value.trim() !== ""
          : value !== null && value !== undefined
      );

      if (!allFieldsFilled) {
        alert("Please fill all required fields.");
        setLoading(false);
        return;
      }

      // STEP 1: Sync order (this does not fetch cost)
      const stepOneRes = await axios.post("/api/sync-order", updatedFormData);
      const { embryonicOrderId, deliveryOptionId, externalReference } =
        stepOneRes.data;

      const embryonicOrderIdConst = embryonicOrderId;

      localStorage.setItem("embryonicOrderId", embryonicOrderIdConst);
      setembryonicOrderIdProp(embryonicOrderIdConst);
      // console.log("Step one response:", stepOneRes.data);

      // STEP 2: Fetch the total cost from /api/fetching-cost
      const stepTwoRes = await axios.post("/api/fetching-cost", {
        embryonicOrderId,
        deliveryOptionId,
        externalReference,
        shippingCharge: 0,
        productCharge: 0,
        salesTax: 0,
      });

      if (!stepTwoRes.data.success) {
        throw new Error("Failed to fetch total cost");
      }

      // Extract correct total charge from /api/fetching-cost response
      const { TotalCharge } = stepTwoRes.data.data;

      setConfirmationMessage(
        `You will be charged <br /> <span class="text-[42px] font-bold">$${TotalCharge.toFixed()}</span> <br /> for printing and shipping purposes.<br />Do you agree?`
      );

      // const amountToCharge = TotalCharge + cartProductsTotalPrice;
      // console.log("amount To Charge", amountToCharge);

      // Show popup with the correct TotalCharge
      // const userConfirmed = window.confirm(
      //   `You will be charged $${TotalCharge.toFixed()} for printing and shipping. Do you agree?`
      // );

      // Show modal asking for confirmation
      setIsModalOpen(true);

      // if (!userConfirmed) {
      //   alert("Order cancelled.");
      //   try {
      //     const cancelRes = await axios.delete("/api/cancel-order", {
      //       data: { embryonicOrderId },
      //     });
      //     console.log("Order cancel response:", cancelRes.data);
      //   } catch (error) {
      //     console.error("Error canceling the order:", error);
      //   }
      //   setLoading(false);
      //   return;
      // }

      const amountToCharge = TotalCharge + cartProductsTotalPrice;
      setamountToChargefromUser(amountToCharge);

      // setshowPaymentMethods(true);
    } catch (error) {
      console.error("Error processing order:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // Modal handlers
  const handleModalConfirm = async () => {
    setIsModalOpen(false);
    setshowPaymentMethods(true);
  };

  const handleModalCancel = async () => {
    setIsModalOpen(false);
    try {
      const cancelRes = await axios.delete("/api/cancel-order", {
        data: { embryonicOrderId: embryonicOrderIdProp },
      });
      console.log("Order cancel response:", cancelRes.data);
    } catch (error) {
      console.error("Error canceling the order:", error);
    }
    setLoading(false);
  };

  return (
    <div className="pb-16 pt-20 px-5 bg-[#f6f6f6] mt-[-70px]">
      {loading ? (
        <div className="flex justify-center items-center z-50">
          <div className="w-full max-w-[1267px]">
            <div className="mx-auto w-full max-w-[1267.97px] mb-[20px]">
              <Text as="h1" className="text-black text-center">
                Checkout
              </Text>
              <hr className="border-[0.5px] border-black/50 w-full my-5" />
            </div>
            <Spinner />
          </div>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-[1267.97px]">
          <Text as="h1" className="text-black text-center">
            Checkout
          </Text>
          <hr className="border-[0.5px] border-black/50 w-full my-5" />
          <div className="flex flex-wrap justify-center gap-16 mob:gap-2 mt-20 mb-5">
            {/* Details Form */}
            <div className="w-full max-w-[555px] border border-[#000000]/20 px-[25px] py-[25px] mb-10 bg-[#FFFFFF]">
              <form
                className="w-full"
                onSubmit={handleSubmit}
                autoComplete="off"
              >
                <div className="flex gap-[16px] mb-3">
                  <Text
                    as="h1"
                    className="text-[25px] text-[#000000] font-medium"
                  >
                    Add New Address
                  </Text>
                </div>
                <div className="flex mob:block w-full gap-5 justify-between mb-2">
                  <div className="w-full max-w-[272.22px] mob:max-w-full">
                    <Text className="text-[16px] text-[#000000] font-normal mb-2">
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
                      className="px-3 border-[1px] bg-[#F2F2F2] font-newCourier outline-none h-[45px] w-full text-[15px]"
                    />
                  </div>
                  <div className="w-full max-w-[272.22px] mob:max-w-full">
                    <Text className="text-[16px] text-[#000000] font-normal mb-2">
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
                      className="px-3 border-[1px] bg-[#F2F2F2] font-newCourier outline-none h-[45px] w-full text-[15px]"
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <Text className="text-[16px] text-[#000000] font-normal mb-2">
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
                    className="px-3 border-[1px] bg-[#F2F2F2] font-newCourier outline-none h-[45px] w-full text-[15px]"
                  />
                </div>
                <div className="mb-2">
                  <Text className="text-[16px] text-[#000000] font-normal mb-2">
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
                    className="px-3 border-[1px] bg-[#F2F2F2] font-newCourier outline-none h-[45px] w-full text-[15px]"
                  />
                </div>
                <div className="flex mob:block w-full gap-5 justify-between mb-5">
                  {/* <div className="w-full max-w-[182.38px] mob:max-w-full">
                    <Text className="text-[16px] text-[#000000] font-normal mb-2">
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
                      className="px-3 border-[1px] bg-[#F2F2F2] font-newCourier outline-none h-[45px] w-full text-[15px]"
                    />
                  </div> */}
                  <div className="w-full max-w-[182.38px] mob:max-w-full">
                    <Text className="text-[16px] text-[#000000] font-normal mb-2">
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
                      className="px-3 border-[1px] bg-[#F2F2F2] font-newCourier outline-none h-[45px] w-full text-[15px]"
                    />
                  </div>
                  <div className="w-full max-w-[182.38px] mob:max-w-full">
                    <Text className="text-[16px] text-[#000000] font-normal mb-2">
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
                      className="px-3 border-[1px] bg-[#F2F2F2] font-newCourier outline-none h-[45px] w-full text-[15px]"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full h-[60.19px] mt-5 mb-3 bg-[#000000] max-w-full text-white "
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
                    " Place Order"
                  )}
                </Button>
              </form>

              {showPaymentMethods && (
                <>
                  <Elements stripe={stripePromise}>
                    <StripeForm
                      formData={formData}
                      embryonicOrderId={embryonicOrderIdProp}
                      amountToCharge={amountToChargefromUser}
                      handleSubmit={handleSubmit}
                    />
                  </Elements>
                  <PayPalButtons
                    formData={formData}
                    embryonicOrderId={embryonicOrderIdProp}
                    amountToCharge={amountToChargefromUser}
                  />
                </>
              )}
              {/* <Elements stripe={stripePromise}>
              <StripeForm formData={formData} handleSubmit={handleSubmit} />
            </Elements> */}
            </div>
            <OrderDetails />
            {/* Order Details Section */}
          </div>
        </div>
      )}
      {/* Modal for order confirmation */}

      <Modal
        isOpen={isModalOpen}
        message={confirmationMessage}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </div>
  );
};

export default Checkout;
