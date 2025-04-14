import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    // Parse the request body to get the embryonicOrderId
    const requestBody = await request.json();
    const { embryonicOrderId } = requestBody;

    // console.log("embryonicOrderId", embryonicOrderId);

    // Check if embryonicOrderId is provided
    if (!embryonicOrderId) {
      console.error("Embryonic Order ID is missing in the request body.");
      return NextResponse.json(
        { success: false, error: "Embryonic Order ID is required" },
        { status: 400 }
      );
    }

    // console.log("Canceling embryonic order with ID:", embryonicOrderId);

    // Call CreativeHub's DELETE API to cancel the embryonic order
    const response = await fetch(
      `https://api.sandbox.tps-test.io/api/v1/orders/${embryonicOrderId}`, // URL to cancel the order
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `ApiKey app-sc-j10NXtjDR5t45YCZZRgmCqjDjmFb8CKp`,
        },
      }
    );

    // Check if response body is empty before parsing it
    let responseData;
    if (response.ok) {
      const textResponse = await response.text(); // Get response as text first
      if (textResponse) {
        responseData = JSON.parse(textResponse); // Parse only if there is a response
        console.log("CreativeHub response:", responseData);
      } else {
        console.log("No response data received.");
      }
    } else {
      console.error("Failed to cancel order:", response.statusText);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to cancel the order",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order successfully canceled",
    });
  } catch (error) {
    console.error("Error canceling embryonic order:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
