import type { ReactNode } from "react";
import Link from "next/link";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-outline-variant/20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 flex items-center justify-between">
          <Link href="/" className="text-headline-md text-primary tracking-widest uppercase font-bold">
            Kathmandu Arts
          </Link>
        </div>
      </header>
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
        {children}
      </main>
    </div>
  );
}
