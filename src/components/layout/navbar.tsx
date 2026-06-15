import Link from "next/link";
import { CartButton } from "@/components/layout/cart-button";
import { SearchButton } from "@/components/layout/search-button";
import { UserMenu } from "@/components/layout/user-menu";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { getCurrentUser } from "@/lib/auth/roles";

const navLinks = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/artists", label: "Artists" },
  { href: "/commissions", label: "Commissions" },
  { href: "/knowledge-hub", label: "Knowledge Hub" },
];

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="fixed top-9 z-50 w-full bg-background border-b border-outline">
      <nav className="flex items-center justify-between max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-unit relative">
        <Link href="/" className="font-headline-lg text-primary tracking-widest uppercase font-bold text-2xl">
          Kathmandu Arts
        </Link>

        <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 gap-8 lg:gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-label-sm uppercase tracking-widest text-on-surface hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-0 sm:space-x-3 md:space-x-6">
          <SearchButton />
          <CartButton />
          <UserMenu user={user} />
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
