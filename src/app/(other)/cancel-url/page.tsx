// app/cancel-url/page.tsx

"use client";

const PayPalCancel = () => {
  return (
    <div>
      <h2>Your payment was canceled</h2>
      <p>
        Your payment was not completed. You can go back to your cart or try
        again.
      </p>
      <button onClick={() => (window.location.href = "/cart")}>
        Go to Cart
      </button>
    </div>
  );
};

export default PayPalCancel;
