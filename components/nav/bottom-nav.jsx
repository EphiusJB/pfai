"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/components/nav/nav-items";
import { ProfileMenu, ProfileAvatar } from "@/components/nav/profile-menu";

// Mobile-only (<md) replacement for the icon rail. Same visual language:
// the active destination is a filled primary rounded-lg, like the rail.
const cellClass =
  "flex h-full w-full flex-col items-center justify-center gap-0.5 text-[11px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/60 rounded-lg";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-sidebar-border bg-sidebar/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto grid h-16 max-w-lg grid-cols-5 px-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(cellClass, active ? "text-foreground" : "text-muted-foreground")}
              >
                <span
                  className={cn(
                    "flex h-8 w-14 items-center justify-center rounded-lg transition-colors",
                    active ? "bg-primary text-primary-foreground" : "text-sidebar-foreground/70"
                  )}
                >
                  <Icon className="size-5" />
                </span>
                {/* Hide labels on short (landscape phone) screens to save height */}
                <span className="[@media(max-height:480px)]:hidden">{label}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <ProfileMenu side="top" className={cn(cellClass, "text-muted-foreground")}>
            <span className="flex h-8 w-14 items-center justify-center rounded-lg">
              <ProfileAvatar className="size-7" />
            </span>
            <span className="[@media(max-height:480px)]:hidden">You</span>
          </ProfileMenu>
        </li>
      </ul>
    </nav>
  );
}
