"use server";

import Stripe from "stripe";

export async function createStripeCheckoutSession(orderData: {
  orderId: string;
  items: Array<{ title: string; priceUsd: number; quantity: number }>;
}) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: orderData.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.title },
        unit_amount: Math.round(item.priceUsd * 100),
      },
      quantity: item.quantity,
    })),
    metadata: { orderId: orderData.orderId },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/customer/orders/${orderData.orderId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/customer/checkout`,
  });

  return session;
}
