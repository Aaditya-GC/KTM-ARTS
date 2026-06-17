"use server";

import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
