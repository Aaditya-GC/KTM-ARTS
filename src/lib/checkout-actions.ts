"use server";

import { db } from "@/lib/db";
import { orders, orderItems, artworks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface CreateOrderInput {
  customerId?: string;
  shippingName: string;
  shippingAddress: Record<string, string>;
  shippingPhone: string;
  notes?: string;
  stripePaymentIntentId: string;
  items: Array<{ artworkId: string; priceNpr: number }>;
}

export async function createCheckoutOrder(input: CreateOrderInput) {
  try {
    const totalNpr = input.items.reduce((sum, i) => sum + i.priceNpr, 0);

    const [order] = await db
      .insert(orders)
      .values({
        customerId: input.customerId,
        status: "paid",
        totalNpr,
        shippingName: input.shippingName,
        shippingAddress: input.shippingAddress,
        shippingPhone: input.shippingPhone,
        notes: input.notes,
      })
      .returning({
        id: orders.id,
        totalNpr: orders.totalNpr,
        status: orders.status,
        customerId: orders.customerId,
        shippingName: orders.shippingName,
        shippingAddress: orders.shippingAddress,
        shippingPhone: orders.shippingPhone,
        createdAt: orders.createdAt,
      });

    await db.insert(orderItems).values(
      input.items.map((item) => ({
        orderId: order.id,
        artworkId: item.artworkId,
        priceNpr: item.priceNpr,
        quantity: 1,
      }))
    );

    for (const item of input.items) {
      await db
        .update(artworks)
        .set({ status: "sold" })
        .where(eq(artworks.id, item.artworkId));
    }

    revalidatePath("/dashboard/customer/orders");
    return order;
  } catch {
    throw new Error("Failed to create order. Please try again.");
  }
}

export async function getOrderById(orderId: string) {
  const [order] = await db
    .select({
      id: orders.id,
      totalNpr: orders.totalNpr,
      status: orders.status,
      customerId: orders.customerId,
      shippingName: orders.shippingName,
      shippingAddress: orders.shippingAddress,
      shippingPhone: orders.shippingPhone,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) return null;

  const items = await db
    .select({
      id: orderItems.id,
      priceNpr: orderItems.priceNpr,
      artworkId: orderItems.artworkId,
      orderId: orderItems.orderId,
      quantity: orderItems.quantity,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  return { ...order, items };
}
