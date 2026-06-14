import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ViewModeBanner } from "@/components/layout/view-mode-banner";
import { Suspense } from "react";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <ViewModeBanner />
      </Suspense>
      <Navbar />
      <main className="pt-24">{children}</main>
      <Footer />
    </>
  );
}
