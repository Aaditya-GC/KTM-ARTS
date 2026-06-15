import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function OutlineButton({ className, children, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        "border border-secondary bg-transparent text-secondary hover:bg-surface-dim px-10 py-4 h-auto rounded-sm font-label-sm text-label-sm uppercase font-bold tracking-widest",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
