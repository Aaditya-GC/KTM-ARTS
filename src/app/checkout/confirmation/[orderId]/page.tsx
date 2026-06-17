import { redirect } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/lib/checkout-actions";
import { GoldButton } from "@/components/shared/gold-button";
import { PriceDisplay } from "@/components/shared/price-display";

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function ConfirmationPage({ params }: Props) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order) redirect("/");

  const shippingAddress = order.shippingAddress as Record<string, string> | null;

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
        <span className="material-symbols-outlined text-4xl text-primary">check</span>
      </div>

      <h1 className="text-headline-lg text-on-surface mb-2">Order Confirmed!</h1>
      <p className="text-body-md text-on-surface-variant mb-2">
        Thank you for your purchase. Your order has been placed successfully.
      </p>
      <p className="text-label-sm text-on-surface-variant/60 mb-8">
        Order #{orderId.slice(0, 8).toUpperCase()}
      </p>

      <div className="bg-surface-container-low rounded-sm p-6 text-left space-y-4 mb-8">
        <h2 className="text-label-sm uppercase tracking-widest text-primary">Order Details</h2>

        <div className="space-y-3">
          {order.items?.map((item: { id: string; priceNpr: number }) => (
            <div key={item.id} className="flex justify-between text-body-md">
              <span className="text-on-surface">Artwork</span>
              <span className="text-on-surface-variant"><PriceDisplay priceNpr={item.priceNpr} /></span>
            </div>
          ))}
        </div>

        <div className="border-t border-outline-variant/20 pt-4 space-y-2">
          <h3 className="text-label-sm uppercase tracking-widest text-on-surface-variant/70">Shipping To</h3>
          <p className="text-body-md text-on-surface">{order.shippingName}</p>
          {shippingAddress && (
            <p className="text-body-md text-on-surface-variant">
              {shippingAddress.addressLine1}
              {shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ""}
              , {shippingAddress.city}
              , {shippingAddress.country}
            </p>
          )}
        </div>

        <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-center">
          <span className="text-body-md text-on-surface font-semibold">Total Paid</span>
          <span className="text-headline-md text-primary"><PriceDisplay priceNpr={order.totalNpr} /></span>
        </div>

        <p className="text-label-sm text-on-surface-variant/60 pt-2">
          Estimated delivery: 7-14 business days via local courier.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/marketplace">
          <GoldButton>Continue Shopping</GoldButton>
        </Link>
        <Link href="/dashboard/customer/orders">
          <GoldButton className="bg-surface-container-high text-on-surface hover:bg-surface-container-higher">View My Orders</GoldButton>
        </Link>
      </div>
    </div>
  );
}
