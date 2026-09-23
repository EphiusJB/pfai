"use client";

import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Edit / delete controls for a list row.
 * - >= sm: inline icon buttons (optionally revealed on hover for mouse users only,
 *          the parent must have the `group` class).
 * - <  sm: a single "more" button with a menu, so tap targets stay large.
 */
export function RowActions({ label = "item", onEdit, onDelete, revealOnHover = false }) {
  return (
    <>
      <div
        className={cn(
          "hidden shrink-0 items-center gap-1 sm:flex",
          revealOnHover &&
            "hoverable:opacity-0 hoverable:transition-opacity hoverable:group-hover:opacity-100 hoverable:group-focus-within:opacity-100"
        )}
      >
        {onEdit && (
          <Button variant="ghost" size="icon-sm" aria-label={`Edit ${label}`} onClick={onEdit}>
            <Edit />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${label}`}
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 />
          </Button>
        )}
      </div>

      <div className="shrink-0 sm:hidden">
        {/* modal={false}: avoids Radix leaving the page un-tappable when a dialog opens from a menu item */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-10" aria-label={`Actions for ${label}`}>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onSelect={onEdit} className="py-2.5">
                <Edit /> Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem variant="destructive" onSelect={onDelete} className="py-2.5">
                <Trash2 /> Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
