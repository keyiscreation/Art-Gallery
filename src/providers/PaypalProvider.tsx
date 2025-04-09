// src/components/PayPalProvider.tsx

"use client";

import React from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const PayPalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <PayPalScriptProvider
      options={{
        clientId:
          "AVktqGP6uIe_3GNWVeUsFJG3xgCbXgvEp9_v_qPHm4C_duQG8m5--0ODsFiWDmaENkZCycxslQhXDNYH",
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
};

export default PayPalProvider;
