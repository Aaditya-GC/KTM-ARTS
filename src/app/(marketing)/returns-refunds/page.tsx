import { PolicyLayout } from "@/components/shared/policy-layout";

export default function ReturnsRefundsPage() {
  const sections = [
    {
      title: "Our Policy",
      body: "We want you to be fully satisfied with every Thangka painting you purchase from Kathmandu Arts. If something is not right, we are here to help.",
    },
    {
      title: "Damaged or Incorrect Items",
      body: <>If your item arrives damaged or does not match the description on our site, you are eligible for a free return and a full refund. Please notify us within 48 hours of delivery by emailing <a href="mailto:hello@kathmanduarts.com" className="text-accent hover:underline">hello@kathmanduarts.com</a> with your order number and photographs of the issue. We will arrange the return and cover all shipping costs.</>,
    },
    {
      title: "Change of Mind Returns",
      body: "We accept returns for change of mind within 48 hours of delivery. The item must be unused and in its original packaging. The customer is responsible for return shipping costs. Once the returned item is received and inspected, we will process your refund.",
    },
    {
      title: "How to Initiate a Return",
      body: <>To start a return, send an email to <a href="mailto:hello@kathmanduarts.com" className="text-accent hover:underline">hello@kathmanduarts.com</a> with your order number, a brief description of the issue, and photographs if applicable. Our team will provide you with return instructions and the shipping address.</>,
    },
    {
      title: "Refund Processing",
      body: "Refunds are processed within 2 to 5 business days after we receive and inspect the returned item. The refund will be issued to your original payment method. Depending on your bank or payment provider, it may take additional time to appear in your account.",
    },
    {
      title: "Non-Returnable Items",
      body: "Commissioned or customized artworks cannot be returned unless they arrive damaged or do not match the agreed specifications. Please review all details before commissioning a piece.",
    },
    {
      title: "Exchanges",
      body: "We do not offer direct exchanges. If you would like a different artwork, please return your item using the process above and place a new order on our site.",
    },
    {
      title: "Contact",
      body: <>For any questions about returns or refunds, please email <a href="mailto:hello@kathmanduarts.com" className="text-accent hover:underline">hello@kathmanduarts.com</a> and we will get back to you promptly.</>,
    },
  ];

  return (
    <PolicyLayout
      title="Returns & Refunds"
      lastUpdated="June 2026"
      sections={sections}
    />
  );
}
