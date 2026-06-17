import { PolicyLayout } from "@/components/shared/policy-layout";

export default function PrivacyPolicyPage() {
  const email = "hello@kathmanduarts.com";

  const sections = [
    {
      title: "What Information We Collect",
      body: "When you make a purchase or browse our site, we collect information such as your name, email address, shipping address, phone number, and IP address. This information is necessary to process your orders and improve your experience on our platform.",
    },
    {
      title: "How We Use Your Information",
      body: "We use the information we collect to process and fulfill your orders, send order updates and shipping confirmations, respond to your inquiries, and improve the functionality and content of our website.",
    },
    {
      title: "Consent",
      body: <>By providing your personal information to complete a purchase, you consent to our collection and use of your data for that specific purpose. If you wish to withdraw your consent at any time, please contact us at <a href={`mailto:${email}`} className="text-accent hover:underline">{email}</a>.</>,
    },
    {
      title: "Data Storage",
      body: "Your data is stored securely via Supabase, our database provider, with encrypted connections in transit and at rest. We take reasonable precautions to protect your personal information from unauthorized access, alteration, or disclosure.",
    },
    {
      title: "Third Party Services",
      body: "We use third party payment processors including Stripe, Khalti, and eSewa to handle payments. Each of these services has its own privacy policy governing the use of your payment information. We do not store your payment card or banking details on our servers.",
    },
    {
      title: "Cookies",
      body: "We use session cookies strictly for cart functionality and authentication purposes. These cookies are temporary and expire when you close your browser. We do not use tracking or advertising cookies.",
    },
    {
      title: "Your Rights",
      body: <>You have the right to access, correct, or request deletion of the personal data we hold about you at any time. To exercise these rights, please send your request to <a href={`mailto:${email}`} className="text-accent hover:underline">{email}</a>, and we will respond within a reasonable timeframe.</>,
    },
    {
      title: "Changes to This Policy",
      body: "We may update this privacy policy periodically to reflect changes in our practices or for legal reasons. Any updates will be posted on this page, and the 'Last updated' date will be revised accordingly.",
    },
    {
      title: "Contact",
      body: <>If you have any questions about this privacy policy or how your data is handled, please reach out to us at <a href={`mailto:${email}`} className="text-accent hover:underline">{email}</a>.</>,
    },
  ];

  return (
    <PolicyLayout
      title="Privacy Policy"
      lastUpdated="June 2026"
      sections={sections}
    />
  );
}
