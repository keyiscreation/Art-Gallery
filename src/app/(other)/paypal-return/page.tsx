import React from "react";
import Link from "next/link";
// "use client";

const PayPalCancel = () => {
  return (
    <div>
      <h2>Your payment is done successfully</h2>
      <p>
        Your payment was completed. You can go back to your cart and order more
      </p>
      <Link href="/cart">
        <button>Go to Cart</button>
      </Link>
    </div>
  );
};

export default PayPalCancel;
