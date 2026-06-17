"use server";

import { db } from "@/lib/db";
import { orders, orderItems, artworks } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { initiateKhaltiPayment } from "@/lib/payments/khalti";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function createOrder(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const itemsJson = formData.get("items") as string;
    const items: Array<{ artworkId: string; title: string; priceNpr: number; priceUsd?: number }> = JSON.parse(itemsJson);

    const totalNpr = items.reduce((sum, i) => sum + i.priceNpr, 0);

    // Reserve stock: available → reserved
    const artworkIds = items.map((i) => i.artworkId);
    await db
      .update(artworks)
      .set({ status: "reserved" })
      .where(inArray(artworks.id, artworkIds));

    const [order] = await db.insert(orders).values({
      customerId: user.id,
      totalNpr,
      shippingName: formData.get("shippingName") as string,
      shippingAddress: JSON.parse(formData.get("shippingAddress") as string),
      shippingPhone: formData.get("shippingPhone") as string,
      notes: formData.get("notes") as string,
      paymentMethod: formData.get("paymentMethod") as string,
    }).returning({
      id: orders.id,
      totalNpr: orders.totalNpr,
    });

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
  } catch {
    throw new Error("Order creation failed. Please try again.");
  }
}

export async function initiateOrderPayment(formData: FormData, publicCheckout = false) {
  const order = await createOrder(formData);
  if (!order) throw new Error("Order creation failed");

  const method = formData.get("paymentMethod") as string;
  const successPath = publicCheckout
    ? `/checkout/confirmation/${order.id}`
    : `/dashboard/customer/orders/${order.id}`;

  if (method === "khalti") {
    const result = await initiateKhaltiPayment({
      orderId: order.id,
      amountNpr: order.totalNpr,
      returnUrl: `${SITE_URL}/api/payments/khalti/verify?order_id=${order.id}&public=${publicCheckout}`,
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
      `success_url=${SITE_URL}/api/payments/esewa/verify?order_id=${order.id}&public=${publicCheckout}&` +
      `failure_url=${SITE_URL}${successPath}`
    );
  }

  if (method === "stripe") {
    const stripeItems: Array<{ artworkId: string; title: string; priceNpr: number; priceUsd?: number }> = JSON.parse(formData.get("items") as string);
    const { createStripeCheckoutSession } = await import("@/lib/payments/stripe");
    const session = await createStripeCheckoutSession({
      orderId: order.id,
      publicCheckout,
      items: stripeItems.map((i) => ({ title: i.title, priceUsd: i.priceUsd ?? Math.round(i.priceNpr / 137), quantity: 1 })),
    });
    redirect(session.url!);
  }

  redirect(successPath);
}

export async function confirmOrder(orderId: string) {
  // Mark order as paid
  await db.update(orders)
    .set({ status: "paid" })
    .where(eq(orders.id, orderId));

  // Mark artworks as sold
  const items = await db
    .select({ artworkId: orderItems.artworkId })
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  if (items.length > 0) {
    await db
      .update(artworks)
      .set({ status: "sold" })
      .where(inArray(artworks.id, items.map((i) => i.artworkId)));
  }

  revalidatePath(`/dashboard/customer/orders/${orderId}`);
  revalidatePath("/dashboard/customer/orders");
  revalidatePath(`/checkout/confirmation/${orderId}`);
}

export async function releaseReservedArtworks(orderId: string) {
  const items = await db
    .select({ artworkId: orderItems.artworkId })
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  if (items.length > 0) {
    await db
      .update(artworks)
      .set({ status: "available" })
      .where(inArray(artworks.id, items.map((i) => i.artworkId)));
  }

  await db.update(orders)
    .set({ status: "cancelled" })
    .where(eq(orders.id, orderId));
}
