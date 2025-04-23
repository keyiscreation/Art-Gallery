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

    //Testing Account;
    // const response = await fetch(
    //   `https://api.sandbox.tps-test.io/api/v1/orders/${embryonicOrderId}`,
    //   {
    //     method: "DELETE",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Accept: "application/json",
    //       Authorization: `ApiKey ${process.env.CREATIVE_HUB_API_KEY}`,
    //     },
    //   }
    // );

    //Production
    const response = await fetch(
      `https://api.creativehub.io/api/v1/orders/${embryonicOrderId}`, // URL to cancel the order
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `ApiKey production-sW8JRmSxvd2TWKNm8rqFkzqVw4ykWF6x`,
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

// import * as admin from "firebase-admin";
// import { https } from "firebase-functions";
// import fetch from "node-fetch";
// import { NextResponse } from "next/server";

// admin.initializeApp();

// const db = admin.firestore();

// // Cloud Function to check for pending orders and cancel them if necessary
// export const checkPendingOrders = https.onRequest(async (req, res) => {
//   try {
//     const ordersSnapshot = await db
//       .collection("orders")
//       .where("status", "==", "pending")
//       .get();

//     const now = new Date().getTime();

//     // Iterate through all pending orders
//     ordersSnapshot.forEach(async (orderDoc) => {
//       const order = orderDoc.data();
//       const orderCreatedAt = order.orderCreatedAt.toDate().getTime();

//       // Check if the order is older than 5 minutes
//       if (now - orderCreatedAt > 5 * 60 * 1000) {
//         // Update status to "canceled"
//         await orderDoc.ref.update({ status: "canceled" });

//         // Call your cancel-order API to cancel the order in CreativeHub
//         const cancelOrderResponse = await cancelOrder(order.embryonicOrderId);

//         if (cancelOrderResponse.success) {
//           console.log(`Order ${order.embryonicOrderId} successfully canceled.`);
//         } else {
//           console.error(
//             `Failed to cancel order ${order.embryonicOrderId}: ${cancelOrderResponse.error}`
//           );
//         }
//       }
//     });

//     res.status(200).send("Checked for pending orders.");
//   } catch (error) {
//     console.error("Error checking pending orders:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Function to call the cancel-order API
// async function cancelOrder(embryonicOrderId: string) {
//   try {
//     const cancelResponse = await fetch(
//       `https://yourdomain.com/api/cancel-order`,
//       {
//         // Replace with your actual URL
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           embryonicOrderId, // Pass the embryonicOrderId to your cancel-order API
//         }),
//       }
//     );

//     if (!cancelResponse.ok) {
//       const errorData = await cancelResponse.json();
//       return {
//         success: false,
//         error: errorData.error || "Failed to cancel order",
//       };
//     }

//     return { success: true, message: "Order canceled successfully" };
//   } catch (error) {
//     console.error("Error calling cancel-order API:", error);
//     return {
//       success: false,
//       error: error.message || "Error calling cancel-order API",
//     };
//   }
// }
