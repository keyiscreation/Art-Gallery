import { NextResponse, NextRequest } from "next/server";

import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
  });

  try {
    const { amount, metadata } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      metadata,
    });

    // console.log({ client_secret: paymentIntent?.client_secret });

    return NextResponse.json({
      success: true,
      error: null,
      data: { client_secret: paymentIntent?.client_secret },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error, data: null });
  }
}
