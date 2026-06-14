import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { confirmOrder } from "@/lib/order-actions";

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("order_id");
  const refId = request.nextUrl.searchParams.get("refId");

  if (orderId && refId) {
    await confirmOrder(orderId);
  }

  return NextResponse.redirect(
    new URL(orderId ? `/dashboard/customer/orders/${orderId}` : "/dashboard/customer/orders", request.url)
  );
}
