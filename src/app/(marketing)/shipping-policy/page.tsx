import { PolicyLayout } from "@/components/shared/policy-layout";

export default function ShippingPolicyPage() {
  const sections = [
    {
      title: "Processing Time",
      body: "All orders are processed within 48 hours of payment confirmation. Orders placed on weekends or Nepali public holidays will be processed on the next business day. Once your order has been processed, a tracking number will be sent to your email.",
    },
    {
      title: "Shipping Methods",
      body: "We ship using DHL, FedEx, or local courier services depending on the destination and size of the artwork. We select the most reliable carrier for each shipment to ensure your Thangka arrives safely.",
    },
    {
      title: "Shipping Destinations",
      body: "We offer worldwide shipping. No matter where you are located, we can deliver our authentic Thangka paintings to your doorstep.",
    },
    {
      title: "Shipping Costs",
      body: "Free worldwide shipping is available on all orders above NPR 15,000. For smaller orders, the exact shipping cost will be calculated and displayed at checkout before you complete your purchase.",
    },
    {
      title: "Customs & Import Duties",
      body: "All Thangka paintings are shipped from Kathmandu, Nepal. Depending on your country's customs regulations, your order may be subject to import duties, taxes, or customs clearance fees. These charges are the responsibility of the customer and are not included in the purchase price or shipping cost.",
    },
    {
      title: "Delivery Times",
      body: "International orders typically arrive within 5 to 10 business days after dispatch. For deliveries within Nepal, you can expect your order within 1 to 3 business days.",
    },
    {
      title: "Order Tracking",
      body: "Once your order has been dispatched, you will receive a tracking number via email. You can use this number to monitor your shipment's progress.",
    },
    {
      title: "Lost or Damaged Shipments",
      body: <>If your order is lost or arrives damaged, please contact us at <a href="mailto:hello@kathmanduarts.com" className="text-accent hover:underline">hello@kathmanduarts.com</a> within 48 hours of the expected delivery or receipt. Include your order number and photographs of any damage so we can assist you promptly.</>,
    },
    {
      title: "Address Accuracy",
      body: <>Please ensure that your shipping address is correct before placing your order. If you need to change your address after the order has been placed, contact us immediately at <a href="mailto:hello@kathmanduarts.com" className="text-accent hover:underline">hello@kathmanduarts.com</a>, and we will do our best to update it before dispatch.</>,
    },
  ];

  return (
    <PolicyLayout
      title="Shipping Policy"
      lastUpdated="June 2026"
      sections={sections}
    />
  );
}
