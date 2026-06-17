"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const cards = [
  {
    href: "/marketplace",
    icon: "store",
    title: "Browse Marketplace",
    description: "Discover Thangka & more",
  },
  {
    href: "/dashboard/customer/wishlist",
    icon: "favorite",
    title: "View Wishlist",
    description: "Your saved treasures",
  },
  {
    href: "/dashboard/customer/orders",
    icon: "receipt_long",
    title: "Order History",
    description: "Track past purchases",
  },
] as const;

export function QuickActionCards() {
  return (
    <div className="flex gap-6">
      {cards.map((card) => (
        <motion.div
          key={card.href}
          className="flex-1"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
        >
          <Link
            href={card.href}
            className="block bg-surface-container-low border border-outline-variant p-6 rounded-sm hover:bg-surface-container transition-colors h-full"
          >
            <span className="material-symbols-outlined text-primary text-3xl">
              {card.icon}
            </span>
            <p className="text-body-md text-on-surface font-semibold mt-2">
              {card.title}
            </p>
            <p className="text-label-sm text-on-surface-variant mt-1">
              {card.description}
            </p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
