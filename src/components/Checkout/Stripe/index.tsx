import React, { FormEvent, useState } from "react";
import CreditCardInput from "./CreditCardInput";
import useStripePayment from "./useStripePayment";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";

interface FormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  streetAddress?: string;
  aptNumber?: string;
  state?: string;
  zipCode?: string;
}

interface StripeFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  formData: FormData;
}

const Stripe: React.FC<StripeFormProps> = ({ handleSubmit, formData }) => {

  const [loading, setLoading] = useState(false);
  const { onStripeSubmit } = useStripePayment();
  const [checked, setChecked] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Exclude additionalInfo from validation check
      const { ...formDataWithoutAdditionalInfo } = formData;
      const allFieldsFilled = Object.values(formDataWithoutAdditionalInfo).every(value => value.trim() !== '');
  
      if (!allFieldsFilled) {
        alert("Please fill all required fields.");
        return;
      }
  
      const res = await onStripeSubmit();
  
      if (res?.success) {
        handleSubmit(e);
        console.log("payment success");
        alert("payment success");
      } 
    } catch (error) {
      console.error("An error occurred during submission:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[455px]">
      <form className="w-full border border-[#000000]/20 px-[25px] py-[25px] mb-10  bg-[#FFFFFF]" onSubmit={(e) => onSubmit(e)}>
        <CreditCardInput />
        <input
          className="px-3 border-[1px] bg-[#F2F2F2]  outline-none h-[45px] w-full  text-[15px] text-[#00000033] font-futurapt font-normal placehoder:text-[#000000]"
          type="text"
          placeholder="Name on card"
        />
<Text className="text-black text-[12px] leading-[11.54px] font-normal mt-2">You'll receive receipts and notifications at this email</Text>
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
      <span className="text-gray-700 text-sm md:text-base">
        Sign up to receive news and updates
      </span>
    </label>


        {/* button */}

        <Button loading={loading} className="w-full h-[60.19px] mt-5 mb-3 bg-[#000000] max-w-full text-white ">
        {loading ? "Submitting..." : " Place Order"}
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
