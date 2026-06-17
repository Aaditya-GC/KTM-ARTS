import { db } from "@/lib/db";
import { orders, wishlistItems, artists } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/roles";
import { eq, desc, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PriceDisplay } from "@/components/shared/price-display";
import { CustomerCartSection } from "./customer-cart";
import { QuickActionCards } from "./quick-action-cards";

export default async function CustomerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [orderCountResult, wishlistCountResult, artistCountResult] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.customerId, user.id)),
    db.select({ count: sql<number>`count(*)` }).from(wishlistItems).where(eq(wishlistItems.userId, user.id)),
    db.select({ count: sql<number>`count(*)` }).from(artists),
  ]);

  const orderCount = Number(orderCountResult[0]?.count ?? 0);
  const wishlistCount = Number(wishlistCountResult[0]?.count ?? 0);
  const artistCount = Number(artistCountResult[0]?.count ?? 0);

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
      {/* Hero Banner */}
      <section>
        <h1 className="text-headline-md text-on-surface mb-2">
          Welcome back, {typeof user.fullName === "string" ? user.fullName.split(" ")[0] : "there"}
        </h1>
        <p className="text-body-md text-on-surface-variant mb-6">
          Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : "recently"}
        </p>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-surface-container-low border border-outline-variant rounded-sm p-6 text-center">
            <p className="text-headline-md text-primary font-bold">{orderCount}</p>
            <p className="text-label-sm text-on-surface-variant mt-1">Orders</p>
            <p className="text-[11px] text-on-surface-variant/60">Total placed</p>
          </div>
          <div className="bg-surface-container-low border border-outline-variant rounded-sm p-6 text-center">
            <p className="text-headline-md text-primary font-bold">{wishlistCount}</p>
            <p className="text-label-sm text-on-surface-variant mt-1">Wishlist</p>
            <p className="text-[11px] text-on-surface-variant/60">Saved items</p>
          </div>
          <div className="bg-surface-container-low border border-outline-variant rounded-sm p-6 text-center">
            <p className="text-headline-md text-primary font-bold">{artistCount}</p>
            <p className="text-label-sm text-on-surface-variant mt-1">Artists</p>
            <p className="text-[11px] text-on-surface-variant/60">On the platform</p>
          </div>
        </div>
      </section>

      {/* Quick Action Cards */}
      <QuickActionCards />

      {/* Two-column: Cart + Recent Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <p className="text-body-md text-primary"><PriceDisplay priceNpr={order.totalNpr} /></p>
                    <p className="text-label-sm text-on-surface-variant uppercase">{order.status}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
