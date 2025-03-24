// pages/api/order-step-two.ts

import { NextResponse } from "next/server";

interface ConfirmOrderPayload {
  embryonicOrderId: number;
  deliveryOptionId: number;
  externalReference: string;
}

export async function POST(request: Request) {
  try {
    const {
      embryonicOrderId,
      deliveryOptionId,
      externalReference,
    }: ConfirmOrderPayload = await request.json();

    // Build the confirmation payload for CreativeHub
    const confirmPayload = {
      OrderId: embryonicOrderId,
      DeliveryOptionId: deliveryOptionId,
      // Optionally, include dynamic charge values if required by CreativeHub:
      // DeliveryChargeExcludingSalesTax: dynamicShippingCharge,
      // DeliveryChargeSalesTax: dynamicSalesTax,
      ExternalReference: externalReference,
    };

    console.log("Confirm Payload:", confirmPayload);

    // Call CreativeHub's confirmed order endpoint
    const confirmResponse = await fetch(
      "https://api.sandbox.tps-test.io/api/v1/orders/confirmed",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `ApiKey ${process.env.CREATIVEHUB_API_KEY}`,
        },
        body: JSON.stringify(confirmPayload),
      }
    );

    const confirmResponseText = await confirmResponse.text();
    console.log(
      "Raw confirmed order response from CreativeHub:",
      confirmResponseText
    );

    let confirmData;
    try {
      confirmData = JSON.parse(confirmResponseText);
    } catch (err) {
      console.error("Failed to parse confirmed order response JSON:", err);
      return NextResponse.json(
        { success: false, error: "Invalid JSON response from confirmed order" },
        { status: confirmResponse.status }
      );
    }

    if (!confirmResponse.ok) {
      console.error("CreativeHub confirmed order API error:", confirmData);
      return NextResponse.json(
        { success: false, error: confirmData },
        { status: confirmResponse.status }
      );
    }

    return NextResponse.json(
      { success: true, data: confirmData },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error processing order confirmation:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
