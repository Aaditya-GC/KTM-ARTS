"use server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createPaymentIntent(amountNpr: number) {
  try {
    const amountPaisa = Math.round(amountNpr * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountPaisa,
      currency: "npr",
      automatic_payment_methods: { enabled: true },
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
    };
  } catch {
    throw new Error("Failed to create payment intent.");
  }
}
