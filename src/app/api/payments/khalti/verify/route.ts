import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyKhaltiPayment } from "@/lib/payments/khalti";
import { confirmOrder } from "@/lib/order-actions";

export async function GET(request: NextRequest) {
  const pidx = request.nextUrl.searchParams.get("pidx");
  const orderId = request.nextUrl.searchParams.get("order_id");

  if (!pidx || !orderId) {
    return NextResponse.redirect(new URL("/dashboard/customer/orders", request.url));
  }

  try {
    const result = await verifyKhaltiPayment(pidx);
    if (result.status === "Completed") {
      await confirmOrder(orderId);
    }
  } catch {
    // Log error but still redirect
  }

  return NextResponse.redirect(new URL(`/dashboard/customer/orders/${orderId}`, request.url));
}
