import { db } from "@/lib/db";
import { orderItems, orders, artworks, profiles } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/roles";
import { eq, and, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { PriceDisplay } from "@/components/shared/price-display";

const statusColors: Record<string, string> = {
  pending: "bg-surface-variant text-on-surface-variant",
  paid: "bg-primary text-on-primary",
  shipped: "bg-accent text-accent-foreground",
  delivered: "bg-accent text-accent-foreground",
  cancelled: "bg-error/20 text-error",
};

export default async function ArtistOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const artistOrders = await db
    .select({
      orderId: orders.id,
      orderStatus: orders.status,
      orderTotal: orders.totalNpr,
      orderDate: orders.createdAt,
      shippingName: orders.shippingName,
      shippingAddress: orders.shippingAddress,
      artworkTitle: artworks.title,
      artworkSlug: artworks.slug,
      priceNpr: orderItems.priceNpr,
      customerName: profiles.fullName,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .innerJoin(artworks, eq(orderItems.artworkId, artworks.id))
    .innerJoin(profiles, eq(orders.customerId, profiles.id))
    .where(eq(artworks.artistId, user.id))
    .orderBy(desc(orders.createdAt));

  return (
    <div>
      <h1 className="text-headline-md text-on-surface mb-6">Orders Received</h1>

      {artistOrders.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-low border border-outline-variant rounded-sm">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">inbox</span>
          <p className="text-body-lg text-on-surface-variant mt-4">No orders received yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {artistOrders.map((order) => (
            <div
              key={order.orderId}
              className="bg-surface-container-low border border-outline-variant p-5 rounded-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-body-md text-on-surface truncate">{order.artworkTitle}</p>
                  <p className="text-label-sm text-on-surface-variant mt-1">
                    Customer: {order.customerName}
                  </p>
                  <p className="text-label-sm text-on-surface-variant">
                    <PriceDisplay priceNpr={order.priceNpr} />
                  </p>
                </div>
                <span className={`px-2 py-0.5 text-label-sm uppercase tracking-widest shrink-0 rounded-sm ${statusColors[order.orderStatus] || ""}`}>
                  {order.orderStatus}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-outline-variant/30">
                <p className="text-label-sm text-on-surface-variant">
                  Ship to: {order.shippingName}
                  {(order.shippingAddress as Record<string, string>)?.city ? `, ${(order.shippingAddress as Record<string, string>).city}` : ""}
                  {(order.shippingAddress as Record<string, string>)?.country ? `, ${(order.shippingAddress as Record<string, string>).country}` : ""}
                </p>
                <p className="text-label-sm text-on-surface-variant mt-0.5">
                  {new Date(order.orderDate).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
