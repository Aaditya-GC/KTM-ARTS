import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function OutlineButton({ className, children, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        "border border-primary/40 bg-transparent text-primary hover:bg-primary/10 px-10 py-4 h-auto rounded-full font-label-sm text-label-sm uppercase font-bold tracking-widest",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
