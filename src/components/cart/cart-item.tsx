import type { CartItem } from "@/hooks/use-cart";

interface CartItemProps {
  item: CartItem;
  onRemove: (artworkId: string) => void;
}

export function CartItemRow({ item, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-outline-variant/10">
      <div className="w-20 h-20 shrink-0 bg-surface-container rounded-sm overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface-variant/30">image</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body-md text-on-surface truncate">{item.title}</p>
        <p className="text-label-sm text-on-surface-variant mt-0.5">{item.artistName}</p>
        <p className="text-body-md text-primary mt-1">NPR {item.priceNpr.toLocaleString()}</p>
      </div>
      <button onClick={() => onRemove(item.artworkId)} className="text-on-surface-variant hover:text-error transition-colors shrink-0">
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
}
