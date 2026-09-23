"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/components/nav/nav-items";
import { ProfileMenu, ProfileAvatar } from "@/components/nav/profile-menu";

// Desktop/tablet (>=md) icon rail. On mobile this is hidden and <BottomNav /> takes over.
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 z-40 hidden h-dvh w-16 flex-col items-center gap-8 border-r border-sidebar-border bg-sidebar py-6 md:flex">
      {/* Logo */}
      <Link
        href="/dashboard"
        aria-label="LifeOS home"
        className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Zap className="h-6 w-6" />
      </Link>

      {/* Navigation */}
      <nav aria-label="Primary" className="flex flex-1 flex-col gap-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group relative flex h-12 w-12 items-center justify-center rounded-lg transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/10"
              )}
            >
              <Icon className="h-5 w-5" />
              {/* Tooltip */}
              <div className="pointer-events-none absolute left-16 z-50 whitespace-nowrap rounded bg-card px-2 py-1 text-sm text-card-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Account */}
      <ProfileMenu
        side="right"
        className="flex h-12 w-12 items-center justify-center rounded-lg transition-colors hover:bg-sidebar-accent/30"
      >
        <ProfileAvatar className="h-8 w-8" />
      </ProfileMenu>
    </aside>
  );
}
