"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Page title block with a primary action.
 * - >= sm: the action is a normal button on the right of the title.
 * - <  sm: the action becomes a floating "+" button above the bottom nav
 *          (render <FabSpacer /> at the end of the page so it never covers content).
 *
 * action = { label: string, icon?: LucideIcon, onClick: () => void }
 */
export function PageHeader({ title, description, action, compact = false, className }) {
  const Icon = action?.icon;

  return (
    <div className={cn("mb-6 flex items-start justify-between gap-4 sm:mb-8", className)}>
      <div className="min-w-0">
        <h1
          className={cn(
            "font-bold tracking-tight text-foreground",
            compact ? "text-2xl" : "text-2xl sm:text-4xl"
          )}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">{description}</p>
        )}
      </div>

      {action && (
        <>
          <Button onClick={action.onClick} className="hidden shrink-0 gap-2 sm:inline-flex">
            {Icon && <Icon className="h-4 w-4" />}
            {action.label}
          </Button>
          <Button
            onClick={action.onClick}
            aria-label={action.label}
            className="fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-30 size-14 rounded-full p-0 shadow-lg shadow-black/40 sm:hidden"
          >
            {Icon && <Icon className="size-6" />}
          </Button>
        </>
      )}
    </div>
  );
}

/** Extra scroll room so the floating action button never covers the last item on mobile. */
export function FabSpacer() {
  return <div aria-hidden="true" className="h-16 sm:hidden" />;
}
