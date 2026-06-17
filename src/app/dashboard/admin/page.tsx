import { db } from "@/lib/db";
import { profiles, artists, artworks, orders } from "@/lib/db/schema";
import { PriceDisplay } from "@/components/shared/price-display";
import { eq, sql } from "drizzle-orm";
import Link from "next/link";

export default async function AdminOverviewPage() {
  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(profiles);
  const [artistCount] = await db.select({ count: sql<number>`count(*)` }).from(artists);
  const [artworkCount] = await db.select({ count: sql<number>`count(*)` }).from(artworks);
  const [pendingArtists] = await db
    .select({ count: sql<number>`count(*)` })
    .from(artists)
    .where(eq(artists.isVerified, false));
  const [orderCount] = await db.select({ count: sql<number>`count(*)` }).from(orders);

  const recentOrders = await db
    .select({
      id: orders.id,
      status: orders.status,
      totalNpr: orders.totalNpr,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .orderBy(orders.createdAt)
    .limit(5);

  const statusColors: Record<string, string> = {
    pending: "text-secondary",
    confirmed: "text-primary",
    shipped: "text-primary",
    delivered: "text-primary",
    cancelled: "text-error",
  };

  return (
    <div className="space-y-8">
      <h1 className="text-headline-md text-on-surface">Admin Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Users", value: Number(userCount.count), href: "/dashboard/admin/users" },
          { label: "Artists", value: Number(artistCount.count), href: "/dashboard/admin/artists" },
          { label: "Artworks", value: Number(artworkCount.count), href: "/dashboard/admin/artworks" },
          { label: "Pending", value: Number(pendingArtists.count), href: "/dashboard/admin/artists" },
          { label: "Orders", value: Number(orderCount.count), href: "/dashboard/customer/orders" },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-surface-container-low p-6 rounded-sm hover:bg-surface-container transition-colors"
          >
            <p className="text-headline-md text-primary">{stat.value}</p>
            <p className="text-label-sm uppercase tracking-widest text-on-surface-variant mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-surface-container-low rounded-sm p-6">
        <h2 className="text-label-sm uppercase tracking-widest text-primary mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex justify-between items-center">
                <p className="text-body-md text-on-surface">#{order.id.slice(0, 8)}</p>
                <span className={`text-label-sm uppercase ${statusColors[order.status] ?? ""}`}>{order.status}</span>
                <p className="text-body-md text-primary"><PriceDisplay priceNpr={order.totalNpr} /></p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
