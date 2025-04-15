import { NextResponse } from "next/server";

// Function to create a new PayPal order
async function createPayPalOrder(orderId: string, payerId: string) {
  console.log(orderId, payerId);
  const authResponse = await fetch(
    "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_CLIENT_SECRET
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
          return_url: `https://art-gallery-git-main-keyiscreations-projects.vercel.app//paypal-return`,
          cancel_url:
            "https://art-gallery-git-main-keyiscreations-projects.vercel.app//cancel-url",
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
    // console.log("order id", orderId);
    // const amount = paypalOrder.purchase_units[0].amount.value;
    const payerName = paypalOrder.payer.name.given_name;
    // const payerEmail = paypalOrder.payer.email_address;

    // console.log("Received PayPal Order:", {
    //   orderId,
    //   payerName,
    //   payerEmail,
    //   amount,
    // });

    // Step 1: Create a new PayPal order
    const orderData = await createPayPalOrder(orderId, payerName); // Pass orderId and payerId
    // console.log("Created New PayPal Order:", orderData);

    // Step 2: Return the approve URL to redirect the user for approval
    const approveUrl = orderData.links.find(
      (link: { rel: string; href: string }) => link.rel === "approve"
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
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Error handling PayPal payment:", err);
      return NextResponse.json(
        { message: err.message || "Internal Server Error" },
        { status: 500 }
      );
    } else {
      console.error("❌ Unexpected error:", err);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
