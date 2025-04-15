import { NextResponse } from "next/server";

interface ConfirmOrderPayload {
  embryonicOrderId: number;
  deliveryOptionId: number;
  externalReference: string;
  shippingCharge: number | string; // may be string
  productCharge: number | string; // may be string
  salesTax: number | string;
}

// Function to get exchange rate from GBP to USD
const getExchangeRate = async (): Promise<number> => {
  try {
    // Fetch the exchange rate for GBP to USD conversion (GBP to USD, not USD to GBP)
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/419e95954b82776038815396/latest/GBP`
    );
    const data = await response.json();
    const usdRate = data.conversion_rates.USD;

    if (!usdRate) {
      throw new Error("Failed to fetch exchange rate");
    }

    // The exchange rate is already from GBP to USD, so no need to invert it
    return usdRate;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    throw new Error("Unable to fetch exchange rate");
  }
};

export async function POST(request: Request) {
  try {
    // Parse payload, including fulfillment charges
    const {
      embryonicOrderId,
      deliveryOptionId,
      externalReference,
      shippingCharge,
      productCharge,
      salesTax,
    }: ConfirmOrderPayload = await request.json();

    // Convert values to numbers (fallback to 0 if invalid)
    const effectiveShippingCharge = Number(shippingCharge) || 0;
    const effectiveProductCharge = Number(productCharge) || 0;
    const effectiveSalesTax = Number(salesTax) || 0;

    // Sum the charges
    const totalFulfillmentCharge =
      effectiveShippingCharge + effectiveProductCharge;

    // Build the confirmation payload for CreativeHub
    const confirmPayload = {
      OrderId: embryonicOrderId,
      DeliveryOptionId: deliveryOptionId,
      DeliveryChargeExcludingSalesTax: totalFulfillmentCharge,
      DeliveryChargeSalesTax: effectiveSalesTax,
      ExternalReference: externalReference,
    };

    // Call CreativeHub's confirmed order endpoint

    //testing Account
    const confirmResponse = await fetch(
      "https://api.sandbox.tps-test.io/api/v1/orders/confirmed",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `ApiKey ${process.env.CREATIVE_HUB_API_KEY}`,
        },
        body: JSON.stringify(confirmPayload),
      }
    );

    //Production Account
    // const confirmResponse = await fetch(
    //   "https://api.creativehub.io/api/v1/orders/confirmed",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Accept: "application/json",
    //       Authorization: `ApiKey ${process.env.CREATIVE_HUB_API_KEY}`,
    //     },
    //     body: JSON.stringify(confirmPayload),
    //   }
    // );

    const confirmResponseText = await confirmResponse.text();

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

    // Extract the correct value for PrintCostExcludingSalesTax and other charges
    const printCostExcludingSalesTax =
      confirmData.PrintCostExcludingSalesTax || 0;

    const deliveryChargeExcludingSalesTax =
      confirmData.DeliveryOption?.DeliveryChargeExcludingSalesTax || 0;

    // Calculate total charge
    const totalCharge =
      deliveryChargeExcludingSalesTax + printCostExcludingSalesTax;

    // console.log("pound", totalCharge);

    // Fetch the exchange rate for GBP to USD conversion
    const exchangeRate = await getExchangeRate();

    // Convert the total charge from GBP to USD
    const totalChargeInUSD = totalCharge * exchangeRate;

    const totalChargeInUSDRounded = Math.round(totalChargeInUSD);

    // console.log("Total Charge in USD cents:", totalChargeInUSDRounded);

    // Send the response back with the correct values to the client
    return NextResponse.json(
      {
        success: true,
        data: {
          DeliveryChargeExcludingSalesTax: deliveryChargeExcludingSalesTax,
          PrintCostExcludingSalesTax: printCostExcludingSalesTax,
          TotalCharge: totalChargeInUSDRounded, // Sum of both charges
        },
      },
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
