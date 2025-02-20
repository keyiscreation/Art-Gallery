import React from "react";

import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";

const CreditCardInput = () => {
  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: "16px",
        "::placeholder": {
          fontSize: "14px",
        padding: "50px",
        color: "#000",
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
      <CardNumberElement options={CARD_ELEMENT_OPTIONS} />

      <div className="flex w-full items-center gap-2">
        <CardExpiryElement
          className="expiryStripe flex-shrink-0"
          options={CARD_ELEMENT_OPTIONS}
        />

        <CardCvcElement
          className="cvcStripe flex-shrink-0"
          options={CARD_ELEMENT_OPTIONS}
        />
      </div>
    </div>
  );
};

export default CreditCardInput;
