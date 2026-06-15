import { db } from "@/lib/db";
import { orders, orderItems, artworks } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/roles";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CustomerCartSection } from "./customer-cart";

export default async function CustomerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const recentOrders = await db
    .select({
      id: orders.id,
      status: orders.status,
      totalNpr: orders.totalNpr,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.customerId, user.id))
    .orderBy(desc(orders.createdAt))
    .limit(3);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <section>
        <h1 className="text-headline-md text-on-surface mb-2">My Dashboard</h1>
        <p className="text-body-md text-on-surface-variant">
          {user.fullName} &middot; Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : "recently"}
        </p>
      </section>

      <div className="flex gap-4">
        <Link href="/marketplace" className="flex-1 bg-surface-container-low border border-outline-variant p-5 rounded-sm hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-primary text-3xl">store</span>
          <p className="text-body-md text-on-surface mt-2">Browse Marketplace</p>
        </Link>
        <Link href="/dashboard/customer/wishlist" className="flex-1 bg-surface-container-low border border-outline-variant p-5 rounded-sm hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-primary text-3xl">favorite</span>
          <p className="text-body-md text-on-surface mt-2">View Wishlist</p>
        </Link>
        <Link href="/dashboard/customer/orders" className="flex-1 bg-surface-container-low border border-outline-variant p-5 rounded-sm hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-primary text-3xl">receipt_long</span>
          <p className="text-body-md text-on-surface mt-2">Order History</p>
        </Link>
      </div>

      <CustomerCartSection />

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-label-sm uppercase tracking-widest text-primary">Recent Orders</h2>
          {recentOrders.length > 0 && (
            <Link href="/dashboard/customer/orders" className="text-label-sm text-primary hover:underline">
              View All
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12 bg-surface-container-low border border-outline-variant rounded-sm">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-3">receipt_long</span>
            <p className="text-body-md text-on-surface-variant">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/customer/orders/${order.id}`}
                className="flex items-center justify-between p-4 bg-surface-container-low border border-outline-variant rounded-sm hover:bg-surface-container transition-colors"
              >
                <div>
                  <p className="text-body-md text-on-surface">
                    Order #{order.id.substring(0, 8)}
                  </p>
                  <p className="text-label-sm text-on-surface-variant">
                    {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-body-md text-primary">NPR {order.totalNpr.toLocaleString("en-IN")}</p>
                  <p className="text-label-sm text-on-surface-variant uppercase">{order.status}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
