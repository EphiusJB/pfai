import Link from "next/link";
import { Zap } from "lucide-react";

export const metadata = {
  title: "LifeOS — Sign in",
  description: "Sign in to your LifeOS dashboard",
};

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-dvh flex flex-col lg:flex-row">

      {/* ── Right: form column ── */}
      <div className="flex-1 flex flex-col min-h-dvh lg:min-h-0 bg-[var(--color-bg)]">

        {/* Mobile top bar */}
        <div className="flex items-center justify-between px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-[16px] font-bold" style={{ color: "var(--color-text-secondary)" }}>
              LiOS
            </span>
          </Link>
          <Link href="/" className="text-[13px] font-medium" style={{ color: "var(--color-text-secondary)" }}>
            Back to home
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-4 py-6 sm:px-5 sm:py-10 md:py-16">
          <div className="w-full max-w-[400px]">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-center sm:px-6">
          <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
            © {new Date().getFullYear()} LifeOS · <a href="#" className="hover:underline">Privacy</a> · <a href="#" className="hover:underline">Terms</a>
          </p>
        </div>
      </div>
    </div>
  );
}
