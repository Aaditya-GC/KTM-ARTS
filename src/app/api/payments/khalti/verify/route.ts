import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyKhaltiPayment } from "@/lib/payments/khalti";
import { confirmOrder } from "@/lib/order-actions";

export async function GET(request: NextRequest) {
  const pidx = request.nextUrl.searchParams.get("pidx");
  const orderId = request.nextUrl.searchParams.get("order_id");
  const isPublic = request.nextUrl.searchParams.get("public") === "true";

  if (!pidx || !orderId) {
    return NextResponse.redirect(new URL(isPublic ? "/checkout" : "/dashboard/customer/orders", request.url));
  }

  try {
    const result = await verifyKhaltiPayment(pidx);
    if (result.status === "Completed") {
      await confirmOrder(orderId);
    }
  } catch {
    // Log error but still redirect
  }

  const redirectUrl = isPublic
    ? `/checkout/confirmation/${orderId}`
    : `/dashboard/customer/orders/${orderId}`;
  return NextResponse.redirect(new URL(redirectUrl, request.url));
}
