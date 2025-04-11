// app/cancel-url/page.tsx
import Link from "next/link";
// "use client";

const PayPalCancel = () => {
  return (
    <div>
      <h2>Your payment was canceled</h2>
      <p>
        Your payment was not completed. You can go back to your cart or try
        again.
      </p>
      <Link href="/cart">
        <button>Go to Cart</button>
      </Link>
    </div>
  );
};

export default PayPalCancel;
