"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/AuthStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// The auth store currently keeps `profile` as the raw array returned by
// `.select("*").eq("id", ...)`. Accept both an array and a single object so this
// keeps working once the store is switched to `.single()`.
function useProfileInfo() {
  const user = useAuthStore((s) => s.user);
  const rawProfile = useAuthStore((s) => s.profile);
  const profile = Array.isArray(rawProfile) ? rawProfile[0] : rawProfile;
  const meta = user?.user_metadata ?? {};
  const name =
    profile?.name ||
    [meta.first_name, meta.last_name].filter(Boolean).join(" ") ||
    meta.full_name ||
    "";
  const email = profile?.email || user?.email || "";
  return { name, email, avatarUrl: profile?.avatar_url || "" };
}

export function ProfileAvatar({ className }) {
  const { name, email, avatarUrl } = useProfileInfo();
  const [broken, setBroken] = useState(false);
  const initials =
    (name || email || "?")
      .split(/\s+/)
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  if (avatarUrl && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt=""
        onError={() => setBroken(true)}
        className={cn("rounded object-cover", className)}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center rounded bg-primary/20 text-xs font-semibold text-primary",
        className
      )}
    >
      {initials}
    </span>
  );
}

/**
 * Avatar button that opens an account menu (name, email, sign out).
 * `children` is the visible trigger content; `className` styles the trigger button.
 */
export function ProfileMenu({ side = "right", className, children }) {
  const router = useRouter();
  const signOut = useAuthStore((s) => s.signOut);
  const { name, email } = useProfileInfo();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/sign-in");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label="Account menu" className={className}>
          {children}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align="end" sideOffset={8} className="min-w-52">
        {(name || email) && (
          <>
            <DropdownMenuLabel className="font-normal">
              {name && <p className="truncate text-sm font-medium">{name}</p>}
              {email && <p className="truncate text-xs text-muted-foreground">{email}</p>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem variant="destructive" onSelect={handleSignOut} className="py-2.5">
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
