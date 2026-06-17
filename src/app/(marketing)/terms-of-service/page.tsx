import { PolicyLayout } from "@/components/shared/policy-layout";

export default function TermsOfServicePage() {
  const sections = [
    {
      title: "Acceptance of Terms",
      body: "By accessing or using the Kathmandu Arts website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not use our site or services.",
    },
    {
      title: "Use of the Site",
      body: "This site is intended for personal, non-commercial use only. You may not scrape, reproduce, distribute, or exploit any content from this site for commercial purposes without our prior written consent.",
    },
    {
      title: "Product Descriptions",
      body: "We make every effort to display our Thangka paintings and artworks accurately. Colors and details may vary slightly from what you see on your screen due to differences in display settings. We cannot guarantee that your monitor's representation is perfectly accurate.",
    },
    {
      title: "Pricing",
      body: "All prices on our website are listed in Nepalese Rupees (NPR) unless stated otherwise. We reserve the right to change prices at any time without prior notice. The price at the time of your order will be honored.",
    },
    {
      title: "Orders & Payment",
      body: "Orders are confirmed once payment has been successfully received. We reserve the right to cancel or refuse any order in cases of pricing errors, suspected fraud, or violations of these terms. In such cases, a full refund will be issued.",
    },
    {
      title: "Intellectual Property",
      body: "All artwork images, text, logos, and other content on this site are the property of Kathmandu Arts or the respective artists. Reproduction, distribution, or unauthorized use of any content is strictly prohibited without explicit written permission.",
    },
    {
      title: "Limitation of Liability",
      body: "Kathmandu Arts shall not be held liable for any indirect, incidental, or consequential damages arising out of the use or inability to use our site or the purchase of any products, to the fullest extent permitted by applicable law.",
    },
    {
      title: "Governing Law",
      body: "These terms are governed by and construed in accordance with the laws of Nepal. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Nepal.",
    },
    {
      title: "Changes to Terms",
      body: "We may update these Terms of Service at any time. Changes will be posted on this page with an updated 'Last updated' date. Continued use of the site after changes are posted constitutes your acceptance of the new terms.",
    },
    {
      title: "Contact",
      body: <>If you have any questions about these terms, please reach out to us at <a href="mailto:hello@kathmanduarts.com" className="text-accent hover:underline">hello@kathmanduarts.com</a>.</>,
    },
  ];

  return (
    <PolicyLayout
      title="Terms of Service"
      lastUpdated="June 2026"
      sections={sections}
    />
  );
}
