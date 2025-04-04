// pages/api/order-step-one.ts

import { NextResponse } from "next/server";
import admin from "firebase-admin";

// Initialize Firebase Admin if not already done (for local testing, values are hardcoded in env vars)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "art-gallery-f4b4f",
      clientEmail:
        "firebase-adminsdk-fbsvc@art-gallery-f4b4f.iam.gserviceaccount.com",
      privateKey:
        "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCdx17amGUtGCOq\n0X+NSVRlviRoFJam3MepGu1/tfLqbJoqukkCF2+aFYYnYmN0g5W8j6Vrv3jrCcr6\nql9Nw5qz+AfPsI+AcVehuhc+NxSLqdWtpg/B3nMrId6OwujAw6jIvYOmysZ0PZB1\npxvAIuWuZpcX6QYjrmGbZymey3HkdcKVRUS+zX4LC3EDVldj/g+8V0Lqh/33ipSh\nig1HiONriVymql6qC0bY3WDKxqvCMPqKoYfkO5M9C6XkFpKbbSdnC75bsqVZGXmS\ndsOFdbTFRkkenum4HM+988e+9Y66dnbtmEE7NIZpZ0WvQCXjomSkug4h8WUQYcOj\nJ+MaeUg5AgMBAAECggEABATvrCbksOzj/7Z9htZe4Yah+8rGebK3HV4zvaSfbwxc\nMwly0axSKf0xYTB28yFk/5wzLRcAGBC0TIVpjxwUBVCktkw7o5x/jH2mmO2jRtmJ\nOXa5AQnPKkKfHkjlz/9L/e0h/O4+dviYhP7ATLk226X+ZFwJzX/kOaa7nzF0kcrJ\n4/W5kAUfytWcKUh4c2HMw6ox6sbbbDnz0JxTxQUJh45l2SO0qrHzEVxzRcG+secy\nQ8XUtVHmFd9+vfffFCnb9IXQSTt3ccs9na5nixxLQSwx9/nBpBYmwadwcXSio5JN\nU4VdYkDvEVMOCKhRsiK0pq1JnpNV3NV+4h6qeoNpwQKBgQDdfww20EJe9DC3aeLG\nLxq9RRqs+GcsM5q3UnQvO6tX0ejxzw7iij3e+vNqsz4UPwGHXlKarzBVeKSNqjeR\nn/IU4TtDYX88RfdRECOa2O9NMAFueMPyT6xLY3UbRf+W0sCQIY3Mh/Fkpz0dHTfb\nqwLM/IXffFO0FsYCUUYe1Sg/qQKBgQC2W1x47NP8hIHJ8kqW+rvkOF+wGDDjsXqN\nt1WZJNALPaJZR3XLCFLY6C9TrIADIkqkUrSETMuLFdBEi/eH6mSXBqelD9wOfOi/\nGarpRAyY4wULE7A+WfsVSfsX+sAhvCvVzbLCp7aMD0aMSP0eX4KRPBvovsVDKHmu\nNh60OCVeEQKBgQClexzh+tgLXv7imR5PGLQugel7Hx7d3DQUEGszOq45r18NAbhK\nMiQlanHf3shbkfMPcr3eSVKgGMFAAdMAXnIbfWasYbQQkOlES/192+N1VI9NPLaQ\nW0wLCuRcGwDoas5pIFhzXYFQxM2Y6dJosKwn/+X44Ucb/gOziYsM0A4A+QKBgDpo\nUtsMh+2Gh4emSkvHbWzwvX1KkkYrr2Q6x3jwuI4RJLHR2KG6Pcbpv1belnXqgtvU\n/aquajdXOkjqR9NJuQRChmmxBbvCOE4VK4/hUuOZOyFMIhQmf+xWsM0CbI2hlqy5\nYLtGOorrzZ3bNu+Giex4wzut9sLG8QpinTz+CsHxAoGBALFgG1c803Dov//H8fjq\nqOlmzeCRs1un+jmurPSDreCX4wHOeq7oA7tBR+o+HFSdcjoHOJnpCuYY9nRgAqOw\nyRe0pTWa5+ttTcumdEoyBxI9DoSdTu9FJPzl6R7eEtJaytCxHgNFKx7fcJnsEQkQ\n37EQeCM+9xHy7h3JZd4d4YXS\n-----END PRIVATE KEY-----\n",
    }),
    databaseURL: "https://art-gallery-f4b4f.firebaseio.com",
  });
}

const db = admin.firestore();

interface CartItem {
  title: string;
  price: number;
  quantity: number;
  pathnode: string;
  slugtitle: string;
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

interface DeliveryOption {
  Id: number;
  DeliveryChargeExcludingSalesTax: number;
  DeliveryChargeSalesTax: number;
}

// Hardcoded mappings for known products
const hardcodedMappings: Record<
  string,
  { productId: number; printOptionId: number }
> = {
  america: { productId: 37042, printOptionId: 5872 },
  stars: { productId: 37054, printOptionId: 5878 },
  fox: { productId: 37052, printOptionId: 5879 },
  egrets: { productId: 37056, printOptionId: 5880 },
  morning: { productId: 37048, printOptionId: 5881 },
  light: { productId: 37047, printOptionId: 5882 },
  colorado: { productId: 37053, printOptionId: 5883 },
  moon: { productId: 37050, printOptionId: 5884 },
  wild: { productId: 37051, printOptionId: 5885 },
};

export async function POST(request: Request) {
  try {
    // Parse incoming order data
    const formData: OrderFormData = await request.json();
    if (!formData.cartValues || formData.cartValues.length === 0) {
      return NextResponse.json(
        { success: false, error: "No items in cart" },
        { status: 400 }
      );
    }

    // Create an external reference for tracking the order
    const externalReference = `order_${Date.now()}`;

    // Build the shipping address per CreativeHub's format
    const shippingAddress = {
      FirstName: formData.firstName,
      LastName: formData.lastName,
      Line1: formData.streetAddress,
      Line2: formData.aptNumber ? String(formData.aptNumber) : "",
      Town: formData.state,
      County: "",
      PostCode: formData.zipCode ? String(formData.zipCode) : "",
      CountryId: 1,
      CountryCode: "US",
      CountryName: "United States",
      PhoneNumber: "",
    };

    // Build the OrderItems array:
    // - If the item's slugtitle exists in hardcodedMappings, use those values.
    // - Otherwise, fetch the product details from Firestore.
    // const orderItems = await Promise.all(
    //   formData.cartValues.map(async (item) => {
    //     if (hardcodedMappings[item.slugtitle]) {
    //       const mapping = hardcodedMappings[item.slugtitle];
    //       return {
    //         Id: 0,
    //         ProductId: mapping.productId,
    //         PrintOptionId: mapping.printOptionId,
    //         Quantity: item.quantity,
    //         ExternalReference: externalReference,
    //         ExternalSku: item.slugtitle,
    //         Licence: item.licence || "",
    //       };
    //     } else {
    //       // Fetch product details from Firestore for new products
    //       const productSnapshot = await db
    //         .collection("products")
    //         .where("slugtitle", "==", item.slugtitle)
    //         .limit(1)
    //         .get();
    //       let productId: number | null = null;
    //       let printOptionId: number | null = null;
    //       let licenseNumber: string = "";
    //       if (!productSnapshot.empty) {
    //         const productData = productSnapshot.docs[0].data();
    //         // Expect licenseNumber in Firestore to be in format "37042-5872"
    //         licenseNumber = productData.licenseNumber || "";
    //         if (licenseNumber) {
    //           const parts = licenseNumber.split("-");
    //           if (parts.length === 2) {
    //             productId = parseInt(parts[0], 10);
    //             printOptionId = parseInt(parts[1], 10);
    //           }
    //         }
    //       }
    //       return {
    //         Id: 0,
    //         ProductId: productId,
    //         PrintOptionId: printOptionId,
    //         Quantity: item.quantity,
    //         ExternalReference: externalReference,
    //         ExternalSku: item.slugtitle,
    //         Licence: licenseNumber,
    //       };
    //     }
    //   })
    // );

    const orderItems = await Promise.all(
      formData.cartValues.map(async (item) => {
        // Always fetch product details from Firestore
        const productSnapshot = await db
          .collection("products")
          .where("slugtitle", "==", item.slugtitle)
          .limit(1)
          .get();
        let productId: number | null = null;
        let printOptionId: number | null = null;
        let licenseNumber: string = "";
        if (!productSnapshot.empty) {
          const productData = productSnapshot.docs[0].data();
          // Expect licenseNumber in Firestore to be in format "37042-5872"
          licenseNumber = productData.licenseNumber || "";
          if (licenseNumber) {
            const parts = licenseNumber.split("-");
            if (parts.length === 2) {
              productId = parseInt(parts[0], 10);
              printOptionId = parseInt(parts[1], 10);
            }
          }
        }
        return {
          Id: 0,
          ProductId: productId,
          PrintOptionId: printOptionId,
          Quantity: item.quantity,
          ExternalReference: externalReference,
          ExternalSku: item.slugtitle,
          Licence: licenseNumber,
        };
      })
    );

    // Build the embryonic order payload to send to CreativeHub
    const embryonicPayload = {
      Id: 0,
      ExternalReference: externalReference,
      FirstName: formData.firstName,
      LastName: formData.lastName,
      Email: formData.email,
      MessageToLab: "",
      ShippingAddress: shippingAddress,
      OrderItems: orderItems,
    };

    // Send embryonic order payload to CreativeHub
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
    let embryonicData;
    try {
      embryonicData = JSON.parse(embryonicResponseText);
    } catch (err) {
      console.log(err);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON response from embryonic order creation",
        },
        { status: embryonicResponse.status }
      );
    }

    if (!embryonicResponse.ok) {
      return NextResponse.json(
        { success: false, error: embryonicData },
        { status: embryonicResponse.status }
      );
    }

    // Retrieve embryonic order ID
    const embryonicOrderId = embryonicData.OrderId || embryonicData.Id;
    if (!embryonicOrderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Embryonic order creation failed to return OrderId/Id",
        },
        { status: 500 }
      );
    }

    // Select desired delivery option (example: option with Id 22)
    const deliveryOption: DeliveryOption | undefined =
      embryonicData.DeliveryOptions.find(
        (option: DeliveryOption) => option.Id === 22
      );
    if (!deliveryOption) {
      return NextResponse.json(
        { success: false, error: "Required delivery option not available" },
        { status: 400 }
      );
    }

    // Extract dynamic shipping charges
    const shippingCharge = deliveryOption.DeliveryChargeExcludingSalesTax;
    const salesTax = deliveryOption.DeliveryChargeSalesTax;
    const totalExtraCharge = shippingCharge + salesTax;

    // Return embryonic order details and extra charges to the client
    return NextResponse.json(
      {
        success: true,
        embryonicOrderId,
        deliveryOptionId: deliveryOption.Id,
        shippingCharge,
        salesTax,
        totalExtraCharge,
        externalReference,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error processing embryonic order:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
