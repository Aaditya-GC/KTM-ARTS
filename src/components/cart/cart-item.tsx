import type { CartItem } from "@/hooks/use-cart";
import { PriceDisplay } from "@/components/shared/price-display";

interface CartItemProps {
  item: CartItem;
  onRemove: (artworkId: string) => void;
}

export function CartItemRow({ item, onRemove }: CartItemProps) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-outline-variant/10 last:border-b-0">
      <div className="w-20 h-20 shrink-0 bg-surface-container rounded-lg overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface-variant/30">image</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body-md font-medium text-on-surface line-clamp-1">{item.title}</p>
        <p className="text-label-sm text-on-surface-variant mt-0.5">{item.artistName}</p>
        <p className="text-body-md font-semibold text-primary mt-1.5"><PriceDisplay priceNpr={item.priceNpr} /></p>
      </div>
      <button
        onClick={() => onRemove(item.artworkId)}
        className="text-on-surface-variant hover:text-error transition-colors shrink-0 mt-0.5"
        aria-label="Remove item"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
}
