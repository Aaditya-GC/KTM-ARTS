import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/roles";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PriceDisplay } from "@/components/shared/price-display";

export default async function OrderHistoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const orderList = await db
    .select({
      id: orders.id,
      status: orders.status,
      totalNpr: orders.totalNpr,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.customerId, user.id))
    .orderBy(orders.createdAt);

  const statusColors: Record<string, string> = {
    pending: "text-secondary",
    confirmed: "text-primary",
    shipped: "text-primary",
    delivered: "text-primary",
    cancelled: "text-error",
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-headline-md text-on-surface mb-8">Order History</h1>

      {orderList.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-low rounded-sm">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4">receipt_long</span>
          <p className="text-body-md text-on-surface-variant">No orders yet</p>
          <Link href="/marketplace" className="text-accent text-label-sm uppercase tracking-widest hover:underline mt-4 inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orderList.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/customer/orders/${order.id}`}
              className="flex items-center justify-between bg-surface-container-low p-4 rounded-sm hover:bg-surface-container transition-colors"
            >
              <div>
                <p className="text-body-md text-on-surface">#{order.id.slice(0, 8)}</p>
                <p className="text-label-sm text-on-surface-variant">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-body-md text-primary"><PriceDisplay priceNpr={order.totalNpr} /></p>
                <p className={`text-label-sm uppercase tracking-widest ${statusColors[order.status] ?? ""}`}>
                  {order.status}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
