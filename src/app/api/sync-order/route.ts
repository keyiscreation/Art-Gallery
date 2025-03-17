import { NextResponse } from "next/server";

interface CartItem {
  title: string;
  price: number;
  quantity: number;
  pathnode: string;
  slugtitle: string; // assumed product SKU
  qrLink?: string;
  size: string;
  licence?: string;
}

interface OrderFormData {
  firstName: string;
  lastName: string;
  email: string;
  streetAddress: string;
  aptNumber?: number;
  state: string;
  zipCode: number;
  cartValues: CartItem[];
}

export async function POST(request: Request) {
  try {
    // Parse and log incoming order data from the checkout form
    const formData: OrderFormData = await request.json();
    console.log("Received formData:", formData);

    if (!formData.cartValues || formData.cartValues.length === 0) {
      return NextResponse.json(
        { success: false, error: "No items in cart" },
        { status: 400 }
      );
    }

    // Create an external reference for internal tracking
    const externalReference = `order_${Date.now()}`;

    // Build the shipping address as required by CreativeHub's model.
    const shippingAddress = {
      FirstName: formData.firstName,
      LastName: formData.lastName,
      Line1: formData.streetAddress,
      Line2: formData.aptNumber ? String(formData.aptNumber) : "",
      Town: formData.state,
      County: "",
      PostCode: formData.zipCode ? String(formData.zipCode) : "",
      CountryId: 1, // Example: 1 represents USA (update as needed)
      CountryCode: "US",
      CountryName: "United States",
      PhoneNumber: "",
    };

    // Build the embryonic order payload.
    // Update the mapping for ProductId and PrintOptionId based on your product data.
    const embryonicPayload = {
      Id: 0,
      ExternalReference: externalReference,
      FirstName: formData.firstName,
      LastName: formData.lastName,
      Email: formData.email,
      MessageToLab: "",
      ShippingAddress: shippingAddress,
      OrderItems: formData.cartValues.map((item) => ({
        Id: 0,
        // Example mapping based on the item slug; update these with your actual numeric IDs
        ProductId:
          item.slugtitle === "america"
            ? 37042
            : item.slugtitle === "stars"
            ? 37054
            : item.slugtitle === "fox"
            ? 37052
            : item.slugtitle === "egrets"
            ? 37056
            : item.slugtitle === "morning"
            ? 37048
            : item.slugtitle === "light"
            ? 37047
            : item.slugtitle === "colorado"
            ? 37053
            : item.slugtitle === "moon"
            ? 37050
            : item.slugtitle === "wild"
            ? 37051
            : null, // Replace null with a default value if needed

        PrintOptionId:
          item.slugtitle === "america"
            ? 5872
            : item.slugtitle === "stars"
            ? 5878
            : item.slugtitle === "fox"
            ? 5879
            : item.slugtitle === "egrets"
            ? 5880
            : item.slugtitle === "morning"
            ? 5881
            : item.slugtitle === "light"
            ? 5882
            : item.slugtitle === "colorado"
            ? 5883
            : item.slugtitle === "moon"
            ? 5884
            : item.slugtitle === "wild"
            ? 5885
            : null, // Replace null with a default value if needed

        Quantity: item.quantity,
        ExternalReference: externalReference,
        ExternalSku: item.slugtitle,
      })),
    };

    console.log(
      "Embryonic Payload:",
      JSON.stringify(embryonicPayload, null, 2)
    );

    // Create embryonic order
    const embryonicResponse = await fetch(
      "https://api.sandbox.tps-test.io/api/v1/orders/embryonic",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `ApiKey app-sc-j10NXtjDR5t45YCZZRgmCqjDjmFb8CKp`,
        },
        body: JSON.stringify(embryonicPayload),
      }
    );

    const embryonicResponseText = await embryonicResponse.text();
    console.log(
      "Raw embryonic order response from CreativeHub:",
      embryonicResponseText
    );

    let embryonicData;
    try {
      embryonicData = JSON.parse(embryonicResponseText);
    } catch (err) {
      console.error("Failed to parse embryonic order response JSON:", err);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON response from embryonic order creation",
        },
        { status: embryonicResponse.status }
      );
    }

    if (!embryonicResponse.ok) {
      console.error("CreativeHub embryonic order API error:", embryonicData);
      return NextResponse.json(
        { success: false, error: embryonicData },
        { status: embryonicResponse.status }
      );
    }

    // Use OrderId or Id from the embryonic order response
    const embryonicOrderId = embryonicData.OrderId || embryonicData.Id;
    if (!embryonicOrderId) {
      console.error("Embryonic order creation did not return an OrderId/Id");
      return NextResponse.json(
        {
          success: false,
          error: "Embryonic order creation failed to return OrderId/Id",
        },
        { status: 500 }
      );
    }

    // IMPORTANT: Use a valid DeliveryOptionId.
    // The embryonic response shows available options, e.g., Id 22 ("International Courier") and 2438 ("First Class Tracked Mail").
    // Here, we use 22 as an example. You can choose based on your business logic.
    const confirmPayload = {
      OrderId: embryonicOrderId,
      DeliveryOptionId: 22, // Using 22 from the embryonic response's DeliveryOptions
      // Use the corresponding delivery charges from the chosen option (if needed).
      DeliveryChargeExcludingSalesTax: 36.83,
      DeliveryChargeSalesTax: 0.0,
      ExternalReference: externalReference,
    };

    const confirmResponse = await fetch(
      "https://api.sandbox.tps-test.io/api/v1/orders/confirmed",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `ApiKey app-sc-j10NXtjDR5t45YCZZRgmCqjDjmFb8CKp`,
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
    console.error("Error processing order to CreativeHub:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// test_cd8f716b-c03a-49b2-bfa4-079846a22d23

// import { NextRequest, NextResponse } from "next/server";

// const PRODIGI_API_URL = "https://api.sandbox.prodigi.com/v4.0/Orders";
// const API_KEY = "61a1cf57-ff23-4175-94ca-83d58fc17ce1"; // Placed directly

// export async function POST(req: NextRequest) {
//   try {
//     if (!API_KEY) {
//       return NextResponse.json(
//         { error: "Prodigi API key is missing" },
//         { status: 500 }
//       );
//     }

//     const orderData = await req.json();
//     if (!orderData) {
//       return NextResponse.json(
//         { error: "Order data is required" },
//         { status: 400 }
//       );
//     }

//     const response = await fetch(PRODIGI_API_URL, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${API_KEY}`,
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//       body: JSON.stringify(orderData),
//     });

//     const responseData = await response.json();

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: responseData },
//         { status: response.status }
//       );
//     }

//     return NextResponse.json(
//       { success: true, data: responseData },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Prodigi API Error:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
