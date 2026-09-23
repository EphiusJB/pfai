import { BarChart3, Target, BookOpen, CreditCard } from "lucide-react";

// Single source of truth for primary navigation (used by the desktop rail and the mobile bottom nav).
export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/finance", label: "Finance", icon: CreditCard },
];
