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
  } catch {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  return NextResponse.json({ received: true });
}
