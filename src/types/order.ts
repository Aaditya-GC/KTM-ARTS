import type { Order, OrderItem, CartItem as DbCartItem } from "@/lib/db/schema";

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";
export type { Order, OrderItem, DbCartItem };
