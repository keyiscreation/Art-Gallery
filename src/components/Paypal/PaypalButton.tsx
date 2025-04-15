import React from "react";
import {
  PayPalScriptProvider,
  PayPalButtons as PayPalButton,
} from "@paypal/react-paypal-js";
import useShoppingCart from "@/hooks/useShoppingCart";
import axios from "axios";

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
  purchase_units?: PurchaseUnit[];
}

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

interface PayPalProps {
  amountToCharge: number;
  formData: FormData;
  embryonicOrderId: number;
}

const PayPalButtons: React.FC<PayPalProps> = ({
  formData,
  amountToCharge,
  embryonicOrderId,
}) => {
  const { cartProducts, getItemQuantity } = useShoppingCart();
  const updatedFormData = { ...formData };

  const amountToChargeString = amountToCharge.toString();

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

  const handlePaymentSuccess = async (details: PayPalOrderDetails) => {
    try {
      const res = await fetch("/api/paypal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paypalOrder: details,
        }),
      });

      const data = await res.json();
      if (data.message === "Redirect the user to PayPal for approval") {
        // Extract the approve URL and redirect the user to PayPal
        const approveUrl = data.approveUrl;
        window.location.href = approveUrl;
      } else {
        alert("Payment processing failed");
      }

      if (data.message === "Redirect the user to PayPal for approval") {
        const emailRes = await axios.post("/api/order", updatedFormData);
        if (emailRes.data.message === "Email Sent Successfully") {
          alert("Order confirmed and email sent!");
          window.location.reload();
        } else {
          throw new Error("Email sending failed");
        }
      }
    } catch (error) {
      console.error("Error processing payment", error);
      alert("An error occurred while processing the payment");
    }
  };

  const handlePaymentFailure = async () => {
    try {
      // Cancel the order if the payment fails
      const cancelRes = await fetch("/api/cancel-order", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embryonicOrderId,
        }),
      });
      const cancelData = await cancelRes.json();
      console.log("Order cancelled:", cancelData);
    } catch (error) {
      console.error("Error canceling the order:", error);
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId:
          //live id
          // "ASlbVPtp1B_5ahocMQA_2t1PPy_iSkVFP7zRRHcUO9I013EWkQAZLev0ZJvjb3dt0fH--_wkl9OQolhW",

          //test id
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
                    value: amountToChargeString,
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
          onError={async () => {
            console.log("Payment failed");
            await handlePaymentFailure(); // Call the cancel order function if payment fails
            alert("Payment failed. The order has been canceled.");
            window.location.reload();
          }}
          onCancel={async () => {
            console.log("Payment failed");
            await handlePaymentFailure(); // Call the cancel order function if payment fails
            alert("Payment failed. The order has been canceled.");
            window.location.reload();
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalButtons;
