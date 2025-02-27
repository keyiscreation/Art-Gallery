import React from "react";

import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import Text from "@/components/ui/Text";

const CreditCardInput = () => {
  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: "16px",
        "::placeholder": {
          fontSize: "14px",
          padding: "50px",
          color: "#00000033",
          border: "1px solid #C8C8C8",
        },
        color: "#000",
        border: "1px solid #C8C8C8",
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
        border: "1px solid #C8C8C8",
      },
      // fontSize: "16px",
    },
  };

  return (
    <div className="w-full ">
      <Text className="text-[16px] text-[#000000] font-futuraBT font-normal mb-2">
        Card Number
      </Text>
      <CardNumberElement options={CARD_ELEMENT_OPTIONS} />

      <div className="flex w-full items-center gap-2">
        <div className="w-[49%]">
          <Text className="text-[16px] text-[#000000] font-futuraBT font-normal mb-2">
            Expiry Date
          </Text>
          <CardExpiryElement
            className="expiryStripe flex-shrink-0"
            options={CARD_ELEMENT_OPTIONS}
          />
        </div>
        <div className="w-[49%]">
          <Text className="text-[16px] text-[#000000] font-futuraBT font-normal mb-2">
            CVC
          </Text>
          <CardCvcElement
            className="cvcStripe flex-shrink-0 "
            options={CARD_ELEMENT_OPTIONS}
          />
        </div>
      </div>
    </div>
  );
};

export default CreditCardInput;
