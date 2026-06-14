import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeader({ eyebrow, title, description, align = "left" }: SectionHeaderProps) {
  return (
    <div className={cn("space-y-2", align === "center" && "text-center")}>
      {eyebrow && (
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-px bg-primary" />
          <span className="text-label-sm uppercase tracking-widest text-primary font-bold">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-headline-lg text-on-background">{title}</h2>
      {description && (
        <p className="text-body-lg text-on-surface-variant italic max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
