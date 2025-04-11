import React from "react";
import Link from "next/link";

import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";

const PayPalCancel = () => {
  return (
    <div>
      <Text as="h2" className="text-black text-center mb-10">
        Your payment is done successfully
      </Text>
      <Text className="text-black text-center text-[20px]">
        Your payment was completed. You can go back to your cart and order more.
      </Text>
      <div className="flex justify-center items-center my-10">
        <Link href="/cart">
          <Button className="bg-black text-white capitalize rounded-[12px] w-[300px]">
            Go back Cart
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PayPalCancel;
