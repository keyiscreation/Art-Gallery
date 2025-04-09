"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation"; // Import useParams from next/navigation

const PayPalReturn = () => {
  const params = useParams(); // Capture dynamic params (token, PayerID)

  useEffect(() => {
    const token = params.token; // Get token from URL path
    const payerId = params.PayerID; // Get PayerID from URL path

    if (token && payerId) {
      // Call your backend to capture the payment
      fetch("/api/paypal/capture-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, payerId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Payment successfully captured") {
            // Payment successfully captured
            alert("Payment successful!");
            // Optionally, redirect to an order confirmation page
            window.location.href = "/order-confirmation"; // Change to an actual page
          } else {
            // Payment failed
            alert("Payment capture failed.");
          }
        });
    }
  }, [params]); // Rerun when params change

  return <div>Processing your payment...</div>;
};

export default PayPalReturn;
