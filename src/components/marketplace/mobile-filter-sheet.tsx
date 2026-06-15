"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FilterSidebar } from "@/components/marketplace/filter-sidebar";

export function MobileFilterSheet() {
  return (
    <div className="fixed bottom-6 right-6 z-40 lg:hidden">
      <Sheet>
        <SheetTrigger className="gold-leaf-button w-14 h-14 rounded-full flex items-center justify-center shadow-lg">
          <span className="material-symbols-outlined">tune</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-sm overflow-y-auto bg-background">
          <div className="pt-4">
            <FilterSidebar className="relative sticky top-0" />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
