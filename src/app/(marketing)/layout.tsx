import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ViewModeBanner } from "@/components/layout/view-mode-banner";
import { Suspense } from "react";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] h-9 bg-secondary text-on-secondary text-xs tracking-wide flex items-center px-4 md:px-margin-desktop">
        <div className="flex items-center justify-between w-full max-w-container-max mx-auto">
          <div className="hidden md:flex items-center gap-2">
            <Link href="/knowledge-hub" className="hover:text-tertiary transition-colors duration-150">About Us</Link>
            <span className="text-on-secondary/30">|</span>
            <Link href="/commissions" className="hover:text-tertiary transition-colors duration-150">Wholesale</Link>
          </div>
          <span className="font-medium uppercase tracking-wide text-center w-full md:w-auto">SUMMER SALE: UP TO 60% OFF STOREWIDE</span>
          <div className="hidden md:flex items-center gap-2">
            <Link href="/#testimonials" className="hover:text-tertiary transition-colors duration-150">Customer Reviews</Link>
            <span className="text-on-secondary/30">|</span>
            <Link href="/commissions" className="hover:text-tertiary transition-colors duration-150">Contact Us</Link>
          </div>
        </div>
      </div>
      <Suspense fallback={null}>
        <ViewModeBanner />
      </Suspense>
      <Navbar />
      <main className="pt-[132px]">{children}</main>
      <Footer />
    </>
  );
}
