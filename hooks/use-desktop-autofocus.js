import { useEffect } from "react";

/**
 * Focus an input on mount only for mouse/keyboard devices.
 * On phones/tablets, autofocus immediately opens the on-screen keyboard and covers the form.
 */
export function useDesktopAutofocus(ref, active = true) {
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      ref.current?.focus();
    }
  }, [ref, active]);
}
