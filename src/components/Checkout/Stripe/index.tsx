import React, { FormEvent, useState } from "react";
import CreditCardInput from "./CreditCardInput";
import useStripePayment from "./useStripePayment";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
// type CartItem = {
//   title: string;
//   price: number;
//   quantity: number;
//   qrLink?: string;
// };
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  streetAddress: string;
  aptNumber?: number;
  state: string;
  zipCode: number;
  // cartValues?: CartItem[];
}

interface StripeFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  formData: FormData;
}

const Stripe: React.FC<StripeFormProps> = ({ handleSubmit, formData }) => {
  const [loading, setLoading] = useState(false);
  const { onStripeSubmit } = useStripePayment();
  const [checked, setChecked] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    console.log(formData, "formData");

    try {
      // Exclude additionalInfo from validation check
      const { ...formDataWithoutAdditionalInfo } = formData;

      const allFieldsFilled: boolean = Object.values(
        formDataWithoutAdditionalInfo
      ).every((value: string | number | undefined) =>
        typeof value === "string"
          ? value.trim() !== ""
          : value !== null && value !== undefined
      );

      if (!allFieldsFilled) {
        alert("Please fill all required fields.");
        setLoading(false);
        return;
      }

      const res = await onStripeSubmit();

      if (res?.success) {
        await handleSubmit(e);
        console.log("Payment success");
        alert("Payment successful!");
      }
    } catch (error) {
      console.error("An error occurred during submission:", error);
      alert("An error occurred. Please try again.");
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
        {/* <div className="flex items-center mb-4">
          <input
            id="default-checkbox"
            type="checkbox"
            value=""
            className="w-4 h-4 text-blue-600 bg-gray-100  border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="default-checkbox"
            className="text-[16px] ml-4 text-[#000] leading-[20.16px] font-normal font-jakrata"
          >
            Use shipping address as billing address
          </label>
        </div> */}

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

        {/* button */}

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

        {/* 
        <button
          type="submit"
          disabled={loading}
          className="w-full uppercase my-14  h-[59px] rounded-[150px] bg-[#FFFFFF] text-[#121212] tracking-[2px] text-[15px] leading-[18.9px] font-semibold font-jakrata"
        >
        {loading ? "Submitting..." : "Pay Now"}
        </button> */}
      </form>
    </div>
  );
};

export default Stripe;
