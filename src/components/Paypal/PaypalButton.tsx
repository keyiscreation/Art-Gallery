"use client";

import React from "react";
import {
  PayPalScriptProvider,
  PayPalButtons as PayPalButton,
} from "@paypal/react-paypal-js";
import useShoppingCart from "@/hooks/useShoppingCart"; // Import your hook

// Define AmountBreakdown type
interface AmountBreakdown {
  item_total?: {
    currency_code: string;
    value: string;
  };
  shipping?: {
    currency_code: string;
    value: string;
  };
  handling?: {
    currency_code: string;
    value: string;
  };
  tax_total?: {
    currency_code: string;
    value: string;
  };
  shipping_discount?: {
    currency_code: string;
    value: string;
  };
}

// Define PurchaseUnit type
interface PurchaseUnit {
  reference_id?: string;
  amount?: {
    currency_code: string;
    value: string;
    breakdown?: AmountBreakdown;
  };
  payments?: {
    captures?: Array<{
      id?: string;
      status?: string;
      amount?: {
        currency_code: string;
        value: string;
      };
    }>;
  };
}

// Define PayPalOrderDetails type
interface PayPalOrderDetails {
  id?: string;
  status?: string;
  payer?: {
    email_address?: string;
    name?: {
      given_name?: string;
      surname?: string;
    };
  };
  purchase_units?: PurchaseUnit[]; // Use the extended PurchaseUnit type
}

const PayPalButtons = () => {
  const { cartProductsTotalPrice } = useShoppingCart(); // Get the total cart price

  const handlePaymentSuccess = async (details: PayPalOrderDetails) => {
    try {
      // Send the payment details to the backend API for processing
      const res = await fetch("/api/paypal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paypalOrder: details, // Send the PayPal payment details to the backend
        }),
      });

      const data = await res.json();
      if (data.message === "Redirect the user to PayPal for approval") {
        // Extract the approve URL and redirect the user to PayPal
        const approveUrl = data.approveUrl;
        window.location.href = approveUrl; // Redirect the user to PayPal
      } else {
        alert("Payment processing failed");
      }
    } catch (error) {
      console.error("Error processing payment", error);
      alert("An error occurred while processing the payment");
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId:
          "AVktqGP6uIe_3GNWVeUsFJG3xgCbXgvEp9_v_qPHm4C_duQG8m5--0ODsFiWDmaENkZCycxslQhXDNYH",
      }}
    >
      <div className="paypal-button-container">
        <PayPalButton
          style={{ layout: "vertical" }}
          createOrder={(data, actions) => {
            return actions?.order?.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD",
                    value: cartProductsTotalPrice.toFixed(2),
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            if (actions?.order) {
              const details = await actions.order.capture();
              handlePaymentSuccess(details); // Send details to backend for processing
            }
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalButtons;
