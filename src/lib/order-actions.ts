"use server";

import { db } from "@/lib/db";
import { orders, orderItems, artworks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { initiateKhaltiPayment } from "@/lib/payments/khalti";

export async function createOrder(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const itemsJson = formData.get("items") as string;
  const items: Array<{ artworkId: string; title: string; priceNpr: number; priceUsd?: number }> = JSON.parse(itemsJson);

  const totalNpr = items.reduce((sum, i) => sum + i.priceNpr, 0);

  const [order] = await db.insert(orders).values({
    customerId: user.id,
    totalNpr,
    shippingName: formData.get("shippingName") as string,
    shippingAddress: JSON.parse(formData.get("shippingAddress") as string),
    shippingPhone: formData.get("shippingPhone") as string,
    notes: formData.get("notes") as string,
    paymentMethod: formData.get("paymentMethod") as string,
  }).returning();

  await db.insert(orderItems).values(
    items.map((item) => ({
      orderId: order.id,
      artworkId: item.artworkId,
      priceNpr: item.priceNpr,
      quantity: 1,
    }))
  );

  revalidatePath("/dashboard/customer/orders");
  return order;
}

export async function initiateOrderPayment(formData: FormData) {
  const order = await createOrder(formData);
  if (!order) throw new Error("Order creation failed");

  const method = formData.get("paymentMethod") as string;

  if (method === "khalti") {
    const result = await initiateKhaltiPayment({
      orderId: order.id,
      amountNpr: order.totalNpr,
      returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/khalti/verify?order_id=${order.id}`,
    });

    await db.update(orders)
      .set({ paymentId: result.pidx })
      .where(eq(orders.id, order.id));

    redirect(result.payment_url);
  }

  if (method === "esewa") {
    redirect(
      `https://rc-epay.esewa.com.np/api/epay/main/v2/form?` +
      `amount=${order.totalNpr}&tax_amount=0&total_amount=${order.totalNpr}&` +
      `transaction_uuid=${order.id}-${Date.now()}&product_code=EPAYTEST&` +
      `success_url=${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/esewa/verify?order_id=${order.id}&` +
      `failure_url=${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/customer/orders`
    );
  }

  if (method === "stripe") {
    const stripeItems: Array<{ artworkId: string; title: string; priceNpr: number; priceUsd?: number }> = JSON.parse(formData.get("items") as string);
    const { createStripeCheckoutSession } = await import("@/lib/payments/stripe");
    const session = await createStripeCheckoutSession({
      orderId: order.id,
      items: stripeItems.map((i) => ({ title: i.title, priceUsd: i.priceUsd ?? Math.round(i.priceNpr / 137), quantity: 1 })),
    });
    redirect(session.url!);
  }

  redirect(`/dashboard/customer/orders/${order.id}`);
}

export async function confirmOrder(orderId: string) {
  await db.update(orders)
    .set({ status: "confirmed" })
    .where(eq(orders.id, orderId));

  revalidatePath(`/dashboard/customer/orders/${orderId}`);
  revalidatePath("/dashboard/customer/orders");
}
