import Link from "next/link";
import Image from "next/image";
import { CartButton } from "@/components/layout/cart-button";
import { SearchButton } from "@/components/layout/search-button";
import { UserMenu } from "@/components/layout/user-menu";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { CurrencySwitcher } from "@/components/layout/currency-switcher";
import { MarketplaceDropdown } from "@/components/layout/marketplace-dropdown";
import { getCurrentUser } from "@/lib/auth/roles";
import mylogo from "./mylogo.png";

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
      <div className="relative flex items-center px-margin-mobile md:px-margin-desktop py-unit max-w-container-max mx-auto">
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/" className="flex items-center gap-3 md:-ml-4">
            <Image src={mylogo} alt="Kathmandu Arts" className="object-contain" width={48} height={48} priority />
            <span className="font-headline-lg text-primary tracking-widest uppercase font-bold text-xs">
              Kathmandu Arts
            </span>
          </Link>
        </div>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 lg:gap-10">
          <MarketplaceDropdown />
          {navLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-label-sm uppercase tracking-widest text-on-surface hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <SearchButton />
          <CartButton />
          <UserMenu user={user} />
          <CurrencySwitcher />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
