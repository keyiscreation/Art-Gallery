"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";

const PayPalCancel = () => {
  const [cancelMessage, setCancelMessage] = useState("");

  useEffect(() => {
    const cancelOrder = async () => {
      try {
        const embryonicOrderId = localStorage.getItem("embryonicOrderId");

        if (!embryonicOrderId) {
          setCancelMessage("Could not find the order to cancel.");
          return;
        }

        const res = await fetch("/api/cancel-order", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ embryonicOrderId: Number(embryonicOrderId) }),
        });

        const data = await res.json();
        console.log("Order cancelled:", data);
        setCancelMessage("Your order has been successfully cancelled.");
        localStorage.removeItem("embryonicOrderId");
      } catch (error) {
        console.error("Error cancelling order:", error);
        setCancelMessage("Something went wrong while cancelling the order.");
      }
    };

    cancelOrder();
  }, []);

  return (
    <div>
      <Text as="h2" className="text-black text-center mb-10">
        Your payment has been cancelled.
      </Text>
      <Text className="text-black text-center text-[20px] mb-4">
        {cancelMessage || "Cancelling your order..."}
      </Text>
      <div className="flex justify-center items-center my-10">
        <Link href="/cart">
          <Button className="bg-black capitalize text-white rounded-[12px] w-[300px]">
            Go back to Cart
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PayPalCancel;
