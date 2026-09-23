'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/AuthStore';

export default function AuthGuard({ children }) {
  // const { user, loading } = useAuthStore();
  // const initialize = useAuthStore((s) => s.initialize);
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/sign-in');
    }
  }, [user, loading, router]);

  // Render a loading state while checking user session
  if (loading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Prevent flash of protected UI if user is not logged in
  if (!user && !loading) {
    return null;
  }

  return <>{children}</>;
}