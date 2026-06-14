import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function GoldButton({ className, children, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        "gold-leaf-button px-10 py-4 h-auto rounded-full font-label-sm text-label-sm uppercase text-on-primary font-bold tracking-widest",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
