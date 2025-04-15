import React, { FormEvent, useState } from "react";
import CreditCardInput from "./CreditCardInput";
import useStripePayment from "./useStripePayment";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import useShoppingCart from "@/hooks/useShoppingCart";
import axios from "axios";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  streetAddress: string;
  aptNumber?: number;
  state: string;
  zipCode: number;
  cartValues?: {
    title: string;
    price: number;
    quantity: number;
    pathnode?: string;
    slugtitle?: string;
    qrLink?: string;
    size?: string;
    licenseNumber?: string;
  }[];
}
interface StripeFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  formData: FormData;
  amountToCharge: number;
  embryonicOrderId: number;
}

const Stripe: React.FC<StripeFormProps> = ({
  formData,
  amountToCharge,
  embryonicOrderId,
}) => {
  const [loading, setLoading] = useState(false);
  const { onStripeSubmit } = useStripePayment();
  const [checked, setChecked] = useState(false);
  const { cartProducts, getItemQuantity } = useShoppingCart();

  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    // Prepare final order data with cart details
    const updatedFormData = { ...formData };

    // Ensure cartValues is properly typed and added to the formData
    updatedFormData.cartValues = cartProducts.map((product) => ({
      title: product.title,
      price: Number(product.price),
      quantity: getItemQuantity(product.id),
      pathnode: product.pathnode,
      slugtitle: product.slugtitle,
      qrLink: product.qrLink,
      size: product.size || "",
      licenseNumber: product.licenseNumber,
    }));

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
      // const stepOneRes = await axios.post("/api/sync-order", updatedFormData);
      // const { embryonicOrderId, deliveryOptionId, externalReference } =
      //   stepOneRes.data;

      // console.log("Step one response:", stepOneRes.data);

      // STEP 2: Fetch the total cost from /api/fetching-cost
      // const stepTwoRes = await axios.post("/api/fetching-cost", {
      //   embryonicOrderId,
      //   deliveryOptionId,
      //   externalReference,
      //   shippingCharge: 0,
      //   productCharge: 0,
      //   salesTax: 0,
      // });

      // if (!stepTwoRes.data.success) {
      //   throw new Error("Failed to fetch total cost");
      // }

      // Extract correct total charge from /api/fetching-cost response
      // const { TotalCharge } = stepTwoRes.data.data;

      // const amountToCharge = TotalCharge + cartProductsTotalPrice;
      // console.log("amount To Charge", amountToCharge);

      // Show popup with the correct TotalCharge
      // const userConfirmed = window.confirm(
      //   `You will be charged $${TotalCharge.toFixed()} for printing and shipping. Do you agree?`
      // );

      // if (!userConfirmed) {
      //   alert("Order cancelled.");
      //   setLoading(false);
      //   return;
      // }

      // STEP 3: Process Stripe Payment after order steps
      const paymentRes = await onStripeSubmit(amountToCharge);
      if (!paymentRes?.success) {
        console.log("payment failed");
        try {
          const cancelRes = await axios.delete("/api/cancel-order", {
            data: { embryonicOrderId },
          });
          console.log("Order cancel response:", cancelRes.data);
        } catch (error) {
          console.error("Error canceling the order:", error);
        }
      }

      // if (!paymentRes?.success) {
      //   try {
      //     // Ensure embryonicOrderId is passed correctly in the DELETE request
      //     const cancelRes = await axios.delete("/api/cancel-order", {
      //       data: { embryonicOrderId }, // Sending the ID in the body of the DELETE request
      //     });
      //     console.log("Order cancel response:", cancelRes.data);
      //   } catch (cancelError) {
      //     console.error("Error canceling the order:", cancelError);
      //   }
      // }

      if (paymentRes?.success) {
        // STEP 4: Send confirmation email after payment is successful
        const emailRes = await axios.post("/api/order", updatedFormData);
        if (emailRes.data.message === "Email Sent Successfully") {
          alert("Order confirmed and email sent!");
          window.location.href = "/store";
        } else {
          throw new Error("Email sending failed");
        }
      } else {
        alert("Payment failed. Please try again.");
        window.location.href = "/store";
      }
    } catch (error) {
      console.error("Error processing order:", error);
      alert("An error occurred. Please try again.");
      window.location.href = "/store";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form className="w-full" onSubmit={(e) => onSubmit(e)}>
        <CreditCardInput />

        <Text className="text-[16px] text-[#000000] font-futuraBT font-normal mb-2">
          Name on card
        </Text>
        <input
          className="px-3 border-[1px] bg-[#F2F2F2]  outline-none h-[45px] w-full  text-[15px] text-[#000000] placeholder:text-[16px] font-normal placeholder:text-[#00000033]"
          type="text"
          placeholder="Name on card"
        />
        <Text className="text-black font-futurapt text-[13px] leading-[11.54px] font-light mt-2">
          You&apos;ll receive receipts and notifications at this email
        </Text>

        <label className="flex items-center space-x-3 cursor-pointer mt-12">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="text-black font-futurapt text-[13px] leading-[11.54px] font-light">
            Sign up to receive news and updates
          </span>
        </label>

        {/* Button */}
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
              Paying...
            </span>
          ) : (
            "Pay Amount"
          )}
        </Button>
      </form>
    </div>
  );
};

export default Stripe;
