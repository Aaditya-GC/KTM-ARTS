import Link from "next/link";
import { CartButton } from "@/components/layout/cart-button";
import { UserMenu } from "@/components/layout/user-menu";
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
    <header className="fixed top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-outline-variant/20">
      <nav className="flex items-center justify-between max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-unit">
        <Link href="/" className="font-headline-lg text-primary tracking-widest uppercase font-bold text-headline-md">
          Kathmandu Arts
        </Link>

        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-6">
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">search</span>
          </button>
          <CartButton />
          <UserMenu user={user} />
          <button className="md:hidden text-on-surface-variant">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
