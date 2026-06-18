/*
 * Stripe Webhook Handler
 *
 * Local testing with Stripe CLI:
 *   stripe listen --forward-to localhost:3000/api/payments/stripe/webhook
 *   stripe trigger checkout.session.completed
 *
 * Requires STRIPE_WEBHOOK_SECRET env var set to the webhook signing secret.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { confirmOrder } from "@/lib/order-actions";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  try {
    const stripe = new (await import("stripe")).default(process.env.STRIPE_SECRET_KEY!);
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as { metadata?: { orderId?: string } };
      if (session.metadata?.orderId) {
        await confirmOrder(session.metadata.orderId);
      }
    }

    // Acknowledge all event types — unhandled events are not errors
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
