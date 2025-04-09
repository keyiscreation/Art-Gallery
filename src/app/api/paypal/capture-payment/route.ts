// app/api/paypal/capture-payment/route.ts

import { NextResponse } from "next/server";

const PAYPAL_CLIENT_ID =
  "AVktqGP6uIe_3GNWVeUsFJG3xgCbXgvEp9_v_qPHm4C_duQG8m5--0ODsFiWDmaENkZCycxslQhXDNYH";
const PAYPAL_CLIENT_SECRET =
  "EJ-HcMKYsWJKKwuVHRW0v1GTLlvo0u_LfLqWFC6mlw5OMYVpeHNaKZZqQ0s4knbal8fZ1eRHLt-FANUj";

export async function POST(req: Request) {
  try {
    const { token, payerId } = await req.json();

    if (!token || !payerId) {
      return NextResponse.json(
        { message: "Missing parameters" },
        { status: 400 }
      );
    }

    const captureResponse = await capturePayment(token, payerId);

    if (captureResponse.status === "COMPLETED") {
      return NextResponse.json({ message: "Payment successfully captured" });
    } else {
      return NextResponse.json(
        { message: "Payment capture failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error capturing payment:", error);
    return NextResponse.json(
      { message: "Error processing payment" },
      { status: 500 }
    );
  }
}

// Function to capture the payment
async function capturePayment(orderId: string, payerId: string) {
  const authResponse = await fetch(
    "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
        ).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    }
  );

  const authData = await authResponse.json();
  const accessToken = authData.access_token;

  if (!accessToken) {
    throw new Error("Failed to obtain access token.");
  }

  const captureResponse = await fetch(
    `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payer_id: payerId }),
    }
  );

  const captureData = await captureResponse.json();
  return captureData;
}
