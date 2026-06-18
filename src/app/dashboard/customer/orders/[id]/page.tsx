import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { orders, orderItems, artworks, artists, profiles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import { PriceDisplay } from "@/components/shared/price-display";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [order] = await db
    .select({
      id: orders.id,
      status: orders.status,
      totalNpr: orders.totalNpr,
      paymentMethod: orders.paymentMethod,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);
  if (!order) notFound();

  const items = await db
    .select({
      order_items: {
        id: orderItems.id,
        priceNpr: orderItems.priceNpr,
      },
      artworks: {
        id: artworks.id,
        title: artworks.title,
        images: artworks.images,
      },
      artists: {
        id: artists.id,
      },
      profiles: {
        fullName: profiles.fullName,
      },
    })
    .from(orderItems)
    .innerJoin(artworks, eq(orderItems.artworkId, artworks.id))
    .innerJoin(artists, eq(artworks.artistId, artists.id))
    .innerJoin(profiles, eq(artists.id, profiles.id))
    .where(eq(orderItems.orderId, id));

  const statusColors: Record<string, string> = {
    pending: "text-secondary",
    confirmed: "text-primary",
    shipped: "text-primary",
    delivered: "text-primary",
    cancelled: "text-error",
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/dashboard/customer/orders" className="text-label-sm text-primary hover:underline mb-4 inline-block">
        &larr; Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-headline-md text-on-surface">Order Details</h1>
        <span className={`text-label-sm uppercase tracking-widest ${statusColors[order.status] ?? ""}`}>
          {order.status}
        </span>
      </div>

      <div className="bg-surface-container-low p-6 rounded-sm space-y-3 mb-8">
        <div className="flex justify-between text-body-md">
          <span className="text-on-surface-variant">Order ID</span>
          <span className="text-on-surface">{order.id.slice(0, 8)}...</span>
        </div>
        <div className="flex justify-between text-body-md">
          <span className="text-on-surface-variant">Date</span>
          <span className="text-on-surface">{new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between text-body-md">
          <span className="text-on-surface-variant">Total</span>
           <span className="text-headline-md text-primary"><PriceDisplay priceNpr={order.totalNpr} /></span>
        </div>
        <div className="flex justify-between text-body-md">
          <span className="text-on-surface-variant">Payment</span>
          <span className="text-on-surface capitalize">{order.paymentMethod ?? "—"}</span>
        </div>
      </div>

      <h2 className="text-label-sm uppercase tracking-widest text-primary mb-4">Items</h2>
      <div className="space-y-4">
        {items.map(({ order_items, artworks, profiles }) => (
          <div key={order_items.id} className="flex items-center gap-4 bg-surface-container-low p-4 rounded-sm">
            <div className="w-16 h-16 bg-surface rounded-sm overflow-hidden shrink-0 relative">
              {artworks.images[0] ? (
                <Image src={artworks.images[0]} alt="" fill className="object-cover" sizes="64px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant/30">image</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-body-md text-on-surface">{artworks.title}</p>
              <p className="text-label-sm text-on-surface-variant">{profiles.fullName}</p>
            </div>
            <p className="text-body-md text-primary"><PriceDisplay priceNpr={order_items.priceNpr} /></p>
          </div>
        ))}
      </div>
    </div>
  );
}
