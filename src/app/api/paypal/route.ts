import { NextResponse } from "next/server";

const PAYPAL_CLIENT_ID =
  "AVktqGP6uIe_3GNWVeUsFJG3xgCbXgvEp9_v_qPHm4C_duQG8m5--0ODsFiWDmaENkZCycxslQhXDNYH";
const PAYPAL_CLIENT_SECRET =
  "EJ-HcMKYsWJKKwuVHRW0v1GTLlvo0u_LfLqWFC6mlw5OMYVpeHNaKZZqQ0s4knbal8fZ1eRHLt-FANUj";

// Function to create a new PayPal order
async function createPayPalOrder(orderId: string, payerId: string) {
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
    throw new Error("Failed to obtain access token from PayPal.");
  }

  // Step 2: Create a New PayPal Order
  const createOrderResponse = await fetch(
    "https://api-m.sandbox.paypal.com/v2/checkout/orders",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE", // We want to capture the payment immediately
        purchase_units: [
          {
            amount: {
              currency_code: "USD", // Set the currency code (USD in this case)
              value: "5.00", // Set the order amount (you can modify this)
            },
          },
        ],
        application_context: {
          return_url: `http://localhost:3000/paypal-return`, // Dynamic return URL with orderId and payerId
          cancel_url: "http://localhost:3000/cancel-url", // Same as before
        },
      }),
    }
  );

  const orderData = await createOrderResponse.json();
  return orderData; // Return the newly created order data
}

export async function POST(req: Request) {
  try {
    const { paypalOrder } = await req.json(); // Receive the PayPal order from frontend

    // Extract necessary info from the received PayPal order
    const orderId = paypalOrder.id; // Order ID from the frontend
    console.log("order id", orderId);
    const amount = paypalOrder.purchase_units[0].amount.value; // Amount from the order
    const payerName = paypalOrder.payer.name.given_name; // Payer's name
    const payerEmail = paypalOrder.payer.email_address; // Payer's email

    console.log("✅ Received PayPal Order:", {
      orderId,
      payerName,
      payerEmail,
      amount,
    });

    // Step 1: Create a new PayPal order
    const orderData = await createPayPalOrder(orderId, payerName); // Pass orderId and payerId
    console.log("Created New PayPal Order:", orderData);

    // Step 2: Return the approve URL to redirect the user for approval
    const approveUrl = orderData.links.find(
      (link: any) => link.rel === "approve"
    )?.href;

    if (approveUrl) {
      // Redirect the user to PayPal for approval (this part should be done on the frontend)
      return NextResponse.json({
        message: "Redirect the user to PayPal for approval",
        approveUrl,
      });
    } else {
      throw new Error("PayPal approval URL not found.");
    }
  } catch (err: any) {
    console.error("❌ Error handling PayPal payment:", err);
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
