import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { confirmOrder } from "@/lib/order-actions";

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("order_id");
  const refId = request.nextUrl.searchParams.get("refId");
  const isPublic = request.nextUrl.searchParams.get("public") === "true";

  if (orderId && refId) {
    await confirmOrder(orderId);
  }

  const redirectUrl = orderId
    ? isPublic
      ? `/checkout/confirmation/${orderId}`
      : `/dashboard/customer/orders/${orderId}`
    : isPublic
      ? "/checkout"
      : "/dashboard/customer/orders";
  return NextResponse.redirect(new URL(redirectUrl, request.url));
}
