import AuthGuard from '@/components/auth/AuthGuard';
import { Sidebar } from '@/components/sidebar';
import { BottomNav } from '@/components/nav/bottom-nav';

// Shell: icon rail on >=md, bottom nav on <md. This layout owns ALL page padding,
// pages must not add their own outer padding / min-h-screen / background.
export default function MainLayout({ children }) {
  return (
    <AuthGuard>
      <Sidebar />
      <main className="min-h-dvh p-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:px-6 sm:pt-6 md:pb-6 md:pl-[5.5rem]">
        {children}
      </main>
      <BottomNav />
    </AuthGuard>
  );
}
